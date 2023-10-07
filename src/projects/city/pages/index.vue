
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <ThreejsHumanChat
    tabindex="-1"
    class="absolute left-0 top-0"
    ref="ThreejsHumanChat"
    id="ThreejsHumanChat"
  />

  <!-- 加载loading -->
  <loadingPanel
    class="absolute z-50 left-0 top-0 w-full h-full"
    ref="loadingPanel"
  />

  <!-- 小地图透明按钮 -->
  <div
    v-if="avatarData.setting.hasMinMap"
    class="absolute z-20 left-0 bottom-8 w-full pointer-events-none"
  >
    <div
      class="mx-auto w-60 h-36 bg-transparent pointer-events-auto"
      @click="ClickNiaokan()"
    ></div>
  </div>


  <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
  <div v-if="isMobile && contrlState == 0">
    <JoystickLeftPanel class="" ref="JoystickLeftPanel" />
    <!-- <JoystickRightPanel class="  " ref="JoystickRightPanel" /> -->
  </div>

  <cityInsetPanel
    class="absolute z-50 w-full h-full left-0 top-0"
    ref="insetPanel"
    v-if="isInsertPanel"
  />
  <!-- <cityInsetPanel class=" absolute  z-50 w-full h-full left-0 top-0 " ref="insetPanel"  /> -->

  <GeoGraph class="absolute z-0 left-0 bottom-0 w-full h-full" />
  <!-- <FootTips  class=" hidden md:flex absolute z-40 left-0 bottom-0" /> -->
  <FootTips v-if="inThreejs" class=" " />
  <minMapEditor />

  <audio ref="bgmAudio" :src="this.$publicUrl + bgmUrl"></audio>
</template>

<script>
// 三维页
import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";

import { nextTick } from "@vue/runtime-core";
import minMapEditor from "./minMapEditor.vue";

// 摇杆
import JoystickLeftPanel from "./joystickLeft.vue";
// import JoystickRightPanel from "/@/views/chat/joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel_city.vue";

// city
import AvatarData from "../data/sceneSetting.js";

import Language from "/@/data/zh_cn.js";

import GeoGraph from "../components/GeoGraph.vue";

import cityInsetPanel from "./showDialog.vue";

import FootTips from "./FootTips.vue";

