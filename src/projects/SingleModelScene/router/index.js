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
      component:()=>import('../pages/index.vue'),
    },    
    {
      path: '/singleModel', //布局页
      name: 'singleModel',
      component:()=>import('../pages/index.vue'),
      children:[ 
      ]
    },   
    {
      path: '/uploadScene',   //接入 上传各个项目的场景文件
      name: 'uploadScene',
      component:()=>import('../../../views/chat/uploadScene.vue')
    },   
  ]
})

export default router;