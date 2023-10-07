import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture.js";


import { ObjectLoader } from "three";

// 加载静态物体
class YJLoadModelCar {
  constructor(_this, scene, id, modelPath, pos, rota, name) {

    var model;
    this.id = id;

    function loadJson() {
      // const loader = new LegacyJSONLoader();
      const loader = new ObjectLoader();
      // const loader = new THREE.BufferGeometryLoader();
      console.log("正在加载json");
      // load a resource
      loader.load(
        // resource URL
        _this.$publicUrl + 'models/json/CS15_E_pro_t10_Door_BB.json',
        // _this.$publicUrl+'models/json/jfc-ext.js',

        // onLoad callback
        function (geometry) {
          const material = new THREE.MeshLambertMaterial({ color: 0xF5F5F5 });
          const object = new THREE.Mesh(geometry, material);
          scene.add(object);
        },

        // onProgress callback
        function (xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
          console.log('An error happened');
        }
      );
    }
    //加载热点的obj 模型
    function loadFbx() {

      // var texture_d = new THREE.Texture();
      // var loaderTex_d = new THREE.ImageLoader(manager);
      // loaderTex_d.load(
      //   texturePath,
      //   function (image) {
      //     texture_d.image = image;
      //     texture_d.needsUpdate = true;
      //   }
      // );

      var fbxLoader = new FBXLoader();
      fbxLoader.load(
        modelPath,
        function (object) {

          // object.traverse(function (child) {
          //   if (child instanceof THREE.Mesh) {
          //     if (child.material.length == undefined) {
          //       // 标准材质球
          //       var map = child.material.map;
          //       // const map = new THREE.TextureLoader().load(texturePath[0]);
          //       var material = new THREE.MeshStandardMaterial({
          //         metalness: 0.5, //金属
          //         roughness: 0.9, //高光
          //         color: 0xffffff, //颜色
          //         depthTest: true,
          //         map: map,
          //       });

          //       child.material = material;
          //       // console.log(" 材质球只有一个 设置其材质球 ", child.material);
          //     }else{
          //       for (let i = 0; i < child.material.length; i++) {
          //         const map = new THREE.TextureLoader().load(texturePath[i]);
          //         child.material[i] = new THREE.MeshStandardMaterial({
          //           metalness: 0.5, //金属
          //           roughness: 0.9, //高光
          //           color: 0xffffff, //颜色
          //           depthTest: true,
          //           map: map, 
          //         });
          //       }

          //     }
          //     child.castShadow = true;

          //     // //标准材质球
          //     // child.material = new THREE.MeshStandardMaterial({
          //     //   metalness: 0.1, //金属
          //     //   roughness: 0.5, //高光
          //     //   color: 0xffffff, //颜色
          //     //   // color:_color, //颜色
          //     //   depthTest: true,
          //     //   // lightMap: texture_d,
          //     //   // map: texture_d,
          //     // });
          //   }
          // });

          model = object;

          model.name = name;
          model.position.set(pos.x, pos.y, pos.z); //  
          model.rotation.set(rota.x, rota.y, rota.z);
          let size = 0.01;
          model.scale.set(size, size, size);
          scene.add(model);
          // console.log(" 加载模型完成 " +modelPath,model );

          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              item.receiveShadow = true;
            }
          });


        }
      );
    }
    function loadGltf() {


      // var envmap = new THREE.TextureLoader().load(
      //   _this.$publicUrl + "models/pano/EnvMap.jpg"
      // );

      // const dracoLoader = new DRACOLoader();
      // dracoLoader.setDecoderPath('/js/draco/gltf/');
      // dracoLoader.setDecoderConfig({type:"js"});
      // dracoLoader.preload();
      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {

        model = gltf.scene;
        console.log("car ", model);

        // let texture = new THREE.CanvasTexture(new FlakesTexture());
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.x = 10;
        // texture.repeat.y = 6;

        // const ballMaterial = {
        //   clearcoat: 1.0,
        //   clearcoatRoughness: 0.1,
        //   metalness: 0.9,
        //   roughness: 0.5,
        //   color: 0xA6F3FD,
        //   normalMap: texture,
        //   normalScale: new THREE.Vector2(0.05, 0.05),
        //   // envMap:envmap.texture
        // };

        // var bodyAo = new THREE.TextureLoader().load(
        //   _this.$publicUrl + "models/car_for_games_unity/textures/BodyAlbedo_baseColor.png"
        // );

        // const bodyMaterial = new THREE.MeshPhysicalMaterial({
        //   // map:item.material.texture,
        //   // envMap:envmap,
        //   color: 0xA6F3FD,
        //   metalness: 1.0,
        //   roughness: 0.5,
        //   clearcoat: 1.0,
        //   clearcoatRoughness: 0.03,
        //   lightMap:bodyAo,
        //   sheen: 0.5
        // });

        // const detailsMaterial = new THREE.MeshStandardMaterial({
        //   color: 0xffffff,
        //   metalness: 1.0,
        //   roughness: 0.5
        // });

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            // item.castShadow = true;
            // item.receiveShadow = true;

            // let map = item.material.map;
            // item.material = bodyMaterial;
            // item.material.map = map;
            // item.material.envMap = bodyAo;
            // item.material.envMap.mapping = THREE.EquirectangularReflectionMapping;
            // item.material.envMap.envMapIntenisty = 1;
            // item.material.metalness= 1.0;
            // item.material.roughness= 1 ;
            // item.material.clearcoat= 1.0;
            // item.material.clearcoatRoughness= 0.03;
            // item.material.lightMap = bodyAo;
            // item.material.sheen= 0.5;

          }
        });

        // console.log("in loadmodel gltf " + name,pos , model);
        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);
        let size = 1.5;
        model.scale.set(size, size, size);
        scene.add(model);
        model.name = name;

        //创建 舞台 的 collider
      }, undefined, function (e) {

        console.error(e);

      });

    }
    function loadDrc() {


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
      if (modelPath.indexOf(".gltf") > -1) {
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

    //删除模型
    this.Destroy = function () {
      if (model != undefined) {
        //删除碰撞体 
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.castShadow = true;
            item.receiveShadow = true;
          }
        });
      }

      scene.remove(model);

    }

  }
}

export { YJLoadModelCar };