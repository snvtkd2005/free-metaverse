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
    <div
      class="tool_menu absolute top-4 right-4 flex items-center w-44 lg:w-80"
    >
      <!-- 会议厅列表  isShowMeetingIconList-->
      <!-- <div class="activity" v-show="isShowMeetingIconList">节目单</div> -->
      <!-- 外景列表 -->
      <!-- mobile  -->
      <div
        class="item w-12 h-12 mr-3 "
        v-for="(item, index) in icon_menu"
        :key="item.id + 'info-'"
        v-show="!isShowMeetingIconList"
      >
        <img :src="publicUrl + item.path" alt="" @click="showDialog(index)" />
        <!-- <div>{{ item.text }}</div> -->
      </div>
      <!-- 节目列表 -->
      <div
        class="item w-12 h-12  mr-3"
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
    <!-- 传送弹窗 -->
    <div class="flex w-44 h-32  justify-center items-center absolute border-2 bg-black right-0 bottom-4" v-show="isShowMoveDialog">
      <div @click="closeMoveDialog" class="w-11 h-11 text-xl m-auto  bg-black top-0 right-0 absolute lg:w-16 lg:h-16 lg:text-2xl text-center cursor-pointer text-white rounded-full">x</div>
      <div class="absolute  text-center text-base flex flex-col items-center justify-center text-white">
        <div class="cursor-pointer" @click="selectFloor('floor1')" v-show="isShowCurrentFloor!='floor1'">一层</div>
        <div class="cursor-pointer m-3" @click="selectFloor('floor2')"  v-show="isShowCurrentFloor!='floor2'">二层</div>
        <div class="cursor-pointer" @click="selectFloor('floor3')"  v-show="isShowCurrentFloor!='floor3'">三层</div>
      </div>      
    </div>
    <!-- 全屏按钮 -->
    <div class="sit_btn absolute w-16 h-8 text-sm text-white text-center border-2 bg-red-400 right-10 bottom-10" v-show="isShowFullScreenBtn" @click="toFullScreen">显示全屏</div>
    <!-- 合影区域 -->
    <div
      class="bg w-full h-full absolute translate-x-2/4 xl:pt-80"
      v-show="isShowPhoto"
    >
      <div class="pop w-96 h-96 relative m-auto">
        <div
          class="dialogClose w-11 h-11 text-xl m-auto top-0 right-0 absolute lg:w-16 lg:h-16 lg:text-2xl text-center cursor-pointer text-white"
          @click="closePhoto"
        >
          x
        </div>
        <img
          :src="publicUrl + photoName"
          class="w-full h-full object-contain"
          alt=""
        />
      </div>
    </div>
    <!-- 节目单 -->
    <div
      class="flex w-full h-full justify-center items-center absolute"
      v-show="isShowPlay"
    >
      <div class="relative">
        <div
          class="w-11 h-11 text-xl bg-black -top-16 right-3 rounded-full absolute lg:w-16 lg:h-16 lg:text-2xl text-center cursor-pointer text-white"
          @click="closePlay"
        >
          x
        </div>
        <div class="grid grid-cols-3 gap-14">
          <div
            v-for="(item) in videoUrl"
            :key="item"
            class="w-28 h-20 border-2 border-black rounded-sm text-white text-center xl:w-80 xl:h-60"
            @click="changeVideo(item)"
          >
            <video :src="item" class="w-full h-full" ></video>
          </div>
        </div>
      </div>
    </div>

    <div
      class="scene_menu absolute top-20 right-10 w-56 p-3 mr-3 text-center text-sm text-white lg:w-72 lg:top-28 lg:right-7"
      v-show="isShowScene"
    >
      <div class="scene" @click="toScene(1)">会场</div>
      <div class="scene" @click="toScene(2)">放映厅</div>
    </div>
    <div
      class="leaveMsg absolute right-0 top-0 w-1/3 h-full bg-white "
      v-show="isShowMsg"
    >
      <div
        class="close w-11 h-11 text-base bg-white absolute top-1/2 -left-8 text-center"
        @click="showMsgMed()"
      >
        收起
      </div>
      <div class="overflow-y-hidden absolute bottom-10" >
        <!-- moveArr -->
        <div
          v-for="item in moveArr"
          :key="item.iid"
          class="content flex justify-between items-center mt-2  "
        >
          <div class="left flex items-center"  ref="msgBox" >
            <div
              class="ava_icon border-2 text-center border-red-400 w-11 h-11 rounded-full ml-2"
              style="line-height: 44px"
            >
              头像
            </div>
            <div class="name_item flex flex-col pl-2">
              <div class="text-xl block">Name</div>
              <div class="text-base block">{{ item.contents }}</div>
            </div>
          </div>
          <!-- <div class="right text-sm pr-8">17:52</div> -->
          <!-- <div>这是第二条留言</div> -->
        </div>
      </div>
      <div
        class="bottom_box absolute flex w-full justify-center items-center bottom-2"
      >
        <input
          class="ipt"
          placeholder="输入"
          v-model="msgInput"
          @focus="removeThreeJSfocus"
          @blur="addThreeJSfocus"
        />
        <div
          class="send absolute right-6"
          @click="writeMessageMed"
          style="font-size: 15px"
        >
          发送
        </div>
      </div>
    </div>

    <!-- 外景问答互动 -->
    <div
      class="interact w-full xl:h-80 h-52 bg-white absolute bottom-0 left-0 right-0"
      v-show="isShowInteract"
    >
      <div
        class="close_btn absolute right-4 top-0 text-2xl cursor-pointer"
        @click="closeInteractDialog"
      >
        x
      </div>
      <div class="content_item flex items-center py-5 pl-5">
        <div class="ava_logo">头像</div>
        <div class="question_content" v-show="!isShowQuestion">
          <div class="title_name">
            欢迎您来到北京人民日报社两会健康策录制现场，我是您的伙伴康妹，参观之前让我来考考你～
          </div>
          <!-- 选择问题 -->
          <div class="question_part">
            <div class="tips">您想了解</div>
            <div class="question_item">
              <!-- 点击问题传索引 然后根据索引值显示不同题目 -->
              <div
                class="que"
                v-for="item in mainQuestionList"
                :key="item.id"
                @click="showQuestion(item.id)"
              >
                {{ item.topic }}
              </div>
            </div>
          </div>
        </div>
        <div class="question_content_show" v-show="isShowQuestion">
          <div class="title_name">{{ exerciseObj.currentTitle }}</div>
          <!-- 显示问题 -->
          <div class="question_show">
            <div class="tips" @click="playAudio()">喇叭</div>
            <div class="question_text">
              <div class="topic">{{ exerciseObj.currentContent }}</div>
              <div
                class="next_btn"
                @click="nextMed(exerciseObj.currentId)"
                v-show="isShownextBtn"
              >
                下一步
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MeetingQuestionPage class="" ref="MeetingQuestionPage" />

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
  addConfigList
} from "../requestApi/messageApi";

