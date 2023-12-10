
<template>
  <!-- 左上角血条头像 -->
  <div v-if="display"
    class="  absolute left-2 top-2 h-20 flex text-white origin-top-left transform scale-50 xl:scale-100 "
    @mouseenter="hover = true" @mouseleave="hover = false">

    
    <div class=" absolute right-px bottom-0  w-28 h-12 mt-1   "> 
      <div class=" relative ">
        <div class=" h-2   relative ">
          <div class=" h-full bg-green-500  " :style="'width: ' + this.healthPerc + '%'"></div>
          <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs  ">
            {{ this.baseData.health + "/" + this.baseData.maxHealth }}</div>
        </div>
        <div class=" mt-px h-2   relative ">
          <div class=" h-full bg-blue-500  " :style="'width: ' + GetEnergy() + '%'"></div>
          <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs  ">
            {{ this.energy + "/" + this.maxEnergy }}</div>
        </div>
      </div>
    </div>

    <img class=" absolute left-0 top-0    " style="width:189px;height:66px;"  :src="headerBGUrl" alt="">
    
    <div class=" w-16 h-16 relative   ">
      <img class=" p-2 w-16 h-16 rounded-full " :src="icon" alt="">
      <img class="  absolute left-0 bottom-0 w-6 h-6  " :src="levelBGUrl" alt="">

      <div class=" absolute left-0 bottom-0 w-6 h-6 rounded-full text-center text-xs flex ">
        <div class=" text-yellow-500 self-center mx-auto">
          {{ baseData.level }}
        </div>
      </div>
    </div>


    <div class="  w-28 h-16 mt-3   ">
      <div class="  h-4 text-xs transform scale-90 text-center truncate">{{ targetName }}</div> 
    </div>



  </div>
</template>

<script>

// import { YJ3dScene_playerHeader } from "/@/threeJS/YJ3dScene_playerHeader.js";


export default {
  name: "headerUI",
  components: {
  },
  data() {
    return {
      display: false,
      //npc头像
      hover: false,
      playerImg: "",
      targetName: "hhh",
      energy: 100, //能量值
      maxEnergy: 100, //最大能量值
      icon: '',
      healthPerc:100,
      baseData: {
        state: 'normal', //状态
        camp: "bl",
        speed: 8, //移动速度
        level: 1, //等级
        health: 100, //生命值
        maxHealth: 100, //最大生命值
        strength: 20, //攻击力
      },
      headerBGUrl:"./public/images/cursorList/headerBG.png", //头像背景图
      levelBGUrl:"./public/images/cursorList/levelBG.png", //头像背景图
    };
  },
  created() {

  },
  mounted() {
    // this._YJ3dScene_playerHeader = null;

    this.publicUrl = this.$parent.GetPublicUrl();

  },
  methods: {

    // 设置头像框上的角色名
    SetTarget(npcData) {
      console.log(  " 设置头像框上数据更新",npcData);

      this.targetName = npcData.name;
      this.baseData = npcData.baseData;
      this.GetHealth();
      let avatarId = npcData.avatarData.id;
      this.icon = this.$uploadUrl + avatarId + "/" + avatarId + "_thumb.png";
      this.display = true;
    },
    SetHealth(e, t) {
      this.health = e;
      if (t) {
        this.maxHealth = t;
      }
    },
    GetHealth() {
      this.healthPerc = parseInt(this.baseData.health / this.baseData.maxHealth * 100);
      return this.healthPerc;
    },
    SetEnergy(e, t) {
      this.energy = e;
      if (t) {
        this.maxEnergy = t;
      }
    },
    GetEnergy() {
      return parseInt(this.energy / this.maxEnergy * 100);
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