import * as THREE from "three";
import { Uniform } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import TWEEN from '@tweenjs/tween.js';

class YJAmmoOld {
  constructor(document) {

    // Heightfield parameters  地形高度 起伏等
    const terrainWidthExtents = 100;
    const terrainDepthExtents = 100;
    const terrainWidth = 20;
    const terrainDepth = 20;
    const terrainHalfWidth = terrainWidth / 2;
    const terrainHalfDepth = terrainDepth / 2;
    const terrainMaxHeight = 0;
    const terrainMinHeight = 0;



    // Graphics variables
    let container, stats;
    let camera, scene, renderer;
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
    const dynamicObjects = [];
    let transformAux1;

    let heightData = null;
    let ammoHeightData = null;

    let time = 0;
    const objectTimePeriod = 3;
    let timeNextSpawn = time + objectTimePeriod;
    const maxNumObjects = 30;

    Ammo().then(function (AmmoLib) {

      Ammo = AmmoLib;

      init();
      animate();

    });

    function init() {
      //加载外部的胶囊体模型，让其作为碰撞体网格
      // loadGltfCapsule();



      heightData = generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);

      initGraphics();

      initPhysics();

      setupContactResultCallback();
      setupContactPairResultCallback();

      YJgenerateObject();
    }

    function initGraphics() {

      container = document;
      // container = document.getElementById( 'container' );

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      container.appendChild(stats.domElement);

      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xbfd1e5);

      camera.position.y = heightData[terrainHalfWidth + terrainHalfDepth * terrainWidth] * (terrainMaxHeight - terrainMinHeight) + 5;

      camera.position.z = terrainDepthExtents / 2;
      camera.lookAt(0, 0, 0);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;

      const geometry = new THREE.PlaneGeometry(terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1);
      geometry.rotateX(- Math.PI / 2);

      const vertices = geometry.attributes.position.array;
      //控制平面顶点位置
      for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {

        // j + 1 because it is the y component that we modify
        vertices[j + 1] = heightData[i];

      }
      //刷新法线
      geometry.computeVertexNormals();

