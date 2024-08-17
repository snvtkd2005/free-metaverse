
<template>
  <div class=" absolute right-0 top-0 w-full h-full overflow-y-scroll overflow-hidden bg-546770"
  @click="ClickEvent('bg')">

    <!-- 场景设置面板 -->
    <div v-show="panelState.setting" class=" mt-10 w-full border-t  max-w-md ">
      <sceneSettingPanel ref="sceneSettingPanel" />
    </div>

    <div v-if="isTransform" class="mt-10 w-full border-t max-w-md">
      <settingPanel_transform ref="settingPanel_transform" />
    </div>

    <!-- <div v-if="components.tween" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t  max-w-md ">
    </div> -->
    <div v-for="(item, i) in components" :key="i" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t  max-w-md ">
      <div v-if="item.type=='tween'" class="self-center">
        <settingPanel_tween ref="settingPanel_tween" :index="i" :data=item.data />
      </div>
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

    <!-- shader -->
    <div v-if="panelState.shader" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_shader ref="settingPanel_shader" />
    </div>

    <!-- geometry -->
    <div v-if="panelState.geometry" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_geometry ref="settingPanel_geometry" />
    </div>

    <!-- 装备 -->
    <div v-if="panelState.equip" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_equip ref="settingPanel_equip" />
    </div>
        <!-- 装备 -->
    <div v-if="panelState.modelAnim" :class="isTransform?'mt-0':'mt-10'" class="  w-full border-t max-w-md">
      <settingPanel_modelAnim ref="settingPanel_modelAnim" />
    </div>
    
    <div class=" mt-2 w-full h-10 text-white  " >
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 cursor-pointer " @click="addComponent()">添加组件</div>

      <div class="  text-black mt-2 overflow-y-scroll h-auto flex flex-wrap  " v-if="selectTitle == '添加组件' ">
      <div v-for="(item, i) in componentList" :key="i" class=" bg-white self-center w-auto h-auto relative flex">
        <div class=" w-16 h-6 text-center leading-6 self-center mx-auto mt-2 cursor-pointer " @click="ClickItem(item)">
          <!-- <img class=" w-full h-full object-fill hover:opacity-70 " :src="$uploadUrl + item" /> -->
          <div>{{item}}</div>
        </div>
      </div>
    </div>
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
import settingPanel_shader from "./settingPanel_shader.vue";
import settingPanel_geometry from "./settingPanel_geometry.vue";
import settingPanel_equip from "./settingPanel_equip.vue";
import settingPanel_modelAnim from "./settingPanel_modelAnim.vue";

import settingPanel_transform from "./settingPanel_transform.vue";
import settingPanel_tween from "./settingPanel_tween.vue";


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
    settingPanel_shader,
    settingPanel_transform,
    settingPanel_geometry,
    settingPanel_equip,
    settingPanel_tween,
    settingPanel_modelAnim,
  },
  data() {
    return {
      isTransform:false,
      panelState: {
        setting: false, 
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
        shader:false,
        geometry:false,
        equip:false,
        modelAnim:false,
        
      },
      components:[],
      componentList:['tween'],
      selectTitle:"",
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
    addComponent(){
      this.selectTitle = "添加组件";
    },
    ClickItem(item){
      this.selectTitle = "";

      _Global.YJ3D._YJSceneManager.GetSingleModelTransform().AddComponents({type:item,data:null});
      // this.components.push({type:item,data:null});
    },
    setComponent(c){
      console.log(" 当前物体有通用组件",c);
      this.components = c;
    },
    ClickEvent(e){
      if(e=='bg'){
        _Global.YJ3D.removeEventListener();
      }
    },
  },
};
</script>

<style scoped></style>
