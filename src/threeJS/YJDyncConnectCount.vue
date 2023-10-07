<template>
  <!-- 在线列表 -->
  <div id="userListPanel"
    class=" xl:block w-48 h-48 absolute right-0 top-10 xl:top-20  origin-top-right transform scale-50 xl:scale-100 ">

    <!-- 透明度背景 -->
    <div class="absolute left-0 top-0 z-0 w-full h-full ">
      <img :src="publicUrl + 'images/gameUI/zaixianrensu.png'" alt="">
    </div>

    <div class=" absolute left-16 w-20 top-3 z-10 text-black  ">
      {{ language.content.onlineList }} {{ otherUser.length }}
    </div>

    <div class=" mt-10 text-left h-auto max-h-96 overflow-y-auto overscroll-auto text-white">
      <div v-for="(item, i) in otherUser" :key="i" :index="item.userName" class=" relative w-11/12  pl-2 border-b-2 flex "
        :id="item.id">
        <div class=" w-2/3  whitespace-nowrap  truncate "
          :class="item.id == id ? ' pointer-events-none ' : 'cursor-pointer'" @click="ClickOtherUser('select', item)">
          <div>
            {{ item.userName + (item.id == id ? ' (自己)' : '') }}
          </div>
        </div>

        <div class=" absolute right-0 z-auto " :class="(__Global.mainUser && item.id != id) ? 'pointer-events-auto cursor-pointer ' : 'pointer-events-none',
          item.audio ? ' opacity-1 ' : ' opacity-0 '
        " @click.stop="ToggleAudio(item)">
          <div class=" w-6 h-6 p-px ">
            <img class=" w-full h-full " :src="publicUrl + 'images/' + (item.mute ? 'mute' : '') + 'mico.png'" alt="">
          </div>
        </div>

        <!-- <div v-if="item.video">{{ (item.video ? ' 有视频 ' : '') }}</div> -->
        <!-- 新消息 -->
        <div v-if="item.hasNew" class="absolute top-0 -left-2 w-2 h-2 rounded-full  bg-purple-700"></div>
      </div>
    </div>
  </div>

  <!-- 连接websocket 提示文字 -->
  <div v-if="!connected" class="absolute z-60 w-full h-full top-0 left-0 flex pointer-events-none">
    <div class=" w-full flex">

      <div class="
                          mx-auto
                          h-8
                          leading-8
                          text-xl
                          bg-blue-300
                          rounded-md
                          shadow-md
                          cursor-pointer
                          w-auto
                        inline-block
                        ">
        <div class="  px-3  self-center mx-auto   ">
          正在连接服务器，请稍候。。。
        </div>
      </div>
    </div>
  </div>
</template>


 
<script >

import * as THREE from "three";

import { YJDyncManager } from "./YJDyncManager.js";
import { YJPlayer } from "./YJPlayer.js";

