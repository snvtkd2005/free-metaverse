




// 编辑模式的场景管理器

import * as THREE from "three";

import { YJLoadModel } from "./YJLoadModel.js";

import { YJMapManager } from "./YJMapManager.js";

import { YJAmmo } from "./YJAmmo.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { GetCurrentTime } from "/@/utils/api.js";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { nextTick } from "vue";
import { YJCurve } from "./YJCurve.js";
import { YJMinMap } from "./YJMinMap.js";
import { YJLoadUserModelManager } from "./YJLoadUserModelManagerEditor.js";

// 整体场景辉光 管理器
import { YJBloomManager } from "./YJBloomManager.js";
// 可设置单个模型辉光 管理器
import { YJBloomManager2 } from "./YJBloomManager2.js";
import { YJChangeManager } from "./YJChangeManager.js";
import { YJSandboxManager } from "./YJSandboxManager.js";
import { YJTransformManager } from "./YJTransformManager.js";
import { YJReflect } from "./YJReflect.js";
import { GetDateH, deepClone } from "/@/utils/utils.js";
import { YJKeyboard } from "./YJKeyboard.js";

import { YJVideo } from "./YJVideo";
import { YJSqeImage } from "./YJSqeImage.js";
import { YJUVanim } from "./YJUVanim.js";

import { YJPathfinding } from "./pathfinding/YJPathfinding.js";
import { TextureLoader } from "three";

import { YJGameManager_DyncScene } from "./YJGameManager_DyncScene.js";
import { YJ3dScene_margeTexture } from "/@/threeJS/YJ3dScene_margeTexture.js";
import { YJTransform } from "./components/YJTransform.js";
import { YJMeshRenderer } from "./components/YJMeshRenderer.js";
import { YJAnimator } from "./components/YJAnimator.js";
import { YJUVAnim3 } from "./components/YJUVAnim3.js";



import { YJStaticMeshMerged } from "./YJStaticMeshMerged.js";
import { YJCar } from "./model/YJCar.js";


class YJSceneManager {
  constructor(scene, renderer, camera, _this, platform, initCallback) {
    let scope = this;

    this.CreateOrLoadPlayerAnimData = function () {
      return _Global.CreateOrLoadPlayerAnimData();
    }

    let _YJLoadUserModelManager = null;
    this.GetLoadUserModelManager = function () {
      return _YJLoadUserModelManager;
    }
    this.Create_LoadUserModelManager = function () {

      if (_YJLoadUserModelManager != null) {
        return _YJLoadUserModelManager;
      }
      _YJLoadUserModelManager = new YJLoadUserModelManager(_this, modelParent, camera);
      return _YJLoadUserModelManager;
    }

    let _YJAmmo;
    this.GetAmmo = () => {
      return _YJAmmo;
    }
    let lookatList = [];

    let _DirectionalLight = null;

    const listener = new THREE.AudioListener();
    let _YJMinMap = null;
    let _YJGameManager_DyncScene = null;
    this.GetDyncSceneManager = function () {
      return _YJGameManager_DyncScene;
    }

    // 需要执行update的脚本
    let needUpdateJS = [];
    let lightData = null;

    this._YJTransformManager = null;
    let _YJBloomManager2 = null;
    let mirrorSphereCamera = null;
    let _YJ3dScene_margeTexture = null;



    this.GetTransformManager = function () {
      if (this._YJTransformManager != null) {
        return this._YJTransformManager;
      }
      this._YJTransformManager = new YJTransformManager(scope, scene, camera, renderer, _this);
      return this._YJTransformManager;
    }
    // 初始化沙盒管理器
    this.InitSandboxManager = function () {

      // new YJSandboxManager(scope, scene, camera, renderer.domElement);
      this._YJTransformManager = new YJTransformManager(scope, scene, camera, renderer, _this);
    }
    this.copyTextureToTexture = function (sourceTex, addTex, callback) {
      _YJ3dScene_margeTexture.margeTexture(sourceTex, addTex, callback);
    }




    let modelParent = null;
    let sceneData = null;
    let setting = null;

    let ambient = null;
    // 刚体高度
    let playerHeight = 0;

    let cube = null;
    let lightTarget = null;
    // let uploadHDRUrl  = _this.$uploadHDRUrl;
    let uploadHDRUrl = "https://snvtkd2005.com/socketIoServer/socketIoServer/uploadsHDR/";




    //#region 
    //#endregion

    //#region 静态模型合批
    let MargeStaticModelList = [];
    this.CheckTransform = (modelPath, modelData, _YJTransform) => {
      let has = false;


      if (modelData.modelType != "静态模型") { return; }

      if (MargeStaticModelList.length == 0) {
        let tranformList = [];
        tranformList.push(_YJTransform);
        MargeStaticModelList.push({ modelPath: modelPath, modelData: modelData, list: tranformList });
      } else {
        for (let index = 0; index < MargeStaticModelList.length && !has; index++) {
          const element = MargeStaticModelList[index];
          if (element.modelPath == modelPath) {
            element.list.push(_YJTransform);
            has = true;
          }
        }
        if (!has) {
          let tranformList = [];
          tranformList.push(_YJTransform);
          MargeStaticModelList.push({ modelPath: modelPath, modelData: modelData, list: tranformList });
        }
      }
      return has;
    }
    this.MargeStaticModel = function () {
      MargeStaticModelFn();
    }
    function MargeStaticModelFn() {
      console.log("全部创建完之后统一合批",MargeStaticModelList);
      //全部创建完之后统一合批

      for (let i = 0; i < MargeStaticModelList.length; i++) {
        const element = MargeStaticModelList[i];
        let posList = [];
        let rotaList = [];
        let scaleList = [];
        if (element.list.length > 1) {
          let _YJStaticMeshMerged = new YJStaticMeshMerged(_this, modelParent, element.list[0].GetGroup(), element.modelData);
          for (let i = 0; i < element.list.length; i++) {
            const tranform = element.list[i];
            let data = tranform.GetData();
            posList.push(data.pos);
            rotaList.push(data.rotaV3);
            scaleList.push(data.scale);
          }
          _YJStaticMeshMerged.ReMerged(posList, rotaList, scaleList);
        }
      }

      return;

    }

    //#endregion




    //#region 读取单品查看场景

    let singleModel = null;
    function GetSingleModelTransformFn() {
      return singleTransform;
    }
    this.GetSingleModelTransform = function () {
      return GetSingleModelTransformFn();
    }

    /**
     * 
     * @param {string} 接收组件名
     * @returns {组件} 获取当前编辑的Transform的指定组件 
     */
    this.GetSingleTransformComponent = function (componentName) {
      return this.GetSingleModelTransform().GetComponent(componentName);
    }
    this.AddComponent = function (component, data) {
      if (singleTransform == null) { return; }
      if (component == "car") {
        // console.log(singleTransform);
        return;
      }
    }

    this.InitSingleScene = function () {
      InitSingleSceneFn();
    }
    function InitSingleSceneFn() {
      console.log("初始化 单品  ");
      CreateGrid();



      if (_YJ3dScene_margeTexture == null) {
        _YJ3dScene_margeTexture = new YJ3dScene_margeTexture();
      }

      sceneData = _this.$parent.$parent.sceneData;
      setting = sceneData.setting;

      modelParent = new THREE.Group();
      modelParent.name = "modelParent";
      scene.add(modelParent);

      // 监听组合键
      addListenerCombKey();

      lightData = sceneData.AmbientLightData;
      //环境光
      ambient = new THREE.AmbientLight(0xffffff, lightData.AmbientLightIntensity); //添加环境光
      scene.add(ambient); //光源添加到场景中

      if (platform == "pcweb") {
        if (lightData.hasDirectionalLight != undefined && !lightData.hasDirectionalLight) {
        } else {
          CreateDirectionalLight(lightData.DirectionalLightPos, lightData.DirectionalLightIntensity);
        }

      } else {
      }

      if (platform != "ar" && !setting.clearBg) {
        scene.background = new THREE.Color(lightData.backgroundColor != undefined ? lightData.backgroundColor : 0x000000);
        //雾效
        // scene.fog = new THREE.Fog(0xA7D0FF, 30, 300);
      }


      playerPos = setting.playerPos;
      playerSetting.rotaV3 = setting.playerRotaV3;

      // 刚体高度
      playerHeight = setting.playerHeight;
      let playerRadius = 0.22;
      let enabledAmmo = true;


      _YJAmmo = new YJAmmo(scene, enabledAmmo, camera, _this, playerHeight, playerRadius, () => {
        if (initCallback) {
          initCallback();
        }
        //初始位置在setting中设置
        // 给地面场景碰撞体
        CreateFloor();


        _this.GeneratePlayer(() => {
          CreateSingleScene();
        });

        let modelData = JSON.parse(localStorage.getItem("modelData"));

        let modelPath = _this.$uploadUrl + modelData.modelPath;
        console.log("加载模型", modelPath, modelData);

        modelData.pos = { x: 0, y: 0, z: 0 };
        modelData.rotaV3 = { x: 0, y: 0, z: 0 };
        modelData.scale = { x: 1, y: 1, z: 1 };

        scope.Create_LoadUserModelManager().ImportModel(modelData, (tranform) => {
          console.log(" 单品模型加载完成 ！！！！");
          singleTransform = tranform;
          // if (callback) {
          //   callback();
          // }
        }); 
      });

    }

    this.ResetSingleTransfomParent = function () {
      if (singleTransform == null) { return; }
      scene.attach(singleTransform.GetGroup());
      let pos = this.GetPlayerPosReduceHeight();
      pos.y += 1;
      singleTransform.GetGroup().position.copy(pos);
      singleTransform.GetGroup().scale.set(1, 1, 1);
      singleTransform.GetGroup().rotation.set(0, 0, 0);
      if (singleTransform.GetComponent("Trigger") != null) {
        singleTransform.GetComponent("Trigger").Reset();
      }
    }


    let scale_s = 100;
    this.SetSingleTransfomParent = function (parent) {
      parent.attach(singleTransform.GetGroup());
      singleTransform.GetGroup().position.set(0, 0, 0);
      singleTransform.GetGroup().scale.set(scale_s, scale_s, scale_s);
      singleTransform.GetGroup().rotation.set(0, 0, 0);
    }
    this.SetSingleTransfomPosition = function (e) {
      singleTransform.GetGroup().position.set(1 * e[0], 1 * e[1], 1 * e[2]);
    }
    this.SetSingleTransfomRotation = function (e) {
      singleTransform.GetGroup().rotation.set(e[0], e[1], e[2]);
    }
    this.GetSingleTransformPosRota = function () {
      return {
        pos: singleTransform.GetGroup().position,
        rota: singleTransform.GetGroup().rotation,
      }
    }

    let singleTransform = null;
    this.SetSelectTransform = function (tranform) {
      singleTransform = tranform;
    }
    this.GetSelectTransform = function () {
      return singleTransform;
    }
    this.CreateSingleModel = function (modelPath, callback, errorback) {

      if (singleModel != null) {
        clearGroupMeshFn(singleModel);
      }

      if(singleTransform != null){
        singleTransform.Destroy();
      }

      let modelData = JSON.parse(localStorage.getItem("modelData"));

      modelData.pos = { x: 0, y: 0, z: 0 };
      modelData.rotaV3 = { x: 0, y: 0, z: 0 };
      modelData.scale = { x: 1, y: 1, z: 1 };
      modelData.modelPath = modelPath;
      // console.log("加载模型 22 ", modelPath, modelData);
      this.Create_LoadUserModelManager().ImportModel(modelData, (tranform) => {
        singleTransform = tranform;
        if (callback) {
          callback();
        }
      });
      return;
      if (modelData.modelType == "静态模型" || modelData.modelType == "装备模型") {

        let object = new YJTransform(_this, scene, "", null, null, modelData.name);

        object.SetPosRota(new THREE.Vector3(0, 0, 0));
        object.SetModelPath(modelPath);
        // object.SetData(item.folderBase,item.modelType);

        let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
        object.AddComponent("MeshRenderer", MeshRenderer);
        MeshRenderer.load(modelPath, (scope) => {
          singleModel = scope.GetModel();
          console.log(singleModel);
          if (callback) {
            callback();
          }
        }, (e) => {
          if (errorback) {
            errorback(e);
          }
        });

        singleTransform = object;

      }



      if (modelData.modelType == "动画模型") {


        let object = new YJTransform(_this, scene, "", null, null, modelData.name);

        object.SetPosRota(new THREE.Vector3(0, 0, 0));
        object.SetModelPath(modelPath);
        // object.SetData(item.folderBase,item.modelType);

        let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
        object.AddComponent("MeshRenderer", MeshRenderer);
        MeshRenderer.load(modelPath, (scope) => {
          new YJAnimator(scope.GetModel(), scope.GetAnimations());
        }, (e) => {
          if (errorback) {
            errorback(e);
          }
        });

      }



      if (modelData.modelType == "uv模型") {


        let object = new YJTransform(_this, scene, "", null, null, modelData.name);

        object.SetPosRota(new THREE.Vector3(0, 0, 0));
        object.SetModelPath(modelPath);
        // object.SetData(item.folderBase,item.modelType);

        let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
        object.AddComponent("MeshRenderer", MeshRenderer);
        MeshRenderer.load(modelPath, (scope) => {

        });

        // let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
        // object.AddComponent("MeshRenderer", MeshRenderer);

        singleTransform = object;
      }

    } 

    this.UpdateTransform = (msg) => {
      // if (singleTransform == null) { return; }
      // let meshrender = singleTransform.GetComponent("MeshRenderer");
      // if (meshrender == null) {
      //   return;
      // }
      // console.log("更新transform msg 数据 ", msg);
      if (msg.pointType == "car") {

        if (singleTransform == null) {
          let object = new YJTransform(_this, scene, "", null, null, modelData.name);
          // object.SetPosRota(new THREE.Vector3(0,1,0));
          object.SetPosRota(new THREE.Vector3(0, 0, 0));
          singleTransform = object;
        }

        let car = singleTransform.GetComponent("Car");
        if (car == null) {
          // let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
          // object.AddComponent("MeshRenderer", MeshRenderer);
          // MeshRenderer.load(modelPath, (scope) => {
          // });

          car = new YJCar(_this, singleTransform.GetGroup(), "dd", msg.data,
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 1, 1),
            null, (scope) => {
              needUpdateJS.push(scope);
            }, singleTransform
          );
          singleTransform.AddComponent("Car", car);
        } else {
          car.updateCarData(msg.data);
          // singleTransform.RemoveComponent("Car");
        }


      }

      singleTransform.SetMessage(msg);

    }


