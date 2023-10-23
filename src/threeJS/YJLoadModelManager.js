



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
import { MeshBasicMaterial } from "three";

// 加载静态物体
class YJLoadModelManager {
  constructor(_this, scene, _modelDataList, callback) {


    this.LoadStaticModel = function (item) {
      let modelPath = _this.GetModelUrl() + item.modelPath;
      let modelName = item.name;
      let _pos = item.pos;
      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let size = new THREE.Vector3(1, 1, 1);
      loadGltf(modelName, _this.GetPublicUrl() + modelPath, pos, rotaV3, size, true);

    }
    function loadGltf(name, modelPath, pos, rota, size, needcreateCollider, msg) {
      // console.log("加载模型路径 " ,modelPath );
      let mesh = _this._YJSceneManager.checkLoadMesh(modelPath);
      if (mesh != null) {
        LoadMesh(mesh, name, pos, rota, size, needcreateCollider, msg);
        return;
      }


      let group = new THREE.Group();
 
      const loader = new GLTFLoader();
      loader.setDRACOLoader(_this._YJSceneManager.GetDracoLoader());


      loader.load(modelPath, function (gltf) {

        let model = gltf.scene;
        model.name = name;

        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);
        model.scale.set(size.x, size.y, size.z);


        // model.add(new THREE.AxesHelper(1));


        if (msg == null || msg == undefined || msg == "") { } else {
          let modelData = JSON.parse(msg);

          // console.log("加载模型的信息 ",modelData);


          group.tag = modelData.modelType;
          group.modelName = modelData.modelName;
          group.modelId = modelData.id;
          group.modelPath = modelData.modelPath;

          model.tag = modelData.modelType;
          model.modelName = modelData.modelName;
          model.modelId = modelData.id;
          model.modelPath = modelData.modelPath;


          _this._YJSceneManager.AddModel(modelData.modelName, modelData.modelPath);


          // 设置物品的信息：物品类型、物品名、物品id 
          model.owner = model;

          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.tag = modelData.modelType;
              item.owner = model;
            }
            if (item instanceof THREE.SkinnedMesh) {
              item.tag = modelData.modelType;
              item.owner = model;
            }
          });
        }





        group.add(model);
        scene.add(group);
        _this._YJSceneManager.addLoadMesh(modelPath, group.clone());

        // console.log(" 加载模型完成 " ,model );
        // console.log(" 加载模型完成 ", name);

        if (needcreateCollider) {
          //创建collider 
          CreateCollider(model, size);
        } else {
        }

