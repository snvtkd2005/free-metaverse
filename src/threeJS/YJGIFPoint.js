import * as THREE from "three";

import { YJAnimModel } from "./loader/YJAnimModel";
import { YJLoadModel } from "./YJLoadModel";

import TWEEN from '@tweenjs/tween.js';
import { Vector3 } from "three";
import { YJVideo } from "./YJVideo";

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

class YJGIFPoint {
  constructor(_this, scene, id, gifPath, pos, size, gifData, callback) {
    var scope = this;

    let group = null;

    let pointObj = null;

    var defaultOffsetX = 1 / 17;
    let speed = 2;
    var loadTexDeltaTime = 0;//gif图片的加载时的计次，相当于Time.deltaTime;

    let playing = false;

    let delay = 20;

    // 获取模型准备移动
    this.GetModel = function () {
      return group;
    }
    this.GetGroup = function () {
      return group;
    }

    this.GetId = function () {
      return id;
    }

    this.SetPointVisible = function (b) {
      Display(b);
    }
    this.Destroy = function () {
      _this._YJSceneManager.clearGroup(group);
      scene.remove(group);
    }
    // 设置热点隐藏，让其不可显示和不可被点击
    this.SetPointObjDisplay = function (b) {
      Display(b);
    }
    function Display(b){
      if(pointObj == undefined){return;}
      group.visible = b;
      playing = b;
      loadTexDeltaTime = 0;
      var texture = pointObj.material.map;
      texture.matrix
        .identity()
        .scale(defaultOffsetX, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
        .translate(defaultOffsetX * parseInt(loadTexDeltaTime / speed), 0);   //每次平移量为1/17

    }
    this.SetHitObjDisplay = function (b) {
    }
    
    function Init() {
      if (gifData != undefined) {
        defaultOffsetX = 1 / gifData.defaultOffsetX;
        speed = gifData.speed;
        delay = gifData.delay;
      }
      // console.error(gifData);

      group = new THREE.Group();
      scene.add(group);
      group.position.set(pos.x, pos.y, pos.z);
      CreatePlane();

      _this._YJSceneManager.addHotPointJS(scope);

    }

    function CreatePlane() {

      let planeGeometry = new THREE.PlaneBufferGeometry(size, size, 1, 1); // 生成平面
      let material = new THREE.MeshBasicMaterial({
        // alphaTest:false,
        transparent: true,
        // depthTest: false, //在所有模型最前端渲染
        depthWrite: false, // 透明物体之间不相互遮挡
        // color: 0xffffff,
      }); // 材质

      material.blending = THREE.AdditiveBlending;
      const map = new THREE.TextureLoader().load(
        // _this.GetPublicUrl() + "hotpoint.png"
        _this.GetPublicUrl() + gifPath
        // _this.GetPublicUrl() + "new_spotd07_gif.png"
        // _this.GetPublicUrl() + "giftest.gif" //不支持gif
        // _this.GetPublicUrl() + "cokeAnim.webp" //不支持webp
      );
      map.encoding = 3001;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

      map.matrix
        .identity()
        .scale(defaultOffsetX, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
        .translate(defaultOffsetX * parseInt(loadTexDeltaTime / speed), 0);   //每次平移量为1/17

      material.map = map;
      pointObj = new THREE.Mesh(planeGeometry, material);
      group.add(pointObj);
      _this._YJSceneManager.AddLookatHotPoint(pointObj);

      _this._YJSceneManager.AddNeedUpdateJS(scope);

      setTimeout(() => {
        playing = true;
      }, delay);
    }
    Init();

    // update();
    // var updateId = null;
    this._update = function () {
      // updateId = requestAnimationFrame(update);

      if (playing) {
        if (pointObj) {
          loadTexDeltaTime++;

          var texture = pointObj.material.map;
          texture.matrix
            .identity()
            .scale(defaultOffsetX, 1)        //sprite  序列分为17*1，所以缩放为x=1/17 , y=1
            .translate(defaultOffsetX * parseInt(loadTexDeltaTime / speed), 0);   //每次平移量为1/17

          if (loadTexDeltaTime / speed >= 1 / defaultOffsetX) {
            playing = false;
            loadTexDeltaTime = 0;
            setTimeout(() => {
              playing = true;
            }, delay);
          }
        }
      }
    }
  }
}


export { YJGIFPoint };