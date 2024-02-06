import request from "./request_bilibili";


/**
 * 
 * @param {参数名	必选	类型	描述
code	是	string	[主播身份码]
app_id	是	integer(13位长度的数值，注意不要用普通int，会溢出的)	项目ID} params 
 * @returns 
 */
//文章管理 新增
export const Start = (params)=> request.post('/bilibili/v2/app/start',params);

export const getAuth = (params)=> request.post('/bilibili/getAuth',params);
export const heartBeatThis = (params)=> request.post('/bilibili/gameHeartBeat',params);
export const gameStart = (params)=> request.post('/bilibili/gameStart',params);
export const gameEnd = (params)=> request.post('/bilibili/gameEnd',params);


 
 
// 获取所有数据 不分状态
export const GetIntroductionAPI = ()=> request.get('/introduction/getAll');
 
// this.dialogVisible = false; 
// this.form.state = 0; 
// this.contentItemData = editor.txt.html();
// this.form.articleContent = this.contentItemData ;
// const response = await this.$axios.post("/news/add", this.form);

// fromData.append("groupList", list);
// let config = {
//   headers: {
//     "Content-Type": "application/json", 
//   },
// };
// this.$axios.post("/news/getByGroupName",fromData,config).then((response) => {
//   console.log(response.data);
// });

