
<template>
  <!-- 屏幕伤害显示 -->
  <div v-if="display"
    class="  absolute left-2 top-2 h-20 flex text-white origin-top-left transform scale-50 xl:scale-100 "
    @mouseenter="hover = true" @mouseleave="hover = false">

    <div class=" w-20 h-20 relative   ">
      <img class=" w-20 h-20 border rounded-full " :src="icon" alt="">
      <div class=" absolute left-0 bottom-0 w-6 h-6 rounded-full bg-gray-500 text-center text-xs flex ">
        <div class=" self-center mx-auto">
          {{ level }}
        </div>
      </div>
    </div>

    <div class="  w-32 h-16 mt-3   ">
      <div class="  h-6 border text-center truncate">{{ targetName }}</div>

      <div class=" relative ">

        <div class=" h-4  border relative ">
          <div class=" h-full bg-green-500  " :style="'width: ' + this.healthPerc + '%'"></div>
          <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs  ">
            {{ this.baseData.health + "/" + this.baseData.maxHealth }}</div>
        </div>
        <div class=" h-4  border relative ">
          <div class=" h-full bg-blue-500  " :style="'width: ' + GetEnergy() + '%'"></div>
          <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs  ">
            {{ this.energy + "/" + this.maxEnergy }}</div>
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
        {
          owner: '自身', //自身还是宠物
          type: '普通', //普通、暴击
          value: 100,
        },
      ],
    };
  },
  created() {

  },
  mounted() {
    
  },
  methods: {

    AddDamage(data) {
 
    }, 
  },
};
</script>
 
<style scoped>

</style>