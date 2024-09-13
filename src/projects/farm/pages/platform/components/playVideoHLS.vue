<!-- // 播放HLS  m3u8直播流 -->
<template>
  <div>

  <div class="vue3VideoPlayPanel w-full h-full bg-black" ref="vue3VideoPlayPanel">
    <div class="d-player-wrap">
      <div class="d-player-video">
        <video :id="videoId" class="w-full h-full" v-show="!errShow" ref="videoPlayer" crossorigin="anonymous" muted
          :controls="false" playsinline></video>
      </div>
    </div>
    <div class="fullPicture" v-show="errShow" style="z-index: 10000">
      <!-- 全屏图片 -->
      <img :src="picUrl" alt="" class="fullpic" style="transform: rotate(90deg)" />
    </div>
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
// import Hls from "hls.js";
export default {
  props: ["poster", "videoId"],

  components: {},

  data() {
    return {
      // video_url: "./public//videos/movieSD.mp4",
      video_url: "",
      type: "video/mp4",
      muted: true,
      errShow: false,
      //视频
      options: {
        width: "800px", //播放器高度
        height: "450px", //播放器高度
        color: "#409eff", //主题色
        title: "sss", //视频名称
        // poster: './public/newsMeta/farm1.png',
        // src: props.video_url, //视频源
        // src: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4",//视频url地址
        // src: "./public/newsMeta/videos/movieSD.mp4",//视频url地址
        // type:'video/mp4',

        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", //视频url地址
        // src: "http://39.134.115.163:8080/PLTV/88888910/224/3221225636/index.m3u8",//视频url地址
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
        autoPlay: false, //自动播放
        loop: true, //循环播放
        mirror: false, //镜像画面
        ligthOff: true, //关灯模式
        volume: 0.5, //默认音量大小
        control: false, //是否显示控制
        controlBtns: [
          // "audioTrack",
          "quality",
          "speedRate",
          "volume",
          "setting",
          "pip",
          "pageFullScreen",
          "fullScreen",
        ], //显示所有按钮,
      },
      videoPlayer: null,
      _video: null,

      isVisible: false,
      hls: null,
      oldUrl: "",
      inVideoFullScreen: false,
      reloadTimes: 0,
    };
  },
  mounted() {
    this.vue3VideoPlayPanel = this.$refs.vue3VideoPlayPanel;
    this.vue3VideoPlayPanel.style.display = "none";

    this._video = this.$refs.videoPlayer;
    this._video.setAttribute("crossorigin", "anonymous");
    this.SetFullScreen(false);
    if (this.options.autoPlay == "true") this.isVisible = true;
  },
  methods: {
    SetVideoFullScreen() {
      if (_Global.inFocus != undefined) {
        if (!_Global.inFocus) {
          this.reload();
          _Global.inFocus = true;
        }
      }
      this.SetFullScreen(true);
      this.SetVideoMutedFn(false);
    },
    // 全屏，显示播放窗口元素
    SetFullScreen(b) {
      if (b == undefined) {
        b = true;
      }

      console.log(b);
      this.isVisible = b;
      this.vue3VideoPlayPanel.style.display = b
        ? ""
        : "none";
    },
    // 返回，隐藏播放窗口元素，并继续播放
    clickBack() {
      this.SetFullScreen(false);
      // _Global.setEnableRenderer(true);
      if (_Global.sceneName == "Scene2") {
        // this.$refs.videoPlayer.volume = 0;
        // this._video.volume = 0;
        setTimeout(() => {
          this.SetVideoMuted(true);
        }, 1000);
      }
      this._video.play();
      this.isVisible = false;
      // this.errShow = false;

      _Global.CallFullScreen();
    },
    pause() {
      this.$refs.videoPlayer && this.$refs.videoPlayer.pause();
      console.error("暂停方法hls");
      this._video.muted = true;
      this._video.pause();
      this.SetFullScreen(false);
    },
    play() {
      console.log("播放视频");
      this._video.play();
      // this.isVisible = true
    },

    stop() {
      this.pause();
      if (this.hls != null) {
        this.hls.destroy();
        this.hls = null;
      }
      this.oldUrl = "";
    },
    reload() {
      console.log("重新加载");
      if (this.hls != null) {
        this.hls.destroy();
        this.hls = null;
      }
      this.reloadTimes++;
      if (this.reloadTimes >= 5) {
        return;
      }
      this.PlayVideoStream(this.oldUrl, false || _Global.videoMutedState);
    },
    PlayVideoStream(url, isMuted) {
      // this.pause();
      if (url == null || url == undefined || url == "") {
        return;
      }
      if (url.includes("m3u8")) {
      } else {
        console.error("直播流只能为 m3u8 格式");
        // return;
      }
      // if (this.oldUrl == url) {
      //   setTimeout(() => {
      //     this.SetVideoMutedState(isMuted);
      //   }, 200);
      //   setTimeout(() => {
      //     this.play();
      //   }, 1000);
      //   return;
      // }
      this.oldUrl = url;

      if (this.hls == null) {
        this.hls = new Hls({
          maxBufferSize: 30,
          maxBufferLength: 5,
          backBufferLength: 0,
        });

        this.hls.on(Hls.Events.ERROR, (e) => {
          // this.picUrl = _Global.GetTexiaoData.VideoBasePicture;
          // if (this.picUrl != "") {
          //   this.errShow = true;
          // }
          console.error("hls视频报错",e);

          this.reload();
        });

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.error("hls视频准备完毕");
          this.reloadTimes = 0;

          setTimeout(() => {
            this.SetVideoMutedState(isMuted);
          }, 200);
          setTimeout(() => {
            this.play();
            // this.errShow = false;

          }, 1000);
        });
      } else {
        this.hls.stopLoad();
        this.hls.detachMedia();
      }

      this.hls.loadSource(url);
      this.hls.attachMedia(this._video);
      // this.isShowCloseFullBtn = true
    },

    ToggleMuted() {
      this.muted = !this.muted;
      this.SetVideoMutedFn(this.muted);
    },
    // 设置静音或取消静音
    SetVideoMuted(b) {
      this.SetVideoMutedFn(b);
    },
    SetVideoMutedState(b) {
      if (_Global.userTouched) {
        this._video.muted = b;
        this.$refs.videoPlayer.muted = b;
      } else {
        this._video.muted = true;
        this.$refs.videoPlayer.muted = true;
      }
    },

    SetVideoMutedFn(b) {
      console.error("设置静音hls");
      console.error("isMuted", b);
      this.muted = b;
      this._video.muted = this.muted;
      this._video.play();
    },
    onError(e) {
      console.log("报错", e);
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
  .vue3VideoPlayPanel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: black;
    z-index: 11;
  }

  .vue3VideoPlayPanel video {
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
@media screen and (orientation: landscape) {}
</style>
