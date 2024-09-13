import * as THREE from "three";
import { YJController } from "./YJController.js";
class YJ3dSceneSingle {
  constructor(container, _this) {
    let scope = this;
    let scene;
    let renderer;
    let camera;
    let verticalMirror;
 
    let _YJController = null;
    this.YJController = null;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock(); 
    let lookatList = [];

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let group;
    let width, height;
    let playerGroup;
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

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true; // 开启阴影
      renderer.setPixelRatio(2); //推荐

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光 
      scene.add(ambient); //光源添加到场景中


      //雾效
      scene.background = new THREE.Color(0xccFFFF);
      scene.fog = new THREE.Fog(0x666666, 10, 500);


      // ground 开始--------------
      // var loaderTex_d = new THREE.TextureLoader();
      // var texture = loaderTex_d.load(
      //   _this.$publicUrl + "models/player/Model/unitychan_tile6.png"
      // );
      // //贴图平铺
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(50, 50);
      // const mesh = new THREE.Mesh(
      //   new THREE.PlaneGeometry(200, 200, 20, 20),
      //   new THREE.MeshStandardMaterial({
      //     // color: 0x666666,
      //     // color: 0xDDFF8D, 
      //     map: texture,
      //   })
      // );
      // mesh.position.y = 0.000;
      // mesh.rotation.x = -Math.PI / 2;
      // mesh.receiveShadow = true;
      // mesh.name = "floor";
      // scene.add(mesh);

      // ground 结束--------------
      //-------------
      //创建镜子
      // let mirrorGeo;
      // // mirrorGeo = new THREE.PlaneGeometry(2000, 2000);
      // mirrorGeo = new THREE.PlaneGeometry(50, 50);
      // verticalMirror = new Reflector(mirrorGeo, {
      //   clipBias: 0.003,
      //   // clipBias: 1,
      //   // textureWidth: window.innerWidth * window.devicePixelRatio,
      //   // textureHeight: window.innerHeight * window.devicePixelRatio,

      //   textureWidth: window.innerWidth * 0.1,
      //   textureHeight: window.innerHeight * 0.1,
      //   color: 0x888888,

      // });
      // verticalMirror.position.y = 0.011; 
      // verticalMirror.rotation.x = -Math.PI/2;
      // scene.add(verticalMirror);
      // CreateTestBox();

      // console.log(container);
      container.append(renderer.domElement);

      InitYJController();

      playerGroup = new THREE.Group();
      scene.add(playerGroup);
      let playerParent = _YJController.GetPlayerParent();
      playerGroup.add(playerParent);
      _YJController.SetAmmoPlayer(playerGroup);

      group = new THREE.Group();
      scene.add(group);

      scope.YJController = _YJController; 
 
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

      //1.7高度表示角色眼睛的高度
      // let targetPos = new THREE.Vector3(0, 1.7, 0);
      //控制摄像机的初始距离
      // this.YJController.SetTarget(targetPos, -10);
      //控制摄像机的初始角度
      let targetRota = new THREE.Vector3(0, 0, -3.14 / 8); //4
      _YJController.SetTargetRota(targetRota);

      _YJController.SetConctrollerInitPos(
        new THREE.Vector3(0, 0, 0)
      );

      _YJController.SetTarget(
        new THREE.Vector3(0, 1, 0),
        -5
      );
      //设置角色移动速度
      // _YJController.SetMoveSpeed(0.1);
    }

    this.update = function () {
      renderer.render(scene, camera);
    }
  }
}

export { YJ3dSceneSingle };