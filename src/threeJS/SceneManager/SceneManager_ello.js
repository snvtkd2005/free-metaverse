



import * as THREE from "three";

import { YJLoadModel } from "../YJLoadModel.js";

import { YJMapManager } from "../YJMapManager.js";

import { YJAmmo } from "../YJAmmo.js";

import { GetCurrentTime } from "/@/utils/api.js";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { Water } from 'three/examples/jsm/objects/Water.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { nextTick } from "vue";
import { YJNPC } from "../YJNPC.js";
import { YJCurve } from "../YJCurve.js";
import { YJMinMap } from "../YJMinMap.js";
import { YJLoadModelManager } from "../YJLoadModelManager.js";

// 整体场景辉光 管理器
import { YJBloomManager } from "../YJBloomManager.js";
// 可设置单个模型辉光 管理器
import { YJBloomManager2 } from "../YJBloomManager2.js";
import { YJChangeManager } from "../YJChangeManager.js";
import { YJSandboxManager } from "../YJSandboxManager.js";
import { YJTransformManager } from "../YJTransformManager.js";
import { YJReflect } from "../YJReflect.js";
import { GetDateH } from "/@/utils/utils.js";
import { YJKeyboard } from "../YJKeyboard.js";

import { YJVideo } from "../YJVideo";
import { YJSqeImage } from "../YJSqeImage.js";
import { YJUVanim } from "../YJUVanim.js";

import { YJPathfinding } from "../pathfinding/YJPathfinding.js";
import { Mesh, TextureLoader } from "three";
import { YJReflectMirror } from "../YJReflectMirror.js";
import { YJWater } from "../YJWater.js";
import { YJReflectPostprocessing } from "../YJReflectPostprocessing.js";
import { YJCurse } from "../YJCurse.js";
import { YJPlatform } from "../YJPlatform.js";

