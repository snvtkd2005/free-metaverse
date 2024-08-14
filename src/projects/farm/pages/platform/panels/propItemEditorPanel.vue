
// 技能添加弹窗
<template>
  <el-dialog
    title="添加道具"
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
          title: "道具名",
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
          property: "gold",
          display: true,
          title: "售价",
          type: "num",
          value: 0,
          callback: this.ChangeValue,
        },

        {
          property: "useType",
          display: true,
          title: "使用类型",
          type: "drop",
          options: [],
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
          property: "effectType",
          display: true,
          title: "效果类型",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "property",
          display: true,
          title: "效果属性字段",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "displayType",
          display: false,
          title: "显示方式",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "CD",
          display: true,
          title: "冷却时间",
          type: "num",
          value: 0,
          callback: this.ChangeValue,
        },
        {
          property: "qualityType",
          display: true,
          title: "品质",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "bindingType",
          display: true,
          title: "绑定状态",
          type: "drop",
          options: [],
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "countType",
          display: true,
          title: "数量状态",
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
          property: "autoDescribe",
          display: true,
          title: "自动生成描述",
          type: "toggle",
          value: false,
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
      if (this.settingData.effectType == undefined) {
        this.settingData.effectType = "";
      }
      
      if(this.settingData.countType == undefined){
        this.settingData.countType = GameItems.countType[0].value;
      }
      if(this.settingData.gold == undefined){
        this.settingData.gold = 0;
      }
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "useType",
        "options",
        GameItems.useType
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "propType",
        "options",
        GameItems.propType
      );

      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "effectType",
        "options",
        GameItems.effectType
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "property",
        "options",
        GameItems.playerProperty
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "displayType",
        "options",
        GameItems.displayType
      );

      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "qualityType",
        "options",
        GameItems.qualityType
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "bindingType",
        "options",
        GameItems.bindingType
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "countType",
        "options",
        GameItems.countType
      );
      console.log(this.settingData);

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

      // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "countType", "value",this.settingData.countType);

      for (let i = 0; i < this.setting.length; i++) {
        this.ChangeUIState(this.setting[i].property, this.setting[i].value);
      }
    },
    ChangeUIState(property, e) {
      // 根据选择判断哪些属性不显示
      if (property == "propType") {
        // 道具类型选择后，设置类型下的可选项
        let effectType =
          e == "potion" ? GameItems.potionType : GameItems.stuffType;
        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "effectType",
          "options",
          effectType
        );
        let effectTypeV = effectType[0].value;
        if(this.settingData.effectType){
          effectTypeV = this.settingData.effectType;
        } 
        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "effectType",
          "value",
          effectTypeV
        );

        this.ChangeUIState("effectType", effectTypeV);
      }

      // 效果类型选择后，设置效果下的可选项
      if (property == "effectType") {
        this.settingData.effectType = e;

        let propertyType =
          e == "playerProperty"
            ? GameItems.playerProperty
            : GameItems.otherProperty;

        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "property",
          "display",
          propertyType.length != 0
        );
        this.Utils.SetSettingItemPropertyValueByProperty(
          this.setting,
          "property",
          "options",
          propertyType
        );
      }

      if(property == "autoDescribe"){ 
        if(e){
          this.settingData.describe = this.GetDescribe(this.settingData);
          this.Utils.SetSettingItemPropertyValueByProperty(
            this.setting,
            "describe",
            "value",
            this.settingData.describe
          );
        }

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
        if (!this.settingData.id) {
          this.settingData.id = new Date().getTime();
        }
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
      if (!item.autoDescribe) {
        return  this.settingData.describe;
      }
      let describe = "";
      // for (let i = 0; i < GameItems.propType.length; i++) {
      //   const element = GameItems.propType[i];
      //   if (element.value == item.propType) {
      //     describe += element.label;
      //   }
      // }
      console.log(item);

      let add = "使用：";
      if (item.effectType == "transmit") {
        add +=
          "将你传送到" +
          item.value +
          "。与城镇中的旅店老板交谈可以改变你所设定的家的位置。";
      }
      if (item.effectType == "relife") {
        add += "立即复活";
      }
      if (item.effectType == "playerProperty") {
        for (let i = 0; i < GameItems.playerProperty.length; i++) {
          const element = GameItems.playerProperty[i];
          if (element.value == item.property) {
            add += element.label;
          }
        }

        if (item.property == "health") {
          add += "恢复";
        } else {
          add += "提高";
        }

        add += item.value;
      }

      if (item.CD) {
        add += "(" + item.CD + "分钟冷却)";
      }
      describe += add;

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