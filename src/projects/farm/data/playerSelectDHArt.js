


export default {

  // 房间名，用房间名来区分多个项目的同步
  roomName: "DHArt",

  isMobile:false,

  // 界面设置
  setting: {

    // 是否始终强制横屏
    onlyLandscape:true,

    // 是否应用辉光效果
    useBloom:false,
    // useBloom:true,
    // 资源路径，资源的文件夹包裹。由此来区分不同的项目内容
    localPath: "DHArt/",
    // 自定义鼠标光标
    cursorUrl: "",
    title: "DHArt",

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
    keyQ: false,
    //空格键跳跃
    // keySpace: false,
    keySpace: true,
    // 键盘G键 是否允许开关重力.
    canEnableGravity: false,


    // 是否有天空球
    hasEnvmap: true,
    // hasEnvmap: false,
    // 天空球全景图路径
    // envmapPath: "afternoon.exr", 
    // envmapPath: "blackColor.exr", 
    // envmapPath: "venice_sunset_1k.hdr", 
    // envmapPath: "016.hdr", 
    // envmapPath: "073.hdr", 
    // envmapPath: "024.hdr", 
    envmapPath: "109.hdr", 
    
    // 是否启用摄像机遮挡时拉近摄像机功能
    hasCamRaycast: false,

    // 是否启用3d做法的小地图
    hasMinMap: false,
    // 是否启用2d做法的小地图
    has2dMinMap: false,
    // 是否在小地图编辑状态
    inMinMapEditor: false,

    // 是否鸟瞰开场
    hasAerialView: false,

    // 是否第一人称视角
    firstPerson :true,

    // 操作方式。 0 键鼠控制/遥感控制，1 鼠标点击地面 
    contrlState: 0,
    //舍弃/>-1控制隐藏角色。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时，摄像机距离
    wheelValue: -8,
    // 摄像机在角色后方的偏移位置。该值决定在后方的高度和角度。
    // 同时决定第一人称视角时的初始朝向角度
    cameraOffset: { x: 0, y: 0.5, z: -7 },
    // cameraOffset: { x: 0, y: 5, z: -7 },

    // 配置渲染模式/渲染效果
    render:{
      outputEncoding:"sRGBEncoding",
    },

    leftJoystick:true,
    //开启右摇杆旋转时，去掉右键旋转或触摸旋转
    // rightJoystick:true,

    // 设置水平旋转方向，1 或 -1
    rotaDirection:1,
    // rotaDirection:-1,

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
    targetRota: { x: -1.25, y: 0.8 },
    // targetRota: { x: -1.9, y: 0.8 },
    // targetRota: { x: -1.25, y: 1.3 },


    // 玩家刚体高度
    playerHeight: 1.2,  //最小0.8 ， 
    // 摄像机目标父物体，在刚体中心位置的Y轴偏移量。该值决定摄像机高度
    // camOffsetY: 0.8,
    // camOffsetY: 0.9,
    camOffsetY: 1,

    // 摄像机视野
    cameraFov:60,
  },

  // 热点数据
  hotPointData: {
    // YJTriggerArea脚本中旋转物体的旋转速度
    triggerAreaRotaSpeed: 0.01,
    // hotpointImgUrl:"hotpoint.png",
    // type:"static",
    // 3d模型上的热点icon
    hotpointImgUrl:"hotpoint2.png",
    // hotpointImgUrl:"hotpoint2Big.png",
    type:"anim",
    imgCount:36,
    speed:2,

    //MOT项目文字上的 感叹号icon
    // hotpointImgUrl2:"menuicon2325.png",
    // type2:"static",

    hotpointImgUrl2:"hotpoint3.png",
    type2:"anim",
    imgCount2:27,
    speed2:2,
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
    AmbientLightIntensity: 0.5,

    // 方向光坐标和强度
    DirectionalLightPos: { x: 0, y: 100, z: 1 },
    DirectionalLightIntensity: 0.5,

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
      img: "img/player/child1.png",
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
      img: "img/player/child1.png",
      modelType: "角色",
    },
  ],

  // 角色数据
  avatarData: [
    {
      name: "小孩",
      height: 1.7,
      nameScale: 1,
      // 模型缩放
      modelScale: 0.01,
      img: "img/player/farmPlayer.png",
      modelType: "角色",
      modelPath: "farmplayer/farmPlayerIdle.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 0 },
        { clipIndex: 3, animName: "run", timeScale: 1, connected: false, targetIndex: 1 }
      ]
    },
    {
      name: "小孩2",
      height: 1.7,
      nameScale: 1,
      modelScale: 0.03,
      img: "img/player/child1.png",
      modelType: "角色",
      modelPath: "farmplayer/farmPlayer2.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1, connected: false, targetIndex: 0 }
      ]
    },
  ]
}



