
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <!-- <ThreejsHumanChat id="ThreejsHumanChat" tabindex="-1" class="absolute left-0 top-0" ref="ThreejsHumanChat" /> -->
  
  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

  <!-- 加载loading -->
  <loadingPanel class="absolute z-50 left-0 top-0 pointer-events-none " ref="loadingPanel" />
 

  <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
  <div v-if="isMobile && contrlState == 0">
    <JoystickLeftPanel class="  " ref="JoystickLeftPanel" />
    <!-- <JoystickRightPanel class="  " ref="JoystickRightPanel" /> -->
  </div>

</template>

<script>
// 三维页
// import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";
 
import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// 摇杆 
import JoystickLeftPanel from "/@/views/chat/joystickLeft.vue";
// import JoystickRightPanel from "/@/views/chat/joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";


// test
import AvatarData from "/@/data/playerSelectTest.js"; 

import Language from "/@/data/zh_cn.js";
 

export default {
  name: "index",
  components: {
    YJmetaBase,
    loadingPanel,
    JoystickLeftPanel,
    // JoystickRightPanel, 
  },
  data() {
    return {
      isInsertPanel: false,
      // 是否显示姓名条
      displayUserNameUI: false,

      //是否可交互的提示
      jiaohuTip: false,

      //房间名
      roomName: "",
      platform: "",
      selectPlayerName: "",
      playerImgPath: [],

      //角色同步数据
      user: {
        pos: [-100, -100, 0],
        rota: [0, 0, 0],
        rotateY: 1,
        animName: "idle",
        playerData: {},
        userData: {},
      },

      userName: "",
      userId: "",
      id: "",
      //姓名条
      hotPoint: [],

      pos: { x: -100, y: -100 },

      isMobile: false,

      playerDefaultX: 0,
      playerDefaultY: 0,


      language: null,
      isEn: false,
      avatarData: null,
      contrlState: 0,

      loadCompleted:false,
      
      windowWidth: 0,
      windowHeight: 0, 
      displayMinMap:true,

    };
  },

  created() {

    this.avatarData = AvatarData;
    this.displayMinMap =  !this.avatarData.setting.hasAerialView;

    this.language = Language.languageCN;
    // this.language = Language.languageEN;

    this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {

    this.$refs.YJmetaBase.ClickeSelectOK();
    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);


  },
  methods: {
    GetPublicUrl() {
      return this.$publicUrl ;
    }, 
    OpenThreejs() {
      this.inThreejs = true;
      this.$refs.YJmetaBase.OpenThreejs();

    },
  },
};
</script>

<style scoped>
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

/* 阻止长按复制 */
.stop-long-hover {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.max-w-1200 {
  max-width: 1200px;
}
</style>
