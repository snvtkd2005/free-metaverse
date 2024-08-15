



import * as THREE from "three";

class YJNPCManager {
  constructor() {
    let scope = this;
    let npcModelList = [];
    
    function Init() {
      _Global._YJNPCManager = scope;
      npcModelList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetAllTransformByModelType("NPC模型");

    }
    this.GetNPCs = function(){
      return npcModelList;
    }
    this.GetOtherNoSameCampInArea = function (camp,vaildDistance, max, centerPos, ingoreNpcId) {
      let npcs = [];
      if(max<=0){
        max = 100000;
      }
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        if (npcComponent.GetCamp() == camp || npcComponent.GetCamp() == 10001) {
          continue;
        }
        if (npcComponent.id == ingoreNpcId) {
          continue;
        }
        // 未判断npc是否在玩家前方
        let distance = centerPos.distanceTo(npcComponent.GetWorldPos());
        if (distance <= vaildDistance) {
          npcs.push({distance:distance,npc:npcComponent});
        }
      }
      if(npcs.length<=max){
        max = npcs.length;
      }else{
        npcs.sort((a, b) => a.distance - b.distance);
      }
      //取距离最近的 
      let nnpcs = [];
      for (let i = 0; i < max; i++) {
        nnpcs.push(npcs[i].npc);
      } 
      return nnpcs;
    }

