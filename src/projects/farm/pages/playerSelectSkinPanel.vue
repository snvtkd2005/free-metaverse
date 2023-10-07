

// 游戏开始前的 角色选择界面. 换装
<template>
  <div class="  absolute  top-0 left-0 z-10 w-full h-full bg-gray-400">
    <img class=" w-full h-full " :src="publicUrl + 'images/spUI/bg.png'" alt="">
  </div>
  <div class="  absolute top-0 left-0 cutimg overflow-hidden">
    <canvas id="nowcanvas" class="bg-white"> </canvas>
  </div>
  <!-- 角色选择 和 场景选择 -->
  <div class="absolute top-2 xl:top-10 left-2 xl:left-32 z-60 w-64 xl:w-auto h-1/2  ">
    <!-- 角色皮肤选择 -->
    <div class="
                                            xl:w-auto
                                            w-auto
                                            h-auto  
                                            self-center
                                            mx-auto 
                                          ">
      <!-- 列表 -->
      <div class="
   
                                               flex-row
                                              w-full
                                             max-w-2xl
                                             h-auto
                                             gap-3 xl:gap-0
                                              xl:h-2/3
                                             justify-items-start text-white
                                            ">
        <div v-for="(item, i) in skinData" :key="i" :index="item.img" class="
                                                w-auto h-20
                                            xl:w-auto xl:h-auto
                                                self-center
                                                mx-auto 
                                                flex-row
                                               relative
                                               mb-3 xl:mb-10
                                              ">

          <div class=" text-left self-center mx-auto text-base xl:text-3xl">
            {{ item.content }}
          </div>
          <div class=" mt-px xl:mt-4 flex gap-5 ">

            <div v-for="(item2, i2) in item.icon" :key="i2" class="
                                                w-16 h-16
                                            xl:w-32 xl:h-32
                                             transform
                                               hover:scale-110
                                                self-center
                                                mx-auto 
                                                cursor-pointer
                                                flex
                                               relative
                                               rounded-full
                           
                                              " :class="item.selected == i2 ? 'bg-green-400' : 'bg-gray-400'"
              @click="ClickChangeSkin(item, i2)">

              <div class="  w-full h-full self-center mx-auto">
                <img class=" rounded-full p-1 w-full h-full " :src="publicUrl + item2" alt="">
                <!-- {{ item2 }} -->
              </div>


            </div>
          </div>

        </div>
      </div>
    </div>

  </div>


  <!-- 右侧角色模型展示 -->
  <div class="  absolute z-20 right-0 top-0 w-1/2 xl:w-1/2 h-full overflow-hidden   ">
    <!-- <div id="contain" class="w-full h-full  " ref="YJ3dscene"></div> -->
    <playerSelect3DPanel id="contain" class=" w-full h-full " ref="playerSelect3DPanel"></playerSelect3DPanel>

  </div>



  <!-- 昵称输入框 -->
  <div
    class="   absolute z-20 left-0 bottom-5  xl:bottom-32 w-1/2  xl:w-1/2 transform translate-x-1/2 xl:translate-x-full ">
    <!-- 输入昵称 -->
    <div class=" w-full flex">
      <div class=" relative flex w-auto h-10  mx-auto">
        <div>
          <img :src="publicUrl + 'images/spUI/输入昵称.png'" alt="">
        </div>
        <!-- <div class=" w-20 self-center ">{{ language.content.enterUserName }}:</div> -->
        <input ref="nickNameInput" class=" absolute left-44
       
                          bg-transparent 
                          h-full
                          w-36
                          outline-none
                        " v-model="userName" :placeholder="language.content.enterUserName"
          @keyup.enter="ClickeSelectOK" />
      </div>
    </div>
    <div v-if="canVR">支持VR</div>
  </div>

  <!-- 确定按钮 -->
  <div class=" absolute z-50 right-0 xl:bottom-7 bottom-1  flex pointer-events-none">

    <div class=" pointer-events-auto origin-right
                       mt-10 xl:mt-0
                      cursor-pointer
                    inline-block transform scale-30 xl:scale-75   translate-y-8
                    " @click="ClickeSelectOK()">
      <img class=" w-full h-full" :src="publicUrl + 'images/spUI/进入元宇宙.png'" alt="">

    </div>
  </div>
