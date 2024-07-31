


import * as THREE from "three";

class YJSkill {
    constructor(owner) {
        let scope = this;
        let targetModel = null;
        let baseData = null;
        function init() {
            owner.addEventListener("首次进入战斗", () => {
                CheckSkill();
            });
            owner.addEventListener("施法中断", () => {
                if (inSkill) {
                    skillEnd(null, "施法中断");
                }
            });

            owner.addEventListener("同步技能", (msg) => {
                Dync(msg);
            });

            owner.addEventListener("解除技能", (skill) => {
                RemoveSkill(skill);
            });

            owner.addEventListener("healthChange", () => {
                CheckSkill_Health();
            });
            owner.addEventListener("死亡或离开战斗", () => {
                ClearFireLater();
                ClearControlModel();

                if (hyperplasiaTrans.length > 0) {
                    for (let i = 0; i < hyperplasiaTrans.length; i++) {
                        hyperplasiaTrans[i].Dead();
                    }
                    hyperplasiaTrans = [];
                }

            });
            owner.addEventListener("重生", () => {
                skillEnd(null, "重生");
            });

            owner.addEventListener("攻击", (_skillName, particle) => {
                skillName = _skillName;
            });
            owner.addEventListener("基础攻击目标", (_targetModel) => {
                targetModel = _targetModel;

                if (owner.GetNickName().includes('落地水') && targetModel.GetCamp() == owner.GetCamp()) {
                    console.error(owner.GetNickName() + "000设置目标为同阵营角色: ", targetModel);
                }
            });
            owner.addEventListener("设置目标", (_targetModel) => {
                // if(_targetModel.isYJTransform){
                //     targetModel = _targetModel.GetComponent("NPC");
                // }
                targetModel = _targetModel;

                if (owner.GetNickName().includes('落地水') && targetModel.GetCamp() == owner.GetCamp()) {
                    console.error(owner.GetNickName() + "111设置目标为同阵营角色: ", targetModel);
                }
            });


            baseData = owner.GetBaseData();
        }

        this.SetSkillCDRate = function (rate) {

            rate = 1 - rate;
            if (rate <= 0) { rate = 0; }
            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];
                if (skillItem.trigger.type == "perSecond") {
                    skillItem.trigger.CD = skillItem.CONSTCD * rate;
                    skillItem.CD = skillItem.CONSTCD * rate;
                    if (skillItem.CD <= 0) {
                        skillItem.CD = 0.5;
                    }
                    if (skillItem.cCD > skillItem.CD) {
                        skillItem.cCD = skillItem.CD;
                    }
                    owner.applyEvent("技能CD", skillItem.skillName, skillItem.cCD, skillItem.CD);

                }
            }
        }
        this.SetSkillAuto = function (skillName, b) {
            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];
                if (skillItem.skillName == skillName) {
                    skillItem.auto = b;
                }
            }
        }

        this.ClearSkill = function (ingnorSkillName) {
            for (let i = skillList.length - 1; i >= 0; i--) {
                const skill = skillList[i];
                if (skill.skillName == ingnorSkillName) {
                    continue;
                }
                skillList.splice(i, 1);
                owner.applyEvent("移除技能", skill);
            }

        }
        this.SetSkill = function (_skillList, _baseData) {
            skillList = _skillList;
            baseData = _baseData;
        }
        this.AddSkill = function (_skill) {
            for (let i = 0; i < skillList.length; i++) {
                const skill = skillList[i];
                if (skill.skillName == _skill.skillName) {

                    return;
                }
            }
            skillList.push(_skill);
            CheckSkill_Persecond(_skill);
            owner.applyEvent("添加技能", _skill);
            // console.log(" 添加技能 ", _skill);
        }
        this.EditorSkill = function (_skill) {
            for (let i = 0; i < skillList.length; i++) {
                const skill = skillList[i];
                if (skill.skillName == _skill.skillName) {
                    skill = _skill;
                    return;
                }
            }
        }
        this.GetinSkill = function () {
            return inSkill;
        }
        // 死亡或离开战斗时，清除延迟执行事件
        function ClearFireLater() {
            for (let i = 0; i < fireLater.length; i++) {
                if (fireLater[i].type == "interval") {
                    clearInterval(fireLater[i].fn);
                }
                if (fireLater[i].type == "timeout") {
                    clearTimeout(fireLater[i].fn);
                }
            }
            fireLater = [];
            healthTrigger = [];
            if (oldSkillList.length != 0) {
                skillList = JSON.parse(JSON.stringify(oldSkillList));
            }
            EventHandler("中断技能");
        }
        function ReceiveControl(_targetModel, skillName, effect, skillItem) {
            let { type, value, time, duration, describe, icon, fromName } = effect;
            effect.skillName = skillName || skillItem.skillName;

            _Global.DyncManager.SendDataToServer("受到技能",
                {
                    fromId: owner.id,
                    skillItem: skillItem
                });


            if (type == "control") {

                let controlId = effect.controlId;
                let { receiveEffect } = skillItem;

                owner.inControl = true;
                if (skillItem.hasReceiveEffect) {

                    if (HasControlModel(receiveEffect.particleId)) {
                        return false;
                    }


                    let fn = (model) => {
                        model.SetPos(owner.GetWorldPos());
                        let nameScale = owner.GetScale();
                        model.AddScale(new THREE.Vector3(nameScale, nameScale, nameScale));
                        model.SetActive(true);
                        AddControlModel(receiveEffect.particleId, model);
                        _Global._YJGame_mainCtrl.AttachToPool(receiveEffect.particleId, model);
                    }
                    let transform = _Global._YJGame_mainCtrl.GetModelInPool(receiveEffect.particleId);
                    if (transform != null) {
                        fn(transform);
                    } else {
                        _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillByFolderBase(
                            receiveEffect.particleId, (model) => {
                                fn(model);
                            });
                    }

                }

                owner.SetPlayerState("停止移动");

                if (controlFnLater != null) {
                    clearTimeout(controlFnLater);
                }
                controlFnLater = setTimeout(() => {

                    RemoveSkill({ type: "control", particleId: receiveEffect.particleId });
                }, duration * 1000);

                return;
            }
            if (type == "shield") {

                effect.particleId = skillItem.skillFireParticleId;
                // console.log( effect);
                owner.GetBuff().addBuff(effect);

                if (HasControlModel(skillItem.skillFireParticleId)) {
                    return false;
                }
                _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillGroup(skillItem.skillFireParticleId, (model) => {
                    model.SetPos(owner.GetWorldPos());
                    let nameScale = owner.GetScale();
                    model.SetScale(new THREE.Vector3(nameScale, nameScale, nameScale));
                    owner.GetGroup().attach(model.GetGroup());
                    model.SetActive(true);
                    AddControlModel(skillItem.skillFireParticleId, model);
                });


                return;
            }

        }

        this.ReceiveSkill = function (fromModel, skillName, effect, skillItem) {
            let { type, time, duration, describe, icon } = effect;
            effect.skillName = skillName || skillItem.skillName;
            effect.describe = describe;

            if (type == "control" || type == "shield") {
                ReceiveControl(fromModel, skillName, effect, skillItem);
                return;
            }

            if (type == "perDamage") {
                owner.GetBuff().addDebuff(effect);
                owner.CombatLog(fromModel.GetNickName(), owner.GetNickName(), "技能攻击", skillName);
                return;
            }
            let addredius = "redius";
            let value = effect.value;
            if (type == "addHealth") {
                // owner.updateByCard({ type: "basicProperty", property: "health", value: value });
                baseData.health += value;
                addredius = "add";
                owner.CombatLog(fromModel.GetNickName() + " 治疗 " + owner.GetNickName() + " 恢复 " + value + " 点生命 ");
            }
            // 直接伤害 或 持续伤害
            if (type == "damage" || type == "contDamage") {
                value = owner.GetProperty().RealyDamage(value);
                baseData.health -= value;
                owner.CombatLog(fromModel.GetNickName() + " 攻击 " + owner.GetNickName() + " 造成 " + value + " 点伤害 ");
                owner.CheckMaxDamage(fromModel.id, value);

            }

            owner.CheckHealth(fromModel.GetNickName());

            _Global._SceneManager.UpdateNpcDamageValue(
                fromModel.id,
                fromModel.GetNickName(),
                owner.GetNickName(),
                owner.id,
                owner.GetCamp(),
                value,
                owner.GetDamageTextPos(),
                addredius
            );


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
        function RemoveSkill(skill) {
            // console.log(" 解除技能 Skill ", skill);
            let particleId = skill.particleId;

            if (skill.type == "control") {
                owner.inControl = false;
            }
            if (skill.type == "shield") {
                owner.GetBuff().removeBuffById(skill.id);
            }
            for (let i = controlModels.length - 1; i >= 0; i--) {
                const item = controlModels[i];
                if (item.type == particleId) {
                    item.modelTransform.Destroy();
                    controlModels.splice(i, 1);
                }
            }

            // _Global.DyncManager.SendDataToServer("解除技能",
            //     {
            //         fromId: owner.id,
            //         particleId: particleId
            //     });
        }
        function ReceiveSkill(effect, skillItem) {
            if (effect.controlId == "冰霜新星") {
                // _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().CopyModel("冰霜新星模型", (model) => {
                //     model.SetPos(owner.GetWorldPos());
                //     let nameScale = owner.GetScale();
                //     model.AddScale(new THREE.Vector3(nameScale, nameScale, nameScale));
                //     model.SetActive(true);
                //     AddControlModel(skillName, model);
                // });
            }
            if (type == "shield") {

                // _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().CopyModel("寒冰护体", (model) => {
                //     model.SetPos(owner.GetWorldPos());
                //     let nameScale = owner.GetScale();
                //     model.SetScale(new THREE.Vector3(nameScale, nameScale, nameScale));
                //     owner.GetGroup().attach(model.GetGroup());
                //     model.SetActive(true);
                //     AddControlModel(skillName, model);
                // });
            }
            return true;


        }
        function ClearControlModel() {

            if (controlModels.length > 0) {
                for (let i = controlModels.length - 1; i >= 0; i--) {
                    const item = controlModels[i];
                    item.modelTransform.Destroy();
                    controlModels.splice(i, 1);
                }
            }
        }

        function Dync(msg) {
            if (msg.title == "npc技能") {
                //取消寻路，让npc站住施法
                owner.SetNavPathToNone();
                let skillItem = msg.skill;
                if (skillItem == "中断") {
                    EventHandler("中断技能");
                    return;
                }
                return;
            }
            if (msg.title == "解除技能") {
                let skill = msg.skill;
                RemoveSkill(skill);

                return;
            }
            if (msg.title == "受到技能") {
                let skill = msg.skill;
                scope.ReceiveSkill('', '', skill.effect, skill);
                return;
            }
            if (msg.title == owner.owerType('技能攻击')) {
                let skill = msg.skill;
                //增生
                if (skill.type == "hyperplasia") {
                    let { value, times } = skill;
                    hyperplasiaTimes = times;
                    let modelData = owner.GetData();
                    hyperplasia(modelData, 0, value, times);
                    return;
                }
                //进化
                if (skill.type == "evolution") {
                    let { value } = skill;

                    oldSkillList = JSON.parse(JSON.stringify(skillList));
                    // 所有技能伤害增加v%
                    for (let i = 0; i < skillList.length; i++) {
                        const skillItem = skillList[i];
                        // 触发方式 每间隔n秒触发。在进入战斗时调用
                        if (skillItem.target.type != "none") {
                            skillItem.effect.value += skillItem.effect.value * value * 0.01;
                        }
                    }
                    return;
                }

                SkillGo(skill);
                return;
            }
        }


        let readyskillAudioName = "";
        let skillName = "";
        let vaildAttackDis = 3; //有效攻击距离
        // 攻击速度，攻击间隔，判定有效的攻击时机
        let attackStepSpeed = 3; //攻击间隔/攻击速度
        function skillEnd(skillItem, e) {
            inSkill = false;
            clearCastSkill();
            if (skillItem) {
                if(skillItem.cCD == skillItem.CD){
                    skillItem.cCD = 0;
                }
                // console.log(skillItem.skillName + e);
                _Global._YJAudioManager.stopAudio(readyskillAudioName);
                owner.skillEnd();
            } else {
                // if (e) {
                //     console.log(e);
                // }
            }
            owner.SetValue("readyAttack_doonce", 0);

        }
        this.UseSkill = function (skillItem) {

            // console.log(" 手动触发 ",skillItem);
            SkillGo(skillItem);
        }
        let skillCastTime = 0;
        //施放技能
        function SkillGo(skillItem) {
            if (owner.isDead) {
                return false;
            }
            if (inSkill) { return; }

            inSkill = true;
            let { animName, animNameReady, skillName, target, effect } = skillItem;

            effect.skillName = skillItem.skillName;
            readyskillAudioName = skillName;


            vaildAttackDis = skillItem.vaildDis;
            attackStepSpeed = skillItem.castTime;
            skillCastTime = skillItem.castTime * (1 - baseData.basicProperty.hasteLevel);
            // console.log(" baseData ",baseData);
            owner.SetVaildAttackDis(vaildAttackDis);

            let { skillFireAudio, skillFirePart, skillFireParticleId, skillReadyAudio, skillReadyParticleId } = skillItem;
            let areaTargets = [];
            let errorLog = "";
            let checkCan = () => {
                let targetType = skillItem.target.type;
                if (targetType == "target") {
                    if (targetModel == null) {
                        errorLog = "无目标";
                        return false;
                    }
                    if ((targetModel && targetModel.isDead)) {
                        errorLog = "目标已死亡";
                        return false;
                    }
                    let distance = owner.GetWorldPos().distanceTo(targetModel.GetWorldPos());
                    if (distance > vaildAttackDis) {
                        errorLog = ("与目标距离过远 " + distance + '/' + vaildAttackDis);
                        return false;
                    }

                    if (owner.GetCamp() == targetModel.GetCamp()) {
                        errorLog = "攻击目标为同阵营角色";
                        return false;
                    }
                }
                // 范围攻击
                if (targetType == "area") {
                    let max = skillItem.target.value;
                    areaTargets = _Global._YJFireManager.GetOtherNoSameCampInArea(owner.GetCamp(), vaildAttackDis, max, owner.GetWorldPos());
                    // console.error(owner.GetNickName()+" 范围攻击目标 ",areaTargets);
                    // 范围内无目标，不施放技能
                    if (areaTargets.length == 0) {
                        errorLog = "有效范围内无目标";
                        return false;
                    }
                }

                if (targetType.includes("random")) {
                    if (targetType.includes("Friendly")) {
                        // 找友方目标 
                        searchModel = _Global._YJFireManager.GetSameCampByRandom(owner.GetCamp());
                    } else {
                        // 找敌对阵营的目标
                        searchModel = _Global._YJFireManager.GetNoSameCampByRandom(owner.GetCamp());
                    }
                    // 随机进没目标时，返回false 不施放技能
                    if (searchModel == null) {
                        errorLog = "随机查找无目标";
                        return false;
                    }
                    if (searchModel != null && searchModel.isDead) {
                        owner.TargetDead();
                        errorLog = "随机查找目标已死亡";
                        return false;
                    }
                }


                if (targetType == "none" || targetType == "self" || targetType == "selfPos") {
                    let { type, value, time, duration, describe, controlId } = effect;

                    if (type == "addHealth") {
                        if (baseData.health == baseData.maxHealth) {
                            errorLog = "目标生命值已满";
                            return false;
                        }
                    }
                }

                if (targetType.includes("minHealth")) {
                    if (targetType.includes("Friendly")) {
                        // 最少生命值的友方,包含自身
                        searchModel = _Global._YJFireManager.GetSameCampMinHealth(owner.GetCamp());
                        if (searchModel == null) {
                            errorLog = "友方最小生命值无目标";
                            return false;
                        }
                    } else {
                    }
                    if (searchModel == null) {
                        errorLog = "最小生命值无目标";
                        return false;
                    }
                }

                return true;
            }

            if (!checkCan()) {
                if (skillName != "基础攻击" && owner.GetNickName().includes('居民')) {
                    console.error(owner.GetNickName() + skillName + "施放失败: " + errorLog, targetModel);
                }
                inSkill = false;
                return false;
            }

            // if (owner.GetNickName().includes("l老a")) {
            // console.error(owner.GetNickName() + "施放技能", skillItem.cCD, skillItem.CD, skillItem);
            // }

            let fn = () => {

                let targetType = skillItem.target.type;
                if (targetType == "target") {
                    let { type, skillName, value, time, duration, describe, controlId } = effect;
                    if (effect.type == "control") {
                        if (controlId == "冲锋") {
                            //移动速度提高，冲向目标
                            owner.MoveToTargetFast();
                        }
                    }
                    else if (effect.type == "damage") {
                        vaildAttackLater2 = setTimeout(() => {
                            if (targetModel == null || targetModel.isDead) {
                                EventHandler("中断技能");
                                return;
                            }
                            SendDamageToTarget(targetModel, effect, skillItem);
                        }, skillCastTime * 100);
                    }
                    //面向目标
                    owner.LookatTarget(targetModel);
                }

                // 范围攻击
                if (targetType == "area") {
                    if (effect.type == "damage") {
                        for (let l = 0; l < areaTargets.length; l++) {
                            if (areaTargets[l].isDead) {
                                continue;
                            }
                            SendDamageToTarget(areaTargets[l], effect, skillItem);
                        }
                    }
                    else if (effect.type == "control") {
                        if (effect.controlId == "冰霜新星") {
                            SendSkill(effect, skillItem);
                            return true;
                        }
                        if (effect.controlId == "嘲讽") {
                            console.log(owner.GetNickName() + " 嘲讽 ", vaildAttackDis, areaTargets, skillItem);
                            for (let l = 0; l < areaTargets.length; l++) {
                                if (areaTargets[l].isDead) {
                                    continue;
                                }
                                areaTargets[l].SetNpcTargetToNoneDrict();
                                areaTargets[l].SetNpcTarget(owner, true, false);
                            }
                            //有效攻击 && 
                            // SendSkill(effect, skillItem);
                            //瞬发技能直接同步
                            // _Global.DyncManager.SendDataToServer(owner.owerType('技能攻击'),
                            //     {
                            //         fromId: owner.id,
                            //         fromType: owner.getPlayerType(),
                            //         targetType: "",
                            //         targetId: '',
                            //         skillItem: skillItem
                            //     });
                        }

                    }

                }

                if (targetType.includes("random")) {

                    if (targetType.includes("Friendly")) {
                        // 找友方目标 
                        searchModel = _Global._YJFireManager.GetSameCampByRandom(owner.GetCamp());
                    } else {
                        // 找敌对阵营的目标
                        searchModel = _Global._YJFireManager.GetNoSameCampByRandom(owner.GetCamp());
                    }
                    // 随机进没目标时，返回false 不施放技能
                    if (searchModel == null) {
                        return false;
                    }
                    if (searchModel != null && searchModel.isDead) {
                        owner.TargetDead();
                        return false;
                    }
                    vaildAttackLater2 = setTimeout(() => {
                        if (searchModel == null) {
                            return;
                        }
                        if (searchModel != null && searchModel.isDead) {
                            EventHandler("中断技能");
                            return;
                        }
                        //有效攻击 && 
                        SendDamageToTarget(searchModel, skillItem.effect, skillItem);
                        
                    }, skillCastTime * 100);
                }

                if (targetType == "self") {
                    // scope.ReceiveSkill(owner,skillItem.skillName,effect,skillItem);
                    _Global.DyncManager.SendDataToServer(getSendTitle(owner),
                        {
                            fromId: owner.id,
                            fromType: owner.getPlayerType(),
                            targetType: owner.getPlayerType(),
                            targetId: owner.id,
                            skillItem: skillItem
                        });
                }
                if (targetType == "none" || targetType == "selfPos") {
                    //有效攻击 && 
                    if (!SendSkill(effect, skillItem)) {
                        return false;
                    }
                    _Global.DyncManager.SendDataToServer(owner.owerType('技能攻击'),
                        {
                            fromId: owner.id,
                            fromType: owner.getPlayerType(),
                            targetType: owner.getPlayerType(),
                            targetId: owner.id,
                            skillItem: skillItem
                        });
                }

                if (targetType.includes("minHealth")) {
                    if (targetType.includes("Friendly")) {

                    } else {
                    }

                    //有效攻击 && 
                    SendDamageToTarget(searchModel, effect, skillItem);
                }
            }
            let contDamageFn = () => {

                let targetType = skillItem.target.type;
                if (targetType == "target") {
                    let { type, skillName, value, time, duration, describe, controlId } = effect;
                    let num = 0;
                    let count = parseInt(skillItem.castTime / effect.time);
                    for (let k = 0; k < count; k++) {
                        castSkillList.push(setTimeout(() => {
                            // 目标攻击
                            if (targetModel == null || targetModel.isDead) {
                                skillEnd(skillItem, "中断");
                                EventHandler("中断施法");
                                return;
                            }
                            skillItem.cCD = 0;
                            //再次判断距离
                            let dis = owner.GetTargetModelDistance();
                            // console.log(" contDamageFn ",dis,vaildAttackDis);
                            if (dis > vaildAttackDis) {
                                skillEnd(skillItem, "中断");
                                EventHandler("中断施法");
                                return;
                            }
                            SendDamageToTarget(targetModel, effect, skillItem);
                            num++;
                            if (num == count) {
                                skillEnd(skillItem, "结束");
                            }
                        }, effect.time * k * 1000));
                    }
                    //面向目标
                    owner.LookatTarget(targetModel);
                }
                // 范围攻击
                if (targetType == "area") {

                    // 持续伤害
                    let num = 0;
                    let count = parseInt(skillItem.castTime / effect.time);
                    for (let k = 0; k < count; k++) {
                        castSkillList.push(setTimeout(() => {
                            if (!checkCan()) {
                                skillEnd(skillItem, "中断");
                                EventHandler("中断施法");
                                return;
                            }
                            for (let l = 0; l < areaTargets.length; l++) {
                                if (areaTargets[l].isDead) {
                                    continue;
                                }
                                SendDamageToTarget(areaTargets[l], effect, skillItem);
                                // console.error(owner.GetNickName() + " 范围攻击目标 持续伤害 ", areaTargets[l], effect, skillItem);
                            }
                            skillItem.cCD = 0;
                            num++;
                            if (num == count) {
                                skillEnd(skillItem, "结束");
                            }
                        }, effect.time * k * 1000));
                    }

                }

                if (targetType.includes("random")) {

                }


                if (targetType == "none" || targetType == "self" || targetType == "selfPos") {


                }

                if (targetType.includes("minHealth")) {

                }
            }


            if (skillCastTime > 0) {


                owner.playAudio(skillItem.skillReadyAudio, readyskillAudioName);
                owner.SetPlayerState("吟唱", skillItem.animNameReady);
                //取消寻路，让npc站住施法
                owner.SetNavPathToNone();
                // console.time('施法成功===');


                //contDamage 技能需要边施法边执行，所以要单独判断
                if ((effect.type == "contDamage")) {
                    owner.skillProgress(skillCastTime, skillName, true);
                    contDamageFn();
                } else {
                    owner.skillProgress(skillCastTime, skillName);

                    vaildAttackLater = setTimeout(() => {

                        if (!checkCan()) {
                            skillEnd(skillItem, "中断");
                            return;
                        }

                        owner.SetPlayerState("施法", skillItem.animName);
                        owner.playAudio(skillItem.skillFireAudio, readyskillAudioName);
                        skillEnd(skillItem, "结束");
                        fn();
                        // console.timeEnd('施法成功==='); 
                    }, skillCastTime * 1000);
                }
            } else {
                owner.SetPlayerState("施法", skillItem.animName);
                owner.playAudio(skillItem.skillFireAudio, readyskillAudioName);
                fn();
                skillEnd(skillItem, "结束");
            }
            return true; 

        }

        let skillList = [];
        let oldSkillList = [];
        let hyperplasiaTimes = 0;
        this.SendSkill = function (effect, skillItem) {
            SendSkill(effect, skillItem);
        }
        // 施放不需要目标或目标是自身的技能 如 增生
        function SendSkill(effect, skillItem) {
            let { type, skillName, value, time, duration, describe, controlId } = effect;
            // console.log("施放不需要目标或目标是自身的技能 00 ", effect, skillItem);
            if (type == "shield" || type == "control") {
                //
                // console.log("施放不需要目标或目标是自身的技能 ", controlId);
                if (type == "shield") {
                    ReceiveControl(owner, skillName, effect, skillItem);
                    return true;
                }
                if (type == "control") {

                    // 冻结20米内的敌人。 冰霜新星冻结特效
                    let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFireInVailDis(owner.GetWorldPos(), owner.GetCamp(), skillItem.vaildDis);
                    if (npcs.length == 0) {
                        return false;
                    }
                    effect.value = 0;
                    for (let i = 0; i < npcs.length; i++) {
                        const npcComponent = npcs[i];
                        npcComponent.ReceiveSkill(owner, skillName, effect, skillItem);
                    }
                    _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillGroup(skillItem.skillFireParticleId, (model) => {
                        model.SetPos(owner.GetWorldPos());
                        model.SetActive(true);
                    });
                    return true;
                }
                //

                // console.log("施放不需要目标或目标是自身的技能 ", controlId);

                // if (controlId == "冰霜新星") {
                //     // 冻结20米内的敌人。 冰霜新星冻结特效
                //     let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFireInVailDis(owner.GetWorldPos(), owner.GetCamp(), 20);
                //     if (npcs.length == 0) {
                //         return false;
                //     }
                //     effect.value = 0;
                //     for (let i = 0; i < npcs.length; i++) {
                //         const npcComponent = npcs[i];
                //         npcComponent.ReceiveDamageByPlayer(null, controlId, effect);
                //     }

                //     // 冰霜新星施放特效
                //     _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().CopyModel("冰霜新星", (model) => {
                //         model.SetPos(owner.GetWorldPos());
                //         model.SetActive(true);
                //     });
                // }
            }
            //
            if (type == "addHealth") {
                owner.updateByCard({ type: "basicProperty", property: "health", value: value });
            }
            //增生
            if (type == "hyperplasia") {
                effect.times = hyperplasiaTimes;
                let modelData = owner.GetData();
                hyperplasiaTimes++;
                hyperplasia(modelData, 0, value, hyperplasiaTimes);
            }
            //进化
            if (type == "evolution") {
                oldSkillList = JSON.parse(JSON.stringify(skillList));

                // 所有技能伤害增加v%
                for (let i = 0; i < skillList.length; i++) {
                    const skillItem = skillList[i];
                    // 触发方式 每间隔n秒触发。在进入战斗时调用
                    if (skillItem.target.type != "none") {
                        skillItem.effect.value += skillItem.effect.value * value * 0.01;
                    }
                }
            }
            return true;
        }
        let fireLater = [];
        let inSkill = false;//是否在使用施法技能攻击
        let skillCDlist = [];

        // 每次进入战斗，初始化其技能
        function CheckSkill() {
            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];
                // 触发方式 每间隔n秒触发。在进入战斗时调用
                CheckSkill_Persecond(skillItem);
            }
            CheckSkill_Health();
        }

        function settimeoutInterval(skillItem) {
            // setTimeout(() => {
            //     settimeoutInterval(skillItem);
            // }, 100);



        }
        function CheckSkill_Persecond(skillItem) {
            if (skillItem.trigger.type == "perSecond") {

                if (skillItem.CD == undefined) {
                    skillItem.CD = skillItem.trigger.value;
                    // skillItem.CD = 0;
                } else {
                }

                if (skillItem.CD == 0) {
                    skillItem.CD = 0.5;
                    // if (skillItem.castTime > 0) {
                    //     // 冷却时间一定要比施放时间更长
                    //     if (skillItem.castTime >= skillItem.CD) {
                    //         skillItem.CD = skillItem.castTime + 0.5;
                    //     }
                    // }
                }

                skillItem.CONSTCD = skillItem.CD;


                skillItem.CD *= (1 - baseData.basicProperty.CDRate);
                if (skillItem.CD <= 0) {
                    skillItem.CD = 0.5;
                }
                skillItem.cCD = skillItem.CD;

                if (skillItem.trigger.value < skillItem.CD) {
                    skillItem.trigger.value = skillItem.CD;
                }


                if (skillItem.auto == undefined) {
                    skillItem.auto = true;
                }

                fireLater.push({
                    type: "interval", fn:
                        // settimeoutInterval(skillItem)
                        setInterval(() => {
                            if (_Global.pauseGame) { return; }
                            if (_Global.mainUser) {
                                if (skillItem.cCD == skillItem.CD) {
                                    if (!skillItem.auto) {
                                        return;
                                    } else {
                                        if (skillItem.cCD < skillItem.trigger.value) {
                                            skillItem.cCD += 0.1;
                                            return;
                                        }
                                    }
                                    if (inSkill) {
                                        // return;
                                        if (skillItem.effect.type == "control" || skillItem.effect.type == "shield") {
                                            // EventHandler("中断技能", true);
                                        } else {
                                            // return;
                                        }
                                        return;
                                        // for (let i = 0; i < skillCDlist.length ; i++) {
                                        //   const element = skillCDlist[i];
                                        //   if(element.skillName == skillItem.skillName){
                                        //     return; 
                                        //   }
                                        // }
                                        // skillCDlist.push({skillName:skillItem.skillName,skillItem:skillItem});
                                    }
                                    if (SkillGo(skillItem)) {
                                        if (_Global.CombatLog && skillItem.effect.skillName != "基础攻击"
                                        && owner.GetNickName().includes('落地水') 
                                        ) {
                                            _Global.CombatLog.log(owner.GetNickName() + " 11 ", "", "技能", skillItem.effect.skillName);
                                        }
                                    }
                                    return;
                                }
                                skillItem.cCD += 0.1;
                                if (skillItem.cCD > skillItem.CD) {
                                    skillItem.cCD = skillItem.CD;
                                }

                                owner.applyEvent("技能CD", skillItem.skillName, skillItem.cCD);
                                //   console.log(owner.GetNickName()+" 技能CD ", skillItem.skillName, skillItem.cCD,skillItem.CD);

                            }
                        }, 100)
                }
                );
            }
        }
        // 随机选中的玩家
        let searchModel = null;
        //监听生命触发技能。
        // 血量触发时，每个血量只能触发一次，如果正在施放其他触发技能，则本次血量触发失效
        let healthTrigger = [];

        function CheckSkill_Health() {
            if (owner.isDead) {
                return;
            }

            let healthPerc = owner.GetHealthPerc();
            // if (owner.npcName.includes("大")) {
            //   console.log(GetNickName() + "血量 百分比 ", healthPerc);
            // }
            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];
                // 触发方式  血量达到n%触发，血量改变时调用
                if (skillItem.trigger.type == "health") {
                    if (healthPerc <= skillItem.trigger.value) {
                        if (_Global.mainUser) {
                            // console.log(" 达到触发条件，请求触发npc技能 ",skillName);
                            let has = false;
                            for (let j = healthTrigger.length - 1; j >= 0 && !has; j--) {
                                const element = healthTrigger[j];
                                if (element.triggerValue == skillItem.trigger.value) {
                                    // console.log(" 施法重复，阻止触发npc技能 ",skillName);
                                    let offTime = parseInt((new Date().getTime() - element.stateTime) / 1000) - skillItem.castTime;
                                    // console.log(" 触发间隔",offTime," CD "+skillItem.trigger.CD);
                                    if (offTime >= (skillItem.trigger.CD)) {
                                        healthTrigger.splice(j, 1);
                                    } else {
                                        has = true;
                                    }
                                }
                            }
                            if (has) {
                                continue;
                            }
                            if (inSkill) {
                                // 生命值触发的优先等级高，终止其他正在施放的技能
                                EventHandler("中断技能");
                                // console.log(" 正在施法其他技能，阻止触发npc技能 ",skillName);
                                // return;
                            }
                            // console.log(" 触发npc技能 ", skillItem.skillName);
                            healthTrigger.push({ stateTime: new Date().getTime(), triggerValue: skillItem.trigger.value });
                            SkillGo(skillItem);
                        }
                    }
                }
            }
        }

        let vaildAttackLater = null;
        let vaildAttackLater2 = null;
        let toIdelLater = null;
        let _offsetTime = 0;
        let cutStartTime = 0;

        // 当前正在引导或施放的法术
        let castSkillList = [];

        function EventHandler(e, cutSkill = true) {
            if (e == "中断技能") {
                if (vaildAttackLater != null || vaildAttackLater2 != null || toIdelLater != null) {
                    clearTimeout(vaildAttackLater);
                    clearTimeout(vaildAttackLater2);
                    clearTimeout(toIdelLater);
                    vaildAttackLater = null;
                    vaildAttackLater2 = null;
                    toIdelLater = null;
                    //记录当前时间
                    _offsetTime = new Date().getTime() - cutStartTime;
                    cutStartTime = new Date().getTime();

                    // console.log(" 记录中断的时间 ",cutStartTime);
                }

                clearCastSkill();

                if (cutSkill) {
                    if (inSkill) {
                        _Global.DyncManager.SendDataToServer("npc技能",
                            { npcId: owner.id, skillItem: "中断" });
                        skillEnd(null, "中断技能");
                    }
                }
            }
            if (e == "中断施法") {
                clearCastSkill();
                skillEnd(null, "中断施法");

            }

            owner.EventHandler(e, cutSkill);
        }
        function clearCastSkill() {

            for (let i = 0; i < castSkillList.length; i++) {
                clearTimeout(castSkillList[i]);
            }
            castSkillList = [];
        }
        // 向玩家发送技能特效
        function shootTarget(taget, skillItem, speed, callback) {
            let pos = owner.GetShootingStartPos();
            if (skillItem && skillItem.skillFirePart) {
                //找对应骨骼所在的坐标
                owner.GetBoneVagueFire(skillItem.skillFirePart, (pos) => {
                    _Global.DyncManager.shootTarget(pos, taget, speed, "player", skillItem.skillFireParticleId, callback);
                });
                return;
            }
            _Global.DyncManager.shootTarget(pos, taget, speed, "player", skillItem ? skillItem.skillFireParticleId : "", callback);
        }

        this.SendDamageToTarget = function (target, effect, skillItem) {
            SendDamageToTarget(target, effect, skillItem);
        }
        function getSendTitle(target) {
            let s = owner.getPlayerType();
            let s2 = target.getPlayerType();
            // let s2 = "NPC";
            return s + '对' + s2;
        }
        // 根据技能数据计算对目标造成伤害
        function SendDamageToTarget(target, effect, skillItem) {
            // console.log(owner.GetNickName() + ' 对目标造成伤害 ', target, effect);

            // 玩家镜像
            if (owner.GetIsPlayer()) {
                SendDamageToTarget2(target, effect, skillItem);
                return;
            }
            if (target == null) {
                return;
            }
            effect = JSON.parse(JSON.stringify(effect));
            let { type, skillName, value, time, duration } = effect;
            value = owner.GetProperty().GetDamage(value);
            effect.value = value;
            // 发送技能特效
            shootTarget(target, skillItem, null, () => {
                // 发送战斗记录
                _Global.DyncManager.SendFireRecode({ targetId: target.id, npcId: owner.id, npcName: owner.GetNickName(), skillName: skillName, strength: value });

                if (target != null && target.isDead) {
                    owner.TargetDead();
                    return;
                }
                owner.AddExp(20);
                effect.fromName = owner.GetNickName();

                _Global.DyncManager.SendSceneStateAll(getSendTitle(target),
                    {
                        fromId: owner.id,
                        fromType: owner.getPlayerType(),
                        fromName: owner.GetNickName(),
                        targetId: target.id,
                        targetType: target.getPlayerType(),
                        targetName: target.GetNickName(),
                        skillName: skillName,
                        effect: effect,
                        skillItem: skillItem,
                    });


            });



        }


        // 玩家的镜像角色是 YJNPC类
        function SendDamageToTarget2(target, effect, skillItem) {
            if (target == null) {
                return;
            }

            if (target != null && target.isDead) {
                owner.TargetDead();
                return;
            }
            let { type, skillName, value, time, duration } = effect;

            // 发送战斗记录
            _Global.DyncManager.SendFireRecode({ playerId: owner.id, npcId: target.transform.id, npcName: target.npcName, skillName: skillName, strength: value });
            // 发送技能特效
            shootTarget(target, skillItem, null);

            _Global.DyncManager.SendSceneStateAll(getSendTitle(target),
                {
                    fromId: owner.id,
                    fromType: owner.getPlayerType(),
                    fromName: owner.GetNickName(),
                    targetId: target.id,
                    targetType: target.getPlayerType(),
                    targetName: target.GetNickName(),
                    skillName: skillName,
                    effect: effect,
                    skillItem: skillItem,
                });

        }


        let hyperplasiaTrans = [];
        function hyperplasia(modelData, num, count, times) {
            modelData = JSON.parse(JSON.stringify(modelData));
            modelData.scale = { x: 1, y: 1, z: 1 };
            let data = modelData.message.data;
            data.name = owner.GetNickName() + "的增生" + times + "_" + (num + 1);
            let pos = owner.GetWorldPos();
            modelData.pos.x = pos.x + (num + 1);
            modelData.pos.y = pos.y;
            modelData.pos.z = pos.z;
            data.isCopy = true;
            if (data.baseData.maxHealth > 200) {
                data.baseData.maxHealth = 200;
            }
            data.baseData.strength = 20;
            data.baseData.health = data.baseData.maxHealth;

            // console.log("创建增生 ", data.name);
            _Global._YJNPCManager.DuplicateNPCByModelData(modelData, owner.id + "_" + times + "_" + num, (transform) => {

                let npcComponent = transform.GetComponent("NPC");
                hyperplasiaTrans.push(npcComponent);
                if (targetModel) {
                    npcComponent.SetNpcTarget(targetModel);
                    _Global._YJFireManager.NPCAddFireById(npcComponent, owner.fireId, targetModel.id);
                }
                num++;
                if (num == count) {
                } else {
                    hyperplasia(modelData, num, count, times);
                }
            });
        }

        init();

    }
}
export { YJSkill }