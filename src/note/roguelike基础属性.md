
# Roguelike基础属性


角色基础属性
```
let baseData = {
			health: 0, //当前生命值
			maxHealth: 0, //当前生命最大值
			addHealth: 0, //额外提升生命最大值

			armor: 0, //护甲
			energy: 0, //能量
			agile: 10, //敏捷 提升攻击速度和闪避
			strength: 20,//力量 提升武器伤害和基础伤害
			intelligence:0,//智力 提高法术伤害
			spirit:0,//精神 提高恢复率
			shield: 0, //护盾

			debuffList: [], //buff列表
		};
```

角色攻击属性
```
		let attackProperty = {
			targetMax: 1, //目标
			speedScale: 2, //急速等级 攻击速度
			moveSpeedScale: 1, //移动速度
			CriticalHitRate: 10,//暴击率
			CriticalHit: 50,//暴击伤害百分比
		}
```

伤害计算

