




import * as THREE from "three";
import { YJEvent } from "./YJEvent";

class YJRaycaster extends YJEvent {
  constructor(_this, scene, camera, domElement, clickHit,
    hoverHit, hotPointObject, rightMouseUpCallback, hitInstancedMesh) {
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
    var raycaster = new THREE.Raycaster();
    var hit;
    this.CallClick = function () {
      raycasterClick(mouse);
    };

    var pointPlane = null;
    var hoverObj;
    var canMovePos = new THREE.Vector3();
    var raycasterHoverray = new THREE.Raycaster();
    var laterHiddenPoint = null;


    let oldHotObj = null;
    let oldHoverObj = null;

    let offset = {
      left:0,
      top:0,
    }
    this.getOffset = function(){
      return offset;
    }
    
    this.SetOffset = function(left,top){
      offset.left = left;
      offset.top = top; 
      // console.log(" 设置3d画面偏移 ", offset);
    }
    let containerWidth = window.innerWidth;
    let containerHeight = window.innerHeight;
    this.SetContainerSize = function(w,h){
      containerWidth = w;
      containerHeight = h;
    }
    let eventHandlers = [];
    this.addEventListener = function(e,event){
      eventHandlers.push({eventName:e,event:event});
      // super.addEvent(e,event); 
    }
    function EventHandler(e,value,value2){
      if(e=="hover"){
        hoverHit(value,value2);
      }
      for (let i = 0; i < eventHandlers.length; i++) {
        const item = eventHandlers[i];
        if(item.eventName == e){
          if(item.event){
            item.event(value,value2);
          }
        }
      }
      // super.applyEvent(e,value,value2); 

    }
    //鼠标实时位置的射线检测
    const raycasterHover = (pos) => {
      // hover会实时检测scene所有子物体, 影响性能导致卡顿，先关闭
      // return;

      if (scene == null || _this._YJSceneManager.GetHoverCollider().length == 0) {
        return;
      }

      // 悬浮热点 
      raycaster.setFromCamera(pos, camera); 
      let intersects = null;
      try {
        
        //只检测pointsParent物体的子物体
        intersects = raycaster.intersectObjects(
          _this._YJSceneManager.GetHoverCollider(),
          true
        );
      } catch (error) {
        console.log(error);
        return;
      }
      if(intersects==null){return;} 

      if (intersects.length > 0) {
 
        hoverObj = GetAcitveObjectFromIntersects(intersects);
        if (hoverObj == null) { 
          EventHandler('hover',null);
          return;
        }
        EventHandler('hover',hoverObj, intersects[hitIndex].point); 

        oldHoverObj = hoverObj;
        return true;
      } else {
        oldHoverObj = null;
        EventHandler('hover',null);
        return false;
      }
    }
 

    let hitIndex = 0;

    const raycasterClick = (pos) => {
      // console.log(  " in  raycaster Click"  );



      if (raycasterClickHotPoint(pos)) {
        clickCallback(null);
        return;
      }

      if (scene == null || scene.getObjectByName("pointsParent") == null) {
        clickCallback(null);
        return;
      }

      // console.log(  " in  raycaster Click 点击热点 "  );

      raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pos, camera);


      let intersects = null;
      try {
        
        //只检测pointsParent物体的子物体
        intersects = raycaster.intersectObjects(
          scene.children,
          true
        );
      } catch (error) {
        console.log(error);
        return;
      }
      if(intersects==null){return;}

      // console.log("intersects ",intersects);
      //var intersects = raycaster.intersectObject( scene.getObjectByName('pointsParent'));
      if (intersects.length > 0) {

        hit = GetAcitveObjectFromIntersects(intersects);
        if (hit == null) {
          clickCallback(null);
          return;
        }
        // console.log("hit",hit);

        if (hit.isInstancedMesh) {
          intersects = raycaster.intersectObject(hit);
          if (intersects.length > 0) {
            const instanceId = intersects[0].instanceId;
            // console.log("点击 instance mesh ", hit,instanceId);
            if (hitInstancedMesh) {
              hitInstancedMesh(hit.owner, instanceId);
            }
          }
          return;
        }
        clickCallback(hit, intersects[hitIndex].point);

        //判断是否双击
        if (oldHitObjName == hit.name && doubleClickTime < 0.5) {
          //双击模型
          DoubleClickModel(hit);
        } else {
          doubleClickTime = 0;
        }
        oldHitObjName = hit.name;
        return;
      } else {
        // console.log(" 未点击到任何模型 ");

        clickCallback(null);
        //判断是否双击。 
        if (doubleClickTime < 0.5) {
          //双击空白位置
          this.DoubleClick_none();
          //
        } else {
          doubleClickTime = 0;
        }
      }

    }
    function GetAcitveObjectFromIntersects(intersects) {
      for (let i = 0; i < intersects.length; i++) {
        const element = intersects[i].object;
        // console.log("点击筛选",element); 
        if (element.visible == false) { continue; }
        if (element.name == "ignoreRaycast") { continue; } 
        if (element.tag == "ignoreRaycast") { continue; }
        if (element.name == "trigger") { continue; }
        if (element.tag == "helper") { continue; }
        if (element.type == "GridHelper") { continue; }
        if (element.type == "LineSegments") { continue; } 
        if (element.type == "AxesHelper") { continue; } 
        if (element.isIgnore) { continue; }
        if (element.type == "TransformControlsPlane") { continue; }
        if (element.parent.parent && element.parent.parent.isTransformControlsGizmo) { continue; }
        hitIndex = i;
        return element;
      }
      return null;
    }

