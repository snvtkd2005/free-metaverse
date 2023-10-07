
// 在线聊天室 聊天界面 3d形象 聊天
<template>


  <!-- 加载模型过程 提示文字 -->
  <div v-if="loading" class="absolute w-full h-full top-0 left-0 flex pointer-events-none">
    <div class="w-1/2 h-10 text-2xl text-white mt-10 mx-auto">
      {{ tipContent }}
    </div>
  </div>

  <!-- 加载loading -->
  <div v-if="diplayerLoading" class="absolute z-40 w-full h-full bg-color top-0 left-0">
    <div class="
        absolute
        w-full
        h-full 
        top-0
        left-0
        flex
        pointer-events-none
      ">
      <div class=" self-center mx-auto">
        <img :src="$publicUrl + 'farm/img/loading_icon.png'" alt="" />
      </div>
    </div>

    <div class="absolute z-10 left-0 top-0 w-full h-full flex">
      <div class="w-20 h-20 mx-auto self-center flex text-color transform translate-x-24 mt-1  ">
        <div v-if="!canEnter" class="mx-auto self-center  ">
          {{ loadingProcessValue }}%
        </div>
        <div v-if="canEnter" class="
            mx-auto
            self-center
            cursor-pointer
            transform
            hover:scale-110
           font-bold
          " @click="OpenThreejs()">
          ENTER {{ }}
        </div>
      </div>
    </div>

    <!-- <div class="w-1/2 h-10 text-2xl text-white mt-10 mx-auto">
      模型加载中，请稍候。。。
    </div> -->
  </div>


</template>

<script> 

import { circlebar } from "/@/js/circlebar.js";

export default {
  name: "loadingpanel",
  components: {
   
  },
  data() {
    return { 

      canEnter: false,
      diplayerLoading: true,

      loadingCircleBar: null,
      loadingProcessValue: 0,
 
      // 是否正在加载摆放的模型 或 切换角色皮肤
      loading: false,
      // 提示文字内容
      tipContent: "loading...",  

      tipLater: null,
    };
  },
  mounted() {
    // this.loadingCircleBar = new circlebar(this.$refs.circlebar);
  },
  methods: {

    LoadingState(state) {
      if (state == "success") {
        this.loading = false;
      }
      if (state == "begin") {
        this.tipContent = "loading...";
        this.loading = true;
      }
    },

    LoadState(state) {
      if (state == "success") {
        this.canEnter = true;
      }
      if (state == "begin") {
        this.diplayerLoading = true;
      }
    },
    LoadingProcess(process) {
      this.loadingProcessValue = process;
      // this.loadingCircleBar.UpdateCircle(process);
    }, 
    OpenThreejs(){
      this.$parent.OpenThreejs();
      this.diplayerLoading = false;
    }
 
  },
};
</script> 

<style scoped>
.bg-color {
  background: #94b0c1;
}
.text-color {
  /* color: #94b0c1; */
  color: #797979;
}
.loading_content {
  padding-top: 18%;
  padding-right: 5%;
  display: flex;
  justify-content: center;
  align-items: center;

}
</style>
