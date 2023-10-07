 

<template >
  <!-- pc端  图文内容-->
  <div v-if="display0" class="absolute w-full h-full hidden md:flex">
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
      <!-- <div class="w-2/5 h-full">
          <img class="w-full h-full" :src="$localUrl + imgsrc1" alt="" />
      </div>  -->
      <div class="p-5">图文内容图文内容图文内容图文内容图文内容图文内容</div>
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
        "
      >
        <div class="self-center mx-auto">X</div>
      </div>
    </div>
  </div>

  <!-- 小窗口查看模型 -->
  <div v-show="display2" class="absolute w-full h-full hidden md:flex">
    <div
      class="
        h-5/6
        flex
        mx-auto
        w-full
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
      <div
        tabindex="-1"
        class="self-center mx-auto w-1/2 h-full"
        ref="YJ3dscene"
        id="YJ3dscene"
      ></div>

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
        "
      >
        <div class="self-center mx-auto">X</div>
      </div>
    </div>
  </div>

  <!-- 播放视频 -->
  <div v-show="display1" class="absolute w-full h-full hidden md:flex">
    <div
      class="
        h-2/3
        flex
        mx-auto
        w-full
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
      <!-- 视频 -->
      <div class="w-full h-full">
        <video
          id="minVideo"
          loop
          controls="" 
          :src="$publicUrl + '/video/1.mp4'"
        ></video>
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
        "
      >
        <div class="self-center mx-auto">X</div>
      </div>
    </div>
  </div>

  <!-- 上传图片 -->
  <div v-show="display3" class="absolute w-full h-full hidden md:flex">
    <div
      class="
        h-2/3
        flex
        mx-auto
        w-5/6
        p-2
        bg-white
        rounded-md
        shadow-md
        text-red-900 text-xl
        self-center
        relative
      "
    >
      <div>上传图片或视频，显示在共享大屏上</div>
      <!-- 上传 -->
      <div class="w-full h-full">
        <div class="mx-auto w-5/6 h-5/6 bg-gray-100">
          <div class="w-full h-full">
            <img
              v-show="imgPreviewSrc != ''"
              class="w-full h-full"
              :src="imgPreviewSrc"
              alt=""
            />
            <video
              class="w-full h-full"
              v-show="videoPreviewSrc != ''"
              controls
              loop
              :src="videoPreviewSrc"
            ></video>
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
              :on-preview="handlePreview"
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
              确定
            </div>
          </div>
        </div>
      </div>
      <div v-if="error" class="text-red-500">{{ errorTip }}</div>

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
import { nextTick } from "@vue/runtime-core";
// import { PostNewsAPI } from "/@/utils/api.js";

// import YJimageItem from "/@/components/YJ-imageItemM.vue";
import { YJ3dScene } from "../../threeJS/YJ3dScene.js";
import * as THREE from "three";

