import React from 'react'

const JoinEvent = () => {
    const { userDetails, setUserDetails, joinEventHandler } = props;
    
  return (
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
  )
}

export default JoinEvent