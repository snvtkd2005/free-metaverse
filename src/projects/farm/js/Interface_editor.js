import * as THREE from "three";


import { YJPlayerAnimData } from "/@/threeJS/YJPlayerAnimData.js";
import { GetAllModel, RemoveFolderBase } from "./uploadThreejs.js";
import { YJPathfindingCtrl } from "/@/threeJS/pathfinding/YJPathfindingCtrl.js";
import { YJAudioManager } from "./YJAudioManager.js";

import IconData from "../data/iconData.js";

// Threejs 中的事件传出接口

//所有 this.functionHandle 用来传出threejs中的操作，由threejs调用。界面开发人员无需关心

//所有 this.function 是已绑定界面逻辑的_Global.function。_Global.function = this.function 绑定后，界面即可调用threejs中的操作。由界面逻辑调用。 先用_Global绑定

//所有 _Global.function 是界面中创建并绑定的，由threejs调用 

class Interface {
  // _this 为三维主页面vue
  constructor(_this, inEditor) {
    
    let eventList = [];
    // 添加事件监听
    this.addEventListener = function (e, fn) {
      eventList.push({ eventName: e, fn: fn });
    }
    _Global.addEventListener = this.addEventListener;

    // 执行事件
    this.applyEvent = function (e,v,v2,v3) {
      for (let i = 0; i < eventList.length; i++) {
        const element = eventList[i];
        if (element.eventName == e) {
          element.fn(v,v2,v3);
        }
      }
    }
    _Global.applyEvent = this.applyEvent;
    _Global.hasAvatar = true;

    
    // npc巡逻点模型
    let spare = new THREE.SphereGeometry(0.1, 10);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    _Global.setting = {
      inEditor: inEditor, //是否编辑模式
      navPointMesh: new THREE.Mesh(spare, material),
      DMGame:!inEditor,
    }
    _Global.user = {
      camp: 1000
    }
    _Global.inFocus = true; 

    let cursorUrl = null;
    // 切换光标
    function ChangeCursor(content) {
      if (cursorUrl == content) {
        return;
      }
      cursorUrl = content;
      // return;
      // console.log("切换光标", IconData.cursorList, content);
      for (let i = 0; i < IconData.cursorList.length; i++) {
        const element = IconData.cursorList[i];
        // console.log(element.content, content, element.content == content);
        if (element.content == content) {
          _Global.YJ3D.SetCursor(element.path==''?'':"./public/images/cursorList" + element.path);
          return;
        }
      }
    }


    _Global.MetaworldSize = 100;
    _Global.isSupportedHls = false;
    function init() {
      _Global.isSupportedHls = Hls.isSupported();
      RequestGetAllModel();


    }

    let modelsList = [];
    this.PickWeapon = function (YJPlayer, id) {
      for (let i = 0; i < modelsList.length; i++) {
        const element = modelsList[i];
        if (element.folderBase == id) {
          let weaponData = element.message.data;
          console.log("weaponData ", weaponData);

          YJPlayer.GetBoneVague(weaponData.boneName, (bone) => {
            if (YJPlayer.CheckPick(weaponData.boneName)) {
              if (bone.weaponModel) {
                bone.remove(bone.weaponModel);
              }
            }
            element.pos = { x: 0, y: 0, z: 0 };

            _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().ImportModel(element, (tranform) => {
              let weaponModel = tranform.GetGroup();
              bone.attach(weaponModel);
              bone.weaponModel = weaponModel;
              let pos = weaponData.position;
              let rotaV3 = weaponData.rotation;
              weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
              weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
              weaponModel.scale.set(100, 100, 100);
              // 绑定到骨骼后，清除trigger
              tranform.GetComponent("Weapon").DestroyTrigger();

              YJPlayer.AddPick(weaponData.boneName, bone);
            });
            // console.log("bone ",bone); 
          });
          return element;
        }
      }
    }
    _Global.PickWeapon = this.PickWeapon;


    async function RequestGetAllModel() {
      GetAllModel().then((res) => {
        // console.log("获取所有单品模型 ", res);
        //先记录旧照片
        if (res.data.txtDataList) {
          let txtDataList = res.data.txtDataList;

          modelsList = [];
          for (let i = 0; i < txtDataList.length; i++) {
            let element = txtDataList[i];
            try {
              modelsList.push(JSON.parse(element));
            } catch (error) {
              try {
                element = element.substring(1);
                modelsList.push(JSON.parse(element));
              } catch (error2) {

              }
            }
          }


          for (let i = 0; i < modelsList.length; i++) {
            let item = modelsList[i];
            if (item.modelType == "角色模型") {
              // 到角色数据中，模型路径、动画数据
              if(item.message){
                let data = item.message.data;
                data.modelPath = _this.$uploadUrl + item.modelPath;
                data.icon = "thumb.png";
                _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data);
              }
            } else {
              // this.modelsList.push(item);
            }
          }

          _Global.CreateOrLoadPlayerAnimData().UpdateBoneRefData();

        }
      });


      let res = await _this.$axios.get(
        _this.$uploadPlayerUrl + "anim_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.animList = res.data;

      res = await _this.$axios.get(
        _this.$uploadPlayerUrl + "skill_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.skillList = res.data;

      res = await _this.$axios.get(
        _this.$uploadPlayerUrl + "prop_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.propList = res.data;
      // console.log("_Global.animList = ", _Global.animList);
      // console.log("_Global.skillList = ", _Global.skillList);
    }

    // 移除folderBase
    async function RequestRemoveFolderBase(msg) {
      let fromData = new FormData();
      fromData.append("folderBase",msg.folderBase);
      fromData.append("type", msg.type);
      RemoveFolderBase(fromData).then((res) => {
        console.log(" 移除成功 ", res);
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


    this.DyncManager = function () {
      return _this._SceneManager.GetDyncManager();
    }
    
    this.YJDync = function () {
      return _this.$refs.YJDync;
    }


    init();

    this.YJ3D = function () {
      if(_this.$refs.YJmetaBase){
        return _this.$refs.YJmetaBase.ThreejsHumanChat;
      }
    }
    _Global.YJ3D = this.YJ3D();


    // 向3d页发送
    this.SendMsgTo3D = (type, msg) => {
      console.log("向3d页发送", type, msg);
      if (type == "删除folderBase") { 
        // _Global.SendMsgTo3D("删除folderBase",{type:"uploadsAudio/",folderBase:"1704941752535"});
        // _Global.SendMsgTo3D("删除folderBase",{type:"uploads/",folderBase:"1704941752535"});
        // _Global.SendMsgTo3D("删除folderBase",{type:"uploads/",folderBase:"wow_prefabs"});
        // _Global.SendMsgTo3D("删除folderBase",{type:"uploadsGroup/",folderBase:"1704941752535"});
        RequestRemoveFolderBase(msg);
        return;
      }

      if (type == "获取动作时间") {
        return _Global.YJ3D.YJPlayer.GetCurrentTime();
      }
      if (type == "切到后台") {
        _Global.YJ3D.enableRenderer = false;
        return;
      }
      if (type == "切到前台") {
        // _Global.restoreContext();
        _Global.YJ3D.enableRenderer = true;
        return;
      }

      if (type == "点击技能栏") {
        _Global.YJ3D.YJController.ChangeAnimDirect(msg);
        return;
      }

      if (type == "获取单品坐标旋转") {
        msg(_Global.YJ3D._YJSceneManager.GetSingleTransformPosRota());
        return;
      }

      if (type == "放下武器") {
        let singleTransform = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        if (singleTransform == null) { return; }
        let message = singleTransform.GetMessage();
        if (message == null) { return; }
        if (message.modelType != "装备模型") { return; }
        _Global.YJ3D._YJSceneManager.ResetSingleTransfomParent();
        return;
      }
      if (type == "编辑武器位置") {
        let singleTransform = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        _Global.YJ3D._YJSceneManager.GetTransformManager().SetRotaAxis(true, true, true);
        _Global.YJ3D._YJSceneManager.GetTransformManager().attach(singleTransform.GetGroup());

        return;
      }
      if (type == "取消编辑") {
        _Global.YJ3D._YJSceneManager.GetTransformManager().detach();
        return;
      }
      if (type == "单品在骨骼上位移") {
        _Global.YJ3D._YJSceneManager.SetSingleTransfomPosition(msg);
        return;
      }
      if (type == "单品在骨骼上旋转") {
        _Global.YJ3D._YJSceneManager.SetSingleTransfomRotation(msg);
        return;
      }
      if (type == "单品放置在骨骼上") {
        _Global.YJ3D.YJPlayer.GetBoneVague(msg, (bone) => {
          console.log("bone ", bone);
          _Global.YJ3D._YJSceneManager.SetSingleTransfomParent(bone);
        });
        return;
      }
      if (type == "切换角色动作") {
        _Global.YJ3D.YJController.ChangeAnimDirect(msg);
        return;
      }

      if (type == "显示隐藏九宫格") {
        _Global.YJ3D._YJSceneManager.GetAmmo().ToggleMetaWorldPlaneDisplay();
        return;
      }
      if (msg == "隐藏角色") {
        _Global.YJ3D.YJPlayer.DisplayAvatar(false);
        return;
      }
      if (msg == "显示角色") {
        _Global.YJ3D.YJPlayer.DisplayAvatar(true);
        return;
      }
      if (type == "场景") {
        if (msg == "还原到访问视角") {
          _Global.YJ3D._YJSceneManager.ResetPlayerPos();
          return;
        }
      }
      if (type == "设置雾") {
        _Global.YJ3D._YJSceneManager.SetFog(msg);
        return;
      }
      if (type == "单品") {
        if (msg == "隐藏碰撞体") {
          _Global.YJ3D._YJSceneManager.displayCollider(!false);

        }
        if (msg == "显示碰撞体") {
          _Global.YJ3D._YJSceneManager.displayCollider(!true);
        }

        if (msg == "激活碰撞体") {
          _Global.YJ3D._YJSceneManager.GetSingleModelTransform().DestroyCollider();
        }

        if (msg == "忽略碰撞体") {
          _Global.YJ3D._YJSceneManager.GetSingleModelTransform().CreateCollider(true);
        }
        return;
      }

      if (type == "添加组件") {
        _Global.YJ3D._YJSceneManager.AddComponent(msg.component, msg.data);
        return;
      }
      if (type == "刷新Transform") {
        _Global.YJ3D._YJSceneManager.UpdateTransform(msg);
        return;
      }
      if (type == "隐藏地面") {
        _Global.YJ3D._YJSceneManager.SetDisplayFloor(msg);
        return;
      }
    };
    _Global.SendMsgTo3D = this.SendMsgTo3D;


    // 由3d页发出
    this.ReportTo3D = (type, msg) => {

      if (type == "切换光标") {
        ChangeCursor(msg);
        return;
      }
      if (type == "设置技能进度条") {
        _Global.applyEvent("设置技能进度条",msg); 
        return;
      }
      if (type == "角色死亡") {
			  _this.$refs.HUD.$refs.fireStateUI.SetState("inDead",true);
				// 放下武器
        _Global._SceneManager.PickDownWeapon();
        return;
      }
      if (type == "坐标转地图id") {
        return _Global.YJ3D._YJSceneManager.CallPosToMapId(msg);
      }
      if (type == "获取开发世界坐标组") {
        return _this.sceneData.metaWorldCoordinate;
      }

      if (type == "设置角色位置") {
        _Global.YJ3D._YJSceneManager.SetPlayerPos(msg);
        return;
      }
      if (type == "获取角色位置") {
        _Global.YJ3D.GetLocalPlayerPos(msg);
        return;
      }

      if (type == "获取地图id缩略图") {
        _YJGlobal._SceneManagerMetaworld.CallGetFolderBaseByMapid(msg.id, msg.callback);
        return;
      }

      if (type == "传送") {

        let mapId = _Global.YJ3D._YJSceneManager.CallPosToMapId(msg);

        console.log("传送到的mapId = ", mapId);
        _YJGlobal._SceneManagerMetaworld.CallGetFolderBaseByMapid(mapId, (mapData) => {
          if (mapData == null) {
            _Global.YJ3D._YJSceneManager.SetPlayerPos(msg);
            return;
          }
          console.log(" 即将传送到场景 = ", msg, mapData.folderBase);

          _YJGlobal._SceneManagerMetaworld.CallLoadSceneDataByFolderBase(mapData.folderBase, (pos, rotaV3) => {
            pos.x += msg.x;
            pos.z += msg.z;
            _Global.YJ3D._YJSceneManager.SetPlayerPosRota(pos, rotaV3);
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
      _Global.YJ3D._YJSceneManager.enableHDR(b, path, isEnvmap);
    }
    _Global.enableHDR = this.enableHDR;

    // 画布背景色
    this.SetBackgroundColor = function (color) {
      _Global.YJ3D._YJSceneManager.SetBackgroundColor(color);
    }
    _Global.SetBackgroundColor = this.SetBackgroundColor;

    // 设置环境光强度
    this.SetAmbientLightIntensity = function (i) {
      _Global.YJ3D._YJSceneManager.SetAmbientIntensity(i);
    }
    _Global.SetAmbientLightIntensity = this.SetAmbientLightIntensity;


    // 第一人称 第三人称视角切换.改变camwheel 距离
    this.ChangeFirstThird = function (first) {
      _Global.YJ3D.YJController.SetCameraWheelPos(first ? 0 : -10);
    }
    _Global.ChangeFirstThird = this.ChangeFirstThird;


    // 重力是否开启 EnableGravity 
    this.SetEnableGravity = function (b) {
      _Global.YJ3D._YJSceneManager.GetAmmo().SetGravityActive(b);

      // if (!b) {
      //   _Global.YJ3D._YJSceneManager.GetAmmo().SetPlayerPos({ x: 0, y: 0.5, z: 1 });
      //   _Global.YJ3D.YJController.SetPlayerRota3({ x: 0, y: 3.14, z: 0 });
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
      _Global.YJ3D.YJController.SetPlayerAnimName(animName);

      if (_this.$refs.YJDync) {
        _this.$refs.YJDync._YJClient.DirectSendUserData();
      } 
    }
    //设置角色动作
    _Global.SetPlayerAnim = this.SetPlayerAnim;

    this.SetPlayerEmote = function (emote) {
      if(emote == "/dance"){
        _Global.SetPlayerAnim("dance");
      } 
    }
    _Global.SetPlayerEmote = this.SetPlayerEmote;




    let posList = ["door", "zyzbsj", "zycx", "zygy", "zbds", "wbds", "xzzj", "dfshub", "vote", "game", "collect"];

    // 传入装置id，视角跳转到装置正前方
    this.ChangeViewById = function (id) {
      _Global.YJ3D._YJSceneManager.ChangeViewByIdDirect(id);
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
      _Global.YJ3D._YJSceneManager.ChangeViewByIdDirect(id);


      _Global.YJ3D.SetCanAddControllerListner(true);
      _this.$refs.YJmetaBase.addThreeJSfocus();
      _Global.YJ3D.YJController.ChangeCtrlState();

      _this.otherLoadManager.CloseGame();
      _this.animModelId = "";

      if (id == "game") {
        _Global.YJ3D._YJSceneManager.SetPointObjDisplay(
          "game",
          true
        );
      }

      //显示地面热点
      _this.SetFootHotPointDisplay(true);

    }
    this.ActiveThree3D = function () {
      _Global.YJ3D.SetCanAddControllerListner(true);
      _this.$refs.YJmetaBase.addThreeJSfocus();
      _Global.YJ3D.YJController.DirectToBeforePos();
      _this.otherLoadManager.CloseGame();
      _this.animModelId = "";
      // _Global.YJ3D.YJController.ChangeCtrlState();
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

    let _YJAudioManager = null;
    let _YJPathfindingCtrl = null;
    this.GetNavpath = function (ZONE,fromPos, targetPos) {
      if (_YJPathfindingCtrl == null) {
        return null;
      }
      return _YJPathfindingCtrl.GetNavpath(ZONE,fromPos, targetPos);
    }
    this.CreateNavMesh = function (ZONE,mapParent) {
      _YJPathfindingCtrl.CreateNavMesh(ZONE,mapParent);
    }
    this.YJPathfindingCtrl = function () {
      return _YJPathfindingCtrl;
    }
    this.YJAudioManager = function () {
      return _YJAudioManager;
    }
    _Global.GetNavpath = this.GetNavpath;
    _Global.CreateNavMesh = this.CreateNavMesh;
    _Global.GetYJPathfindingCtrl = this.YJPathfindingCtrl;
    _Global.YJAudioManager = this.YJAudioManager;



    // 如果3d加载好了能点击跳转时候 执行一下
    this.load3dComplete = function () {
      console.log(" 如果3d加载好了能点击跳转时候 执行 ");
      InitWEBGL_lose_context();

      if (_YJPathfindingCtrl == null) {
        _YJPathfindingCtrl = new YJPathfindingCtrl(_Global.YJ3D.scene, () => {
          console.log("初始化寻路完成");
          // 调用所有npc的寻路
          // _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();
        });
        _YJAudioManager = new YJAudioManager(_this);
        
      }
      _Global.YJDync = this.YJDync();
      _Global.DyncManager = this.DyncManager();
      // 场景加载完成后，重新更新相机射线偏移，
      // 窗口大小位置不一样会导致射线偏移,所以需要重新计算
      if(_this.setPanelSize){
        _this.setPanelSize();
      } 
 
      _Global.applyEvent("3d加载完成");

    }

    // 再次开始游戏，跳转到游戏装置前
    this.BeginAgineGame = function () {
      // 隐藏热点
      _Global.YJ3D._YJSceneManager.SetPointObjDisplay(
        "game",
        false
      );

      _Global.YJ3D.YJController.SetCamPosAndRota(
        _Global.YJ3D._YJSceneManager.GetCamPosAndRota(
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
      _Global.YJ3D.SetPixelRatio(f);
    }

    //发送加载进度
    this.SendLoadingProcess = function (f) {
      // console.log("发送加载进度 " + f);
      if (_Global.load3dPercent == null) { return; }
      _Global.load3dPercent(f);// 3d加载进度   0-1 
    }


    this.SetTriggerOverlap = (b, id, name) => {
      // console.log(" 设置trigger 重叠状态 ", b, " id = ", id);
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
      _this.$refs.YJDync._YJClient.DirectSendUserData();
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
      let canvas = _Global.YJ3D.renderer.domElement;
      const gl = canvas.getContext("webgl2");
      WEBGL_lose_context = gl.getExtension("WEBGL_lose_context");
      canvas.addEventListener("webglcontextlost", (event) => {
        console.log(" webgl 上下文丢失 ", event); 
        setTimeout(() => {
          WEBGL_lose_context.restoreContext();
        }, 20);
      });
    }

    this.loseContext = function () {
      let canvas = _Global.YJ3D.renderer.domElement;
      const gl = canvas.getContext("webgl2");
      gl.getExtension("WEBGL_lose_context").loseContext();
    }
    _Global.loseContext = this.loseContext;
    // _Global.loseContext()

    this.restoreContext = function () {
      WEBGL_lose_context.restoreContext();
    }
    _Global.restoreContext = this.restoreContext;

  }
}


export { Interface };