

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
  constructor(_this, scene, camera, renderer) {
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

    function createSphere(radius, pos) {
      const geometry = new THREE.SphereGeometry(radius, 20, 20);
      let mat = new THREE.MeshBasicMaterial(
        // let mat = new THREE.MeshStandardMaterial(
        {
        color: 0x333333,
        side: THREE.DoubleSide,
        transparent: true,
      });
      mesh = new THREE.Mesh(geometry, mat);
      // mesh.castShadow = true;
      // mesh.receiveShadow = true;
      scene.add(mesh);
      mesh.visible = true;
      if (pos) {
        mesh.position.copy(pos);
      } else {
        mesh.position.set(-1, 0, 0);
      }
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
      setupRenderTarget();
      createSphere(1, new THREE.Vector3(2, 1, 1));

      // Setup post-processing step
      setupPost();
      _ShaderMaterial = createSphere(2,new THREE.Vector3(1, 1, 1));
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
        'range': { value: 1.0 },
        "cameraNear": { value: camera.near },
        "cameraFar": { value: camera.far },
        "tDiffuse": { value: null },
        "tDepth": { value: null },
        "cameraPosX": { value: 0.1 },
        "cameraPosY": { value: 0.1 },
        "cameraPosZ": { value: 0.1 },

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
          varying vec3 vViewPosition;
			    varying vec2 vUv;
          uniform float cameraPosX;
          uniform float cameraPosY;
          uniform float cameraPosZ;
          `
        );

        shader.vertexShader = shader.vertexShader.replace(
          '#include <uv_vertex>',
          `
          #include <uv_vertex>  
          vUv = uv;
          vec4 modelPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -(viewMatrix * modelMatrix * vec4(position, 1.0)).xyz;
          float x = modelPosition.x;
          float y = modelPosition.y;
          float z = modelPosition.z;

          depth = sqrt(pow((x-cameraPosX),2.) + pow((y-cameraPosY),2.) +pow((z-cameraPosZ),2.) );
          // depth = distance(modelPosition.xyz,vec3(0.,3.,0.)); 
          // depth = distance( modelPosition.xyz,vec3(cameraPosX,cameraPosY,cameraPosZ)); 
          `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `
          #include <common>  
          varying float depth; 
			    varying vec2 vUv;
          
          varying vec3 vViewPosition;
	        varying vec3 vWorldPosition;  
          `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <map_pars_fragment>',
          `
          #include <map_pars_fragment>  
          uniform float range;
          
          uniform sampler2D tDepth;
          uniform float cameraNear;
          uniform float cameraFar;
          
          uniform float cameraPosX;
          uniform float cameraPosY;
          uniform float cameraPosZ;

          // float readDepth( sampler2D depthSampler, vec2 coord ) {
          //   float fragCoordZ = texture2D( depthSampler, coord ).x;
          //   float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
          //   // return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
          //   return viewZ;
          // }

          float getEyeDepth(sampler2D depthSampler,vec2 coord) {
            float z = texture2D(depthSampler, coord).x;
            float depth = z ;
            vec2 wh = vec2(g_ViewPort.z - g_ViewPort.x, g_ViewPort.w - g_ViewPort.y);
            vec4 screenPos = vec4(gl_FragCoord.x/wh.x, gl_FragCoord.y/wh.y, depth, 1.0) * 2.0 - 1.0;
            vec4 viewPosition = projectionMatrix * screenPos;
            z = -(viewPosition.z / viewPosition.w); // 得到相机与顶点的距离，正值>0
            // 得到相机坐标
            viewPosition = viewPosition / viewPosition.w;
            // 得到世界坐标
            vec4 worldCoord = viewMatrix * viewPosition;
            return worldCoord;
            } 
           `
          //  fragmentShaderDef
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <output_fragment>',
          `  
          vec3 _vViewPosition = vViewPosition; 
          float _multiply = (_vViewPosition.z * -1. );

          // scenedepth 
          // float depth = gl_FragCoord.z / gl_FragCoord.w;
          // float depth = readDepth( tDepth, vUv );
          float depth = getEyeDepth( tDepth, vUv );

          // subtract 相减
          float _subtract = (depth - _multiply);
          float _saturate = saturate( _subtract * range);
          float oneMinus = 1.-_saturate ; 
          vec3 color = vec3(0.,1.0,.0); 
          outgoingLight = color * oneMinus ;  
          

          // outgoingLight = vec3(_vViewPosition.z); 
          // outgoingLight = vec3(1.) * depth*0.1; 
          // outgoingLight = vec3(depth); 
          // outgoingLight = vec3(1.-depth); 
           
          // gl_FragColor = vec4( outgoingLight,1.-depth );
          gl_FragColor = vec4( outgoingLight,oneMinus );
          // gl_FragColor = vec4( outgoingLight,1.-_vViewPosition.x  );
          `
        );

      }

      console.log("_ShaderMaterial ", _ShaderMaterial);

      setTimeout(() => {

        // _YJshader_dissolve = new YJshader_dissolve(_Global.YJ3D.YJPlayer.GetPlayerGroup());
        // _YJshader_dissolve = new YJshader_dissolve(mesh);
      }, 2000);



      animate();

    }
    const params = {
      format: THREE.DepthFormat,
      type: THREE.UnsignedShortType
    };
    let target;

    let postScene, postCamera, postMaterial;
    function setupRenderTarget() {

      if (target) target.dispose();

      const format = parseFloat(params.format);
      const type = parseFloat(params.type);

      target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.DepthStencilFormat,
      });
      target.stencilBuffer = (format === THREE.DepthStencilFormat) ? true : false;
      target.depthTexture = new THREE.DepthTexture();
      target.depthTexture.format = format;
      target.depthTexture.type = type;

      const dpr = renderer.getPixelRatio();
      target.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
    }

    function setupPost() {

      // Setup post processing stage
      postCamera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);

      // postCamera = new THREE.PerspectiveCamera(
      //   60,
      //   window.innerWidth /  window.innerHeight,
      //   0.1,
      //   1000
      // );

      postMaterial = new THREE.ShaderMaterial({
        vertexShader:
          `varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader:
          `#include <packing>

          varying vec2 vUv;
          uniform sampler2D tDiffuse;
          uniform sampler2D tDepth;
          uniform float cameraNear;
          uniform float cameraFar;
    
    
          float readDepth( sampler2D depthSampler, vec2 coord ) {
            float fragCoordZ = texture2D( depthSampler, coord ).x;
            float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
            return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
          }
    
          void main() {
            // vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
            float depth = readDepth( tDepth, vUv );
    
            // gl_FragColor.rgb =   vec3( depth );
            gl_FragColor.rgb = 1.0 - vec3( depth );
            gl_FragColor.a = 0.2;
          }
          `,
        uniforms: {
          cameraNear: { value: camera.near },
          cameraFar: { value: camera.far },
          tDiffuse: { value: null },
          tDepth: { value: null }
        }
      });
      const postPlane = new THREE.PlaneGeometry(0.5, 0.5);
      const postQuad = new THREE.Mesh(postPlane, postMaterial);
      postScene = new THREE.Scene();
      postScene.add(postQuad);
      postScene.add(postCamera);
      let pos = camera.getWorldPosition(new THREE.Vector3());
      let quat = camera.getWorldQuaternion(new THREE.Quaternion());
      postCamera.position.copy(pos);
      postCamera.quaternion.copy(quat);
      postQuad.position.set(1, 1, 1);
    }

    this.SetUniform = function (msg) {
      uniforms[msg.p].value = msg.v;
    }

    let deltaTime = 1;
    function animate() {
      requestAnimationFrame(animate);

      // renderer.setRenderTarget(target);
      // renderer.render(scene, camera);
      if (_ShaderMaterial) {
        // uniforms.tDiffuse.value = target.texture;
        // uniforms.tDepth.value = target.depthTexture;
        uniforms['tDiffuse'].value = target.texture;
        uniforms['tDepth'].value = target.depthTexture;

        let pos = camera.getWorldPosition(new THREE.Vector3());
        uniforms['cameraPosX'].value = pos.x;
        uniforms['cameraPosY'].value = pos.y;
        uniforms['cameraPosZ'].value = pos.z;


      }


      // postMaterial.uniforms.tDiffuse.value = target.texture;
      // postMaterial.uniforms.tDepth.value = target.depthTexture;

      // renderer.setRenderTarget(null);
      
      // let pos = camera.getWorldPosition(new THREE.Vector3());
      // let quat = camera.getWorldQuaternion(new THREE.Quaternion());
      // postCamera.position.copy(pos);
      // postCamera.quaternion.copy(quat);
      // renderer.render(postScene, camera);

      // const now = performance.now();
      // let delta = (now - last) / 1000;
      // deltaTime -= delta * 1;
      // if (deltaTime <= -2) {
      //   deltaTime = 1;
      // }
      // last = now;
      // // 控制动画播放 
      // if (_ShaderMaterial) {
      //   uniforms['time'].value = deltaTime;
      // }
      // if (_ShaderMaterial) _ShaderMaterial.uniforms['time'].value = deltaTime;
      // console.log(deltaTime);
    }
    init();
  }
}

export { YJshaderLX };