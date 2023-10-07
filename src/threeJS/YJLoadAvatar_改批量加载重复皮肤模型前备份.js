import * as THREE from "three";
import { Camera, Uniform } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { createText } from 'three/examples/jsm/webxr/Text2D.js';

class YJLoadAvatar {
  constructor(_this, scene, _modelPath, animationData, owner, controllerCallback) {

    let scope = this;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var mixer = null;//声明一个混合器变量

    let idleAction, walkAction, jumpAction, runAction, floatingAction;
    let actions = [];
    let settings;

    var playerGroup = null;
    var playerObj = null;

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
      //添加组
      playerGroup = new THREE.Group();
      scene.add(playerGroup);

      // console.log(owner);
      modelPath = _modelPath;
      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      // console.log("加载角色模型 " + type);

      if (type == "fbx") {
        loadFbx(animationData, controllerCallback);
      }
      if (type == "gltf") {
        loadGltf(animationData, controllerCallback);
      }
    }

    let group = new THREE.Group();




    //加载热点的obj 模型
    const loadFbx = (animData, callback) => {

      let mesh = null;

      if (_this._YJSceneManager) {
        mesh = _this._YJSceneManager.checkLoadMesh_needCheck(modelPath, () => {
          // console.log("========= 基础角色完成 开始 copy =======");
          loadFbxFn(animData, callback, false);
          console.log("========= 加载角色 copy =======");
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
        _this._YJSceneManager.addLoadMesh_needCheck_begin(modelPath);
      }
      loadFbxFn(animData, callback, true);
      // console.log("=========加载角色 基础 =======");


    }

    this.GetBone = function(boneName){
      playerObj.traverse(function (item) { 
        if (item instanceof THREE.Bone) {
          if(item.name ==boneName ){
            return item;
          }
        }
      }); 
      return null;
    }  
    function loadFbxFn(animData, callback, needCheck) {
      var fbxLoader = new FBXLoader();
      fbxLoader.load(modelPath,
        function (object) {
          // console.log("=========加载角色  object =======",object);
          // console.log("=========加载角色  group =======",cloneFbx(object));
          if (needCheck) {
            if (_this._YJSceneManager) {
              _this._YJSceneManager.addLoadMesh_needCheck_done(modelPath);
            }
          }


          playerObj = object;
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
          if (callback) {
            callback(playerObj);
          }

          scope.ChangeAnimDirect("idle");


          // 查看动画数据
          // console.log(object.animations)
          // // obj.animations[0]：获得剪辑对象clip
          // idleAction = mixer.clipAction(object.animations[0]);
          // // idleAction.timeScale = 1; //默认1，可以调节播放速度
          // // idleAction.loop = THREE.LoopOnce; //不循环播放
          // // idleAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
          // idleAction.play();//播放动画 

          return;

        }
      );

    }



    const loadGltf = (animData, callback) => {
      // 同时加载多个相同路径的模型时，先加载第一个，等第一个加载完成后，再加载其他的
      let mesh = null;
      if (_this._YJSceneManager) {
        mesh = _this._YJSceneManager.checkLoadMesh_needCheck(modelPath, () => {
          loadGltfFn(animData, callback, false);
          console.log("=========加载角色 COPY =======");
        });
      }
      if (mesh != null) {
        return;
      }
      if (_this._YJSceneManager) {
        _this._YJSceneManager.addLoadMesh_needCheck_begin(modelPath);
      }
      loadGltfFn(animData, callback, true);
      // console.log("=========加载角色 基础 =======");

    }
    function loadGltfFn(animData, callback, needCheck) {

      const loader = new GLTFLoader();
      loader.load(modelPath,
        function (gltf) {

          if (needCheck) {
            if (_this._YJSceneManager) {
              _this._YJSceneManager.addLoadMesh_needCheck_done(modelPath);
            }
          }

          // 查看动画数据
          playerObj = gltf.scene;
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
          for (let i = 0; i < gltf.animations.length; i++) {
            const element = gltf.animations[i];
            animations.push({ clipAction: element, timeScale: 1, clipIndex: i, animName: element.name, connectAnim: "", targetIndex: -1 });
          }
          if (animData != null) {
            SetActionByIndexFn(animData);
            callback(playerObj);
          } else {
            callback(playerObj);
          }

          scope.ChangeAnimDirect("idle");
          return;
        }
      );

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

    this.SetActionByIndex = function (animationData) {
      SetActionByIndexFn(animationData);
    }
    //编辑完之后，保存数据
    //通过索引数据，设置具体动作索引属于那个动作
    function SetActionByIndexFn(animationData) {
      if (mixer == undefined) { return; }
      // console.log("动作数据为", animationData);
      for (let i = 0; i < animationData.length; i++) {
        const element = animationData[i];
        // if (element.animName == "idle") {
        //   idleAction = mixer.clipAction(animations[element.targetIndex].clipAction);
        //   idleAction.timeScale = element.timeScale;
        //   settings['modify idle scale'] = element.timeScale;
        //   continue;
        // }
        // if (element.animName == "walk") {
        //   walkAction = mixer.clipAction(animations[element.targetIndex].clipAction);
        //   if (element.timeScale == undefined) {
        //     walkAction.timeScale = 1;
        //     settings['modify walk scale'] = 1;
        //   } else {
        //     walkAction.timeScale = element.timeScale;
        //     settings['modify walk scale'] = element.timeScale;
        //   }
        //   continue;
        // }
        // //模型动作少于动作数据时，忽略跳跃数据
        // if (element.animName == "jump" && animations.length >= animationData.length) {
        //   jumpAction = mixer.clipAction(animations[element.targetIndex].clipAction);
        //   jumpAction.timeScale = element.timeScale;
        //   settings['modify jump scale'] = element.timeScale;
        //   continue;
        // }
        // //模型动作少于动作数据时，忽略跳跃数据
        // if (element.animName == "run") {
        //   runAction = mixer.clipAction(animations[element.targetIndex].clipAction);
        //   runAction.timeScale = element.timeScale;
        //   settings['modify run scale'] = element.timeScale;
        //   continue;
        // }

        // if (element.animName == "floating") {
        //   floatingAction = mixer.clipAction(animations[element.targetIndex].clipAction);
        //   floatingAction.timeScale = element.timeScale;
        //   settings['modify floating scale'] = element.timeScale;
        //   continue;
        // }

        if (element.animName == "walk") {
          walkAction = mixer.clipAction(animations[element.targetIndex].clipAction);
        }
        if (element.animName == "run") {
          runAction = mixer.clipAction(animations[element.targetIndex].clipAction);
        } 
        let action = mixer.clipAction(animations[element.targetIndex].clipAction);
        action.timeScale = element.timeScale;


        // 跳跃和死亡动作，不循环 且播放完成后保持在最后一帧
        if (element.animName == "jump" || element.animName == "death" 
        || element.animName == "collection" ||  element.animName == "sitting") {
          action.loop = THREE.LoopOnce; //不循环播放
          action.clampWhenFinished = true;//暂停在最后一帧播放的状态
        }


        actions.push({
          action: action, animName: element.animName,
          timeScale: element.timeScale, weight: 1
        });

      }

      // console.log(actions);
      // actions = [idleAction, walkAction, jumpAction, runAction, floatingAction];


    }


    Init();


    function activateAllActions(animName) {
      // console.log("播放全部动画",actions.length);
      // setWeight(idleAction, settings['modify idle weight'], settings['modify idle scale']);
      // setWeight(walkAction, settings['modify walk weight'], settings['modify walk scale']);
      // setWeight(jumpAction, settings['modify jump weight'], settings['modify jump scale']);
      // setWeight(runAction, settings['modify run weight'], settings['modify run scale']);
      // setWeight(floatingAction, settings['modify floating weight'], settings['modify floating scale']);

      // actions.forEach(function (action) {
      //   // console.log("播放"+action.name);
      //   // action.play();
      //   if (action != undefined) {
      //     action.reset();
      //     action.play();
      //   }
      // });


      // actions.forEach(function (actionData) {
      //   console.log(actionData);
      //   if (actionData.animName == animName) {
      //     setWeight(actionData.action, actionData.weight, actionData.timeScale);
      //   } else {
      //     setWeight(actionData.action, 0, actionData.timeScale);
      //   }
      //   // console.log("播放"+action.name);
      //   // action.play();
      // });

      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        setWeight(element.action, element.animName == animName ? element.weight : 0, element.timeScale);
      }

      actions.forEach(function (actionData) {
        // console.log("播放"+action.name);
        // action.play();
        if (actionData.action != undefined) {
          actionData.action.reset();
          actionData.action.play();

        }
      });

    }
    function setWeight(action, weight, scale) {
      // console.log("切换动画 time scale  " + scale);
      if (action == undefined) { return; }
      action.enabled = true;
      // console.log("action   scale =   " , action);
      action.setEffectiveTimeScale(scale);
      // console.log("action   weight =   " , action);
      action.setEffectiveWeight(weight);


    }


    //----------PC 端 同步角色动作 开始-----------------

    var oldAnimName = "";
    //切换动画
    this.ChangeAnim = function (animName) {
      // if (!hasPlayer) {
      //   return;
      // }
      
      if (oldAnimName == animName) { return; }

      // console.log("切换动画名 " + animName);

      // if (animName == "idle") {
      //   settings['modify idle weight'] = 1;
      //   settings['modify walk weight'] = 0;
      //   settings['modify jump weight'] = 0;
      //   settings['modify run weight'] = 0;
      //   settings['modify floating weight'] = 0;

      // }
      // if (animName == "run") {
      //   if (runAction == undefined) {
      //     animName = "walk";
      //   } else {
      //     settings['modify idle weight'] = 0;
      //     settings['modify walk weight'] = 0;
      //     settings['modify jump weight'] = 0;
      //     settings['modify run weight'] = 1;
      //     settings['modify floating weight'] = 0;
      //   }
      // }

      // if (animName == "walk") {

      //   settings['modify idle weight'] = 0;
      //   settings['modify walk weight'] = 1;
      //   settings['modify jump weight'] = 0;
      //   settings['modify run weight'] = 0;
      //   settings['modify floating weight'] = 0;

      // }

      // if (animName == "jump") {

      //   settings['modify idle weight'] = 0;
      //   settings['modify walk weight'] = 0;
      //   settings['modify jump weight'] = 1;
      //   settings['modify run weight'] = 0;
      //   settings['modify floating weight'] = 0;
      // }

      // if (animName == "floating") {

      //   settings['modify idle weight'] = 0;
      //   settings['modify walk weight'] = 0;
      //   settings['modify jump weight'] = 0;
      //   settings['modify run weight'] = 0;
      //   settings['modify floating weight'] = 1;

      // }



      if (animName == "run") {
        if (runAction == undefined) {
          animName = "walk";
        } else {
        }
      }

      activateAllActions(animName);

      oldAnimName = animName;
    }
    this.ChangeAnimDirect = function (animName) {
      activateAllActions(animName);
      oldAnimName = animName;
    }
    this.SetWalkWeight = function (f) {
      if (oldAnimName != "walk") { return; }
      if (f == 0) {
        walkAction.setEffectiveWeight(0);
        return;
      }
      walkAction.setEffectiveWeight(f + 0.4);
      // console.log(" 设置 行走动作 权重 " + f);
    }


    this.ChangeAvatar = function (_modelPath, _animationData, _controllerCallback) {
      modelPath = _modelPath;


      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1) {
        type = "gltf";
      }
      // console.log("加载角色模型 " + type);
      if (type == "fbx") {
        loadFbx(_animationData, _controllerCallback);
      }
      if (type == "gltf") {
        loadGltf(_animationData, _controllerCallback);
      }
    }
    //----------PC 端 同步角色动作 结束-----------------


    //----------生成和移除角色 开始-----------------

    //移除角色
    this.DelPlayer = function () {
      // if(playerObj==null){return;}
      clearGroup(playerGroup);
      scene.remove(playerGroup);

      cancelAnimationFrame(updateId);

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

    update();
    var updateId = null;
    function update() {

      updateId = requestAnimationFrame(update);
      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
      }

    }
  }
}


export { YJLoadAvatar };