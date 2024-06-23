


import * as THREE from "three";

class YJSkill {
    constructor(owner) {

        let targetModel = null;
        let baseData = null;
        function init() {
            owner.addEventListener("首次进入战斗", () => {
                CheckSkill();
            });
            owner.addEventListener("施放结束或中断", () => {
                skillEnd();
            });

            owner.addEventListener("同步技能", (msg) => {
                Dync(msg);
            });

            owner.addEventListener("技能护甲归零", () => {
                RemoveSkill("寒冰护体");
            });

            owner.addEventListener("healthChange", () => {
                CheckSkill_Health();
            });
            owner.addEventListener("死亡或离开战斗", () => {
                ClearFireLater();
            });
            owner.addEventListener("重生", () => {
                inSkill = false;
            });

            owner.addEventListener("攻击", (_skillName, particle) => {
                fireParticleId = particle;
                skillName = _skillName;
            });
            owner.addEventListener("普通攻击目标", (targetModel, skill) => {
                SendDamageToTarget(targetModel, skill);
            });

            owner.addEventListener("设置目标", (_targetModel) => {
                targetModel = _targetModel;
            });

            owner.addEventListener("脱离战斗或死亡", () => {
                ClearControlModel();

                if (hyperplasiaTrans.length > 0) {
                    for (let i = 0; i < hyperplasiaTrans.length; i++) {
                        hyperplasiaTrans[i].Dead();
                    }
                    hyperplasiaTrans = [];
                }
            });

            baseData = owner.GetBaseData();
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
        }
        this.ReceiveControl = function (_targetModel, skillName, effect) {
            ReceiveControl(_targetModel, skillName, effect);
        }
        function ReceiveControl(_targetModel, skillName, effect, skillItem) {
            let { type, value, time, duration, describe, icon, fromName } = effect;
            if (type == "control") {
                //冻结8秒
                ReceiveSkill(effect, skillItem);
                owner.SetPlayerState("停止移动");

                if (controlFnLater != null) {
                    clearTimeout(controlFnLater);
                }
                controlFnLater = setTimeout(() => {
                    RemoveSkill(effect.controlId);

                    _Global.DyncManager.SendDataToServer("解除技能",
                        { npcId: owner.id, skill: effect });
                }, 8000);

                _Global.DyncManager.SendDataToServer("受到技能",
                    { npcId: owner.id, skill: effect });
                return;
            }
            if (type == "shield") {
                baseData.shield = value;
                ReceiveSkill(effect, skillItem);
                return;
            }

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
        function RemoveSkill(skillName) {

            if (skillName == "冰霜新星") {
                owner.inControl = false;
                for (let i = controlModels.length - 1; i >= 0; i--) {
                    const item = controlModels[i];
                    item.modelTransform.Destroy();
                    controlModels.splice(i, 1);
                }
                if (targetModel != null && !targetModel.isDead) {
                    owner.SetNpcTarget(targetModel);
                }
                return;
            }
            if (skillName == "寒冰护体") {
                for (let i = controlModels.length - 1; i >= 0; i--) {
                    const item = controlModels[i];
                    item.modelTransform.Destroy();
                    controlModels.splice(i, 1);
                }
                return;
            }
        }
        function ReceiveSkill(effect, skillItem) {
            let skillName = effect.controlId;
            let type = effect.type;
            if (skillName == "冰霜新星") {
                owner.inControl = true;
                if (HasControlModel(skillName)) {
                    return false;
                }
                _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().CopyModel("冰霜新星模型", (model) => {
                    model.SetPos(owner.GetWorldPos());
                    let nameScale = owner.GetScale();
                    model.AddScale(new THREE.Vector3(nameScale, nameScale, nameScale));
                    model.SetActive(true);
                    AddControlModel(skillName, model);
                });
            }
            if (type == "shield") {
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
                if (skill.type == "control") {
                    RemoveSkill("冰霜新星");
                }
                return;
            }
            if (msg.title == "受到技能") {
                let skill = msg.skill;
                if (skill.type == "control") {
                    ReceiveSkill("冰霜新星", "on");
                    return;
                }
                return;
            }

            if (msg.title == "npc技能攻击") {
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

        let firePart = ''; //攻击特效放出施法部位
        let fireParticleId = ''; //攻击特效id 
        let readyskillAudioName = "";
        let skillName = "";
        let vaildAttackDis = 3; //有效攻击距离
        // 攻击速度，攻击间隔，判定有效的攻击时机
        let attackStepSpeed = 3; //攻击间隔/攻击速度
        function skillEnd() {
            inSkill = false;

            _Global.YJAudioManager().stopAudio(readyskillAudioName);

        }
        //施放技能
        function SkillGo(skillItem) {
            if (owner.isDead) {
                return false;
            }
            let effect = skillItem.effect;
            console.log("施放技能", effect);
            effect.skillName = skillItem.skillName;

            readyskillAudioName = skillName;

            vaildAttackDis = skillItem.vaildDis;
            attackStepSpeed = skillItem.castTime;
            owner.SetVaildAttackDis(vaildAttackDis);

            let { skillFireAudio, skillFirePart, skillFireParticleId, skillReadyAudio, skillReadyParticleId } = skillItem;
            if (skillFirePart) {
                firePart = skillFirePart;
            }
            if (skillFireParticleId) {
                fireParticleId = skillFireParticleId;
            }


            let targetType = skillItem.target.type;
            if (targetType == "target") {

                if (targetModel == null || (targetModel && targetModel.isDead)) {
                    skillEnd();
                    return false;
                }
                let { type, skillName, value, time, duration, describe, controlId } = effect;

                if (controlId == "冲锋") {
                    //移动速度提高，冲向目标
                    owner.MoveToTargetFast();
                }
                // 持续伤害
                else if (effect.type == "contDamage") {
                    let num = 0;
                    let count = parseInt(skillItem.castTime / effect.time);

                    for (let k = 0; k < count; k++) {
                        castSkillList.push(setTimeout(() => {
                            if (baseData.health == 0) {
                                skillEnd();
                                return;
                            }
                            // 目标攻击
                            if (targetModel == null || targetModel.isDead) {
                                skillEnd();
                                return;
                            }
                            SendDamageToTarget(targetModel, effect);
                            num++;
                            if (num == count) {
                                skillEnd();
                            }
                        }, effect.time * k * 1000));
                    }
                    owner.SetPlayerState("施法", skillItem.animName);
                    if (toIdelLater != null) { clearTimeout(toIdelLater); };
                    toIdelLater = setTimeout(() => {
                        owner.SetValue("readyAttack_doonce", 0);
                        toIdelLater = null;
                        skillEnd();
                    }, attackStepSpeed * 1000);//间隔等于攻击动作时长 
                } else {

                    if (skillItem.castTime > 0) {
                        owner.SetPlayerState("施法", skillItem.animNameReady);

                        EventHandler("中断技能", false);
                        if (vaildAttackLater == null) {
                            vaildAttackLater = setTimeout(() => {
                                if (targetModel != null && targetModel.isDead) {
                                    owner.TargetDead();
                                    return;
                                }
                                owner.SetPlayerState("施法", skillItem.animName);
                                owner.playAudio(skillItem.skillFireAudio, readyskillAudioName);

                                vaildAttackLater2 = setTimeout(() => {
                                    if (targetModel == null || targetModel.isDead) {
                                        EventHandler("中断技能");
                                        return;
                                    }

                                    SendDamageToTarget(targetModel, effect);
                                    _Global.DyncManager.SendDataToServer("npc技能攻击",
                                        { npcId: owner.id, skill: effect });
                                }, attackStepSpeed * 100);
                                if (toIdelLater != null) { clearTimeout(toIdelLater); };
                                toIdelLater = setTimeout(() => {
                                    owner.SetValue("readyAttack_doonce", 0);

                                    toIdelLater = null;
                                    skillEnd();
                                }, attackStepSpeed * 400);//间隔等于攻击动作时长
                                vaildAttackLater = null;
                            }, skillItem.castTime * 1000);
                        }

                    } else {
                        owner.SetPlayerState("施法", skillItem.animName);
                        owner.playAudio(skillItem.skillFireAudio, readyskillAudioName);

                        vaildAttackLater2 = setTimeout(() => {
                            if (targetModel == null || targetModel.isDead) {
                                EventHandler("中断技能");
                                return;
                            }
                            SendDamageToTarget(targetModel, effect);
                            _Global.DyncManager.SendDataToServer("npc技能攻击",
                                { npcId: owner.id, skill: effect });
                        }, attackStepSpeed * 100);
                        if (toIdelLater != null) { clearTimeout(toIdelLater); };
                        toIdelLater = setTimeout(() => {
                            owner.SetValue("readyAttack_doonce", 0);

                            toIdelLater = null;
                            skillEnd();
                        }, attackStepSpeed * 400);//间隔等于攻击动作时长

                    }
                }
            }

            // 范围攻击
            if (targetType == "area") {
                let players = _Global.DyncManager.GetPlayerByNpcForwardInFireId(
                    owner, owner.fireId, vaildAttackDis, skillItem.target.value);
                // 范围内无目标，不施放技能
                if (players.length == 0) {
                    return false;
                }
                if (effect.type == "damage") {
                    for (let l = 0; l < players.length; l++) {
                        if (players[l].isDead) {
                            continue;
                        }
                        SendDamageToTarget(players[l], effect);
                    }
                    owner.ChangeAnim(skillItem.animName, "idle");
                }

                else if (effect.type == "contDamage") {
                    // 持续伤害
                    let num = 0;
                    let count = parseInt(skillItem.castTime / effect.time);
                    for (let k = 0; k < count; k++) {
                        castSkillList.push(setTimeout(() => {
                            if (baseData.health == 0) {
                                skillEnd();
                                return;
                            }
                            for (let l = 0; l < players.length; l++) {
                                if (players[l].isDead) {
                                    continue;
                                }
                                SendDamageToTarget(players[l], effect);
                            }
                            num++;
                            if (num == count) {
                                skillEnd();
                            }
                        }, effect.time * k * 1000));
                    }
                    owner.SetPlayerState("施法", skillItem.animName);
                    if (toIdelLater != null) { clearTimeout(toIdelLater); };
                    toIdelLater = setTimeout(() => {
                        owner.SetValue("readyAttack_doonce", 0);

                        toIdelLater = null;
                        skillEnd();
                    }, attackStepSpeed * 1000);//间隔等于攻击动作时长

                } else if (effect.type == "control") {
                    if (effect.controlId == "冰霜新星") {
                        SendSkill(effect,skillItem);
                        return true;
                    }
                    if (effect.controlId == "嘲讽") {
                        // console.log( owner.GetNickName() + " 嘲讽 ",vaildAttackDis ,players,skillItem);
                        for (let l = 0; l < players.length; l++) {
                            if (players[l].isDead) {
                                continue;
                            }
                            players[l].SetNpcTargetToNoneDrict();
                            players[l].SetNpcTarget(owner, true, false);
                        }
                        owner.ChangeAnim(skillItem.animNameReady, "idle");
                        if (vaildAttackLater == null) {
                            vaildAttackLater = setTimeout(() => {
                                owner.ChangeAnim(skillItem.animName, "idle");
                                owner.SetValue("readyAttack_doonce", 0);

                                toIdelLater = null;
                                skillEnd();
                                //有效攻击 && 
                                SendSkill(effect,skillItem);
                                _Global.DyncManager.SendDataToServer("npc技能攻击",
                                    { npcId: owner.id, skill: effect });
                                vaildAttackLater = null;
                            }, skillItem.castTime * 1000);
                        } 
                    }

                }

            }

            if (targetType.includes("random")) {

                if (targetType.includes("Friendly")) {
                    // 找友方目标 
                    let { player, playerId } = _Global.DyncManager.GetSameCampByRandom(owner.GetCamp());
                    randomSelectModel = player;
                    skillItem.effect.playerId = playerId;
                } else {
                    // 找敌对阵营的目标
                    let { player, playerId } = _Global.DyncManager.GetNoSameCampByRandom(owner.GetCamp());
                    randomSelectModel = player;
                    skillItem.effect.playerId = playerId;
                }
                // 随机进没目标时，返回false 不施放技能
                if (randomSelectModel == null) {
                    return false;
                }
                function fn() {
                    vaildAttackLater2 = setTimeout(() => {
                        if (randomSelectModel.isDead) {
                            EventHandler("中断技能");
                            return;
                        }
                        //有效攻击 && 
                        SendDamageToTarget(randomSelectModel, skillItem.effect);

                        _Global.DyncManager.SendDataToServer("npc技能攻击",
                            { npcId: owner.id, skill: skillItem.effect });

                    }, attackStepSpeed * 100);
                    if (toIdelLater != null) { clearTimeout(toIdelLater); };

                    toIdelLater = setTimeout(() => {
                        owner.SetValue("readyAttack_doonce", 0);


                        toIdelLater = null;
                        skillEnd();
                    }, attackStepSpeed * 400);//间隔等于攻击动作时长
                }

                if (skillItem.castTime > 0) {
                    owner.SetPlayerState("施法", skillItem.animNameReady);
                    EventHandler("中断技能", false);
                    if (vaildAttackLater == null) {
                        vaildAttackLater = setTimeout(() => {
                            if (randomSelectModel != null && randomSelectModel.isDead) {
                                owner.TargetDead();
                                return;
                            }
                            owner.SetPlayerState("施法", skillItem.animName);
                            fn();
                            vaildAttackLater = null;
                        }, attackStepSpeed * 1000);
                    }

                } else {
                    owner.SetPlayerState("施法", skillItem.animName);
                    fn();
                }
            }


            if (targetType == "none" || targetType == "self" || targetType == "selfPos") {
                if (skillItem.castTime > 0) {
                    owner.ChangeAnim(skillItem.animNameReady, "idle");

                    EventHandler("中断技能", false);
                    if (vaildAttackLater == null) {
                        vaildAttackLater = setTimeout(() => {
                            owner.ChangeAnim(skillItem.animName, "idle");
                            owner.SetValue("readyAttack_doonce", 0);

                            toIdelLater = null;
                            skillEnd();
                            //有效攻击 && 
                            SendSkill(effect,skillItem);
                            _Global.DyncManager.SendDataToServer("npc技能攻击",
                                { npcId: owner.id, skill: effect });
                            vaildAttackLater = null;
                        }, skillItem.castTime * 1000);
                    }

                } else {
                    owner.SetPlayerState("施法", skillItem.animName);

                    //有效攻击 && 
                    if (!SendSkill(effect, skillItem)) {
                        return false;
                    }
                    _Global.DyncManager.SendDataToServer("npc技能攻击",
                        { npcId: owner.id, skill: effect });
                    owner.SetValue("readyAttack_doonce", 0);

                    skillEnd();

                    vaildAttackLater2 = setTimeout(() => {
                    }, skillItem.castTime * 100);

                    if (toIdelLater != null) { clearTimeout(toIdelLater); };
                    toIdelLater = setTimeout(() => {
                        toIdelLater = null;
                    }, skillItem.castTime * 400);//间隔等于攻击动作时长
                }
            }

            if (targetType.includes("minHealth")) {
                if (targetType.includes("Friendly")) {
                    // 找友方目标 
                    let players = _Global.DyncManager.GetSameCamp(owner.GetCamp());

                    let max = 100;
                    let _player = null;
                    for (let i = 0; i < players.length; i++) {
                        const player = players[i];
                        if (player.isDead) {
                            continue;
                        }
                        if (player.GetHealthPerc() <= max) {
                            max = player.GetHealthPerc();
                            _player = player;
                        }
                    }
                    randomSelectModel = _player;
                    skillItem.effect.playerId = _player.id;
                } else {
                }
                if (randomSelectModel == null) {
                    return false;
                }
                if (skillItem.castTime > 0) {
                    owner.ChangeAnim(skillItem.animNameReady, "idle");
                    EventHandler("中断技能", false);
                    if (vaildAttackLater == null) {
                        vaildAttackLater = setTimeout(() => {
                            owner.ChangeAnim(skillItem.animName, "idle");
                            owner.SetValue("readyAttack_doonce", 0);

                            toIdelLater = null;
                            //有效攻击 && 
                            SendDamageToTarget(randomSelectModel, effect);
                            _Global.DyncManager.SendDataToServer("npc技能攻击",
                                { npcId: owner.id, skill: effect });
                            vaildAttackLater = null;
                        }, skillItem.castTime * 1000);
                    }

                } else {
                    owner.ChangeAnim(skillItem.animName, "idle");
                    //有效攻击 && 
                    SendDamageToTarget(randomSelectModel, effect);
                    _Global.DyncManager.SendDataToServer("npc技能攻击",
                        { npcId: owner.id, skill: effect });
                }
            }

            owner.playAudio(skillItem.skillReadyAudio, readyskillAudioName);
            inSkill = true;

            if (skillItem.castTime > 0) {
                // 需要施法的技能才发送技能同步，瞬发技能无需同步
                _Global.DyncManager.SendDataToServer("npc技能",
                    { npcId: owner.id, skill: skillItem });
                attackStepSpeed = skillItem.castTime;
                //取消寻路，让npc站住施法
                owner.SetNavPathToNone();
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
            // console.log("施放不需要目标或目标是自身的技能 00 ", effect);
            if (type == "shield" || type == "control") {
                //
                // console.log("施放不需要目标或目标是自身的技能 ", controlId);
                if (type == "shield") {
                    ReceiveControl(null, controlId, effect, skillItem);
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
                        npcComponent.ReceiveDamageByPlayer(null, controlId, effect);
                    }
                    _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().LoadSkillGroup(skillItem.skillFireParticleId, (model) => {
                        model.SetPos(owner.GetWorldPos());
                        model.SetActive(true);
                    });
                    return true;
                }
                //

                // console.log("施放不需要目标或目标是自身的技能 ", controlId);

                if (controlId == "冰霜新星") {
                    // 冻结20米内的敌人。 冰霜新星冻结特效
                    let npcs = _Global._YJNPCManager.GetNoSameCampNPCInFireInVailDis(owner.GetWorldPos(), owner.GetCamp(), 20);
                    if (npcs.length == 0) {
                        return false;
                    }
                    effect.value = 0;
                    for (let i = 0; i < npcs.length; i++) {
                        const npcComponent = npcs[i];
                        npcComponent.ReceiveDamageByPlayer(null, controlId, effect);
                    }

                    // 冰霜新星施放特效
                    _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().CopyModel("冰霜新星", (model) => {
                        model.SetPos(owner.GetWorldPos());
                        model.SetActive(true);
                    });
                }
            }
            //
            if (type == "addHealth") {
                owner.Dync({ title: "加生命", value: value });
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
            // 发送战斗记录
            _Global.DyncManager.SendFireRecode({ npcId: owner.id, npcName: owner.npcName, skillName: skillName, describe: describe });

        }
        let fireLater = [];
        let inSkill = false;//是否在使用施法技能攻击
        let skillCDlist = [];

        this.SetSkillCDRate = function (rate) {
            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];
                if (skillItem.trigger.type == "perSecond") {
                    skillItem.trigger.CD *= rate;
                    skillItem.CD *= rate;
                    if (skillItem.cCD > skillItem.CD) {
                        skillItem.cCD = skillItem.CD;
                    }
                }
            }
        }
        // 每次进入战斗，初始化其技能
        function CheckSkill() {
            for (let i = 0; i < skillList.length; i++) {
                const skillItem = skillList[i];
                // 触发方式 每间隔n秒触发。在进入战斗时调用
                CheckSkill_Persecond(skillItem);
            }
            CheckSkill_Health();
        }
        function CheckSkill_Persecond(skillItem) {
            if (skillItem.trigger.type == "perSecond") {

                if (skillItem.trigger.CD) {
                    skillItem.CD = skillItem.trigger.CD;
                } else {
                    skillItem.CD = skillItem.trigger.value;
                    skillItem.trigger.CD = skillItem.trigger.value;
                }

                if (skillItem.CD == 0) {
                    if (skillItem.castTime > 0) {
                        // 冷却时间一定要比施放时间更长
                        if (skillItem.castTime >= skillItem.CD) {
                            skillItem.CD = skillItem.castTime + 0.5;
                        }
                    }
                }

                skillItem.cCD = skillItem.CD;

                fireLater.push({
                    type: "interval", fn:
                        // setInterval(() => {
                        //   if (_Global.mainUser) {
                        //     // console.log( owner.GetNickName() + " 请求 施放技能 ",skillItem);

                        //     if (inSkill) {

                        //       if (skillItem.effect.type == "control") {
                        //         EventHandler("中断技能");
                        //       } else {
                        //         return;
                        //       }
                        //     }
                        //     console.log(owner.GetNickName() + " 施放技能 ", skillItem);
                        //     SkillGo(skillItem);
                        //   }
                        // }, (skillItem.trigger.value + skillItem.castTime) * 1000)
                        setInterval(() => {
                            if (_Global.pauseGame) { return; }
                            if (_Global.mainUser) {
                                if (skillItem.cCD == skillItem.CD) {
                                    if (inSkill) {
                                        // return;
                                        if (skillItem.effect.type == "control" || skillItem.effect.type == "shield") {
                                            EventHandler("中断技能");
                                        } else {
                                            // return;
                                        }

                                        // for (let i = 0; i < skillCDlist.length ; i++) {
                                        //   const element = skillCDlist[i];
                                        //   if(element.skillName == skillItem.skillName){
                                        //     return; 
                                        //   }
                                        // }
                                        // skillCDlist.push({skillName:skillItem.skillName,skillItem:skillItem});
                                    }
                                    // if (owner.npcName.includes("老a")) {
                                    //   console.log(owner.GetNickName() + " 施放技能 ", skillItem);
                                    // }
                                    if (SkillGo(skillItem)) {
                                        if (_Global.CombatLog) {
                                            _Global.CombatLog.log(owner.npcName, "", "技能", skillItem.effect.skillName);
                                        }
                                        skillItem.cCD = 0;
                                    }
                                    return;
                                }
                                skillItem.cCD += 0.1;
                                if (skillItem.cCD > skillItem.CD) {
                                    skillItem.cCD = skillItem.CD;
                                }
                                owner.applyEvent("技能CD", skillItem.skillName, skillItem.cCD)
                            }
                        }, 100)
                }
                );
            }
        }
        // 随机选中的玩家
        let randomSelectModel = null;
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

                    if (cutSkill) {
                        if (inSkill) {
                            _Global.DyncManager.SendDataToServer("npc技能",
                                { npcId: owner.id, skill: "中断" });
                        }
                    }
                    // console.log(" 记录中断的时间 ",cutStartTime);
                }
                for (let i = 0; i < castSkillList.length; i++) {
                    clearTimeout(castSkillList[i]);
                }
                castSkillList = [];

            }
        }
        // 向玩家发送技能特效
        function shootTarget(taget, time, callback) {
            let pos = owner.GetShootingStartPos();
            if (firePart) {
                //找对应骨骼所在的坐标
                owner.GetBoneVagueFire(firePart, (pos) => {
                    _Global.DyncManager.shootTarget(pos, taget, time, "player", fireParticleId, callback);
                });
                return;
            }
            _Global.DyncManager.shootTarget(pos, taget, time, "player", fireParticleId, callback);
            fireParticleId = "";
            firePart = "";
            // _Global.DyncManager.shootTarget(_this.YJController.GetPlayerWorldPos(), taget, time, "npc",fireParticleId,callback);

        }


