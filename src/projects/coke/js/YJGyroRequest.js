



import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

import { YJGyro } from "/@/threeJS/YJGyro.js";

class YJGyroRequest {
  constructor(_this, callback) {
    let scope = this;
    let _YJGyro = null;
    let canGyro = false;
    let inGyro = false;

    let hasRequestDevice = false;


    function denied() {
      hasRequestDevice = true;
      if (callback) {
        callback(inGyro);
      }
    }


    this.SetEnabled = function (b) {
      if (b) {
        if (canGyro) {
          doonce = 0;
          inGyro = true;
        }
      } else {
        if (canGyro) {
          inGyro = false;
          _this.YJController.ChangeCtrlState();
        }

      }
    }


    let mouseX = 0;
    let mouseY = 0;
    let mouseZ = 0;

    let mouseXold = 0;
    let mouseYold = 0;
    let mouseZold = 0;

    let doonce = 0;
    function granted() {
      hasRequestDevice = true;

      //禁止摄像机控制上下旋转
      // _this.SetCanAddControllerListner(false);
      // _this.removeEventListener();

      // _YJGyro = new YJGyro(null, _this.camera);

      _YJGyro = new YJGyro(null, null, (quat) => {
        if (!inGyro) { return; }
        let v = new THREE.Euler();
        v.setFromQuaternion(quat);

        mouseX = v.x;
        mouseY = v.y;
        mouseZ = v.z;
        if (doonce < 1) {
          _this.YJController.ResetCamTarget();

          mouseXold = mouseX;
          mouseYold = mouseY;
          mouseZold = mouseZ;
          doonce++;
        }

        var x = mouseX - mouseXold;
        var y = mouseY - mouseYold;
        var z = mouseZ - mouseZold;

        // _Global.AddLog("x:"+v.x);
        // _Global.AddLog("y:"+v.y);
        // _Global.AddLog("z:"+v.z);
        // _Global.AddLog("x delta :" + x);
        // _Global.AddLog("y delta:" + y);
        // _Global.AddLog("z delta:" + z);
        // _this.YJController.RotaCamera(y,x);
        // _this.YJController.RotaCamera(v.y,v.x);
        _this.YJController.RotaCameraQuat(quat);

      });
      inGyro = true;
      canGyro = true;
      // this._YJControllerRota = new YJControllerRota(this.$refs.YJmetaBase.ThreejsHumanChat.GetThreeDocument(), this);

      // window.addEventListener('devicemotion', this.onDeviceMotion, false); //加速度
      window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
      window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
      if (callback) {
        callback(inGyro);
      }

    }

    function InitFn() {
      addListen();
    }
    // 监听陀螺仪 加速度
    function addListen() {
      // 陀螺仪
      // 陀螺仪 
      // window
      _this.AddThreeDocumentListener(() => {
        if (!hasRequestDevice) {
          console.log("点击 threejs 请求授权陀螺仪 ");

          if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
            window.DeviceOrientationEvent.requestPermission().then(state => {
              switch (state) {
                case "granted":
                  granted();
                  break;
                case "denied":
                  denied();
                  break;
              }
            });
          }

        }
      });

      if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        window.DeviceOrientationEvent.requestPermission().then(state => {
          switch (state) {
            case "granted":
              granted();
              break;
            case "denied":
              denied();
              break;
          }
        });
      }


      let agent = navigator.userAgent.toLowerCase();
      console.log("agent ", agent);
      let android = agent.indexOf("android");
      if (android != -1) {
        granted();
      }


      // window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
      // window.addEventListener( 'orientationchange',  onScreenOrientationChangeEvent, false );
    }

    this.Request = function () {

      console.log(" 请求授权陀螺仪 ");
      if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        window.DeviceOrientationEvent.requestPermission().then(state => {
          switch (state) {
            case "granted":
              granted();
              break;
            case "denied":
              denied();
              break;
          }
        });
      } else {

      }

    }
    function onScreenOrientationChangeEvent() {
      _YJGyro.SetScreenOrientationChangeEvent();
    }

    function onDeviceMotion(e) {
      var SHAKE_THRESHOLD = 120;
      var last_update = 0;
      var last_x, last_y, last_z = 0;
      let accelerationText = {};

      // 有 4 个只读属性：
      // （1）accelerationIncludingGravity：重力加速度（包括重心引力9.8）
      // （2）acceleration：加速度（需要设备陀螺仪支持）
      // （3）rotationRate（alpha，beat，gamma）；旋转速度
      // （4）interval：获取的时间间隔 

      let { acceleration, accelerationIncludingGravity } = e;
      let { x, y, z } = acceleration;
      // let { x, y, z } = accelerationIncludingGravity;
      // let { beta, gamma,alpha } = acceleration;
      // let ss = acceleration.x + " " + acceleration.y + " " + acceleration.z

      var curTime = new Date().getTime();
      if (curTime - last_update > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        var speed = ((x + y + z - last_x - last_y - last_z) / diffTime) * 10000;

        if (Math.abs(speed) > SHAKE_THRESHOLD) {
          accelerationText.x = " 有效 移动";
          accelerationText.z = speed > 0 ? " 前进 " : " 后退 ";
          _YJGyro.MoveCameraForward();
        } else {
          accelerationText.x = " 停止 移动";
          accelerationText.z = " ";
        }
        accelerationText.y = speed;



        last_x = x;
        last_y = y;
        last_z = z;
      }


      // console.log("获取ios设备 加速度 ", acceleration);
    }

    function onDeviceOrientationChangeEvent(e) {


      let orient = {};
      orient.beta = e.beta;
      orient.gamma = e.gamma;
      orient.alpha = e.alpha;


      //   if (orient.beta >= 100) { orient.beta = 100; } //仰角限制
      // if (orient.beta <= 50) { orient.beta = 50; } //俯角限制


      let orient2 = {};
      orient2.beta = e.beta.toFixed(2);
      orient2.gamma = e.gamma.toFixed(2);
      orient2.alpha = e.alpha.toFixed(2);

      // console.log("获取ios设备陀螺仪 ", orient2);


      _YJGyro.SetDeviceOrientationChangeEvent(orient);
    }

    function onAndroidDeviceOrientationChangeEvent(e) {
      // console.log("获取安卓设备陀螺仪 ",e);

      let orient = {};
      orient.beta = e.beta;
      orient.gamma = e.gamma;
      orient.alpha = e.alpha;

      //   if (orient.beta >= 100) { orient.beta = 100; } //仰角限制
      // if (orient.beta <= 50) { orient.beta = 50; } //俯角限制


      let orient2 = {};
      orient2.beta = e.beta.toFixed(2);
      orient2.gamma = e.gamma.toFixed(2);
      orient2.alpha = e.alpha.toFixed(2);

      // orient.beta =  (x) ;
      // orient.gamma = (y);
      // orient.alpha = (z);
      // orient.beta =  Math.round(x) ;
      // orient.gamma = -Math.round(y);
      // orient.alpha = -Math.round(z);

      console.log("获取安卓设备陀螺仪 ", orient2);

      _YJGyro.SetDeviceOrientationChangeEvent(orient);
    }

    function onAndroidMotion(e) {
    }


    InitFn();
  }
}

export { YJGyroRequest };