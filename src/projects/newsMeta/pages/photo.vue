
<!-- // 拍照 -->
<template>
  <div class=" photoBtn absolute right-10 top-10" @click="CallPhoto()">合影</div>

  <div class=" photoContent absolute left-0 right-0 w-1/2 h-1/2" ref="photoContent">
    <!-- 三维画面   -->
    <div class=" w-full h-full ">
      <img ref="threeImage" src="" alt="">
    </div>
    <!-- 合成元素 -->
    <!-- <div id="tutorialImg" class=" absolute left-0 top-0 w-full h-full bg-blue-200 " v-if="inshooting">
      <div class=" absolute  right-2 bottom-2">
        <div class="">
          <img class=" w-20 h-20 opacity-10 " :src="publicUrl + 'checkPoint.png'" alt="">
        </div>
        <div>2023.02.10</div>
        <div>徐家汇</div>
      </div>
    </div> -->
  </div>
  <div class="hidden absolute top-0 left-0">
    <canvas id="nowcanvas" class="bg-white"> </canvas>
  </div>
  <div class=" hidden tutorialImg  " v-if="inshooting">
    <div id="tutorialImg" class=" tutorialImg " ref="tutorialImg">
      <div class="tutorialImg2">
        <img class=" tutorialImgImag " :src="publicUrl + 'checkPoint2.png'" alt="">
      </div>
      <div>2023.02.10</div>
      <div>徐家汇</div>
    </div>
  </div>
</template>

<script>


import html2canvas from 'html2canvas';

export default {
  name: " ",
  components: {
  },
  data() {
    return {
      inshooting: true,
      publicUrl: "",
    };
  },

  created() {

    this.publicUrl = this.$parent.GetPublicUrl();
  },
  mounted() {



  },
  methods: {
    Photo() {

      let dataBase64 = this.$parent.$refs.YJmetaBase.ThreejsHumanChat.getCanvasImg();

      let image = new Image();
      image.src = dataBase64;	//将canvas转成image类型 
      this.$refs.threeImage.src = dataBase64;
      return;
      // let width = this.$refs.threeImage.width;
      // let height = this.$refs.threeImage.height;
      let width = 400;
      let height = 320;

      let that = this;
      // let el = document.getElementById("tutorialImg");
      let el = this.$refs.tutorialImg;
      html2canvas(el, {
        scale: 1,
        width: el.clientWidth,
        height: el.clientHeight,
        backgroundColor: null,
        // allowTaint: true,
        allowTaint: false,
        useCORS: true,
      }).then((canvas) => {
        this.$refs.threeImage.src = canvas.toDataURL("image/png");
        return;

        var canvas2 = document.createElement("canvas");
        canvas2.width = width;
        canvas2.height = height;
        canvas2.getContext("2d").drawImage(image, 0, 0, width, height);//截


        setTimeout(() => {

          canvas2.getContext("2d").drawImage(canvas, 0, 0, width, height);//截
          setTimeout(() => {
            var dataURL = canvas2.toDataURL("image/png");  //将图片转成base64格式
            this.$refs.threeImage.src = dataURL;
            this.inshooting = false;
          }, 20);
          return;

        }, 20);

      });


    },
    CallPhoto() {
      this.$parent.Photo((canvas)=>{
        this.$refs.threeImage.src =canvas;
      });
    },


  },
};
</script>
<style scoped>
.photoContent {

  position: absolute;
  left: 0px;
  top: 0px;
  width: 50%;
  height: 50%;
}

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