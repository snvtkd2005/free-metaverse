
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <ThreejsHumanChat
  tabindex="-1"
    class="absolute left-0 top-0 "
    ref="ThreejsHumanChat"
    id="ThreejsHumanChat"
  />

  <!-- 角色选择 -->
  <div
    v-if="inSelectPlayer"
    class="absolute flex top-0 left-0 z-20 w-full h-full  bg-gray-400 "
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
      <div class="h-10 leading-10 text-2xl">选择形象</div>

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
          <div class="self-center mx-auto">
            <img :src="item.img" alt="" />
          </div>
        </div>
      </div>

      <!-- 输入昵称 -->
      <div class="flex mt-5 w-full h-10 px-5">
        <div class="self-center">输入昵称:</div>
        <input
          ref="nickNameInput"
          class="
            ml-5
            rounded-md
            shadow-md
            bg-transparent
            bg-blue-100
            px-2
            h-full
            outline-none
          "
          v-model="userName"
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
        确定
      </div>

       <div v-if="canVR">
         支持VR
       </div>
    </div>
  </div>

</template>

<script>
import { YJwebsocket } from "/@/utils/websocket.js";
import bgImgSrc from "/@/assets/images/player/bg.jpg";
import ThreejsHumanChat from "/@/threeJS/threeSHJKGVRChat.vue";
 

