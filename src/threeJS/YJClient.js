import * as THREE from "three";
import { YJsocketIO } from "/@/utils/socketIO.js";
// import { YJwebsocket } from "/@/utils/websocket.js";
import { YJwebsocketStomp } from "/@/utils/websocketStomp.js";

import { YJPlayer } from "/@/threejs/YJPlayer.js";
import { YJDyncManager } from "/@/threejs/YJDyncManager.js";


class YJClient {
  constructor(indexVue, userData) {

    let scope = this;
    let _YJwebsocket;
    let _YJwebsocketStomp;
    // 其他用户
    // let otherUser = [];
    let otherUser = indexVue.otherUser;

    let userName = "";
    let roomName = "";
    let parentId = "scene";
    let platform = "vr";
    let hotPoint = [];
    let id = "id";
    let userId = "id";

    //所有其他玩家
    let allPlayer = [];

    let user = {

    };
    let _YJDyncManager = null;
    let ThreejsHumanChat = null;
    let _YJSceneManager = null;
    let YJController = null;
    //连接成功
    this.connected = true;

    let inSend = false;
    let selfNum = 0;

    this.SetMainUser = function (b) {
      indexVue.SetMainUser(b);
    }

    // 初始化同步
    function Init() {

      ThreejsHumanChat = _Global.YJ3D;
      _YJSceneManager = _Global.YJ3D._YJSceneManager;
      
      roomName = userData.roomName;
      userName = userData.userName;

      _Global.user.name = userName;
      console.log("启动 同步 ",userData);


      _YJDyncManager = new YJDyncManager(
        scope,
        userData
      );
      _Global._YJDyncManager = _YJDyncManager;

      setTimeout(() => {
        InitYJController();
      }, 1000);

      _Global.addEventListener("玩家改变阵营", (id,camp) => { 
        if(_Global.user.id == id){
          //更新其他玩家镜像的姓名条颜色
          for (let i = 0; i < allPlayer.length; i++) {
            if (allPlayer[i].id != id) {
              allPlayer[i].player.ResetName();  
            }
            if (allPlayer[i].id == id) {
              allPlayer[i].player.camp = camp;  
            }
          } 
          return;
        } 
      });

    }
    this.GetUserData = function () {
      return {
        roomName: roomName,
        userName: userName,
      }
    }

    this.GetDocumentHidden = function () {
      // console.log(" 获取窗口隐藏状态 ",document.hidden);
      return document.hidden;
    }
    // 取消主控
    this.cancelMainUser = function () {
      _YJDyncManager.cancelMainUser();
    }
    this.needMainUser = function () {
      _YJDyncManager.needMainUser();
    }

    this.SetConnected = function (id) {
      this.connected = true;
      this.id = id;
      indexVue.connected = true;
      indexVue.id = id;
      _Global.applyEvent("连接服务器成功");
      this.InitTRTC(id);
    }
    //#region 用户音视频通话
    //用websocket 连接id 作为腾讯云音视频sdk的连接id
    this.InitTRTC = function (userId) {
      // return;

      if (!this.hasTRTC) {
        return;
      }
      console.log("开启音视频，使用id = > 222 " + userId);

      this.$refs.txTRTC.ChangeRoom(this.roomName);

      this.userId = userId;
      this.$parent.userId = userId;
      //初始化sdk客户端
      this.$refs.txTRTC.Init(userId);
    }
    this.SetUserVideo = function (video) {
      if (!this.hasTRTC) {
        return;
      }
      this.ThreejsHumanChat.YJPlayer.CreateVideo(video);

      this.SetUserTRTCstate(this.userId, video, undefined);
    }
    this.SetUserAudio = function (audio) {
      if (!this.hasTRTC) {
        return;
      }
      this.ThreejsHumanChat.YJPlayer.CreateAudio(audio);

      this.SetUserTRTCstate(this.userId, undefined, audio);

    }
    //接收到其他用户的音视频id
    this.SetRemoteTRTCid = function (useId, TRTCid, video, audio) {
      if (!this.hasTRTC) {
        return;
      }
      console.log("获取其他用户的音视频状态 ", video, audio);
      //把音视频id添加到用户信息中
      this.UpdatePlayerTRTC(useId, TRTCid, video, audio);

      this.SetUserTRTCstate(useId, video, audio);
    }
    this.SetUserTRTCstate = function (useId, video, audio) {
      //在在线列表中显示摄像头、话筒图标
      for (let i = 0; i < otherUser.length; i++) {
        if (otherUser[i].id == useId) {
          if (video != undefined) { otherUser[i].video = video; }
          if (audio != undefined) { otherUser[i].audio = audio; }
          return;
        }
      }
    }


    //当前客户端关闭音视频
    this.CloseLocalTRTC = function () {
      if (!this.hasTRTC) {
        return;
      }
      this._YJDyncManager.CloseTRTC();
    }
    //客户端掉线时，关闭音视频
    this.CallCloseTRTC = function () {
      if (!this.hasTRTC) {
        return;
      }
      this.$refs.txTRTC.leaveRoom();
    }

    // 主控下运行禁用其他玩家的音频
    this.ToggleAudio = function (item) {
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
    }

    this.CloseShareStream = function () {
      this.CloseShareStreamFn();
      this._YJDyncManager.SetPlayerState({
        type: "界面状态",
        title: "关闭屏幕共享",
        userId: this.userId,
      });
    }
    this.OpenShareStream3D = function (videoId) {
      this.$parent._SceneManager.LoadScreenStreamVideo(videoId);
    }
    // 关闭共享屏幕画面
    this.CloseShareStreamFn = function () {
      if (!this.hasTRTC) {
        return;
      }
      //关闭界面上的
      this.$refs.txTRTC.CloseShareStreamUI();
      //关闭3d中的
      this.$parent._SceneManager.StopScreenStreamVideo();

    }
    //#endregion

    // 先离开房间。再加入
    this.LeaveRoom = function () {
      // 发送隐藏角色
      YJController.SetDyncDisplay(false);
    }
    this.JoinedRoom = function () {
      // 发送隐藏角色
      if (YJController) {
        YJController.SetDyncDisplay(true);
      }
    }
    // 切换房间
    this.ChangeRoom = function (roomName) {
      this.roomName = roomName;


      let userData = YJController.GetUserData();
      _YJDyncManager.UpdatePlayerDefaultPos(userData);

      _YJDyncManager.ChangeRoom(roomName);
      this.ClearChat();

      if (!this.hasTRTC) {
        return;
      }
      if (this.$refs.txTRTC) {
        this.$refs.txTRTC.ChangeRoom(roomName);
      }
      // console.log("切换同步房间 ",roomName);
    }

    //#region 初始化并同步角色数据
    function InitYJController() {
      YJController = _Global.YJ3D.YJController;
      setInterval(() => {
        UpdateYJController();
      }, 40);
    }

    function UpdateYJController() {

      if (inSend) {
        return;
      }
      inSend = true;
      let userData = YJController.updateSend();
      if (userData != null) {
        _YJDyncManager.SetUserData(userData);

        if (selfNum != undefined && selfNum < otherUser.length) {

          otherUser[selfNum].user.userData.baseData.health = userData.baseData.health;
          otherUser[selfNum].user.userData.baseData.maxHealth = userData.baseData.maxHealth;

          otherUser[selfNum].user.userData.baseData.armor = userData.baseData.armor;
          otherUser[selfNum].user.userData.baseData.energy = userData.baseData.energy;
          otherUser[selfNum].user.userData.baseData.debuffList = userData.baseData.debuffList;

          if (indexVue.debuffHover && userData.baseData.debuffList && userData.baseData.debuffList.length == 0) {
            indexVue.debuffHover = false;
          }
          // console.log(" self user.userData ", userData.baseData );
        }

      }
      inSend = false;
    }
    this.DirectSendUserData = function () {
      inSend = true;
      let userData = YJController.GetUserData();
      // console.log("强制同步",userData);
      if (userData != null) {
        _YJDyncManager.SetUserData(userData);
      }
      inSend = false;
    }
    //#endregion

    //#region
    //#endregion

    //添加到服务器后，生成角色
    this.GeneratePlayer = function (isLocal, id, platform, nickName, userData) {
      if (isLocal) {
        this.id = id;

        if (platform == "pcweb") {
          // ThreejsHumanChat.GeneratePlayer(isLocal, id, platform, nickName);

          // 默认没有姓名条，在多人模式中，需调用创建姓名条 
          ThreejsHumanChat.CallCreateNameTrans(nickName, id);
          ThreejsHumanChat.YJPlayer.camp = _Global.user.camp;
          ThreejsHumanChat.YJController.SetUserDataItem("baseData","camp", _Global.user.camp);
        }
        ThreejsHumanChat.YJPlayer.id = id;
        allPlayer.push({
          player: ThreejsHumanChat.YJPlayer,
          id: id,
          skin: false,
        }); 
			  _Global._YJPlayerFireCtrl.id = id; 
			  _Global.user.id = id; 
        console.log("服务器连接成功后，重新设置user id " + id);
        return;
      }

      if (platform == "pcweb") {

        let _YJPlayer = new YJPlayer(ThreejsHumanChat, ThreejsHumanChat.scene,
          false, nickName, null, (scope) => {
            if (userData) {
              setTimeout(() => {
                scope.ChangeAnim(userData.animName);
              }, 100);
            }
          });
        _YJSceneManager.AddNeedUpdateJS(_YJPlayer);

        _YJPlayer.setPlayerDefaultPos(_YJSceneManager.getPlayerDefaultPos());

        _YJPlayer.CreateNameTrans(nickName);
        _YJPlayer.id = id; 
        allPlayer.push({
          player: _YJPlayer,
          id: id,
          skin: false,
        });
        // console.log("生成 其他角色镜像 角色 " + id,allPlayer);

      }

      // console.log("添加其他玩家 ", allPlayer);
    }
    //删除其他玩家的角色
    this.DelPlayer = function (id) {
      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          _YJSceneManager.RemoveNeedUpdateJS(allPlayer[i].player);
          allPlayer[i].player.DelPlayer();
          allPlayer[i].player = null;
          allPlayer.splice(i, 1);
          return;
        }
      }
    }
    this.SetPlayerParent = function (id, parentId) {
      // console.log("设置角色同步到父物体", parentId);
      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          allPlayer[i].player.SetPlayerParent(_YJSceneManager.GetDyncSceneManager().GetModel(parentId));
          return;
        }
      }
    }
    this.CreateChatTransToId = function (id, msg) {
      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          allPlayer[i].player.CreateChatTrans(msg);
        }
      }
    }

    this.SetPlayerPos = function (pos) {
      ThreejsHumanChat._YJSceneManager.SetPlayerPos(pos);
    }
    this.CreateMapByIdFromServer = function (sceneModelsDataList) {
      ThreejsHumanChat._YJSceneManager.CreateMapByIdFromServer(sceneModelsDataList);
    }
    this.AddOrDelModel = function (sceneState) {
      ThreejsHumanChat._YJSceneManager.AddOrDelModel(sceneState);
    }
    this.UpdateOnlineUser = function (_otheruser) {
      indexVue.otherUser = [];
      indexVue.otherUser = _otheruser;
      otherUser = indexVue.otherUser;
      // otherUser = [];
      // otherUser = _otheruser;
      for (let i = 0; i < otherUser.length; i++) {
        const element = otherUser[i];
        if (element.id == this.id) {
          selfNum = i;
        }
      }
      // indexVue.otherUser = otherUser;
      // console.log(" otherUser ", otherUser);
    }
    //断开连接时，删除所有角色
    this.DelOtherPlayer = function () {
      for (let i = allPlayer.length - 1; i >= 0; i--) {
        _YJSceneManager.RemoveNeedUpdateJS(allPlayer[i].player);
        allPlayer[i].player.DelPlayer();
        allPlayer[i].player = null;
        allPlayer.splice(i, 1);
      }
    }
    //由三维页面发送角色位置过来
    this.SetUserData = function (userData) {
      if (this.inSend) {
        return;
      }
      this.inSend = true;
      // this.$parent.SetUserData(userData);
      _YJDyncManager.SetUserData(userData);
      this.inSend = false;
    }

    this.receiveMsg = function (_this, msg) {
      indexVue.receiveMsg(indexVue, msg);
    }
    this.BoardMsg = function (fnName, type, params) {
      _YJDyncManager.callRPCFn(fnName, type, params);
    }
    //
    this.UpdatePlayerPos = function (id, user) {
      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          // console.log("同步其他用户的角色镜像  执行 " ,user);
          allPlayer[i].player.SetUserData(user);
          return;
        }
      }
    }
    this.GetPlayerById = function (id) {
      // console.log("获取同一战斗组中的玩家 ", allPlayer, ThreejsHumanChat.YJPlayer.id, id);
      // if (ThreejsHumanChat.YJPlayer.id == id) { return ThreejsHumanChat.YJPlayer; }
      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          return allPlayer[i].player;
        }
      }
      return null;
    }
    this.GetAllPlayer = function () {
      let players = [];
      // players.push(ThreejsHumanChat.YJPlayer);
      for (let i = 0; i < allPlayer.length; i++) {
        players.push(allPlayer[i].player);
      }
      return players;
    }
    //同步其他角色的操作。扔物品
    this.DyncPlayerState = function (id, state) {
      if (!this.hasTRTC) {
        return;
      }
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

          for (let i = 0; i < otherUser.length; i++) {
            if (otherUser[i].id == this.userId) {
              otherUser[i].mute = mute;
              ThreejsHumanChat.YJPlayer.SetAudioMute(mute);
              return;
            }
          }
        }
        return;
      }


      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          this.$parent._YJGameManager.DyncPlayerState(allPlayer[i].player, state);
          return;
        }
      }
    }

    //更新角色状态（含角色皮肤）
    this.UpdatePlayerState = function (id, user) {

      for (let i = 0; i < allPlayer.length; i++) {
        // console.log("同步其他用户的角色镜像  ", id, user, allPlayer[i]);
        if (allPlayer[i].id == id) {
          // console.log("同步其他用户的角色镜像 开始  ",id,user);

          if (allPlayer[i].skin == false) {
            allPlayer[i].skin = true;

            if (user.playerData.avatarId == null) {
              console.error(" 加载角色镜像 444 ", user.playerData, user.playerData.playerState);

              allPlayer[i].player.LoadPlayerByCustom(
                user.playerData.avatarData
              );


            } else {
              // console.error(" 加载角色镜像 333 ", user.playerData, user.playerData.playerState);
              // return;

              allPlayer[i].player.NeedChangeSkin();
              // user.playerData.name 决定加载哪个角色模型
              allPlayer[i].player.LoadPlayer(
                user.playerData.avatarId
              );
              let _player = allPlayer[i].player;
              // console.error(" 加载角色镜像 333 ",user.playerData.name, user.playerData.playerState);
              setTimeout(() => {
                //换装同步
                if (indexVue.$parent.UpdateSkin) {
                  indexVue.$parent.UpdateSkin(_player, user.playerData.avatarId, user.playerData.playerState);
                } else {
                  _player.ChangeSkinCompleted();
                }
              }, 200);
            }
          } else {
            if (user.playerData.name == null) {
              allPlayer[i].player.ChangeAvatarByCustom(
                user.playerData.avatarData,
                false
              );
            } else {

              allPlayer[i].player.ChangeAvatar(
                user.playerData.name,
                false
              );
            }
          }
          // console.log("同步其他用户的角色镜像  执行 " );
          return;
        }
      }
    }

    this.UpdatePlayerTRTC = function (id, TRTCid, video, audio) {

      // console.log("更新用户音视频状态");
      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {

          if (TRTCid != undefined) {
            allPlayer[i].player.CreateVideo(video ? TRTCid : null);
            allPlayer[i].player.CreateAudio(audio ? TRTCid : null);
          }
          return;
        }
      }
    }
    this.CloseTRTC = function (id) {

      this.SetUserTRTCstate(id, false, false);


      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          allPlayer[i].player.CreateVideo(null);
          allPlayer[i].player.CreateAudio(null);

          return;
        }
      }
    }
    this.SetAudioMute = function (id, mute) {

      for (let i = 0; i < allPlayer.length; i++) {
        if (allPlayer[i].id == id) {
          allPlayer[i].player.SetAudioMute(mute);
          return;
        }
      }
    }

    this.GetUseId = function () {
      return this.id;
    }
    // 设置本地角色移动到指定坐标， 用于小地图跳转
    this.SetLocalPlayerToPos = function (_pos) {
    }
    //设置本地角色移动到目标角色位置 传送
    this.SetLocalPlayerToOtherUserPos = function (otherUserId) {
      for (let i = 0; i < allPlayer.length; i++) {
        // console.log("同步其他用户的角色镜像 id  " + allPlayerId[i] );
        if (allPlayer[i].id == otherUserId) {
          let playerNameWorldPos = allPlayer[i].player.GetPlayerNamePos();
          playerNameWorldPos.y += 1;
          this.SetPlayerPos(playerNameWorldPos);
        }
      }
    }
    //设置本地角色移动到 指定id的模型位置 传送
    this.SetLocalPlayerToCustomModel = function (modelId) {
      //本地模型可能被销毁。改为从服务器获取
      _YJDyncManager.SendGetModelById(modelId);
    }

    Init();

  }
}



export { YJClient };