



import * as THREE from "three";
import { GameRecord } from "/@/threeJS/common/gameRecord";
import { RandomInt } from "/@/utils/utils";

import { socket_bilibili } from "/@/utils/socket_bilibili.js";
import * as world_configs from "/@/utils/socket_bilibili/index.js";
import { GenerateEnemyNPC } from "./GenerateEnemyNPC";
import { GenerateDMNPC } from "./GenerateDMNPC";
import { ReceiveDMGift } from "./ReceiveDMGift";
import { YJGame_mainCtrl } from "../../../../threeJS/game/YJGame_mainCtrl";


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
class YJDMManager_DMrogue {
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

    let camps = ["血色十字军", "亡灵"];

    let mainName = "[大检察官怀特迈恩]";
    this.addProp = function (element) {
      propList.push(element);
      console.log(" 初始化道具 =======", propList);

    }
    this.stopAudio = function (id) {
    }

    //#region 
    //#endregion

    function skillPaticale(t, from) {
      let target = null;
      // 没有来源，则来源时大检察官怀特迈恩
      if (from) {
        target = from;
      } else {
        // target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss").GetComponent("NPC");
      }

      if (t == "冰霜新星") {
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().CopyModel("冰霜新星", (model) => {
          model.SetPos(target.GetWorldPos());
          // let nameScale = target.GetScale();
          // model.SetScale(new THREE.Vector3(nameScale, nameScale, nameScale));
          model.SetActive(true);
        });

        //冻结所有敌人
        // let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(1000);
        // 冻结20米内的敌人
        let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFireInVailDis(target.GetWorldPos(), 1000, 20);
        for (let i = 0; i < npcs.length; i++) {
          const npcComponent = npcs[i];
          npcComponent.ReceiveDamageByPlayer(null, t, {
            type: "control",
            value: 0,
            time: "",
            duration: "",
            describe: "",
            icon: ""
          });
        }
        _Global.CombatLog.log(target.GetNickName() + " 施放 【" + t + "】");
      }
      if (t == "快速治疗") {
        if (target.isFullHealth()) {
          return false;
        }
        target.Dync({ title: "加生命", value: 200 });
        return true;
      }

      return true;

    }
    //#region 施放技能
    this.skill = function (item, from) {

      // let targetCom = target.GetComponent("NPC");
      // if (targetCom.isDead) {
      //   return false;
      // }

      // console.log("执行卡牌技能", item);
      if (item.title == "冰霜新星") {
        _Global._YJAudioManager.playAudio("1709791017219/frostnova.ogg", " fire audio ");
        return skillPaticale("冰霜新星", from);
      }
      if (item.title == "快速治疗") {
        _Global._YJAudioManager.playAudio("1710906416040/flashheal_low_base.ogg", " fire audio ");
        return skillPaticale("快速治疗", from);
      }

      if (item.title == "雷诺莫格莱尼") {

        for (let i = 0; i < selfNpcList.length; i++) {
          const npcComponent = selfNpcList[i].npc;
          if (npcComponent.isDead) {
            resetLifeById(selfNpcList[i].npcId);
            _Global.CombatLog.log(mainName + " 复活 [雷诺·莫格莱尼]");

          }
          return false;
        }
        //召唤雷诺莫格莱尼
        DuplicateSelfNPC("雷诺莫格莱尼");
        _Global.CombatLog.log(mainName + " 召唤 [雷诺·莫格莱尼]");
        return true;

      }
      if (item.title == "复活术") {
        let can = false;
        for (let i = 0; i < selfNpcList.length && !can; i++) {
          const npcComponent = selfNpcList[i].npc;
          if (npcComponent.isDead) {
            _Global._YJAudioManager.playAudio("1709641816598/highinquisitorwhitemaneres01.ogg", " fire audio ");
            let npcId = selfNpcList[i].npcId;
            setTimeout(() => {
              resetLifeById(npcId);
              //播放音效
              _Global._YJAudioManager.playAudio("1709712916041/scarletcommandermograineatrest01.ogg", " fire audio ");
            }, 1000);
            can = true;
            _Global.CombatLog.log(mainName + " 复活 [雷诺·莫格莱尼]");

          }
        }
        for (let j = 0; j < DMPlayer.length && !can; j++) {
          const item = DMPlayer[j];
          if (item.state == "run") {
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(item.npcId);
            if (npcComponent.isDead) {
              _Global._YJAudioManager.playAudio("1709641816598/highinquisitorwhitemaneres01.ogg", " fire audio ");
              resetLifeById(item.npcId);
              can = true;
              _Global.CombatLog.log(mainName + " 复活 " + "[" + item.uname + "]");
            }
          }
        }
        if (can) {
          _Global._YJAudioManager.playAudio("1709791082214/resurrection.ogg", " fire audio ");
        }
        return can;

      }
      return false;

    }
    //#endregion


