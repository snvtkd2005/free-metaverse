



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";

import { YJCameraImage } from "/@/threeJS/YJCameraImage.js";

import { YJTransform } from "/@/threeJS/YJTransform.js";
import { YJMeshRenderer } from "/@/threeJS/YJMeshRenderer.js";
import { YJAnimator } from "/@/threeJS/loader/YJAnimator.js";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
import { MeshBasicMaterial } from "three";
import { YJDragModel } from "../../../threeJS/YJDragModel";
import { DragDivArea } from "./dragDivArea";

class SceneManager {
  constructor(scene, renderer, camera, _this, modelParent, indexVue, callback) {
    let scope = this;
    let _YJNPCManager = null;
    let transformController;
    let stats;
    let verticalMirror;

    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();
    let lookatList = [];

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let _DirectionalLight = null;

    const listener = new THREE.AudioListener();
    let _YJMinMap = null;
    let _YJ3dPhotoPlane = null;
    // 需要执行update的脚本
    let needUpdateJS = [];
    let lightData = null;

    this._YJTransformManager = null;
    let _YJBloomManager2 = null;
    let mirrorSphereCamera = null;

    let setting = null;

    let ambient = null;
    // 刚体高度
    let playerHeight = 0;

    let hdrCubeMap;
    let hdrCubeRenderTarget;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.Init = function () {


      InitFn();

    }


    function InitFn() {

      window.addEventListener('touchend', InputEnd);
      window.addEventListener('mouseup', InputEnd);

      _YJGlobal._SceneManager = scope;

      if (callback) {
        callback();
      }
      _this._YJSceneManager.AddNeedUpdateJS(scope);
    }

    let collects = ["camilo", "newjeans", "catburns", "jid"];
    this.ClickModel = (hitObject) => {

      console.log(" 点击模型 ", hitObject);
      if (hitObject == null) { return; }
      let hitName = hitObject.name;

      if (gameState == GAMESTATE.ROOM && indragRecord) {
        PickDownRecord(hitName.includes("recordJukeboxPos"));
        return;
      }

      let collectName = "";
      for (let i = 0; i < collects.length; i++) {
        const element = collects[i];
        if (hitName.includes(element)) {
          collectName = element;
        }
      }
      if (collectName == "") { return; }
      console.log("点击 收藏 ", collectName);

      return;



      let fromV3 = hitObject.rotation;
      let from = new THREE.Vector3(fromV3.x, fromV3.y, fromV3.z);
      let to = from.clone().add(new THREE.Vector3(0, -Math.PI / 6, 0));
      TweenRota(hitObject, from, to, 1000);


      let fromPos = hitObject.position.clone();
      let toPos = fromPos.clone().add(new THREE.Vector3(-0.2, 0, 0));
      TweenPos(hitObject, fromPos, toPos, 1000);

      _this.YJController.SetCamPosAndRota(
        _this._YJSceneManager.GetCamPosAndRota(
          "camLookat_" + collectName
        ),
        () => {
          console.log(" 到达收藏放到位  ");

          setTimeout(() => {
            _this.YJController.ResetToBeforeOnlyMove();
            TweenRota(hitObject, to, from, 1000);
            TweenPos(hitObject, toPos, fromPos, 1000);
          }, 1000);
        }
      );


    }
    let collectTriggerAndModelList = [];
    collectTriggerAndModelList.push({ triggerId: "camilo", modelName: "CamiloPopUp_2", planeName: "Camilo", texPath: "Camilo_Texture.png", recordTexPath: "disk_camilo.jpg" });
    collectTriggerAndModelList.push({ triggerId: "catBurns", modelName: "CatBurns_FixedUV_really_fixed", planeName: "Cat_Burns", texPath: "CatBurns_Texture.png", recordTexPath: "disk_catburns.jpg" });
    collectTriggerAndModelList.push({ triggerId: "jid", modelName: "JIDPopUp_2", planeName: "JID", texPath: "JID_Texture.png", recordTexPath: "disk_jid.jpg" });
    collectTriggerAndModelList.push({ triggerId: "newJeans", modelName: "NewJeansPopUp_3", planeName: "NewJeans", texPath: "NewJeans_Texture.png", recordTexPath: "disk_newjeans.jpg" });

    function GetCollectModelName(name) {
      let isCollect = false;
      for (let i = 0; i < collectTriggerAndModelList.length && !isCollect; i++) {
        const element = collectTriggerAndModelList[i];
        if (name.includes(element.triggerId)) {
          isCollect = true;
          return element;
        }
      }
      return null;
    }


    this.SetTriggerOverlap = (b, id, owner) => {
      console.log(b, id, owner);


      let isCollect = false;
      for (let i = 0; i < collectTriggerAndModelList.length && !isCollect; i++) {
        const element = collectTriggerAndModelList[i];
        if (id.includes(element.triggerId)) {
          isCollect = true;
        }
      }
      if (isCollect) {
        // console.log(allDyncModel);
        for (let i = 0; i < allDyncModel.length; i++) {
          const item = allDyncModel[i];
          if (item.id.includes(id) && !item.id.includes("starPos")) {
            if (b) {
              item.transform.GetComponent("Animator").ResetPlay();
            } else {
              item.transform.GetComponent("Animator").RewindPlay();
            }
            return;
          }
        }
        return;
      }

      if (id.includes("room")) {
        this.AddCollect("room");
        return;
      }


      if (id.includes("trunk")) {
        for (let i = 0; i < allDyncModel.length; i++) {
          const item = allDyncModel[i];
          if (item.id.includes("starPos") && item.id.includes("trunk")) {
            item.transform.SetActive(b);
            return;
          }
        }
        return;
      }
      if (id.includes("can")) {
        for (let i = 0; i < allDyncModel.length; i++) {
          const item = allDyncModel[i];
          if (item.id.includes("starPos") && item.id.includes("can")) {
            item.transform.SetActive(b);
            return;
          }
        }
        return;
      }
    }


    let sceneName = "";

    let allDyncModel = [];


    this.ChangeScene = function (e) {
      renderer.toneMapping = THREE.LinearToneMapping;
      let exposure = 0;
      let dd = setInterval(() => {
        exposure += 0.01;
        renderer.toneMappingExposure = exposure;
        if (exposure >= 1.3) {
          clearInterval(dd);
        }
      }, 20);
      console.log("renderer.toneMapping ", renderer.toneMapping, renderer.toneMappingExposure);



      let modelPath = e.modelPath;
      let npcTexPath = e.npcTexPath;

      if (modelPath.includes("Scene")) {
        sceneName = "Scene";

        scene.traverse((item) => {
          if (item.isMesh) {
            if (item.name.includes("Big_Glass")) {
              item.receiveShadow = false;
              item.castShadow = false;
              console.log("查找灯光排除物体");
              // item.visible = false;
            }
          }

        });

        // 截图查看相机位置像素
        // let _YJCameraImage = new YJCameraImage(_this, scene, renderer, camera);
        // setTimeout(() => {
        //   _YJCameraImage.GetCameraImagePixel();
        // }, 3000);

        // renderer.toneMapping = THREE.ACESFilmicToneMapping;

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileCubemapShader();

        const hdrUrls = ['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'];
        hdrCubeMap = new HDRCubeTextureLoader()
          .setPath(_this.GetPublicUrl() + '')
          .load(hdrUrls, function () {

            hdrCubeRenderTarget = pmremGenerator.fromCubemap(hdrCubeMap);

            hdrCubeMap.magFilter = THREE.LinearFilter;
            hdrCubeMap.needsUpdate = true;
            console.log("环境hdr加载好了");
          });


        // const path = _this.GetPublicUrl();
        // const format = '.png';
        // const urls = [
        //   path + 'px' + format, path + 'nx' + format,
        //   path + 'py' + format, path + 'ny' + format,
        //   path + 'pz' + format, path + 'nz' + format
        // ];
        // const refractionCube = new THREE.CubeTextureLoader().load(urls);
        // refractionCube.colorSpace = THREE.SRGBColorSpace;
        // refractionCube.mapping = THREE.CubeRefractionMapping;



        let _YJLoadModel = new YJLoadModel(_this, modelParent);

        LoadPosParent(_YJLoadModel, () => {
          LoadCollectParent(_YJLoadModel, () => {

            LoadRecodeItem(_YJLoadModel, () => {
              LoadRecodeParent(_YJLoadModel, () => {
                LoadHitClickParent(_YJLoadModel, () => {
                  LoadInteractiveParent(_YJLoadModel, () => {

                  });

                });
              });
            });
          });


          // LoadTriggerParent(_YJLoadModel,()=>{
          //   LoadHitParent(_YJLoadModel,()=>{
          //   });
          // });
        });



        // console.log("==创建共享屏幕 plane ==");
        // videoPlane = CreateScreenStreamPlane(new THREE.Vector3(0.03, 14, 28),
        //   new THREE.Vector3(-11, 15, -27),
        //   new THREE.Vector3(0, -Math.PI / 4, 0),
        //   new THREE.Vector3(0, 0, 0));

        // scene.traverse((obj)=>{
        //   if(obj.isMesh){
        //     if(obj.name.includes("node_landcollider_206432")){
        //       createReflectorMesh(obj.geometry);
        //     }
        //   }
        // });
      }

    }

    // 星星位置、可乐瓶位置、卡车位置、可乐罐子位置
    function LoadPosParent(_YJLoadModel, callback) {
      let modelPath = _this.GetPublicUrl() + "models/Scene/posParent.gltf";
      _YJLoadModel.load("posParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          let carNumId = 0;
          
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = false;
              let objName = obj.name;
              if (objName.includes("recordJukeboxPos")) {
                jukeboxPosRef = obj;
                return;
              }

              let object = new YJTransform(_this, modelParent, "", null, null, objName);

              if (objName.includes("starPos")) {

                let starModelPath = _this.GetPublicUrl() + "models/Scene/Stars_Animation.gltf";

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
                let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object, false);
                object.AddComponent("MeshRenderer", MeshRenderer);
                MeshRenderer.load(starModelPath, (scope) => {
                  let _YJAnimator = new YJAnimator(scope.GetModel(), scope.GetAnimations());
                  object.AddComponent("Animator", _YJAnimator);
                  _YJAnimator.SetScale(0.5);
                });

                if (objName.includes("trunk") || objName.includes("can")) {
                  object.SetActive(false);
                }
              }

              if (objName.includes("colaPos")) {
                let starModelPath = _this.GetPublicUrl() + "models/Scene/CokeBottle.gltf";

                object.SetPosRota(_this._YJSceneManager.GetWorldPosition(obj),
                  _this._YJSceneManager.GetWorldRotation(obj),
                  new THREE.Vector3(1, 1, 1)
                );
                let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
                object.AddComponent("MeshRenderer", MeshRenderer);
                MeshRenderer.load(starModelPath, (scope) => {
                  let model = scope.GetModel();
                  model.traverse((obj) => {
                    if (obj.isMesh) {
                      if (obj.name.includes("Glass")) {
                        // console.log("可乐模型下子物体 ", obj.name);
                        // obj.material.roughness = 0;
                        obj.material.envMap = hdrCubeRenderTarget.texture;
                        obj.material.envMapIntensity = 2;
                        obj.material.needUpdate = true;
                        console.log(obj);
                      }
                    }
                  });
                });
              }

              if (objName.includes("trunkPos")) {
                object = LoadSingleModel("models/Scene/HerritageLow_Trunk.gltf", "trunk", obj);
              }
              if (objName.includes("canPos")) {
                object = LoadSingleModel("models/Scene/HerritageLow_Can.gltf", "HerritageLow_Can", obj);
              }
              allDyncModel.push({ id: obj.name, transform: object });

              carNumId++;

            }
          });


          modelParent.attach(jukeboxPosRef);

          if (callback) {
            callback();
          }

          // console.log(allDyncModel);


        });


    }
    function LoadHitClickParent(_YJLoadModel, callback) {
      let modelPath = _this.GetPublicUrl() + "models/Scene/hitParent.gltf";
      _YJLoadModel.load("hitParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();

          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = false;
              obj.castShadow = false;
              obj.receiveShadow = false;
              _this._YJSceneManager.AddCanHitModel(obj);
            }
          });

          if (callback) {
            callback();
          }
        });


    }
    function LoadTriggerParent(_YJLoadModel, callback) {

      modelPath = _this.GetPublicUrl() + "models/Scene/triggerParent.gltf";
      _YJLoadModel.load("triggerParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope2) => {
          let model2 = scope2.GetModel();
          model2.traverse((item) => {
            if (item.name.indexOf("Trigger") > -1) {
              let cSize = new THREE.Vector3(0, 0, 0);
              cSize.x = item.scale.x * 1;
              cSize.y = item.scale.y * 1;
              cSize.z = item.scale.z * 1;
              _this._YJSceneManager.CreateTriangeMeshTrigger(item, cSize,
                item.name, "triggerArea", null);
              item.visible = false
            }
          });
        });

      if (callback) {
        callback();
      }
    }
    function LoadHitParent(_YJLoadModel, callback) {
      modelPath = _this.GetPublicUrl() + "models/Scene/hitParent.gltf";
      _YJLoadModel.load("hitParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope2) => {
          let model2 = scope2.GetModel();
          model2.traverse((item) => {
            if (item.name.indexOf("Hit") > -1) {
              _this._YJSceneManager.RemoveCanHitModel(item);

              // _this._YJSceneManager.AddCanHitModel(item);

            }
          });
        });
      if (callback) {
        callback();
      }
    }

    // 加载收集物体的父物体，通过父物体下的子物体加载对应收集物品
    function LoadCollectParent(_YJLoadModel, callback) {
      let modelPath = _this.GetPublicUrl() + "models/Scene/collectParent.gltf";
      _YJLoadModel.load("collectParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          let carNumId = 0;
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = false;
              let objName = obj.name;
              let object = new YJTransform(_this, modelParent, "", null, null, objName);
              let collectItem = GetCollectModelName(objName);
              if (collectItem != null) {

                let starModelPath = _this.GetPublicUrl() + "models/Scene/" + collectItem.modelName + ".glb";
                object.SetPosRota(
                  _this._YJSceneManager.GetWorldPosition(obj),
                  _this._YJSceneManager.GetWorldRotation(obj),
                  new THREE.Vector3(1, 1, 1)
                );
                let transformAnchor = object.GetGroup();

                let MeshRenderer = new YJMeshRenderer(_this, transformAnchor, object);
                object.AddComponent("MeshRenderer", MeshRenderer);
                MeshRenderer.load(starModelPath, (scope) => {
                  let model = scope.GetModel();
                  // transformAnchor model
                  model.traverse((obj) => {
                    if (obj.isMesh) {
                      // console.log(" Camilo 下子物体 ", obj, obj.name);
                      if (obj.name.includes(collectItem.planeName)) {
                        let map = _this._YJSceneManager.checkLoadTexture(_this.GetPublicUrl() + "models/Scene/" + collectItem.texPath);
                        map.needUpdate = true;
                        map.flipY = false;
                        obj.material.map = map;
                        obj.receiveShadow = false;
                        obj.castShadow = false;
                      }
                    }
                  });

                  let _YJAnimator = new YJAnimator(model, scope.GetAnimations());
                  object.AddComponent("Animator", _YJAnimator);
                  _YJAnimator.SetScale(1);
                  _YJAnimator.SetLoop(false);
                  _YJAnimator.Stop();
                });
              }

              allDyncModel.push({ id: objName, transform: object });

              carNumId++;

            }
          });

          if (callback) {
            callback();
          }



        });


    }


    let recordModelItem = null;
    // 加载唱片模型
    function LoadRecodeItem(_YJLoadModel, callback) {
      let modelPath = _this.GetPublicUrl() + "models/Scene/VinylModel_01.gltf";
      _YJLoadModel.load("VinylModel_01", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          recordModelItem = model;
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = true;
              let mat = new MeshBasicMaterial({
                map: obj.material.map,
              });
              obj.material.dispose();
              obj.castShadow = false;
              obj.receiveShadow = false;
              obj.material = mat;

            }
          });
          if (callback) {
            callback();
          }
        });
    }


    let jukeboxNeedle = null;
    // 加载交互物品的父物体
    function LoadInteractiveParent(_YJLoadModel, callback) {
      let modelPath = _this.GetPublicUrl() + "models/Scene/interactiveParent.gltf";
      _YJLoadModel.load("interactiveParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          console.log(" interactiveParent ", model);
          jukeboxNeedle = model.children[0].children[0].children[0];
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = true;
              let objName = obj.name;
              // if (objName.includes("MainRecordPlayer_v04_Neddle")) {
              //   jukeboxNeedle = obj; 
              //   return;
              // }

            }
          });
          if (callback) {
            callback();
          }
        });
    }
    let indragRecord = false;

    let tempGroup = new THREE.Group();
    let rotaX = 0;
    // tempGroup.add(new THREE.AxesHelper(1));
    scene.add(tempGroup);
    this.HoverObject = function (hoverObject, hoverPoint) {
      if (hoverObject == null) { return; }
      // console.log("悬浮物体", hoverObject, hoverPoint);
      // 是否正在拖拽唱片
      if (gameState == GAMESTATE.ROOM && indragRecord) {
        scene.add(tempGroup);
        tempGroup.position.copy(hoverPoint);
        dragRecordObj.parent.attach(tempGroup);

        b_LerpRecordObj = true;
        targetPos.copy(tempGroup.position);
        // dragRecordObj.position.copy(tempGroup.position);

        // rotaX -= 0.01 
        // console.log(rotaX);
        // targetRota.set(Math.PI/6, Math.PI, Math.PI);
        targetRota.set(-0.2, Math.PI, Math.PI);

        indexVue.inDragRecordParent = false;
      }

    }
    let b_LerpRecordObj = false;
    let b_LerpRecordObj_length = 0;
    let targetPos = new THREE.Vector3();
    let currentTargetPos = new THREE.Vector3();
    let currentTargetRota = new THREE.Vector3();
    let targetRota = new THREE.Vector3();
    function LerpRecordObjToTargetPos() {
      if (b_LerpRecordObj) {
        b_LerpRecordObj_length += 0.1;
        currentTargetPos.lerp(targetPos, b_LerpRecordObj_length);
        dragRecordObj.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);

        console.log("正在拖拽 唱片 ");

        currentTargetRota.lerp(targetRota, b_LerpRecordObj_length);
        // dragRecordObj.rotation.set(currentTargetRota.x, currentTargetRota.y, currentTargetRota.z);



        // let distance = dragRecordObj.position.distanceTo(targetPos);
        // console.log("distance",distance);
        // console.log("distance",currentTargetPos, targetPos);
        if (checkV3Equel(currentTargetPos, targetPos) || b_LerpRecordObj_length >= 1) {
          b_LerpRecordObj = false;
          b_LerpRecordObj_length = 0;
        }

      }
    }
    function checkV3Equel(v1, v2) {
      return Math.abs(v1.z - v2.z) < 0.001
        || Math.abs(v1.x - v2.x) < 0.001
        || Math.abs(v1.y - v2.y) < 0.001;
    }
    let recordParent = null;
    let dragRecordObj = null;
    // 已经收藏的唱片数量
    let hasCollectCount = 4;

    // 已收集的唱片
    let collectList = [];
    let _YJDragModel = null;
    // 当前在中心的唱片索引
    let centerIndex = 0;
    // 唱片相对于唱片盒子的最大平移
    let recordModelItemOffsetZ = -0.23;
    // 加载拖拽唱片parent
    function LoadRecodeParent(_YJLoadModel, callback) {
      let modelPath = _this.GetPublicUrl() + "models/Scene/recordParent.gltf";
      _YJLoadModel.load("recordParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          recordParent = model;
          let carNumId = 0;


          let modelList = [];
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = true;
              let objName = obj.name;
              if (objName.includes("collider")) {
                _this._YJSceneManager.AddHoverCollider(obj);
                obj.visible = false;
              } else {
                let mat = new MeshBasicMaterial({
                  map: obj.material.map,
                });
                obj.material.dispose();
                obj.castShadow = false;
                obj.receiveShadow = false;
                obj.material = mat;
                obj.material.map.needUpdate = true;
                modelList.push(obj);
                carNumId++;
              }

            }
          });

          for (let i = 0; i < modelList.length; i++) {
            const element = modelList[i];
            AddRecordToBox(element);
            element.visible = false;
          }


          collectList = modelList;
          // UpdateRecordItemPos();

          camera.add(model);
          if (callback) {
            callback();
          }



        });


    }
    // 给唱片盒子添加唱片模型
    function AddRecordToBox(recordBox, callback) {

      let record = recordModelItem.clone();
      record.traverse((obj) => {
        if (obj.isMesh) {
          // obj.add(new THREE.AxesHelper(1));
          recordBox.add(obj);
          obj.position.set(0, 0, 0);
          let size = 6;
          obj.scale.set(size, size, size);
          obj.rotation.copy(recordDefaultRota);
          if (callback) {
            callback(obj);
          }
          // obj.rotation.set(0, 0, Math.PI);
        }
      });


    }


    // 所在场景  主场景、唱片室
    var GAMESTATE = { MAIN: 0, ROOM: 1 };


    // 游戏数据
    var GAMGEDATA = {
      // 在唱片室拖拽唱片后，准备进入游戏
      inReayEnterGame: false,
    };

    let gameState = GAMESTATE.MAIN;
    function CallInCollectRoom() {
      if (gameState == GAMESTATE.ROOM) { return; }
      gameState = GAMESTATE.ROOM;
      _this.YJController.SetCanMoving(false);
      _this.YJController.CancelMoving();

      //进入到唱片室、不可移动、显示底部滑动区域
      indexVue.inDragRecordParent = true;
      BlackField(1, 0, -0.01, () => {
        setTimeout(() => {
          InCollectRoom();
          BlackField(0, 1, 0.01, () => {
            indexVue.inNeedBack = true;
          });
        }, 1000);
      });
    }
    // 进入唱片房间
    function InCollectRoom() {

      console.log(collectList);

      _this._YJSceneManager.ChangeViewByIdDirect("playerPos_room");
      //显示底部唱片
      for (let i = 0; i < currentCollect.length; i++) {
        collectList[i].visible = true;
      }
      UpdateRecordItemPos();

      maxOffsetX = recordWidth * currentCollect.length - recordWidth / 2;
      if (_YJDragModel == null) {
        _YJDragModel = new YJDragModel(_this, scene, camera, renderer, renderer.document, dragBegin, dragEnd);
      } else {
        // _YJDragModel.addEventListener();
      }

      if (_dragDivArea != null) {
        _dragDivArea.addEventListener();
      }

      dragRecordObj = collectList[centerIndex].children[0];
      _YJDragModel.SetDragModel(dragRecordObj);

    }

    let currentCollect = [];


    function BlackField(from, to, step, callback) {
      let exposure = from;
      let dd = setInterval(() => {
        exposure += step;
        renderer.toneMappingExposure = exposure;

        if ((step > 0 && exposure >= to) || (step < 0 && exposure <= to)) {
          clearInterval(dd);
          if (callback) {
            callback();
          }
        }
      }, 20);
    }


    //点击唱片记录下来。
    this.AddCollect = function (collectName) {
      if (collectName == "room") {
        if (currentCollect.length == 0) {
          return;
        }
        CallInCollectRoom();
        return;
      }


      if (collectName == "can"
        || collectName == "trunk"
        || collectName == "cola"
        || collectName == "cola002") {
        currentCollect.push(collectName);
        //点击收藏物体后，删除其模型、碰撞区域、点击区域、指示星星动画
        for (let i = 0; i < allDyncModel.length; i++) {
          const element = allDyncModel[i];
          if (element.id.includes(collectName)) {
            element.transform.Destroy();
          }
        }
        return;
      }



      if (collectName == "catBurns"
        || collectName == "camilo"
        || collectName == "jid"
        || collectName == "newJeans") {
        currentCollect.push(collectName);
        //点击收藏物体后，删除其模型、碰撞区域、点击区域、指示星星动画
        for (let i = 0; i < allDyncModel.length; i++) {
          const element = allDyncModel[i];
          if (element.id.includes(collectName)) {
            element.transform.Destroy();
          }
        }

        //显示唱片盒
        let currentRecordBox = collectList[currentCollect.length - 1];
        // console.log(currentRecordBox);

        let collectItem = GetCollectModelName(collectName);

        let map = _this._YJSceneManager.checkLoadTexture(_this.GetPublicUrl() + "models/Scene/" + collectItem.texPath);
        // map.needUpdate = true; 
        // map.flipY = true; 
        currentRecordBox.material.map = map;

        let map2 = _this._YJSceneManager.checkLoadTexture(_this.GetPublicUrl() + "models/Scene/" + collectItem.recordTexPath);
        let mat = CreateBasicColorMat();
        mat.map = map2;
        currentRecordBox.children[0].material = mat;

      }
    }
    function CreateBasicColorMat() {
      let mat = new THREE.MeshBasicMaterial({

      });
      return mat;
    }




    let recordDefaultRota = new THREE.Vector3(0, 0, 0);
    // 拖拽唱片开始
    function dragBegin() {

      if (!b_LerpRecordObj) {
        currentTargetPos.copy(dragRecordObj.position);
        currentTargetRota.copy(recordDefaultRota);

      }
      indragRecord = true;
    }
    // 拖拽唱片结束
    function dragEnd(obj) {
      _this.YJRaycaster.CallClick();
    }

    this.backFn = function () {


      // 从唱片室返回
      if (gameState == GAMESTATE.ROOM) {

        indragRecord = false;
        b_LerpRecordObj = false;

        ChangeViewToMainRoom();

        if (_dragjukeboxNeedle) {
          _dragjukeboxNeedle.dispose();
        }
        if (_dragDivArea != null) {
          _dragDivArea.dispose();
        }

        if (_YJDragModel != null) {
          _YJDragModel.SetDragModel(null);
        }



        // 显示唱片盒子
        for (let i = 0; i < currentCollect.length; i++) {
          collectList[i].visible = false;
        }
        indexVue.inDragRecordParent = false;



        gameState = GAMESTATE.MAIN;
        return;
      }



    }

    function ChangeToMainRoom() {
      indexVue.inNeedBack = false;
      // 从唱片室返回
      if (gameState == GAMESTATE.ROOM) {
        indragRecord = false;
        b_LerpRecordObj = false;

        ChangeViewToMainRoom();

        if (_dragjukeboxNeedle) {
          _dragjukeboxNeedle.dispose();
        }
        if (_dragDivArea != null) {
          _dragDivArea.dispose();
        }

        if (_YJDragModel != null) {
          _YJDragModel.SetDragModel(null);
        }

        // 显示唱片盒子
        for (let i = 0; i < currentCollect.length; i++) {
          collectList[i].visible = false;
        }
        indexVue.inDragRecordParent = false;



        gameState = GAMESTATE.MAIN;
        return;
      }

    }
    function ChangeViewToMainRoom() {

      BlackField(1, 0, -0.01, () => {

        // // 还原摄像机静态到漫游状态
        _this.YJController.ChangeCtrlState();
        // _this.YJController.ResetToBeforeOnlyMove();

        _this._YJSceneManager.ChangeViewByIdDirect("playerPos_main");
        _this.YJController.SetCanMoving(true);
        _this.threeJSfocus();

        if (_dragjukeboxNeedle != null) {
          _dragjukeboxNeedle.dispose();
        }

        if (singleRecordModel != null) {
          singleRecordModel.visible = false;
        }

        BlackField(0, 1, 0.01, () => {

        })


        if (GAMGEDATA.inReayEnterGame) {
          // 把拖拽到唱片机的唱片，放回盒子里
          console.log("centerIndex ", centerIndex);
          AddRecordToBox(collectList[centerIndex], (obj) => {
            obj.material = dragRecordObj.material;
            dragRecordObj.parent.remove(dragRecordObj);
            _this._YJSceneManager.ClearMesh(dragRecordObj);
            dragRecordObj = null;
          });
        }

      })

    }


    let jukeboxPosRef = null;

    let jukeboxNeedleRotaOrder = { current: -25, min: -25, max: 0 };

    //拖拽唱片机针的区域js
    let _dragjukeboxNeedle = null;
    // 放下唱片
    function PickDownRecord(inJukebox) {
      indragRecord = false;
      b_LerpRecordObj = false;
      console.log(" 拖拽结束后点击 ", inJukebox);

      indexVue.inDragRecordParent = true;

      let from = dragRecordObj.position.clone();

      //还原到盒子里的坐标
      tempV3.x = tempV3.y = 0;
      tempV3.z = recordModelItemOffsetZ;
      let rotaFrom = from.clone();
      rotaFrom.set(-0.2, Math.PI, Math.PI);
      let rotaTo = from.clone();
      rotaTo.copy(recordDefaultRota);

      let lookatQuat = jukeboxPosRef.getWorldQuaternion(new THREE.Quaternion());

      //判断唱片是否应该放到唱片机上。 
      if (inJukebox) {


        GAMGEDATA.inReayEnterGame = true;

        //放到唱片里的坐标
        modelParent.attach(dragRecordObj);

        collectList[centerIndex].children = [];
        // console.log(collectList[centerIndex]);

        from = dragRecordObj.position.clone();
        tempV3 = jukeboxPosRef.position.clone();

        dragRecordObj.scale.set(2, 2, 2);
        //隐藏底部唱片组
        indexVue.inDragRecordParent = false;

        for (let i = 0; i < collectList.length; i++) {
          collectList[i].visible = false;
        }


        if (_dragjukeboxNeedle == null) {
          _dragjukeboxNeedle = new DragDivArea(_this, scene, camera, renderer.document,
            (offsetX, offsetY) => {
              if (jukeboxNeedle) {
                jukeboxNeedleRotaOrder.current += offsetX * 55;
                //播放唱片针音效
                if (jukeboxNeedleRotaOrder.current <= jukeboxNeedleRotaOrder.min) {
                  jukeboxNeedleRotaOrder.current = jukeboxNeedleRotaOrder.min;
                  console.log("到达 右 边界");
                  return;
                }
                if (jukeboxNeedleRotaOrder.current >= jukeboxNeedleRotaOrder.max) {
                  jukeboxNeedleRotaOrder.current = jukeboxNeedleRotaOrder.max;
                  console.log("到达 左 边界");
                  // 播放视频
                  LoadRecordMP4(indexVue.GetPublicUrl() + "videos/" + currentCollect[centerIndex] + ".mp4.txt", dragRecordObj);
                  //视角往下推进
                  _this.YJController.SetCamPosAndRota(
                    _this._YJSceneManager.GetCamPosAndRota("camLookat_record"),
                    () => {
                      console.log(" 到达 唱片 最近位置  ");
                      ChangeToMainRoom();
                    }, 6000
                  );
                  console.log(currentCollect[centerIndex]);
                  //清除滑动事件
                  _dragjukeboxNeedle.dispose();
                  return;
                }
                jukeboxNeedle.rotateY(-offsetX);
              }
              //  console.log(offsetX,  jukeboxNeedle.rotation);
            }
          );
        } else {
          _dragjukeboxNeedle.addEventListener();
          jukeboxNeedleRotaOrder.current = jukeboxNeedleRotaOrder.min;
          jukeboxNeedle.rotation.set(0, 0.4353, 0);
        }

      } else {

      }

      let to = tempV3.clone();
      // console.log("还原唱片位置", from, to);
      // 还原唱片位置
      TweenPos(dragRecordObj, from, to, 500, () => {
        if (!inJukebox) {
          _YJDragModel.SetDragModel(dragRecordObj);
        } else {
          _this.YJController.SetCamPosAndRota(
            _this._YJSceneManager.GetCamPosAndRota(
              "camLookat_jukebox"
            ),
            () => {
              console.log(" 到达 唱片机位置  ");

              // setTimeout(() => {
              //   _this.YJController.ResetToBeforeOnlyMove(); 
              // }, 1000);
            }
          );
        }
      });

      if (inJukebox) {
        TweenRota2(dragRecordObj, lookatQuat, 1500);
      } else {
        // 还原唱片 旋转
        TweenRota(dragRecordObj, rotaFrom, rotaTo, 1500);
      }

    }



    // 左滑动最大距离。 收藏的数量越多，值越大
    let maxOffsetX = 0.2;
    //拖拽唱片盒子的宽度
    let recordWidth = 0.38;
    let inDragView = false;
    let _dragDivArea = null;
    // 鼠标或触摸输入结束
    function InputEnd() {
      if (gameState == GAMESTATE.ROOM) {

        console.log(" mouseup or touchend ");
        if (inDragView && recordParent != null) {
          LerpRecordParentToCenter();
        }
        if (_dragDivArea != null) {
          _dragDivArea.SetMouseDown(false);
        }
      }
    }


    // 监听div区域的滑动事件. 滑动事件回调滑动模型
    this.InitDragDivArea = function (div) {


      _dragDivArea = new DragDivArea(_this, scene, camera, div,
        (offsetX, offsetY) => {
          inDragView = true;
          if (recordParent != null) {
            tempV3.x = -offsetX;
            // console.log(recordParent.position.x + tempV3.x, maxOffsetX);
            if ((recordParent.position.x + tempV3.x) >= 0.2) {
              return;
            }
            //限定左滑动最大距离
            if (Math.abs(recordParent.position.x + tempV3.x) >= maxOffsetX) {
              return;
            }
            tempV3.y = 0;
            tempV3.z = 0;
            recordParent.position.add(tempV3);

            //设置唱片模型在唱片盒子中的位置，离中心越近，越出盒子
            UpdateRecordItemPos();
          }
        },
        () => {
          LerpRecordParentToCenter();
        }
      );
    }

    // 插值移动场景父物体到中心位置
    function LerpRecordParentToCenter() {
      inDragView = false;

      let from = recordParent.position.clone();

      //计算出当前滑动位置，距离最近的唱片中心
      let i = Math.round(Math.abs(from.x) / recordWidth);
      // console.log("计算得出应出于哪个唱片位置 ", i);
      tempV3.x = i * recordWidth * -1;

      if (from.x > 0) {
        tempV3.x = 0;
      }
      tempV3.y = tempV3.z = 0;
      let to = tempV3.clone();
      TweenPos(recordParent, from, to, 500, () => {
        UpdateRecordItemPos();
        console.log("在中心位置的唱片索引为 ", centerIndex);

        dragRecordObj = collectList[centerIndex].children[0];
        _YJDragModel.SetDragModel(dragRecordObj);
      }, () => {
        UpdateRecordItemPos();
      });
    }

    // 更新唱片盒子中唱片的Z轴位置
    function UpdateRecordItemPos() {

      let from = recordParent.position.clone();
      for (let i = 0; i < collectList.length; i++) {
        const element = collectList[i];
        let offsetX = from.x - element.position.clone().x;
        let offsetZ = 0;
        if (Math.abs(offsetX) >= recordWidth) {
        } else {
          offsetZ = recordModelItemOffsetZ - Math.abs(offsetX) / recordWidth * recordModelItemOffsetZ;
        }
        if (Math.abs(offsetZ) > Math.abs(recordModelItemOffsetZ) - 0.05) {
          centerIndex = i;
        }
        if (element.children[0]) {
          element.children[0].position.set(0, 0, offsetZ);
        }
        // console.log(" 唱片偏移 ", i, offsetX, offsetZ);
      }



    }



    let tempPath = "";
    let tempV3 = new THREE.Vector3(0, 0, 0);
    let tempRotaV3 = new THREE.Vector3(0, 0, 0);
    let tempScaleV3 = new THREE.Vector3(1, 1, 1);

    function LoadSingleModel(path, name, refObj) {

      if (refObj != undefined) {
        tempV3 = _this._YJSceneManager.GetWorldPosition(refObj);
        tempRotaV3 = _this._YJSceneManager.GetWorldRotation(refObj);
      }

      tempPath = _this.GetPublicUrl() + path;
      let object = new YJTransform(_this, modelParent, "", null, null, name);
      object.SetPosRota(
        tempV3,
        tempRotaV3,
        tempScaleV3
      );
      let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
      object.AddComponent("MeshRenderer", MeshRenderer);
      MeshRenderer.load(tempPath, (scope) => {
      });

      return object;
    }


    async function RequestSceneData() {
      console.error("加载场景配置",);

      let config = {
        header: {
          "Content-Type": "application/json",
          'Accept': '*/*'
        }
      }

      let data = {
        "ActID": "AGBceHZifbTkmVvnNkgXnqPqnEDzWx",
      }

      getSceneData(JSON.stringify(data)).then(res => {
        console.log('====scenedata', res);
        if (res.status == 200) {
          if (res.data.code == 1) {
            let data = JSON.parse(res.data.data);
            console.log(" 获取场景配置 ", data);

            return;
          }
        }
        console.log(" 获取场景配置 ", res);
      })

      // const res = await _this.$axios.post("/worldActivity",
      //   JSON.stringify(data), config
      // );


      // if(res.status == 200){
      //   if(res.data.code == 1){
      //     let data = JSON.parse(res.data.data);
      //     console.log(" 获取场景配置 ", data);
      //     return;
      //   }
      // }

    }
    this.GetSceneModel = function (id) {

      // console.log("查找场景模型  ", id);
      for (let i = 0; i < allDyncModel.length; i++) {
        const element = allDyncModel[i];
        if (element.id == id) {
          return element.modelJS.GetModel();
        }
      }
      return null;
    }


    function createReflectorMesh(mirrorGeometry) {
      if (!mirrorGeometry) {
        mirrorGeometry = new THREE.PlaneGeometry(200, 100);
      }
      // let 
      let material = new THREE.MeshBasicMaterial({
        // map: new THREE.TextureLoader().load( _this.GetPublicUrl() + "textureone.jpg"),
        // color:0xffffff,
        // color:0x666666,
        transparent: true,
      });
      let groundMirror = new ReflectorMesh(mirrorGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0xffffff,
        material: material,
        reflectorFactor: 0.03,
      });
      groundMirror.position.y = 0.1;
      groundMirror.rotateX(-Math.PI / 2);
      console.log(groundMirror);
      scene.add(groundMirror);
    }

    let videoPlane = null;
    this.LoadScreenStreamVideo = function (video) {
      if (video == false || video == null) {
        return;
      }

      // console.log("共享屏幕画面视频", video);
      const _video = document.getElementById("video_" + video);

      const texture = new THREE.VideoTexture(_video);

      videoPlane.material.dispose();

      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture
      });
      videoPlane.material = mat;


      if (sceneName == "Scene1") {

      }

    }


    function LoadScreenStreamVideoFn(videoPlane, video) {
      if (video == false || video == null) {
        return;
      }
      const _video = document.getElementById(video);
      console.log(" 获取视频 ", _video);

      const texture = new THREE.VideoTexture(_video);
      videoPlane.material.dispose();

      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture
      });
      videoPlane.material = mat;

    }

    function TweenRota2(model, quat, duration, callback, update) {

      let current = new THREE.Vector3(0, 0, 0);
      let to = new THREE.Vector3(1, 1, 1);

      let rotaTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      // let rotaTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        // model.rotation.set(current.x, current.y, current.z);
        model.quaternion.rotateTowards(quat, current.x);
        if (update) {
          update();
        }
      }
      rotaTween.onUpdate(updateTargetPos);
      rotaTween.start() // 启动动画
      rotaTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
    }
    function TweenRota(model, from, _to, duration, callback, update) {

      let current = from.clone();
      let to = _to.clone();

      let rotaTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      // let rotaTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.rotation.set(current.x, current.y, current.z);
        if (update) {
          update();
        }
      }
      rotaTween.onUpdate(updateTargetPos);
      rotaTween.start() // 启动动画
      rotaTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
    }
    function TweenPos(model, from, _to, duration, callback, update) {
      let current = from.clone();
      let to = _to.clone();

      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      // let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.position.set(current.x, current.y, current.z);
        if (update) {
          update();
        }
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
    }


    //#region 播放唱片视频
    let singleRecordModel = null;
    function LoadRecordMP4(videoPath, model) {

      if (singleRecordModel == null) {
        let record = recordModelItem.clone();
        record.traverse((obj) => {
          if (obj.isMesh) {
            let quat = jukeboxPosRef.getWorldQuaternion(new THREE.Quaternion());
            //放到唱片里的坐标
            modelParent.attach(obj);
            tempV3 = jukeboxPosRef.position.clone();
            obj.scale.set(2, 2, 2);
            obj.position.copy(tempV3);
            obj.quaternion.rotateTowards(quat, 10);
            singleRecordModel = obj;
          }
        });
      }




      _this._YJSceneManager.LoadAssset(videoPath, (data) => {
        indexVue.$refs.txtmp4.src = data;
        indexVue.$refs.txtmp4.muted = false;
        indexVue.$refs.txtmp4.play();

        const texture = new THREE.VideoTexture(indexVue.$refs.txtmp4);
        singleRecordModel.material.dispose();

        let mat = new THREE.MeshBasicMaterial(
          {
            color: 0xaaaaaa,
            map: texture,
          });
        singleRecordModel.material = mat;
        singleRecordModel.visible = true;
      });

    }
    //#endregion
    //#region 
    //#endregion

    this.StopScreenStreamVideo = function () {

      if (sceneName == "Scene2") {
        videoPlane.material.dispose();
        let path = _this.GetPublicUrl() + "screenPic.jpg";
        let map = _this._YJSceneManager.checkLoadTexture(path);
        let mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: map,
        });
        videoPlane.material = mat;
      }
      if (sceneName == "Scene1") {

      }

    }
    function CreateScreenStreamPlane(size, pos, rotaV3, scale, textPath) {
      let geo = new THREE.BoxGeometry(size.x, size.y, size.z);

      let map = _this._YJSceneManager.checkLoadTexture(textPath);
      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: map,
      });
      let cube = new THREE.Mesh(geo, mat);
      modelParent.add(cube);
      cube.tag = "screenPlane";
      cube.position.copy(pos);
      cube.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
      cube.scale.set(scale.x, scale.y, scale.z);
      return cube;
    }



    function onPointerDown(event) {
      // console.log(" player pos = >", pos);

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const found = raycaster.intersectObjects(scene.children, true);
      // console.log(found);
      if (found.length > 0) {
        let all = "";
        for (let i = 0; i < found.length; i++) {
          const hitObj = found[i].object;
          if (hitObj.isMesh) {
            all += hitObj.name + "、";
            // console.log(" 鼠标位置的模型 ", hitObj);

            // all += hitObj.material.name +  "、";
          }
        }
        console.log(" 鼠标位置的模型 ", all);

      }

    }


    this._update = function () {
      // console.log(" update scene manager ");
      TWEEN.update();
      LerpRecordObjToTargetPos();
    }


    InitFn();
  }
}

export { SceneManager };