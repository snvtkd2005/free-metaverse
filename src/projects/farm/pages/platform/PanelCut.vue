
<!-- // 场景编辑UI -->
<template>
  <div class="absolute left-0 top-0 z-999 w-full h-full flex flex-col pointer-events-none">

    <!-- 截图区域安全区域 -->
    <div v-if="safeOrder" class="
        hidden
        md:flex
        absolute
        top-0
        left-0
        w-full
        h-full
        pointer-events-none
      ">
      <div class="
          mx-auto
          self-center
          w-96
          h-72
          transform
          border-2 border-green-400
          flex
          scale-150
          pointer-events-none
          relative
        ">
        <div class="
            py-10
            px-5
            w-4/5
            h-4/5
            self-center
            mx-auto
            border-2 border-yellow-400
          "></div>

        <div class="absolute -bottom-12 w-full flex">
          <div class="mx-auto self-center flex space-x-10 pointer-events-auto">
            <div class="bg-white rounded-md p-2 px-3 cursor-pointer" @click="updateModelIconPic()">
              截图
            </div>
            <div class="bg-white rounded-md p-2 px-3 cursor-pointer" @click="CancelCut()">
              关闭
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 截圖容器 -->
    <div class="hidden absolute top-0 left-0">
      <canvas id="cutcanvas" class="bg-white"> </canvas>
    </div>

  </div>
</template>

<script>

import { YJ3dCanvasCut } from "../../js/YJ3dCanvasCut.js";
export default {
  name: "PanelCut",
  components: {
  },
  data() {
    return {
      safeOrder: false,
      _YJ3dCanvasCut: null,
    };
  },
  created() {

  },
  mounted() {
  },
  methods: {
    Init(ThreejsHumanChat) {
      this._YJ3dCanvasCut = new YJ3dCanvasCut(
        ThreejsHumanChat,
        Math.ceil(384 * 1.5),
        Math.ceil(288 * 1.5)
      );
    },
    // 保存模型缩略图，并上传
    updateModelIconPic() {

      this._YJ3dCanvasCut.Photo((dataurl) => {
        // let dataurl = this.$refs.YJmetaBase.ThreejsHumanChat.getCanvasImg(
        //   400,
        //   300
        // );
        this.$parent.updateModelIconPic(dataurl,()=>{

        });
      });
    },
    CancelCut() {
      this.$emit("cancel");
      this.safeOrder = false;
    },
  },
};
</script>
 
<style scoped>
.z-999 {
  z-index: 999;
}

.bg-color {
  background: #28cad9;
}
</style>