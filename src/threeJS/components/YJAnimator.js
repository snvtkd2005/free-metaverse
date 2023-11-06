


// 动画组件。不含模型，模型由外部传入


import * as THREE from "three";

class YJAnimator {
  constructor(model, animations, msg) {

    let scope = this;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var mixer = null;//声明一个混合器变量
    let oneAction, twoAction, threeAction;
    let oneActionDuration = 0;
    let hotPointData = null;

    let animCount = 0;
    let actions = [];


    var updateId = null;
    let currentTime = 0;
    let oldAnimName = "";

    this.GetAnimation = function () {
      return animations;
    }
    let animationsData = [];
    this.SetAnimationsData = function (v) {
      // animationsData = v;
    }
    this.ChangeAnim = function (animName) {
      if (oldAnimName == animName) { return; }
      // console.log(" in change anim ", animName); 
      if (activateAllActions(animName)) {

      } else {
        let messageData = scope.transform.GetMessage().data;
        if (messageData.avatarData) {
          _Global.CreateOrLoadPlayerAnimData().GetExtendAnim(messageData.avatarData.name, animName, (isLoop, anim) => {
            scope.ChangeAnimByAnimData(animName, isLoop, anim);
          });
        } else {
          _Global.CreateOrLoadPlayerAnimData().GetExtendAnim(messageData.name, animName, (isLoop, anim) => {
            scope.ChangeAnimByAnimData(animName, isLoop, anim);
          });
        }
      }
      oldAnimName = animName;
      //
      return false;
    }
    this.ChangeAnimByIndex = function (i, timeScale) {
      if (i >= animations.length) {
        return false;
      }


      console.log(i, animations, timeScale);
      for (let j = 0; j < animations.length; j++) {
        // mixer.clipAction(animations[i]).stop();
        mixer.clipAction(animations[i]).setEffectiveWeight(0);
      }
      let action = mixer.clipAction(animations[i]);
      action.timeScale = parseInt(timeScale);
      action.setEffectiveWeight(1);
      action.reset();
      action.play();//播放动画 
      // console.log("切换动画",animations[i]);
      return true;
    }

    this.ChangeAnimIsLoop = function (animName, isLoop) {
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          element.isLoop = isLoop;
          if (element.isLoop) {
            mixer.clipAction(animations[i]).loop = THREE.LoopRepeat;
          } else {
            mixer.clipAction(animations[i]).loop = THREE.LoopOnce;
            mixer.clipAction(animations[i]).clampWhenFinished = true;//暂停在最后一帧播放的状态
          }
          mixer.clipAction(animations[i]).reset();
          mixer.clipAction(animations[i]).play();
        }
      }
      oldAnimName = animName;

    }

    this.ChangeAnimByAnimData = function (animName, isLoop, anim) {
      if (animName == "") { return; }
      // console.log("添加扩展动画 ", animName);

      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          console.log("添加扩展动画 重复 ", animName, animations, actions);
          return;
        }
      }

      let action = mixer.clipAction(anim);
      if (isLoop != undefined && !isLoop) {
        action.loop = THREE.LoopOnce; //不循环播放
        action.clampWhenFinished = true;//暂停在最后一帧播放的状态
      }

      animations.push(anim);
      actions.push({
        action: action,
        targetIndex: animations.length - 1, animName: animName, timeScale: 1, weight: 1
        , isLoop: isLoop
      });
      activateAllActions(animName);

      // console.log("添加扩展动画 完成 ", animName);

    }
    function activateAllActions(animName) {

      let has = false;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          has = true;
        }
      }
      if (has) {
        for (let i = 0; i < actions.length; i++) {
          const element = actions[i];
          setWeight(element.action, element.animName == animName ? element.weight : 0, element.timeScale);
          if (element.animName == animName) {
            if (element.action != undefined) {
              element.action.reset();
              element.action.play();
            }
            // console.log("播放动画 ", animName,element.action._clip.duration);

          }
        }
        oldAnimName = animName;

        return true;
      }
      return false;
    }
    function setWeight(action, weight, scale) {
      if (action == undefined) { return; }
      action.enabled = true;
      action.setEffectiveTimeScale(scale);
      action.setEffectiveWeight(weight);
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
    this.Destroy = function () {
      actions = [];
      animations = [];
      mixer = null;
      cancelAnimationFrame(updateId);
    }


    // 动画物体的同步。 用服务器统一的偏移时间来计算同步
    this.SetState = function (state) {
      let offsetTime = state.offsetTime;
      offsetTime = parseInt(offsetTime % oneActionDuration / 1000);
      this.SetCurrentTime(offsetTime);
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
        this.RewindPlay();
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

    this.UpdateModel = function (model, _animations) {
      mixer = new THREE.AnimationMixer(model);
      animations = _animations;
      actions = [];
      update();
    }
    function Init() {
      mixer = new THREE.AnimationMixer(model);
      animCount = animations.length;
      try {
        for (let i = 0; i < animCount; i++) {
          let action = mixer.clipAction(animations[i]);
          actions.push({ name: animations.animName, action: action, weight: 1, scale: 1, isLoop: true });
        }

      } catch (error) {
        console.log("加载动画物体 出错 ", name);
        return;
      }


      if (hotPointData) {

        if (hotPointData.animType == "循环播放") {
          // 默认循环 

        }

        if (hotPointData.animType == "全部同时播放") {
          for (let i = 0; i < animCount; i++) {
            playActinByIndex(i);
          }
        }

        if (hotPointData.animType == "来回播放") {
          oneAction.loop = THREE.LoopPingPong; // 乒乓循环播放
          if (threeAction) {
            threeAction.loop = THREE.LoopPingPong; // 乒乓循环播放
          }
          // console.log(" 来回播放 ");
        }

      } else {
        for (let i = 0; i < animCount; i++) {
          playActinByIndex(i);
        }
      }

      playActinByIndex(0);

      update();
    }
    function playActinByIndex(i) {
      if (actions.length <= i) { return; }
      let action = actions[i];
      setWeight(action.action, action.weight, action.scale);
      action.action.reset();
      action.action.play();
    }
    function RewindPlayActinByIndex(i) {
      let action = actions[i];
      setWeight(action.action, action.weight, action.scale);
      action.action.play();
    }

    Init();

    this.SetScale = (scale, index) => {
      if (index == undefined) {
        for (let i = 0; i < animCount; i++) {
          actions[i].scale = scale;
          actions[i].action.setEffectiveTimeScale(scale);
        }
      } else {
        for (let i = 0; i < animCount; i++) {
          if (index == i) {
            actions[i].scale = scale;
            actions[i].action.setEffectiveTimeScale(scale);
          }
        }
      }
    }
    this.SetLoop = (loop, index) => {
      if (index == undefined) {
        for (let i = 0; i < animCount; i++) {

          actions[i].action.loop = loop ? THREE.LoopPingPong : THREE.LoopOnce;
          actions[i].action.clampWhenFinished = !loop;//暂停在最后一帧播放的状态
        }
      } else {
        for (let i = 0; i < animCount; i++) {
          if (index == i) {
            actions[i].action.loop = loop ? THREE.LoopPingPong : THREE.LoopOnce;
            actions[i].action.clampWhenFinished = !loop;//暂停在最后一帧播放的状态
          }
        }
      }
    }

    // 倒放
    this.RewindPlay = function () {
      for (let i = 0; i < animCount; i++) {
        if (actions[i].scale > 0) {
          actions[i].scale = -1 * actions[i].scale;
        }
        actions[i].action.paused = false;
      }
      RewindPlayActinByIndex(0);
    }
    this.ResetPlay = function () {
      for (let i = 0; i < animCount; i++) {

        let action = actions[i];
        if (action.scale < 0) {
          action.scale = -1 * actions[i].scale;
        }

        setWeight(action.action, action.weight, action.scale);
        action.action.reset();
        action.action.play();
      }
    }

    // 停止动画。scale设为0
    this.Stop = function () {
      for (let i = 0; i < animCount; i++) {
        let action = actions[i];
        setWeight(action.action, action.weight, 0);
        action.action.reset();
        action.action.play();
      }
    }


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
        console.log("播放" + action.name);
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


    function update() {
      updateId = requestAnimationFrame(update);

      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
        // currentTime = mixer.time;
        // currentTime = oneAction.time; 
        // console.log("执行模型动画 中 ",currentTime);
        // console.log("执行动画 中 ",mixer);
      }

    }

  }
}
// oneAction.timeScale = 1; //默认1，可以调节播放速度
// oneAction.clampWhenFinished = false;//暂停在最后一帧播放的状态
// oneAction.enabled = true;
export { YJAnimator };