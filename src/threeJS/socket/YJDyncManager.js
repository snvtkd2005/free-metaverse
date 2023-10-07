import * as THREE from "three";
import { YJsocketIO } from "/@/utils/socketGO.js";
// import { YJwebsocket } from "/@/utils/websocket.js";



class YJDyncManager {
  constructor(YJDync, userData) {

    let scope = this;
    let _YJwebsocket;
    // 其他用户
    this.otherUser = [];
    this.userName = "dd";
    this.roomName = 4552;
    this.parentId = "scene";
    this.platform = "vr";
    this.hotPoint = [];
    this.id = "";
    this.userId = "";
    this.user = {

    };
    //连接成功
    this.connected = true;


    this.Init = function () {

      var playerData = {};
      playerData.name = userData.modelType;
      this.user.playerData = playerData;

      let userDyncData = {};
      userDyncData.rotateY = 0;
      userDyncData.pos = { x: 0, y: 0, z: 0 };
      userDyncData.animName = "idle";

      this.user.userData = userDyncData;
      this.user.playerData.playerState = localStorage.getItem("playerState");

      // console.log(" userData " , userData);
      // console.log(" this.user " , this.user);

      this.userId = YJDync.userId;
      this.userName = userData.userName;
      this.roomName = userData.roomName;
      this.platform = userData.platform;

      this.user.roomName = this.roomName;
      
      this.user.userName = userData.userName;

      _YJwebsocket = new YJsocketIO(scope);
      setTimeout(() => {
        this.user.userData = YJDync.YJController.updateSend();
        // console.log(" YJDync.YJController.updateSend() ", YJDync.YJController.updateSend());
        _YJwebsocket.Init();
      }, 200);

      _YJGlobal._YJDyncManager = scope;

    }

    this.ChangeAvatar = function(avatarName){
      this.user.playerData.name = avatarName;
    }

    this.updateOtherCompleted = true;


    this.UpdatePlayerDefaultPos = function(userData){
      this.user.userData = userData;
    }

    // 更新位置
    this.SetUserData = function (userData) {
      // console.log(" 发送角色数据 2222 ", this.id);

      if (!this.updateOtherCompleted) {
        return;
      }
      if (this.id == "") {
        return;
      }

      // console.log(" 发送角色数据 2222 ", userData);
      this.user.userData = userData;
      this.updateUser();
      _YJwebsocket.postPosition(this.user);

    }


    //同步角色的操作對物品的操作，如 扔物品
    this.SetPlayerState = function (state) {
      //把需要同步的信息放在state中
      this.user.state = state;
      _YJwebsocket.postPosition(this.user);

      this.updateUser();
      this.user.state = null;
    }

    //更新角色信息 位置、形象等
    this.updateUser = function () {
      return;
      let fromData = {};
      fromData.type = "更新位置";
      let msg = this.InitMsg();
      msg.user = this.user;
      fromData.message = msg;
      this.callRPCFn("_SetUserPos", "other", JSON.stringify(fromData));
    }
    this.UpdatePlayerState = function (message) {
      // var message = data.message;
      // if (message.roomName != this.roomName) {
      //   return;
      // }
      // if (message.id == this.id) {
      //   return;
      // }

      var userdata = message.user.userData;
      // console.log(" 刷新位置 ", message.user.userData);
      // console.log(" 刷新位置 ", message);

      YJDync.UpdatePlayerPos(
        message.id,
        userdata
      );
      if (message.user.state != undefined && message.user.state != null) {
        // let state = message.user.state;
        YJDync.DyncPlayerState(message.id, message.user.state);
        // if (state.type != undefined && state.type == "设置角色状态") {
        //   if (state.stageView != undefined) {
        //     _Global.SetPlayerToStage(state.stageView);
        //   } 
        //   return;
        // } 

      }
      return;
      for (let j = 0; j < _this.otherUser.length; j++) {
        if (
          _this.otherUser[j].id == message.id &&
          _this.id != message.id &&
          _this.otherUser[j].roomName == message.roomName
        ) {
          _this.otherUser[j].user = message.user;
          //刷新三维中角色位置

          var userdata = message.user.userData;
          // console.log(" 刷新位置 ", message.user);

          YJDync.UpdatePlayerPos(
            message.id,
            userdata
          );



          //对应用户id和用户的音视频id
          // if (message.user.TRTCstate != undefined && message.user.TRTCstate != null) {
          //   if (message.user.TRTCstate == "close") {
          //     YJDync.CloseTRTC(
          //       message.id
          //     );
          //   }
          // }

          if (message.user.state != undefined && message.user.state != null) {
            YJDync.DyncPlayerState(message.id, message.user.state);
          }


          // console.log(" 刷新位置 ",message.user);
        }
      }
    }
    function _SetUserPos(_this, msg) {
      // console.log(msg);
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);

      var message = data.message;

      if (message.roomName != _this.roomName) {
        return;
      }
      if (message.id == _this.id) {
        return;
      }
      console.log("更新角色位置状态  ", data);


      for (let j = 0; j < _this.otherUser.length; j++) {
        if (
          _this.otherUser[j].id == message.id &&
          _this.id != message.id &&
          _this.otherUser[j].roomName == message.roomName
        ) {
          _this.otherUser[j].user = message.user;
          //刷新三维中角色位置

          var userdata = message.user.userData;
          // console.log(" 刷新位置 ", message.user);

          YJDync.UpdatePlayerPos(
            message.id,
            userdata
          );



          //对应用户id和用户的音视频id
          if (message.user.TRTCstate != undefined && message.user.TRTCstate != null) {
            if (message.user.TRTCstate == "close") {
              YJDync.CloseTRTC(
                message.id
              );
            }
          }

          if (message.user.state != undefined && message.user.state != null) {
            YJDync.DyncPlayerState(message.id, message.user.state);
          }


          // console.log(" 刷新位置 ",message.user);
        }
      }

      YJDync.UpdateOnlineUser(_this.otherUser);
    }
    // 主动断开连接。 当用户无操作时，主动断开
    this.SelfCloseConnect = function () {
      _YJwebsocket.close();
    }
    //封装发送同步
    this.callRPCFn = function (fnName, type, params) {
      let fromData = {};
      fromData.fnName = fnName;
      fromData.type = type;
      fromData.params = params;
      _YJwebsocket.send(JSON.stringify(fromData));
    }
    //同步封装 解析接收到的数据
    this.receiveRPCFn = function (msg) {
      // return;
      // msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      // console.log("data = ",data);

      if (data.fnName == "_SetUserPos") {
        _SetUserPos(this, JSON.stringify(data.params));
      }
      if (data.fnName == "_updateUserState") {
        _updateUserState(this, JSON.stringify(data.params));
      }

      if (data.fnName == "_updateUserStateSingle") {
        _updateUserStateSingle(this, JSON.stringify(data.params));
      }


      if (data.fnName == "_SendSceneState") {
        // console.log("接收场景状态 111 ");
        _SendSceneState(this, JSON.stringify(data.params));
      }

      if (data.fnName == "_DyncSceneFromServer") {
        // console.log("接收场景状态 111 ");
        _DyncSceneFromServer(this, JSON.stringify(data.params));
      }
      //同步角色父物体
      if (data.fnName == "_SendPlayerParent") {
        _SendPlayerParent(this, JSON.stringify(data.params));
      }

      if (data.fnName == "_SendAddOrDelModel") {

        // console.log(" 添加或删除模型 ");

        _SendAddOrDelModel(this, JSON.stringify(data.params));
      }

      if (data.fnName == "receiveMsg") {
        YJDync.receiveMsg(YJDync, JSON.stringify(data.params));
      }
      if (data.fnName == "_changeRoom") {
        _changeRoom(this, JSON.stringify(data.params));
      }

      // 同步用户添加模型
      if (data.fnName == "_SendUserModels") {
        _SendUserModels(this, JSON.stringify(data.params));
      }
      if (data.fnName == "_SendUpdateUserModels") {
        _SendUpdateUserModels(this, (data));
      }

      return;


      // console.log(data);
      //利用反射查找并调用 fn
      let methods = scope.$options.methods;
      const _this = scope;
      //必须传入this， 否则获取不到当前脚本的数据
      methods[data.fnName](_this, JSON.stringify(data.params));
    }
    this.addSelf = function (id) {
      console.log("加入游戏的id= " + id);

      this.id = id;
      this.userId = id;
      //连接成功
      this.connected = true;
      YJDync.connected = true;
      YJDync.id = id;


      this.needMainUser();
      // console.log("YJDync = " , YJDync);

      //用websocket 连接id 作为腾讯云音视频sdk的连接id
      // YJDync.InitTRTC(id);

    }
    this.websocketBegin = function () {

    }
    //客户端与服务器断开连接时，删除角色
    this.CloseWebsocket = function () {
      

      //连接断开
      this.connected = false;
      YJDync.connected = false;
      this.otherUser = [];
      this.hotPoint = [];
      YJDync.otherUser = [];
      YJDync.DelOtherPlayer();

      //断开音视频
      YJDync.CallCloseTRTC();
    }
    //关闭音视频
    this.CloseTRTC = function () {
      // console.log("CloseTRTC  = ");

      //把音视频id添加到用户信息中
      this.user.TRTCstate = "close";
      this.updateUser();
      this.user.TRTCstate = "";
    }

