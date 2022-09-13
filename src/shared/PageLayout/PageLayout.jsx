import React, { useState } from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import SideNav from '../SideNav/SideNav'
import './PageLayout.css'

const PageLayout = ({ children }) => {
  const [item, setItem] = useState('createPool')
  const location = useLocation();

  useEffect(()=> {
    setItem(location.pathname.split('/')[1])
  }, [location])

  return (
    <div className='pagelayout-div'>
        <div className='pl-div1'>
            <Navbar />
        </div>
        <div className='pl-div2'>
            {
                location.pathname !== '/' && <SideNav ci={{ item: item, setItem: setItem }} />
            }
            <div className='pl-content-div'>
                {children}
            </div>
        </div>
    </div>
  )
}

export default PageLayout