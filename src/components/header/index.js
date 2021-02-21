import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { formateDate } from "../../utils/dateUtils";
import { user as memoryUtils } from "../../utils/memoryUtils";
import { storage as storageUtils } from "../../utils/storageUtils";
import { reqWeather } from "../../api";
import menuList from '../../config/menuConfig'

import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from '../link-button'

import "./index.less";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: formateDate(Date.now()), // 当前时间
      weather: "",
    };
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };

  getWeather = async () => {
    const { weather } = await reqWeather();
    this.setState({
      weather,
    });
  };

  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item=>{
        if(item.key === path){
            title = item.title;
        }else if(item.children){
            const cItem = item.children.find(cItem=> cItem.key === path)
            if(cItem){
                title = cItem.title;
            }
        }
    })
    return title;
  }

  logout = () => {
    Modal.confirm({
        //title: 'Do you Want to delete these items?',
        icon: <ExclamationCircleOutlined />,
        content: '确定退出吗？',
        onOk: () => {
          //console.log('OK');
          storageUtils.removeUser();
          memoryUtils.user = {};
          this.props.history.replace('/login')
        },
        onCancel() {
          //console.log('Cancel');
        },
      });
  }

  componentDidMount() {
    this.getTime();
    this.getWeather();
  }

  componentWillUnmount(){
    clearInterval(this.intervalId)
  }

  render() {
    const { currentTime, weather } = this.state;
    const username = memoryUtils.user.username;
    const title = this.getTitle();

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton href="#" onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img
              src="http://api.map.baidu.com/images/weather/day/qing.png"
              alt="weather"
            />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Header);
