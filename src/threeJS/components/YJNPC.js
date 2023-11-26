import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';

import { YJshader_dissolve } from "/@/threeJS/loader/YJshader_dissolve";


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
    let navpath = [];
    let movePos = [];
    let movePosMeshList = [];
    const clock = new THREE.Clock();
    const WALKSPEED = 3;
    const RUNSPEED = 8;
    const MISSSPEED = 20;
    let playerPosition = new THREE.Vector3(0, 0, 0);

    let fromGroup;
    let animName = "";
    // 目标
    let targetModel;
    // 攻击速度，攻击间隔，判定有效的攻击时机
    let attackStepSpeed = 3; //攻击间隔/攻击速度

    const stateType = {
      Normal: 'normal',//正常状态， 待机/巡逻
      Back: 'back',//失去战斗焦点后回到初始状态 
      Fire: 'fire',//战斗 
      Dead: 'dead',//死亡 
    }

    let baseData = {
      state: 'normal', //状态
      camp: "bl", //阵营
      speed: 8, //移动速度
      level: 1, //等级
      health: 100, //生命值
      maxHealth: 100, //生命值
      strength: 20, //攻击力
    }
    function Init() {
      group = new THREE.Group();
      parent.add(group);

      // fromGroup = new THREE.Group();
      // parent.add(fromGroup);
      // fromGroup.rotation.set(Math.PI/2,0,0);
      playerPosition = parent.position;
      group.rotation.y += Math.PI;

      // group.add(new THREE.AxesHelper(5)); // 场景添加坐标轴
      // return;
      // update();

    }

    let data = null;
    let weaponData = null;
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
      // console.log("in NPC msg = ", data);
      this.npcName = data.name;
      baseData = data.baseData;
      nameScale = data.avatarData.nameScale;
      playerHeight = data.avatarData.height;
      CreateNameTrans(this.npcName);

      // 第一次加载时，把数据加入到全局角色数据中
      _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data.avatarData);

      _YJAnimator.SetAnimationsData(data.avatarData.animationsData);


      if (data.movePos && data.movePos.length > 0) {
        this.UpdateNavPos("停止巡逻", data.movePos);
        // AddDirectPosToNavmesh(data.movePos);
      }
      if( weaponData != null){
        //移除旧武器
        scope.GetBoneVague(weaponData.boneName, (bone) => {
          if(bone.weaponModel){
            bone.remove(bone.weaponModel); 
          }
        });
      }
      if (data.weaponData && data.weaponData.message) {
        weaponData = data.weaponData.message.data;

        //加载武器
        _this._YJSceneManager.DirectLoadMesh(_this.$uploadUrl + data.weaponData.modelPath, (meshAndMats) => {
          scope.GetBoneVague(weaponData.boneName, (bone) => {

            let weaponModel = (meshAndMats.mesh).scene.clone();

            bone.attach(weaponModel);
            bone.weaponModel = weaponModel;
            let pos = weaponData.position;
            let rotaV3 = weaponData.rotation;
            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
            weaponModel.scale.set(100, 100, 100);
            _YJAnimator.ChangeAnim("none");
            scope.SetPlayerState("normal");
            this.UpdateNavPos("开始巡逻", data.movePos);

          });
        });
        // console.log(" 加载武器 ", data.weaponData);
      }
      if (weaponData == null) {
        _YJAnimator.ChangeAnim("none");
        scope.SetPlayerState("normal");
        this.UpdateNavPos("开始巡逻", data.movePos);
      }

    }

    this.GetBoneVague = function (boneName, callback) {
      // console.log("从模型中查找bone ", parent,boneName);
      let doonce = 0;
      try {
        parent.traverse(function (item) {
          if (doonce > 0) { return; }
          if (item.type == "Bone" && item.name.includes(boneName)) {
            if (callback) {
              callback(item);
            }
            doonce++;
          }
        });
      } catch (error) {
        
      }
    } 

    // 通过碰撞检测两个点之间是否可到达
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

    let temp = new THREE.Group();
    _this.scene.add(temp);
    let temp2 = new THREE.Group();
    _this.scene.add(temp2);

    // 判断两点之间是否可以直接到达，即两点之间是否有障碍物，有障碍物表示不可直接到达
    function CheckColliderBetween(fromPos, targetPos) {

      temp.position.copy(fromPos);
      temp2.position.copy(targetPos);
      temp.lookAt(temp2.position);
      let direction = temp.getWorldDirection(new THREE.Vector3());
      var raycaster_collider = new THREE.Raycaster(fromPos, direction, 0, 1 * fromPos.distanceTo(targetPos));
      var hits = raycaster_collider.intersectObjects(_this._YJSceneManager.GetAllColliderAndLand(), true);


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



    let posMesh = _Global.setting.navPointMesh;

    //#region 添加巡逻坐标点 
    this.UpdateNavPos = function (e, pos, i) {
      // console.log(" 刷新巡逻点 ", e, pos,i);
      if (e == "停止巡逻") {
        //回到transform原始位置
        navpath = [];

        ClearLater("清除巡逻");

        this.SetPlayerState("normal");
        scope.transform.ResetPosRota();
        //巡逻点跟随物体
        for (let i = 0; i < movePosMeshList.length; i++) {
          const mesh = movePosMeshList[i];
          parent.attach(mesh);
        }
        return;
      }
      if (e == "开始巡逻") {
        //此时 pos为settingData.movePos

        for (let i = 0; i < movePosMeshList.length; i++) {
          const mesh = movePosMeshList[i];
          parent.remove(mesh);
        }

        movePosMeshList = [];
        scope.UpdateNavPos('初始', pos);
        ClearLater("清除巡逻");
        laterNav = setTimeout(() => {
          GetNavpath(parent.position.clone(), movePos[radomNum(0, movePos.length - 1)]);
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
        parent.remove(movePosMeshList[i]);
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

    //#endregion
    this.Start = function () {
      GetNavpath(parent.position.clone(), movePos[radomNum(0, movePos.length - 1)]);
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
      resetButtonText.name = "nameBar";


      resetButtonText.material.color.set(_Global.user.camp != baseData.camp ? '#ee0000' : '#ffffff');


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
    this.SetTarget = function (_targetModel,isLocal) {

      if (baseData.state == stateType.Back) {
        return;
      }
      if(_targetModel == null){
        targetModel = _targetModel;
      }else{
        if (targetModel == null) {
          targetModel = _targetModel;
          fireBeforePos = scope.transform.GetWorldPos();
        } 
      }
      // console.log("targetModel npc目标 ", targetModel);
      let npcPos = parent.position.clone();

      if (targetModel == null) {
        // 暂停1秒
        navpath = [];
        doonce = 0;
        baseData.state = stateType.Back;
        scope.SetPlayerState("normal");
        ClearLater("清除巡逻");
        laterNav = setTimeout(() => {
          let currentPos = scope.transform.GetWorldPos();
          if (currentPos.distanceTo(fireBeforePos) >= 20) {
            baseData.speed = MISSSPEED;
          }
          GetNavpath(npcPos, fireBeforePos);
        }, 1000);
        baseData.health = baseData.maxHealth;
        scope.transform.UpdateData();

        if(isLocal){
          _Global.DyncManager.SendModelState(scope.transform.GetData().id,{modelType:scope.transform.GetData().modelType, msg:{type:"设置目标", playerId:"",}});
        }

        return;
      }

			readyAttack = false;
      scope.SetPlayerState("准备战斗");

      let playerPosRef = targetModel.GetWorldPos().clone();
      playerPosRef.y = npcPos.y;
      parent.lookAt(playerPosRef);

      baseData.speed = RUNSPEED;
      baseData.state = stateType.Fire;
      fireBeforePos = scope.transform.GetWorldPos(); 
      if(isLocal){
        _Global.DyncManager.SendModelState(scope.transform.GetData().id,{modelType:scope.transform.GetData().modelType, msg:{type:"设置目标", playerId:targetModel.id,  health:baseData.health}});
      }

    }



    let checkPlayerLater = null;
    //实时检测附近玩家
    function CheckPlayer() {

      if (checkPlayerLater != null) {
        clearTimeout(checkPlayerLater);
        checkPlayerLater = null;
      }
      checkPlayerLater = setTimeout(() => {
        CheckPlayer();
      }, 500);
    }
    function GetAnimNameByPlayStateAndWeapon(e, weaponData) {
      return _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon(e, weaponData);
    }
    function GetSkillDataByWeapon(weaponData) {
      return _Global.CreateOrLoadPlayerAnimData().GetSkillDataByWeapon(weaponData);
    }
    
		function EventHandler(e) {
			if (e == "中断技能") { 
				if (vaildAttackLater != null) {
					clearTimeout(vaildAttackLater);
					clearTimeout(vaildAttackLater2);
					vaildAttackLater = null;
				} 
			}
		}
    this.SetPlayerState = function (e, type) {
      // console.log(" in SetPlayerState  ", e, type);

      switch (e) {
        case "普通攻击":
          var { s, v, a } = GetSkillDataByWeapon(weaponData);
          skillName = s;
          vaildAttackDis = v;
          attackStepSpeed = a;
          animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);

          break;
        case "赤手攻击":
          animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
          break;
        case "准备战斗":

          var { s, v, a } = GetSkillDataByWeapon(weaponData);
          skillName = s;
          vaildAttackDis = v;
          attackStepSpeed = a;
          animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);

          if (vaildAttackLater == null) {
            vaildAttackLater = setTimeout(() => {
							readyAttack = true;
              inBlocking = false;
              vaildAttackLater = null;
            }, attackStepSpeed * 1000);
          }

          break;
        case "受伤":
          animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);

          break;
        case "normal":
          animName = GetAnimNameByPlayStateAndWeapon("停止移动", weaponData);
          break;
        case "death":
          animName = "death";
          break;
        case "跑向目标":
          baseData.speed = RUNSPEED;
          animName = GetAnimNameByPlayStateAndWeapon("移动", weaponData);
					EventHandler("中断技能");
          
          break;
        case "丢失目标":
          animName = GetAnimNameByPlayStateAndWeapon("移动", weaponData);
					EventHandler("中断技能");
          
          break;
        case "巡逻":
          baseData.speed = WALKSPEED;
          animName = GetAnimNameByPlayStateAndWeapon("行走", weaponData);
          break;
        default:
          break;
      }
      _YJAnimator.ChangeAnim(animName);
    }

    let targetModelList = [];

    this.ReceiveDamage = function (_targetModel, skillName, strength) {
      if (targetModel == null) { 
        this.SetTarget(_targetModel,true);
      }

      baseData.health -= strength;
      //_targetModel 是 YJPlayer
      // console.log(this.npcName + " 受到 " + _targetModel.GetPlayerName() +" 使用 "+ skillName + " 攻击 剩余 " + baseData.health);

      ClearLater("清除准备战斗");

      if (baseData.health <= 0) {
        baseData.health = 0;
      }

      UpdateData();

      _Global.DyncManager.SendModelState(scope.transform.GetData().id,{modelType:scope.transform.GetData().modelType, msg:{playerId:_targetModel.id, health:baseData.health}});

      if (baseData.health == 0) { 
        ClearLater("清除巡逻");
        return baseData.health;
      }

      // scope.SetPlayerState("受伤");

      if (baseData.state == stateType.Normal) {
        baseData.state = stateType.Fire;
      }
 
      return baseData.health;
    }
    // 不在战斗且未死亡，且不在miss中，才可以设置
    this.isCanSetTarget = function(){
      return  baseData.state != stateType.Back && baseData.state != stateType.Fire && baseData.state != stateType.Dead;
    }
    this.GetCamp = function(){
      return baseData.camp;
    }
    // 接收同步
    this.Dync = function(msg){

      // console.log("接收npc同步数据 ",msg);
      if(msg.health == 0){
        if(baseData.health == baseData.maxHealth){
          baseData.health = msg.health;
          // 模型渐隐消失
          scope.transform.Destroy();
          return;
        }
      }
      baseData.health = msg.health;
      if(msg.playerId ){
        if(targetModel == null){
          this.SetTarget(_Global.YJDync.GetPlayerById(msg.playerId));
        }
      }else{
        this.SetTarget(null);
      }
      UpdateData();
    }
    function UpdateData(){
      
      scope.transform.UpdateData(); // 触发更新数据的回调事件
      if (baseData.health == 0) {
        navpath = [];
        baseData.state = stateType.Dead;
        scope.SetPlayerState("death");
        setTimeout(() => {
          // 先执行溶解特效
          new YJshader_dissolve(scope.transform.GetGroup());
        }, 5000); 
        setTimeout(() => {
          // 模型渐隐消失
          scope.transform.Destroy();
        }, 10000); 
      }
    }

    let oldPlayerPos = null;
    let inBlocking = false;
    let vaildAttackLater = null;
    let vaildAttackLater2 = null;
    let toIdelLater = null;
    let skillName = "";
    let vaildAttackDis = 3; //有效攻击距离
		let readyAttack = false;
    let readyAttack_doonce = 0;
    function CheckState() {

      if (baseData.state == stateType.Normal) {
      }

      if (baseData.state == stateType.Fire) {
        if (targetModel == null) {
          return;
        }
        // 逻辑见note/npc策划.md 战斗策略
        let playerPos = targetModel.GetWorldPos();
        // let npcPos = scope.transform.GetWorldPos();
        let npcPos = parent.position.clone();
        let playerPosRef = playerPos.clone();
        playerPosRef.y = npcPos.y ;
        if (oldPlayerPos != playerPosRef) {
          oldPlayerPos = playerPosRef;
          navpath = [];
          doonce = 0;
        }
        let dis = playerPosRef.distanceTo(npcPos);
        if (dis < vaildAttackDis && !CheckColliderBetween(npcPos, playerPosRef)) {
          navpath = [];
          doonce = 0;
          parent.lookAt(playerPosRef.clone());
          if(readyAttack_doonce == 0){
            readyAttack = false;
            scope.SetPlayerState("准备战斗");
          }
          readyAttack_doonce++;
          // console.log(" 进入攻击范围内 ，停止跑动，进入战斗状态 ");
          //攻击
          if (readyAttack) {
						readyAttack = false;

            ClearLater("清除准备战斗");

            scope.SetPlayerState("普通攻击");
            vaildAttackLater2 = setTimeout(() => {
              //有效攻击
              if (targetModel != null && targetModel.isLocal) {
                // let isDead = targetModel.DyncPlayerState({
                //   title:"fire",
                //   content:"受到伤害",
                //   msg:{_targetModel:targetModel, skillName:skillName,strength: baseData.strength},
                // }); 

                let isDead = targetModel.owner.ReceiveDamage(scope.transform, skillName, baseData.strength);
                if (isDead) {
                  console.log(" npc目标玩家死亡 =====");
                  targetModel = null;
                  scope.SetTarget(targetModel,true);
                  return;
                }
              }

            }, attackStepSpeed * 100);

            toIdelLater = setTimeout(() => {
              scope.SetPlayerState("准备战斗");
              toIdelLater = null;
            }, attackStepSpeed * 300);//间隔等于攻击动作时长

          }

          getnavpathTimes = 0;
        } else {
					EventHandler("中断技能");
          inBlocking = false;
          //跑向目标 
          GetNavpath(npcPos, playerPos);
          readyAttack_doonce = 0;
        }
        // console.log( scope.npcName + " in fire " + dis);
      }
    }
    let getnavpathTimes = 0;
    function GetNavpath(fromPos, targetPos) {
      navpath = _Global.GetNavpath(fromPos, targetPos);
      if (navpath == null) {
        getnavpathTimes++;
        if (getnavpathTimes >= 100) {
          // 无法到达目标点时，3秒后，失去目标
          if(targetModel != null){
            targetModel = null;
            scope.SetTarget(null,true); 
          }
          getnavpathTimes = 0; 
        }
      }
      // console.log("查到寻路路径 ", navpath);
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
      if (state == "跑向目标") {

      }
      if (state == "战斗前") {

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

    let oldMovePos = null;
    let samePosTimes = 0;
    //寻路
    function tick(dt) {
      if (!(navpath || []).length) return;
      let targetPosition = navpath[0];
      const velocity = targetPosition.clone().sub(playerPosition);

      if (velocity.lengthSq() > 0.00075 * baseData.speed) {
        velocity.normalize();
        // Move player to target
        playerPosition.add(velocity.multiplyScalar(0.015 * baseData.speed));
        // console.log(" in tick 222 ", playerPosition);

        // pathfindingHelper.setPlayerPosition( playerPosition );

        // let pos = raycasterDownPos(playerPosition.clone());
        let pos = playerPosition.clone();


        // 在同一位置停留时间超过1秒，则取消移动
        // if (oldMovePos != pos) {
        //   oldMovePos = pos.clone();
        // }
        // if (pos.distanceTo(oldMovePos) < 0.1) {
        //   samePosTimes++;
        //   if (samePosTimes > 30) {
        //     navpath = [];
        //     doonce = 0;
        //     baseData.state = stateType.Normal;
        //     scope.SetPlayerState("normal");
        //     return;
        //   }
        // }
        // console.log(pos, oldMovePos);

        parent.position.copy(pos);

        let lookatPos = targetPosition.clone();
        lookatPos.y = parent.position.y;
        if (doonce < 1) {
          if (navpath.length > 0) {
            //角色朝向目标点
            parent.lookAt(lookatPos);
          }
          doonce++;
        }

        if (baseData.state == stateType.Normal) {
          scope.SetPlayerState("巡逻");
        } else if (baseData.state == stateType.Back) {
          scope.SetPlayerState("丢失目标");
        } else {
          scope.SetPlayerState("跑向目标");
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
        }

      }
    }
    //清除延时
    function ClearLater(e){
      if(e=="清除巡逻"){
        if (laterNav != null) {
          clearTimeout(laterNav);
          laterNav = null;
        }
      }
      if(e=="清除准备战斗"){
        if (toIdelLater != null) {
          clearTimeout(toIdelLater);
          toIdelLater = null;
        }
      }
    }
    let laterNav = null;
    function ChangeEvent(e) {
      if (e == "准备巡逻") {
        scope.SetPlayerState("normal");
        ClearLater("清除巡逻");
        laterNav = setTimeout(() => {
          //在正常模式到达目标点，表示在巡逻过程中。再次到下一个巡逻点
          GetNavpath(parent.position.clone(), movePos[radomNum(0, movePos.length - 1)]);
        }, 2000);
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