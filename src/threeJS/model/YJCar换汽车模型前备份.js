

import * as THREE from "three";

import { YJLoadModel } from "../YJLoadModel";
import { YJRigidbody } from "../YJRigidbody";
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";

// 挖掘机
class YJCar {
  constructor(_this, scene, id, modelPath, pos, rotaV3, size, _state) {

    this.id = id;
    this.pos = null;
    this.rota = null;
    let _YJRigidbody = null;
    // - Global variables -
    var DISABLE_DEACTIVATION = 4;
    var TRANSFORM_AUX;
    var ZERO_QUATERNION = new THREE.Quaternion(0, 0, 0, 1);

    // Graphics variables

    var terrainMesh, texture;
    var clock = new THREE.Clock();
    var materialDynamic, materialStatic, materialInteractive;

    // Physics variables 
    var physicsWorld;

    var syncList = [];
    var time = 0;
    var objectTimePeriod = 3;
    var timeNextSpawn = time + objectTimePeriod;
    var maxNumObjects = 30;

    // Keybord actions
    var actions = {};
    var keysActions = {
      "Numpad8": 'acceleration',
      "Numpad2": 'braking',
      "Numpad4": 'left',
      "Numpad6": 'right'
      // "KeyW": 'acceleration',
      // "KeyS": 'braking',
      // "KeyA": 'left',
      // "KeyD": 'right'
    };

    let model;
    this.GetModel = function () {
      return model;
    }

    let Ammo = null;
    let _YJAmmo = null;

    const margin = 0.05;
    const STATE = { DISABLE_DEACTIVATION: 4 };
    var rigidbody = null;
    var moveForce;
    let threeObject = null;
    let transformAux1;
    let cbContactResult, cbContactPairResult;

    let physicsBody;

    let body, wheel, wheel_f, wheel_b, wheel_fl, wheel_fr, wheel_bl, wheel_br;
    let diggerTrigger;
    let wjjPlane001;

    function Init() {

      Ammo = _YJGlobal.Ammo;
      transformAux1 = new Ammo.btTransform();
      _YJAmmo = _YJGlobal._YJAmmo;
      TRANSFORM_AUX = new Ammo.btTransform();


      materialDynamic = new THREE.MeshStandardMaterial({ color: 0xffffff });
      materialStatic = new THREE.MeshPhongMaterial({ color: 0x999999 });
      materialInteractive = new THREE.MeshPhongMaterial({ color: 0xffffff,transparent:true,opacity:0.5});

      physicsWorld = _YJAmmo.GetPhysicsWorld();


      new YJKeyboard((key) => {
        if (keysActions[key]) {
          actions[keysActions[key]] = true;
          return false;
        }
      }, (key) => {
        if (keysActions[key]) {
          actions[keysActions[key]] = false;
          return false;
        }
      });
      return;

      let _YJLoadModel = new YJLoadModel( scene);
      _YJLoadModel.load(id, modelPath, pos, rotaV3, size, false, null, (scope) => {
        let model = scope.GetModel();
        console.log("加载汽车模型 ", model);
        body = LoopFindChild("collider", model);
        // body = LoopFindChild("body", model); 

        wheel_fl = LoopFindChild("wheelFL", model);
        wheel_fr = LoopFindChild("wheelFR", model);
        wheel_bl = LoopFindChild("wheelBL", model);
        wheel_br = LoopFindChild("wheelBR", model);
        // _YJRigidbody = new YJRigidbody(scene,body,1,0.2);

        //  let physicsBody_wheel_fl = _YJAmmo.YJCoustomPhysicsBody(wheel_fl, margin); 
        //  let physicsBody_wheel_fr = _YJAmmo.YJCoustomPhysicsBody(wheel_fr, margin); 

        //  let physicsBody_wheel_bl = _YJAmmo.YJCoustomPhysicsBody(wheel_bl, margin); 
        //  let physicsBody_wheel_br = _YJAmmo.YJCoustomPhysicsBody(wheel_br, margin); 

        //  let physicsBody_body = _YJAmmo.YJCoustomPhysicsBody(body, margin); 
        //  let physicsBody_body = _YJAmmo.YJCoustomPhysicsBody(body, margin); 

        //  let physicsBody_body = _YJAmmo.YJCoustomBody(body, margin); 
        // _YJRigidbody = new YJRigidbody(scene,group,playerHeight,0.2);

        _YJRigidbody = new YJRigidbody(scene, model, 0.9, 0.51);
        // _YJRigidbody.GenerateRigid(scene,model);
        _YJRigidbody.GenerateMeshRigid(100, scene, body, model, new THREE.Vector3(1.3, 0.7, 2), 1.5, 0.51);

      });

    }

    function createBox(pos, quat, w, l, h, mass, friction) {
      var material = mass > 0 ? materialDynamic : materialStatic;
      var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
      var geometry = new Ammo.btBoxShape(new Ammo.btVector3(w * 0.5, l * 0.5, h * 0.5));

      if (!mass) mass = 0;
      if (!friction) friction = 1;

      var mesh = new THREE.Mesh(shape, material);
      mesh.position.copy(pos);
      mesh.quaternion.copy(quat);
      scene.add(mesh);

      var transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      var motionState = new Ammo.btDefaultMotionState(transform);

      var localInertia = new Ammo.btVector3(0, 0, 0);
      geometry.calculateLocalInertia(mass, localInertia);

      var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, geometry, localInertia);
      var body = new Ammo.btRigidBody(rbInfo);

      body.setFriction(friction);
      //body.setRestitution(.9);
      //body.setDamping(0.2, 0.2);

      physicsWorld.addRigidBody(body);

      if (mass > 0) {
        body.setActivationState(DISABLE_DEACTIVATION);
        // Sync physics and graphics
        function sync(dt) {
          var ms = body.getMotionState();
          if (ms) {
            ms.getWorldTransform(TRANSFORM_AUX);
            var p = TRANSFORM_AUX.getOrigin();
            var q = TRANSFORM_AUX.getRotation();
            mesh.position.set(p.x(), p.y(), p.z());
            mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
          }
        }

        syncList.push(sync);
      }
    }

