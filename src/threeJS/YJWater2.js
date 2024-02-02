
import * as THREE from "three";
import { Water } from 'three/examples/jsm/objects/Water2.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 反射效果
class YJWater2 {
	constructor(_this, scene,mesh,
		planeSize,
		waveSize,
		offset,
		distortionScale ) {
		let gui;
		function Init() {
			AddWater();
		}
		let water;
		function AddWater() {
			// Water
			// let size = 5.7;
			let waterGeometry = null;
			if (mesh) {

				// waterGeometry = mesh.geometry;
				waterGeometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y);
			}else{
				waterGeometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y);
			}
			water = new Water(
				waterGeometry,
				{
					textureWidth: 512,
					textureHeight: 512,
					color: 0xffffff,
					scale:1,
					flowDirection: new THREE.Vector2( 1, 1 ),
				}
			);

			water.rotation.x = - Math.PI / 2;
			_Global.YJ3D.scene.add(water);
			// scene.add(water);

			let pos = mesh.getWorldPosition(new THREE.Vector3());
			if(offset){
				pos.add(new THREE.Vector3(offset.x,offset.y,offset.z));
			}
			water.position.copy(pos);
			// water.rotation.z = scene.rotation.y;

			// water.material.uniforms['size'].value = waveSize;
			// water.material.uniforms['time'].value += 1.0 / 60.0;
			console.log(water.material.uniforms);
			// render();
		}

		function render() {
			requestAnimationFrame(render);
			water.material.uniforms['time'].value += 1.0 / 1000.0;
		}

		Init();
	}
}


export { YJWater2 };