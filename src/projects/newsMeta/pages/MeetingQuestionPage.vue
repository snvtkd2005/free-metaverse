<template>
  <div id="container">
    <audio
      :src="audioSrc"
      id="audio"
       class="absolute right-0 top-0"
    >
      播放
    </audio>
    <!-- 会场问答互动 isShowMeetingInteract -->
    <div class="interact w-full md:h-80 h-56 bg-white absolute bottom-0 left-0 right-0" v-show="isShowMeetingInteract">
      <div class="close_btn  absolute right-4 top-0 text-2xl cursor-pointer" @click="closeMeetingInteractDialog">x</div>
      <div class="content_item  flex items-center py-5 pl-5">
        <div class="ava_logo">头像</div>
        <div class="question_content" v-show="!isShowMeetingQuestion">
          <div class="title_name">
            您现在进入的是“两会健康策*医疗器械专场”。直播正在进行中，欢迎入座～
          </div>
          <!-- 选择问题 -->
          <div class="question_part">
            <div class="tips">您想了解</div>
            <div class="question_item">
              <!-- 点击问题传索引 然后根据索引值显示不同题目 -->
              <div
                class="que"
                v-for="item in meetingQuestionList"
                :key="item.id"
                @click="showMeetingQuestion(item.id)"
              >
                {{ item.topic }}
              </div>
            </div>
            <div class="sitDown" @click="sitDownMed">我要落座</div>
          </div>
        </div>
        <div class="question_content_show" v-show="isShowMeetingQuestion">
          <div class="title_name">{{ MeetingexerciseObj.currentTitle }}</div>
          <!-- 显示问题 -->
          <div class="question_show">
            <div class="tips" @click="playAudio()">喇叭</div>
            <div class="question_text">
              <div class="topic">{{ MeetingexerciseObj.currentContent }}</div>
              <div
                class="next_btn"
                @click="nextMeetingMed(MeetingexerciseObj.currentId)"
                v-show="isShowMeetingnextBtn"
              >
                下一步
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// let _Global;

import { Interface_UI } from "../js/Interface_UI";
export default {
  data() {
    return {
      meetingQuestionList: [
        {
          id: 1,
          topic: "本场介绍",
          title: "本场介绍",
          content: "问题一内容",
          audioSrc: "audio/meeting_1.mp3",
        },
        {
          id: 2,
          topic: "嘉宾介绍",
          title: "嘉宾介绍",
          content: "问题二内容",
          audioSrc: "audio/meeting_2.mp3",
        },
      ],
      MeetingexerciseObj: {
        currentId: 0,
        currentTitle: "",
        currentContent: "",
      },
      isShowMeetingQuestion: false,
      isShowMeetingnextBtn: true,
      isShowMeetingInteract: false,
      audioSrc: "",
      publicUrl:'',
    };
  },
  created(){
    // 记得开启
    this.publicUrl = this.$parent.publicUrl;
  },
  mounted() {
    this.container = document.querySelector("#container");
    this.audioDom = document.querySelector("#audio");
    // new Interface_UI(this);
  },
  methods: {
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
    closeMeetingInteractDialog() {
      this.isShowMeetingInteract = false;
      this.isShowMeetingQuestion = false;
      this.isShowMeetingnextBtn = true;
      this.closeAudio();
    },
    nextMeetingMed(id) {
      id += 1;
      this.MeetingexerciseObj.currentId = id;
      this.playAudio();
      if (id < 2) {
        this.showMeetingQuestion(id);
      } else {
        this.showMeetingQuestion(id);
        this.isShowMeetingnextBtn = false;
      }
    },
    showMeetingQuestion(id) {
      this.meetingQuestionList.forEach((item) => {
        if (item.id == id) {
          if (id == 2) {
            this.isShowMeetingnextBtn = false;
          }
          this.MeetingexerciseObj.currentId = id;
          this.MeetingexerciseObj.currentTitle = item.title;
          this.MeetingexerciseObj.currentContent = item.content;
          this.audioDom.src =  this.$parent.publicUrl + item.audioSrc;

          if (this.audioDom.paused) {
            this.audioDom.play();
          }
        }
      });
      this.isShowMeetingQuestion = true;
    },
    sitDownMed() {
      console.log("传送位置落座");
      _Global.SetSitting();
    },
  },
};
</script>

