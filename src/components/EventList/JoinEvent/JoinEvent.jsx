import { Form, Input, Button } from 'antd'
import React from 'react'
import Slider from 'react-slick'

const JoinEvent = (props) => {
    const [form] = Form.useForm();
    const sliderRef = React.createRef();
    const sliderSettings = {
        dots: true,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        swipe: false,
        speed: 500,
    };
    const joinEventHandler = () => {
        sliderRef.current.slickNext();
        // props.setProgress(1);
    }
  return (
    <div>
        <Slider {...sliderSettings} ref={sliderRef} >
            <div>
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
            <div className='ed-event-link-div'>
                <h1 className='ed-event-link-heading'>Event Link</h1>
                <div className='ed-event-link-text'>{"props.event.eventLink"}</div>
            </div>
        </Slider>
    </div>
  )
}

export default JoinEvent