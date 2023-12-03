import * as THREE from "three";


import { YJTrigger } from "./YJTrigger.js";
// 交互模型、道具

class YJInteractive {
  constructor(_this, parent, transform) {
    var scope = this;

    let group = null;

    function Init() {
      group = new THREE.Group();
      parent.add(group); 
      // group.add(new THREE.AxesHelper(5)); // 场景添加坐标轴 
    }

    let data = null;
    let meshTrigger = null;
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      console.log("in Interactive msg = ", data);

      scope.transform.isIgnoreRaycast = true;

      meshTrigger = new YJTrigger(_this, parent, transform, "interactive"); 
      let map = _this._YJSceneManager.checkLoadTexture(_this.$uploadUVAnimUrl + data.imgPath);
      const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
      setTimeout(() => { 
        let sprite = new THREE.Sprite(material);
        sprite.center.set(0.5, 0.5); 
        sprite.scale.set(1, 1, 1);
        group.add(sprite);
        sprite.transform = transform;
      }, 1000);
    }

    //#endregion 


    this.Reset = function () {
      setTimeout(() => {
        meshTrigger.CreateTrigger();
      }, 500);
    }

    //销毁组件
    this.Destroy = function () {
      parent.remove(group);
    }
    this.DestroyTrigger = function () {
      meshTrigger.Destroy();
    } 
    // 接收同步
    this.Dync = function (msg) {
      console.log("接收 道具 同步数据 ", msg);
      // if (msg.display) { 
      //   return;
      // }
      if(msg.display!=undefined){
        scope.transform.SetActive(msg.display);
      }

    }
    Init(); 

  }
}

export { YJInteractive };