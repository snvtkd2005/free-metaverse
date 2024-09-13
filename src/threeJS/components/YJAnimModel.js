import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
class YJAnimModel {
  constructor( scene, id, name, modelPath, pos, rota, size, msg) {


    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var mixer = null;//声明一个混合器变量
    let oneAction, twoAction, threeAction;
    let oneActionDuration = 0;
    let hotPointData = null;

    var model = null;
    let animCount = 0;
    let actions = [];
    this.GetModel = function () {
      return model;
    }

    this.id = id;
    this.GetId = function () {
      return hotPointData.id;
    }

    // 获取当前动画播放帧
    this.GetCurrentTime = function () {
      return oneAction.time;
      return mixer.time;
    }
    //设置动画播放秒，float
    this.SetCurrentTime = function (f) {
      oneAction.time = f;
    }


    // 动画物体的同步。 用服务器统一的偏移时间来计算同步
    this.SetState = function (state) {
      let offsetTime = state.offsetTime;
      offsetTime = parseInt(offsetTime % oneActionDuration / 1000);
      this.SetCurrentTime(offsetTime);
      // console.log("anim model 接收同步 ",oneActionDuration,offsetTime,);
    }

    this.Play = function () {
      unPauseAllActions();
    }
    this.Pause = function () {
      pauseAllActions();
    }
    function pauseAllActions() {
      console.log(" ======= 动画暂停 ====");
      // actions.forEach( function ( action ) {
      //   action.paused = true;
      // } );


      actions.forEach(function (action) {
        if (action.action != undefined) {
          action.action.paused = true;
        }
      });
    }

    function unPauseAllActions() {
      // actions.forEach( function ( action ) {
      //   action.paused = false;
      // } );

      actions.forEach(function (action) {
        if (action.action != undefined) {
          action.action.paused = false;
        }
      });
    }
    let later = null;
    this.PlayAnim = function (e, callback) {

      console.log("== in yjanimModel ", e);
      if (e == "rewind") {
        this.ReWindPlay();
      }

      PlayAnimFn(e);
      if (e == "two") {
        console.log("第二段动画时长 " + twoAction._clip.duration);
        later = setTimeout(() => {
          PlayAnimFn("three");
          if (callback) {
            callback();
          }
        }, Math.floor(twoAction._clip.duration * 1000));
      }

    }

    this.PlayAnim2 = function (e, callback) {

      PlayAnimFn(e);
      if (e == "two") {
        console.log("第二段动画时长 " + twoAction._clip.duration);
        later = setTimeout(() => {
          PlayAnimFn("one");
        }, Math.floor(twoAction._clip.duration * 1000));
      }
    }


    // 倒放
    this.ReWindPlay = function () {
      // PlayAnimFn2("two",-1);
      // setTimeout(() => {
      //   PlayAnimFn2("one",-1);
      // }, 2800);
    }

    //加载热点的obj 模型
    function loadFbx() {
      // console.log("加载 动画模型 fbx 模型",modelPath);

      var fbxLoader = new FBXLoader();
      fbxLoader.load(
        modelPath,
        function (object) {

          model = object;
          model.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
              item.castShadow = true;
              item.receiveShadow = true;
            }
          });


          model.position.set(pos.x, pos.y, pos.z); // 
          model.rotation.set(rota.x, rota.y, rota.z); // 
          // console.log(model);
          // model.scale.set(100, 100, 100);
          // model.scale.set(size.x, size.y, size.z);
          let size = 0.01;
          model.scale.set(size, size, size);

          model.tag = name;
          model.name = id;
          scene.add(model);

          mixer = new THREE.AnimationMixer(model);

          // console.log("加载动画物体 fbx ", model.animations);


          // mixer.clipAction(model.animations[0]).play();

          // for (let i = 0; i < model.animations.length; i++) {
          //   mixer.clipAction(model.animations[i]).play();
          // }



          oneAction = mixer.clipAction(model.animations[0]);

          if (hotPointData) {

            if (hotPointData.animType == "循环播放") {
              // 默认循环 
            }

            if (hotPointData.animType == "来回播放") {
              oneAction.loop = THREE.LoopPingPong; //不循环播放
              console.log(" 来回播放 ");
            }

          }

          // oneAction.loop = THREE.LoopRepeat; //不循环播放
          // oneAction.timeScale = 1; //默认1，可以调节播放速度
          // oneAction.clampWhenFinished = false;//暂停在最后一帧播放的状态

          // oneAction.enabled = true;

          // // oneAction.setEffectiveWeight(1);
          // // oneAction.reset();
          oneAction.play();
          oneActionDuration = oneAction._clip.duration * 1000;
          // console.log("动画长度为 ",oneActionDuration);
          update();
          LoadCompleted();
        },
      );
    }

    function Init() {

      if (modelPath.indexOf("fbx") > -1) {

        loadFbx();
        return;
      }
      

      const loader = new GLTFLoader();
      loader.setDRACOLoader(_Global.YJ3D._YJSceneManager.GetDracoLoader());
      loader.load(modelPath, function (gltf) {

        model = gltf.scene;

        model.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            // item.castShadow = true;
            // item.receiveShadow = true;
            // if (item.name.indexOf("basicColor") > -1 || item.name.indexOf("挂画") > -1) {
            //   let transparent = item.material.transparent;
            //   const material = new THREE.MeshBasicMaterial({
            //     transparent: transparent,
            //     side: THREE.DoubleSide,
            //     map: item.material.map
            //   });


            //   item.material = material;
            //   // item.material.emissiveIntensity = 0.1;
            //   // item.material.emissiveIntensity = 0.01;
            //   // // console.log(" 产品贴图 " ,item);

            // } else {
            //   item.material.emissiveIntensity = 2;
            // }

            item.frustumCulled = false;  //解决物体在某个角度不显示的问题

          }
        });

        //改变渲染层级，解决透明物体渲染重叠错乱的问题
        // if(modelPath.indexOf('dfsHUB')>-1){
        //   model.renderOrder = 1;
        // }
        if (modelPath.indexOf('dimian') > -1) {
          model.renderOrder = -1;
        }

        model.position.set(pos.x, pos.y, pos.z); // 
        model.rotation.set(rota.x, rota.y, rota.z); // 
        model.scale.set(size.x, size.y, size.z);


        model.tag = name;
        model.name = id;
        scene.add(model);


        let needCut = CheckNeedCut(name);
        if (needCut != null) {
          SetModelAnimationClip(model, gltf.animations[0], needCut);
        } else {

          mixer = new THREE.AnimationMixer(model);
          // console.log("加载动画物体 gltf " +name , model);
          // console.log("加载动画物体 gltf ", gltf.animations);
          animCount = gltf.animations.length;

          try {
            if (animCount >= 1) {
              oneAction = mixer.clipAction(gltf.animations[0]);
              actions.push({ name: 'one', action: oneAction, weight: 1, scale: 1 });
            }
            if (animCount > 1) {
              twoAction = mixer.clipAction(gltf.animations[1]);
              actions.push({ name: 'two', action: twoAction, weight: 1, scale: 1 });

              // console.log("第二段动画时长 ",twoAction,twoAction._clip.duration);
            }
            if (animCount > 2) {
              threeAction = mixer.clipAction(gltf.animations[2]);
              actions.push({ name: 'three', action: threeAction, weight: 1, scale: 1 });
            }
          } catch (error) {
            console.log("加载动画物体 出错 ", name);
            LoadCompleted();
            return;
          }
        }

        if (hotPointData) {

          if (hotPointData.animType == "循环播放") {
            // 默认循环 

          }

          if (hotPointData.animType == "全部同时播放") {
            // 默认循环 
            if (twoAction) {
              twoAction.setEffectiveWeight(1);
              twoAction.reset();
              twoAction.play();
            }
            if (threeAction) {
              threeAction.setEffectiveWeight(1);
              threeAction.reset();
              threeAction.play();
            }

            for (let i = 0; i < animCount; i++) {
              let action  = mixer.clipAction(gltf.animations[i]);
              action.setEffectiveWeight(1);
              action.reset();
              action.play();
            }

          }

          if (hotPointData.animType == "来回播放") {
            oneAction.loop = THREE.LoopPingPong; // 乒乓循环播放
            if (threeAction) {
              threeAction.loop = THREE.LoopPingPong; // 乒乓循环播放
            }
            // console.log(" 来回播放 ");
          }

        }else{
          for (let i = 0; i < animCount; i++) {
            let action  = mixer.clipAction(gltf.animations[i]);
            action.setEffectiveWeight(1);
            action.reset();
            action.play();
          }
        }



        oneAction.setEffectiveWeight(1);
        oneAction.reset();
        oneAction.play();

        oneActionDuration = oneAction._clip.duration * 1000;
        // console.log("动画长度为 ",oneActionDuration);
        update();
        LoadCompleted();

      }, undefined, function (e) {

        console.error(e);

      });

    }



    Init();


    // 动画裁切帧数。 根据模型名判断
    //MOT项目，装置模型需拆分为3段动画。大厅（模型不动就只截第一帧）、出产品过程、出产品后循环
    let animCutData = [
      { name: "wbds001", cut: [{ start: 0, end: 1 }, { start: 1, end: 299 }, { start: 300, end: 500 }] },
      { name: "zycx", cut: [{ start: 0, end: 1 }, { start: 11, end: 433 }, { start: 434, end: 500 }] },

      { name: "xzzj003", cut: [{ start: 0, end: 130 }, { start: 131, end: 499 }, { start: 500, end: 750 }] },
      { name: "zygy002", cut: [{ start: 0, end: 1 }, { start: 1, end: 140 }, { start: 141, end: 142 }] },
      { name: "zbds001", cut: [{ start: 0, end: 1 }, { start: 1, end: 399 }, { start: 400, end: 560 }] },

      { name: "zyzbsj002", cut: [{ start: 0, end: 1 }, { start: 1, end: 115 }, { start: 116, end: 120 }] },

      { name: "dfsHUB", cut: [{ start: 0, end: 599 }, { start: 600, end: 850 }, { start: 600, end: 850 }] },
      // 
    ]
    function CheckNeedCut(name) {
      // console.log("动画模型信息 ",hotPointData );
      // name = hotPointData.id;
      // console.log("查找动画拆分 " + name);
      for (let i = 0; i < animCutData.length; i++) {
        const item = animCutData[i];
        if (item.name == name) {
          return item.cut;
        }
      }
      return null;
    }

    //拆分模型动画。模型、动画、拆分起始帧结束帧
    function SetModelAnimationClip(model, animations, needCut) {
      mixer = new THREE.AnimationMixer(model);

      oneAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'A', needCut[0].start, needCut[0].end));
      twoAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'B', needCut[1].start, needCut[1].end));
      threeAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'C', needCut[2].start, needCut[2].end));

      actions.push({ name: 'one', action: oneAction, weight: 1, scale: 1 });
      actions.push({ name: 'two', action: twoAction, weight: 1, scale: 1 });
      actions.push({ name: 'three', action: threeAction, weight: 1, scale: 1 });

      // mixer = new THREE.AnimationMixer(model);

      // oneAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'A', 0, 1));
      // twoAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'B', 1, 100));
      // threeAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'C', 101, 200));

      // actions.push({name:'one',action:oneAction,weight:1,scale:1});
      // actions.push({name:'two',action:twoAction,weight:1,scale:1});
      // actions.push({name:'three',action:threeAction,weight:1,scale:1});

    }

    //     // let actions = [];
    //     // let oneAction,twoAction,threeAction;
    //     let needCut = [{start:0,end:599},{start:600,end:850},{start:600,end:850}];
    // //    SetModelAnimationClip(gltf.scene,gltf.animations[0],needCut);
    //     //拆分模型动画。模型、动画、拆分起始帧结束帧
    //     function SetModelAnimationClip(model,animations,needCut) {
    //       mixer = new THREE.AnimationMixer(model);

    //       oneAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'A', needCut[0].start,needCut[0].end));
    //       twoAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'B', needCut[1].start,needCut[1].end));
    //       threeAction = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'C',  needCut[2].start,needCut[2].end));

    //       actions.push({name:'one',action:oneAction,weight:1,scale:1});
    //       actions.push({name:'two',action:twoAction,weight:1,scale:1});
    //       actions.push({name:'three',action:threeAction,weight:1,scale:1}); 
    //     } 

    // 按动画名称播放动画。通过设置动画权重来切换不同动画
    function PlayAnimFn(e) {
      if (later != null) {
        clearTimeout(later);
      }
      actions.forEach(function (action) {
        // console.log("播放"+action.name);
        if (action.action != undefined) {
          setWeight(action.action, action.name == e ? 1 : 0, action.scale);
          action.action.reset();
          action.action.play();
        }
      });
    }

    function setWeight(action, weight, scale) {
      // console.log("切换动画 time scale  " + scale);
      if (action == undefined) { return; }
      action.enabled = true;
      action.setEffectiveTimeScale(scale * 0.95);
      action.setEffectiveWeight(weight);
    }

    function PlayAnimFn2(e, scale) {

      actions.forEach(function (action) {
        // console.log("播放"+action.name);
        // action.play();
        if (action.action != undefined) {
          setWeight(action.action, action.name == e ? 1 : 0, scale);
          action.action.reset();
          action.action.play();
        }
      });

    }


    function LoadCompleted() {
      if (_Global.YJ3D._YJSceneManager == undefined) {
        console.log("！！！注意，不应该进入此判断 。 加载动画模型 ");
        return;
      }
      _Global.YJ3D._YJSceneManager.AddProcess();

      // mixer.addEventListener('loop', function (e) {
      //   console.log(" ===== 到达模型动画 loop 点 ===== ",e); 
      // }); 
    }


    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }

      console.log(" 设置动画模型 msg = ", msg);
      //新的热点数据含 pointType 字段
      if (msg.indexOf("animType") > -1) {
        hotPointData = JSON.parse(msg);

        // console.log("hotPointData " ,hotPointData);
        // type = hotPointData.animType;
        // hotPointId = hotPointData.id;

        // console.log("hotPointData = " ,hotPointData);

      } else {
        // 不可删除，兼容旧版本
        type = msg; return;
      }


      // msg = JSON.parse(msg); 
    }
    function SetMessageFn(msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      console.log(" 设置动画模型 msg = ", msg);

      //新的热点数据含 pointType 字段
      if (msg.indexOf("animType") > -1) {
        hotPointData = JSON.parse(msg);
        // console.log(" 直接设置 动画模型 msg = " ,hotPointData,hotPointData.id);

        // console.log("hotPointData " ,hotPointData);
        // type = hotPointData.animType;
        // hotPointId = hotPointData.id;

        // console.log("hotPointData = " ,hotPointData);

      } else {
        // 不可删除，兼容旧版本
        type = msg; return;
      }


      // msg = JSON.parse(msg); 
    }



    var updateId = null;

    let currentTime = 0;

    function update() {
      updateId = requestAnimationFrame(update);

      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
        // currentTime = mixer.time;
        // currentTime = oneAction.time;
        // oneAction.time
        // console.log("执行模型动画 中 ",currentTime);
        // console.log("执行动画 中 ",mixer);
      }

    }

  }
}
// oneAction.timeScale = 1; //默认1，可以调节播放速度
// oneAction.clampWhenFinished = false;//暂停在最后一帧播放的状态
// oneAction.enabled = true;
export { YJAnimModel };