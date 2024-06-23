

import * as THREE from 'three';
import { RandomInt } from '../utils/utils';
import { YJEquip } from './components/YJEquip';
import { YJPlayerProperty } from './components/YJPlayerProperty';
import { YJSkill } from './components/YJSkill';

// 战斗相关控制：
// 角色属性、战斗行为

class YJPlayerFireCtrl {
	constructor(_this, _YJPlayer) {
		let scope = this;


		let animName = "";
		let weaponData = null;
		this.GetWeaponType = function () {
			return weaponData;
		}
		let baseData = null;
		//玩家动作状态机
		var PLAYERSTATE = {
			NORMAL: -1,
			DEAD: 0,
			ATTACK: 1000, //已选中攻击目标，且正在施法，且未对目标造成伤害
			ATTACKING: 1001, //对目标造成伤害后，进入战斗状态
			INTERACTIVE: 2,
			SITTING: 3,
		};
		var playerState = PLAYERSTATE.NORMAL;

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
		this.OnPlayerState = function (state) {
			if (baseData == null) {
				baseData = _this.YJController.GetUserData().baseData;
				if (_YJPlayerProperty == null) {
					_YJPlayerProperty = new YJPlayerProperty(scope);
				}
				
				if (_YJSkill == null) {
					_YJSkill = new YJSkill(scope);
				}
			}
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
					baseData.health = baseData.maxHealth;
					baseData.shield = 0;
					baseData.energy = 0;
					baseData.debuffList = [];
					break;
				case "选中npc":
					SelectNPC(state.msg);
					break;
				case "受到伤害":
					let { _targetModel, skillName, effect } = state.msg;
					return scope.ReceiveDamage(_targetModel, skillName, effect);
					break;
				case "设置武器":
					weaponData = state.msg;
					break;
				case "攻击":
					state.canAttack = true;
					break;
				case "点击技能":
					let skillItem = state.msg;

					if (skillItem == undefined || skillItem == "普通攻击") {
						if (npcTransform == null) {
							_Global._SceneManager.FireState("我没有目标");
							return;
						}
						// 判断目标是否可攻击
						ReadyFire();
					} else {
						//判断目标是否可攻击
						vaildAttackDis = skillItem.vaildDis;
						if (!CheckCanAttack()) {
							return;
						}
						// 使用技能攻击
						UseSkill(skillItem);
					}
					break;
				default:
					break;
			}
		}

		this.playAudio = function (audio, audioName) {
			_Global.YJAudioManager().playAudio(audio, audioName);
		}
		this.SetNavPathToNone = function () {

		}
		//#region  玩家使用技能
		