class SceneManager {
  constructor(scene, renderer, camera, _this, callback) {
    let scope = this;
    let transformController;
    let stats;
    let verticalMirror;

    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();
    let lookatList = [];

    const FPS = 30; // 指的是 30帧每秒的情况
    const singleFrameTime = 1 / FPS;
    let timeStamp = 0;
    let _DirectionalLight = null;

    const listener = new THREE.AudioListener();
    let _YJMinMap = null;

    // 需要执行update的脚本
    let needUpdateJS = [];
    let lightData = null;

    this._YJTransformManager = null;
    let _YJBloomManager2 = null;
    let mirrorSphereCamera = null;

    let modelParent = null;
    let setting = null;

    let ambient = null;
    // 刚体高度
    let playerHeight = 0;

    let cube = null;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.Init = function () {

      InitFn();
    }


    let cubeCamera;
    let animAchorPoint = null;
    function InitFn() {
      // AddTestMat();
      // window.addEventListener('mousemove', onPointerDown);

      AddLensflares();
      AddWater();

      // new YJCurve(_this, scene, camera, renderer);
      // new YJCurse(_this, scene, camera, renderer);

      // 移动平台
      let _YJPlatform = new YJPlatform(_this, scene, new THREE.Vector3(2, 0, 0), new THREE.Vector3(2, 1, 0)
        , "platform001", "offsetTime");
      // let _YJPlatform = new YJPlatform(_this, scene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)
      // ,"platform001", "offsetTime");
      _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("platform001", "offsetTime", _YJPlatform);

      // 动画模型同步
      _this._YJSceneManager.GetDyncSceneManager().addDyncSceneModel("anim001", "offsetTime", _this._YJSceneManager.GetAnimModel("anim001"));

      // 测试设置角色到动画物体上，跟随动画物体一起移动.过山车
      // setTimeout(() => {
      //   // console.log(animAchorPoint);
      //   let group = new THREE.Group();
      //   group.add(new THREE.AxesHelper(5));
      //   group.position.copy( _this._YJSceneManager.GetWorldPosition(animAchorPoint));
      //   scene.add(group);
      //   animAchorPoint.attach(group);
      //   _this._YJSceneManager.GetAmmo().SetMyCtrlRbParent(group,true);
      //   _this._YJSceneManager.GetAmmo().SetPlayerPos(new THREE.Vector3(0,10, 0));
      //   _this._YJSceneManager.GetAmmo().SetPlayerRota(new THREE.Vector3(0,0, 0));

      //   setTimeout(() => {

      //     _this._YJSceneManager.GetAmmo().SetMyCtrlRbParent(scene,false);
      //     _this._YJSceneManager.GetAmmo().SetPlayerPos(new THREE.Vector3(0,1, 0));
      //     _this._YJSceneManager.GetAmmo().SetPlayerRota(new THREE.Vector3(0,0, 0));

      //   }, 2000); 

      // }, 2000); 


      // new YJReflect(_this, scene, camera, renderer);
      // new YJReflectPostprocessing(_this, scene, camera, renderer);
      // return;
      const loader = new THREE.TextureLoader()
        .setPath(_this.GetPublicUrl());

      const texture = loader.load("scene.jpg");
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      // scene.environment = texture;


      // 金属材质
      const metalMat = new THREE.MeshStandardMaterial();
      metalMat.roughness = 0.0; // attenuates roughnessMap
      metalMat.metalness = 0.73; // attenuates metalnessMap
      metalMat.envMap = _Global.hdrEquirect; // attenuates metalnessMap



      // 高反射玻璃材质
      const glassMat = new THREE.MeshStandardMaterial();
      glassMat.roughness = 0.1; // attenuates roughnessMap
      glassMat.metalness = 1; // attenuates metalnessMap


      // 水材质
      const waterMat = new THREE.MeshStandardMaterial();
      waterMat.roughness = 0.3; // attenuates roughnessMap
      waterMat.metalness = 1; // attenuates metalnessMap

      let waterNormalMap = loader.load('waternormals.jpg');
      waterNormalMap.wrapS = THREE.RepeatWrapping;
      waterNormalMap.wrapT = THREE.RepeatWrapping;
      waterNormalMap.repeat.set(8, 8);

      waterMat.normalMap = waterNormalMap;

      // 水的平面模型
      // let planeGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
      // let water = new THREE.Mesh(planeGeometry, waterMat);
      // scene.add(water);
      // water.position.set(0, -5, 0);
      // water.rotation.set(-Math.PI / 2, 0, 0);

      //透明材质
      const transparentMat = new THREE.MeshStandardMaterial();
      transparentMat.transparent = true;
      transparentMat.opacity = 0.5;


      // 镜子材质
      let mirrorNormalMap = loader.load('waternormals.jpg');
      // mirrorNormalMap.wrapS = THREE.RepeatWrapping;
      // mirrorNormalMap.wrapT = THREE.RepeatWrapping;
      // mirrorNormalMap.repeat.set(2, 2);

      let cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
      cubeRenderTarget.texture.type = THREE.HalfFloatType;
      cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
      let mirrorMat = new THREE.MeshStandardMaterial({
        // envMap: cubeRenderTarget.texture,
        roughness: 0.05,
        normalMap: mirrorNormalMap,
        color: 0x343456,
        metalness: 1
      });




      // 
      // material.map = map;
      // material.envMap = map;
      // material.envMapIntensity = 1;
      // return;

      scene.traverse((obj) => {
        if (obj.isMesh) {

          // console.log(obj.name);
          // console.log( obj.material);
          // console.log( obj.material.name);
          let matName = obj.material.name;

          // if(obj.material.type == "MeshStandardMaterial"){
          //   // obj.material.roughness = 1;
          //   // obj.material.metalness = 0;
          //   const material = new THREE.MeshBasicMaterial({ 
          //     map:obj.material.map 
          //   });
          //   obj.material = material;
          // }
          if (matName != "" && matName != undefined) {

            if (matName.indexOf("glass") > -1) {
              obj.material = glassMat;
              return;
            }
          }

          let meshName = obj.name
          if (meshName.includes("挂画")) {
            let transparent = obj.material.transparent;
            const material = new THREE.MeshBasicMaterial({
              transparent: transparent,
              side: THREE.DoubleSide,
              reflectivity: 0,
              map: obj.material.map
            });
            obj.material = material;
            return;

          } else {
          }


          if (meshName.includes('视频')) {
            let _YJVideo = new YJVideo(_this, "movie001", obj, "普通视频");
            setTimeout(() => {
              _YJVideo.SetVideoLoop(true);
            }, 1000);

            return;
          }


          if (meshName.includes('球体')) {
            if (animAchorPoint == null) {
              animAchorPoint = obj;
            }
            return;
          }

          if (meshName.indexOf('底部') > -1) {
            // obj.material = transparentMat;
            return;
          }
          if (meshName.indexOf('Genesis8Male') > -1) {

            const metalMat2 = new THREE.MeshStandardMaterial({
              // color:0x121212
              metalness: 0.73,
              roughness: 0.4,
              envMap: _Global.hdrEquirect,
              map: obj.material.map,
            });
            obj.material = metalMat2;
            return;
          }
          if (meshName.indexOf('旋转') > -1) {


            // 金属材质 
            // const metalMat2 = new THREE.MeshPhysicalMaterial({
            //   // color:0x121212
            //   transmission:0,
            //   metalness:0.73,
            //   roughness:0, 
            //   envMap:_Global.hdrEquirect,
            //   map: obj.material.map,
            // });

            const metalMat2 = new THREE.MeshStandardMaterial({
              // color:0x121212
              transmission: 0,
              metalness: 0.73,
              roughness: 0,
              envMap: _Global.hdrEquirect,
              map: obj.material.map,
            });
            obj.material = metalMat2;

            // console.log(" obj.material ", obj.material);
            return;
          }

          // console.log(meshName);

          if (meshName.indexOf('立方体1_2') > -1) {
            obj.material.map = loader.load('2.jpg');
            // console.log(" 地面反射镜子 ", obj);
            new YJWater(_this, scene, obj, new THREE.Vector2(5.7, 5.7), 1);

            // new YJReflectMirror(_this,scene, camera, renderer,obj);
            // let pos = obj.getWorldPosition(new THREE.Vector3());
            // console.log(pos.clone());
            // pos.add(new THREE.Vector3(0,3,0));
            // console.log(pos.clone());
            // cubeCamera.position.copy(pos);
            return;
          }

          if (meshName.indexOf('水面') > -1) {
            new YJWater(_this, scene, obj, new THREE.Vector2(12, 12), 1, new THREE.Vector3(0, 0.05, 0));
            return;
          }

          // if (obj.name.indexOf("bloom") > -1 || obj.name == "bloom") {
          //   // console.log("自发光的模型有 " + obj.name);
          //   obj.layers.enable(BLOOM_SCENE);
          //   // obj.material.emissiveMap = null;
          //   // obj.material.emissiveIntensity = 10;

          // }
          // if(obj.material.emissiveMap != null){
          //   console.log("自发光的模型有 " + obj.name);
          //   obj.layers.enable(BLOOM_SCENE);
          //   // obj.material.emissiveMap = null;
          // }  
        }
      });

      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.material.roughness = 1;

          obj.updateMatrixWorld();
        }
      });

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.10;
      // renderer.toneMapping=THREE.LinearToneMapping;





      if (callback) {
        callback();
      }



      render();

    }

    function AddTestMat() {
      let vs = `varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
          vNormal = normal;
          vViewPosition = - (modelViewMatrix * vec4( position, 1.0 )).xyz;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`;
      let fs = `varying vec3 vViewPosition;
      varying vec3 vNormal;

      uniform int maxMipLevel;
      uniform samplerCube envMap;
      uniform float envMapIntensity;
      uniform float flipEnvMap;

      uniform float roughness;


      float pow2( const in float x ) {
          return x*x;
      }
      float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
          return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
      }
      float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
          float maxMIPLevelScalar = float( maxMIPLevel );
          float desiredMIPLevel = maxMIPLevelScalar + 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
          return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
      }
      vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
          return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
      }
      vec3 getLightProbeIndirectRadiance( const in vec3 viewDir, const in vec3 normal, const in float blinnShininessExponent, const in int maxMIPLevel ) {
          vec3 reflectVec = reflect( -viewDir, normal );
          reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
          float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );

          vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );
          vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );
          envMapColor.rgb = RGBEToLinear( envMapColor ).rgb;

          return envMapColor.rgb * envMapIntensity * .75;
      }
      vec3 getLightProbeIndirectIrradiance( const in vec3 normal, const in int maxMIPLevel ) {
          vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
          vec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );
          vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );

          return PI * envMapColor.rgb * envMapIntensity;
      }


      void main() {
          vec3 irradiance = getLightProbeIndirectIrradiance(normalize(vNormal), maxMipLevel );
          vec3 radiance = getLightProbeIndirectRadiance( normalize( vViewPosition ), normalize(vNormal), GGXRoughnessToBlinnExponent( roughness ), maxMipLevel );

          gl_FragColor = vec4( radiance, 1.0 );
      }
      `;

      let uniforms = {
        roughness: 0.5,
        envMapIntensity: { value: 1.0 },
        flipEnvMap: { value: -1.0 },
        envMap: { value: null }
      };
      var cusMtl = new THREE.ShaderMaterial({
        defines: {
          PI: 3.14159265359
        },
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs
      });
      // 测试球
      const plane = new THREE.Mesh(
        new THREE.SphereGeometry(1, 50, 50),
        cusMtl
      );
      plane.position.y = 1;
      scene.add(plane);

    }
    let water;
    function AddWater() {

      // Water

      const waterGeometry = new THREE.PlaneGeometry(10000, 10000);


      water = new Water(
        waterGeometry,
        {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load(_this.GetPublicUrl() + 'waternormals.jpg', function (texture) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          }),
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: scene.fog !== undefined
        }
      );

      water.rotation.x = - Math.PI / 2;


      scene.add(water);
      water.position.set(0, -10, 0);

      water.material.uniforms['size'].value = 4.7;


      // const maskGeometry = new THREE.PlaneGeometry(10000, 10000);
      // const maskMat  = new THREE.MeshBasicMaterial({ 
      //     transparent:true,
      //     opacity:0.3,
      //   });
      // const maskMesh = new Mesh(maskGeometry,maskMat);
      // scene.add(maskMesh);
      // maskMesh.rotation.x = - Math.PI / 2;
      // maskMesh.position.set(0, -5, 0);


    }
    function AddLensflares() {
      // lights

      // const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
      // dirLight.position.set(0, 5, 0).normalize();
      // dirLight.color.setHSL(0.1, 0.7, 0.5);
      // scene.add(dirLight);

      // lensflares
      const textureLoader = new THREE.TextureLoader();

      const textureFlare0 = textureLoader.load(_this.GetPublicUrl() + 'lensflare0.png');
      const textureFlare3 = textureLoader.load(_this.GetPublicUrl() + 'lensflare3.png');

      addLight(0.08, 0.8, 0.5, 300, 100, - 100);

      function addLight(h, s, l, x, y, z) {

        const light = new THREE.PointLight(0xffffff, 1.5, 2000);
        light.color.setHSL(h, s, l);
        light.position.set(x, y, z);
        scene.add(light);

        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        light.add(lensflare);

      }


    }
    function onPointerDown(event) {
      // console.log(" player pos = >", pos);

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const found = raycaster.intersectObjects(scene.children, true);
      // console.log(found);
      if (found.length > 0) {
        let all = "";
        for (let i = 0; i < found.length; i++) {
          const hitObj = found[i].object;
          if (hitObj.isMesh) {
            all += hitObj.name + "、";
            // console.log(" 鼠标位置的模型 ", hitObj);

            // all += hitObj.material.name +  "、";
          }
        }
        console.log(" 鼠标位置的模型 ", all);

      }

    }

    //实时刷新
    function render() {
      requestAnimationFrame(render);

      water.material.uniforms['time'].value += 1.0 / 100.0;


    }



    InitFn();
  }
}

export { SceneManager };