



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";

import { YJTransform } from "/@/threeJS/YJTransform.js";
import { YJMeshRenderer } from "/@/threeJS/components/YJMeshRenderer.js"; 
import { YJRigidbodyOverlep } from "/@/threeJS/YJRigidbodyOverlep.js";

class SceneManager {
  constructor(scene, renderer, camera, _this, modelParent, indexVue, callback) {
    let scope = this;
    let _YJRigidbodyOverlep = null;
    this.Init = function () {
      InitFn();
    }


    function InitFn() {

      // _YJGlobal._SceneManager = scope;

      if (callback) {
        callback();
      }
      _this._YJSceneManager.AddNeedUpdateJS(scope);

      //关闭控制器：不可操作旋转视角、移动等
      // _this.YJController.SetEnabled(false);



    }

    //底线trigger. 实时设置底线trigger的位置为上一个落下的物体的坐标（高度）
    let downLineTrigger = null;


    // 物体落下后是否锁定  
    let isLockDown = true;

    this.ClickModel = (hitObject) => {
      console.log(" 点击模型 ", hitObject);

    }

    let material = null;

    let readyBox = null;
    let size = 0.2;

    let boxItem = null;
    let gaojiaobeismall = null;
    let colliderScale = 0.8;

    let needHeight = 0;

    let canDownMesh = [];
    canDownMesh.push({ modelName: "shoubiao", group: null, sizeScale: 0.755, height: 0.46 });
    canDownMesh.push({ modelName: "dangao", group: null, sizeScale: 0.755, height: 0.41 });
    canDownMesh.push({ modelName: "zhuanshi", group: null, sizeScale: 0.755, height: 0.41 });
    canDownMesh.push({ modelName: "pingzi001", group: null, sizeScale: 0.755, height: 0.41 });
    canDownMesh.push({ modelName: "gaojiaobei", group: null, sizeScale: 0.755, height: 0.46 });
    canDownMesh.push({ modelName: "bao001", group: null, sizeScale: 0.755, height: 0.46 });
    canDownMesh.push({ modelName: "kouhong", group: null, sizeScale: 0.755, height: 0.46 });
    canDownMesh.push({ modelName: "hezi", group: null, sizeScale: 0.755, height: 0.46 });
    canDownMesh.push({ modelName: "lihe", group: null, sizeScale: 0.755, height: 0.46 });
    canDownMesh.push({ modelName: "box002", group: null, sizeScale: 0.755, height: 0.46 });
    canDownMesh.push({ modelName: "car", group: null, sizeScale: 0.755, height: 0.46 });
    function GetCanDownMeshItem(objName, group) {
      for (let i = 0; i < canDownMesh.length; i++) {
        const element = canDownMesh[i];
        if (objName.includes(element.modelName)) {
          element.group = group;
          return element.height;
        }
      }
    }

    let tempPos = new THREE.Vector3();

    this.ChangeScene = function (e) {
      // return;

      let modelPath = e.modelPath;
      let npcTexPath = e.npcTexPath;

      if (modelPath.includes("Scene")) {
        console.log("加载 扩展场景 222222222");
        // let modelPath = "models/Scene/dfsColliderParent.gltf";
        // let modelPath = "models/Scene/gaojiaobeibox.gltf";
        // let modelPath = "models/Scene/gaojiaobeiboxsmall.gltf";
        // let modelPath = "models/Scene/gaojiaobei.gltf";
        // let modelPath = "models/Scene/jengaItem.gltf";


        let _YJLoadModel = new YJLoadModel(_this, modelParent);

        Load_allCollider(_YJLoadModel, () => {
          CreateReadybox();
        })


        CreatePlanebox();

        _this._YJSceneManager.GetAmmo().SetGravityActive(false);


        // _this._YJSceneManager.CreateGeomotryRigidbody(readyBox, 1);

        // let boxes;
        // let size = 0.2;
        // const geometryBox = new THREE.BoxGeometry(size, size, size);
        // boxes = new THREE.Mesh(geometryBox, material);
        // boxes.castShadow = true;
        // boxes.receiveShadow = true;
        // modelParent.add(boxes);
        // boxes.position.set(0, 1, 2.1);
        // _this._YJSceneManager.CreateGeomotryRigidbody(boxes, 1);


        // 底部失败线检测
        _YJRigidbodyOverlep = new YJRigidbodyOverlep(_this, (scope) => {
          scope.StopCheck();
          console.error(" 游戏失败 ");
          inFailed = true;
          indexVue.Failed();
        });

        // 创建 底线 trigger

        let mat = new THREE.MeshLambertMaterial({ color: 0xffff00, transparent: true, opacity: 0.0 });
        downLineTrigger = new THREE.Mesh(
          new THREE.BoxGeometry(2, 0.01, 0.2),
          mat
        );
        downLineTrigger.position.set(0, -0.5, 2.1);
        _this._YJSceneManager.GetAmmo().CreateTriangeMeshTrigger(downLineTrigger);
        modelParent.add(downLineTrigger);
        return;

        let scale = 1 * 0.5;
        let wallMat = new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        let wall = new THREE.Mesh(
          new THREE.BoxGeometry(5, 2, 2),
          wallMat
        );
        modelParent.add(wall);
        wall.position.set(0, 1, 2 + 1 + 0.2);
        _this._YJSceneManager.CreateGeomotryRigidbody(wall, 0);
        // _this._YJSceneManager.CreateTriangeMeshCollider(wall, new THREE.Vector3(scale, scale, scale));

        wall = new THREE.Mesh(
          new THREE.BoxGeometry(5, 2, 2),
          wallMat
        );
        modelParent.add(wall);
        wall.position.set(0, 1, 2 - 1);
        _this._YJSceneManager.CreateGeomotryRigidbody(wall, 0);

        // _this._YJSceneManager.CreateTriangeMeshCollider(wall, new THREE.Vector3(scale, scale, scale));

        console.log("wall ", wall);

      }

    }


    let transMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });

    function Load_allCollider(_YJLoadModel, callback) {
      let modelPath = "models/Scene/dfsColliderParent.gltf";

      _YJLoadModel.load("dfsColliderParent", _this.GetPublicUrl() + modelPath, new THREE.Vector3(0, 1, 2), new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1), false, null, (scope) => {
          let model = scope.GetModel();

          let meshes = [];
          model.traverse((obj) => {
            if (obj.isMesh) {
              // material = obj.material;
              // console.log(" 异形mesh ", obj);
              meshes.push(obj);
              // obj.castShadow = true;
              // obj.receiveShadow = true;
              obj.visible = false;
              obj.material = transMat;
            }
          });

          let loadCompletedCount = 0;
          console.log("初始化dfs模型 ", meshes.length, canDownMesh.length);
          for (let i = 0; i < meshes.length; i++) {
            const obj = meshes[i];
            let group = new THREE.Group();
            modelParent.add(group);
            group.add(obj);

            let height = GetCanDownMeshItem(obj.name, group);

            let objName = canDownMesh[i].modelName;
            LoadSingleModel("models/Scene/" + objName + ".gltf", objName, (model) => {
              obj.add(model);
              model.scale.set(1 / obj.scale.x, 1 / obj.scale.y, 1 / obj.scale.z);
              loadCompletedCount++;
              //dfs物品加载完成后，再回调
              if (loadCompletedCount >= canDownMesh.length) {
                if (callback) {
                  callback();
                }
              }
            });



            // let sizeScale = 0.755;
            // if (obj.name.includes("gaojiaobeibox")) {
            //   canDownMesh.push({ modelName: "gaojiaobeibox", group: group, sizeScale: sizeScale, height: 0.46 });
            // }
            // if (obj.name.includes("bao001")) {
            //   canDownMesh.push({ modelName: "bao001", group: group, sizeScale: sizeScale, height: 0.41 });
            // }
            // if (obj.name.includes("bao002")) {
            //   canDownMesh.push({ modelName: "bao002", group: group, sizeScale: sizeScale, height: 0.41 });
            // }
            // if (obj.name.includes("cup001")) {
            //   canDownMesh.push({ modelName: "cup001", group: group, sizeScale: sizeScale, height: 0.46 });
            // }
            // if (obj.name.includes("box001")) {
            //   canDownMesh.push({ modelName: "box001", group: group, sizeScale: 0.5, height: 0.2 });
            // }
          }
          // if (callback) {
          //   callback();
          // }

        });


    }


    let tempPath = "";
    function LoadSingleModel(path, name, callback) {

      tempPath = _this.GetPublicUrl() + path;
      let object = new YJTransform(_this, modelParent, "", null, null, name);
      let MeshRenderer = new YJMeshRenderer(_this, object.GetGroup(), object);
      object.AddComponent("MeshRenderer", MeshRenderer);
      MeshRenderer.load(tempPath, (scope) => {
        if (callback) {
          callback(scope.GetModel());
        }
      });

      return object;
    }
    // 重新开始，清除模型和刚体
    this.Restart = function () {
      for (let i = 0; i < allBox.length; i++) {
        _this._YJSceneManager.GetAmmo().removeRigidBody(allBox[i]);
        _this._YJSceneManager.clearObject(allBox[i]);

      }
      allBox.splice(0, allBox.length);
      allBoxColliderSize.splice(0, allBoxColliderSize.length);

      failDonce = 0;
      needHeight = 0.1;
      offsetY = 1.3;
      if (pingpangTween != null) {
        pingpangTween.stop();
      }
      if (startTween != null) {
        startTween.stop();
      }
      yoyoObj(readyBox);



      tempPos.set(0, 1, 0);
      _this._YJSceneManager.GetAmmo().SetPlayerPos(tempPos);
      _this._YJSceneManager.GetAmmo().SetGravityActive(true);
      setTimeout(() => {
        _this._YJSceneManager.GetAmmo().SetGravityActive(false);
      }, 2000);


      tempPos.set(0, -1, 2.1);
      _this._YJSceneManager.GetAmmo().SetPhysicBodyPos(downLineTrigger.userData.physicsBody, tempPos);

      inFailed = false;

    }

    let getLayerCount = false;
    let inTriangeMesh = false;

    let tempScaleV3 = new THREE.Vector3(0, 0, 0);
    //上一个创建模型的高度。 用来控制视角上移高度、左右滑动模型的高度
    let lastHeight = 0.2;
    this.PicDown = function (callback) {
      if (readyBox == null) {
        return;
      }
      // console.log(" 放下 ！！ ");
      getLayerCount = false;
      if (pingpangTween != null) {
        pingpangTween.stop();
      }
      if (startTween != null) {
        startTween.stop();
      }

      readyBox.castShadow = true;
      readyBox.receiveShadow = true;


      _YJRigidbodyOverlep.StopCheck();

      // _this._YJSceneManager.CreateGeomotryRigidbody(readyBox, 1);

      if (inTriangeMesh) {
        let scale = canDownMesh[currentIndex].sizeScale;
        // _this._YJSceneManager.GetAmmo().CreateTriangeMeshRigidbody(readyBox, new THREE.Vector3(scale, scale, scale));
        tempScaleV3.set(readyBox.scale.x * scale, readyBox.scale.y * scale, readyBox.scale.z * scale);

        _this._YJSceneManager.GetAmmo().CreateMeshRigidbody(readyBox, tempScaleV3, 5);
      } else {
        let scale = 0.2;
        // _this._YJSceneManager.GetAmmo().CreateBoxGeometryRigidbody(readyBox, scale, scale, scale);
        _this._YJSceneManager.GetAmmo().CreateMeshRigidbody(readyBox, new THREE.Vector3(scale, scale, scale), 5);
      }





      allBox.push(readyBox);
      if (inTriangeMesh) {
        allBoxColliderSize.push({ modelName: canDownMesh[currentIndex].modelName, sizeScale: canDownMesh[currentIndex].sizeScale, height: canDownMesh[currentIndex].height });
      } else {
        allBoxColliderSize.push({ modelName: "box", sizeScale: 0.5, height: 0.2 });
      }




      readyBox = null;
      setTimeout(() => {
        needHeight += lastHeight;
        CameraUp(lastHeight);
        CreateReadybox();
        getLayerCount = true;
        if (callback) {
          callback();
        }



        if (allBox.length == 1) { return }
        if (allBoxColliderSize.length == 1) { return }

        // 在物体落下后，清除其碰撞，再创建其刚体。目的是减少抖动
        let scale = allBoxColliderSize[allBoxColliderSize.length - 1].sizeScale;
        // _this._YJSceneManager.GetAmmo().removeRigidBody(allBox[allBox.length - 1]);
        // _this._YJSceneManager.GetAmmo().CreateMeshRigidbody(allBox[allBox.length - 1], new THREE.Vector3(scale, scale, scale), 5);
        let lastBoxScale = allBox[allBox.length - 1].scale;
        tempScaleV3.set(lastBoxScale.x * scale, lastBoxScale.y * scale, lastBoxScale.z * scale);

        setTimeout(() => {
          if (inFailed) { return; }
          if (allBox.length <= 1) { return }
          _this._YJSceneManager.GetAmmo().CreateTriangeMeshCollider(allBox[allBox.length - 1], tempScaleV3);
          setTimeout(() => {
            if (inFailed) { return; }
            if (allBox.length <= 1) { return }
            _this._YJSceneManager.GetAmmo().removeRigidBody(allBox[allBox.length - 1]);
            _this._YJSceneManager.GetAmmo().CreateMeshRigidbody(allBox[allBox.length - 1], tempScaleV3, 5);
            _YJRigidbodyOverlep.SetRigidBody(allBox[allBox.length - 1].userData.physicsBody);
          }, 100);
        }, 200);

      }, 500);

      if (isLockDown) {
        if (allBox.length >= 2) {


          // 设置失败检测线到倒数第二个模型位置
          setTimeout(() => {
            if (inFailed) { return; }
            tempPos = allBox[allBox.length - 2].position.clone();
            tempPos.y -= allBoxColliderSize[allBoxColliderSize.length - 2].height / 2;
            _this._YJSceneManager.GetAmmo().SetPhysicBodyPos(downLineTrigger.userData.physicsBody, tempPos);
          }, 200);


          // 固定倒数第二个模型，把其变为碰撞体，让其不能动
          setTimeout(() => {
            if (inFailed) { return; }
            let scale = allBoxColliderSize[allBoxColliderSize.length - 2].sizeScale;
            _this._YJSceneManager.GetAmmo().CreateTriangeMeshCollider(allBox[allBox.length - 2], new THREE.Vector3(scale, scale, scale));
          }, 600);
        }
      }
    }
    function generateRandomInt(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }


    let offsetY = 1.3;
    let offsetZ = 2.1;
    let allBox = [];
    let allBoxColliderSize = [];
    let allBoxHeight = [];
    let matrix = new THREE.Matrix4();


    // 视图移动上移
    function CameraUp(upSpeed) {
      if (needHeight < 0.6) { return; }
      offsetY = highestPos + 1.3 - 0.6;
      // offsetY = needHeight + 1.3 - 0.6;
      // _this._YJSceneManager.GetAmmo().SetSpeedData({ upSpeed: upSpeed * 10 });
      // _this._YJSceneManager.GetAmmo().SetJumpFly();

      let pos = _this._YJSceneManager.GetAmmo().GetPlayerPos();
      // pos.y = needHeight;


      let fromPos = pos.clone();

      pos.y = highestPos;
      // pos.y = needHeight;
      let toPos = pos.clone();
      TweenVector3(fromPos, toPos, 500, (currentPos) => {
        _this._YJSceneManager.GetAmmo().SetPlayerPos(currentPos);
      });

    }


    function CreatePlanebox() {

      // 生成随机颜色的box
      let material = new THREE.MeshLambertMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
      let radius = 0.4;
      let height = 0.1;
      // let geometryBox = new THREE.CylinderGeometry(radius, radius, height, 32,1);
      // let dipan = new THREE.Mesh(geometryBox, material);

      let sizeZ = 0.28;
      let geometryBox = new THREE.BoxGeometry(1, height, sizeZ);
      let dipan = new THREE.Mesh(geometryBox, material);
      modelParent.add(dipan);
      dipan.position.set(0, height / 2, 2.1);
      _this._YJSceneManager.GetAmmo().CreateBoxGeometryRigidbody(dipan, 1, height, sizeZ, 0);

      needHeight += 0.1;

    }


    function generateRandomInt(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }


    let currentIndex = 0;

    function CreateReadybox() {

      // let i = generateRandomInt(0, 1);
      let i = 1;
      if (i == 1) {
        inTriangeMesh = true;
        currentIndex = generateRandomInt(0, canDownMesh.length - 1);
        readyBox = canDownMesh[currentIndex].group.clone().children[0];

        let material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        material.color.setHex(0xffffff * Math.random());
        readyBox.material = material;

        readyBox.material = transMat;
        readyBox.visible = true;
        modelParent.add(readyBox);

        // readyBox.position.set(0, offsetY, offsetZ);
        // 

        lastHeight = canDownMesh[currentIndex].height;
        yoyoObj(readyBox);
        return;
      }
      inTriangeMesh = false;
      lastHeight = 0.2;
      // 生成随机颜色的box
      let material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      material.color.setHex(0xffffff * Math.random());

      let geometryBox = new THREE.BoxGeometry(size, size, size);

      readyBox = new THREE.Mesh(geometryBox, material);
      modelParent.add(readyBox);


      // console.log("readyBox ", readyBox);
      readyBox.position.set(0, offsetY, offsetZ);
      // 左右移动
      yoyoObj(readyBox);
    }

    let speed = 2;

    this.ChangeSpeed = (f) => {
      console.log("切换左右速度", f);
      speed = f;
    }

    // 左右偏移距离
    let offsetX = 0.3;
    function yoyoObj(readyBox) {
      if (readyBox == null) { return; }
      let randomNum = generateRandomInt(0, 1);

      let startX = Math.random() * offsetX * (randomNum > 0 ? 1 : -1);
      readyBox.position.set(startX, offsetY, offsetZ);

      let fromPos = readyBox.position.clone();

      let x = randomNum > 0 ? offsetX : -offsetX;
      let toPos = new THREE.Vector3(x, offsetY, offsetZ);


      // console.log("开始位置 ", startX, startX / (offsetY));

      // 1000 * speed
      // 随机向左或向右移动，然后再来回移动
      startTween = TweenPos(readyBox, fromPos, toPos, (1 - Math.abs(startX / (offsetY))) * 1000 * speed, () => {
        fromPos = new THREE.Vector3(x, offsetY, offsetZ);
        toPos = new THREE.Vector3(x * -1, offsetY, offsetZ);
        TweenPosPingpang(readyBox, fromPos, toPos, 2000 * speed);
      });
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
    let startTween = null;
    function TweenPos(model, from, to, duration, callback) {
      let current = from.clone();
      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
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
      return movingTween;
    }

    function TweenVector3(from, to, duration, update, complete) {
      let current = from.clone();
      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      let updateTargetPos = () => {
        if (update) {
          update(current);
        }
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (complete) {
          complete();
        }
      });
      return movingTween;
    }

    let pingpangTween = null;
    function TweenPosPingpang(model, from, to, duration, callback) {
      let current = from.clone();
      // pingpangTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      pingpangTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      let updateTargetPos = () => {
        model.position.set(current.x, current.y, current.z);
      }
      pingpangTween.yoyo(true);
      pingpangTween.repeat(Infinity);
      pingpangTween.onUpdate(updateTargetPos);
      pingpangTween.start() // 启动动画
      pingpangTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
    }

   



    let highestPos = 0.46;
    let layerCount = 0;
    let upDonce = 0;
    let failDonce = 0;
    let playerY = 1;
    let inFailed = false;
    this._update = function () {
      // console.log(" update scene manager ");
      TWEEN.update();

      if (inFailed) { return; }
      if (allBox.length > 0) {
        highestPos = 0;
        for (let i = 0; i < allBox.length; i++) {
          if (highestPos < allBox[i].position.y) {
            highestPos = allBox[i].position.y;
          }
          if (i >= 1) {

            if (allBox[i].position.y < allBox[i - 1].position.y) {
              if (failDonce < 1) {
                console.error(" 游戏失败 ");
                inFailed = true;
                indexVue.Failed();
                failDonce++;
              }
            }

          }
        }



        highestPos += allBoxColliderSize[allBoxColliderSize.length - 1].height / 2;
        // layerCount = Math.floor(highestPos / size) + 1;

        if (getLayerCount) {
          // indexVue.layerCount = layerCount;
          indexVue.layerCount = Math.floor(highestPos * 10);
          // indexVue.layerCount = allBox.length;



          if (!indexVue.inTimes && highestPos + 0.1 < needHeight) {
            // if (failDonce < 1) {
            //   console.error(" 游戏失败 ");
            //   inFailed = true;
            //   indexVue.Failed();
            //   failDonce++;
            // }
          }
        }

        // console.log("叠叠乐 层数 ", layerCount);
        // console.log("叠叠乐最高点 ", highestPos, " 应该高度 ", needHeight);
      }

    }


    InitFn();
  }
}

export { SceneManager };