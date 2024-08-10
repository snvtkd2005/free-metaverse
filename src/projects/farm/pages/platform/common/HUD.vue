
<template>
  <div class="absolute left-0 top-0 w-full h-full pointer-events-none">

    <!-- 主角头像 -->
    <mainPlayerHeaderUI v-show="hasMainHeaderUI" ref="mainPlayerHeaderUI" />

    <targetUI ref="targetUI" />
    <targetTargetUI ref="targetTargetUI" />

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
import targetUI from "./targetUI.vue";
import targetTargetUI from "./targetTargetUI.vue";
 
import skillProgressUI from "./skillProgressUI.vue";
import damageUI from "./damageUI.vue";
import fireStateUI from "./fireStateUI.vue"; 

import DMPanel from "./DMPanel_bilibili.vue";
import DMrogue from "../games/DMPanel_DMrogue.vue";
import GamePanel_Base from "../games/GamePanel_Base.vue";

import MMDpanel from "./MMDpanel.vue";
import roguelike from "../games/roguelike.vue";

export default {
  name: "HUD",
  components: { 
    mainPlayerHeaderUI,
    targetUI,
    targetTargetUI,
    skillProgressUI,
    damageUI,
    fireStateUI, 
    DMPanel,
    MMDpanel,
    roguelike,
    DMrogue,
    GamePanel_Base,
  },
  data() {
    return {
      gameType: "", //DMGame、MMD、Roguelike
      hasMainHeaderUI:false,
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
    this.hasMainHeaderUI = !_Global.setting.inEditor;
    console.log(" ========== in HUD ", _Global.gameType);
    this.gameType = _Global.gameType;
  },
  methods: {},
};
</script>
  