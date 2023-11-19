

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
    let vertexShaderDef = /* glsl */ `
        varying vec2 vUv; 
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


    let _ShaderMaterial
    function initBirds() {

      // const geometry = new THREE.SphereGeometry(1, 10, 10);
      const geometry = new THREE.PlaneGeometry(2,2, 10);
      let texture = new THREE.TextureLoader().load(
        "./public/images/black.png", 
        // "./public/images/farm.png", 
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
      _ShaderMaterial = new THREE.MeshStandardMaterial({
        // map: texture,
        color:0x000000,
        side: THREE.DoubleSide,
        transparent: true,
        emissiveIntensity:10,
      });

      _ShaderMaterial.onBeforeCompile = (shader) => {
        // console.log("shader ", shader);

        Object.assign(shader.uniforms, uniforms)
        if(_ShaderMaterial.map == null){
          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
            #include <common>  
            varying vec2 vUv;
            `
          );
          shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_vertex>',
            `
            #include <uv_vertex>  
            vUv = uv;
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            `
            #include <common>  
            varying vec2 vUv;
            ` 
          );
        }
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_pars_fragment>',
          fragmentShaderDef
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <emissivemap_fragment>',
          ` 
          // #include <emissivemap_fragment>
          totalEmissiveRadiance = emission(time);
          `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          ` 
          // #include <output_fragment>
          // diffuseColor.a = dissolve(time);
          // diffuseColor.a =0.1;
          // gl_FragColor = vec4( outgoingLight, diffuseColor.a );
          // gl_FragColor = vec4( outgoingLight, (time) );
          gl_FragColor = vec4( outgoingLight, dissolve(time) );
          `
        );

      }

      console.log("_ShaderMaterial ", _ShaderMaterial);
      mesh = new THREE.Mesh(geometry, _ShaderMaterial);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      let _ShaderMaterial2 = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });
      
      _ShaderMaterial2.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms)  
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_pars_fragment>',
          fragmentShaderDef
        );  
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          `  
          gl_FragColor = vec4( outgoingLight, dissolve(time) );
          `
        );

      }
      let mesh2 = new THREE.Mesh(geometry, _ShaderMaterial2);
      scene.add(mesh2);
      mesh2.visible = true;
      mesh2.position.set(-2, 2, 0);
      mesh2.rotation.set(0, 0, 0);


      scene.add(mesh);
      mesh.visible = true;
      mesh.position.set(2, 2, 0);
      mesh.rotation.set(0, 0, 0);

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