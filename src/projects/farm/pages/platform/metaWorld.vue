

<template>
  <div class="main absolute left-0 top-0 z-999 w-full h-full flex flex-col">
    <!-- 摆放模型 -->

    <YJmetaBase ref="YJmetaBase" />

    <div class="hidden absolute top-0 left-0 cutimg overflow-hidden">
      <canvas id="nowcanvas" class="bg-white"> </canvas>
    </div>

    <Metaworldmap2d class="absolute z-50 left-0 top-0" ref="Metaworldmap2d" />

    <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
    <div v-if="isMobile && contrlState == 0">
      <JoystickLeftPanel class="" ref="JoystickLeftPanel" />
      <!-- <JoystickRightPanel class=" " ref="JoystickRightPanel" /> -->
    </div>

    <loadingPanel
      class="
        absolute
        z-50
        left-0
        top-0
        pointer-events-none
        w-full
        h-full
        bg-black
      "
      ref="loadingPanel"
    />

    <HUD ref="HUD" />
    <!-- 多人同步 -->
    <YJDync
      v-if="inLoadCompleted"
      class="absolute z-50 left-0 top-0"
      :hasTRTC="this.hasTRTC"
      ref="YJDync"
    />

    <playVideo
      ref="playVideo"
      video_url="./public/farm/videos/movieSD.mp4"
      type="video/mp4"
    />

    <div class="hidden md:flex absolute left-0 top-6 w-auto">
      <div class="flex w-auto text-white text-md rounded-lg h-10">
        <div class="px-4 text-left mx-auto self-center">
          坐标 开放世界 <br />
          x:{{ coordinate.x }}<br />
          y:{{ coordinate.z }}
        </div>
      </div>
    </div>

    <div
      class="
        hidden
        md:flex
        absolute
        left-2
        bottom-10
        w-auto
        pointer-events-none
      "
    >
      <div
        class="
          flex
          w-auto
          bg-black bg-opacity-20
          text-white text-md
          rounded-lg
          h-auto
        "
      >
        <div class="px-2 text-left mx-auto self-center">
          键盘操作：<br />
          G:重力开关<br />
          M:小地图开关<br />
          H:九宫格展示开关<br />
          F:上下车<br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerAnimData from "../../data/platform/playerAnimSetting.js";

// import playVideo from "./playVideo.vue";
import playVideo from "./playVideoHLS.vue";

import YJDync from "./YJDync.vue";

import YJmetaBase from "./YJmetaBase.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

import { SceneManager } from "../../../../threeJS/game/managers/SceneManagerEditor.js";
// import { SceneManager } from "../../js/SceneManagerMetaworld.js";
import { Interface } from "../../js/Interface_editor.js";

import HUD from "./common/HUD.vue";
// 摇杆
import JoystickLeftPanel from "./joystickLeft.vue";

import { UploadSceneFile, GetAllScene } from "../../js/uploadThreejs.js";
import Metaworldmap2d from "./metaWorldmap2d.vue";

