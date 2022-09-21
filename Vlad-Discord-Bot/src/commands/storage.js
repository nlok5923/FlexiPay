require('dotenv').config();
const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, GatewayIntentBits, ConnectionVisibility } = require('discord.js') 
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { ConstantFlowAgreementV1 } = require("@superfluid-finance/sdk-core");
const { Framework } = require("@superfluid-finance/sdk-core")
const { ethers, Wallet, providers } = require("ethers");
const { customHttpProvider } = require("./config");
const { connect } = require("@tableland/sdk");
const { Buffer } = require('buffer');
const fetch = require('node-fetch');
globalThis.fetch = fetch;

let EVENT_ID = "", VC_NAME = "", USERNAME_META_MAPPING = new Map(), CHANNEL_ID = "", ORG_META_ADDRESS = "";

var sf, signer, alchemySigner, tableLand;

(async () => {
    sf = await Framework.create({
        chainId: 5,
        provider: customHttpProvider
      });

    const privateKey = "2999e4ada1397ed384770e9fd58ad9b41ebffb248f89c8182403f82c48aeae9e";
    const wallet = new Wallet(privateKey);
    
    const provider = new providers.AlchemyProvider("maticmum", "Vu-mYa0_74IeUxbkODAJquwZsdnDCQM8");
    alchemySigner = wallet.connect(provider);
    tableLand = await connect({ alchemySigner, network: "testnet", chain: "polygon-mumbai" });
    console.log(" tableland connected...");
    signer = sf.createSigner({
        privateKey:
          "2999e4ada1397ed384770e9fd58ad9b41ebffb248f89c8182403f82c48aeae9e",
        provider: customHttpProvider
    });
})() 


//! Also make the bot leave once the event is over via admin
//! bot needs to fetch the flow rate from tableland so we need to store flowrate in table land as well

// test stream address
// - sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
// - receiver: 0xa29c2E7B14C6503212f86d3CAb94905b09b25462

const userNameAddressMapping = {
    "username": "0xa29c2E7B14C6503212f86d3CAb94905b09b25462"
};

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

var cfaV1;
const config = {
    hostAddress: "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9",
    cfaV1Address: "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8",
    idaV1Address: "0xB0aABBA4B2783A72C52956CDEF62d438ecA2d7a1"
  };
console.log(" this is config ", config); 
cfaV1 = new ConstantFlowAgreementV1({ config });
// when client is ready this will run but only once 
client.on('ready', () => {
	console.log('Janitor is ready to guard VCs');
});

  // const createTables = async () => {
  //   const { name } = await tableLandState.create(
  //     `event_id text, username text, name text` ,
  //     `event_user` 
  //   )

  //   console.log("event_user table name ", name);

  //   console.log("creating event_org_meta table...");
  //   const { name: name2 } = await tableLandState.create(
  //     `event_id text, org_meta_address text`,
  //     `event_org_meta`
  //   )

  //   console.log("event_org_meta table name ", name2);

  //   const { name: name3 } = await tableLandState.create(
  //     `username text, user_meta_address text, primary key (username)`,
  //     `user_meta`
  //   )

  //   console.log("user_meta table name ", name3);
  // }

  // event user table: _80001_1890
  // event org meta table: _80001_1891
  // user meta table: _80001_1892

const getEventAttendeeData = async () => {
    try {
        console.log("start waiting...");
        console.log("event id ", EVENT_ID);
        // not using below query for now 
        // const GET_EVENT_ATTENDEE_QUERY = `SELECT username FROM _80001_1890 WHERE event_id = '${EVENT_ID}'`;
        const GET_USER_META_ADDRESS_QUERY = `SELECT * FROM _80001_1892`;
        const GET_ORG_META_ADDRESS =  `SELECT org_meta_address FROM _80001_1891 WHERE event_id = '${EVENT_ID}'`;
        console.log("query ", GET_USER_META_ADDRESS_QUERY);
        const usernameToUserMeta = await tableLand.read(GET_USER_META_ADDRESS_QUERY);
        const orgMetaAddress = await tableLand.read(GET_ORG_META_ADDRESS);
        usernameToUserMeta.rows.map((user) => {
            USERNAME_META_MAPPING.set(user.username, user.user_meta_address);
        })
        console.log(" this is organization metaaddress ", orgMetaAddress);
        console.log(usernameToUserMeta);
        ORG_META_ADDRESS = orgMetaAddress.rows[0].org_meta_address || "0xD649267Da6C1554CE62c8790Ff6C465aF108a167";
    } catch (err) {
        console.log(err.message);
    }
}

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    // command format !init eventInfo {eventId} {vc-name}
    let prefix = "!init";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    VC_NAME = args[2];
    EVENT_ID = args[1];
    //! Once bot is initialize drop a message that bot initialized successfully
    message.guild.channels.cache.map((data) => {
        if(data.name === VC_NAME) {
            CHANNEL_ID = data.id;
        }
    })
    getEventAttendeeData();
})

