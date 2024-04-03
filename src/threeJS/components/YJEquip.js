


import * as THREE from "three";

// 角色装备
class YJEquip {
    constructor(scope) {

        this.getWeaponModel = function () {
            return weaponModel;
        }
        // 用通用骨骼名查找真实骨骼名，其映射关系在角色模型设置中指定
        function GetRealyBoneName(_boneName) {
            let boneName = "";
            if (data.avatarData.boneList) {
                for (let i = 0; i < data.avatarData.boneList.length; i++) {
                    const element = data.avatarData.boneList[i];
                    if (element.targetBone.toLowerCase() == _boneName.toLowerCase()) {
                        boneName = element.boneName;
                    }
                }
            }
            if (boneName == "") {
                console.error(scope.GetNickName() + " 未指定真实骨骼 ");
                boneName = _boneName;
            }
            return boneName;
        }
        // 获取装备位置数据
        function GetEquipPos(_boneName, _weaponType) {

            let pos = [0, 0, 0];
            let rotaV3 = [0, 0, 0];
            let scale = [1, 1, 1];
            if (data.avatarData.equipPosList) {
                for (let i = 0; i < data.avatarData.equipPosList.length; i++) {
                    const element = data.avatarData.equipPosList[i];
                    if (element.targetBone == _boneName && element.weaponType == _weaponType) {
                        pos = element.position;
                        rotaV3 = element.rotation;
                        scale = element.scale;
                    }
                }
            }
            return { pos, rotaV3, scale };
        }

        let weaponModel = null;
        // 移除武器
        this.RemoveWeapon = function () {
            // console.log("移除武器 ",weaponData);
            if (weaponData != null) {
                let boneName = GetRealyBoneName(weaponData.boneName);
                if (boneName == "") {
                    boneName = weaponData.boneName;
                }

                //移除旧武器
                scope.GetBoneVague(boneName, (bone) => {
                    if (bone.weaponModel) {
                        bone.remove(bone.weaponModel);
                    }
                });
                weaponData = null;
            }
            scope.ChangeAnimDirect("idle");

        }
        let weaponData = null;

        let data = null;
        this.SetMessage = function (_data) {
            data = _data;
            this.RemoveWeapon();

            if (data.weaponData && data.weaponData.message) {
                this.ChangeEquip("武器", data.weaponData);
            }

            if (data.equipList && data.equipList.length > 0) {
                for (let i = 0; i < data.equipList.length; i++) {
                    const element = data.equipList[i];
                    addEquip(element.part, element.modelPath);
                }
            }
        }
        this.ChangeEquip = function (type, data) {
            if (type == "武器") {
                this.RemoveWeapon();
                weaponData = data.message.data;
                let boneName = GetRealyBoneName(weaponData.boneName);
                //加载武器
                _Global.YJ3D._YJSceneManager.DirectLoadMesh(_Global.YJ3D.$uploadUrl + data.modelPath, (meshAndMats) => {

                    scope.GetBoneVague(boneName, (bone) => {

                        // let model = (meshAndMats.mesh).scene;
                        // let _weaponModel = (meshAndMats.mesh).scene.clone();
                        // let _weaponModel = (meshAndMats.mesh).scene;
                        // let weaponModel = (meshAndMats.mesh).scene;
                        // let _weaponModel = (meshAndMats.mesh).scene.clone();

                        let _weaponModel = (meshAndMats.mesh).scene;

                        let model = new THREE.Group();
                        model.add(_weaponModel);

                        _weaponModel.position.set(0, 0, 0);
                        _weaponModel.rotation.set(0, 0, 0);
                        if (data.modelPath.includes(".fbx")) {
                            _weaponModel.scale.set(0.01, 0.01, 0.01);
                        } else {
                            _weaponModel.scale.set(1, 1, 1);
                        }

                        model.traverse(function (item) {
                            if (item instanceof THREE.Mesh) {
                                item.transform = scope;
                                item.tag = "weapon";
                            }
                        });

                        bone.attach(model);
                        bone.weaponModel = model;
                        weaponModel = model;
                        let { pos, rotaV3, scale } = GetEquipPos(weaponData.boneName, weaponData.weaponType);

                        model.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
                        model.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
                        model.scale.set(100 * scale[0], 100 * scale[1], 100 * scale[2]);
                        scope.SetPlayerState("normal");
                        scope.PathfindingCompleted();
                        // 记录材质
                        // if (materials.length == 0) {
                        //     scope.recodeMat();
                        // }
                    });
                });
            }
            if (type == "装备") {
                addEquip(data.part, data.modelPath);
            }
            if (type == "移除装备") {
                this.RemoveEquip(data.part);
            }
        }
        this.RemoveEquip = function (part) {
            let boneName = GetRealyBoneName(part);
            scope.GetBoneVague(boneName, (bone) => {
                if (bone.equip) { 
                    bone.remove(bone.equip);
                    if (part == "rightshoulder") {
                        this.RemoveEquip("leftshoulder");
                    }
                }
            });
        }

        function addEquip(part, modelPath, mirror) {


            let boneName = GetRealyBoneName(part);
            //加载装备
            _Global.YJ3D._YJSceneManager.DirectLoadMesh(_Global.YJ3D.$uploadUrl + modelPath, (meshAndMats) => {

                scope.GetBoneVague(boneName, (bone) => {

                    if (bone.equip) {
                        bone.remove(bone.equip);
                    }

                    let model = (meshAndMats.mesh).scene.clone();
                    model.traverse(function (item) {
                        if (item instanceof THREE.Mesh) {
                            item.transform = scope;
                            item.tag = part;
                        }
                    });

                    // bone.attach(model);
                    bone.add(model);
                    bone.equip = model;

                    let pos = [0, 0, 1];
                    let rotaV3 = [Math.PI / 2, 0, 0];
                    // let scale =  [1,1,1];

                    let scale = [0.5, 0.5, 0.5];
                    if (mirror) {
                        scale = [0.5, 0.5, -0.5];
                    }
                    // let pos = weaponData.position;
                    // let rotaV3 = weaponData.rotation;
                    // let scale = weaponData.scale;
                    // if(data.avatarData.equipPosList){
                    //   for (let i = 0; i < data.avatarData.equipPosList.length; i++) {
                    //     const element = data.avatarData.equipPosList[i];
                    //     if(element.targetBone ==weaponData.boneName && element.weaponType == weaponData.weaponType){
                    //       pos = element.position;
                    //       rotaV3 = element.rotation;
                    //       scale = element.scale;
                    //     }
                    //   }
                    // }
                    model.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
                    model.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
                    model.scale.set(100 * scale[0], 100 * scale[1], 100 * scale[2]);
                    // model.add(new THREE.AxesHelper(100));


                    if (part == "rightshoulder") {
                        part = "leftshoulder"
                        addEquip(part, modelPath, "mirror");
                    }

                });
            });
        }
        let laterChangeWeaponPos = null;

        this.ChangeAnim = function (v, b) {
            if (v == "readyspell" || v == "cast spell" || v == "SpellCastOmni" || v == "emoteLaugh" || v == "dance") {
                // 在施放法术时，把武器放在背上
                if (weaponModel) {
                    if (laterChangeWeaponPos != null) {
                        clearTimeout(laterChangeWeaponPos);
                    }
                    let boneName = GetRealyBoneName("Back1");
                    scope.GetBoneVague(boneName, (bone) => {
                        bone.add(weaponModel);
                        weaponModel.position.set(0, 0, 0);
                        weaponModel.rotation.set(0, Math.PI, 0);
                    });
                }
            } else {
                //武器位置还原
                if (weaponModel) {
                    if (laterChangeWeaponPos != null) {
                        clearTimeout(laterChangeWeaponPos);
                    }
                    laterChangeWeaponPos = setTimeout(() => {
                        let { pos, rotaV3, scale } = GetEquipPos(weaponData.boneName, weaponData.weaponType);
                        let boneName = GetRealyBoneName(weaponData.boneName);
                        scope.GetBoneVague(boneName, (bone) => {
                            bone.add(weaponModel);
                            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
                            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
                        });
                    }, 20);
                }
            }
            // if (scope.npcName.includes("一叶")) {
            //   console.error(scope.GetNickName() + " 切换动作 ", v);
            // } 
        }

    }
}
export { YJEquip };