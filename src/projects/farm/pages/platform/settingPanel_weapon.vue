
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
    <div class=" text-left ">武器设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80 h-auto mb-2     ">
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

        <div v-if="item.type == 'drop'" class=" w-20 h-16 text-black ">
          <YJinput_drop class=" w-32 h-16 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'vector3'" class=" w-auto h-6 text-black ">
          <YJinput_vector3 class=" w-auto h-6 " :value="item.value" :step="item.step" :index="i"
            :callback="item.callback" />
        </div>

      </div>
      <div class=" self-center ml-2 w-4  truncate">
        {{ item.unit }}
      </div>

    </div>
    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{ loadContent }}</div>
    </div>

    <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>

    <!-- <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="pickDown()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">放下</div>
    </div> -->

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
import YJinput_drop from "./components/YJinput_drop.vue";
import YJinput_vector3 from "./components/YJinput_vector3.vue";

import { GetAllUVAnim } from "../../js/uploadThreejs.js";

export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_range,
    YJinput_number,
    YJinput_color,
    YJinput_toggle,
    YJinput_text,
    YJinput_drop,
    YJinput_vector3,
  },
  data() {
    return {
      chassisWidth: 2.2, //车身宽

      weaponData: {
        id: "",
        name: "weapon001",
        // 1.81 0.65 3.6

        // position: { x: 0, y: -0.61, z: -0.3 },
        // rotation: { x: 1.81, y: 0.65, z: 3.6 },
        position: [0, 0, 0],
        rotation: [0,0, 0],
        animName: "",
        boneName: "",
      },

      setting: [

        { property: "boneName", title: "跟随骨骼", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        { property: "animName", title: "交互动作", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        { property: "position", title: "偏移", type: "vector3", value: [0, 0, 0], step: 0.01, callback: this.ChangeValue },
        { property: "rotation", title: "旋转", type: "vector3", value: [0, 0, 0], step: 0.01, callback: this.ChangeValue },

      ],

      bones: [

        { boneName: "None", part: "none" },
        { boneName: "Head", part: "头部" },
        { boneName: "LeftShoulder", part: "左肩" },
        { boneName: "RightShoulder", part: "右肩" },
        { boneName: "LeftHand", part: "左手腕" },
        { boneName: "RightHand", part: "右手腕" },

      ],

      animList: [{ value: 'none', label: 'none' }],


      loadContent: "编辑位置",
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

    this.weaponData = modelData.message.data;

    this.initValue();


  },
  methods: {

    SetAnimList(_animList) {
      for (let i = 0; i < _animList.length; i++) {
        const element = _animList[i];
        this.animList.push({ value: element, label: element });
      }
      this.setting[1].options = this.animList;
      console.log(this.setting[1].options);


      let boneList = [];
      for (let i = 0; i < this.bones.length; i++) {
        const element = this.bones[i];
        boneList.push({ value: element.boneName, label: element.part });
      }
      this.setting[0].options = boneList;

    },
    initValue() {

      this.setting[0].value = this.weaponData.boneName;
      this.setting[1].value = this.weaponData.animName;
      this.setting[2].value = this.weaponData.position;
      this.setting[3].value = this.weaponData.rotation;

      // setTimeout(() => {
      //   console.log( this.weaponData);
      //   _Global.SendMsgTo3D("切换角色动作", this.weaponData.animName);
      //   _Global.SendMsgTo3D("单品放置在骨骼上", this.weaponData.boneName);
      //   setTimeout(() => {
      //     _Global.SendMsgTo3D("单品在骨骼上位移", this.weaponData.position);
      //     _Global.SendMsgTo3D("单品在骨骼上旋转", this.weaponData.rotation);
      //   }, 20);
      // }, 3000);

    },
    load() {

      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];

        if (element.property == "boneName") {
          let e = element.value;
          _Global.SendMsgTo3D("单品放置在骨骼上", e);
          setTimeout(() => {
            _Global.SendMsgTo3D("单品在骨骼上位移", this.weaponData.position);
            _Global.SendMsgTo3D("单品在骨骼上旋转", this.weaponData.rotation);
          }, 20);

          setTimeout(() => {
            // 把武器放到控制器，可控制移动和旋转
            _Global.SendMsgTo3D("编辑武器位置");
          }, 50);

          return;
        }
      }
    },
    Init(_carData) {
      this.carData = _carData;
    },
    ChangeValue(i, e) {

      // return;

      this.setting[i].value = e;


      this.weaponData[this.setting[i].property] = e;


      console.log(i + " " + this.setting[i].value);
      // console.log(i + " " + this.setting[i].value + " " + e);
      if (this.setting[i].property == "animName") {
        _Global.SendMsgTo3D("切换角色动作", e);
        return;
      }
      if (this.setting[i].property == "boneName") {
        _Global.SendMsgTo3D("单品放置在骨骼上", e);
        setTimeout(() => {
          _Global.SendMsgTo3D("单品在骨骼上位移", this.weaponData.position);
          _Global.SendMsgTo3D("单品在骨骼上旋转", this.weaponData.rotation);
        }, 20);
        return;
      }
      if (this.setting[i].property == "position") {
        _Global.SendMsgTo3D("单品在骨骼上位移", e);
        return;
      }
      if (this.setting[i].property == "rotation") {
        _Global.SendMsgTo3D("单品在骨骼上旋转", e);
        return;
      }
      // this.Update();
    },
    save() {
      //获取武器坐标、刷新界面数值、保存
      _Global.SendMsgTo3D("获取单品坐标旋转", (posRota) => {
        let pos = [posRota.pos.x, posRota.pos.y, posRota.pos.z];
        let rota = [posRota.rota.x, posRota.rota.y, posRota.rota.z];

        this.setting[2].value = pos;
        this.weaponData[this.setting[2].property] = pos;

        this.setting[3].value = rota;
        this.weaponData[this.setting[3].property] = rota;

        if (this.$parent.updateModelTxtData) {
          this.$parent.modelData.message = {
            pointType: "weapon",
            data: this.weaponData
          };
          this.$parent.updateModelTxtData();
        }
        //取消编辑
        _Global.SendMsgTo3D("取消编辑");

      })
    },
    pickDown() {
      _Global.SendMsgTo3D("放下武器");
    },
    Update() {


      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: "weapon",
          data: this.weaponData
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