    // 在一场战斗中，获取玩家前方技能有效范围内的npc
    this.CheckNpcInPlayerForward = function (vaildDistance, npcId, playerPos) {
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i];
        if (npcComponent.id == npcId) {
          // 未判断npc是否在玩家前方
          let distance = playerPos.distanceTo(npcComponent.GetWorldPos());
          if (distance <= vaildDistance) {
            return npcComponent;
          }
        }
      }
      return null;
    }
    //角色离线移除角色时，如果npc以该角色为目标，则让npc查找下一个目标
    this.DelPlayer = function (id) {
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        if (npcComponent.GetTargetModelId() == id) {
          npcComponent.CheckNextTarget();
        }
      }
    }
    // 添加增生的npc
    this.AddNpc = function (npcTransform) {
      // console.log("增加npc ", npcTransform.id);
      npcModelList.push({ id: npcTransform.id, transform: npcTransform });
    }
    this.GetNpcTransformById = function (npcId) {
      let npcTransform = null;
      let has = false;
      for (let i = npcModelList.length - 1; i >= 0 && !has; i--) {
        if (npcModelList[i].id == npcId) {
          npcTransform = npcModelList[i].transform;
          has = true;
        }
      }
      return npcTransform;
    }
    this.GetNpcComponentById = function (npcId) {
      let npcComponent = null;
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        if (element.id == npcId) {
          npcComponent = element.GetComponent("NPC");
        }
      }
      return npcComponent;
    }
    // 设置npc1附近的npc共同攻击npc1的目标
    this.GetNearNPC = function (npcComponent1) {
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 相同阵营的返回
        if (npcComponent != npcComponent1 && npcComponent.GetCamp() == npcComponent1.GetCamp()) {
          if (npcComponent.isCanSetTarget()) {
            let distance = npcComponent1.GetWorldPos().distanceTo(npcComponent.GetWorldPos());
            // console.log("查找到附近npc ", npcComponent.npcName,distance);
            if (distance <= 12) {
              npcs.push(npcComponent); 
            }
          }
        }
      }
      return npcs;
    }
    this.GetNearSameCampNPCByNPC = function (fromNpc, dis,max) {
      let num = 0;
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 相同阵营的返回
        if (npcComponent != fromNpc && npcComponent.GetCamp() == fromNpc.GetCamp()) {
          let distance = fromNpc.GetWorldPos().distanceTo(npcComponent.GetWorldPos());
          // console.log("查找到附近npc ", npcComponent.npcName,distance);
          if (distance <= dis) {
            if(num>=max){
              return npcs;
            }
            npcs.push(npcComponent); 
            num++;
          }
        }
      }
      return npcs;
    }
    this.GetAllVaildNPC = function () {
      let npcs = [];
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        if(!npcComponent.isDead && element.GetActive()){
          npcs.push(npcComponent); 
        }
      }
      return npcs;
    }
    this.GetNoSameCampNPC = function (playerPos) {
      let npcs = [];
      
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 相同阵营的不计算
        if (npcComponent.GetCamp() == _Global.user.camp) {
          continue;
        }
        if (npcComponent.isCanSetTarget()) {
          let npcPos = element.GetWorldPos();
          let distance = playerPos.distanceTo(npcPos); 
          if (distance <= 12) {
            npcs.push(npcComponent); 
          }
        }
      }
      return npcs;
    }
    this.GetNearDirect = function (id,centerPos) {
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 忽略自身
        if (npcComponent.id == id) {
          continue;
        }
        if (npcComponent.isCanSetTarget()) {
          let npcPos = npcComponent.GetWorldPos();
          let distance = centerPos.distanceTo(npcPos); 
          if (distance <= 12) {
            npcs.push(npcComponent); 
          }
        }
      }
      return npcs;
    }
     
    // 获取同阵营的友方
    this.GetSameCamp = function (camp) { 
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 相同阵营 
        if (npcComponent.GetCamp() == camp) {
          npcs.push(npcComponent); 
        }
      }
      return npcs; 
    }
    // 获取同战斗中的同阵营的友方
    this.GetSameCampInFire = function (camp,fireId) {
      let npcs = [];
      let npcModelList = this.GetSameCamp(camp);
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 相同战斗组
        if (npcComponent.fireId == fireId) {
          npcs.push(npcComponent); 
        }
      }
      return npcs;
    }
    this.GetNoSameCampNPCInFire = function (camp,fireId) {
      _Global._YJFireManager.GetNoSameCampInFire(camp,fireId);
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 不相同阵营 
        if (npcComponent.GetCamp() == camp) {
          continue;
        }
        npcs.push(npcComponent); 
      }
      return npcs;
    }
    // 有效距离内的所有
    this.GetNoSameCampNPCInFireInVailDis = function (fromPos,camp,dis) {
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 不相同阵营 
        if (npcComponent.GetCamp() == camp) {
          continue;
        }
        let npcPos = npcComponent.GetWorldPos();
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
      let npcModelList = this.GetAllVaildNPC();
      let dis = 10000;
      if(vaildDis){
        dis = vaildDis;
      }
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 不相同阵营 
        if (npcComponent.GetCamp() == camp || npcComponent.GetCamp() == 10002) {
          continue;
        }
        let npcPos = npcComponent.GetWorldPos();
        let distance = fromPos.distanceTo(npcPos); 
        if (distance <= dis) {
          dis = distance;
          npc = (npcComponent); 
        }
      }
      return npc;
    } 
    function radomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
    this.GetNoSameCamp = function (camp,fireId) { 
      return scope.GetNoSameCampNPCInFire(camp,fireId);
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
        players = _Global._YJNPCManager.GetSameCampInFire(camp);
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
      
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const npcComponent = npcModelList[i]; 
        // 相同阵营的不计算
        if (npcComponent.GetCamp() == _Global.user.camp) {
          continue;
        }
        if (npcComponent.isCanSetTarget()) {
          let npcPos = npcComponent.GetWorldPos();
          let distance = playerPos.distanceTo(npcPos); 
          let b = _Global.YJ3D._YJSceneManager.checkPlayerForward(npcPos);
          // console.log(" 前方npc是否可用tab选择 ",distance,b);
          if (distance <= 40 && b) {
            npcs.push(npcComponent.transform); 
          }
        }
      }
      return npcs;
    }

    this.DestroyNpc = function (id) {
      // console.log("移除npc ", id);
      for (let i = npcModelList.length - 1; i >= 0; i--) {
        if (npcModelList[i].id == id) {
          let transform = npcModelList[i].transform;
          let npc = transform.GetComponent("NPC");
          npc.SetNpcTargetToNone(); 
          transform.Destroy();
          npcModelList.splice(i,1);
          return;
        }
      }
    }
    this.RemoveNpcById = function (npcId) { 
      for (let i = npcModelList.length -1; i >=0; i--) {
        const element = npcModelList[i].transform;
        if (element.id == npcId) {
          element.Destroy();
          npcModelList.splice(i,1);
          return;
        }
      } 
    }
    this.HiddenNpcById = function (npcId) { 
      for (let i = npcModelList.length -1; i >=0; i--) {
        const element = npcModelList[i].transform;
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
      for (let i = npcModelList.length - 1; i >= 0; i--) {
        if (npcModelList[i].id == npcId) {
          npcModelList[i].transform.Destroy();
          npcModelList.splice(i, 1);
          return;
        }
      }
    }
    this.EventHandler = function (data) {
      let { type, state } = data;
      if (type == "玩家脱离战斗") {
        let has = false;
        for (let i = npcModelList.length - 1; i >= 0 && !has; i--) {
          if (npcModelList[i].id == state) {
            npcModelList[i].transform.GetComponent("NPC").Dync({ title: "脱离战斗" });
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

export { YJNPCManager };