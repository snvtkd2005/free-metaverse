import * as THREE from "three";

import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "three/examples/jsm/animation/MMDAnimationHelper.js";

import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';

// 加载MMD 模型和动画
class YJMMD {
  constructor(_this, scene, listener, modelPath, pos, isPlay, state) {

    var clock = new THREE.Clock();
    let model, helper, ikHelper, physicsHelper;

    let ready = false;
    let vmdPath = _this.$publicUrl + "models/mmd/Kizuna/classic.vmd";
    let inLoading = false;
    function loadMMD() {
      if (inLoading) { return; }

      // console.log("加载初音");
      inLoading = true;

      helper = new MMDAnimationHelper({
        afterglow: 2.0
      });

      const modelFile = modelPath;
      // const modelFile = '/models/mmd/miku/miku_v2.pmd';
      // const vmdFiles = [ '/models/mmd/vmds/wavefile_v2.vmd' ];



      // const modelFile = '/models/mmd/Kizuna/Kizuna Ai [Base] by Justdesuchan.pmx';
      // const vmdFiles = [ '/models/mmd/Kizuna/classic.vmd' ];

      // const modelFile = '/models/mmd/Kizuna/Kizuna Ai [Lovely Bun Bun] by Justdesuchan.pmx';
      const vmdFiles = [vmdPath];

      // const vmdFiles = [ '/models/mmd/Kizuna/classic.vmd', '/models/mmd/vmds/wavefile_v2.vmd' ];

      const audioFile =_this.$publicUrl + 'models/mmd/audios/wavefile_short.mp3';
      const audioParams = { delayTime: 160 * 1 / 30 };

      // model

      function onProgress(xhr) {

        if (xhr.lengthComputable) {

          const percentComplete = xhr.loaded / xhr.total * 100;
          // console.log(Math.round(percentComplete, 2) + '% downloaded');

        }

      }
      const loader = new MMDLoader();

      loader.loadWithAnimation(modelFile, vmdFiles, function (mmd) {

        model = mmd.mesh;




        // mixer = new THREE.AnimationMixer(mesh);
        //     console.log(mmd.animation);
        // var action = mixer.clipAction(mmd.animation);
        // // mmd.animation.play();
        // action.play();

        try {

          helper.add(model, {
            animation: mmd.animation,
            physics: false
          });

          // ikHelper = helper.objects.get(model).ikSolver.createHelper();
          // ikHelper.visible = false;
          // scene.add(ikHelper);

          // physicsHelper = helper.objects.get(model).physics.createHelper();
          // physicsHelper.visible = false;
          // scene.add(physicsHelper);

          new THREE.AudioLoader().load(audioFile, function (buffer) {

            const audio = new THREE.PositionalAudio(listener);
            //音频有效区域
            // positionalAudio.setDirectionalCone(180, 230, 0.1);
            audio.setBuffer(buffer);
            // audio.setRefDistance(1);
            audio.setRefDistance(0.0);
            // audio.setRefDistance(0.1);
            // audio.setRefDistance(0.5);
            audio.setLoop(true);
            // audio.play();


            // const AudioHelper = new PositionalAudioHelper( positionalAudio, 0.1 );
			      // positionalAudio.add( AudioHelper );

            // const audio = new THREE.Audio(listener).setBuffer(buffer);
            helper.add(audio, audioParams);


            model.position.set(pos.x, pos.y, pos.z); // 
            var size = 0.1;
            model.scale.set(size, size, size);

            model.traverse(function (item) {
              if (item instanceof THREE.Mesh) {
                item.castShadow = true;
                item.receiveShadow = true;
                item.name = "ignoreRaycast";
              }
            });

            scene.add(model);
            model.add(audio);
            audio.position.set(0,0,0); // 

            ready = true;

      LoadCompleted();


          }, onProgress, null);


          inLoading = false;

        } catch (error) {
          console.log("加载初音错误，重新加载", error);
          inLoading = false;
          reload();
          return;

        }

        // inLoading = false;

        // initGui();
        update();
      }, onProgress, null);

    }

    this.ChangePose = function (_vmdPath) {

      // console.log(" 同步 mmd 状态");

      vmdPath = _vmdPath;

      if (model != null) {
        scene.remove(model);
      }
      if (physicsHelper != null) {
        scene.remove(physicsHelper);
      }
      if (ikHelper != null) {
        scene.remove(ikHelper);
      }

      loadMMD();

    }
    function reload() {
      cancelAnimationFrame(updateId);

      if (model != null) {
        scene.remove(model);
      }
      if (physicsHelper != null) {
        scene.remove(physicsHelper);
      }
      if (ikHelper != null) {
        scene.remove(ikHelper);
      }

      loadMMD();
    }


    //服务器接收，获取模型状态，更新本地 
    this.SetState = function (state) {
      // console.log("切换mmd 状态", state);
      // console.log("切换mmd  22 状态", state.animName);

      // 
      if (state.animName == undefined) {
        state = JSON.parse(state);
        // console.log("切换mmd 333 状态", state.animName);
        if (state.animName == undefined) {
          loadMMD();
          return;
        }
        // return;
      }

      // state: {mmdName:"初音",animName:"classic"}
      this.ChangePose(state.animName);
    }
    function Init() {
      // const listener = new THREE.AudioListener();
      // camera.add(listener);
      if (isPlay) {
        vmdPath = state.animName;
        loadMMD();
      }
      // SetState(state);
      // loadMMD("", 0.01);
    }

    Init();

    function LoadCompleted(){
      _this._YJSceneManager.LoadSingleModelCompleted();
    }
    //删除模型
    this.Destroy = function () {
      LoadCompleted();
      //删除碰撞体 
      if (model != null) {
        scene.remove(model);
      }
      if (physicsHelper != null) {
        scene.remove(physicsHelper);
      }
      if (ikHelper != null) {
        scene.remove(ikHelper);
      }
      cancelAnimationFrame(updateId);
    }
    var updateId = null;
    function update() {

      if (ready) {
        helper.update(clock.getDelta());
      }
      updateId = requestAnimationFrame(update);

    }
    this._update =function() {

      if (ready) {
        helper.update(clock.getDelta());
      }
      // updateId = requestAnimationFrame(update);

    }
  }
}

export { YJMMD };