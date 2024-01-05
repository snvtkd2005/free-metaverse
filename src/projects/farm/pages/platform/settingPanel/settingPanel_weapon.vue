
// UV动画设置
<template>
  <!-- 场景设置面板 -->
  <div class="
              w-full 
               p-2
             text-white 
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">武器设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-full h-auto mb-2     ">
      <div class=" self-center w-32  truncate">
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


        <div v-if="item.type == 'int'" class="flex gap-2 text-black">
          <YJinput_number :value="item.value" :type="item.type" :step="item.step" :index="i" :callback="item.callback" />
        </div>
        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
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

        <div v-if="item.type == 'drop'" class=" w-20 h-12 text-black ">
          <YJinput_drop class=" w-32 h-full " :value="item.value" :options="item.options" :index="i"
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

    <!-- 动作播放进度滑块 -->
    <div class=" flex w-full   ">
      <div class=" bg-gray-400 cursor-pointer" @click=" auto = !auto">{{ auto ? '暂停' : '播放' }}</div>
      <div class=" w-16 ml-2 ">{{ animClip.currentTime + '/' + animClip.duration }}</div>
      <input ref="viewFarCtrl" class=" ml-2  outline-none w-40  " @input="sliderChangeFn" v-model="animClip.currentTime"
        type="range" min="0" :max="animClip.duration" step="1">
    </div>

    <div class=" mt-10 w-full h-10 text-white cursor-pointer " @click="ClickHandler('编辑位置')">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">编辑位置</div>
    </div>

    <div class=" mt-2 w-full h-10 text-white cursor-pointer " @click="ClickHandler('保存')">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>
    <div class=" mt-2 w-full h-10 text-white cursor-pointer " @click="ClickHandler('保存偏移旋转')">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存偏移旋转</div>
    </div>


    <!-- <div  class=" flex gap-2 text-black ">
      <YJinput_number :value="carData.param.chassisHeight" />
    </div> -->

  </div>
</template>

<script>

import YJinput_color from "../components/YJinput_color.vue";
import YJinput_range from "../components/YJinput_range.vue";
import YJinput_number from "../components/YJinput_number.vue";
import YJinput_text from "../components/YJinput_text.vue";
import YJinput_toggle from "../components/YJinput_toggle.vue";
import YJinput_drop from "../components/YJinput_drop.vue";
import YJinput_vector3 from "../components/YJinput_vector3.vue";

import { GetAllUVAnim } from "../../../js/uploadThreejs.js";

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
        weaponId: "",
        name: "weapon001",
        //武器类型
        weaponType: "",
        //手持类型
        pickType: "",
        // 1.81 0.65 3.6
        // position: { x: 0, y: -0.61, z: -0.3 },
        // rotation: { x: 1.81, y: 0.65, z: 3.6 },
        position: [0, 0, 0],
        rotation: [0, 0, 0],

        // 待机
        animNameIdle: "idle",
        // 行走
        animNameWalk: "walk",
        // 奔跑
        animNameRun: "run",
        //准备攻击
        animNameReady: "fight idle",
        //攻击
        animNameAttack: "fight attack",
        // 依附的骨骼名称
        boneName: "",
        // 攻击速度
        attackSpeed: 1,
        // 有效距离
        vaildDis: 1,
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
        { property: "vaildDis", display: true, title: "有效距离", type: "int", step: 1, value: 1, callback: this.ChangeValue, },
        { property: "attackSpeed", display: true, title: "攻击速度", type: "num", step: 1, value: 1, callback: this.ChangeValue, },
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

        { property: "animNameIdle", title: "待机", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        { property: "animNameWalk", title: "行走", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        { property: "animNameRun", title: "奔跑", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        { property: "animNameReady", title: "准备攻击", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        { property: "animNameAttack", title: "攻击", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        // { property: "animName", title: "交互动作", type: "drop", value: "none", options: [], callback: this.ChangeValue },
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

      animClip: {
        currentTime: 0,
        duration: 100,
      },
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


    if (!this.settingData.pickType) {
      this.settingData.pickType = "";
    }

    if (!this.settingData.weaponType) {
      this.settingData.weaponType = "";
    }
    this.settingData.weaponId = modelData.folderBase;
    this.initValue();


  },
  methods: {
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

    SetAnimList(_animList) {

      this.animList = _animList;
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameIdle", "options", this.animList);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameWalk", "options", this.animList);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameRun", "options", this.animList);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameReady", "options", this.animList);
      this.Utils.SetSettingItemPropertyValueByProperty(this.setting, "animNameAttack", "options", this.animList);
      // this.setting[3].options = this.animList;
      // console.log(this.setting[3].options);

    },

    animate() {
      requestAnimationFrame(this.animate);
      if (_Global.YJ3D.YJPlayer) {

        let { time, duration } = _Global.YJ3D.YJPlayer.GetAvatar().GetCurrentTime();
        time = parseInt(time * 24);
        duration = parseInt(duration * 24);
        this.animClip.duration = duration;

        if (this.auto) {
          this.animClip.currentTime = time;
        } else {
          _Global.YJ3D.YJPlayer.GetAvatar().SetCurrentTime(this.animClip.currentTime / 24);
        }
        // console.log(" 动画 "+time + " / " + duration);
      }
    },
    initValue() {
      this.settingData.animNameIdle = this.settingData.animNameIdle ? this.settingData.animNameIdle : "idle";
      this.settingData.animNameWalk = this.settingData.animNameWalk ? this.settingData.animNameWalk : "walk";
      this.settingData.animNameRun = this.settingData.animNameRun ? this.settingData.animNameRun : "run";
      this.settingData.animNameReady = this.settingData.animNameReady ? this.settingData.animNameReady : "fight idle";
      this.settingData.animNameAttack = this.settingData.animNameAttack ? this.settingData.animNameAttack : "fight attack";
      this.settingData.attackSpeed = this.settingData.attackSpeed ? this.settingData.attackSpeed : 1;
      this.settingData.vaildDis = this.settingData.vaildDis ? this.settingData.vaildDis : 1;
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);

      // this.Utils.SetSettingItemByProperty(this.setting, "boneName", this.settingData.boneName);
      // this.Utils.SetSettingItemByProperty(this.setting, "pickType", this.settingData.pickType);
      // this.Utils.SetSettingItemByProperty(this.setting, "weaponType", this.settingData.weaponType); 
      this.Utils.SetSettingItemByProperty(this.setting, "position", this.settingData.position);
      this.Utils.SetSettingItemByProperty(this.setting, "rotation", this.settingData.rotation);


      this.animate();
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
    ClickHandler(e, item, i) {
      if (e == "编辑位置") {
        this.load();
      }
      if (e == "保存") {
        this.save();
      }
      if (e == "保存偏移旋转") {
        this.saveTrans();
      }
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
      console.log("选中物体", this.settingData);
      this.initValue();

    },
    ChangeValue(i, e) {

      // return;

      this.setting[i].value = e;


      this.settingData[this.setting[i].property] = e;


      console.log(i + " " + this.setting[i].value);
      // console.log(i + " " + this.setting[i].value + " " + e);
      if (this.setting[i].property.includes("animName")) {
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

        this.Utils.SetSettingItemByProperty(this.setting, "position", this.settingData.position);
        this.Utils.SetSettingItemByProperty(this.setting, "rotation", this.settingData.rotation);

        this.saveFn();
        //取消编辑
        _Global.SendMsgTo3D("取消编辑");
      })
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
