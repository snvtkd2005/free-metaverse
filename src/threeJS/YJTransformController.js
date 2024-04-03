import * as THREE from "three";
import { Color } from "three";

//控制物体旋转
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';



class YJTransformController {
  constructor(scene, renderer, camera, _this, initCallback) {
    let scope = this;
    let selectMesh = null;
    let transformController;
 
    let axisData = {
      rota: {
        x: true,
        y: true,
        z: true,
      }
    }
    
    this.getUsing = function(){ 
      return selectMesh;
    } 
    this.getMode = function(){
      return transformController.getMode();
    } 
    // Color.lerpColors();
    // 使用射线检测的坐标设置模型位置
    let userRaycast = false;
    this.SetRotaAxis = function (bx, by, bz) {
      axisData.rota = { x: bx, y: by, z: bz };
    }
    // 创建 transform 控制器
    function InitTransformController() {
      if (_this.YJRaycaster) {
        _this.YJRaycaster.addEventListener('hover', (hoverObj, point) => {
          if (!userRaycast || !selectMesh || !point) {
            return;
          }
          console.log(point);
          selectMesh.position.copy(point);
        });
      }

      transformController = new TransformControls(camera, renderer.domElement);

      // transformController.addEventListener( 'change', render );
      transformController.addEventListener('dragging-changed', function (event) {
        if (_this.YJController) {
          _this.YJController.enabled = !event.value;
        }
        // console.log("正在拖拽 ",event);

        // console.log("正在拖拽 ",selectMesh.owner);
        // console.log("正在拖拽 ",selectMesh.position);
        console.log("正在拖拽 ",selectMesh.rotation);
        // event.value true:开始   false:结束
        if (event.value && selectMesh.owner && selectMesh.owner.isYJTransform) {
          selectMesh.owner.DragStart();
        }
        if (!event.value && selectMesh.owner && selectMesh.owner.isYJTransform) {
          // console.log("拖拽结束");
          selectMesh.owner.DragEnd();
        }
      });

      transformController.addEventListener('change', function (event) {
        if (selectMesh && selectMesh.owner &&  selectMesh.owner.isYJTransform) {
          // console.log("正在拖拽 ",selectMesh.position); 
          selectMesh.owner.DragEnd();
        }

      });

      transformController.name = "ignoreRaycast"; 
      transformController.setSpace('local');
      
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
    this.onKeyDown = function(event){
      // console.log(event);
      switch (event.keyCode) {

        case 81: // Q
          userRaycast = true;
          // control.setSpace( control.space === 'local' ? 'world' : 'local' );
          break;

        case 16: // Shift
          // control.setTranslationSnap( 100 );
          // control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
          // control.setScaleSnap( 0.25 );
          break;

        case 87: // W
          transformController.setMode('translate');

          transformController.showY = true;
          transformController.showX = true;
          transformController.showZ = true;
          break;

        case 69: // E
          transformController.setMode('rotate');

          //旋转Y
          transformController.showY = true;
          transformController.showX = axisData.rota.x;
          transformController.showZ = axisData.rota.z;
          // control.showX = false;
          // control.showZ = false;
          break;
        case 70: // F
          //
          console.log(" click F ");
          _Global.YJ3D._YJSceneManager.SetPlayerPos(selectMesh.position.clone());
          break;
        case 82: // R
          transformController.setMode('scale');
          transformController.showY = true;
          transformController.showX = true;
          transformController.showZ = true;
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
          
          _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().GaneriateFromClipboard();

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
    }

    this.onKeyUp = function(event){
      switch (event.code) {
        case 'KeyQ':
          userRaycast = false;
          break;  
      }
    }
    this.attach = function (mesh) {
      transformController.attach(mesh);
      selectMesh = mesh;
      selectMesh.traverse((item) => {
        item.isIgnore = true;
      });
      _Global.SetEnableGravity(false);
    }
    this.detach = function () {
      detachFn();
    }
    function detachFn() {
      if (selectMesh == null) { return; }
      transformController.detach();
      selectMesh.traverse((item) => {
        item.isIgnore = undefined;
      });
      selectMesh = null;
      transformController.visible = false;
      _Global.SetEnableGravity(true);

    } 
    InitTransformController();  

  }
}

export { YJTransformController };