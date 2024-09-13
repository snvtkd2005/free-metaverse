


<template>
  <div class="absolute top-0 left-0 z-10 w-full h-full bg-gray-400">
    <div class="absolute top-0 left-0 z-10 w-full h-full bg-gray-400">
      <img
        class="w-full h-full"
        :src="publicUrl + 'images/spUI/bg.png'"
        alt=""
      />
    </div>

    <div class="absolute top-0 left-0 cutimg overflow-hidden">
      <canvas id="nowcanvas" class="bg-white"> </canvas>
    </div>

    <!-- 角色换装选择  -->
    <div
      class="absolute z-30 right-0 top-0 w-1/2 xl:w-1/2 h-full overflow-hidden pointer-events-none"
    >
      <SkinPanel
        class="w-full h-full"
        ref="SkinPanel"
        :skinData="skinData"
      ></SkinPanel>
    </div>

    <!-- 角色选择 和 场景选择 -->
    <div
      class="absolute top-10 xl:top-10 left-10 xl:left-10 z-60 w-64 xl:w-auto h-1/2"
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
            :class="selectPlayerName == item.name ? ' ' : ' '"
            @click="SelectAvatar(item.name)"
          >
            <div class="self-center mx-auto">
              <img
                class="w-full h-full object-fill"
                :src="publicUrl + item.img"
              />
            </div>
            <div
              v-if="selectPlayerName == item.name"
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
          class="grid xl:grid-cols-3 xl:grid-rows-1 grid-cols-3 gap-2 xl:gap-8 w-full xl:w-full max-w-2xl xl:mt-10"
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
import SkinPanel from "./SkinPanel.vue";

export default {
  name: "index",
  props: ["userName"],
  components: {
    playerSelect3DPanel,
    SkinPanel,
  },
  data() {
    return {
      skinData: {},

      language: {
        content: {
          enterUserName: "输入昵称",
          selectOK: "进入元宇宙",
          selectScene: "选择场景",
        },
      },

      // 皮肤弹出框的角色选项
      modelsList: [],

      selectPlayerName: "机器人",
      selectSceneName: "scene1",

      // 角色选择界面的角色信息
      playerImgPath: [],
      sceneImgPath: [],

      publicUrl: "./public/farm/",
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
    this.userName = this.avatarData.defaultUser.userName;

    // this.publicUrl = this.$publicUrl + PlayerAnimData.localPath;

    if (localStorage.getItem("avatarName")) {
      this.selectPlayerName = localStorage.getItem("avatarName");
    }

    if (localStorage.getItem("userName")) {
      this.userName = localStorage.getItem("userName");
    }

    // if( this.selectPlayerName == undefined){
    //   this.selectPlayerName = this.avatarData.defaultUser.avatarName;
    // }

    console.log("  this.selectPlayerName =  ", this.selectPlayerName);

    //输入框重新获取焦点
    this.$refs.nickNameInput.focus();

    this.$refs.playerSelect3DPanel.SetPlayerAnimData(PlayerAnimData.avatarData);
    this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);

    setTimeout(() => {
      this.skinData = this.GetAvatarData(this.selectPlayerName).skinData;
      if (this.skinData != undefined && this.skinData.length > 1) {
        setTimeout(() => {
          this.UpdateSkin(localStorage.getItem("playerState"));
        }, 100);
      } else {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
      }
    }, 100);

    window.addEventListener("keydown", this._onKeyDown);
  },
  methods: {
    ClickChangeSkin(item, i2) {
      item.selected = i2;
      // console.log(" 切换皮肤 ", item.part);

      let mode = item.mode;
      let part = item.part;
      let targetPath = item.modelPath[i2];

      let faceSourcePath = "";
      let faceAddPath = "";
      let state = "";
      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }

        state += element.selected + "_";
      }
      // console.log(" 脸部原始贴图路径 ", faceSourcePath);
      //换装
      this.$refs.playerSelect3DPanel.ChangeSkin(
        targetPath,
        part,
        mode,
        faceSourcePath
      );
      if (part == "eye") {
        this.$refs.playerSelect3DPanel.ChangeSkin(
          targetPath,
          "Face",
          mode,
          faceSourcePath
        );
        this.$refs.playerSelect3DPanel.ChangeSkin(
          faceAddPath,
          "Face",
          "addTexture",
          faceSourcePath
        );
      }

      localStorage.setItem("playerState", state);
    },
    UpdateSkin(playerState) {
      if (playerState == null || playerState == undefined) {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        return;
      }

      let sp = playerState.split("_");
      for (let i = 0; i < this.skinData.length; i++) {
        this.skinData[i].selected = parseInt(sp[i]);
      }

      let mode = "";
      let part = "";
      let targetPath = "";

      let faceSourcePath = "";
      let faceAddPath = "";

      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }
      }

      for (let i = 0; i < this.skinData.length; i++) {
        const element = this.skinData[i];
        if (element.title == "eye") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            "Face",
            element.mode,
            faceSourcePath
          );
          this.$refs.playerSelect3DPanel.ChangeSkin(
            faceAddPath,
            "Face",
            "addTexture",
            faceSourcePath
          );
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(
            targetPath,
            element.part,
            element.mode,
            faceSourcePath
          );
        }
      }

      setTimeout(() => {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
      }, 200);
    },

    GetAvatarData(playerName) {
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      return [];
    },
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
      console.log("选择场景 ", e);
      this.$parent.SelectScene(this.selectSceneName);

      //场景选择。 如何选择彩虹城场景，在场景中加入汽车模型
      if (e == "scene3") {
        this.$refs.playerSelect3DPanel.LoadModel();
      } else {
        this.$refs.playerSelect3DPanel.DelModel();
      }
    },
    SelectAvatar(e) {
      this.selectPlayerName = e;
      // console.log("this.selectPlayerName = " + this.selectPlayerName);
      //加载3d模型
      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);
      this.skinData = this.GetAvatarData(this.selectPlayerName).skinData;
      if (this.skinData != undefined && this.skinData.length > 1) {
        setTimeout(() => {
          this.UpdateSkin(localStorage.getItem("playerState"));
        }, 100);
      } else {
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
      }
    },
    ClickeSelectOK() {
      if (this.selectPlayerName == "") {
        return;
      }
      if (this.userName == "") {
        return;
      }
      window.removeEventListener("keydown", this._onKeyDown);

      localStorage.setItem("avatarName", this.selectPlayerName);
      localStorage.setItem("userName", this.userName);
      // _Global.reloadTimes = 1;

      this.$parent.ClickSelectPlayerOK(this.selectPlayerName, this.userName);
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
