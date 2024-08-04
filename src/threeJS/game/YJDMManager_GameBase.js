



import * as THREE from "three";
import { GameRecord } from "/@/threeJS/game/gameRecord";
import { RandomInt } from "/@/utils/utils";
 
import { GenerateEnemyNPC } from "./GenerateEnemyNPC";
import { GenerateDMNPC } from "./GenerateDMNPC";
import { ReceiveDMGift } from "./ReceiveDMGift";
import { YJGame_mainCtrl } from "./YJGame_mainCtrl";


/**
// 游戏逻辑
魔兽塔防挡住敌人5波攻击
每波攻击敌人越来越多，技能越来越厉害

玩家加入游戏后，可以释放技能、增加生命、增加护甲、增加武器、提升等级
角色技能：
速射
连射
多射

1/5波敌人
3个小怪，无技能

 */
class YJDMManager_GameBase {
  constructor(dmVue) {
    let scope = this;

    let waveCount = 1;
    let propList = [];
    let _GenerateEnemyNPC = null;
    let _GenerateDMNPC = null;

    let DMPlayer = [];

    let dmNpcList = []; //弹幕npc
    let selfNpcList = []; //自身召唤npc
    let posRefList = []; //敌方npc生成位置 
 
    let mainName = "[大检察官怀特迈恩]";
    this.addProp = function (element) {
      propList.push(element);
      console.log(" 初始化道具 =======", propList);

    }
    this.stopAudio = function (id) {
    }

    //#region 
    //#endregion 

    this.GetEnemyNPCManager  = function(){
      return _GenerateEnemyNPC;
    }
    this.GetDMNPCManager  = function(){
      return _GenerateDMNPC;
    }
    //召唤友方NPC
    this.DuplicateSelfNPC = function (assetId) {
      _GenerateDMNPC.DuplicateSelfNPC(assetId);
    }
    this.DuplicateModelNPC = function (modelId, state) {
      _GenerateEnemyNPC.DuplicateModelNPC(modelId, state);
    }

    let assetIdList = ["战士4", "弓箭手4", "战士3", "弓箭手3", "战士2", "弓箭手2", "战士1", "弓箭手1"];
    let posIdList = ["24", "14", "23", "13", "22", "12", "21", "11"];
    let camps = ["血色十字军", "亡灵"];
    this.DMevent = function(e,msg){

      if(e=="加入"){
        let dm = msg;
        let random = RandomInt(0, 1);
        let camp = "血色十字军";
        // let camp = random ? "血色十字军" : "亡灵";
        random = RandomInt(0, 1);
        let assetId = "";
        // if (DMPlayer.length >= 8) {
        //   camp = "亡灵";
        // }
        // console.log(state.uname + "加入 ", camp);
        _Global.CombatLog.DMlog(GetNameStr(dm.uname) + " 加入 " + camp);

        if (camp == "亡灵") {
          _GenerateEnemyNPC.DuplicateModelNPC("", dm); 
          return;
        } else {
          assetId = assetIdList[RandomInt(0, assetIdList.length - 1)];
          for (let j = 0; j < assetIdList.length; j++) {
            const _assetId = assetIdList[j];
            let has = scope.hasAssetId(_assetId);
            if (!has) {
              assetId = _assetId;
            }
          }
        }
        _GenerateDMNPC.GanerateNPC(assetId, camp, dm); 
        return;
      }

      if(e=="加入敌方角色"){
        let {assetId, state} = msg;
        _GenerateEnemyNPC.DuplicateModelNPC(assetId, state);
        return;
      }
      if(e=="加入友方角色"){
        let {assetId, state} = msg;
        _GenerateDMNPC.DuplicateSelfNPC(assetId, state);
        return;
      }
      
      if(e=="加入小队角色"){
        let {assetId, camp, state} = msg;
        _GenerateDMNPC.GanerateNPC(assetId, camp, state);
        return;
      }
    }



    this.GanerateNPC = function (assetId, camp, state) {
      _GenerateDMNPC.GanerateNPC(assetId, camp, state);
    }

    function GetNameStr(name) {
      return "[" + name + "]";
    }
    function GetSkillStr(s) {
      return " 施放 " + "【" + s + "】";
    }
    function UpSkillStr(s, v) {
      return " 升级 " + "【" + s + "】到 " + v;
    }
    function GetCallStr(s) {
      return " 召唤 " + "【" + s + "】";
    }
    function GetPropertyStr(s, v) {
      return " 加 " + "【" + s + "】" + v;
    }
    this.resetLife = function (state) {
      _GenerateDMNPC.resetLife(state);
    }
    this.resetLifeById = function (modelId) {
      resetLifeById(modelId);
    }
    function resetLifeById(modelId) {
      // console.log(" 如果弹幕玩家死亡，则重新生成弹幕玩家 11 ",modelId);

      if (_Global.YJDync) {
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "重新生成", state: { modelId: modelId } });
      }

