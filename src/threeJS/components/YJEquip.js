


import * as THREE from "three";

// 角色装备
class YJEquip {
    constructor(owner, isLocal = true) {
        let scope = this;
        let equipList = [];
        this.GetEquipList = function () {
            return equipList;
        }
        let equipModelList = [];

        let weaponModel = null;
        let weaponData = null;
        this.GetWeaponData = function () {
            return weaponData;
        }
        let data = null;

        function init() {
            data = owner.GetData();
            // console.log(" in equip 角色数据 ", data);

            if (data.weaponData && data.weaponData.message) {
                scope.ChangeEquip("武器", data.weaponData);
            }

            if (data.equipList && data.equipList.length > 0) {
                // equipList = data.equipList;
                // for (let i = 0; i < data.equipList.length; i++) {
                //     const element = data.equipList[i];
                //     addEquip(element.part, element.modelPath);
                // }
                scope.ChangeEquipList(data.equipList);
            }
        }

        this.ChangeEquipList = function (_equipList) {
            let add = [];
            for (let i = 0; i < _equipList.length; i++) {
                let has = false;
                for (let j = 0; j < equipList.length && !has; j++) {
                    if(_equipList[i].folderBase == equipList[j].folderBase){
                        has = true;
                    }
                }
                if(!has){
                    // 提取没有的，需要添加的装备
                    add.push(_equipList[i]);
                }
            }
 
            for (let i = 0; i < add.length; i++) {
                const element = add[i];
                if (element.pointType == "weapon") {
                    scope.initWeapon({ assetId: element.folderBase });
                }
                if (element.pointType == "equip") {
                    scope.addEquip({ assetId: element.folderBase });
                }
            }

            // 提取需要减少的
            let redius = [];
            for (let i = 0; i < equipList .length; i++) {
                let has = false;
                for (let j = 0; j < _equipList.length && !has; j++) {
                    if(equipList[i].folderBase == _equipList[j].folderBase){
                        has = true;
                    }
                }
                if(!has){
                    // 提取没有的，需要添加的装备
                    redius.push(equipList[i]);
                }
            }
            console.log(" 需要减少的装备 ",redius);
            for (let i = 0; i < redius.length; i++) {
                const element = redius[i];
                if (element.pointType == "weapon") {
                    scope.RemoveEquip(element.part);
                }
                if (element.pointType == "equip") {
                    scope.RemoveEquip(element.part);
                }
            }

        }
        //#region 玩家装备
        this.initWeapon = function (weapon, callback) {
            for (let i = 0; i < equipList.length; i++) {
                const element = equipList[i];
                if (element.folderBase == weapon.assetId) {
                    return;
                }
            }
            console.error(" in 玩家装备 ", isLocal ? '' : " 玩家镜像 ", weapon);
            let path = _Global.YJ3D.$uploadUrl + weapon.assetId + "/" + "data.txt" + "?time=" + new Date().getTime();

            _Global.YJ3D._YJSceneManager.LoadAssset(path, (data) => {
                // console.log(path, data);
                weaponData = data.message.data;

                let { pickType, weaponType } = data.message.data;

                if (isLocal) {
                    owner.GetSkill().ChangeBaseSkillByWeapon(weaponData);
                    equipList.push({
                        type: "equip",
                        folderBase: weapon.assetId,
                        icon: _Global.url.uploadUrl + data.folderBase + "/" + data.icon,
                        // 武器名称
                        name: data.name,
                        // 武器类型：弓、剑、斧等
                        weaponType,
                        part: pickType,
                        qualityType: data.message.data.qualityType,
                        pointType: data.message.pointType,
                        // 攻击速度
                        speed: data.message.data.attackSpeed,
                        // 武器伤害
                        strength: data.message.data.strength ? data.message.data.strength : 20,
                        propertyList: data.message.data.propertyList,
                    });
                    owner.applyEvent('更新装备', equipList);
                } else {
                    equipList.push({
                        folderBase: weapon.assetId,
                        part: pickType,
                        pointType: data.message.pointType,
                    });
                }

                data.pos = { x: 0, y: 0, z: 0 };
                data.rotaV3 = { x: 0, y: 0, z: 0 };
                data.scale = { x: 1, y: 1, z: 1 };

                let YJPlayer = isLocal ? _Global.YJ3D.YJPlayer : owner;
                _Global.YJ3D._YJSceneManager.GetLoadUserModelManager().LoadStaticModel2(data, (transform) => {
                    //   console.log(transform);
                    let owner = transform;
                    let msg = owner.GetMessage();
                    if (msg.pointType == "weapon") {

                        let { boneName, weaponType
                            , position
                            , rotation } = msg.data;
                        let realyBoneName = boneName;
                        let boneList = YJPlayer.GetavatarData().boneList;
                        if (boneList) {
                            for (let i = 0; i < boneList.length; i++) {
                                const item = boneList[i];
                                if (item.targetBone == boneName) {
                                    realyBoneName = item.boneName;
                                }
                            }
                        }
                        let realyPos = [0, 0, 0];
                        let realyRota = [0, 0, 0];
                        let realyScale = [1, 1, 1];
                        let refBoneList = YJPlayer.GetavatarData().equipPosList;
                        if (refBoneList) {
                            for (let i = 0; i < refBoneList.length; i++) {
                                const item = refBoneList[i];
                                if (item.targetBone == boneName && item.weaponType == weaponType) {
                                    realyPos = item.position ? item.position : realyPos;
                                    realyRota = item.rotation ? item.rotation : realyRota;
                                    realyScale = item.scale ? item.scale : realyScale;
                                }
                            }
                        }

                        // 碰到武器就拾取
                        YJPlayer.GetBoneVague(realyBoneName, (bone) => {
                            let weaponModel = owner.GetGroup();
                            bone.add(weaponModel);
                            YJPlayer.addWeaponModel(weaponModel);

                            let pos = realyPos;
                            let rotaV3 = realyRota;
                            let scale = realyScale;
                            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
                            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
                            weaponModel.scale.set(100 * scale[0], 100 * scale[1], 100 * scale[2]);

                            // 绑定到骨骼后，清除trigger
                            owner.GetComponent("Weapon").DestroyTrigger();

                            equipModelList.push({ part: pickType, bone: bone, model: weaponModel });


                            if (callback) {
                                callback();
                            }
                        });
                    }
                });
            });
        }
        //#endregion



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
                console.error(owner.GetNickName() + " 未指定真实骨骼 ");
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

        // 移除武器
        this.RemoveWeapon = function () {
            // console.log("移除武器 ",weaponData);

            if (weaponData != null) {
                let boneName = GetRealyBoneName(weaponData.boneName);
                if (boneName == "") {
                    boneName = weaponData.boneName;
                }

                //移除旧武器
                owner.GetBoneVague(boneName, (bone) => {
                    if (bone.weaponModel) {
                        bone.remove(bone.weaponModel);
                    }
                });
                weaponData = null;
            } else {
                return;
            }
            owner.ChangeAnimDirect("idle");

        }
        this.addEquip = function (equip) {

            for (let i = 0; i < equipList.length; i++) {
                const element = equipList[i];
                if (element.folderBase == equip.assetId) {
                    return;
                }
            }

            let path = _Global.YJ3D.$uploadUrl + equip.assetId + "/" + "data.txt" + "?time=" + new Date().getTime();
            _Global.YJ3D._YJSceneManager.LoadAssset(path, (data) => {
                this.ChangeEquip("装备", data);
            });
        }
        this.UnWearEquip = function (part) {
            // console.log(" 取下装备  ", part); 
            this.RemoveEquip(part);

        }
        this.WearEquip = function (item) {
            // console.log(" 右键穿戴装备 ", item, equipList);
            this.UnWearEquip(item.part);
            if (item.pointType == "weapon") {
                this.initWeapon({ assetId: item.folderBase });
                return;
            }
            this.addEquip({ assetId: item.folderBase });
        }
        this.ChangeEquip = function (type, data) {
            if (type == "武器") {
                this.RemoveWeapon();
                weaponData = data.message.data;
                if (isLocal) {
                    owner.GetSkill().ChangeBaseSkillByWeapon(weaponData);
                }

                let boneName = GetRealyBoneName(weaponData.boneName);
                //加载武器
                _Global.YJ3D._YJSceneManager.DirectLoadMesh(_Global.YJ3D.$uploadUrl + data.modelPath, (meshAndMats) => {

                    owner.GetBoneVague(boneName, (bone) => {

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
                                item.transform = owner;
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
                        owner.SetPlayerState("normal");
                        owner.PathfindingCompleted();
                        // 记录材质
                        // if (materials.length == 0) {
                        //     owner.recodeMat();
                        // }
                    });
                });
            }
            if (type == "装备") {
                if (isLocal) {

                    equipList.push({
                        type: "equip",
                        // 唯一id
                        folderBase: data.folderBase,
                        icon: _Global.url.uploadUrl + data.folderBase + "/" + data.icon,
                        // 装备名称
                        name: data.name,
                        // 品质
                        qualityType: data.message.data.qualityType,
                        // 部位，唯一
                        part: data.message.data.partType,
                        // 武器或装备
                        pointType: data.message.pointType,
                        // 附加属性
                        propertyList: data.message.data.propertyList,
                    });
                    owner.applyEvent('更新装备', equipList);
                } else {
                    equipList.push({
                        folderBase: data.folderBase,
                        part: data.message.data.partType,
                        pointType: data.message.pointType,
                    });
                }

                addEquip(data.message.data.partType, data.modelPath);
            }
            if (type == "移除装备") {
                this.RemoveEquip(data.part);
            }
        }
        this.RemoveEquip = function (part) {

            // let boneName = GetRealyBoneName(part);
            // owner.GetBoneVague(boneName, (bone) => {
            //     if (bone.equip) {
            //         bone.remove(bone.equip);
            //         if (part == "rightshoulder") {
            //             this.RemoveEquip("leftshoulder");
            //         }
            //     }
            // });

            for (let i = equipList.length - 1; i >= 0; i--) {
                const element = equipList[i];
                if (part == element.part) {
                    equipList.splice(i, 1);
                }
            }
            if (isLocal) {
                owner.applyEvent('更新装备', equipList);
            }

            for (let i = equipModelList.length - 1; i >= 0; i--) {
                const element = equipModelList[i];
                if (part == "shoulder") {
                    if ("rightshoulder" == element.part || "leftshoulder" == element.part) {
                        element.bone.remove(element.model);
                        equipModelList.splice(i, 1);
                    }
                } else {

                    if (part == element.part) {
                        element.bone.remove(element.model);
                        equipModelList.splice(i, 1);
                    }

                }
            }
            if (part == "twoHand"
                || part == "mainHand"
                || part == "oneHand"
                || part == "ranged"
            ) {
                weaponData = null;
                if (isLocal) {
                    owner.GetSkill().ChangeBaseSkillByWeapon(weaponData);
                }
                owner.ChangeAnimDirect("idle");

            }
        }

        function addEquip(part, modelPath, mirror) {

            if (part == 'shoulder') {
                part = 'rightshoulder';
            }
            let boneName = GetRealyBoneName(part);
            //加载模型
            _Global.YJ3D._YJSceneManager.DirectLoadMesh(_Global.YJ3D.$uploadUrl + modelPath, (meshAndMats) => {
                // console.log(" 添加装备 ", boneName, modelPath);

                owner.GetBoneVague(boneName, (bone) => {

                    if (bone.equip) {
                        bone.remove(bone.equip);
                    }

                    let model = (meshAndMats.mesh).scene.clone();
                    model.traverse(function (item) {
                        if (item instanceof THREE.Mesh) {
                            item.transform = owner;
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


                    equipModelList.push({ part: part, bone: bone, model: model });

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
                    owner.GetBoneVague(boneName, (bone) => {
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
                        owner.GetBoneVague(boneName, (bone) => {
                            bone.add(weaponModel);
                            weaponModel.position.set(1 * pos[0], 1 * pos[1], 1 * pos[2]);
                            weaponModel.rotation.set(rotaV3[0], rotaV3[1], rotaV3[2]);
                        });
                    }, 20);
                }
            }
            // if (owner.npcName.includes("一叶")) {
            //   console.error(owner.GetNickName() + " 切换动作 ", v);
            // } 
        }
        init();

    }
}
export { YJEquip };