const monitorUsers = async (client) => {
    // console.log(" this is called every second");
    try {
        let checkStream = await sf.cfaV1.getFlow({
            superToken: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
            sender: "0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721",
            receiver: "0xa29c2E7B14C6503212f86d3CAb94905b09b25462",
            providerOrSigner: signer
          });

          const channel = client.channels.cache.get("1013028793541206130"); // get channel
          channel.members.map(member => {
            // member.user.username  to access username
            // if(checkUserFlowRate(member.user.username)) {
                if(member.user.username === "Nitanshu Lokhande") {
                    member.voice.disconnect()
                }
            // }
            // console.log("from channel", member.user.name);
          }); // get all members and map them by they're username


        // below is second approach and above is first approach
        const members = client.guilds.cache.get("1013028793541206126"); 

        // members.members.cache.forEach(member => {
        //     // if (member.roles.has(role)) {
        //     //     kicked.push(member)
        //     //     member.kick({
        //     //         reason: kickReason
        //     //     })
        //     // }
        //         member.voice.disconnect()

        //     console.log("this is member username", member.user.username);

        //     // console.log("this is another shit member ", member);
        // })
    } catch(err) {
        console.log("this is error ", err)
    }
}

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return
    const { commandName } = interaction
    // if(commandName == 'ping') {
    //         const modal = new ModalBuilder()
    //             .setCustomId('myModal')
    //             .setTitle('My Modal');
    
    //         // Add components to modal
    
    //         // Create the text input components
    //         const favoriteColorInput = new TextInputBuilder()
    //             .setCustomId('favoriteColorInput')
    //             // The label is the prompt the user sees for this input
    //             .setLabel("What's your favorite color?")
    //             // Short means only a single line of text
    //             .setStyle(TextInputStyle.Short);
    
    //         const hobbiesInput = new TextInputBuilder()
    //             .setCustomId('hobbiesInput')
    //             .setLabel("What's some of your favorite hobbies?")
    //             // Paragraph means multiple lines of text.
    //             .setStyle(TextInputStyle.Paragraph);
    
    //         // An action row only holds one text input,
    //         // so you need one action row per text input.
    //         const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
    //         const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
    
    //         // Add inputs to the modal
    //         modal.addComponents(firstActionRow, secondActionRow);
    
    //         // Show the modal to the user
    //         await interaction.showModal(modal);

    //         // const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
    //         // const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
    //         // console.log("input received", { favoriteColor, hobbies });
    // } else if(commandName == 'server') {
        // let user = await (await client.users.fetch(shitUserId)).voice.disconnect()
        // user.voice.disconnect();
        // await interaction.reply('Disconnected user');

        //need to kick this user 592216222154620938
        const members = client.guilds.cache.get("1013028793541206126"); 

        members.members.cache.forEach(member => {
            // if (member.roles.has(role)) {
            //     kicked.push(member)
            //     member.kick({
            //         reason: kickReason
            //     })
            // }

            if(member.user.username === 'ash_ph0en1x') {
                // member.kick({
                //     reason: "Nikal"
                // })
                console.log(" this is called ");
                console.log(member)
                member.voice.disconnect()
                // member.disconnect()
            }

            console.log(member.user.username);

            // console.log("this is another shit member ", member);
        })

    //     let readRes = await tableLand.read(`SELECT username from _80001_1774 WHERE event_id = '5923';`);
    //     console.log("event_user table content", readRes);

    // } else 
    
    if(commandName == 'user') {
        console.log("!listing all discord users !!");
        const members = client.guilds.cache.get("1013028793541206126"); 
        members.members.cache.forEach(member => console.log(" this is member channels ", member.voice.channelId + " " + member.user.username));
    } else if(commandName == 'join') {
        const voiceChannel = interaction.options.getChannel(CHANNEL_ID)
        console.log(" this is channel id ", CHANNEL_ID);
        const voiceConnection = joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });
        await interaction.reply('Joined VC will start monitoring now !!');
        // const caller = setInterval(() => monitorUsers(), 5000);
        monitorUsers(client);
    } else if (commandName == 'check') {
        const channel = client.channels.cache.get(voiceChannelId); // get channel
        const usernames = channel.members.map(member => member.user.username); // get all members and map them by they're username
        console.log(usernames.join('\n'));
        // console.log("channel ", channel)
        // console.log("this is channel data", channel.members)
        await interaction.reply('username bro');
    } else if(commandName == 'leave') {
        console.log(" this is caled ");
        const voiceChannel = interaction.options.getChannel(voiceChannelId)
        const voiceConnection = leaveVoiceChannel({
            channelId: voiceChannelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });
        await interaction.reply('Left VC will stop monitoring now !!');
    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN)