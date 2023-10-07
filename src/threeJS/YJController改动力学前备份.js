import * as THREE from "three";
import { Uniform } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";


import TWEEN from '@tweenjs/tween.js';

class YJController {
  constructor(scene, camera, domElement, _this) {
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
    this.rotateSpeed = 4.0;

    // 平移。控制摄像机目标体相对屏幕空间的偏移
    this.enablePan = true;
    this.keyPanSpeed = 7.0;	// pixels moved per arrow key push


    let prevTime = performance.now();

    const velocity = new THREE.Vector3();
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

    var playerParent = null;
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
      var material_forward = new THREE.MeshBasicMaterial({ color: 0x666666 });//前 黑
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


      playerParent.add(leftObj);
      playerParent.add(rightObj);
      playerParent.add(forwardObj);
      playerParent.add(backObj);

      var heightY = 0.2;
      leftObj.position.set(0, heightY, 0);
      rightObj.position.set(0, heightY, 0);
      forwardObj.position.set(0, heightY, 0);
      backObj.position.set(0, heightY, 0);

      var length = 1;
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

    }

    let raycaster;

    //初始化摄像机父物体，移动时，移动父物体， 旋转时，横向旋转父物体，竖向旋转摄像机
    const Init = () => {
      let size = 0.1;
      let cubeGeometry = new THREE.BoxGeometry(size, size, size);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity:0,
        transparent: true
      });



      playerParent = new THREE.Mesh(cubeGeometry, cubeMaterial);
      // playerParent.position.set(camera.position.x, camera.position.y, camera.position.z);
      playerParent.position.set(0, 0, 0);
      scene.add(playerParent);

      camTarget = new THREE.Mesh(cubeGeometry, cubeMaterial);
      // camTarget.position.set(camera.position.x, camera.position.y, camera.position.z);
      playerParent.add(camTarget);
      camTarget.position.set(0, 0, 0);

      camTarget.name = "camTarget";

      // scene.add(camTarget);
      camTarget.add(camera);
      // camera.position.set(-3, 0, 0);
      camera.position.set(0, 0, 0);
      camera.lookAt(camTarget.position.x + 0.01, camTarget.position.y, camTarget.position.z);

      raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -0.01, 0), 0, 0.1);


      // CreateRayBox();

      //添加角色聚光灯
      // const spotLight = new THREE.SpotLight( 0xffffff,2 );
      // spotLight.position.set( 3, 10, -10 );
      // spotLight.castShadow = true;
      // spotLight.shadow.mapSize.width = 1024;
      // spotLight.shadow.mapSize.height = 1024;

      // spotLight.shadow.camera.top = 4;
      // spotLight.shadow.camera.bottom = -4;
      // spotLight.shadow.camera.left = -14;
      // spotLight.shadow.camera.right = 14;
      // spotLight.shadow.camera.near = 0.1;
      // spotLight.shadow.camera.far = 40;
      // spotLight.shadow.camera.fov = 30;

      // playerParent.add( spotLight );


    }

    var crashObject,crashBox,boxHelper
    //创建碰撞包裹盒
    function CreateRayBox(){
      // 创建角色box包裹盒
      let cubeGeometry = new THREE.BoxGeometry(0.3, 1.7, 0.3);
      let cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        opacity:0.5,
        transparent: true
      });

       crashObject = new THREE.Mesh(cubeGeometry,cubeMaterial);
       crashObject.position.set(0,1.7/2,0);
       boxHelper = new THREE.BoxHelper(crashObject,0xff0000);
       crashBox = new THREE.Box3().setFromObject(crashObject);
       playerParent.add(crashObject,boxHelper);
      //  console.log("crashObject = ",crashObject);
      //  console.log("crashBox = ",crashBox);
    }

    // 实时判断碰撞包裹盒是否碰到物体
    function UpdateRayBox(){
      return;
      if(crashObject==null){return;}
      // let crashBox = crashObject.box3d;
      for (let i = 0; i <  _this.triggerList.length; i++) {
        let trigger =  _this.triggerList[i];
        // console.log("trigger ",trigger);
      //  console.log("crashBox = ",crashBox);
       let flag = crashBox.intersectsBox(trigger);
       console.log("flag ", flag);
        if(flag) {
          // 撞到了
          console.log("撞到了 " + trigger.name);
        }
      }
      return;
      // let flag = crashBox.intersectsBox(stoneBox);
      // if(flag) {
      //   // 撞到了

      // }
    }
    //设置控制器/角色的初始位置
    this.SetConctrollerInitPos = function(pos){
      
      playerParent.position.set(pos.x,pos.y,pos.z);
    }
    Init();
    CreateRaycastBox();



    var clock = new THREE.Clock();//时间跟踪

    //是否能移动和跳跃。 当玩家在控制不可移动和跳跃的载具时，设置控制器为不可移动和跳跃
    var canMoving = true;



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


    

    //#region  鼠标控制、触摸控制

    this.mouseX = 0;
    this.mouseY = 0;

    this.mouseXold = 0;
    this.mouseYold = 0;

    this.wheelMin = -20;
    this.wheelMax = -1;
    var wheelCurrentValue = -5;

    this.onMouseDown = function (event) {
      if (scope.enabled === false) return;

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
      state = STATE.NONE;
      // this.mouseXold = this.mouseX;
      // this.mouseYold = this.mouseY;
    };

    this.onMouseWheel = function (event) {

      if (this.enabled === false || this.enableZoom === false) return;

      event.preventDefault();

      if (event.deltaY < 0) {

        // dollyIn( getZoomScale() );
        wheelCurrentValue += 0.1;

      } else if (event.deltaY > 0) {

        // dollyOut( getZoomScale() );
        wheelCurrentValue -= 0.1;

      }
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

          // //水平旋转是旋转控制主体parent
          // playerParent.rotation.y -= x*this.rotateSpeed;
          // //垂直旋转是旋转摄像机目标体
          // camTarget.rotation.z += y;

          break;

        case STATE.DOLLY:

          if (scope.enableZoom === false) return;

          // handleMouseMoveDolly( event );

          break;

        case STATE.PAN:

          if (scope.enablePan === false) return;

          //鼠标右键控制旋转
          //水平旋转是旋转控制主体parent
          playerParent.rotation.y -= x * this.rotateSpeed;
          //垂直旋转是旋转摄像机目标体
          camTarget.rotation.z += y;

          //如果在受键盘或摇杆控制，则不受右键旋转
          RotaPlayer();


          // camTarget.translateY(-y);
          // camTarget.translateZ(-x);


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
          this.lookSpeed = 0.1;
        }
        this.mouseX = (touch.pageX - oldPageX) * 0.005;
        this.mouseY = -(touch.pageY - oldPageY) * 0.005;

        // console.log(" in touch move  " + this.mouseX + " " +  this.mouseY );

        // camTarget.rotation.y -= this.mouseX;
        //水平旋转是旋转控制主体parent
        playerParent.rotation.y -= this.mouseX;

        //如果在受键盘或摇杆控制，则不受右键旋转
        RotaPlayer();


        //垂直旋转是旋转摄像机目标体
        camTarget.rotation.z += this.mouseY;

        oldPageX = touch.pageX;
        oldPageY = touch.pageY;

        newPageX = oldPageX;
        newPageY = oldPageY;


      } else {
        doonce = 0;
      }
    };



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
        case 'KeyF':
          this.ClickInteractive();  
          break;

        case 'Space':
          //阻止浏览器空格翻页事件
          event.preventDefault();
          event.stopPropagation();

          this.ClickJump();
          break;

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
    //#endregion

    //#region 
    //#endregion


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


    //键盘控制的移动速度
    var actualMoveSpeed = 1;


    // var intersects_collider = [];
    // var raycaster_collider;

