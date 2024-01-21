

import * as THREE from 'three';

// 战斗相关控制：
// 角色属性、战斗行为

class YJPlayerFireCtrl {
	constructor(_this, _YJPlayer) {
		let scope = this;


		let animName = "";
		let weaponData = null;
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

		this.OnPlayerState = function (state) {
			if (baseData == null) {
				baseData = _this.YJController.GetUserData().baseData;
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
					inFire = false;
					console.log(" 玩家脱离战斗 ");
					break;
				case "玩家加入战斗":
					inFire = true;
					EventHandler("进入战斗");
					console.log(" 玩家加入战斗 ");
					break;
				case "设置npc":
					scope.SetInteractiveNPC(state.msg);
					break;
				case "重生":
					this.SetPlayerState("normal");
					baseData.health = baseData.maxHealth;
					baseData.armor = 0;
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
					canAttack = true;
					break;
				case "点击技能":
					let effect2 = state.msg;
					if (effect2 == undefined || effect2 == "普通攻击") {
						if (npcTransform == null) {
							_Global.SceneManager.FireState("我没有目标");
							return;
						}
						// 判断目标是否可攻击
						ReadyFire();
					} else {
						// 使用技能攻击
						UseSkill(effect2);
					}
					break;
				default:
					break;
			}
		}

		//#region  玩家使用技能
		let inSkill = false;
		function UseSkill(skillItem) {
			inSkill = true;

			// console.log("使用技能攻击 ", skillItem);
			let { animName, animNameReady, skillName, target, effect } = skillItem;
			effect.skillName = skillName;
			skillItem.effect.skillName = skillName;

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
								inSkill = false;
								return;
							}
							// 目标攻击
							if (npcComponent == null || npcComponent.isDead) {
								inSkill = false;
								return;
							}
							SendDamageToTarget(npcComponent, effect);
							num++;
							if (num == count) {
								inSkill = false;
							}
						}, effect.time * k * 1000);
					}
					_this.YJController.SetPlayerAnimName(animName);
					return;
				}

				let fn = () => {
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
								inSkill = false;
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
								inSkill = false;
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

					SendSkill(effect);
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
		// 施放不需要目标的技能 如 增生
		function SendSkill(effect) {
			let { type, skillName, value, time, duration, describe } = effect;
			//增生
			if (type == "hyperplasia") {
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
			if (!inFire) {
				inFire = true;
			}
			EventHandler("进入战斗", target);
			let { type, skillName, value, time, duration } = effect;
			shootTarget(target.transform, attackStepSpeed * 300);
			_Global.DyncManager.SendSceneStateAll("玩家对NPC",
				{
					playerId: _YJPlayer.id,
					npcId: target.transform.id,
					skillName: skillName,
					effect: effect
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
		// 计算伤害。受到的攻击力-护甲值
		function RealyDamage(strength) {
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
				_Global.SceneManager.SetTargetModel(npcTransform);

				EventHandler("设置目标", npcComponent);

			}

			if (!inFire) {
				inFire = true;
			}
			EventHandler("进入战斗", _targetModel.GetComponent("NPC"));

			let { type, value, time, duration, describe, icon } = effect;

			// 直接伤害 或 持续伤害
			if (type == "damage" || type == "contDamage") {
				baseData.health -= RealyDamage(value);
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
								baseData.health -= RealyDamage(value);
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
			// _this.YJController.updateBaseData(baseData);

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
				scope.SetPlayerState("停止移动");
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
					scope.SetPlayerState("停止移动");
				}, 500);
			} else {
				if (npcTransform == null) {
					return;
				}
				// 右键点击目标后，使用基础技能攻击
				scope.SetPlayerState("准备战斗");
				// console.log(" 右键点击npc 准备战斗 ",canAttack);
				_this.YJController.PlayerLookatPos(npcTransform.GetWorldPos());
				playerState = PLAYERSTATE.ATTACK;
				canAttack = true;
				readyAttack = false;
			}
		}

		function shootTarget(taget, time) {
			_Global.DyncManager.shootTarget(_this.YJController.GetPlayerWorldPos(), taget, time, "npc",fireParticleId);
		}
		let vaildAttackLater = null;
		let vaildAttackLater2 = null;
		let attackStepSpeed = 3; //攻击间隔/攻击速度
		let fireParticleId = ''; //攻击特效id 
		
		let toIdelLater = null;
		let skillName = "";
		let vaildAttackDis = 3; //有效攻击距离
		let canAttack = false;
		let inFire = false; //是否正在战斗状态
		let readyAttack = false;
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
				return false;
			}
			//如果目标阵营不可攻击
			let b0 = CheckCamp();
			if (!b0) {
				_Global.SceneManager.FireState("不能攻击这个目标");
				canAttack = false;
				return false;
			}
			let playerPos = _this.YJController.GetPlayerWorldPos();
			playerPos.y = 1;
			npcPos = npcTransform.GetWorldPos();
			npcPos.y = 1;
			// 与目标之间有遮挡
			let b2 = CheckColliderBetween(npcPos, playerPos);
			if (b2) { _Global.SceneManager.FireState("无法攻击目标"); canAttack = false; return false; }
			// 不在攻击范围内
			let b = inVaildArea(playerPos.distanceTo(npcPos));
			if (!b) { _Global.SceneManager.FireState("太远了"); canAttack = false; return false; }
			return b && !b2;
		}
		function CheckState() {
			if (playerState == PLAYERSTATE.ATTACK) {

			}
			if (playerState == PLAYERSTATE.ATTACK || playerState == PLAYERSTATE.ATTACKING) {
				if (npcTransform == null) {
					return;
				}

				// console.log("距离目标", dis);
				if (canAttack && CheckCanAttack()) {
					// 如果准备好攻击，则立即攻击
					if (readyAttack) {
						readyAttack = false;
						if (!inFire) {
							EventHandler("进入战斗");
						}
						inFire = true;
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

						let max = 1;
						if (baseData.energy >= 30) {
							max = 8;
							baseData.energy -= 30;
						}
						// 范围攻击。 max为1时，表示不使用范围攻击
						let npcs = _Global.DyncManager.GetNpcByPlayerForwardInFireId(_YJPlayer.fireId, _YJPlayer.camp, vaildAttackDis, max, npcTransform.id);

						// 动作时长的前1/10段时，执行伤害
						vaildAttackLater2 = setTimeout(() => {
							// console.log(" 有效攻击目标 "); 
							var { s, v, a } = GetSkillDataByWeapon(weaponData);
							//有效攻击
							SendDamageToTarget(npcComponent, { skillName: s, type: "damage", value: baseData.strength });
							// 范围攻击
							for (let i = 0; i < npcs.length; i++) {
								SendDamageToTarget(npcs[i], { skillName: s, type: "damage", value: baseData.strength });
							}
							PlayerAddFire();
						}, attackStepSpeed * 300);


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

		function GetAnimNameByPlayStateAndWeapon(e, weaponData) {
			return _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon(e, weaponData);
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
				if (inSkill) {
					_Global.ReportTo3D("设置技能进度条", "中断");
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

		function CheckTargetDead() {

			if (npcComponent.isDead) {
				npcTransform = null;
				_Global.SceneManager.SetTargetModel(npcTransform);
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
					var { s, v, a, fpid,faid } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					fireParticleId = fpid; 
					//播放音效
					_Global.YJAudioManager().playAudio(faid);
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					_Global.ReportTo3D("设置技能进度条", "完成");
					CheckTargetDead();
					break;
				case "赤手攻击":
					playerState = PLAYERSTATE.ATTACK;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "准备战斗":
					playerState = PLAYERSTATE.ATTACK;
					var { s, v, a, rpid,raid } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					//播放音效
					_Global.YJAudioManager().playAudio(raid);
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					_Global.ReportTo3D("设置技能进度条", attackStepSpeed);

					if (vaildAttackLater == null) {
						// 技能施放时间到时，重新立即攻击
						vaildAttackLater = setTimeout(() => {
							readyAttack = true;
							vaildAttackLater = null;
						}, attackStepSpeed * 1000);
					}
					CheckTargetDead();
					break;
				case "受伤":
					playerState = PLAYERSTATE.ATTACK;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "death":
					playerState = PLAYERSTATE.DEAD;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
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
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "normal":
					playerState = PLAYERSTATE.NORMAL;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "跳跃":
					canAttack = false;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					EventHandler("中断技能");

					break;
				case "取消跳跃":
					animName = GetAnimNameByPlayStateAndWeapon("停止移动", weaponData);
					break;
				case "移动":
					canAttack = false;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);

					EventHandler("中断技能");

					break;
				case "停止移动":
					if (playerState == PLAYERSTATE.NORMAL) {
						animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					}
					if (playerState == PLAYERSTATE.ATTACK) {
						if (!canAttack) {
							animName = GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
							if (npcTransform != null) {
								ReadyFire(); //有目标停止移动时，自动攻击
							}
						}
					}
					break;
				case "战斗结束":
					if (playerState == PLAYERSTATE.NORMAL) {
						animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
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

			// console.log(" 玩家动作 ", canAttack, e, animName);
			_this.YJController.SetPlayerAnimName(animName);
		}
		var updateId = null;
		function update() {
			updateId = requestAnimationFrame(update);
			// 检测状态 战斗逻辑 
			CheckState();
		}
		//#region 
		//#endregion

		// if("" || 0){
		// 	console.log(" in YJPlayerFireCtrl ");
		// }
		function Init() {
			UpdateData();
		}
		Init();
		update();

	}
}


export { YJPlayerFireCtrl };