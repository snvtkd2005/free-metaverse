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
      // redirect: '/sps',  //重定向 
      component:()=>import('../pages/index.vue'),
      
    },    
    {
      path: '/playerSelect',   // 角色选择页
      name: 'playerSelect',
      component:()=>import('../pages/playerSelectPanel.vue')
    },   
    {
      path: '/upload',   //接入 上传各个项目的场景文件
      name: 'upload',
      component:()=>import('../pages/uploadScene.vue')
    },   
    {
      path: '/sps', //布局页
      name: 'sps', 
      // redirect: '/sps/aaa',  //重定向
      component:()=>import('../pages/index.vue'),
      children:[ 
      ]
    },  
    {
      path: '/sps/:userName', //布局页
      name: 'spsid', 
      component:()=>import('../pages/index.vue'),
      children:[ 
      ]
    },    
  ]
})

export default router;