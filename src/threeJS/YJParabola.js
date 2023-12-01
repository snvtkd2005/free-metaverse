


import * as THREE from "three";


import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJProjector } from "./components/YJProjector.js";

import TWEEN from '@tweenjs/tween.js';
import { YJLoadModel } from "./YJLoadModel.js";

// 抛物线

class YJParabola {
  constructor(_this, parent, model, startPos, endPos) {
    var scope = this;
    const clock = new THREE.Clock();
    const SPEED = 10;
    let navpath = [];
    let sHeight = new THREE.Vector3(0, 0, 0);
    let eHeight = new THREE.Vector3(0, 1, 0);

 
    let offsetY = 0;

    // 计算抛物线
    function getPoint(start, end, t, offsetY) {

      let value = start.lerp(end, t); // x z 轴上的线性位移
      sHeight.y = 0;
      value.y = sHeight.lerp(eHeight, Math.sin(t * Math.PI)).y + t * offsetY; // y 轴上的sin 抛物线位移

      return value;
    }
    let step = 10;
    let playerPosition;
    //生成抛物线路径线。确定两点后反向计算抛物线
    function CreateParabolaLine2() {

      

      let ss = startPos.clone();
      let ee =  endPos.clone();
      ss.y = 0;
      ee.y = 0;
      let distance = ss.distanceTo(ee);
      eHeight.y *= distance/7;


      playerPosition = startPos.clone();
      // console.log("playerPosition = ", playerPosition);
      offsetY = (endPos.y - startPos.y);

      for (let i = 0; i < step; i++) {

        let pos = getPoint(startPos.clone(), endPos.clone(), (i + 1) * 0.1, offsetY);
        // console.log("startPos = ", startPos);
        navpath.push(pos.clone());
        // console.log("pos = ",pos);
        // CreateCube(pos);
      }
      update();
    }
    function CreateCube(pos) {

      //在2d物品栏对应的3d位置生成模型
      let cubeGeometry = new THREE.SphereGeometry(0.1, 50, 50);
      let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
      });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      parent.add(cube);
      cube.position.copy(pos);
    }

    function update() {

      requestAnimationFrame(update);
      tick();

    }
    let lerpLength = 0;
    let targetPosition = new THREE.Vector3(0,0,0);
    let currentTargetPos = new THREE.Vector3(0,0,0);
    function tick(dt) {
      if (!(navpath || []).length) return


      targetPosition = navpath[0];

      lerpLength += 0.1;
      if(lerpLength>=1){
        lerpLength = 1;
      }
      currentTargetPos.lerp(targetPosition, lerpLength);
      model.position.set(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z);
 
      if (Math.abs(targetPosition.z - currentTargetPos.z) < 0.01
        && Math.abs(targetPosition.x - currentTargetPos.x) < 0.01
        && Math.abs(targetPosition.y - currentTargetPos.y) < 0.01
      ) {
        lerpLength = 0;
        navpath.shift(); 
        if (navpath.length == 0) {
          model.parent.remove(model);
          _this._YJSceneManager.clearGroup(model);
        }
        // console.log("已移动到指定位置");
      }

      return;




      targetPosition = navpath[0];
      const velocity = targetPosition.clone().sub(playerPosition);


      if (velocity.lengthSq() > 0.05 * 0.05) {
        velocity.normalize();
        // Move player to target
        playerPosition.add(velocity.multiplyScalar(0.015 * SPEED));


        let pos = playerPosition.clone();
        model.position.copy(pos);

        // console.log("设置移动 00 " );
        // if (doonce < 1) {
        //   if (navpath.length > 0) {
        //     //角色朝向目标点
        //     group.lookAt(targetPosition.clone());
        //   }
        //   doonce++;
        // } 

      } else {
        // Remove node from the path we calculated
        navpath.shift();
        // console.log("设置移动 移除 00 " );
        // doonce = 0;
        if (navpath.length == 0) {
          model.parent.remove(model);
          _this._YJSceneManager.clearGroup(model);
        }

      }
    }

    CreateParabolaLine2();


  }
}

export { YJParabola };