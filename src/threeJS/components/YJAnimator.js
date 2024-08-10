


// 动画组件。不含模型，模型由外部传入


import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';

class YJAnimator {
  constructor(model, animations) {

    let scope = this;
    // 创建一个时钟对象Clock
    var clock = new THREE.Clock();

    var mixer = null;//声明一个混合器变量
    let hotPointData = null;

    let animCount = 0;
    let actions = [];
    var updateId = null;
    let currentTime = 0;
    let oldAnimName = "";

    let currentAction = null;
    let currentDuration = 100;
    let animNameFullback = "";
    this.GetCurrentTime = function () {
      return { time: currentTime, duration: currentDuration };
    }
    this.SetCurrentTime = function (e) {
      currentAction.time = e;
    }
    this.GetAnimation = function () {
      return animations;
    }

    let animationsData = [];
    this.SetAnimationsData = function (v) {
      // animationsData = v;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        setWeight(element.action, 0, element.timeScale);
      }
      actions = [];
      for (let j = 0; j < animations.length; j++) {
        mixer.clipAction(animations[j]).setEffectiveWeight(0);
      }
    }

    this.ChangeAnimDirect = function (animName) {
      oldAnimName = "";
      this.ChangeAnim(animName);
    }
    this.ChangeAnim = function (animName, _animNameFullback) {
      // _animNameFullback 为回滚动作，当无animName动作，使用回滚动作
      // console.error(" in change anim ", animName,oldAnimName,_animNameFullback); 
      if (oldAnimName == animName) { return; }
      animNameFullback = _animNameFullback;
      oldAnimName = animName;
      if (activateAllActions(animName)) {

      } else {
        let message = scope.transform.GetMessage();
        if (message == null) {
          return false;
        }
        // console.error(" in 加载扩展动作 ", animName,oldAnimName); 
        let messageData = message.data;
        if (messageData.avatarData) {
          _Global.CreateOrLoadPlayerAnimData().GetExtendAnim(messageData.avatarData.id, animName, (isLoop, anim) => {
            if (anim != null) {
              scope.ChangeAnimByAnimData(animName, isLoop, anim);
            } else {
              ChangeAnimFn(animNameFullback);
            }
          });
        } else {
          // console.log(" messageData ",messageData);
          _Global.CreateOrLoadPlayerAnimData().GetExtendAnim(messageData.id, animName, (isLoop, anim) => {
            if (anim != null) {
              scope.ChangeAnimByAnimData(animName, isLoop, anim);
            } else {
              ChangeAnimFn(animNameFullback);
            }
          });
        }
      }
      //
      return false;
    }