        LoadCompleted();
      }, undefined, function (e) {

        // LoadCompleted();
        console.log("加载模型出错" + modelPath);
        console.error(e);
      });

    }

    function LoadMesh(mesh, name, pos, rota, size, needcreateCollider, msg) {
      // console.log(" 已存在mesh ,复用之 ！", name);
      let group = mesh.clone();
      let model = group.children[0];

      model.name = name;

      model.position.set(pos.x, pos.y, pos.z); //  
      model.rotation.set(rota.x, rota.y, rota.z);
      model.scale.set(size.x, size.y, size.z);
      scene.add(model);

      // model.visible = false;

      if (msg == null || msg == undefined || msg == "") { } else {

        let modelData = JSON.parse(msg);

        // 设置物品的信息：物品类型、物品名、物品id
        model.modelName = modelData.modelName;
        model.tag = modelData.modelType;
        model.modelId = modelData.id;
        model.modelPath = modelData.modelPath;
        model.owner = model;

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.tag = modelData.modelType;
            item.owner = model;
          }
          if (item instanceof THREE.SkinnedMesh) {
            item.tag = modelData.modelType;
            item.owner = model;
          }
        });
      }


      if (needcreateCollider) {
        CreateCollider(model, size);
      } else {

      }
      LoadCompleted();

    }

    //创建碰撞体
    function CreateCollider(model, size) {

      let hasCollider = false;
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {

          if (item.name.indexOf("collider") > -1) {
            hasCollider = true;

            let cSize = new THREE.Vector3(0, 0, 0);
            cSize.x = item.scale.x * size.x;
            cSize.y = item.scale.y * size.y;
            cSize.z = item.scale.z * size.z;
            _this._YJSceneManager.CreateTriangeMeshCollider(item, cSize);
            item.visible = false;

            if (item.name.includes("land")) {
              _this._YJSceneManager.AddLandCollider(item);
            }
            // console.log(" 创建模型自身collider ");
          } else {


            if (item.name.includes("trigger")) {

              let cSize = new THREE.Vector3(0, 0, 0);
              cSize.x = item.scale.x * size.x;
              cSize.y = item.scale.y * size.y;
              cSize.z = item.scale.z * size.z;

              _this._YJSceneManager.CreateTriangeMeshTrigger(item, cSize,
                model.modelId, "triggerArea", model.owner);

              item.visible = false;
              // console.log("加载模型的信息 ",modelData);
              return;
            }


            // 不做标注的默认投射阴影，标注后不投射阴影
            // item.castShadow = !(item.name.indexOf("castShadow") > -1);

            item.castShadow = true;
            item.receiveShadow = true;

            if (model.name.includes("xiaoqiaoliushui")) {
              item.material.side = THREE.FrontSide;
            }
            if (model.name.includes("weilaikejichengshi")) {
              item.material.side = THREE.FrontSide;
            }
            if (model.name.includes("shendan")) {
              item.material.side = THREE.FrontSide;
            }
            if (model.name.includes("scene002") || model.name.includes("scene003") ) {
              item.castShadow = false; 
            }

            // if (model.name.includes("Structure_v03") ) {
            //   item.receiveShadow = false; 
            // }

            if (model.name.includes("fengchao")) {
              item.material.side = THREE.FrontSide;
              // const material = new THREE.MeshDepthMaterial({
              //   depthPacking: THREE.RGBADepthPacking, 
              //   map: item.material.map,
              //   alphaTest:0.5,
              // });
              // item.customDepthMaterial = material

              if (item.name.includes("Glass")) {
                item.castShadow = false;
                item.visible = false;
                // item.visible = false;
              }

              if (item.name.includes("glass2b")) {
                item.castShadow = false;
                item.visible = false;
                // item.visible = false;
              }
              if (item.name.includes("网格354") || item.name.includes("网格397")
                || item.name.includes("网格511") || item.name.includes("网格399")) {
                item.castShadow = false;
                item.receiveShadow = false;
                // item.visible = false;
              }

              // item.material = material;
            }
            if (model.name.includes("Production_Coca_Cola_Record_Studio")) {
              const material = new THREE.MeshStandardMaterial({
                // transparent: transparent,
                // alphaTest:transparent,
                color:0x666666,
                map: item.material.map
              });
              item.material = material;
            }

            // console.log(item);
            // console.log(item.name, item.material);

            // if(item.name.indexOf("DoubleSide") > -1){
            //   item.material.side = THREE.DoubleSide; 
            // }

            //天空球取消投射阴影
            if (model.name.indexOf("xingkong") > -1) {
              item.castShadow = false;
            }

            // cola项目唱片模型，实时光时，取消接收阴影，消除唱片上的锯齿
            if (model.name.includes("BystanderRecords_v03")) {
              item.receiveShadow = false;
            }

            if (item.name.indexOf("basicColor") > -1) {
              let transparent = item.material.transparent;

              const material = new THREE.MeshBasicMaterial({
                transparent: transparent,
                // alphaTest:transparent,
                map: item.material.map
              });
              item.material.dispose(); 
              item.material = material;
            }

            if (item.name.indexOf("highMesh360Ball") > -1) {
              // console.log("====360ball ===");
              let map = item.material.map;
              let mat = new THREE.MeshBasicMaterial({
                map: map,
                color: 0xffffff,
              }); // 材质
              item.material = mat;
            }
          }
        }
      });

      //自定义碰撞体。 如果有自定义碰撞体，则只为碰撞体网格创建碰撞
      if (hasCollider) {

      } else {
        return;
        // 如果没有自定义碰撞体，则为整个网格生成碰撞。 注释生成碰撞代码
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            let cSize = new THREE.Vector3(0, 0, 0);
            cSize.x = item.scale.x * size.x;
            cSize.y = item.scale.y * size.y;
            cSize.z = item.scale.z * size.z;

            _this._YJSceneManager.CreateTriangeMeshCollider(item, cSize);
          }
        });

      }
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

      _this._YJSceneManager.AddProcess();
      loadIndex++;
      LoadSceneModelByIndex();
    }
    function CreateSelectModel(id, modelData, state) {
      let modelName = modelData.modelName;
      let modelPath =  _this.GetPublicUrl() + _this.GetModelUrl() + modelData.modelPath;
      // let modelPath = modelData.modelPath;
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

      // 带动画的模型
      if (modelType == "anim") {
        let animModel = new YJAnimModel(_this, scene, id, modelName,modelPath, pos, rotaV3, size, modelData.message);
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
        let js = new YJUVanim2(_this, scene, id, modelName,   modelPath, pos, rotaV3, size);
        // let js = new YJUVanim(_this, scene, id, modelName,  modelPath, pos, rotaV3, size);
        js.SetMessage(modelData.message);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }

      // 广告牌
      if (modelType == "Billboard") {
        let Billboard = new YJBillboard(_this, scene, id,   modelName,   modelPath, pos, rotaV3, size);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }
      // 旋转广告牌,角色靠近自动旋转
      if (modelType == "TriggerArea") {
        let _YJHotPoint = new YJHotPoint(_this, scene, id, modelName,  modelPath, pos, rotaV3, size, () => {

          _this._YJSceneManager.AddProcess();
          loadIndex++;
          LoadSceneModelByIndex();

        });
        _YJHotPoint.SetData(_this.$parent.sceneData.hotPointData.triggerAreaRotaSpeed);
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
      loadGltf(modelName,  modelPath, pos, rotaV3, size, true, modelData.message);

    }


    let loadIndex = 0;
    let modelDataList = [];
    function Init() {
      modelDataList.splice(0, modelDataList.length);
      modelDataList = _modelDataList;
      LoadSceneModelByIndex();
    }
    this.LoadModels = function (_modelDataList) {
      modelDataList.splice(0, modelDataList.length);
      modelDataList = _modelDataList;
      loadIndex = 0;
      LoadSceneModelByIndex();
    }
    function LoadSceneModelByIndex() {
      if (loadIndex >= modelDataList.length) {
        // _this._YJSceneManager.LoadDone();
        modelDataList.splice(0, modelDataList.length);
        return;
      }
      let item = modelDataList[loadIndex];

      let pos = item.pos;

      // let _pos = item.pos;
      // let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);

      // let _rota = item.rota;
      // // unity旋转四元数转three角度
      // let rota = new THREE.Quaternion(-_rota.x, _rota.y, _rota.z,-_rota.w);
      // let v = new THREE.Euler();
      // v.setFromQuaternion(rota);
      // v.y += Math.PI;
      // v.z *= -1;
      // let rotaV3 = new THREE.Vector3(v.x, v.y, v.z);


      //玩家位置
      if (item.modelName == "playerPos") {
        _this._YJSceneManager.SetPlayerPosData(item.pos, item.rotaV3);
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }
      // 鸟瞰lookat坐标
      if (item.modelName == "lookatCamPos") {
        _this._YJSceneManager.SetNiaokanPos(pos);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }
      // 鸟瞰摄像机坐标
      if (item.modelName == "lookatPos") {
        _this._YJSceneManager.SetNiaokanLookatPos(pos);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }
      // 3d音乐，声音近大远小
      if (item.modelName == "3DAudio") {
        let audio3d = new YJ3DAudio(_this, scene,
          _this._YJSceneManager.GetListener(),
          "",
          item.pos);
        _this._YJSceneManager.Set3DAudio(audio3d);
        _this._YJSceneManager.AddProcess();
        loadIndex++;
        LoadSceneModelByIndex();
        return;
      }



      // 以上判断是特殊模型，下面加载模型
      CreateSelectModel(item.id, item, item.state);
    }

    Init();

  }
}

export { YJLoadModelManager };