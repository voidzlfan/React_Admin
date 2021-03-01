import React, { Component } from "react";
import { Card, Table, Button, Modal, Space, message } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { PAGE_SIZE } from "../../utils/constants";

import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from "../../api";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import UserForm from "./user-form";

// 用户管理
class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roles: [],
      isShow: false,
      loading: false,
    };
  }

  //初始化列的数组
  initColums = () => {
    this.columns = [
      {
        title: "用户名",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "电话",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "注册时间",
        dataIndex: "create_time",
        key: "create_time",
        render: formateDate,
      },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: "操作",
        render: (user) => (
          <Space>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </Space>
        ),
      },
    ];
  };

  // 显示更新对话框
  showUpdate = (user) => {
    this.user = user;
    this.setState({ isShow: true });
  };

  // 根据 role 数组生成角色名的对象，避免重复查询
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    this.roleNames = roleNames;
  };

  // 获取所有用户
  getUsers = async () => {
    this.setState({ loading: true });
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleNames(roles);
      this.setState({ users, roles });
    }
    this.setState({ loading: false });
  };

  // 删除用户
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除用户成功");
          this.getUsers();
        }
      },
      okText: "删除",
      cancelText: "取消",
    });
  };

  // 添加或者更新用户
  addOrUpdateUser = () => {
    this.form
      .validateFields()
      .then(async (values) => {
        // 1.隐藏弹框
        this.setState({
          isShow: false,
        });
        const user = values;
        //console.log(values);
        // 如果是更新, 需要给user指定_id属性
        if (this.user) {
          user._id = this.user._id;
        }
        // 2.发请求更新
        const result = await reqAddOrUpdateUser(user);
        if (result.status === 0) {
          message.success(`${this.user ? "修改" : "添加"}用户成功`);
          this.getUsers();
        }
      })
      .catch((err) => {
        message.error(`${this.user ? "修改" : "添加"}用户失败`);
      });
  };

  UNSAFE_componentWillMount() {
    this.initColums();
  }

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users, roles, isShow, loading } = this.state;
    const user = this.user || {};
    const title = (
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          this.user = null;
          this.setState({ isShow: true });
        }}
      >
        创建用户
      </Button>
    );
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          loading={loading}
        />
        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields();
            this.setState({ isShow: false });
          }}
          okText="确定"
          cancelText="取消"
          destroyOnClose
        >
          <UserForm
            setForm={(form) => (this.form = form)}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    );
  }
}

export default User;
