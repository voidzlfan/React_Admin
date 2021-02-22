import React, { Component } from "react";
import { Card, Table, Button, message } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";

import { reqCategorys } from "../../api";

import LinkButton from "../../components/link-button";

import "./category.less";

class Category extends Component {
  state = {
    loading: false,
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    parentId: "0", //当前需要显示的分类列表的id
    parentName: "分类名称",
  };

  //初始化列的数组
  initColums = () => {
    this.columns = [
      {
        title: "分类的名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "操作",
        width: 300,
        dataIndex: "",
        key: "",
        render: (category) => (
          <span>
            <LinkButton>修改分类</LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };

  // 异步获取分类列表
  getCategorys = async () => {
    // 发请求前显示loading
    this.setState({ loading: true });
    const { parentId } = this.state;
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      if (parentId === "0") {
        this.setState({
          categorys: result.data,
        });
      } else {
        this.setState({
          subCategorys: result.data,
        });
      }
    } else {
      message.error("获取分类列表失败");
    }
    this.setState({ loading: false });
  };

  showCategorys = () => {
    this.setState({
      parentId: '0',
      subCategorys: [],
      parentName: '',
    })
  }

  // 点击显示二级分类列表
  showSubCategorys = (category) => {
    const { _id, name } = category;
    this.setState(
      {
        parentId: _id,
        parentName: name,
      },
      () => {
        this.getCategorys();
      }
    );
    // 二级分类
  };

  UNSAFE_componentWillMount() {
    this.initColums();
  }

  // 发异步请求
  componentDidMount() {
    this.getCategorys();
  }

  render() {
    const { loading, parentId, parentName, categorys, subCategorys } = this.state;

    const title = parentId === '0' ? "一级分类列表": (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined style={{marginRight: 8}}/> 
        <span>{parentName}</span>
      </span>
    );
    const extra = (
      <Button type="primary" icon={<PlusOutlined />}>
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          loading={loading}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />
      </Card>
    );
  }
}

export default Category;
