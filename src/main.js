// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
// import './tailwind.css'
// import 'tailwindcss/tailwind.css'
// import './assets/css/tailwind.min.css'
import './assets/css/tailwind.css'

//引入 饿了么UI
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'


import axios from 'axios'
import router from './router';
// import Vuex from 'vuex';
import { createStore } from 'vuex';
// import store from './store/index.js';

import { UploadImg, UploadFile, DelFile } from "/@/utils/upload.js";

import { FormatDate, GetDateYM, ContentReplace,dataURLtoBlob,stringtoBlob } from "/@/utils/utils.js";


// import Confirm from './utils/yjDialog'; 

const app = createApp(App);
app.use(router);

app.use(ElementPlus, { locale: zhCn, });



//隐藏所有log
// console.log = function () {};
// console.logWarning = function () {};
// console.logError = function () {};


app.mount('#app');

//全局使用 axios   vue3.0的方法
app.config.globalProperties.$axios = axios;

// 弹出对话框。删除时调用
// app.config.globalProperties.$confirm = Confirm;

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


//全局定义变量 localUrl (变量名自行决定) 。 该路径为图标读取的网址路径
// 发布时，注释掉。只在本地使用。图片等文件资料存储在 assets 文件夹中 
// app.config.globalProperties.$publicUrl ="https://www.snvtkd2005.com/vue/dt/public/";
// app.config.globalProperties.$publicUrl = "/vue/farm/public/"; 
app.config.globalProperties.$publicUrl = "./public/"; 
// app.config.globalProperties.$publicUrl ="/webh5/one/";
// app.config.globalProperties.$publicUrl = "./"; 
// 
