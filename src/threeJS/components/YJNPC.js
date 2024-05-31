import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJPlayerNameTrans } from "../YJPlayerNameTrans";
import { YJEquip } from "./YJEquip";
import { YJSkill } from "./YJSkill";

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
    this.canMove = true;
    this.isYJNPC = true;
    this.deadedHidden = true;
    this.canLevelUp = false;
    this.inControl = false; //是否被控制
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

    // 初始常量
    const CONST_BASEDATA = {
      level: 1, //等级
      health: 100, //生命值
      maxHealth: 100, //生命值
      strength: 20, //攻击力
      armor: 0,
    }
    let baseData = {
      state: 'normal', //状态
      camp: 1001, //阵营
      speed: 8, //移动速度
      level: 1, //等级
      health: 100, //生命值
      maxHealth: 100, //生命值
      strength: 20, //攻击力
      armor: 0,
      fireId: -1, //战斗组id  -1表示未在战斗中
    }

    let _YJPlayerNameTrans = null;
    let _YJEquip = null;
    let _YJSkill = null;
    //#region  固定
    function Init() {
      group = new THREE.Group();
      parent.add(group);

      // fromGroup = new THREE.Group();
      // parent.add(fromGroup);
      // fromGroup.rotation.set(Math.PI/2,0,0);
      playerPosition = parent.position;
      oldMovePos = playerPosition.clone();
      group.rotation.y += Math.PI;

      _YJEquip = new YJEquip(scope);
      _YJSkill = new YJSkill(scope);
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
      // CreateNameTrans(this.npcName);
      // console.log(" 重置昵称 ",v);

      scope.applyEvent("重置昵称", this.npcName);

    }
    this.ResetName = function () {
      this.npcName = data.name;
      scope.applyEvent("重置昵称", this.npcName);
    }
    //创建姓名条参考物体
    let namePosTrans = null;
    function CreateNameTrans(content) {
      // console.log(" 设置姓名条 ",content);
      _Global._YJPlayerNameManager.CreateNameTrans(
        scope, scope.id, content, playerHeight, parent.scale.x, nameScale, _Global.user.camp != baseData.camp ? '#ee0000' : '#ffffff'
      );
      return;
      if (namePosTrans == null) {
        namePosTrans = new THREE.Group();
        namePosTrans.name = "npcname";
        group.add(namePosTrans);
        _YJPlayerNameTrans = new YJPlayerNameTrans(namePosTrans);
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


    //#region 音视频通话 小图标窗口

    //创建用户头像
    this.CreateHeader = function (faceUrl) {
      //  _YJPlayerNameTrans.CreateHeader(faceUrl);
      // _Global._YJPlayerNameManager.CreateHeaderById(scope.id,faceUrl );
      scope.applyEvent("创建头像", faceUrl);
    }
    //创建用户血条
    this.CreateHealth = function () {
      // _YJPlayerNameTrans.CreateHealth(_Global.user.camp == this.GetCamp() ? 0x00ff00 : 0xff0000);
      // _Global._YJPlayerNameManager.CreateHealthById(scope.id,_Global.user.camp == this.GetCamp() ? 0x00ff00 : 0xff0000);
      scope.applyEvent("创建血条", _Global.user.camp == this.GetCamp() ? 0x00ff00 : 0xff0000);

    }


    //#endregion

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


    this.recodeMat = function () {
      recodeMat();
    }
    // 记录模型材质
    function recodeMat() {
      scope.transform.GetGroup().traverse(function (item) {
        if (item instanceof THREE.Mesh) {
          if (item.name.includes("collider") || item.name.includes("nameBar") || item.name.includes("health")) {
          } else {
            materials.push({ mesh: item, mat: item.material });
          }
        }
      });
    }
    this.SetActive = function (b) {
      if (b) {

      } else {
        Clear();
        scope.applyEvent("npc尸体消失");
      }
    }
    //销毁组件
    this.Destroy = function () {
      Clear();
      scope.applyEvent("Destroy");
    }
    function Clear() {
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
      if (laterNav) {
        clearTimeout(laterNav);
      }
      scope.applyEvent("脱离战斗或死亡");

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
    this.ChangeAnim = function (v, b) {
      if (oldAnimName != v) {
        if (_Global.mainUser) {
          //发送动作同步
          SendModelState({ title: "设置动作", animName: v, animNameFullback: b });
        }
      } else {
        return;
      }
      if (scope.isDead && v != "death") {
        v = "death";
      }
      _YJAnimator.ChangeAnim(v, b ? b : v);
      oldAnimName = v;

      _YJEquip.ChangeAnim(v);
      // if (scope.npcName.includes("一叶")) {
      //   console.error(scope.GetNickName() + " 切换动作 ", v);
      // } 
    }


    this.ChangeAnimDirect = function (animName) {
      _YJAnimator.ChangeAnimDirect(animName);
    }


    // 不在战斗且未死亡，且不在miss中，才可以设置
    this.isCanSetTarget = function () {
      return baseData.state != stateType.Back && baseData.state != stateType.Fire && baseData.state != stateType.Dead;
    }
    this.GetState = function () {
      return baseData.state;
    }
    this.GetCamp = function () {
      return baseData.camp;
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
        if (data.inAreaRandom) {
          let startPos = parent.position.clone();
          let targetPos = fireBeforePos.clone();
          // if (data.areaRadius == undefined) {
          //   data.areaRadius = 1;
          // }
          // targetPos.x += radomNum(-data.areaRadius, data.areaRadius);
          // targetPos.z += radomNum(-data.areaRadius, data.areaRadius);
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
            GetNavpath(parent.position.clone(), movePos[navPosIndex]);
            _Global.DyncManager.UpdateModel(scope.id, "navPosIndex",
              { navPosIndex: navPosIndex });
          }
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

    let getnavPathTime = 20;
    let getnavpathTimes = 0;
    this.SetNavPathToNone = function () {
      SetNavPathToNone();
    }
    // 清空寻路路径
    function SetNavPathToNone() {
      // console.log(" 清空寻路路径 ");
      navpath = [];
      doonce = 0;
      isMoving = false;
      oldTargetPos = null;
    }
    let randomRedius = 5;
    let oldTargetPos = null;
    this.MoveToTargetFast = function(){
      scope.canMove = true;
      baseData.speed *= 5;
      lookAtTargetPos();
      navpath = [ targetModel.GetWorldPos()];
      // GetNavpath(parent.position.clone(),  targetModel.GetWorldPos(),0);
    }
    // 获取寻路路径
    function GetNavpath(fromPos, targetPos,_randomRedius) {
      if (!scope.canMove) { return; }
      if (oldTargetPos && targetPos.distanceTo(oldTargetPos) < 0.1) {
        // console.log(" 目标点不变 ",oldTargetPos,targetPos);
        return;
      } else {
      }
      // if(scope.npcName.includes("阳光万里") ){
      //   console.error(GetNickName() + ' 寻路 ',targetPos);
      // }

      oldTargetPos = targetPos.clone();
      if(_randomRedius != undefined){
        randomRedius = _randomRedius;
      }else{
        randomRedius = vaildAttackDis;
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
    this.GetSkillList = function () {
      return skillList;
    }
    let modelScale = 1; 
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      scope.id = scope.transform.id;
      // console.log( scope.GetNickName() + "in NPC msg = ", scope.id, data);


      this.npcName = data.name;
      baseData = data.baseData;

      if (baseData.camp == "bl") {
        baseData.camp = 1001;
      }
      if (!baseData.armor) {
        baseData.armor = 0;
      }

      CONST_BASEDATA.armor = baseData.armor;
      CONST_BASEDATA.maxHealth = baseData.maxHealth;
      CONST_BASEDATA.strength = baseData.strength;
      CONST_BASEDATA.level = baseData.level;

      modelScale = data.avatarData.modelScale;
      nameScale = data.avatarData.nameScale;
      playerHeight = data.avatarData.height;
      CreateNameTrans(this.npcName);
      scope.CreateHealth();
      scope.transform.isIgnoreRaycast = true;
      // 第一次加载时，把数据加入到全局角色数据中
      _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data.avatarData);

      _YJAnimator.SetAnimationsData(data.avatarData.animationsData);

      _YJAnimator.addEventListener("动作结束", () => {
        if (_YJSkill.GetinSkill()) {
          scope.applyEvent("施放结束或中断");

          GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
          scope.ChangeAnim(animName, animNameFullback);
          // if (scope.npcName.includes("一叶")) {
          //   console.error(scope.GetNickName() +animName + " 到达动作循环点 ");
          // } 
        }
      });

      if (data.skillList == undefined) {
        data.skillList = [];
      }
      skillList = data.skillList;
      _YJSkill.SetSkill(skillList, baseData);
      // console.log(scope.GetNickName() + " 技能 ", skillList);
      if (data.canMove != undefined) {
        scope.canMove = data.canMove;
      }
      if (data.inAreaRandom) {
        
      } else {
        if (data.movePos && data.movePos.length > 1) {
          this.UpdateNavPos("停止巡逻", data.movePos);
        }
      }

      if (data.weaponData && data.weaponData.message) {
        weaponData = data.weaponData.message.data;
        var { s, v, a, _ready } = GetSkillDataByWeapon(weaponData);
        setVaildAttackDis(v);
      }

      _YJEquip.SetMessage(data);
      if (weaponData == null) {
        scope.SetPlayerState("normal");
        this.PathfindingCompleted();
        // 记录材质
        if (materials.length == 0) {
          recodeMat();
        }
      }
      fireBeforePos = scope.GetWorldPos(); 
      // console.log( scope.GetNickName() + " fireBeforePos  11 = ",fireBeforePos);

      if (data.isCopy) {
        skillList = [];
        ClearFireLater();
      }
    }

    this.ChangeEquip = function (type, data) {
      _YJEquip.ChangeEquip(type, data);
    }
    //#endregion 

    this.GetBoneVagueFire = function (part, callback) {
      let boneName = "";
      if (data.avatarData.boneList) {
        for (let i = 0; i < data.avatarData.boneList.length; i++) {
          const element = data.avatarData.boneList[i];
          if (element.targetBone == part) {
            boneName = element.boneName;
          }
        }
      }
      if (boneName == "") {
        boneName = part;
      }
      // console.log("查找 ",part,boneName);
      scope.GetBoneVague(boneName, (bone) => {
        // bone.add(new THREE.AxesHelper(100));
        if (callback) {
          callback(bone.getWorldPosition(new THREE.Vector3()));
        }
      });

    }

    this.GetShootingStartPos = function () {
      let pos = scope.GetPlayerWorldPos();
      let weaponModel = _YJEquip.getWeaponModel();
      if (weaponModel) {
        var { _fire } = GetSkillDataByWeapon(weaponData);
        if (_fire.pos && _fire.pos.length == 3) {
          pos = weaponModel.getWorldPosition(new THREE.Vector3());
          pos.x += _fire.pos[0];
          pos.y += _fire.pos[1];
          pos.z += _fire.pos[2];
          // let axse = new THREE.AxesHelper(10);
          // weaponModel.add(axse);
          // axse.position.set(_fire.pos[0], _fire.pos[1], _fire.pos[2]);
        }
      }
      return pos;
    }


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
            if (_YJSkill.GetinSkill()) {
              _Global.DyncManager.SendDataToServer("npc技能",
                { npcId: scope.id, skill: "中断" });

              scope.applyEvent("施放结束或中断");

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
    this.GetVaildAttackDis = function () {
      return vaildAttackDis + scope.transform.GetData().scale.x;
    }
    this.SetVaildAttackDis = function(v){
      setVaildAttackDis(v);
    }
    function setVaildAttackDis(v) {
      vaildAttackDis = v;//* modelScale;
    }

    let readyAttack = false;
    let readyAttack_doonce = 0;


    let animNameFullback = "";
    function GetAnimNameByPlayStateAndWeapon(e, weaponData) {
      let an = _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon(e, weaponData);
      animName = an.animName;
      animNameFullback = an.animNameFullback;
      // console.log({animName,animNameFullback});
    }
    function GetSkillDataByWeapon(weaponData) {
      return _Global.CreateOrLoadPlayerAnimData().GetSkillDataByWeapon(weaponData);
    }


    let oldState = "";
    let inStateTimes = 0;



    function CheckCanAttack() {
      if (targetModel == null) {
        return false;
      }
      let targetPos = targetModel.GetWorldPos();
      targetPos.y = 1;
      npcPos = scope.GetWorldPos();
      npcPos.y = 1;
      // 与目标之间有遮挡
      let b2 = CheckColliderBetween(npcPos, targetPos);
      if (b2) { return false; }
      return true;
    }
    function CheckVaildArea() {
      // console.log(" npc追击距离 ",targetPos.distanceTo(fireBeforePos));
      // 超出追击距离后，请求下一个目标。 没有下一个目标时，返回巡逻点
      if (targetPos.distanceTo(fireBeforePos) >= 100) {
        return false;
      }
      return true;
    }
    //#endregion 

    //#region 设置目标 接收伤害

    let laterCheckNextTarget = null;
    this.CheckNextTarget = () => {
      if (laterCheckNextTarget != null) {
        clearTimeout(laterCheckNextTarget);
        laterCheckNextTarget = null;
      }
      // if (scope.npcName.includes("ZH画渣")) {
      //   console.error(scope.GetNickName() + " 查找目标 ");
      // }
      laterCheckNextTarget = setTimeout(() => {
        CheckNextTarget();
      }, 500);
    }


    this.TargetDead = function () {

    }
    function TargetDead() {
      TargetNone();
      // targetModel = null;
      // return;
      // console.log(GetNickName() + " 的目标已死亡");
      CheckNextTarget();
    }
    function TargetNone() {
      inRequestNext = false;
      scope.applyEvent("施放结束或中断");

      oldTargetPos = null;
      oldState = "";
      readyAttack_doonce = 0;
    }
    function CheckNextTarget() {
      if (!_Global.mainUser) {
        console.error("不该进入CheckNextTarget：非主控");
        return;
      }
      if (scope.isDead) {
        return;
      }
      if (scope.fireId == -1) {
        scope.SetNpcTargetToNone();
        scope.fireOff();
        return;
      }
      if (_YJSkill.GetinSkill()) {
        return;
      }
      if (targetModel != null && targetModel.isDead) {
        scope.SetNpcTargetToNoneDrict();
      } else {
        if (!scope.canMove) {
          if (targetModel == null || targetModel.isDead) {

          } else {
            if (outVaildArea) {

            } else {
              return;
            }
          }
        } else {
          if (targetModel != null) {
            if (targetModel.isDead) {
              scope.SetNpcTargetToNoneDrict();
            } else {
              return;
            }
          }
        }

      }


      // 向主控请求下一个目标
      // if ( scope.npcName.includes("我回来哩") ) {
      //   console.error(scope.GetNickName() + "向主控请求下一个目标");
      // }
      _Global.DyncManager.NPCTargetToNone({
        npcId: scope.id, camp: baseData.camp, fireId: scope.fireId
        , ignorePlayerId: targetModel ? targetModel.id : null,
        vaildDis: vaildAttackDis
      });

      // 获取战斗组中的其他玩家作为目标。 没有时，npc结束战斗
      // _Global.DyncManager.RequestNextFireIdPlayer(
      //   {
      //     npcId: scope.id, camp: baseData.camp, fireId: scope.fireId
      //     , ignorePlayerId: targetModel ? targetModel.id : null,
      //     vaildDis: vaildAttackDis
      //   }
      // );
    }


    let ownerPlayer = null;
    this.setOwnerPlayer = function (_ownerPlayer) {
      ownerPlayer = _ownerPlayer;
      oldPlayerPos.y = -100;
      scope.FollowPlayer();
    }
    this.GetIsPlayer = function () {
      return data.isPlayer;
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
      let pos = scope.transform.GetWorldPos();
      pos.y += playerHeight / 2 * modelScale;
      return pos;
    }

    // 设置不在战斗状态
    this.SetFireOff = function () {

      baseData.health = baseData.maxHealth;
    }
    let fireBeforePos = null;
    this.fireOff = function () {
      if (scope.isDead) {
        return;
      }
      scope.fireId = -1;
      targetModel = null;
      TargetNone();

      if (data.isPlayer) {
        baseData.state = stateType.Normal;
      } else {
        // 只有敌方NPC失去目标时，才会进入返回状态
        baseData.state = stateType.Back;
      }
      if (!this.canMove) {
        baseData.state = stateType.Normal;
      }
      EventHandler("中断技能");
      scope.SetPlayerState("normal");
      // 清除技能触发
      ClearFireLater();
      if (!scope.canMove) {
        return;
      }
      if (laterNav != null) {
        clearTimeout(laterNav);
        laterNav = null;
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
        // console.log(scope.GetNickName() + " fireBeforePos  22 = ",fireBeforePos);
        vaildAttackDis = 0;
        GetNavpath(parent.position.clone(), fireBeforePos);
      }, 1000);

    }

    this.SetNpcTargetToNoneDrict = function () {
      targetModel = null;
      outVaildArea = false;
    }
    this.SetNpcTargetToNone = function (isLocal) {

      targetModel = null;
      outVaildArea = false;
      // 暂停1秒
      SetNavPathToNone();
      EventHandler("中断技能");


      GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
      scope.ChangeAnim(animName, animNameFullback);

      ClearLater("清除巡逻");

      if (isLocal) {
        SendModelState({ title: "设置目标", playerId: "", });
      }

    }


    this.LogFire = function () {
      console.log("fireid = ", scope.fireId);
      console.log("inskill = ", _YJSkill.GetinSkill());
      console.log("targetmodel = ", targetModel);
      console.log("canmove = ", scope.canMove);
      console.log("inControl = ", scope.inControl);
      if (targetModel) {
        console.log("targetModel.isDead = ", targetModel.isDead);
        // console.log(GetNickName() + ' 距离目标 ',dis,vaildAttackDis + scope.transform.GetData().scale.x);
      }
      console.log("navpath.length = ", navpath.length);
      // console.log(" npc追击距离 ",playerPosition.distanceTo(fireBeforePos));
      console.log(" state ", baseData.state);
      console.log(" 目标距离 ", targetPos.distanceTo(scope.GetWorldPos()));
      if (oldTargetPos) {
        console.log(" 上个距离目标 ", targetPos.distanceTo(oldTargetPos));
      }
      console.log(" 是否在有效距离 ", CheckVaildArea());
      console.log(" 是否可以攻击（与目标之间有遮挡则不能攻击） ", CheckCanAttack());
      console.log(" readyAttack_doonce ", readyAttack_doonce);
      console.log(" readyAttack ", readyAttack);

    }
    // 设置NPC的战斗目标
    this.SetNpcTarget = function (_targetModel, isLocal, checkNear) {
      //_targetModel 是 YJPlayer 或 YJNPC
      inRequestNext = false;

      if (_targetModel == null) {
        this.SetNpcTargetToNone(isLocal);
        return;
      }
      // console.log(" npc进入战斗 00 ", baseData.state == stateType.Back);
      // if (scope.fireId == -1 && baseData.state == stateType.Back || scope.isDead) {
      //   return;
      // }
      if (scope.isDead) {
        return;
      }

      if (targetModel == null) {
        targetModel = _targetModel;
        //加入战斗
        // if (isLocal && checkNear) {
        //   _Global.DyncManager.NPCAddFire(scope, targetModel);
        // }

        // 停止寻路
        SetNavPathToNone();
      }

      if (targetModel == null || targetModel.isDead) {
        TargetDead();
        return;
      }
      // console.log(" GetNickName() + ' 获取到目标 ', targetModel, baseData.state);



      if (laterNav != null) {
        clearTimeout(laterNav);
        laterNav = null;
      }

      let npcPos = parent.position.clone();
      readyAttack = false;
      readyAttack_doonce = 0;
      targetPos = targetModel.GetWorldPos();

      let targetPosRef = targetPos.clone();
      targetPosRef.y = npcPos.y;
      parent.lookAt(targetPosRef);

      scope.applyEvent("设置目标", targetModel);
      baseData.speed = RUNSPEED;
      if (isLocal) {
        SendModelState({
          title: "设置目标",
          playerId: targetModel.id,
          fireId: scope.fireId,
          health: baseData.health,
          maxHealth: baseData.maxHealth
        }
        );
        // if (checkNear) {
        //   _Global.DyncManager.SetNearNPCTarget(scope, targetModel);
        // }
      }
      if (baseData.state == stateType.Normal) {
        //首次进入战斗时，计算其技能 
        scope.applyEvent("首次进入战斗");
      }
      baseData.state = stateType.Fire;
      // scope.SetPlayerState("准备战斗");
    }
    function removeDebuffById(id) {
      for (let i = baseData.debuffList.length - 1; i >= 0; i--) {
        const item = baseData.debuffList[i];
        if (item.id == id) {
          baseData.debuffList.splice(i, 1);
        }
      }
      // if (_YJPlayerNameTrans) {
      //   _YJPlayerNameTrans.removeDebuffById(id);
      // }
      // _Global._YJPlayerNameManager.removeDebuffByPlayerId(scope.id,id );
      scope.applyEvent("移除buff", id);



      UpdateData();
    }
    this.isFullHealth = function () {
      return baseData.health == baseData.maxHealth;
    }
    function CheckHealth(fromName) {
      if (baseData.health <= 0) {
        baseData.health = 0;
        CombatLog("[" + fromName + "]" + " 杀死了 " + GetNickName());
      }
      UpdateData();
    }
    function RealyDamage(strength, from) {
      // 伤害显示在屏幕上
      let pos = scope.GetWorldPos().clone();
      pos.y += playerHeight * nameScale;
      let v = 0;
      if (strength == 0) {
        return v;
      }
      if (baseData.armor >= strength) {
        baseData.armor -= strength;
        _Global._SceneManager.UpdateNpcDamageValue(from, scope.npcName,scope.id, scope.GetCamp(), "吸收", pos, "redius");
        return 0;
      } else {
        // 至少会受到1点伤害
        v = strength - baseData.armor;
        baseData.armor = 0;
        scope.applyEvent("技能护甲归零");
        v = v > 0 ? v : 1;
      }
      _Global._SceneManager.UpdateNpcDamageValue(from, scope.npcName,scope.id, scope.GetCamp(), v, pos, "redius");

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


    function SendModelState(msg) {
      _Global.DyncManager.SendModelState(scope.transform.GetData().id,
        {
          modelType: scope.transform.GetData().modelType,
          msg: msg
        });
    }

    let fireLater = [];
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
      scope.applyEvent("死亡或离开战斗");

      if (laterCheckNextTarget != null) {
        clearTimeout(laterCheckNextTarget);
        laterCheckNextTarget = null;
      }
      receiveDamageData = [];
      fireLater = [];
    }

    //#endregion

    //#region 接收技能 接收伤害
    this.GetHealthPerc = function () {
      return parseInt(baseData.health / baseData.maxHealth * 100);
    }

    this.GetNickName = function () {
      return "[" + scope.npcName + "]";
    }
    function GetNickName() {
      return "[" + scope.npcName + "]";
    }
    this.ReceiveDamage = function (_targetModelId, skillName, effect) {
      if (!_Global.mainUser) {
        console.error("不该进入：非主控");
        return;
      }
      //_targetModel 是 YJPlayer 或 YJNPC 
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

      fromName = targetModel.GetNickName();

      CombatLog("玩家 [" + fromName + "] " + " 攻击 " + GetNickName() + " 造成 " + value + " 点伤害 ");

      // console.log(GetNickName() + "受到来自玩家["+targetModel.GetNickName()+"] 的伤害 ", _targetModelId, _Global.DyncManager.GetPlayerById(_targetModelId));

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
                CheckHealth(fromName);
              }, time * 1000 * i)
          }
          );
        }
        let buffIcon = _this.$uploadUVAnimUrl + icon;
        baseData.debuffList.push({ id: id, icon: buffIcon, describe: describe });
        // if (_YJPlayerNameTrans) {
        //   _YJPlayerNameTrans.addDebuff(id, buffIcon);
        // }
        // _Global._YJPlayerNameManager.addDebuffByPlayerId(scope.id,id,buffIcon );
        scope.applyEvent("添加buff", id, buffIcon);

        return;
      }
      CheckHealth(fromName);

      // console.log(GetNickName() + " 受到 " + targetModel.GetPlayerName() + " 使用 " + skillName + " 攻击 剩余 " + baseData.health);

      ClearLater("清除准备战斗");

      // if (targetModel == null) {
      //   return;
      // }
      SendModelState({
        playerId: scope.isDead ? '' : targetModel.id,
        health: baseData.health,
        maxHealth: baseData.maxHealth
      }
      );


    }
    function CombatLog(from, to, type, content) {
      if (_Global.CombatLog) {
        _Global.CombatLog.log(from, to, type, content);
      }
    }
    let fromName = "";
    this.ReceiveDamageByPlayer = function (_targetModel, skillName, effect) {
      if (!_Global.mainUser) {
        console.error("不该进入：非主控");
        return;
      }

      //_targetModel 是 YJPlayer 或 YJNPC 
      if (baseData.health == 0) {
        scope.isDead = true;
        return;
      }
      let { type, value, time, duration, describe, icon, fromName } = effect;

      if (type == "addHealth") {
        scope.Dync({ title: "加生命", value: value });
        CombatLog("[" + fromName + "]" + " 治疗 " + GetNickName() + " 恢复 " + value + " 点生命 ");
        return;
      }

      if (targetModel == null) {
        if (_targetModel) {
          if (_targetModel.isYJNPC) {
            _targetModel = _targetModel.GetComponent("NPC");
            fromName = _targetModel.npcName;
          }
          this.SetNpcTarget(_targetModel, true, false);
        }
      } else {
        if (_targetModel) {
          if (_targetModel.isYJTransform && _targetModel.isYJNPC) {
            // _targetModel = _targetModel.GetComponent("NPC");
            fromName = _targetModel.modelData.message.data.name;
          }
        }

        // 当npc的目标在攻击范围以外，则使用攻击npc的对象作为新的目标
        if (!scope.canMove && outVaildArea) {
          if (_targetModel) {
            this.SetNpcTargetToNoneDrict();
            if (_targetModel.isYJTransform && _targetModel.isYJNPC) {
              _targetModel = _targetModel.GetComponent("NPC");
              fromName = _targetModel.npcName;
            }
            this.SetNpcTarget(_targetModel, true, false);
          }
        }
      }
      // console.log("受到来自 222 的伤害 ", _targetModel);

      if (type == "control" || type == "shield") {
        _YJSkill.ReceiveDamageByPlayer(_targetModel, skillName, effect);
        return;
      }

      value = RealyDamage(value, fromName);

      // console.log(" npc接收技能攻击 ", effect);
      // 直接伤害 或 持续伤害
      if (type == "damage" || type == "contDamage") {
        baseData.health -= (value);
        CombatLog("[" + fromName + "]" + " 攻击 " + GetNickName() + " 造成 " + value + " 点伤害 ");

      }
      // 每n秒伤害，持续m秒
      if (type == "perDamage") {
        CombatLog(fromName, scope.npcName, "技能攻击", effect.skillName);

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
                CheckHealth(fromName);
              }, time * 1000 * i)
          }
          );
        }
        let buffIcon = _this.$uploadUVAnimUrl + icon;
        baseData.debuffList.push({ id: id, icon: buffIcon, describe: describe });
        // if (_YJPlayerNameTrans) {
        //   _YJPlayerNameTrans.addDebuff(id, buffIcon);
        // }
        // _Global._YJPlayerNameManager.addDebuffByPlayerId(scope.id,id,buffIcon );
        scope.applyEvent("添加buff", id, buffIcon);

        return;
      }

      CheckHealth(fromName);

      // console.log(GetNickName() + " 受到 " + targetModel.GetPlayerName() + " 使用 " + skillName + " 攻击 剩余 " + baseData.health);

      ClearLater("清除准备战斗");

      SendModelState({
        playerId: scope.isDead ? '' : targetModel ? targetModel.id : "",
        health: baseData.health,
        maxHealth: baseData.maxHealth
      }
      );
    }

    //#endregion

    //#region 
    //#endregion

    //#region 死亡 重生 和刷新数据
    function UpdateData() {
      if (!_Global.mainUser) {
        return;
      }
      scope.transform.UpdateData(); // 触发更新数据的回调事件
      if (baseData.health == 0) {
        ClearLater("清除巡逻");
        dead();
      }
      SendModelState({
        health: baseData.health,
        maxHealth: baseData.maxHealth
      }
      );
      scope.applyEvent("healthChange", baseData.health, baseData.maxHealth);
    }
    this.Dead = function () {
      dead();
    }
    let eventList = [];
    // 添加事件监听
    this.addEventListener = function (e, fn) {
      eventList.push({ eventName: e, fn: fn });
    }
    // 执行事件
    this.applyEvent = function (e, v, v2) {
      for (let i = 0; i < eventList.length; i++) {
        const element = eventList[i];
        if (element.eventName == e) {
          element.fn(v, v2);
        }
      }
    }
    let currentExp = 0;
    let needExp = 200;
    this.SetLevelToOne = function () {

      baseData.maxHealth = CONST_BASEDATA.maxHealth;
      baseData.strength = CONST_BASEDATA.strength;
      baseData.level = CONST_BASEDATA.level;
      currentExp = 0;
      needExp = 200;
      baseData.health = baseData.maxHealth;
    }
    this.SetLevelData = function (data) {
      baseData.maxHealth = data.maxHealth;
      baseData.strength = data.strength;
      baseData.level = data.level;
      currentExp = data.currentExp;
      needExp = data.needExp;
      baseData.health = baseData.maxHealth;
    }
    // 伤害输出和杀敌数控制等级提升
    this.SetLevel = function (level) {
      if (level == 1) {
        baseData.maxHealth = CONST_BASEDATA.maxHealth;
        baseData.strength = CONST_BASEDATA.strength;
        baseData.level = CONST_BASEDATA.level;
        currentExp = 0;
        needExp = 200;
      }
      baseData.health = baseData.maxHealth;
      scope.applyEvent("等级提升", baseData.level, baseData.strength);
      scope.applyEvent("经验值变化", currentExp, needExp);
      UpdateData();

    }
    this.GetLevel = function () {
      return baseData.level;
    }
    this.LevelUp = function () {
      if (scope.isDead) {
        return;
      }
      baseData.level++;
      baseData.maxHealth *= 1.2;
      baseData.maxHealth = Math.floor(baseData.maxHealth);
      baseData.strength *= 1.2;
      baseData.strength = Math.floor(baseData.strength);
      baseData.health = baseData.maxHealth;
      currentExp = 0;
      needExp *= 2;
      UpdateData();
      scope.applyEvent("等级提升", baseData.level, baseData.strength);
      scope.applyEvent("经验值变化", currentExp, needExp);

    }
    this.AddExp = function (exp) {
      AddExpFn(exp);
    }
    function AddExpFn(exp) {
      if (!scope.canLevelUp) {
        return;
      }
      currentExp += exp;
      scope.applyEvent("经验值变化", currentExp, needExp);

      if (currentExp >= needExp) {
        scope.LevelUp();
      }

    }
    // 死亡
    function dead() {
      if (!_Global.mainUser) {
        console.error("不该进入：非主控");
        return;
      }

      if (targetModel != null) {
        targetModel = null;
      }
      scope.isDead = true;
      scope.inControl = false;
      // CombatLog(GetNickName() + " 死亡");
      // 设为死亡状态
      baseData.state = stateType.Dead;
      // 从一场战斗中移除npc
      _Global.DyncManager.RemoveNPCFireId(scope.transform.id, scope.fireId);
      scope.fireId = -1;
      // 清除技能触发
      ClearFireLater();
      // 停止寻路
      SetNavPathToNone();
      scope.SetPlayerState("death");
      activeFalse();
      //死亡音效
      if (!data.isCopy && data.deadAudio) {
        playAudio(data.deadAudio, "dead");
      }
      scope.applyEvent("死亡");
    }
    this.playAudio = function (audioSrc, type) {
      playAudio(audioSrc, type);
    }
    function playAudio(audioSrc, type) {
      let v = radomNum(1, 10);
      if (type == "dead") {
        if (v < 10) {
          return;
        }
      }
      if (type == "普通攻击" || type == "准备战斗") {
        if (v < 9) {
          return;
        }
      } else {
        if (v < 5) {
          return;
        }
      }
      // console.log(type,v);
      _Global.YJAudioManager().playAudio(audioSrc, type);
    }
    function activeFalse() {

      if (baseData.debuffList) {
        for (let i = baseData.debuffList.length - 1; i >= 0; i--) {
          const item = baseData.debuffList[i];
          // if (_YJPlayerNameTrans) {
          //   _YJPlayerNameTrans.removeDebuffById(item.id);
          // }
          // _Global._YJPlayerNameManager.removeDebuffByPlayerId(scope.id,item.id );
          scope.applyEvent("移除buff", item.id);

        }
      }
      baseData.debuffList = undefined;

      scope.applyEvent("脱离战斗或死亡");



      // 死亡后是否消失
      if (!scope.deadedHidden) {
        return;
      }


      fireLater.push({
        type: "timeout", fn:
          setTimeout(() => {
            _Global._SceneManager.ReceiveEvent("npc尸体消失", scope.transform);
            // 执行溶解特效
            // new YJshader_dissolve(scope.transform.GetGroup());
          }, 5000)
      });
      fireLater.push({
        type: "timeout", fn:
          setTimeout(() => {
            scope.applyEvent("npc尸体消失");

            // 模型渐隐消失
            scope.transform.SetActive(false);
            if (data.isPlayer) {
              _Global.DyncManager.SendSceneState("删除", { type: "玩家镜像", npcId: scope.id, playerId: data.ownerId });
            }
          }, 7000)
      });

      if (!_Global.YJClient) {
        //重新生成
        let relifeTime = data.relifeTime;
        if (relifeTime && relifeTime > 0) {
          relifeTime = 8 + relifeTime;
        } else {
          relifeTime = 0;
        }
        if(relifeTime>0){
          setTimeout(() => {
            resetLife();
          }, relifeTime*1000);
        }
      }

      // scope.transform.Destroy();
      //一分钟后重新刷新。告诉主控
      // setTimeout(() => {
      //   resetLife();
      // }, 60000);
    }
    // 死亡后重新生成
    function resetLife() {

      scope.transform.ResetPosRota(); 
      targetModel = null;
      scope.isDead = false;
      scope.transform.SetActive(true);
      // 还原材质
      materials.forEach(item => {
        item.mesh.material = item.mat;
      });
      // materials = [];
      // 还原血量、还原状态
      baseData.armor = 0;
      baseData.health = baseData.maxHealth;
      baseData.state = stateType.Normal;
      scope.SetPlayerState("normal");
      scope.RadomNavPos();
      fireBeforePos = scope.GetWorldPos();


      // if (_YJPlayerNameTrans != null) {
      //   _YJPlayerNameTrans.resetLife();
      // }
      // _Global._YJPlayerNameManager.resetLifeByPlayerId(scope.id);

      scope.applyEvent("healthChange", baseData.health, baseData.maxHealth);
      scope.applyEvent("重生");

    }
    //#endregion



    function radomNum(minNum, maxNum) {
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
    this.SetActionScale = function (v) {
      _YJAnimator.SetActionScale(v);
    }

    let oldMovePos = null;
    let samePosTimes = 0;
    let moveLength = 0;

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
        return;
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

    this._update = function () {
      // nameTransLookatCamera();
      if (_Global.mainUser) {
        CheckState();
        if (this.canMove && !scope.inControl) {
          tick(clock.getDelta());
        }

        this.applyEvent("pos", playerPosition);

        // 主控实时发送坐标来同步。
        let oldTransData = scope.transform.CheckSamePos();
        if (oldTransData == null) {
          return;
        }
        // this.applyEvent("pos",oldTransData.pos);
        _Global.DyncManager.UpdateModel(scope.id, "pos",
          oldTransData);
      }
    }


    this.SetPlayerState = function (e, _animName) {
      if (oldState == e) {
        // if (scope.npcName.includes("阳光万里2") || scope.npcName.includes("我回来哩")) {
        //   console.error(GetNickName() + " 状态切换次数 ", inStateTimes, e);
        // }
        return;
      }
      oldState = e;
      inStateTimes++;

      switch (e) {

        case "准备战斗":

          var { s, v, a, _ready } = GetSkillDataByWeapon(weaponData);
          setVaildAttackDis(v);

          attackStepSpeed = a;

          if (_ready) {
            // fireParticleId = _ready.particle; 
            //播放音效
            playAudio(_ready.audio, "准备战斗");
          }
          GetAnimNameByPlayStateAndWeapon(e, weaponData);
          if (targetModel != null && targetModel.isDead) {
            TargetDead();
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
              readyAttack = true;
              vaildAttackLater = null;
              if (targetModel != null && targetModel.isDead) {
                TargetDead();
                return;
              }
            }, offsetTime);
          }

          break;
        case "普通攻击":
          var { s, v, a, _fire } = GetSkillDataByWeapon(weaponData);
          skillName = s;
          setVaildAttackDis(v);
          attackStepSpeed = a;
          let fireParticleId = "";
          if (_fire) {
            fireParticleId = _fire.particle;
            //播放音效
            playAudio(_fire.audio, "普通攻击");
          }
          scope.applyEvent("攻击", skillName, fireParticleId);
          GetAnimNameByPlayStateAndWeapon(e, weaponData);
          cutStartTime = new Date().getTime();
          // console.log(" 记录上一次成功攻击的时间 ",cutStartTime);
          break;
        case "施法":
          animName = _animName;
          break;
        case "受伤":
          GetAnimNameByPlayStateAndWeapon(e, weaponData);
          break;
        case "normal":
          GetAnimNameByPlayStateAndWeapon("停止移动", weaponData);
          break;
        case "停止移动":
          GetAnimNameByPlayStateAndWeapon("停止移动", weaponData);
          break;
        case "death":
          EventHandler("中断技能");
          animName = "death";
          break;
        case "跑向目标":
          baseData.speed = RUNSPEED;
          GetAnimNameByPlayStateAndWeapon("移动", weaponData);
          EventHandler("中断技能");

          break;
        case "丢失目标":
          GetAnimNameByPlayStateAndWeapon("移动", weaponData);
          EventHandler("中断技能");

          break;
        case "巡逻":
          baseData.speed = WALKSPEED;
          GetAnimNameByPlayStateAndWeapon("行走", weaponData);

          if (data.isPlayer) {
            baseData.speed = RUNSPEED;
            GetAnimNameByPlayStateAndWeapon("移动", weaponData);
          }
          break;
        default:
          break;
      }
      // console.log(" in npc SetPlayerState  ", e, animName);
      scope.ChangeAnim(animName, animNameFullback);
    }

    //#region  战斗检测
    let targetPos = null;
    //是否超出攻击范围
    let outVaildArea = false;
    //是否正确请求下一个目标
    let inRequestNext = false;

    this.SetValue = function (e, v) {
      if (e == "readyAttack_doonce") {
        readyAttack_doonce = v;
      }
    }
    function CheckState() {
      if (baseData.state == stateType.Normal) {
      }

      if (baseData.state == stateType.Fire) {
        // if(scope.npcName.includes("阳光万里") && targetModel){
        //   console.log(GetNickName() + ' 在战斗中 ',outVaildArea,_YJSkill.GetinSkill(), targetModel.isDead);
        // }

        if (_YJSkill.GetinSkill()) {
          return;
        }
        if (targetModel == null) {
          TargetNone();
          // scope.SetPlayerState("准备战斗");
          return;
        }
        if (targetModel != null && targetModel.isDead) {
          // scope.SetPlayerState("准备战斗");
          TargetDead();
          return;
        }


        // 逻辑见note/npc策划.md 战斗策略
        targetPos = targetModel.GetWorldPos();
        let npcPos = parent.position.clone();
        let targetPosRef = targetPos.clone();
        targetPosRef.y = npcPos.y;

        let dis = targetPosRef.distanceTo(npcPos);

        // if(scope.npcName.includes("ZH画渣") && targetModel){
        //   console.log(GetNickName() + ' 距离目标 ',dis,vaildAttackDis + scope.transform.GetData().scale.x);
        // }
        if (dis < vaildAttackDis + scope.transform.GetData().scale.x && CheckCanAttack()) {
          SetNavPathToNone();
          parent.lookAt(targetPosRef.clone());
          if (readyAttack_doonce == 0) {
            readyAttack = false;
            scope.SetPlayerState("准备战斗");
          }
          readyAttack_doonce++;
          outVaildArea = false;
          inRequestNext = false;

          // if(scope.npcName.includes("ZH画渣") ){
          //   console.log(GetNickName() +" 进入攻击范围内 ，准备攻击  ",readyAttack);
          // }
          //攻击
          if (readyAttack) {
            readyAttack = false;

            ClearLater("清除准备战斗");

            scope.SetPlayerState("普通攻击");

            //有效攻击 && 
            var { s, v, a } = GetSkillDataByWeapon(weaponData);
            scope.applyEvent("普通攻击目标", targetModel, { skillName: s, type: "damage", value: baseData.strength });

            vaildAttackLater2 = setTimeout(() => {
              //攻击结束之后，判断下一个目标
              if (maxDamagePlayerId != 0) {
                // console.log(" 设置下一个目标 ", maxDamagePlayerId, targetModel.id);
                if (maxDamagePlayerId != targetModel.id) {
                  targetModel = _Global.DyncManager.GetPlayerById(maxDamagePlayerId);
                }
              }
            }, attackStepSpeed * 100);
            if (toIdelLater != null) { clearTimeout(toIdelLater); }
            toIdelLater = setTimeout(() => {
              // scope.SetPlayerState("准备战斗");
              readyAttack_doonce = 0;
              toIdelLater = null;
            }, attackStepSpeed * 400);//间隔等于攻击动作时长

          }

          getnavpathTimes = 0;
        } else {
          if (!scope.canMove) {
            // console.log(GetNickName() +" 不可移动，但它的目标超出距离范围 ");
            outVaildArea = true;
            if (!inRequestNext) {
              CheckNextTarget();
              inRequestNext = true;
            }
          }
          EventHandler("中断技能");
          readyAttack_doonce = 0;
          if (!CheckVaildArea()) {
            return;
          }
          getnavPathTime++;
          if (getnavPathTime > 20) {
            if (!scope.canMove) {
            } else {
              //跑向目标 
              GetNavpath(npcPos, targetPos);
            }
            getnavPathTime = 0;
          }
        }
        // console.log( GetNickName() + " in fire " + dis);
      }
    }
    //#endregion
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

        moveLength = pos.distanceTo(oldMovePos)* 5;

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
        scope.SetActionScale(moveLength );
        scope.transform.UpdateDataByType("actionScale", moveLength );
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

    //#region 接收同步
    // 接收同步
    this.Dync = function (msg) {
      // console.log("接收npc同步数据 ", msg);
      if (msg.title == "脱离战斗") {
        // console.log(" npc 脱离战斗 ", hyperplasiaTrans);
        scope.fireId = -1;
        scope.SetNpcTargetToNone();
        //增生角色死亡
        scope.applyEvent("脱离战斗或死亡");
        return;
      }
      if (msg.title == "重新生成") {
        resetLife();
        return;
      }
      if (msg.title == "加护甲") {
        if (scope.isDead) { return; }
        baseData.armor += msg.value;
        return;
      }

      if (msg.title == "加生命") {
        if (scope.isDead) { return; }
        baseData.health += msg.value;
        if (baseData.health >= baseData.maxHealth) {
          baseData.health = baseData.maxHealth;
        }
        // console.log(GetNickName() + " 加 " + msg.value + "生命");
        UpdateData();
        let pos = scope.GetWorldPos().clone();
        pos.y += playerHeight * nameScale;
        _Global._SceneManager.UpdateNpcDamageValue("热心观众", scope.npcName,scope.id, scope.GetCamp(), msg.value, pos, "add");

        return;
      }
      if (msg.title == "npc技能"
        || msg.title == "解除技能"
        || msg.title == "受到技能"
        || msg.title == "npc技能攻击"
      ) {
        //取消寻路，让npc站住施法
        SetNavPathToNone();
        let skillItem = msg.skill;
        if (skillItem == "中断") {
          EventHandler("中断技能");
          return;
        }
        scope.applyEvent("同步技能", msg);
        return;
      }


      if (msg.title == "设置目标") {
        if (msg.fireId) {
          scope.fireId = msg.fireId;
        }
        if (msg.playerId) {
          if (targetModel == null) {
            baseData.state = stateType.Fire;
            // this.SetNpcTarget(_Global.DyncManager.GetPlayerById(msg.playerId));
          }
        } else {
          baseData.state = stateType.Normal;
          scope.fireId = -1;
        }

        return;
      }
      if (msg.title == "设置动作") {
        scope.ChangeAnim(msg.animName, msg.animNameFullback);
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
        scope.transform.UpdateData(); // 触发更新数据的回调事件

      }

    }
    //#endregion


    Init();

  }
}

export { YJNPC };