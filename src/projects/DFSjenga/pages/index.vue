
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />


  <div class=" absolute left-2 top-2 text-white ">
    得分：{{ layerCount }}
  </div>

  <div v-if="inTimes" class=" absolute right-2 top-2 text-white ">
    剩余机会：{{ currentCount }}
  </div>

  <div v-if="!gameover" class=" absolute w-full h-20 bottom-10 ">
    <div class=" w-20 h-20 rounded-full flex mx-auto bg-gray-400 bg-opacity-70 shadow-lg " @click="PicDown()">
      <div class=" self-center mx-auto text-white text-2xl">放</div>
    </div>
  </div>


  <div v-if="gameover" class=" absolute left-0 top-0 w-full h-full flex flex-col  ">
    <div class=" mt-40  self-center mx-auto  text-white ">

      <div>两种模式：</div>
      <div>模式一、落下不能立住即结束；</div>
      <div>模式二、剩余机会使用完即结束；</div>
    </div>

    <div class="  self-center mx-auto w-auto h-20 flex bg-gray-600 rounded-md px-4 " @click="ChangeMode()">
      <div class=" self-center mx-auto text-white text-2xl">切换模式</div>
    </div>
  </div>
  <div v-if="gameover" class="  absolute w-full h-20 bottom-10 flex  ">
    <div class="  self-center mx-auto w-auto h-20 flex bg-gray-600 rounded-md px-4 " @click="Restart()">
      <div class=" self-center mx-auto text-white text-2xl">重新开始</div>
    </div>
  </div>

  <interfaceCtrlTest ref="interfaceCtrlTest" />

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
    _YJGlobal.UseAmmoPhysics = false;
    document.title = this.avatarData.setting.title;
    this.currentCount = this.boxCount;

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
