

const path = require('path')
// vite.config.js # or vite.config.ts

// console.log(path.resolve(__dirname, './src'))
module.exports = {
  //网站根目录，使用./ 后，dist文件夹可以放在任意位置
  base: "./",
  alias: {
    // 键必须以斜线开始和结束
    '/@/': path.resolve(__dirname, './src')
    // '/@components/': path.resolve(__dirname, './src/components')
  },
  //生产模式打包配置
  build: {
    outDir: 'dist',//Specify the output directory (relative to project root).
  },
  compilerOptions: {
    "allowJs": true,
    "types": ["vite/client"]
  },
  port: 8991, //指定端口
  // 是否自动在浏览器打开
  // open: true, 
  // 是否开启 https
  https: false,
  // https: true,
  //反向代理 解决跨域问题
  proxy: {


    '/getAllModel': {
      target: 'https://192.168.0.63:3335/getAllModel', // 目标地址 --> 服务器地址
      // target: 'https://snvtkd2005.com:3335/upload', // 目标地址 --> 服务器地址
      changeOrigin: true,
      secure: false,
      ws: false,
      rewrite: (path) => path.replace(/^\/getAllModel/, ''),
    },



    // nodejs 文件上传
    '/upload': {
      // target: 'https://192.168.0.63:3335/upload', // 目标地址 --> 服务器地址
      target: 'https://snvtkd2005.com:3335/upload', // 目标地址 --> 服务器地址
      changeOrigin: true,
      secure: false,
      ws: false,
      rewrite: (path) => path.replace(/^\/upload/, ''),
    },

    '/worldActivity': {
      target: 'http://43.138.163.92:9090', // 目标地址 --> 服务器地址
      changeOrigin: true,
      secure: false,
      ws: false,
      rewrite: (path) => path.replace(/^\/worldActivity/, ''),
    },

    '/chatgpt': {
      target: 'https://api.wwebjs.com/chatgpt/chat', // 目标地址 --> 服务器地址
      changeOrigin: true,
      secure: false,
      ws: false,
      rewrite: (path) => path.replace(/^\/chatgpt/, ''),
      // pathRewrite: {
      //   '^/chatgpt': ''
      // }
    },


    '/baidubce': {
      target: 'https://aip.baidubce.com', // 目标地址 --> 服务器地址
      changeOrigin: true,
      secure: false,
      ws: false,
      rewrite: (path) => path.replace(/^\/baidubce/, ''),
      // pathRewrite: {
      //   '^/chatgpt': ''
      // }
    },

    '/text2audio': {
      target: 'https://tsn.baidu.com/text2audio', // 目标地址 --> 服务器地址
      changeOrigin: true,
      secure: false,
      ws: false,
      rewrite: (path) => path.replace(/^\/text2audio/, ''),
      // pathRewrite: {
      //   '^/chatgpt': ''
      // }
    },

    // '/socket.io': {
    //   // target:"https://www.snvtkd2005.com:3333",
    //   // target:"http://47.104.151.177:3333",
    //   target: "http://127.0.0.1:3333",
    //   // target:"https://127.0.0.1:3333",
    //   changeOrigin: true,
    // },

    // '/sockjs-node': {
    //   // target:"https://www.snvtkd2005.com:3333",
    //   // target:"http://47.104.151.177:3333",
    //   target: 'http://127.0.0.1:3333',
    //   // target: 'https://127.0.0.1:3333',
    //   ws: false,
    //   changeOrigin: true
    // },

  },

  server: {
    // host: "0.0.0.0",
    // cors: true,
    // port: 8991,
    // open: false, //自动打开


    proxy: {

      '/worldActivity': {
        target: 'http://43.138.163.92:9090', // 目标地址 --> 服务器地址
        changeOrigin: true,
        // secure:false,
        // ws:false,
        rewrite: (path) => path.replace(/^\/worldActivity/, ''),
      },

      '/baidubce': {
        target: 'https://aip.baidubce.com', // 目标地址 --> 服务器地址
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: (path) => path.replace(/^\/baidubce/, ''),
        // pathRewrite: {
        //   '^/chatgpt': ''
        // }
      },
      // '/chatgpt': { // 配置需要代理的路径 --> 这里的意思是代理http://localhost:80/api/后的所有路由
      //   target: 'https://ai.h5-x.com/chatgpt', // 目标地址 --> 服务器地址
      //   // target: "http://192.168.0.223:8000",
      //   // target: "http://192.168.1.5:8000",
      //   changeOrigin: true, // 允许跨域
      //   // ws: true,  // 允许websocket代理
      //   // 重写路径 --> 作用与vue配置pathRewrite作用相同
      //   rewrite: (path) => path.replace(/^\/chatgpt/, "")
      // },

      '/socket.io': {
        // target:"https://www.snvtkd2005.com:3333",
        // target:"http://47.104.151.177:3333",
        target: "http://127.0.0.1:3333",
        // target:"https://127.0.0.1:3333",
        changeOrigin: true,
      },

      '/sockjs-node': {
        // target:"https://www.snvtkd2005.com:3333",
        // target:"http://47.104.151.177:3333",
        target: 'http://127.0.0.1:3333',
        // target: 'https://127.0.0.1:3333',
        ws: false,
        changeOrigin: true
      }
    }
  },


}