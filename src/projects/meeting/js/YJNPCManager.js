



import * as THREE from "three";


import { YJNPC } from "/@/threeJS/YJNPC";
import { YJPathfindingCtrl } from "/@/threeJS/pathfinding/YJPathfindingCtrl.js";

// 加载静态物体
class YJNPCManager {
  constructor(_this, scene, npcPath, npcStoryData, sceneManager) {


    let scope = this;

    let npcList = [];

    this.GetStory = function (npcName) {
      for (let i = 0; i < npcStoryData.modelsList.length; i++) {
        const element = npcStoryData.modelsList[i];
        if (element.name == npcName) {
          return element;
        }
      }
      return null;
    }

    this.GetNpcMovePos = function (moveName) { 
      return sceneManager.GetNpcMovePos(moveName);
    }

    this.GetNpcPos = function (npcName) {
      for (let i = 0; i < npcList.length; i++) {
        const element = npcList[i];
        if (npcName.includes(element._YJNPC.GetName())) {
          return element._YJNPC.GetWorldPosDown();
        }
      }
      return null;
    }

    this.CheckNpc = function (npcName) {
      for (let i = 0; i < npcList.length; i++) {
        const element = npcList[i];
        if (npcName.includes(element._YJNPC.GetName())) {
          return element._YJNPC;
        }
      }
      return null;
    }

    this.GetNpcById = function (id) {
      for (let i = 0; i < npcList.length; i++) {
        const element = npcList[i];
        if (element.id == id) {
          return element._YJNPC;
        }
      }
      return null;
    }

    this.AddChat = function(npcName,chat){
      if(chat.message == ""){return;}
      // console.log("[%c"+ npcName +"%c]%c" +chat.mood + (chat.mood==""?"":"地")+ "%c说:%c"+chat.message,
      // "color:#0000ff","color:#000000","color:#00aaff","color:#000000","color:#ff1100");
      _this.$parent.$parent.$refs.chatRecodePanel.AddChat(npcName,chat.message);
      //向其他npc转发
      let data = {};
      data.from = npcName;
      data.action = chat.action;
      // data.target = chat.target;
      data.message = chat.message ;
      // for (let i = 0; i < npcList.length; i++) {
      //   const element = npcList[i];
      //   if (npcName != (element._YJNPC.GetName())) {
      //     if(element._YJNPC){
      //       element._YJNPC.SendMsg(JSON.stringify(data));
      //     }
      //   }
      // }
    }
    function LoadCompleted() {

      // _this.$parent.$parent.$refs.chatRecodePanel.AddChat("npcName","chat.message");

      if (_this._YJSceneManager == undefined) {
        console.log("！！！注意，不应该进入此判断 。 加载静态模型 ");
        return;
      }
      loadIndex++;
      LoadSceneModelByIndex();

      // console.error("npclist ",npcList);
    }

    function CreateSelectModel(id, modelData, state) {
      let modelName = modelData.modelName;
      let modelPath = modelData.modelPath;
      let modelType = modelData.modelType;

      // item.modelData.mapId = item.mapId;
      // item.modelData.userId = "GameManager";
      // item.state = "false";
      let assetId = modelData.assetId;

      let _pos = modelData.pos;
      let _rotaV3 = modelData.rotaV3;
      let _rota = modelData.rota;
      let _size = modelData.size;

      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      // let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);

      // unity旋转四元数转three角度
      let rota = new THREE.Quaternion(-_rota.x, _rota.y, _rota.z, -_rota.w);
      let v = new THREE.Euler();
      v.setFromQuaternion(rota);
      v.y += Math.PI;
      v.z *= -1;
      let rotaV3 = new THREE.Vector3(v.x, v.y, v.z);

      let size = new THREE.Vector3(_size.x, _size.y, _size.z);

      // NPC
      if (modelType == "NPC") {

        // let avatarData = LoadTxt(modelData.message.pointType);
        // console.error("加载 npc 角色数据 ", JSON.parse(modelData.message).pointType);
        let avatarName = JSON.parse(modelData.message).pointType;
        let avatarData = _this.$parent.GetAvatarData(avatarName);
        // avatarData = JSON.parse(JSON.stringify(avatarData)) ;
        // console.log("加载 NPC 角色数据 " ,avatarData);
        let _YJNPC = new YJNPC(_this, scene, id, avatarData, pos, rotaV3, size, scope);
        _YJNPC.SetMessage(modelData.message);

        id = JSON.parse(modelData.message).id;
        
        npcList.push({ id: id, avatarName: avatarName, _YJNPC: _YJNPC });
        LoadCompleted();
        return;
      }

    }

    async function LoadTxt(filePath, serverPath) {

      // console.log("加载文本", serverPath+"/" +filePath+"/"+filePath+"_avatar.txt");
      let fromData = new FormData();
      fromData.append(
        "dataPath",
        serverPath + "/" + filePath + "/" + filePath + "_avatar.txt"
      );
      let response = await LoadFile(fromData);
      if (response == null || response == "") {
        return;
      }
      // console.log("加载角色数据",response);
      return response
    }


    let loadIndex = 0;

    let _YJPathfindingCtrl = null;
    function Init() {
      InitFn(npcPath);
    }
    this.LoadNpc = (npcPath) => {
      //添加新的NPC前，先移除已有的
      this.Destroy();
      InitFn(npcPath);
    }

    this.Destroy = function () {
      if(npcList.length==0){return;}
      for (let i = 0; i < npcList.length; i++) {
        let element = npcList[i]._YJNPC;
        element.Destroy();
        element = undefined;
      }
      npcList.splice(0, npcList.length);
    }


    let modelDataList = [];
    async function InitFn(npcPath) {
      loadIndex = 0;
      // console.log(modelDataList);
      // console.error("准备加载npc " + npcPath);
      try {
        const res = await _this.$axios.get(npcPath);
        modelDataList = res.data.modelDataList;
 
        LoadSceneModelByIndex();
      } catch (error) {

      }
    }

    function LoadSceneModelByIndex() {
      if (modelDataList == null || modelDataList == undefined) { return; }

      if (loadIndex >= modelDataList.length) {
        // console.error("npc 加载完成==========");
        modelDataList = [];
        return;
      }
      let item = modelDataList[loadIndex];

      setTimeout(() => {
        CreateSelectModel(item.id, item, item.state);
      }, 40);
      // CreateSelectModel(item.id, item, item.state);
    }

    this.GetNavpath = function (fromPos, targetPos) {

      if (_YJPathfindingCtrl == null) {
        _YJPathfindingCtrl = new YJPathfindingCtrl(scene, _this.GetPublicUrl(), () => { });
      }
      return _YJPathfindingCtrl.GetNavpath(fromPos, targetPos);
    }
    Init();

  }
}

export { YJNPCManager };