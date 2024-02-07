



/**
 结构
 --_YJAmmoPlayer 刚体
   --camBaseParent 摄像机旋转父物体，用于左右旋转
      --camTarget 摄像机父物体，用于上下旋转
        --camera 摄像机

 */


import * as THREE from "three";

import TWEEN from '@tweenjs/tween.js';
import { YJPlayerFireCtrl } from "./YJPlayerFireCtrl.js"; //战斗控制

class YJController {
  constructor(scene, camera, domElement, _this) {
    if (domElement === undefined) {
      console.warn('THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.');
      domElement = document;
    }
    var scope = this;
    this.enabled = true;
    this.SetEnabled = function (b) {
      scope.enabled = b;
    }

    // Mouse buttons
    this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
    var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

    var PLAYERSTATE = {
      NORMAL: -1,
      DEAD: 0,
      ATTACK: 1000,
      ATTACKING: 1001,
      INTERACTIVE: 2,
      SITTING: 3,
    };
    var playerState = PLAYERSTATE.NORMAL;
    // true :鼠标左键只旋转视角
    var leftMouseRotaView = true;

    var state = STATE.NONE;

    // this.object = object;
    this.domElement = domElement;

    // 视角缩放 。是控制摄像机相对摄像机目标体的X轴偏移量。 是负数，越小越远
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    // 视角旋转。控制摄像机目标体的旋转
    this.enableRotate = true;
    this.rotateSpeed = 4.0;

    // 平移。控制摄像机目标体相对屏幕空间的偏移
    this.enablePan = true;
    this.keyPanSpeed = 7.0;	// pixels moved per arrow key push


    let prevTime = performance.now();

    const velocity = new THREE.Vector3();
    var playerParent = null;
    var camTarget = null;

    let camTargetDirection = null;

    let lookatRef = null;

    let targetGroup = null;
    let camPosRefGroup = null;
    let camRotaRefGroup = null;


    let b_lookat = false;
    let leplookatviewLength = 0;
    // 摄像机跟随目标物体的最高速度
    let lookatSpeedMax = 0.05;
    // let lookatSpeedMax = 0.02;
    let currentCamPos = new THREE.Vector3(0, 10, 0);
    let currentLookatPos = new THREE.Vector3(0, 10, 0);
    let currentCamrotaRefGroupPos = new THREE.Vector3(0, 10, 0);
    //#region 
    //#endregion

    //#region 鸟瞰坐标

    // 鸟瞰时，摄像机位置
    let niaokanCamPos = new THREE.Vector3(0, 1, 0);
    // 鸟瞰时，摄像机lookat位置
    let niaokanCamLookatPos = new THREE.Vector3(0, 0, 0);



    let setting = {};
    this.SetSetting = function (_setting) {
      setting = _setting;


      this.SetCameraOffsetY(setting.camOffsetY);
      this.SetCameraOffset(setting.cameraOffset);
      this.SetMinMax(setting.targetRota);
      this.SetWheelMinMax({ x: setting.camWheelMax, y: -0.01 });
      this.SetCamTargetHeight(setting.playerHeight);
      this.SetCanMouseWheel(setting.canMouseWheel);


      if (setting.wheeStep != undefined) {
        wheeStep = setting.wheeStep;
      }

      canDampingRota = (setting.canDampingRota != undefined && setting.canDampingRota);

      // 单品展示控制时，设置角色不可移动
      if (setting.singleModel != null) {
        this.SetCanMoving(!setting.singleModel);
      }


      if (setting.rotaDirection) {
        this.SetRotaDirection(setting.rotaDirection);
      }

      if (setting.cameraFov) {
        camera.fov = setting.cameraFov;
        camera.updateProjectionMatrix();
      }

      this.SetContrlStateOnly(setting.contrlState, setting.wheelValue);
    }


    // this.SetNiaokanPos = (campos, camlookatpos) => {
    //   niaokanCamPos.set(campos.x, campos.y, campos.z);
    //   niaokanCamLookatPos.set(camlookatpos.x, camlookatpos.y, camlookatpos.z);
    // }
    // 设置鸟瞰摄像机坐标
    this.SetNiaokanPos = (campos) => {
      niaokanCamPos.set(campos.x, campos.y, campos.z);
      directToNiaokan();
    }
    // 设置鸟瞰摄像机lookat目标点
    this.SetNiaokanLookatPos = (camlookatpos) => {
      niaokanCamLookatPos.set(camlookatpos.x, camlookatpos.y, camlookatpos.z);
      directToNiaokan();
      niaokanPosParent.position.copy(niaokanCamLookatPos);
    }

    // 直接设置到鸟瞰位置
    function directToNiaokan() {

      if (setting.hasCamRaycast != undefined && !setting.hasCamRaycast) {
        return;
      }
      camera.position.set(niaokanCamPos.x, niaokanCamPos.y, niaokanCamPos.z);
      camera.lookAt(niaokanCamLookatPos.x, niaokanCamLookatPos.y, niaokanCamLookatPos.z);

    }

    //#endregion

    this.SetCameraParent = function (parent, offset) {

      parent.add(camera);

      // camera.position.copy(offset);
      setTimeout(() => {
        camera.position.set(0, 200, 0);
        camera.lookAt(new THREE.Vector3(1, 200, 0));
        // camera.rotation.y = 1.5+0.3; 

      }, 100);
    }

    // 视角跟随摄像机目标位置的高度，是角色的高度偏移。可以让角色放在画面靠下位置
    let camOffsetY = 1.6;
    this.SetCameraOffsetY = function (f) {
      camOffsetY = f;
    }
    // 摄像机在角色后方的偏移位置
    let cameraOffset = new THREE.Vector3(0, 5, -7);
    this.SetCameraOffset = function (pos) {

      cameraOffset.x = pos.x;
      cameraOffset.y = pos.y;
      cameraOffset.z = pos.z;
      camPosRefGroup.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);
      // camPosRefGroup.add(new THREE.AxesHelper(5));
    }

