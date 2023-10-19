
// 骨骼映射
<template>
  <!-- 模型库 模型列表选择 -->
  <div v-if="isOpen" class="
      absolute
      w-full
      h-full
      flex 
      text-white 
      overflow-hidden
     pointer-events-none
    ">
    <div class=" absolute bottom-0 mx-auto w-1/2 h-1/2 p-2 bg-gray-100 
      rounded-tr-lg rounded-tl-lg pointer-events-auto ">

      <!-- 技能面板 -->
      <div class="
              w-full 
             text-gray-500 
             rounded-lg 
             relative
            ">
        <div class=" flex ">
          <div class=" text-left ">当前角色的骨骼的绑定关系</div>
        </div>
        <div class="mt-2 overflow-y-scroll h-96  ">
          <div v-for="(item, i) in boneList" :key="i" class=" flex  text-base  text-left  h-auto  ">
            <div v-if="item.targetBone == ''" class=" w-auto  truncate mb-2  cursor-pointer flex  justify-between "
              @click="ChangeAnim(item)">
              <text>{{ item.boneName }}</text>
            </div>
          </div>
        </div>
        <div class=" absolute -right-5 -top-5 rounded-full w-10 h-10 bg-white text-black flex cursor-pointer "
          @click="isOpen = false;">
          <div class=" self-center mx-auto ">X</div>
        </div>

        <div class=" absolute right-5 -top-16 rounded-full w-10 h-10 bg-white text-black flex cursor-pointer "
          @click="save()">
          <div class=" self-center mx-auto ">保存</div>
        </div>

      </div>

      <!-- 技能添加弹窗 -->
      <div class=" absolute top-0 right-0 text-white bg-black bg-opacity-40    ">

        <div v-for="(item, i) in baseBoneList" :key="i" class=" 
               text-xs  text-left flex w-80 px-4 py-2 h-auto mb-2     ">
          <div :style="' left:' + item.x + 'px;top:' + item.y + 'px;'" class="absolute ">
            <div
              :class="item.targetBone == '' ? (this.selectBaseBone.boneName == item.boneName ? 'bg-blue-500' : 'bg-red-500') : ' bg-green-500 '"
              class="   self-center  truncate w-4 h-4  rounded-full " @click="SelectBone(item)">
            </div>
            <div class=" hidden  self-center w-40  truncate">
              {{ item.boneName }}
            </div>
            <div class=" hidden self-center  ">
              {{ item.part }}
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import YJinput_text from "./components/YJinput_text.vue";
import { GetAllModel, UploadPlayerFile } from "../../js/uploadThreejs.js";
import { YJBoneConvert } from "/@/threeJS/loader/YJBoneConvert.js";

