


import * as THREE from "three";

import {YJTween} from "./YJTween.js";


// 道具、药剂等可以使用的物品

class YJProp {
    constructor(owner) {
        let scope = this;
        let targetModel = null;
        let baseData = null;
        let _YJTween = null;
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
                if(effectType == "collectGold"){
                    //收取所有金币
                    // 获取所有金币、把基本移动到主角位置、金币数量增加
                //    let allGold = _Global.YJ3D._YJSceneManager.Create_LoadUserModelManager().GetAllTransformByNameType("gold");
                //    if(_YJTween == null){
                //     _YJTween = new YJTween();
                //     _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJTween);
                //   } 

                //    for (let i = 0; i < allGold.length; i++) {
                //     const element = allGold[i];
                //     // .GetWorldPosHalfHeight()
                //     _YJTween.TweenPos2(element.GetWorldPos(),element,owner,1.0,
                //     ()=>{
                //         element.SetActive(false); 
                //         _Global._YJPlayerFireCtrl.GetProperty().updateBasedata({value:1,property:"gold"});
                //     });
                //    }
  
                _Global._YJGame_mainCtrl.CollectGold();

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