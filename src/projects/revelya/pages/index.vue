
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <ThreejsHumanChat
    id="ThreejsHumanChat"
    tabindex="-1"
    class="absolute left-0 top-0"
    ref="ThreejsHumanChat"
  />

  <!-- 加载页 -->
  <!-- <LoadingPage
    v-if="!inThreejs"
    class="absolute z-40 left-0 top-0 pointer-events-none"
    :start="loadCompleted"
    ref="LoadingPage"
  /> -->

  <!-- v-if="niaokanUI" -->
  <MenuPage class="absolute z-40 left-0 top-0" ref="MenuPage" />

  <loadingPanel
    class="absolute z-50 left-0 top-0 pointer-events-none"
    ref="loadingPanel"
  />

  <!-- 小地图透明按钮 -->
  <!-- <div v-if="avatarData.setting.hasMinMap" class="absolute z-20 left-0 bottom-8 w-full pointer-events-none">
    <div class="mx-auto w-60 h-36 bg-transparent pointer-events-auto" @click="ClickNiaokan()"></div>
  </div> -->

  <!-- <minMapEditor v-if="avatarData.setting.inMinMapEditor" /> -->

  
  <!--  -->
  <div
    v-if="avatarData.setting.has2dMinMap"
    v-show="displayMinMap"
    class="
      absolute
      transform -left-32
      -bottom-32 md:left-0 md:bottom-0
      scale-50
      w-96
      h-96
      md:scale-100
    "
    @click="ClickNiaokan()"
  >
    <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
  </div>

  <!-- <div v-if="avatarData.setting.has2dMinMap" class="
      absolute
      left-1/2
      bottom-10
      w-96
      h-96
      transform 
      scale-100
    "
    @click="ClickNiaokan()" 
    > 
    <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
  </div> -->

  <!-- <div
    v-if="avatarData.setting.has2dMinMap"
    class="
      absolute
      left-1/2
      bottom-0
      w-96
      h-48
      transform
      -translate-x-48
      scale-75
    "
    @click="ClickNiaokan()"
  >
    <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
  </div> -->

  <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
  <div v-if="isMobile && contrlState == 0">
    <JoystickLeftPanel class="" ref="JoystickLeftPanel" />
    <!-- <JoystickRightPanel class="" ref="JoystickRightPanel" /> -->
  </div>

  <div
    v-show="displayMinMap"
    class="
      absolute
      flex
      right-5
      bottom-5
      w-auto
      h-10
      rounded-full
      shadow-md
      bg-gray-100
      cursor-pointer
    "
    @click="ChangeViewFar"
  >
    <div class="px-2 self-center mx-auto">
      ViewFar
      <!-- {{viewFarIndex==0?'距离':viewFarIndex==0'近距离'}} -->
    </div>
  </div>

  <!-- <div class="absolute left-0 top-0 w-full h-full flex">
    <div></div>
  </div> -->

  <!-- 弹窗，iframe 嵌入网页 -->
  <!-- v-if="isInsertPanel" -->

  <div
    v-if="hidden"
    class="hidden absolute z-50 w-full h-full"
    style="backdrop-filter: blur(13px)"
  >
    <div
      class="
        h-1/2
        w-1/2
        self-center
        mx-auto
        p-2
        bg-white
        rounded-md
        shadow-md
        text-red-900 text-xl
        relative
      "
    >
      <!-- 内容 -->
      <div class="w-full h-full self-center mx-auto overscroll-auto">
        <iframe id="iframeA" src="https://www.eastart.tokyo/" frameborder="0">
        </iframe>
      </div>

      <!-- 关闭按钮 -->
      <div
        @click="isInsertPanel = false"
        class="
          pointer-events-auto
          flex
          bg-gray-100
          rounded-full
          shadow-md
          w-10
          h-10
          absolute
          -right-2
          -top-2
          cursor-pointer
        "
      >
        <div class="self-center mx-auto">X</div>
      </div>
    </div>
  </div>

  <!-- <div v-if="isInsertPanel">

    <Dialog></Dialog>
  </div> -->

  <!-- 鸟瞰2d点位 -->
  <div
    v-if="niaokanUI"
    class="absolute left-0 top-0 z-10 w-full h-full pointer-events-none"
  >
    <div>
      <div
        v-for="(item, i) in projectionList"
        :key="i"
        :index="item.id"
        class="text-xl flex cursor-pointer pointer-events-auto  "
        :style="
          ' position:absolute; left:' +
          (item.pos.x - 48) +
          'px;top:' +
          (item.pos.y - 12) +
          'px'
        "
        @click="ClickProjectionId(item.id)"
      >
      
        <!-- :style="' position:absolute; left:'+item.pos.x+'px;top:'+i*100+'px'" -->
        <div
          class="w-32 h-14 -mt-10 -ml-5  bg-opacity-80 rounded-xl flex text-white relative "
        >
          <div class=" absolute left-16 -top-10 z-0 w-32 h-24  " >
            <img class=" w-full h-full " :src="$publicUrl + 'revelya/img/textbg.png'" alt="">
          </div>
          <!-- <div class=" w-full absolute left-16 -top-9 p-1 z-10 self-center mx-auto text-center text-base ">
            {{  item.content + " " }}
          </div> -->

          <div class=" w-full absolute left-16 -top-9 p-1 z-10 self-center mx-auto text-center text-base flex font-bold  ">
            <div class=" mx-auto flex ">
              <div class=" text-yellow-600 ">{{ item.content.substring(0,1)}}</div>
              <div class="  ">{{  item.content.substring(1,item.content.length) + " " }}</div>

            </div>
              <div class=" absolute top-1/2 -mt-1 right-2 w-2 h-2 self-center  ">
                <img class=" w-full h-full " :src="$publicUrl + 'revelya/img/rightArrow2.png'" alt="">
              </div>
          </div>
          
            <!-- {{ item.id+' ' + item.pos.x + " " + item.pos.y }} -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 三维页
