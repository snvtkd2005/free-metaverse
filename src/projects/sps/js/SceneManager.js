



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
import { nextTick } from "vue";
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
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";

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


class SceneManager {
  constructor(scene, renderer, camera, _this, modelParent, callback) {
    let scope = this;
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

    this.Init = function () {

      InitFn();
    }


    function InitFn() {
      // AddTestMat();
      // window.addEventListener('mousemove', onPointerDown);



      // let _YJ2dScene = new YJ2dScene(_this,scene,camera);
      // _this._YJSceneManager.AddNeedUpdateJS(_YJ2dScene);

      if (callback) {
        callback();
      }
      render();

    }

    let sceneName = "";

    let animAchorPoint = null;
    this.ChangeScene = function (e) {

      if (e.includes("Scene2")) {
        sceneName = "Scene2";
        videoPlane = CreateScreenStreamPlane(new THREE.Vector3(0.01, 1.5, 3),
          new THREE.Vector3(0, 1.55, -1.28),
          new THREE.Vector3(0, -Math.PI / 2, 0),
          new THREE.Vector3(1, 1, 1), _this.GetPublicUrl() + "screenPic.jpg");

      } else {
        sceneName = "Scene1";

        // 移动平台
        // let _YJPlatform = new YJPlatform(_this, scene, new THREE.Vector3(-15, 4, 25), new THREE.Vector3(-15, 4 + 1, 25)
        //   , "platform001", "offsetTime");
        // _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("platform001", "offsetTime", _YJPlatform);

        // 动画模型同步
        // if(_this.$parent.isMobile){
        //   _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("sps_m", "offsetTime", _this._YJSceneManager.GetAnimModel("sps_m"));
        // }else{
        // }
        _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("sps", "offsetTime", _this._YJSceneManager.GetAnimModel("sps"));

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


        // 播放视频的屏幕
        // let vp = CreateScreenStreamPlane(new THREE.Vector3(0.01, 2, 4),
        // new THREE.Vector3(-13, 6, 30),
        // new THREE.Vector3(0, -Math.PI / 4- 0.3, 0),
        // new THREE.Vector3(1, 1, 1));
        // LoadScreenStreamVideoFn(vp,"dPlayerVideoMain");

        scene.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.name.includes("polySurface11116")) {
              animAchorPoint = obj;
              console.log("=====找到汽车平面===");

              // animAchorPointGroup.add(new THREE.AxesHelper(5));
              animAchorPointGroup.position.copy(_this._YJSceneManager.GetWorldPosition(animAchorPoint));
              scene.add(animAchorPointGroup);
              animAchorPoint.attach(animAchorPointGroup);
              // setTimeout(() => {
              //   _this.YJController.SetCameraParent(animAchorPoint, new THREE.Vector3(2, 5, 2));
              // }, 2000);
              return;
              setTimeout(() => {
                // console.log(animAchorPoint);

                // setTimeout(() => {

                //   _this._YJSceneManager.GetAmmo().SetMyCtrlRbParent(scene, false);
                //   _this._YJSceneManager.GetAmmo().SetPlayerPos(new THREE.Vector3(0, 1, 0));
                //   _this._YJSceneManager.GetAmmo().SetPlayerRota(new THREE.Vector3(0, 0, 0));

                // }, 2000);

              }, 2000);
            }
          }
        });


        carAnimModel = _this._YJSceneManager.GetAnimModel("sps");
        // createReflectorMesh();

      }

      // console.error("== 单独房间设置 ==", e);

    }
    let animAchorPointGroup = new THREE.Group();

    function SetInCar() {
      _this._YJSceneManager.GetAmmo().SetMyCtrlRbParent(animAchorPointGroup, true);
      _this._YJSceneManager.GetAmmo().SetPlayerPos(new THREE.Vector3(0, 1, 0));
      _this._YJSceneManager.GetAmmo().SetPlayerRota(new THREE.Vector3(0, Math.PI / 2 + Math.PI / 3.6, 0));

      _this.YJController.SetCameraWheelPos(-13);
      _this.YJController.SetCanMouseWheel(false);
      _this.YJController.SetPlayerDisplay(false);
      _this.YJController.SetDyncDisplay(false);
      _this.YJController.SetCamTargetRotaZ(-0.0);
      _this.YJController.CancelMoving();
      _this.YJController.SetCameraBaseParent(null);

      if (inWaitCar) {
        inWaitCar = false;
        inCar = true;
      }
      if (inWaitCar2) {
        inWaitCar2 = false;
        inCar2 = true;
      }
    }

    function SetOutCar() {
      let posid = "";
      if (inCar) {
        inCar = false;
        posid = "playerPos_002";
      }
      if (inCar2) {
        inCar2 = false;
        posid = "playerPos_003";
      }

      _this._YJSceneManager.GetAmmo().SetMyCtrlRbParent(scene, false);
      _this._YJSceneManager.ChangeViewByIdDirect(posid);
      _this.YJController.SetPlayerDisplay(true);
      _this.YJController.SetDyncDisplay(true);
      _this.YJController.SetCanMouseWheel(true);
      _this.YJController.SetCameraWheelPos(-2);

    }



    let carAnimModel = null;
    let inWaitCar = false;
    let inCar = false;
    let inWaitCar2 = false;
    let inCar2 = false;
    this.SetTriggerOverlap = function (b, id, owner) {
      if (id == "triggerArea_upCar") {
        // inWaitCar = b;
      }
      if (id == "triggerArea_upCar2") {
        // inWaitCar2 = b;
      }
      if (b) {
        if (id.includes("jump")) {

          // let sp = id.split("_");
          // let jumpPos = "playerPos_"+sp[1];
          // _this._YJSceneManager.ChangeViewByIdDirect(jumpPos);


        }
      }
    }
    this.SetReadyCar = function (floor) {

      //转到拍车视角
      _this.YJController.SetCameraBaseParent(animAchorPointGroup, new THREE.Vector3(1, 1, 0));
      _this.YJController.SetCameraWheelPos(-5);
      _this.YJController.CancelMoving();
      if (floor == "FirstFloor") {
        inWaitCar2 = true;
      }
      if (floor == "SecondFloor") {
        inWaitCar = true;
      }
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
          if (hitObj.visible == false) { continue; }
          if (hitObj.isMesh) {
            all += hitObj.name + "、";
            console.log(" 鼠标位置的模型 ", hitObj);
            return;
            // all += hitObj.material.name +  "、";
          }
        }
        console.log(" 鼠标位置的模型 ", all);

      }

    }

    let carAnimModelTime = 0;
    // let waitcarTime = new THREE.Vector2(20, 21);
    let waitcarTime = new THREE.Vector2(16, 18);
    let waitcarTime2 = new THREE.Vector2(2, 3);
    //实时刷新
    function render() {
      requestAnimationFrame(render);
      TWEEN.update();
      if (animAchorPoint) {
        // console.log(_this._YJSceneManager.GetWorldPosition(animAchorPoint));

      }
      if (carAnimModel) {
        carAnimModelTime = carAnimModel.GetCurrentTime();
        if (inWaitCar && carAnimModelTime >= waitcarTime.x && carAnimModelTime <= waitcarTime.y) {
          SetInCar();
        }
        if (inWaitCar2 && carAnimModelTime >= waitcarTime2.x && carAnimModelTime <= waitcarTime2.y) {
          SetInCar();
        }
        if (inCar && carAnimModelTime >= waitcarTime2.x && carAnimModelTime <= waitcarTime2.y) {
          SetOutCar();
        }

        if (inCar2 && carAnimModelTime >= waitcarTime.x && carAnimModelTime <= waitcarTime.y) {
          SetOutCar();
        }

        // console.log(" 在场景管理器中获取动画时间 ", carAnimModelTime,inWaitCar,inWaitCar2);
      }
    }



    InitFn();
  }
}

export { SceneManager };