import * as THREE from "three";


import TWEEN from '@tweenjs/tween.js';

import { YJParabola } from "/@/threeJS/YJParabola.js";
import { YJTrailRenderer } from "/@/threeJS/components/YJTrailRenderer.js";


// 场景同步数据

class YJSceneDyncManagerEditor {
  constructor(_this, indexVue, _SceneManager) {
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
          || element.modelType == "交互模型"
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
      dyncModelList.push ({ id: "kouzhao", modelType: "交互模型", state:  { value: 0, count: 0 } });
      dyncModelList.push ({ id: "fanghufu", modelType: "交互模型", state:  { value: 0, count: 0 } });
      dyncModelList.push ({ id: "zhongcaoyao", modelType: "交互模型", state:  { value: 0, count: 0 } });
      dyncModelList.push ({ id: "jiujingpenghu", modelType: "交互模型", state:  { value: 0, count: 0 } });
      dyncModelList.push ({ id: "offsetTime", modelType: "offsetTime", state:  { offsetTime: 0, startTime: 1675586194683} });
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

    this.SendModel = function (model) {
      if (!_Global.YJDync) {
        return;
      }
      _Global.YJDync._YJDyncManager.SendSceneState("更新single", model);
    }
    this.SendModelPlayer = function (model) {
      if (!_Global.YJDync) {
        return;
      }
      _Global.YJDync._YJDyncManager.SendSceneState("玩家对玩家", model);
    }
    this.SendNpcToPlayer = function (model) {
      if (!_Global.YJDync) {
        return;
      }
      _Global.YJDync._YJDyncManager.SendSceneState("NPC对玩家", model);
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
        for (let j = 0; j < state.length; j++) {
          const _state = state[j];
          let has = false;
          for (let i = 0; i < dyncModelList.length && !has; i++) {
            const element = dyncModelList[i];
            if (element.id == _state.id) {
              element.state = _state.state;
              has = true;
            }
          }
          if (_state.modelType == "交互模型") {
            indexVue.$refs.HUD.$refs.skillPanel_virus.SetSkillCount({ type: _state.id, value: _state.state.value, count: _state.state.count });
          }
          if (!has) {
            dyncModelList.push(_state);
          }
        }
        console.log(" 更新场景同步数据 ", dyncModelList);



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
      // console.log("更新单个模型 ", sceneState);
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
      // console.log(" 接收服务器下发 更新单个模型 ", sceneState);
      let model = sceneState.state;
      switch (sceneState.title) {
        case "更新道具数量":
          if (model.modelType == "交互模型") {
            indexVue.$refs.HUD.$refs.skillPanel_virus.SetSkillCount({ type: model.id, value: model.state.value, count: model.state.count });
          }
          return;
          break;
        case "生成道具":
          if (model.modelType == "交互模型") {
            _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(model);
          }
          return;
          break;
        case "还原装备":
          if (model.modelType == "装备模型") {
            _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(model);
          }
          return;
          break;

        default:
          break;
      }
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(model);
    }


    // 由主控发送模型同步信息
    /**
     * 
     * @param {模型唯一id} id 模型唯一id
     * @param {同步类型标题} title 同步类型标题
     * @param {同步数据} data 同步数据
     */
    this.UpdateModel = (id, title, data) => {
      if (_Global.YJDync) {
        _Global.YJDync._YJDyncManager.UpdateModel(id, title, data);
      }
    }

    this.ReceiveNpcToPlayer = function (sceneState) {
      // _SceneManager.ReceivePlayer(sceneState.state);
      _this.YJController.ReceiveDamageDync(sceneState.npcName, sceneState.skillName, sceneState.strength);
      // console.log(" 接收 npc 对玩家 ", sceneState);
    }
    // 接收玩家对玩家
    this.ReceivePlayer = function (sceneState) {
      _SceneManager.ReceivePlayer(sceneState.state);
      // console.log(" 接收玩家对玩家 ", sceneState);
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

    this.DyncPlayerState = function (YJPlayer, state) {
      YJPlayer.DyncPlayerState(state); return;
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

    function init() {
      update();
    }
    function update() {
      requestAnimationFrame(update);
      TWEEN.update();
    }
    init();

  }
}

export { YJSceneDyncManagerEditor };