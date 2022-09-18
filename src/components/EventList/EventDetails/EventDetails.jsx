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

//! we can also include a feature to notify user to stop the stream once the event got over
// event user table: _80001_1890
// event org meta table: _80001_1891
// user meta table: _80001_1892

const { Step } = Steps;
const EventDetails = () => {
  // const event = {
  //   eventName: 'EthGlobal Online',
  //   eventPosterUrl: 'https://dl.airtable.com/.attachments/45bc23420b6faed867ef595b4f5b0a3f/ff3b3a56/imagesocial.png',
  //   aboutEvent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  //   eventStartEndDate: ['2020-09-01', '2020-09-30'],
  //   eventStartEndTime: ['00:00:00', '23:59:59'],
  //   eventLink: 'https://ethglobal.com/',
  //   discordVcName: 'General',
  //   orgMetaMaskAddress: '0x0000000000000000000000000000000000000000',
  //   eventRate: '0.01',
  //   eventRsvpFee: '0.01',
  // };
  let userAddress = GetAccount();
  const [event, setEvent] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const event_id = window.location.href.split("/")[4];
  console.log(event_id);

  const discordInvite = "https://discord.gg/invite/invite";
  const [form] = Form.useForm();
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [isStreamEnded, setIsStreamEnded] = useState(false);
  const [tableLandState, setTableLandState] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [constantFlowAgreementState, setConstantFlowAgreementState] =
    useState(null);
  const [superFluidSignerState, setSuperFluidSignerState] = useState(null);
  const [daixContract, setDaixContract] = useState(null);
  const [superFluidInstance, setSuperfluidInstance] = useState(null);
  const [isUserRegisteredForEvent, setIsUserRegisteredForEvent] =
    useState(false);

  const initTableLand = async () => {
    try {
      const wallet = new Wallet(
        "2999e4ada1397ed384770e9fd58ad9b41ebffb248f89c8182403f82c48aeae9e"
      );
      const provider = new providers.AlchemyProvider(
        "maticmum",
        "Vu-mYa0_74IeUxbkODAJquwZsdnDCQM8"
      );
      const signer = wallet.connect(provider);
      const tableland = await connect({
        signer,
        network: "testnet",
        chain: "polygon-mumbai",
      });
      setTableLandState(tableland);
      const event = await tableland.read(
        `SELECT * FROM _80001_1803 WHERE event_id = '${event_id}'`
      );
      console.log(event.rows[0]);
      const currentUser = await tableland.read(
        `SELECT username FROM _80001_1892 WHERE user_meta_address = '${userAddress}'`
      );
      console.log(" this is current user fetch ", currentUser);
      setEvent(event.rows[0]);
      setCurrentUsername(currentUser.rows);
      const userName = currentUser.rows[0][0];
      if (currentUser.rows > 0) {
        console.log(" this is username fetched ", userName);
        const userRegisteredEvents = await tableland.read(
          `SELECT event_id FROM _80001_1890 WHERE username = '${userName}'`
        );
        console.log(
          "Events for which current user is registered ",
          userRegisteredEvents
        );
        if (userRegisteredEvents.rows.includes(event_id)) {
          setIsUserRegisteredForEvent(true);
        }
      }
      const url =
        "https://eth-goerli.g.alchemy.com/v2/V5p1PckEwUqIq5s5rA2zvwRKH0V9Hslr";
      const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

      let sf = await Framework.create({
        chainId: 5,
        provider: customHttpProvider,
      });
      setSuperfluidInstance(sf);
      const superFluidProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      const superFluidSigner = superFluidProvider.getSigner();
      setSuperFluidSignerState(superFluidSigner);
      const config = {
        hostAddress: "0x22ff293e14F1EC3A09B137e9e06084AFd63adDF9",
        cfaV1Address: "0xEd6BcbF6907D4feEEe8a8875543249bEa9D308E8",
        idaV1Address: "0xB0aABBA4B2783A72C52956CDEF62d438ecA2d7a1",
      };

      let cfaV1 = new ConstantFlowAgreementV1({ config });
      setConstantFlowAgreementState(cfaV1);
      const DAIxContract = await sf.loadSuperToken("fDAIx");
      setDaixContract(DAIxContract);
    } catch (err) {
      message.warning("Some error occured during initialization")
      console.log(err);
    }
  };

  useEffect(() => {
    window.Buffer = Buffer;
    initTableLand();
  }, []);

  const registerForEvent = async () => {
    try {
      const { name, username } = userInfo;
      if (name && username) {
        setIsLoading(true);
        const EVENTID_USER_QUERY = `INSERT INTO _80001_1890 (event_id, username, name) VALUES ('${event_id}', '${username}', '${name}')`;
        const USER_USER_META_QUERY = `INSERT INTO _80001_1892 (username, user_meta_address) VALUES ('${username}', '${userAddress}')`;
        const insertResp = await tableLandState.write(EVENTID_USER_QUERY);
        console.log(insertResp);
        const insertRespMeta = await tableLandState.write(USER_USER_META_QUERY);
        console.log(insertRespMeta);
        setIsLoading(false);
        //! handles rest corner cases
        message.success("Registered for event successfully");
      } else {
        message.warning("Please fill all the fields");
      }
    } catch (err) {
      message.warning("Some error occured during registration")
      console.log(err);
    }
  };

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

  const onChangeHandler = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
    console.log("updated user data ", userInfo);
  };

  const startStream = async () => {
    try {
      const createFlowOperation = superFluidInstance.cfaV1.createFlow({
        flowRate: event[11], // event flow rate
        receiver: event[10], // event org meta address
        superToken: daixContract.address,
      });
      await createFlowOperation.exec(superFluidSignerState);
      console.log(" create flow operation response ", createFlowOperation);
      setIsStreamEnded(false);
      setIsStreamStarted(true);
      message.success("Stream started successfully");
    } catch (err) {
      message.warning("Some error occured during stream start")
      console.log(err);
    }
  };

  const stopStream = async () => {
    try {
      const deleteFlowOperation = superFluidInstance.cfaV1.deleteFlow({
        receiver: event[10],
        superToken: daixContract.address,
      });
      await deleteFlowOperation.exec(superFluidSignerState);
      console.log(" delete flow operation response ", deleteFlowOperation);
      setIsStreamStarted(false);
      setIsStreamEnded(true);
      message.success("Stream ended successfully");
    } catch (err) {
      message.warning("Some error occured during stopping stream")
      console.log(err);
    }
  };

  return (
    <>
      {event && !isLoading ? (
        <div className="ed-div">
          <h1 className="ed-heading">Event Details</h1>
          {/* <button onClick={() => createTables()}> Create tables </button> */}
          <img
            src={`https://gateway.pinata.cloud/ipfs/${event[2]}`}
            alt={"Event Cover Img"}
            className="ed-img"
          />
          <div className="ed-text-div">
            <div className="ed-card">
              <h2 className="ed-card-title">{event[1]}</h2>
              <div className="ed-card-text">{event[3]}</div>
              <div className="ed-card-text">Start Date: {event[4]}</div>
              <div className="ed-card-text">End Date: {event[5]}</div>
              <div className="ed-card-text">Start Time: {event[6]}</div>
              <div className="ed-card-text">End Time: {event[7]}</div>
              <div className="ed-card-text">Discord VC Name: {event[9]}</div>
              <div className="ed-card-text">
                Org MetaMask Address: {event[10]}
              </div>
              <div className="ed-card-text">Event Rate: {event[11]}</div>
              <div className="ed-card-text">Event RSVP Fee: {event[12]}</div>
            </div>
          </div>

          {!isUserRegisteredForEvent ? (
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
                onClick={() => window.open(`${event[8]}`)}
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
          <div className="ed-wf-div">
            <h1 className="ed-heading">Withdraw RSVP Fees</h1>
            <Alert message="The RSVP fees would be transferred to the MetaMask account you are currently signed in with." className="ed-alert" type="info" showIcon />
            <div
                className="ed-di-div"
                onClick={() => {}}
              >
                <span className="ed-di-text">Withdraw RSVP Fees</span>
              </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default EventDetails;
