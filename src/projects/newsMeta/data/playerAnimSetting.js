


export default {

  // 场景列表
  sceneList: [
    {
      name: "scene1",
      img: "images/bg-loading2.gif",
      modelType: "场景",
    },
    {
      name: "scene2",
      img: "images/bg-loading2.gif",
      modelType: "场景",
    },
  ],


  // 默认角色信息
  defaultUser: {
    userName: "test",
    roomName: "newsmeta",
    platform: "pcweb",
    // 默认角色
    avatarName: "nanhai",
  },
  // 角色选择界面的角色信息
  // playerImgPath: [
  //   {
  //     name: "nanhai",
  //     platform: "pcweb",
  //     img: "images/user/user1.png",
  //   }, 
  //   {
  //     name: "laotaitai",
  //     platform: "pcweb",
  //     img: "images/user/user3.png",
  //   }, 
  //   {
  //     name: "man",
  //     platform: "pcweb",
  //     img: "images/user/user3.png",
  //   }, 
  //   {
  //     name: "nanren",
  //     platform: "pcweb",
  //     img: "images/user/user1.png",
  //   }, 
  //   {
  //     name: "nvhai",
  //     platform: "pcweb",
  //     img: "images/user/user3.png",
  //   }, 
  //   {
  //     name: "nanyisheng",
  //     platform: "pcweb",
  //     img: "images/user/user3.png",
  //   }, 
  //   {
  //     name: "nvren",
  //     platform: "pcweb",
  //     img: "images/user/user1.png",
  //   }, 
  //   {
  //     name: "nvyisheng",
  //     platform: "pcweb",
  //     img: "images/user/user3.png",
  //   }, 
  // ],
  
  playerImgPath: [
    {
      name: "nanhai",
      platform: "pcweb",
      img: "models/player/nanhai.jpg",
    }, 
    {
      name: "laotaitai",
      platform: "pcweb",
      img: "models/player/laotaitai.jpg",
    }, 
    {
      name: "man",
      platform: "pcweb",
      img: "models/player/man.jpg",
    }, 
    {
      name: "nanren",
      platform: "pcweb",
      img: "models/player/nanren.jpg",
    }, 
    {
      name: "nvhai",
      platform: "pcweb",
      img: "models/player/nvhai.jpg",
    }, 
    {
      name: "nanyisheng",
      platform: "pcweb",
      img: "models/player/nanyisheng.jpg",
    }, 
    {
      name: "nvren",
      platform: "pcweb",
      img: "models/player/nvren.jpg",
    }, 
    {
      name: "nvyisheng",
      platform: "pcweb",
      img: "models/player/nvyisheng.jpg",
    }, 
  ],
  // playerImgPath: [
  //   {
  //     name: "nanhai",
  //     platform: "pcweb",
  //     img: "models/player/nanhai.png",
  //   }, 
  //   {
  //     name: "laotaitai",
  //     platform: "pcweb",
  //     img: "models/player/laotaitai.png",
  //   }, 
  //   {
  //     name: "man",
  //     platform: "pcweb",
  //     img: "models/player/man.png",
  //   }, 
  //   {
  //     name: "nanren",
  //     platform: "pcweb",
  //     img: "models/player/nanren.png",
  //   }, 
  //   {
  //     name: "nvhai",
  //     platform: "pcweb",
  //     img: "models/player/nvhai.png",
  //   }, 
  //   {
  //     name: "nanyisheng",
  //     platform: "pcweb",
  //     img: "models/player/nanyisheng.png",
  //   }, 
  //   {
  //     name: "nvren",
  //     platform: "pcweb",
  //     img: "models/player/nvren.png",
  //   }, 
  //   {
  //     name: "nvyisheng",
  //     platform: "pcweb",
  //     img: "models/player/nvyisheng.png",
  //   }, 
  // ],
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
      name: "nanhai",
      height: 1.4,
      nameScale: 1,
      // 模型缩放
      modelScale: 1,
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      modelPath: "models/player/nanhai_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "laotaitai",
      height: 1.6,
      nameScale: 1,
      // modelScale: 0.01,
      modelScale: 1,
      img: "img/player/child1.png",
      modelType: "角色",
      // modelPath: "models/player/laotaitai_anim_idle.glb",
      // modelPath: "models/player/laotaitai_anim_idle.fbx",
      // modelPath: "models/player/katongnvhai_idle.gltf",
      modelPath: "models/player/laotaitai_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "man",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      modelScale: 1,
      img: "images/player/10.png",
      modelType: "角色",
      modelPath: "models/player/man_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "nanren",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "images/player/13.png",
      modelType: "角色",
      modelPath: "models/player/nanren_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "nvhai",
      height: 1.3,
      nameScale: 1,
      modelScale: 1,
      img: "models/player/fox/1658030620950_thrumb.png",
      modelType: "角色",
      modelPath: "models/player/nvhai_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "nvren",
      height: 1.7,
      nameScale: 1,
      modelScale: 1,
      img: "models/player/mixman/1658926221460_thrumb.png",
      modelType: "角色",
      modelPath: "models/player/nvren_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "nvyisheng",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "models/player/mixman/1658926221460_thrumb.png",
      modelType: "角色",
      modelPath: "models/player/nvyisheng_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "nanyisheng",
      height: 1.8,
      nameScale: 1,
      modelScale: 1,
      img: "models/player/mixman/1658926221460_thrumb.png",
      modelType: "角色",
      modelPath: "models/player/yishi_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "zhubo",
      height: 1.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "models/player/mixman/1658926221460_thrumb.png",
      modelType: "角色",
      modelPath: "models/player/zhubo_anim_idle.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },


    
    {
      name: "guanzhong001",
      height: 1.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "",
      modelType: "角色",
      modelPath: "models/guanzhong/guanzhong001.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
    {
      name: "guanzhong002",
      height: 1.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "",
      modelType: "角色",
      modelPath: "models/guanzhong/guanzhong002.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },    {
      name: "guanzhong003",
      height: 1.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "",
      modelType: "角色",
      modelPath: "models/guanzhong/guanzhong003.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },    {
      name: "guanzhong004",
      height: 1.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "",
      modelType: "角色",
      modelPath: "models/guanzhong/guanzhong004.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },    {
      name: "guanzhong005",
      height: 1.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "",
      modelType: "角色",
      modelPath: "models/guanzhong/guanzhong005.gltf",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 1 }, 
        { clipIndex: 2, animName: "sitting", timeScale: 1, connected: false, targetIndex: 2 },
      ]
    },
  ]
}



