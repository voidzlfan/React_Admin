import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Select, Input } from "antd";

const { Item } = Form;
const { Option } = Select;

// 添加分类form组件
class AddForm extends Component {
  formRef = React.createRef();

  static propTypes = {
    categorys: PropTypes.array, // 一级分类数组
    parentId: PropTypes.string, // 父分类的Id
    setForm: PropTypes.func,
  };

  componentDidMount() {
    //console.log(this.formRef);
    this.props.setForm(this.formRef.current);
  }

  render() {
    const { categorys, parentId } = this.props;

    return (
      <Form ref={this.formRef}>
        <Item name="parentId" initialValue={parentId}>
          <Select>
            <Option value="0">一级分类</Option>
            {categorys.map((item) => {
              //console.log(item._id);
              return (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Item>
        <Item
          name="categoryName"
          rules={[{ required: true, message: "请输入分类名称" }]}
        >
          <Input placeholder="请输入分类名称" />
        </Item>
      </Form>
    );
  }
}

export default AddForm;
