import React from 'react'
import './EventList.css'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'

const EventList = () => {
  const navigate = useNavigate();
  const data = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    }
  ];
  
  

  return (
    <div className='el-div'>
      <h1 className='el-heading'>Events</h1>
      <div className='el-grid-div'>
        {
            data.map((item, index) => {
              return (
                <Card
                  key={index}
                  cover={<img src={item.eventPosterUrl} alt={item.name} className='el-cover-img' />}
                  className='el-card'
                  onClick={()=>navigate(`/events/${index}`)}
                >
                  <h3 className='el-card-heading'>{item.eventName}</h3>
                  <h3 className='el-card-heading'>{item.eventStartEndDate[0]} - {item.eventStartEndDate[1]}</h3>
                  <h3 className='el-card-heading'>{item.eventStartEndTime[0]} - {item.eventStartEndTime[1]}</h3>
                  <p className='el-card-para'>{item.aboutEvent.length > 150 ? item.aboutEvent.substring(0, 150) + '...' : item.aboutEvent}</p>
                </Card>
              )
            })
        }
      </div>
    </div>
  )
}

export default EventList