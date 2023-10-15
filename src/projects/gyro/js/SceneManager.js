



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";

import { YJCameraImage } from "/@/threeJS/YJCameraImage.js";

import { YJTransform } from "/@/threeJS/YJTransform.js";
import { YJMeshRenderer } from "/@/threeJS/loader/YJMeshRenderer.js";
import { YJAnimator } from "/@/threeJS/loader/YJAnimator.js";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';

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
    }

    this.ClickModel = (hitObject) => {
      console.log(" 点击模型 ", hitObject);


    }
    let texData = [];
    // texData.push({ id: "003", texPath: "moreStickers/素材3.png", size: { w: 536, h: 201 }, scale: 1,  renderOrder: 1 });

    // texData.push({ id: "007", texPath: "moreStickers/素材2.png", size: { w: 456, h: 464 }, scale: -1,  renderOrder: -1 });
    // texData.push({ id: "008", texPath: "moreStickers/素材2.png", size: { w: 456, h: 464 }, scale: -1, renderOrder: -1 });
    // texData.push({ id: "002", texPath: "moreStickers/素材2.png", size: { w: 456, h: 464 }, scale: 1, renderOrder: -1 });

    // texData.push({ id: "006", texPath: "moreStickers/素材1.png", size: { w: 394, h: 576 }, scale: -1,  renderOrder: 1 });
    // texData.push({ id: "005", texPath: "moreStickers/素材1.png", size: { w: 394, h: 576 }, scale: -1,  renderOrder: 1 });
    // texData.push({ id: "004", texPath: "moreStickers/素材1.png", size: { w: 394, h: 576 }, scale: 1, renderOrder: 1 });
    // texData.push({ id: "001", texPath: "moreStickers/素材1.png", size: { w: 394, h: 576 }, scale: 1,  renderOrder: 1 });

    // texData.push({ id: "010_1", texPath: "moreStickers/气泡.png", size: { w: 59, h: 59 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "010_2", texPath: "moreStickers/气泡.png", size: { w: 59, h: 59 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "010_3", texPath: "moreStickers/气泡.png", size: { w: 59, h: 59 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "010_4", texPath: "moreStickers/气泡.png", size: { w: 59, h: 59 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "010_5", texPath: "moreStickers/气泡.png", size: { w: 59, h: 59 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "010_6", texPath: "moreStickers/气泡.png", size: { w: 59, h: 59 }, scale: 1,  renderOrder: 1 });

    // texData.push({ id: "011_1", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "011_2", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "011_3", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "011_4", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "011_5", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "011_6", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "011_7", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });
    // texData.push({ id: "011_8", texPath: "moreStickers/盐.png", size: { w: 76, h: 68 }, scale: 1,  renderOrder: 1 });

    // texData.push({ id: "camilo", texPath: "moreStickers/balloon.png", size: { w: 300, h: 449 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/basket.png", size: { w: 400, h: 246 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/plants.png", size: { w: 400, h: 248 } });

    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (4).png", size: { w: 98, h: 183 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (5).png", size: { w: 168, h: 226 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (6).png", size: { w: 163, h: 163 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (7).png", size: { w: 245, h: 212 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (8).png", size: { w: 182, h: 183 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (9).png", size: { w: 163, h: 271 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (10).png", size: { w: 305, h: 130 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (11).png", size: { w: 83, h: 183 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (12).png", size: { w: 166, h: 140 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (13).png", size: { w: 268, h: 231 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (14).png", size: { w: 258, h: 267 } });

    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (15).png", size: { w: 207, h: 239 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (16).png", size: { w: 177, h: 199 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (17).png", size: { w: 225, h: 420 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (18).png", size: { w: 171, h: 332 } });

    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (19).png", size: { w: 241, h: 228 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (20).png", size: { w: 511, h: 253 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (21).png", size: { w: 236, h: 156 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (22).png", size: { w: 114, h: 269 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (23).png", size: { w: 221, h: 279 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (24).png", size: { w: 179, h: 184 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (25).png", size: { w: 330, h: 413 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (26).png", size: { w: 211, h: 211 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (27).png", size: { w: 136, h: 143 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (28).png", size: { w: 164, h: 163 } });

    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (29).png", size: { w: 144, h: 212 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (30).png", size: { w: 172, h: 306 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (31).png", size: { w: 217, h: 249 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (32).png", size: { w: 172, h: 306 } });
    // texData.push({ id: "camilo", texPath: "moreStickers/MicrosoftTeams-image (33).png", size: { w: 217, h: 249 } });


    this.SetTriggerOverlap = (b, id, owner) => {
      console.log(b, id, owner);


    }


    let sceneName = "";

    let allDyncModel = [];

    let exrCubeRenderTarget;


    this.ChangeScene = function (e) {



      let _YJLoadModel = new YJLoadModel(_this, modelParent);


      // 图片放在三维空间
      LoadPosParent(_YJLoadModel, () => {

        // 图片放在全景图上，加载全景图
        Load_highMesh360Ball(_YJLoadModel, () => {

        });
      });



    }
    function Load_highMesh360Ball(_YJLoadModel, callback) {
      tempV3.set(0, 0, 0);
      let modelPath = _this.GetPublicUrl() + "models/Scene/highMesh360Ball.gltf";
      _YJLoadModel.load("highMesh360Ball", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          model.traverse((obj) => {
            if (obj.isMesh) {
              // let mat = new THREE.MeshBasicMaterial({
              //   color: 0xffffff,
              //   transparent: true,
              //   opacity:1,
              //   // map: _this._YJSceneManager.checkLoadTexture(_this.GetPublicUrl() + "images/" + texItem.texPath),
              // }); 
              // obj.material = mat;
              obj.visible = true;
              obj.renderOrder = 0;
            }
          });

          if (callback) {
            callback();
          }

        });
    }

    function GetTexItem(objName) {
      for (let i = 0; i < texData.length; i++) {
        const element = texData[i];
        if (objName.includes(element.id)) {
          return element;
        }
      }
      console.log(" 不在数据中 ",objName);
    }
    function generateRandomInt(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }
    // 星星位置、可乐瓶位置、卡车位置、可乐罐子位置
    function LoadPosParent(_YJLoadModel, callback) {
      tempV3.set(0, 0, 0);
      let scaleTemp = 0.05 * 0.4;
      let modelPath = _this.GetPublicUrl() + "models/Scene/posParent.gltf";
      _YJLoadModel.load("posParent", modelPath, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();
          let carNumId = 0;
          console.log("model ", model);
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.visible = false;
              let objName = obj.name;
              if (carNumId < texData.length) {
                let texItem = GetTexItem(objName);

                obj.scale.set(texItem.size.w * scaleTemp * texItem.scale, texItem.size.h * scaleTemp, scaleTemp);
                // let mat = new THREE.MeshBasicMaterial({
                //   color: 0xffffff,
                //   transparent: true,
                //   opacity: 1,
                //   depthTest: false,
                //   // alphaTest:0.5,
                //   map: _this._YJSceneManager.checkLoadTexture(_this.GetPublicUrl() + "images/" + texItem.texPath),
                // });

                obj.lookAt(tempV3);
                // obj.rotateY(Math.PI); 
                // obj.material = mat;
                obj.material.transparent = true;
                // obj.material.depthTest = false;

                obj.visible = true;
                obj.renderOrder = texItem.renderOrder;
                // if (carNumId == 0 || carNumId == 4) {
                //   let dy = obj.position.clone().y;
                //   let time = 0;
                //   setInterval(() => {
                //     time += 0.05;
                //     obj.position.y = dy + Math.sin(time) * 0.6;
                //   }, 20);
                // }
                
                if(objName.includes("010")){
                  //气泡 放大缩小动画

                  let time = 0;
                  let speed = generateRandomInt(3,5) * 0.003; //浮动速度
                  let length = generateRandomInt(4,8) * 0.3  //浮动距离
                  setInterval(() => {
                    time += speed;
                    obj.scale.x = obj.scale.y = 0.5 + Math.abs(Math.sin(time) * length) ;
                  }, 20);
                }else if(objName.includes("011")){
                  //盐 左右来回旋转
                   
                  let time = 0;
                  let speed = generateRandomInt(3,5) * 0.01; //浮动速度
                  let length = generateRandomInt(4,8) * 0.2  //浮动距离
                  setInterval(() => {
                    time += speed;
                    obj.rotation.z = Math.sin(time) * length;
                  }, 20);

                }else{

                  let dy = obj.position.clone().y;
                  let time = 0;
                  let speed = generateRandomInt(3,5) * 0.01; //浮动速度
                  let length = generateRandomInt(4,8) * 0.2  //浮动距离
                  setInterval(() => {
                    time += speed;
                    obj.position.y = dy + Math.sin(time) * length;
                  }, 20);

                }
                // _this._YJSceneManager.AddHotPoint(obj);
              }

              carNumId++;

            }
          });

          if (callback) {
            callback();
          }

          // console.log(allDyncModel);


        });
    }


    let tempPath = "";
    let tempV3 = new THREE.Vector3(0, 0, 0);
    let tempRotaV3 = new THREE.Vector3(0, 0, 0);
    let tempScaleV3 = new THREE.Vector3(1, 1, 1);



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




    function TweenRota(model, from, to, duration, callback) {

      let current = from.clone();
      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.rotation.set(current.x, current.y, current.z);
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
    }
    function TweenPos(model, from, to, duration, callback) {
      let current = from.clone();
      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.position.set(current.x, current.y, current.z);
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
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


    this._update = function () {
      // console.log(" update scene manager ");
      TWEEN.update();

    }


    InitFn();
  }
}

export { SceneManager };