 
<template>
  <div class="w-full p-2 text-white rounded-lg overflow-hidden relative">
    <div class="text-left">装备设置</div>
    <div class="w-full">
      <YJinputCtrl :setting="setting" />
    </div>

    <!-- 动作播放进度滑块 -->
    <div class="flex w-full mt-4">
      <div class="bg-gray-400 cursor-pointer" @click="auto = !auto">
        {{ auto ? "暂停" : "播放" }}
      </div>
      <div class="w-16 ml-2">
        {{ animClip.currentTime + "/" + animClip.duration }}
      </div>
      <input
        ref="viewFarCtrl"
        class="ml-2 outline-none w-40"
        @input="sliderChangeFn"
        v-model="animClip.currentTime"
        type="range"
        min="0"
        :max="animClip.duration"
        step="1"
      />
    </div>

    <!-- <div class=" mt-2 w-full h-10 text-white ">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1  cursor-pointer" @click="ClickHandler('编辑位置')">编辑位置</div>
    </div> -->

    <div class="mt-2 w-full h-10 text-white">
      <div
        class="mt-2 bg-445760 rounded-md inline-block px-14 py-1 cursor-pointer"
        @click="ClickHandler('保存')"
      >
        保存
      </div>
    </div>
    <!-- <div class=" mt-2 w-full h-10 text-white ">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 cursor-pointer " @click="ClickHandler('保存偏移旋转')">
        保存偏移旋转</div>
    </div> -->

    <div
      v-if="isLock"
      class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-30"
    ></div>
  </div>
</template>

<script>
import YJinputCtrl from "../components/YJinputCtrl.vue";

export default {
  name: "settingpanel_equip",
  components: {
    YJinputCtrl,
  },
  data() {
    return {
      pointType: "equip",
      isLock: false,
      settingData: {
        equipId: "",
        name: "equip001",
        //身体部位
        partType: "",  
        // position: [0, 0, 0],
        // rotation: [0, 0, 0],
        // 依附的骨骼名称
        boneName: "", 
      },

      setting: [
        {
          property: "partType",
          display: true,
          title: "身体部位",
          type: "drop",
          value: "head",
          options: [
            { value: "head", label: "头部" },
            { value: "leftshoulder", label: "左肩" },
            { value: "rightshoulder", label: "右肩" },
          ],
          callback: this.ChangeValue,
        },  
        // { property: "animName", title: "交互动作", type: "drop", value: "none", options: [], callback: this.ChangeValue },
        // { property: "position", display: true, title: "拾取后偏移", type: "vector3", value: [0, 0, 0], step: 0.01, callback: this.ChangeValue },
        // { property: "rotation", display: true, title: "拾取后旋转", type: "vector3", value: [0, 0, 0], step: 0.01, callback: this.ChangeValue },
      ],
 
      // character/human/female/humanfemale_hd_bone_89 左手腕
      // character/human/female/humanfemale_hd_bone_49 右手腕

      animList: [{ value: "none", label: "none" }],

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
    
    let modelData = JSON.parse(localStorage.getItem("modelData"));

    if (modelData.message == undefined) {
      return;
    }

    this.settingData = modelData.message.data;
 
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
    addThreeJSfocus() {},

    SetAnimList(_animList) {
      console.log("设置动作drop list ", _animList);
       
    },
 
    initValue() {
      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
    },
    GetAnimList(avatarId) { 
    },
    ClickHandler(e, item, i) {
       
      if (e == "保存") {
        this.save();
      } 
    }, 
    Init(_data) {
      this.settingData = _data;
       
      console.log("选中物体", this.settingData);
      this.initValue();
    },
    ChangeValue(i, e) {
      // return;

      this.setting[i].value = e;

      this.settingData[this.setting[i].property] = e;

      console.log(i + " " + this.setting[i].value);
       
      // this.Update();
    },

    ClickUVAnim(i, e) {
      this.Utils.SetSettingItemByProperty(
        this.setting,
        this.setting[i].property,
        e
      );
      console.log(" 选择  ", i, e, this.setting[i].property);
      let sp = this.setting[i].property.split("-");
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
    save() {
      this.saveFn();
    },
    saveTrans() {
       
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
      _Global.YJ3D._YJSceneManager.UpdateTransform(this.getMessage());
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