//#region   --------------- 碰撞交互区域  开始 -------------
    //

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    var canMoveForward = true;
    var canMoveBack = true;
    var canMoveLeft = true;
    var canMoveRight = true;


    // 碰撞检测 是否碰到障碍物、是否碰到可交换区域
    var hit_collider;
    var hit_trigger;
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


      var raycaster_trigger = new THREE.Raycaster(fromPos, toPos, 0, 0.4);
      var intersects_trigger = raycaster_trigger.intersectObjects(_this.triggerList, true);
      if (intersects_trigger.length > 0) {
        hit_trigger = intersects_trigger[0].object;
        // console.log(toObj.name +" trigger 碰撞 "+ intersects_trigger.length +"  "+ hit_trigger.name + "  " );

        if (toObj.name == "forwardObj" && (hit_trigger.name.indexOf("door") > -1 ||hit_trigger.name.indexOf("Trigger") > -1 )) {
          //碰到可交互物体
          ChangeJiaohuArea(true);
        }else{
          ChangeJiaohuArea(false);
        }
        return true;

      }else{
        if (toObj.name == "forwardObj") {       
           ChangeJiaohuArea(false);
        }
      }

      

      // var raycaster_collider = new THREE.Raycaster(fromPos, toPos, 0, 8);
      var raycaster_collider = new THREE.Raycaster(fromPos, toPos, 0, 0.4);
      //只检测pointParent物体的子物体
      var intersects_collider = raycaster_collider.intersectObjects(_this.colliderList, true);

      if (intersects_collider.length > 0) {
        hit_collider = intersects_collider[0].object;
        // console.log(toObj.name +" 碰撞 "+ intersects_collider.length +"  "+ hit_collider.name + "  " );
        // console.log(toObj.name +" 碰撞 "+ intersects_collider.length +"  "+ hit_collider.tag + "  " );
        if (toObj.name == "forwardObj" && (hit_collider.name.indexOf("door") > -1 )) {
          //碰到可交互物体 
          ChangeJiaohuArea(true);

          return false
        }
 
        ChangeJiaohuArea(false);

        return false;
      } else { 
        if (toObj.name == "forwardObj") {
          ChangeJiaohuArea(false);
        }
      }
      return true;

    }

    // 碰到交互区域，显示交互按钮提示，3秒后自动消失
    var laterJiaohu = null;
    function ChangeJiaohuArea(b){
      if(b==false){return;}
      inJiaohuArea = b;
      _this.ChangeTip(inJiaohuArea);
      if(inJiaohuArea){
        if(laterJiaohu!=null){clearTimeout(laterJiaohu);}
        laterJiaohu = setTimeout(() => {
          _this.ChangeTip(false);
        }, 3000);
      }
    }
    // --------------- 碰撞交互区域  结束 -------------
