
// 播放直播流
<template>

  <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"
    style="width:100%; height:100%; position:fixed; left:0; top:0; z-index:20">
  </video-player>
  <div class="dark_cover"></div>
</template>

<script>

// import Video from 'video.js'
// import 'video.js/dist/video-js.css'


// import VuevideoPlayer from 'vue-video-player';

// 播放器-导入组件（在要用组件的页面导入组件,并声明）
// import {videoPlayer}  from "vue-video-player";
import videoPlayer  from "vue-video-player";
import "video.js/dist/video-js.css";
// import video  from './public/newsMeta/videos/movieSD.mp4';

export default {
  
  components: {
    videoPlayer,
  },
  data() {
    return {
      //视频
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: true, // 默认情况下将会消除任何音频。
        loop: true, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        muted: "muted", //谷歌自动播放
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            // src: video//视频url地址
            src: "./public/newsMeta/videos/movieSD.mp4"//视频url地址
            // src: "rtmp://58.200.131.2:1935/livetv/hunantv"//视频url地址
            //imgUrl:require("../assets/test.png")
          },
        ],
        poster: '', //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controls:true,
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },

    };
  },
  mounted() { 
    console.log(this.$refs.videoPlayer);
    console.log(this.$refs.videoPlayer.player);
    // this.$refs.videoPlayer.player.play(); 
  },
  methods: {
 

  },
};
</script>

<style  >
.video-js.vjs-fluid{
  height: 100%;

}
.vjs-tech{
    object-fit: cover;
  }
.dark_cover{
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  z-index: -1;
}
</style>