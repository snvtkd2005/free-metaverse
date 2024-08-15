
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <div :class="this.avatarData.setting.onlyLandscape ? 'main' : ''">

    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

    <div class=" hidden absolute top-0 left-0 cutimg overflow-hidden">
      <canvas id="nowcanvas" class="bg-white"> </canvas>
    </div>

  <!-- 视角远近滑块 -->
    <!-- <input ref="viewFarCtrl" class=" absolute  -right-10 bottom-20  outline-none  transform rotate-90" @input="viewFarFn"
          v-model="viewFar" type="range" min="0" max="23" step="1"> -->

    <!-- 加载loading -->
    <loadingPanel class="absolute z-50 left-0 top-0" ref="loadingPanel" />

  <!-- 小地图透明按钮 -->
  <!-- <div v-if="avatarData.setting.hasMinMap" class="absolute z-20 left-0 bottom-8 w-full pointer-events-none">
                                              <div class="mx-auto w-60 h-36 bg-transparent pointer-events-auto" @click="ClickNiaokan()"></div>
                                            </div> -->


    <!-- <minMapEditor v-if="avatarData.setting.inMinMapEditor" /> -->

  <!-- <div v-if="avatarData.setting.has2dMinMap"  class=" absolute left-1/2 bottom-0 w-96 h-48 transform -translate-x-48 scale-75 "  @click="ClickNiaokan()">
                                                <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
                                            </div> -->

    <div v-if="avatarData.setting.has2dMinMap" v-show="displayMinMap"
      class=" absolute left-1/2 bottom-0 w-96 h-48 transform -translate-x-48 scale-75 " @click="ClickNiaokan()">
      <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
    </div>


    <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
    <div v-if="isMobile && contrlState == 0">
      <JoystickLeftPanel class="  " ref="JoystickLeftPanel" />
      <!-- <JoystickRightPanel class=" " ref="JoystickRightPanel" /> -->
    </div>

  <!-- <div v-show="displayMinMap" class=" absolute flex right-5 bottom-5 w-auto h-10 rounded-full shadow-md bg-gray-100 cursor-pointer "
    @click="ChangeViewFar">
    <div class=" px-2 self-center mx-auto">
      ViewFar
                                              </div>
                                            </div> -->


    <!-- 鸟瞰2d点位 -->
    <div v-if="niaokanUI" class="absolute left-0 top-0 z-10 w-full h-full pointer-events-none">
      <div>
        <div v-for="(item, i) in projectionList" :key="i" :index="item.id" class=" text-xl flex" :style="
          ' position:absolute; left:' +
          (item.pos.x - 48) +
          'px;top:' +
          (item.pos.y - 12) +
          'px'
        ">
          <!-- :style="' position:absolute; left:'+item.pos.x+'px;top:'+i*100+'px'" -->
          <div class="
                                                      w-32
                                                      h-14
                                                      bg-gray-800
                                                     bg-opacity-80
                                                      rounded-xl
                                                      flex
                                                      text-white
                                                    ">
            <div class="  self-center
                                                      mx-auto ">
              {{ item.content + ' ' }}
              <!-- {{ item.id+' ' + item.pos.x + " " + item.pos.y }} -->

            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 多人同步 -->
    <YJDync v-if="inLoadCompleted" class="absolute z-50 left-0 top-0 " :hasTRTC="this.hasTRTC" ref="YJDync" />


    <!-- 游戏进入页的角色选择面板 -->
    <!-- <playerSelectPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" /> -->
    <!-- <playerSelectSkinPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" /> -->
    <playerSelectAndSkinPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" />


    <!-- 拍照合影 -->
    <!-- <photoPanel  class="absolute z-50 left-0 top-0" ref="photoPanel" /> -->

    <!-- 角色头像 -->
    <!-- <gameUI v-if="this.hasGameUI" class="absolute z-0 left-0 top-0" ref="gameUI" /> -->

    <!-- 皮肤切换面板 -->
    <!-- <playerAvatarPanel :openModelPanel="openModelPanel" ref="playerAvatarPanel" /> -->
    <!-- 场景切换面板 -->
    <scenePanel :openModelPanel="openModelPanel" ref="scenePanel" />

    <!-- 摆放模型 -->
    <modelPanel v-if="inLoadCompleted" :openModelPanel="openModelPanel" ref="modelPanel" />

    <!-- 会议室 -->
    <div v-if="inMeeting" class="absolute z-60 w-full h-full top-0 left-0 flex pointer-events-none">
      <div class=" w-full flex">

        <div class="
                                            mx-auto
                                            h-8
                                            leading-8
                                            text-xl
                                            bg-blue-300
                                            rounded-md
                                            shadow-md 
                                            w-auto
                                          inline-block
 
                                          ">
          <div class="  px-3  self-center mx-auto   ">
            {{ '当前在 ' + meetingOwner + ' 的会议室' }}
          </div>
          <div class=" absolute right-0 top-0  px-3 
                                            bg-blue-300
                                            rounded-md
                                            shadow-md  self-center mx-auto pointer-events-auto cursor-pointer "
            @click="LeaveMeeting()">
            退出
          </div>
        </div>
      </div>
    </div>


  <!-- chatgpt 对话框 -->
  <!-- <div class=" absolute left-0 top-0 w-1/2 h-2/3 transform translate-x-1/2 translate-y-1/4 pointer-events-none  ">
              <chatPanel ref="chatPanel" />
            </div> -->
    <div class=" absolute left-0 top-0 z-50 w-full h-full pointer-events-none   ">
      <chatPanel ref="chatPanel" />
    </div>
    <div class=" absolute left-0 top-0 w-1/3 h-5/6 transform pointer-events-none  ">
      <chatPanelNPC ref="chatPanelNPC" />
    </div>

    <div class=" absolute left-0 top-0 w-full h-full   pointer-events-none  ">
      <chatRecodePanel ref="chatRecodePanel" />
    </div>


    <!-- <interfaceCtrlTest ref="interfaceCtrlTest" /> -->
    <EditorPanel ref="EditorPanel" />
    
  </div>


  <!-- <playVideo ref="playVideo" video_url="https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/%E5%9B%BD%E5%86%85%E7%94%B5%E8%A7%86%E5%8F%B02022-11.m3u8" type="m3u8" /> -->
  <!-- <playVideo ref="playVideo" video_url="https://live-player.peopledailyhealth.com/appname/202303031400.m3u8" type="m3u8" /> -->
  <!-- <playVideo ref="playVideo" video_url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" type="m3u8" /> -->
  <!-- <playVideo ref="playVideo" video_url="https://play-qukan.cztv.com/live/1681710214471151.m3u8" type="m3u8" /> -->

  <playVideo ref="playVideo" video_url="./public/farm/videos/movieSD.mp4" type="video/mp4" />



