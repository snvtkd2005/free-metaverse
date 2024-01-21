
// 技能添加弹窗
<template>
  <el-dialog :title="dialogTitle" class="    text-white  create-card" center v-model="inAdd" :modal-append-to-body="false"
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
        { label: "随机", value: "random" },
        { label: "当前目标", value: "target" },
        { label: "区域内", value: "area" },
      ],
      // 法术效果类型
      effectType: [
        { label: "debuff/每秒伤害", value: "perDamage" },
        { label: "直接伤害", value: "damage" },
        { label: "吐息/持续伤害", value: "contDamage" },
        { label: "增生/镜像-生成n个复制", value: "hyperplasia" },
        { label: "进化-伤害提高百分比", value: "evolution" },
      ],
      settingData: {
        skillName: "致命一击",
        // 该结构表示：每10秒对当前目标造成10点伤害
        //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
        trigger: { type: "health", value: 20 },
        //目标
        target: { type: "target", value: 1 },// random随机 target目标 area范围攻击
        //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
        effect: {
          type: "damage",
          value: 100,
          time: 1,
          duration: 3,
          describe: "对目标造成100点伤害",
          icon: "",
        }, //describe技能描述，duration持续时间。perDamage、冻结、眩晕等状态效果才需要持续时间
        //技能施放的有效范围 或 范围攻击的游戏范围
        vaildDis: 100, //  
        //施放时间
        castTime: 1, // 施法时间。 秒, 0表示瞬发
        animNameReady: "two hand gun before attack", // 施法准备/读条动作
        animName: "two hand gun attack", // 施法施放动作

        skillReadyParticleId:"", //吟唱特效
        skillReadyAudio:"", //吟唱音效
        skillFireParticleId:"", //施放特效
        skillFireAudio:"", //施放音效
        //效果增强
        effectEnhance: "none",
        icon: "", //技能图标
        describe: "", //描述总结
      },
      setting: [
        { property: "skillName", display: true, title: "技能名", type: "text", value: "", callback: this.ChangeValue },
        { property: "icon", display: true, title: "技能图标", type: "file",filetype:"image", value: "", callback: this.ChangeValue },

        { property: "trigger-type", display: true, title: "触发时机", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "trigger-value", display: true, title: "触发值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "target-type", display: true, title: "目标类型", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "target-value", display: true, title: "目标数量", type: "int", step: 1, value: 1, callback: this.ChangeValue, },

        { property: "animNameReady", display: true, title: "吟唱动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillReadyParticleId", display: true, title: "吟唱特效", type: "file",filetype:"particle", value: "", callback: this.ChangeValue },
        { property: "skillReadyAudio", display: true, title: "吟唱音效", type: "file",filetype:"audio", value: "", callback: this.ChangeValue },
        { property: "animName", display: true, title: "施放动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "skillFireParticleId", display: true, title: "施放特效", type: "file",filetype:"particle", value: "", callback: this.ChangeValue },
        { property: "skillFireAudio", display: true, title: "施放音效", type: "file",filetype:"audio", value: "", callback: this.ChangeValue },
        
        { property: "vaildDis", display: true, title: "技能施放的有效范围", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "castTime", display: true, title: "吟唱时间", type: "num", step: 1, value: 0, callback: this.ChangeValue },

        { property: "effect-type", display: true, title: "技能效果", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "effect-value", display: true, title: "效果值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-time", display: true, title: "每秒间隔", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-duration", display: true, title: "持续时间", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-describe", display: true, title: "效果描述", type: "text", value: "", callback: this.ChangeValue, },
        { property: "effect-icon", display: true, title: "debuff图标", type: "file",filetype:"image", accept: "", value: "", callback: this.ChangeValue },

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
    SetVisible(b, avatarName) {
      this.isOpen = b;
      if (b) {
        this.initValue(avatarName);
      }
    },

    initValue(_settingData) {
      this.inAdd = true;
      this.settingData = _settingData;

      if(!this.settingData.skillReadyParticleId){
        this.settingData.skillReadyParticleId = "";
      }
      if(!this.settingData.skillReadyAudio){
        this.settingData.skillReadyAudio = "";
      }
      if(!this.settingData.skillFireParticleId){
        this.settingData.skillFireParticleId = "";
      }
      if(!this.settingData.skillFireAudio){
        this.settingData.skillFireAudio = "";
      } 

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-type", "options", this.triggerType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-type", "options", this.targetType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-type", "options", this.effectType);

      // return;
      this.avatarName = "女射手";
      this.animList = _Global.animList;

      this.canAnimList = [];
      for (let i = 0; i < this.animList.length; i++) {
        const anim = this.animList[i];
        this.canAnimList.push({ label: anim.content, value: anim.animName });
      }

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameReady", "options", this.canAnimList);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animName", "options", this.canAnimList);

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      for (let i = 0; i < this.setting.length; i++) {
        this.ChangeUIState(this.setting[i].property, this.setting[i].value);
      }
      return;
      // console.log(this.animList);
      //获取当前角色已存在的动作
      _Global.CreateOrLoadPlayerAnimData().GetAllAnim(this.avatarName, (temp) => {
        // console.log(this.avatarName, temp);
        for (let i = 0; i < this.animList.length; i++) {
          const anim = this.animList[i];
          anim.has = false;
          for (let j = 0; j < temp.length; j++) {
            const element = temp[j];
            if (element == anim.animName && element != "") {
              anim.has = true;
              this.canAnimList.push({ label: anim.content, value: anim.animName });
            }
          }
          this.canAnimList.push({ label: anim.content, value: anim.animName });
        }
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameReady", "options", this.canAnimList);
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animName", "options", this.canAnimList);

      });

      // this.SetSkillList(res.data);
    },
    ChangeAnim(animName) {
      this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.ChangePlayerAnim(animName);
    },
    ChangeUIState(property, e) {
      // 根据选择判断哪些属性不显示
      if (property == "target-type") {
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-value", "display", e == "area");
      }
      if (property == "effect-type") {
        if (e == "damage") {
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
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
        }

        if (e == "perDamage") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", true);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", true);
        }

        if (e == "hyperplasia") {
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-time", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-describe", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-duration", "display", false);
          this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-icon", "display", false);
        }
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
    },
    FloatEvent(e) {
      if (e == "保存") {
        this.settingData.describe = this.GetDescribe(this.settingData);
        this.$parent.saveSkill(this.settingData);
        this.inAdd = false;
      }
    },
    GetDescribe(item) {
      let describe = "";

      if (item.trigger.type == "health") {
        describe += "当生命达到" + item.trigger.value + "%时";
      }
      if (item.trigger.type == "perSecond") {
        describe += "每" + item.trigger.value + "秒";
      }
      if (item.target.type == "none") {
        describe += ",自身";
      }
      if (item.target.type == "random") {
        describe += ",对随机" + item.target.value + "个目标";
      }
      if (item.target.type == "target") {
        describe += ",对当前目标";
      }
      if (item.target.type == "area") {
        describe += ",对" + item.vaildDis + "范围内最多" + item.target.value + "个目标";
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

      if (item.effect.type == "perDamage") {
        describe += ",每" + item.effect.time + "秒造成" + item.effect.value + "点伤害，持续" + item.effect.duration + "秒";
      }
      return describe;
    }, 
    ClickParticle(i,e){
      
      this.ClickUVAnim(i,e);
    },
    ClickUVAnim(i,e) {
      this.Utils.SetSettingItemByProperty(this.setting, this.setting[i].property, e);
      
      console.log(" 选择  ",i,e,this.setting[i].property);
      
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