    function clickCallback(hit, point) {
      if (state == STATE.ROTATE) {
        if (hit == null) {
          clickHit(null);
          return;
        }
        clickHit(hit, point);
        return;
      }
      if (state == STATE.PAN) {
        if (hit == null) {
          rightMouseUpCallback(null);
          return;
        }
        rightMouseUpCallback(hit, point);
        return;
      }
    }
    const raycasterClickHotPoint = (pos) => {
      // if (scene == null || scene.getObjectByName("hotPointsParent") == null) {
      //   return false;
      // }

      raycaster = new THREE.Raycaster();

      raycaster.setFromCamera(pos, camera);
      // console.log("可点击模型列表为 " ,  _this.canHitModelList);
      let intersects = null;
      try {
        
        //只检测pointsParent物体的子物体
        intersects = raycaster.intersectObjects(
          _this.canHitModelList,
          true
        );
      } catch (error) {
        console.log(error);
        return;
      }
      if(intersects==null){return;}




      if (intersects.length > 0) {
        hit = intersects[0].object;

        clickCallback(hit, intersects[0].point);
        // hotPointObject(hit, intersects[0].point);
        oldHotObj = hit;
        return true;
      } else {
        oldHotObj = null;
        return false;
      }
    }


    var oldHitObjName = "";
    //双击模型居中
    function DoubleClickModel(object) {
      return;

      // console.log(" in 双击模型 ！！！！！！！！ ");
      _this.YJController.SetTarget(GetModelWorldPosition(object), GetBoundsSize(object));
    }
    //双击空白区域居中到所有模型中心
    this.DoubleClick_none = function () {

      return;

      //获取所有模型在一起的中心坐标.包裹盒的中心
      var center = _this.YJSceneModelCtrl.GetBoundsCenterPos();
      var pos = _this.YJSceneModelCtrl.GetBoundsBox();
      console.log(" in 双击空白位置 ！！！！！！！！ ", center, pos);
      _this.YJController.SetTarget(center, SetCameraOffset(pos.min, pos.max));
    }
    //获取模型的大小，根据大小设置摄像机相对模型的位置。设置摄像机的远近
    function GetBoundsSize(object) {
      var geometry = object.geometry;
      geometry.computeBoundingBox();

      //包裹盒的中心
      var minPos = geometry.boundingBox.min;
      var maxPos = geometry.boundingBox.max;

      return SetCameraOffset(minPos, maxPos);
    }
    function SetCameraOffset(minPos, maxPos) {
      var boxRound = ToDistance(minPos, maxPos);
      // console.log("两个点的距离为 " + boxRound);
      return -boxRound * 0.01;
    }

