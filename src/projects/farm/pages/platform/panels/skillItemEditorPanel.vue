
// 技能添加弹窗
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

import skillItem from "../../../data/platform/skillItem.js";


export default {
  name: "skillItemEditorPanel",
  props: ['isOpen'],
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      dialogTitle: "添加技能",
      // 触发时机
      triggerType: [
        { label: "血量达到百分比时执行", value: "health" },
        { label: "每n秒执行", value: "perSecond" },
      ],
      //目标
      targetType: [
        { label: "无需目标", value: "none" },
        { label: "自身", value: "self" },
        { label: "自身瞬时位置", value: "selfPos" },
        { label: "随机友方", value: "randomFriendly" },
        { label: "随机敌方", value: "randomEnemy" },
        { label: "生命值最少的友方", value: "minHealthFriendly" },
        { label: "当前目标", value: "target" },
        { label: "范围内", value: "area" },
      ],
      // 法术效果类型
      effectType: [
        { label: "debuff/每秒伤害", value: "perDamage" },
        { label: "直接伤害", value: "damage" },
        { label: "恢复生命", value: "addHealth" },
        { label: "吐息/持续伤害", value: "contDamage" },
        { label: "增生/镜像-生成n个复制", value: "hyperplasia" },
        { label: "进化-伤害提高百分比", value: "evolution" },
        { label: "控制", value: "control" },
        { label: "护盾", value: "shield" },
      ],

      modelType: [
        { label: "静态模型", value: "静态模型" },  
      ],
      // 控制id
      controlId: [
        { label: "冰霜新星", value: "冰霜新星" }, 
        { label: "嘲讽", value: "嘲讽" }, 
        { label: "冲锋", value: "冲锋" }, 
      ],
      shieldId: [
        { label: "寒冰护体", value: "寒冰护体" }, 
      ],
      skillFirePart:[
        { label: "无", value: "" }, 
        { label: "右掌心", value: "RightHand" }, 
        { label: "左掌心", value: "LeftHand" }, 
      ],
      settingData: {},
      setting: [
        { property: "skillName", display: true, title: "技能名", type: "text", value: "", callback: this.ChangeValue },
        { property: "icon", display: true, title: "技能图标", type: "file", filetype: "image", value: "", callback: this.ChangeValue },

        { property: "trigger-type", display: true, title: "触发时机", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "trigger-value", display: true, title: "自动触发值", type: "num", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "CD", display: true, title: "冷却时间", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "target-type", display: true, title: "目标类型", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "target-value", display: true, title: "目标数量", type: "int", step: 1, value: 1, callback: this.ChangeValue, },

        { property: "hasReceiveEffect", display: true, title: "是否有接收效果（生成模型）", type: "toggle", value: false, callback: this.ChangeValue },

        { property: "receiveEffect-modelType", display: false, title: "生成模型类型", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "receiveEffect-particleId", display: false, title: "生成模型", type: "file", filetype: "particle", value: "", callback: this.ChangeValue },


        { property: "castTime", display: true, title: "吟唱时间", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "animNameReady", display: true, title: "吟唱动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillReadyParticleId", display: true, title: "吟唱特效", type: "file", filetype: "particle", value: "", callback: this.ChangeValue },
        { property: "skillReadyAudio", display: true, title: "吟唱音效", type: "file", filetype: "audio", value: "", callback: this.ChangeValue },
        { property: "animName", display: true, title: "施放动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillFirePart", display: true, title: "施放部位", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillFireParticleId", display: true, title: "施放特效", type: "file", filetype: "particle", value: "", callback: this.ChangeValue },
        { property: "skillFireAudio", display: true, title: "施放音效", type: "file", filetype: "audio", value: "", callback: this.ChangeValue },

        { property: "vaildDis", display: true, title: "技能施放的有效范围", type: "num", step: 1, value: 0, callback: this.ChangeValue },

        { property: "effect-type", display: true, title: "技能效果", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "effect-value", display: true, title: "效果值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-time", display: true, title: "间隔", type: "num", step: 0.1, value: 1, callback: this.ChangeValue, },
        { property: "effect-duration", display: true, title: "持续时间", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-describe", display: true, title: "效果描述", type: "text", value: "", callback: this.ChangeValue, },
        { property: "effect-icon", display: true, title: "debuff图标", type: "file", filetype: "image", accept: "", value: "", callback: this.ChangeValue },
        { property: "effect-controlId", display: true, title: "控制id", type: "drop", options: [], value: "", callback: this.ChangeValue },

        { property: "describe", display: true, title: "效果描述", type: "textarea", value: "", callback: this.ChangeValue, },

      ],
      animList: [],
      inAdd: false,
    };
  },
  created() { },
  mounted() {
    
  },
  methods: {
    createNew(){
      this.initValue(JSON.parse(JSON.stringify(skillItem.skill)));
    },
    SetVisible(b, _settingData) {
      this.isOpen = b;
      if (b && _settingData) {
        this.initValue(_settingData);
      }
    },
    displayTriggerType(){
      // this.inPlayerSkillEditor = true;
      // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-type", "display", false);
      // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-value", "display", false);
      // this.settingData.describe = this.GetDescribe(this.settingData);
      // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "describe", "value", this.settingData.describe);
      
    },
    initValue(_settingData) {
      this.inAdd = true;
      this.settingData = _settingData;

      if (!this.settingData.skillReadyParticleId) {
        this.settingData.skillReadyParticleId = "";
      }
      if (!this.settingData.skillReadyAudio) {
        this.settingData.skillReadyAudio = "";
      }
      if (!this.settingData.skillFireParticleId) {
        this.settingData.skillFireParticleId = "";
      }
      if (!this.settingData.skillFireAudio) {
        this.settingData.skillFireAudio = "";
      }
      if (this.settingData.type == undefined) {
        this.settingData.type = "skill";
      } 
      if (!this.settingData.receiveEffect) {
        this.settingData.receiveEffect = {modelType:"",particleId:""};
      }
      if (this.settingData.hasReceiveEffect == undefined) {
        this.settingData.hasReceiveEffect = false;
      }

      if (this.settingData.CD == undefined) {
        if(this.settingData.trigger.CD){
          this.settingData.CD = this.settingData.trigger.CD;
        }else{
          this.settingData.CD = 0;
        }
      }

      // this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-type", "options", this.triggerType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-type", "options", this.targetType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-type", "options", this.effectType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-controlId", "options", this.controlId);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "skillFirePart", "options", this.skillFirePart);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "receiveEffect-modelType", "options", this.modelType);
      
      // return; 
      this.animList = _Global.animList;

      this.canAnimList = [];
      for (let i = 0; i < this.animList.length; i++) {
        const anim = this.animList[i];
        this.canAnimList.push({ label: anim.content, value: anim.animName });
      }

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameReady", "options", this.canAnimList);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animName", "options", this.canAnimList);

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-value", "value", this.settingData.effect.value);

      for (let i = 0; i < this.setting.length; i++) {
        this.ChangeUIState(this.setting[i].property, this.setting[i].value);
      } 
    },
    ChangeAnim(animName) {
      this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.ChangePlayerAnim(animName);
    },
    ChangeUIState(property, e) {
      // 根据选择判断哪些属性不显示
      if (property == "target-type") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-value", "display", e == "area");
      }
      if (property == "hasReceiveEffect") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "receiveEffect-modelType", "display", e );
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "receiveEffect-particleId", "display", e );
      }
      if (property == "receiveEffect-modelType") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "receiveEffect-particleId", "filetype", e );
      }
      if (property == "effect-type") {
        if (e == "damage") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
        }
        if (e == "evolution") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
        }

        if (e == "contDamage") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
        }

        if (e == "perDamage") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", true);
        }

        if (e == "hyperplasia") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-value", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
        }
        if (e == "control") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-value", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-controlId", "options", this.controlId);
          
        }
        
        if (e == "shield") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-value", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-controlId", "options", this.shieldId);
        }
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-controlId", "display", e == "control" || e == "shield"); 

      }

      // 吟唱时间
      if (property == "castTime") {
        if(e>0){

        }else{

            
        }
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameReady", "display", e>0);
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "skillReadyParticleId", "display", e>0);
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "skillReadyAudio", "display", e>0);
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
      this.settingData.describe = this.GetDescribe(this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "describe", "value", this.settingData.describe);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "value", this.settingData.effect.describe);

    },
    FloatEvent(e) {
      if (e == "保存") {
        this.settingData.describe = this.GetDescribe(this.settingData);
        this.$parent.saveSkill(this.settingData);
        this.inAdd = false;

        console.log(this.settingData);
      }
    },
    GetDescribe(item) {
      let describe = "";

      if (item.trigger.type == "health") {
        // describe += "自动攻击时，当生命达到" + item.trigger.value + "%时，";
      }
      if (item.trigger.type == "perSecond") {
        // describe += "自动攻击时，每" + item.trigger.value + "秒，";
      }

      if(this.inPlayerSkillEditor){
        // 玩家技能都是点击技能图标触发的
        describe = "";
      }
      let targetCamp = "友方"
      if (item.effect.type.toLowerCase().includes("damage") ) {
        targetCamp = "敌方";
      }


      if (item.target.type == "none" || item.target.type == "self") {
        describe += "自身";
      }
      if (item.target.type == "random") {
        describe += "对随机最多" + item.target.value + "个"+targetCamp +"目标";
      }

      if (item.target.type == "target") {
        describe += "对当前目标";
      }
      if (item.target.type == "area") {
        describe += "对半径" + item.vaildDis + "米范围内最多" + item.target.value + "个目标";
      }

      if (item.target.type == "minHealthFriendly") {
        describe += "对生命值最少的友方";
      }

      if (item.effect.type == "evolution") {
        describe += ",所有技能造成的伤害提高" + item.effect.value + "%";
      }
      if (item.effect.type == "hyperplasia") {
        describe += ",生成" + item.effect.value + "个镜像";
      }

      if (item.effect.type == "contDamage") {
        describe += ",每" + item.effect.time + "秒造成" + item.effect.value + "点伤害，持续" + (item.castTime) + "秒";
      }

      if (item.effect.type == "damage") {
        describe += ",造成" + item.effect.value + "点伤害";
      }
      if (item.effect.type == "addHealth") {
        describe += ",恢复" + item.effect.value + "点生命值";
      }
      
      if (item.effect.type == "perDamage") {
        let effectdes =  "每" + item.effect.time + "秒造成" + item.effect.value + "点伤害，持续" + item.effect.duration + "秒";
        item.effect.describe = effectdes;
        describe += "," + effectdes;
        
      }
      if (item.effect.type == "control") {
        describe += "施放控制" + item.effect.controlId   ;
      }
      
      if (item.effect.type == "shield") {
        let effectdes = "吸收" + item.effect.value + "点伤害";
        describe += "施放"+ item.effect.controlId+  "。" + effectdes + "，持续" + item.effect.duration + "秒";
        item.effect.describe = effectdes ;
      }
      return describe;
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