<!-- npc音效 -->
<!-- <div v-if="npcMusicUrl != ''">
        <audio :src="npcMusicUrl" ref="npcMusic"></audio>
      </div> -->
</template>

<script>
// 三维页
import chatPanel from "./chatPanelSingle3D.vue";
// import chatPanel from "./chatPanel.vue";
import chatPanelNPC from "./chatPanelNPC.vue";
import chatRecodePanel from "./chatRecodePanel.vue";


import EditorPanel from "./EditorPanel.vue";

import interfaceCtrlTest from "./interfaceCtrlTest.vue";


import YJDync from "./YJDync.vue";
// import YJDync from "/@/threejs/YJDync.vue";
import YJDyncConnectCount from "/@/threejs/YJDyncConnectCount.vue";
// import modelBagList from "/@/views/chat/modelBagList.vue";

import playerAvatarPanel from "/@/views/chat/playerAvatarPanel.vue";
import scenePanel from "./scenePanel.vue";
import modelPanel from "./platform/panels/modelPanel.vue";

// import playVideo from "./playVideo.vue";
import playVideo from "./playVideoHLS.vue";

import playerSelectPanel from "./playerSelectPanel.vue";
import playerSelectSkinPanel from "./playerSelectSkinPanel.vue";
import playerSelectAndSkinPanel from "./playerSelectAndSkinPanel.vue";

import minMapEditor from "/@/views/chat/minMapEditor.vue";
import map2d from "/@/views/chat/map2d.vue";

// 摇杆 
import JoystickLeftPanel from "./joystickLeft.vue";
import JoystickRightPanel from "./joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

// farm
import AvatarData from "../data/sceneSetting.js";
// import AvatarData from "../data/sceneSetting3.js";
// import AvatarData from "../data/sceneSetting4.js";
// import AvatarData from "../data/sceneSetting5.js"; //开车简单场景
// import AvatarData from "../data/sceneSetting_fengchao.js"; //蜂窝建筑场景
// import AvatarData from "../data/sceneSetting_jitan.js"; //蜂窝建筑场景

//角色动作数据
// import PlayerAnimData from "../data/playerAnimSetting.js";
import PlayerAnimData from "../data/playerAnimSkinSetting.js";



