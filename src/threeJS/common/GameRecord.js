





import roguelikeGameData from "../../projects/farm/data/platform/roguelikeGameData";
import { toTime } from "../../utils/utils";

/**
 * 游戏战斗统计
 */
class GameRecord {
  constructor() {
    var scope = this;
    //#region 
    //#endregion 

    let currentExp = 0;
    let currentKill = 0;
    let teamStats = roguelikeGameData.teamStats;
    let needExpByLevels = roguelikeGameData.needExpByLevels;
    let record = teamStats.record;
    let level = 1;
    let needExpByLevel = needExpByLevels[level - 1];
    function init() {

      setInterval(() => {
        if (!_Global.inGame || _Global.pauseGame) {
          return;
        }
        record.time++;
        _Global.applyEvent("存活时间", toTime(record.time));
      }, 1000);
    }
    function initTeamStats() {
      record = {
        time: 0, //存活时间
        kill: 0,//杀敌数
        damageValue: 0,//造成的伤害
        money: 0,//金币
        exp: 0,//经验值
      };
    }
    this.addKill = function () {
      record.kill++;
      currentExp += 30;
      checkKillCount();
    }
    this.resetKill = function () {
      record.kill = 0;
      currentKill = 0;
    }
    function checkKillCount() {
      // _Global.addEventListener('杀敌数',(c,n)=>{ 
      // });


      if (currentExp >= needExpByLevel.exp) {
        _Global.applyEvent('升级',level); 
        level++;
        currentExp = 0;
        needExpByLevel = needExpByLevels[level - 1];
        console.log("升级",level);

      }
      _Global.applyEvent('经验值', currentExp, needExpByLevel.exp);
      // console.log("已杀", record.kill);
      console.log("经验值",currentExp, needExpByLevel.exp);

    }

    // 占位符替换函数
    function templateReplace(template, data) {
      return template.replace(/\$\{(\w+)\}/g, function (match, key) {
        return data[key] || match;
      });
    }
    this._update = function () {
    }
    init();
  }
}
export { GameRecord };