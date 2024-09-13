
<template>
  <div class="w-full h-full"> 
    <div
      tabindex="-1"
      id="contain"
      class="w-full h-full relative"
      ref="container"
    >
      <div v-if="hasStatsDrawcall" class="absolute top-3 right-3 text-white">
        <div>drawcall: {{ statsText.drawcall }}</div>
        <div>triangles: {{ statsText.triangles }}</div>
      </div>
    </div>

    <!-- 音频  hidden-->
    <div
      id="audioParent"
      class="w-1/2 h-1/2 absolute top-0 left-0 pointer-events-none"
    >
      <div
        v-for="(item, i) in audioList"
        :key="i"
        class="video-box w-40 h-40 p-5 rounded-full"
      >
        <audio
          autoplay="autoplay"
          loop
          muted
          :ref="item.id"
          v-if="item.value"
          class="w-full h-full"
          :src="$uploadAudioUrl + item.value"
        ></audio>
      </div>
    </div>

    <!-- 视频  hidden-->
    <div
      id="videoParent"
      class="w-1/2 h-1/2 hidden absolute top-0 left-0 pointer-events-none"
    >
      <div
        v-for="(item, i) in videoList"
        :key="i"
        class="video-box w-40 h-40 p-5 rounded-full"
      >
        <YJmedia :ref="item.id" :mediaType="item.type" :mediaId="item.id" />
        <!-- <div>{{ item.id }}</div> -->
      </div>
    </div>
  </div>
</template>

<script>
// 三维页 
import { YJThreejsBase } from "/@/threeJS/common/YJThreejsBase.js";