import Language from "../data/zh_cn.js";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";


import gameUI from "./gameUI.vue";

import { deepClone } from "/@/utils/deepclone.js";

import { SceneManager } from "../js/SceneManager.js";
import { SceneManager_MaterialSetting } from "../../../threeJS/SceneManager/SceneManager_MaterialSetting.js";

import { YJGameManager } from "../js/YJGameManager.js";

// 拍照
import photoPanel from "./photo.vue";
import { Interface } from "../js/Interface.js";

export default {
  name: "index",
  components: { 
    minMapEditor,
    loadingPanel,
    JoystickLeftPanel,
    JoystickRightPanel,
    map2d,
    YJDync,
    // modelBagList,
    playerAvatarPanel,
    scenePanel, modelPanel,
    YJmetaBase,
    playerSelectPanel,
    playerSelectSkinPanel,
    playerSelectAndSkinPanel,
    photoPanel,
    gameUI,
    playVideo,
    chatPanel,
    chatPanelNPC,
    chatRecodePanel,
    YJDyncConnectCount,
    interfaceCtrlTest,
    EditorPanel,
  },
  data() {
    return {
      viewFar: 5,

      _SceneManager: null,
      // npc音效
      npcMusicUrl: '',

      inMeeting: false,
      meetingOwner: '',
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
        { id: '10001', content: '岛2', pos: { x: -500, y: -500 } },
        { id: '10002', content: '岛3', pos: { x: -500, y: -500 } },
        { id: '10003', content: '岛4', pos: { x: -500, y: -500 } },
        { id: '10004', content: '岛5', pos: { x: -500, y: -500 } },
        { id: '10005', content: '岛1', pos: { x: -500, y: -500 } },
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

      avatarName: "",

      InDriving: false,
      Interface: null,
    };
  },

  created() {
    this.avatarData = AvatarData;

    // this.playerAnimData = PlayerAnimData;

    this.displayMinMap = !this.avatarData.setting.hasAerialView;

    // console.log(Language);
    this.language = Language.languageCN;
    // this.language = Language.languageEN;
    // document.title = this.avatarData.setting.title;

    this.publicUrl = this.$publicUrl + this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {

    // if( _Global.reloadTimes == 1 ) {
    //   window.location.reload();
    //   _Global.reloadTimes = 0;
    // } 
    this.Interface = new Interface(this);

    if (this.$refs.chatPanel) {
      this.$refs.chatPanel.SetDisplay(false);
    }

    // let avatarName = this.$refs.playerSelectPanel.avatarData.defaultUser.avatarName;
    let avatarName = PlayerAnimData.defaultUser.avatarName;

    if (this.$refs.playerSelectPanel && this.hasPlayerSelectPanel) {
      // console.log("获取用户名 " ,  this.$route.params);

      if (this.$route.params.userName != undefined) {
        this.userName = this.$route.params.userName;
        // console.log("获取用户名 " +  this.userName);
        // sessionStorage.setItem("userName", this.userName);
      } else {
        this.userName = "aaa";
      }


      if (localStorage.getItem("avatarName")) {
        avatarName = localStorage.getItem("avatarName");
      }
      if (localStorage.getItem("userName")) {
        this.userName = localStorage.getItem("userName");
      }


      // console.log("_Global.selectPlayerName = ", avatarName);

      // this.ClickSelectPlayerOK(avatarName, this.userName);

    } else {
      //跳过角色选择，直接加载场景
      let q = Math.floor(Math.random() * 10);
      let h = Math.floor(Math.random() * 10);
      let t = Math.floor(Math.random() * 10000);
      this.userName = this.usernamePrefix[q] + this.usernamesuffix[h] + t;
      this.userName = "aaa";
      this.ClickSelectPlayerOK(avatarName, this.userName);
    }



    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    window.onChangeViewById += this.ChangeViewById;



  },
  methods: {

    viewFarFn(e) {
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(-this.viewFar);
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

      // console.error(" 同步换装数据 ",playerName, playerState);
      if (playerName != "litleUnityChain2" || playerState == null || playerState == undefined) {
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
      if (skinData == undefined || skinData.length <= 1) { return; }
      let sp = playerState.split('_');
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

          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
          _YJPlayer.ChangeSkin(targetPath, "Face", element.mode, faceSourcePath);
          _YJPlayer.ChangeSkin(faceAddPath, "Face", "addTexture", faceSourcePath);
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
      }
      setTimeout(() => {
        _YJPlayer.ChangeSkinCompleted();
      }, 500);
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


      if (this._SceneManager != null) {
        this._SceneManager.ChangeScene(this.avatarData);
      }

      if (this.$refs.YJDync) {
        this.$refs.YJDync.LeaveRoom();
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
        this.$refs.gameUI.ChangeAvatar(this.$refs.YJmetaBase.GetAvatarData(playerName), callback);
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
      this.inLoadCompleted = true;
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






      this._YJGameManager = new YJGameManager(this.$refs.YJmetaBase.ThreejsHumanChat, this);
      this._YJGameManager.AddChangeTargetListener((b) => {
        if (this.$refs.gameUI) {
          this.$refs.gameUI.SetTargetVaild(b);
        }
      });



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
      console.log("点击热点 ", modelData, owner);
      if (modelData.id.includes("chair")) {
        //点击热点坐椅子
        this._YJGameManager.SetSittingModel(owner.GetGroup());
        owner.SetPointVisible(false);
      }
    },
    SetTriggerOverlap(b, id, owner) {
      this.Interface.SetTriggerOverlap(b, id, name);

      this._YJGameManager.SetTriggerOverlap(b, id, owner);
      if (b) {
        if (id == "portal_001" || id == "portal_002") {
          if (id == "portal_001") {
            this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect("playerPos_001");
          }
          if (id == "portal_002") {
            this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect("playerPos_002");
          }

          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.UpdateLightPos();
          
          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetTransmit(true);
          this.$refs.YJDync.DirectSendUserData();
          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetTransmit();

        }
      }
      if (id == "car") {
        let userd = false;
        if (b && !this.InDriving) {
          userd = this._SceneManager.SetCar(owner);
        } else {
        }

        if (this.$refs.modelPanel && !userd && !this.InDriving) {
          this.$refs.modelPanel.CallDriving(b);
        }
      }
    },
    InCar() {
      this._SceneManager.InCar();
      this.InDriving = true;
    },
    OutCar() {
      this._SceneManager.OutCar();
      this.InDriving = false;
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


      if (!this.initCompleted) {


        this.$refs.YJmetaBase.ThreejsHumanChat.PlayVideo();
        this.$refs.YJmetaBase.ThreejsHumanChat.AddVideoListener();


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
          this,
          () => {
            if (callback) {
              callback();
            }

          }
        );

        this._SceneManager.ChangeScene(this.avatarData);


        this.$nextTick(() => {
          if (this.$refs.YJDync) {
            if (!this.avatarData.modelPath.includes("Scene3")) {
              this.$refs.YJDync.InitDync(this.userData);
            } else {
              //在开车场景，关闭同步。因为开车非常费流量。2个人1小时30块
              _Global.mainUser = true;
            }
          } else {
            _Global.mainUser = true;
          }
        });

      } else {

        if (this.$refs.YJDync) {
          this.$refs.YJDync.ChangeRoom(this.avatarData.roomName);
        }
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
      this._YJGameManager.ClickPlayer(owner);

      // console.log(owner);
      //点击npc,显示与npc的聊天框
      if (this.$refs.chatPanel && owner.GetName() == "ChatGPT001号") {
        this.$refs.chatPanel.SetDisplay(true);
      }
      if (this.$refs.chatPanelNPC && (owner.GetName() == "咕叽" || owner.GetName() == "坐")) {
        this.$refs.chatPanelNPC.SetYJNPC(owner, this.userName);
        this.$refs.chatPanelNPC.SetDisplay(true);
      }

    },
    ClickModel(hitObject) {
      // console.log(" 点击模型 owner ", hitObject);
      if (this.$refs.modelPanel) {
        this.$refs.modelPanel.SetModel(hitObject.owner);
      }
      this._YJGameManager.ClickModel(hitObject);
    },
    HoverObject(hoverObject, hoverPoint) {
      this._YJGameManager.HoverObject(hoverObject, hoverPoint);
    },

    CreateHotContent(modelData, owner) {
      console.log("点击热点 ", modelData, owner);

      this.Interface.LoadData(modelData.id);
      if (modelData.id.includes("chair")) {
        //点击热点坐椅子
        this._YJGameManager.SetSittingModel(owner.GetGroup());
        owner.SetPointVisible(false);
      }
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
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(far);
    },

    GetPublicUrl() {
      return this.publicUrl;
    },
    GetSceneTexPath() {
      return this.GetModelUrl() + this.avatarData.sceneTexPath;
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
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ResetToNiaokanView();
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


/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

#iframeA {
  /* position: absolute; */
  transform: scale(.5, .5) translate(-50%, -50%);
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
