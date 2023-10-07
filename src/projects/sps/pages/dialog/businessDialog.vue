<template>
  <!-- business dialog -->
  <!-- <BaseDialog :title="title" :tips="tips" :btnText="btnText"> -->
    <div
    class="BaseDialog w-full h-full flex justify-center items-center absolute"
    v-show="isShowDialog"
  >
    <div class="outside relative">
      <div
        class="close_btn absolute right-10 top-10 w-16 h-16 rounded-full text-white text-center cursor-pointer"
        @click="close"
      >
        x
      </div>
      <div class="top mt-16 ml-16">
        <div class="left_top flex items-center text-white">
          <div class="title">{{ title }}</div>
          <div class="title_desc ml-4 text-base">{{ tips }}</div>
        </div>
      </div>
      <div class="content">
        <!-- <slot></slot> -->
            <div class="business">
      <div class="title text-base text-white text-left ml-16">
        ＳＰＳ合同会社は、コンピュータグラフィックスの受託開発など中心に <br />
        日本の先進的ゲーム製作の専門法人を2019年3月に設立しました。
      </div>
      <div class="w-5/6 grid gap-x-8 gap-y-4 grid-cols-3 ml-16 mt-12">
        <div class="flex flex-col">
          <div class="photo">
            <img :src="publicUrl + 'images/dialog/business/1.png'" alt="" />
          </div>
          <div class="text text-left text-white mt-2">
            CG及び映像のプロデュース・ディレクション・制作
          </div>
        </div>
        <div class="flex flex-col">
          <div class="photo">
            <img :src="publicUrl + 'images/dialog/business/2.png'" alt="" />
          </div>
          <div class="text text-left text-white mt-2">
            業務用、ゲーム用等ソフトウェア開発
          </div>
        </div>
        <div class="flex flex-col">
          <div class="photo">
            <img :src="publicUrl + 'images/dialog/business/3.png'" alt="" />
          </div>
          <div class="text text-left text-white mt-2">
           有料人材紹介サービス
          </div>
        </div>
        <div class="flex flex-col">
          <div class="photo">
            <img :src="publicUrl + 'images/dialog/business/4.png'" alt="" />
          </div>
          <div class="text text-left text-white mt-2">
           翻訳・通訳（中国語・日本語・英語・韓国語）
          </div>
        </div>
        <div class="flex flex-col">
          <div class="photo">
            <img :src="publicUrl + 'images/dialog/business/5.png'" alt="" />
          </div>
          <div class="text text-left text-white mt-2">
            IDC事業（サーバー設置・配線工事/データセンター運用・保守等）
          </div>
        </div>
      </div>
    </div>
      </div>
      <div class="bottom_btn w-80 h-12 text-center" @click="toPage('http://www1.superps-japan.com/products')">{{ btnText }}</div>
    </div>
  </div>

  <!-- </BaseDialog> -->
</template>

<script>
import BaseDialog from "./baseDialog.vue";
export default {
  data() {
    return {
      publicUrl: "./public/sps/",
      title: "事業案内",
      tips: "Our Business",
      BlogText:"ブログはこちら",
      btnText:"詳細はこちら",
      isShowDialog:false
    };
  },
  components: {
    BaseDialog,
  },
    methods:{
    close() {
      this.isShowDialog = false;
    },
            toPage(url){
      window.open(url)
    }
  }
};
</script>

<style scoped>
.outside {
  width: 70em;
  /* height: 50rem; */
  border: 12px solid #0b3c6e;
  background-color: rgb(48, 93, 144);
  /* transform: scale(0.45); */
}
.close_btn {
  line-height: 64px;
  background-color: #093b70;
  font-size: 30px;
  font-weight: bold;
}
.top .left_top .title {
  color: rgb(162, 241, 255);
  font-size: 48px;
}
.bottom_btn {
  background: rgb(162, 241, 255);
  border-radius: 25px;
  color: rgb(9, 59, 112);
  line-height: 48px;
  margin: 2rem auto;
  font-weight: bold;
}
@media screen and (max-width: 1024px) {
  .BaseDialog{
    transform: scale(0.45);
  }
}
</style>
