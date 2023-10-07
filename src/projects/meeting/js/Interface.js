import * as THREE from "three";
import { GetSceneData, CheckUserInvaild, GetArcId } from "./loginApi";


import texiaoData from "../data/texiaoData.js";

// Threejs 中的事件传出接口

//所有 this.functionHandle 用来传出threejs中的操作，由threejs调用。界面开发人员无需关心

//所有 this.function 是已绑定界面逻辑的_Global.function。_Global.function = this.function 绑定后，界面即可调用threejs中的操作。由界面逻辑调用。 先用_Global绑定

//所有 _Global.function 是界面中创建并绑定的，由threejs调用 

class Interface {
  // _this 为三维主页面vue
  constructor(_this, ActType) {

    let EffectInfo = null;
    let ActPosInfo = null;

    this.GetEffectInfo = function () {
      return EffectInfo;
    }
    this.GetActPosInfo = function () {
      return ActPosInfo;
    }
    _Global.GetEffectInfo = this.GetEffectInfo;
    _Global.GetActPosInfo = this.GetActPosInfo;

    function LoadSQL(ActID) {

      _this.arcId = ActID;
      console.log("获取活动id ", ActID);
      let data = {
        "ActID": ActID,
        // "ActID": "ACTnWOnBSBeErkVjQikxwwZZNWylvH",
        // "ActID": _this.arcId,
      }
      GetSceneData(data).then((res) => {
        console.log(res);

        if (res.status == 200) {
          if (res.data.code == 1) {
            let data = JSON.parse(res.data.data);
            console.log(data);

            // 聊天预设语句
            texiaoData.DefaultChatList = data.ActInfoV2.DefaultChatList;

            // 表情
            let EmotionList = data.ActInfoV2.EmotionList;
            texiaoData.expressionPath = [];
            for (let i = 0; i < EmotionList.length; i++) {
              const item = EmotionList[i];
              texiaoData.expressionPath.push({ icon: item.IconURL, title: item.Name, expression: item.EmotionURL });
            }

            //灯牌和荧光棒
            texiaoData.dengPaiList = [];
            texiaoData.lightStickList = [];
            let PropList = data.ActInfoV2.PropList;
            for (let i = 0; i < PropList.length; i++) {
              const item = PropList[i];
              //灯牌
              if (item.PropType == 1) {
                texiaoData.dengPaiList.push({ icon: item.IconURL, modelPath: item.PropURL });
              }
              // 荧光棒
              if (item.PropType == 2) {
                texiaoData.lightStickList.push({ icon: item.IconURL, modelPath: item.PropURL });
              }
            }

            // 气球雨和烟花
            // 气球雨4个，前两个一组 ，后两个一组
            //改 ：气球雨5个，每次只开启或暂停其中一个
            texiaoData.balloonList = [];
            texiaoData.balloonList.push(_this.GetPublicUrl() + "models/playerSkin/balloon_purple.glb");
            texiaoData.fireworkList = [];
            let EffectList = data.ActInfoV2.EffectList;
            for (let i = 0; i < EffectList.length; i++) {
              const item = EffectList[i];
              // 气球雨
              if (item.EffectType == 1) {
                texiaoData.balloonList.push(item.EffectURL);
              }
              // 烟花
              if (item.EffectType == 5) {
                texiaoData.fireworkList.push(item.EffectURL);
              }
            }

            EffectInfo = (EffectList);
            console.error(" EffectInfo ", EffectInfo);
            ActPosInfo = (data.ActInfo.ActPosList);

            // 过场动画
            for (let index = 0; index < ActPosInfo.length; index++) {
              const element = ActPosInfo[index];
              if (element.PosType == 14) {
                texiaoData.EnterShowURL = element.PosContent;
              }
              if (element.PosType == 15) {
                texiaoData.ChangeShowURL = element.PosContent;
              }
            }

            //npc数据
            texiaoData.npcData.hasNpc = false;
            let NPCList = data.ActInfoV2.NPCList;
            if (NPCList != undefined) {
              let NPCData = null;
              for (let i = 0; i < NPCList.length; i++) {
                const element = NPCList[i];
                if (element.NPCStatus == 1) {
                  NPCData = element;
                }
              }
              if (NPCData != null) {
                texiaoData.npcData.hasNpc = NPCData.NPCStatus == 1;
              }
            }

          }
        }
      });
    }
    function Init() {
      if (texiaoData.useLocal) {
        for (let i = 0; i < texiaoData.expressionPath.length; i++) {
          texiaoData.expressionPath[i].expression = _this.GetPublicUrl() + texiaoData.expressionPath[i].expression;
        }
        for (let i = 0; i < texiaoData.dengPaiList.length; i++) {
          texiaoData.dengPaiList[i].modelPath = _this.GetPublicUrl() + texiaoData.dengPaiList[i].modelPath;
        }
        for (let i = 0; i < texiaoData.lightStickList.length; i++) {
          texiaoData.lightStickList[i].modelPath = _this.GetPublicUrl() + texiaoData.lightStickList[i].modelPath;
        }
        for (let i = 0; i < texiaoData.fireworkList.length; i++) {
          texiaoData.fireworkList[i] = _this.GetPublicUrl() + texiaoData.fireworkList[i];
        }
        for (let i = 0; i < texiaoData.balloonList.length; i++) {
          texiaoData.balloonList[i] = _this.GetPublicUrl() + texiaoData.balloonList[i];
        }

        //texiaoData
      }
    }


    this.GetTexiaoData = function () {
      return texiaoData;
    }
    _Global.GetTexiaoData = this.GetTexiaoData();

    // 获取当前有效的活动id
    function InitActId() {
      let data = {
        "ActType": ActType,
      }
      GetArcId(data).then((res) => {
        // console.log(res);

        if (res.status == 200) {
          if (res.data.code == 1) {
            let data = JSON.parse(res.data.data);
            LoadSQL(data.ActID);
          }
        }
      });
    }
    // LoadSQL();
    // Init();
    InitActId();




    let posList = ["door", "zyzbsj", "zycx", "zygy", "zbds", "wbds", "xzzj", "dfshub", "vote", "game", "collect"];

    // 传入装置id，视角跳转到装置正前方
    this.ChangeViewById = function (id) {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(id);
    }

    this.ChangeViewByName = function (name) {
      let id = name;

      let hasView = false;
      for (let i = 0; i < posList.length; i++) {
        if (posList[i] == name || name.indexOf(posList[i]) > -1) {
          id = posList[i];
          hasView = true;
          continue;
        }
      }
      if (!hasView) {
        console.log("未查找跳转id " + id);
        return;
      }
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(id);


      _this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(true);
      _this.$refs.YJmetaBase.addThreeJSfocus();
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeCtrlState();

      _this.otherLoadManager.CloseGame();
      _this.animModelId = "";

      if (id == "game") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
          "game",
          true
        );
      }

