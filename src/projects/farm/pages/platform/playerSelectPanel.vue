


<template>
  <div class="absolute top-0 left-0 z-10 w-full h-full bg-gray-400">
    <div class="absolute top-0 left-0 z-10 w-full h-full bg-gray-400">
      <img
        class="w-full h-full"
        :src="publicUrl + 'images/spUI/bg.png'"
        alt=""
      />
    </div>

    <!-- 角色选择 和 场景选择 -->
    <div
      class="absolute top-10 xl:top-36 left-10 xl:left-52 z-60 w-64 xl:w-auto h-1/2"
    >
      <!-- 角色选择 -->
      <div class="xl:w-auto w-auto h-auto self-center mx-auto">
        <div class="flex mb-2 xl:mb-5 origin-top-left w-32 xl:w-auto">
          <img :src="publicUrl + 'images/spUI/yuanzhe1.png'" alt="" />

          <!-- <div class=" text-left pl-4 self-center  h-10 leading-10 text-2xl ">
                      {{ language.content.selectAvatar }}
                    </div> -->
        </div>

        <!-- 列表 -->
        <div
          class="flex w-full max-w-2xl h-16 gap-3 xl:gap-0 xl:h-2/3 justify-items-start"
        >
          <div
            v-for="(item, i) in playerImgPath"
            :key="i"
            :index="item.img"
            class="w-16 h-16 xl:w-32 xl:h-32 transform hover:scale-110 self-center mx-auto cursor-pointer flex relative"
            :class="selectPlayerId == item.name ? ' ' : ' '"
            @click="SelectAvatar(item.name)"
          >
            <div class="self-center mx-auto">
              <img
                class="w-full h-full object-fill"
                :src="publicUrl + item.img"
              />
            </div>
            <div
              v-if="selectPlayerId == item.name"
              class="absolute bottom-0 right-0"
            >
              <img
                class="w-4 h-4 xl:w-full xl:h-full object-fill"
                :src="publicUrl + 'images/spUI/select.png'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 场景选择 -->
      <div class="xl:static xl:mt-20 mt-2 w-auto h-auto self-center mx-auto">
        <div class="flex mb-5 origin-top-left w-32 xl:w-auto">
          <img :src="publicUrl + 'images/spUI/yuanzhe2.png'" alt="" />

          <!-- <div class=" text-left pl-4 self-center  h-10 leading-10 text-2xl ">
                      {{ language.content.selectScene }}
                    </div> -->
        </div>

        <!-- 选择列表 -->
        <div
          class="grid xl:grid-cols-2 xl:grid-rows-1 grid-cols-2 gap-2 xl:gap-16 w-full xl:w-full max-w-2xl xl:mt-10"
        >
          <div
            v-for="(item, i) in sceneImgPath"
            :key="i"
            :index="item.img"
            class="self-center mx-auto transform hover:scale-110 cursor-pointer flex relative"
            :class="selectSceneName == item.name ? ' ' : ' '"
            @click="SelectScene(item.name)"
          >
            <div class="self-center mx-auto">
              <img
                class="w-full h-full object-fill"
                :src="publicUrl + item.icon"
              />
            </div>

            <div
              v-if="selectSceneName == item.name"
              class="absolute -bottom-2 -right-2"
            >
              <img
                class="w-4 h-4 xl:w-full xl:h-full object-fill"
                :src="publicUrl + 'images/spUI/select.png'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧角色模型展示 -->
    <div
      class="absolute z-20 right-0 top-0 w-1/2 xl:w-1/2 h-full overflow-hidden"
    >
      <!-- <div id="contain" class="w-full h-full  " ref="YJ3dscene"></div> -->
      <playerSelect3DPanel
        id="contain"
        class="w-full h-full"
        ref="playerSelect3DPanel"
      ></playerSelect3DPanel>
    </div>

    <!-- 昵称输入框 -->
    <div
      class="absolute z-20 left-0 bottom-5 xl:bottom-32 w-1/2 xl:w-1/2 transform translate-x-1/2 xl:translate-x-full"
    >
      <!-- 输入昵称 -->
      <div class="w-full flex">
        <div class="relative flex w-auto h-10 mx-auto">
          <div>
            <img :src="publicUrl + 'images/spUI/输入昵称.png'" alt="" />
          </div>
          <!-- <div class=" w-20 self-center ">{{ language.content.enterUserName }}:</div> -->
          <input
            ref="nickNameInput"
            class="absolute left-44 bg-transparent h-full w-36 outline-none"
            v-model="userName"
            :placeholder="language.content.enterUserName"
            @keyup.enter="ClickeSelectOK"
          />
        </div>
      </div>
      <div v-if="canVR">支持VR</div>
    </div>

    <!-- 确定按钮 -->
    <div
      class="absolute z-50 right-0 xl:bottom-7 bottom-1 flex pointer-events-none"
    >
      <div
        class="pointer-events-auto origin-right mt-10 xl:mt-0 cursor-pointer inline-block transform scale-30 xl:scale-75 translate-y-8"
        @click="ClickeSelectOK()"
      >
        <img
          class="w-full h-full"
          :src="publicUrl + 'images/spUI/进入元宇宙.png'"
          alt=""
        />

        <!-- <div class="  px-3  self-center mx-auto   ">
                {{ language.content.selectOK }}
              </div> -->
      </div>
    </div>
  </div>

  <!-- <div class=" absolute z-40 left-0 top-0 w-full h-full pointer-events-none">
        <div class=" w-20 h-20 pointer-events-auto" @click="ClearModel()"> 清除模型 </div>
      </div> -->
