


export default {

  // 房间名，用房间名来区分多个项目的同步
  roomName: "3dfarm",

  isMobile:false,
  // 界面设置
  setting: {

    
    // 资源路径，资源的文件夹包裹。由此来区分不同的项目内容
    localPath: "farm2/",
    // 自定义鼠标光标
    cursorUrl: "aks1b-iv02p-001.ico",
    title: "线上农场",


    // 是否显示 "切换操作模式" 按钮
    hasChangeCtrlState: true,

    // 是否显示 "3d音乐" 按钮
    hasBGM: false,
    BGMurl: "musicverse/bg.mp3",

    // 摄像机到角色的距离
    camZ: -8,
    // 镜头拉远最大距离
    camWheelMax: -30,

    // 右上角中英文切换按钮
    righttopBtn: false,

    // 键盘C键切换操作模式
    keyC: false,
    // 键盘Q键 第一人称视角和第三人称视角切换
    keyQ: false,
    // 是否启用鼠标滚轮推进拉远摄像机
    canMouseWheel: true,
    // 键盘G键 是否允许开关重力
    canEnableGravity: false,


    // 是否有天空球
    hasEnvmap: false,
    // 天空球全景图路径
    envmapPath: "",

    // 是否启用摄像机遮挡时拉近摄像机功能
    hasCamRaycast: false,

    // 是否启用小地图
    hasMinMap: true,
    // 是否在小地图编辑状态
    inMinMapEditor: false,

    // 是否鸟瞰开场
    hasAerialView: true,

    // 操作方式。 0 键鼠控制/遥感控制，1 鼠标点击地面 
    contrlState: 0,
    //键鼠控制时，摄像机距离
    wheelValue: -8,
    // 摄像机在角色后方的偏移位置。该值决定在后方的高度和角度
    cameraOffset: { x: 0, y: 5, z: -7 },

    speedData:{
      // 刚体移动速度
      moveSpeed: 8,
      // 行走速度
      walkSpeed: 8,
      // 按住左shift加速，奔跑速度
      runSpeed:10,
      // 刚体移动最大速度
      minSpeed: 1.5,
      // 刚体移动最小速度
      maxSpeed: 8,
      // 重力关闭后，允许飞行，上升速度
      upSpeed: 4,
      // 重力关闭后，允许飞行，飞行速度
      flySpeed: 10,
    },


    // 摄像机上下旋转的限制弧度
    targetRota: { x: -1.25, y: -0.03 },

    // 玩家刚体高度
    playerHeight: 1.7,
    // 摄像机目标父物体，在刚体中心位置的Y轴偏移量。该值决定摄像机高度
    // camOffsetY: 0.8,
    camOffsetY: 1.6,

    // 摄像机视野
    cameraFov:60,
  },

  // 热点数据
  hotPointData: {
    // YJTriggerArea脚本中旋转物体的旋转速度
    triggerAreaRotaSpeed: 0.03,
  },

 

  // 小地图数据
  minMapData: {
    // 小地图图片路径
    minMapUrl: "minMap.png",
    minMapPointUrl: "minMapPoint.png",
    // minMapOffset: { x: 0, y: 0.0 },
    // minMapScale: { x: 0.0029, y: 0.0029 },
    minMapOffset: { x: -0.019, y: -0.01 },
    minMapScale: { x: 0.0013, y: 0.0013 },

    // 小地图在界面中的位置
    // PC端小地图在屏幕中的靠左位置。 x左右  y上下
    minMapPlanePos: { x:-0.5, y: -0.43, z: -1 },
    // 移动端在屏幕中心位置
    minMapPlaneMobilePos: { x:0, y: -0.43, z: -1 },
  },

  // 环境光和方向光参数
  AmbientLightData: {
    //环境光 纯白颜色、强度
    AmbientLightIntensity: 0.8,

    // 方向光坐标和强度
    DirectionalLightPos: { x: 100, y: 100, z: 50 },
    DirectionalLightIntensity: 0.3,
  },

  // 默认角色信息
  defaultUser: {
    userName: "test",
    roomName: "3dfarm",
    platform: "pcweb",
    // 默认角色
    avatarName: "小孩2",
  },

  // 场景txt路径
  sceneTexPath: "models/Scene/scene.txt",

  // 角色选择界面的角色信息
  playerImgPath: [
    {
      name: "小孩",
      platform: "pcweb",
      img: "farm/images/player/10.png",
    },
    {
      name: "小孩2",
      platform: "pcweb",
      img: "farm/images/player/11.png",
    },
  ],

  // 模型库/皮肤列表数据
  modelsList: [
    {
      name: "小孩",
      img: "farm/images/player/10.png",
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
      img: "player/farmPlayer/farmPlayer.png",
      modelType: "角色",
      modelPath: "farmplayer/farmPlayerIdle.fbx",
      animationsData: [
        { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 1 },
        { clipIndex: 1, animName: "walk", timeScale: 1, connected: false, targetIndex: 0 },
        { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 0 }
      ]
    },
    {
      name: "小孩2",
      height: 1.7,
      nameScale: 1,
      modelScale: 0.03,
      img: "player/farmPlayer/farmPlayer.png",
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



