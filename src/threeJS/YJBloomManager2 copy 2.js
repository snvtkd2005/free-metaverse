import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// import { EffectComposer } from "./js/postprocessing/EffectComposer.js";
// import { RenderPass } from "./js/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "./js/postprocessing/UnrealBloomPass.js";
// import { ShaderPass } from "./js/postprocessing/ShaderPass.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


// 单个模型辉光效果

class YJBloomManager2 {
  constructor(_this, scene, camera, renderer) {

    const materials = {};
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      exposure: 1.5,
      bloomThreshold: 0.5,
      bloomStrength: 0.3,
      bloomRadius: 0,
      scene: 'Scene with Glow'
    };

    let bloomComposer, finalComposer;

    let bloomPass;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const renderTarget = null ;

    function Init() {

      console.log("初始化 指定模型辉光 效果");

      //启用辉光后，取消主控中的renderer,只用辉光renderer渲染。 辉光渲染包含了正常的renderer
      _this.enableRenderer = false;
      // scene.background = new THREE.Color(0x000000);


      renderTarget = new THREE.WebGLRenderTarget(window.innerWidth , window.innerHeight);


      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = Math.pow(params.exposure, 4.0);

      const renderScene = new RenderPass(scene, camera);


      renderScene.outputEncoding = THREE.sRGBEncoding;



      bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth * 2, window.innerHeight * 2), 1.5, 0.4, 0.85);
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;


      bloomComposer = new EffectComposer(renderer);
      bloomComposer.renderToScreen = false;
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(bloomPass);



      let v = `varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}`;

      let f = `uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			}`;
      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
          },
          // vertexShader: document.getElementById('vertexshader').textContent,
          // fragmentShader: document.getElementById('fragmentshader').textContent,
          vertexShader: v,
          fragmentShader: f,
          defines: {}
        }), 'baseTexture'
      );
      finalPass.needsSwap = true;

      finalComposer = new EffectComposer(renderer);
      finalComposer.addPass(renderScene);
      finalComposer.addPass(finalPass);




      // 参数控制UI
      const gui = new GUI();
      const folder = gui.addFolder('Bloom Parameters');

      folder.add(params, 'exposure', 0.1, 2).onChange(function (value) {
        renderer.toneMappingExposure = Math.pow(value, 4.0);
      });

      folder.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
        bloomPass.threshold = Number(value);
        render();
      });
      folder.add(params, 'bloomStrength', 0.0, 10.0).onChange(function (value) {
        bloomPass.strength = Number(value);
        render();
      });
      folder.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {
        bloomPass.radius = Number(value);
        render();
      });

      window.onresize = function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        bloomComposer.setSize(width, height);
        finalComposer.setSize(width, height);
        render();
      };

      // window.addEventListener('pointerdown', onPointerDown);

      render();

      setTimeout(() => {
        setupScene();
        // BlinkFn("开始闪烁",0.1,1,3);
      }, 1000);


    }
    this.onWindowResize = function (w, h) {
      // const width = window.innerWidth;
      // const height = window.innerHeight;
      // bloomComposer.setSize(width, height);
      // finalComposer.setSize(width, height); 
      bloomComposer.setSize(w, h);
      finalComposer.setSize(w, h);
      render();
    }

    let blinking = false;
    let blinkSpeed = 0;
    let blinkMin = 0;
    let blinkMax = 0;
    let direction = 1;
    // 辉光闪烁
    this.Blink = function (tpye, speed, min, max) {
      BlinkFn(tpye, speed, min, max);
    }
    function BlinkFn(tpye, speed, min, max) {
      if (tpye == "开始闪烁") {
        blinking = true;
        blinkSpeed = speed;
        blinkMin = min;
        blinkMax = max;
      }
      if (tpye == "停止闪烁") {
        blinking = false;
      }
    }
    function Blinking() {
      params.bloomStrength += blinkSpeed * direction;

      if (params.bloomStrength < blinkMin) {
        direction = 1;
      }
      if (params.bloomStrength > blinkMax) {
        direction = -1;
      }
      bloomPass.strength = Number(params.bloomStrength);

    }

    function onPointerDown(event) {
      // return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      // console.log(intersects);
      if (intersects.length > 0) {

        const object = intersects[0].object;
        object.layers.toggle(BLOOM_SCENE);
        render();

      }

    }
    function setupScene() {

      // return;
      scene.traverse((obj) => {
        if (obj.isMesh) {
          // console.log(obj.name);

          if (obj.name.indexOf("bloom") > -1 || obj.name == "bloom") {
            console.log("自发光的模型有 " + obj.name);
            obj.layers.enable(BLOOM_SCENE);
            // obj.material.emissiveMap = null;
            // obj.material.emissiveIntensity = 10;

          }
          if (obj.name.includes("npctriggerArea")) {
            console.log("自发光的模型有 " + obj.name);
            obj.layers.enable(BLOOM_SCENE);
            // obj.material.emissiveMap = null;
            // obj.material.emissiveIntensity = 10;

          }
          // if(obj.material.emissiveMap != null){
          //   console.log("自发光的模型有 " + obj.name);
          //   obj.layers.enable(BLOOM_SCENE);
          //   // obj.material.emissiveMap = null;
          // }  
        }
      });


    }
    function disposeMaterial(obj) {
      // return;
      if (obj.material) {

        obj.material.dispose();

      }

    }
    function render() {
      renderBloom(true);
      finalComposer.render();
    }
    function renderBloom(mask) {

      if (mask === true) {
        scene.traverse(darkenNonBloomed);
        bloomComposer.render();
        scene.traverse(restoreMaterial);
      } else {
        camera.layers.set(BLOOM_SCENE);
        bloomComposer.render();
        camera.layers.set(ENTIRE_SCENE);
      }

    }
    function darkenNonBloomed(obj) {
      // return;

      if (obj.isMesh && bloomLayer.test(obj.layers) === false) {

        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;

      }

    }
    function restoreMaterial(obj) {
      // return;

      if (materials[obj.uuid]) {

        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];

      }

    }
    //#region 
    //#endregion

    Init();
    var updateId = null;
    this._update = function () {
      render();
      if (blinking) {
        Blinking();
      }
    }
  }
}


export { YJBloomManager2 };