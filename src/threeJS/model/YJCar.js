

import * as THREE from "three";

import { YJLoadModel } from "../YJLoadModel";
import { YJRigidbody } from "../YJRigidbody"; 

// 挖掘机
class YJCar {
  constructor(_this, scene, id, carData, pos, rotaV3, size, _state, callback, owner) {
    let scope = this;
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
      // "Numpad8": 'acceleration',
      // "Numpad2": 'braking',
      // "Numpad4": 'left',
      // "Numpad6": 'right'
      "KeyW": 'acceleration',
      "KeyS": 'braking',
      "KeyA": 'left',
      "KeyD": 'right'
    };

    let carBody;
    this.GetModel = function () {
      return carBody;
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

    let carBodyObj, wheelMeshObj, wheel_f, wheel_b, wheel_fl, wheel_fr, wheel_bl, wheel_br;
    let diggerTrigger;
    let wjjPlane001;


    let canMoving = false;
    let isUsed = false;
    this.IsUsed = function () {
      return isUsed;
    }
    this.SetCanMoving = function (b) {
      canMoving = b;
      if (canMoving) {
        isUsed = canMoving;
        SendState();
      } else {
        setTimeout(() => {
          isUsed = canMoving;
          SendState();
        }, 500);
      }
    }

    this.SetKeyboard = function (key) {
      if (!canMoving) { return; }

      if (keysActions[key]) {
        actions[keysActions[key]] = true;
        // console.log("汽车控制",key,keysActions[key]);
        stopTimes = 0;
        inDriving = true;
        SendState();
        return false;
      }
    }
    this.SetKeyboardUp = function (key) {
      if (!canMoving) { return; }
      if (keysActions[key]) {
        actions[keysActions[key]] = false;
        SendState();
        return false;
      }
    }
    let _YJLoadModel = null;
    function Init() {

      Ammo = _YJGlobal.Ammo;
      transformAux1 = new Ammo.btTransform();
      _YJAmmo = _YJGlobal._YJAmmo;
      TRANSFORM_AUX = new Ammo.btTransform();


      materialDynamic = new THREE.MeshStandardMaterial({
        color: 0xffffff, transparent: true,
        opacity: 0.5,
        alphaTest: true
      });
      materialStatic = new THREE.MeshPhongMaterial({ color: 0x999999, transparent: true, opacity: 0.5 });
      materialInteractive = new THREE.MeshPhongMaterial({
        color: 0xffffff, transparent: true, opacity: 0.5,
        alphaTest: true
      });

      physicsWorld = _YJAmmo.GetPhysicsWorld();

      // let modelPath = loadtimes > 4 ? "models/car/wheel001.gltf" : "models/car/wheel002.gltf";
      if (carData.wheelPath != "") {
        console.log("carData", carData);
        let modelPath = carData.wheelPath;
        _YJLoadModel = new YJLoadModel(_this, scene);
        _YJLoadModel.load(id, _this.$uploadUrl + modelPath,
          pos, new THREE.Vector3(0, Math.PI / 2, 0), size, false, null, (scope) => {
            let model = scope.GetModel();
            model.visible = false;
            wheelMeshObj = model.clone();

            // modelPath = loadtimes > 4 ? "models/car/carBody001.gltf" : "models/car/carBody002.gltf";
            modelPath = carData.carBodyPath;
            _YJLoadModel.load(id, _this.$uploadUrl + modelPath, pos, new THREE.Vector3(0, Math.PI / 2, 0), size, false, null, (scope) => {
              let model = scope.GetModel();
              model.visible = false;
              carBodyObj = model.clone();
              _carBodyObj = model.clone();
              createObjects();
            });

          });
      }

    }

    function TraverseOwner(model) {
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.transform = owner;
        }
      });
    }

    let _carBodyObj = null;
    this.load = function (_carBodyObj, _wheelMeshObj) {
      _carBodyObj.visible = false;
      _wheelMeshObj.visible = false;

      carBodyObj = _carBodyObj.clone();
      wheelMeshObj = _wheelMeshObj.clone();
      createObjects();
    }
    this.updateCarData = function (_carData) {
      //

      carData = _carData;
      _this._YJSceneManager.RemoveCollider(chassisMesh);
      _this._YJSceneManager.ClearMesh(chassisMesh);
      carBodyObj = _carBodyObj.clone();

      chassisMesh = null;
      for (let index = wheelMeshes.length - 1; index >= 0; index--) {
        _this._YJSceneManager.RemoveCollider(wheelMeshes[index]);
        _this._YJSceneManager.ClearMesh(wheelMeshes[index]);
      }
      createObjects();

    }

    // 销毁
    this.Destroy = function () {
      _this._YJSceneManager.RemoveCollider(chassisMesh);
      _this._YJSceneManager.ClearMesh(chassisMesh);
      for (let index = wheelMeshes.length - 1; index >= 0; index--) {
        _this._YJSceneManager.RemoveCollider(wheelMeshes[index]);
        _this._YJSceneManager.ClearMesh(wheelMeshes[index]);
      }
      console.log("删除汽车===");
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

    function createWheelMesh(radius, width, index) {
      var t = new THREE.CylinderGeometry(radius, radius, width, 24, 1);
      t.rotateZ(Math.PI / 2);
      var mesh = new THREE.Mesh(t, materialInteractive);
      // mesh.add(new THREE.Mesh(new THREE.BoxGeometry(width * 1.5, radius * 1.75, radius * .25, 1, 1, 1), materialInteractive));
      let _wheelMeshObj = wheelMeshObj.clone();

      mesh.add(_wheelMeshObj);
      _wheelMeshObj.visible = true;
      _wheelMeshObj.position.set(0, 0, 0);

      _wheelMeshObj.rotation.y = 0;
      if (index == 0) {
        _wheelMeshObj.rotateZ(Math.PI);
      }
      if (index == 1) {
        _wheelMeshObj.rotateX(-Math.PI);
      }
      if (index == 2) {
        _wheelMeshObj.rotateX(-Math.PI);
      }
      if (index == 3) {
        _wheelMeshObj.rotateZ(Math.PI);
      }
      // _wheelMeshObj.add(new THREE.AxesHelper(1));
      scene.add(mesh);
      mesh.transform = owner;

      return mesh;
    }



    function createChassisMesh(w, l, h) {
      w = parseFloat(w).toFixed(1);
      l = parseFloat(l).toFixed(1);
      h = parseFloat(h).toFixed(1);
      // console.log(w,l,h);
      var shape = new THREE.BoxGeometry(w, l, h, 1, 1, 1);
      var mesh = new THREE.Mesh(shape, materialDynamic);

      // mesh.add(new THREE.AxesHelper(5));
      mesh.add(carBodyObj);
      TraverseOwner(carBodyObj);

      carBodyObj.visible = true;

      let bodyOffset = carData.bodyOffset;
      carBodyObj.position.set(bodyOffset.x, bodyOffset.y, bodyOffset.z);
      carBodyObj.rotateY(Math.PI / 2);
      scene.add(mesh);

      carBody = mesh;
      carBody.name = id;

      mesh.transform = owner;
      return mesh;
    }
    var chassisMesh = null;
    var wheelMeshes = [];

    // 新的凹包碰撞计算，使用此生成凹包碰撞
    function GetTriangleMeshShap(model, _scale) {
      let Entity = null;
      model.traverse((item) => {
        if (item.isMesh) {
          Entity = item;
        }
      });
      console.log(Entity);

      let vertices = Entity.geometry.getAttribute('position').array;
      let indices = Entity.geometry.index.array;
      if (!_scale) {
        _scale = Entity.scale;
        // _scale = { x: 1, y: 1, z: 1 };
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

    let vehicle, body;
    function createVehicle(pos, quat) {

      // Vehicle contants

      // var chassisWidth = 2.2; //车身宽
      // var chassisHeight = 1.040; //车身高
      // var chassisLength = 4.5; //车身长


      var chassisWidth = carData.param.chassisWidth; //车身宽
      var chassisHeight = carData.param.chassisHeight; //车身高
      var chassisLength = carData.param.chassisLength; //车身长

      // var massVehicle = 800;
      var massVehicle = carData.param.massVehicle;

      // var wheelAxisPositionBack = -1.42; //后轮距中心偏移
      var wheelAxisPositionBack = carData.param.wheelAxisPositionBack; //后轮距中心偏移
      // var wheelRadiusBack = .4;  // 后轮半径
      var wheelRadiusBack = carData.param.wheelRadiusBack;  // 后轮半径
      // var wheelWidthBack = .3; // 后轮宽度
      var wheelWidthBack = carData.param.wheelWidthBack; // 后轮宽度
      // var wheelHalfTrackBack = 0.9;  //两个后轮之间的距离
      var wheelHalfTrackBack = carData.param.wheelHalfTrackBack;  //两个后轮之间的距离
      var wheelAxisHeightBack = .3;

      // var wheelAxisFrontPosition = 1.1; // 前轮距中心偏移
      // var wheelHalfTrackFront = 0.9; //两个前轮之间的距离

      var wheelAxisFrontPosition = carData.param.wheelAxisFrontPosition; // 前轮距中心偏移
      var wheelHalfTrackFront = carData.param.wheelHalfTrackFront; //两个前轮之间的距离

      var wheelAxisHeightFront = 0.3;

      // var wheelAxisHeightFront = .3;
      // var wheelRadiusFront = .35; //前轮半径
      var wheelRadiusFront = carData.param.wheelRadiusFront;  // 前轮半径
      // var wheelWidthFront = .2;
      var wheelWidthFront = carData.param.wheelWidthFront; // 前轮宽度

      var friction = 10000000;
      var suspensionStiffness = 20.0;  //悬架刚度 值越大车身越晃动
      // var suspensionDamping = 2.3; //悬架阻尼
      var suspensionDamping = 20.3; //悬架阻尼
      // var suspensionDamping = 0.103; //悬架阻尼
      var suspensionCompression = 4.4;  //悬架压缩 值越大车身越晃动
      // var suspensionRestLength = 0.6; //轮胎悬架长度 0.6
      var suspensionRestLength = carData.param.suspensionRestLength ? carData.param.suspensionRestLength : 0.6; //轮胎悬架长度 0.6
      // var rollInfluence = 0.2; //滚转通量
      var rollInfluence = 0.02; //滚转通量 转向时，该值越大越容易翻车

      var steeringIncrement = .04;
      var steeringClamp = .5;
      // var maxEngineForce = 2000; //引擎最大马力
      var maxEngineForce = carData.param.maxEngineForce; //引擎最大马力
      // var maxBreakingForce = 100; //回退或停止马力
      var maxBreakingForce = carData.param.maxBreakingForce ? carData.param.maxBreakingForce : 100;  //回退或停止马力

      // Chassis
      var geometry = new Ammo.btBoxShape(new Ammo.btVector3(chassisWidth * .5, chassisHeight * .5, chassisLength * .5));

      // var geometry = GetTriangleMeshShap(carBodyObj);

      var transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
      transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
      var motionState = new Ammo.btDefaultMotionState(transform);
      var localInertia = new Ammo.btVector3(0, 0, 0);
      geometry.calculateLocalInertia(massVehicle, localInertia);
      body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia));
      // var body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(massVehicle, motionState, geometry, localInertia));
      body.setActivationState(DISABLE_DEACTIVATION);


      physicsWorld.addRigidBody(body);

      if (chassisMesh == null) {
        chassisMesh = createChassisMesh(chassisWidth, chassisHeight, chassisLength);

        // chassisMesh.add(new THREE.AxesHelper(5));
        // YJ
      }

      chassisMesh.owner = scope;
      chassisMesh.userData.tag = "car";
      chassisMesh.userData.physicsBody = body;
      body.threeObject = chassisMesh;

      // Raycast Vehicle
      var engineForce = 0;
      var vehicleSteering = 0;
      var breakingForce = 0;
      var tuning = new Ammo.btVehicleTuning();
      var rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
      vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
      // var vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster);
      vehicle.setCoordinateSystem(0, 1, 2);
      physicsWorld.addAction(vehicle);


      // Wheels
      var FRONT_LEFT = 0;
      var FRONT_RIGHT = 1;
      var BACK_LEFT = 2;
      var BACK_RIGHT = 3;
      // var wheelMeshes = [];
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

        wheelMeshes[index] = createWheelMesh(radius, width, index);
      }

      // 前 左轮
      addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_LEFT);
      // 前 右轮
      addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, FRONT_RIGHT);
      // 后 左轮
      addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_LEFT);
      // 后 右轮
      addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, BACK_RIGHT);

      // Sync keybord actions and physics and graphics
      function sync(dt) {

        if (!inDriving) { return; }

        var speed = vehicle.getCurrentSpeedKmHour();

        // speedometer.innerHTML = (speed < 0 ? '(R) ' : '') + Math.abs(speed).toFixed(1) + ' km/h';

        breakingForce = 0;
        engineForce = 0;
        inMoving = true;


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

        // 停止操作时，停下汽车
        if (!actions.acceleration && !actions.braking) {

          let yy = body.getLinearVelocity();
          // console.log(yy.x() + " " + yy.y() + " " + yy.z()
          //   + " == " + speed);
          // console.log(speed);
          if (Math.abs(speed) > 0.05) {
            // 判断汽车朝向，朝向不同
            let dir = new THREE.Vector3(0, 0, 0); //前后方向
            chassisMesh.getWorldDirection(dir);
            // console.log("方向 ：" + dir.z);
            // console.log("力方向 ：" + yy.z());
            // console.log(speed);

            if (dir.z > 0) {
              if (yy.z() > 0) {
                engineForce = -maxEngineForce;
              } else {
                engineForce = maxEngineForce;
              }
            } else {
              if (yy.z() > 0) {
                engineForce = maxEngineForce;
              } else {
                engineForce = -maxEngineForce;
              }
            }
            breakingForce = maxEngineForce/20;
            // vehicleSteering = 0;//左右转向
            // engineForce = -maxEngineForce ;
          } else {
            inMoving = false;

            // stopTimes++;
            //解除物理模拟
            // if (times > 100) {
            //   if (stopTimes > 50 && stopTimes < 100) {
            //     inDriving = false;
            //   } 
            //   if (stopTimes > 100) {
            //     inDriving = true;
            //   }
            // }
          }
          // if (Math.abs(yy.z()) > 0.1) {
          //   engineForce = -maxEngineForce;
          // }
        }

        vehicle.applyEngineForce(engineForce, BACK_LEFT);
        vehicle.applyEngineForce(engineForce, BACK_RIGHT);

        vehicle.setBrake(breakingForce / 2, FRONT_LEFT);
        vehicle.setBrake(breakingForce / 2, FRONT_RIGHT);
        vehicle.setBrake(breakingForce, BACK_LEFT);
        vehicle.setBrake(breakingForce, BACK_RIGHT);

        vehicle.setSteeringValue(vehicleSteering, FRONT_LEFT);
        vehicle.setSteeringValue(vehicleSteering, FRONT_RIGHT);

        // vehicle.updateFriction(dt);

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


      // update();
      if (callback) {
        callback(scope);
      }
    }

    function createObjects() {

      console.log("创建汽车 ====== ");

      let euler = new THREE.Euler();
      euler.x = rotaV3.x;
      euler.y = rotaV3.y;
      euler.z = rotaV3.z;
      ZERO_QUATERNION.setFromEuler(euler);
      createVehicle(pos, ZERO_QUATERNION);
    }


    let inMoving = false;
    var state = {};
    let chassisMeshPos = new THREE.Vector3(0, 0, 0);
    let c_p = null;//= new THREE.Vector3()


    let c_p_arr = [];
    //从外接收，获取开关状态更新动画
    this.ReceiveState = function (_state) {
      if (_state == undefined) {
        return;
      }
      if (_state.isUsed != undefined) {
        isUsed = _state.isUsed;
      }

      // console.log("接收 汽车 状态 ", _Global.mainUser, _state);

      if (_Global.mainUser) {
        if (_state.acceleration != undefined) {
          actions.acceleration = _state.acceleration;
          actions.braking = _state.braking;
          actions.left = _state.left;
          actions.right = _state.right;
        }

        // if (_state.c_p != undefined) { 
        //   oldPosState.c_p = state.c_p;
        //   oldPosState.w_1_rV3 = state.w_1_rV3;
        // }
      } else {
        if (_state.c_p != undefined) {

          // 窗口隐藏还是会接收，但不会update 。所以限定只保留最新的数据
          if (c_p_arr.length > 10) {
            c_p_arr.splice(0, c_p_arr.length);
          }
          c_p_arr.push([
            { pos: _state.c_p, quat: _state.c_r },
            { pos: _state.w_1_p, quat: _state.w_1_r },
            { pos: _state.w_2_p, quat: _state.w_2_r },
            { pos: _state.w_3_p, quat: _state.w_3_r },
            { pos: _state.w_4_p, quat: _state.w_4_r },
          ]);
        }
      }
 
    }

    function posToV3(v3) {
      let xx = v3.x;
      let yy = v3.y;
      let zz = v3.z;
      return { x: xx.toFixed(2), y: yy.toFixed(2), z: zz.toFixed(2) };
      // return { x: v3.x, y: v3.y, z: v3.z };
    }
    function posToV4(v4) {
      // let xx = v4.x;
      // let yy = v4.y;
      // let zz = v4.z;
      // let ww = v4.w;
      // return { x: xx.toFixed(2), y: yy.toFixed(2), z: zz.toFixed(2), w: ww.toFixed(2) };
      return { x: v4.x, y: v4.y, z: v4.z, w: v4.w };
    }

    function SetModelRigidPosRota(rigidbody, pos, quat) {
      const ms = rigidbody.getMotionState();
      if (ms) {
        // 经测试，需要连续设置两次才会成功
        for (let i = 0; i < 1; i++) {
          ms.setWorldTransform(transformAux1);
          transformAux1.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
          transformAux1.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        }
        const p = transformAux1.getOrigin();
        rigidbody.threeObject.position.set(p.x(), p.y(), p.z());
        const q = transformAux1.getRotation();
        rigidbody.threeObject.quaternion.set(q.x(), q.y(), q.z(), q.w());

        rigidbody.setMotionState(ms);
      }
    }
    function SetModelPosRota(model, p, q) {
      model.position.set(p.x, p.y, p.z);
      model.quaternion.set(q.x, q.y, q.z, q.w);
    }
    let sendTimes = 0;

    let oldCtrlState = {};

    //本地操作 并向服务器发送
    function SendState() {

      state = {};
      state.acceleration = actions.acceleration | false;
      state.braking = actions.braking | false;
      state.left = actions.left | false;
      state.right = actions.right | false;

      state.isUsed = isUsed;

      if (oldCtrlState.isUsed != undefined) {
        if (state.isUsed == oldCtrlState.isUsed
          && state.acceleration == oldCtrlState.acceleration
          && state.braking == oldCtrlState.braking
          && state.left == oldCtrlState.left
          && state.right == oldCtrlState.right
        ) {
          // console.log(" 控制状态相同，不发送同步 ");
          return;
        } else {
        }
      } else {
      }
      // console.log(" 发送控制状态相同  ");

      if (_YJGlobal._YJDyncManager) {
        _YJGlobal._YJDyncManager.SendSceneState(scope.id, "car", state);
      }

      oldCtrlState.acceleration = state.acceleration;
      oldCtrlState.braking = state.braking;
      oldCtrlState.left = state.left;
      oldCtrlState.right = state.right;
      oldCtrlState.isUsed = isUsed;

      // if(state.left){
      //   AddWheelRota(wheelMeshes[0], 1);
      //   AddWheelRota(wheelMeshes[1], 1);
      // }else{

      // }
      // if(state.right){
      //   AddWheelRota(wheelMeshes[0], -1);
      //   AddWheelRota(wheelMeshes[1], -1);
      // }
    }

    function AddWheelRota(wheelMeshes, y) {
      wheelMeshes.rotation.z += y;
    }

    let oldPosState = {};

    function checkV3Equel(v1, v2) {
      return !(Math.abs(v1.z - v2.z) > 0.05
        && Math.abs(v1.x - v2.x) > 0.05
        // && Math.abs(v1.y - v2.y) > 0.05
      );

      return Math.abs(v1.z - v2.z) < 0.01
        && Math.abs(v1.x - v2.x) < 0.01
        && Math.abs(v1.y - v2.y) < 0.01;
    }
    function checkQ3Equel(q1, q2) {

      let qq1 = (q1.x * q1.x + q1.y * q1.y + q1.z * q1.z);
      let qq2 = (q2.x * q2.x + q2.y * q2.y + q2.z * q2.z);
      let qd = Math.abs(qq1 - qq2) * 100000;
      // console.log( " 四元数是否相等 22 ",qq1,qq2,qd.toFixed(3));
      return qd < 0.5;
      return Math.abs(v1.z - v2.z) < 0.1
        && Math.abs(v1.x - v2.x) < 0.1
        && Math.abs(v1.y - v2.y) < 0.1;

      return Math.abs(v1.z - v2.z) < 0.01
        && Math.abs(v1.x - v2.x) < 0.01
        && Math.abs(v1.y - v2.y) < 0.01;
    }
    function checkQuatEquel(q1, q2) {
      let qq1 = (q1.x * q1.x + q1.y * q1.y + q1.z * q1.z + q1.w * q1.w);
      let qq2 = (q2.x * q2.x + q2.y * q2.y + q2.z * q2.z + q2.w * q2.w);
      let qd = Math.abs(qq1 - qq2);
      // console.log( " 四元数是否相等 ",qd.toFixed(3));
      return qd < 0.5;
      return Math.abs(q1.z - q2.z) < 0.5
        && Math.abs(q1.x - q2.x) < 0.5
        && Math.abs(q1.w - q2.w) < 0.5
        && Math.abs(q1.y - q2.y) < 0.5;

      return Math.abs(q1.z - q2.z) < 0.01
        && Math.abs(q1.x - q2.x) < 0.01
        && Math.abs(q1.w - q2.w) < 0.01
        && Math.abs(q1.y - q2.y) < 0.01;
    }


    let updateTimes = 0;
    function SendStatePos() {
      // const deltaTime = clock.getDelta();
      // updateTimes += deltaTime;
      // // console.log("发送同步",updateTimes);
      // if (updateTimes >= 0.1) {
      //   updateTimes = 0;
      //   // console.error("发送同步",);
      // } else {
      //   return null;
      // }

      state = {};
      state.c_p = posToV3(chassisMesh.position);
      state.c_r = posToV4(chassisMesh.quaternion);

      state.w_1_p = posToV3(wheelMeshes[0].position);
      state.w_1_r = posToV4(wheelMeshes[0].quaternion);

      state.w_1_rV3 = (wheelMeshes[0].rotation);

      state.w_2_p = posToV3(wheelMeshes[1].position);
      state.w_2_r = posToV4(wheelMeshes[1].quaternion);

      state.w_3_p = posToV3(wheelMeshes[2].position);
      state.w_3_r = posToV4(wheelMeshes[2].quaternion);

      state.w_4_p = posToV3(wheelMeshes[3].position);
      state.w_4_r = posToV4(wheelMeshes[3].quaternion);

      if (oldPosState.c_p != undefined) {

        // if (checkV3Equel(state.c_p, oldPosState.c_p)) {
        //   // console.log(" 汽车位置状态相同，不发送同步 ");
        //   return;
        // } else {
        //   // console.log(" 同步 汽车位置状态 111 ",state.c_p , oldPosState.c_p);
        //   // console.log(" 同步 汽车位置状态 111 ",state.w_1_rV3 , oldPosState.w_1_rV3);

        //   // oldPosState.c_p = state.c_p;
        //   // oldPosState.w_1_rV3 = state.w_1_rV3;
        // }
      } else {
        // console.log(" 同步 汽车位置状态 222 ");
      }
      oldPosState.c_p = state.c_p;
      oldPosState.w_1_rV3 = state.w_1_rV3;

      if (!inMoving) {
        return;
      }

      if (_YJGlobal._YJDyncManager) {
        _YJGlobal._YJDyncManager.SendSceneState(scope.id, "car", state);
      }
    }


    //同步服务器上的其他客户端创建的模型的状态

    function LoadCompleted() {

    }
    this.DestroyCollider = function () {
      // if (model != null) {
      //   //删除碰撞体 
      //   model.traverse(function (item) {
      //     if (item instanceof THREE.Mesh) {
      //       item.geometry.dispose();
      //       try {
      //         item.material.dispose();
      //       } catch (error) {
      //       }
      //     }
      //   });
      // }
      //删除碰撞体
      // _this._YJSceneManager.RemoveCollider(trigger);
      // _this._YJSceneManager.RemoveCollider(bucket);
      // _this._YJSceneManager.RemoveCollider(wjjPlane001);
    }

    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(model.position, model.rotation);
    }

    // 初始计次，每个客户端都自行物理模拟，超过100则只受主控控制
    let times = 0;
    // 停止时计次，超过100则取消动力学、被控制后归零
    let stopTimes = 0;

    function update() {
      // return;
      // console.log( "_Global.mainUser  = ",_Global.mainUser);
      requestAnimationFrame(update);

      if (times < 100 || _Global.mainUser) {
        if (times > 100) {
          SendStatePos();
        }
        var dt = clock.getDelta();
        for (var i = 0; i < syncList.length; i++) {
          syncList[i](dt);
        }
        times++;
      }

      if (c_p_arr.length > 0) {
        SetModelRigidPosRota(chassisMesh.userData.physicsBody, c_p_arr[0][0].pos, c_p_arr[0][0].quat);
        SetModelPosRota(wheelMeshes[0], c_p_arr[0][1].pos, c_p_arr[0][1].quat);
        SetModelPosRota(wheelMeshes[1], c_p_arr[0][2].pos, c_p_arr[0][2].quat);
        SetModelPosRota(wheelMeshes[2], c_p_arr[0][3].pos, c_p_arr[0][3].quat);
        SetModelPosRota(wheelMeshes[3], c_p_arr[0][4].pos, c_p_arr[0][4].quat);
        c_p_arr.shift();
      }
    }
    let inDriving = true;
    this._update = function () {
      // console.log( _Global.mainUser);
      if (times < 100 || _Global.mainUser) {
        if (times > 100) {
          SendStatePos();
        }

        var dt = clock.getDelta();
        for (var i = 0; i < syncList.length; i++) {
          syncList[i](dt);
        }
        times++;
      }

      if (c_p_arr.length > 0) {
        SetModelRigidPosRota(chassisMesh.userData.physicsBody, c_p_arr[0][0].pos, c_p_arr[0][0].quat);
        SetModelPosRota(wheelMeshes[0], c_p_arr[0][1].pos, c_p_arr[0][1].quat);
        SetModelPosRota(wheelMeshes[1], c_p_arr[0][2].pos, c_p_arr[0][2].quat);
        SetModelPosRota(wheelMeshes[2], c_p_arr[0][3].pos, c_p_arr[0][3].quat);
        SetModelPosRota(wheelMeshes[3], c_p_arr[0][4].pos, c_p_arr[0][4].quat);
        c_p_arr.shift();
      }

    }

    Init();

  }
}

export { YJCar };