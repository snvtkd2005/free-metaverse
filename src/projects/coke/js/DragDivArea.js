




import * as THREE from "three";
import {
  EventDispatcher,
} from 'three';


class DragDivArea extends EventDispatcher {
  constructor(_this, scene, camera, domElement, dragOffset,dragEnd, hitInstancedMesh) {
    super();
    if (domElement === undefined) {

      console.warn('THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.');
      domElement = document;

    }
    var scope = this;
    // Mouse buttons
    this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

    var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

    var state = STATE.NONE;

    // this.object = object;
    this.domElement = domElement;

    var mouse = new THREE.Vector2();

    var doOnce = 0;
    var mouseDown = false;
    var inmouseDown = false;

    var clickMousePosX = 0;
    var clickMousePosY = 0;

    var targetPageX = 0;
    var targetPageY = 0; 
    this.SetMouseDown = function (b) {
      mouseDown = b;
    }

    this.onMouseDown = function (event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;
      targetPageX = event.clientX;
      targetPageY = event.clientY;
      //DrawLineFromScreenToModel();
      // console.log(  " onMouseDown targetPageX " + targetPageX + "   targetPageY " + targetPageY   );
      mouseDown = true;

      switch (event.button) {
        //鼠标左键
        case scope.mouseButtons.ORBIT:
          state = STATE.ROTATE;
          break;
        case scope.mouseButtons.ZOOM:
          state = STATE.DOLLY;
          break;

        //鼠标右键
        case scope.mouseButtons.PAN:
          state = STATE.PAN;
          //鼠标右键点击
          break;
      }

    }

    this.onMouseMove = function (event) {

      // return;

      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      let offsetX = clickMousePosX - mouse.x;
      let offsetY = clickMousePosY - mouse.y;



      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;

      // raycasterHover(mouse);

      if (mouseDown) {
        // raycasterHover(mouse);
        if (dragOffset) {
          dragOffset(offsetX, offsetY);
        }
        // console.log(" in 拖拽 ", offsetX, offsetY);
      }
      // console.log(" in event client    " +event.clientX + " " + event.clientY  );
      // console.log(" in Mouse move  " +mouse.x + " " + mouse.y );
      // console.log(" in Mouse move" ," x = " + mouse.x + " y = " +mouse.y );

    };

    this.onMouseUp = function (event) {
      // console.log(" 抬起鼠标，点击热点 111 ");

      mouseDown = false;

      // console.log(" mouse down " ," x = " +clickMousePosX + " y = " +clickMousePosY );

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;



      if(dragEnd){
        dragEnd();
      }
      // console.log(" mouse up " ," x = " + mouse.x + " y = " +mouse.y );

      //鼠标点是否有位移，判断是否为滑动
      if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
        return;
      }

      if (forcedLandscape) {
        let xx = mouse.x;
        mouse.x = -mouse.y;
        mouse.y = xx;
      } 
      state = STATE.NONE;

    };

    this.onTouchStart = function (event) {

      var touch = event.touches[0];
      // console.log(" onTouchStart " , touch );

      mouse.x = (Number(touch.pageX) / window.innerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / window.innerHeight) * 2 + 1;
      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;

      mouseDown = true;
    }
    this.onTouchMove = function (event) {

      var touch = event.touches[0];

      mouse.x = (Number(touch.pageX) / window.innerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / window.innerHeight) * 2 + 1;

      let offsetX = clickMousePosX - mouse.x;
      let offsetY = clickMousePosY - mouse.y;

      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;

      if (mouseDown) {
        if (dragOffset) {
          dragOffset(offsetX, offsetY);
        }
      }
      // console.log(" touch moving " ," x = " + mouse.x + " y = " +mouse.y );
    }

    // 强制横屏
    var forcedLandscape = false;
    this.SetforcedLandscape = function (b) {
      forcedLandscape = b;
    }
    this.onTouchEnd = function (event) {

      mouseDown = false;

      var touch = event.changedTouches[0];
      // console.log(" onTouchEnd " , event );
      // console.log(" touch start " ," x = " +clickMousePosX + " y = " +clickMousePosY );

      mouse.x = (Number(touch.pageX) / window.innerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / window.innerHeight) * 2 + 1;



      
      if(dragEnd){
        dragEnd();
      }
      // console.log(" touch end " ," x = " + mouse.x + " y = " +mouse.y );

      // return;
      //鼠标点是否有位移，判断是否为滑动
      // if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
      //   return;
      // }

      if (Math.abs(clickMousePosX - mouse.x) > 0.1 || Math.abs(clickMousePosY - mouse.y) > 0.1) {
        return;
      }
      // console.log(" touch end " ," x = " + mouse.x + " y = " +mouse.y );

      if (forcedLandscape) {
        let xx = mouse.x;
        mouse.x = -mouse.y;
        mouse.y = xx;
      }

    };


    this.dispose = function () {

      this.domElement.removeEventListener('mousedown', _onMouseDown);
      this.domElement.removeEventListener('mousemove', _onMouseMove);
      this.domElement.removeEventListener('mouseup', _onMouseUp);

      this.domElement.removeEventListener('touchstart', _onTouchStart, false);
      this.domElement.removeEventListener('touchend', _onTouchEnd, false);
      this.domElement.removeEventListener('touchmove', _onTouchMove, false);


    };
    this.addEventListener = function () {


      this.domElement.addEventListener('mousemove', _onMouseMove);
      this.domElement.addEventListener('mousedown', _onMouseDown);
      this.domElement.addEventListener('mouseup', _onMouseUp);
  
      this.domElement.addEventListener('touchstart', _onTouchStart, false);
      this.domElement.addEventListener('touchend', _onTouchEnd, false);
      this.domElement.addEventListener('touchmove', _onTouchMove, false);

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

export { DragDivArea };