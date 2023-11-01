import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


import { ObjectLoader } from "three";

// 加载静态物体
class YJLoadModel {
  constructor(_this, scene) {
    let scope = this;

    var model = null;
    this.modelItem = null;
    let size = null;
    let volume = null;
    this.GetModel = function () {
      return model;
    }
    this.GetGroup = function () {
      return group;
    }
    this.RotaY = function (f) {
      model.rotation.y += f;
    }
    this.GetPos = function () {
      return model.position.clone();
    }
    this.SetVolume = function (f) {
      volume = f;
    }
    function loadJson() {
      // const loader = new LegacyJSONLoader();
      const loader = new ObjectLoader();
      // const loader = new THREE.BufferGeometryLoader();
      console.log("正在加载json");
      // load a resource
      loader.load(
        // resource URL
        _this.$publicUrl + 'models/json/CS15_E_pro_t10_Door_BB.json',
        // _this.$publicUrl+'models/json/jfc-ext.js',

        // onLoad callback
        function (geometry) {
          const material = new THREE.MeshLambertMaterial({ color: 0xF5F5F5 });
          const object = new THREE.Mesh(geometry, material);
          scene.add(object);
        },

        // onProgress callback
        function (xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
          console.log('An error happened');
        }
      );
    }

    //加载热点的obj 模型
    function loadFbx(name, modelPath, pos, rota, size, createCollider, modelItem, callback) {
      var fbxLoader = new FBXLoader();
      fbxLoader.load(
        modelPath,
        function (object) {

          model = object;

          model.name = name;
          model.position.set(pos.x, pos.y, pos.z); //  
          model.rotation.set(rota.x, rota.y, rota.z);
          let scale = 0.01;
          model.scale.set(size.x * scale, size.y * scale, size.z * scale);

          scene.add(model);
          // console.log(" 加载模型完成 " ,model );


          if (callback) {
            callback(scope);
          }
          if (createCollider) {
            //创建collider 
            CreateColliderFn(model, size);
          } else {

          }
          LoadCompleted();

        }
      );
    }

    this.load = function (name, modelPath, pos, rota, _size, createCollider, modelItem, callback) {
      size = _size;
      this.modelItem = modelItem;

      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      if (modelPath.indexOf(".json") > -1) {
        type = "json";
      }
      if (type == "fbx") {
        loadFbx(name, modelPath, pos, rota, size, createCollider, modelItem, callback);
        return;
      }
      if (type == "gltf") {
        loadGltf(name, modelPath, pos, rota, size, createCollider, modelItem, callback);
        return;
      }
      if (type == "json") {
        loadJson();
        return;
      }

    }
    function loadGltf(name, modelPath, pos, rota, size, createCollider, modelItem, callback) {


      let mesh = _this._YJSceneManager.checkLoadMesh(modelPath);
      if (mesh != null) {
        LoadMesh(mesh, name, pos, rota, size, createCollider, modelItem, callback);
        return;
      }
 
      // group.add(new THREE.AxesHelper(3));

      const loader = new GLTFLoader();

      loader.setDRACOLoader(_this._YJSceneManager.GetDracoLoader());

      loader.load(modelPath, function (gltf) {

        model = gltf.scene;
        model.name = name;

        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);
        model.scale.set(size.x, size.y, size.z);

        // model.tag = "userModel";
        // model.add(new THREE.AxesHelper(1));
        model.owner = scope;
        model.modelItem = modelItem;

        // console.error("加载 模型 ",modelItem);

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            if (item.name.indexOf("collider") > -1) {
              item.visible = false;
            } else {
              if (item.name.includes("trigger")) {
                item.visible = false;
                return;
              }
              item.castShadow = true;
              item.receiveShadow = true;
              item.owner = scope;
              // item.tag = "userModel";

            }
          }
        });



        // scene.add(model);
        _this._YJSceneManager.addLoadMesh(modelPath, gltf);

        // console.log(" 加载模型完成 " ,model );
        // console.log(" 加载模型完成 ", name);
        if (callback) {
          callback(scope);
        }

        if (createCollider) {
          //创建collider 
          CreateColliderFn(model, size);
        } else {

        }

