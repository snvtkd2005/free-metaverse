
<template>
  <!-- 技能进度条 -->
  <div v-if="display" class="h-20 flex text-white pointer-events-none">
    <div class="w-32 h-16 mt-3 mx-auto">
      <div class="relative">
        <div>
          {{ skillName }}
        </div>
        <div class="h-4 border relative">
          <div
            class="h-full"
            :class="color == 'blue' ? ' bg-blue-500 ' : ' bg-yellow-500 '"
            :style="'width: ' + GetProgress() + '%'"
          ></div>
          <div 
            class="absolute left-0 top-0 w-full text-center text-xs"
          >
            {{  this.length }}
            <!-- {{ this.current + "/" + this.length }} -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "skillProgress",
  props: ["color"],
  components: {},
  data() {
    return {
      display: false,
      current: 1,
      length: 100, //最大能量值
      updateId: null,
      deltaTime: 0,
      last: null,
      skillName: "",
      reverse: false, //进度条是否反向
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    SetProgress(e, skillName, reverse) {
      if (e == "中断" || e == "完成") {
        this.display = false;
        // console.log(this.current +'/'+ this.length+ '  ' + e);

        cancelAnimationFrame(this.updateId);
        return;
      }
      this.last = performance.now();
      if(reverse == undefined){
        reverse = false;
      }
      this.reverse = reverse;
      if (reverse) {
        this.current = e;
      } else {
        this.current = 0;
      }
      this.length = e.toFixed(1);
      this.skillName = skillName;
      this.animate();
      this.display = true; 
              // console.error(this.current +'/'+ this.length+ '  ' + e);

      // if(this.interval){
      //   clearInterval(this.interval);
      // }
      // this.interval = setInterval(() => {
      //   this.current += 0.1;
      //   console.log(this.current +'/'+ this.length);
      //   if (this.current >= this.length) {
      //     this.display = false; 
      //     clearInterval(this.interval);
      //   }
      // }, 100);
      this.display = true;
    },
    GetProgress() {
      return parseInt((this.current / this.length) * 100);
    },
    animate() {
      this.updateId = requestAnimationFrame(this.animate);
      if (_Global.pauseGame) {
        cancelAnimationFrame(this.updateId);
        return;
      }
      const now = performance.now();
      let delta = (now - this.last) / 1000;
      if (this.reverse) {
        this.current -= delta * 1;
        if (this.current <= 0) {
          this.display = false;
          cancelAnimationFrame(this.updateId);
        }
      } else {
        this.current += delta * 1;
        if (this.current >= this.length) {
          this.display = false;
          cancelAnimationFrame(this.updateId);
        }
      }
      this.last = now;
    },
  },
};
</script>
 
<style scoped>
.bg-color {
  background: #28cad9;
}

.mask {
  /* -webkit-mask-image:url('/@/assets/headerimage.png');
  mask-image: url('/@/assets/headerimage.png'); */
}
</style>