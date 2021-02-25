import React, { Component } from "react";
import { Card, Button, Table, Space, Modal } from "antd";
import AddForm from "./add-form";

import { PlusOutlined } from "@ant-design/icons";
import { PAGE_SIZE } from "../../utils/constants";

import { reqRoles } from "../../api";

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [], //所有的roles
      role: {}, //选中的role
      isShowAdd: false, // 是否显示添加界面
      isShowAuth: false, // 是否显示设置权限界面
      loading: false,
    };
  }

  //初始化列的数组
  initColums = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "name",
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        key: "auth_time",
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
        key: "auth_name",
      },
    ];
  };

  getRoles = async () => {
    this.setState({ loading: true });
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    }
    this.setState({ loading: false });
  };

  onRow = (role) => {
    console.log(role);
    return {
      onClick: (event) => {
        this.setState({ role });
      }, // 点击行
    };
  };

  addRole = () => {};

  updateRole = () => {};

  UNSAFE_componentWillMount() {
    this.initColums();
  }

  componentDidMount() {
    this.getRoles();
  }

  render() {
    const { roles, role, loading, isShowAdd, isShowAuth } = this.state;
    const title = (
      <span>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => this.setState({ isShowAdd: true })}
          >
            创建角色
          </Button>
          <Button
            type="primary"
            disabled={!role._id}
            onClick={() => this.setState({ isShowAuth: true })}
          >
            设置角色权限
          </Button>
        </Space>
      </span>
    );

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              // 选择某个radio时回调
              this.setState({
                role,
              });
            },
          }}
          onRow={this.onRow}
          loading={loading}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false });
          }}
          okText="确定"
          cancelText="取消"
        >
          <AddForm setForm={(form) => (this.form = form)} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false });
          }}
          okText="确定"
          cancelText="取消"
        >
          {/* <AuthForm ref={this.auth} role={role} /> */}
        </Modal>
      </Card>
    );
  }
}

export default Role;
