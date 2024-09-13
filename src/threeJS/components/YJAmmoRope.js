import * as THREE from "three";


import { YJTrigger } from "./YJTrigger.js";
// 动力学软体做衣服物理模拟
// 控制骨骼

class YJAmmoRope {
  constructor( scene, transform) {
    var scope = this;

    let Ammo = null;
    let physicsWorld = null;
    let _YJAmmo = null;
    const margin = 0.05;
    const STATE = { DISABLE_DEACTIVATION: 4 };
    let transformAux1;
    let cbContactResult;

    const gravityConstant = - 9.8;
    let collisionConfiguration;
    let dispatcher;
    let broadphase;
    let solver;
    let softBodySolver;
    let rigidBodies = [];
    let hinge;
    let rope;

    let armMovement = 0;

    function Init() {
      Ammo = _YJGlobal.Ammo;
      transformAux1 = new Ammo.btTransform();
      _YJAmmo = _YJGlobal._YJAmmo;
      physicsWorld = _YJAmmo.GetPhysicsWorld();
      rigidBodies = _YJAmmo.GetRigidBodies(); 
      moveForce = new Ammo.btVector3(0, 0, 0);
      initInput();
      // createRope();
      // setupContactResultCallback();
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
      // scene.add(threeObject);

      if (mass > 0) {

        rigidBodies.push(threeObject);

        // Disable deactivation
        body.setActivationState(4);

      }

      physicsWorld.addRigidBody(body);

    }

    function createRandomColor() {
      return Math.floor(Math.random() * (1 << 24));
    }

    function createMaterial() {
      return new THREE.MeshPhongMaterial({ color: createRandomColor() });
    }
    function initInput() {
      window.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
          // Q
          case 81:
            armMovement = 1;
            break;
          // A
          case 65:
            armMovement = - 1;
            break;
        }
      });

      window.addEventListener('keyup', function () {
        armMovement = 0;
      });
    }
    let bones = []; 
    let boneRoot = null; 
    this.CreateRopeBone = function(_boneRoot){
      boneRoot = _boneRoot;
      // bones.push(boneRoot);
      boneRoot.traverse(function (item) {
        if (item instanceof THREE.Bone) {
          if(item != boneRoot){
            bones.push(item);
          } 
          // console.log(item);
        }
      }); 

      // return;
      for (let i = 0; i < bones.length; i++) {
        const element = bones[i];
        if(element != boneRoot){
          boneRoot.attach(element);
        }
      }
      console.log(bones);

      createRope();
      _YJGlobal._YJAmmo.AddNeedUpdateJS(scope);
      

    }

    let ballStart = null;
    function createRopeNode(i,ropeSoftBody,influence){
      
      let pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();

      const ballRadius = 0.05;
      const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 20, 20), 
      new THREE.MeshPhongMaterial({ color: Math.floor(i*0.1 * (1 << 24)) }));
      ball.castShadow = true;
      ball.receiveShadow = true;
      const ballShape = new Ammo.btSphereShape( ballRadius );
      ballShape.setMargin( margin );
      createRigidBody( ball, ballShape, 0, pos, quat );
      scene.add(ball);
      ropeSoftBody.appendAnchor( i, ball.userData.physicsBody, true, influence );

    }
    function createRope() {
      let pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();


      // Ball
      const ballMass = 0.1;
      const ballRadius = 0.05;
      const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020 }));
      ball.castShadow = true;
      ball.receiveShadow = true;
      const ballShape = new Ammo.btSphereShape( ballRadius );
      ballShape.setMargin( margin );
      pos = bones[bones.length-1].getWorldPosition(new THREE.Vector3());
      // pos = boneRoot.getWorldPosition(new THREE.Vector3()); 
      createRigidBody( ball, ballShape, ballMass, pos, quat );
      ball.userData.physicsBody.setFriction( 0.5 );


      pos = boneRoot.getWorldPosition(new THREE.Vector3()); 
      const ropePos = pos.clone(); 
			ropePos.y += ballRadius;

      // The rope
      // Rope graphic object
      const ropeNumSegments = bones.length?bones.length:10;

      let pos1 = boneRoot.getWorldPosition(new THREE.Vector3());
      let pos2 = bones[0].getWorldPosition(new THREE.Vector3());
      // console.log(pos1,ropePos," 骨骼长度 ",pos1.distanceTo(ropePos)); 
      // const ropeLength = 0.1;
      // const ropeLength = pos1.distanceTo(pos2) * ropeNumSegments;

      const ropeMass = 0.1;

      // const segmentLength = ropeLength / ropeNumSegments;
      const ropeGeometry = new THREE.BufferGeometry();
      const ropeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const ropePositions = [];
      const ropeIndices = [];
      console.log(" segmentLength 长度 ",ropeNumSegments); 


      for (let i = 0; i < ropeNumSegments; i++) {
        let pos2 = bones[ropeNumSegments-1-i].getWorldPosition(new THREE.Vector3()).clone();
        // console.log(bones[ropeNumSegments-1-i].name, pos2);
        ropePositions.push(pos2.x,pos2.y,pos2.z);
      }

      ropePositions.push(pos1.x,pos1.y,pos1.z);


      for (let i = 0; i < ropeNumSegments; i++) {
        ropeIndices.push(i, i + 1);
      }

      ropeGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(ropeIndices), 1));
      ropeGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ropePositions), 3));
      ropeGeometry.computeBoundingSphere();
      rope = new THREE.LineSegments(ropeGeometry, ropeMaterial);
      rope.castShadow = true;
      rope.receiveShadow = true;  
      // scene.add(rope);

      // Rope physic object
      const softBodyHelpers = new Ammo.btSoftBodyHelpers();

      
      pos1 = boneRoot.getWorldPosition(new THREE.Vector3());
      pos2 = bones[bones.length-1].getWorldPosition(new THREE.Vector3());

      const ropeStart = new Ammo.btVector3(pos2.x, pos2.y, pos2.z);
      const ropeEnd = new Ammo.btVector3(pos1.x, pos1.y , pos1.z);

      // const ropeStart = new Ammo.btVector3(ropePos.x, ropePos.y, ropePos.z);
      // const ropeEnd = new Ammo.btVector3(ropePos.x, ropePos.y + ropeLength, ropePos.z);

      const ropeSoftBody = softBodyHelpers.CreateRope(physicsWorld.getWorldInfo(), ropeStart, ropeEnd, ropeNumSegments - 1, 0);
      const sbConfig = ropeSoftBody.get_m_cfg();
      sbConfig.set_viterations(10);
      sbConfig.set_piterations(10);
      ropeSoftBody.setTotalMass(ropeMass, false);

      // Friction
      // sbConfig.set_kDF(0.1); //摩擦力
      // Damping
      sbConfig.set_kDP(0.135901); //空气阻力
      // Pressure
      // sbConfig.set_kPR(pressure); //压力

      Ammo.castObject(ropeSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(margin * 3);
      physicsWorld.addSoftBody(ropeSoftBody, 1, - 1);
      rope.userData.physicsBody = ropeSoftBody;
      // Disable deactivation
      ropeSoftBody.setActivationState(4);


      

      // pos.set(1, 1, 0);
      pos = boneRoot.getWorldPosition(new THREE.Vector3()); 
      // const ballStart = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020 }));
      // const ballShapeStart = new Ammo.btSphereShape( ballRadius );
      // ballShapeStart.setMargin( margin );
      // createRigidBody( ballStart, ballShapeStart, ballMass, pos, quat );

      ballStart = createParalellepiped( 0.1, 0.1, 0.1, 0, pos, quat,  new THREE.MeshPhongMaterial({ color: 0x202020 }) );


      // Glue the rope extremes to the ball and the arm
      const influence = 1;
      // ropeSoftBody.appendAnchor( 0,ballStart.userData.physicsBody, true, influence );
      // ropeSoftBody.appendAnchor(ropeNumSegments, ball.userData.physicsBody, true, influence); 
      
      ropeSoftBody.appendAnchor( 0,ball.userData.physicsBody, true, influence );
      ropeSoftBody.appendAnchor(ropeNumSegments, ballStart.userData.physicsBody, true, influence); 

      // 绑定在人体骨骼上的位置，这个位置变化时，可以牵动线性骨骼运动
      bodyCollider.push({rigidbody:ballStart.userData.physicsBody,bone:boneRoot});

      // for (let i = 1; i < ropeNumSegments-1; i++) {
      //   createRopeNode(i,ropeSoftBody,i/ropeNumSegments);
      // }


    }

    function createRope22() {
      let pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();

      // Ball
      const ballMass = 0.1;
      const ballRadius = 0.05;

      // pos.set(1, 1, 0);
      pos = boneRoot.getWorldPosition(new THREE.Vector3());

      const ropePos = pos.clone(); 

      // const ballStart = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020 }));
      // const ballShapeStart = new Ammo.btSphereShape( ballRadius );
      // ballShapeStart.setMargin( margin );
      // createRigidBody( ballStart, ballShapeStart, ballMass, pos, quat );

      ballStart = createParalellepiped( 0.1, 0.1, 0.1, 0, pos, quat,  new THREE.MeshPhongMaterial({ color: 0x202020 }) );
			ballStart.castShadow = true;
			ballStart.receiveShadow = true;

      // ballStart.userData.physicsBody.setFriction( 0.5 ); 
      ballStart.userData.physicsBody.setCollisionFlags(4); //flag 设为4 ，将变为trigger



      const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 20, 20), new THREE.MeshPhongMaterial({ color: 0x202020 }));
      ball.castShadow = true;
      ball.receiveShadow = true;
      const ballShape = new Ammo.btSphereShape( ballRadius );
      ballShape.setMargin( margin );
      pos = bones[bones.length-1].getWorldPosition(new THREE.Vector3());
      createRigidBody( ball, ballShape, ballMass, pos, quat );
      // ball.userData.physicsBody.setFriction( 0.5 );

    

      // The rope
      // Rope graphic object
      const ropeNumSegments = bones.length?bones.length:10;

      let pos1 = boneRoot.getWorldPosition(new THREE.Vector3());
      let pos2 = bones[0].getWorldPosition(new THREE.Vector3());
      // console.log(" 骨骼长度 ",pos1.distanceTo(pos2)); 
      // const ropeLength = 0.1;
      const ropeLength = pos1.distanceTo(pos2) * ropeNumSegments;

      const ropeMass = 0.1;

      pos = bones[bones.length-1].getWorldPosition(new THREE.Vector3());


      const segmentLength = ropeLength / ropeNumSegments;
      const ropeGeometry = new THREE.BufferGeometry();
      const ropeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const ropePositions = [];
      const ropeIndices = [];
      for (let i = 0; i < ropeNumSegments + 1; i++) {
        ropePositions.push(ropePos.x, ropePos.y - i * segmentLength, ropePos.z);
      }
      for (let i = 0; i < ropeNumSegments; i++) {
        ropeIndices.push(i, i + 1);
      }

      ropeGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(ropeIndices), 1));
      ropeGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ropePositions), 3));
      ropeGeometry.computeBoundingSphere();
      rope = new THREE.LineSegments(ropeGeometry, ropeMaterial);
      rope.castShadow = true;
      rope.receiveShadow = true;  
      scene.add(rope);

      // Rope physic object
      const softBodyHelpers = new Ammo.btSoftBodyHelpers();
      const ropeStart = new Ammo.btVector3(ropePos.x, ropePos.y, ropePos.z);
      const ropeEnd = new Ammo.btVector3(ropePos.x, ropePos.y + ropeLength, ropePos.z);
      const ropeSoftBody = softBodyHelpers.CreateRope(physicsWorld.getWorldInfo(), ropeStart, ropeEnd, ropeNumSegments - 1, 0);
      const sbConfig = ropeSoftBody.get_m_cfg();
      sbConfig.set_viterations(10);
      sbConfig.set_piterations(10);
      ropeSoftBody.setTotalMass(ropeMass, false);

      // Friction
      // sbConfig.set_kDF(0.1); //摩擦力
      // Damping
      sbConfig.set_kDP(0.135901); //空气阻力
      // Pressure
      // sbConfig.set_kPR(pressure); //压力

      Ammo.castObject(ropeSoftBody, Ammo.btCollisionObject).getCollisionShape().setMargin(margin * 3);
      physicsWorld.addSoftBody(ropeSoftBody, 1, - 1);
      rope.userData.physicsBody = ropeSoftBody;
      // Disable deactivation
      ropeSoftBody.setActivationState(4);

      // Glue the rope extremes to the ball and the arm
      const influence = 1;
      ropeSoftBody.appendAnchor( 0, ballStart.userData.physicsBody, true, influence );
      ropeSoftBody.appendAnchor(ropeNumSegments, ball.userData.physicsBody, true, influence); 

      // 绑定在人体骨骼上的位置，这个位置变化时，可以牵动线性骨骼运动
      bodyCollider.push({rigidbody:ballStart.userData.physicsBody,bone:boneRoot});

      // for (let i = 1; i < ropeNumSegments; i++) {
      //   createRopeNode(i,ropeSoftBody);
      // }


    }
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
      // moveY += 0.01;
      // moveForce.setY(moveY);
      // ballStart.userData.physicsBody.setLinearVelocity(moveForce);
      for (let i = 0; i < bodyCollider.length; i++) {
        const item = bodyCollider[i];
        _YJAmmo.SetPhysicBodyPos(item.rigidbody,item.bone.getWorldPosition(new THREE.Vector3()));
      }
      // _YJAmmo.SetPhysicBodyPos(ballStart.userData.physicsBody,boneRoot.getWorldPosition(new THREE.Vector3()));
      

      // Update rope
      const softBody = rope.userData.physicsBody;
      const ropePositions = rope.geometry.attributes.position.array;
      const numVerts = ropePositions.length / 3;
      const nodes = softBody.get_m_nodes();
      let indexFloat = 0;

      // console.log(numVerts,bones.length);
      for (let i = 0; i < numVerts; i++) {

        const node = nodes.at(i);
        const nodePos = node.get_m_x();
        ropePositions[indexFloat++] = nodePos.x();
        ropePositions[indexFloat++] = nodePos.y();
        ropePositions[indexFloat++] = nodePos.z();

        scene.attach(dummy);
        dummy.position.set(nodePos.x(),nodePos.y(),nodePos.z()); 
        // console.log(" 000 ",dummy.position.clone());

        if(i<bones.length && boneRoot){
          if(i>0){
          }
          
          boneRoot.attach(dummy);
          bones[bones.length-1-i].position.copy(dummy.position.clone()); 
          // bones[i].position.copy(dummy.position.clone().sub(boneRoot.getWorldPosition(new THREE.Vector3()))); 
          // bones[i].position.set(nodePos.x()*0.01,nodePos.y()*0.01,nodePos.z()*0.01); 
        }
        // // if(i==0){
        // //   console.log(" 111 ",dummy.position.clone());
        // //   console.log(bones[i].position.clone());
        // //   bones[i].position.copy(dummy.position.clone()); 
        // // }
      }

      rope.geometry.attributes.position.needsUpdate = true;
    }

    Init();

  }
}

export { YJAmmoRope };