
// 技能添加弹窗
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
        { label: "随机友方", value: "randomFriendly" },
        { label: "随机敌方", value: "randomEnemy" },
        { label: "生命值最少的友方", value: "minHealthFriendly" },
        { label: "当前目标", value: "target" },
        { label: "当前目标及其附近", value: "targetAndNear" },
        { label: "半径范围内", value: "area" },
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
        { label: "被嘲讽", value: "被嘲讽" }, 
        { label: "眩晕", value: "眩晕" }, 
        { label: "减速", value: "减速" }, 
      ],
      shieldId: [
        { label: "寒冰护体", value: "寒冰护体" }, 
      ],
      skillFirePart:[
        { label: "无", value: "" }, 
        { label: "自身位置", value: "selfPos" }, 
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
        { property: "vaildDis", display: true, title: "技能施放的有效范围", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "target-value", display: true, title: "目标数量", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "hasTargetLv", display: true, title: "目标数量是否升级", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "targetLv", display: false, title: "目标数量", type: "intArrayVariable", step: 1, value: [], callback: this.ChangeValue, },

        { property: "hasReceiveEffect", display: true, title: "是否有接收效果（生成模型）", type: "toggle", value: false, callback: this.ChangeValue },

        { property: "receiveEffect-modelType", display: false, title: "生成模型类型", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "receiveEffect-particleId", display: false, title: "生成模型", type: "file", filetype: "particle", value: "", callback: this.ChangeValue },

        { property: "selfAction", display: true, title: "自身额外行为", type: "drop", options: [
          { label: "none", value: "none" }, 
          { label: "冲锋", value: "冲锋" }, 
        ], value: "none", callback: this.ChangeValue },

        { property: "castTime", display: true, title: "吟唱时间(0表示瞬发)", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "animNameReady", display: true, title: "吟唱动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillReadyParticleId", display: true, title: "吟唱特效", type: "file", filetype: "particle", value: "", callback: this.ChangeValue },
        { property: "skillReadyAudio", display: true, title: "吟唱音效", type: "file", filetype: "audio", value: "", callback: this.ChangeValue },
        
        { property: "animName", display: true, title: "施放动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillFirePart", display: true, title: "施放部位", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillFireParticleId", display: true, title: "施放特效", type: "file", filetype: "particle", value: "", callback: this.ChangeValue },
        { property: "skillFireAudio", display: true, title: "施放音效", type: "file", filetype: "audio", value: "", callback: this.ChangeValue },
        
        { property: "skillFireAutoHidden", display: true, title: "施放自动消失", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "skillFireDiplayValue", display: false, title: "延迟时间（秒）", type: "num", step: 0.1, value: 0, callback: this.ChangeValue },


        { property: "effect-type", display: true, title: "技能效果", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "effect-value", display: true, title: "效果值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-directToTarget", display: true, title: "是否直接到达目标", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "effect-time", display: true, title: "间隔", type: "num", step: 0.1, value: 1, callback: this.ChangeValue, },
        { property: "effect-duration", display: true, title: "持续时间", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-describe", display: true, title: "效果描述", type: "text", value: "", callback: this.ChangeValue, },
        { property: "effect-icon", display: true, title: "debuff图标", type: "file", filetype: "image", accept: "", value: "", callback: this.ChangeValue },
        { property: "effect-controlId", display: true, title: "目标行为", type: "drop", options: [], value: "", callback: this.ChangeValue },

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
    SetVisible(b, _settingData) {
      this.isOpen = b;
      if (b && _settingData) {
        this.initValue(_settingData);
      }
    },
    displayTriggerType(){ 
      // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-type", "display", false);
      // this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-value", "display", false);
      // this.settingData.describe = GameUtils.GetDescribe(this.settingData);
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
      if (this.settingData.hasTargetLv == undefined) {
        this.settingData.hasTargetLv = false;
      }
      if (this.settingData.CD == undefined) {
        if(this.settingData.trigger.CD){
          this.settingData.CD = this.settingData.trigger.CD;
        }else{
          this.settingData.CD = 0;
        }
      }
      
      if (this.settingData.skillFireAutoHidden == undefined) {
        this.settingData.skillFireAutoHidden = false;
      }
      if (this.settingData.skillFireDiplayValue == undefined) {
        this.settingData.skillFireDiplayValue = 0;
      }
      if (this.settingData.selfAction == undefined) {
        this.settingData.selfAction = 'none';
      }
      
      
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
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

      if (property == "skillFireAutoHidden") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "skillFireDiplayValue", "display", e);
      }

      if (property == "target-type") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-value", "display", e == "area" ||  e == 'targetAndNear');
      }
      if (property == "hasReceiveEffect") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "receiveEffect-modelType", "display", e );
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "receiveEffect-particleId", "display", e );
      }
      if (property == "receiveEffect-modelType") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "receiveEffect-particleId", "filetype", e );
      }
      if (property == "hasTargetLv") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "targetLv", "display", e );
        if(e){
          let a = [];
          if(this.settingData.targetLv && this.settingData.targetLv.length>1){
            a=this.settingData.targetLv;
          }else{
            a.push(this.settingData.target.value);
            this.settingData.targetLv = a;
          }
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "targetLv", "value", a );
        }
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
      this.settingData.describe = GameUtils.GetDescribe(this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "describe", "value", this.settingData.describe);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "value", this.settingData.effect.describe);

    },

    ClickEvent(e) {
      if (e == "保存") {
        this.settingData.describe = GameUtils.GetDescribe(this.settingData);
        this.$parent.saveSkill(this.settingData);
        this.inAdd = false;

        console.log(this.settingData);
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