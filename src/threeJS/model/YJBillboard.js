import * as THREE from "three";

import { YJ3DAudio } from "../YJ3DAudio";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; 

// 广告牌/LED , 展示图片或视频
class YJBillboard {
  constructor(_this, scene, id,modelPath, filePath,  pos, rota,size, _state) {

    let planeMap = null;
    let planeMat = null;
    const listener = new THREE.AudioListener();

    let model = null;
    let hotPlane = null;
    Init();
    function Init() {

      InitPlane(size, pos, rota);
      return;

      if (filePath == null) {
        if (_state != undefined) {
          _SetState(_state);
        } else {
          ChangeContentFn("texture", _this.$publicUrl + "images/共享大屏.png");
        }
      } else {
        if (filePath.indexOf("png") > -1 || filePath.indexOf("jpg") > -1) {
          ChangeContentFn("texture",  filePath);
        }else{
          ChangeContentFn("video", filePath);
        }
      }
      // console.log("创建共享大屏,初始化数据为",id,_state);

      return;
      setTimeout(() => {
        let videoSrc = _this.$publicUrl + "video/1.mp4";
        ChangeContentFn("video", videoSrc);
        // ChangeContentFn("video", _this.$publicUrl + videoSrc);
      }, 2000);
      // return;

      setTimeout(() => {
        ClearContent();
        ChangeContentFn("texture", _this.$publicUrl + "images/player/1.png");
      }, 5000);

      setTimeout(() => {
        ClearContent();
        let videoSrc = _this.$publicUrl + "video/1.mp4";
        ChangeContentFn("video", videoSrc);
        // ChangeContentFn("video", _this.$publicUrl + videoSrc);
      }, 8000);

    }
    function InitPlane(size, pos, rota) {
      planeMat = new THREE.MeshBasicMaterial({ map: planeMap,color:0xffffff });

      const loader = new GLTFLoader();
      // loader.setDRACOLoader( dracoLoader );
      loader.load(modelPath, function (gltf) {
        model = gltf.scene; 
        // console.log("in loadmodel gltf " + name,pos , model);
        model.position.set(pos.x, pos.y, pos.z); //  
        model.rotation.set(rota.x, rota.y, rota.z);
        model.scale.set(size.x, size.y, size.z);
        scene.add(model);  

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) { 
            item.material = planeMat; 
          }
        });


        if (filePath == null) {
          if (_state != undefined) {
            _SetState(_state);
          } else {
            ChangeContentFn("texture", _this.$publicUrl + "images/共享大屏.png");
          }
        } else {
          if (filePath.indexOf("png") > -1 || filePath.indexOf("jpg") > -1) {
            ChangeContentFn("texture",  filePath);
          }else{
            ChangeContentFn("video", filePath);
          }
        }
      });


      return;

      let planeGeometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1); // 生成平面
      planeMat = new THREE.MeshBasicMaterial({ map: planeMap });
      // material.side = THREE.DoubleSide;
      let plane = new THREE.Mesh(planeGeometry.clone(), planeMat);
      plane.position.set(pos.x, pos.y, pos.z);
      plane.rotation.set(rota.x, rota.y, rota.z);
      plane.receiveShadow = true;
      plane.name = "pptPlane";


      // let audio = new YJ3DAudio(_this,scene,listener,audioPath,pos);

      // create the PositionalAudio object (passing in the listener)
      // const sound = new THREE.PositionalAudio(listener);
      // //音频有效区域
      // sound.setDirectionalCone(180, 230, 0.1);
      // const audioLoader = new THREE.AudioLoader().load(
      //   audioFile,
      //   function (buffer) {
      //     sound.setBuffer(buffer);
      //     sound.setRefDistance(1);
      //     sound.setLoop(true);
      //     sound.play();
      //   }
      // );
      // plane.add(sound);

      // const audioElement = document.getElementById("music");
      // audioElement.play();
      // const positionalAudio = new THREE.PositionalAudio(listener);
      // positionalAudio.setMediaElementSource(audioElement);
      // positionalAudio.setRefDistance(2);
      // positionalAudio.setDirectionalCone(180, 230, 0.1);

      // const helper = new PositionalAudioHelper(positionalAudio, 0.1);
      // positionalAudio.add(helper);
      // plane.add(positionalAudio);

      model = plane;
      scene.add(model); // 向该场景中添加物体
      return;
      // console.log("创建面片 ppt ");
      CreateHotPoint(plane, pos, size);
    }
    function CreateHotPoint(parent, pos, size) {

      let planeGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1); // 生成平面
      let planeMaterial = new THREE.MeshBasicMaterial({
        // alphaTest:true,
        transparent: true,
        color: 0xffff00,
        // color: 0xffffff,
      }); // 材质
      const map = new THREE.TextureLoader().load(
        _this.$publicUrl + "images/new_spotd07_gif.png"
      );

      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.matrixAutoUpdate = false; // set this to false to update texture.matrix manually

      planeMaterial.map = map;
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      parent.add(plane);


      pos = new THREE.Vector3(-size.x / 2 - 0.1 + pos.x, -size.y / 2 - 0.1 + pos.y, 0.1 + pos.z);
      // let pos = new THREE.Vector3(-size.w/2 - 0.1 + pos.x, -size.h/2- 0.1 + pos.y,0.1 + pos.z);
      // let pos = new THREE.Vector3(1, 1,1);
      // let rotaV3 = new THREE.Vector3(_rotaV3.x, _rotaV3.y, _rotaV3.z);
      plane.position.set(pos.x, pos.y, pos.z);
      // plane.rotation.set(rotaV3.x, rotaV3.y, rotaV3.z);
      // plane.name = "qq";
      plane.tag = "hotPoint";
      let modelData = { id: id, type: 3 };
      // let modelData = { id: planeId, type: "ppt" };
      // modelData.push({id:item.id,type:item.type});
      plane.modelData = modelData;
      // plane.modelId=item.modelId;
      plane.lookAt(0, 0, 0);

      hotPlane = plane;
      // scene.add(plane); // 向该场景中添加物体
      _this.pointsParent.add(hotPlane);

      setTimeout(() => {
        _this._YJSceneManager.AddHotPoint(hotPlane);
      }, 1000);
      LoadCompleted();

    }
    // this.ChangeContent = function (type, path) {
    //   ChangeContentFn(type, path);
    //   _this.SendSceneState(id, name, { type:type,path: path});
    // }
    function ChangeContentFn(type, path) {
      ClearContent();
      if (type == "video") {
        CreateVideo(path);
      }
      if (type == "texture") {
        CreateTexture(path);
      }

    }

    //清除内容。 清除视频标签
    function ClearContent() {
      for (let i = _this.videoList.length - 1; i >= 0; i--) {
        const item = _this.videoList[i];
        if (item.id == id) {
          _this.videoList.splice(i, 1);
        }
      }
    }
    //创建视频
    function CreateVideo(path) {
      // const base = `<div id="${
      //   "remote_stream-" + streamId
      // }" style="${videoStyle} " ></div>`;
      //视频地址不可用完整路径， 应从index.html所在位置开始

      //不可以："https://www.snvtkd2005.com/vue/yjwebgame/public/";
      // 可以："public/";  即相对路径   index.html 在yjwebgame文件夹中
      // console.log("播放视频，地址为 " + path);

      let videoId = id;
      const base = `<video id="${videoId
        }"  loop src="${path}" ></video>`;
      // x5-video-player-type="h5"
      _this.videoList.push({ id: videoId, html: base });

      // const audioFile = '/video/bg.wav';
      // const audioFile = "/video/bg.ogg";
      const audioParams = { delayTime: (160 * 1) / 30 };

      _this.$nextTick(function () {
        const video = document.getElementById(videoId);
        video.play();
        planeMap = new THREE.VideoTexture(video);
        planeMat.map = planeMap;
      });

    }
    function CreateTexture(path) {
      console.log("加载 广告牌 贴图 " ,path);
      const map = new THREE.TextureLoader().load(
        path
      );
      planeMat.map = map;
      // planeMat.color = Color.;
    }

    //同步服务器上的其他客户端创建的模型的状态
    function _SetState(_state) {
      ChangeContentFn(_state.type, _state.path);
    }
    this.SendState = function (state) {
      // console.log(" 发送数据 ppt " ,state);
      ChangeContentFn(state.type, state.path);
      // _this.SendSceneState(id, name, state);
    }
    this.SetState = function (state) {
      // console.log("接收到同步数据 ppt " ,state);
      ChangeContentFn(state.type, state.path);
    }

    function LoadCompleted() {
      _this._YJSceneManager.LoadSingleModelCompleted();
    }
    this.Destroy = function () {
      LoadCompleted();

      if (model == null) { return; }
      this.DestroyCollider();
      _this._YJSceneManager.RemoveHotPoint(hotPlane);
      _this.pointsParent.remove(hotPlane);
      scene.remove(model);
    }
    this.DestroyCollider = function () {
      if (model != null) {
        //删除碰撞体 
        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.geometry.dispose();
            item.material.dispose();
          }
        });

        hotPlane.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.geometry.dispose();
            item.material.dispose();
          }
        });
      }
    }
  }
}

export { YJBillboard };