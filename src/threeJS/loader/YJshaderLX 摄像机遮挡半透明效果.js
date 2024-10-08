

import * as THREE from "three";


import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { YJshader_dissolve } from "./YJshader_dissolve.js";
import { YJshaderLX2 } from "./YJshaderLX2.js";

// import  fragmentShaderGLSL  from "/@/threeJS/shader/fragmentShader.glsl";

/**
 动态模型合批优化： merge 、 instance
 模型本身用instance
 模型碰撞用 geometry 合并后生成
 */
class YJshaderLX {
  constructor(_this, scene) {
    let scope = this;


    // 顶点着色器
    let vertexShaderMain = /* glsl */ ` 
      #include <begin_vertex>
    // #include <common>  
    // varying vec2 vUv;
    // attribute vec2 uv2;    
      // vUv = uv;
      
      // vec3 transformed = position.xyz;
      // transformed = position.xyz; 
      transformed.z = position.z + time ;
      transformed.x = vUv.x;
      transformed.y = vUv.y;
      
      // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // vec4 viewPosition = viewMatrix * modelPosition;
      // vec4 projectedPosition = projectionMatrix * viewPosition;
      // gl_Position = projectedPosition;
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0); //与上面四行等价
    `;

    // 片元着色器
    let fragmentShaderDef = /* glsl */ ` 
    #include <map_pars_fragment> 
    uniform float time; 
    // uniform float depth; 
    `;
    let fragmentShaderMain = /* glsl */ `
        void main() { 
          gl_FragColor=vec4(texture2D(mainTex, vUv).rgb,dissolve(time)); 
        }
    `;
    let mesh;
    let last = performance.now();

    let uniforms;
    let _YJshader_dissolve = null;
    function init() {
      // new YJshaderLX2(_this, scene);

      // let modelPath = _this.GetPublicUrl() + "models/TestScene/quad.gltf";
      // let texPath = _this.GetPublicUrl() + "models/TestScene/box_UV1_UV1.exr";
      // let _YJLoadModel = new YJLoadModel( scene);

      // _YJLoadModel.load("yj_cavalry", modelPath, new THREE.Vector3(2, 0, 2), new THREE.Vector3(0, 0, 0),
      //   new THREE.Vector3(1, 1, 1), false, null, (scope) => {
      //     let model = scope.GetModel(); 
      //     model.traverse((obj) => {
      //       if (obj.isMesh) { 
      //         LoadTexure(obj,texPath); 
      //       }
      //     });
      //   }); 
      initBirds();
    }

    function createSphere(radius) {
      const geometry = new THREE.SphereGeometry(radius, 20, 20);
      let mat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        side: THREE.DoubleSide,
        transparent: true,
      });
      mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      mesh.visible = true;
      mesh.position.set(-1, 0, 0);
      return mat;
    }

    function createPlane(size, map) {

      const geometry = new THREE.PlaneGeometry(size, size, 10, 10);
      let mat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        side: THREE.DoubleSide,
        map: map,
        // wireframe:true,
      });
      mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      mesh.visible = true;
      mesh.position.set(-1, 1, 0);
      mesh.rotation.set(-Math.PI / 2, 0, 0);
      mesh.add(new THREE.AxesHelper(1));
      return mat;
    }


    let _ShaderMaterial
    function initBirds() {

      _ShaderMaterial = createSphere(3);
      let texture = new THREE.TextureLoader().load(
        // "./public/images/black.png", 
        "./public/images/farm.png",
        (texture) => {
          console.log("加载图片 ", texture);
        });



      // For Vertex and Fragment
      uniforms = {
        // 'color': { value: new THREE.Color(0xff2200) },
        // "size": { value: 1 },
        // 'depth': { value: 0.0 },
        'time': { value: 1.0 },
      };

      // THREE.ShaderMaterial
      // _ShaderMaterial = new THREE.ShaderMaterial({
      //   uniforms: uniforms,
      //   vertexShader: vertexShader,
      //   fragmentShader: fragmentShader,
      //   side: THREE.DoubleSide,
      //   transparent:true, 
      // });
      // _ShaderMaterial = createPlane(0.5,texture);


      _ShaderMaterial.onBeforeCompile = (shader) => {
        console.log("shader ", shader);

        Object.assign(shader.uniforms, uniforms)

        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `
          #include <common>  
          varying float depth; 
          `
        );

        shader.vertexShader = shader.vertexShader.replace(
          '#include <uv_vertex>',
          `
          #include <uv_vertex>  
          vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
          depth = modelPosition.z; 
          `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `
          #include <common>  
          varying float depth; 
          // float LinearEyeDepth(float depth, float4 zBufferParam)
          // {
          //     return 1.0 / (zBufferParam.z * depth + zBufferParam.w);
          // }
          `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_pars_fragment>',
          `
          #include <map_pars_fragment> 
          uniform float time; `
          //  fragmentShaderDef
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          ` 
          outgoingLight = vViewPosition ;
          vec3 _vViewPosition = vViewPosition; 
          float _multiply = (_vViewPosition.b * 1. );

          // float depth = 1.0/ u_resolution.xy ;
          float depth = 1.0 ;
          // subtract 相减
          float _subtract = (depth - _multiply);
          float _saturate = saturate( _subtract * time);
          float oneMinus = 1.-_saturate ; 
          vec3 color = vec3(0.,1.0,.0); 
          outgoingLight = color * oneMinus ; 

          // outgoingLight = vec3(_vViewPosition.z); 
          // outgoingLight = vec3(depth); 
           
          gl_FragColor = vec4( outgoingLight,1.-oneMinus  );
          `
        );

      }

      console.log("_ShaderMaterial ", _ShaderMaterial);

      setTimeout(() => {

        // _YJshader_dissolve = new YJshader_dissolve(_Global.YJ3D.YJPlayer.GetPlayerGroup());
        // _YJshader_dissolve = new YJshader_dissolve(mesh);
      }, 2000);



      // animate();

    }
    this.SetUniform = function (msg) {
      uniforms[msg.p].value = msg.v;
    }

    let deltaTime = 1;
    function animate() {
      requestAnimationFrame(animate);

      const now = performance.now();
      let delta = (now - last) / 1000;
      deltaTime -= delta * 1;
      if (deltaTime <= -2) {
        deltaTime = 1;
      }
      last = now;
      // 控制动画播放 
      if (_ShaderMaterial) {
        uniforms['time'].value = deltaTime;
      }
      // if (_ShaderMaterial) _ShaderMaterial.uniforms['time'].value = deltaTime;
      // console.log(deltaTime);
    }
    init();
  }
}

export { YJshaderLX };