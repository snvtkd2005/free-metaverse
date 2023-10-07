import * as THREE from "three";


import TWEEN, { update } from '@tweenjs/tween.js';

import { YJMusicRhythm } from "./YJMusicRhythm.js";

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


class YJ3dScene {
  constructor(container, _this) {

    let scene;
    let renderer;
    let camera;
    let _YJController = null;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let group;
    let width, height;
    let playerGroup;
    let _YJMusicRhythm = null;
    Init();
    function Init() {
      console.log("初始化小窗3d场景");
      scene = new THREE.Scene(); // 场景
      // let width = 300;
      // let height = 300;
      width = container.clientWidth;
      height = container.clientHeight;
      // let width = window.innerWidth;
      // let height = window.innerHeight;
      camera = new THREE.PerspectiveCamera(
        60,
        width / height,
        0.01,
        10000
      );
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 渲染器
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true; // 开启阴影
      renderer.setPixelRatio(2); //推荐

      //环境光
      var ambient = new THREE.AmbientLight(0xffffff); //添加环境光
      scene.add(ambient); //光源添加到场景中



      // ground 开始--------------

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200, 20, 20),
        new THREE.MeshStandardMaterial({
          color: 0x666666,
          // color: 0xDDFF8D, 
        })
      );
      mesh.position.y = 0.000;
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      mesh.name = "floor";
      scene.add(mesh);


      camera.position.set(0, 5, 0);
      camera.rotation.set(-Math.PI / 2,0 , Math.PI);
      // camera.rotation.set(0,-Math.PI/2,0);
      // console.log(container);
      container.append(renderer.domElement);


      // new YJMusicRhythm(this,this.$refs.YJmetaBase.ThreejsHumanChat.scene);
      _YJMusicRhythm = new YJMusicRhythm(_this, scene);



      update();
    }

    const params = {
      color: 0xffffff,
    };

    CreateGUI();

    function CreateGUI() {
      const gui = new GUI();
      gui.addColor(params, 'color').listen().onChange(function () {

        _YJMusicRhythm.SetBoardColor(_this.changeColor(params.color));
        // 十进制转16进制
        console.log("change color = " +  params.color.toString(16));
      });

    }
    this.getCanvasImg = function () {
      // console.log(" get threeJS canvas ");
      renderer.setSize(150, 150);
      renderer.setPixelRatio(1); //推荐
      let canvas = renderer.domElement;
      renderer.render(scene, camera);
      setTimeout(() => {
        ResetRender();
      }, 200);
      return canvas.toDataURL("image/jpeg");
    }
    function ResetRender() {
      renderer.setSize(width, height);
      renderer.setPixelRatio(2); //推荐
    }

    this.update = function () {
      renderer.render(scene, camera);
    }
  }
}

export { YJ3dScene };