    // 动作混合
    //animName上半身 ， animName0 下半身
    this.layerBlendPerbone = function (animName, animName0, boneName) {
      for (let i = 0; i < actions.length; i++) {
        const e = actions[i];
        if (e.animName == (animName + animName0)) {
          return e.action;
        }
      }
      // 以boneName为界，提取animName的上半身数据，提取animName0的下半身数据，组合成新的动作数据
      let action0 = null;
      let action1 = null;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          action0 = element.action;
        }
        if (element.animName == animName0) {
          action1 = element.action;
        }
      }
      if (action0 == null) {
        scope.ChangeAnim(animName);
        return null;
      }
      if (action1 == null) {
        scope.ChangeAnim(animName0);
        return null;
      }
      //获取上下半身的骨骼
      // let allBone = scope.transform.GetComponent("MeshRenderer").GetAllBone(); 
      let mixamorigSpine, mixamorigLeftUpLeg, mixamorigRightUpLeg;
      mixamorigSpine = scope.transform.GetComponent("MeshRenderer").GetAllBoneInParent("mixamorigSpine");
      mixamorigLeftUpLeg = scope.transform.GetComponent("MeshRenderer").GetAllBoneInParent("mixamorigLeftUpLeg");
      mixamorigLeftUpLeg.push("mixamorigHips");
      mixamorigRightUpLeg = scope.transform.GetComponent("MeshRenderer").GetAllBoneInParent("mixamorigRightUpLeg");
      for (let i = 0; i < mixamorigRightUpLeg.length; i++) {
        mixamorigLeftUpLeg.push(mixamorigRightUpLeg[i]);
      }
      // console.log("action0 ",action0);
      // console.log("action1 ",action1);

      let tracks_spine = cutAction(mixamorigSpine, action0._clip);
      let tracks_leftleg = cutAction(mixamorigLeftUpLeg, action1._clip);
      // let tracks_rightleg = cutAction(mixamorigRightUpLeg,action1._clip);

      let tracks = [];
      for (let i = 0; i < tracks_spine.length; i++) {
        tracks.push(tracks_spine[i]);
      }
      let animname = animName + animName0 + "_" + animName;
      let anim = new THREE.AnimationClip(animname, -1, tracks); anim.optimize();
      let action = mixer.clipAction(anim);
      actions.push({
        action: action,
        targetIndex: animations.length - 1, animName: animname, timeScale: 1, weight: 1
        , isLoop: true
      });

      tracks = [];
      for (let i = 0; i < tracks_leftleg.length; i++) {
        tracks.push(tracks_leftleg[i]);
      }
      animname = animName + animName0 + "_" + animName0;
      anim = new THREE.AnimationClip(animname, -1, tracks); anim.optimize();
      action = mixer.clipAction(anim);
      // console.log(action);
      actions.push({
        action: action,
        targetIndex: animations.length - 1, animName: animname, timeScale: 1, weight: 1
        , isLoop: true
      });
      activateAllActions2(animName + animName0 + "_" + animName, animName + animName0 + "_" + animName0);

    }
    function activateAllActions2(animName, animName0) {

      for (let j = 0; j < animations.length; j++) {
        mixer.clipAction(animations[j]).setEffectiveWeight(0);
      }

      let has = false;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        setWeight(element.action, 0, element.timeScale);
        if (element.animName == animName) {
          has = true;
        }
      }
      if (has) {
        for (let i = 0; i < actions.length; i++) {
          const element = actions[i];
          if (element.animName == animName || element.animName == animName0) {
            setWeight(element.action, element.weight, element.timeScale);
            if (element.action != undefined) {
              element.action.reset();
              element.action.play();
            }
          }
        }
        return true;
      }
      return false;
    }
    function cutAction(boneRefList, anim) {
      let tracks = [];
      for (let i = 0; i < anim.tracks.length; i++) {
        const track0 = anim.tracks[i];
        for (let j = 0; j < boneRefList.length; j++) {
          const mmdBone = boneRefList[j];
          if ((track0.name) == (mmdBone + ".position")) {
            const trackName = track0.name;
            const times = track0.times;
            const values = track0.values;
            const track = new THREE.VectorKeyframeTrack(trackName, times, values);
            tracks.push(track);
          }
          if ((track0.name) == (mmdBone + ".quaternion")) {
            const trackName = track0.name;
            const times = track0.times;
            const values = track0.values;
            const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
            tracks.push(track);
          }
        }

      }
      return tracks;
    }


    function ChangeAnimFn(animName) {
      if (activateAllActions(animName)) {

      } else {
        let message = scope.transform.GetMessage();
        if (message == null) {
          return false;
        }
        // console.error(" in 加载扩展动作 ", animName,oldAnimName); 

        let messageData = message.data;
        if (messageData.avatarData) {
          _Global.CreateOrLoadPlayerAnimData().GetExtendAnim(messageData.avatarData.id, animName, (isLoop, anim) => {
            if (anim != null) {
              scope.ChangeAnimByAnimData(animName, isLoop, anim);
            }
          });
        } else {
          // console.log(" messageData ",messageData);
          _Global.CreateOrLoadPlayerAnimData().GetExtendAnim(messageData.id, animName, (isLoop, anim) => {
            if (anim != null) {
              scope.ChangeAnimByAnimData(animName, isLoop, anim);
            }
          });
        }
      }
      //
      return false;
    }



    this.ChangeAnimByIndex = function (i, timeScale) {

      if (i >= actions.length) {
        let message = scope.transform.GetMessage();
        if (message == null) {
          return false;
        }
        console.error(" in 加载扩展动作 ",message); 

        let messageData = message.data;
        if (messageData.animationsExtendData) {
          let animName = messageData.animationsExtendData[i].animName;
          _Global.CreateOrLoadPlayerAnimData().PlayExtendAnim(messageData, animName, (isLoop, anim) => {
            if (anim != null) {
              scope.ChangeAnimByAnimData(animName, isLoop, anim);
            }
          });
        } 

        return false;
      }

      for (let j = 0; j < actions.length; j++) {
        actions[j].action.setEffectiveWeight(0);
      }

      let action = (actions[i].action);
      action.timeScale = timeScale? parseInt(timeScale):1;
      action.setEffectiveWeight(1);
      action.setEffectiveTimeScale(1);

      action.reset();
      action.play();//播放动画 
      currentAction = action;
      currentTime = 0;
      currentDuration = currentAction._clip.duration;
      console.log("切换动画",action);
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
      // console.error("添加扩展动画 ", animName);

      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          // console.error("添加扩展动画 重复 ", animName, animations, actions);
          return;
        }
      }

      let action = mixer.clipAction(anim);
      if (isLoop != undefined && !isLoop) {
        action.loop = THREE.LoopOnce; //不循环播放
        action.clampWhenFinished = true;//暂停在最后一帧播放的状态
      }

      actions.push({
        action: action,
        targetIndex: animations.length - 1, animName: animName, timeScale: 1, weight: 1
        , isLoop: isLoop
      });
      activateAllActions(animName);

      // console.log("添加扩展动画 完成 ", animName);

    }

    function activateAllActions(animName) {

      for (let j = 0; j < animations.length; j++) {
        mixer.clipAction(animations[j]).setEffectiveWeight(0);
      }
      let has = false;
      for (let i = 0; i < actions.length; i++) {
        const element = actions[i];
        if (element.animName == animName) {
          has = true;
        }
      }
      if (has) {

        if (currentAction) {
          for (let i = 0; i < actions.length; i++) {
            const element = actions[i];
            if (currentAction != element.action) {
              element.action.setEffectiveWeight(0);
              element.action.setEffectiveTimeScale(0);
            }

            if (element.animName == animName) {
              let action = element.action; 
              action.reset();
              action.play();
              ClampAnim(currentAction, action, () => {
                currentAction = action;
                currentTime = 0;
                currentDuration = currentAction._clip.duration;
              })
            }
          }
          return true;
        }

        for (let i = 0; i < actions.length; i++) {
          const element = actions[i];
          setWeight(element.action, element.animName == animName ? element.weight : 0, element.timeScale);
          if (element.animName == animName) {
            if (element.action != undefined) {
              element.action.reset();
              element.action.play();
            }
            // console.log("播放动画 00 ", animName,element.action._clip.duration);
            currentAction = element.action;
            currentTime = 0;
            currentDuration = currentAction._clip.duration;
          }
        }

        return true;
      }
      return false;
    }


    function TweenAlpha(from, _to, duration, update, onComplete) {
      let current = from.clone();
      let to = _to.clone();
      let movingTween = new TWEEN.Tween(current).to(to, duration).easing(TWEEN.Easing.Linear.None)
      let updateTargetPos = () => {
        if (update) {
          update(current.x);
        }
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }

    function ClampAnim(oldAction, newAction, callback) {

      let _from = new THREE.Vector3(1, 1, 1);
      let _to = new THREE.Vector3(0, 0, 0);
      TweenAlpha(_from, _to, 0.21 * 1000, (f) => {
        oldAction.setEffectiveWeight(f);
        oldAction.setEffectiveTimeScale(f);
        newAction.setEffectiveWeight(1 - f);
        newAction.setEffectiveTimeScale(1 - f);
      }, () => {
        if (callback) {
          callback()
        }
      });
    }
    function setWeight(action, weight, scale) {
      if (action == undefined) { return; }
      action.enabled = true;
      oldScale = scale;
      action.setEffectiveTimeScale(scale);
      action.setEffectiveWeight(weight);
    }
    this.Destroy = function () {
      actions = [];
      animations = [];
      mixer = null;
      cancelAnimationFrame(updateId);
    }
    let oldScale = 0;
    this.SetActionScale = function (scale) {
      if (!currentAction) {
        return;
      }
      scale = scale.toFixed(1);
      if (oldScale == scale) {
        return;
      }
      // console.log(" 动画scale " ,scale);
      oldScale = scale;
      currentAction.setEffectiveTimeScale(scale);
    }


    // 动画物体的同步。 用服务器统一的偏移时间来计算同步
    this.SetState = function (state) {
      let offsetTime = state.offsetTime;
      offsetTime = parseInt(offsetTime % currentDuration / 1000);
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
      actions.forEach(function (action) {
        if (action.action != undefined) {
          action.action.paused = true;
        }
      });
    }

    function unPauseAllActions() {
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
        console.log("第二段动画时长 " + actions['two'].action._clip.duration);
        later = setTimeout(() => {
          PlayAnimFn("three");
          if (callback) {
            callback();
          }
        }, Math.floor(actions['two'].action._clip.duration * 1000));
      }

    }

    this.PlayAnim2 = function (e, callback) {

      PlayAnimFn(e);
      if (e == "two") {
        console.log("第二段动画时长 " + actions['two'].action._clip.duration);
        later = setTimeout(() => {
          PlayAnimFn("one");
        }, Math.floor(actions['two'].action._clip.duration * 1000));
      }
    }

    this.UpdateModel = function (model, _animations) {
      mixer = new THREE.AnimationMixer(model);
      animations = _animations;
      actions = [];
      update();
    }
    function Init() {

      if (model == null) {
        return;
      }

      mixer = new THREE.AnimationMixer(model);

      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          item.frustumCulled = false;  //解决物体在某个角度不显示的问题
        }
      });

      mixer.addEventListener('finished', function (e) {
        scope.applyEvent("动作结束");
      });

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



      for (let i = 0; i < animCount; i++) {
        playActinByIndex(i);
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
      let action1 = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'A', needCut[0].start, needCut[0].end));
      let action2 = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'B', needCut[1].start, needCut[1].end));
      let action3 = mixer.clipAction(THREE.AnimationUtils.subclip(animations, 'C', needCut[2].start, needCut[2].end));
      actions.push({ name: 'one', action: action1, weight: 1, scale: 1 });
      actions.push({ name: 'two', action: action2, weight: 1, scale: 1 });
      actions.push({ name: 'three', action: action3, weight: 1, scale: 1 });
    }
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

        if (hotPointData) {

          if (hotPointData.animType == "循环播放") {
            // 默认循环 
          }

          if (hotPointData.animType == "全部同时播放") {

          }

          if (hotPointData.animType == "来回播放") {
            currentAction.loop = THREE.LoopPingPong; // 乒乓循环播放 
            // console.log(" 来回播放 ");
          }

        } else {
        }
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

    let eventList = [];
    // 添加事件监听
    this.addEventListener = function (e, fn) {
      eventList.push({ eventName: e, fn: fn });
    }
    // 执行事件
    this.applyEvent = function (e, v, v2) {
      for (let i = 0; i < eventList.length; i++) {
        const element = eventList[i];
        if (element.eventName == e) {
          element.fn(v, v2);
        }
      }
    }

    function update() {
      updateId = requestAnimationFrame(update);

      if (mixer !== null) {
        //clock.getDelta()方法获得两帧的时间间隔
        // 更新混合器相关的时间
        mixer.update(clock.getDelta());
        if (currentAction) {
          currentTime = currentAction.time;
          // console.log("执行模型动画 中 ",currentTime);
        }
        // currentTime = mixer.time; 
        // console.log("执行模型动画 中 ",currentTime);
        // console.log("执行动画 中 ",mixer);
      }

    }

  }
}
export { YJAnimator };