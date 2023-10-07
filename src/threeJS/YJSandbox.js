import * as THREE from "three";
 
// 沙盒单个立方体

class YJSandbox {
  constructor(_YJSandboxManager,parent,id, modelName,
    texName, pos, rota) {
    var scope = this;
 
    let group = null;

    let size = new THREE.Vector3(1,1,1);
    var model = null;
    // 获取模型准备移动
    this.GetModel = function () {
      this.DestroyCollider();
      return group;
    }

    function Init() {
      model = CreateBox();
      parent.add(model);
      model.position.copy(pos);
      model.rotation.copy(rota);
      _YJSandboxManager.CreateTriangeMeshCollider(model, size);
    }
    function CreateBox() {  
      let cubeGeometry = new THREE.BoxGeometry(size.x,size.y,size.z);
      let cubeMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xaaaaaa ,
        map:_YJSandboxManager.GetTexByName(texName),
        emissiveMap:_YJSandboxManager.GetTexByName(texName),
        emissiveIntensity:10,
        transparent:true,
      });
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      return cube;
    }

    //#region 
    //#endregion
    //-------添加删除 开始------------
    //同步服务器上的其他客户端创建的模型的状态
    function _SetState(_state) {
    }

    this.ResetSetPosRota = function (pos, rota) {

    }
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota) {

    }

    //可由用户创建的模型，放下是创建碰撞体
    this.SetDown = function (pos, rota) {

    }
    function LoadCompleted() {
    }
    //删除模型
    this.Destroy = function () {
    }
    this.DestroyCollider = function () {

    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {

    }


    Init(); 
  }
}


export { YJSandbox };