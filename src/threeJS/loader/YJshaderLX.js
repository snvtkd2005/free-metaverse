

import * as THREE from "three";


import { shader as depthVertexShader } from '/@/threeJS/shaders/depth-vs.js'
import { shader as depthFragmentShader } from '/@/threeJS/shaders/depth-fs.js'
import { shader as shieldVertexShader } from '/@/threeJS/shaders/shield-vs.js'
import { shader as shieldFragmentShader } from '/@/threeJS/shaders/shield-fs.js'
// import  fragmentShaderGLSL  from "/@/threeJS/shader/fragmentShader.glsl";

/**
 扫光shader
 */
class YJshaderLX {
  constructor(scene,camera, depthTexture) {
    let scope = this;
    // shield
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('./public/images/noise1.png')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    const shieldGeometry = new THREE.SphereGeometry(2, 20, 20)
    
    let uniforms = {
      depthTexture: { type: "sampler2D", value: depthTexture },
      resolution: { value: new THREE.Vector2(1.0, 1.0) },
      time: { value: 0.0 },
      uNear: { value: camera.near },
      uFar: { value: camera.far },
      range: { value: 1.0 },
    };
    const shieldMaterial = new THREE.MeshStandardMaterial({
      // vertexShader: shieldVertexShader,
      // fragmentShader: shieldFragmentShader,
      transparent: true,
      // depthWrite: false,
      // depthTest:,
      side: THREE.DoubleSide,
      blending:THREE.AdditiveBlending,
    })
    shieldMaterial.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>  
        #ifdef GL_ES
            precision highp float;
              #endif 
        varying vec2 vUv; 
        varying vec4 viewPosition; 

        uniform float time;


        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>  
        vUv = uv;  
        viewPosition = modelViewMatrix * vec4( position, 1. );
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '"#define STANDARD',
        `
        #version 300 es
        "#define STANDARD  
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        ` 
        #include <common>  
        #ifdef GL_ES
            precision highp float;
              #endif 
        varying vec2 vUv;  
        varying vec4 viewPosition; 

        uniform sampler2D depthTexture;
        uniform vec2 resolution;
        uniform float time;
        uniform sampler2D u_tex;
        uniform float range;
        uniform float uNear;
        uniform float uFar;
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        `  

        float sceneDepth = texture2D(depthTexture, vUv).r; //屏幕空间深度
        float _multiply = (viewPosition.z * -1. ); 
        // subtract 相减
        float _subtract = (sceneDepth - _multiply);
        float _saturate = saturate( _subtract * range);

        float oneMinus = 1.-_saturate  ;  

        // vec3 color = vec3(1.,0.0,0.) ;   
        vec3 color = vec3(1.,0.0,0.) * oneMinus;   
 
        // gl_FragColor = vec4( vec3(1.) ,1. );  
        gl_FragColor = vec4( color ,1. );  
        `
      );

    }

    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.set(0, 1, 0) ;
    scene.add(shield) ;
    function init() { 
    } 
    init();
  }
}

export { YJshaderLX };