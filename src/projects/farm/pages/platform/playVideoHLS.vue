


<!-- // 播放HLS  m3u8直播流 -->
<template>
  <div id="refPlayerWrapHLS" class=" absolute left-0 top-0 z-50 w-full h-full">
    <video class=" w-full h-full " id="dPlayerVideoMainHLS" ref="videoPlayer" crossorigin="anonymous" muted
      playsinline></video>
  </div>
</template>


<script>
export default {

  components: {
  },

  data() {
    return {

      video_url: "./public//videos/movieSD.mp4",
      type: "video/mp4",
      muted: true,

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
      videoPlayer: null,
      _video: null,
    };
  },
  mounted() {

    this._video = this.$refs.videoPlayer;
    this._video.setAttribute("crossorigin", "anonymous");
    this.SetFullScreen(false);
    window.addEventListener("click",()=>{
      this._video.play();
    });
    window.addEventListener("touchstart",()=>{
      this._video.play();
    });
  },
  methods: {
    // 全屏，显示播放窗口元素
    SetFullScreen(b) {
      if (b == undefined) {
        b = true;
      }
      document.getElementById("refPlayerWrapHLS").style.display = b ? "" : "none";
    },
    // 返回，隐藏播放窗口元素，并继续播放
    clickBack() {
      this.SetFullScreen(false);
      this._video.play();
    },
    play(){
      this._video.play();
    },
    PlayVideoStream(url) {
      if (url == null || url == undefined || url == "") {
        return;
      }
      if (url.includes("m3u8")) {
      } else {
        console.log("直播流只能为 m3u8 格式");
        // return;
      }

      console.log("HLS播放器播放 ",url);

      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(this._video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.error("hls视频准备完毕");
        this._video.loop = true;
        this._video.play();
        this.ToggleMuted();
        setTimeout(() => {
          this.SetFullScreen(true);

          setTimeout(() => {
            this.SetFullScreen(false);
          }, 1000);
        }, 1000);
      });
      // this.isShowCloseFullBtn = true
    },

    ToggleMuted() {
      this.muted = !this.muted;
      this.SetVideoMutedFn(this.muted);
    },
    // 设置静音或取消静音
    SetVideoMuted() {

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