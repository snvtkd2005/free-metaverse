
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

  <!-- 加载loading -->
  <loadingPanel class="absolute z-50 left-0 top-0" ref="loadingPanel" />
  <div v-if="avatarData.setting.has2dMinMap" v-show="displayMinMap"
    class=" absolute left-1/2 bottom-0 w-96 h-48 transform -translate-x-48 scale-75 " @click="ClickNiaokan()">
    <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
  </div>


  <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
  <div v-if="isMobile && contrlState == 0">
    <JoystickLeftPanel class="  " ref="JoystickLeftPanel" />
    <!-- <JoystickRightPanel class=" " ref="JoystickRightPanel" /> -->
  </div>


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
  <YJDync v-if="inLoadCompleted" ref="YJDync" />


</template>

<script>
// 三维页


import YJDync from "/@/threejs/YJDync.vue";
// import modelBagList from "/@/views/chat/modelBagList.vue";

import playerAvatarPanel from "/@/views/chat/playerAvatarPanel.vue";
import scenePanel from "./scenePanel.vue";

import playerSelectPanel from "./playerSelectPanel.vue";

import minMapEditor from "/@/views/chat/minMapEditor.vue";
import map2d from "/@/views/chat/map2d.vue";

// 摇杆 
import JoystickLeftPanel from "./joystickLeft.vue";
import JoystickRightPanel from "./joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";


import AvatarData from "../data/sceneSetting_ello.js";

// 

import Language from "/@/data/zh_cn.js";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// 音视频
import txTRTC from "/@/views/chat/txTRTC.vue";

import gameUI from "./gameUI.vue";

import { deepClone } from "/@/utils/deepclone.js";

import { SceneManager } from "../../../threeJS/SceneManager/SceneManager_ello.js";
import { SceneManager_MaterialSetting } from "../../../threeJS/SceneManager/SceneManager_MaterialSetting.js";


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
    // modelBagList,
    playerAvatarPanel,
    scenePanel,
    YJmetaBase,
    playerSelectPanel,
    txTRTC,
    gameUI,
  },
  data() {
    return {

      inMeeting: false,
      meetingOwner: '',
      oldSceneName: "",

      // 是否开启音视频
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
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,

      viewFarIndex: 2,
      viewFar: [0, -8, -16],

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
    };
  },

  created() {
    this.avatarData = AvatarData;


    this.displayMinMap = !this.avatarData.setting.hasAerialView;

    // console.log(Language);
    this.language = Language.languageCN;
    // this.language = Language.languageEN;
    document.title = this.avatarData.setting.title;

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
        this.userName = "aaa";
      }
    } else {
      //跳过角色选择，直接加载场景
      let q = Math.floor(Math.random() * 10);
      let h = Math.floor(Math.random() * 10);
      let t = Math.floor(Math.random() * 10000);
      this.userName = this.usernamePrefix[q] + this.usernamesuffix[h] + t;
      this.userName = "aaa";
      this.ClickSelectPlayerOK(this.avatarData.defaultUser.avatarName, this.userName);
    }

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    window.onChangeViewById += this.ChangeViewById;



  },
  methods: {
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
        this.$refs.gameUI.ChangeAvatar(this.$refs.YJmetaBase.GetAvatarData(playerName), callback);
      }
    },
    GetUseId() {
      return this.$refs.YJDync.GetUseId();
    },
    //由角色选择界面传入 角色类型、用户名
    ClickSelectPlayerOK(selectPlayerName, userName) {
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
      // this.$refs.YJmetaBase.ThreejsHumanChat.SetNickName(userName);



      // console.log("场景加载完成------------");
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

    LoadingProcess(f) {
      // 3d加载进度   0-1 
      // console.log(" 加载场景进度 " ,f);

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.LoadingProcess(f);
      }
    },
    load3dComplete(callback) {

      this.hasGameUI = true;
      this.$nextTick(() => {
        if (this.$refs.gameUI) {
          this.$refs.gameUI.SetPlayerName(this.userName);
          this.$refs.gameUI.InitPlayerHeader();
        }
      });

      if (this.$refs.scenePanel) {
        this.$refs.scenePanel.load3dComplete();
      }

      //Ello场景设置
      new SceneManager(
        this.$refs.YJmetaBase.ThreejsHumanChat.scene,
        this.$refs.YJmetaBase.ThreejsHumanChat.renderer,
        this.$refs.YJmetaBase.ThreejsHumanChat.camera,
        this.$refs.YJmetaBase.ThreejsHumanChat, () => {
          if (callback) {
            callback();
          }

          console.log("场景加载完成------------");
          this.$nextTick(() => {
            if (this.$refs.YJDync) {
              this.$refs.YJDync.InitDync(this.userData);
            }
          });
        }
      );

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
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(far);
    },
    GetPublicUrl() {
      return this.publicUrl;
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

    //#region 用户音视频通话
    //用websocket 连接id 作为腾讯云音视频sdk的连接id
    InitTRTC(userId) {
      console.log("开启音视频，使用id = > 333 " + userId);

      if (!this.hasTRTC) {
        return;
      }
      //初始化sdk客户端
      this.$refs.txTRTC.Init(userId);
    },
    SetUserVideo(video) {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.CreateVideo(video);
    },
    SetUserAudio(audio) {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.CreateAudio(audio);
    },
    //接收到其他用户的音视频id
    SetRemoteTRTCid(useId, id, video, audio) {
      if (!this.hasTRTC) {
        return;
      }
      //把音视频id添加到用户信息中
      this.$refs.YJDync.UpdatePlayerTRTC(useId, id, video, audio);
    },
    //当前客户端关闭音视频
    CloseTRTC() {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.YJDync._YJDyncManager.CloseTRTC();
    },
    //客户端掉线时，关闭音视频
    CallCloseTRTC() {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.txTRTC.leaveRoom();
    },
    //#endregion


  },
};
</script>

<style scoped>
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
