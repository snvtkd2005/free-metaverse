import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
class YJLoadGLtfTest {
  constructor(_this, scene, id,modelPath,size,name,pos,rota,texturePath) {


    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var mixer = null;//声明一个混合器变量
    let openAction, closeAction;

    var model = null;

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
        },
        onProgress,
        onError
      );
      update();
    }


    function Init () {

      // console.log("加载门模型");
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/js/draco/gltf/');

      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {

        const model = gltf.scene;
        // console.log(" gltf ",gltf);
        // console.log(" model ",model);
        model.position.set(pos.x, pos.y, pos.z); // 
        model.rotation.set(rota.x, rota.y, rota.z); // 
        model.scale.set(size, size, size);

        model.tag = name;
        model.name = id;
        // scene.add(model);
        
        let body = LoopFindChild("wjjPlane001",model); 
        // console.log("body = " , body);
        scene.add(body);
        body.position.set(pos.x, pos.y, pos.z); // 
        body.rotation.set(rota.x, rota.y, rota.z); // 
        body.scale.set(size, size, size);

        pos.y = 1;
        //创建门的 collider
        _Global.YJ3D._YJSceneManager.CreateModelMeshCollider(body,body.scale,
        pos ,  body.quaternion 
        );

        update();

      }, undefined, function (e) {

        console.error(e);

      });

    }
    function LoopFindChild(childName,parent){
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if(cn[1] == childName){
          return c;
        }
        if(c.children.length>0){
          let cc = LoopFindChild(childName,c);
          if(cc!=null){
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
      _this.SendSceneState(this.id,name,isOpen);


    }
    this.GetAnimState = function (){
      return isOpen;
    }


    //从外接收，获取开关状态更新动画
    this.SetState = function (b) {
      if(isOpen == b){return;}
      isOpen = b;
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

    }

    function update() {

      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
      }
      requestAnimationFrame(update);

    }

  }
}

export { YJLoadGLtfTest };