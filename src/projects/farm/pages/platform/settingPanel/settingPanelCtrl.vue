
<template>
  <div class=" absolute right-0 top-0 w-full h-full bg-546770">

    <!-- 场景设置面板 -->
    <div v-show="panelState.setting" class=" absolute  w-full border-t-2 mt-1 right-0 max-w-md  h-2/3  top-20  ">
      <sceneSettingPanel ref="sceneSettingPanel" />
    </div>
    <!-- uv动画设置面板 -->
    <div v-if="panelState.uvAnim" class=" absolute  w-full border-t-2 mt-1 right-0 max-w-md  h-2/3  top-20  ">
      <settingPanel_uvAnim ref="settingPanel_uvAnim" />
    </div>
    <!-- 图片视频直播流设置面板 -->
    <div v-if="panelState.screen" class=" mt-10  w-full border-t max-w-md  ">
      <settingPanel_screen ref="settingPanel_screen" />
    </div>
    <!-- 粒子系统设置面板 -->
    <div v-if="panelState.particle" class=" mt-10  w-full border-t max-w-md  ">
      <settingPanel_particle ref="settingPanel_particle" />
    </div>

    <div v-if="panelState.npc" class="mt-10 w-full border-t max-w-md">
      <settingPanel_npc ref="settingPanel_npc" />
    </div>

    <div v-if="panelState.weapon" class="mt-10 w-full border-t max-w-md">
      <settingPanel_weapon ref="settingPanel_weapon" />
    </div>

    <div v-if="panelState.interactive" class="mt-10 w-full border-t max-w-md">
      <settingPanel_interactive ref="settingPanel_interactive" />
    </div>
  </div>
</template>

<script>


import settingPanel from "./settingPanel.vue";
import sceneSettingPanel from "./sceneSettingPanel.vue";
import settingPanel_uvAnim from "./settingPanel_uvAnim.vue";
import settingPanel_screen from "./settingPanel_screen.vue";
import settingPanel_particle from "./settingPanel_particle.vue";
import settingPanel_npc from "./settingPanel_npc.vue";
import settingPanel_weapon from "./settingPanel_weapon.vue";
import settingPanel_interactive from "./settingPanel_interactive.vue";


export default {
  name: "settingPanelCtrl",
  components: {
    settingPanel,
    sceneSettingPanel,
    settingPanel_uvAnim,
    settingPanel_screen,
    settingPanel_particle,
    settingPanel_npc,
    settingPanel_weapon,
    settingPanel_interactive,
  },
  data() {
    return {

      panelState: {
        // setting: false,
        setting: true,
        model: true,
        uvAnim: false,
        screen: false,
        particle: false,
        npc: false,
        interactive: false,
        weapon: false,
      },
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    ChangePanel(e) {
      let names = Object.getOwnPropertyNames(this.panelState);
      let list = Object.getOwnPropertySymbols(this.panelState);
      for (let i = 0; i < names.length; i++) {
        const element = names[i];
        this.panelState[element] = false;
      }
      if (e == "") { return; }
      // console.log(names);
      // console.log(list);
      this.panelState[e] = true;
    },

  },
};
</script>

<style scoped></style>
