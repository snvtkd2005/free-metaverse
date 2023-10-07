


import * as THREE from "three";
 
import {
  CSS2DRenderer,
  CSS2DObject
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

class YJ2dScene {
  constructor(_this, scene, camera) {

    let renderer;
    function Init() {

      console.log("初始化 2d 场景");
      // let width = 300;
      // let height = 300; 
      let width = window.innerWidth;
      let height = window.innerHeight;
      renderer = new CSS2DRenderer();
      renderer.setSize(width, height);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0px';
      document.body.appendChild( renderer.domElement );


      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: "red", 
      });
      const object = new THREE.Mesh(geometry, material);
      object.position.set(0, 5, 0); 
      _createBox1Label(object);
      scene.add(object);
    }
    // 2d文字渲染
    function _createBox1Label(object) {
      const div = document.createElement("div");
      div.className = "red-box-label";
      div.textContent = "红色正方体";
      div.id = "red-box-label";
      const earthLabel = new CSS2DObject(div);
      earthLabel.position.set(0, 2, 0);
      object.add(earthLabel);
      earthLabel.position.set(0, 2, 0);
      console.log(" 创建2d  ");
    }

    this._update = function() {
      console.log("渲染2d");
      renderer.render(scene, camera);
    }

    Init();

  }
}

export { YJ2dScene };