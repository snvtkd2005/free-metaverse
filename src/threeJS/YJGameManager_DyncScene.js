import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJKeyboard } from "./YJKeyboard.js";

import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJProjector } from "./YJProjector.js";

import { GetPathFolders, LoadFile } from "/@/utils/api.js";
import TWEEN from '@tweenjs/tween.js';
import { YJLoadModel } from "./YJLoadModel.js";
import { YJParabola } from "./YJParabola.js";

// 同步场景物体

class YJGameManager_DyncScene {
  constructor(_this, npcManager) {
    var scope = this;
    //场景中需要同步的物体
    let sceneModels = [];
    this.addDyncSceneModel = function (id, type, model) {
      sceneModels.push({ id: id, type: type, model: model });
    }
    this.GetModel = function (id, type, model) {
      for (let i = 0; i < sceneModels.length; i++) {
        const element = sceneModels[i];
        if(element.id == id){
          return element.model.GetModel();
        }
      }
      return null;
    }
    
    this.SendDyncSceneModel = function () {
      for (let i = 0; i < sceneModels.length; i++) {
        const element = sceneModels[i];
        element.model.SendActive();
      }
    }
    this.ReceiveFromServer = function(sceneState){
      // console.log(sceneModels,sceneState);
      for (let i = 0; i < sceneModels.length; i++) {
        var modelState = sceneModels[i];
        for (let ii = 0; ii < sceneState.length; ii++) {
          const element = sceneState[ii];
          if (modelState.id == element.id) {
            modelState.model.SetState(element.state);
            return;
          }
          if (modelState.type == element.type) {
            modelState.model.SetState(element.state);
            continue;
          }
        }
      }
    }
    this.Receive = function(sceneState){
      for (let i = 0; i < sceneModels.length; i++) {
        var modelState = sceneModels[i];
        if (modelState.id == sceneState.id) {
          modelState.model.SetState(sceneState.state);
          return;
        }
      }
    }

    // init();
    // function update() {

    //   requestAnimationFrame(update);
    //   TWEEN.update();
    //   LerpMove();
    // }

  }
}

export { YJGameManager_DyncScene };