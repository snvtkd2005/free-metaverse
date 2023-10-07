



import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { YJAnimModel } from "./YJAnimModel";
import { YJBillboard } from "./YJBillboard";
import { YJHotPoint } from "./YJHotPoint";
import { YJ3DAudio } from "./YJ3DAudio";
import { YJLight } from "./YJLight";
import { YJUVanim } from "./YJUVanim";
import { YJUVanim2 } from "./YJUVanim2";
import { YJLoadModel } from "./YJLoadModel";

import TWEEN from '@tweenjs/tween.js';

// 加载静态物体
class YJLoadOtherModelManager_MOT {
  constructor(_this, mainPanel) {
    let scope = this;
    let scene;
    function loadGltf(name, modelPath, pos, rota, size, createCollider) {

      let group = new THREE.Group();
      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath('/js/draco/gltf/');
      // dracoLoader.setDecoderConfig({type:"js"});
      // dracoLoader.preload();
      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {

        let model = gltf.scene;
        model.name = name;

        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);
        model.scale.set(size.x, size.y, size.z);


        group.add(model);
        scene.add(group);


      }, undefined, function (e) {

        console.log("加载模型出错" + modelPath);
        console.error(e);
      });

    }

    let tweenList = [];

    let domElement = _this.renderer.domElement;

    let game001;

    let starting = false;

    let lightGroup = null;
    function Init() {

      scene = _this.scene;
      // 创建闪烁的星星
      CreateStar();
      CreateGame();



      CreateLightRota();


      // let modelPath = _this.GetPublicUrl() + "models/Scene/rukoudeng.gltf";

      // let _YJLoadModel = new YJLoadModel(_this, scene, "id", modelPath, pos, rotaV3, size, "rukoudeng",
      //   false, () => {
      //     setTimeout(() => {
      //       let model = _YJLoadModel.GetModel();
      //       console.log(model);
      //       model.traverse(function (item) {
      //         if (item instanceof THREE.Mesh) {
      //           item.layers.enable(1);
      //           item.material.emissiveIntensity =10; 

      //         }
      //       });
      

      //     }, 100);
      //   });

      // let pos = new THREE.Vector3(0,0,0);
      // let rotaV3 = new THREE.Vector3(0,0,0);
      // let size = new THREE.Vector3(1,1,1);


      // let path =  _this.GetPublicUrl() + "models/Scene/starAnim/xingkong.gltf";
      // console.log(" 加载额外模型路径为 " + path);
      // loadGltf( "", path, pos, rotaV3, size);
      // loadGltf(modelName, _this.GetPublicUrl() + modelPath, pos, rotaV3, size, true);

    }
    let ligthRotaSpeed = 0.04;
    function CreateLightRota(){

      let pos = new THREE.Vector3(0, 1.87, 38.3);
      // let pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, -Math.PI, 0);
      let size = new THREE.Vector3(1, 1, 1);
      // console.log(" modelpath = " + modelPath);


      lightGroup = new THREE.Group();
      scene.add(lightGroup);
      lightGroup.position.set( pos.x,pos.y,pos.z );

      const light = new THREE.PointLight( 0xffff00, 30, 0.55 );
      lightGroup.add( light );
      light.position.set( 0, 0.25, 0 );

            // let axes = new THREE.AxesHelper(5); // 坐标轴
            // light.add(axes); // 场景添加坐标轴
      // console.log("创建点光源",light);

    }

    function CreateGame() {



      let pos = new THREE.Vector3(0.2, 0, -13.51);
      // let pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, -Math.PI, 0);
      let size = new THREE.Vector3(1, 1, 1);
      // console.log(" modelpath = " + modelPath);


      let modelPath = _this.GetPublicUrl() + "models/Scene/game001.gltf";

      let _YJLoadModel = new YJLoadModel(_this, scene, "id", modelPath, pos, rotaV3, size, "modelName",
        false, () => {
          setTimeout(() => {
            let model = _YJLoadModel.GetModel();
            // console.log(model);

            game001 = LoopFindChild("group", model);

            // let axes = new THREE.AxesHelper(5); // 坐标轴
            // game001.add(axes); // 场景添加坐标轴

            // 改为假随机，防止出现直接成功的概率
            let array = [0.2,0.3,0.4,0.5,0.55,0.7,0.8,0.9,0.75,0.65,0.45];
            let xRandom = Math.floor(Math.random()*10) ;
            let yRandom = Math.floor(Math.random()*10) ;

            game001.rotation.set(array[xRandom] * 6.28, array[yRandom] * 6.28, 0);
            // console.log(" game001 = ", game001);

          }, 100);
        });

    }

    let mouseX, mouseY, mouseXold, mouseYold = 0;
    let canRota = false;

    function onMouseDown(event) {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseXold = mouseX;
      mouseYold = mouseY;
      event.preventDefault();
      canRota = true;
      GameStart();
    }
    function onMouseMove(event) {
      if (!canRota) { return; }
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      var x = mouseX - mouseXold;
      var y = mouseY - mouseYold;
      event.preventDefault();

      game001.rotation.x += y;
      game001.rotation.y += x;

      mouseXold = mouseX;
      mouseYold = mouseY;

    }
    function onMouseUp(event) {
      event.preventDefault();
      canRota = false;
    }



    function onTouchStart(event) {
      canRota = true;
      console.log("开始游戏");
      GameStart();

    }

    function GameStart() {
      if (starting) { return; }
      starting = true;
      mainPanel.SendInterface("游戏开始");
    }
    function GameEnd() {
      canRota = false;
      starting = false;
      mainPanel.SendInterface("游戏完成");
    }


    let doonce = 0;
    // 强制横屏
    var forcedLandscape = false;
    // var forcedLandscape = true;
    this.SetforcedLandscape = function (b) {
      forcedLandscape = b;
    }
    function onTouchMove(event) {
      if (!canRota) { return; }

      var touch = event.touches[0];

      if (doonce < 1) {

        mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
        mouseXold = mouseX;
        mouseYold = mouseY;
        doonce++;
      }

      mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
      var x = mouseX - mouseXold;
      var y = mouseY - mouseYold;

      if (forcedLandscape) {
        let xx = x;
        x = -y;
        y = xx;
      }

      game001.rotation.x += y;
      game001.rotation.y += x;


      mouseXold = mouseX;
      mouseYold = mouseY;

    }
    function onTouchEnd(event) {
      event.preventDefault();
      canRota = false;
      doonce = 0;
    }
    this.BeginGame = function () {
      addEventListener();
      completedDonce = 0;
      starting = false;
    }

    let addListener = false;
    this.CloseGame = function () {
      removeEventListener();
    }
    function addEventListener() {
      if(addListener){return;}
      addListener = true;
      domElement.addEventListener('mousemove', onMouseMove);
      domElement.addEventListener('mousedown', onMouseDown);
      domElement.addEventListener('mouseup', onMouseUp);

      domElement.addEventListener('touchmove', onTouchMove);
      domElement.addEventListener('touchstart', onTouchStart);
      domElement.addEventListener('touchend', onTouchEnd);
    }
    function removeEventListener() {
      if(!addListener){return;}
      addListener = false;

      domElement.removeEventListener('mousemove', onMouseMove,false);
      domElement.removeEventListener('mousedown', onMouseDown,false);
      domElement.removeEventListener('mouseup', onMouseUp,false);
      domElement.removeEventListener('touchmove', onTouchMove,false);
      domElement.removeEventListener('touchstart', onTouchStart,false);
      domElement.removeEventListener('touchend', onTouchEnd,false);
    }

    // 在父物体中查找指定命名的子物体
    function LoopFindChild(childName, parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if (cn[0] == childName) {
          return c;
        }
        if (cn[1] == childName) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindChild(childName, c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }

    // 创建闪烁的星星
    function CreateStar() {

      const map1 = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + "img/star1.png"
      );
      const map2 = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + "img/star2.png"
      );

      const map3 = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + "img/star3.png"
      );

      let planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1); // 生成平面

      let planeMaterial = new THREE.MeshBasicMaterial({
        // alphaTest:true,
        transparent: true,
        color: 0xffffff,
        map: map1,
        emissiveMap: map1,
      }); // 材质

      // console.log(planeMaterial);
      let planeMaterial2 = new THREE.MeshBasicMaterial({
        // alphaTest:true,
        transparent: true,
        color: 0xffffff,
        map: map2,
        emissiveMap: map2,
      }); // 材质


      let planeMaterial3 = new THREE.MeshBasicMaterial({
        // alphaTest:true,
        transparent: true,
        color: 0xffffff,
        map: map3,
        emissiveMap: map3,
      }); // 材质

      let materials = [planeMaterial, planeMaterial2, planeMaterial3];


      // planeMaterial.map = map;

      // let col = 2;
      // let row = 2;
      let col = 15;
      let row = 10;

      for (let j = 0; j < col; j++) {

        for (let i = 0; i < row; i++) {
          // let plane = new THREE.Mesh(planeGeometry, planeMaterial);

          let matIndex = 0;
          let mr = Math.random();
          if (mr < 0.3) { matIndex = 0; }
          if (mr >= 0.3 && mr < 0.7) { matIndex = 1; }
          if (mr >= 0.7) { matIndex = 2; }
          let plane = new THREE.Mesh(planeGeometry, materials[matIndex].clone());

          let group = new THREE.Group();
          scene.add(group);

          group.add(plane);
          let d = Math.random();
          let h = Math.random();
          plane.position.set(0, 3 + 5 * h * j, 50 + d * 5);
          let size = 1 + d * 3;
          plane.scale.set(size, size, size);
          plane.lookAt(new THREE.Vector3(0, 0, 0));
          group.rotation.set(0, 0.628 * Math.random() * (i + 1) * (j + 1), 0);


          let start = Math.random();
          tweenList.push({ mesh: plane, start: 0, current: 0, dire: 1, speed: 0.03 * Math.random(), delay: 100 * Math.random(), currentDelay: 0 });
        }

      }

      _this._YJSceneManager.AddNeedUpdateJS(scope);
    }


    Init();
    let time;

    let shuThreshold = 0.1;
    let hengThreshold = 0.1;
    let completedDonce = 1;
    this._update = function () {
      time++;
      for (let i = 0; i < tweenList.length; i++) {
        const item = tweenList[i];
        item.currentDelay++;
        if (item.currentDelay >= item.delay) {


          if (item.current >= 1) {
            item.current = 1;
            item.dire = -1;
          }
          if (item.current <= item.start) {
            item.current = item.start;
            item.dire = 1;
          }
          // console.log(" in tween list " + i+" " + item.current);
          item.current += item.dire * item.speed;

          item.mesh.material.opacity = item.current;
        }


      }

      // if(game001){
      //   console.log(game001.rotation.x + "  " + game001.rotation.y);
      // }

      if (completedDonce < 1) {
        if (game001) {
          // game001.rotation.x += 0.01; 
          // game001.rotation.y += 0.01; 

          //判断是否完成
          let shuValue = Math.abs(game001.rotation.x % 6.28);
          let hengValue = Math.abs(game001.rotation.y % 3.14);

          let oldRZ = game001.getWorldDirection(new THREE.Vector3()).clone().z;

          if ((shuValue - 0) <= shuThreshold || Math.abs(shuValue - 6.28) <= shuThreshold) {
            if ((hengValue - 0) <= hengThreshold || Math.abs(hengValue - 3.14) <= hengThreshold) {
              if (oldRZ > 0) {
                console.log(" 游戏完成 ！！！ ");
                GameEnd();
                completedDonce++;
              }
            }
          }
          // console.log(shuValue + "  " + hengValue);
        }
      }

      if(lightGroup){
        lightGroup.rotation.z += ligthRotaSpeed; 
      }

    }
  }
}

export { YJLoadOtherModelManager_MOT };