    this.updateUserAvatar = function (avatarData) {
      // console.log("avatarData = ",avatarData);
      this.user.playerData.name = null;
      this.user.playerData.avatarData = avatarData;
      this.updateUserState();
    }
    this.updateUserSkin = function (playerName) {
      // console.error(" 发送角色皮肤 ",playerName);
      this.user.playerData.name = playerName;
      this.updateUserState();
    }
    // 取消主控
    this.cancelMainUser = function () {
      // console.log("当前用户是主控时，窗口失去焦点时，交出主控权");
      _Global.mainUser = false;
      this.user.cancelMainUser = "交出主控权";
      this.updateUserState();
      this.user.cancelMainUser = undefined;


    }
    this.needMainUser = function () {
      if (YJDync.GetDocumentHidden()) { return; }
      // console.log(" 发送 获取主控权");
      this.user.cancelMainUser = "获取主控权";
      this.updateUserState();
      this.user.cancelMainUser = undefined;
    }


    this.updateUserState = function () {
      // console.error("更新角色状态", this.user);
      let fromData = {};
      fromData.type = "更新角色状态";
      let msg = this.InitMsg();
      msg.user = this.user;
      fromData.message = msg;
      this.callRPCFn("_updateUserState", "other", JSON.stringify(fromData));
    }
    //对单个id发送
    this.updateUserStateSingle = function (targetId) {
      // console.error(" 对单个用户 更新角色状态", this.user);
      let fromData = {};
      fromData.type = "更新角色状态";
      let msg = this.InitMsg();

      msg.user = this.user;
      fromData.message = msg;
      fromData.targetId = targetId;
      this.callRPCFn("_updateUserStateSingle", "single", JSON.stringify(fromData));
    }
    function _updateUserStateSingle(_this, msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);

