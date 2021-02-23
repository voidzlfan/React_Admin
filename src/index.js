import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { user as memoryUtils } from './utils/memoryUtils' 
import { storage as storageUtils } from './utils/storageUtils'


// 读取local中的user，保存到内存
const user = storageUtils.getUser();
memoryUtils.user = user;
//console.log(user);

ReactDOM.render(<App />, document.getElementById("root"));
