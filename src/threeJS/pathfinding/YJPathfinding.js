import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { Pathfinding, PathfindingHelper } from "three-pathfinding";


//  

class YJPathfinding {
  constructor(_YJSceneManager, scene, path, camera) {

    let pathfinding, pathfindingHelper, ZONE;
    let navmesh, groupId, navpath;

		const clock = new THREE.Clock();
		const SPEED = 5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let playerPosition = new THREE.Vector3(0, 0, 0);
    let group = new THREE.Group();
    let hasHelper = true;
    
    function Init() {
      scene.add(group);
      // group.rotation.set(0,Math.PI,0);

      // let dire2 = group.getWorldDirection(new THREE.Vector3());
      // console.log(" scene 旋转 = 》", dire2);

      pathfinding = new Pathfinding();
      if(hasHelper){
        pathfindingHelper = new PathfindingHelper();
        group.add(pathfindingHelper);
      }
      ZONE = 'level1';
      console.log("初始化 寻路 navmesh 效果", path);
      const loader = new GLTFLoader();
      // XUNLU navmesh
      loader.load(path + "models/Scene/navmesh.gltf", function (gltf) {
        let model = gltf.scene;
        let dire = model.getWorldDirection(new THREE.Vector3());
        console.log(" navmesh 旋转 = 》", dire);
        group.add(model);

        gltf.scene.traverse(node => {
          if (!navmesh && node.isObject3D && node.children && node.children.length > 0) {
            console.log(node);
            navmesh = node.children[0].children[0].children[0];
            // navmesh = node.children[0].children[0];
            // navmesh = node.children[0];

            const wireframeMaterial = new THREE.MeshBasicMaterial({ alphaTest:true,opacity:0, color: 0x000000, wireframe: true, transparent: true });
            // const wireframeMaterial = new THREE.MeshBasicMaterial({ alphaTest:true, color: 0x000000, wireframe: true, transparent: true });
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

            // console.log(" zone = ", pathfinding.zones);
          }
        });

      });
      animate();

      window.addEventListener('pointerup', onPointerDown);

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
        if (navpath && hasHelper) {
          pathfindingHelper.reset();
          pathfindingHelper.setPlayerPosition(playerPosition);
          pathfindingHelper.setTargetPosition(target);
          pathfindingHelper.setPath(navpath);

        } else {

 

        }
      }

    }

    function animate() {

			requestAnimationFrame( animate );
			tick(clock.getDelta());
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

        if(hasHelper){
				  pathfindingHelper.setPlayerPosition( playerPosition );
        }

        let pos = playerPosition.clone();
        pos.y +=  _YJSceneManager.GetPlayerHeight();
        // console.log("设置自动寻路坐标 " ,pos );
        _YJSceneManager.SetOnlyPlayerPos(pos);

			} else {
				// Remove node from the path we calculated
				navpath.shift();
        doonce = 0;
        // console.log(navpath.length); 
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


export { YJPathfinding };