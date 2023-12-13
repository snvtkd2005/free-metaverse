
<template>
  <div v-if="display"
    class="  absolute left-2 top-2  flex text-white origin-top-left transform scale-50 xl:scale-100 "
    style="width:273px;height:109px;"
    @mouseenter="hover = true" @mouseleave="hover = false">
    
    <!-- 生命法术条 -->
    <div class=" absolute left-2 top-12 h-auto w-health    "  > 
      <div class=" relative ">
        <div class=" h-3   relative ">
          <div class=" h-full bg-green-500  " :style="'width: ' + this.healthPerc + '%'"></div>
        </div>
        <div class=" mt-px h-3   relative ">
          <div class=" h-full bg-blue-500  " :style="'width: ' + GetEnergy() + '%'"></div>
        </div>
      </div>
    </div>

    <!-- 姓名栏背景 -->
    <div class=" relative w-health h-4 ml-1.5 mt-7   ">
      <div class=" absolute h-full w-full   " :class="selfCamp?' bg-blue-100 ':' bg-red-500 '"    ></div>
    </div>

      <!-- 头像 -->
    <div class=" absolute right-12 mt-2 w-20 h-20     ">
      <img class=" absolute right-0 p-2 w-20 h-20 rounded-full " :src="icon" alt=""> 
    </div>


    <!-- 整个背景ui -->
    <img class=" absolute left-0 top-0 w-full h-full  "  :src="headerBGUrl" alt="">

    <!-- 生命法术条文字 -->
    <div class=" absolute left-1 top-7 w-health h-auto    " > 
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

    <div class=" absolute right-12 mt-2 w-20 h-20     "> 
      <!-- 等级文字 -->
      <div class=" absolute right-px  bottom-px w-6 h-6 text-xs flex ">
        <div class=" text-white self-center mx-auto">
          {{ baseData.level }}
        </div>
      </div>
    </div>


    <!-- npc名称 -->
    <div class=" absolute left-0 w-health h-4 ml-1 mt-7   ">
      <div class="  h-4 text-xs transform scale-90 text-center truncate  tracking-widest "
      :class="selfCamp?' text-white ':' text-yellow-300 '" >{{ targetName }}</div> 
    </div>

    <!-- 技能施法条 -->
    <div class=" absolute left-4 -bottom-6 h-auto w-health    "  > 
      <div class=" relative ">
        <div class=" h-3  relative ">
          <skillProgressUI color="yellow"  ref="skillProgressUI" />
        </div> 
      </div>
    </div>

  </div>
</template>

<script>

import skillProgressUI from "./skillProgressUI.vue";


export default {
  name: "headerUI",
  components: {
    skillProgressUI,
  },
  data() {
    return {
      // display: true,
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
      headerBGUrl:"",
      headerBGUrlData:{
        normal:"./public/images/cursorList/headerBG_normal.png", //头像背景图 普通
        rare:"./public/images/cursorList/headerBG_rare.png", //  稀有
        elite:"./public/images/cursorList/headerBG_elite.png", //   精英
      } , 
      selfCamp:false, 
      skillPerc:0,
    };
  },
  created() {

  },
  mounted() { 

  },
  methods: {

    // 设置头像框上的角色名
    SetTarget(npcData) {
      // console.log(  " 设置头像框上数据更新 111 ",npcData);

      this.targetName = npcData.name;
      this.baseData = npcData.baseData;


      this.selfCamp = this.baseData.camp == _Global.user.camp;

      this.headerBGUrl = this.headerBGUrlData[this.baseData.type|| "normal"] ;
      this.GetHealth();
      let avatarId = npcData.avatarData.id;
      this.icon = this.$uploadUrl + avatarId + "/" + avatarId + "_thumb.png";
      this.display = true;
    },
    SetSkill(npcSkill){
      console.log(" 设置技能进度条 npcSkill ",npcSkill);
      if(npcSkill=="中断"){
        this.$refs.skillProgressUI.SetProgress(npcSkill);
        return;
      }
      this.$refs.skillProgressUI.SetProgress(npcSkill.castTime,npcSkill.skillName);
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
.w-health{
  width:139px;
}
</style>