//#endregion




    this.ClickJump = function () {
      if (canJump === true) {
        Jump();
      }
    }
    //点击界面按钮 或 按F键交互可交互的物体，比如开关门
    this.ClickInteractive = function () {
      if (inJiaohuArea) {
        if (hit_collider!=null && hit_collider.name.indexOf("door") > -1) {
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
          hit_trigger = null;
        }

        if(hit_trigger!=null && hit_trigger.name.indexOf("Trigger") > -1){
          let tagName = hit_trigger.name.split("Trigger")
          var item = hit_trigger;
          
          for (let i = 0; i < _this.sceneModels.length; i++) {
            var sceneModel = _this.sceneModels[i];
            if (sceneModel.id == item.tag) {
              if(tagName[0] == "digger"){
                //打开挖掘机控制界面，并且把当前碰到的挖掘机发送给控制界面
                _this.$parent.SetDigger(sceneModel.model);
                //设置视角为挖掘机控制的最佳视角
                SetToOtherPos(getWorldPosition(hit_trigger),-20);
                // playerParent.position.setFromMatrixPosition(hit_trigger.matrix);
                //  console.log(" 激活控制界面  ");
              }
              // sceneModel.model.PlayAnim();
              console.log("查找到id为 " + item.tag + " 的物体 "+tagName[0]);
              continue;
            }
          }
          hit_trigger = null; 

        }
        ChangeJiaohuArea(false);
      }
    }

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
    const rotationMatrix = new THREE.Matrix4();
    const targetQuaternion = new THREE.Quaternion();
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


      // rotationMatrix.lookAt(camTargetPos, _player.position, _player.up);
      // targetQuaternion.setFromRotationMatrix( rotationMatrix );

      // _player.quaternion.rotateTowards( targetQuaternion, 1 );

      // _player.rotation.getRotationFromMatrix(_player.matrix, _player.scale);
      // _player.rotation.setEulerFromRotationMatrix(_player.matrix);
      // _player.lookAt(camTargetPos.x, camTargetPos.y, camTargetPos.z);
      // targetQuaternion.eu
      // var euler = new THREE.Euler();
      // euler.setFromQuaternion(targetQuaternion);
      // console.log(" 角色旋转Y轴为 " + _playerY + " ",targetQuaternion.y,euler );
      // setTimeout(() => {
      //   _playerY = _player.rotation.y;
      // }, 100);


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

    this.SetPlayerGroup = (group) => {
      playerParent.add(group);
      group.position.set(0, 0.0, 0);
    }


    this.RemovePlayer = () => {
      console.log(" 删除本地角色 ");
      playerParent.remove(_player);
    }

    let oldPlayerParentPos = new THREE.Vector3(0,0,0);
    let oldWheelValue;
    //设置模型回到上载具之前的位置
    this.SetToOldPos = ()=>{
      canMoving = true;
      SetPlayerParentPos(oldPlayerParentPos,oldWheelValue);
    }
    //设置角色到载具上
    function SetToOtherPos(targetPos, camPosX){
      canMoving = false;
      
      let pos = playerParent.position;
      oldPlayerParentPos.x = pos.x;
      oldPlayerParentPos.y = pos.y;
      oldPlayerParentPos.z = pos.z;
    
      console.log("old PlayerParentPos = " , oldPlayerParentPos);
      oldWheelValue = camera.position.x;

      SetPlayerParentPos(targetPos,camPosX);
    }
    function SetPlayerParentPos(targetPos, camPosX) {
      playerParent.position.copy(targetPos);
      wheelCurrentValue = camPosX;
      currentCam.set(wheelCurrentValue, 0, 0);
      camera.position.set(wheelCurrentValue, 0, 0);

      console.log("new PlayerParentPos = " , playerParent.position);

    }
    //设置摄像机偏移高度
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
    this.SetRootRota = (targetRota) => {
      playerParent.rotation.set(targetRota.x, targetRota.y, targetRota.z);
    }
    this.SetTargetRota = (targetRota) => {
      camTarget.rotation.set(targetRota.x, targetRota.y, targetRota.z);
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

    //平滑移动到目标视角
    function ChangeView() {
      if (b_lerpChangeView) {

        // currentTargetPos = playerParent.position;
        lerpLength += 0.002;

        //  currentTargetPos.lerp(camTargetPos,Math.abs( Math.sin(lerpLength)));
        currentTargetPos.lerp(camTargetPos, lerpLength);
        // currentCam.lerp(camTargetCamZ, lerpLength);
        // currentTargetRota.lerp(camTargetRota, lerpLength);

        // camTarget.rotation.set(currentTargetRota.x, currentTargetRota.y, currentTargetRota.z);
        playerParent.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
        // camera.position.set(currentCam.x, 0, 0);

        if (Math.abs(camTargetPos.z - currentTargetPos.z) < 0.01
          && Math.abs(camTargetPos.x - currentTargetPos.x) < 0.01
          && Math.abs(camTargetPos.y - currentTargetPos.y) < 0.01
          // && Math.abs(camTargetCamZ.x -currentCam.x ) < 0.01

          // && Math.abs(currentTargetRota.x -camTargetRota.x ) < 0.001
          // && Math.abs(currentTargetRota.y -camTargetRota.y ) < 0.001
          // && Math.abs(currentTargetRota.z -camTargetRota.z ) < 0.001

        ) {
          b_lerpChangeView = false;
          lerpLength = 0;
          // console.log("已移动到指定位置");
        }
      }
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


    var animName = "idle";

    function SetPlayerAnimName() {

      if (!canJump) {
        animName = "jump";
      } else {
        //变换角色朝向
        if (this.moveForward || this.moveLeft || this.moveRight || this.moveBackward) {
          animName = "walk";
        } else {
          animName = "idle";
        }
      }
      console.log("设置玩家角色动作 " + animName);
      _YJPlayer.ChangeAnim(animName);

    }

    function Jump() {
      if(!canMoving){return;} 
      jump = true;
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
    var userData = {
      rotateY:0,
      animName:'idle',
      // pos:{x:0,y:0,z:0},
    };

    var oldPos = new THREE.Vector3();
    var oldrotateY = 1;
    var oldAnimName = "";

    //给新加入用户再次发送
    this.SendAgain = function(){
      _this.SetUserData(userData);
    }
    
    this.updateSend = function () {
      if (_YJPlayer == null || _player == null) {
        return;
      }
      //检查数据变化
      var newPos = getWorldPosition(_player);
      var newrotateY = playerParent.rotation.y + _playerY;

      if(oldrotateY == newrotateY && oldAnimName == animName
       && oldPos.x == newPos.x && oldPos.y == newPos.y && oldPos.z == newPos.z ){
        return;
       }

      if (oldPos.x != newPos.x || oldPos.y != newPos.y || oldPos.z != newPos.z) {

        // userData.pos =  newPos;
        userData.pos =  {x:newPos.x,y:newPos.y,z:newPos.z};
        // userData.pos = [newPos.x, newPos.y, newPos.z];
      }
      userData.rotateY = newrotateY;
      // console.log(" 发送角色数据 ");

      _this.SetUserData(userData);


      oldrotateY = newrotateY;
      oldAnimName = animName;
      oldPos = newPos;

    }

    this.update = function () {


      const time = performance.now();

      // console.log(" in playerParent rota  " + 
      // posToString(playerParent.rotation) + "  targetRota = "+posToString(camTarget.rotation));
      
      ChangeView();


      TWEEN.update();
      UpdateRayBox();

      //同步角色动作
      if (_YJPlayer != null) {
        if (!canJump || jump) {
          animName = "jump";
        } else {
          //变换角色朝向
          if (this.moveForward || this.moveLeft || this.moveRight || this.moveBackward || b_lerpChangeView || isMoving) {

            animName = "walk";
          } else {
            animName = "idle";
          }
        }
        _YJPlayer.ChangeAnim(animName);
        userData.animName = animName;
        // _this.SetPlayerAnim(animName);



        if (this.moveForward && canMoveForward ) {
          playerParent.translateX((actualMoveSpeed));
          StopMovingTween();
        }
        if (this.moveBackward && canMoveBack ) {
          playerParent.translateX(-actualMoveSpeed);
          StopMovingTween();
        }

        // return;//取消平移
        if (this.moveLeft && canMoveLeft ) {
          playerParent.translateZ(- actualMoveSpeed);
          StopMovingTween();

        }
        if (this.moveRight && canMoveRight ) {
          playerParent.translateZ(actualMoveSpeed);
          StopMovingTween();

        }


        //变换角色朝向
        if (this.moveForward) {
          _playerY = pai / 2;
          if (this.moveLeft) {
            _playerY = pai * 3 / 4;
          }
          if (this.moveRight) {
            _playerY = pai / 4;
          }
          _player.rotation.set(0, _playerY, 0);


        } else {
          if (this.moveLeft) {
            _playerY = pai;
            _player.rotation.set(0, _playerY, 0);
          }
          if (this.moveRight) {
            _playerY = 0;
            _player.rotation.set(0, _playerY, 0);

          }
        }

        if (this.moveBackward) {
          _playerY = pai + pai / 2;
          if (this.moveLeft) {
            _playerY = pai * 5 / 4;
          }
          if (this.moveRight) {
            _playerY = pai * 7 / 4;
          }
          _player.rotation.set(0, _playerY, 0);

        }

      }

      if (this.moveForward || this.moveLeft || this.moveRight || this.moveBackward) {
        inKeyboardOrJoystick = true;
      } else {
        inKeyboardOrJoystick = false;
      }



      //碰撞检测 射线检测是否前后左右碰到物体，碰到即不可移动
      canMoveForward = Raycaster_CreateCube(playerParent, forwardObj, 1)  && canMoving;
      canMoveBack = Raycaster_CreateCube(playerParent, backObj, -1) && canMoving;
      canMoveLeft = Raycaster_CreateCube(playerParent, leftObj, -1) && canMoving;
      canMoveRight = Raycaster_CreateCube(playerParent, rightObj, 1) && canMoving;

      // console.log(" moveForward = " + this.moveForward + " canMoveForward = w" + canMoveForward );




      //

      raycaster.ray.origin.copy(playerParent.position);
      raycaster.ray.origin.y -= 0.01;
      // raycaster.ray.origin.y -= 10;
      // let intersections = raycaster.intersectObjects(scene.children, true);
      let intersections = raycaster.intersectObjects(_this.pointsParent.children, true);
      // console.log("角色检测地面",intersections);

      const onObject = intersections.length > 0;
      const delta = (time - prevTime) / 1000;
      velocity.y -= 9.8 * delta; // 100.0 = mass
      // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      if (onObject === true) {
        velocity.y = Math.max(0, velocity.y);
        if (!canJump) {
          canJump = true;
          jump = false;
        }
      } else {
        if (canJump) {
          canJump = false;
          jump = true;
        }
      }


      playerParent.position.y += (velocity.y * delta); // new behavior
      if (playerParent.position.y < 0) {
        velocity.y = 0;
        playerParent.position.y = 0;
        if (!canJump) {
          canJump = true;
          jump = false;
        }
      }
      prevTime = time;


      
    }

    function posToString(v) {
      return v.x + "  " + v.y + "  " + v.z;
    }
    var addEventListenered = false;

    this.dispose = function () {

      if (!addEventListenered) { return; }
      addEventListenered = false;

      console.log("移除操作响应");

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

    this.addEventListener = function () {
      if (addEventListenered) { return; }
      addEventListenered = true;

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

    this.addEventListener();
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJController };