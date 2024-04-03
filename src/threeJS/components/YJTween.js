
import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';


// YJTween 组件 。 动效

// 
class YJTween {
  constructor(model) {
    let scope = this;

    function Init() {
      return;
    }
    this.Reset = function () {

    }
    let data = {
      type: "pos",//pos/rota/scale/
    };

    this.Load = function () {


    }
    //删除模型
    this.Destroy = function () {

    }
    this.SetMessage = function (_data) {
      data = _data;
      this.Load();
      let { from, to, duration, playStyle } = data;
      let _from = new THREE.Vector3(from[0], from[1], from[2]);
      let _to = new THREE.Vector3(to[0], to[1], to[2]);
      if (data.type == "pos") {
        TweenPos(_from, _to, duration * 1000, playStyle);
      }
      if (data.type == "rota") {
        TweenRota(_from, _to, duration * 1000, playStyle);
      }
      if (data.type == "scale") {
        TweenScale(_from, _to, duration * 1000, playStyle);
      }
      if (data.type == "alpha") {
        TweenAlpha(_from, _to, duration * 1000, playStyle);
      }
    }
    this.GetData = function () {

    }

    function TweenRota(from, _to, duration, playStyle, callback, update) {

      let current = from.clone();
      let to = _to.clone();

      let tween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      // let rotaTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.rotation.set(current.x, current.y, current.z);
        if (update) {
          update();
        }
      }
      tween.onUpdate(updateTargetPos);
      tween.start() // 启动动画
      tween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

      switch (playStyle) {
        case 'once':
          // tween.repeat(1);
          break;
        case 'loop':
          tween.repeat(Infinity);
          break;
        case 'pingpang':
          tween.repeat(Infinity);
          tween.yoyo(true);
          break;
        default:
          break;
      }
    }
    function TweenPos(from, _to, duration, playStyle, callback, update) {
      let current = from.clone();
      let to = _to.clone();

      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      // let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.position.set(current.x, current.y, current.z);
        if (update) {
          update();
        }
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
      switch (playStyle) {
        case 'once':
          // movingTween.repeat(1);
          break;
        case 'loop':
          movingTween.repeat(Infinity);
          break;
        case 'pingpang':
          movingTween.repeat(Infinity);
          movingTween.yoyo(true);
          break;
        default:
          break;
      }
    }

    function TweenScale(from, _to, duration, playStyle, callback, update) {
      let current = from.clone();
      let to = _to.clone();

      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      // let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.scale.set(current.x, current.y, current.z);
        if (update) {
          update();
        }
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

      switch (playStyle) {
        case 'once':
          // movingTween.repeat(1);
          break;
        case 'loop':
          movingTween.repeat(Infinity);
          break;
        case 'pingpang':
          movingTween.repeat(Infinity);
          movingTween.yoyo(true);
          break;
        default:
          break;
      }
    }
    
    function TweenAlpha(from, _to, duration, playStyle, callback, update) {
      let current = from.clone();
      let to = _to.clone();

      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      // let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.material.opacity = current.x;
          }
        });
        if (update) {
          update();
        }
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

      switch (playStyle) {
        case 'once':
          // movingTween.repeat(1);
          break;
        case 'loop':
          movingTween.repeat(Infinity);
          break;
        case 'pingpang':
          movingTween.repeat(Infinity);
          movingTween.yoyo(true);
          break;
        default:
          break;
      }
    }
    this._update = function () {
      // TWEEN.update();
      // controls.update();
      // cssRenderer.render(cssScene,_Global.YJ3D.camera);
    }
    Init();
  }
}

export { YJTween };