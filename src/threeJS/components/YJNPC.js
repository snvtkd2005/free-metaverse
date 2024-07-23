import * as THREE from "three";

import { createText } from 'three/examples/jsm/webxr/Text2D.js';
import { YJPlayerNameTrans } from "../YJPlayerNameTrans";
import { YJEquip } from "./YJEquip";
import { YJSkill } from "./YJSkill";
import { YJPlayerProperty } from './YJPlayerProperty';

import { YJshader_dissolve } from "/@/threeJS/loader/YJshader_dissolve";
import { YJBuff } from "./YJBuff";
import skillItem from "../../projects/farm/data/platform/skillItem";


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
 

    this.updateBasicProperty = function (_basicProperty) {
      if (_basicProperty == "health") {
        UpdateData();
        return;
      }
    }  
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
    }
    let baseData = {
      state: 'normal', //状态
      camp: 1001, //阵营
      speed: 8, //移动速度
      level: 1, //等级
      health: 100, //生命值
      maxHealth: 100, //生命值 
      fireId: -1, //战斗组id  -1表示未在战斗中
    }

    var SKILLTYPE = {
      PLAYER: '玩家技能',
      NPC: 'npc技能',
    };

    var SKILLTYPE = {
      PLAYER: '玩家技能',
      PLAYERATTACK: '玩家技能攻击',
      NPC: 'npc技能',
      NPCATTACK: 'npc技能攻击',
    };

    this.getPlayerType = function () {
      if (data.isPlayer) {
        return "玩家";
      }
      return "NPC";
    }
    this.owerType = function (e) {
      if (e == '技能') {
        return SKILLTYPE.NPC;
      }
      if (e == '技能攻击') {
        return SKILLTYPE.NPCATTACK;
      }
    }

    let _YJPlayerNameTrans = null;
    let _YJEquip = null;
    let _YJSkill = null;
    let _YJPlayerProperty = null;
    let _YJBuff = null;

    this.GetEquip = function () {
      return _YJEquip;
    }
    this.GetSkill = function () {
      return _YJSkill;
    }
    this.GetProperty = function () {
      return _YJPlayerProperty;
    }

    this.GetBuff = function () {
      return _YJBuff;
    }
    this.LookatTarget = function (targetModel) {

    }
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
      scope.applyEvent("重置昵称", this.npcName);
    }
    this.ResetName = function () {
      this.npcName = data.name;
      scope.applyEvent("重置昵称", this.npcName);
    }
    //创建姓名条参考物体
    let namePosTrans = null;
    let createnametimes = 0;
    function CreateNameTrans(content) {
      if(createnametimes>0){
        console.error("重复设置姓名条，请使用 scope.applyEvent(\"重置昵称\", this.npcName)");
        return;
      }
      createnametimes++;
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
      // 清除技能触发
      ClearFireLater();
      if (laterNav) {
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

      // 武器可能也有动作，如拉弓时弓的变形动画
      _YJEquip.ChangeAnim(v);
    }


    this.ChangeAnimDirect = function (animName) {
      _YJAnimator.ChangeAnimDirect(animName);
    }


    // 不在战斗且未死亡，且不在miss中，才可以设置
    this.isCanSetTarget = function () {
      return baseData.state != stateType.Back && baseData.state != stateType.Dead;
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
          let pos =  movePos[navPosIndex];
          GetNavpath(parent.position.clone(),new THREE.Vector3(pos.x,pos.y,pos.z));


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
      }else{
        scope.RadomNavPos();
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
        laterNav = setTimeout(() => {
          scope.UpdateNavPos("开始巡逻",pos);
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
      oldTargetPos.set(0,0,0) ;
    }
    let randomRedius = 3;
    let oldTargetPos = new THREE.Vector3();
    this.MoveToTargetFast = function () {
      scope.canMove = true;
      baseData.speed *= 5;
      lookAtTargetPos();
      navpath = [targetModel.GetWorldPos()];
      // GetNavpath(parent.position.clone(),  targetModel.GetWorldPos(),0);
    }
    // 获取寻路路径
    function GetNavpath(fromPos, targetPos, _randomRedius) {
      if (!scope.canMove) { return; }
      if (oldTargetPos && targetPos.distanceTo(oldTargetPos) < 0.01) {
        // console.log(" 目标点不变 ",oldTargetPos,targetPos);
        if(baseData.state == stateType.Normal){
          setTimeout(() => {
            scope.RadomNavPos();
          }, 2000);
        }
        return;
      } else {
      }
      oldTargetPos.set(targetPos.x,targetPos.y,targetPos.z);
      if (_randomRedius != undefined) {
        randomRedius = _randomRedius;
      } else {
        randomRedius = vaildAttackDis*0.5;
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
    //#endregion


    //#region  SetMessage
    
		this.MyFireState = function(e){
      
		}
    let skillList = []; 
    this.GetSkillList = function () {
      let s = [];
      for (let i = 0; i < skillList.length; i++) {
        const element = skillList[i];
        if(element.skillName != "基础攻击"){
          s.push(element);
        }
      }
      return s;
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
      // console.log( scope.GetNickName() + "in NPC 00 baseData = ", JSON.stringify(baseData));
      // console.log( scope.GetNickName() + "in NPC camp = ",  baseData.camp);

      if (baseData.basicProperty == undefined) {
        let basicProperty = {
          armor: 10,
          strength: baseData.strength,
        };
        baseData.basicProperty = basicProperty;
        CONST_BASEDATA.strength = baseData.strength;

      }

      CONST_BASEDATA.armor = baseData.armor;
      CONST_BASEDATA.maxHealth = baseData.maxHealth;
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
        if (!_YJSkill.GetinSkill()) { 
          GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
          scope.ChangeAnim(animName, animNameFullback);
        }
      });

      if (data.skillList == undefined) {
        data.skillList = [];
      }


      _YJEquip = new YJEquip(scope);
      _YJSkill = new YJSkill(scope);

      if (_YJPlayerProperty == null) {
        _YJPlayerProperty = new YJPlayerProperty(scope);
      }
      _YJBuff = new YJBuff(scope);
      fireBeforePos = scope.GetWorldPos();

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


      skillList = data.skillList;

      if(!_Global.setting.inEditor){
        let baseSkillItem = JSON.parse(JSON.stringify(skillItem.skill));
        baseSkillItem.level = 1;
        //从武器中获取动作
        var { s, v, a, _ready, _fire } = GetSkillDataByWeapon(weaponData);
        setVaildAttackDis(v);
        if (_ready) {
          baseSkillItem.skillReadyAudio = _ready.audio;
          baseSkillItem.skillReadyParticleId = _ready.particle;
        }
        if (_fire) {
          baseSkillItem.skillFireAudio = _fire.audio;
          baseSkillItem.skillFireParticleId = _fire.particle;
        }
        let ready = _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
        let fire = _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon("普通攻击", weaponData);
   
        baseSkillItem.animNameReady = ready.animName;
        baseSkillItem.animName = fire.animName;
        baseSkillItem.vaildDis = v;
        baseSkillItem.trigger.value = a;
        baseSkillItem.cCD = baseSkillItem.trigger.value;
        baseSkillItem.CD = baseSkillItem.trigger.value;
        baseSkillItem.canUse = false;
        skillList.push(baseSkillItem);

      }

      _YJSkill.SetSkill(skillList, baseData);

      _YJEquip.SetMessage(data);
      if (weaponData == null) {
        scope.SetPlayerState("normal");
        this.PathfindingCompleted();
        // 记录材质
        if (materials.length == 0) {
          recodeMat();
        }
      }
      // console.log( scope.GetNickName() + " fireBeforePos  11 = ",fireBeforePos);

      if (data.isCopy) {
        skillList = [];
        ClearFireLater();
      }
      // console.log( scope.GetNickName() + "in NPC msg = ", baseData);

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
          // axse.position.copy(pos);
        }
      }
      return pos;
    }


    //#region  动作切换

    this.EventHandler = function (e, cutSkill) {
      if (e == "中断施法") {
        _Global.applyEvent("设置目标技能进度条", "中断");
      }
    }

    let oldPlayerPos = new THREE.Vector3(0, 0, 0);
    let vaildAttackDis = 3; //有效攻击距离
    this.GetVaildAttackDis = function () {
      return vaildAttackDis + scope.transform.GetData().scale.x;
    }
    this.skillProgress = function (skillCastTime, skillName, reverse) {
      // console.log("GetTargetModel ",_Global._SceneManager.GetTargetModel());
      if (scope.transform != _Global._SceneManager.GetTargetModel()) {
        return;
      }
      _Global.applyEvent("设置目标技能进度条", skillCastTime, skillName, reverse);

    }
    this.SetMoveSpeed = function (f) {

    }
    this.SetVaildAttackDis = function (v) {
      setVaildAttackDis(v);
    }
    function setVaildAttackDis(v) {
      vaildAttackDis = v;//* modelScale;
    }

    this.GetBaseData = function () {
      return baseData;
    }
    this.GetScale = function () {
      return scope.transform.GetScale();
    }
    this.GetGroup = function () {
      return scope.transform.GetGroup();
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


    this.CheckCanAttack = function () {
      return CheckCanAttack();
    }
    function CheckCanAttack() {
      if (targetModel == null) {
        return false;
      }
      return true;
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
      if (targetPos && targetPos.distanceTo(fireBeforePos) >= 100) {
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
      laterCheckNextTarget = setTimeout(() => {
        CheckNextTarget();
      }, 500);
    }


    this.TargetDead = function () {

    }
    function TargetDead() {
      TargetNone(); 
      // return;
      // console.log(GetNickName() + " 的目标已死亡");
      CheckNextTarget();
    }
    function TargetNone() {
      inRequestNext = false;
      scope.applyEvent("施法中断");

      oldTargetPos.set(0,0,0) ;
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
      //恢复生命值
      baseData.health = baseData.maxHealth;
    }
    this.GetIsDead = function(){
      return scope.isDead;
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
        this.SetFireOff();
      }
      if (!this.canMove) {
        baseData.state = stateType.Normal;
      }
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

      scope.applyEvent("施法中断");


      GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
      scope.ChangeAnim(animName, animNameFullback);

      ClearLater("清除巡逻");

      if (isLocal) {
        SendModelState({ title: "设置目标", playerId: "", });
      }

    }


    this.LogFire = function () {
      return;
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
      if(targetPos){
        console.log(" 目标距离 ", targetPos.distanceTo(scope.GetWorldPos()));
      }
      if (oldTargetPos && targetPos) {
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
      // console.log( GetNickName() + ' 获取到目标 ', targetModel, baseData.state);



      if (laterNav != null) {
        clearTimeout(laterNav);
        laterNav = null;
      }

      let npcPos = parent.position.clone();
      readyAttack = false;
      readyAttack_doonce = 0;
      targetPos = targetModel.GetWorldPos();

      targetPosRef = targetPos.clone();
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
        if (checkNear) {
          _Global.DyncManager.SetNearNPCTarget(scope, targetModel);
        }
      }
      if (baseData.state == stateType.Normal || baseData.state == stateType.Back) {
        //首次进入战斗时，计算其技能 
        scope.applyEvent("首次进入战斗");
      }
      baseData.state = stateType.Fire;
    }
    this.isFullHealth = function () {
      return baseData.health == baseData.maxHealth;
    }
    this.CheckHealth = function (fromName) {
      CheckHealth(fromName);
    }
    function CheckHealth(fromName) {
      if (baseData.health <= 0) {
        baseData.health = 0;
        // scope.CombatLog(fromName + " 杀死了 " + GetNickName());
      }

      UpdateData();
    }
    this.GetDamageTextPos = function () {
      let pos = scope.GetWorldPos().clone();
      pos.y += playerHeight * nameScale / 2;
      return pos;
    }
    function RealyDamage(strength, fromId, fromName) {
      // 伤害显示在屏幕上
      let v = _YJPlayerProperty.RealyDamage(strength);
      _Global._SceneManager.UpdateNpcDamageValue(fromId, fromName, scope.npcName, scope.id, scope.GetCamp(), v, scope.GetDamageTextPos(), "redius");
      return v;
    }
    // 接收的伤害统计
    let receiveDamageData = [];
    let maxDamagePlayerId = 0;
    this.CheckMaxDamage = function (fromId, value) {
      // 计算伤害最高的玩家id
      CheckMaxDamage(fromId, value);
    }
    function CheckMaxDamage(fromId, value) {
      let has = false;
      for (let i = 0; i < receiveDamageData.length && !has; i++) {
        const element = receiveDamageData[i];
        if (element.fromId == fromId) {
          element.damageValue += value;
          has = true;
        }
      }
      if (!has) {
        receiveDamageData.push({ fromId: fromId, damageValue: value });
      }
      let v = 0;
      let plid = 0;
      for (let i = 0; i < receiveDamageData.length; i++) {
        const element = receiveDamageData[i];
        if (v <= element.damageValue) {
          v = element.damageValue;
          plid = element.fromId;
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
      return GetNickName();
    }
    function GetNickName() {
      return scope.npcName;
      // return "[" + scope.npcName + "]";
    }
    this.ReceiveSkill = function (fromModel, skillName, effect, skillItem) {
      if (!_Global.mainUser) {
        console.error("不该进入：非主控");
        return;
      }
      //fromModel 是 YJPlayer 或 YJNPC 
      if (baseData.health == 0) {
        scope.isDead = true;
        return;
      }

      // console.log(scope.GetNickName() + " receive skill fromModel ", fromModel);
      fromName = fromModel.GetNickName(); 

      let setT = false;
      if (targetModel == null) {
        setT = true;
      } else {
        // 当npc的目标在攻击范围以外，则使用攻击npc的对象作为新的目标
        if (!scope.canMove && outVaildArea) {
          this.SetNpcTargetToNoneDrict();
          setT = true;

        }
      }
      if (setT && fromModel.GetCamp() != scope.GetCamp()) {
        this.SetNpcTarget(fromModel, true, true);
      }
      if (targetModel == null) { return; }

      //在移动中受到攻击，判断下一个目标
      if (isMoving) {
        scope.CheckMaxDamageTargetModel();
      }

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

      _YJSkill.ReceiveSkill(fromModel, skillName, effect, skillItem);

    }

    this.skillEnd = function () {
      scope.CheckMaxDamageTargetModel();
    }
    this.CheckMaxDamageTargetModel = function () {
      if (targetModel == null) {
        return;
      }
      if (maxDamagePlayerId != 0) {
        if (maxDamagePlayerId != targetModel.id) {
          targetModel = _Global._YJFireManager.GetNpcOrPlayerById(maxDamagePlayerId);
        }
      }
    }
    this.CombatLog = function (from, to, type, content) {
      return;
      if (_Global.CombatLog) {
        _Global.CombatLog.log(from, to, type, content);
      }
    }

    let fromName = "";
    //#endregion

    //#region 
    //#endregion

    //#region 死亡 重生 和刷新数据
    function UpdateData() {
      if (!_Global.mainUser) {
        return;
      }
      scope.transform.UpdateData(); // 触发更新数据的回调事件
      if (baseData.health <= 0) {
        ClearLater("清除巡逻");
        dead();
      }
      if (baseData && baseData.maxHealth) {
        if (baseData.health >= baseData.maxHealth) {
          baseData.health = baseData.maxHealth;
        }
      }
      scope.applyEvent("healthChange", baseData.health, baseData.maxHealth);

      SendModelState({
        health: baseData.health,
        maxHealth: baseData.maxHealth
      }
      );
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
    this.applyEvent = function (e, v, v2,v3) {
      for (let i = 0; i < eventList.length; i++) {
        const element = eventList[i];
        if (element.eventName == e) {
          element.fn(v, v2,v3);
        }
      }
    }
    let currentExp = 0;
    let needExp = 200;
    this.SetLevelToOne = function () {

      baseData.maxHealth = CONST_BASEDATA.maxHealth;
      baseData.basicProperty.strength = CONST_BASEDATA.strength;
      baseData.level = CONST_BASEDATA.level;
      currentExp = 0;
      needExp = 200;
      baseData.health = baseData.maxHealth;
    }
    this.SetLevelData = function (data) {
      baseData.maxHealth = data.maxHealth;
      baseData.basicProperty.strength = data.strength;
      baseData.level = data.level;
      currentExp = data.currentExp;
      needExp = data.needExp;
      baseData.health = baseData.maxHealth;
    }
    // 伤害输出和杀敌数控制等级提升
    this.SetLevel = function (level) {
      if (level == 1) {
        baseData.maxHealth = CONST_BASEDATA.maxHealth;
        baseData.basicProperty.strength = CONST_BASEDATA.strength;
        baseData.level = CONST_BASEDATA.level;
        currentExp = 0;
        needExp = 200;
      }
      baseData.health = baseData.maxHealth;
      scope.applyEvent("等级提升", baseData.level, baseData.basicProperty.strength);
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
      baseData.basicProperty.strength *= 1.2;
      baseData.basicProperty.strength = Math.floor(baseData.basicProperty.strength);
      baseData.health = baseData.maxHealth;
      currentExp = 0;
      needExp *= 2;
      UpdateData();
      scope.applyEvent("等级提升", baseData.level, baseData.basicProperty.strength);
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
      
      scope.applyEvent("死亡",scope.transform.id, scope.fireId);
      // 从一场战斗中移除npc
      // _Global.DyncManager.RemoveNPCFireId(scope.transform.id, scope.fireId);
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
      _Global._YJAudioManager.playAudio(audioSrc, type);
    }
    function activeFalse() {


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
        if (relifeTime > 0) {
          setTimeout(() => {
            resetLife();
          }, relifeTime * 1000);
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
      // return;
      if (_Global.mainUser) {
        CheckState();
        if (this.canMove && !scope.inControl) {
          tick(clock.getDelta());
        }

        if(_YJSkill && baseData.state == stateType.Fire){
          _YJSkill._update(clock.getDelta());
        } 
        this.applyEvent("pos", playerPosition.clone());

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
        case "基础攻击": 
          GetAnimNameByPlayStateAndWeapon('准备战斗', weaponData);
          scope.applyEvent("基础攻击目标",targetModel);
          break;
        case "施法":
          animName = _animName;
          break;
        case "吟唱":
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
          animName = "death";
          break;
        case "跑向目标":
          baseData.speed = RUNSPEED;
          GetAnimNameByPlayStateAndWeapon("移动", weaponData);
          scope.applyEvent("施法中断");
          break;
        case "丢失目标":
          GetAnimNameByPlayStateAndWeapon("移动", weaponData);
          scope.applyEvent("施法中断");

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
    let targetPosRef = null;
    //是否超出攻击范围
    let outVaildArea = false;
    //是否正确请求下一个目标
    let inRequestNext = false;

    this.SetValue = function (e, v) {
      if (e == "readyAttack_doonce") {
        readyAttack_doonce = v;
      }
    }

    this.GetTargetModelDistance = function () {
      if (targetModel == null) {
        return 10000;
      }
      targetPos = targetModel.GetWorldPos();
      let npcPos = parent.position.clone();
      targetPosRef = targetPos.clone();
      targetPosRef.y = npcPos.y;
      return targetPosRef.distanceTo(npcPos);
    }
    function CheckState() {
      if (baseData.state == stateType.Normal) {
      }

      if (baseData.state == stateType.Fire) {

        // console.log("in skill false ");

        if (targetModel == null) {
          TargetNone();
          return;
        }
        if (targetModel != null && targetModel.isDead) {
          TargetDead();
          return;
        }

        if (_YJSkill.GetinSkill()) {
          // console.log("in skill true ");
          return;
        }

        // 逻辑见note/npc策划.md 战斗策略
        let dis = scope.GetTargetModelDistance();

        // if(scope.npcName.includes("ZH画渣") && targetModel){
        //   console.log(GetNickName() + ' 距离目标 ',dis,vaildAttackDis + scope.transform.GetData().scale.x);
        // }
        // console.log(GetNickName() + ' 距离目标 ',dis,vaildAttackDis);
        // console.log(GetNickName() + ' readyAttack_doonce ',readyAttack_doonce);

        if (dis < vaildAttackDis && CheckCanAttack()) {
          SetNavPathToNone();
          parent.lookAt(targetPosRef.clone());
          if (readyAttack_doonce == 0) {
            readyAttack_doonce++;
            scope.SetPlayerState("基础攻击");
          }
          outVaildArea = false;
          inRequestNext = false;
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

          scope.applyEvent("施法中断");
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

    //#region 接收同步
    // 接收同步
    this.Dync = function (msg) {
      // console.log("接收npc同步数据 ", msg);
      if (msg.title == "脱离战斗") {
        // console.log(" npc 脱离战斗 ", hyperplasiaTrans);
        scope.fireId = -1;
        scope.SetNpcTargetToNone();
        //增生角色死亡
        scope.applyEvent("死亡或离开战斗");
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
        console.log(GetNickName() + " 加 " + msg.value + "生命");
        UpdateData();
        let pos = scope.GetWorldPos().clone();
        pos.y += playerHeight * nameScale;
        _Global._SceneManager.UpdateNpcDamageValue("热心观众", scope.npcName, scope.id, "", scope.GetCamp(), msg.value, pos, "add");

        return;
      }
      if (msg.title == "npc技能"
        || msg.title == "解除技能"
        || msg.title == "受到技能"
        || msg.title == "npc技能攻击"
      ) {
        //取消寻路，让npc站住
        SetNavPathToNone();
        let skillItem = msg.skillItem;
        if (skillItem == "中断") {
          scope.applyEvent("施法中断");
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
          // 清除技能触发
          ClearFireLater();
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