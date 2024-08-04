import request from "./request_bilibili";
import Fetch from "./Fetch";

// let tag = "https://192.168.0.63:3335";
// let tag = "https://snvtkd2005.com:3335";
// let tag = "";//开发环境
let tag = "http://snvtkd2005.com:3336";//正式环境

/**
 * 
 * @param {参数名	必选	类型	描述
code	是	string	[主播身份码]
app_id	是	integer(13位长度的数值，注意不要用普通int，会溢出的)	项目ID} params 
 * @returns 
 */

// export const Start = (params)=> request.post('/bilibili/v2/app/start',params);

// export const getAuth = (params)=> request.post('/bilibili/getAuth',params);
// export const heartBeatThis = (params)=> request.post('/bilibili/gameHeartBeat',params);
// export const gameStart = (params)=> request.post('/bilibili/gameStart',params);
// export const gameEnd = (params)=> request.post('/bilibili/gameEnd',params);

// 正式环境要去掉/bilibili
export const Start = (params)=> request.post('/v2/app/start',params);

export const getAuth = (params)=> request.post('/getAuth',params);
export const heartBeatThis = (params)=> request.post('/gameHeartBeat',params);
export const gameStart = (params)=> request.post('/gameStart',params);
export const gameEnd = (params)=> request.post('/gameEnd',params);

// export const Start = (data) => {
//     return Fetch({
//         method: "post",
//         url: `${tag}/bilibili/v2/app/start`,
//         data: data,
//     });
// }

// export const getAuth = (data) => {
//     return Fetch({
//         method: "post",
//         url: `${tag}/bilibili/getAuth2`,
//         data: data,
//     });
// }

// export const heartBeatThis = (data) => {
//     return Fetch({
//         method: "post",
//         url: `${tag}/bilibili/gameHeartBeat`,
//         data: data,
//     });
// }

// export const gameStart = (data) => {
//     return Fetch({
//         method: "post",
//         url: `${tag}/bilibili/gameStart`,
//         data: data,
//     });
// }

// export const gameEnd = (data) => {
//     return Fetch({
//         method: "post",
//         url: `${tag}/bilibili/gameEnd`,
//         data: data,
//     });
// }
 
 