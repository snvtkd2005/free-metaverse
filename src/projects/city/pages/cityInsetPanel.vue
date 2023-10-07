 

<template >
  <!-- pc端  图文内容-->
  <div class="absolute z-50 w-full h-full hidden md:flex">
    <div
      class="
        h-400px
        flex
        mx-auto
        max-w-1200px
        p-2
        bg-white
        rounded-md
        shadow-md
        text-red-900 text-xl
        self-center
        relative
      "
    >
      <!-- 内容 -->
      <!-- <div class=" absolute left-0 top-0  w-full h-full ">
        <iframe class=" w-full h-full " :src="iframeSrc" frameborder="0"></iframe>
      </div> -->

      <div class="w-full h-full">
          <img class="w-full h-full" :src="imgSrc" alt="" />
      </div> 
      <div class="p-5">图文内容图文内容图文内容图文内容图文内容图文内容</div>

      <!-- 关闭按钮 -->
      <div
        @click="Close()"
        class="
          flex
          bg-gray-100
          rounded-full
          shadow-md
          w-10
          h-10
          absolute
          -right-2
          -top-2
         cursor-pointer
        "
      >
        <div class="self-center mx-auto">X</div>
      </div>
    </div>
  </div>
 

</template>

<script>


export default {
  props: [],
  components: {
    
  },
  data() {
    return {
      iframeSrc:"",
      imgSrc:"",
      
    };
  }, 
  //初始化函数
  mounted() {
    
  },
  methods: {
 
    SetIframeSrc(src){
      // this.iframeSrc = src;
      this.imgSrc = src;
    },
    Init() {
       
    },
    Close() {
      this.$parent.isInsertPanel = false;
    },
 
    //筛选
    async loadData() {
       
    },
    
  },
};
</script>

<style scoped>
</style> 