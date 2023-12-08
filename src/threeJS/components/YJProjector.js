import * as THREE from "three";

import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { checkV3Equel } from '/@/utils/utils_threejs.js';


// 投影
// 制作选中角色脚下的光圈

class YJProjector {
  constructor(_this, scene, modelParent, size) {
    var scope = this;

    //初始化 
    let camera = null;
    let group = null;
    var model = null;

    function Init() {
      group = new THREE.Group();
      parent.add(group);
      group.visible = false;

      CreatePlane(); return;

      let width = 300;
      let height = 300;


      const map = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + "checkPoint.png"
      );

      // let cubeRenderTarget = new THREE.WebGLRenderer(256);
      // cubeRenderTarget.texture.type = THREE.HalfFloatType;
      // camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000,cubeRenderTarget);

      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
      camera = new THREE.CubeCamera(0.05, 50, cubeRenderTarget);

      group.add(camera);
      camera.position.set(0, 3, 0);
      camera.rotation.set(-Math.PI / 2, 0, 0);
      let projectMat = new THREE.MeshBasicMaterial({
        // map:  cubeRenderTarget.texture,
        map: map,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5,
      });

      update();
    }

    let scaleByHeight = 0.8; //光圈大小随高度变化的比例
    // 在选中npc、其他玩家下，生成光圈
    this.Active = (parent, height, camp) => {
      if (group == null) {
        group = new THREE.Group();
        CreatePlane();
      }
      if (group.children.length == 0) {
        CreatePlane();
      }
      // console.log(group);
      parent.add(group);
      group.scale.set(height * scaleByHeight, 0.02, height * scaleByHeight);
      group.position.set(0, 0.02, 0);

      switch (camp) {
        case 'enmity':
          camp = 0xff0000;
          break;
        case 'normal':
          camp = 0x0000ff;
          break;
        case 'dead':
          camp = 0xaaaaaa;
          break; 
        default: 
      }
      projectMat.color.setHex(camp);
      group.visible = true;
    }
    this.SetActive = (b) => {
      if (group == null) {
        return;
      }
      group.visible = b;
      scene.add(group); 
    }
    let projectMat = null;
    function CreatePlane() {

      const map = new THREE.TextureLoader().load(
        _this.GetPublicUrl() + "checkPoint.png"
      );
      projectMat = new THREE.MeshBasicMaterial({
        map: map,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
        emissiveMap: map,
        emissiveIntensity: 2,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: - 4,
      });

      let size = 1;
      // size *= 0.5;
      let go = new THREE.PlaneGeometry(size, size);
      let projectPlane = new THREE.Mesh(go, projectMat);
      group.add(projectPlane);
      projectPlane.rotation.set(-Math.PI / 2, 0, 0);
      projectPlane.position.set(0, 0.0, 0);

    }


    let decals = [];


    const decalMaterial = new THREE.MeshBasicMaterial({
      map: _this._YJSceneManager.checkLoadTexture(_this.GetPublicUrl() + "checkPoint.png"),
      transparent: true,
      color: 0x00ffff,
      opacity: 0.5,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: - 4,
      wireframe: false
    });

    let decalMesh = null;
    // 生成贴花
    function GenerateDecal(baseMesh) {
      // console.log(" 生成脚底光圈 ==============");


      let position = (intersection.point.clone());
      position.y += 0.1;
      let origin = (mouseHelper.rotation.clone());
      origin.x = -Math.PI / 2;
      origin.y = 0;
      origin.z = 0;
      let size = new THREE.Vector3(1, 1, 1);

      const material = decalMaterial;
      // const material = decalMaterial.clone();
      // material.color.setHex(0x00ffff); 
      const m = new THREE.Mesh(new DecalGeometry(baseMesh, position, origin, size), material);

      decals.push(m);
      scene.add(m);
      return;
      if (decalMesh == null) {
        decalMesh = new THREE.Mesh(new DecalGeometry(baseMesh, position, origin, size), material);
        scene.add(decalMesh);
      } else {

        decalMesh.geometry.dispose();
        decalMesh.geometry = new DecalGeometry(baseMesh, position, origin, size);
      }
    }

