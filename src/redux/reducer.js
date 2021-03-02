import { storage as storageUtils } from "../utils/storageUtils";
import { combineReducers } from "redux";
import { SET_HEADER_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from "./action-types";

// 用来根据旧的state和指定的action生成并返回新的state的函数

// 用来管理头部标题 reducer
const initHeaderTitle = "首页";
const initUser = storageUtils.getUser() || {};
function headerTitle(state = initHeaderTitle, action) {
  switch (action.type) {
    case SET_HEADER_TITLE:
      return action.data;
    default:
      return state;
  }
}
// 用来管理用户登录 reducer
function user(state = initUser, action) {
  switch (action.type) {
    case RECEIVE_USER:
      return action.data;
    case SHOW_ERROR_MSG:
      const errMsg = action.data;
      return {...state, errMsg};
    case RESET_USER:
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  headerTitle,
  user,
});
