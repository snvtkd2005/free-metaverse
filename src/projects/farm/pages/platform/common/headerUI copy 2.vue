
<template>
  <!-- 左上角血条头像 -->
  <div v-if="display"
    class="  absolute left-2 top-2 h-20 flex text-white origin-top-left transform scale-50 xl:scale-100 "
    style="width:189px;height:66px;"
    @mouseenter="hover = true" @mouseleave="hover = false">

    
    <!-- 生命法术条 -->
    <div class=" absolute left-1 top-8 w-28 h-auto    " style="width: 116px;"> 
      <div class=" relative ">
        <div class=" h-2   relative ">
          <div class=" h-full bg-green-500  " :style="'width: ' + this.healthPerc + '%'"></div>
        </div>
        <div class=" mt-px h-2   relative ">
          <div class=" h-full bg-blue-500  " :style="'width: ' + GetEnergy() + '%'"></div>
        </div>
      </div>
    </div>

    <!-- 姓名栏背景 -->
    <div class=" relative w-28 h-4 ml-1.5 mt-3   ">
      <div class=" absolute h-full w-full bg-red-200  " ></div>
    </div>

    <!-- 整个背景ui -->
    <img class=" absolute left-0 top-0 transform   " style="width:189px;height:66px; transform:rotateY(180deg);"  :src="headerBGUrl" alt="">
    

    <!-- 生命法术条文字 -->
    <div class=" absolute left-1 top-7  w-28 h-auto    " style="width: 116px;"> 
      <div class=" relative ">
        <div class=" h-2   relative ">
          <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs transform scale-90  ">
            {{ this.baseData.health + "/" + this.baseData.maxHealth }}</div>
        </div>
        <div class=" mt-px h-2   relative ">
          <div v-if="hover" class=" absolute  left-0 top-0 w-full text-center text-xs transform scale-90  ">
            {{ this.energy + "/" + this.maxEnergy }}</div>
        </div>
      </div>
    </div>

    <div class=" absolute right-1 mt-px w-16 h-16     ">
      <!-- 头像 -->
      <img class=" absolute right-0 p-2 w-16 h-16 rounded-full " :src="icon" alt="">
      <!-- 等级ui背景 -->
      <img class="  absolute right-0 bottom-0 w-6 h-6  " :src="levelBGUrl" alt="">

      <!-- 等级文字 -->
      <div class=" absolute right-0 bottom-0 w-6 h-6 rounded-full text-center text-xs flex ">
        <div class=" text-white self-center mx-auto">
          {{ baseData.level }}
        </div>
      </div>
    </div>


    <!-- npc名称 -->
    <div class=" absolute left-0 w-28 h-4 ml-1 mt-3   ">
      <div class="  h-4 text-xs transform scale-90 text-center truncate">{{ targetName }}</div> 
    </div>



  </div>
</template>

<script>
export default {
  name: "headerUI",
  components: {
  },
  data() {
    return {
      display: true,
      // display: false,
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
      headerBGUrl:"",
      headerBGUrlData:{
        normal:"./public/images/cursorList/headerBG_normal.png", //头像背景图 普通
        rare:"./public/images/cursorList/headerBG_rare.png", //  稀有
        elite:"./public/images/cursorList/headerBG_elite.png", //   精英
      } ,
      levelBGUrl:"./public/images/cursorList/levelBG.png", //头像背景图
    };
  },
  created() {

  },
  mounted() { 

  },
  methods: {

    // 设置头像框上的角色名
    SetTarget(npcData) {
      console.log(  " 设置头像框上数据更新 111 ",npcData);

      this.targetName = npcData.name;
      this.baseData = npcData.baseData;
      this.headerBGUrl = this.headerBGUrlData[this.baseData.type|| "normal"] ;
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
</style>