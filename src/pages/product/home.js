import React, { Component } from "react";
import { Card, Select, Input, Button, Table, message, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import LinkButton from "../../components/link-button";

import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";

const { Option } = Select;

// product的默认子路由组件
class ProductHome extends Component {
  state = {
    total: 0, //商品总数
    products: [], //商品数组
    loading: false, //是否正在加载
    searchName: "", //搜索关键字
    searchType: "productName", //根据搜索类型搜索
  };

  // 初始化table列
  initColums = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        width: 100,
        title: "价格",
        dataIndex: "price",
        // 如果没有指定 dataIndex，则传递的是对象，
        render: (price) => "￥" + price,
      },
      {
        width: 100,
        title: "状态",
        //dataIndex: "status",
        render: (product) => {
          const { status, _id } = product;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateState(_id, status === 1 ? 2 : 1)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        width: 100,
        title: "操作",
        render: (product) => {
          return (
            <span>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/detail", { product })
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/addupdate", { product })
                }
              >
                修改
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };

  //获取指定页码的数组
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; //保存当前页码，使得其他方法能够访问
    this.setState({ loading: true });
    const { searchType, searchName } = this.state;
    let result;
    //根据搜索类型 做分页搜索
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    if (result.status === 0) {
      const { total, list } = result.data;
      // console.log("total",total);
      // console.log("list",list);
      this.setState({
        total,
        products: list,
      });
    }
    this.setState({ loading: false });
  };

  // 更新指定商品状态 上架/下架
  updateState = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    // console.log("productId", productId);
    // console.log("status", status);
    // console.log("result", result);
    if (result.status === 0) {
      message.success("更新商品状态成功");
      this.getProducts(this.pageNum);
    }
  };

  UNSAFE_componentWillMount() {
    this.initColums();
  }

  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const { total, products, loading, searchName, searchType } = this.state;
    const title = (
      <Space>
        <Select
          value={searchType}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="请输入关键字"
          value={searchName}
          onChange={(e) => this.setState({ searchName: e.target.value })}
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </Space>
    );
    const extra = (
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => this.props.history.push("/product/addupdate")}
      >
        添加商品
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey="_id"
          dataSource={products}
          columns={this.columns}
          bordered
          loading={loading}
          pagination={{
            total,
            current: this.pageNum,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              this.getProducts(page);
            },
          }}
        />
      </Card>
    );
  }
}

export default ProductHome;
