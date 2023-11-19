

import * as THREE from "three";

 
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import { YJshader_dissolve } from "./YJshader_dissolve";
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
    vec2 hash( vec2 p ) // replace this by something better
    {
        p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise( in vec2 p )
    {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;

        vec2  i = floor( p + (p.x+p.y)*K1 );
        vec2  a = p - i + (i.x+i.y)*K2;
        float m = step(a.y,a.x); 
        vec2  o = vec2(m,1.0-m);
        vec2  b = a - o + K2;
        vec2  c = a - 1.0 + 2.0*K2;
        vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot( n, vec3(70.0) );
    } 
    float dissolve(float time){
        vec2 uv=vUv; 
        uv=(uv.xy*2.-uv.xy); 
        vec2 uv0=vUv; 
        float noiseValue = (noise(uv0*3.)); 
        // vec3 finalColor =  vec3(1) * noiseValue*2. ;  
        vec3 finalColor =  vec3(1) *  step(-1.*(time),noiseValue) ;  
        // vec3 finalColor =  vec3(1) *  step(noiseValue,(time))*3. ;  

        vec3 col =vec3(1,1, 1) * ((time)) ;
        // vec3 col =vec3(1,1, 1) * (sin(time)) ;
        finalColor += (col*1.) ;  
        return finalColor.r;
    } 
    vec3 emission(float time){
      vec2 uv0=vUv; 
      float noiseValue = (noise(uv0*3.)); 
      // float m = step((noiseValue),(1.-time)); 
      // float m = step((noiseValue),(1.-time)*0.3) * (1.-time); 
 
      // float m = step((time),noiseValue); 
      // vec3 col =vec3(1,0,0) *  (1.-(step((1.-time),(noiseValue)))) ; 
 
      // vec3 col = vec3(1,0,0) *  ((step(-1.,(noiseValue))))  ; 
      // vec3 col = vec3(1,0,0) * 0.  ; 
      vec3 col = vec3(0,0,1) *  ((step((noiseValue),-1.*(time) +0.03 )))  ; 

      // vec3 col = vec3(1,0,0) *  ((step((noiseValue),(1.-time))))  ; 
      // vec3 col = vec3(1,0,0) *  ((step((noiseValue),(1.-time)*0.3)))  ; 
      // vec3 col =vec3(1,0,0) - vec3(1,0,0) *  ((step((noiseValue),(time+0.04))))  ; 
      // vec3 col =vec3(1,0,0) - vec3(1,0,0) *  ((step((time+0.04),(noiseValue))))  ; 
      // vec3 col =vec3(1,0,0) *  ((step((time),(noiseValue)))) ; 
      return col;
    }
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
      // let _YJLoadModel = new YJLoadModel(_this, scene);

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

    function createSphere(radius){
      const geometry = new THREE.SphereGeometry(radius, 20, 20);
      let mat = new THREE.MeshStandardMaterial({
        color:0x333333, 
      });
      mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      mesh.visible = true;
      mesh.position.set(-1, 0, 0); 
    }

    function createPlane(size,map){
      
      const geometry = new THREE.PlaneGeometry(size,size,10, 10);
      let mat = new THREE.MeshStandardMaterial({
        color:0x333333, 
        side:THREE.DoubleSide,
        map:map,
        // wireframe:true,
      });
      mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      mesh.visible = true;
      mesh.position.set(-1, 1, 0);  
      mesh.rotation.set(-Math.PI/2, 0, 0);
      mesh.add(new THREE.AxesHelper(1));
      return mat;
    }
    

    let _ShaderMaterial
    function initBirds() {

      createSphere(0.5);
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
        'mainTex': { value: texture },
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
      _ShaderMaterial = createPlane(0.5,texture);


      _ShaderMaterial.onBeforeCompile = (shader) => {
        // console.log("shader ", shader);

        Object.assign(shader.uniforms, uniforms)
        
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `
          #include <common>  
          uniform float time;
          float timeDeta = 1.0;
          `
        );

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          vertexShaderMain
        );
        shader.vertexShader = shader.vertexShader.replace(
          '#include <project_vertex>',
          `#include <project_vertex>`
        );
      }

      console.log("_ShaderMaterial ", _ShaderMaterial);

      setTimeout(() => {

        // _YJshader_dissolve = new YJshader_dissolve(_Global.YJ3D.YJPlayer.GetPlayerGroup());
        // _YJshader_dissolve = new YJshader_dissolve(mesh);
      }, 2000);



      // animate();

    }
    this.SetTime = function(e){
      uniforms['time'].value = e;
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
      if (_ShaderMaterial) uniforms['time'].value = deltaTime;
      // if (_ShaderMaterial) _ShaderMaterial.uniforms['time'].value = deltaTime;
      // console.log(deltaTime);
    }
    init();
  }
}

export { YJshaderLX };