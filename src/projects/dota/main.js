



import { createApp } from 'vue'
import App from '/@/App.vue'
// import './tailwind.css'
// import 'tailwindcss/tailwind.css'
// import './assets/css/tailwind.min.css'
// import './tailwindAll.css'
import '/@/assets/css/tailwind.css'
// import '/@/assets/css/tailwindAll.css'

import axios from 'axios'
import router from './router';

const app = createApp(App);
app.use(router);

//隐藏所有log
// console.log = function () {};
// console.logWarning = function () {};
// console.logError = function () {};

app.mount('#app');
 
//全局使用 axios   vue3.0的方法
app.config.globalProperties.$axios = axios;

// app.config.globalProperties.$publicUrl = "https://snvtkd2005.com/vue/DH/columbia2/public/"; 
// app.config.globalProperties.$publicUrl = "https://cdn.h5-x.com/columbia/360/public/"; 
app.config.globalProperties.$publicUrl = "./public/"; 
// 
