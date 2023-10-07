import * as THREE from "three";


import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

import TWEEN, { update } from '@tweenjs/tween.js';
import { BoxBufferGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";


import { YJLoadGLtfTest } from "./YJLoadGLtfTest.js";

import { YJLoadModel } from "./YJLoadModel.js";

import { YJMapManager } from "./YJMapManager.js";

import { YJAmmo } from "./YJAmmo.js";
import { YJAmmoKinematic } from "./YJAmmoKinematic.js";
import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJController } from "./YJController.js";
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJAnimMeshMerged } from "./YJAnimMeshMerged.js";

class YJ3dScene {
  constructor(container, _this) {
    let scope = this;
    let scene;
    let renderer;
    let camera;
    let verticalMirror;
 
    let _YJController = null;
    this.YJController = null;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();
    let _YJAmmo;
    let lookatList = [];

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let group;
    let width, height;
    let playerGroup;
    Init();
    function Init() {
      console.log("初始化小窗3d场景");
      scene = new THREE.Scene(); // 场景
      // let width = 300;
      // let height = 300;
      width = container.clientWidth;
      height = container.clientHeight;
      // let width = window.innerWidth;
      // let height = window.innerHeight;
      camera = new THREE.PerspectiveCamera(
        60,
        width / height,
        0.01,
        10000
      );
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true; // 开启阴影
      renderer.setPixelRatio(2); //推荐

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光 
      scene.add(ambient); //光源添加到场景中


      //雾效
      scene.background = new THREE.Color(0xccFFFF);
      scene.fog = new THREE.Fog(0x666666, 10, 500);


      // ground 开始--------------
      // var loaderTex_d = new THREE.TextureLoader();
      // var texture = loaderTex_d.load(
      //   _this.$publicUrl + "models/player/Model/unitychan_tile6.png"
      // );
      // //贴图平铺
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(50, 50);
      // const mesh = new THREE.Mesh(
      //   new THREE.PlaneGeometry(200, 200, 20, 20),
      //   new THREE.MeshStandardMaterial({
      //     // color: 0x666666,
      //     // color: 0xDDFF8D, 
      //     map: texture,
      //   })
      // );
      // mesh.position.y = 0.000;
      // mesh.rotation.x = -Math.PI / 2;
      // mesh.receiveShadow = true;
      // mesh.name = "floor";
      // scene.add(mesh);

      // ground 结束--------------
      //-------------
      //创建镜子
      // let mirrorGeo;
      // // mirrorGeo = new THREE.PlaneGeometry(2000, 2000);
      // mirrorGeo = new THREE.PlaneGeometry(50, 50);
      // verticalMirror = new Reflector(mirrorGeo, {
      //   clipBias: 0.003,
      //   // clipBias: 1,
      //   // textureWidth: window.innerWidth * window.devicePixelRatio,
      //   // textureHeight: window.innerHeight * window.devicePixelRatio,

      //   textureWidth: window.innerWidth * 0.1,
      //   textureHeight: window.innerHeight * 0.1,
      //   color: 0x888888,

      // });
      // verticalMirror.position.y = 0.011; 
      // verticalMirror.rotation.x = -Math.PI/2;
      // scene.add(verticalMirror);
      // CreateTestBox();

      // console.log(container);
      container.append(renderer.domElement);

      InitYJController();

      _YJController.SetConctrollerInitPos(
        new THREE.Vector3(0, 0, 0)
      );

      _YJController.SetTarget(
        new THREE.Vector3(0, 1, 0),
        -5
      );
      playerGroup = new THREE.Group();
      scene.add(playerGroup);
      let playerParent = _YJController.GetPlayerParent();
      playerGroup.add(playerParent);
      _YJController.SetAmmoPlayer(playerGroup);


      group = new THREE.Group();
      scene.add(group);


      scope.YJController = _YJController;

      let playerHeight = 1.22;
      let playerRadius = 0.22;
      let enabledAmmo = true;
      _YJAmmo = new YJAmmo(scene, enabledAmmo, renderer, scope, playerHeight, playerRadius, () => {

      });


      let _YJAnimMeshMerged = new YJAnimMeshMerged(_this, scene, renderer);


      update();
    }
    //初始化第三人称控制器
    function InitYJController() {
      _YJController = new YJController(
        scene,
        camera,
        renderer.domElement,
        _this
      );
      _YJController.wheelMin = -30;
      _YJController.wheelMax = -0.01;

      //1.7高度表示角色眼睛的高度
      // let targetPos = new THREE.Vector3(0, 1.7, 0);
      //控制摄像机的初始距离
      // this.YJController.SetTarget(targetPos, -10);
      //控制摄像机的初始角度
      let targetRota = new THREE.Vector3(0, 0, -3.14 / 8); //4
      _YJController.SetTargetRota(targetRota);

      //设置角色移动速度
      // _YJController.SetMoveSpeed(0.1);
    }

    this.CreateTestBox = function () {

      let pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let id = "11";
      let modelPath = "models/player/Scene/Car03/Car03.gltf";
      let modelName = "";
      let model = new YJLoadModel(
        _this,
        scene,
        id,
        _this.$publicUrl + modelPath,
        pos,
        rotaV3,
        modelName, modelName != "stage" ? "Triange" : "", false
      )

    }
    this.LoadStaticModel = function (modelPath, callback) {

      let pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let id = "11";
      let modelName = "";
      let model = new YJLoadModel(
        _this,
        scene,
        id,
        modelPath,
        pos,
        rotaV3,
        modelName, "Triange", false, callback
      )

    }
    let avatar = null;

    this.LoadAvatar = function (modelPath, animData, callback) {
      // console.log("切换角色11");
      avatar = new YJLoadAvatar(
        _this,
        scene,
        modelPath,
        animData,
        (_playerObj) => {
          clearGroup(group);

          group.add(_playerObj);
          callback(avatar);
          // playerObj.position.set(0, 0, 0); //原点位置
          // playerObj.rotation.set(0, 3.14, 0); //  
        }
      );
    }

    let playerHeight;
    // 此函数用来做npc
    this.ChangeAvatarByCustom = function (avatarData, npcName, callback) {
      // console.log("切换角色11");
      playerHeight = avatarData.height;
      if (avatar == null) {
        avatar = new YJLoadAvatar(
          _this,
          scene,
          _this.$publicUrl + avatarData.modelPath,
          avatarData.animationsData,
          (_playerObj) => {
            clearGroup(group);

            group.add(_playerObj);
            callback(avatar);

            CreateNameTrans(npcName);
          }
        );
        return;
      } else {

        avatar.ChangeAvatar(
          _this.$publicUrl + avatarData.modelPath,
          avatarData.animationsData,
          (_playerObj) => {
            clearGroup(group);
            group.add(_playerObj);
            _playerObj.position.set(0, 0, 0); //原点位置
            callback(avatar);

            // //刷新姓名条高度；刷新摄像机目标高度
            // UpdateNameTransHeight();
            CreateNameTrans(npcName);

          }
        );
      }

    }
    function UpdateNameTransHeight() {
      namePosTrans.position.set(0, (playerHeight + 0.3), 0); //原点位置
    }
    this.UpdateNameTransContent = function (e) {
      namePosTrans.remove(resetButton);
      CreateNameTrans(e);
    }

    // 创建npc有效碰撞区域
    let collider = null;
    this.CreateValidArea = function (size) {
      if (collider != null) {
        playerGroup.remove(collider);
      }
      const geometry = new THREE.CylinderGeometry(size, size, 2, 18, 5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.2,
      });
      collider = new THREE.Mesh(geometry, material);
      playerGroup.add(collider);

    }
    //----------姓名条 开始-----------------
    //创建姓名条参考物体
    let namePosTrans = null;
    let resetButton = null;
    function CreateNameTrans(content) {
      if (namePosTrans == null) {
        namePosTrans = new THREE.Group();
        namePosTrans.name = "player";
        group.add(namePosTrans);
        namePosTrans.position.set(0, (playerHeight + 0.5), 0); //原点位置
      }
      if (resetButton != null) {
        namePosTrans.remove(resetButton);
      }
      resetButton = new THREE.Group();
      const resetButtonText = createText(content, 0.06);
      resetButton.add(resetButtonText);
      resetButtonText.position.set(0, 0, 0.0051);
      resetButtonText.scale.set(1, 1, 1);
      namePosTrans.add(resetButton);
      resetButton.name = "ignoreRaycast";
      resetButton.position.set(0, 0, 0);
      var size = 3;
      resetButton.scale.set(size, size, size);

      // console.log("创建姓名条" + nameScale);
    }

    function clearGroup(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          item.geometry.dispose();
          item.material.dispose();
        }
      };
      const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        arr = null;
      };
      removeObj(group);
    }
    this.SetEyeHeight = function (height) {
      _YJController.SetTargetHeight(height);
    }

    this.getCanvasImg = function () {
      // console.log(" get threeJS canvas ");
      renderer.setSize(150, 150);
      renderer.setPixelRatio(1); //推荐
      let canvas = renderer.domElement;
      renderer.render(scene, camera);
      setTimeout(() => {
        ResetRender();
      }, 200);
      return canvas.toDataURL("image/jpeg");
    }
    function ResetRender() {
      renderer.setSize(width, height);
      renderer.setPixelRatio(2); //推荐
    }

    this.update = function () {
      renderer.render(scene, camera);
    }
  }
}

export { YJ3dScene };