
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
    describe += "自身";
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
  if (item.target.type == "area") {
    describe += "对半径" + item.vaildDis + "米范围内";
    if (item.target.value == 0) {
      describe += "所有目标";
    } else {
      describe += "最多" + item.target.value + "个目标";
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

  // dubuff持续伤害
  if (item.effect.type == "contDamage") {
    describe +=
      ",每" +
      item.effect.time +
      "秒造成" +
      item.effect.value +
      "点伤害，持续" +
      item.castTime +
      "秒";
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
  GetColor,GetDescribe
}