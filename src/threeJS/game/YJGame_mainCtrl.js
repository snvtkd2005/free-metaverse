




/**
 * roguelike角色控制方式：
 * 1，鼠标位置控制角色朝向
 * 2，鼠标点击时攻击
 * 3,禁用左右鼠标旋转视角
 * 4，左键长按连续发射
 */
class YJGame_mainCtrl {
  constructor() {
    var scope = this;
    //#region 
    //#endregion 

    function init() {
      // console.error(" in YJGame_mainCtrl "); 

      _Global.addEventListener('游戏继续', () => {
      });

      _Global.addEventListener('主角生命值', (h, maxH) => {

      });

      _Global.addEventListener('释放灵魂', () => {
        //清空技能
        _Global._YJPlayerFireCtrl.ClearSkill();
        _Global.applyEvent('主角重生');
        // _Global.applyEvent('战斗开始');

      });
      _Global.addEventListener('道具复活', () => {
        _Global.applyEvent('主角重生');
        // 还原战斗记录
        _Global.applyEvent('激活技能栏');
        // _Global.applyEvent('战斗开始');

      });
      _Global.applyEvent('主角姓名', _Global._YJPlayerFireCtrl.GetNickName());
      _Global.applyEvent('主角头像', _Global.YJ3D.YJPlayer.GetavatarData());

      _Global.addEventListener('经验值', (c, v) => {

      });
      _Global.addEventListener('升级', (level) => {
        _Global.applyEvent('设置等级', level);
        _Global._YJPlayerFireCtrl.GetProperty().changeProperty();
        // 弹窗卡牌选择
        // openCard(level);
      });

      _Global._YJPlayerFireCtrl.addEventListener("重生", (skillName, cCD) => {
        _Global._YJPlayerFireCtrl.applyEvent("首次进入战斗");
      });

      _Global._YJPlayerFireCtrl.addEventListener("属性改变", (baseData) => {
        _Global.applyEvent("属性改变", baseData);
      });


    }
    init();
  }
}
export { YJGame_mainCtrl };