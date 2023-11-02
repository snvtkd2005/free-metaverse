



import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { YJAnimModel } from "./components/YJAnimModel";
import { YJBillboard } from "./model/YJBillboard";
import { YJHotPoint } from "./YJHotPoint";
import { YJ3DAudio } from "./YJ3DAudio";
import { YJLight } from "./YJLight";
import { YJUVanim } from "./YJUVanim";
import { YJUVanim2 } from "./YJUVanim2";
import { YJLoadModel } from "./YJLoadModel";
import { MeshBasicMaterial } from "three";
import { YJTransform } from "./YJTransform";
import { YJMeshRenderer } from "./loader/YJMeshRenderer";
import { YJAnimator } from "./components/YJAnimator";
import { YJUVAnim3 } from "./YJUVAnim3.js";

// 加载静态物体
class YJRigidbodyOverlep {
  constructor(_this, callback) {
    let scope = this;

    let Ammo = null;
    let _YJAmmo = null;
    const margin = 0.05;
    const STATE = { DISABLE_DEACTIVATION: 4 };
    let transformAux1;
    let cbContactResult;


    function InitAmmo() {
      Ammo = _YJGlobal.Ammo;
      transformAux1 = new Ammo.btTransform();
      _YJAmmo = _YJGlobal._YJAmmo;
      setupContactResultCallback();
    }
    let b_checkOverlap = true;
    let overlapArray = [];
    let oldoverlapArray = [];
    this.invaildArea = true;
    //试试判断与角色碰到的碰撞体
    function CheckOverlap() {
      if (!b_checkOverlap) { return; }
      
      //提取增加的
      let has = false;
      for (let i = 0; i < overlapArray.length && !has; i++) {
        const newItem = overlapArray[i];
        let tag = newItem.userData.tag;
        if (tag == "trigger") {
          if(callback){
            callback(scope);
          }
          console.log(" 碰到底线trigger ");
        }
      }
      

      // console.log(" in 碰到底线trigger 检测 ",overlapArray);

      overlapArray = [];
    }
    //角色刚体 碰到的物体
    function setupContactResultCallback() {

      cbContactResult = new Ammo.ConcreteContactResultCallback();

      cbContactResult.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {
        // console.log("正在 22 检查 是否有空余 ");

        let contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);

        const distance = contactPoint.getDistance();

        // console.log("contactPoint.getDistance()  =  " + distance);
        if (distance > 0.1) return;

        let colWrapper0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);
        let rb0 = Ammo.castObject(colWrapper0.getCollisionObject(), Ammo.btRigidBody);

        let colWrapper1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);
        let rb1 = Ammo.castObject(colWrapper1.getCollisionObject(), Ammo.btRigidBody);

        // console.log("rb0 = " , rb0);
        // console.log("rb1 = " , rb1);

        let threeObject0 = rb0.threeObject;
        let threeObject1 = rb1.threeObject;

        // console.log("rb1 = " , rb1);
        if(threeObject1== undefined || threeObject1.userData == undefined){
          return;
        }
        let tag = threeObject1.userData.tag;

        let has = false;
        for (let i = 0; i < overlapArray.length; i++) {
          const item = overlapArray[i];
          if (item == threeObject1) {
            has = true;
          }
        }
        if (!has) {
          overlapArray.push(threeObject1);
        }

        // console.log("碰撞到的物体，" , threeObject1.userData);

        return;

      }

    }

    let physicsBody;

    this.CreateVolume = function (model, volume) {
      physicsBody = _YJAmmo.YJCoustomBody(model, new THREE.Vector3(volume.x, volume.y, volume.z));
    }
    this.SetRigidBody = function (rigidbody) {
      physicsBody = rigidbody;
      b_checkOverlap = true;
    }
    this.StopCheck = function () {
      b_checkOverlap = false;
      physicsBody = null;
    }



    function update() {
      // return;
      requestAnimationFrame(update);

      if (physicsBody) {
        _YJAmmo.checkContactOverlap(physicsBody, cbContactResult);
        CheckOverlap();
      }
    }

    //#region 
    //#endregion


    function Init() {
      InitAmmo();
      update();
    }

    Init();

  }
}

export { YJRigidbodyOverlep };