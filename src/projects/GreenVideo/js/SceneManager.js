



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { YJRigidbodyOverlep } from "/@/threeJS/YJRigidbodyOverlep.js";

class SceneManager {
  constructor(scene, renderer, camera, _this, modelParent, indexVue, callback) {
    let scope = this;
    let _YJRigidbodyOverlep = null;
    this.Init = function () {
      InitFn();
    }


    function InitFn() {

      // _YJGlobal._SceneManager = scope;

      if (callback) {
        callback();
      }
      _this._YJSceneManager.AddNeedUpdateJS(scope);

      //关闭控制器：不可操作旋转视角、移动等
      _this.YJController.SetEnabled(false);



    }

    //底线trigger. 实时设置底线trigger的位置为上一个落下的物体的坐标（高度）
    let downLineTrigger = null;


    // 物体落下后是否锁定  
    let isLockDown = true;

    this.ClickModel = (hitObject) => {
      console.log(" 点击模型 ", hitObject);

    }

    let material = null;

    let readyBox = null;
    let size = 0.2;

    let boxItem = null;
    let gaojiaobeismall = null;
    let colliderScale = 0.8;

    let needHeight = 0;

    let canDownMesh = [];
    let tempPos = new THREE.Vector3();
    this.ChangeScene = function (e) {
      return;

      let modelPath = e.modelPath;
      let npcTexPath = e.npcTexPath;

      if (modelPath.includes("Scene")) {
        console.log("加载 扩展场景 222222222");
        let modelPath = "models/Scene/dfsParent.gltf";
        // let modelPath = "models/Scene/gaojiaobeibox.gltf";
        // let modelPath = "models/Scene/gaojiaobeiboxsmall.gltf";
        // let modelPath = "models/Scene/gaojiaobei.gltf";
        // let modelPath = "models/Scene/jengaItem.gltf";
        let _YJLoadModel = new YJLoadModel(_this, modelParent);


        _YJLoadModel.load("jengaItem", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 1, 2), new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 1, 1), false, null, (scope) => {
            let model = scope.GetModel();

            let meshes = [];
            model.traverse((obj) => {
              if (obj.isMesh) {
                // material = obj.material;
                // console.log(" 异形mesh ", obj);
                meshes.push(obj);
                // obj.castShadow = true;
                // obj.receiveShadow = true;
                obj.visible = false;
              }
            });

            for (let i = 0; i < meshes.length; i++) {
              const obj = meshes[i];
              let group = new THREE.Group();
              modelParent.add(group);
              group.add(obj);
              let sizeScale = 0.755;
              if (obj.name.includes("gaojiaobeibox")) {
                canDownMesh.push({ modelName: "gaojiaobeibox", group: group, sizeScale: sizeScale, height: 0.46 });
              }
              if (obj.name.includes("bao001")) {
                canDownMesh.push({ modelName: "bao001", group: group, sizeScale: sizeScale, height: 0.41 });
              }
              if (obj.name.includes("bao002")) {
                canDownMesh.push({ modelName: "bao002", group: group, sizeScale: sizeScale, height: 0.41 });
              }
              if (obj.name.includes("cup001")) {
                canDownMesh.push({ modelName: "cup001", group: group, sizeScale: sizeScale, height: 0.46 });
              }
              if (obj.name.includes("box001")) {
                canDownMesh.push({ modelName: "box001", group: group, sizeScale: 0.5, height: 0.2 });
              }
            }



            CreateReadybox();
          });

        CreatePlanebox();

        _this._YJSceneManager.GetAmmo().SetGravityActive(false);


        // _this._YJSceneManager.CreateGeomotryRigidbody(readyBox, 1);

        // let boxes;
        // let size = 0.2;
        // const geometryBox = new THREE.BoxGeometry(size, size, size);
        // boxes = new THREE.Mesh(geometryBox, material);
        // boxes.castShadow = true;
        // boxes.receiveShadow = true;
        // modelParent.add(boxes);
        // boxes.position.set(0, 1, 2.1);
        // _this._YJSceneManager.CreateGeomotryRigidbody(boxes, 1);


        _YJRigidbodyOverlep = new YJRigidbodyOverlep(_this, (scope) => {
          scope.StopCheck();
          console.error(" 游戏失败 ");
          inFailed = true;
          indexVue.Failed();
        });

        // 创建 底线 trigger

        let mat = new THREE.MeshLambertMaterial({ color: 0xffff00, transparent: true, opacity: 0.0 });
        downLineTrigger = new THREE.Mesh(
          new THREE.BoxGeometry(2, 0.01, 0.2),
          mat
        );
        downLineTrigger.position.set(0, -0.5, 2.1);
        _this._YJSceneManager.GetAmmo().CreateTriangeMeshTrigger(downLineTrigger);
        modelParent.add(downLineTrigger);
        return;

        let scale = 1 * 0.5;
        let wallMat = new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        let wall = new THREE.Mesh(
          new THREE.BoxGeometry(5, 2, 2),
          wallMat
        );
        modelParent.add(wall);
        wall.position.set(0, 1, 2 + 1 + 0.2);
        _this._YJSceneManager.CreateGeomotryRigidbody(wall, 0);
        // _this._YJSceneManager.CreateTriangeMeshCollider(wall, new THREE.Vector3(scale, scale, scale));

        wall = new THREE.Mesh(
          new THREE.BoxGeometry(5, 2, 2),
          wallMat
        );
        modelParent.add(wall);
        wall.position.set(0, 1, 2 - 1);
        _this._YJSceneManager.CreateGeomotryRigidbody(wall, 0);

        // _this._YJSceneManager.CreateTriangeMeshCollider(wall, new THREE.Vector3(scale, scale, scale));

        console.log("wall ", wall);

      }

    }
 
    let highestPos = 0.46;
    let layerCount = 0;
    let upDonce = 0;
    let failDonce = 0;
    let playerY = 1;
    let inFailed = false;
    this._update = function () {
      // console.log(" update scene manager ");
      TWEEN.update();
  

    }


    InitFn();
  }
}

export { SceneManager };