export default {
  name: "index",

  components: {
    YJinput_text,
  },
  data() {
    return {
      isOpen: false,
      inAdd: false,
      modelPos: { x: 0, y: 0 },
      selectModelItem: { name: "" },
      // 当前角色的骨骼的绑定关系
      boneList: [
        { boneName: "idle", targetBone: "" },
      ],

      //  
      baseBoneList: [

        { targetBone: "", boneName: "Hips", part: "中心点", x: 150, y: 150 },

        { targetBone: "", boneName: "Spine", part: "脊柱", x: 150, y: 130 },
        { targetBone: "", boneName: "Spine1", part: "脊柱1", x: 150, y: 110 },
        { targetBone: "", boneName: "Spine2", part: "脊柱2", x: 150, y: 90 },

        { targetBone: "", boneName: "Neck", part: "颈部", x: 150, y: 60 },
        { targetBone: "", boneName: "Head", part: "头部寰椎", x: 150, y: 40 },
        { targetBone: "", boneName: "HeadTop", part: "头顶", x: 150, y: 0 },

        { targetBone: "", boneName: "LeftShoulder", part: "左肩肩胛骨", x: 120, y: 50 },
        { targetBone: "", boneName: "LeftArm", part: "左臂根部", x: 100, y: 50 },
        { targetBone: "", boneName: "LeftForeArm", part: "左臂肘部", x: 70, y: 90 },
        { targetBone: "", boneName: "LeftHand", part: "左手腕", x: 50, y: 150 },

        { targetBone: "", boneName: "RightShoulder", part: "右肩肩胛骨", x: 180, y: 50 },
        { targetBone: "", boneName: "RightArm", part: "右臂根部", x: 200, y: 50 },
        { targetBone: "", boneName: "RightForeArm", part: "右臂肘部", x: 230, y: 90 },
        { targetBone: "", boneName: "RightHand", part: "右手腕", x: 250, y: 150 },

        { targetBone: "", boneName: "LeftUpLeg", part: "左腿根部", x: 120, y: 180 },
        { targetBone: "", boneName: "LeftLeg", part: "左腿膝盖", x: 100, y: 250 },
        { targetBone: "", boneName: "LeftFoot", part: "左腿脚踝", x: 100, y: 330 },
        { targetBone: "", boneName: "LeftToeBase", part: "左腿脚掌", x: 100, y: 350 },

        { targetBone: "", boneName: "RightUpLeg", part: "右腿根部", x: 180, y: 180 },
        { targetBone: "", boneName: "RightLeg", part: "右腿膝盖", x: 200, y: 250 },
        { targetBone: "", boneName: "RightFoot", part: "右腿脚踝", x: 200, y: 330 },
        { targetBone: "", boneName: "RightToeBase", part: "右腿脚掌", x: 200, y: 350 },

        { targetBone: "", boneName: "LeftHandIndex1", part: "左手食指", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandIndex2", part: "左手食指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandIndex3", part: "左手食指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandMiddle1", part: "左手中指", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandMiddle2", part: "左手中指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandMiddle3", part: "左手中指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandPinky1", part: "左手小指", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandPinky2", part: "左手小指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandPinky3", part: "左手小指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandRing1", part: "左手无名指", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandRing2", part: "左手无名指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandRing3", part: "左手无名指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandThumb1", part: "左手拇指", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandThumb2", part: "左手拇指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "LeftHandThumb3", part: "左手拇指尖部", x: 0, y: 0 },

        { targetBone: "", boneName: "RightHandIndex1", part: "右手食指", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandIndex2", part: "右手食指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandIndex3", part: "右手食指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandMiddle1", part: "右手中指", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandMiddle2", part: "右手中指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandMiddle3", part: "右手中指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandPinky1", part: "右手小指", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandPinky2", part: "右手小指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandPinky3", part: "右手小指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandRing1", part: "右手无名指", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandRing2", part: "右手无名指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandRing3", part: "右手无名指尖部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandThumb1", part: "右手拇指", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandThumb2", part: "右手拇指中部", x: 0, y: 0 },
        { targetBone: "", boneName: "RightHandThumb3", part: "右手拇指尖部", x: 0, y: 0 },

      ],

      path: "",
      model: null,
      inEditor: false,
      modelItem: null,

      uploadUrl: "",

      selectBaseBone: {},
    };
  },
  created() { },
  mounted() {
    this.path = this.$uploadUrl;

    this.folderBase = "";


  },
  methods: {
    SelectBone(item) {
      this.selectBaseBone = item;
    },
    SetVisible(b, bones, boneRef) {
      this.isOpen = b;
      if (b) {
        this.initValue(bones, boneRef);
      }
    },

    initValue(bones, boneRef) {
      this.boneList = [];
      for (let i = 0; i < bones.length; i++) {
        const element = bones[i];
        this.boneList.push({ boneName: element, targetBone: '' });
      }
      // 智能绑定
      for (let i = 0; i < this.boneList.length; i++) {
        const newbone = this.boneList[i];
        for (let j = 0; j < this.baseBoneList.length; j++) {
          const basebone = this.baseBoneList[j];
          if (newbone.boneName.includes(basebone.boneName)) {
            basebone.targetBone = newbone.boneName;
            newbone.targetBone = basebone.boneName;
          }
        }
      }

      for (let i = 0; i < this.boneList.length; i++) {
        const newbone = this.boneList[i];
        for (let j = 0; j < boneRef.length; j++) {
          const basebone = boneRef[j];
          if (newbone.boneName==(basebone.boneName)) {
            newbone.targetBone = basebone.targetBone;
          }
        }
      }

      for (let i = 0; i < this.baseBoneList.length; i++) {
        const newbone = this.baseBoneList[i];
        for (let j = 0; j < boneRef.length; j++) {
          const basebone = boneRef[j];
          if (newbone.boneName==(basebone.targetBone)) {
            newbone.targetBone = basebone.boneName;
          }
        }
      }
 
      console.log("this.boneList ",boneRef, this.boneList);

      //

    },
    save() {
      for (let i = this.boneList.length-1; i >=0 ; i--) {
        const element = this.boneList[i];
        if(element.targetBone == ""){
          this.boneList.splice(i,1);
        }
      }
      this.$parent.$refs.settingPanel_player.saveBone(this.boneList);
    },
    ChangeAnim(currentBoneItem) {
      if (this.selectBaseBone.boneName == undefined) {
        return;
      }
      // 如果base骨骼绑定了其他的，要先将其释放
      if (this.selectBaseBone.targetBone != "") {
        for (let i = 0; i < this.boneList.length; i++) {
          const element = this.boneList[i];
          if (element.targetBone == this.selectBaseBone.boneName) {
            element.targetBone = "";
          }
        }
      }

      currentBoneItem.targetBone = this.selectBaseBone.boneName;
      this.selectBaseBone.targetBone = currentBoneItem.boneName;


      this.selectBaseBone = {};
    },
  },
};
</script>