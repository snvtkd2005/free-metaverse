

import * as THREE from "three";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';


/**
 静态模型合批优化： merge 、 instance
 模型本身用instance
 模型碰撞用 geometry 合并后生成
 */
class YJNameTransMerged {
  constructor(model) {
    let scope = this;
    const dummy = new THREE.Object3D();
    // console.log(model);
    let matrix = new THREE.Matrix4();

    let geometry = null;
    let material = null;
    let pos = null;
    let scale = null;

    let _InstancedMesh = null;
    model.traverse((item) => {
      if (item.isMesh) {
        geometry = item.geometry;
        material = item.material;
        pos = item.position;
        scale = item.scale;
      }
    });

    // console.log(" in mesh merged model ", model); 
    // console.log(" in mesh merged meshes ", meshes); 

    let count = 1;
    let groupList = [];
    let idList = [];
    let posList = [];
    let rotaList = [];
    let scaleList = [];

    function transformToMatrix4(pos, size, rota) {

      const position = new THREE.Vector3(pos.x, pos.y, pos.z);

      const rotation = rota ? new THREE.Euler(rota.x, rota.y, rota.z) : new THREE.Euler(0, 0, 0);
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(rotation);

      const scale = size ? new THREE.Vector3(size.x, size.y, size.z) : new THREE.Vector3(1, 1, 1);

      matrix.compose(position, quaternion, scale);
    }

    function makeInstanced(geometry, material, pos, scale) {
      _InstancedMesh = new THREE.InstancedMesh(geometry, material, count);
      for (let i = 0; i < count; i++) {

        let pos1 = posList[i];
        pos1.x += pos.x;
        pos1.y += pos.y;
        pos1.z += pos.z;

        let scale1 = scaleList[i].clone();
        scale1.x *= scale.x;
        scale1.y *= scale.y;
        scale1.z *= scale.z;

        transformToMatrix4(pos1, scale1);
        // transformToMatrix4(posList[i], scaleList[i], rotaList[i]);
        _InstancedMesh.setMatrixAt(i, matrix);
      }
      _Global.YJ3D.scene.add(_InstancedMesh);
      _InstancedMesh.owner = scope;

      // console.error(" in  姓名条 instance", count);
    }

    this.removePoint = function (id) {
      let has = false;
      for (let i = idList.length - 1; i >= 0 && !has; i--) {
        const element = idList[i];
        if (element == id) {
          idList.splice(i, 1);
          posList.splice(i, 1);
          scaleList.splice(i, 1);
          groupList.splice(i, 1);
          has = true;
        }
      }
      if(!has){
        return;
      }
      this.ReMerged(idList, groupList, posList, scaleList);
    }

    this.addPoint = function (id, group, pos, scale) {
      // return;

      idList.push(id); 
      groupList.push(group);
      posList.push(pos);
      scaleList.push(scale ? scale : { x: 1, y: 1, z: 1 });
      this.ReMerged(idList, groupList, posList, scaleList);
    }
    // 数量改变时，重新计算
    this.ReMerged = (_idList, _groupList, _posList, _scaleList, _rotaList) => {

      _Global.YJ3D.scene.remove(_InstancedMesh);

      if (_posList.length == 0) {
        return;
      }

      // return;
      idList = _idList;
      posList = _posList;
      groupList = _groupList;
      // rotaList = _rotaList;
      scaleList = _scaleList;
      count = posList.length;

      makeInstanced(geometry, material, pos, scale);

    } 

    this._update = function () {
      // return;
      for (let i = 0; i < groupList.length; i++) {
        const group = groupList[i]; 
        transformToMatrix4(group.getWorldPosition(new THREE.Vector3()), scaleList[i],group.rotation);
        _InstancedMesh.setMatrixAt(i, matrix);
        _InstancedMesh.instanceMatrix.needsUpdate = true;
      } 
    } 

  }
}

export { YJNameTransMerged };