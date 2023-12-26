
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <!-- 场景加载进度条 -->
  <div v-if="displayerLoading" class=" absolute  w-full h-full top-0 left-0 z-50    text-white">

    <!-- 圆形进度条 -->
    <div class=" hidden absolute self-center w-96 h-96
        flex
       left-1/2
       top-1/2
       transform -translate-x-48 -translate-y-48
        pointer-events-none
      ">
      <canvas class="mx-auto self-center transform scale-50 -rotate-90" ref="circlebar" width="300" height="300">
      </canvas>
    </div>

    <div class=" absolute   
       bottom-10
       w-full h-20  flex">
      <div class=" relative flex self-center  mx-auto ">
        <div class="
                mx-auto
                self-center
                flex 
              ">
          <div class="mx-auto w-auto self-center">
            正在加载，请稍候...{{ loadingProcessValue }}%
          </div>
        </div>
      </div>

    </div>
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
      displayerLoading: true,

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
    if (!this.displayerLoading) { return; }
    this.loadingCircleBar = new circlebar(this.$refs.circlebar);

  },
  methods: {
    DisplayLoading(b){
      this.displayerLoading = false;
    },
    LoadingState(state) {
      if (!this.displayerLoading) { return; }

      if (state == "success") {
        this.loading = false;
      }
      if (state == "begin") {
        this.tipContent = "loading...";
        this.loading = true;
      }
    },

    LoadState(state) {
      if (!this.displayerLoading) { return; }
      if (state == "success") {
        this.canEnter = true;
        console.log(" 加载成功 隐藏loading ");
        setTimeout(() => {
          this.OpenThreejs();
        }, 20);
      }
      if (state == "begin") {
        this.displayerLoading = true;
      }
    },
    LoadingProcess(process) {
      if (this.$parent.LoadingProcess) {
        this.$parent.LoadingProcess(process / 100);
      }
      if (!this.displayerLoading) { return; }
      this.loadingProcessValue = process;
      // if (process == 100) { 
      //   this.displayerLoading = false;
      // }

      this.loadingCircleBar.UpdateCircle(process);
    },
    OpenThreejs() {
      this.$parent.OpenThreejs();
      this.displayerLoading = false;
    },
  },
};
</script> 

<style scoped>
.dialog {
  width: 480px;
  height: 480px;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -240px -240px;
}

.bg-color {
  background: #222222;
}

.text-color {
  /* color: #94b0c1; */
  color: #797979;
}
</style>
