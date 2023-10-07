
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <!-- 加载模型过程 提示文字 -->
  <div v-if="loading" class="absolute w-full h-full top-0 left-0 flex pointer-events-none">
    <div class="w-1/2 h-10 text-2xl text-white mt-10 mx-auto">
      {{ tipContent }}
    </div>
  </div>

  <!-- 加载loading -->
  <div v-if="diplayerLoading" class="  absolute w-full h-full top-0 left-0 z-50 flex bg-transparent  text-white">
    <!-- <loading class="hidden md:block absolute z-0 left-0 top-0" /> -->
    <div class=" dialog
        flex
        mt-40
        pointer-events-none
      ">

      <canvas class="mx-auto self-center transform scale-25 -rotate-90" ref="circlebar" width="300" height="300">
      </canvas>
      
    </div>

    <div class="dialog  mt-40 flex">
      <div class="w-48 h-10 relative flex self-center  mx-auto ">
            <div class="
                absolute
                left-0
                top-0
                w-40
                h-10
                mx-auto
                self-center
                flex
                ml-4
              ">
              <div v-if="!canEnter" class="mx-auto self-center">
                {{ loadingProcessValue }}%
              </div>
              <div v-if="canEnter" class=" hidden
                  mx-auto
                  self-center
                  cursor-pointer
                  transform
                  hover:scale-110
                  font-bold
                " @click="OpenThreejs()">
                进入 {{}}
              </div>
            </div>
          </div>

    </div>
  </div>
</template>

<script>
import { circlebar } from "/@/js/circlebar.js";
import loading from "./Loading.vue";

export default {
  name: "loadingpanel",
  components: {
    loading,
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
    if (!this.diplayerLoading) { return; }
    this.loadingCircleBar = new circlebar(this.$refs.circlebar);
    this.loadingCircleBar.SetColor("#2091AA");  
  },
  methods: {
    LoadingState(state) {
      if (!this.diplayerLoading) { return; }

      if (state == "success") {
        this.loading = false;
      }
      if (state == "begin") {
        this.tipContent = "loading...";
        this.loading = true;
      }
    },

    LoadState(state) {
      if (!this.diplayerLoading) { return; }
      if (state == "success") {
        this.canEnter = true;
        this.diplayerLoading = false;
      }
      if (state == "begin") {
        this.diplayerLoading = true;
      }
    },
    LoadingProcess(process) {
      if (!this.diplayerLoading) { return; }
      this.loadingProcessValue = process;
      if (process == 100) { 
        this.diplayerLoading = false;
      }

      this.loadingCircleBar.UpdateCircle(process);
    },
    OpenThreejs() {
      this.$parent.OpenThreejs();
      this.diplayerLoading = false;
    },
  },
};
</script> 

<style scoped>

.scale-25{
  --tw-scale-x:.25;
  --tw-scale-y:.25;
}
  .dialog {
  width: 480px;
  height: 480px;
  position: absolute;
  top: 20%;
  left: 15%;
}
.bg-color {
  background: #222222;
}

.text-color {
  /* color: #94b0c1; */
  color: #797979;
}
</style>