    this.GanerateNPC = function (assetId, camp, state) {
      _GenerateDMNPC.GanerateNPC(assetId, camp, state);
    }

    //召唤友方NPC
    this.DuplicateSelfNPC = function (assetId) {
      _GenerateDMNPC.DuplicateSelfNPC(assetId);
    }
    this.DuplicateModelNPC = function (modelId, state) {
      _GenerateEnemyNPC.DuplicateModelNPC(modelId, state);
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

    this.GetSkill = function (t, lv) {
      return GetSkill(t);
    }
    function GetSkillLevel(t, skill) {
      for (let i = 0; i < skill.length; i++) {
        const element = skill[i];
        if (element.name == t) {
          return element.level;
        }
      }
      return 1;
    }
    function GetSkill(t, lv) {
      if (t == "分身") {
        return { type: "hyperplasia", value: 1, times: new Date().getTime() };
      }
      if (t == "连续射击") {

        let count = 3;
        let strength = 15;
        if (lv) {
          if (lv == 1) { }
          if (lv >= 2) {
            count = 5; strength = 15;
          }
          if (lv >= 3) {
            count = 6; strength = 15;
          }

          // 10000表示是礼物触发
          if (lv == 10000) {
            count = 10; strength = 30;
          }
        }
        return {
          type: t,
          castTime: 2,
          skillName: t,
          target: { type: "target" },
          effect: { type: "contDamage", time: 0.2, skillName: t, value: strength }
        }
      }
      if (t == "多重射击") {
        let targetCount = 2;
        let strength = 15;
        if (lv) {

          targetCount = lv + 1;
          strength = 5 * lv;

          // 10000表示是礼物触发
          if (lv == 10000) {
            targetCount = 10; strength = 300;
          }
        }
        return {
          type: t,
          castTime: 0.2,
          skillName: t,
          vaildDis: 20,
          target: { type: "area", value: targetCount },
          effect: { type: "contDamage", time: 0.2, skillName: t, value: strength }
        };
      }
    }
    function npcSkill(npcComponent, skill) {
      if (npcComponent != null) {
        npcComponent.Dync({ title: "npc技能攻击", skill: skill });
      }
    }

    this.resetLife = function (state) {
      _GenerateDMNPC.resetLife(state);
    }
    this.resetLifeById = function (modelId) {
      resetLifeById(modelId);
    }
    function resetLifeById(modelId) {

      if (_Global.YJDync) {
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "重新生成", state: { modelId: modelId } });
      }

