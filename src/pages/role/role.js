import React, { Component } from "react";
import { Card, Button, Table, Space, Modal, message } from "antd";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import { connect } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

import { PAGE_SIZE } from "../../utils/constants";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import { formateDate } from "../../utils/dateUtils";
import { logout } from "../../redux/actions";


class Role extends Component {
  auth = React.createRef();

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
        render: formateDate,
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        key: "auth_time",
        render: (create_time) => formateDate(create_time),
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
    return {
      onClick: (event) => {
        //console.log(role);
        this.setState({ role });
      }, // 点击行
    };
  };

  addRole = () => {
    //console.log(this.form);
    this.form
      .validateFields()
      .then(async (values) => {
        // 1.隐藏弹框
        this.setState({
          isShowAdd: false,
        });
        // 2.发请求更新
        const { roleName } = values;
        const result = await reqAddRole(roleName);
        if (result.status === 0) {
          message.success("添加角色成功");
          this.getRoles();
        }
      })
      .catch((err) => {
        //console.log(err);
        message.error("添加角色失败");
      });
  };

  updateRole = async () => {
    this.setState({
      isShowAuth: false,
    });
    //console.log(this.auth.current.getMenus());
    const menu = this.auth.current.getMenus();
    const { role } = this.state;
    role.menus = menu;
    role.auth_name = this.props.user.username;
    role.auth_time = Date.now();
    console.log(role);
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      if (role._id === this.props.user.role_id) {
        // 退出登录
        this.props.logout();
        message.success('当前用户角色权限成功，请重新登录')
      } else {
        message.success('设置角色权限成功')
        this.getRoles();
      }
    } else {
      message.error("更新失败");
    }
  };

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
          <AuthForm ref={this.auth} role={role} />
        </Modal>
      </Card>
    );
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(Role);
