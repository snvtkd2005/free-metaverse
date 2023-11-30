



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";

import { YJMapManager } from "/@/threeJS/YJMapManager.js";

import { YJAmmo } from "/@/threeJS/YJAmmo.js";

import { GetCurrentTime } from "/@/utils/api.js";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { inject, nextTick } from "vue";
import { YJNPC } from "/@/threeJS/YJNPC.js";
import { YJCurve } from "/@/threeJS/YJCurve.js";
import { YJMinMap } from "/@/threeJS/YJMinMap.js";
import { YJLoadModelManager } from "/@/threeJS/YJLoadModelManager.js";

// 整体场景辉光 管理器
import { YJBloomManager } from "/@/threeJS/YJBloomManager.js";
// 可设置单个模型辉光 管理器
import { YJBloomManager2 } from "/@/threeJS/YJBloomManager2.js";
import { YJChangeManager } from "/@/threeJS/YJChangeManager.js";
import { YJSandboxManager } from "/@/threeJS/YJSandboxManager.js";
import { YJTransformManager } from "/@/threeJS/YJTransformManager.js";
import { YJReflect } from "/@/threeJS/YJReflect.js";
import { GetDateH } from "/@/utils/utils.js";

import { YJVideo } from "/@/threeJS/YJVideo";
import { YJSqeImage } from "/@/threeJS/YJSqeImage.js";
import { YJUVanim } from "/@/threeJS/YJUVanim.js";

import { YJPathfinding } from "/@/threeJS/pathfinding/YJPathfinding.js";
import { Mesh, TextureLoader } from "three";
import { YJReflectMirror } from "/@/threeJS/YJReflectMirror.js";
import { YJWater } from "/@/threeJS/YJWater.js";
import { YJReflectPostprocessing } from "/@/threeJS/YJReflectPostprocessing.js";
import { YJCurse } from "/@/threeJS/YJCurse.js";
import { YJPlatform } from "/@/threeJS/YJPlatform.js";


import { YJ2dScene } from "/@/threeJS/YJ2dScene.js";
// import { YJ3dPhotoPlane } from "/@/threeJS/YJ3dPhotoPlane.js";
import { YJ3dPhotoPlane } from "./YJ3dPhotoPlane.js";

import { ReflectorMesh } from "/@/js/ReflectorMesh.js";

import { YJSprite } from "/@/threeJS/YJSprite.js";
import { YJCar } from "/@/threeJS/model/YJCar.js";
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";

import carData from "../data/carData.js";

import { getSceneData } from "./sceneApi.js"

