
<template>
  
  <div class="
              w-full 
               p-2
             text-white 
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">变换</div>

    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div> 

    <!-- <div v-if="isLock" class=" absolute left-0 top-0 w-full h-full bg-black bg-opacity-30">

    </div> -->
  </div>
</template>

<script>
 
 
import YJinputCtrl from "../components/YJinputCtrl.vue"; 

export default {
  name: "settingpanel_transform",
  components: { 
YJinputCtrl,
  },
  data() {
    return { 
      isLock:false,
      settingData: {
        modelId:"",
        active:true,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1,1], 
      }, 
      setting: [ 
        { property: "modelId", display: true, title: "唯一id", type: "text", value: "", callback: this.ChangeValue },
        { property: "active", display: true, title: "是否显示", type: "toggle", value: true, callback: this.ChangeValue },
        { property: "position", display: true, title: "坐标", type: "vector3", value: [0, 0, 0], step: 0.01, callback: this.ChangeValue },
        { property: "rotation", display: true, title: "旋转", type: "vector3", value: [0, 0, 0], step: 0.1, callback: this.ChangeValue },
        { property: "scale", display: true, title: "缩放", type: "vector3", value: [1,1, 1], step: 0.01, callback: this.ChangeValue },
      ], 
    };
  },
  created() {

  },
  mounted() { 

  },
  methods: {
    initValue() {
      this.Utils.SetSettingItemByProperty(this.setting, "position", this.settingData.position);
      this.Utils.SetSettingItemByProperty(this.setting, "rotation", this.settingData.rotation);
      this.Utils.SetSettingItemByProperty(this.setting, "scale", this.settingData.scale);
      this.Utils.SetSettingItemByProperty(this.setting, "active", this.settingData.active);
      this.Utils.SetSettingItemByProperty(this.setting, "modelId", this.settingData.modelId);
    },  
    Init(transformJS) {
      this.transformJS = transformJS;
      this.settingData = transformJS.GetTransform(); 
      transformJS.AddListener("变换",(_data)=>{
        this.settingData = _data; 
        this.initValue();
      });
      // console.log("选中物体", this.settingData); 
      this.initValue();
    },
    ChangeValue(i, e) { 
      this.setting[i].value = e;
      this.settingData[this.setting[i].property] = e;
      // console.log(i + " " + this.setting[i].value);
      if (this.setting[i].property == "position") { 
        this.transformJS.SetPosArray(e);
        return;
      }
      if (this.setting[i].property == "rotation") { 
        this.transformJS.SetRotaArray(e);
        return;
      } 
      if (this.setting[i].property == "scale") { 
        this.transformJS.SetScaleArray(e);
        return;
      } 
      
      if (this.setting[i].property == "active") { 
        this.transformJS.SetActive(e);
        return;
      } 
      if (this.setting[i].property == "modelId") { 
        this.transformJS.SetModelId(e);
        _Global.applyEvent("改变modelId或名称", this.transformJS.GetData());
        return;
      } 
    },
  },
};
</script>

<style scoped></style>
