

<template>
  <el-dialog
    :title="dialogTitle"
    class="bg-546770 text-white create-card"
    center
    v-model="inAdd"
    :modal-append-to-body="false"
    width="35%"
  >
    <div class="flex">
      <div class="w-full">
        <YJinputCtrl :setting="setting" />
      </div> 
    </div>
    <div class="w-full flex">
      <span slot="footer" class="dialog-footer mx-auto">
        <el-button class="   " type="primary" @click="FloatEvent('保存')"
          >保存</el-button
        >
      </span>
    </div>
  </el-dialog>
</template>

<script>
import YJinputCtrl from "../components/YJinputCtrl.vue";

import taskItem from "../../../data/platform/taskItem.js"; 

export default {
  name: "taskItemEditorPanel",
  props: ["isOpen"],
  components: {
    YJinputCtrl, 
  },
  data() {
    return {
      dialogTitle: "添加任务",
      settingData: {},
      setting: [
        {
          property: "taskTitle",
          display: true,
          title: "任务名",
          type: "text",
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "describe",
          display: true,
          title: "任务描述",
          type: "textarea",
          value: "",
          callback: this.ChangeValue,
        },
        {
          property: "targetList",
          display: true,
          title: "任务目标",
          type: "taskArrayVariable",
          options: [],
          step: 1,
          value: [],
          callback: this.ChangeValue,
        },
        {
          property: "targetDescribe",
          display: true,
          title: "任务目标描述",
          type: "textarea",
          value: "",
          callback: this.ChangeValue,
        },

        {
          property: "rewardItems",
          display: true,
          title: "道具奖励",
          type: "rewardArrayVariable",
          options: [],
          step: 1,
          value: [],
          callback: this.ChangeValue,
        },

        {
          property: "rewardGold",
          display: true,
          title: "金币奖励",
          type: "num",
          step: 1,
          value: 1,
          callback: this.ChangeValue,
        },
        {
          property: "rewardExp",
          display: true,
          title: "经验值奖励",
          type: "num",
          step: 1,
          value: 1,
          callback: this.ChangeValue,
        },
      ],
      animList: [],
      inAdd: false,
    };
  },
  watch:{
    inAdd(v){
      if(!v){
        _Global.applyEvent("预览关闭",'任务');
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    createNew() {
      this.initValue(JSON.parse(JSON.stringify(taskItem.taskData)));
    },
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
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "targetList",
        "options",
        taskItem.targetType
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "targetList",
        "value",
        this.settingData.targetList
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "rewardItems",
        "options",
        taskItem.rewardItemType
      );
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "rewardItems",
        "value",
        this.settingData.rewardItems
      );

      for (let i = 0; i < this.setting.length; i++) {
        this.ChangeUIState(this.setting[i].property, this.setting[i].value);
      } 
      _Global.applyEvent("预览打开",'任务',this.settingData);

    },
    ChangeUIState(property, e) {
      // 根据选择判断哪些属性不显示
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
      this.settingData.targetDescribe = this.GetDescribe(this.settingData);
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "targetDescribe",
        "value",
        this.settingData.targetDescribe
      );
    },

    FloatEvent(e) {
      if (e == "保存") {
        if (!this.settingData.id) {
          this.settingData.id = new Date().getTime();
        }
        this.settingData.targetDescribe = this.GetDescribe(this.settingData);
        this.$parent.save(this.settingData);
        this.inAdd = false;

        console.log(this.settingData);
      }
    },
    GetDescribe(taskData) {
      let describe = "";
      if (taskData.targetList && taskData.targetList.length > 0) {
        for (let j = 0; j < taskData.targetList.length; j++) {
          const target = taskData.targetList[j];
          if (target.type == "kill") {
            describe += "消灭 " + target.need + " 个" + target.name;
          }
          describe += j == taskData.targetList.length - 1 ? "" : "和";
        }
      }
      return describe;
    },
    selectEquip(type, data, i) {
      if (type == "equip") {
        let equip = {
          // type: "equip",
          // 唯一id
          // folderBase: data.folderBase,
          icon: this.$uploadUrl + data.icon,
          // 装备名称
          name: data.name,
          // 品质
          // qualityType: data.message.data.qualityType,
          // // 部位，唯一
          // part: data.message.data.partType,
          // // 武器或装备
          // pointType: data.message.pointType,
          // // 附加属性
          // propertyList: data.message.data.propertyList,
        };
        this.settingData.rewardItems[i].id = data.folderBase;
        this.settingData.rewardItems[i].skill = equip;
      }
      if (type == "prop") {
        console.log("选择道具", data);
        this.settingData.rewardItems[i].id = data.id;
        this.settingData.rewardItems[i].skill = data;
      }
      this.Utils.SetSettingItemPropertyValueByProperty(
        this.setting,
        "rewardItems",
        "value",
        this.settingData.rewardItems
      );
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