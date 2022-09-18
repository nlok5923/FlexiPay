import React from 'react'
import './Navbar.css'
import { Menu, Button } from 'antd';
import { ClusterOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GiSplashyStream } from 'react-icons/gi'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    const navigate = useNavigate();
  return (
    <div className='nav-div'>
        <Menu className='navbar' mode="horizontal" theme='dark'>
            <div className='nav-logo-div' onClick={()=>navigate('/')}>
                <img src="/assets/images/flexipay-logo.png" alt="flexipay-logo.png" className='nav-logo' />
                <span className='logo-heading'>
                    FlexiPay
                </span>
            </div>
            <div className='navbar-btn-div'>
                <ConnectButton className='nav-btn' />
            </div>
        </Menu>
    </div>
  )
}

export default Navbar