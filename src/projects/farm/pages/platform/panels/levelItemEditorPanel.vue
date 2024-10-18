
<template>
  <el-dialog :title="dialogTitle" class="   bg-546770 text-white  create-card" center v-model="inAdd" :modal-append-to-body="false"
    width="35%">

    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div>

    <div class=" w-full flex ">
      <span slot="footer" class="dialog-footer   mx-auto ">
        <el-button class="   " type="primary" @click="FloatEvent('保存')">保存</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>

import YJinputCtrl from "../components/YJinputCtrl.vue";

// 技能添加弹窗
export default {
  name: "levelItemEditorPanel",
  props: ['isOpen'],
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      dialogTitle: "添加等级记录",
      settingData: {},
      setting: [
        { property: "level", display: true, title: "等级", type: "int", value: 1, callback: this.ChangeValue },
        { property: "exp", display: true, title: "升级所需经验值", type: "int", value: 30, callback: this.ChangeValue },
        // { property: "maxHealth", display: true, title: "生命值", type: "int", value: 100, callback: this.ChangeValue },
        // { property: "intelligence", display: true, title: "智力", type: "int", value: 0, callback: this.ChangeValue },
        // { property: "endurance", display: true, title: "耐力", type: "int", value: 0, callback: this.ChangeValue },
        // { property: "agile", display: true, title: "敏捷", type: "int", value: 0, callback: this.ChangeValue },
        // { property: "strength", display: true, title: "力量", type: "int", value: 0, callback: this.ChangeValue },
        // { property: "spirit", display: true, title: "精神", type: "int", value: 0, callback: this.ChangeValue },
      ], 
      inAdd: false,
    };
  },
  created() { },
  mounted() {
    
  },
  methods: {
    createNew(){
      this.initValue({level:1,exp:30,});
    }, 
    initValue(_settingData) {
      this.inAdd = true;
      this.settingData = _settingData;
      if(this.settingData.maxHealth == undefined){
        this.settingData.maxHealth = this.Utils.GetSettingItemValueByProperty(this.setting, 'maxHealth');
      }
      if(this.settingData.intelligence == undefined){
        this.settingData.intelligence = this.Utils.GetSettingItemValueByProperty(this.setting, 'intelligence');
      }      
      if(this.settingData.endurance == undefined){
        this.settingData.endurance = this.Utils.GetSettingItemValueByProperty(this.setting, 'endurance');
      }      
      if(this.settingData.agile == undefined){
        this.settingData.agile = this.Utils.GetSettingItemValueByProperty(this.setting, 'agile');
      }      
      if(this.settingData.strength == undefined){
        this.settingData.strength = this.Utils.GetSettingItemValueByProperty(this.setting, 'strength');
      }      
      if(this.settingData.spirit == undefined){
        this.settingData.spirit = this.Utils.GetSettingItemValueByProperty(this.setting, 'spirit');
      }
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

    }, 
    ChangeUIState(property, e) {
       
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
    },

    FloatEvent(e) {
      if (e == "保存") { 
        this.$parent.save(this.settingData);
        this.inAdd = false;

        console.log(this.settingData);
      }
    },
    GetDescribe(item) {
      let describe = "";
 
      return describe;
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