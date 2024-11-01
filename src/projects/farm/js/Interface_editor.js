
import { YJPlayerAnimData } from "/@/threeJS/common/YJPlayerAnimData.js";
import { GetAllModel, RemoveFolderBase } from "./uploadThreejs.js";
import { YJPathfindingCtrl } from "/@/threeJS/pathfinding/YJPathfindingCtrl.js";
import { YJAudioManager } from "./YJAudioManager.js";
import { YJGame_mainCtrl } from "/@/threeJS/game/YJGame_mainCtrl.js";



import IconData from "../data/iconData.js";
import GameSetting from "../data/platform/GameSetting.js";
import NPCheadUpModelItems from "../data/platform/NPCheadUpModelItems.js";
 
// Threejs 中的事件传出接口

//所有 this.functionHandle 用来传出threejs中的操作，由threejs调用。界面开发人员无需关心

//所有 this.function 是已绑定界面逻辑的_Global.function。_Global.function = this.function 绑定后，界面即可调用threejs中的操作。由界面逻辑调用。 先用_Global绑定

//所有 _Global.function 是界面中创建并绑定的，由threejs调用 

class Interface {
  // _this 为三维主页面vue
  constructor(_this, inEditor) {

    _Global.hasAvatar = true;
    _Global.mainPlayerIsDead = false;
    _Global.inDragProp = false;
    _Global.inDragAction = false;
    // _Global.isMobile = false;

    _Global.user = {
      camp: 1000,
      id:"YJPlayer",
      name:"",
      avatarId:0,
      currentTaskList:[],
      canCompletedTaskList:[],
      completedTaskList:[],
    }
    _Global.url = {
      local:"./public/",
      uploadUrl: _this.$uploadUrl,
      uploadHDRUrl:_this.$uploadHDRUrl,
      uploadGroupUrl: _this.$uploadGroupUrl,
      uploadUVAnimUrl: _this.$uploadUVAnimUrl,
    } 
    // 每秒同步次数
    _Global.dyncUpdateFrame = 25;
    _Global.setting = {
      inEditor: inEditor, //是否编辑模式 
      DMGame: !inEditor,
    }
    _Global.inFocus = true;
    _Global.infocus3d = true;
    _Global.panelState = {
      player: false, 
      skill: false,
      bagBase: false,
      mainmenu: false,
      setting: false,
      task:false,//接收任务对话框
      taskList:false, //任务日志
      talk:false, //与npc的对话框
      shop:false, //商人 
    };
    _Global.hoverPart = "";
    _Global.dragPart = "";
    //#region 游戏设置记录与还原、动作条记录与还原

    function ff (local,localStorage,sameFiled,valueFiled){
      for (let i = 0; i < local.length; i++) {
        for (let j = 0; j < localStorage.length; j++) {
          if(local[i][sameFiled] == localStorage[i][sameFiled]){
            local[i][valueFiled] = localStorage[i][valueFiled];
          }
        }
      }
    }
    // 游戏设置记录与还原
    _Global.GameSetting = GameSetting;
    function LoadLocalGameSetting() {
      let _gs = localStorage.getItem("GameSetting");
      if (_gs) {
        try {
          let settingData = JSON.parse(_gs);
          settingData.key2keytext = undefined;
          console.log("  localStorage GameSetting ",settingData);

          if(settingData.keyData.actionBar1){
            ff( GameSetting.keyData.actionBar1,settingData.keyData.actionBar1,"title","key");
          }

          let names = Object.getOwnPropertyNames(settingData);

          // console.log(" settingData names ",names);

          // 第一层主菜单
          for (let i = 0; i < names.length; i++) {
            const children = names[i];
            if(children == "key2keytext"){
              continue;
            }
            let childrennames = Object.getOwnPropertyNames(settingData[children]);
            // console.log(" settingData 第二层菜单下分类 ",childrennames);
            // 第二层菜单下分类
            for (let j = 0; j < childrennames.length; j++) {
              const element = childrennames[j];
              if(element=="field"){
                continue;
              }

              let ar = settingData[children][element];
              let car = GameSetting[children][element]; 
 
              for (let k = 0; k < ar.length; k++) {
                // 第三层每一条
                const arelement = ar[k];
                for (let l = 0; l < car.length; l++) {
                  const carelement = car[l];
                  if( arelement.field == carelement.field){
                    carelement.value =  arelement.value;
                  }
                }
              } 
            }
          }
          // console.log("_Global.GameSetting ",GameSetting);
          _Global.GameSetting = GameSetting;
          _Global.user.camp = _Global.GameSetting.live.children[2].value;
          if(_Global.GameSetting.control.playerCtrl && _Global.GameSetting.control.playerCtrl[0].field == 'isMobile' ){
            setTimeout(() => {
              _Global.isMobile = _Global.GameSetting.control.playerCtrl[0].value;
              _Global.applyEvent("是否启用虚拟摇杆", _Global.isMobile);
            }, 2000);
          }
          console.log(" _Global.GameSetting ",_Global.GameSetting);
          
        } catch (error) {
          console.log("_Global.GameSetting error ",error);
        }
      }


    }
    this.SaveGameSetting = function () {
      localStorage.setItem("GameSetting", JSON.stringify(_Global.GameSetting));
    }
    _Global.SaveGameSetting = this.SaveGameSetting;
    LoadLocalGameSetting();


    function LoadLocalActionList() {
      let _gs = localStorage.getItem("ActionList");
      if (_gs) {
        try {
          _Global.ActionList = JSON.parse(_gs);
        } catch (error) {

        }
      }
    }

    this.SaveActionList = function (_actionList) {
      let actionList = {};
      actionList.actionBar1 = [];
      for (let i = 0; i < _actionList.actionBar1.length; i++) {
        const element = _actionList.actionBar1[i];
        if (element.skill) {
          actionList.actionBar1.push(
            { 
              index: element.index,
              type:element.skill.type,
              id:element.skill.id, 
              skillName: element.skill.skillName });
        }
      }
      localStorage.setItem("ActionList", JSON.stringify(actionList));
    }
    LoadLocalActionList();
    _Global.SaveActionList = this.SaveActionList;
    
    // 判断是否在移动端
    function CheckInMobile() {
      return;

      let platform = _Global.platform.toLowerCase();
      if(platform.includes('ios')
      || platform.includes('android')
      ){ 
        setTimeout(() => {
          _Global.CombatLog.log("_Global.isMobile " + _Global.isMobile);
        }, 10000);
      }
      return;
      var UserClient = navigator.userAgent.toLowerCase();
      console.log(" 判断是否移动端 ", UserClient);
      setTimeout(() => {
        _Global.CombatLog.log(_Global.platform);
        _Global.CombatLog.log(JSON.stringify( window.result));
      }, 10000);
      var IsHWIPad = UserClient.indexOf("huawei") > -1 || UserClient.indexOf("honor") > -1;
      var IsIPad = UserClient.indexOf("ipad") > -1;
      var IsIphoneOs = UserClient.indexOf("iphone") > -1;
      var IsMidp = UserClient.indexOf("midp") > -1;
      var IsUc7 = UserClient.indexOf("rv:1.2.3.4") > -1;
      var IsUc = UserClient.indexOf("ucweb") > -1;
      var IsAndroid = UserClient.indexOf("android") > -1;
      var IsCE = UserClient.indexOf("windows ce") > -1;
      var IsWM = UserClient.indexOf("windows mobile") > -1;
      var IsM = UserClient.indexOf("mobile") > -1;
      // console.log(IsIPad,IsIphoneOs,IsMidp,IsUc7,IsUc,IsAndroid,IsCE,IsWM,IsM,);
      if (
        IsHWIPad ||
        IsIPad ||
        IsIphoneOs ||
        IsMidp ||
        IsUc7 ||
        IsUc ||
        IsAndroid ||
        IsCE ||
        IsM ||
        IsWM
      ) {
        _Global.isMobile = true; 
        
        // setTimeout(() => { 
        //   _Global.applyEvent("是否启用虚拟摇杆", _Global.isMobile);
        //   window.addEventListener("touchstart",()=>{
        //     _Global.applyEvent("强制刷新");
        //   });
        // }, 2000);
      } else {
        _Global.isMobile = false;
      }

      //*/
    }
    CheckInMobile();

    this.GetHeaderModelByType = function(type){
      for (let i = 0; i < NPCheadUpModelItems.npcHeaderUpType.length; i++) {
        const element = NPCheadUpModelItems.npcHeaderUpType[i];
        if(element.value == type){
          return element.folderBase;
        }
      } 
      return null;
    }
    _Global.GetHeaderModelByType = this.GetHeaderModelByType;
    
    //#endregion

    // setTimeout(() => {
    //   console.log = (e)=>{
    //     if(!_Global.setting.inEditor){

    //     }
    //     if(_Global.CombatLog){
    //       _Global.CombatLog.log(e);
    //     }
    //   };
    // }, 5000);

    let eventList = [];
    // 添加事件监听
    this.addEventListener = function (e, fn, id) {
      eventList.push({ eventName: e, fn: fn, id: id });
    }
    this.removeEventListener = function (fn) {
      for (let i = eventList.length - 1; i >= 0; i--) {
        if (eventList[i].fn == fn) {
          eventList.splice(i, 1);
        }
      }
    }
    this.removeEventListenerById = function (id) {
      for (let i = eventList.length - 1; i >= 0; i--) {
        if (eventList[i].id == id) {
          eventList.splice(i, 1);
        }
      }
    }

    _Global.addEventListener = this.addEventListener;
    _Global.removeEventListener = this.removeEventListener;
    _Global.removeEventListenerById = this.removeEventListenerById;
    // 执行事件
    this.applyEvent = function (e, v, v2, v3) {
      for (let i = 0; i < eventList.length; i++) {
        const element = eventList[i];
        if (element.eventName == e) {
          element.fn(v, v2, v3);
        }
      }
    }
    _Global.applyEvent = this.applyEvent;


    _Global.addEventListener("主角重生", () => {
      _Global.mainPlayerIsDead = false;
      _Global.YJ3D.YJController.resetLife();
      setTimeout(() => { 
        _Global._YJPlayerFireCtrl.SetPlayerEvent("重生"); 
      }, 200);
    });

 

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
          let path = element.path == '' ? '' : "./public/images/cursorList" + element.path;
          _Global.applyEvent("切换光标",path);
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

    this.LoadEquipById = function (assetId, callback) {
      let path = _Global.url.uploadUrl + assetId + "/" + "data.txt" + "?time=" + new Date().getTime();
      loadAssset(path, (data) => {
        let equipData = {
          type:"equip",
          // 唯一id
          folderBase: data.folderBase,
          icon: _Global.url.uploadUrl + data.folderBase + "/" + data.icon,
          // 装备名称
          name: data.name,
          // 品质
          qualityType: data.message.data.qualityType,
          // 部位，唯一
          part: data.message.data.partType || data.message.data.pickType,
          // 武器或装备
          pointType: data.message.pointType,
          // 附加属性
          propertyList: data.message.data.propertyList,
        }
        if (callback) {
          callback(equipData);
        }
      });
    }
    async function loadAssset(url, callback) {
      // _Global.Webworker.loadAssset(url,(data)=>{
      //   if (callback) {
      //     callback(data);
      //   }
      // });
      // return;
      const res = await _this.$axios.get(url);
      if (callback) {
        callback(res.data);
      }
    } 

    _Global.LoadEquipById = this.LoadEquipById;

    async function RequestGetAllModel() {
      // return;
      GetAllModel().then((res) => {
        return;
        console.log(" in editor 获取所有单品模型 ", res);
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
              if (item.message) {
                let data = item.message.data;
                data.modelPath = _this.$uploadUrl + item.modelPath;
                data.icon = "thumb.png";
                console.log(" in editor 添加角色数据 ");
                _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data);
              }
            } else { 
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
        _this.$uploadPlayerUrl + "buff_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.buffList = res.data;

      res = await _this.$axios.get(
        _this.$uploadPlayerUrl + "prop_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.propList = res.data;

      
      res = await _this.$axios.get(
        _this.$uploadPlayerUrl + "task_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.taskList = res.data;

      res = await _this.$axios.get(
        _this.$uploadPlayerUrl + "level_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.levelList = res.data;

      res = await _this.$axios.get(
        _this.$uploadPlayerUrl + "img_tags_data.txt" + "?time=" + new Date().getTime()
      );
      _Global.imgTagsList = res.data;

      // console.log("_Global.animList = ", _Global.animList);
      // console.log("_Global.propList = ", _Global.propList);
      // console.log("_Global.skillList = ", _Global.skillList);
    }

    this.GetPropById = function(id){
      // console.log(_Global.propList);
      for (let i = 0; i < _Global.propList.length; i++) {
        const element = _Global.propList[i];
        if(element.id == id){
          return JSON.parse(JSON.stringify(element))  ;
        }
      }
    }
    _Global.GetPropById = this.GetPropById;

    // 移除folderBase
    async function RequestRemoveFolderBase(msg) {
      let fromData = new FormData();
      fromData.append("folderBase", msg.folderBase);
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
      _YJPlayerAnimData = new YJPlayerAnimData();
      _Global._YJPlayerAnimData = _YJPlayerAnimData;

      return _YJPlayerAnimData;
    }
    _Global.CreateOrLoadPlayerAnimData = this.CreateOrLoadPlayerAnimData;
    _Global.CreateOrLoadPlayerAnimData();

    this.DyncManager = function () {
      return _this._SceneManager.GetDyncManager();
    }

    this.YJDync = function () {
      return _this.$refs.YJDync;
    }


    init();

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
        if(_Global.isMobile){
          
          return;
        }
        ChangeCursor(msg);
        return;
      }
      if (type == "设置技能进度条") {
        _Global.applyEvent("设置技能进度条", msg);
        return;
      }
      if (type == "主角死亡") {
        _Global.applyEvent("主角死亡");
        _Global.mainPlayerIsDead = true;
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
      if (emote == "/dance") {
        _Global.SetPlayerAnim("dance");
      }
    }
    _Global.SetPlayerEmote = this.SetPlayerEmote;



 
    // 传入装置id，视角跳转到装置正前方
    this.ChangeViewById = function (id) {
      _Global.YJ3D._YJSceneManager.ChangeViewByIdDirect(id);
    }

    this.ChangeViewByName = function (name) {
      let id = name;
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

    let _YJPathfindingCtrl = null;
    this.GetNavpath = function (ZONE, fromPos, targetPos) {
      if (_YJPathfindingCtrl == null) {
        return null;
      }
      return _YJPathfindingCtrl.GetNavpath(ZONE, fromPos, targetPos);
    }
    this.CreateNavMesh = function (ZONE, mapParent) {
      _YJPathfindingCtrl.CreateNavMesh(ZONE, mapParent);
    }
    this.YJPathfindingCtrl = function () {
      return _YJPathfindingCtrl;
    }
    _Global.GetNavpath = this.GetNavpath;
    _Global.CreateNavMesh = this.CreateNavMesh;
    _Global.GetYJPathfindingCtrl = this.YJPathfindingCtrl;


    // 如果3d加载好了能点击跳转时候 执行一下
    this.load3dComplete = function () {
      console.log(" 如果3d加载好了能点击跳转时候 执行 ");
      InitWEBGL_lose_context();
      let _YJGame_mainCtrl = new YJGame_mainCtrl();

      if (_YJPathfindingCtrl == null) {
        _YJPathfindingCtrl = new YJPathfindingCtrl(_Global.YJ3D.scene, () => {
          console.log("初始化寻路完成");
          // 调用所有npc的寻路
          _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();
        });
        new YJAudioManager(_this);

      }
      _Global.YJDync = this.YJDync();
      _Global.DyncManager = this.DyncManager();
      // 场景加载完成后，重新更新相机射线偏移，
      // 窗口大小位置不一样会导致射线偏移,所以需要重新计算
      if (_this.setPanelSize) {
        _this.setPanelSize();
      }

      _Global.applyEvent("3d加载完成");

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