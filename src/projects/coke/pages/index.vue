
// 在线聊天室 聊天界面 3d形象 聊天

<template>
  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

  <div class=" hidden absolute top-0 left-0 cutimg overflow-hidden">
    <canvas id="nowcanvas" class="bg-white"> </canvas>
  </div>
  <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
  <div v-if="isMobile && contrlState == 0">
    <JoystickLeftPanel class="  " ref="JoystickLeftPanel" />
  </div>

  <!-- 加载loading -->
  <loadingPanel class="absolute z-40 left-0 top-0 pointer-events-none opacity-1" ref="loadingPanel" />

  <!-- 唱片滑动区域   v-if="inDragRecordParent" -->
  <div ref="dragArea" class=" w-full h-1/3 absolute bottom-0 left-0 bg-black "
    :class="inDragRecordParent ? ' pointer-events-auto bg-opacity-0 ' : ' pointer-events-none bg-opacity-0 '">
  </div>


  <div ref="back" v-if="inNeedBack" class=" absolute top-2 right-2 text-white text-xl " @click="backFn()">
    返回
  </div>

  <audio :src="GetPublicUrl() + 'audios/Muffled_RecordStore_Loop.mp3'" autoplay='autoplay' loop ref="bgMusic"></audio>
  <audio :src="GetPublicUrl() + 'audios/Loop_RecordStore_Ambiance.mp3'" autoplay='autoplay' loop ref="bgMusic2"></audio>

  <div class=" absolute left-0 top-0 z-auto hidden ">
    <video ref="txtmp4" class=" bg-black w-64 h-64 " :src="GetPublicUrl() + 'videos/camilo.mp4.txt'" autoplay='autoplay'
      muted></video>
  </div>

  <!-- <gyroRequest ref="gyroRequest" /> -->

  <div class=" absolute top-12 right-2 h-20 w-auto self-center mx-auto  text-gray-800" @click="RequestGyro">
    <div class=" inline-block bg-white rounded-lg shadow-md p-2 ">{{ gyroTip }}</div>
  </div>
  
  <!-- <logPanel ref="logPanel" /> -->
</template>

<script>


import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

import logPanel from "/@/views/chat/log.vue";
// 摇杆 
import JoystickLeftPanel from "./joystickLeft.vue";
// 加载进度页
import loadingPanel from "./loadingPanel.vue";


import gyroRequest from "./gyroRequest.vue";

// 配置文件
import AvatarData from "../data/sceneSetting.js";
// import AvatarData from "/@/projects/farm/data/sceneSetting.js";
import PlayerAnimData from "/@/projects/farm/data/playerAnimSkinSetting.js";

import { SceneManager } from "../js/SceneManager.js";
import { Interface } from "../js/Interface.js";
import { YJGyroRequest } from "../js/YJGyroRequest.js";

export default {
  name: "index",
  components: {
    loadingPanel,
    YJmetaBase,
    JoystickLeftPanel,
    gyroRequest,
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


      // 广告视频
      videoSrc: "coffee",
      jumpId: '',
      sending: false,
      inMusic: false,
      cameraRotaY: 0,

      inGyro: false,

      inBgMusic: true,
      inLiuxingGif: false,
      inCoffeeGif: false,

      coffeeGifUrlNum: 0,
      coffeeGifUrl: "coffee.gif?test",
      liuxingGifUrl: "liuxing.gif?test",

      publicUrl: "",
      isMobile: true,
      contrlState: 0,
      Interface: null,
      playNum: 0,

      gyroTip: "点击授权陀螺仪",
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

    document.title = "COKE";

    this.Interface = new Interface(this);

    if (this.$refs.YJmetaBase) {

      // 进度条发送到三维页
      this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

      this.$refs.YJmetaBase.ClickeSelectOK();
    }
    this.YJGyroRequest = null;

    // this.LoadAssset(this.GetPublicUrl()+'videos/camilo.mp4.txt',(data)=>{
    //   this.$refs.txtmp4.src = data;
    //   this.$refs.txtmp4.play();
    // });

    let that = this;

    document.addEventListener("visibilitychange", function () {
      console.log(document.hidden);

      if (document.hidden) {
        if (that.inMusic) {
          that.$refs.birdMusic.pause();
        }

        if (that.inBgMusic) {
          that.$refs.bgMusic.pause();
        }

        that.inCoffeeGif = false;
        that.inLiuxingGif = false;
      } else {
        if (that.inMusic) {
          that.$refs.birdMusic.play();
        }

        if (that.inJumpVideo_liuxing) {
          that.$refs.videoSrc_liuxing.play();
        }
        if (that.inJumpVideo) {
          that.$refs.videoSrc.play();
        }

        if (that.inBgMusic) {
          that.$refs.bgMusic.play();
        }

        that.inCoffeeGif = false;
        that.inLiuxingGif = false;
      }

      if (that.inGyro) {
        that.TurnCameraRota(that.jumpId);
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

    RequestGyro() {
      if (this.YJGyroRequest == null || this.YJGyroRequest == undefined) {
        this.YJGyroRequest = new YJGyroRequest(this.$refs.YJmetaBase.ThreejsHumanChat, (canGyro) => {
          if (canGyro) {
            this.gyroTip = "关闭陀螺仪";
          } else {
            this.gyroTip = "未授权陀螺仪";
          }
        });
      } else {
        if (this.gyroTip == "关闭陀螺仪") {
          this.YJGyroRequest.SetEnabled(false);
          this.gyroTip = "开启陀螺仪";
        } else if (this.gyroTip == "开启陀螺仪") {
          this.YJGyroRequest.SetEnabled(true);
          this.gyroTip = "关闭陀螺仪";
        } else {
          this.gyroTip = "请去xx开启陀螺仪授权";
          setTimeout(() => {
            this.gyroTip = "未授权陀螺仪";
          }, 1000);
        }
      }
    },
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
      if (this.inBgMusic) {
        console.log("播放视频");
        this.$refs.bgMusic.play();
      }
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