export default {
  name: "index",
  components: {
    ThreejsHumanChat,
  },
  data() {
    return {

      //是否支持VR
      canVR:false, 

      //连接ws服务器状态
      connected: false,

      //是否可交互的提示
      jiaohuTip: false,

      // 是否显示姓名条
      displayUI: true,

      bgImgSrc,
      //是否在大厅。 否则表示进入了房间
      inSelectPlayer: false,

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
      roomName: "3d网站",
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
      playerImgPath: [
        { name: "机器人", img: "@/assets/images/player/10.png" },
        { name: "小孩", img: "@/assets/images/player/11.png" },
        // { img: "@/assets/images/player/7.png" },
      ],
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
      },
      userName: "",
      id: "",

      updateOtherCompleted: false,
      //姓名条
      hotPoint: [],

      pos: { x: -100, y: -100 },

      isMobile: false,
    };
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // console.log(" 离开页面 前");
    if (this.YJwebsocket != null) {
      this.YJwebsocket.close();
    }
    next();
  },
  mounted() {
    this.userName = this.$route.params.user;
    sessionStorage.setItem("userName", this.userName);
    // this.$refs.nickNameInput.focus();

console.log("正在VR登录页");
    //监听是否支持VR
      document.addEventListener('onVRSupportedCheck', function (event) {
        console.log("当前设备是否支持VR " +event.detail.supported );
        that.canVR = !event.detail.supported;
        that.$router.push("/chat/index4/3dchat/"+that.userName);
      }, false);

  },
  methods: {

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

      //创建视频播放容器
      this.$refs.ThreejsHumanChat.CreateVideoPlane();
      // this.YJwebsocket = new YJwebsocket(this);
    },

    // 移动端点击跳跃按钮
    ClickJump() {
      this.$refs.ThreejsHumanChat.ClickJump();
    },
    //点击按钮 交互门
    ClickInteractive() {
      this.$refs.ThreejsHumanChat.ClickInteractive();
    },
    //三维场景创建完成后，再加入websocket
    ThreeLoadCompleted() {
      // this.YJwebsocket = new YJwebsocket(this);
    },
    SelfCloseConnect() {
      this.YJwebsocket.close();
    },

    SendSceneState(id, name, state) {
      let fromData = {};
      fromData.type = "更新场景状态";
      let msg = {};
      let sceneState = {};
      sceneState.id = id;
      sceneState.name = name;
      sceneState.state = state;

      msg.sceneState = sceneState;
      msg.id = this.id;
      msg.roomName = this.roomName;
      msg.userName = this.userName;
      fromData.message = msg;
      this.callRPCFn("_SendSceneState", "other", JSON.stringify(fromData));
    },
    _SendSceneState(_this, msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      var message = data.message;

      _this.$refs.ThreejsHumanChat.UpdateSceneState(message.sceneState);
    },

    //玩家每次加入后，从服务器更新场景状态
    UpdateAllSceneState(sceneStates) {
      for (let i = 0; i < sceneStates.length; i++) {
        this.$refs.ThreejsHumanChat.UpdateSceneState(sceneStates[i]);
      }
    },

    //threejs页面传入，碰到交互物体时显示提示文字
    ChangeTip(b) {
      this.jiaohuTip = b;
    },
    //在输入聊天信息时，取消threejs的键盘监听。
    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      this.$refs.ThreejsHumanChat.removeEventListener();
    },
    addThreeJSfocus(){
      this.$refs.ThreejsHumanChat.threeJSfocus();
    },
    threeJSfocus() {
      // console.log("点击threejs");
      return;
      var that = this;
      this.$nextTick(function () {
        that.$refs.ThreejsHumanChat.focus();
      });
    },

    //刷新热点的位置
    updateRotaHotPoint(id, pos) {
      if (pos == null) {
        pos = this.pos;
      }
      // console.log(cnName,pos);
      //热点实时面向摄像机
      for (var i = 0; i < this.hotPoint.length; i++) {
        if (this.hotPoint[i].id == id) {
          this.hotPoint[i].pos = pos;
        }
      }
    },

    addSelf(id) {
      this.id = id;
      //连接成功
      this.connected = true;
    },
    //客户端与服务器断开连接时，删除角色
    CloseWebsocket() {
      //连接断开
      this.connected = false;
      this.otherUser = [];
      this.hotPoint = [];
      this.$refs.ThreejsHumanChat.CloseWebsocket();
    },

    //退出房间 返回大厅
    ClickBack() {
      // this.$parent.ClickBack();
      this.$router.push("/chat/index4/" + sessionStorage.getItem("userName"));
    },
    //由三维页面发送角色位置过来
    SetUserPos(x, y, z, rotaX, rotaY, rotaZ, rotateY, animName) {
      if (!this.updateOtherCompleted) {
        return;
      }
      if (this.id == "") {
        return;
      }
      // return;

      this.user.pos[0] = x;
      this.user.pos[1] = y;
      this.user.pos[2] = z;

      this.user.rota[0] = rotaX;
      this.user.rota[1] = rotaY;
      this.user.rota[2] = rotaZ;

      this.user.rotateY = rotateY;

      this.user.animName = animName;

      this.updateUser();
    },

    //更新角色信息 位置、形象等
    updateUser() {
      let fromData = {};
      fromData.type = "更新位置";
      let msg = {};
      msg.user = this.user;
      msg.id = this.id;
      msg.roomName = this.roomName;
      msg.userName = this.userName;
      fromData.message = msg;
      this.callRPCFn("_SetUserPos", "other", JSON.stringify(fromData));
    },
    _SetUserPos(_this, msg) {
      // console.log(msg);
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      var message = data.message;
      for (let j = 0; j < _this.otherUser.length; j++) {
        if (
          _this.otherUser[j].id == message.id &&
          _this.id != message.id &&
          _this.otherUser[j].roomName == message.roomName
        ) {
          _this.otherUser[j].user = message.user;
          //刷新三维中角色位置

          _this.$refs.ThreejsHumanChat.UpdatePlayerPos(
            message.id,
            _this.otherUser[j].user
          );

          // console.log(" 刷新位置 ");
        }
      }
    },

    updateUserState() {
      let fromData = {};
      fromData.type = "更新角色状态";
      let msg = {};
      msg.user = this.user;
      msg.id = this.id;
      msg.roomName = this.roomName;
      msg.userName = this.userName;
      fromData.message = msg;
      this.callRPCFn("_updateUserState", "other", JSON.stringify(fromData));
    },

    _updateUserState(_this, msg) {
      // console.log(msg);
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      var message = data.message;
      for (let j = 0; j < _this.otherUser.length; j++) {
        if (
          _this.otherUser[j].id == message.id &&
          _this.id != message.id &&
          _this.otherUser[j].roomName == message.roomName
        ) {
          _this.otherUser[j].user = message.user;
          //刷新三维中角色位置

          _this.$refs.ThreejsHumanChat.UpdatePlayerPos(
            message.id,
            _this.otherUser[j].user
          );
          _this.$refs.ThreejsHumanChat.UpdatePlayerState(
            message.id,
            _this.otherUser[j].user
          );

          // console.log(" 刷新位置 ");
        }
      }
    },

    //封装发送同步
    callRPCFn(fnName, type, params) {
      let fromData = {};
      fromData.fnName = fnName;
      fromData.type = type;
      fromData.params = params;
      this.YJwebsocket.send(JSON.stringify(fromData));
    },
    //同步封装 解析接收到的数据
    receiveRPCFn(msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      // console.log(data);
      //利用反射查找并调用 fn
      let methods = this.$options.methods;
      const _this = this;
      //必须传入this， 否则获取不到当前脚本的数据
      methods[data.fnName](_this, JSON.stringify(data.params));
    },

    //刷新用户
    addPlayer(data) {
      if (data.roomName != this.roomName) {
        return;
      }

      if (data.type == "刷新场景") {
        var sceneModelsDataList = JSON.parse(data.message);
        this.UpdateAllSceneState(sceneModelsDataList);
        return;
      }
      // console.log("刷新用户", data);
      //其他用户接收到新用户加入游戏
      if (data.type == "用户加入") {
        this.$refs.ThreejsHumanChat.GeneratePlayer(false, data.id);
        this.hotPoint.push({
          id: data.id,
          nickName: data.userName,
          pos: { x: -100, y: -100 },
        });

        //已存在的用户之一，发送一遍场景中物体的状态。如门的状态
        // this.SendSceneState();

        this.otherUser.push({
          id: data.id,
          userName: data.userName,
          user: {
            pos: [-100, -100],
            playerData: {
              name: "西索",
              img: "",
            },
          },
          currentInput: "",
          chatRecode: [],
          roomName: data.roomName,
          //是否有新消息
          hasNew: false,
        });
        // this.addSystemMsg(data.message + " 已上线");
        //当收到新用户加入时，广播 “我的信息（包含所处房间）”
      }
      //其他用户接收到 用户离开游戏
      if (data.type == "用户离开") {
        for (let j = 0; j < this.otherUser.length; j++) {
          if (data.id == this.otherUser[j].id) {
            this.otherUser.splice(j, 1);
            //删除玩家的角色
            this.$refs.ThreejsHumanChat.DelPlayer(data.id);
            this.hotPoint.splice(j, 1);

            // this.addSystemMsg(data.message + " 已下线");
            return;
          }
        }
        return;
      }

      //新用户加入时，收到当前所有在线的用户列表
      if (data.type == "刷新用户") {
        var userList = JSON.parse(data.message);
        // console.log(userList);
        // console.log( userList.length);
        for (let j = 0; j < userList.length; j++) {
          let userdata = userList[j];
          this.$refs.ThreejsHumanChat.GeneratePlayer(
            userdata.id == this.id,
            userdata.id
          );
          //
          this.hotPoint.push({
            id: userdata.id,
            nickName: userdata.userName,
            pos: { x: -100, y: -100 },
          });

          this.otherUser.push({
            id: userdata.id,
            userName: userdata.userName,
            user: {
              pos: [-100, -100],
              playerData: {
                name: "西索",
                img: "",
              },
            },
            currentInput: "",
            chatRecode: [],
            roomName: userdata.roomName,
            //是否有新消息
            hasNew: false,
          });
        }
        this.updateOtherCompleted = true;
      }
      // var that = this;
      // setTimeout(() => {
      // that.updateUser();

      // }, 20);
      this.updateUserState();
      return;

      return;
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

        //大厅聊天记录滑到底部
        _this.ScrollArea();

        // console.log(_this.otherUser);
      }
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

      this.callRPCFn("receiveMsg", "all", JSON.stringify(fromData));

      //发送后清空输入区
      this.currentChatStr = "";
      //输入框重新获取焦点
      this.$refs.roomInput.focus();

      //如果正在私聊，把私聊对象清空。表示每次需要重新点击私聊对象才能开启私聊
      if (this.chatTargetUser != "") {
        this.chatTargetUser = "";
      }
    },
    //聊天记录窗口滑块，滑到底部
    ScrollArea() {
      var that = this;

      setTimeout(() => {
        that.$refs.roomChateRecode.scrollTop =
          that.$refs.roomChateRecode.scrollHeight;
      }, 20);
    },
    //点击其他用户名，显示与其的聊天窗口
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
*{
  -webkit-tap-highlight-color:rgba(255,255,255,0)
}
  /* 阻止长按复制 */
  .stop-long-hover{
      -webkit-touch-callout:none;
  -webkit-user-select:none;
  -khtml-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
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
