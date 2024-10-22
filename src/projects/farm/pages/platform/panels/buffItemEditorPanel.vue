

<template>
  <el-dialog :title="dialogTitle" class="   bg-546770 text-white  create-card" center v-model="inAdd" :modal-append-to-body="false"
    width="35%">

    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div>

    <div class=" w-full flex ">
      <span slot="footer" class="dialog-footer   mx-auto ">
        <el-button class="   " type="primary" @click="ClickEvent('保存')">保存</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>

import YJinputCtrl from "../components/YJinputCtrl.vue";

import * as GameUtils from '/@/utils/utils_game.js';


export default {
  name: "skillItemEditorPanel",
  props: ['isOpen'],
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      dialogTitle: "", 
      
      // 执行属性
      effectType: [ 
        // { label: "debuff/每秒伤害", value: "perDamage" },
        // { label: "直接伤害", value: "damage" },
        // { label: "恢复生命", value: "addHealth" },
        // { label: "吐息/持续伤害", value: "contDamage" },
        { label: "增生/镜像-生成n个复制", value: "hyperplasia" },
        // { label: "进化-伤害提高百分比", value: "evolution" },
        { label: "护盾", value: "shield" },
        { label: "控制", value: "control" },
        { label: "基础属性", value: "basicProperty" },
      ],
      basicProperty:[
        { label: "生命值", value: "health" }, 
        { label: "最大生命值百分比", value: "maxHealth" }, 
        { label: "护甲", value: "armor" }, 
        // { label: "耐力", value: "endurance" }, 
        // { label: "力量", value: "strength" }, 
        // { label: "精神", value: "spirit" }, 
      ],
      // 控制id
      controlId: [
        // { label: "冻结", value: "冻结" }, 
        { label: "被嘲讽", value: "被嘲讽" }, 
        { label: "无法移动", value: "无法移动" }, 
        { label: "移动速度", value: "移动速度" }, 
      ],  
      settingData: {
        name:"",
        icon:"",
        type:"",
        controlId:"",
        value:0,
        time:0,
        duration:0,
        describe:"",
        runType:"",
      },
      setting: [
        { property: "name", display: true, title: "buff名", type: "text", value: "", callback: this.ChangeValue },
        { property: "icon", display: true, title: "效果图标", type: "file", filetype: "image", accept: "", value: "", callback: this.ChangeValue },
        { property: "runType", display: true, title: "执行类型", type: "drop", options: [
          { label: "每秒执行", value: "perSecond" }, 
          { label: "立即执行", value: "immediately" }, 
          // { label: "持续执行(持续时间同技能施法时间)", value: "keep" }, 
        ], value: "immediately", callback: this.ChangeValue },
        { property: "type", display: true, title: "技能效果", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "controlId", display: true, title: "具体属性", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "value", display: true, title: "效果值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "time", display: true, title: "间隔", type: "num",unit:"秒", step: 0.1, value: 1, callback: this.ChangeValue, },
        { property: "duration", display: true, title: "持续时间(0表示一次有效)", type: "int",unit:"秒", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "describe", display: true, title: "效果描述", type: "textarea", value: "", callback: this.ChangeValue, },
      ], 
      inAdd: false,
    };
  },
  created() { },
  mounted() {
    
  },
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
      
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData); 
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "type", "options", this.effectType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "controlId", "options", this.controlId); 
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "value", "value", this.settingData.value);

      for (let i = 0; i < this.setting.length; i++) {
        this.ChangeUIState(this.setting[i].property, this.setting[i].value);
      } 
    },
    ChangeAnim(animName) {
      this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.ChangePlayerAnim(animName);
    },
    ChangeUIState(property, e) {
      if (property == "runType") {
        if (e == "perSecond") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "time", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", true);
        }
        if (e == "immediately") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "time", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", true);
        }
        if (e == "keep") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "time", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "value", 0);
          this.settingData.duration =  0;
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", false);

        }
      }
      // 根据选择判断哪些属性不显示
      if (property == "type") {
        // if (e == "damage") {
        //   this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", false);
        // }
        // if (e == "evolution") {
        //   this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", false);
        // }

        // if (e == "contDamage") {
        //   this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", false);
        // }

        // if (e == "perDamage") {
        //   this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", true);
        // }

        if (e == "hyperplasia") {
        }
        if (e == "control") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "time", "value", 0);
          this.settingData.time =  0;
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "controlId", "options", this.controlId);
          // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "controlId", "value", this.controlId[0].value);
          // this.settingData.controlId =  this.controlId[0].value;
        }
        
        if (e == "basicProperty") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "controlId", "options", this.basicProperty);
          // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "controlId", "value", this.basicProperty[0].value);
          // this.settingData.controlId =  this.basicProperty[0].value;
        }
        
        if (e == "shield") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "duration", "display", true);
        }
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "controlId", "display", e == "control" ||e == "basicProperty"); 

      }
    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      let property = this.setting[i].property;

      console.log(i, property, e);

      let sp = property.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }
      this.ChangeUIState(property, e);
      this.settingData.describe = GameUtils.GetDescribe_buff(this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "describe", "value", this.settingData.describe);
    },

    ClickEvent(e) {
      if (e == "保存") {
        if(this.$parent.saveSkill){
          this.settingData.describe = GameUtils.GetDescribe_buff(this.settingData);
          this.$parent.saveSkill(this.settingData);
          this.inAdd = false;
          console.log(this.settingData);
          return;
        }
        //在技能中编辑buff保存
        this.$parent.$parent.$parent.$parent.ChangeEvent("编辑buff", this.settingData);
        this.inAdd = false;

      } 
    }, 
    ClickParticle(i, e) {
      this.ClickUVAnim(i, e);
    },
    ClickUVAnim(i, e) {
      this.Utils.SetSettingItemByProperty(this.setting, this.setting[i].property, e);

      console.log(" 选择  ", i, e, this.setting[i].property);

      let sp = this.setting[i].property.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }
    },
  },
};
</script>