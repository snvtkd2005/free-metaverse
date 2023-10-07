import * as THREE from "three";



// Threejs 中的事件传出接口

//所有 this.functionHandle 用来传出threejs中的操作，由threejs调用。界面开发人员无需关心

//所有 this.function 是已绑定界面逻辑的_Global.function。_Global.function = this.function 绑定后，界面即可调用threejs中的操作。由界面逻辑调用。 先用_Global绑定

//所有 _Global.function 是界面中创建并绑定的，由threejs调用 

class Interface {
  // _this 为三维主页面vue
  constructor(_this) {

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

    this.changeScene = function (e) {

      // _this.$refs.YJDync._YJDyncManager.SelfCloseConnect();
      // _this.ChangeRouter();return;
       
      _this._SceneManager.ClearMovieVideo();
      _this.$refs.YJmetaBase.ThreejsHumanChat.touchTime = 0;

      _Global.DelDengPai();
      _Global.SetPlayerAnim("idle");
      _this.$refs.scenePanel.ChangeScene(e);
    }
    _Global.ChangeScene = this.changeScene;

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
    this.SetPlayerExpression = function (expressionPath) {
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerExpression(expressionPath);
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


    _Global.ChangeScene = this.changeScene;
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
      let videoId = "";
      if (_Global.sceneName == "Scene2") {
        videoId = "dPlayerVideoMain" + 5;
      }

      if (_Global.sceneName == "MeetingScene") {
        videoId = "dPlayerVideoMain" + "" + 9;
      }

      if (_Global.sceneName == "MusicScene") {
        videoId = "dPlayerVideoMain" + "" + 12;
      }
      _this.$refs['playVideo' + videoId].open()
      _this.$refs['playVideo' + videoId].SetVideoFullScreen();


      // _this.$refs.playVideo.open()
      // _this.$refs.playVideo.SetVideoFullScreen();
    }
    _Global.SetVideoFullScreen = this.SetVideoFullScreen;

    // id设置全屏视频播放 签到处
    this.SetVideoFullScreenByid = (id) => {

      let videoUrl = _this._SceneManager.GetVideoPathByPosType(id);
      if(videoUrl == null){return;}
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


    let lightStickList = [
      "models/playerSkin/yyb002_0408a.glb",
      "models/playerSkin/yyb005_0408a.glb",
      "models/playerSkin/yyb006_0408a.glb",
    ]
    //本地角色拿应援棒并挥动
    function PickLightStickFn(LightStickName) {
      let modelPath = "";
      let animName = "brandish";
      if (LightStickName == 1 || LightStickName == 2 || LightStickName == 3) {
        modelPath = lightStickList[LightStickName - 1];
      } else {
        animName = "idle";
      }
      let state = {
        type: "单手拿物品",
        modelPath: modelPath,
        boneName: "CC_Base_R_Hand", //荧光棒参考骨骼 
        animName: animName,
        modelList: lightStickList,
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


    let dengPaiList = [
      "models/playerSkin/dengpai/dengpai_jikejunyi.glb",
      "models/playerSkin/dengpai/dengpai_huyanbin.glb",
      "models/playerSkin/dengpai/dengpai_liuboxin.glb",
      "models/playerSkin/dengpai/dengpai_rongzuer.glb",
      "models/playerSkin/dengpai/dengpai_wangheye.glb",

      "models/playerSkin/dengpai/dengpai_wanglinkai.glb",
      "models/playerSkin/dengpai/dengpai_wangsulong.glb",
      "models/playerSkin/dengpai/dengpai_xilin.glb",
      "models/playerSkin/dengpai/dengpai_yuwenwen.glb",
      "models/playerSkin/dengpai/dengpai_zhangbichen.glb",

      "models/playerSkin/dengpai/dengpai_zhangliangying.glb",
      "models/playerSkin/dengpai/dengpai_zhouyan.glb",

      "models/playerSkin/dengpai/dengpai_boyuan.glb",


    ]
    //本地角色拿应援棒并挥动
    function PickDengPaiFn(num) {
      let modelPath = "";
      let animName = "dengpai";
      if (num != undefined) {
        modelPath = dengPaiList[num - 1];
      } else {
        animName = "idle";
      }
      let state = {
        type: "单手拿物品",
        modelPath: modelPath,
        boneName: "CC_Base_L_ElbowPart2", // 灯牌 参考骨骼
        animName: animName,
        modelList: dengPaiList,
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
      if (b) {
        state.animName = _Global.allSitting ? "seatclap" :"handClap";
      } else {
        state.animName = _Global.allSitting ?"sitting": "idle";
      }

      _Global.SetPlayerAnim(state.animName);
      _this.$refs.YJDync.SetAllPlayerState(state);
      _Global.DelDengPai();
    }
    _Global.AllHandClap = this.AllHandClap;


    //控制指定id热点的显示或隐藏
    this.SetHotPointModelDisplay = function (id, b) {
      let hotPointJS = _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointJSById(id);
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
        _Global.dontDync = true;
        if (chairList == null) {
          chairList = _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetHotPointJSListById("chair003");


          chairQuat = _this._YJGameManager.SetSittingModel(chairList[0].GetGroup());

          for (let i = 1; i < chairList.length; i++) {
            const element = chairList[i];
            allChairPos.push(_this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetWorldPosition(chairList[i].GetGroup()));
          }
        } else {
          _this._YJGameManager.SetSittingModel(chairList[0].GetGroup());
        }
        // console.log("找到所有座位信息 ", chairList); 

        state.allChairPos = allChairPos;
        state.quat = chairQuat;
        _this.$refs.YJDync.SetAllPlayerState(state);

      } else {
        state.animName = "idle";
        _Global.dontDync = false;
      }

      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMoving(!b);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCanMouseWheel(!b);
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.CancelMoving();

      _Global.DelDengPai();

    }
    _Global.AllSitting = this.AllSitting;


    _Global.dontDync = false;
    _Global.allSitting = false;

    this.DirectSendUserData = function () {
      _this.$refs.YJDync.DirectSendUserData();
    }
    _Global.DirectSendUserData = this.DirectSendUserData;


    this.SelfCloseConnect = function(){
      _this.$refs.YJDync._YJDyncManager.SelfCloseConnect();
    }
    _Global.SelfCloseConnect = this.SelfCloseConnect;

  }
}


export { Interface };