
import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// meshRenderer组件

// 只加载骨骼动画
class YJLoadAnimation {
  constructor(_this ) {
    let scope = this; 
    let animations = null;

    this.GetAnimations = function () {
      return animations;
    }
    //加载热点的obj 模型
    function loadFbx(modelPath, callback, errorback) {
 
      var fbxLoader = new FBXLoader();
      fbxLoader.load(
        modelPath,
        function (object) { 
          animations =  object.animations ; 
          // console.log(" 加载模型动画 " ,modelPath,animations ); 
          if (callback) {
            callback(animations[0]);
          } 

        }, undefined, function (e) {
          console.error("加载模型出错" , modelPath,e); 
        });
    }

    this.load = function (modelPath, callback, errorback) {
      if(modelPath == undefined){
        if (callback) {
          callback(null);
        }
        return;
      }
      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      if (type == "fbx") {
        loadFbx(modelPath, callback, errorback);
        return;
      }
      if (type == "gltf") {
        loadGltf(modelPath, callback, errorback);
        return;
      }

    }
    function loadGltf(modelPath, callback, errorback) {


      const loader = new GLTFLoader();
      
      let dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./public/threeJS/draco/gltf/');
      dracoLoader.setDecoderConfig({ type: "js" });
      dracoLoader.preload();
      loader.setDRACOLoader(dracoLoader);

      // + ("?time="+new Date().getTime())
      loader.load(modelPath, function (gltf) {
        animations = gltf.animations; 
        if (callback) {
          callback(animations[0]);
        } 
      }, undefined, function (e) {
        console.error("加载模型出错" , modelPath,e); 
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
  }
}

export { YJLoadAnimation };