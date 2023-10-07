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
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture.js";

import { YJDoor } from "./YJDoor.js";

import { YJLoadGLtfTest } from "./YJLoadGLtfTest.js";

import { YJDigger } from "./YJDigger.js";
import { YJMMD } from "./YJMMD.js";
import { YJLoadModelCar } from "./YJLoadModelCar.js";

import { YJMapManager } from "./YJMapManager.js";

import { YJAmmo } from "./YJAmmo.js";
import { YJAmmoKinematic } from "./YJAmmoKinematic.js";
import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJController } from "./YJController.js";

class YJSingleModel3dScene {
  constructor(container, _this) {

    let scene;
    let renderer;
    let camera;
    let verticalMirror;
    let _YJController = null;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();
    let _YJAmmo;
    let lookatList = [];

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let group;
    let width, height;
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
        50,
        width / height,
        0.01,
        1000
      );
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true; // 开启阴影
      renderer.setPixelRatio(2); //推荐

      //环境光
      // var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      var ambient = new THREE.AmbientLight(0x666666); //添加环境光
      // var ambient = new THREE.AmbientLight(0x111111); //添加环境光
      scene.add(ambient); //光源添加到场景中


      //雾效
      // scene.background = new THREE.Color(0x666666);
      // scene.fog = new THREE.Fog(0x666666, 10, 50);


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

      // renderer.outputEncoding = THREE.sRGBEncoding;
      // renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // renderer.toneMappingExposure = 1.25;
      // renderer.toneMappingExposure = 0.5;


      // const light = new THREE.DirectionalLight(0xffffff, 0.5);
      // light.position.set(100, 100, 50);
      // light.castShadow = true;
      // const dLight = 200;
      // const sLight = dLight * 0.25;
      // light.shadow.camera.left = - sLight;
      // light.shadow.camera.right = sLight;
      // light.shadow.camera.top = sLight;
      // light.shadow.camera.bottom = - sLight;

      // light.shadow.camera.near = dLight / 30;
      // light.shadow.camera.far = dLight;

      // light.shadow.mapSize.x = 1024 * 2;
      // light.shadow.mapSize.y = 1024 * 2;
      // scene.add(light);

      var envmap2 = new THREE.CubeTextureLoader()
      // .setPath(_this.$publicUrl + "models/pano/Park3Med/")
      // .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']

      // .setPath(_this.$publicUrl + "models/pano/pisa/")
      // .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']

      // .setPath(_this.$publicUrl + "models/pano/Park2/")
      // .load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']

      .setPath(_this.$publicUrl + "models/pano/bg/")
      .load(['px_right.jpg', 'nx_left.jpg', 'py_top.jpg', 'ny_bottom.jpg', 'pz_front.jpg', 'nz_back.jpg']
        // "EnvMap.jpg"
      );



      let envmapLoader = new THREE.PMREMGenerator(renderer);
      new RGBELoader()
        .setPath(_this.$publicUrl + 'models/player/equirectangular/')
        // .load('venice_sunset_1k.hdr', //royal_esplanade_1k  venice_sunset_1k pedestrian_overpass_1k
        .load('pedestrian_overpass_1k.hdr', //royal_esplanade_1k  venice_sunset_1k moonless_golf_1k
        function (hdrmap) {
          hdrmap.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = hdrmap;
          scene.envMapIntenisty = 0.01;

          let envmap = envmapLoader.fromCubemap(hdrmap);
          
          let texture = new THREE.CanvasTexture(new FlakesTexture());
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.x = 20;
          texture.repeat.y = 20;
         

          var bodyAoMat = new THREE.TextureLoader().load(
            // _this.$publicUrl + "models/car_for_games_unity/textures/BodyAlbedo_baseColor.png"
            _this.$publicUrl + "models/car_for_games_unity/Paint_ao - 副本.jpg"
          );



          var normalMap = new THREE.TextureLoader().load(
            // _this.$publicUrl + "models/car_for_games_unity/textures/Paint_normal.png"
            _this.$publicUrl + "models/car_for_games_unity/textures/Paint_normal - 副本.png"
          );
          // normalMap.needsUpdate = true;

          var roughnessMap = new THREE.TextureLoader().load(
            // _this.$publicUrl + "models/car_for_games_unity/textures/Paint_metallicRoughness.png"
            _this.$publicUrl + "models/car_for_games_unity/textures/Paint_metallicRoughness - 副本.png"
          );

           
          const ballMaterial = {
            clearcoat:1.0,
            clearcoatRoughness:0.03,
            metalness:0.0,
            roughness:1,
            // roughness:0.1,
            color:0x788a7e,
            // normalMap:texture,
            // normalScale:new THREE.Vector2(0.01,0.01),
            normalMap:normalMap,
            normalScale:new THREE.Vector2(1,1),
            sheen: 0.5,
            aoMap: bodyAoMat,
            envMap:envmap2,
            // envMap:envmap.texture,
            // envMapIntenisty:0.1,
            roughnessMap : roughnessMap,
          };

          // let ballGeo = new THREE.SphereGeometry(1,30,30);
          // let ballMat = new THREE.MeshStandardMaterial(ballMaterial);
          let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
          // let ballMesh = new THREE.Mesh(ballGeo,ballMat);
          // scene.add(ballMesh);
          // ballMesh.position.set(0,3,0);


          const loader = new GLTFLoader(); 
          loader.load(_this.$publicUrl + "models/car_for_games_unity/body.gltf", function (gltf) {
            let model = gltf.scene; 
            console.log("car ", model);
            
            model.traverse(function (item) {
              if (item instanceof THREE.Mesh) { 
                item.material = ballMat; 
                // item.material.aoMap = bodyAoMat; 
                // item.material.envMap = envmap2; 
                // item.material.roughnessMap = roughnessMap; 
                // item.material.normalMap = normalMap; 
                // item.material.normalScale = new THREE.Vector2(1,1);
                
              }
            }); 
            let size = 1.5;
            model.scale.set(size, size, size);
            scene.add(model);
          });
        });
        // new RGBELoader()
        // .setPath(_this.$publicUrl + 'models/pano/')
        // .load('bg_2 - 副本.jpg', function (texture) {
        //   texture.mapping = THREE.EquirectangularReflectionMapping;
        //   scene.environment = texture;
        //   scene.envMapIntenisty = 0.5;
        // });

