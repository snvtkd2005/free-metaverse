 
<template> 
  <div class="
              w-full 
               p-2
             text-white 
             rounded-lg
             overflow-hidden 
             relative
            ">
    <div class=" text-left ">材质设置</div>
    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div>

    <div class=" mt-2 w-full h-10 text-white cursor-pointer " @click="ClickBtnHandler('保存')">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>
    <div v-if="isLock" class=" absolute left-0 top-0 w-full h-full bg-black bg-opacity-30">

    </div>
  </div>
</template>

<script>


import YJinputCtrl from "../components/YJinputCtrl.vue";

export default {
  name: "settingPanel_shader",
  components: {
    YJinputCtrl,
  },
  data() {
    return { 
      pointType: "shader",
      isLock: false,
      settingData: {
        name: "weapon001",
        map: "idle",
        color: "#ffffff",
        row: 14,
        col: 1,
        speed: 1,
        shaderType:"",
      },

      setting: [
        { property: "map", display: true, title: "选择UV图", type: "file", filetype: "image", value: null },
        { property: "color", display: true, title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        { property: "row", display: true, title: "UV X", type: "num", value: 14, callback: this.ChangeValue },
        { property: "col", display: true, title: "UV Y", type: "num", value: 1, callback: this.ChangeValue },
        
        {
          property: "shaderType", display: true, title: "shader类型", type: "drop", value: "twoHand", options: [], callback: this.ChangeValue
        }, 
        { property: "speed", display: true, title: "默认X轴播放速度", type: "slider", value: 1, min: 0, max: 5, step: 0.5, callback: this.ChangeValue },
 
      ],

      shaderType: [
        { value: "None", label: "none" },
        { value: "river", label: "河流" },
        { value: "lake", label: "湖" },
        { value: "ocean", label: "海" },  
      ],  
      auto: true,
    };
  },
  created() {

    this.parent = this.$parent.$parent;
    this.initValue();

  },
  mounted() {

    // this.RequestGetAllUVAnim();

    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
    let modelData = JSON.parse(localStorage.getItem("modelData"));

    if (modelData.message == undefined) {
      return;
    }

    this.settingData = modelData.message.data;
 
    this.initValue();


  },
  methods: {
    
    ClickBtnHandler(e) {
      if (e == "保存") {
        this.saveFn();
      }
    },
    sliderChangeFn(e) {
      this.auto = false;
      //动画暂停自动播放
      //动画随滑块播放
      // console.log("滑块值改变 ", this.animClip.currentTime);
    },
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {
    }, 
    initValue() {
       
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
  
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "shaderType", "options", this.shaderType);


      // setTimeout(() => {
      //   console.log( this.settingData);
      //   _Global.SendMsgTo3D("切换角色动作", this.settingData.animName);
      //   _Global.SendMsgTo3D("单品放置在骨骼上", this.settingData.boneName);
      //   setTimeout(() => {
      //     _Global.SendMsgTo3D("单品在骨骼上位移", this.settingData.position);
      //     _Global.SendMsgTo3D("单品在骨骼上旋转", this.settingData.rotation);
      //   }, 20);
      // }, 3000);

    },  
    Init(_data) {
      this.settingData = _data; 
      this.initValue();
    },
    ChangeValue(i, e) {
      // return;
      this.setting[i].value = e;
      this.settingData[this.setting[i].property] = e;
      console.log(i + " " + this.setting[i].value);
      // console.log(i + " " + this.setting[i].value + " " + e);
      if (this.setting[i].property.includes("shaderType")) {
        
        return;
      } 
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
    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    }, 
    saveFn() {
      // 单品中才有 updateModelTxtData
      if (this.parent.updateModelTxtData) {
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },
    Update() {
      _Global.YJ3D._YJSceneManager.UpdateTransform(
        this.getMessage()
      );
      // 调用场景保存
      if (this.parent.updateSceneModelData) {
        this.parent.tableList[2].value = true;
        this.parent.updateSceneModelData();
      }
    },

  },
};
</script>

<style scoped></style>
