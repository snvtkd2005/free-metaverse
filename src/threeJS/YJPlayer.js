



import * as THREE from "three";
import { createText } from 'three/examples/jsm/webxr/Text2D.js';

import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJLoadModel } from "./YJLoadModel.js";
import { YJPlayerDync } from "./YJPlayerDync.js";
import { YJPlayerChat } from "./YJPlayerChat.js";
import { YJEquip } from './components/YJEquip';

import TWEEN from '@tweenjs/tween.js';
import { YJPlayerNameTrans } from "./YJPlayerNameTrans.js";
import { YJDMPlayer } from "./components/YJDMPlayer.js";
import { YJSkillModel } from "./components/YJSkillModel.js";

class YJPlayer {
  constructor(_this, scene, local, nickName, controllerCallback, loadAvatarMirrorCompleted) {
    var scope = this;
    this.isLocal = local;
    this.fireId = -1;
    this.isPlayer = true;
    this.isDead = false;
    this.id = "YJPlayer";
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var playerGroup = null;
    var playerObj = null;
    var hasPlayer = false;
    var inSetDefaltPos = false;
    let _YJEquip = null;
    let _YJDMplayer = null;
    var namePosTrans = null;


    let avatar = null;
    this.GetAvatar = function () {
      return avatar;
    }
    let group = null;
    let createdName = false;

    //角色高度，以此来决定姓名条高度
    var playerHeight = 0;
    let rotation = [];

    var nameScale = 1;
    var modelScale = 1;

    var modelPath = "";
    var playerName = "";
    this.GetPlayerName = function () {
      return playerName;
    }

    let _YJPlayerDync = null;
    let _YJPlayerNameTrans = null;
    //初始化摄像机父物体，移动时，移动父物体， 旋转时，横向旋转父物体，竖向旋转摄像机
    const Init = () => {

      //添加组
      playerGroup = new THREE.Group();
      playerGroup.name = "playerGroup";
      // 角色放到scene下防止切换场景时被清除
      scene.add(playerGroup);
      // 角色放到pointParent下，在切换场景时销毁
      // _this.pointsParent.add(playerGroup);

      group = new THREE.Group();
      group.name = "group";
      playerGroup.add(group);

      _YJPlayerDync = new YJPlayerDync(_this, scene, scope, playerGroup);
      _YJPlayerDync.DyncPlayerState({ type: "脚底光圈", msg: "生成" });

      if (local) {
        scope.camp = _Global.user.camp;
      }
    }
    this.GetGroup = function () {
      return group;
    }
    this.DyncPlayerState = function (state) {
      return _YJPlayerDync.DyncPlayerState(state);
    }


    let defaultplayerSetting = {};
    this.setPlayerDefaultPos = function (playerSetting) {
      defaultplayerSetting = playerSetting;

      // console.error(" defaultplayerSetting  ", defaultplayerSetting);
      playerGroup.position.copy(playerSetting.pos);
      if (playerSetting.rotaY) {
        group.rotation.set(0, playerSetting.rotaY, 0);
      }
      if (playerSetting.rotaV3) {
        group.rotation.set(playerSetting.rotaV3.x, playerSetting.rotaV3.y + Math.PI, playerSetting.rotaV3.z);
      }
    }


    //设置角色的父物体。在镜像角色中使用
    this.SetPlayerParent = function (parent) {
      if (parent == null) {
        // _this.pointsParent.attach(playerGroup);
        scene.attach(playerGroup);
        return;
      }
      parent.attach(playerGroup);
    }


    Init();

    let avatarData = null;
    this.GetavatarData = function () {
      return avatarData;
    }
    // 飞行坐骑
    let mountAvatar = null;
    let avatarId = 0;
    let modelScaleDrect = 1;
    function GetAnimData(id) {
      let animationsData = [];

      avatarId = id;
      // avatarData = _this.$parent.GetAvatarData(playerName);
      avatarData = _this._YJSceneManager.CreateOrLoadPlayerAnimData().GetAvatarDataById(id);
      playerName = avatarData.name;
      // console.error(" 加载角色名 " + playerName, avatarData);

      modelPath = avatarData.modelPath;
      playerHeight = avatarData.height;
      rotation = avatarData.rotation;

      modelScale = avatarData.modelScale;
      // modelScaleDrect = avatarData.modelScale;
      if (modelPath.indexOf("fbx") > -1) {
        modelScale = modelScale * 0.01;
      }
      nameScale = avatarData.nameScale;
      // 动作数据
      animationsData = avatarData.animationsData;

      //坐骑模型
      if (avatarData.flyMount) {
        let size = modelScale;
        if (modelPath.indexOf("fbx") > -1) {
          size = modelScale * 100;
        }
        mountAvatar = new YJLoadModel(
          _this,
          group,
          "id",
          _this.GetPublicUrl() + avatarData.flyMount,
          new THREE.Vector3(0, 0, 0),
          // new THREE.Vector3(0,0,0),
          new THREE.Vector3(0, Math.PI, 0),
          new THREE.Vector3(size, size, size),
          "flyMount", false, () => {
            mountAvatar.GetModel().visible = false;
          }
        )
      }
      return animationsData;
    }

    let hasMount = false;
    let mountName = "";
    this.GetMountName = function () {
      return mountName;
    }
    this.CancelMount = function () {
      if (!hasMount) { return; }
      hasMount = false;
      group.attach(playerObj);
      group.add(playerObj);
      playerObj.position.y = 0;
      if (avatarData.rotaY != undefined) {
        playerObj.rotation.set(0, avatarData.rotaY, 0); // 
      } else {
        playerObj.rotation.set(0, 0, 0); // 
      }
      mountAvatar.ClearMesh();
      this.ChangeAnim(oldAnimName);
      mountName = "";

      if (createdName) {
        namePosTrans.position.set(0, (playerHeight + 0.3), 0); //原点位置
      }
    }

    this.SetMountName = function (mountName) {
      if (mountName == "" || mountName == undefined) {
        this.CancelMount();
      } else {
        this.CreateMount(mountName);
      }
    }
    this.SelectMount = function (_mountName) {
      if (_mountName == "") {
        this.CancelMount();
      } else {
        this.CreateMount(_mountName);
      }
      _this.YJController.SetMount(_mountName);

    }

    let de2reg = 57.3248407;
    function SetRotaArray(model, rota) {
      if (!rota) {
        model.rotation.set(0, 0, 0);
        return;
      }
      model.rotation.set(rota[0] / de2reg, rota[1] / de2reg, rota[2] / de2reg);
    }

    //创建坐骑
    this.CreateMount = function (_mountName) {
      if (hasMount) { return; }
      mountName = _mountName;

      hasMount = true;
      // let avatarData = _this.$parent.GetAvatarData(mountName);
      let avatarData = _this._YJSceneManager.CreateOrLoadPlayerAnimData().GetAvatarDataById(mountName);

      // let avatarData = _this.$parent.GetAvatarData("fox");
      let modelPath = avatarData.modelPath;
      let animationsData = avatarData.animationsData;
      if (avatar) {
        this.ChangeAnim("idle");

      }

      if (modelPath.includes("http")) {
      } else {
        modelPath = _this.GetPublicUrl() + modelPath;
      }

      let rotation = avatarData.rotation;

      mountAvatar = new YJLoadAvatar(
        _this,
        group,
        modelPath,
        animationsData,
        scope,
        (_playerObj) => {
          group.add(_playerObj);
          playerObj.position.y += 0.51;
          if (createdName) {
            namePosTrans.position.set(0, (playerHeight + 0.3 + 0.51), 0); //原点位置
          }

          _playerObj.traverse((item) => {
            if (item.name == "Fox_Spine2") {
              item.attach(playerObj);
            }
          });
        }
      );
      mountAvatar.ChangeAnim(oldAnimName);

    }

    // 设置飞行坐骑的显示与隐藏
    this.SetFlyMountDisplay = function (b) {
      if (mountAvatar == null) { return; }
      // mountAvatar.GetModel().visible = b;
    }

    this.LoadPlayer = function (id) {

      if (!_Global.hasAvatar && this.isLocal) {
        console.log("无角色浏览");
        if (controllerCallback) {
          controllerCallback(group, playerGroup);
        }
        return;
      }
      if (_this.$parent.sceneData.setting.firstPerson == undefined) {

      } else {
        if (_this.$parent.sceneData.setting.firstPerson) {
          if (controllerCallback) {
            controllerCallback(group, playerGroup);
          }
          return;
        }
      }

      let animationsData = GetAnimData(id);
      LoadAvatar(modelPath, playerHeight, animationsData);
      return playerHeight;
    }

    //加载用户上传的模型，用户上传的模型，数据都在同步的avatarData中
    this.LoadPlayerByCustom = function (avatarData) {
      console.error("avatarData = > ", avatarData);
      // playerHeight = avatarData.height;
      nameScale = 1;
      // let animationsData = avatarData.animationsData;
      LoadAvatar(avatarData.modelPath, avatarData.height, avatarData.animationsData);
    }
    // 换装
    this.ChangeSkin = function (targetPath, title, mode, faceSourcePath) {
      avatar.ChangeSkin(targetPath, title, mode, faceSourcePath);
    }
    this.ChangeSkinCompleted = function () {
      group.visible = true;
      if (namePosTrans) {
        namePosTrans.visible = true;
      }
      if (!this.isLocal) {
        group.rotation.set(defaultplayerSetting.rotaV3.x, defaultplayerSetting.rotaV3.y + Math.PI, defaultplayerSetting.rotaV3.z);
      }
    }
    this.NeedChangeSkin = function () {
      group.visible = false;
    }

    function LoadAvatar(modelPath, height, animationsData) {
      playerHeight = height;

      if (modelPath.includes("http")) {
      } else {
        modelPath = _this.GetPublicUrl() + modelPath;
      }

      console.log("加载角色0", modelPath, avatarData, animationsData);
      avatar = new YJLoadAvatar(
        _this,
        _this.scene,
        modelPath,
        animationsData,
        scope,
        (_playerObj) => {
          if (playerObj != null) {
            clearGroup(group);
          }
          playerObj = _playerObj;
          // console.log("加载到的角色模型",playerObj); 
          group.add(playerObj);

          // console.log("avatarData = ",avatarData); 
          // console.log("avatarData.rotaY = ",avatarData.rotaY); 

          if (avatarData.rotaY != undefined) {
            playerObj.rotation.set(0, avatarData.rotaY, 0); // 
          }


          playerObj.position.set(0, 0, 0); //原点位置
          let size = modelScale;
          playerObj.scale.set(size, size, size); //模型缩放
          SetRotaArray(playerObj, rotation);
          // console.log(" 加载模型完成 " + playerObj.name);
          if (local) {
            if (controllerCallback) {
              controllerCallback(group, playerGroup);
            }
            console.log("创建 本地角色 == > " + playerName, playerHeight, avatarData.rotaY);
            _this.YJController.SetTargetHeight(playerHeight);

          } else {
            console.log("创建角色镜像 == > " + playerName);
          }

          hasPlayer = true;
          if (inSetDefaltPos) {
            // scope.SetMountName(playerDyncData.defaultMountName);
            // if (playerDyncData.parentName == "scene") {
            //   scope.SetPlayerParent();
            // } else {
            //   if (_YJGlobal._SceneManager) {
            //     scope.SetPlayerParent(_YJGlobal._SceneManager.GetSceneModel(playerDyncData.parentName));
            //   }
            // }
            // oldparentName = playerDyncData.parentName;

            // playerGroup.position.set(playerDyncData.defultPos.x, playerDyncData.defultPos.y, playerDyncData.defultPos.z);
            // if (playerDyncData.defaultRotateEuler) {
            //   group.rotation.set(playerDyncData.defaultRotateEuler.x, playerDyncData.defaultRotateEuler.y, playerDyncData.defaultRotateEuler.z);
            // }
            scope.SetUserData(oldUserData);
          }


          if (hasName) {
            CreateNameTransFn();
          }


          if (loadAvatarMirrorCompleted) {
            loadAvatarMirrorCompleted(scope);
          }
        }
      );

    }

    this.GetAvatarName = function () {
      return playerName;
    }
    this.GetAvatarId = function () {
      return avatarId;
    }
    this.ChangeAvatar = function (id, isLocal) {

      // console.log("切换角色11");
      let animationsData = GetAnimData(id);

      avatar.ChangeAvatar(
        _this.GetPublicUrl() + modelPath,
        animationsData,
        (_playerObj) => {
          clearGroup(group);
          playerObj = _playerObj;
          group.add(playerObj);
          playerObj.position.set(0, 0, 0); //原点位置
          let size = modelScale;
          playerObj.scale.set(size, size, size); //模型缩放

          oldAnimName = "idle";
          //刷新姓名条高度；刷新摄像机目标高度
          UpdateNameTransHeight();

          if (isLocal) {
            if (controllerCallback) {
              controllerCallback();
            }
            _this.YJController.SetTargetHeight(playerHeight);
          }
        }
      );
    }


    this.GetCurrentTime = function () {
      return avatar.GetCurrentTime();
    }

    this.ChangeAvatarByCustom = function (avatarData, isLocal) {
      // console.log("切换角色112222222222");
      if (avatarData == undefined) {
        return;
      }
      playerHeight = avatarData.height;
      avatar.ChangeAvatar(
        _this.GetPublicUrl() + avatarData.modelPath,
        avatarData.animationsData,
        (_playerObj) => {
          clearGroup(group);
          playerObj = _playerObj;
          group.add(playerObj);
          playerObj.position.set(0, 0, 0); //原点位置
          let size = modelScale;
          playerObj.scale.set(size, size, size); //模型缩放
          oldAnimName = "idle";

          //刷新姓名条高度；刷新摄像机目标高度
          UpdateNameTransHeight();

          if (isLocal) {
            if (controllerCallback) {
              controllerCallback();
            }

            _this.YJController.SetTargetHeight(playerHeight);
          }
        }
      );
    }

    this.SetWalkWeight = function (f) {
      if (avatar == null) { return; }
      avatar.SetWalkWeight(f);
    }

    this.GetAllMesh = function () {
      let meshes = [];
      playerObj.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          meshes.push(item);
          return meshes;

        }
        if (item instanceof THREE.SkinnedMesh) {
          meshes.push(item);
          return meshes;
        }
      });
      return meshes;
    }

    this.GetBone = function (boneName, callback) {
      // console.log("从模型中查找bone ", playerObj,boneName);
      playerObj.traverse(function (item) {
        if (item.type == "Bone" && item.name == boneName) {
          if (callback) {
            callback(item);
          }
          // return item;
        }
      });
      // return null;
    }
    // 模糊获取骨骼
    this.GetBoneVague = function (boneName, callback) {
      // console.log("从模型中查找bone ", playerObj,boneName);
      doonce = 0;
      playerObj.traverse(function (item) {
        if (doonce > 0) { return; }
        // if (item.type == "Bone" && item.name == (boneName)) 
        if (item.type == "Bone" && item.name.includes(boneName)) {
          if (callback) {
            callback(item);
          }
          doonce++;
        }
      });
      // return function(){

      //   playerObj.traverse(function (item) {
      //     if(doonce>0){return;}
      //     if (item.type == "Bone" && item.name.includes(boneName)) {
      //       if (callback) {
      //         callback(item);
      //       } 
      //       doonce++; 
      //     }
      //   }); 
      // }
    }
    //#region  姓名条
    //----------姓名条 开始-----------------
    let hasName = false;
    this.CreateNameTrans = function (e) {
      if (!_Global.hasAvatar && this.isLocal) {
        return;
      }

      nickName = e;
      hasName = true;
      CreateNameTransFn();
    }
    let baseData = null;
    this.SetBaseData = function (_baseData) {
      baseData = _baseData;
    }
    this.GetData = function () {
      return {
        avatarData: avatarData,
        baseData: baseData,
        name:scope.GetNickName(),
      };
    }
    this.GetModelScale = function () {
      return nameScale;
    }

    this.GetDamageTextPos = function () {
      let pos = scope.GetWorldPos().clone();
      pos.y += playerHeight * nameScale / 2;
      return pos;
    }
    this.GetBaseData = () => {
      return oldUserData.baseData;
    }

    this.GetHealthPerc = function () {
      return parseInt(baseData.health / baseData.maxHealth * 100);
    }
    this.GetNickName = function () {
      return nickName;
    }

    this.GetOwnerPlayerId = function () {
      return "";
    }
    // 设置姓名条高度偏移和尺寸
    this.SetNameTransOffsetAndScale = function (h, scale) {
      namePosTrans.position.set(0, h, 0); //原点位置
      namePosTrans.scale.set(scale, scale, scale);
    }
    // 还原姓名条高度偏移和尺寸到角色数据中数值
    this.ResetNameTransOffsetAndScale = function () {
      namePosTrans.position.set(0, (playerHeight + 0.3), 0); //原点位置
      namePosTrans.scale.set(nameScale, nameScale, nameScale);
    }

    let createNameTimes = 0;
    function getCampColor() {
      // 敌对、友善、中立
      if(scope.camp==10000){return 0xee0000;}
      if(scope.camp==10001){return 0x00ee00;}
      if(scope.camp==10002){return 0xeeee00;}
      return _Global.user.camp != scope.camp ? 0xee0000 : 0xbab8ff;
    }
    //创建姓名条参考物体
    function CreateNameTransFn() {

      // CreateVideo();
      if (_YJPlayerChat == null) {
        _YJPlayerChat = new YJPlayerChat(namePosTrans, nameScale);
      }
      if (playerHeight == 0) {
        return;
      }
      if (createNameTimes > 0) {
        return;
      }
      createNameTimes++;
      // console.error(nickName + "playerHeight 00 " ,playerHeight,modelScaleDrect, nameScale);
      _Global._YJPlayerNameManager.CreateNameTrans(
        scope, scope.id, nickName,
        playerHeight, modelScaleDrect,
        nameScale,
        getCampColor(),
      );

      // _YJPlayerChat.CreateChatTrans("测试测测试"); 
      // _YJPlayerChat.CreateChatTrans("1测试测试测试试试测试测试测试测试测试测试1"); 
      // _YJPlayerChat.CreateChatTrans("测试测试测试试测试测试试测试测试试测试测试测试测试测试测试测试"); 
    }
    this.resetLife = function () {
      scope.applyEvent("重生");
    }

    this.GetTargetModelDistance = function () {
      if (this.isLocal) {
        return _Global._YJPlayerFireCtrl.GetTargetModelDistance();
      }
    }

    let eventList = [];
    // 添加事件监听
    this.addEventListener = function (e, fn) {
      eventList.push({ eventName: e, fn: fn });
    }
    // 执行事件
    this.applyEvent = function (e, v, v2, v3) {
      for (let i = 0; i < eventList.length; i++) {
        const element = eventList[i];
        if (element.eventName == e) {
          element.fn(v, v2, v3);
        }
      }
    }

    //#endregion

    //#region 聊天内容框
    let _YJPlayerChat = null;
    this.CreateChatTrans = function (e) {
      if (_YJPlayerChat == null) {
        _YJPlayerChat = new YJPlayerChat(namePosTrans, nameScale);
      }
      _YJPlayerChat.CreateChatTrans(e);
    }
    this.UpdateHealth = function (health, maxHealth) {
      if (_YJPlayerNameTrans != null) {
        _YJPlayerNameTrans.UpdateHealth(health, maxHealth);
      }
    }
    //#endregion

    //#region 
    //#endregion


    //#region 音视频通话 小图标窗口

    let videoPlane = null;
    //创建用户视频
    this.CreateVideo = function (video) {
      if (video == false || video == null) {
        if (videoPlane != null) {
          clearObj(videoPlane);
          namePosTrans.remove(videoPlane); // 向该场景中添加物体
          videoPlane = null;
        }
        return;
      }
      // const video = document.getElementById("video");
      // video.play();
      // console.log("用户视频", video);
      if (videoPlane == null) {
        const _video = document.getElementById("video_" + video);
        let w = 0.5;
        let h = 0.5;
        // let w = 5;
        // let h = 5;
        let radius = 0.25;
        let planeGeometry = new THREE.CylinderGeometry(radius, radius, 0.01, 40, 1)
        // let planeGeometry = new THREE.PlaneGeometry(w, h, 1, 1); // 生成平面
        const texture = new THREE.VideoTexture(_video);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        videoPlane = new THREE.Mesh(planeGeometry, material);
        videoPlane.rotation.y = Math.PI / 2;
        videoPlane.rotation.x = Math.PI / 2;


        videoPlane.position.set(0, 0.5, 0);
        videoPlane.name = "video";
        namePosTrans.add(videoPlane); // 向该场景中添加物体
      } else {
        const _video = document.getElementById("video_" + video);
        videoPlane.material.map = new THREE.VideoTexture(_video);
      }

    }
    let audioPlane = null;


    this.CreateAudio = function (audio) {
      if (audio == false || audio == null) {
        if (audioPlane != null) {
          clearObj(audioPlane);
          namePosTrans.remove(audioPlane); // 向该场景中添加物体
          audioPlane = null;
        }
        return;
      }
      // const video = document.getElementById("video");
      // video.play();
      // console.log("用户音频", audio);
      if (audioPlane == null) {
        let size = 0.2;

        // const map = new THREE.TextureLoader().load(
        //   _this.GetPublicUrl() + "images/mico.png"
        // );

        let path = _this.GetPublicUrl() + "images/mico.png";
        let map = _this._YJSceneManager.checkLoadTexture(path);

        // if (texture == null) {
        //   texture = new THREE.TextureLoader().load(
        //     path
        //   );
        //   _this._YJSceneManager.addLoadTexture(path, texture);
        // }

        let planeGeometry = new THREE.PlaneGeometry(size, size, 1, 1); // 生成平面
        const material = new THREE.MeshBasicMaterial({ map: map, transparent: true });
        audioPlane = new THREE.Mesh(planeGeometry, material);
        audioPlane.rotation.y = Math.PI + Math.PI;

        audioPlane.position.set(0, 0.15, 0);
        audioPlane.name = "audio";
        namePosTrans.add(audioPlane); // 向该场景中添加物体
      }
    }
    this.SetAudioMute = function (b) {
      if (audioPlane == null) {
        return;
      }
      // const map = new THREE.TextureLoader().load(
      //   _this.GetPublicUrl() + "images/" + (b ? "mute" : "") + "mico.png"
      // );
      let map = _this._YJSceneManager.checkLoadTexture(_this.GetPublicUrl() + "images/" + (b ? "mute" : "") + "mico.png");

      audioPlane.material.map = map;
    }
    //#endregion



    function clearObj(object) {
      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.geometry.dispose();
          item.material.dispose();
        }
      });
    }



    function UpdateNameTransHeight() {
      namePosTrans.position.set(0, (playerHeight + 0.3), 0); //原点位置
    }
    this.GetPlayerGroup = function () {
      return playerGroup;
    }
    // this.SetPlayerHeight = function(_playerHeight){
    //   playerHeight = _playerHeight;
    //   CreateNameTransFn();
    // }
    // this.SetPlayerNameScale = function(size){
    // 	namePosTrans.scale.set(size,size, size );
    // }

    //获取姓名条世界坐标，发送给界面，让界面转为屏幕坐标
    this.GetPlayerNamePos = function () {

      return getWorldPosition(playerGroup);
      return getWorldPosition(namePosTrans);
    }
    this.GetWorldPos = function () {
      let pos = getWorldPosition(playerGroup).clone();
      // pos.y += playerHeight;
      return pos;
    }
    this.GetScale = function () {
      return nameScale;
    }
    
    this.GetPlayerWorldPos = function () {
      let pos = getWorldPosition(playerGroup).clone();
      pos.y += playerHeight / 2;
      return pos;
    }
    // 生成光圈时调用，返回父物体、角色高度
    this.GetBaseModel = () => {
      // let group = playerGroup.clone();
      return { group, playerHeight };
    }
    this.getPlayerType = function () {
      return "玩家";
    }
    function makeButtonMesh(x, y, z, color) {
      const geometry = new THREE.BoxGeometry(x, y, z);
      const material = new THREE.MeshPhongMaterial({ color: color });
      const buttonMesh = new THREE.Mesh(geometry, material);
      // buttonMesh.castShadow = true;
      // buttonMesh.receiveShadow = true;
      return buttonMesh;
    }
    //----------姓名条 结束-----------------





    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }

    //----------PC 端 同步角色动作 开始-----------------

    var oldAnimName = "";
    let animNameFullback = "";
    //切换动画
    this.ChangeAnim = function (animName, _animNameFullback, callback) {
      // console.log("切换动画 ", animName);
      animNameFullback = _animNameFullback;
      ChangeAnimFn(animName, callback);
    }
    function ChangeAnimFn(animName, callback) {
      if (!hasPlayer) {
        return;
      }
      // if (oldAnimName == animName) { return; }
      if (avatar != null) {
        if (hasMount) {
          mountAvatar.ChangeAnim(animName);
        } else {
          avatar.ChangeAnim(animName, animNameFullback, callback);
        }
        oldAnimName = animName;
        return;
      }
    }
    this.ChangeAnimDirect = function (animName) {
      if (!hasPlayer) {
        return;
      }
      if (avatar != null) {
        avatar.ChangeAnimDirect(animName);
        oldAnimName = animName;
        return;
      }
    }
    //----------PC 端 同步角色动作 结束-----------------


    //----------生成和移除角色 开始-----------------

    //移除角色
    this.DelPlayer = function () {
      // if(playerObj==null){return;} 
      clearGroup(playerGroup);
      scene.remove(playerGroup);

      cancelAnimationFrame(updateId);
      if (_YJDMplayer) {
        _YJDMplayer.DelPlayer();
      }
      console.log(" 角色下线 移除角色 ");
      scope.applyEvent("Destroy");
    }
    function clearGroup(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          item.geometry.dispose();
          item.material.dispose();
        }
      };
      const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        arr = null;
      };
      removeObj(group);
    }

    //----------生成和移除角色 结束-----------------

    let playerDyncData = {};

    //获取角色是否加载完成。加载完成返回true
    this.GetHasPlayer = function () {
      return hasPlayer;
    }

    var time;

    var oldPos = new THREE.Vector3();

    let display_avatar = true;
    this.DisplayAvatar = function (b) {
      if (b == undefined || playerObj == null) { return; }
      if (display_avatar == b) { return; }
      if (b) {
        playerObj.scale.set(modelScale, modelScale, modelScale); //模型缩放
      } else {
        playerObj.scale.set(0, 0, 0);
      }
      display_avatar = b;
      // namePosTrans.visible = b;
      scope.applyEvent("显示隐藏姓名条", b);

      console.log("设置角色avatar 缩放 ", display_avatar);
    }

    let display = true;
    //同步其他玩家镜像角色的隐藏状态。 
    function Display(b) {

      if (b == undefined) { return; }
      if (display == b) { return; }
      if (b) {
        playerGroup.scale.set(1, 1, 1);
      } else {
        playerGroup.scale.set(0, 0, 0);
      }
      display = b;
      console.log("设置角色  缩放 ", display);
    }


    let oldNameTrans = "";
    let oldparentName = "scene";

    // 设置姓名条
    function SetNameTrans(nameTrans) {
      if (nameTrans == "reset") {
        scope.ResetNameTransOffsetAndScale();
      } else {
        scope.SetNameTransOffsetAndScale(nameTrans.h, nameTrans.scale);
      }

      oldNameTrans = nameTrans;
    }
    this.GetUserData = function () {
      return oldUserData;
    }

    let handlerList = [];
    this.AddHandle = function (handler) {
      handlerList.push(handler);
    }
    this.RemoveHandle = function () {
      handlerList = [];
    }

    this.ResetName = function () {
      scope.applyEvent("重置昵称", scope.GetNickName(), getCampColor());
      if (_YJDMplayer) {
        _YJDMplayer.ChangeCamp();
      }
    }
    let dyncTimes = 0;
    let userDataList = [];
    let oldUserData = null;
    let _YJSkillModel = null;
    this.ReceiveControl = function (msg) {
      if(_YJSkillModel == null){
        _YJSkillModel = new YJSkillModel(scope);
      }
      _YJSkillModel.ReceiveControl(msg,false);
    }
    this.SendSkill = function (msg) {
      if(_YJSkillModel == null){
        _YJSkillModel = new YJSkillModel(scope);
      }
      _YJSkillModel.SendSkill(msg,false);
    }

    //接收服务器同步过来的其他用户角色位置、旋转、动作
    this.SetUserData = function (userData) {

      // console.log("同步其他用户的角色镜像  执行 22222 " ,userData); 
      var pos = userData.pos;
      if (userData.pos == undefined) {
        pos = new THREE.Vector3(0, 0, 0);
      } else {
      }
      oldUserData = userData;


      if (!hasPlayer) {
        //在角色没创建完成前，就接收到位置，则先把位置记录下来
        playerDyncData.defultPos = pos;
        playerDyncData.defultRotaY = userData.rotateY;
        playerDyncData.defaultMountName = userData.mountName;
        playerDyncData.defaultRotateEuler = userData.rotateEuler;

        playerDyncData.nameTrans = userData.nameTrans;
        playerDyncData.parentName = userData.parentName;

        // console.log("获取角色镜像同步数据",playerDyncData);
        inSetDefaltPos = true;

        return;
      }
      // console.log("接收角色同步",userData);

      if (_Global.dyncUpdateFrame < 10) {
        // 把角色数据添加到列表，由本地挨个取出更新镜像
        userDataList.push(userData);
        // if (userDataList.length > 2) {
        //   userDataList.splice(0, 1);
        // }
        if (!inmoving) { UpdateUserData(); }

        return;
      } else {



      }

      for (let i = 0; i < handlerList.length; i++) {
        const element = handlerList[i];
        element(scope.GetData());
      }
      if (oldUserData.baseData) {
        baseData = oldUserData.baseData;
        this.isDead = oldUserData.baseData.health <= 0;
        this.UpdateHealth(oldUserData.baseData.health, oldUserData.baseData.maxHealth);
        if (this.camp != oldUserData.baseData.camp) {
          this.camp = oldUserData.baseData.camp;
          scope.ResetName();
        }
        if (oldUserData.dyncType == "equip" || _YJEquip == null) {
          if (baseData.equipList) {
            if (_YJEquip == null) {
              _YJEquip = new YJEquip(scope, false);
            }
            _YJEquip.ChangeEquipList(baseData.equipList);
          }
        }
        if (oldUserData.dyncType == "camp" || _YJDMplayer == null) {
          // console.log("同步其他用户的角色镜像  执行 111 " ,userData); 
          if (baseData.dmplayerList) {
            if (_YJDMplayer == null) {
              console.log("同步其他用户的角色镜像  执行 22222 ", userData);
              _YJDMplayer = new YJDMPlayer(scope);
              _YJDMplayer.ChangeEquipList(baseData.dmplayerList);
            }
            _YJDMplayer.ChangeCamp();
          }
        }
      }

      // 同步拾取物体
      dyncPickModel(userData.weaponData);

      // console.log("获取角色镜像同步数据",userData,oldUserData);


      if (userData.animName.includes("idle")) {
        if (b_lerpChangeView) {

        } else {
          this.ChangeAnim(userData.animName);
        }
      } else {
        this.ChangeAnim(userData.animName);
      }

      // 行走动画权重
      this.SetWalkWeight(userData.animWeight);

      // 坐骑
      this.SetMountName(userData.mountName);

      // 角色模型是否显示同步
      this.DisplayAvatar(userData.avatarDisplay);

      //姓名条大小位置同步
      if (userData.nameTrans != undefined) {
        if (oldNameTrans != userData.nameTrans) {
          if (userData.nameTrans == "reset") {
            this.ResetNameTransOffsetAndScale();
          } else {
            this.SetNameTransOffsetAndScale(userData.nameTrans.h, userData.nameTrans.scale);
          }
          oldNameTrans = userData.nameTrans;
        }
      }

      if (userData.parentName != undefined) {
        if (oldparentName != userData.parentName) {
          if (userData.parentName == "scene") {
            this.SetPlayerParent();
          } else {
            if (_YJGlobal._SceneManager) {
              this.SetPlayerParent(_YJGlobal._SceneManager.GetSceneModel(userData.parentName));
            }
          }
          console.log("设置玩家父物体 ", userData.parentName);
          oldparentName = userData.parentName;
        }
      }

      // console.log("接收动作和权重 "+userData.animName +"  "+ userData.animWeight );
      var newPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      // console.log("接收 角色 坐标 ",newPos );
      if (oldPos.x != newPos.x || oldPos.z != newPos.z) {
        if (dyncTimes > 0) {
          targetPos.set(pos.x, pos.y, pos.z);
          b_lerpChangeView = true;
          lerpLength = 0.5;
        } else {
          currentTargetPos.lerp(newPos, 1);
          playerGroup.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
          dyncTimes++;
        }
        oldPos = newPos;
        targetPos = oldPos;
        // return;
      }

      Display(userData.dyncDisplay);

      // playerGroup.position.set(newPos.x, newPos.y, newPos.z);

      // group.rotation.set(0, userData.rotateY , 0);

      // 设置插值移动，防止抖动
      let e = userData.rotateEuler;
      if (e) {
        group.rotation.set(e.x, e.y, e.z);
      }


      // let lookatPos = newPos.clone();
      // lookatPos.y = currentTargetPos.y;
      // group.lookAt(lookatPos);

      // group.rotation.set(0, userData.rotateY + 3.14 / 2 + 3.14, 0);


    }

    let rotaDoonce = 0;
    let doonce = 0;
    let userData = null;


    //武器
    let weaponData = {
      pickType: "",
      weaponType: "",
      id: "",
    };
    let pickBone = [];
    this.AddPick = function (boneName) {
      pickBone.push(boneName);
    }
    this.CheckPick = function (boneName) {
      for (let i = 0; i < pickBone.length; i++) {
        if (pickBone[i] == boneName) { return true; }
      }
      return false;
    }
    let weaponModel = null;
    this.addWeaponModel = function (_weaponModel) {
      weaponModel = _weaponModel;
    }
    this.getWeaponModel = function (_weaponModel) {
      return weaponModel;
    }
    this.removeWeaponModel = function () {
      weaponModel = null;
    }
    // 同步拾取物体
    function dyncPickModel(_weaponData) {
      if (_weaponData == undefined) {
        return;
      }
      // console.log(weaponData,_weaponData);
      if (weaponData.weaponId == _weaponData.weaponId) {
        return;
      }
      weaponData = _weaponData;
      if (_weaponData.weaponId == "") {
        for (let i = 0; i < pickBone.length; i++) {
          scope.GetBoneVague(pickBone[i], (bone) => {
            if (bone.weaponModel) {
              bone.remove(bone.weaponModel);
            }
          });
        }
        pickBone = [];
        return;
      }
      _Global.PickWeapon(scope, _weaponData.weaponId);

    }

    function UpdateUserData() {
      // if (inmoving) { return; }
      if (userDataList.length == 0) {
        return;
      }
      inmoving = true;
      userData = userDataList[0];
      // 坐骑
      scope.SetMountName(userData.mountName);
      // 角色模型是否显示同步
      scope.DisplayAvatar(userData.avatarDisplay);


      // 同步拾取物体
      dyncPickModel(userData.weaponData);

      //姓名条大小位置同步
      if (userData.nameTrans != undefined) {
        if (oldNameTrans != userData.nameTrans) {
          if (userData.nameTrans == "reset") {
            scope.ResetNameTransOffsetAndScale();
          } else {
            scope.SetNameTransOffsetAndScale(userData.nameTrans.h, userData.nameTrans.scale);
          }
          oldNameTrans = userData.nameTrans;
        }
      }
      if (userData.parentName != undefined) {
        if (oldparentName != userData.parentName) {
          if (userData.parentName == "scene") {
            scope.SetPlayerParent();
          } else {
            if (_YJGlobal._SceneManager) {
              scope.SetPlayerParent(_YJGlobal._SceneManager.GetSceneModel(userData.parentName));
            }
          }
          console.log("设置玩家父物体 ", userData.parentName);
          oldparentName = userData.parentName;
        }
      }
      Display(userData.dyncDisplay);
      // 设置插值移动，防止抖动
      let e = userData.rotateEuler;
      if (e) {
        group.rotation.set(e.x, e.y, e.z);
      }


      // 角色传送位置。
      if (userData.bTransmit != undefined) {
        if (userData.bTransmit) {
          dyncTimes = 0;
          // console.log("收到传送============");
        }
      }

      if (userData.animName == "idle" && oldAnimName == "walk") {

      } else {
        scope.ChangeAnim(userData.animName);
      }
      if (userData.onlySetAnim) {
        scope.ChangeAnim(userData.animName);
      }


      // 行走动画权重
      scope.SetWalkWeight(userData.animWeight);

      // console.log("获取角色镜像同步数据 22",userData,oldUserData);

      var pos = userData.pos;
      // console.log("接收动作和权重 " + userData.animName + "  " + userData.animWeight);
      var newPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      targetPos = newPos.clone();
      // console.log("接收 角色 坐标 ", newPos, oldPos);
      if (dyncTimes > 1) {

      } else {
        // scope.ChangeAnim(userData.animName);
        currentTargetPos.lerp(newPos, 1);
        playerGroup.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
        oldPos = newPos;
        dyncTimes++;
        MovingEnd();
      }
    }

    let inmoving = false;
    function MovingEnd() {

      // if (userDataList.length == 0) {
      //   scope.ChangeAnim("idle");
      //   return;
      // }

      rotaDoonce = 0;
      oldPos = currentTargetPos;
      inmoving = false;

      userDataList.shift();
      if (userDataList.length == 0) {
        if (userData.onlySetAnim) {

        } else {
          scope.ChangeAnim("idle");
        }
        return;
      }
      UpdateUserData();

    }

    function Moving() {
      if (userDataList.length == 0) { return; }
      const velocity = targetPos.clone().sub(currentTargetPos);

      if (velocity.lengthSq() > 0.05 * 0.05) {
        velocity.normalize();
        // Move player to target
        currentTargetPos.add(velocity.multiplyScalar(0.015 * 4));
        playerGroup.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
        if (rotaDoonce < 1 && (Math.abs(currentTargetPos.x - targetPos.x) > 0.1 || Math.abs(currentTargetPos.z - targetPos.z) > 0.1)) {
          group.lookAt(targetPos.clone());
          // group.rotation.x = 0;
          // group.rotation.z = 0;
          rotaDoonce++;
        }
        scope.ChangeAnim("walk");

        // console.log("有位移，可以移动");
      } else {
        rotaDoonce = 0;
        MovingEnd();
      }

    }





    var b_lerpChangeView = false; //是否开始平滑过渡 
    var lerpLength = 0;  //平滑过渡值，取值范围 0 - 1
    var currentTargetPos = new THREE.Vector3();  //平滑过渡时使用的变量

    var targetPos = new THREE.Vector3(0, 0, 0);
    let needAnimName = "";

    let movingTween = null;
    function LerpMovePlayer() {

      if (b_lerpChangeView) {
        lerpLength += 0.05;
        currentTargetPos.lerp(targetPos, lerpLength);
        playerGroup.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
        if (Math.abs(targetPos.z - currentTargetPos.z) < 0.01
          && Math.abs(targetPos.x - currentTargetPos.x) < 0.01
          && Math.abs(targetPos.y - currentTargetPos.y) < 0.01
        ) {
          b_lerpChangeView = false;
          lerpLength = 0;
          // console.log("已移动到指定位置");
          scope.ChangeAnim(oldUserData.animName);

        }
      }
    }

    // update();
    var updateId = null;
    let oldPlayerPos = new THREE.Vector3();
    this._update = function () {

      // updateId = requestAnimationFrame(update);
      //实时刷新姓名条，让姓名条面向摄像机
      if (namePosTrans != null) {
        var lookatPos = new THREE.Vector3();
        var camWorlPos = new THREE.Vector3();
        _this.camera.getWorldPosition(camWorlPos);
        lookatPos.x = camWorlPos.x;
        lookatPos.z = camWorlPos.z;
        var nameWorlPos = new THREE.Vector3();
        namePosTrans.getWorldPosition(nameWorlPos);
        // lookatPos.y = nameWorlPos.y ;
        lookatPos.y = Math.max(nameWorlPos.y, camWorlPos.y);
        namePosTrans.lookAt(lookatPos);

      }

      if (!hasPlayer) { return; }
      if (avatar) {
        avatar._update();
      }
      let pos = this.GetWorldPos();
      if (oldPlayerPos.distanceTo(pos) > 0.1) {
        this.applyEvent("pos", pos);
        oldPlayerPos = pos.clone();
      }
      // this.applyEvent("pos", this.GetPlayerWorldPos());
      // this.applyEvent("pos", playerGroup.getWorldPosition(new THREE.Vector3()));

      if (!local) {
        LerpMovePlayer();
        TWEEN.update();
        if (inmoving && userDataList.length > 0 && dyncTimes > 1) {
          Moving();
        }
      }

      // console.log("in "+(local?'自身':'其他')+   " pos = " + posToString(getWorldPosition()) + "  rota = "+posToString(playerObj.rotation));
      // console.log("in playerObj   pos = " + posToString(playerObj.position) + "  rota = "+posToString(playerObj.rotation));

    }

    this.GetCamp = function () {
      return scope.camp;
    }
  }
}

export { YJPlayer };