import React, { Component } from "react";
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  message,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";

import PicturesWall from './pictures-wall'

import { reqCategorys } from "../../api";

const { Item } = Form;
const { TextArea } = Input;

// product的添加和更新子路由
class ProductAddUpdate extends Component {
  formRef = React.createRef();

  state = {
    options: [],
  };

  constructor (props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  // 初始化options数组
  initOptions = async (categorys) => {
    const options = categorys.map((item) => ({
      value: item._id,
      label: item.name,
      isLeaf: false,
    }));

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );

      // 关联对应的一级option上
      targetOption.children = childOptions;
    }

    this.setState({
      options,
    });
    //console.log(options);
  };

  // 异步获取一级二级分类列表
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        // 一级列表
        this.initOptions(categorys);
      } else {
        return categorys;
      }
    } else {
      message.error("获取分类列表失败");
    }
  };

  // 加载下一级的回调
  loadData = async (selectedOptions) => {
    // 得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // 显示加载
    targetOption.loading = true;
    // 根据选择的option对象，异步获取二级列表
    // console.log(targetOption);
    const subCategorys = await this.getCategorys(targetOption.value);
    // console.log('subCategorys',subCategorys);
    // 关闭加载
    targetOption.loading = false;
    // 将二级列表挂到一级列表上
    if (subCategorys && subCategorys.length > 0) {
      const childOption = subCategorys.map((item) => ({
        value: item._id,
        label: item.name,
        isLeaf: false,
      }));
      targetOption.children = childOption;
    } else {
      //当前选中分类没有二级分类
      targetOption.isLeaf = true;
    }
    this.setState({
      options: [...this.state.options],
    });
  };

  onChange = (value, selectedOptions) => {
    //console.log(value, selectedOptions);
  };

  onFinish = (values) => {
    console.log(values);
    console.log("img",this.pw.current.getImgs());
  };

  UNSAFE_componentWillMount() {
    const state = this.props.location.state;
    this.isUpdate = !!state;
    if (state !== undefined) {
      this.product = state.product;
    } else {
      this.product = {};
    }
    //console.log(this.product);
    //console.log(this.isUpdate);
  }

  componentDidMount() {
    this.getCategorys("0");
  }

  render() {
    const { options } = this.state;
    const { isUpdate, product } = this;
    //console.log(product);
    // 接收级联分类ID的数组
    const categoryIds = [];
    if (isUpdate) {
      if (product.pCategoryId === "0") {
        categoryIds.push(product.pCategoryId);
      } else {
        categoryIds.push(product.pCategoryId);
        categoryIds.push(product.categoryId);
      }
    }

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
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );

    return (
      <Card title={title}>
        <Form ref={this.formRef} {...formItemLayout} onFinish={this.onFinish}>
          <Item
            name="name"
            label="商品名称"
            initialValue={product.name}
            rules={[{ required: true, message: "必须输入商品名称" }]}
          >
            <Input
              placeholder="请输入商品名称"
              style={{ width: 300, marginLeft: 10 }}
            />
          </Item>
          <Item
            name="desc"
            label="商品描述"
            initialValue={product.desc}
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
            initialValue={product.price}
            rules={[
              { required: true, message: "必须输入商品价格" },
              {
                pattern: /^[0-9e]+$/,
                message: "必须是数字，且大于等于0",
              },
            ]}
          >
            <Input
              min={1}
              max={99999999}
              type="number"
              placeholder="请输入商品价格"
              addonAfter="元"
              style={{ width: 300, marginLeft: 10 }}
            />
          </Item>
          <Item
            name="categoryIds"
            label="商品分类"
            initialValue={categoryIds}
            rules={[{ required: true, message: "必须指定商品分类" }]}
          >
            <Cascader
              style={{ width: 300, marginLeft: 10 }}
              options={options} // 需要显示的数据
              loadData={this.loadData} // 点击列表选型，加载下一级列表的监听回调
              onChange={this.onChange} // 选择完成后的回调
              changeOnSelect
              placeholder="请选择商品分类"
            />
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={product.imgs}/>
          </Item>
          <Item label="商品详情">
            <TextArea
              autoSize={{ minRows: 4, maxRows: 6 }}
              placeholder="请输入商品详情"
              style={{ width: 300, marginLeft: 10 }}
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