import MeetingQuestionPage from "./MeetingQuestionPage.vue";
export default {
  components: {
    MeetingQuestionPage,
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
        }
      ],
      meeting_menu: [
        {
          id: 0,
          path: "icon/showList.png",
          text: "节目单",
        },
        // {
        //   id: 1,
        //   path: "icon/menu-login.png",
        //   text: "场景",
        // },
        // {
        //   id: 2,
        //   path: "icon/menu-login.png",
        //   text: "留言",
        // },
        {
          id: 1,
          path: "icon/sound.png",
          text: "声音",
        },
        {
          id: 2,
          path: "icon/my.png",
          text: "我的",
        }
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
      videoUrl: [],
      msgInput: "",
      isShowScene: false,
      isShowMsg: false,
      isShowPhoto: false,
      isShowInteract: false,
      isShowQuestion: false,
      isShownextBtn: true,
      isShowMeetingInteract: false,
      isShowMeetingIconList: false,
      isShowPlay: false,
      isShowFullScreenBtn:false,
      msgArr: [],
      audioDom: null,
      isInArea: false,
      photoName: "",
      testUrl: "",
      moveArr:[],
      prepareArr:[],
      isShowCurrentFloor:"",
      isShowMoveDialog:false
    };
  },
  created() {
    // 记得开启
    this.publicUrl = this.$parent.GetPublicUrl();
    // new Interface(this)
    new Interface_UI(this);
  },
  mounted() {
    this.container = document.querySelector("#container");
    this.audioDom = document.querySelector("#audio");
    // this.getMessageMed();
    this.getPreMsgListMed();
    // this.getConfigListMed();
    this.addConfigListMed()
    this.dynamicGetMsg()

  },
  methods: {
    selectFloor(val){
      // 给3d传值
      _Global.SetGoFloorNum(val)
      this.isShowMoveDialog = false
    },
    closeMoveDialog(){
      this.isShowMoveDialog = false
    },
    toFullScreen(){
      _Global.SetVideoFullScreen()
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
    ChangeView(e) {
      if (e == "npc001") {
        this.isShowInteract = true;
      }
    },
    getMessageMed() {
      const userId = JSON.parse(localStorage.getItem("loginInfo")).user_iid;
      let options = {
        _x_user_id_: userId,
      };
      getMessage(options).then((res) => {
        console.log(res);
        this.msgArr = res.data.data;
        this.prepareArr = res.data.data
        // 先取前面部分的
        // this.moveArr = this.prepareArr.slice(0,4)
        // this.moveArr = this.prepareArr
      });
    },
    dynamicGetMsg(){
      let i = 10
     setInterval(() => {
      i+=1
      if(i<this.prepareArr.length){
        this.moveArr.push(this.prepareArr[i])
      }
      else{
       i= 0
        this.moveArr.push(this.prepareArr[i])
        console.log(1111111111);
      }
      // 更新留言板数组
      // console.log(time);
      // (Math.floor(Math.random() * 10) + 1)*1000
      }, 3500);
    },
    getPreMsgListMed() {
      let options = {};
      getPreMsgList(options).then((res) => {
        console.log("getPreMsgList", res);
        this.prepareArr = res.data.data
        this.moveArr = this.prepareArr.slice(0,10)
      });
    },
    getConfigListMed() {
      getConfigList().then((res) => {
        console.log('getConfigList',res);
        // const data = JSON.parse(JSON.stringify(res.data.data['room_01']) )
        // console.log(newData.imgUrl);
        // this.videoUrl.push(res.data.data[0]);  
        // this.videoUrl.push(res.data.data[1]);
        // this.videoUrl.push(res.data.data[2]);

      });
    },
    addConfigListMed(){
      let options = { "skey":"RoomTest","sval":'{"imgUrl":"http://router.aicodecloud.cn:8082/images/20230222223740.jpg","roomType":"show","roomId":3,"roomName":"第二放映厅","PlayList":[{"cover":"http://router.aicodecloud.cn:8082/images/cover_20230223113359.jpg","videoName":"春雨","videoUrl":"http://router.aicodecloud.cn:8082/videos/01d8e2255a2580830e935f786cccc59176arctrans.mp4"},{"cover":"http://router.aicodecloud.cn:8082/images/cover_20230223113443.jpg","videoName":"云南","videoUrl":"http://router.aicodecloud.cn:8082/videos/YunNanPinDao-MuShengYu_20ada25138d73146f46de322e68b8e7a_ms_hd.mp4"},{"cover":"http://router.aicodecloud.cn:8082/images/cover_20230223113510.jpg","videoName":"科技报国","videoUrl":"http://router.aicodecloud.cn:8082/videos/RenMinShiPinBianJiZu-JiaoDian_050f1ec09a65ec78d4d0e1448451065e_ms_c.mp4"}]}'}
      addConfigList(options).then(res=>{
        console.log(res);
        this.getConfigListMed()
      })
    },
    writeMessageMed() {
      const userId = JSON.parse(localStorage.getItem("loginInfo")).user_iid;
      let options = {
        _x_user_id_: userId,
        contents: this.msgInput,
      };
      writeMessage(options).then((res) => {
        console.log(res);
        if (res.data.success) {
          // this.getMessageMed();
          this.moveArr.push(res.data.data)
          this.msgInput = "";
        }
      });
    },
    toScene(index) {
      if (index == 1) {
        _Global.ChangeScene("scene1");
        this.isShowMeetingIconList = false;
      } else {
        _Global.ChangeScene("scene2");
        this.isShowMeetingIconList = true;
      }
      this.isShowScene = false;
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
    // showMeetingDialog(index) {
    //   if (index == 0) {
    //     this.isShowPhoto = true;
    //     this.isShowPlay = true;
    //     this.isShowScene = false;
    //   } else if (index == 1) {
    //     this.isShowScene = !this.isShowScene;
    //     // this.isShowInteract = !this.isShowInteract;
    //   } else if (index == 2) {
    //     this.isShowMsg = true;
    //     // this.showMsgMed(true);
    //     this.isShowScene = false;
    //   } else {
    //     this.isShowScene = false;
    //   }
    // },
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
        this.isShowMsg = true;
        this.startMsgFlow()
        // this.showMsgMed(true);
        this.isShowScene = false;
      } else {
        this.isShowScene = false;
      }
    },
    startMsgFlow(){
      // this.$refs.msgBox
      // console.log(this.$refs.msgBox.style.height);
      const offsetHeight = this.$refs.msgBox.style.height
      let animationRule = `  @keyframes moveMsg {
    0%{
      transform: translateY(0);
    }

    100%{
      transform: translateY(-${offsetHeight}/2);
    }
  }`
      let sheet = document.styleSheets[0]
      sheet.insertRule(animationRule, 0)
      this.$refs.msgBox.style.animation = 'moveMsg 5s infinite'

    },
    showMeetingDialog(index) {
      if (index == 0) {
        // this.isShowPhoto = true;
        this.isShowPlay = true;
        console.log("节目单");
        this.isShowScene = false;
      } else if (index == 1) {
        this.isShowScene = !this.isShowScene;
        // this.isShowInteract = !this.isShowInteract;
      } else if (index == 2) {
        this.isShowMsg = true;
        // this.showMsgMed(true);
        this.isShowScene = false;
      } else {
        this.isShowScene = false;
      }
    },
    changeVideo(url) {
      _Global.PlayVideoStream(url)
    },
  },
};
</script>