		function UseSkill(skillItem) {
			state.inSkill = true;

			console.log("使用技能攻击 ", skillItem);
			let { animName, animNameReady, skillName, target, effect } = skillItem;
			effect.skillName = skillName;
			skillItem.effect.skillName = skillName;

			readyskillAudioName = skillName;
			scope.playAudio(skillItem.skillReadyAudio, readyskillAudioName);

			if (skillItem.castTime > 0) {
				// 需要施法的技能才发送技能同步，瞬发技能无需同步
				_Global.DyncManager.SendDataToServer("玩家技能",
					{ playerId: _YJPlayer.id, skill: skillItem });
				attackStepSpeed = skillItem.castTime;
				vaildAttackDis = skillItem.vaildDis;

				_Global.ReportTo3D("设置技能进度条", attackStepSpeed);

			}

			if (target.type == "target" || target.type == "random") {
				// 持续伤害
				if (effect.type == "contDamage") {
					let num = 0;
					let count = parseInt(attackStepSpeed / effect.time);

					for (let k = 0; k < count; k++) {
						setTimeout(() => {
							if (baseData.health <= 0) {
								state.inSkill = false;
								return;
							}
							// 目标攻击
							if (npcComponent == null || npcComponent.isDead) {
								state.inSkill = false;
								return;
							}
							SendDamageToTarget(npcComponent, effect);
							num++;
							if (num == count) {
								state.inSkill = false;
							}
						}, effect.time * k * 1000);
					}
					_this.YJController.SetPlayerAnimName(animName);
					return;
				}

				let fn = () => {

					fireParticleId = skillItem.skillFireParticleId;
					_Global.YJAudioManager().stopAudio(readyskillAudioName);
					//播放音效
					scope.playAudio(skillItem.skillFireAudio);

					_this.YJController.SetPlayerAnimName(animName);
					SendDamageToTarget(npcComponent, effect);
					setTimeout(() => {
						scope.SetPlayerState("normal");
					}, 500);
				}
				if (attackStepSpeed > 0) {
					_this.YJController.SetPlayerAnimName(animNameReady);
					vaildAttackLater = setTimeout(() => {
						fn();
					}, attackStepSpeed * 1000);
				} else {
					fn();
				}

				_this.YJController.PlayerLookatPos(npcTransform.GetWorldPos());

			}

			// 范围攻击
			if (target.type == "area") {
				let max = target.value;
				// 范围攻击。 max为1时，表示不使用范围攻击
				let npcs = _Global.DyncManager.GetNpcByPlayerForwardInArea(vaildAttackDis, max);
				console.log(" 玩家范围攻击 ", npcs);
				// 持续伤害
				if (effect.type == "contDamage") {
					let num = 0;
					let count = parseInt(attackStepSpeed / effect.time);
					for (let k = 0; k < count; k++) {
						setTimeout(() => {
							if (baseData.health <= 0) {
								state.inSkill = false;
								return;
							}
							// 范围攻击
							for (let i = 0; i < npcs.length; i++) {
								if (npcs[i] == null || npcs[i].isDead) {
									continue;
								}
								console.log(" 玩家范围攻击 持续攻击 ", npcs[i]);
								SendDamageToTarget(npcs[i], effect);
							}
							num++;
							if (num == count) {
								state.inSkill = false;
								scope.SetPlayerState("normal");
							}
						}, effect.time * k * 1000);
					}
					_this.YJController.SetPlayerAnimName(animName);
					return;
				}

				let fn = () => {
					_this.YJController.SetPlayerAnimName(animName);
					for (let i = 0; i < npcs.length; i++) {
						if (npcs[i] == null || npcs[i].isDead) {
							continue;
						}
						SendDamageToTarget(npcs[i], effect);
					}
					setTimeout(() => {
						scope.SetPlayerState("normal");
					}, 500);
				}
				if (attackStepSpeed > 0) {
					_this.YJController.SetPlayerAnimName(animNameReady);
					vaildAttackLater = setTimeout(() => {
						fn();
					}, attackStepSpeed * 1000);
				} else {
					fn();
				}

			}


			if (target.type == "none") {
				// 无需目标的法术表示，目标为自身 或 其他生活法术
				let fn = () => {
					_this.YJController.SetPlayerAnimName(animName);

					SendSkill(effect,skillItem);
					setTimeout(() => {
						scope.SetPlayerState("normal");
					}, 500);
				}
				if (attackStepSpeed > 0) {
					_this.YJController.SetPlayerAnimName(animNameReady);
					vaildAttackLater = setTimeout(() => {
						fn();
					}, attackStepSpeed * 1000);
				} else {
					fn();
				}
			}
		}

