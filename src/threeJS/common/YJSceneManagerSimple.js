


import * as THREE from "three"; 
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
 
 
/**
// 编辑模式的场景管理器
 * 
 */

class YJSceneManager {
  constructor(scene, renderer, camera, _this, platform, initCallback) {
    let scope = this;
  
    function Init() {
    }
   
    let dracoLoader = null;
    this.GetDracoLoader = function () {
      if (dracoLoader == null) {
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./public/threeJS/draco/gltf/');
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
      }
      return dracoLoader;
    }

    let allHoverCollider = [];
    // 鼠标悬浮检测的物体
    this.AddHoverCollider = function (colliderMesh) {
      // 给npc或可悬浮交互的物体设置简易碰撞体
      allHoverCollider.push(colliderMesh);
    }
    this.GetHoverCollider = function () {
      // 返回所有非静态模型
      // if(allHoverCollider.length == 0){
      // }
      // return allHoverCollider;
      return _Global.setting.inEditor ? modelParent.children : allHoverCollider;
      // return scene.children;
    }

    let allCollider = [];
    let allLandCollider = [];
    let allAndLandCollider = [];
    this.GetAllColliderAndLand = function () {
      return allAndLandCollider;
    }
    this.GetAllCollider = function () {
      return allCollider;
    }
    this.GetAllLandCollider = function () {
      return allLandCollider;
    }
    this.AddCollider = function (colliderMesh) {
      allCollider.push(colliderMesh);
      allAndLandCollider.push(colliderMesh); 
      // console.error("添加模型碰撞体",allCollider);
    }
    this.AddLandCollider = function (colliderMesh) {
      allLandCollider.push(colliderMesh);
      allAndLandCollider.push(colliderMesh); 
      // console.error("添加模型碰撞体 地面 ");
    } 
    //#region 记录模型信息中的模型名和模型路径

    let modelData = [];
    this.AddModel = function (modelName, modelPath) {
      for (let i = 0; i < modelData.length; i++) {
        const element = modelData[i];
        if (element.name == modelName) { return; }
      }
      modelData.push({ name: modelName, path: modelPath });
    }
    this.GetModelPath = function (modelName) {
      for (let i = 0; i < modelData.length; i++) {
        const element = modelData[i];
        if (element.name == modelName) {
          return element.path;
        }
      }
    }

    //#endregion


     

    //#region 把添加的模型存到数组中，加载相同模型时，clone现有的
    let loadMesh = [];
    function Destroy_loadMesh() {
      for (let i = loadMesh.length - 1; i >= 0; i--) {
        clearGroupFn(loadMesh[i].mesh);
      }
      loadMesh.splice(0, loadMesh.length);

    }
    this.addLoadMesh = function (path, mesh) {
      for (let i = loadMesh.length - 1; i >= 0; i--) {
        if (loadMesh[i].path == path) {
          return;
        }
      }
      // console.log("添加模型", path, mesh);

      let materials = [];
      if (path.includes(".fbx") || path.includes(".obj")) {

        // mesh.traverse(function (item) {
        //   if (item.isMesh) {
        //     materials.push(item.material);
        //   }
        // });

        loadMesh.push({ path: path, mesh: cloneAvatar(mesh, mesh.animations), materials });
      }
      if (path.includes(".gltf") || path.includes(".glb")) {

        // mesh.scene.traverse(function (item) {
        //   if (item.isMesh) {
        //     materials.push(item.material);
        //   }
        // });

        loadMesh.push({ path: path, mesh: cloneAvatar(mesh.scene, mesh.animations), materials });
      }

      // console.log("添加模型 222 ", path, mesh);
      // loadMesh.push({ path: path, mesh: mesh });
    }
    this.checkLoadMesh = function (path) {
      for (let i = loadMesh.length - 1; i >= 0; i--) {
        if (loadMesh[i].path == path) {
          return {
            mesh: loadMesh[i].mesh,
            materials: loadMesh[i].materials,
          }
        }
      }
      // console.log("未找到 copy 模型",path);
      return null;
    }
    this.cloneFbx = function(object){
      return cloneAvatar(object,object.animations);
    }
    function cloneAvatar(object, animations) {
      const clone = {
        animations: animations,
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
    this.DirectLoadMesh = function (path, callback) {
       
    }


    //#endregion

    //#region 把添加的 图片 存到数组中，加载相同模型时，clone现有的
    let loadTexture = [];
    this.addLoadTexture = function (path, texture) {
      for (let i = loadTexture.length - 1; i >= 0; i--) {
        if (loadTexture[i].path == path) {
          return;
        }
      }
      // console.log("添加路径" + path);
      loadTexture.push({ path: path, texture: texture });
    }
    this.checkLoadTexture = function (path) {
      if (path == null || path == undefined) { return null; }
      for (let i = loadTexture.length - 1; i >= 0; i--) {
        if (loadTexture[i].path == path) {
          // console.log(" ==找到 copy 图片 ", path);
          return loadTexture[i].texture;
        }
      }

      let texture = new THREE.TextureLoader().load(path, (texture) => {
        // console.log(" 加载新图片 ", path);
      }, null, () => {
        console.error("图片路径不存在 ======== ", path);
      });
      texture.encoding = 3001; //3000  3001
      this.addLoadTexture(path, texture);
      return texture;
    }
    //#endregion


    //#region needCheck 把添加的模型存到数组中，加载相同模型时，clone现有的
    let loadMesh_needCheck = [];
    this.addLoadMesh_needCheck_begin = function (path) {
      for (let i = loadMesh_needCheck.length - 1; i >= 0; i--) {
        if (loadMesh_needCheck[i].path == path) {
          return;
        }
      }
      // console.log("添加路径" + path);
      loadMesh_needCheck.push({ path: path, done: false, callback: [] });
    }
    this.addLoadMesh_needCheck_done = function (path) {
      for (let i = loadMesh_needCheck.length - 1; i >= 0; i--) {
        if (loadMesh_needCheck[i].path == path) {
          loadMesh_needCheck[i].done = true;

          for (let j = 0; j < loadMesh_needCheck[i].callback.length; j++) {
            loadMesh_needCheck[i].callback[j]();
          }
          return;
        }
      }
    }

    this.checkLoadMesh_needCheck = function (path, callback) {
      for (let i = loadMesh_needCheck.length - 1; i >= 0; i--) {
        if (loadMesh_needCheck[i].path == path) {
          if (loadMesh_needCheck[i].done) {
            if (callback) {
              callback();
            }
            return false;
          } else {
            if (callback) {
              loadMesh_needCheck[i].callback.push(callback);
            }
            return false;
          }
        }
      }
      return null;
    }
    //#endregion
 

   

    function loadAssset(url, callback) {
      _Global.Webworker.loadAssset(url,(data)=>{
        if (callback) {
          callback(data);
        }
      });
      return;
      // const res = await _this.$axios.get(url);
      // if (callback) {
      //   callback(res.data);
      // }
    }
    this.LoadAssset = function (path, callback) {
      loadAssset(path, callback);
    }
 
    Init();

  }
}

export { YJSceneManager };