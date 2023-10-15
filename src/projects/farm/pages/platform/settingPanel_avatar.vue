
// UV动画设置
<template>
  <!-- 场景设置面板 -->
  <div class="w-80 max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class="text-left">avatar设置</div>

    <div
      v-for="(item, i) in setting"
      :key="i"
      class="text-xs text-left flex w-80 h-auto mb-2"
    >
      <div class="self-center w-40 truncate" v-show="item.display">
        {{ item.title }}
      </div>
      <div class="self-center w-20">
        <div v-if="item.type == 'text'" class="w-32 h-auto text-black">
          <YJinput_text
            class="w-full h-auto"
            :value="item.value"
            :index="i"
            :callback="item.callback"  
          />
        </div>

        <div v-if="item.type == 'num'" class="flex gap-2 text-black">
          <YJinput_number
            :value="item.value"
            :step="item.step"
            :index="i"
            :callback="item.callback" 
          />
        </div>
      </div>
    </div>

    <div class="w-full h-5/6 flex text-xs">
      <!-- 左侧动作列表 -->
      <div class="w-56 px-4">
        <div>模型动作列表</div>
        <div
          v-for="(item, i) in animations"
          :key="i"
          :index="item.clipIndex"
          class="w-full h-8 self-center mx-auto flex mt-4"
        >
          <div
            @click="ChangeAnimByIndex(item.clipIndex)"
            class="
              cursor-pointer
              pointer-events-auto
              self-center
              mx-auto
              w-16
              h-full
              flex
            "
            :class="
              selectCurrentIndex == item.clipIndex ? ' text-blue-300 ' : '  '
            "
          >
            <div class="self-center mx-auto text-xs">
              {{ item.animName }}<br />->{{ item.connectAnim }}
            </div>
          </div>

          <div
            v-if="item.targetIndex != -1"
            @click="Clear(item.clipIndex)"
            class="w-8 self-center text-xs cursor-pointer pointer-events-auto"
          >
            解绑
          </div>
          <!-- 速度 input -->
          <div class="mr-2 w-5 h-full text-black">
            <input
              class="w-full h-full px-1"
              v-model="item.timeScale"
              type="text"
            />
          </div>

          <!-- <YJinput_drop class=" w-32 h-16 " :value="animOptions[i].value" :options="animOptions" :index="i"
            :callback="item.callback" /> -->
        </div>
        <!-- 角色高度 input -->
        <div class="hidden mt-12 w-full h-10 flex gap-x-5">
          <div class="self-center">设置眼睛高度</div>
          <input
            class="w-10 h-10 px-1"
            v-model="height"
            @change="SetEyeHeight()"
            type="text"
          />
        </div>
      </div>

      <!-- 右侧标准动作名称 -->
      <div class="w-24 px-4">
        <div>标准动作名称</div>
        <div>
          <div
            v-for="(item, i) in animationsData"
            :key="i"
            :index="item.clipIndex"
            class="w-full h-8 self-center mx-auto flex mt-1"
            @click="SelectBaseAnim(item.clipIndex)"
            :class="
              item.connected
                ? ' bg-gray-500  pointer-events-none  '
                : ' bg-blue-200 cursor-pointer  pointer-events-auto '
            "
          >
            <div class="self-center mx-auto">
              {{ item.animName }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="hidden mt-10 w-80 h-10 text-white cursor-pointer"
      @click="load()"
    >
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">
        {{ loadContent }}
      </div>
    </div>

    <div class="mt-2 w-80 h-10 text-white cursor-pointer" @click="save()">
      <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">保存</div>
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
      settingData: {
        name: "",
        height: 1.4,
        nameScale: 1,
        modelScale: 1,
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
            timeScale: 2,
            connected: false,
            targetIndex: 1,
          },
          {
            clipIndex: 2,
            animName: "jump",
            timeScale: 2,
            connected: false,
            targetIndex: 3,
          },
          {
            clipIndex: 3,
            animName: "run",
            timeScale: 1,
            connected: false,
            targetIndex: 2,
          },
        ],
      },

      avatar: null,
      selectCurrentIndex: 0,
      animations: [],

      // 标准动作模板，无需改变
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
        {
          clipIndex: 3,
          animName: "run",
          timeScale: 1,
          connected: false,
          targetIndex: 3,
        },
      ],

      setting: [
        {
          property: "height",
          display: true,
          title: "高度",
          type: "num",
          value: 1.78,
          step: 0.1,
          unit: "m",
          callback: this.ChangeValue,
        },
        // { property: "name", display: true, title: "名字", type: "text", value: "", callback: this.ChangeValue },
      ],

      loadContent: "使用",
    };
  },
  created() {},
  mounted() {
    let modelData = JSON.parse(localStorage.getItem("modelData"));

    this.settingData.name = modelData.name;

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
    initValue() {
      this.animations = this.settingData.animationsData;

      for (let i = 0; i < this.animationsData.length; i++) {
        const item = this.animationsData[i];
        for (let j = 0; j < this.animations.length; j++) {
          const element = this.animations[j];
          if (item.animName == element.animName) {
            item.connected = true;
          }
        }
      }

      this.setSettingItemByProperty("height", this.settingData.height);
    },
    load() {
      //替换角色控制器控制的角色
    },
    updateName(v) {
      this.settingData.name = v;
      this.$parent.modelData.message = {
        pointType: "avatar",
        data: this.settingData,
      };

      // 控制三维
      this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager
        .GetSingleModelTransform()
        .GetComponent("Avatar")
        .SetMessage(this.settingData);
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

      if (this.setting[i].property == "height") {
        // 控制三维
        this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager
          .GetSingleModelTransform()
          .GetComponent("Avatar")
          .SetMessage(this.settingData);
      }
      console.log(i + " " + this.setting[i].value);
    },
    save() {
      this.settingData.animationsData = [];
      for (let i = 0; i < this.animations.length; i++) {
        const element = this.animations[i];
        this.settingData.animationsData.push({
          targetIndex: element.targetIndex,
          animName: element.connectAnim,
          localAnimName: element.animName,
          timeScale: element.timeScale,
        });
      }

      // 单品中才有 updateModelTxtData
      if (this.$parent.updateModelTxtData) {
        this.$parent.modelData.message = {
          pointType: "avatar",
          data: this.settingData,
        };
        this.$parent.updateModelTxtData();
      } else {
        // 在场景编辑中的修改
        this.Update();
      }
    },

    // 设置角色眼睛高度
    SetEyeHeight() {
      this.$parent.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetTargetHeight(
        height
      );
    },

    // 解绑
    Clear(i) {
      for (let index = 0; index < this.animationsData.length; index++) {
        const element = this.animationsData[index];
        if (element.animName == this.animations[i].connectAnim) {
          element.connected = false;
        }
      }

      this.animations[i].connectAnim = "";
      this.animations[i].targetIndex = -1;
    },

    ChangeAnimByIndex(i) {
      this.selectCurrentIndex = i;
      this.avatar.ChangeAnimByIndex(i,this.animations[i].timeScale);
      if (this.animations[i].targetIndex != -1 && this.animations[i].targetIndex<this.animationsData.length) {
        this.animationsData[this.animations[i].targetIndex].timeScale =
          parseFloat(this.animations[this.selectCurrentIndex].timeScale);
      }
    },

    ChangeAnim(animName) {
      this.avatar.ChangeAnim(animName);
    },
    SelectBaseAnim(i) {
      // 清除其他按钮的状态
      for (let index = 0; index < this.animationsData.length; index++) {
        const element = this.animationsData[index];
        if (
          element.animName ==
          this.animations[this.selectCurrentIndex].connectAnim
        ) {
          element.connected = false;
        }
      }

      this.animations[this.selectCurrentIndex].connectAnim =
        this.animationsData[i].animName;
      this.animations[this.selectCurrentIndex].targetIndex =
        this.animations[this.selectCurrentIndex].clipIndex;
      this.animationsData[i].connected = true;
      this.animationsData[i].targetIndex =
        this.animations[this.selectCurrentIndex].clipIndex;
    },
    SetAvatar(avatar) {
      if (avatar == null) {
        return;
      }
      this.avatar = avatar.GetComponent("Animator");
      if (this.avatar == null) {
        return;
      }

      let animations = this.avatar.GetAnimation();
      if (animations.length > 0) {
        let temp = [];
        for (let i = 0; i < animations.length; i++) {
          temp.push({
            clipIndex: i,
            timeScale: 1,
            connected: false,
            targetIndex: -1,
            connectAnim: "",
            animName: animations[i].name,
          });
        }
        if (this.animations.length == 0) {
        } else {
          for (let i = 0; i < this.animations.length; i++) {
            const item = this.animations[i];
            for (let j = 0; j < temp.length; j++) {
              const element = temp[j];
              // if (element.animName == item.localAnimName) {
              //   element.connectAnim = item.animName;
              //   element.connected = true;
              //   element.targetIndex = item.targetIndex;
              //   element.timeScale = item.timeScale;
              // }
              if (element.clipIndex == item.targetIndex) {
                element.connectAnim = item.animName;
                element.connected = true;
                element.targetIndex = item.targetIndex;
                element.timeScale = item.timeScale;
              }
            }
          }
        }
        this.animations = temp;
        this.ChangeAnim("idle");
        console.log("设置 animations ", this.animations);
      }
    },
    Update() {
      // _Global.SendMsgTo3D("刷新Transform", this.$parent.modelData.message);

      this.$parent.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.UpdateTransform(
        {
          pointType: "avatar",
          data: this.settingData,
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
