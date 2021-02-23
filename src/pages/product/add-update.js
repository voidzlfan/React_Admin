import React, { Component } from "react";
import { Card, Form, Input, Cascader, Upload, Button, InputNumber } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const { Item } = Form;
const { TextArea } = Input;

// product的添加和更新子路由
class ProductAddUpdate extends Component {
  onFinish = (values) => {
    console.log(values);
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 1 },
    };

    const title = (
      <span>
        <Button
          icon={<LeftOutlined />}
          style={{ marginRight: 15 }}
          onClick={() => this.props.history.goBack()}
        ></Button>
        <span>添加商品</span>
      </span>
    );
    return (
      <Card title={title}>
        <Form {...formItemLayout} onFinish={this.onFinish}>
          <Item
            name="name"
            label="商品名称"
            initialValue=""
            rules={[{ required: true, message: "必须输入商品名称" }]}
          >
            <Input
              placeholder="请输入商品名称"
              style={{ width: 200, marginLeft: 10 }}
            />
          </Item>
          <Item
            name="desc"
            label="商品描述"
            rules={[{ required: true, message: "必须输入商品描述" }]}
          >
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder="请输入商品描述"
              style={{ width: 400, marginLeft: 10 }}
            />
          </Item>
          <Item
            name="price"
            label="商品价格"
            rules={[{ required: true, message: "必须输入商品价格" }]}
          >
            <InputNumber
              min={1}
              max={99999999}
              placeholder="请输入商品价格"
              style={{ width: 200, marginLeft: 10 }}
            />
          </Item>
          <Item label="商品分类">
            <Input
              type="number"
              placeholder="请选择商品分类"
              style={{ width: 200, marginLeft: 10 }}
            />
          </Item>
          <Item label="商品图片">
            <Input
              type="number"
              placeholder="请上传商品图片"
              style={{ width: 200, marginLeft: 10 }}
            />
          </Item>
          <Item label="商品详情">
            <Input
              type="number"
              placeholder="请输入商品详情"
              style={{ width: 200, marginLeft: 10 }}
            />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default ProductAddUpdate;