        LoadCompleted();
      }, undefined, function (e) {
        // if (callback) {
        //   callback(scope);
        // }
        console.log("加载模型出错" + modelPath);
        console.error(e);
      });

    }

    function LoadMesh(mesh, name, pos, rota, size, createCollider, modelItem, callback) {
      // console.log(" 已存在mesh ,复用之 ！", name);
      let group = mesh.clone();
      model = group.children[0];

      model.name = name;

      model.position.set(pos.x, pos.y, pos.z); //  
      model.rotation.set(rota.x, rota.y, rota.z);
      model.scale.set(size.x, size.y, size.z);
      scene.add(model);
      // model.add(new THREE.AxesHelper(3));

      // model.tag = "userModel";
      model.owner = scope;
      model.modelItem = modelItem;

      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          if (item.name.indexOf("collider") > -1) {
            item.visible = false;
          } else {
            if (item.name.includes("trigger")) {
              item.visible = false;
              return;
            }
            item.castShadow = true;
            item.receiveShadow = true;
            item.owner = scope;

          }
        }
      });

      // if (name.indexOf("land") > -1) {
      //   model.tag = "floor";
      //   _this.pointsParent.add(model);
      // }
      if (callback) {
        callback(scope);
      }
      if (createCollider) {
        CreateColliderFn(model, size);
      } else {

      }
      LoadCompleted();

    }


    this.CreateCollider = function () {
      CreateColliderFn(model, size);
      this.CreateTrigger();
    }
    //创建碰撞体
    function CreateColliderFn(model, size) {

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

              _this.pointsParent.add(item);
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



            // item.castShadow = true;
            item.receiveShadow = true;
            item.material.emissiveIntensity = 1.0;

            // item.material.size = THREE.FrontSide; 

            // if(item.name.indexOf("DoubleSide") > -1){
            //   item.material.side = THREE.DoubleSide; 
            // }

            //天空球取消投射阴影
            if (model.name.indexOf("xingkong") > -1) {
              item.castShadow = false;
            }
            // 不做标注的默认投射阴影，标注后不投射阴影
            item.castShadow = !(item.name.indexOf("castShadow") > -1);
            if (item.name.indexOf("basicColor") > -1) {
              let transparent = item.material.transparent;

              const material = new THREE.MeshBasicMaterial({
                transparent: transparent,
                // alphaTest:transparent,
                map: item.material.map
              });
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


    let triggleObj = null;
    this.CreateTrigger = function () {
      let planeGeometry = new THREE.BoxGeometry(volume.x, volume.y, volume.z); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        alphaTest: true,
        transparent: true,
        opacity: 0.5,
        color: 0x0000ff,
      });
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.name = "volume";
      plane.modelType = "userModel";
      this.modelItem.modelTag = "userModel";
      model.add(plane);
      _this._YJSceneManager.CreateTriangeMeshTrigger(plane, size,
        model.modelId, "triggerArea", model.owner);

      triggleObj = plane;
    }

    function LoadCompleted() {

    }


    function LoopFindChild(childName, parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if (cn[1] == childName) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindChild(childName, c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }

    function LoopFindColliderChild(parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        if (c.name.indexOf("Collider") > -1) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindColliderChild(c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }

    function LoopFindMeshChild(parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        if (c.type == ("Mesh")) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindMeshChild(c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }

    this.SetState = function (state) {
    }

    function Init() {
      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      if (modelPath.indexOf(".json") > -1) {
        type = "json";
      }
      if (type == "fbx") {
        loadFbx();
      }
      if (type == "gltf") {
        loadGltf();
      }
      if (type == "json") {
        loadJson();
      }
    }

    // Init();

    // // 坐标、旋转 也算在同步状态中
    // this.SetState = function (modelData) {
    //   console.log("改变模型状态");
    //   let _pos = modelData.pos;
    //   let _rotaV3 = modelData.rotaV3;
    //   let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
    //   let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);
    //   this.ResetSetPosRota(pos,rotaV3);
    // }

    this.ResetSetPosRota = function (pos, rota) {
      if (model == null) { return; }
      this.SetPosRota(pos, rota);
      this.DestroyCollider();
      CreateCollider();
    }


    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota) {
      if (model == null) { return; }
      model.position.set(pos.x, pos.y, pos.z); // 
      if (rota != undefined) {
        model.rotation.set(rota.x, rota.y, rota.z); // 
      }
    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(model.position, model.rotation);
    }
    //可由用户创建的模型，放下是创建碰撞体
    this.SetDown = function (pos, rota) {
      CreateCollider();
      model.name = name;

    }

    //删除模型
    this.Destroy = function () {
      LoadCompleted();

      if (model == null) { return; }

      this.DestroyCollider();
      scene.remove(model);
    }
    this.DestroyCollider = function () {
      if (model != null) {
        //删除碰撞体 
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            _this._YJSceneManager.RemoveCollider(item);

            item.geometry.dispose();
            try {
              item.material.dispose();
            } catch (error) {
            }
          }
        });
      }
    }
  }
}

export { YJLoadModel };