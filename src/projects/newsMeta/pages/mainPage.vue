<template>
  <div id="container">
    <audio
      :src="publicUrl + audioSrc"
      id="audio"
      class="absolute right-0 top-0"
    >
      播放
    </audio>
    <!-- pc  -->
    <div class="tool_menu">
      <!-- mobile  -->
      <div
        class="item"
        v-for="(item, index) in icon_menu"
        :key="item.id + 'info-'"
        v-show="!isShowMeetingIconList"
      >
        <img :src="publicUrl + item.path" alt="" @click="showDialog(index)" />
        <!-- <div>{{ item.text }}</div> -->
      </div>
      <!-- 节目列表 -->
      <div
        class="item w-12 h-12 mr-3"
        v-for="(item, index) in meeting_menu"
        :key="item.id + 1"
        v-show="isShowMeetingIconList"
      >
        <img
          :src="publicUrl + item.path"
          alt=""
          @click="showMeetingDialog(index)"
        />

        <div>{{ item.text }}</div>
      </div>
    </div>
    <div class="bottom_menu">
      <div class="change_scene_btn" @click="sceneOpen()">
        <img :src="publicUrl + 'icon/changeScene.png'" alt="" />
      </div>
      <div class="msgBoard" @click="messageBoardOpen()">
        <img :src="publicUrl + 'icon/msgBoard.png'" alt="" />
      </div>
    </div>
    <!-- 传送弹窗 -->
    <div class="transmit_dialog" v-show="isShowMoveDialog">
      <div @click="closeMoveDialog" class="transmit_close">
          <img
            :src="publicUrl + 'images/close.png'"
            alt=""
            style="width: 100%; height: 100%"
          />
      </div>
      <div class="title_name">楼层选择</div>
      <div class="pointer">
        <div
          class="pointer_item"
          @click="selectFloor('floor1')"
          v-show="isShowCurrentFloor != 'floor1'"
        >
          <img :src="publicUrl+'icon/second_floor.png'" alt="">
        </div>
        <div
          class="pointer_item"
          @click="selectFloor('floor2')"
          v-show="isShowCurrentFloor != 'floor2'"
        >
           <img :src="publicUrl+'icon/second_floor.png'" alt="">
        </div>
        <div
          class="pointer_item"
          @click="selectFloor('floor3')"
          v-show="isShowCurrentFloor != 'floor3'"
        >
           <img :src="publicUrl+'icon/third_floor.png'" alt="">
        </div>
      </div>
    </div>
    <!-- 全屏提示弹窗 -->
    <div class="fullscreenTipsDialog" v-show="isShowFulldialog">
      <div class="full_dialog">
        <div class="content">是否全屏观看视频</div>
        <div class="bottom_part">
          <div
            class="no_btn"
            @click="
              () => {
                isShowFulldialog = false;
              }
            "
          >
            否
          </div>
          <div class="yes_btn" @click="toFullScreen">是</div>
        </div>
      </div>
    </div>
    <!-- 全屏按钮 -->
    <div class="sit_btn" v-show="isShowFullScreenBtn" @click="toFullScreen">
      显示全屏
    </div>
    <!-- 合影区域 -->
    <div class="bg" v-show="isShowPhoto">
      <div class="pop">
        <div class="dialogClose" @click="closePhoto">
          <img
            :src="publicUrl + 'images/close.png'"
            alt=""
            style="width: 100%; height: 100%"
          />
        </div>
        <div class="img_box">
          <div class="logo">
            <img :src="publicUrl + 'images/photo/logo.png'" alt="" />
          </div>
          <img :src="publicUrl + photoName" class="intaking_photo" alt="" />
          <div class="code_area">
            <img :src="publicUrl + 'images/photo/qrcode.png'" alt="" />
          </div>
        </div>
        <div class="save_btn">保存到本地</div>
      </div>
    </div>
    <!-- 节目单 -->
           
    <!--  @click="changeVideo(item.videoUrl)" -->
    <drawer-dialog ref="showListRef">
      <div class="scene-content">
        <div class="scene-title">节目单</div>
        <div class="scene-box">
          <div
            v-for="item in Video_Arr"
            :key="item"
            class="scene-item"
          @click="changeVideo(item.videoUrl)"
          >
            <div class="img">
              <img :src="item.cover" alt="" />
            </div>
            <div class="name">{{ item.videoName }}</div>
          </div>
        </div>
      </div>
    </drawer-dialog>

    <!-- 场景选择 -->
    <drawer-dialog ref="drawerRef">
      <div class="scene-content">
        <div class="scene-title">场景选择</div>
        <div class="scene-box">
          <div class="scene-item" @click="toScene(1)">
            <div class="img">
              <img :src="Scene1.imgUrl" alt="" />
            </div>
            <div class="name">{{ Scene1.roomName }}</div>
          </div>
          <div class="scene-item" @click="toScene(2)">
            <div class="img">
              <img :src="Scene2.imgUrl" alt="" />
            </div>
            <div class="name">{{ Scene2.roomName }}</div>
          </div>
          <div class="scene-item" @click="toScene(3)">
            <div class="img">
              <img :src="Scene3.imgUrl" alt="" />
            </div>
            <div class="name">{{ Scene3.roomName }}</div>
          </div>
        </div>
      </div>
    </drawer-dialog>
    <!-- 留言板 -->
    <drawer-dialog ref="messageRef">
      <div class="message-content">
        <div class="message-title">
          <img src="/images/message/message-txt.png" alt="留言板" />
        </div>
        <div class="message-box" id="box">
          <div class="message-wrapper" id="wrapper">
            <!-- v-for="item in moveArr" :key="item.iid" -->
            <div class="message-item" v-for="item in moveArr" :key="item.iid">
              <img
                :src="item.user_info ? item.user_info : avatarPath"
                class="user-img"
              />
              <div class="message-right">
                <div class="name">
                  {{
                    item.username ? item.username : "嘉宾0" + random(100, 999)
                  }}
                </div>
                <!-- <div class="name" v-show="isWriteMsg">{{$route.query.}}</div> -->
                <div class="text">{{ item.contents }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="fixed-bottom">
          <div class="top-box">
            <img :src="avatarPath" class="photos" />
            <input
              id="msg"
              placeholder="说点儿什么吧..."
              class="input-box"
              @focus="removeThreeJSfocus"
              @blur="addThreeJSfocus"
            />
          </div>
          <div class="publish" @click="writeMessageMed">发布</div>
        </div>
      </div>
    </drawer-dialog>
    <!-- 外景问答互动 -->
    <notice-dialog ref="noticeRef" v-show="isShowInteract"></notice-dialog>
  </div>
  <!-- 会议问答互动 -->
  <meetingDialog class="" ref="MeetingQuestionPage" />

  <!--  -->
</template>

<script>
// let _Global;
import * as THREE from "three";
import { Interface_UI } from "../js/Interface_UI";
import { Interface } from "../js/Interface";
import {
  getMessage,
  writeMessage,
  getPreMsgList,
  getConfigList,
  addConfigList,
} from "../requestApi/messageApi";
// import MeetingQuestionPage from "./MeetingQuestionPage.vue";
import NoticeDialog from "../components/notice-dialog/notice-dialog.vue";
import meetingDialog from "../components/notice-dialog/meetingDialog.vue";
import DrawerDialog from "../components/drawer-dialog/drawer-dialog.vue";
export default {
  components: {
    meetingDialog,
    NoticeDialog,
    DrawerDialog,
  },
  data() {
    return {
      clock: new THREE.Clock(),
      isDone: false,
      progress: 0,
      mixer: null,
      icon_menu: [
        {
          id: 0,
          path: "icon/takePhoto.png",
          text: "合照",
        },
        {
          id: 1,
          path: "icon/sound.png",
          text: "声音",
        },
        {
          id: 2,
          path: "icon/my.png",
          text: "我的",
        },
      ],
      meeting_menu: [
        {
          id: 0,
          path: "icon/showList.png",
          text: "节目单",
        },
        {
          id: 1,
          path: "icon/sound.png",
          text: "声音",
        },
        {
          id: 2,
          path: "icon/my.png",
          text: "我的",
        },
      ],
      audioSrc: "",
      mainQuestionList: [
        {
          id: 1,
          topic: "问题一",
          title: "“两会”是什么？",
          content: "问题一内容",
          audioSrc: "audio/outside_1.mp3",
        },
        {
          id: 2,
          topic: "问题二",
          title: "人民日报健康客户端是什么？",
          content: "问题二内容",
          audioSrc: "audio/outside_2.mp3",
        },
        {
          id: 3,
          topic: "问题三",
          title: "您知道 “两会健康策”栏目吗？",
          content: "问题三内容",
          audioSrc: "audio/outside_3.mp3",
        },
        {
          id: 4,
          topic: "问题四",
          title: "如何观看“两会健康策”栏目",
          content: "问题四内容",
          audioSrc: "audio/outside_4.mp3",
        },
      ],
      exerciseObj: {
        currentId: 0,
        currentTitle: "",
        currentContent: "",
      },
      Scene1: {
        imgUrl: "",
        roomName: "",
        PlayList: [],
      },
      Scene2: {
        imgUrl: "",
        roomName: "",
        PlayList: [],
      },
      Scene3: {
        imgUrl: "",
        roomName: "",
        PlayList: [],
      },
      programList: {},
      Video_Arr: [],
      videoUrl: [],
      msgInput: "",
      isShowScene: false,
      isShowMsg: false,
      isShowPhoto: false,
      isShowInteract: true,
      isShowQuestion: false,
      isShownextBtn: true,
      isShowMeetingInteract: false,
      isShowMeetingIconList: false,
      isShowPlay: false,
      isShowFullScreenBtn: false,
      msgArr: [],
      audioDom: null,
      isInArea: false,
      photoName: "",
      testUrl: "",
      moveArr: [],
      prepareArr: [],
      isShowCurrentFloor: "",
      isShowMoveDialog: false,
      isShowFulldialog: false,
      flag: true,
      userInfo: {},
      isWriteMsg: false,
      avatarPath: "",
      loginInfo: localStorage.getItem("loginInfo"),
      message_username: "",
      insertMsgObj: {},
      touchTimes:0
    };
  },
  created() {
    // 记得开启
    this.publicUrl = this.$parent.GetPublicUrl();
    // new Interface(this)
    new Interface_UI(this);
    window.addEventListener("touchstart", () => {
      if (this.Video_Arr.length > 0) {
        if (this.touchTimes < 1) {
          this.touchTimes++;
          this.changeVideo(this.Video_Arr[0].videoUrl);
        }
      }
    });
  },
  mounted() {
    this.container = document.querySelector("#container");
    this.audioDom = document.querySelector("#audio");
    this.getPreMsgListMed();
    this.getConfigListMed();
    this.avatarEnsure();
    this.dynamicGetMsg();
  },

  methods: {
    avatarEnsure() {
      const avatarName = localStorage.getItem("avatarName");
      switch (avatarName) {
        case "nanyisheng":
          this.avatarPath = this.publicUrl + "images/avatar/nanyisheng.jpg";
          break;
        case "nanhai":
          this.avatarPath = this.publicUrl + "images/avatar/nanhai.jpg";
          break;
        case "laotaitai":
          this.avatarPath = this.publicUrl + "images/avatar/laotaitai.jpg";
          break;
        case "man":
          this.avatarPath = this.publicUrl + "images/avatar/man.jpg";
          break;
        case "nanren":
          this.avatarPath = this.publicUrl + "images/avatar/nanren.jpg";
          break;
        case "nvhai":
          this.avatarPath = this.publicUrl + "images/avatar/nvhai.jpg";
          break;
        case "nvren":
          this.avatarPath = this.publicUrl + "images/avatar/nvren.jpg";
          break;
        case "nvyisheng":
          this.avatarPath = this.publicUrl + "images/avatar/nvyisheng.jpg";
          break;
      }
    },
    random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    numToString(num) {
      let n = parseInt(num);
      if (n < 10) {
        return "000" + n;
      }
      if (n < 100) {
        return "00" + n;
      }
      if (n < 1000) {
        return "0" + n;
      }
      return "" + n;
    },
    messageBoardOpen() {
      // this.dynamicGetMsg()
      this.$refs.messageRef.open();
    },
    sceneOpen() {
      this.$refs.drawerRef.open();
    },
    selectFloor(val) {
      // 给3d传值
      _Global.SetGoFloorNum(val);
      this.isShowMoveDialog = false;
    },
    closeMoveDialog() {
      this.isShowMoveDialog = false;
    },
    toFullScreen() {
      this.isShowFulldialog = false;
      _Global.SetVideoFullScreen();
    },
    //在点击threeJS界面时，还原threejs的键盘监听。
    removeThreeJSfocus() {
      _Global.ActiveThree3D(false);
    },
    addThreeJSfocus() {
      _Global.ActiveThree3D(true);
    },
    closeAudio() {
      if (!this.audioDom.paused) {
        this.audioDom.pause();
      }
    },
    playAudio() {
      if (!this.audioDom.paused) {
        this.audioDom.pause();
      } else {
        this.audioDom.play();
      }
    },
    dynamicGetMsg() {
      let i = 10;
      setInterval(() => {
        i += 1;
        if( !this.prepareArr){return;}

        if (i < this.prepareArr.length) {
          this.moveArr.push(this.prepareArr[i]);

        } else {
          i = 0;
          this.moveArr.push(this.prepareArr[i]);

        }
        setTimeout(()=>{
          let box = document.getElementById('box')
            box.scrollTop += 100
        },Math.floor(Math.random() * 5) + 1) * 1000;
        // 更新留言板数组
      }, (Math.floor(Math.random() * 5) + 1) * 1000);

    },
    getPreMsgListMed() {
      let options = {};
      getPreMsgList(options).then((res) => {
        console.log("getPreMsgList", res);
        this.prepareArr = res.data.data;
        this.userInfo = res.data;
        if( !this.prepareArr){return;}
        this.moveArr = this.prepareArr.slice(0, 10);
      });
    },
    getConfigListMed() {
      getConfigList().then((res) => {
        const data = res.data.data;
        const room_01 = JSON.parse(data.room_01);
        const room_02 = JSON.parse(data.room_02);
        const room_03 = JSON.parse(data.room_03);
        this.Scene1 = { ...room_01 };
        this.Scene2 = { ...room_02 };
        this.Scene3 = { ...room_03 };
      });
    },
    writeMessageMed() {
      let msgInput = document.getElementById("msg").value;
      let wrapper = document.getElementById("wrapper")
      let box = document.getElementById('box')
      const userId = JSON.parse(localStorage.getItem("loginInfo")).user_iid;
      let options = {
        _x_user_id_: userId,
        contents: msgInput,
      };
      writeMessage(options).then((res) => {
        console.log(res);
        if (res.data.success) {
          let insertMsgObj = {
            ...res.data.data,
            username: this.$route.query.userName,
          };
          box.scrollTop =wrapper.scrollHeight+1000
          this.moveArr.push(insertMsgObj);
          document.getElementById("msg").value = "";
        }
      });
    },
    toScene(index) {
      if (index == 1) {
        _Global.ChangeScene("scene1");
        this.isShowMeetingIconList = false;
        this.$refs.drawerRef.close();
      } else if (index == 2) {
        this.Video_Arr = this.Scene2.PlayList;
        // this.programList = this.Scene2.PlayList
        console.log("Video_Arr", this.Video_Arr);
        _Global.ChangeScene("scene2");
        this.isShowMeetingIconList = true;
        this.$refs.drawerRef.close();
      } else {
        // 场景3
        this.Video_Arr = this.Scene3.PlayList;
        _Global.ChangeScene("scene2");
        this.isShowMeetingIconList = true;
        this.$refs.drawerRef.close();
      }
      this.isShowScene = false;
      this.isShowFullScreenBtn = false;
    },
    bodyCloseMenus(e) {
      if (this.isShowInteract == true) {
        this.isShowInteract = false;
      }
    },
    closeInteractDialog() {
      this.isShowInteract = false;
      this.isShowQuestion = false;
      this.isShownextBtn = true;
      this.closeAudio();
    },
    nextMed(id) {
      console.log(id);
      id += 1;
      this.exerciseObj.currentId = id;
      this.playAudio();
      if (id < 4) {
        this.showQuestion(id);
      } else {
        this.showQuestion(id);
        this.isShownextBtn = false;
      }
    },
    showQuestion(id) {
      this.mainQuestionList.forEach((item) => {
        if (item.id == id) {
          if (id == 4) {
            this.isShownextBtn = false;
          }
          this.exerciseObj.currentId = id;
          this.exerciseObj.currentTitle = item.title;
          this.exerciseObj.currentContent = item.content;
          this.audioDom.src = this.publicUrl + item.audioSrc;

          if (this.audioDom.paused) {
            this.audioDom.play();
          }
        }
      });
      this.isShowQuestion = true;
    },
    showMsgMed(isfadeIn) {
      this.isShowMsg = false;
    },
    closePhoto() {
      this.isShowPhoto = false;
    },
    closePlay() {
      this.isShowPlay = false;
    },
    showDialog(index) {
      if (index == 0) {
        // if(this.isInArea){
        this.isShowPhoto = true;
        // }
        this.isShowScene = false;
      } else if (index == 1) {
        this.isShowScene = !this.isShowScene;

        // this.isShowInteract = !this.isShowInteract;
      } else if (index == 2) {
        this.$router.replace("/playerSelect");
        // this.isShowMsg = true;
        // this.showMsgMed(true);
        this.isShowScene = false;
      } else {
        this.isShowScene = false;
      }
    },
    showMeetingDialog(index) {
      if (index == 0) {
        // this.isShowPhoto = true;
        // this.isShowPlay = true;
        this.$refs.showListRef.open();
        console.log("节目单");
        this.isShowScene = false;
      } else if (index == 1) {
        this.isShowScene = !this.isShowScene;
        if (this.flag) {
          _Global.SetVideoMuted(true);
          this.flag = false;
        } else {
          _Global.SetVideoMuted(false);
          this.flag = true;
        }
        // this.isShowInteract = !this.isShowInteract;
      } else if (index == 2) {
        this.$router.replace("/playerSelect");
        this.isShowMsg = true;
        // this.showMsgMed(true);
        this.isShowScene = false;
      } else {
        this.isShowScene = false;
      }
    },
    changeVideo(url) {
      _Global.PlayVideoStream(url);
      setTimeout(() => {
        _Global.PlayVideoStream(url);
      }, 100);
    },
  },
};
</script>

<style scoped>
#container {
  /* background-color: #00000054; */
  /* font-size: 35px; */
}
/* .tool_menu {
  position: absolute !important;
    top: 50px !important;
    left: 50px !important;
    display: flex;
} */
/* 切换场景 */
.scene-content {
  width: 100%;
  height: 100%;
}
.scene-content .scene-title {
  height: 60px;
  width: 100%;
  background: url("/images/chat_dialog/bak.png") no-repeat center center;
  background-size: cover cover;
  display: flex;
  align-items: center;
  padding-left: 60px;
  color: #f2cb91;
  font-size: 24px;
  font-weight: bold;
}
.scene-content .scene-box {
  width: 84%;
  height: calc(100%);
  margin: 0px 8%;
  overflow-y: auto;
  background: rgb(250, 250, 250);
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
}
.scene-box .scene-item {
  width: 47%;
  float: left;
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
}
.scene-item .img {
  width: 100%;
  border-radius: 4px;
}
.scene-item .img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.scene-item .name {
  margin-top: 10px;
  font-size: 1rem;
}

