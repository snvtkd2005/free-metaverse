


import * as THREE from "three";

// 道具、药剂等可以使用的物品

class YJProp {
    constructor(owner) {
        let scope = this;
        let targetModel = null;
        let baseData = null;
        function init() {
            baseData = owner.GetBaseData();
        } 
        this.UseProp = function (skillItem) {
            return PropGo(skillItem);
        }
        let skillCastTime = 0;
        //施放技能
        function PropGo(skillItem) {

            let { propType, effectType, property, bindingType, value } = skillItem;


            if (owner.GetIsDead()) {
                if (propType == "stuff") {
                    // 复活
                    if(effectType == "relife"){
                        _Global.applyEvent("道具复活");
                        return true;
                    }
                }

                return false;
            }
            // if(inSkill){return;}
            // console.log("使用道具 ",skillItem);return;

            if(propType == "potion"){
                if(effectType == "playerProperty"){
                    owner.GetProperty().updateBasedata(skillItem);
                }
            }
            if (propType == "stuff") {
                // 传送
                if(effectType == "transmit"){
                    
                }

                if(effectType == "relife"){ 
                    return false;
                }
            }

            return true; 
        }
 
        init();

    }
}
export { YJProp }