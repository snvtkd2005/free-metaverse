import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// 挖掘机
class YJDigger {
  constructor(_this, scene, id, modelPath, size, name, pos, rota, createCollider, _state) {

    this.id = id;
    this.pos = null;
    this.rota = null;
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

    let model;
    this.GetModel = function(){
      return model;
    }
    let body, bigArm, frontArm, bucket, joystickLeft, joystickCenter, joystickRight;
    let diggerTrigger;
    let wjjPlane001;
    function Init() {
      // this.pos = pos;
      // this.rota = rota;
      // console.log("加载门模型");
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/js/draco/gltf/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.load(modelPath, function (gltf) {

        model = gltf.scene;

        model.position.set(pos.x, pos.y, pos.z); // 
        model.rotation.set(rota.x, rota.y, rota.z); // 
        model.scale.set(size, size, size);

        model.tag = name;
        model.name = id;
        scene.add(model);

        // console.log("加载挖掘机",model);        
        body = LoopFindChild("body", model);
        bigArm = LoopFindChild("bigArm", model);
        frontArm = LoopFindChild("frontArm", model);
        bucket = LoopFindChild("bucket", model);
        joystickLeft = LoopFindChild("joystickLeft", model);
        joystickCenter = LoopFindChild("joystickCenter", model);
        joystickRight = LoopFindChild("joystickRight", model);

        diggerTrigger = LoopFindChild("diggerTrigger", model);


        // console.log(" bigArm.rotation.y " ,  bigArm.rotation.y);

        if (diggerTrigger != null) {
          diggerTrigger.visible = false;
        }

        if (createCollider) {
          //创建collider 
          CreateCollider();

          if (_state != undefined) {
            _SetState(_state);
          }
        }

      LoadCompleted();

        // console.log(" 提取 body " , body);
        // update();
      }, undefined, function (e) {
        console.error(e);
      });

    }

    function LoopFindChild(childName, parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if (cn[1] == childName) {
          c.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              item.receiveShadow = true;
            }
          });
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindChild(childName, c);
          if (cc != null) {
            cc.traverse(function (item) {
              if (item instanceof THREE.Mesh) {
                item.castShadow = true;
                item.receiveShadow = true;
              }
            });
            return cc;
          }
        }
      }
      return null;
    }

    Init();


    var state = {};
    //从外接收，获取开关状态更新动画
    this.SetState = function (_state) {
      // console.log("接收挖掘机状态 " ,_state);
      if (_state == undefined || _state == false || _state == "false") { 
        return; }
      state = _state;
      // state= {bodyRota:2,bigArmRota:2,frontArmRota:1,bucketRota:1};
      ChangeModel();
    }



    //大臂旋转角度限制
    let bigArmRange = new THREE.Vector2(-0.5, 1);
    let frontArmRange = new THREE.Vector2(-0.43, 1.58);
    let bucketRange = new THREE.Vector2(-1.60, 2.33);
    function Clamp(value, min, max) {
      if (value <= min) { value = min; }
      if (value >= max) { value = max; }
      return value;
    }
    function ChangeModel() {
      if(body == undefined || bigArm == undefined ||
        frontArm == undefined || bucket == undefined){
          return;
        }
      // console.log(state);
      if (state.bodyRota != undefined) {
        body.rotation.z = state.bodyRota;
      }
      if (state.bigArmRota != undefined) {
        let rota = state.bigArmRota;
        //限制机械臂旋转角度
        rota = Clamp(rota, bigArmRange.x, bigArmRange.y);
        bigArm.rotation.y = rota;
      }
      if (state.frontArmRota != undefined) {
        let rota = state.frontArmRota;
        rota = Clamp(rota, frontArmRange.x, frontArmRange.y);

        frontArm.rotation.y = rota;
      }
      if (state.bucketRota != undefined) {
        let rota = state.bucketRota;
        rota = Clamp(rota, bucketRange.x, bucketRange.y);
        bucket.rotation.y = rota;
      }


      //更新铲斗的 collider
      _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(bucket, bucket.scale);
    }

    //本地操作 并向服务器发送
    this.SendState = function (nodeName, rota) { 

      // let body,bigArm,frontArm,bucket,joystickLeft,joystickCenter,joystickRight;


      state.inCtrling = true;

      if (nodeName == "body") {
        body.rotation.z += rota;
        state.bodyRota = body.rotation.z;
      }
      if (nodeName == "bigArm") {
        bigArm.rotation.y += rota;
        state.bigArmRota = bigArm.rotation.y;
      }
      if (nodeName == "frontArm") {
        frontArm.rotation.y += rota;
        state.frontArmRota = frontArm.rotation.y;
      }
      if (nodeName == "bucket") {
        bucket.rotation.y += rota;
        state.bucketRota = bucket.rotation.y;
      }

      ChangeModel();

      _this.SendSceneState(this.id, name, state);
      // state= {bodyRota:2,bigArmRota:2,frontArmRota:1,bucketRota:1};
    }


    //-------添加删除 开始------------
    //同步服务器上的其他客户端创建的模型的状态
    function _SetState(_state) {
      if (_state == undefined || _state == false) { return; }
      state = _state;
      ChangeModel();
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
      this.DestroyCollider();
      scene.remove(model);

    }
    this.DestroyCollider = function(){
      if (model != null) {
        //删除碰撞体 
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {  
            item.geometry.dispose();
            try {
              item.material.dispose();
            } catch (error) {
            }
          }
        }); 
      }
      //删除碰撞体
      _Global.YJ3D._YJSceneManager.RemoveCollider(trigger);
      _Global.YJ3D._YJSceneManager.RemoveCollider(bucket);
      _Global.YJ3D._YJSceneManager.RemoveCollider(wjjPlane001);
    }

    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(model.position, model.rotation);
    }


    let trigger = null;
    //创建碰撞体
    function CreateCollider() {
      trigger = _Global.YJ3D._YJSceneManager.CreateModelTrigger(new THREE.Vector3(6, 5, 6),
        model.position, model.quaternion, id, "digger"
      );


      //创建铲斗的 collider
      _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(bucket, bucket.scale);

      wjjPlane001 = LoopFindChild("wjjPlane001", model);
      _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(wjjPlane001, wjjPlane001.scale);

    }
    //-------添加删除 开始------------

    function update() {

      requestAnimationFrame(update);
      // if(body!=null){
      //   body.rotation.z += 0.1;
      // }
    }

  }
}

export { YJDigger };