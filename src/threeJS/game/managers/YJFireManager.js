



import * as THREE from "three";
import { RandomInt } from "../../../utils/utils";
import { YJNPCManager } from "./YJNPCManager.js";
import { YJPlayerManager } from "./YJPlayerManager.js";
// 战斗管理
class YJFireManager {
  constructor() {
    let scope = this;
    let playerList = [];

    let _YJNPCManager = null;
    let _YJPlayerManager = null;
    function Init() {
      _Global._YJFireManager = scope;
      _YJNPCManager = new YJNPCManager();
      _YJPlayerManager = new YJPlayerManager();

      if (_Global.setting.inEditor) {
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();
        return;
      }
      setInterval(() => {
        CheckNpcLookat();
      }, 500);

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
        if (npcComponent.GetIsPlayer()) {
          // 玩家的镜像或守护弹幕玩家不使用巡视范围找目标
          continue;
        }
        if (_Global.mainUser) {
          // 第三个参数表示是否查找npc附近的npc，让附近的npc一起攻击玩家
          npcComponent.SetNpcTarget(_Global.YJ3D.YJPlayer, true, true);
        } else {
          //向主控发送npc发现玩家
          _Global.DyncManager.SendSceneState("转发", { type: "npc发现玩家", state: { npcId: npcComponent.transform.id, playerId: _Global.YJ3D.YJPlayer.id } });
        }
      }
    }

    // 添加增生的npc
    this.AddNpc = function (npcTransform) {
      _Global._YJNPCManager.AddNpc(npcTransform);
    }

    this.SetNearNPCTarget = function (npcComponent1, targetModel) {
      let npcs = _Global._YJNPCManager.GetNearNPC(npcComponent1, targetModel);
      for (let i = 0; i < npcs.length; i++) {
        const npcComponent = npcs[i];
        npcComponent.SetNpcTarget(targetModel, true, false);
        scope.NPCAddFireById(npcComponent, npcComponent1.fireId);
      }
    }

    this.GetNPCs = function () {
      return playerList;
    }
    this.GetOtherNoSameCampInArea = function (camp, vaildDistance, max, centerPos, ingoreNpcId) {
      let npcs = _YJNPCManager.GetOtherNoSameCampInArea(camp, vaildDistance, max, centerPos, ingoreNpcId);
      let players = _YJPlayerManager.GetOtherNoSameCampInArea(camp, vaildDistance, max, centerPos, ingoreNpcId);
      for (let j = 0; j < players.length; j++) {
        npcs.push(players[j]);
      }
      return npcs;
    }

