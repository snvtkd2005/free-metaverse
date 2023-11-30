import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";

import { YJLoadAvatar } from "/@/threeJS/YJLoadAvatar.js";
import { YJProjector } from "/@/threeJS/YJProjector.js";

import { GetPathFolders, LoadFile } from "/@/utils/api.js";
import TWEEN from '@tweenjs/tween.js';
import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";
import { YJParabola } from "/@/threeJS/YJParabola.js";
import { YJTrailRenderer } from "/@/threeJS/components/YJTrailRenderer.js";


// 场景同步数据

class YJGameManagerEditor {
  constructor(_this, parentUI, camera) {
    var scope = this;

    let dyncModelList = [];
    let npcModelList = [];

    // 初始化场景中需要同步的模型。每个客户端都执行
    this.InitDyncSceneModels = () => {
      //武器、npc 
      let modelDataList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetModelList();
      for (let i = 0; i < modelDataList.length; i++) {
        const element = modelDataList[i];
        if (element.modelType == "NPC模型"
          || element.modelType == "装备模型"
        ) {
          dyncModelList.push({ id: element.id, modelType: element.modelType, state: {} });
        }
      }

      npcModelList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetAllTransformByModelType("NPC模型");
      if (_Global.setting.inEditor) {
        return;
      }
      setInterval(() => {
        CheckNpcLookat();
      }, 500);
    }

    // 每0.5秒检测一次。巡视NPC是否能发现玩家。每个玩家独立计算，计算后再做npc目标同步
    function CheckNpcLookat() {

      if (_Global.YJ3D.YJController.isInDead()) {
        return;
      }
      let playerPos = _Global.YJ3D.YJController.GetPlayerWorldPos();
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营的不计算
        if (npcComponent.GetCamp() == _Global.user.camp) {
          continue;
        }
        if (npcComponent.isCanSetTarget()) {
          let distance = playerPos.distanceTo(element.GetGroup().position);
          if (distance <= 12) {
            // 第三个参数表示是否查找npc附近的npc，让附近的npc一起攻击玩家
            npcComponent.SetTarget(_Global.YJ3D.YJPlayer, true, true);
          }
          // console.log("npc 距离玩家 坐标 {0} 米", distance);

        }
      }
    }
    // 设置npc1附近的npc共同攻击npc1的目标
    this.SetNearNPCTarget = function (npcComponent1, targetModel) {
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营的返回
        if (npcComponent != npcComponent1 && npcComponent.GetCamp() == npcComponent1.GetCamp()) {
          console.log("查找附近npc ", npcComponent);
          if (npcComponent.isCanSetTarget()) {
            let distance = npcComponent1.transform.GetGroup().position.distanceTo(element.GetGroup().position);
            if (distance <= 12) {
              npcComponent.SetTarget(targetModel, true, false);
              scope.NPCAddFireById(npcComponent, npcComponent1.fireGroup);
            }
          }
        }
      }

    }
    // 战斗组，用来做npc的攻击目标，第一目标死亡，攻击第二目标
    let fireGroup = [
      // {fireId:0,playerList:[],npcList:[]},
    ];
    // NPC加入战斗.由NPC受伤调用开启战斗
    this.NPCAddFire = function (npcComponent, targetModel) {
      let hasGroup = false;

      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        // let cNpc = false;
        // for (let j = 0; j < element.npcList.length && !cNpc; j++) {
        //   const npc = element.npcList[j];
        //   if(npc == npcComponent){
        //     cNpc = true;
        //     element.npcList.push(npcComponent); 
        //   }
        // }

        let cPlayer = false;
        for (let j = 0; j < element.playerList.length && !cPlayer; j++) {
          const player = element.playerList[j];
          if (player == targetModel.id) {
            cPlayer = true;
            element.npcList.push(npcComponent.transform.id);
            this.SendSceneState("战斗状态");

          }
        }
        if (cPlayer) {
          npcComponent.fireId = element.fireId;
          hasGroup = true;
          console.log(" npc 加入战斗 11 ", element.fireId);
        }
      }
      if (hasGroup) {
        return;
      }
      let fireId = new Date().getTime();
      fireGroup.push({ fireId: fireId, playerList: [targetModel.id], npcList: [npcComponent.transform.id] });
      targetModel.fireId = fireId;
      npcComponent.fireId = fireId;
      console.log(" 开始新的战斗 ", fireGroup[fireGroup.length - 1]);
      this.SendSceneState("战斗状态");

    }
    // 玩家加入正在进行的战斗。 如果玩家和npc都未在战斗中，则有NPC触发生成战斗组
    this.PlayerAddFire = function (npcComponent, targetModel) {
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        let cNpc = false;
        for (let j = 0; j < element.npcList.length && !cNpc; j++) {
          const npc = element.npcList[j];
          if (npc == npcComponent.transform.id) {
            cNpc = true;

            let hasPlayer = false;
            for (let k = 0; k < element.playerList.length && !hasPlayer; k++) {
              const player = element.playerList[k];
              if (player == targetModel.id) {
                hasPlayer = true;
              }
            }
            if (!hasPlayer) {
              targetModel.fireId = element.fireId;
              element.playerList.push(targetModel.id);
              console.log(" 玩家 加入战斗 ", element.fireId);
            }
          }
        }
      }
      this.SendSceneState("战斗状态");

    }
    this.NPCAddFireById = function (npcComponent, fireId) {
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          element.npcList.push(npcComponent.transform.id);
          console.log(" npc 加入战斗 22 ", element.fireId);
        }
      }
      this.SendSceneState("战斗状态");

    }

    // 未受伤、未被npc攻击，强制设置玩家进入战斗id
    this.PlayerAddFireById = function (player, fireId) {
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          element.playerList.push(player.id);
          console.log(" 玩家 加入战斗 22 ", element.fireId);
        }
      }
      this.SendSceneState("战斗状态");
    }
    this.RequestNextFireIdPlayer = function (npcId, fireId) {
      if (_Global.mainUser) {
        GetFireIdPlayer({ npcId: npcId, fireId: fireId });
      } else {
        this.SendSceneState("请求下一个目标", { npcId: npcId, fireId: fireId });
      }
    }
    function GetFireIdPlayer(state) {
      let { npcId, fireId } = state;
      let npcComponent = null;
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        if (element.id == npcId) {
          npcComponent = element.GetComponent("NPC");
        }
      }
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          for (let j = 0; j < element.playerList.length; j++) {
            const playerId = element.playerList[j];
            console.log("npc查找同一战斗的玩家 ", fireId, playerId);

            const player = _Global.YJDync.GetPlayerById(playerId);
            if (player) {
              console.log(player.GetUserData());
              if (player.isLocal) {
                if (_this.YJController.GetUserData().baseData.health > 0) {
                  //发送npc目标
                  npcComponent.SetTarget(player, true, false);
                  return;
                }
              } else {
                if (player.GetUserData().baseData.health > 0) {
                  //发送npc目标
                  npcComponent.SetTarget(player, true, false);
                  return;
                }
              }
            }
          }
        }
      }
      npcComponent.SetTargetToNone(true, false);

    }
    this.SendSceneStateToServer = () => {
      _Global.YJDync._YJDyncManager.SendSceneState("初始化", dyncModelList);
    }
    // 玩家拾取场景内物体的数据。用来做场景物体同步
    let playerData = [];
    //发送单个物体数据
    this.SendModelState = function (id, state) {
      if (!_Global.YJDync) {
        return;
      }
      _Global.YJDync._YJDyncManager.SendSceneState("更新single", { id: id, modelType: state.modelType, state: state.msg });

      // for (let i = 0; i < dyncModelList.length; i++) {
      //   const element = dyncModelList[i];
      //   if (element.id == id) {
      //     element.state = state;

      //     if (state.modelType == "装备模型") {
      //       playerData.push({ playerId: _Global.YJDync.id, modelType: state.modelType, msg: state.msg });
      //     }
      //     console.error(" 发送单个物体数据 ", state);
      //   }
      // }

    }

    //发送整个场景数据
    this.SendSceneState = function (type, msg) {
      if (!_Global.YJDync) {
        return;
      }
      if (type == undefined) {
        type = "all";
      }
      if (type == "all") {
        _Global.YJDync._YJDyncManager.SendSceneState("转发", { type: type, state: dyncModelList });
        return;
      }
      if (type == "战斗状态") {
        _Global.YJDync._YJDyncManager.SendSceneState("转发", { type: type, state: fireGroup });
        return;
      }
      if (type == "请求下一个目标") {
        _Global.YJDync._YJDyncManager.SendSceneState("转发", { type: type, state: msg });
        return;
      }
      _Global.YJDync._YJDyncManager.SendSceneState("转发", { type: type, state: msg });

    }

    this.Receive = function (sceneState) {
      let state = sceneState.state;

      if (sceneState.type == "战斗状态") {
        fireGroup = state;
        console.log("战斗状态同步改变 ", fireGroup);
        return;
      }
      if (sceneState.type == "请求下一个目标") {
        if (_Global.mainUser) {
          console.log("设置下一个目标 ", state);
          GetFireIdPlayer(state);
        }
        return;
      }


      if (sceneState.type == "获取场景状态") {
        console.log("获取场景状态 222 ", sceneState);

        //整个场景所有模型的更新
        for (let i = 0; i < dyncModelList.length; i++) {
          const element = dyncModelList[i];
          let has = false;
          for (let j = 0; j < state.length && !has; j++) {
            const _state = state[j];
            if (element.id == _state.id) {
              element.state = _state.state;
              has = true;
            }
          }
        }

        for (let i = 0; i < state.length; i++) {
          const element = state[i];
          _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(element);
        }
        return;
      }


      if (sceneState.type == "all") {
        console.log("接收场景同步信息", sceneState);

        //整个场景所有模型的更新
        for (let i = 0; i < dyncModelList.length; i++) {
          const element = dyncModelList[i];
          let has = false;
          for (let j = 0; j < state.length && !has; j++) {
            const _state = state[j];
            if (element.id == _state.id) {
              element.state = _state.state;
              has = true;
            }
          }
        }

        for (let i = 0; i < state.length; i++) {
          const element = state[i];
          _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(element);
        }
        return;
      }

      if (sceneState.type == "服务器下发") {

        // return;
      }
      console.log("更新单个模型 ", sceneState);
      //单个模型的更新
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(state);
      for (let i = 0; i < dyncModelList.length; i++) {
        const element = dyncModelList[i];
        // console.log("查找",state.id,element.id);
        if (element.id == state.id) {
          element.state = state.state;
          return;
        }
      }
    }
    //接收服务器下发
    this.ReceiveFromServer = function (sceneState) {
      let state = sceneState.state;
      console.log(" 接收服务器下发 更新单个模型 ", sceneState, state);
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(state);
    }


    // 由主控发送模型同步信息
    /**
     * 
     * @param {模型唯一id} id 模型唯一id
     * @param {同步类型标题} title 同步类型标题
     * @param {同步数据} data 同步数据
     */
    this.UpdateModel = (id, title, data) => {
      _Global.YJDync._YJDyncManager.UpdateModel(id, title, data);
    }
    // 接收服务器转发过来的由主控发送的模型同步信息
    this.ReceiveModel = function (id, title, data) {
      // console.log("接收 同步信息 ",id, title, data);

      if (title == "同步trail") {
        let { startPos, targetPos, time } = data;
        shootTargetFn(startPos, targetPos, time);
        return;
      }
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().ReceiveModel(id, title, data);
    }



    //移除角色时，移除其数据。如还原其拾取的武器
    this.DelPlayer = function (id) {
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        // 如果npc的目标离线，则让npc查找下一个目标
        if (npcComponent.GetTargetModelId() == id) {
          npcComponent.CheckNextTarget();
        }
      }
    }

    //#region 
    //#endregion

    //#region 
    this.FireState = function (e) {
      // if (e == "太远了") {
      // }
      parentUI.$refs.HUD.$refs.fireStateUI.Add("提示",e);

    }
    //#endregion


    //#region 对npc的伤害显示在屏幕上
    this.UpdateNpcDamageValue = function (owner, type, value, pos) {
      let _pos = _Global.YJ3D._YJSceneManager.WorldPosToScreenPos(pos);
      console.log("伤害和坐标", value, _pos);
      parentUI.$refs.HUD.$refs.damageUI.AddDamage(owner, type, value, _pos);
    }

    //#endregion


    //#region
    let _YJTrailRenderer = [];
    this.shootTarget = function (startPos, taget, time) {
      scope.UpdateModel("", "同步trail", { startPos: startPos, targetPos: taget.GetWorldPos(), time: time });
      shootTargetFn(startPos.clone(), taget.GetWorldPos(), time);
    }
    function shootTargetFn(startPos, targetPos, time) {
      for (let i = 0; i < _YJTrailRenderer.length; i++) {
        const element = _YJTrailRenderer[i];
        if (!element.trail.used) {
          MoveToPosTweenFn(startPos, targetPos, time, (pos) => {
            element.group.position.copy(pos);
          });
          element.trail.start();
          return;
        }
      }
      let group = new THREE.Group();
      _Global.YJ3D.scene.add(group);
      MoveToPosTweenFn(startPos, targetPos, time, (pos) => {
        group.position.copy(pos);
      });
      _YJTrailRenderer.push({ group: group, trail: new YJTrailRenderer(_this, _Global.YJ3D.scene, group) });

    }
    //#endregion

    // 上次选中的角色、npc
    let oldTarget = null;

    let _YJProjector = null;
    // 点击角色NPC，显示NPC下方的光圈
    this.ClickPlayer = (owner) => {
      // 自身角色除外
      if (owner.isLocal) { return; }
      if (oldTarget != null) {

      }
      if (owner.GetBaseModel) {
        let { group, playerHeight } = owner.GetBaseModel();
        _YJProjector.Active(group, playerHeight);
      }

      // 点击npc，播放其音效
      // console.log(owner);
      if (owner.npcName) {
        parentUI.SetNpcMusicUrl(owner.npcName);
      }

      oldTarget = owner;
      ChangeTarget();
    }
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


    this.SetTriggerOverlap = function (b, id, owner) {
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



    let pickTimeout;
    this.ClickModel = (hitObject) => {

      let modelType = hitObject.tag;
      if (modelType == undefined) {
        return;
      }
      console.log("点击物体 ", modelType);
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
          // parentUI.CreateIconTo(hitObject.modelName,_this._YJSceneManager.WorldPosToScreenPos(modelPos));
          // moveModels.push({ model: CreateObj(modelPos),currentTargetPos:modelPos, target: posRef_huluobu, lerpLength: 0 });
          // b_lerpMoving = true;

          // AddModel(hitObject.modelName, hitObject.modelPath);
          MoveTween(CreateObj(modelPos, hitObject.modelName), hitObject.modelName == "南瓜" ? posRef_nangua : posRef_huluobu);
        }, 1500);

      }
    }


    this.HoverObject = (hoverObject, hoverPoint) => {

      console.log(" == in GAMEMANAGER hover物体  ", hoverObject);

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



    let throwTimeout;
    let throwObj = null;
    let animName;
    let oldAnimName;
    let inThrowing = false;

    // 使用物品、扔出物品
    this.UserModel = (e, f, callback) => {

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


              parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
                stateId: 1212,
                boneName: "mixamorigRightHandIndex1",
                modelName: f,
                targetPos: { x: targetPos.x, y: targetPos.y, z: targetPos.z }
              });


            }, latertime);
          });

          //发送同步数据。 骨骼名、物品名
          parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId: 1212,
            boneName: "mixamorigRightHandIndex1",
            modelName: f
          });

        }

      }

      _this.YJController.SetPlayerState(e, f);
    }

    let oldStateId = 0;
    let otherthrowObj = null;
    this.DyncPlayerState = function (YJPlayer, state) {
      YJPlayer.DyncPlayerState(state); return;
    }


    let posRef_huluobu;
    let posRef_nangua;
    let inInputing = false;
    function init() {

      _YJProjector = new YJProjector(_this);


      // console.error(" 初始化 YJGameManager Editor ");
      new YJKeyboard((key) => {
        if (inInputing) {
          return;
        }
        if (key == "Escape") {
          if (oldTarget != null) {
            _YJProjector.SetActive(false);
            oldTarget = null;
            ChangeTarget();
          }
          return;
        }
        if (key == "Digit1") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(0);
          return;
        }
        if (key == "Digit2") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(1);
          return;
        }

        if (key == "Digit3") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(2);
          return;
        }
        if (key == "Digit4") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(3);
          return;
        }
        if (key == "Digit5") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(4);
          return;
        }
        if (key == "Digit6") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(5);
          return;
        }
        if (key == "Digit7") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(6);
          return;
        }
        if (key == "Digit8") {
          parentUI.$refs.HUD.$refs.skillPanel.ClickSkillIndex(7);
          return;
        }
        if (key == "KeyT") {
          // if (_this._YJSceneManager) {
          //   _this._YJSceneManager.ClickInteractive();
          // }

          _this.YJController.SetUserDataItem("weaponData", "weaponId", "");
          _this.YJController.SetUserDataItem("weaponData", "weaponType", "");

          _Global.SendMsgTo3D("放下武器");

          return;
        }
        if (key == "KeyF") {
          // if (_this._YJSceneManager) {
          //   _this._YJSceneManager.ClickInteractive();
          // }
          return;
        }
        if (key == "KeyM") {
          //   //  开关地图
          //   if (setting.keyM != undefined && setting.keyM && _this.$parent.clickOpenPanel) {
          //     _this.$parent.clickOpenPanel("小地图");
          //   }
          return;
        }

        // if (key == "Digit3") {
        //   scope.UserModel("attack", "南瓜");
        //   return;
        // }
        // if (key == "Digit4") {
        //   scope.UserModel("attack", "胡萝卜");
        //   return;
        // }

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
          parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId: 10000
          });
        }

        inThrowing = false;

        // console.log(throwTimeout);

      });


      // posRef_huluobu = CreatePosRef(0.33, -0.953);
      // posRef_nangua = CreatePosRef(0.20, -0.953);
      posRef_nangua = CreatePosRef(-0.33, -0.93);
      posRef_huluobu = CreatePosRef(-0.20, -0.93);
      update();

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


      parentUI.CreateIconTo(cube.name, _this._YJSceneManager.GetObjectPosToScreenPos(cube));


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
          parentUI.DelIconTo(model.name);

        });
      });
    }

    function MoveToPosTween(model, targetPos, length, callback) {

      let fromPos = model.position.clone();
      let movingTween = new TWEEN.Tween(fromPos).to(targetPos, length).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.position.copy(fromPos);
        parentUI.UpdateIconTo(model.name, _this._YJSceneManager.GetObjectPosToScreenPos(model));
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

    }
    function MoveToPosTweenFn(fromPos, targetPos, length, updateCB, callback) {

      let movingTween = new TWEEN.Tween(fromPos).to(targetPos, length).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        if (updateCB) {
          updateCB(fromPos);
        }
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

    init();

    function update() {

      requestAnimationFrame(update);
      TWEEN.update();
      LerpMove();
    }

  }
}

export { YJGameManagerEditor };