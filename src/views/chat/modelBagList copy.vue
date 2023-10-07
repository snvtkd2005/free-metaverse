
// 模型背包系统
<template>

  <!-- 在线列表 -->
  <div
    id="userListPanel"
    class="hidden md:block w-20 h-auto absolute right-0 top-20 text-white"
  >
    <!-- 透明度背景 -->
    <div
      class="absolute left-0 top-0 w-full h-full bg-gray-100 opacity-25"
    ></div>

    <div class="border-b-2 border-gray-400">
      {{ language.content.onlineList }} {{ otherUser.length }}
    </div>
    <div class="text-left h-auto max-h-96 overflow-y-auto overscroll-auto">
      <div
        v-for="(item, i) in otherUser"
        :key="i"
        :index="item.userName"
        class="relative pl-2 border-b-2 border-gray-400"
        :class="item.id == id ? ' pointer-events-none ' : 'cursor-pointer'"
        :id="item.id"
        @click="ClickOtherUser('select', item)"
      >
        <!-- 新消息 -->
        <div
          v-if="item.hasNew"
          class="absolute top-0 -left-2 w-2 h-2 rounded-full bg-red-400"
        ></div>
        {{ item.userName }}
      </div>
    </div>
  </div>

  <!-- 点击用户名：显示悄悄话 和 传送 -->
  <div
    v-if="otherUserItem != null"
    class="absolute left-0 top-0 w-20 h-auto text-sm bg-gray-100"
    :style="otherUserPanelStyle"
  >
    <div class="cursor-pointer" @click="ClickOtherUser('悄悄话')">
      {{ language.content.secretSpeak }}
    </div>
    <div class="cursor-pointer" @click="ClickOtherUser('传送')">
      {{ language.content.jump }}
    </div>
  </div>

  <!-- 聊天记录 -->
  <div
    class="
      md:flex
      w-96
      h-auto
      absolute
      left-5
      bottom-5
      flex-col
      justify-between
      text-white
      bg-gray-400 bg-opacity-60
      rounded-lg
    "
  >
    <!-- 透明度背景 -->
    <!-- <div class="absolute left-0 top-0 w-full h-full bg-gray-100 opacity-25"></div> -->

    <!-- <div class="border-b-2 border-gray-400">聊天区</div> -->

    <div class="w-full h-auto max-h-72 flex flex-col justify-between relative">
      <div
        ref="roomChateRecode"
        class="w-full h-auto max-h-72 overflow-y-auto overscroll-auto"
      >
        <div
          v-for="(item, i) in currentChatRecode"
          :key="i"
          :index="item.message"
          class="h-auto"
          :class="
            id == item.fromId
              ? ' pl-5 text-left  '
              : ' pl-5 text-left cursor-pointer '
          "
          @click="ShowChat(item)"
        >
          <!-- 在大厅中说话 -->
          <div v-if="item.targetUser == ''" class="flex leading-5">
            <div>[{{ item.fromUser }}]：</div>
            <div class="">
              {{ item.message }}
            </div>
          </div>

          <!-- 悄悄话 你对其他人说 -->
          <div
            v-if="item.targetUser != '' && item.fromId == id"
            class="text-red-400 flex"
          >
            <div>
              {{ language.content.speakTo }} [{{ item.targetUser }}]
              {{ language.content.speak }}: {{ item.message }}
            </div>
          </div>
          <!-- 悄悄话 其他人对你说 -->
          <div
            v-if="
              item.targetUser != '' &&
              item.fromUser != '' &&
              item.targetId == id
            "
            class="text-red-400 flex"
          >
            <div>
              [{{ item.fromUser }}] {{ language.content.toSpeak }}:
              {{ item.message }}
            </div>
          </div>

          <!-- {{ item.fromUser }}: {{ item.message }} -->
        </div>
      </div>
      <!-- 悄悄话 私聊提示 -->
      <div
        v-if="chatTargetUser != ''"
        class="text-left pl-2 text-red-400 flex justify-between"
      >
        <div>
          {{ language.content.speakTo }} [{{ chatTargetUser }}]
          {{ language.content.speak }}:
        </div>
        <div @click="chatTargetUser = ''" class="pr-5 cursor-pointer">X</div>
      </div>

      <!-- 输入区域 -->
      <div class="w-72 md:w-96 h-8 mt-3 relative flex">
        <!-- 输入框 -->
        <div class="w-full h-8 bg-gray-400 rounded-xl shadow-xl">
          <input
            ref="roomInput"
            class="
              text-left
              align-top
              outline-none
              bg-transparent
              placeholder-gray-400
              h-full
              w-20
              md:w-full
              px-3
              resize-none
            "
            type="text"
            placeholder="请输入聊天内容"
            v-model="currentChatStr"
            @keyup.enter="SendChat"
            @focus="removeThreeJSfocus"
            @blur="addThreeJSfocus"
          />
        </div>

        <div
          class="
            ml-2
            w-16
            h-full
            bg-gray-400
            cursor-pointer
            flex
            rounded-full
            text-white text-sm
          "
          @click="SendChat()"
        >
          <p class="self-center mx-auto">{{ language.content.sendMsg }}</p>
        </div>
        <div
          class="
            ml-2
            w-16
            h-full
            bg-gray-400
            cursor-pointer
            flex
            rounded-full
            text-white text-sm
          "
          @click="ClearChat()"
        >
          <p class="self-center mx-auto">{{ language.content.clearMsg }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 角色选择 -->
  <div
    v-if="inSelectPlayer"
    class="absolute flex top-0 left-0 z-20 w-full h-full bg-gray-400"
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
      <div class="h-10 leading-10 text-2xl">
        {{ language.content.selectAvatar }}
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
              :src="$publicUrl + item.img"
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
          placeholder="enter nick name"
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
        "
        @click="ClickeSelectOK()"
      >
        {{ language.content.selectOK }}
      </div>

      <div v-if="canVR">支持VR</div>
    </div>
  </div>

  <!-- 连接服务器提示文字 -->
  <div v-if="!connected" class="absolute w-full h-full top-0 left-0 flex">
    <div class="w-1/2 h-10 text-2xl text-white self-center mx-auto">
      {{ avatarData.setting.connectingTip }}
    </div>
  </div>

  <!-- 加载模型过程 提示文字 -->
  <div
    v-if="loading"
    class="absolute w-full h-full top-0 left-0 flex pointer-events-none"
  >
    <div class="w-1/2 h-10 text-2xl text-white mt-10 mx-auto">
      {{ tipContent }}
    </div>
  </div>

 
  <!-- 右侧按钮 -->
  <div class="absolute right-2 bottom-16">
    <div class="h-auto flex-col grid gap-y-2">
      <!-- <div
        class="cursor-pointer rounded-full"
        :class="openModelPanel == '模型库' ? ' bg-blue-200 ' : 'bg-gray-200'"
        @click="ChangePanel('模型库')"
      >
        <p class="p-2">背景音乐</p>
      </div> -->
      <div
        class="cursor-pointer rounded-full"
        :class="openModelPanel == '模型库' ? ' bg-blue-200 ' : 'bg-gray-200'"
        @click="ChangePanel('模型库')"
      >
        <p class="p-2">{{ language.content.skin }}</p>
      </div>

      <div
        v-if="!isMobile && avatarData.setting.hasChangeCtrlState"
        class="cursor-pointer rounded-full bg-gray-200"
        @click="ChangeContrlState()"
      >
        <p class="p-2">切换操作模式</p>
      </div>
    </div>
  </div>

  <!-- 模型库 模型列表选择 -->
  <div
    v-if="openModelPanel == '模型库'"
    class="
      absolute
      w-full
      max-w-md
      h-96
      md:right-32
      bg-gray-200
      bottom-32
      md:bottom-14
    "
  >
    <!-- <div class="text-xs text-green-500">
      在编辑模型移动和旋转时，点击 鼠标右键 结束编辑
    </div> -->
    <!-- 分类table -->
    <div class="flex rounded-md bg-gray-200">
      <div
        v-for="(item, i) in modelTable"
        :key="i"
        :index="item.name"
        class="w-auto h-8 self-center mx-auto cursor-pointer flex"
        :class="selectModelTable == item.name ? 'bg-gray-100' : ''"
        @click="SelectTable(item.name)"
      >
        <!-- {{ item.name }} -->
        <div class="self-center mx-auto p-2"></div>
      </div>
    </div>
    <!-- 模型库 分类筛选后列表 -->
    <div
      class="
        overflow-y-auto
        overscroll-auto
        grid grid-cols-4
        gap-5
        w-11/12
        max-w-md
        h-60
        px-5
        mx-auto
      "
    >
      <div
        v-for="(item, i) in modelsList"
        :key="i"
        :index="item.img"
        class="
          w-16
          h-16
          bg-blue-100
          self-center
          mx-auto
          rounded-md
          shadow-md
          hover:bg-blue-400
          cursor-pointer
          flex
        "
        v-show="item.modelType == selectModelTable"
        :class="
          selectModelItem.name == item.name ? 'bg-blue-400' : 'bg-blue-100'
        "
        @click="SelectModel(item)"
      >
        <div class="self-center mx-auto p-2">
          <img class="w-full h-full" :src="$publicUrl + item.img" alt="" />
        </div>
      </div>
    </div>
  </div>

  <!-- 用户上传的模型  -->
  <div class="hidden absolute right-24 bottom-2">
    <div
      class="cursor-pointer rounded-full"
      :class="
        openModelPanel == '用户上传模型库' ? ' bg-blue-200 ' : 'bg-gray-200'
      "
      @click="ChangePanel('用户上传模型库')"
    >
      <p class="p-2">用户上传模型库</p>
    </div>
  </div>

  <!-- 模型列表选择 -->
  <!-- <modelPanel
    v-if="openModelPanel == '用户上传模型库'"
    class="absolute w-96 h-32 right-5 bg-gray-200 bottom-14"
  >
  </modelPanel> -->

  <!-- 底部按钮  -->
  <div class="hidden absolute right-60 bottom-2">
    <!-- <div
      class="cursor-pointer rounded-full bg-gray-200"
      @click="clickOpenPanel('创建地图缩略图')"
    >
      <p class="p-2">创建地图缩略图</p>
    </div>
    <div
      class="cursor-pointer rounded-full bg-gray-200"
      @click="clickOpenPanel('小地图')"
    >
      <p class="p-2">地图</p>
    </div> -->

    <div
      class="cursor-pointer rounded-full bg-gray-200"
      @click="openModelUpload = true"
    >
      <p class="p-2">上传角色模型</p>
    </div>
    <div
      class="cursor-pointer rounded-full bg-gray-200"
      @click="openStaticModelUpload = true"
    >
      <p class="p-2">上传静态模型</p>
    </div>
  </div>

  <!-- 我创建的模型列表 -->
  <div
    v-if="createModelsList.length > 0"
    class="absolute right-5 top-72 w-32 max-h-96 text-xs bg-blue-100"
  >
    <div class="">我创建的模型列表</div>
    <!-- 我创建的模型列表 -->
    <div
      class="
        overflow-y-auto
        overscroll-auto
        grid grid-cols-1
        gap-2
        w-11/12
        max-h-80
        h-auto
      "
    >
      <div
        v-for="(item, i) in createModelsList"
        :key="i"
        :index="item.img"
        class="w-full h-8 self-center mx-auto flex bg-blue-200"
      >
        <div class="self-center mx-auto p-1">
          <img class="w-10 h-7" :src="$publicUrl + item.img" alt="" />
        </div>
        <div
          @click="ClickCustomCreateModel('传送', item.id)"
          class="cursor-pointer bg-blue-100 self-center mx-auto w-8"
        >
          传送
        </div>
        <div
          @click="ClickCustomCreateModel('修改', item.id)"
          class="cursor-pointer bg-blue-100 self-center mx-auto w-8"
        >
          修改
        </div>
        <div
          @click="ClickCustomCreateModel('删除', item.id)"
          class="cursor-pointer bg-blue-100 self-center mx-auto w-8"
        >
          删除
        </div>
      </div>
    </div>
  </div>

</template>

<script>

var left_x;
var left_y;

export default {
  name: "index",
  components: {
     
  },
  data() {
    return { 

      
      // 是否正在加载摆放的模型 或 切换角色皮肤
      loading: false,
      // 提示文字内容
      tipContent: "模型加载中，请稍候。。。",
      // 是否打开上传静态模型窗口
      openStaticModelUpload: false,
      // 是否开启音视频
      hasTRTC: false,
      // 是否打开角色上传页面
      openCustomModelPanel: false,
      selectModelTable: "角色",
      modelTable: [
        {
          name: "角色",
        },
        // {
        //   name: "特效",
        // },
        // {
        //   name: "动态模型",
        // },
        // {
        //   name: "静态模型",
        // },
      ],
      openModelPanel: "",
      viewMode: "浏览编辑",
      selectModelItem: { name: "" },
      createModelsList: [],
      avatarData: null,
      // 皮肤弹出框的角色选项
      modelsList: [],

      customModelsList: [
        {
          modelType: "静态模型",
          name: "car",
          img: "images/modelsIcon/car.png",
          modelPath: "models/player/Scene/Car03/Car03.gltf",
        },

        {
          modelType: "动态模型",
          name: "door",
          img: "images/modelsIcon/door.png",
          modelPath: "models/player/Scene/door/door.gltf",
        },
        {
          modelType: "动态模型",
          name: "digger",
          img: "images/modelsIcon/挖掘机.png",
          modelPath: "models/player/Scene/digger/digger.gltf",
        },

        {
          modelType: "角色",
          name: "unity娘",
          img: "images/player/13.png",
          modelPath: "models/player/Model/unitychan/unitychan.gltf",
        },
        {
          modelType: "角色",
          name: "机器人",
          img: "images/player/10.png",
          modelPath: "models/player/Model/Robot KyleNew.fbx",
        },
        {
          modelType: "角色",
          name: "小孩",
          img: "images/player/11.png",
          modelPath: "models/player/Model/common_people@idle.fbx",
        },

        //
        {
          modelType: "角色",
          name: "低多边形男孩",
          img: "images/player/11.png",
          modelPath: "models/player/farmplayer/farmPlayerIdle.fbx",
        },

        // {
        //   modelType: "角色",
        //   name: "小孩",
        //   img: "images/player/11.png",
        //   modelPath: "models/player/Model/common_people@idle.fbx",
        // },

        // {
        //   modelType: "角色",
        //   name: "小孩",
        //   img: "images/player/11.png",
        //   modelPath: "models/player/Model/common_people@idle.fbx",
        // },
      ],
  

      //是否在大厅。 否则表示进入了房间
      inSelectPlayer: true,
      inGame: false,
      //是否正在聊天
      inChat: false,

      chatTargetUser: "",
      chatTargetId: "",
      // 其他用户
      otherUser: [],
      //系统消息
      systemMsg: [],

      //房间名
      roomName: "3dfarm",
      platform: "pcweb",
      //在相同房间中的用户名列表
      sameRoomUserList: [],
      // 聊天记录
      currentChatRecode: [],

      //当前输入框的内容
      currentChatStr: "",

      receiveData: {
        fnName: "",
        type: "",
        params: {},
      },
      selectPlayerName: "机器人",

      // 角色选择界面的角色信息
      playerImgPath: [],

      //角色同步数据
      user: {
        pos: [-100, -100, 0],
        rota: [0, 0, 0],
        rotateY: 1,
        animName: "idle",
        playerData: {
          name: "机器人",
          img: "@/assets/images/player/1.png",
        },
        userData: {},
      },

      userName: "",
      userId: "",
      id: "",

      updateOtherCompleted: false,
      //姓名条
      hotPoint: [],

      pos: { x: -100, y: -100 },

      isMobile: false,

      openModelUpload: false,

      // 在用户列表中点击其他用户
      otherUserItem: null,
      // 在用户列表中点击其他用户后的弹窗的style,设置其坐标
      otherUserPanelStyle: "",
      otherUserItemTimeOut: null, //弹窗延迟关闭

      playerDefaultX: 0,
      playerDefaultY: 0,

      tipLater: null,

      web3: null,
      hasAddress: false,
      address: "",
    };
  }, 
  created() {
    this.avatarData = this.$parent.avatarData;
  },
  mounted() {
    this.playerImgPath = this.avatarData.playerImgPath;
    this.modelsList = this.avatarData.modelsList;
    this.roomName = this.avatarData.roomName;
    this.selectPlayerName = this.avatarData.defaultUser.avatarName;
  
    // this.InitFox();
  },
  methods: {
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
        // $('#connectButton').text(window.ethereum.selectedAddress.substring(0, 5) + "..." + window.ethereum.selectedAddress.substring(36, 42))
        let _address = window.ethereum.selectedAddress;
        // var btn = document.getElementById("btn")
        // btn.innerHTML=address;
        this.address = _address.splice(0,5)+"..."+ _address.splice(-7,-1);
        // let q = this.address.substring(0, 4);
        // let h = this.address.substring(
        //   this.address.length - 5,
        //   this.address.length - 1
        // );
        // this.address = q + "..." + h;

        this.hasAddress = true;
        // console.log("address = " + address);
      }
    }, 

    GetAvatarData(playerName) {
      for (let i = 0; i < this.avatarData.avatarData.length; i++) {
        if (this.avatarData.avatarData[i].name == playerName) {
          return this.avatarData.avatarData[i];
        }
      }
      return null;
    }, 
    //#region 模型库
    //切换模型table
    SelectTable(e) {
      this.selectModelTable = e;
    },

    //------------- 玩家创建模型 开始 -------------
    //切换模式。浏览模式和编辑模式。
    //编辑模式，地面变为网格，可从背包资源中选择模型放入场景中
    ChangePanel(e) {
      if (this.openModelPanel != e) {
        this.openModelPanel = e;
      } else {
        this.openModelPanel = "";
      }

      if (
        this.selectModelItem != null &&
        this.selectModelItem.name != undefined &&
        this.selectModelItem.name != ""
      ) {
        this.ClearSelectModel();
        // console.log("取消选择");
      }
    },
    //右键点击空白位置，取消模型选中
    ClearSelectModel() {
      this.CancelSelectModelIconState();
      // 删除模型
      this.$refs.ThreejsHumanChat.SelectModel();

      this.LoadingState("success");
    },
    CancelSelectModelIconState() {
      // 取消按钮选中状态
      this.selectModelItem.name = "";
    },
    SelectModel(item) {
      if (this.selectModelItem.name != "") {
        if (this.selectModelItem.name == item.name) {
          return;
        }
        this.ClearSelectModel();
      }
      this.SelectModelFn(item);
    },
    SelectModelFn(item) {
      if (item.modelType == "角色") {
        this.LoadingState("begin");
        //点击角色图标，切换角色avatar
        this.$refs.ThreejsHumanChat.ChangeAvatar(item.name, true);
      } else {
        this.SelectStaticModel(item);
      }
    },
    // 创建非角色模型
    SelectStaticModel(type, item) {
      // 弹出等待提示
      this.LoadingState("begin");
      this.selectModelItem.name = item.name;
      this.selectModelItem.img = item.img;
      if (type == "静态模型") {
        this.$refs.ThreejsHumanChat.SelectModel(item);
      }
      if (type == "npc") {
        this.$refs.ThreejsHumanChat.SelectModel(item);
      }
    },

    CreateModelDone(id) {
      this.createModelsList.push({
        id: id,
        name: this.selectModelItem.name,
        img: this.selectModelItem.img,
      });
      this.CancelSelectModelIconState();
    },
    UpdateCreateModelDone(modelId, modelName, modelImg) {
      for (let i = 0; i < this.createModelsList.length; i++) {
        const element = this.createModelsList[i];
        if (element.id == modelId) {
          return;
        }
      }
      this.createModelsList.push({
        id: modelId,
        name: modelName,
        img: modelImg,
      });
    },
    DelModel(id) {
      for (let i = 0; i < this.createModelsList.length; i++) {
        if (this.createModelsList[i].id == id) {
          this.createModelsList.splice(i, 1);
        }
      }
      this.$refs.ThreejsHumanChat._YJSceneManager.DelModel(id);
    },
    //编辑模型，移动和旋转模型
    EditorModel(id) {
      this.$refs.ThreejsHumanChat._YJSceneManager.EditorModel(id);
    },
    ClickCustomCreateModel(type, id) {
      if (type == "删除") {
        this.DelModel(id);
        return;
      }
      if (type == "修改") {
        this.EditorModel(id);
        return;
      }
      if (type == "传送") {
        this.$refs.ThreejsHumanChat.SetLocalPlayerToCustomModel(id);
        return;
      }
    },
    //-------------  玩家创建模型 结束 -------------
    //#endregion

    ClickeSelectOK() {
      if (this.selectPlayerName == "") {
        return;
      }
      if (this.userName == "") {
        return;
      }
      this.inSelectPlayer = false;
      for (let i = 0; i < this.playerImgPath.length; i++) {
        if (this.playerImgPath[i].name == this.selectPlayerName) {
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

      if (this.avatarData.setting.hasJoystick && this.isMobile) {
        this.InitJoytick();
      }

      // //创建视频播放容器
      // this.$refs.ThreejsHumanChat.CreateVideoPlane();
    }, 
    //三维场景创建完成后，再加入websocket
    ThreeLoadCompleted() {},
    // 主动断开连接。 当用户无操作时，主动断开
    SelfCloseConnect() {
      location.reload();
      return;
      this.$refs.ThreejsHumanChat._YJDyncManager.SelfCloseConnect();
      //刷新网页
      this.$router.push({ query: {} });
    },
 
    //从房间数据中提取指定房间的聊天记录
    GetRoomChatRecode(roomName) {
      for (let i = 0; i < this.roomList.length; i++) {
        let item = this.roomList[i];
        if (item.roomName == roomName) {
          return item.roomChatRecode;
        }
      }
    },
    // 清空聊天区域
    ClearChat() {
      this.currentChatRecode = [];
    },
    //封装聊天数据
    SendChat() {
      if (this.currentChatStr == "") {
        return;
      }
      //发送聊天内容

      let fromData = {};
      fromData.type = "聊天";
      let chatrecode = {};
      chatrecode.roomName = this.roomName;
      chatrecode.fromId = this.id;
      chatrecode.fromUser = this.userName;
      chatrecode.targetId = this.chatTargetId;
      chatrecode.targetUser = this.chatTargetUser;
      chatrecode.message = this.currentChatStr;

      fromData.message = chatrecode;

      // this.callRPCFn("receiveMsg", "all", JSON.stringify(fromData));
      this.$refs.ThreejsHumanChat.BoardMsg(
        "receiveMsg",
        "all",
        JSON.stringify(fromData)
      );

      //发送后清空输入区
      this.currentChatStr = "";
      //输入框重新获取焦点
      this.$refs.roomInput.focus();

      //如果正在私聊，把私聊对象清空。表示每次需要重新点击私聊对象才能开启私聊
      if (this.chatTargetUser != "") {
        this.chatTargetUser = "";
      }
    },
    //接收信息
    receiveMsg(_this, msg) {
      // console.log(msg);
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);

      //更新聊天记录
      if (data.type == "聊天") {
        var chatrecode = data.message;
        //不同房间的记录不同
        if (chatrecode.roomName != _this.roomName) {
          return;
        }

        // let needDown = true;

        // //先判断聊天区滑块是否在最低端。
        // //在最低端时，才在接收新消息时，再次设为最低端
        // if(_this.$refs.roomChateRecode.scrollTop !=
        //   _this.$refs.roomChateRecode.scrollHeight) {
        //   needDown = false;
        // }

        // 聊天区滑块滑到最低端
        this.ScrollArea();

        // console.log("正在 相同房间聊天");
        if (chatrecode.fromId == _this.id) {
          //自身发送后接收
          //房间聊天
          if (chatrecode.targetUser == null || chatrecode.targetUser == "") {
            _this.currentChatRecode.push(chatrecode);
          } else {
            //悄悄话/私聊
            _this.currentChatRecode.push(chatrecode);
          }

          //显示在2d形象上
          for (let i = 0; i < _this.otherUser.length; i++) {
            let item = _this.otherUser[i];
            if (item.id == chatrecode.fromId) {
              item.chatRecode = [];
              item.chatRecode.push(chatrecode);
              clearTimeout(time);
              var time = setTimeout(() => {
                item.chatRecode.splice(0, 1);
                // console.log(" 清除聊天语句");
              }, 3000);
              // console.log("加载到个人记录上");
              continue;
            }
          }
        } else {
          //其他人发送后接收
          //房间聊天
          if (chatrecode.targetUser == null || chatrecode.targetUser == "") {
            _this.currentChatRecode.push(chatrecode);

            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (item.id == chatrecode.fromId) {
                item.chatRecode = [];
                item.chatRecode.push(chatrecode);
                clearTimeout(time);
                var time = setTimeout(() => {
                  item.chatRecode.splice(0, 1);
                  // console.log(" 清除其他人聊天语句");
                }, 3000);
                // console.log("加载到个人记录上");
                continue;
              }
            }
          } else {
            //悄悄话/私聊
            _this.currentChatRecode.push(chatrecode);

            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (
                _this.id == chatrecode.targetId &&
                item.id == chatrecode.fromId
              ) {
                item.chatRecode = [];
                item.chatRecode.push(chatrecode);
                clearTimeout(time);
                var time = setTimeout(() => {
                  item.chatRecode.splice(0, 1);
                  // console.log(" 清除其他人聊天语句");
                }, 3000);
                // console.log("加载到个人记录上");
                continue;
              }
            }
          }
        }
        //更新聊天记录区域
        // if (needDown) {
        // }
        // console.log(_this.otherUser);
      }
    },
    //聊天记录窗口滑块，滑到底部
    ScrollArea() {
      var that = this;
      //先判断聊天区滑块是否在最低端。
      //在最低端时，才在接收新消息时，再次设为最低端
      // console.log("scrollTop", this.$refs.roomChateRecode.scrollTop);
      // console.log("scrollHeight", this.$refs.roomChateRecode.scrollHeight);
      // 288
      if (this.$refs.roomChateRecode.scrollHeight >= 244) {
        if (
          this.$refs.roomChateRecode.scrollTop ==
          this.$refs.roomChateRecode.scrollHeight - 244
        ) {
          setTimeout(() => {
            that.$refs.roomChateRecode.scrollTop =
              that.$refs.roomChateRecode.scrollHeight;
          }, 100);
        }
        return;
      } else {
        // return;
        setTimeout(() => {
          that.$refs.roomChateRecode.scrollTop =
            that.$refs.roomChateRecode.scrollHeight;
        }, 20);
      }
    },
    //点击其他用户名，显示与其的聊天窗口
    ClickOtherUser(type, item) {
      if (type == "select") {
        this.otherUserItem = item;
        // 显示点击用户名后的弹框界面

        let panelX = document.getElementById("userListPanel").offsetLeft;
        let panelY = document.getElementById("userListPanel").offsetTop;
        // console.log(" 用户列表 ui坐标为 " , panelX,panelY);

        let left_x = document.getElementById(item.id).offsetLeft;
        let left_y = document.getElementById(item.id).offsetTop;
        // console.log("点击的用户名ui坐标为 " , left_x,left_y);
        this.otherUserPanelStyle =
          "left:" +
          (panelX + left_x - 80) +
          "px;top:" +
          (panelY + left_y) +
          "px;";

        if (this.otherUserItemTimeOut != null) {
          clearTimeout(this.otherUserItemTimeOut);
        }
        let that = this;
        this.otherUserItemTimeOut = setTimeout(() => {
          that.otherUserItem = null;
          that.otherUserItemTimeOut = null;
        }, 3000);
        return;
      }
      if (type == "悄悄话") {
        if (this.otherUserItem != null) {
          this.ShowChatUser(this.otherUserItem);
        }
        this.otherUserItem = null;
        return;
      }
      if (type == "传送") {
        this.$refs.ThreejsHumanChat.SetLocalPlayerToOtherUserPos(
          this.otherUserItem.id
        );
        this.otherUserItem = null;
        return;
      }
    },
    ShowChatUser(other) {
      if (this.id == other.id) {
        return;
      }
      this.chatTargetUser = other.userName;
      this.chatTargetId = other.id;
    },
    //点击其他用户名，显示与其的聊天窗口
    ShowChat(other) {
      if (this.id == other.fromId) {
        return;
      }
      this.chatTargetId = other.fromId;
      this.chatTargetUser = other.fromUser;

      return;

      //点开新的聊天对象时，保存旧的聊天编辑内容
      for (let i = 0; i < this.otherUser.length; i++) {
        let item = this.otherUser[i];
        if (item.userName == this.chatTargetUser) {
          item.currentInput = this.currentChatStr;
          continue;
        }
      }

      for (let i = 0; i < this.otherUser.length; i++) {
        let item = this.otherUser[i];
        if (item.userName == other) {
          this.currentChatStr = item.currentInput;
          this.currentChatRecode = item.chatRecode;
          item.hasNew = false;

          return;
        }
      }
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
