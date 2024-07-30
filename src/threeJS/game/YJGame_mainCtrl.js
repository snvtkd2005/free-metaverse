import { YJSpriteMerged } from "../YJSpriteMerged";





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
      _Global.addEventListener('切换控制方式', (e) => {
        changeCtrlMode(e);
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
    function changeCtrlMode(e) {
      if (e == 'wow') {
        _Global.YJ3D.YJController.enableRotate = true;
        _Global.YJ3D.YJController.enablePan = true;
      }
      if (e == 'overlook') {
        _Global.YJ3D.YJController.enableRotate = false;
        _Global.YJ3D.YJController.enablePan = false;
        //视角高度
        _Global.YJ3D.YJController.SetCameraOffset({x:0,y:15,z:10});
        _Global.YJ3D.YJController.ChangeCtrlState();
        
      }
    }


    let autoCollecting = true;
    let YJSpriteMerged_gold = null;
    let modelPool = []; //金币对象池
    this.createGold = function (pos) {
      // return;
      let folderBase = "1721002547553"; //金币

      pos.y += 0.5;

      if (YJSpriteMerged_gold) {
        YJSpriteMerged_gold.addPoint(pos);
      }
      let transform = this.GetModelInPool(folderBase);
      if (transform != null) {
        transform.SetPos(pos);
        setTimeout(() => {
          transform.SetDisplay(false);
        }, 1000);
        return;
      }
      // LoadSkillGroup
      _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillByFolderBase(folderBase, (model) => {
        model.SetPos(pos);
        setTimeout(() => {
          model.SetDisplay(false);
        }, 1000);
        model.nameType = "gold";
        modelPool.push({ folderBase: folderBase, transform: model });
        if (YJSpriteMerged_gold == null) {
          YJSpriteMerged_gold = new YJSpriteMerged(model.modelData.message.data.imgPath);
          YJSpriteMerged_gold.SetAutoCollect(autoCollecting);
          YJSpriteMerged_gold.addPoint(pos);
          _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(YJSpriteMerged_gold);
          _Global.addEventListener("overlapinteractive", (buff, pos) => {
            if (buff == "addGold") {
              YJSpriteMerged_gold.RemovePos(pos);
            }
          });

          YJSpriteMerged_gold.addEventListener("收集1个", () => {
            _Global._YJPlayerFireCtrl.GetProperty().updateBasedata({ value: 1, property: "gold" });
          });
        }

        // console.log(" 生成金币 ",model);
      });
    }
    this.CollectGold = function () {
      if (YJSpriteMerged_gold) {
        YJSpriteMerged_gold.CollectGold();
        //让所有金币的trigger关闭
        let allGold = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetAllTransformByNameType("gold");
        for (let i = 0; i < allGold.length; i++) {
          const element = allGold[i];
          element.SetActive(false);
          //  element.DirectStopComponent();  //直接关闭组件，喊组件内trigger
        }
      }
    }

    this.GetModelInPool = function (folderBase) {
      for (let i = 0; i < modelPool.length; i++) {
        const element = modelPool[i];
        if (element.folderBase == folderBase && !element.transform.GetActive()) {
          return element.transform;
        }
      }
      return null;
    }
    this.AttachToPool = function (folderBase, model) {
      modelPool.push({ folderBase: folderBase, transform: model });
    }

    init();
  }
}
export { YJGame_mainCtrl };