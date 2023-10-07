import * as THREE from "three";


import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";


import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

class YJBloomScene {
  constructor(container, _this) {

    let scene;
    let renderer;
    let camera;
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
      camera.position.set( 0, 0, 20 );
			camera.lookAt( 0, 0, 0 );

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      // renderer.shadowMap.enabled = true; // 开启阴影
      // renderer.setPixelRatio(2); //推荐
      renderer.setPixelRatio( window.devicePixelRatio );
			renderer.toneMapping = THREE.ReinhardToneMapping;

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      // var ambient = new THREE.AmbientLight(0x666666); //添加环境光
      scene.add(ambient); //光源添加到场景中

      CreateTestBox();

      container.append(renderer.domElement);


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

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );
				composer.setSize( width, height );

      }; 

      // update();
    }
    function CreateTestBox() {
      let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      scene.add(cube);
      return cube;
    }
    function render() {

      // requestAnimationFrame( animate );

      // const delta = clock.getDelta();

      // mixer.update( delta );

      // stats.update();

      composer.render();

    }
    this.update = function () {
      // renderer.render(scene, camera);
      render();
    }
  }
}

export { YJBloomScene };