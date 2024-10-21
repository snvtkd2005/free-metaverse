

import * as THREE from 'three';
import { RandomInt } from '../../utils/utils';
import { YJSkill } from './YJSkill';

// 角色属性值判定、状态判定
// 药水增益效果

class YJPlayerProperty {
	constructor(owner) {
		let scope = this;
		let baseData = {
			level: 1,//等级
			camp: '1000',//阵营
			health: 0, //当前生命值
			baseHealth: 0, //基础生命值
			maxHealth: 0, //当前生命最大值。基础生命值+额外生命值
			addHealth: 0, //额外提升生命最大值
			state: 'normal', //状态
			speed: 8, //移动速度
			fireId: -1, //战斗组id  -1表示未在战斗中
			gold: 0, //金钱
			buffList: [],//buff列表
			debuffList: [],//debuff列表
			basicProperty: {},
		};
		let equipData = {
			armor:0,//装备护甲,
			intelligence: 0,//智力 提高法术伤害
			endurance: 0,//耐力 提高最大生命值
			agile: 0, //敏捷 提升攻击速度和闪避
			strength: 0,//力量 提升武器伤害和基础伤害
			spirit: 0,//精神 提高恢复率
		}
		let basicProperty = {
			armor: 0, //自身护甲
			intelligence: 0,//智力 提高法术伤害
			endurance: 0,//耐力 提高最大生命值
			agile: 0, //敏捷 提升攻击速度和闪避
			strength: 0,//力量 提升武器伤害和基础伤害
			spirit: 0,//精神 提高恢复率

			energy: 0, //能量

			speedScale: 1, //急速等级/攻击速度百分比
 
			attackSpeed: 1, //攻击速度
			attackPower: 0, //攻击强度
			hasteLevel: 0, //急速等级 最大值1
			moveSpeed: 1, //移动速度百分比
			CriticalHitRate: 0,//暴击率百分比
			CriticalHitLevel: 0,//暴击等级
			CriticalHit: 1.5,//暴击伤害百分比
			armorRate: 0,//物理防御力百分比
			CDRate: 0,//技能冷却时长百分比 最大值1
		}
		this.GetBaseData = function () {
			return baseData;
		}
		let buffList = [];
		let debuffList = [];
		function resetBasicProperty(level) {
			if (_Global.user.id == owner.id) {
				for (let i = 0; i < _Global.levelList.length; i++) {
					const element = _Global.levelList[i];
					if (element.level == level) {
						// console.log(" 等级 " + level, element);
						basicProperty.intelligence = element.intelligence;
						basicProperty.endurance = element.endurance;
						basicProperty.agile = element.agile;
						basicProperty.strength = element.strength;
						basicProperty.spirit = element.spirit;
						baseData.baseHealth = element.maxHealth;
					}
				}
			} else {
				basicProperty.intelligence = 0;
				basicProperty.endurance = 0;
				basicProperty.agile = 0;
				basicProperty.strength = 0;
				basicProperty.spirit = 0;
			}
			for (let i = 0; i < baseData.equipList.length; i++) {
				const element = baseData.equipList[i];
				if (element.propertyList && element.propertyList.length > 0) {
					for (let j = 0; j < element.propertyList.length; j++) {
						const property = element.propertyList[j];
						equipData[property.property] += property.value;
					}
				}
			}
 
			// basicProperty.intelligence += equipData.intelligence;
			// basicProperty.endurance += equipData.endurance;
			// basicProperty.agile += equipData.agile;
			// basicProperty.strength += equipData.strength;
			// basicProperty.spirit += equipData.spirit;

			baseData.maxHealth = baseData.baseHealth + basicProperty.endurance * 10;

		}

		// 属性
		// 生命值、生命回复、生命加成、生命吸血几率、生命吸血值、
		// 护甲、命中后无敌、移动速度
		// 武器伤害、暴击率、暴击伤害值、武器射速、武器装填时间
		// 技能伤害、技能冷却
		// 磁力范围、金钱倍率、经验值倍率、运气、躲避几率

		// 动作相关动画速度可变{移动速度、攻击速度}

		this.EventHandler = function (e) {
			if (e == "重生") {
				baseData.health = baseData.maxHealth;
				baseData.energy = 0;
				baseData.buffList = [];
				baseData.debuffList = [];
				owner.applyEvent("属性改变", baseData);
			}
		}
		// 计算输出的伤害。基础伤害+暴击+额外伤害
		this.GetDamage = function (value) {
			value = value * (1 + basicProperty.attackPower);

			// 判断是否触发暴击
			let v = RandomInt(1, 100) / 100;
			let _CriticalHitRate = basicProperty.CriticalHitRate + basicProperty.CriticalHitLevel;
			// console.log(" 检查是否暴击 ",_CriticalHitRate,v,value);
			if (_CriticalHitRate > v) {
				value += parseInt(value * basicProperty.CriticalHit);
			}
			return value;
		}
		// 计算受到的伤害。受到的攻击力-护甲值
		this.RealyDamage = function (strength) {

			// console.log( owner.GetNickName() + " 受到伤害 00 "+ strength);

			// let v = 0;
			// 有护盾，先使用护盾减伤
			for (let i = baseData.buffList.length - 1; i >= 0; i--) {
				const element = baseData.buffList[i];
				if (element.type == "shield") {
					if (element.value >= strength) {
						element.value -= strength;
						return 0;
					} else {
						strength -= element.value;
						owner.applyEvent("解除技能", element);
					}
				}
			}


			// basicProperty.armorRate = basicProperty.armor * 0.06 / (1 + 0.06 * basicProperty.armor);
			basicProperty.armorRate = (basicProperty.armor+equipData.armor) * 0.02;
			
			// console.log( owner.GetNickName() + " 护甲比例 "+ basicProperty.armor + "  "+ basicProperty.armorRate);

			// 攻击力*物理防御  
			strength *= (1 - basicProperty.armorRate);



			strength = parseInt(strength);



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
			// 	scope.applyEvent("解除技能");
			// 	v = v > 0 ? v : 1;
			// }
			// console.log( owner.GetNickName() + " 受到伤害 "+ strength);
			return strength;
		}

		function Init() {

			baseData = owner.GetBaseData();
			// console.log( owner.GetNickName() + "in NPC 11 baseData = ", JSON.stringify(baseData));
			if (baseData.equipData == undefined) {
				baseData.equipData = equipData;
			}
			if (baseData.basicProperty == undefined) {
				baseData.basicProperty = basicProperty;
			} else {
				let names = Object.getOwnPropertyNames(basicProperty);
				for (let i = 0; i < names.length; i++) {
					const name = names[i];
					if (baseData.basicProperty[name] == undefined) {
						baseData.basicProperty[name] = basicProperty[name];
						// console.log( owner.GetNickName() + " 改变属性值 = ",name, basicProperty[name]);

					}
				}
			}

			if (baseData.gold == undefined) {
				baseData.gold = 0;
			}
			baseData.buffList = buffList;
			baseData.debuffList = debuffList;
			baseData.baseHealth = baseData.maxHealth;

			basicProperty = baseData.basicProperty;
			equipData = baseData.equipData;
			// console.log(owner.GetNickName() + " 的属性 ",baseData);
			owner.applyEvent("属性改变", baseData);
			owner.addEventListener("更新装备", (equipList) => {
				baseData.equipList = equipList;
				resetBasicProperty(baseData.level);
				if (baseData.health > baseData.maxHealth) {
					baseData.health = baseData.maxHealth;
				}
				// console.log(owner.GetNickName() + " 装备更新属性 ",equipList,baseData);
				owner.applyEvent("属性改变", baseData);
				owner.updateEquip();
			});

		}
		this.updateDMPlayer = function (_dmPlayer) {
			baseData.dmplayerList = _dmPlayer;
		}
		this.changeProperty = function () {
			owner.applyEvent("属性改变", baseData);
		}
		this.SetBasedataItem = function (card) {
			let { value, property } = card;
			if (baseData[property] != undefined) {
				baseData[property] = value;
			} else {
				basicProperty[property] = value;
			}
			owner.applyEvent("属性改变", baseData);

		}
		this.GetPropertyValue = function(e){
			if (baseData[e] != undefined) {
				return baseData[e];
			} else {
				return basicProperty[e];
			}
		}
		this.updateBasedata = function (card) {
			let { value, property } = card;


			if (baseData[property] != undefined) {
				baseData[property] += value;
			} else {
				basicProperty[property] += value;
			}

			if (property == "moveSpeed") {
				owner.SetMoveSpeed(basicProperty.moveSpeed);
			}
			if (property == "CDRate") {
				owner.GetSkill().SetSkillCDRate(basicProperty[property]);
			}


			if (property == "level") {
				// 其他属性随等级提升
				if (_Global.user.id == owner.id) {
					resetBasicProperty(baseData.level);
					baseData.health = baseData.maxHealth;
				}
			}


			if (baseData.health > baseData.maxHealth) {
				baseData.health = baseData.maxHealth;
			}

			owner.applyEvent("属性改变", baseData); 
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