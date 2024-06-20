

import * as THREE from 'three';
import { RandomInt } from '../../utils/utils';
import { YJSkill } from './YJSkill';

// 角色属性值判定、状态判定
// 药水增益效果

class YJPlayerProperty {
	constructor(owner) {
		let scope = this;
		let baseData = {
			health: 0, //当前生命值
			maxHealth: 0, //当前生命最大值
			addHealth: 0, //额外提升生命最大值

			armor: 0, //护甲
			energy: 0, //能量
			agile: 10, //敏捷 提升攻击速度和闪避
			strength: 20,//力量 提升武器伤害和基础伤害
			intelligence: 0,//智力 提高法术伤害
			spirit: 0,//精神 提高恢复率

			shield: 0, //护盾

			debuffList: [],//buff列表
		};
		let equip = {

		}
		let attackProperty = { 
			speedScale: 1, //急速等级/攻击速度百分比
			moveSpeedScale: 1, //移动速度百分比
			CriticalHitRate: 0.1,//暴击率百分比
			CriticalHit: 1.5,//暴击伤害百分比
			armorRate: 0,//物理防御力百分比
			CDRate: 1,//技能冷却时长百分比
		}
		// 计算输出的伤害。基础伤害+暴击+额外伤害
		this.GetDamage = function (value) {
			// 判断是否触发暴击
			let v = RandomInt(1, 100);
			if (attackProperty.CriticalHitRate > v / 100) {
				value += parseInt(value * attackProperty.CriticalHit );
			}
 			return value;
		}
		// 计算受到的伤害。受到的攻击力-护甲值
		this.RealyDamage = function (strength) {
			// let v = 0;
			// 有护盾，先使用护盾减伤
			if (baseData.shield > 0) {
				if (baseData.shield >= strength) {
					baseData.shield -= strength;
					return 0;
				} else {
					strength -= baseData.shield;
					owner.applyEvent("技能护甲归零");
				}
			}

			// 攻击力*物理防御  
			strength *= (1 - baseData.armorRate);

			// 最低造成1点伤害
			if (strength <= 1) {
				strength = 1;
			}
			// if (baseData.shield >= strength) {
			// 	baseData.shield -= strength;
			// 	return 0;
			// } else {
			// 	// 至少会受到1点伤害
			// 	v = strength - baseData.armor;
			// 	baseData.armor = 0;
			// 	scope.applyEvent("技能护甲归零");
			// 	v = v > 0 ? v : 1;
			// }
			return strength;
		}
		let _YJSkill = null;
		function Init() {
			// if (_YJSkill == null) {
			// 	_YJSkill = new YJSkill(owner);
			// }
			baseData = owner.GetBaseData();
			baseData.armorRate = baseData.armor*0.1; 
			owner.updateattackProperty(attackProperty);
		}
		this.updateBasedata = function (card) {
			let { type, title, value, property } = card;

			// if (type == "skill") { 
			// 	_YJSkill.AddSkill(card);
			// 	return;
			// }
			if (type == "attackProperty") {
				attackProperty[property] += value / 100;
			}

			if (type == "basicProperty") {
				baseData[property] += value;
				owner.updateBasicProperty(property);
				return;
			}

			if (property == "moveSpeedScale") {
				_Global.YJ3D.YJController.addMoveSpeed(attackProperty.moveSpeedScale);
			}
			if (property == "CDRate") {
				owner.GetSkill().SetSkillCDRate(attackProperty[property]);
			}
			owner.updateattackProperty(attackProperty);
		}

		var updateId = null;
		function update() {
			updateId = requestAnimationFrame(update);
			if (_Global.pauseGame) {
				return;
			}
		}
		//#region 
		//#endregion 
		Init();
		// update();

	}
}


export { YJPlayerProperty };