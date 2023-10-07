import * as THREE from "three";
import { setCharacterApi } from "../requestApi/messageApi";

// Threejs 中的事件传出接口

//所有 this.functionHandle 用来传出threejs中的操作，由threejs调用。界面开发人员无需关心

//所有 this.function 是已绑定界面逻辑的_Global.function。_Global.function = this.function 绑定后，界面即可调用threejs中的操作。由界面逻辑调用。 先用_Global绑定

//所有 _Global.function 是界面中创建并绑定的，由threejs调用
class Interface_UI {
  // _this 为三维主页面vue
  constructor(_this) {
    // let _Global = {};

    this.showLayer = (e, data) => {
      if (e == "npc") {
        if (data.id == "npc001") {
          console.log(111);
          _this.$refs.noticeRef.open()
        } else if (data.id == "npc002") {
          _this.$refs.MeetingQuestionPage.open();
          // _this.isShowMeetingInteract = true;
          console.log("接收到点击npc 111 ", data);
        }

        console.log("接收到点击npc 222 ", data);

      }
    };
    this.setCharacter = (data) => {
      let options = {
        char_ext: data.char_ext,
        nickname: data.nickname,
      };
      _Global.char_ext = options.char_ext
      setCharacterApi(options).then((res) => {
        console.log(res);
      });
    };
    // 合照
    this.SetTriggerOverlap = (data) => {
      // _this.isShowPhoto = data.state;
      _this.isInArea = data.state

      let id = data.id;
      let iid = 1;
      if (id == "photoPos002") {
        iid = 1;
      }
      if (id == "photoPos001") {
        iid = 2;
      } if (id == "photoPos003") {
        iid = 3;
      }
      let nname = _Global.char_ext;
      if (_Global.char_ext == "nanhai") { nname = "boy"; }
      if (_Global.char_ext == "nvhai") { nname = "girl"; }

      _this.photoName = 'takePhoto/' + nname + "_" + iid + '.jpg';


      // if (data.state) {

      // 001立牌 002大门 003远景
      // if (id == 'photoPos001') {
      //   _Global.isTakingPhoto = true

      // } else if (id == 'photoPos002') {

      // } else {

      // }
      // }
    }
    // 坐下
    this.SetInSitting = (flag) => {
      _this.isShowFullScreenBtn = flag
      _this.isShowFulldialog = flag
    }
    
    this.SetInFloorNum = (floor) => {
      _this.isShowCurrentFloor = floor
      _this.isShowMoveDialog = true
    }
    this.load3dComplete = () => {
      // 写我的
      if (_this.Video_Arr.length>0) {
        let url = _this.Video_Arr[0].videoUrl
        _Global.PlayVideoStream(url)
      }

    }
    // // 3D点击感应 事件注册
    _Global.SetTriggerOverlap = this.SetTriggerOverlap;
    _Global.showLayer = this.showLayer;
    _Global.setCharacter = this.setCharacter;
    _Global.SetInSitting = this.SetInSitting
    _Global.SetInFloorNum = this.SetInFloorNum
    _Global.load3dComplete = this.load3dComplete
  }
}

export { Interface_UI };
