
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <div :class="this.avatarData.setting.onlyLandscape ? 'main' : ''">

    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />
    <!-- 加载loading -->
    <loadingPanel class="absolute z-50 left-0 top-0" ref="loadingPanel" />
    <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
    <div v-if="isMobile && contrlState == 0">
      <JoystickLeftPanel class="  " ref="JoystickLeftPanel" />
      <!-- <JoystickRightPanel class=" " ref="JoystickRightPanel" /> -->
    </div>

    <InterfaceCtrlShader class="  " ref="InterfaceCtrlShader" />

  </div>
</template>

<script>


// 摇杆 
import JoystickLeftPanel from "./joystickLeft.vue";
import JoystickRightPanel from "./joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

// farm
import AvatarData from "../data/sceneSetting_test.js";

import PlayerAnimData from "../data/playerAnimSetting.js";
// import PlayerAnimData from "../data/platform/playerAnimSetting.js";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

import { SceneManager } from "../js/SceneManager.js";
import { Interface } from "../js/Interface.js";
import  InterfaceCtrlShader  from "./interfaceCtrlShader.vue";

export default {
  name: "index",
  components: {
    loadingPanel,
    JoystickLeftPanel,
    YJmetaBase,
    InterfaceCtrlShader,
  },
  data() {
    return {
      _SceneManager: null,

      isInsertPanel: false,
      inLoadCompleted: false,
      isMobile: false,

      avatarData: null,
      // playerAnimData: null,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,


      publicUrl: "",

      initCompleted: false,

      avatarName: "./public/",
      Interface: null,
    };
  },

  created() {
    this.avatarData = AvatarData;

    this.publicUrl = "./public/" + this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {

    this.Interface = new Interface(this);

    // let avatarName = this.$refs.playerSelectPanel.avatarData.defaultUser.avatarName;
    let avatarName = PlayerAnimData.defaultUser.avatarName;
    this.userName = "aaa";

    // if (localStorage.getItem("avatarName")) {
    //   avatarName = localStorage.getItem("avatarName");
    // }
    if (localStorage.getItem("userName")) {
      this.userName = localStorage.getItem("userName");
    } 

    setTimeout(() => {
      this.ClickSelectPlayerOK(avatarName, this.userName);
    }, 2000);

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    window.onChangeViewById += this.ChangeViewById;

  },
  methods: {

    GetPlayerAnimData() {
      return PlayerAnimData;
    },
    GetAvatarData(playerName) {
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      console.error(" 角色信息未找到 ", playerName);
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

    },


    ChangeAvatar(playerName, callback) {
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
      this.Interface.SetTriggerOverlap(b, id, name);
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



      } else {

      }
      this.initCompleted = true;
      this.Interface.load3dComplete();
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
    OpenThreejs() {
      this.inThreejs = true;
      this.$refs.YJmetaBase.OpenThreejs();
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