// 音视频
import txTRTC from "/@/views/chat/txTRTC.vue";
export default {
  props: ['hasTRTC'],
  components: {
    txTRTC,
  },
  data() {
    return {

      // 是否开启音视频
      // hasTRTC: true,

      // 会议邀请对话框
      meetingInvitation: false, meetingData: { fromUser: 'haha' },
      language: {
        content: {

          sendMsg: "发送",
          clearMsg: "清空",

          secretSpeak: "悄悄话",
          jump: "传送",

          toSpeak: "对你说",
          speak: "说",
          speakTo: "你对",

          skin: "皮肤",

          onlineList: "在线用户",

          meeting: "发送会议邀请",
        }
      },

      //是否正在聊天
      inChat: false,

      canInputChar: false,

      chatTargetUser: "",
      chatTargetId: "",
      // 其他用户
      otherUser: [],
      //系统消息
      systemMsg: [],

      // 在用户列表中点击其他用户
      otherUserItem: null,
      // 在用户列表中点击其他用户后的弹窗的style,设置其坐标
      otherUserPanelStyle: "",
      otherUserItemTimeOut: null, //弹窗延迟关闭

      // 聊天记录
      currentChatRecode: [],
      //当前输入框的内容
      currentChatStr: "",
      connected: false,
      inputing: false,
      publicUrl: '',
      _Global: null,

      num:0,
    };
  },
  created() {

    // this.language = this.$parent.language;
    // this.language.content.meeting = "发送会议邀请";

    this.__Global = _Global;
    this.publicUrl = this.$parent.GetPublicUrl();
  },
  mounted() {
    this.inSend = false;
    this.connected = false;
    this.otherUser = [];

    //所有其他玩家
    this.allPlayer = [];

    //场景中的物体
    this.sceneModels = [];

    //session id
    this.id = "";
    this.userId = "";

    this._YJDyncManagerList = [];
    this._YJDyncManager = null;

    //同步角色的坐标、旋转、皮肤、动作
    this.YJController = null;

    this.platform = 'pcweb';
    this.roomName = 'pcwebRoom1';


    // this.userData = {};
    // this.userData.modelType = '小孩';
    // this.userData.platform = this.platform;
    // this.userData.roomName = this.roomName;
    // this.userData.userName = this.userName;

    // console.log("启动 同步 ");
    // this._YJDyncManager = new YJDyncManager(
    //   this, 
    //   this.userData
    // );

    // this.ThreejsHumanChat = this.$parent.$refs.YJmetaBase.GetThreejsHumanChat();

    // this._YJSceneManager = this.ThreejsHumanChat._YJSceneManager;

    // let that = this;
    //   setTimeout(() => {
    //     that.InitYJController();
    //   }, 5000);

  },

  methods: {
    // 初始化同步
    InitDync(userData) {

      this.ThreejsHumanChat = this.$parent.$refs.YJmetaBase.GetThreejsHumanChat();
      this._YJSceneManager = this.ThreejsHumanChat._YJSceneManager;


      this.roomName = userData.roomName;
      this.userName = userData.userName;
      console.log("启动 同步 ");



      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          userData.userName  = i+"";
          this._YJDyncManagerList.push({
            id: i, _YJDyncManager: new YJDyncManager(
              this,
              userData
            )
          });
        }, i * 100);

      }



      // }
      // this._YJDyncManager = new YJDyncManager(
      //   this,
      //   userData
      // );





      let that = this;
      setTimeout(() => {
        that.InitYJController();
      }, 1000);


      window.addEventListener('keyup', (event) => {
        // console.log(event);
        switch (event.code) {
          case 'Enter':
            this.EnterKey();
            break;
        }
      });
    },
    // 切换房间
    ChangeRoom(roomName) {
      this.roomName = roomName;
      // this._YJDyncManager.ChangeRoom(roomName);

      for (let i = 0; i < this._YJDyncManagerList.length; i++) {
        const element = this._YJDyncManagerList[i];
        element._YJDyncManager.ChangeRoom(roomName);
      }

      this.ClearChat();

      this.$refs.txTRTC.ChangeRoom(roomName);
      // console.log("切换同步房间 ",roomName);
    },

    //#region 初始化并同步角色数据
    InitYJController() {
      this.YJController = this.ThreejsHumanChat.YJController;

      var that = this;
      setInterval(() => {
        that.UpdateYJController();
      }, 20);
    },
    UpdateYJController() {

      if (this.inSend) {
        return;
      }
      let userData = this.YJController.updateSend();

      this.inSend = true;
      if (userData != null) {
        // this._YJDyncManager.SetUserData(userData);
        for (let i = 0; i < this._YJDyncManagerList.length; i++) {
          const element = this._YJDyncManagerList[i];
          element._YJDyncManager.SetUserData(userData);
        }
      }
      this.inSend = false;
    },
    //#endregion

    //#region 切换模型皮肤
    ChangeAvatar(name, isLocal) {
      //开始加载
      this.$parent.LoadingState("begin");
      this.YJPlayer.ChangeAvatar(name, true);
      //同时发送给其他客户端，更新其他客户端的角色镜像
      // this._YJDyncManager.updateUserSkin(name);
      for (let i = 0; i < this._YJDyncManagerList.length; i++) {
        const element = this._YJDyncManagerList[i];
        element._YJDyncManager.updateUserSkin(name);
      }
    },
    ChangeAvatarByCustom(modelData, isLocal) {

      // console.log("modelData = ",modelData);
      //开始加载
      this.$parent.LoadingState("begin");
      this.YJPlayer.ChangeAvatarByCustom(modelData, true);
      //同时发送给其他客户端，更新其他客户端的角色镜像
      // this._YJDyncManager.updateUserAvatar(modelData);
      for (let i = 0; i < this._YJDyncManagerList.length; i++) {
        const element = this._YJDyncManagerList[i];
        element._YJDyncManager.updateUserAvatar(modelData);
      }
    },
    //#endregion

    //#region  模型状态同步相关

    //三维场景状态发送到服务器
    SendSceneState(id, name, state) {
      // this._YJDyncManager.SendSceneState(id, name, state);
      for (let i = 0; i < this._YJDyncManagerList.length; i++) {
        const element = this._YJDyncManagerList[i];
        element._YJDyncManager.SendSceneState(id, name, state);
      }
    },
    //更新本地模型状态，并向服务器发送模型状态
    UpdateAndSendSceneState(sceneState) {
      for (let i = 0; i < this.sceneModels.length; i++) {
        var modelState = this.sceneModels[i];
        if (modelState.id == sceneState.id) {
          modelState.model.SendState(sceneState.state);
          this.SendSceneState(sceneState.id, sceneState.name, sceneState.state);
          continue;
        }
      }
    },
    //刷新场景模型状态,门的状态
    UpdateSceneState(sceneState) {
      this.ThreejsHumanChat.UpdateSceneState(sceneState);
    },
    //刷新场景模型状态,门的状态. 同时生成用户创建的模型
    UpdateModelAndSceneState(sceneState) {
      this.ThreejsHumanChat.UpdateModelAndSceneState(sceneState);
    },

    //#endregion

    //#region
    //#endregion

    //#region 由页面调用 开始
    //----------由页面调用 开始-----------

    //点击切换mmd动作
    ChangeMMDAnim(state) {
      // console.log("点击切换mmd动作",state);
      //默认是先other发送，不包含自己。 所以要给自身也发送一份
      this.UpdateSceneState({ id: "10010", name: "mmd", state: state });

      this.SendSceneState("10010", "mmd", state);
    },

    //----------由页面调用 结束-----------
    //#endregion


    //添加到服务器后，生成角色
    GeneratePlayer(isLocal, id, platform, nickName) {
      if (isLocal) {
        this.id = id;

        if (platform == "pcweb") {
          // 默认没有姓名条，在多人模式中，需调用创建姓名条 
          this.ThreejsHumanChat.CallCreateNameTrans(nickName);
        }

        // console.log("生成本地角色 " + id);
        return;
      }

      if (platform == "pcweb") {

        this.num++;
        console.log("生成 其他角色镜像 角色 " + id,this.num, nickName);
        if(this.num<181 && parseInt(nickName)<11){return;}
        setTimeout(() => {
          let _YJPlayer = new YJPlayer(this.ThreejsHumanChat, this.ThreejsHumanChat.scene, false, nickName);
          _YJPlayer.CreateNameTrans(nickName);
          this.allPlayer.push({
            player: _YJPlayer,
            id: id,
            skin: false,
          });
        },(this.num-180)*1000);
      }

      // console.log("添加其他玩家 ", this.allPlayer);
    },
    //删除其他玩家的角色
    DelPlayer(id) {
      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {
          this.allPlayer[i].player.DelPlayer();
          this.allPlayer[i].player = null;
          this.allPlayer.splice(i, 1);
          return;
        }
      }
    },
    SetPlayerParent(id, parentId) {
      console.log("设置角色同步到父物体", parentId);
      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {
          this.allPlayer[i].player.SetPlayerParent(this._YJSceneManager.GetDyncSceneManager().GetModel(parentId));
          return;
        }
      }
    },

    SetPlayerPos(pos) {
      this.ThreejsHumanChat._YJSceneManager.SetPlayerPos(pos);
    },
    CreateMapByIdFromServer(sceneModelsDataList) {
      this.ThreejsHumanChat._YJSceneManager.CreateMapByIdFromServer(sceneModelsDataList);
    },
    AddOrDelModel(sceneState) {
      this.ThreejsHumanChat._YJSceneManager.AddOrDelModel(sceneState);
    },
    UpdateOnlineUser(_otheruser) {
      this.otherUser = [];
      this.otherUser = _otheruser;
    },
    //断开连接时，删除所有角色
    DelOtherPlayer() {
      for (let i = this.allPlayer.length - 1; i >= 0; i--) {
        this.allPlayer[i].player.DelPlayer();
        this.allPlayer[i].player = null;
        this.allPlayer.splice(i, 1);
      }
    },
    //由三维页面发送角色位置过来
    SetUserData(userData) {
      if (this.inSend) {
        return;
      }
      this.inSend = true;
      // this.$parent.SetUserData(userData);
      // this._YJDyncManager.SetUserData(userData);
      for (let i = 0; i < this._YJDyncManagerList.length; i++) {
        const element = this._YJDyncManagerList[i];
        element._YJDyncManager.SetUserData(userData);
      }
      this.inSend = false;
    },
    BoardMsg(fnName, type, params) {
      // this._YJDyncManager.callRPCFn(fnName, type, params);
      for (let i = 0; i < this._YJDyncManagerList.length; i++) {
        const element = this._YJDyncManagerList[i];
        element._YJDyncManager.callRPCFn(fnName, type, params);
      }
    },
    //
    UpdatePlayerPos(id, user) {
      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {
          // console.log("同步其他用户的角色镜像  执行 " ,user);
          this.allPlayer[i].player.SetUserData(user);
          return;
        }
      }



    },

    //同步其他角色的操作。扔物品
    DyncPlayerState(id, state) {

      // console.log(" 接收到同步操作  ", state);
      if (state.type != undefined && state.type == "界面状态") {
        let title = state.title;
        if (title == "关闭屏幕共享") {
          this.CloseShareStreamFn();
          return;
        }
        if (title == "麦克风") {
          let mute = state.mute;
          if (mute == "禁言") {
            if (state.targetId == "all" || this.userId == state.targetId) {
              this.$refs.txTRTC.muteAudio();
            }
          } else if (mute == "解禁") {
            if (state.targetId == "all" || this.userId == state.targetId) {
              this.$refs.txTRTC.unmuteAudio();
            }
          }

          for (let i = 0; i < this.otherUser.length; i++) {
            if (this.otherUser[i].id == this.userId) {
              this.otherUser[i].mute = mute;
              this.ThreejsHumanChat.YJPlayer.SetAudioMute(mute);
              return;
            }
          }
        }
        return;
      }


      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {
          this.$parent._YJGameManager.DyncPlayerState(this.allPlayer[i].player, state);
          return;
        }
      }
    },


    //更新角色状态（角色皮肤）
    UpdatePlayerState(id, user) {

      for (let i = 0; i < this.allPlayer.length; i++) {
        // console.log("同步其他用户的角色镜像  ", id, user, this.allPlayer[i]);
        if (this.allPlayer[i].id == id) {
          // console.log("同步其他用户的角色镜像 开始  ",id,user);

          if (this.allPlayer[i].skin == false) {
            this.allPlayer[i].skin = true;

            if (user.playerData.name == null) {
              this.allPlayer[i].player.LoadPlayerByCustom(
                user.playerData.avatarData
              );

              console.error(" 加载角色镜像 444 ", user.playerData.name, user.playerData.playerState);

            } else {

              // user.playerData.name 决定加载哪个角色模型
              this.allPlayer[i].player.LoadPlayer(
                user.playerData.name
              );
              // console.error(" 加载角色镜像 333 ",user.playerData.name, user.playerData.playerState);
              setTimeout(() => {
                //换装同步
                if (this.$parent.UpdateSkin) {
                  this.$parent.UpdateSkin(this.allPlayer[i].player, user.playerData.name, user.playerData.playerState);
                }
              }, 200);
            }
          } else {
            if (user.playerData.name == null) {
              this.allPlayer[i].player.ChangeAvatarByCustom(
                user.playerData.avatarData,
                false
              );

            } else {

              this.allPlayer[i].player.ChangeAvatar(
                user.playerData.name,
                false
              );
            }
          }
          // console.log("同步其他用户的角色镜像  执行 " );
          return;
        }
      }
    },

    UpdatePlayerTRTC(id, TRTCid, video, audio) {

      // console.log("更新用户音视频状态");
      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {

          if (TRTCid != undefined) {
            this.allPlayer[i].player.CreateVideo(video ? TRTCid : null);
            this.allPlayer[i].player.CreateAudio(audio ? TRTCid : null);
          }
          return;
        }
      }
    },
    CloseTRTC(id) {

      this.SetUserTRTCstate(id, false, false);


      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {
          this.allPlayer[i].player.CreateVideo(null);
          this.allPlayer[i].player.CreateAudio(null);

          return;
        }
      }
    },
    SetAudioMute(id, mute) {

      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {
          this.allPlayer[i].player.SetAudioMute(mute);
          return;
        }
      }
    },

    GetUseId() {
      return this.id;
    },
    // 设置本地角色移动到指定坐标， 用于小地图跳转
    SetLocalPlayerToPos(_pos) {
    },
    //设置本地角色移动到目标角色位置 传送
    SetLocalPlayerToOtherUserPos(otherUserId) {
      for (let i = 0; i < this.allPlayer.length; i++) {
        // console.log("同步其他用户的角色镜像 id  " + this.allPlayerId[i] );
        if (this.allPlayer[i].id == otherUserId) {
          let playerNameWorldPos = this.allPlayer[i].player.GetPlayerNamePos();
          playerNameWorldPos.y += 1;
          this.SetPlayerPos(playerNameWorldPos);
        }
      }
    },
    //设置本地角色移动到 指定id的模型位置 传送
    SetLocalPlayerToCustomModel(modelId) {
      //本地模型可能被销毁。改为从服务器获取
      // this._YJDyncManager.SendGetModelById(modelId);
      for (let i = 0; i < this._YJDyncManagerList.length; i++) {
        const element = this._YJDyncManagerList[i];
        element._YJDyncManager.SendGetModelById(modelId);
      }
    },

    //#region  聊天

    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      this.ThreejsHumanChat.removeEventListener();
      this.inputing = true;
    },
    addThreeJSfocus() {
      this.ThreejsHumanChat.threeJSfocus();
      this.inputing = false;
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
    EnterKey() {
      if (!this.canInputChar) { return; }

      if (this.inputing) {
        if (this.currentChatStr == "") {
          if (this.chatTargetUser != "") {
            this.chatTargetUser = "";
          }
          this.addThreeJSfocus();
          return;
        }
        this.SendChat();
      } else {
        this.$refs.roomInput.focus();
        return;
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

        this.$refs.roomInput.focus();
        return;
      }
      if (type == "传送") {
        this.SetLocalPlayerToOtherUserPos(
          this.otherUserItem.id
        );
        this.otherUserItem = null;
        return;
      }

      if (type == "发送会议邀请") {
        //发送聊天内容

        let fromData = {};
        fromData.type = "会议邀请";
        let chatrecode = {};
        chatrecode.roomName = this.roomName;
        chatrecode.fromId = this.id;
        chatrecode.fromUser = this.userName;
        chatrecode.targetId = this.otherUserItem.id;
        chatrecode.targetUser = this.otherUserItem.userName;
        chatrecode.message = "邀请";
        fromData.message = chatrecode;
        //向单个用户发送邀请
        this.BoardMsg(
          "receiveMsg",
          "all",
          JSON.stringify(fromData)
        );

        this.otherUserItem = null;
        return;
      }
    },

    meetingHandler(e) {
      this.meetingInvitation = false;

      //发送邀请回调 -- 接受 / 拒绝

      let fromData = {};
      fromData.type = "会议邀请";
      let chatrecode = {};
      chatrecode.roomName = this.meetingData.roomName;
      chatrecode.fromId = this.meetingData.fromId;
      chatrecode.fromUser = this.meetingData.fromUser;
      chatrecode.targetId = this.meetingData.targetId;
      chatrecode.targetUser = this.meetingData.targetUser;
      chatrecode.message = e;
      fromData.message = chatrecode;
      //向单个用户发送邀请
      this.BoardMsg(
        "receiveMsg",
        "all",
        JSON.stringify(fromData)
      );
      console.log("this.meetingData.fromUser  111 = " + this.meetingData.fromUser);

      setTimeout(() => {

        if (e == "接受") {
          //切换到会议场景 跳转到会议房间
          //跳到以发送者id命名的房间中
          console.log("this.meetingData.fromUser  222 = " + this.meetingData.fromUser);
          this.$parent.ChangeToMeetingRoom(this.meetingData.fromId, this.meetingData.fromUser);
        }
        if (e == "拒绝") {

        }
      }, 1000);

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
      this.BoardMsg(
        "receiveMsg",
        "all",
        JSON.stringify(fromData)
      );

      let ss = this.currentChatStr;

      // 聊天内容显示到姓名条上方
      // 本地发送直接更新到本地角色姓名条上方
      this.ThreejsHumanChat.CreateChatTrans(ss);

      //发送后清空输入区
      this.currentChatStr = "";
      //输入框重新获取焦点
      this.$refs.roomInput.focus();

      //如果正在私聊，把私聊对象清空。表示每次需要重新点击私聊对象才能开启私聊
      // if (this.chatTargetUser != "") {
      //   this.chatTargetUser = "";
      // }

      // console.log("发送聊天");


    },
    //接收信息
    receiveMsg(_this, msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      // console.log(" 聊天 data ",data);

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

            //显示在3d形象上 姓名条上方
            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (item.id == chatrecode.fromId) {
                for (let i = 0; i < this.allPlayer.length; i++) {
                  if (this.allPlayer[i].id == item.id) {
                    this.allPlayer[i].player.CreateChatTrans(chatrecode.message);
                  }
                }
                continue;
              }
            }


          } else {
            //悄悄话/私聊
            _this.currentChatRecode.push(chatrecode);

            //显示在2d
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

            // 显示在3d
            for (let i = 0; i < _this.otherUser.length; i++) {
              let item = _this.otherUser[i];
              if (
                _this.id == chatrecode.targetId &&
                item.id == chatrecode.fromId
              ) {
                for (let i = 0; i < this.allPlayer.length; i++) {
                  if (this.allPlayer[i].id == item.id) {
                    this.allPlayer[i].player.CreateChatTrans(chatrecode.message);
                  }
                }
                continue;
              }
            }
          }

        }

        // 聊天区滑块滑到最低端
        this.ScrollArea();
        // console.log(_this.otherUser);
      }
      if (data.type == "会议邀请") {
        var chatrecode = data.message;
        //不同房间的记录不同
        if (chatrecode.roomName != _this.roomName) {
          return;
        }


        // console.log("正在 相同房间聊天");
        if (chatrecode.fromId == _this.id) {
          //自身发送后接收
          if (chatrecode.message == "邀请") {
            console.log("发送会议邀请成功");
          }
          if (chatrecode.message == "接受") {
            console.log(chatrecode.targetUser + " 接受了你的邀请");
            //跳转到会议房间  跳到以发送者id命名的房间中
            console.log("this.meetingData.fromUser  333 = " + chatrecode.fromUser);
            if (this.roomName != this.id) {
              setTimeout(() => {
                console.log("this.meetingData.fromUser  444 = " + chatrecode.fromUser);
                this.$parent.ChangeToMeetingRoom(this.id, this.userName);
              }, 1000);
            }

          }
          if (chatrecode.message == "拒绝") {
            console.log(chatrecode.targetUser + " 拒绝了你的邀请");
          }
        } else {

          //接收其他人发送的信息
          if (_this.id == chatrecode.targetId) {
            if (chatrecode.message == "邀请") {
              console.log("接收到会议邀请");
              this.meetingInvitation = true;
              this.meetingData = chatrecode;
            }
          }
        }
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
          this.$refs.roomChateRecode.scrollTop <
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
      this.$refs.roomInput.focus();

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
    //#endregion


    //#region 用户音视频通话
    //用websocket 连接id 作为腾讯云音视频sdk的连接id
    InitTRTC(userId) {
      return;
      console.log("开启音视频，使用id = > 222 " + userId);

      if (!this.hasTRTC) {
        return;
      }
      this.$refs.txTRTC.ChangeRoom(this.roomName);

      this.userId = userId;
      this.$parent.userId = userId;
      //初始化sdk客户端
      this.$refs.txTRTC.Init(userId);
    },
    SetUserVideo(video) {
      if (!this.hasTRTC) {
        return;
      }
      this.ThreejsHumanChat.YJPlayer.CreateVideo(video);

      this.SetUserTRTCstate(this.userId, video, undefined);
    },
    SetUserAudio(audio) {
      if (!this.hasTRTC) {
        return;
      }
      this.ThreejsHumanChat.YJPlayer.CreateAudio(audio);

      this.SetUserTRTCstate(this.userId, undefined, audio);

    },
    //接收到其他用户的音视频id
    SetRemoteTRTCid(useId, TRTCid, video, audio) {
      if (!this.hasTRTC) {
        return;
      }
      console.log("获取其他用户的音视频状态 ", video, audio);
      //把音视频id添加到用户信息中
      this.UpdatePlayerTRTC(useId, TRTCid, video, audio);

      this.SetUserTRTCstate(useId, video, audio);
    },
    SetUserTRTCstate(useId, video, audio) {
      //在在线列表中显示摄像头、话筒图标
      for (let i = 0; i < this.otherUser.length; i++) {
        if (this.otherUser[i].id == useId) {
          if (video != undefined) { this.otherUser[i].video = video; }
          if (audio != undefined) { this.otherUser[i].audio = audio; }
          return;
        }
      }
    },


    //当前客户端关闭音视频
    CloseLocalTRTC() {
      if (!this.hasTRTC) {
        return;
      }
      this._YJDyncManager.CloseTRTC();
    },
    //客户端掉线时，关闭音视频
    CallCloseTRTC() {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.txTRTC.leaveRoom();
    },

    // 主控下运行禁用其他玩家的音频
    ToggleAudio(item) {
      // console.log(" 主控下运行禁用其他玩家的音频 ", item.id);

      item.mute = !item.mute;

      // 改本地角色镜像的状态
      this.SetAudioMute(item.id, item.mute);

      this._YJDyncManager.SetPlayerState({
        type: "界面状态",
        title: "麦克风",
        mute: item.mute,
        targetId: item.id,
      });
    },

    CloseShareStream() {
      this.CloseShareStreamFn();
      this._YJDyncManager.SetPlayerState({
        type: "界面状态",
        title: "关闭屏幕共享",
        userId: this.userId,
      });
    },
    OpenShareStream3D(videoId) {
      this.$parent._SceneManager.LoadScreenStreamVideo(videoId);
    },
    // 关闭共享屏幕画面
    CloseShareStreamFn() {
      //关闭界面上的
      this.$refs.txTRTC.CloseShareStreamUI();
      //关闭3d中的
      this.$parent._SceneManager.StopScreenStreamVideo();

    }
    //#endregion

  },
};
</script>