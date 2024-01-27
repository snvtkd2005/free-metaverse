
<template>
  <div class=" absolute right-0 top-0 w-full h-full bg-546770">

    <!-- 场景设置面板 -->
    <div v-show="panelState.setting" class=" mt-10 w-full border-t  max-w-md ">
      <sceneSettingPanel ref="sceneSettingPanel" />
    </div>

    <div v-if="isTransform" class="mt-10 w-full border-t max-w-md">
      <settingPanel_transform ref="settingPanel_transform" />
    </div>

    <!-- uv动画设置面板 -->
    <div v-if="panelState.uvAnim" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t  max-w-md ">
      <settingPanel_uvAnim ref="settingPanel_uvAnim" />
    </div>

    <!-- 汽车 -->
    <div v-if="panelState.car" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_car ref="settingPanel_car" />
    </div>

    <!-- 武器 -->
    <div v-if="panelState.weapon" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_weapon ref="settingPanel_weapon" />
    </div>

    <!-- 玩家角色 -->
    <div v-if="panelState.player" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_player ref="settingPanel_player" />
    </div>

    <!-- 图片视频直播流设置面板 -->
    <div v-if="panelState.screen" :class="isTransform?'mt-0':'mt-10'" class="   w-full border-t max-w-md  ">
      <settingPanel_screen ref="settingPanel_screen" />
    </div>

    <!-- 粒子系统设置面板 -->
    <div v-if="panelState.particle" :class="isTransform?'mt-0':'mt-10'" class="    w-full border-t max-w-md  ">
      <settingPanel_particle ref="settingPanel_particle" />
    </div>

    <!-- 角色 -->
    <div v-if="panelState.avatar" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_avatar ref="settingPanel_avatar" />
    </div>

    <!-- npc -->
    <div v-if="panelState.npc" :class="isTransform?'mt-0':'mt-10'" class=" w-full border-t max-w-md">
      <settingPanel_npc ref="settingPanel_npc" />
    </div> 

    <!-- 道具 -->
    <div v-if="panelState.interactive" :class="isTransform?'mt-0':'mt-10'" class=" w-full border-t max-w-md">
      <settingPanel_interactive ref="settingPanel_interactive" />
    </div>

    <!-- 拖尾 -->
    <div v-if="panelState.trail" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_trail ref="settingPanel_trail" />
    </div>
  </div>
</template>

<script>


import settingPanel from "./settingPanel.vue";
import sceneSettingPanel from "./sceneSettingPanel.vue";
import settingPanel_uvAnim from "./settingPanel_uvAnim.vue";
import settingPanel_car from "./settingPanel_car.vue";
import settingPanel_weapon from "./settingPanel_weapon.vue";
import settingPanel_player from "./settingPanel_player.vue";
import settingPanel_screen from "./settingPanel_screen.vue";
import settingPanel_particle from "./settingPanel_particle.vue";
import settingPanel_avatar from "./settingPanel_avatar.vue";
import settingPanel_npc from "./settingPanel_npc.vue";
import settingPanel_interactive from "./settingPanel_interactive.vue";
import settingPanel_trail from "./settingPanel_trail.vue";

import settingPanel_transform from "./settingPanel_transform.vue";


export default {
  name: "settingPanelCtrl",
  components: {
    settingPanel,
    sceneSettingPanel,
    settingPanel_uvAnim,
    settingPanel_car,
    settingPanel_weapon,
    settingPanel_player,
    settingPanel_screen,
    settingPanel_particle,
    settingPanel_avatar,
    settingPanel_npc,
    settingPanel_interactive,
    settingPanel_trail,
    settingPanel_transform,
  },
  data() {
    return {
      isTransform:false,
      panelState: {
        setting: false,
        // setting: true,
        model: false,
        uvAnim: false,
        car: false,
        player: false,
        screen: false,
        particle: false,
        npc: false,
        interactive: false,
        weapon: false,
        trail: false,
      },
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    ChangePanel(e) {
      console.log(" ====== 切换右侧面板 ", e);
      let names = Object.getOwnPropertyNames(this.panelState);
      let list = Object.getOwnPropertySymbols(this.panelState);
      for (let i = 0; i < names.length; i++) {
        const element = names[i];
        this.panelState[element] = false;
      }
      if (e == "") { 
        this.isTransform = false;
        return; 
      }
      // console.log(names);
      // console.log(list);
      this.panelState[e] = true;
      if(e=="setting"){
        this.isTransform = false;
      }
    },

  },
};
</script>

<style scoped></style>
