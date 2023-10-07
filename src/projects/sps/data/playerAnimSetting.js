


export default {
  localPath: "farm/",

  sceneList: [
    {
      name: "scene1",
      icon: "images/spUI/阳光农场.png",
      img: "images/spUI/bg.png",
      modelType: "场景",
    },
    {
      name: "scene2",
      icon: "images/spUI/空中咖啡馆.png",
      img: "images/spUI/bg.png",
      modelType: "场景",
    }, 
  ],
  
  // 默认角色信息
  defaultUser: {
    userName: "sps太郎", 
    // 默认角色
    // avatarName: "fox",
    avatarName: "unity娘",
    
  },
  // 角色选择界面的角色信息
  playerImgPath: [ 
    {
      name: "unity娘",
      platform: "pcweb", 
      img: "images/player001.png",
    }, 
  ],

  // 模型库/皮肤列表数据
  modelsList: [
    {
      name: "小孩",
      img: "img/player/farmPlayer.png",
      modelType: "角色",
    },
    {
      name: "小孩2",
      img: "img/player/11.png",
      modelType: "角色",
    },
    {
      name: "机器人",
      img: "img/player/10.png",
      modelType: "角色",
    },
    {
      name: "unity娘",
      img: "img/player/13.png",
      modelType: "角色",
    },
    {
      name: "fox",
      img: "models/player/fox/1658030620950_thrumb.png",
      modelType: "角色",
    },
    {
      name: "mixman",
      img: "models/player/mixman/1658926221460_thrumb.png",
      modelType: "角色",
    },
  ],

  // 角色数据
  avatarData: [
    {
      name: "小孩",
      height: 1.3,
      nameScale: 1,
      // 模型缩放
      modelScale: 0.0075,
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      modelPath: "models/player/farmplayer/farmPlayer.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 3, animName: "floating", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 4, animName: "death", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 5, animName: "throw", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 6, animName: "attack", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 7, animName: "collection", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 8, animName: "throw2", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 9, animName: "sitting", timeScale: 1, connected: false, targetIndex: 9 },
      ]
    },
    {
      name: "小孩2",
      height: 0.9,
      nameScale: 1,
      modelScale: 0.01,
      img: "img/player/child1.png",
      modelType: "角色",
      modelPath: "models/player/1657958196570/common_people@idle.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 0 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 2 }
      ]
    },
    {
      name: "机器人",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      modelScale: 0.01,
      img: "images/player/10.png",
      modelType: "角色",
      modelPath: "models/player/1657958347511/Robot KyleNew.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 3, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 2 }
      ]
    },
    {
      name: "unity娘",
      height: 0.6,
      nameScale: 0.3,
      modelScale: 0.2,
      rotaY:0,
      img: "images/player/13.png",
      modelType: "角色",
      // modelPath: "models/player/sps_girl.glb",
      modelPath: "models/player/sps_girl_0320.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 0 },
      ]
    },
    {
      name: "fox",
      height: 1.7,
      nameScale: 1,
      modelScale: 0.01,
      img: "models/player/fox/1658030620950_thrumb.png",
      modelType: "角色",
      modelPath: "models/player/fox/Fox.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 1 }
      ]
    },
    {
      name: "mixman",
      height: 1.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "models/player/mixman/1658926221460_thrumb.png",
      modelType: "角色",
      modelPath: "models/player/mixman/Standard Idle.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 0 }
      ]
    },
  ]
}



