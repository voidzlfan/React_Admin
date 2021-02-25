import React, { Component } from "react";
import { Card, Button, List, Image } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api";

// 商品的详情页
class ProductDetail extends Component {
  state = {
    cName1: "", //一级分类名
    cName2: "", //二级分类名
  };

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product;
    if (pCategoryId === "0") {
      const result = await reqCategory(categoryId);
      const cName1 = result.data.name;
      this.setState({ cName1 });
    } else {
      //多个请求，后一个请求在前一个请求返回后才发送，效率低
      //   const result1 = await reqCategory(pCategoryId);
      //   const result2 = await reqCategory(categoryId);
      //   const cName1 = result1.data.name;
      //   const cName2 = result2.data.name;

      //一次性发送多个请求
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({ cName1, cName2 });
    }
  }

  render() {
    const { cName1, cName2 } = this.state;

    const title = (
      <span>
        <Button
          icon={<LeftOutlined />}
          style={{ marginRight: 15 }}
          onClick={() => this.props.history.goBack()}
        ></Button>
        <span>商品详情</span>
      </span>
    );

    const {
      name,
      desc,
      detail,
      price,
      imgs,
    } = this.props.location.state.product;
    //console.log(product);

    return (
      <Card title={title} className="product-detail">
        <List
          //   header={<div>Header</div>}
          //   footer={<div>Footer</div>}
          size="large"
          bordered
          //dataSource={data}
          //renderItem={item => <List.Item>{item}</List.Item>}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
        >
          <List.Item>
            <span className="left">商品名称：</span>
            <span>{name}</span>
          </List.Item>

          <List.Item>
            <span className="left">商品描述：</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className="left">商品价格：</span>
            <span>{price}</span>
          </List.Item>
          <List.Item>
            <span className="left">所属分类：</span>
            <span>
              {cName1} {cName2 ? " --> " + cName2 : ""}
            </span>
          </List.Item>
          <List.Item>
            <span className="left">商品图片：</span>
            {imgs.map((img) => (
              <Image
                key={img}
                //className="product-img"
                width={200}
                alt="img"
                src={BASE_IMG_URL + img}
              />
            ))}
          </List.Item>
          <List.Item>
            <span className="left">商品详情：</span>
            <span
              dangerouslySetInnerHTML={{ __html: detail }}
              className="product-detail-item"
            ></span>
          </List.Item>
        </List>
      </Card>
    );
  }
}

export default ProductDetail;
