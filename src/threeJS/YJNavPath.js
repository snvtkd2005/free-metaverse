

import * as THREE from "three";

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';


/**
 NPC寻路路径
 */
class YJNavPath {
  constructor(owner) {
    let scope = this;

    let navpath = [];
    let movePos = [];
    let movePosMeshList = [];
    let posMesh = _Global.setting.navPointMesh;

    // 随机寻路点
    this.RadomNavPos = function () {


      // console.log(GetNickName()+ " 巡逻点 00 ",data.inAreaRandom,movePos);
      if (data.inAreaRandom) {
        let startPos = parent.position.clone();
        let targetPos = fireBeforePos.clone();
        if (data.areaRadius == undefined) {
          data.areaRadius = 5;
        }
        targetPos.x += radomNum(-data.areaRadius, data.areaRadius);
        targetPos.z += radomNum(-data.areaRadius, data.areaRadius);
        // targetPos.y += 5;
        // let p = targetPos.clone();
        // p.y -= 10;
        // let point = CheckTrainPos(targetPos, p);
        GetNavpath(startPos, targetPos);
        // GetNavpath(startPos, point ? point : targetPos);
        // console.log(GetNickName() + "  巡逻随机范围 ", targetPos);
      } else {

        if (movePos.length > 1) {
          let navPosIndex = radomNum(0, movePos.length - 1);
          // console.log(" 巡逻点 ",movePos[navPosIndex]);
          let pos = movePos[navPosIndex];
          GetNavpath(parent.position.clone(), new THREE.Vector3(pos.x, pos.y, pos.z));


          // _Global.DyncManager.UpdateModel(scope.id, "navPosIndex",
          //   { navPosIndex: navPosIndex });

        }
      }
      // console.log("navpath ", navpath);

      // let fromPos = new THREE.Vector3(p1.x, p1.y, p1.z);
      // let targetPos = new THREE.Vector3(p2.x, p2.y, p2.z);
      // GetNavpath(fromPos, targetPos);
      //npc随机在点位之间移动
      // setTimeout(() => {
      //   GetNavpath(fromPos, targetPos);
      //   console.log("navpath ", navpath);
      // }, 5000);
    }

    this.SetNavPosByPosIndex = function (navPosIndex) {
      GetNavpath(parent.position.clone(), movePos[navPosIndex]);
    }
    // 寻路网格准备完成调用 或 直接调用开始巡逻
    this.PathfindingCompleted = function () {
      if (data.movePos && data.movePos.length > 1) {
        this.UpdateNavPos("停止巡逻", data.movePos);
      }
    }
    this.UpdateNavPos = function (e, pos, i) {
      // console.log(" 刷新巡逻点 ", e, pos,i);
      if (e == "停止巡逻") {

        //回到transform原始位置
        SetNavPathToNone();

        ClearLater("清除巡逻");

        this.SetPlayerState("normal");
        scope.transform.ResetPosRota();
        //巡逻点跟随物体
        for (let i = 0; i < movePosMeshList.length; i++) {
          const mesh = movePosMeshList[i];
          parent.attach(mesh);
        }
        laterNav = setTimeout(() => {
          scope.UpdateNavPos("开始巡逻", pos);
        }, 1000);
        return;
      }
      if (e == "开始巡逻") {
        //此时 pos为settingData.movePos

        for (let i = 0; i < movePosMeshList.length; i++) {
          const mesh = movePosMeshList[i];
          if (mesh.parent) {
            mesh.parent.remove(mesh);
          }
        }

        movePosMeshList = [];
        scope.UpdateNavPos('初始', pos);
        ClearLater("清除巡逻");

        laterNav = setTimeout(() => {
          scope.RadomNavPos();
        }, 1000);
        return;
      }
      if (e == "添加") {
        //添加球体到指定坐标
        let mesh = posMesh.clone();
        parent.add(mesh);
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.rotation.copy(parent.rotation.clone());
        movePosMeshList.push(mesh);
        movePos.push(pos);
        return;
      }
      if (e == "删除") {
        movePosMeshList[i].parent.remove(movePosMeshList[i]);
        movePosMeshList.splice(i, 1);
        movePos.splice(i, 1);
        return;
      }
      if (e == "更新") {
        let { x, y, z } = pos;
        movePos[i] = { x: x, y: y, z: z };
        movePosMeshList[i].position.set(0, 0, 0);

        movePosMeshList[i].translateX(pos.x);
        movePosMeshList[i].translateY(pos.y);
        movePosMeshList[i].translateZ(pos.z);
        return;
      }
      if (e == "初始") {

        movePos = [];
        if (pos == undefined) {
          return;
        }
        // return;
        pos.map(item => {
          let { x, y, z } = item;
          movePos.push({ x: x, y: y, z: z });
        });
        // 此时pos是数组
        for (let i = 0; i < movePos.length; i++) {
          let pos = movePos[i];
          let mesh = posMesh.clone();
          parent.parent.add(mesh);
          mesh.position.set(0, 0, 0);
          mesh.position.add(parent.position);
          mesh.rotation.copy(parent.rotation.clone());
          mesh.translateX(pos.x);
          mesh.translateY(pos.y);
          mesh.translateZ(pos.z);
          movePosMeshList.push(mesh);
          pos.x = mesh.position.x;
          pos.y = mesh.position.y;
          pos.z = mesh.position.z;
        }

        if (!_Global.setting.inEditor) {
          for (let i = movePosMeshList.length - 1; i >= 0; i--) {
            parent.parent.remove(movePosMeshList[i]);
          }
          movePosMeshList = [];
        }


        return;
      }

    }
    this.SetNavPathToNone = function () {
      SetNavPathToNone();
    }
    // 清空寻路路径
    function SetNavPathToNone() {
      // console.log(" 清空寻路路径 ");
      navpath = [];
      doonce = 0;
      isMoving = false;
      oldTargetPos.set(0, 0, 0);
    }
    // 获取寻路路径
    function GetNavpath(fromPos, targetPos, _randomRedius) {
      if (!scope.canMove) { return; }
      if (oldTargetPos && targetPos.distanceTo(oldTargetPos) < 0.01) {
        // console.log(" 目标点不变 ",oldTargetPos,targetPos);
        if (baseData.state == stateType.Normal) {
          setTimeout(() => {
            scope.RadomNavPos();
          }, 2000);
        }
        return;
      } else {
      }
      oldTargetPos.set(targetPos.x, targetPos.y, targetPos.z);
      if (_randomRedius != undefined) {
        randomRedius = _randomRedius;
      } else {
        randomRedius = vaildAttackDis * 0.5;
      }
      // console.log("查到寻路路径 ",scope.transform.GetData().mapId);
      targetPos.x += radomNum(-1 * randomRedius, 1 * randomRedius);
      targetPos.z += radomNum(-1 * randomRedius, 1 * randomRedius);

      let _navpath = _Global.GetNavpath(scope.transform.GetData().mapId, fromPos, targetPos);
      if (_navpath == null) {
        // console.log("查到寻路路径 为空 ", _navpath, getnavpathTimes, navpath);
        if (targetModel != null) {
          getnavpathTimes++;
          if (getnavpathTimes >= 5) {
            // 无法到达目标点时，1秒后直接设置到目标位置
            setTimeout(() => {
              if (targetModel != null) {
                parent.position.copy(targetModel.GetWorldPos().clone());
              }
              getnavpathTimes = 0;
              navpath = [];
            }, 1000);
          }
        } else {
          //无法寻路 且 没有目标的情况下，表示npc处于无法返回的地形下，3秒后直接设置到其的巡逻点
          navpath.push(targetPos);
          lookAtTargetPos();
          getnavPathTime = 0;
          getnavpathTimes = 0;
          // setTimeout(() => {
          //   // 直接回到起始点
          //   parent.position.copy(fireBeforePos);
          //   getnavPathTime = 0;
          //   getnavpathTimes = 0;
          // }, 3000);
        }

      } else {
        navpath = _navpath;
        lookAtTargetPos();

        getnavPathTime = 0;
        getnavpathTimes = 0;
      }
      // console.error( GetNickName() + "查到寻路路径 ", navpath);
    }


    this._update = function () {
      if (!(navpath || []).length) return;
      if (_YJSkill.GetinSkill()) {
        return;
      }
      let targetPosition = navpath[0];
      const velocity = targetPosition.clone().sub(playerPosition);

      if (velocity.lengthSq() > 0.00075 * baseData.speed) {
        velocity.normalize();
        // Move player to target  
        playerPosition.add(velocity.multiplyScalar(0.015 * baseData.speed));

        // let pos = raycasterDownPos(playerPosition.clone());
        let pos = playerPosition.clone();

        // 在同一位置停留时间超过1秒，则取消移动

        moveLength = pos.distanceTo(oldMovePos) * 5;

        // console.log(" in tick moveLength = ", moveLength);

        // if (moveLength < 0.1) {
        //   samePosTimes++;
        //   if (samePosTimes > 30) {
        //     navpath = [];
        //     doonce = 0;
        //     baseData.state = stateType.Normal;
        //     scope.SetPlayerState("normal");
        //     return;
        //   }
        // }
        scope.SetActionScale(moveLength);
        scope.transform.UpdateDataByType("actionScale", moveLength);
        // console.log(pos, oldMovePos);
        if (oldMovePos != pos) {
          oldMovePos = pos.clone();
        }

        parent.position.copy(pos);
        if (baseData.state == stateType.Normal) {
          scope.SetPlayerState("巡逻");
        } else if (baseData.state == stateType.Back) {
          scope.SetPlayerState("丢失目标");
        } else {
          scope.SetPlayerState("跑向目标");
        }
        // console.log(" npc往目标移动 ", velocity.lengthSq(), 0.00075 * baseData.speed);
        isMoving = true;
        if (targetModel != null && targetModel.isDead) {
          navpath = [];
          TargetDead();
        }

      } else {
        // Remove node from the path we calculated
        navpath.shift();
        doonce = 0;
        if (navpath.length == 0) {
          // console.log("到达目标位置");
          if (baseData.state == stateType.Back) {
            //返回模式到达目标点后，切换为正常模式
            baseData.state = stateType.Normal;
            ChangeEvent("准备巡逻");
          } else if (baseData.state == stateType.Normal) {
            ChangeEvent("准备巡逻");
          }
          isMoving = false;
        } else {
          lookAtTargetPos();
        }

      }
    }

  }
}

export { YJNavPath };