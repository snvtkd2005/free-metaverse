



import * as THREE from "three";
// 玩家管理
class YJPlayerManager {
  constructor() {
    let scope = this;
    let playerList = [];
    
    function Init() {
      _Global._YJPlayerManager = scope;
      if (!_Global.YJClient) {
        playerList.push(_Global.YJ3D.YJPlayer); 
      }else{
        playerList = _Global.YJClient.GetAllPlayer();
      }
      console.log(" 所有玩家 ",playerList);

    }

    this.GetAllVaildPlayer = function () {
      let playerList = [];
      if (!_Global.YJClient) {
        playerList.push(_Global.YJ3D.YJPlayer); 
      }else{
        playerList = _Global.YJClient.GetAllPlayer();
      }

      let npcs = [];
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i]; 
        if(!element.isDead){
          npcs.push(element); 
        }
      }
      return npcs;
    }
    this.GetPlayerById = function (playerId) {
      if (!_Global.YJClient) {
        return _Global.YJ3D.YJPlayer;
      }
      return _Global.YJClient.GetPlayerById(playerId)
    }


    this.GetNPCs = function(){
      return playerList;
    }
    this.GetOtherNoSameCampInArea = function (camp,vaildDistance, max, centerPos, ingoreNpcId) {
      let num = 0;
      let npcs = [];
      
      let playerList = this.GetAllVaildPlayer();

      // console.log(" 范围查找玩家 ",camp,vaildDistance, max,playerList);
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        if (element.GetCamp() == camp) {
          console.log(" 范围查找玩家 跳过同阵营玩家 ");
          continue;
        }
        if (element.id == ingoreNpcId) {
          // console.log(" 范围查找玩家 忽略指定玩家 ");
          continue;
        }
        // 未判断npc是否在玩家前方
        let distance = centerPos.distanceTo(element.GetWorldPos());

        console.log(" 范围查找玩家 ",distance,element);
        // console.log(" 范围查找玩家 ",distance,vaildDistance);

        if (distance <= vaildDistance) {
          num++;
          npcs.push(element);
          if (num >= max) {
            return npcs;
          }
        }
      }
      return npcs;
    }

    // 在一场战斗中，获取玩家前方技能有效范围内的npc
    this.CheckNpcInPlayerForward = function (vaildDistance, npcId, playerPos) {
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i].transform;
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
    //角色离线移除角色时，如果npc以该角色为目标，则让npc查找下一个目标
    this.DelPlayer = function (id) {
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        if (npcComponent.GetTargetModelId() == id) {
          npcComponent.CheckNextTarget();
        }
      }
    }
    // 添加增生的npc
    this.AddNpc = function (npcTransform) {
      // console.log("增加npc ", npcTransform.id);
      playerList.push({ id: npcTransform.id, transform: npcTransform });
    }
    this.GetNpcTransformById = function (npcId) {
      let npcTransform = null;
      let has = false;
      for (let i = playerList.length - 1; i >= 0 && !has; i--) {
        if (playerList[i].id == npcId) {
          npcTransform = playerList[i].transform;
          has = true;
        }
      }
      return npcTransform;
    }
    this.GetNpcComponentById = function (npcId) {
      let npcComponent = null;
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i].transform;
        if (element.id == npcId) {
          npcComponent = element.GetComponent("NPC");
        }
      }
      return npcComponent;
    }
    // 设置npc1附近的npc共同攻击npc1的目标
    this.GetNearNPC = function (npcComponent1) {
      let npcs = [];
      let playerList = this.GetAllVaildPlayer();
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营的返回
        if (npcComponent != npcComponent1 && npcComponent.GetCamp() == npcComponent1.GetCamp()) {
          if (npcComponent.isCanSetTarget()) {
            let distance = npcComponent1.transform.GetGroup().position.distanceTo(element.GetGroup().position);
            // console.log("查找到附近npc ", npcComponent.npcName,distance);
            if (distance <= 12) {
              npcs.push(npcComponent); 
            }
          }
        }
      }
      return npcs;
    } 
     
    this.GetSameCampNPCInFire = function (camp) {
      let npcs = [];
      let playerList = this.GetAllVaildPlayer();
      // console.log(" 所有有效npc ",playerList);
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营 
        if (npcComponent.GetCamp() == camp) {
          npcs.push(npcComponent); 
        }
      }
      return npcs;
    } 
    // 有效距离内的所有
    this.GetNoSameCampNPCInFireInVailDis = function (fromPos,camp,dis) {
      let npcs = [];
      let playerList = this.GetAllVaildPlayer();
      // console.log(" 所有有效npc ",playerList);
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        let npcComponent = element.GetComponent("NPC");
        // 不相同阵营 
        if (npcComponent.GetCamp() == camp) {
          continue;
        }
        let npcPos = element.GetWorldPos();
        let distance = fromPos.distanceTo(npcPos); 
        if (distance <= dis) {
          npcs.push(npcComponent); 
        } 
      }
      return npcs;
    }
    //获取最近的单个目标
    this.GetNoSameCampNPCInFireByNearestDis = function (fromPos,camp,vaildDis) {
      let npc = null;
      let playerList = this.GetAllVaildPlayer();
      let dis = 10000;
      if(vaildDis){
        dis = vaildDis;
      }
      // console.log(" 所有有效npc ",playerList);
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        let npcComponent = element.GetComponent("NPC");
        // 不相同阵营 
        if (npcComponent.GetCamp() == camp) {
          continue;
        }
        let npcPos = element.GetWorldPos();
        let distance = fromPos.distanceTo(npcPos); 
        if (distance <= dis) {
          dis = distance;
          npc = (npcComponent); 
        }
      }
      return npc;
    }
    this.GetSameCampNPCInFire = function (camp) {
      let npcs = [];
      let playerList = this.GetAllVaildPlayer();
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营 
        if (npcComponent.GetCamp() == camp) { 
          npcs.push(npcComponent); 
        }
      }
      return npcs;
    }

    function radomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
    this.GetSameCamp = function (camp) {
      let playerList = this.GetAllVaildPlayer();
      let players = []; 
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        if(element.GetCamp() == camp){
          players.push(element);
        }
      }
      return players;
    }
    
    this.GetNoSameCamp = function (camp,fireId) { 
      let playerList = this.GetAllVaildPlayer();
      let players = []; 
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        if(element.GetCamp() != camp){
          if(fireId){
            if(element.fireId == fireId){
              players.push(element);
            }
          }else{
            players.push(element);
          }
        }
      }
      return players;
    }


    this.GetSameCampByRandom = function (camp) {
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
        players = _Global._YJNPCManager.GetSameCampNPCInFire(camp);
        if (players.length > 0) {
          player = players[radomNum(0, players.length - 1)];
          id = player.transform.id;
        }
      } else {
        players = _Global.YJClient.GetAllPlayer();
        id = player.id
      }
      return {
        playerId: id,
        player: player,
      }
    }


    this.GetForwardNoSameCampNPC = function (playerPos) {
      let npcs = [];
      
      let playerList = this.GetAllVaildPlayer();
      for (let i = 0; i < playerList.length; i++) {
        const element = playerList[i];
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营的不计算
        if (npcComponent.GetCamp() == _Global.user.camp) {
          continue;
        }
        if (npcComponent.isCanSetTarget()) {
          let npcPos = element.GetWorldPos();
          let distance = playerPos.distanceTo(npcPos); 
          if (distance <= 20 && _Global.YJ3D._YJSceneManager.checkPlayerForward(npcPos)) {
            npcs.push(npcComponent.transform); 
          }
        }
      }
      return npcs;
    }

    this.DestroyNpc = function (id) {
      // console.log("移除npc ", id);
      for (let i = playerList.length - 1; i >= 0; i--) {
        if (playerList[i].id == id) {
          let transform = playerList[i].transform;
          let npc = transform.GetComponent("NPC");
          npc.SetNpcTargetToNone(); 
          transform.Destroy();
          playerList.splice(i,1);
          return;
        }
      }
    }
    this.RemoveNpcById = function (npcId) { 
      for (let i = playerList.length -1; i >=0; i--) {
        const element = playerList[i].transform;
        if (element.id == npcId) {
          element.Destroy();
          playerList.splice(i,1);
          return;
        }
      } 
    }
    this.HiddenNpcById = function (npcId) { 
      for (let i = playerList.length -1; i >=0; i--) {
        const element = playerList[i].transform;
        if (element.id == npcId) {
          let npc = element.GetComponent("NPC");
          if(!npc.isDead){
            npc.SetNpcTargetToNone(); 
          } 
          element.SetActive(false);
          return;
        }
      } 
    }
    this.DestoryById = function (npcId) {
      for (let i = playerList.length - 1; i >= 0; i--) {
        if (playerList[i].id == npcId) {
          playerList[i].transform.Destroy();
          playerList.splice(i, 1);
          return;
        }
      }
    }
    this.EventHandler = function (data) {
      let { type, state } = data;
      if (type == "玩家脱离战斗") {
        let has = false;
        for (let i = playerList.length - 1; i >= 0 && !has; i--) {
          if (playerList[i].id == state) {
            playerList[i].transform.GetComponent("NPC").Dync({ title: "脱离战斗" });
            has = true;
          }
        }
        return;
      }
    }

    //#region 
    //#endregion
    
    //#region 同步生成npc
    this.DuplicateNPC = function(modelId,npcId,cb) {
      let npcTransform = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(modelId);
      if(npcTransform == null){
        console.error("不该进入此判断：", modelId + " 不存在");
        return;
      }
      let modelData = JSON.parse(JSON.stringify(npcTransform.modelData));
      modelData.active = true;
      modelData.id = npcId;
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().DuplicateModelNPC(modelData, (copy) => {
        // 测试显示指定名称id的NPC
        copy.SetActive(true);  
        scope.AddNpc(copy);
        if(cb){
          cb(copy);
        }
      }, npcId);
    }

    this.DuplicateNPCByModelData = function(modelData,npcId,cb) {
      modelData.id = npcId;
      modelData.active = true;
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().DuplicateModelNPC(modelData, (copy) => {
        // 测试显示指定名称id的NPC
        copy.SetActive(true);  
        scope.AddNpc(copy);
        if(cb){
          cb(copy);
        }
      }, npcId);
    }
    //#endregion

    Init();

  }
}

export { YJPlayerManager };