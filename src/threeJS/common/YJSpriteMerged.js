

import * as THREE from "three";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';


/**
 静态模型合批优化： merge 、 instance
 模型本身用instance
 模型碰撞用 geometry 合并后生成
 */
class YJSpriteMerged {
  constructor(imgPath) {
    let scope = this;
    const dummy = new THREE.Object3D();
    let dummyPos = new THREE.Vector3();

    let geometry = new THREE.BufferGeometry();
    let geometry_collecting = new THREE.BufferGeometry();
    let material = null;
    let vertices = [];

    let textureLoader = new THREE.TextureLoader();

    const assignSRGB = (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    };


    let particles;
    let particles_collecting;
    const sprite1 = textureLoader.load(_Global.url.uploadUVAnimUrl + (imgPath ? imgPath : '1721002343936/ui-goldicon.png'), assignSRGB);
    function Init() {

      const sprite = sprite1;
      const size = 0.51;
      material = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        // blending: THREE.AdditiveBlending, 
        blending: THREE.NormalBlending,

        // depthTest: false,
        transparent: true
      });
    }
    let autoCollecting = false;
    this.SetAutoCollect = function(b){
      autoCollecting = b;
    }
    let posList = [];
    let posList2 = [];
    this.GetPosCount = function () {
      return posList.length;
    }
    this.addPoint = function (pos) {
      if (autoCollecting) {
        posList2.push(pos);
        ReMergedCollecting(posList2);
        inCollecting = true;
        return;
      }
      posList.push(pos);
      this.ReMerged(posList);
    }
    // 在怪物死亡位置生成的金币
    this.ReMerged = (_posList) => {
      _Global.YJ3D.scene.remove(particles);
      posList = _posList;
      if (posList.length == 0) {
        return;
      }
      vertices = [];
      for (let i = 0; i < posList.length; i++) {
        const x = posList[i].x;
        const y = posList[i].y;
        const z = posList[i].z;
        vertices.push(x, y, z);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      // geometry.deleteAttribute("uv");
      particles = new THREE.Points(geometry, material);

      _Global.YJ3D.scene.add(particles);

    }

    this.Remove = function (index) {
      posList.splice(index, 1);
      this.ReMerged(posList);
    }
    this.RemovePos = function (pos) {
      // console.log(pos,posList);
      let needDel = [];
      for (let i = posList.length - 1; i >= 0; i--) {
        let _pos = posList[i];
        if (_pos.x == pos.x && _pos.y == pos.y && _pos.z == pos.z) {
          posList.splice(i, 1);
          needDel.push(_pos);
        }
      }
      if (needDel.length > 0) {
        // console.log(" 移除 ",needDel);
        for (let i = 0; i < needDel.length; i++) {
          posList2.push(needDel[i]);
        }
        inCollecting = true;
        ReMergedCollecting(posList2);
      }
      this.ReMerged(posList);

    }


    let inCollecting = false; 
    let eventList = [];
		// 添加事件监听
		this.addEventListener = function (e, fn) {
			// console.log(" 监听 ", e);
			eventList.push({ eventName: e, fn: fn });
		}
		// 执行事件
		this.applyEvent = function (e, v, v2,v3) {
			for (let i = 0; i < eventList.length; i++) {
				const element = eventList[i];
				if (element.eventName == e) {
					element.fn(v, v2,v3);
				}
			}
		}

    this.CollectGold = function () {
      inCollecting = true; 
      if (posList.length == 0) {
        return;
      }
      for (let i = 0; i < posList.length; i++) {
        const element = posList[i];
        posList2.push(element);
      }
      posList = [];
      this.ReMerged(posList);
      ReMergedCollecting(posList2);
    }

    // 收集中金币
    function ReMergedCollecting(_posList) {
      _Global.YJ3D.scene.remove(particles_collecting);
      posList2 = _posList;
      if (posList2.length == 0) {
        return;
      }
      let vertices = [];
      for (let i = 0; i < posList2.length; i++) {
        const x = posList2[i].x;
        const y = posList2[i].y;
        const z = posList2[i].z;
        vertices.push(x, y, z);
      }
      geometry_collecting.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      particles_collecting = new THREE.Points(geometry_collecting, material);

      _Global.YJ3D.scene.add(particles_collecting);
      // console.log("particles " ,particles);

    }
    this._update = function () {
      if(!inCollecting){
        return;
      }
      if (!particles_collecting) {
        return;
      }
      // 收集中的金币飞向角色位置
      const positions = particles_collecting.geometry.attributes.position;
      const count = positions.count;
      for (let i = 0; i < count; i++) {

        const px = positions.getX(i);
        const py = positions.getY(i);
        const pz = positions.getZ(i);

        dummyPos.set(px, py, pz);

        let targetPos = _Global._YJPlayerFireCtrl.GetWorldPosHalfHeight();

        if (dummyPos.distanceTo(targetPos) < 1) {
          posList2.splice(i, 1);
          ReMergedCollecting(posList2);
          this.applyEvent("收集1个");
          if (posList2.length == 0) {
            inCollecting = false;
            return;
          }
          continue;
        }

        dummy.position.copy(dummyPos);
        dummy.lookAt(targetPos);
        dummyPos.add(dummy.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.5));
        dummy.position.copy(dummyPos);
        if (posList2[i]) {
          posList2[i].copy(dummyPos);
        }
        positions.setXYZ(
          i,
          dummyPos.x,
          dummyPos.y,
          dummyPos.z
        );
        positions.needsUpdate = true;
      }

    }

    Init();

  }
}

export { YJSpriteMerged };