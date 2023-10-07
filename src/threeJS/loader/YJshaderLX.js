

import * as THREE from "three";


import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { YJLoadModel } from "../YJLoadModel";

/**
 动态模型合批优化： merge 、 instance
 模型本身用instance
 模型碰撞用 geometry 合并后生成
 */
class YJshaderLX {
  constructor(_this, scene) {
    let scope = this;

    let fragmentShaderPosition = `uniform float time;
    uniform float delta;

    void main()	{

      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 tmpPos = texture2D( texturePosition, uv );
      vec3 position = tmpPos.xyz;
      vec3 velocity = texture2D( textureVelocity, uv ).xyz;

      float phase = tmpPos.w;

      phase = mod( ( phase + delta +
        length( velocity.xz ) * delta * 3. +
        max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );

      gl_FragColor = vec4( position + velocity * delta * 15. , phase );

    }`;

    let fragmentShaderVelocity = `uniform float time;
    uniform float testing;
    uniform float delta; // about 0.016
    uniform float separationDistance; // 20
    uniform float alignmentDistance; // 40
    uniform float cohesionDistance; //
    uniform float freedomFactor;
    uniform vec3 predator;

    const float width = resolution.x;
    const float height = resolution.y;

    const float PI = 3.141592653589793;
    const float PI_2 = PI * 2.0;
    // const float VISION = PI * 0.55;

    float zoneRadius = 40.0;
    float zoneRadiusSquared = 1600.0;

    float separationThresh = 0.45;
    float alignmentThresh = 0.65;

    const float UPPER_BOUNDS = BOUNDS;
    const float LOWER_BOUNDS = -UPPER_BOUNDS;

    const float SPEED_LIMIT = 9.0;

    float rand( vec2 co ){
      return fract( sin( dot( co.xy, vec2(12.9898,78.233) ) ) * 43758.5453 );
    }

    void main() {

      zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
      separationThresh = separationDistance / zoneRadius;
      alignmentThresh = ( separationDistance + alignmentDistance ) / zoneRadius;
      zoneRadiusSquared = zoneRadius * zoneRadius;


      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec3 birdPosition, birdVelocity;

      vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
      vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;

      float dist;
      vec3 dir; // direction
      float distSquared;

      float separationSquared = separationDistance * separationDistance;
      float cohesionSquared = cohesionDistance * cohesionDistance;

      float f;
      float percent;

      vec3 velocity = selfVelocity;

      float limit = SPEED_LIMIT;

      dir = predator * UPPER_BOUNDS - selfPosition;
      dir.z = 0.;
      // dir.z *= 0.6;
      dist = length( dir );
      distSquared = dist * dist;

      float preyRadius = 150.0;
      float preyRadiusSq = preyRadius * preyRadius;


      // move birds away from predator
      if ( dist < preyRadius ) {

        f = ( distSquared / preyRadiusSq - 1.0 ) * delta * 100.;
        velocity += normalize( dir ) * f;
        limit += 5.0;
      }


      // if (testing == 0.0) {}
      // if ( rand( uv + time ) < freedomFactor ) {}


      // Attract flocks to the center
      vec3 central = vec3( 0., 0., 0. );
      dir = selfPosition - central;
      dist = length( dir );

      dir.y *= 2.5;
      velocity -= normalize( dir ) * delta * 5.;

      for ( float y = 0.0; y < height; y++ ) {
        for ( float x = 0.0; x < width; x++ ) {

          vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;
          birdPosition = texture2D( texturePosition, ref ).xyz;

          dir = birdPosition - selfPosition;
          dist = length( dir );

          if ( dist < 0.0001 ) continue;

          distSquared = dist * dist;

          if ( distSquared > zoneRadiusSquared ) continue;

          percent = distSquared / zoneRadiusSquared;

          if ( percent < separationThresh ) { // low

            // Separation - Move apart for comfort
            f = ( separationThresh / percent - 1.0 ) * delta;
            velocity -= normalize( dir ) * f;

          } else if ( percent < alignmentThresh ) { // high

            // Alignment - fly the same direction
            float threshDelta = alignmentThresh - separationThresh;
            float adjustedPercent = ( percent - separationThresh ) / threshDelta;

            birdVelocity = texture2D( textureVelocity, ref ).xyz;

            f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;
            velocity += normalize( birdVelocity ) * f;

          } else {

            // Attraction / Cohesion - move closer
            float threshDelta = 1.0 - alignmentThresh;
            float adjustedPercent;
            if( threshDelta == 0. ) adjustedPercent = 1.;
            else adjustedPercent = ( percent - alignmentThresh ) / threshDelta;

            f = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;

            velocity += normalize( dir ) * f;

          }

        }

      }

      // this make tends to fly around than down or up
      // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

      // Speed Limits
      if ( length( velocity ) > limit ) {
        velocity = normalize( velocity ) * limit;
      }

      gl_FragColor = vec4( velocity, 1.0 );

    }`;



    // 顶点着色器
    let vertexShader = /* glsl */ `
    
    uniform float currentFrame; //当前帧
    uniform float totalFrame;  //总帧数
    // uniform float boundingBoxRange = 0.0; 
    // uniform float boundingBoxMin = 0.0; 
    
    uniform sampler2D positionMap; 
   
    float timeDeta = 0.0;


    varying vec2 vUv;
    attribute vec2 uv2;
    void main() { 
      vUv = uv;
 
      // float pu = vUv.x;
      // float pv = 1.0 - fract( currentFrame / totalFrame );
      // vec2 shiftUv = vec2( pu, pv ); 

      // boundingBoxRange = boundingBoxMax - boundingBoxMin;

      // vec4 aniPos = texture2D( positionMap, shiftUv );
      // aniPos.xyz *= boundingBoxRange;
      // aniPos.xyz += boundingBoxMin;
 


      // vec3 transformed = aniPos.xyz;
      // vec3 transformed =  position.xyz +aniPos.xyz;
      // vec3 transformed =  position.xyz +position.xyz * aniPos.xyz;

 

      // vec3 transformed = vec4( aniPos.xyz , 1.0 );
 

      // vec3 transformed = aniPos.xyz;


      vec3 transformed = position.xyz;
      timeDeta += 0.01;
      transformed.x = position.x + timeDeta;
      
      // transformed.xz *= sin(position.y + stretch);
      // transformed.xz *= sin(position.y + time);
      // transformed.y *= sin(position.y + time);
      // transformed.y += sin(position.y *time);
      // transformed.y += sin(aniPos.w *time);
      // transformed.y += sin(time);
      // transformed = aniPos;
      //  position = newPosition;

      // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // vec4 modelPosition = modelMatrix * vec4(transformed, 1.0); 
      // vec4 viewPosition = viewMatrix * modelPosition;
      // vec4 projectedPosition = projectionMatrix * viewPosition;
      // gl_Position = projectedPosition;



      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0); 








      // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      // vec4 viewPosition = viewMatrix * modelPosition;
      // vec4 projectedPosition = projectionMatrix * viewPosition;
      // gl_Position = projectedPosition;
      // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //与上面四行等价


    }`;

    // 片元着色器
    let fragmentShader = /* glsl */ `
    varying vec4 vColor;
    varying vec2 vUv;
    uniform float currentFrame;
    uniform float totalFrame;
    // uniform vec3 color;
    uniform sampler2D mainTex;
    uniform sampler2D positionMap;
    
    uniform vec2 u_resolution;
    uniform float time;
    vec3 palette(float t){
        vec3 a=vec3(.5,.5,.5);
        vec3 b=vec3(.5,.5,.5);
        vec3 c=vec3(1.,1.,1.);
        vec3 d=vec3(.263,.416,.557);
        return a+b*cos(6.28318*(c*t+d));
    }
    void main() {
       
    //   float pu = vUv.x;
    // float pv = 1.0 - fract( currentFrame / totalFrame );
    // vec2 shiftUv = vec2( pu, pv );
    //  vec4 textureColor = texture2D( positionMap, shiftUv);

      // vec4 textureColor =  texture2D(mainTex,vUv); //使用贴图纹理

      // textureColor.rgb +=  0.2 ; //颜色整体提亮
      // gl_FragColor =textureColor ;

      // gl_FragColor = vec4(vec3(1.0,0.0,0.0),1.0);
      vec2 uv=vUv;

       uv=(uv.xy*2.-uv.xy);
    
    vec2 uv0=vUv;
    vec3 finalColor=vec3(0.);
    
    for(float i=0.;i<4.;i++){
        uv=fract(uv*1.5)-.5;
        float d=length(uv)*exp(-length(uv0));
        
        vec3 col=palette(length(uv0)+i*.4+time*.04);
        
        d=sin(d*8.+time)/8.;
        d=abs(d);
        
        d=pow(0.01/d,1.2);
        
        finalColor+=(col*d);
    }
    gl_FragColor=vec4(finalColor,1);
    

    }`;





    let birdMesh;


    const BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

    let last = performance.now();

    let uniforms;

    let currentFrame = 0;
    function init() {

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
      const geometry = new THREE.PlaneGeometry(1, 1, 10);


      // For Vertex and Fragment
      uniforms = {
        // 'color': { value: new THREE.Color(0xff2200) },

        // "size": { value: 1 },
        // 'mainTex': { value: diffaultMap },
        // 'positionMap': { value: textureAnimation },
        'time': { value: 0.0 },
        // "totalFrame": {
        //   value: VATdata.totalFrame,
        // },
        // "currentFrame": {
        //   value: 0,
        // },

        // "boundingBoxMax": {
        //   value: VATdata.posMax,
        // },

        // "boundingBoxMin": {
        //   value: VATdata.posMin,
        // },
        // 'delta': { value: 0.0 }
      };

      // THREE.ShaderMaterial
      _ShaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide

      });

