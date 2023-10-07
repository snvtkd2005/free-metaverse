import * as THREE from "three";

// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";


import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { YJLoadModel } from "./YJLoadModel";

// 单个模型辉光效果

class YJBloomModel {
  constructor(container) {
    var scope = this;

    let scene;
    let renderer;
    let camera;

    let group = null;
    var model = null;
    // 获取模型准备移动
    this.GetModel = function () {
      this.DestroyCollider();
      return group;
    }

    let width, height;
    const materials = {};
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      exposure: 1,
      bloomThreshold: 0,
      bloomStrength: 5,
      bloomRadius: 0,
      scene: 'Scene with Glow'
    };

    let bloomComposer, finalComposer;


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function Init() {

      console.log("初始化小窗3d场景");
      scene = new THREE.Scene(); // 场景
      // let width = 300;
      // let height = 300;
      width = container.clientWidth;
      height = container.clientHeight;
      // let width = window.innerWidth;
      // let height = window.innerHeight;
      camera = new THREE.PerspectiveCamera(
        40,
        width / height,
        0.01,
        10000
      );
      scene.add(camera);
      camera.position.set(0, 0, 20);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true; // 开启阴影
      // renderer.setPixelRatio(2); //推荐
      renderer.setPixelRatio(window.devicePixelRatio);
      // renderer.toneMapping = THREE.ReinhardToneMapping;

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光 
      scene.add(ambient); //光源添加到场景中


      container.append(renderer.domElement);

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

      gui.add(params, 'scene', ['Scene with Glow', 'Glow only', 'Scene only']).onChange(function (value) {

        switch (value) {

          case 'Scene with Glow':
            bloomComposer.renderToScreen = false;
            break;
          case 'Glow only':
            bloomComposer.renderToScreen = true;
            break;
          case 'Scene only':
            // nothing to do
            break;

        }

        render();

      });

      const folder = gui.addFolder('Bloom Parameters');

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

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );

        bloomComposer.setSize(width, height);
        finalComposer.setSize(width, height);

        render();

      };

      window.addEventListener('pointerdown', onPointerDown);
      render();
      setupScene();
 

    }

    function onPointerDown(event) {

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, false);
      // console.log(intersects);
      if (intersects.length > 0) {

        const object = intersects[0].object;
        object.layers.toggle(BLOOM_SCENE);
        render();

      }

    }
    function setupScene() {

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
      // renderBloom(true);
      // finalComposer.render();
      // bloomComposer.render();
      // return;
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
    this.update = function () {
      render();

    }
  }
}


export { YJBloomModel };