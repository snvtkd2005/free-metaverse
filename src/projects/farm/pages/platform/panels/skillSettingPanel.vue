 
<template>
  <div class=" text-left w-6 h-6 bg-white flex text-black self-center leading-6 mx-auto cursor-pointer "
    @click="EditorEvent('新建')">
    <div class=" mx-auto">
      +
    </div>
  </div>
  <div v-show="isOpen" class="
       relative 
      w-full
      text-white 
      overflow-hidden  overflow-y-auto  overscroll-auto h-5/6
    ">
 
    <el-table :data="skillList" style="width: 100%">
      <el-table-column type="selection" width="40" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="skillName" label="技能名" width="100" />
      <el-table-column label="技能图标" width="80">
        <template #default="scope">
          <img class="w-full h-full object-fill hover:opacity-70" :src="$uploadUVAnimUrl + scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column   label="触发类型" width="100">
        <template #default="scope">
          <div>
            {{ scope.row && scope.row.trigger && scope.row.trigger.type }}
          </div>
        </template>
      </el-table-column>

      <el-table-column   label="触发值" width="100">
        <template #default="scope">
          <div>
            {{ scope.row && scope.row.trigger && scope.row.trigger.value }}
          </div>
        </template>
      </el-table-column>

      <el-table-column   label="目标类型" width="100">
        <template #default="scope">
          <div>
            {{scope.row && scope.row.target &&  scope.row.target.type }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="vaildDis" class=" truncate " label="攻击范围" width="100" />
      <el-table-column prop="castTime" label="吟唱时间" width="100" />
      <el-table-column prop="animNameReady" label="吟唱动作" width="100" />
      <el-table-column prop="animName" label="施放动作" width="100" />


      <el-table-column label="描述" width="200">
        <template #default="scope">
          <div>
            {{ scope.row &&  scope.row.describe }}
          </div>
        </template>
      </el-table-column> 

      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button size="small" @click="EditorEvent('编辑', scope.row, scope.$index)">编辑</el-button>
          <!-- <el-button size="small" type="danger" @click="EditorEvent('删除', scope.row,scope.$index)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>


    <!-- 技能添加弹窗 -->
    <skillItemEditorPanel ref="skillItemEditorPanel"></skillItemEditorPanel>

  </div>
</template>

<script>
 


import skillItemEditorPanel from "./skillItemEditorPanel.vue";

import { UploadPlayerFile } from "../../../js/uploadThreejs.js";

export default {
  name: "skillSettingPanel",
  components: { 
    skillItemEditorPanel,
  },
  data() {
    return {
      isOpen: true,
      inAdd: false,
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
      skillList: [],
      editorIndex: -1,

    };
  },
  created() { },
  mounted() {
    this.path = this.$uploadUrl;

    this.folderBase = "";
    this.initValue(this.settingData);
  },
  methods: {
    SetVisible(b, avatarName) {
      this.isOpen = b;
      if (b) {
        this.initValue(avatarName);
      }
    },

    initValue(_settingData) {
      this.settingData = _settingData;
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "trigger-type", "options", this.triggerType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "target-type", "options", this.targetType);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "effect-type", "options", this.effectType);

      // return;
      this.avatarName = "女射手";
      this.animList = _Global.animList;
      this.skillList = _Global.skillList;
      for (let i = this.skillList.length - 1; i >= 0; i--) {
        const element = this.skillList[i];
        if (element == null) {
          this.skillList.splice(i, 1);
        }
      }
      this.canAnimList = [];
      for (let i = 0; i < this.animList.length; i++) {
        const anim = this.animList[i];
        this.canAnimList.push({ label: anim.content, value: anim.animName });
      }

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameReady", "options", this.canAnimList);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animName", "options", this.canAnimList);

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

    EditorEvent(e, item, i) {
      console.log(e, item, i);
      if (e == "上传") {
        this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.SetAnimName(item);
        this.isOpen = false;
        return;
      }
      if (e == "读取") {
        this.ChangeAnim(item.animList[0].animName);
      }
      if (e == "新建") {
        this.editorIndex = -1;
        this.inAdd = true;

        this.$refs.skillItemEditorPanel.dialogTitle = "新建技能";
        this.$refs.skillItemEditorPanel.initValue(this.settingData);
      }
      if (e == "编辑") {
        this.editorIndex = i;
        this.inAdd = true;
        this.settingData = JSON.parse(JSON.stringify(item));
        this.$refs.skillItemEditorPanel.dialogTitle = "编辑技能";
        this.$refs.skillItemEditorPanel.initValue(this.settingData);

      }
      if (e == "删除") {
        // 技能名为空时，运行删除 
        this.skillList.splice(i, 1);
        this.saveSkill();
      }

      if (e == "清除") {
        // 清除角色的这一条动作记录 
        this.$parent.$refs.settingPanelCtrl.$refs.settingPanel_player.removeAnim(item.animName);
        item.has = false;
      }
    },

    saveSkill(settingData) {
      if (this.inAdd) {
        if (this.editorIndex == -1) {
          this.skillList.push(settingData);
        } else {
          this.skillList[this.editorIndex] = settingData;
        }
      }
      let s = JSON.stringify(this.skillList);
      let fromData = new FormData();
      //服务器中的本地地址
      fromData.append(
        "fileToUpload",
        this.$stringtoBlob(s, "skill_data.txt")
      );
      fromData.append("folderBase", this.folderBase);
      UploadPlayerFile(fromData).then((res) => {
        //先记录旧照片
        if (res.data == "SUCCESS") {
          console.log(" 上传 角色 技能数据 文件成功 ");
          this.inAdd = false;
        }
      });
    },
  },
};
</script>