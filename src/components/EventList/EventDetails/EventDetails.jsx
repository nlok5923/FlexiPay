import React, { useState, createRef } from 'react'
import './EventDetails.css'
import { Form, Input, Button, Steps, Alert } from 'antd';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import { useEffect } from 'react';
import Loader from '../../../shared/Loader/Loader';

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
  const [event, setEvent] = useState(null);
  const event_id = window.location.href.split('/')[4];
  console.log(event_id)

  const discordInvite = 'https://discord.gg/invite/invite';
  const [form] = Form.useForm();
  const [isStreamStarted, setIsStreamStarted] = useState(false);
  const [isStreamEnded, setIsStreamEnded] = useState(false);

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
      const event = await tableland.read(`SELECT * FROM _80001_1803 WHERE event_id = '${event_id}'`);
      console.log(event.rows[0])
      setEvent(event.rows[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    window.Buffer = Buffer;
    initTableLand();
  }, [])

  return (
    <>
      {
        event ?
        <div className='ed-div'>
          <h1 className='ed-heading'>Event Details</h1>
          <img
            src={`https://gateway.pinata.cloud/ipfs/${event[2]}`}
            alt={'Event Cover Img'}
            className='ed-img'
          />
          <div className='ed-text-div'>
          <div className='ed-card'>
            <h2 className='ed-card-title'>{event[1]}</h2>
            <div className='ed-card-text'>{event[3]}</div>
            <div className='ed-card-text'>Start Date: {event[4]}</div>
            <div className='ed-card-text'>End Date: {event[5]}</div>
            <div className='ed-card-text'>Start Time: {event[6]}</div>
            <div className='ed-card-text'>End Time: {event[7]}</div>
            <div className='ed-card-text'>Event Link: {event[8]}</div>
            <div className='ed-card-text'>Discord VC Name: {event[9]}</div>
            <div className='ed-card-text'>Org MetaMask Address: {event[10]}</div>
            <div className='ed-card-text'>Event Rate: {event[11]}</div>
            <div className='ed-card-text'>Event RSVP Fee: {event[12]}</div>
          </div>
          </div>

          <div className='ed-join-event-div'>
            <h1 className='ed-heading'>Join Event</h1>
            <div className='ed-join-event-slider-div'>
              <Form form={form} className='ed-join-form' layout='vertical'>
                <Form.Item className='ed-form-item' label='Full Name' name='fullName' rules={[{ required: true, message: 'Please input your Full Name!' }]} >
                  <Input placeholder='Full Name' name="Full Name" onChange={()=>{}} />
                </Form.Item>
                <Form.Item className='ed-form-item' label='Discord Username' name='discordUsername' rules={[{ required: true, message: 'Please input your discord username!' }]} >
                  <Input placeholder='Discord Username' name="Discord Username" onChange={()=>{}} />
                </Form.Item>
                <Form.Item className='ed-submit-form-item'>
                    <Button className='ed-submit-btn' type='primary' htmlType='submit' onClick={()=> {console.log("Joining event..")}}>
                      Join Event
                    </Button>
                  </Form.Item>
              </Form>
            </div>
          </div>

          <div className='ed-after-joining-div'>
            <Alert message="You are registered for the Event !" type='success' showIcon className='ed-alert' />
            <Alert message="Please join the following Discord Server to participate in the event !" type='info' showIcon className='ed-alert' />
          <div className='ed-di-div' onClick={()=>window.open(`${discordInvite}`)}>
              <img src="/assets/images/discord-logo.png" alt="discord-logo.png" className='ed-discord-img' />
              <span className='ed-di-text'>Discord Invite</span>
            </div>
          </div>

          {
            !isStreamStarted ? 
            <div className='ed-stream-div'>
              <h1 className='ed-stream-heading'>Stream Settings</h1>  
              <Alert message="Please start the stream just before joining the Discord Voice channel for the Event." type='warning' showIcon className='ed-alert' />
              <Button className='ed-stream-btn' type='danger' onClick={()=> setIsStreamStarted(true)}>Start Stream</Button>
            </div>
            :
            !isStreamEnded ?
            <div className='ed-stream-div'>
              <h1 className='ed-stream-heading'>Stream Settings</h1>
              <Alert message="Please end the stream only when you do not want attend event any further or when the event ends." type='warning' showIcon className='ed-alert' />
              <Button className='ed-stream-btn' type='danger' onClick={()=>setIsStreamEnded(true)} >End Stream</Button>
            </div>
            :
            null
          }

        </div>
        :
        <Loader />
      }
    </>
  )
}

export default EventDetails