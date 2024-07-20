




import { RandomInt } from "/@/utils/utils";

import { socket_bilibili } from "/@/utils/socket_bilibili.js";
import * as world_configs from "/@/utils/socket_bilibili/index.js"; 

// 弹幕互动管理器
/**
 * 直播间热度：{
 *  1，每个弹幕增加1点热度、每个点赞增加一点热度
 *  2，礼物增加的热度为对应电池*10
 *  3，技能卡牌消耗热度 
 * }
 * 点赞：所有角色生命+20
 * 弹幕{ 1增加护甲 ； 2增加生命；3增加能量}
 * {
    "data": {
        "uid": 488093172,
        "uname": "一只小凋谢",
        "uface": "http://i0.hdslb.com/bfs/face/e72d3d5d9505d2d14772ca95768d17cedb8470a7.jpg",
        "gift_id": 1,
        "gift_name": "辣条",
        "gift_num": 1,
        "price": 100,
        "paid": false,
        "fans_medal_level": 0,
        "fans_medal_name": "",
        "fans_medal_wearing_status": false,
        "guard_level": 0,
        "timestamp": 1708951654,
        "anchor_info": {
            "uface": "https://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg",
            "uid": 512384170,
            "uname": "阳光万里hao"
        },
        "gift_icon": "https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png",
        "combo_gift": false,
        "combo_info": {
            "combo_base_num": 1,
            "combo_count": 0,
            "combo_id": "",
            "combo_timeout": 0
        },
        "msg_id": "f35957f1-311b-4695-a116-acfbd75b9bad",
        "room_id": 25551747
    },
    "cmd": "LIVE_OPEN_PLATFORM_SEND_GIFT"
}

 */
