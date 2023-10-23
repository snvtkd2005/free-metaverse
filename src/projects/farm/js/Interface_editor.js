import * as THREE from "three";

 
import { YJPlayerAnimData } from "/@/threeJS/YJPlayerAnimData.js";
import { GetAllModel } from "./uploadThreejs.js";

// Threejs 中的事件传出接口

//所有 this.functionHandle 用来传出threejs中的操作，由threejs调用。界面开发人员无需关心

//所有 this.function 是已绑定界面逻辑的_Global.function。_Global.function = this.function 绑定后，界面即可调用threejs中的操作。由界面逻辑调用。 先用_Global绑定

//所有 _Global.function 是界面中创建并绑定的，由threejs调用 

class Interface {
  // _this 为三维主页面vue
  constructor(_this) {

    _Global.MetaworldSize = 100;
    _Global.isSupportedHls = false;
    function init() {
      _Global.isSupportedHls = Hls.isSupported();
      RequestGetAllModel();
    }

    async function RequestGetAllModel() {

      GetAllModel().then((res) => {
        console.log("获取所有单品模型 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList; 

          let modelsList = [];
          for (let i = 0; i < txtDataList.length; i++) {
            let element = txtDataList[i];
            try {
              modelsList.push(JSON.parse(element));
            } catch (error) {
              element = element.substring(1);
              modelsList.push(JSON.parse(element));
            }
          }

          
          for (let i = 0; i < modelsList.length; i++) {
            let item = modelsList[i];
            if (item.modelType == "角色模型") {
              // 到角色数据中，模型路径、动画数据
              let data = item.message.data;
              data.modelPath = _this.$uploadUrl + item.modelPath;
              data.icon = item.icon;
              _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data);
            }else{
              // this.modelsList.push(item);
            }
          }


        }
      });
    }


    let _YJPlayerAnimData = null
    this.CreateOrLoadPlayerAnimData = function () {
      if (_YJPlayerAnimData != null) {
        return _YJPlayerAnimData;
      }
      _YJPlayerAnimData = new YJPlayerAnimData(_this);
      return _YJPlayerAnimData;
    }
    _Global.CreateOrLoadPlayerAnimData = this.CreateOrLoadPlayerAnimData;
    
    init();

    this.YJ3D = function () { 
      return _this.$refs.YJmetaBase.ThreejsHumanChat;
    }
    _Global.YJ3D = this.YJ3D();


