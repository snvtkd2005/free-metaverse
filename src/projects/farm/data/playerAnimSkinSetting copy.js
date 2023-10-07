


export default {
  localPath: "farm/",
  // 默认角色信息
  defaultUser: {
    userName: "test",
    // 默认角色
    // avatarName: "unity娘", 
    // avatarName: "litleUnityChain",
    avatarName: "litleUnityChain2",

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
        { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 1 },
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


    {
      name: "litleUnityChain2",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      modelScale: 0.01,
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      modelPath: "models/playerSkin/fbx/UTC_Default/UTC_Default.fbx",
      // modelPath: "models/playerSkin/fbx/Yuko_body/Yuko_body.fbx",
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
          modelPath: ["models/playerSkin/fbx/UTC_Default/UTC_Default.fbx", "models/playerSkin/fbx/Yuko_body/Yuko_tou_body.fbx", "models/playerSkin/fbx/Misaki_body/Misaki_body_tou.fbx"]
        },
        {
          content: "衣服",
          selected: 0,
          title: "coat",
          // 查找模型名中的关键字
          part: "costume",
          mode: "model",
          icon: ["models/playerSkin/fbx/UTC_body.png", "models/playerSkin/fbx/Misaki_body.png", "models/playerSkin/fbx/Yuko_body.png"],
          modelPath: ["models/playerSkin/fbx/UTC_Default/UTC_Default.fbx", "models/playerSkin/fbx/Yuko_body/Yuko_body.fbx", "models/playerSkin/fbx/Misaki_body/Misaki_body.fbx"]
        },
      ],
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 0.2, connected: false, targetIndex: 0 },
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
    //   modelPath: "models/playerSkin/zhuti.fbx",
    //   skinData: [

    //     {
    //       title: "hair",
    // part:"body",
    //       modelPath: ["models/playerSkin/UTC_hair.gltf", "models/playerSkin/Yuko_hair.gltf", "models/playerSkin/Misaki_hair.gltf"]
    //     },
    //     {
    //       title: "coat",
    // part:"body",
    //       modelPath: ["models/playerSkin/zhuti.fbx", "models/playerSkin/qiuti.fbx", "models/playerSkin/wai001.fbx"]
    //     },
    //   ],
    //   animationsData: [
    //     { clipIndex: 0, animName: "idle", timeScale: 0.2, connected: false, targetIndex: 0 },
    //   ]
    // },


    // {
    //   name: "litleUnityChain2",
    //   height: 1.7,
    //   nameScale: 1,
    //   // 模型缩放
    //   modelScale: 0.01,
    //   img: "img/player/farmPlayer.png",
    //   modelType: "角色",
    //   modelPath: "models/playerSkin/Standing Idle To Fight IdleBoy.fbx",
    //   skinData: [
    //     // {title:"eye",modelPath:["",""]},
    //     {
    //       title: "hair",
    //       modelPath: ["models/playerSkin/UTC_hair.gltf", "models/playerSkin/Yuko_hair.gltf", "models/playerSkin/Misaki_hair.gltf"]
    //     },
    //     {
    //       title: "coat",
    //       modelPath: ["models/playerSkin/Standing Idle To Fight Idle.fbx", "models/playerSkin/Standing Idle To Fight IdleBoy.fbx", "models/playerSkin/Misaki_body.gltf"]
    //     },
    //   ],
    //   animationsData: [
    //     { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
    //   ]
    // },



    // {
    //   name: "litleUnityChain2",
    //   height: 1.7,
    //   nameScale: 1,
    //   // 模型缩放
    //   modelScale: 0.01,
    //   img: "img/player/farmPlayer.png",
    //   modelType: "角色",
    //   // modelPath: "models/playerSkin/UTC_body.gltf", 
    //   modelPath: "models/playerSkin/UTC_Default.gltf",
    //   // modelPath: "models/playerSkin/Yuko_body.gltf",
    //   skinData: [
    //     // {title:"eye",modelPath:["",""]},
    //     {
    //       title: "hair",
    //       modelPath: ["models/playerSkin/UTC_hair.gltf", "models/playerSkin/Yuko_hair.gltf", "models/playerSkin/Misaki_hair.gltf"]
    //     },
    //     {
    //       title: "coat",
    //       modelPath: ["models/playerSkin/UTC_body.gltf", "models/playerSkin/Yuko_body.gltf", "models/playerSkin/Misaki_body.gltf"]
    //     },
    //   ],
    //   animationsData: [
    //     { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
    //   ]
    // },
  ]
}



