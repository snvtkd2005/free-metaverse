
// UV动画设置
<template>
  <!-- 场景设置面板 -->
  <div class="
              w-80
              max-w-md
               p-2
             text-white
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">avatar设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80 h-auto mb-2     ">

      <div class=" self-center w-40  truncate" v-show="item.display">
        {{ item.title }}
      </div>
      <div class=" self-center w-20 ">
        <div v-if="item.type == 'file'" v-show="item.display" class=" relative flex  gap-2 cursor-pointer  "
          @click="SelectFile(item, i)">
          <div class=" absolute right-0 w-auto h-6 rounded-sm bg-gray-50 flex">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'upload'" v-show="item.display" class=" relative flex  gap-2 cursor-pointer  ">
          <YJinput_upload class=" w-32 h-16 " :accept="item.accept" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'text'" class=" w-32 h-auto text-black ">
          <YJinput_text class=" w-full h-auto " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-20 h-16 text-black ">
          <YJinput_drop class=" w-32 h-16 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>


      </div>

    </div>
    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{ loadContent }}</div>
    </div>

    <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>

    <div v-if="inSelect">
      <div v-for="(item, i) in uvAnimList" :key="i" class="
                  self-center w-40 h-auto relative
                ">
        <div class=" w-40 h-20 self-center mx-auto 
                  cursor-pointer " @click="ClickUVAnim(item)">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item" />
        </div>
      </div>
    </div>


    <YJmedia class=" w-32 h-16 " :media-type="settingData.screenType" :media-id="settingData.id" />
  </div>
</template>

<script>

// import YJinput_text from "./components/YJinput_text.vue";
import YJinput_text from "./components/YJinput_textarea.vue";
import YJinput_drop from "./components/YJinput_drop.vue";
import YJinput_upload from "./components/YJinput_upload.vue";

import YJmedia from "./components/YJmedia.vue";

export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_text,
    YJinput_drop,
    YJinput_upload,

    YJmedia,
  },
  data() {
    return {
      chassisWidth: 2.2, //车身宽

      settingData: {
        id: "",
        height: 1.4,
        nameScale: 1,
        modelScale: 1,
        img: "images/player/13.png",
        modelType: "角色",
        modelPath: "models/player/unitychan/unitychan.gltf",
        animationsData: [
          { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
          { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 1 },
          { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 3 },
          { clipIndex: 3, animName: "run", timeScale: 1, connected: false, targetIndex: 2 }
        ]
      },

      setting: [

        // { property: "screenType", display: true, title: "屏幕类型", type: "drop", value: "图片", options: [], callback: this.ChangeValue },
        { property: "url", display: true, title: "网址", type: "text", value: "", callback: this.ChangeValue },
        // { property: "upload", display: true, title: "新建", type: "upload", value: "none", accept: ".png,.jpg", callback: this.ChangeValue },
        { property: "loadPath", display: false, title: "选择", type: "file" },

      ],
      imgAccept: ".png,.jpg",
      videoAccept: ".mp4",
      screenType: [
        { label: "图片", value: "image" },
        { label: "视频", value: "mp4" },
        { label: "直播流", value: "m3u8" },
      ],

      loadContent: "使用",
      inSelect: false,
    };
  },
  created() {

  },
  mounted() {


    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    }
    if (modelData.message == undefined) {
      this.settingData.id = this.$parent.folderBase + "";
      return;
    }

    console.log(" modelData = ", modelData);
    this.settingData = modelData.message.data;

    this.initValue();


  },
  methods: {

    initValue() {

      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == "url") {
          element.value = this.settingData.url;
        }
        // if (element.property == "loadPath") {
        //   if (this.$parent.updateModelTxtData) {
        //     element.display = false;
        //   }
        // }
      }

      if (this.settingData.url != "") {
        setTimeout(() => {
          this.load();
        }, 3000);
      }

    },
    load() {
      //替换角色控制器控制的角色
    },
    Init(_settingData) {
      this.settingData = _settingData;
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == "url") {
          element.value = this.settingData.url;
        }
      }
      console.log(" screen setting data ", _settingData);
    },
    ChangeValue(i, e) {

      // return;

      this.setting[i].value = e;
      // https://snvtkd2005.com/socketIOserver/socketIoServer/uploads/1691034641465/1691034641465_thumb.png
      // https://snvtkd2005.com/vue/dh2/metaverse/public/videos/movieSD.mp4

      this.settingData[this.setting[i].property] = e;

      console.log(i + " " + this.setting[i].value);
      // console.log(i + " " + this.setting[i].value + " " + e);

      // 
    },
    save() {
      // 单品中才有 updateModelTxtData
      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: "screen",
          data: this.settingData
        };
        this.$parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    Update() {

      // _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);

      this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.UpdateTransform(
        {
          pointType: "screen",
          data: this.settingData
        }
      );
      // 调用场景保存
      if (this.$parent.updateSceneModelData) {
        this.$parent.updateSceneModelData();
      }


    },
    SelectFile(item) {
      console.log(" ", item);
      if (item.title == '选择UV图') {
        this.inSelect = true;
        this.RequestGetAllUVAnim();
      }
    },
    async RequestGetAllUVAnim() {

    },

  },
};
</script>

<style scoped></style>
