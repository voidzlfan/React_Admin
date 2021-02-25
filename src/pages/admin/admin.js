import React, { Component } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import { user as memoryUtils } from "../../utils/memoryUtils";

import Header from '../../components/header'
import LeftNva from '../../components/left-nav'

import Home from '../home/home'
import Category from '../category/category'
import User from '../user/user'
import Role from '../role/role'
import Product from '../product/product'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


const { Footer, Sider, Content } = Layout;

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const user = memoryUtils.user;

    if (!user || !user._id) {
      return <Redirect to="/login"></Redirect>;
    }

    return (
      <Layout style={{minHeight:'100%'}}>
        <Sider>
            <LeftNva/>
        </Sider>
        <Layout>
          <Header/>
          <Content style={{margin: 20, backgroundColor: '#fff'}}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/Pie' component={Pie} />
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{textAlign:'center'}}>推荐使用Google浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Admin;
