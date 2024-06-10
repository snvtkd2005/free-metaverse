




import * as THREE from "three";
import roguelikeGameData from "../projects/farm/data/platform/roguelikeGameData";


/**
 * roguelike角色控制方式：
 * 1，鼠标位置控制角色朝向
 * 2，鼠标点击时攻击
 * 3,禁用左右鼠标旋转视角
 * 4，左键长按连续发射
 */
class YJController_roguelike {
  constructor() {
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
    let inGame = false;
    let currentKill = 0;
    let inLongPress = false;
    let mixamorigSpine = null;
    let headBoneRef = null;
    let npcTransform = null;
    let inSpineRota = true; // spine骨骼是否旋转。射箭动作旋转了90度，在面向敌人时需反向旋转校正
    
    let teamStats = roguelikeGameData.teamStats;
    let record = teamStats.record;

    function initTeamStats(){
      record = {
        time:0, //存活时间
        kill:0,//杀敌数
        damageValue:0,//造成的伤害
        money:0,//金币
        exp:0,//经验值
      };
    }

    function initWeapon(){
      let weapon = roguelikeGameData.weaponList[0];
      
      let path = _Global.YJ3D.$uploadUrl + weapon.assetId + "/" + "data.txt" + "?time=" + new Date().getTime()

      _Global.YJ3D._YJSceneManager.LoadAssset(path,(data)=>{
        console.log(path,data);
        
        data.pos = { x: 0, y: 0, z: 0 };
        data.rotaV3 = { x: 0, y: 0, z: 0 };
        data.scale = { x: 1, y: 1, z: 1 };
        
        let YJController = _Global.YJ3D.YJController;
        let YJPlayer = _Global.YJ3D.YJPlayer;
        _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().LoadStaticModel2(data, (transform) => {
          console.log(transform);
          let owner = transform;
          let msg = owner.GetMessage();
          if (msg.pointType == "weapon") { 
            let state = YJController.GetUserDataItem("weaponData");
            console.log(" 碰到武器 ", msg.data, state);
            // 判断角色是否可以拾取武器
            if (state != null && state.weaponId != "") {
              return;
            } 
  
            let { boneName, weaponType
              , position
              , rotation } = msg.data;
            YJController.SetUserDataItem("weaponData", msg.data);
            YJController.SetUserDataItem("weaponData", "weaponId", owner.GetData().folderBase);
            YJController.SetUserDataItem("weaponData", "transId", owner.id);
            YJController.SetUserDataItem("weaponDataData", {});
            YJController.SetUserDataItem("weaponDataData", owner.GetData());
            let realyBoneName = boneName;
            let boneList = YJPlayer.GetavatarData().boneList;
            if (boneList) {
              for (let i = 0; i < boneList.length; i++) {
                const item = boneList[i];
                if (item.targetBone == boneName) {
                  realyBoneName = item.boneName;
                }
              }
            }
            let realyPos = [0, 0, 0];
            let realyRota = [0, 0, 0];
            let realyScale = [1, 1, 1];
            let refBoneList = YJPlayer.GetavatarData().equipPosList;
            if (refBoneList) {
              for (let i = 0; i < refBoneList.length; i++) {
                const item = refBoneList[i];
                if (item.targetBone == boneName && item.weaponType == weaponType) {
                  realyPos = item.position ? item.position : realyPos;
                  realyRota = item.rotation ? item.rotation : realyRota;
                  realyScale = item.scale ? item.scale : realyScale;
                }
              }
            }
  
            // 碰到武器就拾取
            YJPlayer.GetBoneVague(realyBoneName, (bone) => {
              let weaponModel = owner.GetGroup(); 
              bone.add(weaponModel);
              YJPlayer.addWeaponModel(weaponModel); 
  
              let pos = realyPos;
              let rotaV3 = realyRota;
              let scale = realyScale;
              weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
              weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
              weaponModel.scale.set(100 * scale[0], 100 * scale[1], 100 * scale[2]);
  
              // 绑定到骨骼后，清除trigger
              owner.GetComponent("Weapon").DestroyTrigger();
   
            });
          }
        });
      });
    }
    function init () {
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


        
        function fire() {
          let fromPos = _Global.YJ3D.YJController.GetPlayerWorldPos();

          // 查找最近的敌人
          let npc =  _Global._YJNPCManager.GetNoSameCampNPCInFireByNearestDis(fromPos,1000, 30);
          if(npc==null){
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

        initWeapon();

        setInterval(() => {
          // if (inLongPress) {
          //   fire();
          // } 
          if(_Global.YJ3D.YJController.isInDead()){
            return;
          }
          if(mixamorigSpine == null){
            _Global.YJ3D.YJPlayer.GetAvatar().GetBone("mixamorigSpine",(bone)=>{
              headBoneRef = new THREE.Group();
              let playerObj = _Global.YJ3D.YJPlayer.GetAvatar().GetPlayerObj();
              playerObj.attach(headBoneRef);
              headBoneRef.position.set(0,0.7,0);
              mixamorigSpine = bone;
            });

            _Global.YJ3D.YJPlayer.GetAvatar().addEventListener("blendAction",(action)=>{
              lookAtTarget();
            });
          } 
          fire();
        }, 500);

        setInterval(() => {
          if(!inGame){
            return;
          }
          record.time++; 
          _Global.applyEvent("存活时间",toTime(record.time));
        }, 1000);

        inGame = true;
        //
        let npcs = _Global._YJNPCManager.GetNPCs();
        for (let i = 0; i < npcs.length; i++) {
          const npc = npcs[i].transform.GetComponent("NPC");
          npc.addEventListener("死亡", () => {
            checkKillCount();
          }); 
          npc.addEventListener("重生", () => {
            npc.SetNpcTarget(_Global.YJ3D.YJPlayer);//重生后立即攻击玩家   
          }); 
          npc.SetNpcTarget(_Global.YJ3D.YJPlayer);
        }
        _Global.addEventListener('游戏继续',()=>{
        });
        _Global.addEventListener('选择roguelike卡牌',(card)=>{
          _Global.YJ3D.YJController.GetPlayerFireCtrl().updateBasedata(card);
          playGame();
        });
        
        _Global.addEventListener('主角生命值',(h,maxH)=>{

        });
      }

    }

    function toTime(num){
      let str = "";
      if(num<60){
        str = "00:"+ toTen(num) ;
      } 
      if(num >= 60 && num<3600){
        let m = parseInt(num/60) ;
        let s = num%60; 
        str =  toTen(m) + ":"+ toTen(s) ;
      }
      if(num > 3600){
        let h = parseInt(num/3600);
        let hy = num%3600;
        let m = parseInt(hy/60) ;
        let s = hy%60; 
        str = (h) + ":" + toTen(m) + ":"+ toTen(s) ;
      }
      return str;
    }
    function toTen(num){
      let str = "";
      if(num<10){
        str = "0"+num;
      }
      if(num>=10 && num<60){
        str = num;
      }
      return str;
    }
    function checkKillCount(){
      record.kill++;
      console.log("已杀",record.kill);
      currentKill++;
      // _Global.addEventListener('杀敌数',(c,n)=>{ 
      // });
      if(currentKill>=roguelikeGameData.needKill){
        roguelikeGameData.needKill += 3 ;
        currentKill = 0;
        openCard();
        //升级，基础属性值提升

      }
      _Global.applyEvent('杀敌数',currentKill,roguelikeGameData.needKill);
    }

    // 占位符替换函数
    function templateReplace(template, data) {
      return template.replace(/\$\{(\w+)\}/g, function(match, key) {
        return data[key] || match;
      });
    }
    // 在打开宝箱或完成当前击杀数时，弹出卡片选择
    function openCard(){
      pauseGame();
      //显示卡牌界面
      let cards = [];
      let skills = roguelikeGameData.skills;
      //随机取出3张卡片
      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        skill.describe = templateReplace(skill.describe,skill); 
        cards.push(skill);
      }
      let items = roguelikeGameData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.describe = templateReplace(item.describe,item); 
        cards.push(item);
      }


      _Global.applyEvent('显示roguelike卡牌',cards);
      
    }
    function pauseGame(){
      _Global.pauseGame = true; 
      _Global.YJ3D.pauseRender = true; 
      inGame = false;
    }
    function playGame(){
      inGame = true;
      _Global.pauseGame = false; 
      _Global.YJ3D.pauseRender = false; 
    }
    function lookAtTarget(){
      headBoneRef.lookAt(npcTransform.GetWorldPos());
      // if(mixamorigSpine){ 
      //   headBoneRef.lookAt(new THREE.Vector3(0));
        
        let currentAction = _Global.YJ3D.YJPlayer.GetAvatar().GetCurrentAction();
        if (currentAction.time >= 0.96) {
          currentAction.time = 0;
        }
        let quat = headBoneRef.quaternion;
        let weapon = _Global.YJ3D.YJController.GetPlayerFireCtrl().GetWeaponType();
        if(weapon){
          let aimRotation = new THREE.Quaternion(); 

          if(weapon.weaponType == 'arch'){
            aimRotation.setFromEuler(new THREE.Euler(0,-Math.PI/2,0));
          }
          if(weapon.weaponType == 'gun'){
            aimRotation.setFromEuler(new THREE.Euler(0,-Math.PI/4,0));
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
    this._update = function(){

      // return;
      // console.log(" in YJController_roguelike update ",mixamorigSpine);
      if(mixamorigSpine && npcTransform && _Global.YJ3D.YJController.CheckMoving()){ 
        lookAtTarget();
      }
    }
    init();
  }
}
export { YJController_roguelike };