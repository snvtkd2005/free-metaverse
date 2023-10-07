

// 游戏开始前的 角色选择界面
<template>

  <div class="absolute  top-0 left-0 z-50 w-full h-full bg-gray-400">

  </div>

  <!-- 角色选择 和 场景选择 -->
  <div class="absolute top-2 md:top-20 left-0 md:left-10 z-60 w-32 md:w-1/2 h-1/2  ">
    <!-- 角色选择 -->
    <div class="
        md:w-auto
        w-32
        h-auto  
        self-center
        mx-auto 
      ">
      <div class=" flex mb-5 ">
        <div class=" text-left pl-4 self-center  h-10 leading-10 text-2xl ">
          {{ language.content.selectAvatar }}
        </div>
      </div>

      <!-- 列表 -->
      <div class="
          overflow-y-auto
          overscroll-auto
          grid 
          md:grid-cols-4
          md:grid-rows-1
          grid-rows-4
          gap-5
          w-full
         max-w-lg
          md:h-2/3
          md:px-5
        ">
        <div v-for="(item, i) in playerImgPath" :key="i" :index="item.img" class="
            w-16 h-16
        md:w-24 md:h-24

            bg-blue-100
            self-center
            mx-auto
            rounded-full
            shadow-md
            hover:bg-blue-400
            cursor-pointer
            flex
          " :class="selectPlayerName == item.name ? 'bg-blue-400' : 'bg-blue-100'" @click="SelectAvatar(item.name)">
          <div class="w-11/12 h-11/12 self-center mx-auto">
            <img class="p-2 w-full h-full object-fill" :src="publicUrl + item.img" />
          </div>
        </div>
      </div>
    </div>


    <!-- 场景选择 -->
    <div class=" absolute -right-60 top-0 
    md:static 
      md:mt-10
        w-auto
        h-auto  
        self-center
        mx-auto 
      ">
      <div class=" flex mb-5 ">
        <div class=" text-left pl-4 self-center  h-10 leading-10 text-2xl ">
          {{ language.content.selectScene }}
        </div>
      </div>

      <!-- 选择列表 -->
      <div class="
          overflow-y-auto
          overscroll-auto
          grid 
          md:grid-cols-4   
          md:grid-rows-1     
          grid-rows-4

          gap-5 
          w-full 
         max-w-lg
          md:px-5
        ">
        <div v-for="(item, i) in sceneImgPath" :key="i" :index="item.img" class="
            w-20 h-20
        md:w-24
            md:h-24
            bg-blue-100
            self-center
            mx-auto
            rounded-md
            shadow-md
            hover:bg-blue-400
            cursor-pointer
            flex
          " :class="selectSceneName == item.name ? 'bg-blue-400' : 'bg-blue-100'" @click="SelectScene(item.name)">
          <div class="w-11/12 h-5/6 self-center mx-auto">
            <img class="p-2 w-full h-full rounded-md  object-fill" :src="publicUrl + item.img" />
          </div>
        </div>
      </div>




    </div>
  </div>



  <!-- 右侧角色模型展示 -->
  <div class="  absolute z-50 right-0 top-0 w-full md:w-1/2 h-full overflow-hidden   ">
    <div id="contain" class="w-full h-full  " ref="YJ3dscene"></div>

    <div class=" absolute left-0 bottom-5 md:bottom-20 w-full  md:w-1/2 transform md:translate-x-1/2 ">

      <!-- 输入昵称 -->

      <div class=" w-full flex">
        <div class="flex w-auto h-10 px-2 mx-auto">
          <div class=" w-20 self-center ">{{ language.content.enterUserName }}:</div>
          <input ref="nickNameInput" class="
    ml-5
    rounded-md
    shadow-md
    bg-transparent bg-blue-100
    px-2
    h-full
    w-32
    outline-none
  " v-model="userName" :placeholder="language.content.enterUserName" @keyup.enter="ClickeSelectOK" />
        </div>
      </div>

      <!-- 确定按钮 -->
      <div class=" w-full flex">

        <div class="
          mx-auto
          mt-3
          mb-2 
          h-8
          leading-8
          text-xl
          bg-blue-300
          rounded-md
          shadow-md
          cursor-pointer
          w-auto
        inline-block
        " @click="ClickeSelectOK()">
          <div class="  px-3  self-center mx-auto   ">
            {{ language.content.selectOK }}
          </div>
        </div>
      </div>

      <div v-if="canVR">支持VR</div>
    </div>
  </div>

