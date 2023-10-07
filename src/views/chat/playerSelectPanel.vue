

// 游戏开始前的 角色选择界面
<template>

 
  <!-- 角色选择 -->
  <div
    class="absolute flex top-0 left-0 z-50 w-full h-full bg-gray-400"
  >
    <div
      class="
        w-96
        h-auto
        bg-gray-100
        border-b-2
        self-center
        mx-auto
        rounded-lg
        shadow-lg
      "
    >
      <div class=" flex ">
        <div class=" self-center mx-auto h-10 leading-10 text-2xl ">
          {{ language.content.selectAvatar }}
        </div>
      </div>

      <!-- 角色列表 -->
      <div
        class="
          overflow-y-auto
          overscroll-auto
          grid grid-cols-2
          gap-5
          w-full
          h-2/3
          px-5
        "
      >
        <div
          v-for="(item, i) in playerImgPath"
          :key="i"
          :index="item.img"
          class="
            w-full
            h-full
            bg-blue-100
            self-center
            mx-auto
            rounded-md
            shadow-md
            hover:bg-blue-400
            cursor-pointer
            flex
          "
          :class="selectPlayerName == item.name ? 'bg-blue-400' : 'bg-blue-100'"
          @click="selectPlayerName = item.name"
        >
          <div class="w-11/12 h-5/6 self-center mx-auto">
            <img
              class="p-2 w-full h-full object-fill"
              :src="publicUrl + item.img"
            />
          </div>
        </div>
      </div>

      <!-- 输入昵称 -->
      <div class="flex mt-5 w-full h-10 px-5">
        <div class="self-center">{{ language.content.enterUserName }}:</div>
        <input
          ref="nickNameInput"
          class="
            ml-5
            rounded-md
            shadow-md
            bg-transparent bg-blue-100
            px-2
            h-full
            outline-none
          "
          v-model="userName"
          :placeholder="language.content.enterUserName"
          @keyup.enter="ClickeSelectOK"
        />
      </div>
      <!-- 确定按钮 -->
      <div
        class="
          mx-auto
          mt-2
          mb-2
          w-20
          h-8
          leading-8
          text-xl
          bg-blue-300
          rounded-md
          shadow-md
          cursor-pointer
          flex
        "
        @click="ClickeSelectOK()"
      >
        <div class=" self-center mx-auto ">
          {{ language.content.selectOK }}
        </div>
      </div>

      <div v-if="canVR">支持VR</div>
    </div>
  </div>

</template>

<script>


export default {
  name: "index",
  props:["userName"],
  components: {
     
  },
  data() {
    return { 

      language: null,
       
      // 皮肤弹出框的角色选项
      modelsList: [], 
 
      selectPlayerName: "机器人",

      // 角色选择界面的角色信息
      playerImgPath: [],

      publicUrl:"",
    };
  }, 
  created() {
    this.avatarData = this.$parent.avatarData;
    
    this.language = this.$parent.language;
  },
  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;
    this.modelsList = this.avatarData.modelsList;
    this.roomName = this.avatarData.roomName;
    this.selectPlayerName = this.avatarData.defaultUser.avatarName;
  
    this.publicUrl = this.$parent.GetPublicUrl();

    
      //输入框重新获取焦点
      this.$refs.nickNameInput.focus();
  },
  methods: {

    ClickeSelectOK() {
      if (this.selectPlayerName == "") {
        return;
      }
      if (this.userName == "") {
        return;
      } 
      this.$parent.ClickSelectPlayerOK(this.selectPlayerName,this.userName);
    },  
  },
};
</script>

  <style scoped>
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
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
