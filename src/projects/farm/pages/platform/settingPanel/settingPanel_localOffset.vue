

<template>
  
  <div class="w-full max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class=" flex justify-between">
      <div class="text-left">局部偏移</div>
      <div class=" cursor-pointer " @click="fold = !fold;">{{ fold ? '展开' : '折叠' }}</div>
    </div>
    <div v-show="!fold">
      <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div> 
    </div>

  </div>
</template>

<script>


import YJinputCtrl from "../components/YJinputCtrl.vue"; 

export default {
  name: "settingpanel_localOffset",
  components: {
YJinputCtrl,
  },
  data() {
    return {
      settingData: {
        modelScale:1,
        rotation:[0,0,0],
        offsetPos:[0,0,0],
      },
      fold: false, 
      setting: [
        { property: "modelScale", display: true, title: "缩放比例", type: "num", value: 1, step: 0.01, callback: this.ChangeValue, },
        { property: "rotation", display: true, title: "旋转偏移（模型前方为Z轴）", type: "vector3", value: [0,0,0], step: 0.01, callback: this.ChangeValue, },
        { property: "offsetPos", display: true, title: "位置偏移", type: "vector3", value: [0,0,0], step: 0.01, callback: this.ChangeValue, },
      ],
    };
  },
  created() { 
    this.parent = this.$parent;
  },
  mounted() {
    setTimeout(() => {
      this.initValue();
    }, 1000);
  },
  methods: {

    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    initValue() { 
      this.settingData = this.$parent.settingData.localOffset;

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      console.log(" in local offset settingData ", this.settingData);
      if( !this.settingData.rotation){
        this.settingData.rotation = [0,0,0];
      }
      if( !this.settingData.offsetPos){
        this.settingData.offsetPos = [0,0,0];
      }
      
      if( !this.settingData.modelScale){
        this.settingData.modelScale = 1;
      }

      this.Utils.SetSettingItemByProperty(this.setting, "rotation", this.settingData.rotation);
      this.Utils.SetSettingItemByProperty(this.setting, "offsetPos", this.settingData.offsetPos);
      this.Utils.SetSettingItemByProperty(this.setting, "modelScale", this.settingData.modelScale);
 

    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      this.settingData[this.setting[i].property] = e;
 
      if ( this.setting[i].property == "rotation") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform()
          .GetComponent("MeshRenderer")
          .SetRotaArray(this.settingData.rotation);
      }
      
      if ( this.setting[i].property == "offsetPos") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform()
          .GetComponent("MeshRenderer")
          .SetPosArray(this.settingData.offsetPos);
      }
      
      if (this.setting[i].property == "modelScale") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform().GetComponent("MeshRenderer")
          .SetSize(e);
      }
      console.log(i + " " + this.setting[i].value);
    },
    save() { 
    },   
  },
};
</script>

<style scoped></style>
