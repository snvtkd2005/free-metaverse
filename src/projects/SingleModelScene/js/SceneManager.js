



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";
 
import { YJAnimator } from "../../../threeJS/loader/YJAnimator";

class SceneManager {
  constructor(scene, renderer, camera, _this, modelParent, indexVue, callback) {
    let scope = this;
    let _YJNPCManager = null;
    let _YJ3dPhotoPlane = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.Init = function () {
      InitFn();
    }


    function InitFn() {

      _YJGlobal._SceneManager = scope;
 
      // window.addEventListener('mousemove', onPointerDown);
 
      if (callback) {
        callback();
      } 
      _this._YJSceneManager.AddNeedUpdateJS(scope);
    }

    let sceneName = "";

    let allDyncModel = [];
    let inJoystick = true;
    this.JoystickAxis = function (x, y) {
      if (!inJoystick) { return; }
      // console.log("摇杆 ",x,y);
      if (_YJCar == null) {
        return;
      }
      if (x == 0) {
        _YJCar.SetKeyboardUp("KeyA");
        _YJCar.SetKeyboardUp("KeyD");
      } else {
        _YJCar.SetKeyboardUp("KeyA");
        _YJCar.SetKeyboardUp("KeyD");
        _YJCar.SetKeyboard(x < 0 ? "KeyA" : "KeyD");
      }
      if (y == 0) {
        _YJCar.SetKeyboardUp("KeyW");
        _YJCar.SetKeyboardUp("KeyS");
      } else {
        _YJCar.SetKeyboardUp("KeyW");
        _YJCar.SetKeyboardUp("KeyS");
        _YJCar.SetKeyboard(y < 0 ? "KeyW" : "KeyS");
      }


    }

   
    this.ChangeScene = function (e) {
 
      let modelPath = e.modelPath;
      let _YJLoadModel = new YJLoadModel(_this, scene);
      // LoadPosParent(_YJLoadModel);
    }


    function LoadPosParent(_YJLoadModel, callback) {
      let modelPath = _this.GetPublicUrl() + scenePath + "posParent.gltf";
      _YJLoadModel.load(
        "posParent",
        modelPath,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1),
        false,
        null,
        (scope) => {
          let model = scope.GetModel();
          let carNumId = 0;

          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = false;
              let objName = obj.name;
              if (objName.includes("shoesPosRef")) {
                shoesPosRef = obj;
                return;
              }

              let object = new YJTransform(
                _this,
                modelParent,
                "",
                null,
                null,
                objName
              );

              if (objName.includes("starPos")) {
                let starModelPath =
                  _this.GetPublicUrl() + "models/Scene/Stars_Animation.gltf";

                let scale = new THREE.Vector3(2, 2, 2);

                if (objName.includes("cola")) {
                  scale.set(1.5, 1.5, 1.5);
                }

                object.SetPosRota(
                  _this._YJSceneManager.GetWorldPosition(obj),
                  _this._YJSceneManager.GetWorldRotation(obj),
                  scale
                  //  new THREE.Vector3(1.5, 1.5, 1.5)
                );
                let MeshRenderer = new YJMeshRenderer(
                  _this,
                  object.GetGroup(),
                  object,
                  false
                );
                object.AddComponent("MeshRenderer", MeshRenderer);
                MeshRenderer.load(starModelPath, (scope) => {
                  let _YJAnimator = new YJAnimator(
                    scope.GetModel(),
                    scope.GetAnimations()
                  );
                  object.AddComponent("Animator", _YJAnimator);
                  _YJAnimator.SetScale(0.5);
                });

                if (objName.includes("trunk") || objName.includes("can")) {
                  object.SetActive(false);
                }
              }

              if (objName.includes("colaPos")) {
                let starModelPath =
                  _this.GetPublicUrl() + "models/Scene/CokeBottle.gltf";

                object.SetPosRota(
                  _this._YJSceneManager.GetWorldPosition(obj),
                  _this._YJSceneManager.GetWorldRotation(obj),
                  new THREE.Vector3(1, 1, 1)
                );
                let MeshRenderer = new YJMeshRenderer(
                  _this,
                  object.GetGroup(),
                  object
                );
                object.AddComponent("MeshRenderer", MeshRenderer);
                MeshRenderer.load(starModelPath, (scope) => {
                  let model = scope.GetModel();
                  model.traverse((obj) => {
                    if (obj.isMesh) {
                      if (obj.name.includes("Glass")) {
                        // console.log("可乐模型下子物体 ", obj.name);

                        // obj.material.envMap = _Global.hdrEquirect;
                        // obj.material.envMapIntensity = 2;
                        // obj.material.needUpdate = true;
                        // console.log(obj);
                      }
                    }
                  });
                });
              }

              allDyncModel.push({ id: obj.name, transform: object });

              carNumId++;
            }
          });


          if (callback) {
            callback();
          }

          // console.log(allDyncModel);
        }
      );
    }
 
    this._update = function () {

      TWEEN.update();
      for (let i = 0; i < allDyncModel.length; i++) {
        allDyncModel[i].modelJS._update();
      }
      
      // console.log( ' Scene polycount : ', renderer.info.render.triangles  );
      // console.log( ' Scene drawcall : ', renderer.info.render.calls  );
    }


    InitFn();
  }
}

export { SceneManager };