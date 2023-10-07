
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <div :class="this.avatarData.setting.onlyLandscape ? 'main' : ''">
    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

    <!-- 加载loading -->
    <!-- <loadingPanel class="absolute z-50 left-0 top-0" ref="loadingPanel" /> -->
    <spsloading class="absolute z-50 left-0 top-0" ref="loadingPanel" />

  <!-- 小地图透明按钮 -->
  <!-- <div v-if="avatarData.setting.hasMinMap" class="absolute z-20 left-0 bottom-8 w-full pointer-events-none">
                    <div class="mx-auto w-60 h-36 bg-transparent pointer-events-auto" @click="ClickNiaokan()"></div>
                  </div> -->

  <!-- <div v-if="avatarData.setting.has2dMinMap"  class=" absolute left-1/2 bottom-0 w-96 h-48 transform -translate-x-48 scale-75 "  @click="ClickNiaokan()">
                      <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
                  </div> -->

    <!-- <div v-if="avatarData.setting.has2dMinMap" v-show="displayMinMap" class="
          absolute
          -left-32
          -bottom-32
          md:left-0 md:bottom-0
          transform
          scale-50
          w-40
          h-40
          md:w-96
          md:h-96
          md:scale-100
        " @click="ClickNiaokan()">
      <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
    </div> -->

    <div v-if="avatarData.setting.has2dMinMap" v-show="displayMinMap" class="
          absolute
           left-0 bottom-0
          transform
        "
        :class="isMobile?' origin-bottom-left scale-50  w-96 h-96 ':' md:w-96 md:h-96 md:scale-100 '"
         @click="ClickNiaokan()">
      <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
    </div>




    <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
    <div v-if="isMobile && contrlState == 0">
      <JoystickLeftPanel class="" ref="JoystickLeftPanel" />
      <!-- <JoystickRightPanel class=" " ref="JoystickRightPanel" /> -->
    </div>

  <!-- <div v-show="displayMinMap" class=" absolute flex right-5 bottom-5 w-auto h-10 rounded-full shadow-md bg-gray-100 cursor-pointer "
    @click="ChangeViewFar">
    <div class=" px-2 self-center mx-auto">
      ViewFar
                    </div>
                  </div> -->

    <!-- 鸟瞰2d点位 -->
    <!-- class="text-xl flex cursor-pointer pointer-events-auto   w-10 h-10 transform -translate-x-5 -translate-y-5  " -->

    <div v-if="niaokanUI" class="absolute left-0 top-0 z-10 w-full h-full pointer-events-none">
      <div>
        <div v-for="(item, i) in projectionList" :key="i" :index="item.id"
          class="text-xl flex cursor-pointer pointer-events-auto" :style="
            ' position:absolute; left:' +
            (item.pos.x - 58) +
            'px;top:' +
            (item.pos.y - 250) +
            'px'
          " @click="ClickProjectionId(item.id)">
          <div class="
                hidden
                absolute
                top-5
                left-5
                bg-black bg-opacity-80
                rounded-full
                text-white
              ">
            <!-- {{ item.content + ' ' }} -->
            <!-- {{ item.id+' ' + item.pos.x + " " + item.pos.y }} -->
          </div>
          <img :src="publicUrl + item.icon" :class="isMobile?'scaleImg':''" />
          <!-- <img class="origin-bottom transform scale-75" :src="publicUrl + item.icon" :class="isMobile?'scaleImg':''" /> -->
        </div>
      </div>
    </div>

<!-- 提示 手机不用看-->
<TipsTool v-if=" !isMobile"></TipsTool>
    <!-- 多人同步 -->
    <YJDync class="absolute z-50 left-0 top-0" v-if="inLoadCompleted" :hasTRTC="this.hasTRTC" ref="YJDync" />

    <FinalDialog></FinalDialog>
    <Menu></Menu>


    <!-- 拍照合影 -->
    <!-- <photoPanel  class="absolute z-50 left-0 top-0" ref="photoPanel" /> -->

    <!-- 角色头像 -->
    <!-- <gameUI v-if="this.hasGameUI" class="absolute z-0 left-0 top-0" ref="gameUI" /> -->

    <!-- 皮肤切换面板 -->
    <!-- <playerAvatarPanel :openModelPanel="openModelPanel" ref="playerAvatarPanel" /> -->
    <!-- 场景切换面板 -->
    <!-- <scenePanel :openModelPanel="openModelPanel" ref="scenePanel" /> -->
  </div>

      <!-- 游戏进入页的角色选择面板 -->
      <playerSelectPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" />

  <!-- <playVideo ref="playVideo" video_url="./public/farm/videos/movieSD.mp4" type="video/mp4" /> -->

  <!-- npc音效 -->
  <!-- <div v-if="npcMusicUrl != ''">
    <audio :src="npcMusicUrl" ref="npcMusic"></audio>
  </div> -->