    let niaokanPosParent = null;
    //初始化摄像机父物体，移动时，移动父物体， 旋转时，横向旋转父物体，竖向旋转摄像机
    const Init = () => {
      let size = 0.00;
      let cubeGeometry = new THREE.BoxGeometry(size, size, size);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0,
        alphaTest: true,
        transparent: true
      });

      playerParent = new THREE.Mesh(cubeGeometry, cubeMaterial);
      playerParent.position.set(0, 0, 0);
      scene.add(playerParent);

      camTarget = new THREE.Mesh(cubeGeometry, cubeMaterial);
      // camTarget = new THREE.Group(); 
      scene.add(camTarget);
      camTarget.position.set(0, 0, 0);

      // let axes = new THREE.AxesHelper(0.5); // 坐标轴
      // camTarget.add(axes); // 场景添加坐标轴

      camTarget.name = "camTarget";

      scene.add(camera);
      camera.name = "camera";
      // let axes = new THREE.AxesHelper(100); // 场景坐标轴
      // scene.add(axes); // 场景添加坐标轴

      lookatRef = new THREE.Group();
      scene.add(lookatRef);
      lookatRef.name = "lookatRef";
      // let axes = new THREE.AxesHelper(5); // 坐标轴
      // lookatRef.add(axes); // 场景添加坐标轴

      // targetGroup = new THREE.Group();
      // scene.add(targetGroup);
      // let axes = new THREE.AxesHelper(5); // 坐标轴
      // targetGroup.add(axes); // 场景添加坐标轴

      camRotaRefGroup = new THREE.Group();
      camRotaRefGroup.name = "camRotaRefGroup";
      scene.add(camRotaRefGroup);
      camPosRefGroup = new THREE.Group();
      camPosRefGroup.name = "camPosRefGroup";


      niaokanPosParent = new THREE.Group();
      niaokanPosParent.name = "niaokanPosParent";
      scene.add(niaokanPosParent);


      // let axes2 = new THREE.AxesHelper(5); // 坐标轴
      // camera.add(axes2); // 场景添加坐标轴


      // let axes3 = new THREE.AxesHelper(5); // 坐标轴
      // camRotaRefGroup.add(axes3); // 场景添加坐标轴

      // let axes2 = new THREE.AxesHelper(5); // 坐标轴
      // camPosRefGroup.add(axes2); // 场景添加坐标轴

      camRotaRefGroup.add(camPosRefGroup);
      camPosRefGroup.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);


      camTargetDirection = new THREE.Group();
      camTargetDirection.name = "camTargetDirection";
      camTarget.add(camTargetDirection);
      camTargetDirection.position.set(0, -1, 0);
      camTargetDirection.rotation.set(0, 3.14 / 2 + Math.PI, 0);

      // let axes = new THREE.AxesHelper(5); // 坐标轴
      // camTargetDirection.add(axes); // 场景添加坐标轴
      directToNiaokan();

    }

    //#region 角色头像相机 
    //#endregion
    Init();



    //#region 角色控制模式切换

    // 视角控制模式：
    // 0 键鼠 键盘wsad行走，鼠标转向  或者 移动端 左右摇杆 左摇杆控制行走，右摇杆控制转向
    // 1 鼠标 鼠标点击地面移动，视角自动回正
    var CONTRLSTATE = { KEYBOARD_MOUSE: 0, MOUSE: 1 };
    var contrlState = CONTRLSTATE.KEYBOARD_MOUSE;
    // var contrlState = CONTRLSTATE.MOUSE;


    this.SetContrlStateOnly = function (k, w) {
      if (k == 0) {
        contrlState = CONTRLSTATE.KEYBOARD_MOUSE;
        this.addMouseEventListener();
        wheelCurrentValue = w;
        if (w >= -1) {
          //距离太近，表示在用第一人称视角，则隐藏角色
          Display(false);
        }
      }
      if (k == 1) { contrlState = CONTRLSTATE.MOUSE; }
    }

    this.SetContrlState = function (k, w) {
      if (k == 0) {
        contrlState = CONTRLSTATE.KEYBOARD_MOUSE;
        this.addMouseEventListener();
        wheelCurrentValue = w;
        if (w >= -1) {
          //距离太近，表示在用第一人称视角，则隐藏角色
          Display(false);
        }
      }
      if (k == 1) { contrlState = CONTRLSTATE.MOUSE; }
      ChangeCtrl();

    }

    this.SetContrlState2 = function () {
      let index = 0;
      if (contrlState == CONTRLSTATE.KEYBOARD_MOUSE) {
        index = 0;
      }
      if (contrlState == CONTRLSTATE.MOUSE) {
        index = 1;
      }
      index++;
      if (index >= 2) {
        index = 0;
      }
      this.SetContrlState(index);
      return index;
    }
    // 两种操作模式互相切换
    function ChangeCtrlStateCall() {
      if (contrlState == CONTRLSTATE.MOUSE) {
        contrlState = CONTRLSTATE.KEYBOARD_MOUSE;
        _YJAmmo.ChangeContrlState(0);
      } else {
        contrlState = CONTRLSTATE.MOUSE;
        _YJAmmo.ChangeContrlState(1);
      }
      ChangeCtrl();
    }
    this.ChangeCtrlState = function () {
      ChangeCtrl();
    }

    //#region 事件监听

    let onViewStateChange = null;
    //监听人视/鸟瞰视角转换
    this.OnViewStateChange = function (callback) {
      onViewStateChange = callback;
    }
    function OnViewStateChangeFn(e) {
      if (onViewStateChange) {
        onViewStateChange(e);
      }
      // console.log(" 切换视角状态 ",e);
    }

    let onRotaBase = null;
    //监听人视/鸟瞰视角转换
    this.OnRotaBase = function (callback) {
      onRotaBase = callback;
    }
    function OnRotaBaseFn() {
      if (onRotaBase) {
        onRotaBase();
      }
    }



    //#endregion


    // 切换控制模式
    function ChangeCtrl() {
      // return;
      // console.log(" 切换控制模式 setting ", setting);

      hasCamRaycast = setting.hasCamRaycast != undefined && setting.hasCamRaycast;
      //
      viewStateEnum = "人视";
      OnViewStateChangeFn(viewStateEnum);

      // console.error(" 切换控制模式 ", contrlState);
      // console.log(" 切换控制模式 ", contrlState);
      //键鼠、摇杆控制，转向由玩家控制
      if (contrlState == CONTRLSTATE.KEYBOARD_MOUSE) {


        // 取消转到鸟瞰视角
        b_lepToNiaokan = false;
        b_lerpMovePlayer = false;
        b_lerplookat = false;
        b_lookat = false;
        b_lepCamRotaGroup = false;

        camTarget.position.set(0, camOffsetY, 0);

        camTarget.add(camera);

        // let a = 5;
        // let b = 7;
        // let c = Math.sqrt(a*a+b*b);
        // let r=  Math.asin(a/c);
        // wheelCurrentValue = -c;


        let a = cameraOffset.y - camOffsetY;
        let b = Math.abs(cameraOffset.z);
        let c = Math.sqrt(a * a + b * b);
        let r = Math.asin(a / c);
        wheelCurrentValue = -c;



        camTarget.rotation.set(0, - Math.PI / 2, (-r));
        // console.log("set  camtarget.rotation 000000==== = "+posToString(camTarget.rotation));

        camera.rotation.set(0, - Math.PI / 2, 0);

        Display(true);

        // 第一人称视角
        if (setting.firstPerson != undefined && setting.firstPerson) {
          wheelCurrentValue = 0;
          wheelMin = 0;
          wheelMax = 0;
          currentWheelValue = 0;
          camera.position.set(0, 0, 0);
          Display(false);
          viewState = 1;
          return;
        }
        if (viewState == 1) {
          camera.position.set(0, 0, 0);
          return;
        }
        // console.log( Math.asin(a/c));

        camera.position.set(wheelCurrentValue, 0, 0);


      } else {




        let pos = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());
        currentCamrotaRefGroupPos.lerp(pos, 1);
        camRotaRefGroup.position.set(currentCamrotaRefGroupPos.x, currentCamrotaRefGroupPos.y, currentCamrotaRefGroupPos.z);

        let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
        camRotaRefGroup.quaternion.rotateTowards(lookatQuat, 10); //rotateTowards进度改为10才能立即设置到目标旋转


        scene.add(camera);

        _player.rotation.set(0, Math.PI / 2, 0);



        let camTargetPos = camPosRefGroup.getWorldPosition(new THREE.Vector3());
        currentCamPos.lerp(camTargetPos, 1);
        camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);

        let playerpos = _YJAmmoPlayer.position.clone();
        playerpos.y += camOffsetY;
        currentLookatPos.lerp(playerpos, 1);
        camera.lookAt(currentLookatPos);


        // 第一人称视角
        if (setting.firstPerson) {
          camera.position.set(0, 0, 0);
          Display(false);
          return;
        }

      }

    }
    this.OnlySetCtrlView = function () {
      ChangeSingleCtrl();
    }
    function ChangeSingleCtrl() {

      camTarget.add(camera);

      // let a = 5;
      // let b = 7;
      // let c = Math.sqrt(a*a+b*b);
      // let r=  Math.asin(a/c);
      // wheelCurrentValue = -c;

      camTarget.position.set(0, camOffsetY, 0);

      let a = cameraOffset.y - camOffsetY;
      let b = Math.abs(cameraOffset.z);
      let c = Math.sqrt(a * a + b * b);
      let r = Math.asin(a / c);
      wheelCurrentValue = -c;

      camTarget.rotation.set(0, - Math.PI / 2, (-r));
      camera.rotation.set(0, - Math.PI / 2, 0);
      camera.position.set(wheelCurrentValue, 0, 0);


    }

    //#endregion


    //设置控制器/角色的初始位置
    this.SetConctrollerInitPos = function (pos) {
      playerParent.position.set(pos.x, pos.y, pos.z);
    }

    var clock = new THREE.Clock();//时间跟踪

    //是否能移动和跳跃。 当玩家在控制不可移动和跳跃的载具时，设置控制器为不可移动和跳跃
    var canMoving = true;
    this.SetCanMoving = function (b) {
      canMoving = b;
    }
    this.onblur = function () {
      moveForward = false;
      moveLeft = false;
      moveRight = false;
      moveBackward = false;
      if (_YJAmmo == undefined) { return; }
      _YJAmmo.onblur();
    }
    this.getWorldPosition = function (object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    function getScreenPosition(world_vector) {
      // let projector = new THREE.Projector();  
      let vector = world_vector.project(camera);
      let halfWidth = window.innerWidth / 2;
      let halfHeight = window.innerHeight / 2;

      return {
        x: Math.round(vector.x * halfWidth + halfWidth),
        y: Math.round(-vector.y * halfHeight + halfHeight)
      };
    }
    function getZoomScale() {
      return Math.pow(0.95, scope.zoomSpeed);
    }

    this.GetRotateY = function () {
      return playerParent.rotation.y + _playerY;
    }

    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }



    //是否锁定角色的显示隐藏状态，锁定后不受视角远近控制
    let lockDisplay = false;
    this.SetLockDisplay = function (b) {
      lockDisplay = b;
    }
    // 外部设置角色模型显示或隐藏
    this.SetPlayerDisplay = function (b) {
      Display(b);
    }

    this.SetPlayerAnim = function (_animName) {
      playerState = PLAYERSTATE.INTERACTIVE;
      animName = _animName;
      userData.onlySetAnim = true;
      console.error("外部设置角色动作");
    }
    this.SetPlayerExpression = function (expressionPath) {
      _YJPlayer.CreateFacePlane(expressionPath);
      userData.expression = expressionPath;

    }
    let onWheelChangeAction;
    this.SetWheelChangeHandler = function (callback) {
      onWheelChangeAction = callback;
    }
    let display = true;
    function Display(b) {
      if (_player == null) { return; }

      if (onWheelChangeAction) {
        onWheelChangeAction(wheelCurrentValue);
      }
      // console.error("设置模型显示或隐藏 ",b,lockDisplay,display);

      if (lockDisplay) { return; }

      if (display == b) { return; }
      if (b) {
        _YJPlayer.GetPlayerGroup().scale.set(1, 1, 1);
        if (viewState == 1) { viewState = 0; }
      } else {
        _YJPlayer.GetPlayerGroup().scale.set(0.001, 0.001, 0.001);
      }
      display = b;

    }

    this.ChangeCameraFar = function () {
      // 还原到远距离
      ChangeCameraFarFn();
    }
    function ChangeCameraFarFn() {
      if (viewState == 0) {
        camera.position.set(0, 0, 0);
        Display(false);
        viewState = 1;
      } else {
        camera.position.set(wheelCurrentValue, 0, 0);
        viewState = 0;
        Display((wheelCurrentValue != wheelMax));
      }
    }
    this.ChangeCameraToFar = function () {
      // camera.position.set(wheelCurrentValue, 0, 0);
      viewState = 0;
      Display((wheelCurrentValue != wheelMax));
    }


    //#region  鼠标控制、触摸控制

    this.mouseX = 0;
    this.mouseY = 0;

    this.mouseXold = 0;
    this.mouseYold = 0;

    let wheelMin = -20;
    let wheelMax = -1;
    var wheelCurrentValue = -15;

    this.minY = -1.25;
    this.maxY = -0.03;
    this.SetMinMax = function (minmax) {
      this.minY = minmax.x;
      this.maxY = minmax.y;
    }
    this.SetWheelMinMax = function (minmax) {
      wheelMin = minmax.x;
      wheelMax = minmax.y;
    }


    this.onMouseDown = function (event) {
      if (scope.enabled === false) return;

      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      this.mouseXold = this.mouseX;
      this.mouseYold = this.mouseY;

      // if (this.domElement !== document) {
      // }
      this.domElement.focus();
      event.preventDefault();
      switch (event.button) {
        //鼠标左键
        case scope.mouseButtons.ORBIT:
          if (scope.enableRotate === false) return;
          // handleMouseDownRotate( event );
          state = STATE.ROTATE;
          break;
        case scope.mouseButtons.ZOOM:
          if (scope.enableZoom === false) return;
          // handleMouseDownDolly( event );
          state = STATE.DOLLY;
          break;
        //鼠标右键
        case scope.mouseButtons.PAN:
          if (scope.enablePan === false) return;
          state = STATE.PAN;
          rotaViewDoonce = 0;

          break;
      }
    };

    this.onMouseUp = function (event) {
      if (pointerLock) {
        return;
      }
      state = STATE.NONE;

    };

    let wheeStep = 0.5;
    let canMouseWheel = true;
    this.SetCanMouseWheel = function (b) {
      canMouseWheel = b;
    }
    this.onMouseWheel = function (event) {

      if (!canMouseWheel) { return; }


      if (this.enabled === false || this.enableZoom === false) return;
      event.preventDefault();
      let f = 1;
      if (event.deltaY < 0) {
        wheelCurrentValue += wheeStep;
        f = -1;
      } else if (event.deltaY > 0) {
        wheelCurrentValue -= wheeStep;
        f = 1;
      }
      if (wheelCurrentValue <= wheelMin) {
        wheelCurrentValue = wheelMin;
        f = 0;
      }
      if (wheelCurrentValue >= wheelMax) {
        wheelCurrentValue = wheelMax;
        f = 0;
      }
      currentCam.set(wheelCurrentValue, 0, 0);
      camera.position.set(wheelCurrentValue, 0, 0);
      // camera.translateZ(wheeStep * f);

      // console.log("wheelCurrentValue = "+ wheelCurrentValue,wheelMin,wheelMax,camera.position);
      //当离摄像机最近的时候，隐藏角色
      Display((wheelCurrentValue != wheelMax));
    }

    // 是否在只旋转视角状态。当坐在座位上时，设置onlyRotaView为true, 则左右键旋转都只能旋转视角，不旋转角色
    let onlyRotaView = false;
    this.SetOnlyRotaView = function (b) {
      onlyRotaView = b;
    }

    // 鼠标无限滑动锁定
    let pointerLock = false;
    this.SetPointerLock = function (b) { pointerLock = b; }
    this.onMouseMove = function (event) {
      if (scope.enabled === false) return;

      if (pointerLock) {
        const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        var x = movementX * 0.002 * 0.8;
        var y = movementY * -0.002 * 0.8;
        RotaBase(x * this.rotateSpeed, y);
        RotaPlayer();
        return;
      }

      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      var x = this.mouseX - this.mouseXold;
      var y = this.mouseY - this.mouseYold;
      event.preventDefault();
      switch (state) {
        case STATE.ROTATE:
          if (scope.enableRotate === false) return;
          // console.log( "垂直旋转时旋转摄像机 z = " + camTarget.rotation.z);
          // RotaCamTarget(-x * this.rotateSpeed, y);

          if (leftMouseRotaView && !(moveForward || moveLeft || moveRight || moveBackward)) {
            RotaBase_leftMouse(x * this.rotateSpeed, y);
          } else {
            RotaBase(x * this.rotateSpeed, y);
            RotaPlayer();
          }

          break;
        case STATE.DOLLY:
          if (scope.enableZoom === false) return;
          // handleMouseMoveDolly( event );
          break;
        case STATE.PAN:
          if (scope.enablePan === false) return;
          if (onlyRotaView) {
            RotaBase_leftMouse(x * this.rotateSpeed, y);
          } else {
            if (leftMouseRotaView && !(moveForward || moveLeft || moveRight || moveBackward)) {
              RotaBase_leftMouse(x * this.rotateSpeed, y);
            } else {
              RotaBase(x * this.rotateSpeed, y);
              RotaPlayer();
            }
          }
          break;

      }
      this.mouseXold = this.mouseX;
      this.mouseYold = this.mouseY;
    };


    function RotaCamTarget(x, y) {
      camTarget.rotation.y += x;

      // console.log( camTarget.rotation);
      if (camTarget.rotation.z + y < scope.minY) {
        camTarget.rotation.z = scope.minY;
      } else if (camTarget.rotation.z + y > scope.maxY) {
        camTarget.rotation.z = scope.maxY;
      } else {
        //垂直旋转时旋转摄像机目标体
        camTarget.rotation.z += y;
      }
    }
    //在右键控制角色整体旋转时，把角色模型转到面向前面 
    function RotaPlayer() {
      if (moveForward || moveLeft || moveRight || moveBackward) {
        return;
      }
      if (contrlState != CONTRLSTATE.MOUSE) {
        if (_player != null) {
          //如果在受键盘或摇杆控制，则不受右键旋转
          if (inKeyboardOrJoystick) { return; }

          // _playerY = pai / 2;
          // _player.rotation.set(0, _playerY, 0);


          StopMovingTween();
        }
      } else {
      }
      return;
    }

    // 强制横屏
    var forcedLandscape = false;
    this.SetforcedLandscape = function (b) {
      forcedLandscape = b;
      // console.log("设置强制横屏 ",b);
    }

    var rotaDirection = 1;
    var rotaDirectionX = 1;
    // 设置水平旋转方向，1 或 -1
    this.SetRotaDirection = function (d) {
      rotaDirection = d;
    }

    function RotaBase_leftMouse(x, y) {

      if (forcedLandscape) {
        let xx = x;
        x = -y * 4;
        y = xx;
      }



      if (canDampingRota) {
        // 滑动阻尼  
        if ((lerpXY.x > 0 && x < 0) || (lerpXY.x < 0 && x > 0)) { lerpXY.x = 0; }
        if ((lerpXY.y > 0 && y < 0) || (lerpXY.y < 0 && y > 0)) { lerpXY.y = 0; }
        lerpXY.x += x;
        lerpXY.y += y;
      } else {

        // console.log(" 旋转 " + viewStateEnum);
        if (viewStateEnum == "鸟瞰") {
          niaokanPosParent.rotation.y -= x;
          return;
        }


        //鼠标右键控制旋转
        //水平旋转时旋转控制主体parent
        camBaseParent.rotation.y -= x * rotaDirection;

        if (camBaseParentRef != null) {
          camBaseParentRef.rotation.y -= x * rotaDirection;
        }


        // console.log("_YJAmmoPlayer.rotation.y = ", _YJAmmoPlayer.rotation.y);

        y *= rotaDirection;

        if (camTarget.rotation.z + y < scope.minY) {
          camTarget.rotation.z = scope.minY;
        } else if (camTarget.rotation.z + y > scope.maxY) {
          camTarget.rotation.z = scope.maxY;
        } else {
          //垂直旋转时旋转摄像机目标体
          camTarget.rotation.z += y;
        }
      }

    }

    // 旋转视角时是否使用阻尼
    let canDampingRota = false;
    let lerpXY = new THREE.Vector2(0, 0);

    // 移动端的值
    // let lerpXY_scale = 0.2;
    // let lerpXY_moderate = 0.01;

    // pc端的值
    let lerpXY_scale = 0.05;
    let lerpXY_moderate = 0.03;

    let dampingCurrentV3 = new THREE.Vector2(0, 0);
    // 滑动阻尼 
    function LerpRotaBase_leftMouse() {

      if (lerpXY.x == 0 && lerpXY.y == 0) { return; }

      dampingCurrentV3.x = lerpXY.x * rotaDirection * lerpXY_scale;
      dampingCurrentV3.y = lerpXY.y * rotaDirection * lerpXY_scale;

      // console.log(" 插值旋转 ", dampingCurrentV3, lerpXY);
      if (viewStateEnum == "鸟瞰") {
        niaokanPosParent.rotation.y -= dampingCurrentV3.x;
      } else {
        //鼠标右键控制旋转
        //水平旋转时旋转控制主体parent
        camBaseParent.rotation.y -= dampingCurrentV3.x;

        if (camTarget.rotation.z + dampingCurrentV3.y < scope.minY) {
          camTarget.rotation.z = scope.minY;
        } else if (camTarget.rotation.z + dampingCurrentV3.y > scope.maxY) {
          camTarget.rotation.z = scope.maxY;
        } else {
          //垂直旋转时旋转摄像机目标体
          camTarget.rotation.z += dampingCurrentV3.y;
        }
      }

      if (lerpXY.x < 0) {
        lerpXY.x += lerpXY_moderate;
        if (lerpXY.x >= 0) {
          lerpXY.x = 0;
        }
      } else if (lerpXY.x > 0) {
        lerpXY.x -= lerpXY_moderate;
        if (lerpXY.x <= 0) {
          lerpXY.x = 0;
        }
      }

      if (lerpXY.y < 0) {
        lerpXY.y += lerpXY_moderate;
        if (lerpXY.y >= 0) {
          lerpXY.y = 0;
        }
      } else if (lerpXY.y > 0) {
        lerpXY.y -= lerpXY_moderate;
        if (lerpXY.y <= 0) {
          lerpXY.y = 0;
        }
      }

    }


    this.SetCamTargetRotaZ = function (f) {
      camTarget.rotation.z += f;
      console.log("in set targetRota 3333 = ", posToString(camTarget.rotation));
    }


    this.ResetCamTarget = function () {
      camTarget.rotation.set(0, 0, 0);
      camera.rotation.set(0, 0, 0);
    }

    this.RotaCameraQuat = function (q0) {
      camTarget.quaternion.rotateTowards(q0, 10);
    }
    this.RotaCamera = function (x, y) {


      _YJAmmoPlayer.rotation.y = x;

      if (camBaseParentRef != null) {
        camBaseParentRef.rotation.y = x;
      }


      camTarget.rotation.z = y;
      camTarget.rotation.y = x;

      // RotaBase(x,y);
    }


    //鼠标左键或右键拖动控制左右旋转， 视角上下旋转
    function RotaBase(x, y) {

      if (forcedLandscape) {
        let xx = x;
        x = -y * 4;
        y = xx;
      }

      // console.log(" 旋转 " + viewStateEnum);
      if (viewStateEnum == "鸟瞰") {
        niaokanPosParent.rotation.y -= x;
        return;
      }

      // RotaYJAmmoToCameraForward();


      //垂直旋转时旋转摄像机目标体
      // camTarget.rotation.z += y;
      // console.log(camTarget.rotation.z);
      // return;
      //鼠标右键控制旋转
      //水平旋转时旋转控制主体parent
      // playerParent.rotation.y -= x * this.rotateSpeed;

      _YJAmmoPlayer.rotation.y -= x * rotaDirection * rotaDirectionX;

      if (camBaseParentRef != null) {
        camBaseParentRef.rotation.y -= x * rotaDirection * rotaDirectionX;
      }


      // console.log("_YJAmmoPlayer.rotation.y = ", _YJAmmoPlayer.rotation.y);

      y *= rotaDirection;

      // console.log("水平旋转"+_YJAmmoPlayer.rotation.y );
      if (camTarget.rotation.z + y < scope.minY) {
        camTarget.rotation.z = scope.minY;
      } else if (camTarget.rotation.z + y > scope.maxY) {
        camTarget.rotation.z = scope.maxY;
      } else {
        //垂直旋转时旋转摄像机目标体
        camTarget.rotation.z += y;
      }

    }



    this.mouseDragOn = false;

    ///YJ
    var effectiveFinger = 0;
    var doonce_touch = 0;
    this.onTouchStart = function (event) {
      if (scope.enabled === false) return;

      //return;
      //event.preventDefault();
      if (this.domElement !== document) {

        this.domElement.focus();

      }

      event.preventDefault();
      event.stopPropagation();

      this.mouseDragOn = true;

      if (doonce_touch > 0) {
        return;
      }

      var touches = event.touches;
      if (touches.length > 1) {
        effectiveFinger = 1;
      } else {
        effectiveFinger = 0;
      }
      doonce_touch++;

    };

    this.onTouchEnd = function (event) {
      if (scope.enabled === false) return;

      //return;
      // console.log("松开");
      // event.preventDefault();
      // event.stopPropagation();
      this.mouseDragOn = false;

      this.lookSpeed = 0;
      doonce = 0;
      effectiveFinger = 0;
      if (doonce_touch > 0) {
        doonce_touch = 0;
      }
    };

    var oldPageX = 0;
    var oldPageY = 0;

    var newPageX = 0;
    var newPageY = 0;
    var doonce = 0;
    var moveForward = true;
    var moveLeft = false;
    var moveBackward = false;
    var moveRight = false;
    var moveUp = false;
    var moveDown = false;
    var inRun = false;
    var inKeybordShift = false;

    let touchX, touchY;

    var mobileRotaSpeed = 0.001;
    this.onTouchMove = function (event) {
      if (scope.enabled === false) return;

      if (setting.rightJoystick != undefined && setting.rightJoystick) {
        return;
      }
      // console.log(" onTouchMove onTouchMove ");
      var eventName = event.target.localName;
      if (eventName == 'button' || eventName == 'div' || eventName == 'input') {
        return;
      }
      var eventID = event.target.id;
      if (eventID.indexOf('left') > -1 || eventID.indexOf('right') > -1) {
        return;
      }

      //return;
      if (this.mouseDragOn) {

        var touches = event.touches;

        var touch = touches[touches.length > 1 ? effectiveFinger : 0];


        touchX = touch.clientX;
        touchY = touch.clientY;

        if (touches.length > 1) {
          if (forcedLandscape) {
            if (touchY < window.innerHeight / 2) {
              effectiveFinger = effectiveFinger == 1 ? 0 : 1;
              return;
            }
          } else {
            if (touchX < window.innerWidth / 2) {
              effectiveFinger = effectiveFinger == 1 ? 0 : 1;
              return;
            }
          }
        } else {
          effectiveFinger = 0;
          touch = event.touches[0];
        }

        if (doonce < 1) {

          oldPageX = touch.pageX;
          oldPageY = touch.pageY;
          doonce = doonce + 1;
        }

        //console.log(" in onMouseMove " + event.pageX+"  "+ oldPageX +"  "+(oldPageX == event.pageX && oldPageY == event.pageY) + " ");

        if (oldPageX == touch.pageX && oldPageY == touch.pageY) {

        } else {
          this.lookSpeed = 0.1;
        }

        let x = (touch.pageX - oldPageX) * mobileRotaSpeed * this.rotateSpeed;
        let y = -(touch.pageY - oldPageY) * mobileRotaSpeed * this.rotateSpeed;

        // console.log(" in touch move  " + this.mouseX + " " +  this.mouseY );


        if (leftMouseRotaView && !(moveForward || moveLeft || moveRight || moveBackward)) {
          RotaBase_leftMouse(x, y);
        } else {
          RotaBase(x, y);
          //如果在受键盘或摇杆控制，则不受右键旋转
          RotaPlayer();
        }

        oldPageX = touch.pageX;
        oldPageY = touch.pageY;

        newPageX = oldPageX;
        newPageY = oldPageY;


      } else {
        doonce = 0;
      }
    };

    this.onKeyDown = function (event) {
      if (scope.enabled === false) return;
      if (!canMoving) { return; }

      if (!CheckCanMoving()) {
        return;
      }
      // console.log("event.code = " + event.code );
      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW': moveForward = true; break;

        case 'ArrowLeft':
        case 'KeyA': moveLeft = true; break;

        case 'ArrowDown':
        case 'KeyS': moveBackward = true; break;

        case 'ArrowRight':
        case 'KeyD': moveRight = true; break;

        case 'KeyE': moveUp = true; break;
        case 'KeyQ': moveDown = true; break;
        case 'KeyR': moveDown = true; break;
        case 'ShiftLeft':
          inRun = true;
          inKeybordShift = true;
          console.log(" in shift ", inRun);
          break;

        case 'Space':
          //阻止浏览器空格翻页事件
          event.preventDefault();
          event.stopPropagation();
          if (setting.keySpace != undefined && !setting.keySpace) { return; }

          this.ClickJump();

          if (setting.canEnableGravity != undefined && !setting.canEnableGravity) { return; }
          moveUp = true;
          break;

      }

      if (_YJAmmo == undefined) { return; }

      _YJAmmo.onKeyDown(event);

    };

    // 视角状态. 0 最近， 1 wheelCurrentValue
    let viewState = 0;
    this.onKeyUp = function (event) {
      if (scope.enabled === false) return;
      if (!canMoving) { return; }

      if (!CheckCanMoving()) {
        return;
      }

      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW': moveForward = false; break;

        case 'ArrowLeft':
        case 'KeyA': moveLeft = false; break;

        case 'ArrowDown':
        case 'KeyS': moveBackward = false; break;

        case 'ArrowRight':
        case 'KeyD': moveRight = false; break;

        case 'KeyE': moveUp = false; break;
        case 'KeyQ': moveDown = false; break;
        case 'KeyR': moveDown = false; break;
        case 'KeyC':
          if (!setting.keyC) { return; }
          //  切换控制模式
          ChangeCtrlStateCall();
          break;
        case 'KeyG':
          if (!setting.canEnableGravity) { return; }
          try {
            //  切换控制模式
            _YJAmmo.ToggleGravityActive();
          } catch (error) {
            // console.log(error);
          }

          break;
        case 'KeyQ':
          if (!setting.keyQ) { return; }
          //视角切换 
          ChangeCameraFarFn();
          break;

        case 'ShiftLeft':
          inRun = false;
          inKeybordShift = false;
          break;
        case 'Space':
          moveUp = false;
          break;
      }
      if (_YJAmmo == undefined) { return; }



      _YJAmmo.onKeyUp(event);

    };


    //#endregion

    //#region 
    //#endregion



    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;


    //跳跃
    var canJump = true;
    var jump = false;

    this.ClickJump = function () {
      // console.log("点击空格键 ",jump);
      if (jump) { return; }
      if (canJump === true) {
        let event = {};
        event.code = "Space";
        Jump();
        if (_YJAmmo == undefined) { return; }
        _YJAmmo.onKeyDown(event);
      }
    }


    function CheckFly() {
      if (_YJAmmo == undefined) { return; }
      if (moveUp) {
        _YJAmmo.SetJumpFly();
      }
      if (moveDown) {
        _YJAmmo.SetJumpFlyDown();
      }
    }

    //#endregion




    var b_lerpChangeView = false; //是否开始平滑过渡
    var camTargetPos = new THREE.Vector3();  //摄像机切换的目标坐标
    var camTargetRota = new THREE.Vector3();  //摄像机切换的目标坐标
    var camTargetCamZ = new THREE.Vector3();  //平滑过渡时使用的变量
    var lerpLength = 0;  //平滑过渡值，取值范围 0 - 1
    var currentTargetPos = new THREE.Vector3();  //平滑过渡时使用的变量
    var currentTargetRota = new THREE.Vector3();  //平滑过渡时使用的变量
    var currentCam = new THREE.Vector3();  //摄像机的偏移位置


    var isMoving = false;

    var movingTween = null;
    var rotaTween = null;
    var tagetRotaTween = null;
    const rotationMatrix = new THREE.Matrix4();
    const targetQuaternion = new THREE.Quaternion();
    //移动到目标位置
    this.MoveToTarget = (v3) => {

      currentTargetPos.x = playerParent.position.x;
      currentTargetPos.y = playerParent.position.y;
      currentTargetPos.z = playerParent.position.z;

      camTargetPos = v3;
      camTargetPos.y = currentTargetPos.y;
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

    //#region 外部调用函数

    var joystickSpeed = 1;
    // 摇杆持续操作计时
    let joystickMoveTime = 0;
    var laterStopJoystick = null;
    // 右摇杆控制旋转
    this.RotaByJoystickAxis = function (x, y) {
      if (_YJAmmo == undefined) { return; }
      // 如果未启用操作监听，则同时不受摇杆控制
      if (!addEventListenered) { return; }

      // console.log("in 右摇杆控制旋转");
      RotaBase(x * 0.03, -y * 0.03);
      RotaPlayer();

    }

    let joystickMoveTimeLater = null;
    //摇杆控制移动
    this.MoveByJoystickAxis = (x, y) => {
      // 如果未启用操作监听，则同时不受摇杆控制
      if (!addEventListenered) { return; }

      if (!canMoving) {
        return;
      }
      // if (inKeybordShift) { return; }


      if (laterStopJoystick != null) {
        clearTimeout(laterStopJoystick);
        laterStopJoystick = null;
      }

      // console.error(" 遥感 ", x, y);

      if (x == 0 && y == 0) {
        if (isMoving) {

          if (joystickMoveTimeLater != null) {
            clearTimeout(joystickMoveTimeLater);
            joystickMoveTimeLater = null;
          }

          MoveYJAmmo(0, 0, inRun);
          isMoving = false;
          moveForward = false;
          inKeyboardOrJoystick = false;
        }

        joystickMoveTime--;
        if (inRun) {
          if (joystickMoveTime < 80) {
            inRun = false;
            joystickMoveTime = 0;
          }
        }

        if (joystickMoveTime < 80) {
          joystickMoveTime = 0;
        }
        return;
      }

      if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) {
        joystickMoveTime++;

        if (joystickMoveTimeLater == null) {
          joystickMoveTimeLater = setTimeout(() => {
            inRun = true;
          }, 3000);
        }


        if (joystickMoveTime >= 100) {
          // inRun = true;
          joystickMoveTime = 100;
        }
      } else {
        if (inRun) {
          joystickMoveTime--;
          if (joystickMoveTime < 80) {
            if (joystickMoveTimeLater != null) {
              clearTimeout(joystickMoveTimeLater);
              joystickMoveTimeLater = null;
            }
            inRun = false;
            joystickMoveTime = 0;
          }
        }
      }


      inKeyboardOrJoystick = true;
      isMoving = true;
      moveForward = true;

      // if (y > 0) {
      //   _playerY = 2 * pai + (x - 1) * pai / 2;
      // } else {
      //   _playerY = 2 * pai - (x - 1) * pai / 2;
      // }
      // _player.rotation.set(0, _playerY, 0);


      playerMoveDirection.x = x;
      playerMoveDirection.y = y;


      laterStopJoystick = setTimeout(() => {
        isMoving = false;
        inKeyboardOrJoystick = false;
        moveForward = false;
        MoveYJAmmo(0, 0, false);

      }, 100);
      StopMovingTween();


      var moveX = -x * joystickSpeed;
      var moveY = -y * joystickSpeed;
      MoveYJAmmo(moveX, moveY, inRun);

    }

    //当在限定角度，且座位其他物体的子物体时，则不可移动。
    function CheckCanMoving() {
      return !(onlyRotaView && _YJAmmoPlayer.parent != scene);
    }
    function MoveYJAmmo(x, y, inRun) {
      if (_YJAmmo == undefined) { return; }

      //当在限定角度，且座位其他物体的子物体时，则不可移动。
      if (!CheckCanMoving()) {
        return;
      }
      _YJAmmo.MoveByJoystickAxis(x, y);
      _YJAmmo.SetShiftLeft(inRun);
      CancelOnlyRotaView();
    }

    //在坐下，并可以移动的情况下，移动时，取消只旋转视角的限制
    function CancelOnlyRotaView() {
      if (onlyRotaView) {
        if (_YJAmmoPlayer.parent == scene) {
          onlyRotaView = false;
          _YJAmmo.SetGravityActive(true);
          _YJAmmo.SetEnabled(true);
        }
      }
    }

    //停止点击地面移动的tween
    function StopMovingTween() {
      if (movingTween != null) {
        movingTween.stop();
        isMoving = false;
        movingTween = null;
      }
    }


    function makeRotationAxis(axis, angle) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var t = 1 - c;
      var x = axis.x, y = axis.y, z = axis.z;
      var tx = t * x, ty = t * y;
      this.set(
        tx * x + c, tx * y - s * z, tx * z + s * y, 0,
        tx * y + s * z, ty * y + c, ty * z - s * x, 0,
        tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
        0, 0, 0, 1
      );
      return this;
    }

    var _YJAmmoPlayer = null;
    var _YJAmmo = null;
    var ammoHeight = null;

    let camBaseParent;
    // 不作为子物体，使用跟随的方式
    let camBaseParentRef = null;
    //设置动力学控制器。 水平旋转的物体
    this.SetAmmoPlayer = function (player, height) {

      if (height) {
        ammoHeight = height;
        player.add(playerParent);
        playerParent.position.set(0, -height / 2, 0);
        playerParent.rotation.set(0, -3.14 / 2, 0);
      }

      _YJAmmoPlayer = player;

      // _YJAmmoPlayer.add(new THREE.AxesHelper(1)); // 场景添加坐标轴


      //角色初始角度
      _YJAmmoPlayer.rotation.y = 3.14;


      if (leftMouseRotaView) {



        camBaseParent = new THREE.Group();
        camBaseParent.name = "camBaseParent";
        _YJAmmoPlayer.add(camBaseParent);
        camBaseParent.position.set(0, 0, 0);
        camBaseParent.add(camTarget);
      } else {
        _YJAmmoPlayer.add(camTarget);
      }


      camTarget.rotation.set(0, 3.14, 0);
      camTarget.name = "camTarget";


      // setTimeout(() => {
      //   console.log(_YJAmmoPlayer);
      // }, 3000);
    }



    let playerHeight = 2;
    this.SetCamTargetHeight = function (height) {
      playerHeight = height;
      // console.log("角色高度为 " + playerHeight);
      // camTarget.position.set(0, playerHeight/2, 0);

    }


    this.SetAmmoPlayer2 = function () {
      _YJAmmoPlayer = playerParent;
      //角色初始角度
      _YJAmmoPlayer.rotation.y = 3.14;
    }

    this.GetAmmoPlayer = function () {
      return _YJAmmoPlayer;
    }
    this.GetCamParent = function () {
      return camBaseParent;
    }
    this.GetCamTarget = function () {
      return camTarget;
    }

    let camrotatemp = null;
    this.GetPlayerRota = function () {
      if (contrlState == 0) {

        let pos = camera.getWorldPosition(new THREE.Vector3());
        let pos2 = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());
        pos2.y = pos.y;
        if (camrotatemp == null) {
          camrotatemp = new THREE.Group();
          scene.add(camrotatemp);
        }
        let currentRota = camera.getWorldQuaternion(new THREE.Quaternion());
        camrotatemp.quaternion.rotateTowards(currentRota, 10)
        camrotatemp.position.copy(pos);
        camrotatemp.lookAt(pos2);
        return camrotatemp.rotation.y * 57.2957 * ((Math.abs(camrotatemp.rotation.x) > 0) ? 1 : -1) + ((Math.abs(camrotatemp.rotation.x) > 0) ? 0 : -180);
      } else {
        // return camBaseParent.rotation.y * 57.2957 * -1;
        return camera.rotation.z * 57.2957 * -1;
      }
    }
    // 设置角色的初始朝向。旋转Y轴值由unity中计算得出
    this.SetPlayerRota = function (rota) {


      _playerY = Math.PI / 2;
      _player.rotation.set(0, _playerY, 0);
      camBaseParent.rotation.set(0, 0, 0);

      if (rota) {
        _YJAmmoPlayer.rotation.set(0, rota.y + Math.PI, 0);
      } else {
        _YJAmmoPlayer.rotation.x = 0;
        _YJAmmoPlayer.rotation.z = 0;
      }

      let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
      camRotaRefGroup.quaternion.rotateTowards(lookatQuat, 10);

    }
    // 旋转是从threejs中获取到的值，所以直接设置
    this.SetPlayerRota3 = function (rota) {

      if (rota == undefined) { return; }

      _playerY = Math.PI / 2;
      if(_player){
        _player.rotation.set(0, _playerY, 0);
      }
      camBaseParent.rotation.set(0, 0, 0);
      _YJAmmoPlayer.rotation.set(rota.x, rota.y, rota.z);

      let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
      camRotaRefGroup.quaternion.rotateTowards(lookatQuat, 10);

    }


    // 设置相机父物体
    // 设置摄像机脱离角色控制时使用
    // 传值置空后可恢复角色控制视角
    this.SetCameraBaseParent = function (parent, offset) {
      if (parent == null) {
        _YJAmmoPlayer.add(camBaseParent);
        camBaseParent.position.set(0, 0, 0);
        camBaseParent.rotation.set(0, 0, 0);
      } else {
        parent.add(camBaseParent);
        camBaseParent.position.set(0, 0, 0);
        camBaseParent.rotation.set(0, 0, 0);
      }
    }

    this.SetPlayerQuaternion = function (quat) {
      _YJAmmoPlayer.quaternion.copy(quat);
      _playerY = Math.PI / 2;
      _player.rotation.set(0, _playerY, 0);
    }


    // 插值移动到指定位置。在第一人称控制中使用
    this.SetPlayerPosRotaLerp = function (data, callback) {

      if (rotaTween != null) { return; }

      let pos = data.pos;
      let rota = data.rota;
      let rotaV3 = data.rotaV3;

      let currentPos = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());
      pos.y = currentPos.y;
      _YJAmmo.SetGravityActive(false);

      let lerpLength = 2000;

      // 角色位置设置为目标位置
      movingTween = new TWEEN.Tween(currentPos).to(pos, lerpLength).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        _YJAmmo.SetPlayerPos(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        _YJAmmo.SetGravityActive(true);
        movingTween.stop();
      });


      // 创建临时group计算角色的朝向

      let temp = new THREE.Group();
      scene.add(temp);
      temp.position.set(pos.x, pos.y, pos.z);
      temp.rotation.set(rotaV3.x, rotaV3.y + Math.PI, rotaV3.z);
      temp.translateZ(2);
      let lookatPosEnd = temp.getWorldPosition(new THREE.Vector3());

      let temp2 = new THREE.Group();
      scene.add(temp2);
      temp2.position.set(currentPos.x, currentPos.y, currentPos.z);
      let currentRota = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
      temp2.quaternion.rotateTowards(currentRota, 10);

      temp2.translateZ(2);

      let lookatPosStart = temp2.getWorldPosition(new THREE.Vector3());


      // let axes = new THREE.AxesHelper(5); // 坐标轴
      // temp.add(axes); // 场景添加坐标轴

      rotaTween = new TWEEN.Tween(lookatPosStart).to(lookatPosEnd, lerpLength + 0).easing(TWEEN.Easing.Cubic.InOut);
      let updateRota = () => {
        _YJAmmoPlayer.lookAt(lookatPosStart.x, lookatPosStart.y, lookatPosStart.z);
      }



      // 角色的旋转实时设置为目标位旋转. 此方法有万向锁的问题，旋转会乱掉
      // let currentRota = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
      // rotaTween = new TWEEN.Tween(currentRota).to(rota, lerpLength + 0).easing(TWEEN.Easing.Cubic.InOut);
      // let updateRota = () => {
      //   _YJAmmoPlayer.quaternion.slerp(currentRota, 0.05);
      // }



      rotaTween.onUpdate(updateRota);
      rotaTween.start() // 启动动画
      rotaTween.onComplete(() => {
        _YJAmmoPlayer.quaternion.identity();
        rotaTween.stop();
        rotaTween = null;
        scene.remove(temp);
        scene.remove(temp2);
      });






      // 回正摄像机的上下角度
      let currentTargetRota = camTarget.rotation;
      let tatRota = new THREE.Vector3(0, - Math.PI / 2, 0);
      tagetRotaTween = new TWEEN.Tween(currentTargetRota).to(tatRota, lerpLength).easing(TWEEN.Easing.Cubic.InOut)
      let targetupdateRota = (e) => {
        camTarget.rotation.set(currentTargetRota.x, currentTargetRota.y, currentTargetRota.z);
      }
      tagetRotaTween.onUpdate(targetupdateRota);
      tagetRotaTween.start() // 启动动画
      tagetRotaTween.onComplete(() => {
        tagetRotaTween.stop();

        if (callback) {
          callback();
        }
      });

      return;

      pos.y = _YJAmmoPlayer.position.y;
      _YJAmmo.SetPlayerPos(new THREE.Vector3(pos.x, pos.y, pos.z));

      _YJAmmoPlayer.rotation.y = rotaV3.y + Math.PI;


      let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
      camRotaRefGroup.quaternion.rotateTowards(lookatQuat, 10);

      this.ChangeCtrlState(); //摆正视角
    }

    // 设置角色的朝向为 unity场景的Z轴朝向物体
    this.SetPlayerRota2 = function (rota) {

      _YJAmmoPlayer.quaternion.rotateTowards(rota, 10);

      var euler = new THREE.Euler();
      euler.setFromQuaternion(_YJAmmoPlayer.quaternion);

      console.log("euler = ", euler);

      if (euler.y < 0) {
        euler.y += -Math.PI / 4;
      }
      _YJAmmoPlayer.rotation.set(0, euler.y, 0);

      return;
      // _YJAmmoPlayer.rotation.y = euler.y ;

      let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
      camRotaRefGroup.quaternion.rotateTowards(lookatQuat, 10);
      return;

    }

    //物理模拟对象
    this.SetAmmoCtrl = function (YJAmmo) {
      _YJAmmo = YJAmmo;
    }
    //添加声音监听对象
    this.AddAudioListener = function (listener) {
      camTarget.add(listener);
      listener.rotation.y = 3.14;
    }
    //角色引用
    var _player = null;
    var _playerY = 0;
    //把第三人称角色，添加到摄像机目标中，即摄像机中心
    this.SetPlayerToCamTarget = (player) => {
      console.log(" 添加角色到控制器 ");
      _player = player;
      // playerParent.add(player);

      player.position.set(0, -0.0, 0);
      _playerY = pai / 2;
      _player.rotation.set(0, _playerY, 0);
    }



    let camBaseParentOffsetPos = new THREE.Vector3(0, 0, 0);
    let b_lerpFollow = false;
    function lerpFollow() {
      if (b_lerpFollow) {
        // 解决刚体抖动问题。把摄像机父物体放刚体外部
        let pos = camBaseParent.getWorldPosition(new THREE.Vector3());
        camBaseParentOffsetPos.lerp(pos, 0.5);
        camBaseParentRef.position.copy(camBaseParentOffsetPos.clone());
        // let playerQuat = camBaseParent.getWorldQuaternion(new THREE.Quaternion());
        // let e = new THREE.Euler();
        // e.setFromQuaternion(playerQuat);
        // camBaseParentRef.rotation.set(e.x, e.y, e.z);

      }
    }
    this.StopFollow = function () {
      scene.remove(camBaseParentRef);
      camBaseParentRef = null;
      b_lerpFollow = false;
      _YJAmmoPlayer.add(camBaseParent);

      camBaseParent.add(camTarget);

    }
    // 设置玩家相机到物体的子物体，让相机跟随该物体
    this.SetFollowParent = (parent) => {
      parent.add(camBaseParent);

      // 解决刚体抖动问题。把摄像机父物体放刚体外部
      if (camBaseParentRef == null) {
        camBaseParentRef = new THREE.Group();
        // parent.add(new THREE.AxesHelper(5));


        scene.add(camBaseParentRef);
        // camBaseParentRef.add(new THREE.AxesHelper(5));

        let pos = camBaseParent.getWorldPosition(new THREE.Vector3());
        camBaseParentOffsetPos.lerp(pos, 1);
        camBaseParentRef.position.copy(camBaseParentOffsetPos.clone());


        let playerQuat = parent.getWorldQuaternion(new THREE.Quaternion());
        let e = new THREE.Euler();
        e.setFromQuaternion(playerQuat);
        camBaseParentRef.rotation.set(0, e.y, 0);
        // camBaseParentRef.rotation.set(e.x, e.y, e.z);
        console.log(" camBaseParentRef.rotation = ", camBaseParentRef.rotation);
        // if (camBaseParentRef != null) {
        //   if (Math.abs(camBaseParentRef.rotation.x)-3.14 < 0.1) {
        //     rotaDirectionX = 1;
        //   } else {
        //     rotaDirectionX = -1;
        //   }  
        // }

      }


      camBaseParentRef.add(camTarget);

      b_lerpFollow = true;


    }

    this.SetPlayerGroup = (group) => {
      playerParent.add(group);
      group.position.set(0, 0.0, 0);
    }
    this.GetPlayerParent = () => {
      return playerParent;
    }
    this.GetPlayer = () => {
      return _player;
    }
    this.RemovePlayer = () => {
      console.log(" 删除本地角色 ");
      playerParent.remove(_player);
    }
    this.GetCameraWorldPos = function () {
      return getWorldPosition(camera);
    }
    this.GetPlayerWorldPos = function () {
      return getWorldPosition(_YJAmmoPlayer);
    }
    
    this.GetPlayerWorldPos2 = function () {
      let pos = _YJAmmo.GetPlayerPos();
      pos.y -= playerHeight / 2;
      return pos; 
    }
    this.GetCamTargetWorldDire = function () {
      return camTargetDirection.getWorldDirection(new THREE.Vector3());
    }

    //设置摄像机的视角距离
    this.SetCameraWheelPos = function (f) {
      wheelCurrentValue = f;
      currentCam.set(wheelCurrentValue, 0, 0);
      camera.position.set(wheelCurrentValue, 0, 0);
      Display((wheelCurrentValue != 0));
    }
    //#endregion

    //#region old

    let oldPlayerParentPos = new THREE.Vector3(0, 0, 0);
    let oldWheelValue;
    //设置模型回到上载具之前的位置
    this.SetToOldPos = () => {
      canMoving = true;
      SetPlayerParentPos(oldPlayerParentPos, oldWheelValue);
    }
    //设置角色到载具上
    this.SetToOtherPos = function (targetPos, camPosX) {

      // console.log(" in SetToOtherPos ");
      return;
      canMoving = false;

      // let pos = playerParent.position;
      let pos = _YJAmmoPlayer.position;
      oldPlayerParentPos.x = pos.x;
      oldPlayerParentPos.y = pos.y;
      oldPlayerParentPos.z = pos.z;

      // console.log("old PlayerParentPos = " , oldPlayerParentPos);
      oldWheelValue = camera.position.x;

      SetPlayerParentPos(targetPos, camPosX);
    }
    function SetPlayerParentPos(targetPos, camPosX) {

      // console.log(" in SetPlayerParentPos ");
      return;
      // playerParent.position.setFromMatrixPosition(targetPos);
      _YJAmmoPlayer.position.copy(targetPos);
      wheelCurrentValue = camPosX;
      currentCam.set(wheelCurrentValue, 0, 0);
      camera.position.set(wheelCurrentValue, 0, 0);

      // console.log("new PlayerParentPos = " , playerParent.position);
      // console.log("new PlayerParentPos = " , _YJAmmoPlayer.position);

    }

    //设置摄像机偏移高度
    this.SetTarget = (targetPos, camPosX) => {


      // console.log(" in SetTarget ");
      ChangeCtrl();


      return;
      currentTargetPos.x = targetPos.x;
      currentTargetPos.y = targetPos.y;
      currentTargetPos.z = targetPos.z;

      // camTargetPos = targetPos;
      camTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
      camTarget.add(camera);


      if (camPosX == null || camPosX == undefined) return;
      wheelCurrentValue = camPosX;
      currentCam.set(wheelCurrentValue, 0, 0);
      camera.position.set(wheelCurrentValue, 0, 0);


      let fromPos = getWorldPosition(camera);
      camTargetDirection.lookAt(fromPos.x, fromPos.y, fromPos.z);

      // camera.lookAt(0,0,0);

      // console.log("in yjcontroller   camPosx = " + camPosX  );
      // console.log("in yjcontroller   camPosx = " + camPosX + "  targetPos = " + 
      // posToString(targetPos)+ "this.wheelCurrentValue = " + this.wheelCurrentValue );
    }
    this.SetTargetHeight = (y) => {
      camOffsetY = y / 2;
      // camTarget.position.y = y;
      console.log(" 设置中心点高度 ", y);

    }



    this.SetCamPos = (pos) => {
      camera.position.set(wheelCurrentValue, 0, 0);

      camTarget.rotation.set(targetRota.x, targetRota.y, targetRota.z);
      // console.log(" in SetTargetRota 222 ", camTarget.rotation);

    }
    this.SetRootRota = (targetRota) => {
      playerParent.rotation.set(targetRota.x, targetRota.y, targetRota.z);
    }
    this.SetTargetRota = (targetRota) => {
      camTarget.rotation.set(targetRota.x, targetRota.y, targetRota.z);
      // console.log(" in SetTargetRota 111 ", camTarget.rotation);
    }
    this.SetTargetPos = (pos) => {
      console.log(" in SetTargetPos ", pos.y);

      camTarget.position.set(pos.x, pos.y, pos.z);
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
    //#endregion


    let b_lerplookat = false;
    let lerplookatLength = 0;
    let lookatQuat = new THREE.Quaternion();
    let lookatSpeed = 0.25;
    let b_lepCamRotaGroup = false;
    let lepCamRotaGroupLength = 0;

    // 摄像机base旋转的最大速度
    let camRotaGroupMaxSpeed = 0.02;
    // let camRotaGroupMaxSpeed = 0.04;
    // 角色朝向目标位置，同时摄像机参照物体向着角色朝向旋转
    function lerpLookat() {

      // 角色向着点击位置/目标位置旋转
      if (b_lerplookat) {
        lerplookatLength += lookatSpeed;
        lookatQuat = lookatRef.getWorldQuaternion(new THREE.Quaternion());
        _YJAmmoPlayer.quaternion.rotateTowards(lookatQuat, lerplookatLength);

        let currentQuat = _YJAmmoPlayer.quaternion;
        if (Math.abs(lookatQuat.z - currentQuat.z) < 0.01
          && Math.abs(lookatQuat.x - currentQuat.x) < 0.01
          && Math.abs(lookatQuat.y - currentQuat.y) < 0.01
          && Math.abs(lookatQuat.w - currentQuat.w) < 0.01
        ) {
          b_lerplookat = false;
          lerplookatLength = 0;
        }
      }

      // 摄像机参照物体，向着角色朝向旋转
      if (b_lepCamRotaGroup) {
        lepCamRotaGroupLength += 0.002;
        // 摄像机旋转的最大速度，调小防止晕眩
        if (lepCamRotaGroupLength >= camRotaGroupMaxSpeed) {
          lepCamRotaGroupLength = camRotaGroupMaxSpeed;
        }
        let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
        camRotaRefGroup.quaternion.rotateTowards(lookatQuat, lepCamRotaGroupLength);

        // console.log(" 旋转 摄像机 base ", lepCamRotaGroupLength);
        let currentQuat = camRotaRefGroup.quaternion;
        if (Math.abs(lookatQuat.z - currentQuat.z) < 0.01
          && Math.abs(lookatQuat.x - currentQuat.x) < 0.01
          && Math.abs(lookatQuat.y - currentQuat.y) < 0.01
          && Math.abs(lookatQuat.w - currentQuat.w) < 0.01
        ) {
          b_lepCamRotaGroup = false;
          lepCamRotaGroupLength = 0;
        }
      }
    }
    let camTargetRotaQuaternion = new THREE.Quaternion();

    /*
     * 点击界面上的 enter 按钮，由鸟瞰进去
    */
    this.SetChangeViewBegin = function () {
      // return;

      // 第一人称视角
      if (setting.firstPerson) {
        ChangeCtrl();
        return;
      }

      if (!setting.hasAerialView) {
        // 不需要鸟瞰时，把摄像机放到角色后面
        ChangeCtrl();
        return;


        let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
        camRotaRefGroup.quaternion.rotateTowards(lookatQuat, 10);
        currentCamrotaRefGroupPos = camRotaRefGroup.getWorldPosition(new THREE.Vector3());

        let pos = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());
        camRotaRefGroup.position.set(pos.x, pos.y, pos.z);
        let camTargetPos = camPosRefGroup.getWorldPosition(new THREE.Vector3());
        camera.position.set(camTargetPos.x, camTargetPos.y, camTargetPos.z);

        let playerpos = _YJAmmoPlayer.position.clone();
        playerpos.y += camOffsetY;
        camera.lookAt(playerpos);

        currentCamPos = camera.getWorldPosition(new THREE.Vector3());
        currentLookatPos.x = playerpos.x;
        currentLookatPos.y = playerpos.y;
        currentLookatPos.z = playerpos.z;
        // console.log(" 不需要鸟瞰时 ");

        return;
      }

      // 需要鸟瞰时，把摄像机放到鸟瞰位置
      let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
      camRotaRefGroup.quaternion.rotateTowards(lookatQuat, 10);
      currentCamrotaRefGroupPos = camRotaRefGroup.getWorldPosition(new THREE.Vector3());


      // console.log(" 鸟瞰开场 ",niaokanCamPos,niaokanCamLookatPos);
      console.log(" 鸟瞰开场 ");
      this.SetToNiaokanPos();

      camera.position.set(niaokanCamPos.x, niaokanCamPos.y, niaokanCamPos.z);
      camera.lookAt(niaokanCamLookatPos);

      currentCamPos = camera.getWorldPosition(new THREE.Vector3());
      currentLookatPos.x = niaokanCamLookatPos.x;
      currentLookatPos.y = niaokanCamLookatPos.y;
      currentLookatPos.z = niaokanCamLookatPos.z;

      currentCamPos.set(niaokanCamPos.x, niaokanCamPos.y, niaokanCamPos.z);

      inniaokanDoonce = true;
      setTimeout(() => {
        b_inNiaokan = false;
        ChangeNiaokanPersonView();
      }, 3000);
    }

    //#region 鸟瞰 人视角
    // 第一次执行鸟瞰的检测
    let inniaokanDoonce = false;
    let niaokanCallback;
    this.SetChangeViewCompleted = function (_niaokanCallback) {
      niaokanCallback = _niaokanCallback;
    }
    this.SetChangeViewBeginEnter = function () {


      if (!setting.hasAerialView) {
        if (niaokanCallback) {
          niaokanCallback();
        }
        return;
      }

      inniaokanDoonce = true;
      setTimeout(() => {
        b_lookat = true;
        b_lepCamRotaGroup = true;
      }, 1000);

      console.log("设置鸟瞰开场");

    }

    // 编辑小地图界面里面的设置鸟瞰坐标
    this.SetCamNiaokanPos = function (x, y, z, lx, ly, lz) {
      camera.position.set(x, y, z);
      currentCamPos = camera.getWorldPosition(new THREE.Vector3());
      camera.lookAt(lx, ly, lz);
      console.log(" 编辑小地图界面里面的设置鸟瞰坐标 ");
    }

    // 由页面按钮调用，点击鸟瞰小地图，lerp切换到鸟瞰视角
    this.ResetToNiaokanView = function () {
      // if (!setting.hasAerialView) {
      //   return;
      // }
      // console.log(" in ResetToNiaokanView 222 ");
      hasCamRaycast = false;
      b_inNiaokan = !b_inNiaokan;
      ChangeNiaokanPersonView();
    }

    this.ChangeToNiaokanView = function () {
      b_inNiaokan = true;
      ChangeNiaokanPersonView();
    }
    this.ChangeToPersonView = function () {
      b_inNiaokan = false;
      ChangeNiaokanPersonView();
    }
    function ChangeNiaokanPersonView() {
      if (b_inNiaokan) {

        // console.log(" 进入鸟瞰前，判断视角的远近距离。 ");
        // if(contrlState != CONTRLSTATE.MOUSE){
        //   if(camera.position.x==0){
        //     let camTargetPos = camTarget.position; 
        //     camPosRefGroup.position.set(0,camTargetPos.y,-1);
        //     console.log(" 近距离，设置近距离摄像机位置 ");
        //   }else{
        //     camPosRefGroup.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);
        //     console.log(" 远距离 ");
        //   }
        // }



        currentCamPos = camera.getWorldPosition(new THREE.Vector3());
        let playerpos = _YJAmmoPlayer.position.clone();
        playerpos.y += camOffsetY;
        currentLookatPos.x = playerpos.x;
        currentLookatPos.y = playerpos.y;
        currentLookatPos.z = playerpos.z;


        // 使用attach,可以不改变子物体的世界坐标
        scene.attach(camera);

        b_lerplookat = false;
        b_lerpMovePlayer = false;
        lerpToEnd = false;

        lerplookatLength = 0;
        leplookatviewLength = 0;

        lepToNiankanLength = 0;
        b_lepToNiaokan = true;
        b_lepToPerson = false;



      } else {

        currentCamPos = camera.getWorldPosition(new THREE.Vector3());
        scene.attach(camera);

        b_lookat = true;
        b_lepCamRotaGroup = true;

        b_lepToPerson = true;
        lerplookatLength = 0;
        leplookatviewLength = 0;
        lepToNiankanLength = 0;
        b_lepToNiaokan = false;
      }

      viewStateEnum = "中间";
      OnViewStateChangeFn(viewStateEnum);


    }

    let b_inNiaokan = false;
    let b_lepToNiaokan = false;
    let lepToNiankanLength = 0;

    let viewStateEnum = "鸟瞰"; //人视或鸟瞰
    // lerp切换到鸟瞰视角
    function ChangeToNiaokanView() {
      if (b_lepToNiaokan) {

        lepToNiankanLength += 0.01;
        currentCamPos.lerp(niaokanCamPos, lepToNiankanLength);
        camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);

        currentLookatPos.lerp(niaokanCamLookatPos, lepToNiankanLength);
        camera.lookAt(currentLookatPos);

        let distance = niaokanCamPos.distanceTo(currentCamPos);
        if (distance < 0.01
        ) {
          b_lepToNiaokan = false;
          lepToNiankanLength = 0;
          console.log("已移动 鸟瞰 位置");
          viewStateEnum = "鸟瞰";
          niaokanPosParent.attach(camera);
          OnViewStateChangeFn(viewStateEnum);

        }
        // console.log(" 转到鸟瞰位置 ", currentCamPos, niaokanCamPos, distance);

      }
    }

    this.SetToNiaokanPos = function () {
      viewStateEnum = "鸟瞰";
      niaokanPosParent.attach(camera);
      OnViewStateChangeFn(viewStateEnum);

      currentCamPos.lerp(niaokanCamPos, 1);
      camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);
      currentLookatPos.lerp(niaokanCamLookatPos, 1);
      camera.lookAt(currentLookatPos);
    }

    // 切换远近视角
    let b_lerpToChangeViewFar = false;
    function ChangeViewFar() {
      if (b_lerpToChangeViewFar) {
        // let camTargetPos = camPosRefGroup.getWorldPosition(new THREE.Vector3());
        let camTargetPos = camPosRefGroup.position.clone();
        lepToNiankanLength += 0.001;
        currentCamPos.lerp(camTargetPos, lepToNiankanLength);
        camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);

        let distance = currentCamPos.distanceTo(camTargetPos);
        if (distance < 0.01
        ) {
          b_lerpToChangeViewFar = false;
          lepToNiankanLength = 0;
          console.log(" 远近视角切换完成 ");
        }
      }
    }

    let b_lepToPerson = false;
    // 
    /* 
    lerp切换到人视角
    把摄像机的位置参考物体移动角色位置
    */
    function ChangeToPersonView() {
      if (b_lepToPerson) {

        let pos = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());

        currentCamrotaRefGroupPos.lerp(pos, leplookatviewLength * 3);
        camRotaRefGroup.position.set(currentCamrotaRefGroupPos.x, currentCamrotaRefGroupPos.y, currentCamrotaRefGroupPos.z);

        let camTargetPos = camPosRefGroup.getWorldPosition(new THREE.Vector3());

        lepToNiankanLength += 0.001;

        currentCamPos.lerp(camTargetPos, lepToNiankanLength);
        camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);


        let playerpos = _YJAmmoPlayer.position.clone();
        playerpos.y += camOffsetY;
        currentLookatPos.lerp(playerpos, lepToNiankanLength);
        camera.lookAt(currentLookatPos);


        let distance = currentCamPos.distanceTo(camTargetPos);
        if (distance < 0.01
        ) {
          b_lepToPerson = false;
          lepToNiankanLength = 0;

          if (contrlState != CONTRLSTATE.MOUSE) {
            if (niaokanCallback) {
              niaokanCallback();
            }
          }

          console.log("已移动到 人视 位置");
        }

        // console.log(" 正在lookat view ", leplookatviewLength);
      }
    }

    //#endregion

    var currentWheelValue = new THREE.Vector3();  //平滑过渡时使用的变量

    //平滑移动到目标视角
    function ChangeView() {
      if (b_lerpChangeView) {
        camTargetPos = _YJAmmoPlayer.position.clone();
        camTargetPos.y += camOffsetY;

        lerpLength += 0.001;

        currentTargetPos.lerp(camTargetPos, lerpLength);
        console.log(" in ChangeView ", currentTargetPos.y);

        camTarget.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);

        currentWheelValue.lerp(camTargetCamZ, lerpLength);
        camera.position.set(currentWheelValue.x, 0, 0);


        if (Math.abs(camTargetPos.z - currentTargetPos.z) < 0.01
          && Math.abs(camTargetPos.x - currentTargetPos.x) < 0.01
          && Math.abs(camTargetPos.y - currentTargetPos.y) < 0.01

          && Math.abs(currentWheelValue.x - camTargetCamZ.x) < 0.01

        ) {
          if (b_lerpMovePlayer == false) {

            b_lerpChangeView = false;
            lerpLength = 0;
          }

          // console.log("已移动到指定位置");
        }
      }
    }
    let b_lerpRotaView = false;

    // let rotaLength = 0.05;
    let rotaLength = 0.0;

    //视角旋转起始速度
    let rotaSpeed = 0.02;
    let rotaMinSpeed = 0.01;
    let rotaMaxSpeed = 0.02;
    let lerpToEnd = false;

    // 视角旋转
    function RotaView() {
      if (b_lerpRotaView) {

        // camTargetRota = _YJAmmo.GetRotaRefChild().getWorldDirection(new THREE.Vector3());
        // camTarget.rotation.set(camTargetRota.x,camTargetRota.y,camTargetRota.z);
        // let currentRota = camTarget.rotation;

        if (!lerpToEnd) {
          rotaLength += 0.0010; //越小初始速度越快
          if (rotaLength >= rotaMaxSpeed) {
            rotaLength = rotaMaxSpeed;
          }
        }
        // console.log("rotaLength = " + rotaLength + lerpToEnd);

        // let quat1 = targetGroup.getWorldDirection(new THREE.Vector3()).clone();
        let quat1 = _YJAmmo.GetRotaRefChild().getWorldDirection(new THREE.Vector3()).clone();
        let quat2 = camTarget.getWorldDirection(new THREE.Vector3()).clone();

        let qoffsetX = Math.abs(quat1.x - quat2.x);
        let qoffsetY = Math.abs(quat1.y - quat2.y);
        let qoffsetZ = Math.abs(quat1.z - quat2.z);
        // let allOffset = qoffsetX + qoffsetY + qoffsetZ;
        // if (allOffset < 0.7) {
        //   lerpToEnd = true;
        // }
        // console.log("偏移 " + allOffset);
        // rotaLength = 0.005;

        if (lerpToEnd) {

          rotaLength -= 0.00025;
          // rotaLength += 0.0001;

          if (rotaLength <= 0) {
            rotaLength = 0.001;
          }

        }


        // camTargetRotaQuaternion = targetGroup.getWorldQuaternion(new THREE.Quaternion());
        camTargetRotaQuaternion = _YJAmmo.GetRotaRefChild().getWorldQuaternion(new THREE.Quaternion());
        camTarget.quaternion.rotateTowards(camTargetRotaQuaternion, rotaLength);
        let currentQuat = camTarget.getWorldQuaternion(new THREE.Quaternion());

        let offsetX = Math.abs(camTargetRotaQuaternion.x - currentQuat.x);
        let offsetY = Math.abs(camTargetRotaQuaternion.y - currentQuat.y);
        let offsetZ = Math.abs(camTargetRotaQuaternion.z - currentQuat.z);
        let offsetW = Math.abs(camTargetRotaQuaternion.w - currentQuat.w);
        let allOffset = offsetX + offsetY + offsetZ + offsetW;

        // allOffset = Math.round(allOffset*100)/100; 
        allOffset = allOffset.toFixed(3);
        // console.log("偏移 " + allOffset);
        if (allOffset < 0.7) {
          if (rotaLength >= rotaMaxSpeed) {
            lerpToEnd = true;
          }
          // lerpToEnd = true;
        }
        // console.log("偏移 "
        //  +" offsetX = "+offsetX
        //  +" offsetY = "+offsetY
        //  +" offsetZ = "+offsetZ
        //  +" offsetW = "+offsetW
        //  );

        // console.log(camTargetRotaQuaternion);
        // console.log( currentQuat);
        // console.log( "rotaLength = " + rotaLength);

        if (
          offsetX < 0.01
          && offsetY < 0.01
          && offsetZ < 0.01
          && offsetW < 0.01

          // Math.abs(camTargetRota.z - currentRota.z) < 0.01
          // && Math.abs(camTargetRota.x - currentRota.x) < 0.01
          // && Math.abs(camTargetRota.y - currentRota.y) < 0.01 

        ) {
          // lerpToEnd = true;

          if (b_lerpChangeView == false) {

            b_lerpRotaView = false;
            lerpToEnd = false;
            // rotaLength = rotaSpeed;
            rotaLength = 0;
            return;
          }
        }

        // console.log("已移动到指定位置", rotaLength);

      }
    }


    function checkV3Equel(v1, v2) {
      return Math.abs(v1.z - v2.z) < 0.001
        || Math.abs(v1.x - v2.x) < 0.001
        || Math.abs(v1.y - v2.y) < 0.001;

      return Math.abs(v1.z - v2.z) < 0.01
        && Math.abs(v1.x - v2.x) < 0.01
        && Math.abs(v1.y - v2.y) < 0.01;
    }
    function checkQuatEquel(q1, q2) {
      return Math.abs(q1.z - q2.z) < 0.001
        && Math.abs(q1.x - q2.x) < 0.001
        && Math.abs(q1.w - q2.w) < 0.001
        && Math.abs(q1.y - q2.y) < 0.001;

      return Math.abs(q1.z - q2.z) < 0.01
        && Math.abs(q1.x - q2.x) < 0.01
        && Math.abs(q1.w - q2.w) < 0.01
        && Math.abs(q1.y - q2.y) < 0.01;
    }

    // 人视角情况下， 摄像机移动到目标位置，并且lookat目标位置 
    function LookatView() {
      if (b_lookat) {

        let pos = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());
        currentCamrotaRefGroupPos.lerp(pos, leplookatviewLength * 3);
        camRotaRefGroup.position.set(currentCamrotaRefGroupPos.x, currentCamrotaRefGroupPos.y, currentCamrotaRefGroupPos.z);

        leplookatviewLength += 0.001;

        // 只在点击地面移动模式限制
        if (contrlState == CONTRLSTATE.MOUSE) {
          // 旋转镜头的最高限速。越高镜头晃动越快，会感觉晕眩。0.05为测试后的最高速度，只可降低
          if (leplookatviewLength >= lookatSpeedMax) {
            leplookatviewLength = lookatSpeedMax;
          }
        }

        let camTargetPos = camPosRefGroup.getWorldPosition(new THREE.Vector3());
        currentCamPos.lerp(camTargetPos, leplookatviewLength);
        camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);

        let playerpos = _YJAmmoPlayer.position.clone();
        playerpos.y += camOffsetY;
        currentLookatPos.lerp(playerpos, leplookatviewLength);
        camera.lookAt(currentLookatPos);

        let distance = currentCamPos.distanceTo(camTargetPos);
        // console.log(" in 摄像机移动到目标位置，并且lookat目标位置  ",distance);

        if (checkV3Equel(currentCamPos, camTargetPos) && !b_lepCamRotaGroup) {
          b_lookat = false;
          leplookatviewLength = 0;
          // console.log("摄像机已移动到指定位置");
          if (inniaokanDoonce) {
            if (contrlState != CONTRLSTATE.MOUSE) {
              console.log("鸟瞰拉近完成！");
              inniaokanDoonce = false;
              if (niaokanCallback) {
                niaokanCallback();
              }
            }
          }
          // console.log("已移动到指定位置");
        }
      }
    }


    //#region 
    //#endregion

    //#region 相机脱离控制，独立设置摄像机位置和lookat位置。做第三视角看角色与物体交互

    let onlyMove_camPos = new THREE.Vector3();
    let onlyMove_camRota = new THREE.Quaternion();
    let onlyMove_callback = null;
    let onlyMove_reTobefor_callback = null;

    let onlyMove_beforecamPos = new THREE.Vector3();
    let onlyMove_beforecamRota = new THREE.Quaternion();
    let onlyMove_camParent = null;
    this.ResetToBeforeOnlyMove = function (callback) {

      onlyMove_reTobefor_callback = callback;

      onlyMove_camPos = onlyMove_beforecamPos.clone();

      onlyMove_camRota = onlyMove_beforecamRota.clone();

      // onlyMove_camParent.attach(camera);

      b_onlyMoveCamera = true;

    }


    this.DirectToBeforePos = function () {
      onlyMove_camParent.attach(camera);
      onlyMove_camPos = onlyMove_beforecamPos.clone();
      onlyMove_camRota = onlyMove_beforecamRota.clone();
      camera.position.set(onlyMove_camPos.x, onlyMove_camPos.y, onlyMove_camPos.z);
      camera.quaternion.rotateTowards(onlyMove_camRota, 10);

    }

    // 直接打断停止镜头推进
    this.ClearOnlyMoveCamera = function () {
      if (onlyMove_callback) {
        onlyMove_callback = null;
      }
      if (onlyMoveCameraTween) {
        onlyMoveCameraTween.stop();
      }
    }

    let onlyMoveCameraTween = null;

    //设置相机坐标和相机lookat坐标，
    this.SetCamPosAndRota = (data, callback, duration) => {
      // if(b_onlyMoveCamera){return;}
      let camPos = data.pos;
      onlyMove_camRota = data.rota;
      console.log(" 设置相机观察位 ", data);

      onlyMove_camPos.set(camPos.x, camPos.y, camPos.z);


      onlyMove_callback = callback;

      onlyMove_beforecamPos = camera.getWorldPosition(new THREE.Vector3());
      onlyMove_beforecamRota = camera.getWorldQuaternion(new THREE.Quaternion());

      onlyMove_camParent = camera.parent;

      scene.attach(camera);


      if (duration == undefined) {
        duration = 1000;
      }

      currentCamPos = camera.getWorldPosition(new THREE.Vector3());

      // b_onlyMoveCamera = true;

      lep_onlyMoveCamera = 0;
      onlyMoveCameraTween = new TWEEN.Tween(currentCamPos).to(onlyMove_camPos, duration).easing(TWEEN.Easing.Linear.None);
      // movingTween = new TWEEN.Tween(currentCamPos).to(onlyMove_camPos, 1000).easing(TWEEN.Easing.Cubic.InOut);
      let updateTargetPos = () => {
        // lep_onlyMoveCamera += 0.001;
        lep_onlyMoveCamera += 0.005;
        camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);
        camera.quaternion.rotateTowards(onlyMove_camRota, lep_onlyMoveCamera / 4);
      }
      onlyMoveCameraTween.onUpdate(updateTargetPos);
      onlyMoveCameraTween.start() // 启动动画
      onlyMoveCameraTween.onComplete(() => {
        //转到目标位完成
        if (onlyMove_callback) {
          onlyMove_callback();
          onlyMove_callback = null;
        } else {
          // onlyMove_camParent.attach(camera);
          // ChangeCtrl();
        }
      });



      // console.log("in yjcontroller targetRota = "+posToString(camTarget.rotation));
    }
    let b_onlyMoveCamera = false;
    let lep_onlyMoveCamera = 0;
    function OnlyMoveCamera() {

      if (b_onlyMoveCamera) {
        lep_onlyMoveCamera += 0.005;
        currentCamPos.lerp(onlyMove_camPos, lep_onlyMoveCamera);

        camera.position.set(currentCamPos.x, currentCamPos.y, currentCamPos.z);

        camera.quaternion.rotateTowards(onlyMove_camRota, lep_onlyMoveCamera / 4);


        if (checkV3Equel(currentCamPos, onlyMove_camPos) && checkQuatEquel(camera.quaternion, onlyMove_camRota)) {
          b_onlyMoveCamera = false;
          lep_onlyMoveCamera = 0;

          //转到目标位完成
          if (onlyMove_callback) {
            onlyMove_callback();
            onlyMove_callback = null;
          } else {
            onlyMove_camParent.attach(camera);

            if (onlyMove_reTobefor_callback) {
              onlyMove_reTobefor_callback();
              onlyMove_reTobefor_callback = null;
            }
            // ChangeCtrl();
          }
          // console.log(" onlyMove 已移动到指定位置");
        }
      }
    }

    //#endregion


    //#region 单品展示摄像机移动到指定位置和角度


    this.ResetSingleCtrl = function (data, callback) {

      if (rotaTween != null) { return; }

      // console.log(" 移动到目标点 data ", data);
      let pos = data.pos;
      let rota = data.rota;
      let rotaV3 = data.rotaV3;
      let offsetZ = 1;

      //相机的目标位置和目标旋转 


      scene.attach(camera);
      scene.attach(camTarget);



      //相机的目标位置和目标旋转
      let temp1 = new THREE.Group();
      scene.add(temp1);
      temp1.position.set(pos.x, pos.y, pos.z);
      temp1.quaternion.rotateTowards(rota, 10);
      temp1.translateZ(offsetZ);
      temp1.lookAt(pos);

      // let axes = new THREE.AxesHelper(100); // 场景坐标轴
      // temp1.add(axes); // 场景添加坐标轴


      //计算 camTarget 应处在的 坐标和角度

      camTarget.position.set(pos.x, pos.y, pos.z);
      camTarget.quaternion.rotateTowards(rota, 10);
      camTarget.translateZ(1);
      camTarget.lookAt(pos);
      camTarget.translateZ(1);
      camTarget.rotateY(-Math.PI / 2);

      // _YJAmmo.SetPlayerPos(new THREE.Vector3(pos.x, 0, pos.z));
      let temp3 = new THREE.Group();
      scene.add(temp3);
      temp3.position.set(pos.x, pos.y, pos.z);
      temp3.quaternion.rotateTowards(rota, 10);
      temp3.translateZ(-1);
      temp3.position.y = 0;
      _YJAmmoPlayer.position.set(pos.x, 0, pos.z);
      _YJAmmoPlayer.lookAt(temp3.position);

      _YJAmmoPlayer.rotation.x = 0;
      _YJAmmoPlayer.rotation.z = 0;

      _YJAmmoPlayer.attach(camTarget);


      let currentPos = camera.getWorldPosition(new THREE.Vector3());
      let camPosEnd = temp1.getWorldPosition(new THREE.Vector3());

      // console.log("起始结束 " ,currentPos,camPosEnd);
      let lerpLength = 2000;

      // return;
      // camera lookat 的目标点，并移动此目标点 
      movingTween = new TWEEN.Tween(currentPos).to(camPosEnd, lerpLength).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = (e) => {
        camera.position.set(currentPos.x, currentPos.y, currentPos.z);
        // console.log("设置目标位置",currentPos);
      }

      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {

        rotaTween.stop();
        rotaTween = null;
        scene.remove(temp1);
        scene.remove(temp2);
        scene.remove(temp3);

        camTarget.attach(camera);
        wheelCurrentValue = -offsetZ;


        if (callback) {
          callback();
        }
      });

      // 创建临时group计算角色的朝向

      let camPos = camera.getWorldPosition(new THREE.Vector3()).clone();
      let camRota = camera.getWorldQuaternion(new THREE.Quaternion()).clone();

      let temp2 = new THREE.Group();
      scene.add(temp2);
      temp2.position.set(camPos.x, camPos.y, camPos.z);
      temp2.quaternion.rotateTowards(camRota, 10);
      temp2.translateZ(wheelCurrentValue);
      let lookatPosStart = temp2.getWorldPosition(new THREE.Vector3()).clone();
      // camera lookat 的目标点，并移动此目标点 
      rotaTween = new TWEEN.Tween(lookatPosStart).to(pos, lerpLength).easing(TWEEN.Easing.Linear.None);
      let updateRota = (e) => {
        camera.lookAt(e.x, e.y, e.z);
        // console.log(" 摄像机lookat 目标位置 ");
      }

      rotaTween.onUpdate(updateRota);
      rotaTween.start() // 启动动画
      rotaTween.onComplete(() => {


      });
    }

    //#endregion




    let playerTargetPos = new THREE.Vector3(0, 0, 0);
    let currentPlayerPos = new THREE.Vector3(0, 0, 0);
    let playerLookatPos = new THREE.Vector3(0, 0, 0);
    let currentplayerLookatPos = null;
    let doonceCam = 0;
    // 角色面向目标点，目标点为点击的地面位置
    this.lookAtPos = function (pos) {
      if (contrlState != CONTRLSTATE.MOUSE) {
        return;
      }

      playerTargetPos = pos.clone();
      pos.y = _YJAmmoPlayer.position.y;
      playerLookatPos = pos;
      if (currentplayerLookatPos == null) {
        currentplayerLookatPos = playerLookatPos.clone();
      }
      lookatRef.position.copy(_YJAmmoPlayer.position);
      lookatRef.lookAt(playerLookatPos);


      // 取消转到鸟瞰视角
      b_lepToNiaokan = false;
      b_lerplookat = true;
      b_lerpMovePlayer = true;
      lerpToEnd = false;
      b_lookat = true;
      b_lepCamRotaGroup = true;

      lerplookatLength = 0;

    }

    //键鼠控制模式下的寻路
    this.lookAtPosInMouseState = function (pos) {


      playerTargetPos = pos.clone();
      pos.y = _YJAmmoPlayer.position.y;
      playerLookatPos = pos;
      if (currentplayerLookatPos == null) {
        currentplayerLookatPos = playerLookatPos.clone();
      }
      lookatRef.position.copy(_YJAmmoPlayer.position);
      lookatRef.lookAt(playerLookatPos);


      // let lookatQuat = lookatRef.getWorldQuaternion(new THREE.Quaternion());
      // _YJAmmoPlayer.quaternion.rotateTowards(lookatQuat, 10);


      b_lerpMovePlayer = true;

      // b_lerplookat = true;
      // lerplookatLength = 0;



    }

    let rotaProcess = new THREE.Vector3(0, 0, 0);
    let rotaLengthOne = new THREE.Vector3(1, 0, 0);
    function RotaViewTween() {


      //移动到目标位置。在移动前判断角色和目标位置之间是否有障碍物
      // var distance = currentTargetPos.distanceTo(camTargetPos);
      if (movingTween != null) {
        movingTween.stop();
      }


      let currentQuat = camTarget.getWorldQuaternion(new THREE.Quaternion());
      rotaProcess.x = 0;
      movingTween = new TWEEN.Tween(rotaProcess).to(rotaLengthOne, 10000).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        camTargetRotaQuaternion = _YJAmmo.GetRotaRefChild().getWorldQuaternion(new THREE.Quaternion());
        camTarget.quaternion.rotateTowards(camTargetRotaQuaternion, rotaProcess.x);
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        isMoving = false;
      });

    }

    let b_lerpMovePlayer = false;
    let oldDistance = 0;
    let offsetTime = 0;
    let animWeight = 0;
    function SetWalkWeight(f) {
      animWeight = f;
      _YJPlayer.SetWalkWeight(animWeight);
    }
    function LerpMovePlayer() {
      if (b_lerpMovePlayer) {


        // if (_YJAmmo == undefined) { return; }
        _YJAmmo.SetMoveForward(true);
        _YJAmmo.MoveBegin();
        moveForward = true;

        currentPlayerPos = getWorldPosition(_YJAmmoPlayer);

        let pos1 = currentPlayerPos.clone();
        let pos2 = playerTargetPos.clone();
        pos1.y = pos2.y = 0;
        let distance = pos1.distanceTo(pos2);


        let pos = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());
        camRotaRefGroup.position.set(pos.x, pos.y, pos.z);
        // let distance = currentPlayerPos.distanceTo(playerTargetPos);
        // console.log(distance);
        // -------
        offsetTime++;
        if (offsetTime >= 30) {
          if (Math.abs(distance - oldDistance) < 0.01) {
            // 没有移动，说明碰到了障碍物，则不再移动
            moveForward = false;
            _YJAmmo.SetMoveForward(false);
            b_lerpMovePlayer = false;
            SetWalkWeight(0);
            return;
          }
          offsetTime = 0;
        }
        // ----------
        // 距离目标位置2米时开始减速
        if (distance < 2) {
          _YJAmmo.MoveEnd();
        }
        // 由移动速度来控制 行走动作的权重
        SetWalkWeight(_YJAmmo.GetMoveSpeed());
        // console.log(distance);
        if (distance < 0.5
        ) {
          moveForward = false;
          _YJAmmo.SetMoveForward(false);
          b_lerpMovePlayer = false;
          SetWalkWeight(0);

          // console.log("已移动到指定位置");
        } else {

          playerLookatPos.y = _YJAmmoPlayer.position.y;

          if (!b_lerplookat) {
            _YJAmmoPlayer.lookAt(playerLookatPos);
          }

        }

        oldDistance = distance;

      }
    }

    //是否在地面。跳起后，实时检测是否已碰到地面，碰到地面时，不允许下降
    var _YJPlayer = null;
    var _YJPlayerFireCtrl = null;
    this.SetPlayer = (yjplayer) => {
      _YJPlayer = yjplayer;
      _YJPlayer.owner = scope;
      if (_YJPlayerFireCtrl == null) {
        _YJPlayerFireCtrl = new YJPlayerFireCtrl(_this, _YJPlayer);
      }
    }
    this.GetYJPlayer = () => {
      return _YJPlayer;
    }

    this.GetCam = () => {
      return camera;
    }
    this.CancelMoving = function () {
      moveForward = false;
      moveBackward = false;
      moveLeft = false;
      moveRight = false;
      _YJAmmo.CancelMoving();
    }
    var animName = "idle";


    function Jump() {
      if (!canMoving || jump) { return; }

      CancelOnlyRotaView();

      jump = true;
      scope.SetPlayerState("跳跃");
      userData.onlySetAnim = false;

      // setTimeout(() => {
      //   animName = "floating";
      // }, 1000);
      // if (playerState != PLAYERSTATE.NORMAL) {
      //   playerState = PLAYERSTATE.NORMAL;
      // }
    }
    this.setJumpToFalse = () => {
      if (jump) {
        jump = false;
        if (_YJPlayer) {
          _YJPlayer.SetFlyMountDisplay(false);
        }
        scope.SetPlayerState("取消跳跃");
        if (playerState != PLAYERSTATE.NORMAL) {
          playerState = PLAYERSTATE.NORMAL;
        }
        // console.error("取消跳跃动作");
        return;
      }
    }
    this.SetFlyMountDisplay = (b) => {
      if (_YJAmmo == undefined || _YJAmmo == null) { return; }
      if (_YJAmmo.GetGravityActive()) { return; }
      if (_YJPlayer) {
        _YJPlayer.SetFlyMountDisplay(b);
      }
    }
    //#region 
    //#endregion


    //#region 检测角色与摄像机之间的是否有碰撞物体，让角色与摄像机之间始终无遮挡

    let transparentMat = null;
    let hitIndex = 0;
    let old_castArray = [];
    function GetInvaildCastObj(intersects_collider) {

      if (setting.camRaycastMode == undefined || setting.camRaycastMode == "near") {
        for (let i = 0; i < intersects_collider.length; i++) {
          let hit_collider = intersects_collider[i].object;
          if (
            hit_collider.parent.name == "player" ||
            hit_collider.name.indexOf("air") > -1 ||
            hit_collider.name.indexOf("trigger") > -1 ||
            hit_collider.name.indexOf("point") > -1 ||
            hit_collider.name.indexOf("hit") > -1 ||
            (hit_collider.tag != undefined && hit_collider.tag.indexOf("particle") > -1) ||
            (hit_collider.tag != undefined && hit_collider.tag.indexOf("player") > -1) || 
            (hit_collider.tag != undefined && hit_collider.tag.indexOf("weapon") > -1) || 
            hit_collider.parent.name == "ignoreRaycast" ||
            (hit_collider.isLine != null && hit_collider.isLine == true) ||
            (hit_collider.parent.parent && hit_collider.parent.parent.isTransformControlsGizmo) ||
            (hit_collider.isTransformControlsPlane) ||
            hit_collider.name == "ignoreRaycast" ||
            hit_collider.name.includes("navMesh") ||
            (hit_collider.transform != undefined && hit_collider.transform.isIgnoreRaycast)
          ) {
            // console.log("hit_collider = ", hit_collider);
            continue;
          }
          // console.log("hit_collider 22 = ", hit_collider);
          hitIndex = i;
          return hit_collider;
        }
        return null;
      }
      if (setting.camRaycastMode == "transparent") {

        if (transparentMat == null) {
          transparentMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.2 });
        }

        let new_colliderArray = [];
        for (let i = 0; i < intersects_collider.length; i++) {
          let hit_collider = intersects_collider[i].object;
          if (hit_collider.parent.name == "player" ||
            hit_collider.name.indexOf("air") > -1 ||
            hit_collider.name.indexOf("trigger") > -1 ||
            hit_collider.name.indexOf("point") > -1 ||
            hit_collider.name.indexOf("hit") > -1 ||
            (hit_collider.tag != undefined && hit_collider.tag.indexOf("particle")) > -1 ||
            hit_collider.parent.name == "ignoreRaycast" ||
            (hit_collider.isLine != null && hit_collider.isLine == true) ||
            hit_collider.name == "ignoreRaycast"
          ) { continue; }
          new_colliderArray.push({ mesh: hit_collider, mat: hit_collider.material });
        }

        if (new_colliderArray.length == 0) { return null; }

        // console.log("遮挡视角的物体数量为 " + new_colliderArray.length);

        for (let i = old_castArray.length - 1; i >= 0; i--) {
          const oldItem = old_castArray[i];
          let has = false;
          for (let j = 0; j < new_colliderArray.length; j++) {
            const newItem = new_colliderArray[j];
            if (newItem.mesh == oldItem.mesh) {
              has = true;
              continue
            }
          }
          // 旧的里面没有新的，则把旧的还原,并从旧的里移除
          if (!has) {
            oldItem.mesh.material = oldItem.mat;
            old_castArray.slice(i, 1);
          }
        }

        let temp = [];
        for (let j = 0; j < new_colliderArray.length; j++) {
          const newItem = new_colliderArray[j];
          let has = false;
          for (let i = 0; i < old_castArray.length; i++) {
            const oldItem = old_castArray[i];
            if (newItem.mesh == oldItem.mesh) {
              has = true;
              continue;
            }
          }
          //新的里面没有旧的，则把新的加入到旧的，把新的设为透明材质
          if (!has) {
            temp.push({ mesh: newItem.mesh, mat: newItem.mat });
          }
          newItem.mesh.material = transparentMat;
        }

        for (let j = 0; j < temp.length; j++) {
          const newItem = temp[j];
          old_castArray.push(newItem);
        }

        return null;

      }
    }
    let hasCamRaycast = true; //是否激活摄像机视角障碍检测
    function CheckCameraLine() {
      // console.log("摄像机障碍检测", hasCamRaycast, viewState);

      if (!hasCamRaycast || viewState == 1) { return; }
      let fromPos = camTargetDirection.getWorldPosition(new THREE.Vector3());
      let direction = camTargetDirection.getWorldDirection(new THREE.Vector3());

      // console.log("检测角色与摄像机之间 是否碰撞 ",fromPos,direction);
      var raycaster_cameraLine = new THREE.Raycaster(fromPos, direction, 0, -wheelCurrentValue - 0.5);
      raycaster_cameraLine.camera = camera;
      //只检测pointParent物体的子物体
      var intersects_collider = raycaster_cameraLine.intersectObjects(scene.children, true);

      if (intersects_collider.length > 0) {

        let hit_collider = GetInvaildCastObj(intersects_collider);
        if (hit_collider != null) {
          // intersects_collider[hitIndex].point
          camera.position.set(-intersects_collider[hitIndex].distance + 0.5, 0, 0);
          return;
        }
        // console.log("摄像机障碍检测",hit_collider);
        // console.log("检测角色与摄像机之间碰撞 "+ intersects_collider.length +"  "+ hit_collider.name + "  " );
        // console.log("检测角色与摄像机之间碰撞 ", intersects_collider , hit_collider.name + "  " );
      }

      if (old_castArray.length != 0) {
        for (let j = 0; j < old_castArray.length; j++) {
          const newItem = old_castArray[j];
          newItem.mesh.material = newItem.mat;
        }
        old_castArray = [];
      }
      camera.position.set(wheelCurrentValue, 0, 0);

    }

    //#endregion

    var pai = Math.PI;
    var inKeyboardOrJoystick = false;

    //#region 
    //#endregion

    let rotaViewDoonce = 0;
    // 移动时，让角色朝相机面向的方向移动.弃用，移动朝向用摄像机判断
    function RotaYJAmmoToCameraForward() {
      if (setting.firstPerson) return;
      CancelOnlyRotaView();

      if (!leftMouseRotaView) {
        return;
      }
      if (rotaViewDoonce > 0) {
        return;
      }

      // console.log("  移动时，让角色朝相机面向的方向移动 ");

      rotaViewDoonce++;

      let temp = new THREE.Group();

      let axes = new THREE.AxesHelper(5); // 坐标轴
      temp.add(axes); // 场景添加坐标轴
      scene.add(temp);

      let pos = camera.getWorldPosition(new THREE.Vector3());
      let currentRota = camera.getWorldQuaternion(new THREE.Quaternion());
      temp.quaternion.rotateTowards(currentRota, 10)
      temp.position.copy(pos);

      currentPlayerPos = getWorldPosition(_YJAmmoPlayer);
      temp.position.copy(currentPlayerPos);
      temp.translateZ(-2);

      temp.position.setY(currentPlayerPos.y);

      playerLookatPos = getWorldPosition(temp);


      _YJAmmoPlayer.lookAt(playerLookatPos);

      if (Math.abs(_YJAmmoPlayer.rotation.x) > 0) {
        rotaDirectionX = -1;
      } else {
        rotaDirectionX = 1;
      }

      camBaseParent.rotation.set(0, 0, 0);

      scene.remove(temp);

    }
    let oldCameraPos = new THREE.Vector3();

    let movingCallback;
    this.AddMovingListener = function (callback) {
      movingCallback = callback;
    }

    let playerMoveDirection = new THREE.Vector2(0, 0);
    let oldplayerMoveDirection = new THREE.Vector2(0, 0);

    // 插值旋转角色
    function lerpRotaPlayer() {

      oldplayerMoveDirection.lerp(playerMoveDirection, 0.5);


      // if (playerMoveDirection.y > 0) {
      //   _playerY = 2 * pai + (playerMoveDirection.x - 1) * pai / 2;
      // } else {
      //   _playerY = 2 * pai - (playerMoveDirection.x - 1) * pai / 2;
      // }

      if (oldplayerMoveDirection.y > 0) {
        _playerY = 2 * pai + (oldplayerMoveDirection.x - 1) * pai / 2;
      } else {
        _playerY = 2 * pai - (oldplayerMoveDirection.x - 1) * pai / 2;
      }

      _player.rotation.set(0, _playerY, 0);
    }

    let playerPosDownCallback = null;
    //掉入地下，刷新玩家到地面上重新开始
    this.SetplayerPosDownCallback = function (callback) {
      playerPosDownCallback = callback;
    }

    //#region  角色同步数据，为同步传出数据：角色的坐标、旋转、皮肤、动作


    var userData = {
      rotateY: 0,
      animName: 'idle',
      animWeight: 0,
      parentName: "scene",
      avatarDisplay: true,

      //武器
      weaponData: {
        pickType: "",
        weaponType: "",
        weaponId: "", //武器模型
        transId: "", //武器模型在场景中的id
      },

      baseData: {
        camp: "lm", //阵营
        speed: 8, //移动速度
        level: 1, //等级
        health: 200, //当前剩余生命值
        maxHealth: 200, //最大生命值
        strength: 30, //攻击力
        armor: 0, //护甲
        energy: 0, //能量
      }

    };

    this.SetNameTransOffsetAndScale = function (h, scale) {
      userData.nameTrans = { h: h, scale: scale };
      _YJPlayer.SetNameTransOffsetAndScale(h, scale);
    }
    this.ResetNameTransOffsetAndScale = function () {
      userData.nameTrans = "reset";
      _YJPlayer.ResetNameTransOffsetAndScale();
    }

    this.SetMyCtrlRbParent = function (parent) {
      userData.parentName = parent.name;
      _YJAmmo.SetMyCtrlRbParent(parent);
    }

    // 外部设置角色模型显示或隐藏. 不包含姓名条
    this.SetPlayerAvatarDisplay = function (b) {
      userData.avatarDisplay = b;
      _YJPlayer.DisplayAvatar(b);
    }

    //给新加入用户再次发送 GetUserData
    this.GetUserData = function () {
      return userData;
    }
    this.SetUserDataItem = function (property, value, value2) {
      if (value2 != undefined) {
        userData[property][value] = value2;
        directUpate = true;
        return;
      }
      userData[property] = value;
      directUpate = true;
    }
    this.GetUserDataItem = function (property, property2) {
      if (property2 != undefined) {
        return userData[property][property2];
      }
      return userData[property];
    }
    // 显示隐藏的同步
    let olddyncDisplay = true;
    this.SetDyncDisplay = function (b) {
      userData.dyncDisplay = b;
    }

    // 设置坐骑
    this.SetMount = function (e) {
      mountName = e;
      userData.mountName = mountName;
    }

    let bTransmit = false;
    this.SetTransmit = function (b) {
      userData.bTransmit = b;
    }

    var oldPos = new THREE.Vector3();
    var oldrotateY = 1;
    var oldAnimName = "";
    var oldAnimWeight = 0;

    let oldMountName = "";
    let mountName = "";

    let updateTimes = 0;
    let directUpate = true; //强制刷新
    this.updateBaseData = function (_baseData) {
      userData.baseData = _baseData;
      directUpate = true;
    }
    this.directUpate = function () {
      directUpate = true;
    }
    this.resetLife = function () {
      _this._YJSceneManager.ResetPlayerPos();

      setTimeout(() => {
        _YJPlayer.isDead = false; 
        this.SetInteractiveNPC("重生");
        this.SetCanMoving(true); 
        this.directUpate(); 
      }, 200);
    }
    // 是否已死亡
    this.isInDead = function () {
      return userData.baseData.health == 0;
    }
    this.updateSend = function () {
      if (_YJPlayer == null || _player == null || _YJAmmoPlayer == null) {
        return null;
      }

      const deltaTime = clock.getDelta();
      updateTimes += deltaTime;
      // console.log("发送同步",updateTimes);
      if (updateTimes >= 1 / _Global.dyncUpdateFrame) {
        updateTimes = 0;
      } else {
        return null;
      }
      // return null;

      //检查数据变化
      // var newPos = getWorldPosition(_player);
      var newPos = _YJAmmoPlayer.position;

      // let pos = newPos;
      // console.log(" 角色局部坐标为 ",pos);

      var newrotateY = 0;

      let playerQuat = _player.getWorldQuaternion(new THREE.Quaternion());
      let e = new THREE.Euler();
      e.setFromQuaternion(playerQuat);

      if (contrlState == CONTRLSTATE.MOUSE) {

        // let lookatQuat = _YJAmmoPlayer.getWorldQuaternion(new THREE.Quaternion());
        // _playerY = Math.PI / 2;
        // newrotateY = (1 - lookatQuat.y) * -Math.PI - _playerY ;

        newrotateY = playerQuat.y;

      } else {
        newrotateY = _YJAmmoPlayer.rotation.y + _playerY;
      }

      if (oldrotateY == newrotateY
        && oldAnimName == animName
        && oldAnimWeight == animWeight
        && oldMountName == mountName
        && oldPos.distanceTo(newPos) < 0.01
        && olddyncDisplay == userData.dyncDisplay
        && !directUpate
      ) {
        // console.log(" 角色状态不变，不发送更新 ");
        return;
      }
      // console.log(" 角色状态 改变，发送更新 ");

      directUpate = false;

      if (oldPos.x != newPos.x || oldPos.y != newPos.y || oldPos.z != newPos.z) {
        userData.pos = { x: newPos.x, y: newPos.y - playerHeight / 2, z: newPos.z };
      }
      userData.rotateY = newrotateY;
      userData.rotateEuler = { x: e.x, y: e.y, z: e.z };

      // console.log(" 发送角色数据 " + (oldPos.x == newPos.x) +" "+ (oldPos.y == newPos.y) +" "+
      //  (oldPos.z == newPos.z));
      // console.log(" 发送角色数据 newrotateY " + newrotateY);
      // console.error(" 发送角色数据 " + (newPos.x) +" "+ ( newPos.y) +" "+(newPos.z));

      userData.animName = animName;
      userData.animWeight = animWeight;
      userData.mountName = mountName;

      olddyncDisplay = userData.dyncDisplay;


      oldrotateY = newrotateY;
      oldAnimName = animName;
      oldAnimWeight = animWeight;

      oldMountName = mountName;
      // console.log(" 发送 角色 坐标 ", userData.pos );
      oldPos = newPos.clone();
      return userData;
    }


    this.SetPlayerAnimName = function (_animName) {
      animName = _animName;
      _YJPlayer.ChangeAnim(animName);
    }
    this.ChangeAnimDirect = function (_animName) {
      animName = _animName;
      _YJPlayer.ChangeAnimDirect(animName);
    }
    // 角色lookat坐标
    this.PlayerLookatPos = function (pos) {
      let temp = new THREE.Group();
      scene.add(temp);
      temp.position.copy(pos);
      temp.position.y = this.GetPlayerWorldPos().y - playerHeight / 2;
      temp.add(new THREE.AxesHelper(5));
      _player.lookAt(temp.position.clone());
      oldrotateY = -100;
      // _player.add(new THREE.AxesHelper(2));
      scene.remove(temp);
    }

    this.DyncPlayerState = function (state) {
      _YJPlayer.DyncPlayerState(state);
    }
    this.ReceiveDamage = function (_targetModel, skillName, effect) {
      return _YJPlayerFireCtrl.OnPlayerState({
        title: "fire",
        content: "受到伤害",
        msg: { _targetModel: _targetModel, skillName: skillName, effect: effect },
      });
    } 
    this.SetInteractiveNPC = function (content, msg) {
      if(content == "删除镜像" || content == "重生"){

      }else{
        if(this.isInDead()){
          // 角色死亡后不接收道具效果
          return;
        } 
      }
      _YJPlayerFireCtrl.OnPlayerState({
        title: "fire",
        content: content,
        msg: msg,
      });
    }
 
    this.SetPlayerState = function (e, type) {
      // console.log(" in SetPlayerState  ",e,type);
      if (playerState == PLAYERSTATE.INTERACTIVE) {
        return;
      }

      // switch (e) { 
      //   case "normal": 
      //     animName = "idle"; 
      //     break; 
      //   case "跳跃":  
      //     animName = "jump"; 
      //     break;
      //   case "移动":
      //     animName = "run"; 
      //     break;
      //   case "停止移动":
      //     animName = "idle"; 
      //     break; 
      //   default:
      //     break;
      // }
      // _YJPlayer.ChangeAnim(animName);

      _YJPlayerFireCtrl.OnPlayerState({
        title: "fire",
        content: "设置玩家状态",
        msg: e,
      });


    }


    //#endregion

    let onPlayerPosAction;
    this.SetPlayerPosHandler = function (callback) {
      onPlayerPosAction = callback;
    }



    let inMoving = false;
    this.update = function () {
      const time = performance.now();
      // console.log("in yjcontroller   niaokanCamPos = " ,  niaokanCamPos  );
      // console.log("in yjcontroller   camPosx = " , camera.position  );

      // console.log(" in playerParent rota  " + 
      // posToString(playerParent.rotation) + "  targetRota = "+posToString(camTarget.rotation));


      // console.log("  targetRota = "+posToString(camTarget.rotation));
      // let pos = _YJAmmoPlayer.getWorldPosition(new THREE.Vector3());
      // console.log("刚体实时坐标为 ",pos);

      lerpFollow();

      LerpMovePlayer();
      lerpLookat();
      ChangeView();
      ChangeToNiaokanView();
      RotaView();
      LookatView();
      ChangeViewFar();
      // 鸟瞰视角转人视角
      ChangeToPersonView();

      OnRotaBaseFn();

      if (canDampingRota) {
        // 滑动阻尼 
        LerpRotaBase_leftMouse();
      }

      let newCameraPos = camera.getWorldPosition(new THREE.Vector3());
      if (!checkV3Equel(oldCameraPos, newCameraPos)) {
        // console.log(" " +  posToString(oldCameraPos) + " ==> "+posToString(newCameraPos));
        // 检测角色与摄像机之间的是否有碰撞物体，让角色与摄像机之间始终无遮挡
        CheckCameraLine();
        oldCameraPos.set(newCameraPos.x, newCameraPos.y, newCameraPos.z);
        if (onPlayerPosAction) {
          onPlayerPosAction(_YJAmmoPlayer.position);
        }
      }

      // console.log(b_lerpChangeView,b_lerplookat,b_lerpMovePlayer,b_lookat,lerpToEnd,b_lerpRotaView,b_lepToNiaokan,b_lepCamRotaGroup);
      // 独立移动摄像机
      OnlyMoveCamera();
      TWEEN.update();




      //同步角色动作
      if (_YJPlayer != null && _player != null) {
        _YJPlayer._update();
        CheckFly();

        if (!canJump || jump) {
          if (moveForward || moveLeft || moveRight || moveBackward) {
            RotaYJAmmoToCameraForward();

            // 插值旋转角色朝向
            lerpRotaPlayer();

            if (playerState != PLAYERSTATE.NORMAL) {
              playerState = PLAYERSTATE.NORMAL;
            }

          } else {

            rotaViewDoonce = 0;
          }

        } else {
          //变换角色朝向
          if (moveForward || moveLeft || moveRight || moveBackward) {
            RotaYJAmmoToCameraForward();

            // 插值旋转角色朝向
            lerpRotaPlayer();

            // if (inRun) {
            //   animName = "run";
            // } else {
            //   // animName = "walk";
            //   animName = "run";
            // }

            inMoving = true;
            scope.SetPlayerState("移动");
            userData.onlySetAnim = false;


            if (playerState != PLAYERSTATE.NORMAL) {
              playerState = PLAYERSTATE.NORMAL;
              if (movingCallback) {
                movingCallback();
              }
            }

          } else {
            if (inMoving) {
              inMoving = false;
              scope.SetPlayerState("停止移动");
            }
            rotaViewDoonce = 0;
          }
        }
        // _YJPlayer.ChangeAnim(animName);
        // console.log("animName = " + animName,inRun,playerState);

        if (contrlState != CONTRLSTATE.MOUSE && !inKeyboardOrJoystick) {

          //变换角色朝向
          if (moveForward) {
            playerMoveDirection.x = 0;
            playerMoveDirection.y = -1;
            if (moveLeft) {
              playerMoveDirection.x = -0.5;
              playerMoveDirection.y = -0.5;
            }
            if (moveRight) {
              playerMoveDirection.x = 0.5;
              playerMoveDirection.y = -0.5;
            }
          } else {

            playerMoveDirection.x = 0;
            playerMoveDirection.y = 0;
            if (moveLeft) {
              playerMoveDirection.x = -1;
            }
            if (moveRight) {
              playerMoveDirection.x = 1;
            }
          }

          if (moveBackward) {

            playerMoveDirection.x = 0;
            playerMoveDirection.y = 1;
            if (moveLeft) {
              playerMoveDirection.x = -0.5;
              playerMoveDirection.y = 0.5;
            }
            if (moveRight) {
              playerMoveDirection.x = 0.5;
              playerMoveDirection.y = 0.5;
            }
          }
        }

      }

      if (moveForward || moveLeft || moveRight || moveBackward) {

        // 在键鼠或遥感控制模式下，行走动作权重始终为1
        if (contrlState != CONTRLSTATE.MOUSE) {
          if (animName == "walk") {
            SetWalkWeight(1);
          }
        }
        if (_YJPlayer == null || _player == null || _YJAmmoPlayer == null) {
          return;
        }


        //掉入地下，刷新玩家到地面上重新开始
        var newPos = getWorldPosition(_player);
        if (newPos.y < -20) {
          if (playerPosDownCallback) {
            playerPosDownCallback();
          }
          return;
        }
        // inKeyboardOrJoystick = true;
      } else {
        // inKeyboardOrJoystick = false;
      }

      prevTime = time;



    }

    function posToString(v) {
      return v.x + "  " + v.y + "  " + v.z;
    }
    function rotaToString(v) {
      return v.x + "  " + v.y + "  " + v.z + "  " + v.w;
    }
    var addEventListenered = false;

    this.dispose = function () {

      if (!addEventListenered) { return; }
      addEventListenered = false;

      console.log("移除 控制器操作监听");

      this.domElement.removeEventListener('contextmenu', contextmenu);
      this.domElement.removeEventListener('mousemove', _onMouseMove);
      this.domElement.removeEventListener('mousedown', _onMouseDown);
      this.domElement.removeEventListener('mouseup', _onMouseUp);

      this.domElement.removeEventListener('wheel', _onMouseWheel);

      this.domElement.removeEventListener('touchstart', _onTouchStart, false);
      this.domElement.removeEventListener('touchend', _onTouchEnd, false);
      this.domElement.removeEventListener('touchmove', _onTouchMove, false);

      window.removeEventListener('keydown', _onKeyDown);
      window.removeEventListener('keyup', _onKeyUp);

      if (pointerLock) {
        return;
      }
      state = STATE.NONE;
      this.mouseDragOn = false;

    };
    this.addPointerEventListener = function () {
      this.domElement.ownerDocument.addEventListener('mousemove', _onMouseMove);
      this.domElement.ownerDocument.addEventListener('wheel', _onMouseWheel);
      this.domElement.removeEventListener('mousemove', _onMouseMove);
    }
    this.removePointerEventListener = function () {
      this.domElement.ownerDocument.removeEventListener('mousemove', _onMouseMove);
      this.domElement.ownerDocument.removeEventListener('wheel', _onMouseWheel);
    }
    this.addMouseEventListener = function () {

      // console.log(" 监听控制器操作 ");

      this.domElement.addEventListener('mousemove', _onMouseMove);

      this.domElement.addEventListener('mousedown', _onMouseDown);
      this.domElement.addEventListener('mouseup', _onMouseUp);

      this.domElement.addEventListener('wheel', _onMouseWheel);

      // window.addEventListener('keydown', _onKeyDown);
      // window.addEventListener('keyup', _onKeyUp);


      this.domElement.addEventListener('touchstart', _onTouchStart, false);
      this.domElement.addEventListener('touchend', _onTouchEnd, false);
      this.domElement.addEventListener('touchmove', _onTouchMove, false);

      if (pointerLock) {
        return;
      }
      state = STATE.NONE;
    }

    this.addEventListener = function () {
      if (addEventListenered) { return; }
      addEventListenered = true;

      // this.domElement.addEventListener('contextmenu', contextmenu);
      this.addMouseEventListener();

    };

    const _onMouseMove = this.onMouseMove.bind(this);
    const _onMouseDown = this.onMouseDown.bind(this);
    const _onMouseUp = this.onMouseUp.bind(this);
    // const _onKeyDown = this.onKeyDown.bind(this);
    // const _onKeyUp = this.onKeyUp.bind(this);

    const _onMouseWheel = this.onMouseWheel.bind(this);


    const _onTouchStart = this.onTouchStart.bind(this);
    const _onTouchEnd = this.onTouchEnd.bind(this);
    const _onTouchMove = this.onTouchMove.bind(this);

    this.addEventListener();
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJController };