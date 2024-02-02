import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';

import { YJshader_dissolve } from "/@/threeJS/loader/YJshader_dissolve";


// NPC
// 实现显示头顶姓名条、血条
// 控制 animator  动画播放
// 1，头顶上方有 感叹号 ，表示可交互
// 2，交互方式为：靠近弹出交互内容，远离交互内容消失
// 3，制作碰撞区域
// 4，设置 交互内容，图、文、视频

class YJNPC {
  constructor(_this, parent, _YJAnimator) {
    var scope = this;
    this.fireId = -1; //战斗组id  -1表示未在战斗中
    this.isDead = false;
    this.id = 0;
    let group = null;
    let playerHeight;
    let nameScale = 1;
    let doonce = 0;
    let isMoving = false;

    // 记录模型材质
    let materials = [];
    let navpath = [];
    let movePos = [];
    let movePosMeshList = [];
    const clock = new THREE.Clock();
    const WALKSPEED = 3;
    const RUNSPEED = 8;
    const MISSSPEED = 12;
    let playerPosition = new THREE.Vector3(0, 0, 0);

    let fromGroup;
    let animName = "";
    // 目标 是 YJPlayer 或 YJNpc 对象
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
      camp: 1001, //阵营
      speed: 8, //移动速度
      level: 1, //等级
      health: 100, //生命值
      maxHealth: 100, //生命值
      strength: 20, //攻击力
      fireId: -1, //战斗组id  -1表示未在战斗中
    }

    //#region  固定
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

    let lookAtObj = null;

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

    // 记录模型材质
    function recodeMat() {
      scope.transform.GetGroup().traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          if (item.name.includes("collider") || item.name.includes("nameBar")) {
          } else {
            materials.push({ mesh: item, mat: item.material });
          }
        }
      });
    }
    //销毁组件
    this.Destroy = function () {
      if (_Global.setting.inEditor) {
        console.log("删除移动点");
        // for (let i = movePosMeshList.length - 1; i >= 0; i--) {
        //   movePosMeshList[i].parent.remove(movePosMeshList[i]);
        // }
        movePosMeshList = [];
      }
      EventHandler("中断技能", true);

      // 清除技能触发
      ClearFireLater();
      if(laterNav){
        clearTimeout(laterNav);
      } 
    }
    //放下后，获取模型的坐标和旋转，记录到服务器，让其他客户端创建
    this.GetPosRota = function (callback) {
      callback(group.position, group.rotation);
    }
    this.GetBaseModel = () => {
      return { group, playerHeight }
    }

    this.GetTargetModelId = () => {
      if (targetModel == null) { return null; }
      return targetModel.id;
    }

    function lookAtTargetPos() {
      if (navpath.length == 0) {
        return;
      }
      let lookatPos = navpath[0].clone();
      lookatPos.y = parent.position.y;
      parent.lookAt(lookatPos);
    }
    let oldAnimName = "";
    this.ChangeAnim = function (v) {
      if (oldAnimName != v) {
        if (_Global.mainUser) {
          //发送动作同步
          _Global.DyncManager.SendModelState(scope.transform.GetData().id, { modelType: scope.transform.GetData().modelType, msg: { title: "设置动作", animName: v, } });
        }
      }
      _YJAnimator.ChangeAnim(v);
      oldAnimName = v;

    }



    // 不在战斗且未死亡，且不在miss中，才可以设置
    this.isCanSetTarget = function () {
      return baseData.state != stateType.Back && baseData.state != stateType.Fire && baseData.state != stateType.Dead;
    }
    this.GetCamp = function () {
      return baseData.camp;
    }

    // 移除武器
    this.RemoveWeapon = function () {
      if (weaponData != null) {
        //移除旧武器
        scope.GetBoneVague(weaponData.boneName, (bone) => {
          if (bone.weaponModel) {
            bone.remove(bone.weaponModel);
          }
        });
        weaponData = null;
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
      return false;

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
    function CheckTrainPos(fromPos, targetPos) {
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
            return hits[i].point;
          }
        } 
      }
      return null;
    }
    //#endregion 

    //#region 寻路 添加巡逻坐标点 

    // 随机寻路点
    this.RadomNavPos = function () {

      if (_Global.mainUser) {
        if(data.inAreaRandom){
          let startPos = parent.position.clone();
          let targetPos = fireBeforePos.clone();
          if(data.areaRadius == undefined){
            data.areaRadius = 1;
          }
          targetPos.x += radomNum(-data.areaRadius, data.areaRadius);
          targetPos.z += radomNum(-data.areaRadius, data.areaRadius);
          targetPos.y +=5;
          let p = targetPos.clone();
          p.y -=10;
          let point = CheckTrainPos(targetPos,p);
          GetNavpath(startPos,point?point:targetPos);
          // console.log(" npc 巡逻随机范围 ");
        }else{
          let navPosIndex = radomNum(0, movePos.length - 1);
          GetNavpath(parent.position.clone(), movePos[navPosIndex]);
          _Global.DyncManager.UpdateModel(scope.id, "navPosIndex",
            { navPosIndex: navPosIndex });
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

      this.UpdateNavPos("开始巡逻", data.movePos);
    }

    let posMesh = _Global.setting.navPointMesh;

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
        return;
      }
      if (e == "开始巡逻") {
        //此时 pos为settingData.movePos

        for (let i = 0; i < movePosMeshList.length; i++) {
          const mesh = movePosMeshList[i];
          if(mesh.parent){
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

    let getnavPathTime = 20;
    let getnavpathTimes = 0;
    // 清空寻路路径
    function SetNavPathToNone() {
      // console.log(" 清空寻路路径 ");
      navpath = [];
      doonce = 0;
      isMoving = false;
    }
    // 获取寻路路径
    function GetNavpath(fromPos, targetPos) {
      // console.log("查到寻路路径 ",scope.transform.GetData().mapId);
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
          setTimeout(() => {
            // 直接回到起始点
            parent.position.copy(fireBeforePos);
            getnavPathTime = 0;
            getnavpathTimes = 0;
          }, 3000); 
        }

      } else {
        navpath = _navpath;
        lookAtTargetPos();

        getnavPathTime = 0;
        getnavpathTimes = 0;
      }
      // console.log("查到寻路路径 ", navpath);
    }
    //#endregion

    //#region  SetMessage
    let skillList = [];
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      scope.id = scope.transform.id;
      // console.log("in NPC msg = ", scope.id, data);


      this.npcName = data.name;
      baseData = data.baseData;
      if (baseData.camp == "bl") {
        baseData.camp = 1001;
      }
      nameScale = data.avatarData.nameScale;
      playerHeight = data.avatarData.height;
      CreateNameTrans(this.npcName);
      scope.transform.isIgnoreRaycast = true;
      // 第一次加载时，把数据加入到全局角色数据中
      _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data.avatarData);

      _YJAnimator.SetAnimationsData(data.avatarData.animationsData);

      if (data.skillList == undefined) {
        data.skillList = [];
      }
      skillList = data.skillList;
      if(data.inAreaRandom){

      }else{
        if (data.movePos && data.movePos.length > 0 ) {
          this.UpdateNavPos("停止巡逻", data.movePos); 
        }
      }

      this.RemoveWeapon();

      if (data.weaponData && data.weaponData.message) {
        weaponData = data.weaponData.message.data;

        //加载武器
        _this._YJSceneManager.DirectLoadMesh(_this.$uploadUrl + data.weaponData.modelPath, (meshAndMats) => {
          scope.GetBoneVague(weaponData.boneName, (bone) => {

            let weaponModel = (meshAndMats.mesh).scene.clone();
            weaponModel.traverse(function (item) {
              if (item instanceof THREE.Mesh) {
                item.transform = scope;
                item.tag = "weapon";
              }
            });

            bone.attach(weaponModel);
            bone.weaponModel = weaponModel;
            let pos = weaponData.position;
            let rotaV3 = weaponData.rotation;
            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
            weaponModel.scale.set(100, 100, 100);
            scope.ChangeAnim("none");
            scope.SetPlayerState("normal");
            this.PathfindingCompleted();
            // 记录材质
            if (materials.length == 0) {
              recodeMat();
            }
          });
        });
      }
      if (weaponData == null) {
        scope.ChangeAnim("none");
        scope.SetPlayerState("normal");
        this.PathfindingCompleted();
        // 记录材质
        if (materials.length == 0) {
          recodeMat();
        }
      }
      fireBeforePos = scope.GetWorldPos();

      if (data.isCopy) {
        skillList = [];
        ClearFireLater();
      }
    }
    //#endregion 

    //#region  动作切换

    let _offsetTime = 0;
    let cutStartTime = 0;
    function EventHandler(e, cutSkill = true) {
      if (e == "中断技能") {
        if (vaildAttackLater != null || vaildAttackLater2 != null || toIdelLater != null) {
          clearTimeout(vaildAttackLater);
          clearTimeout(vaildAttackLater2);
          clearTimeout(toIdelLater);
          vaildAttackLater = null;
          vaildAttackLater2 = null;
          toIdelLater = null;
          //记录当前时间
          _offsetTime = new Date().getTime() - cutStartTime;
          cutStartTime = new Date().getTime();

          if (cutSkill) {
            if (inSkill) {
              _Global.DyncManager.SendDataToServer("npc技能",
                { npcId: scope.id, skill: "中断" });
              inSkill = false;
            }
          }
          // console.log(" 记录中断的时间 ",cutStartTime);
        }
      }
    }
    let oldPlayerPos = new THREE.Vector3(0, 0, 0);
    let vaildAttackLater = null;
    let vaildAttackLater2 = null;
    let toIdelLater = null;
    let skillName = "";
    let vaildAttackDis = 3; //有效攻击距离
    let readyAttack = false;
    let readyAttack_doonce = 0;

    let fireLater = [];
    let inSkill = false;//是否在使用施法技能攻击


    function GetAnimNameByPlayStateAndWeapon(e, weaponData) {
      return _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon(e, weaponData);
    }
    function GetSkillDataByWeapon(weaponData) {
      return _Global.CreateOrLoadPlayerAnimData().GetSkillDataByWeapon(weaponData);
    }


    this.SetPlayerState = function (e, castTime, animNameReady, _animName, effect) {

      switch (e) {
        case "普通攻击":
          var { s, v, a } = GetSkillDataByWeapon(weaponData);
          skillName = s;
          vaildAttackDis = v;
          attackStepSpeed = a;
          animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);

          cutStartTime = new Date().getTime();
          // console.log(" 记录上一次成功攻击的时间 ",cutStartTime);
          break;

        case "法术准备":

          EventHandler("中断技能", false);

          animName = animNameReady;
          if (vaildAttackLater == null) {
            vaildAttackLater = setTimeout(() => {
              if (targetModel != null && targetModel.isDead) {
                CheckNextTarget();
                return;
              }
              this.SetPlayerState("法术攻击", "", "", _animName, effect);
              vaildAttackLater = null;
            }, attackStepSpeed * 1000);
          }

          break;
        case "法术攻击":

          animName = _animName;
          vaildAttackLater2 = setTimeout(() => {
            if (targetModel.isDead) {
              EventHandler("中断技能");
              return;
            }
            //有效攻击 && 
            SendDamageToTarget(targetModel, effect);

            _Global.DyncManager.SendDataToServer("npc技能攻击",
              { npcId: scope.id, skill: effect });

          }, attackStepSpeed * 100);

          toIdelLater = setTimeout(() => {
            scope.SetPlayerState("准备战斗");
            toIdelLater = null;
            inSkill = false;
          }, attackStepSpeed * 400);//间隔等于攻击动作时长


          break;


        case "随机法术准备":
          EventHandler("中断技能", false);
          animName = animNameReady;
          if (vaildAttackLater == null) {
            vaildAttackLater = setTimeout(() => {
              if (randomSelectModel != null && randomSelectModel.isDead) {
                CheckNextTarget();
                return;
              }
              this.SetPlayerState("随机法术攻击", "", "", _animName, effect);
              vaildAttackLater = null;
            }, attackStepSpeed * 1000);
          }
          break;

        case "随机法术攻击":

          animName = _animName;
          vaildAttackLater2 = setTimeout(() => {
            if (randomSelectModel.isDead) {
              EventHandler("中断技能");
              return;
            }
            //有效攻击 && 
            SendDamageToTarget(randomSelectModel, effect);

            _Global.DyncManager.SendDataToServer("npc技能攻击",
              { npcId: scope.id, skill: effect });

          }, attackStepSpeed * 100);

          toIdelLater = setTimeout(() => {
            scope.SetPlayerState("准备战斗");
            toIdelLater = null;
            inSkill = false;
          }, attackStepSpeed * 400);//间隔等于攻击动作时长
          break;

        case "无目标法术准备":
          EventHandler("中断技能", false);
          animName = animNameReady;
          if (vaildAttackLater == null) {
            vaildAttackLater = setTimeout(() => {
              this.SetPlayerState("无目标法术攻击", "", "", _animName, effect);
              vaildAttackLater = null;
            }, attackStepSpeed * 1000);
          }
          break;
        case "无目标法术攻击":
          animName = _animName;
          vaildAttackLater2 = setTimeout(() => {
            //有效攻击 && 
            SendSkill(effect);
            effect.times = hyperplasiaTimes;
            _Global.DyncManager.SendDataToServer("npc技能攻击",
              { npcId: scope.id, skill: effect });
          }, attackStepSpeed * 100);

          toIdelLater = setTimeout(() => {
            scope.SetPlayerState("准备战斗");
            toIdelLater = null;
            inSkill = false;
          }, attackStepSpeed * 400);//间隔等于攻击动作时长
          break;
        case "持续伤害法术":
          animName = _animName;
          toIdelLater = setTimeout(() => {
            scope.SetPlayerState("准备战斗");
            toIdelLater = null;
            inSkill = false;
          }, attackStepSpeed * 1000);//间隔等于攻击动作时长
          break;
        case "准备战斗":

          var { s, v, a } = GetSkillDataByWeapon(weaponData);
          vaildAttackDis = v;
          attackStepSpeed = a;
          animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
          if (targetModel != null && targetModel.isDead) {
            CheckNextTarget();
            return;
          }
          // 计算技能施法时间
          let offsetTime = attackStepSpeed * 1000;
          if (_offsetTime != 0) {
            _offsetTime += new Date().getTime() - cutStartTime - attackStepSpeed * 300;
            if (_offsetTime > offsetTime) {
              offsetTime = 20;
            } else {
              offsetTime -= _offsetTime;
            }
            // console.log(" 计算施法时间 减去 ",_offsetTime);
            // console.log(" 计算施法时间 ", offsetTime);
            _offsetTime = 0;
          }

          if (vaildAttackLater == null) {
            vaildAttackLater = setTimeout(() => {


              if (targetModel != null && targetModel.isDead) {
                CheckNextTarget();
                return;
              }
              readyAttack = true;
              vaildAttackLater = null;

            }, offsetTime);
          }

          break;
        case "受伤":
          animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);

          break;
        case "normal":
          animName = GetAnimNameByPlayStateAndWeapon("停止移动", weaponData);
          break;
        case "death":
          EventHandler("中断技能", true);
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

          if (data.isPlayer) {
            baseData.speed = RUNSPEED;
            animName = GetAnimNameByPlayStateAndWeapon("移动", weaponData);
          }
          break;
        default:
          break;
      }
      // console.log(" in npc SetPlayerState  ", e, animName);

      scope.ChangeAnim(animName);
    }


    function CheckCanAttack() {

      let playerPos = targetModel.GetWorldPos();
      playerPos.y = 1;
      npcPos = scope.GetWorldPos();
      npcPos.y = 1;
      // 与目标之间有遮挡
      let b2 = CheckColliderBetween(npcPos, playerPos);
      if (b2) { return false; }
      return true;
    }
    function CheckVaildArea(){ 
      // console.log(" npc追击距离 ",playerPos.distanceTo(fireBeforePos));
      // 超出追击距离后，请求下一个目标。 没有下一个目标时，返回巡逻点
      if (playerPos.distanceTo(fireBeforePos) >= 100) { 
        CheckNextTarget(); 
        return false;
      }
      return true;
    }
    //#endregion 

    //#region 技能检测

    // 每次进入战斗，初始化其技能
    function CheckSkill() {
      for (let i = 0; i < skillList.length; i++) {
        const skillItem = skillList[i];
        // 触发方式 每间隔n秒触发。在进入战斗时调用
        if (skillItem.trigger.type == "perSecond") {
          fireLater.push({
            type: "interval", fn:
              setInterval(() => {
                if (_Global.mainUser) {
                  if (targetModel == null || targetModel.isDead) {
                    return;
                  }
                  if (inSkill) {
                    return;
                  }
                  SkillGo(skillItem);
                }
              }, (skillItem.trigger.value + skillItem.castTime) * 1000)
          }
          );
        }
      }
      CheckSkill_Health();
    }
    // 随机选中的玩家
    let randomSelectModel = null;
    //监听生命触发技能。
    // 血量触发时，每个血量只能触发一次，如果正在施放其他触发技能，则本次血量触发失效
    let healthTrigger = [];
    function CheckSkill_Health() {
      let healthPerc = parseInt(baseData.health / baseData.maxHealth * 100);
      // console.log("npc 血量 百分比 ", healthPerc);
      for (let i = 0; i < skillList.length; i++) {
        const skillItem = skillList[i];
        // 触发方式  血量达到n%触发，血量改变时调用
        if (skillItem.trigger.type == "health") {
          if (healthPerc <= skillItem.trigger.value) {
            if (_Global.mainUser) {
              // console.log(" 达到触发条件，请求触发npc技能 ",skillName);
              let has = false;
              for (let j = 0; j < healthTrigger.length && !has; j++) {
                const element = healthTrigger[j];
                if (element == skillItem.trigger.value) {
                  // console.log(" 施法重复，阻止触发npc技能 ",skillName);
                  has = true;
                }
              }
              if (has) {
                continue;
              }
              if (inSkill) {
                // console.log(" 正在施法其他技能，阻止触发npc技能 ",skillName);
                return;
              }
              // console.log(" 触发npc技能 ",skillName); 
              healthTrigger.push(skillItem.trigger.value);
              SkillGo(skillItem);
            }
          }
        }
      }
    }


    // 向玩家发送技能特效
    function shootTarget(taget, time) {
      let pos = parent.position.clone();
      pos.y += playerHeight / 2;
      _Global.DyncManager.shootTarget(pos, taget, time, "player");
    }

    function SkillGo(skillItem) {

      inSkill = true;
      let effect = skillItem.effect;
      effect.skillName = skillItem.skillName;
      skillItem.effect.skillName = skillItem.skillName;

      if (skillItem.castTime > 0) {
        // 需要施法的技能才发送技能同步，瞬发技能无需同步
        _Global.DyncManager.SendDataToServer("npc技能",
          { npcId: scope.id, skill: skillItem });
        attackStepSpeed = skillItem.castTime;
        vaildAttackDis = skillItem.vaildDis;
        //取消寻路，让npc站住施法
        SetNavPathToNone();
      }

      if (skillItem.target.type == "target") {
        // 持续伤害
        if (effect.type == "contDamage") {
          let num = 0;
          let count = parseInt(skillItem.castTime / effect.time);

          for (let k = 0; k < count; k++) {
            setTimeout(() => {
              if (baseData.health == 0) {
                inSkill = false;
                return;
              }
              // 目标攻击
              if (targetModel == null || targetModel.isDead) {
                inSkill = false;
                return;
              }
              SendDamageToTarget(targetModel, effect);
              num++;
              if (num == count) {
                inSkill = false;
              }
            }, effect.time * k * 1000);
          }
          scope.SetPlayerState("持续伤害法术", "", "", skillItem.animName, effect);
          return;
        }
        if (skillItem.castTime > 0) {
          scope.SetPlayerState("法术准备", skillItem.castTime, skillItem.animNameReady, skillItem.animName, effect);
        } else {
          scope.SetPlayerState("法术攻击", "", "", skillItem.animName, effect);
        }
      }

      // 范围攻击
      if (skillItem.target.type == "area") {
        let players = _Global.DyncManager.GetPlayerByNpcForwardInFireId(
          scope.transform, scope.fireId, vaildAttackDis, skillItem.target.value);

        // 持续伤害
        if (effect.type == "contDamage") {
          let num = 0;
          let count = parseInt(skillItem.castTime / effect.time);

          for (let k = 0; k < count; k++) {
            setTimeout(() => {
              if (baseData.health == 0) {
                inSkill = false;
                return;
              }
              for (let l = 0; l < players.length; l++) {
                if (players[l].isDead) {
                  return;
                }
                SendDamageToTarget(players[l], effect);
              }
              num++;
              if (num == count) {
                inSkill = false;
              }
            }, effect.time * k * 1000);
          }
          scope.SetPlayerState("持续伤害法术", "", "", skillItem.animName, effect);
          return;
        }

      }

      if (skillItem.target.type == "random") {
        let { player, playerId } = _Global.DyncManager.GetPlayerByRandom();
        randomSelectModel = player;
        skillItem.effect.playerId = playerId;
        if (skillItem.castTime > 0) {
          vaildAttackDis = skillItem.vaildDis;
          attackStepSpeed = skillItem.castTime;
          scope.SetPlayerState("随机法术准备", skillItem.castTime, skillItem.animNameReady, skillItem.animName, skillItem.effect);
        } else {
          scope.SetPlayerState("随机法术攻击", "", "", skillItem.animName, skillItem.effect);
        }
      }

      if (skillItem.target.type == "none") {
        if (skillItem.castTime > 0) {
          scope.SetPlayerState("无目标法术准备", skillItem.castTime, skillItem.animNameReady, skillItem.animName, effect);
        } else {
          scope.SetPlayerState("无目标法术攻击", "", "", skillItem.animName, effect);
        }
      }
    }
    // 根据技能数据计算对目标造成伤害
    function SendDamageToTarget(target, effect) {

      // 玩家镜像
      if (data.isPlayer) {
        SendDamageToTarget2(target, effect);
        return;
      }
      if (target == null) {
        return;
      }
      let { type, skillName, value, time, duration } = effect;

      // 发送战斗记录
      _Global.DyncManager.SendFireRecode({ targetId: target.id, npcId: scope.id, npcName: scope.npcName, skillName: skillName, strength: value });
      // 发送技能特效
      shootTarget(target, attackStepSpeed * 300);

      if (target != null && target.isDead) {
        CheckNextTarget();
        return;
      }
      _Global.DyncManager.SendSceneStateAll("NPC对玩家", { targetId: target.id, npcId: scope.id, npcName: scope.npcName, skillName: skillName, effect: effect });
    }
    function SendDamageToTarget2(target, effect) {
      if (target == null) {
        return;
      }

      if (target != null && target.isDead) {
        CheckNextTarget();
        return;
      }
      let { type, skillName, value, time, duration } = effect;

      // 发送战斗记录
      _Global.DyncManager.SendFireRecode({ playerId: scope.id, npcId: target.transform.id, npcName: target.npcName, skillName: skillName, strength: value });
      // 发送技能特效
      shootTarget(target, attackStepSpeed * 300);

      _Global.DyncManager.SendSceneStateAll("玩家对NPC", { playerId: scope.id, npcId: target.transform.id, npcName: target.npcName, skillName: skillName, effect: effect });
    }

    let oldSkillList = [];
    let hyperplasiaTimes = 0;
    // 施放不需要目标的技能 如 增生
    function SendSkill(effect) {
      let { type, skillName, value, time, duration, describe } = effect;
      //增生
      if (type == "hyperplasia") {
        let modelData = scope.transform.GetData();
        hyperplasiaTimes++;
        hyperplasia(modelData, 0, value, hyperplasiaTimes);
      }
      //进化
      if (type == "evolution") {
        oldSkillList = JSON.parse(JSON.stringify(skillList));

        // 所有技能伤害增加v%
        for (let i = 0; i < skillList.length; i++) {
          const skillItem = skillList[i];
          // 触发方式 每间隔n秒触发。在进入战斗时调用
          if (skillItem.target.type != "none") {
            skillItem.effect.value += skillItem.effect.value * value * 0.01;
          }
        }
      }
      // 发送战斗记录
      _Global.DyncManager.SendFireRecode({ npcId: scope.id, npcName: scope.npcName, skillName: skillName, describe: describe });

    }
    function hyperplasia(modelData, num, count, times) {
      modelData = JSON.parse(JSON.stringify(modelData));
      modelData.scale = { x: 1, y: 1, z: 1 };
      let data = modelData.message.data;
      data.name = scope.npcName + "的增生" + (num + 1);
      let pos = scope.GetWorldPos();
      modelData.pos.x = pos.x + (num + 1);
      modelData.pos.y = pos.y;
      modelData.pos.z = pos.z;
      data.isCopy = true;
      if (data.baseData.maxHealth > 200) {
        data.baseData.maxHealth = 200;
      }

      data.baseData.strength = 20;
      data.baseData.health = data.baseData.maxHealth;

      // console.log("创建增生 ", data.name);
      _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().DuplicateModel(modelData, (transform) => {

        transform.SetActive(false);
        setTimeout(() => {

          let npcComponent = transform.GetComponent("NPC");
          npcComponent.SetNpcTarget(targetModel);
          _Global.DyncManager.AddNpc(transform);
          _Global.DyncManager.NPCAddFireById(npcComponent, scope.fireId);
          transform.SetActive(true);

        }, 1000);
        num++;
        if (num == count) {
        } else {
          hyperplasia(modelData, num, count, times);
        }
      }, scope.id + "_" + times + "_" + num);
    }

    //#endregion

    //#region 设置目标 接收伤害



    this.CheckNextTarget = () => {
      CheckNextTarget();
    }
    function CheckNextTarget() {
      // console.error(" 查找下一个目标 =====", scope.fireId);
 
      if (scope.fireId == -1) {
        scope.SetNpcTargetToNone();
        return;
      }
      // 向主控请求下一个目标
      // 获取战斗组中的其他玩家作为目标。 没有时，npc结束战斗
      _Global.DyncManager.RequestNextFireIdPlayer(
        { npcId:  scope.id, camp: baseData.camp, fireId: scope.fireId
        ,ignorePlayerId:targetModel?targetModel.id:null }
      );
    }


    let ownerPlayer = null;
    this.setOwnerPlayer = function (_ownerPlayer) {
      ownerPlayer = _ownerPlayer;
      oldPlayerPos.y = -100;
      scope.FollowPlayer();
    }
    // 玩家生成的镜像或宠物，在玩家移动后，跟随玩家
    this.FollowPlayer = function () {
      if (baseData.state == stateType.Fire) {
        return;
      }
      if (data.isPlayer) {
        let pos = ownerPlayer.GetWorldPos().clone();

        if (oldPlayerPos.distanceTo(pos) < 0.5) {
          setTimeout(() => {
            this.FollowPlayer();
          }, 1000);
          return;
        }
        oldPlayerPos = pos.clone();
        fireBeforePos = pos.clone();

        fireBeforePos.x += radomNum(-2, 2);
        fireBeforePos.z += radomNum(-2, 2);
        setTimeout(() => {
          this.FollowPlayer();
        }, 500);
      }
      let currentPos = scope.GetWorldPos();
      // if (currentPos.distanceTo(fireBeforePos) >= 20) {
      // }
      baseData.speed = 8 + currentPos.distanceTo(fireBeforePos) / 3;

      GetNavpath(parent.position.clone(), fireBeforePos);
    }
    this.GetWorldPos = function () {
      return scope.transform.GetWorldPos();
    }
    this.GetPlayerWorldPos = function () {
      let pos =scope.transform.GetWorldPos();
      pos.y += playerHeight/2;
      return pos;
    }

    let fireBeforePos = null;
    this.SetNpcTargetToNone = function (isLocal) {
      targetModel = null;
      if (targetModel == null) {

        ClearFireLater();
        // 暂停1秒
        SetNavPathToNone();
        EventHandler("中断技能");
        if (data.isPlayer) {
          baseData.state = stateType.Normal;
        } else {
          // 只有敌方NPC失去目标时，才会进入返回状态
          baseData.state = stateType.Back;

          baseData.health = baseData.maxHealth;
        }

        scope.SetPlayerState("normal");
        ClearLater("清除巡逻");

        UpdateData();

        if (isLocal) {
          _Global.DyncManager.SendModelState(scope.transform.GetData().id, { modelType: scope.transform.GetData().modelType, msg: { title: "设置目标", playerId: "", } });
        }

        laterNav = setTimeout(() => {

          if (data.isPlayer) {
            oldPlayerPos.y = -100;
            scope.FollowPlayer();
            return;
          }
          let currentPos = scope.GetWorldPos();
          if (currentPos.distanceTo(fireBeforePos) >= 20) {
            baseData.speed = MISSSPEED;
          }
          GetNavpath(parent.position.clone(), fireBeforePos);
        }, 1000);


        return;
      }

    }

    // 设置NPC的战斗目标
    this.SetNpcTarget = function (_targetModel, isLocal, checkNear) {
      if (_targetModel == null) {
        this.SetNpcTargetToNone(isLocal, checkNear);
        return;
      }
      // console.log(" npc进入战斗 00 ", baseData.state == stateType.Back);
      if (scope.fireId == -1 && baseData.state == stateType.Back || scope.isDead) {
        return;
      }


      if (targetModel == null) {
        targetModel = _targetModel;
        //加入战斗
        if (isLocal && checkNear) { 
          _Global.DyncManager.NPCAddFire(scope, targetModel);
        }

        // 停止寻路
        SetNavPathToNone();
      }

      if (targetModel == null) {
        return;
      }

      // console.log(" 设置目标 00 ", data.isPlayer, targetModel, baseData.state);


      if (laterNav != null) {
        clearTimeout(laterNav);
        laterNav = null;
      }

      let npcPos = parent.position.clone();
      readyAttack = false;

      let playerPosRef = targetModel.GetWorldPos().clone();
      playerPosRef.y = npcPos.y;
      parent.lookAt(playerPosRef);

      baseData.speed = RUNSPEED;
      if (isLocal) {
        _Global.DyncManager.SendModelState(
          scope.transform.GetData().id,
          {
            modelType: scope.transform.GetData().modelType,
            msg: {
              title: "设置目标",
              playerId: targetModel.id,
              fireId: scope.fireId,
              health: baseData.health,
              maxHealth: baseData.maxHealth
            }
          });
        if (checkNear) {
          _Global.DyncManager.SetNearNPCTarget(scope, targetModel);
        }
      }

      if (baseData.state == stateType.Normal) {
        baseData.state = stateType.Fire;
        //首次进入战斗时，计算其技能
        CheckSkill();
        // console.log(" 首次进入战斗时，计算其技能 00 ", baseData.state);

      }
      scope.SetPlayerState("准备战斗");

      // console.log( this.npcName +" npc进入战斗  ", scope.fireId);
    }
    function removeDebuffById(id) {
      for (let i = baseData.debuffList.length - 1; i >= 0; i--) {
        const item = baseData.debuffList[i];
        if (item.id == id) {
          baseData.debuffList.splice(i, 1);
        }
      }
      UpdateData();
    }
    function CheckHealth() {
      if (baseData.health <= 0) {
        baseData.health = 0;
        baseData.debuffList = undefined;
      }
      UpdateData();
    }
    function RealyDamage(strength) {
      let tip = "";
      tip = strength;
      // 伤害显示在屏幕上
      // let pos = scope.GetWorldPos().clone();
      // pos.y += playerHeight; 
      // _Global.SceneManager.UpdateNpcDamageValue("self", "normal", tip, pos);
      return strength;
      let v = 0;
      if (baseData.armor >= strength) {
        baseData.armor -= strength;
        return 0;
      } else {
        // 至少会受到1点伤害
        v = strength - baseData.armor;
        baseData.armor = 0;
        v = v > 0 ? v : 1;
      }
      return v;
    }
    // 接收的伤害统计
    let receiveDamageData = [];
    let maxDamagePlayerId = 0;
    function CheckMaxDamage(playerId, value) {
      let has = false;
      for (let i = 0; i < receiveDamageData.length && !has; i++) {
        const element = receiveDamageData[i];
        if (element.playerId == playerId) {
          element.damageValue += value;
          has = true;
        }
      }
      if (!has) {
        receiveDamageData.push({ playerId: playerId, damageValue: value });
      }
      let v = 0;
      let plid = 0;
      for (let i = 0; i < receiveDamageData.length; i++) {
        const element = receiveDamageData[i];
        if (v <= element.damageValue) {
          v = element.damageValue;
          plid = element.playerId;
        }
      }
      maxDamagePlayerId = plid;
    }
    this.ReceiveDamage = function (_targetModelId, skillName, effect) {
      //_targetModel 是 YJPlayer
      if (baseData.health == 0) {
        scope.isDead = true;
        return;
      }
      let { type, value, time, duration, describe, icon } = effect;

      value = RealyDamage(value);

      // 计算伤害最高的玩家id
      CheckMaxDamage(_targetModelId, value);
      if (targetModel == null) {
        this.SetNpcTarget(_Global.DyncManager.GetPlayerById(_targetModelId), true, true);
      } else {
      }
      // console.log("收到来自 的伤害 ", _targetModelId, _Global.DyncManager.GetPlayerById(_targetModelId));

      //在移动中受到攻击，判断下一个目标
      if (maxDamagePlayerId != 0 && isMoving) {
        if (maxDamagePlayerId != targetModel.id) {
          targetModel = _Global.DyncManager.GetPlayerById(maxDamagePlayerId);
        }
      }

      // console.log(" npc接收伤害 ", effect);
      // 直接伤害 或 持续伤害
      if (type == "damage" || type == "contDamage") {
        baseData.health -= (value);

      }
      // 每n秒伤害，持续m秒
      if (type == "perDamage") {

        //每秒伤技能是debuff，显示在角色状态上
        if (baseData.debuffList == undefined) {
          baseData.debuffList = [];
        }
        let id = new Date().getTime();
        let count = parseInt(duration / time);
        let num = 0;
        for (let i = 0; i < count; i++) {
          fireLater.push({
            type: "timeout", fn:
              setTimeout(() => {
                baseData.health -= (value);
                num++;
                if (num == count) {
                  removeDebuffById(id);
                }
                CheckHealth();
              }, time * 1000 * i)
          }
          );
        }
        baseData.debuffList.push({ id: id, icon: _this.$uploadUVAnimUrl + icon, describe: describe });
        return;
      }
      CheckHealth();

      // console.log(this.npcName + " 受到 " + targetModel.GetPlayerName() + " 使用 " + skillName + " 攻击 剩余 " + baseData.health);

      ClearLater("清除准备战斗");

      if(targetModel == null){
        return;
      }
      _Global.DyncManager.SendModelState(scope.transform.GetData().id,
        {
          modelType: scope.transform.GetData().modelType,
          msg: {
            playerId: scope.isDead ? '' : targetModel.id, health: baseData.health,
            maxHealth: baseData.maxHealth
          }
        });


    }

    this.ReceiveDamageByPlayer = function (_targetModel, skillName, effect) {
      //_targetModel 是 YJPlayer
      if (baseData.health == 0) {
        scope.isDead = true;
        return;
      }
      let { type, value, time, duration, describe, icon } = effect;

      value = RealyDamage(value);

      if (targetModel == null) {
        this.SetNpcTarget(_targetModel, true, false);
      } else {

      }
      // console.log("收到来自 的伤害 ", _targetModelId, _Global.DyncManager.GetPlayerById(_targetModelId));


      // console.log(" npc接收伤害 ", effect);
      // 直接伤害 或 持续伤害
      if (type == "damage" || type == "contDamage") {
        baseData.health -= (value);

      }
      // 每n秒伤害，持续m秒
      if (type == "perDamage") {

        //每秒伤技能是debuff，显示在角色状态上
        if (baseData.debuffList == undefined) {
          baseData.debuffList = [];
        }
        let id = new Date().getTime();
        let count = parseInt(duration / time);
        let num = 0;
        for (let i = 0; i < count; i++) {
          fireLater.push({
            type: "timeout", fn:
              setTimeout(() => {
                baseData.health -= (value);
                num++;
                if (num == count) {
                  removeDebuffById(id);
                }
                CheckHealth();
              }, time * 1000 * i)
          }
          );
        }
        baseData.debuffList.push({ id: id, icon: _this.$uploadUVAnimUrl + icon, describe: describe });
        return;
      }
      CheckHealth();

      // console.log(this.npcName + " 受到 " + targetModel.GetPlayerName() + " 使用 " + skillName + " 攻击 剩余 " + baseData.health);

      ClearLater("清除准备战斗");

      _Global.DyncManager.SendModelState(scope.transform.GetData().id,
        {
          modelType: scope.transform.GetData().modelType,
          msg: {
            playerId: scope.isDead ? '' : targetModel.id, health: baseData.health,
            maxHealth: baseData.maxHealth
          }
        });


    }

    // 死亡或离开战斗时，清除延迟执行事件
    function ClearFireLater() {
      for (let i = 0; i < fireLater.length; i++) {
        if (fireLater[i].type == "interval") {
          clearInterval(fireLater[i].fn);
        }
        if (fireLater[i].type == "timeout") {
          clearTimeout(fireLater[i].fn);
        }
      }
      baseData.debuffList = undefined;
      receiveDamageData = [];
      fireLater = [];
      healthTrigger = [];
      if (oldSkillList.length != 0) {
        skillList = JSON.parse(JSON.stringify(oldSkillList));
      }
    }

    //#endregion

    //#region 
    //#endregion

    //#region 接收同步
    // 接收同步
    this.Dync = function (msg) {
      // console.log("接收npc同步数据 ", msg);
      if (msg.title == "脱离战斗") {
        console.log(" npc 脱离战斗 ");
        scope.SetNpcTargetToNone();
        return;
      }
      if (msg.title == "重新生成") {
        resetLife();
        return;
      }

      if (msg.title == "npc技能") {
        //取消寻路，让npc站住施法
        SetNavPathToNone();
        let skillItem = msg.skill;
        if (skillItem == "中断") {
          inSkill = false;
          return;
        }
        inSkill = true;
        return;
      }
      if (msg.title == "npc技能攻击") {
        let effect = msg.skill;
        //增生
        if (effect.type == "hyperplasia") {
          let { value, times } = effect;
          hyperplasiaTimes = times;
          let modelData = scope.transform.GetData();
          hyperplasia(modelData, 0, value, times);
        }
        //进化
        if (effect.type == "evolution") {
          let { value } = effect;

          oldSkillList = JSON.parse(JSON.stringify(skillList));
          // 所有技能伤害增加v%
          for (let i = 0; i < skillList.length; i++) {
            const skillItem = skillList[i];
            // 触发方式 每间隔n秒触发。在进入战斗时调用
            if (skillItem.target.type != "none") {
              skillItem.effect.value += skillItem.effect.value * value * 0.01;
            }
          }
        }
        inSkill = true;
        return;
      }


      if (msg.title == "设置目标") {
        if (msg.fireId) {
          scope.fireId = msg.fireId;
        }
        if (msg.playerId) {
          if (targetModel == null) {
            baseData.state = stateType.Fire;
            this.SetNpcTarget(_Global.DyncManager.GetPlayerById(msg.playerId));
          }
        } else {
          baseData.state = stateType.Normal;
          scope.fireId = -1;
          this.SetNpcTargetToNone();
        }

        return;
      }
      if (msg.title == "设置动作") {
        scope.ChangeAnim(msg.animName);
        return;
      }

      if (msg.health != undefined) {
        if (msg.health == 0) {
          if (baseData.health == baseData.maxHealth) {
            baseData.health = msg.health;
            // 模型渐隐消失
            // scope.transform.Destroy();
            targetModel = null;
            scope.transform.SetActive(false);
            return;
          }
        }
        baseData.health = msg.health;
        if (baseData.health == 0) {
          scope.isDead = true;
          activeFalse();
        }
        UpdateData();
      }

    }
    //#endregion


    //#region 死亡 重生 和刷新数据
    function UpdateData() {
      scope.transform.UpdateData(); // 触发更新数据的回调事件
      if (baseData.health == 0) {
        ClearLater("清除巡逻");
        dead();
      }
    }
    // 死亡
    function dead() {
      if (targetModel != null) {
        targetModel = null;
      }
      scope.isDead = true;

      // 设为死亡状态
      baseData.state = stateType.Dead;
      // 从一场战斗中移除npc
      _Global.DyncManager.RemoveNPCFireId(scope);
      // 清除技能触发
      ClearFireLater();
      // 停止寻路
      SetNavPathToNone();
      scope.SetPlayerState("death");
      activeFalse();
    }
    function activeFalse() {
      setTimeout(() => {
        CreateNameTrans("");
        _Global.SceneManager.ReceiveEvent("npc尸体消失", scope.transform);
        // 执行溶解特效
        new YJshader_dissolve(scope.transform.GetGroup());
      }, 5000);
      setTimeout(() => {
        // 模型渐隐消失
        scope.transform.SetActive(false);

        if (data.isPlayer) {
          _Global.DyncManager.SendSceneState("删除", { type: "玩家镜像", npcId: scope.id, playerId: data.ownerId });
        }
        // scope.transform.Destroy();
        //一分钟后重新刷新。告诉主控
        // setTimeout(() => {
        //   resetLife();
        // }, 60000);
      }, 7000);
    }
    // 死亡后重新生成
    function resetLife() {
      targetModel = null;
      scope.isDead = false;
      scope.transform.SetActive(true);
      CreateNameTrans(scope.npcName);
      // 还原材质
      materials.forEach(item => {
        item.mesh.material = item.mat;
      });
      // materials = [];
      // 还原血量、还原状态
      baseData.health = baseData.maxHealth;
      baseData.state = stateType.Normal;
      scope.ChangeAnim("none");
      scope.SetPlayerState("normal");
      scope.RadomNavPos();
      ClearFireLater();
    }
    //#endregion


    //#region  战斗检测
    let playerPos = null;
    function CheckState() {
      if (baseData.state == stateType.Normal) {
      }

      if (baseData.state == stateType.Fire) {
        // console.log(' 在战斗中 ', targetModel, targetModel.isDead);

        if (targetModel == null) {
          scope.SetPlayerState("准备战斗");
          return;
        }
        if (inSkill) {
          return;
        }
        if (targetModel != null && targetModel.isDead) {
          CheckNextTarget();
          return;
        }
        // 逻辑见note/npc策划.md 战斗策略
        playerPos = targetModel.GetWorldPos();
        let npcPos = parent.position.clone();
        let playerPosRef = playerPos.clone();
        playerPosRef.y = npcPos.y;

        let dis = playerPosRef.distanceTo(npcPos);
        if (dis < vaildAttackDis + scope.transform.GetData().scale.x && CheckCanAttack()) {
          SetNavPathToNone();
          parent.lookAt(playerPosRef.clone());
          if (readyAttack_doonce == 0) {
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
              //有效攻击 && 
              var { s, v, a } = GetSkillDataByWeapon(weaponData);
              SendDamageToTarget(targetModel, { skillName: s, type: "damage", value: baseData.strength });


              //攻击结束之后，判断下一个目标
              if (maxDamagePlayerId != 0) {
                // console.log(" 设置下一个目标 ", maxDamagePlayerId, targetModel.id);
                if (maxDamagePlayerId != targetModel.id) {
                  targetModel = _Global.DyncManager.GetPlayerById(maxDamagePlayerId);
                }
              }


            }, attackStepSpeed * 100);

            toIdelLater = setTimeout(() => {
              scope.SetPlayerState("准备战斗");
              toIdelLater = null;
            }, attackStepSpeed * 400);//间隔等于攻击动作时长

          }

          getnavpathTimes = 0;
        } else {

          EventHandler("中断技能");
          if(!CheckVaildArea()){
            return;
          }
          getnavPathTime++;
          if (getnavPathTime > 20) {
            //跑向目标 
            GetNavpath(npcPos, playerPos);
            getnavPathTime = 0;
          }
          readyAttack_doonce = 0;
        }
        // console.log( scope.npcName + " in fire " + dis);
      }
    }

    //#endregion

    this._update = function () {
      nameTransLookatCamera();
      if (_Global.mainUser) {
        CheckState();
        tick(clock.getDelta());


        // 主控实时发送坐标来同步。
        let oldTransData = scope.transform.CheckSamePos();
        if (oldTransData == null) {
          return;
        }
        _Global.DyncManager.UpdateModel(scope.id, "pos",
          oldTransData);
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

        if (baseData.state == stateType.Normal) {
          scope.SetPlayerState("巡逻");
        } else if (baseData.state == stateType.Back) {
          scope.SetPlayerState("丢失目标");
        } else {
          scope.SetPlayerState("跑向目标");
        }
        // console.log(" npc往目标移动 ", velocity.lengthSq(), 0.00075 * baseData.speed);
        isMoving = true;


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
    //清除延时
    function ClearLater(e) {
      if (e == "清除巡逻") {
        // console.log("清除巡逻 66 ");
        if (laterNav != null) {
          clearTimeout(laterNav);
          laterNav = null;
        }
      }
      if (e == "清除准备战斗") {
        // console.log(" 清除准备战斗 ");
        // if (toIdelLater != null) {
        //   clearTimeout(toIdelLater);
        //   toIdelLater = null;
        // }
      }
    }
    let laterNav = null;
    function ChangeEvent(e) {
      if (e == "准备巡逻") {
        scope.SetPlayerState("normal");
        ClearLater("清除巡逻");
        
        laterNav = setTimeout(() => {
          //在正常模式到达目标点，表示在巡逻过程中。再次到下一个巡逻点
          //随机执行其他idle动作、随机等待时长，让npc行为更自然
          scope.RadomNavPos();
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

    Init();

  }
}

export { YJNPC };