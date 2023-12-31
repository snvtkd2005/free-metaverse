

import * as THREE from "three";

 
/**
 溶解shader
 */
class YJshader_dissolve {
  constructor(_this, scene) {
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
    void main() { 
      vec2 uv=vUv; 
      uv=(uv.xy*2.-uv.xy); 
      vec2 uv0=vUv; 
      float noiseValue = (noise(uv0*3.)); 
      vec3 finalColor= vec3(1) - vec3(1) * noiseValue ;  
      vec3 col =vec3(1,1, 1) * (sin(time)) ;
      finalColor += (col*2.) ;  
      gl_FragColor=vec4(texture2D(mainTex, uv0).rgb,finalColor.r); 

    }`;

    let mesh;
    let last = performance.now();

    let uniforms;
 
    function init() {
 
      initBirds();
    }


    let _ShaderMaterial
    function initBirds() {
      const geometry = new THREE.PlaneGeometry(1, 1, 10);
      let texture = new THREE.TextureLoader().load(
        "./public/images/farm.png", (texture) => { 
          console.log("加载图片 ",texture);
      }); 
      uniforms = { 
        'mainTex': { value: texture }, 
        'time': { value: 0.0 }, 
      };

      // THREE.ShaderMaterial
      _ShaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        transparent:true, 
      });

      mesh = new THREE.Mesh(geometry, _ShaderMaterial);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      scene.add(mesh);
      mesh.visible = true;
      mesh.position.set(2, 1, 2);
      mesh.rotation.set(0, 0, 0);

      animate();

    }


    let deltaTime = 0;
    function animate() { 
      requestAnimationFrame(animate);
      const now = performance.now();
      let delta = (now - last) / 1000;
      deltaTime += delta * 0.5;  
      last = now;
      // 控制动画播放 
      if (_ShaderMaterial) _ShaderMaterial.uniforms['time'].value = deltaTime;
    }
    init();
  }
}

export { YJshader_dissolve };