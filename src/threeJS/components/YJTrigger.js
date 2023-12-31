
import * as THREE from "three";

// trigger 组件 用来给物体添加检测区域。使用球形

// 
class YJTrigger {
  constructor(_this, parent, owner, triggerId) {
    let scope = this;

    var model = null;
    let size = null;
    let volume = { x: 1, y: 1, z: 1 };
    let createLater = null;
    function Init() { 
      createLater = setTimeout(() => {
        scope.CreateTrigger();
      }, 2000); 
    }
    this.Reset = function () {
      createLater = setTimeout(() => {
        scope.CreateTrigger();
      }, 2000);
    }

    let triggleObj = null;
    this.CreateTrigger = function () {
      this.Destroy();
      // return;
      let planeGeometry = new THREE.BoxGeometry(volume.x, volume.y, volume.z); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        alphaTest: true,
        transparent: true,
        opacity: 0.5,
        color: 0x0000ff,
      });
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.name = "trigger";
      plane.modelType = "trigger";
      parent.add(plane);
      _this._YJSceneManager.CreateTriangeMeshTrigger(plane, size,
        triggerId, "triggerArea", owner); 
      triggleObj = plane;
      triggleObj.transform = owner;
    }

    //删除模型
    this.Destroy = function () {
      if(createLater!=null){
        clearTimeout(createLater);
        createLater = null;
      }
        
      this.DestroyCollider();
    }
    this.DestroyCollider = function () {
      if (triggleObj != null) {
        //删除碰撞体 
        _this._YJSceneManager.RemoveCollider(triggleObj);
        _this._YJSceneManager.ClearMesh(triggleObj);
        triggleObj = null;
      }
    }
    Init();
  }
}

export { YJTrigger };