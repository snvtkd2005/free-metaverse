


import * as THREE from "three";
import { RandomInt, SelectEnemyType } from "../../utils/utils";
import { YJSkillModel } from "./YJSkillModel";

class YJSkill {
    constructor(owner) {
        let scope = this;
        let targetModel = null;
        let baseData = null;
        let _YJSkillModel = new YJSkillModel(owner);
        this.GetSkillModel = function () {
            return _YJSkillModel;
        }
        function init() {

            owner.addEventListener("首次进入战斗", () => {
                // CheckSkill();
            });
            

            owner.addEventListener("施法移动中断", () => {
                EventHandler("施法移动中断");
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
            owner.addEventListener("离开战斗", () => {
                inSkill = false;
                ClearFireLater();

            });
            owner.addEventListener("死亡", () => {
                inSkill = false;
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

                // if (owner.GetNickName().includes('普通步兵')) {
                //     console.error(owner.GetNickName() + "000设置目标为同阵营角色: ", targetModel);
                // }
            });
            owner.addEventListener("设置目标", (_targetModel) => {
                // if(_targetModel.isYJTransform){
                //     targetModel = _targetModel.GetComponent("NPC");
                // }
                targetModel = _targetModel;

                //刷新技能是否有目标的判断
                for (let i = 0; i < skillList.length; i++) {
                    const skillItem = skillList[i];
                    if (skillItem.target.type.includes("target")) {
                        skillItem.hasTarget = targetModel != null;
                    }
                }
                if (targetModel == null) {
                    return;
                }
                // console.log(owner.GetNickName() + " 设置目标", (_targetModel));
                if (owner.getPlayerType() == "玩家" && baseSkillItem) {
                    let hasTarget = false;
                    if (targetModel) {
                        if (targetModel.GetCamp() != owner.GetCamp()) {
                            hasTarget = true;
                        }
                    } else {

                    }
                    owner.applyEvent("技能状态", baseSkillItem.skillName, { title: "设置是否有目标", state: hasTarget })
                }

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
        this.GetBaseSkill = function () {
            return baseSkillItem;
        }
        this.SetSkill = function (_skillList, _baseData) {
            skillList = _skillList;
            if (_baseData) {
                baseData = _baseData;
            }

            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];
                if (skillItem.trigger.type == "perSecond") {
                    initSkill(skillItem);
                }
                if (skillItem.skillName == "基础攻击") {
                    baseSkillItem = skillItem;
                }
            }
        }
        function initSkill(skillItem) {
            skillItem.CD = skillItem.trigger.value;

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
            if (skillItem.isPassive) {
                skillItem.auto = true;
            }
            
            if(skillItem.canMovingCast == undefined){
                skillItem.canMovingCast = false;
            }
            // console.log("添加技能并初始化", skillItem);
        }

        let baseSkillItem = null;
        this.AddSkill = function (_skill) {
            for (let i = 0; i < skillList.length; i++) {
                const skill = skillList[i];
                if (skill.skillName == _skill.skillName) {
                    skill.level = _skill.level;
                    if (skill.hasTargetLv && skill.targetLv && skill.targetLv.length > 1) {
                        skill.target.value = skill.targetLv[skill.level - 1];
                    }
                    return;
                }
            }
            initSkill(_skill);
            skillList.push(_skill);
            if (_skill.skillName == "基础攻击") {
                baseSkillItem = _skill;
                CheckSkill_Persecond(_skill);
            }
            owner.applyEvent("添加技能", _skill);

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
        this.ChangeBaseSkillByWeapon = function (weaponData) {

            if (baseSkillItem) {
                let strength = 10;
                let castTime = 2;

                if (weaponData) {
                    castTime = weaponData.attackSpeed;
                    strength = weaponData.strength;
                }
                var { s, v, a, _ready, _fire } = _Global.CreateOrLoadPlayerAnimData().GetSkillDataByWeapon(weaponData);
                baseSkillItem.vaildDis = v;
                baseSkillItem.castTime = a;
                if (_ready) {
                    baseSkillItem.skillReadyAudio = _ready.audio;
                    baseSkillItem.skillReadyParticleId = _ready.particle;
                }
                if (_fire) {
                    baseSkillItem.skillFireAudio = _fire.audio;
                    baseSkillItem.skillFireParticleId = _fire.particle;
                }
                let ready = _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon("准备战斗", weaponData);
                let fire = _Global.CreateOrLoadPlayerAnimData().GetAnimNameByPlayStateAndWeapon("普通攻击", weaponData);

                baseSkillItem.animNameReady = ready.animName;
                baseSkillItem.animName = fire.animName;
                baseSkillItem.effect.value = strength;

            }
        }
        this.CheckSkillInVaildDis = function (pos) {
            if (targetModel == null) {
                return;
            }
            for (let i = 0; i < skillList.length; i++) {
                const skill = skillList[i];
                if (skill.target.type == 'target') {
                    let vaildAttackDis = skill.vaildDis;
                    let distance = owner.GetWorldPos().distanceTo(targetModel.GetWorldPos());
                    // console.log(" 检查技能是否在有效距离 "+skill.skillName,vaildAttackDis,distance);
                    let b = distance > vaildAttackDis;
                    if (b != skill.outVaildDis) {
                        skill.outVaildDis = b;
                        owner.applyEvent("技能状态", skill.skillName, { title: "设置是否距离太远", state: b })
                    }


                }
            }
        }


        this.GetinSkill = function () {
            return inSkill;
        }
        
        this.GetSkillCanMovingCast = function () {
            return canMovingCast;
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

            // if (baseSkillItem) {
            //     baseSkillItem.auto = false;
            // }
        }
        this.ReceiveControl = function (msg) {
            _YJSkillModel.ReceiveControl(msg, false);
        }

        this.SendSkill = function (msg) {
            _YJSkillModel.SendSkill(msg, false);
        }

        function ReceiveControl(_fromModel, skillName, effect, skillItem) {
            let { type, value, time, duration, describe, icon, fromName } = effect;
            effect.skillName = skillName || skillItem.skillName;

            _Global.DyncManager.SendDataToServer("受到技能",
                {
                    fromId: owner.id,
                    skillItem: skillItem
                });
            // console.log("受到技能", skillItem);
            if (type == "control") {

                let controlId = effect.controlId;
                if (controlId == "无法移动") {
                    owner.SetInControl(true);
                    owner.SetPlayerState("停止移动");
                }
                if (controlId == "冰霜新星" || true) {

                    let { receiveEffect } = skillItem;
                    if (receiveEffect == undefined) {
                        return;
                    }
                    if (skillItem.hasReceiveEffect) {
                        let nameScale = owner.GetScale() * 3;
                        let msg = {
                            title: "生成静态模型",
                            folderBase: receiveEffect.particleId,
                            id: owner.id,
                            pos: owner.GetWorldPos(),
                            scale: new THREE.Vector3(nameScale, nameScale, nameScale),
                        }

                        _YJSkillModel.ReceiveControl(msg, true);

                    }


                    if (controlFnLater != null) {
                        for (let i = controlLaterEvent.length - 1; i >= 0; i--) {
                            const element = controlLaterEvent[i];
                            if (element.id.includes("control")) {
                                controlLaterEvent.splice(i, 1);
                            }
                        }
                        clearTimeout(controlFnLater);
                    }

                    let id = "control" + new Date().getTime();
                    controlLaterEvent.push({ id: id, type: "control", particleId: receiveEffect.particleId });
                    controlFnLater = setTimeout(() => {
                        RemoveSkill({ id: id, type: "control", particleId: receiveEffect.particleId });
                        for (let i = controlLaterEvent.length - 1; i >= 0; i--) {
                            const element = controlLaterEvent[i];
                            if (element.id == id) {
                                controlLaterEvent.splice(i, 1);
                            }
                        }
                    }, duration * 1000);

                }
                return;
            }

        }


        function RemoveSkill(skill) {
            _YJSkillModel.RemoveSkill(skill);
        }

        let controlFnLater = null;
        let controlLaterEvent = [];
        function ClearControlModel() {
            if (controlFnLater) { clearTimeout(controlFnLater); controlFnLater = null; }

            for (let i = controlLaterEvent.length - 1; i >= 0; i--) {
                const element = controlLaterEvent[i];
                if (element.id.includes("control")) {
                    controlLaterEvent.splice(i, 1);
                }
            }
            controlLaterEvent = [];
            _YJSkillModel.ClearControlModel();
        }

        let keepingSkillList = [];


        this.ReceiveSkill = function (fromModel, skillName, effect, skillItem) {

            // console.log(owner.GetNickName() + " 接收技能 11 ", fromModel, skillName, effect, skillItem);

            let { type, runType, controlId, time, duration, describe, icon } = effect;
            effect.skillName = skillName || skillItem.skillName;
            effect.describe = describe;

            if (type == "control" || type == "shield") {
                ReceiveControl(fromModel, skillName, effect, skillItem);
                return;
            }

            if (runType == "perSecond") {
                owner.GetBuff().addDebuff(effect);
                owner.CombatLog(fromModel.GetNickName(), owner.GetNickName(), "技能攻击", skillName);
                return;
            }

            let addredius = "redius";
            let value = effect.value;

            // 直接伤害 或 持续伤害
            if (type == "damage" || type == "contDamage" || type == "basicProperty") {
                if (skillItem.isKeeping) {

                    if (controlId == "armor") {
                        for (let i = 0; i < keepingSkillList.length; i++) {
                            const element = keepingSkillList[i];
                            if (element.type == type
                                && element.controlId == controlId
                                && element.skillName == skillName
                            ) {
                                return;
                            }
                        }
                        baseData.basicProperty.armor += value;
                        setTimeout(() => {
                            baseData.basicProperty.armor -= value;
                            for (let i = keepingSkillList.length - 1; i >= 0; i--) {
                                const element = keepingSkillList[i];
                                if (element.type == type
                                    && element.controlId == controlId
                                    && element.skillName == skillName
                                ) {
                                    keepingSkillList.splice(i, 1);
                                }
                            }
                        }, skillItem.CD * 900);
                    }

                    keepingSkillList.push({ type, controlId, value, skillName });
                }
                if (controlId == "maxHealth") {
                    if (value > 0) {
                        value = value * baseData.maxHealth * 0.01;
                        baseData.health += value;
                        if (baseData.health > baseData.maxHealth) {
                            baseData.health = baseData.maxHealth;
                        }
                        addredius = "add";
                        owner.CombatLog(fromModel.GetNickName() + " 治疗 " + owner.GetNickName() + " 恢复 " + (value) + " 点生命 ");

                    } else {

                        value = owner.GetProperty().RealyDamage(Math.abs(value) * baseData.maxHealth * 0.01);
                        let d = value;
                        if (value > baseData.health) {
                            d = baseData.health;
                        }

                        baseData.health -= value;
                        owner.CombatLog(fromModel.GetNickName() + " 攻击 " + owner.GetNickName() + " 造成 " + value + " 点伤害 ");
                        owner.CheckMaxDamage(fromModel.id, value);
                        // owner.GetProperty().updateBasedata({ type: "basicProperty", property: controlId, value: baseData.health });

                        owner.addDamageFrom(fromModel.id, d / baseData.maxHealth);
                        if (baseSkillItem) {
                            // 被攻击时，自动反击
                            baseSkillItem.auto = true;
                        }
                    }

                }
                if (controlId == "health") {
                    if (value > 0) {

                        baseData.health += value;
                        if (baseData.health > baseData.maxHealth) {
                            baseData.health = baseData.maxHealth;
                        }
                        addredius = "add";
                        owner.CombatLog(fromModel.GetNickName() + " 治疗 " + owner.GetNickName() + " 恢复 " + value + " 点生命 ");

                    } else {

                        value = owner.GetProperty().RealyDamage(Math.abs(value));
                        let d = value;
                        if (value > baseData.health) {
                            d = baseData.health;
                        }

                        baseData.health -= value;
                        owner.CombatLog(fromModel.GetNickName() + " 攻击 " + owner.GetNickName() + " 造成 " + value + " 点伤害 ");
                        owner.CheckMaxDamage(fromModel.id, value);
                        // owner.GetProperty().updateBasedata({ type: "basicProperty", property: controlId, value: baseData.health });

                        owner.addDamageFrom(fromModel.id, d / baseData.maxHealth);
                        if (baseSkillItem) {
                            // 被攻击时，自动反击
                            baseSkillItem.auto = true;
                        }
                    }

                }

            }

            owner.CheckHealth(fromModel.GetNickName());

            // _Global._SceneManager.UpdateNpcDamageValue(
            //     fromModel.id,
            //     fromModel.GetNickName(),
            //     owner.GetNickName(),
            //     owner.id,
            //     owner.GetCamp(),
            //     value,
            //     owner.GetDamageTextPos(),
            //     addredius
            // );

            // console.log( owner.GetNickName() +" 伤害跳字 来自 "+fromModel.GetNickName() ,fromModel.GetOwnerPlayerId());
            _Global.DyncManager.SendSceneStateAll("伤害跳字",
                {
                    fromId: fromModel.id,
                    fromType: fromModel.getPlayerType(),
                    fromName: fromModel.GetNickName(),
                    fromOwnerPlayerId: fromModel.GetOwnerPlayerId(),
                    targetId: owner.id,
                    targetType: owner.getPlayerType(),
                    targetName: owner.GetNickName(),
                    value: value,
                    addredius: addredius,
                });

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

            // if (msg.title == "受到技能") {
            //     let skill = msg.skill;
            //     scope.ReceiveSkill('', '', skill.effect, skill);
            //     return;
            // }

            if (msg.title == owner.owerType('技能攻击')) {
                let skill = msg.skill;
                //增生
                if (skill.type == "hyperplasia") {
                    let { value, times } = skill;
                    let modelData = owner.GetModelData();
                    times = 1;
                    for (let i = 0; i < times; i++) {
                        hyperplasia(modelData);
                    }
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
            clearCastSkill();
            if (skillItem) {
                if (skillItem.cCD == skillItem.CD) {
                    skillItem.cCD = 0;
                }
                // console.log(skillItem.skillName, e,skillItem.cCD , skillItem.CD);
                _Global._YJAudioManager.stopAudio(readyskillAudioName);
                owner.skillEnd();
            } else {

            }
            if (e == "结束") {
                if (_Global.CombatLog && skillItem.skillName != "基础攻击"
                    // && owner.GetNickName().includes('落地水')
                ) {
                    _Global.CombatLog.log(owner.GetNickName() + " 结束 ", "", "技能", skillItem.skillName);

                }
                // owner.EventHandler("技能施放成功");
            }
            if (e.includes("中断")) {
                if (_Global.CombatLog
                    // && owner.GetNickName().includes('落地水')
                ) {
                    console.log(owner.GetNickName() + " 11  " + e);
                }
            }

            owner.SetValue("readyAttack_doonce", 0);
            inSkill = false;

        }
        let oldskillname = "";
        this.UseBaseSkill = function () {
            if (baseSkillItem) {
                baseSkillItem.auto = true;
                SkillGo(baseSkillItem);
            }
        }
        this.UseSkill = function (skillItem) {
            let targetType = skillItem.target.type;
            // console.log("主动使用技能 11 ",targetType);
            if (targetType == 'target' && !owner.CheckCanAttack()) {
                return;
            }

            if (skillItem.skillName == "基础攻击") {
                skillItem.auto = true;
            } else {
                if ("基础攻击" == oldskillname) {
                    inSkill = false;
                }
                if (owner.GetFireId() != -1) {
                    if (baseSkillItem) {
                        baseSkillItem.auto = true;
                    }
                }
            }
            // console.log(" 手动触发 ",skillItem);

            // for (let i = 0; i < skillList.length; i++) {
            //     const _skillItem = skillList[i];
            //     if(_skillItem.skillName == skillItem.skillName){
            //         SkillGo(_skillItem);
            //     }
            // }
            SkillGo(skillItem);

        }
        let skillCastTime = 0;
        this.skillCastAnimDuration = 0;

        function getTargetsByTargetType(targetType, vaildAttackDis, max) {
            let areaTargets = [];
            if (targetType == "target") {
                areaTargets.push(targetModel);
            }
            if (targetType == "targetAndNear") {
                areaTargets = _Global._YJFireManager.GetNearNPCByNPC(targetModel, 10, max);
            }
            if (targetType == "area") {
                areaTargets = _Global._YJFireManager.GetOtherNoSameCampInArea(owner.GetCamp(), vaildAttackDis, max, owner.GetWorldPos());
            }

            if (targetType == "areaFriendly") {
                areaTargets = _Global._YJFireManager.GetOtherSameCampInArea(owner.GetCamp(), vaildAttackDis, max, owner.GetWorldPos());
            }
            if (targetType.includes("random")) {
                areaTargets.push(searchModel);
            }
            if (targetType.includes("minHealth")) {
                areaTargets.push(searchModel);
            }
            return areaTargets;
        }
        function skillFn(skillItem, index = 0) {

            let targetType = skillItem.target.type;
            let effect = skillItem.effects[index];
            if (skillItem.effects.length > (index + 1)) {
                skillFn(index + 1);
            }
            skillItem.effect = effect;
            let errorLog = "";
            let areaTargets = getTargetsByTargetType(targetType, vaildAttackDis, skillItem.target.value);

            let { selfAction } = skillItem;
            if (selfAction == "冲锋") {
                //移动速度提高，冲向目标
                owner.MoveToTargetFast();
            }

            let { type, skillName, value, time, duration, describe, controlId } = effect;


            // // 范围内无目标，不施放技能
            // if (areaTargets.length == 0) {
            //     errorLog = "有效范围内无目标";
            //     return;
            // }

            // 播放施放特效 魔爆术
            if (skillItem.skillFireParticleId) {
                let msg = {
                    title: skillItem.skillName,
                    folderBase: skillItem.skillFireParticleId,
                    id: owner.id,
                    pos: owner.GetWorldPos(),
                    scale: null,
                    autoHidden: skillItem.skillFireAutoHidden,
                    delayV: skillItem.skillFireDiplayValue,
                }
                _YJSkillModel.SendSkill(msg, true);
            }

            
            if (targetType == "self") {
                // console.log(" 施放自身法术 ",owner.owerType('技能攻击'),effect,skillItem);
                if (effect.type == "shield") {
                    if (effect.controlId == "寒冰护体" || true) {
                        effect.particleId = skillItem.skillFireParticleId;
                        owner.GetBuff().addBuff(effect);
                        let nameScale = owner.GetScale();
                        let msg = {
                            title: "寒冰护体",
                            type: "shield",
                            folderBase: skillItem.skillFireParticleId,
                            id: owner.id,
                            pos: owner.GetWorldPos(),
                            scale: new THREE.Vector3(nameScale, nameScale, nameScale),
                        }
                        _YJSkillModel.SendSkill(msg, true);
                    }
                    return;
                }
                if (!SendSkillToSelf(effect, skillItem)) {
                    return false;
                }

            }
            if (targetType == "none") {
                //有效攻击 && 
                if (!SendSkillToSelf(effect, skillItem)) {
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

            if (effect.type == "control") {
                if (controlId == "无法移动") {
                    effect.value = 0;
                    for (let i = 0; i < areaTargets.length; i++) {
                        const target = areaTargets[i];
                        //瞬发技能直接同步
                        _Global.DyncManager.SendDataToServer(getSendTitle(target),
                            {
                                fromId: owner.id,
                                fromType: owner.getPlayerType(),
                                targetType: target.getPlayerType(),
                                targetId: target.id,
                                skillItem: skillItem
                            });
                    }
                    return;
                }
                if (controlId == "被嘲讽") {
                    for (let i = 0; i < areaTargets.length; i++) {
                        const target = areaTargets[i];
                        if (target.isDead) {
                            continue;
                        }
                        if (target.isYJNPC) {
                            target.SetNpcTargetToNoneDrict();
                            if (owner.isPlayerFire) {
                                target.SetNpcTarget(owner.GetYJPlayer(), true, false);
                            } else {
                                target.SetNpcTarget(owner, true, false);
                            }
                        }
                    }
                    return;
                }
                
            }
            else if (effect.type == "basicProperty") {
                vaildAttackLater2 = setTimeout(() => {
                    for (let i = 0; i < areaTargets.length; i++) {
                        const element = areaTargets[i];
                        if (element == null || element.isDead) {
                            EventHandler("目标死亡");
                            continue;
                        }
                        SendDamageToTarget(element, effect, skillItem);
                    }
                }, skillCastTime * 100);
                return "later";
            } 
        }
        let canMovingCast = false;
        //施放技能
        function SkillGo(skillItem) {
            if (owner.GetIsDead()) {
                return false;
            }
            if (inSkill) { return false; }
            if (skillItem.castTime > 0 && owner.GetIsMoving()) {
                if(skillItem.canMovingCast){

                }else{
                    return;
                }
            }
            canMovingCast = skillItem.canMovingCast;
            // console.error(owner.GetNickName() +" 施放技能： ",skillItem);
            oldskillname = skillItem.skillName;

            inSkill = true;
            EventHandler("中断延迟施法");
            let { animName, animNameReady, skillName, target, effect } = skillItem;

            effect.skillName = skillItem.skillName;
            readyskillAudioName = skillName;


            let fromPos = owner.GetWorldPos().clone();
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
                if (targetType == "target" || targetType == "targetAndNear") {
                    if (targetModel == null || (targetModel && targetModel.isDead)) {
                        targetModel = _Global._YJFireManager.GetNoSameCampInFireWithType(
                            {
                                camp: owner.GetCamp(),
                                fireId: owner.GetFireId(),
                                disData: { fromPos, vaildAttackDis },
                            }, SelectEnemyType.NEAREST);
                        // console.log(" 准备自动选择目标 ");

                        if (targetModel == null) {
                            errorLog = "无目标";
                            if (skillName != "基础攻击") {
                                owner.MyFireState("我没有目标");
                            }
                            EventHandler("没有目标", skillItem);
                            return false;
                        }
                        // 玩家自动攻击时，自动找战斗中最近的敌方为目标
                        if (owner.SetInteractiveNPC) {
                            // console.log(" 自动选择目标 ");
                            owner.SetInteractiveNPC(targetModel);
                        }
                    }
                    // if ((targetModel && targetModel.isDead)) {
                    //     errorLog = "目标已死亡";
                    //     if (skillName != "基础攻击") {
                    //         owner.MyFireState("目标已死亡");
                    //     }
                    //     EventHandler("目标死亡", skillItem);
                    //     return false;
                    // }
                    let distance = owner.GetWorldPos().distanceTo(targetModel.GetWorldPos());
                    if (distance > vaildAttackDis) {
                        errorLog = ("与目标距离过远 " + distance + '/' + vaildAttackDis);
                        owner.MyFireState("我离的太远了");
                        EventHandler("距离太远");
                        return false;
                    }

                    if (owner.GetCamp() == targetModel.GetCamp()) {
                        errorLog = "攻击目标为同阵营角色";
                        skillItem.hasTarget = false;
                        owner.MyFireState("我不能攻击这个目标");
                        return false;
                    }

                    //面向目标
                    owner.LookatTarget(targetModel);
                }
                // 范围攻击
                if (targetType == "area") {

                }

                if (targetType.includes("random")) {
                    if (targetType.includes("Friendly")) {
                        // 找友方目标 
                        searchModel = _Global._YJFireManager.GetSameCampByRandomInFire(owner.GetCamp(), owner.GetFireId(), { fromPos, vaildAttackDis });
                    } else {
                        // 找敌对阵营的目标
                        // console.log(" 查找 随机 敌对阵营的目标 ",owner.GetCamp(), owner.GetFireId());
                        searchModel = _Global._YJFireManager.GetNoSameCampByRandomInFire(owner.GetCamp(), owner.GetFireId(), { fromPos, vaildAttackDis });
                    }
                    // 随机进没目标时，返回false 不施放技能
                    if (searchModel == null) {
                        errorLog = "随机查找无目标";
                        return false;
                    }
                    if (searchModel != null && searchModel.isDead) {
                        EventHandler("目标死亡");
                        errorLog = "随机查找目标已死亡";
                        return false;
                    }
                }


                if (targetType == "none" || targetType == "self") {
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
                // if (skillName != "基础攻击" && owner.GetNickName().includes('落地水')) {
                // console.error(owner.GetNickName() + skillName + "施放失败: " + errorLog, targetModel);
                // }
                inSkill = false;
                return false;
            }

            // if (owner.GetNickName().includes("l老a")) {
            // console.error(owner.GetNickName() + "施放技能", skillItem.cCD, skillItem.CD, skillItem);
            // }
 
            let contDamageFn = () => {

                let targetType = skillItem.target.type;
                let effect = skillItem.effects[0];
                let { type, skillName, value, time, duration, describe, controlId } = effect;
                if(time==0){time = 1;}
                // 持续伤害
                let num = 0;
                let count = parseInt(skillCastTime / time);
                for (let k = 0; k < count; k++) {
                    castSkillList.push(setTimeout(() => {
                        if (!checkCan()) {
                            skillEnd(skillItem, "中断");
                            EventHandler("中断施法");
                            return;
                        }
                        let areaTargets = getTargetsByTargetType(targetType, vaildAttackDis, skillItem.target.value);

                        for (let l = 0; l < areaTargets.length; l++) {
                            if (areaTargets[l].isDead) {
                                continue;
                            }
                            SendDamageToTarget(areaTargets[l], effect, skillItem);
                            // console.error(owner.GetNickName() + " 范围攻击目标 持续伤害 ", effect, skillItem);
                        }
                        skillItem.cCD = 0;
                        num++;
                        if (num == count) {
                            skillEnd(skillItem, "结束");
                        }
                    }, time * k * 1000));
                }
                owner.LookatTarget(targetModel);
                return;
                if (targetType == "target") {
                    let num = 0;
                    let count = parseInt(duration / time);
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
                        }, time * k * 1000));
                    }
                    //面向目标
                    owner.LookatTarget(targetModel);
                }
                // 范围攻击
                if (targetType == "area") {

                    // 持续伤害
                    let num = 0;
                    let count = parseInt(duration / time);
                    for (let k = 0; k < count; k++) {
                        castSkillList.push(setTimeout(() => {
                            if (!checkCan()) {
                                skillEnd(skillItem, "中断");
                                EventHandler("中断施法");
                                return;
                            }
                            let max = skillItem.target.value;
                            areaTargets = _Global._YJFireManager.GetOtherNoSameCampInArea(owner.GetCamp(), vaildAttackDis, max, owner.GetWorldPos());

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
                        }, time * k * 1000));
                    }

                }
            }


            if (skillCastTime > 0) {


                owner.playAudio(skillItem.skillReadyAudio, readyskillAudioName);
                owner.SetPlayerState("吟唱", skillItem.animNameReady);
                //取消寻路，让npc站住施法
                owner.SetNavPathToNone();
                // console.time('施法成功===');
                // if(owner.getPlayerType().includes('玩家')){
                //     console.log(" 吟唱 音效 ",skillItem.skillReadyAudio);
                // }

                //contDamage 技能需要边施法边执行，所以要单独判断
                if ((skillItem.isChannelling)) {
                    owner.skillProgress(skillCastTime, skillName, true);
                    contDamageFn();
                } else {
                    owner.skillProgress(skillCastTime, skillName);

                    vaildAttackLater = setTimeout(() => {
                        // if (!checkCan()) {
                        //     skillEnd(skillItem, "中断");
                        //     // console.error(owner.GetNickName() + " 施放失败: " + errorLog, skillItem.skillName);
                        //     return;
                        // }

                        owner.SetPlayerState("施法", skillItem.animName);
                        owner.playAudio(skillItem.skillFireAudio, readyskillAudioName);

                        // if(owner.getPlayerType().includes('玩家')){
                        //     console.log(" 施放 音效 ",skillItem.skillFireAudio);
                        // }
                        // let e = fn();
                        let e = skillFn(skillItem);
                        if (e == "later") {
                            vaildAttackLater = setTimeout(() => {
                                skillEnd(skillItem, "结束");
                                // console.log(owner.GetNickName()+'施法成功 11 '+skillItem.skillName); 
                            }, 
                            // scope.skillCastAnimDuration * 0.7
                            skillCastTime * 200
                            );
                        } else {
                            skillEnd(skillItem, "结束");
                        }
                        // console.log(owner.GetNickName()+'施法成功 00 '+skillItem.skillName); 
                        // console.timeEnd(owner.GetNickName()+'施法成功'+skillItem.animName); 
                    }, skillCastTime * 1000);
                }
            } else {
                owner.SetPlayerState("施法", skillItem.animName);
                owner.playAudio(skillItem.skillFireAudio, readyskillAudioName);
                // fn();
                skillFn(skillItem);
                skillEnd(skillItem, "结束");

            }

            return true;

        }
        function BuffGo(skillItem) {
            if (owner.GetIsDead()) {
                return false;
            }

            // console.log(owner.GetNickName() + " 施放 被动技能： ", skillItem.skillName);
            // oldskillname = skillItem.skillName; 
            // inSkill = true;
            // EventHandler("中断延迟施法");
            let { animName, animNameReady, skillName, target, effects,
                skillFireAudio, skillFirePart, skillFireParticleId, skillReadyAudio, skillReadyParticleId } = skillItem;
            let effect = effects[0];
            // effect.skillName = skillItem.skillName;
            // readyskillAudioName = skillName; 
            let fromPos = owner.GetWorldPos().clone();
            vaildAttackDis = skillItem.vaildDis;
            attackStepSpeed = skillItem.castTime;
            skillCastTime = skillItem.castTime * (1 - baseData.basicProperty.hasteLevel);
            // console.log(" baseData ",baseData); 

            let areaTargets = [];
            let errorLog = "";
            let checkCan = () => {
                let targetType = skillItem.target.type;
                if (targetType == "target" || targetType == "targetAndNear") {
                    if (targetModel == null || (targetModel && targetModel.isDead)) {
                        targetModel = _Global._YJFireManager.GetNoSameCampInFireWithType(
                            {
                                camp: owner.GetCamp(),
                                fireId: owner.GetFireId(),
                                disData: { fromPos, vaildAttackDis },
                            }, SelectEnemyType.NEAREST);
                        // console.log(" 准备自动选择目标 ");

                        if (targetModel == null) {
                            errorLog = "无目标";
                            if (skillName != "基础攻击") {
                                owner.MyFireState("我没有目标");
                            }
                            EventHandler("没有目标", skillItem);
                            return false;
                        }
                        // 玩家自动攻击时，自动找战斗中最近的敌方为目标
                        if (owner.SetInteractiveNPC) {
                            // console.log(" 自动选择目标 ");
                            owner.SetInteractiveNPC(targetModel);
                        }
                    }
                    // if ((targetModel && targetModel.isDead)) {
                    //     errorLog = "目标已死亡";
                    //     if (skillName != "基础攻击") {
                    //         owner.MyFireState("目标已死亡");
                    //     }
                    //     EventHandler("目标死亡", skillItem);
                    //     return false;
                    // }
                    let distance = owner.GetWorldPos().distanceTo(targetModel.GetWorldPos());
                    if (distance > vaildAttackDis) {
                        errorLog = ("与目标距离过远 " + distance + '/' + vaildAttackDis);
                        owner.MyFireState("我离的太远了");
                        EventHandler("距离太远");
                        return false;
                    }

                    if (owner.GetCamp() == targetModel.GetCamp()) {
                        errorLog = "攻击目标为同阵营角色";
                        skillItem.hasTarget = false;
                        owner.MyFireState("我不能攻击这个目标");
                        return false;
                    }

                    //面向目标
                    owner.LookatTarget(targetModel);
                }
                // 范围攻击
                if (targetType == "area") {

                }

                if (targetType.includes("random")) {
                    if (targetType.includes("Friendly")) {
                        // 找友方目标 
                        searchModel = _Global._YJFireManager.GetSameCampByRandomInFire(owner.GetCamp(), owner.GetFireId(), { fromPos, vaildAttackDis });
                    } else {
                        // 找敌对阵营的目标
                        // console.log(" 查找 随机 敌对阵营的目标 ",owner.GetCamp(), owner.GetFireId());
                        searchModel = _Global._YJFireManager.GetNoSameCampByRandomInFire(owner.GetCamp(), owner.GetFireId(), { fromPos, vaildAttackDis });
                    }
                    // 随机进没目标时，返回false 不施放技能
                    if (searchModel == null) {
                        errorLog = "随机查找无目标";
                        return false;
                    }
                    if (searchModel != null && searchModel.isDead) {
                        EventHandler("目标死亡");
                        errorLog = "随机查找目标已死亡";
                        return false;
                    }
                }


                if (targetType == "none" || targetType == "self") {
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

            // if (!checkCan()) {
            //     // if (skillName != "基础攻击" && owner.GetNickName().includes('落地水')) {
            //     // console.error(owner.GetNickName() + skillName + "施放失败: " + errorLog, targetModel);
            //     // } 
            //     return false;
            // }

            // if (owner.GetNickName().includes("l老a")) {
            // console.error(owner.GetNickName() + "施放技能", skillItem.cCD, skillItem.CD, skillItem);
            // }

            let contDamageFn = () => {
                skillCastTime = effect.duration;
                let targetType = skillItem.target.type;
                let { type, skillName, value, time, duration, describe, controlId } = effect;
                if (targetType == "target") {
                    let num = 0;
                    let count = parseInt(duration / time);
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
                        }, time * k * 1000));
                    }
                    //面向目标
                    owner.LookatTarget(targetModel);
                }
                // 范围攻击
                if (targetType == "area") {

                    // 持续伤害
                    let num = 0;
                    let count = parseInt(duration / time);
                    for (let k = 0; k < count; k++) {
                        castSkillList.push(setTimeout(() => {
                            if (!checkCan()) {
                                skillEnd(skillItem, "中断");
                                EventHandler("中断施法");
                                return;
                            }
                            let max = skillItem.target.value;
                            areaTargets = _Global._YJFireManager.GetOtherNoSameCampInArea(owner.GetCamp(), vaildAttackDis, max, owner.GetWorldPos());

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
                        }, time * k * 1000));
                    }

                }

                if (targetType.includes("random")) {

                }


                if (targetType == "none" || targetType == "self") {


                }

                if (targetType.includes("minHealth")) {

                }
            }
            if (skillCastTime > 0) {

                owner.playAudio(skillItem.skillReadyAudio, readyskillAudioName);

                //contDamage 技能需要边施法边执行，所以要单独判断
                if ((effect.type == "contDamage")) {
                    owner.skillProgress(skillCastTime, skillName, true);
                    contDamageFn();
                } else {
                    owner.skillProgress(skillCastTime, skillName);

                    vaildAttackLater = setTimeout(() => {
                        // if (!checkCan()) {
                        //     skillEnd(skillItem, "中断");
                        //     // console.error(owner.GetNickName() + " 施放失败: " + errorLog, skillItem.skillName);
                        //     return;
                        // }

                        owner.SetPlayerState("施法", skillItem.animName);
                        owner.playAudio(skillItem.skillFireAudio, readyskillAudioName);

                        // if(owner.getPlayerType().includes('玩家')){
                        //     console.log(" 施放 音效 ",skillItem.skillFireAudio);
                        // }
                        let e = skillFn(skillItem);

                        if (e == "later") {
                            vaildAttackLater = setTimeout(() => {
                                skillEnd(skillItem, "结束");
                                // console.log(owner.GetNickName()+'施法成功 11 '+skillItem.skillName); 
                            }, scope.skillCastAnimDuration * 0.7);
                        } else {
                            skillEnd(skillItem, "结束");
                        }
                        // console.log(owner.GetNickName()+'施法成功 00 '+skillItem.skillName); 
                        // console.timeEnd(owner.GetNickName()+'施法成功'+skillItem.animName); 
                    }, skillCastTime * 1000);
                }
            } else {
                console.log(owner.GetNickName() + " 施放 22 被动技能： ", 
                skillItem.skillName,skillItem.effects[0],skillItem);
                
                skillFn(skillItem);
                if (skillItem.cCD == skillItem.CD) {
                    skillItem.cCD = 0;
                }
            }

        }
        let skillList = [];
        let oldSkillList = [];


        // 施放不需要目标或目标是自身的技能 如 增生
        function SendSkillToSelf(effect, skillItem) {
            let { type, skillName, value, time, duration, describe, controlId } = effect;
            console.log("施放不需要目标或目标是自身的技能 00 ", effect, skillItem);
            if (type == "shield" || type == "control") {
                //
                // console.log("施放不需要目标或目标是自身的技能 ", controlId);
                if (type == "shield") {
                    ReceiveControl(owner, skillName, effect, skillItem);
                    return true;
                }
                return true;
            }
            //
            if (type == "basicProperty") {
                scope.ReceiveSkill(owner,skillName,effect,skillItem);
                
                return true;
            }
            //增生
            if (type == "hyperplasia") {
                let count = effect.times;
                count = 1;
                let modelData = owner.GetModelData();
                for (let i = 0; i < count; i++) {
                    hyperplasia(modelData);
                }
                
                return true;
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
                initSkill(skillItem);
                CheckSkill_Persecond(skillItem);
            }
        }
        this._update = function (dt) {
            if (owner.GetIsDead()) { return; }
            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];

                if (!skillItem.isPassive && skillItem.trigger.type == "perSecond") {
                    // if (owner.GetNickName().includes("普通步兵")) {
                    //     console.log(owner.GetNickName() + " 技能CD 00 ",inSkill,owner.InFire(),skillItem.auto, skillItem.cCD, skillItem.CD, skillItem);
                    // }
                    if (skillItem.cCD == skillItem.CD) {

                        if (!owner.InFire()) { continue; }

                        if (!skillItem.auto) {
                            continue;
                        } else {
                            if (skillItem.cCD < skillItem.trigger.value) {
                                skillItem.cCD += 0.1;
                                continue;
                            }
                        }

                        if (inSkill) {
                            // return;
                            if (skillItem.effect.type == "control" || skillItem.effect.type == "shield") {
                                // EventHandler("中断技能", true);
                            } else {
                                // return;
                            }
                            continue;
                            // for (let i = 0; i < skillCDlist.length ; i++) {
                            //   const element = skillCDlist[i];
                            //   if(element.skillName == skillItem.skillName){
                            //     return; 
                            //   }
                            // }
                            // skillCDlist.push({skillName:skillItem.skillName,skillItem:skillItem});
                        }
                        SkillGo(skillItem);
                        continue;
                    }
                    // skillItem.cCD += dt;
                    skillItem.cCD += 0.033;
                    if (skillItem.cCD > skillItem.CD) {
                        skillItem.cCD = skillItem.CD;
                    }

                    owner.applyEvent("技能CD", skillItem.skillName, skillItem.cCD);
                    // if (owner.GetNickName().includes("普通步兵")) {
                    //     console.log(owner.GetNickName() + " 技能CD ", skillItem.skillName, skillItem.cCD, skillItem.CD);
                    // }
                    // console.log(" detatime " ,dt);
                }

                if (skillItem.isPassive && skillItem.trigger.type == "perSecond") {
                    if (skillItem.cCD == skillItem.CD) {
                        if (skillItem.cCD < skillItem.trigger.value) {
                            skillItem.cCD += 0.1;
                            continue;
                        } 
                        BuffGo(skillItem);
                        continue;
                    }
                    // skillItem.cCD += dt;
                    skillItem.cCD += 0.033;
                    if (skillItem.cCD > skillItem.CD) {
                        skillItem.cCD = skillItem.CD;
                    } 
                    owner.applyEvent("技能CD", skillItem.skillName, skillItem.cCD); 
                }
            }
        }

        function CheckSkill_Persecond(skillItem) {
            if (skillItem.trigger.type == "perSecond") {
                fireLater.push({
                    type: "interval", fn:
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
                                    SkillGo(skillItem);
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
            if (owner.GetIsDead()) {
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
        let _offsetTime = 0;
        let cutStartTime = 0;

        // 当前正在引导或施放的法术
        let castSkillList = [];
        function EventHandler(e, skillItem) {
            if (e == "中断延迟施法") {
                if (vaildAttackLater != null || vaildAttackLater2 != null) {
                    clearTimeout(vaildAttackLater);
                    clearTimeout(vaildAttackLater2);
                    vaildAttackLater = null;
                    vaildAttackLater2 = null;
                }

                return;
            }
            if (e == "目标死亡" || e == "没有目标") {
                owner.TargetDead();
                // if (baseSkillItem) {
                //     baseSkillItem.auto = false;
                // }
            }
            if (e == "距离太远") {
                // if (baseSkillItem) {
                //     baseSkillItem.auto = false;
                // }
            }

            
            if (e == "施法移动中断" || e == "中断技能" || e == "目标死亡") {
                if (e == "施法移动中断") {
                    if(canMovingCast){
                        return;
                    }
                }


                if (vaildAttackLater != null || vaildAttackLater2 != null) {
                    clearTimeout(vaildAttackLater);
                    clearTimeout(vaildAttackLater2);
                    vaildAttackLater = null;
                    vaildAttackLater2 = null;
                    // console.log(" 记录中断的时间 ",cutStartTime);
                } 

                clearCastSkill();
                if (inSkill) {
                    
                    _Global.DyncManager.SendDataToServer("npc技能",
                        { npcId: owner.id, skillItem: "中断" });
                    skillEnd(null, "中断技能");
                }
            }
            if (e == "中断施法") {
                clearCastSkill();
                skillEnd(null, "中断施法");
                owner.EventHandler(e);
            }

        }
        function clearCastSkill() {

            for (let i = 0; i < castSkillList.length; i++) {
                clearTimeout(castSkillList[i]);
            }
            castSkillList = [];
        }
        // 向玩家发送技能特效
        function shootTarget(taget, skillItem, speed, callback) {

            // 如果是瞬间到目标的技能则直接调用callback. 如魔爆术、月火术等
            if (skillItem.directToTarget) {
                callback();
                return;
            }

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
                skillItem.effect = effect;
                _Global.DyncManager.SendSceneStateAll(getSendTitle(target),
                    {
                        fromId: owner.id,
                        fromType: owner.getPlayerType(),
                        fromName: owner.GetNickName(),
                        targetId: target.id,
                        targetType: target.getPlayerType(),
                        targetName: target.GetNickName(),
                        // skillName: skillName,
                        // effect: effect,
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
            _Global.DyncManager.SendFireRecode({ playerId: owner.id, npcId: target.id, npcName: target.npcName, skillName: skillName, strength: value });
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
        function hyperplasia(modelData) {
            modelData = JSON.parse(JSON.stringify(modelData));

            modelData.scale = { x: 1, y: 1, z: 1 };
            let data = modelData.message.data;
            data.skillList = [];
            data.name = owner.GetNickName() + "的增生";
            let pos = owner.GetWorldPos();
            modelData.pos.x = pos.x + (RandomInt(-2, 2));
            modelData.pos.y = pos.y;
            modelData.pos.z = pos.z + (RandomInt(-2, 2));
            data.isCopy = true;
            if (data.baseData.maxHealth > 200) {
                data.baseData.maxHealth = 200;
            }
            data.baseData.strength = 20;
            data.baseData.health = data.baseData.maxHealth;

            // console.log("创建增生 ", data.name);
            _Global._YJNPCManager.DuplicateNPCByModelData(modelData, owner.id + "_" + new Date().getTime(), (transform) => {
                let npcComponent = transform.GetComponent("NPC");
                npcComponent.setOwnerPlayer(owner);
            });
        }

        init();

    }
}
export { YJSkill }