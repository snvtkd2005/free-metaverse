import * as THREE from "three";


import { YJTrigger } from "./YJTrigger.js";
// 武器

class YJWeapon {
  constructor(_this, parent, transform) {
    var scope = this;

    let group = null; 
    function Init() {
      group = new THREE.Group();
      parent.add(group);
      group.rotation.set(0,0,0); 
    }

    let data = null; 
    let meshTrigger = null; 
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      // console.log("in weapon msg = ", data);
      scope.transform.isIgnoreRaycast = true;

      if(meshTrigger != null){
        this.DestroyTrigger();
      }
      meshTrigger = new YJTrigger(_this,parent, transform, "weapon");
      if(data.fire && data.fire.pos && data.fire.pos.length == 3){
        if(_Global.setting.inEditor){
          if(group.firePosAxes){
            group.remove(group.firePosAxes);
          }
          let axes = new THREE.AxesHelper(1);
          group.firePosAxes = axes;
          group.add(axes);
          let pos = data.fire.pos;
          axes.position.set(pos[0],pos[1],pos[2]);
          if(data.fire.rotaV3 && data.fire.rotaV3.length == 3){
            let rotaV3 = data.fire.rotaV3;
            axes.rotation.set(rotaV3[0],rotaV3[1],rotaV3[2]);
          }
        }
      }
      // object.AddComponent("Trigger", meshTrigger);
    }
 
 
    //#endregion
    this.Start = function () {
       
    }



 
    this.Reset = function () {
      setTimeout(() => {
        meshTrigger.CreateTrigger();
      }, 2000);
    }

    //销毁组件
    this.Destroy = function () { 
      this.DestroyTrigger();
      parent.remove(group);
    }
    this.DestroyTrigger = function () {
      meshTrigger.Destroy();
    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(group.position, group.rotation);
    }

    Init(); 

  }
}

export { YJWeapon };