</template>

<script>


//角色动作数据
import PlayerAnimData from "../data/playerAnimSkinSetting.js";

import playerSelect3DPanel from "./playerSelect3DPanel.vue";



export default {
  name: "index",
  props: ["userName"],
  components: {
    playerSelect3DPanel,

  },
  data() {
    return {
      skinData: {},

      language: {
        content: {
          enterUserName: "输入昵称",
          selectOK: "进入元宇宙",
          selectScene: "选择场景",
        }
      },
      // 皮肤弹出框的角色选项
      modelsList: [],

      selectPlayerName: "机器人",
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
    // this.playerImgPath = this.avatarData.playerImgPath;
    // this.sceneImgPath = this.avatarData.sceneList;
    // this.modelsList = this.avatarData.modelsList;
    this.selectPlayerName = this.avatarData.defaultUser.avatarName;

    this.publicUrl = this.$publicUrl + PlayerAnimData.localPath;

    if (localStorage.getItem("avatarName")) {

    }
    if (localStorage.getItem("userName")) {
      this.userName = localStorage.getItem("userName");
    }

    //输入框重新获取焦点
    this.$refs.nickNameInput.focus();

    this.$refs.playerSelect3DPanel.SetPlayerAnimData(PlayerAnimData.avatarData);
    this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);

    // window.addEventListener('keydown', this._onKeyDown);
    let avatarData = this.GetAvatarData(this.selectPlayerName);
    this.skinData = avatarData.skinData;
    // console.log(this.skinData);

    setTimeout(() => {
      // this.$refs.playerSelect3DPanel.ResetToTPose();
      // setTimeout(() => {
      //   this.$refs.playerSelect3DPanel.GetFaceModel();
      // }, 100);
      setTimeout(() => {
        this.$refs.playerSelect3DPanel.ChangeAnimDirect("idle");

        setTimeout(() => {
          // this.ClickChangeSkin(this.skinData[1], 0);
          this.UpdateSkin(localStorage.getItem("playerState"));
        }, 100);
      }, 100); 
    }, 100);

    window.addEventListener('keydown', this._onKeyDown);
    

  },
  methods: {
    
    _onKeyDown(event) {
      // console.log(event.code);
      switch (event.code) {
        case 'Enter':
          this.ClickeSelectOK();
          break;
        case 'NumpadEnter':
          this.ClickeSelectOK();
          break;

      }
    },
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
      this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, part, mode, faceSourcePath);
      if (part == "eye") {
        this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, "Face", mode, faceSourcePath);
        this.$refs.playerSelect3DPanel.ChangeSkin(faceAddPath, "Face", "addTexture", faceSourcePath);
      }

      localStorage.setItem("playerState", state);
      // console.log(targetPath);
    },
    UpdateSkin(playerState) {
      if(playerState==null || playerState==undefined){
        this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        return;
      }
      let sp = playerState.split('_');
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
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, "Face", element.mode, faceSourcePath);
          this.$refs.playerSelect3DPanel.ChangeSkin(faceAddPath, "Face", "addTexture", faceSourcePath);
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          this.$refs.playerSelect3DPanel.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
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
    },

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
      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerName);

    },
    ClickeSelectOK() {
      if (this.selectPlayerName == "") {
        return;
      }
      if (this.userName == "") {
        return;
      }
      window.removeEventListener('keydown', this._onKeyDown);

      localStorage.setItem("avatarName", this.selectPlayerName);
      localStorage.setItem("userName", this.userName);
      // _Global.reloadTimes = 1;

      this.$parent.ClickSelectPlayerOK(this.selectPlayerName, this.userName);
      this.$refs.playerSelect3DPanel.Close();

    },
    importAmmoJS() {
      var script = document.createElement('script');
      var head = document.getElementsByTagName('head')[0];
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
  --tw-scale-x: .3;
  --tw-scale-y: .3;
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
