
// UV动画设置
<template>
  <!-- avatar设置 -->
  <div class="w-full max-w-md p-2 text-white rounded-lg overflow-hidden">
    <div class=" flex justify-between">
      <div class="text-left">自带动作映射</div>
      <div class=" cursor-pointer " @click="fold = !fold;">{{ fold ? '展开' : '折叠' }}</div>
    </div>
    <div v-show="!fold">

      <div class=" w-full">
      <YJinputCtrl :setting="setting" />
    </div> 

      <div v-if="hasModelAnim" class="w-full h-5/6 flex text-xs">
        <!-- 左侧动作列表 -->
        <div class="w-56 px-4">
          <div>模型动作列表</div>
          <div v-for="(item, i) in animations" :key="i" :index="item.clipIndex"
            class="w-full h-8 self-center mx-auto flex mt-4">
            <div @click="ChangeAnimByIndex(item.clipIndex)" class="
              cursor-pointer
              pointer-events-auto
              self-center
              mx-auto
              w-16
              h-full
              flex
            " :class="selectCurrentIndex == item.clipIndex ? ' text-blue-300 ' : '  '
              ">
              <div class="self-center mx-auto text-xs">
                {{ item.animName }}<br />->{{ item.connectAnim }}
              </div>
            </div>

            <div v-if="item.targetIndex != -1" @click="Clear(item.clipIndex)"
              class="w-8 self-center text-xs cursor-pointer pointer-events-auto">
              解绑
            </div>
            <!-- 速度 input -->
            <div class="mr-2 w-5 h-full text-black">
              <input class="w-full h-full px-1" v-model="item.timeScale" type="text" />
            </div>

            <!-- <YJinput_drop class=" w-32 h-16 " :value="animOptions[i].value" :options="animOptions" :index="i"
            :callback="item.callback" /> -->
          </div>
          <!-- 角色高度 input -->
          <div class="hidden mt-12 w-full h-10 flex gap-x-5">
            <div class="self-center">设置眼睛高度</div>
            <input class="w-10 h-10 px-1" v-model="height" @change="SetEyeHeight()" type="text" />
          </div>
        </div>

        <!-- 右侧标准动作名称 -->
        <div class="w-24 px-4">
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

      <div class=" hidden mt-2 w-80 h-10 text-white cursor-pointer" @click="save()">
        <div class="mt-2 bg-445760 rounded-md inline-block px-14 py-1">保存</div>
      </div>
    </div>

  </div>
</template>

<script>


import YJinputCtrl from "../components/YJinputCtrl.vue"; 

export default {
  name: "settingpanel_avatar",
  components: {
YJinputCtrl,
  },
  data() {
    return {
      settingData: {
        height:"",
        modelScale:1,
        rotation:[],
        offsetPos:[],
      },
      fold: false,
      hasModelAnim:false,//模型上是否带动作
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
        { property: "height", display: true, title: "高度", type: "num", value: 1.78, step: 0.1, unit: "m", callback: this.ChangeValue, },
        { property: "modelScale", display: true, title: "缩放比例", type: "num", value: 1, step: 0.01, callback: this.ChangeValue, },
        { property: "rotation", display: true, title: "旋转偏移（模型前方为Z轴）", type: "vector3", value: [0,0,0], step: 0.01, callback: this.ChangeValue, },
        { property: "offsetPos", display: true, title: "位置偏移", type: "vector3", value: [0,0,0], step: 0.01, callback: this.ChangeValue, },
        // { property: "name", display: true, title: "名字", type: "text", value: "", callback: this.ChangeValue },
      ],
    };
  },
  created() { 
    this.parent = this.$parent;
  },
  mounted() {
  },
  methods: {

    removeThreeJSfocus() {
      this.parent.removeThreeJSfocus();
    },
    initValue(_settingData) {
      this.settingData = _settingData;

      this.Utils.SetSettingItemByPropertyAll(this.setting, this.settingData);
      console.log(" initValue settingData ", this.settingData);
      if( !this.settingData.rotation){
        this.settingData.rotation = [0,0,0];
      }
      if( !this.settingData.offsetPos){
        this.settingData.offsetPos = [0,0,0];
      }
      
      this.Utils.SetSettingItemByProperty(this.setting, "rotation", this.settingData.rotation);
      this.Utils.SetSettingItemByProperty(this.setting, "offsetPos", this.settingData.offsetPos);

      this.animations = this.settingData.animationsData;
      if(this.animations || this.animations.length == 0){
        this.hasModelAnim = false;
        return;
      }
      this.hasModelAnim = true;
      for (let i = 0; i < this.animationsData.length; i++) {
        const item = this.animationsData[i];
        for (let j = 0; j < this.animations.length; j++) {
          const element = this.animations[j];
          if (item.animName == element.animName) {
            item.connected = true;
          }
        }
      }

    },
    ChangeValue(i, e) {
      this.setting[i].value = e;
      this.settingData[this.setting[i].property] = e;

      if (this.setting[i].property == "height") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform()
          .GetComponent("Avatar")
          .SetHeight(e);

        //同时更新到 YJPlayerAnimData 中
        // _Global.CreateOrLoadPlayerAnimData().UpdateAvatarDataById(this.settingData.id, this.settingData);
        console.log(" 刷新 setting data ", this.settingData.id, this.settingData);
      }
      if ( this.setting[i].property == "rotation") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform()
          .GetComponent("MeshRenderer")
          .SetRotaArray(this.settingData.rotation);
      }
      
      if ( this.setting[i].property == "offsetPos") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform()
          .GetComponent("MeshRenderer")
          .SetPosArray(this.settingData.offsetPos);
      }
      
      if (this.setting[i].property == "modelScale") {
        // 控制三维
        _Global.YJ3D._YJSceneManager
          .GetSingleModelTransform().GetComponent("MeshRenderer")
          .SetSize(e);
      }
      console.log(i + " " + this.setting[i].value);
    },
    save() {
      if(!this.hasModelAnim){
        return;
      }
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
      this.parent.settingData.animationsData = this.settingData.animationsData;
    },

    // 设置角色眼睛高度
    SetEyeHeight() {
      _Global.YJ3D.YJController.SetTargetHeight(
        height
      );
    },

    // 解绑
    Clear(i) {
      for (let index = 0; index < this.animationsData.length; index++) {
        const element = this.animationsData[index];
        if (this.animations[i] == undefined || element.animName == this.animations[i].connectAnim) {
          element.connected = false;
        }
      }
      if (this.animations[i] == undefined) {
        this.animations.splice(i, 1);
        return;
      }
      this.animations[i].connectAnim = "";
      this.animations[i].targetIndex = -1;
    },

    ChangeAnimByIndex(i) {
      this.selectCurrentIndex = i;
      this.avatar.ChangeAnimByIndex(i, this.animations[i].timeScale);
      if (this.animations[i].targetIndex != -1 && this.animations[i].targetIndex < this.animationsData.length) {
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
      this.hasModelAnim = animations.length > 0;
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
      }else{
        if(this.settingData.animationsExtendData && this.settingData.animationsExtendData.length>0){
          for (let i = 0; i < this.settingData.animationsExtendData.length; i++) {
            const item = this.settingData.animationsExtendData[i];
            if(item.animName){
              this.ChangeAnim(item.animName);
              return;
            }
          }

        }
      }
    },
  },
};
</script>

<style scoped></style>
