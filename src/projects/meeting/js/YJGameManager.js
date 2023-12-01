import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJKeyboard } from "/@/threeJS/YJKeyboard.js";

import { YJLoadAvatar } from "/@/threeJS/YJLoadAvatar.js";
import { YJProjector } from "/@/threeJS/components/YJProjector.js";

import { GetPathFolders, LoadFile } from "/@/utils/api.js";
import TWEEN from '@tweenjs/tween.js';
import { YJLoadModel } from "/@/threeJS/YJLoadModel.js";
import { YJParabola } from "/@/threeJS/YJParabola.js";


// NPC 角色
// 1，头顶上方有 感叹号 ，表示可交互
// 2，交互方式为：靠近弹出交互内容，远离交互内容消失
// 3，制作碰撞区域
// 4，设置 交互内容，图、文、视频

class YJGameManager {
  constructor(_this, indexVue, assetId, avatarData, pos, rota, size, npcManager) {
    var scope = this;

    // 上次选中的角色、npc
    let oldTarget = null;

    let _YJProjector = null;

    this.HiddenProjector = function () {
      if (_YJProjector != null) {
        _YJProjector.SetActive(false);
      }
    }
    // 点击角色NPC，显示NPC下方的光圈
    this.ClickPlayer = (owner) => {
      // 自身角色除外
      if (owner.isLocal) {
        this.HiddenProjector();
        return;
      }
      if (oldTarget != null) {

      }
      if (owner.GetBaseModel) {
        let { group, playerHeight } = owner.GetBaseModel();
        _YJProjector.Active(group, playerHeight);
      }

      // 点击npc，播放其音效
      // console.log(owner);
      if (owner.npcName) {
        indexVue.SetNpcMusicUrl(owner.npcName);
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


    //230520
    let inChairIndex = -1;
    this.SetTriggerOverlap = function (b, id, owner) {
      if (id == undefined) { return; }
      if (id.includes("chair")) {
        if (b) {
          //230520
          let needInChairIndex = _Global.GetChairIndexByItem(owner);
          let usedChair = _Global.GetUsedChairIndexList();
          if (usedChair.length > 0) {
            for (let i = 0; i < usedChair.length; i++) {
              const element = usedChair[i];
              if (element == needInChairIndex) {
                //230522
                owner.SetPointVisible(false);
                console.log(" 当前椅子已被使用 ", needInChairIndex);
                return;
              }
            }
          }

          // console.log("准备落座椅子", needInChairIndex);

          //点击热点坐椅子
          this.SetSittingModelLater(owner.GetGroup());
          //230522
          // owner.SetPointVisible(false);
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
      return SetSittingModel(model);
    }

    let tempEnpty = new THREE.Group();
    // 设置角色坐到椅子上
    function SetSittingModel(model) {

      //230520
      if (inChairIndex != -1) {
      } else {
        inChairIndex = _Global.GetChairIndexByItem(model.owner);
      }
      let usedChair = _Global.GetUsedChairIndexList();
      if (usedChair.length > 0) {
        for (let i = 0; i < usedChair.length; i++) {
          const element = usedChair[i];
          if (element == inChairIndex) {
            setTimeout(() => {
              model.owner.SetPointVisible(false);
            }, 20);
            console.log(" 当前椅子已被使用 ", inChairIndex);
            return;
          }
        }
      }

      _Global.SetPlayerInChair(inChairIndex);
      _this.YJController.SetInChair(inChairIndex);
      _this.YJPlayer.inChairIndex = inChairIndex;

      // 设置角色坐到椅子上
      let modelPos = _this._YJSceneManager.GetWorldPosition(model);

      _this._YJSceneManager.GetAmmo().SetEnabled(false);
      _this._YJSceneManager.SetPlayerPosDirect(modelPos);
      _this.YJController.SetOnlyRotaView(true);
      _this.YJController.SetPlayerState("sitting", "sitting");

      _this.YJController.SetTransmit(true);
      setTimeout(() => {
        _this.YJController.SetTransmit(false);
      }, 100);

      model.owner.SetPointVisible(false);
      // unity和threejs中Z轴相差180度
      tempEnpty.quaternion.copy(model.getWorldQuaternion(new THREE.Quaternion()));
      tempEnpty.rotation.y += Math.PI;
      let quat = tempEnpty.getWorldQuaternion(new THREE.Quaternion());
      _this.YJController.SetPlayerQuaternion(quat);
      return quat;
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
          // indexVue.CreateIconTo(hitObject.modelName,_this._YJSceneManager.WorldPosToScreenPos(modelPos));
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


              indexVue.$refs.YJDync._YJDyncManager.SetPlayerState({
                stateId: 1212,
                boneName: "mixamorigRightHandIndex1",
                modelName: f,
                targetPos: { x: targetPos.x, y: targetPos.y, z: targetPos.z }
              });


            }, latertime);
          });

          //发送同步数据。 骨骼名、物品名
          indexVue.$refs.YJDync._YJDyncManager.SetPlayerState({
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

    function init() {

      _YJProjector = new YJProjector(_this);


      _this.YJController.AddMovingListener(() => {
        //  移动时，删掉荧光棒和灯牌
        _Global.CancelLightStick();
        //230520
        if (inChairIndex != -1) {
          inChairIndex = -1;
          _Global.SetPlayerInChair(inChairIndex);
          _this.YJController.SetInChair(inChairIndex);
          _this.YJPlayer.inChairIndex = inChairIndex;
        }
      });


      // update();

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


      indexVue.CreateIconTo(cube.name, _this._YJSceneManager.GetObjectPosToScreenPos(cube));


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
          indexVue.DelIconTo(model.name);

        });
      });
    }

    function MoveToPosTween(model, targetPos, length, callback) {

      let fromPos = model.position.clone();
      let movingTween = new TWEEN.Tween(fromPos).to(targetPos, length).easing(TWEEN.Easing.Cubic.InOut)
      let updateTargetPos = () => {
        model.position.copy(fromPos);
        indexVue.UpdateIconTo(model.name, _this._YJSceneManager.GetObjectPosToScreenPos(model));
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

export { YJGameManager };