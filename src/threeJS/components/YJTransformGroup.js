
import * as THREE from "three";

// 模型组合
class YJTransformGroup {
  constructor(_this, scene, owner, hasCollider, noShadow,tag) {
    let scope = this;
    //#region  SetMessage
    
    this.SetMessage = function (msg) {
      if (msg == null || msg == undefined || msg == "") { return; }
      // data = JSON.parse(msg);
      data = (msg);
      scope.id = scope.transform.id;
      console.log("in 组合 msg = ", scope.id, data);

      return;
      this.npcName = data.name;
      baseData = data.baseData;
      if (baseData.camp == "bl") {
        baseData.camp = 1001;
      }
      nameScale = data.avatarData.nameScale;
      playerHeight = data.avatarData.height;
      CreateNameTrans(this.npcName);
      scope.transform.isIgnoreRaycast = true;
      // 第一次加载时，把数据加入到全局角色数据中
      _Global.CreateOrLoadPlayerAnimData().AddAvatarData(data.avatarData);

      _YJAnimator.SetAnimationsData(data.avatarData.animationsData);

      if (data.skillList == undefined) {
        data.skillList = [];
      }
      skillList = data.skillList;
      if (data.movePos && data.movePos.length > 0) {
        this.UpdateNavPos("停止巡逻", data.movePos);
        // AddDirectPosToNavmesh(data.movePos);
      }
      this.RemoveWeapon();

      if (data.weaponData && data.weaponData.message) {
        weaponData = data.weaponData.message.data;

        //加载武器
        _this._YJSceneManager.DirectLoadMesh(_this.$uploadUrl + data.weaponData.modelPath, (meshAndMats) => {
          scope.GetBoneVague(weaponData.boneName, (bone) => {

            let weaponModel = (meshAndMats.mesh).scene.clone();
            weaponModel.traverse(function (item) {
              if (item instanceof THREE.Mesh) {
                item.transform = scope;
                item.tag = "weapon";
              }
            });

            bone.attach(weaponModel);
            bone.weaponModel = weaponModel;
            let pos = weaponData.position;
            let rotaV3 = weaponData.rotation;
            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
            weaponModel.scale.set(100, 100, 100);
            scope.ChangeAnim("none");
            scope.SetPlayerState("normal");
            this.PathfindingCompleted();
            // 记录材质
            if (materials.length == 0) {
              recodeMat();
            }
          });
        });
      }
      if (weaponData == null) {
        scope.ChangeAnim("none");
        scope.SetPlayerState("normal");
        this.PathfindingCompleted();
        // 记录材质
        if (materials.length == 0) {
          recodeMat();
        }
      }
      fireBeforePos = scope.GetWorldPos();

      if (data.isCopy) {
        skillList = [];
        ClearFireLater();
      }
    }
    //#endregion 
    //删除模型
    this.Destroy = function () { 
    } 
  }
}

export { YJTransformGroup };