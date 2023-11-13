

import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


// 角色战斗控制

class YJPlayerFireCtrl {
	constructor(_this, _YJPlayer) {
		let scope = this;
		let animName = "";
		let weaponData = null;
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

		this.DyncPlayerState = function (state) {
			switch (state.content) {
				case "设置玩家状态":
					scope.SetPlayerState(state.msg);
					break;
				case "设置npc":
					scope.SetInteractiveNPC(state.msg);
					break;
				case "受到伤害":
					let { _targetModel, skillName, strength } = state.msg;
					return scope.ReceiveDamage(_targetModel, skillName, strength);
					break;
				case "设置武器":
					weaponData = state.msg;
					break;
				case "攻击":
					canAttack = true;
					break;
 
				default:
					break;
			}
		}


		let baseData = {
			camp: "lm",
			speed: 8, //移动速度
			level: 1, //等级
			health: 500, //生命值
			strength: 20, //攻击力
		}

		let npcTransform = null;
		let npcPos = null;
		this.ReceiveDamage = function (_targetModel, skillName, strength) {
			if (npcTransform == null) {
				npcTransform = _targetModel;
				console.log("targetModel 角色目标 ", npcTransform);
				//自动显示其头像
				_Global.ReportTo3D("锁定目标", npcTransform);
			}

			baseData.health -= strength;
			console.log(" 主角受到 " + skillName + " 攻击 剩余 " + baseData.health);

			if (toIdelLater != null) {
				clearTimeout(toIdelLater);
				toIdelLater = null;
			}

			if (baseData.health <= 0) {
				baseData.health = 0;
				playerState = PLAYERSTATE.DEAD
				scope.SetPlayerState("death");
				return true;
			}

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

		this.SetInteractiveNPC = function (_npcTransform) {
			npcTransform = _npcTransform;
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
			// 右键点击目标后，使用基础技能攻击
			scope.SetPlayerState("准备战斗");
			canAttack = true;
			_this.YJController.PlayerLookatPos(npcTransform.GetWorldPos());
		}

		let inBlocking = false;
		let vaildAttackLater = null;
		let attackStepSpeed = 3; //攻击间隔/攻击速度
		let toIdelLater = null;
		let skillName = "";
		let vaildAttackDis = 3; //有效攻击距离
		let canAttack = false;
		let inFire = false; //是否正在战斗状态
		function CheckState() {
			if (playerState == PLAYERSTATE.ATTACK) {

			}
			if (playerState == PLAYERSTATE.ATTACK || playerState == PLAYERSTATE.ATTACKING) {
				if (npcTransform == null) {
					// scope.SetPlayerState("idle");
					return;
				}
				let playerPos = _this.YJController.GetPlayerWorldPos();
				playerPos.y = 1;
				npcPos = npcTransform.GetWorldPos();
				npcPos.y = 1;
				let dis = playerPos.distanceTo(npcPos);


				// console.log("距离目标", dis);
				if (canAttack && dis < vaildAttackDis && !CheckColliderBetween(npcPos, playerPos)) {
					if (!inBlocking) {
						inFire = true;
						playerState = PLAYERSTATE.ATTACK;

						// _player.lookAt(npcPos);
						// _player.add(new THREE.AxesHelper(2));
						//攻击 
						scope.SetPlayerState("普通攻击");
						inBlocking = true;
						if (toIdelLater != null) {
							clearTimeout(toIdelLater);
							toIdelLater = null;
						}

						setTimeout(() => {
							console.log(" 有效攻击目标 ");
							//有效攻击
							let isDead = npcTransform.GetComponent("NPC").ReceiveDamage(_YJPlayer, skillName, baseData.strength);
							if (isDead) {
								npcTransform = null;
								playerState = PLAYERSTATE.NORMAL;
								if (toIdelLater != null) {
									clearTimeout(toIdelLater);
									toIdelLater = null;
								}
								scope.SetPlayerState("战斗结束");
								return;
							}
						}, attackStepSpeed * 100);


						toIdelLater = setTimeout(() => {
							scope.SetPlayerState("准备战斗");
							toIdelLater = null;
						}, attackStepSpeed * 300);
					}

					if (vaildAttackLater == null) {
						vaildAttackLater = setTimeout(() => {
							inBlocking = false;
							vaildAttackLater = null;
						}, attackStepSpeed * 1000);
					}
				} else {
					if (vaildAttackLater != null) {
						clearTimeout(vaildAttackLater);
						vaildAttackLater = null;
					}
					// scope.SetPlayerState("准备战斗");
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

		function GetAnimNameByPlayStateAndWeapon(e,weaponData){
			return _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon(e,weaponData);
		}
		function GetSkillDataByWeapon(weaponData) {
		  return _Global.CreateOrLoadPlayerAnimData().GetSkillDataByWeapon(weaponData);
		}
		this.SetPlayerState = function (e) {
			// console.log(" in SetPlayerState  ",e,type);
			weaponData = _this.YJController.GetUserData().weaponData;

			switch (e) {
				case "普通攻击":
					playerState = PLAYERSTATE.ATTACK;
					var { s, v, a } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);

					break;
				case "赤手攻击":
					playerState = PLAYERSTATE.ATTACK; 
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
					break;
				case "准备战斗": 
					playerState = PLAYERSTATE.ATTACK; 
					var { s, v, a } = GetSkillDataByWeapon(weaponData);
					skillName = s;
					vaildAttackDis = v;
					attackStepSpeed = a;
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);

					break;
				case "受伤":
					playerState = PLAYERSTATE.ATTACK; 
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
					break;
				case "death":
					playerState = PLAYERSTATE.DEAD; 
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
					break;
				case "sitting":
					playerState = PLAYERSTATE.SITTING; 
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
					break;
				case "normal":
					playerState = PLAYERSTATE.NORMAL; 
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
					break;
				case "跳跃": 
					canAttack = false;
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);

					break;
				case "移动": 
					canAttack = false; 
					animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);

					if (playerState == PLAYERSTATE.DEAD) { 
						playerState = PLAYERSTATE.NORMAL;
						baseData.health = 500;
					}
					break;
				case "停止移动":
					if (playerState == PLAYERSTATE.NORMAL) {
						animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
					}
					if (playerState == PLAYERSTATE.ATTACK) {
						if(!canAttack){ 
							animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
						}
					}
					break;
				case "战斗结束":
					if (playerState == PLAYERSTATE.NORMAL) { 
						animName = GetAnimNameByPlayStateAndWeapon(e,weaponData);
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

			// console.log(" 玩家动作 ",canAttack, e,animName); 
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
		// Init();
		update();

	}
}


export { YJPlayerFireCtrl };