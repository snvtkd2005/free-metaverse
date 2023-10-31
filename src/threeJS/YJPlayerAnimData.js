
import { createAnimationClip,createAnimationClip2,createAnimationClipScale } from "/@/utils/utils_threejs.js";
import { YJLoadAnimation } from "/@/threeJS/loader/YJLoadAnimation.js";

// 读取模型的动作数据
class YJPlayerAnimData {
  constructor(_this) {
    let scope = this;
    let PlayerAnimData;
    let avatarDataList = [];

    let _YJLoadAnimation = null;
    function Init() {
      if (_this.GetPlayerAnimData) {
        PlayerAnimData = _this.GetPlayerAnimData();
      } else
        if (_this.$parent.GetPlayerAnimData) {
          PlayerAnimData = _this.$parent.GetPlayerAnimData();
        } else
          if (_this.$parent.$parent.GetPlayerAnimData) {
            PlayerAnimData = _this.$parent.$parent.GetPlayerAnimData();
          }
      // console.log(" in yj PlayerAnimData ", PlayerAnimData);
      avatarDataList = PlayerAnimData.avatarData;

      let has = false;
      for (let i = 0; i < avatarDataList.length; i++) {
        const element = avatarDataList[i];
        if (element.name == PlayerAnimData.defaultUser.avatarName) {
          has = true;
        }
      }
      scope.GetAllAnim(has ? avatarDataList[0].name : PlayerAnimData.defaultUser.avatarName);
    }


    this.GetAllAvatar = function(){
      return avatarDataList;
    }

    this.GetAvatarData = function (playerName) {
      // console.error(" 查找角色信息  ", playerName, avatarDataList);
      for (let i = 0; i < avatarDataList.length; i++) {
        if (avatarDataList[i].name == playerName) {
          return  FindBoneRefAnimationData(avatarDataList[i]);
        }
      }
      console.error(" 角色信息未找到 ", playerName);
    }
    //查找动画数据时，把映射数据也加上
    function FindBoneRefAnimationData(avatarData){
      if(avatarData.boneRefPlayer == undefined ){
        return avatarData;
      }
      for (let i = 0; i < avatarDataList.length; i++) {
        // console.log(avatarDataList[i],avatarData.boneRefPlayer);
        if (avatarDataList[i].id+'' == avatarData.boneRefPlayer) {
          avatarData.boneRefPlayerAnimationData = avatarDataList[i].animationsExtendData;
          return  avatarData;
        }
      }
    }


    this.UpdateAvatarDataById = function(id,avatarData){
      for (let i = 0; i < avatarDataList.length ; i++) {
        if (avatarDataList[i].id == id) { 
          avatarDataList[i] = avatarData;
        }
      }
    }
    // 获取扩展动作。动作从unity转的json文本中解析得到
    this.GetExtendAnim = function (playerName, animName, callback) {
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].name == playerName) {
          has = true;
          avatarData = avatarDataList[i];
        }
      }
      if (has) {
        // console.error(animName, avatarData);
        // 本角色扩展动作
        if (avatarData.animationsExtendData != undefined) {
          for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
            const element = avatarData.animationsExtendData[i];
            if (element.animName == animName) {

              let path = (_this.$uploadUrl + avatarData.id + "/" + element.path);
              // console.log("加载扩展动作 ",path);
              if (path.includes("json")) {
                this.LoadAssset(path, (data) => {
                  console.log(" 读取扩展动作 ", path, data);
                  if (callback) {
                    callback(element.isLoop, createAnimationClip(animName, data));
                  }
                });
              } else {
                //fbx动作直接加载模型，提前里面的动画
                if (_YJLoadAnimation == null) {
                  _YJLoadAnimation = new YJLoadAnimation();
                }
                _YJLoadAnimation.load(path, (anim) => {

                  if (callback) {
                    callback(element.isLoop, anim);
                  }
                });
              }
              return;
            }
          }
        }
        //*
        // 映射到其他角色动作: 情况太复杂，实验失败
        if (avatarData.boneRefPlayer != undefined 
          && avatarData.boneRefPlayerAnimationData != undefined
          && avatarData.boneRefPlayerAnimationData.length>0 
          ) {

          for (let i = 0; i < avatarData.boneRefPlayerAnimationData.length; i++) {
            const element = avatarData.boneRefPlayerAnimationData[i];
            if (element.animName == animName) {

              let path = (_this.$uploadUrl + avatarData.boneRefPlayer + "/" + element.path);
              // console.log("加载扩展动作 ",path);
              if (path.includes("json")) {
                this.LoadAssset(path, (data) => {
                  console.log(" 读取扩展动作 ", path, data);
                  if (callback) {
                    callback(element.isLoop, createAnimationClip(animName, data));
                  }
                });
              } else {
                //fbx动作直接加载模型，提前里面的动画
                if (_YJLoadAnimation == null) {
                  _YJLoadAnimation = new YJLoadAnimation();
                }
                _YJLoadAnimation.load(path, (anim) => {
                  if (callback) {
                    callback(element.isLoop, anim);
                    // callback(element.isLoop, createAnimationClipScale(animName,0.6, anim) );

                  }
                });
              }
            }
          }
        }
        //*/
        
      }
    }

    async function loadAssset(path, callback) {
      const res = await _this.$axios.get(path);
      if (callback) {
        callback(res.data);
      }
    }
    this.LoadAssset = function (path, callback) {
      loadAssset(path, callback);
    }


    this.GetAllAnim = function (playerName, callback) {

      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].name == playerName) {
          has = true;
          avatarData = avatarDataList[i];
        }
      }
      if (has) {
        for (let i = 0; i < avatarData.animationsData.length; i++) {
          const element = avatarData.animationsData[i];
          animList.push(element.animName);
        }

        //再查找其扩展动作
        if (avatarData.animationsExtendData) {
          for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
            const element = avatarData.animationsExtendData[i];
            animList.push(element.animName);
          }
        }

        //再查找其映射角色动作
        if (avatarData.boneRefPlayerAnimationData) {
          for (let i = 0; i < avatarData.boneRefPlayerAnimationData.length; i++) {
            const element = avatarData.boneRefPlayerAnimationData[i];
            animList.push(element.animName);
          }
        } 

        console.error(" 查找角色动作  ", playerName, animList);

        if (callback) {
          callback(animList);
        }
        //再查找其扩展动作
        // LoadExtendData(playerName, (animationsExtendData) => {
        //   if (animationsExtendData != undefined) {
        //     for (let i = 0; i < animationsExtendData.length; i++) {
        //       animList.push(animationsExtendData[i]);
        //     }
        //   }

        //   console.error(" 查找角色动作  ", playerName, animList);

        //   if (callback) {
        //     callback(animList);
        //   }
        // });


        // if (avatarData.animationsExtendData != undefined) {
        //   for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
        //     const element = avatarData.animationsExtendData[i];
        //     animList.push(element.animName);
        //   }
        // }
      }
    }
    this.GetAnimDataByAnimName = function (playerName,animName, callback) {

      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].name == playerName) {
          has = true;
          avatarData = avatarDataList[i];
        }
      }
      if (has) {
        for (let i = 0; i < avatarData.animationsData.length; i++) {
          const element = avatarData.animationsData[i];
          if(element.animName == animName){
            if(callback){
              callback(element);
            }
            return ;
          } 
        }

        //再查找其扩展动作
        if (avatarData.animationsExtendData) {
          for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
            const element = avatarData.animationsExtendData[i];
            if(element.animName == animName){
              if(callback){
                callback(element);
              }
              return ;
            } 
          }
        }

        // 再从映射动作中查找
        if (avatarData.boneRefPlayerAnimationData) {
          for (let i = 0; i < avatarData.boneRefPlayerAnimationData.length; i++) {
            const element = avatarData.boneRefPlayerAnimationData[i];
            if(element.animName == animName){
              if(callback){
                callback(element);
              }
              return ;
            } 
          }
        } 
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

    this.AddAvatarData = function (avatarData) {
      for (let i = 0; i < avatarDataList.length; i++) {
        const element = avatarDataList[i];
        if (element.name == avatarData.name) {
          return;
        }
      }
      (scope.AddAllExtendAnimData(avatarData.name, avatarData.animationsExtendData));

      avatarDataList.push(avatarData);
    }


    this.GetAllExtendAnim = function (playerName) {
      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].name == playerName) {
          has = true;
          avatarData = avatarDataList[i];
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
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].name == playerName) {
          has = true;
          avatarData = avatarDataList[i];
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
            avatarData.animationsExtendData.push({ animName: item.animName, isLoop: item.isLoop, path: item.path });
          }

        } else {
          avatarData.animationsExtendData = [];
          avatarData.animationsExtendData.push({ animName: item.animName, isLoop: item.isLoop, path: item.path });
        }
      }
      return this.GetAllExtendAnim(playerName);
    }
    this.AddAllExtendAnimData = function (playerName, playerData) {
      let has = false;

      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].name == playerName) {
          has = true;
          avatarData = avatarDataList[i];
        }
      }
      if (has) {
        if (avatarData.animationsExtendData == undefined) {
          avatarData.animationsExtendData = [];
        }
        for (let i = 0; i < playerData.length; i++) {
          const item = playerData[i];
          let hass = false;
          for (let j = 0; j < avatarData.animationsExtendData.length; j++) {
            const element = avatarData.animationsExtendData[j];
            if (element.animName == item.animName) {
              element.isLoop = item.isLoop;
              element.path = item.path;
              hass = true;
            }
          }
          if (!hass) {
            avatarData.animationsExtendData.push({ animName: item.animName, isLoop: item.isLoop, path: item.path });
          }
        }
      }
      return this.GetAllExtendAnim(playerName);
    }


    //#region 获取技能
    this.GetSkillList = function (playerName, callback) {
      GetSkillListFn(playerName, callback);
    }
    async function GetSkillListFn(playerName, callback) {
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