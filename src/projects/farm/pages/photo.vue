
<!-- // 拍照 -->
<template>
  <div class=" photoBtn absolute right-10 top-10" @click="CallPhoto()">合影</div>

  <div v-if="photoCompleted" class=" absolute left-0 right-0 w-full h-full flex " ref="photoContent">
    <!-- 三维画面   -->
    <div class=" absolute w-full h-full mx-auto self-center ">
      <img ref="threeImage" src="" alt="">
    </div>

    <div class=" absolute top-40 right-40   ">
      <div class=" cursor-pointer " @click="ClickClose">关闭</div>
    </div>
    <div class=" absolute left-1/2 bottom-40    ">
      <div class=" cursor-pointer " @click="ClickSave">点击保存或长按图片保存</div>
    </div>

  </div>
  <div class="hidden absolute top-0 left-0">
    <canvas id="nowcanvas" class="bg-white"> </canvas>
  </div>


</template>

<script>


// import html2canvas from 'html2canvas';

export default {
  name: " ",
  components: {
  },
  data() {
    return {
      inshooting: true,
      publicUrl: "",
      photoCompleted: false,
    };
  },

  created() {

    this.publicUrl = this.$parent.GetPublicUrl();
  },
  mounted() {



  },
  methods: {
    ClickClose() {
      this.photoCompleted = false;
    },
    ClickSave() {
       //如果你需要下载截图，可以使用a标签进行下载
       let a = document.createElement("a");
      // a.href = canvas.toDataURL("image/jpeg");
      a.href =  this.$refs.threeImage.src;
      a.download = "sdf";
      a.click();
      a.remove();
    },
    // Photo() {
    //   return;

    //   let dataBase64 = this.$parent.$refs.YJmetaBase.ThreejsHumanChat.getCanvasImg();

    //   let image = new Image();
    //   image.src = dataBase64;	//将canvas转成image类型 
    //   this.$refs.threeImage.src = dataBase64;
    //   return;
    //   // let width = this.$refs.threeImage.width;
    //   // let height = this.$refs.threeImage.height;
    //   let width = 400;
    //   let height = 320;

    //   let that = this;
    //   // let el = document.getElementById("tutorialImg");
    //   let el = this.$refs.tutorialImg;
    //   html2canvas(el, {
    //     scale: 1,
    //     width: el.clientWidth,
    //     height: el.clientHeight,
    //     backgroundColor: null,
    //     // allowTaint: true,
    //     allowTaint: false,
    //     useCORS: true,
    //   }).then((canvas) => {
    //     this.$refs.threeImage.src = canvas.toDataURL("image/png");
    //     return;

    //     var canvas2 = document.createElement("canvas");
    //     canvas2.width = width;
    //     canvas2.height = height;
    //     canvas2.getContext("2d").drawImage(image, 0, 0, width, height);//截


    //     setTimeout(() => {

    //       canvas2.getContext("2d").drawImage(canvas, 0, 0, width, height);//截
    //       setTimeout(() => {
    //         var dataURL = canvas2.toDataURL("image/png");  //将图片转成base64格式
    //         this.$refs.threeImage.src = dataURL;
    //         this.inshooting = false;
    //       }, 20);
    //       return;

    //     }, 20);

    //   });


    // },
    CallPhoto() {
      this.$parent.Photo((canvas) => {
        this.photoCompleted = true;
        this.$nextTick(() => {
          this.$refs.threeImage.src = canvas;
        });
      });
    },


  },
};
</script>
<style scoped>
.photoBtn {
  position: absolute;
  right: 5px;
  top: 5px;
}

.tutorialImg {
  position: absolute;
  right: 200px;
  bottom: 0;
  width: 400px;
  height: 300px;

}

.tutorialImgImag {

  width: 40px;
  height: 40px;
  opacity: 0.3;

}

.tutorialImg2 {
  position: absolute;
  left: 40px;
}
</style>