

import * as THREE from 'three';
import { RandomInt } from '../utils/utils';
import { YJEquip } from './components/YJEquip';
import { YJPlayerProperty } from './components/YJPlayerProperty';
import { YJSkill } from './components/YJSkill';
import { YJBuff } from './components/YJBuff';
import { YJProp } from './components/YJProp';
import skillItem from "/@/projects/farm/data/platform/skillItem";

// 战斗相关控制：
// 角色属性、战斗行为

class YJPlayerFireCtrl {
	constructor(_this, _YJPlayer) {
		let scope = this;
		this.isPlayerFire = true;


		let animName = "";
		let weaponData = null;
		this.GetWeaponType = function () {
			return weaponData;
		}
		this.SetWeaponData = function (_weaponData) {
			weaponData = _weaponData;
		}
		let baseData = null;
		//玩家动作状态机
		var PLAYERSTATE = {
			NORMAL: -1,
			DEAD: 0,
			ATTACKING: 1001, //对目标造成伤害后，进入战斗状态
			INTERACTIVE: 2,
			SITTING: 3,
		};
		var SKILLTYPE = {
			PLAYER: '玩家技能',
			PLAYERATTACK: '玩家技能攻击',
			NPC: 'npc技能',
			NPCATTACK: 'npc技能攻击',
		};

		this.getPlayerType = function () {
			return "玩家";
		}
		this.owerType = function (e) {
			if (e == '技能') {
				return SKILLTYPE.PLAYER;
			}
			if (e == '技能攻击') {
				return SKILLTYPE.PLAYERATTACK;
			}
		}

		this.GetHealthPerc = function () {
			return parseInt(baseData.health / baseData.maxHealth * 100);
		}
		this.GetNickName = function () {
			return _YJPlayer.GetNickName();
		}

		this.addDamageFrom = function () {
		}

		this.CheckMaxDamage = function (fromId, value) {
		}
		this.CombatLog = function (from, to, type, content) {
			if (_Global.CombatLog) {
				_Global.CombatLog.log(from, to, type, content);
			}
		}
		this.ReceiveSkill = function (fromModel, skillName, effect, skillItem) {

			// console.log(" 玩家接收技能 00 " ,fromModel, skillName, effect,skillItem);
			_YJSkill.ReceiveSkill(fromModel, skillName, effect, skillItem);


			if (baseData.health <= 0) {
				return true;
			}
			if (targetModel == null) {
				//被攻击且没有目标时，自动选中来源为目标
				//且不是自身时，
				if (fromModel == scope || fromModel == _YJPlayer) {
					return;
				}
				if (fromModel.GetCamp() == scope.GetCamp()) {
					return;
				}

				scope.SetInteractiveNPC(fromModel);

				// ReadyFire();
				// PlayerAddFire();
				EventHandler("设置目标", targetModel);
			}

			if (!state.inFire) {
				state.inFire = true;
			}
			EventHandler("进入战斗", fromModel);

		}


		var playerState = PLAYERSTATE.NORMAL;

		let eventList = [];
		// 添加事件监听
		this.addEventListener = function (e, fn) {
			// console.log(" 监听 ", e);
			eventList.push({ eventName: e, fn: fn });
		}
		// 执行事件
		this.applyEvent = function (e, v, v2, v3) {
			for (let i = 0; i < eventList.length; i++) {
				const element = eventList[i];
				if (element.eventName == e) {
					element.fn(v, v2, v3);
				}
			}
			
			if(e=="更新武器"){
				setTimeout(() => {
					updateWeapon();
				}, 1000);
			}
		}
		this.isInDead = function () {
			return baseData.health == 0;
		}
		this.updateEquip = function () {
			_this.YJController.directUpate("equip");
		}

		this.SetPlayerEvent = function (content, msg) {
			if (content == "删除镜像" || content == "重生") {

			} else {
				if (this.isInDead()) {
					// 角色死亡后不接收道具效果
					return;
				}
			}
			scope.OnPlayerState({
				content: content,
				msg: msg,
			});
			_YJPlayer.resetLife();
		}
		this.OnPlayerState = function (state) {

			switch (state.content) {
				case "设置玩家状态":
					scope.SetPlayerState(state.msg);
					break;
				case "添加镜像":
					EventHandler("添加镜像", state.msg);
					break;

				case "删除镜像":
					EventHandler("删除镜像", state.msg);
					break;
				case "玩家脱离战斗":
					playerState = PLAYERSTATE.NORMAL;
					state.inFire = false;
					console.log(" 玩家脱离战斗 ");
					scope.applyEvent("脱离战斗");
					break;
				case "玩家加入战斗":
					state.inFire = true;
					EventHandler("进入战斗");
					console.log(" 玩家加入战斗 ");
					break;
				case "设置npc":
					scope.SetInteractiveNPC(state.msg);
					break;
				case "重生":
					this.SetPlayerState("normal");
					_YJPlayerProperty.EventHandler("重生");
					scope.applyEvent("重生");
					UpdateData();
					break;
				case "选中npc":
					SelectNPC(state.msg);
					break;
				case "设置武器":
					weaponData = state.msg;
					break;
				case "攻击":
					state.canAttack = true;
					break;
				default:
					break;
			}
		}

		this.playAudio = function (audio, audioName) {
			_Global._YJAudioManager.playAudio(audio, audioName);
		}
		this.SetNavPathToNone = function () {

		}

		this.skillEnd = function () {
		}
		//#region  玩家使用技能
		this.skillProgress = function (skillCastTime, skillName, reverse) {
			_Global.applyEvent("设置技能进度条", skillCastTime, skillName, reverse);
		}
		this.LookatTarget = function (targetModel) {
			_this.YJController.PlayerLookatPos(targetModel.GetWorldPos());
		}
		this.UseSkill = function (skillItem) {
			_YJSkill.UseSkill(skillItem);
		}
		this.UseProp = function (skillItem) {
			UseProp(skillItem);
		}
		function UseProp(skillItem) {
			_YJProp.UseProp(skillItem);
		}
		let hyperplasiaTimes = 0;
		let hyperplasiaTrans = [];

		this.GetBoneVague = function (boneName, callback) {
			_YJPlayer.GetBoneVague(boneName, callback);
		}
		this.GetModelData = function () {
			// 使用镜像技能时，转换为npc数据
			let modelData = {
				id: "", //资源id
				name: _YJPlayer.GetNickName(), // 资源名字
				volume: { x: 1, y: 1, z: 1 }, //占用空间体积
				pos: { x: 0, y: 0, z: 0 }, //坐标
				rotaV3: { x: 0, y: 0, z: 0 }, //旋转
				scale: { x: 1, y: 1, z: 1 }, //缩放
				modelType: "NPC模型", // 模型类型：静态模型、动画模型、热点、特效
				folderBase: "", // 文件夹名
				mapId: "", //地图id
				message: {
					pointType: "npc",
					data: {
						avatarData: _YJPlayer.GetavatarData(),
						baseData: _YJPlayerProperty.GetBaseData(),// baseData,
					}
				}, //模型热点信息
				uuid: "",//在场景中的唯一标识
			};
			return modelData;
		}
		this.GetData = function () {
			let avatarData = _YJPlayer.GetavatarData();

			return {
				avatarData: avatarData,
			};

		}
		function hyperplasia(modelData, num, count, times) {
			modelData = JSON.parse(JSON.stringify(modelData));

			let data = modelData.message.data;
			data.name = modelData.name + "的镜像" + "_" + times + "_" + (num + 1);
			let pos = _this.YJController.GetPlayerWorldPos2();
			modelData.pos.x = pos.x + (num + 1);
			modelData.pos.y = pos.y;
			modelData.pos.z = pos.z;
			data.isCopy = true;

			let playId = _YJPlayer.id + "_" + times + "_" + num;
			data.isPlayer = true;
			data.ownerId = _YJPlayer.id;
			data.playerId = playId;
			modelData.id = playId;
			modelData.ownerId = _YJPlayer.id;
			if (data.baseData.maxHealth > 200) {
				data.baseData.maxHealth = 200;
			}

			data.baseData.state = "normal";
			data.baseData.strength = 20;
			data.baseData.camp = 1000;
			data.baseData.health = data.baseData.maxHealth;

			console.log("创建 玩家 镜像 ", playId, data.name);

			//向服务器发送添加
			_Global.DyncManager.SendSceneState("添加", modelData);
			num++;
			if (num == count) {
			} else {
				hyperplasia(modelData, num, count, times);
			}
			return;
			_Global.YJ3D._YJSceneManager.GetLoadUserModelManager().DuplicateModel(modelData, (transform) => {
				transform.SetActive(false);
				transform.id = playId;
				setTimeout(() => {
					_Global._YJFireManager.AddNpc(transform);
					let _targetModel = transform.GetComponent("NPC");
					_targetModel.id = playId;
					if (_YJPlayer.fireId != -1) {
						_targetModel.fireId = _YJPlayer.fireId;
						_Global._YJFireManager.AddFireGroup(playId, _YJPlayer.camp, _YJPlayer.fireId);
						_targetModel.CheckNextTarget();
					}
					transform.SetActive(true);
				}, 1000);
				//向服务器发送添加
				_Global.DyncManager.SendSceneState("添加", modelData);
				hyperplasiaTrans.push(transform.GetComponent("NPC"));
				num++;
				if (num == count) {
				} else {
					hyperplasia(modelData, num, count, times);
				}
			}, playId);
		}

		let firePosRef = new THREE.Group();
		this.GetShootingStartPos = function () {
			return GetShootingStartPosFn();
		}
		this.GetFirePosRef = function(){
			return firePosRef;
		}
		function updateWeapon(){
			let weaponModel = _YJEquip.getWeaponModel();
			console.log("更新武器 ",weaponModel);
			if (weaponModel) {
				var { _fire } = GetSkillDataByWeapon(weaponData);
				if (_fire.pos && _fire.pos.length == 3) {
					weaponModel.add(firePosRef);
					
					firePosRef.rotation.set(0,0,0);
					firePosRef.position.set(0,0,0);
 

					let pos1 = firePosRef.position.clone();
					// console.log("更新武器 _fire.pos",_fire.pos); 

					pos1.x += _fire.pos[0] * 1;
					pos1.y += _fire.pos[1] * 1;
					pos1.z += _fire.pos[2] * 1;
					firePosRef.position.copy(pos1);

					if(_fire.rotaV3){
						firePosRef.rotation.set(_fire.rotaV3[0],_fire.rotaV3[1],_fire.rotaV3[2]);
					}
					// console.log("更新武器 pos1",pos1);

					let axse = new THREE.AxesHelper(1);
					firePosRef.add(axse);
					axse.position.set(0,0,0);
				}
			}
		}
		function GetShootingStartPosFn() {
			let pos = _this.YJController.GetPlayerWorldPos();
			let weaponModel = _YJEquip.getWeaponModel();
			if (weaponModel) {
				pos = firePosRef.getWorldPosition(new THREE.Vector3());
			}
			return pos;
		}

		// 放出系技能，直接向某个位置发出技能，由碰到的物体承受 
		this.shootTargetPos = function (tagetPos, time, callback) {
			scope.SetPlayerState("普通攻击");
			console.log(" in shootTargetPos ");
			var { s, v, a } = GetSkillDataByWeapon(weaponData);
			let effect = { type: "damage", time: 0.2, skillName: s, value: 10 };

			let temp = new THREE.Group();
			temp.position.copy(_this.YJController.GetPlayerWorldPos());
			temp.lookAt(tagetPos.clone());
			temp.translateZ(vaildAttackDis);
			tagetPos.copy(temp.position);
			//有效攻击
			_Global.DyncManager.shootTarget(_this.YJController.GetPlayerWorldPos(), tagetPos, time, "npc", fireParticleId, (target) => {
				if (target) {
					_Global.DyncManager.SendSceneStateAll("玩家对NPC",
						{
							playerId: _YJPlayer.id,
							npcId: target.transform.id,
							skillName: effect.skillName,
							effect: effect
						});
				}
				if (toIdelLater == null) {
					toIdelLater = setTimeout(() => {
						scope.SetPlayerState("准备战斗");
						toIdelLater = null;
					}, attackStepSpeed * 500);
				}

			});
		}
		//#endregion

		//#region  
		//#endregion

		let targetModel = null;
		let npcPos = null;
		this.GetFireId = function () {
			return _YJPlayer.fireId;
		}
		// 玩家加入战斗
		function PlayerAddFire() {
			if (_YJPlayer.fireId != -1) {
				return;
			}
			if (targetModel == null) {
				return;
			}
			_Global._YJFireManager.PlayerAddFire(targetModel, _YJPlayer);
		}

		this.CheckHealth = function () {
			if (baseData.health <= 0) {
				baseData.health = 0;
			}
			UpdateData();

			if (baseData.health == 0) {
				_YJPlayer.isDead = true;
				scope.SetPlayerState("death");
				// 清除技能触发
				ClearFireLater();
				if (vaildAttackLater != null) {
					clearTimeout(vaildAttackLater);
					vaildAttackLater = null;
				}
				scope.applyEvent("死亡");
				return true;
			}
		}

		let fireLater = [];
		function ClearFireLater() {
			for (let i = 0; i < fireLater.length; i++) {
				if (fireLater[i].type == "interval") {
					clearInterval(fireLater[i].fn);
				}
				if (fireLater[i].type == "timeout") {
					clearTimeout(fireLater[i].fn);
				}
			}
			fireLater = [];
			EventHandler("中断技能");

		}


		// 生命值改变时，同步 
		function UpdateData() {
			_this.YJController.directUpate();
			if (baseData && baseData.maxHealth) {
				if (baseData.health >= baseData.maxHealth) {
					baseData.health = baseData.maxHealth;
				}
				_YJPlayer.UpdateHealth(baseData.health, baseData.maxHealth);
				_Global.applyEvent('主角生命值', baseData.health, baseData.maxHealth);
			}
		}

		this.GetBaseData = function () {
			return baseData;
		}
		this.GetScale = function () {
			return 1;
		}

		this.GetGroup = function () {
			return _YJPlayer.GetGroup();
		}
		this.SetInteractiveNPC = function (_targetModel) {
			SelectNPC(_targetModel);
			if (targetModel == null) {
				playerState = PLAYERSTATE.NORMAL;
				if (vaildAttackLater != null) {
					clearTimeout(vaildAttackLater);
					vaildAttackLater = null;
				}
				if (toIdelLater != null) {
					clearTimeout(toIdelLater);
					toIdelLater = null;
				}
				return;
			}

			if (_targetModel == scope || _targetModel == _YJPlayer) {
				return;
			}
			// 同阵营友善的npc，检查其交互事件
			if (_targetModel.GetCamp() == scope.GetCamp() || _targetModel.GetCamp() == 10001) {
				if (_targetModel.isYJNPC) {
					let data = _targetModel.GetData();
					if (data.eventData) {
						_targetModel.CallEvent();
					}
				}
				return;
			}
			ReadyFire();
		}
		function SelectNPC(_targetModel) {
			targetModel = _targetModel;
			if (targetModel != null) {
				scope.applyEvent("设置目标", targetModel);
				//自动显示其头像 
				_Global._SceneManager.SetTargetModel(targetModel);
				return;
			}
			scope.applyEvent("设置目标", null);

		}

		this.GetOwnerPlayerId = function () {
			return "";
		}
		function ReadyFire() {

			var { s, v, a } = GetSkillDataByWeapon(weaponData);
			skillName = s;
			vaildAttackDis = v;
			attackStepSpeed = a;
			//距离目标超过技能有效距离时，回到默认动作
			if (!CheckCanAttack()) {
				if (cantAttackType == CantAttackType.sameCamp) {

				} else {

					vaildAttackLater = setTimeout(() => {
						if (playerState == PLAYERSTATE.NORMAL) {
							if (targetModel == null) {
								return;
							}
							ReadyFire();
						}
						// playerState = PLAYERSTATE.NORMAL;
					}, 2000);
				}
			} else {
				if (targetModel == null) {
					return;
				}

				if (toIdelLater != null) {
					clearTimeout(toIdelLater);
					toIdelLater = null;
				}
				// 右键点击目标后，使用基础技能攻击
				scope.SetPlayerState("准备战斗");
				EventHandler("设置目标", targetModel);

				if (targetModel == null) {
					return;
				}
				// console.log(" 右键点击npc 准备战斗 ",state.canAttack);
				_this.YJController.PlayerLookatPos(targetModel.GetWorldPos());
				playerState = PLAYERSTATE.ATTACKING;
				state.canAttack = true;
				state.readyAttack = false;
				if (_YJSkill) {
					_YJSkill.UseBaseSkill();
				}
			}
		}
		let vaildAttackLater = null;
		let vaildAttackLater2 = null;
		let attackStepSpeed = 3; //攻击间隔/攻击速度,由武器中的攻击速度控制 
		function getAttackSpeed() {
			_YJPlayer.GetAvatar().SetActionScale(1 + baseData.basicProperty.speedScale * 0.3);
			return attackStepSpeed / baseData.basicProperty.speedScale;
		}
		this.SetMoveSpeed = function (f) {
			_Global.YJ3D.YJController.SetMoveSpeedScale(f);
			_Global.YJ3D.YJPlayer.GetAvatar().SetActionScale(1 + f);
		}

		let toIdelLater = null;
		let skillName = "";
		let fireParticleId = ''; //攻击特效id 
		let readyskillAudioName = "";
		let vaildAttackDis = 3; //有效攻击距离
		this.SetVaildAttackDis = function (v) {
			setVaildAttackDis(v);
		}
		function setVaildAttackDis(v) {
			vaildAttackDis = v;//* modelScale;
		}
		this.GetWorldPos = function () {
			return _this.YJController.GetPlayerWorldPos2();
		}
		this.GetWorldPosHalfHeight = function () {
			return _this.YJController.GetPlayerWorldPos();
		}
		this.GetDamageTextPos = function () {
			return _this.YJController.GetPlayerWorldPos3();
		}

		this.GetCamp = function () {
			return _Global.user.camp;
		}
		this.GetIsPlayer = function () {
			return false;
		}
		let state = {
			canAttack: false,
			canMoveAttack: false,//是否支持移动中攻击
			isMoving: false,//是否正在移动
			inFire: false,//是否正在战斗状态
			readyAttack: false,
		};
		this.SetState = function (e, v) {
			state[e] = v;
		}
		// 是否有效攻击距离
		function inVaildArea(dis) {
			return dis < vaildAttackDis + targetModel.GetModelScale();
		}
		function CheckCamp() {
			let targetCamp = targetModel.GetCamp();
			if (targetCamp == 10001) { return false; } //不可攻击友善目标
			return targetCamp != _Global.user.camp;
		}
		this.CheckCanAttack = function () {
			return CheckCanAttack();
		}
		const CantAttackType = {
			notarget: 0,
			sameCamp: 1,
			hasCollider: 2,
			tofar: 3,
		};
		let cantAttackType = 0;
		function CheckCanAttack() {
			if (!targetModel) {
				scope.MyFireState("我没有目标");
				cantAttackType = CantAttackType.notarget;
				return false;
			}
			//如果目标阵营不可攻击
			let b0 = CheckCamp();
			if (!b0) {
				// scope.MyFireState("不能攻击这个目标");
				state.canAttack = false;
				cantAttackType = CantAttackType.sameCamp;
				return false;
			}
			let playerPos = _this.YJController.GetPlayerWorldPos();
			playerPos.y += 1;
			npcPos = targetModel.GetWorldPos();
			npcPos.y += 1;
			// 与目标之间有遮挡
			let b2 = CheckColliderBetween(npcPos, playerPos);
			if (b2) {
				scope.MyFireState("无法攻击目标");
				state.canAttack = false;
				cantAttackType = CantAttackType.hasCollider;

				return false;
			}
			// 不在攻击范围内
			let b = inVaildArea(playerPos.distanceTo(npcPos));
			if (!b) {
				scope.MyFireState("太远了"); state.canAttack = false;
				cantAttackType = CantAttackType.tofar;
				return false;
			}
			return b && !b2;
		}
		this.MyFireState = function (e) {
			console.error(e);
			_Global._SceneManager.FireState(e);
		}

		this.GetTarget = function () {
			return targetModel;
		}
		function fireGo() {
			// console.log(" 有效攻击目标 ", baseData.basicProperty.strength); 
			var { s, v, a } = GetSkillDataByWeapon(weaponData);
			//有效攻击
			_YJSkill.SendDamageToTarget(targetModel, { skillName: s, type: "damage", value: baseData.basicProperty.strength });
		}
		function CheckState() {
			return;
			if (playerState == PLAYERSTATE.ATTACK) {

			}
			// console.log(" 状态 ", playerState);

			if (playerState == PLAYERSTATE.ATTACK || playerState == PLAYERSTATE.ATTACKING) {
				if (targetModel == null) {
					return;
				}
				if (_YJPlayer.isDead) {
					return;
				}

				if (state.canAttack && CheckCanAttack()) {
					return;
					// 如果准备好攻击，则立即攻击
					if (state.readyAttack) {
						state.readyAttack = false;

						if (!state.inFire) {
							EventHandler("进入战斗");
						}
						state.inFire = true;
						playerState = PLAYERSTATE.ATTACKING;

						// 动作时长的前3/10段时，表示动作执行完成，切换成准备动作
						if (toIdelLater == null) {
							toIdelLater = setTimeout(() => {
								scope.SetPlayerState("准备战斗");
								toIdelLater = null;
							}, attackStepSpeed * 500);
						}

						if (targetModel == null) {
							return;
						}

						// 立即执行攻击动作
						scope.SetPlayerState("普通攻击");

						// 范围攻击。 max为1时，表示不使用范围攻击
						// 动作时长的前1/10段时，执行伤害
						vaildAttackLater2 = setTimeout(() => {
							fireGo();
							PlayerAddFire();
						}, getAttackSpeed() * 300);


					} else {
					}
				} else {
					EventHandler("中断技能");
				}

				return;
			}
		}

		let temp = new THREE.Group();
		// temp.add(new THREE.AxesHelper(12));
		_this.scene.add(temp);
		let temp2 = new THREE.Group();
		// temp2.add(new THREE.AxesHelper(1));
		_this.scene.add(temp2);
		function CheckColliderBetween(fromPos, targetPos) {
			// console.log("距离目标", fromPos,targetPos);

			temp.position.copy(fromPos);
			temp2.position.copy(targetPos);
			temp.lookAt(temp2.position);
			let direction = temp.getWorldDirection(new THREE.Vector3());
			var raycaster_collider = new THREE.Raycaster(fromPos, direction, 0, 1 * fromPos.distanceTo(targetPos));
			var hits = raycaster_collider.intersectObjects(_this._YJSceneManager.GetAllColliderAndLand(), true);

			// console.log(_this._YJSceneManager.GetAllColliderAndLand(), hits);
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
		let animNameFullback = "";
		function GetAnimNameByPlayStateAndWeapon(e, weaponData) {
			let an = _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon(e, weaponData);
			animName = an.animName;
			animNameFullback = an.animNameFullback;
		}
		function GetSkillDataByWeapon(weaponData) {
			return _Global.CreateOrLoadPlayerAnimData().GetSkillDataByWeapon(weaponData);
		}
		this.EventHandler = function (e, cutSkill) {
		}
		function EventHandler(e, msg) {
			if (e == "中断技能") {

				// 无法中断已经施放出去的技能
				// if (vaildAttackLater2 != null) {
				// 	clearTimeout(vaildAttackLater2);
				// 	vaildAttackLater2 = null;
				// }
				if (vaildAttackLater != null) {
					clearTimeout(vaildAttackLater);
					vaildAttackLater = null;
					_Global.ReportTo3D("设置技能进度条", "中断");
				}
				if (!_YJSkill.GetinSkill()) {
					_Global.ReportTo3D("设置技能进度条", "中断");
					_Global._YJAudioManager.stopAudio(readyskillAudioName);
				}
				if (toIdelLater != null) {
					clearTimeout(toIdelLater);
					toIdelLater = null;
				}

			}
			if (e == "进入战斗" || e == "设置目标") {

				// if (hyperplasiaTrans.length > 0) {
				// 	for (let i = 0; i < hyperplasiaTrans.length; i++) {
				// 		_Global._YJFireManager.AddFireGroup(hyperplasiaTrans[i].id, _YJPlayer.camp, _YJPlayer.fireId);
				// 		hyperplasiaTrans[i].fireId = _YJPlayer.fireId;
				// 		hyperplasiaTrans[i].SetNpcTarget(msg ? msg : targetModel);
				// 	}
				// }
				scope.applyEvent("进入战斗", _YJPlayer.camp, _YJPlayer.fireId, targetModel);
			}

			if (e == "添加镜像") {
				// let mirrorId = msg;
				// let targetModel = _Global._YJFireManager.GetNpcById(mirrorId).GetComponent("NPC");
				// targetModel.setOwnerPlayer(_YJPlayer);
				// hyperplasiaTrans.push(targetModel);
			}
			if (e == "删除镜像") {
				// let mirrorId = msg;
				// for (let i = hyperplasiaTrans.length - 1; i >= 0; i--) {
				// 	const element = hyperplasiaTrans[i];
				// 	if (element.id == mirrorId) {
				// 		hyperplasiaTrans.splice(i, 1);
				// 	}
				// }

			}
		}
		this.AddExp = function (v) {

		}
		this.TargetDead = function () {
			playerState = PLAYERSTATE.NORMAL;
			targetModel = null;
			this.SetPlayerState("normal");
			scope.applyEvent("设置目标", null);
		}
		this.ClearSkill = function () {
			_YJSkill.ClearSkill("基础攻击");
		}
		this.InFire = function () {
			// return true;
			return _YJPlayer.fireId != -1;
			// return playerState == PLAYERSTATE.ATTACKING;
		}
		this.GetIsDead = function () {
			return _YJPlayer.isDead;
		}
		this.CheckTargetVaild = function () {
			if (targetModel && !targetModel.isDead) {
				return true;
			}
			return false;
		}
		function CheckTargetDead() {

			if (targetModel && targetModel.isDead) {
				targetModel = null;
				_Global._SceneManager.SetTargetModel(targetModel);
				playerState = PLAYERSTATE.NORMAL;
				if (toIdelLater != null) {
					clearTimeout(toIdelLater);
					toIdelLater = null;
				}
				scope.SetPlayerState("战斗结束");
				return;
			}
		}

		this.SetPlayerState = function (e, _animName) {

			// weaponData = _this.YJController.GetUserData().weaponData;
			weaponData = scope.GetEquip().GetWeaponData();

			// console.log(" in SetPlayerState  ",e,weaponData,playerState);

			switch (e) {
				case "普通攻击":
					playerState = PLAYERSTATE.ATTACKING;
					var { s, v, a, _fire } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					if (_fire) {
						fireParticleId = _fire.particle;
						//播放音效
						scope.playAudio(_fire.audio);
					}
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					CheckTargetDead();

					if (state.canMoveAttack && state.isMoving && _Global.YJ3D.YJPlayer.GetAvatar().layerBlendPerbone(animName, "run", false, true)) {
						return;
					}
					break;
				case "赤手攻击":
					playerState = PLAYERSTATE.ATTACKING;
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "准备战斗":
					playerState = PLAYERSTATE.ATTACKING;
					var { s, v, a, rpid, raid } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					//播放音效
					scope.playAudio(raid);
					GetAnimNameByPlayStateAndWeapon(e, weaponData);


					if (vaildAttackLater == null) {
						// 技能施放时间到时，重新立即攻击
						vaildAttackLater = setTimeout(() => {
							state.readyAttack = true;
							vaildAttackLater = null;
						}, getAttackSpeed() * 1000);
					}
					CheckTargetDead();
					if (state.canMoveAttack && state.isMoving) {
						// _Global.YJ3D.YJPlayer.GetAvatar().layerBlendPerbone(animName, "run",false,true);
						return;
					}
					break;
				case "受伤":
					playerState = PLAYERSTATE.ATTACKING;
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "death":
					playerState = PLAYERSTATE.DEAD;
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					EventHandler("中断技能");

					_Global.DyncManager.SendSceneStateAll("玩家死亡",
						{
							playerId: _YJPlayer.id,
							fireId: _YJPlayer.fireId
						});
					_YJPlayer.fireId = -1;

					//角色不可控制、显示倒计时
					_this.YJController.SetCanMoving(false);
					_this.YJController.CancelMoving();
					_Global.ReportTo3D("主角死亡");
					break;
				case "sitting":
					playerState = PLAYERSTATE.SITTING;
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "normal":
					playerState = PLAYERSTATE.NORMAL;
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "跳跃":
					state.canAttack = false;
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					EventHandler("中断技能");

					break;
				case "取消跳跃":
					GetAnimNameByPlayStateAndWeapon("停止移动", weaponData);
					break;
				case "移动":
					state.isMoving = true;
					if (state.canMoveAttack) {
						GetAnimNameByPlayStateAndWeapon("普通攻击", weaponData);
						// GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData); 
						// 上半身动作和下半身动作混合
						if (_Global.YJ3D.YJPlayer.GetAvatar().layerBlendPerbone(animName, "run", false, true)) {
							return;
						}
						GetAnimNameByPlayStateAndWeapon(e, weaponData);
					} else {
						state.canAttack = false;
						EventHandler("中断技能");
						GetAnimNameByPlayStateAndWeapon(e, weaponData);
					}
					break;
				case "停止移动":
					state.isMoving = false;

					if (playerState == PLAYERSTATE.NORMAL) {
						GetAnimNameByPlayStateAndWeapon(e, weaponData);
					}
					if (playerState == PLAYERSTATE.ATTACKING) {
						if (state.canMoveAttack) {
							GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
						}
						if (!state.canAttack) {
							GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
							if (targetModel != null) {
								ReadyFire(); //有目标停止移动时，自动攻击
							}
						}
					}
					// console.log(e, playerState, state.canAttack);
					break;
				case "战斗结束":
					if (playerState == PLAYERSTATE.NORMAL) {
						GetAnimNameByPlayStateAndWeapon(e, weaponData);
					}
					if (state.isMoving) {
						return;
					}
					break;

				case "施法":
					animName = _animName;
					break;
				case "吟唱":
					animName = _animName;
					break;
				case "interactive":
					break;
				default:
					break;
			}
			// console.log(" 玩家动作 ",weaponData, e,animName);

			// console.log(" 玩家动作 ", animName);
			_this.YJController.SetPlayerAnimName(animName, animNameFullback);
		}
		this.ChangeAnim = function (v, vb) {
			_this.YJController.SetPlayerAnimName(v, vb);
		}

		this.ChangeAnimDirect = function (animName) {
			_this.YJController.ChangeAnimDirect(animName, "idle");
		}

		this.SetValue = function (v, vb) {

		}
		this.fireOff = function () {
			if (_YJPlayer.isDead) {
				return;
			}
			_YJPlayer.fireId = -1;
			scope.applyEvent("离开战斗");
			scope.ChangeAnimDirect("idle");
		}
		this.SetInControl = function (b) {
			_this.YJController.SetEnabled(!b);
			_this.YJController.SetAmmoEnabled(!b);
		}
		this.GetTargetModelDistance = function () {
			if (targetModel == null) {
				return 10000;
			}
			let targetPos = targetModel.GetWorldPos();
			let npcPos = scope.GetWorldPos().clone();
			let targetPosRef = targetPos.clone();
			targetPosRef.y = npcPos.y;
			return targetPosRef.distanceTo(npcPos);
		}

		var updateId = null;
		this._update = function () {
			// function update() {
			// updateId = requestAnimationFrame(update);
			if (_Global.pauseGame) {
				return;
			}
			if (_YJSkill) {
				_YJSkill._update();
			}
			// 检测状态 战斗逻辑 
			CheckState();
		}
		//#region 
		//#endregion

		// if("" || 0){
		// 	console.log(" in YJPlayerFireCtrl ");
		// }
		let _YJSkill = null;
		let _YJEquip = null;
		let _YJBuff = null;
		let _YJProp = null;
		let _YJPlayerProperty = null;
		this.GetBuff = function () {
			return _YJBuff;
		}
		this.GetEquip = function () {
			return _YJEquip;
		}
		this.GetSkill = function () {
			return _YJSkill;
		}
		this.GetProp = function () {
			return _YJProp;
		}
		this.GetProperty = function () {
			return _YJPlayerProperty;
		}
		
		this.GetYJPlayer = function () {
			return _YJPlayer;
		}
		function Init() {
			if (baseData == null) {

				baseData = _this.YJController.GetUserData().baseData;
				baseData.camp = _Global.user.camp;
				console.log(" 从控制器获取 baseData", JSON.stringify(baseData));
				if (_YJPlayerProperty == null) {
					_YJPlayerProperty = new YJPlayerProperty(scope);
				}

				_YJPlayer.SetBaseData(baseData);

				if (_YJBuff == null) {
					_YJBuff = new YJBuff(scope);
				}
				if (_YJSkill == null) {
					_YJSkill = new YJSkill(scope);
				}

				if (_YJProp == null) {
					_YJProp = new YJProp(scope);
				}
				if (_YJEquip == null) {
					_YJEquip = new YJEquip(scope);
				}
				
			}
			scope.id = _Global.user.id;

			_Global._YJPlayerFireCtrl = scope;
			_Global.YJ3D._YJSceneManager.AddNeedUpdateJS(scope);
			_YJPlayer.addEventListener("pos", (pos) => {
				//玩家位置变动时，判断技能是否超出有效距离
				if (_YJSkill) {
					_YJSkill.CheckSkillInVaildDis(pos);
				}
				scope.applyEvent("pos", pos);
				//当在与商人或接任务时，距离超过10米时，关闭对话框
				if (_Global.panelState.task || _Global.panelState.talk || _Global.panelState.shop
				) {
					if (_Global.talkPos) {
						let dis = scope.GetWorldPos().distanceTo(_Global.talkPos);
						if (dis > 10) {
							_Global.applyEvent("界面开关", "talk", false);
							_Global.applyEvent("界面开关", "task", false);
							_Global.applyEvent("界面开关", "shop", false);
							_Global.talkPos = null;
						}
					}
				}
			});
			setTimeout(() => {
				let skillList = [];

				if (!_Global.setting.inEditor) {
					let baseSkillItem = JSON.parse(JSON.stringify(skillItem.skill));
					baseSkillItem.level = 1;
					//从武器中获取动作
					weaponData = scope.GetEquip().GetWeaponData();
					let strength = 10;
					let castTime = 2;

					if (weaponData) {
						castTime = weaponData.attackSpeed;
						strength = weaponData.strength;
					}
					var { s, v, a, _ready, _fire } = GetSkillDataByWeapon(weaponData);
					baseSkillItem.castTime = a;
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
					baseSkillItem.effect.value = strength;
					baseSkillItem.trigger.value = a;
					baseSkillItem.cCD = baseSkillItem.trigger.value;
					baseSkillItem.CD = baseSkillItem.trigger.value;
					baseSkillItem.canUse = false;
					baseSkillItem.auto = false;
					baseSkillItem.hasTarget = false;
					baseSkillItem.outVaildDis = true;
					skillList.push(baseSkillItem);
					_YJSkill.AddSkill(baseSkillItem);
					// _YJSkill.SetSkill(skillList); 

				}


			}, 1000);
			_Global.applyEvent("主角战斗控制初始化完成");
			let avatarData = _Global.YJ3D.YJPlayer.GetavatarData();
			if (avatarData) {
				_Global.applyEvent('主角头像', avatarData.id + "/thumb.png");
			}
			UpdateData();
		}
		Init();
		// update();

	}
}


export { YJPlayerFireCtrl };