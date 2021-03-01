import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Select } from "antd";

const { Item } = Form;
const { Option } = Select;

/*
添加或修改用户的form组件
 */
class UserForm extends Component {

  formRef = React.createRef();

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
  };

  componentDidMount() {
    this.props.setForm(this.formRef.current);
  }

  render() {
    const { roles, user } = this.props;
    const { username, password, email, phone, role_id } = user;
    //console.log('user',user);
    // 指定布局
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { offset: 3, pull: 3 }, // 右侧包裹的宽度
    };

    return (
      <Form
        ref={this.formRef}
        scrollToFirstError
        {...formItemLayout}
        onReset={this.onReset}
        preserve={false}
      >
        <Item
          label="用户名"
          name="username"
          initialValue={username}
          rules={[
            { required: true, message: "用户名必须输入" },
            { required: true, min: 4, message: "最小4位" },
            { required: true, max: 12, message: "最大12位" },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: "必须是英文、数字或下划线组成",
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Item>
        {user._id ? null : (
          <Item
            label="密码"
            name="password"
            initialValue={password}
            rules={[{ required: true, message: "密码必须输入" }]}
          >
            <Input type="password" placeholder="请输入密码" />
          </Item>
        )}
        <Item
          label="手机号"
          name="phone"
          initialValue={phone}
        >
          <Input placeholder="请输入手机号" />
        </Item>
        <Item
          label="邮箱"
          name="email"
          initialValue={email}
        >
          <Input placeholder="请输入邮箱" />
        </Item>
        <Item
          label="角色"
          name="role_id"
          initialValue={role_id}
        >
          <Select placeholder="请选择角色">
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    );
  }
}

export default UserForm;
