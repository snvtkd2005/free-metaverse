
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <ThreejsHumanChat id="ThreejsHumanChat" tabindex="-1" class="absolute left-0 top-0" ref="ThreejsHumanChat" />

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
import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";


// 摇杆 
import JoystickLeftPanel from "/@/views/chat/joystickLeft.vue";
// import JoystickRightPanel from "/@/views/chat/joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel.vue";


// revelya
import AvatarData from "/@/data/playerSelectMOT.js";

import Language from "/@/data/zh_cn.js";


import { GetDateH } from "/@/utils/utils.js";

export default {
  name: "index",
  components: {
    ThreejsHumanChat,
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

      loadCompleted: false,
      
      windowWidth: 0,
      windowHeight: 0, 
    };
  },

  created() {

    this.avatarData = AvatarData;

    this.language = Language.languageCN;
    // this.language = Language.languageEN;

    // this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;
    this.roomName = this.avatarData.roomName;
    this.selectPlayerName = this.avatarData.defaultUser.avatarName;
    this.contrlState = this.avatarData.setting.contrlState;

    document.title = this.avatarData.setting.title;


    //跳过角色选择，直接加载场景
    this.ClickeSelectOK();

    this.CheckInMobile();
    if (this.isMobile) {
      this.InitJoytick();
    }

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    // this.windowWidth_old = window.innerWidth;
    // this.windowHeight_old = window.innerHeight;

    // window.onresize = this.onWindowResize;
    // document.body.onresize = this.onWindowResize;

    // window.addEventListener("resize", this.onWindowResize);

    // var that = this;
    setInterval(() => {
      this.UpdateCheckWindowResize();
    }, 20);
  },
  methods: {
    UpdateCheckWindowResize() {
      if (this.windowWidth == window.innerWidth && this.windowHeight == window.innerHeight) {

      } else {
        this.onWindowResize();
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
      }
    },
    // 浏览器窗口变动触发的方法
    onWindowResize() {
      this.$refs.ThreejsHumanChat.onWindowResize();

      if (!this.isMobile) {
        return;
      }
      if (this.isMobile && this.contrlState == 0) {
        this.$refs.JoystickLeftPanel.ResizeJoystick();
      }
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
      // this.$publicUrl += this.avatarData.setting.localPath;
      return this.$publicUrl + this.avatarData.setting.localPath;
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
      // let niaokanData = this.avatarData.aerialViewData;
      // this.$refs.ThreejsHumanChat.YJController.SetNiaokanPos(
      //   niaokanData.niaokanCamPos,
      //   niaokanData.niaokanCamLookatPos
      // );
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
      this.loadCompleted = process == 100;
      this.$refs.loadingPanel.LoadingProcess(process);
    },

    OpenThreejs() {
      this.$refs.ThreejsHumanChat._YJSceneManager.BeginEnter();

      if (this.avatarData.setting.InfinityMouse != undefined && this.avatarData.setting.InfinityMouse) {
        this.$refs.ThreejsHumanChat.SetPointerLock();
      }



      // 改变鼠标光标图标
      let cursorUrl = this.avatarData.setting.cursorUrl;
      if (cursorUrl != "") {
        document.body.style.cursor =
          "url(" + this.GetPublicUrl() + cursorUrl + "),auto"; //显示手型光标
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
