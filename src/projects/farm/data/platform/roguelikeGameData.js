


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

  needKill: 1, //当前等级需要击杀多少个敌人才能升级
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

    // 动作相关动画速度可变{移动速度、攻击速度}
    
    property: {
      level: 1, //等级决定基础属性
      health: 10,
      maxHealth: 100,

    },
  },
  skillCount:[
    {
      title: "多重射击",
      count: 2,//卡牌出现次数
    },
  ],
  // 技能
  skills: [ 
    {
      type:"skill",
      title: "多重射击",
      // 该结构表示：每10秒对当前目标造成10点伤害
      //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
      trigger: { type: "perSecond", value: 20,CD:3 },
      //目标
      target: { type: "area", value: 3 },// random随机 target目标 area范围攻击
      //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
      effect: {
        type: "damage",
        controlId:1, //控制id 1=冰霜新星
        value: 20,
        time: 1,
        duration: 3,
        describe: "对目标造成100点伤害",
        icon: "",
      }, //describe技能描述，duration持续时间。perDamage、冻结、眩晕等状态效果才需要持续时间
      //技能施放的有效范围 或 范围攻击的游戏范围
      vaildDis: 30, //  
      //施放时间
      castTime: 1, // 施法时间。 秒, 0表示瞬发
      animNameReady: "two hand gun before attack", // 施法准备/读条动作
      animName: "two hand gun attack", // 施法施放动作

      skillReadyParticleId: "", //吟唱特效
      skillReadyAudio: "", //吟唱音效
      skillFireParticleId: "", //施放特效
      skillFirePart: "", //施放部位
      skillFireAudio: "", //施放音效
      //效果增强
      effectEnhance: "none",
      icon: "", //技能图标      
      describe: "最多对${count}个目标造成${damage}点伤害",

    },
    
    {
      type:"skill",
      title: "寒冰护体",
      // 该结构表示：每10秒对当前目标造成10点伤害
      //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
      trigger: { type: "perSecond", value: 20,CD:30 },
      //目标
      target: { type: "self", value: 3 },// random随机 target目标 area范围攻击
      //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
      effect: {
        type: "shield",
        controlId:"寒冰护体", //控制id 1=冰霜新星
        value: 100,
        duration: 60,
        describe: "吸收100点伤害",
        icon: "",
      }, //describe技能描述，duration持续时间。perDamage、冻结、眩晕等状态效果才需要持续时间
      //技能施放的有效范围 或 范围攻击的游戏范围
      vaildDis: 30, //  
      //施放时间
      castTime: 0, // 施法时间。 秒, 0表示瞬发
      animNameReady: "two hand gun before attack", // 施法准备/读条动作
      animName: "two hand gun attack", // 施法施放动作

      skillReadyParticleId: "", //吟唱特效
      skillReadyAudio: "", //吟唱音效
      skillFireParticleId: "1710648462453", //施放特效
      skillFirePart: "", //施放部位
      skillFireAudio: "", //施放音效
      //效果增强
      effectEnhance: "none",
      icon: "", //技能图标      
      describe: "冰霜护盾，吸收伤害",

    },
  ],
  // 道具
  // 道具名、道具效果
  items: [
    {
      title: "暴击率",
      count: 10,
      value: 100,
      describe: "暴击率提高${value}%",
    },
    {
      title: "暴击伤害比例",
      count: 10,
      value: 10,
      describe: "额外伤害提高${value}%",
    },
    {
      title: "攻击速度",
      count: 10,
      value: 1,
      describe: "攻击速度提高${value}%",
    }
  ],
}



