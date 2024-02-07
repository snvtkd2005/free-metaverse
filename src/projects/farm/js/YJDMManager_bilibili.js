



import * as THREE from "three";

import {socket_bilibili} from "/@/utils/socket_bilibili.js";
import * as world_configs from "/@/utils/socket_bilibili/index.js";

// 弹幕互动管理器
/**
 * 点赞：所有角色生命+20
 * 弹幕{ 1增加护甲 ； 2增加生命；3增加能量}
 */
class YJDMManager_bilibili {
  constructor(indexVue,_SceneDyncManager,_SceneManager) {

    let propList = [];
    this.addProp = function (element) { 
      propList.push(element);
      console.log(" 初始化道具 =======",propList);

    }
    this.stopAudio = function (id) { 
    }
    function init() {
      new socket_bilibili((data)=>{
        let {cmd, msg, uname, uid,uface } = data;
        switch (cmd) {
          case world_configs.LIVE_OPEN_PLATFORM_DM:
            console.log(uname, " 发送弹幕 ", msg);
            if(msg==1 ||msg==2||msg==3||msg==4||msg==5 ){
              let i = msg-1;
              if (_Global.YJDync) {
                _SceneDyncManager.SendModel({ id: propList[i].id, modelType: "交互模型", state: { type: "add", value:  propList[i].buffValue } });
              } else {
                _SceneManager.ReceivePlayer( propList[i]);
              }
              // return;
            }
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneStateAll("转发", { type: "弹幕", state: {uface,uname,msg} });
            }else{
              indexVue.$refs.HUD.$refs.DMPanel.receiveMsg({uface,uname,msg});
            }
            break;
          case world_configs.LIVE_OPEN_PLATFORM_LIKE:
            console.log(uname, " 点赞 ");
            //所有玩家加10点生命
            if (_Global.YJDync) {
              _Global._YJDyncManager.SendSceneStateAll("转发", { type: "所有人加生命", state: 200 });
            } else {
              _SceneManager.ReceivePlayer({buff:"addHealth",buffValue:200});
            }
            break;
  
          default:
            break;
        }
      });

    }

    init();
  }
}

export { YJDMManager_bilibili };