


export default {
  localPath: "farm/",

  // 默认角色信息
  defaultUser: {
    userName: "test",
    // 默认角色
    avatarName: "YJtest",
  },
  // 角色选择界面的角色信息
  playerImgPath: [
    {
      name: "YJtest",
      platform: "pcweb",
      img: "images/spUI/player2.png",
    },
  ],

  // 模型库/皮肤列表数据
  modelsList: [
    {
      name: "小孩",
      img: "img/player/farmPlayer.png",
      modelType: "角色",
    }, 
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
      name: "YJtest",
      height: 1.8,
      nameScale: 1,
      // 模型缩放
      modelScale: 1,
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      // modelPath: "models/skin0510/animation_concert.gltf",
      // modelPath: "models/skin0510/animation_concert2.gltf",
      modelPath: "models/skin0510/animation_concert3.gltf",
      // modelPath: "models/jungeTest/male_body_animation.gltf",
      // modelPath: "models/jungeTest/animations.glb",
      rotaY: 0,

      skinData: [],
      animationsData: [
        { clipIndex: 0, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 9, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 2, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 3, animName: "huanhu", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 4, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 6, animName: "none", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "rgb", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 9, animName: "sitting", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 7, animName: "walk", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 8, animName: "yeah", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 9, animName: "brandish", timeScale: 1, connected: false, targetIndex: 12 },
        { clipIndex: 9, animName: "seatClap", timeScale: 1, connected: false, targetIndex: 13 }, 


        // { clipIndex: 0, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        // { clipIndex: 1, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        // { clipIndex: 2, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        // { clipIndex: 3, animName: "huanhu", timeScale: 1, connected: false, targetIndex: 3 },
        // { clipIndex: 4, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        // { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        // { clipIndex: 6, animName: "none", timeScale: 1, connected: false, targetIndex: 6 },
        // { clipIndex: 7, animName: "walk", timeScale: 1, connected: false, targetIndex: 7 },
        // { clipIndex: 8, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        // { clipIndex: 9, animName: "ygb", timeScale: 1, connected: false, targetIndex: 9 },
      ]
    }, 

    {
      name: "femalelook1",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/music/female_yanchanghui_cloth1.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 7 },
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

    {
      name: "femaleHair1",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/meeting/female_huiyi_hair1.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 6, animName: "happy", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 8, animName: "seatClap", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 3 },
      ]
    },

    {
      name: "femaleHair2",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/meeting/female_huiyi_hair2.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 6, animName: "happy", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 8, animName: "seatClap", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 3 },
      ]
    },

    {
      name: "femaleHair3",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/meeting/female_huiyi_hair3.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 6, animName: "happy", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 8, animName: "seatClap", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 3 },
      ]
    },

    {
      name: "maleHair1",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/meeting/male_huiyi_hair1.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 6, animName: "happy", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 8, animName: "seatClap", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 3 },
      ]
    },
    {
      name: "maleHair2",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/meeting/male_huiyi_hair2.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 6, animName: "happy", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 8, animName: "seatClap", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 3 },
      ]
    },
    {
      name: "maleHair3",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY: 0,
      modelPath: "models/player/meeting/male_huiyi_hair3.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 6, animName: "happy", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 8, animName: "seatClap", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 3 },
      ]
    },
  ]
}