.fullscreenTipsDialog {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
}
.fullscreenTipsDialog .full_dialog {
  width: 13rem;
  height: 6rem;
  border-radius: 8px;
  background: #ffffff;
  font-size: 1rem;
}
.full_dialog .content {
  margin: 20px 0 0 44px;
}
.full_dialog .bottom_part {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1rem;
}
.full_dialog .bottom_part .no_btn {
  border: 1px solid #f2cb91;
  color: #cb1f26;
  width: 69px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  border-radius: 5px;
  cursor: pointer;
}
.full_dialog .bottom_part .yes_btn {
  border: 1px solid #f2cb91;
  color: #cb1f26;
  width: 69px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  background: #f2cb91;
  border-radius: 5px;
  cursor: pointer;
}
/* 留言板 */
.message-content {
  width: 100%;
  height: 100%;
  background: rgb(250, 250, 250);
}
.message-content .message-title,
.scene-content .scene-title {
  height: 60px;
  width: 100%;
  background-image: url(/images/message/message-bg.png);
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  padding-left: 2.5rem;
}
.message-content .message-box {
  width: 84%;
  height: calc(100% - 220px);
  margin: 0px 8%;
  overflow-y: auto;
  background: rgb(250, 250, 250);
  position: relative;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.message-content .message-wrapper {
  /* position: absolute;
  bottom: 0; */
}
.message-box .message-item {
  display: flex;
  align-items: center;
  margin-bottom: 21px;
  margin-top: 21px;
  align-items: flex-start;
}
.message-item .user-img {
  width: 52px;
  height: 52px;
  border-radius: 100%;
  margin-right: 14px;
}
.message-item .message-right {
  flex: 1;
}
.message-right .name {
  color: #666666;
  font-size: 14px;
  margin-bottom: 5px;
  margin-top: 4px;
}
.message-right .text {
  font-size: 16px;
  color: #333;
}
.message-content .fixed-bottom {
  height: 120px;
  background: #fff;
  padding: 20px 30px 20px 50px;
}
.fixed-bottom .photos {
  width: 52px;
  height: 52px;
  border-radius: 100%;
  margin-right: 8px;
}
.fixed-bottom .input-box {
  height: 52px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  flex: 1;
  padding: 10px;
  outline: none;
}
.fixed-bottom .top-box {
  display: flex;
  align-items: center;
}
.fixed-bottom .publish {
  background: #f2cb91;
  width: 70px;
  height: 28px;
  border-radius: 4px;
  color: #cb1f26;
  text-align: center;
  line-height: 28px;
  float: right;
  margin-top: 12px;
  cursor: pointer;
}
@media screen and (max-width: 1024px) {
  .transmit_dialog {
    width: 170px;
    height: 120px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    right: 1rem;
    top: 5.8rem;
    color: white;
  }
  .transmit_dialog .title_name{
    text-align: center;
    font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 18px;
    font-weight: bold;
    padding-top: 16px;
  }
  .transmit_dialog .transmit_close {
    width: 24px /* 44px */;
    height: 24px /* 44px */;
    font-size: 2rem /* 20px */;
    margin: auto;
    position: absolute;
    top: -18px;
    right: -8px;
    text-align: center;
  }
  .transmit_dialog  .pointer {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    padding: 20px 0 30px 0;
  }
  .pointer .pointer_item {
    /* margin: 0.75rem; */
    width: 44px;
    height: 44px;
    cursor: pointer;
    padding-right: 10px;
  }
  .tool_menu {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    width: 12rem;
  }

  .tool_menu .item {
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    color: white;
    font-size: 13px;
    text-align: center;
  }
  .item img {
    width: 100%;
    height: 100%;
  }
  .tool_menu .item:hover {
    border-radius: 50%;
    background-color: rgba(86, 166, 241, 0.559);
  }
  .bottom_menu {
    height: 10rem;
    width: 5rem;
    position: absolute;
    right: 1rem;
    bottom: 0;
  }
  .bottom_menu .change_scene_btn {
    width: 60px;
    height: 60px;
  }
  .bottom_menu .change_scene_btn img {
    width: 100%;
    height: 100%;
  }

  .bottom_menu .msgBoard {
    width: 60px;
    height: 60px;
    margin-top: 1rem;
  }
  .bottom_menu .msgBoard img {
    width: 100%;
    height: 100%;
  }
  .sit_btn {
    position: absolute;
    width: 4rem;
    height: 2rem /* 32px */;
    font-size: 0.875rem /* 14px */;
    line-height: 2rem /* 20px */;
    color: white;
    text-align: center;
    border: 2px solid white;
    --tw-bg-opacity: 1;
    background-color: rgba(248, 113, 113, var(--tw-bg-opacity));
    right: 8rem /* 40px */;
    bottom: 2.5rem /* 40px */;
  }
  .bg {
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
  }
  .bg .pop {
    width: 880px;
    height: 548px;
    border-radius: 8px;
    background: #ffffff;
    padding: 36px 40px 24px 40px;
    /* width: 24rem;
    height: 24rem; */
    position: relative;
    transform: scale(0.5);
  }
  .bg .pop .dialogClose {
    width: 3rem /* 64px */;
    height: 3rem;
    position: absolute;
    top: -1rem;
    right: -1rem;
    cursor: pointer;
    border-radius: 50%;
  }
  .bg .pop .img_box {
    width: 800px;
    height: 400px;
    margin: 0 auto;
    position: relative;
  }
  .bg .pop .img_box .logo {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 20px;
    top: 3rem;
  }
  .bg .pop .img_box .logo img {
    width: 100%;
    height: 100%;
  }
  .bg .pop .img_box .intaking_photo {
    width: 100%;
    height: 100%;
    /* object-fit: contain; */
    margin-top: 2rem;
  }
  .img_box .code_area {
    width: 60px;
    height: 60px;
    position: absolute;
    right: 2rem;
    bottom: 1rem;
  }
  .img_box .code_area img {
    width: 100%;
    height: 100%;
  }
  .pop .save_btn {
    width: 385px;
    height: 44px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 10px;
    background: #f2cb91;
    color: #cb1f26;
    margin: 4rem auto;
    cursor: pointer;
  }
  .scene_menu {
    background-color: rgba(86, 165, 241, 0.7);
    border-radius: 10px;
  }
  .scene {
    width: 90%;
    background-color: rgba(96, 177, 255, 1);
    box-shadow: 0.5px 1px 5px #fff;
    padding: 5px 0;
    color: #fff;
    border: 0px solid #aaa;
    border-radius: 15px;
    margin: 15px;
  }
  /* .leaveMsg {
    position: absolute;
    right: 0;
    top: 0;
    width: 35%;
    height: 100vh;
    background-color: white;
  } */

  .leaveMsg .close {
    border-radius: 50%;
    line-height: 44px;
  }
  .leaveMsg .bottom_box {
    /* position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center; */
  }
  .interact {
    /* width: 100%;
    height: 35%;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0; */
  }
  .interact .close_btn {
    /* position: absolute;
    right: 15px;
    top: 0;
    font-size: 25px;
    cursor: pointer; */
  }
  .interact .content_item {
    /* display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 0 0 20px; */
  }
  .content_item .ava_logo {
    width: 20%;
  }
  .content_item .question_content {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .question_content .title_name {
    font-size: 15px;
  }
  .content_item .question_content_show {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .question_content .question_part {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 10px;
  }
  .question_part .tips {
    padding-right: 20px;
  }
  .question_part .question_item {
    display: flex;
    align-items: center;
    width: 250px;
    flex-wrap: wrap;
  }
  .question_item .que {
    font-size: 20px;
    width: 100px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid black;
    margin-right: 15px;
    margin-top: 5px;
  }
  .question_show {
    display: flex;
    align-items: center;
    padding-top: 30px;
  }
  .question_show .tips {
    margin-right: 30px;
  }
  .question_show .question_text {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .question_text {
  }
  .next_btn {
    font-size: 20px;
    width: 100px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid black;
    margin-right: 15px;
    position: absolute;
    right: 20px;
  }
}
@media screen and (min-width: 1025px) {
  .transmit_dialog {
    width: 200px;
    height: 150px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    right: 1rem;
    top: 8rem;
    color: white;
  }
  .transmit_dialog .title_name{
    text-align: center;
    font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 24px;
    font-weight: bold;
    padding-top: 16px;
  }
  .transmit_dialog .transmit_close {
    width: 24px /* 44px */;
    height: 24px /* 44px */;
    font-size: 2rem /* 20px */;
    margin: auto;
    position: absolute;
    top: -18px;
    right: -8px;
    text-align: center;
  }
  .transmit_dialog  .pointer {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    padding: 20px 0 20px 0;
  }
  .pointer .pointer_item {
    /* margin: 0.75rem; */
    width: 60px;
    height: 60px;
    cursor: pointer;
  }
  .tool_menu {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 20rem;
  }
  .tool_menu .item {
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;
    color: white;
    font-size: 13px;
    text-align: center;
  }
  .item img {
    width: 100%;
    height: 100%;
  }
  .tool_menu .item:hover {
    border-radius: 50%;
    background-color: rgba(86, 166, 241, 0.559);
  }
  .bottom_menu {
    height: 10rem;
    width: 5rem;
    position: absolute;
    right: 3rem;
    bottom: 5rem;
  }
  .bottom_menu .change_scene_btn {
    width: 75px;
    height: 75px;
  }
  .bottom_menu .change_scene_btn img {
    width: 100%;
    height: 100%;
  }

  .bottom_menu .msgBoard {
    width: 75px;
    height: 75px;
    margin-top: 2rem;
  }
  .bottom_menu .msgBoard img {
    width: 100%;
    height: 100%;
  }
  .photo {
    position: absolute;
    color: rgb(0, 0, 0);
  }
  .sit_btn {
    position: absolute;
    width: 4rem;
    height: 2rem /* 32px */;
    font-size: 0.875rem /* 14px */;
    line-height: 2rem /* 20px */;
    color: white;
    text-align: center;
    border: 2px solid white;
    --tw-bg-opacity: 1;
    background-color: rgba(248, 113, 113, var(--tw-bg-opacity));
    right: 4rem /* 40px */;
    bottom: 18rem /* 40px */;
  }
  .bg {
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
  }
  .bg .pop {
    width: 880px;
    height: 548px;
    border-radius: 8px;
    background: #ffffff;
    padding: 36px 40px 24px 40px;
    /* width: 24rem;
    height: 24rem; */
    position: relative;
  }
  .bg .pop .dialogClose {
    width: 3rem /* 64px */;
    height: 3rem;
    position: absolute;
    top: -1rem;
    right: -1rem;
    cursor: pointer;
    border-radius: 50%;
  }
  .bg .pop .img_box {
    width: 800px;
    height: 400px;
    margin: 0 auto;
    position: relative;
  }
  .bg .pop .img_box .logo {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 20px;
    top: 3rem;
  }
  .bg .pop .img_box .logo img {
    width: 100%;
    height: 100%;
  }
  .bg .pop .img_box .intaking_photo {
    width: 100%;
    height: 100%;
    /* object-fit: contain; */
    margin-top: 2rem;
  }
  .img_box .code_area {
    width: 60px;
    height: 60px;
    position: absolute;
    right: 2rem;
    bottom: 1rem;
  }
  .img_box .code_area img {
    width: 100%;
    height: 100%;
  }
  .pop .save_btn {
    width: 385px;
    height: 44px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 10px;
    background: #f2cb91;
    color: #cb1f26;
    margin: 4rem auto;
    cursor: pointer;
  }
  .showList {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .showList .show_inner {
    position: relative;
  }
  .showList .show_inner .closeBtn {
    position: absolute;
    height: 4rem /* 64px */;
    width: 4rem /* 64px */;
    font-size: 1.5rem /* 24px */;
    text-align: center;
    cursor: pointer;
    background-color: black;
    top: -4rem /* -64px */;
    right: 0.75rem /* 12px */;
    border-radius: 50%;
    color: white;
  }
  .showList .show_inner .item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item .select_box {
    width: 7rem /* 112px */;
    height: 5rem /* 80px */;
    border: 2px solid black;
    border-radius: 2px;
    color: white;
  }
  .select_box img {
    width: 100%;
    height: 100%;
  }
  .scene_menu {
    background-color: rgba(86, 165, 241, 0.7);
    /* color: #fff;
    position: absolute;
    top: 150px;
    right: 65px;
    width: 280px;
    padding: 10px;
    text-align: center;
    font-size: 14px; */
    border-radius: 10px;
  }
  .scene {
    width: 90%;
    background-color: rgba(96, 177, 255, 1);
    box-shadow: 0.5px 1px 5px #fff;
    padding: 5px 0;
    color: #fff;
    border: 0px solid #aaa;
    border-radius: 15px;
    margin: 15px;
  }
  /* .leaveMsg {
    position: absolute;
    right: 0px;
    top: 0;
    width: 35%;
    height: 100vh;
    background-color: white;
  } */
  /* @keyframes msgmove{
    from {
      tr
    }
  } */
  .msg_box {
    animation: moveMsg 8s infinite;
  }
  .leaveMsg .close {
    border-radius: 50%;
    line-height: 44px;
    cursor: pointer;
  }
  .leaveMsg .bottom_box {
    /* position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center; */
  }
  /* .interact {
    width: 100%;
    height: 35%;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 35px;
  }
  .interact .close_btn {
    position: absolute;
    right: 35px;
    top: 0;
    font-size: 40px;
    cursor: pointer;
  }
  .interact .content_item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 30px 0 0 20px;
  } */
  .content_item .ava_logo {
    width: 20%;
  }
  .content_item .question_content {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .content_item .question_content_show {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .question_content .question_part {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 20px;
  }
  .question_content .title_name {
    font-size: 25px;
  }
  .question_part .tips {
    padding-right: 20px;
  }
  .question_part .question_item {
    display: flex;
    align-items: center;
    width: 250px;
    flex-wrap: wrap;
  }
  .question_item .que {
    font-size: 20px;
    width: 100px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid black;
    margin-right: 15px;
    margin-top: 15px;
    cursor: pointer;
  }
  .question_show {
    display: flex;
    align-items: center;
    padding-top: 10%;
  }
  .question_show .tips {
    margin-right: 30px;
  }
  .question_show .question_text {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .question_text {
  }
  .next_btn {
    font-size: 20px;
    width: 100px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid black;
    margin-right: 15px;
    position: absolute;
    right: 20px;
    cursor: pointer;
  }
}

@media screen and (max-width: 992px) {
  .message-content .message-title,
  .scene-content .scene-title {
    height: 10% !important;
  }
  .message-content .message-title img,
  .scene-content .scene-title img {
    max-height: 70%;
  }
  .message-content .fixed-bottom {
    padding: 10px 10px 10px 24px;
  }
  .message-content .message-box {
    height: calc(100% - 160px);
  }
  .fixed-bottom .input-box {
    height: 30px;
  }

  .message-content .message-title img {
    max-height: 70%;
  }
  .message-content .fixed-bottom {
    padding: 10px 10px 10px 24px;
  }
  .message-content .message-box {
    height: calc(100% - 160px);
  }
  .fixed-bottom .input-box {
    height: 30px;
  }
}
</style>
