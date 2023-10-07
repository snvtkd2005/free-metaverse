
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <!-- <ThreejsHumanChat id="ThreejsHumanChat" tabindex="-1" class="absolute left-0 top-0" ref="ThreejsHumanChat" /> -->
  
  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

  <!-- 加载loading -->
  <loadingPanel class="absolute z-50 bg-black left-0 top-0 pointer-events-none " ref="loadingPanel" />
 

  <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
  <div v-if="isMobile && contrlState == 0">
    <!-- <JoystickLeftPanel class="  " ref="JoystickLeftPanel" /> -->
    <!-- <JoystickRightPanel class="  " ref="JoystickRightPanel" /> -->
  </div>

    <!-- 视频  hidden-->
  <div id="videoParent" class=" hidden  w-1/2 h-1/2 absolute top-0 left-0 pointer-events-none">
    <div v-for="(item, i) in videoList" :key="i" class="video-box w-40 h-40 p-5 rounded-full">
      <div :class="
        item
          ? 'distant-stream w-full h-full  rounded-full'
          : '  w-full h-full  rounded-full'
      " v-html="item.html"></div>
      <div>{{ item.id }}</div>
    </div>
  </div>

</template>

<script>
// 三维页
// import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";
 
import YJmetaBase from "/@/views/chat/YJmetaBase.vue";

// 摇杆 
import JoystickLeftPanel from "./joystickLeft.vue";
// import JoystickRightPanel from "/@/views/chat/joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";

import AvatarData from "./data/sceneSetting.js"; 

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
      videoList: [],
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

    var userData = {
        userName: "userName",
        roomName: this.avatarData.roomName,
        platform: this.avatarData.platform,
        modelType: this.avatarData.defaultUser.avatarName,
      };

    this.$refs.YJmetaBase.ClickSelectPlayerOK(userData);
    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);
 
  },
  methods: {
    
    AddVideo(id,html){
      this.videoList.push({ id: id, html: html});
    },
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
