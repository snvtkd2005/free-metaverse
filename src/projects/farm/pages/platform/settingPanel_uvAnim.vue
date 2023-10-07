
// UV动画设置
<template>
  <!-- 场景设置面板 -->
  <div class="
              w-80
              max-w-md
             p-2
             text-white 
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">UV动画设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80 h-8    ">
      <div class=" self-center w-1/3">
        {{ item.title }}
      </div>
      <div class=" self-center w-2/3 pr-10">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'file'" class="  relative flex  gap-2 cursor-pointer  " @click="SelectFile(item, i)">
          <div>{{ item.url }}</div>
          <div class=" absolute right-0 w-auto h-6 rounded-sm bg-gray-50 flex">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>


        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <!-- <input id="body-num" type="number" :value="item.value"> -->
          <YJinput_number :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'slider'" class=" flex gap-2 ">
          <!-- <input id="body-slider" type="range" :value="item.value" :step="item.step" :min="item.min" :max="item.max"> -->
          <YJinput_range :value="item.value" :step="item.step" :min="item.min" :max="item.max"
            :callback="item.callback" />
          <div>{{ item.value }}</div>
        </div>

        <div v-if="item.type == 'toggle'" class=" w-4 h-4 ">
          <YJinput_toggle class=" w-4 h-4 " :value="item.value" :callback="item.callback" />
        </div>
      </div>
    </div>


    <div v-if="inSelect">
      <div v-for="(item, i) in uvAnimList" :key="i" class="
                  self-center w-40 h-auto relative
                ">
        <div class=" w-40 h-20 self-center mx-auto 
                  cursor-pointer " @click="ClickUVAnim(item)">
          <img class=" w-full h-full    object-fill hover:opacity-70 " :src="$uploadUVAnimUrl + item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import YJinput_color from "./components/YJinput_color.vue";
import YJinput_range from "./components/YJinput_range.vue";
import YJinput_number from "./components/YJinput_number.vue";
import YJinput_toggle from "./components/YJinput_toggle.vue";
import { GetAllUVAnim } from "../../js/uploadThreejs.js";

export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_range,
    YJinput_number,
    YJinput_color,
    YJinput_toggle,
  },
  data() {
    return {
      setting: [

        {property: "gifPath", title: "选择UV图", type: "file", url: null },
        {property: "color", title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeColor },
        {property: "row", title: "UV X", type: "num", value: 14, callback: this.ChangeX },
        {property: "col", title: "UV Y", type: "num", value: 1, callback: this.ChangeY },
        {property: "speed", title: "播放速度", type: "slider", value: 1, min: 0.5, max: 5, step: 0.5, callback: this.SliderSpeed },
        {property: "isBlack", title: "是否黑底", type: "toggle", value: false, callback: this.ChangeToggleBlack },

      ],

      uvAnimList: [],
      inSelect: false,
      uvAnimData: {
        gifPath: '',
        color: "#ffffff",
        row: 14,
        col: 1,
        speed: 1,
        delay: 100,
        isBlack: false,
      },
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
    Init(data) {
      this.uvAnimData = data;
      this.setting[0].url =   this.uvAnimData.gifPath;
      this.setting[1].value = this.uvAnimData.color;
      this.setting[2].value = this.uvAnimData.row;
      this.setting[3].value = this.uvAnimData.col;
      this.setting[4].value = this.uvAnimData.speed;
      this.setting[5].value = this.uvAnimData.isBlack;
    },
    ChangeToggleBlack(e) {
      this.setting[5].value = e;
      this.Update();

    },
    ChangeColor(e) {
      this.setting[1].value = e;
      this.Update();

    },
    SliderSpeed(e) {
      console.log(" 滑动滑块 ", e);
      this.setting[4].value = e;
      this.Update();
    },
    ChangeX(e) {

      this.setting[2].value = e;
      this.Update();
    },
    ChangeY(e) {
      this.setting[3].value = e;
      this.Update();

    },
    ClickUVAnim(item) {
      this.setting[0].url = item;
      this.inSelect = false;
      this.Update();
    },
    Update() {

      this.uvAnimData =
      {
        gifPath: this.setting[0].url,
        color: this.setting[1].value,
        row: this.setting[2].value,
        col: this.setting[3].value,
        speed: this.setting[4].value,
        delay: 100,
        isBlack: this.setting[5].value,
      };

      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: "UV动画",
          data: this.uvAnimData
        };
        this.$parent.updateModelTxtData();
      }


      //给模型指定贴图
      _Global.AddUVAnimToTransform(this.uvAnimData);


    },
    SelectFile(item) {
      console.log(" ", item);
      if (item.title == '选择UV图') {
        this.inSelect = true;
        this.RequestGetAllUVAnim();
      }
    },
    async RequestGetAllUVAnim() {
      this.uvAnimList.splice(0, this.uvAnimList.length);
      GetAllUVAnim().then((res) => {
        console.log(res);
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
