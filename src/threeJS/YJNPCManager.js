



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
      let num = 0;
      let npcs = [];
      
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
        let npcComponent = element.GetComponent("NPC");
        if (npcComponent.GetCamp() == camp) {
          continue;
        }
        if (npcComponent.id == ingoreNpcId) {
          continue;
        }
        // 未判断npc是否在玩家前方
        let distance = centerPos.distanceTo(element.GetGroup().position);
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

    // 在一场战斗中，获取玩家前方技能有效范围内的npc
    this.CheckNpcInPlayerForward = function (vaildDistance, npcId, playerPos) {
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
    //角色离线移除角色时，如果npc以该角色为目标，则让npc查找下一个目标
    this.DelPlayer = function (id) {
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
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
        const element = npcModelList[i];
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
    this.GetAllVaildNPC = function () {
      let npcs = [];
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i].transform;
        let npcComponent = element.GetComponent("NPC");
        if(!npcComponent.isDead && element.GetActive()){
          npcs.push(element); 
        }
      }
      return npcs;
    }
    this.GetNoSameCampNPC = function (playerPos) {
      let npcs = [];
      
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
        let npcComponent = element.GetComponent("NPC");
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
    
     
    this.GetSameCampNPCInFire = function (camp) {
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营 
        if (npcComponent.GetCamp() == camp) {
          npcs.push(npcComponent); 
        }
      }
      return npcs;
    }
    this.GetNoSameCampNPCInFire = function (camp) {
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
        let npcComponent = element.GetComponent("NPC");
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
        const element = npcModelList[i];
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
      let npcModelList = this.GetAllVaildNPC();
      let dis = 10000;
      if(vaildDis){
        dis = vaildDis;
      }
      // console.log(" 所有有效npc ",npcModelList);
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
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
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
        let npcComponent = element.GetComponent("NPC");
        // 相同阵营 
        if (npcComponent.GetCamp() == camp) { 
          npcs.push(npcComponent); 
        }
      }
      return npcs;
    }



    this.GetForwardNoSameCampNPC = function (playerPos) {
      let npcs = [];
      
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
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