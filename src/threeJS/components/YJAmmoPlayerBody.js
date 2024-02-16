import * as THREE from "three";
import { YJAmmoRope } from "./YJAmmoRope2.js";


import { YJTrigger } from "./YJTrigger.js";
// 动力学软体做衣服物理模拟
// 控制骨骼

class YJAmmoPlayerBody {
  constructor(_this, scene) {
    var scope = this;

    let Ammo = null;
    let physicsWorld = null;
    let _YJAmmo = null;
    const margin = 0.05;
    const STATE = { DISABLE_DEACTIVATION: 4 };
    let transformAux1;

    let rigidBodies = [];

    let hinge;
    function Init() {
      Ammo = _YJGlobal.Ammo;
      transformAux1 = new Ammo.btTransform();
      _YJAmmo = _YJGlobal._YJAmmo;
      physicsWorld = _YJAmmo.GetPhysicsWorld();
      rigidBodies = _YJAmmo.GetRigidBodies();
      moveForce = new Ammo.btVector3(0, 0, 0);


      // _YJGlobal._YJAmmo.AddNeedUpdateJS(new YJAmmoRope(_this, scene));

      _Global.YJAmmoPlayerBody = scope;
      // setInterval(() => {
      //   if(castBall){
      //     _YJAmmo.removeRigidBody(castBall);
      //     scene.remove(castBall);
      //   }
      //   CreateSphere();
      // }, 100);
    }

    function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {

      const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
      shape.setMargin(margin);

      createRigidBody(threeObject, shape, mass, pos, quat);

      return threeObject;

    }
    function createRigidBody(threeObject, physicsShape, mass, pos, quat) {

      threeObject.position.copy(pos);
      threeObject.quaternion.copy(quat);

      const transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      const motionState = new Ammo.btDefaultMotionState(transform);

      const localInertia = new Ammo.btVector3(0, 0, 0);
      physicsShape.calculateLocalInertia(mass, localInertia);

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);

      threeObject.userData.physicsBody = body;
      body.threeObject = threeObject;
      scene.add(threeObject);

      if (mass > 0) {

        rigidBodies.push(threeObject);

        // Disable deactivation
        body.setActivationState(4);

      }

      physicsWorld.addRigidBody(body);

    }

    let ballRadius = 0.5;
    let castBall = null;
    this.CreateSphere = function (ballRadius) {
      if (castBall) {
        _YJAmmo.removeRigidBody(castBall);
        scene.remove(castBall);
      }
      CreateSphereFn(ballRadius);
    }
    function CreateSphereFn(ballRadius) {

      let pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      // ballRadius += 0.01;

      castBall = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 20, 20),
        new THREE.MeshPhongMaterial(
          {
            color: 0xff0000,
            transparent: true,
            opacity: 0,
          }));
      castBall.castShadow = true;
      castBall.receiveShadow = true;
      const ballShape = new Ammo.btSphereShape(ballRadius);
      ballShape.setMargin(margin);
      createRigidBody(castBall, ballShape, 0, pos, quat);
      scene.add(castBall);
    }

    let bones = [];
    let boneRoot = null;
    let boneRidgid = [
      { ridgidName: "00I_左足", boneName: "足D_L" },
      { ridgidName: "00O_左脹脛", boneName: "ひさD_L" },
      { ridgidName: "00J_右足", boneName: "足D_R" },
      { ridgidName: "00P_右脹脛", boneName: "ひさD_R" },
    ];
    this.CreateRopeBone = function (model) {

      // return;

      let bones = _Global.YJ3D._YJSceneManager
        .GetSingleTransformComponent("MeshRenderer").GetAllBoneModel();
      // for (let j = 0; j < bones.length; j++) {
      //    console.log(bones[j].name);
      // }
      // return;
      // model = _Global.YJ3D._YJSceneManager.GetSingleModelTransform().GetGroup();
      console.log(" model ", model);
      let rigidBodies = [];
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          // console.log("item.parent ",item.parent.name);
          if (item.parent.name.includes("rigidbodies") || item.parent.name.includes("joints")) {
            item.visible = false;
          }
          if (item.parent.name.includes("rigidbodies")) {
            rigidBodies.push(item);
          }
        }
      });
      rigidBodies.forEach(item => {
        // scene.attach(item);
        // console.log(" item ",item);
        // return;
        let name = item.name;
        for (let i = 0; i < boneRidgid.length; i++) {
          const element = boneRidgid[i];
          if (name.includes(element.ridgidName)) {
            for (let j = 0; j < bones.length; j++) {
              const bone = bones[j];
              if (bone.name.includes(element.boneName)) {
                bone.attach(item);
                // item.visible = true;

                // let pos = new THREE.Vector3();
                // const quat = new THREE.Quaternion();
                // let ballStart = createParalellepiped(0.223, 0.2235, 0.5235, 0, pos, quat,
                //   new THREE.MeshPhongMaterial(
                //     {
                //       color: 0x202020,
                //       transparent: true,
                //       opacity: 0.5,
                //     }
                //   ));


                // const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020 }));
                // item.add(ball);
                // _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(ball);
                // bodyCollider.push({ rigidbody: ballStart.userData.physicsBody, bone: item });

                // console.log(" item ",item);
                // console.log(" item ",item.geometry.getAttribute('position'));

                // _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(item);
                // bodyCollider.push({rigidbody:item.userData.physicsBody,bone:item});
                // bodyCollider.push({rigidbody:item.userData.triggerBody,bone:item});

                return;
              }
            }
          }
        }
      });
      _YJGlobal._YJAmmo.AddNeedUpdateJS(scope);


    }

    let ballStart = null;
    let data = null;
    let meshTrigger = null;
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
    }


    //#endregion
    this.Start = function () {

    }




    this.Reset = function () {

    }

    //销毁组件
    this.Destroy = function () {

    }
    this.DestroyTrigger = function () {

    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(group.position, group.rotation);
    }

    const dummy = new THREE.Object3D();
    let moveY = 0;
    let moveForce = null;

    let bodyCollider = [];
    // bodyCollider.push({rigidbody:"",bone:""});
    this._update = function () {
      // console.log(" in ammo body " ,bodyCollider);
      for (let i = 0; i < bodyCollider.length; i++) {
        const item = bodyCollider[i];
        _YJAmmo.SetPhysicBodyPosRota(item.rigidbody, 
          item.bone.getWorldPosition(new THREE.Vector3()),
          item.bone.getWorldQuaternion(new THREE.Quaternion()),
          );
      }
    }

    Init();

  }
}

export { YJAmmoPlayerBody };