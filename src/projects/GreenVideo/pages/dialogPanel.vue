 

<template >
  <!-- pc端  图文内容-->
  <div class="absolute z-50 w-full h-full flex pointer-events-none">
    <div
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
        self-center
        relative
       pointer-events-auto
      "
    >
      <!-- 内容 -->
      <!-- <div class=" absolute left-0 top-0  w-full h-full ">
        <iframe class=" w-full h-full " :src="iframeSrc" frameborder="0"></iframe>
      </div> -->

      <!-- <div class=" w-full h-full">
          <img class="w-full h-full" :src="publicUrl + imgSrc" alt="" />
      </div>  -->
      <div class=" self-center mx-auto grid gap-y-5">
        <div class=" bg-gray-300 rounded-md p-5"  @click="ChangeView(1)">打开小程序红包封面(coco-ssd)</div>
        <div  class=" bg-gray-300 rounded-md p-5" @click="ChangeView(2)">跳转第三方小程序</div>
      </div>

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
       pointer-events-auto
        "
      >
        <div class="self-center mx-auto">X</div>
      </div>


    </div>
    <!-- <div class=" bg-gray-100 rounded-full absolute z-20 right-60 bottom-60  w-16 h-16 text-gray-500 flex 
       pointer-events-auto"
    @click="Close()"
    >
      <div class=" self-center mx-auto ">
        返回
      </div>
    </div> -->

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
      publicUrl:"",
      contentList:[
        {id:"jieshaopai",content:"",img:"img/dialog/jiesho_baes_color.jpg"},
      ],
    };
  }, 
  created(){
    this.publicUrl =this.$parent.GetPublicUrl();
  },
  //初始化函数
  mounted() {
    
  },
  methods: {
    ChangeView(num){
      if(num==1){
        //打开小程序红包封面
        wx.miniProgram.navigateTo({ 
          url:'/pages-tfjs/tfjs/coco-ssd/index', 
          success: function(){ console.log('success') }, 
          fail: function(){ console.log('fail'); }, 
          complete:function(){ console.log('complete'); }
        });
      }
      if(num==2){
        //跳转第三方小程序
        // 带参跳转到本地小程序，由本地小程序页面获取参数，跳转到第三方小程序
        wx.miniProgram.navigateTo({ 
          url:'/pages/jump/index?id=xxxx', 
          success: function(){ console.log('success') }, 
          fail: function(){ console.log('fail'); }, 
          complete:function(){ console.log('complete'); }
        });
      }

    },
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
      // this.content = "热点id " + modelData.id + " 的内容 ";
      for (let i = 0; i < this.contentList.length; i++) {
        const element =  this.contentList[i];
        if(element.id ==  modelData.id){
          this.imgSrc = element.img;
          this.content = element.content;
        }
      }
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