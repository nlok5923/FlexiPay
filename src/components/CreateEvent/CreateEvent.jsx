import { React, useState, useEffect } from "react";
import "./CreateEvent.css";
import { Wallet, providers, Contract } from "ethers";
import { connect } from "@tableland/sdk";
import {
  Form,
  Input,
  Button,
  Checkbox,
  DatePicker,
  TimePicker,
  Upload,
  Spin,
  message,
  Radio,
} from "antd";
import { Buffer } from "buffer";
import Axios from "axios";
import { InboxOutlined } from "@ant-design/icons";
import addresses from "../../config";
import FlexiPayArtifact from "../../Ethereum/FlexiPay.json";
import GetContract from "../../hooks/GetContract";
import Loader from "../../shared/Loader/Loader";
import tableNames from "../../databaseConfig";
import { useMoralis, useMoralisFile } from "react-moralis";

// Event details table: _80001_1963
const { Dragger } = Upload;
const { TextArea } = Input;
const CreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [eventPoster, setEventPoster] = useState(null);
  const [eventNFTFile, setEventNFTFile] = useState(null);
  // event state init with sample data
  const [event, setEvent] = useState({
    eventName: "Stream it",
    aboutEvent:
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?",
    eventStartEndDate: ["01/02/2021", "01/02/2021"],
    eventStartEndTime: ["01:02:03", "01:02:03"],
    eventLink: "https://discord.gg/qtVsaAcP",
    discordVcName: "General",
    orgMetaMaskAddress: "0xD649267Da6C1554CE62c8790Ff6C465aF108a167",
    orgDiscordUsername: "Nitanshu Lokhande",
    eventRate: "1",
    eventRsvpFee: "10",
    isCOP: false,
    nftImage: null,
  });

  let flexiPayContract = GetContract(addresses.FlexiPay, FlexiPayArtifact.abi);
  const { authenticate, isAuthenticated, user } = useMoralis();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();

  const props = {
    name: "file",
    multiple: false,
    listType: "picture",
    accept: ".png,.jpg,.jpeg",
    beforeUpload(file) {
      console.log(file);
      setEventPoster(file);
      return false;
    },
    iconRender() {
      return <Spin></Spin>;
    },
    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const nftImageDaggerProps = {
    name: "nftImageFile",
    multiple: false,
    listType: "picture",
    accept: ".png,.jpg,.jpeg",
    beforeUpload(file) {
      console.log(file);
      setEventNFTFile(file);
      return false;
    },
    iconRender() {
      return <Spin></Spin>;
    },
    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const uploadEventPoster = async (eventFile) => {
    if (!isAuthenticated) {
      await authenticate();
    }
    let response = await saveFile("file", eventFile, { saveIPFS: true });
    console.log("response after uploading file via moralis", response._hash);
    console.log(response.ipfs());

    return response._hash;
  };

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // we wil be generatng a 7 lettered random string and will use it as an ID for the event
  const generateString = (length) => {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [tableState, setTableState] = useState(null);
  const [loadStatus, setLoadStatus] = useState(false);

  const [form] = Form.useForm();

  const onChangeHandler = (e) => {
    setEvent({ ...event, [e.target.id]: e.target.value });
    console.log(event);
  };

  const createTable = async () => {
    try {
      const { name } = await tableState.create(
        `event_id text, event_name text, event_poster text, about_event text, start_date text, end_date text, start_time text, end_time text, event_link text, discord_vc text, org_meta_addr text, org_discord_username text, event_rate int, event_rsvp_fee int, is_nft int, nft_hash text, primary key (event_id)`,
        `event_details`
      );
      console.log("event_details table name ", name);
    } catch (err) {
      console.log(err.message);
    }
  };

  const initTableLand = async () => {
    try {
      const wallet = new Wallet(process.env.REACT_APP_PRIVATE_KEY);
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
      setTableState(tableland);
      console.log("table land init ", tableState);
    } catch (err) {
      message.warning("Error in connecting to TableLand");
      console.log(err);
    }
  };

  useEffect(() => {
    window.Buffer = Buffer;
    initTableLand();
  }, []);

  const deleteTableEntries = async () => {
    try {
      const DELETE_EVENT_TABLE_ENTRIES = `DELETE FROM ${tableNames.EVENT_DETAILS};`;
      const DELETE_EVENT_ORG_ADDRESS_TABLE = `DELETE FROM ${tableNames.EVENT_ORG_ADDRESS};`;
      const DELETE_EVENT_USER_TABLE_ENTRY = `DELETE FROM ${tableNames.EVENT_USER};`;
      const DELETE_USER_META_ADDRESS_TABLE_ENTRY = `DELETE FROM ${tableNames.USER_META_ADDRESS};`;
      let deleteResp = await tableState.write(DELETE_EVENT_TABLE_ENTRIES);
      console.log(" the create event table deleted ", deleteResp);
      deleteResp = await tableState.write(DELETE_EVENT_ORG_ADDRESS_TABLE);
      console.log(" delete event org adddress table ", deleteResp);
      deleteResp = await tableState.write(DELETE_EVENT_USER_TABLE_ENTRY);
      console.log(" delete event user table ", deleteResp);
      deleteResp = await tableState.write(DELETE_USER_META_ADDRESS_TABLE_ENTRY);
      console.log(" user meta delete ", deleteResp);
    } catch (err) {
      console.log(err);
    }
  };

  const createEvent = async () => {
    try {
      let eventId = generateString(7);
      console.log(" this is event id ", eventId);
      const {
        eventName,
        eventLink,
        eventRate,
        eventRsvpFee,
        eventStartEndDate,
        eventStartEndTime,
        aboutEvent,
        discordVcName,
        orgMetaMaskAddress,
        orgDiscordUsername,
        isCOP,
      } = event;
      const eventPosterHash = await uploadEventPoster(eventPoster);
      console.log(" this is event poster hash ", eventPosterHash);
      console.log(" this is event NFT file ", eventNFTFile);
      const eventNFTFileHash = await uploadEventPoster(eventNFTFile);
      // console.log("this is event data ", event);
      console.log(" this is event nft file hash ", eventNFTFileHash);

      const INSERT_QUERY = `INSERT INTO ${tableNames.EVENT_DETAILS} 
      (event_id, 
        event_name, 
        event_poster, 
        about_event, 
        start_date, 
        end_date, 
        start_time, 
        end_time, 
        event_link, 
        discord_vc, 
        org_meta_addr,
        org_discord_username,
        event_rate, 
        event_rsvp_fee,
        is_nft,
        nft_hash)
        VALUES ('${eventId.trim()}', 
        '${eventName}',
        '${eventPosterHash}',
        '${aboutEvent}',
        '${eventStartEndDate[0]}',
        '${eventStartEndDate[1]}',
        '${eventStartEndTime[0]}',
        '${eventStartEndTime[1]}',
        '${eventLink}',
        '${discordVcName}',
        '${orgMetaMaskAddress}',
        '${orgDiscordUsername}',
        '${eventRate}',
        '${eventRsvpFee}',
        '${isCOP ? 1 : 0}',
        '${eventNFTFileHash}');`;
      setIsLoading(true);
      console.log(" this is insert query ", INSERT_QUERY);
      const EVENT_INSERT_QUERY = `INSERT INTO ${
        tableNames.EVENT_ORG_ADDRESS
      } (event_id, org_meta_address) VALUES ('${eventId.trim()}', '${orgMetaMaskAddress}');`;
      let writeRes = await tableState.write(INSERT_QUERY);
      let eventInsertRes = await tableState.write(EVENT_INSERT_QUERY);
      console.log("Added event to event table", writeRes);
      console.log("Added event to event table", eventInsertRes);
      let addEventTxn = await flexiPayContract.addEvent(
        eventId.trim(),
        eventRsvpFee,
        { gasLimit: "9000000" }
      );
      addEventTxn.wait();
      setIsLoading(false);
      message.success("Event added successfully");
    } catch (err) {
      message.error("Error in adding event");
      console.log(err);
    }
  };

  const readTable = async () => {
    try {
      let readData = await tableState.read(`SELECT * FROM _80001_1803;`);
      console.log(" this is readData of event ", readData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="ce-par-div">
          <div className="ce-div">
            {/* // admin side operation */}
            {/* <button onClick={() => readTable()}>Read</button> */}
            {/* <button className='ce-btn' onClick={() => createTable()}>Create Table</button> */}
            {/* <button onClick={() => deleteTableEntries()}> Clear Everything </button> */}
            <h1 className="ce-heading">Create Event</h1>
            <Form className="ce-form" form={form} layout={"vertical"}>
              <Form.Item
                className="ce-form-label"
                label="Event Name"
                name="eventName"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Give some name to your event"
                  name="Event Name"
                  onChange={(e) => onChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="About Event"
                name="aboutEvent"
                rules={[{ required: true }]}
              >
                <TextArea
                  placeholder="Tell us about your event"
                  name="About Event"
                  onChange={(e) => onChangeHandler(e)}
                  autoSize={{ minRows: 3, maxRows: 15 }}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Start Date and End Date"
                name="eventStartEndDate"
                rules={[{ required: true }]}
              >
                <DatePicker.RangePicker
                  style={{ color: "#fff" }}
                  placement="topLeft"
                  format={"DD/MM/YYYY"}
                  onChange={(_, dateArr) => {
                    setEvent({
                      ...event,
                      eventStartEndDate: dateArr,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Start Time and End Time"
                name="eventStartEndTime"
                rules={[{ required: true }]}
              >
                <TimePicker.RangePicker
                  style={{ color: "#fff" }}
                  className="ce-date-picker"
                  onChange={(_, timeArr) => {
                    setEvent({
                      ...event,
                      eventStartEndTime: timeArr,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Event Link"
                name="eventLink"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Enter the link of your event"
                  name="Event Link"
                  onChange={(e) => onChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Discord VC Name"
                name="discordVcName"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Enter the name of your discord VC"
                  name="Discord VC Name"
                  onChange={(e) => onChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Organizer MetaMask Address"
                name="orgMetaMaskAddress"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="Enter your MetaMask address"
                  name="Organizer MetaMask Address"
                  onChange={(e) => onChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Organizer Discord Username"
                name="orgDiscordUsername"
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="ex: strawhat#1234"
                  name="Organizer Discord Username"
                  onChange={(e) => onChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Event Rate"
                name="eventRate"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  min="0.000000000000000001"
                  step="0.000000000000000001"
                  placeholder="Enter the rate of the stream in DAI (amount in wei/sec)"
                  name="Event Rate"
                  onChange={(e) => onChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Event RSVP Fee"
                name="eventRsvpFee"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  min="0.000000000000000001"
                  step="0.000000000000000001"
                  placeholder="Enter the RSVP fee in DAI"
                  name="Event RSVP Fee"
                  onChange={(e) => onChangeHandler(e)}
                />
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Upload Event Poster Image"
                name="Event Poster Image"
                rules={[{ required: true }]}
              >
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other band files
                  </p>
                </Dragger>
              </Form.Item>
              <Form.Item
                className="ce-form-label"
                label="Would you like to provide a certificate of participation in form of NFT to attendees ?"
                name="certificate of participation choice"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  onChange={(e) => {
                    setEvent({
                      ...event,
                      isCOP: e.target.value,
                    });
                  }}
                  value={event.isCOP}
                >
                  <Radio value={true} className="ce-radio-choice">
                    Yes
                  </Radio>
                  <Radio value={false} className="ce-radio-choice">
                    No
                  </Radio>
                </Radio.Group>
              </Form.Item>
              {event.isCOP ? (
                <Form.Item
                  className="ce-form-label"
                  label="Upload the NFT image"
                  name="nftImage"
                  rules={[{ required: true }]}
                >
                  <Dragger {...nftImageDaggerProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibit
                      from uploading company data or other band files
                    </p>
                  </Dragger>
                </Form.Item>
              ) : null}
              <Form.Item className="ce-submit-form-item">
                <Button
                  className="ce-submit-btn"
                  type="primary"
                  htmlType="submit"
                  onClick={() => createEvent()}
                >
                  Create Event
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEvent;
