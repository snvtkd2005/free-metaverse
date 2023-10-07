import * as THREE from "three";
import { Scene } from "three";
import { Uniform } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
 
// import TWEEN from "@/utils/tween";
import TWEEN from '@tweenjs/tween.js';

class YJController {
  constructor(scene, camera, domElement) {
    if (domElement === undefined) {
      console.warn('THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.');
      domElement = document;
    }
    var scope = this;
    this.enabled = true;

    // Mouse buttons
    this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
    var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

    var state = STATE.NONE;

    // this.object = object;
    this.domElement = domElement;

    // 视角缩放 。是控制摄像机相对摄像机目标体的X轴偏移量。 是负数，越小越远
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    // 视角旋转。控制摄像机目标体的旋转
    this.enableRotate = true;
    this.rotateSpeed = 1.0;

    // 平移。控制摄像机目标体相对屏幕空间的偏移
    this.enablePan = true;
    this.keyPanSpeed = 7.0;	// pixels moved per arrow key push


    const onDocumentMouseDown = (event) => {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;
      targetPageX = event.clientX;
      targetPageY = event.clientY;
      //DrawLineFromScreenToModel();
      console.log(
        " targetPageX " + targetPageX + "   targetPageY " + targetPageY
      );
      moving = true;
      raycasterUpdate(mouse);
    }

    var camTarget = null;

    var leftObj, rightObj, forwardObj, backObj;

    //创建碰撞检查
    const CreateRaycastBox = () => {

      var size = 0.1;
      var geometry = new THREE.BoxGeometry(size, size, size);//创建一个立方体
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0,
        transparent: true
      });

      var material_left = new THREE.MeshBasicMaterial({ color: 0xff0000 });//左 红
      var material_right = new THREE.MeshBasicMaterial({ color: 0x00ff00 });//右 绿
      var material_forward = new THREE.MeshBasicMaterial({ color: 0x00000000 });//前 黑
      var material_back = new THREE.MeshBasicMaterial({ color: 0xffffff });//后 白

      // leftObj = new THREE.Mesh(geometry, material_left);//网格绘制
      // rightObj = new THREE.Mesh(geometry, material_right);//网格绘制
      // forwardObj = new THREE.Mesh(geometry, material_forward);//网格绘制
      // backObj = new THREE.Mesh(geometry, material_back);//网格绘制

      leftObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制
      rightObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制
      forwardObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制
      backObj = new THREE.Mesh(geometry, cubeMaterial);//网格绘制

      forwardObj = new THREE.Group();

      leftObj.name = "leftObj";
      rightObj.name = "rightObj";
      forwardObj.name = "forwardObj";
      backObj.name = "backObj";


      camTarget.add(leftObj);
      camTarget.add(rightObj);
      camTarget.add(forwardObj);
      camTarget.add(backObj);
      leftObj.position.set(0, 0, 0);
      rightObj.position.set(0, 0, 0);
      forwardObj.position.set(0, 0, 0);
      backObj.position.set(0, 0, 0);

      var length = 10;
      var rota = 1.55;
      var rota2 = 0.0;
      leftObj.rotateY(rota2);
      rightObj.rotateY(rota2);
      leftObj.translateZ(-length);
      rightObj.translateZ(length);


      forwardObj.rotateY(rota);
      backObj.rotateY(rota);

      forwardObj.translateZ(length);
      backObj.translateZ(-length);

