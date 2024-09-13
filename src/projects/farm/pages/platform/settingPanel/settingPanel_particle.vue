
<template>
  <div class="
              w-full 
               p-2
             text-white
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">特效系统</div>
    <div>
      <YJinputCtrl :setting="setting" />
    </div>
 

    <div class=" mt-10 w-80 h-10 text-white  " >
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 cursor-pointer " @click="load()">{{ loadContent }}</div>
    </div>

    <div class=" mt-2 w-80 h-10 text-white ">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1  cursor-pointer"  @click="save()">保存</div>
    </div>


  </div>
</template>

<script>


import YJinputCtrl from "../components/YJinputCtrl.vue";

 
import YJmedia from "../components/YJmedia.vue";

export default {
  name: "settingpanel_particle",
  components: { 
    YJinputCtrl,
    YJmedia,
  },
  data() {
    return {
      
      pointType: "particle",

      settingData: {
        id: "",        
        looping:true,

        hasShape:true,
        shape:{
          type:"box", // 发射形状
          // 发射范围大小

          position:[0,0,0],
          rotation:[0,0,0],
          scale:[1,1,1],
        },
        startSpeed: 10,// 发射速度
        startLifetime: 1, // 粒子存活时长
        startSize: 1,// 粒子大小

        maxParticles: 100,// 最大数量
        color: "#ffffff",

        particleType: "image", // 粒子类型 图片、模型
        particlePath: "", // 粒子引用路径
        renderAlignment: "view", // 渲染对齐模式

        isBlack: false,
        sizeOverLifetime:false,
        sizeOverLifetimeValue:[1,0],
        
        rotationOverLifetime: false,
        rotationOverLifetimeValue: [0,0,0],

        colorOverLifetime:false,
        colorOverLifetimeStart:"#ffffff",
        colorOverLifetimeEnd:"#ffffff",

      },
      setting: [
        { property: "looping", display: true, title: "是否循环", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "startSpeed", display: true, title: "发射速度", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        { property: "startLifetime", display: true, title: "粒子存活时长", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        { property: "startSize", display: true, title: "粒子大小", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        { property: "maxParticles", display: true, title: "最大数量", type: "num", step:1, value: 1, callback: this.ChangeValue },
        { property: "color", display: true, title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        { property: "particlePath", display: true, title: "选择", type: "file",filetype:"image", value: "", callback:null },
        {
          property: "particleType", display: true, title: "粒子类型", type: "drop", value: "图片", options: [
            { label: "图片", value: "image" },
            // { label: "模型", value: "model" },
          ], callback: this.ChangeValue
        },

        { property: "hasShape", display: true, title: "应用范围", type: "toggle", value: true, callback: this.ChangeValue },
        {
          property: "shape-type", display: false, title: "范围类型", type: "drop", value: "立方体", options: [
            { label: "立方体", value: "box" },
            { label: "圆柱体", value: "cone" },
          ], callback: this.ChangeValue
        },
        { property: "shape-scale", display: false, title: "发射范围大小", type: "vector3", value: [1,1, 1], step: 0.01, callback: this.ChangeValue },

        { property: "sizeOverLifetime", display: true, title: "生命周期内大小", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "sizeOverLifetimeValue", display: false, title: "大小值", type: "vector2", value: [1,1], callback: this.ChangeValue },
        
        { property: "rotationOverLifetime", display: true, title: "生命周期内旋转", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "rotationOverLifetimeValue", display: false, title: "旋转值", type: "vector3", value: [0,0,0], callback: this.ChangeValue },
        

        { property: "colorOverLifetime", display: true, title: "生命周期内颜色", type: "toggle", value: false, callback: this.ChangeValue },
        { property: "colorOverLifetimeStart", display: false, title: "渐变起始色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        { property: "colorOverLifetimeEnd", display: false, title: "渐变结束色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        

        {
          property: "renderAlignment", display: true, title: "渲染对齐模式", type: "drop", value: "视图", options: [
            { label: "视图", value: "view" },
            { label: "局部", value: "local" },
            // { label: "世界", value: "world" },
          ], callback: this.ChangeValue
        },
        { property: "isBlack", display: true, title: "是否黑底", type: "toggle", value: false, callback: this.ChangeValue },

      ],
      loadContent: "重新播放", 
    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {


    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      this.initValue();
      return;
    }
    if (modelData.message == undefined) {
      this.settingData.id = this.$parent.folderBase + "";
      this.initValue();
      return;
    }

    console.log(" modelData = ", modelData);
    this.settingData = modelData.message.data;
    this.initValue();

    // setTimeout(() => {
    //   this.load();
    // }, 5000);

  },
  methods: {
    
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    }, 
    initValue() {

      if(this.settingData.rotationOverLifetimeValue == undefined){
        this.settingData.rotationOverLifetimeValue = [0,0,0];
      }
      if(this.settingData.hasShape == undefined){
        this.settingData.hasShape = true;
      }

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

      this.Utils.SetSettingItemByProperty(this.setting, "sizeOverLifetimeValue", this.settingData.sizeOverLifetimeValue);
      this.Utils.SetSettingItemByProperty(this.setting, "rotationOverLifetimeValue", this.settingData.rotationOverLifetimeValue);

      this.ChangeUIState();
      // for (let i = 0; i < this.setting.length; i++) {
      //   const element = this.setting[i];
      //   if(this.settingData[element.property] != undefined){
      //     element.value = this.settingData[element.property];
      //   }
      // } 

    },
    Init(_settingData) {
      this.settingData = _settingData;
      this.initValue();
      console.log(" particle setting data ", _settingData);
    },
    
    ChangeUIState() {
      // 根据选择判断哪些属性不显示 
      let colorOverLifetime = this.Utils.GetSettingItemValueByProperty(this.setting, 'colorOverLifetime');
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "colorOverLifetimeStart", "display",colorOverLifetime);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "colorOverLifetimeEnd", "display",colorOverLifetime);

      let sizeOverLifetime = this.Utils.GetSettingItemValueByProperty(this.setting, 'sizeOverLifetime');
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "sizeOverLifetimeValue", "display",sizeOverLifetime);
        
      let hasShape = this.Utils.GetSettingItemValueByProperty(this.setting, 'hasShape');
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "shape-type", "display",hasShape);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "shape-scale", "display",hasShape);
      
      let rotationOverLifetime = this.Utils.GetSettingItemValueByProperty(this.setting, 'rotationOverLifetime');
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "rotationOverLifetimeValue", "display",rotationOverLifetime);

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
      this.ChangeUIState();
      // console.log(i + " ",this.setting[i].property, this.settingData[this.setting[i].property],e);
    },
    save() {
      // 单品中才有 updateModelTxtData
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    load() {
      // console.log(this.settingData);return;
      _Global.YJ3D._YJSceneManager.GetSingleModelTransform().
        GetComponent("Particle").SetMessage(this.settingData);
    },
    Update() { 
      _Global.YJ3D._YJSceneManager.UpdateTransform(this.getMessage());
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
