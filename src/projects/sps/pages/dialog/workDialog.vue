<template>
  <!-- <BaseDialog :title="title" :tips="tips" :btnText="btnText" style="transform:scale(0.8)"> -->
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
            <div class="business" >
      <div class="w-5/6 grid gap-x-8 gap-y-4 grid-cols-4 ml-16 mt-12">
        <div class="flex flex-col">
          <div class="work_title text-white text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_BG/1.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_BG/2.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_BG/3.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_BG/4.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-white text-xl text-left mb-2">2Dキャラクター</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_JP/1.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_JP/2.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_JP/3.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/2D_JP/4.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-white text-xl text-left mb-2">3Dモデリング</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/3D_JP/1.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/3D_JP/2.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/3D_JP/3.png'" alt="" />
          </div>
        </div>
        <div class="flex flex-col">
          <div class="work_title text-transparent text-xl text-left mb-2">2D背景</div>
          <div class="photo w-52 " style='height:11rem'>
            <img class='w-full h-full' :src="publicUrl + 'images/dialog/work/big/3D_JP/4.png'" alt="" />
          </div>
        </div>

      </div>
    </div>
      </div>
      <div class="bottom_btn w-80 h-12 text-center" @click="toPage('http://www1.superps-japan.com/works')">{{ btnText }}</div>
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
      title: "制作事例",
      tips: "Works",
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
    transform: scale(0.35);
  }
}
@media screen and (min-width: 1025px){
  .BaseDialog{
     transform:scale(0.8)
  }
}
</style>
