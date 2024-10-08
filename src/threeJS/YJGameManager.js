import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJKeyboard } from "./YJKeyboard.js";

import { YJLoadAvatar } from "./YJLoadAvatar.js";
import { YJProjector } from "./YJProjector.js";
 
import TWEEN from '@tweenjs/tween.js';
import { YJLoadModel } from "./YJLoadModel.js";
import { YJParabola } from "./YJParabola.js";


// NPC 角色
// 1，头顶上方有 感叹号 ，表示可交互
// 2，交互方式为：靠近弹出交互内容，远离交互内容消失
// 3，制作碰撞区域
// 4，设置 交互内容，图、文、视频

class YJGameManager {
  constructor(_this, parentUI, assetId, avatarData, pos, rota, size, npcManager) {
    var scope = this;

    // 上次选中的角色、npc
    let oldTarget = null;

    let _YJProjector = null;
    // 点击角色NPC，显示NPC下方的光圈
    this.ClickPlayer = (owner) => {
      // 自身角色除外
      if (owner.isLocal) { return; }
      if (oldTarget != null) {

      }
      if (owner.GetBaseModel) {
        let { group, playerHeight } = owner.GetBaseModel();
        _YJProjector.Active(group, playerHeight);
      }

      // 点击npc，播放其音效
      // console.log(owner);
      if(owner.npcName){
        parentUI.SetNpcMusicUrl(owner.npcName);
      }

      oldTarget = owner;
      ChangeTarget();
    }
    let targetCallback;
    // 改变目标时执行
    function ChangeTarget() {
      if (targetCallback) {
        targetCallback(oldTarget != null);
      }
    }
    this.AddChangeTargetListener = (callback) => {
      targetCallback = callback;
    }

    let laterSitting = null;
    this.TriggerModel = (triggerObj)=>{
      if(triggerObj != null){
        // console.log("进入物体trigger ",triggerObj.modelId);
        // 进入椅子trigger区域内，1秒后坐下
        if(triggerObj.modelId.includes("chair")){
          if(laterSitting != null){
            clearTimeout(laterSitting);
            laterSitting = null;
          }
          laterSitting = setTimeout(() => {
            SetSittingModel(triggerObj);
          }, 1000);

        }
      }else{
        if(laterSitting != null){
          clearTimeout(laterSitting);
          laterSitting = null;
        }
      }

    }

    let tempEnpty = new THREE.Group();
    // 设置角色坐到椅子上
    function SetSittingModel(model){
        // 设置角色坐到椅子上
        let modelPos = _Global.YJ3D._YJSceneManager.GetWorldPosition(model);

        _Global.YJ3D._YJSceneManager.GetAmmo().SetEnabled(false); 
        _Global.YJ3D._YJSceneManager.SetPlayerPosDirect(modelPos);
        _this.YJController.SetOnlyRotaView(true);
        _this.YJController.SetPlayerState("sitting", "sitting");

 
        // unity和threejs中Z轴相差180度
        tempEnpty.quaternion.copy(model.getWorldQuaternion(new THREE.Quaternion()));
        tempEnpty.rotation.y += Math.PI; 

        _this.YJController.SetPlayerQuaternion(tempEnpty.getWorldQuaternion(new THREE.Quaternion()));
    }

    let pickTimeout;
    this.ClickModel = (hitObject) => {

      let modelType = hitObject.tag;

      console.log("点击物体 ",modelType);
      if(modelType == "chair"){
        if(hitObject.owner!=undefined){

        }
        // 设置角色坐到椅子上
        SetSittingModel(hitObject); 
        return;
      }
      // 拾取物品
      if (modelType.indexOf('交互物品') > -1) {

        let modelPos = _Global.YJ3D._YJSceneManager.GetWorldPosition(hitObject);
        //让角色朝向模型位置
        _this.YJController.PlayerLookatPos(modelPos);

        //判断角色与物品的距离，超过1米，则不交互
        let distance = modelPos.distanceTo(_Global.YJ3D._YJSceneManager.GetPlayerPos());
        console.log("物品与角色的距离 ", distance);
        if (distance >= 1.7) { return; }

        let sp = modelType.split('-');
        _this.YJController.SetPlayerState("interactive", sp[1]);

        if (pickTimeout != null) {
          clearTimeout(pickTimeout);
        }
        pickTimeout = setTimeout(() => {
          // console.log("删除物品 " + hitObject.modelName);
          _Global.YJ3D._YJSceneManager.clearGroup(hitObject);

          //在模型位置相对于界面2d坐标，生成图标。 
          // parentUI.CreateIconTo(hitObject.modelName,_Global.YJ3D._YJSceneManager.WorldPosToScreenPos(modelPos));
          // moveModels.push({ model: CreateObj(modelPos),currentTargetPos:modelPos, target: posRef_huluobu, lerpLength: 0 });
          // b_lerpMoving = true;

          // AddModel(hitObject.modelName, hitObject.modelPath);
          MoveTween(CreateObj(modelPos, hitObject.modelName), hitObject.modelName == "南瓜" ? posRef_nangua : posRef_huluobu);
        }, 1500);

      }
    }


    this.HoverObject = (hoverObject, hoverPoint) => {

      // console.log(" == in GAMEMANAGER hover物体  ", hoverObject);

      if (hoverObject == null) {
        _this.SetCursor("default");
        return;
      }
      let modelType = hoverObject.tag;
      if (modelType == undefined) {
        _this.SetCursor("default");
        return;
      }

      if (modelType.indexOf('交互物品') > -1) {
        _this.SetCursor("pointer");
      } else {
        _this.SetCursor("default");
      }
    }



    let throwTimeout;
    let throwObj = null;
    let animName;
    let oldAnimName;
    let inThrowing = false;

    // 使用物品、扔出物品
    this.UserModel = (e, f, callback) => {

      if (e == "attack") {
        if (f != undefined) {

          if (inThrowing) { return; }
          if (throwObj != null) {
            if (oldAnimName == f) {
              return;
            }

            throwObj.parent.remove(throwObj);
            _Global.YJ3D._YJSceneManager.clearGroup(throwObj);
            throwObj = null;
            if (throwTimeout != null) {
              clearTimeout(throwTimeout);
            }

            if (f == "胡萝卜") {
              animName = "throw";
            }
            if (f == "南瓜") {
              animName = "throw2";
            }

          }
          oldAnimName = f;
          inThrowing = true;
          _this.YJPlayer.GetBone("mixamorigRightHandIndex1", (bone) => {
            throwObj = CreateThrowObj(bone, f);
            let latertime = 650;
            if (f == "胡萝卜") {
              latertime = 800;
            }


            if (throwTimeout != null) {
              clearTimeout(throwTimeout);
              throwTimeout = null;
            }


            //让角色朝向模型位置
            _this.YJController.PlayerLookatPos(oldTarget.GetWorldPos());


            throwTimeout = setTimeout(() => {
              _Global.YJ3D.scene.attach(throwObj);
              let parabola = new THREE.Group();
              _Global.YJ3D.scene.add(parabola);
              parabola.position.copy(throwObj.position.clone());

              // parabola.add(new THREE.AxesHelper(1));

              let target = new THREE.Group();
              // target.add(new THREE.AxesHelper(1));
              _Global.YJ3D.scene.add(target);

              let targetPos = oldTarget.GetWorldPos();
              if (oldTarget != null) {
                
              } else {
                targetPos.set(0, 0, 0);
              }
              target.position.copy(targetPos);


              parabola.attach(target);

              parabola.attach(throwObj);
              //扔出拾取物品。抛物线移动
              new YJParabola(_this, parabola, throwObj, throwObj.position.clone(), target.position.clone());

              throwObj = null;

              setTimeout(() => {
                inThrowing = false;
              }, 2000);
              if (callback) {
                callback();
              }


              parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
                stateId:1212,
                boneName: "mixamorigRightHandIndex1",
                modelName:f,
                targetPos:{x:targetPos.x,y:targetPos.y,z:targetPos.z}
              });


            }, latertime);
          });

          //发送同步数据。 骨骼名、物品名
          parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId:1212,
            boneName: "mixamorigRightHandIndex1",
            modelName:f
          });

        }

      }

      _this.YJController.SetPlayerState(e, f);
    }

    let oldStateId = 0;
    let otherthrowObj = null;
    this.DyncPlayerState = function(YJPlayer,state){
      YJPlayer.DyncPlayerState(state);return;

      let stateId = state.stateId;
      if(oldStateId != stateId){
        if (otherthrowObj != null) {
          otherthrowObj.parent.remove(otherthrowObj);
          _Global.YJ3D._YJSceneManager.clearGroup(otherthrowObj);
          otherthrowObj = null;
        }
      }
      if(stateId != 1212){return;}
      let boneName = state.boneName;
      let modelName = state.modelName;
      let targetPos = state.targetPos;

      if(otherthrowObj == null){
        YJPlayer.GetBone(boneName, (bone) => {
          otherthrowObj = CreateThrowObj(bone, modelName);
        });
      }

      if(targetPos){

        _Global.YJ3D.scene.attach(otherthrowObj);
        let parabola = new THREE.Group();
        _Global.YJ3D.scene.add(parabola);
        parabola.position.copy(otherthrowObj.position.clone());

        // parabola.add(new THREE.AxesHelper(1));

        let target = new THREE.Group();
        // target.add(new THREE.AxesHelper(1));
        _Global.YJ3D.scene.add(target);
        
        target.position.set(targetPos.x,targetPos.y,targetPos.z);

        parabola.attach(target);

        parabola.attach(otherthrowObj);
        //扔出拾取物品。抛物线移动
        new YJParabola(_this, parabola, otherthrowObj, otherthrowObj.position.clone(), target.position.clone());

        otherthrowObj = null;

      }


    }


    let posRef_huluobu;
    let posRef_nangua;

    function init() {

      _YJProjector = new YJProjector(_this);


      new YJKeyboard((key) => {
        if (key == "Escape") {
          if (oldTarget != null) {
            _YJProjector.SetActive(false);
            oldTarget = null;
            ChangeTarget();
          }
          return;
        }
        if (key == "Digit1") {
          _this.YJController.SetPlayerState("death");
          return;
        }
        if (key == "Digit2") {
          _this.YJController.SetPlayerState("attack");
          return;
        }

        // if (key == "Digit3") {
        //   scope.UserModel("attack", "南瓜");
        //   return;
        // }
        // if (key == "Digit4") {
        //   scope.UserModel("attack", "胡萝卜");
        //   return;
        // }

      });

      _this.YJController.AddMovingListener(() => {
        if (pickTimeout != null) {
          clearTimeout(pickTimeout);
          pickTimeout = null;
        }
        if (throwTimeout != null) {
          clearTimeout(throwTimeout);
          throwTimeout = null;
          console.log("清除投掷协程");
        }

        if(laterSitting != null){
          clearTimeout(laterSitting);
          laterSitting = null;
        }

        if (throwObj != null) {
          throwObj.parent.remove(throwObj);
          _Global.YJ3D._YJSceneManager.clearGroup(throwObj);
          throwObj = null;
          parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId:10000
          });
        }

        inThrowing = false;

        console.log(throwTimeout);

      });


      posRef_huluobu = CreatePosRef(0.33, -0.953);
      posRef_nangua = CreatePosRef(0.20, -0.953);
      update();

    }
    function CreatePosRef(x, y) {

      //在2d物品栏对应的3d位置生成模型
      let cubeGeometry = new THREE.SphereGeometry(0.00, 50, 50);
      let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
      });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      _this.camera.add(cube);

      cube.translateZ(-2);

      cube.translateX(x);
      cube.translateY(y);
      return cube;
    }



    function CreateObj(modelPos, modelName) {
      //在2d物品栏对应的3d位置生成模型
      let cubeGeometry = new THREE.SphereGeometry(0, 50, 50);
      let cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
      });
      let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      _Global.YJ3D.scene.add(cube);
      modelPos.y += 1;
      cube.position.copy(modelPos);
      _this.camera.attach(cube);
      cube.name = modelName;


      parentUI.CreateIconTo(cube.name, _Global.YJ3D._YJSceneManager.GetObjectPosToScreenPos(cube));


      return cube;
    }

    function CreateThrowObj(parent, modelName) {


      let mesh = _Global.YJ3D._YJSceneManager.checkLoadMesh(_this.GetPublicModelUrl() + _Global.YJ3D._YJSceneManager.GetModelPath(modelName));
      let cube = LoadMesh(mesh);
      cube.scale.set(100, 100, 100);
      // //在2d物品栏对应的3d位置生成模型
      // let cubeGeometry = new THREE.SphereGeometry(10, 50, 50);
      // let cubeMaterial = new THREE.MeshStandardMaterial({
      //   color: 0x808080,
      // });
      // let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      parent.add(cube);
      cube.position.set(0, 0, 0);
      cube.name = modelName;
      return cube;
    }

    function LoadMesh(mesh) {
      // console.log(" 已存在mesh ,复用之 ！", name);
      let group = mesh.clone();
      let model = group.children[0];
      return model;
    }




    function MoveTween(model, targetObj) {

      let fromPos = model.position.clone();
      fromPos.y += 1;
      let targetPos = targetObj.position.clone();
      MoveToPosTween(model, fromPos, 1000, () => {
        MoveToPosTween(model, targetPos, 2000, () => {
          _Global.YJ3D._YJSceneManager.clearGroup(model);
          _this.camera.remove(model);
          parentUI.DelIconTo(model.name);

        });
      });
    }

    function MoveToPosTween(model, targetPos, length, callback) {

      let fromPos = model.position.clone();
      let movingTween = new TWEEN.Tween(fromPos).to(targetPos, length).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.position.copy(fromPos);
        parentUI.UpdateIconTo(model.name, _Global.YJ3D._YJSceneManager.GetObjectPosToScreenPos(model));
      }
      movingTween.onUpdate(updateTargetPos);
      movingTween.start() // 启动动画
      movingTween.onComplete(() => {
        if (callback) {
          callback();
        }
      });

    }
    let moveModels = [];
    let b_lerpMoving = false;
    function LerpMove() {

      if (b_lerpMoving && moveModels.length > 0) {

        for (let i = 0; i < moveModels.length; i++) {
          const moveModelData = moveModels[i];


          // let targetPos = _Global.YJ3D._YJSceneManager.GetWorldPosition(moveModelData.target);
          // let targetPos = _Global.YJ3D._YJSceneManager.GetWorldPosition(moveModelData.target);

          moveModelData.lerpLength += 0.001;
          moveModelData.currentTargetPos.lerp(moveModelData.targetPos, moveModelData.lerpLength);

          moveModelData.model.position.copy(moveModelData.currentTargetPos);


          if (Math.abs(targetPos.z - moveModelData.currentTargetPos.z) < 0.01
            && Math.abs(targetPos.x - moveModelData.currentTargetPos.x) < 0.01
            && Math.abs(targetPos.y - moveModelData.currentTargetPos.y) < 0.01

          ) {
            moveModels.splice(i, 1);
            // console.log("已移动到指定位置");
          }

        }




      }
    }

    init();
    function update() {

      requestAnimationFrame(update);
      TWEEN.update();
      LerpMove();
    }

  }
}

export { YJGameManager };