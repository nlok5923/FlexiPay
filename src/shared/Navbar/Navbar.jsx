import React from 'react'
import './Navbar.css'
import { Menu, Button } from 'antd';
import { ClusterOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';

const Navbar = () => {
  return (
    <div className='nav-div'>
        <Menu className='navbar' mode="horizontal" theme='dark'>
            <div className='nav-logo-div'>
                <ClusterOutlined className='nav-logo' />
                <span className='logo-heading'>
                    Cluster Protocol
                </span>
            </div>
            {/* <div className='navbar-btn-div'> */}
                {/* <Button className='nav-btn'>
                    Connect
                </Button> */}
                {/* <ConnectButton className='nav-btn' /> */}
            {/* </div> */}
        </Menu>
    </div>
  )
}

export default Navbar