      const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xC7C7C7 });
      terrainMesh = new THREE.Mesh(geometry, groundMaterial);
      terrainMesh.receiveShadow = true;
      terrainMesh.castShadow = true;

      scene.add(terrainMesh);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('textures/grid.png', function (texture) {

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(terrainWidth - 1, terrainDepth - 1);
        groundMaterial.map = texture;
        groundMaterial.needsUpdate = true;

      });

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(100, 100, 50);
      light.castShadow = true;
      const dLight = 200;
      const sLight = dLight * 0.25;
      light.shadow.camera.left = - sLight;
      light.shadow.camera.right = sLight;
      light.shadow.camera.top = sLight;
      light.shadow.camera.bottom = - sLight;

      light.shadow.camera.near = dLight / 30;
      light.shadow.camera.far = dLight;

      light.shadow.mapSize.x = 1024 * 2;
      light.shadow.mapSize.y = 1024 * 2;
      scene.add(light);


      window.addEventListener('resize', onWindowResize);

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

    }
    // 初始化物理模拟系统
    function initPhysics() {

      // Physics configuration
      collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
      broadphase = new Ammo.btDbvtBroadphase();
      solver = new Ammo.btSequentialImpulseConstraintSolver();
      physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
      physicsWorld.setGravity(new Ammo.btVector3(0, - 9.8, 0));

      // Create the terrain body

      const groundShape = createTerrainShape();
      const groundTransform = new Ammo.btTransform();
      groundTransform.setIdentity();
      // Shifts the terrain, since bullet re-centers it on its bounding box.
      groundTransform.setOrigin(new Ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0));
      const groundMass = 0;
      const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
      const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
      const groundBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia));
      physicsWorld.addRigidBody(groundBody);


      transformAux1 = new Ammo.btTransform();

    }

    function generateHeight(width, depth, minHeight, maxHeight) {

      // Generates the height data (a sinus wave)

      const size = width * depth;
      const data = new Float32Array(size);

      const hRange = maxHeight - minHeight;
      const w2 = width / 2;
      const d2 = depth / 2;
      const phaseMult = 12;

      let p = 0;

      for (let j = 0; j < depth; j++) {

        for (let i = 0; i < width; i++) {

          const radius = Math.sqrt(
            Math.pow((i - w2) / w2, 2.0) +
            Math.pow((j - d2) / d2, 2.0));

          const height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;

          data[p] = height;

          p++;

        }

      }

      return data;

    }

    function createTerrainShape() {

      // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
      const heightScale = 1;

      // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
      const upAxis = 1;

      // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
      const hdt = 'PHY_FLOAT';

      // Set this to your needs (inverts the triangles)
      const flipQuadEdges = false;

      // Creates height data buffer in Ammo heap
      ammoHeightData = Ammo._malloc(4 * terrainWidth * terrainDepth);

      // Copy the javascript height data array to the Ammo one.
      let p = 0;
      let p2 = 0;

      for (let j = 0; j < terrainDepth; j++) {

        for (let i = 0; i < terrainWidth; i++) {

          // write 32-bit float data to memory
          Ammo.HEAPF32[ammoHeightData + p2 >> 2] = heightData[p];

          p++;

          // 4 bytes/float
          p2 += 4;

        }

      }

      // Creates the heightfield physics shape
      const heightFieldShape = new Ammo.btHeightfieldTerrainShape(
        terrainWidth,
        terrainDepth,
        ammoHeightData,
        heightScale,
        terrainMinHeight,
        terrainMaxHeight,
        upAxis,
        hdt,
        flipQuadEdges
      );

      // Set horizontal scale
      const scaleX = terrainWidthExtents / (terrainWidth - 1);
      const scaleZ = terrainDepthExtents / (terrainDepth - 1);
      heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));

      heightFieldShape.setMargin(0.05);

      return heightFieldShape;

    }

    function generateObject() {

      const numTypes = 4;
      const objectType = Math.ceil(Math.random() * numTypes);

      let threeObject = null;
      let shape = null;

      const objectSize = 3;
      const margin = 0.05;

      let radius, height;

      switch (objectType) {

        case 1:
          // Sphere
          radius = 1 + Math.random() * objectSize;
          threeObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), createObjectMaterial());
          shape = new Ammo.btSphereShape(radius);
          shape.setMargin(margin);
          break;
        case 2:
          // Box
          const sx = 1 + Math.random() * objectSize;
          const sy = 1 + Math.random() * objectSize;
          const sz = 1 + Math.random() * objectSize;
          threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), createObjectMaterial());
          shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
          shape.setMargin(margin);
          break;
        case 3:
          // Cylinder
          radius = 1 + Math.random() * objectSize;
          height = 1 + Math.random() * objectSize;
          threeObject = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 20, 1), createObjectMaterial());
          shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height * 0.5, radius));
          shape.setMargin(margin);
          break;
        default:
          // Cone
          radius = 1 + Math.random() * objectSize;
          height = 2 + Math.random() * objectSize;
          threeObject = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 20, 2), createObjectMaterial());
          shape = new Ammo.btConeShape(radius, height);
          break;

      }

      threeObject.position.set((Math.random() - 0.5) * terrainWidth * 0.6, 40, (Math.random() - 0.5) * terrainDepth * 0.6);

      const mass = objectSize * 20;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      const pos = threeObject.position;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);

      threeObject.userData.physicsBody = body;

      threeObject.receiveShadow = true;
      threeObject.castShadow = true;

      scene.add(threeObject);
      dynamicObjects.push(threeObject);

      physicsWorld.addRigidBody(body);



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

      physicsWorld.addRigidBody(body);

      return body;

    }

    function createParalellepiped(sx, sy, sz, mass, pos, quat, material) {

      const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
      const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
      shape.setMargin(margin);

      const body = createRigidBody(threeObject, shape, mass, pos, quat);
      body.threeObject = threeObject;

      return threeObject;

    }

    function createTriggerRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {

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

      object.userData.physicsBody = body;
      object.userData.collided = true;
      console.log("创建trigger ", object.userData);
      scene.add(object);
      physicsWorld.addRigidBody(body);
      return body;

    }
    //创建检测用的trigger, 能与刚体做碰撞检测，但不阻挡刚体。 在视图中看不见
    function createTrigger(sx, sy, sz, pos, quat, material) {

      const threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
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

    var myCtrlRb = null;
    var myCtrlRbChild = null;
    var rigidbody = null;
    var moveSpeed = 5;
    var margin = 0.05;

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    const STATE = { DISABLE_DEACTIVATION: 4 };

    var playerShape = null;
    function loadGltfCapsule() {

      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath('/js/draco/gltf/');

      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load("/models/player/Scene/Capsule.gltf", function (gltf) {

        const model = gltf.scene;
        console.log(model);
        // model.position.set(pos.x, pos.y, pos.z); // 
        // model.scale.set(size, size, size);
        // scene.add(model); 

        let wutai = LoopFindChild("Capsule", model);
        //创建 舞台 的 collider
        // _this._YJSceneManager.CreateModelMeshCollider(wutai, wutai.scale);
        // _this._YJSceneManager.CreateTriangeMeshCollider(wutai, wutai.scale);

        let vertices = wutai.geometry.getAttribute('position').array;
        let triangles = [];
        for (let i = 0; i < vertices.length; i += 3) {
          triangles.push({
            x: vertices[i],
            y: vertices[i + 1],
            z: vertices[i + 2]
          })
        }

        //凸包
        playerShape = GetbtConvexHullShape(triangles, wutai.scale);
        console.log("添加外部胶囊体碰撞 111 ");
        YJgenerateObject();

      }, undefined, function (e) {
        console.error(e);
      });
    }
    function LoopFindChild(childName, parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if (cn[1] == childName) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindChild(childName, c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }
    //凸包碰撞体
    function GetbtConvexHullShape(triangles, _scale) {
      const scale = [_scale.x, _scale.y, _scale.z];

      var triangle, triangle_mesh = new Ammo.btTriangleMesh;
      var shape = new Ammo.btConvexHullShape();
      let vectA = new Ammo.btVector3(0, 0, 0);
      let vectB = new Ammo.btVector3(0, 0, 0);
      let vectC = new Ammo.btVector3(0, 0, 0);
      for (let i = 0; i < triangles.length - 3; i += 3) {

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

        //     // triangle_mesh.addTriangle( 
        //     // new Ammo.btVector3(triangles[i].x * scale[0], triangles[i].y * scale[1],triangles[i].z * scale[2]),
        //     // new Ammo.btVector3(triangles[i+1].x * scale[0], triangles[i+1].y * scale[1],triangles[i+1].z * scale[2]),
        //     // new Ammo.btVector3(triangles[i+2].x * scale[0], triangles[i+2].y * scale[1],triangles[i+2].z * scale[2]),
        //     // false);
      }
      //  shape = new Ammo.btBvhTriangleMeshShape(triangle_mesh, true, true);

      //   Ammo.destroy(vectA);
      //   Ammo.destroy(vectB);
      //   Ammo.destroy(vectC);
      return shape;
    }
    function YJgenerateObject() {

      let threeObject = null;
      let shape = null;

      const objectSize = 0.5;

      let radius;

      let obstacle;
      // 创建不可穿越的障碍物  mass 设为 0 
      // pos.set(3, 1, 0);
      // quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 15 * Math.PI / 180);
      // let obstacle = createParalellepiped(10, 1, 4, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0x606060 }));
      // obstacle.name = "我是障碍物";
      // obstacle.castShadow = true;
      // obstacle.receiveShadow = true;

      // 高度测试
      let height = 0.29;
      pos.set(7, height/2, 7);
      quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0 * Math.PI / 180);
      obstacle = createParalellepiped(1, height, 4, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0x606060 }));
      obstacle.name = "我是障碍物";
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;

      height = 0.5;
      pos.set(10,  height/2, 7);
      obstacle = createParalellepiped(1,  height, 4, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0x606060 }));
      obstacle.name = "我是障碍物";
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      
      height = 0.7;
      pos.set(13,  height/2, 7);
      obstacle = createParalellepiped(1,  height, 4, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0x606060 }));
      obstacle.name = "我是障碍物";
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;

      //创建trigger
      pos.set(6, 0.5, 10);
      quat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0 * Math.PI / 180);
      const trigger = createTrigger(10, 1, 4, pos, quat, new THREE.MeshPhongMaterial({ color: 0x60606066, transparent: true, opacity: 0.5 }));
      trigger.name = "我是trigger";


      // Sphere
      radius = objectSize;
      // threeObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), createObjectMaterial());
      // shape = new Ammo.btSphereShape(radius);

      //角色碰撞球体材质球
      let playerSphereMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
      height = 2;
      // //胶囊体必须要锁定x z 轴旋转，否则会倒
      threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(radius, height, 20, 16), playerSphereMat);
      shape = new Ammo.btCapsuleShape(radius, height);
 
      // margin = -3;
      // margin = 0.05;
      // margin = 15;
      shape.setMargin(margin);
      threeObject.position.set(0, 20, 0);
      const mass = objectSize * 100;
      const localInertia = new Ammo.btVector3(0, 10, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      pos = threeObject.position;
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setFriction(4);
      body.setRollingFriction(10);
      body.setActivationState(STATE.DISABLE_DEACTIVATION);

      //设置角速度， 达到冻结角度的作用
      body.setAngularFactor(0, 1, 0);

      let axes = new THREE.AxesHelper(5); // 坐标轴
      threeObject.add(axes); // 场景添加坐标轴

      threeObject.userData.physicsBody = body;
      threeObject.userData.tag = "ball";

      threeObject.receiveShadow = true;
      threeObject.castShadow = true;

      scene.add(threeObject);

      myCtrlRb = threeObject;
      rigidBodies.push(threeObject);
      physicsWorld.addRigidBody(body);

      rigidbody = body;
      //设置阻尼。第一个参数空气阻力，第二个是滑动阻力。 0-1 之间
      rigidbody.setDamping(0.01, 1);
      //設置摩擦力
      rigidbody.setFriction(1);
      //设置重力缩放。5倍重力，倍数越大，下落越快
      rigidbody.setGravity(new Ammo.btVector3(0, - 9.8 * 5, 0));

      // rigidbody.setCollisionFlags(2);

      //开启刚体模拟。默认为开启
      rigidbody.setActivationState(true);
      moveForce = new Ammo.btVector3(0, 0, 0);
      // moveForce.setY(0);
      moveForce.setY(0);//Y轴的力，决定刚体能够走过多高的障碍物，向下的力越大，能走过的障碍物越矮

      console.log("rigidbody= ", rigidbody);

      console.log(rigidbody.getCenterOfMassTransform());

      // console.log("transformAux1= ", transformAux1);
      // myCtrlRb.addEventListener('collision', function(other_object, relative_velocity, relative_rotation) {
      //   console.log(" 碰到其他物体 " , other_object);
      // });
      // myCtrlRb.addEventListener('collidestart', function() {
      //   console.log(" 碰到其他物体 222 " );
      // });
      // 

      myCtrlRbChild = new THREE.Group();
      myCtrlRb.add(myCtrlRbChild);
      myCtrlRbChild.rotateY(Math.PI / 2);
      let axes2 = new THREE.AxesHelper(3); // 坐标轴
      myCtrlRbChild.add(axes2); // 场景添加坐标轴

      //碰撞检测trigger，必须添加此属性
      rigidbody.threeObject = myCtrlRb;


      window.addEventListener('keydown', function (event) {
        rigidbody.setActivationState(true);

        // console.log(moveForce);
        switch (event.code) {
          case 'ArrowUp':
            checkContact();
            break;
          case 'KeyW':
            moveForward = true;

            break;

          case 'ArrowLeft':
            myCtrlRb.rotation.y += 0.1;
            break;
          case 'KeyA': moveLeft = true; break;

          case 'ArrowDown': break;
          case 'KeyS': moveBackward = true; break;

          case 'ArrowRight':
            myCtrlRb.rotation.y -= 0.1;

            break;
          case 'KeyD': moveRight = true; break;
          case 'KeyQ':

            break;
          case 'Space':
            if (inJumping) { return; }
            console.log("jump");
            moveForce.setY(20);
            rigidbody.setLinearVelocity(moveForce);

            setTimeout(() => {
              inJumping = true;
              moveForce.setY(-4);
              // moveForce.setY(-9.8);
              jumpOnce = 0;
            }, 100);
            // inJumping = true;
            // jumpOnce = 0;
            break;
        }


      });

      window.addEventListener('keyup', function (event) {

        switch (event.code) {

          case 'KeyW': moveForward = false; break;

          case 'ArrowLeft':
          case 'KeyA': moveLeft = false; break;

          case 'ArrowDown':
          case 'KeyS': moveBackward = false; break;

          case 'ArrowRight':
          case 'KeyD': moveRight = false; break;
          case 'Space':

            break;
          case 'KeyQ':
            SetBodyPos(new Ammo.btVector3(10, 1, 0));
            // directSetPos = true; 
            // const ms = rigidbody.getMotionState();
            // if (ms) {
            //   for (let i = 0; i <2; i++) {
            //   ms.setWorldTransform(transformAux1);
            //   transformAux1.setOrigin(new Ammo.btVector3(10, 1,0));
            //   }
            //   const p = transformAux1.getOrigin();
            //   myCtrlRb.position.set(p.x(), p.y(), p.z());
            //   rigidbody.setMotionState(ms);
            // }

            // for (let i = 0; i <2; i++) {
            //   const ms = rigidbody.getMotionState();
            //   if (ms) {
            //     ms.setWorldTransform(transformAux1);
            //     transformAux1.setOrigin(new Ammo.btVector3(10, 1,0));
            //     const p = transformAux1.getOrigin();
            //     myCtrlRb.position.set(p.x(), p.y(), p.z());
            //     rigidbody.setMotionState(ms);
            //   }
            // }


            console.log("按下Q");
            break;
        }

      });
    }

    //设置刚体位置。
    function SetBodyPos(pos) {
      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 2; i++) {
          ms.setWorldTransform(transformAux1);
          transformAux1.setOrigin(pos);
          // transformAux1.setOrigin(new Ammo.btVector3(10, 1,0));
        }
        const p = transformAux1.getOrigin();
        myCtrlRb.position.set(p.x(), p.y(), p.z());
        rigidbody.setMotionState(ms);
      }
    }

    

    let cbContactResult, cbContactPairResult;
    function setupContactResultCallback() {

      cbContactResult = new Ammo.ConcreteContactResultCallback();

      cbContactResult.addSingleResult = function (cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {

        let contactPoint = Ammo.wrapPointer(cp, Ammo.btManifoldPoint);

        const distance = contactPoint.getDistance();

        if (distance > 0) return;

        let colWrapper0 = Ammo.wrapPointer(colObj0Wrap, Ammo.btCollisionObjectWrapper);
        let rb0 = Ammo.castObject(colWrapper0.getCollisionObject(), Ammo.btRigidBody);

        let colWrapper1 = Ammo.wrapPointer(colObj1Wrap, Ammo.btCollisionObjectWrapper);
        let rb1 = Ammo.castObject(colWrapper1.getCollisionObject(), Ammo.btRigidBody);

        // console.log("rb0 = " , rb0);
        // console.log("rb1 = " , rb1);

        let threeObject0 = rb0.threeObject;
        let threeObject1 = rb1.threeObject;


        let tag, localPos, worldPos

        if (threeObject0.userData.tag != "ball") {

          tag = threeObject0.userData.tag;
          localPos = contactPoint.get_m_localPointA();
          worldPos = contactPoint.get_m_positionWorldOnA();

        }
        else {
          if (threeObject1 == undefined) {
            // console.log("碰撞到的物体 未设置tag ，可能是地面 或 墙 ");
            // console.log("碰撞到的物体，未设置");
            return;
          }
          tag = threeObject1.userData.tag;

          localPos = contactPoint.get_m_localPointB();
          worldPos = contactPoint.get_m_positionWorldOnB();

        }
        if (tag == undefined) {
          // console.log("碰撞到的物体 未设置tag ，可能是地面 或 墙 ");
          return;
        }
        if (tag == "trigger") {
          // console.log("碰撞到的物体 的 trigger ");
        }
        let localPosDisplay = { x: localPos.x(), y: localPos.y(), z: localPos.z() };
        let worldPosDisplay = { x: worldPos.x(), y: worldPos.y(), z: worldPos.z() };

        console.log({ tag, localPosDisplay, worldPosDisplay });

      }

    }
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

    function checkContact() {
      physicsWorld.contactTest(myCtrlRb.userData.physicsBody, cbContactResult);
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
    function animate() {

      requestAnimationFrame(animate);

      render();
      stats.update();

    }

    function render() {

      const deltaTime = clock.getDelta();

      // if (dynamicObjects.length < maxNumObjects && time > timeNextSpawn) {
      //   generateObject();
      //   timeNextSpawn = time + objectTimePeriod;
      // }

      updatePhysics(deltaTime);

      renderer.render(scene, camera);

      time += deltaTime;

    }

    function updatePhysics(deltaTime) {

      physicsWorld.stepSimulation(deltaTime, 10);

      // Update objects
      for (let i = 0, il = dynamicObjects.length; i < il; i++) {

        const objThree = dynamicObjects[i];
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

    }
    var hasInput = false;
    var moveForce;
    var inJumping = false;
    var jumpOnce = 0;
    let dir = new THREE.Vector3(0, 0, 0);
    let dirChild = new THREE.Vector3(0, 0, 0);

    function UpdateMyUser() {

      if (rigidbody != null && !inJumping) {

        if (moveForward || moveBackward || moveLeft || moveRight) {

          hasInput = true;

          myCtrlRb.getWorldDirection(dir);
          myCtrlRbChild.getWorldDirection(dirChild);


          let dx = 0;
          let dz = 0;
          let fb = false;
          let lr = false;
          if (moveForward || moveBackward) {

            if (moveForward) {
              dz = 1;
            }
            if (moveBackward) {
              dz = -1;
            }
            fb = true;
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
          if (fb) {
            moveForce.setX(dir.x * dz * 10);
            moveForce.setZ(dir.z * dz * 10);
          }
          if (lr) {
            moveForce.setX(dirChild.x * dx * 10);
            moveForce.setZ(dirChild.z * dx * 10);
          }
          if (fb && lr) {
            moveForce.setX(((dir.x * dz) + (dirChild.x * dx)) * 0.7 * 10);
            moveForce.setZ(((dir.z * dz) + (dirChild.z * dx)) * 0.7 * 10);
          }


          rigidbody.setLinearVelocity(moveForce);

          // console.log(broadphase);
          // console.log(rigidbody.getCollisionShape());
          // console.log(rigidbody.getCollisionFlags());
          // console.log(rigidbody.getUserPointer());
          // console.log(rigidbody.getBroadphaseHandle());
          // console.log(rigidbody.getBroadphaseHandle().get_m_collisionFilterGroup());

        } else {
          if (hasInput) {

            rigidbody.setLinearVelocity(-moveForce);
            moveForce.setX(0);
            moveForce.setZ(0);

            hasInput = false;
          }
        }

      }

      console.log(moveForce.x() + " " + moveForce.y() + " " + moveForce.z());


      // console.log(myCtrlRb);


      let ve = rigidbody.getLinearVelocity();
      //判断是否在下落过程中。在地面时，y()==0 .
      if (Math.abs(ve.y()) < 0.1) {
        inJumping = false;
      }


      const objThree = myCtrlRb;
      const objPhys = objThree.userData.physicsBody;
      const ms = objPhys.getMotionState();
      if (ms) {
        ms.getWorldTransform(transformAux1);
        const p = transformAux1.getOrigin();
        const q = transformAux1.getRotation();
        objThree.position.set(p.x(), p.y(), p.z());
        // objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  }
}

export { YJAmmoOld };