


export default {
  localPath: "farm/",
  // 默认角色信息
  defaultUser: {
    userName: "YJ",
    // 默认角色
    avatarName: "unity娘", 
    // avatarName: "litleUnityChain",
    // avatarName: "litleUnityChain2",

  },

  // 角色选择界面的角色信息
  playerImgPath: [
    {
      name: "小孩",
      platform: "pcweb",
      img: "images/spUI/player1.png",
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
      name: "unity娘",
      height: 1.4,
      nameScale: 1,
      modelScale: 1,
      img: "images/player/13.png",
      modelType: "角色",
      modelPath: "models/player/unitychan/unitychan.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 3 },
        { clipIndex: 3, animName: "run", timeScale: 1, connected: false, targetIndex: 2 }
      ]
    },
    {
      name: "litleUnityChain",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      // modelScale: 0.01,
      modelScale: 1,
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      // modelPath: "models/playerSkin/UTC_Default.fbx",
      modelPath: "models/playerSkin/UTC_SchoolUniform_Winter.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "floating", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 4, animName: "death", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 5, animName: "throw", timeScale: 1, connected: false, targetIndex: 5 },
      ]
    },


    // {
    //   name: "litleUnityChain2",
    //   height: 1.7,
    //   nameScale: 1,
    //   // 模型缩放
    //   modelScale: 0.01,
    //   img: "img/player/farmPlayer.png",
    //   modelType: "角色",
    //   modelPath: "models/playerSkin/fbx/UTC_Default/UTC_Default.fbx",
    //   // modelPath: "models/playerSkin/fbx/Yuko_body/Yuko_tou_body.fbx",
    //   // modelPath: "models/playerSkin/fbx/Yuko_body/Yuko_body.fbx",
    //   // modelPath: "models/playerSkin/fbx/Yuko_body/Misaki_default.fbx",
      
    //   skinData: [
    //     {
    //       content: "面纹",
    //       selected: 0,
    //       title: "faceAdd",
    //       // 查找模型名中的关键字
    //       part: "Face",
    //       // 切换类型 texture 贴图，  model 模型
    //       mode: "addTexture",
    //       icon: ["models/playerSkin/fbx/UTC_face.png", "models/playerSkin/fbx/faceAdd001.png", "models/playerSkin/fbx/faceAdd002.png"],
    //       modelPath: ["", "models/playerSkin/fbx/face_add_001.png", "models/playerSkin/fbx/face_add_002.png"]
    //     },
    //     {
    //       content: "美瞳",
    //       selected: 0,
    //       title: "eye",
    //       // 查找模型名中的关键字
    //       part: "eye",
    //       // 切换类型 texture 贴图，  model 模型
    //       mode: "texture",
    //       icon: ["models/playerSkin/fbx/UTC_face.png", "models/playerSkin/fbx/Misaki_face.png", "models/playerSkin/fbx/Yuko_face.png"],
    //       modelPath: ["models/playerSkin/fbx/UTC_Default/utc001.png", "models/playerSkin/fbx/Yuko_body/Misaki_SchoolUniform.png", "models/playerSkin/fbx/Misaki_body/Yuko_SchoolUniform.png"]
    //     },
    //     {
    //       content: "发型",
    //       selected: 0,
    //       title: "hair",
    //       // 查找模型名中的关键字
    //       part: "hair",
    //       mode: "model",
    //       icon: ["models/playerSkin/fbx/UTC_hair.png", "models/playerSkin/fbx/Misaki_hair.png", "models/playerSkin/fbx/Yuko_hair.png"],
    //       modelPath: ["models/playerSkin/fbx/UTC_Default/UTC_Default.fbx", "models/playerSkin/fbx/Yuko_body/Yuko_tou_body.fbx", "models/playerSkin/fbx/Misaki_body/Misaki_body_tou.fbx"]
    //     },
    //     {
    //       content: "衣服",
    //       selected: 0,
    //       title: "coat",
    //       // 查找模型名中的关键字
    //       part: "costume",
    //       mode: "model",
    //       icon: ["models/playerSkin/fbx/UTC_body.png", "models/playerSkin/fbx/Misaki_body.png", "models/playerSkin/fbx/Yuko_body.png"],
    //       modelPath: ["models/playerSkin/fbx/UTC_Default/UTC_Default.fbx", "models/playerSkin/fbx/Yuko_body/Yuko_body.fbx", "models/playerSkin/fbx/Misaki_body/Misaki_body.fbx"]
    //     },
    //   ],
    //   animationsData: [
    //     { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 1 },
    //     { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 2 },
    //     { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 0 },
    //   ]
    // },


    {
      name: "litleUnityChain2",
      height: 1.0,
      nameScale: 1,
      rotaY:3.14,
      // 模型缩放
      modelScale: 1,
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      // modelPath: "models/playerSkin/UTC_body.gltf", 
      modelPath: "models/playerSkin/gltf/UTC_Default_zt_boy4.gltf",
      // modelPath: "models/playerSkin/Yuko_body.gltf",
      skinData: [
        {
          content: "面纹",
          selected: 0,
          title: "faceAdd",
          // 查找模型名中的关键字
          part: "Face",
          // 切换类型 texture 贴图，  model 模型
          mode: "addTexture",
          icon: ["models/playerSkin/fbx/UTC_face.png", "models/playerSkin/fbx/faceAdd001.png", "models/playerSkin/fbx/faceAdd002.png"],
          modelPath: ["", "models/playerSkin/fbx/face_add_001.png", "models/playerSkin/fbx/face_add_002.png"]
        },
        {
          content: "美瞳",
          selected: 0,
          title: "eye",
          // 查找模型名中的关键字
          part: "eye",
          // 切换类型 texture 贴图，  model 模型
          mode: "texture",
          icon: ["models/playerSkin/fbx/UTC_face.png", "models/playerSkin/fbx/Misaki_face.png", "models/playerSkin/fbx/Yuko_face.png"],
          modelPath: ["models/playerSkin/fbx/UTC_Default/utc001.png", "models/playerSkin/fbx/Yuko_body/Misaki_SchoolUniform.png", "models/playerSkin/fbx/Misaki_body/Yuko_SchoolUniform.png"]
        },
        {
          content: "发型",
          selected: 0,
          title: "hair",
          // 查找模型名中的关键字
          part: "hair",
          mode: "model",
          icon: ["models/playerSkin/fbx/UTC_hair.png", "models/playerSkin/fbx/Misaki_hair.png", "models/playerSkin/fbx/Yuko_hair.png"],
          modelPath: ["models/playerSkin/gltf/UTC_Default_zt_boy4.gltf", "models/playerSkin/gltf/Yuko_tou.gltf", "models/playerSkin/gltf/Misaki_tou.gltf"]
        },
        {
          content: "衣服",
          selected: 0,
          title: "coat",
          // 查找模型名中的关键字
          part: "costume",
          mode: "model",
          icon: ["models/playerSkin/fbx/UTC_body.png", "models/playerSkin/fbx/Misaki_body.png", "models/playerSkin/fbx/Yuko_body.png"],
          modelPath: ["models/playerSkin/gltf/UTC_Default_zt_boy4.gltf", "models/playerSkin/gltf/Yuko_boy.gltf", "models/playerSkin/gltf/Misaki_body_zt.gltf"]
        },
      ],
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },

    {
      name: "小孩",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      modelScale: 0.01,
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
      height: 1.4,
      nameScale: 1,
      modelScale: 1,
      img: "images/player/13.png",
      modelType: "角色",
      modelPath: "models/player/unitychan/unitychan.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 3 },
        { clipIndex: 3, animName: "run", timeScale: 1, connected: false, targetIndex: 2 }
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



