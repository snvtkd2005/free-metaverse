
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <!-- 加载模型过程 提示文字 -->
  <div
    v-if="loading"
    class="absolute w-full h-full top-0 left-0 flex pointer-events-none"
  >
    <div class="w-1/2 h-10 text-2xl text-white mt-10 mx-auto">
      {{ tipContent }}
    </div>
  </div>

  <!-- 加载loading -->
  <div
    v-if="diplayerLoading"
    class="relative w-full h-full top-0 left-0 z-10 flex bg-color text-white"
  >
    <loading class="hidden md:block absolute z-0 left-0 top-0" />

    <div class="absolute top-0 z-10 w-full md:w-2/5 h-full md:right-12 flex">
      <!-- <div class="  absolute top-0 left-0 w-full h-full self-center">
        <div class="w-full h-full">
          <img class="w-full h-full md:py-5" src="/@/assets/img/city/tu.png" />
        </div>
      </div> -->

      <div class="absolute w-full h-full left-0 top-0  flex">
        <div class="w-48 h-40 self-center mx-auto">
          <!-- logo -->
          <div class="w-16 h-16 self-center mx-auto"
          >
            <img class=" " 
          :class="canEnter?' hover:scale-110 cursor-pointer pointer-events-auto ':' pointer-events-none '"
                @click="OpenThreejs()"  :src="this.$publicUrl + 'city/img/logo.png' " />
          </div>

          <div class="w-48 h-10 relative">
            <div
              class="
                absolute
                left-0
                top-0
                w-40
                h-10
                mx-auto
                self-center
                flex
                ml-4
              "
            >
              <div v-if="!canEnter" class="mx-auto self-center">
                {{ loadingProcessValue }}%
              </div>
              <div
                v-if="canEnter"
                class="
                  mx-auto
                  self-center
                  cursor-pointer
                  transform
                  hover:scale-110
                  font-bold
                "
                @click="OpenThreejs()"
              >
                ENTER {{}}
              </div>
            </div>
          </div>

          <!-- <div class=" w-48 h-48 relative transform -translate-x-12 -translate-y-12 ">

      <canvas
        class=" absolute left-0 top-0 mx-auto self-center transform scale-50 -rotate-90"
        ref="circlebar"
        width="300"
        height="300"
      >
      </canvas>
      
      <div
        class=" absolute left-0 top-0
          w-40
          h-40
          mx-auto
          self-center
          flex 
          transform
          translate-x-16
          mt-16
          pt-3
          pl-3
        "
      >
        <div v-if="!canEnter" class="mx-auto self-center">
          {{ loadingProcessValue }}%
        </div>
        <div
          v-if="canEnter"
          class="
            mx-auto
            self-center
            cursor-pointer
            transform
            hover:scale-110
            font-bold
          "
          @click="OpenThreejs()"
        >
          ENTER {{}}
        </div>
      </div>
      </div>

       -->
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
    OpenThreejs() {
      this.$parent.OpenThreejs();
      this.diplayerLoading = false;
    },
  },
};
</script> 

<style scoped>
.bg-color {
  background: #222222;
}
.text-color {
  /* color: #94b0c1; */
  color: #797979;
}
</style>
