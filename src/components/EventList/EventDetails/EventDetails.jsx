import React, { useState, createRef } from 'react'
import './EventDetails.css'
import { Form, Input, Button, Steps } from 'antd';
import Slider from 'react-slick';
const { Step } = Steps;

const EventDetails = () => {
  const event = {
    eventName: 'EthGlobal Online',
    eventPosterUrl: 'https://dl.airtable.com/.attachments/45bc23420b6faed867ef595b4f5b0a3f/ff3b3a56/imagesocial.png',
    aboutEvent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    eventStartEndDate: ['2020-09-01', '2020-09-30'],
    eventStartEndTime: ['00:00:00', '23:59:59'],
    eventLink: 'https://ethglobal.com/',
    discordVcName: 'General',
    orgMetaMaskAddress: '0x0000000000000000000000000000000000000000',
    eventRate: '0.01',
    eventRsvpFee: '0.01',
  };
  
  const sliderRef = createRef();
  const sliderSettings = {
    dots: false,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    swipe: false,
    speed: 500,
  };
  const [form] = Form.useForm();
  const [progress, setProgress] = useState(1);

  const joinEventHandler = () => {
    setProgress(2);
    sliderRef.current.slickNext();
  }


  return (
    <div className='ed-div'>
      <h1 className='ed-heading'>Event Details</h1>
      <img
        src={event.eventPosterUrl}
        alt={'Event Cover Img'}
        className='ed-img'
      />
      <div className='ed-text-div'>
      <div className='ed-card'>
        <h2 className='ed-card-title'>{event.eventName}</h2>
        <div className='ed-card-text'>{event.aboutEvent}</div>
        <div className='ed-card-text'>Start Date: {event.eventStartEndDate[0]}</div>
        <div className='ed-card-text'>End Date: {event.eventStartEndDate[1]}</div>
        <div className='ed-card-text'>Start Time: {event.eventStartEndTime[0]}</div>
        <div className='ed-card-text'>End Time: {event.eventStartEndTime[1]}</div>
        <div className='ed-card-text'>Event Link: {event.eventLink}</div>
        <div className='ed-card-text'>Discord VC Name: {event.discordVcName}</div>
        <div className='ed-card-text'>Org MetaMask Address: {event.orgMetaMaskAddress ? event.orgMetaMaskAddress : 'undefined' }</div>
        <div className='ed-card-text'>Event Rate: {event.eventRate}</div>
        <div className='ed-card-text'>Event RSVP Fee: {event.eventRsvpFee}</div>
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
                <Button className='ed-submit-btn' type='primary' htmlType='submit' onClick={joinEventHandler}>
                  Join Event
                </Button>
              </Form.Item>
          </Form>
        </div>
      </div>

    </div>
  )
}

export default EventDetails