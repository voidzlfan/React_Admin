import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import "./index.less";

import { Menu } from "antd";

import menuList from "../../config/menuConfig";

const { SubMenu } = Menu;

class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList);
  }

  /*
  根据menuList数据生成对应标签数组
  */
  getMenuNodes = (menuList) => {
    const pathName = this.props.location.pathname;
    return menuList.map((item) => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        );
      } else {

        const cItem = item.children.find(cItem=>cItem.key === pathName);
        if(cItem){
          this.openKey = item.key;
        } 

        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };

  render() {

    const { openKey, menuNodes } = this;
    const pathName = this.props.location.pathname || '/home';

    return (
      <div className="left-nav">
        <Link to="/home" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>奥莱后台</h1>
        </Link>
        <Menu
          selectedKeys={[pathName]}
          //defaultSelectedKeys={[pathName]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {menuNodes}
        </Menu>
      </div>
    );
  }
}

export default withRouter(LeftNav);
