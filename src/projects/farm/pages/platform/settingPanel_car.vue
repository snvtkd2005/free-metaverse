
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
    <div class=" text-left ">汽车设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80 h-8    ">
      <div class=" self-center w-40  truncate">
        {{ item.title }}
      </div>
      <div class=" self-center w-20 ">
        <div v-if="item.type == 'color'" class=" flex gap-2 ">
          <YJinput_color :value="item.value" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'file'" class=" relative flex  gap-2 cursor-pointer  " @click="SelectFile(item, i)">
          <div>{{ item.url }}</div>
          <div class=" absolute right-0 w-auto h-6 rounded-sm bg-gray-50 flex">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>


        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <!-- <input id="body-num" type="number" :value="item.value"> -->
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
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

        <div v-if="item.type == 'text'" class=" w-20 h-4 text-black ">
          <YJinput_text class=" w-20 h-4 " :value="item.value" :index="i" :callback="item.callback" />
        </div>

      </div>
      <div class=" self-center ml-2 w-4  truncate">
        {{ item.unit }}
      </div>

    </div>
    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{loadContent}}</div>
    </div>

    <!-- <div  class=" flex gap-2 text-black ">
      <YJinput_number :value="carData.param.chassisHeight" />
    </div> -->

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
import YJinput_text from "./components/YJinput_text.vue";
import YJinput_toggle from "./components/YJinput_toggle.vue";
import { GetAllUVAnim } from "../../js/uploadThreejs.js";

