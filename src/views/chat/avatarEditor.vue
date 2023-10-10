

// 上传角色是编辑角色动作配置

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

      <div class="my-3 mx-auto">角色动作配置</div>

      <div class="w-full h-5/6 flex">
        <!-- 左侧动作列表 -->
        <div class="w-44 px-4">
          <div>动作列表 -------- 动作速度</div>
          <div>
            <div
              v-for="(item, i) in animations"
              :key="i"
              :index="item.clipIndex"
              class="w-full h-8 self-center mx-auto flex mt-4"
            >
              <div
                @click="ChangeAnim(item.clipIndex)"
                class="
                  cursor-pointer
                  pointer-events-auto
                  self-center
                  mx-auto
                  w-2/3
                  h-full
                  mr-2
                  flex
                "
                :class="
                  selectCurrentIndex == item.clipIndex
                    ? ' bg-blue-300 '
                    : ' bg-blue-100 '
                "
              >
                <div class="self-center mx-auto">
                  {{ item.animName }}->{{ item.connectAnim }}
                </div>
              </div>

              <div
                v-if="item.targetIndex != -1"
                @click="Clear(item.clipIndex)"
                class="
                  w-8
                  self-center
                  text-xs
                  cursor-pointer
                  pointer-events-auto
                "
              >
                解绑
              </div>
              <!-- 速度跳转input -->
              <div class="ml-5 w-5 h-full">
                <input
                  class="w-full h-full px-1"
                  v-model="item.timeScale"
                  type="text"
                />
              </div>
            </div>
          </div>
          <!-- 角色高度 input -->
          <div class="mt-12 w-full h-10 flex gap-x-5">
            <div class="self-center">设置眼睛高度</div>
            <input
              class="w-10 h-10 px-1"
              v-model="height"
              @change="SetEyeHeight()"
              type="text"
            />
          </div>
        </div>

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

        <!-- 右侧标准动作名称 -->
        <div class="w-44 px-4">
          <div>标准动作名称</div>
          <div>
            <div
              v-for="(item, i) in animationsData"
              :key="i"
              :index="item.clipIndex"
              class="w-full h-8 self-center mx-auto flex mt-1"
              @click="SelectBaseAnim(item.clipIndex)"
              :class="
                item.connected
                  ? ' bg-gray-500  pointer-events-none  '
                  : ' bg-blue-200 cursor-pointer  pointer-events-auto '
              "
            >
              <div class="self-center mx-auto">
                {{ item.animName }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex text-xl h-10 mt-3">
        <div class="self-center mx-auto flex gap-x-5">
          <!-- <div
            @click="Upload()"
            class="rounded-md shadow-md p-2 w-20 bg-gray-100 cursor-pointer"
          >
            上传
          </div> -->
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
      <div>2，必须包含至少3个动作：待机、行走、跳跃</div>
      <div>  由于动作加载顺序可能不一样，所以需要绑定动作顺序</div>
      <div>3，设置眼睛高度，即角色视角拉近时的高度</div>
      <div>4，设置完成后保存，保存成功后可关闭上传窗口。</div>
      <div>5，在 用户上传模型库 中找到并使用上传的角色模型</div>
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
      avatarData: {},
      publicUrl: "",
      fileName: "",
      fileList: [],
      fileSize: 5,
      accept: ".jpg,.jpeg,.bmp,.png,.bin,.gltf,.glb,.fbx,.FBX",
      loadTip: "加载中，请稍候。。。",
    };
  },

  mounted() {
    this._YJ3dScene = null;

    this._YJ3dScene = new YJ3dScene(this.$refs.YJ3dscene, this);
    this.renderScene();
    this.SetEyeHeight();
    // this.publicUrl = "D:/VueLX/unitywebglVue/public/";
    this.publicUrl = "C:/wamp/www/vue/yjwebgame/public/";
    // this.publicUrl = this.$publicUrl;
  },
  methods: {
    Close() {
      this.cTime = "";
      this.currentTime = "";
      this.$parent.openModelUpload = false;
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
      if (filename.indexOf(".gltf") > -1 || filename.indexOf(".fbx") > -1) {
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

      let that = this;

      //上传到本地 或 0SS
      this.$uploadFile(
        file,
        this.publicUrl + "models/players/" + this.cTime,
        file.name,
        (url) => {
          //先记录旧照片
          console.log("上传文件后的返回值", url);
          if (url.indexOf(".gltf") > -1 || url.indexOf(".fbx") > -1) {
            setTimeout(() => {
              that.init(that.cTime + "/" + that.fileName);
            }, 3000);
          }
        }
      );
      return;
      for (let i = 0; i < this.fileList.length; i++) {
        const file = this.fileList[i];
        //上传到本地 或 0SS
        this.$uploadFile(
          file,
          this.publicUrl + "models/players/" + this.cTime,
          this.fileName,
          (url) => {
            //先记录旧照片
            console.log("上传文件后的返回值", url);
            if (url.indexOf(".gltf") > -1 || url.indexOf(".fbx") > -1) {
              that.init(this.cTime + "/" + this.fileName);
            }
          }
        );
      }
    },

    init(filePath) {
      // if (this.loading) {
      //   return;
      // }
      // console.log("加载模型" + this.$publicUrl + "models/players/" + filePath);
      this._YJ3dScene.LoadAvatar(
        this.$publicUrl + "models/players/" + filePath,
        // this.animationsData,
        null,
        this.SetAvatar
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
      if(this.animations.length == 0){
        return;
      }
      if(this.animations.length < this.animationsData.length){
        for (let i = 0; i < this.animationsData.length; i++) {
          const element = this.animationsData[i];
          if (element.connected == false) {
            element.connected = true;
            element.targetIndex = 0; 
          }
        }
      }else{

      for (let i = 0; i < this.animationsData.length; i++) {
        const element = this.animationsData[i];
        if (element.connected == false) {
          this.SetErrorTip("未全部指定标准动作");
          return;
        }
      }

      }

      //同时保存一张截图到上传文件夹
      this.canvasCut(this._YJ3dScene.getCanvasImg());

      this.avatarData.height = parseFloat(this.height);
      this.avatarData.modelType = "角色";
      this.avatarData.name = this.fileName
        .replace(".gltf", "")
        .replace(".fbx", "");
      this.avatarData.img =
        "models/players/" +
        this.currentTime +
        "/" +
        this.currentTime +
        "_thrumb.png";
      this.avatarData.modelPath =
        "models/players/" + this.currentTime + "/" + this.fileName;

      this.avatarData.animationsData = this.animationsData;
      this.SaveAnimationData(this.avatarData);
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
    SaveAnimationData(avatarData) {
      let s = JSON.stringify(avatarData);
      console.log(s);

      this.$uploadFile(
        this.stringtoBlob(s, "test"),
        this.publicUrl + "models/players/" + this.cTime,
        this.currentTime + "_avatar.txt",
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
        this.publicUrl + "models/players/" + this.cTime,
        this.currentTime + "_thrumb.png",
        (url) => {
          //先记录旧照片
          // console.log("上传文件后的返回值", url);
        }
      );
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

    // 设置角色眼睛高度
    SetEyeHeight() {
      this._YJ3dScene.SetEyeHeight(this.height);
    },

    Clear(i) {
      this.animations[i].connectAnim = "";
      this.animations[i].targetIndex = -1;
      this.UpdateBaseAnimState();
    },
    ChangeAnim(i) {
      this.selectCurrentIndex = i;
      this.avatar.ChangeAnimByIndex(i, this.animations[i].timeScale);

      if (this.animations[i].targetIndex != -1) {
        this.animationsData[this.animations[i].targetIndex].timeScale =
          parseFloat(this.animations[this.selectCurrentIndex].timeScale);
      }
    },
    SelectBaseAnim(i) {
      this.animations[this.selectCurrentIndex].connectAnim =
        this.animationsData[i].animName;
      this.animations[this.selectCurrentIndex].targetIndex = i;
      this.animationsData[i].targetIndex =
        this.animations[this.selectCurrentIndex].clipIndex;

      this.UpdateBaseAnimState();
    },
    UpdateBaseAnimState() {
      let selected = [];
      for (let index = 0; index < this.animations.length; index++) {
        const element = this.animations[index];
        if (element.targetIndex != -1) {
          selected.push({
            clipIndex: element.targetIndex,
            targetIndex: element.clipIndex,
          });
        }
      }

      for (let index = 0; index < this.animationsData.length; index++) {
        const element = this.animationsData[index];
        element.connected = false;
        element.targetIndex = -1;
      }

      for (let index = 0; index < selected.length; index++) {
        const element = selected[index];
        this.animationsData[element.clipIndex].connected = true;
        this.animationsData[element.clipIndex].targetIndex =
          element.targetIndex;
        if (element.timeScale == undefined) {
          element.timeScale = 1;
        }
        this.animationsData[element.clipIndex].timeScale = element.timeScale;
      }
    },
    SetAvatar(avatar) {
      this.avatar = avatar;
      // console.log("设置avatar ", avatar);
      this.animations = avatar.GetAnimation();

      if (this.animations.length > 0) {
        for (let index = 0; index < this.animations.length; index++) {
          const element = this.animations[index];
          element.timeScale = 1;
        }
        this.ChangeAnim(0);
      }
      this.loading = false;
    },

    update() {
      requestAnimationFrame(this.update);
    },
  },
};
</script>

<style>
</style>
