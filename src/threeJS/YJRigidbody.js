



import * as THREE from "three";

class YJRigidbody {
  constructor(scene, group, playerHeight, playerRadius) {
    let Ammo = null;
    let _YJAmmo = null;

    const margin = 0.05;
    const STATE = { DISABLE_DEACTIVATION: 4 };
    var rigidbody = null;
    var moveForce;
    let threeObject = null;
    let transformAux1;


    let forceVec,positionVec;

    function Init() {
      Ammo = _YJGlobal.Ammo;
      transformAux1 = new Ammo.btTransform();

      _YJAmmo = _YJGlobal._YJAmmo;

      // GenerateRigid();
    }

    this.GenerateRigid = function () {

      let shape = null;

      let radius = playerRadius;
      // 刚体高度由外部传入
      let height = playerHeight;

      //角色碰撞球体材质球
      let playerSphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });

      // Sphere 
      // threeObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), playerSphereMat);
      // shape = new Ammo.btSphereShape(radius);

      //胶囊体必须要锁定x z 轴旋转，否则会倒
      //半径设0，隐藏胶囊参考体
      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(0, height - 2 * radius, 20, 16), playerSphereMat);
      threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(radius, height - 2 * radius, 20, 16), playerSphereMat);
      threeObject.name = "刚体胶囊体";
      shape = new Ammo.btCapsuleShape(radius, height - 2 * radius);

      shape.setMargin(margin);

      let pos = group.position;
      pos.y += playerHeight / 2;
      threeObject.position.copy(pos);

      const mass = radius * 10;
      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));

      // quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0),group.rotation.y);
      // transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setActivationState(STATE.DISABLE_DEACTIVATION);

      // body.setCollisionFlags(body.getCollisionFlags() | 2);
      //锁定x z轴，只可旋转Y轴，即左右旋转，不倒
      //胶囊体必须要锁定x z 轴旋转，否则会倒
      body.setAngularFactor(0, 1, 0);

      // let axes = new THREE.AxesHelper(5); // 坐标轴
      // threeObject.add(axes); // 场景添加坐标轴

      threeObject.userData.physicsBody = body;
      threeObject.userData.tag = "npc";

      // threeObject.receiveShadow = true;
      // threeObject.castShadow = true;

      scene.add(threeObject);
      threeObject.add(group);
      group.position.set(0, -playerHeight / 2, 0);
      // group.position.y = 2;


      _YJAmmo.addRigidBody(body);

      rigidbody = body;
      //设置阻尼。第一个参数空气阻力，第二个是滑动阻力。 0-1 之间
      rigidbody.setDamping(0.01, 0.01);
      body.setRollingFriction(10); //滚动摩擦力
      //設置摩擦力,决定在斜坡上是否能滑下来。 值越大，坡越陡才能滑下来
      rigidbody.setFriction(10);
      //设置重力缩放。5倍重力，倍数越大，下落越快 
      rigidbody.setGravity(new Ammo.btVector3(0, -9.8, 0));

      //开启刚体模拟。默认为开启
      rigidbody.setActivationState(true);
      moveForce = new Ammo.btVector3(0, -9.8, 0);

      // threeObject.add(new THREE.AxesHelper(3)); // 添加坐标轴

      //碰撞检测trigger，必须添加此属性
      rigidbody.threeObject = threeObject;

      // console.error(" 初始化NPC刚体 ");

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
    this.GenerateMeshRigid = function (mass, scene, mesh, group, size) {

      
      // forceVec= new Ammo.btVector3(30, 0, 0); // 施加的力向右 
      // positionVec= new Ammo.btVector3(0.5, size.y/2, 1); // 施加力的位置 

      forceVec= new Ammo.btVector3(0, 0, 0); // 施加的力向右 
      positionVec= new Ammo.btVector3(0, size.y/2, 0); // 施加力的位置 

      let shape = null;


      //角色碰撞球体材质球
      let material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });


      let sx = size.x;
      let sy = size.y;
      let sz = size.z;
      // Sphere 
      // threeObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), material);
      // shape = new Ammo.btSphereShape(radius);

      //胶囊体必须要锁定x z 轴旋转，否则会倒
      //半径设0，隐藏胶囊参考体
      // threeObject = new THREE.Mesh(new THREE.CapsuleGeometry(0, height - 2 * radius, 20, 16), material);
      // threeObject = mesh ;
      threeObject = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);

      threeObject.name = "刚体胶囊体";
      // shape = new Ammo.btCapsuleShape(radius, height - 2 * radius);
      shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));

      let _scale = new THREE.Vector3(1, 1, 1);
      // shape = GetTriangleMeshShap(mesh, _scale);


      shape.setMargin(margin);

      let pos = group.position;
      threeObject.position.copy(pos);
      // threeObject.rotation.set(0,group.rotation.y,0);



      const localInertia = new Ammo.btVector3(0, 0, 0);
      shape.calculateLocalInertia(mass, localInertia);
      const transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));


      const motionState = new Ammo.btDefaultMotionState(transform);
      const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
      const body = new Ammo.btRigidBody(rbInfo);
      body.setActivationState(STATE.DISABLE_DEACTIVATION);

      // body.setCollisionFlags(body.getCollisionFlags() | 2);
      //锁定x z轴，只可旋转Y轴，即左右旋转，不倒
      //胶囊体必须要锁定x z 轴旋转，否则会倒
      // body.setAngularFactor(1, 1, 1);

      threeObject.add(new THREE.AxesHelper(5)); // 场景添加坐标轴

      threeObject.userData.physicsBody = body;
      threeObject.userData.tag = "npc";


      scene.add(threeObject);
      threeObject.add(group);
      group.position.set(0, -size.y / 2, 0);
      group.rotation.set(0, 0, 0);
      // group.position.y = 2;


      _YJAmmo.addRigidBody(body);

      rigidbody = body;
      //设置阻尼。第一个参数空气阻力，第二个是滑动阻力。 0-1 之间
      rigidbody.setDamping(0.01, 0.1);
      body.setRollingFriction(1); //滚动摩擦力
      //設置摩擦力,决定在斜坡上是否能滑下来。 值越大，坡越陡才能滑下来
      rigidbody.setFriction(0.91);
      //设置重力缩放。5倍重力，倍数越大，下落越快 
      rigidbody.setGravity(new Ammo.btVector3(0,-9.8, 0));

      //开启刚体模拟。默认为开启
      rigidbody.setActivationState(true);
      moveForce = new Ammo.btVector3(0, 0, 0);

      // threeObject.add(new THREE.AxesHelper(3)); // 添加坐标轴

      //碰撞检测trigger，必须添加此属性
      rigidbody.threeObject = threeObject;

      // console.error(" 初始化NPC刚体 ");


    }

    this.AddForce = function (v3) {
      moveForce.setX(v3.x);
      moveForce.setY(v3.y);
      moveForce.setZ(v3.z);
      rigidbody.setLinearVelocity(moveForce);
    }

    let rotaForce = 600;
    let moveForceValue = 600;
    this.MoveForce = function(e){
       
      const forceVec = new Ammo.btVector3(0, 0, 0.001); // 在z轴方向上施加大小为10的力 // 获取刚体的转换矩阵 
      const transform = new Ammo.btTransform(); 
      transform.setIdentity(); 
      rigidbody.getMotionState().getWorldTransform(transform); // 获取刚体的当前朝向 
      const orientation = transform.getRotation(); // 将力向量旋转以匹配刚体的朝向 
      const rotatedForce = orientation.op_mul(forceVec); // 在刚体的质心位置施加力 
      rigidbody.applyCentralForce(rotatedForce);

      return;

      positionVec.setX(0); 
      positionVec.setY(0); 
      positionVec.setZ(0); 

      // positionVec.setValue(rigidbodyPos.x(), rigidbodyPos.y(), rigidbodyPos.z() ); 

      // forceVec.setX(0);
      // forceVec.setY(0);
      forceVec.setZ(e=="forward"?moveForceValue:-moveForceValue); 
      rigidbody.applyForce(forceVec, positionVec); 

      return;

      moveForce.setX(0);
      moveForce.setY(0);
      // moveForce.setZ(e=="forward"?moveForceValue:-moveForceValue);
      moveForce.setZ(e=="forward"?moveForceValue:-moveForceValue);

      rigidbody.setLinearVelocity(moveForce);

    }
    this.RotaForce = function(e,d){

      // positionVec.setX(e=="left"?0.5:-0.5); 
      positionVec.setX(0); 
      positionVec.setZ(-1); 
      // positionVec.setZ(e=="left"?0.5:0.5); 

      forceVec.setX(e=="left"?-rotaForce:rotaForce); 
      // if(e=="left"){
      //   // console.log("重力 Y = " + ve.y());
      //   positionVec.setZ(1); 
      //   // // 在刚体的指定位置施加力 
      // }
      // if(e=="right"){

      // }


      rigidbody.applyForce(forceVec, positionVec); 

    }

    var updateId = null;
    let rotay = 0.01;
    let rigidbodyPos;
    function update() {
      updateId = requestAnimationFrame(update);

      if (rigidbody) {
        const ms = rigidbody.getMotionState();
        if (ms) {
          ms.getWorldTransform(transformAux1);
          const p = transformAux1.getOrigin();
          rigidbodyPos = p;
          const q = transformAux1.getRotation();




          threeObject.position.set(p.x(), p.y(), p.z());
          threeObject.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
        // console.error(" 移动npc刚体 ");

      }
    }
    Init();
    update();
  }
}

export { YJRigidbody };