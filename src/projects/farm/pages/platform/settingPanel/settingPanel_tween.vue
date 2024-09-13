
<template>
  <div class="
              w-full 
               p-2
             text-white
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">动效系统</div>
    <div>
      <YJinputCtrl :setting="setting" />
    </div>
 

    <div class=" mt-2 w-full h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{ loadContent }}</div>
    </div>

    <div class=" mt-2 w-full h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>


  </div>
</template>

<script>


import YJinputCtrl from "../components/YJinputCtrl.vue";


export default {
  name: "settingpanel_tween",
  props:['data','index'],
  components: { 
    YJinputCtrl, 
  },
  data() {
    return {
      
      pointType: "tween",

      settingData: {
        type: "pos",//pos/rota/scale/alpha
        from:[0,0,0],
        to:[0,0,0],
        duration:1, 
        playStyle:"once",//once/loop/pingpang
      },
      setting: [
        {
          property: "type", display: true, title: "动效", type: "drop", value: "pos", options: [
            { label: "移动", value: "pos" },
            { label: "旋转", value: "rota" },
            { label: "缩放", value: "scale" },
            { label: "透明度", value: "alpha" },
          ], callback: this.ChangeValue
        },
        { property: "from", display: true, title: "from", type: "vector3", value: [1,1, 1], step: 0.01, callback: this.ChangeValue },
        { property: "to", display: true, title: "to", type: "vector3", value: [1,1, 1], step: 0.01, callback: this.ChangeValue },

        { property: "duration", display: true, title: "动画时长", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        
        {
          property: "playStyle", display: true, title: "动效样式", type: "drop", value: "once", options: [
            { label: "一次", value: "once" },
            { label: "循环", value: "loop" },
            { label: "来回", value: "pingpang" },
          ], callback: this.ChangeValue
        }, 
      ],
      loadContent: "播放动效", 
    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {
    if(this.data){
      this.settingData = this.data;
    }

    console.log(" in twenn panel ",this.data);
    this.initValue();
 
  },
  methods: {
    
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    }, 
    initValue() {
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      this.Utils.SetSettingItemByProperty(this.setting, "from", this.settingData.from);
      this.Utils.SetSettingItemByProperty(this.setting, "to", this.settingData.to);

    }, 
    ChangeValue(i, e) {
      // return;
      this.setting[i].value = e;
      let sp = this.setting[i].property.split('-');
      if (sp.length == 1) {
        this.settingData[sp[0]] = e;
      } else {
        this.settingData[sp[0]][sp[1]] = e;
      }

      this.load();
      // console.log(i + " ",this.setting[i].property, this.settingData[this.setting[i].property],e);
    },
    save() {
      // 单品中才有 updateModelTxtData
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.components[this.index] = this.getMessage();
        this.parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    getMessage() {
      return {
        type:this.pointType,
        data:this.settingData,
      } 
    },
    load() {
      _Global.YJ3D._YJSceneManager.GetSingleModelTransform().UpdateComponentsData(this.index, this.getMessage());
      _Global.YJ3D._YJSceneManager.GetSingleModelTransform().UpdateAllComponents();
    },
    Update() { 
      // 调用场景保存
      if (this.parent.updateSceneModelData) {
        this.parent.updateSceneModelData();
      }  
    },
    ClickUVAnim(i, item) {
      this.setting[i].value = item;
      this.settingData[this.setting[i].property] = item;
      this.load();
    }, 

  },
};
</script>

<style scoped></style>
