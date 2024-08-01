



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
import { YJTransform } from "./components/YJTransform";
import { YJMeshRenderer } from "./components/YJMeshRenderer";
import { YJAnimator } from "./components/YJAnimator";
import { YJUVAnim3 } from "./components/YJUVAnim3.js";
import { YJScreen } from "./components/YJScreen.js";
import { YJWeapon } from "./components/YJWeapon.js";
import { YJInteractive } from "./components/YJInteractive.js";

import { YJCar } from "./model/YJCar.js";
import { YJParticle } from "./components/YJParticle";
import { YJAvatar } from "./components/YJAvatar";
import { YJNPC } from "./components/YJNPC";
import { YJTransformGroup } from "./components/YJTransformGroup";
import { YJTrailRenderer } from "/@/threeJS/components/YJTrailRenderer.js";
import * as Mathf from "/@/utils/mathf.js";
import { YJShader } from "./components/YJShader";
import { YJGeometry } from "./components/YJGeometry";
import { RandomInt } from "../utils/utils";
import { YJAnimatorMMD } from "./components/YJAnimatorMMD";
import { YJMeshMerged } from "./YJMeshMerged";

// 加载静态物体
class YJLoadUserModelManager {
  constructor(_this, scene, camera, callback) {
    let scope = this;

    let loadIndex = 0;
    let allTransform = [];
    // 每次进入游戏时，更新服务器上记录的模型
    let modelDataList = [];
    this.GetModelList = function () {
      modelDataList.splice(0, modelDataList.length);
      for (let i = 0; i < allTransform.length; i++) {
        const transform = allTransform[i].transform;
        modelDataList.push(transform.GetData());
      }
      // console.error("保存 ", allTransform, modelDataList);
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

    this.AllNpcTransformNav = function () {
      for (let i = 0; i < allTransform.length; i++) {
        const transform = allTransform[i].transform;
        if (transform.GetData().modelType == "NPC模型") {
          transform.PathfindingCompleted();
        }
      }
    }
    this.GetTransformByUUID = function (uuid) {
      console.log("场景中所有模型", allTransform);
      for (let i = 0; i < allTransform.length; i++) {
        if (allTransform[i].uuid == uuid) {
          return allTransform[i].transform;
        }
      }
    }
    this.GetTransformByName = function (modelName) {
      console.log("场景中所有模型", allTransform);
      let sameName = [];
      for (let i = 0; i < allTransform.length; i++) {
        if (allTransform[i].modelName == modelName) {
          sameName.push(allTransform[i].transform);
        }
      }
      return sameName;
    }
    this.GetTransformByID = function (id) {
      for (let i = 0; i < allTransform.length; i++) {
        if (allTransform[i].id == id) {
          return allTransform[i].transform;
        }
      }
      return null;
    }

    this.GetTransformByModelId = function (modelId) {
      for (let i = 0; i < allTransform.length; i++) {
        if (allTransform[i].modelId == modelId) {
          return allTransform[i].transform;
        }
      }
      return null;
    }

    this.GetAllTransformByNameType = function (nameType) {
      let a = [];
      for (let i = 0; i < allTransform.length; i++) {
        if (allTransform[i].transform.nameType == nameType && allTransform[i].transform.GetActive()) {
          a.push(allTransform[i].transform);
        }
      }
      return a;
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
      // for (let i = 0; i < allTransform.length; i++) {
      //   const transform = allTransform[i].transform;
      //   if(transform.GetData().name == "cs场景模型001"){
      //     console.log( " cs场景模型001 " + transform.id);
      //   }
      // }
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

      console.log("上传单品模型文件后生成 生成模型 ", modelData);
      CreateTransform(null, modelData, (object) => {
        if (callback) {
          callback(object);
        }
        _Global.applyEvent("modelList", scope.GetModelList());

      });
    }
    // 点击界面生成模型预览
    this.LoadStaticModel = function (modelData, callback) {

      console.log("点击界面生成模型 ", modelData);
      CreateTransform(null, modelData, (object) => {
        _this._YJSceneManager._YJTransformManager.attach(object.GetGroup());
        if (callback) {
          callback(object);
        }
        _Global.applyEvent("modelList", scope.GetModelList());

      });
    }
    this.LoadStaticModel2 = function (modelData, callback) {

      // console.log("点击界面生成模型 ", modelData);
      CreateTransform(null, modelData, (object) => {
        if (callback) {
          callback(object);
        }
      });
    }
    let siblingIndex = 0;
    function CreateTransform(parent, modelData, callback, _Id, mapId) {
      // console.error(" load manager 加载模型 ",parent, modelData);

      let object = new YJTransform(_this, parent == null ? scene : parent, "", null, null, modelData.name);
      // let object = new YJTransform(_this, scene, "", null, null, modelData.name);
      let id = 0;
      if (_Id != undefined) {
        id = _Id;
      } else {
        id = new Date().getTime() + RandomInt(10000, 100000);
      }
      if (modelData.id == undefined || modelData.id < 100000) {
        modelData.id = id;
      } else {
        id = modelData.id;
      }

      object.id = id;
      let uuid = object.GetUUID();
      if (parent == null || parent == scene) {
        allTransform.push({ uuid: uuid, id: id, modelName: modelData.name, modelId: modelData.modelId, transform: object });
      }

      object.modelData = JSON.parse(JSON.stringify(modelData));
      object.SetPosRota(modelData.pos, modelData.rotaV3, modelData.scale);
      object.SetModelPath(modelData.modelPath);
      object.SetData(modelData, id, mapId);
      _this._YJSceneManager.AddNeedUpdateJS(object);

      let modelPath = modelData.modelPath;
      let modelType = modelData.modelType;
      if (modelPath == undefined) {

        if (modelType == "NPC模型"
          || modelType == "交互模型"
          || modelType == "粒子特效"
          || modelType == "汽车模型"
        ) {

        } else {
          if (modelType == "组合") {
            //加载组合
            CreateGroup(object, modelData.folderBase);
            if (callback) {
              callback(object);
            }
            return;
          }


          if (modelType == "拖尾模型") {
            let component = new YJTrailRenderer(_this, _Global.YJ3D.scene, object.GetGroup(), object);
            object.AddComponent("Trail", component);
          }

          if (modelType == "几何体模型") {
            let component = new YJGeometry(_this, object.GetGroup(), object);
            object.AddComponent("Geometry", component);
          }

          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }
          if (callback) {
            callback(object);
          }
          return;
        }
      } else {
        if (modelData.modelPath.includes("http")) {

        } else {
          modelPath = _this.$uploadUrl + modelData.modelPath;
        }
      }


      // console.error("添加更新 AddNeedUpdateJS ",object);

      if (!_Global.setting.inEditor) {
        // 测试模型合批
        let hasSame = _this._YJSceneManager.CheckTransform(modelData.modelPath, modelData, object);
        if (hasSame && modelType == "静态模型" && modelData.modelId == "") {
          allTransform.push({ uuid: object.GetUUID(), transform: object });
          if (callback) {
            callback();
          }
          return;
        }
      }


      let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object, false, false, modelData.modelType);
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
          if (modelPath.includes("pmx")) {
            let component = new YJAnimatorMMD(object.GetGroup(), modelPath);
            object.AddComponent("Animator", component);
          } else {
            let component = new YJAnimator(scope.GetModel(), scope.GetAnimations());
            object.AddComponent("Animator", component);
            let avatar = new YJAvatar(_this, object.GetGroup(), component);
            object.AddComponent("Avatar", avatar);
          }


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
        // console.log(" npc模型 modeldata ", modelData);

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
          let uvanim = new YJUVAnim3(_this, scope.GetModel(), object.GetGroup());
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
      } else if (modelData.modelType == "材质模型") {
        MeshRenderer.load(modelPath, (scope) => {
          let com = new YJShader(_this, object.GetGroup(), scope.GetModel());
          object.AddComponent("Shader", com);
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
        let pos = modelData.pos;
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
      } else if (modelData.modelType == "武器模型") {
        MeshRenderer.load(modelPath, (scope) => {

          let _YJWeapon = new YJWeapon(_this, object.GetGroup(), object);
          object.AddComponent("Weapon", _YJWeapon);

          if (modelData.message != undefined) {
            object.SetMessage(modelData.message);
          }

          if (callback) {
            callback(object);
          }
        });
      } else if (modelData.modelType == "交互模型") {
        if (modelPath != undefined) {
          MeshRenderer.load(modelPath, (scope) => {
          });
        }
        let _YJInteractive = new YJInteractive(_this, object.GetGroup(), object);
        object.AddComponent("Interactive", _YJInteractive);
        if (modelData.message != undefined) {
          object.SetMessage(modelData.message);
        }
        if (callback) {
          callback(object);
        }
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
        // console.error(" load manager 粒子特效 ", modelData);

        MeshRenderer.load(modelPath, (scope) => {
          let data = null;
          if (modelData.message != undefined) {
            data = (modelData.message.data);
          }
          // "particle"+uuid
          let _YJParticle = new YJParticle(_this, object.GetGroup(), object);
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
          object.SetMessage(modelData.message);
          if (callback) {
            callback(object);
          }
        }, () => {
          LoadError(uuid, callback);
        });
      }

    }


    let skillGroupList = [];
    this.LoadSkillGroup = function (folderBase, callback) {
      for (let i = 0; i < skillGroupList.length; i++) {
        const element = skillGroupList[i];
        if (element.folderBase == folderBase) {
          let modelData = JSON.parse(JSON.stringify(element.transform.modelData));
          modelData.active = true;
          let npcId = new Date().getTime();
          this.DuplicateModelNPC(modelData, (copy) => {
            if (callback) {
              callback(copy);
            }
          }, npcId);
          return;
        }
      }
      let modelData = {
        folderBase: folderBase,
        modelType: "组合",
        pos: { x: 0, y: 0, z: 0 },
        rotaV3: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      }
      this.LoadStaticModel2(modelData, (model) => {
        skillGroupList.push({ folderBase: folderBase, transform: model });
        if (callback) {
          callback(model);
        }
      });
    }

    let loadQueue = [];
    this.RemoveSkillByFolderBase = function (folderBase, msg, callback) {
      for (let i = 0; i < modelPool.length; i++) {
        const element = modelPool[i];
        if (element.folderBase == folderBase) {
          if (msg.title == "移除静态模型") {
            element.mergedJS.removePoint(msg.id);
          }
          return;
        }
      }

    }


    // 静态模型合批
    this.LoadSkillFolderBaseByMSG = function (folderBase, msg) {
      for (let i = 0; i < modelPool.length; i++) {
        const element = modelPool[i];
        if (element.folderBase == folderBase) {
          if (msg.title == "生成静态模型") {
            element.mergedJS.addPoint(msg.id, msg.pos, msg.scale);
          }
          return;
        }
      }

      for (let i = 0; i < loadQueue.length; i++) {
        const element = loadQueue[i];
        if (element.folderBase == folderBase) {
          element.msg.push(msg);
          return;
        }
      } 
      loadQueue.push({ folderBase, msg: [], callback: [] });
      let path = _Global.YJ3D.$uploadUrl + folderBase + "/" + "data.txt" + "?time=" + new Date().getTime();
      _Global.YJ3D._YJSceneManager.LoadAssset(path, (modelData) => {
        modelData.pos = { x: 0, y: 0, z: 0 };
        modelData.rotaV3 = { x: 0, y: 0, z: 0 };
        modelData.scale = { x: 1, y: 1, z: 1 };
        this.LoadStaticModel2(modelData, (model) => { 
          AttachToPool(folderBase, modelData.modelType, model.GetGroup());
        });
      });
    }
    let modelPool = []; //静态模型
    function GetInPool(folderBase, modelType) {
      for (let i = 0; i < modelPool.length; i++) {
        const element = modelPool[i];
        if (element.folderBase == folderBase && element.modelType == modelType) {


        }
      }
    }
    // 添加到对象池
    function AttachToPool(folderBase, modelType, model) {

      if (modelType == "静态模型") {
        // 静态模型添加到模型合并中做instance以降低drawcall
        let _YJMeshMerged = new YJMeshMerged(model);
        for (let i = 0; i < loadQueue.length; i++) {
          const element = loadQueue[i];
          if (element.folderBase == folderBase) {
            let idList = [];
            let posList = [];
            let scaleList = [];
            for (let j = element.msg.length - 1; j >= 0; j--) {
              let msg = element.msg[j];
              if (msg.title == "生成静态模型") {
                idList.push(msg.id);
                posList.push(msg.pos);
                scaleList.push(msg.scale);
              }
            }
            _YJMeshMerged.ReMerged(idList, posList, scaleList);
            continue;
          }
        }

        modelPool.push({ modelType, folderBase, mergedJS: _YJMeshMerged });
      }
    }
    this.LoadSkillByFolderBase = function (folderBase, callback) {

      for (let i = 0; i < skillGroupList.length; i++) {
        const element = skillGroupList[i];
        if (element.folderBase == folderBase) {
          let modelData = JSON.parse(JSON.stringify(element.transform.modelData));
          // modelData.active = false;
          let npcId = new Date().getTime();
          this.DuplicateModelNPC(modelData, (model) => {
            if (callback) {
              callback(model);
            }
          }, npcId);
          return;
        }
      } 
      let path = _Global.YJ3D.$uploadUrl + folderBase + "/" + "data.txt" + "?time=" + new Date().getTime();
      _Global.YJ3D._YJSceneManager.LoadAssset(path, (modelData) => {
        modelData.pos = { x: 0, y: 0, z: 0 };
        modelData.rotaV3 = { x: 0, y: 0, z: 0 };
        modelData.scale = { x: 1, y: 1, z: 1 };
        // modelData.active = false;
        this.LoadStaticModel2(modelData, (model) => {
          skillGroupList.push({ folderBase: folderBase, transform: model });
          if (callback) {
            callback(model);
          }
        });
      });
    }


    // 场景中加载组合
    async function CreateGroup(tranform, folderBase) {

      let res = await _this.$axios.get(
        _this.$uploadGroupUrl + folderBase + "/" + "scene.txt" + "?time=" + new Date().getTime()
      );

      let data = res.data;
      let sceneModelsData = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        sceneModelsData.push((element));
      }
      LoadGroupModelByIndex(tranform, sceneModelsData);
    }

