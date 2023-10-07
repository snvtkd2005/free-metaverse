



import * as THREE from "three";

import { YJLoadModel } from "../YJLoadModel.js";

import { YJMapManager } from "../YJMapManager.js";

import { YJAmmo } from "../YJAmmo.js";

import { GetCurrentTime } from "/@/utils/api.js";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { nextTick } from "vue";
import { YJNPC } from "../YJNPC.js";
import { YJCurve } from "../YJCurve.js";
import { YJMinMap } from "../YJMinMap.js";
import { YJLoadModelManager } from "../YJLoadModelManager.js";

// 整体场景辉光 管理器
import { YJBloomManager } from "../YJBloomManager.js";
// 可设置单个模型辉光 管理器
import { YJBloomManager2 } from "../YJBloomManager2.js";
import { YJChangeManager } from "../YJChangeManager.js";
import { YJSandboxManager } from "../YJSandboxManager.js";
import { YJTransformManager } from "../YJTransformManager.js";
import { YJReflect } from "../YJReflect.js";
import { GetDateH } from "/@/utils/utils.js";
import { YJKeyboard } from "../YJKeyboard.js";

import { YJVideo } from "../YJVideo";
import { YJSqeImage } from "../YJSqeImage.js";
import { YJUVanim } from "../YJUVanim.js";

import { YJPathfinding } from "../pathfinding/YJPathfinding.js";
import { Mesh, TextureLoader } from "three";
import { YJReflectMirror } from "../YJReflectMirror.js";
import { YJWater } from "../YJWater.js";
import { YJReflectPostprocessing } from "../YJReflectPostprocessing.js";
import { YJCurse } from "../YJCurse.js";
import { YJPlatform } from "../YJPlatform.js";


import { YJ2dScene } from "../YJ2dScene.js";
import { YJ3dPhotoPlane } from "../YJ3dPhotoPlane.js";



class SceneManager {
  constructor(scene, renderer, camera, _this, callback) {
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

    let modelParent = null;
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

      // 移动平台
      let _YJPlatform = new YJPlatform(_this, scene, new THREE.Vector3(-15, 4, 25), new THREE.Vector3(-15, 4 + 1, 25)
        , "platform001", "offsetTime");
      _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("platform001", "offsetTime", _YJPlatform);

      // 动画模型同步
      // _this.$parent.$parent.$refs.YJDync._YJDyncManager.GetDyncSceneManager().addDyncSceneModel("anim001", "offsetTime", _this._YJSceneManager.GetAnimModel("anim001"));

      
      let size = 0.7;
      let geo = new THREE.BoxGeometry(size, size, size);
      let mat = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.1,
        metalness: 0,
      });
      let cube = new THREE.Mesh(geo, mat);
      scene.add(cube);
      cube.tag = "chair";
      cube.position.set(-15, 4, 27);
      _this._YJSceneManager.CreateTriangeMeshCollider(cube);

      // cube.add(new THREE.AxesHelper(1));

      videoPlane = CreateScreenStreamPlane();

 
      // let _YJ2dScene = new YJ2dScene(_this,scene,camera);
      // _this._YJSceneManager.AddNeedUpdateJS(_YJ2dScene);
      
      if (callback) {
        callback();
      }
      render();

    }
    this.Photo = function(callback){
      _YJ3dPhotoPlane = new YJ3dPhotoPlane(_this,scene,renderer,camera);
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
    this.StopScreenStreamVideo = function () {
      videoPlane.material.dispose();
      let mat = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      videoPlane.material = mat; 
    }
    function CreateScreenStreamPlane() {
      let size = 14;
      let geo = new THREE.BoxGeometry(0.3, size, size*2);
      let mat = new THREE.MeshBasicMaterial({
        color: 0x666666,
      });
      let cube = new THREE.Mesh(geo, mat);
      scene.add(cube);
      cube.tag = "screenPlane";
      cube.position.set(-11, 15, -27);
      cube.rotation.set(0,-Math.PI/4,0);
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

    //实时刷新
    function render() {
      requestAnimationFrame(render);
    }



    InitFn();
  }
}

export { SceneManager };