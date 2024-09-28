
import * as THREE from "three";

import { YJWater } from "/@/threeJS/YJWater.js";
import { YJWater2 } from "/@/threeJS/YJWater2.js";

class YJShader {
  constructor(parent,model) {
    var scope = this; 

    let col = 4;
    let row = 4; 
    let time = 0;
    let speed = 2;
    let speedY = 0;

    let playing = false;

    let delay = 20; 
    
    function InitFn() {
      
 
      playing = false;

      row = data.row;
      col = data.col; 
      speed = data.speed;
      if(data.speedY != undefined && data.speedY != 0){
        speedY = data.speedY;
      }
      delay = data.delay;

      // 黑色背景的图片
      // if (data.isBlack != undefined && data.isBlack) {
      //   material.blending = THREE.AdditiveBlending;
      // }

      // let map = null;
      // if(data.map){
      //   map = new THREE.TextureLoader().load(_this.$uploadUVAnimUrl + data.map);
      //   map.encoding = 3001;
      //   map.wrapS = map.wrapT = THREE.RepeatWrapping;
      //   map.repeat.set(row, col);
      //   map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
      // }else{
      //   model.traverse(function (item) {
      //     if (item instanceof THREE.Mesh) { 
      //       map = item.material.map ;
      //       map.wrapS = map.wrapT = THREE.RepeatWrapping;
      //       map.repeat.set(row, col);
      //       map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually
      //     }
      //   });
      // } 
 
      // if (data.color) {
      //   material.color.set(data.color);
      // }
      
      if(speed != 0 || speedY != 0){
        setTimeout(() => {
          playing = true;
        }, 20);
      }
 
      let size = scope.transform.GetData().scale;
      // console.log(" model ",model);
      // console.log(" size ",size);
      if(data.shaderType == "river"){
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            // console.log(" item ",item);
            // console.log(" item.geometry ",item.geometry);
            new YJWater( parent, item, 
              new THREE.Vector2(10*size.x, 10*size.z), 
              // new THREE.Vector2(12, 12), 
              0.1, 
              new THREE.Vector3(0, 0.051, 0),
              0.01);
          }
        }); 
        
        model.visible = false;

      }

      if(data.isLookatCam){
        _Global.YJ3D._YJSceneManager.AddLookatHotPoint(model);
      }
    }
    let data = null;
    this.SetMessage = function ( msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      // console.log("in shader msg = ", data);
      InitFn();
    }

    this.GetData = function () {
      return data;
    }

    //删除模型
    this.Destroy = function () { 
      _Global.YJ3D._YJSceneManager.RemoveLookatHotPoint(model);
    }

    //#region 
    //#endregion

    let numY = 0;
    let numX = 0;
    let oldNum = 0;

    this._update = () => { 

      if (playing) { 
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


export { YJShader };