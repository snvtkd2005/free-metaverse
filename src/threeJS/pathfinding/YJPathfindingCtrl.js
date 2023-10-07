import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { Pathfinding, PathfindingHelper } from "three-pathfinding";


//  

class YJPathfindingCtrl {
  constructor( scene, path, callback) {

    let pathfinding, pathfindingHelper, ZONE;
    let navmesh, groupId, navpath;

		const clock = new THREE.Clock();
		const SPEED = 3;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let playerPosition = new THREE.Vector3(0, 0, 0);
    let group = new THREE.Group();

    function Init() {
      scene.add(group); 

      pathfinding = new Pathfinding();

      // pathfindingHelper = new PathfindingHelper();
      // group.add(pathfindingHelper);

      ZONE = 'npcLevel1'; 
      const loader = new GLTFLoader();
      // XUNLU navmesh
      loader.load(path + "models/Scene/navmesh.gltf", function (gltf) {
        let model = gltf.scene; 
        group.add(model);

        gltf.scene.traverse(node => {
          if (!navmesh && node.isObject3D && node.children && node.children.length > 0) {
            // console.log(node);
            navmesh = node.children[0].children[0].children[0];
            // navmesh = node.children[0].children[0];
            // navmesh = node.children[0];

            const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true });
            navmesh.material = wireframeMaterial;

            // const navWireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            //   color: 0x808080,
            //   wireframe: true
            // }));
            // group.add(navWireframe);


            console.time('createZone()'); 
            const zone = Pathfinding.createZone(navmesh.geometry);
            console.timeEnd('createZone()');
            pathfinding.setZoneData(ZONE, zone);

            if(callback){
              callback();
            }

            navmesh.visible = false;
            // console.log(" zone = ", pathfinding.zones);
          }
        });

      });

      // animate();

      // window.addEventListener('pointerdown', onPointerDown);

    }

    function onPointerDown(event) {
      // return;
      playerPosition = _YJSceneManager.GetPlayerPos();
      playerPosition.y -=  _YJSceneManager.GetPlayerHeight();

      // console.log(" player pos = >", pos);

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const found = raycaster.intersectObjects(group.children,true);
      // console.log(found);
      if (found.length > 0) {

        let target = found[0].point;
        groupId = pathfinding.getGroup(ZONE, playerPosition,true);
        // console.log("groupId " + groupId);
        const closest = pathfinding.getClosestNode(playerPosition, ZONE, groupId);
        // console.log("closest ", closest);
        navpath = pathfinding.findPath(closest.centroid, target, ZONE, groupId);

        // console.log("navpath ", navpath);
        if (navpath) {
          pathfindingHelper.reset();
          pathfindingHelper.setPlayerPosition(playerPosition);
          pathfindingHelper.setTargetPosition(target);
          pathfindingHelper.setPath(navpath);

        } else {

          // const closestPlayerNode = pathfinding.getClosestNode(pos, ZONE, groupId);
          // console.log("closestPlayerNode ", closestPlayerNode);
          // const clamped = new THREE.Vector3();

          // pathfinding.clampStep(pos, target.clone(), closestPlayerNode, ZONE, groupId, clamped);
          // pathfindingHelper.setStepPosition(clamped);

        }
      }

    }
    let getTimes = 0;
    this.GetNavpath = function(fromPos,targetPos){
      groupId = pathfinding.getGroup(ZONE, fromPos,true);
      // console.log("groupId " + groupId);
      const closest = pathfinding.getClosestNode(fromPos, ZONE, groupId);
      // console.log("closest ", closest);
      navpath = pathfinding.findPath(closest.centroid, targetPos, ZONE, groupId);
      getTimes++;
      if(navpath==null && getTimes<3){
        targetPos.x+=0.5;
        return  this.GetNavpath(fromPos,targetPos);
      }
      if (navpath) {
        // pathfindingHelper.reset();
        // pathfindingHelper.setPlayerPosition(fromPos);
        // pathfindingHelper.setTargetPosition(targetPos);
        // pathfindingHelper.setPath(navpath);

      } else {

        // const closestPlayerNode = pathfinding.getClosestNode(pos, ZONE, groupId);
        // console.log("closestPlayerNode ", closestPlayerNode);
        // const clamped = new THREE.Vector3();

        // pathfinding.clampStep(pos, target.clone(), closestPlayerNode, ZONE, groupId, clamped);
        // pathfindingHelper.setStepPosition(clamped);

      }
      getTimes=0;
      return navpath;
      
    }


    function animate() {

			requestAnimationFrame( animate );
			// tick(clock.getDelta());
    }
    
    let doonce = 0;
		function tick ( dt ) {
			if ( !(navpath||[]).length ) return

			let targetPosition = navpath[0];
			const velocity = targetPosition.clone().sub( playerPosition );

      if(doonce<1){
        //角色朝向目标点
        _YJSceneManager.SetLocalPlayerLookatPos(targetPosition.clone()); 
        doonce++;
      }

			if (velocity.lengthSq() > 0.05 * 0.05) {
				velocity.normalize();
				// Move player to target
				playerPosition.add( velocity.multiplyScalar( dt * SPEED ) );

				pathfindingHelper.setPlayerPosition( playerPosition );

        let pos = playerPosition.clone();
        pos.y +=  _YJSceneManager.GetPlayerHeight();
        // console.log("设置自动寻路坐标 " ,pos );
        _YJSceneManager.SetOnlyPlayerPos(pos);

			} else {
				// Remove node from the path we calculated
				navpath.shift();
        doonce = 0;
        console.log(navpath.length); 
        if(navpath.length==0){
          
          // let pos = playerPosition.clone();
          // pos.y +=  _YJSceneManager.GetPlayerHeight();
          // _YJSceneManager.SetPlayerPos(pos); 
        }

			}
		}

    //#region 
    //#endregion

    Init();
    var updateId = null;
    this._update = function () {
      animate();
    }
  }
}


export { YJPathfindingCtrl };