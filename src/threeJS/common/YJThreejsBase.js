import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { YJRaycaster } from "./YJRaycaster.js";
import { YJController } from "./YJController.js";
import { YJPlayer } from "./YJPlayer.js";
import { YJSceneManager } from "./YJSceneManagerEditor.js";

// import { YJshader_grass } from "../loader/YJshader_grass.js";
 
class YJThreejsBase {
  constructor(container, document, _this) {
    let scope = this;
    let scene = null;
    let camera = null;
    let renderer = null;
    let pointsParent = null;

    let hasStats =  true;

    let _YJRaycaster = null;
    let _YJPlayer = null;
    let _YJController = null;

    let _YJSceneManager = null;

    let platform = "pcweb";
 
 
   let pointerLock = false;
   let windowWidth = 0;
   let windowHeight = 0;

    // windowWidth = container.clientWidth;
    // windowHeight =container.clientHeight;

    // windowWidth = window.innerWidth;
    // windowHeight = window.innerHeight;

    let canAddListner = true;
 
    let infocus = true;

    let enableRenderer = true;

    let userData = null;
    let pauseRender = false;

    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();
    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let stats;

    // 初始化场景
    this.initScene = function () {
      scene = new THREE.Scene(); // 场景
      scene.name = "scene";

      camera = new THREE.PerspectiveCamera(
        60,
        windowWidth / windowHeight,
        0.1,
        1000
      );
      let myCtrlRbChild = new THREE.Group();
      myCtrlRbChild.name = "myCtrlRbChild";
      camera.add(myCtrlRbChild);
      myCtrlRbChild.rotateY(-Math.PI / 2);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(windowWidth, windowHeight);

      renderer.shadowMap.enabled = true; // 开启阴影
      // renderer.shadowMap.width = 2048;
      // renderer.shadowMap.height = 2048;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); //推荐

      //添加组
      pointsParent = new THREE.Group();
      pointsParent.name = "pointsParent";
      scene.add(pointsParent);

      // scene.add(camera);

      if (hasStats) {
        stats = new Stats();
        stats.domElement.style.position = "absolute";
        stats.domElement.style.width = "80px";
        stats.domElement.style.height = "48px";
        stats.domElement.style.left = windowWidth - 80 + "px";
        stats.domElement.style.top = "60px";
        stats.domElement.style.zIndex = "9999";
        container.appendChild(stats.domElement);
      }
      
      _Global.YJ3D.scene = scene; 
      _Global.YJ3D.renderer = renderer; 
      _Global.YJ3D.camera = camera; 

      // new YJshader_grass(scene);
    }

    //生成角色
    this.GeneratePlayer = function(callback) {
      console.log("创建角色", userData);
      _YJPlayer = new YJPlayer(
        scene,
        true, 
        (playerObj, playerGroup) => {
          if (playerObj == undefined) {
            return;
          }
          //在模型加载完成后，把模型放到控制器里面，让控制器来控制模型位置和朝向
          _YJController.SetPlayerToCamTarget(playerObj);
          _YJController.SetPlayerGroup(playerGroup);
          if (callback) {
            callback();
          }
        }
      );
      _Global.YJ3D.YJPlayer = _YJPlayer; 
 
      _YJPlayer.CreateNameTrans(_Global.user.name);
      // userData.avatarId = 1709553546790;
      if (userData != null) {
        _YJPlayer.LoadPlayer(userData.avatarId,()=>{
          _YJPlayer.ChangeAnimDirect("idle");
        });
      } else {
        _YJPlayer.LoadPlayer("none");
      }

      _YJController.SetPlayer(_YJPlayer);
    }

    //#region 鼠标射线检测
    //监听鼠标点击物体
    this.initYJRaycaster = function () { 
      _YJRaycaster = new YJRaycaster( 
        scene,
        camera,
        renderer.domElement,
        (hitObject, hitPoint) => {
          if (hitObject == null) {
            this.ClickModel(hitObject);
            // _Global.applyEvent("左键点击模型",hitObject,hitPoint);
            selected = false; 
            return;
          }  
          this.ClickModel(hitObject);
          // _Global.applyEvent("左键点击模型",hitObject,hitPoint);
        },
        (hoverObject, hoverPoint) => {
          this.HoverObject(hoverObject, hoverPoint);
        },
        (hotPoint, hotPointHitPoint) => {
          let tag = hotPoint.tag;
          // console.log("点击 可点击模型 ", tag, hotPoint.name,hotPoint);
          if (tag == "链接logo") {
            this.ClickHotPointOwner(hotPoint);
          }
          if (tag == "hotPoint") {
            this.ClickHotPoint(hotPoint.modelData, hotPoint.owner);
          } 
        },
        (hit, point) => {
          // 右键点击空白位置
          this.RightClick(hit, point);
          // console.log("点击右键");
        },
        // 点击合批物体 InstancedMesh
        (InstancedMeshOwner, index) => {
          this.ClickInstancedMesh(InstancedMeshOwner, index);
        }
      );

      _Global.YJ3D.YJRaycaster = _YJRaycaster; 

    }

    // 设置光标图标
    this.SetCursor = function (cursor) {
      // console.log("切换光标 2 ", cursor);
      if (cursor == "") {
        if (customCursor) {
          document.body.style.cursor = `url(),auto`;
          customCursor = false;
          cursorUrl = cursor;
        }
        return;
      }
      if (cursorUrl == cursor) {
        return;
      }

      customCursor = true;
      cursorUrl = cursor;
      // document.body.style.cursor = cursor;
      // document.body.style.cursor =
      //   `url(${cursor}),pointer`; //显示手型光标

      document.body.style.cursor = "none"; 
    }

    // 点击实例化模型
    this.ClickInstancedMesh = function (InstancedMeshOwner, index) {
      // if (_this.$parent.$parent.ClickInstancedMesh) {
      //   _this.$parent.$parent.ClickInstancedMesh(InstancedMeshOwner, index);
      // }
    }
    //点击热点
    this.ClickHotPoint = function (modelData, owner) {
      if (_this.$parent.CreateHotContent) {
        _this.$parent.CreateHotContent(modelData, owner);
      }
      if (_this.$parent.$parent.CreateHotContent) {
        _this.$parent.$parent.CreateHotContent(modelData, owner);
      }
    }

    // 点击NPC
    this.ClickPlayer = function (owner) {
      if (_this.$parent.ClickPlayer) {
        _this.$parent.ClickPlayer(owner);
      }
      if (_this.$parent.$parent.ClickPlayer) {
        _this.$parent.$parent.ClickPlayer(owner);
      }
    }

    //点击可交互的物品
    this.ClickModel = function (hitObject) {
      if (_this.$parent.ClickModel) {
        _this.$parent.ClickModel(hitObject);
      }
      if (_this.$parent.$parent.ClickModel) {
        _this.$parent.$parent.ClickModel(hitObject);
      }
    }
    this.ClickHotPointOwner = function (hitObject) {
      if (_this.$parent.ClickHotPointOwner) {
        _this.$parent.ClickHotPointOwner(hitObject);
      }
      if (_this.$parent.$parent.ClickHotPointOwner) {
        _this.$parent.$parent.ClickHotPointOwner(hitObject);
      }
    }

    this.RightClick = function (hitObject, hitPoint) {
      if (_this.$parent.RightClick) {
        _this.$parent.RightClick(hitObject, hitPoint);
      }
      if (_this.$parent.$parent.RightClick) {
        _this.$parent.$parent.RightClick(hitObject, hitPoint);
      }
    }
    this.ClickFloor = function (hitObject, hitPoint) {
      // console.log("点击地面");
      // 点击地面，角色转向目标点，角色移动到目标位置
      _YJController.lookAtPos(hitPoint);

      if (_this.$parent.$parent.ClickFloor) {
        _this.$parent.$parent.ClickFloor(hitObject);
      }
    }
    // function HoverObject(hoverObject, hoverPoint) {
    //   hoverObject.owner.SetMouseHover(true);
    // }

    this.HoverObject = function (hoverObject, hoverPoint) {
      // console.log(" in HoverObject ",hoverObject, hoverPoint);
      if (_this.$parent.HoverObject) {
        _this.$parent.HoverObject(hoverObject, hoverPoint);
      }
      if (_this.$parent.$parent.HoverObject) {
        _this.$parent.$parent.HoverObject(hoverObject, hoverPoint);
      }
    }
    //#endregion

    this.SetCanAddControllerListner = function(b) {
      canAddListner = b;
    }

    //让threejs获取焦点，div必须添加 tabindex="-1"
    this.threeJSfocus = function () {
      if (!canAddListner || infocus) {
        return;
      }
      console.log(" 点击 threeJS页面  ", canAddListner, infocus);

      container.focus();
      _YJController.addEventListener();
      infocus = true;
      _Global.infocus3d = true;
    }

    this.removeEventListener = function () {
      console.log(" 点击 其他页面 threeJS 失去焦点   ");

      infocus = false;
      _YJController.dispose();
      _YJRaycaster.SetMouseDown(false);
      _YJController.onMouseUp();
      _Global.infocus3d = false;
    }

    this.requestPointerLock = function () {
      let div_test = container;
      div_test.requestPointerLock =
        div_test.requestPointerLock ||
        div_test.msRequestPointerLock ||
        div_test.mozRequestPointerLock ||
        div_test.webkitRequestPointerLock;
      div_test.requestPointerLock();
      _YJController.addPointerEventListener();
    }
    this.SetPointerLock = function () {
      container.requestPointerLock();
      _YJController.SetPointerLock(true);
      pointerLock = true;
      document.addEventListener(
        "pointerlockchange",
        () => {
          if (document.pointerLockElement == that.$refs.container) {
            // console.log(" in pointerlockchange == ");
            _YJController.addPointerEventListener();
          } else {
            // console.log(" in pointerlockchange !!== ");
            _YJController.removePointerEventListener();
          }
        },
        false
      );
    }
    this.initListener = function () {

      container.addEventListener("click", (e) => {
        this.threeJSfocus();
        if (pointerLock) {
          this.requestPointerLock();
        }
      });

      container.addEventListener("mousedown", (e) => {
        this.threeJSfocus();
        _YJController.onMouseDown(e);
        _this.PlayVideo();
      });

      container.addEventListener("touchstart", (e) => {
        this.threeJSfocus();
        _YJController.mouseDragOn = true;
        _this.PlayVideo();
      });
    }


    //初始化第三人称控制器
    this.InitYJController = function () {
      _YJController = new YJController(
        scene,
        camera,
        renderer.domElement
      ); 
      //控制摄像机的初始角度
      let targetRota = new THREE.Vector3(0, 0, -3.14 / 8); //4
      _YJController.SetTargetRota(targetRota);
      _Global.YJ3D.YJController = _YJController; 

    }

    this.ResetRender = function() {
      renderer.setSize(windowWidth, windowHeight);
    },
    this.GetWidthHeight = function() {
      let w = windowWidth;
      let h = windowHeight;
      return {
        w,
        h,
      };
    }

    //设置渲染分辨率，降低会有锯齿，但流畅度会提升
    this.SetPixelRatio = function(f) {
      return;
      renderer.setPixelRatio(f); //推荐
      console.log("设置分辨率倍数 " + f);
    }
    // 截图
    this.getCanvasImg = function(width, height, offsetLeft, offsetTop) {
      if (width) {
        renderer.setSize(width, height);
        let canvas = renderer.domElement;
        renderer.render(scene, camera);
        setTimeout(() => {
          this.ResetRender();
        }, 200);
        return canvas.toDataURL("image/png");
      } else {
        let canvas = renderer.domElement;
        renderer.render(scene, camera);
        return canvas.toDataURL("image/jpeg");
      }
    }
    this.InitSceneManager = function (callback) {
      console.log("初始化场景管理器");
      _YJSceneManager = new YJSceneManager(
        scene,
        renderer,
        camera,
        _this,
        platform,
        callback
      );
      _Global.YJ3D._YJSceneManager = _YJSceneManager; 

    }
    this.InitSceneManagerAR = function (callback) {
      _YJSceneManager = new YJSceneManager(
        scene,
        renderer,
        camera,
        this,
        "ar",
        callback
      );
      _Global.YJ3D._YJSceneManager = _YJSceneManager; 
    }

    this.SetCameraFov = function(f) {
      if (camera == null) {
        return;
      }
      camera.fov = f;
      camera.updateProjectionMatrix();
    }


    //在登录页面，预加载三维场景
    this.BeforeLoadThreejs = function () {
      this.initScene();
      if (platform == "pcweb") {
        this.initListener();
        this.init_YJRaycaster(); 
        container.append(renderer.domElement);
        this.InitYJController();

        this.InitSceneManager();
      }
    }
    this.InitThreejs = function (UI, _userData) {
      console.log(" 初始化 threejs base ",_userData);
      // 初始化scene、camera、renderer
      this.initScene();

      container.append(renderer.domElement);

      if (_userData == undefined) {
      } else {
        userData = _userData;
        platform = userData.platform;
      }

      this.initListener();
      // 初始化射线检测
      this.initYJRaycaster();
      // 初始化视角控制器
      this.InitYJController();

      // 初始化场景管理器
      this.InitSceneManager(() => {
        //实时刷新
        this.renderScene();
      });
      // this.renderScene();
    }
    //实时刷新
    this.renderScene = function () {
      if (hasStats) {
        stats.update();
      }
      requestAnimationFrame(scope.renderScene);

      if (pauseRender) {
        return;
      }
      const delta = clock.getDelta(); //获取自上次调用的时间差

      timeStamp += delta;
      //限制帧率在30帧
      if (timeStamp > singleFrameTime) {
        _YJController.update();
        _YJSceneManager.update();

        if (enableRenderer) {
          renderer.render(scene, camera);
        }
        // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
        timeStamp = timeStamp % singleFrameTime;
 

        // console.error( 'THREE.WebGLState: 222222222', _Global.texImage2DError );
        // console.log( ' info ', this.renderer.info );
        // console.log( ' draw call ', this.renderer.info.render.calls  );
        // console.log( ' Scene polycount : ', this.renderer.info.render.triangles  );
        _this.statsText.drawcall = renderer.info.render.calls;
        _this.statsText.triangles = renderer.info.render.triangles;
      }
    }
 
    this.GetContainer = function() {
      return container;
    },
    // 移动端强制横屏时，射线检测点击位置要重新计算
    this.SetforcedLandscape = function (forcedLandscape) {
      if (_YJController) {
        _YJController.SetforcedLandscape(forcedLandscape);
      }
      if (_YJRaycaster) {
        _YJRaycaster.SetforcedLandscape(forcedLandscape);
      }
    }
    // 浏览器窗口变动触发的方法
    this.onWindowResize = function (w, h) {
      windowWidth = w;
      windowHeight = h;

      if (camera == null) {
        return;
      }
      // 重新设置渲染器渲染范围
      renderer.setSize(windowWidth, windowHeight);
      renderer.render(scene, camera);

      // 重新设置相机宽高比例
      camera.aspect = windowWidth / windowHeight;
      // 更新相机投影矩阵
      camera.updateProjectionMatrix();

      if (_YJSceneManager != null) {
        _YJSceneManager.onWindowResize(
          windowWidth,
          windowHeight
        );
      }
      // 正交相机自适应分辨率
      if (camera.isOrthographicCamera) {
        const frustumSize = 2;
        const aspect = windowWidth / windowHeight;
        camera.left = (-frustumSize * aspect) / 2;
        camera.right = (frustumSize * aspect) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
      }

      if (hasStats && stats) {
        stats.domElement.style.left = windowWidth - 80 + "px";
      }
    }
    
    //#region 移动端控制角色移动的 摇杆
    //------ --------
    // 左摇杆控制角色移动
    this.JoystickAxis = function(x, y) {
      if (isNaN(x) || isNaN(y) || _YJController == null) {
        return;
      }
      if (platform == "pcweb") {
        _YJController.MoveByJoystickAxis(x, y);
      } else {
      }
      
    }
    // // 右摇杆控制视角旋转
    // JoystickAxisRight(x, y) {
    //   if (isNaN(x) || isNaN(y) || _YJController == null) {
    //     return;
    //   }
    //   if (platform == "pcweb") {
    //     _YJController.RotaByJoystickAxis(x, y);
    //   } else {
    //   }
    // },
    //#endregion
    function init(){
      _Global.YJ3D = scope; 
    }
    init();
  }

}

export { YJThreejsBase };