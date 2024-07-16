




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

      _Global._YJGame_mainCtrl = scope;
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


    let modelPool = []; //金币对象池
    this.createGold = function(pos) {
      // return;
      let folderBase = "1721002990224";
      let transform = this.GetModelInPool(folderBase);
      if(transform != null){
        transform.SetPos(pos); 
        transform.SetActive(true); 
        return;
      }
      pos.y += 0.5;
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillGroup(folderBase, (model) => {
        model.SetPos(pos); 
        model.SetActive(true); 
        model.nameType = "gold";
        modelPool.push({folderBase:folderBase,transform:model});
        // console.log(" 生成金币 ",model);
      });
    }
    this.GetModelInPool = function(folderBase){
      for (let i = 0; i < modelPool.length; i++) {
        const element = modelPool[i];
        if(element.folderBase == folderBase && !element.transform.GetActive()){
          return element.transform;
        }
      }
      return null;
    }
    this.AttachToPool = function(folderBase,model){
      modelPool.push({folderBase:folderBase,transform:model});
    }

    init();
  }
}
export { YJGame_mainCtrl };