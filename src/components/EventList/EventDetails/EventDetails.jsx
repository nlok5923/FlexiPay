import React, { useState, createRef } from "react";
import "./EventDetails.css";
import { Form, Input, Button, Steps, Alert, message } from "antd";
import Slider from "react-slick";
import { Link, useSearchParams } from "react-router-dom";
import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import { useEffect } from "react";
import Loader from "../../../shared/Loader/Loader";
import GetAccount from "../../../hooks/GetAccount";
import { ConstantFlowAgreementV1 } from "@superfluid-finance/sdk-core";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import tableNames from "../../../databaseConfig";
import FlexiPayArtifact from "../../../Ethereum/FlexiPay.json";
import GetContract from "../../../hooks/GetContract";
import addresses from "../../../config";
import ERC20ABi from "../../../Ethereum/ERC20ABI.json";
import ProofOfAttendenceAbi from "../../../Ethereum/ProofOfAttendence.json"
import { useMoralis, useMoralisFile } from "react-moralis";

//! we can also include a feature to notify user to stop the stream once the event got over

const { Step } = Steps;
const EventDetails = () => {
  const { authenticate, isAuthenticated, user } = useMoralis();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  let flexiPayContract = GetContract(addresses.FlexiPay, FlexiPayArtifact.abi);
  let ProofOfAttendenceContract = GetContract(addresses.ProofOfAttendence, ProofOfAttendenceAbi.abi);
  let superFakeDAITokenContract = GetContract(
    addresses.SuperFakeDAIToken,
    ERC20ABi.abi
  );
  let userAddress = GetAccount();
  const [event, setEvent] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const event_id = window.location.href.split("/")[5];
  console.log(event_id);

  const discordInvite = "https://discord.gg/invite/invite";
  const [form] = Form.useForm();
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [isStreamEnded, setIsStreamEnded] = useState(false);
  const [tableLandState, setTableLandState] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [superFluidSignerState, setSuperFluidSignerState] = useState(null);
  const [superFluidInstance, setSuperfluidInstance] = useState(null);
  const [isUserRegisteredForEvent, setIsUserRegisteredForEvent] = useState(false);

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

  const initTableLand = async () => {
    try {
      setIsLoading(true);
      const wallet = new Wallet(
        process.env.REACT_APP_PRIVATE_KEY
      );
      const provider = new providers.AlchemyProvider(
        "maticmum",
        process.env.REACT_APP_QUICKNODE_KEY
      );
      const signer = wallet.connect(provider);
      const tableland = await connect({
        signer,
        network: "testnet",
        chain: "polygon-mumbai",
      });
      setTableLandState(tableland);
      const event = await tableland.read(
        `SELECT * FROM ${tableNames.EVENT_DETAILS} WHERE event_id = '${event_id}'`
      );
      console.log(event.rows[0]);
      const currentUser = await tableland.read(
        `SELECT username FROM ${tableNames.USER_META_ADDRESS} WHERE user_meta_address = '${userAddress}'`
      );
      console.log(" this is current user fetch ", currentUser);
      setEvent(event.rows[0]);
      setCurrentUsername(currentUser.rows);
      const userName = currentUser.rows[0][0];
      console.log(" this is username ", userName);
      if (currentUser.rows.length > 0) {
        console.log(" this is username fetched ", userName);
        const userRegisteredEvents = await tableland.read(
          `SELECT event_id FROM ${tableNames.EVENT_USER} WHERE username = '${userName}'`
        );
        console.log(
          "Events for which current user is registered ",
          userRegisteredEvents
        );
        const userEvents = userRegisteredEvents.rows.map((events) => events[0]);
        if (userEvents.includes(event_id)) {
          setIsUserRegisteredForEvent(true);

          const url =
            process.env.REACT_APP_QUICK_NODE_URL;
          const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

          let sf = await Framework.create({
            chainId: 80001,
            provider: customHttpProvider,
          });
          console.log(" this is sf ", sf);
          setSuperfluidInstance(sf);
          const superFluidProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          const superFluidSigner = superFluidProvider.getSigner();
          setSuperFluidSignerState(superFluidSigner);

          console.log(" this is called in init tableland");
          console.log(
            addresses.SuperFakeDAIToken +
              " " +
              userAddress +
              " " +
              event.rows[0][10]
          );

          let checkStream = await sf.cfaV1.getFlow({
            superToken: addresses.SuperFakeDAIToken,
            sender: userAddress,
            receiver: event.rows[0][10],
            providerOrSigner: signer,
          });

          if (checkStream.flowRate > 0) {
            setIsStreamStarted(true);
            setIsStreamEnded(false);
          } else {
            setIsStreamEnded(true);
            setIsStreamStarted(false);
          }

          console.log(" checking flow rate ", checkStream);
        }
      }
      setIsLoading(false);
    } catch (err) {
      message.warning("Some error occured during initialization");
      console.log(err);
    }
  };

  useEffect(() => {
    window.Buffer = Buffer;
    initTableLand();
  }, []);

  const isUserExist = async (username) => {
    try {
      // username = "Nitanshu Lokhande"
      let FIND_USER_NAME = `SELECT username from ${tableNames.USER_META_ADDRESS} where username = '${username}'`;
      const isUserNameExist = await tableLandState.read(FIND_USER_NAME);
      return isUserNameExist.rows.length > 0;
    } catch (err) {
      console.log(err);
    }
  }

  const registerForEvent = async () => {
    try {
      const { name, username } = userInfo;
      if (name && username) {
        setIsLoading(true);
        const EVENTID_USER_QUERY = `INSERT INTO ${tableNames.EVENT_USER} (event_id, username, name) VALUES ('${event_id}', '${username}', '${name}')`;
        const USER_USER_META_QUERY = `INSERT INTO ${tableNames.USER_META_ADDRESS} (username, user_meta_address) VALUES ('${username}', '${userAddress}')`;
        const insertResp = await tableLandState.write(EVENTID_USER_QUERY);
        console.log(insertResp);
        if(!isUserExist(username)) {
          // first check if there is already an entry for user in user meta address table if yes then skip below write op
          const insertRespMeta = await tableLandState.write(USER_USER_META_QUERY);
          console.log(insertRespMeta);
        }

        let eventRsvpTxn = await superFakeDAITokenContract.transfer(
          addresses.FlexiPay,
          ethers.utils.parseEther(String(event[13]))
        );
        await eventRsvpTxn.wait();
        let eventRespUpdateTxn = await flexiPayContract.registerForEvent(
          event_id,
          event[13]
        );
        await eventRespUpdateTxn.wait();

        setIsLoading(false);
        //! handles rest corner cases
        message.success("Registered for event successfully");
      } else {
        message.warning("Please fill all the fields");
      }
    } catch (err) {
      message.warning("Some error occured during registration");
      console.log(err);
    }
  };

  const isEventOver = (endDate, endTime) => {      
    const currdobj = new Date();
    const dateArr = endDate.split("/");
    const timeArr = endTime.split(":");
    const enddobj = new Date(dateArr[2], dateArr[1] - 1, dateArr[0], timeArr[0], timeArr[1]);
    if (currdobj > enddobj) {
      console.log("event is over");
      return true;
    }
    return false;
  }

  const onChangeHandler = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
    console.log("updated user data ", userInfo);
  };

  const calculateFlowRate = () => {
    const amountInWei = ethers.BigNumber.from(event[12]);
    const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
    return monthlyAmount * 3600 * 24 * 30;
  }

  const startStream = async () => {
    try {
      console.log(" this is shitty receiver ", event[10]);
      let calculatedFlowRate = calculateFlowRate();
      const createFlowOperation = superFluidInstance.cfaV1.createFlow({
        flowRate: calculatedFlowRate, // event flow rate
        receiver: event[10], // event org meta address
        superToken: addresses.SuperFakeDAIToken,
      });
      // console.log(" this is diacontract address ")
      await createFlowOperation.exec(superFluidSignerState);
      console.log(" create flow operation response ", createFlowOperation);
      setIsStreamEnded(false);
      setIsStreamStarted(true);
      message.success("Stream started successfully");
    } catch (err) {
      message.warning("Some error occured during stream start");
      console.log(err);
    }
  };

  const stopStream = async () => {
    try {
      console.log(
        userAddress + " " + event[10] + " " + addresses.SuperFakeDAIToken
      );
      const deleteFlowOperation = superFluidInstance.cfaV1.deleteFlow({
        sender: userAddress,
        receiver: event[10],
        superToken: addresses.SuperFakeDAIToken,
      });
      await deleteFlowOperation.exec(superFluidSignerState);
      console.log(" delete flow operation response ", deleteFlowOperation);
      setIsStreamStarted(false);
      setIsStreamEnded(true);
      message.success("Stream ended successfully");
    } catch (err) {
      message.warning("Some error occured during stopping stream");
      console.log(err);
    }
  };

  const withDrawRsvpFee = async () => {
    try {
      setIsLoading(true);
      let withDrawTxn = await withDrawRsvpFee(event_id);
      await withDrawTxn.wait();
      setIsLoading(false);
      message.success("Withdraw RSVP successfully completed!");
    } catch (err) {
      message.success("Some error occured while withdraw!");
      console.log(err);
    }
  }

  const claimEventNFT = async () => {
    try {
      setIsLoading(true);
      let nftMetaData = {
        name: event[1],
        image: `${process.env.REACT_APP_MORALIS_IPFS_URL}${event[2]}`,
        description: event[3]
      };
      if(!isAuthenticated) {
        authenticate();
      }
      let fileResponse = await saveFile("temp.json", { base64: btoa(JSON.stringify(nftMetaData))}, { saveIPFS: true })
      console.log(fileResponse.ipfs());
      let nftMintTxn = await ProofOfAttendenceContract.safeMint(userAddress, `${process.env.REACT_APP_MORALIS_IPFS_URL}${fileResponse._hash}`);
      await nftMintTxn.wait();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
    {event && !isLoading ? (
      <div className="ed-div">
        <h1 className="ed-heading">Event Details</h1>
        {/* <button onClick={() => createTables()}> Create tables </button> */}
        <img
          src={`${process.env.REACT_APP_MORALIS_IPFS_URL}${event[2]}`}
          alt={"Event Cover Img"}
          className="ed-img"
        />
        {/* <button onClick={() => isUserExist()} > check user </button> */}
        <div className="ed-text-div">
          <div className="ed-card">
            <h2 className="ed-card-title">{event[1]}</h2>
            <div className="ed-card-text">{event[3]}</div>
            <div className="ed-card-text">Event ID: {event[0]}</div>
            <div className="ed-card-text">Start Date: {event[4]}</div>
            <div className="ed-card-text">End Date: {event[2]}</div>
            <div className="ed-card-text">Start Time: {event[6]}</div>
            <div className="ed-card-text">End Time: {event[3]}</div>
            <div className="ed-card-text">Discord VC Name: {event[9]}</div>
            <div className="ed-card-text">
              Org MetaMask Address: {event[10]}
            </div>
            <div className="ed-card-text">Event Rate: {event[12]}</div>
            <div className="ed-card-text">Event RSVP Fee: {event[13]}</div>
          </div>
        </div>

        {/* 
         Order of data in Alchemy Row
          0 - event_id
          1 - event_name
          2 - event_poster
          3 - about_event
          4 - start_date
          5 - end_date
          6 - start_time
          7 - end_time
          8 - event_link
          9 - discord_vc
          10 - org_meta_addr
          11 - org_discord_username
          12 - event_rate
          13 - event_rsvp_fee
          14 - is_nft
          15 - nft_hash
        */}

        {/*
          Order of data in Event Row
          0 : "about_event"
          1 : "discord_vc"
          2 : "end_date"
          3 : "end_time"
          4 : "event_id"
          5 : "event_link"
          6 : "event_name"
          7 : "event_poster"
          8 : "event_rate"
          9 : "event_rsvp_fee"
          10 : "is_nft"
          11 : "nft_hash"
          12 : "org_discord_username"
          13 : "org_meta_addr"
          14 : "start_date"
          15 : "start_time"
        */}

        {!isUserRegisteredForEvent && !isEventOver(event[2], event[3]) ? (
          <div className="ed-join-event-div">
            <h1 className="ed-heading">Join Event</h1>
            <Alert message="Your current signed in wallet account would be used to register for the event" className="ed-alert" type="info" showIcon />
            <div className="ed-join-event-slider-div">
              <Form form={form} className="ed-join-form" layout="vertical">
                <Form.Item
                  className="ed-form-item"
                  label="Full Name"
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Full Name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Full Name"
                    name="Full Name"
                    id="name"
                    onChange={(e) => onChangeHandler(e)}
                  />
                </Form.Item>
                <Form.Item
                  className="ed-form-item"
                  label="Discord Username"
                  name="discordUsername"
                  rules={[
                    {
                      required: true,
                      message: "Please input your discord username!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Discord Username"
                    name="Discord Username"
                    id="username"
                    onChange={(e) => onChangeHandler(e)}
                  />
                </Form.Item>
                <Form.Item className="ed-submit-form-item">
                  <Button
                    className="ed-submit-btn"
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      registerForEvent();
                    }}
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        ) : null}

        {isUserRegisteredForEvent ? (
          <div className="ed-after-joining-div">
            <Alert
              message="You are registered for the Event !"
              type="success"
              showIcon
              className="ed-alert"
            />
            <Alert
              message="Please join the following Discord Server to participate in the event !"
              type="info"
              showIcon
              className="ed-alert"
            />
            <div
              className="ed-di-div"
              onClick={() => window.open(`${event[5]}`, "_blank")}
            >
              <img
                src="/assets/images/discord-logo.png"
                alt="discord-logo.png"
                className="ed-discord-img"
              />
              <span className="ed-di-text">Discord Invite</span>
            </div>
          </div>
        ) : null}

        {isUserRegisteredForEvent && !isStreamStarted ? (
          <div className="ed-stream-div">
            <h1 className="ed-stream-heading">Stream Settings</h1>
            <Alert
              message="Please start the stream just before joining the Discord Voice channel for the Event."
              type="warning"
              showIcon
              className="ed-alert"
            />
            <Button
              className="ed-stream-btn"
              type="danger"
              onClick={() => startStream()}
            >
              Start Stream
            </Button>
          </div>
        ) : isUserRegisteredForEvent && !isStreamEnded ? (
          <div className="ed-stream-div">
            <h1 className="ed-stream-heading">Stream Settings</h1>
            <Alert
              message="Please end the stream only when you do not want attend event any further or when the event ends."
              type="warning"
              showIcon
              className="ed-alert"
            />
            <Button
              className="ed-stream-btn"
              type="danger"
              onClick={() => stopStream(true)}
            >
              End Stream
            </Button>
          </div>
        ) : null}

        {isUserRegisteredForEvent && isEventOver(event[2], event[3]) ? <>
        <div className="ed-wf-div">
          <h1 className="ed-heading">Withdraw RSVP Fees</h1>
          <Alert message="The RSVP fees would be transferred to the MetaMask account you are currently signed in with." className="ed-alert" type="info" showIcon />
          <div
              className="ed-di-div"
              onClick={() => withDrawRsvpFee()}
            >
              <span className="ed-di-text">Withdraw RSVP Fees</span>
            </div>
        </div>
        <div className="ed-wf-div">
          <h1 className="ed-heading">Claim your event Attendence NFT</h1>
          <div
              className="ed-di-div"
              onClick={() => claimEventNFT()}
            >
              <span className="ed-di-text">Claim</span>
            </div>
        </div>
        </>:  null}
      </div>
    ) : (
      <Loader />
    )}
  </>
  );
};

export default EventDetails;
