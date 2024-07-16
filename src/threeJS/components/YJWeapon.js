import * as THREE from "three";


import { YJTrigger } from "./YJTrigger.js";
// 武器

class YJWeapon {
  constructor(_this, parent, transform) {
    var scope = this;

    let group = null;
    let playerHeight;
    let nameScale = 1;
    let doonce = 0;
    let navpath = [];
    let movePos = [];
    let movePosMeshList = [];
    const clock = new THREE.Clock();
    const WALKSPEED = 3;
    const RUNSPEED = 8;
    const MISSSPEED = 20;
    let playerPosition = new THREE.Vector3(0, 0, 0);

    let fromGroup;
    let animName = "";
    // 目标
    let targetModel;
    // 攻击速度，攻击间隔，判定有效的攻击时机
    let attackStepSpeed = 3; //攻击间隔/攻击速度

    const stateType = {
      Normal: 'normal',//正常状态， 待机/巡逻
      Back: 'back',//失去战斗焦点后回到初始状态 
      Fire: 'fire',//战斗 
      Dead: 'dead',//死亡 
    }

    let baseData = {
      state: 'normal', //状态
      camp: "bl",
      speed: 8, //移动速度
      level: 1, //等级
      health: 100, //生命值
      maxHealth: 100, //生命值
      strength: 20, //攻击力
    }
    function Init() {
      group = new THREE.Group();
      parent.add(group);

      // fromGroup = new THREE.Group();
      // parent.add(fromGroup);
      // fromGroup.rotation.set(Math.PI/2,0,0);
      playerPosition = parent.position;
      group.rotation.y += Math.PI;

      // group.add(new THREE.AxesHelper(5)); // 场景添加坐标轴
      // return;
      // update();

    }

    let data = null; 
    let meshTrigger = null; 
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      // console.log("in weapon msg = ", data);
      scope.transform.isIgnoreRaycast = true;
      meshTrigger = new YJTrigger(_this,parent, transform, "weapon");
      if(data.fire && data.fire.pos && data.fire.pos.length == 3){
        if(_Global.setting.inEditor){
          let axes = new THREE.AxesHelper(1);
          group.add(axes);
          let pos = data.fire.pos;
          axes.position.set(pos[0],pos[1],pos[2]);
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
 
 
    this._update = function () { 
    }
  

  }
}

export { YJWeapon };