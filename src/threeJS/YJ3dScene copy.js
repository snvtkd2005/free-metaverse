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

import { YJDoor } from "./YJDoor.js";

import { YJLoadGLtfTest } from "./YJLoadGLtfTest.js";

import { YJDigger } from "./YJDigger.js";
import { YJMMD } from "./YJMMD.js";
import { YJLoadModel } from "./YJLoadModel.js";

import { YJMapManager } from "./YJMapManager.js";

import { YJAmmo } from "./YJAmmo.js";
import { YJAmmoKinematic } from "./YJAmmoKinematic.js";
import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJController } from "./YJController.js";

class YJ3dScene {
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

    Init();
    function Init() {
      console.log("初始化小窗3d场景");
      scene = new THREE.Scene(); // 场景
      // let width = 300;
      // let height = 300;
      let width = container.clientWidth;
      let height = container.clientHeight;
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
      // var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      var ambient = new THREE.AmbientLight(0x666666); //添加环境光
      scene.add(ambient); //光源添加到场景中


      //雾效
      scene.background = new THREE.Color(0xA7D0FF);
      scene.fog = new THREE.Fog(0xA7D0FF, 10, 50);


      // ground 开始--------------
      var loaderTex_d = new THREE.TextureLoader();
      var texture = loaderTex_d.load(
        _this.$publicUrl + "models/player/Model/unitychan_tile6.png"
      );
      //贴图平铺
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(50, 50);
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200, 20, 20),
        new THREE.MeshStandardMaterial({
          // color: 0xA7C365,
          // color: 0xDDFF8D, 
          map: texture, 
        })
      );
      mesh.position.y = 0.000;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      mesh.name = "floor";
      scene.add(mesh);

      // ground 结束--------------
      //-------------
      // console.log(container);
      container.append(renderer.domElement);

      InitYJController();

      _YJController.SetConctrollerInitPos(
        new THREE.Vector3(0, 0, 0)
      );

      _YJController.SetTarget(
        new THREE.Vector3(0, 2, 0),
        -10
      );
      let playerGroup = new THREE.Group();
      scene.add(playerGroup);
      let playerParent = _YJController.GetPlayerParent();
      playerGroup.add(playerParent); 
      _YJController.SetAmmoPlayer(playerGroup); 

      CreateTestBox();
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
      _YJController.SetMoveSpeed(0.1);
    }

    let sceneData = {};
    async function CreateSence() {
      const res = await _this.$axios.get(
        _this.$publicUrl +
        "models/player/Scene/" + "scene" + ".txt"
      );
      sceneData = res.data;
    }
    async function CreateHotPoint() {
      const res = await _this.$axios.get(
        _this.$publicUrl +
        "models/player/Scene/" + "hotPoint" + ".txt"
      );
      // sceneData = res.data;
      // return;

      // console.log( "加载场景数据 ", res);
      for (let i = 0; i < res.data.hotPointDataList.length; i++) {
        const item = res.data.hotPointDataList[i];

        let planeGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1); // 生成平面
        let planeMaterial = new THREE.MeshBasicMaterial({
          // alphaTest:true,
          transparent: true,
          color: 0xffff00,
          // color: 0xffffff,
        }); // 材质
        const map = new THREE.TextureLoader().load(
          _this.$publicUrl + "images/new_spotd07_gif.png"
        );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

        planeMaterial.map = map;
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);

        let _pos = item.pos;
        let _rotaV3 = item.rotaV3;

        let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
        let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);
        plane.position.set(pos.x, pos.y, pos.z);
        plane.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
        // plane.name = "qq";
        plane.tag = "hotPoint";
        let modelData = [];
        modelData.push({ id: item.id, type: item.type });
        plane.modelData = modelData;
        // plane.modelId=item.modelId;
        plane.lookAt(0, 0, 0);
        scene.add(plane); // 向该场景中添加物体
        _this.pointsParent.add(plane);
        lookatList.push(plane);
      }
    }




    let currentCreateModel = null;
    let currentCreateModelId = null;
    let currentCreateModelPath = null;
    let currentCreateModelName = "";


    // 客户端同步生成模型
    function CreateSelectModel(id, modelData, state) {

      for (let i = 0; i < _this.sceneModels.length; i++) {
        var sceneModel = _this.sceneModels[i];
        if (sceneModel.id == id) {
          return;
        }
      }


      let modelName = modelData.modelName;
      let modelPath = modelData.modelPath;
      let modelType = modelData.modelType;
      let _pos = modelData.pos;
      let _rotaV3 = modelData.rotaV3;

      // modelPath = modelPath + modelName + "/" + modelName + "." + modelType;

      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);
      //  pos =new THREE.Vector3(0,0,0); 
      //  rotaV3 =new THREE.Vector3(0,0,0); 
      let model = null;
      if (modelName == "digger") {

        model = new YJDigger(
          _this,
          _this.scene,
          id,
          _this.$publicUrl + modelPath,
          1,
          modelName,
          pos,
          rotaV3,
          true, state
        );
      } else
        if (modelName == "door") {
          model = new YJDoor(
            _this,
            _this.scene,
            id,
            _this.$publicUrl + modelPath,
            1,
            modelName,
            pos,
            rotaV3,
            true, state
          );
        } else
          if (modelName == "mmd") {
            modelPath = "models/mmd/miku/miku_v2.pmd";
            state = { mmdName: "初音", animName: _this.$publicUrl + "models/mmd/Kizuna/classic.vmd" },
              model = new YJMMD(_this, scene,
                _this.$publicUrl + modelPath,
                pos,
                true, state);

          } else {

            model = new YJLoadModel(
              _this,
              scene,
              id,
              _this.$publicUrl + modelPath,
              pos,
              rotaV3,
              modelName, modelName != "stage" ? "Triange" : "", true
            )
          }


      _this.sceneModels.push({
        mapId: modelData.mapId,
        id: id,
        userId: modelData.userId,
        name: modelName,
        model: model,
        state: state,
      });


    }
    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }

    function CreateTestBox() {
      
      let pos =new THREE.Vector3(0,0,0); 
      let rotaV3 =new THREE.Vector3(0,0,0); 
      let id="11";
      let modelPath = "models/player/Scene/Car03/Car03.gltf";
      let modelName = "";
      let model = new YJLoadModel(
        _this,
        scene,
        id,
        _this.$publicUrl + modelPath,
        pos,
        rotaV3,
        modelName, modelName != "stage" ? "Triange" : "",false
      )

      // let cubeGeometry = new THREE.BoxGeometry(2, 1, 5);
      // let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
      // var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      // cube.position.x = 0;
      // cube.position.y = 0.5;
      // cube.position.z = 0;
      // cube.castShadow = true;
      // cube.name = "角色";
      // scene.add(cube);
    }
    //实时刷新
    // function update() {
    //   // const delta = clock.getDelta(); //获取自上次调用的时间差


    //   // timeStamp += delta;
    //   // //限制帧率在30帧
    //   // if (timeStamp > singleFrameTime) {
    //   //   renderer.render(scene, camera);

    //   //   // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
    //   //   timeStamp = timeStamp % singleFrameTime;
    //   //   _YJController.update();

    //   // }
    //   renderer.render(scene, camera);

    //   requestAnimationFrame(update());

    // }
    this.update = function () {
      // const delta = clock.getDelta(); //获取自上次调用的时间差


      // timeStamp += delta;
      // //限制帧率在30帧
      // if (timeStamp > singleFrameTime) {
      //   renderer.render(scene, camera);

      //   // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
      //   timeStamp = timeStamp % singleFrameTime;
      //   _YJController.update();

      // }
      renderer.render(scene, camera);
      // console.log("刷新小窗口三维",container);

    }
  }
}

export { YJ3dScene };