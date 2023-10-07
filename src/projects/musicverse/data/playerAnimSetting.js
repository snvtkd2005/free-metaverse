


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
    {
      name: "scene3",
      icon: "images/spUI/彩虹城.png",
      img: "images/spUI/bg.png",
      modelType: "场景",
    }, 
  ],
  
  // 默认角色信息
  defaultUser: {
    userName: "test", 
    // 默认角色
    avatarName: "小孩",
  },
  // 角色选择界面的角色信息
  playerImgPath: [
    {
      name: "小孩",
      platform: "pcweb",
      img: "images/spUI/player1.png",
    },
    {
      name: "litleUnityChain2",
      platform: "pcweb", 
      img: "images/spUI/player2.png",
    },
    {
      name: "小孩2",
      platform: "pcweb", 
      img: "images/spUI/player3.png",
    },
    {
      name: "机器人",
      platform: "pcweb", 
      img: "images/spUI/player4.png",
    },
    // { 
    //   platform: "pcweb",
    //   name: "mixman",
    //   img: "models/player/mixman/1658926221460_thrumb.png",
    // },
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
      name: "f2",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/f2.png",
      modelType: "角色",
      modelPath: "players/f_2.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    }, 
    {
      name: "f28",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/f28.png",
      modelType: "角色",
      modelPath: "players/f_28.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    }, 
    {
      name: "m3",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/m3.png",
      modelType: "角色",
      modelPath: "players/m_3.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    }, 
    {
      name: "m11",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/m11.png",
      modelType: "角色",
      modelPath: "players/m_11.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    }, 
  ]
}



