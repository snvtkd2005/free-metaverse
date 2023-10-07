

import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
 

// 路径变形动画

class YJCurse {
	constructor(_this, scene, camera, renderer, mirrormesh) {

		const ACTION_SELECT = 1, ACTION_NONE = 0;
		const curveHandles = [];
		const mouse = new THREE.Vector2();

		let stats;
		let  rayCaster,
			control,
			flow,
			action = ACTION_NONE;

		function Init() {
			const initialPoints = [
				{ x: 1, y: 1, z: - 1 },
				{ x: 1, y: 1, z: 1 },
				{ x: - 1, y: 1, z: 1 },
				{ x: - 1, y: 1, z: - 1 },
			];

			const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
			const boxMaterial = new THREE.MeshBasicMaterial();

			for (const handlePos of initialPoints) {

				const handle = new THREE.Mesh(boxGeometry, boxMaterial);
				handle.position.copy(handlePos);
				curveHandles.push(handle);
				scene.add(handle);

			}

			const curve = new THREE.CatmullRomCurve3(
				curveHandles.map((handle) => handle.position)
			);
			curve.curveType = 'centripetal';
			// curve.curveType = 'chordal';
			// curve.curveType = 'catmullrom';
			curve.closed = true;
			// curve.closed = false;

			const points = curve.getPoints(50);
			const line = new THREE.LineLoop(
				new THREE.BufferGeometry().setFromPoints(points),
				new THREE.LineBasicMaterial({ color: 0x00ff00 })
			);

			scene.add(line);

			
			let cubeGeometry = new THREE.BoxGeometry(0.2,0.2,0.01); 
			let cubeMaterial = new THREE.MeshStandardMaterial({
			  color: 0x808080,
			  roughness: 0.1,
			  metalness: 0,
			}); 
			cubeGeometry.rotateX( Math.PI/2 );

			const objectToCurve = new THREE.Mesh(cubeGeometry, cubeMaterial);

			flow = new Flow(objectToCurve);
			flow.updateCurve(0, curve);
			scene.add(flow.object3D);


			window.addEventListener('pointerdown', onPointerDown);

			rayCaster = new THREE.Raycaster();
			control = new TransformControls(camera, renderer.domElement);
			control.addEventListener('dragging-changed', function (event) {

				if (!event.value) {

					const points = curve.getPoints(50);
					line.geometry.setFromPoints(points);
					flow.updateCurve(0, curve);

				}

			});

			render();
		}

		function onPointerDown(event) {

			action = ACTION_SELECT;
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

		}
		function render() {
			requestAnimationFrame(render);

			if (action === ACTION_SELECT) {

				rayCaster.setFromCamera(mouse, camera);
				action = ACTION_NONE;
				const intersects = rayCaster.intersectObjects(curveHandles, false);
				if (intersects.length) {

					const target = intersects[0].object;
					control.attach(target);
					scene.add(control);

				}

			}

			if (flow) {
				flow.moveAlongCurve(0.001);
			}

			// console.log("flow ",flow);
		}
		//#region 
		//#endregion

		Init(); 
	}
}


export { YJCurse };