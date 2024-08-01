


export default {


  // 默认角色信息
  defaultUser: {
    userName: "test",
    // 默认角色
    avatarName: "女孩",
    avatarId: 1697436993131,
  },

  // 角色选择界面的角色信息
  players: [
    {
      name: "女孩",
      img: "images/spUI/player1.png",
      avatarId: 1697436993131,
    },
  ],
  weaponList: [
    {
      name: "弓",
      img: "",
      assetId: 1692787200597,
    },
    {
      name: "枪",
      img: "",
      assetId: 1692230652133,
    },

  ], 
  // 单局游戏数据
  teamStats:
  {
    // 记录
    record: {
      time: 0, //存活时间
      kill: 0,//杀敌数
      damageValue: 0,//造成的伤害
      money: 0,//金币
      exp: 0,//经验值
    },

    // property: {
    //   level: 1, //等级决定基础属性
    //   health: 10,
    //   maxHealth: 100,

    //   armor: 0, //护甲
		// 	energy: 0, //能量
		// 	agile: 10, //敏捷 提升攻击速度和闪避
		// 	strength: 20,//力量 提升武器伤害和基础伤害
		// 	intelligence: 0,//智力 提高法术伤害
		// 	spirit: 0,//精神 提高恢复率

    //   speedScale: 1, //急速等级/攻击速度百分比
		// 	moveSpeedScale: 1, //移动速度百分比
		// 	CriticalHitRate: 0.1,//暴击率百分比
		// 	CriticalHit: 1.5,//暴击伤害百分比
		// 	armorRate: 0,//物理防御力百分比
		// 	CDRate: 1,//技能冷却时长百分比

    // },
  },
  skillCount: [
    {
      skillName: "多重射击",
      count: 2,//卡牌出现次数
    },
  ], 
  
}



