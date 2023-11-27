import * as THREE from "three";

//控制物体旋转
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';


class YJTransformController {
  constructor(scene, renderer, camera, _this, initCallback) {
    let scope = this;
    let transformController;

    InitTransformController();

    let axisData = {
      rota:{
        x:false,
        y:true,
        z:false,
      }
    }
    this.SetRotaAxis = function(bx,by,bz){
      axisData.rota = {x:bx,y:by,z:bz};
    }
    // 创建 transform 控制器
    function InitTransformController() {
      transformController = new TransformControls(camera, renderer.domElement);
      // transformController.addEventListener( 'change', render );
      transformController.addEventListener('dragging-changed', function (event) {
        if(_this.YJController){
          _this.YJController.enabled = !event.value;
        }
        // console.log("正在拖拽 ",event);
        // console.log("正在拖拽 ",selectMesh.owner);
        console.log("正在拖拽 ",selectMesh.position);
        console.log("正在拖拽 ",selectMesh.rotation);
        // event.value true:开始   false:结束
        if(event.value && selectMesh.owner.isYJTransform){
          if(selectMesh.owner.GetComponent("NPC")){
            selectMesh.owner.GetComponent("NPC").UpdateNavPos('停止巡逻');
          }
        }
      });

      transformController.name = "ignoreRaycast";
      let control = transformController;
      control.setSpace('local');
      window.addEventListener('keydown', function (event) {
        switch (event.keyCode) {

          case 81: // Q
            // control.setSpace( control.space === 'local' ? 'world' : 'local' );
            break;

          case 16: // Shift
            // control.setTranslationSnap( 100 );
            // control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
            // control.setScaleSnap( 0.25 );
            break;

          case 87: // W
            control.setMode('translate');

            control.showY = true;
            control.showX = true;
            control.showZ = true;
            break;

          case 69: // E
            control.setMode('rotate');

            //旋转Y
            control.showY = true;
            control.showX = axisData.rota.x;
            control.showZ = axisData.rota.z;
            // control.showX = false;
            // control.showZ = false;
            break;

          case 82: // R
            control.setMode( 'scale' );
            control.showY = true;
            control.showX = true;
            control.showZ = true;
            break;

          case 67: // C 
            break;

          case 86: // V
            // const randomFoV = Math.random() + 0.1;
            // const randomZoom = Math.random() + 0.1;

            // cameraPersp.fov = randomFoV * 160;
            // cameraOrtho.bottom = - randomFoV * 500;
            // cameraOrtho.top = randomFoV * 500;

            // cameraPersp.zoom = randomZoom * 5;
            // cameraOrtho.zoom = randomZoom * 5;
            // onWindowResize();
            break;

          case 187:
          case 107: // +, =, num+
            // control.setSize( control.size + 0.1 );
            break;

          case 189:
          case 109: // -, _, num-
            // control.setSize( Math.max( control.size - 0.1, 0.1 ) );
            break;

          case 88: // X
            // control.showX = ! control.showX;
            break;

          case 89: // Y
            // control.showY = ! control.showY;
            break;

          case 90: // Z
            // control.showZ = ! control.showZ;
            break;

          case 32: // Spacebar
            // control.enabled = ! control.enabled;
            break;

          case 27: // Esc
            // control.reset();
            break;

        }

      });
      window.addEventListener('mousedown', function (event) {
        switch (event.button) {
          //鼠标左键
          case THREE.MOUSE.LEFT:
            break;
          case THREE.MOUSE.MIDDLE:
            break;

          //鼠标右键
          case THREE.MOUSE.RIGHT:
            // detachFn();
            break;
        }

      });
      scene.add(transformController);
      transformController.visible = false;
    }

    let selectMesh = null;
    this.attach = function (mesh) {
      transformController.attach(mesh);
      selectMesh = mesh;
    }
    this.detach = function () {
      detachFn();
    }
    function detachFn() {
      if(selectMesh==null){return;}
      transformController.detach();
      selectMesh = null;
      transformController.visible = false;

    }


    //#region 
    //#endregion


  }
}

export { YJTransformController };