import * as THREE from "three";
import { Camera, Uniform } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJAnimatorMMD } from "./components/YJAnimatorMMD";

class YJLoadAvatar {
  constructor(_this, scene, _modelPath, animationData, owner, controllerCallback, missAnimCallback) {

    let scope = this;

    let loadCompleted = false;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var mixer = null;//声明一个混合器变量

    let actions = [];
    let settings;

    var playerObj = null;
    this.GetPlayerObj = function () {
      return playerObj;
    }
    let mmdCtrl = null;
    var modelPath;
    //初始化摄像机父物体，移动时，移动父物体， 旋转时，横向旋转父物体，竖向旋转摄像机
    const Init = () => {
      settings = {
        'show model': true,
        'show skeleton': false,
        'modify step size': 0.05,

        'use default duration': true,
        'set custom duration': 3.5,

        'modify idle weight': 1.0,
        'modify idle scale': 1,

        'modify walk weight': 0.0,
        'modify walk scale': 1,

        'modify jump weight': 0.0,
        'modify jump scale': 1,

        'modify run weight': 0.0,
        'modify run scale': 1,

        'modify floating weight': 0.0,
        'modify floating scale': 1,


        'modify time scale': 1.0
      };

      // console.log(owner);
      modelPath = _modelPath;
      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      if (modelPath.indexOf(".pmx") > -1) {
        type = "mmd";
      }

      if (type == "fbx") {
        loadFbx(animationData, controllerCallback);
      }
      if (type == "gltf") {
        loadGltf(animationData, controllerCallback);
      }
      console.log("加载角色模型 ", modelPath, animationData);

      if (type == "mmd") {
        playerObj = new THREE.Group();
        mmdCtrl = new YJAnimatorMMD(playerObj, modelPath, owner);

        if (controllerCallback) {
          controllerCallback(playerObj);
        }
      }
    }

    //加载热点的obj 模型
    const loadFbx = (animData, callback) => {

      let mesh = null;

      if (_this._YJSceneManager) {
        mesh = _this._YJSceneManager.checkLoadAvatar_needCheck(modelPath, (mesh) => {
          // loadFbxFn(animData, callback, false);

          if (playerObj != undefined && playerObj != null) { return; }
          copyloadFbxFn(animData, callback, mesh);
          // console.log("========= 加载角色 copy =======", mesh);
        });
      }

      if (mesh != null) {
        if (mesh == false) {
          // console.log("=========正在加载角色基础 copy 等待加载完成   =======");
        } else {
        }
        return;
      }

      if (_this._YJSceneManager) {
        _this._YJSceneManager.addLoadAvatar_needCheck_begin(modelPath);
      }
      loadFbxFn(animData, callback, true);
      // console.log("=========加载角色 基础 =======");


    }

    // this.GetBone = function (boneName) {
    //   playerObj.traverse(function (item) {
    //     if (item instanceof THREE.Bone) {
    //       if (item.name == boneName) {
    //         return item;
    //       }
    //     }
    //   });
    //   return null;
    // }
    function loadFbxFn(animData, callback, needCheck) {
      var fbxLoader = new FBXLoader();
      fbxLoader.load(modelPath,
        function (object) {
          // console.log("=========加载角色  object =======", object);

          playerObj = object;
          playerObj.name = "player";
          playerObj.tag = "player";
          for (let i = playerObj.animations.length - 1; i >= 0; i--) {
            const element = playerObj.animations[i];
            if (element.tracks.length == 0) {
              playerObj.animations.splice(i, 1);
            }
          }
          // console.log("加载到的 角色模型", modelPath, playerObj);

          if (needCheck) {
            if (_this._YJSceneManager) {
              _this._YJSceneManager.addLoadAvatar_needCheck_done(modelPath, object);
            }
          }



          playerObj.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              // item.receiveShadow = true;
              item.tag = "player";
              item.owner = owner;
            }

            if (item instanceof THREE.SkinnedMesh) {
              item.castShadow = true;
              // item.receiveShadow = true;
              item.tag = "player";
              item.owner = owner;
            }

          });
          // scene.add(playerObj); 

          playerObj.position.set(0, 0, 0); //原点位置 
          playerObj.rotation.set(0, 0, 0); // 
          let size = 0.01;
          playerObj.scale.set(size, size, size); //原点位置


          mixer = new THREE.AnimationMixer(playerObj);

          // console.log("加载idle " + modelPath, playerObj.animations);

          animations = [];
          for (let i = 0; i < playerObj.animations.length; i++) {
            const element = playerObj.animations[i];
            animations.push({ clipAction: element, timeScale: 1, clipIndex: i, animName: element.name, connectAnim: "", targetIndex: -1 });
          }

          if (animData != null) {
            SetActionByIndexFn(animData);
          } else {
            // 加载上传的角色模型,animData传入的null,会进入此回调.
            //传出模型，让playerObj在回调中添加到场景
          }

          LoadCompleted();


          // scope.ChangeAnimDirect("idle");
          scope.ChangeAnimDirect(oldAnimName == "" ? "idle" : oldAnimName);

          if (callback) {
            callback(playerObj);
          }

          return;

        }
      );

    }
    function cloneFbx(object) {
      const clone = {
        animations: object.animations,
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

    function copyloadFbxFn(animData, callback, copyAvatar) {

      playerObj = cloneFbx(copyAvatar.scene).scene;
      playerObj.animations = copyAvatar.animations;

      playerObj.name = "player";
      playerObj.tag = "player";
      // console.log("加载到的 角色模型", playerObj);

      playerObj.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.castShadow = true;
          // item.receiveShadow = true;
          item.tag = "player";
          item.owner = owner;
        }

        if (item instanceof THREE.SkinnedMesh) {
          item.castShadow = true;
          // item.receiveShadow = true;
          item.tag = "player";
          item.owner = owner;
        }

      });
      // scene.add(playerObj); 

      playerObj.position.set(0, 0, 0); //原点位置
      // playerObj.rotation.set(0, 3.14/2, 0); // 
      // playerObj.rotation.set(0, 3.14, 0); // 
      playerObj.rotation.set(0, 0, 0); // 
      let size = 0.01;
      playerObj.scale.set(size, size, size); //原点位置


      mixer = new THREE.AnimationMixer(playerObj);

      // console.log("加载idle " + modelPath, playerObj.animations);

      animations = [];
      for (let i = 0; i < playerObj.animations.length; i++) {
        const element = playerObj.animations[i];
        animations.push({ clipAction: element, timeScale: 1, clipIndex: i, animName: element.name, connectAnim: "", targetIndex: -1 });
      }

      if (animData != null) {
        SetActionByIndexFn(animData);
      } else {
        // 加载上传的角色模型,animData传入的null,会进入此回调.
        //传出模型，让playerObj在回调中添加到场景
      }

      LoadCompleted();

      ChangeAnimDirectFn("idle");

      if (callback) {
        callback(playerObj);
      }

      return;

    }

    let waitLoadCompleted;
    function LoadCompleted() {
      loadCompleted = true;

      if (waitLoadCompleted) {
        waitLoadCompleted();
      }
    }



    const loadGltf = (animData, callback) => {
      // 同时加载多个相同路径的模型时，先加载第一个，等第一个加载完成后，再加载其他的
      let mesh = null;
      if (_this._YJSceneManager) {
        mesh = _this._YJSceneManager.checkLoadAvatar_needCheck(modelPath, (mesh) => {
          // console.log("=========加载角色 COPY =======", mesh);
          if (playerObj != undefined && playerObj != null) { return; }
          // console.log("=========加载角色 COPY 加载 =======", mesh);
          copyloadGltfFn(animData, callback, mesh);
        });
      }
      if (mesh != null) {
        return;
      }
      if (_this._YJSceneManager) {
        _this._YJSceneManager.addLoadAvatar_needCheck_begin(modelPath);
      }
      loadGltfFn(animData, callback, true);

    }
    function loadGltfFn(animData, callback, needCheck) {

      const loader = new GLTFLoader();
      loader.load(modelPath,
        function (gltf) {

          if (needCheck) {
            if (_this._YJSceneManager) {
              _this._YJSceneManager.addLoadAvatar_needCheck_done(modelPath, gltf);
            }
          }

          // 查看动画数据
          playerObj = gltf.scene;
          playerObj.name = "player";
          playerObj.tag = "player";


          // console.log("加载到的 角色模型", gltf);

          playerObj.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              // item.receiveShadow = true;
              // item.name = "ignoreRaycast";
              item.tag = "player";
              item.owner = owner;
            }
            if (item instanceof THREE.SkinnedMesh) {
              item.castShadow = true;
              // item.receiveShadow = true;
              // item.name = "ignoreRaycast";
              item.tag = "player";
              item.owner = owner;
            }
          });


          playerObj.position.set(0, 0, 0); //原点位置

          // playerObj.rotation.set(0, 3.14, 0); // 

          // console.log("animData = ",animData);

          mixer = new THREE.AnimationMixer(playerObj);

          // console.log("加载 动作 ", gltf.animations);

          animations = [];
          for (let i = 0; i < gltf.animations.length; i++) {
            const element = gltf.animations[i];
            animations.push({ clipAction: element, timeScale: 1, clipIndex: i, animName: element.name, connectAnim: "", targetIndex: -1 });
          }


          if (animData != null) {
            SetActionByIndexFn(animData);
          } else {
          }


          LoadCompleted();

          // scope.ChangeAnimDirect("idle");
          scope.ChangeAnimDirect(oldAnimName == "" ? "idle" : oldAnimName);


          if (callback) {
            callback(playerObj);
          }


          return;
        }
      );

    }
    function copyloadGltfFn(animData, callback, copyAvatar) {


      playerObj = cloneFbx(copyAvatar.scene).scene;
      playerObj.animations = copyAvatar.animations;


      // 查看动画数据

      playerObj.name = "player";
      playerObj.tag = "player";


      // console.log("加载到的 角色模型", playerObj);

      playerObj.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.castShadow = true;
          // item.receiveShadow = true;
          // item.name = "ignoreRaycast";
          item.tag = "player";
          item.owner = owner;
        }
        if (item instanceof THREE.SkinnedMesh) {
          item.castShadow = true;
          // item.receiveShadow = true;
          // item.name = "ignoreRaycast";
          item.tag = "player";
          item.owner = owner;
        }
      });


      playerObj.position.set(0, 0, 0); //原点位置

      playerObj.rotation.set(0, 3.14, 0); // 

      // console.log("animData = ",animData);

      mixer = new THREE.AnimationMixer(playerObj);

      // console.log("加载 动作 ", gltf.animations);

      animations = [];
      for (let i = 0; i < playerObj.animations.length; i++) {
        const element = playerObj.animations[i];
        animations.push({ clipAction: element, timeScale: 1, clipIndex: i, animName: element.name, connectAnim: "", targetIndex: -1 });
      }


      if (animData != null) {
        SetActionByIndexFn(animData);
      } else {
      }

      LoadCompleted();

      ChangeAnimDirectFn("idle");

      if (callback) {
        callback(playerObj);
      }



      return;

    }


    this.SetActionByIndex = function (animationData) {
      SetActionByIndexFn(animationData);
    }
    //编辑完之后，保存数据
    //通过索引数据，设置具体动作索引属于那个动作
    function SetActionByIndexFn(animationData) {
      GetFaceModelFn();
      if (mixer == undefined) { return; }
      if (animations.length == 0) { return; }

      // console.log("动作数据为", animationData);
      for (let i = 0; i < animationData.length; i++) {
        const element = animationData[i];

        let action = mixer.clipAction(animations[element.targetIndex < 0 ? 0 : element.targetIndex].clipAction);
        action.timeScale = element.timeScale;



        // 跳跃和死亡动作，不循环 且播放完成后保持在最后一帧
        if (element.animName == "jump" || element.animName == "death"
          || element.animName == "collection" || element.animName == "sitting") {
          action.loop = THREE.LoopOnce; //不循环播放
          action.clampWhenFinished = true;//暂停在最后一帧播放的状态
        }
        if (element.isLoop != undefined && !element.isLoop) {
          action.loop = THREE.LoopOnce; //不循环播放
          action.clampWhenFinished = true;//暂停在最后一帧播放的状态
        }

        if (element.animName != "") {
          actions.push({
            action: action, animName: element.animName,
            timeScale: element.timeScale, weight: 1
          });
        }


        mixer.addEventListener('loop', function (e) {
          // console.log(" ===== 到达动画 loop 点 222 ===== ", actions[0].action);
        });
        mixer.addEventListener('finished', function (e) {
          // console.log(" ===== 到达动画 结束 点 ===== ");
        });
      }


    }



    let animations = [];
    this.GetAnimation = function () {
      return animations;
    }
    this.ChangeAnimByIndex = function (i, timeScale) {
      for (let i = 0; i < animations.length; i++) {
        mixer.clipAction(animations[i].clipAction).stop();
      }
      // console.log("切换动画"+ i);
      let action = mixer.clipAction(animations[i].clipAction);
      action.timeScale = timeScale;
      action.play();//播放动画 

    }
    this.ChangeAnimIsLoop = function (animName, isLoop) {
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          element.isLoop = isLoop;
          if (element.isLoop) {
            element.action.loop = THREE.LoopRepeat;
          } else {
            element.action.loop = THREE.LoopOnce;
            element.action.clampWhenFinished = true;//暂停在最后一帧播放的状态
          }
          element.action.reset();
          element.action.play();
        }
      }
    }
    this.ChangeAnimByAnimData = function (animName, isLoop, anim) {
      if (animName == "") {
        console.error(" 找不到动作 ");
        return;
      }
      if (anim == null) {
        console.error(" 找不到动作 ", animName);
        return;
      }
      let action = mixer.clipAction(anim);
      actions.push({
        action: action, animName: animName,
        timeScale: 1, weight: 1
      });
      if (isLoop != undefined && !isLoop) {
        action.loop = THREE.LoopOnce; //不循环播放
        action.clampWhenFinished = true;//暂停在最后一帧播放的状态
      }
      // action.reset();
      // action.play();
      activateAllActions(animName);
    }

    function activateAllActions(animName) {
      // console.log(animName,actions);
      let has = false;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          has = true;
        }
      }
      if (has) {
        for (let i = 0; i < actions.length; i++) {
          const element = actions[i];
          setWeight(element.action, element.animName == animName ? element.weight : 0, element.timeScale);
          if (element.animName == animName) {
            if (element.action != undefined) {
              element.action.reset();
              element.action.play();
            }
            currentAction = element.action;
            currentTime = 0;
            currentDuration = currentAction._clip.duration;
            oldAnimName = animName;
            // console.error("切换动画 2 ", animName);
            oldBlendAnim = "";
          }
        }
      }
      // 如果要播放的动作，不在已有动作列表中，则去扩展动作中查找
      if (!has) {
        if (missAnimCallback) {
          missAnimCallback(animName);
        }
      }

    }
    function setWeight(action, weight, scale) {
      if (action == undefined) { return; }
      action.enabled = true;
      action.setEffectiveTimeScale(scale * 1);
      action.setEffectiveWeight(weight);
    }


    //----------PC 端 同步角色动作 开始-----------------

    var oldAnimName = "";
    //切换动画
    this.ChangeAnim = function (animName) {
      // console.error(" 直接设置玩家角色动作 22 " + animName);
      ChangeAnimDirectFn(animName);
      if (mmdCtrl) {
        mmdCtrl.ChangeAnim(animName);
      }
    }
    this.ChangeAnimDirect = function (animName) {
      oldAnimName = "";
      ChangeAnimDirectFn(animName);
    }
    function ChangeAnimDirectFn(animName) {
      if (!loadCompleted) { return; }
      if (oldAnimName == animName) { return; }
      activateAllActions(animName);
    }
    let walkAction;
    this.SetWalkWeight = function (f) {
      if (walkAction == undefined) {
        return;
      }
      if (oldAnimName != "walk") { return; }
      if (f == 0) {
        walkAction.setEffectiveWeight(0);
        return;
      }
      walkAction.setEffectiveWeight(f + 0.4);
      // console.log(" 设置 行走动作 权重 " + f);
    }

    this.GetBone = function (boneName, callback) {
      playerObj.traverse(function (item) {
        if (item instanceof THREE.Bone) {
          if (item.name == boneName && item.children.length > 0) {
            if (callback) {
              callback(item);
            }
            return;
          }
        }
      });
    }
    this.GetAllBoneInParent = function (boneName) {
      let parentBone = null;
      playerObj.traverse(function (item) {
        if (item instanceof THREE.Bone) {
          if (item.name == boneName && item.children.length > 0) {
            parentBone = item;
          }
        }
      });
      if(parentBone == null ){
        return null;
      }
      let boneNode = [];
      LoopFindChild2(parentBone, boneNode);
      return boneNode;
    }
    function LoopFindChild2(parent, boneNode) {
      if (parent.children.length > 0) {
        boneNode.push(parent.name);
        for (let i = 0; i < parent.children.length; i++) {
          LoopFindChild2(parent.children[i], boneNode);
        }
      }
    }
    // 动作混合
    let oldBlendAnim = "";
    let canBlendAmin  = false; 
    //animName上半身 ， animName0 下半身
    this.layerBlendPerbone = function (animName, animName0, loop, loop0) {
      if(!canBlendAmin){
        return false;
      }
      if (oldBlendAnim == animName + animName0) {
        return;
      }
      for (let i = 0; i < actions.length; i++) {
        const e = actions[i];
        if (e.animName == (animName + animName0 + "_" + animName)) {
          oldBlendAnim = animName + animName0;
          oldAnimName = "";
          activateAllActions2(animName + animName0 + "_" + animName, animName + animName0 + "_" + animName0);

          console.log(" in layerBlendPerbone ", oldBlendAnim);
          return;
        }
      }
      // 以boneName为界，提取animName的上半身数据，提取animName0的下半身数据，组合成新的动作数据
      let action0 = null;
      let action1 = null;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          action0 = element.action;
        }
        if (element.animName == animName0) {
          action1 = element.action;
        }
      }
      if (action0 == null) { 
        scope.ChangeAnim(animName); 
        return null;
      }
      if (action1 == null) { 
        scope.ChangeAnim(animName0); 
        return null;
      }
      oldBlendAnim = animName + animName0;

      //获取上下半身的骨骼
      // let allBone = scope.transform.GetComponent("MeshRenderer").GetAllBone(); 
      let mixamorigSpine, mixamorigLeftUpLeg, mixamorigRightUpLeg;
      mixamorigSpine = scope.GetAllBoneInParent("mixamorigSpine");
      if(mixamorigSpine == null){
        return false;
      }
      mixamorigLeftUpLeg = scope.GetAllBoneInParent("mixamorigLeftUpLeg");
      mixamorigLeftUpLeg.push("mixamorigHips");
      mixamorigRightUpLeg = scope.GetAllBoneInParent("mixamorigRightUpLeg");
      for (let i = 0; i < mixamorigRightUpLeg.length; i++) {
        mixamorigLeftUpLeg.push(mixamorigRightUpLeg[i]);
      }
      console.log("mixamorigSpine ", mixamorigSpine);
      console.log("mixamorigLeftUpLeg ", mixamorigLeftUpLeg);

      let tracks_spine = cutAction(mixamorigSpine, action0._clip);
      let tracks_leftleg = cutAction(mixamorigLeftUpLeg, action1._clip);
      // let tracks_rightleg = cutAction(mixamorigRightUpLeg,action1._clip);

      let tracks = [];
      for (let i = 0; i < tracks_spine.length; i++) {
        tracks.push(tracks_spine[i]);
      }
      let animname = animName + animName0 + "_" + animName;
      let anim = new THREE.AnimationClip(animname, -1, tracks); anim.optimize();
      let action = mixer.clipAction(anim);

      // if (!loop) {
      //   action.loop = THREE.LoopOnce; //不循环播放
      // action.clampWhenFinished = true;//暂停在最后一帧播放的状态
      // }

      console.log(animname, action);

      actions.push({
        action: action,
        targetIndex: animations.length - 1, animName: animname, timeScale: 1, weight: 1
        , isLoop: loop
      });

      tracks = [];
      for (let i = 0; i < tracks_leftleg.length; i++) {
        tracks.push(tracks_leftleg[i]);
      }
      animname = animName + animName0 + "_" + animName0;
      anim = new THREE.AnimationClip(animname, -1, tracks); anim.optimize();
      action = mixer.clipAction(anim);
      // if (!loop0) {
      // action.loop = THREE.LoopOnce; //不循环播放
      // action.clampWhenFinished = true;//暂停在最后一帧播放的状态
      // }
      // console.log(action);
      console.log(animname, action);

      actions.push({
        action: action,
        targetIndex: animations.length - 1, animName: animname, timeScale: 1, weight: 1
        , isLoop: loop0
      });
      activateAllActions2(animName + animName0 + "_" + animName, animName + animName0 + "_" + animName0);
      oldAnimName = "";
      return true;
    }
    let eventList = [];
    // 添加事件监听
    this.addEventListener = function (e, fn) {
      eventList.push({ eventName: e, fn: fn });
    }
    // 执行事件
    this.applyEvent = function (e, v, v2) {
      for (let i = 0; i < eventList.length; i++) {
        const element = eventList[i];
        if (element.eventName == e) {
          element.fn(v, v2);
        }
      }
    }

    function activateAllActions2(animName, animName0) {

      let has = false;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        setWeight(element.action, 0, element.timeScale);
        if (element.animName == animName) {
          has = true;
          currentAction = element.action;
        }
      }
      if (has) {
        for (let i = 0; i < actions.length; i++) {
          const element = actions[i];
          if (element.animName == animName || element.animName == animName0) {
            setWeight(element.action, element.weight, element.timeScale);
            if (element.action != undefined) {
              element.action.reset();
              element.action.play();
            }

          }
        }
        return true;
      }
      return false;
    }
    function cutAction(boneRefList, anim) {
      let tracks = [];
      for (let i = 0; i < anim.tracks.length; i++) {
        const track0 = anim.tracks[i];
        for (let j = 0; j < boneRefList.length; j++) {
          const mmdBone = boneRefList[j];
          if ((track0.name) == (mmdBone + ".position")) {
            const trackName = track0.name;
            const times = track0.times;
            const values = track0.values;
            const track = new THREE.VectorKeyframeTrack(trackName, times, values);
            tracks.push(track);
          }
          if ((track0.name) == (mmdBone + ".quaternion")) {
            const trackName = track0.name;
            const times = track0.times;
            const values = track0.values;
            const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
            tracks.push(track);
          }
        }

      }
      return tracks;
    }

    let oldScale = 0;
    this.SetActionScale = function (scale) {
      if (!currentAction) {
        return;
      }
      scale = scale.toFixed(2);
      // if(oldScale == scale){
      //   return;
      // }
      // console.log(" 动画scale ", scale);
      oldScale = scale;
      currentAction.setEffectiveTimeScale(scale);
    }


    this.ChangeAvatar = function (_modelPath, _animationData, _controllerCallback) {

      //清空
      if (playerObj && mixer != null) {
        // stopAllAction();
        mixer.stopAllAction();
        mixer.uncacheRoot(playerObj);
        mixer = null;
      }



      modelPath = _modelPath;


      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      if (modelPath.indexOf(".pmx") > -1) {
        type = "mmd";
      }
      // console.log("加载角色模型 " + type);
      if (type == "fbx") {
        loadFbx(_animationData, _controllerCallback);
      }
      if (type == "gltf") {
        loadGltf(_animationData, _controllerCallback);
      }
      if (type == "mmd") {
        loadMMD(_animationData, _controllerCallback);
      }
    }

    const loadMMD = (animData, callback) => {

    }

    //----------PC 端 同步角色动作 结束-----------------


    //----------生成和移除角色 开始-----------------

    //移除角色
    this.Destroy = function () {
      this.ClearAvatar();
      cancelAnimationFrame(updateId);
    }
    function stopAllAction() {
      actions.forEach(function (actionData) {
        if (actionData.action != undefined) {
          actionData.action.stop();
        }
      });
    }

    function delAllAction() {
      actions.forEach(function (actionData) {
        if (actionData.action != undefined) {
          actionData.action.stop();
          actionData.action = undefined;
        }
      });
      actions = [];
    }

    this.ClearAvatar = function () {
      if (playerObj == undefined) { return; }
      //清空
      if (playerObj && mixer != null) {
        mixer.stopAllAction();
        mixer.uncacheRoot(playerObj);
        mixer = null;
      }

      delAllAction(); //重要，必须. 卸载前必须清空引用
      if (_this._YJSceneManager) {
        _this._YJSceneManager.clearGroup(playerObj);
      } else {
        clearGroupFn(playerObj);
      }
    }
    this.ClearMesh = function () {
      if (playerObj == undefined) { return; }
      //清空
      if (playerObj && mixer != null) {
        mixer.stopAllAction();
        mixer.uncacheRoot(playerObj);
        mixer = null;
      }

      delAllAction(); //重要，必须. 卸载前必须清空引用
      clearGroupFn_onlyMesh(playerObj);

    }
    function clearGroupFn_onlyMesh(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          item.geometry.dispose();
          item.geometry = undefined;
          item = undefined;
        } else
          if (item.type === 'SkinnedMesh') {
            item.parent.animations = undefined; //重要，必须
            item.skeleton.dispose();
            item.skeleton = undefined;  //重要，必须
            item.geometry.dispose();
            item.geometry = undefined;
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


    function clearGroupFn(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {

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
    this.ResetToTPose = () => {
      actions.forEach(function (actionData) {
        if (actionData.action != undefined) {
          actionData.action.stop();
        }
      });
    }


    var updateId = null;
    let lookatPosRef = null;
    this.SetLookatPosRef = function (e) {
      lookatPosRef = e;
    }


    let faceAddToHeadBone = false;
    let faceModel = null;
    let headBone = null;
    let headBoneRef = null;

    this.GetFaceModel = function () {
      GetFaceModelFn();
    }
    function GetFaceModelFn() {

      playerObj.traverse((item) => {
        if (item.isSkinnedMesh) {
          if (item.name.includes("UTC_Face004")) {
            // faceModel = item;
            faceModel = new THREE.Mesh(item.geometry.clone(), item.material.clone());
            // item.parent.add(faceModel);
            faceModel.position.copy(item.position);
            faceModel.rotation.copy(item.rotation);
            item.visible = false;
            faceModel.name = "Face";
            // playerObj.attach(faceModel);
            // faceModel.bindMatrix = []; 
            // faceModel.bindMatrixInverse = [];  
            // faceModel.skeleton.bones = [];
          }
        }
      });

      playerObj.traverse((item) => {
        if (item.isBone) {
          if (item.name.includes("spine006")) {
            headBone = item;
          }
        }
      });
      if (headBone && faceModel) {

        headBone.attach(faceModel);

        faceModel.rotation.y += Math.PI; // gltf 新模型添加

        // console.log("头部骨骼", headBone);
        headBoneRef = new THREE.Group();
        // headBoneRef = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1),new THREE.MeshBasicMaterial({color:0xffffff}));

        headBoneRef.position.copy(headBone.position);
        headBoneRef.position.y += 0.7;
        // headBoneRef.add(new THREE.AxesHelper(0.3));
        playerObj.attach(headBoneRef);

        // console.log("找到头部骨骼");

        // faceModel.visible = false;
        // owner._YJTransformManager.attach(headBone);
      }
    }
    function SetwaitLoadCompletedCallback(callback) {
      waitLoadCompleted = callback;
    }
    // 换装
    this.ChangeSkin = function (targetPath, part, mode, faceSourcePath) {

      if (targetPath == undefined) { return; }


      if (!loadCompleted) {
        SetwaitLoadCompletedCallback(() => {
          this.ChangeSkin(targetPath, part, mode, faceSourcePath);
        });
        return;
      }
      // console.log(" 换装 ", targetPath, part, mode,faceSourcePath);
      let bodySkinnedMesh = null;

      let smName = part;
      let targetName = part;


      let allBone = [];

      if (!faceAddToHeadBone) {

        faceAddToHeadBone = true;
      }
      if (part == "Face" && faceModel) {
        // console.log("把脸添加到头部骨骼下", playerObj);

        // 叠加贴图
        if (mode == "addTexture") {
          let mat = faceModel.material.clone();

          // margeTwoTexture(faceModel);
          // margeTexShaderMat(faceModel,targetPath);

          // let faceTex =  new THREE.TextureLoader().load(_this.GetPublicUrl() + faceSourcePath);
          // let faceAddTex = new THREE.TextureLoader().load(_this.GetPublicUrl() + targetPath);

          let faceTex = (_this.GetPublicUrl() + faceSourcePath);
          let faceAddTex = (_this.GetPublicUrl() + targetPath);

          if (targetPath == "") {
            faceTex = new THREE.TextureLoader().load(_this.GetPublicUrl() + faceSourcePath);
            faceTex.encoding = THREE.sRGBEncoding;
            faceTex.flipY = false;
            faceModel.material.map = faceTex;
            // console.log(faceModel);

          } else {

            if (_this._YJSceneManager) {
              _this._YJSceneManager.copyTextureToTexture(faceTex, faceAddTex, (canvas) => {
                const texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;
                texture.encoding = THREE.sRGBEncoding;
                faceModel.material.map = texture;
              });
            } else {
              owner.copyTextureToTexture(faceTex, faceAddTex, (canvas) => {
                const texture = new THREE.Texture(canvas);
                texture.needsUpdate = true;
                texture.encoding = THREE.sRGBEncoding;
                faceModel.material.map = texture;
              });
            }
          }

          // console.log(" in 叠加贴图 ");
          return;
        }

        // 换贴图
        if (mode == "texture") {
          let mat = faceModel.material;
          // let mat = faceModel.material.clone();
          let map = new THREE.TextureLoader().load(_this.GetPublicUrl() + targetPath);
          map.encoding = 3001;
          map.flipY = false;
          mat.map = map;
          faceModel.material = mat;
          return;
        }
      }


      playerObj.traverse((item) => {
        if (item.isSkinnedMesh) {
          if (item.name.includes(smName)) {
            bodySkinnedMesh = item;
          }
        }
        // if (item.isMesh) {
        //   if (item.name.includes(smName)) {
        //     bodySkinnedMesh = item;
        //   }
        // }

        if (item.isMesh) {
          item.frustumCulled = false;  //解决物体在某个角度不显示的问题
        }
        if (item.isBone) {
          // allBone.push(item);
          // console.log(item.name);
          let has = false;
          for (let i = 0; i < allBone.length; i++) {
            const element = allBone[i];
            if (element.name == item.name) {
              has = true;
            }
          }
          if (!has) {
            allBone.push(item);
          }
          // allBone[item.name] = item; 
        }
      });
      if (bodySkinnedMesh == null) { return; }
      // console.log("换装前模型为 ", bodySkinnedMesh,_this.GetPublicUrl() + targetPath);
      // console.log("换装前模型为 ", bodySkinnedMesh, allBone);

      // 换贴图
      if (mode == "texture") {
        let mat = bodySkinnedMesh.material.clone();
        let map = new THREE.TextureLoader().load(_this.GetPublicUrl() + targetPath);
        map.flipY = false;
        map.encoding = 3001;
        mat.map = map;
        bodySkinnedMesh.material = mat;
        return;
      }
      // 换模型
      if (mode == "model") {

        if (targetPath.includes(".fbx")) {
          ChangeSkin_fbx(targetPath, allBone, bodySkinnedMesh, targetName);
        }
        if (targetPath.includes(".gltf")) {
          ChangeSkin_gltf(targetPath, allBone, bodySkinnedMesh, targetName);
        }

      }




    }

    async function margeTwoTexture(faceModel) {

      // const width = 32;
      // const height = 32;
      // const data = new Uint8Array(width * height * 4);
      // let dataTexture = new THREE.DataTexture(data, width, height);
      // console.log(mat.map);
      // console.log(map);
      // updateDataTexture(dataTexture);
      // updateDataTexture(mat.map,map);
      // owner.copyTextureToTexture(mat.map,map);
      // owner.copyTextureToTexture(dataTexture, mat.map );
      // owner.copyTextureToTexture(dataTexture, map);
      // mat.map = map;

      const rgbeLoader = new THREE.TextureLoader()
        .setPath(_this.GetPublicUrl());

      const [texture] = await Promise.all([
        rgbeLoader.loadAsync("models/playerSkin/fbx/UTC_Default/utc001.png"),
      ]);
      texture.encoding = 3001; //3000  3001

      const [texture2] = await Promise.all([
        rgbeLoader.loadAsync("models/playerSkin/fbx/face_add_001.png"),
      ]);

      // let mapSource = new THREE.TextureLoader().load(_this.GetPublicUrl() + "models/playerSkin/fbx/UTC_Default/utc001.png");
      // let map = new THREE.TextureLoader().load(_this.GetPublicUrl() + targetPath);
      // if(map){
      //   map.encoding = 3001;

      // }
      // updateDataTexture(texture,texture2);
      faceModel.material.map = owner.copyTextureToTexture(texture2, texture);
      // faceModel.material.map =texture;

    }

    // 叠加两张贴图的shader
    function margeTexShaderMat(faceModel, targetPath) {
      let mapSource = new THREE.TextureLoader().load(_this.GetPublicUrl() + "models/playerSkin/fbx/UTC_Default/utc001.png");
      let map = new THREE.TextureLoader().load(_this.GetPublicUrl() + targetPath);
      map.encoding = 3001;


      let v = `varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4( position, 1.0 );
      }`;
      let f = `
      #ifdef GL_ES
      precision highp float;
        #endif
      uniform sampler2D texture1;
      uniform sampler2D texture2;
      varying vec2 vUv;
      void main() {
        vec4 color1 = texture2D( texture1, vUv);
        vec4 color2 = texture2D( texture2, vUv);
        // gl_FragColor = mix(color1, color2, 0.8);
        // gl_FragColor = mix(color2, color1, 0.98);
        // gl_FragColor = mix(color2, color1, 0.5);
        gl_FragColor = color1 + color2;
        //  gl_FragColor = vec4(color2.rgb, color1.rgb);
        //  gl_FragColor = vec4(color1.rgb, color2.rgb);
      }`;

      // 
      var material = new THREE.ShaderMaterial({
        uniforms: {
          // 纹理贴图1
          texture1: {
            // value:mat.map
            value: mapSource
          },
          // 纹理贴图2
          texture2: {
            value: map
          },
        },
        // 顶点着色器
        vertexShader: v,
        // 片元着色器
        fragmentShader: f,
      });
      faceModel.material = material;
    }

    // const color = new THREE.Color();
    // function updateDataTexture(texture) {
    //   const size = texture.image.width * texture.image.height;
    //   const data = texture.image.data;
    //   // generate a random color and update texture data
    //   color.setHex(Math.random() * 0xffffff);
    //   const r = Math.floor(color.r * 255);
    //   const g = Math.floor(color.g * 255);
    //   const b = Math.floor(color.b * 255);
    //   for (let i = 0; i < size; i++) {
    //     const stride = i * 4;
    //     data[stride] = r;
    //     data[stride + 1] = g;
    //     data[stride + 2] = b;
    //     data[stride + 3] = 1;
    //   }
    // }
    function updateDataTexture(sourceTex, addTex) {
      const size = sourceTex.image.width * sourceTex.image.height;
      const data = sourceTex.image.data;

      console.log(sourceTex);
      console.log(sourceTex.image);
      console.log(sourceTex.source);
      console.log(data);
      const dataaddTex = addTex.image.data;
      // console.log(addTex.image);
      console.log(dataaddTex);


      for (let i = 0; i < size; i++) {
        const stride = i * 4;
        data[stride] += dataaddTex[stride];
        data[stride + 1] += dataaddTex[stride + 1];
        data[stride + 2] += dataaddTex[stride + 2];
        data[stride + 3] += dataaddTex[stride + 3];
      }

    }
    function ChangeSkin_fbx(targetPath, allBone, bodySkinnedMesh, targetName) {

      var fbxLoader = new FBXLoader();
      fbxLoader.load(_this.GetPublicUrl() + targetPath,
        function (object) {
          // 查看动画数据
          let targetSkin = object;
          let targetSkinnedMesh = null;
          targetSkin.traverse((item) => {

            if (item.type == "SkinnedMesh") {
              if (item.name.includes(targetName)) {
                targetSkinnedMesh = item;
              }
              item.material.side = THREE.DoubleSide;
            }
          });

          // console.log("加载到 换装零件 ", object);
          // console.log(" 获取 换装零件 skinnedmesh  ", targetSkinnedMesh);

          const skeleton = targetSkinnedMesh.skeleton;
          // console.log(" 获取 换装零件 skeleton  ", skeleton);

          const orderedCloneBones = [];

          let loadBone = skeleton.bones;

          for (let i = 0; i < loadBone.length; ++i) {
            for (let ii = 0; ii < allBone.length; ii++) {
              if (loadBone[i].name == allBone[ii].name) {
                allBone[ii].matrix = loadBone[i].matrix;
                allBone[ii].matrixWorld = loadBone[i].matrixWorld;
                allBone[ii].updateWorldMatrix();

                orderedCloneBones.push(allBone[ii]);
              }
            }
          }

          // console.log(" orderedCloneBones  ", orderedCloneBones);


          bodySkinnedMesh.geometry = targetSkinnedMesh.geometry;
          bodySkinnedMesh.material = targetSkinnedMesh.material;
          bodySkinnedMesh.material.side = THREE.DoubleSide;



          bodySkinnedMesh.bindMatrix = targetSkinnedMesh.bindMatrix;  //必须
          bodySkinnedMesh.bindMatrixInverse = targetSkinnedMesh.bindMatrixInverse;  //必须


          bodySkinnedMesh.matrix = targetSkinnedMesh.matrix;
          bodySkinnedMesh.matrixWorld = targetSkinnedMesh.matrixWorld;

          bodySkinnedMesh.skeleton.boneInverses = skeleton.boneInverses;
          bodySkinnedMesh.skeleton.boneMatrices = skeleton.boneMatrices;
          bodySkinnedMesh.skeleton.boneTexture = skeleton.boneTexture;
          bodySkinnedMesh.skeleton.frame = skeleton.frame;
          bodySkinnedMesh.skeleton.bones = orderedCloneBones;


          return;

        }
      );
      return;
    }

    function ChangeSkin_gltf(targetPath, allBone, bodySkinnedMesh, targetName) {

      const loader = new GLTFLoader();
      loader.load(_this.GetPublicUrl() + targetPath,
        function (gltf) {

          // 查看动画数据
          let targetSkin = gltf.scene;
          let targetSkinnedMesh = null;
          targetSkin.traverse((item) => {
            if (item.type == "SkinnedMesh") {
              if (item.name.includes(targetName)) {
                targetSkinnedMesh = item;
              }
            }
          });

          // console.log("加载到 换装零件 ", gltf);
          // console.log(" 获取 换装零件 skinnedmesh  ", targetSkinnedMesh, allBone);

          const skeleton = targetSkinnedMesh.skeleton;
          // console.log(" 获取 换装零件 skeleton  ", skeleton);

          const orderedCloneBones = [];
          let loadBone = skeleton.bones;
          for (let i = 0; i < loadBone.length; ++i) {
            for (let ii = 0; ii < allBone.length; ii++) {
              if (loadBone[i].name == allBone[ii].name) {
                allBone[ii].matrix = loadBone[i].matrix;
                allBone[ii].matrixWorld = loadBone[i].matrixWorld;
                allBone[ii].updateWorldMatrix();

                orderedCloneBones.push(allBone[ii]);
              }
            }
          }

          // console.log(" orderedCloneBones  ", orderedCloneBones);

          bodySkinnedMesh.geometry = targetSkinnedMesh.geometry;
          bodySkinnedMesh.material = targetSkinnedMesh.material;
          bodySkinnedMesh.material.side = THREE.DoubleSide;

          bodySkinnedMesh.bindMatrix = targetSkinnedMesh.bindMatrix;  //必须
          bodySkinnedMesh.bindMatrixInverse = targetSkinnedMesh.bindMatrixInverse;  //必须

          bodySkinnedMesh.matrix = targetSkinnedMesh.matrix;
          bodySkinnedMesh.matrixWorld = targetSkinnedMesh.matrixWorld;

          bodySkinnedMesh.skeleton.boneInverses = skeleton.boneInverses;
          bodySkinnedMesh.skeleton.boneMatrices = skeleton.boneMatrices;
          bodySkinnedMesh.skeleton.boneTexture = skeleton.boneTexture;
          bodySkinnedMesh.skeleton.frame = skeleton.frame;
          bodySkinnedMesh.skeleton.bones = orderedCloneBones;


          return;
        }
      );
    }


    function getBoneName(boneName) {
      let arr = boneName.split('_');
      let s = "";
      for (let i = 1; i < arr.length - 1; i++) {
        s += arr[i];
      }
      return s;
    }

    // 是否开启注视跟随
    // let inLookat = true;
    let inLookat = false;
    let currentTime = 0;
    let currentAction = null;
    this.GetCurrentAction = function () {
      return currentAction;
    }

    let currentDuration = 100;
    let auto = true;
    this.GetCurrentTime = function () {
      return { time: currentTime, duration: currentDuration };
    }
    this.SetCurrentTime = function (e) {
      currentAction.time = e;
      auto = false;
    }

    this._update = function () {

      // updateId = requestAnimationFrame(update);
      if (mixer !== null && loadCompleted) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
        // && auto
        if (currentAction) {
          currentTime = currentAction.time;
          // console.log("执行模型动画 中 ",currentTime);
        }
        // currentTime = mixer.time;
        // oneAction.time
      }

      // console.log(inLookat , headBoneRef , lookatPosRef);
      if (inLookat && headBoneRef && lookatPosRef) {
        // 在动画循环点，会强制使动作还原。所以设置成，快到循环点时，立即从头播放。
        if (actions[0].action.time >= 0.96) {
          actions[0].action.time = 0;
        }
        headBoneRef.lookAt(lookatPosRef.position);
        let quat = headBoneRef.quaternion;
        // console.log(animations[0].clipAction);
        // return;
        // let tracks = animations[0].clipAction.tracks;
        let tracks = actions[0].action._clip.tracks;
        for (let i = 0; i < tracks.length; i++) {
          const element = tracks[i];
          if (element.name.includes("spine006") && element.name.includes("quaternion")) {
            // console.log(element); 
            for (let ii = 0; ii < element.values.length - 4; ii = ii + 4) {
              // element.values[ii]=0.01;
              element.values[ii] = quat.x;
              element.values[ii + 1] = quat.y;
              element.values[ii + 2] = quat.z;
              element.values[ii + 3] = quat.w;
            }
          }
        }

      }

    }
    Init();
    // update();
  }
}


export { YJLoadAvatar };