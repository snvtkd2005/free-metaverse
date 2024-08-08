



import * as THREE from "three";
// import * as Ammo from "../../public/threeJS/ammo/ammo.js";

// import { AmmoPhysics } from 'three/examples/jsm/physics/AmmoPhysics.js';

class YJAmmo {
  constructor(scene, enabledAmmo, camera, _this, playerHeight, playerRadius, callback) {
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
		let softBodySolver;
    let physicsWorld;
    let transformAux1;

    let heightData = null;
    let ammoHeightData = null;

    let time = 0;
    const objectTimePeriod = 3;
    let timeNextSpawn = time + objectTimePeriod;
    const maxNumObjects = 30;


    // DFS叠叠乐设为true，使用建议碰撞。
    let UseAmmoPhysics = false;

    let physics;

    // if (_YJGlobal.UseAmmoPhysics != undefined) {
    //   UseAmmoPhysics = _YJGlobal.UseAmmoPhysics;
    // }

    if (!_YJGlobal["AmmoY"]) {
      _YJGlobal["AmmoY"] = { cc: Ammo() };
    }

    _YJGlobal["AmmoY"].cc.then(function (AmmoLib) {

      Ammo = AmmoLib;

      _YJGlobal.Ammo = Ammo;
      _YJGlobal._YJAmmo = scope;

      // console.error(" Ammo.version = "+Ammo.version);
      init();

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

    async function init() {


      // if (UseAmmoPhysics) {

      //   physics = await AmmoPhysics();
      //   const floor = new THREE.Mesh(
      //     new THREE.BoxGeometry(100, 5, 100),
      //     new THREE.MeshLambertMaterial({ color: 0xff0000, transparent: true, opacity: 0 })
      //     // new THREE.ShadowMaterial({ color: 0x444444 })
      //   );
      //   floor.position.y = - 2.5;
      //   // floor.receiveShadow = true;
      //   scene.add(floor);
      //   physics.addMesh(floor);

      // }


      // physics = await AmmoPhysics();


      // const box = new THREE.Mesh(
      //   new THREE.BoxGeometry(0.5, 0.5, 0.5),
      //   new THREE.MeshLambertMaterial({ color: 0xffffff})
      // );
      // box.position.z = 2;
      // box.position.y =  0.5;
      // box.receiveShadow = true;
      // scene.add(box);
      // physics.addMesh(box);

      // Boxes
      // const material = new THREE.MeshLambertMaterial();
      // const matrix = new THREE.Matrix4();
      // const color = new THREE.Color();
      // let boxes;
      // const geometryBox = new THREE.BoxGeometry(0.275, 0.275, 0.275);
      // // const geometryBox = new THREE.BoxGeometry(0.075, 0.075, 0.075);
      // boxes = new THREE.InstancedMesh(geometryBox, material, 10);
      // boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
      // boxes.castShadow = true;
      // boxes.receiveShadow = true;
      // scene.add(boxes);
      // for (let i = 0; i < boxes.count; i++) {
      //   matrix.setPosition(Math.random() - 0.5, Math.random() * 2,2+ Math.random() - 0.5);
      //   boxes.setMatrixAt(i, matrix);
      //   boxes.setColorAt(i, color.setHex(0xffffff * Math.random()));
      // }
      // physics.addMesh(boxes, 1);




      initPhysics();

      setupContactResultCallback();
      setupContactPairResultCallback();

      YJgenerateObject();
      callback();


      animate();

      // CreateLift();

      // setTimeout(() => {
      // UpdateLiftByTime("11000",5);
      // }, 5000);

    }

    this.CreateGeomotryRigidbody = function (mesh, mass) {
      if (mass == undefined) {
        mass = 0;
      }
      if (mass <= 0) {
        physics.addMesh(mesh);
      } else {
        physics.addMesh(mesh, mass);
      }
    }
    this.RemoveGeomotryRigidbody = function (mesh) {
      physics.removeMesh(mesh);
    }



    //加载凹包刚体 
    this.CreateTriangeMeshRigidbody = function (Entity, _scale) {

      let threeObject = Entity;
      // let threeObject ;
      // threeObject.position.set(0,1,2);

      let shape;

      // let radius = 0.2;
      // let height = 1.0;      
      // let playerSphereMat = new THREE.MeshStandardMaterial({
      //   color: 0xffffff,
      //   transparent: true,
      //   // opacity: 0.5,
      // });
      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(radius, height - 2 * radius, 20, 16), playerSphereMat);
      // threeObject.name = "刚体胶囊体";

      // shape = new Ammo.btCapsuleShape(radius, height - 2 * radius);


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
      // shape = GetTriangleMeshShap(Entity, _scale);

      const mass = 0.01 * 5;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);

      const transform = new Ammo.btTransform();
      transform.setIdentity();
      // const pos = threeObject.position;
      const pos = getWorldPosition(threeObject);

      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);

      body.setActivationState(STATE.DISABLE_DEACTIVATION);
      // body.setAngularFactor(0, 1, 0);
      // body.setAngularFactor(0, 0, 0);
      // body.setDamping(1,1);
      // body.setDamping(0.01, 0.01); 阻力
      body.setRollingFriction(10); //滚动摩擦力
      body.setFriction(10);
      //设置重力缩放。5倍重力，倍数越大，下落越快 
      // body.setGravity(new Ammo.btVector3(0, -9.8, 0));

      //开启刚体模拟。默认为开启
      body.setActivationState(true);
      threeObject.userData.physicsBody = body;

      // shape.setMargin(margin);

      threeObject.userData.tag = "Rigidbody";

      body.threeObject = threeObject;

      rigidBodies.push(threeObject);
      physicsWorld.addRigidBody(body);

      scene.add(threeObject);


    }


