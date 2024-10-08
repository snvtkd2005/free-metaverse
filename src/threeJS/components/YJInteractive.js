import * as THREE from "three";


import { YJTrigger } from "./YJTrigger.js";
// 交互模型、道具

class YJInteractive {
  constructor( parent, transform) {
    var scope = this;

    let group = null;

    function Init() {
      group = new THREE.Group(); 
      parent.add(group); 
      // group.add(new THREE.AxesHelper(5)); // 场景添加坐标轴 
    }
    this.SetDisplay = function(b){
      group.visible = b;
    }

    let data = null;
    let meshTrigger = null;
    let sprite = null;
    let spriteLater = null;
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      // console.log("in Interactive msg = ", data);

      scope.transform.isIgnoreRaycast = true;
      if(meshTrigger == null){
        meshTrigger = new YJTrigger( parent, transform, "interactive",data.volume); 
      }

      // 默认延迟显示sprite.如果需要不显示sprite,则在生成时，立即调用DestroySprite函数
      spriteLater = setTimeout(() => {
        if(sprite != null){
          group.remove(sprite);
        }
        let map = _Global.YJ3D._YJSceneManager.checkLoadTexture(_Global.url.uploadUVAnimUrl + data.imgPath);
        const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff });
        setTimeout(() => { 
          sprite = new THREE.Sprite(material);
          sprite.center.set(0.5, 0.5); 
          sprite.scale.set(1, 1, 1);
          group.add(sprite);
          sprite.transform = transform;
        }, 100);
      }, 100);
    }
    this.DestroySprite = function(){
      if(sprite != null){
        group.remove(sprite);
      }
      clearTimeout(spriteLater);
    }

    //#endregion 


    this.Reset = function () {
      if(meshTrigger==null){
        return;
      }
      setTimeout(() => {
        meshTrigger.CreateTrigger();
      }, 500);
    }

    //销毁组件
    this.Destroy = function () {
      parent.remove(group);
    }
    this.DestroyTrigger = function () {
      if(meshTrigger==null){
        return;
      }
      meshTrigger.Destroy();
    } 
    // 接收同步
    this.Dync = function (msg) {
      // console.log("接收 道具 同步数据 ", msg);
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