<template>
  <div
    id="contain"
    class=" absolute  left-0 top-0 w-full h-full bg-gray-700"
    ref="YJ3dscene"
  ></div>
 
</template>


 
<script >

// import { YJSingleModel3dScene } from "/@/threeJS/YJSingleModel3dScene.js";
import { YJSingleModelScene } from "/@/threeJS/YJSingleModelScene.js";
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';

// 创建一个时钟对象Clock
var clock = new THREE.Clock();
const FPS = 30; // 指的是 30帧每秒的情况
const singleFrameTime = 1 / FPS;
let timeStamp = 0;
    let stats;

export default {
  components: {
  },
  data(){
    return{

    }
  },
  mounted(){
    this.YJSingleModelScene = null;

    this.init();
  },
  
  methods: {
    init() {

      
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px'; 
      this.$refs.YJ3dscene.appendChild(stats.domElement);

      this.YJSingleModelScene = new YJSingleModelScene(this.$refs.YJ3dscene, this);
      this.renderScene();

    },
 
    //实时刷新
    renderScene() {
      

      const delta = clock.getDelta(); //获取自上次调用的时间差
      timeStamp += delta;
      //限制帧率在30帧
      if (timeStamp > singleFrameTime) {
        this.YJSingleModelScene.update();
        // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
        timeStamp = timeStamp % singleFrameTime;
        stats.update();

      }
      requestAnimationFrame(this.renderScene);
    },
  },
};
</script>