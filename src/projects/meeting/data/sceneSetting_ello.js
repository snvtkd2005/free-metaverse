


export default {

  // 房间名，用房间名来区分多个项目的同步
  roomName: "ello",
  platform: "pcweb",
  isMobile:false,

  // 界面设置
  setting: {
    // 是否应用辉光效果
    useBloom:false,
    // 资源路径，资源的文件夹包裹。由此来区分不同的项目内容
    localPath: "ello/",
    // 自定义鼠标光标
    cursorUrl: "",
    title: "Copy Ello",

    // 是否显示 "切换操作模式" 按钮
    hasChangeCtrlState: true,

    // 是否显示 "3d音乐" 按钮
    hasBGM: false,
    BGMurl: "musicverse/bg.mp3",

    //舍弃。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时, 摄像机到角色的距离
    camZ: -8,
    // 镜头拉远最大距离
    camWheelMax: -30,

    // 右上角中英文切换按钮
    righttopBtn: false,

    // 键盘C键切换操作模式
    keyC: false,
    // 键盘Q键 第一人称视角和第三人称视角切换
    keyQ: true,
    // 是否启用鼠标滚轮推进拉远摄像机
    canMouseWheel: false,
    // 键盘G键 是否允许开关重力.
    canEnableGravity: true,


    // 是否有天空球
    // hasEnvmap: false,
    hasEnvmap: true,
    // 天空球全景图路径
    envmapPath: "089.hdr",

    // 是否启用摄像机遮挡时拉近摄像机功能
    hasCamRaycast: false,
    // camRaycastMode: "near",  // near 视角拉近 ; transparent 透明遮挡物。
    camRaycastMode: "transparent",  // near 视角拉近 ; transparent 透明遮挡物。

    // 是否启用3d做法的小地图
    hasMinMap: false,
    // 是否启用2d做法的小地图
    has2dMinMap: false,
    // 是否在小地图编辑状态
    inMinMapEditor: false,

    // 是否鸟瞰开场
    hasAerialView: false,

    //是否开始时锁定到鸟瞰位置
    isLockStartAerial:true,

    // 是否第一人称视角
    // firstPerson :true,
    
    // 是否有角色
    hasAvatar:true,

    // 操作方式。 0 键鼠控制/遥感控制，1 鼠标点击地面 
    contrlState: 0,
    //舍弃/>-1控制隐藏角色。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时，摄像机距离
    wheelValue: -8,
    // 摄像机在角色后方的偏移位置。该值决定在后方的高度和角度
    // 同时 y值 决定第一人称视角时的初始上下朝向角度
    cameraOffset: { x: 0, y: 2, z: -4 },
    // cameraOffset: { x: 0, y: 10, z: -14 },

    // 配置渲染模式/渲染效果
    render:{
      outputEncoding:"sRGBEncoding",
    },

    speedData:{
      // 刚体移动速度
      moveSpeed: 5,
      // 行走速度
      walkSpeed: 5,
      // 按住左shift加速，奔跑速度
      runSpeed:8,
      // 刚体移动最大速度
      minSpeed: 1.5,
      // 刚体移动最小速度
      maxSpeed: 5,
      // 重力关闭后，允许飞行，上升速度
      upSpeed: 4,
      // 重力关闭后，允许飞行，飞行速度
      flySpeed: 10,
    },

    // 摄像机上下旋转的限制弧度
    // targetRota: { x: -1.25, y: -0.03 },
    targetRota: { x: -1.25, y: 1.03 },


    // 玩家刚体高度
    playerHeight: 1.7,
    // 摄像机目标父物体，在刚体中心位置的Y轴偏移量。该值决定摄像机高度
    // camOffsetY: 0.8,
    camOffsetY: 1.0,
    // 摄像机视野
    cameraFov:60,

    //是否有寻路网格
    hasPathfinding:false,
  
    // 玩家刚体半径
    playerRadius:0.2,

  },

  // 热点数据
  hotPointData: {
    // YJTriggerArea脚本中旋转物体的旋转速度
    triggerAreaRotaSpeed: 0.01,
  },


  // 小地图数据
  minMapData: {
    // 小地图图片路径
    minMapUrl: "minMap.png",
    minMapPointUrl: "minMapPoint.png",
    viewAreaUrl: "viewArea.png",

    minMapOffset: { x: 160, y: 100 },
    minMapScale: { x: 2.56, y: 2.08 },
    // 小地图在界面中的位置
    minMapPlanePos: { x:-0, y: -0.45, z: -1 },
    minMapPlaneMobilePos: { x:0, y: -0.43, z: -1 },
  },

  // 环境光和方向光参数
  AmbientLightData: {
    //环境光 纯白颜色、强度
    AmbientLightIntensity: 1,

    // 方向光坐标和强度
    DirectionalLightPos: { x: -5, y: 10, z: 1 },
    DirectionalLightIntensity:1.0,

    backgroundImage:"scene.jpg",

  },

  // 默认角色信息
  defaultUser: {
    userName: "test",
    roomName: "3dfarm",
    platform: "pcweb",
    // 默认角色
    avatarName: "小孩",
  },

  // 场景txt路径
  sceneTexPath: "models/Scene/scene.txt",

  // 角色选择界面的角色信息
  playerImgPath: [
    {
      name: "小孩",
      platform: "pcweb",
      img: "img/player/farmPlayer.png",
    },
    {
      name: "小孩2",
      platform: "pcweb",
      img: "img/player/11.png",
    },
    {
      name: "机器人",
      platform: "pcweb",
      img: "img/player/10.png",
    }, 
    {
      name: "unity娘",
      platform: "pcweb",
      img: "img/player/13.png",
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
  sceneList: [
    {
      name: "scene1",
      img: "farm1.png",
      modelType: "场景",
    },
    {
      name: "scene2",
      img: "workroom.jpg",
      modelType: "场景",
    }, 
  ],
  // 角色数据
  avatarData: [
    {
      name: "小孩",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      modelScale: 1,
      rotaY: 0, 
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      modelPath: "models/player/4.glb",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 3 },
        { clipIndex: 3, animName: "run", timeScale: 1, connected: false, targetIndex: 2 }
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
        { clipIndex: 1, animName: "walk", timeScale: 3, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 3 },
        { clipIndex: 3, animName: "run", timeScale: 2, connected: false, targetIndex: 2 }
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



