<template>
  <div
    class="
      absolute
      right-0
      bottom-5
      w-20
      md:left-96 md:bottom-10 md:w-1/2
      h-auto
      flex
      gap-x-12
    "
    id="body"
    v-if="isPc"
  >
    <!-- 音乐按钮 -->
    <div class="w-10 h-10 mt-10 self-center cursor-pointer transform scale-75" @click="showIcon()">
      <img
        v-show="!isClick"
        :src="this.$publicUrl + 'city/img/sound_on@2x.png'"
        alt=""
      />
      <img
        v-show="isClick"
        :src="this.$publicUrl + 'city/img/sound_off@2x.png'"
        alt=""
      />
    </div>


    <div class="hidden md:flex w-3/4 gap-x-10 ml-20">
      <!-- 按键提示 -->
      <div class="relative transform scale-50 " v-if="isShowContent">
        <div ref="key" class="flex self-center gap-x-3">
          <div class="">
            <img :src="this.$publicUrl + 'city/img/key@2x.png'" alt="" />
          </div>
          <div class="flex flex-col gap-y-4 py-2 justify-between">
            <img :src="this.$publicUrl + 'city/img/G@2x.png'" alt="" />
            <img :src="this.$publicUrl + 'city/img/Space@2x.png'" alt="" />
          </div>
        </div>

        <div ref="arrow" class="absolute left-0 top-0 opacity-0">
          <img :src="this.$publicUrl + 'city/img/arrow_tips.png'" alt="" />
        </div>
      </div>


      <div class="relative transform scale-50 opacity-0 " v-if="!isShowContent">
        <div  class=" flex self-center gap-x-3">
          <div class="">
            <img :src="this.$publicUrl + 'city/img/key@2x.png'" alt="" />
          </div>
          <div class="flex flex-col gap-y-4 py-2 justify-between">
            <img :src="this.$publicUrl + 'city/img/G@2x.png'" alt="" />
            <img :src="this.$publicUrl + 'city/img/Space@2x.png'" alt="" />
          </div>
        </div>

        <div  class="absolute left-0 top-0 opacity-0">
          <img :src="this.$publicUrl + 'city/img/arrow_tips.png'" alt="" />
        </div>
      </div>

      <div class="-ml-40 mt-20 h-6 cursor-pointer" @click="hiddenContent">
        <img
          class="h-full"
          :src="this.$publicUrl + 'city/img/btn_hide@2x.png'"
          alt=""
        />
        <!-- Hide Tips -->
      </div>
    </div>

    <!-- <audio ref="bgmAudio">
      <source :src="this.$publicUrl + 'city/bg.mp3'" type="audio/mpeg" />
    </audio> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isClick: false,
      isShowContent: true,
      audio: null,
      isPc: false,
    };
  },
  mounted() {
    this.isPc = !this.fIsMobile();

    this.audio = this.$refs.bgmAudio;
    addEventListener("click", this.playMusic);

    let that = this;
    window.onfocus = function () {
      if (!that.isClick) {
        that.$parent.$parent.SetbgmPlay(true);
      }
    };
    window.onblur = function () {
      if (!that.isClick) {
        that.$parent.$parent.SetbgmPlay(false);
      }
    };
    this.autoChange();
  },
  methods: {
    showIcon() {
      this.isClick = !this.isClick;
      if (this.isClick) {
        // this.audio.play();
      } else {
        // this.audio.pause();
      }
      this.$parent.$parent.SetbgmPlay(!this.isClick);
    },
    hiddenContent() {
      this.isShowContent = !this.isShowContent;
    },
    playMusic() {
      // if (!this.isClick) {
      //   this.audio.play();
      // } else {
      //   this.audio.pause();
      // }
    },
    fIsMobile() {
      return /Android|iPhone|iPad|iPod|BlackBerry|webOS|Windows Phone|SymbianOS|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
    autoChange() {
      setInterval(() => {
        if (Number(this.$refs.arrow.style.opacity) == 1) {
          this.$refs.arrow.style.cssText = "opacity:0;transition:2s;z-index:0;";
          this.$refs.key.style.cssText = "opacity:1;transition:2s;z-index:1;";
        } else {
          this.$refs.arrow.style.cssText = "opacity:1;transition:2s;z-index:1;";
          this.$refs.key.style.cssText = "opacity:0;transition:2s;z-index:0;";
        }
      }, 6000);
    },
  },
};
</script>

<style scoped>
.Tips {
  position: absolute;
  bottom: 50px;
  left: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.left {
  margin-right: 180px;
}
.left img {
  cursor: pointer;
}
.right {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 180px;
}
.right_btn {
  padding: 10px 0 0 20px;
}
.hidden_icon {
  /* padding: 100px 0 0 50px; */
  cursor: pointer;
  /* position: fixed; */
  /* right: 25%;
  font-size: 25px;
  font-weight: bold; */
}
.hidden_icon img {
  width: 120px;
  height: 50px;
}
</style>