import ThreejsHumanChat from "/@/threeJS/threeSHJKGChat.vue";

import { nextTick } from "@vue/runtime-core";
import minMapEditor from "/@/views/chat/minMapEditor.vue";
import map2d from "/@/views/chat/map2d.vue";

// 摇杆
import JoystickLeftPanel from "./joystickLeft.vue";
// import JoystickRightPanel from "/@/views/chat/joystickRight.vue";

// 加载进度页
import loadingPanel from "../components/Loading.vue";
import Dialog from "../components/Dialog.vue"; 

import LoadingPage from "./LoadingPage.vue";
import MenuPage from "./MenuPage.vue";

// revelya
import AvatarData from "../data/sceneSetting.js";
// import AvatarData2 from "/@/data/playerSelectRevelya2.js";

import Language from "/@/data/zh_cn.js";

import { GetDateH } from "/@/utils/utils.js";

import { Interface_ThreeBase } from "/@/threeJS/Interface_ThreeBase.js";

export default {
  name: "index",
  components: {
    ThreejsHumanChat,
    minMapEditor,
    loadingPanel,
    JoystickLeftPanel,
    // JoystickRightPanel,
    map2d,
    LoadingPage,
    MenuPage,
    Dialog,
  },
  data() {
    return {
      // 是否显示姓名条
      displayUserNameUI: false,

      //是否可交互的提示
      jiaohuTip: false,

      //房间名
      roomName: "",
      platform: "",
      selectPlayerName: "",
      playerImgPath: [],

      //角色同步数据
      user: {
        pos: [-100, -100, 0],
        rota: [0, 0, 0],
        rotateY: 1,
        animName: "idle",
        playerData: {},
        userData: {},
      },

      userName: "",
      userId: "",
      id: "",
      //姓名条
      hotPoint: [],

      pos: { x: -100, y: -100 },

      isMobile: false,

      playerDefaultX: 0,
      playerDefaultY: 0,

      language: null,
      isEn: false,
      avatarData: null,
      contrlState: 0,

      loadCompleted: false,

      windowWidth: 0,
      windowHeight: 0,
      // 是否已进入3d页面
      inThreejs: false,

      viewFarIndex: 2,
      viewFar: [0, -8, -16],

      isInsertPanel: false,
      displayMinMap: true,

      niaokanUI: false,
      projectionList: [ 

        { id: "10000", content: "COMPANY", pos: { x: -500, y: -500 } },
        { id: "10001", content: "ABOUT US", pos: { x: -500, y: -500 } },
        { id: "10002", content: "RECRUIT", pos: { x: -500, y: -500 } },
        { id: "10003", content: "BUSINESS", pos: { x: -500, y: -500 } },
        { id: "10004", content: "NEWS", pos: { x: -500, y: -500 } },
        { id: "10005", content: "NFT CENTER", pos: { x: -500, y: -500 } },
        { id: "10006", content: "DEX CENTER", pos: { x: -500, y: -500 } },
      ],
      oldDialogId: "",

    };
  },

  created() {
    this.avatarData = AvatarData;

    this.displayMinMap = !this.avatarData.setting.hasAerialView;

    // if (this.avatarData.setting.changeScene) {

    //   let hour = GetDateH();
    //   console.log(hour);
    //   if (hour < 18) {
    //     this.avatarData = AvatarData;
    //   } else {
    //     // this.avatarData = AvatarData2;
    //   }
    // }

    this.language = Language.languageCN;
    // this.language = Language.languageEN;

    // this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;
    this.roomName = this.avatarData.roomName;
    this.selectPlayerName = this.avatarData.defaultUser.avatarName;
    this.contrlState = this.avatarData.setting.contrlState;

    document.title = this.avatarData.setting.title;

    //跳过角色选择，直接加载场景
    this.ClickeSelectOK();

    this.CheckInMobile();
    if (this.isMobile) {
      this.InitJoytick();
    }

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    setInterval(() => {
      this.UpdateCheckWindowResize();
    }, 20);

    this.threeInterface = new Interface_ThreeBase(this);

  },
  methods: {
    SetMinMapDisplay(b){
      this.displayMinMap = b;
    },
    // 3转2坐标
    UpdateProjectionUI(_projectionList) {
      // this.projectionList=[];
      // this.projectionList = _projectionList;
      for (let i = 0; i < _projectionList.length; i++) {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          if (_projectionList[i].id == this.projectionList[ii].id) {
            this.projectionList[ii].pos = _projectionList[i].pos;
          }
        }
      }
      // console.log(" 3转2 ",_projectionList);
    },
    ClickProjectionId(id) {
      this.oldDialogId = id;
      // this.oldDialogId =hotPointData.id;

      this.HotPointFn(
        this.$refs.ThreejsHumanChat._YJSceneManager.GetHotPointDataById(id)
      );
    },
    SetViewState(e) {
      this.displayMinMap = e == "人视";
      this.niaokanUI = e == "鸟瞰";

      if (e == "人视") {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          this.projectionList[ii].pos.x = -500;
          this.projectionList[ii].pos.y = -500;
        }
        this.isInsertPanel = true;
        this.$refs.MenuPage.LoadDialog(this.oldDialogId);
      }
      if (e == "鸟瞰") {
        this.onWindowResize();
      }
    },
    UpdateCheckWindowResize() {
      if (
        this.windowWidth == window.innerWidth &&
        this.windowHeight == window.innerHeight
      ) {
      } else {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.onWindowResize();
      }
    },
    // 浏览器窗口变动触发的方法
    onWindowResize() {
      this.$refs.ThreejsHumanChat.onWindowResize(
        this.windowWidth,
        this.windowHeight
      );

      if (!this.isMobile) {
        return;
      }
      if (this.isMobile && this.contrlState == 0) {
        this.$refs.JoystickLeftPanel.ResizeJoystick();
      }
    },
    CreateHotContent(modelData) {
      console.log(" modelData  ", modelData);
      this.isInsertPanel = true;
      this.oldDialogId = modelData.id;
      this.$refs.MenuPage.LoadDialog(this.oldDialogId);

      this.threeInterface.ClickHotpointHandler( modelData.id);
    },
    ClickHotPointOwner(hitObject) {
      let hotPointData = hitObject.owner.GetHotPointData();
      this.HotPointFn(hotPointData);
      console.log(" hotpointdata  ", hotPointData);
    },
    HotPointFn(hotPointData) {
      console.log("热点信息为 ", hotPointData);
      if (hotPointData == null) {
        return;
      }
      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {
          this.$refs.ThreejsHumanChat._YJSceneManager.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );
          //视角拉近
          this.$refs.ThreejsHumanChat.YJController.ChangeToPersonView();
          this.$refs.ThreejsHumanChat.YJController.ChangeCameraToFar();
          this.viewFarIndex = 2;
        }
      }
    },

    ChangeViewFar() {
      this.viewFarIndex++;
      if (this.viewFarIndex >= this.viewFar.length) {
        this.viewFarIndex = 0;
      }
      let far = this.viewFar[this.viewFarIndex];
      this.$refs.ThreejsHumanChat.YJController.SetCameraWheelPos(far);

      // this.viewFar = !this.viewFar;
      // this.$refs.ThreejsHumanChat.YJController.ChangeCameraFar();
    },

    ChangeScene(e) {
      if (e == "scene1") {
        this.avatarData = AvatarData;
      }
      if (e == "scene2") {
        this.avatarData = AvatarData2;
      }
    },
    // 判断是否在移动端
    CheckInMobile() {
      var UserClient = navigator.userAgent.toLowerCase();
      // console.log(" 判断是否移动端 ", UserClient);
      var IsIPad = UserClient.indexOf("ipad") > -1;
      var IsIphoneOs = UserClient.indexOf("iphone") > -1;
      var IsMidp = UserClient.indexOf("midp") > -1;
      var IsUc7 = UserClient.indexOf("rv:1.2.3.4") > -1;
      var IsUc = UserClient.indexOf("ucweb") > -1;
      var IsAndroid = UserClient.indexOf("android") > -1;
      var IsCE = UserClient.indexOf("windows ce") > -1;
      var IsWM = UserClient.indexOf("windows mobile") > -1;
      var IsM = UserClient.indexOf("mobile") > -1;
      // console.log(IsIPad,IsIphoneOs,IsMidp,IsUc7,IsUc,IsAndroid,IsCE,IsWM,IsM,);
      if (
        IsIPad ||
        IsIphoneOs ||
        IsMidp ||
        IsUc7 ||
        IsUc ||
        IsAndroid ||
        IsCE ||
        IsM ||
        IsWM
      ) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
      //*/
    },

    GetPublicUrl() {
      // this.$publicUrl += this.avatarData.setting.localPath;
      return this.$publicUrl + this.avatarData.setting.localPath;
    },
    GetAvatarData(playerName) {
      for (let i = 0; i < this.avatarData.avatarData.length; i++) {
        if (this.avatarData.avatarData[i].name == playerName) {
          return this.avatarData.avatarData[i];
        }
      }
      return null;
    },
    //获取场景scene.txt 文本路径
    GetSceneTexPath() {
      return this.avatarData.sceneTexPath;
    },
    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.avatarData.minMapData;
      return minMapData;
    },
    // 用鸟瞰参数设置鸟瞰的坐标
    GetNiaokanData() {
      // let niaokanData = this.avatarData.aerialViewData;
      // this.$refs.ThreejsHumanChat.YJController.SetNiaokanPos(
      //   niaokanData.niaokanCamPos,
      //   niaokanData.niaokanCamLookatPos
      // );
    },
    //#region
    //#endregion
    ClickNiaokan() {
      this.$refs.ThreejsHumanChat.YJController.ResetToNiaokanView();
    },

    SetMinMap(sx, sy, ox, oy) {
      this.$refs.ThreejsHumanChat._YJSceneManager.SetMinMap(sx, sy, ox, oy);
    },
    SetCamPos(x, y, z, lx, ly, lz) {
      this.$refs.ThreejsHumanChat.YJController.SetCamNiaokanPos(
        x,
        y,
        z,
        lx,
        ly,
        lz
      );
    },
    //#region 虚拟摇杆

    InitJoytick() {
      // console.log("正在移动端设备运行 ");
      var that = this;
      // document
      //   .getElementById("jumpBtn")
      //   .addEventListener("touchstart", function () {
      //     that.ClickJump();
      //   });
    },

    //#endregion

    //threejs页面传入，碰到交互物体时显示提示文字
    ChangeTip(b) {
      this.jiaohuTip = b;
    },
    ClickeSelectOK() {
      this.user.playerData = this.playerImgPath[0];
      for (let i = 0; i < this.playerImgPath.length; i++) {
        if (this.selectPlayerName == this.playerImgPath[i].name) {
          this.user.playerData = this.playerImgPath[i];
          continue;
        }
      }

      var userData = {
        userName: this.userName,
        roomName: this.roomName,
        platform: this.user.playerData.platform,
        modelType: this.user.playerData.name,
      };
      this.$refs.ThreejsHumanChat.InitThreejs(this, userData);
    },

    LoadingState(state) {
      this.$refs.loadingPanel.LoadingState(state);
    },

    LoadState(state) {
      this.$refs.loadingPanel.LoadState(state);
    },
    LoadingProcess(process) {
      this.loadCompleted = process == 100;
      this.$refs.loadingPanel.LoadingProcess(process);
    },

    OpenThreejs() {
      this.inThreejs = true;

      this.$refs.ThreejsHumanChat._YJSceneManager.BeginEnter();

      if (
        this.avatarData.setting.InfinityMouse != undefined &&
        this.avatarData.setting.InfinityMouse
      ) {
        this.$refs.ThreejsHumanChat.SetPointerLock();
      }

      // 改变鼠标光标图标
      let cursorUrl = this.avatarData.setting.cursorUrl;
      if (cursorUrl != "") {
        document.body.style.cursor =
          "url(" + this.GetPublicUrl() + cursorUrl + "),auto"; //显示手型光标
      }
    },

    // 移动端点击跳跃按钮
    ClickJump() {
      this.$refs.ThreejsHumanChat.ClickJump();
    },
    //点击按钮 交互门
    ClickInteractive() {
      this.$refs.ThreejsHumanChat.ClickInteractive();
    },

    //在输入聊天信息时，取消threejs的键盘监听。
    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      this.$refs.ThreejsHumanChat.removeEventListener();
    },
    addThreeJSfocus() {
      this.$refs.ThreejsHumanChat.threeJSfocus();
    },
  },
};
</script>

<style scoped>
/* 解决ios和android下触摸元素时出现半透明灰色遮罩 */
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

#iframeA {
  /* position: absolute; */
  transform: scale(0.5, 0.5) translate(-50%, -50%);
  width: 200%;
  height: 200%;
  /* top: 0;
  left: 0; */
  /* background: rgba(29, 29, 31, 0.72);
backdrop-filter: saturate(180%) blur(20px); */
}

.bg-iframeA {
  /* backdrop-filter: saturate(180%) blur(20px); */
  filter: blur(20px);
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
</style>
