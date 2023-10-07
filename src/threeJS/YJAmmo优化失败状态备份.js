



import * as THREE from "three";
// import * as Ammo from "../../public/threeJS/ammo/ammo.js";

class YJAmmo {
  constructor(scene, enabledAmmo, renderer, _this, playerHeight, playerRadius, callback) {
    let scope = this;
    let enabled = enabledAmmo;
    // Heightfield parameters  地形高度 起伏等
    const terrainWidthExtents = 100;
    const terrainDepthExtents = 100;
    const terrainWidth = 50;
    const terrainDepth = 50;
    const terrainHalfWidth = terrainWidth / 2;
    const terrainHalfDepth = terrainDepth / 2;
    const terrainMaxHeight = 0;
    const terrainMinHeight = 0;



    // Graphics variables
    let container, stats;
    // let camera, scene, renderer;
    let terrainMesh;
    const clock = new THREE.Clock();

    const mouseCoords = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });

    let pos = new THREE.Vector3();
    let quat = new THREE.Quaternion();
    // Physics variables
    let collisionConfiguration;
    let dispatcher;
    let broadphase;
    let solver;
    let physicsWorld;
    let transformAux1;

    let heightData = null;
    let ammoHeightData = null;

    let time = 0;
    const objectTimePeriod = 3;
    let timeNextSpawn = time + objectTimePeriod;
    const maxNumObjects = 30;

    Ammo().then(function (AmmoLib) {

      Ammo = AmmoLib;

      _YJGlobal.Ammo = Ammo;
      _YJGlobal._YJAmmo = scope;

      // console.error(" Ammo.version = "+Ammo.version);
      init();
      animate();

    });

    // const AmmoInstance = new Ammo();
    // init();
    // animate();



    this.GetAmmo = function () {
      return Ammo;
    }
    // let Ammo = AmmoLib;
    // init();
    // animate();
    function init() {

      initPhysics();

      setupContactResultCallback();
      setupContactPairResultCallback();

      YJgenerateObject();
      callback();


      // CreateLift();

      // setTimeout(() => {
      // UpdateLiftByTime("11000",5);
      // }, 5000);

    }
    var normalGravity = -1.8;
    var jumpGravity = -4.8;
    var gravity = -9.8;

    let later_stopFly = null;
    let upSpeed = 1;
    let flySpeed = 1;
    let jumpForce = 4;
    let downForce = 0; //下落的力
    this.addRigidBody = function (body) {
      physicsWorld.addRigidBody(body);
    }
    this.GetPhysicsWorld = function () {
      return physicsWorld;
    }

    function addRigidBodyFn(body) {

      // var broadphaseProxy = body.getBroadphaseProxy();
      // broadphaseProxy.set_m_collisionFilterGroup(1);
      // broadphaseProxy.set_m_collisionFilterMask(3);

      physicsWorld.addRigidBody(body);
    }
    // init();
    // 初始化物理模拟系统
    function initPhysics() {
      // Physics configuration
      collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
      broadphase = new Ammo.btDbvtBroadphase();
      solver = new Ammo.btSequentialImpulseConstraintSolver();
      physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
      physicsWorld.setGravity(new Ammo.btVector3(0, gravity, 0));
      console.log("初始化 ammo  完成");
      transformAux1 = new Ammo.btTransform();



      // var ghostObject = new Ammo.btPairCachingGhostObject();
      // ghostObject.setOverlapFilterCallback({
      //   needBroadphaseCollision: (colObj) => {
      //   }
      // });

      // console.log(physicsWorld.getPairCache());
      // var filterCallback = new Ammo.CustomOverlapFilterCallback(); 
      // // physicsWorld.getPairCache().setOverlapFilterCallback(filterCallback); 
      // filterCallback.needBroadphaseCollision = function(proxy0, proxy1) { 
      //   // 根据需要的逻辑返回 true 或 false
      // }
    }
    let ammoPlaneArray = [];


    // 创建角色脚下的地面碰撞
    this.AddAmmoPlane = function (id, pos) {
      CreateAmmoPlaneFn(id, pos);
    }
    this.RemoveAmmoPlane = function (id) {
      for (let i = ammoPlaneArray.length - 1; i >= 0; i--) {
        var map = ammoPlaneArray[i];
        if (map.id == id) {
          // console.log("删除模型" + sceneModel.name);
          _this.pointsParent.remove(map.model);
          physicsWorld.removeRigidBody(map.model);
          ammoPlaneArray.splice(i, 1);
          continue;
        }
      }
    }

    // 创建地块地面碰撞
    function CreateAmmoPlaneFn(id, _pos) {
      for (let i = 0; i < ammoPlaneArray.length; i++) {
        const element = ammoPlaneArray[i];
        if (element.id == id) { return; }
      }
      // Create the terrain body
      var loaderTex_d = new THREE.TextureLoader();
      var texture = loaderTex_d.load(
        _this.$publicUrl + "models/player/Model/unitychan_tile6.png"
      );
      //贴图平铺
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);


      const c = Math.floor(Math.random() * (1 << 24));
      const mat = new THREE.MeshStandardMaterial({
        color: 0xA7C365,
        // color: c,
        // map: texture,
        castShadow: true,
        transparent: true,
        opacity: 0,
        alphaTest: true,
      });
      // const mesh = new THREE.Mesh(
      //   new THREE.PlaneGeometry(200, 200, 20, 20), mat
      // );
      // mesh.rotation.x = -Math.PI / 2;
      // mesh.receiveShadow = true;
      // _this.pointsParent.add(mesh);

      pos.set(_pos.x, _pos.y - 0.05, _pos.z);
      let size = { w: 40, h: 40 };
      const obstacle = createParalellepiped(size.w, 0.1, size.h, 0, pos, quat, mat);
      obstacle.name = "floor";
      obstacle.receiveShadow = true;
      _this.pointsParent.add(obstacle);

      ammoPlaneArray.push({ id: id, model: obstacle });

      // console.log("初始化 ammo ");
    }


    this.GetMapIdMesh = function (mapId) {
      for (let i = 0; i < ammoPlaneArray.length; i++) {
        if (ammoPlaneArray[i].id == mapId) {
          return ammoPlaneArray[i].model;
        }
      }
      return null;
    }


    const rigidBodies = [];
    function createRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {

      if (pos) {

        object.position.copy(pos);

      } else {

        pos = object.position;

      }

      if (quat) {

        object.quaternion.copy(quat);

      } else {

        quat = object.quaternion;

      }

      const transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      const motionState = new Ammo.btDefaultMotionState(transform);

      const localInertia = new Ammo.btVector3(0, 0, 0);
      physicsShape.calculateLocalInertia(mass, localInertia);

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);

      body.setFriction(0.5);

      if (vel) {

        body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));

      }

      if (angVel) {

        body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z));

      }

      object.userData.physicsBody = body;
      object.userData.collided = false;

      scene.add(object);

      if (mass > 0) {

        rigidBodies.push(object);

        // Disable deactivation
        body.setActivationState(4);

      }

      addRigidBodyFn(body);

      return body;

    }

    let planeItemMesh = null;
    function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
      if (planeItemMesh == null) {
        planeItemMesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
      }
      // 重复的网格使用clone() 提高性能
      // const threeObject = planeItemMesh.clone();
      // threeObject.material = material.clone();

      const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);

      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
      shape.setMargin(margin);

      const body = createRigidBody(threeObject, shape, mass, pos, quat);
      body.threeObject = threeObject;

      return threeObject;

    }

    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    function createTriggerRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {

      if (pos) {
        object.position.copy(pos);
      } else {
        pos = getWorldPosition(object);
        // pos = object.position;
      }
      if (quat) {
        object.quaternion.copy(quat);
      } else {
        quat = object.quaternion;
      }

      const transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      const motionState = new Ammo.btDefaultMotionState(transform);

      const localInertia = new Ammo.btVector3(0, 0, 0);
      physicsShape.calculateLocalInertia(mass, localInertia);

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);

      object.userData.physicsBody = body;
      object.userData.collided = true;
      // console.log("创建trigger ", object.userData);
      // scene.add(object);

      if (mass > 0) {

        // rigidBodies.push(object);

        // Disable deactivation
        body.setActivationState(4);

      }
      // rigidBodies.push(object);
      // 
      addRigidBodyFn(body);
      return body;

    }

    this.removeRigidBody = function (threeObject) {
      // if (threeObject != null && threeObject.userData !=null && threeObject.physicsBody !=null ) {
      //   physicsWorld.removeRigidBody(threeObject.userData.physicsBody);
      //   // rigidBodies.remove(threeObject);
      // }

      if (threeObject.userData.physicsBody != null) {
        physicsWorld.removeRigidBody(threeObject.userData.physicsBody);
        // console.log("移除现有碰撞");
      }

    }

    function createColliderRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {

      if (pos) {
        // object.position.copy(pos);
      } else {
        pos = object.position;
      }
      if (quat) {
        // object.quaternion.copy(quat);
      } else {
        // quat = object.quaternion;
      }

      const transform = new Ammo.btTransform();
      transform.setIdentity();


      pos = getWorldPosition(object);
      quat = object.getWorldQuaternion(new THREE.Quaternion());

      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      const motionState = new Ammo.btDefaultMotionState(transform);

      const localInertia = new Ammo.btVector3(0, 0, 0);
      physicsShape.calculateLocalInertia(mass, localInertia);

      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);

      object.userData.physicsBody = body;
      // object.userData.collided = true;
      // console.log("创建trigger ", object.userData);
      // scene.add(object);

      // body.setCollisionFlags(2); 
      // console.log( " 默认碰撞类型 " , body.getCollisionFlags());

      if (mass > 0) {

        rigidBodies.push(object);

        // Disable deactivation
        body.setActivationState(4);

      }
      // rigidBodies.push(object);

      addRigidBodyFn(body);
      return body;

    }




    //创建检测用的trigger, 能与刚体做碰撞检测，但不阻挡刚体。 在视图中看不见
    function createTrigger(sx, sy, sz, pos, quat) {
      if (triggerMat == null) {

        triggerMat = new THREE.MeshPhongMaterial({
          color: 0x60606066,
          // alphaTest:true, 
          transparent: true,
          opacity: 0
        });
      }
      const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), triggerMat);
      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
      shape.setMargin(margin);

      const body = createTriggerRigidBody(threeObject, shape, 0, pos, quat);
      threeObject.userData.tag = "trigger";
      body.setCollisionFlags(4); //flag 设为4 ，将变为trigger

      // console.log(" getCollisionFlags = " + body.getCollisionFlags() );
      // console.log(" isKinematicObject = " + body.isKinematicObject() );
      body.threeObject = threeObject;
      return threeObject;
    }



    this.createCylinderTrigger = function (mesh, size, id, triggerName, owner) {

      const trigger = createCylinderTriggerFn(mesh, size.x, size.y, size.z);
      trigger.triggerName = triggerName;
      trigger.modelId = id;
      trigger.owner = owner;
      return trigger;
    }
    // 创建圆柱体碰撞。 圆柱体网格由外部传入。 做npc的碰撞
    function createCylinderTriggerFn(mesh, sx, sy, sz) {
      // const material = new THREE.MeshPhongMaterial({
      //   color: 0x0000ff,
      //   transparent: true,
      //   opacity: 0.9,
      // });
      // mesh.material = material;
      const threeObject = mesh;
      const shape = new Ammo.btCylinderShape(new Ammo.btVector3(sx, sy, sz));
      shape.setMargin(margin);
      const body = createTriggerRigidBody(threeObject, shape, 0);
      threeObject.userData.tag = "trigger";
      body.setCollisionFlags(4); //flag 设为4 ，将变为trigger
      body.threeObject = threeObject;
      return threeObject;
    }




    //把角色作为刚体的子物体，让角色跟随刚体运动
    this.SetPlayerParent = function (playerParent) {
      myCtrlRb.add(playerParent);
    }
    var myCtrlRb = null;
    var myCtrlRbChild = null;
    var rigidbody = null;
    const margin = 0.05;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var inShift = false;



    const STATE = { DISABLE_DEACTIVATION: 4 };
    //#region
    //#endregion

    //#region 创建trigger  collider
    //创建trigger. 由可交互模型传入trigger 的 mesh
    var triggerMat = null;
    this.createBoxTrigger = function (size, pos, quat, id, triggerName) {
      // pos.set(6, 0.5, 20);
      // quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0 * Math.PI / 180);
      const trigger = createTrigger(size.x, size.y, size.z, pos, quat);
      trigger.triggerName = triggerName;
      // trigger.name = "我是trigger";
      trigger.modelId = id;
      return trigger;
    }
    this.createBoxTrigger2 = function (mesh, size, id, triggerName, owner) {
      const trigger = createBoxTriggerFn(mesh, size);
      trigger.triggerName = triggerName;
      trigger.modelId = id;
      trigger.owner = owner;
      return trigger;
    }

    function createBoxTriggerFn(mesh, size, pos, quat) {

      if (size == null) {
        size = { x: 1, y: 1, z: 1 };
      }
      const threeObject = mesh;

      const shape = new Ammo.btBoxShape(new Ammo.btVector3(size.x, size.y, size.z) * 0.5);
      shape.setMargin(margin);

      const body = createTriggerRigidBody(threeObject, shape, 0, pos, quat);
      threeObject.userData.tag = "trigger";
      body.setCollisionFlags(4); //flag 设为4 ，将变为trigger

      body.threeObject = threeObject;
      return threeObject;
    }

    let colliderMat = null;
    let _vec3_1;
    //凸包碰撞体
    function GetbtConvexHullShape(triangles, _scale) {
      const scale = [_scale.x, _scale.y, _scale.z];
      var triangle, triangle_mesh = new Ammo.btTriangleMesh;
      var shape = new Ammo.btConvexHullShape();
      let vectA = new Ammo.btVector3(0, 0, 0);
      let vectB = new Ammo.btVector3(0, 0, 0);
      let vectC = new Ammo.btVector3(0, 0, 0);
      for (let i = 0; i < triangles.length - 3; i += 3) {
        triangle = triangles[i];
        vectA.setX(triangles[i].x * scale[0]);
        vectA.setY(triangles[i].y * scale[1]);
        vectA.setZ(triangles[i].z * scale[2]);
        shape.addPoint(vectA, true);

        vectB.setX(triangles[i + 1].x * scale[0]);
        vectB.setY(triangles[i + 1].y * scale[1]);
        vectB.setZ(triangles[i + 1].z * scale[2]);
        shape.addPoint(vectB, true);

        vectC.setX(triangles[i + 2].x * scale[0]);
        vectC.setY(triangles[i + 2].y * scale[1]);
        vectC.setZ(triangles[i + 2].z * scale[2]);
        shape.addPoint(vectC, true);

        triangle_mesh.addTriangle(vectA, vectB, vectC, true);

      }
      return shape;
    }
    //凹包碰撞体
    function GetbtBvhTriangleMeshShape(triangles, _scale) {



      const scale = [_scale.x, _scale.y, _scale.z];
      var triangle, triangle_mesh = new Ammo.btTriangleMesh;
      let vectA = new Ammo.btVector3(0, 0, 0);
      let vectB = new Ammo.btVector3(0, 0, 0);
      let vectC = new Ammo.btVector3(0, 0, 0);
      // for (let i = 0; i < triangles.length ; i ++) {
      //   triangle = triangles[i];
      //   vectA.setX(triangles[i].x * scale[0]);
      //   vectA.setY(triangles[i].y * scale[1]);
      //   vectA.setZ(triangles[i].z * scale[2]);

      //   vectB.setX(triangles[i + 1].x * scale[0]);
      //   vectB.setY(triangles[i + 1].y * scale[1]);
      //   vectB.setZ(triangles[i + 1].z * scale[2]);

      //   vectC.setX(triangles[i + 2].x * scale[0]);
      //   vectC.setY(triangles[i + 2].y * scale[1]);
      //   vectC.setZ(triangles[i + 2].z * scale[2]);

      //   triangle_mesh.addTriangle(vectA, vectB, vectC, true); 
      // }
      for (let i = 0; i < triangles.length - 3; i += 3) {
        vectA.setX(triangles[i].x * scale[0]);
        vectA.setY(triangles[i].y * scale[1]);
        vectA.setZ(triangles[i].z * scale[2]);

        vectB.setX(triangles[i + 1].x * scale[0]);
        vectB.setY(triangles[i + 1].y * scale[1]);
        vectB.setZ(triangles[i + 1].z * scale[2]);

        vectC.setX(triangles[i + 2].x * scale[0]);
        vectC.setY(triangles[i + 2].y * scale[1]);
        vectC.setZ(triangles[i + 2].z * scale[2]);

        triangle_mesh.addTriangle(vectA, vectB, vectC, true);
      }
      let shape = new Ammo.btBvhTriangleMeshShape(triangle_mesh, true, true);

      return shape;
    }


    // 新的凹包碰撞计算，使用此生成凹包碰撞
    function GetTriangleMeshShap(Entity, _scale) {
      let vertices = Entity.geometry.getAttribute('position').array;
      let indices = Entity.geometry.index.array;
      if (!_scale) {
        _scale = { x: 1, y: 1, z: 1 };
      }
      const scale = [_scale.x, _scale.y, _scale.z];

      const mesh = new Ammo.btTriangleMesh(true, true);
      mesh.setScaling(new Ammo.btVector3(scale[0], scale[1], scale[2]));
      for (let i = 0; i * 3 < indices.length; i++) {
        mesh.addTriangle(
          new Ammo.btVector3(vertices[indices[i * 3] * 3], vertices[indices[i * 3] * 3 + 1], vertices[indices[i * 3] * 3 + 2]),
          new Ammo.btVector3(vertices[indices[i * 3 + 1] * 3], vertices[indices[i * 3 + 1] * 3 + 1], vertices[indices[i * 3 + 1] * 3 + 2]),
          new Ammo.btVector3(vertices[indices[i * 3 + 2] * 3], vertices[indices[i * 3 + 2] * 3 + 1], vertices[indices[i * 3 + 2] * 3 + 2]),
          false
        );
      }
      const shape = new Ammo.btBvhTriangleMeshShape(mesh, true, true);
      // console.log("凹包，用模型网格制作 ", indices);
      return shape;
    }
    this.createMeshTrigger = function (Entity, _scale, pos, quat, id, triggerName) {
      // return;
      // pos.set(6, 0.5, 20);
      // quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0 * Math.PI / 180);
      if (colliderMat == null) {
        // colliderMat = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0.1 });
      }
      const threeObject = Entity;
      if (threeObject.userData.physicsBody != null) {
        physicsWorld.removeRigidBody(threeObject.userData.physicsBody);
        // console.log("移除现有碰撞");
      }

      // threeObject.material = colliderMat;

      let shape;
      // console.log(Entity.geometry);
      let vertices = Entity.geometry.getAttribute('position').array;
      let triangles = [];
      for (let i = 0; i < vertices.length - 3; i += 3) {
        triangles.push({
          x: vertices[i],
          y: vertices[i + 1],
          z: vertices[i + 2]
        })
      }

      //凸包
      shape = GetbtConvexHullShape(triangles, _scale);
      //凹包，用模型网格制作
      // shape = GetbtBvhTriangleMeshShape(triangles,_scale);


      shape.setMargin(margin);

      const body = createColliderRigidBody(threeObject, shape, 0, pos, quat);
      threeObject.userData.tag = "collider";

      // console.log(" getCollisionFlags = " + body.getCollisionFlags() );
      // console.log(" isKinematicObject = " + body.isKinematicObject() );
      body.threeObject = threeObject;
      // body.triggerName = triggerName;
      // body.modelId = id;

    }

    //加载凹包碰撞体
    this.CreateTriangeMeshCollider = function (Entity, _scale, pos, quat, id, triggerName) {
      // return;
      // pos.set(6, 0.5, 20);
      // quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0 * Math.PI / 180);
      if (colliderMat == null) {
        // colliderMat = new THREE.MeshPhongMaterial({ color: 0xffff00, transparent: true, opacity: 0.1 });
      }
      const threeObject = Entity;
      if (threeObject.userData.physicsBody != null) {
        physicsWorld.removeRigidBody(threeObject.userData.physicsBody);
        // console.log("移除现有碰撞");
      }

      // threeObject.material = colliderMat;

      let shape;

      // let vertices = Entity.geometry.getAttribute('position').array;
      // let triangles = [];
      // for (let i = 0; i < vertices.length; i += 3) {
      //   triangles.push({
      //     x: vertices[i],
      //     y: vertices[i + 1],
      //     z: vertices[i + 2]
      //   })
      // }

      //凸包
      // shape = GetbtConvexHullShape(triangles,_scale);
      //凹包，用模型网格制作
      // shape = GetbtBvhTriangleMeshShape(triangles, _scale);
      shape = GetTriangleMeshShap(Entity, _scale);




      shape.setMargin(margin);

      const body = createColliderRigidBody(threeObject, shape, 0, pos, quat);
      threeObject.userData.tag = "collider";

      // console.log(" getCollisionFlags = " + body.getCollisionFlags() );
      // console.log(" isKinematicObject = " + body.isKinematicObject() );
      body.threeObject = threeObject;
      // body.triggerName = triggerName;
      // body.modelId = id;

    }



    //加载凹包 trigger
    this.CreateTriangeMeshTrigger = function (mesh, _scale, id, triggerName, owner) {
      const threeObject = mesh;
      let shape;
      //凹包，用模型网格制作
      shape = GetTriangleMeshShap(mesh, _scale);
      shape.setMargin(margin);

      const body = createTriggerRigidBody(threeObject, shape, 0);
      threeObject.userData.tag = "trigger";
      body.setCollisionFlags(4); //flag 设为4 ，将变为trigger
      body.threeObject = threeObject;
      body.triggerName = triggerName;
      body.modelId = id;
      body.owner = owner;
      threeObject.modelId = id;
      threeObject.owner = owner;
      threeObject.triggerName = triggerName;

    }


    //#endregion


    //重力开关
    let enableGravity = false;
    let flyDoonce = 0;

    // 仅跳跃切换玩家位置，切换玩家位置时，不显示飞行器
    let jumpOnly = false;
    this.SetJumpOnly = function (b) {
      jumpOnly = b;
    }
    this.SetGravityActive = function (b) {
      enableGravity = b;
      SetGravityActiveFn();
    }
    this.GetGravityActive = function () {
      return enableGravity;
    }
    this.ToggleGravityActive = function () {
      enableGravity = !enableGravity;
      SetGravityActiveFn();
    }
    function SetGravityValue(g) {
      return;
      gravity = g;
      // rigidbody.setGravity(new Ammo.btVector3(0, g, 0));
      rigidbody.setGravity(new Ammo.btVector3(0, gravity, 0));
      // console.log("设置重力 ", gravity);
    }

    function SetGravityActiveFn() {
      if (enableGravity) {
        rigidbody.setGravity(new Ammo.btVector3(0, gravity, 0));

        // 恢复重力后，取消跳跃状态
        // setJumpToFalse();

        flyDoonce = -1;
        moveSpeed = walkSpeed;
      } else {
        rigidbody.setGravity(new Ammo.btVector3(0, 0, 0));
        flyDoonce = 0;
        moveSpeed = flySpeed;

      }
      _this.YJController.SetFlyMountDisplay(!enableGravity && !jumpOnly);

    }

    this.SetIsMoving = function (b) {
      IsMoving(b);
    }
    let ismoving = false;
    //在移动时，摩擦力设为0，让刚体能平滑移动，且在爬坡时更顺利
    function IsMoving(b) {
      if (ismoving == b) { return; }
      ismoving = b;
      rigidbody.setFriction(b ? 0.1 : 2);
    }


    this.SetPhysicBodyPos = function (rigidbody, pos, rotaY) {
      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 3; i++) {
          ms.setWorldTransform(transformAux1);
          transformAux1.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
          if (rotaY != undefined) {
            quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotaY);
            transformAux1.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
          }
        }
        const p = transformAux1.getOrigin();
        rigidbody.threeObject.position.set(p.x(), p.y(), p.z());
        if (rotaY != undefined) {
          const q = transformAux1.getRotation();
          rigidbody.threeObject.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
        rigidbody.setMotionState(ms);
      }
    }


    this.SetPlayerPos = function (pos) {
      // console.error(" 设置玩家坐标 ");
      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 3; i++) {
          ms.setWorldTransform(transformAux1);
          // transformAux1.setOrigin(pos);
          // transformAux1.setOrigin(new Ammo.btVector3(10, 1,0));
          transformAux1.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        }
        const p = transformAux1.getOrigin();
        myCtrlRb.position.set(p.x(), p.y(), p.z());
        rigidbody.setMotionState(ms);
      }
    }
    this.SetPlayerRota = function (rotaV3) {
      myCtrlRb.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
    }

    this.SetOnlyPlayerPos = function (pos) {
      // myCtrlRb.position.set(pos.x, pos.y, pos.z);
      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 2; i++) {
          ms.setWorldTransform(transformAux1);
          transformAux1.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        }
        const p = transformAux1.getOrigin();
        myCtrlRb.position.set(p.x(), p.y(), p.z());
        rigidbody.setMotionState(ms);
      }
    }

    this.GetPlayerPos = function () {
      return myCtrlRb.getWorldPosition(new THREE.Vector3());
    }



    this.onKeyDown = function (event) {
      rigidbody.setActivationState(true);

      // console.log(moveForce);
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward = true;
          break;

        case 'ArrowLeft':
        // myCtrlRb.rotation.y += 0.1;
        // break;
        case 'KeyA': moveLeft = true; break;

        case 'ArrowDown':
        case 'KeyS': moveBackward = true; break;

        case 'ArrowRight':
        // myCtrlRb.rotation.y -= 0.1;
        // break;
        case 'KeyD': moveRight = true; break;

        case 'ShiftLeft':
          inShift = true;
          break;
        case 'Space':
          if (enableGravity) {
            if (inJumping) { return; }

            // 重力Y值
            let yy = rigidbody.getLinearVelocity().y();
            if (yy > 0.1) { return; }
            b_checkOverlap = false;
            oldoverlapArray = [];
            overlapArray = [];

            if (moveForward || moveBackward || moveLeft || moveRight) {
              downForce = 0;
              moveForce.setY(jumpForce - 2);
            } else {
              moveForce.setY(jumpForce);
            }

            rigidbody.setLinearVelocity(moveForce);
            inJumping = true;

            setTimeout(() => {
              b_checkOverlap = true;
            }, 500);
          } else {
            this.SetJumpFly();
          }
          break;
      }

    };

    this.onKeyUp = function (event) {

      switch (event.code) {

        case 'ArrowUp':
        case 'KeyW': moveForward = false; break;

        case 'ArrowLeft':
        case 'KeyA': moveLeft = false; break;

        case 'ArrowDown':
        case 'KeyS': moveBackward = false; break;

        case 'ArrowRight':
        case 'KeyD': moveRight = false; break;

        case 'ShiftLeft':
          inShift = false;
          break;
        case 'Space':

          break;
      }

    };


    // 飞行状态 ，一直上升
    this.SetJumpFly = function () {
      // 有重力的情况下，不允许飞行
      if (enableGravity) { return; }
      moveForce.setY(upSpeed);
      rigidbody.setLinearVelocity(moveForce);
      if (later_stopFly != null) {
        clearTimeout(later_stopFly);
      }
      later_stopFly = setTimeout(() => {
        moveForce.setY(-0.0);
        rigidbody.setLinearVelocity(moveForce);
      }, 100);

      flyDoonce++;
      moveSpeed = flySpeed;

    }


    this.SetMoveForward = function (b) {
      moveForward = b;
    }
    // 角色面向目标点，目标点为点击的地面位置
    this.lookAtPos = function (pos) {
      myCtrlRb.lookAt(pos);
    }

    this.onblur = function () {
      moveForward = false;
      moveLeft = false;
      moveRight = false;
      moveBackward = false;
    }

    //#region 
    //#endregion

    //#region 创建自运动的物体，如 升降梯、摆渡车

    //设置刚体位置。
    function SetBodyPos(threeObject, rigidbody, pos, direction) {
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

    this.SetColliderPos = (threeObject, _pos) => {

      let rigidbody = threeObject.userData.physicsBody;


      // let rigidbody = threeObject.rigidbody;
      let pos = new Ammo.btVector3(_pos.x, _pos.y, _pos.z)
      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 2; i++) {
          ms.setWorldTransform(transformAux1);
          transformAux1.setOrigin(pos);
        }

        const p = transformAux1.getOrigin();
        // threeObject.position.set(p.x(), p.y(), p.z());
        rigidbody.setMotionState(ms);
      }
    }

    this.MoveColliderPos = (threeObject, _pos) => {

      let rigidbody = threeObject.userData.physicsBody;
      // let rigidbody = threeObject.rigidbody;
      let pos = new Ammo.btVector3(_pos.x, _pos.y, _pos.z)

      rigidbody.setLinearVelocity(pos);
      const ms = rigidbody.getMotionState();
      if (ms) {
        ms.getWorldTransform(transformAux1);
        const p = transformAux1.getOrigin();
        threeObject.position.set(p.x(), p.y(), p.z());
      }

    }

    //设置刚体位置。
    function SetPlayerBodyPos(pos) {

    }


    //#endregion

    // 恢复重力后，取消跳跃状态、角色碰到碰撞体也取消跳跃状态
    function setJumpToFalse() {
      _this.YJController.setJumpToFalse();
      jumpTime = 0;
      inJumping = false;
      SetGravityValue(normalGravity);
    }

    function MoveRigidbody(fb, lr, x, y) {
      let dir = new THREE.Vector3(0, 0, 0);
      myCtrlRb.getWorldDirection(dir);
      let dirChild = new THREE.Vector3(0, 0, 0);
      myCtrlRbChild.getWorldDirection(dirChild);
      if (enableGravity) {


      } else {


        if (!inJumping) {
        }

        //飞行模式
        //飞行模式朝摄像机方向前进后退
        let dirY = _this.YJController.GetCamTargetWorldDire().y;
        // console.log(" in fly ",dirY);
        if (moveForward) {
          // 在飞行模式，刚体垂直力/方向由摄像机朝向决定
          moveForce.setY(dirY * -moveSpeed);
        } else if (moveBackward) {
          // 在飞行模式，后退时，反向摄像机添加力
          moveForce.setY(dirY * moveSpeed);
        } else {
          moveForce.setY(0);
        }
      }


      let dx = x;
      let dz = y;

      let moveForceX = 0;
      let moveForceZ = 0;
      if (fb) {
        moveForceX = (dir.x * dz * moveSpeed);
        moveForceZ = (dir.z * dz * moveSpeed);
      }
      if (lr) {
        moveForceX = (dirChild.x * dx * moveSpeed);
        moveForceZ = (dirChild.z * dx * moveSpeed);
      }
      if (fb && lr) {
        moveForceX = (((dir.x * dz) + (dirChild.x * dx)) * 0.7 * moveSpeed);
        moveForceZ = (((dir.z * dz) + (dirChild.z * dx)) * 0.7 * moveSpeed);
      }

      // console.log(" 移动速度 moveSpeed = " + moveSpeed);
      // console.log(" 力值 ",moveForceX,moveForceZ);
      // console.log("执行移动刚体", moveForceX, moveForceZ);

      moveForce.setX(moveForceX);
      moveForce.setZ(moveForceZ);

      rigidbody.setLinearVelocity(moveForce);

    }

    var laterDownForce = null;
    let b_checkOverlap = true;
    let inFloating = false;
    let downForceSpeed = 0.4;
    //试试判断与角色碰到的碰撞体
    function CheckOverlap() {
      if (!b_checkOverlap) { return; }
      //未碰到任何物体，表示腾空
      if (oldoverlapArray.length != 0 && overlapArray.length != 0) {

        // console.log(" ==落地 ！！！ ",oldoverlapArray, overlapArray);
        // console.log(" ==落地 ！！！ ", inFloating, moveForce.y(), rigidbody.getLinearVelocity().y());
        console.log(" ==落地 !!!! ", downForce, rigidbody.getLinearVelocity().y());

        if (enableGravity) {
          // if(jumpTime==0){
          //   if (downForce >= -9) {
          //     downForce -= downForceSpeed;
          //   } else {
          //   }
          //   moveForce.setY(downForce);
          //   rigidbody.setLinearVelocity(moveForce);
          // }


          if (inFloating) {
            // if (downForce >= -9) {
            //   downForce -= downForceSpeed;
            // } else {
            // }
            // moveForce.setY(downForce);
            // rigidbody.setLinearVelocity(moveForce);
          } else {
          }

          if (inJumping) {

            if (downForce >= -9) {
              downForce -= downForceSpeed;
            } else {
            }
            moveForce.setY(downForce);
            rigidbody.setLinearVelocity(moveForce);
            moveForce.setY(0);


            // let yy = rigidbody.getLinearVelocity().y();
            // if (yy <= 0.1) {
            //   moveForce.setY(0);
            //   downForce = 0;
            //   setJumpToFalse();
            // }
          }


          // let yy = rigidbody.getLinearVelocity().y();
          // const veY = Math.abs(yy);

          // if (veY <= 0.1) {
          // } else {
          //   if (downForce >= -9) {
          //     downForce -= downForceSpeed;
          //   } else {
          //   }
          //   moveForce.setY(downForce);
          //   rigidbody.setLinearVelocity(moveForce);
          // }

          // if (inFloating) {
          //   let yy = rigidbody.getLinearVelocity().y(); 
          //   if (yy <= 0.1) {
          //     moveForce.setY(0);
          //     downForce = 0;
          //     inFloating = false;
          //   } else {

          //     if (downForce >= -9) {
          //       downForce -= downForceSpeed;
          //     } else {
          //     }
          //     moveForce.setY(downForce);
          //     rigidbody.setLinearVelocity(moveForce);
          //   }

          // } else {
          //   if (downForce >= -9) {
          //     downForce -= downForceSpeed;
          //     moveForce.setY(downForce);
          //     rigidbody.setLinearVelocity(moveForce);
          //   } else {
          //     let yy = rigidbody.getLinearVelocity().y();
          //     if (yy <= 0.1) {
          //       moveForce.setY(0);
          //       setJumpToFalse();
          //     } else {
          //       moveForce.setY(downForce);
          //       rigidbody.setLinearVelocity(moveForce);
          //     }
          //   }
          // }


        }

      } else {
        if (enableGravity) {
          jumpTime = 0;
          if (!inFloating) {
            inFloating = true;
            downForce = 0;
          }
          if (downForce >= -9) {
            downForce -= downForceSpeed;
          } else {
          }
          moveForce.setY(downForce);
          rigidbody.setLinearVelocity(moveForce);
          moveForce.setY(0);
        }
      }



      //提取增加的
      for (let i = 0; i < overlapArray.length; i++) {
        const newItem = overlapArray[i];
        let hasIn = false;
        for (let ii = 0; ii < oldoverlapArray.length; ii++) {
          const oldItem = oldoverlapArray[ii];
          if (newItem == oldItem) {
            hasIn = true;
          }
        }
        if (!hasIn) {
          if (newItem == undefined) { continue; }
          //增加的
          let tag = newItem.userData.tag;
          if (tag == "trigger") {
            console.log(" 进入 碰撞到物体的 trigger, ", newItem.triggerName, newItem.modelId);
            if (newItem.triggerName == "platform") {
              SetMyCtrlRbParent(newItem.owner.GetModel(), newItem.modelId);
              continue;
            }
            _this._YJSceneManager.ChangeJiaohuArea(true, newItem.modelId, newItem.triggerName, newItem);

          }
        }
      }


      //提取移除的
      for (let i = 0; i < oldoverlapArray.length; i++) {
        const newItem = oldoverlapArray[i];
        let hasOut = false;
        for (let ii = 0; ii < overlapArray.length; ii++) {
          const oldItem = overlapArray[ii];
          if (newItem == oldItem) {
            hasOut = true;
          }
        }
        if (!hasOut) {
          if (newItem == undefined) { continue; }
          //移除的
          let tag = newItem.userData.tag;
          if (tag == "trigger") {
            console.log("离开 碰撞到物体的 trigger, ", newItem.triggerName, newItem.modelId);
            if (newItem.triggerName == "platform") {
              SetMyCtrlRbParent(scene, "scene");
              continue;
            }
            _this._YJSceneManager.ChangeJiaohuArea(false, newItem.modelId, newItem.triggerName, newItem);

          }
        }
      }


      //重新赋值旧的,并且清空新的
      oldoverlapArray = [];
      for (let i = 0; i < overlapArray.length; i++) {
        oldoverlapArray.push(overlapArray[i]);
      }
      overlapArray = [];

    }

    //设置角色刚体的父物体。做角色上车、进入移动平台、移动的船 SetPlayerParent
    this.SetMyCtrlRbParent = function (parent, onlyRotaView) {
      parent.attach(myCtrlRb);

      //上车、上船后，让角色只能旋转视角
      if (onlyRotaView != undefined) {
        _this.YJController.SetOnlyRotaView(onlyRotaView);
        enabled = !onlyRotaView;
      }
    }
    function SetMyCtrlRbParent(parent, id) {
      parent.attach(myCtrlRb);
      if (_this.$parent.$parent.$refs.YJDync) {
        _this.$parent.$parent.$refs.YJDync._YJDyncManager.SendPlayerParent(id, "升降台");
      }
    }
    this.CancelMoving = function () {

      moveForward = false;
      moveBackward = false;
      moveLeft = false;
      moveRight = false;
      offsetTime = 0;
      if (!inJoystick) {
        rigidbody.setLinearVelocity(-moveForce);
        moveForce.setX(0);
        moveForce.setZ(0);
        hasInput = false;
        moveBegin = false;
        moveEnd = false;
        IsMoving(false);
      }
    }

    //#region  不变的

    function setupContactPairResultCallback() {

      cbContactPairResult = new Ammo.ConcreteContactResultCallback();

      cbContactPairResult.hasContact = false;

      cbContactPairResult.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {

        let contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);

        const distance = contactPoint.getDistance();

        if (distance > 0) return;

        this.hasContact = true;
        console.log("碰到物体" + colObj0Wrap);
      }

    }

    //实时碰撞检测
    function checkContact() {
      physicsWorld.contactTest(myCtrlRb.userData.physicsBody, cbContactResult);
    }

    this.checkContactOverlap = function (physicsBody, _cbContactResult) {
      physicsWorld.contactTest(physicsBody, _cbContactResult);
    }





    function createObjectMaterial() {

      const c = Math.floor(Math.random() * (1 << 24));
      return new THREE.MeshPhongMaterial({ color: c });

    }

    function detectCollision() {

      let dispatcher = physicsWorld.getDispatcher();
      let numManifolds = dispatcher.getNumManifolds();

      for (let i = 0; i < numManifolds; i++) {

        let contactManifold = dispatcher.getManifoldByIndexInternal(i);
        let numContacts = contactManifold.getNumContacts();

        for (let j = 0; j < numContacts; j++) {

          let contactPoint = contactManifold.getContactPoint(j);
          let distance = contactPoint.getDistance();

          console.log({ manifoldIndex: i, contactIndex: j, distance: distance });

        }
      }

    }


    let cbContactResult, cbContactPairResult;

    let oldtriggerId, oldtriggerName;
    let triggerdonce = 0;
    let overlapArray = [];
    let oldoverlapArray = [];
    //角色刚体 碰到的物体
    function setupContactResultCallback() {

      cbContactResult = new Ammo.ConcreteContactResultCallback();

      cbContactResult.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {

        let contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);

        const distance = contactPoint.getDistance();

        // console.log("contactPoint.getDistance()  =  " +  distance);
        if (distance > 0.21) return;

        let colWrapper0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);
        let rb0 = Ammo.castObject(colWrapper0.getCollisionObject(), Ammo.btRigidBody);

        let colWrapper1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);
        let rb1 = Ammo.castObject(colWrapper1.getCollisionObject(), Ammo.btRigidBody);

        // console.log("rb0 = " , rb0);
        // console.log("rb1 = " , rb1);

        let threeObject0 = rb0.threeObject;
        let threeObject1 = rb1.threeObject;

        // console.log("rb1 = " , rb1);

        // let tag, localPos, worldPos
        // if (threeObject0.userData.tag != "ball") {

        //   tag = threeObject0.userData.tag;
        //   localPos = contactPoint.get_m_localPointA();
        //   worldPos = contactPoint.get_m_positionWorldOnA();

        // }
        // else {
        //   if (threeObject1 == undefined) {
        //     // console.log("碰撞到的物体 未设置tag ，可能是地面 或 墙 ");
        //     // console.log("碰撞到的物体，未设置");
        //     return;
        //   }
        //   tag = threeObject1.userData.tag;

        //   localPos = contactPoint.get_m_localPointB();
        //   worldPos = contactPoint.get_m_positionWorldOnB();

        // }

        // if (tag == undefined) {
        //   // console.log("碰撞到的物体 未设置tag ，可能是地面 或 墙 ");
        //   return;
        // }

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

        // 当在飞行模式且已经飞行后，碰到地面时，取消飞行模式（即启用重力）
        if (!enableGravity && flyDoonce > 10) {
          if (threeObject1.name.indexOf("land") > -1) {
            enableGravity = true;
            SetGravityActiveFn();
            // console.error("碰到地面激活重力");
          }
        }

        // console.log("碰撞到的物体，" + threeObject1.userData.tag,flyDoonce);
        // console.log("碰撞到的物体，" ,overlapArray);

        return;
        // if (tag == "trigger") {
        //   let newId = threeObject1.modelId;
        //   let newName = threeObject1.triggerName;
        //   if(triggerdonce == 1 && newId == oldtriggerId && newName == oldtriggerName){
        //     // 正在同一trigger中保持 hover trigger
        //    console.log(" 保持在 trigger,modelId = ",threeObject1.modelId);
        //     return;
        //   }
        //   if(triggerdonce == 0){
        //     //第一次进入trigger

        //     triggerdonce = 1;

        //     //进入新trigger
        //     oldtriggerId = newId;
        //     oldtriggerName = newName;
        //   }

        //   console.log("碰撞到的物体 的 trigger,modelId = ",threeObject1.modelId);
        //   return;
        // }

        // triggerdonce = 0;
        // if(oldtriggerId != ""){
        //   console.log(" exit trigger,modelId = ",oldtriggerId);
        //   oldtriggerId = "";
        //   oldtriggerName = "";
        // }

        let localPosDisplay = { x: localPos.x(), y: localPos.y(), z: localPos.z() };
        let worldPosDisplay = { x: worldPos.x(), y: worldPos.y(), z: worldPos.z() };

        console.log({ tag, localPosDisplay, worldPosDisplay });

      }

    }
    //#endregion

    this.SetEnabled = function (e) {
      if (enabled == e) { return; }
      enabled = e;
      if (enabled) {
        animate();
      }
    }
    function animate() {

      requestAnimationFrame(animate);
      if (!enabled) {
        return;
      }
      render();

    }
    this.update = function () {

      if (!enabled) {
        return;
      }
      render();
    }

    const FPS = 60; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;

    function render() {


      const deltaTime = clock.getDelta();
      // // time += deltaTime;
      // timeStamp += deltaTime;

      // if (timeStamp > singleFrameTime) {
      //   timeStamp = timeStamp % singleFrameTime;
      // }

      updatePhysics(deltaTime);


    }

    function updatePhysics(deltaTime) {

      physicsWorld.stepSimulation(deltaTime, 10);

      // Update objects
      for (let i = 0, il = rigidBodies.length; i < il; i++) {

        const objThree = rigidBodies[i];
        const objPhys = objThree.userData.physicsBody;
        const ms = objPhys.getMotionState();
        if (ms) {

          ms.getWorldTransform(transformAux1);
          const p = transformAux1.getOrigin();
          const q = transformAux1.getRotation();
          objThree.position.set(p.x(), p.y(), p.z());
          objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

        }

      }


      // detectCollision();
      UpdateMyUser();
      checkContact();
      CheckOverlap();

    }
    var hasInput = false;
    var moveForce;
    var inJumping = false;

    let inJoystick = false;

    //摇杆控制移动
    this.MoveByJoystickAxis = (x, y) => {
      // return;
      // if(inJumping){return;}
      if (x == 0 && y == 0) {
        if (hasInput) {

          rigidbody.setLinearVelocity(-moveForce);
          moveForce.setX(0);
          moveForce.setZ(0);

          hasInput = false;
          inJoystick = false;
          IsMoving(false);
        }
        return;
      }
      hasInput = true;
      IsMoving(true);
      inJoystick = true;


      if (inShift) {
        moveSpeed = runSpeed;
      } else {
        moveSpeed = walkSpeed;
      }

      let dx = 0;
      let dz = 0;
      let fb = false;
      let lr = false;

      if (Math.abs(x) > 0.1) {
        lr = true;
        // dx = x>0?1:-1;
        dx = x * 1.5;
      }
      if (Math.abs(y) > 0.1) {
        fb = true;
        // dz = y>0?1:-1;
        dz = y * 1.5;
      }
      MoveRigidbody(fb, lr, dx, dz);

      // console.log("模拟摇杆输入 2222222 ",moveForce);

    }


    let offsetTime = 0;

    let oldPos = new THREE.Vector3(0, 0, 0);

    // 辅助移动
    // 在移动中，判断是否被障碍物阻挡，如阻挡，则增加前进速度，帮助跨越障碍 
    // 行走时能忽略矮的碰撞体，不被矮的碰撞体阻挡
    function CheckForwardCollider() {
      return;
      let pos = myCtrlRb.getWorldPosition(new THREE.Vector3());
      let distance = oldPos.distanceTo(pos);
      // console.log(offsetTime,distance);
      offsetTime++;
      if (offsetTime >= 5) {
        if (Math.abs(distance) < 0.01) {
          // console.log("碰撞矮障碍");
          // 没有移动，说明碰到了障碍物，则增加前进速度  
          moveSpeed *= 10;
        }
        offsetTime = 0;
      }
      oldPos = pos.clone();
    }

    //pc web端键盘控制移动端速度
    let minSpeed = 1.5;
    let maxSpeed = 5;
    var moveSpeed = minSpeed;
    let walkSpeed = 5;
    var runSpeed = 10;
    let jumpTime = 0;

    let moveBegin = false;
    let moveEnd = false;

    this.ResetMoveSpeed = function () {
      moveSpeed = minSpeed;
    }
    this.SetMoveSpeed = function (f) {
      walkSpeed = f;
      if (enableGravity) {
        moveSpeed = f;
      }
    }
    this.SetSpeedData = function (speedData) {
      moveSpeed = speedData.moveSpeed;

      runSpeed = speedData.runSpeed;
      walkSpeed = speedData.walkSpeed;
      upSpeed = speedData.upSpeed;
      flySpeed = speedData.flySpeed;

      minSpeed = speedData.minSpeed;
      maxSpeed = speedData.maxSpeed;

    }
    this.GetMoveSpeed = function () {
      return moveSpeed * 1.0 / maxSpeed;
    }
    this.MoveBegin = function () {
      if (moveBegin) { return; }
      moveBegin = true;
      moveEnd = false;
      if (contrlState == 1) {
        // 鼠标点击地面行走模式，把速度降为最低速度
        moveSpeed = minSpeed;
      }
    }
    this.MoveEnd = function () {
      if (moveEnd) { return; }
      moveBegin = false;
      moveEnd = true;
    }
    // 操作方式。 0 键鼠控制/遥感控制，1 鼠标点击地面 
    // 模式1时，行走时有加速和减速效果
    let contrlState = 0;
    this.ChangeContrlState = function (i) {
      contrlState = i;
    }
    function UpdateMyUser() {

      // if (rigidbody != null && !inJumping) {
      if (rigidbody != null) {

        if (moveForward || moveBackward || moveLeft || moveRight) {
          hasInput = true;
          IsMoving(true);

          if (contrlState == 1) {
            // 启动加速，停止减速
            if (moveBegin) {
              moveSpeed += 0.1;
            }
            if (moveEnd) {
              moveSpeed -= 0.1;
            }
            if (moveSpeed >= maxSpeed) {
              moveSpeed = maxSpeed;
            }
            if (moveSpeed <= minSpeed) {
              moveSpeed = minSpeed;
            }
          } else {
            if (inShift) {
              moveSpeed = runSpeed;
            } else {
              moveSpeed = walkSpeed;
            }
          }


          let dx = 0;
          let dz = 0;
          let fb = false;
          let lr = false;
          if (moveForward || moveBackward) {
            fb = true;
            if (moveForward) {
              dz = 1;
            }
            if (moveBackward) {
              dz = -1;
            }
          }
          if (moveLeft || moveRight) {
            lr = true;
            if (moveLeft) {

              dx = 1;
            }
            if (moveRight) {
              dx = -1;
            }


          }



          MoveRigidbody(fb, lr, dx, dz);



        } else {
          if (hasInput) {
            offsetTime = 0;

            if (!inJoystick) {


              rigidbody.setLinearVelocity(-moveForce);
              moveForce.setX(0);
              moveForce.setZ(0);

              hasInput = false;

              // if (contrlState == 1) {
              //   // 鼠标点击地面行走模式，把速度降为最低速度
              //   moveSpeed = minSpeed;
              // }


              moveBegin = false;
              moveEnd = false;
              IsMoving(false);
            }
          }
        }


      }




      const objThree = myCtrlRb;
      const objPhys = objThree.userData.physicsBody;
      const ms = objPhys.getMotionState();
      if (ms) {
        ms.getWorldTransform(transformAux1);
        const p = transformAux1.getOrigin();
        const q = transformAux1.getRotation();

        // if(myCtrlRb.parent != scene){
        //   let parentPos = getWorldPosition(myCtrlRb.parent); 
        //   parentPos.x -= p.x();
        //   parentPos.y -= p.y()
        //   parentPos.z -= p.z();

        //   parentPos.y += playerHeight ;
        //   objThree.position.copy(parentPos);
        // }else{
        //   objThree.position.set(p.x(), p.y(), p.z());
        // }

        objThree.position.set(p.x(), p.y(), p.z());
        // objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

      }

      // return;


      let ve = rigidbody.getLinearVelocity();
      const veY = Math.abs(ve.y());
      console.log(" veY =  " + veY, moveForce.y());
      if (veY < 0.1) {
        // 避免连续跳跃
        const deltaTime = clock.getDelta() * 24;
        jumpTime += deltaTime;
        // console.log(" 落地计次 ====== ", jumpTime);
        if (jumpTime > 0.1) {
          // console.log(" 落地切换 ====== ", jumpTime);
          setJumpToFalse();
          downForce = 0;
          inFloating = false;
        }
      } else {
        jumpTime = 0;
      }
      return;

      if (inJumping) {
        let ve = rigidbody.getLinearVelocity();
        // console.log("重力 Y = " + ve.y());
        // console.log("jumpTime  = " + jumpTime); 
        //判断是否在下落过程中。在地面时，y()==0 .
        const veY = Math.abs(ve.y());
        if (veY < 0.1) {
          // 避免连续跳跃
          const deltaTime = clock.getDelta() * 24;
          jumpTime += deltaTime;
          if (jumpTime > 0.1) {
            setJumpToFalse();
            downForce = 0;
          }
        } else {
          jumpTime = 0;
        }

      }

    }

    //该轴用来做摄像机跟随的参考
    this.GetRotaRefChild = function () {
      return rotaRefChild;
    }
    this.GetRotaRefChild2 = function () {
      return myCtrlRbChild;
    }
    let rotaRefChild = null;
    function YJgenerateObject() {

      let threeObject = null;
      let shape = null;

      let radius = playerRadius;

      // 刚体高度由外部传入
      let height = playerHeight;

      //角色碰撞球体材质球
      let playerSphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        // alphaTest: true,
        transparent: true,
        opacity: 0.5,
      });

      // Sphere 
      // threeObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), playerSphereMat);
      // shape = new Ammo.btSphereShape(radius);

      //胶囊体必须要锁定x z 轴旋转，否则会倒
      //半径设0，隐藏胶囊参考体
      threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(0, height - 2 * radius, 20, 16), playerSphereMat);
      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(radius, height - 2 * radius, 20, 16), playerSphereMat);
      threeObject.name = "刚体胶囊体";
      shape = new Ammo.btCapsuleShape(radius, height - 2 * radius);

      shape.setMargin(margin);
      threeObject.position.set(0, 0, 0);

      const mass = radius * 10;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      pos = threeObject.position;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

      // quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 90 * Math.PI / 180);
      // transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setActivationState(STATE.DISABLE_DEACTIVATION);

      //锁定x z轴，只可旋转Y轴，即左右旋转，不倒
      //胶囊体必须要锁定x z 轴旋转，否则会倒
      body.setAngularFactor(0, 1, 0);


      // var broadphaseProxy = body.getCollisionShape(); 
      var broadphaseProxy = body.getBroadphaseProxy();
      broadphaseProxy.set_m_collisionFilterGroup(1);
      broadphaseProxy.set_m_collisionFilterMask(0x00000001);



      // let axes = new THREE.AxesHelper(5); // 坐标轴
      // threeObject.add(axes); // 场景添加坐标轴

      threeObject.userData.physicsBody = body;
      threeObject.userData.tag = "player";

      // threeObject.receiveShadow = true;
      // threeObject.castShadow = true;

      scene.add(threeObject);

      myCtrlRb = threeObject;
      // rigidBodies.push(threeObject);
      addRigidBodyFn(body);

      rigidbody = body;
      //设置阻尼。第一个参数空气阻力，第二个是滑动阻力。 0-1 之间
      rigidbody.setDamping(0.01, 0.01);
      body.setRollingFriction(10); //滚动摩擦力
      //設置摩擦力,决定在斜坡上是否能滑下来。 值越大，坡越陡才能滑下来
      rigidbody.setFriction(10);
      //设置重力缩放。5倍重力，倍数越大，下落越快
      // rigidbody.setGravity(new Ammo.btVector3(0, - 9.8 , 0));
      rigidbody.setGravity(new Ammo.btVector3(0, 0, 0));


      // console.log( " 角色 默认碰撞类型 " , rigidbody.getCollisionFlags());

      //开启刚体模拟。默认为开启
      rigidbody.setActivationState(true);
      moveForce = new Ammo.btVector3(0, 0, 0);

      //添加子物体，作为左右移动的方向参考
      myCtrlRbChild = new THREE.Group();
      myCtrlRbChild.name = "myCtrlRbChild";
      myCtrlRb.add(myCtrlRbChild);
      myCtrlRbChild.rotateY(Math.PI / 2);

      // myCtrlRb.add(new THREE.AxesHelper(3)); // 添加坐标轴

      //添加子物体，作为 摄像机跟随的方向参考
      rotaRefChild = new THREE.Group();
      rotaRefChild.name = "rotaRefChild";
      myCtrlRb.add(rotaRefChild);
      rotaRefChild.rotateY(-Math.PI / 2);
      rotaRefChild.rotateZ(-0.469);

      // let axes3 = new THREE.AxesHelper(2); // 坐标轴
      // rotaRefChild.add(axes3); // 场景添加坐标轴

      //碰撞检测trigger，必须添加此属性
      rigidbody.threeObject = myCtrlRb;

      quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0 * Math.PI / 180);
      myCtrlRb.quaternion.copy(quat);
      myCtrlRb.name = "rigidbody";
      _this.YJController.SetAmmoPlayer(myCtrlRb, height);

      console.log("初始化角色刚体");
    }


    this.YJCoustomBody = function (mesh, size) {

      let threeObject = null;
      let shape = null;

      //角色碰撞球体材质球
      let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        // alphaTest: true,
        transparent: true,
        opacity: 0.5,
      });

      // Sphere  

      let sx = size.x;
      let sy = size.y;
      let sz = size.z;

      //胶囊体必须要锁定x z 轴旋转，否则会倒
      //半径设0，隐藏胶囊参考体
      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(0, height - 2 * radius, 20, 16), material);

      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(sx, sy - 2 * sx, 20, 16), material);
      // shape = new Ammo.btCapsuleShape(sx, sy - 2 * sx);

      threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
      shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));


      threeObject.name = "检测刚体";

      shape.setMargin(margin);
      mesh.add(threeObject);
      threeObject.position.set(0, 0, 0);

      const mass = sx * 10;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      pos = threeObject.position;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

      // quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 90 * Math.PI / 180);
      // transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setActivationState(STATE.DISABLE_DEACTIVATION);

      //锁定x z轴，只可旋转Y轴，即左右旋转，不倒
      //胶囊体必须要锁定x z 轴旋转，否则会倒
      body.setAngularFactor(0, 1, 0);

      // let axes = new THREE.AxesHelper(5); // 坐标轴
      // threeObject.add(axes); // 场景添加坐标轴

      threeObject.userData.physicsBody = body;
      threeObject.userData.tag = "custom_player";


      addRigidBodyFn(body);

      //设置阻尼。第一个参数空气阻力，第二个是滑动阻力。 0-1 之间
      body.setDamping(0.01, 0.01);
      body.setRollingFriction(10); //滚动摩擦力
      //設置摩擦力,决定在斜坡上是否能滑下来。 值越大，坡越陡才能滑下来
      body.setFriction(10);
      //设置重力缩放。5倍重力，倍数越大，下落越快
      body.setGravity(new Ammo.btVector3(0, 0, 0));



      //开启刚体模拟。默认为开启
      body.setActivationState(true);

      //碰撞检测trigger，必须添加此属性
      body.threeObject = mesh;
      body.volume = threeObject;

      return body;

    }

    // 创建动力学物体 car
    this.YJCoustomPhysicsBody = function (mesh, margin) {

      let threeObject = null;
      let shape = null;

      //角色碰撞球体材质球
      let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        // alphaTest: true,
        transparent: true,
        opacity: 0.5,
      });

      // Sphere  
      let size = mesh.scale;
      let sx = size.x;
      let sy = size.y;
      let sz = size.z;

      //胶囊体必须要锁定x z 轴旋转，否则会倒
      //半径设0，隐藏胶囊参考体
      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(0, height - 2 * radius, 20, 16), material);

      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(sx, sy - 2 * sx, 20, 16), material);
      // shape = new Ammo.btCapsuleShape(sx, sy - 2 * sx);

      // threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
      threeObject = mesh.parent.parent;
      shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
      // shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));


      threeObject.name = "检测刚体";

      shape.setMargin(margin);
      // mesh.add(threeObject);
      // threeObject.position.set(0, 0, 0);

      const mass = 1 * 10;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      pos = threeObject.position;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

      // quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 90 * Math.PI / 180);
      // transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setActivationState(STATE.DISABLE_DEACTIVATION);

      //锁定x z轴，只可旋转Y轴，即左右旋转，不倒
      //胶囊体必须要锁定x z 轴旋转，否则会倒
      body.setAngularFactor(0, 0, 0);

      threeObject.add(new THREE.AxesHelper(5)); // 场景添加坐标轴

      threeObject.userData.physicsBody = body;
      threeObject.userData.tag = "custom_player";


      addRigidBodyFn(body);

      rigidBodies.push(threeObject);

      //设置阻尼。第一个参数空气阻力，第二个是滑动阻力。 0-1 之间
      body.setDamping(0.01, 0.01);
      body.setRollingFriction(10); //滚动摩擦力
      //設置摩擦力,决定在斜坡上是否能滑下来。 值越大，坡越陡才能滑下来
      body.setFriction(10);
      //设置重力缩放。5倍重力，倍数越大，下落越快
      body.setGravity(new Ammo.btVector3(0, - 9.8, 0));
      // body.setGravity(new Ammo.btVector3(0, 0, 0));



      //开启刚体模拟。默认为开启
      body.setActivationState(true);

      //碰撞检测trigger，必须添加此属性
      body.threeObject = mesh;
      body.volume = threeObject;

      return body;

    }



  }
}

export { YJAmmo };