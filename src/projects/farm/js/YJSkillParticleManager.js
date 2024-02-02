



import * as THREE from "three";


import TWEEN from '@tweenjs/tween.js';
// 技能特效管理器
class YJSkillParticleManager {
  constructor(_this, scene, npcPath, npcStoryData, sceneManager) {

      // _YJSkillParticleManager.shootTargetFn(null,null,"1704443871265");

    let scope = this;
    let particleList = [];
    let shootTargetList = [];
    this.shootTargetFn = async function(startPos, target, particleId,callback) {
      if(!particleId){
        if(callback){callback()}
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
      console.log(" 加载特效 ",modelData);

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
      TWEEN.update(); 

    }
    init();
  }
}

export { YJSkillParticleManager };