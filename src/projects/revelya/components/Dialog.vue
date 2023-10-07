<template>
  <div class=" main">

  <div class="Dialog  transform scale-85 md:scale-100 ">
    <div @click="Close('other')"  class="close">X</div>
    <!-- DEX CENTER -->
    <div class="box" v-show="type == 1">
      <div class="title">
        <img :src="$publicUrl + 'revelya/img/DEX_CENTER.png'" alt="" />
      </div>
      <div class="contentBox">
        <div class="content_top ">
          <span>Swap</span>
          <img :src="$publicUrl + 'revelya/img/arrowRight.png'" alt="" />
        </div>
        <div class="content_top">
          <span>Liquidity</span>
          <img :src="$publicUrl + 'revelya/img/arrowRight.png'" alt="" />
        </div>
      </div>
      <div class="contentBox">
        <div class="content_top">
          <span>Pool</span
          ><img :src="$publicUrl + 'revelya/img/arrowRight.png'" alt="" />
        </div>
        <div class="content_top bottom_margin">
          <span>Farm</span
          ><img :src="$publicUrl + 'revelya/img/arrowRight.png'" alt="" />
        </div>
      </div>
    </div>
    
    <!-- COMPANY -->
    <div class="box" v-show="type == 2">
      <div class="title">COMPANY</div>
      <img
        :src="$publicUrl + 'revelya/img/address.png'"
        style="width: 759px; margin-top: 50px"
        alt=""
        v-show="!isMobile()"
      />
      <img
        :src="$publicUrl + 'revelya/img/mobile_news.png'"
        alt=""
        style="width: 100%; margin: 0 auto; padding: 0 10px 0 10px; height: 400px;"
        v-show="isMobile()"
      />
    </div>
    <!-- NEWS -->
    <div class="box" v-show="type == 3">
      <div class="title">NEWS</div>
      <div class="newscontent">
        <div class="item" v-for="item in 3" :key="item">
          <img alt="" :src="$publicUrl + 'revelya/img/test.png'" />
          <div
            class="title_little"
            style="width: 240px; height: 62px; margin: 20px 0 20px 0"
          >
            ニュースタイトルテキストニュースタイトルテキストニュースタイトルテキストニュースタイトル
          </div>
          <div class="time" style="color: #888888; margin-top: 10px; text-left">
            2022.11.08
          </div>
        </div>
      </div>
    </div>
    <!-- BUSINESS -->
    <div class="box  " v-show="type == 4">
      <div class="title">BUSINESS</div>
      <!-- pc端的图 -->
      <img

        :src="$publicUrl + 'revelya/img/BusinessIcon.png'"
        style="width: 759px; margin-top: 50px"
        alt=""
        v-show="!isMobile()"
      />
      <!-- 移动端的图 -->

      <img  
        :src="$publicUrl + 'revelya/img/mobile_Busniss.png'"
        style="width: 150px; height: 400px; margin: 0 auto"

        alt=""
        v-show="isMobile()"

      />
      
      
    </div>
    
    <!-- NFT Center -->
    <div class="nftbox" v-show="type == 5">
      <div class="title">NFT CENTER</div>
      <div class="">
        <div class="content_top">NFT Collection</div>
        <div class="content_top">Marketplace</div>
      </div>
      <div class="">
        <div class="content_top bottom_margin">NFT Staking</div>
        <!-- <div class="content_top bottom_margin">Farm</div> -->
      </div>
    </div>
    <div class="bottom_btn" v-show="type == 2 || type == 3 || type == 4"
      @click="navigation(type)"
    >
      VIEW MORE
    </div>
  </div>
  </div>

</template>

