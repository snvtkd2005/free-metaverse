
// 在线聊天室 聊天界面 3d形象 聊天
<template>

  <!-- 加载loading -->
  <div class="  absolute w-full h-full top-0 left-0 z-50 flex   text-white">
    <div class=" absolute w-full h-full left-0 top-0 ">
      <img ref="bgImg" class=" bgImg  h-full mx-auto" :src="$publicUrl+'Columbia/bg.jpg'" alt=""
      :style="bgWidth"
      >

    </div>
    <div class="  self-center w-32 h-32 rounded-lg
        flex
        mx-auto  
       transform -translate-y-16
        pointer-events-none
        bg-color
      ">
      <div class=" w-full h-full p-3">
        <div class=" w-full h-20 flex " >
          <img class=" loading w-20 h-20 mx-auto" :src="$publicUrl+'Columbia/loading.gif'" alt="">
        </div>
        <div class=" flex text-lg ">
          <div class=" mx-auto tracking-wider ">穿行中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "loadingWX",
  components: {
  },
  data() {
    return {
      bgWidth :'transform : scaleX(1);',
    };
  },
  mounted() {
    let width =  window.innerWidth;
    let height =  window.innerHeight;


    // console.log(width,height);
    let w = (height/width) / (670/414) * 414;
    let scale = (height/width) / (670/414) ;
    if(scale<=1){return;}
    this.bgWidth='  transform : scaleX('+scale+');';

    // console.log(w,scale);

  },
  methods: {
    
  },
};
</script> 

<style scoped>
 .bgImg{
  width: 758px;
 }
.bg-color{
  background-color: #4c4c4c;
}
.loading{
  /* animation: myfirst2 2s infinite linear; */
}
@keyframes myfirst2
{
from {transform: rotate(0deg);}
to {transform: rotate(359deg);}
}
  
@keyframes myfirst
{
from {transform: rotate(0deg);}
to {transform: rotate(-359deg);}
}



</style>
 