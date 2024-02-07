import * as THREE from "three";


import TWEEN from '@tweenjs/tween.js';

import { YJParabola } from "/@/threeJS/YJParabola.js"; 

import { YJSkillParticleManager } from "./YJSkillParticleManager.js";
import { YJDMManager_bilibili } from "./YJDMManager_bilibili.js";

// 场景同步数据

class YJSceneDyncManagerEditor {
  constructor(_this, indexVue, _SceneManager) {
    var scope = this;

    let dyncModelList = [];
    dyncModelList.push({ id: "offsetTime", modelType: "offsetTime", state: { offsetTime: 0, startTime: 1675586194683 } });

    this.GetDyncModelList = ()=>{
      return dyncModelList;
    }


    let npcModelList = [];
    let _YJSkillParticleManager = null;
    let _YJDMManager = null;
    // 初始化场景中需要同步的模型。每个客户端都执行
    this.InitDyncSceneModels = () => {

      //武器、npc 
      let modelDataList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetModelList();
      for (let i = 0; i < modelDataList.length; i++) {
        const element = modelDataList[i];
        let state = {};
        if (element.modelType == "NPC模型"
          || element.modelType == "装备模型"
          || element.modelType == "交互模型"
        ) {
          if (element.modelType == "NPC模型") {
            if (element.message.data.relifeTime) {
              state.relifeTime = 8 + element.message.data.relifeTime
            } else {
              state.relifeTime = 8 + 1;
            }
          }
          if (element.modelType == "交互模型") {
            if (element.message.data.relifeTime) {
              state.relifeTime = element.message.data.relifeTime
            } else {
              state.relifeTime = 6;
            }
            let model = element.message.data;
            // console.log("交互模型",model);
            // indexVue.$refs.HUD.$refs.skillPanel_virus.initIcon({describe: model.describe,type: model.type, value: model.buffValue, imgPath:  model.imgPath });
            indexVue.$refs.HUD.$refs.skillPanel_virus.initIcon(model);
            addVirus(model);
          }
          dyncModelList.push({ id: element.id, modelType: element.modelType, state: state });
        }
      }

      npcModelList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetAllTransformByModelType("NPC模型");
      console.log(" 所有npc ",npcModelList);

      if (_Global.setting.inEditor) {
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();
        return;
      }
      setInterval(() => {
        CheckNpcLookat();
      }, 500);
    }

    this.UpdateTransfrom = function () {
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().UpdateTransfrom();
    }


    function addVirus(model) {
      for (let i = 0; i < dyncModelList.length; i++) {
        const element = dyncModelList[i];
        if (element.id == model.type) {
          return;
        }
      }
      // 增加额外的同步信息
      let data = { id: model.type, modelType: "交互模型", state: { value: 0, count: 0 } };
      dyncModelList.push(data);
      _YJDMManager.addProp(data);
    }
    this.SendDataToServer = (type, data) => {

      // console.log(" 发送 ", type, data);
      if (type == "玩家离开房间") {
        //删除玩家的镜像角色
        if (_Global.mainUser) {
        }
        this.RemovePlayerFireId(data);

        return;
      }

      if (type == "npc技能" || type == "npc技能攻击") {
        let { npcId, skill } = data;
        if (type == "npc技能") {
          _SceneManager.SetTargetSkill(npcId, skill);
        }
        if (!_Global.YJClient) {
          return;
        }
        this.SendSceneState("转发", { type: type, state: data });
        return;
      }

      if (type == "主控发送初始化") {
        // 第一个进入房间的玩家调用
        this.SendSceneState("初始化", dyncModelList);

        // 调用所有npc的寻路
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();

        return;
      }

    }

    let playerPos = new THREE.Vector3(0, 0, 0);
    // 每0.5秒检测一次。巡视NPC是否能发现玩家。每个玩家独立计算，计算后再做npc目标同步
    function CheckNpcLookat() {

      if (_Global.YJ3D.YJController.isInDead()) {
        return;
      }
      playerPos = _Global.YJ3D.YJController.GetPlayerWorldPos();
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
            if (_Global.mainUser) {
              npcComponent.SetNpcTarget(_Global.YJ3D.YJPlayer, true, true);
            } else {
              //向主控发送npc发现玩家
              scope.SendSceneState("转发", { type: "npc发现玩家", state: { npcId: element.id, playerId: _Global.YJ3D.YJPlayer.id } });
            }
          }
        }
      }
    }

    // 当前选中的npcid
    let oldTabSelectNpcId = 0;
    let tabSelectIndex = 0;
    // tab键切换选择玩家前方的敌人
    this.TabChangeTarget = function () {
      if (_Global.YJ3D.YJController.isInDead()) {
        return;
      }
      playerPos = _Global.YJ3D.YJController.GetPlayerWorldPos();

      let canSelectNpc = [];
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营的不计算
        if (npcComponent.GetCamp() == _Global.user.camp) {
          continue;
        }
        if (npcComponent.isDead) {
          continue;
        }
        let npcPos = element.GetWorldPos();
        let distance = playerPos.distanceTo(npcPos);
        // console.log("切换目标 22 ",distance);
        if (distance <= 20 && _Global.YJ3D._YJSceneManager.checkPlayerForward(npcPos)) {
          canSelectNpc.push(npcComponent.transform);
          // if(oldTabSelectNpcId == npcComponent.transform.id){
          //   continue;
          // }
          // oldTabSelectNpcId = npcComponent.transform.id;
          // _SceneManager.ClickModelTransform(npcComponent.transform); 
          // return;
        }
      }
      tabSelectIndex++;
      if (tabSelectIndex >= canSelectNpc.length) {
        tabSelectIndex = 0;
      }
      _SceneManager.ClickModelTransform(canSelectNpc[tabSelectIndex]);
      canSelectNpc = [];
    }


    // 添加增生的npc
    this.AddNpc = function (npcTransform) {
      console.log("增加npc ", npcTransform.id);
      npcModelList.push({ id: npcTransform.id, transform: npcTransform });
    }
    // 设置npc1附近的npc共同攻击npc1的目标
    this.SetNearNPCTarget = function (npcComponent1, targetModel) {
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营的返回
        if (npcComponent != npcComponent1 && npcComponent.GetCamp() == npcComponent1.GetCamp()) {
          if (npcComponent.isCanSetTarget()) {
            let distance = npcComponent1.transform.GetGroup().position.distanceTo(element.GetGroup().position);
            // console.log("查找到附近npc ", npcComponent.npcName,distance);
            if (distance <= 12) {
              npcComponent.SetNpcTarget(targetModel, true, false);
              scope.NPCAddFireById(npcComponent, npcComponent1.fireId);
            }
          }
        }
      }

    }

    this.GetNpcById = function (npcId) {
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        // 相同阵营的返回
        if (element.id == npcId) {
          return element;
        }
      }
    }

    // 战斗组，用来做npc的攻击目标，第一目标死亡，攻击第二目标
    let fireGroup = [
    ];
    // NPC加入战斗.由NPC受伤、或npc查找可视范围玩家调用开启战斗
    this.NPCAddFire = function (npcComponent, targetModel) {
      let hasGroup = false;

      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        for (let j = 0; j < element.peopleList.length; j++) {
          const npc = element.peopleList[j];
          if (npc.id == npcComponent.transform.id) {
            if (npcComponent.fireId == -1) {
              npcComponent.fireId = element.fireId;
            }
            return;
          }
        }

        let cPlayer = false;
        for (let j = 0; j < element.peopleList.length && !cPlayer; j++) {
          const player = element.peopleList[j];
          if (player.id == targetModel.id) {
            cPlayer = true;
            element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp() });
            scope.SendSceneState("战斗状态");
          }
        }
        if (cPlayer) {
          npcComponent.fireId = element.fireId;
          hasGroup = true;
          console.log(npcComponent.npcName + " npc 加入正在进行中的战斗 ", element);
        }
      }
      if (hasGroup) {
        return;
      }
      let fireId = new Date().getTime();
      // camp 阵营数值: 1000联盟 1001部落  10000共同敌人
      fireGroup.push({ fireId: fireId, peopleList: [{ id: targetModel.id, camp: targetModel.camp }, { id: npcComponent.transform.id, camp:  npcComponent.GetCamp() }] });
      targetModel.fireId = fireId;
      npcComponent.fireId = fireId;
      console.log(" 开始新的战斗 ", fireGroup[fireGroup.length - 1]);
      //让玩家加入战斗
      scope.SendSceneStateAll("玩家加入战斗", { playerId: targetModel.id, fireId: fireId });
      scope.SendSceneState("战斗状态");

    }
    function radomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
    this.GetPlayerByRandom = function () {
      if (!_Global.YJClient) {
        return {
          playerId: _Global.YJ3D.YJPlayer.id,
          player: _Global.YJ3D.YJPlayer,
        };
      }
      let players = _Global.YJClient.GetAllPlayer();
      let player = players[radomNum(0, players.length - 1)];
      return {
        playerId: player.id,
        player: player,
      }
    }
    this.GetPlayerById = function (playerId) {
      let playerMirror = null;
      let has = false;
      for (let i = npcModelList.length - 1; i >= 0 && !has; i--) {
        if (npcModelList[i].id == playerId) {
          playerMirror = npcModelList[i].transform;
          has = true;
        }
      }

      if (playerMirror) {
        return playerMirror.GetComponent("NPC");
      }
      if (!_Global.YJClient) {
        return _Global.YJ3D.YJPlayer;
      }
      return _Global.YJClient.GetPlayerById(playerId)
    }

    function CheckPlayerInNpcForward(npcTransform, vaildDistance, playerId) {
      let players = _Global.YJClient.GetAllPlayer();
      for (let i = 0; i < players.length; i++) {
        const element = players[i];
        if (element.id == playerId) {
          // 未判断npc是否在玩家前方
          let distance = npcTransform.GetWorldPos().distanceTo(element.GetWorldPos());
          if (distance <= vaildDistance) {
            return element;
          }
        }
      }
      return null;
    }
    function CheckPlayersInNpcForward(npcTransform, vaildDistance) {
      let npcs = [];
      let players = _Global.YJClient.GetAllPlayer();
      for (let i = 0; i < players.length; i++) {
        const element = players[i];
        let distance = npcTransform.GetWorldPos().distanceTo(element.GetWorldPos());
        if (distance <= vaildDistance) {
          npcs.push(element);
        }
      }
      return npcs;
    }

    // npc范围攻击。 获取npc范围内的玩家
    this.GetPlayerByNpcForwardInFireId = function (npcTransform, fireId, vaildDistance, max, ingorePlayerId) {
      let num = 0;
      if (ingorePlayerId != undefined) {
        // 群攻设置最多数量的目标时，且存在忽略npcId时，数量-1
        num = 1;
        if (max <= num) {
          return [];
        }
      }
      return CheckPlayersInNpcForward(npcTransform, vaildDistance);
      return [];

      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId || true) {
          let npcs = [];
          for (let j = element.playerList.length - 1; j >= 0; j--) {
            const playerId = element.playerList[j];
            if (ingorePlayerId != playerId) {
              let vaildNpc = CheckPlayerInNpcForward(npcTransform, vaildDistance, playerId);
              if (vaildNpc != null) {
                num++;
                npcs.push(vaildNpc);
                if (num >= max) {
                  return npcs;
                }
              }
            }
          }
          return npcs;
        }
      }
      return [];
    }


    // 在一场战斗中，获取玩家前方技能有效范围内的npc
    function CheckNpcInPlayerForward(vaildDistance, npcId) {
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        if (element.id == npcId) {
          let npcComponent = element.GetComponent("NPC");
          // 未判断npc是否在玩家前方
          let distance = playerPos.distanceTo(element.GetGroup().position);
          if (distance <= vaildDistance) {
            return npcComponent;
          }
        }
      }
      return null;
    }

    // 玩家范围攻击npc。 在一场战斗中，玩家施放技能，获取玩家前方技能有效范围内的最多max数量的npc
    this.GetNpcByPlayerForwardInFireId = function (fireId, camp, vaildDistance, max, ingoreNpcId) {
      let num = 0;
      if (ingoreNpcId != undefined) {
        // 群攻设置最多数量的目标时，且存在忽略npcId时，数量-1
        num = 1;
        if (max <= num) {
          return [];
        }
      }
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          let npcs = [];
          for (let j = element.peopleList.length - 1; j >= 0; j--) {
            const npcId = element.peopleList[j];
            if (camp != npcId.camp && ingoreNpcId != npcId.id) {
              let vaildNpc = CheckNpcInPlayerForward(vaildDistance, npcId.id);
              if (vaildNpc != null) {
                num++;
                npcs.push(vaildNpc);
                if (num >= max) {
                  return npcs;
                }
              }
            }
          }
          return npcs;
        }
      }
      return [];
    }

    this.GetNpcByPlayerForwardInArea = function (vaildDistance, max) {
      let num = 0;
      let npcs = [];
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        if (npcComponent.GetCamp() == _Global.user.camp) {
          continue;
        }
        // 未判断npc是否在玩家前方
        let distance = playerPos.distanceTo(element.GetGroup().position);
        if (distance <= vaildDistance) {
          num++;
          npcs.push(npcComponent);
          if (num >= max) {
            return npcs;
          }
        }
      }
      return npcs;
    }


    this.RemoveNPCFireId = function (npcComponent) {
      // console.log(npcComponent.npcName + "npc 死亡或其他 请求离开战斗" + npcComponent.fireId);
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (element.fireId == npcComponent.fireId) {
          let cNpc = false;
          for (let j = element.peopleList.length - 1; j >= 0 && !cNpc; j--) {
            const npc = element.peopleList[j];
            if (npc.id == npcComponent.transform.id) {
              npcComponent.fireId = -1;
              element.peopleList.splice(j, 1);
              cNpc = true;
            }
          }
          if (cNpc) {
            console.log(" NPC 胜利、死亡或其他 离开战斗 ", element);
          }
          if (element.peopleList.length == 0) {
            fireGroup.splice(i, 1);
            return;
          }
          console.log(" 战斗参与者剩余 ", element.peopleList);

          if (CheckSameCamp(element.peopleList)) {
            for (let k = element.peopleList.length - 1; k >= 0; k--) {
              const people = element.peopleList[k];
              this.SendSceneStateAll("玩家脱离战斗", people.id);
            }
            fireGroup.splice(i, 1);
            console.log(" 战斗结束 22 ", element.fireId);
            return;
          }

        }
      }
    }

    // 玩家死亡
    this.RemovePlayerFireId = function (playerId, fireId) {

      let players = [];
      players.push(playerId);
      // 玩家死亡后，如玩家有镜像角色，删除镜像角色
      let player = this.GetPlayerById(playerId);
      if (player.playerMirrors && player.playerMirrors.length > 0) {
        for (let i = 0; i < player.playerMirrors.length; i++) {
          const mirrorId = player.playerMirrors[i];
          players.push(mirrorId);
          _Global.DyncManager.SendSceneState("删除", { type: "玩家镜像", npcId: mirrorId, playerId: playerId });
          // console.log("玩家死亡 删除镜像", mirrorId);
        }

      }
      if (fireId == undefined) {
        return;
      }
      let has = false;
      for (let i = fireGroup.length - 1; i >= 0 && !has; i--) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          has = true;
          RemoveFromArroy(element.peopleList, players);
          if (element.peopleList.length == 0) {
            fireGroup.splice(i, 1);
            continue;
          }
          // console.log(" 战斗参与者剩余 ", element.peopleList);

          if (CheckSameCamp(element.peopleList)) {
            for (let k = element.peopleList.length - 1; k >= 0; k--) {
              const people = element.peopleList[k];
              this.SendSceneStateAll("玩家脱离战斗", people.id);
            }
            fireGroup.splice(i, 1);
            // console.log(" 战斗结束 22 ", element.fireId);
            continue;
          }
        }
      }
      player.playerMirrors = [];
    }

    // 判断战斗中的角色是否同阵营
    function CheckSameCamp(peopleList) {
      let camp = peopleList[0].camp
      for (let j = peopleList.length - 1; j >= 1; j--) {
        if (camp != peopleList[j].camp) {
          return false;
        }
      }
      return true;
    }
    function RemoveFromArroy(peopleList, items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let has = false;
        for (let j = peopleList.length - 1; j >= 0 && !has; j--) {
          const element = peopleList[j].id;
          if (element == item) {
            peopleList.splice(j, 1);
            console.log(" 移除 战斗参与者 ", item);
            has = true;
          }
        }
      }
    }
    // 去重加入数组
    function AddArray(array, item) {
      let has = false;
      for (let i = 0; i < array.length && !has; i++) {
        const element = array[i];
        if (element == item) {
          has = true;
          return;
        }
      }
      array.push(item);
    }
    this.AddFireGroup = function (id, camp, fireId) {
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          let has = false;
          for (let ii = 0; ii < element.peopleList.length && !has; ii++) {
            const people = element.peopleList[ii];
            if (people.id == id) {
              has = true;
              return;
            }
          }
          element.peopleList.push({ id: id, camp: camp });
          console.log(" 加入战斗组 ", element);
        }
      }
    }
    // 玩家加入正在进行的战斗。 如果玩家和npc都未在战斗中，则由NPC触发生成战斗组
    this.PlayerAddFire = function (npcComponent, targetModel) {
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        let hasNpc = false;
        let hasPlayer = false;
        for (let j = 0; j < element.peopleList.length; j++) {
          const npc = element.peopleList[j];
          if (npc.id == npcComponent.transform.id) {
            hasNpc = true;
          }
          if (npc.id == targetModel.id) {
            hasPlayer = true;
          }
        }
        if (hasNpc || hasPlayer) {
          if (!hasNpc) {
            npcComponent.fireId = element.fireId;
            element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp() });
            console.log(" 玩家加入战斗触发 npc加入战斗");
          }
          if (!hasPlayer) {
            targetModel.fireId = element.fireId;
            element.peopleList.push({ id: targetModel.id, camp: targetModel.camp });
            console.log(" 玩家加入战斗触发 玩家加入战斗");
          }
          return;
        }
      }
      this.SendSceneState("战斗状态");

    }

    //npc被攻击时初次进入战斗时，让附近的npc也加入战斗
    this.NPCAddFireById = function (npcComponent, fireId) {
      // console.log("让npc"+ npcComponent.npcName+" 加入战斗 "+ fireId);
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          for (let j = 0; j < element.peopleList.length; j++) {
            const npc = element.peopleList[j];
            if (npc.id == npcComponent.transform.id) {
              if (npcComponent.fireId == -1) {
                npcComponent.fireId = element.fireId;
              }
              return;
            }
          }
          npcComponent.fireId = fireId;
          element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp() });
          console.log(npcComponent.npcName + " npc 加入 附近的战斗 ", element);
        }
      }
      this.SendSceneState("战斗状态");

    }

    // 未受伤、未被npc攻击，强制设置玩家进入战斗id
    this.PlayerAddFireById = function (player, fireId) {
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          element.peopleList.push({ id: player.id, camp: player.camp });
          console.log(" 玩家 加入战斗 22 ", element);
        }
      }
      this.SendSceneState("战斗状态");
    }
    this.RequestNextFireIdPlayer = function (state) {
      if (_Global.mainUser) {
        GetFireIdPlayer(state);
      } else {
        this.SendSceneState("请求下一个目标", state);
      }
    }
    // 给npc查找同战斗组中的可攻击玩家
    function GetFireIdPlayer(state) {
      let { npcId, camp, fireId,ignorePlayerId } = state;
      console.log(" 查找npc  ", state);
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
          for (let j = 0; j < element.peopleList.length; j++) {
            const people = element.peopleList[j];
            // console.log( " 查找同一战斗中的参与者 ", people.camp);
            if (people.camp != camp) {
              if (people.camp == 10000 || people.camp == 1001) {
                let ps = scope.GetNpcByPlayerForwardInFireId(fireId, camp, 100, 1);
                if (ps.length >= 0) {
                  console.log(npcComponent.npcName + " 找到目标 ", ps[0].npcName);
                  npcComponent.SetNpcTarget(ps[0], false, false);
                  return;
                }
                return;
              }

              if(ignorePlayerId == people.id){
                continue;
              }
              const player = scope.GetPlayerById(people.id);
              console.log(" npc查找敌方 玩家", player);

              if (player) {
                console.log(player.GetUserData());
                if (player.isLocal) {
                  if (_this.YJController.GetUserData().baseData.health > 0) {
                    //发送npc目标
                    npcComponent.SetNpcTarget(player, true, false);
                    return;
                  }
                } else {
                  if (player.GetUserData().baseData.health > 0) {
                    //发送npc目标
                    npcComponent.SetNpcTarget(player, true, false);
                    return;
                  }
                }
              }
            }
          }
        }
      }
      if (npcComponent != null) {
        //npc移除战斗组
        _Global.DyncManager.RemoveNPCFireId(npcComponent);
        npcComponent.SetNpcTargetToNone(true, false);
      }

    }
    // 玩家拾取场景内物体的数据。用来做场景物体同步
    let playerData = [];
    //发送单个物体数据
    this.SendModelState = function (id, state) {
      if (!_Global.YJClient) {
        return;
      }
      this.SendSceneState("更新single", { id: id, modelType: state.modelType, state: state.msg });

      // for (let i = 0; i < dyncModelList.length; i++) {
      //   const element = dyncModelList[i];
      //   if (element.id == id) {
      //     element.state = state;

      //     if (state.modelType == "装备模型") {
      //       playerData.push({ playerId: _Global.YJClient.id, modelType: state.modelType, msg: state.msg });
      //     }
      //     console.error(" 发送单个物体数据 ", state);
      //   }
      // }

    }
    // 发送一条战斗记录
    this.SendFireRecode = function (msg) {
      // console.log("战斗记录 ", msg);
    }
    this.SendModel = function (model) {
      if (!_Global.YJClient) {
        return;
      }
      this.SendSceneState("更新single", model);
    }
    this.SendModelPlayer = function (model) {
      if (!_Global.YJClient) {
        return;
      }
      this.SendSceneStateAll("玩家对玩家", model);
    }
    this.SendSceneStateAll = function (type, msg) {
      if (type == "玩家死亡") {
        if (!_Global.YJClient) {
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "玩家死亡", state: msg });
        return;
      }

      if (type == "玩家对玩家") {
        if (!_Global.YJClient) {
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("玩家对玩家", msg);
        return;
      }

      if (type == "玩家脱离战斗") {
        if (!_Global.YJClient) {
          this.Receive({ type: "玩家脱离战斗", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "玩家脱离战斗", state: msg });
        return;
      }
      if (type == "玩家加入战斗") {
        if (!_Global.YJClient) {
          this.Receive({ type: "玩家加入战斗", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "玩家加入战斗", state: msg });
        return;
      }
      if (type == "NPC对玩家") {
        if (!_Global.YJClient) {
          this.Receive({ type: "NPC对玩家", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "NPC对玩家", state: msg });
        return;
      }
      if (type == "玩家对NPC") {

        if (!_Global.YJClient) {
          this.Receive({ type: "玩家对NPC", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "玩家对NPC", state: msg });
        return;
      }

    }

    //发送整个场景数据
    this.SendSceneState = function (type, msg) {
      if (!_Global.YJClient) {
        return;
      }
      if (type == undefined) {
        type = "all";
      }

      if (type == "初始化") {
        _Global._YJDyncManager.SendSceneState("初始化", msg);
        return;
      }
      if (type == "转发") {
        _Global._YJDyncManager.SendSceneState("转发", msg);
        return;
      }
      if (type == "更新single") {
        _Global._YJDyncManager.SendSceneState("更新single", msg);
        return;
      }
      if (type == "添加") {
        _Global._YJDyncManager.SendSceneState("添加", { id: msg.id, modelType: msg.modelType, state: msg });
        return;
      }
      if (type == "删除") {
        _Global._YJDyncManager.SendSceneState("删除", msg);
        return;
      }
      if (type == "all") {
        _Global._YJDyncManager.SendSceneState("转发", { type: type, state: dyncModelList });
        return;
      }
      if (type == "战斗状态") {
        _Global._YJDyncManager.SendSceneState("转发", { type: type, state: fireGroup });
        return;
      }
      if (type == "请求下一个目标") {
        _Global._YJDyncManager.SendSceneState("转发", { type: type, state: msg });
        return;
      }
      _Global._YJDyncManager.SendSceneState("转发", { type: type, state: msg });

    }

    // 接收 转发 数据
    this.Receive = function (data) {
      let { type, state } = data;
      if (type == "玩家死亡") {
        if (_Global.mainUser) {
          this.RemovePlayerFireId(state.playerId, state.fireId);
        }
        return;
      }
      if (type == "所有人加生命") {
        _SceneManager.ReceivePlayer({buff:"addHealth",buffValue:state});
        return;
      }
      if (type == "弹幕") {
        indexVue.$refs.HUD.$refs.DMPanel.receiveMsg(state);
        return;
      }
      // console.log(" 接收 ", type, state);
      if (type == "玩家脱离战斗") {
        if (_Global.YJ3D.YJPlayer.id == state) {
          _this.YJController.SetInteractiveNPC("玩家脱离战斗");
        }
        if (_Global.mainUser) {
          let has = false;
          for (let i = npcModelList.length - 1; i >= 0 && !has; i--) {
            if (npcModelList[i].id == state) {
              npcModelList[i].transform.GetComponent("NPC").Dync({ title: "脱离战斗" });
              has = true;
            }
          }
        }
        return;
      }
      if (type == "玩家加入战斗") {
        let { playerId, fireId } = state;
        if (_Global.YJ3D.YJPlayer.id == playerId) {
          _this.YJController.SetInteractiveNPC("玩家加入战斗", fireId);
        } else {

        }
        if (_Global.mainUser) {
          let player = scope.GetPlayerById(playerId);
          if (player.playerMirrors && player.playerMirrors.length > 0) {
            for (let i = 0; i < player.playerMirrors.length; i++) {
              const mirrorId = player.playerMirrors[i];
              let mirror = scope.GetNpcById(mirrorId);
              console.log("玩家加入战斗后，让其镜像设置目标", mirrorId);
              let mirrorNpc = mirror.GetComponent("NPC");
              mirrorNpc.fireId = fireId;
              mirrorNpc.CheckNextTarget();
            }
          }
        }
        return;
      }

      if (type == "玩家对NPC") {
        let { npcId, playerId, skillName, effect } = state;

        if (_Global.mainUser) {
          this.GetNpcById(npcId).GetComponent("NPC").ReceiveDamage((playerId), skillName, effect);
        }

        if (_Global.YJ3D.YJPlayer.id == playerId) {
          // return;
          // 对npc的伤害显示在屏幕上
          let pos = this.GetNpcById(npcId).GetWorldPos().clone();
          pos.y += this.GetNpcById(npcId).GetComponent("NPC").GetBaseModel().playerHeight;
          _Global.SceneManager.UpdateNpcDamageValue("self", "normal", effect.value, pos);

        }
        return;
      }
      if (type == "NPC对玩家") {

        if (state.targetId == _Global.YJ3D.YJPlayer.id) {
          _this.YJController.ReceiveDamage(this.GetNpcById(state.npcId), state.skillName, state.effect);
          return;
        }

        let p = scope.GetPlayerById(state.targetId);
        console.log(" NPC对玩家镜像 ", p, typeof p);
        if (p && p.isPlayer == undefined) {
          p.ReceiveDamageByPlayer(this.GetNpcById(state.npcId), state.skillName, state.effect);
        }
        return;
      }

      if (type == "npc技能" || type == "npc技能攻击") {
        let { npcId, skill } = state;
        if (type == "npc技能") {
          // npc技能施法/吟唱状态
          _SceneManager.SetTargetSkill(npcId, skill);
        }
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel({ id: npcId, modelType: "NPC模型", state: { title: type, skill: skill } });
        return;
      }

      if (type == "npc发现玩家") {
        if (_Global.mainUser) {
          let { npcId, playerId } = state;
          this.GetNpcById(npcId).GetComponent("NPC").SetNpcTarget(scope.GetPlayerById(playerId), true, true);
        }
        return;
      }

      if (type == "战斗状态") {
        fireGroup = state;
        console.log("战斗状态同步改变 ", fireGroup);
        return;
      }
      if (type == "请求下一个目标") {
        if (_Global.mainUser) {
          console.log("设置下一个目标 ", state);
          GetFireIdPlayer(state);
        }
        return;
      }


      if (type == "获取场景状态") {
        let { sceneModels, userModels } = state;
        console.log(" 更新场景同步数据 ", state);
        // console.log(" 更新场景同步数据 ", dyncModelList);

        //整个场景所有模型的更新
        for (let j = 0; j < userModels.length; j++) {
          const _state = userModels[j];
          let has = false;
          for (let i = 0; i < dyncModelList.length && !has; i++) {
            const element = dyncModelList[i];
            if (element.id == _state.id) {
              has = true;
            }
          }
          if (!has) {
            console.log(" 添加用户生成模型 ", _state);
            let modelData = _state.state;
            let _playerId = modelData.id;
            let ownerId = modelData.ownerId;
            _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().DuplicateModel(modelData, (transform) => {
              transform.SetActive(false);
              transform.id = _playerId;
              setTimeout(() => {
                scope.AddNpc(transform);
                let _npcComponent = transform.GetComponent("NPC");
                _npcComponent.id = _playerId;
                transform.SetActive(true);
                if (ownerId == _Global.YJ3D.YJPlayer.id) {
                  _this.YJController.SetInteractiveNPC("添加镜像", _playerId);
                }
                _npcComponent.setOwnerPlayer(scope.GetPlayerById(ownerId));

                if (_Global.mainUser) {
                  let player = scope.GetPlayerById(ownerId);
                  if (player.playerMirrors == undefined) {
                    player.playerMirrors = [];
                  }
                  player.playerMirrors.push(_playerId);
                }

              }, 1000);
            }, _playerId);


          }
        }

        for (let j = 0; j < sceneModels.length; j++) {
          const _state = sceneModels[j];
          let has = false;

          for (let i = 0; i < dyncModelList.length && !has; i++) {
            const element = dyncModelList[i];
            if (element.id == _state.id) {
              element.state = _state.state;
              has = true;
            }
          }
          if(!has){
            dyncModelList.push(_state);
          }

          if (_state.modelType == "交互模型") {
            indexVue.$refs.HUD.$refs.skillPanel_virus.SetSkillCount({ type: _state.id, value: _state.state.value, count: _state.state.count });
          }
        }

        for (let i = 0; i < sceneModels.length; i++) {
          const element = sceneModels[i];
          _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(element);
        }


        //此时同步完成， 隐藏loading页
        indexVue.OpenThreejs();
        return;
      }


      if (type == "all") {
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

      if (type == "服务器下发") {

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
      console.log(" 接收服务器下发 更新单个模型 ", sceneState);
      let model = sceneState.state;
      switch (sceneState.title) {
        case "添加":
          let modelData = model.state;
          let _playerId = modelData.id;
          let ownerId = modelData.ownerId;
          _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().DuplicateModel(modelData, (transform) => {
            transform.SetActive(false);
            transform.id = _playerId;
            setTimeout(() => {
              scope.AddNpc(transform);
              let _npcComponent = transform.GetComponent("NPC");
              _npcComponent.id = _playerId;
              transform.SetActive(true);
              if (ownerId == _Global.YJ3D.YJPlayer.id) {
                _this.YJController.SetInteractiveNPC("添加镜像", _playerId);
              }
              _npcComponent.setOwnerPlayer(scope.GetPlayerById(ownerId));

              if (_Global.mainUser) {
                let player = scope.GetPlayerById(ownerId);
                if (player.playerMirrors == undefined) {
                  player.playerMirrors = [];
                }
                player.playerMirrors.push(_playerId);
              }

            }, 1000);
          }, _playerId);



          return;
        case "删除":
          let { npcId, playerId } = model;
          if (_Global.YJ3D.YJPlayer.id == playerId) {
            _this.YJController.SetInteractiveNPC("删除镜像", npcId);
          }

          let has = false;
          for (let i = npcModelList.length - 1; i >= 0 && !has; i--) {
            if (npcModelList[i].id == npcId) {
              npcModelList[i].transform.Destroy();
              npcModelList.splice(i, 1);
              has = true;
            }
          }
          has = false;
          for (let i = 0; i < dyncModelList.length && !has; i++) {
            const element = dyncModelList[i];
            if (element.id == npcId) {
              dyncModelList.splice(i, 1);
              has = true;
            }
          }

          return;
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
      if (_Global.YJClient) {
        _Global._YJDyncManager.UpdateModel(id, title, data);
      }
    }
    // 接收 玩家 对 玩家
    this.ReceivePlayerToPlayer = function (sceneState) {
      _SceneManager.ReceivePlayer(sceneState.state);
      // console.log(" 接收玩家对玩家 ", sceneState);
    }
    // 接收服务器转发过来的由主控发送的模型同步信息
    this.ReceiveModel = function (id, title, data) {
      // console.log("接收 同步信息 ", id, title, data);

      if (title == "同步trail") {
        let { startPos, targetId, targetType, time,firePid } = data;
        //根据id查找模型
        let target = null;
        if (targetType == "player") {
          target = scope.GetPlayerById(targetId);
        }
        if (targetType == "npc") {
          target = this.GetNpcById(targetId);
        }
        if (target != null) {
          let _startPos = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
          shootTargetFn(_startPos, target, time,firePid);
        }
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
    this.shootTarget = function (startPos, target, time, targetType,firePid,callback) {
      // console.log(" 同步trail target ", target.id, targetType);
      scope.UpdateModel("", "同步trail", { startPos: startPos, targetId: target.id,firePid:firePid, targetType: targetType, time: time });
      shootTargetFn(startPos.clone(), target, time,firePid,callback );
    } 
    function shootTargetFn(startPos, target, time,firePid,callback){
      _YJSkillParticleManager.shootTargetFn(startPos.clone(), target, firePid,callback);

      // _YJSkillParticleManager.shootTargetFn(startPos.clone(), target, "1704443871265");
    }
    //#endregion

    this.DyncPlayerState = function (YJPlayer, state) {
      YJPlayer.DyncPlayerState(state); return;
    }

    function init() {
      _YJSkillParticleManager = new YJSkillParticleManager(_this);
      _YJDMManager = new YJDMManager_bilibili(indexVue,scope,_SceneManager);
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