export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_range,
    YJinput_number,
    YJinput_color,
    YJinput_toggle,
    YJinput_text,
  },
  data() {
    return {
      chassisWidth: 2.2, //车身宽

      carData: {
        id: "",
        param: {
          chassisWidth: 2.2, //车身宽
          chassisHeight: 1.24,//车身高
          chassisLength: 4.5, //车身长

          massVehicle: 1800, //质量
          maxEngineForce: 2000, //引擎最大马力

          wheelWidthFront: 0.3,// 前轮宽度
          wheelRadiusFront: 0.5, // 前轮半径
          wheelAxisFrontPosition: 1.1,// 前轮距中心偏移
          wheelHalfTrackFront: 0.9,//两个前轮之间的距离

          wheelWidthBack: 0.3,// 后轮宽度
          wheelRadiusBack: 0.5, // 后轮半径
          wheelAxisPositionBack: -1.42,//后轮距中心偏移
          wheelHalfTrackBack: 0.9,//两个后轮之间的距离

          suspensionRestLength: 0.8, //轮胎悬架长度
          maxBreakingForce: 1000, //回退或停止马力
        },
        name: "car001",
        // bodyOffset: { x: 0, y: 0.0, z: 0 },
        bodyOffset: { x: 0, y: -0.61, z: -0.3 },
        icon: "",
        carBodyPath: "",
        wheelPath: "",
      },

      setting: [

        // { title: "选择UV图", type: "file", url: null },
        { property: "", title: "叠加色", type: "color", value: "#ffffff", callback: this.ChangeColor },
        { property: "chassisWidth", title: "车身宽", type: "num", value: 1, step: 0.1, unit: "m", callback: this.ChangeValue },
        { property: "chassisHeight", title: "车身高", type: "num", value: 1, step: 0.1, unit: "m", callback: this.ChangeValue },
        { property: "chassisLength", title: "车身长", type: "num", value: 1, step: 0.1, unit: "m", callback: this.ChangeValue },

        { property: "massVehicle", title: "重量", type: "num", value: 1, unit: "kg", callback: this.ChangeValue },
        { property: "maxEngineForce", title: "引擎最大马力", type: "num", value: 1, unit: "p", callback: this.ChangeValue },

        { property: "wheelWidthFront", title: "前轮宽度", type: "num", value: 1, step: 0.02, unit: "m", callback: this.ChangeValue },
        { property: "wheelRadiusFront", title: "前轮半径", type: "num", value: 1, step: 0.02, unit: "m", callback: this.ChangeValue },
        { property: "wheelAxisFrontPosition", title: "前轮距中心偏移", type: "num", value: 1, step: 0.02, unit: "m", callback: this.ChangeValue },
        { property: "wheelHalfTrackFront", title: "两个前轮之间的距离", type: "num", value: 1, step:0.02, unit: "m", callback: this.ChangeValue },

        { property: "wheelWidthBack", title: "后轮宽度", type: "num", value: 1,  step:0.02, unit: "m", callback: this.ChangeValue },
        { property: "wheelRadiusBack", title: "后轮半径", type: "num", value: 1, step:0.02, unit: "m", callback: this.ChangeValue },
        { property: "wheelAxisPositionBack", title: "后轮距中心偏移", type: "num", value: 1, step: 0.02, unit: "m", callback: this.ChangeValue },
        { property: "wheelHalfTrackBack", title: "两个后轮之间的距离", type: "num", value: 1, step:0.02, unit: "m", callback: this.ChangeValue },

        { property: "suspensionRestLength", title: "轮胎悬架长度", type: "num", value: 1, step: 0.02, unit: "m", callback: this.ChangeValue },
        { property: "maxBreakingForce", title: "回退或停止马力", type: "num", value: 1, unit: "p", callback: this.ChangeValue },

        { property: "carBodyPath", title: "车身模型id", type: "text", value: "", unit: "", callback: this.ChangeValue },
        { property: "wheelPath", title: "轮胎模型id", type: "text", value: "", unit: "", callback: this.ChangeValue },

      ],
      loadContent:"加载",

      inSelect: false,
    };
  },
  created() {

    this.initValue();

  },
  mounted() {

    // this.RequestGetAllUVAnim();

    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
    let modelData = JSON.parse(localStorage.getItem("modelData"));

    if (modelData.message == undefined) {
      return;
    }

    this.carData = modelData.message.data;
    this.initValue();


  },
  methods: {
    
    removeThreeJSfocus() {
      this.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() { 
    },
    initValue() {
      this.setting[1].value = this.carData.param.chassisWidth;
      this.setting[2].value = this.carData.param.chassisHeight;
      this.setting[3].value = this.carData.param.chassisLength;

      this.setting[4].value = this.carData.param.massVehicle;
      this.setting[5].value = this.carData.param.maxEngineForce;

      this.setting[6].value = this.carData.param.wheelWidthFront;
      this.setting[7].value = this.carData.param.wheelRadiusFront;
      this.setting[8].value = this.carData.param.wheelAxisFrontPosition;
      this.setting[9].value = this.carData.param.wheelHalfTrackFront;

      this.setting[10].value = this.carData.param.wheelWidthBack;
      this.setting[11].value = this.carData.param.wheelRadiusBack;
      this.setting[12].value = this.carData.param.wheelAxisPositionBack;
      this.setting[13].value = this.carData.param.wheelHalfTrackBack;

      this.setting[14].value = this.carData.param.suspensionRestLength;
      this.setting[15].value = this.carData.param.maxBreakingForce;

      this.setting[16].value = this.carData.carBodyPath;
      this.setting[17].value = this.carData.wheelPath;
    },
    load() {
      console.log(" 加载汽车 ");
      // if(this.setting[16].value == ""){
      //   // 1691746524967
      //   return;
      // }
      // if(this.setting[17].value == ""){
      //   // 1691746585666
      //   return;
      // }
      // this.setting[16].value = 1691746524967;
      // this.setting[17].value = 1691746585666;
      // this.setting[16].value = 1691833061982;
      // this.setting[17].value = 1691833112954;
      //加载模型地址

      this.$parent.GetModelPathByFolderBase( this.setting[17].value, (modelPath) => {
        // this.setting[17].value = modelPath;
        this.carData.wheelPath = modelPath;
        this.$parent.GetModelPathByFolderBase(this.setting[16].value, (modelPath) => {
          // this.setting[16].value = modelPath;
          this.carData.carBodyPath = modelPath;
          this.Update();

        });
      });


    },
    Init(_carData) {
      this.carData = _carData;
    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      if (i >= 16) {
        return;
      }
      this.carData.param[this.setting[i].property] = e;
      console.log(i + " " + this.setting[i].value + " " + e);
      this.Update();
    },
    Update() {


      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: "car",
          data: this.carData
        };
        this.$parent.updateModelTxtData();
      }

      //给模型指定贴图
      _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);


    },
    SelectFile(item) {
      console.log(" ", item);
      if (item.title == '选择UV图') {
        this.inSelect = true;
        this.RequestGetAllUVAnim();
      }
    },
    async RequestGetAllUVAnim() {

    },

  },
};
</script>

<style scoped></style>
