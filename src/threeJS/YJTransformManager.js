import * as THREE from "three";
 
//控制物体旋转
import { YJTransformController } from "./YJTransformController.js";
import { YJSandbox } from "./YJSandbox.js";
 

class YJTransformManager {
  constructor(_YJSceneManager, scene, camera, renderer,_this, initCallback) {
    let scope = this;
  
    let inAttach = false;
    function addSandbox(pos) {
      let index = Math.ceil(Math.ceil(Math.random() * 10) / 5);

      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let size = new THREE.Vector3(1, 1, 1);
      new YJSandbox(scope, sandboxParent, '', '', texArray[index].texName, pos, rotaV3, size);
    }
    function delSandbox(obj) {
      sandboxParent.remove(obj);
    }
    this.GetTexByName = function (texName) {
      for (let i = 0; i < texArray.length; i++) {
        const item = texArray[i];
        if (item.texName == texName) {
          return item.texture;
        }
      }
      return null;
    }
    this.AddTexture = function (texName, texture) {
      for (let i = 0; i < texArray.length; i++) {
        if (texArray[i].texName == texName) {
          return;
        }
      }
      texArray.push({ texName: texName, texture: texture });
    }
    this.RemoveTexture = function (texName) {
      for (let i = texArray.length - 1; i >= 0; i--) {
        if (texArray[i].texName == texName) {
          texArray.splice(i, 1);
          return;
        }
      }
    }
    let transformController;

    Init();
    function Init() {
      transformController = new YJTransformController(scene, renderer, camera, _this);
    }
    this.attach = function(mesh){
      transformController.attach( mesh );
      inAttach = true;
    }
    this.detach = function(){
      if(!inAttach){return;}
      transformController.detach();
      inAttach = false; 
    }

    this.SetRotaAxis = function(bx,by,bz){
      transformController.SetRotaAxis(bx,by,bz);
    }
  }
}

export { YJTransformManager };