


import * as THREE from "three";

// 主播玩家的守护弹幕玩家
class YJDMPlayer {
    constructor(owner, isLocal = true) {
        let scope = this;
        let dmplayerList = [];
        this.GetdmplayerList = function () {
            return dmplayerList;
        }

        function init() { 
            // if (data.dmplayerList && data.dmplayerList.length > 0) { 
            //     scope.ChangeEquipList(data.dmplayerList);
            // }
        }

        this.ChangeEquipList = function (_dmplayerList) {
            let add = [];
            for (let i = 0; i < _dmplayerList.length; i++) {
                let has = false;
                for (let j = 0; j < dmplayerList.length && !has; j++) {
                    if(_dmplayerList[i].npcId == dmplayerList[j].npcId){
                        has = true;
                    }
                }
                if(!has){
                    // 提取没有的，需要添加的装备
                    add.push(_dmplayerList[i]);
                }
            }
 
            for (let i = 0; i < add.length; i++) {
                const element = add[i];
                let { uname, uface, assetId, camp, npcId, isDead } = element;
                let state =  { modelId: assetId, npcId: npcId, dmData: { uname, uface }  };
                _Global._YJFireManager.AddModelDMPlayer(state);
            }

            // 提取需要减少的
            let redius = [];
            for (let i = 0; i < dmplayerList .length; i++) {
                let has = false;
                for (let j = 0; j < _dmplayerList.length && !has; j++) {
                    if(dmplayerList[i].npcId == _dmplayerList[j].npcId){
                        has = true;
                    }
                }
                if(!has){
                    // 提取没有的，需要添加的装备
                    redius.push(dmplayerList[i]);
                }
            }
            console.log(" 需要减少的 弹幕npc ",redius);
            for (let i = 0; i < redius.length; i++) {
                const element = redius[i];
                _Global._YJFireManager.RemoveNPCFireId(element.npcId); 
            }

        } 
        init();

    }
}
export { YJDMPlayer };