      //显示地面热点
      _this.SetFootHotPointDisplay(true);

    }
    //设置是否激活3d页面。在界面使用input时传false，取消input后传true
    this.ActiveThree3D = function (b) {
      if (b) {
        _this.$refs.YJmetaBase.addThreeJSfocus();
      } else {
        _this.$refs.YJmetaBase.removeThreeJSfocus();
      }
    }
    //强制激活3d操作
    _Global.ActiveThree3D = this.ActiveThree3D;

    // 点击热点，加载热点数据，传入热点id
    this.LoadData = function (id) {

      if (id == "npc001") {
      }
      if (_Global.showLayer == null) { return; }
      _Global.showLayer("npc", { id: id });
    }

    _Global.platform = "Android";
    this.changeScene = function (e) {
      _this.$refs.YJDync.connected = false;
      // _this.$refs.YJDync._YJDyncManager.SelfCloseConnect();
      // _this.ChangeRouter();return;

      _this._SceneManager.ClearMovieVideo();
      _this.$refs.YJmetaBase.ThreejsHumanChat.touchTime = 0;

      _Global.DelDengPai();
      _Global.SetPlayerAnim("idle");
      _this.$refs.scenePanel.ChangeScene(e);

      LoadSQL(_this.arcId);

      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMoving(true);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMouseWheel(true);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.CancelMoving();

      //230520
      _Global.GetChairList();
    }
    _Global.ChangeScene = this.changeScene;

    //230520
    this.GetChairList = function () {
      if (chairList == null || chairList.length == 0) {
        chairList = _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointJSListById("chair003");
      } else {
      }
      console.log("切换场景，加载椅子数据");
    }
    _Global.GetChairList = this.GetChairList;
    this.GetChairIndexByItem = function (item) {
      for (let i = 0; i < chairList.length; i++) {
        if (chairList[i] == item) {
          return i;
        }
      }
      console.error(" 查找椅子索引失败 =========== ", chairList, item);
      return -1;
    }

    _Global.GetChairIndexByItem = this.GetChairIndexByItem;
    this.SetPlayerInChair = function (i) {
      _this.$refs.YJDync._YJDyncManager.SetPlayerState(
        {
          type: "设置角色入座状态",
          inChairIndex: i
        }
      );
      console.error("========发送角色入座状态",i);
    }
    _Global.SetPlayerInChair = this.SetPlayerInChair;
    //获取已使用椅子列表
    this.GetUsedChairIndexList = function () {
      return _this.$refs.YJDync.GetUsedChairIndexList();
    }
    _Global.GetUsedChairIndexList = this.GetUsedChairIndexList;




    // 设置到舞台视角
    this.SetPlayerToStage = function (b) {

      if (b) {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(0);
      } else {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(-4);
      }
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerDisplay(!b);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMoving(!b);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMouseWheel(!b);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.CancelMoving();
    }
    // 设置所有玩家到舞台视角
    this.SetAllPlayerToStageView = function (b) {
      _this.$refs.YJDync._YJDyncManager.SetPlayerState(
        {
          type: "设置角色状态",
          stageView: b
        }
      );
    }

    let delayDelFace;
    this.SetPlayerExpression = function (i) {
      //texiaoData
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerExpression(texiaoData.expressionPath[i].expression);
      if (delayDelFace != null) {
        clearTimeout(delayDelFace);
      }
      delayDelFace = setTimeout(() => {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerExpression();
      }, 3000);
    }
    //设置角色表情
    _Global.SetPlayerExpression = this.SetPlayerExpression;



    this.SetPlayerAnim = function (animName) {
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerAnim(animName);
    }
    //设置角色动作
    _Global.SetPlayerAnim = this.SetPlayerAnim;

    // 角色选择完成
    this.SelectPlayerCompleted = (selectPlayerName, userName) => {
      if (_Global.setCharacter == null) { return; }
      // console.error(" 发送 角色选择完成 ");
      _Global.setCharacter({ char_ext: selectPlayerName, nickname: userName });
      _Global.char_ext = selectPlayerName;
    }

    //#region threejs传出
    // 2,threejs 点击热点后，把热点id发送到 _Global.ClickHotpoint 
    // 点击热点id
    this.ClickHotpointHandler = function (id) {
      console.log(" 点击3d中的热点，传出热点id = > " + id);
      if (_Global.ClickHotpoint == null) { return; }
      _Global.ClickHotpoint({ id: id });
    }

    //#endregion


    //点击我要落座后，把角色传达到指定位置
    this.SetSitting = function () {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect("chair002");
    }
    _Global.SetSitting = this.SetSitting;

    this.SetTriggerOverlap = (b, id, name) => {
      console.log(" 设置trigger 重叠状态 ", b, " id = ", id);
      if (_Global.SetTriggerOverlap == null) { return; }
      _Global.SetTriggerOverlap({ state: b, id: id });

      if (b) {
        if (id == "changeScene001") {
          //场景跳转trigger .  changeScene001 为室外的传送点
        }
      }

      let iid = 1;
      if (id == "photoPos002") {
        iid = 1;
      }
      if (id == "photoPos001") {
        iid = 1;
      } if (id == "photoPos003") {
        iid = 1;
      }
      let nname = _Global.char_ext;
      if (_Global.char_ext == "nanhai") { nname = "boy"; }
      if (_Global.char_ext == "nvhai") { nname = "girl"; }


    }
    this.hasIn3D = function () {
      if (_Global.hasIn3D == null) { return; }
      _Global.hasIn3D();
    }

    // 提交游戏结果
    // this.submitGame = function (success,time) {
    //   _Global.submitGame( JSON.stringify({ success: success,time:time }));
    // }

    // 会议室播放视频
    this.PlayVideoStream = function (url, type) {
      console.log('url', url);
      if (_this.$refs.playVideo) {
        _this.$refs.playVideo.PlayVideoStream(url, type);
      }
    }
    _Global.PlayVideoStream = this.PlayVideoStream;

    // 坐下
    this.SetInSitting = function (b) {
      if (_Global.SetInSitting == null) { return; }
      _Global.SetInSitting(b);
    }


    // 活动位内容更新
    this.ChangeAcivityPosition = function (ActivityPosition) {
      _this._SceneManager.ChangeAcivityPosition(ActivityPosition);
    }
    _Global.ChangeAcivityPosition = this.ChangeAcivityPosition;


    //设置视频全屏播放
    this.SetVideoFullScreen = function () {

      let PosType = 3;
      let videoId = "";
      if (_Global.sceneName == "Scene2") {
        videoId = "dPlayerVideoMain" + 3;
      }

      if (_Global.sceneName == "MeetingScene") {
        videoId = "dPlayerVideoMain" + "" + 9;
        PosType = 9;
      }

      if (_Global.sceneName == "MusicScene") {
        videoId = "dPlayerVideoMain" + "" + 12;
        PosType = 12;
      }


      let videoUrl = _this._SceneManager.GetVideoPathByPosType(PosType);

      if (videoUrl.includes(".m3u8")) {
        if (_Global.platform == "Android") {
          _this.$refs.playVideoM3u8.SetVideoFullScreen();
        } else {
          _this.$refs.playVideoM3u8IOS.SetVideoFullScreen();
        }
      }

      if (videoUrl.includes(".mp4")) {
        _this.$refs['playVideo' + videoId].open()
        _this.$refs['playVideo' + videoId].SetVideoFullScreen();
      }



      //判断会议厅大屏和演唱会大屏是否在播直播流。 
      // 如果播放直播流，则全屏直播流画面


      // _this.$refs.playVideo.open()
      // _this.$refs.playVideo.SetVideoFullScreen();
    }
    _Global.SetVideoFullScreen = this.SetVideoFullScreen;

    // id设置全屏视频播放 签到处
    this.SetVideoFullScreenByid = (id) => {

      let videoUrl = _this._SceneManager.GetVideoPathByPosType(id);
      if (videoUrl == null) { return; }
      _this.$refs.playVideo.PlayVideoStream(videoUrl);
      _this.$refs.playVideo.open();
      _this.$refs.playVideo.SetVideoFullScreen();

      return;


      _this.$refs['playVideodPlayerVideoMain' + id].open()
      _this.$refs['playVideodPlayerVideoMain' + id].SetVideoFullScreen();
    }
    _Global.SetVideoFullScreenByid = this.SetVideoFullScreenByid
    // id设置视频声音
    this.SetVideoMutedByid = (b, id) => {
      _this.$refs['playVideodPlayerVideoMain' + id].SetVideoMuted(b);
    }
    _Global.SetVideoMutedByid = this.SetVideoMutedByid;


    // 设置视频禁用播放  true：静音   false：取消静音
    this.SetVideoMuted = function (b) {
      _this.$refs.playVideo.SetVideoMuted(b);
    }
    _Global.SetVideoMuted = this.SetVideoMuted;


    let goPosNum = "";
    //向界面发送玩家当前处在几层的传送点
    this.SetInFloorNum = function (floor, jumpNum) {
      goPosNum = jumpNum;

      if (_Global.SetInFloorNum == null) { return; }
      _Global.SetInFloorNum(floor);
    }
    // 接收界面发送过来的，传送到第几层
    this.SetGoFloorNum = function (floor) {
      let jumpPosId = "playerPos_" + floor + "_" + goPosNum;
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(jumpPosId);
    }
    _Global.SetGoFloorNum = this.SetGoFloorNum;


    // 操作提示
    this.displayTip = function () {
      console.log(" 操作提示 ");
      if (_Global.showLayer == null) { return; }
      _Global.showLayer('J_opTipLayer');
    }

    // 关闭弹窗，视角复原
    this.CloseDialogPanel = function () {
      _this.CloseDialogPanel();

      if (_Global.notIn3D == null) { return; }
      _Global.notIn3D();
    }

    // 如果3d加载好了能点击跳转时候 执行一下
    this.load3dComplete = function () {
      console.log(" 如果3d加载好了能点击跳转时候 执行 ");
      if (_Global.load3dComplete == null) { return; }
      _Global.load3dComplete();
    }

    // 再次开始游戏，跳转到游戏装置前
    this.BeginAgineGame = function () {
      // 隐藏热点
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPointObjDisplay(
        "game",
        false
      );

      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCamPosAndRota(
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetCamPosAndRota(
          "game"
        ), () => {
          this.BeginGame();
        }
      );


      //显示地面热点
      _this.SetFootHotPointDisplay(false);
    }

    //设置渲染分辨率，默认1，有锯齿但流畅。提高分辨率可能会卡顿
    this.SetPixelRatio = function (f) {
      _this.$refs.YJmetaBase.ThreejsHumanChat.SetPixelRatio(f);
    }

    //发送加载进度
    this.SendLoadingProcess = function (f) {
      // console.log("发送加载进度 " + f);
      if (_Global.load3dPercent == null) { return; }
      _Global.load3dPercent(f);// 3d加载进度   0-1 
    }


    //发送3d转2d对应的id和坐标
    this.SendProjectionUI = function (data) {
      if (_Global.getProductPos == null) { return; }
      _Global.getProductPos(data);//  
    }

    // setTimeout(() => {
    //   this.BeginAgineGame ();
    // }, 5000);

    // 从弹窗返回
    _Global.CloseDialogPanel = this.CloseDialogPanel;

    // 跳转到装置前，传装置id。装置id统一
    _Global.ChangeViewById = this.ChangeViewById;

    // 跳转到 指定位置名的位置  如  _Global.ChangeViewByName("door")
    _Global.ChangeViewByName = this.ChangeViewByName;

    // 点击游戏开始按钮
    _Global.BeginGame = this.BeginGame;

    //再次游戏
    _Global.BeginAgineGame = this.BeginAgineGame;

    //设置渲染分辨率，默认1，有锯齿但流畅。提高分辨率可能会卡顿
    _Global.SetPixelRatio = this.SetPixelRatio;


    //强制激活3d操作
    _Global.ActiveThree3D = this.ActiveThree3D;




    //设置其他角色到舞台视角
    _Global.SetAllPlayerToStageView = this.SetAllPlayerToStageView;
    _Global.SetPlayerToStage = this.SetPlayerToStage;


    // 切换角色皮肤、换角色模型

    // _Global.ChangeAvatar("female");
    // _Global.ChangeAvatar("male");
    this.ChangeAvatar = function (avatarName) {
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.ChangeAvatar(avatarName);
      _this.$refs.YJDync._YJDyncManager.ChangeAvatar(avatarName);

      let state = {
        type: "切换皮肤",
        avatarName: avatarName,
      }
      // 发送同步状态
      _this.$refs.YJDync._YJDyncManager.SetPlayerState(state);

      _Global.DelDengPai();
      _Global.SetPlayerAnim("idle");

    }
    _Global.ChangeAvatar = this.ChangeAvatar;


    // 气球雨。 b打开或关闭气球雨、 colorGroup 颜色组  1黄紫  2粉紫
    this.BalloonRain = function (b, colorGroup) {
      _this._SceneManager.BalloonRain(b, colorGroup);
    }
    _Global.BalloonRain = this.BalloonRain;

    let hasLightStick = false;
    // 拿荧光棒应援棒
    this.PickLightStick = function (LightStickName) {
      let state = PickLightStickFn(LightStickName);
      hasLightStick = state.modelPath != "";
      // 发送同步状态
      _this.$refs.YJDync._YJDyncManager.SetPlayerState(state);
    }
    _Global.PickLightStick = this.PickLightStick;
    this.CancelLightStick = function () {
      if (hasLightStick) {
        _Global.PickLightStick();
      }
      if (hasDengPai) {
        _Global.PickDengPai();
      }
    }
    _Global.CancelLightStick = this.CancelLightStick;


    //本地角色拿应援棒并挥动
    function PickLightStickFn(LightStickName) {
      let modelPath = "";
      let animName = "brandish";
      if (LightStickName == 1 || LightStickName == 2 || LightStickName == 3) {
        modelPath = texiaoData.lightStickList[LightStickName - 1].modelPath;
      } else {
        animName = "idle";
      }
      let state = {
        type: "单手拿物品",
        modelPath: modelPath,
        boneName: "CC_Base_R_Hand", //荧光棒参考骨骼 
        animName: animName,
        modelList: texiaoData.lightStickList,
      }
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.DyncPlayerState(state);

      // 播放挥动应援棒动作
      _Global.SetPlayerAnim(animName);
      return state;
    }






    //由后台控制强制拿起应援棒并挥动
    this.AllPickLightStick = function (b) {

      //自身和所有角色镜像
      if (b) {

      } else {
      }
      let state = PickLightStickFn(b ? 1 : undefined);

      hasLightStick = state.modelPath != "";
      _this.$refs.YJDync.SetAllPlayerPickLightStick(state);

    }
    _Global.AllPickLightStick = this.AllPickLightStick;



    let hasDengPai = false;
    // 拿荧光棒应援棒
    this.PickDengPai = function (LightStickName) {
      let state = PickDengPaiFn(LightStickName);
      hasDengPai = state.modelPath != "";
      // 发送同步状态
      _this.$refs.YJDync._YJDyncManager.SetPlayerState(state);
    }
    _Global.PickDengPai = this.PickDengPai;
    this.CancelDengPai = function () {
      if (hasDengPai) {
        _Global.PickDengPai();
      }
    }
    _Global.CancelDengPai = this.CancelDengPai;

    this.DelDengPai = function () {

      let state = {
        type: "单手拿物品",
        modelPath: "",
      }
      _this.$refs.YJDync.DelAllPlayerPickLightStick(state);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.DyncPlayerState(state);

    }
    _Global.DelDengPai = this.DelDengPai;





    //本地角色拿应援棒并挥动
    function PickDengPaiFn(num) {
      let modelPath = "";
      let animName = "dengpai";
      if (num != undefined) {
        //
        modelPath = texiaoData.dengPaiList[num - 1].modelPath;
      } else {
        animName = "idle";
      }
      let state = {
        type: "单手拿物品",
        modelPath: modelPath,
        boneName: "CC_Base_L_ElbowPart2", // 灯牌 参考骨骼
        animName: animName,
        modelList: texiaoData.dengPaiList,
      }

      _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.DyncPlayerState(state);

      // 播放挥动应援棒动作
      _Global.SetPlayerAnim(animName);
      return state;
    }

    //由后台控制强制拿起应援棒并挥动
    this.AllPickDengPai = function (b) {
      //自身和所有角色镜像
      if (b) {
        let state = PickDengPaiFn(1)
        hasLightStick = state.modelPath != "";
        _this.$refs.YJDync.SetAllPlayerState(state);

      } else {
        let state = PickDengPaiFn();
        hasLightStick = state.modelPath != "";
        _this.$refs.YJDync.SetAllPlayerState(state);
      }
    }
    _Global.AllPickDengPai = this.AllPickDengPai;





    //由后台控制强制 鼓掌
    this.AllHandClap = function (b) {
      // console.error("由后台控制强制 鼓掌",b);
      let state = {
        type: "设置角色动作",
        animName: ""
      }
      //自身和所有角色镜像
      // if (b) {
      //   state.animName = _Global.allSitting ? "seatclap" :"handClap";
      // } else {
      //   state.animName = _Global.allSitting ?"sitting": "idle";
      // }


      if (b) {
        state.animName = "鼓掌";
      } else {
        state.animName = "取消鼓掌";
      }

      let animName = "";
      let currentAnimNam = _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.GetCurrentAnim();
      if (state.animName == "鼓掌") {
        if (currentAnimNam == "sitting") {
          animName = "seatClap";
        } else {
          animName = "handClap";
        }
      }
      if (state.animName == "取消鼓掌") {
        if (currentAnimNam == "seatClap") {
          animName = "sitting";
        } else {
          animName = "idle";
        }
      }
      console.log("鼓掌时自身角色播放动画", animName);
      _Global.SetPlayerAnim(animName);

      // _Global.SetPlayerAnim(state.animName);
      _this.$refs.YJDync.SetAllPlayerState(state);

      _Global.DelDengPai();
    }
    _Global.AllHandClap = this.AllHandClap;


    //控制指定id热点的显示或隐藏
    this.SetHotPointModelDisplay = function (id, b) {
      let hotPointJS = _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointJSById(id);
      if (hotPointJS == null) { return; }
      hotPointJS.SetPointObjDisplay(b);
    }


    _Global.SetHotPointModelDisplay = this.SetHotPointModelDisplay;

    let playfirework = false;
    this.PlayFireWorks = function (b) {
      _Global.PlayFireWorksFn(b); return;
      playfirework = !playfirework;
      //单人发送，向其他人同步
      // let state = {
      //   type: "播放烟花",
      // }
      // // 发送同步状态
      // _this.$refs.YJDync._YJDyncManager.SetPlayerState(state);
      // _Global.PlayFireWorksFn();



      // 接收后台控制烟花播放
      _Global.PlayFireWorksFn(playfirework);
    }

    let fireworkLater = null;
    this.PlayFireWorksFn = function (b) {

      if (_Global.sceneName != "MusicScene") {
        return;
      }
      _Global.SetHotPointModelDisplay('烟花0', b)
      _Global.SetHotPointModelDisplay('烟花1', b)
      _Global.SetHotPointModelDisplay('烟花2', b)

      console.log("启动烟花============");

      // _Global.SetHotPointModelDisplay('yanhua001', b)
      // _Global.SetHotPointModelDisplay('yanhua002', b)
      // _Global.SetHotPointModelDisplay('yanhua003', b)
      // _Global.SetHotPointModelDisplay('yanhua004', b)
      // _Global.SetHotPointModelDisplay('yanhua005', b)
      // _Global.SetHotPointModelDisplay('yanhua006', b)
      // _Global.SetHotPointModelDisplay('yanhua007', b)
      // _Global.SetHotPointModelDisplay('yanhua008', b)
      // if (fireworkLater != null) {
      //   clearTimeout(fireworkLater);
      // }
      // fireworkLater = setTimeout(() => {
      //   _Global.SetHotPointModelDisplay('yanhua001', false)
      //   _Global.SetHotPointModelDisplay('yanhua002', false)
      //   _Global.SetHotPointModelDisplay('yanhua003', false)
      //   _Global.SetHotPointModelDisplay('yanhua004', false)
      //   _Global.SetHotPointModelDisplay('yanhua005', false)
      //   _Global.SetHotPointModelDisplay('yanhua006', false)
      //   _Global.SetHotPointModelDisplay('yanhua007', false)
      //   _Global.SetHotPointModelDisplay('yanhua008', false)
      // }, 5000);
    }
    _Global.PlayFireWorks = this.PlayFireWorks;
    _Global.PlayFireWorksFn = this.PlayFireWorksFn;


    let chairList = null;
    let chairQuat = null;
    let allChairPos = [];
    this.GetChairPos = function (index) {
      if (chairList != null && chairList.length - 1 >= index) {
        return {
          pos: allChairPos[index],
          quat: chairQuat,
          animName: "sitting",
        }
      }
      return null;
    }
    _Global.GetChairPos = this.GetChairPos;

    // 设置全员落座，全员落座情况下，强制不同步角色信息
    this.AllSitting = function (b) {
      if (_Global.inFreeCamera) { return; }


      console.log("_Global.sceneName = ", _Global.sceneName);
      if (_Global.sceneName == "Scene2") {
        localStorage.setItem("needSitting", "11");
        _Global.ChangeScene("scene2");
        return;
      }
      if (_Global.sceneName != "MeetingScene") {
        return;
      }
      _Global.allSitting = b;

      let state = {
        type: "全员落座",
        animName: ""
      }
      //自身和所有角色镜像
      if (b) {
        state.animName = "sitting";
        // _Global.dontDync = true;


        //230520
        let currentAnimNam = _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.GetCurrentAnim();
        if (currentAnimNam == "sitting") {

        } else {
          // 获取所有用户uid，进行排序 230521
          let sort = _this.$refs.YJDync.GetAllPlayerSortByUID3(chairList.length);
          console.error("获取用户顺序", chairList.length, sort);
          // _this._YJGameManager.SetSittingModel(chairList[chairList.length - 1 - sort].GetGroup());
          _this._YJGameManager.SetSittingModel(chairList[sort].GetGroup());
        }


        // _this._YJGameManager.SetSittingModel(chairList[0].GetGroup());

        // console.log("找到所有座位信息 ", chairList); 

        // state.allChairPos = allChairPos;
        // state.quat = chairQuat;
        // _this.$refs.YJDync.SetAllPlayerState(state);

      } else {
        state.animName = "idle";
        // _Global.dontDync = false;
      }

      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMoving(!b);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMouseWheel(!b);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.CancelMoving();

      _Global.DelDengPai();





    }
    _Global.AllSitting = this.AllSitting;


    _Global.dontDync = false;
    _Global.allSitting = false;
    //自由视角
    _Global.inFreeCamera = false;

    this.DirectSendUserData = function () {
      _this.$refs.YJDync.DirectSendUserData();
    }
    _Global.DirectSendUserData = this.DirectSendUserData;


    this.SelfCloseConnect = function () {
      _this.$refs.YJDync._YJDyncManager.SelfCloseConnect();
    }
    _Global.SelfCloseConnect = this.SelfCloseConnect;


    // 检测渲染器是否渲染正常。如跨域视频播放检测
    this.checkRendererInvaild = function () {
      return _this.$refs.YJmetaBase.ThreejsHumanChat.checkRendererInvaild();
    }
    _Global.checkRendererInvaild = this.checkRendererInvaild;



    /** 刷新签到墙上名字
  *@param username: 自身签到
  **/
    this.UpdateSelfIdWall = function (username) {
      _this._SceneManager.GetSignInWall().UpdateSelfIdWall(_this.userName);
    }
    _Global.UpdateSelfIdWall = this.UpdateSelfIdWall;

    /** 刷新签到墙上名字
  *@param usernames: 只接收数组 ['',''] 
  **/
    this.UpdateIdWall = function (usernames) {
      if (_this._SceneManager != null && _this._SceneManager.GetSignInWall() != null) {
        _this._SceneManager.GetSignInWall().UpdateIdWall(usernames);
      }
    }
    _Global.UpdateIdWall = this.UpdateIdWall;


    this.ChangeNPCAnim = function (npcid, animName) {
      _this._SceneManager.ChangeNPCAnim(npcid, animName)
      // _Global.ChangeNPCAnim("npc_10002","direct");
    }
    _Global.ChangeNPCAnim = this.ChangeNPCAnim;



    this.GetnpcPointToCamDistance = function () {
      return _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetnpcPointToCamDistance();
    }
    _Global.GetnpcPointToCamDistance = this.GetnpcPointToCamDistance;


    // 换装
    this.ChangeSkin = function (part, num,gander) {

      let playerState = {
        part: part,
        num: num,
        gander: gander,
      }
      let state = {
        type: "换装",
        playerState: playerState,
      }

      _this.ChangeSkin(_this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer, "YJtest", playerState);

      // 发送同步状态
      _this.$refs.YJDync._YJDyncManager.SetPlayerState(state);
    }
    _Global.ChangeSkin = this.ChangeSkin;


    //打开邀请码输入框
    this.OpenInvitePanel = function () {

    }
    _Global.OpenInvitePanel = this.OpenInvitePanel;

    // 使用邀请码重新登录
    this.ReLoginUseInviteCode = function (_inviteCode) {
      _this.$refs.YJDync._YJDyncManager.ReLoginUseInviteCode(_inviteCode);
    }
    _Global.ReLoginUseInviteCode = this.ReLoginUseInviteCode;


    // 获取角色位置
    this.GetPlayerPos = function () {
      return _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetPlayerPosReduceHeight();
    }
    _Global.GetPlayerPos = this.GetPlayerPos;


    // 隐藏角色脚下光圈
    this.HiddenProjector = function () {
      _this._YJGameManager.HiddenProjector();
    }
    _Global.HiddenProjector = this.HiddenProjector;
    
    // log
    this.AddLog = function (content, type) {
      // return;
      // 发送同步状态
      _this.$refs.logPanel.AddLog(content, type);
    }
    _Global.AddLog = this.AddLog;

  }
}


export { Interface };