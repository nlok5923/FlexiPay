import React, { useEffect } from 'react'
import './EventList.css'
import { Card, Alert } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import Loader from '../../shared/Loader/Loader'
import { Buffer } from 'buffer'
import tableNames from '../../databaseConfig'

const EventList = () => {
  // final event table we have is: _80001_1963
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

  // function sortObjectByKeys(o) {
  //   return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
  // }

  const alchemyToEventNode = (events) => {
    let newEvents = {
      columns: [],
      rows: [],
    }

    for(var prop in events) {
      let newEvent = [];
      if(Object.prototype.hasOwnProperty.call(events, prop)) {
        // let sortedEvent = sortObjectByKeys(events[prop]);
        if(newEvents.columns.length === 0) {
          newEvents.columns = Object.keys(events[prop]);
        }
        newEvent = Object.values(events[prop]);
        newEvents.rows.push(newEvent);
      }
    }
    return newEvents;
  } 

  const initTableLand = async () => {
    try {
      const wallet = new Wallet(
        process.env.REACT_APP_PRIVATE_KEY
      );
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
      const events = await tableland.read(`SELECT * FROM ${tableNames.EVENT_DETAILS}`);
      const newEvents = alchemyToEventNode(events);
      setEvents(newEvents);
      console.log(" these are all new events ", newEvents);
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
    const events = await tableState.read(`SELECT * FROM ${tableNames.EVENT_DETAILS}`);
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
                  cover={<img src={`${process.env.REACT_APP_MORALIS_IPFS_URL}${item[2]}`} alt={item.name} className='el-cover-img' />}
                  className='el-card'
                  onClick={()=>navigate(`/events/${item[0]}`)}
                >
                  <Alert message={'Event over'} type='success' showIcon className='el-alert' />
                  <h3 className='el-card-heading'>{item[1]}</h3>
                  <h3 className='el-card-heading'>{item[4]} - {item[5]}</h3>
                  <h3 className='el-card-heading'>{item[6]} - {item[7]}</h3>
                  <p className='el-card-para'>{item[3].length > 150 ? item[3].substring(0, 150) + '...' : item[3]}</p>
                </Card>
              )
            })
            :
            <div className='el-no-events-div'>
              <h2 className='el-no-events'>No Events to show : (</h2>
            </div>
            :
            <Loader />
        }
      </div>
    </div>
  )
}

export default EventList