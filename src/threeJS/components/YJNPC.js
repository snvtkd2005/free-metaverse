import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';



// 可控 角色
// 实现显示头顶姓名条、血条
// 控制 animator  动画播放
// 1，头顶上方有 感叹号 ，表示可交互
// 2，交互方式为：靠近弹出交互内容，远离交互内容消失
// 3，制作碰撞区域
// 4，设置 交互内容，图、文、视频

class YJNPC {
  constructor(_this, parent, _YJAnimator) {
    var scope = this;

    let group = null;
    let playerHeight;
    let nameScale = 1;
    let doonce = 0;
    let baseData = {
      health: 5,
    }
    let navpath = [];
    const clock = new THREE.Clock();
    let SPEED = 8;
    const NORMALSPEED = 8;
    const MISSSPEED = 20;
    let playerPosition = new THREE.Vector3(0, 0, 0);

    let fromGroup;

    // 目标
    let targetModel;
    // 攻击速度，攻击间隔，判定有效的攻击时机
    let attackSpeed = 1.2;

    const stateType = {
      Normal: 'normal',//正常状态， 待机/巡逻
      Back: 'back',//失去战斗焦点后回到初始状态 
      Fire: 'fire',//战斗 
      Dead: 'dead',//死亡 
    }
    let state = stateType.Normal;

    function Init() {
      group = new THREE.Group();
      parent.add(group);

      // fromGroup = new THREE.Group();
      // parent.add(fromGroup);
      // fromGroup.rotation.set(Math.PI/2,0,0);

      group.rotation.y += Math.PI;

      // group.add(new THREE.AxesHelper(5)); // 场景添加坐标轴
      // return;
      // update();

    }

    let data = null;
    let npcPos = [];
    this.npcName = "";
    this.SetName = function (v) {
      this.npcName = v;
      CreateNameTrans(this.npcName);
    }
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      console.log("in NPC msg = ", data);

      this.npcName = data.name;
      nameScale = data.avatarData.nameScale;
      playerHeight = data.avatarData.height;
      CreateNameTrans(this.npcName);
      if (data.defaultPath == "" || data.defaultPath == undefined) {
        data.defaultPath = "idle";
      }

      // 第一次加载时，把数据加入到全局角色数据中
      _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data.avatarData);

      _YJAnimator.SetAnimationsData(data.avatarData.animationsData);
      _YJAnimator.ChangeAnim(data.defaultPath);

