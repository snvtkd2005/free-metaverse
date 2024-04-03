
import * as THREE from "three";

// trigger 组件 用来给物体添加检测区域。使用球形
/**
messge.data:{
  geometryType:"",
  isCollider:false,
  isTrigger:false,
  tiggerTag:"",
}
 */
// 
class YJGeometry {
  constructor(_this, parent, owner) {
    let scope = this;

    var mesh = null;
    let size = null; 
    let createLater = null;
    function Init() { 
      
      if(mesh){
        parent.remove(mesh);
        _this._YJSceneManager.RemoveCollider(mesh);
      }
      owner.GetData().name = data.name;

      let geo = null;
      let material = new THREE.MeshBasicMaterial({
        alphaTest: true,
        transparent: true,
        // opacity: 0.5,
        color: 0xffffff,
      });
      switch (data.geometryType) {
        case "box":
          geo = new THREE.BoxGeometry(1,1,1); // 生成平面
          break;
      
        default:
          break;
      } 
      mesh = new THREE.Mesh(geo, material);
      parent.add(mesh);
      mesh.transform = owner;
      size = owner.GetData().scale;
      // trigger和collider使用不同材质

      if(data.isCollider){
        mesh.name = "geometry";
      // if(item.name.indexOf("land")){
      //   _this._YJSceneManager.AddLandCollider(item);
      // }else{
      //   _this._YJSceneManager.AddCollider(item);
      // }
        console.log(" 创建碰撞体 ",size);
        _this._YJSceneManager.CreateTriangeMeshCollider(mesh, size);
      }
      if(data.isTrigger){
        // mesh.name = "trigger";
        // mesh.modelType = "trigger";
        _this._YJSceneManager.CreateTriangeMeshTrigger(mesh, size,
          data.tiggerTag, "triggerArea", owner);  
      } 
      
      if(data.isProjection){
        _this._YJSceneManager.AddProjectionUI(
          {
            content: data.name,
            tag:data.tiggerTag,
            transform:owner,
            event:data.event,
          });  
      } 
      if(data.isPosRef){
        //位置参考物体
        _this._YJSceneManager.AddPosRef(
          {
            content: data.name,
            tag:data.tiggerTag,
            pos:owner.GetWorldPos()
          });  
      } 
      if(!_Global.setting.inEditor){
        mesh.visible = false;
      }
    }
    this.Reset = function () {
      // createLater = setTimeout(() => {
      //   Init();
      // }, 200);
    }
    this.CreateTrigger = function () {
      this.Destroy();
      // return;
      
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
      if (mesh != null) {
        //删除碰撞体 
        _this._YJSceneManager.RemoveCollider(mesh);
        _this._YJSceneManager.ClearMesh(mesh);
        mesh = null;
      }
    }
    
    let data = null;
    this.SetMessage = function ( msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      // console.log("in YJGeometry msg = ", data);
      Init();
    }

    this.GetData = function () {
      return data;
    }
  }
}

export { YJGeometry };