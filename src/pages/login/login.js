import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Redirect } from 'react-router-dom'

import "./login.less";
import logo from "../../assets/images/aurolite.png";

// import { reqLogin } from "../../api";
// import { user as memoryUtils } from '../../utils/memoryUtils';
// import { storage as storageUtils} from '../../utils/storageUtils';
import { connect } from "react-redux";
import { login } from "../../redux/actions";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = async(values) => {
    const { username, password } = values;
    this.props.login(username, password);
  };

  onFinishFailed = (values, errorFields, outOfDate) => {
    console.log(values);
    console.log(errorFields);
    console.log(outOfDate);
  };

  render() {
    const user = this.props.user;
    if(user && user._id ){
      return <Redirect to="/home"></Redirect>
    }

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>奥莱后台管理系统</h1>
        </header>
        <section className="login-content">
          <div className={user.errMsg ? 'error-msg show' : 'error-msg'}>{user.errMsg}</div>
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

export default connect(
  state => ({user: state.user}),
  {login}
)(Login);
