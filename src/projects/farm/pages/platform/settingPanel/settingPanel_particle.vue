
// 特效设置
<template>
  <!-- 设置面板 -->
  <div class="
              w-80
              max-w-md
               p-2
             text-white
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">特效设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80 h-auto mb-2     ">

      <div class=" self-center w-40  truncate" v-show="item.display">
        {{ item.title }}
      </div>
      <div class=" self-center w-auto " v-show="item.display">
        <div v-if="item.type == 'file'" class=" relative flex  gap-2   ">
          <div class=" flex gap-2 ">
            <img class=" w-16 h-16 "  :src="item.value" alt="">
            <div class=" text-xs cursor-pointer  self-center mx-auto w-6 h-4 text-center leading-4  rounded-lg bg-white text-black"
            @click="SelectFile(item, i)">
              ...
            </div>
          </div>
        </div>
        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <YJinput_number :index="i" :step="item.step" :value="item.value" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'upload'" v-show="item.display" class=" relative flex  gap-2 cursor-pointer  ">
          <YJinput_upload class=" w-32 h-16 " :accept="item.accept" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'text'" class=" w-32 h-16 text-black ">
          <YJinput_text class=" w-full h-16 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-20 h-16 text-black ">
          <YJinput_drop class=" w-32 h-16 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>


      </div>

    </div>
    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{ loadContent }}</div>
    </div>

    <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>

    <div class=" absolute right-80 bg-gray-400 rounded-lg shadow-lg grid grid-cols-4 w-96 p-4 " 
    v-if="inSelect">
    <div class="  absolute right-0 top-0 rounded-full bg-white text-black w-6 h-6 cursor-pointer  "
    @click="inSelect=false"> X </div>
      <div v-for="(item, i) in uvAnimList" :key="i" class="
                  self-center w-20 h-20 relative
                ">
        <div class=" w-20 h-20 self-center mx-auto 
                  cursor-pointer " @click="ClickUVAnim(item)">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item" />
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import YJinput_text from "../components/YJinput_text.vue";
// import YJinput_text from "../components/YJinput_textarea.vue";
import YJinput_drop from "../components/YJinput_drop.vue";
import YJinput_upload from "../components/YJinput_upload.vue";
import YJinput_number from "../components/YJinput_number.vue";

import { GetAllUVAnim } from "../../../js/uploadThreejs.js";
import YJmedia from "../components/YJmedia.vue";

export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_text,
    YJinput_drop,
    YJinput_upload,
    YJinput_number,
    YJmedia,
  },
  data() {
    return {
      chassisWidth: 2.2, //车身宽

      settingData: {
        id: "",
        shapeType: "box", // 发射形状
        shapeSize: 10, // 发射范围大小
        startSpeed: 0.02,// 发射速度
        startLifetime: 1, // 粒子存活时长
        startSize: 1,// 粒子大小

        maxParticles: 100,// 最大数量

        particleType: "image", // 粒子类型 图片、模型
        particlePath: "", // 粒子引用路径
        renderAlignment: "view", // 渲染对齐模式

      },

      setting: [
        {
          property: "shapeType", display: true, title: "范围类型", type: "drop", value: "立方体", options: [
            { label: "立方体", value: "box" },
          ], callback: this.ChangeValue
        },
        { property: "shapeSize", display: true, title: "发射范围大小", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        { property: "startSpeed", display: true, title: "发射速度", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        { property: "startLifetime", display: true, title: "粒子存活时长", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        { property: "startSize", display: true, title: "粒子大小", type: "num", step:0.1, value: 1, callback: this.ChangeValue },
        { property: "maxParticles", display: true, title: "最大数量", type: "num", step:1, value: 1, callback: this.ChangeValue },

        {
          property: "particleType", display: true, title: "粒子类型", type: "drop", value: "图片", options: [
            { label: "图片", value: "image" },
            // { label: "模型", value: "model" },
          ], callback: this.ChangeValue
        },
        { property: "particlePath", display: true, title: "选择", type: "file", value: "", callback:null },

        {
          property: "renderAlignment", display: true, title: "渲染对齐模式", type: "drop", value: "视图", options: [
            { label: "视图", value: "view" },
            // { label: "世界", value: "world" },
          ], callback: this.ChangeValue
        },
      ],
      uvAnimList: [],

      loadContent: "加载",
      inSelect: false,
    };
  },
  created() {

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


  },
  methods: {
    
    removeThreeJSfocus() {
      this.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    },
    getSettingItemByProperty(property){
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if(element.property == property){
          return element;
        }
      } 
      return null;
    },
    initValue() {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if(this.settingData[element.property] != undefined){
          element.value = this.settingData[element.property];
        }
      } 
    },
    Init(_settingData) {
      this.settingData = _settingData;
      this.initValue();
      console.log(" particle setting data ", _settingData);
    },
    ChangeValue(i, e) {
      // return;
      this.setting[i].value = e;
      this.settingData[this.setting[i].property] = e;

      this.load();
      
      // console.log(e);
      // console.log(this.setting[i].value);
      // console.log(this.settingData[this.setting[i].property]);
      // console.log(i + " ",this.setting[i].property, this.setting[i].value);
    },
    save() {
      // 单品中才有 updateModelTxtData
      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: "particle",
          data: this.settingData
        };
        this.$parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    load() {
      // console.log(this.settingData);return;
      _Global.YJ3D._YJSceneManager.GetSingleModelTransform().
        GetComponent("Particle").Load(this.settingData);
    },
    ClickUVAnim(item) {
      
      let propertyItem =  this.getSettingItemByProperty("particlePath");
      if(propertyItem == null){return;}
      propertyItem.value = this.$uploadUVAnimUrl + item;
      this.settingData[propertyItem.property] =this.$uploadUVAnimUrl + item;
      this.load();
      
    },
    Update() { 
      _Global.YJ3D._YJSceneManager.UpdateTransform(
        {
          pointType: "particle",
          data: this.settingData
        }
      );
      // 调用场景保存
      if (this.$parent.updateSceneModelData) {
        this.$parent.updateSceneModelData();
      }


    },

    SelectFile(item) {
      // console.log(" ", item);
      if (item.title == '选择') {
        this.inSelect = true;
        this.RequestGetAllUVAnim();
      }
    },
    async RequestGetAllUVAnim() {
      this.uvAnimList.splice(0, this.uvAnimList.length);
      GetAllUVAnim().then((res) => {
        // console.log(res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            this.uvAnimList.push((element));
          }
        }
      });
    },

  },
};
</script>

<style scoped></style>
