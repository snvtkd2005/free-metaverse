import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";

import { YJLoadAvatar } from "/@/threeJS/YJLoadAvatar.js";
import { YJProjector } from "/@/threeJS/YJProjector.js";

import { GetPathFolders, LoadFile } from "/@/utils/api.js";
import TWEEN from '@tweenjs/tween.js';
import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";
import { YJParabola } from "/@/threeJS/YJParabola.js";


// 场景同步数据

class YJGameManagerEditor {
  constructor(_this, parentUI, npcManager) {
    var scope = this;

    let dyncModelList = [];
    let npcModelList = [];
    // 初始化场景中需要同步的模型。每个客户端都执行
    this.InitDyncSceneModels = ()=>{
      //武器、npc 
      let modelDataList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetModelList();
      for (let i = 0; i < modelDataList.length; i++) {
        const element = modelDataList[i];
        if(element.modelType == "NPC模型" 
        || element.modelType == "装备模型"
         ){
          dyncModelList.push({id:element.id});
        }
        if(element.modelType == "NPC模型" ){
          npcModelList.push(element);
        }
      } 

      npcModelList = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetAllTransformByModelType("NPC模型");
      if(_Global.setting.inEditor){
        return;
      }
      setInterval(() => {
        CheckNpcLookat();
      }, 500);
    }

    // 巡视NPC是否能发现玩家
    function CheckNpcLookat(){

      if(_Global.YJ3D.YJController.isInDead()){
        return;
      }
      let playerPos = _Global.YJ3D.YJController.GetPlayerWorldPos();
      for (let i = 0; i < npcModelList.length; i++) {
        const element = npcModelList[i];
        if(element.GetComponent("NPC").isCanSetTarget()){
          let distance = playerPos.distanceTo(element.GetGroup().position);
          if(distance<=12){
            element.GetComponent("NPC").SetTarget(_Global.YJ3D.YJPlayer,true);
          }
          // console.log("npc 距离玩家 坐标 {0} 米", distance);

        }
      }
    }


    // 玩家拾取场景内物体的数据。用来做场景物体同步
    let playerData = [];
    //发送单个物体数据
    this.SendModelState = function(id,state){
      if(!_Global.YJDync){
        return;
      }
      for (let i = 0; i < dyncModelList.length; i++) {
        const element = dyncModelList[i];
        if(element.id == id){
          element.state = state;

          if(state.modelType == "装备模型"){
            playerData.push({playerId:_Global.YJDync.id,modelType:state.modelType,msg:state.msg});
          }
          console.error(" 发送单个物体数据 ",state);
          _Global.YJDync._YJDyncManager.SendSceneState("single",{id:id,state:state});
        } 
      }
    }

    //发送整个场景数据
    this.SendSceneState = function(){
      if(!_Global.YJDync){   
        return;   
      }
      _Global.YJDync._YJDyncManager.SendSceneState("all",dyncModelList);

    }
 
    this.Receive = function(sceneState){
      let state = sceneState.state;

      if(sceneState.type == "all"){
        console.log("接收场景同步信息",sceneState);

        //整个场景所有模型的更新
        for (let i = 0; i < dyncModelList.length; i++) {
          const element = dyncModelList[i];
          let has = false;
          for (let j = 0; j < state.length && !has; j++) {
            const _state = state[j];
            if(element.id == _state.id){
              element.state = _state.state; 
              has = true;
            } 
          } 
        }

        for (let i = 0; i < state.length; i++) {
          const element = state[i]; 
          _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(element);
        }
        return;
      }

      //单个模型的更新
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().EditorUserModel(state);
      for (let i = 0; i < dyncModelList.length; i++) {
        const element = dyncModelList[i];
        // console.log("查找",state.id,element.id);
        if(element.id == state.id){
          element.state = state.state;
          return;
        } 
      }
    }

    //移除角色时，移除其数据。如还原其拾取的武器
    this.DelPlayer = function(id){

    }



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
      if (owner.npcName) {
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
    // 点击选中不同角色
    this.AddChangeTargetListener = (callback) => {
      targetCallback = callback;
    }

    let laterSitting = null;
    this.TriggerModel = (triggerObj) => {
      if (triggerObj != null) {
        console.log("进入物体trigger ", triggerObj.modelId);
        // 进入椅子trigger区域内，1秒后坐下
        if (triggerObj.modelId.includes("chair")) {
          if (laterSitting != null) {
            clearTimeout(laterSitting);
            laterSitting = null;
          }
          laterSitting = setTimeout(() => {
            SetSittingModel(triggerObj);
          }, 1000);

        }
      } else {
        if (laterSitting != null) {
          clearTimeout(laterSitting);
          laterSitting = null;
        }
      }

    }


    this.SetTriggerOverlap = function (b, id, owner) {
      if (id == undefined) { return; }
      if (id.includes("chair")) {
        if (b) {
          //点击热点坐椅子
          this.SetSittingModelLater(owner.GetGroup());
          owner.SetPointVisible(false);
        } else {
          if (laterSitting != null) {
            clearTimeout(laterSitting);
            laterSitting = null;
          }
        }
      }
    }
    this.SetSittingModelLater = function (model) {
      if (laterSitting != null) {
        clearTimeout(laterSitting);
        laterSitting = null;
      }
      laterSitting = setTimeout(() => {
        SetSittingModel(model);
      }, 1000);
    }


    this.SetSittingModel = function (model) {
      SetSittingModel(model);
    }

    let tempEnpty = new THREE.Group();
    // 设置角色坐到椅子上
    function SetSittingModel(model) {
      // 设置角色坐到椅子上
      let modelPos = _this._YJSceneManager.GetWorldPosition(model);

      _this._YJSceneManager.GetAmmo().SetEnabled(false);
      _this._YJSceneManager.SetPlayerPosDirect(modelPos);
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
      if (modelType == undefined) {
        return;
      }
      console.log("点击物体 ", modelType);
      if (modelType == "chair") {
        if (hitObject.owner != undefined) {

        }
        // 设置角色坐到椅子上
        SetSittingModel(hitObject);
        return;
      }
      // 拾取物品
      if (modelType.indexOf('交互物品') > -1) {

        let modelPos = _this._YJSceneManager.GetWorldPosition(hitObject);
        //让角色朝向模型位置
        _this.YJController.PlayerLookatPos(modelPos);

        //判断角色与物品的距离，超过1米，则不交互
        let distance = modelPos.distanceTo(_this._YJSceneManager.GetPlayerPos());
        console.log("物品与角色的距离 ", distance);
        if (distance >= 1.7) { return; }

        let sp = modelType.split('-');
        _this.YJController.SetPlayerState("interactive", sp[1]);

        if (pickTimeout != null) {
          clearTimeout(pickTimeout);
        }
        pickTimeout = setTimeout(() => {
          // console.log("删除物品 " + hitObject.modelName);
          // 把删除物体的材质球备份，防止其他相同材质引用的模型材质也被清除
          hitObject.traverse(function (item) {
            if (item.type === 'Mesh') {
              let cloneMat = item.material.clone();
              item.material = cloneMat;
            }
          })
          _this._YJSceneManager.clearGroup(hitObject);

          //在模型位置相对于界面2d坐标，生成图标。 
          // parentUI.CreateIconTo(hitObject.modelName,_this._YJSceneManager.WorldPosToScreenPos(modelPos));
          // moveModels.push({ model: CreateObj(modelPos),currentTargetPos:modelPos, target: posRef_huluobu, lerpLength: 0 });
          // b_lerpMoving = true;

          // AddModel(hitObject.modelName, hitObject.modelPath);
          MoveTween(CreateObj(modelPos, hitObject.modelName), hitObject.modelName == "南瓜" ? posRef_nangua : posRef_huluobu);
        }, 1500);

      }
    }


    this.HoverObject = (hoverObject, hoverPoint) => {

      console.log(" == in GAMEMANAGER hover物体  ", hoverObject);

      if (hoverObject == null) {
        // _this.SetCursor("default");
        _Global.ReportTo3D("切换光标","正常");
        return;
      } 
      let modelType = hoverObject.tag;
      if (modelType == undefined) {
        // _this.SetCursor("default");
        _Global.ReportTo3D("切换光标","正常");
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
            _this._YJSceneManager.clearGroup(throwObj);
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
              _this.scene.attach(throwObj);
              let parabola = new THREE.Group();
              _this.scene.add(parabola);
              parabola.position.copy(throwObj.position.clone());

              // parabola.add(new THREE.AxesHelper(1));

              let target = new THREE.Group();
              // target.add(new THREE.AxesHelper(1));
              _this.scene.add(target);

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
                stateId: 1212,
                boneName: "mixamorigRightHandIndex1",
                modelName: f,
                targetPos: { x: targetPos.x, y: targetPos.y, z: targetPos.z }
              });


            }, latertime);
          });

          //发送同步数据。 骨骼名、物品名
          parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId: 1212,
            boneName: "mixamorigRightHandIndex1",
            modelName: f
          });

        }

      }

      _this.YJController.SetPlayerState(e, f);
    }

    let oldStateId = 0;
    let otherthrowObj = null;
    this.DyncPlayerState = function (YJPlayer, state) {
      YJPlayer.DyncPlayerState(state); return;
    }


    let posRef_huluobu;
    let posRef_nangua;
    let inInputing = false;
    function init() {

      _YJProjector = new YJProjector(_this);


      // console.error(" 初始化 YJGameManager Editor ");
      new YJKeyboard((key) => {
        if(inInputing){
          return;
        }
        if (key == "Escape") {
          if (oldTarget != null) {
            _YJProjector.SetActive(false);
            oldTarget = null;
            ChangeTarget();
          }
          return;
        }
        if (key == "Digit1") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(0); 
          return;
        }
        if (key == "Digit2") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(1); 
          return;
        }

        if (key == "Digit3") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(2); 
          return;
        }
        if (key == "Digit4") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(3); 
          return;
        }
        if (key == "Digit5") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(4); 
          return;
        }
        if (key == "Digit6") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(5); 
          return;
        }
        if (key == "Digit7") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(6); 
          return;
        }
        if (key == "Digit8") { 
          parentUI.$refs.skillPanel.ClickSkillIndex(7); 
          return;
        }
        if (key == "KeyT") {
          // if (_this._YJSceneManager) {
          //   _this._YJSceneManager.ClickInteractive();
          // }
           
          _this.YJController.SetUserDataItem("weaponData","weaponId","");
          _this.YJController.SetUserDataItem("weaponData","weaponType","");

          _Global.SendMsgTo3D("放下武器");

          return;
        }
        if (key == "KeyF") {
          // if (_this._YJSceneManager) {
          //   _this._YJSceneManager.ClickInteractive();
          // }
          return;
        }
        if (key == "KeyM") {
          //   //  开关地图
          //   if (setting.keyM != undefined && setting.keyM && _this.$parent.clickOpenPanel) {
          //     _this.$parent.clickOpenPanel("小地图");
          //   }
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

        if (laterSitting != null) {
          clearTimeout(laterSitting);
          laterSitting = null;
        }

        if (throwObj != null) {
          throwObj.parent.remove(throwObj);
          _this._YJSceneManager.clearGroup(throwObj);
          throwObj = null;
          parentUI.$refs.YJDync._YJDyncManager.SetPlayerState({
            stateId: 10000
          });
        }

        inThrowing = false;

        // console.log(throwTimeout);

      });


      // posRef_huluobu = CreatePosRef(0.33, -0.953);
      // posRef_nangua = CreatePosRef(0.20, -0.953);
      posRef_nangua = CreatePosRef(-0.33, -0.93);
      posRef_huluobu = CreatePosRef(-0.20, -0.93);
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
      _this.scene.add(cube);
      modelPos.y += 1;
      cube.position.copy(modelPos);
      _this.camera.attach(cube);
      cube.name = modelName;


      parentUI.CreateIconTo(cube.name, _this._YJSceneManager.GetObjectPosToScreenPos(cube));


      return cube;
    }

    function CreateThrowObj(parent, modelName) {


      let mesh = _this._YJSceneManager.checkLoadMesh(_this.GetPublicModelUrl() + _this._YJSceneManager.GetModelPath(modelName));
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
      model.traverse(function (item) {
        if (item.type === 'Mesh') {
          let cloneMat = item.material.clone();
          item.material = cloneMat;
        }
      })
      return model;
    }




    function MoveTween(model, targetObj) {

      let fromPos = model.position.clone();
      fromPos.y += 1;
      let targetPos = targetObj.position.clone();
      MoveToPosTween(model, fromPos, 1000, () => {
        MoveToPosTween(model, targetPos, 2000, () => {
          _this._YJSceneManager.clearGroup(model);
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
        parentUI.UpdateIconTo(model.name, _this._YJSceneManager.GetObjectPosToScreenPos(model));
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


          // let targetPos = _this._YJSceneManager.GetWorldPosition(moveModelData.target);
          // let targetPos = _this._YJSceneManager.GetWorldPosition(moveModelData.target);

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

export { YJGameManagerEditor };