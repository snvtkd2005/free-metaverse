
// 技能添加弹窗
<template>
  <el-dialog :title="dialogTitle" class="    text-white  create-card" center v-model="inAdd" :modal-append-to-body="false"
    width="35%">
    <!-- <el-form ref="formRef" :model="settingData" label-width="120px">
        <el-form-item label="技能名:">
          <el-input v-model="settingData.skillName"></el-input>
        </el-form-item>
      </el-form> -->
    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex justify-between w-full h-auto mb-2     ">
      <div v-if="item.display" class=" self-center w-full  truncate">
        {{ item.title }}
      </div>
      <div v-if="item.display" class=" self-center w-32 ">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'file'" class=" relative flex  gap-2 cursor-pointer  " @click="SelectFile(item, i)">
          <img v-if="item.value" class=" w-10 h-10    object-fill hover:opacity-70 "
            :src="$uploadUVAnimUrl + item.value" />
          <div class=" w-auto h-6 rounded-sm bg-gray-50 flex">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'upload'" v-show="item.display" class=" relative flex  gap-2 cursor-pointer  ">
          <img v-if="item.value" class=" w-full h-full" :src="item.value" />

          <YJinput_upload class=" w-32 h-16 " :accept="item.accept" :index="i" :callback="item.callback" />
        </div>


        <div v-if="item.type == 'int'" class="flex gap-2 text-black">
          <YJinput_number :value="item.value" :type="item.type" :step="item.step" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'slider'" class=" flex gap-2 ">
          <!-- <input id="body-slider" type="range" :value="item.value" :step="item.step" :min="item.min" :max="item.max"> -->
          <YJinput_range :value="item.value" :step="item.step" :min="item.min" :max="item.max"
            :callback="item.callback" />
          <div>{{ item.value }}</div>
        </div>

        <div v-if="item.type == 'toggle'" class=" w-4 h-4 ">
          <YJinput_toggle class=" w-4 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'text'" class=" w-20 h-4 text-black ">
          <YJinput_text class=" w-20 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'textarea'" class=" w-32 h-auto text-black ">
          <YJinput_textarea class=" w-full h-20 " :value="item.value" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'drop'" class=" w-20 h-12 text-black ">
          <YJinput_drop class=" w-full h-full " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'vector3'" class=" w-auto h-6 text-black ">
          <YJinput_vector3 class=" w-auto h-6 " :value="item.value" :step="item.step" :index="i"
            :callback="item.callback" />
        </div>

      </div>
      <div v-if="item.display" class=" self-center ml-2 w-4  truncate">
        {{ item.unit }}
      </div>

    </div>
    <div class=" w-full flex ">
      <span slot="footer" class="dialog-footer   mx-auto ">
        <el-button class="   " type="primary" @click="FloatEvent('保存')">保存</el-button>
      </span>
    </div>
  </el-dialog>

  <el-dialog title="选择技能图标" class="    text-white  create-card" center v-model="inSelect" :modal-append-to-body="false"
    width="35%">
    <div style=" z-index: 9999;" class=" flex flex-wrap">
      <div v-for="(item, i) in imgList" :key="i" class="
                  self-center w-20 h-auto relative
                ">
        <div class=" w-16 h-16 self-center mx-auto 
                  cursor-pointer " @click="ClickUVAnim(item)">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>

import YJinput_color from "../components/YJinput_color.vue";
import YJinput_range from "../components/YJinput_range.vue";
import YJinput_number from "../components/YJinput_number.vue";
import YJinput_text from "../components/YJinput_text.vue";
import YJinput_textarea from "../components/YJinput_textarea.vue";
import YJinput_toggle from "../components/YJinput_toggle.vue";
import YJinput_drop from "../components/YJinput_drop.vue";
import YJinput_vector3 from "../components/YJinput_vector3.vue";
import YJinput_upload from "../components/YJinput_upload.vue";

import { GetAllModel, UploadPlayerFile } from "../../../js/uploadThreejs.js";
import { GetAllUVAnim } from "../../../js/uploadThreejs.js";

export default {
  name: "skillItemEditorPanel",
  props: ['isOpen'],
  components: {
    YJinput_text,
    YJinput_textarea,
    YJinput_toggle,
    YJinput_drop,
    YJinput_upload,
    YJinput_vector3,
    YJinput_color,
    YJinput_range,
    YJinput_number,
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
        //效果增强
        effectEnhance: "none",
        icon: "", //技能图标
        describe: "", //描述总结
      },
      setting: [
        { property: "skillName", display: true, title: "技能名", type: "text", value: "", callback: this.ChangeValue },
        { property: "icon", display: true, title: "技能图标", type: "file", value: "", callback: this.ChangeValue },

        { property: "trigger-type", display: true, title: "触发时机", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "trigger-value", display: true, title: "触发值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "target-type", display: true, title: "目标类型", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "target-value", display: true, title: "目标数量", type: "int", step: 1, value: 1, callback: this.ChangeValue, },

        { property: "animNameReady", display: true, title: "吟唱动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "animName", display: true, title: "施放动作", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "vaildDis", display: true, title: "技能施放的有效范围", type: "num", step: 1, value: 0, callback: this.ChangeValue },
        { property: "castTime", display: true, title: "吟唱时间", type: "num", step: 1, value: 0, callback: this.ChangeValue },

        { property: "effect-type", display: true, title: "技能效果", type: "drop", options: [], value: "", callback: this.ChangeValue },
        { property: "effect-value", display: true, title: "效果值", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-time", display: true, title: "每秒间隔", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-duration", display: true, title: "持续时间", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "effect-describe", display: true, title: "效果描述", type: "text", value: "", callback: this.ChangeValue, },
        { property: "effect-icon", display: true, title: "debuff图标", type: "file", accept: "", value: "", callback: this.ChangeValue },

        { property: "describe", display: true, title: "效果描述", type: "textarea", value: "", callback: this.ChangeValue, },

      ],
      imgList: [], //用户上传图片
      inSelect: false,
      animList: [],
      editorIndex: -1,
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
      this.$parent.$refs.settingPanel_player.ChangePlayerAnim(animName);
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
    SelectFile(item) {
      console.log(" ", item);
      if (item.type == 'file') {
        this.selectProperty = item.property;
        this.inSelect = true;
        this.RequestGetAllUVAnim();
      }
    },
    ClickUVAnim(e) {
      this.Utils.SetSettingItemByProperty(this.setting, this.selectProperty, e);

      let sp = this.selectProperty.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }

      this.inSelect = false;
    },
    async RequestGetAllUVAnim() {
      this.imgList.splice(0, this.imgList.length);
      GetAllUVAnim().then((res) => {
        console.log(res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            this.imgList.push((element));
          }
        }
      });
    },
  },
};
</script>