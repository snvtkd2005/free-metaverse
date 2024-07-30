



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";

// import { YJ3dPhotoPlane } from "/@/threeJS/YJ3dPhotoPlane.js";
import { YJ3dPhotoPlane } from "./YJ3dPhotoPlane.js";

import { YJProjector } from "/@/threeJS/components/YJProjector.js";
import { ReflectorMesh } from "/@/js/ReflectorMesh.js";

import { YJCar } from "/@/threeJS/model/YJCar.js";
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";

import carData from "../data/carData.js";

import { getSceneData } from "./sceneApi.js"

import { YJSceneDyncManagerEditor } from "./YJSceneDyncManagerEditor.js";
import { SceneManagerMetaworld } from "./SceneManagerMetaworld.js";
import { YJAmmoRope } from "../../../threeJS/components/YJAmmoRope.js";
import { YJAmmoPlayerBody } from "../../../threeJS/components/YJAmmoPlayerBody.js";
import { SpringManager } from "../../../threeJS/common/SpringManager.js";
// import { YJController_roguelike } from "/@/threeJS/YJController_roguelike.js";

class SceneManager {
  constructor(scene, renderer, camera, _this, modelParent, indexVue, callback) {
    let scope = this;
    let _YJNPCManager = null;
    let transformController;
    let stats;
    let verticalMirror;

    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();
    let lookatList = [];

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let _DirectionalLight = null;

    const listener = new THREE.AudioListener();
    let _YJMinMap = null;
    let _YJ3dPhotoPlane = null;
    let _SceneDyncManager = null;
    this.GetDyncManager = function () {
      return _SceneDyncManager;
    }
    // 需要执行update的脚本
    let needUpdateJS = [];
    let lightData = null;

    this._YJTransformManager = null;
    let _YJBloomManager2 = null;
    let mirrorSphereCamera = null;

    let setting = null;

    let ambient = null;
    // 刚体高度
    let playerHeight = 0;
    let cube = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.Init = function () {
      InitFn();
    }


    let InDriving = false;
    let inInputing = false;

    // 上次选中的角色、npc
    let oldTarget = null;

    let _YJProjector = null;


    let targetCallback;
    // 改变目标时执行
    function ChangeTarget() {
      if (targetCallback) {
        targetCallback(oldTarget != null);
      }
    }
    // 点击选中不同角色
    this.AddChangeTargetListener = (callback) => {
      targetCallback = callback;
    }

    function InitFn() {

      // setTimeout(() => {
      //   RequestSceneData();
      // }, 1000);

      _Global._SceneManager = scope;

      _YJGlobal._SceneManager = scope;

      _YJProjector = new YJProjector(_this, scene);
      // AddTestMat();
      // window.addEventListener('mousemove', onPointerDown);

      _Global.addEventListener("主角死亡",()=>{
        ClearTarget();
      });

      // _Global.addEventListener('keycodeDown',)
      new YJKeyboard((event) => {

        if (inInputing) {
          return;
        }
        let key = event.code;
        inJoystick = false;
        if (_YJCar != null) {
          _YJCar.SetKeyboard(key);
        } 

        if (key == "Tab") {
          // tab切换目标
          TabChangeTarget();
          return;
        } 

        if (key == "KeyM") {
          //   //  开关地图
          //   if (setting.keyM != undefined && setting.keyM && _this.$parent.clickOpenPanel) {
          //     _this.$parent.clickOpenPanel("小地图");
          //   }
          return;
        }
        if (key == "KeyT") {
          scope.PickDownWeapon();
          return;
        }
        if (key == "KeyF") {
          if (_YJCar != null) {
            if (!InDriving) {
              scope.InCar();
              InDriving = true;
            } else {
              scope.OutCar();
              InDriving = false;
            }
          }

          // if (_this._YJSceneManager) {
          //   _this._YJSceneManager.ClickInteractive();
          // }
        }


        if (_Global.TransformController.getUsing()) {
          let mode = _Global.TransformController.getMode();
          _Global.TransformController.onKeyDown(event);

          if ((key == "KeyW" && mode != "translate")
            || (key == "KeyE" && mode != "rotate")
            || (key == "KeyR" && mode != "scale")
          ) {
            return;
          }
        }

        _Global.YJ3D.YJController.onKeyDown(event);
      }, (event) => {
        inJoystick = true;
        let key = event.code;
        if (_YJCar != null) {
          _YJCar.SetKeyboardUp(key);
        }

        _Global.YJ3D.YJController.onKeyUp(event);
        _Global.TransformController.onKeyUp(event);
      });

      // let _YJ2dScene = new YJ2dScene(_this,scene,camera);
      // _this._YJSceneManager.AddNeedUpdateJS(_YJ2dScene);

      if (callback) {
        callback();
      }
      // render();
      _this._YJSceneManager.AddNeedUpdateJS(scope);

      _SceneDyncManager = new YJSceneDyncManagerEditor(_this, indexVue, scope);


      scope.AddChangeTargetListener((b) => {
        if (indexVue.$refs.gameUI) {
          indexVue.$refs.gameUI.SetTargetVaild(b);
        }
      });

      _this.YJController.addEvent("视角改变", (e) => {
        // console.log(e);
        if (indexVue && indexVue.$refs.HUD) {
          indexVue.$refs.HUD.$refs.damageUI.UpdatePos2d();
        }

      });

      _this.YJController.AddMovingListener(() => {
        if (pickTimeout != null) {
          clearTimeout(pickTimeout);
          pickTimeout = null;
        }
        if (throwTimeout != null) {
          clearTimeout(throwTimeout);
          throwTimeout = null;
          console.log("清除投掷协程");
        }

        if (laterSitting != null) {
          clearTimeout(laterSitting);
          laterSitting = null;
        }

        if (throwObj != null) {
          throwObj.parent.remove(throwObj);
          _this._YJSceneManager.clearGroup(throwObj);
          throwObj = null;
          indexVue.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId: 10000
          });
        }

        inThrowing = false;


        // console.log(throwTimeout);

      });



