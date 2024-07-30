



import * as THREE from "three";
import { RandomInt } from "../../../utils/utils";

// import { socket_bilibili } from "/@/utils/socket_bilibili.js";
// import * as world_configs from "/@/utils/socket_bilibili/index.js";

// 弹幕互动管理器
/**
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
class YJDMManager_bilibili {
  constructor(indexVue, _SceneDyncManager, _SceneManager) {
    let scope = this;

    let waveCount = 1;
    let propList = [];
    this.addProp = function (element) {
      propList.push(element);
      console.log(" 初始化道具 =======", propList);

    }
    this.stopAudio = function (id) {
    }


    let dmCtrl = [
      {msg: "11", event: (state) => {GanerateNPC("弓箭手1", "红方", state);}},
      {msg: "12", event: (state) => {GanerateNPC("弓箭手2", "红方", state);}},
      {msg: "13", event: (state) => {GanerateNPC("弓箭手3", "红方", state);}},
      {msg: "弓箭手1", event: (state) => {GanerateNPC("弓箭手1", "红方", state); }},
      {msg: "弓箭手2", event: (state) => {GanerateNPC("弓箭手2", "红方", state); }},
      {msg: "弓箭手3", event: (state) => {GanerateNPC("弓箭手3", "红方", state); }},
      
      {msg: "21", event: (state) => {GanerateNPC("战士1", "红方", state);}},
      {msg: "22", event: (state) => {GanerateNPC("战士2", "红方", state);}},
      {msg: "23", event: (state) => {GanerateNPC("战士3", "红方", state);}},
      {msg: "火枪手1", event: (state) => {GanerateNPC("战士1", "红方", state); }},
      {msg: "火枪手2", event: (state) => {GanerateNPC("战士2", "红方", state); }},
      {msg: "火枪手3", event: (state) => {GanerateNPC("战士3", "红方", state); }},

      {msg: "f1", event: (state) => {eventHander("快速射击", state);}},
      {msg: "f2", event: (state) => {eventHander("连续射击", state);}},
      {msg: "f3", event: (state) => {eventHander("多重射击", state);}},

      {msg: "复活", event: (state) => { resetLife(state);}},
      {msg: "护甲", event: (state) => {eventHander("护甲", state);}},
      {msg: "赞", event: (state) => {eventHander("赞", state);}},
      {msg: "分身", event: (state) => {eventHander("分身", state);}},
      
      {
        msg: "加入", event: (state) => {
          let random = RandomInt(0, 1);
          let camp = "红方";
          random = RandomInt(0, 1);
          let assetId = "";
          if (camp == "蓝方") {
            assetId = random ? "魔暴龙" : "森林狼";
          } else {
            assetId = random ? "战士1" : "弓箭手1";
          }
          GanerateNPC(assetId, camp, state);
        }
      },
    ];
    function eventHander(t, state) {

      if (t == "点赞") {
        let npcs = _Global._YJNPCManager.GetSameCampNPCInFire(1000);
        for (let i = 0; i < npcs.length; i++) {
          const npcComponent = npcs[i];
          npcComponent.Dync({ title: "加生命", value: 50 });
        }
        return;
      }

      let has = false;
      let npcComponent = null;
      for (let j = 0; j < DMPlayer.length && !has; j++) {
        const item = DMPlayer[j];
        if (state.uname == item.uname) {
          npcComponent = _Global._YJNPCManager.GetNpcComponentById(item.npcId);
          if (npcComponent.isDead) {
            return;
          }
          has = true;
        }
      }

      if (t == "护甲") {
        if (npcComponent != null) {
          npcComponent.Dync({ title: "加护甲", value: 50 });
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
        npcSkill(npcComponent, GetSkill("连续射击"));
        return;
      }
      if (t == "多重射击") {
        npcSkill(npcComponent, GetSkill("多重射击"));
        return;
      }

      if (t == "礼物") {
        if (state.gift_id == 31278 || state.gift_name == "打call") {
          npcSkill(npcComponent, GetSkill("分身"));
          npcSkill(npcComponent, GetSkill("连续射击"));
        }
        // 小花花
        if (state.gift_id == 31036) {
          npcSkill(npcComponent, GetSkill("连续射击"));
        }
        // 辣条
        if (state.gift_id == 1) {
          if (npcComponent != null) {
            npcComponent.Dync({ title: "加护甲", value: 100 });
          }
        }

        // 牛哇牛哇
        if (state.gift_id == 31039) {
          npcSkill(npcComponent, GetSkill("多重射击"));
          // resetLife(state);
        }

        return;
      }

      if (t == "分身") {
        npcSkill(npcComponent, GetSkill(t));
        return;
      }

    }
    function GetSkill(t) {
      if (t == "分身") {
        return { type: "hyperplasia", value: 1, times: new Date().getTime() };
      }
      if (t == "连续射击") {
        return {
          type: t,
          castTime: 2,
          skillName: t,
          target: { type: "target" },
          effect: { type: "contDamage", time: 0.2, skillName: t, value: 20 }
        }
      }
      if (t == "多重射击") {
        return {
          type: t,
          castTime: 2,
          skillName: t,
          target: { type: "area", value: 3 },
          effect: { type: "contDamage", time: 0.2, skillName: t, value: 20 }
        };
      }
    }
    function npcSkill(npcComponent, skill) {
      if (npcComponent != null) {
        npcComponent.Dync({ title: "npc技能攻击", skill: skill });
      }
    }
    this.DMPlayerDamageStatistics = function (damageStatistics) {
      for (let i = damageStatistics.length - 1; i >= 0; i--) {
        const item = damageStatistics[i];
        let has = false;
        for (let j = 0; j < DMPlayer.length && !has; j++) {
          const item2 = DMPlayer[j];
          if (item.from == item2.uname) {
            item.header = item2.uface;
            item.camp = item2.camp;
            has = true;
          }
        }
        if (!has) {
          damageStatistics.splice(i, 1);
        }
      }
      return damageStatistics;
    }
    let DMPlayer = [];
    this.ChangeDMNPCDead = function (npcId) {
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.npcId == npcId) {
          element.isDead = true;
          return;
        }
      }
    }
    function resetLife(state) {
      let { uname } = state;
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.uname == uname) {
          if (element.isDead) {
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
            npcComponent.Dync({ title: "重新生成" });
            element.isDead = false;
            CheckNpcTarget(npcComponent);
          }
          return;
        }
      }
    }
    function CheckNpcTarget(npcComponent) {
      if (_Global.inGame) {
        let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(npcComponent.GetCamp());
        if (npcs.length > 0) {
          npcComponent.SetNpcTarget(npcs[0], true, true);
        }
      }
    }
    function GanerateNPC(assetId, camp, state) {
      let { uface, uname, msg } = state;
      for (let i = 0; i < DMPlayer.length; i++) {
        const element = DMPlayer[i];
        if (element.uname == uname) {
          if (element.isDead) {
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
            npcComponent.Dync({ title: "重新生成" });
            element.isDead = false;
            CheckNpcTarget(npcComponent);
          }
          return;
        }
      }

      let npcId = new Date().getTime();
      DMPlayer.push({ uname: uname, uface: uface, camp: camp, npcId: npcId, isDead: false });

      let yjtransform = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(assetId);
      let target = null;
      if (camp == "红方") {
        target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("boss");
      }
      if (camp == "蓝方") {
        target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
        target.GetComponent("NPC").canMove = false;
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
        npc.canMove = false;
        dmNpcList.push(npc);

        npc.CreateHeader(uface);
        npc.addEventListener("死亡", () => {
          scope.ChangeDMNPCDead(npcId);
        });
        _Global.DyncManager.AddNpc(copy);

        // console.log(" 战斗状态 ", _Global.inGame);
        // if (_Global.inGame) {
        //   let npcComponent = copy.GetComponent("NPC");
        //   _Global.DyncManager.NPCAddFireGroup(npcComponent, target ? target.id : null);
        //   //并指定其目标为指定名称id的npc
        //   copy.GetComponent("NPC").SetNpcTarget(target.GetComponent("NPC"), true, true);
        // }

      }, npcId);
    }

    let warWave = {
      waveNum: 1,
      count: 0,
    };
    let createLaterList = [];
    let npcList = [];
    function DuplicateModelNPC(assetId) {

      let npcId = new Date().getTime();

      let npcTransform = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(assetId);
      let target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
      let modelData = JSON.parse(JSON.stringify(npcTransform.modelData));
      modelData.active = true;
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().DuplicateModelNPC(modelData, (copy) => {
        // 测试显示指定名称id的NPC
        copy.SetActive(true);
        npcList.push(copy);

        let npc = copy.GetComponent("NPC");
        npc.addEventListener("死亡", () => {
          warWave.count--;
        });
        _Global.DyncManager.AddNpc(copy);

        // console.log(" 战斗状态 ", _Global.inGame);
        if (_Global.inGame) {
          let npcComponent = copy.GetComponent("NPC");
          _Global.DyncManager.NPCAddFireGroup(npcComponent, target ? target.id : null);
          //并指定其目标为指定名称id的npc
          copy.GetComponent("NPC").SetNpcTarget(target.GetComponent("NPC"), true, true);
        }

      }, npcId);
    }
    let dmNpcList = [];
    // 每0.5秒检测一次。巡视NPC是否能发现玩家。每个玩家独立计算，计算后再做npc目标同步
    function CheckNpcLookat() {
      if (!_Global.inGame) {
        return;
      }

      let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFire(1000);
      if (npcs.length > 0) {
        for (let i = 0; i < dmNpcList.length; i++) {
          const npcComponent = dmNpcList[i];
          if (npcComponent.fireId == -1 && npcs[0].fireId != -1) {
            _Global.DyncManager.NPCAddFireGroup(npcComponent, null);
            //并指定其目标为指定名称id的npc            
            npcComponent.SetNpcTarget(npcs[0], true, true);
            // console.log(" dm 玩家战斗状态 并设置目标 ",npcComponent.fireId,npcComponent.GetState());

          }
        }

        // let gjs = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("弓箭手"); 
        // // let gjs = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("战士");
        // let gjsCom = (gjs.GetComponent("NPC"));
        // gjsCom.canMove = false; 
        // if (gjsCom.fireId == -1 && npcs[0].fireId != -1) {
        //   _Global.DyncManager.NPCAddFireGroup(gjsCom, null); 
        //   gjsCom.SetNpcTarget(npcs[0], true, true); 
        // } 

      }

    }

    function init() {
      if (!_Global.setting.DMGame) {
        return;
      }

      _Global.DMManager = scope;

      setInterval(() => {
        CheckNpcLookat();
      }, 500);

      _Global.addEventListener("战斗结束", (msg) => {
        if (msg) {
          if (msg == 10000) {

          } else {
            if (!_Global.createCompleted) {
              return;
            }
          }
        }
        //清除敌人
        setTimeout(() => {
          for (let i = 0; i < npcList.length; i++) {
            _Global._YJNPCManager.RemoveNpcById(npcList[i].id);
            npcList[i].Destroy();
          }
          npcList = [];
        }, 3000);

        for (let i = 0; i < createLaterList.length; i++) {
          clearTimeout(createLaterList[i]);
        }
        createLaterList = [];

        setTimeout(() => {
          // 如果弹幕玩家死亡，则重新生成弹幕玩家
          for (let i = DMPlayer.length - 1; i >= 0; i--) {
            const element = DMPlayer[i];
            let npcComponent = _Global._YJNPCManager.GetNpcComponentById(element.npcId);
            npcComponent.fireId = -1;
            if (element.isDead) {
              npcComponent.Dync({ title: "重新生成" });
              element.isDead = false;
            }
          }
          // 主角色死亡也重新生成
          let redboss = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
          let npc = redboss.GetComponent("NPC");
          if (npc.isDead) {
            npc.Dync({ title: "重新生成" });
          }
        }, 10000);
      });
      _Global.addEventListener("战斗开始", () => {
        _Global.createCompleted = false;

        let target = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId("redboss");
        target.GetComponent("NPC").canMove = false;


        let fn = setTimeout(() => {

          DuplicateModelNPC(RandomInt(0, 1) == 0 ? "魔暴龙" : "森林狼");
          _Global.applyEvent("敌方攻势", 1);
          let fn2 = setTimeout(() => {
            for (let i = 0; i < 3; i++) {
              let fn3 = setTimeout(() => {
                DuplicateModelNPC(RandomInt(0, 1) == 0 ? "魔暴龙" : "森林狼");
              }, 1000 * i);
              createLaterList.push(fn3);
            }
            _Global.applyEvent("敌方攻势", 2);

            let fn4 = setTimeout(() => {
              for (let i = 0; i < 5; i++) {
                let fn3 = setTimeout(() => {
                  DuplicateModelNPC(RandomInt(0, 1) == 0 ? "魔暴龙" : "森林狼");
                }, 1000 * i);
                createLaterList.push(fn3);
              }
              _Global.applyEvent("敌方攻势", 3);

              let fn5 = setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                  let fn3 = setTimeout(() => {
                    DuplicateModelNPC(RandomInt(0, 1) == 0 ? "魔暴龙" : "森林狼");
                  }, 1000 * i);
                  createLaterList.push(fn3);
                }
                _Global.applyEvent("敌方攻势", 4);

                let fn6 = setTimeout(() => {
                  DuplicateModelNPC("boss");
                  _Global.applyEvent("敌方攻势", 5);

                  _Global.createCompleted = true;
                }, 15000);
                createLaterList.push(fn6);
              }, 10000);
              createLaterList.push(fn5);

            }, 10000);
            createLaterList.push(fn4);


          }, 10000);
          createLaterList.push(fn2);

        }, 1000);
        createLaterList.push(fn);
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

export { YJDMManager_bilibili };