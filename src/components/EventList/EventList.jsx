import React, { useEffect } from 'react'
import './EventList.css'
import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import Loader from '../../shared/Loader/Loader'
import { Buffer } from 'buffer'

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
  
  const [tableState, setTableState] = useState(null);
  const [events, setEvents] = useState(null);

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
      const events = await tableland.read(`SELECT * FROM _80001_1803`);
      setEvents(events);
      setTableState(tableland);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.Buffer = Buffer;
    initTableLand();
  }, []);

  const fetchEvents = async () => {
    await initTableLand();
    const events = await tableState.read(`SELECT * FROM _80001_1803`);
    setEvents(events);
    console.log(events);
  }

  return (
    <div className='el-div'>
      <h1 className='el-heading'>Events</h1>
      <div className='el-grid-div'>
        {
            events ?
            events.rows.length > 0 ?
            events.rows.map((item, index) => {
              return (
                <Card
                  key={index}
                  cover={<img src={`https://gateway.pinata.cloud/ipfs/${item[2]}`} alt={item.name} className='el-cover-img' />}
                  className='el-card'
                  onClick={()=>navigate(`/events/${item[0]}`)}
                >
                  <h3 className='el-card-heading'>{item[1]}</h3>
                  <h3 className='el-card-heading'>{item[4]} - {item[5]}</h3>
                  <h3 className='el-card-heading'>{item[6]} - {item[7]}</h3>
                  <p className='el-card-para'>{item[3].length > 150 ? item[3].substring(0, 150) + '...' : item[3]}</p>
                </Card>
              )
            })
            :
            <h2 className='el-no-events'>No Events to show : (</h2>
            :
            <Loader />
        }
      </div>
    </div>
  )
}

export default EventList