<template>
  <div class="Tips" id="body" v-if="isPc">
    <div class="left" @click="showIcon()">
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
    <div class="right" v-if="isShowContent">
      <div class="tips_key" ref="key">
        <div class="left_btn">
          <img :src="this.$publicUrl + 'city/img/key@2x.png'" alt="" />
        </div>
        <div class="right_btn">
          <img :src="this.$publicUrl + 'city/img/G@2x.png'" alt="" />
          <br /><br />
          <img :src="this.$publicUrl + 'city/img/Space@2x.png'" alt="" />
        </div>
      </div>
      <div class="tips_arrow" ref="arrow">
        <img :src="this.$publicUrl + 'city/img/arrow_tips.png'" alt="" />
      </div>
    </div>
    <div class="right" v-else></div>
    <div class="hidden_icon line" @click="hiddenContent">
      <img :src="this.$publicUrl + 'city/img/btn_hide@2x.png'" alt="" />
      <!-- Hide Tips -->
    </div>
    <!-- <audio ref='enter'>
       <source src="@/assets/music/city/SUB-MIX2-251_min.mp3"  type="audio/mpeg">
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
    // this.$nextTick(()=>{
    //   this.audio = this.$refs.enter
    // })
    // addEventListener("click", this.playMusic);

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
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    hiddenContent() {
      this.isShowContent = !this.isShowContent;
    },
    playMusic() {
      if (!this.isClick) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
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
  left: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.Tips .left {
  margin-right: 70px;
}
.Tips .left img {
  cursor: pointer;
  height: 40px;
  width: 40px;
}
.Tips .right {
  position: relative;
  height: 180px;
  z-index: -1;
}
.Tips .tips_key {
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  opacity: 1;
  z-index: 1;
}
.Tips .tips_arrow {
  position: absolute;
  z-index: 0;
  opacity: 0;
  bottom: 5px;
}
.Tips .right_btn {
  padding: 10px 0 0 20px;
}
.Tips .hidden_icon {
  padding: 100px 0 0 50px;
  cursor: pointer;
  position: fixed;
  right: 10%;
  font-size: 25px;
  font-weight: bold;
}
.Tips .hidden_icon img {
  width: 80px;
  height: 30px;
}
</style>