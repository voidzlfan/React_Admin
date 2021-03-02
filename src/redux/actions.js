import { SET_HEADER_TITLE } from "./action-types"




// 包含n个action creator函数的模块
// 同步action 返回对象 { type: '', data }
// 异步action 返回函数 dispatch = {}


// 设置头部标题的同步action
export const setHeaderTitle = (headTitle) => ({type: SET_HEADER_TITLE, data: headTitle})
