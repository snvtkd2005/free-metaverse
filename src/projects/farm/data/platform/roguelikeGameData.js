


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
    {level:1,exp:30,rewardType:"skill",},
    {level:2,exp:30,rewardType:"items",},
    {level:3,exp:90,rewardType:"skill",},
    // {level:1,exp:100,rewardType:"items",},
    // {level:2,exp:150,rewardType:"items",},
    // {level:3,exp:200,rewardType:"skill",},
    {level:4,exp:300,rewardType:"items", },
    {level:5,exp:400,rewardType:"items",},
    {level:6,exp:500,rewardType:"skill",},
    {level:7,exp:1000,rewardType:"items",},
    {level:8,exp:1000,rewardType:"items",},
    {level:9,exp:3000,rewardType:"items",},
    {level:10,exp:4000,rewardType:"items",},
    {level:11,exp:6000,rewardType:"items",},
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
  skillCount: [
    {
      skillName: "多重射击",
      count: 2,//卡牌出现次数
    },
  ],
  // 技能
  skills: [
    {
      type: "skill",
      skillName: "多重射击",
      // 该结构表示：每10秒对当前目标造成10点伤害
      //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
      trigger: { type: "perSecond", value: 20, CD: 3 },
      //目标
      target: { type: "area", value: 3 },// random随机 target目标 area范围攻击
      //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
      effect: {
        type: "damage",
        controlId: 1, //控制id 1=冰霜新星
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
      type: "skill",
      skillName: "寒冰护体",
      // 该结构表示：每10秒对当前目标造成10点伤害
      //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
      trigger: { type: "perSecond", value: 20, CD: 30 },
      //目标
      target: { type: "self", value: 3 },// random随机 target目标 area范围攻击
      //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
      effect: {
        type: "shield",
        controlId: "寒冰护体", //控制id 1=冰霜新星
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
    {
      type: "skill",
      skillName: "冰霜新星",
      // 该结构表示：每10秒对当前目标造成10点伤害
      //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
      trigger: { type: "perSecond", value: 3, CD: 3 },
      //目标
      target: { type: "area", value: 20 },// random随机 target目标 area范围攻击
      //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
      effect: {
        type: "control",
        controlId: "冰霜新星", //控制id 1=冰霜新星
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
      skillFireParticleId: "1710838494260", //施放特效
      skillFirePart: "", //施放部位
      skillFireAudio: "", //施放音效
      //效果增强
      effectEnhance: "none",
      icon: "", //技能图标      
      describe: "冰霜护盾，吸收伤害", 
    },
  ],
  
}



