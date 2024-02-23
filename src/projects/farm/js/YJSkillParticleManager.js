



import * as THREE from "three";

import { YJTrailRenderer } from "/@/threeJS/components/YJTrailRenderer.js";

import TWEEN from '@tweenjs/tween.js';
// 技能特效管理器
class YJSkillParticleManager {
  constructor(_this, scene, npcPath, npcStoryData, sceneManager) {

      // _YJSkillParticleManager.shootTargetFn(null,null,"1704443871265");

      let _YJTrailRenderer = [];
      
    let shootTargetList2 = [];
    function shootTargetFn2(startPos, target,callback) {
      for (let i = 0; i < shootTargetList2.length; i++) {
        const element = shootTargetList2[i];
        if (!element.trailRenderer.trail.used) {
          element.startPos = startPos;
          element.target = target;
          element.time = 0;
          element.callback = callback;
          element.trailRenderer.trail.start();
          return;
        }
      }
      // console.log(" 创建旧 拖尾效果 ");

      let group = new THREE.Group();
      _Global.YJ3D.scene.add(group);
      group.position.copy(startPos);
      let trailRenderer = { group: group, trail: new YJTrailRenderer(_this, _Global.YJ3D.scene, group) };
      
      trailRenderer.trail.start();
      _this._YJSceneManager.AddNeedUpdateJS(trailRenderer.trail);
      
      _YJTrailRenderer.push(trailRenderer);
      shootTargetList2.push({ startPos: startPos,callback:callback, target: target, time: 0, trailRenderer: trailRenderer });
    }
    function UpdateTrailRenderer2() {
      for (let i = shootTargetList2.length - 1; i >= 0; i--) {
        const item = shootTargetList2[i];
        if (item.trailRenderer.trail.used) {
          item.time += 0.03;
          if (item.time >= 1) {
            item.trailRenderer.trail.stop();
            if(item.callback){
              item.callback();
            }
            return;
          }
          
          if (item.startPos.distanceTo(item.target.GetPlayerWorldPos()) < 0.2) {
            item.used = false; 
            item.trailRenderer.trail.stop();
            if(item.callback){
              item.callback();
            }
            return;
          }

          // item.startPos.lerp(item.target.GetWorldPos(), item.time);
          item.startPos.lerp(item.target.GetPlayerWorldPos(), item.time);
          item.trailRenderer.group.position.copy(item.startPos);
        }
      }
    }

    let scope = this;
    let particleList = [];
    let shootTargetList = [];
    this.shootTargetFn = async function(startPos, target, particleId,callback) {
      if(!particleId){
        shootTargetFn2(startPos, target,callback); 
        return;
      }
      for (let i = 0; i < shootTargetList.length; i++) {
        const element = shootTargetList[i];
        if (element.particleId == particleId && !element.used) {
          element.startPos = startPos;
          element.target = target;
          element.time = 0;
          element.particle.SetPos(startPos);
          element.particle.SetActive(true);
          element.used = true;
          element.callback = callback;
          return;
        }
      }

      let res = await _this.$axios.get(
        _this.$uploadGroupUrl + particleId + "/" + "data.txt" + "?time=" + new Date().getTime()
      );

      let modelData = res.data; 
      // console.log(" 加载特效 ",modelData);

      modelData.folderBase = particleId;
      // modelData.pos = _Global.YJ3D._YJSceneManager.GetPlayerPosReduceHeight();
      modelData.pos = startPos;
      
      modelData.rotaV3 = { x: 0, y: 0, z: 0 };
      modelData.scale = { x: 1, y: 1, z: 1 };
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().ImportModel(modelData,(object)=>{
        // console.log("加载组合模型", object);
        // particleList.push(object); 
        shootTargetList.push({particleId:particleId,callback:callback, startPos: startPos, target: target, time: 0,used:true, particle: object });
      });
       
      // console.log(" 加载组合数据 ",modelData);

    }
    function UpdateTrailRenderer() {
      for (let i = shootTargetList.length - 1; i >= 0; i--) {
        const item = shootTargetList[i];
        if (item.used) {
          item.time += 0.01;
          if (item.time >= 1) {
            item.used = false; 
            item.particle.SetActive(false);
            if(item.callback){
              item.callback();
            }
            return;
          }
          if (item.startPos.distanceTo(item.target.GetPlayerWorldPos()) < 0.2) {
            item.used = false; 
            item.particle.SetActive(false);
            if(item.callback){
              item.callback();
            }
            return;
          }
          item.startPos.lerp(item.target.GetPlayerWorldPos(), item.time);
          item.particle.GetGroup().position.copy(item.startPos);
        }
      }
    }

    
    function MoveToPosTweenFn(fromPos, targetPos, length, updateCB, callback) {
      let movingTween = new TWEEN.Tween(fromPos).to(targetPos, length).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        if (updateCB) {
          updateCB(fromPos);
        }
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });
    }
    function init(){
      _this._YJSceneManager.AddNeedUpdateJS(scope);
    }
    this._update = function(){
      UpdateTrailRenderer();
      UpdateTrailRenderer2();
      TWEEN.update(); 

    }
    init();
  }
}

export { YJSkillParticleManager };