// 创建一个时钟对象Clock
var clock = new THREE.Clock();
const FPS = 30; // 指的是 30帧每秒的情况
const singleFrameTime = 1 / FPS;
let timeStamp = 0;
export default {
  props: ["btnname", "isRouter"],
  components: {
    // YJimageItem,
    YJ3dScene,
  },
  data() {
    return {
      
      display0: false, //打开图文
      display1: false, //播放视频
      display2: false, //展示模型
      display3: false, //3d页面上传图片、视频，在3d中播放
      accept: ".jpg,.jpeg,.png,.mp4",
      fileSize: 30,
      // fileSize: 5,
      error: false,
      errorTip: "",
      cTime: "",
      folderPath: "models/ppt/",

      imgPreviewSrc: "",
      videoPreviewSrc: "",

      fileName: "",
      publicUrl: "",
      file: null,
      pptid: "",
    };
  },
  // 监听路由变化
  // watch: {
  //   $route(to, from) {

  //     console.log( " 切换 djzl " +  to.path);
  //   },
  // },
  //初始化函数
  mounted() {
    // this.loadData();
    this.publicUrl = "C:/wamp/www/vue/yjwebgame/public/";

    // let id = this.$route.params.id;
    // console.log("id=" + id);
    // this.$parent.ChangeBtn("党建专栏");
    this._YJ3dScene = null;
  },
  methods: {
    //#region  上传图片 或 视频
    SetErrorTip(e) {
      this.error = true;
      this.errorTip = e;
      let that = this;
      setTimeout(() => {
        that.error = false;
      }, 3000);
    },
    handleBeforeUpload(file) {
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.SetErrorTip(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }

      if (this.cTime == "") {
        this.cTime = "" + parseInt(new Date().getTime()) + "";
        this.cTime = this.pptid;
      }
      this.file = file;
      // console.log(file);

      this.fileName = file.name;
      let type = "texture";
      if (this.fileName.indexOf(".mp4") > -1) {
        type = "video";

        this.imgPreviewSrc = "";
      } else {
        this.videoPreviewSrc = "";
      }
      if (type == "texture") {
        //使用FileReader读取文件
        if (window.FileReader) {
          let that = this;
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = function (e) {
            that.imgPreviewSrc = e.target.result;
          };
        } else {
          alert("你的浏览器不支持FileReader!");
        }
      } else {
        var objUrl = this.getObjectURL(file);
        // console.log("objUrl = " + objUrl);
        if (objUrl) {
          this.videoPreviewSrc = objUrl;
          // $("#video0").attr("src", objUrl);
        }
      }

      return;
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    Save() {
      this.UploadFiles(this.file);
    },
    UploadFiles(file) {
      this.loading = true;
      let that = this;
      //上传到本地 或 0SS
      this.$uploadFile(
        file,
        this.publicUrl + this.folderPath + this.cTime,
        file.name,
        (url) => {
          //先记录旧照片
          // console.log("上传文件后的返回值", url);
          setTimeout(() => {
            let type = "texture";
            if (url.indexOf(".mp4") > -1) {
              type = "video";
            } else {
            }
            that.UpdateToScene(type, that.cTime + "/" + that.fileName);
          }, 200);
        }
      );
    },
    // 上传成功后 在3d场景中更新
    UpdateToScene(type, filePath) {
      filePath = this.folderPath + filePath;

      if (type == "video") { 
        // filePath = this.$publicUrl + filePath;
        filePath = "public/" + filePath;
        
      }
      if (type == "texture") { 
        filePath = this.$publicUrl + filePath;
      }
      this.$parent.$refs.ThreejsHumanChat.UpdateAndSendSceneState(
        {id:this.pptid,state:{ type:type,path: filePath} }
      );
      this.Close();
    },

    //#endregion

    Init() {
      if (this._YJ3dScene != null) {
        this.renderScene();
        return;
      }
      this._YJ3dScene = new YJ3dScene(this.$refs.YJ3dscene, this);
      this._YJ3dScene.CreateTestBox();
      this.renderScene();
    },
    Close() {
      this.display0 = false;
      this.display2 = false;
      this.display3 = false;
      if (this.display1) {
        var video = document.getElementById("minVideo");
        video.pause();
        this.display1 = false;
      }
    },
    OpenContent(modelData) {
      if (modelData.type == 0) {
        this.display0 = true;
      }
      if (modelData.type == 1) {
        this.display1 = true;
      }
      if (modelData.type == 2) {
        this.display2 = true;
        let that = this;
        this.$nextTick(function () {
          that.Init();
        });
      }
      if (modelData.type == 3) {
        this.display3 = true;
        this.pptid = modelData.id;
      }
      console.log("点击热点 22", modelData);
    },
    //筛选
    async loadData() {
       
    },
    ChangePanel(btnName) {
      this.$router.push({
        path: "/content/" + btnName,
        query: {
          t: Date.now(),
        },
      });
    },

    //实时刷新
    renderScene() {
      if (!this.display2) {
        return;
      }

      const delta = clock.getDelta(); //获取自上次调用的时间差
      timeStamp += delta;
      //限制帧率在30帧
      if (timeStamp > singleFrameTime) {
        this._YJ3dScene.update();
        // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
        timeStamp = timeStamp % singleFrameTime;
      }
      requestAnimationFrame(this.renderScene);
    },
  },
};
</script>

<style scoped>
</style> 