        // 根据技能数据计算对目标造成伤害
        function SendDamageToTarget(target, effect) {
            // if(owner.npcName.includes("ZH画渣") && targetModel){
            //   console.log(GetNickName() + ' 对目标造成伤害 ',target,effect);
            // }
            // 玩家镜像
            if (owner.GetIsPlayer()) {
                SendDamageToTarget2(target, effect);
                return;
            }
            if (target == null) {
                return;
            }
            let { type, skillName, value, time, duration } = effect;

            // setTimeout(() => {
            //   // 发送战斗记录
            // }, attackStepSpeed * 100);
            // 发送技能特效
            shootTarget(target, attackStepSpeed * 300, () => {


                // 发送战斗记录
                _Global.DyncManager.SendFireRecode({ targetId: target.id, npcId: owner.id, npcName: owner.npcName, skillName: skillName, strength: value });

                if (target != null && target.isDead) {
                    owner.TargetDead();
                    return;
                }
                owner.AddExp(20);
                effect.fromName = owner.npcName;
                if (target.isYJNPC) {
                    _Global.DyncManager.SendSceneStateAll("NPC对NPC", { targetId: target.id, npcId: owner.id, npcName: owner.npcName, skillName: skillName, effect: effect });
                } else {
                    _Global.DyncManager.SendSceneStateAll("NPC对玩家", { targetId: target.id, npcId: owner.id, npcName: owner.npcName, skillName: skillName, effect: effect });
                }

            });



        }


        // 玩家的镜像角色是 YJNPC类
        function SendDamageToTarget2(target, effect) {
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
            shootTarget(target, attackStepSpeed * 300);

            _Global.DyncManager.SendSceneStateAll("玩家对NPC", { playerId: owner.id, npcId: target.transform.id, npcName: target.npcName, skillName: skillName, effect: effect });
        }


        let hyperplasiaTrans = [];
        function hyperplasia(modelData, num, count, times) {
            modelData = JSON.parse(JSON.stringify(modelData));
            modelData.scale = { x: 1, y: 1, z: 1 };
            let data = modelData.message.data;
            data.name = owner.npcName + "的增生" + times + "_" + (num + 1);
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
                    _Global.DyncManager.NPCAddFireById(npcComponent, owner.fireId, targetModel.id);
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