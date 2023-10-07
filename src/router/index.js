import {createRouter,createWebHistory,createWebHashHistory} from "vue-router";

 

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// } 
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
const router = createRouter ({
  history:createWebHashHistory(),  //  localhost:8080/
  // history:createWebHistory(),  //去掉#   localhost:8080/
  routes: [
    {
      path: '/',
      // component:()=>import('../views/chat/city/index43dchat_city.vue'),
      // redirect: '/revelya',  //重定向
      // redirect: '/dhart',  //重定向
      // redirect: '/singleModel',  //重定向
      // redirect: '/chineseMedicine',  //重定向
      redirect: '/multifarm',  //重定向
      // redirect: '/musicverse/aaa',  //重定向
      
      // redirect: '/gyro',  //重定向
      
    },    
    {
      path: '/chineseMedicine', //布局页
      name: 'chineseMedicine',
      component:()=>import('../projects/chineseMedicine/pages/index.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/singleModel', //布局页
      name: 'singleModel',
      component:()=>import('../views/chat/SingleModelScene/index.vue'),
      children:[ 
      ]
    },   
    {
      path: '/dhart', //布局页
      name: 'dhart',
      component:()=>import('../views/chat/DHArt/index.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/uploadScene',   //接入 上传各个项目的场景文件
      name: 'uploadScene',
      component:()=>import('../views/chat/uploadScene.vue')
    },   
    {
      path: '/multifarm', //布局页
      name: 'multifarm', 
      redirect: '/multifarm/aaa',  //重定向
      component:()=>import('../projects/farm/pages/index.vue'),
      children:[ 
      ]
    },  
    {
      path: '/multifarm/:userName', //布局页
      name: 'multifarmid', 
      component:()=>import('../projects/farm/pages/index.vue'),
      children:[ 
      ]
    },  
    {
      path: '/musicverse/:userName', //布局页
      name: 'musicverseid', 
      component:()=>import('../projects/musicverse/pages/index.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/threeBloomSimple', //
      name: 'threeBloomSimple',
      component:()=>import('../threeJS/threeBloomSimple.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/Test', //布局页
      name: 'Test',
      component:()=>import('../views/chat/Test/index.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/EastArt', //布局页
      name: 'EastArt',
      component:()=>import('../views/chat/EastArt/index.vue'),
      children:[ 
      ]
    }, 

    {
      path: '/MOT', //布局页
      name: 'MOT',
      component:()=>import('../views/chat/MOT/index.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/masters-of-time', //布局页
      name: 'masters-of-time',
      component:()=>import('../views/chat/MOT/index.vue'),
      children:[ 
      ]
    }, 

    {
      path: '/MOTInterface', //布局页
      name: 'MOTInterface',
      component:()=>import('../views/chat/MOT/newInterfaceTest.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/musicRhythm', //布局页
      name: 'musicRhythm',
      component:()=>import('../threeJS/musicRhythm/threeSimple.vue'),
      children:[ 
      ]
    }, 
    {
      path: '/gyro', // 陀螺仪 加速度走进3d模型
      name: 'gyro',
      component:()=>import('../views/chat/gyro/index.vue'),
      children:[ 
      ]
    }, 
    
  ]
})

export default router;