import * as THREE from "three";

// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";


import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


// 单个模型辉光效果

class YJBloomManager2 {
  constructor(_YJSceneManager,scene,camera, renderer) {
 
    const materials = {};
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      exposure: 1,
      bloomThreshold: 0.2,
      bloomStrength: 0.5,
      bloomRadius: 0,
      scene: 'Scene with Glow'
    };
 
    let bloomComposer, finalComposer;


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function Init() {

      console.log("初始化 指定模型辉光 效果");
     
      // scene.background = new THREE.Color(0x000000);
       
      

      const renderScene = new RenderPass(scene, camera);

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
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




      const gui = new GUI();
      // gui.add(params, 'scene', ['Scene with Glow', 'Glow only', 'Scene only']).onChange(function (value) {
      //   switch (value) {
      //     case 'Scene with Glow':
      //       bloomComposer.renderToScreen = false;
      //       break;
      //     case 'Glow only':
      //       bloomComposer.renderToScreen = true;
      //       break;
      //     case 'Scene only': 
      //       break;
      //   }
      //   render();
      // }); 

      
      const folder = gui.addFolder('Bloom Parameters');

      // renderer.toneMapping = THREE.ReinhardToneMapping;
      // folder.add(params, 'exposure', 0.1, 2).onChange(function (value) {
      //   renderer.toneMappingExposure = Math.pow(value, 4.0);
      //   render();
      // });

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

      window.addEventListener('pointerdown', onPointerDown);

      render();
      setupScene();
 

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
      scene.traverse((obj)=>{
        if (obj.isMesh ) {
          // console.log(obj.name);
          if(obj.name.indexOf("bloom")>-1){
            // console.log("自发光的模型有 " + obj.name);
            obj.layers.enable(BLOOM_SCENE);
            // obj.material.emissiveMap = null;
          } 
          // if(obj.material.emissiveMap != null){
          //   console.log("自发光的模型有 " + obj.name);
          //   obj.layers.enable(BLOOM_SCENE);
          //   // obj.material.emissiveMap = null;
          // }  
        }
      });



      return;
      scene.traverse(disposeMaterial);
      scene.children.length = 0;


      const geometry = new THREE.IcosahedronGeometry(1, 15);

      for (let i = 0; i < 50; i++) {

        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05);

        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = Math.random() * 10 - 5;
        sphere.position.y = Math.random() * 10 - 5;
        sphere.position.z = Math.random() * 10 - 5;
        sphere.position.normalize().multiplyScalar(Math.random() * 4.0 + 2.0);
        sphere.scale.setScalar(Math.random() * Math.random() + 0.5);
        scene.add(sphere);

        if (Math.random() < 0.25) sphere.layers.enable(BLOOM_SCENE);

      }

      render();

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
      // bloomComposer.render();
      return;
      switch (params.scene) {

        case 'Scene only':
          renderer.render(scene, camera);
          break;
        case 'Glow only':
          renderBloom(false);
          break;
        case 'Scene with Glow':
        default:
          // render scene with bloom
          renderBloom(true);

          // render the entire scene, then render bloom scene on top
          finalComposer.render();
          // bloomComposer.render();
          break;

      }

    }
    function renderBloom(mask) {
      // return;

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

    }
  }
}


export { YJBloomManager2 };