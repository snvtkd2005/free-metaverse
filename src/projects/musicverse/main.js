



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

app.config.globalProperties.$publicUrl = "./public/"; 
// 
