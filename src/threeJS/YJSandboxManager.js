import * as THREE from "three";
 
import { YJSandbox } from "./YJSandbox.js";
import { YJSandboxRaycaster } from "./YJSandboxRaycaster.js";

class YJSandboxManager {
  constructor(_YJSceneManager, scene, camera, document, initCallback) {
    let scope = this;

    let sandboxParent = null;

    // 贴图数组
    let texArray = [];

    function InitTextureArray() {

      texArray.push({ texName: "checkPoint", texture: new THREE.TextureLoader().load("/checkPoint.png") });
      texArray.push({ texName: "minMapPoint", texture: new THREE.TextureLoader().load("/checkPoint.png") });
      texArray.push({ texName: "mousepos", texture: new THREE.TextureLoader().load("/checkPoint.png") });

      // console.log(texArray);
    }

    this.CreateTriangeMeshCollider = function(mesh,scale){
      _YJSceneManager.CreateTriangeMeshCollider(mesh, scale);
    }

    function InitSandboxManager() {


      sandboxParent = new THREE.Group();
      scene.add(sandboxParent);

      new YJSandboxRaycaster(scene, camera, document, sandboxParent, addSandbox, delSandbox);

      // let pos = new THREE.Vector3(10, 0, 5);
      let pos = new THREE.Vector3(0, 5, 0);
      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let size = new THREE.Vector3(1, 1, 1);

      let index = Math.ceil(Math.ceil(Math.random() * 10) / 5);
      let texName =  texArray[index].texName;
      new YJSandbox(scope, sandboxParent, '', '', texName, pos, rotaV3, size);
    }
    function addSandbox(pos,model) {


      // _YJSceneManager._YJTransformManager.attach(model);   return;

      let index = Math.ceil(Math.ceil(Math.random() * 10) / 5);

      let rotaV3 = new THREE.Vector3(0, 0, 0);
      let size = new THREE.Vector3(1, 1, 1);
      new YJSandbox(scope, sandboxParent, '', '', texArray[index].texName, pos, rotaV3, size);
    }
    function delSandbox(model) {
      
      _YJSceneManager.RemoveCollider(model);
      sandboxParent.remove(model);
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

    Init();
    function Init() {
      InitTextureArray();
      setTimeout(() => {
        InitSandboxManager();
      }, 1000);
    }

  }
}

export { YJSandboxManager };