      // forwardObj.translateX(length);
      // backObj.translateX(-length);
      // console.log("in CreateRaycastBox");

    }

    //初始化摄像机父物体，移动时，移动父物体， 旋转时，横向旋转父物体，竖向旋转摄像机
    const Init = () => {
      let size = 0.002;
      let cubeGeometry = new THREE.BoxGeometry(size, size, size);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0,
        transparent: true
      });

      camTarget = new THREE.Mesh(cubeGeometry, cubeMaterial);
      camTarget.position.set(camera.position.x, camera.position.y, camera.position.z);

      camTarget.name = "camTarget";

      scene.add(camTarget);
      camTarget.add(camera);
      // camera.position.set(-3, 0, 0);
      camera.position.set(0, 0, 0);
      camera.lookAt(camTarget.position.x + 0.01, camTarget.position.y, camTarget.position.z);
    }

    Init();
    CreateRaycastBox();

    this.wheelMin = -20;
    this.wheelMax = -1;
    var wheelCurrentValue = -5;


    var clock = new THREE.Clock();//时间跟踪

    var moving = false;

    this.mouseX = 0;
    this.mouseY = 0;

    this.mouseXold = 0;
    this.mouseYold = 0;

    this.onMouseDown = function (event) {
      if (scope.enabled === false) return;

      // if (this.domElement !== document) {
      //   this.domElement.focus();
      // }

      event.preventDefault();

      switch (event.button) {

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

        case scope.mouseButtons.PAN:

          if (scope.enablePan === false) return;

          state = STATE.PAN;

          break;

      }
      // moving = true;

    };
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
    this.onMouseUp = function (event) {
      // moving = false;
      state = STATE.NONE;

      // this.mouseXold = this.mouseX;
      // this.mouseYold = this.mouseY;
    };

    function getZoomScale() {
      return Math.pow(0.95, scope.zoomSpeed);
    }
    this.onMouseWheel = function (event) {

      if (this.enabled === false || this.enableZoom === false) return;

      event.preventDefault();

      if (event.deltaY < 0) {

        // dollyIn( getZoomScale() );
        // wheelCurrentValue += 0.1;
        this.cameraFovControll(event.deltaY,0.1);

      } else if (event.deltaY > 0) {

        // dollyOut( getZoomScale() );
        // wheelCurrentValue -= 0.1;
        this.cameraFovControll(event.deltaY,0.1);
      }
return;
      // this.wheelCurrentValue = Math.lerp(this.wheelMin,this.wheelMax);
      // this.wheelCurrentValue.lerp(this.wheelMax,);
      if (wheelCurrentValue <= this.wheelMin) {
        wheelCurrentValue = this.wheelMin;
      }
      if (wheelCurrentValue >= this.wheelMax) {
        wheelCurrentValue = this.wheelMax;
      }
      // camera.position.set(0, 0, this.wheelCurrentValue);
      currentCam.set(wheelCurrentValue, 0, 0);

      camera.position.set(wheelCurrentValue, 0, 0);

      // scope.dispatchEvent( _startEvent );

      // handleMouseWheel( event );

      // scope.dispatchEvent( _endEvent );

    }
    //缩小 放大视角
    this.cameraFovControll = function(f,step){
      if(b_lerpChangeView){return;}

      if (f < 0) {
        wheelCurrentValue +=step;

      } else if (f > 0) {
        wheelCurrentValue -=step;
      }
      if (wheelCurrentValue <= this.wheelMin) {
        wheelCurrentValue = this.wheelMin;
      }
      if (wheelCurrentValue >= this.wheelMax) {
        wheelCurrentValue = this.wheelMax;
      }
      currentCam.set(wheelCurrentValue, 0, 0);
      camera.position.set(wheelCurrentValue, 0, 0);
    }

    var offset = new THREE.Vector3();
    this.onMouseMove = function (event) {


      if (scope.enabled === false) return;
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      var x = this.mouseX - this.mouseXold;
      var y = this.mouseY - this.mouseYold;

      event.preventDefault();

      switch (state) {

        case STATE.ROTATE:

          if (scope.enableRotate === false) return;

          // handleMouseMoveRotate( event );

          camTarget.rotation.y -= x;
          camTarget.rotation.z += y;
          // if (moving) {
          //   camTarget.rotation.y -= x;
          //   camTarget.rotation.z += y;
          //       // camera.rotateX(y); 
          // }
          break;

        case STATE.DOLLY:

          if (scope.enableZoom === false) return;

          // handleMouseMoveDolly( event );

          break;

        case STATE.PAN:

          if (scope.enablePan === false) return;
          camTarget.translateY(-y);
          camTarget.translateZ(-x);

          // handleMouseMovePan( event );
          // camTarget.position.copy(camTargetCopy.position)
          // camTargetPos.copy(camTargetCopy.position);
          // lerpLength = 0;
          // b_lerpChangeView = true;
          break;

      }
      this.mouseXold = this.mouseX;
      this.mouseYold = this.mouseY;
    };

    this.mouseDragOn = false;

    ///YJ
    var effectiveFinger = 0;
    var doonce_touch = 0;
    this.onTouchStart = function (event) {
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
      //return;

      event.preventDefault();
      event.stopPropagation();
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
    this.onTouchMove = function (event) {

      // console.log(" onTouchMove ");
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
        var touch = event.touches[0];

        if (touches.length > 1) {
          touch = event.touches[effectiveFinger];
          this.TwoFingerTouch (touches);
          return;
        } else {
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
        this.mouseX = (touch.pageX - oldPageX) * 0.005;
        this.mouseY = -(touch.pageY - oldPageY) * 0.005;

        // console.log(" in touch move  " + this.mouseX + " " +  this.mouseY );

        camTarget.rotation.y -= this.mouseX;
        camTarget.rotation.z += this.mouseY;

        oldPageX = touch.pageX;
        oldPageY = touch.pageY;

        newPageX = oldPageX;
        newPageY = oldPageY;


      } else {
        doonce = 0;
        fingerDoOnce = 0;
      }
    };
    //移动端两手指缩放
    var finger1NewPosX  = 0 ;
var finger2NewPosX  = 0 ;
var finger1OldPosX  = 0 ;
var finger2OldPosX  = 0 ;
var fingerDoOnce = 0;
    this.TwoFingerTouch = function(touches){
  
      if(!touches){
          return;
      };
  
      if(touches.length > 1){
          finger1NewPosX = touches[0].pageX;
          finger2NewPosX = touches[1].pageX;
          if(fingerDoOnce < 1){
              finger1OldPosX = finger1NewPosX;
              finger2OldPosX = finger2NewPosX;
              fingerDoOnce ++;
          }
          //计算两个手指当前帧与前一帧的实时位移量，大于0为放大，小于0为缩小
          var juli = Math.abs(finger2NewPosX-finger1NewPosX) -  Math.abs(finger2OldPosX-finger1OldPosX);
          this.cameraFovControll(-juli,0.01);

          finger1OldPosX = finger1NewPosX;
          finger2OldPosX = finger2NewPosX;
  
      }
  }

    ///

    this.onKeyDown = function (event) {

      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW': this.moveForward = true; break;

        case 'ArrowLeft':
        case 'KeyA': this.moveLeft = true; break;

        case 'ArrowDown':
        case 'KeyS': this.moveBackward = true; break;

        case 'ArrowRight':
        case 'KeyD': this.moveRight = true; break;

        case 'KeyR': this.moveUp = true; break;
        case 'KeyF': this.moveDown = true; break;

      }



    };

    this.onKeyUp = function (event) {

      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW': this.moveForward = false; break;

        case 'ArrowLeft':
        case 'KeyA': this.moveLeft = false; break;

        case 'ArrowDown':
        case 'KeyS': this.moveBackward = false; break;

        case 'ArrowRight':
        case 'KeyD': this.moveRight = false; break;

        case 'KeyR': this.moveUp = false; break;
        case 'KeyF': this.moveDown = false; break;

      }

    };



    this.canMoveForward = true;
    this.canMoveBack = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;

    var actualMoveSpeed = 1;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    // var intersects_collider = [];
    // var raycaster_collider;
    var hit_collider;
    //前后左右射线检测来做碰撞体
    function Raycaster_CreateCube(fromObj, toObj, d) {

      var fromPos = new THREE.Vector3(fromObj.position.x, fromObj.position.y, fromObj.position.z);
      var toPos = new THREE.Vector3(fromObj.position.x, fromObj.position.y, fromObj.position.z);
      // let length = 10;
      // if(toObj.name=="leftObj"){
      //   toPos = new THREE.Vector3(toPos.x + length ,toPos.y,toPos.z );
      // }
      // if(toObj.name=="rightObj"){
      //   toPos = new THREE.Vector3(toPos.x - length,toPos.y,toPos.z );

      // }
      // if(toObj.name=="forwardObj"){
      //   toPos = new THREE.Vector3(toPos.x,toPos.y,toPos.z - length );

      // }
      // if(toObj.name=="backObj"){
      //   toPos = new THREE.Vector3(toPos.x,toPos.y,toPos.z + length);
      // } 

      // 
      toPos = toObj.getWorldDirection(new THREE.Vector3());
      toPos.x *= d;
      toPos.y *= d;
      toPos.z *= d;

      // console.log("fromPos = " + posToString(fromPos));
      // console.log("toPos = " + posToString(toPos));
      // console.log("vect = " + toObj.name + " X= "+vect.x+ "  Y= "+vect.y+ "  Z= "+vect.z+ " "+ " ");


      // var raycaster_collider = new THREE.Raycaster(fromPos,toPos.normalize() ,0,8);
      var raycaster_collider = new THREE.Raycaster(fromPos, toPos, 0, 8);
      // var raycaster_collider = new THREE.Raycaster(fromPos,vect ,0,8);

      //只检测pointParent物体的子物体
      var intersects_collider = raycaster_collider.intersectObjects(scene.children, true);
      if (intersects_collider.length > 0) {
        // hit_collider = intersects_collider[0].object;
        // console.log(toObj.name +" 碰撞 "+ intersects_collider.length +"  "+ hit_collider.name + "  " );
        return false;
      } else {
        //YJdebug( toObj.name + "    未检测到物体 "  );
      }
      return true;

    }



    var b_lerpChangeView = false; //是否开始平滑过渡
    var camTargetPos = new THREE.Vector3();  //摄像机切换的目标坐标
    var camTargetRota = new THREE.Vector3();  //摄像机切换的目标坐标
    var camTargetCamZ = new THREE.Vector3();  //平滑过渡时使用的变量
    var lerpLength = 0;  //平滑过渡值，取值范围 0 - 1
    var currentTargetPos = new THREE.Vector3();  //平滑过渡时使用的变量
    var currentTargetRota = new THREE.Vector3();  //平滑过渡时使用的变量
    // var currentTargetRota ;  //平滑过渡时使用的变量
    var currentCam = new THREE.Vector3();  //摄像机的偏移位置
    //移动到目标位置
    this.MoveToTarget = (v3) => {

      currentTargetPos.x = camTarget.position.x;
      currentTargetPos.y = camTarget.position.y;
      currentTargetPos.z = camTarget.position.z;

      camTargetPos = v3;
      camTargetPos.y = currentTargetPos.y;
      b_lerpChangeView = true;
      lerpLength = 0;
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
    this.SetTargetRota = (targetRota) => {
      camTarget.rotation.set(targetRota.x, targetRota.y, targetRota.z);
      // camTarget.rotation.copy(targetRota);
      // console.log("in yjcontroller targetRota = "+posToString(camTarget.rotation));
    }
    this.SetLerpToTarget = (targetPos, targetRota, camPosX) => {
      currentTargetRota =RotaToV3( camTarget.rotation);
      // console.log("currentTargetRota",currentTargetRota);
      // console.log("targetRota",targetRota);
      // currentTargetRota = camTarget.rotation;
      camTargetCamZ.set(camPosX, 0, 0);

      // 测试使用tween.js 控制插值移动
      
      let tween1 = new TWEEN.Tween(currentTargetPos).to(targetPos, 1000).easing(TWEEN.Easing.Linear.None)
      let tween2 = new TWEEN.Tween(currentTargetRota).to(targetRota, 1000).easing(TWEEN.Easing.Linear.None)
      let tween3 = new TWEEN.Tween(currentCam).to(camTargetCamZ, 1000).easing(TWEEN.Easing.Linear.None)
      let updateTargetPos = ()=>{
        // camTarget.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
        camTarget.position.copy(currentTargetPos);

      }
      let updateTargetRota = ()=>{ 
        camTarget.rotation.set(currentTargetRota.x, currentTargetRota.y, currentTargetRota.z);
      }
      let updateCameraX = ()=>{  
        camera.position.set(currentCam.x, 0, 0);
      }


      tween1.onUpdate(updateTargetPos);
      tween1.start() // 启动动画

      tween2.onUpdate(updateTargetRota);
      tween2.start() // 启动动画

      tween3.onUpdate(updateCameraX);
      tween3.start() // 启动动画
      // b_lerpChangeView = true;
      return; 
      
 
    //  camTarget.rotation.set(targetRota.x, targetRota.y, targetRota.z);
    //   camTarget.position.set(targetPos.x, targetPos.y, targetPos.z);
    //   camera.position.set(camPosX, 0, 0);

    //   return; 

      camTargetPos = targetPos;

      camTargetRota =(targetRota) ;
      //角度转弧度
      // camTargetRota =RotaV3ToRota(targetRota) ;
      // console.log("in camTargetRota 222 = "+posToString(camTargetRota));

      wheelCurrentValue = camPosX;
      camTargetCamZ.set(camPosX, 0, 0);
      currentTargetRota =RotaToV3( camTarget.rotation);
      // camTargetRota = currentTargetRota; //不旋转角度
      b_lerpChangeView = true;

      // console.log("in targetRota = ",(camTarget.rotation));
      // console.log("in targetRota 222 = "+posToString(camTarget.rotation));
    }
    function RotaToV3(rotation){
      return new THREE.Vector3(rotation.x,rotation.y,rotation.z); 
    }

    //平滑移动到目标视角
    function ChangeView() {
      if (b_lerpChangeView) {

        lerpLength += 0.002;

        // currentTargetPos.lerp(camTargetPos, lerpLength);
        // currentTargetRota.lerp(camTargetRota, lerpLength);
        // currentCam.lerp(camTargetCamZ, lerpLength);
 
      camTarget.rotation.set(currentTargetRota.x, currentTargetRota.y, currentTargetRota.z);
      camTarget.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
      camera.position.set(currentCam.x, 0, 0);

        if (
          Math.abs(camTargetPos.z - currentTargetPos.z) < 0.001
          && Math.abs(camTargetPos.x - currentTargetPos.x) < 0.001
          && Math.abs(camTargetPos.y - currentTargetPos.y) < 0.001 &&

           Math.abs(camTargetCamZ.x -currentCam.x ) < 0.001

          // && Math.abs(currentTargetRota.x -camTargetRota.x ) < 0.001
          // && Math.abs(currentTargetRota.y -camTargetRota.y ) < 0.001
          // && Math.abs(currentTargetRota.z -camTargetRota.z ) < 0.001

        ) {

         b_lerpChangeView = false;
         camTarget.rotation.copy(RotaToV32(camTargetRota));
        // console.log("已移动到指定位置 " + lerpLength);

          lerpLength = 0;
        }
      }
    }
    function RotaToV32(rotation){ 
      return new THREE.Euler(rotation.x,rotation.y,rotation.z); 
    }
    this.update = function () {
      // console.log("in targetRota 222 = "+posToString(camTarget.rotation));

      // camTarget.rotation.set(currentTargetRota.x, currentTargetRota.y, currentTargetRota.z);
      // camTarget.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
      // camera.position.set(currentCam.x, 0, 0);

      // console.log("in yjcontroller   camPos = " + posToString(camera.position) + "  targetPos = " + 
      // posToString(camTarget.position) + "  targetRota = "+posToString(camTarget.rotation));
      // ChangeView();

      TWEEN.update();

      //碰撞检测 射线检测是否前后左右碰到物体，碰到即不可移动
      this.canMoveForward = Raycaster_CreateCube(camTarget, forwardObj, 1);
      this.canMoveBack = Raycaster_CreateCube(camTarget, backObj, -1);
      this.canMoveLeft = Raycaster_CreateCube(camTarget, leftObj, -1);
      this.canMoveRight = Raycaster_CreateCube(camTarget, rightObj, 1);

      if (this.moveForward && this.canMoveForward) camTarget.translateX((actualMoveSpeed));
      if (this.moveBackward && this.canMoveBack) camTarget.translateX(-actualMoveSpeed);

      if (this.moveLeft && this.canMoveLeft) camTarget.translateZ(- actualMoveSpeed);
      if (this.moveRight && this.canMoveRight) camTarget.translateZ(actualMoveSpeed);

    }
    function posToString(v) {
      return v.x + "  " + v.y + "  " + v.z;
    }
    this.dispose = function () {

      this.domElement.removeEventListener('contextmenu', contextmenu);
      this.domElement.removeEventListener('mousedown', _onMouseDown);
      this.domElement.removeEventListener('mousemove', _onMouseMove);
      this.domElement.removeEventListener('mouseup', _onMouseUp);

      this.domElement.removeEventListener('wheel', _onMouseWheel);

      this.domElement.removeEventListener('touchstart', _onTouchStart, false);
      this.domElement.removeEventListener('touchend', _onTouchEnd, false);
      this.domElement.removeEventListener('touchmove', _onTouchMove, false);

      window.removeEventListener('keydown', _onKeyDown);
      window.removeEventListener('keyup', _onKeyUp);

    };

    const _onMouseMove = this.onMouseMove.bind(this);
    const _onMouseDown = this.onMouseDown.bind(this);
    const _onMouseUp = this.onMouseUp.bind(this);
    const _onKeyDown = this.onKeyDown.bind(this);
    const _onKeyUp = this.onKeyUp.bind(this);

    const _onMouseWheel = this.onMouseWheel.bind(this);


    const _onTouchStart = this.onTouchStart.bind(this);
    const _onTouchEnd = this.onTouchEnd.bind(this);
    const _onTouchMove = this.onTouchMove.bind(this);

    this.domElement.addEventListener('contextmenu', contextmenu);
    this.domElement.addEventListener('mousemove', _onMouseMove);
    this.domElement.addEventListener('mousedown', _onMouseDown);
    this.domElement.addEventListener('mouseup', _onMouseUp);

    this.domElement.addEventListener('wheel', _onMouseWheel);

    this.domElement.addEventListener('touchstart', _onTouchStart, false);
    this.domElement.addEventListener('touchend', _onTouchEnd, false);
    this.domElement.addEventListener('touchmove', _onTouchMove, false);

    window.addEventListener('keydown', _onKeyDown);
    window.addEventListener('keyup', _onKeyUp);

  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJController };