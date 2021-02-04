import React, { Component } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import "./index.less";

import { Menu } from "antd";
import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    ShopOutlined,
    AreaChartOutlined
    
  } from '@ant-design/icons';

const { SubMenu } = Menu;


class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="left-nav">
        <Link to="/home" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>奥莱后台</h1>
        </Link>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/home">首页</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<ShopOutlined />} title="商品">
            <Menu.Item key="2"><Link to="/category">品类管理</Link></Menu.Item>
            <Menu.Item key="3"><Link to="/product">商品管理</Link></Menu.Item>
          </SubMenu>
          <Menu.Item key="4" icon={<UserOutlined />}>
            <Link to="/user">用户管理</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<SettingOutlined />}>
            <Link to="/role">角色管理</Link>
          </Menu.Item>

          <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图表">
            <Menu.Item key="6"><Link to="/charts/bar">柱状图</Link></Menu.Item>
            <Menu.Item key="7"><Link to="/charts/line">折线图</Link></Menu.Item>
            <Menu.Item key="8"><Link to="/charts/pie">饼形图</Link></Menu.Item>
          </SubMenu>
          
        </Menu>
      </div>
    );
  }
}

export default LeftNav;
