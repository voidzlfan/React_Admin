import React, { Component } from "react";

import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import "./login.less";
import logo from "./img/logo.png";

import { reqLogin } from "../../api";
import memoryUtils from '../../utils/memoryUtils'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = async(values) => {
    const { username, password } = values;
    const result = await reqLogin(username, password);
    //console.log("请求成功", result);

    if(result.status===0){
      message.success('登录成功')
      const user = result.data;
      memoryUtils.user = user;
      this.props.history.replace('/')
      console.log("请求成功", result);

    }else{
      message.error(result.msg);
      console.log("请求失败", result);
    }


    //console.log('Received values of form: ', values);
  };

  onFinishFailed = (values, errorFields, outOfDate) => {
    console.log(values);
    console.log(errorFields);
    console.log(outOfDate);
  };

  render() {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>奥莱React项目：后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "请输入用户名" },
                { required: true, min: 4, message: "最小4位" },
                { required: true, max: 12, message: "最大12位" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "必须是英文、数字或下划线组成",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}

export default Login;
