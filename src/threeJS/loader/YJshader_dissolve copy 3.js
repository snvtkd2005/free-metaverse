

import * as THREE from "three";


/**
 溶解shader
 传入模型
 */
class YJshader_dissolve {
  constructor(model) {
    let scope = this;
    // 顶点着色器
    let vertexShader = /* glsl */ `
    uniform sampler2D mainTex;  
    varying vec2 vUv;
    attribute vec2 uv2; 
    void main() {  
      vUv = uv;
      // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // vec4 viewPosition = viewMatrix * modelPosition;
      // vec4 projectedPosition = projectionMatrix * viewPosition;
      // gl_Position = projectedPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //与上面四行等价
    }`;

    // 片元着色器
    let fragmentShader = /* glsl */ `
    varying vec2 vUv; 
    uniform sampler2D mainTex; 
    uniform vec2 u_resolution;
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
          vec3 finalColor= vec3(1) - vec3(1) * noiseValue ;  
          vec3 col =vec3(1,1, 1) * ((time)) ;
          // vec3 col =vec3(1,1, 1) * (sin(time)) ;
          finalColor += (col*2.) ;  
          return finalColor.r;
    }
    void main() { 
      gl_FragColor=vec4(texture2D(mainTex, vUv).rgb,dissolve(time)); 
    }`;

    let last = performance.now();
    let deltaTime = 1;
    let newMats = [];
    function init() {
      console.log(" 进入 溶解 shader  ");
      initBirds();
    }

    function initBirds() {
      newMats = [];
      let materials = [];
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          if (item.name.includes("collider")) {
          } else {
            if (item.material) {
              item.material.onBeforeCompile = (shader) => {
                console.log("shader ", shader);
              }
            }
            materials.push({ mesh: item, mat: item.material });
          }
        }
      });


      console.log(" 找到材质 ", materials);
      for (let i = 0; i < materials.length; i++) {
        let mat = materials[i].mat;

        let uniforms = {
          'mainTex': { value: mat.map },
          'time': { value: 1.0 },
        };
        // THREE.ShaderMaterial
        let _ShaderMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          side: THREE.DoubleSide,
          transparent: true,
        });
        materials[i].mesh.material = _ShaderMaterial;
        newMats.push({ uniforms: uniforms, mat: _ShaderMaterial });
      }


      animate();
    }
    let updateId = null;
    function animate() {
      // console.log(" 在 溶解 shader  ",newMats);
      // console.log(" 在 溶解 shader  ", deltaTime);
      if (deltaTime == -1) {
        cancelAnimationFrame(updateId);
        return;
      }
      updateId = requestAnimationFrame(animate);
      const now = performance.now();
      let delta = (now - last) / 1000;
      deltaTime -= delta * 0.5;
      if (deltaTime <= -1) {
        deltaTime = -1;
      }
      last = now;
      for (let i = 0; i < newMats.length; i++) {
        const element = newMats[i];
        element.mat.uniforms['time'].value = deltaTime;
      }
    }
    init();
  }
}

export { YJshader_dissolve };