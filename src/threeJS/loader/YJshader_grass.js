

import * as THREE from "three";


import generateBlade from "./generateBlade.ts";
import { shader as vertexShader } from "/@/threeJS/shaders/grass/vertex.js";
import { shader as fragmentShader } from "/@/threeJS/shaders/grass/fragment.js";

// import vertexShader from "/@/threeJS/shaders/grass/vertex.js";
// import fragmentShader from "/@/threeJS/shaders/grass/fragment.js";
import {
  BufferAttribute,
  BufferGeometry,
  RepeatWrapping,
  ShaderMaterial,
  Uniform,
  Vector3,
} from "three";

/**
 扫光shader
 */
class YJshader_grass {
  constructor(scene) { 
    const bladeCount = 400000;
    const planeSize = 100;
    // shield
    const textureLoader = new THREE.TextureLoader()
    const grass = textureLoader.load('./public/images/grass.jpg')
    const cloud = textureLoader.load('./public/images/cloud.jpg')
    cloud.wrapS = cloud.wrapT = THREE.RepeatWrapping;
    let uniforms = {
      uGrassTexture: { type: "sampler2D", value: grass },
      uCloudTexture: { type: "sampler2D", value: cloud }, 
      uTime: { value: 0.0 },
    };
    const GrassMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    });
    // 生成草地几何体
    function getgeometry() {
      const positionsArray = [];
      const uvArray = [];
      const colorArray = [];
      const indiceArray = [];

      for (let i = 0; i < bladeCount; i++) {
        const radius = planeSize / 2;
        const r = radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);

        const blade = generateBlade(
          new Vector3(x, 0, z),
          i * 5,
          [x / planeSize + 0.5, z / planeSize + 0.5],
          0.4
        );
        blade.verts.forEach((vert) => {
          positionsArray.push(...vert.pos);
          uvArray.push(...vert.uv);
          colorArray.push(...vert.color);
        });
        blade.indices.forEach((indice) => indiceArray.push(indice));
      }

      const geom = new BufferGeometry();
      geom.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(positionsArray), 3)
      );
      geom.setAttribute("uv", new BufferAttribute(new Float32Array(uvArray), 2));
      geom.setAttribute(
        "color",
        new BufferAttribute(new Float32Array(colorArray), 3)
      );
      geom.setIndex(indiceArray);
      geom.computeVertexNormals();

      return geom;
    }
    function init() {
      const postQuad = new THREE.Mesh(getgeometry(), GrassMaterial);
      scene.add(postQuad);
      animate();

    }
    this._update = function () {

    }

    let deltaTime = 1;
    let last = performance.now();
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
      if (GrassMaterial) uniforms.uTime.value = deltaTime;
      // if (_ShaderMaterial) _ShaderMaterial.uniforms['u_time'].value = deltaTime;
      // console.log(deltaTime);
    }
    init();
  }
}

export { YJshader_grass };