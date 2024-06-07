


export default {


  // 默认角色信息
  defaultUser: {
    userName: "test",
    // 默认角色
    avatarName: "女孩",
    avatarId: 1697436993131,
  },

  // 角色选择界面的角色信息
  playerImgPath: [
    // {
    //   name: "小孩",
    //   platform: "pcweb",
    //   img: "images/spUI/player1.png",
    // },
    // {
    //   name: "litleUnityChain2",
    //   platform: "pcweb", 
    //   img: "images/spUI/player2.png",
    // },  
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

  needKill: 10, //当前等级需要击杀多少个敌人才能升级
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
    // 属性
    // 生命值、生命回复、生命加成、生命吸血几率、生命吸血值、
    // 护甲、命中后无敌、移动速度
    // 武器伤害、暴击率、暴击伤害值、武器射速、武器装填时间
    // 技能伤害、技能冷却
    // 磁力范围、金钱倍率、经验值倍率、运气、躲避几率
    property: {
      level: 1, //等级决定基础属性
      health: 10,
      maxHealth: 100,

    },
  },
  // 技能
  skill: [
    {
      title: "多重射击",
      damage:20,
      CD: 3,//
      count: 2,//卡牌出现次数
      describe: "最多对${count}个目标造成${damage}点伤害",
    },
    {
      title: "暴击",
      count: 10,
      value: 10,
    },
    {
      title: "攻击速度",
      count: 10,
      value: 10,
    }
  ],
  // 道具
  // 道具名、道具效果
  items: [
  ],
}



