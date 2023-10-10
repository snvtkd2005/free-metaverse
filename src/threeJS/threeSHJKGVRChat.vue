<template>
  <!-- <div class="absolute z-10 left-0 top-0 w-full h-full bg-gray-700"></div> -->
  <div
    tabindex="-1"
    id="contain"
    class="left-0 top-0 w-full h-full bg-gray-700"
    ref="container"
  ></div>
  <!-- :style="'height: ' + height + 'px' + ';'" -->

  <!-- 视频 -->
  <!-- <div class="w-1/2 h-1/2 absolute top-0 left-0 hidden">
    <video id="video" src="/video/1.mp4"></video>
  </div> -->

  <!-- <audio loop id="music" preload="auto" style="display: none">
    <source src="/video/bg.ogg" type="audio/ogg" />
    <source src="/video/bg.mp3" type="audio/mpeg" />
  </audio> -->
</template>


 
<script >
import * as THREE from "three";

import { YJRaycaster } from "./raycaster.js";

import { YJVRController } from "./YJVRController.js";
import { YJVRControllerTeleport } from "./YJVRControllerTeleport.js";

import { YJPlayer } from "./YJPlayer.js";
import { YJVRPlayer } from "./YJVRPlayer.js";
import { YJSceneManager } from "./YJSceneManager.js";

import { YJDyncManager } from "./YJDyncManager.js";

import { YJDoor } from "./YJDoor.js";
import { YJLoadModel } from "./YJLoadModel.js";
import { ref } from "vue";

// 创建一个时钟对象Clock
var clock = new THREE.Clock();

