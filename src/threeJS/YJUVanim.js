import * as THREE from "three";

import { YJLoadModel } from "./YJLoadModel";

import TWEEN from '@tweenjs/tween.js';
import { Vector3 } from "three";

// 矩形序列 A x B

class YJUVanim {
  constructor(parent, texPath, modelPath, pos, rota, size) {

    let group = null;

    let pointObj = [];


    var updateId = null;
    let num = 0;
    let col = 5;
    let row = 4;
    var scaleX = 1 / 5;
    var scaleY = 1 / 4;
    var loadTexDeltaTime = 0;//gif图片的加载时的计次，相当于Time.deltaTime;
    let speed = 1;
    let time = 0;
    function Init() {
      group = new THREE.Group();
      parent.add(group);
      group.position.set(pos.x, pos.y, pos.z);
      group.rotation.set(rota.x, rota.y, rota.z);

      pos = new THREE.Vector3(0, 0, 0);
      let rotaV3 = new THREE.Vector3(0, 0, 0);

      let _YJLoadModel = new YJLoadModel(_this, group, id, modelPath, pos, rotaV3, size, modelName,
        true, () => {
          setTimeout(() => {
            let rotaObj = _YJLoadModel.GetModel();
            rotaObj.traverse(function (item) {
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

          }, 100);
        });


    }


    let plane = null;
    function CreatePlane() {

      let planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xffffff,
      }); // 材质

      const map = new THREE.TextureLoader().load(texPath);

      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

      planeMaterial.map = map;
      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      parent.add(plane);
      plane.position.set(0, 7, 0);


      map.matrix
        .identity()
        .scale(scaleX, scaleY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
        .translate(0, 1 - scaleY);   //每次平移量为1/17
    }

    //#region 
    //#endregion

    CreatePlane();

    update();

    function update() {

      updateId = requestAnimationFrame(update);


      if (plane) {

        loadTexDeltaTime++;

        time += speed * 0.02 * 4;
        num = Math.floor(time);
        if (num > col * row) {
          time = 0;
          num = 0;
        }

        let x = num % col * scaleX;
        if (x > scaleX * (col - 1))
        {
            x = 0;
        } 


        // console.log(" in yj num / col ",num / row );
        // // let y = (num / row-1) * scaleY;
        // let y = (num / row) * scaleY;

        let y = scaleY * (row - 1) - num / col * scaleY;
        if (y < 0)
        {
            y = scaleY * (row - 1);
        } 


        console.log(" in yj uv anim ",num, x , y );
        
        let texture = plane.material.map; 
        texture.matrix
              .identity()
              .scale(scaleX, scaleY) .translate(x, 
              y );   //每次平移量为1/17


        // for (let y = row - 1; y >= 0; y--) {
        //   for (let x = 0; x < col; x++) {
        //     let texture = plane.material.map; 
        //     texture.matrix
        //       .identity()
        //       .scale(scaleX, scaleY)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
        //       .translate(x / col * parseInt(loadTexDeltaTime / speed), y / row * parseInt(loadTexDeltaTime / speed));   //每次平移量为1/17
        //     console.log(" in yj uv anim ", x / col, y / row);
        //   }
        // }


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


export { YJUVanim };