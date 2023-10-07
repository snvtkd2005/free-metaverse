import * as THREE from "three";



class YJGyro {
  constructor(scene, camera, callback) {

    let deviceOrientation, screenOrientation;

    this.SetScreenOrientationChangeEvent = function () {
      screenOrientation = window.orientation || 0;
    }
    this.SetDeviceOrientationChangeEvent = function (event) {
      let speed = 1.2;

      // event.beta *= speed;
      // event.gamma *= speed;
      // event.alpha *= speed;

      deviceOrientation = event;

      RotaFn();
    }
    function degToRad(f) {
      return f * Math.PI / 180;
    }
    function RotaFn() {


      var zee = new THREE.Vector3(0, 0, 1);


      var event = deviceOrientation;
      var x = event ? degToRad(event.beta) : 0;
      var y = event ? degToRad(event.alpha) : 0;
      var z = event ? degToRad(-event.gamma) : 0;

      var w = screenOrientation ? degToRad(screenOrientation) : 0;

      var c1 = Math.cos(x / 2);
      var c2 = Math.cos(y / 2);
      var c3 = Math.cos(z / 2);

      var s1 = Math.sin(x / 2);
      var s2 = Math.sin(y / 2);
      var s3 = Math.sin(z / 2);

      var q0 = new THREE.Quaternion(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 - s1 * s2 * c3,
        c1 * c2 * c3 + s1 * s2 * s3
      );

      var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
      q0.multiply(q1);

      var q2 = new THREE.Quaternion();
      q2.setFromAxisAngle(zee, screenOrientation);
      q0.multiply(q2);
      if (camera) {
        camera.quaternion.rotateTowards(q0, 10);
      }
      if (callback) {
        callback(q0);
      }

    }
    let height = 0;
    this.MoveCameraForward = function () {
      console.log(" in MoveCameraForward ");
      // return; 
      camera.translateZ(-0.1);
      camera.position.y = height;

    }
    function Init() {
      if (scene != null) {
        scene.add(camera);
      }
    }
    Init();

    this.SetScreenOrientationChangeEvent();
  }
}

export { YJGyro };