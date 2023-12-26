
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <div class=" w-full h-full " ref="container">
    <ThreejsHumanChat tabindex="-1" class="w-full h-full" ref="ThreejsHumanChat" id="ThreejsHumanChat" />
  </div>
</template>

<script>
// 三维页
import ThreejsHumanChat from "/@/threeJS/threeEditor.vue";

export default {
  name: "YJmetaBase",
  components: {
    ThreejsHumanChat,
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

      isEn: false,
      sceneData: null,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,

      containerWidth: 0,
      containerHeight: 0,

      loadingPanel: null,

      ThreejsHumanChat: null,
      publicUrl: "",
    };
  },

  created() {
    this.sceneData = this.$parent.sceneData;
    this.publicUrl = this.$publicUrl + this.sceneData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {
    this.CheckInMobile();

    this.ThreejsHumanChat = this.GetThreejsHumanChat();


    this.windowWidth = 0;
    this.windowHeight = 0;

    // console.log(" 屏幕尺寸 ", window.innerWidth, window.innerHeight);

    // window.addEventListener('resize',this.UpdateCheckWindowResize,false);
    window.addEventListener("resize", this.onWindowResize);


    setInterval(() => {
      this.UpdateCheckWindowResize();
    }, 20);
  },
  methods: {
    Reload() {
      this.sceneData = this.$parent.sceneData;
      this.contrlState = this.sceneData.setting.contrlState;

      this.$parent.isMobile = this.isMobile;
      this.$parent.contrlState = this.contrlState;
      // 强制横屏
      this.onlyLandscape = this.sceneData.setting.onlyLandscape;

      this.publicUrl = this.$publicUrl + this.sceneData.setting.localPath;
      this.$refs.ThreejsHumanChat.SetforcedLandscape(this.onlyLandscape);
    },
    UpdateCheckWindowResize() {

      if (this.$refs.container && !this.isMobile) {
        this.containerWidth = this.$refs.container.clientWidth;
        this.containerHeight = this.$refs.container.clientHeight;
      } else {
        this.containerWidth = window.innerWidth;
        this.containerHeight = window.innerHeight;
      }

      if (this.ThreejsHumanChat.YJRaycaster) {
        this.ThreejsHumanChat.YJRaycaster.SetContainerSize(this.containerWidth, this.containerHeight);
      }

      if (
        this.windowWidth == this.containerWidth &&
        this.windowHeight == this.containerHeight
      ) {
      } else {
        this.windowWidth = this.containerWidth;
        this.windowHeight = this.containerHeight;
        if (this.onlyLandscape) {
          if (this.windowWidth <= this.windowHeight) {
            this.onWindowResizeFn(this.windowHeight, this.windowWidth, true);
            return;
          }
          this.onWindowResizeFn(this.windowWidth, this.windowHeight, false);
        } else {
          this.onWindowResizeFn(this.windowWidth, this.windowHeight, false);
        }
      }
    },

    ForcedUpdateSize() {
      this.windowWidth = 0;
      this.windowHeight = 0;
      this.UpdateCheckWindowResize();
    },
    onWindowResize() {
      if (this.$parent.setPanelSize) {
        this.$parent.setPanelSize();
      }
    },
    // 浏览器窗口变动触发的方法
    onWindowResizeFn(w, h, forcedLandscape) {
      // console.log("改变窗口大小 111 ", forcedLandscape);

      this.$refs.ThreejsHumanChat.SetforcedLandscape(forcedLandscape);
      this.$refs.ThreejsHumanChat.onWindowResize(w, h);

      if (!this.isMobile) {
        return;
      }
      if (this.isMobile && this.contrlState == 0) {
        if (this.$parent.SetforcedLandscape) {
          this.$parent.SetforcedLandscape(forcedLandscape);
        }

        if (this.$parent.$refs.JoystickLeftPanel) {
          if (this.$parent.$refs.JoystickLeftPanel.SetforcedLandscape) {
            this.$parent.$refs.JoystickLeftPanel.SetforcedLandscape(
              forcedLandscape
            );
          }
          this.$parent.$refs.JoystickLeftPanel.ResizeJoystick();
        }

        if (this.$parent.$refs.JoystickRightPanel) {
          if (this.$parent.$refs.JoystickRightPanel.SetforcedLandscape) {
            this.$parent.$refs.JoystickRightPanel.SetforcedLandscape(
              forcedLandscape
            );
          }
          this.$parent.$refs.JoystickRightPanel.ResizeJoystick();
        }
      }
    },

    GetThreejsHumanChat() {
      return this.$refs.ThreejsHumanChat;
    },
    // 判断是否在移动端
    CheckInMobile() {
      var UserClient = navigator.userAgent.toLowerCase();
      console.log(" 判断是否移动端 ", UserClient);
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
      return this.publicUrl;
    },

    GetModelUrl() {
      return this.$parent.GetModelUrl();
    },

    GetSceneTexPath() {
      //获取场景scene.txt 文本路径
      if (this.$parent.GetSceneTexPath) {
        return this.$parent.GetSceneTexPath();
      }
      return this.sceneData.sceneTexPath;
    },

    GetPublicModelUrl() {
      return this.$parent.GetPublicModelUrl();
    },
    GetAvatarData(playerName) {
      return this.$parent.GetAvatarData(playerName);
    },
    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.sceneData.minMapData;
      return minMapData;
    },
    // 用鸟瞰参数设置鸟瞰的坐标
    GetNiaokanData() {
      // let niaokanData = this.sceneData.aerialViewData;
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
      this.$parent.$refs.map2d.SetPlayerMapDefaultOffset(sx, sy, ox, oy);
      // this.$refs.map2d.SetPlayerMapDefaultOffset(sx, sy, ox, oy);
      return;
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
      if (this.user.playerData == undefined) {
        this.$refs.ThreejsHumanChat.InitThreejs(this);
      } else {
        var userData = {
          userName: this.userName,
          roomName: this.roomName,
          platform: this.user.playerData.platform,
          modelType: this.user.playerData.name,
        };
        this.$refs.ThreejsHumanChat.InitThreejs(this, userData);
      }
    },

    ClickSelectPlayerOK(userData) {
      this.$refs.ThreejsHumanChat.InitThreejs(this, userData);
    },

    SetloadingPanel(loadingPanel) {
      this.loadingPanel = loadingPanel;
    },
    LoadingState(state) {
      this.loadingPanel.LoadingState(state);
      // this.$refs.loadingPanel.LoadingState(state);
    },

    LoadState(state) {
      // console.log("当前加载状态 " + state);
      this.loadingPanel.LoadState(state);
      // this.$refs.loadingPanel.LoadState(state);
    },
    LoadingProcess(process) {
      this.loadingPanel.LoadingProcess(process);
      // this.$refs.loadingPanel.LoadingProcess(process);
    },

    OpenThreejs() {
      this.$refs.ThreejsHumanChat._YJSceneManager.BeginEnter();

      // 改变鼠标光标图标
      let cursorUrl = this.sceneData.setting.cursorUrl;
      if (cursorUrl != "") {
        document.body.style.cursor =
          "url(" + this.publicUrl + cursorUrl + "),auto"; //显示手型光标
      }

      if (
        this.sceneData.setting.InfinityMouse != undefined &&
        this.sceneData.setting.InfinityMouse
      ) {
        this.$refs.ThreejsHumanChat.SetPointerLock();
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

    //#region 用户音视频通话
    //用websocket 连接id 作为腾讯云音视频sdk的连接id
    InitTRTC(userId) {
      if (!this.hasTRTC) {
        return;
      }
      //初始化sdk客户端
      this.$refs.txTRTC.Init(userId);
    },
    SetUserVideo(video) {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.ThreejsHumanChat.YJPlayer.CreateVideo(video);
    },
    //接收到其他用户的音视频id
    SetRemoteTRTCid(useId, id, video, audio) {
      if (!this.hasTRTC) {
        return;
      }
      //把音视频id添加到用户信息中
      this.$refs.ThreejsHumanChat.UpdatePlayerTRTC(useId, id, video, audio);
    },
    //当前客户端关闭音视频
    CloseTRTC() {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.ThreejsHumanChat._YJDyncManager.CloseTRTC();
    },
    //客户端掉线时，关闭音视频
    CallCloseTRTC() {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.txTRTC.leaveRoom();
    },
    //#endregion
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
