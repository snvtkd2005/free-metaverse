<template>
  <div class="Menu_box">
    <div class="Menu text-white" v-show="isShow">
      <div class="dex_center">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title">DEX CENTER</div>
          <div class="line"></div>
        </div>
        <div class="content">
          <div style="margin-left: 34px">Swap</div>
          <div style="margin: 15px 0 15px 34px">Liquidity</div>
          <div style="margin: 0px 0 15px 34px">Pool</div>
          <div style="margin-left: 34px">Farm</div>
        </div>
      </div>
      <div class="nft_center">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title">NFT CENTER</div>
          <div class="line"></div>
        </div>
        <div class="content">
          <div style="margin-left: 34px">NFT Collection</div>
          <div style="margin: 15px 0 15px 34px">Marketplace</div>
          <div style="margin: 0px 0 15px 34px">NFT Staking</div>
        </div>
      </div>
      <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer"  @click="navigation('https://revelay.onrender.com/#/about')">ABOUT US</div>
        </div>
      </div>
      <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer "  @click="navigation('https://revelay.onrender.com/#/company')">COMPANY</div>
        </div>
      </div>

      <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer"   @click="navigation('https://revelay.onrender.com/#/news')">NEWS</div>
        </div>
      </div>
      <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer "     @click="navigation('https://revelay.onrender.com/#/business')">BUSINESS</div>
        </div>
      </div>
      <div class="About_us">
        <div class="head">
          <div class="line"></div>
          <div class="dex_title cursor-pointer "  @click="navigation('https://revelay.onrender.com/#/recruit')">RECRUIT</div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="right_btn" @click="isShowArrow" ref="rightBtn">
      <img :src="$publicUrl + 'revelya/img/arrow_right.png'" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
    };
  },
  methods: {
    navigation(url) {
      // window.location.href = url;
      window.open(url);
      
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
  background-color: #000000ba;
  position: absolute;
  left: 0;
  font-size: 14px;
  font-weight: bold;
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

}
.right_btn {
  width: 30px;
  height: 40px;
  background-color: #000000ba;
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
