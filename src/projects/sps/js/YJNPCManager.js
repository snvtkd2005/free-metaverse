



import * as THREE from "three";


import { YJAnimModel } from "/@/threeJS/YJAnimModel";
import { YJBillboard } from "/@/threeJS/YJBillboard";
import { YJHotPoint } from "/@/threeJS/YJHotPoint";
import { YJ3DAudio } from "/@/threeJS/YJ3DAudio";
import { YJLight } from "/@/threeJS/YJLight";
import { YJUVanim } from "/@/threeJS/YJUVanim";
import { YJUVanim2 } from "/@/threeJS/YJUVanim2";
import { YJNPC } from "/@/threeJS/YJNPC";
import { YJPathfindingCtrl } from "/@/threeJS/pathfinding/YJPathfindingCtrl.js";

// 加载静态物体
class YJNPCManager {
  constructor(_this, scene, npcPath, callback) {


    let scope = this;

    let npcList = [];
    function LoadCompleted() {
      if (_this._YJSceneManager == undefined) {
        console.log("！！！注意，不应该进入此判断 。 加载静态模型 ");
        return;
      }
      loadIndex++;
      LoadSceneModelByIndex();
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
        console.log("加载 npc 角色数据 " ,JSON.parse(modelData.message).pointType);
        let avatarName = JSON.parse(modelData.message).pointType;
        let avatarData = _this.$parent.GetAvatarData(avatarName);
        // avatarData = JSON.parse(JSON.stringify(avatarData)) ;
        // console.log("加载 NPC 角色数据 " ,avatarData);
        let _YJNPC = new YJNPC(_this, scene, id, avatarData, pos, rotaV3, size, scope);
        _YJNPC.SetMessage(modelData.message);

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
      for (let i = 0; i < npcList.length; i++) {
        let element = npcList[i]._YJNPC;
        element.Destroy();
        element = undefined;
      }
      npcList.splice(0,npcList.length);
      // npcList = [];
    }


    let modelDataList = [];
    async function InitFn(npcPath) {
      return;
      loadIndex = 0;
      // console.log(modelDataList);
      console.log("准备加载npc " + npcPath);
      const res = await _this.$axios.get(npcPath);
      modelDataList = res.data.modelDataList;
      // console.log("modelDataList",modelDataList);
      LoadSceneModelByIndex();
    }

    function LoadSceneModelByIndex() {
      if(modelDataList == null || modelDataList == undefined){return;}

      if (loadIndex >= modelDataList.length) {
        console.log("npc 加载完成==========");
        modelDataList = [];
        // setTimeout(() => {
        //   for (let i = 0; i < npcList.length; i++) {
        //     const element = npcList[i];
        //     if(element.avatarName == "小孩"){
        //       element._YJNPC.ChangeAvatarBySameBone("mixman");
        //       return;
        //     }
        //   }
        // }, 5000);
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