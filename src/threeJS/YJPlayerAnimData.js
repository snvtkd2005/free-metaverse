
import { createAnimationClip, createAnimationClip_mmd2mixamo, createAnimationClip2, createAnimationClipScale } from "/@/utils/utils_threejs.js";
import { YJLoadAnimation } from "/@/threeJS/loader/YJLoadAnimation.js";

// 读取模型的动作数据
class YJPlayerAnimData {
  constructor(_this) {
    let scope = this;
    let PlayerAnimData = null;;
    let avatarDataList = [];

    let _YJLoadAnimation = null;
    function Init() {
      if (_this.GetPlayerAnimData) {
        PlayerAnimData = _this.GetPlayerAnimData();
      } else if (_this.$parent.GetPlayerAnimData) {
        PlayerAnimData = _this.$parent.GetPlayerAnimData();
      } else if (_this.$parent.$parent.GetPlayerAnimData) {
        PlayerAnimData = _this.$parent.$parent.GetPlayerAnimData();
      }
      if (!PlayerAnimData) {
        return;
      }
      avatarDataList = PlayerAnimData.avatarData;
      console.log(" in yj PlayerAnimData ", avatarDataList);

      let has = false;
      for (let i = 0; i < avatarDataList.length; i++) {
        const element = avatarDataList[i];
        if (element.name == PlayerAnimData.defaultUser.avatarName) {
          has = true;
        }
      }
      scope.GetAllAnim(has ? avatarDataList[0].name : PlayerAnimData.defaultUser.avatarName);
    }


    this.GetAllAvatar = function () {
      return avatarDataList;
    }

    this.GetAvatarData = function (playerName) {
      // console.error(" 查找角色信息  ", playerName, avatarDataList);
      for (let i = 0; i < avatarDataList.length; i++) {
        if (avatarDataList[i].name == playerName) {
          return FindBoneRefAnimationData(avatarDataList[i]);
        }
      }
      console.error(" 角色信息未找到 ", playerName);
    }
    this.GetAvatarDataById = function (id) {
      for (let i = 0; i < avatarDataList.length; i++) {
        if (avatarDataList[i].id == id) {
          return FindBoneRefAnimationData(avatarDataList[i]);
        }
      }
      console.error(" 角色信息未找到 ", id);
    }
    //查找动画数据时，把映射数据也加上
    function FindBoneRefAnimationData(avatarData) {
      if (avatarData.boneRefPlayer == undefined || avatarData.boneRefPlayer == '') {
        return avatarData;
      }
      for (let i = 0; i < avatarDataList.length; i++) {
        // console.log(avatarDataList[i],avatarData.boneRefPlayer);
        if (avatarDataList[i].id + '' == avatarData.boneRefPlayer) {
          // console.log(" 映射两个角色数据 ",avatarData,avatarDataList[i]);
          avatarData.boneOffsetY = avatarDataList[i].height - avatarData.height;
          avatarData.boneRefPlayerAnimationData = avatarDataList[i].animationsExtendData;
          return avatarData;
        }
      }
    }


    
    this.UpdateAvatarDataById = function (id, avatarData) {
      let has = false;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].id == id) {
          avatarDataList[i] = avatarData;
          has = true;
        }
      }
      if (!has) {
        avatarDataList.push(avatarData);
      }
      FindBoneRefAnimationData(avatarData);
    }

    this.PlayExtendAnim = function (avatarData, animName, callback) {
      // console.log(avatarData);
      
      if (avatarData.animationsExtendData != undefined) {
        for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
          const element = avatarData.animationsExtendData[i];
          if (element.animName == animName) {

            let path = (_this.$uploadUrl + avatarData.id + "/" + element.path);
            // console.log("加载扩展动作 ",path);
            if (path.includes("json")) {
              this.LoadAssset(path, (data) => {
                // console.log(" 读取扩展动作 ", path, data);
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
      if (avatarData.boneRefPlayer != undefined && avatarData.boneRefPlayer != ''
        && avatarData.boneRefPlayerAnimationData != undefined
        && avatarData.boneRefPlayerAnimationData.length > 0
      ) {

        for (let i = 0; i < avatarData.boneRefPlayerAnimationData.length; i++) {
          const element = avatarData.boneRefPlayerAnimationData[i];
          if (element.animName == animName) {

            let path = (_this.$uploadUrl + avatarData.boneRefPlayer + "/" + element.path);
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
                  if (Math.abs(avatarData.boneOffsetY) > 0.1) {
                    // 骨骼高度相差太多时，缩小映射动作的骨骼Y轴偏移
                    callback(element.isLoop, createAnimationClipScale(animName, avatarData.boneOffsetY, anim));
                  } else {
                    callback(element.isLoop, anim);
                  }
                }
              });
            }
            return;
          }
        }
      }
      
      if (callback) {
        callback("", null);
      }
    }
    // 获取扩展动作。动作从unity转的json文本中解析得到
    this.GetExtendAnim = function (id, animName, callback) {
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].id == id) {
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
                  // console.log(" 读取扩展动作 ", path, data);
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
        // 映射到其他角色动作: 情况太复杂，实验失败。 跟进:只有相同骨骼才能映射成功
        if (avatarData.boneRefPlayer != undefined && avatarData.boneRefPlayer != ''
          && avatarData.boneRefPlayerAnimationData != undefined
          && avatarData.boneRefPlayerAnimationData.length > 0
        ) {

          for (let i = 0; i < avatarData.boneRefPlayerAnimationData.length; i++) {
            const element = avatarData.boneRefPlayerAnimationData[i];
            if (element.animName == animName) {

              let path = (_this.$uploadUrl + avatarData.boneRefPlayer + "/" + element.path);
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
                    if (Math.abs(avatarData.boneOffsetY) > 0.1) {
                      // 骨骼高度相差太多时，缩小映射动作的骨骼Y轴偏移
                      callback(element.isLoop, createAnimationClipScale(animName, avatarData.boneOffsetY, anim));
                    } else {
                      callback(element.isLoop, anim);
                    }
                  }
                });
              }
              return;
            }
          }
        }

        if (callback) {
          callback("", null);
        }
        return;
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
    this.loadByAnimFile = function (path, animName, callback) {
      this.LoadAssset(path, (data) => {
        // console.log(" 读取扩展动作 ", path, data);
        if (callback) {
          callback(createAnimationClip_mmd2mixamo(animName, data));
        }
      });
    }



    this.GetAllAnim = function (id, callback) {

      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].id == id) {
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

        console.error(" 查找角色动作  ", id, animList);

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

    // 
    /**
     * 从avatarData中获取animName的单条数据， {是否循序、动作文件路径}
     * @param {*} avatarData 
     * @param {*} animName 
     * @param {*} callback 
     * @returns 
     */
    this.GetSingleAnimDataInAvatar = function(avatarData,animName,callback){
      for (let i = 0; i < avatarData.animationsData.length; i++) {
        const element = avatarData.animationsData[i];
        if (element.animName == animName) {
          if (callback) {
            callback(element);
          }
          return;
        }
      }

      //再查找其扩展动作
      if (avatarData.animationsExtendData) {
        for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
          const element = avatarData.animationsExtendData[i];
          if (element.animName == animName) {
            if (callback) {
              callback(element);
            }
            return;
          }
        }
      }

      // 再从映射动作中查找
      if (avatarData.boneRefPlayerAnimationData) {
        for (let i = 0; i < avatarData.boneRefPlayerAnimationData.length; i++) {
          const element = avatarData.boneRefPlayerAnimationData[i];
          if (element.animName == animName) {
            if (callback) {
              callback(element);
            }
            return;
          }
        }
      }

    }
    this.GetAnimDataByAnimName = function (id, animName, callback) {

      console.log(avatarDataList,id);
      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].id == id) {
          has = true;
          avatarData = avatarDataList[i];
        }
      }
      if (has) {
        this.GetSingleAnimDataInAvatar(avatarData,animName,callback); 
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

    // 进入页面前，先加载角色数据
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


    this.GetAllExtendAnim = function (id) {
      let animList = [];
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].id == id) {
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
    this.AddExtendAnimData = function (id, item) {
      let has = false;
      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].id == id) {
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
      return this.GetAllExtendAnim(id);
    }
    this.AddSingleExtendAnimData = function(avatarData,playerData){
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
      let animList = [];
      for (let i = 0; i < avatarData.animationsExtendData.length; i++) {
        const element = avatarData.animationsExtendData[i];
        animList.push(element.animName);
      }
      return animList;
    }
    this.AddAllExtendAnimData = function (id, playerData) {
      let has = false;

      let avatarData = null;
      for (let i = 0; i < avatarDataList.length && !has; i++) {
        if (avatarDataList[i].id == id) {
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
      return this.GetAllExtendAnim(id);
    }

    // 角色数据加载完成后，刷新其中的骨骼映射数据
    this.UpdateBoneRefData = function () {
      for (let i = 0; i < avatarDataList.length; i++) {
        avatarDataList[i] = FindBoneRefAnimationData(avatarDataList[i]);
      }
      // console.log("加载角色完成", avatarDataList);
    }


    //#region 获取技能
    this.GetSkillList = function (id, callback) {
      GetSkillListFn(id, callback);
    }
    async function GetSkillListFn(id, callback) {
      if (id == "小孩") {
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


    //#region 根据武器类型、角色状态得到动作名

    let animListData = [
      { state: "普通攻击", pickType: "twoHand", weaponType: "gun", animName: "two hand gun attack" },
      { state: "普通攻击", pickType: "twoHand", weaponType: "sword", animName: "two hand sword attack" },
      { state: "普通攻击", pickType: "mainHand", weaponType: "arch", animName: "one hand bow attack" },

      { state: "准备战斗", pickType: "twoHand", weaponType: "gun", animName: "two hand gun before attack" },
      { state: "准备战斗", pickType: "twoHand", weaponType: "sword", animName: "two hand sword before attack" },
      { state: "准备战斗", pickType: "mainHand", weaponType: "arch", animName: "one hand bow before attack", animName2: "one hand bow draw attack" },

      { state: "受伤", pickType: "twoHand", weaponType: "gun", animName: "" },
      { state: "受伤", pickType: "twoHand", weaponType: "sword", animName: "two hand sword hurt" },
      { state: "受伤", pickType: "mainHand", weaponType: "arch", animName: "two hand bow hurt" },


      { state: "移动", pickType: "twoHand", weaponType: "gun", animName: "two hand gun run" },
      { state: "移动", pickType: "twoHand", weaponType: "sword", animName: "two hand sword run" },
      { state: "移动", pickType: "oneHand", weaponType: "arch", animName: "one hand bow run" },
      { state: "移动", pickType: "mainHand", weaponType: "arch", animName: "one hand bow run" },


      { state: "停止移动", pickType: "twoHand", weaponType: "gun", animName: "two hand gun idle" },
      { state: "停止移动", pickType: "twoHand", weaponType: "sword", animName: "two hand sword idle" },
      { state: "停止移动", pickType: "oneHand", weaponType: "arch", animName: "one hand bow idle" },
      { state: "停止移动", pickType: "mainHand", weaponType: "arch", animName: "one hand bow idle" },

      { state: "行走", pickType: "twoHand", weaponType: "gun", animName: "two hand gun walk" },
      { state: "行走", pickType: "twoHand", weaponType: "sword", animName: "two hand sword walk" },
      { state: "行走", pickType: "oneHand", weaponType: "arch", animName: "one hand bow walk" },
      { state: "行走", pickType: "mainHand", weaponType: "arch", animName: "one hand bow walk" },

    ]


    function GetAnimName(state, weaponData) {
      let { pickType, weaponType } = weaponData;
      for (let i = 0; i < animListData.length; i++) {
        const element = animListData[i];
        if (element.state == state && element.pickType == pickType && element.weaponType == weaponType) {
          return element.animName;
        }
      }
      return "";
    }
    this.GetAnimNameByPlayStateAndWeapon = function (e, weaponData) {
      let animName = "";
      let animNameFullback = ""; //没有动作时的回滚动作
      switch (e) {
        case "普通攻击":
          animName = "fight attack"; //空手状态 攻击状态 拳击动作 
          if (weaponData) {
            // let _animName = GetAnimName(e, weaponData);
            let _animName = weaponData.animNameAttack;
            if (_animName != undefined && _animName != "") {
              animName = _animName;
            }
          } else {
          }

          break;
        case "法术攻击":
          animName = "fight hurt"; //空手状态 攻击状态 拳击动作 
          break;
        case "准备战斗":
          animName = "fight idle"; //空手状态 战斗准备状态
          animNameFullback = "idle";
          if (weaponData) {
            // let _animName = GetAnimName(e, weaponData);
            let _animName = weaponData.animNameReady;
            if (_animName != undefined && _animName != "") {
              animName = _animName;
            }
          } else {
          }
          break;
        case "受伤":
          animName = "fight hurt"; //空手状态 受伤 
          if (weaponData) {

            let _animName = GetAnimName(e, weaponData);
            if (_animName != "") {
              animName = _animName;
            }
          } else {

          }
          break;
        case "death":
          animName = "death";
          break;
        case "sitting":
          animName = "sitting";
          break;
        case "normal":
          animName = "idle";
          break;
        case "跳跃":
          animName = "jump";
          break;
        case "移动":
          animName = "run";
          animNameFullback = "run";

          if (weaponData) {
            // let _animName = GetAnimName(e, weaponData);
            let _animName = weaponData.animNameRun;
            if (_animName != undefined && _animName != "") {
              animName = _animName;
            }
          }
          break;
        case "停止移动":
          animName = "idle";
          animNameFullback = "idle";
          if (weaponData) {
            // let _animName = GetAnimName(e, weaponData);
            let _animName = weaponData.animNameIdle;
            if (_animName != undefined && _animName != "") {
              animName = _animName;
            }
          }
          break;
        case "战斗结束":
          animName = "idle";
          animNameFullback = "idle";
          if (weaponData) {
            // let _animName = GetAnimName(e, weaponData);
            let _animName = weaponData.animNameIdle;
            if (_animName != undefined && _animName != "") {
              animName = _animName;
            }
          }
          break;

        case "行走":
          animName = "walk";
          animNameFullback = "walk";
          if (weaponData) {
            // let _animName = GetAnimName(e, weaponData);
            let _animName = weaponData.animNameWalk;
            if (_animName != undefined && _animName != "") {
              animName = _animName;
            }
          }
          break;
        case "attack":
          // if (type == undefined) {
          //   animName = "attack";
          // } else if (type == "胡萝卜") {
          //   animName = "throw";
          // } else if (type == "南瓜") {
          //   animName = "throw2";
          // } 
          break;
        case "interactive":
          // if (type == "地上拾取") {
          //   animName = "collection"; 
          // }
          break;
        default:
          break;
      }
      if (animNameFullback == "") {
        animNameFullback = animName;
      }
      return { animName, animNameFullback };
    }



    let skillListData = [
      { pickType: "twoHand", weaponType: "gun", dis: 30, speed: 1 },
      { pickType: "twoHand", weaponType: "sword", dis: 3, speed: 2.5 },
      { pickType: "mainHand", weaponType: "arch", dis: 20, speed: 1.5 },
    ];
    function GetSkill(weaponData) {
      if (weaponData) {
        let { attackSpeed, vaildDis } = weaponData;
        if (attackSpeed != undefined) {
          return {
            dis: vaildDis, speed: attackSpeed,
            ready: weaponData.ready,
            fire: weaponData.fire,
          };
        }
      }
      return {
        dis: 2, speed: 2,
        ready: {},
        fire: {}
      };
    }
    // 根据武器获取攻击速度、攻击距离、攻击技能。 后期改为根据技能获取
    this.GetSkillDataByWeapon = function (weaponData) {
      let vaildAttackDis = 0;
      let attackStepSpeed = 0;
      let skillName = "";
      let { dis, speed, ready, fire } = GetSkill(weaponData);
      vaildAttackDis = dis;
      attackStepSpeed = speed;
      if (weaponData) {
        skillName = "" + weaponData.weaponType + "";
      } else {
        skillName = "拳头";
      }
      return {
        s: skillName, v: vaildAttackDis, a: attackStepSpeed,
        _ready: ready,
        _fire: fire
      };
    }
    //#endregion


    Init();
  }
}


export { YJPlayerAnimData };