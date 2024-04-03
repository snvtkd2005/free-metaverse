


import * as THREE from "three";

// 角色姓名条、血条、头像、debuff

class YJPlayerNameTrans {
  constructor(namePosTrans) {

    var scope = this;

    //#region 音视频通话 小图标窗口

    let headerPlane = null;
    //创建用户头像
    this.CreateHeader = function (video) {
      if (video == false || video == null) {
        if (headerPlane != null) {
          namePosTrans.remove(headerPlane); // 向该场景中添加物体
          headerPlane = null;
        }
        return;
      }
      if (headerPlane == null) {
        let radius = 0.525;
        let planeGeometry = new THREE.CylinderGeometry(radius, radius, 0.01, 40, 1);
        const texture = new THREE.TextureLoader().load(video);
        texture.encoding = 3001; //3000  3001
        const material = new THREE.MeshBasicMaterial({ map: texture });
        headerPlane = new THREE.Mesh(planeGeometry, material);
        headerPlane.rotation.y = Math.PI / 2;
        headerPlane.rotation.x = Math.PI / 2;
        headerPlane.position.set(0, 0.8, 0);
        headerPlane.name = "header";
        namePosTrans.add(headerPlane); // 向该场景中添加物体
      } else {
        headerPlane.material.map = new THREE.TextureLoader().load(video);
      }
    }

    let healthPlane = null;
    let healthPlaneAnchor = null;
    this.CreateHealth = function (color) {

      if (healthPlane == null) {
        let w = 1;
        let h = 0.1;
        let planeGeometry = new THREE.PlaneGeometry(w, h, 1, 1); // 生成平面

        // const texture = new THREE.TextureLoader().load( video); 
        // texture.encoding = 3001; //3000  3001
        const material = new THREE.MeshBasicMaterial({
          color: color,
        });
        healthPlaneAnchor = new THREE.Group();
        healthPlane = new THREE.Mesh(planeGeometry, material);
        healthPlane.rotation.y = 0;
        healthPlane.position.set(0, 0.2, 0);
        healthPlane.name = "health";
        namePosTrans.add(healthPlane); // 向该场景中添加物体
        namePosTrans.add(healthPlaneAnchor); // 向该场景中添加物体
        healthPlaneAnchor.position.set(-0.5, 0.2, 0);
        healthPlaneAnchor.attach(healthPlane);

      } else {
        // healthPlane.material.map = new THREE.TextureLoader().load( video); 
      }
    }
    this.UpdateHealth = function (health, maxHealth) {
      if (healthPlaneAnchor) {
        healthPlaneAnchor.scale.set(health / maxHealth, 1, 1);
      }
    }
    this.resetLife = function () {
      if (healthPlaneAnchor) {
        healthPlaneAnchor.scale.set(1, 1, 1);
        namePosTrans.add(healthPlaneAnchor); // 向该场景中添加物体
        healthPlaneAnchor.position.set(-0.5, 0.2, 0);
      }
    }


    let debuffList = [];
    let debuffGroup = null;
    this.addDebuff = function (id, icon) {
      let w = 0.2;
      let h = 0.2;
      let planeGeometry = new THREE.PlaneGeometry(w, h, 1, 1); // 生成平面
      if(debuffGroup == null){
        debuffGroup = new THREE.Group();
        namePosTrans.add(debuffGroup); // 向该场景中添加物体
        debuffGroup.position.set(-0.61, 0.2, 0);
      } 

      const texture = new THREE.TextureLoader().load(icon);
      texture.encoding = 3001; //3000  3001
      const material = new THREE.MeshBasicMaterial({
        transparent: true, map: texture });
      let plane = new THREE.Mesh(planeGeometry, material);
      plane.rotation.y = 0;
      plane.position.set(debuffList.length*-0.2, 0, 0);
      plane.name = "debuff";
      debuffGroup.add(plane); // 向该场景中添加物体
      debuffList.push({id,plane});
      // console.log("添加 debuff ",id,icon);
    }
    this.removeDebuffById = function (id) {
      // console.log("移除 debuff ",id,debuffList);

      for (let i = debuffList.length - 1; i >= 0; i--) {
        const item = debuffList[i];
        if (item.id == id) {
          debuffGroup.remove(item.plane);
          debuffList.splice(i, 1); 
        }
      }
      for (let i = 0; i < debuffList.length; i++) {
        const item = debuffList[i];
        item.plane.position.set(i*-0.2, 0, 0);
      }

    }

    //#endregion




    this._update = function () {

    }


  }
}

export { YJPlayerNameTrans };