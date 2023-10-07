<template>
  <div class="tipsTool w-1/2 h-56 absolute bottom-5 left-1/4 flex items-center" >
      <img :src="publicUrl+'images/tips/1.png'" alt="" class="w-full h-full" v-show="isShowTips" >
      <img :src="publicUrl+'images/tips/2.png'" alt="" class="w-36 h-14 cursor-pointer relative top-10 left-4" v-show="isShowTips" @click="isShowTips = !isShowTips">
      <img :src="publicUrl+'images/tips/3.png'" alt="" class="w-36 h-14 cursor-pointer absolute  -right-4 bottom-11" v-show="!isShowTips" @click="isShowTips = !isShowTips">
  </div>
</template>

<script>
export default {
data(){
    return{
        publicUrl:"./public/sps/",
        isShowTips:true
    }
}
}
</script>

<style>

</style>