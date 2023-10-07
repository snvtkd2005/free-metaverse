


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
      modelPath: "models/jungeTest/animation_concert.gltf",
      // modelPath: "models/jungeTest/male_body_animation.gltf",
      // modelPath: "models/jungeTest/animations.glb",
      rotaY: 0,

      skinData: [
        {
          content: "hand",
          selected: 0,
          title: "hand",
          // 查找模型名中的关键字
          part: "hand",
          mode: "model",
          icon: [
            "models/playerSkin/fbx/UTC_hair.png",
          ],
          modelPath: [
            "models/jungeTest/body_male.gltf",
            // "models/jungeTest/male_body_animation.gltf",
          ],

        },

        {
          content: "发型",
          selected: 0,
          title: "hair",
          // 查找模型名中的关键字
          part: "hair",
          mode: "model",
          icon: [
            "models/playerSkin/fbx/UTC_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",

            "models/playerSkin/fbx/Misaki_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",
            "models/playerSkin/fbx/Misaki_hair.png",
          ],
          modelPath: [
            "models/jungeTest/male_hair0.glb",
            "models/jungeTest/male_hair1.glb",
            "models/jungeTest/male_hair2.glb",
            "models/jungeTest/male_hair3.glb",
            "models/jungeTest/male_hair4.glb",

            "models/jungeTest/male_hair5.glb",
            "models/jungeTest/male_hair6.glb",
            "models/jungeTest/male_hair7.glb",
            "models/jungeTest/male_hair8.glb",
            "models/jungeTest/male_hair9.glb",
          ],

        },
        {
          content: "衣服",
          selected: 0,
          title: "coat",
          // 查找模型名中的关键字
          part: "costume",
          mode: "model",
          icon: [
            "models/playerSkin/fbx/UTC_body.png",
            "models/playerSkin/fbx/Misaki_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
            "models/playerSkin/fbx/Yuko_body.png",
          ],
          modelPath: ["models/jungeTest/male_cloth_000.gltf",
            "models/jungeTest/male_cloth_001.gltf",
            "models/jungeTest/male_cloth_002.gltf",
            "models/jungeTest/male_cloth_003.gltf",
            "models/jungeTest/male_cloth_004.gltf",

            "models/jungeTest/male_cloth_005.gltf",
            "models/jungeTest/male_cloth_006.gltf",
            "models/jungeTest/male_cloth_007.gltf",
            "models/jungeTest/male_cloth_008.gltf",
            "models/jungeTest/male_cloth_009.gltf",

            "models/jungeTest/male_cloth_010.gltf",
            "models/jungeTest/male_cloth_011.gltf",
            "models/jungeTest/male_cloth_012.gltf",
          ]
        },
      ],
      animationsData: [
        { clipIndex: 0, animName: "dacall", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "dengpai", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "happy", timeScale: 1, connected: false, targetIndex: 2 },
        { clipIndex: 3, animName: "huanhu", timeScale: 1, connected: false, targetIndex: 3 },
        { clipIndex: 4, animName: "idle", timeScale: 1, connected: false, targetIndex: 4 },
        { clipIndex: 5, animName: "listen", timeScale: 1, connected: false, targetIndex: 5 },
        { clipIndex: 6, animName: "none", timeScale: 1, connected: false, targetIndex: 6 },
        { clipIndex: 7, animName: "walk", timeScale: 1, connected: false, targetIndex: 7 },
        { clipIndex: 8, animName: "yeah", timeScale: 1, connected: false, targetIndex: 8 },
        { clipIndex: 9, animName: "ygb", timeScale: 1, connected: false, targetIndex: 9 },
      ]
    },
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


  ]
}



