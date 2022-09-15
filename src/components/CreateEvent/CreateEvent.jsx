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
} from "antd";
import { Buffer } from "buffer";
import Axios from "axios";
import { InboxOutlined } from "@ant-design/icons";
import addresses from '../../config'
import FlexiPayArtifact from '../../Ethereum/FlexiPay.json'
import GetContract from "../../hooks/GetContract";

// Event details table: _80001_1803
const { Dragger } = Upload;
const CreateEvent = () => {
  const [eventPoster, setEventPoster] = useState(null);
  const [event, setEvent] = useState({
    eventName: "Sample Name",
    aboutEvent: "about event",
    eventStartEndDate: ["01/02/2021", "01/02/2021"],
    eventStartEndTime: ["01:02:03", "01:02:03"],
    eventLink: "event link",
    discordVcName: "discord channel",
    orgMetaMaskAddress: "0x1234",
    eventRate: "1",
    eventRsvpFee: "1",
  });

  let flexiPayContract = GetContract(addresses.FlexiPay, FlexiPayArtifact.abi);

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

  const uploadEventPoster = async () => {
    const formData = new FormData();
    console.log(" this is file ", eventPoster);
    formData.append("file", eventPoster);
    const res = await Axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: `5dbd25d2575c28d30c75`,
        pinata_secret_api_key: `31e6245d30d45e928d0bdc05fec2b83914663311976825e465d1a57fa1af5c7c`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(" this is response after uploading event poster ", res);
    const { IpfsHash } = res.data;
    return IpfsHash;
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
        `event_id text, event_name text, event_poster text, about_event text, start_date text, end_date text, start_time text, end_time text, event_link text, discord_vc text, org_meta_addr text, event_rate int, event_rsvp_fee int, primary key (event_id)`,
        `event_details`
      );
      console.log("event_details table name ", name);
    } catch (err) {
      console.log(err.message);
    }
  };

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
      setTableState(tableland);
      console.log("table land init ", tableState);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.Buffer = Buffer;
    initTableLand();
  }, []);

  const createEvent = async () => {
    try {
      const eventPosterHash = await uploadEventPoster();
      console.log("this is event data ", event);
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
      } = event;
      const INSERT_QUERY = `INSERT INTO _80001_1803 
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
        event_rate, 
        event_rsvp_fee) 
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
        '${eventRate}',
        '${eventRsvpFee}');`;
      console.log(" this is insert query ", INSERT_QUERY);
      let writeRes = await tableState.write(INSERT_QUERY);
      console.log("Added event to event table", writeRes);
      let addEventTxn = await flexiPayContract.addEvent(eventId.trim(), eventRsvpFee);
      addEventTxn.wait();
    } catch (err) {
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
    <div className="ce-par-div">
      <div className="ce-div">
        {/* // admin side operation */}
        {/* <button onClick={() => readTable()}>Read</button> */}
        {/* <button className='ce-btn' onClick={() => readTable()}>Create Table</button> */}
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
            <Input
              placeholder="Tell us about your event"
              name="About Event"
              onChange={(e) => onChangeHandler(e)}
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
            label="Event Rate"
            name="eventRate"
            rules={[{ required: true }]}
          >
            <Input
              type="number"
              min="0.000000000000000001"
              step="0.000000000000000001"
              placeholder="Enter the rate of the stream in ETH"
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
              placeholder="Enter the RSVP fee in ETH"
              name="Event RSVP Fee"
              onChange={(e) => onChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item>
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
  );
};

export default CreateEvent;
