import * as THREE from "three";


import TWEEN from '@tweenjs/tween.js';

import { YJParabola } from "/@/threeJS/YJParabola.js";

import { YJSkillParticleManager } from "./YJSkillParticleManager.js";

import { YJFireManager } from "/@/threeJS/YJFireManager.js"; 
// import { YJController_roguelike } from "/@/threeJS/YJController_roguelike.js";

// 场景同步数据

class YJSceneDyncManagerEditor {
  constructor(_this, indexVue, _SceneManager) {
    var scope = this;

    let dyncModelList = [];
    dyncModelList.push({ id: "offsetTime", modelType: "offsetTime", state: { offsetTime: 0, startTime: 1675586194683 } });

    this.GetDyncModelList = () => {
      return dyncModelList;
    }


    let _YJSkillParticleManager = null;
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
            let relifeTime = element.message.data.relifeTime;
            if (relifeTime && relifeTime > 0) {
              state.relifeTime = 8 + relifeTime;
            } else {
              state.relifeTime = 0;
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
            if (indexVue && indexVue.$refs.HUD) {
              indexVue.$refs.HUD.$refs.skillPanel_virus.initIcon(model);
            }

            addVirus(model);
          }
          dyncModelList.push({ id: element.id, modelType: element.modelType, state: state });
        }
      }


      new YJFireManager();

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
    }
    this.SendDataToServer = (type, data) => {

      // console.log(" in SendDataToServer 发送 ", type, data);
      if (type == "玩家离开房间") {
        //删除玩家的镜像角色
        if (_Global.mainUser) {
        }
        this.RemovePlayerFireId(data);

        return;
      }

      if (type == "npc技能" 
      || type == "npc技能攻击" 
      || type == "受到技能"
      || type == "玩家技能"
      || type == "玩家对玩家"
      || type == "玩家对NPC"
      || type == "NPC对NPC"
      || type == "NPC对玩家"
      || type == "解除技能") {
        if (!_Global.YJClient) {
          this.Receive({ type:type, state: data });
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

      if (_Global.YJ3D.YJController.isInDead() || !_Global.hasAvatar) {
        return;
      }
      playerPos = _Global.YJ3D.YJController.GetPlayerWorldPos();

      let npcs = _Global._YJNPCManager.GetNoSameCampNPC(playerPos);
      for (let i = 0; i < npcs.length; i++) {
        const npcComponent = npcs[i];
        if (_Global.mainUser) {
          // 第三个参数表示是否查找npc附近的npc，让附近的npc一起攻击玩家
          npcComponent.SetNpcTarget(_Global.YJ3D.YJPlayer, true, true);
        } else {
          //向主控发送npc发现玩家
          scope.SendSceneState("转发", { type: "npc发现玩家", state: { npcId: npcComponent.transform.id, playerId: _Global.YJ3D.YJPlayer.id } });
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

      let canSelectNpc = _Global._YJNPCManager.GetForwardNoSameCampNPC(playerPos);
      tabSelectIndex++;
      if (tabSelectIndex >= canSelectNpc.length) {
        tabSelectIndex = 0;
      }
      _SceneManager.ClickModelTransform(canSelectNpc[tabSelectIndex]);
      canSelectNpc = [];
    }


    // 添加增生的npc
    this.AddNpc = function (npcTransform) {
      _Global._YJNPCManager.AddNpc(npcTransform);
    }
    // 设置npc1附近的npc共同攻击npc1的目标
    this.SetNearNPCTarget = function (npcComponent1, targetModel) {
      let npcs = _Global._YJNPCManager.GetNearNPC(npcComponent1, targetModel);
      for (let i = 0; i < npcs.length; i++) {
        const npcComponent = npcs[i];
        npcComponent.SetNpcTarget(targetModel, true, false);
        scope.NPCAddFireById(npcComponent, npcComponent1.fireId);
      }
    }


    // 战斗组，用来做npc的攻击目标，第一目标死亡，攻击第二目标
    let fireGroup = [
    ];
    // 判断是否有正在进行的战斗
    this.CheckHasFire = function () {
      return fireGroup.length != 0;
    }
    let checkFireInterval = null;
    // NPC加入战斗.由NPC受伤、或npc查找可视范围玩家调用开启战斗
    this.NPCAddFire = function (npcComponent, targetModel) {
      let hasGroup = false;

      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];

        let hasNpc = false;
        for (let j = 0; j < element.peopleList.length && !hasNpc; j++) {
          const player = element.peopleList[j];
          if (player.id == npcComponent.transform.id) {
            hasNpc = true;
          }
        }

        let cPlayer = false;
        for (let j = 0; j < element.peopleList.length && !cPlayer; j++) {
          const player = element.peopleList[j];
          if (player.id == targetModel.id) {
            cPlayer = true;
          }
        }

        if (hasNpc || cPlayer) {
          hasGroup = true;
        }


        if (!hasNpc) {
          if (npcComponent.fireId == -1) {
            npcComponent.fireId = element.fireId;
          }
          element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetModel.id });
          console.log(npcComponent.npcName + " npc 加入正在进行中的战斗 ", element);
        }

        if (!cPlayer) {
          if (targetModel.fireId == -1) {
            targetModel.fireId = element.fireId;
          }
          element.peopleList.push({ id: targetModel.id, camp: targetModel.camp, targetId: npcComponent.transform.id });
          console.log(targetModel.GetNickName() + " 玩家 加入正在进行中的战斗 ", element);
        } else {

        }
      }
      if (hasGroup) {
        return;
      }
      if (fireGroup.length > 0) {
        console.error("不该进入此判断： 开启第二场战斗 ");
      }
      let fireId = new Date().getTime();
      // camp 阵营数值: 1000联盟 1001部落  10000共同敌人
      fireGroup.push({
        fireId: fireId,
        peopleList: [
          { id: targetModel.id, camp: targetModel.GetCamp(), targetId: npcComponent.transform.id },
          { id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetModel.id }]
      });
      targetModel.fireId = fireId;
      npcComponent.fireId = fireId;
      if (npcComponent.isYJNPC) {
        npcComponent.SetNpcTarget(targetModel, true, true);
      }
      if (targetModel.isYJNPC) {
        targetModel.SetNpcTarget(npcComponent, true, true);
      }
      console.log(" 开始新的战斗 ", targetModel.GetNickName() + " " + npcComponent.GetNickName(), fireGroup[fireGroup.length - 1]);
      //让玩家加入战斗
      scope.SendSceneStateAll("玩家加入战斗", { playerId: targetModel.id, fireId: fireId });
      scope.SendSceneState("战斗状态");

      // if(checkFireInterval){
      //   clearInterval(checkFireInterval);
      // }
      // checkFireInterval = setInterval(() => {
      //   LoopCheckFireFn();
      // }, 500);
    }
    this.NPCAddFireGroup = function (npcComponent, targetId) {
      if (fireGroup.length == 0) {
        return false;
      }
      if (fireGroup.length == 2) {
        console.error("不该进入此判断： 存在第二场战斗 ");
      }
      const element = fireGroup[0];
      npcComponent.fireId = element.fireId;
      element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetId });
      // console.log(npcComponent.GetNickName()+"加入战斗 ",element);
      return true;
    }

    function radomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }

    this.GetNoSameCampByRandom = function (camp) {
      if (!_Global.YJClient) {
        if (_Global.hasAvatar) {
          return {
            playerId: _Global.YJ3D.YJPlayer.id,
            player: _Global.YJ3D.YJPlayer,
          };
        }
      }
      let players = [];
      let id = "";
      let player = null;
      if (_Global.setting.DMGame) {
        players = _Global._YJNPCManager.GetNoSameCampNPCInFire(camp);
        player = players[radomNum(0, players.length - 1)];
        id = player.transform.id
      } else {
        players = _Global.YJClient.GetAllPlayer();
        id = player.id
      }
      return {
        playerId: id,
        player: player,
      }
    }

 

    this.GetNpcById = function (npcId) {
      return _Global._YJNPCManager.GetNpcTransformById(npcId);
    }
    
    this.GetPlayerById = function (playerId) { 
      return _Global._YJPlayerManager.GetPlayerById(playerId)
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
    this.GetPlayerByNpcForwardInFireId = function (npcComponent, fireId, vaildDistance, max, ingorePlayerId) {
      let num = 0;
      if (ingorePlayerId != undefined) {
        // 群攻设置最多数量的目标时，且存在忽略npcId时，数量-1
        num = 1;
        if (max <= num) {
          return [];
        }
      }
      // return CheckPlayersInNpcForward(npcTransform, vaildDistance);
      // return [];
      let npcs = [];

      if (_Global.setting.DMGame) {
        let allnpcs = _Global._YJNPCManager.GetNoSameCampNPCInFireInVailDis(npcComponent.GetWorldPos(), npcComponent.GetCamp(), vaildDistance);

        let count = allnpcs.length >= max ? max : allnpcs.length;
        for (let i = 0; i < count; i++) {
          npcs.push(allnpcs[i]);
        }
        return npcs;
      } else {
        // players = _Global.YJClient.GetAllPlayer(); 
      }

      // for (let i = 0; i < fireGroup.length; i++) {
      //   const element = fireGroup[i];
      //   if (element.fireId == fireId || true) {
      //     for (let j = element.playerList.length - 1; j >= 0; j--) {
      //       const playerId = element.playerList[j];
      //       if (ingorePlayerId != playerId) {
      //         let vaildNpc = CheckPlayerInNpcForward(npcTransform, vaildDistance, playerId);
      //         if (vaildNpc != null) {
      //           num++;
      //           npcs.push(vaildNpc);
      //           if (num >= max) {
      //             return npcs;
      //           }
      //         }
      //       }
      //     }
      //     return npcs;
      //   }
      // }
      return [];
    }


    // 在一场战斗中，获取玩家前方技能有效范围内的npc
    function CheckNpcInPlayerForward(vaildDistance, npcId) {
      return _Global._YJNPCManager.CheckNpcInPlayerForward(vaildDistance, npcId, playerPos);
    }

    // 玩家范围攻击npc。 在一场战斗中，玩家施放技能，获取玩家前方技能有效范围内的最多max数量的npc
    this.GetNpcByPlayerForwardInFireId = function (fireId, camp, vaildDistance, max, ingoreNpcId) {
      
      return _Global._YJNPCManager.GetOtherNoSameCampInArea(camp,vaildDistance,max, playerPos, ingoreNpcId);
      
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

  


    this.FireOn = function () {
      if (fireGroup.length > 0) {
        return;
      }
      let fireId = new Date().getTime();
      // camp 阵营数值: 1000联盟 1001部落  10000共同敌人
      fireGroup.push({
        fireId: fireId,
        peopleList: []
      });
      console.log(" 开始新的战斗 ", fireGroup[fireGroup.length - 1]);
      const element = fireGroup[0];
      let npcs = _Global._YJNPCManager.GetAllVaildNPC();
      for (let i = 0; i < npcs.length; i++) {
        const npcComponent = npcs[i].GetComponent("NPC");
        npcComponent.fireId = fireId;
        element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: null });
      }
      for (let k = element.peopleList.length - 1; k >= 0; k--) {
        const people = element.peopleList[k];
        GetFireIdPlayer({ npcId: people.id, camp: people.camp, fireId: fireId });
      }
      scope.SendSceneState("战斗状态");
      _Global.applyEvent("战斗开始");
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
            FireOff();
            continue;
          }

          if (CheckSameCamp(element.peopleList)) {
            let camp = element.peopleList[0].camp;
            for (let k = element.peopleList.length - 1; k >= 0; k--) {
              const people = element.peopleList[k];
              this.SendSceneStateAll("玩家脱离战斗", people.id);
            }
            fireGroup.splice(i, 1);
            FireOff(camp);
            continue;
          }
        }
      }
      player.playerMirrors = [];
    }

    // 判断战斗中的角色是否同阵营
    function CheckSameCamp(peopleList) {
      // console.log("判断战斗中的角色是否同阵营 ",peopleList);
      let camp = peopleList[0].camp
      for (let j = peopleList.length - 1; j >= 1; j--) {
        if (camp != peopleList[j].camp) {
          return false;
        }
      }
      return true;
    }
    function FireOff(camp) {
      if (!_Global.createCompleted) {
        return false;
      }
      console.error(" 战斗双方只剩一方 ");
      _Global.applyEvent("战斗结束", camp);
    }
    this.ClearFire = function () {
      fireGroup = [];
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
        if (CheckSameCamp(peopleList)) {
          let camp = peopleList[0].camp;
          for (let k = peopleList.length - 1; k >= 0; k--) {
            const people = peopleList[k];
            scope.SendSceneStateAll("玩家脱离战斗", people.id);
          }
          fireGroup.splice(0, 1);
          FireOff(camp);
          return;
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
    this.AddFireGroup = function (id, camp, fireId, targetId) {
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
          element.peopleList.push({ id: id, camp: camp, targetId: targetId });
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
            element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetModel.id });
            console.log(" 玩家加入战斗触发 npc加入战斗");
          }
          if (!hasPlayer) {
            targetModel.fireId = element.fireId;
            element.peopleList.push({ id: targetModel.id, camp: targetModel.camp, targetId: npcComponent.transform.id });
            console.log(" 玩家加入战斗触发 玩家加入战斗");
          }
          return;
        }
      }
      this.SendSceneState("战斗状态");

    }

    //npc被攻击时初次进入战斗时，让附近的npc也加入战斗
    this.NPCAddFireById = function (npcComponent, fireId, targetId) {
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
          element.peopleList.push({ id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetId });
          // console.log("npc [" + npcComponent.npcName + "] 加入 附近的战斗 ", element);
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
      }
    }

    this.RemoveNPCFireId = function (id, fireId) {
      // console.log(npcComponent.npcName + "npc 死亡或其他 请求离开战斗" + npcComponent.fireId);
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          for (let j = element.peopleList.length - 1; j >= 0; j--) {
            const people = element.peopleList[j];
            if (people.targetId == id) {
              people.targetId = null;
            } else if (people.id == id) {
              element.peopleList.splice(j, 1);
            }
          }
          if (element.peopleList.length == 0) {
            fireGroup.splice(i, 1);
            FireOff();
            return;
          }
        }
      }

      LoopCheckFireFn();

    }
    this.NPCTargetToNone = function (state) {
      let { npcId, camp, fireId, ignorePlayerId, vaildDis } = state;
      // console.log(npcId + " 的目标为空 ");
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          for (let j = element.peopleList.length - 1; j >= 0; j--) {
            const people = element.peopleList[j];
            if (people.id == npcId) {
              people.targetId = null;
              GetFireIdPlayer(state, people);
              return;
            }
          }
        }
      }

    }
    this.LoopCheckFire = function () {
      LoopCheckFireFn();
    }
    function LoopCheckFireFn() {

      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (CheckSameCamp(element.peopleList)) {
          let camp = element.peopleList[0].camp;
          for (let k = element.peopleList.length - 1; k >= 0; k--) {
            const people = element.peopleList[k];
            scope.SendSceneStateAll("玩家脱离战斗", people.id);
          }
          fireGroup.splice(i, 1);
          FireOff(camp);
          return;
        } else {
          for (let k = element.peopleList.length - 1; k >= 0; k--) {
            const people = element.peopleList[k];
            if (people == undefined || people.id == undefined) {
              element.peopleList.splice(i, 1);
              continue;
            }
            if (people.targetId == people.id) {
              let npcComponent = _Global._YJNPCManager.GetNpcComponentById(people.id);
              if (npcComponent == null) {
                console.error(" npcId [" + people.id + "] 为空，不应该进入此判断 ");
              } else {
                console.error(" 不该进入此判断:  [" + npcComponent.npcName + "] 的目标 是自身 ");
              }
              people.targetId = null;
            }
            if (people.targetId == null) {
              if( _Global.YJ3D.YJPlayer.id == people.id){
                continue;
              }
              // console.log(" 2222 npcId ["+ people.id+ "] 的目标 ["+targetId+"] 已死亡，即将查找下一个目标 " );
              GetFireIdPlayer({ npcId: people.id, camp: people.camp, fireId: element.fireId }, people);

            }
          }
        }
        // console.log(" 战斗参与者剩余 ", element.peopleList);


      }
    }

    // 给npc查找同战斗组中的可攻击玩家
    function GetFireIdPlayer(state, people) {
      let { npcId, camp, fireId, ignorePlayerId, vaildDis } = state;
      let npcComponent = _Global._YJNPCManager.GetNpcComponentById(npcId);
      if (npcComponent == null) {
        console.error(" 不该进入此判断: npcId [" + npcId + "] 为空 ", state);
        return;
      }
      if (npcComponent.isDead) {
        return;
      }
      if (!npcComponent.canMove) {
        vaildDis = npcComponent.GetVaildAttackDis();
      } else {
        vaildDis = undefined;
      }

      // if(npcComponent.GetNickName().includes("阳光万里")){
      //   console.log(vaildDis," ["+ npcComponent.npcName+ "] ");
      // }

      // console.log(npcComponent.GetNickName()+" 查找下一个目标 ");

      const player = _Global._YJNPCManager.GetNoSameCampNPCInFireByNearestDis(npcComponent.GetWorldPos(), camp, vaildDis);
      // if (npcComponent.npcName.includes("老a")) {
      //   console.log(vaildDis, " [" + npcComponent.npcName + "] "," 目标 ",player);
      // }
      if (player) {
        if (player.isYJNPC) {
          if (npcId == player.transform.id) {
            console.error(" 不该进入此判断: [" + player.npcName + "] 的目标是自身 ");
          }
          // if (npcComponent.npcName.includes("怀特迈恩22") || scope.npcName.includes("我回来哩") ) {
          //   console.log(vaildDis, " [" + npcComponent.npcName + "] 找到目标 [" + player.npcName + "] ");
          // }
          if (people) {
            people.targetId = player.transform.id;
          }
          npcComponent.SetNpcTargetToNoneDrict();
          npcComponent.SetNpcTarget(player, true, false);
          return;
        }
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
      npcComponent.CheckNextTarget();
      // npcComponent.SetNpcTargetToNone(true, false);
      return;

      // let otherNoSameCamp = [];
      // console.log(" ["+ npcComponent.npcName+ "] 查找下一个目标 " , state);
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          for (let j = 0; j < element.peopleList.length; j++) {
            const people = element.peopleList[j];
            // console.log( " ["+ npcComponent.npcName+ "]  查找同一战斗中的参与者 ", people.camp);
            if (people.camp != camp && people.id != npcId && people.targetId == null) {
              if (ignorePlayerId == people.id) {
                continue;
              }
              // otherNoSameCamp.push(people.id);
              // const player = scope.GetPlayerById(people.id);
              // let playerMirror = _Global._YJNPCManager.GetNpcTransformById(playerId);
              const player = _Global._YJNPCManager.GetNoSameCampNPCInFireByNearestDis(npcComponent.GetWorldPos(), camp, vaildDis);
              if (player) {
                if (player.isYJNPC) {
                  if (!player.isDead) {

                    // if(camp == 1000){
                    //   console.error(" ["+ npcComponent.npcName+ "] 找到目标 ["+ player.npcName+"] ");
                    // }
                    if (people.id == player.transform.id) {
                      console.error(" [" + people.id + "] 找到目标 [" + player.npcName + "] ");
                    }
                    // console.log(distance,vaildDis," ["+ npcComponent.npcName+ "] 找到目标 ["+ player.transform.GetComponent("NPC").npcName+"] ");
                    people.targetId = player.transform.id;
                    npcComponent.SetNpcTargetToNoneDrict();
                    npcComponent.SetNpcTarget(player, true, false);
                  } else {
                    // console.log(" ["+ npcComponent.npcName+ "] 的目标已死亡 ");
                    continue;
                  }
                  return;
                }

                // console.log(" ["+ npcComponent.npcName+ "] 的目标是玩家 ",people.id,player, player.GetUserData());
                if (player.camp == camp) {
                  continue;
                }
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

      // for (let i = 0; i < otherNoSameCamp.length; i++) {
      //   const element = otherNoSameCamp[i];

      // }
      if (npcComponent != null) {
        // console.error( " ["+ npcComponent.npcName+ "]  找不到附近的敌人 ");
        setTimeout(() => {
          npcComponent.CheckNextTarget();
        }, 500);
        //npc移除战斗组
        // scope.RemoveNPCFireId(npcComponent);
        npcComponent.SetNpcTargetToNone(true, false);
      }

    }
    // 玩家拾取场景内物体的数据。用来做场景物体同步
    let playerData = [];
    //发送单个物体数据
    this.SendModelState = function (id, state) {
      // if (!_Global.YJClient) {
      //   return;
      // }
      this.SendSceneState("更新single", { id: id, modelType: state.modelType, state: state.msg });
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
      
      
      if (type == "玩家对玩家") {
        if (!_Global.YJClient) {
          this.Receive({ type: "玩家对玩家", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("玩家对玩家", msg);
        return;
      }

      if (type == "NPC对NPC") {
        if (!_Global.mainUser) {
          return;
        }
        let state = msg;
        let p = scope.GetNpcById(state.targetId).GetComponent("NPC");
        if (p ) {
          p.ReceiveSkill(this.GetNpcById(state.fromId).GetComponent("NPC"),  state.skillItem.skillName, state.skillItem.effect,state.skillItem);

        }
        return;
      }
      if (type == "NPC对玩家") {
        if (!_Global.YJClient) {
          this.Receive({ type: type, state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: type, state: msg });
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
      _Global._YJDyncManager.SendSceneState("转发", { type: type, state: msg });

    }

    // 接收 转发 数据
    this.Receive = function (data) {
      // console.log(" Receive ",data);
      let { type, state } = data;
      if (type == "重新生成") {
        if (!_Global.mainUser) {
          let { modelId } = state;
          let npcComponent = _Global._YJNPCManager.GetNpcComponentById(modelId);
          if (npcComponent) {
            if (npcComponent.isDead) {
              npcComponent.Dync({ title: "重新生成" });
            }
            return;
          }
          let redboss = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(modelId);
          let npc = redboss.GetComponent("NPC");
          if (npc.isDead) {
            npc.Dync({ title: "重新生成" });
          }
        }
        return;
      }
      if (type == "移除npc") {
        if (!_Global.mainUser) {
          let { npcId } = state;
          _Global._YJNPCManager.RemoveNpcById(npcId);
        }
        return;
      }
      if (type == "生成npc") {
        if (!_Global.mainUser) {
          let { modelId, npcId } = state;
          _Global._YJNPCManager.DuplicateNPC(modelId, npcId, (copy) => {
            let { uname, uface } = state;
            if (uname) {
              let npc = copy.GetComponent("NPC");
              npc.CreateHeader(uface);
              npc.SetName(uname);
            }
          });
        }
        return;
      }

      if (type == "玩家死亡") {
        if (_Global.mainUser) {
          this.RemovePlayerFireId(state.playerId, state.fireId);
        }
        return;
      }
      if (type == "所有人加生命") {
        _SceneManager.ReceivePlayer({ buff: "addHealth", buffValue: state });
        return;
      }
      if (type == "弹幕") {
        if (indexVue.$refs.HUD.$refs.DMPanel) {
          indexVue.$refs.HUD.$refs.DMPanel.receiveMsg(state);
        }
        return;
      }
      // console.log(" 接收 ", type, state);
      if (type == "玩家脱离战斗") {
        if (_Global.YJ3D.YJPlayer.id == state) {
          _Global._YJPlayerFireCtrl.SetPlayerEvent("玩家脱离战斗");
        }
        if (_Global.mainUser) {
          _Global._YJNPCManager.EventHandler(data);
        }
        return;
      }
      if (type == "玩家加入战斗") {
        let { playerId, fireId } = state;
        if (_Global.YJ3D.YJPlayer.id == playerId) {
          _Global._YJPlayerFireCtrl.SetPlayerEvent("玩家加入战斗", fireId);
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
              // mirrorNpc.CheckNextTarget();
            }
          }
        }
        return;
      }

      if (type == "玩家对玩家") {

        if (!_Global.mainUser) {
          return;
        }
        let { fromType,targetType,fromId,targetId, skillItem } = state;
        let fromModel = null;
        let targetModel = null;
        if(fromType == "玩家"){
          fromModel = scope.GetPlayerById(fromId);
        }
        if(fromType == "NPC"){
          fromModel = scope.GetNpcById(fromId).GetComponent("NPC");
        }

        if(targetType == "玩家"){
          targetModel = scope.GetPlayerById(targetId);
        }
        if(targetType == "NPC"){
          targetModel = scope.GetNpcById(targetId).GetComponent("NPC");
        }

        if(targetModel){
          if(targetModel.isPlayer){
            _Global._YJPlayerFireCtrl.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
          }else{
            targetModel.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
          }
        }
        return;
      }
      if (type == "玩家对NPC") {
        let { fromId,targetId, skillName, effect } = state;

        if (_Global.mainUser) {
          this.GetNpcById(targetId).GetComponent("NPC").ReceiveSkill(scope.GetPlayerById(fromId), skillName, effect
          ,state.skillItem);
        }

        // if (_Global.YJ3D.YJPlayer.id == playerId) {
        //   // return;
        //   // 对npc的伤害显示在屏幕上
        //   let pos = this.GetNpcById(npcId).GetWorldPos().clone();
        //   pos.y += this.GetNpcById(npcId).GetComponent("NPC").GetBaseModel().playerHeight;
        //   _Global._SceneManager.UpdateNpcDamageValue("self", "normal",playerId, _Global.user.camp, effect.value, pos, "redius");
        // }

        return;
      }
      if (type == "NPC对NPC") {
        if (!_Global.mainUser) {
          return;
        }
        let p = this.GetNpcById(state.targetId);
        if (p ) {
          p.GetComponent("NPC").ReceiveSkill(this.GetNpcById(state.fromId).GetComponent("NPC"),
           state.skillName, state.skillItem.effect,state.skillItem);
        }
        return;
      }
      if (type == "NPC对玩家") {
        // console.log(" NPC对玩家 ",state);
        if (state.targetId == _Global.YJ3D.YJPlayer.id) {
          _Global._YJPlayerFireCtrl.ReceiveSkill(this.GetNpcById(state.fromId).GetComponent("NPC"), 
          state.skillName, state.skillItem.effect,state.skillItem);
          return;
        }
      }

      if (type == "npc技能" || type == "npc技能攻击" || type == "受到技能" || type == "解除技能") {
        let { fromType,targetType,fromId,targetId, skillItem } = state;
        // if (type == "npc技能") {
        //   // npc技能施法/吟唱状态
        //   _SceneManager.SetTargetSkill(npcId, skill);
        // }
        let fromModel = null;
        let targetModel = null;
        if(fromType == "玩家"){
          fromModel = scope.GetPlayerById(fromId);
        }
        if(fromType == "NPC"){
          fromModel = scope.GetNpcById(fromId).GetComponent("NPC");
        }

        if(targetType == "玩家"){
          targetModel = scope.GetPlayerById(targetId);
        }
        if(targetType == "NPC"){
          targetModel = scope.GetNpcById(targetId).GetComponent("NPC");
        }
        if(targetModel){
          if(targetModel.isPlayer){
            _Global._YJPlayerFireCtrl.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
          }else{
            targetModel.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
          }
        }
        // _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel({ id: npcId, modelType: "NPC模型", state: { title: type, skill: skill } });
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
        if (_Global.mainUser) {
          return;
        }
        fireGroup = state;
        console.log("战斗状态同步改变 ", fireGroup);
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
            AddModel(_state);
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
          if (!has) {
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

    function AddModel(singleData) {
      let { id, modelType, state } = singleData;
      if (modelType == "NPC模型") {
        let { modelId, npcId, dmData, modelData } = state;
        if (modelId) {
          if (!_Global.mainUser) {
            _Global._YJNPCManager.DuplicateNPC(modelId, npcId, (copy) => {
              if (dmData) {
                let { uname, uface } = dmData;
                let npc = copy.GetComponent("NPC");
                npc.CreateHeader(uface);
                npc.SetName(uname);
              }

            });
          }
          return;
        }

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
              _Global._YJPlayerFireCtrl.SetPlayerEvent("添加镜像", _playerId);
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
    function RemoveModel(singleData) {
      let { id, modelType, state } = singleData;
      if (modelType == "NPC模型") {
        _Global._YJNPCManager.RemoveNpcById(id);
      }

    }
    //接收服务器下发
    this.ReceiveFromServer = function (sceneState) {
      if (_Global.mainUser) {
        return;
      }
      console.log(" 接收服务器下发 更新单个模型 ", sceneState);
      let model = sceneState.state;
      switch (sceneState.title) {
        case "添加":
          AddModel(model);
          return;
        case "删除":
          RemoveModel(model);
          // let { npcId, playerId } = model;
          // if (_Global.YJ3D.YJPlayer.id == playerId) {
          //   _Global._YJPlayerFireCtrl.SetPlayerEvent("删除镜像", npcId);
          // } 
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
        let { startPos, targetId, targetType, time, firePid } = data;
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
          shootTargetFn(_startPos, target, time, firePid);
        }
        return;
      }
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().ReceiveModel(id, title, data);
    }



    //角色离线移除角色时，如果npc以该角色为目标，则让npc查找下一个目标
    this.DelPlayer = function (id) {
      _Global._YJNPCManager.DelPlayer(id);
    }

    //#region 
    //#endregion

    //#region 
    this.shootTarget = function (startPos, target, speed, targetType, firePid, callback) {
      // console.log(" 同步trail target ", target.id, targetType);
      scope.UpdateModel("", "同步trail", { startPos: startPos, targetId: target.id, firePid: firePid, targetType: targetType, speed: speed });
      shootTargetFn(startPos.clone(), target, speed, firePid, callback);
    }
    function shootTargetFn(startPos, target, speed, firePid, callback) {
      _YJSkillParticleManager.shootTargetFn(startPos.clone(), target, speed, firePid, callback);

      // _YJSkillParticleManager.shootTargetFn(startPos.clone(), target, "1704443871265");
    }
    //#endregion

    this.DyncPlayerState = function (YJPlayer, state) {
      YJPlayer.DyncPlayerState(state); return;
    }

    function init() {
      _YJSkillParticleManager = new YJSkillParticleManager(_this);
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