



import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { YJAnimModel } from "./components/YJAnimModel";
import { YJBillboard } from "./model/YJBillboard";
import { YJHotPoint } from "./YJHotPoint";
import { YJ3DAudio } from "./YJ3DAudio";
import { YJLight } from "./YJLight";
import { YJUVanim } from "./YJUVanim";
import { YJUVanim2 } from "./YJUVanim2";
import { YJLoadModel } from "./YJLoadModel";
import { MeshBasicMaterial } from "three";
import { YJTransform } from "./YJTransform";
import { YJMeshRenderer } from "./components/YJMeshRenderer";
import { YJAnimator } from "./components/YJAnimator";
import { YJUVAnim3 } from "./components/YJUVAnim3.js";
import { YJScreen } from "./components/YJScreen.js";
import { YJWeapon } from "./components/YJWeapon.js";

import { YJCar } from "./model/YJCar.js";
import { YJTrigger } from "./YJTrigger.js";
import YJParticle from "./components/YJParticle";
import { YJAvatar } from "./components/YJAvatar";
import { YJNPC } from "./components/YJNPC";
// 加载静态物体
class YJLoadUserModelManager {
  constructor(_this, scene, camera, callback) {
    let scope = this;

    let uploadUrl = _this.$uploadUrl;

    let loadIndex = 0;
    let allTransform = [];
    let modelId = 0;
    // 每次进入游戏时，更新服务器上记录的模型
    let modelDataList = [];
    this.GetModelList = function () {
      modelDataList.splice(0, modelDataList.length);
      for (let i = 0; i < allTransform.length; i++) {
        const transform = allTransform[i].transform;
        modelDataList.push(transform.GetData());
      }
      console.error("保存 ", allTransform, modelDataList);
      return modelDataList;
    }
    this.GetAllTransformByModelType = function (modelType) {
      let list = [];
      for (let i = 0; i < allTransform.length; i++) {
        const transform = allTransform[i].transform;
        if (transform.GetData().modelType == modelType) {
          list.push({ id: transform.id, transform: transform });
        }
      }
      return list;
    }


    //#region 使用物理模拟判断是否与其他模型重叠，重叠时无法放置模型
    let Ammo = null;
    let _YJAmmo = null;
    const margin = 0.05;
    const STATE = { DISABLE_DEACTIVATION: 4 };
    let transformAux1;
    let cbContactResult;


    function InitAmmo() {
      Ammo = _YJGlobal.Ammo;
      transformAux1 = new Ammo.btTransform();
      _YJAmmo = _YJGlobal._YJAmmo;
      setupContactResultCallback();
    }
    let b_checkOverlap = true;
    let overlapArray = [];
    let oldoverlapArray = [];
    this.invaildArea = true;
    //试试判断与角色碰到的碰撞体
    function CheckOverlap() {
      if (!b_checkOverlap) { return; }
      //未碰到任何物体，表示腾空
      if (oldoverlapArray.length != 0 && overlapArray.length != 0) {

      } else {

      }
      //提取增加的
      let has = false;
      for (let i = 0; i < overlapArray.length && !has; i++) {
        const newItem = overlapArray[i];
        let tag = newItem.userData.tag;
        if (tag == "trigger") {
          if (newItem.modelType == "userModel") {
            has = true;
            // console.log(" 碰到其他物品 " );
          }
        }
      }
      scope.invaildArea = !has;
      overlapArray = [];
    }
    //角色刚体 碰到的物体
    function setupContactResultCallback() {

      cbContactResult = new Ammo.ConcreteContactResultCallback();

      cbContactResult.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {
        // console.log("正在 22 检查 是否有空余 ");

        let contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);

        const distance = contactPoint.getDistance();

        // console.log("contactPoint.getDistance()  =  " + distance);
        if (distance > 0.1) return;

        let colWrapper0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);
        let rb0 = Ammo.castObject(colWrapper0.getCollisionObject(), Ammo.btRigidBody);

        let colWrapper1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);
        let rb1 = Ammo.castObject(colWrapper1.getCollisionObject(), Ammo.btRigidBody);

        // console.log("rb0 = " , rb0);
        // console.log("rb1 = " , rb1);

        let threeObject0 = rb0.threeObject;
        let threeObject1 = rb1.threeObject;

        // console.log("rb1 = " , rb1);
        let tag = threeObject1.userData.tag;

