



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
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";
import { YJNPCManager } from "./YJNPCManager.js";
import InstancedManager from "./obj/instancedManager.js";

import { GetSceneData, CheckUserInvaild } from "./loginApi";

import { YJGIFPoint } from "../../../threeJS/YJGIFPoint.js";
import { SignInWall } from "./SignInWall.js";

import { Reflector } from "./Reflector.js";
import { YJPlayer } from "/@/threejs/YJPlayer.js";

// import npcStoryData from "../data/npcStoryData.js";

// import carData from "../data/carData.js";

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

    let cube = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let inFreeCamera = false;

    this.Init = function () {


      InitFn();
    }


    function InitFn() {

      _YJGlobal._SceneManager = scope;

      // AddTestMat();
      // window.addEventListener('mousemove', onPointerDown);



      // let _YJ2dScene = new YJ2dScene(_this,scene,camera);
      // _this._YJSceneManager.AddNeedUpdateJS(_YJ2dScene);

      if (callback) {
        callback();
      }
      // render();
      _this._YJSceneManager.AddNeedUpdateJS(scope);



      new YJKeyboard((key) => {
        // 开启关闭自由相机模式
        if (key == "ShiftLeft+G") {
          inFreeCamera = !inFreeCamera;

          _Global.inFreeCamera = inFreeCamera;

          if (inFreeCamera) {
            //关闭重力，隐藏角色，视角最近
            _this.YJController.SetCameraWheelPos(0);
          } else {
            _this.YJController.SetCameraWheelPos(-4);
          }
          _this.YJController.SetGravityActive(!inFreeCamera);
          _this.YJController.SetDyncDisplay(!inFreeCamera);
          _this.YJController.SetPlayerDisplay(!inFreeCamera);
          _this.YJController.SetCanMouseWheel(!inFreeCamera);

          return;
        }
      });


      // 监听角色移动
      // _this.YJController.AddMovingListener(() => {

      // });




    }

    let sceneName = "";

    let allDyncModel = [];
    let inJoystick = true;
    this.JoystickAxis = function (x, y) {
      if (!inJoystick) { return; }
      // console.log("摇杆 ",x,y);


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


    let _SignInWall = null;
    this.GetSignInWall = function () {
      return _SignInWall;
    }

    this.ChangeNPCAnim = function (npcid, animName) {
      if (_YJNPCManager == null) { return; }
      _YJNPCManager.GetNpcById(npcid).ChangeAnim(animName);
    }


    function LoadNpc(npcData) {

      let avatarName = "guxiaoyu";
      // let avatarName = npcData.avatarName;
      let modelPath = npcData.modelPath;

      let _pos = npcData.pos;

      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(0, npcData.rotaY, 0);
      let size = new THREE.Vector3(1, 1, 1);
      let id = "npc001";
      let avatarData = indexVue.GetAvatarData(avatarName);
      avatarData.modelPath = modelPath;
      let message = npcData.message;

      let _YJNPC = new YJNPC(_this, modelParent, id, avatarData, pos, rotaV3, size);
      _YJNPC.SetMessage(JSON.stringify(message));
    }

    this.ChangeScene = function (e) {
      let modelPath = e.modelPath;
      let npcTexPath = e.npcTexPath;

      if (npcTexPath != undefined) {
        if (_YJNPCManager == null) {
          _YJNPCManager = new YJNPCManager(_this,
            modelParent,
            _this.GetPublicUrl() + _this.GetModelUrl() + npcTexPath, scope
          );
        } else {
          _YJNPCManager.LoadNpc(_this.GetPublicUrl() + _this.GetModelUrl() + npcTexPath);
        }
      }

      // LoadNpc(_Global.GetTexiaoData.npcData);


      sceneData = [];


      if (modelPath.includes("Scene2")) {
        sceneName = "Scene2";


        _SignInWall = new SignInWall(_this, modelParent, "models/Scene2/id_wall.glb",
          new THREE.Vector3(-6, 3, 250.5), new THREE.Vector3(0, -2, 0));


        // videoPlane = CreateScreenStreamPlane(new THREE.Vector3(0.01, 1.5, 3),
        //   new THREE.Vector3(0, 1.55, -1.28),
        //   new THREE.Vector3(0, -Math.PI / 2, 0),
        //   new THREE.Vector3(1, 1, 1), _this.GetPublicUrl() + "screenPic.jpg");

        scene.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.name.includes("zhanban_pingmu")) {
              let PosType = obj.name.replace("zhanban_pingmu", "");
              console.log("找到视频屏 ", obj.name, PosType);
              // sceneData.push({ PosType: obj.name, model: obj });
              sceneData.push({ PosType: PosType, model: obj });
            }

            //230519
            if (obj.name.includes("yuanpan_pingmu")) {
              let planeMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                map: obj.material.map
              });
              obj.material = planeMaterial;
            }
          }
        });

        LoadPlayerByModel("models/MeetingScene/SignFakeChar.gltf", avatarListMeeting, animListMeeting);


      } else if (modelPath.includes("MusicScene")) {
        sceneName = "MusicScene";

        // let reflectModelPath = 'models/MusicScene/refmesh.glb';
        // let _YJLoadModel2 = new YJLoadModel(_this, scene);
        // _YJLoadModel2.load("reflectMesh", _this.GetPublicUrl() + reflectModelPath,
        //   new THREE.Vector3(0, 0.1, 0),
        //   new THREE.Vector3(0, 0, 0),
        //   new THREE.Vector3(1, 1, 1), false, null, (scope) => {
        //     let modelMesh = scope.GetModel().geometry;
        //     let groundMirror = new Reflector(modelMesh, {
        //       clipBias: 0.003,
        //       textureWidth: window.innerWidth * window.devicePixelRatio * 1,
        //       textureHeight: window.innerHeight * window.devicePixelRatio * 1,
        //       color: 0x777777,
        //     });
        //     groundMirror.rotateX(-Math.PI / 2);
        //     groundMirror.position.y = 0;
        //     modelParent.add(groundMirror)
        //   }
        // )

        // let mirrorGeometry = new THREE.PlaneGeometry(1000, 700);
        // let groundMirror = new Reflector(mirrorGeometry, {
        //   clipBias: 0.003,
        //   textureWidth: window.innerWidth * window.devicePixelRatio * 0.3,
        //   textureHeight: window.innerHeight * window.devicePixelRatio * 0.3,
        //   color: 0x777777,
        // });
        // groundMirror.rotateX(-Math.PI / 2);
        // groundMirror.position.y = -6.85;
        // modelParent.add(groundMirror)


        // 签到墙
        _SignInWall = new SignInWall(_this, modelParent, "models/Scene2/id_wall.glb",
          new THREE.Vector3(224, -4.4, 0), new THREE.Vector3(0, 0, 0));



        scene.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.name.includes("screen")) {
              console.error("找到视频屏", obj.name);
              sceneData.push({ PosType: 12, model: obj });
            }

            if (obj.name.includes("pingmu")) {
              console.error("找到视频屏", obj.name);
              sceneData.push({ PosType: 13, model: obj });
            }
          }
        });


        setTimeout(() => {
          _YJNPCManager.GetNpcById("npc_10002").ChangeAnim("direct");
        }, 3000);

        let modelPath = "models/MusicScene/fireworks.gltf";
        let _YJLoadModel = new YJLoadModel(_this, modelParent);
        _YJLoadModel.load("fireworks", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
          new THREE.Vector3(1, 1, 1), false, null, (scope) => {
            let model = scope.GetModel();
            let carNumId = 0;
            model.traverse((obj) => {
              if (obj.isMesh) {
                obj.visible = false;

                //texiaoData
                let fireTex = _Global.GetTexiaoData.fireworkList[0];
                if (carNumId % 2 == 0) {
                } else {
                  fireTex = _Global.GetTexiaoData.fireworkList[1];
                }

                let q = Math.floor(Math.random() * 1000);
                new YJGIFPoint(_this, modelParent, '烟花' + carNumId, fireTex, _this._YJSceneManager.GetWorldPosition(obj), 50, { defaultOffsetX: 14, speed: 2, delay: q });
                carNumId++;
              }
            });


            // modelPath = "models/MusicScene/ych_04181604_low_PINGMU.glb";
            // _YJLoadModel.load("MusicScene", _this.GetPublicUrl() + modelPath, new THREE.Vector3(150, -5, 0), new THREE.Vector3(0, Math.PI, 0),
            //   new THREE.Vector3(1, 1, 1), false, null, (scope) => {
            //     let model = scope.GetModel();
            //     model.add(new THREE.AxesHelper(100));
            //     model.traverse((obj) => {
            //       if (obj.isMesh) {
            //         // obj.visible = false;
            //         if (obj.name.includes("screen")) {
            //           // setTimeout(() => {
            //           //   LoadStreamVideo(obj, "dPlayerVideoMainHLS");
            //           // }, 3000);

            //           console.error("找到视频屏", obj.name);
            //           sceneData.push({ PosType: 12, model: obj });
            //         }
            //       }
            //     });
            //   });

          });


        // setTimeout(() => {
        //   // 测试加载50个角色，不同衣服，不同发型，不同动作
        //   for (let i = 0; i < 50; i++) {
        //     setTimeout(() => {
        //       RandomGeneratePlayer(i + 1);
        //     }, i * 3000);
        //   }
        // }, 15000);


        // modelPath = "models/MusicScene/fakeCharacter.gltf";
        // _YJLoadModel.load("fakeCharacter", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        //   new THREE.Vector3(1, 1, 1), false, null, (scope) => {
        //     let model = scope.GetModel();
        //     model.traverse((obj) => {
        //       if (obj.isMesh) {
        //         obj.visible = false; 
        //         playerPosList.push({ pos: obj.position, rota: obj.rotation });
        //       }
        //     });
        //   });

        // setTimeout(() => { 
        //   for (let i = 0; i < playerPosList.length; i++) {
        //     setTimeout(() => {
        //       const element = playerPosList[i];
        //       RandomGeneratePlayerYCH(i + 1, element.pos, element.rota,avatarListMusic,animListMusic);
        //     }, i * 300);
        //   }
        // }, 5000);
        LoadPlayerByModel("models/MusicScene/fakeCharacter.gltf", avatarListMusic, animListMusic);

      }
      else if (modelPath.includes("MeetingScene")) {
        sceneName = "MeetingScene";

        scene.traverse((obj) => {
          if (obj.isMesh) {
            // BLoom2_zhuping 会议主屏 
            // BLoom2_beijing 会议背景 
            // BLoom2_XSP_yp 会议两侧 
            if (obj.name.includes("BLoom2_zhuping")) {
              console.log("找到视频屏", obj.name);
              sceneData.push({ PosType: 9, model: obj });
            }
            if (obj.name.includes("BLoom2_beijing")) {
              console.log("找到视频屏", obj.name);
              sceneData.push({ PosType: 10, model: obj });
            }
            if (obj.name.includes("BLoom2_XSP_yp")) {
              console.log("找到视频屏", obj.name);
              sceneData.push({ PosType: 11, model: obj });
            }
          }
        });


        LoadPlayerByModel("models/MeetingScene/MeetingfakeCharacter.gltf", avatarListMeeting, animListMeeting);
        LoadPlayerByModel("models/MeetingScene/MeetingSitChar.gltf", avatarListMeeting, animListSit);

        //#region 
        // _this.YJPlayer.DyncPlayerState({
        //   title:"单手拿物品",
        //   // modelPath:"models/playerSkin/fan_0408a_origPosition.glb",
        //   modelPath:"models/playerSkin/fan_0408b_handPosition.glb",
        //   boneName:"CC_Base_L_Hand",
        // });

        // let modelPath = "models/playerSkin/fan_0408a_origPosition.glb";
        // let _YJLoadModel = new YJLoadModel(_this, scene);
        // _YJLoadModel.load("npcPos", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        // new THREE.Vector3(1, 1, 1), false, null, (scope) => {
        //   let model = scope.GetModel();
        //   console.log("加载扇子 ",model);

        // });

        // _Global.BalloonRain(true, 1);
        // setTimeout(() => {
        //   _Global.BalloonRain(false);
        //   setTimeout(() => {
        //     _Global.BalloonRain(true, 2);
        //     setTimeout(() => {
        //       _Global.BalloonRain(false);
        //     }, 3000);
        //   }, 3000);
        // }, 3000);


        // instancedManager.createBalloon() ;
        // instancedManager.tweenUpdate();

        // setTimeout(() => {
        //   _Global.ChangeAvatar("female");
        //   setTimeout(() => {
        //     _Global.ChangeAvatar("male");
        //   }, 3000);
        // }, 3000);
        // return;
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

        // console.log("==创建共享屏幕 plane ==");
        // videoPlane = CreateScreenStreamPlane(new THREE.Vector3(0.03, 14, 28),
        //   new THREE.Vector3(-11, 15, -27),
        //   new THREE.Vector3(0, -Math.PI / 4, 0),
        //   new THREE.Vector3(0, 0, 0));


        // _YJLoadModel.load("npcPos", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        //   new THREE.Vector3(1, 1, 1), false, null, (scope) => {
        //     let model = scope.GetModel();
        //     // console.log("加载地名 ",model);
        //     model.traverse((obj) => {
        //       if (obj.isMesh) {
        //         let n = obj.name;
        //         let sp = n.split("_");
        //         obj.visible = false;
        //         npcMovePos.push({ moveName: sp[1], pos: _this._YJSceneManager.GetWorldPosition(obj) });
        //         // console.log("加载地名 ", npcMovePos);

        //       }
        //     });
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
        // new THREE.Vector3(-13, 6, 30),
        // new THREE.Vector3(0, -Math.PI / 4- 0.3, 0),
        // new THREE.Vector3(1, 1, 1));
        // LoadScreenStreamVideoFn(vp,"dPlayerVideoMain");

        // scene.traverse((obj)=>{
        //   if(obj.isMesh){
        //     if(obj.name.includes("node_landcollider_206432")){
        //       createReflectorMesh(obj.geometry);
        //     }
        //   }
        // });
        // createReflectorMesh();
        //#endregion

      }
      _Global.sceneName = sceneName;


      setTimeout(() => {
        RequestSceneData();
      }, 2000);

      //230520
      _Global.GetChairList();

      _this.YJPlayer.uid = localStorage.getItem("userId");
      // console.error("== 单独房间设置 ==", e);

    }


    // let playerPosList = [];

    let avatarListMusic = ["malelook1", "malelook2", "malelook3", "femalelook1", "femalelook2", "femalelook3"];
    let animListMusic = ["dacall", "dengpai", "brandish", "happy", "yeah", "direct"];

    let avatarListMeeting = ["maleHair1", "maleHair2", "maleHair3", "femaleHair1", "femaleHair2", "femaleHair3"];

    let animListMeeting = ["handClap", "hello", "dacall", "happy", "yeah", "idle"];
    let animListSit = ["sitting"];

    function LoadPlayerByModel(modelPath, avatarList, animList) {
      return;
      console.log("创建假人 ==========");

      let playerPosList = [];
      let _YJLoadModel = new YJLoadModel(_this, modelParent);
      _YJLoadModel.load("fakeCharacter", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = false;
              playerPosList.push({ pos: _this._YJSceneManager.GetWorldPosition(obj), rota: obj.rotation });
              // playerPosList.push({ pos: obj.position, rota: obj.rotation });
            }
          });
        });
      setTimeout(() => {
        for (let i = 0; i < playerPosList.length; i++) {
          setTimeout(() => {
            const element = playerPosList[i];
            RandomGeneratePlayerYCH(i + 1, element.pos, element.rota, avatarList, animList);
          }, i * 300);
        }
      }, 5000);
    }

    function RandomGeneratePlayerYCH(i, pos, rota, avatarList, animList) {

      // _Global.AddLog("添加假人数量 " + i);
      // console.log("创建假人 =========="+i,avatarList,animList);

      let _YJPlayer = new YJPlayer(_this, modelParent, true, "nickName", null, (scope) => {
      });

      // rota.y += Math.PI;

      _YJPlayer.setPlayerDefaultPosRota(pos, rota);

      let h = Math.floor(Math.random() * 1000);
      let t = Math.floor(Math.random() * 1000);
      _YJPlayer.CreateNameTrans(h + "" + t);

      let skinName = avatarList[generateRandomInt(0, 5)];
      _YJPlayer.LoadPlayer(
        skinName
      );

      //拿灯牌或荧光棒
      let animName = animList[generateRandomInt(0, animList.length - 1)];
      setTimeout(() => {
        // console.error("播放随机动作", animName);
        _YJPlayer.ChangeAnim(animName);
        if (animName == "brandish") {
          let num = generateRandomInt(0, _Global.GetTexiaoData.lightStickList.length - 1);
          let modelPath = _Global.GetTexiaoData.lightStickList[num];
          let state = {
            type: "单手拿物品",
            modelPath: modelPath,
            boneName: "CC_Base_R_Hand", //荧光棒参考骨骼 
            animName: animName,
            modelList: _Global.GetTexiaoData.lightStickList,
          }
          _YJPlayer.DyncPlayerState(state);
        }
        if (animName == "dengpai") {
          let num = generateRandomInt(0, _Global.GetTexiaoData.dengPaiList.length - 1);
          let modelPath = _Global.GetTexiaoData.dengPaiList[num];
          let state = {
            type: "单手拿物品",
            modelPath: modelPath,
            boneName: "CC_Base_L_ElbowPart2", // 灯牌 参考骨骼
            animName: animName,
            modelList: _Global.GetTexiaoData.dengPaiList,
          }
          _YJPlayer.DyncPlayerState(state);
        }

        _YJPlayer.ChangeSkinCompleted();

      }, 2000);

    }


    function RandomGeneratePlayer(i) {

      _Global.AddLog("添加假人数量 " + i);

      let _YJPlayer = new YJPlayer(_this, modelParent, true, "nickName", null, (scope) => {

        // _YJPlayer.ChangeSkinCompleted();
        // indexVue.UpdateSkin(scope, "YJtest");
        // _YJPlayer.ChangeAnim("walk");
        // console.error(" 角色镜像加载完成 ");
        // _YJPlayer.SetPlayerPos(state.pos, state.quat);

      });

      // _YJPlayer.setPlayerDefaultPos(_this._YJSceneManager.getPlayerDefaultPos());
      let q = (Math.random() * 20);
      let p = (Math.random() * 20);

      _YJPlayer.setPlayerDefaultPos({
        pos: new THREE.Vector3(224 - q, -4.4, -p),
        rotaY: 0
      });
      _YJPlayer.CreateNameTrans("nickName");

      // let skinName = "litleUnityChain2";
      let skinName = "YJtest";
      _YJPlayer.LoadPlayer(
        skinName
      );
      _YJPlayer.NeedChangeSkin();

      indexVue.UpdateSkin(_YJPlayer, skinName,
        generateRandomInt(0, 1) + "_"
        + generateRandomInt(0, 19) + "_"
        + generateRandomInt(0, 18) + "_"
        + generateRandomInt(0, 17) + "_"
        + generateRandomInt(0, 23) + "_"
        // + generateRandomInt(0, 6) + "_"
      );
      // indexVue.UpdateSkin(_YJPlayer, skinName);
      // indexVue.UpdateSkin(_YJPlayer, skinName, generateRandomInt(0, 2) + "_" + generateRandomInt(0, 2) + "_");

      setTimeout(() => {
        _YJPlayer.ChangeAnim(animList[generateRandomInt(0, animList.length - 1)]);
      }, 2000);

    }


    let animList = ["dacall", "dengpai", "listen", "huanhu", "happy",
      "walk", "yeah", "idle", "ygb"];

    // let animList = ["idle", "walk", "jump"];

    function generateRandomInt(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }

    this.ClearMovieVideo = function () {
      indexVue.videoList = [];
    }

    let sceneData = [];
    this.CallRequestSceneData = function () {
      RequestSceneData();
    }



    async function RequestSceneData() {
      indexVue.videoList = [];
      InitEffect(_Global.GetEffectInfo());
      InitActPos(_Global.GetActPosInfo());

      return;

      let data = {
        "ActID": indexVue.arcId,
      }

      GetSceneData(data).then((res) => {
        if (res.status == 200) {
          if (res.data.code == 1) {
            let data = JSON.parse(res.data.data);
            InitEffect(data.ActInfo);

          }
        }
      });
      return;



      // const res = await _this.$axios.post("http://43.138.163.92:9090/world/activity/get",
      //   JSON.stringify(data), config
      // );


      // const res = await _this.$axios.post("/worldActivity/world/activity/get",
      //   JSON.stringify(data), config
      // );
    }
    function InitEffect(ActEffectList) {
      // console.log("获取特效初始状态 ",ActEffectList);
      for (let i = 0; i < ActEffectList.length; i++) {
        const item = ActEffectList[i];
        let EffectType = item.EffectType;
        //UNKNOWN = 0;
        // BALLOON_RAIN = 1; // 气球雨
        // HAND_CLAP = 2; // 全体鼓掌
        // LIGHT_STICK = 3; // 荧光棒
        // SIT_DOWN = 4; // 就座
        let EffectStatus = item.EffectStatus;
        // UNKNOWN = 0;
        // PAUSE = 1; // 暂停（解除）
        // START = 2; // 开始

        // let RenderData = item.RenderData;

        if (EffectType == 1) {
          if (item.ID == 1) {
            _Global.BalloonRain(EffectStatus == 2, 1);
            continue;
          }
          if (item.ID == 2) {
            _Global.BalloonRain(EffectStatus == 2, 2);
            continue;
          }
        }


        if (EffectStatus == 2) {

          if (EffectType == 2) {
            _Global.AllHandClap(EffectStatus == 2);
            continue;
          }
          if (EffectType == 3) {
            _Global.AllPickLightStick(EffectStatus == 2);
            continue;
          }
          if (EffectType == 4) {

            console.error(" ====== IN 落座 _Global.sceneName = ", _Global.sceneName, indexVue.$refs.YJDync.connected);
            if (_Global.sceneName == "MeetingScene") {
              if (EffectStatus == 2) {
                if (indexVue.$refs.YJDync.connected) {
                  _Global.AllSitting(EffectStatus == 2);
                } else {
                  localStorage.setItem("needSitting", "11");
                }
              }
            } else {
              _Global.AllSitting(EffectStatus == 2);
            }
            continue;
          }
          if (EffectType == 5) {
            _Global.PlayFireWorks(EffectStatus == 2);
          }

        }

      }

    }
    function InitActPos(ActPosList) {

      if (_Global.sceneName == "Scene2") {

        if (ActPosList != undefined) {
          for (let i = 0; i < ActPosList.length; i++) {
            const item = ActPosList[i];
            for (let ii = 0; ii < sceneData.length; ii++) {
              const item2 = sceneData[ii];
              if (item.PosType == item2.PosType) {
                item2.ContentType = item.ContentType;
                item2.PosContent = item.PosContent;
                item2.PosStatus = item.PosStatus;
                continue;
              }
            }
          }
        }
      }

      if (_Global.sceneName == "MeetingScene") {
        if (ActPosList != undefined) {
          for (let i = 0; i < ActPosList.length; i++) {
            const item = ActPosList[i];
            for (let ii = 0; ii < sceneData.length; ii++) {
              const item2 = sceneData[ii];
              if (item.PosType == item2.PosType) {
                item2.ContentType = item.ContentType;
                item2.PosContent = item.PosContent;
                item2.PosStatus = item.PosStatus;
                continue;
              }
            }
          }
        }
      }

      if (_Global.sceneName == "MusicScene") {
        if (ActPosList != undefined) {
          for (let i = 0; i < ActPosList.length; i++) {
            const item = ActPosList[i];
            for (let ii = 0; ii < sceneData.length; ii++) {
              const item2 = sceneData[ii];
              if (item.PosType == item2.PosType) {
                item2.ContentType = item.ContentType;
                item2.PosContent = item.PosContent;
                item2.PosStatus = item.PosStatus;
                continue;
              }
            }
          }
        }
      }

      console.log(" 获取场景配置 ", sceneData);

      for (let ii = 0; ii < sceneData.length; ii++) {
        CreateImgVideoBySceneData(sceneData[ii]);
      }
      return;
    }



    function InitEffectOld(data) {
      let ActEffectList = data.ActEffectList;
      for (let i = 0; i < ActEffectList.length; i++) {
        const item = ActEffectList[i];
        let EffectType = item.EffectType;
        //UNKNOWN = 0;
        // BALLOON_RAIN = 1; // 气球雨
        // HAND_CLAP = 2; // 全体鼓掌
        // LIGHT_STICK = 3; // 荧光棒
        // SIT_DOWN = 4; // 就座
        let EffectStatus = item.EffectStatus;
        // UNKNOWN = 0;
        // PAUSE = 1; // 暂停（解除）
        // START = 2; // 开始

        // let RenderData = item.RenderData;

        if (EffectType == 1) {
          //(b,colorGroup) b打开或关闭气球雨、 colorGroup 颜色组  1黄紫  2粉紫
          _Global.BalloonRain(EffectStatus == 2, 1);
          // _Global.BalloonRain(EffectStatus == 2, RenderData == "1" ? 1 : 2);
          continue;
        }
        if (EffectType == 6) {
          //(b,colorGroup) b打开或关闭气球雨、 colorGroup 颜色组  1黄紫  2粉紫
          _Global.BalloonRain(EffectStatus == 2, 2);
          continue;
        }

        if (EffectStatus == 2) {

          if (EffectType == 2) {
            _Global.AllHandClap(EffectStatus == 2);
            continue;
          }
          if (EffectType == 3) {
            _Global.AllPickLightStick(EffectStatus == 2);
            continue;
          }
          if (EffectType == 4) {
            _Global.AllSitting(EffectStatus == 2);
            continue;
          }
          if (EffectType == 5) {
            _Global.PlayFireWorks(EffectStatus == 2);
          }

        }

      }

      let ActPosList = data.ActPosList;

      if (_Global.sceneName == "Scene2") {

        if (ActPosList != undefined) {
          for (let i = 0; i < ActPosList.length; i++) {
            const item = ActPosList[i];
            for (let ii = 0; ii < sceneData.length; ii++) {
              const item2 = sceneData[ii];
              if (item.PosType == item2.PosType) {
                item2.ContentType = item.ContentType;
                item2.PosContent = item.PosContent;
                item2.PosStatus = item.PosStatus;
                continue;
              }
            }
          }
        }
      }

      if (_Global.sceneName == "MeetingScene") {
        if (ActPosList != undefined) {
          for (let i = 0; i < ActPosList.length; i++) {
            const item = ActPosList[i];
            for (let ii = 0; ii < sceneData.length; ii++) {
              const item2 = sceneData[ii];
              if (item.PosType == item2.PosType) {
                item2.ContentType = item.ContentType;
                item2.PosContent = item.PosContent;
                item2.PosStatus = item.PosStatus;
                continue;
              }
            }
          }
        }
      }

      if (_Global.sceneName == "MusicScene") {
        if (ActPosList != undefined) {
          for (let i = 0; i < ActPosList.length; i++) {
            const item = ActPosList[i];
            for (let ii = 0; ii < sceneData.length; ii++) {
              const item2 = sceneData[ii];
              if (item.PosType == item2.PosType) {
                item2.ContentType = item.ContentType;
                item2.PosContent = item.PosContent;
                item2.PosStatus = item.PosStatus;
                continue;
              }
            }
          }
        }
      }

      console.log(" 获取场景配置 ", data);
      console.log(" 获取场景配置 ", sceneData);

      for (let ii = 0; ii < sceneData.length; ii++) {
        CreateImgVideoBySceneData(sceneData[ii]);
      }
      return;
    }




    this.GetVideoPathByPosType = (PosType) => {
      for (let ii = 0; ii < sceneData.length; ii++) {
        if (sceneData[ii].PosType == PosType) {
          return sceneData[ii].PosContent;
        }
      }
      return null;
    }

    function CreateImgVideoBySceneData(sceneData) {
      if (sceneData.PosContent == undefined || sceneData.PosContent == null) { return; }
      console.log("_Global.platform", sceneData, _Global.platform);

      if (sceneData.PosContent.includes(".mp4")) {
        sceneData.ContentType = 2;
      }
      if (sceneData.PosContent.includes(".m3u8")) {
        sceneData.ContentType = 3;
      }
      // return;
      if (1 == 1)
      // if (sceneData.PosStatus == 1) 
      {
        // 图片
        if (sceneData.ContentType == 1) {
          let map = _this._YJSceneManager.checkLoadTexture(sceneData.PosContent);
          let mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: map,
          });
          map.flipY = false;
          sceneData.model.material = mat;
          return;
        }


        // 视频
        if (sceneData.ContentType == 2) {
          let videoId = "dPlayerVideoMain" + sceneData.PosType;
          indexVue.videoList.push({ videoId: videoId });

          console.error("播放视频", sceneData.PosContent);
          indexVue.$nextTick(() => {
            indexVue.$refs['playVideo' + videoId].PlayVideoStream(sceneData.PosContent);
            LoadStreamVideo(sceneData.model, videoId);
          });
        }

        // m3u8直播流
        if (sceneData.ContentType == 3) {


          if (_Global.platform == "Android") {
            // 安卓播放视频流 HLS
            indexVue.$refs.playVideoM3u8.PlayVideoStream(sceneData.PosContent);
            LoadStreamVideo(sceneData.model, "dPlayerVideoMainHLS");
          } else {
            // ios播放视频流
            indexVue.$refs.playVideoM3u8.PlayVideoStream(sceneData.PosContent);
            LoadStreamVideo(sceneData.model, "dPlayerVideoMain_IOS");
          }


          // setTimeout(() => {
          //   indexVue.$refs['playVideo' + videoId].SetVideoMuted(false);
          // }, 10000);
        }
      }
    }

    function CreateImgVideoBySceneDataTest(sceneData) {


      return;

      if (sceneData.PosContent.includes(".mp4")) {
        sceneData.ContentType = 2;
      }
      if (sceneData.PosContent.includes(".m3u8")) {
        sceneData.ContentType = 3;
      }
      // return;
      if (sceneData.PosStatus == 1) {
        // 图片
        if (sceneData.ContentType == 1) {
          let map = _this._YJSceneManager.checkLoadTexture(sceneData.PosContent);
          // map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
          // sceneData.model.material.needsUpdate = true;
          // sceneData.model.material.map = map;

          let mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: map,
          });
          sceneData.model.material = mat;
          return;
        }


        // 视频
        if (sceneData.ContentType == 2) {

          let path = "https://z-vup.oss-cn-hangzhou.aliyuncs.com/public/h5_newworld/mp4/mp4";
          let path2 = sceneData.PosContent.replace(path, "/videoPath");

          let videoId = "dPlayerVideoMain" + sceneData.PosType;
          new YJVideo(_this, videoId, sceneData.model, "普通视频", path2);
          console.error("播放视频", sceneData.PosContent);

        }
        // 直播流
        if (sceneData.ContentType == 3) {

          console.error("播放直播流", sceneData.PosContent);

          indexVue.$refs.playVideo.PlayVideoStream(sceneData.PosContent);
          LoadStreamVideo(sceneData.model, "dPlayerVideoMain");

        }
      }
    }
    // 接收活动位实时更新
    this.ChangeAcivityPosition = (ActivityPosition) => {
      for (let ii = 0; ii < sceneData.length; ii++) {
        if (sceneData[ii].PosType == ActivityPosition.PosType) {
          ChangeAcivityPositionFn(sceneData[ii], ActivityPosition);
          return;
        }
      }
    }

    function ChangeAcivityPositionFn(sceneData, ActivityPosition) {
      sceneData.PosContent = ActivityPosition.PosContent;


      if (sceneData.model.material != undefined) {
        if (sceneData.model.material.map != undefined) {
          sceneData.model.material.map.dispose();
          sceneData.model.material.map = undefined;
        }
      }



      let isMuted = true;
      if (sceneData.PosType == 9 || sceneData.PosType == 12) {
        isMuted = false;
      }

      setTimeout(() => {

        if (1 == 1)
        // if (ActivityPosition.PosStatus == 1) 
        {

          // 
          if (1 == 1 && (sceneData.ContentType == 2 || sceneData.ContentType == 3))
          // if (sceneData.PosStatus == 1 && (sceneData.ContentType == 2 || sceneData.ContentType == 3)) 
          {
            if (ActivityPosition.ContentType == 1) {
              //  视频变图片 移除视频

            }
            // 修改现有 视频 
            if (ActivityPosition.ContentType == 2) {
              let videoId = "dPlayerVideoMain" + sceneData.PosType;

              let has = false;
              for (let i = 0; i < indexVue.videoList.length; i++) {
                const element = indexVue.videoList[i];
                if (element.videoId == videoId) {
                  has = true;
                }
              }
              if (has) {
              } else {
                indexVue.videoList.push({ videoId: videoId });
              }
              setTimeout(() => {
                indexVue.$refs['playVideo' + videoId].PlayVideoStream(sceneData.PosContent);
                LoadStreamVideo(sceneData.model, videoId);
              }, 1000);

              indexVue.$nextTick(() => {
              });

            }


            // 修改现有 直播流
            if (ActivityPosition.ContentType == 3) {

              if (_Global.platform == "Android") {
                // 安卓播放视频流 HLS
                indexVue.$refs.playVideoM3u8.PlayVideoStream(sceneData.PosContent);
                LoadStreamVideo(sceneData.model, "dPlayerVideoMainHLS");
              } else {
                // ios播放视频流
                indexVue.$refs.playVideoM3u8.PlayVideoStream(sceneData.PosContent);
                LoadStreamVideo(sceneData.model, "dPlayerVideoMain_IOS");
              }

            }


          } else {
            // 图片转视频 新增
            // 视频
            if (ActivityPosition.ContentType == 2) {
              let videoId = "dPlayerVideoMain" + sceneData.PosType;

              let has = false;
              for (let i = 0; i < indexVue.videoList.length; i++) {
                const element = indexVue.videoList[i];
                if (element.videoId == videoId) {
                  has = true;
                }
              }
              if (has) {
              } else {
                indexVue.videoList.push({ videoId: videoId });
              }
              console.error("播放视频", sceneData.PosContent);

              setTimeout(() => {
                indexVue.$refs['playVideo' + videoId].PlayVideoStream(sceneData.PosContent);
                LoadStreamVideo(sceneData.model, videoId);
              }, 1000);

              // indexVue.$nextTick(() => {
              //   indexVue.$refs['playVideo' + videoId].PlayVideoStream(sceneData.PosContent);
              //   LoadStreamVideo(sceneData.model, videoId);
              // });
            }

            // m3u8直播流
            if (ActivityPosition.ContentType == 3) {

              if (_Global.platform == "Android") {
                // 安卓播放视频流 HLS
                indexVue.$refs.playVideoM3u8.PlayVideoStream(sceneData.PosContent);
                LoadStreamVideo(sceneData.model, "dPlayerVideoMainHLS");
              } else {
                // ios播放视频流
                indexVue.$refs.playVideoM3u8.PlayVideoStream(sceneData.PosContent);
                LoadStreamVideo(sceneData.model, "dPlayerVideoMain_IOS");
              }

            }


          }


          // 图片
          if (ActivityPosition.ContentType == 1) {
            let map = _this._YJSceneManager.checkLoadTexture(sceneData.PosContent);
            let mat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              map: map,
            });
            map.flipY = false;
            sceneData.model.material = mat;
          }

          // 直播流
          if (sceneData.ContentType == 3) {

          }
        } else {

          // 下线，移除视频
          if (sceneData.ContentType == 2) {
            console.error("实时下线视频，位置 ", sceneData.PosType);
          }
          if (sceneData.ContentType == 3) {
            console.error("实时下线视频，位置 ", sceneData.PosType);
          }

          sceneData.model.material.color.setHex(0x000000);
        }

        sceneData.ContentType = ActivityPosition.ContentType;
        sceneData.PosStatus = ActivityPosition.PosStatus;
      }, 1000);

    }
    function ChangeAcivityPositionFnTest(sceneData, ActivityPosition) {
      sceneData.PosContent = ActivityPosition.PosContent;


      if (sceneData.model.material != undefined) {
        if (sceneData.model.material.map != undefined) {
          sceneData.model.material.map.dispose();
          sceneData.model.material.map = undefined;
        }
      }



      let isMuted = true;
      if (sceneData.PosType == 9 || sceneData.PosType == 12) {
        isMuted = false;
      }

      setTimeout(() => {

        if (ActivityPosition.PosStatus == 1) {

          // 
          if (sceneData.PosStatus == 1 && (sceneData.ContentType == 2 || sceneData.ContentType == 3)) {
            if (ActivityPosition.ContentType == 1) {
              //  视频变图片 移除视频

            }
            // 修改现有视频路径
            if (ActivityPosition.ContentType == 2) {

              let videoId = "dPlayerVideoMain" + sceneData.PosType;
              for (let i = 0; i < _this.videoList.length; i++) {
                const element = _this.videoList[i];
                if (element.id == videoId) {
                  const video = document.getElementById(element.id);
                  video.setAttribute("crossorigin", "anonymous");
                  video.play();
                }
              }

            }
            // 修改直播流路径
            if (ActivityPosition.ContentType == 3) {
              indexVue.$refs.playVideo.PlayVideoStream(sceneData.PosContent);
              LoadStreamVideo(sceneData.model, "dPlayerVideoMain");
            }

          } else {
            // 图片转视频
            // 添加视频id 
            if (ActivityPosition.ContentType == 2) {
              let path = "https://z-vup.oss-cn-hangzhou.aliyuncs.com/public/h5_newworld/mp4/mp4";
              let path2 = sceneData.PosContent.replace(path, "/videoPath");
              let videoId = "dPlayerVideoMain" + sceneData.PosType;
              new YJVideo(_this, videoId, sceneData.model, "普通视频", path2);
              console.error("播放视频", sceneData.PosContent);
            }
            if (ActivityPosition.ContentType == 3) {
              indexVue.$refs.playVideo.PlayVideoStream(sceneData.PosContent);
              LoadStreamVideo(sceneData.model, "dPlayerVideoMain");
            }

          }


          // 图片
          if (ActivityPosition.ContentType == 1) {
            let map = _this._YJSceneManager.checkLoadTexture(sceneData.PosContent);
            let mat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              map: map,
            });
            map.flipY = false;
            sceneData.model.material = mat;
          }

          // 直播流
          if (sceneData.ContentType == 3) {

          }
        } else {

          // 下线，移除视频
          if (sceneData.ContentType == 2) {
            console.error("实时下线视频，位置 ", sceneData.PosType);
          }
          if (sceneData.ContentType == 3) {
            console.error("实时下线视频，位置 ", sceneData.PosType);
          }

          sceneData.model.material.color.setHex(0x000000);
        }

        sceneData.ContentType = ActivityPosition.ContentType;
        sceneData.PosStatus = ActivityPosition.PosStatus;
      }, 1000);

    }


    function LoadStreamVideo(model, videoId) {
      if (videoId == false || videoId == null) {
        return;
      }
      const _video = document.getElementById(videoId);
      _video.muted = true;
      _video.loop = true;
      // _video.setAttribute("crossorigin", "anonymous");

      _video.oncanplay = function () {
        const texture = new THREE.VideoTexture(_video);
        console.log("视频准备就绪", texture);
        // texture.flipY = false;
        if (model.material.map) {
          model.material.map.dispose();
        }
        model.material.dispose();
        let mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: texture
        });
        model.material = mat;
      };

      return;
      const texture = new THREE.VideoTexture(_video);

      // console.log(texture.image); 
      model.material.dispose();
      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture
      });
      model.material = mat;
    }




    // 根据后台加载图片或视频或直播流，显示在模型上
    function CreateImgVideo(sceneData) {

      indexVue.$refs.playVideo.PlayVideoStream("http://play-qukan.cztv.com/live/1681283679901088.m3u8");
      // let _YJVideo = new YJVideo(_this,"zhanban_pingmu" + sceneData.PosType, sceneData.model, "普通视频", "http://o.cztvcloud.com/cms_upload/cms_1681112337_bB33JTwhhp.mp4");
      let _YJVideo = new YJVideo(_this, "zhanban_pingmu" + sceneData.PosType, sceneData.model, "普通视频", "sceneData" + "/cms_upload/cms_1681112337_bB33JTwhhp.mp4");
      setTimeout(() => {
        _YJVideo.SetVideoLoop(true);
      }, 3000);
      // let _YJVideo = new YJVideo(_this, "zhanban_pingmu" + sceneData.PosType, sceneData.model, "普通视频", "http://snvtkd2005.com/vue/projects/meeting/public/meeting/videos/movieSD.mp4");
      // let _YJVideo = new YJVideo(_this, "zhanban_pingmu" + sceneData.PosType, sceneData.model, "普通视频", _this.GetPublicUrl() + "videos/movieSD.mp4");

      // _YJVideo.play
    }


    //#region  气球雨
    let instancedManager = null;
    let instancedManager2 = null;
    let instancedManager3 = null;
    let instancedManager4 = null;
    this.BalloonRain = function (b, colorGroup) {
      // return;
      if (b) {
        if (colorGroup == 1) {
          if (instancedManager == null) {
            //texiaoData , "yellow"
            instancedManager = new InstancedManager(_this, _Global.GetTexiaoData.balloonList[1]);
            instancedManager.createMesh();
          } else {
            instancedManager.restart();
          }
          if (instancedManager3 == null) {
            //texiaoData , "purple"
            instancedManager3 = new InstancedManager(_this, _Global.GetTexiaoData.balloonList[0]);
            instancedManager3.createMesh();
          } else {
            instancedManager3.restart();
          }

        }
        if (colorGroup == 2) {
          if (instancedManager2 == null) {
            //texiaoData , "pink"
            instancedManager2 = new InstancedManager(_this, _Global.GetTexiaoData.balloonList[2]);
            instancedManager2.createMesh();
          } else {
            instancedManager2.restart();
          }

          if (instancedManager4 == null) {
            //texiaoData , "purple"
            instancedManager4 = new InstancedManager(_this, _Global.GetTexiaoData.balloonList[0]);
            instancedManager4.createMesh();
          } else {
            instancedManager4.restart();
          }
        }
      } else {
        if (colorGroup == 1) {
          if (instancedManager != null) {
            instancedManager.stop();
          }
          if (instancedManager3 != null) {
            instancedManager3.stop();
          }
        }
        if (colorGroup == 2) {

          if (instancedManager2 != null) {
            instancedManager2.stop();
          }
          if (instancedManager4 != null) {
            instancedManager4.stop();
          }
        }
      }


    }
    //#endregion

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

    this._update = function () {

      //判断视频黑屏
      TWEEN.update();
      for (let i = 0; i < allDyncModel.length; i++) {
        allDyncModel[i].modelJS._update();
      }
    }


    InitFn();
  }
}

export { SceneManager };