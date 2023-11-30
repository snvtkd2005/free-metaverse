
<template>
  <!-- 屏幕伤害显示 -->
  <div v-if="true" class="  absolute w-full flex left-0 top-20 pointer-events-none ">
    <div class=" w-auto mx-auto origin-bottom ">
      <div v-for="(item, i) in textList" :key="i" :index="item.id" class=" text-xl flex-col-reverse " :style="'opacity:' + item.opacity + ';'
        ">
        <div class=" w-auto h-6  flex  text-red-500
                    ">
          <div class="  self-center mx-auto text-2xl ">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "fireStateUI",
  components: {
  },
  data() {
    return {
      display: false,
      textList: [
        {
          type: '提示', // 
          value: "太远了",
          pos: { x: 464, y: 50 },
          opacity: 1,
          time: 0,
        },
        {
          type: '提示', // 
          value: "太远了2",
          pos: { x: 464, y: 50 },
          opacity: 1,
          time: 0,
        },
      ],
      speed: 0.03,
    };
  },
  created() {

  },
  mounted() {
    this.animate();
  },
  methods: {

    Add(type, value) {
      this.textList.push({ type: type, value: value, pos: { x: 464, y: 50 }, opacity: 1, time: 0 });
      console.log(" ", this.textList[this.textList.length - 1]);
    },
    animate() {
      requestAnimationFrame(this.animate);
      for (let i = this.textList.length - 1; i >= 0; i--) {
        const item = this.textList[i];
        item.time += this.speed; 
        if (item.time >= 2.7) { 
          item.opacity -= this.speed;
        }
        if (item.time >= 3) {
          this.textList.splice(i, 1);
        }
      }

    },
  },
};
</script>
 
<style scoped></style>