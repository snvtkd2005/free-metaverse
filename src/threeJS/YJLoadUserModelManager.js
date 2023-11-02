



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

// 加载静态物体
class YJLoadUserModelManager {
  constructor(_this, scene, camera, callback) {
    let scope = this;



    let loadIndex = 0;
    let allModel = [];
    let modelDataList = [];

    // 每次进入游戏时，更新服务器上记录的模型
    let updateDataList = [];


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
          if(newItem.modelType == "userModel"){
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

    this.CreateVolume = function (model, volume,_rotaY) {
      dragModel = model;
      physicsBody = _YJAmmo.YJCoustomBody(dragModel, new THREE.Vector3(volume.x,volume.y,volume.z)); 
      
      if(_rotaY != undefined){
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
    // 选中已创建
    this.SelectModel = function (model) {
      this.CreateVolume( model.GetModel(),model.modelItem.volume,model.modelItem.rotaV3.y);
      _this._YJSceneManager.ClearCollider(model.GetModel());
    }
    // 放下确定
    this.CreateCollider = function (model) {
      _this._YJSceneManager.clearObject( dragModel.getObjectByName("检测刚体"));
      dragModel = null;
      model.CreateCollider();
      rotaY = 0;
    }

    // 点击界面生成模型预览
    this.LoadStaticModel = function (item, callback) {
      let modelPath = _this.GetPublicUrl() + item.modelPath;
      let modelName = item.name;
      let _pos = item.pos;
      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let size = new THREE.Vector3(1, 1, 1);

      let _YJLoadModel = new YJLoadModel(_this, scene);
      _YJLoadModel.SetVolume(item.volume);
      _YJLoadModel.load(modelName, modelPath, pos, rotaV3, size, false, null, callback);
    }

    // 由 UpdateUserModel 调用。刷新服务器上记录的模型
    function LoadSceneModelByIndex() {
      if (loadIndex >= updateDataList.length) {
        return;
      }
      let item = updateDataList[loadIndex];
      // 以上判断是特殊模型，下面加载模型
      CreateSelectModel(item.id, item, (model) => {
        scope.AddUserModel(item, false, model);
        loadIndex++;
        LoadSceneModelByIndex();
        model.CreateTrigger();
      });
    }
    function GetId() {
      var g = new Date().getTime(); //1675586194683
      let t = Math.floor(Math.random() * 10000);
      return g + "" + t;
    }

    function CreateSelectModel(id, modelData, callback) {
      // let modelName = modelData.modelName;
      let modelName = modelData.name;
      let modelPath = _this.GetPublicUrl() + modelData.modelPath;
      let modelType = modelData.modelType;

      // item.modelData.mapId = item.mapId;
      // item.modelData.userId = "GameManager";
      // item.state = "false";
      let assetId = modelData.assetId;

      let _pos = modelData.pos;
      let _rotaV3 = modelData.rotaV3;
      let _rota = modelData.rota;
      // let size = modelData.size;
      let size = new THREE.Vector3(1, 1, 1);

      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);


      // 带动画的模型
      if (modelType == "anim") {
        let animModel = new YJAnimModel(_this, scene, id, modelName, _this.GetPublicUrl() + modelPath, pos, rotaV3, size, modelData.message);
        if (modelData.message != undefined && modelData.message.indexOf("animType") > -1) {
          animModel.SetMessage(modelData.message);
          _this._YJSceneManager.addAnimModelJS(animModel);
        }

        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }

      // UV动效的模型
      if (modelType == "UVanim") {
        let js = new YJUVanim2(_this, scene, id, modelName, _this.GetPublicUrl() + modelPath, pos, rotaV3, size);
        // let js = new YJUVanim(_this, scene, id, modelName, _this.GetPublicUrl() + modelPath, pos, rotaV3, size);
        js.SetMessage(modelData.message);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }

      // 广告牌
      if (modelType == "Billboard") {
        let Billboard = new YJBillboard(_this, scene, id, _this.GetPublicUrl() + modelName, _this.GetPublicUrl() + modelPath, pos, rotaV3, size);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }
      // 旋转广告牌,角色靠近自动旋转
      if (modelType == "TriggerArea") {
        let _YJHotPoint = new YJHotPoint(_this, scene, id, modelName, _this.GetPublicUrl() + modelPath, pos, rotaV3, size, () => {

          _this._YJSceneManager.AddProcess();
          loadIndex++;
          LoadSceneModelByIndex();

        });
        _YJHotPoint.SetData(_this.$parent.avatarData.hotPointData.triggerAreaRotaSpeed);
        _YJHotPoint.SetMessage(modelData.message);

        _this._YJSceneManager.addHotPointJS(_YJHotPoint);
        return;
      }

      // 灯光
      if (modelType == "light") {
        let _YJLight = new YJLight(_this, scene, id, pos, rotaV3, size);
        _YJLight.SetMessage(modelData.message);
        // console.log("加载灯光" + modelData.message);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }




      // 以上判断是动画模型或带交互的模型，下面是静态模型
      let _YJLoadModel = new YJLoadModel(_this, scene);
      _YJLoadModel.SetVolume(modelData.volume);
      _YJLoadModel.load(modelName, modelPath, pos, rotaV3, size, true, modelData, callback);

    }

    //#region 
    //#endregion

    //#region 添加 删除 修改 用户摆放模型

    this.AddUserModel = function (item, local, model) {
      item = JSON.parse(JSON.stringify(item));
      if (local) {
        item.id = GetId();
        model.modelItem.id = item.id;
        if (_YJGlobal._YJDyncManager) {
          _YJGlobal._YJDyncManager.SendUserModels(item, "添加");
        }
      } else {
      }
      modelDataList.push(item);
      allModel.push({ id: model.modelItem.id, mesh: model });
      // console.log(" 添加用户模型数据 ", modelDataList);
      // console.log(" 添加用户模型mesh ", allModel);
      // localStorage.setItem("userModel", JSON.stringify(modelDataList));
    }

    this.EditorUserModel = function (item, local) {
      let has = false;
      for (let i = modelDataList.length - 1; i >= 0 && !has; i--) {
        let elment = modelDataList[i];
        if (elment.id == item.id) {
          elment = item;
          if (local) {
            if (_YJGlobal._YJDyncManager) {
              _YJGlobal._YJDyncManager.SendUserModels(item, "修改");
            }
          } else {
            allModel[i].mesh.SetPosRota(elment.pos, elment.rotaV3);
          }
          has = true;
        }
      }
    }
    let delModelCallback;
    this.SetDelModelHandler = function (callback) {
      delModelCallback = callback;
    }
    this.DelUserModel = function (item, local) {
      let find = false;
      for (let i = modelDataList.length - 1; i >= 0 && !find; i--) {
        const elment = modelDataList[i];
        if (elment.id == item.id) {
          if (local) {
            if (_YJGlobal._YJDyncManager) {
              _YJGlobal._YJDyncManager.SendUserModels(item, "删除");
            }
          } else {
            _this._YJSceneManager.clearGroup(allModel[i].mesh.GetModel());

            if (delModelCallback) {
              delModelCallback();
            }
          }
          allModel.splice(i, 1);
          modelDataList.splice(i, 1);
          find = true;
        }
      }
      // localStorage.setItem("userModel", JSON.stringify(modelDataList));
    }

    // 接收同步后其他客户端更新
    this.UpdateUserModel = function (data) {
      if (data.title == "刷新") {
        updateDataList = (data.userModels);
        // console.error("  刷新 用户自定义模型 111 ", updateDataList);
        LoadSceneModelByIndex();
      }
      if (data.title == "添加") {
        CreateSelectModel(data.userModelId, data.userModel, (model) => {
          this.AddUserModel(data.userModel, false, model);
          model.CreateTrigger();

        });
      }
      if (data.title == "删除") {
        this.DelUserModel(data.userModel, false);
      }
      if (data.title == "修改") {
        this.EditorUserModel(data.userModel, false);
      }
    }

    //#endregion


    function equerPos(pos1, pos2) {
      return pos1.x == pos2.x && pos1.y == pos2.y && pos1.z == pos2.z;
    }

    function LoadCompleted() {
      if (_this._YJSceneManager == undefined) {
        console.log("！！！注意，不应该进入此判断 。 加载静态模型 ");
        return;
      }
      if (modelDataList.length < 1) {
        // console.log(" 只加载单独的模型 ");
        return;
      }

      // console.log(" 加载模型成功，加载下一个 ");
      // _this._YJSceneManager.AddProcess();
      loadIndex++;
      LoadSceneModelByIndex();
    }

    let rotaY = 0;
    this.RotaY = function(f){
      rotaY = f; 
    }

    var mouse = new THREE.Vector2();

    let canRaycast = true;
    let raycaster, hit;
    // 当前选中的模型设为可拖拽模型
    let dragModel = null;
    function centerPosRaycast() {
      if (!canRaycast) { return; }
      if( _this._YJSceneManager.GetLandCollider().length == 0){return;}

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
            _YJAmmo.SetPhysicBodyPos(physicsBody, hitPoint.point,rotaY);
            _YJAmmo.checkContactOverlap(physicsBody, cbContactResult);
            CheckOverlap();
            physicsBody.volume.material.color = 
            scope.invaildArea? new THREE.Color(0xffffff) : new THREE.Color( 0xff0000 );

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
      InitAmmo();


      update();





      return;
      let aa = localStorage.getItem("userModel");
      // console.error(" 加载用户自定义模型 ",aa);
      if (aa == null) { return; }

      modelDataList = JSON.parse(aa);
      console.error(" 加载用户自定义模型 222 ", modelDataList);
      LoadSceneModelByIndex();

    }

    Init();

  }
}

export { YJLoadUserModelManager };