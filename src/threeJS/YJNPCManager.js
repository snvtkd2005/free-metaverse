



import * as THREE from "three";


import { YJAnimModel } from "./loader/YJAnimModel";
import { YJBillboard } from "./model/YJBillboard";
import { YJHotPoint } from "./YJHotPoint";
import { YJ3DAudio } from "./YJ3DAudio";
import { YJLight } from "./YJLight";
import { YJUVanim } from "./YJUVanim";
import { YJUVanim2 } from "./YJUVanim2";
import { YJNPC } from "./YJNPC";
import { YJPathfindingCtrl } from "./pathfinding/YJPathfindingCtrl.js";

// 加载静态物体
class YJNPCManager {
  constructor(_this, scene, npcPath, callback) {


    let scope = this;
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
        console.log("加载 角色数据 000 ", JSON.parse(modelData.message).pointType);
        let avatarData = _this.$parent.GetAvatarData(JSON.parse(modelData.message).pointType);
        // avatarData = JSON.parse(JSON.stringify(avatarData)) ;
        // console.log("加载 NPC 角色数据 " ,avatarData);
        let _YJNPC = new YJNPC(_this, scene, id, avatarData, pos, rotaV3, size, scope);
        _YJNPC.SetMessage(modelData.message);
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
      if (_YJPathfindingCtrl == null) {
        _YJPathfindingCtrl = new YJPathfindingCtrl(scene, _this.GetPublicUrl(), () => { });
      }
      InitFn(npcPath);
    }
    this.LoadNpc = (npcPath) => {
      InitFn(npcPath);
    }
    let modelDataList = [];
    async function InitFn(npcPath) {
      loadIndex = 0;
      // console.log(modelDataList);
      // console.log("准备加载npc "+ npcPath);
      const res = await _this.$axios.get(npcPath);
      modelDataList = res.data.modelDataList;
      // console.log("modelDataList",modelDataList);
      LoadSceneModelByIndex();
    }

    function LoadSceneModelByIndex() {
      if (loadIndex >= modelDataList.length) {
        return;
      }
      let item = modelDataList[loadIndex];

      setTimeout(() => {
        // CreateSelectModel(item.id, item, item.state);
      }, 1000);
    }

    this.GetNavpath = function (fromPos, targetPos) {
      // if(_YJPathfindingCtrl == null){
      //   _YJPathfindingCtrl = new YJPathfindingCtrl(scene, _this.GetPublicUrl(), () => {});
      // }
      
      return _YJPathfindingCtrl.GetNavpath(fromPos, targetPos);
    }
    Init();

  }
}

export { YJNPCManager };