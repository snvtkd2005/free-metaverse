



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
      }, 2000);

    }
    let playerPos = new THREE.Vector3(0, 0, 0);
    // 每0.5秒检测一次。巡视NPC是否能发现玩家。每个玩家独立计算，计算后再做npc目标同步
    function CheckNpcLookat() {

      // if (_Global.YJ3D.YJController.isInDead() || !_Global.hasAvatar) {
      //   return;
      // }

      playerPos = _Global.YJ3D.YJController.GetPlayerWorldPos();

      // let npcs = _YJNPCManager.GetNoSameCampNPC(playerPos);
      let npcs = _YJNPCManager.GetAllVaildNPC();

      for (let i = 0; i < npcs.length; i++) {
        const npcComponent = npcs[i];
        if (npcComponent.GetIsPlayer()) {
          // 玩家的镜像或守护弹幕玩家 不使用巡视范围找目标
          continue;
        }
        if(npcComponent.GetCamp() == 10002){
          // 中立npc 不使用巡视范围找目标
          continue;
        }
        
        if(npcComponent.fireId != -1){
          //已经在战斗中，不使用巡视范围找目标
          continue;
        }
        CheckNpcLookatFn(npcComponent);
        // if (_Global.mainUser) {
        //   // 第三个参数表示是否查找npc附近的npc，让附近的npc一起攻击玩家
        //   npcComponent.SetNpcTarget(_Global.YJ3D.YJPlayer, true, true);
        // } else {
        //   //向主控发送npc发现玩家
        //   _Global.DyncManager.SendSceneState("转发", { type: "npc发现玩家", state: { npcId: npcComponent.transform.id, playerId: _Global.YJ3D.YJPlayer.id } });
        // }
      }
    }
    function CheckNpcLookatFn(npc){
      
      let npcs = _Global._YJNPCManager.GetNearDirect(npc.id,npc.GetWorldPos());
      let players = _Global._YJPlayerManager.GetNearDirect(npc.GetWorldPos());
      for (let i = 0; i < players.length; i++) {
        npcs.push(players[i]);
      }
      // console.log("",npc.GetNickName()," 附近的npc ",npcs);
      for (let i = 0; i < npcs.length; i++) {
        const npcComponent = npcs[i];
        if (npcComponent.isYJNPC && npcComponent.GetIsPlayer()) {
          // 玩家的镜像或守护弹幕玩家 不使用巡视范围找目标
          continue;
        }
        if( npcComponent.GetCamp() == npc.GetCamp()){
          // 忽略同阵营
          continue;
        }
          if( npcComponent.GetCamp() != npc.GetCamp()){
          if(npcComponent.GetCamp() == 10002){
            //忽略中立npc
            continue;
          }
          if(npc.GetCamp() == 10001 && npcComponent.isPlayer){
            // 友善npc 对玩家忽略
            continue;
          }

          if(_Global.mainUser){
            npc.SetNpcTarget(npcComponent, true, true);
          }else{
            if(_Global.DyncManager){
              _Global.DyncManager.SendSceneState("转发", { type: "npc发现玩家", state: { npcId: npcComponent.transform.id, playerId: _Global.YJ3D.YJPlayer.id } });
            }
          }
        }else{

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
        scope.NPCAddFireById(npcComponent, npcComponent1.fireId,targetModel.id);
      }
    }

    // 获取npc附近的同阵营其他npc
    this.GetNearNPCByNPC = function (fromNpc, dis,max) {
      let npcs = _Global._YJNPCManager.GetNearSameCampNPCByNPC(fromNpc, dis,max);
      return npcs;
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
    this.GetSameCampByRandomInFire = function (camp, fireId) {
      let npcs = _YJNPCManager.GetSameCampInFire(camp, fireId);
      let players = _YJPlayerManager.GetSameCampInFire(camp, fireId);
      for (let j = 0; j < players.length; j++) {
        npcs.push(players[j]);
      }
      if (npcs.length == 0) {
        return null;
      }
      return npcs[RandomInt(0, npcs.length - 1)];
    }

    this.GetNoSameCampInFire = function(camp, fireId){
      let other = [];
      let has = false;
      for (let i = fireGroup.length - 1; i >= 0 && !has; i--) {
        const element = fireGroup[i];
        if (element.fireId == fireId) {
          has = true;
          let peopleList = element.peopleList;
          let otherPeople = [];
          for (let j = peopleList.length - 1; j >= 0 ; j--) {
            const people = peopleList[j];
            if (people.camp != camp) {
              otherPeople.push(people);
            }
          }  

          for (let i = 0; i < otherPeople.length; i++) {
            const people = otherPeople[i];
            if(people.type=="NPC"){
              let npc = _YJNPCManager.GetNpcComponentById(people.id);
              if(!npc.isDead){
                other.push(npc);
              }
            }
            else if(people.type=="玩家" && camp != 10001){
              let yjplayer = _YJPlayerManager.GetPlayerById(people.id);
              if(!yjplayer.isDead){
                other.push(yjplayer);
              }
            }
          }
        }
      }
      return other;
    }
    this.GetNoSameCampByRandom = function (camp, fireId) {
      console.log("查找随机目标",camp, fireId,fireGroup);
      //随机目标，优先去同战斗id中找
      if(fireId!=undefined && fireId !=-1){
        let other = this.GetNoSameCampInFire(camp, fireId);
        return other[RandomInt(0, other.length - 1)];
      }
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
    this.GetNoSameCampByRandomInFire = function (camp, fireId) {
      console.log("查找随机目标",camp, fireId,fireGroup);
      //随机目标，优先去同战斗id中找
      if(fireId!=undefined && fireId !=-1){
        let other = this.GetNoSameCampInFire(camp, fireId);
        return other[RandomInt(0, other.length - 1)];
      }
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
      checkAddPeople(element.peopleList, { id: npcComponent.transform.id,type:npcComponent.getPlayerType(), camp: npcComponent.GetCamp(), targetId: targetId });
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
      return;
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
        checkAddPeople(element.peopleList, { id: npcComponent.transform.id,type:npcComponent.getPlayerType(), camp: npcComponent.GetCamp(), targetId: null });
      }
      for (let k = element.peopleList.length - 1; k >= 0; k--) {
        const people = element.peopleList[k];
        SetNPCNextTarget(people);
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

    this.AddFireGroup = function (id, camp,type, fireId, targetId) {
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
          checkAddPeople(element.peopleList, { id: id, camp: camp,type, targetId: targetId });
          console.log(" 加入战斗组 ", element);
          if(camp==undefined){
            console.error(" ===== camp 为空 ");
          }
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
            checkAddPeople(element.peopleList, { id: npcComponent.transform.id,type:npcComponent.getPlayerType(), camp: npcComponent.GetCamp(), targetId: targetModel.id });
            console.log(" 玩家加入战斗触发 npc加入战斗");
          }
          if (!hasPlayer) {
            targetModel.fireId = element.fireId;
            checkAddPeople(element.peopleList, { id: targetModel.id,type:targetModel.getPlayerType(), camp: targetModel.GetCamp(), targetId: npcComponent.transform.id });
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
          checkAddPeople(element.peopleList,
             { id: npcComponent.transform.id,type:npcComponent.getPlayerType(), camp: npcComponent.GetCamp(), 
              targetId: targetId });
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
          checkAddPeople(element.peopleList, { id: player.id,type:"玩家", camp: player.GetCamp(),targetId:null });
          console.log(" 玩家 加入战斗 22 ", element);
        }
      }
      _Global.DyncManager.SendSceneState("战斗状态");
    } 

    this.RemoveNPCFireId = function (id, fireId) {

      let npcComponent = _Global._YJNPCManager.GetNpcComponentById(id);
      if(npcComponent){
        // console.error(npcComponent.GetNickName() + " npc 死亡 请求离开战斗" ,id, fireId);
      }else{
        console.error(" 不该进入此判断 " +id + " 。 找不到npc ");
      }

      let has = false;
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        const element = fireGroup[i];
        if (element.fireId == fireId || true) {
          for (let j = element.peopleList.length - 1; j >= 0; j--) {
            const people = element.peopleList[j];
            if (people.id == id) {
              element.peopleList.splice(j, 1);
              has = true;
              continue;
            }
            if (people.targetId == id) {
              people.targetId = null;
              if(people.type=="NPC"){ 
                let hasNext = SetNPCNextTarget(people);
                if(!hasNext){
                  element.peopleList.splice(j, 1);
                  // let notargetNpc = _Global._YJNPCManager.GetNpcComponentById(people.id);
                  // console.error(" 从战斗中移除 ： " +notargetNpc.GetNickName() + " 找不到新目标" );

                }
              }
            }
          } 
          // console.log(" 参与者数量 ",element.peopleList.length);
          if (element.peopleList.length <= 1) {
            fireGroup.splice(i, 1); 
            // console.error(" 结束战斗： " +fireId + " 。 剩余进行中的战斗 ", fireGroup);
            continue;
          }
        }


      }
      for (let i = fireGroup.length - 1; i >= 0; i--) {
        CheckPeopleVaild(fireGroup[i].peopleList);
      }
      
      if (!has) {
        console.error(" 出错： " + npcComponent.GetNickName()+" "+id + "  死亡或离开战斗, 但未在战斗中",fireId, fireGroup);
      }
      LoopCheckFireFn();
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
          if(element.peopleList.length>0){
            sameCamp = element.peopleList[0].camp;
            for (let k = element.peopleList.length - 1; k >= 0; k--) {
              const people = element.peopleList[k];
              if(people.type == "NPC"){
                let notargetNpc = _YJNPCManager.GetNpcComponentById(people.id);
                notargetNpc.fireOff();
              }
              if(people.type == "玩家"){
                _Global.DyncManager.SendSceneStateAll("玩家脱离战斗", people.id);
              }
            }
          }
          fireGroup.splice(i, 1);
          continue;
        } else {
          for (let k = element.peopleList.length - 1; k >= 0; k--) {
            const people = element.peopleList[k];
            if (people == undefined || people.id == undefined) {
              element.peopleList.splice(i, 1);
              console.error(" 不该进入此判断: 单条角色记录为空 ");
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
                // 忽略玩家自身的记录
                continue;
              }
              let hasNext = SetNPCNextTarget(people);
              if(!hasNext){
                element.peopleList.splice(k, 1);
                // let npcComponent = _Global._YJNPCManager.GetNpcComponentById(people.id);
                // console.error(" 从战斗中移除 ： " +npcComponent.GetNickName()+ " 找不到新目标" );
              }
              if(element.peopleList.length<=1){
                fireGroup.splice(i, 1);
              }

              // console.log(" 2222 npcId ["+ people.id+ "] 的目标 ["+targetId+"] 已死亡，即将查找下一个目标 " );
            }
          }
        }
        // console.log(" 战斗参与者剩余 ", element.peopleList);


      }
      if (fireGroup.length == 0) {
        FireOff(sameCamp);
        return;
      }
    }
    this.SetNPCNextTarget = function(people){
      return SetNPCNextTarget(people);
    }
    function SetNPCNextTarget(people){
      if(people.type == "玩家"){return true;}
      let { id, camp, fireId } = people;
      let npcComponent = _Global._YJNPCManager.GetNpcComponentById(id);
      if (npcComponent == null) {
        console.error(" 不该进入此判断: npcId [" + id + "] 为空 ", people);
        return false;
      } 
      // console.log(npcComponent.GetNickName()+" 请求查找下一个目标 00 ");
      if (npcComponent.isDead) {
        return false;
      }
      let vaildDis = 0;
      if (!npcComponent.canMove) {
        vaildDis = npcComponent.GetVaildAttackDis();
      } else {
      }
      let dis = 10000;
      if(vaildDis){
        dis = vaildDis;
      }
      let player = null;
      let others = scope.GetNoSameCampInFire(camp, fireId);
      for (let i = 0; i < others.length; i++) {
        const element = others[i]; 
        let distance = npcComponent.GetWorldPos().distanceTo(element.GetWorldPos()); 
        if (distance <= dis && element.id !=npcComponent.id) {
          dis = distance;
          player = (element); 
        }
      }
 
      if (player) {

        if (people) {
          people.targetId = player.id;
        }
        if (id == player.id) {
          console.error(" 不该进入此判断: [" + player.GetNickName() + "] 的目标是自身 ");
        } 
        if (npcComponent.GetCamp() == player.GetCamp()) {
          console.error(" 不该进入此判断: [" + npcComponent.GetCamp() + "] 的目标是同阵营 ",fireGroup);
        }
        // console.log( " [" + npcComponent.GetNickName() + "] "," 设置目标 ",player.GetNickName());
        
        npcComponent.SetNpcTargetToNoneDrict();
        npcComponent.SetNpcTarget(player, true, false);
        return true;
        if (player.isYJNPC) {
          npcComponent.SetNpcTargetToNoneDrict();
          npcComponent.SetNpcTarget(player, true, false);
          return true;
        }
        if (player.isLocal) {
          if (_this.YJController.GetUserData().baseData.health > 0) {
            //发送npc目标
            npcComponent.SetNpcTarget(player, true, false);
            return true;
          }
        } else {
          if (player.GetUserData().baseData.health > 0) {
            //发送npc目标
            npcComponent.SetNpcTarget(player, true, false);
            return true;
          }
        }
      }
      // console.log(npcComponent.GetNickName()+" 结束战斗 ");
      npcComponent.fireOff();
      return false;
    }

    // 判断战斗中的角色是否同阵营
    function CheckSameCamp(peopleList) {
      if(peopleList.length<=1){
        return true;
      }
      // console.log("判断战斗中的角色是否同阵营 ",peopleList);
      let camp = peopleList[0].camp
      for (let j = peopleList.length - 1; j >= 1; j--) {
        if (camp != peopleList[j].camp && peopleList[j].camp != 10001) {
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
    function CheckPeopleVaild(peopleList){
      // console.log("检查参与战斗的记录是否有效",peopleList);
      for (let i = peopleList.length -1; i >= 0; i--) {
        const targetId = peopleList[i].targetId;
        let has  =false;
        for (let j = 0; j < peopleList.length && !has; j++) {
          if(peopleList[j].id == targetId){
            has = true;
          }
        }
        // if(){

        // }
        // let notargetNpc = _Global._YJNPCManager.GetNpcComponentById(peopleList[i].id);
        // if(notargetNpc.isDead){
        //   peopleList.splice(i, 1);
        //   console.error(" 从战斗中移除 ： " +notargetNpc.GetNickName() + " 已死亡 "); 
        //   continue;
        // }

        if (!has) { 
          // let npcComponent = _Global._YJNPCManager.GetNpcComponentById(targetId);
          // console.error("不该进入此判断：", targetId,npcComponent.GetNickName() + " 不在",npcComponent.GetBaseData(),(peopleList));
          peopleList[i].targetId = null; 
          let hasNext = SetNPCNextTarget(peopleList[i]);
          if(!hasNext && peopleList[i].type == "NPC"){
            // let notargetNpc = _Global._YJNPCManager.GetNpcComponentById(peopleList[i].id);
            // console.error(" 从战斗中移除 ： " +notargetNpc.GetNickName() + " 找不到新目标"); 
            peopleList.splice(i, 1); 
          }
        }
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
          if (player.id == npcComponent.id) {
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


        if(hasGroup){
          if (!hasNpc) {
            if (npcComponent.fireId == -1) {
              npcComponent.fireId = element.fireId;
            }
            checkAddPeople(element.peopleList, { id: npcComponent.id,type:npcComponent.getPlayerType(), camp: npcComponent.GetCamp(), targetId: targetModel.id });
            // console.log(npcComponent.npcName + " npc 加入正在进行中的战斗 ", element);
          }
  
          if (!cPlayer) {
            if (targetModel.fireId == -1) {
              targetModel.fireId = element.fireId;
            }
            checkAddPeople(element.peopleList, { id: targetModel.id,type:targetModel.getPlayerType(), camp: targetModel.GetCamp(), targetId: npcComponent.id });
            // console.log(targetModel.GetNickName() + " npc 加入正在进行中的战斗 ", element);
          } 
          return;
        }
      }
      if (hasGroup) {
        return;
      }
      
      if(targetModel.isDead || npcComponent.isDead){
        console.error(" 新战队开启失败：双方有一方死亡 ");
        return;
      }

      let fireId = new Date().getTime();
      let npcId = npcComponent.transform.id;
      // camp 阵营数值: 1000联盟 1001部落  10000共同敌人
      fireGroup.push({
        fireId: fireId,
        peopleList: [
          { id: targetModel.id,type:targetModel.getPlayerType(), camp: targetModel.GetCamp(), targetId: npcId },
          { id: npcId,type:npcComponent.getPlayerType(), camp: npcComponent.GetCamp(), targetId: targetModel.id }]
      });
      targetModel.fireId = fireId;
      npcComponent.fireId = fireId;
      if (npcComponent.isYJNPC) {
        npcComponent.SetNpcTarget(targetModel, true, true);
      }
      if (targetModel.isYJNPC) {
        targetModel.SetNpcTarget(npcComponent, true, true);
      }


      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        for (let j = 0; j < element.peopleList.length; j++) {
          checkSameIdInPeopleList(element.peopleList[j],i); 
        } 
      }
      

      // console.error(" 新战斗：开启第 "+ (fireGroup.length)+" 场战斗 ",fireId,(fireGroup) );
      // console.log(" 开始新的战斗 ", targetModel.GetNickName() + " " + npcComponent.GetNickName(), fireGroup[fireGroup.length - 1]);
      _Global.DyncManager.SendSceneStateAll("玩家加入战斗", { playerId: targetModel.id, targetId: npcId, fireId: fireId });
      _Global.DyncManager.SendSceneState("战斗状态");
    }
    function checkSameIdInPeopleList(people,ingnorI){
      let num = 0;
      for (let i = 0; i < fireGroup.length; i++) {
        const element = fireGroup[i];
        if(i!=ingnorI){
          for (let j = 0; j < element.peopleList.length; j++) {
            const player = element.peopleList[j];
            if (player.id == people.id) {
              num++;
            }
          } 
        }
      }
      if(num>1){
        console.error(" ========= " + people.id+" 在多个战斗中 ");
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