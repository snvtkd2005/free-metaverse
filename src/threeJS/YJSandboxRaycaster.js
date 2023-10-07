import * as THREE from "three";
import {
  EventDispatcher,
} from 'three';


class YJSandboxRaycaster extends EventDispatcher {
  constructor(scene, camera,domElement,parent, addHit,removeHit) {
    super();
   
    var scope = this;
    // Mouse buttons
    this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };
    var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };
    var state = STATE.NONE;

    this.domElement = domElement;

    var clickMousePosX = 0;
    var clickMousePosY = 0;
    var mouse = new THREE.Vector2();
 
    var raycaster = new THREE.Raycaster();


    var pointPlane = null;
    var hoverObj;
     

    let oldHotObj = null;
    let laterHiddenPoint = null;
    //鼠标实时位置的射线检测
    const raycasterHover = (pos) => {
  
      raycaster.setFromCamera(pos, camera);
      //只检测pointsParent物体的子物体
      var intersects = raycaster.intersectObjects(parent.children, true);

      if (intersects.length > 0) {
        hoverObj = intersects[0].object;
        // console.log("in raycasterHover " + hoverObj.name); 
        // SelectModel(hit);
        // YJdebug( " 鼠标 hover 模型 "+hit.name +"  pos = "+ V3ToString(GetModelWorldPosition(hit))  );
        // return;
        // hoverHit(hoverObj, intersects[0].point);

        // pointPlane.position.copy( intersects[0].point ).add( intersects[0].face.normal );
        let canMovePos = hoverObj.getWorldPosition(new THREE.Vector3());
        // let canMoveRota = hoverObj.getWorldDirection(new THREE.Vector3(0,0,0));

        // console.log(intersects[0].face.normal);
        let normal = intersects[0].face.normal ;
        normal.x *= 0.51;
        normal.y *= 0.51;
        normal.z *= 0.51;
        
        // normal.x *= canMoveRota.x;
        // normal.y *= canMoveRota.y;
        // normal.z *= canMoveRota.z;

        pointPlane.position.copy(canMovePos).add(normal);
        // pointPlane.position.copy(canMovePos).add( intersects[0].face.normal);
        // pointPlane.position.copy(canMovePos).add( intersects[0].face.normal*0.51 );
        pointPlane.lookAt(canMovePos);
        // pointPlane.position.copy(canMovePos);  

        // var normal = intersects[0].face.normal;// 当前位置曲面法线
        // pointPlane.translateOnAxis(intersects[0].face.normal,0.51);

        // pointPlane.position.x = canMovePos.x;
        // pointPlane.position.z = canMovePos.z;
        // pointPlane.position.y = canMovePos.y + 0.01;
        pointPlane.visible = true;

        if (laterHiddenPoint != null) {
          clearTimeout(laterHiddenPoint);
        }
        laterHiddenPoint = setTimeout(() => {
          pointPlane.visible = false;
        }, 2000);

      } else {
        
        pointPlane.visible = false;
        if (hoverObj != null) {
          hoverObj = null;
          // hoverHit(hoverObj);
        } 
      }
    }

    const raycasterClick = (pos) => {
      // console.log(  " in  raycaster Click"  );
      raycaster.setFromCamera(pos, camera);
      //只检测pointsParent物体的子物体
      var intersects = raycaster.intersectObjects(parent.children, true);

      if (intersects.length > 0) {
        hoverObj = intersects[0].object;
       
        let canMovePos = hoverObj.getWorldPosition(new THREE.Vector3());
        let normal = intersects[0].face.normal;
        pointPlane.position.copy(canMovePos).add(normal);
        pointPlane.lookAt(canMovePos);

        if(state == STATE.ROTATE){
          if(addHit){
            addHit(pointPlane.position.clone(),hoverObj);
            pointPlane.visible = false;
            return;
          }
        }
        if(state == STATE.PAN){
          if(removeHit){
            removeHit(hoverObj);
            pointPlane.visible = false;
            hoverObj = null;
            return;
          }
        }
        pointPlane.visible = true;

      } else {
        
        pointPlane.visible = false;
        if (hoverObj != null) {
          hoverObj = null;
          // hoverHit(hoverObj);
        } 
      }
 

    }
 
    this.onMouseDown = function (event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;


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
 
      mouse.x = (event.clientX / domElement.clientWidth) * 2 - 1;
      mouse.y = - (event.clientY / domElement.clientHeight) * 2 + 1;

      //鼠标点是否有位移，判断是否为滑动
      if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
        return;
      }

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
      raycasterClick(mouse);
      state = STATE.NONE;
      
      // raycasterClickHotPoint(mouse);
 
    };
 
    let pointMat = null;
    //创建鼠标在地板上的光圈
    function CreateCheckPoint() {
      let size = 1.0;
      let planeGeometry = new THREE.PlaneGeometry(size, size); // 生成平面
      pointMat = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("/checkPoint.png"),
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
        side:THREE.DoubleSide,
        depthTest: true
      });

      pointPlane = new THREE.Mesh(planeGeometry, pointMat);
      pointPlane.rotation.x = -0.5 * Math.PI;
      pointPlane.position.x = 0;
      pointPlane.position.y = 0;
      pointPlane.position.z = 0;
      scene.add(pointPlane); // 向该场景中添加物体
      pointPlane.visible = false;

    }
    CreateCheckPoint();

    this.dispose = function () {
      this.domElement.removeEventListener('mousedown', _onMouseDown);
      this.domElement.removeEventListener('mousemove', _onMouseMove);
      this.domElement.removeEventListener('mouseup', _onMouseUp);
      this.domElement.removeEventListener('contextmenu', contextmenu);
    };

    const _onMouseMove = this.onMouseMove.bind(this);
    const _onMouseDown = this.onMouseDown.bind(this);
    const _onMouseUp = this.onMouseUp.bind(this);
 
    this.domElement.addEventListener('contextmenu', contextmenu);

    this.domElement.addEventListener('mousemove', _onMouseMove);
    this.domElement.addEventListener('mousedown', _onMouseDown);
    this.domElement.addEventListener('mouseup', _onMouseUp);
  
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJSandboxRaycaster };