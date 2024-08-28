 
<template> 
  <div class="
              w-full
              max-w-md
             p-2
             text-white 
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">拖尾效果设置</div>

    <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div> 

    <div class="  mt-2  w-11/12 h-10 mx-auto text-white flex justify-between " >
      <div class="  bg-445760 rounded-md inline-block px-2 leading-10   cursor-pointer  " @click="ClickBtnHandler('选中')" >选中</div>
    </div>

  </div>
</template>

<script>
 

import YJinputCtrl from "../components/YJinputCtrl.vue";
import * as Utils from "/@/utils/utils.js";

export default {
  name: "settingPanel_trail",
  components: { 
    YJinputCtrl,
  },
  data() {
    return {
      pointType: "trail",
      settingData: {
        imgPath: '', 
        color: "#ffffff",
        color2: "#ffffff",
        width: 0.1,
        maxLength: 20,
        lifeTime: 0.02, 
        // scaleUVy: 0.35, 
        // offsetUVy: 0.35, 
        isBlack: false,
        isLoop: false,
        isMirrorX: false,
        anchorType:"center",
      },
      setting: [ 
        {property: "imgPath", display: true, title: "选择图片", type: "file", filetype: "image", value: null },
        {property: "color", display: true, title: "主色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        {property: "color2", display: true, title: "混合色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        {property: "width", display: true, title: "宽度", type: "num", value: 1,step: 0.01, callback: this.ChangeValue },
        {property: "maxLength", display: true, title: "最大数量", type: "int", value: 1,step: 1, callback: this.ChangeValue },
        {property: "lifeTime", display: true, title: "持续时间", type: "num", value: 1, min: 0.02, max: 5, step: 0.01, callback: this.ChangeValue },
        // {property: "scaleUVy", title: "uv缩放", type: "num", value: 1, min: 0.02, max: 5, step: 0.01, callback: this.ChangeValue },
        // {property: "offsetUVy", title: "uv偏移", type: "num", value: 1, min: 0.02, max: 5, step: 0.01, callback: this.ChangeValue },
        {property: "isBlack",  display: true,title: "是否黑底", type: "toggle", value: false, callback: this.ChangeValue },
        {property: "isLoop",  display: true,title: "是否循环", type: "toggle", value: false, callback: this.ChangeValue },
        {property: "isMirrorX",  display: true,title: "是否水平镜像", type: "toggle", value: false, callback: this.ChangeValue },
        {
          property: "anchorType", display: true, title: "锚点", type: "drop", value: "center", options: [
            { value: 'bottom', label: '底部' },
            { value: 'center', label: '中心' }, 
          ], callback: this.ChangeValue,
        },
      ], 
    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {

    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    } 
    if (modelData.message == undefined) {
      this.settingData.id = this.parent.folderBase + "";
      return;
    } 
    this.Init(modelData.message.data); 

  },
  methods: {
    ClickBtnHandler(e) {
      if (e == "选中") {
        let obj = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        _Global.YJ3D._YJSceneManager.GetTransformManager().attach(obj.GetGroup());
        // obj.GetComponent("Trail").start();
      }
    },
    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    },
    Init(data) {
      this.settingData = data;
      Utils.SetSettingItemByPropertyAll(this.setting, this.settingData); 
    },
    ChangeValue(i, e) {
      console.log(i + " " + this.setting[i].value);

      this.setting[i].value = e;
      let property = this.setting[i].property; 
      this.settingData[property] = e;
      this.Update();
      _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("Trail")
          .SetMessage(this.settingData);
    }, 
    
    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    ClickUVAnim(i, item) { 

      
      this.setting[i].value = item;
      this.settingData[this.setting[i].property] = item;
 
      this.Update();
      _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("Trail")
          .SetMessage(this.settingData);
    },
    Update() {

      if (this.parent.updateModelTxtData) {
        console.log(" ======== this.parent.updateModelTxtData");
        this.parent.modelData.message = this.getMessage();
        this.parent.updateModelTxtData();
      }else {
        // 在场景编辑中的修改
        _Global.YJ3D._YJSceneManager.UpdateTransform(
          this.getMessage()
        );
      }

    },  

  },
};
</script>

<style scoped></style>
