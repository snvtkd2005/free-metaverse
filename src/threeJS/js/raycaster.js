import * as THREE from "three";
import {
  EventDispatcher,
} from 'three';


class YJRaycaster extends EventDispatcher {
  constructor(parent, scene, camera, domElement, clickHit, logToView, hoverHit,hotPointObject) {
    super();
    if (domElement === undefined) {

      console.warn('THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.');
      domElement = document;

    }

    // this.object = object;
    this.domElement = domElement;

    var mouse = new THREE.Vector2();

    var doOnce = 0;
    var moving = false;
    var inMoving = false;

    var clickMousePosX = 0;
    var clickMousePosY = 0;

    var targetPageX = 0;
    var targetPageY = 0;
    var raycaster = new THREE.Raycaster();

    var hit;
    this.HitModel = function () {

    };

    var pointPlane = null;
    var hoverObj;
    var canMovePos = new THREE.Vector3();
    var raycasterHoverray = new THREE.Raycaster();
    //鼠标实时位置的射线检测
    const raycasterHover = (pos) => {

      if (scene == null || scene.getObjectByName("pointsParent") == null) {
        return;
      }

      raycasterHoverray = new THREE.Raycaster();
      raycasterHoverray.setFromCamera(pos, camera);
      //只检测pointsParent物体的子物体
      // var intersects = raycasterHoverray.intersectObjects(scene.children, true);
      var intersects = raycasterHoverray.intersectObjects(scene.getObjectByName("pointsParent").children, true);

      if (intersects.length > 0) {
        hoverObj = intersects[0].object;
        // console.log("in raycasterHover " + hoverObj.name); 
        // SelectModel(hit);
        // YJdebug( " 鼠标 hover 模型 "+hit.name +"  pos = "+ V3ToString(GetModelWorldPosition(hit))  );

        hoverHit(hoverObj);
        if (hoverObj.name.indexOf("floor") > -1 || hoverObj.name.indexOf("Plane001") > -1) {
          // canMove = true;
          canMovePos = intersects[0].point;

          pointPlane.position.x = canMovePos.x;
          pointPlane.position.z = canMovePos.z;
          pointPlane.position.y = canMovePos.y + 0.01;
          pointPlane.visible = true;

          //YJdebug(intersects.length +"  "+hit.name + " 2222 "+ hit.tag + PrintVector3(canMovePos));

          // pointPlane.position.set( 0, 0, 0 );
          // pointPlane.lookAt( intersects[ 0 ].face.normal );
          // pointPlane.position.copy( intersects[ 0 ].point );
        } else {
          // canMove = false;
          pointPlane.visible = false;
        }
        //YJdebug(intersects.length +"  "+hit.name + " 2222 "+ hit.tag);
        //  }
      } else {
        // 
        // canMove = false;
        pointPlane.visible = false;
        if (hoverObj != null) {
          hoverObj = null;
          // hoverHit(hoverObj);
        }

        // UnSelectModel();
      }
    }

    const raycasterClick = (pos) => {
      // let { raycaster, scene,camera } = this;
      if(raycasterClickHotPoint(pos)){
        return;
      } 
      if (scene == null || scene.getObjectByName("pointsParent") == null) {
        return;
      }
      // console.log(  " in  raycaster Click"  );

      raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pos, camera);
      //只检测pointsParent物体的子物体
      var intersects = raycaster.intersectObjects(
        // scene.children,
        scene.getObjectByName("pointsParent").children,
        true
      );
      //var intersects = raycaster.intersectObject( scene.getObjectByName('pointsParent'));
      if (intersects.length > 0) {
        hit = intersects[0].object;
        clickHit(hit, intersects[0].point);

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
        clickHit(null);
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
    const raycasterClickHotPoint = (pos) => {
      if (scene == null || scene.getObjectByName("hotPointsParent") == null) {
        return false;
      }

      raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pos, camera);
      //只检测pointsParent物体的子物体
      var intersects = raycaster.intersectObjects(
        scene.getObjectByName("hotPointsParent").children,
        true
      );
      if (intersects.length > 0) {
        hit = intersects[0].object;
        hotPointObject(hit, intersects[0].point);
        return true;
      } else { 
        return false;
      }
    }


    var oldHitObjName = "";
    //双击模型居中
    function DoubleClickModel(object) {
      // console.log(" in 双击模型 ！！！！！！！！ ");
      parent.YJController.SetTarget(GetModelWorldPosition(object),GetBoundsSize(object));
    }
    //双击空白区域居中到所有模型中心
    this.DoubleClick_none = function() {
    //获取所有模型在一起的中心坐标.包裹盒的中心
      var center =parent.YJSceneModelCtrl.GetBoundsCenterPos();
      var pos =parent.YJSceneModelCtrl.GetBoundsBox();
      // console.log(" in 双击空白位置 ！！！！！！！！ ",center,pos);
      parent.YJController.SetTarget(center, SetCameraOffset(pos.min, pos.max));
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
      return -boxRound*0.01; 
    } 
    
    function CreateCube(pos){
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
          console.log(" ===== 双击模型 的位置    " + posToString(centroid) + "  ");
        }
      });
      return centroid;
    }
    function posToString(v) {
      return v.x + "  " + v.y + "  " + v.z;
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
      // console.log(  " targetPageX " + targetPageX + "   targetPageY " + targetPageY   );
      moving = true;
    }

    this.onMouseMove = function (event) {

      event.preventDefault();
      mouse.x = (event.clientX / domElement.clientWidth) * 2 - 1;
      mouse.y = - (event.clientY / domElement.clientHeight) * 2 + 1;
      raycasterHover(mouse);
      // logToView(" in Mouse move  " +mouse.x + " " + mouse.y );
      // console.log(" in Mouse move  " +mouse.x + " " + mouse.y );

    };

    this.onMouseUp = function (event) {

      moving = false;
      //鼠标点是否有位移，判断是否为滑动
      if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
        return;
      }
      raycasterClick(mouse);
    };

    this.onTouchStart = function (event) {

      var touch = event.touches[0];

      mouse.x = (Number(touch.pageX) / window.innerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / window.innerHeight) * 2 + 1;
      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;
    }
    this.onTouchMove = function (event) {

      var touch = event.touches[0];

      mouse.x = (Number(touch.pageX) / window.innerWidth) * 2 - 1;
      mouse.y = -(Number(touch.pageY) / window.innerHeight) * 2 + 1;
    }
    this.onTouchEnd = function (event) {
      //return;

      // event.preventDefault();
      // event.stopPropagation();
      // logToView(" in touch move  " + event.touches.length );
      // console.log(" in touch move  " + event.touches.length );

      //console.log(" in onMouseMove " + event.pageX+"  "+ oldPageX +"  "+(oldPageX == event.pageX && oldPageY == event.pageY) + " ");

      // if(oldPageX == touch.pageX && oldPageY == touch.pageY){

      // }else{
      //     this.lookSpeed = 0.1;
      // }
      // this.mouseX = -(touch.pageX - oldPageX)*0.001;
      // this.mouseY = -(touch.pageY - oldPageY)*0.001;

      // mouse.x = ( touch.pageX / domElement.clientWidth) * 2 - 1;
      // mouse.y = - (touch.pageY / domElement.clientHeight) * 2 + 1;
      // mouse.x  = touch.pageX;
      // mouse.y = touch.pageY ;

      // console.log(" in touch move  " + mouse.x  + " " +  mouse.y );
      // logToView(" in touch move  " + mouse.x + " " + mouse.y);
      //鼠标点是否有位移，判断是否为滑动
      if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
        return;
      }
      raycasterClick(mouse);
      pointPlane.visible = false;

      // this.mouseDragOn = false;

      // this.lookSpeed = 0;
      // doonce = 0;
      // effectiveFinger = 0;
      // if (doonce_touch > 0) {
      //   doonce_touch = 0;
      // }
    };
    //创建鼠标在地板上的光圈
    function CreateCheckPoint() {
      let size = 0.3;
      let planeGeometry = new THREE.PlaneGeometry(size, size); // 生成平面
      // let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // 材质
      var materialColor = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture("/checkPoint.png"),
        color: 0xffffff,
        transparent: true,
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
    // this.domElement.addEventListener('touchend', _onTouchEnd);
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