		let skillList = [];
		let oldSkillList = [];
		let hyperplasiaTimes = 0;
		let hyperplasiaTrans = [];
		this.GetData = function(){
			let avatarData = _YJPlayer.GetavatarData();

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
						avatarData: avatarData,
						baseData: baseData,
						weaponData: weaponData != null ? _this.YJController.GetUserDataItem("weaponDataData") : null,
					}
				}, //模型热点信息
				uuid: "",//在场景中的唯一标识
			};
			return modelData;
		}
		// 施放不需要目标的技能 如 增生
		function SendSkill(effect,skillItem) {
			let { type, skillName, value, time, duration, describe } = effect;
			//增生
			// if (type == "hyperplasia") {
			// 	hyperplasiaTimes++;
			// 	hyperplasia(modelData, 0, value, hyperplasiaTimes);
			// }
			// //进化
			// if (type == "evolution") {
			// 	oldSkillList = JSON.parse(JSON.stringify(skillList));

			// 	// 所有技能伤害增加v%
			// 	for (let i = 0; i < skillList.length; i++) {
			// 		const skillItem = skillList[i];
			// 		// 触发方式 每间隔n秒触发。在进入战斗时调用
			// 		if (skillItem.target.type != "none") {
			// 			skillItem.effect.value += skillItem.effect.value * value * 0.01;
			// 		}
			// 	}
			// }
			_YJSkill.SendSkill(effect,skillItem);
			// 发送战斗记录
			_Global.DyncManager.SendFireRecode(
				{
					playerId: _YJPlayer.id,
					playerName: _YJPlayer.GetNickName(),
					skillName: skillName,
					describe: describe
				});

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
					_Global.DyncManager.AddNpc(transform);
					let _npcComponent = transform.GetComponent("NPC");
					_npcComponent.id = playId;
					if (_YJPlayer.fireId != -1) {
						_npcComponent.fireId = _YJPlayer.fireId;
						_Global.DyncManager.AddFireGroup(playId, _YJPlayer.camp, _YJPlayer.fireId);
						_npcComponent.CheckNextTarget();
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



		function SendDamageToTarget(target, effect) {
			if (!state.inFire) {
				state.inFire = true;
			}
			EventHandler("进入战斗", target);
			let { type, skillName, value, time, duration } = effect;
			// console.log("effect ",attackProperty.CriticalHitRate,v,value,effect);
			effect.value = _YJPlayerProperty.GetDamage(value) ;
			shootTarget(target.transform, attackStepSpeed * 300, () => {
				_Global.DyncManager.SendSceneStateAll("玩家对NPC",
					{
						playerId: _YJPlayer.id,
						npcId: target.transform.id,
						skillName: skillName,
						effect: effect
					});
			});
		}
		function shootTarget(taget, time, callback) {
			_Global.DyncManager.shootTarget(GetShootingStartPosFn(), taget, time, "npc", fireParticleId, callback);
		}

		let firePosRef = new THREE.Group();
		this.GetShootingStartPos = function () {
			return GetShootingStartPosFn();
		}

		function GetShootingStartPosFn() {
			let pos = _this.YJController.GetPlayerWorldPos();
			let weaponModel = _YJPlayer.getWeaponModel();
			if (weaponModel) {
				var { _fire } = GetSkillDataByWeapon(weaponData);
				if (_fire.pos && _fire.pos.length == 3) {
					weaponModel.parent.add(firePosRef);
					firePosRef.position.copy(weaponModel.position);
					let pos1 = firePosRef.position.clone();
					pos1.x += _fire.pos[0] * 100;
					pos1.z += _fire.pos[1] * 100;
					pos1.y += _fire.pos[2] * 100;
					firePosRef.position.copy(pos1);
					pos = firePosRef.getWorldPosition(new THREE.Vector3());
				}
			}
			return pos;
		}

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

		let npcTransform = null;
		let npcPos = null;
		function PlayerAddFire() {
			if (_YJPlayer.fireId != -1) {
				return;
			}
			_Global.DyncManager.PlayerAddFire(npcTransform.GetComponent("NPC"), _YJPlayer);
		}

		function CheckHealth() {
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
		}
		function removeDebuffById(id) {
			for (let i = baseData.debuffList.length - 1; i >= 0; i--) {
				const item = baseData.debuffList[i];
				if (item.id == id) {
					baseData.debuffList.splice(i, 1);
				}
			}
		}

		this.ReceiveDamage = function (_targetModel, skillName, effect) {
			if (baseData.health <= 0) {
				return true;
			}

			if (npcTransform == null) {
				SelectNPC(_targetModel);
				ReadyFire(); //被攻击且没有目标时，自动攻击

				PlayerAddFire();
				//自动显示其头像 
				_Global._SceneManager.SetTargetModel(npcTransform);

				EventHandler("设置目标", npcComponent);

			}

			if (!state.inFire) {
				state.inFire = true;
			}
			EventHandler("进入战斗", _targetModel.GetComponent("NPC"));

			let { type, value, time, duration, describe, icon } = effect;
			// console.log(" 主角受到攻击 " ,effect);

			// 直接伤害 或 持续伤害
			if (type == "damage" || type == "contDamage") {
				baseData.health -= _YJPlayerProperty.RealyDamage(value);
			}
			// console.log(" 主角受到攻击后  baseData " ,baseData);

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
								baseData.health -= _YJPlayerProperty.RealyDamage(value);
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
			// console.log(" 主角受到 " + skillName + " 攻击 剩余 " + baseData.health);
			return CheckHealth();
		}

		// 生命值改变时，同步 
		function UpdateData() {
			_this.YJController.directUpate();
			if (baseData && baseData.maxHealth) {
				if(baseData.health>= baseData.maxHealth){
					baseData.health= baseData.maxHealth;
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
		this.SetInteractiveNPC = function (_npcTransform) {
			SelectNPC(_npcTransform);
			if (npcTransform == null) {
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
			ReadyFire();
		}
		function SelectNPC(_npcTransform) {
			npcTransform = _npcTransform;
			if (npcTransform != null) {
				npcComponent = npcTransform.GetComponent("NPC");
			}
		}
		function ReadyFire() {

			var { s, v, a } = GetSkillDataByWeapon(weaponData);
			skillName = s;
			vaildAttackDis = v;
			attackStepSpeed = a;
			//距离目标超过技能有效距离时，回到默认动作
			if (!CheckCanAttack()) {
				setTimeout(() => {
					playerState = PLAYERSTATE.NORMAL;
				}, 500);
			} else {
				if (npcTransform == null) {
					return;
				}

				if (toIdelLater != null) {
					clearTimeout(toIdelLater);
					toIdelLater = null;
				}
				// 右键点击目标后，使用基础技能攻击
				scope.SetPlayerState("准备战斗");

				if (npcTransform == null) {
					return;
				}
				// console.log(" 右键点击npc 准备战斗 ",state.canAttack);
				_this.YJController.PlayerLookatPos(npcTransform.GetWorldPos());
				playerState = PLAYERSTATE.ATTACK;
				state.canAttack = true;
				state.readyAttack = false;
			}
		}
		let vaildAttackLater = null;
		let vaildAttackLater2 = null;
		let attackStepSpeed = 3; //攻击间隔/攻击速度,由武器中的攻击速度控制 
		function getAttackSpeed() {
			_YJPlayer.GetAvatar().SetActionScale(1 + attackProperty.speedScale * 0.3);
			return attackStepSpeed / attackProperty.speedScale;
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
		this.GetCamp = function () {
			return _Global.user.camp;
		}
		this.GetIsPlayer = function () {
			return false;
		}
		let state = {
			canAttack:false,
			canMoveAttack:false,//是否支持移动中攻击
			isMoving:false,//是否正在移动
			inFire:false,//是否正在战斗状态
			readyAttack:false,
			inSkill:false,//是否正在施放技能
		}; 
		this.SetState = function(e,v){
			state[e] = v;
		}
		let npcComponent = null;
		// 是否有效攻击距离
		function inVaildArea(dis) {
			return dis < vaildAttackDis + npcTransform.GetData().scale.x;
		}
		function CheckCamp() {
			return npcComponent.GetCamp() != _Global.user.camp;
		}
		function CheckCanAttack() {
			if (!npcTransform) {
				_Global._SceneManager.FireState("我没有目标");
				return false;
			}
			//如果目标阵营不可攻击
			let b0 = CheckCamp();
			if (!b0) {
				_Global._SceneManager.FireState("不能攻击这个目标");
				state.canAttack = false;
				return false;
			}
			let playerPos = _this.YJController.GetPlayerWorldPos();
			playerPos.y += 1;
			npcPos = npcTransform.GetWorldPos();
			npcPos.y += 1;
			// 与目标之间有遮挡
			let b2 = CheckColliderBetween(npcPos, playerPos);
			if (b2) { _Global._SceneManager.FireState("无法攻击目标"); state.canAttack = false; return false; }
			// 不在攻击范围内
			let b = inVaildArea(playerPos.distanceTo(npcPos));
			if (!b) { _Global._SceneManager.FireState("太远了"); state.canAttack = false; return false; }
			return b && !b2;
		}
		let attackProperty = {};
		let _YJPlayerProperty = null;
		this.updateattackProperty = function (_attackProperty) {
			attackProperty = _attackProperty;
		}
		this.updateBasicProperty = function (_basicProperty) {
			if (_basicProperty == "health") { 
				UpdateData();
				return;
			}
		}
		this.updateByCard = function (card) {
			let { type, title, value,property } = card; 
			if (type == "skill") { 
				_YJSkill.AddSkill(card);
				return;
			}
			_YJPlayerProperty.updateBasedata(card);
			console.log(attackProperty);
		}
		this.GetTarget = function(){
			return npcTransform;
		}
		function fireGo() {
			// console.log(" 有效攻击目标 "); 
			var { s, v, a } = GetSkillDataByWeapon(weaponData);
			//有效攻击
			SendDamageToTarget(npcComponent, { skillName: s, type: "damage", value: baseData.strength });
			// 范围攻击
			if (attackProperty.targetMax > 1) {
				let npcs = _Global.DyncManager.GetNpcByPlayerForwardInFireId(_YJPlayer.fireId, _YJPlayer.camp, vaildAttackDis, attackProperty.targetMax - 1, npcTransform.id);
				console.log(attackProperty.targetMax, npcs);
				for (let i = 0; i < npcs.length; i++) {
					SendDamageToTarget(npcs[i], { skillName: s, type: "damage", value: baseData.strength });
				}
			}
		}
		function CheckState() {
			if (playerState == PLAYERSTATE.ATTACK) {

			}
			if (playerState == PLAYERSTATE.ATTACK || playerState == PLAYERSTATE.ATTACKING) {
				if (npcTransform == null) {
					return;
				}

				if (_YJPlayer.isDead) {
					return;
				}
				// console.log("距离目标", dis);
				if (state.canAttack && CheckCanAttack()) {
					// 如果准备好攻击，则立即攻击
					if (state.readyAttack) {
						state.readyAttack = false;

						if (!state.inFire) {
							EventHandler("进入战斗");
						}
						state.inFire = true;
						playerState = PLAYERSTATE.ATTACK;

						// 动作时长的前3/10段时，表示动作执行完成，切换成准备动作
						if (toIdelLater == null) {
							toIdelLater = setTimeout(() => {
								scope.SetPlayerState("准备战斗");
								toIdelLater = null;
							}, attackStepSpeed * 500);
						}

						if (npcTransform == null) {
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
				if (state.inSkill) {
					_Global.ReportTo3D("设置技能进度条", "中断");
					_Global.YJAudioManager().stopAudio(readyskillAudioName);
					state.inSkill = false;
				}
				if (toIdelLater != null) {
					clearTimeout(toIdelLater);
					toIdelLater = null;
				}

			}
			if (e == "进入战斗" || e == "设置目标") {

				if (hyperplasiaTrans.length > 0) {
					for (let i = 0; i < hyperplasiaTrans.length; i++) {
						_Global.DyncManager.AddFireGroup(hyperplasiaTrans[i].id, _YJPlayer.camp, _YJPlayer.fireId);
						hyperplasiaTrans[i].fireId = _YJPlayer.fireId;
						hyperplasiaTrans[i].SetNpcTarget(msg ? msg : npcComponent);
					}
				}
			}
			if (e == "添加镜像") {
				let mirrorId = msg;
				let npcTransform = _Global.DyncManager.GetNpcById(mirrorId);
				let npcComponent = npcTransform.GetComponent("NPC");
				npcComponent.setOwnerPlayer(_YJPlayer);
				hyperplasiaTrans.push(npcComponent);
			}
			if (e == "删除镜像") {
				let mirrorId = msg;
				for (let i = hyperplasiaTrans.length - 1; i >= 0; i--) {
					const element = hyperplasiaTrans[i];
					if (element.id == mirrorId) {
						hyperplasiaTrans.splice(i, 1);
					}
				}

			}
		}
		this.AddExp = function (v) {

		}
		this.TargetDead = function () {

		}
		function CheckTargetDead() {

			if (npcComponent && npcComponent.isDead) {
				npcTransform = null;
				_Global._SceneManager.SetTargetModel(npcTransform);
				playerState = PLAYERSTATE.NORMAL;
				if (toIdelLater != null) {
					clearTimeout(toIdelLater);
					toIdelLater = null;
				}
				scope.SetPlayerState("战斗结束");
				return;
			}
		}

		this.SetPlayerState = function (e) {
			// if (weaponData == null) {
			// }
			weaponData = _this.YJController.GetUserData().weaponData;

			// console.log(" in SetPlayerState  ",e,weaponData,playerState);

			switch (e) {
				case "普通攻击":
					playerState = PLAYERSTATE.ATTACK;
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
					_Global.ReportTo3D("设置技能进度条", "完成");
					CheckTargetDead();

					if (state.canMoveAttack && state.isMoving && _Global.YJ3D.YJPlayer.GetAvatar().layerBlendPerbone(animName, "run", false, true)) {
						return;
					}
					break;
				case "赤手攻击":
					playerState = PLAYERSTATE.ATTACK;
					GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "准备战斗":
					playerState = PLAYERSTATE.ATTACK;
					var { s, v, a, rpid, raid } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					//播放音效
					scope.playAudio(raid);
					GetAnimNameByPlayStateAndWeapon(e, weaponData);

					_Global.ReportTo3D("设置技能进度条", getAttackSpeed());

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
					playerState = PLAYERSTATE.ATTACK;
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
					_Global.ReportTo3D("角色死亡");
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
						if(_Global.YJ3D.YJPlayer.GetAvatar().layerBlendPerbone(animName, "run", false, true)){
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
					if (playerState == PLAYERSTATE.ATTACK) {
						if (state.canMoveAttack) {
							GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
						}
						if (!state.canAttack) {
							GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
							if (npcTransform != null) {
								ReadyFire(); //有目标停止移动时，自动攻击
							}
						}
					}
					console.log(e, playerState, state.canAttack);
					break;
				case "战斗结束":
					if (playerState == PLAYERSTATE.NORMAL) {
						GetAnimNameByPlayStateAndWeapon(e, weaponData);
					}
					if (state.isMoving) {
						return;
					}
					break;

				case "attack":
					break;
				case "interactive":
					break;
				default:
					break;
			}
			// console.log(" 玩家动作 ",weaponData, e,animName);

			// console.log(" 玩家动作 ", state.canAttack, e, animName);
			_this.YJController.SetPlayerAnimName(animName, animNameFullback);
		}
		this.ChangeAnim = function (v, vb) {
			_this.YJController.SetPlayerAnimName(v, vb);
		}
		this.SetValue = function (v, vb) {

		}
		var updateId = null;
		function update() {
			updateId = requestAnimationFrame(update);
			if (_Global.pauseGame) {
				return;
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
		this.GetEquip = function(){
			return _YJEquip;
		}
		this.GetSkill = function(){
			return _YJSkill;
		}
		function Init() {
			
			if (_YJEquip == null) {
				_YJEquip = new YJEquip(scope);
			}
			
			UpdateData();
		}
		Init();
		update();

	}
}


export { YJPlayerFireCtrl };