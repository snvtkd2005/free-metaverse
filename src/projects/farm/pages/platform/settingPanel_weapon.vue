
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
    <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="saveTrans()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存偏移旋转</div>
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
      pointType: "weapon",

      settingData: {
        id: "",
        name: "weapon001",

        weaponType: "",
        pickType: "",
        // 1.81 0.65 3.6

        // position: { x: 0, y: -0.61, z: -0.3 },
        // rotation: { x: 1.81, y: 0.65, z: 3.6 },
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        animName: "",
        boneName: "",
      },

      setting: [

        {
          property: "pickType", title: "手持类型", type: "drop", value: "twoHand", options: [

            { value: "twoHand", label: "双手" },
            { value: "mainHand", label: "主手" },
            { value: "oneHand", label: "单手" },
          ], callback: this.ChangeValue
        },
        {
          property: "weaponType", title: "装备类型", type: "drop", value: "sword", options: [

            { value: "gun", label: "枪" },
            { value: "sword", label: "剑" },
            { value: "axe", label: "斧" },
            { value: "arch", label: "弓" },
            { value: "crossbow", label: "弩" },
            { value: "dagger", label: "匕首" },
            { value: "staff", label: "法杖" },
            { value: "Wand", label: "魔棒" },
            // { value: "oneHand",label: "拳套" }, 
          ], callback: this.ChangeValue
        },
        {
          property: "boneName", title: "跟随骨骼", type: "drop", value: "none", options: [

            { value: "None", label: "none" },
            { value: "Head", label: "头部" },
            { value: "LeftShoulder", label: "左肩" },
            { value: "RightShoulder", label: "右肩" },
            { value: "LeftHand", label: "左手腕" },
            { value: "RightHand", label: "右手腕" },
          ], callback: this.ChangeValue
        },
        { property: "animName", title: "交互动作", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        { property: "position", title: "偏移", type: "vector3", value: [0, 0, 0], step: 0.01, callback: this.ChangeValue },
        { property: "rotation", title: "旋转", type: "vector3", value: [0, 0, 0], step: 0.01, callback: this.ChangeValue },

      ],

      bones: [
        { value: "None", label: "none" },
        { value: "Head", label: "头部" },
        { value: "LeftShoulder", label: "左肩" },
        { value: "RightShoulder", label: "右肩" },
        { value: "LeftHand", label: "左手腕" },
        { value: "RightHand", label: "右手腕" },
      ],
      // 持有类型
      pickType: [
        { value: "twoHand", label: "双手" },
        { value: "mainHand", label: "主手" },
        { value: "oneHand", label: "单手" },
      ],
      // 武器类型
      weaponType: [
        { value: "sword", label: "剑" },
        { value: "axe", label: "斧" },
        { value: "arch", label: "弓" },
        { value: "crossbow", label: "弩" },
        { value: "dagger", label: "匕首" },
        // { value: "oneHand",label: "拳套" }, 
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

    this.settingData = modelData.message.data;


    if (!this.settingData.pickType) {
      this.settingData.pickType = "";
    }

    if (!this.settingData.weaponType) {
        this.settingData.weaponType = "";
      }
    this.initValue();


  },
  methods: {

    removeThreeJSfocus() {
      this.$parent.removeThreeJSfocus();
    },
    addThreeJSfocus() {
    },

    setSettingItemByProperty(property, value) {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == property) {
          element.value = value;
        }
      }
    },
    getSettingItemByProperty(property) {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == property) {
          return element.value;
        }
      }
      return null;
    },

    SetAnimList(_animList) {
      for (let i = 0; i < _animList.length; i++) {
        const element = _animList[i];
        this.animList.push({ value: element, label: element });
      }
      this.setting[3].options = this.animList;
      console.log(this.setting[3].options);

    },
    initValue() {

      this.setSettingItemByProperty("boneName", this.settingData.boneName);
      this.setSettingItemByProperty("animName", this.settingData.animName);
      this.setSettingItemByProperty("position", this.settingData.position);
      this.setSettingItemByProperty("rotation", this.settingData.rotation);
      this.setSettingItemByProperty("pickType", this.settingData.pickType);
      this.setSettingItemByProperty("weaponType", this.settingData.weaponType);


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
    load() {

      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];

        if (element.property == "boneName") {
          let e = element.value;
          _Global.SendMsgTo3D("单品放置在骨骼上", e);
          setTimeout(() => {
            _Global.SendMsgTo3D("单品在骨骼上位移", this.settingData.position);
            _Global.SendMsgTo3D("单品在骨骼上旋转", this.settingData.rotation);
          }, 20);

          setTimeout(() => {
            // 把武器放到控制器，可控制移动和旋转
            _Global.SendMsgTo3D("编辑武器位置");
          }, 50);

          return;
        }
      }
    },
    Init(_data) {
      this.settingData = _data;
      if (!this.settingData.pickType) {
        this.settingData.pickType = "";
      }
      if (!this.settingData.weaponType) {
        this.settingData.weaponType = "";
      }
      console.log("选中物体",this.settingData);
      this.initValue();

    },
    ChangeValue(i, e) {

      // return;

      this.setting[i].value = e;


      this.settingData[this.setting[i].property] = e;


      console.log(i + " " + this.setting[i].value);
      // console.log(i + " " + this.setting[i].value + " " + e);
      if (this.setting[i].property == "animName") {
        _Global.SendMsgTo3D("切换角色动作", e);
        return;
      }
      if (this.setting[i].property == "boneName") {
        _Global.SendMsgTo3D("单品放置在骨骼上", e);
        setTimeout(() => {
          _Global.SendMsgTo3D("单品在骨骼上位移", this.settingData.position);
          _Global.SendMsgTo3D("单品在骨骼上旋转", this.settingData.rotation);
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

    getMessage() {
      return {
        pointType: this.pointType,
        data: this.settingData,
      };
    },
    save() { 
      this.saveFn();
    },
    saveTrans() {
      // 判断是否被拾取
      // 如果被拾取则同时保存坐标和旋转
      // 如果未被拾取则不保存坐标和旋转
      //获取武器坐标、刷新界面数值、保存
      _Global.SendMsgTo3D("获取单品坐标旋转", (posRota) => {
        let pos = [posRota.pos.x, posRota.pos.y, posRota.pos.z];
        let rota = [posRota.rota.x, posRota.rota.y, posRota.rota.z];

        this.settingData["position"] = pos;
        this.settingData["rotation"] = rota;

        this.setSettingItemByProperty("position", this.settingData.position);
        this.setSettingItemByProperty("rotation", this.settingData.rotation);

        this.saveFn();
        //取消编辑
        _Global.SendMsgTo3D("取消编辑");
      })
    },

    pickDown() {
      _Global.SendMsgTo3D("放下武器");
    },

    saveFn() {
      // 单品中才有 updateModelTxtData
      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = this.getMessage();
        this.$parent.updateModelTxtData();
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
      if (this.$parent.updateSceneModelData) {
        this.$parent.tableList[2].value = true;
        this.$parent.updateSceneModelData();
      }
      //给模型指定贴图
      // _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);


    },
    SelectFile(item) {
    },
    async RequestGetAllUVAnim() {

    },

  },
};
</script>

<style scoped></style>
