 
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

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-full h-auto pb-2 pr-2   ">
      <div class=" self-center w-1/3">
        {{ item.title }}
      </div>
      <div class=" self-center w-2/3 ">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :index="i" :value="item.value" :callback="item.callback" />
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

        <div v-if="item.type == 'int'" class=" flex gap-2 text-black "> 
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'num'" class=" flex gap-2 text-black "> 
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
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
  name: "settingPanel_trail",
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
      },
      setting: [ 
        {property: "imgPath", title: "选择图片", type: "file", value: null },
        {property: "color", title: "主色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        {property: "color2", title: "混合色", type: "color", value: "#ffffff", callback: this.ChangeValue },
        {property: "width", title: "宽度", type: "num", value: 1,step: 0.01, callback: this.ChangeValue },
        {property: "maxLength", title: "最大数量", type: "int", value: 1,step: 1, callback: this.ChangeValue },
        {property: "lifeTime", title: "持续时间", type: "num", value: 1, min: 0.02, max: 5, step: 0.01, callback: this.ChangeValue },
        // {property: "scaleUVy", title: "uv缩放", type: "num", value: 1, min: 0.02, max: 5, step: 0.01, callback: this.ChangeValue },
        // {property: "offsetUVy", title: "uv偏移", type: "num", value: 1, min: 0.02, max: 5, step: 0.01, callback: this.ChangeValue },
        {property: "isBlack", title: "是否黑底", type: "toggle", value: false, callback: this.ChangeValue },
      ],


      imgList: [], //用户上传图片
      inSelect: false,
    };
  },
  created() {

    this.parent = this.$parent.$parent;
  },
  mounted() {

    this.RequestGetAllUVAnim();

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
    ClickUVAnim(item) { 
      Utils.SetSettingItemByProperty(this.setting,"imgPath",item);
      this.settingData.imgPath = item;
      this.inSelect = false;
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
