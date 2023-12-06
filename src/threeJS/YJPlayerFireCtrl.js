

import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


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
				case "设置npc":
					scope.SetInteractiveNPC(state.msg);
					break;
				case "重生":
					if (playerState == PLAYERSTATE.DEAD) {
						playerState = PLAYERSTATE.NORMAL;
						baseData.health = baseData.maxHealth;
					}
					scope.SetPlayerState("normal");

					break;
				case "选中npc":
					SelectNPC(state.msg);
					break;
				case "受到伤害":
					let { _targetModel, skillName, strength } = state.msg;
					return scope.ReceiveDamage(_targetModel, skillName, strength);
					break;
				case "受到伤害Dync":
					let msg = state.msg;
					return scope.ReceiveDamageDync(msg.npcName, msg.skillName, msg.strength);
					break;

				case "设置武器":
					weaponData = state.msg;
					// var {v} = GetSkillDataByWeapon(weaponData);
					// vaildAttackDis = v;
					break;
				case "攻击":
					canAttack = true;
					break;
				case "点击技能":
					if (npcTransform == null) {
						_Global.SceneManager.FireState("我没有目标");
						return;
					}
					//判断目标是否可攻击
					ReadyFire();
					break;
				default:
					break;
			}
		}
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
		this.ReceiveDamageDync = function (npcName, skillName, strength) {

			baseData.health -= RealyDamage(strength);
			console.log(" 主角受到 " + npcName + " " + skillName + " 攻击 剩余 " + baseData.health);

			if (baseData.health <= 0) {
				baseData.health = 0;
			}
			UpdateData();
			if (baseData.health == 0) {
				baseData.health = 0;
				playerState = PLAYERSTATE.DEAD
				scope.SetPlayerState("death");

				if (vaildAttackLater != null) {
					clearTimeout(vaildAttackLater);
					clearTimeout(vaildAttackLater2);
					vaildAttackLater = null;
				}
				return true;
			}
			return false;

		}
		this.ReceiveDamage = function (_targetModel, skillName, strength) {
			if (npcTransform == null) {
				SelectNPC(_targetModel);
				PlayerAddFire();
				//自动显示其头像 
				_Global.SceneManager.SetTargetModel(npcTransform);
			}

			baseData.health -= RealyDamage(strength);
			// console.log(" 主角受到 " + skillName + " 攻击 剩余 " + baseData.health);


			if (baseData.health <= 0) {
				baseData.health = 0;
			}

			UpdateData();
			if (baseData.health == 0) {
				baseData.health = 0;
				playerState = PLAYERSTATE.DEAD
				scope.SetPlayerState("death");

				if (vaildAttackLater != null) {
					clearTimeout(vaildAttackLater);
					clearTimeout(vaildAttackLater2);
					vaildAttackLater = null;
				}
				return true;
			}

			return;

			inBlocking = true;
			scope.SetPlayerState("受伤");

			if (playerState == PLAYERSTATE.NORMAL) {
				playerState = PLAYERSTATE.ATTACK;
			}

			toIdelLater = setTimeout(() => {
				scope.SetPlayerState("准备战斗");
				toIdelLater = null;
			}, 300);
			return false;
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
					clearTimeout(vaildAttackLater2);
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
			_Global.DyncManager.shootTarget(_this.YJController.GetPlayerWorldPos(), taget, time);
		}
		let inBlocking = false;
		let vaildAttackLater = null;
		let vaildAttackLater2 = null;
		let attackStepSpeed = 3; //攻击间隔/攻击速度
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
			//如果目标阵营不可攻击
			let b0 = CheckCamp();
			if (!b0) {
				_Global.SceneManager.FireState("不能攻击这个目标");
				return false;
			}
			let playerPos = _this.YJController.GetPlayerWorldPos();
			playerPos.y = 1;
			npcPos = npcTransform.GetWorldPos();
			npcPos.y = 1;
			// 与目标之间有遮挡
			let b2 = CheckColliderBetween(npcPos, playerPos);
			if (b2) { _Global.SceneManager.FireState("无法攻击目标"); return false; }
			// 不在攻击范围内
			let b = inVaildArea(playerPos.distanceTo(npcPos));
			if (!b) { _Global.SceneManager.FireState("太远了"); return false; }
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
					// if (!inBlocking) {
					// 	// _player.lookAt(npcPos);
					// 	// _player.add(new THREE.AxesHelper(2));
					// 	//攻击 
					// 	scope.SetPlayerState("普通攻击");
					// 	inBlocking = true;
					// }
					// 如果准备好攻击，则立即攻击
					if (readyAttack) {
						readyAttack = false;
						inFire = true;
						playerState = PLAYERSTATE.ATTACK;
						// 立即执行攻击动作
						scope.SetPlayerState("普通攻击");

						//射出去的子弹特效
						shootTarget(npcTransform, attackStepSpeed * 300);


						let max = 1;
						if(baseData.energy>=30){
							max = 3;
							baseData.energy -= 30; 
						}
						// 范围攻击。 max为1时，表示不使用范围攻击
						let npcs = _Global.DyncManager.GetPlayerForwardNPCInFireId(_YJPlayer.fireId,vaildAttackDis,max,npcTransform.id);
						for (let i = 0; i < npcs.length; i++) {
							shootTarget(npcs[i].transform, attackStepSpeed * 300);
						}

						// 动作时长的前1/10段时，执行伤害
						vaildAttackLater2 = setTimeout(() => {
							// console.log(" 有效攻击目标 ");
							//有效攻击
							let health = npcComponent.ReceiveDamage(_YJPlayer, skillName, baseData.strength);
							
							// 范围攻击
							for (let i = 0; i < npcs.length; i++) {
								npcs[i].ReceiveDamage(_YJPlayer, skillName, baseData.strength);
							}

							PlayerAddFire();

							if (health == 0) {
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
						}, attackStepSpeed * 300);

						// 动作时长的前3/10段时，表示动作执行完成，切换成准备动作
						if (toIdelLater == null) {
							toIdelLater = setTimeout(() => {
								scope.SetPlayerState("准备战斗");
								toIdelLater = null;
							}, attackStepSpeed * 500);
						}

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
		function EventHandler(e) {
			if (e == "中断技能") {
				if (vaildAttackLater2 != null) {
					clearTimeout(vaildAttackLater2);
					vaildAttackLater2 = null;
				}
				if (vaildAttackLater != null) {
					clearTimeout(vaildAttackLater);
					vaildAttackLater = null;
					_Global.ReportTo3D("设置技能进度条", "中断");
				}
			}
		}

		this.SetPlayerState = function (e) {
			if (weaponData == null) {
				weaponData = _this.YJController.GetUserData().weaponData;
			}
			// console.log(" in SetPlayerState  ",e,weaponData,playerState);

			switch (e) {
				case "普通攻击":
					playerState = PLAYERSTATE.ATTACK;
					var { s, v, a } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					_Global.ReportTo3D("设置技能进度条", "完成");

					break;
				case "赤手攻击":
					playerState = PLAYERSTATE.ATTACK;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "准备战斗":
					playerState = PLAYERSTATE.ATTACK;
					var { s, v, a } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					_Global.ReportTo3D("设置技能进度条", attackStepSpeed);

					if (vaildAttackLater == null) {
						// 技能施放时间到时，重新立即攻击
						vaildAttackLater = setTimeout(() => {
							readyAttack = true;
							inBlocking = false;
							vaildAttackLater = null;
						}, attackStepSpeed * 1000);
					}

					break;
				case "受伤":
					playerState = PLAYERSTATE.ATTACK;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					break;
				case "death":
					playerState = PLAYERSTATE.DEAD;
					animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					EventHandler("中断技能");
					
					_Global.DyncManager.RemovePlayerFireId(_YJPlayer);

					//角色不可控制、显示倒计时
					_this.YJController.SetCanMoving(false);
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
						}
					}
					break;
				case "战斗结束":
					if (playerState == PLAYERSTATE.NORMAL) {
						animName = GetAnimNameByPlayStateAndWeapon(e, weaponData);
					}

					break;

				case "attack":
					// playerState = PLAYERSTATE.ATTACK;
					// if (type == undefined) {
					// 	animName = "attack";
					// } else if (type == "胡萝卜") {
					// 	animName = "throw";
					// } else if (type == "南瓜") {
					// 	animName = "throw2";
					// }
					// setTimeout(() => {
					// 	playerState = PLAYERSTATE.NORMAL;
					// }, 2000);
					break;
				case "interactive":
					// playerState = PLAYERSTATE.INTERACTIVE;
					// if (type == "地上拾取") {
					// 	animName = "collection";
					// 	setTimeout(() => {
					// 		playerState = PLAYERSTATE.NORMAL;
					// 	}, 2000);
					// }
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