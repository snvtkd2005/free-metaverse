
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <YJmetaBase :avatarData="avatarData" ref="YJmetaBase" />

  <!-- 加载loading -->
  <loadingPanel class="absolute z-50 left-0 top-0" ref="loadingPanel" />

  <!-- 小地图透明按钮 -->
  <!-- <div v-if="avatarData.setting.hasMinMap" class="absolute z-20 left-0 bottom-8 w-full pointer-events-none">
    <div class="mx-auto w-60 h-36 bg-transparent pointer-events-auto" @click="ClickNiaokan()"></div>
  </div> -->


  <!-- <minMapEditor v-if="avatarData.setting.inMinMapEditor" /> -->

  <!-- <div v-if="avatarData.setting.has2dMinMap"  class=" absolute left-1/2 bottom-0 w-96 h-48 transform -translate-x-48 scale-75 "  @click="ClickNiaokan()">
      <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
  </div> -->

  <div v-if="avatarData.setting.has2dMinMap" v-show="displayMinMap"
    class=" absolute left-1/2 bottom-0 w-96 h-48 transform -translate-x-48 scale-75 " @click="ClickNiaokan()">
    <map2d ref="map2d" :inEditor="avatarData.setting.inMinMapEditor" />
  </div>


  <!-- 当在键鼠/遥感控制模式 并且在移动端时，显示左右遥感 -->
  <div v-if="isMobile && contrlState == 0">
    <JoystickLeftPanel class="  " ref="JoystickLeftPanel" />
    <!-- <JoystickRightPanel class=" " ref="JoystickRightPanel" /> -->
  </div>

  <!-- <div v-show="displayMinMap" class=" absolute flex right-5 bottom-5 w-auto h-10 rounded-full shadow-md bg-gray-100 cursor-pointer "
    @click="ChangeViewFar">
    <div class=" px-2 self-center mx-auto">
      ViewFar
    </div>
  </div> -->


  <!-- 鸟瞰2d点位 -->
  <div v-if="niaokanUI" class="absolute left-0 top-0 z-10 w-full h-full pointer-events-none">
    <div>
      <div v-for="(item, i) in projectionList" :key="i" :index="item.id" class=" text-xl flex" :style="
        ' position:absolute; left:' +
        (item.pos.x - 48) +
        'px;top:' +
        (item.pos.y - 12) +
        'px'
      ">
        <!-- :style="' position:absolute; left:'+item.pos.x+'px;top:'+i*100+'px'" -->
        <div class="
            w-32
            h-14
            bg-gray-800
           bg-opacity-80
            rounded-xl
            flex
            text-white
          ">
          <div class="  self-center
            mx-auto ">
            {{ item.content + ' ' }}
            <!-- {{ item.id+' ' + item.pos.x + " " + item.pos.y }} -->

          </div>
        </div>
      </div>
    </div>
  </div>


  <YJDync v-if="inLoadCompleted" ref="YJDync" />
  <!-- <modelBagList ref="modelBagList" /> -->
  <!-- 角色选择面板 -->
  <playerSelectPanel v-if="hasPlayerSelectPanel" :userName="userName" ref="playerSelectPanel" />


  <!-- 右上角 -->
  <div
    v-if="avatarData.setting.righttopBtn"
    class="absolute z-30 right-2 top-2"
  >
    <div class="h-auto flex gap-y-2 gap-x-2">
      <div
        class="cursor-pointer rounded-lg bg-white flex px-2"
        @click="ConnectFox()"
      >
        <div v-if="!hasAddress" class="w-8 h-8">
          <img class="w-full h-full" :src="$publicUrl + 'fox.png'" alt="" />
        </div>
        <p v-if="!hasAddress" class="h-8 leading-8 pr-2">Connect</p>
        <p v-if="hasAddress" class="h-8 leading-8 pr-2">{{ address }}</p>
      </div>

      <div
        class="hidden cursor-pointer rounded-full bg-gray-200"
        @click="ChangeLanguage()"
      >
        <p class="p-2">
          {{ isEn ? language.language.zh : language.language.en }}
        </p>
      </div>
    </div>
  </div>


</template>

<script>
// 三维页


// import YJDync from "/@/threeJS/YJDync.vue";
import YJDync from "./YJDync.vue";
import modelBagList from "/@/views/chat/modelBagList.vue";
import playerSelectPanel from "/@/views/chat/playerSelectPanel.vue";

import { nextTick } from "@vue/runtime-core";
import minMapEditor from "/@/views/chat/minMapEditor.vue";
import map2d from "/@/views/chat/map2d.vue";

