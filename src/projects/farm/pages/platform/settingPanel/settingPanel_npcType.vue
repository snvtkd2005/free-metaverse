
<template>
  <div class="w-full max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class="flex">
      <div class="text-left">NPC类型设置</div> 
    </div>
    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div>  
  </div> 
</template>

<script> 
import YJinputCtrl from "../components/YJinputCtrl.vue";

export default {
  name: "settingpanel_npcType", //npc事件内容
  components: { 
    YJinputCtrl,
  },
  data() {
    return { 
      settingData: {
        npcType:"",
        textContent:"",
        taskList: [],
        goodsList: [],
      },
      setting: [
        { property: "npcType",display: true,title: "npc类型",type: "drop",value: "none", options: [
            { value: "none", label: "none" },
            { value: "shop", label: "商人" },
            { value: "task", label: "任务发布" }, 
          ], callback: this.ChangeValue,
        },
        { property: "textContent", display: false, title: "默认文字", type: "textarea", value: "", callback: this.ChangeValue, },
        { property: "taskList", display: false, title: "任务列表", type: "taskList", value: [], callback: this.ChangeValue, },
        { property: "goodsList", display: false, title: "商品列表", type: "goodsList", value: [], callback: this.ChangeValue, },


      ], 
    };
  },
  created() {
    this.parent = this.$parent.$parent;
  },
  mounted() {
    setTimeout(() => {
      this.initValue();
    }, 1000);
  },
  methods: {
    
    setSettingItemByProperty(property, value) {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == property) {
          element.value = value;
        }
      }
    },
    removeThreeJSfocus() {
      this.parent.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {},

    initValue() {
      this.settingData = this.$parent.settingData.eventData;

      // console.log(" in npc type ",this.settingData );
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "taskList", "value",this.settingData.taskList);
      this.ChangeUIState();
    },
    
    ChangeUIState() {
      // 根据选择判断哪些属性不显示
       
      let npcType = this.Utils.GetSettingItemValueByProperty(this.setting, 'npcType');


      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "textContent", "display",npcType=='task');
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "taskList", "display",npcType=='task');
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "goodsList", "display",npcType=='shop');
        
    },
    ChangeValue(i, e) {
      console.log(i, e);
      this.setting[i].value = e;
      let property = this.setting[i].property;
      let sp = property.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }
      if(property=="npcType"){

      }
      this.ChangeUIState();

    },
    // 改变控制器角色动作
    ChangeEvent(e,v) {
      if(e=="添加任务"){
        console.log("in npctype ", v);
        this.settingData.taskList = [];
        for (let i = 0; i < v.length; i++) {
          const vv = v[i];
          this.settingData.taskList.push({
            id:vv.id,
            taskTitle:vv.taskTitle,
            from:vv.from
          })
        }
        this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "taskList", "value",this.settingData.taskList);

      }
    },  
    save(){
      // 向npc数据保存
      this.$parent.settingData.eventData = this.settingData;
    },
  },
};
</script>

<style scoped></style>
