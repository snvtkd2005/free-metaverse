

<!-- 1， -->
<!-- npm 安装插件 -->
<!-- npm i vue3-video-play -S    -->
<!-- 更新vue到3.2.4
npm install vue@3.2.4   -->
 
<template>
  <!--   v-bind="options" -->
<!-- :src="video_url" 
        :poster="poster" -->
  <div id="vue3VideoPlayPanel">

    <vue3VideoPlay class="   " ref="videoPlayer" v-bind="options" :src="video_url" :type="type" @play="onPlay"
      @pause="onPause" @timeupdate="onTimeupdate" @canplay="onCanplay" @error="onError" />


  <!-- <vue3VideoPlay class="   " ref="videoPlayer" v-bind="options" @play="onPlay"
      @pause="onPause" @timeupdate="onTimeupdate" @canplay="onCanplay" @error="onError" /> -->

    <div class=" absolute z-100 left-0 bottom-0 text-white " @click="clickBack()">
      返回
    </div>
  </div>

  <!-- <div class=" absolute left-0 top-0 w-full h-full pointer-events-none">
        <div class=" w-20 h-20 pointer-events-auto" @click="SetVideoMuted">{{ muted ? '取消静音' : '静音' }}</div>
      </div> -->
</template>

<script>

// 播放器-导入组件（在要用组件的页面导入组件,并声明）
import "vue3-video-play/dist/style.css";
import vue3VideoPlay from "vue3-video-play";

export default {

  components: {
    vue3VideoPlay,
  },
  // props: ['video_url', 'poster', 'type'],
  props: ['poster'],
  data() {
    return {

      video_url: "./public//videos/movieSD.mp4",
      type: "video/mp4",
      muted: false,

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


        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",//视频url地址
        // src: "http://39.134.115.163:8080/PLTV/88888910/224/3221225636/index.m3u8",//视频url地址
        // src: "http://219.151.31.38/liveplay-kk.rtxapp.com/live/program/live/hnwshd/4000000/mnf.m3u8",//视频url地址
        type: 'm3u8',

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
        control: true, //是否显示控制
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
      // poster: './public/newsMeta/farm1.png',
      // poster: props.poster,
      // video_url: props.video_url,
      // type: props.type,
      // video_url: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4",//视频url地址
      // video_url: "./public/newsMeta/videos/movieSD.mp4",//视频url地址

      videoPlayer: null,
      _video: null,
    };
  },
  mounted() {
    this.videoPlayer = this.$refs.videoPlayer;
    this._video = document.getElementById("dPlayerVideoMain");
    // console.log(this.videoPlayer);
    document.getElementById("vue3VideoPlayPanel").style.display = "none";
    document.getElementById("refPlayerWrap").style.zIndex = 99;

    // console.log(this.$refs.videoPlayer.player);
  },
  methods: {
    // 全屏，显示播放窗口元素
    SetFullScreen() {
      document.getElementById("refPlayerWrap").style.opacity = 0;
    },
    // 返回，隐藏播放窗口元素，并继续播放
    clickBack() {
      document.getElementById("vue3VideoPlayPanel").style.display = "none";
      this._video.play();
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

      this._video.setAttribute("crossorigin", "anonymous");

      this._video.load(); //更改src后一定要用load

      this.$refs.videoPlayer.play();
      this.isShowCloseFullBtn = true
    },
    // 设置静音或取消静音
    SetVideoMuted() {
      this.SetVideoMutedFn(!this.muted);
    },
    SetVideoMutedFn(b) {
      this.muted = b;
      this._video.muted = this.muted;
    },
    onError(e) {
      console.log("报错", e);
    }
  },
};
</script>

<style  >
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
</style>