export default {
  name: "YJmetaBase",
  components: { 
  },
  data() {
    return { 
      hasStats: true,
      // hasStats: false,
      hasStatsDrawcall: true,
      statsText: {
        drawcall: 0,
        triangles: 0,
      },
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
      audioList: [],
      userName: "",
      userId: "",
      id: "",
      //姓名条
      hotPoint: [],

      pos: { x: -100, y: -100 },

      isMobile: true,

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

      ThreejsPanel: null,
      publicUrl: "",
      videoList: [],
    };
  },

  created() {
    this.sceneData = this.$parent.sceneData;
    this.publicUrl = this.$publicUrl + this.sceneData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {
    this.isMobile = _Global.isMobile;
    // this.ThreejsPanel = this.GetThreejsPanel();

    this.YJThreejsBase = new YJThreejsBase(this.$refs.container,document,this);

    this.windowWidth = 0;
    this.windowHeight = 0;

    // console.log(" 屏幕尺寸 ", window.innerWidth, window.innerHeight);

    // window.addEventListener('resize',this.UpdateCheckWindowResize,false);
    window.addEventListener("resize", this.onWindowResize);

    setTimeout(() => {
      _Global.addEventListener("是否启用虚拟摇杆", (b) => {
        this.isMobile = b;
        this.UpdateCheckWindowResize();
      });
      
      _Global.addEventListener("AddVideo",(id, type, callback)=>{
        this.AddVideo(id, type, callback);
      });
    }, 2000);

    setInterval(() => {
      this.UpdateCheckWindowResize();
    }, 20);

  },
  methods: {
    AddVideoListener() {
      _Global.YJ3D.renderer.domElement.addEventListener("touchstart", (e) => {
        this.PlayVideo();
      });
    },
    AddVideo(id, type, callback) {
      for (let i = 0; i < this.videoList.length; i++) {
        const element = this.videoList[i];
        if (element.id == id) {
          callback(this.$refs[id]);
          return;
        }
      }

      this.videoList.push({ id: id, type: type });
      setTimeout(() => {
        callback(this.$refs[id]);
      }, 200);
      console.log("this.$refs ", this.$refs);

      // return this.$refs[id];
    },
    PlayVideo() {
      this.touchTime++;
      if (this.touchTime >= 3) {
        return;
      }

      if (this.$parent.$parent.PlayBGAudio) {
        this.$parent.$parent.PlayBGAudio();
      }

      if (this.$parent.$parent.videoList != undefined) {
        let videoList = this.$parent.$parent.videoList;
        for (let i = 0; i < videoList.length; i++) {
          const element = videoList[i];
          const video = document.getElementById(element.videoId);
          video.setAttribute("crossorigin", "anonymous");
          video.loop = true;
          video.play();
        }
      }

      for (let i = 0; i < this.videoList.length; i++) {
        const element = this.videoList[i];
        const video = document.getElementById(element.id);
        video.setAttribute("crossorigin", "anonymous");
        video.loop = true;
        video.play();
      }
      console.log("播放视频", this.videoList.length);
    },

    PlayVideoFn(ignoreId) {
      for (let i = 0; i < this.videoList.length; i++) {
        const element = this.videoList[i];
        if (element.id != ignoreId) {
          const video = document.getElementById(element.id);
          video.setAttribute("crossorigin", "anonymous");

          video.play();
          console.log("激活播放视频", element.id);
        }
      }
    },

    PlayVideoById(id, loop) {
      const video = document.getElementById(id);
      video.setAttribute("crossorigin", "anonymous");
      video.loop = loop;
      video.play();
    },
    StopVideoById(id) {
      const video = document.getElementById(id);
      video.currentTime = 0;
      video.pause();
    },
    //  在场景加载完成后，为移动端单独创建监听触摸事件，触摸后播放视频。
    addEventForMobilePlayVideo() {
      window.addEventListener("touchstart", (e) => {
        this.PlayVideo();
      });
    },
    load3dComplete() {
      this.addEventForMobilePlayVideo();
    },
    Reload() {
      this.sceneData = this.$parent.sceneData;
      this.contrlState = this.sceneData.setting.contrlState;

      this.$parent.isMobile = this.isMobile;
      this.$parent.contrlState = this.contrlState;
      // 强制横屏
      this.onlyLandscape = this.sceneData.setting.onlyLandscape;

      this.publicUrl = this.$publicUrl + this.sceneData.setting.localPath; 
      
      if (!this.isMobile) {
        return;
      }
      this.YJThreejsBase.SetforcedLandscape(this.onlyLandscape);
    },
    UpdateCheckWindowResize() {
      // console.log(" resize 3d panel ",this.onlyLandscape,this.containerWidth, this.containerHeight);

      if (_Global.setting.inEditor) {
        this.containerWidth = this.$refs.container.clientWidth;
        this.containerHeight = this.$refs.container.clientHeight;
      } else {
        this.containerWidth = window.innerWidth;
        this.containerHeight = window.innerHeight;
        // this.containerWidth = this.$refs.container.clientWidth;
        // this.containerHeight = this.$refs.container.clientHeight;
      }

      if (_Global.YJ3D.YJRaycaster) {
        _Global.YJ3D.YJRaycaster.SetContainerSize(
          this.containerWidth,
          this.containerHeight
        );
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

      this.YJThreejsBase.SetforcedLandscape(forcedLandscape);
      this.YJThreejsBase.onWindowResize(w, h);

      if (!this.isMobile) {
        return;
      }

      if (this.contrlState == 0) {
        if (this.$parent.SetforcedLandscape) {
          this.$parent.SetforcedLandscape(forcedLandscape);
        }

        if (this.$parent.$refs.JoystickLeftPanel) {
          // _Global.CombatLog.log("改变窗口大小 111 "+ forcedLandscape+ "  "
          // + this.onlyLandscape + " windowWidth: "+ this.windowWidth + " windowHeight: " + this.windowHeight);

          // _Global.CombatLog.log("改变窗口大小 111 "+ forcedLandscape+ "  "
          // + this.onlyLandscape + " windowWidth: "+ w + " windowHeight: " + h);

          if (this.$parent.$refs.JoystickLeftPanel.SetforcedLandscape) {
            this.$parent.$refs.JoystickLeftPanel.SetforcedLandscape(
              forcedLandscape
            );
          }
          setTimeout(() => {
            this.$parent.$refs.JoystickLeftPanel.ResizeJoystick();
          }, 100);
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

    GetThreejsPanel() {
      return this.$refs.ThreejsPanel;
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
      // this.$refs.ThreejsPanel.YJController.SetNiaokanPos(
      //   niaokanData.niaokanCamPos,
      //   niaokanData.niaokanCamLookatPos
      // );
    },
    //#region
    //#endregion

    SetMinMap(sx, sy, ox, oy) {
      this.$parent.$refs.map2d.SetPlayerMapDefaultOffset(sx, sy, ox, oy);
      // this.$refs.map2d.SetPlayerMapDefaultOffset(sx, sy, ox, oy);
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
        
        this.YJThreejsBase.InitThreejs(this);
      } else {
        var userData = {
          userName: this.userName,
          roomName: this.roomName,
          platform: this.user.playerData.platform,
          modelType: this.user.playerData.name,
        };
        this.YJThreejsBase.InitThreejs(this, userData);
      }
    },

    ClickSelectPlayerOK(userData) {
      this.YJThreejsBase.InitThreejs(this, userData);
    },

    SetloadingPanel(loadingPanel) {
      this.loadingPanel = loadingPanel;
    },
    LoadingState(state) {
      this.loadingPanel.LoadingState(state); 
    },

    LoadState(state) {
      // console.log("当前加载状态 " + state);
      this.loadingPanel.LoadState(state); 
    },
    LoadingProcess(process) {
      this.loadingPanel.LoadingProcess(process); 
    },

    OpenThreejs() {
      _Global.YJ3D._YJSceneManager.BeginEnter();

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
        this.YJThreejsBase.SetPointerLock();
      }
    },
 
    //在输入聊天信息时，取消threejs的键盘监听。
    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      this.YJThreejsBase.removeEventListener();
    },
    addThreeJSfocus() {
      this.YJThreejsBase.threeJSfocus();
    },

    addAudio(id, url) {
      this.audioList.push({ id: id, value: url });
      // this.$nextTick(()=>{
      //   var audio = this.$refs[id];
      //   console.log(audio);
      //   audio.muted = true;
      //   // audio.loop = true;
      //   audio.play();
      // });
    },
    EventHandler(e) {
      if (e == "播放音乐") {
        // console.log(" 播放音效 ",this.audioList);

        for (let i = 0; i < this.audioList.length; i++) {
          const element = this.audioList[i];
          var audio = this.$refs[element.id];
          // console.log(audio);
          audio.muted = false;
          audio.volume = 0.2;
          audio.play();
        }
        return;
      }
      if (e == "暂停音乐") {
        for (let i = 0; i < this.audioList.length; i++) {
          const element = this.audioList[i];
          var audio = this.$refs[element.id];
          audio.muted = true;
          audio.pause();
        }
      }
    },
    //#region 用户音视频通话
    //用websocket 连接id 作为腾讯云音视频sdk的连接id
    // InitTRTC(userId) {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   //初始化sdk客户端
    //   this.$refs.txTRTC.Init(userId);
    // },
    // SetUserVideo(video) {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   _Global.YJ3D.YJPlayer.CreateVideo(video);
    // },
    // //接收到其他用户的音视频id
    // SetRemoteTRTCid(useId, id, video, audio) {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   //把音视频id添加到用户信息中
    //   this.$refs.ThreejsPanel.UpdatePlayerTRTC(useId, id, video, audio);
    // },
    // //当前客户端关闭音视频
    // CloseTRTC() {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   this.$refs.ThreejsPanel._YJDyncManager.CloseTRTC();
    // },
    // //客户端掉线时，关闭音视频
    // CallCloseTRTC() {
    //   if (!this.hasTRTC) {
    //     return;
    //   }
    //   this.$refs.txTRTC.leaveRoom();
    // },
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
