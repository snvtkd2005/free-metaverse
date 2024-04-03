
// UV动画设置
<template>
  <!-- 场景设置面板 -->
  <div class="
              w-full
              max-w-md
               p-2
             text-white
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">屏幕设置</div>
    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div> 

    <!-- <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-full h-auto mb-2     ">

      <div class=" self-center w-1/2  truncate" v-show="item.display">
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
    </div> -->

    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">加载</div>
    </div>

    <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>

    <YJmedia ref="YJmedia" class=" w-32 h-16 " :media-type="settingData.screenType" :media-id="settingData.id" />
  </div>
</template>

<script>
 
import YJinputCtrl from "../components/YJinputCtrl.vue";

import YJmedia from "../components/YJmedia.vue";

export default {
  name: "settingpanel_uvanim",
  components: { 
    YJinputCtrl, 
    YJmedia,
  },
  data() {
    return {
      chassisWidth: 2.2, //车身宽
      pointType: "screen",
      settingData: {
        id: "",
        screenType: "image",
        url: "",
      },

      setting: [

        { property: "screenType", display: true, title: "屏幕类型", type: "drop", value: "图片", options: [
          { label: "图片", value: "image" },
          { label: "视频", value: "mp4" },
          { label: "直播流", value: "m3u8" },
        ], callback: this.ChangeValue },
        { property: "url", display: true, title: "网址", type: "textarea", value: "", callback: this.ChangeValue },
        // { property: "upload", display: true, title: "新建", type: "upload", value: "none", accept: ".png,.jpg", callback: this.ChangeValue },
        { property: "loadPath", display: false, title: "选择", type: "file" },

      ],
      imgAccept: ".png,.jpg",
      videoAccept: ".mp4",
      screenType: [
      ],
  
    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {


    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    } 
    if (modelData.message == undefined) {
      this.settingData.id = this.parent.folderBase + "";
      return;
    }

    console.log(" modelData = ", modelData);
    this.settingData = modelData.message.data;

    this.initValue();


  },
  methods: {

    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    },
    initValue() {

      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == "url") {
          element.value = this.settingData.url;
        }
      }

      if (this.settingData.url != "") {
        setTimeout(() => {
          this.load();
        }, 3000);
      }

    },
    load() {
      _Global.YJ3D._YJSceneManager.GetSingleModelTransform().
        GetComponent("Screen").Load(this.settingData.url,this.settingData.screenType);
    },
    Init(_settingData) {
      this.settingData = _settingData;
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
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
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    Update() {

      // _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);

      _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform()
          .SetMessage(this.getMessage());
      // 调用场景保存
      if (this.parent.updateSceneModelData) {
        this.parent.updateSceneModelData();
      }

    }, 

  },
};
</script>

<style scoped></style>
