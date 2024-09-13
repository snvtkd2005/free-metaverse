import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
class YJDoor {
  constructor(_this, scene, id, modelPath, size, name, pos, rota, createCollider, _state) {


    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var mixer = null;//声明一个混合器变量
    let openAction, closeAction;

    var model = null;
    this.GetModel = function(){
      return model;
    }
    var isOpen = false;
    this.id = id;
    //加载热点的obj 模型
    this.loadFbx = function (fbxPath, texturePath, size, name, pos) {
      console.log(" 加载模型 ");
      var manager = new THREE.LoadingManager();
      manager.onProgress = function (item, loaded, total) {
        //console.log( item, loaded, total );
      };
      var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
          var percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(Math.round(percentComplete, 2) + "% downloaded");
        }
        // var loadProgress =  Math.round( percentComplete, 2);
        // console.log(loadProgress);
      };
      var onError = function (xhr) {
        //console.error( xhr );
      };

      var texture_d = new THREE.Texture();
      var loaderTex_d = new THREE.ImageLoader(manager);
      loaderTex_d.load(
        texturePath,
        function (image) {
          texture_d.image = image;
          texture_d.needsUpdate = true;
        }
      );

      var fbxLoader = new FBXLoader();
      fbxLoader.load(
        fbxPath,
        function (object) {
          object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              //标准材质球
              child.material = new THREE.MeshStandardMaterial({
                metalness: 0.1, //金属
                roughness: 0.5, //高光
                color: 0xffffff, //颜色
                // color:_color, //颜色
                depthTest: true,
                lightMap: texture_d,
                map: texture_d,
              });
            }
          });
          model = object;
          object.name = name;
          object.rotation.set(0, 3.14 / 2, 0); // 
          object.position.set(pos.x, pos.y, pos.z); // 
          object.scale.set(size, size, size);

          console.log(" 加载模型完成 " + object.name);
          console.log(" 查询其动画 ", object.animations);
          scene.add(object);
          _this.colliderList.push(object)
      LoadCompleted();

        },
        onProgress,
        onError
      );
      update();
    }

    let doorCollider;
    function Init() {

      // console.log("加载门模型");
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/js/draco/gltf/');

      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {

        model = gltf.scene;

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.castShadow = true;
            item.receiveShadow = true;
          }
        });


        model.position.set(pos.x, pos.y, pos.z); // 
        model.rotation.set(rota.x, rota.y, rota.z); // 
        model.scale.set(size, size, size);


        model.tag = name;
        model.name = id;
        scene.add(model);

        // _this.triggerList.push(model)

        // console.log(model.animations);
        // console.log(gltf.animations);

        // mixer = new THREE.AnimationMixer( model );
        // mixer.clipAction( gltf.animations[ 0 ] ).play();

        mixer = new THREE.AnimationMixer(model);
        openAction = mixer.clipAction(gltf.animations[0]);
        openAction.loop = THREE.LoopOnce; //不循环播放
        openAction.timeScale = 0.5; //默认1，可以调节播放速度
        openAction.clampWhenFinished = true;//暂停在最后一帧播放的状态

        closeAction = mixer.clipAction(gltf.animations[1]);
        closeAction.loop = THREE.LoopOnce; //不循环播放
        closeAction.timeScale = 0.5; //默认1，可以调节播放速度
        closeAction.clampWhenFinished = true;//暂停在最后一帧播放的状态


        // setWeight(openAction,1, 1);

        openAction.setEffectiveWeight(0);
        closeAction.setEffectiveWeight(0);

        openAction.play();
        closeAction.play();
        // openAction.paused = false;
        // closeAction.paused = false;


        doorCollider = LoopFindChild("doorCollider", model);



        if (createCollider) {
          //创建collider 
          CreateCollider();

          if (_state != undefined) {
            _SetState(_state);
          }
        }


        //动画播放完后，刷新一遍 collider

        update();
        LoadCompleted();

      }, undefined, function (e) {

        console.error(e);

      });

    }
    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    function LoopFindChild(childName, parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
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

    Init();
    function setWeight(action, weight, scale) {
      action.enabled = true;
      action.setEffectiveTimeScale(scale);
      action.setEffectiveWeight(weight);
    }


    this.PlayAnim = function () {

      // mixer = new THREE.AnimationMixer(model);
      // var action = mixer.clipAction(model.animations[0]);
      // action.loop = THREE.LoopOnce; //不循环播放
      if (isOpen) {
        // openAction.play(); 
        openAction.setEffectiveWeight(1);
        closeAction.setEffectiveWeight(0);
        openAction.reset();

      } else {
        closeAction.reset();

        openAction.setEffectiveWeight(0);
        closeAction.setEffectiveWeight(1);

      }

      // console.log(" 播放开关门动画 ");
      isOpen = !isOpen;
      //向外发送
      _this.SendSceneState(this.id, name, isOpen);

      setTimeout(() => {
        // console.log("刷新门的碰撞体");
        pos = new THREE.Vector3(0, 0, 0);
        //创建门的 collider
        _Global.YJ3D._YJSceneManager.CreateModelMeshCollider(doorCollider, doorCollider.scale,
          pos, null
        );
      }, 1000);

    }
    this.GetAnimState = function () {
      return isOpen;
    }



    var state = false;

    //从外接收，获取开关状态更新动画
    this.SetState = function (b) {
      if (isOpen == b) { return; }
      isOpen = b;
      ChangeState();
    }

    function ChangeState(){
 // mixer = new THREE.AnimationMixer(model);
      // var action = mixer.clipAction(model.animations[0]);
      // action.loop = THREE.LoopOnce; //不循环播放
      if (!isOpen) {
        // openAction.play(); 
        openAction.setEffectiveWeight(1);
        closeAction.setEffectiveWeight(0);
        openAction.reset();

      } else {
        closeAction.reset();

        openAction.setEffectiveWeight(0);
        closeAction.setEffectiveWeight(1);

      }
      setTimeout(() => {
        // console.log("刷新门的碰撞体");
        pos = new THREE.Vector3(0, 0, 0);
        //创建门的 collider
        _Global.YJ3D._YJSceneManager.CreateModelMeshCollider(doorCollider, doorCollider.scale,
          pos, null
        );
      }, 1000);
    }



    //-------添加删除 开始------------
    //同步服务器上的其他客户端创建的模型的状态
    function _SetState(_state) {
      state = _state;
      isOpen =_state;
      ChangeState();
      
    }

    this.ResetSetPosRota = function (pos, rota) {
      if (model == null) { return; }
      this.SetPosRota(pos, rota);
      this.DestroyCollider();
      CreateCollider();
    }
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota) {
      if (model == null) { return; }
      model.position.set(pos.x, pos.y, pos.z); // 
      if (rota != undefined) {
        model.rotation.set(rota.x, rota.y, rota.z); // 
      }
    }

    //可由用户创建的模型，放下是创建碰撞体
    this.SetDown = function (pos, rota) {
      CreateCollider();
    }
    function LoadCompleted(){
      _Global.YJ3D._YJSceneManager.LoadSingleModelCompleted();
    }
    //删除模型
    this.Destroy = function () {
      LoadCompleted();
      //删除碰撞体 
      this.DestroyCollider();
      scene.remove(model);

      cancelAnimationFrame(updateId); 
    }
    this.DestroyCollider = function(){
      //删除碰撞体
      _Global.YJ3D._YJSceneManager.RemoveCollider(trigger);
      _Global.YJ3D._YJSceneManager.RemoveCollider(doorCollider); 
    }

    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(model.position, model.rotation);
    }


    let trigger = null;
    //创建碰撞体
    function CreateCollider() {

      pos.y = 1;
      //创建门的trigger
      trigger = _Global.YJ3D._YJSceneManager.CreateModelTrigger(new THREE.Vector3(1, 2, 1),
      model.position, model.quaternion, id, "door"
      );

      pos = new THREE.Vector3(0, 0, 0);
      //创建门的 collider
      _Global.YJ3D._YJSceneManager.CreateModelMeshCollider(doorCollider, doorCollider.scale);
    }
    //-------添加删除 开始------------


    var updateId = null;

    function update() {

      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
      }
      updateId = requestAnimationFrame(update);

    }

  }
}

export { YJDoor };