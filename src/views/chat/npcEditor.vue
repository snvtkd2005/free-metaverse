

// NPC 编辑页  皮肤从已上传的角色模型中选择

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

      <div class="my-3 mx-auto">NPC 配置</div>

      <div class="w-full h-5/6 flex">
        <!-- 左侧动作列表 -->
        <div class="w-44 px-4">
          <div>动作列表</div>
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
            </div>
          </div>

          <!-- npc名称 -->
          <div class="h-10 w-40 flex">
            <div class="leading-10">NPC名称</div>
            <!-- npc名称 input -->
            <div class="ml-5 w-20 h-full">
              <input
                class="w-full h-full px-1"
                v-model="npcName"
                @change="ChangeNpcName"
                type="text"
              />
            </div>
          </div>

          <!-- 碰撞半径 -->
          <div class="h-10 w-40 flex">
            <div class="leading-10">碰撞半径</div>
            <!-- npc名称 input -->
            <div class="ml-5 w-20 h-full">
              <input
                class="w-full h-full px-1"
                v-model="radius"
                @change="ChangeRadius"
                type="number"
              />
            </div>
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
      </div>

      <div class="w-full flex text-xl h-10 mt-3">
        <div class="self-center mx-auto flex gap-x-5">
          <div
            @click="Save()"
            class="rounded-md shadow-md p-2 w-20 bg-gray-100 cursor-pointer"
          >
            保存
          </div>
        </div>
      </div>
      <div v-if="error" class="text-red-500">{{ errorTip }}</div>

      <div class="absolute left-0 bottom-10 text-left p-5">
        <div>操作提示：</div>
        <div>1，在已上传的角色模型中选择作为npc</div>
        <div>2，设置npc名称 和 碰撞有效半径</div>
        <div>3，点击保存，保存成功后可关闭上传窗口。</div>
        <div>4，在 用户上传模型库 中找到并使用上传的NPC模型</div>
      </div>
    </div>
  </div>
  <!-- 角色选择 -->
  <div
    class="
      absolute
      top-0
      left-0
      overflow-y-auto
      overscroll-auto
      grid grid-cols-4
      gap-5
      w-96
      h-20
      px-5
    "
  >
    <div
      v-for="(item, i) in modelsList"
      :key="i"
      :index="item.modelData.img"
      class="
        w-16
        h-16
        bg-blue-100
        self-center
        mx-auto
        rounded-md
        shadow-md
        hover:bg-blue-400
        cursor-pointer
        flex
      "
      :class="
        selectModelItem.name == item.modelData.name
          ? 'bg-blue-400'
          : 'bg-blue-100'
      "
      @click="SelectModel(item)"
    >
      <div class="self-center mx-auto p-2">
        <img
          class="w-full h-full"
          :src="$publicUrl + item.modelData.img"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { YJ3dScene } from "../../threeJS/YJ3dScene.js";
import { GetPathFolders, LoadFile } from "/@/utils/api.js";

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
      npcName: "npcname",
      modelsList: [],

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
 
      currentTime: "",
      loading: false,
      height: 1.7,
      avatarData: {},
      fileName: "",
      selectModelItem: { name: "", img: "" },
      loadTip: "加载中，请稍候。。。",
      radius:1,
      folderPath:"models/npc/",
    };
  },

  mounted() {
    this._YJ3dScene = null;
    this._YJ3dScene = new YJ3dScene(this.$refs.YJ3dscene, this);
    this._YJ3dScene.CreateVaidArea(this.radius);
    this.renderScene();
    this.SetEyeHeight();
    // this.serverPath = "D:/VueLX/unitywebglVue/public/";
    
    this.serverPath = "C:/wamp/www/vue/yjwebgame/public/"; //+"models/players";

    var that = this;
    this.$nextTick(function () {
      that.Load("models/players", this.serverPath);
    });
  },
  methods: {
    //------------- 玩家创建模型 开始 -------------

    SelectModel(item) {
      
      if (this.currentTime == "") {
        this.currentTime = parseInt(new Date().getTime()) + ""; 
      }
      this.modelData = item.modelData;
      this._YJ3dScene.ChangeAvatarByCustom(
        item.modelData,
        this.npcName,
        this.SetAvatar
      );
    },
    ChangeNpcName() {
      this._YJ3dScene.UpdateNameTransContent(this.npcName);
    },
    ChangeRadius(){
    this._YJ3dScene.CreateValidArea(this.radius);
      
    },
    //-------------  玩家创建模型 结束 -------------
    async Load() {
      //加载角色模型
      let path = "models/players";
      let fromData = new FormData();
      // fromData.append("filePath","D:/VueLX/unitywebglVue/public");
      fromData.append("filePath", this.serverPath + path);
      let response = await GetPathFolders(fromData);
      for (let i = 0; i < response.length; i++) {
        const item = response[i];
        this.LoadTxt(item, this.serverPath + path);
      }
    },
    async LoadTxt(filePath, serverPath) {
      // console.log("加载文本", this.serverPath+"/" +filePath+"/"+filePath+"_avatar.txt");
      let fromData = new FormData();
      fromData.append(
        "dataPath",
        serverPath + "/" + filePath + "/" + filePath + "_avatar.txt"
      );
      let response = await LoadFile(fromData);
      if (response == null || response == "") {
        return;
      }
      console.log("加载角色数据", response);
      this.modelsList.push({ modelType: "角色", modelData: response });
    },

    Close() { 
      this.currentTime = "";
      this.$parent.openModelUpload = false;
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
      //未选择角色 return
      
      if(this.avatar == null){  return;  }

      //同时保存一张截图到上传文件夹
      this.canvasCut(this._YJ3dScene.getCanvasImg());
 
      this.avatarData.modelType = "npc";
      this.avatarData.name = this.npcName; 
      this.avatarData.modelPath = this.modelData.modelPath; 
      this.avatarData.img =
        this.folderPath  +
        this.currentTime +
        "/" +
        this.currentTime +
        "_thrumb.png";
        this.modelData.modelType = "npc";
        this.modelData.name = this.npcName;
        this.modelData.radius = this.radius;
        this.modelData.img = this.avatarData.img
      this.avatarData.modelData = this.modelData;
        
      this.SaveAnimationData(this.avatarData);
    },
    //#region
    //#endregion
    //#region 保存动画数据
    
    SaveAnimationData(avatarData) {
      let s = JSON.stringify(avatarData);
      console.log(s);

      this.$uploadFile(
        this.$stringtoBlob(s, "test"),
        this.serverPath +  this.folderPath  + this.currentTime,
        this.currentTime + "_avatar.txt",
        (url) => {
          
          // console.log("上传文件后的返回值", url);
          this.SetErrorTip("保存成功");
        }
      );
    },
    //#endregion

    //#region  保存截图 
    // 保存窗口截图
    canvasCut(dataBase64) {
      this.$uploadFile(
        this.$dataURLtoBlob(dataBase64, "test"),
        this.serverPath + this.folderPath  + this.currentTime,
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
    ChangeAnim(i) {
      this.selectCurrentIndex = i;
      this.avatar.ChangeAnimByIndex(i, this.animations[i].timeScale);
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