export default {
  name: "index",
  components: {
    ThreejsHumanChat,
    minMapEditor,
    loadingPanel,
    JoystickLeftPanel,
    // JoystickRightPanel,

    cityInsetPanel,
    GeoGraph,
    FootTips,
  },
  data() {
    return {
      inThreejs:false,
      bgmUrl:"",
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
      
      windowWidth: 0,
      windowHeight: 0, 
    };
  },

  created() {
    this.avatarData = AvatarData;

    // console.log(Language);
    this.language = Language.languageCN;
    // this.language = Language.languageEN;

    this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;
    this.roomName = this.avatarData.roomName;
    this.selectPlayerName = this.avatarData.defaultUser.avatarName;
    this.contrlState = this.avatarData.setting.contrlState;


    if(this.avatarData.setting.hasBGM){
      this.bgmUrl = this.avatarData.setting.BGMurl;
    } 

    document.title = this.avatarData.setting.title;

    //跳过角色选择，直接加载场景
    this.ClickeSelectOK();

    this.CheckInMobile();
    if (this.isMobile) {
      this.InitJoytick();
    }

    this.LoadPlayerPosList();
    
    
    // let that = this;
    // window.onfocus = function () {
    //   if (
    //     that.avatarData.setting.hasBGM 
    //   ) {
 
    //     that.$refs.bgmAudio.play();
    //   }
    // };
    // window.onblur = function () {
    //   if (
    //     that.avatarData.setting.hasBGM 
    //   ) {        
    //     that.$refs.bgmAudio.pause();
    //   }
    // };

    
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    setInterval(() => {
      this.UpdateCheckWindowResize();
    }, 20);
  },
  methods: {
    
    UpdateCheckWindowResize() {
      if (this.windowWidth == window.innerWidth && this.windowHeight == window.innerHeight) {

      } else {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.onWindowResize();
      }
    },
    // 浏览器窗口变动触发的方法
    onWindowResize() {
      this.$refs.ThreejsHumanChat.onWindowResize(this.windowWidth, this.windowHeight);

      if (!this.isMobile) {
        return;
      }
      if (this.isMobile && this.contrlState == 0) {
        this.$refs.JoystickLeftPanel.ResizeJoystick();
      }
    }, 
    ChangePlayerPos(pointName) {
      // console.log(" 切换玩家位置 "+pointName);
      for (let i = 0; i < this.playerPosList.length; i++) {
        const item = this.playerPosList[i];
        if (item.name == pointName) {
          this.$refs.ThreejsHumanChat._YJSceneManager.SetPlayerPosRota(
            item.pos,
            item.rotaV3
          );
          return;
        }
      }
    },

    CreateHotContent(){
      this.isInsertPanel = true;
    },
    ClickHotPointOwner(hitObject) {
      this.isInsertPanel = true;
      let hotPointData = hitObject.owner.GetHotPointData();
      if(hotPointData==null){return;}
      // console.log(" hotpointdata  ",hotPointData);
      if(hotPointData.type){
        if(hotPointData.type == "设置角色位置"){

          this.$refs.ThreejsHumanChat._YJSceneManager.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );
          //视角拉近
          this.$refs.ThreejsHumanChat.YJController.ChangeToPersonView();
          // this.$refs.ThreejsHumanChat.YJController.ChangeCameraToFar();
          this.viewFarIndex = 1;
        }
      }

    },
    async LoadPlayerPosList() {
      // 读取配置中的场景数据 scene.txt
      const res = await this.$axios.get(
        this.$publicUrl + this.avatarData.playerPosPath
      );
      this.playerPosList = res.data.hotPointDataList;
      // console.log(this.playerPosList);
    },
    // 判断是否在移动端
    CheckInMobile() {
      var UserClient = navigator.userAgent.toLowerCase();
      // console.log(" 判断是否移动端 ", UserClient);
      var IsIPad = UserClient.indexOf("ipad") > -1;
      var IsIphoneOs = UserClient.indexOf("iphone") > -1;
      var IsMidp = UserClient.indexOf("midp") > -1;
      var IsUc7 = UserClient.indexOf("rv:1.2.3.4") > -1;
      var IsUc = UserClient.indexOf("ucweb") > -1;
      var IsAndroid = UserClient.indexOf("android") > -1;
      var IsCE = UserClient.indexOf("windows ce") > -1;
      var IsWM = UserClient.indexOf("windows mobile") > -1;
      var IsM = UserClient.indexOf("mobile") > -1;
      // console.log(IsIPad,IsIphoneOs,IsMidp,IsUc7,IsUc,IsAndroid,IsCE,IsWM,IsM,);
      if (
        IsIPad ||
        IsIphoneOs ||
        IsMidp ||
        IsUc7 ||
        IsUc ||
        IsAndroid ||
        IsCE ||
        IsM ||
        IsWM
      ) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
      //*/
    },
    GetPublicUrl() {
      return this.$publicUrl;
    },
    GetAvatarData(playerName) {
      for (let i = 0; i < this.avatarData.avatarData.length; i++) {
        if (this.avatarData.avatarData[i].name == playerName) {
          return this.avatarData.avatarData[i];
        }
      }
      return null;
    },
    //获取场景scene.txt 文本路径
    GetSceneTexPath() {
      return this.avatarData.sceneTexPath;
    },
    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.avatarData.minMapData;
      return minMapData;
    },
    // 用鸟瞰参数设置鸟瞰的坐标
    GetNiaokanData() {
      if(this.avatarData.setting.inMinMapEditor){return;}
      let niaokanData = this.avatarData.aerialViewData;
      this.$refs.ThreejsHumanChat.YJController.SetNiaokanPos(
        niaokanData.niaokanCamPos,
        niaokanData.niaokanCamLookatPos
      );
    },
    //#region
    //#endregion
    ClickNiaokan() {
      this.$refs.ThreejsHumanChat.YJController.ResetToNiaokanView();
    },

    SetMinMap(sx, sy, ox, oy) {
      this.$refs.ThreejsHumanChat._YJSceneManager.SetMinMap(sx, sy, ox, oy);
    },
    SetCamPos(x, y, z, lx, ly, lz) {
      this.$refs.ThreejsHumanChat.YJController.SetCamNiaokanPos(
        x,
        y,
        z,
        lx,
        ly,
        lz
      );
    },
    //#region 虚拟摇杆

    InitJoytick() {
      // console.log("正在移动端设备运行 ");
      var that = this;
      // document
      //   .getElementById("jumpBtn")
      //   .addEventListener("touchstart", function () {
      //     that.ClickJump();
      //   });
    },

    //#endregion

    //threejs页面传入，碰到交互物体时显示提示文字
    ChangeTip(b) {
      this.jiaohuTip = b;
    },
    ClickeSelectOK() {
      this.user.playerData = this.playerImgPath[0];
      for (let i = 0; i < this.playerImgPath.length; i++) {
        if (this.selectPlayerName == this.playerImgPath[i].name) {
          this.user.playerData = this.playerImgPath[i];
          continue;
        }
      }

      var userData = {
        userName: this.userName,
        roomName: this.roomName,
        platform: this.user.playerData.platform,
        modelType: this.user.playerData.name,
      };
      this.$refs.ThreejsHumanChat.InitThreejs(this, userData);


    },

    LoadingState(state) {
      this.$refs.loadingPanel.LoadingState(state);
    },

    LoadState(state) {
      this.$refs.loadingPanel.LoadState(state);
    },
    LoadingProcess(process) {
      this.$refs.loadingPanel.LoadingProcess(process);
    },

    SetbgmPlay(b){
      if(b){
        this.$refs.bgmAudio.play();
      }else{
        this.$refs.bgmAudio.pause();
      }
    },
    OpenThreejs() {
      if( this.avatarData.setting.hasBGM){
      this.$refs.bgmAudio.play();
      } 
      this.inThreejs = true;

      this.$refs.ThreejsHumanChat._YJSceneManager.BeginEnter();

      // 改变鼠标光标图标
      let cursorUrl = this.avatarData.setting.cursorUrl;
      if (cursorUrl != "") {
        document.body.style.cursor =
          "url(" + this.$publicUrl + cursorUrl + "),auto"; //显示手型光标
      }
    },

    // 移动端点击跳跃按钮
    ClickJump() {
      this.$refs.ThreejsHumanChat.ClickJump();
    },
    //点击按钮 交互门
    ClickInteractive() {
      this.$refs.ThreejsHumanChat.ClickInteractive();
    },

    //在输入聊天信息时，取消threejs的键盘监听。
    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      this.$refs.ThreejsHumanChat.removeEventListener();
    },
    addThreeJSfocus() {
      this.$refs.ThreejsHumanChat.threeJSfocus();
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
