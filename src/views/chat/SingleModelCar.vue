 

<template >
  <div
    tabindex="-1"
    class="absolute left-0 top-0   w-full h-full"
    ref="YJ3dscene"
    id="YJ3dscene"
  ></div>
</template>

<script>
import { nextTick } from "@vue/runtime-core";
// import { PostNewsAPI } from "/@/utils/api.js";

// import YJimageItem from "/@/components/YJ-imageItemM.vue";
import { YJSingleModel3dScene } from "../../threeJS/YJSingleModel3dScene.js";
import * as THREE from "three";

// 创建一个时钟对象Clock
var clock = new THREE.Clock();
const FPS = 30; // 指的是 30帧每秒的情况
const singleFrameTime = 1 / FPS;
let timeStamp = 0;
export default {
  props: [],
  components: {
    // YJimageItem,
    YJSingleModel3dScene,
  },
  data() {
    return {};
  },
  //初始化函数
  mounted() {
    this._YJ3dScene = null;
    this.Init();
  },
  methods: {
    Init() {
      if (this._YJ3dScene != null) {
        this.renderScene();
        return;
      }
      this._YJ3dScene = new YJSingleModel3dScene(this.$refs.YJ3dscene, this);
      // this._YJ3dScene.CreateTestBox();
      this.renderScene();
    },  

    //实时刷新
    renderScene() {
      const delta = clock.getDelta(); //获取自上次调用的时间差
      timeStamp += delta;
      //限制帧率在30帧
      if (timeStamp > singleFrameTime) {
        this._YJ3dScene.update();
        // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
        timeStamp = timeStamp % singleFrameTime;
      }
      requestAnimationFrame(this.renderScene);
    },
  },
};
</script>

<style scoped>
</style> 