    function CreateCube(pos) {
      let size = 0.1;
      let cubeGeometry = new THREE.BoxGeometry(size, size, size);
      let cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        opacity: 1,
        transparent: true
      });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.copy(pos);
      scene.add(cube);
    }
    function ToDistance(v1, v2) {

      var x1, y1, z1, x2, y2, z2;
      x1 = v1.x;
      y1 = v1.y;
      z1 = v1.z;

      x2 = v2.x;
      y2 = v2.y;
      z2 = v2.z;

      return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
    }
    //通过模型的包裹盒计算模型的世界坐标
    function GetModelWorldPosition(object) {
      var centroid = new THREE.Vector3();

      object.traverse(function (item) {
        if (item instanceof THREE.Mesh) {

          //获取模型的世界坐标
          var geometry = object.geometry;
          geometry.computeBoundingBox();
          centroid.addVectors(geometry.boundingBox.min, geometry.boundingBox.max);
          centroid.multiplyScalar(0.5);
          centroid.applyMatrix4(item.matrixWorld);
          // console.log(" ===== 双击模型 的位置    " + posToString(centroid) + "  ");
        }
      });
      return centroid;
    }
    function posToString(v) {
      return v.x + "  " + v.y + "  " + v.z;
    }

    this.SetMouseDown = function (b) {
      mouseDown = b;
    }

    this.onMouseDown = function (event) {
      event.preventDefault();
      UpdateMousePos(event); 
      
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
          EventHandler("onmousedown");
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

    let hoverTimes = 0;
    let laterCastHover = null;
    function UpdateMousePos(event){ 
      // mouse.x = (event.clientX / containerWidth) * 2 - 1;
      // mouse.y = -(event.clientY / containerHeight) * 2 + 1;
      
      mouse.x = ((event.clientX-offset.left) / containerWidth) * 2 - 1;
      mouse.y = -((event.clientY-offset.top) / containerHeight) * 2 + 1;

      EventHandler("mousePos",mouse.x,mouse.y);
    }
    this.onMouseMove = function (event) {

      // return;

      event.preventDefault();
      UpdateMousePos(event); 
      raycasterHover(mouse);

      // if (mouseDown) {
      //   raycasterHover(mouse);
      // }
      // if(laterCastHover != null){
      //   clearTimeout(laterCastHover);
      // }
      // laterCastHover = setTimeout(() => {
      //   raycasterHover(mouse);
      // }, 100);

      // console.log(" in event client    " +event.clientX + " " + event.clientY  );
      // console.log(" in Mouse move  " +mouse.x + " " + mouse.y );
      // console.log(" in Mouse move" ," x = " + mouse.x + " y = " +mouse.y );

    };

    // setInterval(() => {
    //   raycasterHover(mouse);
    // }, 100);

    this.onMouseUp = function (event) {
      // console.log(" 抬起鼠标，点击热点 111 ");

      mouseDown = false;

      // console.log(" mouse down " ," x = " +clickMousePosX + " y = " +clickMousePosY );

      UpdateMousePos(event); 
      // console.log(" mouse up " ," x = " + mouse.x + " y = " +mouse.y );
      oldHoverObj = null;
      EventHandler("onmouseup");

      //鼠标点是否有位移，判断是否为滑动
      if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
        return;
      }

      if (forcedLandscape) {
        let xx = mouse.x;
        mouse.x = -mouse.y;
        mouse.y = xx;
      }

      // console.log(" 抬起鼠标，点击热点 222 ");
      switch (state) {

        case STATE.ROTATE:
          raycasterClick(mouse); 
          EventHandler("leftmouseclick",mouse.x,mouse.y);
          break;

        case STATE.DOLLY:
          break;
        case STATE.PAN:
          //鼠标右键点击
          raycasterClick(mouse);
          break;

      }
      state = STATE.NONE;

    };

    this.onTouchStart = function (event) {

      var touch = event.touches[0];
      // console.log(" onTouchStart " , touch );

      mouse.x = (Number(touch.pageX) / containerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / containerHeight) * 2 + 1;
      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;

      mouseDown = true;
    }
    this.onTouchMove = function (event) {

      var touch = event.touches[0];

      mouse.x = (Number(touch.pageX) / containerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / containerHeight) * 2 + 1;
      // if (mouseDown) {
      //   raycasterHover(mouse);
      // }
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

      mouse.x = (Number(touch.pageX) / containerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / containerHeight) * 2 + 1;

      // console.log(" touch end " ," x = " + mouse.x + " y = " +mouse.y );

      // return;
      //鼠标点是否有位移，判断是否为滑动
      // if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
      //   return;
      // }

      oldHoverObj = null;

      if (Math.abs(clickMousePosX - mouse.x) > 0.1 || Math.abs(clickMousePosY - mouse.y) > 0.1) {
        return;
      }
      // console.log(" touch end " ," x = " + mouse.x + " y = " +mouse.y );

      if (forcedLandscape) {
        let xx = mouse.x;
        mouse.x = -mouse.y;
        mouse.y = xx;
      }

      // console.log(" touch end 222 " ," x = " + mouse.x + " y = " +mouse.y );

      raycasterClick(mouse);
      // pointPlane.visible = false;

    };
    //创建鼠标在地板上的光圈
    function CreateCheckPoint() {
      let size = 0.3;
      let planeGeometry = new THREE.PlaneGeometry(size, size); // 生成平面
      // let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // 材质
      var materialColor = new THREE.MeshBasicMaterial({
        // map: THREE.ImageUtils.loadTexture("/checkPoint.png"),
        // map: new THREE.TextureLoader().load("/checkPoint.png"),

        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthTest: true
      });

      pointPlane = new THREE.Mesh(planeGeometry, materialColor);
      pointPlane.rotation.x = -0.5 * Math.PI;
      pointPlane.position.x = 0;
      pointPlane.position.y = 0;
      pointPlane.position.z = 0;
      // pointPlane.name = "floor";
      scene.add(pointPlane); // 向该场景中添加物体
      pointPlane.visible = false;

    }
    CreateCheckPoint();

    var doubleClickTime = 0;
    var clock = new THREE.Clock();//时间跟踪

    //计时
    function CameraControllUpdate() {

      doubleClickTime += clock.getDelta();

      // console.log("doubleClickTime = " + doubleClickTime);
      requestAnimationFrame(CameraControllUpdate);
    }
    CameraControllUpdate();

    this.dispose = function () {

      this.domElement.removeEventListener('contextmenu', contextmenu);
      this.domElement.removeEventListener('mousedown', _onMouseDown);
      this.domElement.removeEventListener('mousemove', _onMouseMove);
      this.domElement.removeEventListener('mouseup', _onMouseUp);

      this.domElement.removeEventListener('touchstart', _onTouchStart, false);
      this.domElement.removeEventListener('touchend', _onTouchEnd, false);
      this.domElement.removeEventListener('touchmove', _onTouchMove, false);

      // window.removeEventListener('keydown', _onKeyDown);
      // window.removeEventListener('keyup', _onKeyUp);

    };


    const _onMouseMove = this.onMouseMove.bind(this);
    const _onMouseDown = this.onMouseDown.bind(this);
    const _onMouseUp = this.onMouseUp.bind(this);

    // const _onKeyDown = this.onKeyDown.bind(this);
    // const _onKeyUp = this.onKeyUp.bind(this);


    const _onTouchStart = this.onTouchStart.bind(this);
    const _onTouchEnd = this.onTouchEnd.bind(this);
    const _onTouchMove = this.onTouchMove.bind(this);

    this.domElement.addEventListener('contextmenu', contextmenu);
    this.domElement.addEventListener('mousemove', _onMouseMove);
    this.domElement.addEventListener('mousedown', _onMouseDown);
    this.domElement.addEventListener('mouseup', _onMouseUp);

    this.domElement.addEventListener('touchstart', _onTouchStart, false);
    this.domElement.addEventListener('touchend', _onTouchEnd, false);
    this.domElement.addEventListener('touchmove', _onTouchMove, false);

    // window.addEventListener('keydown', _onKeyDown);
    // window.addEventListener('keyup', _onKeyUp);
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJRaycaster };