
// UV动画设置
<template>
  <!-- 场景设置面板 -->
  <div class=" w-full max-w-md p-2  text-white  rounded-lg overflow-hidden  ">
    <div class=" text-left ">交互模型设置</div>
    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div>
    <div class=" mt-2 w-full h-10 text-white cursor-pointer " @click="ClickBtnHandler('保存')">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>
  </div>
</template>

<script>

import YJinputCtrl from "../components/YJinputCtrl.vue";

import * as Utils from "/@/utils/utils.js";


export default {
  name: "settingPanel_interactive",
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      pointType: "interactive",
      settingData: {
        imgPath: '',
        buff: "",
        buffValue: 0,
        relifeTime: 0,//重新生成间隔时间 秒
        type: "", //道具类型唯一id
        describe: "",//道具描述
        name: "",//道具名
        color: "#ffffff",
        row: 14,
        col: 1,
        speed: 1,
        delay: 100,
        isBlack: false,
      },
      setting: [
        { property: "name", display: true, title: "道具名", type: "text", value: "", callback: this.ChangeValue },
        { property: "imgPath", display: true, title: "选择图片", type: "file", filetype: "image", value: null },
        // {property: "color", title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeColor },
        // {property: "row", title: "UV X", type: "num", value: 14, callback: this.ChangeX },
        // {property: "col", title: "UV Y", type: "num", value: 1, callback: this.ChangeY },
        // {property: "speed", title: "播放速度", type: "slider", value: 1, min: 0.5, max: 5, step: 0.5, callback: this.SliderSpeed },
        // {property: "isBlack", title: "是否黑底", type: "toggle", value: false, callback: this.ChangeValue },
        {
          property: "buff", display: true, title: "触发效果", type: "drop", value: "加护甲", options: [
            { value: 'addArmor', label: '加护甲' },
            { value: 'addHealth', label: '加生命' },
            { value: 'addEnergy', label: '加能量' },
            { value: 'addGold', label: '加金币' },
          ], callback: this.ChangeValue,
        },
        { property: "type", display: true, title: "道具类型(同一种道具类型保持一致)", type: "text", value: "", callback: this.ChangeValue },

        { property: "buffValue", display: true, title: "触发效果值", type: "num", value: 0, callback: this.ChangeValue },
        { property: "relifeTime", display: true, title: "重新生成间隔时间", type: "num", value: 0, callback: this.ChangeValue },
        { property: "describe", display: true, title: "道具描述", type: "textarea", value: "", callback: this.ChangeValue },

      ],
    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {


    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    }
    if (modelData.message == undefined) {
      return;
    }
    this.Init(modelData.message.data);

  },
  methods: {

    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {
    },
    Init(data) {
      this.settingData = data;
      // Utils.SetSettingItemByProperty(this.setting,"name",  this.settingData.name);
      // Utils.SetSettingItemByProperty(this.setting,"imgPath",  this.settingData.imgPath);
      // Utils.SetSettingItemByProperty(this.setting,"buff",  this.settingData.buff);
      // Utils.SetSettingItemByProperty(this.setting,"buffValue",  this.settingData.buffValue);
      // Utils.SetSettingItemByProperty(this.setting,"type",  this.settingData.type);
      // Utils.SetSettingItemByProperty(this.setting,"relifeTime",  this.settingData.relifeTime);
      // Utils.SetSettingItemByProperty(this.setting,"describe",  this.settingData.describe);
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

    },
    ChangeValue(i, e) {
      console.log(i + " " + this.setting[i].value);
      this.setting[i].value = e;
      let property = this.setting[i].property;
      this.settingData[property] = e;
      this.Update();
    },

    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    ClickUVAnim(i, e) {
      Utils.SetSettingItemByProperty(this.setting, this.setting[i].property, e);
      let sp = this.setting[i].property.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }
      this.Update();
    },
    Update() {
      _Global.YJ3D._YJSceneManager
        .GetSingleModelTransform()
        .SetMessage(this.getMessage());
    },

    ClickBtnHandler(e) {
      if (e == "保存") {
        if (this.parent.updateModelTxtData) {
          this.parent.modelData.message = this.getMessage();
          this.parent.updateModelTxtData();
        }
      }
    },

  },
};
</script>

<style scoped></style>