    // 还原角色位置
    this.ResetPlayerPos = function () {
      let pos = new THREE.Vector3(playerPos.x, playerPos.y + 0.1, playerPos.z);
      _YJAmmo.SetPlayerPos(pos);
      _this.YJController.SetPlayerRota3(playerSetting.rotaV3);
      _this.YJController.SetContrlState(setting.contrlState, setting.wheelValue);

    }

    // 初始化创建地图 和 设置角色位置
    function CreateSingleScene() {


      // console.log(" 初始化创建地图 和 设置角色位置 CreateSingleScene ");
      //刷新角色换装信息
      if (_this.$parent.$parent.UpdateSkin && _this.YJPlayer) {
        _this.$parent.$parent.UpdateSkin(_this.YJPlayer, _this.YJPlayer.GetAvatarName(), localStorage.getItem("playerState"));
      }

      for (let i = 0; i < modelParent.children.length; i++) {
        const item = modelParent.children[i];
        _this.$parent.$parent.modelList.push({ name: item.name, uuid: item.uuid });
      }



      if (platform == "pcweb") {
        // _this.YJController.SetPlayerRota(playerSetting.rotaV3);
        _this.YJController.SetPlayerRota3(playerSetting.rotaV3);
        _this.YJController.SetAmmoCtrl(_YJAmmo);
        _this.YJController.GetAmmoPlayer().add(listener);
        listener.rotation.y = 3.14;
      }

      let pos = new THREE.Vector3(playerPos.x, playerPos.y + 0.1, playerPos.z);
      // console.log("设置刚体位置", pos);


      // 在地图编辑模型，把角色放到原点
      if (setting.inMinMapEditor) {
        pos.x = 0;
        pos.z = 0;
      }


      _this.YJController.SetSetting(setting);

      _YJAmmo.SetSpeedData(setting.speedData);


      _YJAmmo.ChangeContrlState(setting.contrlState);

      // 角色掉入地下的回调
      _this.YJController.SetplayerPosDownCallback(() => {
        scope.SetPlayerPos({ x: 0, y: 10, z: 0 });
      });

      // 强制横屏 
      if (setting.onlyLandscape != undefined) {
        _this.$parent.ForcedUpdateSize();
      }

      _YJAmmo.SetPlayerPos(pos);


      setTimeout(() => {
        _YJAmmo.SetGravityActive(true);
      }, 2000);

      _this.$nextTick(function () {

        // console.log("设置摄像机到鸟瞰位置");
        setTimeout(() => {

          if (_this.$parent.$parent.load3dComplete) {
            _this.$parent.$parent.load3dComplete();
          }
          if (_this.load3dComplete) {
            _this.load3dComplete();
          }
        }, 2000);

        setTimeout(() => {
          _this.$parent.LoadState("success");
        }, 2000);


        if (setting.useBloom != undefined && setting.useBloom) {
          // 辉光效果管理器
          _YJBloomManager2 = new YJBloomManager2(_this, scene, camera, renderer, setting.bloomData);
          needUpdateJS.push(_YJBloomManager2);
        }
        if (setting.changeScene != undefined && setting.changeScene) {
          // 切换场景管理器
          new YJChangeManager(scope);
        }

        if (setting.render != undefined) {
          if (setting.render.outputEncoding == "sRGBEncoding") {
            renderer.outputEncoding = THREE.sRGBEncoding;
          }
        } else {
          renderer.outputEncoding = THREE.LinearEncoding;
        }
      });
    }

    //#endregion

    function Init() {
      let routerPath = _this.$route.path.toLowerCase();
      // console.log("初始化场景 ",routerPath);
      if (routerPath.includes("visit")|| routerPath.includes("group") || routerPath.includes("scene")|| routerPath.includes("metaworld")) {
        InitFn();
      } else {
        InitSingleSceneFn();
      }

    }

    let gridHelper = null;
    function CreateGrid() {
      // return;
      const size = 100;
      const divisions = 10;

      gridHelper = new THREE.GridHelper(size, divisions);
      scene.add(gridHelper); 
    }

    // 通过模型uuid查找到模型
    this.SelectModel = function (uuid) {
      for (let i = 0; i < modelParent.children.length; i++) {
        const item = modelParent.children[i];
        if (item.uuid == uuid) {
          this._YJTransformManager.attach(item);
          return;
        }
      }
    }
    this.GetSceneData = function(){
      return sceneData;
    }
    function InitFn() {


      if (_YJ3dScene_margeTexture == null) {
        _YJ3dScene_margeTexture = new YJ3dScene_margeTexture();
      }


      _YJGameManager_DyncScene = new YJGameManager_DyncScene();

      sceneData = _this.$parent.$parent.sceneData;
      // console.log(" 获取场景配置222 ", sceneData);


      setting = sceneData.setting;


      modelParent = new THREE.Group();
      modelParent.name = "modelParent";
      scene.add(modelParent);



      // 监听组合键
      addListenerCombKey();

      lightData = sceneData.AmbientLightData;
      //环境光
      ambient = new THREE.AmbientLight(lightData.ambientColor?lightData.ambientColor: 0xffffff, lightData.AmbientLightIntensity); //添加环境光
      scene.add(ambient); //光源添加到场景中

      if (platform == "pcweb") {
        if (lightData.hasDirectionalLight != undefined && !lightData.hasDirectionalLight) {
        } else {
          CreateDirectionalLight(lightData.DirectionalLightPos, lightData.DirectionalLightIntensity);
        }

      } else {
      }

      if (platform != "ar" && !setting.clearBg) {
        // console.log(" 加载背景色 ", lightData.backgroundColor);
        scene.background = new THREE.Color(lightData.backgroundColor != undefined ? lightData.backgroundColor : 0x000000);
        //雾效
        // scene.fog = new THREE.Fog(0xA7D0FF, 30, 100);

      }
      if(lightData.hasFog){
        scene.fog = new THREE.Fog(lightData.fogColor, lightData.fogNear, lightData.fogFar);
      }else{
        scene.fog = new THREE.Fog(0xA7D0FF,1000,10000);
      }

      playerPos = setting.playerPos;
      playerSetting.rotaV3 = setting.playerRotaV3;

      // 刚体高度
      playerHeight = setting.playerHeight;

      let playerRadius = 0.22;
      if (setting.playerRadius) {
        playerRadius = setting.playerRadius;
      }
      let enabledAmmo = true;
      if (setting.singleModel) {
        enabledAmmo = false;
      }


      _YJAmmo = new YJAmmo(scene, enabledAmmo, camera, _this, playerHeight, playerRadius, () => {
        if (initCallback) {
          initCallback();
        }
        scope.Create_LoadUserModelManager();

        if (setting.hasMinMap) {
          _YJMinMap = new YJMinMap(_this, scope, scene);
          needUpdateJS.push(_YJMinMap);
        }

        CreateSkybox();


        if (sceneData.hasFloor == undefined || sceneData.hasFloor) {
          CreateFloor();
          CreateGrid();

        } else {

        }
 

        // 已经编辑过才加载场景
        if (sceneData.hasEditored) {
          CreateSence();
        }

      });

      if (setting.hasPathfinding) {
        new YJPathfinding(scope, scene, _this.GetPublicUrl(), camera);
      }


      // 添加事件监听
      // 监听人视/鸟瞰视角转换
      _this.YJController.SetWheelChangeHandler((e) => {
        if (_this.$parent.$parent.changeViewSliderValue) {
          _this.$parent.$parent.changeViewSliderValue(e);
        }
      });

      _this.YJController.OnViewStateChange((e) => {
        scope.SetViewState(e);
      });
      _this.YJController.OnRotaBase(() => {
        UpdateProjectionUI();
        // scope.UpdateProjectionUI(); 
      });



      // CreateTestBox();
      // new YJCurve(_this, scene,CreateTestBox()); 
      // new YJVideo(_this, scene);
      // new YJUVanim(scene,_this.GetPublicUrl()+"lightning.png",17,5);
      // new YJSqeImage(scene,_this.GetPublicUrl()+"new_spotd07_gif.png",17,5);
      return;

    }

