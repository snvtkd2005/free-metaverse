





import levelsData from "../../projects/farm/data/platform/levelsData";
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
    let needExpByLevels = levelsData.needExpByLevels;
    let record = teamStats.record;
    let level = 1;
    let needExpByLevel = needExpByLevels[level - 1];
    function init() {

      setInterval(() => {
        if (!_Global.inGame || _Global.pauseGame || _Global.mainPlayerIsDead) {
          return;
        }
        record.time++;
        _Global.applyEvent("存活时间", toTime(record.time));
      }, 1000);

      _Global.addEventListener("释放灵魂", () => {
        record.time = 0;
        currentExp = 0;
        level = 1;
        _Global.applyEvent("存活时间", toTime(record.time));
        needExpByLevel = needExpByLevels[level - 1];
        _Global.applyEvent('设置等级', level);
        _Global.applyEvent('经验值', currentExp, needExpByLevel.exp);


      });
      
      _Global.addEventListener("加经验", (v) => {
        currentExp += v;
        checkKillCount();
        _Global.applyEvent("获取道具记录","经验值",v);
      });
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

    // 玩家伤害统计
    this.DMPlayerDamageStatistics = function (damageStatistics, DMPlayer) {
      for (let i = damageStatistics.length - 1; i >= 0; i--) {
        const item = damageStatistics[i];
        let has = false;
        for (let j = 0; j < DMPlayer.length && !has; j++) {
          const item2 = DMPlayer[j];
          if (item.from == item2.uname) {
            item.header = item2.uface;
            item.camp = item2.camp;
            has = true;
          }
        }
        if (!has) {
          damageStatistics.splice(i, 1);
        }
      }
      return damageStatistics;
    }
    function checkKillCount() {
      // _Global.addEventListener('杀敌数',(c,n)=>{ 
      // });


      if (currentExp >= needExpByLevel.exp) {
        level++;
        currentExp = currentExp-needExpByLevel.exp;
        if (level >= needExpByLevels.length) {
          level = needExpByLevels.length;
        }
        needExpByLevel = needExpByLevels[level - 1];
        _Global._YJPlayerFireCtrl.GetProperty().updateBasedata({value:1,property:"level"});
        checkKillCount();
        _Global.applyEvent('升级', level);
        _Global._YJAudioManager.playAudio('1710913742348/levelup.ogg');

        return;
      }
      _Global.applyEvent('经验值', currentExp, needExpByLevel.exp); 


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