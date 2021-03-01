import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import aurolite from "../../assets/images/aurolite.png";
import "./index.less";

import { Menu } from "antd";

import menuList from "../../config/menuConfig";

import { user as memoryUtils } from "../../utils/memoryUtils";

const { SubMenu } = Menu;

class LeftNav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }

  /*
  判断当前登陆用户对item是否有权限
   */
  hasAuth = (item) => {
    const { key, isPublic } = item;

    const menus = memoryUtils.user.role.menus;
    const username = memoryUtils.user.username;
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find((child) => menus.indexOf(child.key) !== -1);
    }
    return false;
  };

  /*
  根据menuList数据生成对应标签数组
  */
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;

    return menuList.reduce((pre, item) => {
      // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        // 向pre添加<Menu.Item>
        if (!item.children) {
          pre.push(
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          );
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(
            (cItem) => path.indexOf(cItem.key) === 0
          );
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }

          // 向pre添加<SubMenu>
          pre.push(
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          );
        }
      }
      return pre;
    }, []);
  };

  render() {
    const { openKey, menuNodes } = this;
    let pathName = this.props.location.pathname || "/home";
    if (pathName.includes("/product")) {
      pathName = "/product";
    }

    return (
      <div className="left-nav">
        <Link to="/home" className="left-nav-header">
          <img src={aurolite} alt="logo" />
          {/* <h1>奥莱后台</h1> */}
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
