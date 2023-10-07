import * as THREE from "three";


import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';



import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


// 反射效果

class YJReflect {
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
			_this.enableRenderer = false;


			console.log("初始化 反射效果");
			let size = 5.7;
			geometry = new THREE.PlaneGeometry(size, size);
			// geometry = new THREE.BoxGeometry(6, 6,1);
			// if (mirrormesh) {
			// 	geometry = mirrormesh.geometry;
			// }
			groundReflector = new ReflectorForSSRPass(geometry, {
				clipBias: 0.0003,
				textureWidth: window.innerWidth,
				textureHeight: window.innerHeight,
				color: 0x888888,
				useDepthTexture: true,
			});
			groundReflector.material.depthWrite = false;
			groundReflector.rotation.x = - Math.PI / 2;
			groundReflector.visible = true;
			groundReflector.position.set(0, 1, 0);

			// if (mirrormesh) {
			// 	let pos = mirrormesh.getWorldPosition(new THREE.Vector3());
			// 	pos.add(new THREE.Vector3(0, 1, 0));
			// 	// pos.add(new THREE.Vector3(0, 0.1, 0));
			// 	console.log(pos.clone());
			// 	groundReflector.position.copy(pos);
			// 	// groundReflector.rotation.set(0,0,0);
			// 	// groundReflector.scale.set(3,3,3);
			// }


			scene.add(groundReflector);

			// composer

			composer = new EffectComposer(renderer);
			ssrPass = new SSRPass({
				renderer,
				scene,
				camera,
				width: innerWidth,
				height: innerHeight, 
				groundReflector: groundReflector,
				selects: groundReflector
			});

			composer.addPass(ssrPass);
			composer.addPass(new ShaderPass(GammaCorrectionShader));

			ssrPass.thickness = 0.0;
			ssrPass.infiniteThick = false;

			// ssrPass.maxDistance = 5;
			ssrPass.maxDistance = 1;
			groundReflector.maxDistance = ssrPass.maxDistance;

			// ssrPass.output =  SSRPass.OUTPUT.Default; //0
			// ssrPass.output =  SSRPass.OUTPUT.Beauty; //3
			// ssrPass.output = 0; //
			ssrPass.output = 3; //
			// ssrPass.output = parseInt( value );


			ssrPass.opacity = 1;
			groundReflector.opacity = ssrPass.opacity;

			ssrPass.fresnel = true;
			groundReflector.fresnel = ssrPass.fresnel;

			ssrPass.distanceAttenuation = true;
			groundReflector.distanceAttenuation = ssrPass.distanceAttenuation;
			render();

			window.addEventListener('resize', onWindowResize);

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


export { YJReflect };