      // console.log(container);
      container.append(renderer.domElement);

      InitYJController();

      let playerGroup = new THREE.Group();
      scene.add(playerGroup);
      let playerParent = _YJController.GetPlayerParent();
      playerGroup.add(playerParent);
      _YJController.SetAmmoPlayer(playerGroup);


      group = new THREE.Group();
      scene.add(group);

      // new YJLoadModelCar(
      //   _this,
      //   scene,
      //   "currentCreateModelId",
      //   // _this.$publicUrl + "models/Unity2Skfb/Unity2Skfb.gltf",
      //   // _this.$publicUrl + "models/car_for_games_unity/scene.gltf",
      //   _this.$publicUrl + "models/car_for_games_unity/body.gltf",
      //   new THREE.Vector3(0, 0, 0),
      //   new THREE.Vector3(0, 0, 0),
      //   "modelName"

      // )

      new YJLoadModelCar(
        _this,
        scene,
        "currentCreateModelId", 
        _this.$publicUrl + "models/car_for_games_unity/glass.gltf",
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        "modelName"
      );
      new YJLoadModelCar(
        _this,
        scene,
        "currentCreateModelId", 
        _this.$publicUrl + "models/car_for_games_unity/other.gltf",
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        "modelName"
      ); 
       new YJLoadModelCar(
        _this,
        scene,
        "currentCreateModelId", 
        _this.$publicUrl + "models/car_for_games_unity/wheel.gltf",
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
        "modelName"
      );



      // 加载全景球
      LoadModelGltf(_this.$publicUrl + "models/pano/ball.gltf");
      // 加载汽车阴影
      LoadPlaneShadow();

      window.addEventListener("resize", onWindowResize);

    }
    // 场景360全景球
    function LoadModelGltf(modelPath) {
      var loaderTex_d = new THREE.TextureLoader();
      var texture = loaderTex_d.load(
        _this.$publicUrl + "models/pano/bg_2 - 副本.jpg"
      );
      let ballMat = new THREE.MeshBasicMaterial({
        map:texture,
        // color: 0x999999, 
        color: 0xffffff, 
      }); // 材质
      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {

        let model = gltf.scene;
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.material = ballMat;
          }
        });

        // console.log("in loadmodel gltf " + name,pos , model);
        // model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(0, Math.PI / 2, 0);
        model.scale.set(-1, 1, 1); //  

        scene.add(model);
      });

    }
    // 浏览器窗口变动触发的方法
    function onWindowResize () {
      console.log("改变窗口大小");
      if (camera == null) {
        return;
      }
      // 重新设置相机宽高比例
      camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      camera.updateProjectionMatrix();
      // 重新设置渲染器渲染范围
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function LoadPlaneShadow() {

      var loaderTex_d = new THREE.TextureLoader();
      var texture = loaderTex_d.load(
        // _this.$publicUrl + "models/pano/shadow2.png"
        _this.$publicUrl + "models/pano/shadow3.png"
      );
      texture.premultiplyAlpha = true;
      texture.needsUpdate = true;

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 4, 4),
        new THREE.MeshBasicMaterial({
          map: texture,
          // alphaTest:true,
          transparent: true,
          opacity:0.8,
          color: 0x000000,
          // depthTest:false,
          // lightMap:texture,
        })
      );
      mesh.position.y = 0.01;
      mesh.position.z = -0.1;
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = Math.PI / 2;
      mesh.scale.set(0.92,1,1);
      scene.add(mesh);
    }

    //初始化第三人称控制器
    function InitYJController() {
      _YJController = new YJController(
        scene,
        camera,
        renderer.domElement,
        _this
      );
      //60 farview
      // _YJController.wheelMin = -6.8;
      // _YJController.wheelMax = -4.8;

      // 50 farview
      _YJController.wheelMin = -8.8;
      _YJController.wheelMax = -5.8;
      

      //1.7高度表示角色眼睛的高度
      // let targetPos = new THREE.Vector3(0, 1.7, 0);
      //控制摄像机的初始距离
      // this.YJController.SetTarget(targetPos, -10);
      //控制摄像机的初始角度
      let targetRota = new THREE.Vector3(0, 0, -0.2); //4
      // let targetRota = new THREE.Vector3(0, 0, -3.14 / 8); //4
      _YJController.SetTargetRota(targetRota);

      //设置角色移动速度
      _YJController.SetMoveSpeed(0.1);
      
      _YJController.SetConctrollerInitPos(
        new THREE.Vector3(0, 0, 0)
      );

      _YJController.SetTarget(
        new THREE.Vector3(0, 1, 0),
        -8.3
      );
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

export { YJSingleModel3dScene };