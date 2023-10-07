



import * as THREE from "three";

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
import { YJCurse } from "/@/threeJS/YJCurse.js";
import { YJPlatform } from "/@/threeJS/YJPlatform.js";


import { YJ2dScene } from "/@/threeJS/YJ2dScene.js";
import { YJ3dPhotoPlane } from "/@/threeJS/YJ3dPhotoPlane.js";


import { SceneManager_MaterialSetting } from "./SceneManager_MaterialSetting.js";



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


      // new SceneManager_MaterialSetting(
      //   scene,
      //   renderer,
      //   camera,
      //   _this
      // );

      // 移动平台
      // let _YJPlatform = new YJPlatform(_this, scene, new THREE.Vector3(-15, 4, 25), new THREE.Vector3(-15, 4 + 1, 25)
      //   , "platform001", "offsetTime");

      // // 同步上面的移动平台
      // _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("platform001", "offsetTime", _YJPlatform);

      // 动画模型同步
      // _this.$parent.$parent.$refs.YJDync._YJDyncManager.GetDyncSceneManager().addDyncSceneModel("anim001", "offsetTime", _this._YJSceneManager.GetAnimModel("anim001"));



      // 点击物体，坐在物体上
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





      // let _YJ2dScene = new YJ2dScene(_this,scene,camera);
      // _this._YJSceneManager.AddNeedUpdateJS(_YJ2dScene);

      if (callback) {
        callback();
      }
      render();

      window.addEventListener("touchstart", (e) => {
        if (inScene2 && playMovieTimes < 3) {
          LoadScreenStreamVideoFn("dPlayerVideoMain");
          playMovieTimes++;
        }
      });
    }
    let inScene2 = false;
    let playMovieTimes = 0;
    this.ChangeScene = function (e) {
      if (e.includes("Scene2")) {
        inScene2 = true;
        playMovieTimes = 0;

        _this.$nextTick(() => {

          scene.traverse((obj) => {
            if (obj.isMesh) {
              if (obj.name.indexOf("videoscreen") > -1) {
                console.log("找到视频屏幕", obj.name);
                videoPlane = obj;
                LoadScreenStreamVideoFn("dPlayerVideoMain");
                playMovieTimes++;
              }
            }
          });
        });

      } else
      // if (e.includes("Scene1"))
      {
        inScene2 = false;
        // const hdrEquirect = new RGBELoader()
        //   .setPath(_this.GetPublicUrl())
        //   .load('bgsky.hdr', function () {
        //     hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        //     render();
        //   });

        // let Physicalmaterial = new THREE.MeshPhysicalMaterial({
        //   envMap: hdrEquirect,
        // });


        return;
        scene.traverse((obj) => {
          if (obj.isMesh) {
            // 门口玻璃
            if (obj.name.includes("node__69666")) {
              console.log(obj.material);

              obj.material.metalness = 0.73;
              obj.material.roughness = 0.4;
              const hdrEquirect = new RGBELoader()
              .setPath(_this.GetPublicUrl())
              .load('bgsky.hdr', function () {
                hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
                // render();
                obj.material.envMap = hdrEquirect;

              });
            }

          }
        });
      }
      console.error("======= 正在对 ", e, ' 进行场景设置=======');

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

    }
    function LoadScreenStreamVideoFn(video) {
      if (video == false || video == null) {
        return;
      }

      const _video = document.getElementById(video);
      if (_video == null || _video == undefined) { return; }
      _video.setAttribute('crossorigin', 'anonymous');
      // console.log(" 获取视频 " , _video);
      _video.play();
      const texture = new THREE.VideoTexture(_video);
      // videoPlane.material.dispose();

      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture
      });
      videoPlane.material = mat;

    }
    this.StopScreenStreamVideo = function () {
      videoPlane.material.dispose();
      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      videoPlane.material = mat;
    }

    function CreateScreenStreamPlane() {
      let size = 2;
      let geo = new THREE.BoxGeometry(0.01, size, size * 2);
      let mat = new THREE.MeshBasicMaterial({
        color: 0x666666,
      });
      let cube = new THREE.Mesh(geo, mat);
      modelParent.add(cube);
      cube.tag = "screenPlane";
      // cube.position.set(-11, 15, -27);
      cube.position.set(-13, 6, 30);
      cube.rotation.set(0, -Math.PI / 4 - 0.3, 0);
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
            if (hitObj.name.includes("collider")) {

            } else {
              // all += hitObj.name + "、";
              all = hitObj.name + "、";
              console.log(" 鼠标位置的模型 ", all);
              return;
            }
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
    }



    InitFn();
  }
}

export { SceneManager };