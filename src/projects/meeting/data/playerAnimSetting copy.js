


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
    {
      name: "scene4",
      icon: "images/spUI/圣诞.png",
      img: "images/spUI/bg.png",
      modelType: "场景",
    },
  ],
  
  // 默认角色信息
  defaultUser: {
    userName: "test", 
    // 默认角色
    // avatarName: "male",
    // avatarName: "female",
    // avatarName: "maleHair1",
    avatarName: "malelook1",
    
    // avatarName: "maleHair2",
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
      name: "female",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/female_animation.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        
      ]
    },
    {
      name: "male",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/male_animation.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 8 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 9 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 2 },
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
      rotaY:0, 
      modelPath: "models/player/female_anim_suit_hair1.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
      ]
    }, 

    {
      name: "femaleHair2",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/female_anim_suit_hair2.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
      ]
    }, 
    
    {
      name: "femaleHair3",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/female_anim_suit_hair3.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
      ]
    }, 

    {
      name: "maleHair1",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/male_anim_suit_hair1.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
      ]
    }, 
    {
      name: "maleHair2",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/male_anim_suit_hair2.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
      ]
    }, 
    {
      name: "maleHair3",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      rotaY:0, 
      modelPath: "models/player/male_anim_suit_hair3.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
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
      modelPath: "models/player/male_concert_look1.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
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
      modelPath: "models/player/male_concert_look2.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
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
      modelPath: "models/player/male_concert_look3.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
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
      modelPath: "models/player/female_concert_look1.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
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
      modelPath: "models/player/female_concert_look2.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
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
      modelPath: "models/player/female_concert_look3.glb", 
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 9 },
        { clipIndex: 2, animName: "hello", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 3, animName: "yeah", timeScale: 1, connected: false, targetIndex: 10 },
        { clipIndex: 4, animName: "sitting", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 5, animName: "handClap", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 6, animName: "brandish", timeScale: 1, connected: false, targetIndex: 11 },
        { clipIndex: 7, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 8, animName: "direct", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 9, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 10, animName: "happy", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 11, animName: "listen", timeScale: 1, connected: false, targetIndex: 6 },
      ]
    },  

  ]
}



