



import * as THREE from "three";


import * as world_configs from "/@/utils/socket_bilibili/index.js"; 
 
/**
 * 
 * 生成弹幕NPC
 */
class GenerateDMNPC {
  constructor(dmVue) {
    let scope = this;
 
    //#region 
    //#endregion

    let assetIdList = ["战士4", "弓箭手4", "战士3", "弓箭手3", "战士2", "弓箭手2", "战士1", "弓箭手1"];
    let posIdList = ["24", "14", "23", "13", "22", "12", "21", "11"];
    let camps = ["血色十字军", "亡灵"];

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
    
    

    this.ChangeDMNPCDead = function (npcId) {
      let assetId = "";
      let oldDMPlayer = null;
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.npcId == npcId) {
          oldDMPlayer = element;
          element.isDead = true;
          assetId = element.assetId;
        }
      }
      if (DMPlayer.length > 8) {
        // 把相同站位的角色派入场
        for (let i = 0; i < DMPlayer.length; i++) {
          const element = DMPlayer[i];
          if (element.npcId != npcId && !element.isDead && element.state == "waite" && element.assetId == assetId) {
            for (let j = dmNpcList.length - 1; j >= 0; j--) {
              if (dmNpcList[j].npcId == npcId) {
                dmNpcList.splice(j, 1);
              }
            }
            oldDMPlayer.state = "waite";
            _Global._YJNPCManager.DestroyNpc(npcId);
            setTimeout(() => {
              GanerateNPCFn(element);
            }, 500);
            return;
          }
        }
      }


    }
    this.resetLife = function(state) {
      let { uname } = state;
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.uname == uname) {

          if (element.isDead) {
            if (element.state == "run") {
              resetLifeById(element.npcId);
            } else {
              element.health = element.maxHealth;
            }

            _Global.CombatLog.DMlog(GetNameStr(state.uname) + (" 复活 "));
            element.isDead = false;

          }
          return;
        }
      }
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
    this.GanerateNPC = function(assetId, camp, state) {
      let { uface, uname, msg } = state;
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.uname == uname) {
          // console.log("有角色",element);
          if (element.state == "waite") {
            if (element.assetId != assetId) {
              element.assetId = assetId;
              for (let j = 0; j < assetIdList.length; j++) {
                if (element.assetId == assetIdList[j]) {
                  let posId = posIdList[j];
                  element.posId = posId;
                  saveDMPlayer();
                }
              }
            }
            return;
          }

          if (_Global.inGame && element.isDead) {
            resetLifeById(element.npcId);
            element.isDead = false;
            return;
          }

          //换角色
          if (!_Global.inGame) {
            for (let j = 0; j < assetIdList.length; j++) {
              const _assetId = assetIdList[j];
              let has = false;
              for (let i = 0; i < DMPlayer.length; i++) {
                const element = DMPlayer[i];
                if (element.assetId == _assetId) {
                  has = true;
                }
              }
              if (!has) {
                if (element.assetId != assetId && assetId == _assetId) {
                  for (let i = dmNpcList.length - 1; i >= 0; i--) {
                    if (dmNpcList[i].npcId == element.npcId) {
                      dmNpcList.splice(i, 1);
                    }
                  }
                  for (let j = 0; j < assetIdList.length; j++) {
                    if (element.assetId == assetIdList[j]) {
                      let posId = posIdList[j];
                      _Global.YJ3D._YJSceneManager.DisplayProjectionUI(posId, true);
                    }
                  }

                  _Global._YJNPCManager.DestroyNpc(element.npcId);
                  element.assetId = assetId;
                  GanerateNPCFn(element);
                  return;
                }
              }
            }
          }
          return;
        }

        // 加入，如果重复，则使用未被使用的角色
        if (element.assetId == assetId) {
          for (let j = 0; j < assetIdList.length; j++) {
            const _assetId = assetIdList[j];
            let has = false;
            for (let i = 0; i < DMPlayer.length; i++) {
              const element = DMPlayer[i];
              if (element.assetId == _assetId) {
                has = true;
              }
            }
            if (!has) {
              assetId = _assetId;
            } else {
              // return; //最多8人，不允许加入候补
            }
          }
        }
      }

      let npcId = uname;
      // let npcId = new Date().getTime();
      let dmplayer = {
        level: 1,
        uname: uname,
        uface: uface,
        assetId: assetId,
        camp: camp == '红方' ? camps[0] : camp,
        npcId: npcId,
        isDead: false,
        health: 300,
        maxHealth: 300,
        currentExp: 0,
        needExp: 200,
        strength: 20,
        skill: [],
        state: "waite",
      }
      DMPlayer.push(dmplayer);
      console.log("弹幕", state);
      if (DMPlayer.length > 8) {
        saveDMPlayer();
        return;
      }
      GanerateNPCFn(dmplayer);
    }

    function saveDMPlayer() {
      localStorage.setItem("DMPlayer", JSON.stringify(DMPlayer));
    }
    // 生成弹幕玩家
    function GanerateNPCFn(dmPlayer) {
      for (let j = 0; j < assetIdList.length; j++) {
        if (dmPlayer.assetId == assetIdList[j]) {
          let posId = posIdList[j];
          dmPlayer.posId = posId;
          _Global.YJ3D._YJSceneManager.DisplayProjectionUI(posId);
        }
      }
      dmPlayer.state = "run";
      saveDMPlayer();

      let { uname, uface, assetId, camp, npcId, isDead } = dmPlayer;
      let yjtransform = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(assetId);
      let target = null;
      if (camp == "红方") {
        target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("boss");
      }
      if (camp == "蓝方") {
        target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
        // target.GetComponent("NPC").canMove = false;
      }

      if (_Global.YJDync) {
        _Global._YJDyncManager.SendSceneState("添加", { id: npcId, modelType: "NPC模型", state: { modelId: assetId, npcId: npcId, dmData: { uname, uface } } });
      }

      let modelData = JSON.parse(JSON.stringify(yjtransform.modelData));
      modelData.name = uname;
      modelData.message.data.name = uname;
      modelData.active = true;
      modelData.id = npcId;
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().DuplicateModelNPC(modelData, (copy) => {

        // 测试显示指定名称id的NPC
        copy.SetActive(true);
        let npc = copy.GetComponent("NPC");
        // npc.canMove = false;
        npc.deadedHidden = false;
        npc.canLevelUp = true;

        dmNpcList.push({ npcId, npc });
        npc.SetLevelData(dmPlayer);
        npc.CreateHeader(uface);



        npc.addEventListener("死亡", () => {
          scope.ChangeDMNPCDead(npcId); 
          dmVue.forceUpdate();
        });
        npc.addEventListener("healthChange", (health, maxHealth) => {
          // console.log(" in healthChange ",health, maxHealth);
          dmPlayer.health = health;
          dmPlayer.maxHealth = maxHealth;
        });

        npc.addEventListener("经验值变化", (currentExp, needExp) => {
          dmPlayer.currentExp = currentExp;
          dmPlayer.needExp = needExp;
          saveDMPlayer();

        });
        npc.addEventListener("等级提升", (lv, strength) => {
          dmPlayer.level = lv;
          dmPlayer.strength = strength;
          _Global.CombatLog.DMlog(npc.GetNickName() + " 等级提升到 " + "[ " + lv + " ]");
          _Global._YJAudioManager.playAudio("1710913742348/levelup.ogg", " level up audio ");
          saveDMPlayer();
          let npcSkills = npc.GetSkillList();
          if (npcSkills) {
            return;
          } 
        });

        if (_Global.inGame) { 
        }
        let npcSkills = npc.GetSkillList();
        // console.log(" npcSkills ",npcSkills);
        if (npcSkills.length > 0) {
          let skills = dmPlayer.skill;
          for (let i = skills.length - 1; i >= 0; i--) {
            skills.splice(i, 1);
          }
          for (let i = 0; i < npcSkills.length; i++) {
            const skill = npcSkills[i];
            let cSkill = {};
            cSkill.name = skill.skillName;
            cSkill.unLockLevel = 1;
            cSkill.level = 1;
            cSkill.icon = skill.icon;
            if (skill.trigger.type == "perSecond") {
              cSkill.CD = skill.trigger.value;
              // cSkill.CD = skill.CD;
              cSkill.cCD = cSkill.CD;
            }
            skills.push(cSkill);
          }
          npc.addEventListener("技能CD", (skillName, cCD,CD) => {
            for (let i = 0; i < skills.length; i++) {
              const skill = skills[i];
              if (skill.name == skillName) {
                dmVue.changeDMPlayerSkillCD(npcId, i, cCD,CD);
              }
            }
          });
        } else { 

        }
        _Global._YJNPCManager.AddNpc(copy);

        // console.log(" 战斗状态 ", _Global.inGame);
        // if (_Global.inGame) {
        //   let npcComponent = copy.GetComponent("NPC");
        //   _Global.DyncManager.NPCAddFireGroup(npcComponent, target ? target.id : null);
        //   //并指定其目标为指定名称id的npc
        //   copy.GetComponent("NPC").SetNpcTarget(target.GetComponent("NPC"), true, true);
        // }

      }, npcId);
    }
    let dmNpcList = []; //弹幕npc
    this.GetdmNpcList = function(){
      return dmNpcList;
    }
    let selfNpcList = []; //自身召唤npc

    this.GetselfNpcList = function(){
      return selfNpcList;
    }
    
    let DMPlayer = [];
    
    this.GetDMPlayer = function(){
      return DMPlayer;
    }

    let posRefList = []; //敌方npc生成位置


    let intervalList = []; //敌方npc生成位置

    //召唤友方NPC
    this.DuplicateSelfNPC = function(assetId) {
      let npcId = assetId + new Date().getTime();
      if (_Global.YJDync) {
        _Global._YJDyncManager.SendSceneState("添加", { id: npcId, modelType: "NPC模型", state: { modelId: assetId, npcId: npcId } });
      }
      _Global._YJNPCManager.DuplicateNPC(assetId, npcId, (copy) => {
        // 测试显示指定名称id的NPC
        copy.SetActive(true);
        let npc = copy.GetComponent("NPC");
        selfNpcList.push({ npcId, npc });
        npc.addEventListener("死亡", () => {
        });
        _Global._YJNPCManager.AddNpc(copy);
        if (_Global.inGame) {
          //所有敌方攻击此目标
          let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(1000);
          if (npcs.length > 0) {
            for (let i = 0; i < npcs.length; i++) {
              npcs[i].SetNpcTargetToNoneDrict();
              npcs[i].SetNpcTarget(npc, true, false);
            }
          }
        }
      });
    }
    function init() {
 

      // console.error(" in Generate DM NPC"); 
      posRefList = _Global.YJ3D._YJSceneManager.GetPosRefList();
   
      // _Global.LogFireById(1711340121297)

      _Global.addEventListener("战斗结束", (msg) => {
        // 清除玩家技能施放
        for (let i = intervalList.length - 1; i >= 0; i--) {
          const element = intervalList[i];
          clearInterval(element.fn);
          intervalList.slice(i, 1);
        }

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

        let s = localStorage.getItem("DMPlayer");
        if (s) {
          // console.log(s);
          DMPlayer = JSON.parse(s);
        }
        let nosame = [];
        for (let i = world_configs.dmplayer.length - 1; i >= 0; i--) {
          let has = false;
          for (let j = 0; j < DMPlayer.length && !has; j++) {
            if (DMPlayer[j].uname == world_configs.dmplayer[i].uname) {
              DMPlayer[j].assetId = world_configs.dmplayer[i].assetId;
              DMPlayer[j].skill[0].level = world_configs.dmplayer[i].skill[0].level;
              has = true;
            }
          }
          if (!has) {
            nosame.push(world_configs.dmplayer[i]);
          }
        }
        for (let i = 0; i < nosame.length; i++) {
          DMPlayer.push(nosame[i]);
        }


        for (let i = 12; i >= 0; i--) {
          DMPlayer.splice(DMPlayer.length - i, 1);
        }

        for (let i = DMPlayer.length - 1; i >= 0; i--) {
          let dmplayer = DMPlayer[i];
          // if (dmplayer.uname.includes("阳光万里")) {
          //   DMPlayer.splice(i, 1);
          //   continue;
          // }

          if (dmplayer.uname.includes("阳光万里")) {
            dmplayer.skill[0].level = 2;
          }
          // if (dmplayer.uname.includes("你好莎莎")) {
          //   dmplayer.skill[0].level = 2;
          // }
          // if (dmplayer.uname.includes("Choo")) {
          //   dmplayer.skill[0].level = 1;
          // }
          // if(dmplayer.uname.includes("王元一局")){
          //   for (let i = 0; i < dmplayer.skill.length; i++) {
          //     const element = dmplayer.skill[i];
          //     if(element.level == 1){
          //       element.level = 2 
          //     }
          //   }
          // }

          if (dmplayer.posId == undefined) {
            for (let j = 0; j < assetIdList.length; j++) {
              if (dmplayer.assetId == assetIdList[j]) {
                let posId = posIdList[j];
                dmplayer.posId = posId;
              }
            }
          }

          dmplayer.health = dmplayer.maxHealth;
          dmplayer.isDead = false;
          dmplayer.state = "waite";
          if (dmplayer.skill == undefined || dmplayer.skill.length == 0) {
            dmplayer.skill = []; 
          } else {
            for (let i = 0; i < dmplayer.skill.length; i++) {
              const element = dmplayer.skill[i];
              element.perCD = 0; 
            }
          }
        }

        let count = DMPlayer.length;
        if (count > 8) { count = 8; }
        let hasAssetId = [];
        //最多上场8人
        for (let i = 0; i < count; i++) {
          let dmplayer = DMPlayer[i];

          dmplayer.level = dmplayer.level ?? 1;

          dmplayer.health = dmplayer.health ?? 300;
          dmplayer.maxHealth = dmplayer.maxHealth ?? 300;
          dmplayer.currentExp = dmplayer.currentExp ?? 0;
          dmplayer.needExp = dmplayer.needExp ?? 200;
          dmplayer.strength = dmplayer.strength ?? 20;

          if (dmplayer.level > 50 || dmplayer.level == 1) {
            dmplayer.level = 1;
            dmplayer.health = 300;
            dmplayer.maxHealth = 300;
            dmplayer.currentExp = 0;
            dmplayer.needExp = 200;
            dmplayer.strength = 20;
          }

          // dmplayer.level = 1;
          // dmplayer.health = 300;
          // dmplayer.maxHealth = 300;
          // dmplayer.currentExp = 0;
          // dmplayer.needExp = 200;
          // dmplayer.strength = 20;

          dmplayer.health = dmplayer.maxHealth;
          dmplayer.npcId = dmplayer.uname;


          let has = false;
          for (let j = 0; j < hasAssetId.length && !has; j++) {
            if (dmplayer.assetId == hasAssetId[j]) {
              has = true;
            }
          }
          if (has) {
            for (let j = 0; j < assetIdList.length; j++) {
              const a = assetIdList[j];
              let hhas = false;
              for (let k = 0; k < hasAssetId.length && !hhas; k++) {
                const b = hasAssetId[k];
                if (a == b) {
                  hhas = true;
                }
              }
              if (!hhas) {
                dmplayer.assetId = a;
              }
            }
          } else {
          }
          hasAssetId.push(dmplayer.assetId);
          GanerateNPCFn(dmplayer);
        }
        dmVue.setDMPlayer(DMPlayer);

      });

    }

    init();
  }
}

export { GenerateDMNPC };