    function MeshToRigidBody(shape, threeObject, _mass) {
      // if(_mass == undefined){ _mass = 5;}
      shape.setMargin(margin);
      const mass = 0.01 * 5;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      const pos = threeObject.position;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

      let quat = threeObject.getWorldQuaternion(new THREE.Quaternion());
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);


      //230601 dfs改
      body.setRollingFriction(0.51); //滚动摩擦力
      body.setFriction(1.1);
      if (_mass == 0) {
        body.setAngularFactor(1, 1, 1);
      }
      // 弹性？
      body.setRestitution(0.1);

      rigidBodies.push(threeObject);
      threeObject.userData.physicsBody = body;
      physicsWorld.addRigidBody(body);

    }



    // var gravity = -0.51;
    var normalGravity = -1;
    var jumpGravity = -4.8;
    var gravity = -9.8;
    var forceScale = 1;

    let later_stopFly = null;
    let upSpeed = 1;
    let flySpeed = 1;
    let jumpForce = 2.8;
    let downForce = 0; //下落的力
    this.addRigidBody = function (body) {
      physicsWorld.addRigidBody(body);
    }
    this.GetPhysicsWorld = function () {
      return physicsWorld;
    }
    function addRigidBodyFn(body) {

      // var broadphaseProxy = body.getCollisionShape(); 
      var broadphaseProxy = body.getBroadphaseProxy();
      broadphaseProxy.set_m_collisionFilterGroup(1);
      broadphaseProxy.set_m_collisionFilterMask(3);

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
      
			softBodySolver = new Ammo.btDefaultSoftBodySolver();

      // physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
			physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
      physicsWorld.setGravity(new Ammo.btVector3(0, gravity, 0));
			physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravity, 0 ) );
      console.log("初始化 ammo  完成");
      transformAux1 = new Ammo.btTransform();
      console.log("physicsWorld 00 ",physicsWorld);

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
      // return;
      CreateAmmoPlaneFn(id, pos);
    }
    this.RemoveAmmoPlane = function (id) {
      // return;
      for (let i = ammoPlaneArray.length - 1; i >= 0; i--) {
        var map = ammoPlaneArray[i];
        if (map.id == id) {
          // console.log("删除模型" + sceneModel.name);
          _this.pointsParent.remove(map.model);
          // physicsWorld.removeRigidBody(map.model);
          this.removeRigidBody(map.model);
          ammoPlaneArray.splice(i, 1);
          continue;
        }
      }
    }
    // 隐藏显示开放世界九宫格
    let bMetaWorldPlaneDisplay = true;
    this.ToggleMetaWorldPlaneDisplay = function () {
      bMetaWorldPlaneDisplay = !bMetaWorldPlaneDisplay;
      for (let i = ammoPlaneArray.length - 1; i >= 0; i--) {
        var map = ammoPlaneArray[i];
        map.model.material.opacity = bMetaWorldPlaneDisplay ? 1 : 0;
      }
    }

    // 创建地块地面碰撞
    function CreateAmmoPlaneFn(id, _pos) {
      for (let i = 0; i < ammoPlaneArray.length; i++) {
        const element = ammoPlaneArray[i];
        if (element.id == id) { return; }
      }
      // Create the terrain body
      // var loaderTex_d = new THREE.TextureLoader();
      // var texture = loaderTex_d.load(
      //   _this.$publicUrl + "models/player/Model/unitychan_tile6.png"
      // );
      // //贴图平铺
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(10, 10);


      const c = Math.floor(Math.random() * (1 << 24));
      const mat = new THREE.MeshStandardMaterial({
        // color: 0xA7C365,
        color: c, //随机颜色
        // map: texture,
        castShadow: true,
        transparent: true,
        opacity: bMetaWorldPlaneDisplay ? 1 : 0,
        alphaTest: true,
      });
      // const mesh = new THREE.Mesh(
      //   new THREE.PlaneGeometry(200, 200, 20, 20), mat
      // );
      // mesh.rotation.x = -Math.PI / 2;
      // mesh.receiveShadow = true;
      // _this.pointsParent.add(mesh);

      planeItemPos.set(_pos.x, _pos.y - 0.05, _pos.z);

      const obstacle = createParalellepiped(planeItemSize.w, 0.01, planeItemSize.h, 0, planeItemPos, quat, mat);
      obstacle.name = "floor";
      obstacle.receiveShadow = true;
      obstacle.visible = true;
      _this.pointsParent.add(obstacle);
      obstacle.position.copy(planeItemPos);
      ammoPlaneArray.push({ id: id, model: obstacle });

      // console.log("初始化 ammo ");
    }

    let planeItemMesh = null;
    // 九宫格临时坐标
    let planeItemPos = new THREE.Vector3();
    // 九宫格每格尺寸
    let planeItemSize = { w: _Global.MetaworldSize, h: _Global.MetaworldSize };
    // let planeItemSize = { w: 40, h: 40 };

    function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {
      if (planeItemMesh == null) {
        planeItemMesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
      }
      // 重复的网格使用clone() 提高性能
      const threeObject = planeItemMesh.clone();
      threeObject.material = material.clone();
      // const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);

      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
      shape.setMargin(margin);

      createRigidBody(threeObject, shape, mass, pos, quat);
      return threeObject;

    }



    this.GetMapIdMesh = function (mapId) {
      for (let i = 0; i < ammoPlaneArray.length; i++) {
        if (ammoPlaneArray[i].id == mapId) {
          return ammoPlaneArray[i].model;
        }
      }
      return null;
    }


    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }

    const rigidBodies = [];
    this.GetRigidBodies = function(){
      return rigidBodies;
    }
    function createRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {
      // if (pos) {
      //   object.position.copy(pos);
      // } else {
      //   pos = object.position;
      // }

      // if (quat) {
      //   object.quaternion.copy(quat);
      // } else {
      //   quat = object.quaternion;
      // }

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
      object.userData.collided = false;

      body.threeObject = object;

      addRigidBodyFn(body);
      return body;

    }
    function createTriggerRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {

      if (pos) {
        // object.position.copy(pos);
      } else {
        pos = getWorldPosition(object);
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

      object.userData.triggerBody = body;
      // object.userData.physicsBody = body;
      object.userData.collided = true;
      // console.log("创建trigger ", object.userData);
      // scene.add(object);

      if (mass > 0) {

        // rigidBodies.push(object);

        // Disable deactivation
        body.setActivationState(4);

      }
      // 
      addRigidBodyFn(body);
      return body;

    }

    this.removeRigidBody = function (threeObject) {
      // if (threeObject != null && threeObject.userData !=null && threeObject.physicsBody !=null ) {
      //   physicsWorld.removeRigidBody(threeObject.userData.physicsBody);
      //   // rigidBodies.remove(threeObject);
      // }

      if (threeObject != undefined ) {
        if(threeObject.userData.physicsBody != null){
          physicsWorld.removeRigidBody(threeObject.userData.physicsBody);
        }
        if(threeObject.userData.triggerBody != null){
          physicsWorld.removeRigidBody(threeObject.userData.triggerBody);
        }
      }
    }



    function createColliderRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {

      if (pos) {
        // object.position.copy(pos);
      } else {
        pos = getWorldPosition(object);
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


      // body.setCollisionFlags(2); 
      // console.log( " 默认碰撞类型 " , body.getCollisionFlags());

      if (mass > 0) {

        rigidBodies.push(object);

        // Disable deactivation
        body.setActivationState(4);

      }

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
    this.SetShiftLeft = function (b) {
      inShift = b;
    }



    const STATE = { DISABLE_DEACTIVATION: 4 };
    //#region
    this.CreateMeshRigidbody = function (mesh, _scale, mass) {
      let shape = null;
      let vertices = mesh.geometry.getAttribute('position').array;
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
      // shape = GetTriangleMeshShap(mesh);
      MeshToRigidBody(shape, mesh, mass);
    }
    this.CreateBoxGeometryRigidbody = function (mesh, sx, sy, sz, mass) {
      let shape = null;
      shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
      MeshToRigidBody(shape, mesh, mass);
    }
    this.CreateCylinderGeometryRigidbody = function (mesh, radius, height) {
      let shape = null;
      shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height * 0.5, radius));
      MeshToRigidBody(shape, mesh);
    }
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
      if (_scale == undefined) {
        _scale = { x: 1, y: 1, z: 1 };
      }
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
      // let indices = vertices.length/3;
      let indices = Entity.geometry.index.array;
      if (_scale == undefined) {
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

      // body.setRollingFriction(100); //滚动摩擦力
      // body.setFriction(20);
      // console.log(" getCollisionFlags = " + body.getCollisionFlags() );
      // console.log(" isKinematicObject = " + body.isKinematicObject() );
      body.threeObject = threeObject;
      // body.triggerName = triggerName;
      // body.modelId = id;

    }

    //加载凸包碰撞体
    this.CreateTriangeMeshCollider = function (Entity, _scale, pos, quat, id, triggerName) {

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
      // shape = GetbtConvexHullShape(triangles, _scale);
      //凹包，用模型网格制作
      // shape = GetbtBvhTriangleMeshShape(triangles, _scale);
      shape = GetTriangleMeshShap(Entity, _scale);




      shape.setMargin(margin);

      const body = createColliderRigidBody(threeObject, shape, 0, pos, quat);
      threeObject.userData.tag = "collider";

      
      body.threeObject = threeObject;
      // body.triggerName = triggerName;
      // body.modelId = id;

    }

    //加载凹包碰撞体
    this.CreateTriangeMeshColliderConcave = function (Entity, _scale, pos, quat) {

      const threeObject = Entity;
      if (threeObject.userData.physicsBody != null) {
        physicsWorld.removeRigidBody(threeObject.userData.physicsBody);
        // console.log("移除现有碰撞");
      }

      let shape;

      let vertices = Entity.geometry.getAttribute('position').array;
      let triangles = [];
      for (let i = 0; i < vertices.length - 3; i += 3) {
        triangles.push({
          x: vertices[i],
          y: vertices[i + 1],
          z: vertices[i + 2]
        })
      }
      //凹包，用模型网格制作 
      shape = GetTriangleMeshShap(Entity, _scale);

      shape.setMargin(margin);
      const body = createColliderRigidBody(threeObject, shape, 0, pos, quat);
      threeObject.userData.tag = "collider";
      body.threeObject = threeObject;
    }


    //加载凹包 trigger
    this.CreateTriangeMeshTrigger = function (mesh, _scale, id, triggerName, owner, pos, quat) {
      const threeObject = mesh;
      let shape;
      //凹包，用模型网格制作
      shape = GetTriangleMeshShap(mesh, _scale);


      shape.setMargin(margin);

      const body = createTriggerRigidBody(threeObject, shape, 0, pos, quat);
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
      gravity = g;
      rigidbody.setGravity(new Ammo.btVector3(0, g, 0));
      // console.log("设置重力 ", gravity);
    }

    function SetGravityActiveFn() {
      // if(_Global.setting.inEditor){
      //   enableGravity = false;
      //   return;
      // }
      if (enableGravity) {
        rigidbody.setGravity(new Ammo.btVector3(0, gravity, 0));

        // 恢复重力后，取消跳跃状态
        // setJumpToFalse();

        flyDoonce = -1;
        moveSpeed = walkSpeed;
      } else {
        flyDoonce = 0;

        rigidbody.setLinearVelocity(-moveForce);
        moveForce.setX(0);
        moveForce.setY(0);
        moveForce.setZ(0);
        rigidbody.setGravity(new Ammo.btVector3(0, 0, 0));
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
    this.SetPhysicBodyPosRota = function (rigidbody, pos, quat) {
      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 1; i++) {
          ms.setWorldTransform(transformAux1);
          transformAux1.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
          if (quat != undefined) { 
            transformAux1.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
          }
        }
        const p = transformAux1.getOrigin();
        rigidbody.threeObject.position.set(p.x(), p.y(), p.z());
        if (quat != undefined) {
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

            downForce = jumpForce;
            // if (moveForward || moveBackward || moveLeft || moveRight) {
            //   downForce *= 1;
            // }
            moveForce.setY(downForce);
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
    this.SetJumpFlyDown = function () {
      // 有重力的情况下，不允许飞行
      if (enableGravity) { return; }
      moveForce.setY(-upSpeed);
      rigidbody.setLinearVelocity(moveForce);
      if (later_stopFly != null) {
        clearTimeout(later_stopFly);
      }
      later_stopFly = setTimeout(() => {
        moveForce.setY(-0.0);
        rigidbody.setLinearVelocity(moveForce);
      }, 100);

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
    var laterDownForce = null;
    let b_checkOverlap = true;
    let inTrigger = false;
    //试试判断与角色碰到的碰撞体
    function CheckOverlap() {
      if (!b_checkOverlap) { return; }
      //未碰到任何物体，表示腾空
      if (oldoverlapArray.length != 0 && overlapArray.length != 0) {

        // console.log(" ==落地 ！！！ ",oldoverlapArray, overlapArray);
        // console.log(" ==落地 ！！！ ", rigidbody.getLinearVelocity().y(), gravity);



        if (enableGravity) {

          if (downForce >= -9) {
            downForce -= 0.4;
            moveForce.setY(downForce);
            rigidbody.setLinearVelocity(moveForce);
          } else {
            let yy = rigidbody.getLinearVelocity().y();
            if (yy <= 0.1) {
              setJumpToFalse();
            } else {
              moveForce.setY(downForce);
              rigidbody.setLinearVelocity(moveForce);
            }
          }
        }

      } else {


        if (inJumping) {
          // if (laterDownForce != null) {
          //   clearTimeout(laterDownForce);
          //   laterDownForce = null;
          // } 
        }

        if (enableGravity) {

          if (downForce >= -9) {
            downForce -= 0.4;
            moveForce.setY(downForce);
            rigidbody.setLinearVelocity(moveForce);
          } else {
            moveForce.setY(downForce);
            rigidbody.setLinearVelocity(moveForce);
          }

        }


        // console.log(" 腾空！！！ " ,oldoverlapArray, overlapArray,downForce);
        // laterDownForce = setTimeout(() => {
        //   SetGravityValue(jumpGravity);
        // }, 100);

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
            inTrigger = true;
            // console.log(" 进入 碰撞到物体的 trigger, ", newItem.triggerName, newItem.modelId);
            if (newItem.triggerName == "platform") {
              SetMyCtrlRbParent(newItem.owner.GetModel(), newItem.modelId);
              continue;
            }
            _this._YJSceneManager.ChangeJiaohuArea(true, newItem.modelId, newItem.triggerName, newItem);
          }
          if (tag == "car") {
            // console.log(" 进入 碰撞到 car, ", newItem.triggerName, newItem.modelId);
            _this._YJSceneManager.ChangeJiaohuArea(true, tag, newItem.triggerName, newItem);
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
            inTrigger = false;
            // console.log("离开 碰撞到物体的 trigger, ", newItem.triggerName, newItem.modelId);
            if (newItem.triggerName == "platform") {
              SetMyCtrlRbParent(scene, "scene");
              continue;
            }
            _this._YJSceneManager.ChangeJiaohuArea(false, newItem.modelId, newItem.triggerName, newItem);

          }

          if (tag == "car") {
            // console.log("  离开 碰撞到 car, ", newItem.triggerName, newItem.modelId);
            _this._YJSceneManager.ChangeJiaohuArea(false, tag, newItem.triggerName, newItem);

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
        if (distance > 1) return;

        let colWrapper0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);
        let rb0 = Ammo.castObject(colWrapper0.getCollisionObject(), Ammo.btRigidBody);

        let colWrapper1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);
        let rb1 = Ammo.castObject(colWrapper1.getCollisionObject(), Ammo.btRigidBody);

        // console.log("rb0 = " , rb0);
        // console.log("rb1 = " , rb1);

        let threeObject0 = rb0.threeObject;
        let threeObject1 = rb1.threeObject;

        // console.log("rb1 = " , rb1);


        // if (threeObject1 != undefined) {
        //   let tag, localPos, worldPos;
        //   tag = threeObject1.userData.tag;

        //   if (tag == "car") {
        //     console.log("碰撞 汽车 ");
        //   }
        //   // console.log("碰撞到的物体 未设置tag ，可能是地面 或 墙 ");
        //   console.log("碰撞到的物体，",threeObject1.name,tag); 
        // }

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
          }
        }

        // console.log("碰撞到的物体，" + threeObject1.userData.tag);
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
    let needUpdateJS = [];
    this.AddNeedUpdateJS = function (js) {
      for (let i = 0; i < needUpdateJS.length; i++) {
        const element = needUpdateJS[i];
        if (element == js) { return; }

      }
      needUpdateJS.push(js);
    }
    this.RemoveNeedUpdateJS = function (js) {
      for (let i = needUpdateJS.length - 1; i >= 0; i--) {
        const element = needUpdateJS[i];
        if (element == js) {
          needUpdateJS.splice(i, 1);
          return;
        }
      }
    }

    this.SetEnabled = function (e) {
      if (enabled == e) { return; }
      enabled = e;
    }
    function animate() {

      requestAnimationFrame(animate);
      if (!enabled) {
        return;
      }
      render();
      for (let i = 0; i < needUpdateJS.length; i++) {
        needUpdateJS[i]._update();
      } 
    }
    this._update = function () {

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

    // let windForce = new Ammo.btVector3(0.05, 0, 0);
    function updatePhysics(deltaTime) {

      physicsWorld.stepSimulation(deltaTime, 10);

      // Update objects
      for (let i = 0, il = rigidBodies.length; i < il; i++) {

        const objThree = rigidBodies[i];
        const objPhys = objThree.userData.physicsBody;


        // let force = objThree.rotation /(deltaTime * deltaTime);
        // force += new Ammo.btVector3(0.05, 0, 0)/(deltaTime * deltaTime);
        // objPhys.setLinearVelocity(force);
 
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
      if (enabledRigidbody) {

        UpdateMyUser();

        checkContact();
        CheckOverlap();
      }

    }
    var hasInput = false;
    var moveForce;
    var inJumping = false;

    let inJoystick = false;

    let joystickData = {
      fb: false,
      lr: false,
      dx: 0,
      dz: 0,
    }
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

          moveForward = false;
          moveBackward = false;
          moveLeft = false;
          moveRight = false;
        }
        return;
      }
      hasInput = true;
      IsMoving(true);
      inJoystick = true;

      moveForward = y > 0;
      moveBackward = y < 0;
      moveLeft = x > 0;
      moveRight = x < 0;

      joystickData.dx = 0;
      joystickData.dz = 0;
      joystickData.fb = false;
      joystickData.lr = false;

      if (Math.abs(x) > 0.1) {
        joystickData.lr = true;
        // joystickData.dx = x>0?1:-1;
        joystickData.dx = x * 1;
        // joystickData.dx = x * 1.5;
      }
      if (Math.abs(y) > 0.1) {
        joystickData.fb = true;
        // joystickData.dz = y>0?1:-1;
        joystickData.dz = y * 1;
        // joystickData.dz = y * 1.5;
      }


      // MoveRigidbody(fb, lr, dx, dz);

      // console.log("模拟摇杆输入 2222222 ", moveForward);

    }


    let oladPos = new THREE.Vector3(0, 0, 0);
    function MoveRigidbody(fb, lr, x, y) {
      let dir = new THREE.Vector3(0, 0, 0); //前后方向
      let dirChild = new THREE.Vector3(0, 0, 0); //左右方向



      if (camera) {

        camera.getWorldDirection(dir);
        camera.children[0].getWorldDirection(dirChild);

        // myCtrlRb.getWorldDirection(dir);
        // myCtrlRbChild.getWorldDirection(dirChild);
        // _Global.AddLog(" 前后方向 :" , dir);
        // console.log(" 前后方向 :" , dir);
        // console.log(" 左右方向 :" , dirChild);
        // dir.x = dir.z = 0;
      } else {
        myCtrlRb.getWorldDirection(dir);
        myCtrlRbChild.getWorldDirection(dirChild);
      }

      if (enableGravity) {

        // if (inJumping) {
        //   downForce -= 0.8;
        //   moveForce.setY(downForce);
        // } else {
        //   moveForce.setY(-1.8);
        //   CheckForwardCollider();
        // }

        if (inJumping) {
          // downForce -= 0.15;
          // moveForce.setY(downForce);
        } else { 

          // 上坡时不使用向下的力；下坡时增加向下的力防止抖动
          let newPos = myCtrlRb.getWorldPosition(new THREE.Vector3());
          if(oladPos.y > newPos.y){
            moveForce.setY(-3);
          }else{
            moveForce.setY(0);
          }
          oladPos = newPos.clone();

          // CheckForwardCollider();
        }

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

      moveForce.setX(moveForceX * forceScale);
      moveForce.setZ(moveForceZ * forceScale);

      rigidbody.setLinearVelocity(moveForce);

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
    let moveSpeedScale = 1; 
    let walkSpeed = 5; 
    var runSpeed = 10;
    let jumpTime = 0;

    let moveBegin = false;
    let moveEnd = false;

    this.ResetMoveSpeed = function () {
      moveSpeed = minSpeed;
      moveSpeedScale = 1;
    }
    this.SetMoveSpeed = function (f) {
      walkSpeed = f;
      if (enableGravity) {
        moveSpeed = f;
      }
    }
    this.SetMoveSpeedScale = function (f) { 
      if (enableGravity) {
        moveSpeedScale = f; 
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
              moveSpeed = maxSpeed * moveSpeedScale;
            }
            if (moveSpeed <= minSpeed) {
              moveSpeed = minSpeed * moveSpeedScale;
            }
          } else {
            if (inShift) {
              moveSpeed = runSpeed * moveSpeedScale;
            } else {
              moveSpeed = walkSpeed * moveSpeedScale;
            }
          }


          let dx = 0;
          let dz = 0;
          let fb = false;
          let lr = false;
          if (inJoystick) {

            dx = joystickData.dx;
            dz = joystickData.dz;
            fb = joystickData.fb;
            lr = joystickData.lr;
          } else {

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

      // console.log("downForce =  " +  downForce + " inJumping = " + inJumping);
      // console.log(" 重力设置值 2222222 ", moveForce);

      // let ve2 = rigidbody.getLinearVelocity();
      // console.log("重力 Y = " + ve2.y());

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
          if (jumpTime > 0.02) {
            // setJumpToFalse();
          }
        } else {
          if (veY < 2) {
            const deltaTime = clock.getDelta() * 24 * 3;
            // time += deltaTime;
            jumpTime += deltaTime;
            if (jumpTime > 0.2) {
              // setJumpToFalse();
            }
          }
        }

      }

      // if (Math.abs(ve.y()) == 10) {
      //   inJumping = false;
      // }

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



    }

    //该轴用来做摄像机跟随的参考
    this.GetRotaRefChild = function () {
      return rotaRefChild;
    }
    this.GetRotaRefChild2 = function () {
      return myCtrlRbChild;
    }
    let rotaRefChild = null;

    // 是否启用玩家碰撞
    let enabledRigidbody = true;
    // 设置是否启用玩家碰撞
    this.SetRigidbodySleep = function (b) {
      enabledRigidbody = b;
    }
    this.GetPlayerRigidbody = function(){
      return rigidbody;
    }
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
      // var broadphaseProxy = body.getBroadphaseProxy();
      // broadphaseProxy.set_m_collisionFilterGroup(1);
      // broadphaseProxy.set_m_collisionFilterMask(0x00000001);



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
      // rigidbody.setGravity(new Ammo.btVector3(0, - 9.8 * 5, 0));
      rigidbody.setGravity(new Ammo.btVector3(0, 0, 0));


      // console.log( " 角色 默认碰撞类型 " , rigidbody.getCollisionFlags());

      //开启刚体模拟。默认为开启
      // rigidbody.setActivationState(true); 
      moveForce = new Ammo.btVector3(0, 0, 0);
      moveForce.setY(downForce);

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
      // enabled = false;
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
      // rigidbody.setGravity(new Ammo.btVector3(0, - 9.8 * 5, 0));
      body.setGravity(new Ammo.btVector3(0, 0, 0));



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