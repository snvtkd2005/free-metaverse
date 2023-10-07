import * as THREE from "three";

import { YJLoadModel } from "./YJLoadModel";

import TWEEN from '@tweenjs/tween.js';
import { Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// 热点模型  通过id来判断弹出的内容
// 1，模型直接可点击
// 2，进入有效区域才可交互  
// 3，进入有效区域 显示
// 4，进入有效区域 自转
// 5，
//trigger 检测区域。进入区域内、离开区域后执行事件 
// trigger 从模型中提取
// hit 点击区域、从模型中提取
// 玩家进入区域，logo 自动旋转

class YJUVanim2 {
  constructor(_this, scene, id, modelName, modelPath, pos, rota, size) {
    var scope = this;

    let group = null;

    var model = null; 

    let pointObj = [];
    // let texture = [];
    function Init() {
      group = new THREE.Group();
      scene.add(group);
      group.position.set(pos.x, pos.y, pos.z);
      group.rotation.set(rota.x, rota.y, rota.z);

      pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, 0, 0);

      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath('/js/draco/gltf/');
      // dracoLoader.setDecoderConfig({type:"js"});
      // dracoLoader.preload();
      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {
        model = gltf.scene; 
        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);
        model.scale.set(size.x, size.y, size.z);



        group.add(model);

        group.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            let map = item.material.map;
            if (map == null) {
              console.log(" 谁的贴图为空 ?  是 ", item.name);

            } else {
              pointObj.push(item);

              map.wrapS = map.wrapT = THREE.RepeatWrapping;
              map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
            }
            // console.log(" 动效贴图 ",map);

          }
        });
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.castShadow = true;
            item.receiveShadow = true;
          }
        });
      }, undefined, function (e) {
        console.log("加载模型出错"+modelPath);
        console.error(e);
      });



 

      setTimeout(() => {
        update();
      }, 1000);

    }


    //#region 
    //#endregion
 

    this.SetMessage = function (msg) { 
    } 

    Init();
    var updateId = null;
    let num = 0;
    let col = 4;
    let row = 4;
    var scaleX = 1 / 4;
    var scaleY = 1 / 4;
    var offsetx = 0;
    var loadTexDeltaTime = 0;//gif图片的加载时的计次，相当于Time.deltaTime;
    let speed = 1;
    let time = 0;
    function update() {
      updateId = requestAnimationFrame(update);
      loadTexDeltaTime++;

      time += speed * 0.02 * 4;
      num = Math.floor(time);
      if (num > col * row) {
        time = 0;
        num = 0;
      }

      let x = num % col * scaleX;
      let y = scaleY * (row - 1) - num / col * scaleY;

      for (let i = 0; i < pointObj.length; i++) {
        let texture = pointObj[i].material.map;
        // console.log(" in yj uv anim ",texture);
        texture.matrix
          .identity()
          .scale(scaleX, scaleY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
          .translate(x, y);   //每次平移量为1/17
        // .translate(scaleX * parseInt(loadTexDeltaTime / col), 
        // scaleY * parseInt(loadTexDeltaTime / row));   //每次平移量为1/17
      }
      // let texture =  pointObj.material.map;
      // texture.matrix
      //     .identity()
      //     .scale(defaultOffsetX, defaultOffsetY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
      //     .translate(defaultOffsetX * parseInt(loadTexDeltaTime / speed), 
      //     defaultOffsetY * parseInt(loadTexDeltaTime / speed));   //每次平移量为1/17
    }
  }
}


export { YJUVanim2 };