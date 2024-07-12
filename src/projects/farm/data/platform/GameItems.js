
export default {


  constSettingData: {
    id:'',
    type:"prop",
    name: "",
    propType: '', //道具效果类型
    effectType: '', //效果类型
    property: '',// 角色属性字段
    displayType:"none",//显示方式
    qualityType: "",
    bindingType: "",
    countType: "",
    value: 0, //效果值
    icon: "", //图标
    CD:0,// 冷却时间
    describe: "", //描述
  },
  // 道具类型
  propType: [
    { label: "药水", value: "potion" },
    { label: "物品", value: "stuff" },
    // { label: "材料", value: "ingredient" },
  ],
  effectType:[],
  // 药水效果类型
  potionType:[
    { label: "角色属性", value: "playerProperty" },
    // { label: "特殊效果", value: "otherProperty" },
    // { label: "世界Buff", value: "worldBuff" },
  ],
  // 物品效果
  stuffType:[
    { label: "传送", value: "transmit" },

  ],

  //攻击属性
  playerProperty: [
    { label: "暴击率", value: "CriticalHitRate" }, 
    { label: "暴击等级", value: "CriticalHitLevel" }, 
    { label: "攻击速度", value: "attackSpeed" },
    { label: "攻击强度", value: "attackPower" },
    { label: "移动速度", value: "moveSpeed" },
    { label: "急速等级", value: "hasteLevel" },
    { label: "急速冷却", value: "CDRate" },
    { label: "生命值", value: "health" },
    { label: "护甲", value: "armor" },
    // { label: "最大生命值", value: "addHealth" },
  ],
  // 基础属性
  otherProperty: [

  ],
  // 显示方式
  displayType: [
    { label: "none", value: "none" },
    { label: "sprite图片", value: "image" },
    { label: "3d模型", value: "model" },
  ],
  qualityType: [
    { label: "none", value: "" },
    { label: "普通", value: "normal" }, 
  ],
  bindingType: [
    { label: "none", value: "" },
    { label: "已绑定", value: "bindinged" },
    { label: "装备后绑定", value: "needbindinged" },
  ],
  countType: [
    { label: "none", value: "" },
    { label: "唯一", value: "onlyone" }, 
  ],
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

    // 加暴击的道具：
    // 圆润秋色石 16爆、
    // 圆润王者琥珀 20爆、
    // 邪恶紫黄晶 20攻强 10暴击、
    // 高能紫黄晶 12法强 10暴击
  ],
}



