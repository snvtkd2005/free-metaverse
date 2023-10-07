
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <div :class="this.avatarData.setting.onlyLandscape ? 'main' : ''">
    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

    <div class="hidden absolute top-0 left-0 cutimg overflow-hidden">
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

    <div v-if="avatarData.setting.has2dMinMap" v-show="displayMinMap" class="
        absolute
        left-1/2
        bottom-0
        w-96
        h-48
        transform
        -translate-x-48
        scale-75
      " @click="ClickNiaokan()">
      <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
    </div>

    <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
    <div>
      <JoystickLeftPanel class="" ref="JoystickLeftPanel" />
    </div>

    <!-- <div v-if="isMobile && contrlState == 0">
      <JoystickLeftPanel class="" ref="JoystickLeftPanel" />
    </div> -->

    <!-- <div v-show="displayMinMap" class=" absolute flex right-5 bottom-5 w-auto h-10 rounded-full shadow-md bg-gray-100 cursor-pointer "
    @click="ChangeViewFar">
    <div class=" px-2 self-center mx-auto">
      ViewFar
                                                                </div>
                                                              </div> -->

    <!-- 鸟瞰2d点位 -->
    <div v-if="niaokanUI" class="absolute left-0 top-0 z-10 w-full h-full pointer-events-none">
      <div>
        <div v-for="(item, i) in projectionList" :key="i" :index="item.id" class="text-xl flex pointer-events-auto"
          :style="' position:absolute; left:' +
            (item.pos.x - 48) +
            'px;top:' +
            (item.pos.y - 12) +
            'px'
            ">
          <!-- :style="' position:absolute; left:'+item.pos.x+'px;top:'+i*100+'px'" -->
          <div class="
              w-32
              h-14
              bg-gray-800 bg-opacity-80
              rounded-xl
              flex
              text-white
            ">
            <div class="self-center mx-auto">
              {{ item.content + " " }}
              <!-- {{ item.id+' ' + item.pos.x + " " + item.pos.y }} -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 多人同步 -->
    <YJDync v-if="inLoadCompleted" class="absolute z-50 left-0 top-0" :hasTRTC="this.hasTRTC" ref="YJDync" />

    <!-- 游戏进入页的角色选择面板 -->
    <!-- <playerSelectPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" /> -->
    <!-- <playerSelectSkinPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" /> -->
    <!-- <playerSelectAndSkinPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" /> -->

    <!-- 拍照合影 -->
    <!-- <photoPanel  class="absolute z-50 left-0 top-0" ref="photoPanel" /> -->

    <!-- 皮肤切换面板 -->
    <!-- <playerAvatarPanel :openModelPanel="openModelPanel" ref="playerAvatarPanel" /> -->
    <!-- 场景切换面板 -->

    <scenePanel :openModelPanel="openModelPanel" ref="scenePanel" />

    <!-- <logPanel ref="logPanel" /> -->

    <interfaceCtrlTest ref="interfaceCtrlTest" />

    <!-- 播视频 -->
    <div class="">
      <div v-for="(item, i) in videoList" :key="i" class="">
        <playVideo :ref="'playVideo' + item.videoId" :videoId="item.videoId" />
      </div>
    </div>

    <!-- <div class=" hidden">
      <div v-for="(item, i) in videoList" :key="i" class="">
        <video :src="item.src"></video>
      </div>
    </div> -->

    <!-- 播直播流 -->
    <!-- <playVideo ref="playVideoM3u8" videoId="dPlayerVideoMain" /> -->
    <!-- <playVideo ref="playVideoM3u8" videoId="dPlayerVideoMain_IOS" /> -->
    <playVideo ref="playVideoM3u8" videoId="dPlayerVideoMainHLS" />
    <!-- <playVideoHLS ref="playVideoM3u8" videoId="dPlayerVideoMainHLS" /> -->
  </div>

  <!-- <playVideo ref="playVideo" video_url="https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/%E5%9B%BD%E5%86%85%E7%94%B5%E8%A7%86%E5%8F%B02022-11.m3u8" type="m3u8" /> -->
  <!-- <playVideo ref="playVideo" video_url="https://live-player.peopledailyhealth.com/appname/202303031400.m3u8" type="m3u8" /> -->
  <!-- <playVideo ref="playVideo" video_url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" type="m3u8" /> -->

  <canvas v-show="1 == 0" id="id-wall-canvas"></canvas>

  <!-- npc音效 -->
  <!-- <div v-if="npcMusicUrl != ''">
    <audio :src="npcMusicUrl" ref="npcMusic"></audio>
  </div> -->
