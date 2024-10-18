
function GetColor(qualityType){
  switch (qualityType) {
    case "none":
      return "#666666";

      break;
    case "normal":
      return "#ffffff";
      break;
    case "unnormal":
      return "#1eff00";

      break;
    case "rare":
      return "#0070dd";

      break;
    case "epic":
      return "#a335ee";

      break;
    case "legendary":
      return "#a335ee";

      break;

    default:
      break;
  }
}

let controlId =  [
  { label: "冰霜新星", value: "冰霜新星" }, 
  { label: "被嘲讽", value: "被嘲讽" }, 
  { label: "眩晕", value: "眩晕" }, 
  { label: "减速", value: "减速" }, 
  { label: "无法移动", value: "无法移动" }, 

  { label: "生命值", value: "health" }, 
  { label: "护甲", value: "armor" }, 
  { label: "耐力", value: "endurance" }, 
  { label: "力量", value: "strength" }, 
  { label: "精神", value: "spirit" }, 
];
function GetControlidLabel(value){
  for (let i = 0; i < controlId.length; i++) {
    const element = controlId[i];
    if(element.value == value){
      return element.label;
    }
  }
}

function GetDescribe_buff(item, level = 0){
  let describe = "";
  // 进化
  if (item.type == "evolution") {
    describe += ",所有技能造成的伤害提高" + item.value + "%";
  }
  // 增生/镜像
  if (item.type == "hyperplasia") {
    describe += ",生成" + item.value + "个镜像";
  }

  if (item.runType == "perSecond") {
    describe += "每" +item.time + "秒" ;
  }
  // dubuff持续伤害
  if (item.type == "contDamage") {
    describe +=
      ",每" +
      item.time +
      "秒造成" +
      item.value +
      "点伤害，持续" +
      item.duration +
      // item.castTime +
      "秒";
  }

  if (item.type == "basicProperty") {
    describe +=
      GetControlidLabel(item.controlId)  +
      (item.value>0 ?"增加":"减少") +
     Math.abs( item.value) +"点" 
  }


  if (item.type == "damage") {
    describe += ",造成" + item.value + "点伤害";
  }
  if (item.type == "addHealth") {
    describe += ",恢复" + item.value + "点生命值";
  }

  if (item.type == "perDamage") {
    let effectdes =
      "每" +
      item.time +
      "秒造成" +
      item.value +
      "点伤害，持续" +
      item.duration +
      "秒";
    item.describe = effectdes;
    describe += "," + effectdes;
  }
  if (item.type == "control") {
    describe += "" + item.controlId;
    if(item.value != 0){
      describe += "" + item.value + "%";
    }
  }

  if (item.type == "shield") {
    let effectdes = "吸收" + item.value + "点伤害";
    describe +=
      "施放" +
      item.controlId +
      "。" +
      effectdes +
      "，持续" +
      item.duration +
      "秒";
    item.describe = effectdes;
  }
  
  if(item.duration>0){
    describe += "，持续"+item.duration +"秒"; 
  }
  return describe;
}
function GetDescribe(item, level = 0){
  let describe = "";

  if (item.trigger.type == "health") {
    // describe += "自动攻击时，当生命达到" + item.trigger.value + "%时，";
  }
  if (item.trigger.type == "perSecond") {
    // describe += "自动攻击时，每" + item.trigger.value + "秒，";
  }
 
  let targetCamp = "友方";
  if (item.effect.type.toLowerCase().includes("damage")) {
    targetCamp = "敌方";
  }

  let targetValue = item.target.value;
  if (item.hasTargetLv && item.targetLv && item.targetLv.length > 1) {
    targetValue = item.targetLv[level];
  }

  if (item.target.type == "none" || item.target.type == "self") {
    describe += "";
  }
  if (item.target.type == "randomEnemy") {
    describe += "随机对最多" + targetValue + "个" + targetCamp + "目标";
  }
  if (item.target.type == "randomFriendly") {
    describe += "随机对最多" + targetValue + "个" + targetCamp + "目标";
  }
  if (item.target.type == "target") {
    describe += "对当前目标";
  }
  if (item.target.type.includes("area")) {
    describe += "对半径" + item.vaildDis + "米范围内";

    if (item.target.value == 0) {
      describe += "所有";
    } else {
      describe += "最多" + item.target.value + "个";
    }

    if (item.target.type.includes("Friendly")) {
      describe += "友方目标";
    } else {
      describe += "敌方目标";
    }
  }

  if (item.target.type == "minHealthFriendly") {
    describe += "对生命值最少的友方";
  }

  // 进化
  if (item.effect.type == "evolution") {
    describe += ",所有技能造成的伤害提高" + item.effect.value + "%";
  }
  // 增生/镜像
  if (item.effect.type == "hyperplasia") {
    describe += ",生成" + item.effect.value + "个镜像";
  }

  if (item.effect.runType == "perSecond") {
    describe += "每" +item.effect.time + "秒" ;
  }
  // dubuff持续伤害
  if (item.effect.type == "contDamage") {
    describe +=
      ",每" +
      item.effect.time +
      "秒造成" +
      item.effect.value +
      "点伤害，持续" +
      item.effect.duration +
      // item.castTime +
      "秒";
  }

  if (item.effect.type == "basicProperty") {
    describe +=
      GetControlidLabel(item.effect.controlId)  +
      (item.effect.value>0 ?"增加":"减少") +
     Math.abs( item.effect.value) +"点" 
  }

  if (item.effect.runType == "perSecond") {
    describe += "，持续"+item.effect.duration +"秒"; 
  }

  if (item.effect.type == "damage") {
    describe += ",造成" + item.effect.value + "点伤害";
  }
  if (item.effect.type == "addHealth") {
    describe += ",恢复" + item.effect.value + "点生命值";
  }

  if (item.effect.type == "perDamage") {
    let effectdes =
      "每" +
      item.effect.time +
      "秒造成" +
      item.effect.value +
      "点伤害，持续" +
      item.effect.duration +
      "秒";
    item.effect.describe = effectdes;
    describe += "," + effectdes;
  }
  if (item.effect.type == "control") {
    describe += "施放控制" + item.effect.controlId;
  }

  if (item.effect.type == "shield") {
    let effectdes = "吸收" + item.effect.value + "点伤害";
    describe +=
      "施放" +
      item.effect.controlId +
      "。" +
      effectdes +
      "，持续" +
      item.effect.duration +
      "秒";
    item.effect.describe = effectdes;
  }
  return describe;
} 

export {
  GetColor,GetDescribe,GetDescribe_buff
}