

import * as POSTPROCESSING from "postprocessing"
import { defaultSSROptions, SSREffect } from "screen-space-reflections"
import * as THREE from "three"

import { useBoxProjectedEnvMap } from "./postprocessing/addons/BoxProjectedEnvMapHelper"
import { enhanceShaderLighting } from "./postprocessing/addons/EnhanceShaderLighting"
import { SSRDebugGUI } from "./postprocessing/SSRDebugGUI.js";
import "./postprocessing/style.css"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


// 反射效果

class YJReflectPostprocessing {
	constructor(_this, scene, camera, renderer, mirrormesh) {


		let ssrEffect
		let gui
		let box

const gltflLoader = new GLTFLoader()

		// Renderer
		// const renderer = new THREE.WebGLRenderer({
		// 	canvas: rendererCanvas,
		// 	powerPreference: "high-performance",
		// 	premultipliedAlpha: false,
		// 	depth: false,
		// 	stencil: false,
		// 	antialias: false,
		// 	preserveDrawingBuffer: true
		// })

		let composer, renderPass;



		const params = {
			...defaultSSROptions,
			...{
				enabled: true,
				resolutionScale: 1,
				velocityResolutionScale: 1,
				correctionRadius: 2,
				blend: 0.95,
				correction: 0.1,
				blur: 0,
				blurSharpness: 10,
				blurKernel: 1,
				distance: 10,
				intensity: 1,
				exponent: 1.75,
				maxRoughness: 0.99,
				jitter: 0,
				jitterRoughness: 2,
				roughnessFade: 1,
				fade: 1.03,
				thickness: 3.5,
				ior: 1.75,
				fade: 0,
				steps: 5,
				refineSteps: 6,
				maxDepthDifference: 50,
				missedRays: false
			}
		}

		const defaultParams = { ...params }

		let emitterMesh


		const settings = {
			envMapPosX: 0,
			envMapPosY: 1,
			envMapPosZ: 0,
			envMapSizeX: 12,
			envMapSizeY: 3.90714,
			envMapSizeZ: 8.5,
			aoPower: 2,
			aoSmoothing: 0.43,
			aoMapGamma: 0.74,
			lightMapGamma: 1.21,
			lightMapSaturation: 1.09,
			envPower: 3.6,
			smoothingPower: 0.41000000000000003,
			roughnessPower: 1,
			sunIntensity: 0,
			aoColor: 13744018,
			aoColorSaturation: 0.4064516129032258,
			hemisphereColor: 2301734,
			irradianceColor: 9011574,
			radianceColor: 12222327,
			sunColor: 16777215,
			mapContrast: 0.77,
			lightMapContrast: 1.1500000000000001,
			irradianceIntensity: 0.44,
			radianceIntensity: 6.34
		}



		const envMapPos = new THREE.Vector3(settings.envMapPosX, settings.envMapPosY, settings.envMapPosZ)
		const envMapSize = new THREE.Vector3(settings.envMapSizeX, settings.envMapSizeY, settings.envMapSizeZ)

		const enhanceShaderLightingOptions = {
			...settings,
			...{
				aoColor: new THREE.Color(settings.aoColor),
				hemisphereColor: new THREE.Color(settings.hemisphereColor),
				irradianceColor: new THREE.Color(settings.irradianceColor),
				radianceColor: new THREE.Color(settings.radianceColor)
			}
		}

		let ceiling

		function init() {


			window.renderer = renderer;
			window.camera = camera;
			window.scene = scene;



			_this.enableRenderer = false;

			SSREffect.patchDirectEnvIntensity(0.1)

			renderer.outputEncoding = THREE.sRGBEncoding
			renderer.toneMapping = THREE.ACESFilmicToneMapping
			renderer.toneMappingExposure = 1.4
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(window.innerWidth, window.innerHeight)

			composer = new POSTPROCESSING.EffectComposer(renderer)
			renderPass = new POSTPROCESSING.RenderPass(scene, camera)

			composer.addPass(renderPass)

			UpdateScene();
			loop();
		}



		function UpdateScene() {

const url = "./postprocessing/room/room.gltf";

			gltflLoader.load(url, asset => {
				scene.add(asset.scene)
			
				const collider = asset.scene.getObjectByName("collider")
				if (collider) {
					// worldOctree.fromGraphNode(collider)
					collider.removeFromParent()
					collider.geometry.dispose()
					collider.material.dispose()
				}
			
				let ceiling
			
				asset.scene.traverse(c => {
					if (c.material) {
						if (c.name !== "emissive") {
							const lightMap = c.material.emissiveMap
			
							// lightmap
							if (lightMap) {
								c.material.lightMap = lightMap
								c.material.emissiveMap = null
			
								lightMap.encoding = THREE.LinearEncoding
							}
			
							c.material.onBeforeCompile = shader => {
								useBoxProjectedEnvMap(shader, envMapPos, envMapSize)
								enhanceShaderLighting(shader, enhanceShaderLightingOptions)
							}
						}
			
						c.material.color.setScalar(0.05)
						// c.material.roughness = 0.2
						c.material.roughness = 1   //关反射
			
						if (c.material.name.includes("ceiling")) {
							c.material.map.offset.setScalar(0)
							c.material.emissive.setHex(0xffb580)
							c.material.roughness = 0.35
			
							ceiling = c
						}
			
						if (c.material.name.includes("floor")) {
							c.material.normalScale.setScalar(0.4)
							c.material.roughness = 0.2  //开反射
			
						}
			
						if (c.name.includes("props")) {
							c.material.color.setScalar(0.35)
			
							if (c.material.name.includes("Couch")) c.material.roughness = 1
						}
			
						if (c.material.emissiveMap && c.material.normalMap) {
							c.material.emissiveIntensity = 10
						}
			
						c.material.envMapIntensity = Math.PI
					}
			
					c.updateMatrixWorld()
			
					if (c.name === "emissive") {
						c.material.envMapIntensity = 0
						emitterMesh = c
					}
				})
			
				new POSTPROCESSING.LUT3dlLoader().load("./postprocessing/room.3dl", lutTexture => {
					const lutEffect = new POSTPROCESSING.LUTEffect(lutTexture)
					// now init SSR effect
					// test: compile with "google-closure-compiler --language_in ECMASCRIPT_2020 --module_resolution NODE --generate_exports index.js"
					ssrEffect = new SSREffect(scene, camera, params)
					window.ssrEffect = ssrEffect
			
					gui = new SSRDebugGUI(ssrEffect, params)
			
					// stats = new Stats()
					// stats.showPanel(0)
					// document.body.appendChild(stats.dom)
			
					// const presetsFolder = gui.pane.addFolder({ title: "Presets", expanded: false })
					// presetsFolder
					// 	.addButton({
					// 		title: "Default"
					// 	})
					// 	.on("click", () => {
					// 		for (const key of Object.keys(defaultParams)) params[key] = defaultParams[key]
					// 		gui.pane.refresh()
			
					// 		if (emitterMesh.material._oldMap) {
					// 			emitterMesh.material.map = emitterMesh.material._oldMap
					// 			emitterMesh.material.emissiveMap = emitterMesh.material._oldMap
					// 		}
			
					// 		ssrEffect.samples = 0
					// 	})
			
					// presetsFolder
					// 	.addButton({
					// 		title: "Animated Background"
					// 	})
					// 	.on("click", () => {
					// 		useVideoBackground()
					// 	})
			
					const bloomEffect = new POSTPROCESSING.BloomEffect({
						intensity: 2,
						luminanceThreshold: 0.4,
						luminanceSmoothing: 0.7,
						kernelSize: POSTPROCESSING.KernelSize.HUGE,
						mipmapBlur: true
					})
			
					const vignetteEffect = new POSTPROCESSING.VignetteEffect({
						darkness: 0.3675
					})
			
					const fxaaEffect = new POSTPROCESSING.FXAAEffect()
			
					composer.addPass(
						new POSTPROCESSING.EffectPass(camera, fxaaEffect, ssrEffect, bloomEffect, vignetteEffect, lutEffect)
					)
			
					new THREE.TextureLoader().load("./postprocessing/OfficeCeiling002_1K_Emission.webp", tex => {
						// const emissiveMap = ceiling.material.map.clone()
						// emissiveMap.source = tex.source
						// ceiling.material.emissiveMap = emissiveMap
						// ceiling.material.emissiveIntensity = 10
			
						// if (box) box.visible = false
						scene.environment = ssrEffect.generateBoxProjectedEnvMapFallback(renderer, envMapPos, envMapSize, 1024)
						// if (box) box.visible = true
					})
			
				})
			
			})





			return;
			const collider = scene.getObjectByName("collider")
			if (collider) {
				collider.removeFromParent()
				collider.geometry.dispose()
				collider.material.dispose()
			}


			scene.traverse(c => {
				if (c.material) {
					if (c.name !== "emissive") {
						const lightMap = c.material.emissiveMap

						// lightmap
						if (lightMap) {
							c.material.lightMap = lightMap
							c.material.emissiveMap = null

							lightMap.encoding = THREE.LinearEncoding
						}

						c.material.onBeforeCompile = shader => {
							// console.log(shader);
							if(shader.defines){
								useBoxProjectedEnvMap(shader, envMapPos, envMapSize);
								enhanceShaderLighting(shader, enhanceShaderLightingOptions);
							}
						}
					}

					// c.material.color.setScalar(0.05);
					// c.material.roughness = 0.2
					c.material.roughness = 1   //关反射

					if (c.material.name.includes("ceiling")) {
						c.material.map.offset.setScalar(0)
						c.material.emissive.setHex(0xffb580)
						c.material.roughness = 0.35

						ceiling = c
					}

					if (c.material.name.includes("floor")) {
						c.material.normalScale.setScalar(0.4)
						c.material.roughness = 0.2  //开反射

					}

					if (c.name.includes("props")) {
						c.material.color.setScalar(0.35)

						if (c.material.name.includes("Couch")) c.material.roughness = 1
					}

					if (c.material.emissiveMap && c.material.normalMap) {
						c.material.emissiveIntensity = 10
					}

					c.material.envMapIntensity = Math.PI
				}

				c.updateMatrixWorld()

				if (c.name === "emissive") {
					c.material.envMapIntensity = 0
					emitterMesh = c
				}
			});





			new POSTPROCESSING.LUT3dlLoader().load("./postprocessing/room.3dl", lutTexture => {
				const lutEffect = new POSTPROCESSING.LUTEffect(lutTexture)

				// now init SSR effect
				// test: compile with "google-closure-compiler --language_in ECMASCRIPT_2020 --module_resolution NODE --generate_exports index.js"
				ssrEffect = new SSREffect(scene, camera, params)
				window.ssrEffect = ssrEffect

				gui = new SSRDebugGUI(ssrEffect, params)


				const bloomEffect = new POSTPROCESSING.BloomEffect({
					intensity: 2,
					luminanceThreshold: 0.4,
					luminanceSmoothing: 0.7,
					kernelSize: POSTPROCESSING.KernelSize.HUGE,
					mipmapBlur: true
				})

				const vignetteEffect = new POSTPROCESSING.VignetteEffect({
					darkness: 0.3675
				})

				const fxaaEffect = new POSTPROCESSING.FXAAEffect()

				composer.addPass(
					new POSTPROCESSING.EffectPass(camera, fxaaEffect, ssrEffect, bloomEffect, vignetteEffect, lutEffect)
				)

				new THREE.TextureLoader().load("./postprocessing/OfficeCeiling002_1K_Emission.webp", tex => {
					// const emissiveMap = ceiling.material.map.clone()
					// emissiveMap.source = tex.source
					// ceiling.material.emissiveMap = emissiveMap
					// ceiling.material.emissiveIntensity = 10

					// if (box) box.visible = false
					scene.environment = ssrEffect.generateBoxProjectedEnvMapFallback(renderer, envMapPos, envMapSize, 1024)
					// if (box) box.visible = true
				})
			})


			loop()

		}


		function loop() {
			composer.render()
			requestAnimationFrame(loop)
		}

		init();
		// event handlers
		// window.addEventListener("resize", () => {
		// 	camera.aspect = window.innerWidth / window.innerHeight
		// 	camera.updateProjectionMatrix()

		// 	renderer.setSize(window.innerWidth, window.innerHeight)
		// 	if (ssrEffect) ssrEffect.setSize(window.innerWidth, window.innerHeight)
		// })

		// document.querySelector("#orbitControlsDomElem").addEventListener("mousedown", () => {
		// 	document.body.requestPointerLock()
		// })

		// document.addEventListener("pointerlockchange", () => {
		// 	gui.pane.containerElem_.style.display = gui.pane.containerElem_.style.display === "none" ? "block" : "none"
		// 	stats.dom.style.display = stats.dom.style.display === "none" ? "block" : "none"
		// })

	}
}


export { YJReflectPostprocessing };