<style scoped>
#container {
  background-color: #00000054;
  /* font-size: 35px; */
}
/* .tool_menu {
  position: absolute !important;
    top: 50px !important;
    left: 50px !important;
    display: flex;
} */
@media screen and (max-width: 1024px) {
/* .tool_menu {
    position: absolute;
    top: 14px;
    right: 12px;
    display: flex;
    align-items: center;
    width: 256px;
  }

  .tool_menu .item{
    width: 44px;
    height: 44px;
    margin-right: 3px;
    color: white;
    font-size: 13px;
    text-align: center;
  } */
    .item img {
    width: 100%;
    height: 100%;
  }
  .tool_menu .item:hover {
    border-radius: 50%;
    background-color: rgba(86, 166, 241, 0.559);
  }
  .bg {
    /* background: rgba(0, 0, 0, 0.3); */
  }
  .pop {
    transform: scale(0.75);
  }
  .dialogClose {
    border-radius: 50%;
    background-color: black;
    line-height: 44px;
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
    @keyframes moveMsg {
    0%{
      transform: translateY(0);
    }
    /* 50%{
      transform: translateY(-50%);
    } */
    100%{
      transform: translateY(var(--distance));
    }
  }
  .msg_box{
    animation: moveMsg 8s infinite;
  }
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
  .tool_menu .item:hover {
    border-radius: 50%;
    background-color: rgba(86, 166, 241, 0.559);
  }

  .bg {
    /* background: rgba(0, 0, 0, 0.3); */
  }

  .dialogClose {
    border-radius: 50%;
    background-color: black;
    line-height: 60px;
    color: white;

    /* z-index: 999; */
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
  @keyframes moveMsg {
    0%{
      transform: translateY(0);
    }
    /* 50%{
      transform: translateY(-50%);
    } */
    100%{
      transform: translateY(var(--distance));
    }
  }
  .msg_box{
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
</style>
