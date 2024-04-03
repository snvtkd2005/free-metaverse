



import * as THREE from "three";


// 战斗记录
class YJCombatLog {
  constructor(ui) {
    var scope = this;
    this.log = function (from,to,type,content) {
      // console.log(content);

      if(type == "技能"){
        content = "[" +from + "]"+ (to?(" 对 "+"[" +to+ "]"):('')) + " 施放【" + content +"】";
        // scope.DMlog(content,"敌方npc");
        ui.log(content);
        return;
      }
      if(type == "技能攻击"){
        content = "[" +from + "]"+ (to?(" 对 "+"[" +to+ "]"):('')) + " 施放【" + content +"】";
        // scope.DMlog(content,"敌方npc");
        ui.log(content);
        return;
      }
      ui.log(from);

    }
    // 弹幕玩家施放技能
    this.DMlog = function (content,type) {
      // 画面弹窗显示
      ui.log(content);
      if(type == undefined){
        type = "弹幕玩家";
      }
      ui.DMlog(content,type);
    }
    function init() {
      _Global.CombatLog = scope;
    }

    init();
  }
}

export { YJCombatLog };