</template>

<script>
// 三维页

import Menu from "./dialog/menu.vue";
import YJDync from "./YJDync.vue";
import TipsTool from './dialog/tipsTool.vue'

// import modelBagList from "/@/views/chat/modelBagList.vue";

import playerAvatarPanel from "/@/views/chat/playerAvatarPanel.vue";
import scenePanel from "./scenePanel.vue";

// import playVideo from "./playVideo.vue";

import playerSelectPanel from "./playerSelectPanelSimple.vue";

import minMapEditor from "/@/views/chat/minMapEditor.vue";
import map2d from "./map2d.vue";

// 摇杆
import JoystickLeftPanel from "./joystickLeft.vue";
// import JoystickRightPanel from "./joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";
import spsloading from "./spsloading.vue";

// farm
import AvatarData from "../data/sceneSetting.js";

//角色动作数据
import PlayerAnimData from "../data/playerAnimSetting.js";

import Language from "/@/data/zh_cn.js";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// import gameUI from "./gameUI.vue";

import { deepClone } from "/@/utils/deepclone.js";

// import { YJNPCManager } from "../js/YJNPCManager.js";
import { SceneManager } from "../js/SceneManager.js";

import { Interface } from "../js/Interface.js";

// 拍照
// import photoPanel from "./photo.vue";

import FinalDialog from "./dialog/finalDialog.vue";

