import { SET_HEADER_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from "./action-types";
import { storage as storageUtils } from "../utils/storageUtils";
import { reqLogin } from "../api";

// 包含n个action creator函数的模块
// 同步action 返回对象 { type: '', data }
// 异步action 返回函数 dispatch = {}


// 设置头部标题的同步action
export const setHeaderTitle = (headTitle) => ({type: SET_HEADER_TITLE, data: headTitle})

// 接收用户信息同步action
export const receiveUser = (user) => ({type: RECEIVE_USER, data: user})

// 显示错误信息的同步action
export const showErrorMsg = (errMsg) => ({type: SHOW_ERROR_MSG, data: errMsg})

// 退出登录的同步action
export const logout = () => {
    // 删除local中的user
    // 再返回action
    storageUtils.removeUser();
    return {type: RESET_USER}
}

// 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        const result = await reqLogin(username, password);
        if(result.status === 0){
            const user = result.data;
            // 分发接收用户的同步action
            dispatch(receiveUser(user));
            // 保存到local
            storageUtils.saveUser(user);
        }else{
            const msg = result.msg;
            dispatch(showErrorMsg(msg))
        }
    }
}