    // 获取生命值最小的友方角色，包含自身
    this.GetSameCampMinHealth = function (camp) {
      let npcs = _YJNPCManager.GetSameCamp(camp);
      let players = _YJPlayerManager.GetSameCamp(camp);

      let max = 100;
      let _player = null;
      for (let i = 0; i < npcs.length; i++) {
        const player = npcs[i];
        if (player.GetHealthPerc() < max) {
          max = player.GetHealthPerc();
          _player = player;
        }
      }
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.GetHealthPerc() < max) {
          max = player.GetHealthPerc();
          _player = player;
        }
      }
      if (_player == null) {
        return null;
      }
      return _player;
    }

    this.GetSameCampByRandom = function (camp, fireId) {
      let npcs = _YJNPCManager.GetSameCamp(camp, fireId);
      let players = _YJPlayerManager.GetSameCamp(camp, fireId);
      for (let j = 0; j < players.length; j++) {
        npcs.push(players[j]);
      }
      if (npcs.length == 0) {
        return null;
      }
      return npcs[RandomInt(0, npcs.length - 1)];
    }

    this.GetNoSameCampByRandom = function (camp, fireId) {
      //随机目标，优先去同战斗id中找

      let npcs = _YJNPCManager.GetNoSameCamp(camp, fireId);
      let players = _YJPlayerManager.GetNoSameCamp(camp, fireId);
      for (let j = 0; j < players.length; j++) {
        npcs.push(players[j]);
      }
      if (npcs.length == 0) {
        return null;
      }
      return npcs[RandomInt(0, npcs.length - 1)];
    }

    this.GetNpcOrPlayerById = function (id) {
      let npc = _YJNPCManager.GetNpcComponentById(id);
      if (npc != null) {
        return npc;
      }
      return _YJPlayerManager.GetPlayerById(id)
    }
    //角色离线移除角色时，如果npc以该角色为目标，则让npc查找下一个目标
    this.DelPlayer = function (id) {
      _Global._YJNPCManager.DelPlayer(id);
    }

    // 战斗组，用来做npc的攻击目标，第一目标死亡，攻击第二目标
    let fireGroup = [];
    this.GetFireGroup = function () {
      return fireGroup;
    }
    this.CheckHasFire = function () {
      return fireGroup.length != 0;
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
      checkAddPeople(element.peopleList, { id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetId });
      // console.log(npcComponent.GetNickName() + " " + npcComponent.transform.id +" 加入战斗 ");
      return true;
    }

    function RemoveFromArroy(peopleList, items) {
      // console.log(" 移除 战斗参与者 00 ", peopleList, items);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let has = false;
        for (let j = peopleList.length - 1; j >= 0 && !has; j--) {
          const element = peopleList[j].id;
          if (element == item) {
            peopleList.splice(j, 1);
            // console.log(" 移除 战斗参与者 ", item);
            has = true;
          }
        }
        if (CheckSameCamp(peopleList)) {
          sameCamp = peopleList[0].camp;
          for (let k = peopleList.length - 1; k >= 0; k--) {
            peopleList.splice(k, 1);
          }  
          return;
        }
      }

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

    this.GetNpcById = function (npcId) {
      return _Global._YJNPCManager.GetNpcTransformById(npcId);
    }

    this.GetPlayerById = function (playerId) {
      return _Global._YJPlayerManager.GetPlayerById(playerId)
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

      return _Global._YJNPCManager.GetOtherNoSameCampInArea(camp, vaildDistance, max, playerPos, ingoreNpcId);

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
        checkAddPeople(element.peopleList, { id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: null });
      }
      for (let k = element.peopleList.length - 1; k >= 0; k--) {
        const people = element.peopleList[k];
        GetFireIdPlayer({ npcId: people.id, camp: people.camp, fireId: fireId });
      }
      _Global.DyncManager.SendSceneState("战斗状态");
      _Global.applyEvent("战斗开始");
    }
    // 玩家死亡
    this.RemovePlayerFireId = function (playerId, fireId) {

      // console.log(" 玩家死亡 ",playerId, fireId);
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

      // console.log(" 玩家死亡 11 ",players);

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
        }
      }
      player.playerMirrors = [];
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
          checkAddPeople(element.peopleList, { id: id, camp: camp, targetId: targetId });
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
            checkAddPeople(element.peopleList, { id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetModel.id });
            console.log(" 玩家加入战斗触发 npc加入战斗");
          }
          if (!hasPlayer) {
            targetModel.fireId = element.fireId;
            checkAddPeople(element.peopleList, { id: targetModel.id, camp: targetModel.camp, targetId: npcComponent.transform.id });
            console.log(" 玩家加入战斗触发 玩家加入战斗");
          }
          return;
        }
      }
      _Global.DyncManager.SendSceneState("战斗状态");

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
          checkAddPeople(element.peopleList, { id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetId });
          // console.log("npc [" + npcComponent.npcName + "] 加入 附近的战斗 ", element);
        }
      }
      _Global.DyncManager.SendSceneState("战斗状态");

    }
    // 未受伤、未被npc攻击，强制设置玩家进入战斗id
    this.PlayerAddFireById = function (player, fireId) {
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          checkAddPeople(element.peopleList, { id: player.id, camp: player.camp });
          console.log(" 玩家 加入战斗 22 ", element);
        }
      }
      _Global.DyncManager.SendSceneState("战斗状态");
    }
    this.RequestNextFireIdPlayer = function (state) {
      if (_Global.mainUser) {
        GetFireIdPlayer(state);
      }
    }

    this.RemoveNPCFireId = function (id, fireId) {
      // console.log(npcComponent.npcName + "npc 死亡或其他 请求离开战斗" + npcComponent.fireId);
      let has = false;
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          for (let j = element.peopleList.length - 1; j >= 0; j--) {
            const people = element.peopleList[j];
            if (people.id == id) {
              element.peopleList.splice(j, 1);
              has = true;
              continue;
            }
            if (people.targetId == id) {
              people.targetId = null;
            }
          }
          // console.log(" 参与者数量 ",element.peopleList.length);
          if (element.peopleList.length == 0) {
            fireGroup.splice(i, 1);
            FireOff();
            return;
          }
        }
      }
      if (!has) {
        console.error(" 出错：id " + id + "  死亡或离开战斗, 但该id未在战斗中",
          fireId, fireGroup);
      }
      LoopCheckFireFn();

    }

    // 设置NPC的目标为空，并请求下一个目标
    this.NPCTargetToNone = function (state) {
      let { npcId, camp, fireId, ignorePlayerId, vaildDis } = state;
      // console.log(npcId + " 的目标为空 ",fireGroup);
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          for (let j = element.peopleList.length - 1; j >= 0; j--) {
            const people = element.peopleList[j];
            if (people.id == npcId) {
              people.targetId = null;
              return GetFireIdPlayer(state, people);
            }
          }
        }
      }
      return false;

    }

    this.LoopCheckFire = function () {
      LoopCheckFireFn();
    }
    function LoopCheckFireFn() {
      // if(_Global.createCompleted){
      //   console.log(fireGroup);
      // }
      if (fireGroup.length == 0) {
        FireOff(sameCamp);
        return;
      }
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (CheckSameCamp(element.peopleList)) {
          let camp = element.peopleList[0].camp;
          for (let k = element.peopleList.length - 1; k >= 0; k--) {
            const people = element.peopleList[k];
            _Global.DyncManager.SendSceneStateAll("玩家脱离战斗", people.id);
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
              if (_Global.YJ3D.YJPlayer.id == people.id) {
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
        return ;
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


    // 判断战斗中的角色是否同阵营
    function CheckSameCamp(peopleList) {
      if(peopleList.length==1){
        return true;
      }
      // console.log("判断战斗中的角色是否同阵营 ",peopleList);
      let camp = peopleList[0].camp
      for (let j = peopleList.length - 1; j >= 1; j--) {
        if (camp != peopleList[j].camp) {
          return false;
        }
      }
      return true;
    }
    let sameCamp = 0;
    function FireOff() {
      if (!_Global.createCompleted) {
        return false;
      }
      console.error(" 战斗双方只剩一方 ");
      _Global.applyEvent("战斗结束", camp);
    }
    this.ClearFire = function () {
      fireGroup = [];
    }
    function checkAddPeople(peopleList, people) {
      let has = false;
      for (let i = 0; i < peopleList.length && !has; i++) {
        const element = peopleList[i];
        if (element.id == people.id) {
          has = true;
        }
      }
      if (!has) {
        peopleList.push(people);
      }
    }

    // 由NPC触发
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
          checkAddPeople(element.peopleList, { id: npcComponent.transform.id, camp: npcComponent.GetCamp(), targetId: targetModel.id });
          console.log(npcComponent.npcName + " npc 加入正在进行中的战斗 ", element);
        }

        if (!cPlayer) {
          if (targetModel.fireId == -1) {
            targetModel.fireId = element.fireId;
          }
          checkAddPeople(element.peopleList, { id: targetModel.id, camp: targetModel.camp, targetId: npcComponent.transform.id });
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
      let npcId = npcComponent.transform.id;
      // camp 阵营数值: 1000联盟 1001部落  10000共同敌人
      fireGroup.push({
        fireId: fireId,
        peopleList: [
          { id: targetModel.id, camp: targetModel.GetCamp(), targetId: npcId },
          { id: npcId, camp: npcComponent.GetCamp(), targetId: targetModel.id }]
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
      _Global.DyncManager.SendSceneStateAll("玩家加入战斗", { playerId: targetModel.id, targetId: npcId, fireId: fireId });
      _Global.DyncManager.SendSceneState("战斗状态");
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


    this.AddModelDMPlayer = function (state, callback) {
      console.log("添加弹幕玩家镜像 ", state);
      let { modelId, npcId, camp, dmData } = state;

      let npcTransform = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(modelId);
      if (npcTransform == null) {
        console.error("不该进入此判断：", modelId + " 不存在");
        return;
      }
      let modelData = JSON.parse(JSON.stringify(npcTransform.modelData));
      modelData.active = true;
      modelData.message.data.baseData.camp = camp;
      modelData.id = npcId;
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().DuplicateModelNPC(modelData, (copy) => {
        // 测试显示指定名称id的NPC
        _YJNPCManager.AddNpc(copy); 
        let npc = copy.GetComponent("NPC");
        if (dmData) {
          let { uname, uface } = dmData;
          npc.CreateHeader(uface);
          npc.SetName(uname);
        }
        npc.SetDMPlayerMirror();
        copy.SetActive(true);
        if (callback) {
          callback(npc);
        }
      }, npcId);


    }


    Init();

  }
}

export { YJFireManager };