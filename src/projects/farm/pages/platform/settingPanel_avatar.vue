
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
    <div class=" text-left ">avatar设置</div>

    <div v-for="(item, i) in setting" :key="i" class=" text-xs  text-left flex w-80 h-auto mb-2     ">

      <div class=" self-center w-40  truncate" v-show="item.display">
        {{ item.title }}
      </div>
      <div class=" self-center w-20 ">
        <div v-if="item.type == 'file'" v-show="item.display" class=" relative flex  gap-2 cursor-pointer  "
          @click="SelectFile(item, i)">
          <div class=" absolute right-0 w-auto h-6 rounded-sm bg-gray-50 flex">
            <div class=" text-xs pl-1 self-center mx-auto w-10 h-4 leading-4  rounded-sm text-black">
              浏览...
            </div>
          </div>
        </div>

        <div v-if="item.type == 'upload'" v-show="item.display" class=" relative flex  gap-2 cursor-pointer  ">
          <YJinput_upload class=" w-32 h-16 " :accept="item.accept" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'text'" class=" w-32 h-auto text-black ">
          <YJinput_text class=" w-full h-auto " :value="item.value" :index="i" :callback="item.callback" />
        </div>

        <div v-if="item.type == 'drop'" class=" w-20 h-16 text-black ">
          <YJinput_drop class=" w-32 h-16 " :value="item.value" :options="item.options" :index="i"
            :callback="item.callback" />
        </div>

        <div v-if="item.type == 'num'" class=" flex gap-2 text-black ">
          <YJinput_number :value="item.value" :step="item.step" :index="i" :callback="item.callback" />
        </div>

      </div>

    </div>


    <div class="w-full h-5/6 flex text-xs">
      <!-- 左侧动作列表 -->
      <div class="w-64 px-4">
        <div>模型动作列表</div>
        <div v-for="(item, i) in animations" :key="i" :index="item.clipIndex"
          class="w-full h-8 self-center mx-auto flex mt-4">
          <div @click="ChangeAnim(item.clipIndex)" class="
                  cursor-pointer
                  pointer-events-auto
                  self-center
                  mx-auto
                  w-16
                  h-full 
                  flex
                " :class="selectCurrentIndex == item.clipIndex
                  ? ' text-blue-300 '
                  : '  '
                  ">
            <div class="self-center mx-auto text-xs">
              {{ item.animName }}<br />->{{ item.connectAnim }}
            </div>
          </div>

          <div v-if="item.targetIndex != -1" @click="Clear(item.clipIndex)" class="
                  w-8
                  self-center
                  text-xs
                  cursor-pointer
                  pointer-events-auto
                ">
            解绑
          </div>
          <!-- 速度 input -->
          <div class="mr-2 w-5 h-full">
            <input class="w-full h-full px-1" v-model="item.timeScale" type="text" />
          </div>

          <!-- <YJinput_drop class=" w-32 h-16 " :value="animOptions[i].value" :options="animOptions" :index="i"
            :callback="item.callback" /> -->

        </div>
        <!-- 角色高度 input -->
        <div class=" hidden mt-12 w-full h-10 flex gap-x-5">
          <div class="self-center">设置眼睛高度</div>
          <input class="w-10 h-10 px-1" v-model="height" @change="SetEyeHeight()" type="text" />
        </div>
      </div>

      <!-- 右侧标准动作名称 -->
      <div class="w-24 px-4 ">
        <div>标准动作名称</div>
        <div>
          <div v-for="(item, i) in animationsData" :key="i" :index="item.clipIndex"
            class="w-full h-8 self-center mx-auto flex mt-1" @click="SelectBaseAnim(item.clipIndex)" :class="item.connected
              ? ' bg-gray-500  pointer-events-none  '
              : ' bg-blue-200 cursor-pointer  pointer-events-auto '
              ">
            <div class="self-center mx-auto">
              {{ item.animName }}
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class=" mt-10 w-80 h-10 text-white cursor-pointer " @click="load()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">{{ loadContent }}</div>
    </div>

    <div class=" mt-2 w-80 h-10 text-white cursor-pointer " @click="save()">
      <div class=" mt-2 bg-445760 rounded-md inline-block px-14 py-1 ">保存</div>
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

import YJinput_text from "./components/YJinput_text.vue";
// import YJinput_text from "./components/YJinput_textarea.vue";
import YJinput_drop from "./components/YJinput_drop.vue";
import YJinput_upload from "./components/YJinput_upload.vue";
import YJinput_number from "./components/YJinput_number.vue";


