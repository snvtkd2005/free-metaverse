<template>
  <div class="Menu_box">
    <div class="Menu text-white text-left" v-show="isShow">
      <div class="dex_center">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title text-left cursor-pointer"  @click="navigation('http://www1.superps-japan.com/products')">事業案内</div>
        </div>
      </div>
      <div class="nft_center">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer"  @click="navigation('http://www1.superps-japan.com/company')">会社情報</div>
        </div>
      </div>
      <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer"  @click="navigation('http://www1.superps-japan.com/recruit')">採用情報</div>
        </div>
      </div>
      <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer "  @click="navigation('http://www1.superps-japan.com/works')">制作事例</div>
        </div>
      </div>
            <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer "  @click="navigation('http://www1.superps-japan.com/blog')">ブログ</div>
            <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="right_btn" @click="isShowArrow" ref="rightBtn">
      <img :src="publicUrl + 'images/dialog/arrow_right.png'" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      publicUrl:"./public/sps/"
    };
  },
  methods: {
    navigation(url) {
      // window.location.href = url
      window.open(url,'_blank')
      
    },
    isShowArrow() {
      this.isShow = !this.isShow;
      if (!this.isShow) {
        this.$refs.rightBtn.style.cssText = "left:0;top:60px";
      } else {
        this.$refs.rightBtn.style.cssText = "    left: 256px;top: 40px";
      }
    },
  },
};
</script>

<style scoped>
.Menu {
  width: 256px;
  height: 100%;
  background-color:rgba(39, 82, 127, 0.906);
  position: absolute;
  left: 0;
  font-size: 1rem;
  font-family: "Source Han Sans JP";
}
.line {
  margin: 11px 30px 11px 25px;
  border-bottom: rgba(255, 255, 255, 0.361) dotted 3px;
}
.dex_center {
  margin-top: 61px;
}
.dex_title {
  padding-left: 25px;
  /* position: relative; */
  /* right: 3.5rem; */
}
.right_btn {
  width: 30px;
  height: 40px;
  background-color:rgba(39, 82, 127, 0.908);
  position: relative;
  left: 256px;
  top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 0px 10px 10px 0;
}
</style>
