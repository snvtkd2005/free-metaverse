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
      // redirect: '/login',  //重定向
      redirect: '/selfpanel',  //重定向
      // redirect: '/multifarm',  //重定向
      // redirect: '/shader',  //重定向
      // redirect: '/chatGPTsingle',  //重定向  
      // component: () => import('../pages/platform/settingPanel_screen.vue'),

    }, 
    {
      path: '/uitest',   // 访问编辑后保存在本地的场景
      name: 'uitest',
      component: () => import('../pages/platform/games/wowPanel.vue')
      // component: () => import('../pages/platform/games/ActionPanel.vue')
      // component: () => import('../pages/platform/common/PlayerPropertyPanel.vue')
    },
    {
      path: '/visitLocal',   // 访问编辑后保存在本地的场景
      name: 'visitLocal',
      component: () => import('../pages/platform/VisitLocal.vue')
    },
 
    {
      path: '/indexHome', //元宇宙平台
      name: 'indexHome',
      redirect: '/selectScene',  //重定向
      component: () => import('../pages/platform/indexHome.vue'),
      children: [
        {
          path: '/selectPlayer', // 虚拟形象
          name: 'selectPlayer',
          component: () => import('../pages/platform/SelectPlayerPanel.vue'),
        },
        {
          path: '/selectScene', // 探索 访问场景
          name: 'selectScene',
          component: () => import('../pages/platform/SelectScene.vue'),
        },
        {
          path: '/store', // 素材库
          name: 'store',
          component: () => import('../pages/platform/Store.vue'),
        },
        {
          path: '/witkey', // 模型需求发布
          name: 'Witkey',
          component: () => import('../pages/platform/Witkey.vue'),
        },
        {
          path: '/selfPanel', // 创作页
          name: 'selfPanel',
          component: () => import('../pages/platform/selfPanel.vue'),
        }, 
        {
          path: '/developPlan', // 开发计划
          name: 'developPlan',
          component: () => import('../pages/platform/developPlan.vue'),
        },
      ]
    },

    {
      path: '/editorScene', // 场景编辑页
      name: 'editorScene',
      component: () => import('../pages/platform/EditorPanel.vue'),
    },
    {
      path: '/editorGroup', // 组合编辑页
      name: 'editorGroup',
      component: () => import('../pages/platform/EditorPanel.vue'), 
    },
    
    {
      path: '/editorSingle', // 单品编辑页
      name: 'editorSingle',
      component: () => import('../pages/platform/EditorPanelSingle.vue'),
    },
    
    {
      path: '/editorVisit',   // 角色选择页
      name: 'editorVisit',
      component: () => import('../pages/platform/EditorPanelVisit.vue')
    },

    {
      path: '/metaWorld',   // 开放世界入口
      name: 'metaWorld',
      component: () => import('../pages/platform/metaWorld.vue')
    },


    {
      path: '/editorVisit/:folderBase',   // 角色选择页
      name: 'editorVisitfolderBase',
      component: () => import('../pages/platform/EditorPanelVisit.vue')
    }, 
    
    {
      path: '/selectPlayerSingle', // 虚拟形象
      name: 'selectPlayerSingle',
      component: () => import('../pages/platform/SelectPlayerPanel.vue'),
    }, 
 
  ]
})

export default router;