    function createWheelMesh(radius, width) {
      var t = new THREE.CylinderGeometry(radius, radius, width, 24, 1);
      t.rotateZ(Math.PI / 2);
      var mesh = new THREE.Mesh(t, materialInteractive);
      mesh.add(new THREE.Mesh(new THREE.BoxGeometry(width * 1.5, radius * 1.75, radius * .25, 1, 1, 1), materialInteractive));
      scene.add(mesh);
      return mesh;
    }

    function createChassisMesh(w, l, h) {
      var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
      var mesh = new THREE.Mesh(shape, materialInteractive);
      mesh.add(new THREE.AxesHelper(5));
      scene.add(mesh);
      return mesh;
    }

    function createVehicle(pos, quat) {

      // Vehicle contants

      var chassisWidth = 1.8;
      var chassisHeight = .6;
      var chassisLength = 4;
      var massVehicle = 800;

      var wheelAxisPositionBack = -1;
      var wheelRadiusBack = .4;
      var wheelWidthBack = .3;
      var wheelHalfTrackBack = 1;
      var wheelAxisHeightBack = .3;

      var wheelAxisFrontPosition = 1.7;
      var wheelHalfTrackFront = 1;
      var wheelAxisHeightFront = .3;
      var wheelRadiusFront = .35;
      var wheelWidthFront = .2;

      var friction = 1000;
      var suspensionStiffness = 20.0;
      var suspensionDamping = 2.3;
      var suspensionCompression = 4.4;
      var suspensionRestLength = 0.6;
      var rollInfluence = 0.2;

      var steeringIncrement = .04;
      var steeringClamp = .5;
      var maxEngineForce = 2000;
      var maxBreakingForce = 100;

      // Chassis
      var geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5));
      var transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      var motionState = new Ammo.btDefaultMotionState(transform);
      var localInertia = new Ammo.btVector3(0, 0, 0);
      geometry.calculateLocalInertia(massVehicle, localInertia);
      var body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia));
      body.setActivationState(DISABLE_DEACTIVATION);
      physicsWorld.addRigidBody(body);
      var chassisMesh = createChassisMesh(chassisWidth, chassisHeight, chassisLength);

      // Raycast Vehicle
      var engineForce = 0;
      var vehicleSteering = 0;
      var breakingForce = 0;
      var tuning = new Ammo.btVehicleTuning();
      var rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
      var vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
      vehicle.setCoordinateSystem(0, 1, 2);
      physicsWorld.addAction(vehicle);

      // Wheels
      var FRONT_LEFT = 0;
      var FRONT_RIGHT = 1;
      var BACK_LEFT = 2;
      var BACK_RIGHT = 3;
      var wheelMeshes = [];
      var wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);
      var wheelAxleCS = new Ammo.btVector3(-1, 0, 0);

      function addWheel(isFront, pos, radius, width, index) {

        var wheelInfo = vehicle.addWheel(
          pos,
          wheelDirectionCS0,
          wheelAxleCS,
          suspensionRestLength,
          radius,
          tuning,
          isFront);

        wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
        wheelInfo.set_m_frictionSlip(friction);
        wheelInfo.set_m_rollInfluence(rollInfluence);

        wheelMeshes[index] = createWheelMesh(radius, width);
      }

      addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
      addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
      addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
      addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);

      // Sync keybord actions and physics and graphics
      function sync(dt) {

        var speed = vehicle.getCurrentSpeedKmHour();

        // speedometer.innerHTML = (speed < 0 ? '(R) ' : '') + Math.abs(speed).toFixed(1) + ' km/h';

        breakingForce = 0;
        engineForce = 0;

        if (actions.acceleration) {
          if (speed < -1)
            breakingForce = maxBreakingForce;
          else engineForce = maxEngineForce;
        }
        if (actions.braking) {
          if (speed > 1)
            breakingForce = maxBreakingForce;
          else engineForce = -maxEngineForce / 2;
        }
        if (actions.left) {
          if (vehicleSteering < steeringClamp)
            vehicleSteering += steeringIncrement;
        }
        else {
          if (actions.right) {
            if (vehicleSteering > -steeringClamp)
              vehicleSteering -= steeringIncrement;
          }
          else {
            if (vehicleSteering < -steeringIncrement)
              vehicleSteering += steeringIncrement;
            else {
              if (vehicleSteering > steeringIncrement)
                vehicleSteering -= steeringIncrement;
              else {
                vehicleSteering = 0;
              }
            }
          }
        }

        vehicle.applyEngineForce(engineForce, BACK_LEFT);
        vehicle.applyEngineForce(engineForce, BACK_RIGHT);

        vehicle.setBrake(breakingForce / 2, FRONT_LEFT);
        vehicle.setBrake(breakingForce / 2, FRONT_RIGHT);
        vehicle.setBrake(breakingForce, BACK_LEFT);
        vehicle.setBrake(breakingForce, BACK_RIGHT);

        vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT);
        vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT);

        var tm, p, q, i;
        var n = vehicle.getNumWheels();
        for (i = 0; i < n; i++) {
          vehicle.updateWheelTransform(i, true);
          tm = vehicle.getWheelTransformWS(i);
          p = tm.getOrigin();
          q = tm.getRotation();
          wheelMeshes[i].position.set(p.x(), p.y(), p.z());
          wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        tm = vehicle.getChassisWorldTransform();
        p = tm.getOrigin();
        q = tm.getRotation();
        chassisMesh.position.set(p.x(), p.y(), p.z());
        chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }

      syncList.push(sync);
    }

    function createObjects() {
      let euler = new THREE.Euler();
      euler.x = rotaV3.x;
      euler.y = rotaV3.y;
      euler.z = rotaV3.z;
      ZERO_QUATERNION.setFromEuler(euler);
      createVehicle(pos, ZERO_QUATERNION);
    }
    let speed = new THREE.Vector3(0, 0, 0);

    var moveForward = false;
    var moveLeft = false;
    var moveBackward = false;
    var moveRight = false;
    var moveUp = false;
    var moveDown = false;
    var inShift = false;

 
    function LoopFindChild(childName, parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if (cn[1] == childName) {
          c.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              item.receiveShadow = true;
            }
          });
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindChild(childName, c);
          if (cc != null) {
            cc.traverse(function (item) {
              if (item instanceof THREE.Mesh) {
                item.castShadow = true;
                item.receiveShadow = true;
              }
            });
            return cc;
          }
        }
      }
      return null;
    }



    var state = {};
    //从外接收，获取开关状态更新动画
    this.SetState = function (_state) {
      // console.log("接收挖掘机状态 " ,_state);
      if (_state == undefined || _state == false || _state == "false") {
        return;
      }
      state = _state;
      // state= {bodyRota:2,bigArmRota:2,frontArmRota:1,bucketRota:1};
      ChangeModel();
    }



    //大臂旋转角度限制
    let bigArmRange = new THREE.Vector2(-0.5, 1);
    let frontArmRange = new THREE.Vector2(-0.43, 1.58);
    let bucketRange = new THREE.Vector2(-1.60, 2.33);
    function Clamp(value, min, max) {
      if (value <= min) { value = min; }
      if (value >= max) { value = max; }
      return value;
    }
    function ChangeModel() {
      if (body == undefined || bigArm == undefined ||
        frontArm == undefined || bucket == undefined) {
        return;
      }
      // console.log(state);
      if (state.bodyRota != undefined) {
        body.rotation.z = state.bodyRota;
      }
      if (state.bigArmRota != undefined) {
        let rota = state.bigArmRota;
        //限制机械臂旋转角度
        rota = Clamp(rota, bigArmRange.x, bigArmRange.y);
        bigArm.rotation.y = rota;
      }
      if (state.frontArmRota != undefined) {
        let rota = state.frontArmRota;
        rota = Clamp(rota, frontArmRange.x, frontArmRange.y);

        frontArm.rotation.y = rota;
      }
      if (state.bucketRota != undefined) {
        let rota = state.bucketRota;
        rota = Clamp(rota, bucketRange.x, bucketRange.y);
        bucket.rotation.y = rota;
      }


      //更新铲斗的 collider
      _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(bucket, bucket.scale);
    }
    //本地操作 并向服务器发送
    this.SendState = function (nodeName, rota) {

      // let body,bigArm,frontArm,bucket,joystickLeft,joystickCenter,joystickRight;


      state.inCtrling = true;

      if (nodeName == "body") {
        body.rotation.z += rota;
        state.bodyRota = body.rotation.z;
      }
      if (nodeName == "bigArm") {
        bigArm.rotation.y += rota;
        state.bigArmRota = bigArm.rotation.y;
      }
      if (nodeName == "frontArm") {
        frontArm.rotation.y += rota;
        state.frontArmRota = frontArm.rotation.y;
      }
      if (nodeName == "bucket") {
        bucket.rotation.y += rota;
        state.bucketRota = bucket.rotation.y;
      }

      ChangeModel();

      _this.SendSceneState(this.id, name, state);
      // state= {bodyRota:2,bigArmRota:2,frontArmRota:1,bucketRota:1};
    }


    //-------添加删除 开始------------
    //同步服务器上的其他客户端创建的模型的状态
    function _SetState(_state) {
      if (_state == undefined || _state == false) { return; }
      state = _state;
      ChangeModel();
    }


    this.ResetSetPosRota = function (pos, rota) {
      if (model == null) { return; }
      this.SetPosRota(pos, rota);
      this.DestroyCollider();
      CreateCollider();
    }
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota) {
      if (model == null) { return; }
      model.position.set(pos.x, pos.y, pos.z); // 
      if (rota != undefined) {
        model.rotation.set(rota.x, rota.y, rota.z); // 
      }
    }

    //可由用户创建的模型，放下是创建碰撞体
    this.SetDown = function (pos, rota) {
      CreateCollider();
    }

    function LoadCompleted() {
      _Global.YJ3D._YJSceneManager.LoadSingleModelCompleted();
    }
    //删除模型
    this.Destroy = function () {
      LoadCompleted();
      this.DestroyCollider();
      scene.remove(model);

    }
    this.DestroyCollider = function () {
      if (model != null) {
        //删除碰撞体 
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.geometry.dispose();
            try {
              item.material.dispose();
            } catch (error) {
            }
          }
        });
      }
      //删除碰撞体
      _Global.YJ3D._YJSceneManager.RemoveCollider(trigger);
      _Global.YJ3D._YJSceneManager.RemoveCollider(bucket);
      _Global.YJ3D._YJSceneManager.RemoveCollider(wjjPlane001);
    }

    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(model.position, model.rotation);
    }


    let trigger = null;
    //创建碰撞体
    function CreateCollider() {
      trigger = _Global.YJ3D._YJSceneManager.CreateModelTrigger(new THREE.Vector3(6, 5, 6),
        model.position, model.quaternion, id, "digger"
      );


      //创建铲斗的 collider
      _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(bucket, bucket.scale);

      wjjPlane001 = LoopFindChild("wjjPlane001", model);
      _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(wjjPlane001, wjjPlane001.scale);

    }

    //-------添加删除 开始------------
 

    function update() {
      requestAnimationFrame(update);
      var dt = clock.getDelta();
      for (var i = 0; i < syncList.length; i++){
        syncList[i](dt);
      }
    }

    Init();
    createObjects();

    update();

  }
}

export { YJCar };