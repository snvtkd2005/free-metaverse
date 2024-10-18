
export default {

  skill: {
    type:"skill",
    level:0,
    skillName: "基础攻击",
    // auto: true, //自动攻击

    // 该结构表示：每10秒对当前目标造成10点伤害
    //触发时机 每间隔n秒触发、血量达到n%触发 perSecond  health
    trigger: { type: "perSecond", value: 3},
    CD:3 ,//技能冷却时间
    //目标
    target: { type: "target", value: 1 },// random随机 target目标 area范围攻击
    hasTargetLv:false,
    targetLv:[],
    //效果 damage直接伤害、perDamage每秒伤害、contDamage持续伤害、冻结、眩晕等状态
    effects : [
      {
        name: "直接伤害",
        runType: "immediately", //执行类型
        type: "basicProperty",
        controlId: "health", //控制id 1=冰霜新星
        value: -100,
        time: 0,
        duration: 0, 
        describe: "生命值减少100点",
        icon: "",
      }
    ],
    directToTarget:false, //是否直接到达目标
    effect: {
      type: "damage",
      controlId:-1, //控制id 1=冰霜新星
      value: 10,
      time: 1,
      duration: 3, 
      describe: "对目标造成100点伤害",
      icon: "",
    }, //describe技能描述，duration持续时间。perDamage、冻结、眩晕等状态效果才需要持续时间
    hasReceiveEffect:false, //是否有接收效果（生成模型）
    receiveEffect:{
      // modelType:"静态模型",
      // particleId:"1709818566951",
    }, 
    //技能施放的有效范围 或 范围攻击的游戏范围
    vaildDis: 3, //  
    hasVaildDisLv:false, //施放范围等级
    vaildDisLv:[],
    inVaildDis: false, //  有效距离
    hasTarget:false, // 有目标

    //施放时间
    castTime: 0.5, // 施法时间。 秒, 0表示瞬发
    animNameReady: "fight idle", // 施法准备/读条动作
    animName: "fight attack", // 施法施放动作

    skillReadyParticleId: "", //吟唱特效
    skillReadyAudio: "", //吟唱音效
    skillFireParticleId: "", //施放特效
    skillFirePart: "", //施放部位
    skillFireAudio: "", //施放音效
    //效果增强
    effectEnhance: "none",
    icon: "1711535565741/ability_warrior_charge.png", //技能图标
    describe: "对目标造成基础伤害或武器伤害", //描述总结
  }
}



