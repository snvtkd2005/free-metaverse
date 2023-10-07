import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';

import { YJLoadAvatar } from "./YJLoadAvatar.js";

import { GetPathFolders, LoadFile } from "/@/utils/api.js";


import { YJRigidbody } from "./YJRigidbody.js";
import { YJGPT } from "./YJGPT.js";
import { YJPlayerChat } from "./YJPlayerChat.js";


// NPC 角色
// 1，头顶上方有 感叹号 ，表示可交互
// 2，交互方式为：靠近弹出交互内容，远离交互内容消失
// 3，制作碰撞区域
// 4，设置 交互内容，图、文、视频

class YJNPC {
  constructor(_this, scene, assetId, avatarData, pos, rota, size, npcManager) {
    var scope = this;

    //初始化npc, npc名称、坐标、旋转、avataPath(角色模型加载路径)
    let avatar = null;
    let group = null;
    let playerHeight, nameScale;

    let navpath = [];
    let doonce = 0;
    const clock = new THREE.Clock();
    let playerPosition = new THREE.Vector3(0, 0, 0);
    const SPEED = 3;

    var model = null;
    // 获取模型准备移动
    this.GetModel = function () {
      this.DestroyCollider();
      return group;
    }
    this.GetName = function(){
      return npcName;
    }
    this.GetWorldPos = function () {
      let pos = group.position.clone();
      pos.y += playerHeight;
      return pos;
    }
    let fromGroup, dricGroup, pointGroup;

    let _YJGPT = null;
    let _YJPlayerChat = null;
    function Init() {
      group = new THREE.Group();
      scene.add(group);

      fromGroup = new THREE.Group();
      // dricGroup = new THREE.Group();
      // pointGroup = new THREE.Group();
      scene.add(fromGroup);
      fromGroup.rotation.set(Math.PI / 2, 0, 0);

      // scene.add(dricGroup);
      // scene.add(pointGroup);
      // fromGroup.add(new THREE.AxesHelper(1)); // 场景添加坐标轴
      // dricGroup.add(new THREE.AxesHelper(1)); // 场景添加坐标轴
      // pointGroup.add(new THREE.AxesHelper(5)); // 场景添加坐标轴
      // _this.pointsParent.add(group);

      group.position.set(pos.x, pos.y, pos.z);
      group.rotation.set(rota.x, rota.y, rota.z);

      group.rotation.y += Math.PI;

      playerPosition.set(pos.x, pos.y, pos.z);
      // group.add(new THREE.AxesHelper(5)); // 场景添加坐标轴
      // return;



      LoadAvatar();


      // if (avatarData == null) {
      //   LoadTxt(assetId, "C:/wamp/www/vue/yjwebgame/public/models/npc");
      // } else {
      // }
    }

    this.SendMsg = function(msg,callback){
      _YJGPT.SendMsg(msg,(data)=>{
        avatar.ChangeAnim(data.action); 
        if (_YJPlayerChat == null) {
          _YJPlayerChat = new YJPlayerChat(namePosTrans, nameScale);
        }
        _YJPlayerChat.CreateChatTrans(data.message);
        if(callback){
          callback(data.message);
        }
      });
    }

    async function LoadTxt(filePath, serverPath) {

      // console.log("加载文本", serverPath+"/" +filePath+"/"+filePath+"_avatar.txt");
      let fromData = new FormData();
      fromData.append(
        "dataPath",
        serverPath + "/" + filePath + "/" + filePath + "_avatar.txt"
      );
      let response = await LoadFile(fromData);
      if (response == null || response == "") {
        return;
      }
      avatarData = response;
      // console.log("加载角色数据",response);
      LoadAvatar();

    }

    //加载用户上传的模型，用户上传的模型，数据都在同步的avatarData中
    this.LoadPlayerByCustom = function (avatarData) {

    }


    let _YJRigidbody = null;
    let isRigid = true;
    //有效半径随等级变换
    let radius = 3;
    function LoadAvatar() {
      // console.log("加载 npc 角色", avatarData);
      // avatarData = avatarData.modelData;
      playerHeight = avatarData.height;
      nameScale = 1;
      let animationsData = avatarData.animationsData;


      // if(isRigid){
      //   _YJRigidbody = new YJRigidbody(scene,group,playerHeight,0.2);
      //   _YJRigidbody.GenerateRigid();
      // }



      avatar = new YJLoadAvatar(
        _this,
        _this.scene,
        _this.GetPublicUrl() + avatarData.modelPath,
        animationsData,
        scope,
        (_playerObj) => {

          model = _playerObj;
          // console.log("加载到的 npc 角色模型", model);
          group.add(model);

          model.position.set(0, 0, 0);

          // CreateNameTrans(avatarData.name);
          // CreateValidArea(radius);

          LoadCompleted();
          // avatar.ChangeAnim("idle");
    
          update();

        }
      );
    }

    let data = null;
    let npcPos = [];
    let npcName = "";
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      data = JSON.parse(msg);
      // console.log("msg = " ,data); 

      npcName = data.npcName;

      CreateNameTrans(data.npcName);

      if (data.movePos.length > 0) {
        return;
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
      var hits = raycaster_collider.intersectObjects(scene.children, true);
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
    this.GetAllMesh = function () {
      let meshes = [];
      model.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          meshes.push(item);
          return meshes;
        }
        if (item instanceof THREE.SkinnedMesh) {
          meshes.push(item);
          return meshes;
        }
      });
      return meshes;
    }

    //#region 
    //#endregion

    //#region 创建姓名条参考物体
    let namePosTrans = null;
    //创建姓名条参考物体
    function CreateNameTrans(content) {
      namePosTrans = new THREE.Group();
      namePosTrans.name = "npcname";
      group.add(namePosTrans);
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


      if (_YJPlayerChat == null) {
        _YJPlayerChat = new YJPlayerChat(namePosTrans, nameScale);
      }

      
      if(npcName=="咕叽"){
        if (_YJGPT == null) {
          _YJGPT = new YJGPT("",(data)=>{
            avatar.ChangeAnim(data.action); 
          });
          _YJGPT.Init();
        }
      }
    }
    //#endregion


    let triggerMesh;
    //#region  创建碰撞区域
    function CreateValidArea(radius) {
      // return;
      const geometry = new THREE.CylinderGeometry(radius, radius, 2, 18, 5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        transparent: true,
        opacity: 0.0,
        alphaTest: true,
      });
      triggerMesh = new THREE.Mesh(geometry, material);
      triggerMesh.name = "ignoreRaycast";
      group.add(triggerMesh);


      _this._YJSceneManager.CreateCylinderTrigger(triggerMesh, new THREE.Vector3(radius, 2, radius),
        assetId, "npc"
      );

    }
    //#endregion

    let lookAtObj = null;
    let oldRota;
    this.SetOverlapPlayer = function (player) {
      lookAtObj = player;
      if (lookAtObj == null) {
        group.rotation.copy(oldRota);

      } else {
        oldRota = group.rotation.clone();
      }
    }

    this.GetBaseModel = () => {
      return { group, playerHeight }
    }



    //-------添加删除 开始------------
    //同步服务器上的其他客户端创建的模型的状态
    function _SetState(_state) {



    }

    this.ResetSetPosRota = function (pos, rota) {
      if (model == null) { return; }
      this.SetPosRota(pos, rota);
    }
    //用户摆放自定义的模型，位置跟随鼠标悬浮的地面位置
    this.SetPosRota = function (pos, rota) {
      if (model == null) { return; }
      group.position.set(pos.x, pos.y, pos.z); // 
      if (rota != undefined) {
        group.rotation.set(rota.x, rota.y, rota.z); // 
      }
    }

    //可由用户创建的模型，放下是创建碰撞体
    this.SetDown = function (pos, rota) {
      _this._YJSceneManager.CreateCylinderTrigger(triggerMesh, new THREE.Vector3(radius, 2, radius),
        assetId, "npc"
      );
    }
    function LoadCompleted() {

    }
    //删除模型
    this.Destroy = function () {
      //删除碰撞体 
      // this.DestroyCollider();
      cancelAnimationFrame(updateId);
      avatar.Destroy();
      scene.remove(group);

    }
    this.DestroyCollider = function () {
      if (triggerMesh.userData.physicsBody == null
        || triggerMesh.userData.physicsBody == undefined) { return; }
      //删除碰撞体
      _this._YJSceneManager.RemoveCollider(triggerMesh);
    }

    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(group.position, group.rotation);
    }

    Init();
    var updateId = null;
    function update() {
      updateId = requestAnimationFrame(update);

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

      tick(clock.getDelta());

    }

    // NPC行为树、状态机
    function ChangeAnim(state) {
      if (state == "行走") {
        avatar.ChangeAnim("walk");

      }
      if (state == "停止") {
        avatar.ChangeAnim("idle");
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


      if (velocity.lengthSq() > 0.05 * 0.05) {
        velocity.normalize();
        // Move player to target
        playerPosition.add(velocity.multiplyScalar(0.015 * SPEED));

        // pathfindingHelper.setPlayerPosition( playerPosition );

        let pos = raycasterDownPos(playerPosition.clone());
        // let pos = playerPosition.clone();

        group.position.copy(pos);

        if (doonce < 1) {
          if (navpath.length > 0) {
            //角色朝向目标点
            group.lookAt(targetPosition.clone());
          }
          doonce++;
        }


      } else {
        // Remove node from the path we calculated
        navpath.shift();
        doonce = 0;
        if (navpath.length == 0) {
          ChangeAnim("停止");

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
      // var hits = raycaster.intersectObjects(scene.children, true);
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