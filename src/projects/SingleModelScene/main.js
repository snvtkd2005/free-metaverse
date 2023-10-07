



import { createApp } from 'vue'
import App from '/@/App.vue'
// import './tailwind.css'
// import 'tailwindcss/tailwind.css'
// import './assets/css/tailwind.min.css'
import '/@/assets/css/tailwind.css'

//引入 饿了么UI
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import axios from 'axios'
import router from './router';

import { UploadImg, UploadFile, DelFile } from "/@/utils/upload.js";

import { FormatDate, GetDateYM, ContentReplace,dataURLtoBlob,stringtoBlob } from "/@/utils/utils.js";


const app = createApp(App);
app.use(router);

//隐藏所有log
// console.log = function () {};
// console.logWarning = function () {};
// console.logError = function () {};

app.mount('#app');
 
app.use(ElementPlus, { locale: zhCn, });


//全局使用 axios   vue3.0的方法
app.config.globalProperties.$axios = axios;

//上传文件
app.config.globalProperties.$uploadImg = UploadImg;
app.config.globalProperties.$uploadFile = UploadFile;
//删除文件
app.config.globalProperties.$delFile = DelFile;

//获取当前时间 年月日 时分秒
app.config.globalProperties.$formatDate = FormatDate;
//获取当前时间 年月
app.config.globalProperties.$getDateYM = GetDateYM;
//替换字符串
app.config.globalProperties.$ContentReplace = ContentReplace;

// base64转file,用来保存file
app.config.globalProperties.$dataURLtoBlob = dataURLtoBlob;
app.config.globalProperties.$stringtoBlob = stringtoBlob;

app.config.globalProperties.$publicUrl = "./public/"; 
// 
