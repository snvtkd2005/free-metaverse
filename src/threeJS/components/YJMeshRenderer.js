
import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';
// import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper.js';
// import { ObjectLoader } from "three";
// import { YJLoadAvatarMMD } from "./YJLoadAvatarMMD";

// meshRenderer组件

// 加载静态物体
class YJMeshRenderer {
  constructor( scene, owner, hasCollider, noShadow, tag) {
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
      // 去掉同名
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
    this.GetAllBoneModel = function () {
      let boneNode = [];
      model.traverse(function (item) {
        if (item instanceof THREE.Bone) {
          boneNode.push(item);
        }
      });
      return boneNode;
    }
    this.GetAllBoneInParent = function (boneName) {
      let parentBone = null;
      model.traverse(function (item) {
        if (item instanceof THREE.Bone) {
          if (item.name == boneName && item.children.length > 0) {
            parentBone = item;
          }
        }
      });
      let boneNode = [];
      boneNode.push(parentBone.name);
      LoopFindChild2(parentBone, boneNode);
      return boneNode;
    }
    function LoopFindChild2(parent, boneNode) {
      if (parent.children.length > 0) {
        for (let i = 0; i < parent.children.length; i++) {
          boneNode.push(parent.children[i].name);
          LoopFindChild2(parent.children[i], boneNode);
        }
      }
    }

    // 模糊获取骨骼
    this.GetBoneVague = function (boneName, callback) {
      // console.log("从模型中查找bone ", playerObj,boneName);
      let doonce = 0;
      model.traverse(function (item) {
        if (doonce > 0) { return; }
        // if (item.type == "Bone" && item.name == (boneName)) 
        if (item.type == "Bone" && item.name.includes(boneName)) {
          if (callback) {
            callback(item);
          }
          doonce++;
        }
      });
    }

    //#region 只在单品模型编辑模式
    let equipList = [];
    // 移除武器
    this.RemoveWeapon = function () {
      for (let i = equipList.length - 1; i >= 0; i--) {
        const item = equipList[i];
        item.equipModel.parent.remove(item.equipModel);
        equipList.splice(i, 1);
      }
    }
    this.EditorWeapon = function (msg) {

    }

    this.AddWeapon = function (weaponData, equipData, boneList, callback) {
      let data = weaponData.message.data;
      let realyBoneName = "";
      let realyPos = equipData.position;
      let realyRota = equipData.rotation;
      let realyScale = equipData.scale;

      for (let i = 0; i < boneList.length; i++) {
        const item = boneList[i];
        if (item.targetBone == equipData.targetBone) {
          realyBoneName = item.boneName;
        }
      }

      for (let i = 0; i < equipList.length; i++) {
        const item = equipList[i];
        if (item.boneName == realyBoneName && item.weaponType == data.weaponType) {
          let pos = realyPos;
          let rotaV3 = realyRota;
          let scale = realyScale;
          item.equipModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
          item.equipModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
          item.equipModel.scale.set(100 * scale[0], 100 * scale[1], 100 * scale[2]);
          return;
        }
      }

      //加载武器
      _Global.YJ3D._YJSceneManager.DirectLoadMesh(_Global.url.uploadUrl + weaponData.modelPath, (meshAndMats) => {
        scope.GetBoneVague(realyBoneName, (bone) => {

          // let _weaponModel = (meshAndMats.mesh).scene;
          // let weaponModel = (meshAndMats.mesh).scene;
          // console.log("weaponModel ",weaponModel);

          let _weaponModel = (meshAndMats.mesh).scene;
          let model = new THREE.Group();
          model.add(_weaponModel);
          _weaponModel.position.set(0, 0, 0);
          _weaponModel.rotation.set(0, 0, 0);
          if (weaponData.modelPath.includes(".fbx")) {
            _weaponModel.scale.set(0.01, 0.01, 0.01);
          } else {
            _weaponModel.scale.set(1, 1, 1);
          }

          // console.log(" 找到骨骼并拾取武器",bone,weaponModel);
          bone.attach(model);
          bone.weaponModel = model;
          let pos = realyPos;
          let rotaV3 = realyRota;
          let scale = realyScale;
          model.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
          model.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
          model.scale.set(100 * scale[0], 100 * scale[1], 100 * scale[2]);
          equipList.push({ boneName: realyBoneName, weaponType: data.weaponType, equipModel: model });

          if (callback) {
            callback(model);
          }

        });
      });
    }
    //#endregion


    //#region 模型局部坐标系中的transform值
    let de2reg = 57.3248407;
    this.SetSize = function (f) { 
      model.scale.set(meshScale * f, meshScale * f, meshScale * f);
    }
    this.SetRota = function (rota) {
      model.rotation.set(rota.x, rota.y, rota.z);
    }
    this.SetRotaArray = function (rota) {
      if (!rota) {
        model.rotation.set(0, 0, 0);
        return;
      }
      model.rotation.set(rota[0] / de2reg, rota[1] / de2reg, rota[2] / de2reg);
    }
    this.SetPos = function (pos) {
      model.position.set(pos.x, pos.y, pos.z);
    }
    this.SetPosArray = function (pos) {
      if (!pos) {
        model.position.set(0, 0, 0);
        return;
      }
      model.position.set(pos[0], pos[1], pos[2]);
    }
    //#endregion

    // this.RotaY = function (f) {
    //   model.rotation.y += f;
    // }
    // this.GetPos = function () {
    //   return model.position.clone();
    // }

    function loadJson() {
      
      // const loader = new ObjectLoader();
      // // const loader = new THREE.BufferGeometryLoader();
      // console.log("正在加载json");
      // // load a resource
      // loader.load(_Global.url.local + 'models/WaltHeadLo_buffergeometry.json', 
      //   (geometry) => {
      //     console.log("正在加载json", geometry);
      //     // const material = new THREE.MeshLambertMaterial({ color: 0xF5F5F5 });
      //     // const object = new THREE.Mesh(geometry, material);
      //     // scene.add(object);
      //   }
      // );
    }
    //加载模型
    function loadFbx(modelPath, callback, errorback) {


      let mesh = _Global.YJ3D._YJSceneManager.checkLoadMesh(modelPath);
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
              if (item.material.length > 0 && item.material.length < 4) {
                // let mats = [];
                // for (let i = item.material.length-1; i >=1 ; i--) {
                //   let has = false;
                //   for (let j = 0; j < mats.length && !has; j++) {
                //     const element = mats[j];
                //     if(element.mapName == item.material[i].map.name){
                //       has = true;
                //       item.material[i] = element.mat;
                //       // item.material.splice(i,1);
                //       continue;
                //     }
                //   }
                //   if(!has){
                //     mats.push({mapName:item.material[i].map.name,mat:item.material[i].clone()});
                //   }
                // }

                // let cloneMat = item.material[0].clone();
                // for (let i = item.material.length-1; i >=1 ; i--) {
                //   item.material.splice(i,1);
                // }
                // item.material = cloneMat;
              } else {
              }
              item.material.alphaTest = 0.5; 
              // item.material.transparent = true;
              // item.renderOrder = 1;
              // console.log(item.material);

            }
          });


          scene.add(model);
          // console.log(" 加载模型完成 11 ", model);
          _Global.YJ3D._YJSceneManager.addLoadMesh(modelPath, model);

          TraverseOwner(model);
          if (hasCollider) {
            CreateColliderFn(model);
          }
          LoadCompleted(callback);

        }, (e)=>{
          // console.log(" 加载进度 ",e.loaded/e.total);
        }, function (e) {

          if (errorback) {
            errorback(e);
          }
          console.error("加载模型出错", e, modelPath);
          LoadCompleted(callback);

        });
    }
    function loadObj(modelPath, callback, errorback) {


      let mesh = _Global.YJ3D._YJSceneManager.checkLoadMesh(modelPath);
      if (mesh != null) {
        LoadMesh(mesh.mesh, callback);
        return;
      }

      // new MTLLoader()
      //   .load(modelPath.replace('.obj', '.mtl'), function (materials) {
      //     materials.preload();

      //     new OBJLoader()
      //       .setMaterials(materials)
      //       .load(modelPath, function (object) {
      //         model = object;
      //         model.transform = owner;

      //         animations = model.animations;
      //         for (let i = animations.length - 1; i >= 0; i--) {
      //           const element = animations[i];
      //           if (element.tracks.length == 0) {
      //             animations.splice(i, 1);
      //           }
      //         }
      //         model.animations = animations;

      //         model.scale.set(1 * meshScale, 1 * meshScale, 1 * meshScale);

      //         scene.add(model);
      //         // console.log(" 加载模型完成 11 ", model);
      //         _Global.YJ3D._YJSceneManager.addLoadMesh(modelPath, model);

      //         TraverseOwner(model);
      //         if (hasCollider) {
      //           CreateColliderFn(model);
      //         }
      //         LoadCompleted(callback);

      //       }, undefined, function (e) {

      //         if (errorback) {
      //           errorback(e);
      //         }
      //         console.error("加载模型出错", e, modelPath);
      //         LoadCompleted(callback);

      //       });

      //   });
    }
    // let mmdCtrl = null;
    function loadMMD(modelPath, callback, errorback) {
      LoadCompleted(callback);

      // mmdCtrl = new YJLoadAvatarMMD(scene);
      // mmdCtrl._LoadMMD(modelPath,()=>{
      //   LoadCompleted(callback);
      // });
      return;
      let meshAndMats = _Global.YJ3D._YJSceneManager.checkLoadMesh(modelPath);
      if (meshAndMats != null) {
        LoadMesh(meshAndMats.mesh, callback);
        return;
      }


      const loader = new GLTFLoader();
      loader.setDRACOLoader(_Global.YJ3D._YJSceneManager.GetDracoLoader());

      // + ("?time="+new Date().getTime())
      loader.load(modelPath, function (gltf) {
        // console.log("加载模型 00 ",modelPath);

        model = gltf.scene;

        gltf.animations = [];
        animations = gltf.animations;

        model.transform = owner;

        scene.add(model);
        _Global.YJ3D._YJSceneManager.addLoadMesh(modelPath, gltf);

        TraverseOwner(model);
        if (hasCollider) {
          CreateColliderFn(model);
        }
        LoadCompleted(callback);

      }, undefined, function (e) {
        console.log("加载模型出错" + modelPath, e);
        console.error(e);

        if (errorback) {
          errorback(e);
        }
        // LoadCompleted(callback);

      });

    }

    function loadGltf(modelPath, callback, errorback) {


      let meshAndMats = _Global.YJ3D._YJSceneManager.checkLoadMesh(modelPath);
      if (meshAndMats != null) {
        LoadMesh(meshAndMats.mesh, callback);
        return;
      }

      // _Global.Webworker.load_mesh(modelPath,  (json) => {
      //   // console.log(" webworker 加载模型 33 ",json); 
      //   const loader = new GLTFLoader(); 
      //   loader.parse(json,"",(gltf)=>{
      //     console.log(" webworker 加载模型 44 ",gltf); 
      //     model = gltf.scene;

      //     gltf.animations = [];
      //     animations = gltf.animations;

      //     model.transform = owner;

      //     scene.add(model);
      //     _Global.YJ3D._YJSceneManager.addLoadMesh(modelPath, gltf);

      //     TraverseOwner(model);
      //     if (hasCollider) {
      //       CreateColliderFn(model);
      //     }
      //     LoadCompleted(callback);
      //   }); 
      // });
      // return;



      const loader = new GLTFLoader();
      
      // loader.setDRACOLoader(_Global.YJ3D._YJSceneManager.GetDracoLoader());

      // + ("?time="+new Date().getTime())
      loader.load(modelPath, function (gltf) {
        // console.log("加载 gltf 模型 00 ",modelPath,gltf);

        model = gltf.scene;
        animations = gltf.animations;

        model.transform = owner;

        scene.add(model);
        _Global.YJ3D._YJSceneManager.addLoadMesh(modelPath, gltf);

        TraverseOwner(model);
        if (hasCollider) {
          CreateColliderFn(model);
        }
        LoadCompleted(callback);

      }, undefined, function (e) {
        console.log("加载模型出错" + modelPath, e);
        console.error(e);

        if (errorback) {
          errorback(e);
        }
        // LoadCompleted(callback);

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
      if (modelPath.indexOf(".obj") > -1) {
        type = "obj";
      }

      if (modelPath.indexOf(".pmx") > -1) {
        type = "pmx";
      }
      if (type == "fbx") {
        meshScale = 0.01;
        loadFbx(modelPath, callback, errorback);
        return;
      }

      if (type == "obj") {
        // meshScale = 0.01;
        loadObj(modelPath, callback, errorback);
        return;
      }
      if (type == "gltf") {
        loadGltf(modelPath, callback, errorback);
        return;
      }
      if (type == "pmx") {
        loadMMD(modelPath, callback, errorback);
        return;
      }

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
      // console.log(" 已存在mesh ,复用之 ！", mesh);

      model = cloneFbx(mesh.scene).scene;
      animations = mesh.animations;

      scene.add(model);
      model.rotation.set(0, 0, 0);
      model.scale.set(meshScale, meshScale, meshScale);
      model.transform = owner;

      TraverseOwner(model);
      if (hasCollider) {
        CreateColliderFn(model);
      }
      LoadCompleted(callback);

    }


    this.CreateCollider = function (colliderVisible) {
      if (model == null) { return; }
      CreateColliderFn(model, colliderVisible);
    }
    function TraverseOwner(model) {
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {

          if (item.material.length > 0) {
          } else {
            let cloneMat = item.material.clone();
            item.material = cloneMat;
          }
          
          if (noShadow) {

          } else {
            item.castShadow = true;
            item.receiveShadow = true;
          }

          // console.log(" item ",item);
          item.transform = owner;
          item.tag = tag;
        }
      });

      // 魔兽世界中的装备
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          if (item.name.includes("item/objectcomponents/")) {
            console.log("魔兽世界中的装备",);
          }
        }
      });

    }
    //创建碰撞体
    function CreateColliderFn(model, colliderVisible) {
      // if (_Global.setting.inEditor) {
      //   return;
      // }
      let size = owner.GetData().scale;
      let hasCollider = false;

      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {

          if (item.name.includes("collider")) {
            item.visible = colliderVisible != undefined ? colliderVisible : false;
            hasCollider = true;

            let cSize = new THREE.Vector3(0, 0, 0);
            cSize.x = item.scale.x * size.x;
            cSize.y = item.scale.y * size.y;
            cSize.z = item.scale.z * size.z;
            _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(item, cSize);
            if (item.name.includes("land")) {
              _Global.YJ3D._YJSceneManager.AddLandCollider(item);
              // console.error("添加地面collider");
            } else {
              _Global.YJ3D._YJSceneManager.AddCollider(item);
            }

            // console.log(" 创建模型自身collider ",item.name);
          } else {
            if (item.name.includes("trigger")) {

              let cSize = new THREE.Vector3(0, 0, 0);
              cSize.x = item.scale.x;
              cSize.y = item.scale.y;
              cSize.z = item.scale.z;
              _Global.YJ3D._YJSceneManager.CreateTriangeMeshTrigger(item, cSize,
                model.modelId, "triggerArea", model.owner);

              // item.visible = false;
              // console.log("加载模型的信息 ",modelData);
              return;
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
      _Global.YJ3D._YJSceneManager.CreateTriangeMeshTrigger(plane, size,
        model.modelId, "triggerArea", model.owner);

      triggleObj = plane;
    }

    function LoadCompleted(callback) {
      if (callback) {
        callback(scope);
      }
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
            _Global.YJ3D._YJSceneManager.RemoveCollider(item); 
          }
        });
      }
    }
  }
}

export { YJMeshRenderer };