


// 3d角色展示页面


import * as THREE from "three";
 
import { YJController } from "./YJController.js";
import { YJPlayerAnimData } from "./YJPlayerAnimData";
import { YJPlayer } from "./YJPlayer.js";
import { YJEquip } from '../components/YJEquip'; 
import { YJSceneManager } from "./YJSceneManagerSimple";
// import { YJ3dScene_margeTexture } from "./YJ3dScene_margeTexture.js";


class YJ3dScene_playerSelect {
  constructor(container, _this) {
    let scope = this;
    let _YJPlayer = null;
    let _YJEquip = null;
		this.GetEquip = function () {
			return _YJEquip;
		}
    let _YJPlayerAnimData = null;
    let _YJSceneManager = null;
    this.CreateOrLoadPlayerAnimData = function () {
      if (_YJPlayerAnimData != null) {
        return _YJPlayerAnimData;
      }
      _YJPlayerAnimData = new YJPlayerAnimData();
      _Global._YJPlayerAnimData = _YJPlayerAnimData;
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
    let width, height;
    let group, playerGroup;

    let windowWidth, windowHeight;

    // let _YJ3dScene_margeTexture = null;

    function Init() {

      _Global.YJ3DSelect = scope;
      if(_Global.YJ3D == undefined){
        _Global.YJ3D = {}; 
      }
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
      scene.add(ambient); //光源添加到场景中

      // if (_YJ3dScene_margeTexture == null) {
      //   _YJ3dScene_margeTexture = new YJ3dScene_margeTexture();
      // }

      //雾效
      scene.background = new THREE.Color(0x666666);


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
      InitSceneManager();

      group = new THREE.Group();
      scene.add(group);

      playerGroup = new THREE.Group(); 
      scene.add(playerGroup);
      let playerParent = _YJController.GetPlayerParent();
      playerGroup.add(playerParent);
      _YJController.SetAmmoPlayer(group);

      _YJController.SetCameraOffset(new THREE.Vector3(0, 0, 1.5));
      _YJController.SetCameraOffsetY(0.5); 

      _YJController.ChangeCtrlState();

      // 强制横屏
      _YJController.SetforcedLandscape(width > height);
 
      // let targetRota = new THREE.Vector3(0, 0, 0); //4
      let targetRota = new THREE.Vector3(0, -Math.PI / 2, 0); //4
      _YJController.SetTargetRota(targetRota);

      _YJController.SetMinMax({ x: -1.25, y: 0.3 });
      _YJController.SetCanMouseWheel(true);

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
        renderer.domElement
      );
      _YJController.wheelMin = -30;
      _YJController.wheelMax = -0.01;
      //设置角色移动速度
      // _YJController.SetMoveSpeed(0.1);
      _Global.YJ3DSelect.YJController = _YJController;
      if(_Global.YJ3D.YJController == undefined){
        _Global.YJ3D.YJController = _YJController;
      }
    }

    function InitSceneManager() {
      console.log("初始化场景管理器");
      _YJSceneManager = new YJSceneManager(
        scene,
        renderer,
        camera,
        _this
      );
      _Global.YJ3DSelect._YJSceneManager = _YJSceneManager;

      if(_Global.YJ3D._YJSceneManager == undefined){
        _Global.YJ3D._YJSceneManager = _YJSceneManager;
      }
    }

    let avatar = null;

    this.copyTextureToTexture = function (sourceTex, addTex, callback) {
      // _YJ3dScene_margeTexture.margeTexture(sourceTex, addTex, callback); 
    }
    this.ChangeSkinCompleted = function () {
      playerGroup.visible = true;
    }
    this.NeedChangeSkin = function () {
      playerGroup.visible = false;
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
    let avatarId = 0;
    let de2reg = 57.3248407;
    function SetRotaArray(model, rota) {
      if (!rota) {
        model.rotation.set(0, 0, 0);
        return;
      }
      model.rotation.set(rota[0] / de2reg, rota[1] / de2reg, rota[2] / de2reg);
    }
    let avatarData = null;
    this.GetavatarData = function () {
      return avatarData;
    }
    
		this.GetData = function () { 
			return {
				avatarData: avatarData,
			}; 
		}
		this.applyEvent = function (e, v, v2, v3) { 
		}
    
		this.GetBoneVague = function (boneName, callback) {
			_YJPlayer.GetBoneVague(boneName, callback);
		}
    // 此函数用来做npc
    this.ChangeAvatarByCustom = function (_avatarData, callback) {

      avatarData = _avatarData;
      playerHeight = avatarData.height;
      playerName = avatarData.name;
      avatarId = avatarData.id;
      let modelPath = "";
      if (avatarData.modelPath.includes("http")) {
        modelPath = avatarData.modelPath;
      } else {
        modelPath = _this.GetPublicUrl() + avatarData.modelPath;
      }
      let modelScale = avatarData.modelScale;
      let rotation = avatarData.rotation;

      console.error(" 角色选择页 准备加载角色 ", avatarData);
      SetViewHeight();

      if (_YJPlayer == null) {

        _YJPlayer = new YJPlayer(playerGroup, true);
        avatar = _YJPlayer;
        _YJPlayer.CreateNameTrans(playerName);

        _YJPlayer.LoadPlayer(avatarId, () => {

          _YJPlayer.ChangeAnimDirect("idle");
          if (callback) {
            callback(_YJPlayer);
          }
        });

        _Global.YJ3DSelect.YJPlayer = _YJPlayer;

        _YJController.SetPlayer(_YJPlayer);

        if (_YJEquip == null) {
          _YJEquip = new YJEquip(scope, false);
        }
        
      } else {
        _YJPlayer.ChangeAvatar(avatarId, () => {
          _YJPlayer.ChangeAnimDirect("idle");
          if (callback) {
            callback(_YJPlayer);
          }
          // setTimeout(() => {
          //   group.visible = true;
          // }, 1000);
        });

      } 

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
        if(_YJPlayer){
          _YJPlayer._update();
        }
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