<template>
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
        <slot></slot>
      </div>
      <div class="bottom_btn w-80 h-12 text-center">{{ btnText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "tips", "btnText", "showDialogNum"],
  data() {
    return {
      isShowDialog: false,
    };
  },
  methods:{
    close(){
      console.log(1111);
      console.log(this.isShowDialog);
      this.isShowDialog = false
    }
  },
  mounted(){
    new Interface_UI(this)
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
</style>
