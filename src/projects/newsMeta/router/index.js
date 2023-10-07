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
      // redirect: '/newsmeta',  //重定向 
      redirect: '/login',  //重定向 
    },    
    {
      path: '/login',   // 登录页
      name: 'login',
      component:()=>import('../pages/loginPage.vue')
    }, 
    {
      path: '/playerSelect',   // 角色选择页
      name: 'playerSelect',
      component:()=>import('../pages/playerSelectPanel.vue')
    },   
    {
      path: '/newsmeta', //
      name: 'newsmeta', 
      redirect: '/newsmeta/aaa',  //
      component:()=>import('../pages/index.vue'),
      children:[ 
      ]
    },  
    {
      path: '/newsmeta/:userName', // 3d场景页
      name: 'newsmeta22', 
      component:()=>import('../pages/index.vue'),
      children:[ 
      ]
    },   
    
    {
      path: '/photo', //布局页
      name: 'photo', 
      component:()=>import('../pages/photo2.vue'),
      children:[ 
      ]
    },   
    // {
    //   path: '/demo', //demo
    //   name: 'demo', 
    //   component:()=>import('../pages/demo.vue'),
    //   children:[ 
    //   ]
    // },   
  ]
})

export default router;