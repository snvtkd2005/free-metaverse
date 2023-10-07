<template>
  <!-- <BaseDialog :title="title" :tips="tips" :btnText="btnText" > -->
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
            <div class="companyDialog w-full h-full flex justify-center items-center flex-col ">
        <div>
            <div class="text-2xl text-white text-left mt-5 mb-1">人材募集</div>
        <img :src="publicUrl + 'images/dialog/recruit/1.png'" alt="" />
        <div class="bottom_tips mt-8 text-left text-white">採用情報についてご不明な点は、「お問い合わせ」からご連絡ください。</div>            
        </div>

    </div>
      </div>
      <div class="bottom_btn w-80 h-12 text-center" @click="toPage('http://www1.superps-japan.com/recruit')">{{ btnText }}</div>
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
      title: "採用情報",
      tips: "Recruit",
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
