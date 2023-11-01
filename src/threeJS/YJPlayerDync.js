



// 角色同步相关。如角色扔物品、施放技能等的同步
// 脚下光圈
import * as THREE from "three";

import { YJParabola } from "./YJParabola.js";

import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

import { YJPlayerFireCtrl } from "./YJPlayerFireCtrl.js"; //战斗控制

class YJPlayerDync {
  constructor(_this, scene, YJPlayer, playerGroup) {

    var scope = this;
    let oldStateId = 0;
    let otherthrowObj = null;
    let _YJPlayerFireCtrl = null;
    this.DyncPlayerState = function (state) {
      if(state.title == "fire"){
        if(_YJPlayerFireCtrl == null){
          _YJPlayerFireCtrl = new YJPlayerFireCtrl(_this,YJPlayer);
        }
        _YJPlayerFireCtrl.DyncPlayerState(state);
        return;
      }
      let stateId = state.stateId;
      if (oldStateId != stateId) {
        if (otherthrowObj != null) {
          otherthrowObj.parent.remove(otherthrowObj);
          _this._YJSceneManager.clearGroup(otherthrowObj);
          otherthrowObj = null;
        }
      }
      if (stateId != 1212) { return; }
      let boneName = state.boneName;
      let modelName = state.modelName;
      let targetPos = state.targetPos;

      if (otherthrowObj == null) {
        YJPlayer.GetBone(boneName, (bone) => {
          otherthrowObj = CreateThrowObj(bone, modelName);
        });
      }

      if (targetPos) {

        _this.scene.attach(otherthrowObj);
        let parabola = new THREE.Group();
        _this.scene.add(parabola);
        parabola.position.copy(otherthrowObj.position.clone());

        // parabola.add(new THREE.AxesHelper(1));

        let target = new THREE.Group();
        // target.add(new THREE.AxesHelper(1));
        _this.scene.add(target);

        target.position.set(targetPos.x, targetPos.y, targetPos.z);

        parabola.attach(target);

        parabola.attach(otherthrowObj);
        //扔出拾取物品。抛物线移动
        new YJParabola(_this, parabola, otherthrowObj, otherthrowObj.position.clone(), target.position.clone());

        otherthrowObj = null;

      }


    }

    function CreateThrowObj(parent, modelName) {

      let mesh = _this._YJSceneManager.checkLoadMesh(_this.GetPublicModelUrl() + _this._YJSceneManager.GetModelPath(modelName));
      let cube = LoadMesh(mesh);
      cube.scale.set(100, 100, 100);
      // //在2d物品栏对应的3d位置生成模型
      // let cubeGeometry = new THREE.SphereGeometry(10, 50, 50);
      // let cubeMaterial = new THREE.MeshStandardMaterial({
      //   color: 0x808080,
      // });
      // let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      parent.add(cube);
      cube.position.set(0, 0, 0);
      cube.name = modelName;
      return cube;
    }

    function LoadMesh(mesh) {
      // console.log(" 已存在mesh ,复用之 ！", name);
      let group = mesh.clone();
      let model = group.children[0];
      model.traverse(function (item) {
        if (item.type === 'Mesh') {
          let cloneMat = item.material.clone();
          item.material = cloneMat;
        }
      })
      return model;
    }
 

  }
}

export { YJPlayerDync };