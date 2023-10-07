<!-- 1， -->
<!-- npm 安装插件 -->
<!-- npm i vue3-video-play -S    -->
<!-- 更新vue到3.2.4
npm install vue@3.2.4   -->

// 播放直播流
<template>
  <!--   v-bind="options" -->
  <!-- :src="video_url" 
    :poster="poster" -->
  <div id="vue3VideoPlayPanel" class="vue3VideoPlayPanel">
    <vue3VideoPlay
      class="   "
      ref="videoPlayer"
      x5-video-orientation="landscape"
      v-bind="options"
      :src="video_url"
      :type="type"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="onCanplay"
      @error="onError"
    />
    
  </div>
    <div
      class="absolute"
      ref="backBtn"
      v-show="isVisible"
      @click="clickBack()"
      style="
        position: absolute;
        left: 0px;
        top: 0px;
        color: white;
        border: 2px solid white;
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-weight: bold;
        z-index:999
      "
    >
      返回
    </div>
</template>

<script>
// 播放器-导入组件（在要用组件的页面导入组件,并声明）
// import "vue3-video-play/dist/style.css";
import vue3VideoPlay from "vue3-video-play";

export default {
  components: {
    vue3VideoPlay,
  },
  props: ["poster"],
  data() {
    return {
      video_url: "./public/newsMeta/videos/movieSD.mp4",
      type: "video/mp4",
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
        // src: "http://219.151.31.38/liveplay-kk.rtxapp.com/live/program/live/hnwshd/4000000/mnf.m3u8",//视频url地址
        type: "m3u8",

        live: true,
        // src: "rtmp://mobliestream.c3tv.com:554/live/goodtv.sdp",//视频url地址
        // type:'rtmp/mp4',

        // src: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4",//视频url地址
        // src: "http://tv.cctv.com/live/",//视频url地址
        // type:'rtsp/mp4',

        muted: false, //静音
        webFullScreen: true,
        speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
        autoPlay: false, //自动播放
        loop: true, //循环播放
        mirror: false, //镜像画面
        ligthOff: true, //关灯模式
        volume: 0.5, //默认音量大小
        control: true, //是否显示控制
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
      isVisible:false
    };
  },
  mounted() {
    console.log("videoPlayer ", this.$refs.videoPlayer);
    this.vue3VideoPlayPanel = document.getElementById("vue3VideoPlayPanel");
    this.vue3VideoPlayPanel.style.display = "none";
    document.getElementById("refPlayerWrap").style.zIndex = 99;

    this._video = document.getElementById("dPlayerVideoMain");
    this._video.setAttribute("crossorigin", "anonymous");
  },
  methods: {
    open(){
      this.isVisible = true
    },
    clickBack() {
      this.vue3VideoPlayPanel.style.display = "none";
      this.$refs.videoPlayer.play();
      this.isVisible = false
    },
    play() {
      // _video.play();
      this.$refs.videoPlayer.muted = false;
      this.$refs.videoPlayer.volume = 0.5;
      this.$refs.videoPlayer.play();

      this._video.volume = 0.5;

      console.log("设置 直播视频音量 ");
    },
    PlayVideoStream(url, type) {
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
      this.$refs.videoPlayer.play();
      this.isShowCloseFullBtn = true
    },

    SetVideoMuted(b) {
      this._video.muted = b;
    },
    SetVideoFullScreen() {
      //坐到座位上后，全屏播放视频
      this.vue3VideoPlayPanel.style.display = "";
      // this.play();
    },
    onError(e) {
      console.log("报错", e);
    },
  },
};
</script>

<style >
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
/*竖屏*/
@media screen and (orientation: portrait) {
.vue3VideoPlayPanel {
  position: absolute;
  /* width: 100%;
  height: 100vh; */
  top: 0;
  /* left: 100vw;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
  transform-origin: 0% 0%; */
  overflow: hidden;
}
.d-player-wrap {
position: fixed;
left: 0px;
top: 0px;
width: 100% !important ;
height: 100% !important ;
}
.d-player-video {
width: 100% !important ;
height: 100% !important ;
}
.d-player-video-main {
width: 100% !important ;
height: 100% !important ;
}
}


/* 横屏情况 */
@media screen and ( orientation:landscape) {
.vue3VideoPlayPanel {
 position: absolute;
 /* width: 100vh;
 height: 100vw; */
 top: 0;
 left: 0; 
 overflow: hidden
}
 .d-player-wrap {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100% !important ;
  height: 100% !important ;
 }
 .d-player-video {
 width: 100% !important ;
 height: 100% !important ;
 }
 .d-player-video-main {
 width: 100% !important ;
 height: 100% !important ;
 }
}
</style>
