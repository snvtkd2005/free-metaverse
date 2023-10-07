



import * as THREE from "three";

import { YJLoadModel } from "../YJLoadModel.js";

import { YJMapManager } from "../YJMapManager.js";

import { YJAmmo } from "../YJAmmo.js";

import { GetCurrentTime } from "/@/utils/api.js";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


import Stats from 'three/examples/jsm/libs/stats.module.js';
import { nextTick } from "vue";
import { YJNPC } from "../YJNPC.js";
import { YJCurve } from "../YJCurve.js";
import { YJMinMap } from "../YJMinMap.js";
import { YJLoadModelManager } from "../YJLoadModelManager.js";

// 整体场景辉光 管理器
import { YJBloomManager } from "../YJBloomManager.js";
// 可设置单个模型辉光 管理器
import { YJBloomManager2 } from "../YJBloomManager2.js";
import { YJChangeManager } from "../YJChangeManager.js";
import { YJSandboxManager } from "../YJSandboxManager.js";
import { YJTransformManager } from "../YJTransformManager.js";
import { YJReflect } from "../YJReflect.js";
import { GetDateH } from "/@/utils/utils.js";
import { YJKeyboard } from "../YJKeyboard.js";

import { YJVideo } from "../YJVideo";
import { YJSqeImage } from "../YJSqeImage.js";
import { YJUVanim } from "../YJUVanim.js";

import { YJPathfinding } from "../pathfinding/YJPathfinding.js";
import { TextureLoader } from "three";
import { YJReflectMirror } from "../YJReflectMirror.js";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

class SceneManager_MaterialSetting {
  constructor(scene, renderer, camera, _this) {
    let scope = this;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    const params = {
      color: 0xffffff,
      transmission: 1,
      opacity: 1,
      metalness: 0,
      roughness: 0,
      ior: 1.5,
      thickness: 0.01,
      specularIntensity: 1,
      specularColor: 0xffffff,
      envMapIntensity: 1,
      lightIntensity: 1,
      exposure: 1
    };
    var material ;
    this.Init = function () {

      InitFn();
    }


    function InitFn() {

      const hdrEquirect = new RGBELoader()
        .setPath(_this.GetPublicUrl())
        .load('089.hdr', function () {
          hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
          render();
        });

        let  Physicalmaterial = new THREE.MeshPhysicalMaterial({
        color: params.color,
        metalness: params.metalness,
        roughness: params.roughness,
        ior: params.ior,
        // alphaMap: texture,
        envMap: hdrEquirect,
        envMapIntensity: params.envMapIntensity,
        transmission: params.transmission, // use material.transmission for glass materials
        specularIntensity: params.specularIntensity,
        specularColor: params.specularColor,
        opacity: params.opacity,
        side: THREE.DoubleSide,
        transparent: true
      });

      material = Physicalmaterial;

      const gui = new GUI();


      gui.addColor(params, 'color')
        .onChange(function () {

          material.color.set(params.color);
          render();

        });

      gui.add(params, 'transmission', 0, 1, 0.01)
        .onChange(function () {

          material.transmission = params.transmission;
          render();

        });

      gui.add(params, 'opacity', 0, 1, 0.01)
        .onChange(function () {

          material.opacity = params.opacity;
          render();

        });

      gui.add(params, 'metalness', 0, 1, 0.01)
        .onChange(function () {

          material.metalness = params.metalness;
          render();

        });

      gui.add(params, 'roughness', 0, 1, 0.01)
        .onChange(function () {

          material.roughness = params.roughness;
          render();

        });

      gui.add(params, 'ior', 1, 2, 0.01)
        .onChange(function () {

          material.ior = params.ior;
          render();

        });

      gui.add(params, 'thickness', 0, 5, 0.01)
        .onChange(function () {

          material.thickness = params.thickness;
          render();

        });

      gui.add(params, 'specularIntensity', 0, 1, 0.01)
        .onChange(function () {

          material.specularIntensity = params.specularIntensity;
          render();

        });

      gui.addColor(params, 'specularColor')
        .onChange(function () {

          material.specularColor.set(params.specularColor);
          render();

        });

      gui.add(params, 'envMapIntensity', 0, 1, 0.01)
        .name('envMap intensity')
        .onChange(function () {

          material.envMapIntensity = params.envMapIntensity;
          render();

        });

      gui.add(params, 'exposure', 0, 1, 0.01)
        .onChange(function () {

          renderer.toneMappingExposure = params.exposure;
          render();

        });

      gui.open();

      window.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mouseup', onPointerUp);

      return;
    }
    
    var clickMousePosX = 0;
    var clickMousePosY = 0;
    function onPointerDown(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      clickMousePosX = mouse.x;
      clickMousePosY = mouse.y;
    }
    function onPointerUp(event) {
      // console.log(event.target);
      // console.log(" player pos = >", pos);

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      //鼠标点是否有位移，判断是否为滑动
      if (clickMousePosX != mouse.x || clickMousePosY != mouse.y) {
        return;
      }

      raycaster.setFromCamera(mouse, camera);
      const found = raycaster.intersectObjects(scene.children, true);
      // console.log(found);
      if (found.length > 0) {
        let all = "";
        for (let i = 0; i < found.length; i++) {
          const hitObj = found[i].object;
          if (hitObj.isMesh) {
            all += hitObj.name + "、";
            // material.map =   hitObj.material.map;
            hitObj.material = material;
            console.log(" 点击模型 ", all);

            return;
            // all += hitObj.material.name +  "、";
          }
        }
        console.log(" 鼠标位置的模型 ", all);

      }

    }
    

    //实时刷新
    function render() {
      // requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    InitFn();
  }
}

export { SceneManager_MaterialSetting };