        let has = false;
        for (let i = 0; i < overlapArray.length; i++) {
          const item = overlapArray[i];
          if (item == threeObject1) {
            has = true;
          }
        }
        if (!has) {
          overlapArray.push(threeObject1);
        }

        // console.log("碰撞到的物体，" + threeObject1.userData.tag);

        return;

      }

    }

    let physicsBody;

    this.CreateVolume = function (model, volume, _rotaY) {
      dragModel = model;
      physicsBody = _YJAmmo.YJCoustomBody(dragModel, new THREE.Vector3(volume.x, volume.y, volume.z));

      if (_rotaY != undefined) {
        rotaY = _rotaY;
      }
    }
    this.DelVolume = function (model) {

    }
    //#endregion


    function update() {
      // return;
      requestAnimationFrame(update);
      centerPosRaycast();
    }

    // 取消创建
    this.DelCreateModel = function (model) {
      dragModel = null;
      _this._YJSceneManager.clearGroup(model.GetModel());
    }
    // 选中已创建,即开始编辑
    this.EditorStart = function (transform) {
      // this.CreateVolume( model.GetModel(),model.modelItem.volume,model.modelItem.rotaV3.y);
      // _this._YJSceneManager.ClearCollider(model.GetModel());
      transform.EditorStart();
    }
    // 物体移动完成
    this.EditorEnd = function (transform) {
      transform.EditorEnd();
    }

    // 上传模型文件后生成
    this.ImportModel = function (modelData, callback) {

      // console.log("上传模型文件后生成 生成模型 ", modelData);
      CreateTransform(null, modelData, (object) => {
        if (callback) {
          callback(object);
        }
      });
    }
    // 点击界面生成模型预览
    this.LoadStaticModel = function (modelData, callback) {

      // console.log("点击界面生成模型 ", modelData);
      CreateTransform(null, modelData, (object) => {
        _this._YJSceneManager._YJTransformManager.attach(object.GetGroup());
        if (callback) {
          callback(object);
        }
      });
    }

    function CreateTransform(parent, modelData, callback) {

      let object = new YJTransform(_this, scene, "", null, null, modelData.name);
      let modelPath = modelData.modelPath;
      if (modelPath == undefined) {
        if (modelData.modelType == "NPC模型") {

        } else {
          if (callback) {
            callback(object);
          }
          return;
        }
      } else {
        if (modelData.modelPath.includes("http")) {

        } else if (modelData.modelPath.includes("models/player")) {
          modelPath = _this.$publicUrl + "farm/" + modelData.modelPath
        } else {
          modelPath = uploadUrl + modelData.modelPath;
        }
      }

      modelId++;
      object.id = modelId;
      let uuid = object.GetUUID();
      allTransform.push({ uuid: uuid, id: modelId, transform: object });
      object.SetPosRota(modelData.pos, modelData.rotaV3, modelData.scale);
      object.SetModelPath(modelData.modelPath);
      object.SetData(modelData.folderBase, modelData.modelType, modelId);
      object.modelData = JSON.parse(JSON.stringify(modelData));

      // if (modelData.message != undefined) {
      //   object.SetMessage(modelData.message);
      // }

      _this._YJSceneManager.AddNeedUpdateJS(object);
      // console.error("添加更新 AddNeedUpdateJS ",object);

      // 测试模型合批
      // let hasSame = _this._YJSceneManager.CheckTransform(modelData.modelPath, modelData, object);
      // if (hasSame && modelType == "静态模型") {
      //   allTransform.push({ uuid: object.GetUUID(), transform: object });
      //   if (callback) {
      //     callback();
      //   }
      //   return;
      // }


      let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object, true);
      object.AddComponent("MeshRenderer", MeshRenderer);

      if (modelData.modelType == "动画模型") {
        MeshRenderer.load(modelPath, (scope) => {
          let component = new YJAnimator(scope.GetModel(), scope.GetAnimations());
          object.AddComponent("Animator", component);

          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }
          if (callback) {
            callback(object);
          }
        }, (e) => {
          LoadError(uuid, callback, e);
        });
      } else if (modelData.modelType == "角色模型") {

        MeshRenderer.load(modelPath, (scope) => {
          let component = new YJAnimator(scope.GetModel(), scope.GetAnimations());
          object.AddComponent("Animator", component);

          let avatar = new YJAvatar(_this, object.GetGroup(), component);
          object.AddComponent("Avatar", avatar);

          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }

          if (callback) {
            callback(object);
          }
        }, (e) => {
          LoadError(uuid, callback, e, modelData);
        });
      } else if (modelData.modelType == "NPC模型") {

        if (modelData.message == undefined) {
          if (modelPath == undefined) {
            LoadError(uuid, callback);
            return;
          }
        } else {
          modelPath = modelData.message.data.avatarData.modelPath;
          if (modelPath == undefined) {
            LoadError(uuid, callback);
            return;
          }
        }
        // console.log(" modelPath ", modelPath);

        MeshRenderer.load(modelPath, (scope) => {
          let Animator = new YJAnimator(scope.GetModel(), scope.GetAnimations());
          object.AddComponent("Animator", Animator);

          let NPC = new YJNPC(_this, object.GetGroup(), Animator);
          object.AddComponent("NPC", NPC);

          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }

          if (callback) {
            callback(object);
          }
        }, (e) => {
          LoadError(uuid, callback, e);
        });
      } else if (modelData.modelType == "uv模型") {
        MeshRenderer.load(modelPath, (scope) => {
          let uvanim = new YJUVAnim3(_this, scope.GetModel());
          object.AddComponent("UVAnim", uvanim);
          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }

          if (callback) {
            callback(object);
          }
        }, () => {
          LoadError(uuid, callback);
        });
      } else if (modelData.modelType == "汽车模型") {
        object.RemoveComponent("MeshRenderer");
        let pos = modelData.pos.clone();
        let x = pos.x.toFixed(2);
        let z = pos.z.toFixed(2);
        let id = modelData.folderBase + "car" + x + "-" + z;
        let car = new YJCar(_this, scene, id, modelData.message.data,
          modelData.pos,
          modelData.rotaV3,
          new THREE.Vector3(1, 1, 1),
          null, (scope) => {
            if (callback) {
              callback(object);
            }
          }, object
        );
        object.AddComponent("Car", car);

        if (modelData.message != undefined) {
          object.SetMessage(modelData.message);
        }
      } else if (modelData.modelType == "装备模型") {
        MeshRenderer.load(modelPath, (scope) => {

          let _YJWeapon = new YJWeapon(_this, object.GetGroup(), object);
          // let meshTrigger = new YJTrigger(_this, object.GetGroup(), object, "weapon");
          // object.AddComponent("Trigger", meshTrigger);
          object.AddComponent("Weapon", _YJWeapon);

          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }

          if (callback) {
            callback(object);
          }
        });
      } else if (modelData.modelType == "屏幕模型") {
        MeshRenderer.load(modelPath, (scope) => {
          let _YJScreen = new YJScreen(_this, scope.GetModel(), "screen" + uuid);
          object.AddComponent("Screen", _YJScreen);

          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }

          if (callback) {
            callback(object);
          }
        });
      } else if (modelData.modelType == "粒子特效") {
        MeshRenderer.load(modelPath, (scope) => {
          let data = null;
          if (modelData.message != undefined) {
            data = (modelData.message.data);
          }
          // "particle"+uuid
          let _YJParticle = new YJParticle(_this, object.GetGroup(), object, data);
          object.AddComponent("Particle", _YJParticle);
          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }

          if (callback) {
            callback(object);
          }
        });
      } else {
        MeshRenderer.load(modelPath, () => {
          if (callback) {
            callback(object);
          }
        }, () => {
          LoadError(uuid, callback);
        });
      }

    }



    // 由 UpdateUserModel 调用。刷新服务器上记录的模型
    function LoadSceneModelByIndex() {
      if (loadIndex >= modelDataList.length) {
        _this._YJSceneManager.MargeStaticModel();
        return;
      }
      let item = modelDataList[loadIndex];
      // console.log(" 加载模型 ", loadIndex, item);

      // 以上判断是特殊模型，下面加载模型
      CreateSelectModel(scene, item, (model) => {
        loadIndex++;
        _this._YJSceneManager.AddProcess();
        LoadSceneModelByIndex();
      });
    }
    this.UpdateUserModel = function (data) {

    }
    function GetId() {
      var g = new Date().getTime(); //1675586194683
      let t = Math.floor(Math.random() * 10000);
      return g + "" + t;
    }

    function CreateSelectModel(parent, modelData, callback) {

      let _pos = modelData.pos;
      let _rotaV3 = modelData.rotaV3;
      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);

      // 动力学物体只能放到世界坐标系下
      let pos2 = parent.position.clone();
      pos.x += pos2.x;
      pos.y += pos2.y;
      pos.z += pos2.z;
      modelData.pos = pos;

      CreateTransform(parent, modelData, (object) => {
        if (object) {
          object.EditorEnd();
        }
        if (callback) {
          callback(object);
        }
      });
      return;
    }
    function LoadError(uuid, callback, e, modelData) {
      // console.log("加载模型出错 22 " + uuid,modelData, e, allTransform);
      loadIndex++;
      for (let i = allTransform.length - 1; i >= 0; i--) {
        const elment = allTransform[i].transform;
        if (elment.GetUUID() == uuid) {
          allTransform.splice(i, 1);
          if (callback) {
            callback();
          }
          return;
        }
      }
    }

    //#region 
    //#endregion

    //#region 添加 删除 修改 用户摆放模型

    this.AddUserModel = function (item, local, model) {


    }
    // 由主控发送坐标到服务器，服务器转发进行同步
    this.ReceiveModelPos = function (id, data) {
      let { pos, rotaV3 } = data;
      for (let i = allTransform.length - 1; i >= 0; i--) {
        const elment = allTransform[i];
        if (elment.id == id) {
          let transform = elment.transform;
          transform.SetPos(pos, rotaV3);
          return;
        }
      }
    }
    this.EditorUserModel = function (sceneState) {
      for (let i = allTransform.length - 1; i >= 0; i--) {
        const elment = allTransform[i];
        if (elment.id == sceneState.id) {
          // console.log(" 同步模型 ",elment.id, sceneState.id,sceneState);
          let state = sceneState.state;
          let transform = elment.transform;
          if (state != undefined) {
            transform.Dync(sceneState);
          }
        }
      }
    }
    let delModelCallback;
    this.SetDelModelHandler = function (callback) {
      delModelCallback = callback;
    }
    this.DelUserModel = function (transform) {
      // console.log(transform);
      let find = false;
      for (let i = allTransform.length - 1; i >= 0 && !find; i--) {
        const elment = allTransform[i].transform;
        if (elment.GetUUID() == transform.GetUUID()) {
          if (delModelCallback) {
            delModelCallback();
          }
          allTransform.splice(i, 1);
          find = true;

          transform.Destroy();
        }
      }
    }

    // 加载单个场景的模型
    this.CallLoadSceneModelByIndex = function (data) {
      modelDataList = data;
      // console.error("  刷新 用户自定义模型 111 ", modelDataList, modelDataList.length);
      if (modelDataList.length == undefined) {
        return;
      }
      loadIndex = 0;
      LoadSceneModelByIndex();
    }


    // 删除地图id下的模型，直接删除group
    this.RemoveMetaWorldSceneModel = function (mapId) {
      for (let i = 0; i < metaWorldModelDataList.length; i++) {
        const element = metaWorldModelDataList[i];
        if (element.mapId == mapId) {
          _this._YJSceneManager.ClearMesh(element.group);
          metaWorldModelDataList.splice(i, 1);
          return;
        }
      }
    }

    let metaWorldModelDataList = [];
    this.AddLoadMetaWorldSceneModel = function (mapId, data) {

      let has = false;
      let group = null;
      let modelList = [];
      for (let i = 0; i < metaWorldModelDataList.length && !has; i++) {
        const element = metaWorldModelDataList[i];
        if (element.mapId == mapId) {
          has = true;
          for (let j = 0; j < data.length; j++) {
            element.modelList.push(data[j]);
          }
          modelList = element.modelList;
          group = element.group;
        }
      }
      if (!has) {
        modelList = data;
        //创建当前地图块的group
        let pos = _this._YJSceneManager.CallMapIdToPos(mapId);
        group = new THREE.Group();
        scene.add(group);
        group.position.set(pos.x, pos.y, pos.z);
        metaWorldModelDataList.push({ group: group, mapId: mapId, modelList: modelList });
      }

      // if (metaWorldModelDataList.length == undefined) {
      //   return;
      // }

      // console.error("  刷新 开放世界地图模型 ", metaWorldModelDataList, metaWorldModelDataList.length);
      // console.error("  刷新 开放世界地图模型 ", mapId, modelList, modelList.length);
      LoadLoadMetaWorldSceneModelByIndex(group, mapId, modelList);
    }

    function LoadLoadMetaWorldSceneModelByIndex(group, mapId, modelList) {
      if (0 == modelList.length) {
        // _this._YJSceneManager.MargeStaticModel();
        return;
      }


      let item = modelList[0];
      // console.log(" 加载模型 ", item);

      // 以上判断是特殊模型，下面加载模型
      CreateSelectModel(group, item, (model) => {
        modelList.splice(0, 1);
        // _this._YJSceneManager.AddProcess();
        LoadLoadMetaWorldSceneModelByIndex(group, mapId, modelList);
      });
    }
    //#endregion


    function equerPos(pos1, pos2) {
      return pos1.x == pos2.x && pos1.y == pos2.y && pos1.z == pos2.z;
    }

    let rotaY = 0;
    this.RotaY = function (f) {
      rotaY = f;
    }

    var mouse = new THREE.Vector2();

    let canRaycast = true;
    let raycaster, hit;
    // 当前选中的模型设为可拖拽模型
    let dragModel = null;
    function centerPosRaycast() {
      return;
      if (!canRaycast) { return; }
      if (_this._YJSceneManager.GetLandCollider().length == 0) { return; }

      // console.log( _this._YJSceneManager.GetLandCollider());
      // mouse.x = (window.innerWidth/2 / window.innerWidth) * 2 - 1;
      // mouse.y = -(window.innerHeight/2 / window.innerHeight) * 2 + 1;
      // 在平面中心靠上位置射线检测，与地面进行检测，返回碰撞点，设置模型位置到碰撞点上
      mouse.x = 0;
      mouse.y = 0.4;

      // console.log(" in Mouse move  " +mouse.x + " " + mouse.y );

      raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(
        // scene,
        // scene.children,

        _this._YJSceneManager.GetLandCollider(),
        // _this.pointsParent.children,
        true
      );
      // console.log(" 点击 intersects 內 热点", intersects);

      if (intersects.length > 0) {
        // hit = GetAcitveObjectFromIntersects(intersects);
        // if(!hit){return;}
        let hitPoint = GetAcitveObjectFromIntersects(intersects);
        if (!hitPoint) { return; }
        if (dragModel) {

          // dragModel.position.set( 0, 0, 0 );
          // dragModel.position.copy(hitPoint.point);

          if (physicsBody) {
            _YJAmmo.SetPhysicBodyPos(physicsBody, hitPoint.point, rotaY);
            _YJAmmo.checkContactOverlap(physicsBody, cbContactResult);
            CheckOverlap();
            physicsBody.volume.material.color =
              scope.invaildArea ? new THREE.Color(0xffffff) : new THREE.Color(0xff0000);

            // console.log(" 是否在有效区域 ，" ,scope.invaildArea);

          }

          // let pos =  hitPoint.point.clone().add( hitPoint.normal );
          // dragModel.lookAt(pos);

          // dragModel.lookAt(hitPoint.normal);

          // dragModel.position.copy( hitPoint.point ).add( hitPoint.normal );
          // dragModel.position.copy( hitPoint.point ).add( hitPoint.normal );
          // dragModel.lookAt( hitPoint.point.clone().add( hitPoint.normal ));

          // dragModel.rotation.x += Math.PI/2;
          // dragModel.rotation.z -= Math.PI/2;

          // dragModel.lookAt(hitPoint.normal);

          // dragModel.rotation.set(hitPoint.normal.x,hitPoint.normal.y,hitPoint.normal.z);
          // dragModel.rotation.copy(hitPoint.normal);
        }
        // console.log(" 点击 pointsParent 內 热点", hit.name);

      } else {

      }
    }

    function GetAcitveObjectFromIntersects(intersects) {
      for (let i = 0; i < intersects.length; i++) {
        const element = intersects[i].object;
        if (element.name.includes("land")) {
          // console.log(" 碰撞信息 ",intersects[i]);
          return {
            point: intersects[i].point,
            normal: intersects[i].face.normal,
          }
          // return element;
        }
      }
      return null;
    }

    function Init() {

      _Global.addEventListener("3d加载完成", () => {
        for (let i = 0; i < allTransform.length; i++) {
          const transform = allTransform[i].transform;
          transform.Start();
        }
      });

      InitAmmo();
      update();
    }

    Init();

  }
}

export { YJLoadUserModelManager };