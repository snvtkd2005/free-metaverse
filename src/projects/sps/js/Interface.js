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
    this.ActiveThree3D = function () {
      _this.$refs.YJmetaBase.ThreejsHumanChat.SetCanAddControllerListner(true);
      _this.$refs.YJmetaBase.addThreeJSfocus();
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.DirectToBeforePos();
      _this.otherLoadManager.CloseGame();
      _this.animModelId = "";
      // _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.ChangeCtrlState();
    }

    this.BeginGame = function () {
      _this.InterfaceMsg("开始游戏");
    }

    // 点击热点，加载热点数据，传入热点id
    this.LoadData = function (id) {

      if (id == "npc001") {
      }
      if (_Global.showLayer == null) { return; }
      _Global.showLayer("npc", { id: id });
    }

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


    this.ClickMachine = function (id) {
      if (_Global.clickMachine == null) { return; }

      _Global.clickMachine(id);
    }

    this.ShowBack = function () {
      if (_Global.showLayer == null) { return; }
      // _Global.showLayer("J_backLayer");
    }

    this.hasIn3D = function () {
      if (_Global.hasIn3D == null) { return; }
      _Global.hasIn3D();
    }

    // 提交游戏结果
    // this.submitGame = function (success,time) {
    //   _Global.submitGame( JSON.stringify({ success: success,time:time }));
    // }

    this.submitGame = function (msg) {

      console.log("提交游戏状态 " + msg);
      if (_Global.submitGame == null) { return; }

      if (msg == "游戏开始") {
        // _Global.submitGame( JSON.stringify({ start:true}));
        _Global.submitGame({ start: true });
      }

      if (msg == "游戏完成") {
        // _Global.submitGame( JSON.stringify({ end:true}));
        // _Global.showLayer("J_backLayer");
        _Global.submitGame({ end: true });
      }
    }

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


    this.SetTriggerOverlap = (b, id, name) => {
      console.log(" 设置trigger 重叠状态 ", b, " id = ", id);
      // if (id.includes("jump")) {
      //   let sp = id.split("_");
      //   let jumpPos = "playerPos_"+sp[1];
      //   _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(jumpPos);
      // }

      if (_Global.SetTriggerOverlap == null) { return; }
      _Global.SetTriggerOverlap({ state: b, id: id });
    }


    //发送3d转2d对应的id和坐标
    this.SendProjectionUI = function (data) {
      if (_Global.getProductPos == null) { return; }
      _Global.getProductPos(data);//  
    }
    this.SetGoFloor = (floor) => {
      if (floor.includes("jump")) {
        let sp = floor.split("_");
        let jumpPos = "playerPos_" + sp[1];
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ChangeViewByIdDirect(jumpPos);
      }

    }
    _Global.SetGoFloor = this.SetGoFloor;

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


    // 弹窗确认要乘车
    this.SetTakingCar = (floor) => {
      // console.log(floor);
      if(floor == "FirstFloor"){

      }
      if(floor == "SecondFloor"){

      }
      _this._SceneManager.SetReadyCar(floor);
      
    }
    _Global.SetTakingCar = this.SetTakingCar;


  }
}


export { Interface };