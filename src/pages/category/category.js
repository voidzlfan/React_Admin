import React, { Component } from "react";
import { Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";

import { reqCategorys, reqAddCategory, reqUpdateCategory } from "../../api";

import LinkButton from "../../components/link-button";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

import "./category.less";
import { PAGE_SIZE } from "../../utils/constants";

class Category extends Component {
  state = {
    loading: false,
    categorys: [], //一级分类列表
    subCategorys: [], //二级分类列表
    parentId: "0", //当前需要显示的分类列表的id
    parentName: "分类名称",
    showStatus: 0, // 标识添加、更新确认框是否显示，0都不显示，1显示添加，2显示更新
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
            <LinkButton onClick={() => this.showUpdate(category)}>
              修改分类
            </LinkButton>
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
  // parentId: 如果指定根据状态中parentId请求，如果指定了根据指定的parentId请求
  getCategorys = async (parentId) => {
    // 发请求前显示loading
    this.setState({ loading: true });
    parentId = parentId || this.state.parentId;
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
      parentId: "0",
      subCategorys: [],
      parentName: "",
    });
  };

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

  // 隐藏弹框
  handleCancel = () => {
    //this.form.resetFields();
    this.setState({
      showStatus: 0,
    });
  };

  // 显示添加弹框
  showAdd = () => {
    this.setState({
      showStatus: 1,
    });
  };

  // 添加分类
  addCategory = async () => {
    this.form
      .validateFields()
      .then(async (values) => {
        // 1.隐藏弹框
        this.setState({
          showStatus: 0,
        });
        // 2.收集数据，发送请求
        const { parentId, categoryName } = values;
        // console.log(parentId);
        // console.log(categoryName);
        const result = await reqAddCategory(categoryName, parentId);
        if (result.status === 0) {
          // 3.重新显示列表
          if (parentId === this.state.parentId) {
            // 如果添加的是当前分类下的列表，则刷新，其他分类的不刷新
            this.getCategorys();
          } else if (parentId === "0") {
            // 在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示
            this.getCategorys("0");
          }
        }
      })
      .catch((err) => {
        //console.log(err);
        message.info("请输入分类名称");
      });
  };

  // 显示更新弹框
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category;
    this.setState({
      showStatus: 2,
    });
  };

  // 更新分类
  updateCategory = () => {
    this.form
      .validateFields()
      .then(async (values) => {
        // 1.隐藏弹框
        this.setState({
          showStatus: 0,
        });
        // 2.发请求更新
        const parentId = this.category._id;
        const { categoryName } = values;
        //this.form.resetFields();

        //console.log('categoryName',categoryName);
        const result = await reqUpdateCategory({ parentId, categoryName });
        if (result.status === 0) {
          // 3.重新显示列表
          message.success("修改分类名称成功")
          this.getCategorys();
        }
      })
      .catch((err) => {
        //console.log(err);
        message.info("请输入分类名称");
      });
  };

  UNSAFE_componentWillMount() {
    this.initColums();
  }

  // 发异步请求
  componentDidMount() {
    this.getCategorys();
  }

  render() {
    const {
      loading,
      parentId,
      parentName,
      categorys,
      subCategorys,
      showStatus,
    } = this.state;

    // 读取指定分类
    const category = this.category || {};

    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <ArrowRightOutlined style={{ marginRight: 8 }} />
          <span>{parentName}</span>
        </span>
      );
    const extra = (
      <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>
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
          pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
          destroyOnClose
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => (this.form = form)}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
          destroyOnClose
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => (this.form = form)}
          />
        </Modal>
      </Card>
    );
  }
}

export default Category;
