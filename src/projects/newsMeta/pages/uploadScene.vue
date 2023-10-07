

// 上传Scene文件夹所有文件

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
      <div class="p-2 text-2xl">项目Scene文件上传</div>
      <div class="w-full h-5/6 flex">
        <!-- 筛选 -->
        <div class="flex left-0 h-20">
          <div class="px-2 self-center text-lg">项目名</div>
          <div class="self-center">
            <el-select
              v-model="selectProjectName"
              placeholder="选择项目"
              @change="OnGroupNameChange"
            >
              <el-option
                v-for="item in projectList"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
                <span style="">{{ item.value }}</span>
              </el-option>
            </el-select>
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
                w-32
                bg-gray-100
                cursor-pointer
              "
            >
              上传文件
            </div>
          </el-upload>
        </div>

        <div style="cursor: pointer">
          <span class="upload-span">上传Scene文件夹</span>
          <input
            ref="fileRef"
            type="file"
            name="file"
            webkitdirectory
            @change.stop="change"
          />
        </div>
      </div>
      <div v-if="error" class="text-red-500">{{ errorTip }}</div>

      <div class="absolute left-0 bottom-10 text-left p-5">
        <div>操作提示：</div>
        <div>1，选择项目名</div>
        <div>2，首次上传，建议上传整个Scene文件夹</div>
        <div>a)，单独上传文件只可选择Scene文件夹下的文件</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      error: false,
      errorTip: "",

      selectProjectName: "newsMeta",
      selectProjectPath: "",
      projectList: [
        {
          value: "newsMeta",
          serverPath: "newsMeta/models/",
        },
      ],

      publicUrl: "",
      fileName: "",
      fileList: [],
      fileSize: 5,
      accept: ".jpg,.jpeg,.bmp,.png,.bin,.gltf,.glb,.fbx,.FBX,.txt",
      loadTip: "加载中，请稍候。。。",
      loadCount: 0,
      loadNum: 0,
    };
  },

  mounted() {
    
    this.publicUrl = "C:/inetpub/wwwroot/vue/newsMeta/public/";
    
    this.OnGroupNameChange(this.selectProjectName);
    // this.publicUrl = this.$publicUrl;
  },
  methods: {
    // 方法
    change() {
      console.log(this.$refs.fileRef.files); //文件列表
      let files = this.$refs.fileRef.files;
      this.loadCount = files.length;

      for (let i = 0; i < files.length; i++) {
        this.UploadFilesDire(files[i]);
      }
    },
    OnGroupNameChange(val) {
      for (let i = 0; i < this.projectList.length; i++) {
        const element = this.projectList[i];
        if (element.value == val) {
          this.selectProjectPath = element.serverPath;
        }
      }

      console.log("in OnGroupNameChange " + this.selectProjectPath);
    },
    Upload() {},
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      console.log("文件上传成功");
    },
    handleBeforeUpload(file) {
      this.UploadFiles(file);
    },
    UploadFiles(file) {
      //上传到本地 或 0SS
      this.$uploadFile(
        file,
        this.publicUrl + this.selectProjectPath + "Scene",
        file.name,
        (url) => {
          //先记录旧照片
          console.log("上传文件后的返回值", url);
        }
      );
    },
    UploadFilesDire(file) {
      let filePath = file.webkitRelativePath.replace("/" + file.name, "");
      let that = this;
      //上传到本地 或 0SS
      this.$uploadFile(
        file,
        this.publicUrl + this.selectProjectPath + filePath,
        file.name,
        (url) => {
          //先记录旧照片
          console.log("上传文件后的返回值", url);
          that.loadNum++;
          if (that.loadNum >= that.loadCount) {
            console.log(" Scene文件夹全部上传完成");
          }
        }
      );
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
      if (this.animations.length == 0) {
        return;
      }
      if (this.animations.length < this.animationsData.length) {
        for (let i = 0; i < this.animationsData.length; i++) {
          const element = this.animationsData[i];
          if (element.connected == false) {
            element.connected = true;
            element.targetIndex = 0;
          }
        }
      } else {
        for (let i = 0; i < this.animationsData.length; i++) {
          const element = this.animationsData[i];
          if (element.connected == false) {
            this.SetErrorTip("未全部指定标准动作");
            return;
          }
        }
      }
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
    //#endregion
  },
};
</script>

<style>
</style>
