import * as THREE from "three";

import { YJLoadModel } from "./YJLoadModel";

import TWEEN from '@tweenjs/tween.js';
import { Vector3 } from "three";

import { createAnimationClip } from "/@/utils/utils_threejs.js";

// 矩形序列 A x B

class YJPlayerAnimData {
  constructor(_this, _YJSceneManager, modelPath, pos, rota, size) {
    let scope = this;
    let PlayerAnimData;
    function Init() {
      if (_this.GetPlayerAnimData) {
        PlayerAnimData = _this.GetPlayerAnimData();
      }else
      if (_this.$parent.GetPlayerAnimData) {
        PlayerAnimData = _this.$parent.GetPlayerAnimData();
      }else
      if (_this.$parent.$parent.GetPlayerAnimData) {
        PlayerAnimData = _this.$parent.$parent.GetPlayerAnimData();
      }
      scope.GetAllAnim(PlayerAnimData.defaultUser.avatarName);
    }


    this.GetAvatarData = function (playerName) {
      console.error(" 查找角色信息  ", playerName);
      for (let i = 0; i < PlayerAnimData.avatarData.length; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          return PlayerAnimData.avatarData[i];
        }
      }
      console.error(" 角色信息未找到 ", playerName);
    }

    // 获取扩展动作。动作从unity转的json文本中解析得到
    this.GetExtendAnim = function (playerName, animName, callback) {
      let has = false;
      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length && !has; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          has = true;
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      if (has) {
        console.log(avatarData);
        if (avatarData.animationsExtendData != undefined) {
          for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
            const element = avatarData.animationsExtendData[i];
            if (element.animName == animName) {
              // _this.GetPublicUrl() + element.path
              let path = (_this.$uploadPlayerUrl + "farmplayer/" + element.path);
              // console.log("加载扩展动作 ",path);
              _YJSceneManager.LoadAssset(path, (data) => { 
                if (callback) {
                  callback(element.isLoop,createAnimationClip(animName, data));
                }
              });
            }
          }
        }
      }
    }


    this.GetAllAnim = function (playerName, callback) {

      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length && !has; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          has = true;
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      if (has) {
        for (let i = 0; i < avatarData.animationsData.length; i++) {
          const element = avatarData.animationsData[i];
          animList.push(element.animName);
        }
        //再查找其扩展动作
        LoadExtendData(playerName, (animationsExtendData) => {
          if (animationsExtendData != undefined) {
            for (let i = 0; i < animationsExtendData.length; i++) {
              animList.push(animationsExtendData[i]);
            }
          }

          console.error(" 查找角色动作  ", playerName,animList);

          if (callback) {
            callback(animList);
          }
        });


        // if (avatarData.animationsExtendData != undefined) {
        //   for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
        //     const element = avatarData.animationsExtendData[i];
        //     animList.push(element.animName);
        //   }
        // }
      }
    }
    async function LoadExtendData(playerName, callback) {
      if (playerName == "小孩") {
        let res = await _this.$axios.get(
          _this.$uploadPlayerUrl + "farmplayer/farmplayer" + "_data.txt" + "?time=" + new Date().getTime()
        );
        if (callback) {
          callback(scope.AddAllExtendAnimData(playerName, res.data));
        }
      } else {
        if (callback) {
          callback();
        }
      }
    }




    this.GetAllExtendAnim = function (playerName) {
      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length && !has; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          has = true;
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      if (has) {
        if (avatarData.animationsExtendData != undefined) {
          for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
            const element = avatarData.animationsExtendData[i];
            animList.push(element.animName);
          }
        }
      }
      return animList;
    }
    // 添加或修改扩展动作
    this.AddExtendAnimData = function (playerName, item) {
      let has = false;
      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length && !has; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          has = true;
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      if (has) {
        if (avatarData.animationsExtendData != undefined) {
          has = false;
          for (let i = 0; i < avatarData.animationsExtendData.length && !has; i++) {
            const element = avatarData.animationsExtendData[i];
            if (element.animName == item.animName) {
              has = true;
              element.animName = item.animName;
              element.path = item.path;
              element.isLoop = item.isLoop;
            }
          }
          if (!has) {
            avatarData.animationsExtendData.push({ animName: item.animName,isLoop:item.isLoop, path: item.path });
          }

        } else {
          avatarData.animationsExtendData = [];
          avatarData.animationsExtendData.push({ animName: item.animName,isLoop:item.isLoop, path: item.path });
        }
      }
      return this.GetAllExtendAnim(playerName);
    }
    this.AddAllExtendAnimData = function (playerName, playerData) {
      let has = false;

      let avatarData = null;
      for (let i = 0; i < PlayerAnimData.avatarData.length && !has; i++) {
        if (PlayerAnimData.avatarData[i].name == playerName) {
          has = true;
          avatarData = PlayerAnimData.avatarData[i];
        }
      }
      if (has) {
        avatarData.animationsExtendData = [];
        for (let i = 0; i < playerData.length; i++) {
          const item = playerData[i];
          avatarData.animationsExtendData.push({ animName: item.animName,isLoop:item.isLoop, path: item.path });
        }
      }
      return this.GetAllExtendAnim(playerName);
    }


    //#region 获取技能
    this.GetSkillList = function(playerName,callback){
      GetSkillListFn(playerName,callback);
    }
    async function GetSkillListFn(playerName,callback){
      if (playerName == "小孩") {
        let res = await _this.$axios.get(
          _this.$uploadPlayerUrl + "farmplayer/farmplayer" + "_skill_data.txt" + "?time=" + new Date().getTime()
        ); 
        if (callback) {
          callback(res.data);
        }
      } else {
        if (callback) {
          callback();
        }
      }
    }
    //#endregion



    Init();
  }
}


export { YJPlayerAnimData };