</template>

<script>
//角色动作数据
import PlayerAnimData from "../data/playerAnimSetting.js";

import playerSelect3DPanel from "./playerSelect3DPanel.vue";

export default {
  name: "index",
  props: ["userName"],
  components: {
    playerSelect3DPanel,
  },
  data() {
    return {
      language: {
        content: {
          enterUserName: "输入昵称",
          selectOK: "进入元宇宙",
          selectScene: "选择场景",
        },
      },

      // 皮肤弹出框的角色选项
      modelsList: [],

      selectPlayerId: "机器人",
      selectSceneName: "scene1",

      // 角色选择界面的角色信息
      playerImgPath: [],
      sceneImgPath: [],

      publicUrl: "",
      userName: "",
    };
  },
  created() {
    this.avatarData = PlayerAnimData;

    // // this.language = this.$parent.language;
    // this.language.content.selectOK = "进入元宇宙";
    // this.language.content.selectScene = "选择场景";
  },

  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;

    this.sceneImgPath = this.avatarData.sceneList;

    this.modelsList = this.avatarData.modelsList;
    this.roomName = this.avatarData.roomName;
    this.selectPlayerId = this.avatarData.defaultUser.avatarId;
    this.userName = this.avatarData.defaultUser.userName;
    this.publicUrl = this.$publicUrl + PlayerAnimData.localPath;

    if (localStorage.getItem("avatarId")) {
      this.selectPlayerId = localStorage.getItem("avatarId");
    }
    if (localStorage.getItem("userName")) {
      this.userName = localStorage.getItem("userName");
    }

    //输入框重新获取焦点
    this.$refs.nickNameInput.focus();

    this.$refs.playerSelect3DPanel.SetPlayerAnimData(PlayerAnimData.avatarData);
    this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerId);

    this.$refs.playerSelect3DPanel.ChangeSkinCompleted();

    window.addEventListener("keydown", this._onKeyDown);
  },
  methods: {
    _onKeyDown(event) {
      // console.log(event.code);
      switch (event.code) {
        case "Enter":
          this.ClickeSelectOK();
          break;
        case "NumpadEnter":
          this.ClickeSelectOK();
          break;
      }
    },

    GetPublicUrl() {
      return this.publicUrl;
    },
    SelectScene(e) {
      this.selectSceneName = e;
      this.$parent.SelectScene(this.selectSceneName);
    },
    GetAvatarData(folderBase) {},
    SelectAvatar(e) {
      this.selectPlayerId = e;
      // console.log("this.selectPlayerId = " + this.selectPlayerId);
      //加载3d模型
      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerId);
      this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
    },
    ClickeSelectOK() {
      if (this.selectPlayerId == "") {
        return;
      }
      if (this.userName == "") {
        return;
      }
      window.removeEventListener("keydown", this._onKeyDown);

      localStorage.setItem("avatarId", this.selectPlayerId);
      localStorage.setItem("userName", this.userName);
      // _Global.reloadTimes = 1;

      this.$parent.ClickSelectPlayerOK(this.selectPlayerId, this.userName);
      this.$refs.playerSelect3DPanel.Close();

      // this.importAmmoJS();

      // this.$router.push({
      //   path: "/multifarm/" + this.userName
      // });
    },
    importAmmoJS() {
      var script = document.createElement("script");
      var head = document.getElementsByTagName("head")[0];
      script.src = "./public/threeJS/ammo/ammo.wasm.js";
      head.appendChild(script);
    },
  },
};
</script>

<style >
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.scale-30 {
  --tw-scale-x: 0.3;
  --tw-scale-y: 0.3;
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
