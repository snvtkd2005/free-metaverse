
<template>
  <!-- 技能进度条 -->
  <div v-if="display"
    class=" h-20 flex text-white  pointer-events-none  "
    >
    <div class="  w-32 h-16 mt-3 mx-auto   ">
      <div class=" relative ">
        <div>
          {{skillName}}
        </div>
        <div class=" h-4  border relative ">
          <div class=" h-full " :class="color=='blue'?' bg-blue-500 ':' bg-yellow-500 '" :style="'width: ' + GetProgress() + '%'"></div>
          <div v-if="false" class=" absolute  left-0 top-0 w-full text-center text-xs  ">
            {{ this.current + "/" + this.length }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: "skillProgress",
  props:['color'],
  components: {
  },
  data() {
    return {
      display: false,
      current: 1, 
      length: 100, //最大能量值 
      updateId:null,
      deltaTime:0,
      last:null,
      skillName:"",
    };
  },
  created() {

  },
  mounted() { 
    // this.SetProgress(0,30);
  },
  methods: {
    SetProgress(e,skillName) {
      if(e=="中断" || e=="完成"){
        this.display = false;
        cancelAnimationFrame(this.updateId);
        return;
      } 
      this.last = performance.now();
      this.current = 0;
      this.length = e;
      this.skillName = skillName;
      this.animate();
      this.display = true;
    }, 
    GetProgress() {
      return parseInt(this.current / this.length * 100);
    },
    animate(){
      this.updateId = requestAnimationFrame(this.animate);
      const now = performance.now();
      let delta = (now - this.last) / 1000;
      this.current += delta * 1;
      if(this.current>=this.length){
        this.display = false;
        cancelAnimationFrame(this.updateId); 
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