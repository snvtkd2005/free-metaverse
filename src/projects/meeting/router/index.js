import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";



// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// } 
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
const router = createRouter({
  history: createWebHashHistory(),  //  localhost:8080/
  // history:createWebHistory(),  //去掉#   localhost:8080/
  routes: [
    {
      path: '/',
      // component:()=>import('../views/chat/city/index43dchat_city.vue'),
      // redirect: '/singleModel',  //重定向 
      // redirect: '/ello',  //重定向
      redirect: '/multiMusic',  //重定向
      // redirect: '/multi',  //重定向
      // component: () => import('../pages/index.vue'),

    }, 
    {
      path: '/playerSelect',   // 角色选择页
      name: 'playerSelect',
      component: () => import('../pages/playerSelectPanel.vue')
    },  
    {
      path: '/margeTexture',   // 合并图片
      name: 'margeTexture',
      component: () => import('../pages/margeTexture3DPanel.vue')
    },
    {
      path: '/uploadScene',   //接入 上传各个项目的场景文件
      name: 'uploadScene',
      component: () => import('../../../views/chat/uploadScene.vue')
    },
    {
      path: '/multi', //布局页
      name: 'multi',
      redirect: '/multi/YJ/元宇宙用户265_2222/18616285155',  //重定向
      component: () => import('../pages/indexMeeting.vue'),
      children: [
      ]
    }, 
    {
      path: '/multiMusic', //布局页
      name: 'multiMusic',
      redirect: '/multiMusic/YJ/元宇宙用户265_2222/18616285155',  //重定向
      component: () => import('../pages/index.vue'),
      children: [
      ]
    }, 
    {
      path: '/multiMusic/:nickName/:userId/:phone', //布局页
      name: 'multiMusicNickname',
      component: () => import('../pages/index.vue'),
      children: [
      ]
    },

    {
      path: '/multi/:userName', //布局页
      name: 'multiid',
      component: () => import('../pages/index.vue'),
      children: [
      ]
    },

    {
      path: '/multiMeeting', //布局页
      name: 'multiMeeting',
      redirect: '/multiMeeting/YJ/元宇宙用户265_2222/18616285155',  //重定向
      component: () => import('../pages/indexMeeting.vue'),
      children: [
      ]
    },

    {
      path: '/multiMeeting/:nickName/:userId/:phone', //布局页
      name: 'multiMeetingNickname',
      component: () => import('../pages/indexMeeting.vue'),
      children: [
      ]
    },

    {
      path: '/multi/:nickName/:userId/:phone', //布局页
      name: 'nickName',
      component: () => import('../pages/index.vue'),
      children: [
      ]
    },


    {
      path: '/photo', //布局页
      name: 'photo',
      component: () => import('../pages/photo2.vue'),
      children: [
      ]
    },
  ]
})

export default router;