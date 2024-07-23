
<template>
  <div class="absolute left-0 top-0 w-full h-full pointer-events-none">
    <div class="absolute bottom-20 w-full">
      <skillPanel_virus ref="skillPanel_virus" />
    </div>

    <!-- 
    <div class=" absolute bottom-0  w-full   ">
      <skillPanel ref="skillPanel" />
    </div> -->

    <!-- 主角头像 -->
    <mainPlayerHeaderUI ref="mainPlayerHeaderUI" />

    <headerUI ref="headerUI" />

    <div class="absolute w-full left-0 bottom-20">
      <skillProgressUI color="blue" ref="skillProgressUI" />
    </div>

    <damageUI ref="damageUI" />

    <fireStateUI ref="fireStateUI" />

    <div class="absoluteleft-0 top-0 w-full h-full">
      <DMPanel v-if="gameType == 'DMGame'" ref="DMPanel" />
      <DMrogue v-if="gameType == 'DMRoguelike'" ref="DMrogue" />
      <MMDpanel v-if="gameType == 'MMD'" ref="MMDpanel" />
      <roguelike v-if="gameType == 'Roguelike'" ref="roguelike" />
      <GamePanel_Base v-if="gameType == 'WOW'" ref="GamePanel_Base" />
    </div>
  </div>
</template>

<script>
import mainPlayerHeaderUI from "./mainPlayerHeaderUI.vue";
// import headerUI from "./headerUI copy 2.vue";
import headerUI from "./headerUI.vue";
import skillPanel from "./skillPanel_wow_mobile.vue";
import skillProgressUI from "./skillProgressUI.vue";
import damageUI from "./damageUI.vue";
import fireStateUI from "./fireStateUI.vue";
import skillPanel_virus from "./skillPanel_virus.vue";

import DMPanel from "./DMPanel_bilibili.vue";
import DMrogue from "../games/DMPanel_DMrogue.vue";
import GamePanel_Base from "../games/GamePanel_Base.vue";

import MMDpanel from "./MMDpanel.vue";
import roguelike from "../games/roguelike.vue";

export default {
  name: "HUD",
  components: {
    skillPanel,
    mainPlayerHeaderUI,
    headerUI,
    skillProgressUI,
    damageUI,
    fireStateUI,
    skillPanel_virus,
    DMPanel,
    MMDpanel,
    roguelike,
    DMrogue,
    GamePanel_Base,
  },
  data() {
    return {
      gameType: "", //DMGame、MMD、Roguelike
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      _Global.addEventListener(
        "设置技能进度条",
        (castTime, skillName, reverse) => {
          this.$refs.skillProgressUI.SetProgress(castTime, skillName, reverse);
        }
      );
    }, 5000);

    console.log(" ========== in HUD ", _Global.gameType);
    this.gameType = _Global.gameType;
  },
  methods: {},
};
</script>
  