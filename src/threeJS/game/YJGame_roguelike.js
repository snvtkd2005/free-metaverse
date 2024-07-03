




import * as THREE from "three";
import GameItems from "../../projects/farm/data/platform/GameItems";
import roguelikeGameData from "../../projects/farm/data/platform/roguelikeGameData";
import { GameRecord } from "../common/gameRecord";


/**
 * roguelike角色控制方式：
 * 1，鼠标位置控制角色朝向
 * 2，鼠标点击时攻击
 * 3,禁用左右鼠标旋转视角
 * 4，左键长按连续发射
 */
class YJGame_roguelike {
  constructor(mainPanel) {
    var scope = this;
    // super();
    //#region 
    //#endregion 

    let bulletList = [];
    function bullet() {
      let castBall = new THREE.Mesh(new THREE.SphereGeometry(1, 5, 5),
        new THREE.MeshBasicMaterial(
          {
            color: 0xff0000,
            transparent: true,
            opacity: 1,
          }));
      castBall.castShadow = false;
      castBall.receiveShadow = false;
      castBall.tag = "ignoreRaycast";
      parent.add(castBall);
    }
    let inLongPress = false;
    let mixamorigSpine = null;
    let headBoneRef = null;
    let npcTransform = null;
    let inSpineRota = true; // spine骨骼是否旋转。射箭动作旋转了90度，在面向敌人时需反向旋转校正

    let _GameRecord = null;

    function fire() {

      // 判断是否有目标
      // if(_Global.YJ3D.YJController.GetPlayerFireCtrl().CheckTargetVaild()){
      //   return;
      // }
      let fromPos = _Global.YJ3D.YJController.GetPlayerWorldPos();
      // 查找最近的敌人
      let npc = _Global._YJNPCManager.GetNoSameCampNPCInFireByNearestDis(fromPos, _Global.user.camp, 30);
      // console.log(" 查找附件敌人 ",npc,fromPos);
      if (npc == null) {
        return;
      }
      npcTransform = npc.transform;
      if (npcTransform) {
        _Global.YJ3D.YJController.GetPlayerFireCtrl().SetInteractiveNPC(npcTransform);
      } else {
        // _Global.YJ3D.YJController.GetPlayerFireCtrl().shootTargetPos(tagetPos.clone(), "time");
      }
      return;
    }
    function autoFire() {
      setInterval(() => {
        if (_Global.YJ3D.YJController.isInDead()) {
          return;
        }
        if (_Global.pauseGame) {
          return;
        }
        if (mixamorigSpine == null) {
          _Global.YJ3D.YJPlayer.GetAvatar().GetBone("mixamorigSpine", (bone) => {
            headBoneRef = new THREE.Group();
            let playerObj = _Global.YJ3D.YJPlayer.GetAvatar().GetPlayerObj();
            playerObj.attach(headBoneRef);
            headBoneRef.position.set(0, 0.7, 0);
            mixamorigSpine = bone;
          });

          _Global.YJ3D.YJPlayer.GetAvatar().addEventListener("blendAction", (action) => {
            lookAtTarget();
          });
        }
        

        fire();
      }, 500);
    }
    function init() {
      // console.error(" in YJController_roguelike ");

      // setInterval(() => {
      //   if(mixamorigSpine == null){
      //     _Global.YJ3D.YJPlayer.GetAvatar().GetBone("mixamorigSpine",(bone)=>{
      //       headBoneRef = new THREE.Group();
      //       let playerObj = _Global.YJ3D.YJPlayer.GetAvatar().GetPlayerObj();
      //       playerObj.attach(headBoneRef);
      //       headBoneRef.position.set(0,0.7,0);
      //       // headBoneRef.add(new THREE.AxesHelper(10));
      //       mixamorigSpine = bone;
      //     });
      //   }  
      // }, 500);

      if (_Global.YJ3D.YJRaycaster) {

        if (_Global.setting.inEditor) {

          return;
        }
        if (!_Global.setting.inEditor) {
          _Global.YJ3D.YJController.enableRotate = false;
          _Global.YJ3D.YJController.enablePan = false;
        }

        let h = _Global.YJ3D._YJSceneManager.GetWindowSize().h;
        let tagetPos = new THREE.Vector3();
        _Global.YJ3D.YJRaycaster.addEventListener('mousePos', (x, y) => {
          return;
          let _pos = _Global.YJ3D._YJSceneManager.WorldPosToScreenPos(_Global.YJ3D.YJController.GetPlayerWorldPos().clone());
          y += _pos.y / h / 2;
          tagetPos = _Global.YJ3D.YJController.SetPlayerRota4(x, -y, 30);
        });


        // 左键点击
        _Global.YJ3D.YJRaycaster.addEventListener('leftmouseclick', (x, y) => {
          // console.log('leftMouse', x, y);

        });
        _Global._SceneManager.addEventListener('点击NPC', (transform) => {
          console.log("点击NPC2 ", transform);
          fire(transform);
        });

        _Global._SceneManager.addEventListener('点击空', () => {
          //朝这个方向施放攻击，法术攻击、武器攻击、自身攻击等
          console.log("点击空 ");
          // fire();
        });

        _Global.YJ3D.YJRaycaster.addEventListener('onmouseup', () => {
          inLongPress = false;
          _Global.YJ3D.YJController.GetPlayerFireCtrl().SetPlayerState("normal");

        });
        _Global.YJ3D.YJRaycaster.addEventListener('onmousedown', () => {
          inLongPress = true;

        });

        _Global.YJ3D.YJController.GetPlayerFireCtrl().GetEquip().initWeapon(roguelikeGameData.weaponList[0],()=>{
          _Global.YJ3D.YJController.GetPlayerFireCtrl().SetPlayerState("normal");
        });
        _Global.YJ3D.YJController.GetPlayerFireCtrl().SetState('canMoveAttack', true);
        
        autoFire();

        _Global.inGame = true;
        _GameRecord = new GameRecord();
        //
        let npcs = _Global._YJNPCManager.GetNPCs();
        for (let i = 0; i < npcs.length; i++) {
          const npc = npcs[i].transform.GetComponent("NPC");
          npc.addEventListener("死亡", () => {
            _GameRecord.addKill();
          });
          npc.addEventListener("重生", () => {
            npc.SetNpcTarget(_Global.YJ3D.YJPlayer);//重生后立即攻击玩家   
          });
          npc.SetNpcTarget(_Global.YJ3D.YJPlayer);
        }
        _Global.addEventListener('游戏继续', () => {
        });
        _Global.addEventListener('选择roguelike卡牌', (card) => {
          let { type, title, value, property } = card;
          if (type == "skill") {
            // 技能添加到界面上用来显示其施放状态和CD

          }
          _Global.YJ3D.YJController.GetPlayerFireCtrl().updateByCard(card);
          playGame();
        });

        _Global.addEventListener('主角生命值', (h, maxH) => {

        });
        _Global.applyEvent('主角姓名', _Global.YJ3D.YJController.GetPlayerFireCtrl().GetNickName());
        _Global.applyEvent('主角头像', _Global.YJ3D.YJPlayer.GetavatarData());
        
        
        _Global.addEventListener('升级', (level) => {
          _Global.YJ3D.YJController.GetPlayerFireCtrl().GetProperty().changeProperty();
          openCard(level);
        });
        
        _Global.YJ3D.YJController.GetPlayerFireCtrl().addEventListener("重生", (skillName, cCD) => {
          _Global.YJ3D.YJController.GetPlayerFireCtrl().applyEvent("首次进入战斗");
        });

        _Global.YJ3D.YJController.GetPlayerFireCtrl().addEventListener("技能CD", (skillName, cCD) => {
          mainPanel.changeMainPlayerSkillCD(skillName, cCD);
        });

        _Global.YJ3D.YJController.GetPlayerFireCtrl().addEventListener("添加技能", (_skill) => {
          mainPanel.AddSkill(_skill);
        });
        _Global.YJ3D.YJController.GetPlayerFireCtrl().addEventListener("属性改变", (baseData) => {
          _Global.applyEvent("属性改变",baseData);
        });

      }

    }
    // 占位符替换函数
    function templateReplace(template, data) {
      return template.replace(/\$\{(\w+)\}/g, function (match, key) {
        return data[key] || match;
      });
    }
    // 在打开宝箱或完成当前击杀数时，弹出卡片选择
    function openCard(level) {
      pauseGame();
      //显示卡牌界面
      let cards = [];


      let needExpByLevel = roguelikeGameData.needExpByLevels[level - 1];
      if (needExpByLevel.rewardType == 'skill') {
        
        let skills = _Global.skillList;
        // let skills = roguelikeGameData.skills;
        //随机取出3张卡片
        for (let i = 0; i < skills.length; i++) {
          const skill = skills[i];
          skill.describe = templateReplace(skill.describe, skill);
          cards.push(skill);
        }
      }
      if (needExpByLevel.rewardType == 'items') {
        let items = _Global.propList;
        // let items = GameItems.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          item.describe = templateReplace(item.describe, item);
          cards.push(item);
        }

      }


      _Global.applyEvent('显示roguelike卡牌', cards);

    }
    function pauseGame() {
      _Global.pauseGame = true;
      _Global.YJ3D.pauseRender = true;
      _Global.inGame = false;
    }
    function playGame() {
      _Global.inGame = true;
      _Global.pauseGame = false;
      _Global.YJ3D.pauseRender = false;
    }
    function lookAtTarget() {
      headBoneRef.lookAt(npcTransform.GetWorldPos());
      // if(mixamorigSpine){ 
      //   headBoneRef.lookAt(new THREE.Vector3(0));

      let currentAction = _Global.YJ3D.YJPlayer.GetAvatar().GetCurrentAction();
      if (currentAction.time >= 0.96) {
        currentAction.time = 0;
      }
      let quat = headBoneRef.quaternion;
      let weapon = _Global.YJ3D.YJController.GetPlayerFireCtrl().GetWeaponType();
      if (weapon) {
        let aimRotation = new THREE.Quaternion();

        if (weapon.weaponType == 'arch') {
          aimRotation.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
        }
        if (weapon.weaponType == 'gun') {
          aimRotation.setFromEuler(new THREE.Euler(0, -Math.PI / 4, 0));
        }
        quat.multiply(aimRotation);
      }

      let tracks = currentAction._clip.tracks;
      for (let i = 0; i < tracks.length; i++) {
        const element = tracks[i];
        if (element.name == ("mixamorigSpine.quaternion")) {
          // console.log(element); 
          for (let ii = 0; ii < element.values.length - 4; ii = ii + 4) {
            // element.values[ii]=1;
            // element.values[ii + 1]=1;
            // element.values[ii + 2]=1;
            // element.values[ii + 3]=1;
            element.values[ii] = quat.x;
            element.values[ii + 1] = quat.y;
            element.values[ii + 2] = quat.z;
            element.values[ii + 3] = quat.w;
          }
        }
      }
    }
    this._update = function () {

      // return;
      // console.log(" in YJController_roguelike update ",mixamorigSpine);
      if (mixamorigSpine && npcTransform && _Global.YJ3D.YJController.CheckMoving()) {
        lookAtTarget();
      }
    }
    init();
  }
}
export { YJGame_roguelike };