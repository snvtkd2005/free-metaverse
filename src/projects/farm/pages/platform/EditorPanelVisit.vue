<!-- :class=" sceneData.setting.onlyLandscape?'main':''" -->

<template>
  <div
    class="main absolute left-0 top-0 z-999 w-full h-full flex flex-col overflow-visible"
  >
    <!-- 中间3d画面 -->
    <div class="absolute left-0 top-0 w-full h-full ">
      <YJmetaBase ref="YJmetaBase" />

      <div class="hidden absolute top-0 left-0 cutimg overflow-hidden">
        <canvas id="nowcanvas" class="bg-white"> </canvas>
      </div>

      <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
      <div v-if="isMobile && hasAvatar && contrlState == 0">
        <JoystickLeftPanel class="" ref="JoystickLeftPanel" />
      </div>

      <!-- 视角远近滑块 -->
      <input
        ref="viewFarCtrl"
        v-if="isMobile"
        class="touch-action-none absolute -left-10 bottom-32 outline-none transform rotate-90"
        @input="viewFarFn"
        v-model="viewFar"
        type="range"
        min="0"
        max="23"
        step="1"
      />
      <!-- <JoystickLeftPanel class="" ref="JoystickLeftPanel" /> -->

      <!-- <JoystickRightPanel class=" " ref="JoystickRightPanel" /> -->
      <loadingPanel
        :loadingUrl="loadingUrl"
        class="absolute z-50 left-0 top-0 w-full h-full pointer-events-none"
        ref="loadingPanel"
      />

      <!-- HUD -->
      <HUD v-if="hasHUD" ref="HUD" />
      <div class="absolute left-0 top-0 w-full h-full pointer-events-none">
        <systemLogPanel ref="systemLogPanel" />
      </div>

      <!-- 鸟瞰2d点位 -->
      <div
        v-if="niaokanUI"
        class="absolute left-0 top-0 z-0 w-full h-full pointer-events-none overflow-hidden"
      >
        <div>
          <div
            v-for="(item, i) in projectionList"
            :key="i"
            :index="item.id"
            class="text-xl"
            :style="
              ' position:absolute; left:' +
              item.pos.x +
              'px;top:' +
              item.pos.y +
              'px'
            "
          >
            <div v-if="item.display" class="w-1 h-1 relative">
              <div
                class="w-32 h-10 transform -translate-x-16 -translate-y-5 pointer-events-auto cursor-pointer bg-gray-800 bg-opacity-80 rounded-xl flex text-white"
                @click="ClickHandler('点击投影2d', item.event)"
              >
                <div class="self-center mx-auto">
                  {{ item.content + " " }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="false"
        class="hidden xl:flex absolute left-2 bottom-10 w-auto pointer-events-none"
      >
        <div
          class="flex w-auto bg-black bg-opacity-20 text-white text-md rounded-lg h-auto"
        >
          <div class="px-2 text-left mx-auto self-center">
            键盘操作：<br />
            G:重力开关<br />
            M:小地图开关<br />
            H:九宫格展示开关<br />
            F:上下车<br />
            T:扔掉武器<br />
          </div>
        </div>
      </div>
    </div>

    <!-- 多人同步 -->
    <YJDync
      v-if="isMultiGame && inLoadCompleted"
      class="absolute z-0 left-0 top-0 w-full h-full"
      ref="YJDync"
    />

    <playVideo
      ref="playVideo"
      video_url="./public/farm/videos/movieSD.mp4"
      type="video/mp4"
    />

    <!-- 修改名称 -->
    <div class=" hidden absolute left-px top-px w-20 h-6 bg-red-600 text-white flex">
      <div class="w-auto h-6">hahaha{{ oldFileName }}</div>
    </div>
  </div>
</template>

<script>
import PlayerAnimData from "../../data/platform/playerAnimSetting.js";

// import playVideo from "./playVideo.vue";
import playVideo from "./playVideoHLS.vue";

import YJDync from "./YJDync.vue";

import YJmetaBase from "./YJmetaBase.vue";

import modelPanel from "./panels/modelPanel.vue";
import settingPanel from "./settingPanel/settingPanel.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

import { SceneManager } from "../../../../threeJS/game/managers/SceneManagerEditor.js";
import { Interface } from "../../js/Interface_editor.js";

import HUD from "./common/HUD.vue";
import systemLogPanel from "./common/systemLogPanel.vue";
// 摇杆
import JoystickLeftPanel from "./joystickLeft.vue";

import {
  UploadSceneFile,
  GetAllScene,
  GetAllModel,
} from "../../js/uploadThreejs.js"; 

export default {
  name: "EditorPanel",
  components: {
    loadingPanel,
    YJmetaBase,
    modelPanel,
    JoystickLeftPanel,
    playVideo,
    YJDync,
    settingPanel,
    HUD,
    systemLogPanel,
  },
  data() {
    return {
      hover: false,
      infloating: false,

      loadingUrl: "",
      _SceneManager: null,
      tableList: [
        // { id: 10000, content: "导入", },
        { id: 10000, content: "截图（制作缩略图）" },
        { id: 10000, content: "保存" },
        { id: 10000, content: "保存场景配置" },
        { id: 10000, content: "保存场景模型" },
        // { id: 10000, content: "发布", },
      ],
      viewFar: 5,

      // npc音效
      npcMusicUrl: "",

      inMeeting: false,
      meetingOwner: "",
      oldSceneName: "",

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

      //角色同步数据
      user: {
        pos: [-100, -100, 0],
        rota: [0, 0, 0],
        rotateY: 1,
        animName: "idle",
        playerData: {},
        userData: {},
      },

      userName: "",
      userId: "",
      id: "",

      pos: { x: -100, y: -100 },

      isMobile: true,

      language: null,
      isEn: false,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,

      viewFarIndex: 2,
      // viewFar: [0, -8, -16],

      displayMinMap: true,

      niaokanUI: true,
      projectionList: [
        // { id: "10001", content: "岛2", pos: { x: -500, y: -500 } },
      ],

      openModelPanel: "",

      publicUrl: "./public/",

      userData: {},
      initCompleted: false,

      avatarId: "",
      modelData: {},

      InDriving: false,
      inputing: false,
      Interface: null,
      modelList: [],
      folderBase: "wenjjjwe",
      // 场景配置。访问时，场景配置从服务器场景文本读取
      sceneData: {
        setting: {
          localPath: "farm/",
        },
      },
      sceneLoadUrl: "",
      oldFileName: "",
      sceneModelListDataPath: "",
      isMultiGame: true,
      settingVersion: "",
    };
  },
  created() {
    this.sceneLoadUrl = this.$uploadSceneUrl;
  },
  mounted() {
    this.isMobile = _Global.isMobile;

    if (this.$route.params.folderBase != undefined) {
      this.folderBase = this.$route.params.folderBase;
      if (this.$route.params.version != undefined) {
        this.settingVersion = this.$route.params.version;
      }
    } else if (this.$route.query.folderBase != undefined) {
      this.folderBase = this.$route.query.folderBase;
      if (this.$route.query.version != undefined) {
        this.settingVersion = this.$route.query.version;
      }
    } else {
      let modelData = JSON.parse(localStorage.getItem("modelData"));
      this.modelData = modelData;
      this.oldFileName = this.modelData.name;
      this.folderBase = modelData.folderBase;
    }

    // if (localStorage.getItem("userName")) {
    // } else {
    //   //没有输入过昵称，则跳转到角色选择页
    //   localStorage.setItem("needEnter", "1");
    //   localStorage.setItem("visitfolderBase", this.folderBase);
    //   this.$router.replace("/selectPlayerSingle");
    //   return;
    // }

    // let reloadTimes = localStorage.getItem("reloadTimes");
    // if (reloadTimes) {
    //   localStorage.removeItem("reloadTimes");
    //   window.location.reload();
    //   return;
    // }

    this.Interface = new Interface(this, false);

    this.loadingName = "loading.jpg";
    this.loadingUrl =
      this.$uploadSceneUrl +
      this.folderBase +
      "/" +
      this.loadingName +
      "?time=" +
      new Date().getTime();

    this.RequestGetAllModel(() => {
      this.RequestGetAllSceneData();
      this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);
    });

    document.addEventListener("visibilitychange", () => {
      _Global.inFocus = !document.hidden;
      _Global.pauseGame = document.hidden;
      if (!_Global.inFocus) {
        //暂停背景音乐
      }
      this.$refs.YJmetaBase.EventHandler(
        _Global.inFocus ? "播放音乐" : "暂停音乐"
      );

      // console.log(" _Global.inFocus ", _Global.inFocus);
    });
    _Global.addEventListener("是否启用虚拟摇杆", (b) => {
      this.isMobile = b;
    });
  },
  methods: {
    PlayBGAudio() {
      this.$refs.YJmetaBase.EventHandler("播放音乐");
    },
    // 获取所有单品
    async RequestGetAllModel(callback) {
      if (callback) {
        callback();
        return;
      }

      GetAllModel().then((res) => {
        // console.log("获取所有单品模型 ", this.folderBase, res);
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;

          let modelsList = [];
          for (let i = 0; i < txtDataList.length; i++) {
            let element = txtDataList[i];
            try {
              modelsList.push(JSON.parse(element));
            } catch (error) {
              element = element.substring(1);
              modelsList.push(JSON.parse(element));
            }
          }

          for (let i = 0; i < modelsList.length; i++) {
            let item = modelsList[i];
            if (item.modelType == "角色模型") {
              // 到角色数据中，模型路径、动画数据
              if (item.message) {
                let data = item.message.data;
                data.modelPath = this.$uploadUrl + item.modelPath;
                _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data);
              }
            }
          }
          if (callback) {
            callback();
          }
        }
      });
    },
    GetPlayerAnimData() {
      return PlayerAnimData;
    },
    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      _Global.YJ3D.removeEventListener();
      this.inputing = true;
    },
    addThreeJSfocus() {
      _Global.YJ3D.threeJSfocus();
      this.inputing = false;
      //取消设置面板的input焦点
      console.log("3d激活焦点");
    },
    Enter() {
      let avatarId = PlayerAnimData.defaultUser.avatarId;

      if (localStorage.getItem("avatarId")) {
        avatarId = localStorage.getItem("avatarId");
      }

      // 如果场景限制角色，则使用场景限制角色
      if (this.sceneData.avatarList && this.sceneData.avatarList.length > 0) {
        avatarId =
          this.sceneData.avatarList[
            this.Utils.RandomInt(0, this.sceneData.avatarList.length - 1)
          ].folderBase;
      }

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

      this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);
      _Global.user.name = (this.userName);


      //场景设置
      this._SceneManager = new SceneManager(
        _Global.YJ3D.scene,
        _Global.YJ3D.renderer,
        _Global.YJ3D.camera,
        this.$refs.YJmetaBase,
        _Global.YJ3D._YJSceneManager.GetmodelParent(),
        this,
        () => {
          // if (callback) {
          //   callback();
          // }
        }
      );
    },

    async RequestGetAllSceneData() {
      let res = await this.$axios.get(
        this.sceneLoadUrl +
          this.folderBase +
          "/" +
          "setting" +
          this.settingVersion +
          ".txt" +
          "?time=" +
          new Date().getTime()
      );

      // this.sceneData = JSON.parse(res.data) ;
      this.sceneData = res.data;
      // this.sceneData.setting.hasCamRaycast = true;
      this.sceneData.setting.camOffsetY =
        this.sceneData.setting.playerHeight / 2;
      console.log(" 获取场景配置 ", this.sceneData);
      this.isMultiGame = this.sceneData.setting.multiGame;
 
      this.gameType = this.sceneData.setting.gameType;
      _Global.gameType = this.gameType;
      this.hasHUD = this.sceneData.setting.hasHUD;

      // _Global.gameType = "WOW";

      document.title = this.sceneData.setting.title;

      
      this.oldFileName = this.sceneData.setting.title;
      _Global.skillList_scene = this.sceneData.skillList;

      // _Global.propList = this.sceneData.propList;
      _Global.hasAvatar = this.sceneData.setting.hasAvatar;
      this.hasAvatar = this.sceneData.setting.hasAvatar;

      this.$refs.YJmetaBase.Reload();
      this.$forceUpdate();
      this.Enter();
    },
    async RequestGetAllSceneModelData() {
      // let path = this.sceneLoadUrl + this.folderBase + "/" + this.folderBase + "_scene.txt";
      // console.log(" 获取场景 模型文本路径 ", path);
      let res = await this.$axios.get(
        this.sceneLoadUrl +
          this.folderBase +
          "/" +
          "scene.txt" +
          "?time=" +
          new Date().getTime()
      );

      this.modelList.splice(0, this.modelList.length);

      let data = res.data;
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        this.modelList.push(element);
      }
      // console.log(" 获取场景 模型 ", data);

      _Global.YJ3D._YJSceneManager.CreateSenceBy(this.modelList);
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
      if (npcName == "发呆") {
        this.npcMusicUrl = this.GetPublicUrl() + "audios/fadai.mp3";
      }
      if (npcName == "放牛娃") {
        this.npcMusicUrl = this.GetPublicUrl() + "audios/bird.mp3";
      }
      this.$nextTick(() => {
        this.$refs.npcMusic.play();
      });
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
      return _Global.YJClient.GetUseId();
    },
    //由角色选择界面传入 角色类型、用户名
    ClickSelectPlayerOK(selectPlayerName, userName) {
      this.userName = userName;
      localStorage.setItem("username", this.userName);
      this.avatarId = selectPlayerName;

      this.hasPlayerSelectPanel = false;
      this.inLoadCompleted = true;
      this.userData = {
        userName: userName,
        roomName: this.sceneData.roomName,
        platform: this.sceneData.platform,
        modelType: selectPlayerName,
      };

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.DisplayLoading();
      }

      //场景设置
      this._SceneManager = new SceneManager(
        _Global.YJ3D.scene,
        _Global.YJ3D.renderer,
        _Global.YJ3D.camera,
        this.$refs.YJmetaBase,
        _Global.YJ3D._YJSceneManager.GetmodelParent(),
        this,
        () => {
          // if (callback) {
          //   callback();
          // }
        }
      );

      // console.log(userData);

      this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);
 
      _Global.user.name = userName;

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
      // console.log(" 加载场景进度 " ,f); // 3d加载进度   0-1
      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.LoadingProcess(f);
      }
    },

    load3dComplete(callback) {
      console.log("场景加载完成------------");
      if (!this.initCompleted) {
        this.$refs.YJmetaBase.PlayVideo();
        this.$refs.YJmetaBase.AddVideoListener();
        this.Interface.SelectPlayerCompleted(this.avatarId, this.userName);
        this._SceneManager.ChangeScene(this.sceneData);
        this.$nextTick(() => {
          if (this.$refs.YJDync) {
            this.$refs.YJDync.InitDync(this.userData);
          } else {
            _Global.mainUser = true;
          }
        });
      } else {
        if (this.$refs.YJDync) {
          this.$refs.YJDync.ChangeRoom(this.sceneData.roomName);
        }
      }
      this.initCompleted = true;
      this._SceneManager.LoadMapCompleted();
      this.$refs.YJmetaBase.OpenThreejs();
      if (this.sceneData.setting.hasBGM && this.sceneData.setting.BGMurl) {
        this.$refs.YJmetaBase.addAudio(
          "bgmusic",
          this.sceneData.setting.BGMurl
        );
      }
      this.Interface.load3dComplete();
    },

    ClickHandler(t, msg) {
      if (t == "点击投影2d") {
        if (msg.title == "jump") {
          // 新窗口 新标签
          // window.open("https://www.baidu.com", "_blank");
          window.open(msg.content, "_blank");
        }
      }
    },
    // 3转2坐标
    UpdateProjectionUI(_projectionList) {
      this.projectionList = [];
      this.projectionList = _projectionList;
      // console.log(" 3转2 ",_projectionList);
    },

    SetViewState(e) {
      this.displayMinMap = e == "人视";
      // this.niaokanUI = e == "鸟瞰";

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
    OpenThreejs() {
      this.inThreejs = true;
      if (this.$refs.loadingPanel) {
        this.$refs.loadingPanel.DisplayLoading(false);
      }
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
    /* -webkit-transform: rotate(89deg);
    -moz-transform: rotate(89deg);
    -ms-transform: rotate(89deg);
    transform: rotate(89deg);
    transform-origin: 0% 0%; */

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