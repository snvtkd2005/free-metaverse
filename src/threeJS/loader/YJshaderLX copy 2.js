

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
  constructor(_this, scene, camera, renderer) {
    let scope = this;


    // 顶点着色器
    let vertexShader = /* glsl */ ` 
    varying vec2 vUv; 
    void main() { 
      vUv = uv;
      // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // vec4 viewPosition = viewMatrix * modelPosition;
      // vec4 projectedPosition = projectionMatrix * viewPosition;
      // gl_Position = projectedPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //与上面四行等价
    }
    `;

    // 片元着色器
    let fragmentShader = /* glsl */ `  

varying vec2 vUv; 
uniform float u_time;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898,12.1414))) * 83758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n);
    vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

vec3 ramp(float t) {
	return t <= .5 ? vec3( 1. - t * 1.4, .2, 1.05 ) / t : vec3( .3 * (1. - t) * 2., .2, 1.05 ) / t;
}
vec2 polarMap(vec2 uv, float shift, float inner) {
    uv = vec2(0.5) - uv;
    float px = 1.0 - fract(atan(uv.y, uv.x) / 6.28 + 0.25) + shift;
    float py = (sqrt(uv.x * uv.x + uv.y * uv.y) * (1.0 + inner * 2.0) - inner) * 2.0;
    return vec2(px, py);
}
float fire(vec2 n) { 
    return noise(n) + noise(n * 2.1) * .6 + noise(n * 5.4) * .42;
}
float shade(vec2 uv, float t) {
    uv.x += uv.y < .5 ? 23.0 + t * .035 : -11.0 + t * .03;    
    uv.y = abs(uv.y - .5);
    uv.x *= 35.0;
    float q = fire(uv - t * .013) / 2.0;
    vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
    return pow((r.y + r.y) * max(.0, uv.y) + .1, 4.0);
}
vec3 color(float grad) {
    float m2 =  1.5;
    grad =sqrt( grad);
    vec3 color = vec3(1.0 / (pow(vec3(0.5, 0.0, .1) + 2.61, vec3(2.0))));
    vec3 color2 = color;
    color = ramp(grad);
    color /= (m2 + max(vec3(0), color));
    return color;
}

void main() {
	
    float m1 =  2.1;
    float t = u_time; 
    vec2 uv = vUv; 
    uv=(uv.xy*2.-uv.xy);
    float ff = 1.0 - uv.y; 
    vec2 uv2 = uv;
    uv2.y = 1.0 - uv2.y;
   	uv = polarMap(uv, 1.3, m1);
   	uv2 = polarMap(uv2, 1.9, m1);
    vec3 c1 = color(shade(uv, t)) * ff;
    vec3 c2 = color(shade(uv2, t)) * (1.0 - ff);
    gl_FragColor = vec4(c1 + c2, c2.z+0.5);
    // gl_FragColor = vec4(c1 + c2, 1.0);
}
    `; 
    let mesh;
    let last = performance.now();

    let uniforms;
    let _YJshader_dissolve = null;
    function init() {
      initBirds();
    }

    let _ShaderMaterial
    function initBirds() { 
      // For Vertex and Fragment
      console.log(renderer.domElement.width, renderer.domElement.height);
      uniforms = {
        // 'color': { value: new THREE.Color(0xff2200) }, 
        u_time: { value: 1.0 }, 
        u_resolution:  { value: new THREE.Vector2(renderer.domElement.width, renderer.domElement.height) },
      };

      // THREE.ShaderMaterial
      _ShaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide,
        // transparent:true, 
      });
      // _ShaderMaterial = createPlane(0.5,texture);
      console.log("_ShaderMaterial ", _ShaderMaterial);
      const geometry = new THREE.PlaneGeometry(2, 2, 10, 10);

      mesh = new THREE.Mesh(geometry, _ShaderMaterial);

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      mesh.visible = true;

      mesh.position.set(2, 1, 2);
      mesh.rotation.set(Math.PI / 2, 0, 0);
      setTimeout(() => {
        // _YJshader_dissolve = new YJshader_dissolve(_Global.YJ3D.YJPlayer.GetPlayerGroup());
        // _YJshader_dissolve = new YJshader_dissolve(mesh);
      }, 2000);

      animate();

    } 
    this.SetUniform = function (msg) {
      uniforms[msg.p].value = msg.v;
    }

    let deltaTime = 1;
    function animate() {
      requestAnimationFrame(animate);
 
      const now = performance.now();
      let delta = (now - last) / 1000;
      deltaTime += delta * 1;
      // if (deltaTime <= -2) {
      //   deltaTime = 1;
      // }
      last = now;
      // 控制动画播放 
      if (_ShaderMaterial) {
        uniforms['u_time'].value = deltaTime;
      }
      if (_ShaderMaterial) _ShaderMaterial.uniforms['u_time'].value = deltaTime;
      // console.log(deltaTime);
      mesh.rotation.x += 0.01;
    }
    init();
  }
}

export { YJshaderLX };