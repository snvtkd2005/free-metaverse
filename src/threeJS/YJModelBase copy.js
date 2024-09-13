import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


import { ObjectLoader } from "three";

// 模型基类
class YJModelBase {
  constructor(_this, scene, id, modelPath, pos, rota, name,
     meshType,createCollider,callback) {

    var model = null;
    this.id = id;
    this.GetModel = function(){
      return model;
    }

    function loadJson(){
      // const loader = new LegacyJSONLoader();
      const loader = new ObjectLoader();
      // const loader = new THREE.BufferGeometryLoader();
      console.log("正在加载json");
      // load a resource
      loader.load(
        // resource URL
        _this.$publicUrl+'models/json/CS15_E_pro_t10_Door_BB.json',
        // _this.$publicUrl+'models/json/jfc-ext.js',

        // onLoad callback
        function ( geometry ) {
          const material = new THREE.MeshLambertMaterial( { color: 0xF5F5F5 } );
          const object = new THREE.Mesh( geometry, material );
          scene.add( object );
        },

        // onProgress callback
        function ( xhr ) {
          console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError callback
        function ( err ) {
          console.log( 'An error happened' );
        }
      );
    }
    //加载热点的obj 模型
    function loadFbx() {
      var fbxLoader = new FBXLoader();
      fbxLoader.load(
        modelPath,
        function (object) {
 

          model = object;

          model.name = name;
          model.position.set(pos.x, pos.y, pos.z); //  
          model.rotation.set(rota.x, rota.y, rota.z);
          let size = 0.01;
          model.scale.set(size, size, size);
          scene.add(model);        
          console.log(" 加载模型完成 " ,model );


          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              item.receiveShadow = true;
            }
          });


          if (createCollider) {
            //创建collider 
            CreateCollider();
            model.name = name;
          }else{
            // model.name = "ignoreRaycast";
          }
          if(callback){
            callback();
          }
        LoadCompleted();

        }
      );
    }
    function loadGltf() {

      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath('/js/draco/gltf/');
      // dracoLoader.setDecoderConfig({type:"js"});
      // dracoLoader.preload();
      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {

        model = gltf.scene;
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.castShadow = true;
            item.receiveShadow = true;
          }
        });

        // console.log("in loadmodel gltf " + name,pos , model);
        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);

        // model.scale.set(size, size, size);
        scene.add(model);
        // console.log(" 加载模型完成 " ,model );

        if(name=="stage"){
          // console.log("加载舞台 111 "+ meshType+" "+createCollider );
        }


        if (createCollider) {
          //创建collider 
          CreateCollider();
          model.name = name;
        }else{
          // model.name = "ignoreRaycast";
        }
        if(callback){
          callback();
        }
        LoadCompleted();
        //创建 舞台 的 collider
      }, undefined, function (e) {

        console.error(e);

      });

    }

    function LoadCompleted(){
      if(_Global.YJ3D._YJSceneManager == undefined){
        console.log("！！！注意，不应该进入此判断 。 加载静态模型 ",modelPath);
        return;}
      _Global.YJ3D._YJSceneManager.LoadSingleModelCompleted();
    }


    function LoopFindChild(childName, parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        let cn = c.name.split("_");
        // console.log("cn",cn);
        if (cn[1] == childName) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindChild(childName, c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }

    function LoopFindColliderChild(parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        if (c.name.indexOf("Collider") > -1) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindColliderChild(c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }

    function LoopFindMeshChild(parent) {
      for (let i = 0; i < parent.children.length; i++) {
        const c = parent.children[i];
        if (c.type == ("Mesh")) {
          return c;
        }
        if (c.children.length > 0) {
          let cc = LoopFindMeshChild(c);
          if (cc != null) {
            return cc;
          }
        }
      }
      return null;
    }

    this.SetState = function (state) {
    }

    function Init() {
      let type = "fbx";
      if (modelPath.indexOf(".gltf") > -1 || modelPath.indexOf(".glb") > -1 ) {
        type = "gltf";
      }
      if (modelPath.indexOf(".json") > -1) {
        type = "json";
      }
      if (type == "fbx") {
        loadFbx();
      }
      if (type == "gltf") {
        loadGltf();
      }
      if (type == "json") {
        loadJson();
      }
    }

    Init();

    // // 坐标、旋转 也算在同步状态中
    // this.SetState = function (modelData) {
    //   console.log("改变模型状态");
    //   let _pos = modelData.pos;
    //   let _rotaV3 = modelData.rotaV3;
    //   let pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
    //   let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);
    //   this.ResetSetPosRota(pos,rotaV3);
    // }

    this.ResetSetPosRota = function (pos, rota) {
      if (model == null) { return; }
      this.SetPosRota(pos, rota);
      this.DestroyCollider();
      CreateCollider();
    }

    
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota) {
      if (model == null) { return; }
      model.position.set(pos.x, pos.y, pos.z); // 
      if (rota != undefined) {
        model.rotation.set(rota.x, rota.y, rota.z); // 
      }
    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(model.position, model.rotation);
    }
    //可由用户创建的模型，放下是创建碰撞体
    this.SetDown = function (pos, rota) {
      CreateCollider();
      model.name = name;

    }
    //创建碰撞体
    function CreateCollider() {


      let wutai = LoopFindChild("wutai", model);

      if (wutai != null) {
        if (meshType == "Triange") {
          //凹包碰撞体
          _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(wutai, wutai.scale);

        } else {
          //凸包碰撞体
          _Global.YJ3D._YJSceneManager.CreateModelMeshCollider(wutai, wutai.scale);
        }
      } else {
        // let collider = LoopFindColliderChild(model);
        // if (collider != undefined) {
        //   _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(collider, collider.scale);
        // } else {
        //   collider = LoopFindMeshChild(model);
        //   _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(collider, collider.scale);
        // }


        // console.log(" 加载模型完成 " ,model );
        let hasCollider = false;
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) { 
            // console.log("创建碰撞体 "+ item.name + " " , item.scale);
            if(item.name.indexOf("collider")>-1){
              hasCollider = true;
              // _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(item, item.scale );
              // item.visible = false;
            }else{
              item.castShadow = true;
              item.receiveShadow = true;
            }
          }
        });
        
        //自定义碰撞体。 如果有自定义碰撞体，则只为碰撞体网格创建碰撞
        if(hasCollider){
          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              // console.log("创建碰撞体 "+ item.name + " " , item.scale);
              if(item.name.indexOf("collider")>-1){
                // 凹包碰撞体
                _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(item, item.scale );
                item.visible = false;
              }
            }
          });
        }else{
          // 如果没有自定义碰撞体，则为不生成碰撞。 注释生成碰撞代码
          // model.traverse(function (item) {
          //   if (item instanceof THREE.Mesh) {
          //     _Global.YJ3D._YJSceneManager.CreateTriangeMeshCollider(item, item.scale );
          //   }
          // });
        }
      } 
    }
    //删除模型
    this.Destroy = function () {
      LoadCompleted();

      if (model == null) { return; }

      this.DestroyCollider();
      scene.remove(model);
    }
    this.DestroyCollider = function(){
      if (model != null) {
        //删除碰撞体 
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) { 
            _Global.YJ3D._YJSceneManager.RemoveCollider(item);

            // item.geometry.dispose();
            // item.material.dispose();
          }
        });
        clearGroup(model);
      }
    }
    function clearGroup(group) {
      const clearCache = (item) => {
        if (item.type === 'Mesh') {
          item.geometry.dispose();
          if(item.material){
            item.material.dispose();
          }
        }
      };
      const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        arr = null;
      };
      removeObj(group);
    } 
  }
}

export { YJModelBase };