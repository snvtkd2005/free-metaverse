




// 角色头像做法：用新的一套 scene、renderer、camera、角色模型

import * as THREE from "three";

  
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { YJLoadAvatar } from "./YJLoadAvatar.js";

// 角色头像相机/场景

class YJ3dScene_playerHeader {
  constructor(container, _this) {
    let scope = this;
    let scene;
    let renderer;
    let camera; 
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock(); 

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let group;
    let width, height;
    let playerGroup;

    let avatar = null;

    Init();
    function Init() {
      console.log("初始化小窗3d场景");
      scene = new THREE.Scene(); // 场景
      // let width = 300;
      // let height = 300;
      width = container.clientWidth;
      height = container.clientHeight;
      // let width = window.innerWidth;
      // let height = window.innerHeight;
      camera = new THREE.PerspectiveCamera(
        60,
        width / height,
        0.01,
        10000
      );
      scene.add(camera);
      camera.position.set(-0.2,1.6,0.5);
      camera.lookAt(0,1.6,0);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true; // 开启阴影
      renderer.setPixelRatio(1); //推荐

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      // var ambient = new THREE.AmbientLight(0x666666); //添加环境光
      scene.add(ambient); //光源添加到场景中
 
      // scene.background = 0x666666;
      // console.log(container);
      container.append(renderer.domElement);
 

      group = new THREE.Group();
      scene.add(group);


      // let player =  _this.$parent.$refs.YJmetaBase.ThreejsPanel.YJPlayer.GetPlayerGroup().clone();
      // console.log(player);
      // scene.add(player);
      // player.position.set(0,0,0);
      let avatarData =  _this.$parent.$refs.YJmetaBase.ThreejsPanel.YJPlayer.GetavatarData();
      LoadAvatar(avatarData.modelPath, avatarData.height, avatarData.animationsData);

      update();

      // CreateTestBox();
    } 
    function CreateTestBox() {

      let pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let id = "11";
      let modelPath = "models/Scene/fence001.gltf";
      let modelName = "";
      let group = new THREE.Group();
      const loader = new GLTFLoader();
      loader.load(_this.$parent.$publicUrl + modelPath, function (gltf) {

        let model = gltf.scene;
        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
        // model.scale.set(size.x, size.y, size.z);


        group.add(model);
        scene.add(group); 
 
 
      }, undefined, function (e) {

        console.log("加载模型出错"+modelPath);
        console.error(e);
      }); 

    }


    function LoadAvatar(modelPath,height, animData) {
      
      camera.position.set(-0.2,height-0.1,0.5);
      camera.lookAt(0,height-0.1,0);
      // console.log("切换角色11");
      avatar = new YJLoadAvatar(
        _this.$parent.$refs.YJmetaBase.ThreejsPanel,
        scene,
        _this.$parent.GetPublicUrl() + modelPath,
        animData,
        scope,
        (_playerObj) => {
          clearGroup(group);
          group.add(_playerObj);
        }
      );
    }

    let playerHeight;
    // 此函数用来做npc
    this.ChangeAvatarByCustom = function (avatarData, callback) {

      console.log("切换角色头像",avatarData);
      playerHeight = avatarData.height;
      
      camera.position.set(-0.2,playerHeight-0.1,0.5);
      camera.lookAt(0,playerHeight-0.1,0);

      if (avatar == null) {
        avatar = new YJLoadAvatar(
          _this,
          scene,
          _this.$parent.GetPublicUrl() + avatarData.modelPath,
          avatarData.animationsData,
          (_playerObj) => {
            clearGroup(group);

            group.add(_playerObj);
            if(callback){
              callback(avatar);
            }

          }
        );
        return;
      } else {

        avatar.ChangeAvatar(
          _this.$parent.GetPublicUrl() + avatarData.modelPath,
          avatarData.animationsData,
          (_playerObj) => {
            clearGroup(group);
            group.add(_playerObj);
            _playerObj.position.set(0, 0, 0); //原点位置
            if(callback){
              callback(avatar);
            }

          }
        );
      }

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
    function update() {
      requestAnimationFrame(update);
      renderer.render(scene, camera);
    }
  }
}

export { YJ3dScene_playerHeader };