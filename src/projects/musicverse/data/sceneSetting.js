


export default {

  // 房间名，用房间名来区分多个项目的同步
  roomName: "musicverse",
  platform: "pcweb",

  // 界面设置
  setting: {


    // 资源路径，资源的文件夹包裹。由此来区分不同的项目内容
    localPath: "musicverse/",
    // 是否需要虚拟摇杆
    hasJoystick: false,


    // 连接服务器提示
    connectingTip: "connecting...",

    // 默认语种
    language: "en",

    title: "musicverse",
    // 是否显示 "切换操作模式" 按钮
    hasChangeCtrlState: false,

    // 是否显示 "3d音乐" 按钮
    hasBGM: true,
    BGMurl: "bg.mp3",

    // 摄像机到角色的初始距离
    camZ: -3,
    // 镜头拉远最大距离
    camWheelMax: -8,

    // 右上角中英文切换按钮
    righttopBtn: true,

    // 键盘C键切换操作模式
    keyC: false,
    // 键盘Q键 第一人称视角和第三人称视角切换
    keyQ: false,

    // 是否启用鼠标滚轮推进拉远摄像机
    canMouseWheel: true,
    // 键盘G键 是否允许开关重力.
    canEnableGravity: true,

    // 是否有天空球
    hasEnvmap: true,
    // 天空球全景图路径
    envmapPath: "satara_night_2k.exr",

    // 是否启用摄像机遮挡时拉近摄像机功能
    hasCamRaycast: true,


    // 是否启用3d做法的小地图
    hasMinMap: false,
    // 是否启用2d做法的小地图
    has2dMinMap: false,
    // 是否在小地图编辑状态
    inMinMapEditor: false,

    // 是否鸟瞰开场
    hasAerialView: false,

    //是否开始时锁定到鸟瞰位置
    isLockStartAerial: false,

    // 是否第一人称视角
    // firstPerson :true,

    // 是否有角色
    hasAvatar: true,

    // 操作方式。 0 键鼠控制/遥感控制，1 鼠标点击地面 
    contrlState: 0,
    //舍弃/>-1控制隐藏角色。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时，摄像机距离
    wheelValue: -8,
    // 摄像机在角色后方的偏移位置。该值决定在后方的高度和角度
    // cameraOffset: { x: 0, y: 2, z: -4 },
    cameraOffset: { x: 0, y: 10, z: -14 },

    speedData: {
      // 刚体移动速度
      moveSpeed: 5,
      // 行走速度
      walkSpeed: 5,
      // 按住左shift加速，奔跑速度
      runSpeed: 8,
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
    targetRota: { x: -1.25, y: 1.3 },


    // 玩家刚体高度
    playerHeight: 1.7,
    // 摄像机目标父物体，在刚体中心位置的Y轴偏移量。该值决定摄像机高度
    // camOffsetY: 0.8,
    camOffsetY: 0,
    // 摄像机视野
    cameraFov: 60,
    // 配置渲染模式/渲染效果
    render: {
      outputEncoding: "sRGBEncoding",
    },

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
    minMapPlanePos: { x: -0, y: -0.45, z: -1 },
    minMapPlaneMobilePos: { x: 0, y: -0.43, z: -1 },
  },

  // 环境光和方向光参数
  AmbientLightData: {
    //环境光 纯白颜色、强度
    AmbientLightIntensity: 0.51,

    // 方向光坐标和强度
    DirectionalLightPos: { x: -50, y: 100, z: 1 },
    DirectionalLightIntensity: 0.51,

  },
  // 默认角色信息
  defaultUser: {
    userName: "test",
    roomName: "musicverse",
    platform: "pcweb",
    // 默认角色
    avatarName: "f2",
  },


  // 场景txt路径
  sceneTexPath: "scene.txt",

  modelPath: "models/Scene/",

  // 角色选择界面的角色信息
  playerImgPath: [
    {
      name: "f2",
      platform: "pcweb",
      img: "images/player/f2.png",
    },
    {
      name: "f28",
      platform: "pcweb",
      img: "images/player/f28.png",
    },
    {
      name: "m3",
      platform: "pcweb",
      img: "images/player/m3.png",
    },
    {
      name: "m11",
      platform: "pcweb",
      img: "images/player/m11.png",
    },
  ],

  // 模型库/皮肤列表数据
  modelsList: [

    {
      name: "f2",
      modelType: "角色",
      img: "images/player/f2.png",
    },
    {
      name: "f28",
      modelType: "角色",

      img: "images/player/f28.png",
    },
    {
      name: "m3",
      modelType: "角色",

      img: "images/player/m3.png",
    },
    {
      name: "m11",
      modelType: "角色",

      img: "images/player/m11.png",
    },

  ],

  // 角色数据
  avatarData: [
    {
      name: "f2",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/f2.png",
      modelType: "角色",
      modelPath: "players/f_2.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    },
    {
      name: "f28",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/f28.png",
      modelType: "角色",
      modelPath: "players/f_28.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    },
    {
      name: "m3",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/m3.png",
      modelType: "角色",
      modelPath: "players/m_3.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    },
    {
      name: "m11",
      height: 0.8,
      nameScale: 1,
      modelScale: 0.01,
      img: "images/player/m11.png",
      modelType: "角色",
      modelPath: "players/m_11.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 1, animName: "walk", timeScale: 1.5, connected: false, targetIndex: 1 },
        { clipIndex: 2, animName: "jump", timeScale: 1.5, connected: false, targetIndex: 2 }
      ]
    },
  ]
}