    // 向3d页发送
    this.SendMsgTo3D = (type, msg) => {
      console.log("向3d页发送", type, msg);

      if (type == "切到后台") {
        _this.$refs.YJmetaBase.ThreejsHumanChat.enableRenderer = false;
        return;
      }
      if (type == "切到前台") {
        // _Global.restoreContext();
        _this.$refs.YJmetaBase.ThreejsHumanChat.enableRenderer = true;
        return;
      }

      if (type == "点击技能栏") {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerAnimName(msg);
        return;
      }

      if (type == "获取单品坐标旋转") {
        msg(_this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetSingleTransformPosRota());
        return;
      }

      if (type == "放下武器") {
        _this._SceneManager.PickDownWeapon();
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ResetSingleTransfomParent();
        return;
      }
      if (type == "编辑武器位置") {
        let singleTransform = _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetSingleModelTransform();
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.CreateOrLoad_TransformManager().SetRotaAxis(true, true, true);
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.CreateOrLoad_TransformManager().attach(singleTransform.GetGroup());

        return;
      }
      if (type == "取消编辑") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.CreateOrLoad_TransformManager().detach();
        return;
      }
      if (type == "单品在骨骼上位移") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetSingleTransfomPosition(msg);
        return;
      }
      if (type == "单品在骨骼上旋转") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetSingleTransfomRotation(msg);
        return;
      }
      if (type == "单品放置在骨骼上") {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.GetBoneVague(msg, (bone) => {
          console.log("bone ", bone);
          _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetSingleTransfomParent(bone);
        });
        return;
      }
      if (type == "切换角色动作") {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerAnimName(msg);
        return;
      }

      if (type == "显示隐藏九宫格") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetAmmo().ToggleMetaWorldPlaneDisplay();
        return;
      }
      if (msg == "隐藏角色") {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.DisplayAvatar(false);
        return;
      }
      if (msg == "显示角色") {
        _this.$refs.YJmetaBase.ThreejsHumanChat.YJPlayer.DisplayAvatar(true);
        return;
      }
      if (type == "场景") {
        if (msg == "还原到访问视角") {
          _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.ResetPlayerPos();
          return;
        }
      }
      if (type == "单品") {
        if (msg == "隐藏碰撞体") {
          _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.displayCollider(!false);

        }
        if (msg == "显示碰撞体") {
          _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.displayCollider(!true);
        }

        if (msg == "激活碰撞体") {
          _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetSingleModelTransform().DestroyCollider();
        }

        if (msg == "忽略碰撞体") {
          _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetSingleModelTransform().CreateCollider(true);
        }
        return;
      }

      if (type == "设置太阳光开关") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.VisibleDirectionalLight(msg);
        return;
      }

      if (type == "添加组件") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.AddComponent(msg.component, msg.data);
        return;
      }
      if (type == "刷新Transform") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.UpdateTransform(msg);
        return;
      }
      if (type == "隐藏地面") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetDisplayFloor(msg);
        return;
      }
    };
    _Global.SendMsgTo3D = this.SendMsgTo3D;


    this.ReportTo3D = (type, msg) => {
      if (type == "坐标转地图id") {
        return _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.CallPosToMapId(msg);
      }
      if (type == "获取开发世界坐标组") {
        return _this.sceneData.metaWorldCoordinate;
      }

      if (type == "设置角色位置") {
        _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPlayerPos(msg);
        return;
      }
      if (type == "获取角色位置") {
        _this.$refs.YJmetaBase.ThreejsHumanChat.GetLocalPlayerPos(msg);
        return;
      }

      if (type == "获取地图id缩略图") {
        _this._SceneManager.CallGetFolderBaseByMapid(msg.id, msg.callback);
        return;
      }

      if (type == "传送") {

        let mapId = _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.CallPosToMapId(msg);

        console.log("传送到的mapId = ", mapId);
        _this._SceneManager.CallGetFolderBaseByMapid(mapId, (mapData) => {
          if (mapData == null) {
            _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPlayerPos(msg);
            return;
          }
          console.log(" 即将传送到场景 = ", msg, mapData.folderBase);

          _this._SceneManager.CallLoadSceneDataByFolderBase(mapData.folderBase, (pos, rotaV3) => {
            pos.x += msg.x;
            pos.z += msg.z;
            _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetPlayerPosRota(pos, rotaV3);
          });
        });
        return;
      }
    }
    // 由3d页传出
    _Global.ReportTo3D = this.ReportTo3D;


    // 显示碰撞体
    this.enableHDR = function (b, path, isEnvmap) {
      // console.log(" 显示碰撞体 ",b);
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.enableHDR(b, path, isEnvmap);
    }
    _Global.enableHDR = this.enableHDR;

    // 画布背景色
    this.SetBackgroundColor = function (color) {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetBackgroundColor(color);
    }
    _Global.SetBackgroundColor = this.SetBackgroundColor;

    // 设置环境光强度
    this.SetAmbientLightIntensity = function (i) {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetAmbientIntensity(i);
    }
    _Global.SetAmbientLightIntensity = this.SetAmbientLightIntensity;

    //保存角色初始位置和角度
    this.SavePlayerPos = function () {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SavePlayerPos();
    }
    _Global.SavePlayerPos = this.SavePlayerPos;


    //添加UV动画数据
    this.AddUVAnimToTransform = function (gifData) {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.AddUVAnimToTransform(gifData);
    }
    _Global.AddUVAnimToTransform = this.AddUVAnimToTransform;

    // 是否显示地面
    this.SetDisplayFloor = function (b) {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.SetDisplayFloor(b);
    }
    _Global.SetDisplayFloor = this.SetDisplayFloor;




    // 第一人称 第三人称视角切换.改变camwheel 距离
    this.ChangeFirstThird = function (first) {
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetCameraWheelPos(first ? 0 : -10);
    }
    _Global.ChangeFirstThird = this.ChangeFirstThird;


    // 重力是否开启 EnableGravity 
    this.SetEnableGravity = function (b) {
      _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetAmmo().SetGravityActive(b);

      // if (!b) {
      //   _this.$refs.YJmetaBase.ThreejsHumanChat._YJSceneManager.GetAmmo().SetPlayerPos({ x: 0, y: 0.5, z: 1 });
      //   _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerRota3({ x: 0, y: 3.14, z: 0 });
      // }
    }
    _Global.SetEnableGravity = this.SetEnableGravity;


    // 角色选择完成
    this.SelectPlayerCompleted = (selectPlayerName, userName) => {
      if (_Global.setCharacter == null) { return; }
      // console.error(" 发送 角色选择完成 ");
      _Global.setCharacter({ char_ext: selectPlayerName, nickname: userName });
      _Global.char_ext = selectPlayerName;
    }


    this.SetPlayerAnim = function (animName) {
      _this.$refs.YJmetaBase.ThreejsHumanChat.YJController.SetPlayerAnim(animName);

      if (_this.$refs.YJDync) {
        _this.$refs.YJDync.DirectSendUserData();
      }

    }
    //设置角色动作
    _Global.SetPlayerAnim = this.SetPlayerAnim;




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

    this.changeScene = function (e) {
      //websocket 切换房间\切换时， 取消同步状态、点开链接或重连
      _this.$refs.scenePanel.ChangeScene(e);
    }
    _Global.ChangeScene = this.changeScene;

    // 点击热点，加载热点数据，传入热点id
    this.LoadData = function (id) {

      if (id == "npc001") {
      }
      if (_Global.showLayer == null) { return; }
      _Global.showLayer("npc", { id: id });
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
      InitWEBGL_lose_context();

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


    // 直接发送角色数据更新。角色移动为每秒发送一次，其他的角色状态要立即发送
    this.DirectSendUserData = function () {
      _this.$refs.YJDync.DirectSendUserData();
    }
    _Global.DirectSendUserData = this.DirectSendUserData;


    this.PlayVideoStream = function (url, type) {
      console.log('url', url);
      if (_this.$refs.playVideo) {
        _this.$refs.playVideo.PlayVideoStream(url, type);
      }
    }
    _Global.PlayVideoStream = this.PlayVideoStream;


    this.PlayVideoById = function (id) {
      if (_this.$refs.playVideo) {
        _this.$refs.playVideo.play();
      }
    }
    _Global.PlayVideoById = this.PlayVideoById;


    // 每秒同步次数
    _Global.dyncUpdateFrame = 25;


    let WEBGL_lose_context = null;
    function InitWEBGL_lose_context() {
      let canvas = _this.$refs.YJmetaBase.ThreejsHumanChat.renderer.domElement;
      const gl = canvas.getContext("webgl2"); 
      WEBGL_lose_context = gl.getExtension("WEBGL_lose_context");
      canvas.addEventListener("webglcontextlost", (event) => {
        console.log(" webgl 上下文丢失 ", event);
        setTimeout(() => {
          WEBGL_lose_context.restoreContext();
        }, 3000);
      });
    }

    this.loseContext = function () { 
      let canvas = _this.$refs.YJmetaBase.ThreejsHumanChat.renderer.domElement;
      const gl = canvas.getContext("webgl2"); 
      gl.getExtension("WEBGL_lose_context").loseContext();
    }
    _Global.loseContext = this.loseContext;
    // _Global.loseContext()

    this.restoreContext = function(){
      WEBGL_lose_context.restoreContext();
    }
    _Global.restoreContext = this.restoreContext;
     
  }
}


export { Interface };