export default {
  name: "metaWorld",
  components: {
    loadingPanel,
    YJmetaBase,
    JoystickLeftPanel,
    playVideo,
    YJDync,
    Metaworldmap2d,
    HUD,
  },
  data() {
    return {
      infloating: false,

      _SceneManager: null,
      viewFar: 5,

      // 是否开启音视频
      // hasTRTC: true,
      hasTRTC: false,
 

      isInsertPanel: false,
      // 是否显示姓名条
      displayUserNameUI: false,

      hasPlayerSelectPanel: true,
      //是否可交互的提示
      jiaohuTip: false,

      inLoadCompleted: false,
      //房间名
      roomName: "",
      platform: "",
      selectPlayerName: "",
      playerImgPath: [],

      userName: "",
      userId: "",
      id: "",

      pos: { x: -100, y: -100 },

      isMobile: false,

      language: null,
      isEn: false,
      // playerAnimData: null,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,

      viewFarIndex: 2,
      // viewFar: [0, -8, -16],

      displayMinMap: true,

      niaokanUI: false,
      projectionList: [
        { id: "10001", content: "岛2", pos: { x: -500, y: -500 } },
      ],

      openModelPanel: "",

      publicUrl: "",

      userData: {},
      initCompleted: false,

      avatarName: "",
      modelData: {},

      InDriving: false,
      inputing: false,
      Interface: null,
      modelList: [],
      folderBase: "wenjjjwe",
      // 场景配置。访问时，场景配置从服务器场景文本读取
      sceneData: {
        // 房间名，用房间名来区分多个项目的同步
        roomName: "metaworld",
        platform: "pcweb",
        hasEditored: false,

        // 场景txt路径
        // sceneTexPath: "models/Scene/scene.txt",

        // modelPath: 'models/Scene/',
        // 场景txt路径
        // sceneTexPath: "scene.txt",
        // npcTexPath: "npc.json",
        // 界面设置
        setting: {
          // 是否始终强制横屏
          onlyLandscape: true,

          // 是否应用辉光效果
          useBloom: false,
          // useBloom:true,
          // 资源路径，资源的文件夹包裹。由此来区分不同的项目内容
          localPath: "farm/",
          // 自定义鼠标光标
          cursorUrl: "",
          title: "元宇宙开放世界",

          // 是否显示 "切换操作模式" 按钮
          hasChangeCtrlState: true,

          // 是否显示 "3d音乐" 按钮
          hasBGM: false,
          BGMurl: "musicverse/bg.mp3",

          //舍弃。该值由 cameraOffset 在YJController.中计算得出 键鼠控制时, 摄像机到角色的距离
          camZ: -8,
          // 镜头拉远最大距离
          camWheelMax: -300,

          // 右上角中英文切换按钮
          righttopBtn: false,

          // 键盘C键切换操作模式
          keyC: false,
          // 键盘Q键 第一人称视角和第三人称视角切换
          keyQ: false,
          // 键盘M键 打开小地图
          keyM: false,
          // 是否启用鼠标滚轮推进拉远摄像机
          canMouseWheel: true,
          // 键盘G键 是否允许开关重力.
          canEnableGravity: true,

          // 是否开启滑动阻尼
          canDampingRota: false,

          // 是否有天空球
          hasEnvmap: false,
          // 天空球全景图路径
          envmapPath: "020.hdr",

          hasSceneHDR: false,
          envSceneHDRPath: "020.hdr",

          // 是否启用摄像机遮挡时拉近摄像机功能
          hasCamRaycast: false,
          // hasCamRaycast: true,
          camRaycastMode: "near", // near 视角拉近 ; transparent 透明遮挡物。
          // camRaycastMode: "transparent",  // near 视角拉近 ; transparent 透明遮挡物。

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
          cameraOffset: { x: 0, y: 1.5, z: -4 },
          // cameraOffset: { x: 0, y: 5, z: -7 },
          // cameraOffset: { x: 0, y: 10, z: -14 },

          // 配置渲染模式/渲染效果
          render: {
            outputEncoding: "sRGBEncoding",
          },

          speedData: {
            // 刚体初始移动速度
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

          // 摄像机上下旋转的限制弧度. x顶部角度，y底部角度
          // targetRota: { x: -1.25, y: -0.03 },
          targetRota: { x: -1.56, y: 1.3 },

          // 放置在开放世界的坐标
          metaWorldCoordinate: [
            // { x: 0, y: 0, vaild: true }
          ],

          playerPos: { x: 0, y: 20, z: 0 },
          playerRotaV3: { x: 0, y: 0, z: 0 },
          // 玩家刚体高度
          playerHeight: 1.7,
          // 摄像机目标父物体，在刚体中心位置的Y轴偏移量。该值决定摄像机高度
          camOffsetY: 0.0,
          // 摄像机视野
          cameraFov: 60,

          //是否有寻路网格
          hasPathfinding: false,

          // 玩家刚体半径
          playerRadius: 0.2,
        },

        // 热点数据
        hotPointData: {
          // YJTriggerArea脚本中旋转物体的旋转速度
          triggerAreaRotaSpeed: 0.01,
        },

        hasFloor: true,
        floorSize: { x: 10, y: 10 },

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
          AmbientLightIntensity: 1,

          // 方向光坐标和强度
          hasDirectionalLight: true,
          // DirectionalLightPos: { x: 255, y: 30, z: -115 },
          DirectionalLightPos: { x: 0, y: 30, z: 0 },
          DirectionalLightIntensity: 1,

          backgroundColor: "#A7D0FF",
        },
      },
      sceneLoadUrl: "",
      oldFileName: "",
      sceneModelListDataPath: "",
      coordinate: { x: "", z: "" },
    };
  },
  created() {
    // this.publicUrl = this.$publicUrl + this.sceneData.setting.localPath;
    this.sceneLoadUrl = this.$uploadSceneUrl;
  },
  mounted() {
    // if (_Global.reloadTimes == 1) {
    //   window.location.reload();
    //   _Global.reloadTimes = 0;
    // }
    this.Interface = new Interface(this, false);
    // this.Interface = new Interface(this, true);

    if (this.$route.params.folderBase != undefined) {
      this.folderBase = this.$route.params.folderBase;
    } else if (this.$route.query.folderBase != undefined) {
      this.folderBase = this.$route.query.folderBase;
    } else {
      let modelData = JSON.parse(localStorage.getItem("modelData"));
      this.modelData = modelData;
      this.oldFileName = this.modelData.name;
      this.folderBase = modelData.folderBase;
    }

    if (this.$route.params.x != undefined) {
      this.sceneData.setting.playerPos.x = parseInt(this.$route.params.x);
      this.sceneData.setting.playerPos.z = parseInt(this.$route.params.z);
    } else if (this.$route.query.x != undefined) {
      this.sceneData.setting.playerPos.x = parseInt(this.$route.query.x);
      this.sceneData.setting.playerPos.z = parseInt(this.$route.query.z);
    } else {
    }

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);
    this.ThreejsHumanChat = _Global.YJ3D;

    setTimeout(() => {
      //先去加载场景
      this.ClickSelectPlayerOK();
    }, 2000);
  },
  methods: {
    GetPlayerAnimData() {
      return PlayerAnimData;
    },
    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      this.ThreejsHumanChat.removeEventListener();
      this.inputing = true;
    },
    addThreeJSfocus() {
      this.ThreejsHumanChat.threeJSfocus();
      this.inputing = false;
    },

    viewFarFn(e) {
      _Global.YJ3D.YJController.SetCameraWheelPos(-this.viewFar);
      // 取消焦点
      this.$refs.viewFarCtrl.blur();
    },
    changeViewSliderValue(e) {
      this.viewFar = -e;
    },
    GetAvatarData(playerName) {
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      console.error(" 角色信息未找到 ", playerName);
    },

    UpdateSkin(_YJPlayer, playerName, playerState) {
      // this._SceneManager.UpdateSkin(_YJPlayer, playerName, playerState);
      // return;
      // console.error(" 同步换装数据 ",playerName, playerState);
      if (
        playerName != "litleUnityChain2" ||
        playerState == null ||
        playerState == undefined
      ) {
        _YJPlayer.ChangeSkinCompleted();
        return;
      }

      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      let skinData = avatarData.skinData;
      if (skinData == undefined || skinData.length <= 1) {
        return;
      }
      let sp = playerState.split("_");
      for (let i = 0; i < skinData.length; i++) {
        skinData[i].selected = parseInt(sp[i]);
      }
      let mode = "";
      let part = "";
      let targetPath = "";

      let faceSourcePath = "";
      let faceAddPath = "";

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }
      }

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          targetPath = element.modelPath[element.selected];

          _YJPlayer.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
          _YJPlayer.ChangeSkin(
            targetPath,
            "Face",
            element.mode,
            faceSourcePath
          );
          _YJPlayer.ChangeSkin(
            faceAddPath,
            "Face",
            "addTexture",
            faceSourcePath
          );
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
      }
      setTimeout(() => {
        _YJPlayer.ChangeSkinCompleted();
      }, 500);
    },

    SetNpcMusicUrl(npcName) {
      return;
    },
    ChangePanel(e) {
      if (this.openModelPanel != e) {
        this.openModelPanel = e;
      } else {
        this.openModelPanel = "";
      }
    },

    ChangeAvatar(playerName, callback) {
      if (this.$refs.gameUI) {
        this.$refs.gameUI.ChangeAvatar(
          this.$refs.YJmetaBase.GetAvatarData(playerName),
          callback
        );
      }
    },
    GetUseId() {
      return this.$refs.YJDync.GetUseId();
    },
    //由角色选择界面传入 角色类型、用户名
    ClickSelectPlayerOK() {
      let avatarId = PlayerAnimData.defaultUser.avatarId;
      this.userName = "aa";
      if (localStorage.getItem("userName")) {
        this.userName = localStorage.getItem("userName");
      }

      this.avatarId = avatarId;

      this.hasPlayerSelectPanel = false;
      this.inLoadCompleted = true;
      this.userData = {
        userName: this.userName,
        roomName: this.sceneData.roomName,
        platform: this.sceneData.platform,
        avatarId: avatarId,
      };

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.DisplayLoading();
      }

      localStorage.setItem("modelType", "场景");

      // console.log(userData);

      this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);

      // 显示玩家姓名条
      _Global.YJ3D.SetNickName(this.userName);

      //场景设置
      this._SceneManager = new SceneManager(
        _Global.YJ3D.scene,
        _Global.YJ3D.renderer,
        _Global.YJ3D.camera,
        _Global.YJ3D,
        _Global.YJ3D._YJSceneManager.GetmodelParent(),
        this,
        () => {
          // if (callback) {
          //   callback();
          // }
        }
      );

      setTimeout(() => {
        _Global.YJ3D._YJSceneManager.LoadMetaWorld();
      }, 2000);

      console.log("场景加载完成------------");

      var that = this;

      window.onfocus = function () {
        // console.log("激活焦点");
      };
      window.onblur = function () {
        // console.log("失去焦点");
        that.$refs.YJmetaBase.ThreejsHumanChat.YJController.onblur();
      };
    },

    SetTriggerOverlap(b, id, owner) {
      if (this._SceneManager) {
        this._SceneManager.SetTriggerOverlap(b, id, owner);
      }
      this.Interface.SetTriggerOverlap(b, id, name);
    },

    LoadingProcess(f) {
      // 3d加载进度   0-1
      // console.log(" 加载场景进度 " ,f);

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.LoadingProcess(f);
      }
    },

    load3dComplete(callback) {
      console.error("场景初始化完成------------");

      if (!this.initCompleted) {
        _Global.YJ3D.PlayVideo();
        _Global.YJ3D.AddVideoListener();
 
        this.$nextTick(() => { 
          this.Interface.SelectPlayerCompleted(this.avatarName, this.userName);
        });

        this._SceneManager.ChangeScene(this.sceneData);
      }
      this.initCompleted = true;
      this.Interface.load3dComplete();
    },
    // 3转2坐标
    UpdateProjectionUI(_projectionList) {
      // this.projectionList=[];
      // this.projectionList = _projectionList;
      for (let i = 0; i < _projectionList.length; i++) {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          if (_projectionList[i].id == this.projectionList[ii].id) {
            this.projectionList[ii].pos = _projectionList[i].pos;
          }
          // if(_projectionList[i].id == this.projectionList[i].id){
          //   this.projectionList[i].pos = _projectionList[i].pos;
          // }
        }
      }
      // console.log(" 3转2 ",_projectionList);
    },

    SetViewState(e) {
      this.displayMinMap = e == "人视";
      this.niaokanUI = e == "鸟瞰";

      if (e == "人视") {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          this.projectionList[ii].pos.x = -500;
          this.projectionList[ii].pos.y = -500;
        }
      }
    },

    // 点击角色NPC，显示NPC下方的光圈
    ClickPlayer(owner) {
      if (this._SceneManager) {
        this._SceneManager.ClickPlayer(owner);
      }
    },

    RightClick(hitObject, hitPoint) {
      this._SceneManager.RightClick(hitObject, hitPoint);
    },
    ClickModel(hitObject) {
      // console.log(" 点击模型 owner ", hitObject);
      if (this.$refs.modelPanel) {
        this.$refs.modelPanel.SetModel(hitObject.owner);
      }
      if (this._SceneManager) {
        this._SceneManager.ClickModel(hitObject);
      }
    },
    HoverObject(hoverObject, hoverPoint) {
      if (this._SceneManager) {
        this._SceneManager.HoverObject(hoverObject, hoverPoint);
      }
    },

    CreateHotContent(modelData, owner) {
      console.log("点击热点 ", modelData, owner);
      this.Interface.LoadData(modelData.id);
      if (this._SceneManager) {
        this._SceneManager.CreateHotContent(modelData, owner);
      }
    },
    ClickHotPointOwner(hitObject) {
      let hotPointData = hitObject.owner.GetHotPointData();
      // console.log(" hotpointdata  ", hotPointData);
      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {
          _Global.YJ3D._YJSceneManager.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );

          //视角拉近
          _Global.YJ3D.YJController.ChangeToPersonView();

          _Global.YJ3D.YJController.ChangeCameraToFar();
          this.viewFarIndex = 2;
        }
      }
    },

    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {
      _Global.YJ3D._YJSceneManager.ChangeViewById(id);
    },

    ChangeViewFar() {
      this.viewFarIndex++;
      if (this.viewFarIndex >= this.viewFar.length) {
        this.viewFarIndex = 0;
      }
      let far = this.viewFar[this.viewFarIndex];
      // _Global.YJ3D.YJController.ChangeCameraFar();
      _Global.YJ3D.YJController.SetCameraWheelPos(far);
    },

    GetPublicUrl() {
      return this.publicUrl;
    },
    GetSceneTexPath() {
      return this.GetModelUrl() + this.sceneData.sceneTexPath;
    },
    GetModelUrl() {
      return this.sceneData.modelPath;
    },
    GetPublicModelUrl() {
      return this.GetPublicUrl() + this.sceneData.modelPath;
    },

    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.sceneData.minMapData;
      return minMapData;
    },
    LoadMapCompleted() {
      if(this.hasYJDync){
        return;
      }
      this.hasYJDync = true;
      this.$nextTick(() => {
        if (this.$refs.YJDync) {
          this.$refs.YJDync.InitDync(this.userData);
        } else {
          _Global.mainUser = true;
        }
      });
    },
    OpenThreejs() {
      this.inThreejs = true;
      this.$refs.YJmetaBase.OpenThreejs();

      if (this.$refs.loadingPanel) {
        this.$refs.loadingPanel.DisplayLoading(false);
      }
      // setTimeout(() => {
      //   this.ChangeViewById(10004);
      // }, 2000);
    },
    ClickNiaokan() {
      _Global.YJ3D.YJController.ResetToNiaokanView();
    },
  },
};
</script>
 
<style scoped>
/*竖屏*/
@media screen and (orientation: portrait) {
  .main {
    position: absolute;
    width: 100vh;
    height: 100vw;
    top: 0;
    left: 100vw;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
    transform-origin: 0% 0%;
  }
}
.z-999 {
  z-index: 999;
}

.bg-color {
  background: #28cad9;
}
</style>