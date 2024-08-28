import * as THREE from "three";


import TWEEN from '@tweenjs/tween.js';

import { YJParabola } from "/@/threeJS/YJParabola.js";

import { YJSkillParticleManager } from "./YJSkillParticleManager.js";

import { YJFireManager } from "/@/threeJS/game/managers/YJFireManager.js"; 
// import { YJController_roguelike } from "/@/threeJS/YJController_roguelike.js";

// 场景同步数据

class YJSceneDyncManagerEditor {
  constructor(_this, indexVue, _SceneManager) {
    var scope = this;

    let dyncModelList = [];
    dyncModelList.push({ id: "offsetTime", modelType: "offsetTime", state: { offsetTime: 0, startTime: 1675586194683 } });
    let _YJFireManager = null;
    this.GetDyncModelList = () => {
      return dyncModelList;
    }


    let _YJSkillParticleManager = null;
    // 初始化场景中需要同步的模型。每个客户端都执行
    this.InitDyncSceneModels = () => {

      //武器、npc 
      let modelDataList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetModelList();
      for (let i = 0; i < modelDataList.length; i++) {
        const element = modelDataList[i];
        let state = {};
        if (element.modelType == "NPC模型"
          || element.modelType == "装备模型"
          || element.modelType == "交互模型"
        ) {
          if (element.modelType == "NPC模型") {
            let relifeTime = element.message.data.relifeTime;
            if (relifeTime && relifeTime > 0) {
              state.relifeTime = 8 + relifeTime;
            } else {
              state.relifeTime = 0;
            }
          }
          if (element.modelType == "交互模型") {
            if (element.message.data.relifeTime) {
              state.relifeTime = element.message.data.relifeTime
            } else {
              state.relifeTime = 6;
            }
            let model = element.message.data;
            // console.log("交互模型",model);
 

            addVirus(model);
          }
          dyncModelList.push({ id: element.id, modelType: element.modelType, state: state });
        }
      }


      _YJFireManager = new YJFireManager();

      if (_Global.setting.inEditor) {
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();
        return;
      }
    }

    this.UpdateTransfrom = function () {
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().UpdateTransfrom();
    }


    function addVirus(model) {
      for (let i = 0; i < dyncModelList.length; i++) {
        const element = dyncModelList[i];
        if (element.id == model.type) {
          return;
        }
      }
      // 增加额外的同步信息
      let data = { id: model.type, modelType: "交互模型", state: { value: 0, count: 0 } };
      dyncModelList.push(data);
    }
    this.SendDataToServer = (type, data) => {
 
      if (type == "玩家离开房间") {
        //删除玩家的镜像角色
        if (_Global.mainUser) {
        }
        _YJFireManager.RemovePlayerFireId(data);

        return;
      }

      if (
        type == "npc技能" 
      || type == "npc技能攻击" 
      || type == "玩家技能攻击" 
      || type == "同步角色施放技能状态"
      || type == "同步角色控制技能状态"
      || type == "玩家技能"
      || type == "玩家对玩家"
      || type == "玩家对NPC"
      || type == "NPC对NPC"
      || type == "NPC对玩家"
      || type == "受到技能"
      || type == "解除技能"
      || type == "系统消息"
      ) {
        if (!_Global.YJClient) {
          this.Receive({ type:type, state: data });
          return;
        }
        // this.SendSceneState("转发", { type: type, state: data });
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: type, state: data });

        return;
      }

