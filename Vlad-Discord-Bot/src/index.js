require("dotenv").config();
const { joinVoiceChannel,  } = require("@discordjs/voice");
const {
  Client,
  GatewayIntentBits,
  GuildDefaultMessageNotifications
} = require("discord.js");
const { ConstantFlowAgreementV1 } = require("@superfluid-finance/sdk-core");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers, Wallet, providers } = require("ethers");
const { customHttpProvider } = require("./config");
const { connect } = require("@tableland/sdk");
const fetch = require("node-fetch");
const { tableNames } = require("./tables");
require('dotenv').config();
globalThis.fetch = fetch;

let EVENT_ID = "",
  VC_NAME = "",
  // CC_NAME = "",
  // CC_CHANNEL_ID = "",
  USERNAME_META_MAPPING = new Map(),
  CHANNEL_ID = "",
  ORG_META_ADDRESS = "",
  SERVER_ID = "",
  FDAIX_SUPER_TOKEN = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f", // polygon mumbai address
  BOT_NAME = "Vlad_FlexiPay"; // need to change this shitty little name

var sf, signer, alchemySigner, tableLand, monitorCaller;

(async () => {
  sf = await Framework.create({
    chainId: 80001,
    provider: customHttpProvider,
  });

  const privateKey =
    process.env.PRIVATE_KEY;
  const wallet = new Wallet(privateKey);

  const provider = new providers.AlchemyProvider(
    "maticmum",
    process.env.QUICKNODE_KEY
  );
  alchemySigner = wallet.connect(provider);
  tableLand = await connect({
    alchemySigner,
    network: "testnet",
    chain: "polygon-mumbai",
  });
  console.log("tableland connected...");
  signer = sf.createSigner({
    privateKey: privateKey,
    provider: customHttpProvider,
  });
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
  fetchAllMembers:true
});

const alchemyToEventNode = (events) => {
  let newEvents = {
    columns: [],
    rows: [],
  }

  for(var prop in events) {
    let newEvent = [];
    if(Object.prototype.hasOwnProperty.call(events, prop)) {
      // let sortedEvent = sortObjectByKeys(events[prop]);
      if(newEvents.columns.length === 0) {
        newEvents.columns = Object.keys(events[prop]);
      }
      newEvent = Object.values(events[prop]);
      newEvents.rows.push(newEvent);
    }
  }
  return newEvents;
} 


// when client is ready this will run but only once
client.on("ready", () => {
  console.log("Janitor is ready to guard VCs");
});

// event user table: _80001_1890
// event org meta table: _80001_1891
// user meta table: _80001_1892

const getEventAttendeeData = async () => {
  try {
    console.log("start waiting...");
    console.log("event id ", EVENT_ID);
    // not using below query for now
    // const GET_EVENT_ATTENDEE_QUERY = `SELECT username FROM _80001_1890 WHERE event_id = '${EVENT_ID}'`;
    const GET_USER_META_ADDRESS_QUERY = `SELECT * FROM ${tableNames.USER_META_ADDRESS}`;
    const GET_ORG_META_ADDRESS = `SELECT org_meta_address FROM ${tableNames.EVENT_ORG_ADDRESS} WHERE event_id = '${EVENT_ID}'`;
    console.log("query ", GET_USER_META_ADDRESS_QUERY);
    let usernameToUserMeta = await tableLand.read(
      GET_USER_META_ADDRESS_QUERY
    );
    usernameToUserMeta = alchemyToEventNode(usernameToUserMeta);
    console.log(" this is response ", usernameToUserMeta);
    let orgMetaAddress = await tableLand.read(GET_ORG_META_ADDRESS);
    orgMetaAddress = alchemyToEventNode(orgMetaAddress);
    console.log(" this is org meta address ", orgMetaAddress);
    usernameToUserMeta.rows.map((user) => {
      USERNAME_META_MAPPING.set(user[1], user[0]);
    });
    console.log(" this is organization metaaddress ", orgMetaAddress);
    console.log(usernameToUserMeta);
    ORG_META_ADDRESS =
      orgMetaAddress.rows[0][0] ||
      "0xD649267Da6C1554CE62c8790Ff6C465aF108a167";
    console.log(" this is org address ", ORG_META_ADDRESS);
  } catch (err) {
    console.log(err.message);
  }
};

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  // command format !init eventInfo {eventId} {vc-name} {criminal-channel-name}
  // message.content.startsWith( "\leave")
  let prefix = "!init";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  VC_NAME = args[2];
  EVENT_ID = args[1];
  message.guild.channels.cache.map((data) => {
    if (data.name === VC_NAME) {
      CHANNEL_ID = data.id;
      SERVER_ID = data.guildId;
    }
  });
  getEventAttendeeData();
  message.reply("Bot initialized successfully");
});

const checkFlowRate = async (username) => {
  try {
    if(username == BOT_NAME) return true;
    console.log(" this is username ", username)
    console.log(" this is mapping ", USERNAME_META_MAPPING)
    const userMetaAddress = USERNAME_META_MAPPING.get(username);
    console.log(" this is usermeta address ", userMetaAddress);
    // once everything in place below checks will be enabled
    if (userMetaAddress) {
      let checkStream = await sf.cfaV1.getFlow({
        superToken: FDAIX_SUPER_TOKEN,
        sender: userMetaAddress,
        receiver: ORG_META_ADDRESS,
        providerOrSigner: signer,
      });
      console.log(" this is check stream output ", checkStream);
      if (checkStream.flowRate != 0) {
        return true;
      } else return false;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

const monitorUsers = async () => {
  try {
    const guild = client.guilds.cache.get(SERVER_ID);
    guild.members.fetch().then(members => {
        members.forEach(async member => {
          console.log(" this is user voice channel ", member.voice.channelId);
          if(member.voice.channelId === CHANNEL_ID) {
            let isUserAppropriateFlow = await checkFlowRate(member.user.username);
            if (!isUserAppropriateFlow) {  
              member.voice.disconnect();
            }
          }
        });
      })
  } catch (err) {
    console.log("this is error ", err);
  }
};

let timeDuration = 5000;
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName } = interaction;
  if (commandName == "start-monitoring") {
    timeDuration = 5000;
    monitorCaller = setInterval(() => monitorUsers(), timeDuration);
    await interaction.reply("Started monitoring streams for the event !!");
  } else if (commandName == "stop-monitoring") {
    timeDuration = 1000000000000000000;
    clearTimeout(monitorCaller);
    await interaction.reply("Stopped monitoring streams for the event !!");
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);