import { YJGameManagerEditor } from "./YJGameManagerEditor.js";

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
    let _YJGameManagerEditor = null;
    this.GetDyncManager = function(){
      return _YJGameManagerEditor;
    }
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

    let cube = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.Init = function () {


      InitFn();


    }


    let InDriving = false;
    function InitFn() {

      // setTimeout(() => {
      //   RequestSceneData();
      // }, 1000);


      _YJGlobal._SceneManager = scope;

      // AddTestMat();
      // window.addEventListener('mousemove', onPointerDown);


      new YJKeyboard((key) => {
        inJoystick = false;
        if (_YJCar != null) {
          _YJCar.SetKeyboard(key);
        }
        
        if (key == "Escape") {
          ClearTarget();
          return;
        }
        if (key == "KeyF") {
          if (_YJCar != null) {
            if (!InDriving) {
              scope.InCar();
              InDriving = true;
            } else {
              scope.OutCar();
              InDriving = false;
            }
          }
        }
      }, (key) => {
        inJoystick = true;

        if (_YJCar != null) {
          _YJCar.SetKeyboardUp(key);
        }
      });

      // let _YJ2dScene = new YJ2dScene(_this,scene,camera);
      // _this._YJSceneManager.AddNeedUpdateJS(_YJ2dScene);

      if (callback) {
        callback();
      }
      // render();
      _this._YJSceneManager.AddNeedUpdateJS(scope);

      _YJGameManagerEditor = new YJGameManagerEditor(_this, indexVue,camera);
      _YJGameManagerEditor.AddChangeTargetListener((b) => {
        if (indexVue.$refs.gameUI) {
          indexVue.$refs.gameUI.SetTargetVaild(b);
        }
      });

    }

    let boneAttachList = [];

    this.SetTriggerOverlap = (b, id, owner) => {
      // console.log(" in sceneManager ", b, id, owner);
      if (owner.isYJTransform) {
        let msg = owner.GetMessage();
        if (msg.pointType == "weapon") {

          let state = _this.YJController.GetUserDataItem("weaponData");
          // console.log(" 碰到武器 ", msg.data,state);

          // 判断角色是否可以拾取武器
          if (state.weaponId != "") {
            return;
          }


          // 碰到武器就拾取
          _this.YJPlayer.GetBoneVague(msg.data.boneName, (bone) => {
            let weaponModel = owner.GetGroup();
            boneAttachList.push(
              {
                boneName: msg.data.boneName,
                parent: weaponModel.parent,
                transform: owner
              });
            bone.add(weaponModel);
            let pos = msg.data.position;
            let rotaV3 = msg.data.rotation;
            // console.log(" 设置武器坐标",rotaV3);
            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
            // weaponModel.position.set(100 * pos[0], 100 * pos[1], 100 * pos[2]);
            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
            weaponModel.scale.set(100, 100, 100);
            // 绑定到骨骼后，清除trigger
            owner.GetComponent("Weapon").DestroyTrigger();
            _this.YJController.SetUserDataItem("weaponData","pickType",msg.data.pickType);
            _this.YJController.SetUserDataItem("weaponData","weaponType",msg.data.weaponType);
            _this.YJController.SetUserDataItem("weaponData","weaponId",msg.data.id);

            _YJGameManagerEditor.SendModelState(owner.GetData().id,{modelType:owner.GetData().modelType, msg:{ display:false}});
            // console.log("bone ",bone); 
          });
        }

        // console.log(" in overlap yjtransform ", msg);

      }
    }

    this.PickDownWeapon = function () {
      if (boneAttachList.length == 0) { return; }
      let transform = boneAttachList[0].transform;
      boneAttachList[0].parent.attach(transform.GetGroup());
      let pos = _this._YJSceneManager.GetPlayerPosReduceHeight();
      pos.y += 1;
      transform.GetGroup().position.copy(pos);
      transform.GetGroup().scale.set(1, 1, 1);
      transform.GetGroup().rotation.set(0, 0, 0);
      if (transform.GetComponent("Weapon") != null) {
        transform.GetComponent("Weapon").Reset();
      }
      boneAttachList = [];
      //同步放下武器
      _YJGameManagerEditor.SendModelState(transform.GetData().id,{modelType:transform.GetData().modelType,msg:{display:true,pos:pos}});

    }

    let targetModel = null;
    this.SetTargetModel = function (transform) {
      if(targetModel != null){
        if(targetModel != transform){
          targetModel.RemoveHandle();
        }else{
          return;
        }
      }
      targetModel = transform;

      if (targetModel == null) {
        indexVue.$refs.HUD.$refs.headerUI.display = false;
        return;
      }
      // console.log(" targetModel ",targetModel);
      let message = targetModel.GetData().message;
      targetModel.AddHandle((data) => {
        if (data.baseData.health == 0) {
          indexVue.$refs.HUD.$refs.headerUI.display = false;
          return;
        }
        indexVue.$refs.HUD.$refs.headerUI.SetTarget(data);
      });
      indexVue.$refs.HUD.$refs.headerUI.SetTarget(message.data);
    }

    function ClearTarget(){
      // 点击空白位置 
      scope.SetTargetModel(null);
      _this.YJController.SetInteractiveNPC(null);
    }
    this.RightClick = (hitObject, hitPoint) => {
      
      ClearTarget();
      // console.log(" 右键点击 ", hitObject);
      if (hitObject.transform) {
        // 点击NPC
        let message = hitObject.transform.GetData().message;
        // console.log(" 右键点击 transform ", message);
        if (message) {
          if (message.pointType == "npc") {
            // 头像
            this.SetTargetModel(hitObject.transform);

            if (message.data.baseData.camp == "bl") {
              //敌人  
              //进入战斗状态
              if (message.data.baseData.health > 0) {
                _this.YJController.SetInteractiveNPC(hitObject.transform);
              }
            }
          }
        }
        return;
      }
      if (hitObject.owner) {
        let isLocal = hitObject.owner.isLocal;
        if (isLocal) {
          // 点击自身
        } else {
          // 点击其他角色
        }
        return;
      }
      // 点击空白位置 
      ClearTarget();

    }
    this.ClickPlayer = (owner) => {
      _YJGameManagerEditor.ClickPlayer(owner);
    }
    this.ClickModel = (hitObject) => {
      if (hitObject.transform) {
        // 点击NPC
        let message = hitObject.transform.GetData().message;
        // console.log(" 右键点击 transform ", message);
        if (message) {
          if (message.pointType == "npc") {
            // 头像
            this.SetTargetModel(hitObject.transform);
          }
        }
        return;
      }
      _YJGameManagerEditor.ClickModel(hitObject);
    }
    this.HoverObject = (hoverObject, hoverPoint) => {
      if(hoverObject == null){
        _Global.ReportTo3D("切换光标","正常");
        return;
      }
      
      _Global.ReportTo3D("切换光标","正常");
      if (hoverObject.transform) {
        // 点击NPC
        let message = hoverObject.transform.GetData().message;
        // console.log(" 右键点击 transform ", message);
        if (message) {

          // console.log(" == in scene manager editor  hover物体  ", hoverObject);
          // console.log(" == in scene manager editor  hover npc  ", message.pointType == "npc");

          if (message.pointType == "npc") {
            if (message.data.baseData.camp != _Global.user.camp && message.data.baseData.health != 0) {
              //敌人  
              _Global.ReportTo3D("切换光标","可攻击");
            }

          } 
        }
        return;
      }
    }
    this.CreateHotContent = (modelData, owner) => {
      if (modelData.id.includes("chair")) {
        //点击热点坐椅子
        _YJGameManagerEditor.SetSittingModel(owner.GetGroup());
        owner.SetPointVisible(false);
      }
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

    let npcMovePos = [];
    // 场景中模型的坐标。供NPC寻路使用
    this.GetNpcMovePos = function (moveName) {
      for (let i = 0; i < npcMovePos.length; i++) {
        const element = npcMovePos[i];
        if (element.moveName == moveName) {
          return element.pos;
        }
      }
      return null;
    }

    this.ChangeScene = function (e) {

      _YJGameManagerEditor.InitDyncSceneModels();

      return;
      let modelPath = e.modelPath;
      let npcTexPath = e.npcTexPath;


      // if (_YJNPCManager == null && npcTexPath != undefined) {
      //   _YJNPCManager = new YJNPCManager(_this,
      //     modelParent,
      //     _this.GetPublicUrl() + _this.GetModelUrl() + npcTexPath, npcStoryData, scope
      //   );
      // } else {

      //   if (this._YJNPCManager != null && npcTexPath != undefined) {
      //     this._YJNPCManager.LoadNpc(_this.GetPublicUrl() + _this.GetModelUrl() + npcTexPath);
      //   }
      // }



      if (modelPath.includes("Scene2")) {
        sceneName = "Scene2";
        videoPlane = CreateScreenStreamPlane(new THREE.Vector3(0.01, 1.5, 3),
          new THREE.Vector3(0, 1.55, -1.28),
          new THREE.Vector3(0, -Math.PI / 2, 0),
          new THREE.Vector3(1, 1, 1), _this.GetPublicUrl() + "screenPic.jpg");

      } else if (modelPath.includes("Scene3")) {
        sceneName = "Scene3";

        console.log("== 汽车 car 3 ==");

        new YJKeyboard((key) => {
          inJoystick = false;
          if (_YJCar != null) {
            _YJCar.SetKeyboard(key);
          }
        }, (key) => {
          inJoystick = true;

          if (_YJCar != null) {
            _YJCar.SetKeyboardUp(key);
          }
        });

        let modelPath = "models/Scene3/carPos.gltf";
        let _YJLoadModel = new YJLoadModel(_this, scene);

        _YJLoadModel.load("carPos", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 1, 1), false, null, (scope) => {
            let model = scope.GetModel();
            let carNumId = 0;
            model.traverse((obj) => {
              if (obj.isMesh) {
                obj.visible = false;
                modelPath = "m";
                let modelPathData = {};
                if (carNumId % 2 == 0) {
                  modelPathData = carData.modelsList[0];
                } else {
                  modelPathData = carData.modelsList[1];
                }


                //创建car
                let _YJCar = new YJCar(_this, scene, "car" + carNumId, modelPathData,
                  obj.position,
                  obj.rotation, new THREE.Vector3(1, 1, 1), null, (_scope) => {
                    //设置玩家进入到哪辆车。

                  });

                allDyncModel.push({ id: "car" + carNumId, modelJS: _YJCar });

                carNumId++;

              }
            });
          });



        // new YJCar(_this, scene, "car001", _this.GetPublicUrl() + modelPath,
        //   new THREE.Vector3(-1, 1, -1),
        //   new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(1, 1, 1), null, (_scope) => {
        //   });
        // new YJCar(_this, scene, "car001", _this.GetPublicUrl() + modelPath,
        //   new THREE.Vector3(5, 1, -1),
        //   new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(1, 1, 1), null, (_scope) => {
        //   });

        // new YJCar(_this, scene, "car001", _this.GetPublicUrl() + modelPath,
        //   new THREE.Vector3(10, 1, -1),
        //   new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(1, 1, 1), null, (_scope) => {
        //   });


      }
      else if (modelPath.includes("CarScene")) {
        sceneName = "CarScene";

        console.log("== 汽车 car 5 ==");

        new YJKeyboard((key) => {
          inJoystick = false;
          if (_YJCar != null) {
            _YJCar.SetKeyboard(key);
          }
        }, (key) => {
          inJoystick = true;

          if (_YJCar != null) {
            _YJCar.SetKeyboardUp(key);
          }
        });

        let modelPath = "models/CarScene/carPos.gltf";
        let _YJLoadModel = new YJLoadModel(_this, scene);

        _YJLoadModel.load("carPos", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
          new THREE.Vector3(1, 1, 1), false, null, (scope) => {
            let model = scope.GetModel();
            let carNumId = 0;
            model.traverse((obj) => {
              if (obj.isMesh) {
                obj.visible = false;
                let modelPathData = {};
                // if (carNumId % 2 == 0) { 
                //   modelPathData = carData.modelsList[0];
                // } else { 
                //   modelPathData = carData.modelsList[2];
                // }
                modelPathData = carData.modelsList[carNumId];

                //创建car
                let _YJCar = new YJCar(_this, scene, "car" + carNumId, modelPathData,
                  _this._YJSceneManager.GetWorldPosition(obj),
                  obj.rotation, new THREE.Vector3(1, 1, 1), null, (_scope) => {
                    //设置玩家进入到哪辆车。

                  });

                allDyncModel.push({ id: "car" + carNumId, modelJS: _YJCar });

                carNumId++;

              }
            });
          });



        // new YJCar(_this, scene, "car001", _this.GetPublicUrl() + modelPath,
        //   new THREE.Vector3(-1, 1, -1),
        //   new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(1, 1, 1), null, (_scope) => {
        //   });
        // new YJCar(_this, scene, "car001", _this.GetPublicUrl() + modelPath,
        //   new THREE.Vector3(5, 1, -1),
        //   new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(1, 1, 1), null, (_scope) => {
        //   });

        // new YJCar(_this, scene, "car001", _this.GetPublicUrl() + modelPath,
        //   new THREE.Vector3(10, 1, -1),
        //   new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(1, 1, 1), null, (_scope) => {
        //   });


      }
      else if (modelPath.includes("/Scene")) {
        sceneName = "Scene1";

        // new SignInWall(_this,modelParent);



        // 移动平台
        // let _YJPlatform = new YJPlatform(_this, scene, new THREE.Vector3(-15, 4, 25), new THREE.Vector3(-15, 4 + 1, 25)
        //   , "platform001", "offsetTime");
        // _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("platform001", "offsetTime", _YJPlatform);

        // 动画模型同步
        // _this.$parent.$parent.$refs.YJDync._YJDyncManager.GetDyncSceneManager().addDyncSceneModel("anim001", "offsetTime", _this._YJSceneManager.GetAnimModel("anim001"));


        // let size = 0.7;
        // let geo = new THREE.BoxGeometry(size, size, size);
        // let mat = new THREE.MeshStandardMaterial({
        //   color: 0x808080,
        //   roughness: 0.1,
        //   metalness: 0,
        // });
        // let cube = new THREE.Mesh(geo, mat);
        // scene.add(cube);
        // cube.tag = "chair";
        // cube.position.set(-15, 4, 27);
        // _this._YJSceneManager.CreateTriangeMeshCollider(cube);

        // cube.add(new THREE.AxesHelper(1));

        console.log("==创建共享屏幕 plane ==");
        videoPlane = CreateScreenStreamPlane(new THREE.Vector3(0.03, 14, 28),
          new THREE.Vector3(-11, 15, -27),
          new THREE.Vector3(0, -Math.PI / 4, 0),
          new THREE.Vector3(0, 0, 0));


        let modelPath = "models/Scene/npcPos.gltf";
        let _YJLoadModel = new YJLoadModel(_this, _this._YJSceneManager.GetmodelParent());
        _YJLoadModel.load("npcPos", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
          new THREE.Vector3(1, 1, 1), false, null, (scope) => {
            let model = scope.GetModel();
            // console.log("加载地名 ",model);
            model.traverse((obj) => {
              if (obj.isMesh) {
                let n = obj.name;
                let sp = n.split("_");
                obj.visible = false;
                npcMovePos.push({ moveName: sp[1], pos: _this._YJSceneManager.GetWorldPosition(obj) });
                // console.log("加载地名 ", npcMovePos);

              }
            });
          });

        // new YJGIFPoint(_this,scene,'烟花','new_spotd07_gif.png',new THREE.Vector3(0,10,0),2); 
        // new YJGIFPoint(_this,scene,'烟花','new_spotd07_gifBlack.png',new THREE.Vector3(0,10,0),2); 
        // new YJGIFPoint(_this,scene,'烟花','new_spotd07_gifBlack.png',new THREE.Vector3(0.5,11,0),2); 
        // new YJGIFPoint(_this,scene,'烟花','v003_sample_5.png',new THREE.Vector3(0.5,12,0),2,{defaultOffsetX:14,speed:2,delay:5000}); 
        // new YJGIFPoint(_this,scene,'烟花','new_spotd07_gif.png',new THREE.Vector3(0,10,0),2); 
        // new YJGIFPoint(_this,scene,'烟花','new_spotd07_gif.png',new THREE.Vector3(0,11,0),2); 






        // new YJCar(_this, scene, "car001", _this.GetPublicUrl() + modelPath,
        //   new THREE.Vector3(257, 1, -115),
        //   new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(1, 1, 1), null, (_scope) => {
        //   });


        // 角色位置切换测试
        // let group = new THREE.Group();
        // scene.add(group);
        // group.position.set(0, 5, 0);
        // _this.YJController.SetCameraBaseParent(group);
        // setTimeout(() => {
        //   _this.YJController.SetCameraBaseParent(null);
        // }, 3000);

        // 九宫格图片
        // new YJSprite(_this.GetPublicUrl() + "chatBG.png",scene,new THREE.Vector3(-13, 5, 20));

        // 播放视频的屏幕
        // let vp = CreateScreenStreamPlane(new THREE.Vector3(0.01, 2, 4),
        // new THREE.Vector3(-15, 6, 20),
        // new THREE.Vector3(0, -Math.PI / 4- 0.3, 0),
        // new THREE.Vector3(1, 1, 1));
        // LoadScreenStreamVideoFn(vp,"dPlayerVideoMainHLS");
        // // indexVue.$refs.playVideo.PlayVideoStream("https://zavatarpull.aicgworld.com/appzg/0000.m3u8");
        // indexVue.$refs.playVideo.PlayVideoStream("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");

        // scene.traverse((obj)=>{
        //   if(obj.isMesh){
        //     if(obj.name.includes("node_landcollider_206432")){
        //       createReflectorMesh(obj.geometry);
        //     }
        //   }
        // });
        // createReflectorMesh();

      }

      // console.error("== 单独房间设置 ==", e);

    }


    this.UpdateSkin = (_YJPlayer, playerName, playerState) => {

      // console.error(" 同步换装数据 ",playerName, playerState);
      if (playerName != "litleUnityChain2" || playerState == null || playerState == undefined) {
        _YJPlayer.ChangeSkinCompleted();
        return;
      }

      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      let skinData = avatarData.skinData;
      if (skinData == undefined || skinData.length <= 1) { return; }
      let sp = playerState.split('_');
      for (let i = 0; i < skinData.length; i++) {
        skinData[i].selected = parseInt(sp[i]);
      }
      let mode = "";
      let part = "";
      let targetPath = "";

      let faceSourcePath = "";
      let faceAddPath = "";

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          faceSourcePath = element.modelPath[element.selected];
        }
        if (element.title == "faceAdd") {
          faceAddPath = element.modelPath[element.selected];
        }
      }

      for (let i = 0; i < skinData.length; i++) {
        const element = skinData[i];
        if (element.title == "eye") {
          targetPath = element.modelPath[element.selected];

          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
          _YJPlayer.ChangeSkin(targetPath, "Face", element.mode, faceSourcePath);
          _YJPlayer.ChangeSkin(faceAddPath, "Face", "addTexture", faceSourcePath);
        }
        if (element.title == "hair") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
        if (element.title == "coat") {
          targetPath = element.modelPath[element.selected];
          _YJPlayer.ChangeSkin(targetPath, element.part, element.mode, faceSourcePath);
        }
      }
      setTimeout(() => {
        _YJPlayer.ChangeSkinCompleted();
      }, 500);
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
    //#region  同步

    this.AddDyncModel = function (id, _modelJS) {
      for (let i = 0; i < allDyncModel.length; i++) {
        const element = allDyncModel[i];
        if (element.id == id) {
          return;
        }
      }
      allDyncModel.push({ id: id, modelJS: _modelJS });
    }
    this.Receive = function (sceneState) {
      // console.log(" 场景中接收到场景同步状态 , " ,sceneState);
      for (let i = 0; i < allDyncModel.length; i++) {
        const element = allDyncModel[i];
        if (element.id == sceneState.id) {
          element.modelJS.ReceiveState(sceneState.state);
          return;
        }
      }
    }
    //#endregion

    let _YJCar = null;
    this.SetCar = function (scope) {
      if (scope == null) {
        if (_YJCar != null) {
          _YJCar = scope;
        }
        return;
      }
      console.log(" 查看汽车使用状态 ", scope.IsUsed());
      if (scope.IsUsed()) {
        return true;
      }
      _YJCar = scope;
      return false;
    }
    this.InCar = function (scope) {
      if (_YJCar == null) { return; }
      scope = _YJCar;

      scope.SetCanMoving(true);

      _this.YJController.SetPlayerAvatarDisplay(false); //隐藏角色，显示姓名条
      // _this.YJController.SetPlayerDisplay(false);
      _this.YJController.CancelMoving();
      _this.YJController.SetCanMoving(false);
      _this.YJController.SetLockDisplay(true);
      _this.YJController.SetCameraWheelPos(-10);
      _this.YJController.SetFollowParent(scope.GetModel());

      //把刚体放在中心，且刚体忽略物理效果、显示姓名条

      _this._YJSceneManager.GetAmmo().SetRigidbodySleep(false);

      let pos = _this._YJSceneManager.GetWorldPosition(scope.GetModel());
      _this._YJSceneManager.GetAmmo().SetPlayerPos(pos);
      _this.YJController.SetMyCtrlRbParent(scope.GetModel());

      _this.YJController.SetNameTransOffsetAndScale(2.5, 5);

    }
    this.OutCar = function (scope) {
      if (_YJCar == null) { return; }
      _this.YJController.ResetNameTransOffsetAndScale();
      _this.YJController.SetMyCtrlRbParent(scene);

      _this.YJController.SetPlayerRota();


      scope = _YJCar;
      let pos = _this._YJSceneManager.GetWorldPosition(scope.GetModel());
      pos.z += -2;
      _this._YJSceneManager.GetAmmo().SetPlayerPos(pos);

      // 最后激活刚体
      _this._YJSceneManager.GetAmmo().SetRigidbodySleep(true);

      _this.YJController.SetLockDisplay(false);
      // _this.YJController.SetPlayerDisplay(true);
      _this.YJController.SetPlayerAvatarDisplay(true);
      _this.YJController.StopFollow();
      _this.YJController.SetCanMoving(true);




      scope.SetCanMoving(false);

      _YJCar = null;
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

    this.Photo = function (callback) {
      _YJ3dPhotoPlane = new YJ3dPhotoPlane(_this, scene, renderer, camera);
      _YJ3dPhotoPlane.Photo(callback);
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
        ScreenPlaneTween(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 1, 1));
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



    // let targetScale = new THREE.Vector3(0,0,0);
    // let currentScale =  new THREE.Vector3(0,0,0);
    // 展开共享屏幕模型
    function ScreenPlaneTween(currentScale, targetScale, callback) {

      let movingTween = new TWEEN.Tween(currentScale).to(targetScale, 1500).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        videoPlane.scale.set(currentScale.x, currentScale.y, currentScale.z);
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

    }



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
        ScreenPlaneTween(new THREE.Vector3(1, 1, 1), new THREE.Vector3(0, 1, 0), () => {
          videoPlane.material.dispose();
          let mat = new THREE.MeshBasicMaterial({
            color: 0xffffff
          });
          videoPlane.material = mat;
          videoPlane.scale.set(0, 0, 0);
        });
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



    // function CreateScreenStreamPlane(size,pos,rotaV3,scale) {
    //   let size = 14;
    //   let geo = new THREE.BoxGeometry(0.3, size, size * 2);
    //   let mat = new THREE.MeshBasicMaterial({
    //     color: 0x666666,
    //   });
    //   let cube = new THREE.Mesh(geo, mat);
    //   modelParent.add(cube);
    //   cube.tag = "screenPlane";
    //   cube.position.set(-11, 15, -27);
    //   cube.rotation.set(0, -Math.PI / 4, 0);
    //   cube.scale.set(0,0,0);
    //   return cube;
    // }

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

    //实时刷新
    function render() {
      requestAnimationFrame(render);
      TWEEN.update();
    }
    this._update = function () {

      TWEEN.update();
      for (let i = 0; i < allDyncModel.length; i++) {
        allDyncModel[i].modelJS._update();
      }
    }


    InitFn();
  }
}

export { SceneManager };