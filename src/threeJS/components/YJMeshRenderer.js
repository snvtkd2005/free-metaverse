
import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


import { ObjectLoader } from "three";

// meshRenderer组件

// 加载静态物体
class YJMeshRenderer {
  constructor(_this, scene, owner, hasCollider, noShadow) {
    let scope = this;

    var model = null;
    let size = null;
    let volume = null;
    let animations = null;
    let meshScale = 1;
    this.GetAnimations = function () {
      return animations;
    }
    this.GetModel = function () {
      return model;
    }
    this.GetAllBone = function () {
      let boneNode = [];
      model.traverse(function (item) {
        if (item instanceof THREE.Bone) {
          boneNode.push(item);
        }
      });
      for (let i = boneNode.length - 1; i > 0; i--) {
        const element = boneNode[i];
        if (element.parent.name == element.name) {
          boneNode.splice(i, 1);
        }
      }
      let bones = [];
      for (let i = 0; i < boneNode.length; i++) {
        const element = boneNode[i];
        bones.push(element.name);
      }
      return bones;
    }
    this.SetSize = function (f) {
      // console.log("设置模型缩放",f);
      model.scale.set(meshScale * f, meshScale * f, meshScale * f);
    }
    this.RotaY = function (f) {
      model.rotation.y += f;
    }
    this.GetPos = function () {
      return model.position.clone();
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
    function loadFbx(modelPath, callback, errorback) {


      let mesh = _this._YJSceneManager.checkLoadMesh(modelPath);
      if (mesh != null) {
        LoadMesh(mesh.mesh, callback);
        return;
      }

      var fbxLoader = new FBXLoader();
      fbxLoader.load(
        modelPath,
        function (object) {

          model = object;
          model.transform = owner;


          animations = model.animations;
          for (let i = animations.length - 1; i >= 0; i--) {
            const element = animations[i];
            if (element.tracks.length == 0) {
              animations.splice(i, 1);
            }
          }
          model.animations = animations;

          model.scale.set(1 * meshScale, 1 * meshScale, 1 * meshScale);

          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              if (item.name.indexOf("collider") > -1) {
                item.visible = false;
              } else {
                if (item.name.includes("trigger")) {
                  item.visible = false;
                  return;
                }
                if (noShadow) {

                } else {
                  item.castShadow = true;
                  item.receiveShadow = true;
                }
                item.transform = owner;

              }
            }
            // if (item instanceof THREE.Bone) {
            //   if (item.name.includes("Hips")) {
            //     item.add(new THREE.AxesHelper(1000));
            //   }
            // }
          });


          scene.add(model);
          console.log(" 加载模型完成 ", model);
          _this._YJSceneManager.addLoadMesh(modelPath, model);

          if (callback) {
            callback(scope);
          }
          LoadCompleted();

        }, undefined, function (e) {

          if (errorback) {
            errorback(e);
          }
          console.log("加载模型出错" + modelPath);
          console.error(e);
          LoadCompleted();
        });
    }

    this.load = function (modelPath, callback, errorback) {
      if (modelPath == undefined) {
        if (callback) {
          callback(scope);
        }
        return;
      }

      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      if (type == "fbx") {
        meshScale = 0.01;
        loadFbx(modelPath, callback, errorback);
        return;
      }
      if (type == "gltf") {
        loadGltf(modelPath, callback, errorback);
        return;
      }

    }
    function loadGltf(modelPath, callback, errorback) {


      let meshAndMats = _this._YJSceneManager.checkLoadMesh(modelPath);
      if (meshAndMats != null) {
        LoadMesh(meshAndMats.mesh, callback);
        return;
      }


      const loader = new GLTFLoader();
      loader.setDRACOLoader(_this._YJSceneManager.GetDracoLoader());

      // + ("?time="+new Date().getTime())
      loader.load(modelPath, function (gltf) {

        model = gltf.scene;

        animations = gltf.animations;

        model.transform = owner;

        scene.add(model);
        _this._YJSceneManager.addLoadMesh(modelPath, gltf);

        TraverseOwner(model);
        if (hasCollider) {
          CreateColliderFn(model);
        }
        if (callback) {
          callback(scope);
        }


        LoadCompleted();
      }, undefined, function (e) {

        if (errorback) {
          errorback(e);
        }
        console.log("加载模型出错" + modelPath);
        console.error(e);
        LoadCompleted();
      });

    }

    function cloneFbx(object) {
      const clone = {
        animations: object.animations,
        scene: object.clone(true)
      };

      const skinnedMeshes = {};

      object.traverse(node => {
        if (node.isSkinnedMesh) {
          skinnedMeshes[node.name] = node;
        }
      });

      const cloneBones = {};
      const cloneSkinnedMeshes = {};

      clone.scene.traverse(node => {
        if (node.isBone) {
          cloneBones[node.name] = node;
        }

        if (node.isSkinnedMesh) {
          cloneSkinnedMeshes[node.name] = node;
        }
      });

      for (let name in skinnedMeshes) {
        const skinnedMesh = skinnedMeshes[name];
        const skeleton = skinnedMesh.skeleton;
        const cloneSkinnedMesh = cloneSkinnedMeshes[name];

        const orderedCloneBones = [];

        for (let i = 0; i < skeleton.bones.length; ++i) {
          const cloneBone = cloneBones[skeleton.bones[i].name];
          orderedCloneBones.push(cloneBone);
        }

        cloneSkinnedMesh.bind(
          new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
          cloneSkinnedMesh.matrixWorld);
      }

      return clone;
    }

    function LoadMesh(mesh, callback) {
      // console.log(" 已存在mesh ,复用之 ！", mesh, materials);

      model = cloneFbx(mesh.scene).scene;
      animations = mesh.animations;

      scene.add(model);
      model.scale.set( meshScale,  meshScale,  meshScale);
      model.transform = owner;

      TraverseOwner(model);
      if (hasCollider) {
        CreateColliderFn(model);
      }
      if (callback) {
        callback(scope);
      }
      LoadCompleted();

    }


    this.CreateCollider = function (colliderVisible) {
      if (model == null) { return; }
      CreateColliderFn(model, colliderVisible);
    }
    function TraverseOwner(model) {
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.transform = owner;
        }
      });
    }
    //创建碰撞体
    function CreateColliderFn(model, colliderVisible) {
      let size = owner.GetData().scale;
      let hasCollider = false;

      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {

          if (item.name.includes("collider") && !item.name.indexOf("land")) {
            item.visible = colliderVisible != undefined ? colliderVisible : false;
            hasCollider = true;

            let cSize = new THREE.Vector3(0, 0, 0);
            cSize.x = item.scale.x * size.x;
            cSize.y = item.scale.y * size.y;
            cSize.z = item.scale.z * size.z;
            _this._YJSceneManager.CreateTriangeMeshCollider(item, cSize);
            _this._YJSceneManager.AddCollider(item);

            // console.log(" 创建模型自身collider ");
          } else if (item.name.includes("collider") && item.name.indexOf("land")) {
            item.visible = colliderVisible != undefined ? colliderVisible : false;

            let cSize = new THREE.Vector3(0, 0, 0);
            cSize.x = item.scale.x * size.x;
            cSize.y = item.scale.y * size.y;
            cSize.z = item.scale.z * size.z;
            _this._YJSceneManager.CreateTriangeMeshCollider(item, cSize);
            _this._YJSceneManager.AddLandCollider(item);

          }
          else {


            if (item.name.includes("trigger")) {

              let cSize = new THREE.Vector3(0, 0, 0);
              cSize.x = item.scale.x;
              cSize.y = item.scale.y;
              cSize.z = item.scale.z;

              _this._YJSceneManager.CreateTriangeMeshTrigger(item, cSize,
                model.modelId, "triggerArea", model.owner);

              item.visible = false;
              // console.log("加载模型的信息 ",modelData);
              return;
            }

            if (noShadow) {

            } else {
              item.castShadow = true;
              // item.receiveShadow = true;
            }


            item.transform = owner;
          }

        }

      });

    }


    let triggleObj = null;
    this.CreateTrigger = function () {
      return;
      // 摆放时的trigger检测区域
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
      // if (_this._YJSceneManager == undefined) {
      //   console.log("！！！注意，不应该进入此判断 。 加载静态模型 ", modelPath);
      //   return;
      // }
      // _this._YJSceneManager.LoadSingleModelCompleted();
    }


    this.CallLoopFindChild = function (childName, parent, i) {
      if (i == undefined) { i = 1; }
      return LoopFindChild(childName, parent, i);
    }
    function LoopFindChild(childName, parent, index) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if (cn[index] == childName) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindChild(childName, c, index);
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
    }

    //删除模型
    this.Destroy = function () {
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

            // item.geometry.dispose();
            // try {
            //   item.material.dispose();
            // } catch (error) {
            // }
          }
        });
      }
    }
  }
}

export { YJMeshRenderer };