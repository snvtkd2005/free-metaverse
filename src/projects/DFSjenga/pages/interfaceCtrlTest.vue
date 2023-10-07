
// 右下角的场景按钮。场景切换界面
<template>

  <div class=" absolute right-2 bottom-40 text-white ">速度</div>
  <input ref="viewFarCtrl" class=" absolute  -right-10 bottom-20  outline-none  transform rotate-90" @input="ChangeSpeed"
    v-model="viewFar" type="range" min="0.5" max="2" step="0.1">

  <!-- 右侧按钮 -->
  <div class="
      absolute
      z-50
      right-8
      md:right-4
      top-40
      md:top-10
      flex flex-col
      pointer-events-none
    ">
    <div class="h-auto flex-col text-base space-y-2">


      <!-- <div class="cursor-pointer rounded-full" @click="ClickInterface('改变速度', 1)">
        <div class="p-2">改变速度</div>
      </div> -->

    </div>

  </div>
</template>

<script>
export default {
  name: "index",
  components: {},
  data() {
    return {
      viewFar: 1,
    };
  },
  created() { },
  mounted() {
    
    if (localStorage.getItem("changeSpeed")) {
      this.viewFar = (localStorage.getItem("changeSpeed"));
    }
  },
  methods: {
    ChangeSpeed() {
      _Global.ChangeSpeed(this.viewFar);
    },
    ClickInterface(title, e) {
      
      if (title == "发表情") {
        _Global.SetPlayerExpression(e - 1);
      }
      if (title == "做动作") {
        _Global.SetPlayerAnim(content);
        _Global.DelDengPai();
      }

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
