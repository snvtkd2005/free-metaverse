import * as THREE from "three";


import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";


import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

class YJBloomManager {
  constructor(scene,camera, renderer, _this) {
 
    let width, height;


    const materials = {};
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0
    };

    let composer, finalComposer;


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    Init();
    function Init() {
      console.log("初始化 bloom 管理器 ");
        
			renderer.toneMapping = THREE.ReinhardToneMapping;

      const renderScene = new RenderPass(scene, camera);

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;


      composer = new EffectComposer( renderer );
      composer.addPass( renderScene );
      composer.addPass( bloomPass );



      const gui = new GUI();

      gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

        renderer.toneMappingExposure = Math.pow( value, 4.0 );

      } );

      gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

        bloomPass.threshold = Number( value );

      } );

      gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

        bloomPass.strength = Number( value );

      } );

      gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

        bloomPass.radius = Number( value );

      } );

      window.onresize = function () {
        const width = window.innerWidth;
				const height = window.innerHeight;
 
				composer.setSize( width, height );

      }; 
 
    } 
    function render() {
      composer.render();
    }
    this._update = function () {
      // renderer.render(scene, camera);
      render();
    }
  }
}

export { YJBloomManager };