export default {
  name: "index",
  components: {
    // ThreejsHumanChat,
    minMapEditor,
    loadingPanel,
    JoystickLeftPanel,
    // JoystickRightPanel,
    map2d,
    YJDync, 
    // playerAvatarPanel,
    scenePanel,
    YJmetaBase,
    playerSelectPanel,
    // photoPanel,
    // gameUI,
    // playVideo,
    FinalDialog,
    Menu,
    spsloading,
    TipsTool,
  },
  data() {
    return {
      // _YJNPCManager: null,
      _SceneManager: null,
      // npc音效
      npcMusicUrl: "",

      inMeeting: false,
      meetingOwner: "",
      oldSceneName: "",

      // 是否开启音视频
      // hasTRTC: true,
      hasTRTC: false,

      // 是否有左上角头像、姓名、血条
      hasGameUI: false,

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

      isMobile: false,

      language: null,
      isEn: false,
      avatarData: null,
      playerAnimData: null,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,

      viewFarIndex: 2,
      viewFar: [0, -8, -16],

      displayMinMap: true,

      niaokanUI: false,
      projectionList: [
        {
          id: "label001",
          content: "岛4",
          pos: { x: -500, y: -500 },
          icon: "images/sps/shiye.png",
        },
        {
          id: "label002",
          content: "岛2",
          pos: { x: -500, y: -500 },
          icon: "images/sps/caiyongqingbao.png",
        },
        {
          id: "label003",
          content: "岛1",
          pos: { x: -500, y: -500 },
          icon: "images/sps/zhizuoshinei.png",
        },
        {
          id: "label004",
          content: "岛5",
          pos: { x: -500, y: -500 },
          icon: "images/sps/shiyeshinei.png",
        },
        {
          id: "label005",
          content: "岛3",
          pos: { x: -500, y: -500 },
          icon: "images/sps/huisheqingbao.png",
        }, 
        { id: 'label006', content: '岛3', pos: { x: -500, y: -500 }, icon: 'images/sps/coming.png' },
      ],
      usernamePrefix: [
        "清澈的",
        "波涛汹涌的",
        "华丽的",
        "巍峨的",
        "坚硬的",
        "尖利的",
        "蓝蓝的",
        "精湛的",
        "坚固的",
        "坚定的",
      ],

      usernamesuffix: [
        "流水",
        "海水",
        "丝绸",
        "高山",
        "盔甲",
        "刀锋",
        "天空",
        "技艺",
        "友谊",
        "初心",
      ],
      openModelPanel: "",

      publicUrl: "",

      userData: {},
      initCompleted: false,

      Interface: null,
      avatarName: "",
    };
  },

  created() {
    this.Interface = new Interface(this);

    this.avatarData = AvatarData;

    this.playerAnimData = PlayerAnimData;

    this.displayMinMap = !this.avatarData.setting.hasAerialView;

    // console.log(Language);
    this.language = Language.languageCN;
    // this.language = Language.languageEN;
    // document.title = this.avatarData.setting.title;

    this.publicUrl = this.$publicUrl + this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {
    if (this.$refs.playerSelectPanel && this.hasPlayerSelectPanel) {
      // console.log("获取用户名 " ,  this.$route.params);

      if (this.$route.params.userName != undefined) {
        this.userName = this.$route.params.userName;
        // console.log("获取用户名 " +  this.userName);
        // sessionStorage.setItem("userName", this.userName);
      } else {
        this.userName = "sps太郎";
      }

      let avatarName = this.playerAnimData.defaultUser.avatarName;

      if (localStorage.getItem("avatarName")) {
        avatarName = localStorage.getItem("avatarName");
      }
      if (localStorage.getItem("userName")) {
        this.userName = localStorage.getItem("userName");
      }

      // console.log("_Global.selectPlayerName = " ,avatarName);

      // this.ClickSelectPlayerOK(avatarName, this.userName);
    } else {
      //跳过角色选择，直接加载场景
      let q = Math.floor(Math.random() * 10);
      let h = Math.floor(Math.random() * 10);
      let t = Math.floor(Math.random() * 10000);
      this.userName = this.usernamePrefix[q] + this.usernamesuffix[h] + t;
      this.userName = "sps太郎";
      this.ClickSelectPlayerOK(
        this.playerAnimData.defaultUser.avatarName,
        this.userName
      );
    }

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    window.onChangeViewById += this.ChangeViewById;
  },
  methods: {
    GetAvatarData(playerName) {
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      console.error(" 角色信息未找到 ", playerName);
    },
    Photo(callback) {
      return this._SceneManager.Photo(callback);
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

    // 在初始页选择场景，只更新场景数据
    SelectScene(sceneName) {
      this.avatarData = this.$refs.scenePanel.SelectScene(sceneName);
      this.$refs.YJmetaBase.Reload();
    },
    ClickChangeScene(sceneSetting) {
      this.ChangeScene(sceneSetting);
      this.inMeeting = false;
    },
    //切换场景
    ChangeScene(sceneSetting) {
      this.avatarData = sceneSetting;
      this.publicUrl = this.$publicUrl + this.avatarData.setting.localPath;

      // 程序加载场景
      this.$refs.YJmetaBase.Reload();
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeScene();

      //websocket 切换房间
      if (this.$refs.YJDync) {
        this.$refs.YJDync.ChangeRoom(this.avatarData.roomName);
      }

      if (this._SceneManager != null) {
        this._SceneManager.ChangeScene(this.avatarData.modelPath);
      }
    },
    LeaveMeeting() {
      let avatarData = this.$refs.scenePanel.SelectScene(this.oldSceneName);
      this.$refs.scenePanel.DisplayLoading();
      this.ChangeScene(avatarData);
      this.inMeeting = false;
    },
    // 切换到会议房间。会议房间名用 发送者id 命名
    ChangeToMeetingRoom(meetingId, meetingOwner) {
      let avatarData = deepClone(this.$refs.scenePanel.SelectScene("scene2"));
      avatarData.roomName = meetingId;

      this.inMeeting = true;
      this.meetingOwner = meetingOwner;
      this.oldSceneName = this.$refs.scenePanel.GetCurrentSceneName();

      console.log(" 会议发起人 " + this.meetingOwner + " " + this.oldSceneName);
      this.$refs.scenePanel.DisplayLoading();

      this.ChangeScene(avatarData);
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
    ClickSelectPlayerOK(selectPlayerName, userName) {
      this.userName = userName;
      localStorage.setItem("username", this.userName);
      this.avatarName = selectPlayerName;

      this.hasPlayerSelectPanel = false;
      this.userData = {
        userName: userName,
        roomName: this.avatarData.roomName,
        platform: this.avatarData.platform,
        modelType: selectPlayerName,
      };

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.DisplayLoading();
      }

      // console.log(userData);

      this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);

      // 显示玩家姓名条
      this.$refs.YJmetaBase.ThreejsHumanChat.SetNickName(userName);

  

      console.log("场景加载完成------------");
      // this.$nextTick(() => {
      //   if (this.$refs.YJDync) {
      //     this.$refs.YJDync.InitDync(this.userData);
      //   }
      // });

      var that = this;

      window.onfocus = function () {
        // console.log("激活焦点");
      };
      window.onblur = function () {
        // console.log("失去焦点");
        that.$refs.YJmetaBase.ThreejsHumanChat.YJController.onblur();
      };
    },

    CreateIconTo(name, pos) {
      if (this.$refs.gameUI) {
        this.$refs.gameUI.CreateIconTo(name, pos);
      }
    },
    UpdateIconTo(name, pos) {
      if (this.$refs.gameUI) {
        this.$refs.gameUI.UpdateIconTo(name, pos);
      }
    },
    DelIconTo(name) {
      if (this.$refs.gameUI) {
        this.$refs.gameUI.DelIconTo(name);
      }
    },

    CreateHotContent(modelData, owner) {
      this.Interface.LoadData(modelData.id);

      console.log("点击热点 ", modelData, owner);
      if (modelData.id.includes("chair")) { 
      }
    },
    SetTriggerOverlap(b, id, owner) {
      this.Interface.SetTriggerOverlap(b, id);
 
      this._SceneManager.SetTriggerOverlap(b, id, owner);
    },

    LoadingProcess(f) {
      // 3d加载进度   0-1
      // console.log(" 加载场景进度 " ,f);

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.LoadingProcess(f);
      }
    },

    load3dComplete(callback) {
      console.log("场景加载完成------------");
      this.inLoadCompleted = true;

      if (!this.initCompleted) {
        this.hasGameUI = true;
        this.$nextTick(() => {
          if (this.$refs.gameUI) {
            this.$refs.gameUI.SetPlayerName(this.userName, this.avatarName);
            this.$refs.gameUI.InitPlayerHeader();
          }

          this.Interface.SelectPlayerCompleted(this.avatarName, this.userName);
        });

        //场景设置
        this._SceneManager = new SceneManager(
          this.$refs.YJmetaBase.ThreejsHumanChat.scene,
          this.$refs.YJmetaBase.ThreejsHumanChat.renderer,
          this.$refs.YJmetaBase.ThreejsHumanChat.camera,
          this.$refs.YJmetaBase.ThreejsHumanChat,
          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetmodelParent(),
          () => {
            if (callback) {
              callback();
            }
          }
        );

        // this._YJNPCManager = new YJNPCManager(
        //   this.$refs.YJmetaBase.ThreejsHumanChat,
        //   this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetmodelParent(),
        //   this.GetPublicUrl() + this.GetModelUrl() + this.avatarData.npcTexPath
        // );

        this._SceneManager.ChangeScene(this.avatarData.modelPath);

        this.$nextTick(() => {
          if (this.$refs.YJDync) {
            this.$refs.YJDync.InitDync(this.userData);
          }
        });
      } else {
        // if (this._YJNPCManager != null) {
        //   this._YJNPCManager.LoadNpc(
        //     this.GetPublicUrl() +
        //     this.GetModelUrl() +
        //     this.avatarData.npcTexPath
        //   );
        // }
      }

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.load3dComplete();
      }
      this.initCompleted = true;

      if (this.$refs.gameUI) {
      }
      this.$nextTick(() => {
        if (this.$refs.gameUI) {
          this.$refs.gameUI.ChangeScene(this.avatarData.roomName);
        }
      });

      this.Interface.load3dComplete();

      // new SceneManager_MaterialSetting(
      // this.$refs.YJmetaBase.ThreejsHumanChat.scene,
      // this.$refs.YJmetaBase.ThreejsHumanChat.renderer,
      // this.$refs.YJmetaBase.ThreejsHumanChat.camera,
      // this.$refs.YJmetaBase.ThreejsHumanChat
      // );
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

    ClickProjectionId(id) {
      this.oldDialogId = id;
      this.HotPointFn(
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointDataById("playerPos_"+ id)
        // this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointDataById(id)
      );
    },

    HotPointFn(hotPointData) {
      console.log("热点信息为 ", hotPointData);
      if (hotPointData == null) {
        return;
      }

      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {
          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );

          //视角拉近
          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeToPersonView();

          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeCameraToFar();
          // this.viewFarIndex = 2;
        }
      }
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
      
    },
    ClickModel(hitObject) {
      
    },
    HoverObject(hoverObject, hoverPoint) {
      
    },

    ClickHotPointOwner(hitObject) {
      let hotPointData = hitObject.owner.GetHotPointData();
      // console.log(" hotpointdata  ", hotPointData);
      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {
          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );

          //视角拉近
          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeToPersonView();

          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeCameraToFar();
          this.viewFarIndex = 2;
        }
      }
    },

    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewById(id);
    },

    ChangeViewFar() {
      this.viewFarIndex++;
      if (this.viewFarIndex >= this.viewFar.length) {
        this.viewFarIndex = 0;
      }
      let far = this.viewFar[this.viewFarIndex];
      // this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeCameraFar();
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(
        far
      );
    },

    GetPublicUrl() {
      return this.publicUrl;
    },
    GetSceneTexPath() {
      if(this.isMobile){
        if(this.avatarData.sceneTexPath_m != undefined){
          return this.GetModelUrl() + this.avatarData.sceneTexPath_m;
        }else{
          return this.GetModelUrl() + this.avatarData.sceneTexPath;
        }
      }else{
        return this.GetModelUrl() + this.avatarData.sceneTexPath;
      }
    },
    GetModelUrl() {
      return this.avatarData.modelPath;
    },
    GetPublicModelUrl() {
      return this.GetPublicUrl() + this.avatarData.modelPath;
    },

    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.avatarData.minMapData;
      return minMapData;
    },
    OpenThreejs() {
      this.inThreejs = true;
      this.$refs.YJmetaBase.OpenThreejs();

      // setTimeout(() => {
      //   this.ChangeViewById(10004);
      // }, 2000);
    },
    ClickNiaokan() {
      if (this.avatarData.setting.inMinMapEditor) {
        return;
      }
      // return;
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ResetToNiaokanView();
    },

    // //#region 用户音视频通话
    // //用websocket 连接id 作为腾讯云音视频sdk的连接id
    // InitTRTC(userId) {
    //   console.log("开启音视频，使用id = > 333 " + userId);

    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   //初始化sdk客户端
    //   this.$refs.txTRTC.Init(userId);
    // },
    // SetUserVideo(video) {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.CreateVideo(video);
    // },
    // SetUserAudio(audio) {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.CreateAudio(audio);
    // },
    // //接收到其他用户的音视频id
    // SetRemoteTRTCid(useId, id, video, audio) {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   //把音视频id添加到用户信息中
    //   this.$refs.YJDync.UpdatePlayerTRTC(useId, id, video, audio);
    // },
    // //当前客户端关闭音视频
    // CloseTRTC() {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   this.$refs.YJDync._YJDyncManager.CloseTRTC();
    // },
    // //客户端掉线时，关闭音视频
    // CallCloseTRTC() {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   this.$refs.txTRTC.leaveRoom();
    // },
    // //#endregion
  },
};
</script>

<style scoped>
.scaleImg{
transform:scale(0.3) translateY(280px)
}
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

/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

#iframeA {
  /* position: absolute; */
  transform: scale(0.5, 0.5) translate(-50%, -50%);
  width: 200%;
  height: 200%;
  /* top: 0;
  left: 0; */
  /* background: rgba(29, 29, 31, 0.72);
backdrop-filter: saturate(180%) blur(20px); */
}

/* 阻止长按复制 */
.stop-long-hover {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.max-w-1200 {
  max-width: 1200px;
}
</style>
