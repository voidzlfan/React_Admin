import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ProductHome from "./home";
import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";

import "./product.less";

// 商品路由
class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Switch>
        {/* 默认模糊匹配，不加exact将导致/product/addupdate等子路由，一直匹配 /product */}
        <Route exact path="/product" component={ProductHome} />
        <Route path="/product/addupdate" component={ProductAddUpdate} />
        <Route path="/product/detail" component={ProductDetail} />
        <Redirect to="/product" />
      </Switch>
    );
  }
}

export default Product;
