

import * as THREE from "three";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';


/**
 静态模型合批优化： merge 、 instance
 模型本身用instance
 模型碰撞用 geometry 合并后生成
 */
class YJMeshMerged {
  constructor(model, modelData, callback) {
    let scope = this;
    const dummy = new THREE.Object3D();
    // console.log(model);
    let matrix = new THREE.Matrix4();

    let geometry = null;
    let material = null;
    let allMesh = []; 

    let meshes = [];
    let colliders = [];
    let colliderMergedMesh = null;


    let colliderGeo = [];


    model.traverse((item) => {
      // console.log(" in mesh merged item ", item);
 
      if (item.isMesh && !item.name.includes("collider")) {
        meshes.push(item);
      }
      if (item.isMesh && item.name.includes("collider")) {
        colliders.push(item);
        //碰撞网格记录下，用来合并碰撞网格
        let scale = item.scale;
        item.geometry.scale(scale.x, scale.y, scale.z);
        colliderGeo.push(item.geometry);

        //把第一个模型的碰撞删除
        _Global.YJ3D._YJSceneManager.GetAmmo().removeRigidBody(item);

      }
    });

    for (let i = 0; i < meshes.length; i++) {
      let item = meshes[i];
      model.attach(item);
      allMesh.push({ geometry: item.geometry, material: item.material, pos: item.position, scale: item.scale });
    }

    model.parent.remove(model);
    // console.log(" in mesh merged model ", model); 
    // console.log(" in mesh merged meshes ", meshes);
    // console.log(" in mesh merged allMesh ", allMesh);

    let count = 1;
    let idList = [];
    let posList = [];
    let rotaList = [];
    let scaleList = [];

    const randomizeMatrix = function () {

      const position = new THREE.Vector3();
      const rotation = new THREE.Euler();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();

      return function (matrix) {

        position.x = Math.random() * 40 - 20;
        position.y = Math.random() * 40 - 20;
        position.z = Math.random() * 40 - 20;

        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        quaternion.setFromEuler(rotation);

        scale.x = scale.y = scale.z = Math.random() * 1;

        matrix.compose(position, quaternion, scale);

      };

    }();

    function transformToMatrix4(pos, size, rota) {

      const position = new THREE.Vector3(pos.x, pos.y, pos.z);

      const rotation = rota ? new THREE.Euler(rota.x, rota.y, rota.z) : new THREE.Euler(0, 0, 0);
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(rotation);

      const scale = size ? new THREE.Vector3(size.x, size.y, size.z) : new THREE.Vector3(1, 1, 1);

      matrix.compose(position, quaternion, scale);
    }

    let allInstancedMesh = [];
    function makeInstanced(geometry, material, pos, scale) {
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      for (let i = 0; i < count; i++) {

        let pos1 = new THREE.Vector3( posList[i].x, posList[i].y, posList[i].z); 
        pos1.x += pos.x;
        pos1.y += pos.y;
        pos1.z += pos.z;

        let scale1 = new THREE.Vector3( scaleList[i].x, scaleList[i].y, scaleList[i].z); 
        scale1.x *= scale.x;
        scale1.y *= scale.y;
        scale1.z *= scale.z;
 
        transformToMatrix4(pos1, scale1);
        // transformToMatrix4(posList[i], scaleList[i], rotaList[i]);
        mesh.setMatrixAt(i, matrix);
      }
      _Global.YJ3D.scene.add(mesh);
      mesh.owner = scope;
      allInstancedMesh.push(mesh);
    }


    function makeMergedCollider() {
      if (colliders.length == 0) { return; }
      const geometries = [];

      for (let i = 0; i < count; i++) {

        transformToMatrix4(posList[i], scaleList[i], rotaList[i]);

        for (let ii = 0; ii < colliderGeo.length; ii++) {
          const instanceGeometry = colliderGeo[ii].clone();
          instanceGeometry.applyMatrix4(matrix);
          geometries.push(instanceGeometry);
        }

      }

      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
      let material = new THREE.MeshLambertMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
      colliderMergedMesh = new THREE.Mesh(mergedGeometry, material);
      colliderMergedMesh.visible = false;
      _Global.YJ3D._YJSceneManager.GetAmmo().CreateTriangeMeshColliderConcave(colliderMergedMesh);

      _Global.YJ3D.scene.add(colliderMergedMesh);
    }

    this.removePoint = function (id) {
      let has = false;
      for (let i = idList.length -1; i >= 0 && !has ; i--) {
        const element = idList[i];
        if(element==id){
          idList.splice(i,1);
          posList.splice(i,1);
          scaleList.splice(i,1);
          has = true;
        } 
      } 
      this.ReMerged(idList,posList,scaleList);
    }

    this.addPoint = function (id,pos,scale) {
      // return;
      
      idList.push(id);
      posList.push(pos);
      scaleList.push(scale?scale:{x:1,y:1,z:1});

      // if (colliderMergedMesh != null) {
      //   _Global.YJ3D._YJSceneManager.clearObject(colliderMergedMesh);
      // }

      this.ReMerged(idList,posList,scaleList);
    }
    // 数量改变时，重新计算
    this.ReMerged = (_idList,_posList, _scaleList, _rotaList) => {
      
      for (let i = 0; i < allInstancedMesh.length; i++) {
        const element = allInstancedMesh[i];
        _Global.YJ3D.scene.remove(element);
      }
      if(_posList.length==0){
        return;
      }

      // return;
      idList = _idList;
      posList = _posList;
      // rotaList = _rotaList;
      scaleList = _scaleList;
      count = posList.length;
      for (let i = 0; i < allMesh.length; i++) {
        const element = allMesh[i];
        makeInstanced(element.geometry, element.material, element.pos, element.scale);
      }

      // makeMergedCollider();

    }



    let currentPos = null;
    this.Click = function (index) {
      currentPos = posList[index];
      // 移除当前位置的实例；再重新生成
      posList.splice(index, 1);
      rotaList.splice(index, 1);
      scaleList.splice(index, 1);
      count = posList.length;
      for (let i = 0; i < allInstancedMesh.length; i++) {
        const element = allInstancedMesh[i];
        _Global.YJ3D.scene.remove(element);
      }

      if (colliderMergedMesh != null) {
        _Global.YJ3D._YJSceneManager.clearObject(colliderMergedMesh);
      }
      this.ReMerged(posList, rotaList, scaleList);

      //可编辑物体还原

    }

    this.GetModelData = function () {
      modelData.pos = currentPos;
      return modelData;
    }

    // this.addPoint({x:1,y:0,z:1});
    // this.addPoint({x:1,y:0,z:2});
    // this.addPoint({x:1,y:0,z:3});
    // this.addPoint({x:1,y:0,z:4});
    // this.addPoint({x:1,y:0,z:5});
    // this.addPoint({x:1,y:0,z:6});
    // this.addPoint({x:1,y:0,z:7});

    // function Init() {
    //   count = 1;
    //   posList.push(model.position);
    //   rotaList.push(model.rotation);
    //   scaleList.push(model.scale);
    //   // makeMerged();
    //   makeInstanced();
    // }
    // Init();

  }
}

export { YJMeshMerged };