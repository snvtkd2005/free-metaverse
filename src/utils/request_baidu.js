


import axios from 'axios'

// import {
//     ElLoading,
//     ElMessage
// } from 'element-plus';
//创建axios的一个实例 
var request = axios.create({
    // baseURL: import.meta.env.VITE_APP_URL, //接口统一域名
 
    baseURL:'/', //后台接口
    // baseURL:'https://aip.baidubce.com/', //后台接口
	crossDomain:true,
	headers: {
		"Content-Type": "application/octet-stream",
		"Access-Control-Allow-Origin": "*",
	},
 
});
// var request = axios.create();

//请求拦截器 
request.interceptors.request.use((config) => {
		// console.log(' 获取数据成功',config);
		if(config.url.indexOf("https://hyjkg.oss-cn-beijing.aliyuncs.com")>-1){
			config.withCredentials= false;
		}else{
			// config.withCredentials= true;
		}
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
    console.log('响应成功');
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