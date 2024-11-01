


 
import { GameRecord } from "/@/threeJS/game/gameRecord";
import { RandomInt } from "/@/utils/utils";

// import { socket_bilibili } from "/@/utils/socket_bilibili.js";
// import * as world_configs from "/@/utils/socket_bilibili/index.js";
import { GenerateEnemyNPC } from "./GenerateEnemyNPC";
import { GenerateDMNPC } from "./GenerateDMNPC";


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

    let assetIdList = ["战士4", "弓箭手4", "战士3", "弓箭手3", "战士2", "弓箭手2", "战士1", "弓箭手1"];
    let posIdList = ["24", "14", "23", "13", "22", "12", "21", "11"];
    let camps = ["血色十字军", "亡灵"];
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
          if (dmVue.heatValue >= 20) {
            dmVue.heatValue -= 20;
          }
          state.gift_id = 4; eventHander("礼物", state);
        }
      },

      {
        //冰霜新星 bsxx
        msg: "冰霜新星", event: (state) => {
          if (dmVue.heatValue >= 20) {
            dmVue.heatValue -= 20;
          }
          state.gift_id = 4; eventHander("礼物", state);
        }
      },

      {
        msg: "m", event: (state) => {
          if (dmVue.heatValue >= 50) {
            dmVue.heatValue -= 50;
          }
          state.gift_id = 5; eventHander("礼物", state);
        }
      },

      {
        //雷诺莫格莱尼 mgln
        msg: "雷诺莫格莱尼", event: (state) => {
          if (dmVue.heatValue >= 50) {
            dmVue.heatValue -= 50;
          }
          state.gift_id = 5; eventHander("礼物", state);
        }
      },

      {
        // 复活术 fhs
        msg: "复活术", event: (state) => {
          if (dmVue.heatValue >= 50) {
            dmVue.heatValue -= 50;
          }
          state.gift_id = 6; eventHander("礼物", state);
        }
      },
      {
        msg: "f", event: (state) => {
          if (dmVue.heatValue >= 50) {
            dmVue.heatValue -= 50;
          }
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
          let random = RandomInt(0, 1);
          let camp = "血色十字军";
          // let camp = random ? "血色十字军" : "亡灵";
          random = RandomInt(0, 1);
          let assetId = "";
          // if (DMPlayer.length >= 8) {
          //   camp = "亡灵";
          // }
          // console.log(state.uname + "加入 ", camp);
          _Global.CombatLog.DMlog(GetNameStr(state.uname) + " 加入 " + camp);

          if (camp == "亡灵") {
            _GenerateEnemyNPC.GenerateHot(["boss", "魔暴龙", "森林狼"], 1, 1, null, null, state);
            return;
          } else {
            assetId = assetIdList[RandomInt(0, assetIdList.length - 1)];
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
              }
            }
          }
          GanerateNPC(assetId, camp, state);
        }
      },
    ];
    function GanerateNPC(assetId, camp, state) { 
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
    function eventHander(t, state) {

      if (t == "点赞") {
        let npcs = _Global._YJNPCManager.GetSameCampNPCInFire(1000);
        for (let i = 0; i < npcs.length; i++) {
          const npcComponent = npcs[i];
          npcComponent.Dync({ title: "加生命", value: 200 });
        }
        _Global.CombatLog.DMlog(GetNameStr(state.uname) + " 点赞 " + GetNameStr("全员") + GetPropertyStr("生命", 200));
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
    
    let DMPlayer = [];
    
    function resetLife(state) {
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

    function saveDMPlayer() {
      localStorage.setItem("DMPlayer", JSON.stringify(DMPlayer));
    }


    let DMPlayerSkill = [
      {
        op: "",//职业
        name: "多重射击",
        icon: "1719817071530/1719818260923.png",//技能图标
        unLockLevel: 3, //解锁等级
        level: 1, //技能等级
        cCD: 6,//冷却时间
        CD: 6,//冷却时间
      }
    ];
    function GetDMPlayerSkillData() {

    }
    // 弹幕玩家对应等级获取对应技能
    function GetDMPlayerSkillByPlayerLevel(op, lv) {
      for (let i = 0; i < DMPlayerSkill.length; i++) {
        const element = DMPlayerSkill[i];
        if (element.op == op && element.unLockLevel == lv) {
          return element;
        }
      }
    }
    function GetDMPlayerSkillsByPlayerLevel(op, lv) {
      let skills = [];
      for (let i = 0; i < DMPlayerSkill.length; i++) {
        const element = DMPlayerSkill[i];
        if (element.op == op && element.unLockLevel <= lv) {
          skills.push(element);
        }
      }
      return skills;
    }

    let dmNpcList = []; //弹幕npc
    let selfNpcList = []; //自身召唤npc

    let posRefList = []; //敌方npc生成位置


    let intervalList = []; //敌方npc生成位置



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

    //召唤友方NPC
    function DuplicateSelfNPC(assetId) {
      _GenerateDMNPC.DuplicateSelfNPC(assetId); 
    }


    // 每0.5秒检测一次。巡视NPC是否能发现玩家。每个玩家独立计算，计算后再做npc目标同步
    function CheckNpcLookat() {
      if (_Global.pauseGame) { return; }
      if (!_Global.inGame) {
        return;
      }

      let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(1000);
      if (npcs.length > 0) {

        // _Global._YJFireManager.LoopCheckFire();
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
            _Global._YJFireManager.NPCAddFireGroup(npcComponent, null);
            //并指定其目标为指定名称id的npc            
            npcComponent.SetNpcTarget(npcs[0], true, true);
          }
        }

        for (let i = 0; i < selfNpcList.length; i++) {
          const npcComponent = selfNpcList[i].npc;
          // console.log("[" + npcComponent.npcName + "] .fireId = ", npcComponent.fireId,npcComponent.GetTargetModelId()
          // ," npcs[0].fireId = "+npcs[0].fireId);
          if (!npcComponent.isDead && npcComponent.fireId == -1 && npcs[0].fireId != -1) {
            let b = _Global._YJFireManager.NPCAddFireGroup(npcComponent, null);
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
        //   if (_Global._YJFireManager.NPCAddFireGroup(npcComponent, null)) {
        //     //并指定其目标为指定名称id的npc            
        //     npcComponent.SetNpcTarget(npcs[0], true, true);
        //   }
        // }

        // let gjs = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("弓箭手1");
        // // let gjs = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("战士");
        // let gjsCom = (gjs.GetComponent("NPC"));
        // gjsCom.canMove = false;
        // if (!gjsCom.isDead && gjsCom.fireId == -1 && npcs[0].fireId != -1) {
        //   if (_Global._YJFireManager.NPCAddFireGroup(gjsCom, npcs[0].id)) {
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

    function checkSkill(skillName, npc) {
      if (skillName == "多重射击") {
        const npcs = _Global._YJNPCManager.GetNoSameCampNPCInFireInVailDis(npc.GetWorldPos(), npc.GetCamp(), 20);
        if (npcs.length > 1) {
          return true;
        }
      }
      return false;
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
       return _GameRecord.DMPlayerDamageStatistics(damageStatistics,DMPlayer);
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
        if (_Global._YJFireManager.CheckHasFire()) {
          _Global._YJFireManager.NPCAddFireGroup(npcComponent, targetCom.id);
        } else {
          _Global._YJFireManager.NPCAddFire(npcComponent, targetCom);
        }
        //并指定其目标为指定名称id的npc
        npcComponent.SetNpcTarget(targetCom, true, true);
      });

      _GenerateDMNPC = new GenerateDMNPC(dmVue);

      _Global.LogFireById = ((npcId) => {
        _Global._YJNPCManager.GetNpcComponentById(npcId).LogFire();
      })

 

      _Global.addEventListener('升级', () => {

      });
      _Global.addEventListener('经验值', (c, v) => {

      });

      _Global.applyEvent('主角姓名', _Global._YJPlayerFireCtrl.GetNickName());
      _Global.applyEvent('主角头像', _Global.YJ3D.YJPlayer.GetavatarData());

      autoFire();
      _GameRecord = new GameRecord();
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
          if(DMPlayer.length == 0 ){
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
            if (element.state == "run") {
              let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
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
                dmVue.changeDMPlayerSkillCD(element.npcId, k, cCD);
              }

            }
          }
          // 主角色死亡也重新生成 
          // resetLifeById("redboss");

        }, 10000);

      });

      _Global.addEventListener("战斗开始", () => {
        _Global.createCompleted = false;
        _GenerateEnemyNPC.gameLevelFire(gameLevel);

      });

      new socket_bilibili((_data) => {
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
                let isPlayer = false;
                for (let i = 0; i < DMPlayer.length && !isPlayer; i++) {
                  const element = DMPlayer[i];
                  if (element.uname == uname) {
                    isPlayer = true;
                  }
                }
                if (!isPlayer) {
                  element.event({ uface, uname, msg: "加入" });
                }

              }
            }
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneStateAll("转发", { type: "弹幕", state: { uface, uname, msg } });
            } else {
              dmVue.receiveMsg({ uface, uname, msg });
              dmVue.addHeat(1);
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
              dmVue.addHeat(1);
            }
            break;

          case world_configs.LIVE_OPEN_PLATFORM_SEND_GIFT:
            console.log(data, " 礼物 ");
            eventHander("礼物", data);
            dmVue.heatValue += 20;
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

export { YJDMManager_DMrogue };