// 摇杆 
import JoystickLeftPanel from "./joystickLeft.vue";
import JoystickRightPanel from "./joystickRight.vue";

// 加载进度页
import loadingPanel from "./loadingPanel2.vue";

// farm
import AvatarData from "../data/sceneSetting.js";

import PlayerAnimData from "../data/playerAnimSetting.js";


import Language from "/@/data/zh_cn.js";

import YJmetaBase from "/@/views/chat/YJmetaBase.vue";


export default {
  name: "index",
  components: {
    // ThreejsHumanChat,
    minMapEditor,
    loadingPanel,
    JoystickLeftPanel,
    JoystickRightPanel,
    map2d,
    YJDync,
    modelBagList,
    YJmetaBase,
    playerSelectPanel,
  },
  data() {
    return {
      isInsertPanel: false,
      // 是否显示姓名条
      displayUserNameUI: false,

      hasPlayerSelectPanel: true,
      //是否可交互的提示
      jiaohuTip: false,

      inLoadCompleted: false,
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

      pos: { x: -100, y: -100 },

      isMobile: false,

      language: null,
      isEn: false,
      avatarData: null,
      contrlState: 0,

      windowWidth: 0,
      windowHeight: 0,
      inThreejs: false,

      viewFarIndex: 2,
      viewFar: [0, -8, -16],

      displayMinMap: true,

      niaokanUI: false,
      projectionList: [
        { id: '10001', content: '岛2', pos: { x: -500, y: -500 } },
        { id: '10002', content: '岛3', pos: { x: -500, y: -500 } },
        { id: '10003', content: '岛4', pos: { x: -500, y: -500 } },
        { id: '10004', content: '岛5', pos: { x: -500, y: -500 } },
        { id: '10005', content: '岛1', pos: { x: -500, y: -500 } },
      ],

      usernamePrefix: [
        "清澈的",
        "波涛汹涌的",
        "华丽的",
        "巍峨的",
        "坚硬的",
        "尖利的",
        "蓝蓝的",
        "精湛的",
        "坚固的",
        "坚定的",
      ],

      usernamesuffix: [
        "流水",
        "海水",
        "丝绸",
        "高山",
        "盔甲",
        "刀锋",
        "天空",
        "技艺",
        "友谊",
        "初心",
      ],
      
      web3: null,
      hasAddress: false,
      address: "",
    };
  },

  created() {
    this.avatarData = AvatarData;

    this.displayMinMap = !this.avatarData.setting.hasAerialView;

    // console.log(Language);
    // this.language = Language.languageCN;
    this.language = Language.languageEN;
    document.title = this.avatarData.setting.title;

    this.$publicUrl += this.avatarData.setting.localPath;
    // console.log(this.$publicUrl);
  },
  mounted() {


    if (this.$refs.playerSelectPanel && this.hasPlayerSelectPanel) {
      // console.log("获取用户名 " ,  this.$route.params);

      if (this.$route.params.userName != undefined) {
        this.userName = this.$route.params.userName;
        // console.log("获取用户名 " +  this.userName);
        // sessionStorage.setItem("userName", this.userName);
      } else {
        this.userName = "aaa";
      }
    } else {
      //跳过角色选择，直接加载场景
      let q = Math.floor(Math.random() * 10);
      let h = Math.floor(Math.random() * 10);
      let t = Math.floor(Math.random() * 10000);
      this.userName = this.usernamePrefix[q] + this.usernamesuffix[h] + t;
      this.ClickSelectPlayerOK(this.avatarData.defaultUser.avatarName, this.userName);
    }

    this.$refs.YJmetaBase.SetloadingPanel(this.$refs.loadingPanel);

    // window.onChangeViewById += this.ChangeViewById;

    var that = this;

    window.onfocus = function () {
      if (
        that.avatarData.setting.hasBGM &&
        that.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager
      ) {
        that.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.Set3DAudioPlay(true);
      } 

    };
    window.onblur = function () {
      if (
        that.avatarData.setting.hasBGM &&
        that.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager
      ) {
        that.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.Set3DAudioPlay(false);
      }
    };

    this.InitFox();

  },
  methods: {

    GetAvatarData(playerName) {
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      console.error(" 角色信息未找到 ", playerName);
    },
    GetPublicUrl() {
      return this.publicUrl;
    },
    GetSceneTexPath() {
      return this.GetModelUrl() + this.avatarData.sceneTexPath;
    },
    GetModelUrl() {
      return this.avatarData.modelPath;
    },
    GetPublicModelUrl() {
      return this.GetPublicUrl() + this.avatarData.modelPath;
    },
    // 预留按钮
    InitFox() {
      if (typeof web3 !== "undefined") {
        this.web3 = new Web3(web3.currentProvider);
      } else {
        // set the provider you want from Web3.providers
        this.web3 = new Web3(
          new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
        );
      }
      //       this.web3 = new Web3(
      //   new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
      // );
      // console.log(this.web3);
    },
    ConnectFox() {
      this.setWeb3();
    },
    async setWeb3() {
      // console.log(window.ethereum);

      // //判断用户是否安装MetaMask钱包插件
      if (typeof window.ethereum === "undefined") {
        //没安装MetaMask钱包进行弹框提示
        alert("请安装MetaMask");
        return;
      }
      //  else {
      //   //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
      //   window.ethereum
      //     .enable()
      //     .then(function (accounts) {
      //       // 判断是否连接以太
      //       if (window.ethereum.networkVersion !== "1") {
      //         console.log("当前网络不在以太坊");
      //       }
      //       //如果用户同意了登录请求，你就可以拿到用户的账号
      //       console.log("用户钱包地址", accounts[0]);
      //     })
      //     .catch(function (reason) {
      //       // 如果用户拒绝了登录请求
      //       if (reason === "User rejected provider access") {
      //         console.log("用户拒绝了登录请求");
      //       } else {
      //         console.log("其他情况");
      //       }
      //     });
      // }
      // Wait for loading completion to avoid race conditions with web3 injection timing.

      if (window.ethereum) {
        await window.ethereum.enable();
        let _address = window.ethereum.selectedAddress+"";
        console.log(_address);
        
        this.address = _address.substring(0,5)+"..."+ _address.substring(36, 42);
        this.hasAddress = true;
        // console.log("address = " + address);
      }
    },

    //由角色选择界面传入 角色类型、用户名
    ClickSelectPlayerOK(selectPlayerName, userName) {
      this.hasPlayerSelectPanel = false;
      this.inLoadCompleted = true;
      var userData = {
        userName: userName,
        roomName: this.avatarData.roomName,
        platform: this.avatarData.platform,
        modelType: selectPlayerName,
      };
      nextTick(() => {
        this.$refs.YJDync.InitDync(userData);
      });
      this.$refs.YJmetaBase.ClickSelectPlayerOK(userData);
      
      this.$refs.YJmetaBase.ThreejsHumanChat.SetNickName(userName); 
 
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
          // if(_projectionList[i].id == this.projectionList[i].id){
          //   this.projectionList[i].pos = _projectionList[i].pos;
          // }
        }
      }
      // console.log(" 3转2 ",_projectionList);
    },

    SetViewState(e) {
      this.displayMinMap = e == "人视";
      this.niaokanUI = e == "鸟瞰";

      if (e == "人视") {
        for (let ii = 0; ii < this.projectionList.length; ii++) {
          this.projectionList[ii].pos.x = -500;
          this.projectionList[ii].pos.y = -500;
        }
      }
    },
    ClickHotPointOwner(hitObject) {

      let hotPointData = hitObject.owner.GetHotPointData();
      // console.log(" hotpointdata  ", hotPointData);
      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {

          this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );

          //视角拉近
          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeToPersonView();

          this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeCameraToFar();
          this.viewFarIndex = 2;
        }
      }

    },

    // 把视角切换到指定id的热点视角位置
    ChangeViewById(id) {
      this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewById(id);
    },

    ChangeViewFar() {
      this.viewFarIndex++;
      if (this.viewFarIndex >= this.viewFar.length) {
        this.viewFarIndex = 0;
      }
      let far = this.viewFar[this.viewFarIndex];
      // this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeCameraFar();
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(far);
    },
    GetPublicUrl() {
      return this.$publicUrl;
    },
    //获取小地图图片url
    GetMinMapData() {
      let minMapData = this.avatarData.minMapData;
      return minMapData;
    },
    OpenThreejs() {
      this.inThreejs = true;
      this.$refs.YJmetaBase.OpenThreejs();

      if (this.avatarData.setting.hasBGM) {
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.Set3DAudioLoad(
          this.$publicUrl + this.avatarData.setting.BGMurl
        );
        this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.Set3DAudioPlay(true);
      }
      // setTimeout(() => {
      //   this.ChangeViewById(10004);
      // }, 2000);
    },
    ClickNiaokan() {
      this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ResetToNiaokanView();
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
  transform: scale(.5, .5) translate(-50%, -50%);
  width: 200%;
  height: 200%;
  /* top: 0;
  left: 0; */
  /* background: rgba(29, 29, 31, 0.72);
backdrop-filter: saturate(180%) blur(20px); */
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
