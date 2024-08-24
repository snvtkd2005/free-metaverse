
<template>
  <div
    v-if="display  "
    class="absolute left-28 xl:left-20 xl:ml-2 top-20 flex text-white origin-top-left transform scale-50 xl:scale-75"
    style="width: 273px; height: 109px"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!-- 生命法术条 -->
    <div class="absolute left-32 top-12 h-auto w-health">
      <div class="relative">
        <div class="h-3 relative">
          <div
            class="h-full bg-green-500"
            :style="'width: ' + this.healthPerc + '%'"
          ></div>
        </div>
        <div class="mt-px h-3 relative">
          <div
            class="h-full bg-blue-500"
            :style="'width: ' + GetEnergy() + '%'"
          ></div>
        </div>

        <div
          v-if="baseData.debuffList && baseData.debuffList.length"
          class="flex"
        >
          <div
            v-for="(debuff, i) in baseData.debuffList"
            :key="i"
            class="flex mr-1"
          >
            <div class="w-5 h-5 bg-gray-500">
              <img
                class="w-full h-full"
                :src=" debuff.icon"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 姓名栏背景 -->
    <div class="relative w-health h-4 ml-32 mt-7">
      <div
        class="absolute h-full w-full"
        :class="
        selfCamp==10000 ? '  bg-red-500 ' :
        (selfCamp==10001 ? '  bg-green-500 ':'  bg-yellow-100') "
      ></div>
    </div>

    <!-- 头像 -->
    <div class="absolute left-12 mt-2 w-20 h-20">
      <img
        class="absolute right-0 p-2 w-20 h-20 rounded-full"
        :src="icon"
        alt=""
      />
    </div>

    <!-- 整个背景ui -->
    <img
      class="absolute left-0 top-0 transform -scale-x-100 w-full h-full"
      :src="headerBGUrl"
      alt=""
    />

    <!-- 生命法术条文字 -->
    <div class="absolute left-32 top-10 w-health h-auto">
      <div class="relative mt-1">
        <div class="h-3 relative">
          <div
            v-if="hover"
            class="absolute left-0 top-0 w-full text-center text-xs transform scale-90"
          >
            {{ this.baseData.health + "/" + this.baseData.maxHealth }}
          </div>
        </div>
        <div class="mt-px h-3 relative">
          <div
            v-if="hover"
            class="absolute left-0 top-0 w-full text-center text-xs transform scale-90"
          >
            {{ this.energy + "/" + this.maxEnergy }}
          </div>
        </div>
      </div>
    </div>

    <div class=" absolute -left-2 mt-2 w-20 h-20">
      <!-- 等级文字 -->
      <div class="absolute right-px bottom-px w-6 h-6 text-xs flex">
        <div class="text-white self-center mx-auto">
          {{ baseData.level }}
        </div>
      </div>
    </div>

    <!-- npc名称 -->
    <div class="absolute left-32 w-health h-4 ml-1 mt-7">
      <div
        class="h-4 text-xs transform scale-90 text-center truncate tracking-widest"
        :class="
        
        selfCamp==10000 ? '  text-yellow-300 ' :
        (selfCamp==10001 ? '  text-white ':'  text-white') "
      >
        {{ targetName }}
      </div>
    </div>

    <!-- 技能施法条 -->
    <div class="absolute left-4 -bottom-6 h-auto w-health">
      <div class="relative">
        <div class="h-3 relative">
          <skillProgressUI color="yellow" ref="skillProgressUI" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import skillProgressUI from "./skillProgressUI.vue";

export default {
  name: "targetTargetUI",
  components: {
    skillProgressUI,
  },
  data() {
    return { 
      display: false,
      //npc头像
      hover: true,
      playerImg: "",
      targetName: "hhh",
      energy: 100, //能量值
      maxEnergy: 100, //最大能量值
      icon: "",
      healthPerc: 100,
      baseData: {
        state: "normal", //状态
        camp: "bl",
        level: 1, //等级
        health: 100, //生命值
        maxHealth: 100, //最大生命值
      },
      headerBGUrl: "./public/images/cursorList/headerBG_normal.png",
      headerBGUrlData: {
        normal: "./public/images/cursorList/headerBG_normal.png", //头像背景图 普通
        rare: "./public/images/cursorList/headerBG_rare.png", //  稀有
        elite: "./public/images/cursorList/headerBG_elite.png", //   精英
      },
      selfCamp: 10000, 
      skillPerc: 0,
    };
  },
  created() {},
  mounted() {
    if (_Global.addEventListener) {
      _Global.addEventListener("选中角色的目标",(targetModel) => {
          this.SetTarget(targetModel.GetData(), targetModel.GetNickName());
      });
      _Global.addEventListener("取消选中角色",() => {
        this.display = false;
      });
    }
  },
  methods: {
    // 设置头像框上的角色名
    SetTarget(npcData,nickName) {
      if(!_Global.GameSetting.control.playerCtrl[2].value){return;}
      // console.log(  " 设置 NPC 头像框上数据更新 111 ",npcData,this.baseData.camp);

      this.targetName = nickName;
      this.baseData = npcData.baseData;
      if(this.baseData == undefined){
        console.error(" 目标的目标 数据错误",npcData);
        return;
      }
      if(this.baseData.camp != _Global.user.camp){
        this.selfCamp = 10000;
      }
      if(this.baseData.camp == 10001){
        this.selfCamp = 10001;
      }
      if(this.baseData.camp == 10002){
        this.selfCamp = 10002;
      }
      // 普通 稀有 精英
      this.headerBGUrl = this.headerBGUrlData[this.baseData.type || "normal"];
      this.GetHealth();
      let avatarId = npcData.avatarData.id;
      this.icon = this.$uploadUrl + avatarId + "/" + "thumb.png";
      this.display = true;
    },
    SetSkill(npcSkill) {
      // 头像上的施法进度条
      // console.log(" 设置技能进度条 npcSkill ",npcSkill);
      if (npcSkill == "中断") {
        if (this.$refs.skillProgressUI) {
          this.$refs.skillProgressUI.SetProgress(npcSkill);
        }
        return;
      }
      if (this.$refs.skillProgressUI) {
        this.$refs.skillProgressUI.SetProgress(
          npcSkill.castTime,
          npcSkill.skillName,
          npcSkill.effect.type == "contDamage"
        );
      }
    },
    SetHealth(e, t) {
      this.health = e;
      if (t) {
        this.maxHealth = t;
      }
    },
    GetHealth() {
      this.healthPerc = parseInt(
        (this.baseData.health / this.baseData.maxHealth) * 100
      );
      return this.healthPerc;
    },
    SetEnergy(e, t) {
      this.energy = e;
      if (t) {
        this.maxEnergy = t;
      }
    },
    GetEnergy() {
      return parseInt((this.energy / this.maxEnergy) * 100);
    },
  },
};
</script>
 
<style scoped>
.-scale-x-100{ 
  --tw-scale-x: -1; 
}
.w-health {
  width: 139px;
}
</style>