    function LoadGroupModelByIndex(tranform, sceneModelsData) {
      if (sceneModelsData.length == 0) {
        tranform.SetMessage(null);
        //组合加载完成
        let children = tranform.GetChildren();
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          let parentId = child.GetData().parent;
          if (parentId) {
            for (let j = 0; j < children.length; j++) {
              const parent = children[j];
              if (parentId == parent.GetData().id) {
                child.SetParent(parent.GetGroup());
              }
            }
          }
        }
        return;
      }
      let modelData = sceneModelsData[0];
      CreateTransform(tranform.GetGroup(), modelData, (object) => {
        tranform.AddChildren(object);
        sceneModelsData.splice(0, 1);
        LoadGroupModelByIndex(tranform, sceneModelsData);
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
    // 由主控发送单个模型同步信息到服务器，服务器转发进行同步
    this.ReceiveModel = function (id, title, data) {
      for (let i = allTransform.length - 1; i >= 0; i--) {
        const elment = allTransform[i];
        if (elment.id == id) {
          // npc坐标
          if (title == "pos") {
            let { pos, rotaV3, actionScale } = data;
            let transform = elment.transform;
            transform.SetPos(pos, rotaV3);
            transform.GetComponent("NPC").SetActionScale(actionScale);
            transform.GetComponent("NPC").applyEvent("pos",pos);
          }
          // npc阵营
          if (title == "camp") {
            let camp = data;
            let transform = elment.transform; 
            transform.GetComponent("NPC").GetBaseData().camp = camp;
            transform.GetComponent("NPC").ResetNameColor();
          }
          // npc巡逻点索引
          if (title == "navPosIndex") {
            let { navPosIndex } = data;
            let transform = elment.transform;
            let npcComponent = transform.GetComponent("NPC");
            if (npcComponent) {
              npcComponent.SetNavPosByPosIndex(navPosIndex);
            }
          }
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

    this.UpdateTransfrom = function () {
      for (let i = allTransform.length - 1; i >= 0; i--) {
        allTransform[i].transform.ClearOldTransData();
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
      _Global.applyEvent("modelList", scope.GetModelList());

    }

    this.UpdateSingleWOW = function (allSame) {
      let modelName = allSame.modelName;
      //从单品中查找模型数据
      let modelData = _this.$parent.$parent.$refs.modelPanel.GetModelByName(modelName);
      if (modelData == null) {
        return;
      }
      modelData.pos = new THREE.Vector3(0, 0, 0);
      modelData.rotaV3 = new THREE.Vector3(0, 0, 0);
      console.log(" modelData ", modelData);

      let hasTransList = this.GetTransformByName(modelName);
      console.log(" hasTransList ", hasTransList);
      for (let i = 0; i < hasTransList.length; i++) {
        const element = hasTransList[i];
        this.DelUserModel(element);
      }
      this.GetModelList();
      // return;
      //生成模型并指定坐标
      for (let i = 0; i < allSame.data.length; i++) {
        // if(i>1){
        //   return;
        // }

        CreateTransform(null, modelData, (object) => {
          const data = allSame.data[i];

          let _rota = data.rota;

          object.SetPos({ x: data.posX, y: data.posY, z: data.posZ });

          // let rota = new THREE.Quaternion(-data.rotaX,data.rotaY,data.rotaZ, -data.rotaW);

          let rota = new THREE.Quaternion(-_rota.x, _rota.y, _rota.z, -_rota.w);
          let v = new THREE.Euler();
          v.setFromQuaternion(rota);
          // v.y += Math.PI;
          v.x *= -1;
          v.z *= -1;
          let rotaV3 = new THREE.Vector3(v.x, v.y, v.z);
          object.SetRota(rotaV3);
          // object.GetGroup().rotateY(Math.PI);


          // object.SetRota({ x: data.rotaX , y: data.rotaY , z: data.rotaZ });
          // object.SetRota({ x: data.rotaX/ Mathf.Rad2Deg, y: data.rotaY / Mathf.Rad2Deg, z: data.rotaZ/ Mathf.Rad2Deg });
          object.SetScale({ x: data.scale, y: data.scale, z: data.scale });
          // object.owner.DragEnd();
          modelDataList.push(object.GetData());

        }, modelName + "_" + i);
      }
    }

    this.GaneriateFromClipboard = function () {
      getClipboardContent((text) => {
        let allSceneSame = JSON.parse(text);
        for (let i = 0; i < allSceneSame.data.length; i++) {
          const element = allSceneSame.data[i];
          this.UpdateSingleWOW(element);
        }
        // console.log(" clipboard = ",Mathf.Rad2Deg,text);
      });
    }

    function getClipboardContent(callback) {
      navigator.clipboard.readText().then(function (text) {
        if (callback) {
          callback(text);
        }
      });
    }
    // 编辑模式复制
    this.DuplicateModel = function (modelData, callback, id) {
      id = new Date().getTime() + RandomInt(10000, 100000);
      modelData = JSON.parse(JSON.stringify(modelData));
      modelData.id = id;
      CreateTransform(null, modelData, (object) => {
        modelDataList.push(object.GetData());
        _Global.applyEvent("modelList", scope.GetModelList());
        if (callback) {
          callback(object);
        }

      }, id);
    }
    this.DuplicateModelVisit = function (modelData, callback) {
      CreateTransform(null, modelData, (object) => {
        modelDataList.push(object.GetData());
        if (callback) {
          callback(object);
        }
      });
    }
    this.DuplicateModelNPC = function (modelData, callback, id) {
      CreateTransform(null, modelData, (object) => {
        modelDataList.push(object.GetData());
        if (callback) {
          callback(object);
        }
      }, id);
    }
    this.CopyModel = function (modelId, callback) {
      let yjtransform = this.GetTransformByModelId(modelId);
      // console.log(modelId,yjtransform);
      let modelData = JSON.parse(JSON.stringify(yjtransform.modelData));
      modelData.active = true;
      let npcId = new Date().getTime();
      this.DuplicateModelNPC(modelData, (copy) => {
        if (callback) {
          callback(copy);
        }
      }, npcId);

    }

    this.RemoveChildFromAny = function (id) {
      for (let i = 0; i < allTransform.length; i++) {
        let children = allTransform[i].transform.GetData().children;
        if (children.length > 0) {
          for (let j = children.length - 1; j >= 0; j--) {
            const element = children[j];
            if (element == id) {
              children.splice(j, 1);
            }
          }
        }
      }
    }
    this.UpdateModelList = function () {
      _Global.applyEvent("modelList", scope.GetModelList());
    }
    this.SetParent = function (uuid, parentId) {
      console.log("设置父物体 ", uuid, parentId);
      let transform = this.GetTransformByUUID(uuid);
      transform.GetData().parent = parentId;
    }
    this.SetChildren = function (uuid, children) {
      let transform = this.GetTransformByUUID(uuid);
      transform.GetData().children = children;
    }
    // 加载单个场景的模型数据
    this.CallLoadSceneModelByIndex = function (data) {
      modelDataList = data;
      if (modelDataList.length == undefined) {
        return;
      }

      loadIndex = 0;
      LoadSceneModelByIndex();
    }
    // 根据父子关系重排模型
    function resetModelByParent() {
      for (let i = 0; i < allTransform.length; i++) {
        const child = allTransform[i].transform;
        let parentId = child.GetData().parent;
        if (parentId) {
          for (let j = 0; j < allTransform.length; j++) {
            const parent = allTransform[j].transform;
            let children = parent.GetData().children;
            if (parentId == parent.GetData().id) {
              child.SetParent(parent.GetGroup());
            }
          }
        }
      }
    }
    function LoadSceneModelByIndex() {
      if (loadIndex >= modelDataList.length) {
        setTimeout(() => {
          _this._YJSceneManager.MargeStaticModel();
          resetModelByParent();
          _Global.applyEvent("modelList", scope.GetModelList());
        }, 1000);
        return;
      }
      let item = modelDataList[loadIndex];
      // console.log(" 加载模型 ", loadIndex, item); 
      CreateSelectModel(scene, item, (model) => {
        loadIndex++;
        _this._YJSceneManager.AddProcess();
        LoadSceneModelByIndex();
      });
    }

    // 删除地图id下的模型，直接删除group
    this.RemoveMetaWorldSceneModel = function (mapId) {
      for (let i = 0; i < metaWorldModelDataList.length; i++) {
        const element = metaWorldModelDataList[i];
        if (element.mapId == mapId) {

          _this._YJSceneManager.ClearMesh(element.group);
          console.log("删除地图", element.group);
          for (let i = allTransform.length - 1; i >= 0; i--) {
            const elment = allTransform[i].transform;
            if (elment.GetData().mapId == mapId) {
              elment.Destroy();
              allTransform.splice(i, 1);
            }
          }
          metaWorldModelDataList.splice(i, 1);
          return;
        }
      }
    }

    let metaWorldModelDataList = [];
    this.AddLoadMetaWorldSceneModel = function (mapId, data) {

      let has = false;
      let group = null;
      let pos = null;
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
          pos = element.pos;
        }
      }
      if (!has) {
        modelList = data;
        //创建当前地图块的group
        pos = _this._YJSceneManager.CallMapIdToPos(mapId);
        group = new THREE.Group();
        scene.add(group);
        group.position.set(0, 0, 0);
        // group.position.set(pos.x, pos.y, pos.z);
        metaWorldModelDataList.push({ group: group, pos: pos, mapId: mapId, modelList: modelList });
      }

      // if (metaWorldModelDataList.length == undefined) {
      //   return;
      // }

      // console.error("  刷新 开放世界地图模型 ", metaWorldModelDataList, metaWorldModelDataList.length);
      // console.error("  刷新 开放世界地图模型 ", mapId, modelList, modelList.length);
      currentLoadCount = 0;
      needLoadCount = modelList.length;
      LoadLoadMetaWorldSceneModelByIndex(group, mapId, modelList, pos);
    }

    let currentLoadCount = 0;
    let needLoadCount = 0;
    function LoadLoadMetaWorldSceneModelByIndex(parent, mapId, modelList, offsetPos) {
      if (0 == modelList.length) {
        // _this._YJSceneManager.MargeStaticModel(); 
        _Global.CreateNavMesh(mapId, parent);
        // _Global._SceneManager.LoadMapCompleted();
        _YJGlobal._SceneManagerMetaworld.LoadMapCompleted();

        return;
      }


      let modelData = modelList[0];
      console.log(" 加载模型 ", mapId, modelData);

      let _pos = modelData.pos;
      let _rotaV3 = modelData.rotaV3;
      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);

      // 动力学物体只能放到世界坐标系下
      // let pos2 = parent.position.clone();
      let pos2 = offsetPos;

      pos.x += pos2.x;
      pos.y += pos2.y;
      pos.z += pos2.z;
      modelData.pos = pos;

      currentLoadCount++;

      CreateTransform(parent, modelData, (object) => {
        if (object) {
          object.EditorEnd();
        }
        parent.attach(object.GetGroup());
        modelList.splice(0, 1);

        console.log("加载进度 ", parseInt(currentLoadCount * 1.000 / needLoadCount * 100));
        _this.$parent.LoadingProcess(parseInt(currentLoadCount * 1.000 / needLoadCount * 100));

        // _this._YJSceneManager.AddProcess();
        LoadLoadMetaWorldSceneModelByIndex(parent, mapId, modelList, offsetPos);
      }, undefined, mapId);

      // 以上判断是特殊模型，下面加载模型
      // CreateSelectModel(parent, item, (model) => {
      //   parent.attach(model.GetGroup()); 
      //   modelList.splice(0, 1);
      //   // _this._YJSceneManager.AddProcess();
      //   LoadLoadMetaWorldSceneModelByIndex(parent, mapId, modelList,pos);
      // });
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