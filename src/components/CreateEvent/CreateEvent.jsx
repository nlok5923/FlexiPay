import React, { useState } from 'react'
import './CreateEvent.css'
import { Form, Input, Button, Checkbox, DatePicker, TimePicker } from 'antd';

const CreateEvent = () => {
  const [event, setEvent] = useState({
    eventName: null,
    eventPosterUrl: null,
    aboutEvent: null,
    eventStartEndDate: null,
    eventStartEndTime: null,
    eventLink: null,
    discordVcName: null,
    orgMetaMaskAddress: null,
    eventRate: null,
    eventRsvpFee: null,
  });

  const [loadStatus, setLoadStatus] = useState(false);

  const [form] = Form.useForm();

  const onChangeHandler = (e) => {
    setEvent({ ...event, [e.target.id]: e.target.value });
    console.log(event);
  }

  return (
    <div className='ce-par-div'>
      <div className='ce-div'>
        <h1 className='ce-heading'>Create Event</h1>
        <Form className='ce-form' form={form} layout={'vertical'}>
          <Form.Item className='ce-form-label' label='Event Name' name='eventName' rules={[{ required: true }]}>
            <Input placeholder='Give some name to your event' name="Event Name" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Event Poster URL' name='eventPosterUrl' rules={[{ required: true }]}>
            <Input placeholder='Enter the URL of your event poster' name="Event Poster URL" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='About Event' name='aboutEvent' rules={[{ required: true }]}>
            <Input placeholder='Tell us about your event' name="About Event" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Start Date and End Date' name='eventStartEndDate' rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ color: '#fff' }} placement='topLeft' format={'DD/MM/YYYY'} onChange={(_, dateArr)=>{setEvent({
              ...event,
              eventStartEndDate: dateArr
            })}} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Start Time and End Time' name='eventStartEndTime' rules={[{ required: true }]}>
            <TimePicker.RangePicker style={{ color: '#fff' }} className='ce-date-picker' onChange={(_, timeArr)=>{setEvent({
              ...event,
              eventStartEndTime: timeArr
            })}} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Event Link' name='eventLink' rules={[{ required: true }]}>
            <Input placeholder='Enter the link of your event' name="Event Link" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Discord VC Name' name='discordVcName' rules={[{ required: true }]}>
            <Input placeholder='Enter the name of your discord VC' name="Discord VC Name" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Organizer MetaMask Address' name='orgMetaMaskAddress' rules={[{ required: true }]}>
            <Input placeholder='Enter your MetaMask address' name="Organizer MetaMask Address" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Event Rate' name='eventRate' rules={[{ required: true }]}>
            <Input type="number" min="0.000000000000000001" step="0.000000000000000001" placeholder='Enter the rate of the stream in ETH' name="Event Rate" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-form-label' label='Event RSVP Fee' name='eventRsvpFee' rules={[{ required: true }]}>
            <Input type="number" min="0.000000000000000001" step="0.000000000000000001" placeholder='Enter the RSVP fee in ETH' name="Event RSVP Fee" onChange={(e)=>onChangeHandler(e)} />
          </Form.Item>
          <Form.Item className='ce-submit-form-item'>
            <Button className='ce-submit-btn' type='primary' htmlType='submit' onClick={() => {console.log('Creating event')}}>
              Create Event
            </Button>
          </Form.Item>
        </Form>
        
      </div>
    </div>
  )
}

export default CreateEvent