</template>

<script>

import { YJ3dScene_playerSelect } from "/@/threeJS/YJ3dScene_playerSelect.js";

export default {
  name: "index",
  props: ["userName"],
  components: {

  },
  data() {
    return {

      language: null,

      // 皮肤弹出框的角色选项
      modelsList: [],

      selectPlayerName: "机器人",
      selectSceneName: "scene1",

      // 角色选择界面的角色信息
      playerImgPath: [],
      sceneImgPath: [],

      publicUrl: "",
      userName:props.userName,
    };
  },
  created() {
    this.avatarData = this.$parent.avatarData;

    this.language = this.$parent.language;
    this.language.content.selectOK = "进入元宇宙";
    this.language.content.selectScene = "选择场景";
    this._YJ3dScene = null;

  },
  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;

    this.sceneImgPath = this.avatarData.sceneList;

    this.modelsList = this.avatarData.modelsList;
    this.roomName = this.avatarData.roomName;
    this.selectPlayerName = this.avatarData.defaultUser.avatarName;

    this.publicUrl = this.$parent.GetPublicUrl();


    //输入框重新获取焦点
    this.$refs.nickNameInput.focus();

    if (this._YJ3dScene == null) {
      this._YJ3dScene = new YJ3dScene_playerSelect(this.$refs.YJ3dscene, this);

      this.SelectAvatar(this.selectPlayerName);


    }
  },
  methods: {
    GetPublicUrl() {
      return this.publicUrl;
    },
    SelectScene(e) {
      this.selectSceneName = e;
      this.$parent.SelectScene(this.selectSceneName);
    },
    SelectAvatar(e) {
      this.selectPlayerName = e;
      // console.log("this.selectPlayerName = " + this.selectPlayerName);
      //加载3d模型
      this._YJ3dScene.ChangeAvatarByCustom(this.$parent.$refs.YJmetaBase.GetAvatarData(this.selectPlayerName));

    },
    ClickeSelectOK() {
      if (this.selectPlayerName == "") {
        return;
      }
      if (this.userName == "") {
        return;
      }
      this.$parent.ClickSelectPlayerOK(this.selectPlayerName, this.userName);
    },
  },
};
</script>

<style scoped>
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.z-60 {
  z-index: 60;
}

/* 阻止长按复制 */
.stop-long-hover {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.max-w-1200 {
  max-width: 1200px;
}

::-webkit-scrollbar {
  /* 滚动条整体部分 */
  /* width:0px; */
  border-radius: 10px;
  width: 10px;
  margin-right: 2px;
  /* display: block !important; */
  /* 控制滑动条是否显示 */
  display: none;
}

::-webkit-scrollbar-button {
  /* 滚动条两端的按钮 */
  width: 10px;
  background-color: #adadad;
  display: none;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
  margin-bottom: 2px;
}

::-webkit-scrollbar-track {
  /* 外层轨道 */
  border-radius: 10px;
}

::-webkit-scrollbar-track-piece {
  /*内层轨道，滚动条中间部分 */
  background-color: #cbcbcb;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  /* 滑块 */
  width: 10px;
  border-radius: 5px;
  background: #adadad;
}

::-webkit-scrollbar-corner {
  /* 边角 */
  width: 10px;
  background-color: #cbcbcb;
  display: none;
}

::-webkit-scrollbar-thumb:hover {
  /* 鼠标移入滑块 */
  background: #adadad;
}
</style>