</template>

<script>
import YJDync from "./YJDync.vue";
// import YJDync from "/@/threejs/YJDync.vue";
// import modelBagList from "/@/views/chat/modelBagList.vue";

import playerAvatarPanel from "/@/views/chat/playerAvatarPanel.vue";
import scenePanel from "./scenePanel.vue";
// import modelPanel from "./modelPanel.vue";

import playVideo from "./playVideo.vue";
import playVideoHLS from "./playVideoHLS.vue";

import playerSelectPanel from "./playerSelectPanel.vue";
// import playerSelectSkinPanel from "./playerSelectSkinPanel.vue";
// import playerSelectAndSkinPanel from "./playerSelectAndSkinPanel.vue";

import minMapEditor from "/@/views/chat/minMapEditor.vue";
import map2d from "/@/views/chat/map2d.vue";

// 摇杆
import JoystickLeftPanel from "./joystickLeft.vue";
import JoystickRightPanel from "./joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

import PlayerAnimData from "../data/playerAnimSettingGltf.js";
import AvatarData from "../data/sceneSetting_meeting.js";
// import AvatarData from "../data/sceneSetting_login.js";

//角色动作数据
// import PlayerAnimData from "../data/playerAnimSettingGltf_music.js";
// import PlayerAnimData from "../data/playerAnimSettingNewTEST.js";
// import PlayerAnimData from "../data/playerAnimSettingNewTEST2.js";

// import AvatarData from "../data/sceneSetting_music.js";

// import PlayerAnimData from "../data/playerAnimSetting.js";
// import PlayerAnimData from "../data/playerAnimSkinSetting.js";

import Language from "/@/data/zh_cn.js";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

import { deepClone } from "/@/utils/deepclone.js";

import { SceneManager } from "../js/SceneManager.js";
import { SceneManager_MaterialSetting } from "../../../threeJS/SceneManager/SceneManager_MaterialSetting.js";

import { YJGameManager } from "../js/YJGameManager.js";

// 拍照
import photoPanel from "./photo.vue";

import { Interface } from "../js/Interface.js";

import logPanel from "./log.vue";
// import interfaceCtrlTest from "./interfaceCtrlTest.vue";
import interfaceCtrlTest from "./interfaceCtrlTest2.vue";
// import interfaceCtrlTest from "./interfaceCtrlTest3.vue";

import { CheckUserInvaild } from "../js/loginApi";