<style scoped>
#container {
  background-color: #00000054;
  /* font-size: 35px; */
}
@media screen and (max-width: 1024px) {
  .tool_menu {
    position: absolute;
    top: 15px;
    width: 260px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .tool_menu .item {
    width: 44px;
    height: 44px;
    margin-right: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
  .item img {
    width: 100%;
    height: 100%;
  }
  .tool_menu .item:hover {
    border-radius: 50%;
    background-color: rgba(86, 166, 241, 0.559);
  }
  .bg {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
  }
  .point {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: scale(0.5);
  }
  .pop {
    width: 500px;
    height: 500px;
    position: absolute;
    left: -250px;
    top: -250px;
    border: 2px solid rgb(3, 3, 3);
  }
  .dialogClose {
    position: absolute;
    width: 60px;
    height: 60px;
    font-size: 25px;
    border-radius: 50%;
    background-color: black;
    text-align: center;
    line-height: 60px;
    color: white;
    left: 180px;
    top: -230px;
    cursor: pointer;
    z-index: 999;
  }
  .scene_menu {
    background-color: rgba(86, 165, 241, 0.7);
    color: #fff;
    position: absolute;
    top: 88px;
    right: 15px;
    width: 220px;
    padding: 10px;
    text-align: center;
    border-radius: 10px;
    font-size: 14px;
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
  .leaveMsg {
    position: absolute;
    right: -320px;
    top: 0;
    width: 35%;
    height: 100vh;
    background-color: white;
  }
  .leaveMsg .close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    top: 45%;
    left: -5%;
    text-align: center;
    line-height: 44px;
  }
  .leaveMsg .bottom_box {
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  /* .interact {
    width: 100%;
    height: 35%;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .interact .close_btn {
    position: absolute;
    right: 15px;
    top: 0;
    font-size: 25px;
    cursor: pointer;
  }
  .interact .content_item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 0 0 20px;
  } */
  .content_item .ava_logo {
    width: 20%;
  }
  .content_item .question_content {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .question_content .title_name {
    font-size: 25px;
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
  .question_part .sitDown {
    position: absolute;
    right: 35px;
    border: 1px solid black;
    font-size: 20px;
    width: 100px;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    text-align: center;
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
  .tool_menu {
    position: absolute;
    width: 300px;
    right: 50px;
    top: 50px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .tool_menu .item {
    width: 60px;
    height: 60px;
    margin-right: 15px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
  .tool_menu .item:hover {
    border-radius: 50%;
    background-color: rgba(86, 166, 241, 0.559);
  }
  .item img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .bg {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
  }
  .point {
    position: absolute;
    left: 50%;
    top: 50%;
  }
  .pop {
    width: 500px;
    height: 500px;
    position: absolute;
    left: -250px;
    top: -250px;
    border: 2px solid rgb(3, 3, 3);
  }
  .dialogClose {
    position: absolute;
    width: 60px;
    height: 60px;
    font-size: 25px;
    border-radius: 50%;
    background-color: black;
    text-align: center;
    line-height: 60px;
    color: white;
    left: 180px;
    top: -230px;
    cursor: pointer;
    z-index: 999;
  }
  .scene_menu {
    background-color: rgba(86, 165, 241, 0.7);
    color: #fff;
    position: absolute;
    top: 150px;
    right: 65px;
    width: 280px;
    padding: 10px;
    text-align: center;
    border-radius: 10px;
    font-size: 14px;
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
  .leaveMsg {
    position: absolute;
    right: -320px;
    top: 0;
    width: 25%;
    height: 100vh;
    background-color: white;
  }
  .leaveMsg .close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    top: 45%;
    left: -5%;
    text-align: center;
    line-height: 44px;
    cursor: pointer;
  }
  .leaveMsg .bottom_box {
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
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
  .question_part .sitDown {
    position: absolute;
    right: 35px;
    border: 1px solid black;
    font-size: 20px;
    width: 100px;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    text-align: center;
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
