import React from 'react'
import './Navbar.css'
import { Menu, Button } from 'antd';
import { ClusterOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <div className='nav-div'>
        <Menu className='navbar' mode="horizontal" theme='dark'>
            <div className='nav-logo-div'>
                <ClusterOutlined className='nav-logo' />
                <span className='logo-heading'>
                    Flexipay
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