export default {
  name: "index",
  components: {
    // ThreejsHumanChat,
    minMapEditor,
    loadingPanel,
    JoystickLeftPanel,
    JoystickRightPanel,
    map2d,
    YJDync,
    interfaceCtrlTest,
    // modelBagList,
    playerAvatarPanel,
    scenePanel,
    // modelPanel,
    YJmetaBase,
    playerSelectPanel,
    // playerSelectSkinPanel,
    // playerSelectAndSkinPanel,
    photoPanel,
    playVideo,
    playVideoHLS,
    logPanel,
  },
  data() {
    return {
      viewFar: 5,

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
      // playerAnimData: null,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,

      viewFarIndex: 2,
      // viewFar: [0, -8, -16],

      displayMinMap: true,

      niaokanUI: true,
      projectionList: [
        { id: "signLabel001", content: "岛2", pos: { x: -500, y: -500 } },
        { id: "musiclabel001", content: "岛2", pos: { x: -500, y: -500 } },
        // { id: "10002", content: "岛3", pos: { x: -500, y: -500 } },
        // { id: "10003", content: "岛4", pos: { x: -500, y: -500 } },
        // { id: "10004", content: "岛5", pos: { x: -500, y: -500 } },
        // { id: "10005", content: "岛1", pos: { x: -500, y: -500 } },
      ],

      usernamePrefix: [
        "清澈的", 
      ],

      usernamesuffix: [
        "流水", 
      ],
      openModelPanel: "",

      publicUrl: "",

      userData: {},
      initCompleted: false,
      Interface: null,

      avatarName: "",

      InDriving: false,

      videoList: [],

      checkInvaild: true,
      // checkInvaild: false,

      // arcId: "AGBceHZifbTkmVvnNkgXnqPqnEDzWx", // 会议厅活动id
      // arcId: "ACTDfnsqtpETMmSsvFBTkGdJbpWxru", /// 演唱会活动id
      arcId: "ACTnWOnBSBeErkVjQikxwwZZNWylvH", /// 测试
      
      clickPlayVideo :false,
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
    if (_Global.reloadTimes == 1) {
      window.location.reload();
      _Global.reloadTimes = 0;
    }

    this.Interface = new Interface(this,1);

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
      // if (localStorage.getItem("userName")) {
      //   this.userName = localStorage.getItem("userName");
      // }

      // console.log("_Global.selectPlayerName = ", avatarName);

      // this.ClickSelectPlayerOK(avatarName, this.userName);
    } else {
      //跳过角色选择，直接加载场景
      let q = Math.floor(Math.random() * 10);
      let h = Math.floor(Math.random() * 10);
      let t = Math.floor(Math.random() * 10000);
      this.userName = this.usernamePrefix[q] + this.usernamesuffix[h] + t;
      if (this.$route.params.userName != undefined) {
        this.userName = this.$route.params.userName;
        // console.log("获取用户名 " +  this.userName);
        // sessionStorage.setItem("userName", this.userName);
        this.userName = "元宇宙用户" + t + "_" + this.$route.params.userName;
      } else {
        this.userName = "元宇宙用户" + t;
      }

      this.userName = "元宇宙用户265_1111";

      if (
        this.$route.params.phone != undefined &&
        this.$route.params.nickName != undefined
      ) {
        _Global.userInfo = {
          phoneNumber: this.$route.params.phone,
          userId: this.$route.params.userId,
          nickName: this.$route.params.nickName,
          sessionId: "S1000af2be65d14ae5a8a8febfe31b6bc5733x",
        };

        this.CheckUserInvaildFn(_Global.userInfo.phoneNumber);

        // let userInfo = {
        //   phoneNumber: this.$route.params.phone,
        //   userId: this.$route.params.userId,
        //   nickName: this.$route.params.nickName,
        //   sessionld: "S1000af2be65d14ae5a8a8febfe31b6bc5733x",
        // };
        // console.error(" 在本地全路由 ", userInfo);
        // localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.userName = this.$route.params.nickName;
        // console.log("获取用户名 " + this.userName);
      } else {
        let userInfo2 = localStorage.getItem("userInfo");
        if (userInfo2 != undefined) {
          let userInfo = JSON.parse(userInfo2);
          this.userName = userInfo.nickName;
          this.CheckUserInvaildFn(userInfo.phoneNumber);
          // console.log("获取 userInfo ", userInfo);
        }
      }

      this.ClickSelectPlayerOK(avatarName, this.userName);
    }

    _Global.arcId = this.arcId;

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    window.onChangeViewById += this.ChangeViewById;

    // localStorage.removeItem("playerState");
    if (!localStorage.getItem("playerState")) {
      // localStorage.setItem("playerState", "1_0_0_0_0");
      localStorage.setItem("playerState", "0_0_0_0_0");
    } else {
      let sp = localStorage.getItem("playerState").split("_");
      console.log(sp.length);
      if (sp.length != 5 ) {
        localStorage.setItem("playerState", "0_0_0_0_0");
      }
    }

  },
  methods: {
    ChangeRouter() {
      _Global.reloadTimes = 1;
      this.$router.push({
        path: "/multiMeeting/YJ/元宇宙用户265_2222/18616285155",
      });
    },
    CheckUserInvaildFn(PhoneNum) {
      this.checkInvaild = true;
      return;

      if (this.arcId == "ACTDfnsqtpETMmSsvFBTkGdJbpWxru") {
        this.checkInvaild = true;
        return;
      }
      let data2 = {
        MeetingID: this.arcId,
        PhoneNum: PhoneNum,
      };
      CheckUserInvaild(data2).then((res) => {
        if (res.status == 200) {
          if (res.data.code == 1) {
            let data = JSON.parse(res.data.data);
            this.checkInvaild = data.Result;
            console.log(" 获取 用户权限 ", data.Result);
          }
        }
      });
    },
    viewFarFn(e) {
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(
        -this.viewFar
      );
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
      _YJPlayer.NeedChangeSkin();

      console.error(" 同步换装数据 22 ", playerName, playerState);
      if (playerName == "YJtest") {
        if (playerState == null || playerState == undefined) {
          playerState = "0_4_10_";
        }
      } else if (playerName == "litleUnityChain2") {
        if (playerState == null || playerState == undefined) {
          playerState = "1_2_";
        }
      } else {
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
 
        if (
          element.title == "hair" 
        || element.title == "coat" 
        || element.title == "pantsuit"
        || element.title == "shoes"
        || element.title == "head"
        ) {
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
      }, 2000);
    },
    // 实时切换皮肤
    ChangeSkin(_YJPlayer, playerName, playerState) {

      console.error(" 同步换装数据 ", playerName, playerState);

      if (playerName == null) {
        playerName = "YJtest";
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

      let part = playerState.part;
      let num = playerState.num;

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == part) {
          skinData[i].selected = num;
        }
      }
      let targetPath = "";

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == part) {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, "");
        } 
      }
      setTimeout(() => {
        _YJPlayer.ChangeSkinCompleted();
      }, 2000);
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

      this._YJGameManager = new YJGameManager(
        this.$refs.YJmetaBase.ThreejsHumanChat,
        this
      );
      this._YJGameManager.AddChangeTargetListener((b) => {
        if (this.$refs.gameUI) {
          this.$refs.gameUI.SetTargetVaild(b);
        }
      });

      console.log(" 角色选择完成或跳过角色选择------------");

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
    SetTriggerOverlap(b, id, name, owner) {
      if (!this.initCompleted) {
        return;
      }

      this.Interface.SetTriggerOverlap(b, id, name);

      this._YJGameManager.SetTriggerOverlap(b, id, owner);
      if (b) {
        if (id == "portal_001") {
          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(
            "playerPos_001"
          );
        }
        if (id == "portal_002") {
          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(
            "playerPos_002"
          );
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
    PlayBGAudio(){
      if (!this.initCompleted){
        return;
      }
      this.$refs.playVideoM3u8.Play();

      // if(this.clickPlayVideo){
      //   return;
      // }
      // this._SceneManager.CallRequestSceneData();
      // this.clickPlayVideo = true;
    },
    load3dComplete(callback) {
      console.log("场景加载完成------------");

      if (!this.checkInvaild) {
        return;
      }

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
        if (this._SceneManager != null) {
          this._SceneManager.ChangeScene(this.avatarData);
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
      // console.log(" ========= in UpdateProjectionUI ============");
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
      this._YJGameManager.ClickPlayer(owner);

      console.log(owner);
      //点击npc,显示与npc的聊天框
      if (this.$refs.chatPanel && owner.GetName() == "ChatGPT001号") {
        this.$refs.chatPanel.SetDisplay(true);
      }
      if (
        this.$refs.chatPanelNPC &&
        (owner.GetName() == "咕叽" || owner.GetName() == "坐")
      ) {
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

    ClickHotPointOwner(hitObject) {
      this.Interface.LoadData(modelData.id);

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

      if (this.$refs.JoystickLeftPanel) {
        this.$refs.JoystickLeftPanel.UpdateJS();
      }
      // setTimeout(() => {
      //   this.ChangeViewById(10004);
      // }, 2000);
    },
    ClickNiaokan() {
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