      if (type == "主控发送初始化") {
        // 第一个进入房间的玩家调用
        this.SendSceneState("初始化", dyncModelList);

        // 调用所有npc的寻路
        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().AllNpcTransformNav();

        return;
      }

    }
 
    function radomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    } 

    // 玩家拾取场景内物体的数据。用来做场景物体同步
    let playerData = [];
    //发送单个物体数据
    this.SendModelState = function (id, state) {
      // if (!_Global.YJClient) {
      //   return;
      // }
      this.SendSceneState("更新single", { id: id, modelType: state.modelType, state: state.msg });
    }
    // 发送一条战斗记录
    this.SendFireRecode = function (msg) {
      // console.log("战斗记录 ", msg);
    }
    this.SendModel = function (model) {
      if (!_Global.YJClient) {
        return;
      }
      this.SendSceneState("更新single", model);
    }
    this.SendModelPlayer = function (model) {
      if (!_Global.YJClient) {
        return;
      }
      this.SendSceneStateAll("玩家对玩家", model);
    }
    this.SendSceneStateAll = function (type, msg) {
      if (type == "玩家死亡") {
        if (!_Global.YJClient) {
          this.Receive({ type: "玩家死亡", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "玩家死亡", state: msg });
        return;
      }


      if (type == "玩家脱离战斗") {
        if (!_Global.YJClient) {
          this.Receive({ type: "玩家脱离战斗", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "玩家脱离战斗", state: msg });
        return;
      }
      if (type == "玩家加入战斗") {
        if (!_Global.YJClient) {
          this.Receive({ type: "玩家加入战斗", state: msg });
          return;
        }
        _Global._YJDyncManager.SendSceneStateAll("转发", { type: "玩家加入战斗", state: msg });
        return;
      }
      
      
      if (type == "玩家对玩家" || type == "NPC对NPC" ||type == "NPC对玩家" ||type == "玩家对NPC" || type == "伤害跳字") {
        if (!_Global.YJClient) {
          this.Receive({ type: type, state: msg });
          return;
        }
        // _Global._YJDyncManager.SendSceneStateAll(type, msg);
        _Global._YJDyncManager.SendSceneStateAll("转发", { type:type, state: msg });
        return;
      } 

    }

    let fireGroup = [];
    //发送整个场景数据
    this.SendSceneState = function (type, msg) {
      if (!_Global.YJClient) { 
        return;
      }
      if (type == undefined) {
        type = "all";
      }

      if (type == "初始化") {
        _Global._YJDyncManager.SendSceneState("初始化", msg);
        return;
      }
      if (type == "转发") {
        _Global._YJDyncManager.SendSceneState("转发", msg);
        return;
      }
      if (type == "更新single") {
        _Global._YJDyncManager.SendSceneState("更新single", msg);
        return;
      }
      if (type == "添加") {
        _Global._YJDyncManager.SendSceneState(type, msg);
        return;
      }
      if (type == "删除") {
        _Global._YJDyncManager.SendSceneState("删除", msg);
        return;
      }
      if (type == "all") {
        _Global._YJDyncManager.SendSceneState("转发", { type: type, state: dyncModelList });
        return;
      }
      if (type == "战斗状态") {
        fireGroup = _YJFireManager.GetFireGroup();
        _Global._YJDyncManager.SendSceneState("转发", { type: type, state: fireGroup });
        return;
      }
      _Global._YJDyncManager.SendSceneState("转发", { type: type, state: msg });

    }

    // 接收 转发 数据
    this.Receive = function (data) {
      // console.log(" Receive ",data);
      let { type, state } = data;
      if (type == "玩家改变阵营") { 
        
        return;
      }

      if (type == "重新生成") {
        if (!_Global.mainUser) {
          let { modelId } = state;
          let npcComponent = _Global._YJNPCManager.GetNpcComponentById(modelId);
          if (npcComponent) {
            if (npcComponent.isDead) {
              npcComponent.Dync({ title: "重新生成" });
            }
            return;
          }
          let redboss = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetTransformByModelId(modelId);
          let npc = redboss.GetComponent("NPC");
          if (npc.isDead) {
            npc.Dync({ title: "重新生成" });
          }
        }
        return;
      }
      if (type == "移除npc") {
        if (!_Global.mainUser) {
          let { npcId } = state;
          _Global._YJNPCManager.RemoveNpcById(npcId);
        }
        return;
      }
      if (type == "生成npc") {
        if (!_Global.mainUser) {
          let { modelId, npcId } = state;
          _Global._YJNPCManager.DuplicateNPC(modelId, npcId, (copy) => {
            let { uname, uface } = state;
            if (uname) {
              let npc = copy.GetComponent("NPC");
              npc.CreateHeader(uface);
              npc.SetName(uname);
            }
          });
        }
        return;
      }
  
      if (type == "添加弹幕玩家镜像") {
        AddModelDMPlayer(state);
        return;
      } 


      if (type == "玩家死亡") {
        if (_Global.mainUser) {
          _YJFireManager.RemovePlayerFireId(state.playerId, state.fireId);
        }
        return;
      }
      if (type == "所有人加生命") {
        _SceneManager.ReceivePlayer({ buff: "addHealth", buffValue: state });
        return;
      }
      if (type == "弹幕") {
        if (indexVue.$refs.HUD.$refs.DMPanel) {
          indexVue.$refs.HUD.$refs.DMPanel.receiveMsg(state);
        }
        return;
      }
      // console.log(" 接收 ", type, state);
      if (type == "玩家脱离战斗") {
        if (_Global.YJ3D.YJPlayer.id == state) {
          _Global._YJPlayerFireCtrl.SetPlayerEvent("玩家脱离战斗");
        }
        if (_Global.mainUser) {
          _Global._YJNPCManager.EventHandler(data);
        }
        return;
      }
      if (type == "玩家加入战斗") {
        let { playerId, fireId,targetId } = state;
        if (_Global.YJ3D.YJPlayer.id == playerId) {
          _Global._YJPlayerFireCtrl.SetPlayerEvent("选中npc", _YJFireManager.GetNpcById(targetId).GetComponent("NPC"));
          _Global._YJPlayerFireCtrl.SetPlayerEvent("玩家加入战斗", fireId);
        } else {

        } 
        return;
      }
      if(type == "伤害跳字" ){
        let { fromId,fromType,fromName,targetId,targetType,targetName,fromOwnerPlayerId, value,addredius } = state;
        let fromModel = null;
        let targetModel = null;
        if(fromType == "玩家"){
          fromModel = _YJFireManager.GetPlayerById(fromId);
        }
        if(fromType == "NPC"){
          fromModel = _YJFireManager.GetNpcById(fromId).GetComponent("NPC");
        }

        if(targetType == "玩家"){
          targetModel = _YJFireManager.GetPlayerById(targetId);
        }
        if(targetType == "NPC"){
          targetModel = _YJFireManager.GetNpcById(targetId).GetComponent("NPC");
        }
        let pos = targetModel.GetDamageTextPos();
        if(targetModel){
          if(targetModel.isPlayer ){
            // console.log(" dync 伤害跳字 isPlayer ",_Global.user.id,fromOwnerPlayerId);

            if(_Global.user.id == targetId || _Global.user.id == fromId){
                _Global._SceneManager.UpdateNpcDamageValue(
                  fromId,
                  fromName,
                  targetName,
                  targetId,
                  "1000",
                  value,
                  pos,
                  addredius
                );
            }
          }else{
            // console.log(" dync 伤害跳字 ",_Global.user.id,targetId,fromId,fromOwnerPlayerId);
            if(_Global.user.id == targetId || _Global.user.id == fromId || _Global.user.id == fromOwnerPlayerId ){
              _Global._SceneManager.UpdateNpcDamageValue(
                fromId,
                fromName,
                targetName,
                targetId,
                "1000",
                value,
                pos,
                addredius
              );
            }
          }
        }
      }
      if (type == "玩家技能攻击") {
        let { fromType,targetType,fromId,targetId, skillItem } = state;
        let fromModel = _YJFireManager.GetPlayerById(fromId);

      }
      
      if (type == "玩家对玩家" || type == "玩家对NPC" || type == "NPC对NPC" || type == "NPC对玩家") {

        // if (!_Global.mainUser) {
        //   return;
        // }
        let { fromType,targetType,fromId,targetId, skillItem } = state;
        let fromModel = null;
        let targetModel = null;
        if(fromType == "玩家"){
          fromModel = _YJFireManager.GetPlayerById(fromId);
        }
        if(fromType == "NPC"){
          fromModel = _YJFireManager.GetNpcById(fromId).GetComponent("NPC");
        }

        if(targetType == "玩家"){
          targetModel = _YJFireManager.GetPlayerById(targetId);
        }
        if(targetType == "NPC"){
          targetModel = _YJFireManager.GetNpcById(targetId).GetComponent("NPC");
        }

        // console.log(" in dync ",type,_Global.user.id,fromType,targetType,fromId,targetId,targetModel);
        if(targetModel){
          if(targetModel.isPlayer ){
            if(_Global.user.id == targetId){
              _Global._YJPlayerFireCtrl.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
            } 
          }else{
            targetModel.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
          }
        }
        return;
      }
      if (type == "同步npc伤害分配" ) {
        let { fromId, npcId,damageFromData} = state;
        if(_Global.user.id == fromId){ return;}
        let npc = _YJFireManager.GetNpcById(npcId).GetComponent("NPC");
        if(npc){
          npc.Dync({title:type,damageFromData:damageFromData});;
        }
        return;
      }
      if (type == "同步角色施放技能状态") {
        let {userId,fromId,fromType,msg} = state;
        if(_Global.user.id == userId){return;}
        let fromModel = null;
        if(fromType == "玩家"){
          fromModel = _YJFireManager.GetPlayerById(fromId);
          fromModel.SendSkill(msg);
        }
        if(fromType == "NPC"){
          fromModel = _YJFireManager.GetNpcById(fromId).GetComponent("NPC");
          fromModel.GetSkill().SendSkill(msg);
        } 
        return;
      }

      if (type == "同步角色控制技能状态") {
        let {userId,fromId,fromType,msg} = state;
        if(_Global.user.id == userId){return;}
        
        let fromModel = null;
        if(fromType == "玩家"){
          fromModel = _YJFireManager.GetPlayerById(fromId);
          fromModel.ReceiveControl(msg);
        }
        if(fromType == "NPC"){
          fromModel = _YJFireManager.GetNpcById(fromId).GetComponent("NPC");
          fromModel.GetSkill().ReceiveControl(msg);
        } 
        return;
      }
      
      if (type == "系统消息") {
        let {userId,userName,msg} = state;
        if(_Global.user.id == userId){return;}
        let content = "";
        if(msg.title=="开启互动直播"){
          content = "玩家 "+userName + " " + msg.title;
        }
        _Global.applyEvent("系统消息",content);
        return;
      }
      

      if (type == "npc技能" || type == "npc技能攻击" || type == "受到技能" || type == "解除技能") {
        let { fromType,targetType,fromId,targetId, skillItem } = state;
 
        let fromModel = null;
        let targetModel = null;
        if(fromType == "玩家"){
          fromModel = _YJFireManager.GetPlayerById(fromId);
        }
        if(fromType == "NPC"){
          fromModel = _YJFireManager.GetNpcById(fromId).GetComponent("NPC");
        }

        if(targetType == "玩家"){
          targetModel = _YJFireManager.GetPlayerById(targetId);
        }
        if(targetType == "NPC"){
          targetModel = _YJFireManager.GetNpcById(targetId).GetComponent("NPC");
        }
        if(targetModel){
          if(targetModel.isPlayer){
            _Global._YJPlayerFireCtrl.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
          }else{
            targetModel.ReceiveSkill(fromModel,skillItem.skillName, skillItem.effect,skillItem);
          }
        }
        // _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel({ id: npcId, modelType: "NPC模型", state: { title: type, skill: skill } });
        return;
      }

      if (type == "npc发现玩家") {
        if (_Global.mainUser) {
          let { npcId, otherId } = state;
          _YJFireManager.GetNpcById(npcId).GetComponent("NPC").SetNpcTarget(_YJFireManager.GetPlayerById(otherId), true, true);
        }
        return;
      }
      if (type == "npc发现npc") {
        if (_Global.mainUser) {
          let { npcId, otherId } = state;
          _YJFireManager.GetNpcById(npcId).GetComponent("NPC").SetNpcTarget(_YJFireManager.GetNpcById(otherId).GetComponent("NPC"), true, true);
        }
        return;
      }
      if (type == "战斗状态") {
        if (_Global.mainUser) {
          return;
        }
        fireGroup = state;
        console.log("战斗状态同步改变 ", fireGroup);
        return;
      }

      if (type == "获取场景状态") {
        let { sceneModels, userModels } = state;
        console.log(" 更新场景同步数据 ", state);
        // console.log(" 更新场景同步数据 ", dyncModelList);

        //整个场景所有模型的更新
        for (let j = 0; j < userModels.length; j++) {
          const _state = userModels[j];
          let has = false;
          for (let i = 0; i < dyncModelList.length && !has; i++) {
            const element = dyncModelList[i];
            if (element.id == _state.id) {
              has = true;
            }
          }
          if (!has) {
            console.log(" 添加用户生成模型 ", _state);
            AddModel(_state);
          }
        }

        for (let j = 0; j < sceneModels.length; j++) {
          const _state = sceneModels[j];
          let has = false;

          for (let i = 0; i < dyncModelList.length && !has; i++) {
            const element = dyncModelList[i];
            if (element.id == _state.id) {
              element.state = _state.state;
              has = true;
            }
          }
          if (!has) {
            dyncModelList.push(_state);
          }
 
        }

        for (let i = 0; i < sceneModels.length; i++) {
          const element = sceneModels[i];
          _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(element);
        }


        //此时同步完成， 隐藏loading页
        indexVue.OpenThreejs();
        return;
      }


      if (type == "all") {
        console.log("接收场景同步信息", sceneState);

        //整个场景所有模型的更新
        for (let i = 0; i < dyncModelList.length; i++) {
          const element = dyncModelList[i];
          let has = false;
          for (let j = 0; j < state.length && !has; j++) {
            const _state = state[j];
            if (element.id == _state.id) {
              element.state = _state.state;
              has = true;
            }
          }
        }

        for (let i = 0; i < state.length; i++) {
          const element = state[i];
          _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(element);
        }
        return;
      }

      if (type == "服务器下发") {

        // return;
      }
      // console.log("更新单个模型 ", sceneState);
      //单个模型的更新
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(state);
      for (let i = 0; i < dyncModelList.length; i++) {
        const element = dyncModelList[i];
        // console.log("查找",state.id,element.id);
        if (element.id == state.id) {
          element.state = state.state;
          return;
        }
      }
    }
    function AddModelDMPlayer(singleData) {
      console.log("添加弹幕玩家镜像 ",singleData);
      let {fromId, id, modelType, state } = singleData;
      if (modelType == "NPC模型") {
        let { modelId, npcId, dmData, modelData } = state;
        if (modelId) {
          if (_Global.user.id != fromId) {
            _Global._YJNPCManager.DuplicateNPC(modelId, npcId, (copy) => {
              if (dmData) {
                let { uname, uface } = dmData;
                let npc = copy.GetComponent("NPC");
                npc.CreateHeader(uface);
                npc.SetName(uname);
              }

            });
          }
          return;
        }
 
      }

    }

    function AddModel(singleData) {
      let { id, modelType, state } = singleData;
      if (modelType == "NPC模型") {
        let { modelId, npcId, dmData, modelData } = state;
        if (modelId) {
          if (!_Global.mainUser) {
            _Global._YJNPCManager.DuplicateNPC(modelId, npcId, (copy) => {
              if (dmData) {
                let { uname, uface } = dmData;
                let npc = copy.GetComponent("NPC");
                npc.CreateHeader(uface);
                npc.SetName(uname);
              }

            });
          }
          return;
        }

        let _playerId = modelData.id;
        let ownerId = modelData.ownerId;
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().DuplicateModel(modelData, (transform) => {
          transform.SetActive(false);
          transform.id = _playerId;
          setTimeout(() => {
            _YJFireManager.AddNpc(transform);
            let _npcComponent = transform.GetComponent("NPC");
            _npcComponent.id = _playerId;
            transform.SetActive(true);
            if (ownerId == _Global.YJ3D.YJPlayer.id) {
              _Global._YJPlayerFireCtrl.SetPlayerEvent("添加镜像", _playerId);
            }
            _npcComponent.setOwnerPlayer(_YJFireManager.GetPlayerById(ownerId));

            if (_Global.mainUser) {
              let player = _YJFireManager.GetPlayerById(ownerId);
              if (player.playerMirrors == undefined) {
                player.playerMirrors = [];
              }
              player.playerMirrors.push(_playerId);
            }

          }, 1000);
        }, _playerId);
      }

    }
    function RemoveModel(singleData) {
      let { id, modelType, state } = singleData;
      if (modelType == "NPC模型") {
        _Global._YJNPCManager.RemoveNpcById(id);
      }

    }
    //接收服务器下发
    this.ReceiveFromServer = function (sceneState) {
      // if (_Global.mainUser) {
      //   return;
      // }
      console.log(" 接收服务器下发 更新单个模型 ", sceneState);
      let model = sceneState.state;
      switch (sceneState.title) {
        case "添加":
          AddModel(model);
          return;
        case "删除":
          RemoveModel(model);
          // let { npcId, playerId } = model;
          // if (_Global.YJ3D.YJPlayer.id == playerId) {
          //   _Global._YJPlayerFireCtrl.SetPlayerEvent("删除镜像", npcId);
          // } 
          return;
        case "更新道具数量":
          if (model.modelType == "交互模型") {
            // indexVue.$refs.HUD.$refs.skillPanel_virus.SetSkillCount({ type: model.id, value: model.state.value, count: model.state.count });
          }
          return;
          break;
        case "生成道具":
          if (model.modelType == "交互模型") {
            _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(model);
          }
          return;
          break;
        case "还原装备":
          if (model.modelType == "装备模型") {
            _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(model);
          }
          return;
          break;

        default:
          break;
      }
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(model);
    }


    // 由主控发送模型同步信息
    /**
     * 
     * @param {模型唯一id} id 模型唯一id
     * @param {同步类型标题} title 同步类型标题
     * @param {同步数据} data 同步数据
     */
    this.UpdateModel = (id, title, data) => {
      if (_Global.YJClient) {
        _Global._YJDyncManager.UpdateModel(id, title, data);
      }
    }
    // 接收 玩家 对 玩家
    this.ReceivePlayerToPlayer = function (sceneState) {
      _SceneManager.ReceivePlayer(sceneState.state);
      // console.log(" 接收玩家对玩家 ", sceneState);
    }
    // 接收服务器转发过来的由主控发送的模型同步信息
    this.ReceiveModel = function (id, title, data) {
      // console.log("接收 同步信息 ", id, title, data);

      if (title == "同步trail") {
        let { startPos, targetId, targetType, time, firePid } = data;
        //根据id查找模型
        let target = null;
        if (targetType == "player") {
          target = _YJFireManager.GetPlayerById(targetId);
        }
        if (targetType == "npc") {
          target = _YJFireManager.GetNpcById(targetId);
        }
        if (target != null) {
          let _startPos = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
          shootTargetFn(_startPos, target, time, firePid);
        }
        return;
      }
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().ReceiveModel(id, title, data);
    }



    //角色离线移除角色时，如果npc以该角色为目标，则让npc查找下一个目标
    this.DelPlayer = function (id) { 
      _YJFireManager.DelPlayer(id);
    }

    //#region 
    //#endregion

    //#region 
    this.shootTarget = function (startPos, target, speed, targetType, firePid, callback) {
      // console.log(" 同步trail target ", target.id, targetType);
      scope.UpdateModel("", "同步trail", { startPos: startPos, targetId: target.id, firePid: firePid, targetType: targetType, speed: speed });
      shootTargetFn(startPos.clone(), target, speed, firePid, callback);
    }
    function shootTargetFn(startPos, target, speed, firePid, callback) {
      _YJSkillParticleManager.shootTargetFn(startPos.clone(), target, speed, firePid, callback);
      
      // _YJSkillParticleManager.shootTargetFn(startPos.clone(), target, "1704443871265");
    }
    //#endregion

    this.DyncPlayerState = function (YJPlayer, state) {
      YJPlayer.DyncPlayerState(state); return;
    }

    function init() {
      _YJSkillParticleManager = new YJSkillParticleManager(_this);
      update();
    }
    function update() {
      requestAnimationFrame(update);
      TWEEN.update();
    }
    init();

  }
}

export { YJSceneDyncManagerEditor };