    let floor, floorCollider;
    // 创建地板、地板碰撞
    function CreateFloor() {
      floor = CreateFloorCollider("floor");
      floorCollider = CreateFloorCollider("landcollider");
      scope.CreateModelMeshCollider(floorCollider, new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI / 2, 0));


    }
    // 设置地板尺寸
    this.SetFloorSize = (x, y) => {
      if (!floor.visible) { return; }
      floor.scale.set(x / 10, 1, y / 10);
      scope.RemoveCollider(floorCollider);

      scope.CreateModelMeshCollider(floorCollider, new THREE.Vector3(x / 10, 1, y / 10),
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI / 2, 0));
    }
    this.SetDisplayFloor = (b) => {
      if (b) {
        if (floor == null) {
          CreateFloor();
        }

      } else {
        if (floor == null) {
          return;
        }
      }
      floor.visible = b;
      floorCollider.visible = b;
      if (gridHelper) {
        gridHelper.visible = b;
      }
    }
    this.SetDisplayFloorCollider = (b) => {
      if (b) {
        if (floor == null) {
          CreateFloor();
        }

        scope.CreateModelMeshCollider(floorCollider, new THREE.Vector3(1, 1, 1),
          new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI / 2, 0));

        this.SetPlayerPos({ x: 0, y: 10, z: 0 });

      } else {

        scope.RemoveCollider(floorCollider);
      }

      floor.visible = b;
      floorCollider.visible = b;
      sceneData.hasFloor = b;
    }

    this.InitSandboxManager();

    // 初始化创建地图 和 设置角色位置
    this.CreateMap = function () {
      // console.log(" 初始化创建地图 和 设置角色位置 CreateMap ");
      return;
      //刷新角色换装信息
      if (_this.$parent.$parent.UpdateSkin) {
        _this.$parent.$parent.UpdateSkin(_this.YJPlayer, _this.YJPlayer.GetAvatarName(), localStorage.getItem("playerState"));
      }

      for (let i = 0; i < modelParent.children.length; i++) {
        const item = modelParent.children[i];
        _this.$parent.$parent.modelList.push({ name: item.name, uuid: item.uuid });
      }


      if (platform == "pcweb") {
        // _this.YJController.SetPlayerRota(playerSetting.rotaV3);
        _this.YJController.SetPlayerRota3(playerSetting.rotaV3);
        _this.YJController.SetAmmoCtrl(_YJAmmo);
        _this.YJController.GetAmmoPlayer().add(listener);
        listener.rotation.y = 3.14;
      }

      let pos = new THREE.Vector3(playerPos.x, playerPos.y + 0.1, playerPos.z);
      // console.log("设置刚体位置", pos);


      // 在地图编辑模型，把角色放到原点
      if (setting.inMinMapEditor) {
        pos.x = 0;
        pos.z = 0;
      }


      _this.YJController.SetSetting(setting);
      // 角色掉入地下的回调
      _this.YJController.SetplayerPosDownCallback(() => {
        this.SetPlayerPos({ x: 0, y: 10, z: 0 });
      });

      // _this.YJController.SetplayerPosDownCallback(()=>{
      //   console.log(" 角色掉入地下的回调 ");
      // });


      // 强制横屏 
      if (setting.onlyLandscape != undefined) {
        _this.$parent.ForcedUpdateSize();
      }


      _YJAmmo.SetSpeedData(setting.speedData);


      _YJAmmo.ChangeContrlState(setting.contrlState);

      _YJAmmo.SetPlayerPos(pos);
      _YJAmmo.SetGravityActive(true);

      _this.$nextTick(function () {

        console.log("设置摄像机到鸟瞰位置");
        setTimeout(() => {
          // _this.YJController.SetChangeViewBegin();

          if (_this.$parent.$parent.load3dComplete) {
            _this.$parent.$parent.load3dComplete();
          }
          if (_this.load3dComplete) {
            _this.load3dComplete();
          }
        }, 500);

        setTimeout(() => {

          CreateMapFn();
          _this.$parent.LoadState("success");
        }, 100);


        if (setting.useBloom != undefined && setting.useBloom) {
          // 辉光效果管理器
          _YJBloomManager2 = new YJBloomManager2(_this, scene, camera, renderer, setting.bloomData);
          needUpdateJS.push(_YJBloomManager2);
        }
        if (setting.changeScene != undefined && setting.changeScene) {
          // 切换场景管理器
          new YJChangeManager(scope);
        }

        if (setting.render != undefined) {
          if (setting.render.outputEncoding == "sRGBEncoding") {
            renderer.outputEncoding = THREE.sRGBEncoding;
          }
        } else {
          renderer.outputEncoding = THREE.LinearEncoding;
        }
      });
    }

    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    this.onWindowResize = function (w, h) {
      windowHeight = h;
      windowWidth = w;

      // console.log("屏幕尺寸 ", windowWidth, windowHeight);
      if (_YJBloomManager2 != null) {
        _YJBloomManager2.onWindowResize(w, h);
      }
    }
    this.GetWindowSize = function(){
      return {w:windowWidth,h:windowHeight};
    }


    this.BeginEnter = function () {

      if (_this.$parent.$parent.$refs.map2d) {
        _this.$parent.$parent.$refs.map2d.BeginUpdate();
      }
      if (_this.$parent.$refs.map2d) {
        _this.$parent.$refs.map2d.BeginUpdate();
      }

      _this.YJController.SetChangeViewCompleted(() => {
        _this.YJController.ChangeCtrlState();
      });

      if (setting.hasAerialView) {
        if (setting.isLockStartAerial) {
          _this.YJController.SetToNiaokanPos();
        } else {
          _this.YJController.SetChangeViewBegin();
        }
      } else {
        _this.YJController.SetChangeViewBeginEnter();
      }


    }
    function CreateMapFn() {
      if (platform == "pcweb") {
        // new YJMapManager(_this, scene, _this.YJController.GetPlayer());
      }
    }

    function CreateSence() {
      _this.$parent.$parent.RequestGetAllSceneModelData();
    }

    this.CreateSenceBy = (data) => {
      if (data.length == 0) {
        this.LoadDone();
        return;
      }

      let sceneModelsData = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        sceneModelsData.push((element));
      }

      // 开始加载进度条
      _this.$parent.LoadState("begin");

      currentLoadCount = 0;
      needLoadCount = sceneModelsData.length;
      // console.log("加载场景模型============", sceneModelsData, sceneModelsData.length);

      _YJLoadUserModelManager.CallLoadSceneModelByIndex(sceneModelsData);
    }
    let allHoverCollider = [];
    // 鼠标悬浮检测的物体
    this.AddHoverCollider = function (colliderMesh) {
      allHoverCollider.push(colliderMesh);
    }
    this.GetHoverCollider = function () {
      // 返回所有非静态模型
      // if(allHoverCollider.length == 0){
      // }
      return modelParent.children;
      return scene.children;
      return allHoverCollider;
    }

    let allCollider = [];
    let allLandCollider = [];
    let allAndLandCollider = [];
    this.GetAllColliderAndLand = function () {
      return allAndLandCollider;
    }
    this.GetAllCollider = function () {
      return allCollider;
    }
    this.GetAllLandCollider = function () {
      return allLandCollider;
    }
    this.AddCollider = function (colliderMesh) {
      allCollider.push(colliderMesh);
      allAndLandCollider.push(colliderMesh); 
      // console.error("添加模型碰撞体");
    }
    this.AddLandCollider = function (colliderMesh) {
      allLandCollider.push(colliderMesh);
      allAndLandCollider.push(colliderMesh); 
      // console.error("添加模型碰撞体 地面 ");
    } 
    //#region 记录模型信息中的模型名和模型路径

    let modelData = [];
    this.AddModel = function (modelName, modelPath) {
      for (let i = 0; i < modelData.length; i++) {
        const element = modelData[i];
        if (element.name == modelName) { return; }
      }
      modelData.push({ name: modelName, path: modelPath });
    }
    this.GetModelPath = function (modelName) {
      for (let i = 0; i < modelData.length; i++) {
        const element = modelData[i];
        if (element.name == modelName) {
          return element.path;
        }
      }
    }

    //#endregion




    this.rotaModelParent = function (y) {
      modelParent.rotation.set(0, y, 0);
    }

    this.addRotaModelParent = function (x, y) {
      // return;
      modelParent.rotation.x += x;
      modelParent.rotation.y += y;

    }
    this.setModelParentOffset = function (y) {
      // return;
      // modelParent.rotation.y += y;
      modelParent.position.set(0, y, 0);
      // modelParent.quaternion.copy(y);
    }


    this.ResetBackgroundColor = function () {
      scene.background = new THREE.Color(lightData.backgroundColor != undefined ? lightData.backgroundColor : 0x000000);
    }
    this.SetBackgroundColor = function (color) {
      sceneData.AmbientLightData.backgroundColor = color;
      // _this.$parent.$parent.sceneData.AmbientLightData.backgroundColor = color;
      scene.background = new THREE.Color(sceneData.AmbientLightData.backgroundColor);
    }

    this.enableHDR = function (b, path, isEnvmap) {
      enableHDRFn(b, path, isEnvmap);
    }
    async function enableHDRFn(b, path, isEnvmap) {

      if (isEnvmap) {
        sceneData.setting.hasSceneHDR = b;
      } else {
        sceneData.setting.hasEnvmap = b;
      }
      console.log("加载hdr", b, path);
      // hdr做全景球、全局光
      if (b && path.indexOf("hdr") > -1) {
        const rgbeLoader = new RGBELoader();
        const [texture] = await Promise.all([
          rgbeLoader.loadAsync(uploadHDRUrl + path),
        ]);
        // environment 
        texture.mapping = THREE.EquirectangularReflectionMapping;

        if (isEnvmap) {
          sceneData.setting.envSceneHDRPath = path;
          scene.environment = texture;
        } else {
          sceneData.setting.envmapPath = path;
          scene.background = texture;
        }
        // console.log("加载hdr完成");
      } else {
        if (isEnvmap) {
          scene.environment = null;
        } else {
          // scene.background = null;
          scene.background = new THREE.Color(lightData.backgroundColor != undefined ? lightData.backgroundColor : 0x000000);

        }
      }
    }



    async function CreateSkybox(callback) {
      // if (!setting.hasEnvmap) {
      //   scene.environment = null;
      //   scene.background = new THREE.Color(lightData.backgroundColor ? lightData.backgroundColor : 0xA7D0FF);
      //   if (callback) {
      //     callback();
      //   }
      //   return;
      // }



      let hasBackgroundImage = false;
      if (lightData.backgroundImage) {
        hasBackgroundImage = true;
      }
      let envmapPath = setting.envmapPath;


      // 当有第二套环境全景图的，在18点后，切换第二套
      if (setting.envmapPath2) {
        let hour = GetDateH();
        if (hour < 18) {
        } else {
          envmapPath = setting.envmapPath2;
        }
      }


      // hdr做全景球、全局光
      if (setting.hasEnvmap && envmapPath.indexOf("hdr") > -1) {
        const rgbeLoader = new RGBELoader();

        const [texture] = await Promise.all([
          rgbeLoader.loadAsync(uploadHDRUrl + envmapPath),
        ]);
        // environment
        // texture.encoding = THREE.RGBEEncoding;//设置编码属性的值
        // texture.minFilter = THREE.NearestFilter;//当一个纹素覆盖小于一个像素时，贴图将如何采样
        // texture.magFilter = THREE.NearestFilter;//当一个纹素覆盖大于一个像素时，贴图将如何采样
        // texture.flipY = true;//翻转图像的Y轴以匹配WebGL纹理坐标空间 
        texture.mapping = THREE.EquirectangularReflectionMapping;

        if (!setting.hasSceneHDR) {
          _Global.hdrEquirect = texture;
          scene.environment = texture;
        }

        if (!hasBackgroundImage) {
          scene.background = texture;
        }
        // console.log("scene = ",scene);
        if (callback) {
          callback();
        }
      }


      if (setting.hasSceneHDR) {
        const rgbeLoader = new RGBELoader();

        const [texture] = await Promise.all([
          rgbeLoader.loadAsync(uploadHDRUrl + setting.envSceneHDRPath),
        ]);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        _Global.hdrEquirect = texture;
        scene.environment = texture;
        if (setting.hasEnvmap && envmapPath == ("")) {
          scene.background = texture;
        }

        if (callback) {
          callback();
        }
      }

      if (hasBackgroundImage) {

        const rgbeLoader = new TextureLoader()
          .setPath(_this.GetPublicUrl());

        const [texture] = await Promise.all([
          rgbeLoader.loadAsync(uploadHDRUrl + lightData.backgroundImage),
        ]);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;

        // renderer.toneMapping = THREE.ReinhardToneMapping;
        // renderer.toneMappingExposure = 2;
        // //是否乘以gamma输出，默认值false
        // // renderer.gammaOutput = false;
        // renderer.gammaOutput = true;

      }

      if (callback) {
        callback();
      }

    }

    this.SetAmbientColor = function (c) {
      ambient.color.set(c) ; 
      lightData.ambientColor = c; 
    }
    this.SetAmbientIntensity = function (f) {
      ambient.intensity = f;
      lightData.AmbientLightIntensity = f; 
    }
    this.SetDirectionalIntensity = function (f) {
      _DirectionalLight.intensity = f;
      lightData.DirectionalLightIntensity = f;
    }
    this.SetFog = function(msg){
      if(msg.visible){
        scene.fog = new THREE.Fog(msg.color, msg.near,( msg.far));
      }else{
        // scene.fog = null;
        scene.fog = new THREE.Fog(msg.color,1000,10000);
      }
      lightData.hasFog = msg.visible; 
      lightData.fogColor = msg.color; 
      lightData.fogNear = msg.near; 
      lightData.fogFar = msg.far;  
    }
    // 加载第二套场景
    let inLoadScene2 = false;
    // 切换 场景
    this.SetScene = function (e) {
      //切换不同场景的配置js
      _this.$parent.ChangeScene(e);
      this.ChangeScene();
    }

    this.GetAllModel = function () {
      let sceneItemCount = 0;
      scene.traverse((item) => {
        // if(item.isMesh){
        //   console.log("");
        // }
        sceneItemCount++;
        // console.log(" 遍历 scene ", sceneItemCount, item.name);
      });
      console.log(" 遍历 scene 中元素数量 ", sceneItemCount);

      sceneItemCount = 0;
      let allMap = [];
      scene.traverse((item) => {
        if (item.isMesh) {
          if (item.material) {
            if (item.material.map) {
              let has = false;
              for (let i = 0; i < allMap.length && !has; i++) {
                const element = allMap[i];
                if (item.material.map == allMap[i]) {
                  has = true;
                }
              }
              if (!has) {
                allMap.push(item.material.map);
              }
              sceneItemCount++;
              // console.log(" 遍历 scene 找贴图 ", sceneItemCount, allMap);
            }
          }
        }
      });

      console.log(" 遍历 scene 找贴图数量 ", sceneItemCount);

    }

    this.ChangeScene = function () {
      _YJAmmo.SetGravityActive(false);

      // _this.pointsParent.traverse((item)=>{
      //   console.log(" 遍历 _this.pointsParent ",item);
      // });


      // return;

      // 标记加载第二套场景，加载第二套场景时，不加载角色
      inLoadScene2 = true;

      ClearArray(modelData);
      ClearArray(_this.canHitModelList);
      ClearArray(lookatList);
      ClearArray(animHotPointList);
      ClearArray(animHotPointList2);
      ClearArray(animModelJS);
      ClearArray(camPosLookatPosList);
      ClearArray(playerPosPointList);
      ClearArray(projectionUIList);
      ClearArray(projectionUIList);
      ClearArray(projectionUIDataList);
      ClearArray(viewStateListenerList);

      ClearArray(allLandCollider);
      ClearArray(allCollider);


      // 热点js清空
      Destroy_hotPointJS();
      //移除场景模型。需要反复切换的场景，不需移除mesh缓存、图片缓存
      Destroy_loadMesh(loadMesh);
      ClearArray(loadTexture);
      ClearArray(npcList);

      // modelParent 、 _this.pointsParent
      clearGroupFn(modelParent);
      clearGroupFn(_this.pointsParent);

    }
    function ClearArray(array) {
      array.splice(0, array.length);
    }

    this.GetmodelParent = () => {
      return modelParent;
    }
    this.clearmodelParent = () => {
      clearGroupFn(modelParent);
    }
    this.clearGroup = (group) => {
      clearGroupFn(group);
    }
    this.clearObject = (mesh) => {
      let group = new THREE.Group();
      group.add(mesh);
      clearGroupFn(group);
    }
    function clearObjectFn(mesh) {
      let group = new THREE.Group();
      group.add(mesh);
      clearGroupFn(group);
    }

    this.ClearMesh = function (group) {
      clearGroupMeshFn(group);
    }
    function clearGroupMeshFn(group) {
      if (group.isGroup) {

      } else {
        let group2 = new THREE.Group();
        group2.add(group);
        clearGroupMeshFn(group2);
        return;
      }
      const clearCache = (item) => {
        if (item.type === 'Mesh' && item.geometry) {

          //移除碰撞体
          _YJAmmo.removeRigidBody(item);
          item.geometry.dispose();
          item.geometry = undefined;
          if (item.material.length > 0) {
            for (let i = 0; i < item.material.length; i++) {
              item.material[i].dispose();
              item.material[i] = undefined;
            }
          } else {
            if (item.material) {
              let mat = item.material;
              if (mat) {
                mat.dispose();
                mat = undefined;
              }
            }
          }
          item = undefined;

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


    this.ClearCollider = function (model) {
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          _YJAmmo.removeRigidBody(item);
        }
      });
    }
    let clearCount = 0;
    function clearGroupFn(group) {

      if (group.isGroup) {

      } else {
        let group2 = new THREE.Group();
        group2.add(group);
        clearGroupFn(group2);
        return;
      }

      clearCount = 0;
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          clearCount++;
          // console.log(group.name + "清除场景mesh ",clearCount);
          //移除碰撞体
          _YJAmmo.removeRigidBody(item);

          item.geometry.dispose();
          item.geometry = undefined;
          if (item.material.length > 0) {
            for (let i = 0; i < item.material.length; i++) {
              if (item.material[i].map) {
                item.material[i].map.dispose();
                item.material[i].map = undefined;
              }
              item.material[i].dispose();
              item.material[i] = undefined;
            }
          } else {
            if (item.material) {
              let mat = item.material;
              if (mat) {
                if (mat.map) {
                  mat.map.dispose();
                  mat.map = undefined;
                }
                if (mat.normalMap) {
                  mat.normalMap.dispose();
                  mat.normalMap = undefined;
                }
                mat.dispose();
                mat = undefined;
              }
            }
          }
          item = undefined;

        } else
          if (item.type === 'SkinnedMesh') {
            item.parent.animations = undefined; //重要，必须
            item.skeleton.dispose();
            item.skeleton = undefined;  //重要，必须
            item.geometry.dispose();
            item.geometry = undefined;

            if (item.material.length > 0) {
              for (let i = 0; i < item.material.length; i++) {
                let mat = item.material[i];
                if (mat) {
                  if (mat.map) {
                    mat.map.dispose();
                    mat.map = undefined;
                  }
                  if (mat.normalMap) {
                    mat.normalMap.dispose();
                    mat.normalMap = undefined;
                  }
                  mat.dispose();
                  mat = undefined;
                }
              }
            } else {
              if (item.material) {
                let mat = item.material;
                if (mat) {
                  if (mat.map) {
                    mat.map.dispose();
                    mat.map = undefined;
                  }
                  if (mat.normalMap) {
                    mat.normalMap.dispose();
                    mat.normalMap = undefined;
                  }
                  mat.dispose();
                  mat = undefined;
                }
              }
            }
            item = undefined;
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


    this.GetLoadModelManager = function () {
      return _YJLoadModelManager;
    }

    // 切换天空球
    this.SetSkybox = function (e) {
      // 加载全景球
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();
      THREE.DefaultLoadingManager.onLoad = function () {
        pmremGenerator.dispose();
      };
      let exrCubeRenderTarget;
      let exrBackground;

      let envmapPath = e + ".exr";

      new EXRLoader()
        .load(_this.GetPublicUrl() + envmapPath, function (texture) {
          exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
          exrBackground = exrCubeRenderTarget.texture;
          texture.dispose();
          scene.background = exrBackground;
        });
    }


    // 设置小地图缩放和偏移，让小地图与三维坐标对应
    this.SetMinMap = function (sx, sy, ox, oy) {
      _YJMinMap.SetScale(sx, sy);
      _YJMinMap.SetOffset(ox, oy);

    }


    //#region 监听视角改变，鸟瞰或人视,改变状态
    // 监听视角改变，鸟瞰或人视，由YJController调用
    this.SetViewState = function (e) {
      // if(e=="人视"){}
      // if(e=="鸟瞰"){

      // }
      for (let i = 0; i < viewStateListenerList.length; i++) {
        viewStateListenerList[i].SetViewState(e);
      }

      //鸟瞰状态隐藏小地图
      if (_this.$parent.$parent.$parent.SetViewState) {
        _this.$parent.$parent.$parent.SetViewState(e);
      }
      if (_this.$parent.$parent.SetViewState) {
        _this.$parent.$parent.SetViewState(e);
      }

      if (_this.$parent.SetViewState) {
        _this.$parent.SetViewState(e);
      }
      b_displayProjectionUI = e == "鸟瞰";

      UpdateProjectionUI();

    }

    // 鸟瞰或人视视角改变时，需要执行的脚本列表
    let viewStateListenerList = [];
    this.AddViewStateListener = function (fn) {
      viewStateListenerList.push(fn);
    }



    //#region 鸟瞰时，三维物体映射到2dUI上
    // 鸟瞰时，三维物体映射到2dUI上
    let projectionUIList = [];
    let projectionUIDataList = [];

    this.AddProjectionUI = function (fn) {
      projectionUIList.push({ id: fn.GetId(), _hotPoint: fn });
      projectionUIDataList.push({ id: fn.GetId(), pos: { x: 0, y: 0 } });

      // console.log("添加3转2", projectionUIList);

    }

    // 获取模型相对于界面的2d坐标
    this.GetObjectPosToScreenPos = function (obj) {
      return getScreenPosition(obj.getWorldPosition(new THREE.Vector3()));
    }
    this.WorldPosToScreenPos = function (pos) {
      return getScreenPosition(pos);
    }

    let b_displayProjectionUI = false;
    this.SetDisplayProjectionUI = function (b) {
      b_displayProjectionUI = b;
    }
    // 实时刷新三维物体，世界坐标转屏幕坐标，更新div
    function UpdateProjectionUI() {
      if (b_displayProjectionUI) {
        for (let i = 0; i < projectionUIList.length; i++) {
          const item = projectionUIList[i]._hotPoint;
          let pos = getScreenPosition(item.GetPointWorldPos());
          projectionUIDataList[i].pos = pos;
          // console.log("id = "+projectionUIDataList[i].id + " pos = ",pos );
        }
        //传到界面
        if (_this.$parent.UpdateProjectionUI) {
          _this.$parent.UpdateProjectionUI(projectionUIDataList);
        }
        if (_this.$parent.$parent.UpdateProjectionUI) {
          _this.$parent.$parent.UpdateProjectionUI(projectionUIDataList);
        }
      }
    }
    //世界坐标转屏幕坐标。 世界坐标要从模型包裹盒中获取

    //世界坐标转屏幕坐标。 世界坐标要从模型包裹盒中获取
    function getScreenPosition(world_vector) {
      // let projector = new THREE.Projector();
      let camPos = camera.getWorldPosition(new THREE.Vector3());
      let playerPos = _YJAmmo.GetPlayerPos();

      // npcPointToCamDistance = camPos.distanceTo(world_vector);
      // console.log("相机到npc的距离 ",npcPointToCamDistance ); 

      let wc = camPos.clone().sub(world_vector);
      let pc = camPos.clone().sub(playerPos);
      let value = wc.dot(pc) / (wc.length() * pc.length());
      // console.log("物体到相机到角色",value ); 
      if (value >= 0.4) {
        let vector = world_vector.project(camera);
        let halfWidth = windowWidth / 2;
        let halfHeight = windowHeight / 2;
        return {
          x: Math.round(vector.x * halfWidth + halfWidth),
          y: Math.round(-vector.y * halfHeight + halfHeight),
        };
      }
      return {
        x: -500,
        y: -500,
      };
    }
    this.checkPlayerForward = function(world_vector){
      let camPos = camera.getWorldPosition(new THREE.Vector3());
      let playerPos = _YJAmmo.GetPlayerPos(); 
      let wc = camPos.clone().sub(world_vector);
      let pc = camPos.clone().sub(playerPos);
      let value = wc.dot(pc) / (wc.length() * pc.length());
      // console.log("物体到相机到角色",value );  
      return value >= 0.7 ; //摄像机前方范围屏幕左右两端叉乘值大于0.7
    }


    //#endregion


    //#region 角色位置热点
    let playerPosPointList = [];
    this.AddPlayerPosPointList = function (fn) {
      playerPosPointList.push({ id: fn.GetId(), _hotPoint: fn });
      // console.log("");
    }
    this.GetHotPointDataById = function (id) {
      for (let i = 0; i < playerPosPointList.length; i++) {
        if (playerPosPointList[i].id == id) {
          return playerPosPointList[i]._hotPoint.GetHotPointData();
        }
      }
      console.error(" 未查找到 角色位置id = " + id);
      return null;
    }

    // 把视角切换到指定id的热点视角位置.鸟瞰到人视
    this.ChangeViewById = function (id) {
      let hotPointData = this.GetHotPointDataById(id);
      if (hotPointData == null) { return; }
      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {
          this.SetPlayerPosRota2(
            hotPointData.pos,
            hotPointData.rota
          );

          //视角拉近
          _this.YJController.ChangeToPersonView();
        }
      }
    }
    // 直接切换视角，无过度
    this.ChangeViewByIdDirect = function (id) {
      let hotPointData = this.GetHotPointDataById(id);
      if (hotPointData == null) { return; }
      if (hotPointData.type) {
        if (hotPointData.type == "设置角色位置") {
          // this.SetPlayerPosRota2(
          //   hotPointData.pos,
          //   hotPointData.rota
          // ); 
          this.SetPlayerPosRota(
            hotPointData.pos,
            hotPointData.rotaV3
          );
        }
      }
    }

    //#endregion


    //#endregion




    //#region 设置摄像机到指定位置，lookat指定坐标
    let camPosLookatPosList = [];
    this.AddCamPosLookatPos = function (fn) {
      camPosLookatPosList.push({ id: fn.GetId(), _hotPoint: fn });
      // console.log(" camPosLookatPosList ",camPosLookatPosList);
    }
    this.GetCamPosAndRota = function (id) {
      for (let i = 0; i < camPosLookatPosList.length; i++) {
        if (camPosLookatPosList[i].id == id) {
          return camPosLookatPosList[i]._hotPoint.GetCamPosAndRota();
        }
      }
      // 如果在专门的摄像机位置热点中找不到，则从全部热点中的再次查找
      for (let i = 0; i < hotPointJS.length; i++) {
        if (hotPointJS[i].GetId() == id) {
          return hotPointJS[i].GetCamPosAndRota();;
        }
      }
    }

    //#endregion

    //#region 
    //#endregion

    //#region 把添加的模型存到数组中，加载相同模型时，clone现有的
    let loadMesh = [];
    function Destroy_loadMesh() {
      for (let i = loadMesh.length - 1; i >= 0; i--) {
        clearGroupFn(loadMesh[i].mesh);
      }
      loadMesh.splice(0, loadMesh.length);

    }
    this.addLoadMesh = function (path, mesh) {
      for (let i = loadMesh.length - 1; i >= 0; i--) {
        if (loadMesh[i].path == path) {
          return;
        }
      }
      // console.log("添加模型", path, mesh);

      let materials = [];
      if (path.includes(".fbx")) {

        // mesh.traverse(function (item) {
        //   if (item.isMesh) {
        //     materials.push(item.material);
        //   }
        // });

        loadMesh.push({ path: path, mesh: cloneAvatar(mesh, mesh.animations), materials });
      }
      if (path.includes(".gltf") || path.includes(".glb")) {

        // mesh.scene.traverse(function (item) {
        //   if (item.isMesh) {
        //     materials.push(item.material);
        //   }
        // });

        loadMesh.push({ path: path, mesh: cloneAvatar(mesh.scene, mesh.animations), materials });
      }

      // console.log("添加模型 222 ", path, mesh);
      // loadMesh.push({ path: path, mesh: mesh });
    }
    this.checkLoadMesh = function (path) {
      for (let i = loadMesh.length - 1; i >= 0; i--) {
        if (loadMesh[i].path == path) {
          return {
            mesh: loadMesh[i].mesh,
            materials: loadMesh[i].materials,
          }
        }
      }
      // console.log("未找到 copy 模型",path);
      return null;
    }

    this.DirectLoadMesh = function (path, callback) {
      for (let i = loadMesh.length - 1; i >= 0; i--) {
        if (loadMesh[i].path == path) {
          // console.log(" 找到相同模型 ",path);
          if (callback) {
            callback({
              mesh: loadMesh[i].mesh,
              materials: loadMesh[i].materials,
            });
          }
          return;
        }
      }
      let _YJLoadModel = new YJLoadModel(_this, scene);
      // _this.GetPublicUrl() +
      _YJLoadModel.load("", path, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, () => {
          // let model = scope.GetModel();
          // model.visible = false;
          // if (callback) {
          //   callback(model);
          // }
          scope.DirectLoadMesh(path, callback);

        });
    }


    //#endregion

    //#region 把添加的 图片 存到数组中，加载相同模型时，clone现有的
    let loadTexture = [];
    this.addLoadTexture = function (path, texture) {
      for (let i = loadTexture.length - 1; i >= 0; i--) {
        if (loadTexture[i].path == path) {
          return;
        }
      }
      // console.log("添加路径" + path);
      loadTexture.push({ path: path, texture: texture });
    }
    this.checkLoadTexture = function (path) {
      if (path == null || path == undefined) { return null; }
      for (let i = loadTexture.length - 1; i >= 0; i--) {
        if (loadTexture[i].path == path) {
          // console.log(" ==找到 copy 图片 ", path);
          return loadTexture[i].texture;
        }
      }

      let texture = new THREE.TextureLoader().load(path, (texture) => {
        // console.log(" 加载新图片 ", path);
      }, null, () => {
        console.error("图片路径不存在 ======== ", path);
      });
      texture.encoding = 3001; //3000  3001
      this.addLoadTexture(path, texture);
      return texture;
    }
    //#endregion


    //#region needCheck 把添加的模型存到数组中，加载相同模型时，clone现有的
    let loadMesh_needCheck = [];
    this.addLoadMesh_needCheck_begin = function (path) {
      for (let i = loadMesh_needCheck.length - 1; i >= 0; i--) {
        if (loadMesh_needCheck[i].path == path) {
          return;
        }
      }
      // console.log("添加路径" + path);
      loadMesh_needCheck.push({ path: path, done: false, callback: [] });
    }
    this.addLoadMesh_needCheck_done = function (path) {
      for (let i = loadMesh_needCheck.length - 1; i >= 0; i--) {
        if (loadMesh_needCheck[i].path == path) {
          loadMesh_needCheck[i].done = true;

          for (let j = 0; j < loadMesh_needCheck[i].callback.length; j++) {
            loadMesh_needCheck[i].callback[j]();
          }
          return;
        }
      }
    }

    this.checkLoadMesh_needCheck = function (path, callback) {
      for (let i = loadMesh_needCheck.length - 1; i >= 0; i--) {
        if (loadMesh_needCheck[i].path == path) {
          if (loadMesh_needCheck[i].done) {
            if (callback) {
              callback();
            }
            return false;
          } else {
            if (callback) {
              loadMesh_needCheck[i].callback.push(callback);
            }
            return false;
          }
        }
      }
      return null;
    }
    //#endregion

    //#region 加载NPC 
    this.cloneFbx = function(object){
      return cloneAvatar(object,object.animations);
    }
    function cloneAvatar(object, animations) {
      const clone = {
        animations: animations,
        scene: object.clone(true)
      };

      const skinnedMeshes = {};

      object.traverse(node => {
        if (node.isSkinnedMesh) {
          skinnedMeshes[node.name] = node;
        }
      });

      const cloneBones = {};
      const cloneSkinnedMeshes = {};

      clone.scene.traverse(node => {
        if (node.isBone) {
          cloneBones[node.name] = node;
        }

        if (node.isSkinnedMesh) {
          cloneSkinnedMeshes[node.name] = node;
        }
      });

      for (let name in skinnedMeshes) {
        const skinnedMesh = skinnedMeshes[name];
        const skeleton = skinnedMesh.skeleton;
        const cloneSkinnedMesh = cloneSkinnedMeshes[name];

        const orderedCloneBones = [];

        for (let i = 0; i < skeleton.bones.length; ++i) {
          const cloneBone = cloneBones[skeleton.bones[i].name];
          orderedCloneBones.push(cloneBone);
        }

        cloneSkinnedMesh.bind(
          new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
          cloneSkinnedMesh.matrixWorld);
      }

      return clone;
    }
    let npcList = [];
    this.addLoadAvatar_needCheck_begin = function (path) {
      for (let i = npcList.length - 1; i >= 0; i--) {
        if (npcList[i].path == path) {
          return;
        }
      }
      // console.log("添加路径" + path);
      npcList.push({ path: path, done: false, mesh: null, callback: [] });
    }
    this.addLoadAvatar_needCheck_done = function (path, mesh) {
      for (let i = npcList.length - 1; i >= 0; i--) {
        if (npcList[i].path == path) {
          // npcList[i].mesh = (mesh);
          if (path.includes(".fbx")) {
            npcList[i].mesh = cloneAvatar(mesh, mesh.animations);
          }
          if (path.includes(".gltf") || path.includes(".glb")) {
            npcList[i].mesh = cloneAvatar(mesh.scene, mesh.animations);
          }
          npcList[i].done = true;


          for (let j = 0; j < npcList[i].callback.length; j++) {
            npcList[i].callback[j]((npcList[i].mesh));
          }
          npcList[i].callback.splice(0, npcList[i].callback.length);

          return;
        }
      }
    }

    this.checkLoadAvatar_needCheck = function (path, callback) {
      for (let i = npcList.length - 1; i >= 0; i--) {
        if (npcList[i].path == path) {
          if (npcList[i].done) {
            if (callback) {
              callback((npcList[i].mesh));
            }
            return false;
          } else {
            if (callback) {
              npcList[i].callback.push(callback);
            }
            return false;
          }
        }
      }
      return null;
    }


    //#endregion





    //#region 键盘组合键监听
    // 左Shift+T : 设置热点trigger 的显示或隐藏
    let hotPointTriggerVisible = false;
    let colliderVisible = false;
    let colliderMat = null;
    function addListenerCombKey() {
      new YJKeyboard((key) => {
        // console.log("按下按键 ",key);
        if (key == "ShiftLeft+T") {
          hotPointTriggerVisible = !hotPointTriggerVisible;
          for (let i = hotPointJS.length - 1; i >= 0; i--) {
            hotPointJS[i].SetTriggerVisible(hotPointTriggerVisible);
          }
        }
        if (key == "ShiftLeft+C") {
          colliderVisible = !colliderVisible;
          displayColliderFn(colliderVisible);
        }

        // 删除选中的模型
        if (key == "Delete") {
          if (_this.$parent.$parent.DelModel) {
            _this.$parent.$parent.DelModel();
          }
        }
        if (key == "ControlLeft+D") {
          if (_this.$parent.$parent.DuplicateModel) {
            _this.$parent.$parent.DuplicateModel();
          }
        }
        // 取消选中
        if (key == "Escape") {
          if (_this.$parent.$parent.ClickFloor) {
            _this.$parent.$parent.ClickFloor();
          }
        }

        // 打开小地图
        if (key == "KeyM") {
          if (_this.$parent.$parent.$refs.Metaworldmap2d) {
            _this.$parent.$parent.$refs.Metaworldmap2d.Open();
          }
        }
        if (key == "KeyH") {
          if (_this.$parent.$parent.$refs.Metaworldmap2d) {
            _Global.SendMsgTo3D("显示隐藏九宫格");
          }
        }
      });
      window.addEventListener('mousedown', function (event) {
        switch (event.button) {
          //鼠标左键
          case THREE.MOUSE.LEFT:
            break;
          case THREE.MOUSE.MIDDLE:
            break;

          //鼠标右键
          case THREE.MOUSE.RIGHT:
            if (_this.$parent.$parent.ClickFloor) {
              _this.$parent.$parent.ClickFloor();
            }
            break;
        }

      });
    }
    this.displayCollider = function (b) {
      colliderVisible = b;
      displayColliderFn(colliderVisible);
    }
    function displayColliderFn(b) {
      if (colliderMat == null) {
        colliderMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5 });
      }

      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.name.indexOf("collider") > -1) {
            obj.visible = b;
            // obj.material = colliderMat;
          }
        }
      });
    }


    //#endregion

    //#region 把热点脚本添加到数组统一管理。 显示隐藏trigger  
    let hotPointJS = [];
    function Destroy_hotPointJS() {
      for (let i = 0; i < hotPointJS.length; i++) {
        let element = hotPointJS[i];
        element.Destroy();
        element = undefined;
      }
      hotPointJS.splice(0, hotPointJS.length);
      // hotPointJS = [];
    }
    this.addHotPointJS = function (js) {
      hotPointJS.push(js);
    }
    this.SetHitObjDisplay = function (b) {
      for (let i = 0; i < hotPointJS.length; i++) {
        if (hotPointJS[i].GetId().indexOf("jump_") > -1) {
          hotPointJS[i].SetHitObjDisplay(b);
        }
      }
    }
    // 设置显示或隐藏热点
    this.SetPointObjDisplay = function (id, b) {
      for (let i = 0; i < hotPointJS.length; i++) {
        if (hotPointJS[i].GetId() == id) {
          hotPointJS[i].SetPointObjDisplay(b);
          return;
        }
      }
    }

    this.SetPointObjDisplayArray = function (idAndb) {
      for (let i = 0; i < hotPointJS.length; i++) {
        for (let j = 0; j < idAndb.length; j++) {
          const id = idAndb[j].id;
          if (hotPointJS[i].GetId() == id) {
            hotPointJS[i].SetPointObjDisplay(idAndb[j].display);
            continue;
          }
        }
      }
    }

    this.SetVideoLoop = function (id, b) {
      for (let i = 0; i < hotPointJS.length; i++) {
        if (hotPointJS[i].GetId() == id) {
          hotPointJS[i].SetVideoLoop(b);
        }
      }
    }
    this.SetHotPointCtrl = function (id, type, msg) {
      for (let i = 0; i < hotPointJS.length; i++) {
        if (hotPointJS[i].GetType() == type && hotPointJS[i].GetId() == id) {
          hotPointJS[i].SetHotPointCtrl(msg);
        }
      }
    }

    this.SetAllTextHotPoint = function (b, id) {
      if (b) {
        for (let i = 0; i < hotPointJS.length; i++) {
          if (hotPointJS[i].GetId().indexOf("text_") > -1 && hotPointJS[i].GetId() == "text_" + id) {
            hotPointJS[i].SetAllTextHotPoint(true);
            return;
          }
        }
      } else {
        for (let i = 0; i < hotPointJS.length; i++) {
          if (hotPointJS[i].GetId().indexOf("text_") > -1) {
            hotPointJS[i].SetAllTextHotPoint(false);
          }
        }
      }
    }



    //#endregion

    //#region 把 动画模型 添加到数组统一管理。 显示隐藏trigger  
    let animModelJS = [];
    // 
    this.addAnimModelJS = function (fn) {
      animModelJS.push({ id: fn.GetId(), _animModel: fn });
    }
    this.GetAnimModel = function (id) {
      for (let i = 0; i < animModelJS.length; i++) {
        if (animModelJS[i].id == id) {
          return animModelJS[i]._animModel;
        }
      }
      return null;
    }
    this.PlayAnimModel = function (id, animName) {
      for (let i = 0; i < animModelJS.length; i++) {
        if (animModelJS[i].id == id) {
          animModelJS[i]._animModel.PlayAnim(animName);
          return;
        }
      }
    }
    this.PlayAnimModel2 = function (id, animName) {
      for (let i = 0; i < animModelJS.length; i++) {
        if (animModelJS[i].id == id) {
          animModelJS[i]._animModel.PlayAnim2(animName);
          return;
        }
      }
    }

    //#endregion

    // 悬浮物体高亮外轮廓
    this.AddObjToOutLine = function (object) {
    }
    this.RemoveObjToOutLine = function () {
    }


    this.GetNickName = function () {
      return _this.nickName;
    }
    this.GetPlayerPos = function () {
      return _YJAmmo.GetPlayerPos();
    }
    this.GetPlayerPosReduceHeight = function () {
      let pos = _YJAmmo.GetPlayerPos();
      pos.y -= playerHeight / 2;
      return pos;
    }
    this.GetPlayerHeight = function () {
      return playerHeight / 2;
    }
    this.SetOnlyPlayerPos = function (pos) {
      // _YJAmmo.SetOnlyPlayerPos(pos);
    }

    //设置角色朝向目标坐标点
    this.SetPlayerLookatPos = function (playerModel, pos) {
      playerModel.lookAt(pos);
    }
    //设置角色朝向目标坐标点
    this.SetLocalPlayerLookatPos = function (pos) {
      // _YJAmmo.SetPlayerLookatPos(pos);

      // _this.YJController.lookAtPos(pos);
      _this.YJController.lookAtPosInMouseState(pos);
      // _this.YJController.SetPlayerLookatPos(pos);
      // console.log("角色朝向下一个目标点");
    }

    this.SetPlayerPosDirect = function (pos) {
      _YJAmmo.SetJumpOnly(true);
      _YJAmmo.SetGravityActive(false);
      pos.y += playerHeight / 2;
      _YJAmmo.SetPlayerPos(new THREE.Vector3(pos.x, pos.y, pos.z));
    }


    this.SetPlayerPos = function (pos) {
      _YJAmmo.SetJumpOnly(true);
      _YJAmmo.SetGravityActive(false);

      if (setting.firstPerson && setting.firstPerson) {
        pos.y = _YJAmmo.GetPlayerPos().y;
      }
      pos.y += playerHeight / 2;
      // console.log("设置玩家坐标");
      _YJAmmo.SetPlayerPos(new THREE.Vector3(pos.x, pos.y, pos.z));
      setTimeout(() => {
        _YJAmmo.SetJumpOnly(false);
        _YJAmmo.SetGravityActive(true);
      }, 20);
    }

    // 保存threejs中的坐标和旋转，用来直接设置threejs。不需要做坐标旋转转换
    this.SavePlayerPos = function () {
      setting.playerPos = _YJAmmo.GetPlayerPos();
      let rota = _this.YJController.GetAmmoPlayer().rotation;
      setting.playerRotaV3 = { x: rota.x, y: rota.y, z: rota.z };
      setting.cameraOffset.y = getWorldPosition(camera).y - playerPos.y;
      setting.cameraOffset.z = camera.position.x;


      playerPos = setting.playerPos;
      playerSetting.rotaV3 = setting.playerRotaV3;
      // console.log(sceneData); 
    }



    this.VisibleDirectionalLight = function (b) {
      if (_DirectionalLight != null) {
        _DirectionalLight.visible = b;
        sceneData.AmbientLightData.hasDirectionalLight = b;
      }else{
        if(b){
          CreateDirectionalLight(lightData.DirectionalLightPos, lightData.DirectionalLightIntensity);
        }
      }
    }

    // 更新太阳光位置，让角色下面始终有阴影
    function CreateDirectionalLight(pos, intensity) {
      // return;
      if (_DirectionalLight == null) {

        // console.log(" 创建太阳光 ");
        const light = new THREE.DirectionalLight(0xffffff, intensity);

        _DirectionalLight = light;
        light.position.set(pos.x, pos.y, pos.z);
        light.castShadow = true;

        scene.add(light);

        const dLight = 400;
        const sLight = dLight * 0.25;
        light.shadow.camera.left = - sLight;
        light.shadow.camera.right = sLight;
        light.shadow.camera.top = sLight;
        light.shadow.camera.bottom = - sLight;

        light.shadow.camera.near = dLight / 30;
        light.shadow.camera.far = dLight;

        let resourceSize = 256;
        light.shadow.mapSize.x = resourceSize * 4;
        light.shadow.mapSize.y = resourceSize * 4;



        // console.log(light.shadow.camera);

        UpdateDirectionalLight(GetCameraWorldPos());

        // _this.YJController.SetPlayerPosHandler((playerPos) => { 
        //   _DirectionalLight.position.copy(playerPos.clone().add(pos)); 
        //   console.log("角色移动", playerPos);
        // });

        //创建辅助工具
        // let lightHelper = new THREE.DirectionalLightHelper(_DirectionalLight);
        // scene.add(lightHelper);
        // let shadowCameraHelper = new THREE.CameraHelper(_DirectionalLight.shadow.camera);
        // scene.add(shadowCameraHelper);
        // scene.add(new THREE.AxesHelper(20))


        return;


        //显示光照区域
        // var helper = new THREE.CameraHelper(light.shadow.camera );
        // scene.add(helper);
        // scene.add( new THREE.DirectionalLightHelper(light, 0.2) );
        // console.log("创建方向光");

      } else {
        UpdateDirectionalLight(pos, intensity);
      }

    }

    //让灯光跟着角色走
    this.UpdateLightPos = function () {
      UpdateDirectionalLight(GetCameraWorldPos());
    }

    // 只在初始场景或跳转场景时，重新设置方向光target坐标
    function UpdateDirectionalLight(pos, intensity) {
      if (lightTarget == null) {
        lightTarget = new THREE.Group();
        scene.add(lightTarget);
        //必须给方向光设置target，并设置target坐标为角色坐标，才能让方向光始终照射角色产生正确引用
        _DirectionalLight.target = lightTarget;
      }

      if (_DirectionalLight != null) {
        lightTarget.position.copy(pos);
        pos.y += 30
        _DirectionalLight.position.copy(pos);
      }

    }


    this.UpdatePlayerPos = function (pos) {
      // console.log("pos",pos);
      // let pos = MapIdToPos(id);
      if (_this.$parent.$parent.coordinate) {
        pos.x = pos.x.toFixed(1);
        pos.z = pos.z.toFixed(1);
        _this.$parent.$parent.coordinate = pos;
      }
      return;
      // let mesh = _YJAmmo.GetMapIdMesh(id);
      let mesh = _this.YJController.GetYJPlayer().GetAllMesh()[0]

    }
    this.SetCenterPlaneId = function (id) {
      // let pos = GetCameraWorldPos();
      // let pos = this.GetPlayerPos();
      // console.log("pos",pos);
      // let pos = MapIdToPos(id);
      // _this.$parent.$parent.coordinate = pos;
      return;
      // let mesh = _YJAmmo.GetMapIdMesh(id);
      let mesh = _this.YJController.GetYJPlayer().GetAllMesh()[0]

    }


    this.getPlayerDefaultPos = function () {
      return playerSetting;
    }

    let playerPos = null;
    let playerSetting = {
      pos: { x: 0, y: 0, z: 0 },
      rotaV3: { x: 0, y: 0, z: 0 },
    };
    this.SetPlayerPosData = function (pos, rotaV3) {

      playerPos = pos;
      playerSetting.pos = pos;
      playerSetting.rotaV3 = rotaV3;

    }
    this.SetPlayerPosRota = function (pos, rotaV3) {
      this.SetPlayerPos(pos);
      _this.YJController.SetPlayerRota(rotaV3);
    }
    this.SetPlayerPosRota2 = function (pos, rota) {
      this.SetPlayerPos(pos);
      return;
      _this.YJController.SetPlayerRota2(rota);
    }


    this.SetNiaokanPos = (campos) => {
      // if (setting.inMinMapEditor) {
      //   campos.y += 50;//return;
      // }

      let pos = new THREE.Vector3(campos.x, campos.y, campos.z);
      _this.YJController.SetNiaokanPos(
        pos
      );
    }
    this.SetNiaokanLookatPos = (camlookatpos) => {
      // if(setting.inMinMapEditor){return;}
      let pos = new THREE.Vector3(camlookatpos.x, camlookatpos.y, camlookatpos.z);
      _this.YJController.SetNiaokanLookatPos(
        pos
      );
    }

    this.SetAmmoEnabled = function (e) {
      _YJAmmo.SetEnabled(e);
    }


    this.AddProcess = function () {
      currentLoadCount++;
      _this.$parent.LoadingProcess(parseInt(currentLoadCount * 1.000 / needLoadCount * 100));
      if (currentLoadCount >= needLoadCount) {
        this.LoadDone();
      }
      // console.log(currentLoadCount + "/" + needLoadCount);
    }
    this.LoadDone = function () {
      console.error(" 加载场景完成 ！！ ");

      _this.$parent.LoadingProcess(100);

      _this.GeneratePlayer(() => {
        CreateSingleScene();
      });
    }


    this.GetListener = function () {
      return listener;
    }

    let audio3d = null;
    this.Set3DAudio = function (_audio3d) {
      audio3d = _audio3d;
    }
    this.Set3DAudioPlay = function (b) {
      if (audio3d == null) { return; }
      audio3d.play(b);
    }
    this.Set3DAudioLoad = function (audioPath) {
      if (audio3d == null) { return; }
      audio3d.load(audioPath);
    }
    //#region 在其他脚本中添加的热点，添加到此脚本的lookatList中，让热点始终面向摄像机

    // 在其他脚本中添加的热点，添加到此脚本的lookatList中，让热点始终面向摄像机
    this.AddLookatHotPoint = function (obj,data) {
      for (let i = lookatList.length - 1; i >= 0; i--) {
        if (lookatList[i] == obj) {
          console.log(" 重复添加 ",data);
          return;
        }
      }
      lookatList.push(obj);
    }
    this.RemoveLookatHotPoint = function (obj) {
      for (let i = lookatList.length - 1; i >= 0; i--) {
        if (lookatList[i] == obj) {
          lookatList.splice(i, 1);
          return;
        }
      }
    }

    //添加序列帧热点，让热点有动效
    let animHotPointList = [];
    this.AddAnimHotPoint = function (obj) {
      animHotPointList.push(obj);
    }

    let animHotPointList2 = [];
    this.AddAnimHotPoint2 = function (obj) {
      animHotPointList2.push(obj);
    }


    this.AddHotPoint = function (obj) {
      lookatList.push(obj);
    }
    this.RemoveHotPoint = function (obj) {
      for (let i = lookatList.length - 1; i >= 0; i--) {
        if (lookatList[i] == obj) {
          lookatList.splice(i, 1);
          return;
        }
      }
    }

    // 添加/删除可点击的模型
    this.AddCanHitModel = function (obj) {
      if (obj == null) {
        console.log("注意！ 添加的点击物体为空物体");
        return;
      }
      // 防止添加两次
      for (let i = _this.canHitModelList.length - 1; i >= 0; i--) {
        if (_this.canHitModelList[i] == obj) {
          // console.error(" 重复添加 hit ",obj.name);
          return;
        }
      }
      _this.canHitModelList.push(obj);
    }
    this.RemoveCanHitModel = function (obj) {
      for (let i = _this.canHitModelList.length - 1; i >= 0; i--) {
        if (_this.canHitModelList[i] == obj) {
          _this.canHitModelList.splice(i, 1);
          return;
        }
      }
    }
    //#endregion

    //#region 
    //#endregion

    //#region 九宫格地图 、加载模型、 同步模型


    //#region 元宇宙开放世界加载。
    this.LoadMetaWorld = function () {
      _this.GeneratePlayer(() => {
        this.SetDisplayFloor(false);
        CreateSingleScene();
      });
    }
    //#endregion

    let playerInMap = "";

    //向服务器请求模型，服务器返回在地图id中的模型
    this.GetPlayerInMap = function (mapIdArray) {
      playerInMap = "";
      for (let ii = 0; ii < mapIdArray.length; ii++) {
        playerInMap += mapIdArray[ii].id + "|";
      }
      // console.log(" 请求 服务器模型 " + playerInMap);
      // _this._YJDyncManager.SendUpdateMap(playerInMap);

    }

    async function loadAssset(path, callback) {
      const res = await _this.$axios.get(path);
      if (callback) {
        callback(res.data);
      }
    }
    this.LoadAssset = function (path, callback) {
      loadAssset(path, callback);
    }

    this.CreateSceneByMapid = (id, data) => {
      _YJLoadUserModelManager.AddLoadMetaWorldSceneModel(id, data);
    }
    this.RmoveSceneByMapid = (id) => {
      _YJLoadUserModelManager.RemoveMetaWorldSceneModel(id);
    }

    // let mapSize = 40;
    let mapSize = _Global.MetaworldSize;
    this.CallMapIdToPos = function (id) {
      return MapIdToPos(id);
    }


    function posToMapId(id) {
      let sp = id.split('-');
      let x = parseInt(sp[0]);
      let y = 0;
      let z = parseInt(sp[2]);

      x = (x - 10000) * mapSize;
      z = (z - 10000) * mapSize;
      // console.log("添加地面碰撞坐标 ", x, z);
      // console.log("添加地面碰撞坐标 ", id);
      return { x: x, y: 0, z: z };
    }

    function MapIdToPos(id) {
      let sp = id.split('-');
      let x = parseInt(sp[0]);
      let y = 0;
      let z = parseInt(sp[2]);

      x = (x - 10000) * mapSize;
      z = (z - 10000) * mapSize;
      // console.log("添加地面碰撞坐标 ", x, z);
      // console.log("添加地面碰撞坐标 ", id);
      return { x: x, y: 0, z: z };
    }

    this.AddAmmoPlane = function (id) {
      // return;
      _YJAmmo.AddAmmoPlane(id, MapIdToPos(id));

    }
    this.RemoveAmmoPlane = function (id) {
      // console.log("删除地面碰撞坐标 ",id);
      _YJAmmo.RemoveAmmoPlane(id);

      this.RemoveMapById(id); //删除该地块上的加载的模型
    }

    //地图九宫格，通过地图id，加载地图上的模型
    //使用地图id，从服务器获取该地图id包含的模型
    this.CreateMapByIdFromServer = function (sceneModelsDataList) {
      // console.log("从服务器获取到模型 ", sceneModelsDataList);
      // 使用error log 可追踪调用路径
      // console.error("从服务器获取到模型 ", sceneModelsDataList);
      return;
      // 剔除场景中已存在的模型
      for (let i = sceneModelsDataList.length - 1; i >= 0; i--) {
        const sceneState = sceneModelsDataList[i];
        for (let ii = 0; ii < _this.sceneModels.length; ii++) {
          var sceneModel = _this.sceneModels[ii];
          if (sceneModel.id == sceneState.id) {
            sceneModelsDataList.splice(i, 1);
          }
        }
      }
      // console.log(" 剔除场景中已存在的模型后  ", sceneModelsDataList);

      for (let i = 0; i < sceneModelsDataList.length; i++) {
        const sceneState = sceneModelsDataList[i];
        this.AddOrDelModel({ id: sceneState.id, isAdd: "添加", modelData: sceneState.modelData, state: sceneState.state });
      }
    }

    //地图九宫格，通过地图id，删除地图上的模型
    this.RemoveMapById = function (_mapId) {
      return;
      for (let i = _this.sceneModels.length - 1; i >= 0; i--) {
        var sceneModel = _this.sceneModels[i];
        if (sceneModel.mapId == _mapId) {
          // console.log("删除模型" + sceneModel.name);
          sceneModel.model.Destroy();
          _this.sceneModels.splice(i, 1);
          continue;
        }
      }
    }



    let currentCreateModel = null;
    let currentCreateModelId = null;
    let currentCreateModelPath = null;
    let currentCreateModelName = "";
    let currentCreateModelImg = "";
    let currentCreateModelType = "";
    let currentCreateModelAssetId = "";


    let needLoadCount = 0;
    let currentLoadCount = 0;
    // 客户端同步生成模型
    function CreateSelectModel(id, modelData, state) {


      // for (let i = 0; i < _this.sceneModels.length; i++) {
      //   var sceneModel = _this.sceneModels[i];
      //   if (sceneModel.id == id) {
      //     return;
      //   }
      // }

      // console.log(" 需要创建的模型数量为 ",needLoadCount);
      // console.log("同步创建场景物体", id, modelData, state);

      let modelName = modelData.modelName;
      let modelPath = modelData.modelPath;
      let modelType = modelData.modelType;

      let assetId = modelData.assetId;

      let _pos = modelData.pos;
      let _rotaV3 = modelData.rotaV3;
      let _size = modelData.size;

      let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
      let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);
      let size = new THREE.Vector3(_size.x, _size.y, _size.z);
      //  pos =new THREE.Vector3(0,0,0); 
      //  rotaV3 =new THREE.Vector3(0,0,0); 
      let model = null;
      if (modelName == "digger") {

      } else
        if (modelName == "door") {
        }
        else
          if (modelName == "ppt") {

          }
          else
            if (modelName == "mmd") {

            } else {

              model = new YJLoadModel(
                _this,
                scene,
                id,
                _this.GetPublicUrl() + modelPath,
                pos,
                rotaV3,
                size,
                modelName, true
              )
            }


      _this.sceneModels.push({
        mapId: modelData.mapId,
        id: id,
        modelPath: modelPath,
        modelImg: modelData.img,
        modelType: modelType,
        userId: modelData.userId,
        assetId: assetId,
        name: modelName,
        model: model,
        state: state,
      });

      // console.log("同步创建场景物体  完成 ",id,modelData,state);

    }



    function ModelPathToModelImg(modelPath) {
      let sp = modelPath.split("/");
      let img = "";
      for (let i = 0; i < sp.length - 1; i++) {
        const element = sp[i];
        img += element + "/";
      }
      img += sp[sp.length - 2] + "_thrumb.png";
      return img;
    }
    // 保存用户创建的模型单个数据
    function SaveModelData(modelData) {
      modelData.id = modelData.modelId;
      // modelData.img = ModelPathToModelImg(modelData.modelPath);


      let s = JSON.stringify(modelData);
      console.log("保存用户创建模型 ", modelData);
      _this.$uploadFile(
        _this.$stringtoBlob(s, "test"),
        "C:/wamp/www/vue/yjwebgame/public/" + "userCreateModel",
        modelData.modelId + "_modelData.txt",
        (url) => {
          //先记录旧照片
          // console.log(" 保存成功 ", url);
        }
      );
    }


    //#endregion


    this.CallPosToMapId = function (pos) {
      return posToMapId(pos);
    }
    function posToMapId(pos) {

      let halfSize = mapSize / 2;
      let x, y, z;
      let x1, y1, z1;
      if (pos.x < 0) {
        x1 = pos.x - halfSize;
        x = Math.ceil(x1 / mapSize) + 10000;
      } else {
        x1 = pos.x + halfSize;
        x = Math.floor(x1 / mapSize) + 10000;
      }
      // let y = Math.floor(pos.y/mapSize)+10000 ;
      y = 10000;
      if (pos.z < 0) {
        z1 = pos.z - halfSize;
        z = Math.ceil(z1 / mapSize) + 10000;
      } else {
        z1 = pos.z + halfSize;
        z = Math.floor(z1 / mapSize) + 10000;
      }
      let mapId = x + "-" + y + "-" + z;
      return mapId;
    }

    //#endregion


    //#region 调用 生成碰撞体
    this.CreateModelTrigger = function (size, pos, quat, id, triggerName) {
      return _YJAmmo.createBoxTrigger(size, pos, quat, id, triggerName);
    }
    this.createBoxTrigger2 = function (mesh, size, id, triggerName, owner) {
      return _YJAmmo.createBoxTrigger2(mesh, size, id, triggerName, owner);
    }
    this.CreateCylinderTrigger = function (mesh, size, id, triggerName, owner) {
      return _YJAmmo.createCylinderTrigger(mesh, size, id, triggerName, owner);
    }
    this.CreateModelMeshCollider = function (mesh, size, pos, quat) {
      _YJAmmo.createMeshTrigger(mesh, size, pos, quat);
    }
    // 创建凹包网格碰撞
    this.CreateTriangeMeshCollider = function (mesh, size, pos, quat) {
      _YJAmmo.CreateTriangeMeshCollider(mesh, size, pos, quat);
    }
    // 创建凹包网格 trigger
    this.CreateTriangeMeshTrigger = function (mesh, size, id, triggerName, owner, pos, quat) {
      _YJAmmo.CreateTriangeMeshTrigger(mesh, size, id, triggerName, owner, pos, quat);
    }
    this.RemoveCollider = function (mesh) {
      _YJAmmo.removeRigidBody(mesh);
    }
    //#endregion


    //#region 碰到交互区域，显示交互按钮提示，3秒后自动消失
    // 碰到交互区域，显示交互按钮提示，3秒后自动消失
    var inJiaohuArea = false;
    var laterJiaohu = null;
    var modelId = "";
    var triggerName = "";
    var triggerModel = null;
    this.ChangeJiaohuArea = function (b, id, name, trigger) {

      if (_this.$parent.$parent.SetTriggerOverlap) {
        _this.$parent.$parent.SetTriggerOverlap(b, id, trigger.owner);
      }

      if (b == false) {
        if (laterJiaohu != null) { clearTimeout(laterJiaohu); laterJiaohu = null; }
        inJiaohuArea = b;

        if ((trigger.owner != null || trigger.owner != undefined) && trigger.owner.SetOverlapPlayer) {
          trigger.owner.SetOverlapPlayer(null);
          return;
        }

        if (triggerName == "npc") {
          OverlapNpc(id, null);
          return;
        }

        if ((trigger.owner != null || trigger.owner != undefined)) {
          //向主页面发送进入trigger区域
          if (_this.$parent.$parent.TriggerModel) {
            _this.$parent.$parent.TriggerModel(null);
          }
          return;
        }
        _this.ChangeTip(false);
        return;
      }
      modelId = id;
      triggerName = name;
      inJiaohuArea = b;
      triggerModel = trigger;

      // console.log("in trigger ", modelId, triggerName, triggerModel);

      if (triggerName == "npc") {
        OverlapNpc(id, _this.YJController.GetPlayer());
        return;
      }

      if ((trigger.owner != null || trigger.owner != undefined) && trigger.owner.SetOverlapPlayer) {
        // console.log("进入 triggerModel.owner ");
        trigger.owner.SetOverlapPlayer(_this.YJController.GetPlayer());

        //向主页面发送进入trigger区域
        if (_this.$parent.$parent.EnterTriggerArea) {
          _this.$parent.$parent.EnterTriggerArea(trigger.owner.GetId());
        }
        return;
      }

      if ((trigger.owner != null || trigger.owner != undefined)) {
        //向主页面发送进入trigger区域
        if (_this.$parent.$parent.TriggerModel) {
          _this.$parent.$parent.TriggerModel(trigger.owner);
        }
        return;
      }



      _this.ChangeTip(inJiaohuArea);
      if (inJiaohuArea) {
        if (laterJiaohu != null) { clearTimeout(laterJiaohu); laterJiaohu = null; }
        laterJiaohu = setTimeout(() => {
          _this.ChangeTip(false);
        }, 3000);
      }
    }
    // 在npc有效区域内
    function OverlapNpc(modelId, player) {
      for (let i = 0; i < _this.sceneModels.length; i++) {
        var sceneModel = _this.sceneModels[i];
        if (sceneModel.id == modelId) {
          sceneModel.model.SetOverlapPlayer(player);
          continue;
        }
      }
    }
    //点击界面按钮 或 按F键交互可交互的物体，比如开关门
    this.ClickInteractive = function () {
      if (inJiaohuArea) {
        for (let i = 0; i < _this.sceneModels.length; i++) {
          var sceneModel = _this.sceneModels[i];
          if (sceneModel.id == modelId) {
            if (triggerName == "door") {
              sceneModel.model.PlayAnim();
            }
            if (triggerName == "digger") {
              //打开挖掘机控制界面，并且把当前碰到的挖掘机发送给控制界面
              _this.$parent.SetDigger(sceneModel.model);
              //设置视角为挖掘机控制的最佳视角
              _this.YJController.SetToOtherPos(getWorldPosition(triggerModel), -20);
              // _this.YJController.SetToOtherPos((triggerModel.matrix), -20);
              console.log("碰到 digger 查询其动画 ");

            }
            continue;
          }
        }
        _this.ChangeTip(false);
      }
    }

    let oldHoverObj = null;
    this.HoverObject = function (hoverObject, hoverPoint) {
      if (hoverObject != null) {
        hoverObject.owner.SetMouseHover(true);
        oldHoverObj = hoverObject;
      } else {
        if (oldHoverObj == null) { return; }
        oldHoverObj.owner.SetMouseHover(false);
        oldHoverObj = null;
      }
    }

    //通过模型的包裹盒计算模型的世界坐标
    this.GetWorldCenterPosition = (object) => {
      // return getWorldPosition(object);
      //通过模型的包裹盒计算模型的世界坐标
      var centroid = new THREE.Vector3();
      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          //获取模型的世界坐标
          var geometry = item.geometry;
          geometry.computeBoundingBox();
          centroid.addVectors(geometry.boundingBox.min, geometry.boundingBox.max);
          centroid.multiplyScalar(0.5);
          centroid.applyMatrix4(item.matrixWorld);
        }
      });
      return centroid;
    }
    this.GetWorldPosition = (object) => {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }

    let dracoLoader = null;
    this.GetDracoLoader = function () {
      if (dracoLoader == null) {
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./public/threeJS/draco/gltf/');
        dracoLoader.setDecoderConfig({ type: "js" });
        dracoLoader.preload();
      }
      return dracoLoader;
    }
    //#endregion


    //#region 
    //#endregion

    //#region 杂

    //右手坐标系转左手坐标系。unity坐标系转threeJS坐标系
    function RotaV3ToRota(v3) {
      //右手坐标系转左手坐标系。unity坐标系转threeJS坐标系
      let pq = new THREE.Quaternion(v3.x * -1, v3.y * 1, v3.z * 1, v3.w * -1);
      let pv = new THREE.Euler();
      pv.setFromQuaternion(pq);
      pv.y += Math.PI; // Y is 180 degrees off
      pv.z *= -1; // flip Z
      pv.y += Math.PI / 2; // 再旋转90度，保持与unity中Z轴朝向相同
      return pv;
    }

    function CreateTestBox() {

      let cubeGeometry = new THREE.SphereGeometry(1, 50, 50);
      // let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      // let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
      let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.1,
        metalness: 0,
      });

      // let cubeMaterial = new THREE.MeshPhysicalMaterial({
      //   color: 0xeeeeee,
      //   roughness: 0, 
      //   metalness: 0,
      //   transmission: 1,
      // });


      cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      scene.add(cube);
      cube.position.set(0, 5, 0);



      // mirror sphere cube-camera
      // const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
      // mirrorSphereCamera = new THREE.CubeCamera(0.05, 50, cubeRenderTarget);
      // scene.add(mirrorSphereCamera);
      // const mirrorSphereMaterial = new THREE.MeshBasicMaterial({ envMap: cubeRenderTarget.texture });
      // cube.material = mirrorSphereMaterial;



      // return cube;
    }
    this.MoveToCameraForwardPos = function () {

    }

    // MoveToCameraForwardPosFn(cube,camera,5); 
    //distance 距离
    function MoveToCameraForwardPosFn(model, camera, distance) {
      console.log(" 把模型放到摄像机 水平方向的 正前方");

      let pos = camera.getWorldPosition(new THREE.Vector3());
      let currentRota = camera.getWorldQuaternion(new THREE.Quaternion());
      model.quaternion.rotateTowards(currentRota, 10);
      model.position.set(pos.x, pos.y, pos.z);
      model.translateZ(-2);
      model.position.setY(pos.y);
      model.lookAt(pos);

      model.position.set(pos.x, pos.y, pos.z);
      model.translateZ(-distance);

    }

    function CreateQQ() {
      let planeGeometry = new THREE.PlaneGeometry(0.3, 0.5, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshLambertMaterial({
        transparent: true,
        color: 0xffffff,
      }); // 材质
      const map = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + "images/new_spotd06/player/Model/qq.png"
      );
      planeMaterial.map = map;
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.rotation.y = -0.5 * Math.PI;
      plane.rotation.z = -0.5 * Math.PI;
      plane.position.x = 10;
      plane.position.y = 0.3;
      plane.position.z = -5;
      plane.receiveShadow = true;
      plane.name = "qq";
      plane.lookAt(0, 0, 0);
      scene.add(plane); // 向该场景中添加物体
      _this.pointsParent.add(plane);
      _this.lookatList.push(plane);
    }


    function CreateFloorCollider(name) {
      // 坐标轴
      // let axes = new THREE.AxesHelper(20); // 坐标轴
      // this.scene.add(axes); // 场景添加坐标轴

      let planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10); // 生成平面
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 }); // 材质
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;
      plane.receiveShadow = true;
      plane.name = name;
      // scene.add(plane); // 向该场景中添加物体
      modelParent.add(plane);

      return plane;
    }


    function CreateTestPlane() {
      // 坐标轴
      // let axes = new THREE.AxesHelper(20); // 坐标轴
      // this.scene.add(axes); // 场景添加坐标轴

      let planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 }); // 材质
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 0;
      plane.position.y = 0;
      plane.position.z = 0;
      plane.receiveShadow = true;
      plane.name = "floor";
      scene.add(plane); // 向该场景中添加物体
      _this.pointsParent.add(plane);

      let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = 0;
      cube.position.y = 1;
      cube.position.z = 0;
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.name = "测试 box";
      scene.add(cube);
    }



    //创建视频
    function CreateVideoPlane() {

      // const base = `<div id="${
      //   "remote_stream-" + streamId
      // }" style="${videoStyle} " ></div>`;
      let videoId = "sdfsdfsdf";
      let videoSrc = "video/1.mp4";
      const base = `<video id="${videoId
        }" src="${videoSrc}" ></video>`;

      _this.videoList.push({ id: videoId, html: base });

      // const audioFile = '/video/bg.wav';
      // const audioFile = "/video/bg.ogg";
      const audioParams = { delayTime: (160 * 1) / 30 };

      _this.$nextTick(function () {
        const video = document.getElementById(videoId);
        video.play();

        let w = 7.1;
        let h = 4;
        let planeGeometry = new THREE.PlaneGeometry(w, h, 1, 1); // 生成平面
        const texture = new THREE.VideoTexture(video);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        // material.side = THREE.DoubleSide;
        let plane = new THREE.Mesh(planeGeometry, material);
        // plane.rotation.x = -0.5 * Math.PI;
        plane.rotation.y = Math.PI + Math.PI;

        plane.position.x = 7.5;
        plane.position.y = 4;
        plane.position.z = -17.3;
        plane.receiveShadow = true;
        plane.name = "video";

        // create the PositionalAudio object (passing in the listener)
        // const sound = new THREE.PositionalAudio(listener);
        // //音频有效区域
        // sound.setDirectionalCone(180, 230, 0.1);
        // const audioLoader = new THREE.AudioLoader().load(
        //   audioFile,
        //   function (buffer) {
        //     sound.setBuffer(buffer);
        //     sound.setRefDistance(1);
        //     sound.setLoop(true);
        //     sound.play();
        //   }
        // );
        // plane.add(sound);

        // const audioElement = document.getElementById("music");
        // audioElement.play();
        // const positionalAudio = new THREE.PositionalAudio(listener);
        // positionalAudio.setMediaElementSource(audioElement);
        // positionalAudio.setRefDistance(2);
        // positionalAudio.setDirectionalCone(180, 230, 0.1);

        // const helper = new PositionalAudioHelper(positionalAudio, 0.1);
        // positionalAudio.add(helper);
        // plane.add(positionalAudio);

        scene.add(plane); // 向该场景中添加物体
      });

      _this.$nextTick(function () {

      });
    }

    //#endregion

    this.AddNeedUpdateJS = function (js) {
      for (let i = 0; i < needUpdateJS.length; i++) {
        const element = needUpdateJS[i];
        if (element == js) { return; }

      }
      needUpdateJS.push(js);
    }
    this.RemoveNeedUpdateJS = function (js) {
      for (let i = needUpdateJS.length - 1; i >= 0; i--) {
        const element = needUpdateJS[i];
        if (element == js) {
          needUpdateJS.splice(i, 1);
          return;
        }
      }
    }

    //实时刷新
    this.update = function () {

      // return;
      updatelookatList();
      // UpdateProjectionUI();
      for (let i = 0; i < needUpdateJS.length; i++) {
        needUpdateJS[i]._update();
      }

      if (mirrorSphereCamera) {
        cube.getWorldPosition(mirrorSphereCamera.position);
        mirrorSphereCamera.update(renderer, scene);
      }

      return;
    }
    function GetCameraWorldPos() {
      if (platform == "pcweb") {
        return _this.YJController.GetCameraWorldPos();
      }
      if (platform == "vr") {
        return _this.YJVRController.GetCameraWorldPos();
      }
    }
    this.GetCameraWorldPoss = function () {
      return GetCameraWorldPos();
    }


    this.SetHotPointImgCount = function (e, s) {
      defaultOffsetX = 1 / e;
      speed = s;
    }
    this.SetHotPointImgCount2 = function (e, s) {
      defaultOffsetX2 = 1 / e;
      speed2 = s;
    }

    var defaultOffsetX = 1 / 36;
    var defaultOffsetX2 = 1 / 27;

    var loadTexDeltaTime = 0;//gif图片的加载时的计次，相当于Time.deltaTime;
    let speed = 2;
    let speed2 = 2;
    function updatelookatList() {


      loadTexDeltaTime++;

      //热点实时面向摄像机
      for (var i = 0; i < lookatList.length; i++) {
        lookatList[i].lookAt(GetCameraWorldPos());
      }

      for (var i = 0; i < animHotPointList.length; i++) {
        var texture = animHotPointList[i].material.map;
        texture.matrix
          .identity()
          .scale(defaultOffsetX, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
          .translate(defaultOffsetX * parseInt(loadTexDeltaTime / speed), 0);   //每次平移量为1/17
      }

      for (var i = 0; i < animHotPointList2.length; i++) {
        var texture = animHotPointList2[i].material.map;
        texture.matrix
          .identity()
          .scale(defaultOffsetX2, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
          .translate(defaultOffsetX2 * parseInt(loadTexDeltaTime / speed2), 0);   //每次平移量为1/17
      }
    }

    Init();

  }
}

export { YJSceneManager };