class ReceiveDMGift {
  constructor(ctrl) {
    let scope = this;

    let waveCount = 1;
    let propList = []; 
    this.addProp = function (element) {
      propList.push(element);
      console.log(" 初始化道具 =======", propList);
    }
    this.stopAudio = function (id) {
    }

    let mainName = "[大检察官怀特迈恩]";
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

    // 弹幕指令
    let dmCtrl = [
      { msg: "11", event: (state) => { GanerateNPC("弓箭手1", "红方", state); } },
      { msg: "12", event: (state) => { GanerateNPC("弓箭手2", "红方", state); } },
      { msg: "13", event: (state) => { GanerateNPC("弓箭手3", "红方", state); } },
      { msg: "14", event: (state) => { GanerateNPC("弓箭手4", "红方", state); } },
      { msg: "弓箭手1", event: (state) => { GanerateNPC("弓箭手1", "红方", state); } },
      { msg: "弓箭手2", event: (state) => { GanerateNPC("弓箭手2", "红方", state); } },
      { msg: "弓箭手3", event: (state) => { GanerateNPC("弓箭手3", "红方", state); } },
      { msg: "弓箭手4", event: (state) => { GanerateNPC("弓箭手4", "红方", state); } },

      { msg: "21", event: (state) => { GanerateNPC("战士1", "红方", state); } },
      { msg: "22", event: (state) => { GanerateNPC("战士2", "红方", state); } },
      { msg: "23", event: (state) => { GanerateNPC("战士3", "红方", state); } },
      { msg: "24", event: (state) => { GanerateNPC("战士4", "红方", state); } },
      { msg: "火枪手1", event: (state) => { GanerateNPC("战士1", "红方", state); } },
      { msg: "火枪手2", event: (state) => { GanerateNPC("战士2", "红方", state); } },
      { msg: "火枪手3", event: (state) => { GanerateNPC("战士3", "红方", state); } },
      { msg: "火枪手4", event: (state) => { GanerateNPC("战士4", "红方", state); } },

      { msg: "31", event: (state) => { DuplicateModelNPC("魔暴龙", state); } },
      { msg: "32", event: (state) => { DuplicateModelNPC("森林狼", state); } },
      { msg: "33", event: (state) => { DuplicateModelNPC("boss", state); } },
      { msg: "食尸鬼红", event: (state) => { DuplicateModelNPC("魔暴龙", state); } },
      { msg: "食尸鬼绿", event: (state) => { DuplicateModelNPC("森林狼", state); } },
      { msg: "憎恶", event: (state) => { DuplicateModelNPC("boss", state); } },

      { msg: "f1", event: (state) => { eventHander("快速射击", state); } },
      // { msg: "f2", event: (state) => { eventHander("连续射击", state); } },
      // { msg: "f3", event: (state) => { eventHander("多重射击", state); } },
      { msg: "快速射击", event: (state) => { eventHander("快速射击", state); } },
      // { msg: "连续射击", event: (state) => { eventHander("连续射击", state); } },
      // { msg: "多重射击", event: (state) => { eventHander("多重射击", state); } },

      { msg: "复活", event: (state) => { resetLife(state); } },
      { msg: "fh", event: (state) => { resetLife(state); } },
      { msg: "护甲", event: (state) => { eventHander("护甲", state); } },
      { msg: "hj", event: (state) => { eventHander("护甲", state); } },
      { msg: "分身", event: (state) => { eventHander("分身", state); } },
      { msg: "fs", event: (state) => { eventHander("分身", state); } },

      { msg: "快速治疗", event: (state) => { eventHander("快速治疗", state); } },
      { msg: "z", event: (state) => { eventHander("快速治疗", state); } },


      // { msg: "赞", event: (state) => { eventHander("点赞", state); } },
      // { msg: "点赞", event: (state) => { eventHander("点赞", state); } },
      // { msg: "打call", event: (state) => { state.gift_id = 31278; eventHander("礼物", state); } },
      // { msg: "辣条", event: (state) => { state.gift_id = 1; eventHander("礼物", state); } },
      // { msg: "bbt", event: (state) => { state.gift_id = 32609; eventHander("礼物", state); } },
      // { msg: "棒棒糖", event: (state) => { state.gift_id = 32609; eventHander("礼物", state); } },
      // { msg: "lt", event: (state) => { state.gift_id = 1; eventHander("礼物", state); } }, 
      // { msg: "小花花", event: (state) => { state.gift_id = 31036; eventHander("礼物", state); } },
      // { msg: "牛哇牛哇", event: (state) => { state.gift_id = 31039; eventHander("礼物", state); } },
      { msg: "sj", event: (state) => { state.gift_id = 31039; eventHander("礼物", state); } },
      { msg: "hj", event: (state) => { state.gift_id = 31036; eventHander("礼物", state); } },

      {
        msg: "b", event: (state) => {
          state.gift_id = 4; eventHander("礼物", state);
        }
      },

      {
        //冰霜新星 bsxx
        msg: "冰霜新星", event: (state) => {
          state.gift_id = 4; eventHander("礼物", state);
        }
      },

      {
        msg: "m", event: (state) => {
          state.gift_id = 5; eventHander("礼物", state);
        }
      },

      {
        //雷诺莫格莱尼 mgln
        msg: "雷诺莫格莱尼", event: (state) => {
          state.gift_id = 5; eventHander("礼物", state);
        }
      },

      {
        // 复活术 fhs
        msg: "复活术", event: (state) => {
          state.gift_id = 6; eventHander("礼物", state);
        }
      },
      {
        msg: "f", event: (state) => {
          state.gift_id = 6; eventHander("礼物", state);
        }
      },

      {
        msg: "嘲讽", event: (state) => {
          state.gift_id = 7; eventHander("礼物", state);
        }
      },
      {
        msg: "cf", event: (state) => {
          state.gift_id = 7; eventHander("礼物", state);
        }
      },

      {
        msg: "加入", event: (state) => {
          ctrl.DMevent("加入",state);
        }
      },
    ];


    // 加入弹幕角色
    function GanerateNPC(assetId, camp, state) { 
      ctrl.DMevent("加入小队角色",{assetId, camp, state}); 
    } 
    //召唤友方NPC
    function DuplicateSelfNPC(assetId) {
      ctrl.DMevent("加入友方角色",{assetId, state}); 
    }
    // 召唤敌方npc
    function DuplicateModelNPC(assetId, state) {
      ctrl.DMevent("加入敌方角色",{assetId, state}); 
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
     
    function eventHander(t, state) {

      if (t == "点赞") {
        ctrl.DMevent("加入敌方角色",{state}); 
        return;
      }

      let has = false;
      let npcComponent = null;
      for (let j = 0; j < DMPlayer.length && !has; j++) {
        const item = DMPlayer[j];
        if (state.uname == item.uname && item.state == "run") {
          npcComponent = _Global._YJNPCManager.GetNpcComponentById(item.npcId);
          if (npcComponent.isDead) {
            return;
          }
          has = true;
        }
      }
      if (t == "快速治疗") {
        scope.skill({ title: "快速治疗" }, npcComponent);
        _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("快速治疗"));
        return;
      }

      if (t == "护甲") {
        if (npcComponent != null) {
          npcComponent.Dync({ title: "加护甲", value: 200 });
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetPropertyStr("护甲", 200));
        }
        return;
      }
      if (t == "快速射击") {
        if (npcComponent != null) {
          npcComponent.Dync({ title: "加护甲", value: 50 });
        }
        return;
      }
      if (t == "连续射击") {
        _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr(t));
        npcSkill(npcComponent, GetSkill(t));
        return;
      }
      if (t == "多重射击") {
        _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr(t));
        npcSkill(npcComponent, GetSkill(t));
        return;
      }

      if (t == "礼物") {
        if (state.gift_id == 31278 || state.gift_name == "打call") {
          npcSkill(npcComponent, GetSkill("分身"));
          npcSkill(npcComponent, GetSkill("连续射击", 10000));
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("分身"));
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("连续射击"));

        }
        // 棒棒糖 升级技能
        if (state.gift_id == 32609 || state.gift_name == "棒棒糖" || state.gift_id == 31039 || state.gift_name == "牛哇牛哇") {

          for (let i = 0; i < DMPlayer.length; i++) {
            let dmplayer = DMPlayer[i];
            if (dmplayer.uname == state.uname) {
              dmplayer.skill[0].level++;
              _Global.CombatLog.DMlog(GetNameStr(state.uname) + UpSkillStr("多重射击", dmplayer.skill[0].level));
              saveDMPlayer();
            }
          }
          return;
        }

        // 牛哇牛哇
        if (state.gift_id == 31039 || state.gift_name == "牛哇牛哇") {
          npcSkill(npcComponent, GetSkill("多重射击", 10000));
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("多重射击"));
        }

        // 小花花
        if (state.gift_id == 31036 || state.gift_name == "小花花") {
          // npcSkill(npcComponent, GetSkill("连续射击", 10000));
          // _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("连续射击"));
          npcComponent.Dync({ title: "加护甲", value: 200 });
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetPropertyStr("护甲", 200));
        }
        // 辣条
        if (state.gift_id == 1) {
          // if (npcComponent != null) {
          //   npcComponent.Dync({ title: "加护甲", value: 100 });
          //   _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetPropertyStr("护甲", 100));
          // }
          let npcs = _Global._YJNPCManager.GetSameCampNPCInFire(1000);
          for (let i = 0; i < npcs.length; i++) {
            const npcComponent = npcs[i];
            npcComponent.Dync({ title: "加护甲", value: 500 });
          }
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + " 投喂辣条 " + GetNameStr("全员") + GetPropertyStr("护甲", 500));
          return;
        }

        // 冰霜新星
        if (state.gift_id == 4) {
          scope.skill({ title: "冰霜新星" }, npcComponent);
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("冰霜新星"));

        }
        if (state.gift_id == 5) {
          scope.skill({ title: "雷诺莫格莱尼" });
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetCallStr("雷诺·莫格莱尼"));
        }

        if (state.gift_id == 6) {
          scope.skill({ title: "复活术" });
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("复活术"));
        }
        //嘲讽
        if (state.gift_id == 7) {
          if (_Global.inGame && npcComponent) {
            //所有敌方攻击此目标
            let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(1000);
            if (npcs.length > 0) {
              for (let i = 0; i < npcs.length; i++) {
                npcs[i].SetNpcTargetToNoneDrict();
                npcs[i].SetNpcTarget(npcComponent, true, false);
              }
            }
          }
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("嘲讽"));

        }
        return;
      }

      if (t == "分身") {
        _Global.CombatLog.DMlog(GetNameStr(state.uname) + GetSkillStr("分身"));
        npcSkill(npcComponent, GetSkill(t));
        return;
      }

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
     
    
    function resetLife(state) {
      ctrl.resetLife(state);
    }
    function resetLifeById(modelId) {
      ctrl.resetLifeById(modelId);
    } 
   
    function init() {

      // console.log(" 初始化礼物管理器 "); 
 

      _Global.addEventListener("战斗结束", (msg) => {
      });
      _Global.addEventListener("3d加载完成", () => {
      });
      _Global.addEventListener("战斗开始", () => {

      });

      new socket_bilibili(()=>{
        ctrl.DMsocketState(true);
      },()=>{
        ctrl.DMsocketState(false);
      },(_data) => {
        let { cmd, msg, uname, uid, uface, data } = _data;
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
              if (element.msg == msg.toLowerCase()) {
                msg = msg.toLowerCase();
                element.event({ uface, uname, msg });
              } else {
                //如果发弹幕未加入到游戏，则自动发送加入
                let isPlayer = ctrl.hasPlayer(uname)
                if (!isPlayer) {
                  element.event({ uface, uname, msg: "加入" });
                }

              }
            }
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneStateAll("转发", { type: "弹幕", state: { uface, uname, msg } });
            } else {
              _Global.applyEvent("弹幕信息",{ uface, uname, msg });
            }
            break;
          case world_configs.LIVE_OPEN_PLATFORM_LIKE:
            console.log(uname, " 点赞 ");
            eventHander("点赞", { uface, uname, msg });
            //所有玩家加10点生命
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneStateAll("转发", { type: "所有人加生命", state: 200 });
            } else {
              _Global._SceneManager.ReceivePlayer({ buff: "addHealth", buffValue: 200 });
            }
            break;

          case world_configs.LIVE_OPEN_PLATFORM_SEND_GIFT:
            console.log(data, " 礼物 ");
            eventHander("礼物", data);
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

export { ReceiveDMGift };