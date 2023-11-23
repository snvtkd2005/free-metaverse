

import * as THREE from "three";


import { shader as depthVertexShader } from '/@/threeJS/shaders/depth-vs.js'
import { shader as depthFragmentShader } from '/@/threeJS/shaders/depth-fs.js'
import { shader as shieldVertexShader } from '/@/threeJS/shaders/shield-vs.js'
import { shader as shieldFragmentShader } from '/@/threeJS/shaders/shield-fs.js'
// import  fragmentShaderGLSL  from "/@/threeJS/shader/fragmentShader.glsl";

/**
 动态模型合批优化： merge 、 instance
 模型本身用instance
 模型碰撞用 geometry 合并后生成
 */
class YJshaderLX {
  constructor(_this, scene, camera, renderer) {
    let scope = this;

    // cube
    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 'rgb(100, 70, 30)',
      roughness: 0.4,
      metalness: 0.0,
      side: THREE.DoubleSide
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = cube.receiveShadow = true
    cube.position.set(-0.2, 0.2, -0.2)
    cube.rotation.set(-Math.PI / 2, 0, 0)
    scene.add(cube)

    const depthMaterial = new THREE.RawShaderMaterial({
      uniforms: {},
      vertexShader: depthVertexShader,
      fragmentShader: depthFragmentShader,
    })
    const depth = new THREE.WebGLRenderTarget(1, 1, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true
    })
    const hdr = new THREE.WebGLRenderTarget(1, 1, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: true
    })
    // shield
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('./public/images/noise1.png')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    const shieldGeometry = new THREE.SphereGeometry(0.5, 100, 100)
    // const shieldMaterial = new THREE.RawShaderMaterial({
    //   uniforms: {
    //     depthBuffer: { value: null },
    //     resolution: { value: new THREE.Vector2(1, 1) },
    //     bufColor: { value: null },
    //     u_tex: { value: null },
    //     time: { value: 0 }
    //   },
    //   vertexShader: shieldVertexShader,
    //   fragmentShader: shieldFragmentShader,
    //   transparent: true,
    //   depthWrite: false,
    //   side: THREE.DoubleSide,
    // })
    let uniforms = {
      depthBuffer: { type: "sampler2D", value: null },
      resolution: { value: new THREE.Vector2(1.0, 1.0) },
      bufColor: { value: null },
      u_tex: { type: "sampler2D", value: null },
      time: { value: 0.0 },
      range: { value: 1.0 },
    };
    const shieldMaterial = new THREE.MeshStandardMaterial({
      // vertexShader: shieldVertexShader,
      // fragmentShader: shieldFragmentShader,
      transparent: true,
      // depthWrite: false,
      side: THREE.DoubleSide,
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
        vDepth = gl_Position.z;
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
        
        const vec4 baseColor = vec4(0.0,0.9,0.0,0.1);
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        ` 
        // outgoingLight = vViewPosition ;

        vec3 _vViewPosition = vViewPosition; 
        // float _multiply = (vDepth * -1. );
        float _multiply = (vDepth - .1) / ( 10.0 -.1);

        // float _multiply = (_vViewPosition.z * -1. );
        // vec2 uv = gl_FragCoord.xy / resolution;
        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/resolution.y +0.5;

        vec4 packedDepth = texture(depthBuffer, uv);
        float sceneDepth = unpackRGBAToDepth(packedDepth);


        
        // subtract 相减
        float _subtract = (sceneDepth - _multiply);
        float _saturate = saturate( _subtract * range);
        float oneMinus = 1.-_saturate ; 
        vec3 color = vec3(0.,1.0,.0); 
        outgoingLight = color * oneMinus ;   
        // gl_FragColor = vec4( outgoingLight,1. ); 
        gl_FragColor = vec4( outgoingLight,oneMinus );

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
    shield.position.set(0, 0.3, 0)
    // shield.material.uniforms.depthBuffer.value = depth.texture
    // shield.material.uniforms.bufColor.value = depth.texture
    // shield.material.uniforms.u_tex.value = texture


    scene.add(shield)
    shield.renderOrder = 1;
    function init() {
      animate();
    }
    this.SetUniform = function (msg) {
      uniforms[msg.p].value = msg.v;
    }
    function animate() {

      shield.visible = false
      scene.overrideMaterial = depthMaterial
      renderer.setRenderTarget(depth)
      uniforms.depthBuffer.value = depth.texture
      uniforms.bufColor.value = depth.texture
      uniforms.u_tex.value = texture
      renderer.render(scene, camera)

      shield.visible = true
      scene.overrideMaterial = null
      renderer.setRenderTarget(null)
      renderer.render(scene, camera)

      requestAnimationFrame(animate);

      uniforms.time.value = performance.now()
      // shield.material.uniforms.time.value = performance.now()
    }
    init();
  }
}

export { YJshaderLX };