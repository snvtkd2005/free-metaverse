

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
    const shieldGeometry = new THREE.SphereGeometry(1, 20, 20)
    
    let uniforms = {
      depthTexture: { type: "sampler2D", value: depthTexture },
      resolution: { value: new THREE.Vector2(1.0, 1.0) },
      bufColor: { value: null },
      u_tex: { type: "sampler2D", value: null },
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
        varying float vDepth; 
        varying float vRim; 
        varying vec2 vUv; 
        uniform float time;

        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>  
        vUv = uv;
        vUv.x += time * 0.0001;
        vUv.y += time * 0.0006;
      
        vec3 n = normalMatrix * normal;
        vec4 viewPosition = modelViewMatrix * vec4( position, 1. );
        vec3 eye = normalize(-viewPosition.xyz);
        vRim = 1.0 - abs(dot(eye,n));
        vRim = pow(vRim, 5.); 
        vDepth = viewPosition.z;
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
        varying float vDepth; 
        varying float vRim; 
        varying float vUv;  

        uniform sampler2D depthBuffer;
        uniform vec2 resolution;
        uniform float time;
        uniform sampler2D u_tex;
        uniform float range;
        uniform float uNear;
        uniform float uFar;
        
        const vec4 baseColor = vec4(0.0,0.9,0.0,0.1);
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        ` 
        // outgoingLight = vViewPosition ;
 
 
        // vec2 uv = gl_FragCoord.xy / resolution;
        // vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/resolution.y +0.5;


        float sceneDepth = texture2D(depthTexture, vUv).r; //屏幕空间深度

        float _multiply = (sceneDepth * -1. ); 

        // vec4 packedDepth = texture(depthBuffer, uv);
        // float sceneDepth = packedDepth.r;
        // float sceneDepth = depthSample * (uFar-uNear) + uNear;


        
        // subtract 相减
        float _subtract = (sceneDepth - _multiply);
        // float _saturate = saturate( _multiply * range);
        float _saturate = saturate( _subtract * range);
        float oneMinus = 1.-_saturate  ;  
        vec3 color = vec3(0.,1.0,0.0) * oneMinus;   
 
        gl_FragColor = vec4( color ,1. ); 
        // gl_FragColor = vec4(texture2D(depthBuffer, vec2(uv.x, uv.y)).rgb ,1. );

        // // discard;


        // // 基础色
        // vec4 color = baseColor;
        // vec2 uv = gl_FragCoord.xy / resolution;
    
        // // 动态纹理
        // // vec4 maskA = vec4(texture2D(u_tex, vUv).rgb,1.);
        // vec4 maskA = (texture(u_tex, uv));
        // // vec4 maskA = (texture(depthBuffer, vUv));
        // maskA.a = maskA.r;
        // color += maskA;

        // // 边界高亮
        // // vec2 uv = gl_FragCoord.xy / resolution;
        // vec4 packedDepth = texture(depthBuffer, uv);
        // float sceneDepth = unpackRGBAToDepth(packedDepth);
        // float depth = (vDepth - .1) / ( 10.0 -.1);
        // float diff = abs(depth - sceneDepth);
        // float contact = diff * 20.;
        // contact = 1. - contact;
        // contact = max(contact, 0.);
        // contact = pow(contact, 20.);
        // contact *= diff*1000.;
        // float a = max(contact, vRim);
        // float fade = 1. - pow(vRim, 10.);
        // color += a * fade;
        // gl_FragColor = vec4(color);
        `
      );

    }

    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial)
    shield.position.set(0, 0.5, 0)
    // shield.material.uniforms.depthBuffer.value = depth.texture
    // shield.material.uniforms.bufColor.value = depth.texture
    // shield.material.uniforms.u_tex.value = texture
    scene.add(shield)
    shield.renderOrder = 1;
    function init() { 
    } 
    init();
  }
}

export { YJshaderLX };