      let npcComponent = _Global._YJNPCManager.GetNpcComponentById(modelId);
      if (npcComponent) {
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
        //全部死亡
        console.error(" 检测到所有友方死亡 ");
        _Global.applyEvent("战斗结束", 10000);
        return null;
      }
      return targetCom;
    }


    // 每0.5秒检测一次。巡视NPC是否能发现玩家。每个玩家独立计算，计算后再做npc目标同步
    function CheckNpcLookat() {
      if (_Global.pauseGame) { return; }
      if (!_Global.inGame) {
        return;
      }

      let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(1000);
      if (npcs.length > 0) {

        // _Global.DyncManager.LoopCheckFire();
        // console.log(" 场上DM玩家数量 ：" + dmNpcList.length );
        if (dmNpcList.length == 0) {
          dmNpcList = _GenerateDMNPC.GetdmNpcList();
        }
        if (selfNpcList.length == 0) {
          selfNpcList = _GenerateDMNPC.GetselfNpcList();
        }

        for (let i = 0; i < dmNpcList.length; i++) {
          const npcComponent = dmNpcList[i].npc;

          // console.log("[" + npcComponent.npcName + "] .fireId = ", npcComponent.fireId,npcComponent.isDead,npcComponent.GetTargetModelId()," npcs[0].fireId = "+npcs[0].fireId);
          if (!npcComponent.isDead && npcComponent.fireId == -1 && npcs[0].fireId != -1) {
            _Global.DyncManager.NPCAddFireGroup(npcComponent, null);
            //并指定其目标为指定名称id的npc            
            npcComponent.SetNpcTarget(npcs[0], true, true);
          }
        }

        for (let i = 0; i < selfNpcList.length; i++) {
          const npcComponent = selfNpcList[i].npc;
          // console.log("[" + npcComponent.npcName + "] .fireId = ", npcComponent.fireId,npcComponent.GetTargetModelId()
          // ," npcs[0].fireId = "+npcs[0].fireId);
          if (!npcComponent.isDead && npcComponent.fireId == -1 && npcs[0].fireId != -1) {
            let b = _Global.DyncManager.NPCAddFireGroup(npcComponent, null);
            if (b) {
              //并指定其目标为指定名称id的npc            
              npcComponent.SetNpcTarget(npcs[0], true, true);
            }
          }
        }

        // let redboss = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
        // let npcComponent = redboss.GetComponent("NPC");
        // // console.log(" redboss.fireId = ",targetCom.fireId);
        // if (!npcComponent.isDead && npcComponent.fireId == -1 && npcs[0].fireId != -1) {
        //   if (_Global.DyncManager.NPCAddFireGroup(npcComponent, null)) {
        //     //并指定其目标为指定名称id的npc            
        //     npcComponent.SetNpcTarget(npcs[0], true, true);
        //   }
        // }

        // let gjs = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("弓箭手1");
        // // let gjs = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("战士");
        // let gjsCom = (gjs.GetComponent("NPC"));
        // gjsCom.canMove = false;
        // if (!gjsCom.isDead && gjsCom.fireId == -1 && npcs[0].fireId != -1) {
        //   if (_Global.DyncManager.NPCAddFireGroup(gjsCom, npcs[0].id)) {
        //     //并指定其目标为指定名称id的npc            
        //     gjsCom.SetNpcTarget(npcs[0], true, true);
        //   } 
        // }

      }

      // for (let i = 0; i < dmNpcList.length; i++) {
      //   const npcComponent = dmNpcList[i].npc;
      //   npcComponent.CheckNextTarget();
      // }
      // for (let i = 0; i < selfNpcList.length; i++) {
      //   const npcComponent = selfNpcList[i].npc;
      //   npcComponent.CheckNextTarget();
      // }
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
    // 主控玩家自动攻击
    function autoFire() {
      setInterval(() => {
        if (_Global.YJ3D.YJController.isInDead()) {
          return;
        }
        if (_Global.pauseGame) { return; }
        if (!_Global.inGame) {
          if (_Global._YJPlayerFireCtrl.GetTarget()) {
            _Global._YJPlayerFireCtrl.SetInteractiveNPC(null);
          }
          return;
        }

        fire();
      }, 500);
    }

    this.DMPlayerDamageStatistics = function (damageStatistics) {
      return _GameRecord.DMPlayerDamageStatistics(damageStatistics, DMPlayer);
    }
    let _GameRecord = null;
    let gameLevel = 1;

    function init() {


      console.error(" in DMRogue");
      _Global.DMManager = scope;
      posRefList = _Global.YJ3D._YJSceneManager.GetPosRefList();
      setInterval(() => {
        CheckNpcLookat();
      }, 500);

      _GenerateEnemyNPC = new GenerateEnemyNPC((npcComponent) => {

        let targetCom = GetEnemyTarget();
        if (targetCom == null) {
          return;
        }
        if (_Global.DyncManager.CheckHasFire()) {
          _Global.DyncManager.NPCAddFireGroup(npcComponent, targetCom.id);
        } else {
          _Global.DyncManager.NPCAddFire(npcComponent, targetCom);
        }
        //并指定其目标为指定名称id的npc
        npcComponent.SetNpcTarget(targetCom, true, true);
      },()=>{
        if(_GameRecord){
          _GameRecord.addKill();
        }
      });

      _GenerateDMNPC = new GenerateDMNPC(dmVue);
      new ReceiveDMGift(scope);
      _Global.LogFireById = ((npcId) => {
        _Global._YJNPCManager.GetNpcComponentById(npcId).LogFire();
      })


      _Global._YJPlayerFireCtrl.GetEquip().initWeapon({ assetId: 1692787200597 }, () => {
        _Global._YJPlayerFireCtrl.SetPlayerState("normal");
      });
      _Global._YJPlayerFireCtrl.SetState('canMoveAttack', true);
 
      autoFire();
      _GameRecord = new GameRecord();

      new YJGame_mainCtrl();
      // _Global.LogFireById(1711340121297)

      _Global.addEventListener("战斗结束", (msg) => {

        if (msg) {
          if (msg == 10000) {
            // gameLevel = 1;
          } else {
            if (!_Global.createCompleted) {
              return;
            }
            gameLevel++;
          }
        }

        if (msg == 1000) {
          // 人类获胜
          // let redboss = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
          // let redbossNpc = redboss.GetComponent("NPC");
          // if (!redbossNpc.isDead) {
          //   redbossNpc.Dync({ title: "加生命", value: 200 });
          // }
          // redbossNpc.fireOff();
          if (DMPlayer.length == 0) {
            DMPlayer = _GenerateDMNPC.GetDMPlayer();
          }
          // 消耗热度先治疗其他弹幕玩家
          for (let i = DMPlayer.length - 1; i >= 0; i--) {
            const element = DMPlayer[i];
            if (element.state == "run") {
              let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
              if (!element.isDead) {
                npcComponent.Dync({ title: "加生命", value: 200 });
              }
            }
          }
        }


        _GameRecord.resetKill();


        for (let i = DMPlayer.length - 1; i >= 0; i--) {
          const element = DMPlayer[i];
          if (element.state == "run") {
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
            npcComponent.fireOff();
          }
        }

        setTimeout(() => {
          // 如果弹幕玩家死亡，则重新生成弹幕玩家
          for (let i = DMPlayer.length - 1; i >= 0; i--) {
            const element = DMPlayer[i];
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);

            if (element.state == "run") {
              npcComponent.fireId = -1;
              if (element.isDead) {
                resetLifeById(element.npcId);
              }
            }
            if (element.isDead) {
              element.health = element.maxHealth;
              element.isDead = false;
            }

            let skills = element.skill;
            if (skills) {
              for (let k = 0; k < skills.length; k++) {
                const skill = skills[k];
                let { name, CD, cCD, unLockLevel, level } = skill;
                skill.perCD = 0;
                cCD = CD;
                // 还原CD显示
                dmVue.changeDMPlayerSkillCD(element.npcId, k, cCD);
              }
            }
          }
          // 主角色死亡也重新生成 
          // resetLifeById("redboss");

        }, 10000);

      });



      _Global.addEventListener("3d加载完成", () => {

        // target.GetComponent("NPC").addEventListener("死亡", () => {
        //   //主播角色死亡，立即结束战斗
        //   _Global.createCompleted = true;
        //   _Global.inGame = false;
        //   _Global.applyEvent("战斗结束",10000);
        // });
        // target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("弓箭手1");
        // target.GetComponent("NPC").canMove = false;

      });


      _Global.addEventListener("战斗开始", () => {
        _Global.createCompleted = false;
        _GenerateEnemyNPC.gameLevelFire(gameLevel);
      });
    }

    init();
  }
}

export { YJDMManager_DMrogue };