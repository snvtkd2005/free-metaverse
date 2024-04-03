 
<template>
  <div class=" w-full  max-w-md p-2 text-white rounded-lg overflow-hidden ">
    <div class=" text-left ">UV动画设置</div>
    <div>
      <YJinputCtrl :setting="setting" />
    </div>


    <div class=" mt-2 w-full h-10 text-white cursor-pointer " @click="ClickBtnHandler('保存')">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>
  </div>
</template>

<script>

import YJinputCtrl from "../components/YJinputCtrl.vue";

export default {
  name: "settingpanel_uvanim",
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      pointType: "UV动画",
      settingData: {
        gifPath: '',
        color: "#ffffff",
        row: 14,
        col: 1,
        speed: 1,
        delay: 100,
        isBlack: false,
        isLookatCam: false, //是否始终朝向视图
        isLockY: false, //是否锁定Y轴
        speedY:0,
      },
      setting: [
        { property: "gifPath", display: true, title: "选择UV图", type: "file", filetype: "image", value: null },
        { property: "color", display: true, title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        { property: "row", display: true, title: "UV X", type: "num", value: 14, callback: this.ChangeValue },
        { property: "col", display: true, title: "UV Y", type: "num", value: 1, callback: this.ChangeValue },
        { property: "speed", display: true, title: "默认X轴播放速度", type: "slider", value: 1, min: 0, max: 5, step: 0.5, callback: this.ChangeValue },
        { property: "speedY", display: true, title: "Y轴播放速度", type: "slider", value: 1, min: 0, max: 5, step: 0.5, callback: this.ChangeValue },
        { property: "isBlack", display: true, title: "是否黑底", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "isLookatCam", display: true, title: "是否始终朝向视图", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "isLockY", display: true, title: "锁定在X轴旋转", type: "toggle", value: false, callback: this.ChangeValue },
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
      // this.setting[0].url =   this.settingData.gifPath;
      // this.setting[1].value = this.settingData.color;
      // this.setting[2].value = this.settingData.row;
      // this.setting[3].value = this.settingData.col;
      // this.setting[4].value = this.settingData.speed;
      // this.setting[5].value = this.settingData.isBlack | false;
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;
      this.settingData[this.setting[i].property] = e;

      this.Update();

    },

    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    ClickUVAnim(i, item) {
      this.setting[i].value = item;
      this.settingData[this.setting[i].property] = item;
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
        }else {
          // 调用场景保存
          if (this.parent.updateSceneModelData) {
            this.parent.updateSceneModelData();
          }
        }
      }
    },

  },
};
</script>
 
