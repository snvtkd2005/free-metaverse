




import * as THREE from "three";

import TWEEN from '@tweenjs/tween.js';

class YJControllerRota {
  constructor(domElement, _this) {
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
 
    this.domElement = domElement;
 
    this.rotateSpeed = 4.0;

    //#region 
    //#endregion
  
    //#region  鼠标控制、触摸控制

    this.mouseX = 0;
    this.mouseY = 0;

    this.mouseXold = 0;
    this.mouseYold = 0;

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
          break;
      }
    };

    this.onMouseUp = function (event) {
      if (pointerLock) {
        return;
      }
      state = STATE.NONE;
    };
 
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
          // console.log( "垂直旋转时旋转摄像机 z = " + camTarget.rotation.z);
          // RotaCamTarget(-x * this.rotateSpeed, y);

          RotaBase(x * this.rotateSpeed, y);
          break;
        case STATE.DOLLY:
          if (scope.enableZoom === false) return;
          // handleMouseMoveDolly( event );
          break;
        case STATE.PAN:
          if (scope.enablePan === false) return;
          RotaBase(x * this.rotateSpeed, y);
          //如果在受键盘或摇杆控制，则不受右键旋转
          break;

      }
      this.mouseXold = this.mouseX;
      this.mouseYold = this.mouseY;
    };

    // 强制横屏
    var forcedLandscape = false;
    this.SetforcedLandscape = function (b) {
      forcedLandscape = b;
    } 
    //鼠标左键或右键拖动控制左右旋转， 视角上下旋转
    function RotaBase(x, y) {
      _this.RotaBase(x,y);
    }



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

      // event.preventDefault();
      // event.stopPropagation();
      this.mouseDragOn = false;
 
      doonce = 0;
      effectiveFinger = 0;
      if (doonce_touch > 0) {
        doonce_touch = 0;
      }
    };

    var oldPageX = 0;
    var oldPageY = 0;
 
    var doonce = 0; 

    var mobileRotaSpeed = 0.001;
    this.onTouchMove = function (event) {
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
        var touch = event.touches[0];

        if (touches.length > 1) {
          touch = event.touches[effectiveFinger];

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
          
        }

        let x = (touch.pageX - oldPageX) * mobileRotaSpeed * this.rotateSpeed;
        let y = -(touch.pageY - oldPageY) * mobileRotaSpeed * this.rotateSpeed;

        // console.log(" in touch move  " + this.mouseX + " " +  this.mouseY );


        RotaBase(x, y); 

        oldPageX = touch.pageX;
        oldPageY = touch.pageY;

      } else {
        doonce = 0;
      }
    };
 
    //#endregion

    //#region 
    //#endregion
   
  
    //#region 
    //#endregion
  
    var addEventListenered = false;

    this.dispose = function () {

      if (!addEventListenered) { return; }
      addEventListenered = false;

      console.log("移除 控制器操作监听");

      this.domElement.removeEventListener('contextmenu', contextmenu);
      this.domElement.removeEventListener('mousemove', _onMouseMove);
      this.domElement.removeEventListener('mousedown', _onMouseDown);
      this.domElement.removeEventListener('mouseup', _onMouseUp);


      this.domElement.removeEventListener('touchstart', _onTouchStart, false);
      this.domElement.removeEventListener('touchend', _onTouchEnd, false);
      this.domElement.removeEventListener('touchmove', _onTouchMove, false);

    }; 
    this.addMouseEventListener = function () {

      console.log(" 监听控制器操作 ");

      this.domElement.addEventListener('mousemove', _onMouseMove);

      this.domElement.addEventListener('mousedown', _onMouseDown);
      this.domElement.addEventListener('mouseup', _onMouseUp);

      this.domElement.addEventListener('touchstart', _onTouchStart, false);
      this.domElement.addEventListener('touchend', _onTouchEnd, false);
      this.domElement.addEventListener('touchmove', _onTouchMove, false);
 
    }

    this.addEventListener = function () {
      if (addEventListenered) { return; }
      addEventListenered = true;
      this.addMouseEventListener();
    };

    const _onMouseMove = this.onMouseMove.bind(this);
    const _onMouseDown = this.onMouseDown.bind(this);
    const _onMouseUp = this.onMouseUp.bind(this); 



    const _onTouchStart = this.onTouchStart.bind(this);
    const _onTouchEnd = this.onTouchEnd.bind(this);
    const _onTouchMove = this.onTouchMove.bind(this);

    this.addEventListener();
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJControllerRota };