

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
        vec3 col =vec3(1,1, 1) * ((time)) ;
        // vec3 col =vec3(1,1, 1) * (sin(time)) ;
        finalColor += (col*1.) ;  
        return finalColor.r;
    } 
    vec3 emission(float time){
      vec2 uv0=vUv; 
      float noiseValue = (noise(uv0*3.));  
      
      vec3 col = vec3(0,0,1) *  ((step((noiseValue),-1.*(time) +0.03 )))  ; 
      
      // vec3 eission=(vec3(0.,.0,1.)) *smoothstep(noiseValue,noiseValue-0.2,-1.*(time) +0.03);
      // eission-=(vec3(1.)) *smoothstep(noiseValue,noiseValue-0.4,-1.*(time)+.03);
      // return eission*2.;  
      
      return col;
    }
    `;
    let fragmentShaderMain = /* glsl */ `
        void main() { 
          gl_FragColor=vec4(texture2D(mainTex, vUv).rgb,dissolve(time)); 
        }
    `;

    let last = performance.now();
    let uniforms;
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
          if (item.name.includes("collider") || item.name.includes("nameBar")) {
          } else {
            if (item.material) { 
              item.material.transparent = true;
            }
            let mat = new THREE.MeshStandardMaterial({
              map: item.material.map,
              // side: THREE.DoubleSide,
              transparent:true,
              color:item.material.color,
            });
            item.material = mat;
            materials.push({ mesh: item, mat: item.material });
          }
        }
      });

      uniforms = { 
        'time': { value: 1.0 }, 
      };
      // console.log(" 找到材质 ", materials);
      for (let i = 0; i < materials.length; i++) {
        let _ShaderMaterial = materials[i].mat; 
        // THREE.ShaderMaterial
        _ShaderMaterial.onBeforeCompile = (shader) => {
          // console.log("shader ", shader);
          
          Object.assign(shader.uniforms, uniforms)
          if(_ShaderMaterial.map == null){
            //没有贴图就没有UV，在没有UV的情况下，要增加UV 声明
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
            #include <emissivemap_fragment>
            totalEmissiveRadiance = emission(time)*3.;
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

        newMats.push({ uniforms: "uniforms", mat: _ShaderMaterial });
      }


      animate();
    }
    let updateId = null;
    function animate() {
      // console.log(" 在 溶解 shader  ",newMats);
      // console.log(" 在 溶解 shader  ", deltaTime);
      if (deltaTime == -2) {
        cancelAnimationFrame(updateId);
        return;
      }
      updateId = requestAnimationFrame(animate);
      const now = performance.now();
      let delta = (now - last) / 1000;
      deltaTime -= delta * 1;
      if (deltaTime <= -2) {
        // deltaTime = 1;
        deltaTime = -2;
      }
      last = now;
      // for (let i = 0; i < newMats.length; i++) {
      //   const element = newMats[i];
      //   element.mat.uniforms['time'].value = deltaTime;
      // }
      uniforms['time'].value = deltaTime;
    }
    init();
  }
}

export { YJshader_dissolve };