import * as THREE from "three";

import { Pathfinding, PathfindingHelper } from "three-pathfinding";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

//  

class YJPathfindingCtrl {
  constructor(scene, callback) {

    let pathfinding, pathfindingHelper, ZONE;
    let navmesh, groupId, navpath;

    let count = 1;
    let posList = [];
    let rotaList = [];
    let scaleList = [];

    let matrix = new THREE.Matrix4();
    function transformToMatrix4(pos, rota, size) {

      const position = new THREE.Vector3(pos.x, pos.y, pos.z);
      const rotation = new THREE.Euler(rota.x, rota.y, rota.z);
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3(size.x, size.y, size.z);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
    }

    function Init() {

      let group = new THREE.Group();
      scene.add(group);

      pathfinding = new Pathfinding();
      console.log("初始化寻路。。。",pathfinding);

      pathfindingHelper = new PathfindingHelper();
      group.add(pathfindingHelper);

      ZONE = 'npcLevel1';

      const geometries = [];

      const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });

      scene.traverse(node => {
        if (
          // !navmesh && 
          node.type == "Mesh"
          && node.name.includes("navMesh") 
        ) {
          console.log(node);
          // node.position.add(new THREE.Vector3(0, 1, 0));
          // node.visible = true;
          if (true) {

            navmesh = node;

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


            // navmesh.visible = true; 
 
            let transform = node.parent.parent.parent.parent;
            console.log(" transform.name ",transform.name);
            let position = transform.position;
            let quaternion = transform.quaternion;
            let scale = transform.scale;
            matrix.compose(position, quaternion, scale);
            const instanceGeometry = navmesh.geometry.clone();
            instanceGeometry.applyMatrix4(matrix);
            geometries.push(instanceGeometry);


          }
          // console.log(" zone = ", pathfinding.zones);
        }
      });


      
      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);

      console.time('createZone()');
      const zone = Pathfinding.createZone(mergedGeometry);
      console.timeEnd('createZone()');
      pathfinding.setZoneData(ZONE, zone);
      for (let i = 1; i < pathfinding.zones.npcLevel1.groups.length; i++) {
        pathfinding.zones.npcLevel1.groups[i].map(ii=>{
          pathfinding.zones.npcLevel1.groups[0].push(ii);
        });
      }
      
      pathfinding.zones.npcLevel1.groups.splice(1,pathfinding.zones.npcLevel1.groups.length-1);

      scene.add(new THREE.Mesh(mergedGeometry, wireframeMaterial));

      if(navmesh){
        if (callback) {
          callback();
        }
      }

    }

    let getTimes = 0;
    this.GetNavpath = function (fromPos, targetPos) {
      // fromPos.y = 0; 
      // targetPos.y = fromPos.y;
      // console.log(" 查找寻路路径 ",fromPos,targetPos);
      groupId = pathfinding.getGroup(ZONE, fromPos, true);
      // console.log("groupId " + groupId);
      const closest = pathfinding.getClosestNode(fromPos, ZONE, groupId);
      // console.log("closest ", closest);
      navpath = pathfinding.findPath(closest.centroid, targetPos, ZONE, groupId);
      getTimes++;
      if (navpath == null && getTimes < 3) {
        // targetPos.x += 0.5;
        return this.GetNavpath(fromPos, targetPos);
      }
      if (navpath) {
        pathfindingHelper.reset();
        pathfindingHelper.setPlayerPosition(fromPos);
        pathfindingHelper.setTargetPosition(targetPos);
        pathfindingHelper.setPath(navpath);

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