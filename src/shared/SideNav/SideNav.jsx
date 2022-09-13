import React from 'react';
import "./SideNav.css";
import { Menu } from 'antd';
import { MdEventNote } from 'react-icons/md';
import { BiAddToQueue } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';


function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Create Event', 'create-event', <BiAddToQueue style={{ fontSize: '1.2vw', color: 'white' }}/>),
  getItem('Events', 'events', <MdEventNote style={{ fontSize: '1.2vw', color: 'white' }}/>),
];

const SideNav = (props) => {
  const ci = props.ci;
  const navigate = useNavigate();
  const onClick = (e) => {
    ci.setItem(e.key);
    navigate(e.key);
  };

  return (
      <Menu
        onClick={onClick}
        collapsedWidth={0}
        selectedKeys={ci.item}
        defaultSelectedKeys={['create-event']}
        mode="inline"
        items={items}
        theme={'dark'}
        className="side-nav-menu"
      />
  );
};

export default SideNav;