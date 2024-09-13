import * as THREE from "three";


import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

import TWEEN from '@tweenjs/tween.js';
import { BoxBufferGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

class YJVRController {
  constructor(scene, renderer, camera, document, _this) {
    let hmd;
    let controller1, controller2;
    let controllerGrip1, controllerGrip2;

    let room, marker, floor, baseReferenceSpace;

    let count = 0;
    const radius = 0.08;
    let normal = new THREE.Vector3();
    const relativeVelocity = new THREE.Vector3();


    let verticalMirror;



    let INTERSECTION;
    const tempMatrix = new THREE.Matrix4();


    let prevTime = performance.now();

    const velocity = new THREE.Vector3();


    var playerParent = null;
    var camTarget = null;

 
    let teleportRaycaster;
    let raycaster = new THREE.Raycaster();

    //初始化摄像机父物体，移动时，移动父物体， 旋转时，横向旋转父物体，竖向旋转摄像机
    const Init = () => {
      let size = 0.1;
      let cubeGeometry = new THREE.BoxGeometry(size, size, size);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0,
        transparent: true
      });

      camera.position.set(0, 1.6, 3);

      playerParent = new THREE.Mesh(cubeGeometry, cubeMaterial);
      playerParent.position.set(0, 0, 0);
      scene.add(playerParent);

      raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -0.01, 0), 0, 0.1);

      //
      // room = new THREE.LineSegments(
      //   new BoxBufferGeometry(6, 6, 6, 10, 10, 10),
      //   new THREE.LineBasicMaterial({ color: 0x808080 })
      // );
      // room.geometry.translate(0, 3, 0);
      // scene.add(room);


      //射线碰撞物体时，在物体位置出现的光圈
      marker = new THREE.Mesh(
        new THREE.CircleGeometry(0.25, 32).rotateX(- Math.PI / 2),
        new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load("/checkPoint.png"),
          color: 0xffffff,
          transparent: true,
          opacity: 0.5,
          depthTest: true
        })
      );
      scene.add(marker);

      // floor = new THREE.Mesh(
      //   new THREE.PlaneGeometry( 4.8, 4.8, 2, 2 ).rotateX( - Math.PI / 2 ),
      //   new THREE.MeshBasicMaterial( { color: 0x808080, transparent: true, opacity: 0.25 } )
      // );
      // scene.add( floor );

      teleportRaycaster = new THREE.Raycaster();


      scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

      const light = new THREE.DirectionalLight(0xffffff, 0.5);
      // light.position.set(1, 1, 1).normalize();
      light.position.set(100, 100, 50);
      light.castShadow = true;
      const dLight = 200;
      const sLight = dLight * 0.25;
      light.shadow.camera.left = - sLight;
      light.shadow.camera.right = sLight;
      light.shadow.camera.top = sLight;
      light.shadow.camera.bottom = - sLight;

      light.shadow.camera.near = dLight / 30;
      light.shadow.camera.far = dLight;

      light.shadow.mapSize.x = 1024 * 2;
      light.shadow.mapSize.y = 1024 * 2;
      scene.add(light);

      const geometry = new THREE.IcosahedronGeometry(radius, 3);


      renderer = new THREE.WebGLRenderer({ antialias: true });
      // renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setPixelRatio(2);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.xr.addEventListener('sessionstart', () => baseReferenceSpace = renderer.xr.getReferenceSpace())
      renderer.xr.enabled = true;
      document.append(renderer.domElement);
      // document.body.appendChild( renderer.domElement );


      //
      //是否支持VR的按钮
      document.append(VRButton.createButton(renderer));
      // document.body.appendChild(VRButton.createButton(renderer));

      // controllers
      function onSelectStart() {
        this.userData.isSelecting = true;
      }

      function onSelectEnd() {

        this.userData.isSelecting = false;
        // return;
        if (INTERSECTION) {

          lerpLength = 0;
          currentTargetPos.set(INTERSECTION.x, INTERSECTION.y + 0.8, INTERSECTION.z);
          body.position.set(currentTargetPos.x, currentTargetPos.y + 0.8, currentTargetPos.z);


          const offsetPosition = { x: - INTERSECTION.x, y: - INTERSECTION.y, z: - INTERSECTION.z, w: 1 };
          const offsetRotation = new THREE.Quaternion();
          const transform = new XRRigidTransform(offsetPosition,
            offsetRotation);
          const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform);
          renderer.xr.setReferenceSpace(teleportSpaceOffset);

        }

      }

      //加载左手柄， 监听其事件
      controller1 = renderer.xr.getController(0);
      controller1.addEventListener('selectstart', onSelectStart);
      controller1.addEventListener('selectend', onSelectEnd);
      controller1.addEventListener('connected', function (event) {
        // 监听手柄已连接事件。连接完成，创建手柄模型
        this.add(buildController(event.data));
      });
      controller1.addEventListener('disconnected', function () {
        //监听手柄断开连接
        // this.remove( this.children[ 0 ] );
      });
      scene.add(controller1);



      //右手柄
      controller2 = renderer.xr.getController(1);
      controller2.addEventListener('selectstart', onSelectStart);
      controller2.addEventListener('selectend', onSelectEnd);
      controller2.addEventListener('connected', function (event) {

        this.add(buildController(event.data));
      });
      controller2.addEventListener('disconnected', function () {
        // this.remove(this.children[0]);
      });
      scene.add(controller2);

      // CreateHandModel(controller1);
      // CreateHandModel(controller2);

      //创建头盔
      hmd = renderer.xr.getCamera();
      scene.add(hmd);
      // CreateHandModel(hmd);

      console.log("初始化vr控制器");

      const controllerModelFactory = new XRControllerModelFactory();

      //创建系统手柄模型。如在oculus平台 会创建oculus手柄模型
      // controllerGrip1 = renderer.xr.getControllerGrip(0);
      // controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
      // scene.add(controllerGrip1);

      // controllerGrip2 = renderer.xr.getControllerGrip(1);
      // controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
      // scene.add(controllerGrip2);


      // loadGltf(_this.$publicUrl +"models/player/Model/vrchild.gltf");

      //创建角色
      // loadFbx(_this.$publicUrl + "models/player/Model/vrchild.fbx");



    }


    var playerObj = null;
    var head = null;
    var body = null;
    var lefthand = null;
    var righthand = null;
    //加载热点的obj 模型
    const loadFbx = (path, name, texturePath) => {
      var fbxLoader = new FBXLoader();
      fbxLoader.load(path,
        function (object) {

          playerObj = object;

          playerObj.name = "sdf";
          playerObj.position.set(0, 0, 0); //原点位置
          playerObj.rotation.set(0, 3.14 / 2, 0); // 
          // let size = 1;
          let size = 0.01;
          playerObj.scale.set(size, size, size);

          // console.log("创建角色", playerObj);
          head = playerObj.children[0];
          body = playerObj.children[1];
          lefthand = playerObj.children[2];
          righthand = playerObj.children[3];

          // console.log("创建角色  头部",head);
          // console.log("创建角色  身体",body);
          // console.log("创建角色  左手",lefthand);
          // console.log("创建角色  右手",righthand);
          SetVRPlayerRefModel(hmd, head, new THREE.Vector3(0, -0.3, 0.1), new THREE.Vector3(3.14 / 2, 3.14 / 1, 0));
          // SetVRPlayerRefModel(hmd, head, new THREE.Vector3(0, 1.5, 1), new THREE.Vector3(3.14 / 2, 3.14 / 1, 0));
          // SetVRPlayerRefModel(hmd,lefthand,new THREE.Vector3(-0.1,1.5,0.1),new THREE.Vector3(3.14,3.14 / 1+3.14/4,0));
          // SetVRPlayerRefModel(hmd,righthand,new THREE.Vector3(0.1,1.5,-0.1),new THREE.Vector3(3.14,3.14 / 1-3.14/4,0));
          SetVRPlayerRefModel(controller1, lefthand, new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(3.14, 3.14 / 1, 0));
          SetVRPlayerRefModel(controller2, righthand, new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(3.14, 3.14 / 1, 0));
          // console.log("创建角色", playerObj);

          // if (local) {
          //   _this.YJController.SetPlayerToCamTarget(playerObj);

          // } else {
          //   scene.add(playerObj);
          //   console.log("创建角色镜像");

          // }

          // if (inSetDefaltPos) {
          //   playerObj.position.set(defultPos.x, defultPos.y, defultPos.z);
          // }
          scene.add(playerObj);

          scene.add(body);
          body.scale.set(size, size, size);
          body.rotation.set(3.14 / 2, 3.14 / 1, 0); // 

          // oldPos = getWorldPosition(playerObj); 
          return;

        }
      );

    }

    this.SetPlayerBody = function (_head, _lefthand, _righthand, _body) {

      head = _head;
      lefthand = _lefthand;
      righthand = _righthand;
      body = _body;


      SetVRPlayerRefModel(hmd, head, new THREE.Vector3(0, -0.3, 0.1), new THREE.Vector3(3.14 / 2, 3.14 / 1, 0));
      SetVRPlayerRefModel(controller1, lefthand, new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(3.14, 3.14 / 1, 0));
      SetVRPlayerRefModel(controller2, righthand, new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(3.14, 3.14 / 1, 0));

      scene.add(body);
      let size = 0.01;
      body.scale.set(size, size, size);
      body.rotation.set(3.14 / 2, 3.14 / 1, 0); // 
    }
    var hasPlayer = false;
    this.SetPlayerGroup = (group) => {
      playerParent.add(group);
      group.position.set(0, 0.0, 0);
      hasPlayer = true;
    }

    function GetHmdPos() {
      if (head != null) {
        return getWorldPosition(head);
      }
    }
    var lerpLength = 0;
    var currentTargetPos = new THREE.Vector3();  //平滑过渡时使用的变量
    var camTargetPos = new THREE.Vector3();  //摄像机切换的目标坐标

    //刷新身体所在位置。身体在头的下方，在头部转到一定角度时，身体跟随旋转
    function updateBodyPos() {
      if (body == null) {
        return;
      }
      camTargetPos = GetHmdPos();

      if (isNaN(camTargetPos.x) || isNaN(camTargetPos.y) || isNaN(camTargetPos.z)) { return; }

      // console.log(camTargetPos);
      lerpLength += 0.002;
      currentTargetPos.lerp(camTargetPos, lerpLength);
      body.position.set(currentTargetPos.x, currentTargetPos.y - 0.1, currentTargetPos.z);
      // console.log("body", body.position);
      // console.log("body 世界坐标",getWorldPosition(body));

    }



    function SetVRPlayerRefModel(target, child, offset, rota) {
      target.add(child);
      child.rotation.set(rota.x, rota.y, rota.z);
      child.position.set(offset.x, offset.y, offset.z);
      let size = 0.01;
      child.scale.set(size, size, size);
    }


    function CreateHandModel(controller) {
      let size = 0.1;
      let cubeGeometry = new THREE.BoxGeometry(size, size, size);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 1,
        transparent: true
      });
      var handModel = new THREE.Mesh(cubeGeometry, cubeMaterial);
      controller.add(handModel);
      handModel.position.set(0, 0, 0);
    }


    function buildController(data) {

      let geometry, material;

      switch (data.targetRayMode) {
        //手柄
        case 'tracked-pointer':

          geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
          geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

          material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

          return new THREE.Line(geometry, material);

        //头盔
        case 'gaze':

          geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
          material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
          return new THREE.Mesh(geometry, material);

      }

    }
    Init();
    animate();


    var clock = new THREE.Clock();//时间跟踪

    var moving = false;

    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    var _YJAmmoPlayer;
    var _YJAmmo;
    //设置动力学控制器。 水平旋转的物体
    this.SetAmmoPlayer = function (player) {
      _YJAmmoPlayer = player;
      //角色初始角度
      _YJAmmoPlayer.rotation.y = 3.14;
    }
    this.GetAmmoPlayer = function () {
      return hmd ;
      // return _YJAmmoPlayer ;
    }

    this.SetAmmoCtrl = function (YJAmmo) {
      _YJAmmo = YJAmmo;
    }

    this.GetRotateY = function () {
      return playerParent.rotation.y + _playerY;
    }
    var _playerRota = new THREE.Vector3(0, 0, 0);  //摄像机切换的目标坐标

    this.GetRotate = function () {
      if (_player == null) { return _playerRota; }
      _playerRota.x = _player.rotation.x;
      _playerRota.z = _player.rotation.z;

      _playerRota.y = _player.rotation.y + playerParent.rotation.y;

      return _playerRota;
    }
    this.GetCameraWorldPos = function () {
      return getWorldPosition(hmd);
    }
    //右键旋转控制
    function RotaPlayer() {
      if (_player != null) {
        //如果在受键盘或摇杆控制，则不受右键旋转
        if (inKeyboardOrJoystick) { return; }

        _playerY = pai / 2;
        _player.rotation.set(0, _playerY, 0);
        StopMovingTween();
      }
    }


    //跳跃
    var canJump = true;
    var jump = false;

    var canMoveForward = true;
    var canMoveBack = true;
    var canMoveLeft = true;
    var canMoveRight = true;

    //键盘控制的移动速度
    var actualMoveSpeed = 1;


    var hit_collider;
    var offsetY = new THREE.Vector3(0, 0.1, 0);


    var inJiaohuArea = false;
    //前后左右射线检测来做碰撞体
    function Raycaster_CreateCube(fromObj, toObj, d) {

      var fromPos = new THREE.Vector3(fromObj.position.x, fromObj.position.y + offsetY.y, fromObj.position.z);
      var toPos = new THREE.Vector3(fromObj.position.x, fromObj.position.y, fromObj.position.z);

      toPos = toObj.getWorldDirection(new THREE.Vector3());
      toPos.x *= d;
      toPos.y *= d;
      toPos.z *= d;


      // var raycaster_collider = new THREE.Raycaster(fromPos, toPos, 0, 8);
      var raycaster_collider = new THREE.Raycaster(fromPos, toPos, 0, 0.4);

      //只检测pointParent物体的子物体
      var intersects_collider = raycaster_collider.intersectObjects(_this.colliderList, true);
      if (intersects_collider.length > 0) {
        hit_collider = intersects_collider[0].object;
        // console.log(toObj.name +" 碰撞 "+ intersects_collider.length +"  "+ hit_collider.name + "  " );
        // console.log(toObj.name +" 碰撞 "+ intersects_collider.length +"  "+ hit_collider.tag + "  " );
        if (toObj.name == "forwardObj" && hit_collider.name.indexOf("door") > -1) {
          //碰到可交互物体
          inJiaohuArea = true;
          _this.ChangeTip(inJiaohuArea);


          return false

        }

        inJiaohuArea = false;
        _this.ChangeTip(inJiaohuArea);

        return false;
      } else {
        //YJdebug( toObj.name + "    未检测到物体 "  );
        if (toObj.name == "forwardObj") {
          inJiaohuArea = false;
          _this.ChangeTip(inJiaohuArea);
        }
      }
      return true;

    }

    this.ClickJump = function () {
      if (canJump === true) {
        Jump();
      }
    }
    //点击界面按钮 或 按F键交互可交互的物体，比如开关门
    this.ClickInteractive = function () {
      if (inJiaohuArea) {
        if (hit_collider.name.indexOf("door") > -1) {
          var item = hit_collider;
          for (let j = 0; j < 10; j++) {
            // console.log(item);

            if (item.tag != "door") {
              item = item.parent;
            } else {
              // console.log("查到父物体为door的物体 ");

              for (let i = 0; i < _this.sceneModels.length; i++) {
                var sceneModel = _this.sceneModels[i];
                if (sceneModel.id == item.name) {
                  sceneModel.model.PlayAnim();
                  // console.log("碰到 door,查询其动画 ");
                  continue;
                }
              }
              break;

            }

          }
          // console.log(hit_collider);
          // console.log(hit_collider.parent);
          // console.log(hit_collider.parent.parent);
          // console.log(hit_collider.parent.parent.parent);
          // console.log(hit_collider.parent.parent.parent.parent);
          // console.log(hit_collider.parent.parent.parent.parent.parent);
          // console.log(hit_collider.parent.parent.parent.parent.parent.parent);

        }
        inJiaohuArea = false;
        _this.ChangeTip(inJiaohuArea);
      }
    }

    var b_lerpChangeView = false; //是否开始平滑过渡 
    var lerpLength = 0;  //平滑过渡值，取值范围 0 - 1
    var currentTargetPos = new THREE.Vector3();  //平滑过渡时使用的变量
    var currentTargetRota = new THREE.Vector3();  //平滑过渡时使用的变量
    var currentCam = new THREE.Vector3();  //摄像机的偏移位置


    var isMoving = false;

    var movingTween = null;
    //移动到目标位置
    this.MoveToTarget = (v3) => {

      currentTargetPos.x = playerParent.position.x;
      currentTargetPos.y = playerParent.position.y;
      currentTargetPos.z = playerParent.position.z;

      camTargetPos = v3;
      camTargetPos.y = currentTargetPos.y;
      // b_lerpChangeView = true;
      isMoving = true;
      lerpLength = 0;

      //让角色朝向目标位置
      _player.lookAt(camTargetPos);
      _playerY = _player.rotation.y;



      //移动到目标位置。在移动前判断角色和目标位置之间是否有障碍物
      var distance = currentTargetPos.distanceTo(camTargetPos);
      if (movingTween != null) {
        movingTween.stop();
      }
      movingTween = new TWEEN.Tween(currentTargetPos).to(camTargetPos, distance * 700).easing(TWEEN.Easing.Linear.None)
      let updateTargetPos = () => {
        playerParent.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画

      movingTween.onComplete(() => {
        isMoving = false;
      });

    }

    var joystickSpeed = 0.05;
    var laterStopJoystick = null;
    //摇杆控制移动
    this.MoveByJoystickAxis = (x, y) => {

      inKeyboardOrJoystick = true;
      isMoving = true;

      if (y > 0) {
        _playerY = 2 * pai + (x - 1) * pai / 2;
      } else {
        _playerY = 2 * pai - (x - 1) * pai / 2;
      }
      _player.rotation.set(0, _playerY, 0);
      if (laterStopJoystick != null) {
        clearTimeout(laterStopJoystick);
      }
      laterStopJoystick = setTimeout(() => {
        isMoving = false;
        inKeyboardOrJoystick = false;

      }, 100);
      StopMovingTween();


      var moveX = -y * joystickSpeed;
      var moveY = x * joystickSpeed;

      if (moveX > 0 && canMoveForward) {
        playerParent.translateX(moveX);
      }
      if (moveX < 0 && canMoveBack) {
        playerParent.translateX(moveX);
      }
      if (moveY < 0 && canMoveLeft) {
        playerParent.translateZ(moveY);
      }
      if (moveY > 0 && canMoveRight) {
        playerParent.translateZ(moveY);
      }



      // playerParent.translateX(-y*joystickSpeed);
      // playerParent.translateZ(x*joystickSpeed);




    }
    //停止点击地面移动的tween
    function StopMovingTween() {
      if (movingTween != null) {
        movingTween.stop();
        isMoving = false;
        movingTween = null;
      }
    }

    //设置角色移动速度
    this.SetMoveSpeed = (f) => {
      actualMoveSpeed = f;
    }

    //角色引用
    var _player = null;
    var _playerY = 0;
    //把第三人称角色，添加到摄像机目标中，即摄像机中心
    this.SetPlayerToCamTarget = (player) => {
      // console.log(" 添加角色 ");
      _player = player;
      playerParent.add(player);
      // player.position.set(0, -0.5, 0);
      player.position.set(0, -0.0, 0);
    }

    this.RemovePlayer = () => {
      console.log(" 删除本地角色 ");
      playerParent.remove(_player);
    }

    this.SetTarget = (targetPos, camPosX) => {

      currentTargetPos.x = targetPos.x;
      currentTargetPos.y = targetPos.y;
      currentTargetPos.z = targetPos.z;
      // camTargetPos = targetPos;
      camTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
      if (camPosX == null || camPosX == undefined) return;
      wheelCurrentValue = camPosX;
      currentCam.set(wheelCurrentValue, 0, 0);
      camera.position.set(wheelCurrentValue, 0, 0);

      // console.log("in yjcontroller   camPosx = " + camPosX  );
      // console.log("in yjcontroller   camPosx = " + camPosX + "  targetPos = " + 
      // posToString(targetPos)+ "this.wheelCurrentValue = " + this.wheelCurrentValue );
    }
    this.SetCamPos = (pos) => {
      camera.position.set(wheelCurrentValue, 0, 0);

      camTarget.rotation.set(targetRota.x, targetRota.y, targetRota.z);

      // console.log("in yjcontroller targetRota = "+posToString(camTarget.rotation));
    }
    this.SetTargetRota = (targetRota) => {
      camTarget.rotation.set(targetRota.x, targetRota.y, targetRota.z);

      // console.log("in yjcontroller targetRota = "+posToString(camTarget.rotation));
    }
    this.SetLerpToTarget = (targetPos, targetRota, camPosX) => {
      camTargetPos = targetPos;

      camTargetRota = (targetRota);
      //角度转弧度
      // camTargetRota =RotaV3ToRota(targetRota) ;
      // console.log("in camTargetRota 222 = "+posToString(camTargetRota));

      wheelCurrentValue = camPosX;
      camTargetCamZ.set(camPosX, 0, 0);

      currentTargetRota = RotaToV3(camTarget.rotation);
      camTargetRota = currentTargetRota; //不旋转角度
      b_lerpChangeView = true;

      // console.log("in targetRota = ",(camTarget.rotation));
      // console.log("in targetRota 222 = "+posToString(camTarget.rotation));
    }
    function RotaToV3(rotation) {
      return new THREE.Vector3(rotation.x, rotation.y, rotation.z);
    }

    // var jumpValue = 0.5;
    var jumpUpValue = new THREE.Vector3(0, 0.5, 0);  //平滑过渡时使用的变量
    var jumpDownValue = new THREE.Vector3(0, 0.09, 0);  //平滑过渡时使用的变量
    var jumpValueZero = new THREE.Vector3(0, 0, 0);  //平滑过渡时使用的变量

    //是否在地面。跳起后，实时检测是否已碰到地面，碰到地面时，不允许下降
    var _YJPlayer = null;
    this.SetPlayer = (yjplayer) => {
      _YJPlayer = yjplayer;
    }
    this.GetPlayer = () => {
      return camera;
    }

    var animName = "idle";

    function SetPlayerAnimName() {

      console.log("设置玩家角色动作 " + animName);
      _YJPlayer.ChangeAnim(animName);

    }

    function Jump() {
      jump = true;

      // jumpValue = 0.5;
      // jumpValue.set(0,0.1,0);
      var currentJump = new THREE.Vector3(0, jumpUpValue.y, 0);

      let tween1 = new TWEEN.Tween(currentJump).to(jumpValueZero, 500).easing(TWEEN.Easing.Linear.None)
      let updateTargetPos = () => {
        playerParent.translateY(currentJump.y);
        StopMovingTween();
      }

      tween1.onUpdate(updateTargetPos);
      tween1.start() // 启动动画

      tween1.onComplete(() => {
        jump = false;

        // console.log("tween 动画完成！");
        let tween2 = new TWEEN.Tween(currentJump).to(jumpDownValue, 500).easing(TWEEN.Easing.Linear.None)
        let updateTargetPosDown = () => {
          if (canJump) { return; }
          playerParent.translateY(-currentJump.y);
          StopMovingTween();
        }
        tween2.onUpdate(updateTargetPosDown);
        tween2.start() // 启动动画
      });




    }

    var pai = Math.PI;
    var inKeyboardOrJoystick = false;

    function handleController(controller) {

      if (controller.userData.isSelecting) {

        const object = room.children[count++];

        object.position.copy(controller.position);
        object.userData.velocity.x = (Math.random() - 0.5) * 3;
        object.userData.velocity.y = (Math.random() - 0.5) * 3;
        object.userData.velocity.z = (Math.random() - 9);
        object.userData.velocity.applyQuaternion(controller.quaternion);

        if (count === room.children.length) count = 0;

      }

    }

    function CreateCube() {
      const object = room.children[count++];

      object.position.copy(controller.position);
      object.userData.velocity.x = (Math.random() - 0.5) * 3;
      object.userData.velocity.y = (Math.random() - 0.5) * 3;
      object.userData.velocity.z = (Math.random() - 9);
      object.userData.velocity.applyQuaternion(controller.quaternion);

      if (count === room.children.length) count = 0;

    }



    function animate() {
      renderer.setAnimationLoop(render);

    }

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;



    var userData = {
      headPos: { x: 0, y: 0, z: 0 },
      lefthandPos: { x: 0, y: 0, z: 0 },
      righthandPos: { x: 0, y: 0, z: 0 },
      headRota: { x: 0, y: 0, z: 0 },
      lefthandRota: { x: 0, y: 0, z: 0 },
      righthandRota: { x: 0, y: 0, z: 0 },
    };
    var oldheadPos = new THREE.Vector3();
    var oldlefthandPos = new THREE.Vector3();
    var oldrighthandPos = new THREE.Vector3();

    function v3Equle(v1, v2) {
      return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z
    }
    //发送-本地向服务器发送角色坐标
    this.updateSend = function () {
      // return;
      if (!hasPlayer) { return; }

      // var headPos = getWorldPosition(hmd);
      // var lefthandPos = getWorldPosition(controller1);
      // var righthandPos = getWorldPosition(controller2);

      var headPos = getWorldPosition(head);
      var lefthandPos = getWorldPosition(lefthand);
      var righthandPos = getWorldPosition(righthand);
      // var bodyPos = getWorldPosition(body);

      // console.log("发送VR实时位置",headPos);

      // if(v3Equle(oldheadPos, headPos) && 
      // v3Equle(oldlefthandPos, lefthandPos)  
      //   &&  v3Equle(oldrighthandPos, righthandPos)){
      //     return;
      //   }
      // console.log("发送VR实时位置222");


      userData.headPos = { x: headPos.x, y: headPos.y, z: headPos.z };
      userData.lefthandPos = { x: lefthandPos.x, y: lefthandPos.y, z: lefthandPos.z };
      userData.righthandPos = { x: righthandPos.x, y: righthandPos.y, z: righthandPos.z };
      // userData.bodyPos =  {x:bodyPos.x,y:bodyPos.y,z:bodyPos.z};

      var headRota = hmd.rotation;
      var lefthandRota = controller1.rotation;
      var righthandRota = controller2.rotation;
      // var bodyRota = body.rotation;
      userData.headRota = { x: headRota.x, y: headRota.y, z: headRota.z };
      userData.lefthandRota = { x: lefthandRota.x, y: lefthandRota.y, z: lefthandRota.z };
      userData.righthandRota = { x: righthandRota.x, y: righthandRota.y, z: righthandRota.z };
      // userData.bodyRota =  {x:bodyRota.x,y:bodyRota.y,z:bodyRota.z};


      // console.log(" 角色当前世界坐标为 ",newPos);
      _this.SetUserData(userData);

      oldheadPos = headPos;
      oldlefthandPos = lefthandPos;
      oldrighthandPos = righthandPos;
    }



    function render() {


      //监听手柄按键后执行的事件
      // handleController(controller1);
      // handleController(controller2);


      INTERSECTION = undefined;
      //左手瞬移
      if (controller1.userData.isSelecting === true) {

        tempMatrix.identity().extractRotation(controller1.matrixWorld);

        teleportRaycaster.ray.origin.setFromMatrixPosition(controller1.matrixWorld);
        teleportRaycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

        // const intersects = teleportRaycaster.intersectObjects( [ floor ] );
        const intersects = teleportRaycaster.intersectObjects(_this.pointsParent.children);

        if (intersects.length > 0) {

          INTERSECTION = intersects[0].point;

        }



      } else if (controller2.userData.isSelecting === true) {

        tempMatrix.identity().extractRotation(controller2.matrixWorld);

        teleportRaycaster.ray.origin.setFromMatrixPosition(controller2.matrixWorld);
        teleportRaycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

        // const intersects = teleportRaycaster.intersectObjects( [ floor ] );
        const intersects = teleportRaycaster.intersectObjects(_this.pointsParent.children);

        if (intersects.length > 0) {

          INTERSECTION = intersects[0].point;

        }

      }


      if (INTERSECTION) {
        // marker.position.copy( INTERSECTION );
        marker.position.set(INTERSECTION.x, INTERSECTION.y + 0.01, INTERSECTION.z);
      }

      marker.visible = INTERSECTION !== undefined;
      renderer.render(scene, camera);

      // updateBodyPos();

      //刷新其他脚本的动作
      _Global.YJ3D._YJSceneManager.update();

    }

    function posToString(v) {
      return v.x + "  " + v.y + "  " + v.z;
    }

  }
}

export { YJVRController };