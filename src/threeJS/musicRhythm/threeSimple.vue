<template>
  <div id="contain" class=" absolute  left-0 top-0 w-full h-full bg-gray-700 overflow-hidden" ref="YJ3dscene"
  @click="dataIndex=-i;"
  ></div>

  <div class=" absolute right-10 top-20 ">

    <div v-for="(item, i) in musicData" :key="i" :index="i" class=" w-auto h-auto ">
      <div class=" 
            
           bg-opacity-60
            text-white
            mt-4 mb-4 p-2
          "
          :class="dataIndex==i?'bg-green-800':'bg-gray-800'"
          @click="dataIndex=i;colorIndex=-1;"
          >
        <div class=" rounded-full w-4 h-4 flex bg-white text-black">
          <div class="self-center  mx-auto ">
            {{ i + 1 }}
          </div>
        </div>
        <div class=" mt-1  self-center
            mx-auto grid grid-cols-4 grid-rows-4 @stop ">
          <div v-for="(item2,ii) in item.color"
          @click.stop="colorIndex=ii;dataIndex=i;"
          :class="(colorIndex==ii&&dataIndex==i)?' bg-white':'p-0'"
          >
            <div class=" m-px w-4  h-4 " :style="'background-color:#' + ((item2.toString(16)) + ';')">
            </div>
          </div>
          <!-- {{ item.id+' ' + item.pos.x + " " + item.pos.y }} -->

        </div>

        <div class=" mt-2 text-xs">持续时间:{{ item.later }}</div>
        <div class=" mt-1 flex space-x-2 ">
          <div class=" w-4 h-4 bg-white text-black rounded-md flex  "> <div class=" self-center mx-auto ">-</div></div>
          <div class=" w-4 h-4 bg-white text-black rounded-md flex  "> <div class=" self-center mx-auto ">+</div></div>
        </div>
      </div>
    </div>
  </div>

</template>


 
<script >

import { YJ3dScene } from "./YJ3dScene.js";
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
    YJ3dScene,
  },
  data() {
    return {
      colorIndex:-1,
      dataIndex:-1,
      musicData: [
        {
          color: [
            0xff0000, 0xff0000, 0xff0000, 0xff0000,
            0xff0000, 0xff0000, 0xff0000, 0xff0000,
            0xff0000, 0xff0000, 0xff0000, 0xff0000,
            0xff0000, 0xff0000, 0xff0000, 0xff0000,
          ],
          later: 2
        },
        {
          color: [
            0xffff00, 0xffff00, 0xffff00, 0xffff00,
            0xffff00, 0xffff00, 0xffff00, 0xffff00,
            0xffff00, 0xffff00, 0xffff00, 0xffff00,
            0xffff00, 0xffff00, 0xffff00, 0xffff00,
          ],
          later: 2
        },
      ],

    }
  },
  mounted() {
    this._YJ3dScene = null;

    console.log(this.musicData);
    this.init();
  },

  methods: {
    stopPropagation(){
      
    },

    changeColor(color){
      this.musicData[this.dataIndex].color[this.colorIndex]=color;
      return this.musicData[this.dataIndex];
    },
    init() {


      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      this.$refs.YJ3dscene.appendChild(stats.domElement);

      this._YJ3dScene = new YJ3dScene(this.$refs.YJ3dscene, this);
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
        stats.update();

      }
      requestAnimationFrame(this.renderScene);
    },
  },
};
</script>