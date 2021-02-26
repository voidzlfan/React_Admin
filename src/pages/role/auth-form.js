import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";

const Item = Form.Item;

/*
设置权限的form组件
 */
class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object,
  };

  constructor(props) {
    super(props);
    // 根据传入角色的menus生成初始状态
    const { menus } = props.role;
    this.state = {
      checkedKeys: menus,
    };
  }

  onCheck = (checkedKeys) => {
    //console.log(checkedKeys);
    this.setState({ checkedKeys });
  };

  /*
  为父组件提交获取最新menus数据的方法
   */
  getMenus = () => this.state.checkedKeys;

  UNSAFE_componentWillMount() {
    this.menuLists = [
      {
        title: "平台权限",
        key: "all",
        children: menuList,
      },
    ];
  }

  // 根据新传入的role来更新checkedKeys状态
  /*
  当组件接收到新的属性时自动调用
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    //console.log("componentWillReceiveProps()", nextProps);
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys: menus,
    });
  }

  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    };

    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          treeData={this.menuLists}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        />
      </div>
    );
  }
}

export default AuthForm;
