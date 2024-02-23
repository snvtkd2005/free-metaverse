



import * as THREE from "three";


import { YJAnimModel } from "./components/YJAnimModel";
import { YJBillboard } from "./model/YJBillboard";
import { YJHotPoint } from "./YJHotPoint";
import { YJ3DAudio } from "./YJ3DAudio";
import { YJLight } from "./YJLight";
import { YJUVanim } from "./YJUVanim";
import { YJUVanim2 } from "./YJUVanim2";
import { YJNPC } from "./YJNPC";
import { YJPathfindingCtrl } from "./pathfinding/YJPathfindingCtrl.js";


class YJNPCManager {
  constructor() {
    let scope = this;
    let npcModelList = [];
    let _YJPathfindingCtrl = null;
    function Init() {
      // if (_YJPathfindingCtrl == null) {
      //   _YJPathfindingCtrl = new YJPathfindingCtrl(scene, _this.GetPublicUrl(), () => { });
      // }

      npcModelList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetAllTransformByModelType("NPC模型");

    }
    this.GetNpcByPlayerForwardInArea = function (vaildDistance, max, playerPos) {
      let num = 0;
      let npcs = [];
      
      let npcModelList = this.GetAllVaildNPC();
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
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
        if(!npcComponent.isDead && npcComponent.transform.modelData.active){
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
    
    this.GetNoSameCampNPCInFire = function (camp) {
      let npcs = [];
      let npcModelList = this.GetAllVaildNPC();
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

    this.DestoryById = function (npcId) {
      let has = false;
      for (let i = npcModelList.length - 1; i >= 0 && !has; i--) {
        if (npcModelList[i].id == npcId) {
          npcModelList[i].transform.Destroy();
          npcModelList.splice(i, 1);
          has = true;
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
    Init();

  }
}

export { YJNPCManager };