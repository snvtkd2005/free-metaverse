import * as THREE from "three";
 
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';



import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


// 反射效果

class YJReflectMirror {
	constructor(_this, scene, camera, renderer, mirrormesh) {


		let geometry, material, mesh;
		let composer;
		let ssrPass;
		let gui;
		let stats;
		const otherMeshes = [];
		let groundReflector;
		const selects = [];


		function Init() {
			let size = 5.7;
			geometry = new THREE.PlaneGeometry(size, size);
			const mirror = new Reflector(geometry, {
				clipBias: 0.03,
				textureWidth: window.innerWidth * window.devicePixelRatio,
				textureHeight: window.innerHeight * window.devicePixelRatio,
				color: 0x889999,
			});
			scene.add(mirror);
			let pos = mirrormesh.getWorldPosition(new THREE.Vector3());
			pos.add(new THREE.Vector3(0, 0.1, 0));
			console.log(pos.clone());
			mirror.position.copy(pos);
			mirror.rotation.x = - Math.PI / 2;

			console.log("mirror.material " ,mirror.material);
			// mirror.material.uniforms.tDiffuse.value = mirrormesh.material.normalMap;
			// mirror.material = mirrormesh.material;
		}
		function onWindowResize() {
			composer.setSize(window.innerWidth, window.innerHeight);
			groundReflector.getRenderTarget().setSize(window.innerWidth, window.innerHeight);
			groundReflector.resolution.set(window.innerWidth, window.innerHeight);
		}
		function render() {
			requestAnimationFrame(render);
			composer.render();
		}
		//#region 
		//#endregion

		Init();
		var updateId = null;
		this._update = function () {
			render();
		}
	}
}


export { YJReflectMirror };