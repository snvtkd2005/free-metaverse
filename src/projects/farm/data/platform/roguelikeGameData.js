


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
  // 每个等级需要的exp
  /**
    level:1, //当前等级
    exp:200,//当前等级升级所需经验值
    rewardType:"",//升级时奖励类型。 道具items、技能skill
    rewardIds:[],//奖励id
   */
  needExpByLevels:[
    // {level:1,exp:90,rewardType:"skill",},
    // {level:2,exp:180,rewardType:"skill",},
    // {level:3,exp:260,rewardType:"skill",},
    {level:1,exp:30,rewardType:"skill",},
    {level:2,exp:30,rewardType:"skill",},
    {level:3,exp:30,rewardType:"skill",},
    // {level:1,exp:100,rewardType:"items",},
    // {level:2,exp:150,rewardType:"items",},
    // {level:3,exp:200,rewardType:"skill",},
    {level:4,exp:380,rewardType:"skill", },
    {level:5,exp:380,rewardType:"skill",},
    {level:6,exp:460,rewardType:"items",},
    {level:7,exp:460,rewardType:"items",},
    {level:8,exp:1000,rewardType:"items",},
    {level:9,exp:1000,rewardType:"items",},
    {level:10,exp:2000,rewardType:"items",},
    {level:11,exp:6000000,rewardType:"items",},
  ], //当前等级需要击杀多少个敌人才能升级
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



