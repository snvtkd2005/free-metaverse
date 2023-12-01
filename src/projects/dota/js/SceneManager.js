



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

 
import { YJProjector } from "/@/threeJS/components/YJProjector.js";


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
    let _YJProjector = null;
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


      _YJGlobal._SceneManager = scope;

      if (callback) {
        callback();
      }
      _this._YJSceneManager.AddNeedUpdateJS(scope);

      _YJProjector = new YJProjector(_this,scene,modelParent);
      _this._YJSceneManager.AddNeedUpdateJS(_YJProjector);

    }

    this.ClickModel = (hitObject) => {


    }

    this.SetTriggerOverlap = (b, id, owner) => {
      console.log(b, id, owner);

    }


    let sceneName = "";

    let allDyncModel = [];


    this.ChangeScene = function (e) {
      // renderer.toneMapping = THREE.NoToneMapping;
      renderer.toneMapping = THREE.LinearToneMapping;
      let exposure = 0;
      let dd = setInterval(() => {
        exposure += 0.02;
        renderer.toneMappingExposure = exposure;
        if (exposure >= 1.0) {
          clearInterval(dd);
        }
      }, 20);

      console.log("renderer.toneMapping ", renderer.toneMapping, renderer.toneMappingExposure);
      scene.traverse((obj) => {
        if (obj.isMesh) {
          // obj.visible = false; 
          // let mat = new MeshBasicMaterial({
          //   map: obj.material.map,
          // });
          // obj.material.dispose();
          // obj.castShadow = false;
          // obj.receiveShadow = false;
          // obj.material = mat; 

        }
      });
      return;


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
 
    this._update = function () {
      // console.log(" update scene manager ");
      TWEEN.update(); 
    }


    InitFn();
  }
}

export { SceneManager };