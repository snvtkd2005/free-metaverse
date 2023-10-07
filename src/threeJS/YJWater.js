import * as THREE from "three";

import { Water } from 'three/examples/jsm/objects/Water.js';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


// 反射效果

class YJWater {
	constructor(_this, scene,mesh,planeSize,waveSize,offset ) {


		let gui;


		function Init() {
			AddWater();
		}


		let water;
		function AddWater() {

			// Water
			// let size = 5.7;

			const waterGeometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y);
			if (mesh) {
				// waterGeometry = mesh.geometry;
			}
			water = new Water(
				waterGeometry,
				{
					textureWidth: 512,
					textureHeight: 512,
					waterNormals: new THREE.TextureLoader().load(_this.GetPublicUrl() + 'waternormals.jpg', function (texture) {
						texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
					}),
					sunDirection: new THREE.Vector3(),
					sunColor: 0xffffff,
					waterColor: 0x007296,
					//失真比例.值越大投影偏移越大越扭曲
					distortionScale: 1,
					fog: scene.fog !== undefined
				}
			);

			water.rotation.x = - Math.PI / 2;


			scene.add(water);

			let pos = mesh.getWorldPosition(new THREE.Vector3());
			if(offset){
				pos.add(new THREE.Vector3(offset.x,offset.y,offset.z));
			}
			water.position.copy(pos);
			water.material.uniforms['size'].value = waveSize;
			// water.material.uniforms['time'].value += 1.0 / 60.0;


			// render();
		}

		function render() {
			requestAnimationFrame(render);
			water.material.uniforms['time'].value += 1.0 / 100.0;
		}

		Init();
	}
}


export { YJWater };