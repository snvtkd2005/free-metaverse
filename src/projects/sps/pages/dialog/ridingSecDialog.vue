<template>
  <div
    class="flex justify-center items-center w-full h-full bg backdrop-blur-md absolute"
    v-show="isShowDialog"
  >
    <div
      class="elevatorDialog flex justify-center items-center flex-col relative"
    >
     <img :src="publicUrl+'images/dialog/elevator/bg.png'" alt="" class="absolute w-full h-full">
      <div
        class="close absolute right-14 top-14 text-6xl cursor-pointer"
        @click="isShowDialog = false"
      >
        x
      </div>
      <div
        class="relative left-6 bg-gray-200 border-white w-1/2 h-14 rounded-md text-2xl cursor-pointer"
        style="line-height: 56px; font-weight: bold"
        @click="RidingCar"
      >
        一階へ
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      publicUrl: "./public/sps/",
      isShowDialog: false,
    };
  },
  methods: {
    close() {
      this.isShowDialog = false;
    },
    RidingCar() {
      _Global.SetTakingCar("FirstFloor");
        this.isShowDialog = false;
    },
  },
};
</script>

<style scoped>
.bg {
  background: transparent;
}
.elevatorDialog {
  width: 30rem;
  height: 28rem;
  /* background: url(/public/sps/images/dialog/elevator/bg.png) no-repeat center
    center;
  background-size: cover; */
}
.elevatorDialog .que {
  font-weight: bold;
}
</style>
