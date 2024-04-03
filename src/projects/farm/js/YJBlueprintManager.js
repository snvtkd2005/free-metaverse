



import * as THREE from "three";
import { RandomInt } from "../../../utils/utils";

import { socket_bilibili } from "/@/utils/socket_bilibili.js";
import * as world_configs from "/@/utils/socket_bilibili/index.js";

// 蓝图管理器
/**
 *  
 */
class YJBlueprintManager {
  constructor(indexVue, _SceneDyncManager, _SceneManager) {
    let scope = this;
    let propList = [];
    this.addProp = function (element) {
      propList.push(element);
      console.log(" 初始化道具 =======", propList);

    }
    this.stopAudio = function (id) {
    }
    let dmCtrl = [ 
      {
        msg: "1", event: (state) => {
          GanerateNPC("弓箭手", "红方", state);
        }
      },
      {
        msg: "弓箭手", event: (state) => {
          GanerateNPC("弓箭手", "红方", state);
        }
      }, 
      {
        msg: "2", event: (state) => {
          GanerateNPC("战士", "红方", state);
        }
      },
      {
        msg: "战士", event: (state) => {
          GanerateNPC("战士", "红方", state);
        }
      }, 
      // {
      //   msg: "复活", event: (state) => {
      //     resetLife(state);
      //   }
      // }, 
      {
        msg: "护甲", event: (state) => {
          eventHander("护甲",state);
        }
      },
      {
        msg: "赞", event: (state) => {
          eventHander("点赞",state);
        }
      },
      
      {
        msg: "分身", event: (state) => {
          eventHander("分身",state);
        }
      },
      {
        msg: "加入", event: (state) => {
          let random = RandomInt(0,1);
          let camp =  "红方";
          random = RandomInt(0,1);
          let assetId = "";
          if(camp == "蓝方"){
            assetId = random?"魔暴龙":"森林狼";
          }else{
            assetId = random?"战士":"弓箭手";
          }
          GanerateNPC(assetId, camp, state);
        }
      },
    ];
    function eventHander(t,state){
      
      if(t=="点赞"){
        let npcs = _Global._YJNPCManager.GetSameCampNPCInFire(1000);
        for (let i = 0; i < npcs.length; i++) {
          const npcComponent = npcs[i];
          npcComponent.Dync({title:"加生命",value:50});
        }
        return;
      }
 
      let has = false;
      let npcComponent = null;
      for (let j = 0; j < DMPlayer.length && !has; j++) {
        const item = DMPlayer[j];
        if(state.uname == item.uname){ 
          npcComponent = _Global._YJNPCManager.GetNpcComponentById(item.npcId);
          has = true;
        }
      }

      if(t=="护甲"){
        if(npcComponent!=null){
          npcComponent.Dync({title:"加护甲",value:50}); 
        }
        return;
      }
      
      if(t=="礼物"){
        // 小花花
        if(state.gift_id == 31036){
          if(npcComponent!=null){
            npcComponent.Dync({title:"npc技能攻击",skill:{type:"hyperplasia",value:1,times:new Date().getTime()}}); 
          }
        } 
        // 辣条
        if(state.gift_id == 1){
          if(npcComponent!=null){
            npcComponent.Dync({title:"加护甲",value:50}); 
          }
        }
        
        // 牛哇牛哇
        if(state.gift_id == 31039){
          resetLife(state); 
        }
        
        return;
      }

      if(t=="分身"){
        if(npcComponent!=null){
          npcComponent.Dync({title:"npc技能攻击",skill:{type:"hyperplasia",value:1,times:new Date().getTime()}}); 
        }
        return;
      }
      
    }
    this.DMPlayerDamageStatistics = function(damageStatistics){
      for (let i = damageStatistics.length-1; i >= 0; i--) {
        const item = damageStatistics[i];
        let has = false;
        for (let j = 0; j < DMPlayer.length && !has; j++) {
          const item2 = DMPlayer[j];
          if(item.from == item2.uname){
            item.header = item2.uface;
            item.camp = item2.camp;
            has = true;
          }
        }
        if(!has){
          damageStatistics.splice(i,1);
        }
      }
      return damageStatistics;
    }
    let DMPlayer = [];
    this.ChangeDMNPCDead= function(npcId){
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if(element.npcId == npcId){ 
          element.isDead = true;
          return;
        }
      }
    }
    function resetLife(state){
      let {  uname } = state;
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if(element.uname == uname){
          if(element.isDead){
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
            npcComponent.Dync({title:"重新生成"});
            element.isDead = false;
            CheckNpcTarget(npcComponent);
          }
          return;
        }
      }
    }
    function CheckNpcTarget(npcComponent){
      if (_Global.inGame) {
        let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(npcComponent.GetCamp());
        if(npcs.length>0){
          npcComponent.SetNpcTarget(npcs[0], true, true);
        }
      }
    }
    function GanerateNPC(assetId, camp, state) {
      let { uface, uname, msg } = state;
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if(element.uname == uname){
          if(element.isDead){
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
            npcComponent.Dync({title:"重新生成"});
            element.isDead = false;
            CheckNpcTarget(npcComponent);
          }
          return;
        }
      }
      
      let npcId =  new Date().getTime();
      DMPlayer.push({uname:uname,uface:uface,camp:camp,npcId:npcId,isDead:false});

      let yjtransform = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(assetId);
      let target = null;
      if (camp == "红方") {
        target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("boss");
      }
      if (camp == "蓝方") {
        target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
      }
      let modelData = JSON.parse(JSON.stringify(yjtransform.modelData));
      modelData.name = uname;
      modelData.message.data.name = uname;
      console.log("弹幕", state);
      modelData.active = true;
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().DuplicateModelNPC(modelData, (copy) => {


        // 测试显示指定名称id的NPC
        copy.SetActive(true);
        let npc = copy.GetComponent("NPC");
        npc.CreateHeader(uface);
        npc.addEventListener("死亡",()=>{
          scope.ChangeDMNPCDead(npcId);
        });
        if (npc.isDead) {
          npc.Dync({ title: "重新生成" });
        }
        _Global.DyncManager.AddNpc(copy);

        console.log(" 战斗状态 ", _Global.inGame);
        if (_Global.inGame) {
          let npcComponent = copy.GetComponent("NPC");
          _Global.DyncManager.NPCAddFireGroup(npcComponent, target ? target.id : null);
          //并指定其目标为指定名称id的npc
          copy.GetComponent("NPC").SetNpcTarget(target.GetComponent("NPC"), true, true);
        }

      },npcId);
    }
    function init() {
      if( !_Global.setting.DMGame){
        return;
      }  

      _Global.DMManager = scope;
      
      _Global.addEventListener("战斗结束", () => {
        setTimeout(() => {
          
        for (let i = DMPlayer.length-1; i >=0; i--) {
          const element = DMPlayer[i];
          if(element.isDead){ 
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
            npcComponent.Dync({title:"重新生成"});
            element.isDead = false; 
          }
        }
        let redboss = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
        let npc = redboss.GetComponent("NPC"); 
        if (npc.isDead) {
          npc.Dync({ title: "重新生成" });
        }

        }, 10000);
      });
      new socket_bilibili((data) => {
        let { cmd, msg, uname, uid, uface } = data;
        switch (cmd) {
          case world_configs.LIVE_OPEN_PLATFORM_DM:
            console.log(uname, " 发送弹幕 ", msg);
            // if(msg==1 ||msg==2||msg==3||msg==4||msg==5 ){
            //   let i = msg-1;
            //   if (_Global.YJDync) {
            //     _SceneDyncManager.SendModel({ id: propList[i].id, modelType: "交互模型", state: { type: "add", value:  propList[i].buffValue } });
            //   } else {
            //     _SceneManager.ReceivePlayer( propList[i]);
            //   }
            //   // return;
            // } 

            for (let i = 0; i < dmCtrl.length; i++) {
              const element = dmCtrl[i];
              if (element.msg == msg) {
                element.event({ uface, uname, msg });
              }
            }
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneStateAll("转发", { type: "弹幕", state: { uface, uname, msg } });
            } else {
              indexVue.$refs.HUD.$refs.DMPanel.receiveMsg({ uface, uname, msg });
            }
            break;
          case world_configs.LIVE_OPEN_PLATFORM_LIKE:
            console.log(uname, " 点赞 ");
            eventHander("点赞");
            //所有玩家加10点生命
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneStateAll("转发", { type: "所有人加生命", state: 200 });
            } else {
              _SceneManager.ReceivePlayer({ buff: "addHealth", buffValue: 200 });
            }
            break;
            
          case world_configs.LIVE_OPEN_PLATFORM_SEND_GIFT:
            console.log(data, " 礼物 ");
            eventHander("礼物",data);
            break; 
          default:
            console.log(data);
            break;
        }
      });

    }

    init();
  }
}

export { YJBlueprintManager };