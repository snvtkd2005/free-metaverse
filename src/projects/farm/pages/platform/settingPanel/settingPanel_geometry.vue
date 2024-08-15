 
<template>
  <div class="w-full max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class="text-left">基础几何体</div>
    <div>
      <YJinputCtrl :setting="setting" />
    </div>

    <div
      class="mt-2 w-full h-10 text-white cursor-pointer"
      @click="ClickBtnHandler('保存')"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">保存</div>
    </div>
  </div>
</template>

<script>
import YJinputCtrl from "../components/YJinputCtrl.vue";

export default {
  name: "settingpanel_geometry",
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      pointType: "geometry",
      settingData: {
        name: "几何体",
        geometryType: "",
        row: 14,
        col: 1,
        speed: 1,
        delay: 100,
        isCollider: false,
        isTrigger: false, //
        isProjection: false, //
        isPosRef: false, //
        tiggerTag: "",
        event: {
          title: "",
          content: "",
        },
      },

      setting: [
        {
          property: "name",
          display: false,
          title: "名字",
          type: "text",
          value: "几何体",
          callback: this.ChangeValue,
        },

        {
          property: "geometryType",
          display: true,
          title: "几何体类型",
          type: "drop",
          value: "box",
          options: [
            { value: "box", label: "Box" },
            { value: "plane", label: "plane" },
          ],
          callback: this.ChangeValue,
        },

        // { property: "color", display: true, title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        //   { property: "row", display: true, title: "UV X", type: "num", value: 14, callback: this.ChangeValue },
        //   { property: "col", display: true, title: "UV Y", type: "num", value: 1, callback: this.ChangeValue },
        //   { property: "speed", display: true, title: "默认X轴播放速度", type: "slider", value: 1, min: 0, max: 5, step: 0.5, callback: this.ChangeValue },
        {
          property: "isMesh",
          display: true,
          title: "is mesh",
          type: "toggle",
          value: false,
          callback: this.ChangeValue,
        },
        {
          property: "isCollider",
          display: true,
          title: "is collider",
          type: "toggle",
          value: false,
          callback: this.ChangeValue,
        },
        {
          property: "isTrigger",
          display: true,
          title: "is trigger",
          type: "toggle",
          value: false,
          callback: this.ChangeValue,
        },
        {
          property: "isProjection",
          display: true,
          title: "is 映射 2dui",
          type: "toggle",
          value: false,
          callback: this.ChangeValue,
        },
        {
          property: "isPosRef",
          display: true,
          title: "is 坐标参考 ",
          type: "toggle",
          value: false,
          callback: this.ChangeValue,
        },

        {
          property: "tiggerTag",
          display: true,
          title: "标签(保证唯一)",
          type: "text",
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "event-title",
          display: true,
          title: "事件类型",
          type: "drop",
          value: "none",
          options: [
            { value: "jump", label: "跳转新链接" },
            { value: "openTask", label: "触发任务" },
          ],
          callback: this.ChangeValue,
        },
        {
          property: "event-content",
          display: true,
          title: "网址",
          type: "text",
          value: "",
          callback: this.ChangeValue,
        },
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
    addThreeJSfocus() {},
    Init(data) {
      this.settingData = data;
      if (!this.settingData.event) {
        this.settingData.event = {
          title: "none",
          content: "",
        };
      }
      if (!this.settingData.name) {
        this.settingData.name = "几何体";
      }
      console.log(this.settingData);
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      this.ChangeUIState();
    },

    ChangeUIState(property, e) {
      let isTrigger = this.Utils.GetSettingItemValueByProperty(
        this.setting,
        "isTrigger"
      );
      let isProjection = this.Utils.GetSettingItemValueByProperty(
        this.setting,
        "isProjection"
      );

      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "tiggerTag",
        "display",
        isTrigger || isProjection
      );

      let eventTitle = this.Utils.GetSettingItemValueByProperty(
        this.setting,
        "event-title"
      );
      
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "event-content",
        "display",
        eventTitle != 'none'
      );

      if(eventTitle == 'jump'){
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "event-content","title", "网址");
      }
      if(eventTitle == 'openTask'){
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "event-content","title", "任务id");
      }

    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;
      let sp = property.split("-");
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }

      this.ChangeUIState();
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
        } else {
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
 
