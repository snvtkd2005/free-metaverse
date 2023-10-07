<template>
<div class="flex justify-center items-center w-full h-full bg backdrop-blur-md absolute" v-show="isShowDialog">
  <div class="elevatorDialog flex justify-center items-center flex-col relative">
    <img :src="publicUrl+'images/dialog/elevator/bg.png'" alt="" class="absolute w-full h-full">

    <div class="que text-2xl text-center relative left-6 top-10">エレベーターに乗る</div>
    <div class="btn_item flex justify-center items-center relative left-6 mt-16">
        <div class="bg-white text-center w-20 h-10 text-2xl rounded-lg cursor-pointer" style="line-height:40px" @click="toSecondFloor">はい</div>
        <div class="border-2 border-white text-center w-20 h-10 text-2xl rounded-lg ml-10 cursor-pointer" style="line-height:40px" @click="close">いいえ</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
    // props:['isShowDialog'],
    data(){
        return{
            publicUrl: "./public/sps/",
            isShowDialog:false
        }
    },
    methods:{
        close(){
            this.isShowDialog = false
        },
        toSecondFloor(){
            _Global.SetGoFloor('jump_001')
            this.isShowDialog = false
        }
    }
}
</script>

<style scoped>
.bg{
    background: transparent;
}
.elevatorDialog{
    width: 30rem;
    height: 28rem;
    /* background: url(/public/sps/images/dialog/elevator/bg.png) no-repeat center center; */
    /* background-size: cover; */
}
.elevatorDialog .que{
    font-weight: bold;

}
</style>