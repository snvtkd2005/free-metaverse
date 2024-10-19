


import * as THREE from "three";

// 增益效果和减溢效果
// 被动技能
class YJBuff {
    constructor(owner) {
        let scope = this;
        let targetModel = null;
        let baseData = null;
        function init() {
            owner.addEventListener("死亡", () => {
                ClearFireLater();
            });
            baseData = owner.GetBaseData();
        }
        this.addDebuff = function (effect) {
            let { type,runType,controlId, value, time, duration, describe, icon } = effect;
            // 每n秒伤害，持续m秒
            if (runType == "perSecond" && type == "basicProperty") {

                //每秒伤技能是debuff，显示在角色状态上
                let id = new Date().getTime();
                let count = parseInt(duration / time);
                let num = 0; 
                let buff = JSON.parse(JSON.stringify(effect)) ;
                buff.id = id;
                baseData.debuffList.push(buff);
                // console.error(" add Debuff ",id,JSON.parse(JSON.stringify(buff)));
                owner.applyEvent("添加debuff",buff);

                fireLater.push({
                    id: id,
                    type: "interval", fn:
                        setInterval(() => {
                            if (_Global.pauseGame) { return; }

                            buff.duration -= 1;
                            if (buff.duration <= 0) {
                                buff.duration = 0;
                            }
                            
                            baseData.health -= owner.GetProperty().RealyDamage(Math.abs(value) );
                            num++;
                            if (num >= count) {
                                scope.removeDebuffById(id);
                            }
                            owner.CheckHealth();

                            owner.applyEvent("debuffCD", buff);
                        }, 1000)
                });
                return;
            }
        }
        this.removeDebuffById = function (id) {
            for (let i = baseData.debuffList.length - 1; i >= 0; i--) {
                const item = baseData.debuffList[i];
                if (item.id == id) {
                    owner.applyEvent("移除debuff", id);
                    baseData.debuffList.splice(i, 1);
                }
            }

            for (let i = fireLater.length - 1; i >= 0; i--) {
                if (fireLater[i].id == id) {
                    if (fireLater[i].type == "timeout") {
                        clearTimeout(fireLater[i].fn);
                    }
                    if (fireLater[i].type == "interval") {
                        clearInterval(fireLater[i].fn);
                    }
                    fireLater.splice(i, 1);
                }
            }
        }


        this.addBuff = function (effect) {

            for (let i = 0; i < baseData.buffList.length; i++) {
                const element = baseData.buffList[i];
                if(element.skillName == effect.skillName){
                    element.duration = effect.duration;
                    return;
                }
            }
            let id = new Date().getTime();
            let { type, value, time, duration, describe, icon } = effect;

            let buff = JSON.parse(JSON.stringify(effect)) ;
            buff.id = id;
            baseData.buffList.push(buff);
            owner.applyEvent("添加buff", buff);
            // console.error(" add buff ",id,buff);

            fireLater.push({
                id: id,
                type: "interval", fn:
                    setInterval(() => {
            if (_Global.pauseGame) { return; }

                        buff.duration -= 1;
                        if (buff.duration <= 0) {
                            buff.duration = 0;
                            // 取消盾 
                            for (let i = baseData.buffList.length - 1; i >= 0; i--) {
                                const element = baseData.buffList[i];
                                if (element.id == id) {
                                    if (element.type == "shield") {
                                        owner.applyEvent("解除技能", element);
                                    } 
                                }
                            }

                        }
                        // console.log( effect.skillName  + " duration =  "+ buff.duration);
                        owner.applyEvent("buffCD", buff);
                    }, 1000)
            });
        }
        this.removeBuffById = function (id) {
            for (let i = baseData.buffList.length - 1; i >= 0; i--) {
                const item = baseData.buffList[i];
                if (item.id == id) {
                    owner.applyEvent("移除buff", id);
                    baseData.buffList.splice(i, 1);
                }
            }

            // console.error(" 移除buff CD计算",id,baseData.buffList);
            for (let i = fireLater.length - 1; i >= 0; i--) {
                if (fireLater[i].id == id) {
                    if (fireLater[i].type == "timeout") {
                        clearTimeout(fireLater[i].fn);
                    }
                    if (fireLater[i].type == "interval") {
                        clearInterval(fireLater[i].fn);
                    }
                    fireLater.splice(i, 1);
                }
            }

        }

        let fireLater = [];

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
            for (let i = baseData.debuffList.length - 1; i >= 0; i--) {
                const item = baseData.debuffList[i];
                owner.applyEvent("移除debuff", item.id);
                baseData.debuffList.splice(i, 1);
            }
            for (let i = baseData.buffList.length - 1; i >= 0; i--) {
                const item = baseData.buffList[i];
                owner.applyEvent("移除buff", item.id);
                baseData.buffList.splice(i, 1);
            }
        }


        init();

    }
}
export { YJBuff }