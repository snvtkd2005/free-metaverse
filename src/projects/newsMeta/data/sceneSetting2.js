


export default {

  // 房间名，用房间名来区分多个项目的同步
  roomName: "newsMeta2",
  platform: "pcweb",
  isMobile:false,

  // 界面设置
  setting: {
    // 是否始终强制横屏
    onlyLandscape:true,
    // 是否应用辉光效果
    useBloom:false,
    // 资源路径，资源的文件夹包裹。由此来区分不同的项目内容
    localPath: "newsMeta/",
    // 自定义鼠标光标
    cursorUrl: "",
    title: "多人线上农场",

    // 是否显示 "切换操作模式" 按钮
    hasChangeCtrlState: true,

    // 是否显示 "3d音乐" 按钮
    hasBGM: false,
    BGMurl: "musicverse/bg.mp3",

    //舍弃。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时, 摄像机到角色的距离
    camZ: -8,
    // 镜头最近距离
    camWheelMin: -2,
    // 镜头最远距离
    camWheelMax: -10,

    // 右上角中英文切换按钮
    righttopBtn: false,

    // 键盘C键切换操作模式
    keyC: false,
    // 键盘Q键 第一人称视角和第三人称视角切换
    keyQ: false,
    keySpace:false,

    // 是否启用鼠标滚轮推进拉远摄像机
    canMouseWheel: true,
    // 键盘G键 是否允许开关重力.
    canEnableGravity: false,


    // 是否有天空球
    // hasEnvmap: false,
    hasEnvmap: true,
    // 天空球全景图路径
    // envmapPath: "neutral.hdr",
    envmapPath: "BOCO_Studio-Christmas_0001_4k.hdr",
    

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
    cameraOffset: { x: 0, y: 1, z: -4 },
    // cameraOffset: { x: 0, y: 1, z: -7 },
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
    targetRota: { x: -1.25, y: 0.05 },

    


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
    playerRadius:0.1,

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
    hasDirectional:false,
    DirectionalLightPos: { x: -50, y: 100, z: 1 },
    DirectionalLightIntensity: 1,

  },

  // 默认角色信息
  defaultUser: {
    userName: "test",
    roomName: "3dfarm",
    platform: "pcweb",
    // 默认角色
    avatarName: "小孩",
  },

  modelPath:'models/Scene2/',
  // 场景txt路径
  sceneTexPath: "scene.txt",
  npcTexPath: "npc.json",
   
}