      // posRef_huluobu = CreatePosRef(0.33, -0.953);
      // posRef_nangua = CreatePosRef(0.20, -0.953);
      // posRef_nangua = CreatePosRef(-0.33, -0.93);
      // posRef_huluobu = CreatePosRef(-0.20, -0.93);
    }

    let tabSelectIndex = 0;
    // tab键切换选择玩家前方的敌人
    function TabChangeTarget() {
      if (_Global.YJ3D.YJController.isInDead()) {
        return;
      }
      let playerPos = _Global.YJ3D.YJController.GetPlayerWorldPos();

      let canSelectNpc = _Global._YJNPCManager.GetForwardNoSameCampNPC(playerPos);

      console.log("tab 切换目标 ",canSelectNpc);
      if(canSelectNpc.length==0){
        return;
      }
      if (tabSelectIndex >= canSelectNpc.length) {
        tabSelectIndex = 0;
      }
      scope.ClickModelTransform(canSelectNpc[tabSelectIndex]);
      tabSelectIndex++;
      canSelectNpc = [];
    }

    let boneAttachList = [];

    this.SetTriggerOverlap = (b, id, owner) => {
      console.log(" in Overlap ", b, id, owner.modelData);
      if (owner.isYJTransform) {
        let msg = owner.GetMessage();
        if (msg.pointType == "weapon") {

          if (_this.YJController.isInDead()) {
            // 角色死亡后不接收道具效果
            return;
          }
          let state = _this.YJController.GetUserDataItem("weaponData");
          console.log(" 碰到武器 ", msg.data, state);
          // 判断角色是否可以拾取武器
          if (state != null && state.weaponId != "") {
            return;
          }
          // let { boneName, weaponType, pickType
          //   , position
          //   , rotation
          //   , attackSpeed
          //   , vaildDis
          //   , animNameIdle
          //   , animNameWalk, animNameRun, animNameReady, animNameAttack } = msg.data;


          let { boneName, weaponType
            , position
            , rotation } = msg.data;
          _this.YJController.SetUserDataItem("weaponData", msg.data);
          // _this.YJController.SetUserDataItem("weaponData", "pickType", pickType);
          // _this.YJController.SetUserDataItem("weaponData", "weaponType", weaponType);
          _this.YJController.SetUserDataItem("weaponData", "weaponId", owner.GetData().folderBase);
          // _this.YJController.SetUserDataItem("weaponData", "attackSpeed", attackSpeed);
          // _this.YJController.SetUserDataItem("weaponData", "vaildDis", vaildDis);
          // _this.YJController.SetUserDataItem("weaponData", "animNameIdle", animNameIdle);
          // _this.YJController.SetUserDataItem("weaponData", "animNameWalk", animNameWalk);
          // _this.YJController.SetUserDataItem("weaponData", "animNameIdle", animNameIdle);
          // _this.YJController.SetUserDataItem("weaponData", "animNameRun", animNameRun);
          // _this.YJController.SetUserDataItem("weaponData", "animNameReady", animNameReady);
          // _this.YJController.SetUserDataItem("weaponData", "animNameAttack", animNameAttack);
          _this.YJController.SetUserDataItem("weaponData", "transId", owner.id);
          // if(msg.data.readyParticleId){
          //   _this.YJController.SetUserDataItem("weaponData", "readyParticleId", msg.data.readyParticleId);
          // }


          _this.YJController.SetUserDataItem("weaponDataData", {});
          _this.YJController.SetUserDataItem("weaponDataData", owner.GetData());


          let realyBoneName = boneName;
          let boneList = _this.YJPlayer.GetavatarData().boneList;
          if (boneList) {
            for (let i = 0; i < boneList.length; i++) {
              const item = boneList[i];
              if (item.targetBone == boneName) {
                realyBoneName = item.boneName;
              }
            }
          }

          let realyPos = [0, 0, 0];
          let realyRota = [0, 0, 0];
          let realyScale = [1, 1, 1];
          let refBoneList = _this.YJPlayer.GetavatarData().equipPosList;
          if (refBoneList) {
            for (let i = 0; i < refBoneList.length; i++) {
              const item = refBoneList[i];
              if (item.targetBone == boneName && item.weaponType == weaponType) {
                realyPos = item.position ? item.position : realyPos;
                realyRota = item.rotation ? item.rotation : realyRota;
                realyScale = item.scale ? item.scale : realyScale;
              }
            }
          }

          // 碰到武器就拾取
          _this.YJPlayer.GetBoneVague(realyBoneName, (bone) => {
            let weaponModel = owner.GetGroup();
            boneAttachList.push(
              {
                boneName: boneName,
                parent: weaponModel.parent,
                transform: owner
              });
            bone.add(weaponModel);
            _this.YJPlayer.addWeaponModel(weaponModel);
            // let pos = position;
            // let rotaV3 = rotation;
            // // console.log(" 设置武器坐标",rotaV3);
            // weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
            // // weaponModel.position.set(100 * pos[0], 100 * pos[1], 100 * pos[2]);
            // weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
            // weaponModel.scale.set(100, 100, 100);

            let pos = realyPos;
            let rotaV3 = realyRota;
            let scale = realyScale;
            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
            weaponModel.scale.set(100 * scale[0], 100 * scale[1], 100 * scale[2]);


            // 绑定到骨骼后，清除trigger
            owner.GetComponent("Weapon").DestroyTrigger();

            _SceneDyncManager.SendModelState(owner.GetData().id, { modelType: owner.GetData().modelType, msg: { display: false } });
            // console.log("bone ",bone); 
          });
        }
        if (msg.pointType == "interactive") {
          if (!b) { return; }
          let data = msg.data;
          if (data.imgPath) {
            //收集道具
            // 碰到就隐藏、发送其事件
            owner.SetActive(false);
            _Global.applyEvent("overlapinteractive",owner.GetData().message.data.buff,owner.GetWorldPos());
            if (_Global.YJDync) {
              _SceneDyncManager.SendModel({ id: owner.GetData().id, modelType: "交互模型", state: { display: false } });
              _SceneDyncManager.SendModel({ id: data.type, modelType: "交互模型", state: { type: "add", value: data.buffValue } });
            } else {
              this.ReceivePlayer(data);
            }

          }
        }
        if (msg.pointType == "geometry") {
          if (!b) { return; }
          let data = msg.data;
          if(data.isTrigger){
            let {title,content } = data.event;
            if(title =="openTask"){
              //碰到任务触发器
              _Global.applyEvent("openTask",content);
              owner.SetActive(false);
            }
            if(title =="jump"){
              //
            }
          }


        }
        // console.log(" in overlap yjtransform ", msg);

      }
      if (b) {
        if (id == "portal_001" || id == "portal_002") {
          if (id == "portal_001") {
            _Global.YJ3D._YJSceneManager.ChangeViewByIdDirect(
              "playerPos_001"
            );
          }
          if (id == "portal_002") {
            _Global.YJ3D._YJSceneManager.ChangeViewByIdDirect(
              "playerPos_002"
            );
          }

          _Global.YJ3D._YJSceneManager.UpdateLightPos();

          _Global.YJ3D.YJController.SetTransmit(true);
          if (this.$refs.YJDync) {
            this.$refs.YJDync.DirectSendUserData();
          }
          _Global.YJ3D.YJController.SetTransmit();
        }
      }
      if (id == "car") {
        let userd = false;
        if (b && !InDriving) {
          userd = this.SetCar(owner);
        } else {
          this.SetCar(null);
        }

        // if (this.$refs.modelPanel && !userd && !InDriving) {
        //   this.$refs.modelPanel.CallDriving(b);
        // }
      }
      if (id == undefined) { return; }
      if (id.includes("chair")) {
        if (b) {
          //点击热点坐椅子
          this.SetSittingModelLater(owner.GetGroup());
          owner.SetPointVisible(false);
        } else {
          if (laterSitting != null) {
            clearTimeout(laterSitting);
            laterSitting = null;
          }
        }
      }
    }

    let oldStateId = 0;
    let otherthrowObj = null;
    let posRef_huluobu;
    let posRef_nangua;
    let pickTimeout;
    let throwTimeout;
    let throwObj = null;
    let animName;
    let oldAnimName;
    let inThrowing = false;
    // 使用物品、扔出物品、使用技能
    this.UserModel = (model, e, f, callback) => {

      // 自身死亡不能使用道具
      if (_this.YJController.isInDead()) {
        return;
      }

      if (oldTarget != null) {
        if (oldTarget.isPlayer) {
          // 如果玩家已死亡，则不使用道具
          if (oldTarget.GetUserData().baseData.health <= 0) {
            return;
          }
          //目标是玩家
          let data = {};
          data.fromId = _this.YJPlayer.id;
          data.targetId = oldTarget.id;
          let msg = {};
          msg.buff = model.buff;
          msg.buffValue = model.buffValue;
          data.state = msg;
          _SceneDyncManager.SendModelPlayer(data);
          if (_Global.YJDync) {
            _SceneDyncManager.SendModel({ id: model.type, modelType: "交互模型", state: { type: "redius", value: model.buffValue } });
          }
          return;
        }
      }
      this.ReceivePlayer(model);

      if (_Global.YJDync) {
        _SceneDyncManager.SendModel({ id: model.type, modelType: "交互模型", state: { type: "redius", value: model.buffValue } });
      }
      return;

      if (e == "attack") {
        if (f != undefined) {

          if (inThrowing) { return; }
          if (throwObj != null) {
            if (oldAnimName == f) {
              return;
            }

            throwObj.parent.remove(throwObj);
            _this._YJSceneManager.clearGroup(throwObj);
            throwObj = null;
            if (throwTimeout != null) {
              clearTimeout(throwTimeout);
            }

            if (f == "胡萝卜") {
              animName = "throw";
            }
            if (f == "南瓜") {
              animName = "throw2";
            }

          }
          oldAnimName = f;
          inThrowing = true;
          _this.YJPlayer.GetBone("mixamorigRightHandIndex1", (bone) => {
            throwObj = CreateThrowObj(bone, f);
            let latertime = 650;
            if (f == "胡萝卜") {
              latertime = 800;
            }


            if (throwTimeout != null) {
              clearTimeout(throwTimeout);
              throwTimeout = null;
            }


            //让角色朝向模型位置
            _this.YJController.PlayerLookatPos(oldTarget.GetWorldPos());


            throwTimeout = setTimeout(() => {
              _this.scene.attach(throwObj);
              let parabola = new THREE.Group();
              _this.scene.add(parabola);
              parabola.position.copy(throwObj.position.clone());

              // parabola.add(new THREE.AxesHelper(1));

              let target = new THREE.Group();
              // target.add(new THREE.AxesHelper(1));
              _this.scene.add(target);

              let targetPos = oldTarget.GetWorldPos();
              if (oldTarget != null) {

              } else {
                targetPos.set(0, 0, 0);
              }
              target.position.copy(targetPos);


              parabola.attach(target);

              parabola.attach(throwObj);
              //扔出拾取物品。抛物线移动
              new YJParabola(_this, parabola, throwObj, throwObj.position.clone(), target.position.clone());

              throwObj = null;

              setTimeout(() => {
                inThrowing = false;
              }, 2000);
              if (callback) {
                callback();
              }


              indexVue.$refs.YJDync._YJDyncManager.SetPlayerState({
                stateId: 1212,
                boneName: "mixamorigRightHandIndex1",
                modelName: f,
                targetPos: { x: targetPos.x, y: targetPos.y, z: targetPos.z }
              });


            }, latertime);
          });

          //发送同步数据。 骨骼名、物品名
          indexVue.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId: 1212,
            boneName: "mixamorigRightHandIndex1",
            modelName: f
          });

        }

      }

      _this.YJController.SetPlayerState(e, f);
    }

    // 主控玩家接受道具效果
    this.ReceivePlayer = function (model) {
      // 
      // console.log("接收道具 ",model);
      if (!model) {
        return;
      }
      if (_this.YJController.isInDead()) {
        // 角色死亡后不接收道具效果
        return;
      }

      if (model.buff == "addHealth") {
        //加生命值
        // data.buffValue
        let v = _this.YJController.GetUserDataItem("baseData", "health") + model.buffValue;
        let maxHealth = _this.YJController.GetUserDataItem("baseData", "maxHealth");
        if (v >= maxHealth) {
          v = maxHealth;
        }
        _this.YJController.SetUserDataItem("baseData", "health", v);

      }
      if (model.buff == "addArmor") {
        //加护甲值
        // data.buffValue
        let oldV = _this.YJController.GetUserDataItem("baseData", "armor");
        // console.log(" 旧护甲值为 ", oldV," 加 "+ model.buffValue);
        let v = oldV + model.buffValue;
        // console.log(" 新护甲值为 ", v);

        _this.YJController.SetUserDataItem("baseData", "armor", v);
      }

      if (model.buff == "addEnergy") {
        //加能量值
        // data.buffValue
        let oldV = _this.YJController.GetUserDataItem("baseData", "energy");
        // console.log(" 旧能量值为 ", oldV," 加 "+ model.buffValue);
        let v = oldV + model.buffValue;
        // console.log(" 新能量值为 ", v);

        _this.YJController.SetUserDataItem("baseData", "energy", v);
      }

      if (model.buff == "addGold") {
        _Global._YJPlayerFireCtrl.GetProperty().updateBasedata({value:1,property:"gold"});
      }
    }

    let laterSitting = null;
    this.TriggerModel = (triggerObj) => {
      if (triggerObj != null) {
        console.log("进入物体trigger ", triggerObj.modelId);
        // 进入椅子trigger区域内，1秒后坐下
        if (triggerObj.modelId.includes("chair")) {
          if (laterSitting != null) {
            clearTimeout(laterSitting);
            laterSitting = null;
          }
          laterSitting = setTimeout(() => {
            SetSittingModel(triggerObj);
          }, 1000);

        }
      } else {
        if (laterSitting != null) {
          clearTimeout(laterSitting);
          laterSitting = null;
        }
      }

    }
    this.SetSittingModelLater = function (model) {
      if (laterSitting != null) {
        clearTimeout(laterSitting);
        laterSitting = null;
      }
      laterSitting = setTimeout(() => {
        SetSittingModel(model);
      }, 1000);
    }


    this.SetSittingModel = function (model) {
      SetSittingModel(model);
    }

    let tempEnpty = new THREE.Group();
    // 设置角色坐到椅子上
    function SetSittingModel(model) {
      // 设置角色坐到椅子上
      let modelPos = _this._YJSceneManager.GetWorldPosition(model);

      _this._YJSceneManager.GetAmmo().SetEnabled(false);
      _this._YJSceneManager.SetPlayerPosDirect(modelPos);
      _this.YJController.SetOnlyRotaView(true);
      _this.YJController.SetPlayerState("sitting", "sitting");


      // unity和threejs中Z轴相差180度
      tempEnpty.quaternion.copy(model.getWorldQuaternion(new THREE.Quaternion()));
      tempEnpty.rotation.y += Math.PI;

      _this.YJController.SetPlayerQuaternion(tempEnpty.getWorldQuaternion(new THREE.Quaternion()));
    }

    this.PickDownWeapon = function () {


      if (boneAttachList.length == 0) { return; }

      _this.YJController.SetUserDataItem("weaponData", null);

      // _this.YJController.SetUserDataItem("weaponData", "weaponId", "");
      // _this.YJController.SetUserDataItem("weaponData", "weaponType", "");
      // _this.YJController.SetUserDataItem("weaponData", "transId", "");
      _Global.SendMsgTo3D("放下武器");
      _this.YJPlayer.removeWeaponModel();

      let transform = boneAttachList[0].transform;
      boneAttachList[0].parent.attach(transform.GetGroup());
      let pos = _this._YJSceneManager.GetPlayerPosReduceHeight();
      pos.y += 1;
      transform.GetGroup().position.copy(pos);
      transform.GetGroup().scale.set(1, 1, 1);
      transform.GetGroup().rotation.set(0, 0, 0);
      if (transform.GetComponent("Weapon") != null) {
        transform.GetComponent("Weapon").Reset();
      }
      boneAttachList = [];
      //同步放下武器
      _SceneDyncManager.SendModelState(transform.GetData().id, { modelType: transform.GetData().modelType, msg: { display: true, pos: pos } });

    }

    //#region 
    this.FireState = function (e) {
      _Global.applyEvent("提示",'fire',e);
    }

    //#region 对npc的伤害显示在屏幕上
    let damageStatistics = [];
    this.ResetDamageStatistics = function () {
      damageStatistics = [];
    }
    this.GetDamageStatistics = function () {
      return damageStatistics;
    }
    this.UpdateNpcDamageValue = function (fromId,fromName, to, tarteId, type, value, pos, addredius) {
      // if ((fromId && _Global.YJ3D.YJPlayer.id != fromId)
      // && (tarteId && _Global.YJ3D.YJPlayer.id != tarteId)) {
      //   return;
      // }


      let _pos = _Global.YJ3D._YJSceneManager.WorldPosToScreenPos(pos.clone());
      // console.log("伤害和坐标", from,to,value, _pos);
      _Global.applyEvent("伤害跳字",{
        owner:tarteId, type, value,pos3d: pos.clone(),pos: _pos, addredius
      });

      damageStatistics.push({ fromName, to, value });
    }

    //#endregion

    //#endregion
    let targetModel = null;
    this.GetTargetModel  =function(){
      return targetModel;
    }
    this.SetTargetSkill = function (npcId, skill) {
      // if (targetModel == null) { return; }
      // if (targetModel.id == npcId) {
      //   indexVue.$refs.HUD.$refs.headerUI.SetSkill(skill);
      // }
      //
    }
    this.SetTargetModel = function (transform) {
      _Global.hasTarget = transform != null;
      if (targetModel != null) {
        if (targetModel != transform) {

          targetModel.RemoveHandle();
        } else {
          return;
        }
      }
      targetModel = transform;
      oldTarget = targetModel;

      if (targetModel == null) {
        if (indexVue.$refs.HUD) {
          indexVue.$refs.HUD.$refs.headerUI.display = false;
        }
        ClearProjector();
        _Global.YJ3D._YJSceneManager.GetTransformManager().detach();
        return;
      }
      let npcComponent = targetModel.GetComponent("NPC");
      let camp = "normal";
      // 相同阵营的不计算
      if (npcComponent.GetCamp() != _Global.user.camp) {
        camp = "enmity";
      }

      let message = targetModel.GetData().message;
      if (message.data.baseData.health == 0) {
        camp = "dead";
      }
      let { group, playerHeight } = npcComponent.GetBaseModel();
      _YJProjector.Active(group, playerHeight, camp);
      // console.log(" 设置目标头像 targetModel ", targetModel);
      targetModel.AddHandle((data) => {
        if (data.baseData.health == 0) {
          indexVue.$refs.HUD.$refs.headerUI.display = false;
          ClearProjector();
          return;
        }
        indexVue.$refs.HUD.$refs.headerUI.SetTarget(data,npcComponent.GetNickName());
      });
      indexVue.$refs.HUD.$refs.headerUI.SetTarget(message.data,npcComponent.GetNickName());
    }

    this.ClearTarget = function(){
      ClearTarget();
    }
    function ClearTarget() {
      // 点击空白位置 
      scope.SetTargetModel(null);
      _Global._YJPlayerFireCtrl.SetPlayerEvent("设置npc", null);
      ClearProjector();
      
      if (oldTarget != null) {
        _YJProjector.SetActive(false);
        oldTarget = null;
        ChangeTarget();
      }
    }
    // 删除脚下光标
    function ClearProjector() {
      _YJProjector.SetActive(false);
    }
    this.ReceiveEvent = function (title, msg) {
      if (title == "npc尸体消失") {
        if (targetModel == msg) {
          ClearTarget();
        }
      }
    } 

    this.RightClick = (hitObject, hitPoint) => {
      _Global.applyEvent("右键点击");

      console.log(" 右键点击 ", hitObject);
      if(hitObject == null){
        return;
      }
      if (hitObject.transform) {
        // 点击NPC
        let message = hitObject.transform.GetData().message;
        // console.log(" 右键点击 transform ", message);
        if (message) {
          if (message.pointType == "npc") {
            // 头像
            this.SetTargetModel(hitObject.transform);
            if (message.data.baseData.camp != _Global.user.camp) {
              // console.log(" 选中npc 000 ",message.data.baseData);
              //敌人  
              //进入战斗状态
              if (message.data.baseData.health > 0) {
                _Global._YJPlayerFireCtrl.SetPlayerEvent("设置npc", hitObject.transform);
              }
            }
          }
        }
        return;
      }
      if (hitObject.owner) {
        let isLocal = hitObject.owner.isLocal;
        if (isLocal) {
          // 点击自身
        } else {
          // 点击其他角色
        }
        return;
      }
      // 点击空白位置 
      ClearTarget();

    }
    this.ClickPlayer = (player) => {
      console.log("点击玩家", player);
      // 自身角色除外
      if (player.isLocal) { return; }

      if (targetModel != null) {
        if (targetModel != player) {
          targetModel.RemoveHandle();
        } else {
          return;
        }
      }
      let { group, playerHeight } = player.GetBaseModel();

      let baseData = player.GetBaseData();
      let camp = "normal";
      if (baseData.camp != _Global.user.camp) {
        camp = "enmity";
      }
      if (baseData.health == 0) {
        camp = "dead";
      }
      _YJProjector.Active(group, playerHeight, camp);
      let data = {};
      data.name = player.GetNickName();
      data.avatarData = player.GetavatarData();
      data.baseData = baseData;
      player.AddHandle((baseData) => {
        if (baseData.health == 0) {
          indexVue.$refs.HUD.$refs.headerUI.display = false;
          ClearProjector();
          return;
        }
        data.baseData = baseData;
        indexVue.$refs.HUD.$refs.headerUI.SetTarget(data);
      });
      indexVue.$refs.HUD.$refs.headerUI.SetTarget(data);

      // 点击npc，播放其音效
      // console.log(owner);
      if (player.npcName) {
        indexVue.SetNpcMusicUrl(player.npcName);
      }
      targetModel = player;
      oldTarget = targetModel;

      ChangeTarget();
      return;
      // console.log(owner);
      //点击npc,显示与npc的聊天框
      if (indexVue.$refs.chatPanel && owner.GetName() == "ChatGPT001号") {
        indexVue.$refs.chatPanel.SetDisplay(true);
      }
      if (
        indexVue.$refs.chatPanelNPC &&
        (owner.GetName() == "咕叽" || owner.GetName() == "坐")
      ) {
        indexVue.$refs.chatPanelNPC.SetYJNPC(owner, indexVue.userName);
        indexVue.$refs.chatPanelNPC.SetDisplay(true);
      }
    }
    this.ClickModelTransform = function (transform) {
      if (indexVue.$refs.hierarchyPanel) {
        indexVue.$refs.hierarchyPanel.SelectModelBy3d(transform.GetUUID());
      }
      // 点击NPC
      let message = transform.GetData().message;
      if (message) {
        if (message.pointType == "npc") {
          // 头像
          this.SetTargetModel(transform);
          console.log(" 点击NPC  ", transform.GetComponent("NPC"));
          EventHandler("点击NPC", transform);
          _Global._YJPlayerFireCtrl.SetPlayerEvent("选中npc", transform);
          if (_Global.LogFireById) {
            _Global.LogFireById(transform.id);
          }
          return;
        }
      }
      EventHandler("点击空");

    }

    let eventHandlers = [];
    this.addEventListener = function (e, event) {
      eventHandlers.push({ eventName: e, event: event });
    }
    function EventHandler(e, value, value2) {
      for (let i = 0; i < eventHandlers.length; i++) {
        const item = eventHandlers[i];
        if (item.eventName == e) {
          if (item.event) {
            item.event(value, value2);
          }
        }
      }
    }

    this.ClickModel = (hitObject) => {
      console.log("点击模型 ", hitObject);

      _Global.applyEvent("点击三维页");
      if(hitObject == null){
        return;
      }
      // console.log("点击模型.transform ", hitObject.transform);
      if (hitObject.transform && hitObject.transform.GetActive()) {
        this.ClickModelTransform(hitObject.transform);
        return;
      }


      let modelType = hitObject.tag;
      if (modelType == undefined) {
        EventHandler("点击空");
        return;
      }
      console.log("点击物体 ", modelType);
      if (modelType == "bonedummy") {
        // 选中创建的骨骼参考虚拟物体
        _Global.YJ3D._YJSceneManager.GetTransformManager().attach(hitObject.parent);
        return;
      }

      if (modelType == "chair") {
        if (hitObject.owner != undefined) {

        }
        // 设置角色坐到椅子上
        SetSittingModel(hitObject);
        return;
      }
      // 拾取物品
      if (modelType.indexOf('交互物品') > -1) {

        let modelPos = _this._YJSceneManager.GetWorldPosition(hitObject);
        //让角色朝向模型位置
        _this.YJController.PlayerLookatPos(modelPos);

        //判断角色与物品的距离，超过1米，则不交互
        let distance = modelPos.distanceTo(_this._YJSceneManager.GetPlayerPos());
        console.log("物品与角色的距离 ", distance);
        if (distance >= 1.7) { return; }

        let sp = modelType.split('-');
        _this.YJController.SetPlayerState("interactive", sp[1]);

        if (pickTimeout != null) {
          clearTimeout(pickTimeout);
        }
        pickTimeout = setTimeout(() => {
          // console.log("删除物品 " + hitObject.modelName);
          // 把删除物体的材质球备份，防止其他相同材质引用的模型材质也被清除
          hitObject.traverse(function (item) {
            if (item.type === 'Mesh') {
              let cloneMat = item.material.clone();
              item.material = cloneMat;
            }
          })
          _this._YJSceneManager.clearGroup(hitObject);

          //在模型位置相对于界面2d坐标，生成图标。 
          // indexVue.CreateIconTo(hitObject.modelName,_this._YJSceneManager.WorldPosToScreenPos(modelPos));
          // moveModels.push({ model: CreateObj(modelPos),currentTargetPos:modelPos, target: posRef_huluobu, lerpLength: 0 });
          // b_lerpMoving = true;

          // AddModel(hitObject.modelName, hitObject.modelPath);
          MoveTween(CreateObj(modelPos, hitObject.modelName), hitObject.modelName == "南瓜" ? posRef_nangua : posRef_huluobu);
        }, 1500);

      }
    }
    this.HoverObject = (hoverObject, hoverPoint) => {
      if (hoverObject == null) {
        _Global.ReportTo3D("切换光标", "正常");
        return;
      }

      _Global.ReportTo3D("切换光标", "正常");
      if (hoverObject.transform && hoverObject.transform.GetActive && hoverObject.transform.GetActive() && hoverObject.transform.GetData) {
        // 点击NPC
        // console.log(" 右键点击 transform ", message);
        let message = hoverObject.transform.GetData().message;
        if (message) {

          // console.log(" == in scene manager editor  hover物体  ", hoverObject);
          // console.log(" == in scene manager editor  hover npc  ", message.pointType == "npc");

          if (message.pointType == "npc") {
            if (message.data.baseData.camp != _Global.user.camp
              && message.data.baseData.health != 0
            ) {
              //敌人  
              _Global.ReportTo3D("切换光标", "可攻击");
            }

          }
        }
        return;
      }
      return;
      if (hoverObject == null) {
        // _this.SetCursor("default");
        _Global.ReportTo3D("切换光标", "正常");
        return;
      }
      let modelType = hoverObject.tag;
      if (modelType == undefined) {
        // _this.SetCursor("default");
        _Global.ReportTo3D("切换光标", "正常");
        return;
      }
      if (modelType.indexOf('交互物品') > -1) {
        _this.SetCursor("pointer");
      } else {
        _this.SetCursor("default");
      }
    }
    this.CreateHotContent = (modelData, owner) => {
      if (modelData.id.includes("chair")) {
        //点击热点坐椅子
        scope.SetSittingModel(owner.GetGroup());
        owner.SetPointVisible(false);
      }
    }

    let sceneName = "";

    let allDyncModel = [];
    let inJoystick = true;
    this.JoystickAxis = function (x, y) {
      if (!inJoystick) { return; }
      // console.log("摇杆 ",x,y);
      if (_YJCar == null) {
        return;
      }
      if (x == 0) {
        _YJCar.SetKeyboardUp("KeyA");
        _YJCar.SetKeyboardUp("KeyD");
      } else {
        _YJCar.SetKeyboardUp("KeyA");
        _YJCar.SetKeyboardUp("KeyD");
        _YJCar.SetKeyboard(x < 0 ? "KeyA" : "KeyD");
      }
      if (y == 0) {
        _YJCar.SetKeyboardUp("KeyW");
        _YJCar.SetKeyboardUp("KeyS");
      } else {
        _YJCar.SetKeyboardUp("KeyW");
        _YJCar.SetKeyboardUp("KeyS");
        _YJCar.SetKeyboard(y < 0 ? "KeyW" : "KeyS");
      }


    }

    let npcMovePos = [];
    // 场景中模型的坐标。供NPC寻路使用
    this.GetNpcMovePos = function (moveName) {
      for (let i = 0; i < npcMovePos.length; i++) {
        const element = npcMovePos[i];
        if (element.moveName == moveName) {
          return element.pos;
        }
      }
      return null;
    }

    // 加载地图id内的模型完成
    this.LoadMapCompleted = () => {
      _SceneDyncManager.InitDyncSceneModels();
    }
    this.ChangeScene = function (e) {

      let routerPath = _this.$route.path.toLowerCase();
      if (routerPath.includes("metaworld")) {
        new SceneManagerMetaworld(scene, renderer, camera, _this, modelParent, indexVue);
      }

      indexVue.$nextTick(() => {
        if (indexVue.$refs.gameUI) {
          indexVue.$refs.gameUI.SetPlayerName(indexVue.userName, indexVue.avatarName);
          indexVue.$refs.gameUI.InitPlayerHeader();
        }
      });

      indexVue.$nextTick(() => {
        if (indexVue.$refs.gameUI) {
          indexVue.$refs.gameUI.ChangeScene(e.roomName);
        }
      });
      console.log("renderer.sortObjects ", renderer.sortObjects);
      let modelData = JSON.parse(localStorage.getItem("modelData"));
      console.log("modelData ", modelData);
      if (_Global.isMMD) {
        //给骨骼添加dummy显示
        let _SpringManager = new SpringManager();
        _this._YJSceneManager.AddNeedUpdateJS(_SpringManager);

        // let transform = _Global.YJ3D._YJSceneManager.GetSingleModelTransform().GetGroup();
        // let time = 0;
        // setInterval(() => {
        //   time+=0.1;
        //   transform.rotation.y += Math.sin(time) * 0.1;
        // }, 20);

        // let obj = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        // console.log("GetSingleModelTransform ", obj);
        // let _YJAmmoPlayerBody = new YJAmmoPlayerBody(_this, scene);
        // _YJAmmoPlayerBody.CreateRopeBone(obj.GetGroup());

        // setInterval(() => {
        //   obj.GetGroup().position.add(new THREE.Vector3(0.01,0,0));
        // }, 20);

        // bones.forEach(bone => {
        //   console.log(bone);
        //   const ball = new THREE.Mesh(new THREE.SphereGeometry(222.2, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020 }));
        //   ball.castShadow = true;
        //   ball.receiveShadow = true;
        //   bone.add(ball);
        // });


      }

      // let group = new THREE.Group();
      // group.add(new THREE.AxesHelper(100));
      // _Global.YJ3D.scene.add(group);
      // console.log(group.position);
      // console.log(group.getWorldDirection(new THREE.Vector3()));
      // setInterval(() => {
      //   group.lookAt(new THREE.Vector3(0, 0, 0));
      //   group.position.add(group.getWorldDirection(new THREE.Vector3()).multiplyScalar(-0.05));
      //   console.log(group.position);
      // }, 100);
      return;
      // const ball = new THREE.Mesh(new THREE.SphereGeometry(2, 20, 20), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
      // scene.add(ball);
      console.log("renderer.sortObjects ", renderer.sortObjects);
      renderer.sortObjects = false;
      if (modelData.modelType == "角色模型") {
        //给骨骼添加dummy显示
        let bones = _Global.YJ3D._YJSceneManager
          .GetSingleTransformComponent("MeshRenderer").GetAllBoneModel();
        for (let i = 0; i < bones.length; i++) {
          const item = bones[i];
          if (
            item.name == "node__0_1L_-467894"
            || item.name == "袖_0_1_R"
            || item.name == "袖_0_1_L"
            || item.name == "后摆_1_0"
            || item.name == "后摆_1_1"
            || item.name == "后摆_1_2"
            || item.name == "后摆_1_3"
            || item.name == "后摆_1_4"
            || item.name == "后摆_1_5"
            || item.name == "后摆_1_6"
            || item.name == "后摆_1_7"
            || item.name == "后摆_1_8"
            || item.name == "后摆_1_9"
            || item.name == "后摆_1_10"
            || item.name == "后摆_1_11"
            || item.name == "侧髪_2_1_L"
            || item.name == "侧髪_2_1_R"
            || item.name == "后髪_0_1"

          ) {
            let _YJAmmoRope = new YJAmmoRope(_this, scene);
            _YJAmmoRope.CreateRopeBone(item);
            // _YJGlobal._YJAmmo.AddNeedUpdateJS(_YJAmmoRope);

            console.log(" 添加袖子物理节点 ");
          }
          // scene.attach(ball);
        }


        let obj = _Global.YJ3D._YJSceneManager.GetSingleModelTransform();
        console.log("GetSingleModelTransform ", obj);
        let _YJAmmoPlayerBody = new YJAmmoPlayerBody(_this, scene);
        _YJAmmoPlayerBody.CreateRopeBone(obj.GetGroup());

        // setInterval(() => {
        //   obj.GetGroup().position.add(new THREE.Vector3(0.01,0,0));
        // }, 20);

        // bones.forEach(bone => {
        //   console.log(bone);
        //   const ball = new THREE.Mesh(new THREE.SphereGeometry(222.2, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020 }));
        //   ball.castShadow = true;
        //   ball.receiveShadow = true;
        //   bone.add(ball);
        // });


      }


      console.log(" =======场景加载完成 ");
      return;
    }
    this.DisplayBoneDummy = function (b) {
      let bones = _Global.YJ3D._YJSceneManager
        .GetSingleTransformComponent("MeshRenderer").GetAllBoneModel();
      for (let i = 0; i < bones.length; i++) {
        const item = bones[i];

        if (b) {

          let boneHeight = 0.02;
          let pos1 = item.getWorldPosition(new THREE.Vector3());
          if (item.children.length > 0) {
            for (let i = 0; i < item.children.length; i++) {
              const element = item.children[i];
              if (element.isBone) {

                let pos2 = element.getWorldPosition(new THREE.Vector3());
                boneHeight = pos1.distanceTo(pos2);
                // console.log(" 骨骼长度 ", boneHeight);
              }
            }
          } else {

          }

          const ball = new THREE.Mesh(
            new THREE.ConeGeometry(0.02, boneHeight, 3),
            // new THREE.SphereGeometry(0.02, 20, 20), 
            new THREE.MeshBasicMaterial(
              {
                color: 0x0000ff,
                transparent: true,
                opacity: 0.5,
              }
            ));
          item.attach(ball);
          ball.position.set(0, boneHeight / 2, 0);
          ball.rotation.set(0, 0, 0);
          ball.tag = "bonedummy";
          ball.name = item.name;
          item.bonedummy = ball
          // ball.renderOrder = 10;
          // item.renderOrder = 10;
          ball.renderOrder = Number.MAX_SAFE_INTEGER;
          item.renderOrder = Number.MAX_SAFE_INTEGER;
        } else {
          if (item.bonedummy) {
            item.remove(item.bonedummy);
            item.bonedummy = undefined;
          }
        }

        // scene.attach(ball);
      }
    }


    this.UpdateSkin = (_YJPlayer, playerName, playerState) => {

      // console.error(" 同步换装数据 ",playerName, playerState);
      if (playerName != "litleUnityChain2" || playerState == null || playerState == undefined) {
        _YJPlayer.ChangeSkinCompleted();
        return;
      }

      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      let skinData = avatarData.skinData;
      if (skinData == undefined || skinData.length <= 1) { return; }
      let sp = playerState.split('_');
      for (let i = 0; i < skinData.length; i++) {
        skinData[i].selected = parseInt(sp[i]);
      }
      let mode = "";
      let part = "";
      let targetPath = "";

      let faceSourcePath = "";
      let faceAddPath = "";

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }
      }

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          targetPath = element.modelPath[element.selected];

          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
          _YJPlayer.ChangeSkin(targetPath, "Face", element.mode, faceSourcePath);
          _YJPlayer.ChangeSkin(faceAddPath, "Face", "addTexture", faceSourcePath);
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
      }
      setTimeout(() => {
        _YJPlayer.ChangeSkinCompleted();
      }, 500);
    }

    this.GetSceneModel = function (id) {

      // console.log("查找场景模型  ", id);
      for (let i = 0; i < allDyncModel.length; i++) {
        const element = allDyncModel[i];
        if (element.id == id) {
          return element.modelJS.GetModel();
        }
      }
      return null;
    }
    //#region  同步

    this.AddDyncModel = function (id, _modelJS) {
      for (let i = 0; i < allDyncModel.length; i++) {
        const element = allDyncModel[i];
        if (element.id == id) {
          return;
        }
      }
      allDyncModel.push({ id: id, modelJS: _modelJS });
    }
    this.Receive = function (sceneState) {
      // console.log(" 场景中接收到场景同步状态 , " ,sceneState);
      for (let i = 0; i < allDyncModel.length; i++) {
        const element = allDyncModel[i];
        if (element.id == sceneState.id) {
          element.modelJS.ReceiveState(sceneState.state);
          return;
        }
      }
    }
    //#endregion

    let _YJCar = null;
    this.SetCar = function (scope) {
      if (scope == null) {
        if (_YJCar != null) {
          _YJCar = scope;
        }
        return;
      }
      console.log(" 查看汽车使用状态 ", scope.IsUsed());
      if (scope.IsUsed()) {
        return true;
      }
      _YJCar = scope;
      return false;
    }
    this.InCar = function (scope) {
      if (_YJCar == null) { return; }
      scope = _YJCar;

      scope.SetCanMoving(true);

      _this.YJController.SetPlayerAvatarDisplay(false); //隐藏角色，显示姓名条
      // _this.YJController.SetPlayerDisplay(false);
      _this.YJController.CancelMoving();
      _this.YJController.SetCanMoving(false);
      _this.YJController.SetLockDisplay(true);
      _this.YJController.SetCameraWheelPos(-10);
      _this.YJController.SetFollowParent(scope.GetModel());

      //把刚体放在中心，且刚体忽略物理效果、显示姓名条

      _this._YJSceneManager.GetAmmo().SetRigidbodySleep(false);

      let pos = _this._YJSceneManager.GetWorldPosition(scope.GetModel());
      _this._YJSceneManager.GetAmmo().SetPlayerPos(pos);
      _this.YJController.SetMyCtrlRbParent(scope.GetModel());

      _this.YJController.SetNameTransOffsetAndScale(2.5, 5);

    }
    this.OutCar = function (scope) {
      if (_YJCar == null) { return; }
      _this.YJController.ResetNameTransOffsetAndScale();
      _this.YJController.SetMyCtrlRbParent(scene);

      _this.YJController.SetPlayerRota();


      scope = _YJCar;
      let pos = _this._YJSceneManager.GetWorldPosition(scope.GetModel());
      pos.z += -2;
      _this._YJSceneManager.GetAmmo().SetPlayerPos(pos);

      // 最后激活刚体
      _this._YJSceneManager.GetAmmo().SetRigidbodySleep(true);

      _this.YJController.SetLockDisplay(false);
      // _this.YJController.SetPlayerDisplay(true);
      _this.YJController.SetPlayerAvatarDisplay(true);
      _this.YJController.StopFollow();
      _this.YJController.SetCanMoving(true);




      scope.SetCanMoving(false);

      _YJCar = null;
    }
    function createReflectorMesh(mirrorGeometry) {
      if (!mirrorGeometry) {
        mirrorGeometry = new THREE.PlaneGeometry(200, 100);
      }
      // let 
      let material = new THREE.MeshBasicMaterial({
        // map: new THREE.TextureLoader().load( _this.GetPublicUrl() + "textureone.jpg"),
        // color:0xffffff,
        // color:0x666666,
        transparent: true,
      });
      let groundMirror = new ReflectorMesh(mirrorGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0xffffff,
        material: material,
        reflectorFactor: 0.03,
      });
      groundMirror.position.y = 0.1;
      groundMirror.rotateX(-Math.PI / 2);
      console.log(groundMirror);
      scene.add(groundMirror);
    }

    this.Photo = function (callback) {
      _YJ3dPhotoPlane = new YJ3dPhotoPlane(_this, scene, renderer, camera);
      _YJ3dPhotoPlane.Photo(callback);
    }
    let videoPlane = null;
    this.LoadScreenStreamVideo = function (video) {
      if (video == false || video == null) {
        return;
      }

      // console.log("共享屏幕画面视频", video);
      const _video = document.getElementById("video_" + video);

      const texture = new THREE.VideoTexture(_video);

      videoPlane.material.dispose();

      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture
      });
      videoPlane.material = mat;


      if (sceneName == "Scene1") {
        ScreenPlaneTween(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 1, 1));
      }

    }


    function LoadScreenStreamVideoFn(videoPlane, video) {
      if (video == false || video == null) {
        return;
      }
      const _video = document.getElementById(video);
      console.log(" 获取视频 ", _video);

      const texture = new THREE.VideoTexture(_video);
      videoPlane.material.dispose();

      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture
      });
      videoPlane.material = mat;

    }



    // let targetScale = new THREE.Vector3(0,0,0);
    // let currentScale =  new THREE.Vector3(0,0,0);
    // 展开共享屏幕模型
    function ScreenPlaneTween(currentScale, targetScale, callback) {

      let movingTween = new TWEEN.Tween(currentScale).to(targetScale, 1500).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        videoPlane.scale.set(currentScale.x, currentScale.y, currentScale.z);
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

    }


    function CreatePosRef(x, y) {

      //在2d物品栏对应的3d位置生成模型
      let cubeGeometry = new THREE.SphereGeometry(0.00, 50, 50);
      let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
      });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      _this.camera.add(cube);

      cube.translateZ(-2);

      cube.translateX(x);
      cube.translateY(y);
      return cube;
    }



    function CreateObj(modelPos, modelName) {
      //在2d物品栏对应的3d位置生成模型
      let cubeGeometry = new THREE.SphereGeometry(0, 50, 50);
      let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
      });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      _this.scene.add(cube);
      modelPos.y += 1;
      cube.position.copy(modelPos);
      _this.camera.attach(cube);
      cube.name = modelName;
      indexVue.CreateIconTo(cube.name, _this._YJSceneManager.GetObjectPosToScreenPos(cube));
      return cube;
    }

    function CreateThrowObj(parent, modelName) {
      let mesh = _this._YJSceneManager.checkLoadMesh(_this.GetPublicModelUrl() + _this._YJSceneManager.GetModelPath(modelName));
      let cube = LoadMesh(mesh);
      cube.scale.set(100, 100, 100);
      // //在2d物品栏对应的3d位置生成模型
      // let cubeGeometry = new THREE.SphereGeometry(10, 50, 50);
      // let cubeMaterial = new THREE.MeshStandardMaterial({
      //   color: 0x808080,
      // });
      // let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      parent.add(cube);
      cube.position.set(0, 0, 0);
      cube.name = modelName;
      return cube;
    }

    function LoadMesh(mesh) {
      // console.log(" 已存在mesh ,复用之 ！", name);
      let group = mesh.clone();
      let model = group.children[0];
      model.traverse(function (item) {
        if (item.type === 'Mesh') {
          let cloneMat = item.material.clone();
          item.material = cloneMat;
        }
      })
      return model;
    }


    function MoveTween(model, targetObj) {

      let fromPos = model.position.clone();
      fromPos.y += 1;
      let targetPos = targetObj.position.clone();
      MoveToPosTween(model, fromPos, 1000, () => {
        MoveToPosTween(model, targetPos, 2000, () => {
          _this._YJSceneManager.clearGroup(model);
          _this.camera.remove(model);
          indexVue.DelIconTo(model.name);

        });
      });
    }

    function MoveToPosTween(model, targetPos, length, callback) {

      let fromPos = model.position.clone();
      let movingTween = new TWEEN.Tween(fromPos).to(targetPos, length).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.position.copy(fromPos);
        indexVue.UpdateIconTo(model.name, _this._YJSceneManager.GetObjectPosToScreenPos(model));
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

    }

    let moveModels = [];
    let b_lerpMoving = false;
    function LerpMove() {

      if (b_lerpMoving && moveModels.length > 0) {

        for (let i = 0; i < moveModels.length; i++) {
          const moveModelData = moveModels[i];

          // let targetPos = _this._YJSceneManager.GetWorldPosition(moveModelData.target);
          // let targetPos = _this._YJSceneManager.GetWorldPosition(moveModelData.target);

          moveModelData.lerpLength += 0.001;
          moveModelData.currentTargetPos.lerp(moveModelData.targetPos, moveModelData.lerpLength);
          moveModelData.model.position.copy(moveModelData.currentTargetPos);
          if (Math.abs(targetPos.z - moveModelData.currentTargetPos.z) < 0.01
            && Math.abs(targetPos.x - moveModelData.currentTargetPos.x) < 0.01
            && Math.abs(targetPos.y - moveModelData.currentTargetPos.y) < 0.01
          ) {
            moveModels.splice(i, 1);
            // console.log("已移动到指定位置");
          }
        }
      }
    }
    this.StopScreenStreamVideo = function () {

      if (sceneName == "Scene2") {
        videoPlane.material.dispose();
        let path = _this.GetPublicUrl() + "screenPic.jpg";
        let map = _this._YJSceneManager.checkLoadTexture(path);
        let mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: map,
        });
        videoPlane.material = mat;
      }
      if (sceneName == "Scene1") {
        ScreenPlaneTween(new THREE.Vector3(1, 1, 1), new THREE.Vector3(0, 1, 0), () => {
          videoPlane.material.dispose();
          let mat = new THREE.MeshBasicMaterial({
            color: 0xffffff
          });
          videoPlane.material = mat;
          videoPlane.scale.set(0, 0, 0);
        });
      }

    }
    function CreateScreenStreamPlane(size, pos, rotaV3, scale, textPath) {
      let geo = new THREE.BoxGeometry(size.x, size.y, size.z);

      let map = _this._YJSceneManager.checkLoadTexture(textPath);
      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: map,
      });
      let cube = new THREE.Mesh(geo, mat);
      modelParent.add(cube);
      cube.tag = "screenPlane";
      cube.position.copy(pos);
      cube.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
      cube.scale.set(scale.x, scale.y, scale.z);
      return cube;
    }



    // function CreateScreenStreamPlane(size,pos,rotaV3,scale) {
    //   let size = 14;
    //   let geo = new THREE.BoxGeometry(0.3, size, size * 2);
    //   let mat = new THREE.MeshBasicMaterial({
    //     color: 0x666666,
    //   });
    //   let cube = new THREE.Mesh(geo, mat);
    //   modelParent.add(cube);
    //   cube.tag = "screenPlane";
    //   cube.position.set(-11, 15, -27);
    //   cube.rotation.set(0, -Math.PI / 4, 0);
    //   cube.scale.set(0,0,0);
    //   return cube;
    // }

    function onPointerDown(event) {
      // console.log(" player pos = >", pos);

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const found = raycaster.intersectObjects(scene.children, true);
      // console.log(found);
      if (found.length > 0) {
        let all = "";
        for (let i = 0; i < found.length; i++) {
          const hitObj = found[i].object;
          if (hitObj.isMesh) {
            all += hitObj.name + "、";
            // console.log(" 鼠标位置的模型 ", hitObj);

            // all += hitObj.material.name +  "、";
          }
        }
        console.log(" 鼠标位置的模型 ", all);

      }

    }

    //实时刷新
    function render() {
      requestAnimationFrame(render);
      TWEEN.update();
    }
    this._update = function () {

      TWEEN.update();
      for (let i = 0; i < allDyncModel.length; i++) {
        allDyncModel[i].modelJS._update();
      }
    }


    InitFn();
  }
}

export { SceneManager };