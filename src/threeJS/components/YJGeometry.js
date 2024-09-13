
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
  constructor( parent, owner) {
    let scope = this;

    var mesh = null;
    let size = null;
    let createLater = null;
    function Init() {

      if (mesh) {
        parent.remove(mesh);
        _Global.YJ3D._YJSceneManager.RemoveCollider(mesh);
      }
      owner.GetData().name = data.name;

      let geo = null;
      let material = new THREE.MeshBasicMaterial({
        alphaTest: true,
        transparent: false,
        // opacity: 0.5,
        color: 0x666666,
        // color: 0xffffff, 
      });
      switch (data.geometryType) {
        case "box":
          geo = new THREE.BoxGeometry(1, 1, 1); // 生成平面
          break;
        case "plane":
          geo = new THREE.PlaneGeometry(10, 10, 100, 100); // 生成平面
          break;
        default:
          break;
      }


      mesh = new THREE.Mesh(geo, material);
      mesh.visible = false;
      parent.add(mesh);
      mesh.transform = owner;
      size = owner.GetData().scale;
      // trigger和collider使用不同材质

      if (data.isCollider) {
        mesh.name = "geometry";
        // if(item.name.indexOf("land")){
        //   _Global.YJ3D._YJSceneManager.AddLandCollider(item);
        // }else{
        //   _Global.YJ3D._YJSceneManager.AddCollider(item);
        // }
        // console.log(" 创建碰撞体 ", size);
        _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(mesh, size);
      }
      if (data.isTrigger) {
        // mesh.name = "trigger";
        // mesh.modelType = "trigger";
        if(_Global.setting.inEditor){
          mesh.material = new THREE.MeshBasicMaterial({
            alphaTest: false,
            transparent: true,
            opacity: 0.5,
            color: 0x0000ff, 
          });
        }
        _Global.YJ3D._YJSceneManager.CreateTriangeMeshTrigger(mesh, size,
          data.tiggerTag, "triggerArea", owner);
      }

      if (data.isProjection) {
        _Global.YJ3D._YJSceneManager.AddProjectionUI(
          {
            content: data.name,
            tag: data.tiggerTag,
            transform: owner,
            event: data.event,
          });
      }
      if (data.isPosRef) {
        //位置参考物体
        _Global.YJ3D._YJSceneManager.AddPosRef(
          {
            content: data.name,
            tag: data.tiggerTag,
            pos: owner.GetWorldPos()
          });
      }
      if (_Global.setting.inEditor) {
        mesh.visible = true;
      }
      if (data.isMesh) {
        mesh.visible = true;
        mesh.receiveShadow = true;
      }
    }
    this.Reset = function () {
      createLater = setTimeout(() => {
        // console.error("in YJGeometry Reset = ", data);
        Init()
      }, 200);
    }  
    //删除模型
    this.Destroy = function () {
      if (createLater != null) {
        clearTimeout(createLater);
        createLater = null;
      }

      // console.log("in YJGeometry Destroy = ", data,mesh);

      if (mesh != null) {
        //删除碰撞体 
        _Global.YJ3D._YJSceneManager.RemoveCollider(mesh);
        _Global.YJ3D._YJSceneManager.ClearMesh(mesh);
        mesh = null;
      }

    } 

    let data = null;
    this.SetMessage = function (msg) {
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