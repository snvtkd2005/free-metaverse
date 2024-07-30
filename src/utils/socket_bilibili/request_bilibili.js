


import axios from 'axios'


// let baseUrl = "/bilibili";
// let baseUrl = "https://live-open.biliapi.com";
let baseUrl = "http://127.0.0.1:3000";

//创建axios的一个实例 
var request = axios.create({ 
	
    // baseURL:baseUrl, //后台接口
    baseURL:"", //后台接口
    // baseURL:"http://snvtkd2005.com:3336", //后台接口
	crossDomain:true,
    withCredentials: true,
	headers: {
		"Access": "application/json",
		"Content-Type": "application/json",
		// "Access-Control-Allow-Origin": "*",
	},
	  // timeout: 6000, //设置超时  
});
// var request = axios.create();

//请求拦截器 
request.interceptors.request.use((config) => {
		// console.log(' 获取数据成功',config);
        return config;
    }, (error) =>{
		console.log(' 获取数据失败');

        // 对请求错误做些什么
        return Promise.reject(error)
    }
);

var message;
//响应拦截器
request.interceptors.response.use((response) => {
    //响应成功
    // console.log('响应成功');
    return response.data;
}, (error) => {
    console.log(error)
    //响应错误
    if(error.response&&error.response.status){
	   const status = error.response.status
	    switch (status) {
	        case 400:
	            message = '请求错误';
	            break;
	        case 401:
	            message = '请求错误';
	            break;
	        case 404:
	            message = '请求地址出错';
	            break;
	        case 408:
	            message = '请求超时';
	            break;
	        case 500:
	            message = '服务器内部错误!';
	            break;
	        case 501:
	            message = '服务未实现!';
	            break;
	        case 502:
	            message = '网关错误!';
	            break;
	        case 503:
	            message = '服务不可用!';
	            break;
	        case 504:
	            message = '网关超时!';
	            break;
	        case 505:
	            message = 'HTTP版本不受支持';
	            break;
	        default:
	            message = '请求失败'
	    }
		    // ElMessage.error(message);
		    return Promise.reject(error);
       }
    return Promise.reject(error);
});

export default request; 