import * as THREE from "three";

import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';

class YJCurve {
  constructor(_this, scene, objectToCurve) {

    const curveHandles = [];
    let flow;
    function Init() {
      const initialPoints = [
        { x: 1, y: 0, z: - 1 },
        { x: 1, y: 0, z: 1 },
        { x: - 1, y: 0, z: 1 },
        { x: - 1, y: 0, z: - 1 },
      ];

      const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const boxMaterial = new THREE.MeshBasicMaterial();

      for (const handlePos of initialPoints) {

        const handle = new THREE.Mesh(boxGeometry, boxMaterial);
        handle.position.copy(handlePos);
        curveHandles.push(handle);
        scene.add(handle);

      }

      const curve = new THREE.CatmullRomCurve3(
        curveHandles.map((handle) => handle.position)
      );
      curve.curveType = 'centripetal';
      curve.closed = true;

      const points = curve.getPoints(50);
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
      );

      scene.add(line);


      flow = new Flow(objectToCurve);
      flow.updateCurve(0, curve);
      scene.add(flow.object3D);
      update();

    }

    Init();
    var updateId = null;

    function update() {
      requestAnimationFrame(update);
      if (flow) {
        flow.moveAlongCurve(0.001);
      }
    }

  }
}

export { YJCurve };