export default {
  name: "settingpanel_uvanim",
  components: {
    YJinput_text,
    YJinput_drop,
    YJinput_upload,
    YJinput_number,

  },
  data() {
    return {
      chassisWidth: 2.2, //车身宽

      settingData: {
        id: "",
        name: "unity娘",
        height: 1.4,
        nameScale: 1,
        modelScale: 1,
        img: "images/player/13.png",
        modelType: "角色",
        modelPath: "models/player/unitychan/unitychan.gltf",
        animationsData: [
          { clipIndex: 0, animName: "idle", timeScale: 1, connected: false, targetIndex: 0 },
          { clipIndex: 1, animName: "walk", timeScale: 2, connected: false, targetIndex: 1 },
          { clipIndex: 2, animName: "jump", timeScale: 2, connected: false, targetIndex: 3 },
          { clipIndex: 3, animName: "run", timeScale: 1, connected: false, targetIndex: 2 }
        ]
      },

      avatar: null,
      selectCurrentIndex: 0,
      animations: [],

      cTime: "",
      currentTime: "",
      loading: false,
      height: 1.7,
      avatarData: {},
      animationsData: [
        {
          clipIndex: 0,
          animName: "idle",
          timeScale: 1,
          connected: false,
          targetIndex: 0,
        },
        {
          clipIndex: 1,
          animName: "walk",
          timeScale: 1,
          connected: false,
          targetIndex: 1,
        },
        {
          clipIndex: 2,
          animName: "jump",
          timeScale: 1,
          connected: false,
          targetIndex: 2,
        },
      ],


      setting: [
        { property: "height", display: true, title: "高度", type: "num", value: 1.78, step: 0.1, unit: "m", callback: this.ChangeValue },
        { property: "name", display: true, title: "名字", type: "text", value: "", callback: this.ChangeValue },

      ],
      animOptions: [
        { label: "idle", value: "idle" },
        { label: "walk", value: "walk" },
        { label: "jump", value: "jump" },
      ],

      loadContent: "使用",
      inSelect: false,
    };
  },
  created() {

  },
  mounted() {


    // _Global.SendMsgTo3D("添加组件", { component: "car", data: this.carData });
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

    this.initValue();


  },
  methods: {

    initValue() {

      for (let i = 0; i < this.setting.length; i++) {
        const element = this.setting[i];
        if (element.property == "url") {
          element.value = this.settingData.url;
        }
        // if (element.property == "loadPath") {
        //   if (this.$parent.updateModelTxtData) {
        //     element.display = false;
        //   }
        // }
      }

      if (this.settingData.url != "") {
        setTimeout(() => {
          this.load();
        }, 3000);
      }

    },
    load() {
      //替换角色控制器控制的角色
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

      // return;

      this.setting[i].value = e;
      // https://snvtkd2005.com/socketIOserver/socketIoServer/uploads/1691034641465/1691034641465_thumb.png
      // https://snvtkd2005.com/vue/dh2/metaverse/public/videos/movieSD.mp4

      this.settingData[this.setting[i].property] = e;

      console.log(i + " " + this.setting[i].value);
      // console.log(i + " " + this.setting[i].value + " " + e);

      // 
    },
    save() {
      // 单品中才有 updateModelTxtData
      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: "screen",
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

    Clear(i) {
      this.animations[i].connectAnim = "";
      this.animations[i].targetIndex = -1;
      this.UpdateBaseAnimState();
    },
    ChangeAnim(i) {
      this.selectCurrentIndex = i;
      this.avatar.ChangeAnimByIndex(i, this.animations[i].timeScale);

      if (this.animations[i].targetIndex != -1) {
        this.animationsData[this.animations[i].targetIndex].timeScale =
          parseFloat(this.animations[this.selectCurrentIndex].timeScale);
      }
    },
    SelectBaseAnim(i) {
      this.animations[this.selectCurrentIndex].connectAnim =
        this.animationsData[i].animName;
      this.animations[this.selectCurrentIndex].targetIndex = i;
      this.animationsData[i].targetIndex =
        this.animations[this.selectCurrentIndex].clipIndex;

      this.UpdateBaseAnimState();
    },
    UpdateBaseAnimState() {
      let selected = [];
      for (let index = 0; index < this.animations.length; index++) {
        const element = this.animations[index];
        if (element.targetIndex != -1) {
          selected.push({
            clipIndex: element.targetIndex,
            targetIndex: element.clipIndex,
          });
        }
      }

      for (let index = 0; index < this.animationsData.length; index++) {
        const element = this.animationsData[index];
        element.connected = false;
        element.targetIndex = -1;
      }

      for (let index = 0; index < selected.length; index++) {
        const element = selected[index];
        this.animationsData[element.clipIndex].connected = true;
        this.animationsData[element.clipIndex].targetIndex =
          element.targetIndex;
        if (element.timeScale == undefined) {
          element.timeScale = 1;
        }
        this.animationsData[element.clipIndex].timeScale = element.timeScale;
      }
    },
    SetAvatar(avatar) {
      this.avatar = avatar.GetComponent("Animator");
      let animations = this.avatar.GetAnimation();
      if (animations.length > 0) {
        for (let i = 0; i < animations.length; i++) {
          this.animations.push({
            clipIndex: i, timeScale: 1, connected: false, targetIndex: i,
            animName: animations[i].name
          });
        }
        this.ChangeAnim(0);
        console.log("设置 animations ", this.animations);

      }
      this.loading = false;
    },
    Update() {

      // _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);

      this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.UpdateTransform(
        {
          pointType: "screen",
          data: this.settingData
        }
      );
      // 调用场景保存
      if (this.$parent.updateSceneModelData) {
        this.$parent.updateSceneModelData();
      }


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