    const intersection = {
      intersects: false,
      point: new THREE.Vector3(),
      normal: new THREE.Vector3()
    };

    let mouseHelper = new THREE.Group();
    let fromTemp = null;
    let toTemp = null;
    function RaycasterLine(fromPos) {


      decals.forEach(function (d) {
        d.geometry.dispose();

        scene.remove(d);
      });
      decals.length = 0;

      fromPos.y += 1;
      let toPos = fromPos.clone();
      toPos.y -= 5;
      if (fromTemp == null) {
        fromTemp = new THREE.Group();
        // fromTemp.add(new THREE.AxesHelper(1));

        toTemp = new THREE.Group();
        // toTemp.add(new THREE.AxesHelper(2));
        scene.add(fromTemp);
        scene.add(toTemp);
      }

      fromTemp.position.copy(fromPos);
      toTemp.position.copy(toPos);
      fromTemp.lookAt(toPos);
      let direction = fromTemp.getWorldDirection(new THREE.Vector3());

      let raycaster = new THREE.Raycaster(fromPos, direction, 0.1, 10);
      const intersects = raycaster.intersectObjects(modelParent.children, true);
      if (intersects.length > 0) {

        let has = false;
        let hitObj = null;
        for (let i = 0; i < intersects.length && !has; i++) {
          const element = intersects[i].object;
          if (!element.name.includes("collider")) {

            hitObj = element;
          }
        }

        if (hitObj) {
          const p = intersects[0].point;
          mouseHelper.position.copy(p);
          intersection.point.copy(p);

          const n = intersects[0].face.normal.clone();
          n.transformDirection(hitObj.matrixWorld);
          n.multiplyScalar(10);
          n.add(intersects[0].point);

          intersection.normal.copy(intersects[0].face.normal);
          mouseHelper.lookAt(n);
          GenerateDecal(hitObj);

          // console.log(" 鼠标位置的模型 ", hitObj, intersects[0]);
        }

      }

    }

    let targetPlayer = null;
    let targetPlayerOldPos = new THREE.Vector3(0, 0, 0);

    //从目标位置 向下 发出射线，把贴花放到射线与地形的碰撞点上
    // 当目标的位置改变时，刷新它底下的光圈
    function UpdateDecal() {
      // if (targetPlayer == null) { return; }
      // let pos = _this._YJSceneManager.GetWorldPosition(targetPlayer);
      // let pos = _this.YJPlayer.GetWorldPos();
      let pos = _this._YJSceneManager.GetPlayerPos();

      if (!checkV3Equel(targetPlayerOldPos, pos)) {
        targetPlayerOldPos = pos.clone();
        RaycasterLine(targetPlayerOldPos);
      }

    }
    let times = 0;

    this._update = () => {

      // times++;
      // if (times < 2) {
      //   return;
      // }
      // times = 0;
      // UpdateDecal();

    }
    function onPointerDown(event) {
      return;
      // console.log(" player pos = >", pos);
      if (targetPlayer == null) {
        targetPlayer = _this.YJPlayer.GetPlayerGroup();
        return;
      }

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modelParent.children, true);
      // console.log(found);
      if (intersects.length > 0) {

        let has = false;
        let hitObj = null;
        for (let i = 0; i < intersects.length && !has; i++) {
          const element = intersects[i].object;
          if (element.visible) {
            hitObj = element;
            has = true;
          }
        }
        if (hitObj) {

          const p = intersects[0].point;
          mouseHelper.position.copy(p);
          intersection.point.copy(p);

          const n = intersects[0].face.normal.clone();
          n.transformDirection(hitObj.matrixWorld);
          n.multiplyScalar(10);
          n.add(intersects[0].point);

          intersection.normal.copy(intersects[0].face.normal);
          mouseHelper.lookAt(n);
          GenerateDecal(hitObj);

          console.log(" 鼠标位置的模型 ", hitObj, intersects[0]);
        }

      }

    }
  }
}

export { YJProjector };