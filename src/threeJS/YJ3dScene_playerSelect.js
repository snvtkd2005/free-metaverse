


// 3d角色展示页面


import * as THREE from "three";


import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { YJLoadModel } from "./YJLoadModel.js";

import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJController } from "./YJController.js";
import { YJTransformManager } from "./YJTransformManager.js";

import { YJ3dScene_margeTexture } from "/@/threeJS/YJ3dScene_margeTexture.js";
import { createAnimationClip } from "/@/utils/utils_threejs.js";


import { YJPlayerAnimData } from "./YJPlayerAnimData";


class YJ3dScene_playerSelect {
  constructor(container, _this) {
    let scope = this;
    let _YJPlayerAnimData = null
    this.CreateOrLoadPlayerAnimData = function () {
      if (_YJPlayerAnimData != null) {
        return _YJPlayerAnimData;
      }
      _YJPlayerAnimData = new YJPlayerAnimData(_this, scope);
      return _YJPlayerAnimData;
    }


    let scene;
    let renderer;
    let camera;
    let _YJController = null;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();
    let _YJAmmo;
    let lookatList = [];

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let group;
    let width, height;
    let playerGroup;

    let windowWidth, windowHeight;
    this._YJTransformManager = null;

    let _YJ3dScene_margeTexture = null;

    function Init() {

      scope.CreateOrLoadPlayerAnimData();

      scene = new THREE.Scene(); // 场景
      // let width = 300;
      // let height = 300;
      width = container.clientWidth;
      height = container.clientHeight;

      console.log("初始化小窗3d场景", width, height);

      // let width = window.innerWidth;
      // let height = window.innerHeight;
      camera = new THREE.PerspectiveCamera(
        60,
        width / height,
        0.01,
        10000
      );
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true; // 开启阴影
      renderer.setPixelRatio(2); //推荐

      renderer.outputEncoding = THREE.sRGBEncoding;

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      // var ambient = new THREE.AmbientLight(0x666666); //添加环境光
      scene.add(ambient); //光源添加到场景中



      scope._YJTransformManager = new YJTransformManager(scope, scene, camera, renderer, _this);

      if (_YJ3dScene_margeTexture == null) {
        _YJ3dScene_margeTexture = new YJ3dScene_margeTexture();
      }
      //雾效
      // scene.background = new THREE.Color(0x666666);


      // ground 开始--------------
      // var loaderTex_d = new THREE.TextureLoader();
      // var texture = loaderTex_d.load(
      //    "./public/images/box.jpg"
      // );
      // //贴图平铺
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(50, 50);
      // const mesh = new THREE.Mesh(
      //   new THREE.PlaneGeometry(200, 200, 20, 20),
      //   new THREE.MeshStandardMaterial({
      //     map: texture,
      //   })
      // );
      // mesh.position.y = 0.000;
      // mesh.rotation.x = -Math.PI / 2;
      // mesh.receiveShadow = true;
      // mesh.name = "floor";
      // scene.add(mesh);

      // ground 结束--------------

      // console.log(container);
      container.append(renderer.domElement);

      InitYJController();



      playerGroup = new THREE.Group();
      scene.add(playerGroup);
      let playerParent = _YJController.GetPlayerParent();
      playerGroup.add(playerParent);
      _YJController.SetAmmoPlayer(playerGroup);

      _YJController.SetCameraOffset(new THREE.Vector3(0, 0, -1.5));
      _YJController.SetCameraOffsetY(0.5);
      // _YJController.SetCameraOffset(new THREE.Vector3(0, 0, -3.5));
      // _YJController.SetCameraOffsetY(0.9);

      _YJController.ChangeCtrlState();

      // 强制横屏
      _YJController.SetforcedLandscape(width > height);

      let targetRota = new THREE.Vector3(0, -Math.PI / 2, 0); //4
      _YJController.SetTargetRota(targetRota);

      _YJController.SetMinMax({ x: -1.25, y: 0.3 });
      _YJController.SetCanMouseWheel(true);
      group = new THREE.Group();
      scene.add(group);

      update();

      setInterval(() => {
        UpdateCheckWindowResize();
      }, 20);
    }

    let hasCar = false;
    let otherModel = null;
    let publicUrl = "";
    this.SetPublicUrl = function (url) {
      publicUrl = url;
    }
    this.LoadModel = function (modelPath) {
      modelPath = "models/car/car001.gltf";
      loadGltf("carPos", _this.GetPublicUrl() + modelPath, new THREE.Vector3(-2, 0, 0), new THREE.Vector3(0, Math.PI, 0),
        new THREE.Vector3(1, 1, 1), (model) => {
          otherModel = model;
        });
      hasCar = true;
      SetViewHeight();
    }
    this.DelModel = function () {
      if (hasCar) {
        hasCar = false;
        clearGroupFn(otherModel);
      }
      SetViewHeight();
    }
    function clearGroupFn(group) {
      if (group == null) { return; }
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          //移除碰撞体
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
    function loadGltf(name, modelPath, pos, rota, size, callback) {

      let group = new THREE.Group();

      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath('./public/threeJS/draco/gltf/');
      // dracoLoader.setDecoderConfig({ type: "js" });
      // dracoLoader.preload();

      const loader = new GLTFLoader();

      // loader.setDRACOLoader(dracoLoader);


      loader.load(modelPath, function (gltf) {

        let model = gltf.scene;
        model.name = name;

        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);
        model.scale.set(size.x, size.y, size.z);

        group.add(model);
        scene.add(group);

        // console.log(" 加载模型完成 " ,model );
        // console.log(" 加载模型完成 ", name);
        if (callback) {
          callback(group);
        }
        // LoadCompleted();
      }, undefined, function (e) {

        console.log("加载模型出错" + modelPath);
        console.error(e);
      });

    }

    function UpdateCheckWindowResize() {
      if (width == container.clientWidth && height == container.clientHeight) {

        if (windowWidth == window.innerWidth && windowHeight == window.innerHeight) {

        } else {

          windowWidth = window.innerWidth;
          windowHeight = window.innerHeight;
          if (windowWidth <= windowHeight) {

            // 强制横屏
            _YJController.SetforcedLandscape(true);
          } else {

            _YJController.SetforcedLandscape(false);
          }

          if (width <= height) { 
            _YJController.SetforcedLandscape(false);
          } else {

          }
        }
      } else {

        width = container.clientWidth;
        height = container.clientHeight;

        if (width <= height) {
          // 强制横屏
          _YJController.SetforcedLandscape(true);
        } else {
          _YJController.SetforcedLandscape(false);

        }

        onWindowResize(width, height);

      }


    }
    // 浏览器窗口变动触发的方法
    function onWindowResize(w, h) {

      // console.log("改变窗口大小");

      if (camera == null) {
        return;
      }
      // 重新设置相机宽高比例
      camera.aspect = w / h;
      // 更新相机投影矩阵
      camera.updateProjectionMatrix();
      // 重新设置渲染器渲染范围
      renderer.setSize(w, h);

    }

    //初始化第三人称控制器
    function InitYJController() {
      _YJController = new YJController(
        scene,
        camera,
        renderer.domElement,
        _this
      );
      _YJController.wheelMin = -30;
      _YJController.wheelMax = -0.01;
      //设置角色移动速度
      // _YJController.SetMoveSpeed(0.1);
    }

    let avatar = null;

    this.copyTextureToTexture = function (sourceTex, addTex, callback) {
      _YJ3dScene_margeTexture.margeTexture(sourceTex, addTex, callback);
      // const position = new THREE.Vector2(0, 0);
      // renderer.copyTextureToTexture(position, dataTexture, diffuseMap);
      // console.log("使用renderer合并纹理");
      // return diffuseMap;
    }
    this.ChangeSkinCompleted = function () {
      group.visible = true;
    }
    this.NeedChangeSkin = function () {
      group.visible = false;
    }

    function SetViewHeight() {

      if (hasCar) {
        _YJController.SetCameraWheelPos(-7);
        playerGroup.position.x = -2;
        _YJController.SetTargetRota(new THREE.Vector3(0, -Math.PI / 4, -Math.PI / 16));
      } else {
        playerGroup.position.x = 0;
        _YJController.SetTargetRota(new THREE.Vector3(0, -Math.PI / 2, 0));
        _YJController.SetCameraOffset(new THREE.Vector3(0, playerHeight / 2, playerHeight * -1.5));
        _YJController.SetCameraOffsetY(playerHeight * 0.5);
        _YJController.OnlySetCtrlView();
      }
    }
    let playerHeight;
    let playerName = "";
    // 此函数用来做npc
    this.ChangeAvatarByCustom = function (avatarData, callback) {
      clearGroup(group);

      playerHeight = avatarData.height;
      playerName = avatarData.name;
      // console.log("切换角色11 高度为 ", playerHeight);
      SetViewHeight();
      if (avatar == null) {
        avatar = new YJLoadAvatar(
          _this,
          scene,
          _this.GetPublicUrl() + avatarData.modelPath,
          avatarData.animationsData,
          scope,
          (_playerObj) => {
            console.log(" 加载角色完成 ===", _playerObj);
            setTimeout(() => {
              group.add(_playerObj);
              _playerObj.position.set(0, 0, 0); //原点位置
            }, 500);

            if (callback) {
              callback(avatar);
            }

            let boneLength = 0;
            _playerObj.traverse((item) => {
              if (item.type == "Bone") {
                // console.log(item);
                boneLength++;
              }
            });
            console.log("骨骼总数为 ", boneLength);

            // loadAssset(_this.GetPublicUrl() + "models/player/farmplayer/anim.json", (data) => {
            //   let animName = "animTest";
            //   let _AnimationClip = createAnimationClip(animName,data);
            //   console.log("获取动画data 转 animation clip ", _AnimationClip);
            //   avatar.ChangeAnimByAnimData(animName,_AnimationClip);
            // });

            // avatar.ChangeAnimDirect("idle");
            // avatar.ChangeAnimDirect("walk");
          },
          (animName) => {
            scope.CreateOrLoadPlayerAnimData().GetExtendAnim(playerName, animName, (isLoop, anim) => {
              avatar.ChangeAnimByAnimData(animName, isLoop, anim);
            });
          }
        );
        return;
      } else {

        avatar.ChangeAvatar(
          _this.GetPublicUrl() + avatarData.modelPath,
          avatarData.animationsData,
          (_playerObj) => {
            // console.log(" 加载角色完成 ===");

            group.add(_playerObj);
            _playerObj.position.set(0, 0, 0); //原点位置
            if (callback) {
              callback(avatar);
            }

            avatar.ChangeAnimDirect("idle");

            // console.log(group);
          }
        );
      }

    }

    //animName  animTest
    //path  _this.GetPublicUrl() + "models/player/farmplayer/anim.json"
    this.LoadAnimByTxt = function (animName, path) {
      loadAssset(_this.GetPublicUrl() + path, (data) => {
        let _AnimationClip = createAnimationClip(animName, data);
        console.log("获取动画data 转 animation clip ", _AnimationClip);
        avatar.ChangeAnimByAnimData(animName, _AnimationClip);
      });
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

    // 角色注释点参考物体
    let lookatPosRef = null;
    let lookAtPos = new THREE.Vector3(0, 0.81, -0.3);
    // 换装
    this.ChangeSkin = function (targetPath, title, mode, faceSourcePath) {
      avatar.ChangeSkin(targetPath, title, mode, faceSourcePath);

      //
      if (lookatPosRef == null) {
        lookatPosRef = new THREE.Group();
        // lookatPosRef = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1),new THREE.MeshBasicMaterial({color:0xffffff}));
        scene.add(lookatPosRef);
        lookatPosRef.position.copy(lookAtPos);
        avatar.SetLookatPosRef(lookatPosRef);
      }
    }

    // 创建npc有效碰撞区域
    let collider = null;
    this.CreateValidArea = function (size) {
      if (collider != null) {
        playerGroup.remove(collider);
      }
      const geometry = new THREE.CylinderGeometry(size, size, 2, 18, 5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.2,
      });
      collider = new THREE.Mesh(geometry, material);
      playerGroup.add(collider);

    }

    this.GetFaceModel = () => {
      avatar.GetFaceModel();
    }
    this.ResetToTPose = () => {
      avatar.ResetToTPose();
    }
    this.ChangeAnimDirect = (animName) => {
      avatar.ChangeAnimDirect(animName);
    }
    this.clearGroup2 = () => {
      avatar.ClearAvatar(); return;
    }
    function clearGroup() {
      if (avatar == null) { return; }
      avatar.ClearAvatar(); return;
    }

    var updateId = null;

    function update() {
      updateId = requestAnimationFrame(update);
      const delta = clock.getDelta(); //获取自上次调用的时间差
      timeStamp += delta;
      //限制帧率在30帧
      if (timeStamp > singleFrameTime) {
        renderer.render(scene, camera);
        _YJController.update();
        // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
        timeStamp = timeStamp % singleFrameTime;
      }

    }
    this.Close = function () {
      cancelAnimationFrame(updateId);
      scene.traverse(function (item) {
        if (item.type === 'Mesh') {
          //移除碰撞体
          item.geometry.dispose();
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
              if (item.material.map) {
                item.material.map.dispose();
                item.material.map = undefined;
              }
              item.material.dispose();
              item.material = undefined;
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
                if (item.material[i].map) {
                  item.material[i].map.dispose();
                  item.material[i].map = undefined;
                }
                item.material[i].dispose();
                item.material[i] = undefined;
              }
            } else {
              if (item.material) {
                if (item.material.map) {
                  item.material.map.dispose();
                  item.material.map = undefined;
                }
                item.material.dispose();
                item.material = undefined;
              }
            }
            item = undefined;
          }
      })

      scene.remove.apply(scene, scene.children);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement = null;
      renderer = null;
      scene.clear();
      scene = null;
      camera = null;
    }

    let mouseX = 0;
    let mouseY = 0;
    let mouseXold = 0;
    let mouseYold = 0;
    function onMouseMove(event) {

      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      var x = mouseX - mouseXold;
      var y = mouseY - mouseYold;
      event.preventDefault();

      // console.log(mouseX,mouseY);
      // console.log(x,y);
      if (lookatPosRef) {
        // lookatPosRef.position.y += y;
        // lookatPosRef.position.x += x;

        lookatPosRef.position.y = mouseY + 0.5;
        lookatPosRef.position.x = (mouseX - 0.5) * -1;
      }

      mouseXold = mouseX;
      mouseYold = mouseY;
    };

    container.addEventListener('mousemove', onMouseMove);

    Init();


  }
}

export { YJ3dScene_playerSelect };