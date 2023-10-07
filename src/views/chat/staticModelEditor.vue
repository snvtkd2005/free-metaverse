

// 上传 静态模型 配置

<template>
  <div class="absolute left-0 top-0 w-full h-full flex">
    <div
      class="
        relative
        self-center
        mx-auto
        w-3/4
        h-3/4
        bg-gray-100
        rounded-md
        text-xs
      "
    >
      <div
        class="
          absolute
          -right-5
          -top-5
          w-10
          h-10
          bg-gray-300
          shadow-md
          rounded-md
          flex
          cursor-pointer
        "
        @click="Close()"
      >
        <div class="self-center mx-auto">关闭</div>
      </div>

      <div class="my-3 mx-auto">预览静态模型</div>

      <div class="w-full h-5/6 flex">

        <!-- 中间角色  -->
        <div class="mx-auto w-1/2 h-full relative">
          <div
            id="contain"
            class="w-full h-full bg-gray-700"
            ref="YJ3dscene"
          ></div>
          <div v-if="loading" class="absolute left-0 top-0 w-full h-full flex">
            <div class="text-xl text-white self-center mx-auto">
              {{ loadTip }}
            </div>
          </div>
        </div>
 
      </div>

      <div class="w-full flex text-xl h-10 mt-3">
        <div class="self-center mx-auto flex gap-x-5">
 
          <el-upload
            class="bg-transparent"
            action=""
            multiple
            :before-upload="handleBeforeUpload"
            :accept="accept"
            :show-file-list="false"
          >
            <!-- :before-upload="changeFile" -->
            <div
              class="
                el-upload__text
                rounded-md
                shadow-md
                p-2
                w-20
                bg-gray-100
                cursor-pointer
              "
            >
              上传
            </div>
          </el-upload>
          <div
            @click="Save()"
            class="rounded-md shadow-md p-2 w-20 bg-gray-100 cursor-pointer"
          >
            保存
          </div>
        </div>
      </div>
      <div v-if="error" class="text-red-500">{{ errorTip }}</div>

    <div class=" absolute left-0 bottom-10 text-left p-5">
      <div>操作提示：</div>
      <div>1，同时选中模型和贴图上传，模型支持fbx、gltf格式</div>
      <div>2，调整合适视角后保存，保存成功后可关闭上传窗口。</div>
      <div>3，在 用户上传模型库 中找到并使用上传的模型</div>
    </div>
  </div>
    </div>


</template>

<script>
import { YJ3dScene } from "../../threeJS/YJ3dScene.js";

