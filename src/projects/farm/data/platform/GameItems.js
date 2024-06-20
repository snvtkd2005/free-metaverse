
export default {
 
  /**
   * 
  道具{
    title:道具名,
    count:出现次数,
    value:效果值,
    duration:持续时间秒,
    describe:效果描述,
  }
   */
  // 
  // 道具名、道具效果
  items: [

    // { title: "强效防御药剂",count: 10,value: 100,duration: 100,describe: "护甲提高${value}点，持续${duration}",},
    // { title: "冰霜之力药剂",count: 10,value: 15,duration:100,describe: "法术的冰霜伤害提高最多${value}点，持续${duration}",},
    // { title: "火力药剂",count: 10,value: 15,duration:100,describe: "使你的火焰法术造成的伤害提高${value}点，持续${duration}",},
    // { title: "敏捷药剂",count: 10,value: 15,duration:100,describe: "使敏捷提高${value}点，持续${duration}",},

    // { title: "食人魔力量药剂", count: 10, value: 15,duration:100, describe: "使力量提高${value}点，持续${duration}", },
    // { title: "坚韧药剂", count: 10, value: 15,duration:100, describe: "使玩家的生命值上限提高${value}点，持续${duration}", },
    // { title: "超强巨魔之血药水", count: 10, value: 15,duration:100, describe: "每5秒恢复${value}点生命值，持续${duration}", },
    // { title: "超强治疗药水", count: 10, value: 15, describe: "恢复700至900点生命值", },
    // { title: "强效法力药水", count: 10, value: 15, describe: "恢复700至900点法力值", },
    // { title: "野葡萄药水", count: 10, value: 15, describe: "恢复1至1500点生命值和恢复1至1500点法力值", },
    // { title: "火焰防护药水", count: 10, value: 15,duration:100, describe: "吸收975至1625点火焰伤害，持续${duration}", },
    // { title: "暴怒药水", count: 10, value: 15, describe: "使怒气值提高30到60点", },
    // { title: "滋补药剂", count: 10, value: 15,duration:100, describe: "每5秒从你身上驱散1个魔法，诅咒，中毒或疾病效果。持续${duration}", },
    // { title: "自由行动药剂", count: 10, value: 15,duration:100,  describe: "使你对昏迷和移动限制效果免疫，持续${duration}，但并不会解除已有的移动限制效果", },
    // { title: "次级石盾药水", count: 10, value: 15, duration:100, describe: "护甲值提高1000点，持续${duration}", },
    // { title: "次级隐形药水", count: 10, value: 15,duration:100,  describe: "使饮用者隐形，持续${duration}", },
    // { title: "抗魔药水", count: 10, value: 15,duration:100,  describe: "是你对所有魔法的抗性提高50点，持续${duration}", },
    // { title: "献祭之油", count: 10, value: 15,duration:100,  describe: "每3秒钟对施法者半径5码范围内的所有敌人造成50点火焰伤害，持续${duration}", },

    // { title: "魔纹绷带", count: 10, value: 15, describe: "在8sec内恢复800点生命值", },
    // { title: "厚丝质绷带", count: 10, value: 15, describe: "在8sec内恢复640点生命值", },

    
    {
      id:100007,
      title: "急速冷却",
      count: 10,
      value: -10,
      type:"attackProperty",
      property:"CDRate",
      describe: "技能冷却时间缩短${value}%",
    },
    {
      id:100006,
      title: "超强治疗药水",
      count: 10,
      value: 300,
      type:"basicProperty",
      property:"health",
      describe: "恢复${value}点生命值",
    },
    {
      id:100001,
      title: "强效防御药剂",
      count: 10,
      value: 10,
      type:"basicProperty",
      property:"armor",
      describe: "护甲提高${value}点",
    },

    {
      id:100002,
      title: "暴击率",
      count: 10,
      value: 100,
      type:"attackProperty",
      property:"CriticalHitRate",
      describe: "暴击率提高${value}%",
    },
    {
      id:100003,
      title: "暴击伤害比例",
      count: 10,
      value: 10,
      type:"attackProperty",
      property:"CriticalHit",
      describe: "额外伤害提高${value}%",
    },
    {
      id:100004,
      title: "攻击速度",
      count: 10,
      value: 10,
      type:"attackProperty",
      property:"speedScale",
      describe: "攻击速度提高${value}%",
    },
    {
      id:100005,
      title: "移动速度",
      count: 10,
      value: 10,
      type:"attackProperty",
      property:"moveSpeedScale",
      describe: "移动速度提高${value}%",
    },
  ],
}



