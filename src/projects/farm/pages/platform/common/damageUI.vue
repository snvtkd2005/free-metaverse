
<template>
  <!-- 屏幕伤害显示 -->
  <div v-if="true" class="  absolute  left-0 top-0 flex pointer-events-none ">
    <div v-for="(item, i) in damageList" :key="i" :index="item.id" class=" text-xl flex" 
    :style="' position:absolute; left:' +
      (item.pos.x - 64) +
      'px;top:' +
      (item.pos.y - 28) +
      'px;'+
      'opacity:'+item.opacity+';'
      ">
      <div class=" w-32 h-14  flex  "
      :class="item.addredius=='redius'?' text-yellow-400 ':' text-green-400 '"
      >
        <div class="  self-center mx-auto text-4xl ">
        {{item.addredius=='redius'?'-':'+' }}  {{  item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "damageUI",
  components: {
  },
  data() {
    return {
      display: false,
      damageList: [
        // {
        //   owner: '自身', //自身还是宠物
        //   type: '普通', //普通、暴击
        //   value: 100,
        //   pos: { x: 464, y: 245 },
        //   opacity:1,
        //   time:0,
        // },
      ],
      speed:0.03,
    };
  },
  created() {

  },
  mounted() {
    this.animate();
  },
  methods: {

    AddDamage(owner, type, value, pos,addredius) {
      this.damageList.push({ owner: owner, type: type, value: value, pos: pos,addredius:addredius, opacity: 1,time:0 });
      // console.log(" ", this.damageList[this.damageList.length - 1]);
    },
    animate() {
      requestAnimationFrame(this.animate);
      for (let i = this.damageList.length - 1; i >= 0; i--) {
        const item = this.damageList[i];
        item.time += this.speed;
        item.pos.y -= 0.51;
        if (item.time >= 0.51) {
          item.opacity -= this.speed;
        }
        if (item.time >= 1) {
          this.damageList.splice(i, 1);
        }
      }
    },
  },
};
</script>
 
<style scoped></style>