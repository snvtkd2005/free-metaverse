import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// 九宫格地图

class YJMapManager {
  constructor(_this, scene, player, _SceneManager) {

    var model = null;
    let mapGroup = null;
    function Init() {
      console.log(" 创建地图 ", player);
      mapGroup = new THREE.Group();
      scene.add(mapGroup);
      mapGroup.position.set(-0 / 2, 0.1, 0 / 2);
      // mapGroup.position.set(-mapSize / 2, 0.01, mapSize / 2);
      // update();
      return;
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 5, 5),
        new THREE.MeshStandardMaterial({
          color: 0xff0000,
        })
      );
      mesh.position.y = 0.1;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      mesh.name = "10000-10000-10000";
      scene.add(mesh);
      return;
      // console.log("加载门模型");
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/js/draco/gltf/');

      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {

        model = gltf.scene;

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.castShadow = true;
            item.receiveShadow = true;
          }
        });


        model.position.set(pos.x, pos.y, pos.z); // 
        model.rotation.set(rota.x, rota.y, rota.z); // 
        model.scale.set(size, size, size);


        model.tag = name;
        model.name = id;
        scene.add(model);

        // _this.triggerList.push(model)

        // console.log(model.animations);
        // console.log(gltf.animations);

        // mixer = new THREE.AnimationMixer( model );
        // mixer.clipAction( gltf.animations[ 0 ] ).play();

        mixer = new THREE.AnimationMixer(model);
        openAction = mixer.clipAction(gltf.animations[0]);
        openAction.loop = THREE.LoopOnce; //不循环播放
        openAction.timeScale = 0.5; //默认1，可以调节播放速度
        openAction.clampWhenFinished = true;//暂停在最后一帧播放的状态

        closeAction = mixer.clipAction(gltf.animations[1]);
        closeAction.loop = THREE.LoopOnce; //不循环播放
        closeAction.timeScale = 0.5; //默认1，可以调节播放速度
        closeAction.clampWhenFinished = true;//暂停在最后一帧播放的状态


        // setWeight(openAction,1, 1);

        openAction.setEffectiveWeight(0);
        closeAction.setEffectiveWeight(0);

        openAction.play();
        closeAction.play();
        // openAction.paused = false;
        // closeAction.paused = false;


        doorCollider = LoopFindChild("doorCollider", model);



        if (createCollider) {
          //创建collider 
          CreateCollider();

          if (_state != undefined) {
            _SetState(_state);
          }
        }


        //动画播放完后，刷新一遍 collider

        update();

      }, undefined, function (e) {

        console.error(e);

      });

    }
    let oldCenterMapId = "10000-10000-";
    function CreatePlane(x, y, z, id) {
      //原点坐标所在的地图id为 10000-10000-10000  分别表示x-y-z轴id
      //则九宫格为
      // 10001-10000-9999     10000-10000-9999     9999-10000-9999
      // 10001-10000-10000    10000-10000-10000    9999-10000-10000
      // 10001-10000-10001    10000-10000-10001    9999-10000-10001
      //一宫格面积为10*10，原点坐标为0,0,0
      //即可通过玩家位置，计算出所在地图的id，进而计算出九宫格地图id
      //地图上的模型，如房屋、npc等，记录在地图id中，即可通过地图id获取需要加载的动态模型

      const c = Math.floor(Math.random() * (1 << 24));

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(mapSize, mapSize, 5, 5),
        new THREE.MeshStandardMaterial({
          color: c,
          // color: 0x00a000,
          transparent: true,
          opacity: 0.5,
        })
      );
      mesh.position.set(x, y + 0.1, z);
      // console.log("创建平面坐标为 ",x,y,z);
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      mesh.name = id;
      mapGroup.add(mesh);


      mapData.push({ id: id, x: x, y: y, z: z, model: mesh });
    }
    let mapOffsetArray = [
      //x轴横着的两个
      { x: -1, z: 0 },
      { x: 1, z: 0 },

      //前面的横着的三个
      { x: -1, z: -1 },
      { x: 1, z: -1 },
      { x: 0, z: -1 },

      //后面的横着的三个
      { x: -1, z: 1 },
      { x: 1, z: 1 },
      { x: 0, z: 1 },
    ];
    let mapData = [];
    let newMapData = [];
    // let mapSize = 40;
    let mapSize = _Global.MetaworldSize;
    let oldX = -10;
    let oldZ = -10;
    let halfSize = mapSize/2;
    
    var oldPos = new THREE.Vector3();
    function UpdateSceneByPlayerPos(pos) {
      if(oldPos.distanceTo(pos) < 0.01){
        return;
      }
      oldPos = pos.clone();
      _this._YJSceneManager.UpdatePlayerPos(oldPos);

      // console.log("地图管理 = 角色坐标 ",pos);

      let x, y, z;
      // x = Math.ceil(pos.x/mapSize/2 ) ;
      // z= Math.ceil(pos.z/mapSize/2 ) ;
      if (pos.x < 0) {
        x = Math.ceil(pos.x / halfSize);
        // console.log("x = " ,pos.x,x);

      } else {
        x = Math.floor(pos.x / halfSize);
      }
      if (pos.z < 0) {
        z = Math.ceil(pos.z / halfSize);
        // console.log("z = " ,pos.z,z);
      } else {
        z = Math.floor(pos.z / halfSize);
      }
      // console.log(pos.x,x,oldX);
      // console.log(pos.z,z,oldZ);
      if (x == oldX && z == oldZ) {
        return;
      } else {
        oldX = x;
        oldZ = z;
      }
      //生成当前位置的九宫格地图
      if (pos.x < 0) {
        pos.x -= halfSize;
        x = Math.ceil(pos.x / mapSize) + 10000;
      } else {
        pos.x += halfSize;
        x = Math.floor(pos.x / mapSize) + 10000;
      }

      // let y = Math.floor(pos.y/mapSize)+10000 ;
      y = 10000;
      // let z = Math.ceil(pos.z / mapSize) + 10000;
      if (pos.z < 0) {
        pos.z -= halfSize;
        z = Math.ceil(pos.z / mapSize) + 10000;
      } else {
        pos.z += halfSize;
        z = Math.floor(pos.z / mapSize) + 10000;
      }
      let newMapId = x + "-" + y + "-" + z;
      // oldCenterMapId = newMapId;

      if (newMapId != oldCenterMapId) {
        oldCenterMapId = newMapId;
      } else {
        return;
      }
      // console.log("角色中心所在地图 ", newMapId);
      _this._YJSceneManager.SetCenterPlaneId(newMapId);

      let x1 = (x - 10000);
      let z1 = (z - 10000);


      // // 旧
      // //生成当前位置的九宫格地图
      // let x = Math.ceil(pos.x / mapSize) + 10000;
      // // let y = Math.floor(pos.y/mapSize)+10000 ;
      // let y = 10000;
      // let z = Math.ceil(pos.z / mapSize) + 10000;
      // let newMapId = x + "-" + y + "-" + z;
      // if (newMapId != oldCenterMapId) {
      //   oldCenterMapId = newMapId;
      // } else {
      //   return;
      // }
      // // console.log(x + " " + y + " " + z + " ");

      // let x1 = (x - 10000) ;
      // let z1 = (z - 10000 - 1);



      newMapData = [];
      newMapData.push({ id: oldCenterMapId, x: x1 * mapSize, y: 0, z: z1 * mapSize });

      for (let i = 0; i < mapOffsetArray.length; i++) {
        let item = mapOffsetArray[i];
        const xx = x1 + item.x;
        const zz = z1 + item.z;
        const xid = x + item.x;
        const zid = z + item.z;
        newMapData.push({ id: (xid + "-" + y + "-" + zid), x: xx * mapSize, y: 0, z: zz * mapSize });
      }

      // console.log(mapData);
      // console.log(newMapData);

      // for (let i = mapData.length-1; i >=0; i--) {
      //   const newItem = mapData[i];
      //   mapGroup.remove(newItem.model);
      //   mapData.splice(i,1);
      // }
      // for (let i = 0; i < newMapData.length; i++) {
      //   const newItem = newMapData[i];
      //   CreatePlane(newItem.x,newItem.y,newItem.z,newItem.id);
      // }
      // return;

      let out = [];
      //提取移除的
      for (let i = 0; i < mapData.length; i++) {
        const newItem = mapData[i];
        let hasOut = false;
        for (let ii = 0; ii < newMapData.length; ii++) {
          const oldItem = newMapData[ii];
          if (newItem.id == oldItem.id) {
            hasOut = true;
          }
        }
        if (!hasOut) {
          //移除的
          out.push(newItem);
        }
      }
      // console.log("  mapData.length 11 = " + mapData.length);
      // console.log("  out.length = " + out.length);
      for (let i = mapData.length - 1; i >= 0; i--) {
        const newItem = mapData[i];
        for (let ii = out.length - 1; ii >= 0; ii--) {
          const oldItem = out[ii];
          if (newItem.id == oldItem.id) {

            // console.log("移除九宫格",oldItem.id);
            // mapGroup.remove(oldItem.model);

            _this._YJSceneManager.RemoveAmmoPlane(oldItem.id);
            _SceneManager.RemoveAmmoPlane(oldItem.id);
            out.splice(ii, 1);
            mapData.splice(i, 1);
            continue;
          }
        }
      }


      //提取增加的
      let addArray = [];
      for (let i = 0; i < newMapData.length; i++) {
        const newItem = newMapData[i];
        let hasIn = false;
        for (let ii = 0; ii < mapData.length; ii++) {
          const oldItem = mapData[ii];
          if (newItem.id == oldItem.id) {
            hasIn = true;
          }
        }
        if (!hasIn) {
          //增加的 
          // console.log("增加",newItem.id);
          addArray.push(newItem);
        }
      }
      for (let ii = 0; ii < addArray.length; ii++) {
        const newItem = addArray[ii];
        // CreatePlane(newItem.x, newItem.y, newItem.z, newItem.id);
        mapData.push(newItem);
        _this._YJSceneManager.AddAmmoPlane(newItem.id);
        _SceneManager.AddAmmoPlane(newItem.id);
      }

      _this._YJSceneManager.GetPlayerInMap(mapData);

      // console.log("  mapData.length 22 = " + mapData.length);

      newMapData = [];



    }
    function getWorldPosition(object) {
      var worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      return worldPosition;
    }
    Init();


    this._update = function() {
      if (player != null) {
        UpdateSceneByPlayerPos(getWorldPosition(player));
      }
      // requestAnimationFrame(update);

    }
  }
}

export { YJMapManager };