const FPS = 30; // 指的是 30帧每秒的情况
const singleFrameTime = 1 / FPS;
let timeStamp = 0;
// var content = ref("点击点击模型点击模型模型");
// import dat from 'dat.gui'
export default {
  data() {
    return {
      content: "点击点击模型点击模型模型",
      selected: false,
      height: 100,
    };
  },
  mounted() {
    // this.height= 100
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.rotationSpeed = 0.02;

    this.pointsParent = null;
    this.hotPointsParent = null;
    this.dracoLoader = null;

    this.YJRaycaster = null;
    this.YJVRController = null;
    this.YJVRControllerTeleport = null;
    this.inVR = true;
    // this.inVR = this.$parent.canVR;

    this.clock = null;

    this.logtext = "";

    this.pointTexture = null;

    this.colliderList = [];
    this.lookatList = [];

    //所有其他玩家
    this.allPlayer = [];

    //场景中的物体
    this.sceneModels = [];
    // this.allPlayer = [];
    // //所有其他玩家id
    // this.allPlayerId = [];
    // this.allPlayerSkin = [];

    //玩家控制器的Y轴弧度
    this.rotateY = 1;
    //动画名字
    this.animName = "idle";
    //玩家控制器的坐标
    this.pos = new THREE.Vector3(0, 0, 0);
    this.rota = new THREE.Vector3(0, 0, 0);
    //是否正在发送同步数据
    this.inSend = false;
    //本地角色id
    this.id = "";

    //方向光
    this.dirLight = null;

    var that = this;
    window.addEventListener("resize", function (e) {
      // console.log("改变窗口大小");
      that.onWindowResize();
      if (that.camera == null) {
        return;
      }
      // 重新设置相机宽高比例
      that.camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      that.camera.updateProjectionMatrix();
      // 重新设置渲染器渲染范围
      that.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    this.$nextTick(() => {
      that.initListener();
    });

    this._YJDyncManager = null;
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    GetPlayerData(playerName){
      for (let i = 0; i < this.allPlayerImgPath.length; i++) {
        if (this.allPlayerImgPath[i].name == playerName) {
          return this.allPlayerImgPath[i];
        }
      }
    },

    initListener() {
      var that = this;
    },
    //让threejs获取焦点，div必须添加 tabindex="-1"
    threeJSfocus() {
      this.$refs.container.focus();
      this.$parent.threeJSfocus();
    },
    // 浏览器窗口变动触发的方法
    onWindowResize() {
      console.log("改变窗口大小");
      if (this.camera == null) {
        return;
      }
      // 重新设置相机宽高比例
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      this.camera.updateProjectionMatrix();
      // 重新设置渲染器渲染范围
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    init() {
      this.initMesh();
    },

    //------------------初始化 three 场景容器
    initMesh() {
      //   this.YJVRControllerTeleport = new YJVRControllerTeleport(
      //     this.$refs.container,
      //     this
      //   );

      // return;

      this.scene = new THREE.Scene(); // 场景

      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.01,
        10000
      );

      // 相机.视场，长宽比，近面，远面

      // this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      // this.renderer.setSize(window.innerWidth, window.innerHeight);
      // this.renderer.shadowMap.enabled = true; // 开启阴影
      // this.renderer.setPixelRatio(2); //推荐
      //  this.renderer.outputEncoding = THREE.sRGBEncoding;
      //  this.renderer.xr.enabled = true;

      // renderer = new THREE.WebGLRenderer( { antialias: true } );
      // 	renderer.setPixelRatio( window.devicePixelRatio );
      // 	renderer.setSize( window.innerWidth, window.innerHeight );
      // document.body.appendChild( renderer.domElement );

      //添加组
      this.pointsParent = new THREE.Group();
      this.pointsParent.name = "pointsParent";
      this.scene.add(this.pointsParent);

      //环境光
      // var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      var ambient = new THREE.AmbientLight(0xdddddd); //添加环境光
      this.scene.add(ambient); //光源添加到场景中

      this.dirLight = new THREE.DirectionalLight(0xffffff, 2);
      this.dirLight.position.set(-3, 10, -10);
      this.dirLight.castShadow = true;
      // this.dirLight.shadow.camera.top = 4;
      // this.dirLight.shadow.camera.bottom = -4;
      // this.dirLight.shadow.camera.left = -4;
      // this.dirLight.shadow.camera.right = 4;

      this.dirLight.shadow.camera.top = 4;
      this.dirLight.shadow.camera.bottom = -4;
      this.dirLight.shadow.camera.left = -14;
      this.dirLight.shadow.camera.right = 14;
      this.dirLight.shadow.camera.near = 0.1;
      this.dirLight.shadow.camera.far = 40;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;

      this.scene.add(this.dirLight); //光源添加到场景中

      //添加角色聚光灯

      //雾效
      this.scene.background = new THREE.Color(0xa0a0a0);
      this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

      new YJSceneManager(this.scene, this.renderer, this.camera, this);

      // let spotLight = new THREE.SpotLight(0xffffff);
      // spotLight.position.set(-40, 60, -10);
      // spotLight.castShadow = true;
      // this.scene.add(spotLight);

      if (this.inVR) {
        this.YJVRController = new YJVRController(
          this.scene,
          this.renderer,
          this.camera,
          this.$refs.container,
          // this.renderer.domElement,
          this
        );
      } else {
        this.InitYJVRController();
      }

      // this.$refs.container.append(this.renderer.domElement);

      //实时刷新
      this.renderScene();

      var that = this;
      setInterval(() => {
        if (that.YJVRPlayer != null) {
          that.YJVRPlayer.updatePos();
        }
      }, 20);

      this._YJDyncManager = new YJDyncManager(this,"小孩");
    },
    

    //三维场景加载完成后，告诉页面可以连接websocket服务器
    //因为一旦连接到服务器就会同步数据，避免在场景未加载完就同步数据
    //所以设置为先加载场景，再连接服务器
    ThreeLoadCompleted() {
      //三维加载完成
      this.$parent.ThreeLoadCompleted();
    },

    //三维发送门的状态到服务器
    SendDoorAnim(b) {
      this.$parent.SendDoorAnim(b);
    },
    //接收门状态，并发送给三维，让其更新动画状态
    ReceiveDoorAnim(b) {
      this.YJDoor.SetPlayAnim(b);
    },

    SendSceneState(id, name, state) {
      this.$parent.SendSceneState(id, name, state);
    },

    //刷新场景模型状态
    UpdateSceneState(sceneState) {
      
      for (let i = 0; i < this.sceneModels.length; i++) {
        var modelState = this.sceneModels[i];
        if (modelState.id == sceneState.id) {
          if (modelState.name == "door") {
            modelState.model.SetPlayAnim(sceneState.state);
          }
          continue;
        }
      }
    },
    //----------由页面调用 开始-----------

    // 移动端点击跳跃按钮
    ClickJump() {
      this.YJVRController.ClickJump();
    },
    //点击按钮 交互门
    ClickInteractive() {
      this.YJVRController.ClickInteractive();
    },
    //移动端控制角色移动的摇杆
    JoystickAxis(x, y) {
      if (isNaN(x) || isNaN(y)) {
        return;
      }
      // console.log(x, y);
      this.YJVRController.MoveByJoystickAxis(x, y);
    },
    //----------由页面调用 结束-----------

    //发送交互提示
    ChangeTip(b) {
      this.$parent.ChangeTip(b);
    },

    //添加到服务器后，生成角色
    GeneratePlayer(isLocal, id, platform,nickName) {
      if (isLocal) {
        this.id = id;
        this.YJVRPlayer = new YJVRPlayer(this, this.scene, true,nickName);
        this.YJVRPlayer.LoadPlayer("小孩");
        // this.YJVRPlayer.LoadPlayer(this.$parent.user.playerData.name);

        this.YJVRController.SetPlayer(this.YJVRPlayer);
        return;
      }
      if (platform == "vr") {
        this.allPlayer.push({
          player: new YJVRPlayer(this, this.scene, false,nickName),
          id: id,
          skin: false,
        });
      }
      if (platform == "pcweb") {
        this.allPlayer.push({
          player: new YJPlayer(this, this.scene, false,nickName),
          id: id,
          skin: false,
        });
      }
      // this.allPlayerId.push(id);
      // this.allPlayerSkin.push(false);
      // console.log(this.allPlayer.length);
    },
    //删除其他玩家的角色
    DelPlayer(id) {
      for (let i = 0; i < this.allPlayer.length; i++) {
        if (this.allPlayer[i].id == id) {
          this.allPlayer[i].player.DelPlayer();
          // this.allPlayerId.splice(i, 1);
          // this.allPlayerSkin.splice(i, 1);
          this.allPlayer.splice(i, 1);
          return;
        }
      }
    },
    CloseWebsocket() {
      for (let i = 0; i < this.allPlayer.length; i++) {
        this.allPlayer[i].player.DelPlayer();
      }
      if (this.YJVRPlayer == null) {
        return;
      }
      this.YJVRPlayer.DelPlayer();
      this.YJVRController.RemovePlayer();
      this.allPlayer = [];
      // this.allPlayerId = [];
      // this.allPlayerSkin = [];
    },

    //由三维页面发送角色位置过来
    SetUserData(userData) {
      if (this.inSend) {
        return;
      }
      this.inSend = true;
      // this.$parent.SetUserData(userData);
      this._YJDyncManager.SetUserData(userData);
      this.inSend = false;
    },
    //
    UpdatePlayerPos(id, user) {
      for (let i = 0; i < this.allPlayer.length; i++) {
        // console.log("同步其他用户的角色镜像 id  " + this.allPlayerId[i] );
          console.log("同步其他用户的角色镜像 VR 执行 ",user );

        if (this.allPlayer[i].id == id) {
          if (user.type == "vr") {
            this.allPlayer[i].player.SetUserData(user);
          } else {
            this.allPlayer[i].player.SetUserData(user);
          }
          return;
        }
      }
    },

    //更新角色状态（角色皮肤）
    UpdatePlayerState(id, user) {
      for (let i = 0; i < this.allPlayer.length; i++) {
        // console.log("同步其他用户的角色镜像 id  " + this.allPlayerId[i] );
        if (this.allPlayer[i].id == id && this.allPlayer[i].skin == false) {
          this.allPlayer[i].skin = true;
          this.allPlayer[i].player.LoadPlayer(user.playerData.name);
          // console.log("同步其他用户的角色镜像  执行 " );
          return;
        }
      }
    },

    //初始化第三人称控制器
    InitYJVRController() {},

    ClickQQ() {
      window.location.href = "tencent://message/?uin=406729769";
    },

    //------------------------实时update
    //实时刷新
    renderScene() {
      if (this.inVR) {
        return;
      }
      const delta = clock.getDelta(); //获取自上次调用的时间差

      // this.renderer.render(this.scene, this.camera);

      timeStamp += delta;
      //限制帧率在30帧
      if (timeStamp > singleFrameTime) {
        this.renderer.render(this.scene, this.camera);
        // 剩余的时间合并进入下次的判断计算 这里使用取余数是因为 当页页面失去焦点又重新获得焦点的时候，delta数值会非常大， 这个时候就需要
        timeStamp = timeStamp % singleFrameTime;

        this.updatelookatList();

        this.YJVRController.update();

        if (this.allPlayer.length > 0) {
          for (const player of this.allPlayer) {
            player.player.update();
          }
        }
      }

      requestAnimationFrame(this.renderScene);
    },

    //世界坐标转屏幕坐标。 世界坐标要从模型包裹盒中获取
    getScreenPosition(world_vector) {
      // let projector = new THREE.Projector();
      let vector = world_vector.project(this.camera);
      let halfWidth = window.innerWidth / 2;
      let halfHeight = window.innerHeight / 2;
      return {
        x: Math.round(vector.x * halfWidth + halfWidth),
        y: Math.round(-vector.y * halfHeight + halfHeight),
      };
    },
    //通过模型的包裹盒计算模型的世界坐标
    // GetModelWorldPosition(object) {
    //   var worldPosition = new THREE.Vector3();
    //   object.getWorldPosition(worldPosition);
    //   return worldPosition;
    // },

    updatelookatList() {
      //热点实时面向摄像机
      for (var i = 0; i < this.lookatList.length; i++) {
        this.lookatList[i].lookAt(this.pos);
      }
    },
    updateRotaHotPoint() {
      //热点实时面向摄像机
      for (var i = 0; i < this.hotPointsParent.children.length; i++) {
        // pointsParent.children[i].lookAt(cameraOldPos);
        this.hotPointsParent.children[i].rotateY(0.03);
      }

      requestAnimationFrame(this.updateRotaHotPoint);
    },
  },
};
</script>