      birdMesh = new THREE.Mesh(geometry, _ShaderMaterial);

      birdMesh.castShadow = true;
      birdMesh.receiveShadow = true;

      scene.add(birdMesh);
      birdMesh.visible = true;
      birdMesh.position.set(2, 1, 2);
      birdMesh.rotation.set(0, 0, 0);

      animate();

    }


    let deltaTime = 0;
    function animate() {
      // this._update = function () {


      requestAnimationFrame(animate);

      const now = performance.now();
      let delta = (now - last) / 1000;
      deltaTime += delta * 5;
      if (delta > 1) delta = 1; // safety cap on large deltas
      last = now;

      currentFrame += delta * 5;
      // currentFrame += 1;

      // 控制动画播放
      // if (_ShaderMaterial) _ShaderMaterial.uniforms['time'].value = now / 1000;
      if (_ShaderMaterial) _ShaderMaterial.uniforms['time'].value = deltaTime;

      // if (materialShader) materialShader.uniforms['delta'].value = delta;

      // predator 捕食者: 单独为鸟做的属性. 鼠标位置为捕食者，鸟会从鼠标位置散开
      // velocityUniforms['predator'].value.set(0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0);

      // mouseX = 10000;
      // mouseY = 10000;

      // gpuCompute.compute();

      // if (materialShader) materialShader.uniforms['texturePosition'].value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
      // if (materialShader) materialShader.uniforms['textureVelocity'].value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;
    }
    init();
  }
}

export { YJshaderLX };