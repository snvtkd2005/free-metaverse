
<template>
  <div class="notice-dialog" v-if="visible">
        <audio
      :src="audioSrc"
      id="audio"
       class="absolute right-0 top-0"
    >
      播放
    </audio>
    <div class="dialog-content">
      <img :src="publicUrl+'images/close.png'" class="close" @click="close()" />
      <div class="notice-top">
        <img :src="publicUrl+'images/NPC_ava.jpg'" class="photo" />
        <div class="txt">
          {{ showDetails ? noticeList[noticeIndex].title : title }}
        </div>
      </div>
      <div class="notice-list">
        <div v-if="!showDetails">
          <div
            class="notice-item"
            v-for="(item, index) in noticeList"
            :key="index"
          >
            <span>{{ item.title }}</span>
            <span @click="onShowDetails(index)">查看</span>
          </div>
        </div>
        <div v-else class="notice-details">
          <img :src="publicUrl+'images/sy.png'"  class="icon" />
          <div class="notice-txt">{{ noticeList[noticeIndex].content }}</div>
          <div class="fixed-bottom">
            <div class="left-button button" @click="onLeft" v-if="noticeIndex !== 0">上一个</div>
            <div class="right-button button" @click="onRight" v-if="noticeIndex !== noticeList.length - 1">下一个</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title:
        "您现在进入的是“两会健康策*医疗器械专场”。直播正在进行中，欢迎入座～",
      visible: false,
      showDetails: false,
      noticeIndex: 0,
      publicUrl:"./public/newsMeta/",
      audioSrc: "",
      noticeList: [
        {
          id:0,
          title: "本场介绍",
          content:"",
          audioSrc:"audio/meeting_1.mp3"
        },
        {
          id:1,
          title: "嘉宾介绍",
          content: "",
          audioSrc:"audio/meeting_2.mp3"
        },
      ],
    };
  },
  mounted(){
     this.audioDom = document.querySelector("#audio");
  },
  methods: {
    open() {
      this.showDetails = false;
      this.visible = true;
    },
    close() {
      this.visible = false;
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
    onShowDetails(index) {
      this.noticeIndex = index;
      this.showDetails = true;
      this.noticeList.forEach(item=>{
        if(item.id == index){
          this.audioDom.src = this.publicUrl+ item.audioSrc;
          if (this.audioDom.paused) {
            this.audioDom.play();
          }
        }
      })
    },
    onLeft() {
      if (this.noticeIndex <= 1) {
        this.noticeIndex = 0;
        this.playAudio();
        this.onShowDetails(this.noticeIndex)
        return;
      }
      this.noticeIndex--;
      this.playAudio();
      this.onShowDetails(this.noticeIndex)
    },
    onRight() {
      if (this.noticeIndex == this.noticeList.length - 1) {
        this.noticeIndex = this.noticeList.length - 1;
        this.playAudio();
        this.onShowDetails(this.noticeIndex)
        return;
      }
      this.noticeIndex++;
      this.playAudio();
      this.onShowDetails(this.noticeIndex)
    },
  },
};
</script>

<style scoped>
.notice-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
}
.dialog-content {
  width: 45%;

  background: #fff;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.12),
    0px 20px 20px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  position: relative;
}

.notice-top {
  height: 120px;
  /* width: 100%; */
  background-image: url(/images/chat_dialog/bak.png);
  background-position: center;
  background-size: 100% 100%;
  border-radius: 8px 8px 0px 0px;
  padding-left: 50px;
  padding-right: 50px;
  display: flex;
  align-items: center;
}
.notice-top .photo {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #fff;
  margin-right: 20px;
}

.notice-top .txt {
  flex: 1;
}

.close {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  cursor: pointer;
}

.notice-top .txt {
  color: #f2cb91;
  font-size: 20px;
}
.notice-list {
  padding: 40px 40px;
  overflow-y: auto;
}
.notice-list .notice-item {
  margin-bottom: 5px;
  background: #f7f8f9;
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  font-size: 20px;
  color: #333;
}
.notice-item span:nth-child(2) {
  cursor: pointer;
}
.notice-txt {
  font-size: 18px;
}
.fixed-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.fixed-bottom .button {
  width: 140px;
  height: 60px;
  background: #f2cb91;
  color: #cb1f26;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  border-radius: 8px;
  cursor: pointer;
  float: left;
}
.fixed-bottom .left-button {
  margin-left: 40px;
  float: left;
}
.fixed-bottom .right-button {
  margin-right: 40px;
  float: right;
}
.notice-details {
  display: flex;
  height: 128px;
  position: relative;
}
.notice-details .icon {
  width: 40px;
  height: 40px;
  margin-right: 40px;
}

@media screen and (max-width: 970px) {
  .dialog-content {
    width: 46%;
  }
  .notice-top {
    height: 95px;
    /* width: 100%; */
    padding-left: 38px;
    padding-right: 38px;
  }
  .close[data-v-1fd645d4] {
    right: -15px;
    top: -15px;
    width: 30px;
    height: 30px;
  }
  .notice-top .photo {
    width: 54px;
    height: 54px;
  }
  .notice-top .txt {
    font-size: 1rem;
  }
  .notice-list {
    padding: 12px;
  }
  .notice-list .notice-item {
    margin-bottom: 5px;
    height: 32px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 1rem;
  }
  .notice-details .icon {
    margin-left: 36px;
  }
  .fixed-bottom .button {
    width: 30%;
    height: 38px;
    line-height: 38px;
    font-size: 1rem;
  }
  .fixed-bottom {
    bottom: 10px;
  }
}
@media screen and (min-width:665px) and (max-width:668px) {
  .dialog-content {
    width: 62%;
  }
}
/* @media screen and (max-width: 668px) {
} */
@media screen and (max-width: 500px) {
  /* .dialog-content {
    width: 80%;
  } */
  .notice-top {
    padding-left: 12px;
    padding-right: 12px;
  }
  .notice-top .photo {
    margin-right: 5px;
  }
  .notice-list {
    padding: 6px;
  }
}
@media screen and (max-width: 380px) {
  .dialog-content {
    width: 60%;
  }
}
</style>