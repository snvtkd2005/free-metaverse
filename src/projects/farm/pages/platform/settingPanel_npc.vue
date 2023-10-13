
<template>
  <div class="
              w-80
              max-w-md
               p-2
             text-white
             rounded-lg
             overflow-hidden 
            ">
    <div class=" text-left ">npc 设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80 h-auto mb-2     ">

      <div class=" self-center w-40  truncate" v-show="item.display">
        {{ item.title }}
      </div>
      <div class=" self-center w-20 ">

        <div v-if="item.type == 'text'" class=" w-32 h-auto text-black ">
          <YJinput_text class=" w-full h-auto " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
        </div>

      </div>

    </div>


    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{ loadContent }}</div>
    </div>

    <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
    </div>

  </div>
</template>

<script>

import YJinput_text from "./components/YJinput_text.vue";
import YJinput_number from "./components/YJinput_number.vue";


export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_text,
    YJinput_number,

  },
  data() {
    return {
      pointType: "npc",
      settingData: {
        name: "",
        defaultAnim:"",//默认动作
        avatarData: {},
      },

      avatar: null,
      selectCurrentIndex: 0,
      setting: [
        { property: "avatarPath", display: true, title: "角色模型地址", type: "text", value: "", callback: this.ChangeValue },
      ],

      loadContent: "加载角色模型",
    };
  },
  created() {

  },
  mounted() {


    let modelData = JSON.parse(localStorage.getItem("modelData"));
    if (modelData == null) {
      return;
    }
    if (modelData.message == undefined) {
      this.settingData.id = this.$parent.folderBase + "";
      return;
    }

    console.log(" modelData = ", modelData);
    this.settingData = modelData.message.data;
    this.settingData.name = modelData.name;
    this.initValue();


  },
  methods: {

    setSettingItemByProperty(property, value) {
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == property) {
          element.value = value;
        }
      }
    },
    initValue() {

      this.setSettingItemByProperty("height", this.settingData.height);

    },
    load(item) { 
      console.log(item);
      this.settingData.avatarData = item.message.data;
      this.save();
 
      //加载模型
      this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.CreateSingleModel(
        data.modelPath,
        () => {
          console.log("加载模型完成 33 ");
          this.$parent.SetTip("加载模型完成");
          setTimeout(() => {
            this.$parent.tipData.opening = false;
          }, 1000);
          this.avatar = this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetSingleModelTransform().
          GetComponent("Animator");
          this.ChangeAnim(0);

        }, (e) => {
          this.$parent.SetTip("出错了。加载模型出错，" + e);
        }
      );
    },
    updateName(v) {
      this.settingData.name = v;
      this.$parent.modelData.message = {
        pointType: this.pointType,
        data: this.settingData
      };

      // 控制三维
      this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetSingleModelTransform().
        GetComponent("Avatar").SetMessage(this.settingData);
    },
    Init(_settingData) {
      this.settingData = _settingData;
      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == "url") {
          element.value = this.settingData.url;
        }
      }
      console.log(" screen setting data ", _settingData);
    },
    ChangeValue(i, e) {

      this.setting[i].value = e;
      this.settingData[this.setting[i].property] = e;
 
      console.log(i + " " + this.setting[i].value);
    },
    save() {

      // 单品中才有 updateModelTxtData
      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: this.pointType,
          data: this.settingData
        };
        this.$parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    // 设置角色眼睛高度
    SetEyeHeight() {
      this.$parent.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetTargetHeight(height);
    },
 
    ChangeAnim(i) { 
      this.avatar.ChangeAnimByIndex(i);
    },  
    Update() {

      // _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);

      this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.UpdateTransform(
        {
          pointType: this.pointType,
          data: this.settingData
        }
      );
      // 调用场景保存
      if (this.$parent.updateSceneModelData) {
        this.$parent.updateSceneModelData();
      }


    },

  },
};
</script>

<style scoped></style>