export default {
  components: {
    YJ3dScene,
  },
  data() {
    return {
      error: false,
      errorTip: "",
      avatar: null,
      selectCurrentIndex: 0,
      animations: [
        // {
        //   clipIndex: 0,
        //   timeScale: 1,
        //   animName: "idle",
        //   connectAnim: "",
        //   targetIndex: -1,
        // },
        // {
        //   clipIndex: 1,
        //   timeScale: 1,
        //   animName: "run",
        //   connectAnim: "",
        //   targetIndex: -1,
        // },
        // {
        //   clipIndex: 2,
        //   timeScale: 1,
        //   animName: "jump",
        //   connectAnim: "",
        //   targetIndex: -1,
        // },
      ],
      animationsData: [
        {
          clipIndex: 0,
          animName: "idle",
          timeScale: 1,
          connected: false,
          targetIndex: 0,
        },
        {
          clipIndex: 1,
          animName: "walk",
          timeScale: 1,
          connected: false,
          targetIndex: 1,
        },
        {
          clipIndex: 2,
          animName: "jump",
          timeScale: 1,
          connected: false,
          targetIndex: 2,
        },
      ],

      cTime: "",
      currentTime: "",
      loading: false,
      height: 1.7,
      modelData: {},
      publicUrl: "",
      fileName: "",
      fileList: [],
      fileSize: 5,
      accept: ".jpg,.jpeg,.bmp,.png,.bin,.gltf,.glb,.fbx,.FBX",
      loadTip: "加载中，请稍候。。。",

      folderPath:"models/staticModels/",
      hasModel:false,
    };
  },

  mounted() {
    this._YJ3dScene = null;

    this._YJ3dScene = new YJ3dScene(this.$refs.YJ3dscene, this);
    this.renderScene();
    // this.publicUrl = "D:/VueLX/unitywebglVue/public/";
    this.publicUrl = "C:/wamp/www/vue/yjwebgame/public/";
    // this.publicUrl = this.$publicUrl;
  },
  methods: {
    Close() {
      this.cTime = "";
      this.currentTime = "";
      this.$parent.openStaticModelUpload = false;
    },
    Upload() {},
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      console.log("文件上传成功");
    },
    handleBeforeUpload(file) {
      // if (this.fileSize) {
      //   const isLt = file.size / 1024 / 1024 < this.fileSize;
      //   if (!isLt) {
      //     this.SetErrorTip(`上传文件大小不能超过 ${this.fileSize} MB!`);
      //     return false;
      //   }
      // }

      // this.fileList.add(file);
      // console.log(file);
      // console.log(fileList);
      // return;
      let filename = file.name;
      if (filename.indexOf(".gltf") > -1 || filename.indexOf(".fbx") > -1
      || filename.indexOf(".FBX") > -1) {
        this.fileName = file.name;
      }

      if (this.cTime == "") {
        this.currentTime = parseInt(new Date().getTime()) + "";
        this.cTime = "" + this.currentTime;
        // this.cTime = this.$getDateYM() + "/" + this.currentTime;
      }
      this.UploadFiles(file);
    },
    UploadFiles(file) {
      this.loading = true;
      this.hasModel = false;
      let that = this;

      //上传到本地 或 0SS
      this.$uploadFile(
        file,
        this.publicUrl + this.folderPath + this.cTime,
        file.name,
        (url) => {
          //先记录旧照片
          console.log("上传文件后的返回值", url);
          if (url.indexOf(".gltf") > -1 || url.indexOf(".fbx") > -1|| url.indexOf(".FBX") > -1) {
            setTimeout(() => {
              that.init(that.cTime + "/" + that.fileName);
            }, 3000);
          }
        }
      ); 
    },

    init(filePath) {

      // console.log("加载模型" + this.$publicUrl + this.folderPath + filePath);
      this._YJ3dScene.LoadStaticModel(
        this.$publicUrl + this.folderPath + filePath,this.LoadCompleted
      );
    },
    //实时刷新
    renderScene() {
      this._YJ3dScene.update();

      requestAnimationFrame(this.renderScene);
    },
    SetErrorTip(e) {
      this.error = true;
      this.errorTip = e;
      let that = this;
      setTimeout(() => {
        that.error = false;
      }, 3000);
    },
    // 保存动作配置文本
    Save() {
        if (!this.hasModel ) {
          this.SetErrorTip("未上传模型");
          return;
        }

      //同时保存一张截图到上传文件夹
      this.canvasCut(this._YJ3dScene.getCanvasImg());
 
      this.modelData.modelType = "静态模型";
      this.modelData.name = this.fileName
        .replace(".gltf", "")
        .replace(".FBX", "")
        .replace(".fbx", "");
      this.modelData.img =
        this.folderPath +
        this.currentTime +
        "/" +
        this.currentTime +
        "_thrumb.png";
      this.modelData.modelPath =
        this.folderPath + this.currentTime + "/" + this.fileName;
      
      this.SaveAnimationData(this.modelData);
      
    },
    //#region
    //#endregion
    //#region 保存动画数据
    //string转blob , blob再转file
    stringtoBlob(content, name) {
      let str = new Blob([content], { type: "application/json" });
      return new File([str], name, {
        type: "application/json",
      });
    },
    SaveAnimationData(modelData) {
      let s = JSON.stringify(modelData);
      console.log(s);

      this.$uploadFile(
        this.stringtoBlob(s, "test"),
        this.publicUrl + this.folderPath + this.cTime,
        this.currentTime + "_modelData.txt",
        (url) => {
          //先记录旧照片
          // console.log("上传文件后的返回值", url);
          this.SetErrorTip("保存成功");
        }
      );
    },
    //#endregion

    //#region  保存截图
    // base64转file,用来保存file
    dataURLtoBlob(dataurl, name) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], name, {
        type: mime,
      });
    },
    // 保存窗口截图
    canvasCut(dataBase64) {
      this.$uploadFile(
        this.dataURLtoBlob(dataBase64, "test"),
        this.publicUrl + this.folderPath + this.cTime,
        this.currentTime + "_thrumb.png",
        (url) => {
          //先记录旧照片
          // console.log("上传文件后的返回值", url);
        }
      );

      return;
      //
      let img = new Image();
      img.src = dataBase64; // toDataURL :图片格式转成 base64

      var that = this;
      setTimeout(() => {
        console.log("读取截图大小为：" + img.width + " " + img.height);
        var nowcanvas = document.getElementById("nowcanvas");
        var nowcontext = nowcanvas.getContext("2d");
        that.imgCut(nowcontext, img, 1920, 1080, 400, 300, 800, 600);
      }, 500);
    },

    imgCut(context, image, imgElementW, imgElementH, sx, sy, w, h) {
      //清理画布，便于重新绘制
      // context.clearRect(0, 0, imgElementW, imgElementH);
      //计算 ：比例 = 原图像/显示图像
      var ratioW = image.width / imgElementW;
      var ratioH = image.height / imgElementH;
      console.log("原图大小为：" + image.width + " " + image.height);

      //从原图的哪个坐标位置开始截取
      var imageStartX = parseInt(image.width / 2 - (image.width * 0.3) / 2);
      var imageStartY = parseInt(image.height / 2 - (image.height * 0.4) / 2);
      console.log("截图起始位置为：" + imageStartX + " " + imageStartY);

      //从原图中截取多大像素的区域
      var cutWidth = parseInt(image.width * 0.3);
      var cutHeight = parseInt(image.height * 0.4);
      console.log("截图区域大小为：" + cutWidth + " " + cutHeight);

      //设置画布尺寸为截图区域尺寸。  的一半，会自动缩放
      var nowcanvas = document.getElementById("nowcanvas");
      nowcanvas.width = cutWidth;
      nowcanvas.height = cutHeight;

      nowcanvas.width = parseInt(cutWidth / 2);
      nowcanvas.height = parseInt(cutHeight / 2);

      var canvasWidth = nowcanvas.width;
      var canvasHeight = nowcanvas.height;
      console.log("画布大小为：" + canvasWidth + " " + canvasHeight);

      context.drawImage(
        image,
        imageStartX,
        imageStartY,
        cutWidth,
        cutHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      );
      this.SaveCanvas();
      return;
    },
    SaveCanvas() {
      var nowcanvas = document.getElementById("nowcanvas");
      this.form.imgSrc = nowcanvas.toDataURL("image/jpeg");
    },
    //#endregion
 
    LoadCompleted() {
      this.loading = false;
      this.hasModel = true;

    },

    update() {
      requestAnimationFrame(this.update);
    },
  },
};
</script>

<style>
</style>
