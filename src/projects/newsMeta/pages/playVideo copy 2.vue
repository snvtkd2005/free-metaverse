
// 播放直播流
<template>

  <vue3VideoPlay ref="videoPlayer" :options="options" poster="./public/newsMeta/farm1.png" @play="onPlay"
    @pause="onPause" @timeupdate="onTimeupdate" @canplay="onCanplay" @error="onError" />
</template>

<!-- <script> -->
<script  setup lang="ts">

// 播放器-导入组件（在要用组件的页面导入组件,并声明）
import "vue3-video-play/dist/style.css";
import vue3VideoPlay from "vue3-video-play";

import { reactive, toRefs } from "vue";

const options = reactive({
  width: '800px', //播放器高度
  height: '450px', //播放器高度
  color: "#409eff", //主题色
  title: '测试视频', //视频名称
  // src: "https://go.dreamwq.com/videos/IronMan.mp4", //视频源
  // src: "./public/newsMeta/videos/movieSD.mp4",//视频url地址
  src: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4",//视频url地址
  muted: false, //静音
  webFullScreen: false,
  speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
  autoPlay: true, //自动播放
  loop: false, //循环播放
  mirror: false, //镜像画面
  ligthOff: false, //关灯模式
  volume: 0.3, //默认音量大小
  control: true, //是否显示控制器
});
const onError = (e) => {
  console.log('报错', e)
}
const onPlay = (ev) => {
  console.log('播放')
}
const onPause = (ev) => {
  console.log(ev, '暂停')
}
const onTimeupdate = (ev) => {
  console.log(ev, '时间更新')
}
const onCanplay = (ev) => {
  console.log(ev, '可以播放')
}


// export default {
//   props: ['video_url', 'poster'],

//   components: {
//     vue3VideoPlay,
//   },
//   setup(props){
//   let data = reactive({
//     options:{
//       width: "800px", //播放器高度
//       height: "450px", //播放器高度
//       color: "#409eff", //主题色
//       title: "", //视频名称
//       src: props.video_url, //视频源
//       muted: false, //静音
//       webFullScreen: false,
//       speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
//       autoPlay: true, //自动播放
//       loop: false, //循环播放
//       mirror: false, //镜像画面
//       ligthOff: true, //关灯模式
//       volume: 0.3, //默认音量大小
//       control: true, //是否显示控制
//       controlBtns: [
//         "audioTrack",
//         "quality",
//         "speedRate",
//         "volume",
//         "setting",
//         "pip",
//         "pageFullScreen",
//         "fullScreen",
//       ], //显示所有按钮,
//     },
//     poster:props.poster
// });

//     return {
//       ...toRefs(data)
//     }
//   },

//   // data() {
//   //   return {
//   //     //视频
//   //     playerOptions: {
//   //       width: "800px", //播放器高度
//   //       height: "450px", //播放器高度
//   //       color: "#409eff", //主题色
//   //       title: "", //视频名称
//   //       // src: props.video_url, //视频源
//   //       src: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4",//视频url地址
//   //       // src: "./public/newsMeta/videos/movieSD.mp4",//视频url地址
//   //       muted: true, //静音
//   //       webFullScreen: false,
//   //       speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
//   //       autoPlay: false, //自动播放
//   //       loop: false, //循环播放
//   //       mirror: false, //镜像画面
//   //       ligthOff: true, //关灯模式
//   //       volume: 0.3, //默认音量大小
//   //       control: true, //是否显示控制
//   //       controlBtns: [
//   //         "audioTrack",
//   //         "quality",
//   //         "speedRate",
//   //         "volume",
//   //         "setting",
//   //         "pip",
//   //         "pageFullScreen",
//   //         "fullScreen",
//   //       ], //显示所有按钮, 
//   //     },
//   //     poster: './public/newsMeta/farm1.png',

//   //   };
//   // },
//   mounted() {
//     console.log(this.$refs.videoPlayer);
//     // console.log(this.$refs.videoPlayer.player);
//     this.$refs.videoPlayer.play(); 
//   },
//   methods: {


//   },
// };
</script>

<style  >
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