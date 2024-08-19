import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

// import { EffectComposer } from "./js/postprocessing/EffectComposer.js";
// import { RenderPass } from "./js/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "./js/postprocessing/UnrealBloomPass.js";
// import { ShaderPass } from "./js/postprocessing/ShaderPass.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { FXAAEffect } from "postprocessing";
import { CreateBoxMesh } from "../utils/utils_threejs";
import { YJshaderLX } from "./loader/YJshaderLX";


// 扫光效果

class YJScanLight {
  constructor(_this, scene, camera, renderer) {
    let scope = this;
    let finalComposer;

    let renderTarget = null;
    let finalPass;
    var uniforms;
    function Init() {

      console.log("初始化 扫光后处理 效果");

      for (let i = 0; i < 100; i++) {
        CreateBoxMesh(scene, 1, 1, 1, 0xff0000,
          new THREE.Vector3(10 * Math.random() * (Math.random() > 0.5 ? 1 : -1), 2, -20 * Math.random() * (Math.random() > 0.5 ? 1 : -1)),
          new THREE.Vector3(-Math.PI / 2, 0, 0));
      }

      CreateBoxMesh(scene, 1000, 0.01, 1000, 0xaaaaaa,
        new THREE.Vector3(0, 0.2,0),
        new THREE.Vector3(-Math.PI / 2, 0, 0));


      // let width, height;
      // width = window.innerWidth;
      // height = window.innerHeight;

      //启用辉光后，取消主控中的renderer,只用辉光renderer渲染。 辉光渲染包含了正常的renderer
      _this.enableRenderer = false;
      const renderScene = new RenderPass(scene, camera);
 
      var depthRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera, depthRenderTarget); 

      const {width, height } = renderer.getDrawingBufferSize (new THREE.Vector2());

      finalComposer = new EffectComposer(renderer);
      const depthTexture = new THREE.DepthTexture(width, height);
      finalComposer.readBuffer.depthBuffer = true;
      finalComposer.readBuffer.depthTexture = depthTexture;

      // finalComposer.renderToScreen = false;

      // renderScene.outputEncoding = THREE.sRGBEncoding;

      let v = ` 
      varying vec2 vUv;
      varying vec3 vPosition;
			void main() {
				vUv = uv; 
        vPosition = position;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}`;

      let f = `
       
			uniform sampler2D tDiffuse;
			uniform sampler2D depthTexture;
			uniform sampler2D scanTexture;
      
      varying vec3 vPosition;

      uniform mat4 uProjectionInverse;
      uniform mat4 uMatrixWorld;
      uniform float time;

			varying vec2 vUv;
      vec3 WorldPosFromDepth(float depth){
        float z = (depth-0.5)*2.; 

        // vec2 vUv_ = (vUv*2.0)-1.0;
        // vec4 clipSpacePosition = vec4(vUv_,z,1.0);

        vec4 clipSpacePosition = vec4(vPosition.xy, z, 1.0);

        vec4 viewSpacePosition = uProjectionInverse * clipSpacePosition;
        viewSpacePosition /= viewSpacePosition.w;
        vec4 worldSpacePosition = uMatrixWorld * viewSpacePosition;
        return worldSpacePosition.xyz;
      }

			void main() {
        vec4 base = texture2D(tDiffuse, vUv);
					float depth = texture2D(depthTexture, vUv).r;
					vec3 pos = WorldPosFromDepth(depth);
					float dis = length(pos.xyz);
					vec3 color = vec3(base);
					vec3 scan = vec3(0.4,0.45,0.5);
					
          float c = fract(time) * 300.;
					float shape = smoothstep(c, c + 50.,dis) - smoothstep(c+ 80., c + 130.,dis);
					color += shape*scan;
					gl_FragColor = vec4(color, 1.); 
          
        // vec4 base =texture2D(tDiffuse,vUv);
        // float depth = texture2D(depthTexture, vUv).r * 5.; //屏幕空间深度
        // vec3 pos = WorldPosFromDepth(depth);
        // float dis = distance(pos.xz,vec2(0,0));
        // vec3 color =vec3(base);

        // // vec2 vUv_ = (vUv*2.0)-1.0;
        // // vec4 ndc=vec4(vUv_.x,vUv_.y,(depth*2.0-1.0),1.0 );
        // // vec4 worldPos = uProjectionInverse * ndc;
        // // worldPos /= worldPos.w;
        // // dis = length(vec3(worldPos.x,worldPos.y,worldPos.z));
 
        // if(dis<15.){
        //   // if(dis<1. && dis>0.5){
        //   // color = mix(base.xyz,vec3(1.),dis*0.2) ;
        //   // color.rgb += vec3(1.);
        //   // gl_FragColor = vec4(mix(base.xyz,vec3(1.),dis*0.2),1.0);
        //   // gl_FragColor = vec4(vec3(0.5),1.0);

        //   vec3 scanT = texture2D(scanTexture,pos.xz).rgb;
        //   // float wave = fract((dis-0.3)/4.);
        //   float wave = fract((dis-time)/4.);
        //   if(wave >0.7 && wave <1.){
        //     float p=(wave-0.7)/0.3;
        //     color =mix(color,scanT +0.1,p*(1.-(dis /15.)));
        //   }

        // }else{
        //   // gl_FragColor = base;
        //   // gl_FragColor = texture2D(depthTexture,vUv); 
        //   // gl_FragColor = vec4(vec3(0.5),1.0);

        // }
        

        // gl_FragColor = texture2D(depthTexture,vUv); 

        // // gl_FragColor = vec4(color * vec3(depth),1.0);
        // // gl_FragColor = vec4(vec3(dis),1.0);
        // // gl_FragColor = vec4(pos,1.0);
        // // gl_FragColor = vec4(color,1.0);

			}`;

      uniforms = {
        // baseTexture: { value: null }, //与shaderpass第二个参数同名，表示上一个渲染结果的图片。
        time: { value: 0 },
        tDiffuse: { value: null }, //shaderpass没有第二参数时，默认为 tDiffuse 表示上一个渲染结果的图片。
        depthTexture: { value: depthTexture },
        scanTexture: { value: new THREE.TextureLoader().load("./public/images/waternormals.jpg",(t)=>{
          t.repeat.set(10,10);
          t.wrapS=t.wrapT=THREE.RepeatWrapping;
        }) },

        // scanTexture: { value: new THREE.TextureLoader().load("./public/images/box.jpg",(t)=>{
        //   t.repeat.set(10,10);
        //   t.wrapS=t.wrapT=THREE.RepeatWrapping;
        // }) },

        uProjectionInverse: { value: camera.projectionMatrixInverse },
        uMatrixWorld: { value: camera.matrixWorld },  
        // uMatrixWorld: { value: camera.matrixWorldInverse },
        // cameraNear: { value: camera.near },
        // cameraFar: { value: camera.far },
        // resolution: {
        //   value: new THREE.Vector2(width,height)
        //   // value: new THREE.Vector2(renderer.domElement.offsetWidth, renderer.domElement.offsetHeight)
        // }

      };
      // const
       finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: uniforms,
          // vertexShader: document.getElementById('vertexshader').textContent,
          // fragmentShader: document.getElementById('fragmentshader').textContent,
          vertexShader: v,
          fragmentShader: f,
        })
        // , 'baseTexture'
      );


      finalComposer.addPass(renderScene);
      finalComposer.addPass(finalPass);



      // new YJshaderLX(scene,camera,depthTexture);
      // const fxaaPass = new ShaderPass(FXAAShader);
      // // fxaaPass.uniforms.resolution.value.set(width,height);
      // fxaaPass.uniforms.resolution.value.set(1 / width, 1 / height);
      // finalComposer.addPass(fxaaPass);
 
      render();
    }
    this.onWindowResize = function (w, h) {
      // const width = window.innerWidth;
      // const height = window.innerHeight; 
      finalComposer.setSize(w, h);
      render();
    }
    function render() {
      requestAnimationFrame(render);
      finalComposer.render();
      finalPass.uniforms.time.value += 1/60;
    }
    this._update = function () {
      // let uProjectionInverse = camera.projectionMatrixInverse.clone().premultiply(camera.matrixWorld.clone());
      // uniforms.uProjectionInverse.value = uProjectionInverse;
      // console.log("  uniforms.time.value ", uniforms.time.value);
      render();
      // finalPass.uniforms.time.value += 1/60;
    }
    Init();

  }
}


export { YJScanLight };