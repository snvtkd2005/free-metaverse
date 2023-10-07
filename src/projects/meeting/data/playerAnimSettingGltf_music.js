


export default {
  localPath: "farm/",

  sceneList: [
    
  ],
  
  // 默认角色信息
  defaultUser: {
    userName: "test", 
    // 默认角色
    // avatarName: "male",
    // avatarName: "female",

    avatarName: "malelook1",
    // avatarName: "malelook2",
    // avatarName: "malelook3",
    // avatarName: "femalelook1",
    // avatarName: "femalelook2",
    // avatarName: "femalelook3",

    
    // avatarName: "maleHair2",
  },
  // 角色选择界面的角色信息
  playerImgPath: [
     
  ],

  // 模型库/皮肤列表数据
  modelsList: [
    
  ],

  // 角色数据
  avatarData: [
    
    {
      name: "guxiaoyu",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/guxiaoyu.glb",
      animationsData: [
        { clipIndex: 0, animName: "direct", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "hello", timeScale: 1.5, connected: false, targetIndex: 1 },
      ]
    },
    {
      name: "femalelook1",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/music/female_yanchanghui_cloth1.gltf", 
      animationsData: [ 
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 7},
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 4, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 }, 

      ]
    }, 

    {
      name: "femalelook2",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/music/female_yanchanghui_cloth2.gltf", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 7},
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 4, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 }, 
      ]
    }, 
    
    {
      name: "femalelook3",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/music/female_yanchanghui_cloth3.gltf", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 7},
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 4, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 }, 
      ]
    }, 

    {
      name: "malelook1",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/music/male_yanchanghui_cloth1.gltf", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 7},
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 4, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 }, 
      ]
    }, 
    {
      name: "malelook2",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/music/male_yanchanghui_cloth2.gltf", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 7},
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 4, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 }, 
      ]
    }, 
    {
      name: "malelook3",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/music/male_yanchanghui_cloth3.gltf", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 7},
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 4, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 }, 
      ]
    }, 

  ]
}



