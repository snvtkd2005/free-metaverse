
// 在线聊天室 聊天界面 3d形象 聊天

<template>
  <div class=" main ">

    <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

    <div class=" hidden absolute top-0 left-0 cutimg overflow-hidden">
      <canvas id="nowcanvas" class="bg-white"> </canvas>
    </div>


    <!-- 加载loading -->
    <loadingPanel ref="loadingPanel" />
    <!-- <logPanel ref="logPanel" /> -->

    <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
    <div v-if="isMobile && contrlState == 0">
      <JoystickLeftPanel class="  " ref="JoystickLeftPanel" />
    </div>
  </div>
</template>

<script>


import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

import logPanel from "/@/views/chat/log.vue";
// 摇杆 
import JoystickLeftPanel from "./joystickLeft.vue";
// 加载进度页
import loadingPanel from "./loadingPanel.vue";

// 配置文件
import AvatarData from "../data/sceneSetting.js";
import PlayerAnimData from "../data/playerAnimSkinSetting.js";

import { SceneManager } from "../js/SceneManager.js";
import { Interface } from "../js/Interface.js";

export default {
  name: "index",
  components: {
    loadingPanel,
    YJmetaBase,
    JoystickLeftPanel,
    logPanel,
  },
  data() {
    return {
      inNeedBack: false, //右上角返回开关
      inDragRecordParent: false, //底部唱片盒子滑动开关

      _SceneManager: null,
      inJumpVideo: false,
      inJumpVideo_liuxing: false,
      displayBtn: false,

      mask: false,
      hasRequestDevice: false,
      inLoading: true,
      isInsertPanel: false,
      // 是否显示姓名条
      displayUserNameUI: false,

      // 是否显示摇杆。 右摇杆跟随左摇杆显示隐藏
      displayJoystick: true,
      //是否可交互的提示
      jiaohuTip: false,

      clickHotpointDoonce: 0,
      music: false,
      videoList: [
        // { id: "video_tuzi_lr" },
        // { id: "video_yinfu_lr" },
        // { id: "video_liuxing_lr" },
        // { id: "video_yan_lr" },
        // { id: "video_huo_lr" },
      ],


      sending: false,
      inMusic: false,
      cameraRotaY: 0,


      inBgMusic: true,

      publicUrl: "",
      isMobile: true,
      contrlState: 0,
      Interface: null,
      playNum: 0,

    };
  },

  created() {
    this.avatarData = AvatarData;

    this.publicUrl = this.$publicUrl + this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
    document.addEventListener(
      'WeixinJSBridgeReady',
      () => {
        console.log("微信准备完成000");
        this.PlayVideo();
      },
      false
    );

  },
  mounted() {

    document.title = "DOTA";

    this.Interface = new Interface(this);

    if (this.$refs.YJmetaBase) {

      // 进度条发送到三维页
      this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

      let userName = PlayerAnimData.defaultUser.userName;
      this.userData = {
        userName: userName,
        roomName: this.avatarData.roomName,
        platform: this.avatarData.platform,
        modelType: PlayerAnimData.defaultUser.avatarName,
      }; 

      this.$refs.YJmetaBase.ClickSelectPlayerOK(this.userData);

      // 显示玩家姓名条
      this.$refs.YJmetaBase.ThreejsHumanChat.SetNickName(userName);
    }

    // this.LoadAssset(this.GetPublicUrl()+'videos/camilo.mp4.txt',(data)=>{
    //   this.$refs.txtmp4.src = data;
    //   this.$refs.txtmp4.play();
    // });

    let that = this;

    document.addEventListener("visibilitychange", function () {
      console.log(document.hidden);

      if (document.hidden) {
        
      } else {
        
 
      }

    });

    window.addEventListener("touchstart", function (e) {
      that.PlayVideo();
    });
    window.addEventListener("click", function (e) {
      that.PlayVideo();
    });
  },
  methods: {

    async LoadAssset(path, callback) {
      const res = await this.$axios.get(path);
      if (callback) {
        callback(res.data);
      }
    },



    PlayVideo() {
      this.playNum++;
      if (this.playNum > 3) { return; }
      this.PlayBGAudio();
    },
    PlayBGAudio() {

    },
    backFn() {
      this.inNeedBack = false;
      this._SceneManager.backFn();
    },
    GetAvatarData(playerName) {
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      console.error(" 角色信息未找到 ", playerName);
      return PlayerAnimData.avatarData[0];

    },
    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {

      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(
        id
      );
    },
    LoadingProcess(f) {
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
      // console.error("in OpenThreejs 111111");
      this.inThreejs = true;
      this.$refs.YJmetaBase.OpenThreejs();
    },
    // 如果3d加载好了能点击跳转时候 执行一下
    load3dComplete() {
      console.log("in load3dComplete 22222");
      this.$refs.YJmetaBase.ThreejsHumanChat.AddVideoListener();

      //场景设置
      this._SceneManager = new SceneManager(
        this.$refs.YJmetaBase.ThreejsHumanChat.scene,
        this.$refs.YJmetaBase.ThreejsHumanChat.renderer,
        this.$refs.YJmetaBase.ThreejsHumanChat.camera,
        this.$refs.YJmetaBase.ThreejsHumanChat,
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetmodelParent(),
        this,
        () => {
          // if (callback) {
          //   callback();
          // }

        });

      console.log("3d加载好了的回调");
      this._SceneManager.ChangeScene(this.avatarData);


      if (this.$refs.dragArea) {
        this._SceneManager.InitDragDivArea(this.$refs.dragArea);
      }

      // this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(false);
      // this.$refs.YJmetaBase.removeThreeJSfocus();
      // this._YJControllerRota = new YJControllerRota(this.$refs.YJmetaBase.ThreejsHumanChat.GetThreeDocument(), this);


    },

    HoverObject(hoverObject, hoverPoint) {
      this._SceneManager.HoverObject(hoverObject, hoverPoint);
    },
    ClickModel(hitObject) {
      // console.log(" 点击模型 ", hitObject);
      this._SceneManager.ClickModel(hitObject);
    },
    CreateHotContent(modelData) {

      console.error(" modelData = ", modelData);
      // this.clickHotpointDoonce++;
      this._SceneManager.AddCollect(modelData.id);

      // if (modelData.id == "catBurns"
      //   || modelData.id == "camilo"
      //   || modelData.id == "jid"
      //   || modelData.id == "newJeans"
      //   ) {
      //   this._SceneManager.AddCollect(modelData.id);
      //   return;
      // }

    },

    SetTriggerOverlap(b, id, owner) {
      if (this._SceneManager) {
        this.Interface.SetTriggerOverlap(b, id, owner);
        this._SceneManager.SetTriggerOverlap(b, id, owner);
      }
    },
  },
};
</script>

<style scoped>
/*竖屏*/
@media screen and (orientation: portrait) {
  .main {
    position: absolute;
    z-index: 1;
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


.handAnimFn {
  animation: handAnim 1s infinite alternate linear;
}

.btnInAnimFn {
  animation: btnInAnim 0.5s alternate linear;
}

@keyframes handAnim {
  from {
    margin-top: 20px;
    margin-left: 90px;
  }

  to {
    margin-top: 8px;
    margin-left: 78px;
  }
}

@keyframes btnInAnim {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;

  }
}


.scale-70 {
  --tw-scale-x: .50;
  --tw-scale-y: .50;
}

/* video { 
  height: 100% !important;
  width: 100% !important;
  object-fit: fill;
} */
.videoCamera {

  position: absolute;
  z-index: -10;
  left: 0%;
  top: 0%;
  object-fit: fill;
  vertical-align: middle;
}

.z-60 {
  z-index: 60;
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
