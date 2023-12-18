
// UV动画设置
<template>
  <!-- 场景设置面板 -->
  <div class="
              w-full
              max-w-md
             p-2
             text-white 
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">交互模型设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-full h-auto pb-2 pr-2   ">
      <div class=" self-center w-1/3">
        {{ item.title }}
      </div>
      <div class=" self-center w-2/3 ">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'file'" class="  relative flex  gap-2 cursor-pointer  " @click="SelectFile(item, i)">
          <!-- <div>{{ item.url }}</div> -->
          <img class=" w-10 h-10    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item.value" />
          
          <div class=" absolute right-0 w-auto h-6 rounded-sm bg-gray-50 flex">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'textarea'" class=" w-32 h-auto text-black ">
          <YJinput_textarea class=" w-full h-auto " :value="item.value" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'text'" class=" w-32 h-auto text-black ">
          <YJinput_text class=" w-full h-auto " :value="item.value" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'drop'" class=" w-20 h-18 text-black ">
          <YJinput_drop class=" w-32 h-18 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'num'" class=" flex gap-2 text-black "> 
          <YJinput_number :value="item.value"  :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'slider'" class=" flex gap-2 ">
          <YJinput_range :value="item.value"  :index="i" :step="item.step" :min="item.min" :max="item.max"
            :callback="item.callback" />
          <div>{{ item.value }}</div>
        </div>

        <div v-if="item.type == 'toggle'" class=" w-4 h-4 ">
          <YJinput_toggle class=" w-4 h-4 " :index="i" :value="item.value" :callback="item.callback" />
        </div>
      </div>
    </div>


    <div v-if="inSelect" class=" flex flex-wrap">
      <div v-for="(item, i) in imgList" :key="i" class="
                  self-center w-20 h-auto relative
                ">
        <div class=" w-16 h-16 self-center mx-auto 
                  cursor-pointer " @click="ClickUVAnim(item)">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item" />
        </div>
      </div>
    </div>


  </div>
</template>

<script>

import YJinput_color from "../components/YJinput_color.vue";
import YJinput_range from "../components/YJinput_range.vue";
import YJinput_number from "../components/YJinput_number.vue";
import YJinput_toggle from "../components/YJinput_toggle.vue";
import { GetAllUVAnim } from "../../../js/uploadThreejs.js";
import YJinput_drop from "../components/YJinput_drop.vue";
import YJinput_textarea from "../components/YJinput_textarea.vue";
import YJinput_text from "../components/YJinput_text.vue";

import * as Utils from "/@/utils/utils.js";


export default {
  name: "settingPanel_interactive",
  components: {
    YJinput_range,
    YJinput_number,
    YJinput_color,
    YJinput_toggle,
    YJinput_drop,
    YJinput_textarea,
    YJinput_text,
  },
  data() {
    return {
      pointType: "interactive",
      settingData: {
        imgPath: '',
        buff:"",
        buffValue: 0,
        relifeTime:0,//重新生成间隔时间 秒
        type:"", //道具类型唯一id
        describe:"",//道具描述
        name:"",//道具名
        color: "#ffffff",
        row: 14,
        col: 1,
        speed: 1,
        delay: 100,
        isBlack: false,
      },
      setting: [
        {property: "name", title: "道具名", type: "text", value: "", callback: this.ChangeValue },
        {property: "imgPath", title: "选择图片", type: "file", value: null },
        // {property: "color", title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeColor },
        // {property: "row", title: "UV X", type: "num", value: 14, callback: this.ChangeX },
        // {property: "col", title: "UV Y", type: "num", value: 1, callback: this.ChangeY },
        // {property: "speed", title: "播放速度", type: "slider", value: 1, min: 0.5, max: 5, step: 0.5, callback: this.SliderSpeed },
        // {property: "isBlack", title: "是否黑底", type: "toggle", value: false, callback: this.ChangeValue },
        {
          property: "buff", display: true, title: "触发效果", type: "drop", value: "加护甲", options: [
            { value: 'addArmor', label: '加护甲' },
            { value: 'addHealth', label: '加生命' }, 
            { value: 'addEnergy', label: '加能量' }, 
          ], callback: this.ChangeValue,
        },
        {property: "type", title: "道具类型(同一种道具类型保持一致)", type: "text", value: "", callback: this.ChangeValue },

        // {
        //   property: "type", display: true, title: "道具类型(同一种道具类型保持一致)", type: "drop", value: "口罩", options: [
        //     { value: 'kouzhao', label: '口罩' },
        //     { value: 'fanghufu', label: '防护服' }, 
        //     { value: 'zhongcaoyao', label: '中草药汤剂' }, 
        //     { value: 'jiujingpenghu', label: '酒精喷壶' }, 
        //     { value: 'nengliang', label: '能量补给' }, 
        //   ], callback: this.ChangeValue,
        // },

        {property: "buffValue", title: "触发效果值", type: "num", value: 0, callback: this.ChangeValue },
        {property: "relifeTime", title: "重新生成间隔时间", type: "num", value: 0, callback: this.ChangeValue },
        {property: "describe", title: "道具描述", type: "textarea", value: "", callback: this.ChangeValue },

      ],


      imgList: [], //用户上传图片
      inSelect: false,
    };
  },
  created() {

  },
  mounted() {

    this.RequestGetAllUVAnim();

    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    } 
    if (modelData.message == undefined) {
      return;
    } 
    this.Init(modelData.message.data); 

  },
  methods: {
    
    removeThreeJSfocus() {
      this.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    },
    Init(data) {
      this.settingData = data;
      Utils.SetSettingItemByProperty(this.setting,"name",  this.settingData.name);
      Utils.SetSettingItemByProperty(this.setting,"imgPath",  this.settingData.imgPath);
      Utils.SetSettingItemByProperty(this.setting,"buff",  this.settingData.buff);
      Utils.SetSettingItemByProperty(this.setting,"buffValue",  this.settingData.buffValue);
      Utils.SetSettingItemByProperty(this.setting,"type",  this.settingData.type);
      Utils.SetSettingItemByProperty(this.setting,"relifeTime",  this.settingData.relifeTime);
      Utils.SetSettingItemByProperty(this.setting,"describe",  this.settingData.describe);
      
    },
    ChangeValue(i, e) {
      console.log(i + " " + this.setting[i].value);

      this.setting[i].value = e;
      let property = this.setting[i].property; 
      this.settingData[property] = e;
      this.Update();
    }, 
    
    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    ClickUVAnim(item) { 
      Utils.SetSettingItemByProperty(this.setting,"imgPath",item);
      this.settingData.imgPath = item;
      this.inSelect = false;
      this.Update();
    },
    Update() {

      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = this.getMessage();
        this.$parent.updateModelTxtData();
      }else {
        // 在场景编辑中的修改
        _Global.YJ3D._YJSceneManager.UpdateTransform(
          this.getMessage()
        );
      }

    },
    SelectFile(item) {
      console.log(" ", item);
      if (item.title == '选择图片') {
        this.inSelect = true;
        this.RequestGetAllUVAnim();
      }
    },
    async RequestGetAllUVAnim() {
      this.imgList.splice(0, this.imgList.length);
      GetAllUVAnim().then((res) => {
        console.log(res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;
          for (let i = 0; i < txtDataList.length; i++) {
            const element = txtDataList[i];
            this.imgList.push((element));
          }
        }
      });
    },

  },
};
</script>

<style scoped></style>
