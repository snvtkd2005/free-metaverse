


import * as THREE from "three";

class YJSkillModel {
    constructor(owner) {
        let scope = this;

        function init() {

        }

        let controlModels = [];
        let controlFnLater = null;
        function AddControlModel(type, modelTransform) {
            controlModels.push({ type, modelTransform });
        }
        function HasControlModel(type) {
            for (let i = 0; i < controlModels.length; i++) {
                const element = controlModels[i];
                if (element.type == type) {
                    return true;
                }
            }
            return false;
        }

        this.ClearControlModel = function () {

            if (controlModels.length > 0) {
                for (let i = controlModels.length - 1; i >= 0; i--) {
                    const item = controlModels[i];
                    if (item.modelTransform == "merged") {
                        let msg = {
                            title: "移除静态模型",
                            folderBase: item.type,
                            id: owner.id,
                        }
                        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().RemoveSkillByFolderBase(
                            item.type, msg);
                        controlModels.splice(i, 1);
                        continue;
                    }
                    item.modelTransform.Destroy();
                    controlModels.splice(i, 1);
                    let msg = {
                        title: "移除组合模型",
                        folderBase: item.type,
                        id: owner.id,
                    }
                    scope.ReceiveControl(msg, true);
                }
            }
        }

        this.RemoveSkill = function (skill) {
            // console.log(" 解除技能 Skill ", skill);
            let particleId = skill.particleId;

            if (skill.type == "control") {

            }
            if (skill.type == "shield") {

            } 

            for (let i = controlModels.length - 1; i >= 0; i--) {
                const item = controlModels[i];
                if (item.type == particleId) {
                    if (item.modelTransform == "merged") {
                        let msg = {
                            title: "移除静态模型",
                            folderBase: particleId,
                            id: owner.id,
                        }
                        // _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().RemoveSkillByFolderBase(
                        //     particleId, msg);

                        scope.ReceiveControl(msg, true);
                        controlModels.splice(i, 1);
                        continue;
                    }
                    item.modelTransform.Destroy();
                    controlModels.splice(i, 1);
                    let msg = {
                        title: "移除组合模型",
                        folderBase: particleId,
                        id: owner.id,
                    }
                    scope.ReceiveControl(msg, true);
                }
            }
        }
        this.ReceiveControl = function (msg, needDync) {
            if (needDync) {
                _Global.DyncManager.SendDataToServer("同步角色控制技能状态",
                    {
                        userId: _Global.user.id,
                        fromId: owner.id,
                        fromType: owner.getPlayerType(),
                        msg: msg
                    });
                // console.log("发送 同步技能 ", msg);

            } else {
                // console.log("接收 同步技能 ", msg);
            }

            let { title, folderBase, id, pos, scale } = msg;
            if (title == "生成静态模型") {
                if (HasControlModel(folderBase)) {
                    return false;
                }

                AddControlModel(folderBase, 'merged');
                // 静态物体使用合批的方法做法
                _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillFolderBaseByMSG(folderBase, msg);
                return;
            }

            if (title == "生成组合模型") {
                if (HasControlModel(folderBase)) {
                    return false;
                }
                _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillGroup(folderBase, (model) => {
                    model.SetPos(owner.GetWorldPos());
                    let nameScale = owner.GetScale();
                    model.SetScale(new THREE.Vector3(nameScale, nameScale, nameScale));
                    owner.GetGroup().attach(model.GetGroup());
                    model.SetActive(true);
                    AddControlModel(folderBase, model);
                });
                return;
            }

            if (title == "移除静态模型") {
                for (let i = controlModels.length - 1; i >= 0; i--) {
                    const item = controlModels[i];
                    if (item.type == folderBase) {
                        if (item.modelTransform == "merged") {
                            // 静态物体使用合批的方法做法
                            _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().RemoveSkillByFolderBase(folderBase, msg);
                            controlModels.splice(i, 1);
                            continue;
                        }
                    }
                }
                return;
            }
            if (title == "移除组合模型") {
                // 静态物体使用合批的方法做法
                _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().RemoveSkillByFolderBase(folderBase, msg);
                for (let i = controlModels.length - 1; i >= 0; i--) {
                    const item = controlModels[i];
                    if (item.type == folderBase) {
                        item.modelTransform.Destroy();
                        controlModels.splice(i, 1);
                    }
                }
                return;
            }

        }

        // 自身施放的技能
        this.SendSkill = function (msg, needDync) {

            if (needDync) {
                _Global.DyncManager.SendDataToServer("同步角色施放技能状态",
                    {
                        userId: _Global.user.id,
                        fromId: owner.id,
                        fromType: owner.getPlayerType(),
                        msg: msg
                    });
                // console.log("发送 同步施放技能 ", msg);

            } else {
                // console.log("接收 同步施放技能 ", msg);
            }

            let { title, folderBase, id, pos, scale } = msg;
            if (title == "冰霜新星") {
                // 冰环特效
                _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillGroup(folderBase, (model) => {
                    model.SetPos(owner.GetWorldPos());
                    model.SetActive(true);
                });
            }
            if (title == "寒冰护体") {
                if (HasControlModel(folderBase)) {
                    return false;
                }
                _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillGroup(folderBase, (model) => {
                    model.SetPos(owner.GetWorldPos());
                    let nameScale = owner.GetScale();
                    model.SetScale(new THREE.Vector3(nameScale, nameScale, nameScale));
                    owner.GetGroup().attach(model.GetGroup());
                    model.SetActive(true);
                    AddControlModel(folderBase, model);
                });
                return;
            }
        }

        init();

    }
}
export { YJSkillModel }