

import * as THREE from "three";

import { YJLoadModel } from "./YJLoadModel";


// 热点序列帧图片

class YJSqeImage {
  constructor(_this,id,pointObj, texPath, imgCount, speed) {
    // imgCount  横向序列长度
    // speed  切换速度
    let plane = null;
    
    var updateId = null;
    var defaultOffsetX = 1 / 36;
    var loadTexDeltaTime = 0;//gif图片的加载时的计次，相当于Time.deltaTime;

    
    function Init() {
      defaultOffsetX = 1 / imgCount;
      CreatePlane();
    }

    function CreateHitArea(){
      let size = 1.5;
      let planeGeometry = new THREE.PlaneBufferGeometry(size, size, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
        opacity: 0,
      }); // 材质
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      // plane.name = name;
      parent.add(plane);
      // _sceneManager.AddCanHitModel(plane);
      plane.position.set(pos.x, pos.y, pos.z);
      plane.lookAt(0,0,0);
      return plane;
    }

    function CreatePlane() {

      let planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
      }); // 材质

      const map = new THREE.TextureLoader().load(texPath);

      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

      planeMaterial.map = map;
      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      parent.add(plane);
      plane.position.set(0, 7, 0);

    }

    Init();
    update();
    function update() {
      updateId = requestAnimationFrame(update);
      if (plane) {
        loadTexDeltaTime++;

        var texture = plane.material.map;
        texture.matrix
          .identity()
          .scale(defaultOffsetX, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
          .translate(defaultOffsetX * parseInt(loadTexDeltaTime / speed), 0);   //每次平移量为1/17

      }
    }
  }
}


export { YJSqeImage };