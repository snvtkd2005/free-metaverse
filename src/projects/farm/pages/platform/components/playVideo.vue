

<!-- // 播放直播流 -->
<template>
  <!--   v-bind="options" -->
  <!-- :src="video_url" 
      :poster="poster" -->
      <div>

  <div class="vue3VideoPlayPanel w-full h-full bg-opacity-95 bg-black" ref="vue3VideoPlayPanel"
    style="z-index: 10000">
    <vue3VideoPlay :id="videoId" class="   " ref="videoPlayer" x5-video-orientation="landscape" v-bind="options"
      :src="video_url" :type="type" :controls="false" @play="onPlay" @error="onError" v-show="!errShow" />
    <!-- <div class="fullPicture" v-show="errShow" style="z-index: 10000">
      <img
        :src="picUrl"
        alt=""
        class="fullpic"
        style="transform: rotate(90deg)"
      />
    </div> -->
  </div>
  <div class="absolute" ref="backBtn" v-show="isVisible" @click="clickBack" style="
      position: absolute;
      color: white;
      height: 2.5rem;
      text-align: center;
      line-height: 2.5rem;
      top: 4rem;
      z-index: 10001;
      right: 0rem;
      border-radius: 25px;
      font-size: 1.2rem;
      padding: 0px 1.4rem;
      background-color: rgb(54 53 58 / 50%);
      transform: rotate(90deg);
    ">
    取消全屏
  </div>
</div>

</template>

<script>
// 播放器-导入组件（在要用组件的页面导入组件,并声明）
// import "vue3-video-play/dist/style.css";
import vue3VideoPlay from "vue3-video-play";
/**
 * <!-- 1， -->
<!-- npm 安装插件 -->
<!-- npm i vue3-video-play -S    -->
<!-- 更新vue到3.2.4
npm install vue@3.2.4   -->
 */
