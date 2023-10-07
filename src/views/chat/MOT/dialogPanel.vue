 

<template >
  <!-- pc端  图文内容-->
  <div class="absolute z-50 w-full h-full flex pointer-events-none">
    <div v-if="display"
      class="
        h-1/2
        flex
        mx-auto
        max-w-1200px
       w-1/2
        p-2
        bg-white
        rounded-md
        shadow-md
        text-red-900 text-xl
        self-center
        relative
       pointer-events-auto
      "
    >
      <!-- 内容 -->
      <!-- <div class=" absolute left-0 top-0  w-full h-full ">
        <iframe class=" w-full h-full " :src="iframeSrc" frameborder="0"></iframe>
      </div> -->

      <div class=" hidden w-full h-full">
          <img class="w-full h-full" :src="imgSrc" alt="" />
      </div> 
      <div class="p-5">{{content}}</div>

      <!-- 关闭按钮 -->
      <div
        @click="display=false"
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
       pointer-events-auto
        "
      >
        <div class="self-center mx-auto">X</div>
      </div>


    </div>
    <div class=" bg-gray-100 rounded-full absolute z-20 right-60 bottom-60  w-16 h-16 text-gray-500 flex 
       pointer-events-auto"
    @click="Close()"
    >
      <div class=" self-center mx-auto ">
        返回
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
      content:"",
      display:false,
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
      this.$parent.CloseDialogPanel(); 
    },
 
    //外部传入数据信息，
    loadData(modelData) {
      this.content = "热点id " + modelData.id + " 的内容 ";
      this.display = true;
    },
    loadMsg(msg) {
      this.content = msg+ " 的内容 ";
      this.display = true;
    },
  },
};
</script>

<style scoped>
</style> 