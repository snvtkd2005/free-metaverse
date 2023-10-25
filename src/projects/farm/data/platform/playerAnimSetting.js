


export default {
  
  
  // 默认角色信息
  defaultUser: {
    userName: "test", 
    // 默认角色
    avatarName: "女孩",
  },
  // 角色选择界面的角色信息
  playerImgPath: [
    // {
    //   name: "小孩",
    //   platform: "pcweb",
    //   img: "images/spUI/player1.png",
    // },
    // {
    //   name: "litleUnityChain2",
    //   platform: "pcweb", 
    //   img: "images/spUI/player2.png",
    // },  
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
/*
    
    {
      name: "litleUnityChain2",
      height: 1.0,
      nameScale: 1,
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
/*

    {
      folderBase:"farmPlayer",
      name: "小孩",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      modelScale: 1,
      img: "img/player/farmPlayer.png",
      modelType: "角色模型",
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
      ],
      // 扩展动作，由加载外部动画文本解析得到
      animationsExtendData: [
        { animName: "shooting", timeScale: 1, connected: false, path:  "models/player/farmplayer/anim.json" },
      ],
    }, 
  */
      
  ]

}



