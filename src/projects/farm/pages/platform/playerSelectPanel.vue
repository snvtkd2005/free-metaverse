


<template>
  <div v-if="inSelecting" class=" relative w-full h-full pointer-events-auto ">
    <!-- 角色选择 和 场景选择 -->
    <div
      class=" w-1/2 h-full bg-gray-500"
    >
      <!-- 角色选择 -->
      <div class="xl:w-auto w-auto h-auto self-center mx-auto">
        <div class="flex mb-2 xl:mb-5 origin-top-left w-32 xl:w-auto">
          <!-- <img :src="publicUrl + 'images/spUI/yuanzhe1.png'" alt="" /> -->

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
            :index="item.folderBase"
            class="w-16 h-16 xl:w-32 xl:h-32 rounded-full transform hover:scale-110 self-center mx-auto cursor-pointer flex relative"
            :class="selectPlayerId == item.folderBase ? ' ' : ' '"
            @click="SelectAvatar(item)"
          >
            <div class="self-center mx-auto w-full h-full rounded-full">
              <img class="w-full h-full rounded-full object-fill" :src="$uploadUrl + item.icon" />
            </div>
            <div
              v-if="selectPlayerId == item.folderBase"
              class="absolute bottom-0 right-0"
            >
              <img
                class="w-4 h-4 xl:w-full xl:h-full object-fill"
                :src="publicUrl + 'images/select.png'"
              />
            </div>
          </div>
        </div>
        
        <!-- 角色介绍 -->
        <div class=" mt-5 text-left px-5 w-full text-white">
          {{playerTip}}
        </div>
      </div>
    </div>

    <!-- 右侧角色模型展示 -->
    <div
      class="absolute z-20 right-0 top-0 w-1/2 xl:w-1/2 h-full overflow-hidden"
    >
      <playerSelect3DPanel
        id="contain"
        class="w-full h-full"
        ref="playerSelect3DPanel"
      ></playerSelect3DPanel>
    </div>

    <!-- 昵称输入框 -->
    <div
      class="absolute z-20 right-0  w-1/2 bottom-5    "
    >
      <!-- 输入昵称 -->
      <div class="w-full flex">
        <div class="relative flex w-auto h-6 mx-auto">
          <!-- <div>
            <img :src="publicUrl + 'images/spUI/输入昵称.png'" alt="" />
          </div> -->
          <!-- <div class=" w-20 self-center ">{{ language.content.enterUserName }}:</div> -->
          <input
            ref="nickNameInput"
            class="  bg-black bg-opacity-30 text-white pl-1   h-full w-36 outline-none"
            v-model="userName"
            :placeholder="language.content.enterUserName"
            @keyup.enter="ClickeSelectOK"
          />
        </div>
      </div>
      <div v-if="canVR">支持VR</div>
    </div>

    <!-- 确定按钮 -->
    <div class="absolute z-50 right-0 w-full   -bottom-10 flex " >
      <div
        class="pointer-events-auto bg-blue-300 mx-auto w-32 cursor-pointer rounded-md  "
        @click="ClickeSelectOK()"
      >
        <!-- <img
          class="w-full h-full"
          :src="publicUrl + 'images/spUI/进入元宇宙.png'"
          alt=""
        /> -->

        <div class="  px-3  self-center mx-auto   ">
            进入游戏
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import playerSelect3DPanel from "./playerSelect3DPanel.vue";

export default {
  name: "playerSelectPanel",
  components: {
    playerSelect3DPanel,
  },
  data() {
    return {
      inSelecting:false,
      language: {
        content: {
          enterUserName: "输入昵称",
          selectOK: "进入元宇宙",
          selectScene: "选择场景",
        },
      },
      selectPlayerId: "机器人",
      // 角色选择界面的角色信息
      playerImgPath: [],
      userName: "",
      publicUrl: "./public/",
      playerTip:"hhhhhhhhhhhhhhhhhhhhhhhh",
    };
  },
  created() {},

  mounted() {

    if (localStorage.getItem("userName")) {
      this.userName = localStorage.getItem("userName");
    }

    window.addEventListener("keydown", this._onKeyDown);

  },
  methods: {
    init(_avatarList) { 
      this.inSelecting = true;
      this.$nextTick(()=>{ 
        this.playerImgPath = _avatarList;  
        this.avatarItem = this.playerImgPath[0];
        this.selectPlayerId = this.avatarItem.folderBase;
        this.playerTip = this.avatarItem.tip;
        //输入框重新获取焦点
        this.$refs.nickNameInput.focus();
        this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerId,(_YJPlayer)=>{
          this.ChangeEquip(_YJPlayer);
          this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        }); 
      });
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
    ChangeEquip(_YJPlayer){
      let _YJ3dScene = this.$refs.playerSelect3DPanel._YJ3dScene;
      _YJ3dScene.GetEquip().UpdateData();
        let equipList = this.avatarItem.equipList;
        for (let i = 0;equipList && i < equipList.length; i++) {
          _YJ3dScene.GetEquip().addEquip({ assetId:  equipList[i] });
        } 
    },
    SelectAvatar(e) {
      this.avatarItem = e;
        this.playerTip = this.avatarItem.tip;
      this.selectPlayerId = e.folderBase;
      console.log("this.avatarItem = ", this.avatarItem);
      let _YJ3dScene = this.$refs.playerSelect3DPanel._YJ3dScene;
      _YJ3dScene.GetEquip().Clear();
      //加载3d模型
      this.$refs.playerSelect3DPanel.SelectAvatar(this.selectPlayerId,(_YJPlayer)=>{
        this.ChangeEquip(_YJPlayer);
        setTimeout(() => {
          this.$refs.playerSelect3DPanel.ChangeSkinCompleted();
        }, 500);
      });
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

      this.$parent.ChangeAvatar(this.avatarItem,this.userName);
      this.inSelecting = false;

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
