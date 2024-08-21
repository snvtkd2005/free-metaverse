


import { RandomInt } from "/@/utils/utils";

/*
生成怪物NPC
 */
class GenerateEnemyNPC {
  constructor(generateSingle,onDead) {
    let scope = this;

    let createLaterList = [];
    let hostileNpcList = []; //敌对npc对象池 
    let posRefList = []; //敌方npc生成位置 
    let npcList = {
      level1: ["魔暴龙", "森林狼"], //一级怪
      level2: ["boss"],  //二级怪
      level3: ["巴纳扎尔"],  //三级怪
    };
    let enemyList = ["boss", "魔暴龙", "森林狼"];
    let loadModelPooling = 0; //加载对象池中对象的次数

    this.DuplicateModelNPC = function(modelId, state){
      if(!modelId){
        modelId = enemyList[RandomInt(0,enemyList.length-1)];
      }
      DuplicateModelNPC(modelId, state);
    }
    function DuplicateModelNPC(modelId, state) { 

      let npcId = new Date().getTime();

      if (state) {
        let { uface, uname, msg } = state;
        if (_Global.YJDync) {
          _Global._YJDyncManager.SendSceneState("添加", { id: npcId, modelType: "NPC模型", state: { modelId: modelId, npcId: npcId, dmData: { uname, uface } } });
        }
      } else {
        if (_Global.YJDync) {
          _Global._YJDyncManager.SendSceneState("添加", { id: npcId, modelType: "NPC模型", state: { modelId: modelId, npcId: npcId } });
        }
      }

      let has = false;
      for (let i = 0; i < hostileNpcList.length && !has; i++) {
        const element = hostileNpcList[i];
        if (!element.transform.GetActive() && element.modelId == modelId) {
          element.transform.ResetPosRota(); 
          if (posRefList.length > 0) {
            let pos = posRefList[RandomInt(0, posRefList.length - 1)].pos;
            element.transform.SetPos(pos);
          }
          let npcComponent = element.transform.GetComponent("NPC");
          npcComponent.Dync({ title: "重新生成" });
          has = true;

          if (state) {
            let { uface, uname, msg } = state;
            npcComponent.CreateHeader(uface);
            npcComponent.SetName(uname);
          } else {
            npcComponent.ResetName();
            npcComponent.applyEvent("隐藏头像");
          }
          if(generateSingle){
            generateSingle(npcComponent);
          }
        }
      }

      if (has) {
        loadModelPooling++;
        // console.log("加载对象池中的 ",loadModelPooling);
        return;
      }

      _Global._YJNPCManager.DuplicateNPC(modelId, npcId, (copy) => {

        hostileNpcList.push({ id: npcId, modelId: modelId, transform: copy });


        if (posRefList.length > 0) {
          let pos = posRefList[RandomInt(0, posRefList.length - 1)].pos;
          copy.SetPos(pos);
        }
        let npc = copy.GetComponent("NPC");
        npc.addEventListener("死亡", (id,fireid,damageFromData) => {

          if(id!=npcId){
            console.error(" id不符 ",id,npcId);
          }
          if(onDead){
            onDead(npc,id,fireid,damageFromData);
          }
        });
        if (state) {
          let { uface, uname, msg } = state;
          npc.CreateHeader(uface);
          npc.SetName(uname);
        }
        npc.addEventListener("npc尸体消失", () => {
          npc.SetLevelToOne();
          if (_Global.YJDync) {
            _Global._YJDyncManager.SendSceneState("删除", { id: npcId, modelType: "NPC模型" });
          }
        });

        if(generateSingle){
          generateSingle(npc);
        } 
      });
    } 
    /**
     * 
     * @param {怪物唯一id} assetIds 
     * @param {生成数量} count 
     * @param {生成间隔} genSpeed 
     * @param {生成下一批怪物的等待时间} waitTime 
     * @param {生成下一批怪物的函数 } callback 
     * @param {弹幕玩家头像名称等数据} state 
     */
    function GenerateHot(assetIds, count, genSpeed, waitTime, callback, state) {
      for (let i = 0; i < count; i++) {
        let fn3 = setTimeout(() => {
          DuplicateModelNPC(assetIds[RandomInt(0, assetIds.length - 1)], state);
        }, genSpeed * 1000 * i);
        createLaterList.push(fn3);
      }
      if (waitTime) {
        let fn7 = setTimeout(() => {
          if (callback) {
            callback();
          }
        }, waitTime * 1000);
        createLaterList.push(fn7);
      }
    }
    this.GenerateHot = function(assetIds, count, genSpeed, waitTime, callback, state){
      GenerateHot(assetIds, count, genSpeed, waitTime, callback, state);
    }
    // 关卡的怪物量
    this.gameLevelFire = function(lv) {


      if (lv == 1) {
        _Global.applyEvent("敌方攻势", 1);
        GenerateHot(npcList.level1, 1, 0.5, 5, () => {
          
          _Global.applyEvent("敌方攻势", 2);
          GenerateHot(npcList.level1, 3, 1, 10, () => {

            _Global.applyEvent("敌方攻势", 3);
            GenerateHot(npcList.level1, 5, 1, 20, () => {

              _Global.applyEvent("敌方攻势", 4);
              GenerateHot(npcList.level1, 6, 0.5, 20, () => {

                _Global.applyEvent("敌方攻势", 5);
                GenerateHot(npcList.level1, 6, 0.5, 10, () => {
                  _Global.applyEvent("敌方攻势", 6);
                  GenerateHot(npcList.level2, 1, 1);
                  _Global.createCompleted = true;
                });
              });
            });
          });
        });
      }
      if (lv == 2) {
        _Global.applyEvent("敌方攻势", 1);
        GenerateHot(npcList.level1, 3, 0.5, 1, () => {

          _Global.applyEvent("敌方攻势", 2);
          GenerateHot(npcList.level1, 15, 1, 3, () => {

            _Global.applyEvent("敌方攻势", 3);
            GenerateHot(npcList.level2, 1, 1);
            GenerateHot(npcList.level1, 15, 1, 10, () => {

              _Global.applyEvent("敌方攻势", 4);
              GenerateHot(npcList.level2, 3, 1);
              GenerateHot(npcList.level1, 20, 0.5, 20, () => {

                _Global.applyEvent("敌方攻势", 5);
                GenerateHot(npcList.level2, 3, 1);
                GenerateHot(npcList.level1, 20, 0.5, 30, () => {

                  _Global.applyEvent("敌方攻势", 6);
                  GenerateHot(npcList.level1, 20, 0.5);
                  GenerateHot(npcList.level2, 3, 1);
                  _Global.createCompleted = true;
                });
              });
            });
          });
        });
      }
      if (lv >= 3) {
        // 新boss
        _Global.applyEvent("敌方攻势", 1);

        GenerateHot(npcList.level2, 3, 1);
        GenerateHot(npcList.level1, 3, 0.5, 1, () => {

          _Global.applyEvent("敌方攻势", 2);
          GenerateHot(npcList.level1, 15, 1, 5, () => {

            _Global.applyEvent("敌方攻势", 3);
            GenerateHot(npcList.level2, 2, 1);
            GenerateHot(npcList.level1, 30, 1, 10, () => {

              _Global.applyEvent("敌方攻势", 4);
              GenerateHot(npcList.level2, 3, 1);
              GenerateHot(npcList.level1, 40, 0.5, 20, () => {

                _Global.applyEvent("敌方攻势", 5);
                GenerateHot(npcList.level2, 3, 1);
                GenerateHot(npcList.level1, 40, 0.5, 20, () => {

                  _Global.applyEvent("敌方攻势", 6);
                  GenerateHot(npcList.level1, 50, 0.5);
                  GenerateHot(npcList.level2, 3, 1);
                  _Global.createCompleted = true;

                  if (lv >= 4) {
                    GenerateHot(npcList.level3, lv - 4 + 1, (lv - 4) + 1);

                    _Global._YJAudioManager.playAudio("1711111909667/ui_raidbosswhisperwarning.ogg", " boss warning audio ");

                  }

                });
              });
            });
          });
        });
      }
      if (lv == 4) {

      }
    }

    function init() {

      // console.error(" in Generate NPC");
      posRefList = _Global.YJ3D._YJSceneManager.GetPosRefList();

      _Global.addEventListener("战斗结束", (msg) => {
        // 所有怪物隐藏

        for (let i = 0; i < hostileNpcList.length; i++) {
          const element = hostileNpcList[i].transform;
          let npc = element.GetComponent("NPC");
          npc.fireOff();
        }

        //清除敌人
        setTimeout(() => {
          for (let i = 0; i < hostileNpcList.length; i++) {
            const element = hostileNpcList[i].transform;
            let npc = element.GetComponent("NPC");

            npc.SetNpcTargetToNone();
            npc.SetActive(false);
            element.SetActive(false);
            // _Global._YJNPCManager.RemoveNpcById(hostileNpcList[i].id);
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneState("删除", { id: hostileNpcList[i].id, modelType: "NPC模型" });
            }
          }
          // hostileNpcList = [];
        }, 3000);

        // 停止创建新怪物
        for (let i = 0; i < createLaterList.length; i++) {
          clearTimeout(createLaterList[i]);
        }
        createLaterList = [];
      });
      
      // _Global.addEventListener("战斗开始", () => {
        // _Global.createCompleted = false;
        // GenerateHot(["boss"], 1, 0.5);
        // GenerateHot(["boss", "食尸鬼", "食尸鬼2", "食尸鬼3"], 10, 0.5);
      // });
      // _Global.applyEvent("战斗开始");
      // setTimeout(() => {
      //   _Global.applyEvent("战斗开始");
      // }, 5000);
    }

    init();
  }
}

export { GenerateEnemyNPC };