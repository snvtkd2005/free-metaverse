<template>
  <div class=" absolute left-0 top-0 w-full h-full overflow-hidden ">
    <TopHeader></TopHeader>
    <div  v-if="diplayerLoading"  class=" bg-cover bg-no-repeat bg-fixed h-24 min-h-screen">
      <div class=" w-full h-full ">
        <img class=" w-full h-full " :src="$publicUrl + 'revelya/img/loadingpage.jpg'" alt="">
      </div>
      <div class="dialog flex items-center flex-col">
        <img
          :src="$publicUrl + 'revelya/img/dialog_logo.png'"
          alt=""
          style="width: 324px; height: 211px; margin-top: 60px"
        />
        <div class="text-white py-10" style="font-size: 14px">
          REVELYAにようこそ！
        </div>
        <div class="btn text-white text-center cursor-pointer pointer-events-auto" :class="start?' ':' hidden'" @click="Start()">GET STARTED</div>
      </div>
    </div>
    <BottomFooter></BottomFooter>
  </div>
</template>

<script>
import TopHeader from "../components/TopHeader.vue";
import BottomFooter from "../components/BottomFooter.vue";
export default {
  props:['start'],
  components: {
    TopHeader,
    BottomFooter,
  },
  data(){
    return{
      diplayerLoading:true,
    }
  },
 methods:{
  Start(){
    this.diplayerLoading = false;
    this.$parent.OpenThreejs();
  }
 }
};
</script>

<style scoped>
.bc {
  width: 100%;
  /* background: url(/@/assets/Revelya/loadingpage.jpg) no-repeat center; */
  background-size: cover;
}
.dialog {
  background-color: rgba(0, 0, 0, 0.756);
  width: 480px;
  height: 480px;
  position: absolute;
  top: 20%;
  left: 15%;
}
 .btn {
  width: 320px;
  height: 60px;
  border: 4px solid white;
  background-color: #ff8900;
  line-height: 55px;
  border-radius: 35px;
  font-size: 18px;
}
</style>