      let npcComponent = _Global._YJNPCManager.GetNpcComponentById(modelId);
      if (npcComponent) {
      // console.log(" 如果弹幕玩家死亡，则重新生成弹幕玩家 22 ",modelId);

        if (npcComponent.isDead) {
          npcComponent.Dync({ title: "重新生成" });
        }
        return;
      }
      // let redboss = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(modelId);
      // redboss.ResetPosRota();
      // let npc = redboss.GetComponent("NPC");
      // if (npc.isDead) {
      //   npc.Dync({ title: "重新生成" });
      // }
    }


    // 设置敌人的目标为随机友方角色
    function GetEnemyTarget() {
      if (dmNpcList.length == 0) {
        dmNpcList = _GenerateDMNPC.GetdmNpcList();
      }
      if (selfNpcList.length == 0) {
        selfNpcList = _GenerateDMNPC.GetselfNpcList();
      }

      let targetCom = null;
      let hasSelfNpc = false;
      for (let i = 0; i < selfNpcList.length; i++) {
        const npcComponent = selfNpcList[i].npc;
        if (!npcComponent.isDead) {
          targetCom = npcComponent;
          hasSelfNpc = true;
        }
      }
      if (hasSelfNpc) {

      } else {
        let a = [];
        for (let i = 0; i < dmNpcList.length; i++) {
          const npcComponent = dmNpcList[i].npc;
          if (!npcComponent.isDead) {
            a.push(i);
          }
        }
        if (a.length > 0) {
          targetCom = dmNpcList[a[RandomInt(0, a.length - 1)]].npc;
        }
      }
      if (targetCom == null || targetCom.isDead) {

        if(!_Global.YJ3D.YJController.isInDead()){
          targetCom = _Global.YJ3D.YJPlayer;
          return targetCom;
        }
        //全部死亡
        console.error(" 检测到所有友方死亡 ");
        _Global.applyEvent("战斗结束", 10000);
        _Global._YJFireManager.ClearFire();
        return null;
      }
      return targetCom;
    }


    // 每0.5秒检测一次。巡视NPC是否能发现玩家。每个玩家独立计算，计算后再做npc目标同步
    function CheckNpcLookat() {
       
    }

    this.DMsocketState = function(b){
      if(b){
        //
        dmVue.inDMGame = true;
        _GenerateDMNPC.hiddenProjectionUI(true);
      }else{
        //隐藏加入dm的按钮
        hiddenDM();
      }
    }
    function hiddenDM(){
      dmVue.inDMGame = false;
      _GenerateDMNPC.hiddenProjectionUI(false);
    }


    function fire() {
      let fromPos = _Global.YJ3D.YJController.GetPlayerWorldPos();

      // 查找最近的敌人
      let npc = _Global._YJNPCManager.GetNoSameCampNPCInFireByNearestDis(fromPos, _Global.user.camp, 30);
      if (npc == null) {
        return;
      }
      let npcTransform = npc.transform;
      if (npcTransform) {
        _Global._YJPlayerFireCtrl.SetInteractiveNPC(npcTransform);
      } else {
        // _Global._YJPlayerFireCtrl.shootTargetPos(tagetPos.clone(), "time");
      }
      return;
    } 
    this.DMPlayerDamageStatistics = function (damageStatistics) {
      return _GameRecord.DMPlayerDamageStatistics(damageStatistics, DMPlayer);
    }
    this.hasPlayer = function(uname){
      if (DMPlayer.length == 0) {
        DMPlayer = _GenerateDMNPC.GetDMPlayer();
      }
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.uname == uname) {
          return true;
        }
      }
      return false;
    }

    this.hasAssetId = function(assetId){
      if (DMPlayer.length == 0) {
        DMPlayer = _GenerateDMNPC.GetDMPlayer();
      }
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.assetId == assetId) {
          return true;
        }
      }
      return false;
    }
    


    let _GameRecord = null;
    let gameLevel = 1;


    // 敌人的目标。从友方角色中随机选择一个角色作为敌方的目标
    let enemyNpcTarget = null;
    let enemyCount = 0;
    function init() {


      console.log(" in GameBase");
      _Global.DMManager = scope;
      posRefList = _Global.YJ3D._YJSceneManager.GetPosRefList();
      setInterval(() => {
        if (_Global.pauseGame) { return; }
        if (!_Global.inGame) {
          return;
        }

        CheckNpcLookat();
      }, 500);
      setInterval(() => {
        if (_Global.pauseGame) { return; }
        if (!_Global.inGame) {
          return;
        }
        GetEnemyTarget();
      }, 2000);
      _GameRecord = new GameRecord();
      let _YJGame_mainCtrl = new YJGame_mainCtrl();

      let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(1000);
      for (let i = 0; i < npcs.length; i++) {
        const npc = npcs[i];

        npc.addEventListener("死亡",(id,fireId,damageFromData)=>{
          for (let i = 0; i < damageFromData.length; i++) {
            const element = damageFromData[i];
            if(element.fromId == _Global.user.id){
              // 根据伤害百分比来分配经验值
              console.log("获得经验 ", npc.GetExp(),element.per,npc.GetExp() * element.per);

              _GameRecord.addKill( npc.GetExp() * element.per );
              _YJGame_mainCtrl.createGold(npc.GetWorldPos().clone());
              _Global.applyEvent("杀死npc",npc.GetNickName());
            }
          }
          // 从一场战斗中移除npc
          _Global._YJFireManager.RemoveNPCFireId(id,fireId);

        });
      }
      _GenerateEnemyNPC = new GenerateEnemyNPC((npcComponent) => {
 
        // if (_Global._YJFireManager.CheckHasFire()) {
        //   _Global._YJFireManager.NPCAddFireGroup(npcComponent, enemyNpcTarget.id);
        // } else {
        //   _Global._YJFireManager.NPCAddFire(npcComponent, enemyNpcTarget);
        // }
        // //并指定其目标为指定名称id的npc
        // npcComponent.SetNpcTarget(enemyNpcTarget, true, true);
        enemyCount++;
        // console.log(" 敌人数量 "+ enemyCount);
      },(npc,id,fireId,damageFromData)=>{
 
        for (let i = 0; i < damageFromData.length; i++) {
          const element = damageFromData[i];
          if(element.fromId == _Global.user.id){
            // 根据伤害百分比来分配经验值
            _GameRecord.addKill( npc.GetExp() * element.per );
            _YJGame_mainCtrl.createGold(npc.GetWorldPos().clone());
            _Global.applyEvent("杀死npc",npc.GetNickName());
          }
        }
        // 从一场战斗中移除npc
        _Global._YJFireManager.RemoveNPCFireId(id,fireId);
        enemyCount--; 
        // console.log(" 敌人数量 "+enemyCount);
      });

      _GenerateDMNPC = new GenerateDMNPC(dmVue);

      let _ReceiveDMGift = new ReceiveDMGift(scope);
      
      _Global.addEventListener("连接弹幕服务器", (liveAnchorCodeId) => { 
        _ReceiveDMGift.init(liveAnchorCodeId,()=>{
          _Global.applyEvent("连接弹幕服务器成功");
          scope.DMsocketState(true);
        },(code)=>{
          scope.DMsocketState(false); 
          _Global.applyEvent("连接弹幕服务器失败", code);
        });
      });

      _Global.LogFireById = ((npcId) => {
        _Global._YJNPCManager.GetNpcComponentById(npcId).LogFire();
      })


      // 给角色装备武器
      _Global._YJPlayerFireCtrl.GetEquip().initWeapon({ assetId: 1692787200597 }, () => {
        _Global._YJPlayerFireCtrl.SetPlayerState("normal");
        //增加射击技能，触发攻击
        // _Global._YJPlayerFireCtrl.GetEquip().addEquip({ assetId: 1709558796473 });
        // _Global._YJPlayerFireCtrl.GetEquip().addEquip({ assetId: 1709594878614 });
      });
      _Global._YJPlayerFireCtrl.SetState('canMoveAttack', true);
  

      // _Global.LogFireById(1711340121297)

      _Global.addEventListener("战斗结束", (msg) => {
 
      });

      _Global.addEventListener("3d加载完成", () => { 

      });

      _Global.addEventListener("战斗开始", () => {
        enemyCount = 0;
        _Global.createCompleted = false;
        _Global.inGame = true; 
      });
    }

    init();
  }
}

export { YJDMManager_GameBase };