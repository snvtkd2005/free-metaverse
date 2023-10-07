<template>
  <div class="labelPage flex bg-gray-500 w-screen h-full justify-around">
    <div class="w-28 h-72">
        <img class="w-full h-full" :src="publicUrl+'images/sps/caiyongqingbao.png'" alt="">
    </div>
    <div class="w-28 h-64">
        <img class="w-full h-full" :src="publicUrl+'images/sps/huisheqingbao.png'" alt="">
    </div>
    <div class="w-28 h-72">
        <img class="w-full h-full" :src="publicUrl+'images/sps/shiye.png'" alt="">
    </div>
    <div class="w-28 h-72">
        <img class="w-full h-full" :src="publicUrl+'images/sps/shiyeshinei.png'" alt="">
    </div>
    <div class="w-28 h-72">
        <img class="w-full h-full" :src="publicUrl+'images/sps/zhizuoshinei.png'" alt="">
    </div>
  </div>
</template>

<script>
export default {
data(){
    return{
        publicUrl:"./public/sps/"
    }
}
}
</script>

<style>

</style>