      if (data.movePos && data.movePos.length > 0) {
        AddDirectPosToNavmesh(data.movePos);

        if (navpath.length == data.movePos.length) { return; }


        let p1 = data.movePos[navpath.length];
        let p2 = data.movePos[data.movePos.length - 1];

        let fromPos = new THREE.Vector3(p1.x, p1.y, p1.z);
        let targetPos = new THREE.Vector3(p2.x, p2.y, p2.z);
        //npc随机在点位之间移动
        navpath = npcManager.GetNavpath(fromPos, targetPos);
        console.log("navpath ", navpath);
      }
    }

    this.UpdateModel = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }

      data = (msg);
      console.log("in NPC UpdateModel msg = ", data);
      nameScale = data.nameScale;
      playerHeight = data.height;
      if (data.defaultPath == "" || data.defaultPath == undefined) {
        data.defaultPath = "idle";
      }

      // 第一次加载时，把数据加入到全局角色数据中
      _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data);

      _YJAnimator.SetAnimationsData(data.animationsData);
      _YJAnimator.ChangeAnim(data.defaultPath);

    }

    function AddDirectPosToNavmesh(movePos) {
      let count = movePos.length;
      for (let i = 0; i < count - 1; i++) {

        let p1 = movePos[i];
        let p2 = movePos[i + 1];
        let fromPos = new THREE.Vector3(p1.x, p1.y, p1.z);
        let targetPos = new THREE.Vector3(p2.x, p2.y, p2.z);
        if (i < count - 1) {
          if (!CheckColliderBetween(fromPos, targetPos)) {
            navpath.push(fromPos);
            npcPos.push(fromPos);
            if (i == count - 2) {
              navpath.push(targetPos);
              npcPos.push(targetPos);
            }
          } else {
            return;
          }
        }
      }
    }



    // 判断两点之间是否可以直接到达，即两点之间是否有障碍物，有障碍物表示不可直接到达
    function CheckColliderBetween(fromPos, targetPos) {
      var raycaster_collider = new THREE.Raycaster(fromPos, targetPos, 0, 8);
      var hits = raycaster_collider.intersectObjects(parent.children, true);
      if (hits.length > 0) {

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i].object;
          if (hit.name.indexOf("collider") > -1) {
            return true;
          }
        }
        return false;
      }
      return false;
    }
    //#region 
    //#endregion

    //创建姓名条参考物体
    let namePosTrans = null;
    function CreateNameTrans(content) {
      if (namePosTrans == null) {
        namePosTrans = new THREE.Group();
        namePosTrans.name = "npcname";
        group.add(namePosTrans);
      } else {
        namePosTrans.remove(namePosTrans.children[0]);
      }
      namePosTrans.position.set(0, (playerHeight + 0.3), 0); //原点位置

      const resetButton = new THREE.Group();

      const resetButtonText = createText(content, 0.06);
      resetButton.add(resetButtonText);
      resetButtonText.position.set(0, 0, 0.0051);
      resetButtonText.scale.set(1, 1, 1);
      namePosTrans.add(resetButton);
      resetButton.name = "ignoreRaycast";
      resetButton.position.set(0, 0, 0);
      var size = 2;
      resetButton.scale.set(size, size, size);
      namePosTrans.scale.set(nameScale, nameScale, nameScale);

    }


    let lookAtObj = null;

    //销毁组件
    this.Destroy = function () {

      cancelAnimationFrame(updateId);
      parent.remove(group);

    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(group.position, group.rotation);
    }

    Init();

    // 姓名条始终朝向摄像机
    function nameTransLookatCamera() {
      if (namePosTrans != null) {
        var lookatPos = new THREE.Vector3();
        var camWorlPos = new THREE.Vector3();
        _this.camera.getWorldPosition(camWorlPos);
        lookatPos.x = camWorlPos.x;
        lookatPos.z = camWorlPos.z;
        var nameWorlPos = new THREE.Vector3();
        namePosTrans.getWorldPosition(nameWorlPos);
        // lookatPos.y = nameWorlPos.y ;
        lookatPos.y = Math.max(nameWorlPos.y, camWorlPos.y);
        namePosTrans.lookAt(lookatPos);
      }

      if (lookAtObj != null) {
        var fromPos = new THREE.Vector3();
        lookAtObj.getWorldPosition(fromPos);
        group.lookAt(fromPos.x, fromPos.y, fromPos.z);
      }
    }

    let fireBeforePos = null;
    // 设置NPC的战斗目标
    this.SetTarget = function (_target) {

      if (state == stateType.Back) {
        return;
      }
      targetModel = _target;
      if (targetModel == null) {
        // 暂停1秒
        navpath = [];
        doonce = 0;
        state = stateType.Back;
        _YJAnimator.ChangeAnim("idle");
        setTimeout(() => {
          SPEED = MISSSPEED;
          navpath.push(fireBeforePos);
        }, 1000);

        return;
      }
      SPEED = NORMALSPEED;
      state = stateType.Fire;
      fireBeforePos = scope.transform.GetWorldPos();
      console.log(targetModel);
    }



    let checkPlayerLater = null;
    function CheckPlayer() {

      if (checkPlayerLater != null) {
        clearTimeout(checkPlayerLater);
        checkPlayerLater = null;
      }
      checkPlayerLater = setTimeout(() => {
        CheckPlayer();
      }, 500);
    }
    let oldPlayerPos = null;
    let inBlocking = false;
    let vaildAttackLater = null;
    function CheckState() {
      if (state == stateType.Dead) {
        _YJAnimator.ChangeAnim("death");
      }
      if (state == stateType.Normal) {


      }

      if (state == stateType.Fire) {
        let playerPos = targetModel.GetWorldPos();
        playerPos.y = 0;
        if (oldPlayerPos != playerPos) {
          oldPlayerPos = playerPos;
          navpath = [];
          doonce = 0;
        }
        let npcPos = scope.transform.GetWorldPos();
        npcPos.y = 0;
        let dis = playerPos.distanceTo(npcPos);
        if (dis < 1) {
          navpath = [];
          doonce = 0;
          parent.lookAt(playerPos.clone());
          //攻击
          if(!inBlocking){
            _YJAnimator.ChangeAnim("boxing attack001");
          }
          if (vaildAttackLater == null) {
            vaildAttackLater = setTimeout(() => {
              //有效攻击
              console.log("有效攻击");
              baseData.health--;
              if (baseData.health <= 0) {
                state = stateType.Dead;
              }

              _YJAnimator.ChangeAnim("body block");
              inBlocking = true;
              setTimeout(() => {
                inBlocking = false;
              }, 300);
              vaildAttackLater = null;
            }, attackSpeed * 1000);
          }
        } else {
          if (vaildAttackLater != null) {
            clearTimeout(vaildAttackLater);
            vaildAttackLater = null;
          }
          //跑向目标
          navpath.push(playerPos);
          // navpath[0] = (playerPos);

        }
        // console.log( scope.npcName + " in fire " + dis);
      }
    }



    var updateId = null;
    function update() {
      updateId = requestAnimationFrame(update);
      nameTransLookatCamera();
      CheckState();
      tick(clock.getDelta());

    }
    this._update = function () {
      nameTransLookatCamera();
      CheckState();
      tick(clock.getDelta());
    }

    this.ChangeAnim = function (v) {
      _YJAnimator.ChangeAnim(v);
    }
    // NPC行为树、状态机
    function ChangeAnim(state) {
      if (state == "行走") {
        _YJAnimator.ChangeAnim("walk");

      }
      if (state == "战斗前") {
        _YJAnimator.ChangeAnim("idle");

        return;
        // 延迟3秒，从当前位置移动到设定路线的其他坐标

        setTimeout(() => {
          let count = npcPos.length;
          let num = 0;
          for (let i = 0; i < count; i++) {
            const element = npcPos[i];
            let distance = element.distanceTo(playerPosition);
            if (distance < 0.1) {
              num = i;
            }
          }
          if (num == (count - 1)) {

            // 0 - num 之间随机 
            // console.log("生成随机数"+q);
            let qq = radomNum(0, num - 1);

            for (let i = num; i >= qq; i--) {
              navpath.push(npcPos[i]);
            }
          }
          else if (num == 0) {
            let qq = radomNum(num + 1, count);
            for (let i = num; i < qq; i++) {
              navpath.push(npcPos[i]);
            }
          } else {

            //随机朝结束点或起始点
            let q = Math.floor(Math.random() * 10); // 0-9随机
            if (q >= 5) {
              // 随机大于5时往结束点
              let qq = radomNum(num + 1, count);
              for (let i = num; i < qq; i++) {
                navpath.push(npcPos[i]);
              }
            } else {
              let qq = radomNum(0, num - 1);
              for (let i = num; i >= qq; i--) {
                navpath.push(npcPos[i]);
              }
            }
          }
        }, 3000);

      }
    }
    function radomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }

    //寻路
    function tick(dt) {
      if (!(navpath || []).length) return
      ChangeAnim("行走");
      let targetPosition = navpath[0];
      const velocity = targetPosition.clone().sub(playerPosition);

      if (velocity.lengthSq() > 0.00075 * SPEED) {
        velocity.normalize();
        // Move player to target
        playerPosition.add(velocity.multiplyScalar(0.015 * SPEED));
        // console.log(" in tick 222 ", playerPosition);

        // pathfindingHelper.setPlayerPosition( playerPosition );

        // let pos = raycasterDownPos(playerPosition.clone());
        let pos = playerPosition.clone();

        parent.position.copy(pos);

        if (doonce < 1) {
          if (navpath.length > 0) {
            //角色朝向目标点
            parent.lookAt(targetPosition.clone());
          }
          doonce++;
        }


      } else {
        // Remove node from the path we calculated
        navpath.shift();
        doonce = 0;
        if (navpath.length == 0) {
        }
        if (state == stateType.Normal) {
          ChangeAnim("战斗前");
        }
        if (state == stateType.Back) {
          state = stateType.Normal;
          ChangeAnim("战斗前");
        }

        // if (navpath.length > 1) {
        //   let targetPosition = navpath[1];
        //   //角色朝向目标点
        //   group.lookAt(targetPosition.clone());
        // }

      }
    }

    //向模型下方发出射线，返回碰到物体的碰撞点坐标
    let raytDricV3 = new THREE.Vector3(0, 0, 0);

    function raycasterDownPos(pos) {

      pos.y += 5;
      fromGroup.position.copy(pos);
      let d = 1;
      raytDricV3 = fromGroup.getWorldDirection(new THREE.Vector3());
      raytDricV3.x *= d;
      raytDricV3.y *= d;
      raytDricV3.z *= d;

      // dricGroup.position.copy(raytDricV3);
      var raycaster = new THREE.Raycaster(pos, raytDricV3, 0, 100);
      // var hits = raycaster.intersectObjects( _this.pointsParent, true);
      // var hits = raycaster.intersectObjects(parent.children, true);
      var hits = raycaster.intersectObjects(_this._YJSceneManager.GetAllLandCollider(), true);

      if (hits.length > 0) {
        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i].object;
          if (hit.name.includes("land")) {
            // hit.visible = true;
            // hit.material.opacity = 0.5;
            return hits[i].point;
          }
        }
      }
      pos.y -= 5;
      return pos.clone();
    }


  }
}

export { YJNPC };