
<template> 
  <div class=" flex  absolute pointer-events-none text-white">

    <!-- 图片 -->
    <div v-if="mediaType == 'image'">

    </div>

    <!-- 视频 -->
    <div v-if="mediaType == 'mp4'">
      <playVideo ref="playVideoM3u8" :videoId="mediaId" />
    </div>

    <!-- 直播流 -->
    <div v-if="mediaType == 'm3u8'">
      <playVideoHLS v-if="isSupportedHls" ref="playVideoM3u8" :videoId="mediaId" />
      <playVideo v-else ref="playVideoM3u8" :videoId="mediaId" />
    </div>

  </div>
</template>

<script>

import playVideo from "./playVideo.vue";
import playVideoHLS from "./playVideoHLS.vue";

/**
// 媒体：图片、视频、直播流
 * 视频使用 playVideo
 * 直播流 ios端使用playVideo 、  安卓端和pc端使用 playVideoHLS
 */
export default {
  name: "yjmedia",
  components: {
    playVideo,
    playVideoHLS,
  },
  props: ["mediaType", "mediaId"],
  data() {
    return {
      // 媒体容器id
      // mediaId: "",
      // 是否支持Hls
      isSupportedHls: false,
    };
  },
  created() {

  },
  mounted() {
    this.isSupportedHls = _Global.isSupportedHls;
    // console.log(" in  this.isSupportedHls ", this.isSupportedHls);
  },
  methods: {
    SetVideoFullScreen() {
      this.$refs.playVideoM3u8.SetVideoFullScreen();
    },
    // 全屏，显示播放窗口元素
    SetFullScreen(b) {
      this.$refs.playVideoM3u8.SetFullScreen(b);
    },
    clickBack() {
      this.$refs.playVideoM3u8.clickBack();
    },
    play() {
      this.$refs.playVideoM3u8.play();
    },
    pause() {
      this.$refs.playVideoM3u8.pause();
    },

    stop() {
      this.$refs.playVideoM3u8.stop();
    },
    reload() {
      this.$refs.playVideoM3u8.reload();
    },
    PlayVideoStream(url, isMuted) {
      this.$refs.playVideoM3u8.PlayVideoStream(url, isMuted);
    },

    SetVideoMutedState(b) {
      this.$refs.playVideoM3u8.SetVideoMutedState(b);
    },
    SetVideoMuted(b) {
      this.$refs.playVideoM3u8.SetVideoMuted(b);
    },
  },
};
</script>
 
<style scoped>
.bg-color {
  background: #28cad9;
}
</style>