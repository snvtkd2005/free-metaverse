<template>
    <!-- <BaseDialog :title="title" :tips="tips" :btnText="BlogText"> -->
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
            <div class="companyDialog w-full h-full flex justify-center items-center flex-col mt-5">
      <img :src="publicUrl + 'images/dialog/blog/1.png'" alt="" />
      <div class="text-left text-white mt-5" style="width:920px">
        ブログ管理人の周（Zhou　ジョー)です。<br>
        蕨市で2019年デジタルデザイン制作会社を設立しました。主な仕事はゲームなどに使用されるデジタル画像や動画制作をやっています。会社事務所も私の住まいも蕨です。本ブログは日常、ジョーがコンパクトシティ蕨で初めての生活や街での新たな発見、気付いたこと、地元の変化を外国人の目を通して感じたこと中心に時々つぶやきます。
      </div>
    </div>
      </div>
      <div class="bottom_btn w-80 h-12 text-center" @click="toPage('http://www1.superps-japan.com/blog')">{{ btnText }}</div>
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
      title: "ブログ",
      tips: "Blog",
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
