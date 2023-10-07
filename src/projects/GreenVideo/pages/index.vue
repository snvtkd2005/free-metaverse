
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <div class=" absolute left-0 top-0 bg-green-200 w-full h-full flex ">
    <div class=" w-full h-full">
      <img class=" w-full h-full" :src="publicUrl + 'images/20230530-170121.jpg'" alt="">
    </div>

  </div>
  <div class=" absolute left-0 top-0 w-full h-full flex ">
    <div ref="container" class="  w-full h-full   self-center mx-auto ">
      <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />
    </div>
  </div>

  <!-- 遮罩，点击弹出授权 -->
  <div  class=" absolute z-50 left-0 top-0 w-full h-full flex   " @click="PlayVideoVoice">
    <!-- <div class=" self-center mx-auto  w-32 h-32 flex ">
      <img class=" handAnimFn  w-10 h-8  " :src="$publicUrl + 'hand.png'" alt="">
    </div> -->
  </div>

  <!-- 加载loading -->
  <loadingPanel class="absolute z-40 left-0 top-0 pointer-events-none opacity-0" ref="loadingPanel" />
</template>

<script>


import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";

// 配置文件
import AvatarData from "../data/sceneSetting.js";

import { SceneManager } from "../js/SceneManager.js";
import { Interface } from "../js/Interface.js";

import interfaceCtrlTest from "./interfaceCtrlTest.vue";
export default {
  name: "index",
  components: {
    loadingPanel,
    YJmetaBase,
    interfaceCtrlTest,
  },
  data() {
    return {
      _SceneManager: null,
      inLoading: true,

      publicUrl: "",
      isMobile: true,
      contrlState: 0,
      avatarData: null,
      layerCount: 0,
      boxCount: 20,
      currentCount: 0,
      gameover: false,
      Interface: null,
      inTimes: false,
    };
  },

  created() {
    this.avatarData = AvatarData;

    this.publicUrl = this.$publicUrl + this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);

  },
  mounted() {

    this.Interface = new Interface(this);
    document.title = this.avatarData.setting.title;

    // return;

    if (this.$refs.YJmetaBase) {

      // 进度条发送到三维页
      this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

      this.$refs.YJmetaBase.ClickeSelectOK();

    }


  },
  methods: {
    ChangeMode() {
      this.inTimes = !this.inTimes;

    },
    Failed() {
      this.gameover = true;
      _Global.Failed();

    },
    Restart() {
      this.gameover = false;
      this.layerCount = 0;
      this.currentCount = this.boxCount;

      this._SceneManager.Restart();
    },
    PicDown() {
      if (this.currentCount <= 0) {
        return;
      }
      this._SceneManager.PicDown(() => {
        if (this.inTimes) {
          this.currentCount--;
          if (this.currentCount <= 0) {
            this.gameover = true;
            return;
          }
        }
      });
    },
    GetAvatarData(playerName) {

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
    
    PlayVideoVoice() {
      console.log("点击播放声音 ");
      this.$refs.YJmetaBase.ThreejsHumanChat.PlayVideoVoiceById(
        'video_yan_lr',
        true
      );
    },

    PlayBGAudio() { 
    },
    OpenThreejs() {
      // console.error("in OpenThreejs 111111");
      this.inThreejs = true;
      this.$refs.YJmetaBase.OpenThreejs();
    },
    // 如果3d加载好了能点击跳转时候 执行一下
    load3dComplete() {

      console.log("3d加载好了的回调");


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

      this.Interface.load3dComplete();
      this._SceneManager.ChangeScene(this.avatarData);


      setTimeout(() => {
        this.$refs.YJmetaBase.ThreejsHumanChat.PlayVideo();

        this.$refs.YJmetaBase.ThreejsHumanChat.AddVideoListener();
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          'video_yan_lr',
          true
        );

      }, 1000);
    },
    ClickModel(hitObject) {
      return;
    },
    CreateHotContent(modelData) {
      return;
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
