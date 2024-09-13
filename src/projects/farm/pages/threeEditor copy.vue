<template>
  <div tabindex="-1" id="contain" class="w-full h-full relative" ref="container">
    <div v-if="hasStatsDrawcall" class="absolute top-3 right-3 text-white">
      <div>drawcall: {{ statsText.drawcall }}</div>
      <div>triangles: {{ statsText.triangles }}</div>
    </div>
  </div> 
</template>


 
<script >
import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";

import { YJRaycaster } from "/@/threeJS/common/raycaster.js";

import { YJController } from "/@/threeJS/common/YJController.js";

import { YJPlayer } from "/@/threeJS/common/YJPlayer.js";

import { YJSceneManager } from "/@/threeJS/common/YJSceneManagerEditor.js";

import { ref } from "vue";

// 创建一个时钟对象Clock
var clock = new THREE.Clock();
const FPS = 30; // 指的是 30帧每秒的情况
const singleFrameTime = 1 / FPS;
let timeStamp = 0;
let stats;

export default {
  components: { 
  },
  data() {
    return {
      hasStats: true,
      // hasStats: false,
      hasStatsDrawcall: true,
      statsText: {
        drawcall: 0,
        triangles: 0,
      },
    };
  },
  mounted() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.pointsParent = null;

    this.canHitModelList = [];

    this.hotPointsParent = null;

    this.YJRaycaster = null;
    this.YJController = null;

    this._YJSceneManager = null;

    this.clock = null;

    this.logtext = "";

    this.colliderList = [];
    this.lookatList = [];

    //场景中的物体
    this.sceneModels = [];

    //玩家控制器的坐标
    this.pos = new THREE.Vector3(0, 0, 0);
    this.rota = new THREE.Vector3(0, 0, 0);

    this.platform = "pcweb";

    // this.publicUrl = this.$parent.$publicUrl;

    // this.BeforeLoadThreejs(); 
    this.pointerLock = false;

    this.windowWidth = 0;
    this.windowHeight = 0;

    // this.windowWidth = this.$refs.container.clientWidth;
    // this.windowHeight = this.$refs.container.clientHeight;

    // this.windowWidth = window.innerWidth;
    // this.windowHeight = window.innerHeight;

    this.canAddListner = true;

    this.touchTime = 0;
    this.infocus = true;

    this.enableRenderer = true;

    this.userData = null;
    this.pauseRender = false;
  },

  methods: {
    // 设置相机正交或透视
    SetCamProjection(e) {
      if (e == "透视") {
      } else {
      }
    },
    
    SetWindowWidthHeight(w, h) {
      this.windowWidth = w;
      this.windowHeight = h;
    },
    
    GetPublicUrl() {
      return this.$parent.GetPublicUrl();
    },

    GetModelUrl() {
      return this.$parent.GetModelUrl();
    },

    GetSceneTexPath() {
      return this.$parent.GetSceneTexPath();
    },

    GetPublicModelUrl() {
      return this.$parent.GetPublicModelUrl();
    },

    requestPointerLock() {
      let div_test = this.$refs.container;
      div_test.requestPointerLock =
        div_test.requestPointerLock ||
        div_test.msRequestPointerLock ||
        div_test.mozRequestPointerLock ||
        div_test.webkitRequestPointerLock;
      div_test.requestPointerLock();
      this.YJController.addPointerEventListener();
    },
    SetPointerLock() {
      this.$refs.container.requestPointerLock();
      this.YJController.SetPointerLock(true);
      this.pointerLock = true;

      let that = this;
      document.addEventListener(
        "pointerlockchange",
        function () {
          if (document.pointerLockElement == that.$refs.container) {
            // console.log(" in pointerlockchange == ");
            that.YJController.addPointerEventListener();
          } else {
            // console.log(" in pointerlockchange !!== ");
            that.YJController.removePointerEventListener();
          }
        },
        false
      );
    },
    initListener() { 

      this.$refs.container.addEventListener("click",  (e)=> {
        this.threeJSfocus();
        if (this.pointerLock) {
          this.requestPointerLock();
        }
      });

      this.$refs.container.addEventListener("mousedown",  (e)=> {
        this.threeJSfocus();
        this.YJController.onMouseDown(e);
        this.$parent.PlayVideo();
      });

      this.$refs.container.addEventListener("touchstart", (e)=> {
        this.threeJSfocus();
        this.YJController.mouseDragOn = true;
        this.$parent.PlayVideo();
      });
    },

    //让threejs获取焦点，div必须添加 tabindex="-1"
    threeJSfocus() {
      if (!this.canAddListner || this.infocus) {
        return;
      }
      console.log(" 点击 threeJS页面  ", this.canAddListner, this.infocus);

      this.$refs.container.focus();
      this.YJController.addEventListener();
      this.infocus = true;
      _Global.infocus3d = true;
    },
    removeEventListener() {
      console.log(" 点击 其他页面 threeJS 失去焦点   ");

      this.infocus = false;
      this.YJController.dispose();
      this.YJRaycaster.SetMouseDown(false);
      this.YJController.onMouseUp();
      _Global.infocus3d = false;
    },

    SetCanAddControllerListner(b) {
      this.canAddListner = b;
    },

    // 移动端强制横屏时，射线检测点击位置要重新计算
    SetforcedLandscape(forcedLandscape) {
      if (!this.$parent.isMobile) {
        return;
      }
      if (this.YJController) {
        this.YJController.SetforcedLandscape(forcedLandscape);
      }
      if (this.YJRaycaster) {
        this.YJRaycaster.SetforcedLandscape(forcedLandscape);
      }
    },
    // 浏览器窗口变动触发的方法
    onWindowResize(w, h) {
      this.windowWidth = w;
      this.windowHeight = h;

      if (this.camera == null) {
        return;
      }
      // 重新设置渲染器渲染范围
      this.renderer.setSize(this.windowWidth, this.windowHeight);
      this.renderer.render(this.scene, this.camera);

      // 重新设置相机宽高比例
      this.camera.aspect = this.windowWidth / this.windowHeight;
      // 更新相机投影矩阵
      this.camera.updateProjectionMatrix();

      if (this._YJSceneManager != null) {
        this._YJSceneManager.onWindowResize(
          this.windowWidth,
          this.windowHeight
        );
      }
      // 正交相机自适应分辨率
      if (this.camera.isOrthographicCamera) {
        const frustumSize = 2;
        const aspect = this.windowWidth / this.windowHeight;
        this.camera.left = (-frustumSize * aspect) / 2;
        this.camera.right = (frustumSize * aspect) / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = -frustumSize / 2;
        this.camera.updateProjectionMatrix();
      }

      if (this.hasStats && stats) {
        stats.domElement.style.left = this.windowWidth - 80 + "px";
      }
    },
    SetCameraFov(f) {
      if (this.camera == null) {
        return;
      }
      this.camera.fov = f;
      this.camera.updateProjectionMatrix();
    },

    //在登录页面，预加载三维场景
    BeforeLoadThreejs() {
      this.initScene();
      if (this.platform == "pcweb") {
        this.initListener();
        this.initYJRaycaster();
        var that = this;
        this.$refs.container.append(this.renderer.domElement);
        this.InitYJController();

        this.InitSceneManager();
      }
    },
    InitThreejs(UI, userData) {
      // 初始化scene、camera、renderer
      this.initScene();

      this.$refs.container.append(this.renderer.domElement);

      if (userData == undefined) {
      } else {
        this.userData = userData;
        this.platform = userData.platform;
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
    },

    //#region 鼠标射线检测
    //监听鼠标点击物体
    initYJRaycaster() {
      var that = this;
      this.YJRaycaster = new YJRaycaster(
        this,
        this.scene,
        this.camera,
        this.renderer.domElement,
        (hitObject, hitPoint) => {
          if (hitObject == null) {
            this.ClickModel(hitObject);
            this.selected = false;
            // console.log(" 未点击到任何模型 ");
            return;
          }
          // console.log(
          //   "点击模型 ",
          //   hitObject,
          //   hitObject.tag +
          //     " " +
          //     hitObject.name +
          //     " 点击坐标 " +
          //     hitPoint.x +
          //     " " +
          //     hitPoint.y +
          //     " " +
          //     hitPoint.z +
          //     " "
          // );

          // if (
          //   hitObject.name == "floor" ||
          //   hitObject.name.indexOf("land") > -1 ||
          //   hitObject.name == "Plane001"
          // ) {
          //   this.ClickFloor(hitObject, hitPoint);
          //   return;
          // }

          // if (hitObject.name == "qq") {
          //   this.ClickQQ();
          //   return;
          // }

          // if (hitObject.tag == undefined) {
          //   this.ClickModel(hitObject);
          //   return;
          // }
          // if (hitObject.tag == "hotPoint") {
          //   this.ClickHotPoint(hitObject.modelData, hitObject.owner);
          //   return;
          // }
          // if (hitObject.tag == "player") {
          //   this.ClickPlayer(hitObject.owner);
          //   return;
          // }

          // if (hitObject.tag.indexOf("交互物品") > -1) {
          //   this.ClickModel(hitObject.owner);
          //   return;
          // }

          this.ClickModel(hitObject);
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

          // console.log(
          //   " 点击热点模型 " +
          //   hotPoint.tag +
          //     " " +
          //     hotPoint.name +
          //     " 点击坐标 " +
          //     hotPointHitPoint.x +
          //     " " +
          //     hotPointHitPoint.y +
          //     " " +
          //     hotPointHitPoint.z +
          //     " "
          // );
        },
        (hit, point) => {
          // 右键点击空白位置
          this.RightClick(hit, point);
          // console.log("点击右键");
        },
        // 点击合批物体 InstancedMesh
        (InstancedMeshOwner, index) => {
          if (this.$parent.$parent.ClickInstancedMesh) {
            this.$parent.$parent.ClickInstancedMesh(InstancedMeshOwner, index);
          }
        }
      );
    },

    // 设置光标图标
    SetCursor(cursor) {
      // console.log("切换光标 2 ", cursor);
      if (cursor == "") {
        if (this.customCursor) {
          document.body.style.cursor = `url(),auto`;
          this.customCursor = false;
          this.cursorUrl = cursor;
        }
        return;
      }
      if (this.cursorUrl == cursor) {
        return;
      }

      this.customCursor = true;
      this.cursorUrl = cursor;
      // document.body.style.cursor = cursor;
      // document.body.style.cursor =
      //   `url(${cursor}),pointer`; //显示手型光标

      document.body.style.cursor = "none";
      // "url(" + this.$publicUrl + cursor + "),auto"; //显示手型光标
    },

    //点击热点
    ClickHotPoint(modelData, owner) {
      if (this.$parent.CreateHotContent) {
        this.$parent.CreateHotContent(modelData, owner);
      }
      if (this.$parent.$parent.CreateHotContent) {
        this.$parent.$parent.CreateHotContent(modelData, owner);
      }
    },

    // 点击NPC
    ClickPlayer(owner) {
      if (this.$parent.ClickPlayer) {
        this.$parent.ClickPlayer(owner);
      }
      if (this.$parent.$parent.ClickPlayer) {
        this.$parent.$parent.ClickPlayer(owner);
      }
    },

    //点击可交互的物品
    ClickModel(hitObject) {
      if (this.$parent.ClickModel) {
        this.$parent.ClickModel(hitObject);
      }
      if (this.$parent.$parent.ClickModel) {
        this.$parent.$parent.ClickModel(hitObject);
      }
    },
    ClickHotPointOwner(hitObject) {
      if (this.$parent.ClickHotPointOwner) {
        this.$parent.ClickHotPointOwner(hitObject);
      }
      if (this.$parent.$parent.ClickHotPointOwner) {
        this.$parent.$parent.ClickHotPointOwner(hitObject);
      }
    },

    RightClick(hitObject, hitPoint) {
      if (this.$parent.RightClick) {
        this.$parent.RightClick(hitObject, hitPoint);
      }
      if (this.$parent.$parent.RightClick) {
        this.$parent.$parent.RightClick(hitObject, hitPoint);
      }
    },
    ClickFloor(hitObject, hitPoint) {
      // console.log("点击地面");
      // 点击地面，角色转向目标点，角色移动到目标位置
      this.YJController.lookAtPos(hitPoint);

      if (this.$parent.$parent.ClickFloor) {
        this.$parent.$parent.ClickFloor(hitObject);
      }
    },
    // HoverObject(hoverObject, hoverPoint) {
    //   hoverObject.owner.SetMouseHover(true);
    // },

    HoverObject(hoverObject, hoverPoint) {
      if (this.$parent.HoverObject) {
        this.$parent.HoverObject(hoverObject, hoverPoint);
      }
      if (this.$parent.$parent.HoverObject) {
        this.$parent.$parent.HoverObject(hoverObject, hoverPoint);
      }
    },
    //#endregion

    //------------------初始化 three 场景容器

    //#region  初始化 three 场景容器
    changeProjection(projection) {
      //   var boundingBox = new THREE.Box3().setFromObject(this.scene);
      //   // 计算正交相机的左、右、顶、底、近、远属性
      // var size = boundingBox.getSize(new THREE.Vector3());
      // var left = -size.x / 2;
      // var right = size.x / 2;
      // var top = size.y / 2;
      // var bottom = -size.y / 2;
      // var far = boundingBox.max.z;
      // var near = boundingBox.min.z;
      // // 设置相机属性
      // this.camera.left = left;
      // this.camera.right = right;
      // this.camera.top = top;
      // this.camera.bottom = bottom;
      // this.camera.near = near;
      // this.camera.far = far;
      // // 更新相机的投影矩阵
      // this.camera.updateProjectionMatrix();
      // let projection = this.$parent.$parent.avatarData.setting.projection;
      // console.log("projection ",projection);
      // if (projection == "orthographic") {
      //   const frustumSize = 2;
      //   const aspect = this.windowWidth / this.windowHeight;
      //   this.camera = new THREE.OrthographicCamera(
      //     (frustumSize * aspect) / -2,
      //     (frustumSize * aspect) / 2,
      //     frustumSize / 2,
      //     frustumSize / -2,
      //     1,
      //     1000
      //   );
      //   this.camera.left = (-frustumSize * aspect) / 2;
      //   this.camera.right = (frustumSize * aspect) / 2;
      //   this.camera.top = frustumSize / 2;
      //   this.camera.bottom = -frustumSize / 2;
      //   // isOrthographicCamera
      // } else {
      //   this.camera = new THREE.PerspectiveCamera(
      //     60,
      //     this.windowWidth / this.windowHeight,
      //     0.1,
      //     1000
      //   );
      // }
      // this.camera.updateProjectionMatrix();
    },
    initScene() {
      this.scene = new THREE.Scene(); // 场景
      this.scene.name = "scene";

      this.camera = new THREE.PerspectiveCamera(
        60,
        this.windowWidth / this.windowHeight,
        0.1,
        1000
      );
      let myCtrlRbChild = new THREE.Group();
      myCtrlRbChild.name = "myCtrlRbChild";
      this.camera.add(myCtrlRbChild);
      myCtrlRbChild.rotateY(-Math.PI / 2);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      this.renderer.setSize(this.windowWidth, this.windowHeight);

      this.renderer.shadowMap.enabled = true; // 开启阴影
      // this.renderer.shadowMap.width = 2048;
      // this.renderer.shadowMap.height = 2048;

      // console.log("22222");
      //   if(this.$parent.isMobile)
      // this.renderer.setPixelRatio(this.$parent.isMobile ? 1 : 1.5); //推荐
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); //推荐
      // this.renderer.setPixelRatio(window.devicePixelRatio); //推荐
      // this.renderer.setPixelRatio(2); //推荐

      //添加组
      this.pointsParent = new THREE.Group();
      this.pointsParent.name = "pointsParent";
      this.scene.add(this.pointsParent);

      // this.scene.add(this.camera);

      if (this.hasStats) {
        stats = new Stats();
        stats.domElement.style.position = "absolute";
        stats.domElement.style.width = "80px";
        stats.domElement.style.height = "48px";
        stats.domElement.style.left = this.windowWidth - 80 + "px";
        stats.domElement.style.top = "60px";
        stats.domElement.style.zIndex = "9999";
        this.$refs.container.appendChild(stats.domElement);
      }
    },
    //设置渲染分辨率，降低会有锯齿，但流畅度会提升
    SetPixelRatio(f) {
      return;
      this.renderer.setPixelRatio(f); //推荐
      console.log("设置分辨率倍数 " + f);
    },
    getCanvasImg(width, height, offsetLeft, offsetTop) {
      if (width) {
        this.renderer.setSize(width, height);
        let canvas = this.renderer.domElement;
        this.renderer.render(this.scene, this.camera);
        setTimeout(() => {
          this.ResetRender();
        }, 200);
        return canvas.toDataURL("image/png");
      } else {
        let canvas = this.renderer.domElement;
        this.renderer.render(this.scene, this.camera);
        return canvas.toDataURL("image/jpeg");
      }
    },
    ResetRender() {
      this.renderer.setSize(this.windowWidth, this.windowHeight);
    },

    InitSceneManager(callback) {
      console.log("初始化场景管理器");
      this._YJSceneManager = new YJSceneManager(
        this.scene,
        this.renderer,
        this.camera,
        this,
        this.platform,
        callback
      );
    },
    InitSceneManagerAR(callback) {
      this._YJSceneManager = new YJSceneManager(
        this.scene,
        this.renderer,
        this.camera,
        this,
        "ar",
        callback
      );
    },
    GetWidthHeight() {
      let w = this.windowWidth;
      let h = this.windowHeight;
      return {
        w,
        h,
      };
    },
    GetContainer() {
      return this.$refs.container;
    },
    AddThreeDocumentListener(fn) {
      this.$refs.container.addEventListener("click", fn);
      // this.renderer.domElement.addEventListener("click",fn);
    },
    GetThreeDocument() {
      return this.renderer.domElement;
    },
    //初始化第三人称控制器
    InitYJController() {
      this.YJController = new YJController(
        this.scene,
        this.camera,
        this.renderer.domElement,
        this
      );

      // this.YJController.wheelMin = -30;
      // this.YJController.wheelMax = -0.01;

      // // 上下限制视角
      // this.YJController.minY = -1.25;
      // this.YJController.maxY = 1.25;

      //1.7高度表示角色眼睛的高度
      // let targetPos = new THREE.Vector3(0, 1.7, 0);
      //控制摄像机的初始距离
      // this.YJController.SetTarget(targetPos, -10);
      //控制摄像机的初始角度
      let targetRota = new THREE.Vector3(0, 0, -3.14 / 8); //4
      this.YJController.SetTargetRota(targetRota);
    },
    //#endregion

    //#region 切换模型皮肤
    // ChangeAvatar(name, isLocal) {
    //   //开始加载 
    //   this.YJPlayer.ChangeAvatar(name, true);
    // },
    // ChangeAvatarByCustom(modelData, isLocal) {
    //   //开始加载 
    //   this.YJPlayer.ChangeAvatarByCustom(modelData, true);
    // },
    //#endregion

    //#region
    //#endregion

    //#region 由页面调用 开始
    //----------由页面调用 开始-----------

    // 移动端点击跳跃按钮
    // ClickJump() {
    //   if (this.YJController != null) {
    //     this.YJController.ClickJump();
    //   }
    // },
    // //点击按钮 交互门
    // ClickInteractive() {
    //   if (this.YJController != null) {
    //     this.YJController.ClickInteractive();
    //   }
    // },

    //#region
    //#endregion

    //#region 移动端控制角色移动的 摇杆
    //------ --------
    // 左摇杆控制角色移动
    JoystickAxis(x, y) {
      if (isNaN(x) || isNaN(y) || this.YJController == null) {
        return;
      }
      if (this.platform == "pcweb") {
        this.YJController.MoveByJoystickAxis(x, y);
      } else {
      }
    },
    // // 右摇杆控制视角旋转
    // JoystickAxisRight(x, y) {
    //   if (isNaN(x) || isNaN(y) || this.YJController == null) {
    //     return;
    //   }
    //   if (this.platform == "pcweb") {
    //     this.YJController.RotaByJoystickAxis(x, y);
    //   } else {
    //   }
    // },
    //#endregion

    //----------由页面调用 结束-----------
    //#endregion

    //三维场景加载完成后，告诉页面可以连接websocket服务器
    //因为一旦连接到服务器就会同步数据，避免在场景未加载完就同步数据
    //所以设置为先加载场景，再连接服务器
    load3dComplete() {
      //三维加载完成
      if (this.$parent.ThreeLoadCompleted) {
        this.$parent.ThreeLoadCompleted();
      }
    },
    //新加入玩家获取门当前状态。让已存在的用户再发送一遍
    // GetAnimState() {
    //   return this.YJDoor.GetAnimState();
    // },
    // //发送交互提示
    // ChangeTip(b) {
    //   this.$parent.ChangeTip(b);
    // },
    // SendSceneState(id, name, state) {
    //   // this.$parent.SendSceneState(id, name, state);
    // },

    // 调用设置用户姓名条。
    // 多人同步状态下，由于加入游戏在创建角色之前，所以先做标志位
    // CallCreateNameTrans(e, id) {
    //   this.nickName = e;

    //   if (this.YJPlayer) {
    //     this.YJPlayer.CreateNameTrans(this.nickName);
    //     this.YJPlayer.id = id;
    //   }
    // },
    // SetNickName(e) {
    //   this.nickName = e;
    // },
    // CreateChatTrans(e) {
    //   this.YJPlayer.CreateChatTrans(e);
    // },
    //生成角色
    GeneratePlayer(callback) {
      console.log("创建角色", this.userData);
      this.YJPlayer = new YJPlayer(
        this,
        this.scene,
        true,
        "nickName",
        (playerObj, playerGroup) => {
          if (playerObj == undefined) {
            return;
          }
          //在模型加载完成后，把模型放到控制器里面，让控制器来控制模型位置和朝向
          this.YJController.SetPlayerToCamTarget(playerObj);
          this.YJController.SetPlayerGroup(playerGroup);
          if (callback) {
            callback();
          }
        }
      );
 
      this.YJPlayer.CreateNameTrans(_Global.user.name);

      if (this.userData != null) {
        this.YJPlayer.LoadPlayer(this.userData.avatarId);
      } else {
        this.YJPlayer.LoadPlayer("none");
      }

      this.YJController.SetPlayer(this.YJPlayer);
    },

    // ClickQQ() {
    //   window.location.href = "tencent://message/?uin=406729769";
    // },

    //------------------------实时update
    //实时刷新
    renderScene() {
      if (this.hasStats) {
        stats.update();
      }
      requestAnimationFrame(this.renderScene);

      if (this.pauseRender) {
        return;
      }
      const delta = clock.getDelta(); //获取自上次调用的时间差

      timeStamp += delta;
      //限制帧率在30帧
      if (timeStamp > singleFrameTime) {
        this.YJController.update();
        this._YJSceneManager.update();

        if (this.enableRenderer) {
          this.renderer.render(this.scene, this.camera);
        }
        // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
        timeStamp = timeStamp % singleFrameTime;
 
        // this.renderer.clear();

        // console.error( 'THREE.WebGLState: 222222222', _Global.texImage2DError );
        // console.log( ' info ', this.renderer.info );
        // console.log( ' draw call ', this.renderer.info.render.calls  );
        // console.log( ' Scene polycount : ', this.renderer.info.render.triangles  );
        this.statsText.drawcall = this.renderer.info.render.calls;
        this.statsText.triangles = this.renderer.info.render.triangles;
      }
    },
    renderSceneOneTimes() {
      if (this.enableRenderer) {
        this.renderer.render(this.scene, this.camera);
      }

      if (this.hasStats) {
        stats.update();
      }
    },
 

    // 获取本地玩家所在坐标,在小地图上更新玩家标志位置
    // GetLocalPlayerPos(callback) {
    //   if (callback) {
    //     let pos = this.YJPlayer.GetPlayerNamePos();
    //     callback(pos.x, pos.z);
    //   }
    // },
    // // 获取本地玩家的旋转,在小地图上更新玩家朝向视野范围
    // GetLocalPlayerRota(callback) {
    //   if (callback) {
    //     callback(this.YJController.GetPlayerRota());
    //   }
    // },

    // // 设置本地角色移动到指定坐标， 用于小地图跳转
    // SetLocalPlayerToPos(_pos) {
    //   let pos = { x: _pos.x, y: 5, z: _pos.z };
    //   this._YJSceneManager.SetPlayerPos(pos);
    // },
    // //设置本地角色移动到目标角色位置 传送
    // SetLocalPlayerToOtherUserPos(otherUserId) {},
    // //设置本地角色移动到 指定id的模型位置 传送
    // SetLocalPlayerToCustomModel(modelId) {
    //   //本地模型可能被销毁。改为从服务器获取
    // },
    // //世界坐标转屏幕坐标。 世界坐标要从模型包裹盒中获取
    // getScreenPosition(world_vector) {
    //   // let projector = new THREE.Projector();
    //   let vector = world_vector.project(this.camera);
    //   let halfWidth = this.windowWidth / 2;
    //   let halfHeight = this.windowHeight / 2;
    //   return {
    //     x: Math.round(vector.x * halfWidth + halfWidth),
    //     y: Math.round(-vector.y * halfHeight + halfHeight),
    //   };
    // },
  },
};
</script>

<style scoped></style>