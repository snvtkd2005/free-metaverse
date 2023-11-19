
// 右下角的场景按钮。场景切换界面
<template>
  <!-- 右侧按钮 -->
  <div class="  absolute right-8 md:right-4 top-4 md:top-60  flex flex-col   ">

    <div >time  {{this.viewFar}}
  </div>

    <!-- 视角远近滑块 -->
    <input ref="viewFarCtrl" class="   outline-none  " @input="viewFarFn"
            v-model="viewFar" type="range" min="-2" max="1" step="0.01">
  </div>
</template>

<script>


export default {
  name: "interfaceCtrlShader",
  components: {

  },
  data() {
    return {
      viewFar:1,  
    };
  },
  created() {

  },
  mounted() { 

  },
  methods: {
    
    viewFarFn(e) {
      this.$parent._SceneManager.SetMsg("设置shader time",this.viewFar);
      // .SetCameraWheelPos(-this.viewFar);
      // 取消焦点
      this.$refs.viewFarCtrl.blur();

    }, 

  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  background: rgb(223, 223, 223);
  color: rgb(85, 85, 85);
  display: inline-block;
  pointer-events: auto;
}
</style>
