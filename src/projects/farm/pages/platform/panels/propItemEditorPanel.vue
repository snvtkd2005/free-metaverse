
// 技能添加弹窗
<template>
  <el-dialog
    title="添加道具/药剂"
    class="bg-546770 text-white create-card"
    center
    v-model="inAdd"
    :modal-append-to-body="false"
    width="35%"
  >
    <div class="w-full">
      <YJinputCtrl :setting="setting" />
    </div>

    <div class="w-full flex">
      <span slot="footer" class="dialog-footer mx-auto">
        <el-button class="   " type="primary" @click="ClickEvent('保存')"
          >保存</el-button
        >
      </span>
    </div>
  </el-dialog>
</template>

<script>
import YJinputCtrl from "../components/YJinputCtrl.vue";
import GameItems from "../../../data/platform/GameItems.js";

export default {
  name: "propItemEditorPanel",
  props: ["isOpen"],
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      settingData: {},
      setting: [
        {
          property: "name",
          display: true,
          title: "道具/药剂名",
          type: "text",
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "icon",
          display: true,
          title: "图标",
          type: "file",
          filetype: "image",
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "propType",
          display: true,
          title: "道具效果类型",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "property",
          display: true,
          title: "属性字段",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "displayType",
          display: true,
          title: "显示方式",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "value",
          display: true,
          title: "效果值",
          type: "num",
          value: 0,
          callback: this.ChangeValue,
        },
        {
          property: "describe",
          display: true,
          title: "效果描述",
          type: "textarea",
          value: "",
          callback: this.ChangeValue,
        },
      ],
      inAdd: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    SetVisible(b, _settingData) {
      this.isOpen = b;
      if (b && _settingData) {
        this.initValue(_settingData);
      }
    },
    initValue(_settingData) {
      this.inAdd = true;
      this.settingData = _settingData;

      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "propType",
        "options",
        GameItems.propType
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "property",
        "options",
        GameItems.attackProperty
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "displayType",
        "options",
        GameItems.displayType
      );

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      for (let i = 0; i < this.setting.length; i++) {
        this.ChangeUIState(this.setting[i].property, this.setting[i].value);
      }
    },
    ChangeUIState(property, e) {
      // 根据选择判断哪些属性不显示
      if (property == "propType") {
        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "property",
          "options",
          e == "attackProperty"
            ? GameItems.attackProperty
            : GameItems.basicProperty
        );
      }
    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;

      console.log(i, property, e);

      let sp = property.split("-");
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }
      this.ChangeUIState(property, e);
      this.settingData.describe = this.GetDescribe(this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "describe",
        "value",
        this.settingData.describe
      );
    },
    ClickEvent(e) {
      if (e == "保存") {
        this.settingData.describe = this.GetDescribe(this.settingData);
        this.$parent.saveProp(this.settingData);
        this.inAdd = false;
      }
    },
    templateReplace(template, data) {
      return template.replace(/\$\{(\w+)\}/g, function (match, key) {
        return data[key] || match;
      });
    },
    GetDescribe(item) {
      let describe = "";
      // for (let i = 0; i < GameItems.propType.length; i++) {
      //   const element = GameItems.propType[i];
      //   if (element.value == item.propType) {
      //     describe += element.label;
      //   }
      // }

      let add = "";
      if (item.propType == "attackProperty") {
        for (let i = 0; i < GameItems.attackProperty.length; i++) {
          const element = GameItems.attackProperty[i];
          if (element.value == item.property) {
            describe += element.label;
          }
        }
      }
      if (item.propType == "basicProperty") {
        for (let i = 0; i < GameItems.basicProperty.length; i++) {
          const element = GameItems.basicProperty[i];
          if (element.value == item.property) {
            describe += element.label;
          }
        }
      }
      add = "提高";
      if (item.property == "health") {
        add = "恢复";
      }

      describe += add;

      describe += item.value;
      console.log(" describe  ", describe);
      // describe = this.templateReplace(item.describe, item)
      return describe;
    },
    ClickUVAnim(i, e) {
      this.Utils.SetSettingItemByProperty(
        this.setting,
        this.setting[i].property,
        e
      );

      console.log(" 选择  ", i, e, this.setting[i].property);

      let sp = this.setting[i].property.split("-");
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }
    },
  },
};
</script>