      // console.error(" 对单个用户 更新角色状态", data);

      var message = data.message;
      for (let j = 0; j < _this.otherUser.length; j++) {
        if (
          _this.otherUser[j].id == message.id &&
          _this.id == data.targetId &&
          _this.otherUser[j].roomName == message.roomName
        ) {
          _this.otherUser[j].user = message.user;
          //刷新三维中角色位置

          // console.log(" 新加入时同步角色状态 ",message.id ,message.user);
          YJDync.SetPlayerParent(message.id, message.parentId);

          YJDync.UpdatePlayerPos(
            message.id,
            message.user.userData
          );
          YJDync.UpdatePlayerState(
            message.id,
            _this.otherUser[j].user
          );

          // console.log(" 刷新位置 ");
        }
      }

      YJDync.UpdateOnlineUser(_this.otherUser);

    }


    function _updateUserState(_this, msg) {
      // console.log(msg);
      var data = {};
      try {
        msg = eval("(" + msg + ")");
        data = JSON.parse(msg);
      } catch (error) {
        data = (msg);
      }

      var message = data.message;

      if (message.user.cancelMainUser != undefined) {
        if (message.user.cancelMainUser == "指定主控权") {
          if (_this.id == message.id) {
            _Global.mainUser = true;
            YJDync.SetMainUser(_Global.mainUser);
            // console.log("指定当前用户为主控 22");
          }
          return;
        }

        if (message.user.cancelMainUser == "交出主控权") {
          // console.log(" 其他用户 交出主控权 22");
          if (!YJDync.GetDocumentHidden()) {
            _this.needMainUser();
          }
        }
        return;

      }


      for (let j = 0; j < _this.otherUser.length; j++) {
        if (
          _this.otherUser[j].id == message.id &&
          _this.id != message.id &&
          _this.otherUser[j].roomName == message.roomName
        ) {
          _this.otherUser[j].user = message.user;
          //刷新三维中角色位置

          // console.log(" 新加入时同步角色状态 ",message.id ,message.user);

          YJDync.UpdatePlayerPos(
            message.id,
            message.user.userData
          );

          YJDync.UpdatePlayerState(
            message.id,
            _this.otherUser[j].user
          );
          // console.log(" 刷新位置 ");
        }
      }

      YJDync.UpdateOnlineUser(_this.otherUser);

    }

    // 切换到房间
    this.ChangeRoom = function (roomName) {
      this.roomName = roomName;
      // console.error("切换到房间 ", this.roomName);
      this.user.roomName = this.roomName;

      this.otherUser = [];
      YJDync.DelOtherPlayer();
      _YJwebsocket.joinRoom();

      return;
      //发送用户离开房间 
      let fromData = {};
      fromData.type = "切换房间";
      let msg = this.InitMsg();
      msg.user = this.user;
      fromData.message = msg;
      this.callRPCFn("_changeRoom", "other", JSON.stringify(fromData));



      setTimeout(() => {

        // 切换房间。删除角色后，重新发送加入游戏
        fromData.type = "加入游戏";
        fromData.id = this.id;
        fromData.userId = this.userId;
        fromData.platform = this.platform;
        fromData.userName = this.userName;
        fromData.roomName = this.roomName;
        fromData.message = "";
        _YJwebsocket.joinRoom(JSON.stringify(fromData));
      }, 100);
    }
    function _changeRoom(_this, msg) {

      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      var message = data.message;

      for (let j = 0; j < _this.otherUser.length; j++) {
        if (
          _this.otherUser[j].id == message.id
        ) {
          _this.otherUser.splice(j, 1);
          YJDync.DelPlayer(message.id);
          _this.hotPoint.splice(j, 1);
          // console.log(" 刷新位置 ");
        }
      }

      YJDync.UpdateOnlineUser(_this.otherUser);
    }


    this.InitMsg = function () {
      let msg = {};
      msg.id = this.id;
      msg.userId = this.userId;
      msg.roomName = this.roomName;
      msg.userName = this.userName;
      msg.parentId = this.parentId;
      return msg;
    }
    //-------- 更新场景中模型的状态 开始 ------------

    //更新角色父物体
    this.SendPlayerParent = function (id, name, state) {
      let fromData = {};
      fromData.type = "更新角色父物体";
      this.parentId = id;
      let msg = this.InitMsg();
      let sceneState = {};

      sceneState.id = id;
      msg.sceneState = sceneState;

      fromData.message = msg;
      this.callRPCFn("_SendPlayerParent", "other", JSON.stringify(fromData));
      this.updateUser();

    }
    function _SendPlayerParent(_this, msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      // console.log("更新角色父物体",data);
      var message = data.message;

      if (message.roomName != _this.roomName) {
        return;
      }
      if (message.id == _this.id) {
        // console.log(" 更新角色父物体 == id相同 ");
        return;
      }

      YJDync.SetPlayerParent(message.id, message.sceneState.id);
      console.error(" 更新角色父物体 ", message);

    }

    this.SendUserModels = function (userModel, title) {
      let fromData = {};
      fromData.type = "同步用户模型";
      let msg = this.InitMsg();
      fromData.userModel = userModel;
      fromData.userModelId = userModel.id;
      fromData.title = title;
      fromData.message = msg;
      this.callRPCFn("_SendUserModels", "other", JSON.stringify(fromData));
    }

    function _SendUserModels(_this, msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      var message = data.message;
      // console.error("接收到  同步用户模型 ", data);
      if (message.roomName != _this.roomName) {
        return;
      }
      if (message.id == _this.userId) {
        return;
      }
      if(YJDync._YJSceneManager.GetLoadUserModelManager()){
        YJDync._YJSceneManager.GetLoadUserModelManager().UpdateUserModel(data);
      }
    }
    function _SendUpdateUserModels(_this, msg) {
      var data = (msg);
      // console.error("接收到  同步用户模型 ", data);
      if (data.roomName != _this.roomName) {
        return;
      }
      if(YJDync._YJSceneManager.GetLoadUserModelManager()){
        YJDync._YJSceneManager.GetLoadUserModelManager().UpdateUserModel(data);
      }
    }

    //场景中需要同步的物体
    // 发送场景状态
    this.SendSceneState = function (id, name, state) {
      let fromData = {};
      fromData.type = "更新场景状态";
      let msg = this.InitMsg();
      let sceneState = {};
      sceneState.id = id;
      sceneState.name = name;
      sceneState.state = state;

      msg.sceneState = sceneState;

      fromData.message = msg;
      this.callRPCFn("_SendSceneState", "other", JSON.stringify(fromData));

    }
    //接收场景状态
    function _SendSceneState(_this, msg) {
      msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      // console.log("更新场景状态", data);
      var message = data.message;

      if (message.roomName != _this.roomName) {
        return;
      }
      if (_Global.mainUser && message.id == _this.id) {
        return;
      }
      let sceneState = message.sceneState;

      // if(!_Global.mainUser){
      //   YJDync.$parent._YJGameManager_DyncScene.Receive(sceneState);
      // }
      // YJDync.UpdateSceneState(message.sceneState);

      YJDync.$parent._SceneManager.Receive(sceneState);

    }

    // 接收服务器发送过来的场景同步信息
    function _DyncSceneFromServer(_this, msg) {
      // msg = eval("(" + msg + ")");
      var data = JSON.parse(msg);
      // console.log("更新场景状态",data);
      YJDync._YJSceneManager.GetDyncSceneManager().ReceiveFromServer(data);
      return;
      var message = data.message;
      // YJDync.UpdateSceneState(message.sceneState);
      // //
      let sceneState = message.sceneState;
    }

    //玩家每次加入后，从服务器更新场景状态
    this.UpdateAllSceneState = function (sceneStates) {
      for (let i = 0; i < sceneStates.length; i++) {
        const item = sceneStates[i];
        if (item.modelData.userId == this.userId) {
          YJDync.UpdateCreateModelDone(item.modelData.modelId,
            item.modelData.modelName, item.modelData.img);
        }
      }
      // console.log("第一次加入，刷新场景 ",sceneStates);
      return;
      setTimeout(() => {
        for (let i = 0; i < sceneStates.length; i++) {
          YJDync.UpdateModelAndSceneState(sceneStates[i]);
        }
      }, 3000);

    }
    //-------- 更新场景中模型的状态 结束 ------------
   
    //刷新用户
    this.addPlayer = function (data) {
      console.log("addPlayer = ", data, this.roomName);
      if (!this.connected) { return; }

      // console.log("刷新用户", data);
      //其他用户接收到新用户加入游戏
      if (data.type == "用户加入") {

        // if (data.user.roomName != this.roomName) {
        //   return;
        // }


        for (let j = 0; j < this.otherUser.length; j++) {
          if (data.id == this.otherUser[j].id) {
            return;
          }
        }
        YJDync.GeneratePlayer(false, data.id, data.platform, data.userName,data.user);
      
        this.AddPlayerUser(data.id, data.userName, data.roomName);

        YJDync.UpdateOnlineUser(this.otherUser);

        //只向新加入的id角色发送自身角色数据
        this.updateUserStateSingle(data.id);

        //如果当前角色为主控角色，则主控角色发送整个场景的模型状态
        // if(_Global.mainUser){
        //   YJDync.$parent._YJGameManager_DyncScene.SendDyncSceneModel();
        // }
        return;

        // this.addSystemMsg(data.message + " 已上线");
        //当收到新用户加入时，广播 “我的信息（包含所处房间）”
      }

 

      //其他用户接收到 用户离开游戏
      if (data.type == "用户离开") {
        for (let j = 0; j < this.otherUser.length; j++) {
          if (data.id == this.otherUser[j].id) {
            this.otherUser.splice(j, 1);
            //删除玩家的角色
            YJDync.DelPlayer(data.id);
            this.hotPoint.splice(j, 1);
            //移除该玩家创建的模型。注释后不在玩家离线时删除他创建的模型
            // YJDync._YJSceneManager.RemoveModelByUserId(data.id);
            // this.addSystemMsg(data.message + " 已下线");
            continue;
          }
        }


        // 当有玩家离开时，把第一个索引位置的玩家设为主控
        // _Global.mainUser = this.id == this.otherUser[0].id;
        // YJDync.SetMainUser(_Global.mainUser); 
        if (this.otherUser.length == 1) {
          _Global.mainUser = true;
          YJDync.SetMainUser(_Global.mainUser);
        } else {
          _Global.mainUser = false;
          YJDync.SetMainUser(_Global.mainUser); 
        }

        console.log("用户离开",  data.id);
        YJDync.UpdateOnlineUser(this.otherUser);

        return;
      }

      //新用户加入时，收到当前所有在线的用户列表
      if (data.type == "刷新用户") {
        // var userList = JSON.parse(data.message);
        var userList = (data.message);
        console.log("刷新所有在线用户 ", userList);

        if (userList.length == 1) {
          _Global.mainUser = true;
          YJDync.SetMainUser(_Global.mainUser);
        }

        // console.log("刷新所有在线用户数 " + userList.length);
        for (let j = 0; j < userList.length; j++) {

          let userdata = userList[j];
          // if(userdata.roomName == this.roomName){
          //   YJDync.GeneratePlayer(
          //     userdata.id == this.id,
          //     userdata.id, userdata.platform, userdata.userName, userdata
          //   );
          //   this.AddPlayerUser(userdata.id, userdata.userName, userdata.roomName);
          // }

          YJDync.GeneratePlayer(
            userdata.id == this.id,
            userdata.id, userdata.platform, userdata.userName, userdata
          );
          this.AddPlayerUser(userdata.id, userdata.userName, userdata.roomName);
        
        }

        this.updateOtherCompleted = true;
        YJDync.UpdateOnlineUser(this.otherUser);
      }


      this.updateUserState();
      return;

    }


    // 用户连入同步服务器后，把角色镜像数据添加到本地
    this.AddPlayerUser = function (id, userName, roomName) {
      this.hotPoint.push({
        id: id,
        nickName: userName,
        pos: { x: -100, y: -100 },
      });

      this.otherUser.push({
        id: id,
        userName: userName,
        user: {
          pos: [-100, -100],
          playerData: {
            name: "",
            img: "",
          },
        },
        currentInput: "",
        chatRecode: [],
        roomName: roomName,
        //是否有新消息
        hasNew: false,
        mute: false, //是否禁言
      });
    }


    //接收信息
    function receiveMsg(_this, msg) {
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

        // console.log(_this.otherUser);
      }
    }

    this.Init();

  }
}



export { YJDyncManager };