<script>
export default {
  props: ["type"],
  methods: {
    // 2.COMPANY
    // 3.NEWS
    // 4.BUSINESS
    navigation(type) {
      switch (type) {
        case 2:
          // window.location.href = "https://revelay.onrender.com/#/company";
      window.open("https://revelay.onrender.com/#/company");
          break;
        case 3:
          // window.location.href = "https://revelay.onrender.com/#/news";
      window.open("https://revelay.onrender.com/#/news");
          break;
        case 4:
          // window.location.href = "https://revelay.onrender.com/#/business";
      window.open("https://revelay.onrender.com/#/business");

          break;
        default:
          break;
      }
    },
        Close(e){
      this.$parent.Close(e);
    },
    isMobile() {
      if (
        window.navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
      ) {
        return true; // 移动端
      } else {
        return false; // PC端
      }
    },
  },
};
</script>

<style scoped>

.scale-85{
  --tw-scale-x:.85;
  --tw-scale-y:.85;
}
@media (min-width: 768px) {
  .main{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .Dialog {
    width: 1080px;
    height: 600px;
    background-color: #000000ba;
    border-radius: 12px;
    position: absolute;
    top: 0;
     bottom: 0;
     left: 0;
     right: 0;
     margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
  }
  .contentBox {
    position: relative;
    bottom: 30px;
  }

  .content_top {
    width: 300px;
    height: 60px;
    background-color: #00819b82;
    border: 1.2px solid rgb(224, 220, 220);
    border-radius: 15px;
    line-height: 50px;
    font-size: 18px;
    font-weight: bold;
    font-family: "Source Han Sans JP";
    margin-left: 15px;
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .content_top img {
    width: 34px;
    height: 7px;
    position: absolute;
    right: 31px;
  }
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .newscontent {
    display: flex;
    align-items: center;
  }
  .item {
    margin-left: 50px;
  }
  .close {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgb(0, 0, 0);
    text-align: center;
    line-height: 64px;
    font-size: 22px;
    font-weight: bold;
    position: absolute;
    right: 25px;
    top: 20px;
    cursor: pointer;
  }
  .title {
    position: absolute;
    top: 95px;
    /* left: 15%; */
    font-size: 30px;
    font-weight: bold;
    font-family: "Source Han Sans JP";
  }
  .title img {
    width: 353px;
    height: 74px;
  }
  .bottom_btn {
    position: absolute;
    bottom: 73px;
    width: 160px;
    height: 40px;
    border-radius: 20px;
    background-color: #ff8900;
    line-height: 35px;
    border: 3px white solid;
    box-sizing: border-box;
    font-weight: bold;
    font-family: "Source Han Sans JP";
    cursor: pointer;
  }
}
@media (max-width: 767px) {
  .Dialog {
    width: 100%;
    /* height: 165%; */
    background-color: #000000ba;
    border-radius: 12px;
    position: absolute;
    color: white;
  } 
  .close {
    position: absolute;
    right: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(0, 0, 0);
    text-align: center;
    line-height: 40px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
  }
  .newscontent {
width: 100%;height: 500px;overflow: auto;text-align: center;
  }
  .item {
    margin-top: 10px;
    width: 300px;margin: 0 auto;
  }
  .item img {
    width: 100%;height: 148px;
  }
  
  .content_top {
    height: 50px;
    height: 60px;
    background-color: #00819b82;
    border: 1.2px solid rgb(224, 220, 220);
    border-radius: 15px;
    background-color: rgba(49, 118, 129, 0.651);
    line-height: 50px;
    font-size: 14px;
    font-weight: bold;
    font-family: "Source Han Sans JP";
    margin: 15px 10px 0 15px;
    cursor: pointer;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .content_top img {
    width: 34px;
    height: 7px;
    position: absolute;
    right: 31px;
  }
  .title {
    /* position: absolute; */
    margin-top: 65px;
    margin-bottom: 27px;
    /* left: 15%; */
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    font-family: "Source Han Sans JP";
  }
  .bottom_margin {
    margin-bottom: 100%;
  }
  .bottom_btn {
    width: 160px;
    height: 40px;
    border-radius: 20px;
    background-color: #ff8900;
    line-height: 35px;
    border: 3px white solid;
    box-sizing: border-box;
    font-weight: bold;
    font-family: "Source Han Sans JP";
    cursor: pointer;
    margin: 0 auto;
    margin-top: 31px;
    margin-bottom: 51px;
    text-align: center;
  }
}
</style>
