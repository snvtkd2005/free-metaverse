import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';

import { YJLoadAvatar } from "./YJLoadAvatar.js";

import { GetPathFolders, LoadFile } from "/@/utils/api.js";

// 小地图

class YJMinMap {
  constructor(_this, sceneManager, callback) {
    var scope = this;

    // 是否为调整小地图状态。编辑时，设为true
    let editor = false;
    let planePos=null;
    let minMapData=null;

    // 创建小地图面片
    function CreateMinMapPanel() {
      minMapData = _this.$parent.GetMinMapData();
      offset = minMapData.minMapOffset;
      scale = minMapData.minMapScale;

      if(_this.$parent.isMobile){
        planePos = minMapData.minMapPlaneMobilePos;
      }else{
        planePos = minMapData.minMapPlanePos;
      }

      editor = _this.$parent.avatarData.setting.inMinMapEditor;
      


      let size = { x: 1.024, y: 0.512 };
      let sizeScale = 0.5;
      // 创建网格，并赋予小地图贴图
      let planeGeometry = new THREE.PlaneGeometry(size.x * sizeScale, size.y * sizeScale, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
        // opacity:0.5,
      }); // 材质
      const map = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + minMapData.minMapUrl
      );
      planeMaterial.map = map;
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      let cam = _this.YJController.GetCam();
      cam.add(plane); // 向该场景中添加物体

      plane.rotation.set(Math.PI, Math.PI, Math.PI);

      if (editor) {
        plane.position.set(-0, -0.35, -1);
        let sizep = 2;
        plane.scale.set(sizep, sizep, sizep);
        planeMaterial.opacity = 0.8;
      } else {


        plane.position.set(planePos.x,planePos.y,planePos.z);
        // plane.position.set(-1, -0.45, -1); 
        planeMaterial.opacity = 1;

        let sizep = 0.7;
        plane.scale.set(sizep, sizep, 1);

        // plane.rotation.set(0,0,0.3);

      }


      let quat = plane.getWorldQuaternion(new THREE.Quaternion());
      // scene.add(plane); // 向该场景中添加物体
      // 始终在屏幕下方
      console.log("-------创建小地图完成--------");
      CreateMinMapIcon(plane, quat);
    }
    let playerIconGroup = null;
    // 创建角色位置小图标
    function CreateMinMapIcon(parent, quat) {

      playerIconGroup = new THREE.Group();
      parent.add(playerIconGroup); // 向该场景中添加物体


      let size = { x: 0.499, y: 0.696 };
      let sizeScale = 0.1;
      // 创建网格，并赋予小地图贴图
      let planeGeometry = new THREE.PlaneGeometry(size.x * sizeScale, size.y * sizeScale, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
        alphaTest: true,
      }); // 材质
      const map = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + minMapData.minMapPointUrl  
      );

      planeMaterial.map = map;
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);


      playerIconGroup.add(plane); // 向该场景中添加物体
      plane.rotation.set(Math.PI, Math.PI, Math.PI);
      // plane.rotation.set(Math.PI, Math.PI, Math.PI - 0.3);



      plane.position.set(0, size.y * sizeScale / 2, 0.0001);
    }
    
    let scale = { x: 0.0024, y: 0.0024 };
    let offset = { x: 0, y: 0 }; //新场景
    this.SetScale = function (x, y) {
      scale.x = x;
      scale.y = y;
    }
    this.SetOffset = function (x, y) {
      offset.x = x;
      offset.y = y;
    }
    // 接收角色位置，设置小图标位置
    function UpdateIconPos(pos) {
      let x = pos.x * scale.x + offset.x;
      let y = pos.z * scale.y + offset.y;

      // console.log(" in UpdateIconPos " ,scale,offset);
      playerIconGroup.position.set(x, -y, 0);
    }

    function Init() {
      // console.log(sceneManager);
      CreateMinMapPanel();
    }


    //#region 
    //#endregion


    Init();
    // update();
    var updateId = null;
    this._update = function () {
      let pos = _this.YJController.GetPlayerWorldPos();
      UpdateIconPos(pos);
    }
    function update() {
      updateId = requestAnimationFrame(update);
      // let pos = scope.GetCameraWorldPoss();
      let pos = _this.YJController.GetPlayerWorldPos();
      UpdateIconPos(pos);
    }
  }
}

function contextmenu(event) {
  event.preventDefault();
}

export { YJMinMap };