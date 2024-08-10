import * as THREE from "three";

import { Pathfinding, PathfindingHelper } from "three-pathfinding";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

//  

class YJPathfindingCtrl {
  constructor(scene, callback) {

    let pathfinding, pathfindingHelper, ZONE;
    let navmesh, groupId, navpath;

    let hasPathfinding = false;
    let posList = [];
    let rotaList = [];
    let scaleList = [];
    let tempV3 = new THREE.Vector3(0, 0, 0);
    let matrix = new THREE.Matrix4();
    function transformToMatrix4(pos, rota, size) {

      const position = new THREE.Vector3(pos.x, pos.y, pos.z);
      const rotation = new THREE.Euler(rota.x, rota.y, rota.z);
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3(size.x, size.y, size.z);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
    }

    let inEditor = false;
    function Init() {
      inEditor = _Global.setting.inEditor;
      // inEditor = true;
      let group = new THREE.Group();
      scene.add(group);

      pathfinding = new Pathfinding();

      if (inEditor) {
        pathfindingHelper = new PathfindingHelper();
        group.add(pathfindingHelper);
      }

      ZONE = 'npcLevel1';
      console.log("初始化寻路。。。",ZONE, pathfinding, inEditor);

      const geometries = [];


      scene.traverse(node => {
        if (
          // !navmesh && 
          node.type == "Mesh"
          && node.name.includes("navMesh")
        ) {
          // console.log(node); 
          if (true) {

            navmesh = node;

            const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
            navmesh.material = wireframeMaterial;

            // const navWireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            //   color: 0x808080,
            //   wireframe: true
            // }));
            // group.add(navWireframe);


            // console.time('createZone()');
            // const zone = Pathfinding.createZone(navmesh.geometry);
            // console.timeEnd('createZone()');
            // pathfinding.setZoneData(ZONE, zone);

            // if (!inEditor) {
            //   navmesh.visible = false;
            // }
            // navmesh.visible = true;
            navmesh.visible = false;

            // 

            let transform = node.parent.parent.parent.parent;
            let position = transform.position;
            let quaternion = transform.quaternion;
            let scale = transform.scale;
            matrix.compose(position, quaternion, scale);
            const instanceGeometry = navmesh.geometry.clone();
            instanceGeometry.applyMatrix4(matrix);

            // if (geometries.length == 0) {
            //   geometries.push(instanceGeometry);
            // }

            // geometries.push(instanceGeometry);
            
            console.time('createZone()');
            const zone = Pathfinding.createZone(instanceGeometry);
            console.timeEnd('createZone()');
            pathfinding.setZoneData(ZONE, zone);
            hasPathfinding = true;
            if (callback) {
              callback();
            }
            return;

          }
          // console.log(" zone = ", pathfinding.zones);
        }
      });

      if (geometries.length == 0) {
        return;
      }

      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
      console.time('createZone()');
      const zone = Pathfinding.createZone(mergedGeometry);
      console.timeEnd('createZone()');
      pathfinding.setZoneData(ZONE, zone);
      for (let i = 1; i < pathfinding.zones.npcLevel1.groups.length; i++) {
        pathfinding.zones.npcLevel1.groups[i].map(ii => {
          pathfinding.zones.npcLevel1.groups[0].push(ii);
        });
      }
      pathfinding.zones.npcLevel1.groups.splice(1, pathfinding.zones.npcLevel1.groups.length - 1);

      hasPathfinding = true;
      if (inEditor) {
        const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
        let mergedMesh = new THREE.Mesh(mergedGeometry, wireframeMaterial)
        scene.add(mergedMesh);
        setTimeout(() => {
          mergedMesh.visible = false;
        }, 5000);
      }

      if (navmesh) {
        if (callback) {
          callback();
        }
      }

    }
    let navMeshList = [];
    this.RemoveNavMeshByMapId = function(mapId){
      
      if (inEditor) { 
        
      }
      for (let i = navMeshList.length-1; i >=0 ; i--) {
        const item = navMeshList[i];
        if(item.mapId == mapId){
          // scene.remove(item.navMesh);
          navMeshList.splice(i,1);
          pathfinding.zones[mapId] = undefined;
          console.log("移除mapid", mapId);
          return;
        }
      }
    }
    this.CreateNavMesh = function (ZONE, mapParent) {
      

      // console.log("创建地图寻路", ZONE, mapParent);
      const geometries = [];
      mapParent.traverse(node => {
        if (
          node.type == "Mesh"
          && node.name.includes("navMesh")
        ) {
          // console.log(node); 
          if (true) {

            let navmesh = node;

            // const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
            // navmesh.material = wireframeMaterial;

            // const navWireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            //   color: 0x808080,
            //   wireframe: true
            // }));
            // group.add(navWireframe);


            // console.time('createZone()');
            // const zone = Pathfinding.createZone(navmesh.geometry);
            // console.timeEnd('createZone()');
            // pathfinding.setZoneData(ZONE, zone);


            navmesh.visible = true;
            // navmesh.visible = false;



            let transform = node.parent.parent.parent.parent;
            let position = (transform.position);
            // console.log("创建地图寻路 transform ", transform);
            // let position = transform.parent.position.clone().add(transform.position);
            let quaternion = transform.quaternion;
            let scale = transform.scale;
            matrix.compose(position, quaternion, scale);
            const instanceGeometry = navmesh.geometry.clone();
            instanceGeometry.applyMatrix4(matrix);

            // geometries.push(instanceGeometry);
            
            console.time('createZone()');
            const zone = Pathfinding.createZone(instanceGeometry);
            console.timeEnd('createZone()');
            pathfinding.setZoneData(ZONE, zone);
            return;
          }
          // console.log(" zone = ", pathfinding.zones);
        }
      });

      if (geometries.length == 0) {
        return;
      }

      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
      console.time('createZone()');
      const zone = Pathfinding.createZone(mergedGeometry);
      console.timeEnd('createZone()');
      pathfinding.setZoneData(ZONE, zone);
      // for (let i = 1; i < pathfinding.zones[ZONE].groups.length; i++) {
      //   pathfinding.zones[ZONE].groups[i].map(ii => {
      //     pathfinding.zones[ZONE].groups[0].push(ii);
      //   });
      // }
      // pathfinding.zones[ZONE].groups.splice(1, pathfinding.zones[ZONE].groups.length - 1);

      hasPathfinding = true;
      if (inEditor) {
        const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
        let mergedGeometryMehs = new THREE.Mesh(mergedGeometry, wireframeMaterial);
        mapParent.add(mergedGeometryMehs);
        navMeshList.push({mapId:ZONE,navMesh:mergedGeometryMehs});
      }
      console.log(" zone = ", pathfinding.zones);

    }


    let getTimes = 0;
    this.GetNavpath = function (ZONE, fromPos, targetPos) {
      let navpath = [];
      let tempV3 = new THREE.Vector3(0, 0, 0);
      if (!hasPathfinding ) {
        tempV3.set(targetPos.x, targetPos.y, targetPos.z);
        navpath = [tempV3];
        return navpath;
      }
      // fromPos.y = 0; 
      // targetPos.y = fromPos.y;
      // console.log(" 查找寻路路径 ", ZONE, fromPos, targetPos);
      let groupId = pathfinding.getGroup(ZONE, fromPos, true);
      // console.log("groupId " + groupId);
      try {
        const closest = pathfinding.getClosestNode(fromPos, ZONE, groupId); //返回离目标位置最近的节点
        // console.log("closest ", closest);
        navpath = pathfinding.findPath(closest.centroid, targetPos, ZONE, groupId);
      } catch (error) {
        // console.log('寻路错误：',ZONE,error);
        tempV3.set(targetPos.x, targetPos.y, targetPos.z);
        navpath = [tempV3];
        // console.error(" 无法寻路 直接移动到目标点 000 ");
        
      }
      if (navpath == null ) {
        
        tempV3.set(targetPos.x, targetPos.y, targetPos.z);
        navpath = [tempV3];
        // console.error(" 无法寻路 直接移动到目标点");
        
        // if(getTimes==1){
        //   getTimes = 0;
        //   tempV3.set(targetPos.x, targetPos.y, targetPos.z);
        //   navpath = [tempV3];
        //   console.error(" 无法寻路 直接移动到目标点");
        //   return navpath;
        // }else{
        //   // return this.GetNavpath(ZONE, fromPos, targetPos);
        // }
      }
      
      if (navpath) {
        if (inEditor) {
          pathfindingHelper.reset();
          pathfindingHelper.setPlayerPosition(fromPos);
          pathfindingHelper.setTargetPosition(targetPos);
          pathfindingHelper.setPath(navpath);
        }

      } else {

        // const closestPlayerNode = pathfinding.getClosestNode(fromPos, ZONE, groupId);
        // // console.log("closestPlayerNode ", closestPlayerNode);
        // const clamped = new THREE.Vector3();
        // pathfinding.clampStep(fromPos, targetPos.clone(), closestPlayerNode, ZONE, groupId, clamped);
        // pathfindingHelper.setStepPosition(clamped);

      }
      getTimes = 0;
      return navpath;

    }
    //#region 
    //#endregion

    Init();
  }
}


export { YJPathfindingCtrl };