export default {
  components: {
    vue3VideoPlay,
  },
  props: ["poster", "videoId"],
  data() {
    return {
      // video_url: "./public/meeting/videos/movieSD.mp4",
      // video_url:"https://o.cztvcloud.com/cms_upload/cms_1681112337_bB33JTwhhp.mp4",
      isPlay: true,
      video_url: "",
      picUrl:
        "./public/meeting/models/skin0510/default_cloths/male_boy_hair.png",
      type: "video/mp4",
      // type:"m3u8",
      //视频
      options: {
        width: "400px", //播放器高度
        height: "225px", //播放器高度
        color: "#409eff", //主题色
        title: "sss", //视频名称
        // poster: './public/newsMeta/farm1.png',
        // src: props.video_url, //视频源
        // src: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4",//视频url地址
        // src: "./public/newsMeta/videos/movieSD.mp4",//视频url地址
        // type:'video/mp4',
        src: "http://play-qukan.cztv.com/live/1681283679901088.m3u8",
        // src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", //视频url地址
        // src: "http://219.151.31.38/liveplay-kk.rtxapp.com/live/program/live/hnwshd/4000000/mnf.m3u8",//视频url地址
        type: "m3u8",

        live: true,
        // src: "rtmp://mobliestream.c3tv.com:554/live/goodtv.sdp",//视频url地址
        // type:'rtmp/mp4',

        // src: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",//视频url地址
        // src: "http://tv.cctv.com/live/",//视频url地址
        // type:'rtsp/mp4',

        muted: true, //静音
        webFullScreen: true,
        speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
        autoPlay: true, //自动播放
        loop: true, //循环播放
        mirror: false, //镜像画面
        ligthOff: true, //关灯模式
        volume: 0.5, //默认音量大小
        control: false, //是否显示控制
        controlBtns: [
          "audioTrack",
          // "quality",
          "speedRate",
          "volume",
          // "setting",
          // "pip",
          // "pageFullScreen",
          // "fullScreen",
        ], //显示所有按钮,
      },
      // poster: './public/newsMeta/farm1.png',
      // poster: props.poster,
      // video_url: props.video_url,
      // type: props.type,
      // video_url: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4",//视频url地址
      // video_url: "./public/newsMeta/videos/movieSD.mp4",//视频url地址

      vue3VideoPlayPanel: null,
      _video: null,
      isVisible: false,
      interTime: 0,
      errShow: false,
      reloadTimes: 0,
      seekTime: 0,
      callByFull:false,
    };
  },
  watch: {
    // isPlay(v) {
    //   if (!v) {
    //     this._timer = setInterval(() => {
    //       if (this.isPlay) {
    //         clearInterval(this._timer);
    //       }
    //       if (!this.isPlay && this.$refs.videoPlayer &&this.$parent.isAllowFullScreen) {
    //         this.play();
    //         // _Global.SetVideoMutedByid(false, 12);
    //       }
    //     }, 1000)
    //   }
    // }
  },
  mounted() {
    // console.log("videoPlayer ", this.$refs.videoPlayer);
    // this.vue3VideoPlayPanel = document.getElementById("vue3VideoPlayPanel");
    this.vue3VideoPlayPanel = this.$refs.vue3VideoPlayPanel;
    this.vue3VideoPlayPanel.style.display = "none";
    // document.getElementById("refPlayerWrap").style.zIndex = 99;

    this._video = document.getElementById(this.videoId);

    console.error("初始化视频播放", this.videoId, this._video);

    this._video.setAttribute("crossorigin", "anonymous");
    this._video.muted = true;
    //       window.addEventListener("click",()=>{
    //     if(this.interTime<1){
    //       console.log(111);
    //       this.interTime++
    //       this.SetVideoMuted(false)
    //     }
    // })
    if (this.options.autoPlay == "true") this.isVisible = true;
  },
  // unmounted() {
  //   clearInterval(this._timer);
  //   this.destroy();
  // },
  methods: {
    // getVideoBaseUrl() {
    //   this.picUrl = _Global.GetTexiaoData.VideoBasePicture;
    // },
    // cancelPic() {
    //   console.log("cancel");
    //   // this.isShowPic = false;
    //   // this.$parent.isShowBtn = true;
    //   // _Global.setEnableRenderer(true);
    // },
    SetVideoFullScreen() {
      if (_Global.inFocus != undefined) {
        if (!_Global.inFocus) {
          // 记录当前视频的播放进度
          this.callByFull = true;
          this.seekTime = this._video.currentTime;
          console.log(" 记录当前视频的播放进度 ", this.seekTime);
          this.PlayVideoStream(this.video_url, false);
          _Global.inFocus = true;
        }
      }
      //坐到座位上后，全屏播放视频
      this.SetFullScreen(true);
      this.SetVideoMutedState(false);
      this.play();
    },
    // 全屏，显示播放窗口元素
    SetFullScreen(b) {
      if (b == undefined) {
        b = true;
      }
      this.isVisible = b;

      this.vue3VideoPlayPanel.style.display = b ? "" : "none";
    },
    // window.open = this.open,
    clickBack() {
      this.SetFullScreen(false);
      // _Global.setEnableRenderer(true);
      this.$refs.videoPlayer.play();
      if (_Global.sceneName == "Scene2") {
        // this.$refs.videoPlayer.volume = 0;
        // this._video.volume = 0;
        setTimeout(() => {
          this.SetVideoMuted(true);
        }, 1000);
      }
      this.isVisible = false;
      // this.errShow = false;
      _Global.CallFullScreen();
    },
    play() {
      // _video.play();
      // this.$refs.videoPlayer.muted = false;
      // this.$refs.videoPlayer.volume = 0.5;
      this.$refs.videoPlayer.play();
      this.errShow = false;

      // this._video.volume = 0.5;

      // console.log("设置 直播视频音量 ");
    },
    pause() {
      console.error("视频暂停");

      this._video.muted = true;
      this.$refs.videoPlayer.muted = true;
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause();
      }
      this._video.pause();
      this.isPlay = false;
      this.SetFullScreen(false);
    },

    stop() {
      this.pause();

      this.video_url = "";
      this._video.load();
    },
    reload() {
      console.log("重新加载");

      this.reloadTimes++;
      if (this.reloadTimes >= 5) {
        return;
      }

      // 主屏幕才取消静音播放
      if (
        this.videoId == "dPlayerVideoMain_IOS" ||
        this.videoId == "dPlayerVideoMain3" ||
        this.videoId == "dPlayerVideoMain9" ||
        this.videoId == "dPlayerVideoMain12"
      ) {
        this.PlayVideoStream(this.video_url, false || _Global.videoMutedState);
      } else {
        this.PlayVideoStream(this.video_url, true);
      }
      // if (this.reloadTimes > 2) {
      //   this.picUrl = _Global.GetTexiaoData.VideoBasePicture;
      //   if (this.picUrl != "") {
      //     this.errShow = true;
      //   }
      // }
    },
    PlayVideoStream(url, isMuted) {
      if (url == null || url == undefined || url == "") {
        return;
      }
      this.video_url = url;
      if (url.includes("mp4")) {
        this.type = "video/mp4";
      }
      if (url.includes("m3u8")) {
        this.type = "m3u8";
      }
      // this.video_url = '';

      this.pause();

      if (isMuted != undefined) {
        setTimeout(() => {
          this.SetVideoMutedState(isMuted);
        }, 200);
        setTimeout(() => {
          this.play();
        }, 1000);
      }

      // this._video.setAttribute("crossorigin", "anonymous");
      this._video.load(); // 更改src后一定要用load
      this.isShowCloseFullBtn = true;
    },

    SetVideoMutedState(b) {
      if (_Global.userTouched) {
      } else {
        b = true;
      }
      if (
        this.videoId.includes("3") ||
        this.videoId.includes("9") ||
        this.videoId.includes("12")
      ) {
        b = b || _Global.videoMutedState;
      }
      this._video.muted = b;
      this.$refs.videoPlayer.muted = b;
    },
    SetVideoMuted(b) {
      this.SetVideoMutedState(b);
      console.error("设置是否静音播放", b);

      setTimeout(() => {
        this.play();
      }, 1000);
      // this.$refs.videoPlayer.play();
      // this._video.play();
    },
    onPlay(e) {
      this.isPlay = true;
      this.reloadTimes = 0;
      // this.errShow = false;

      if (this.type == "video/mp4" && this.callByFull) {
        this._video.currentTime = this.seekTime;
        this.callByFull = false;
        console.log("设置进度");
      }
    },
    onError(e) {
      this.isPlay = false;
      if (e != undefined) {
        // if(e){
        console.error("报错", e);

        // if (this.video_url.includes("m3u8")) {
        // }
        this.reload();
      }
      // alert("报错");
      // this.play();
    },
  },
};
</script>

<style>
.z-100 {
  z-index: 100;
}

.video-js.vjs-fluid {
  height: 100%;
}

.vjs-tech {
  object-fit: cover;
}

.dark_cover {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

.fullPicture {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
}

.fullpic {
  width: 23rem;
  height: 23rem;
  object-fit: cover;
}

/*竖屏*/
@media screen and (orientation: portrait) {
  .d-player-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
  }

  .d-player-video video {
    transform: rotate(90deg);
    height: 100vw;
    width: auto !important;
    max-width: none;
    -o-object-fit: cover;
    object-fit: cover;
  }

  .d-player-wrap {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100% !important;
    height: 100% !important;
  }

  .d-player-video {
    width: 100% !important;
    height: 100% !important;
  }
}

/* 横屏情况 */
@media screen and (orientation: landscape) {
  .vue3VideoPlayPanel {
    position: absolute;
    /* width: 100vh;
  height: 100vw; */
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .d-player-wrap {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100% !important;
    height: 100% !important;
  }

  .d-player-video {
    width: 100% !important;
    height: 100% !important;
  }

  .d-player-video-main {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
