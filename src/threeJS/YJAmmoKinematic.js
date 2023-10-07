import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

class YJAmmoKinematic {
  constructor(scene, _YJAmmo, _this,Ammo) {
 
    // Ammo().then(function (AmmoLib) {

    //   Ammo = AmmoLib;

    //   init();
    //   animate();

    // }); 
    function init() { 
      console.log("创建 kinematic ");
      CreateAutoLift();

      animate();

    }  
    init();


    var rigidbody = null;
    const margin = 0.05;


    const STATE = { DISABLE_DEACTIVATION: 4 };
    //#region
    //#endregion

    //#region 
    //#endregion

    //#region 创建自运动的物体，如 升降梯、摆渡车
    function CreateAutoLift() {

      let threeObject = null;
      let shape = null;

      const margin = 0.05;
      let radius, height;

      // Cylinder
      radius = 5;
      height = 0.1;
      threeObject = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 40, 1), createObjectMaterial());
      shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height - height / 2, radius));
      shape.setMargin(margin);

      threeObject.position.set(-10, 0.1, 0);

      const mass = radius * 5000;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      const pos = threeObject.position;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setAngularFactor(0, 1, 0);
      
      // body.setGravity(new Ammo.btVector3(0, 1, 0));
      body.setCollisionFlags(2); // kim collider
      // body.setCollisionFlags(4); //trigger
      // body.setCollisionFlags(3);
      // body.setCollisionFlags(1);
      // body.setCollisionFlags(0);
      // body.activate();
      
      body.setFriction(4);
      body.setRollingFriction(10);
      body.setActivationState(STATE.DISABLE_DEACTIVATION)

      threeObject.userData.physicsBody = body;
      

      threeObject.receiveShadow = true;
      threeObject.castShadow = true;

      scene.add(threeObject);
      // rigidBodies.push(threeObject);

      // physicsWorld.addRigidBody(body);
      _YJAmmo.addRigidBody(body);
      // console.log(" auto lift ", body, body.isKinematicObject());
      // console.log(" auto lift ", body,body.isStaticOrKinematicObject());

      // return;

      // autoLift.push({id:"11111",rigidbody:body,direction:1,step:0});

      let speed = 5000;
      let maxHeight = 2;
      let startPos = new THREE.Vector3(-10, height/2, 0);
      let currentTargetPos = new THREE.Vector3(-10, height/2, 0);
      let endPos = new THREE.Vector3(-10,maxHeight, 0);
      let startTween = new TWEEN.Tween(currentTargetPos).to(endPos, speed).easing(TWEEN.Easing.Linear.None)
      let updateTargetPos = () => {
        // console.log("设置lift 移动");
        SetBodyPos(threeObject,body,new Ammo.btVector3(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z));
        UpdateAutoLiftValue("11111",1);
      }
      startTween.onUpdate(updateTargetPos);
      startTween.onStart(()=>{
        UpdateAutoLiftValue("11111",1);
      });
      startTween.onComplete(() => {     
        // console.log("设置lift 动画结束 ");
        UpdateAutoLiftValue("11111",0);
      });

      startTween.delay(3000);
      startTween.start() // 启动动画

 
      let endTween = new TWEEN.Tween(currentTargetPos).to(startPos, speed).easing(TWEEN.Easing.Linear.None)
      let updateEndTargetPos = () => {
        SetBodyPos(threeObject,body,new Ammo.btVector3(currentTargetPos.x, currentTargetPos.y, currentTargetPos.z));
      }

      endTween.onUpdate(updateEndTargetPos);
      // endTween.start() // 启动动画
      endTween.delay(3000);

      startTween.chain(endTween);
      endTween.chain(startTween);
      // startTween.repeat(Infinity);
      // startTween.onComplete(() => {
      //   endTween.start() // 启动动画
      // });

      // endTween.onComplete(() => {
      //   startTween.start() // 启动动画
      // });

    }

    let autoLift = [];
    function UpdateAutoLiftValue(id,direction){
      for (let i = 0; i < autoLift.length; i++) {
        let item = autoLift[i];
        if(item.id == id){
          item.direction = direction;
        }
      }
    }
    function UpdateAutoLift(){
      return;
      for (let i = 0; i < autoLift.length; i++) {
        let item = autoLift[i];
        console.log(item.id +" "+ item.direction);
        item.rigidbody.setLinearVelocity(new Ammo.btVector3(0,1*item.direction, 0) );
      }
    }


    //设置刚体位置。
    function SetBodyPos(threeObject, rigidbody, pos) {

      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 2; i++) {
          ms.setWorldTransform(transformAux1);
          transformAux1.setOrigin(pos); 
        }
        
        const p = transformAux1.getOrigin(); 
        threeObject.position.set(p.x(), p.y(), p.z());
        rigidbody.setMotionState(ms);
      }
    }
    //#endregion
 
    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    const clock = new THREE.Clock();

    function render() {

      const deltaTime = clock.getDelta();
      time += deltaTime;
      timeStamp += deltaTime;

      if (timeStamp > singleFrameTime) {
        timeStamp = timeStamp % singleFrameTime;

        UpdateAutoLift();
      }
      TWEEN.update();
    }
 
  }
}

export { YJAmmoKinematic };