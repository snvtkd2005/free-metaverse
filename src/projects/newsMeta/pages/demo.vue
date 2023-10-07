
<template>
  <div class="demo-list">
    <div class="button" @click="ncpOpen()">NCP弹窗</div>
    <div class="button" @click="sceneOpen()">场景选择</div>
    <div class="button" @click="messageBoardOpen()">留言板</div>
    <!--<div class="button"></div>
        <div ></div>-->
    <notice-dialog ref="noticeRef"></notice-dialog>
    <drawer-dialog ref="drawerRef">
      <div class="scene-content">
        <div class="scene-title">场景选择</div>
        <div class="scene-box">
            <div class="scene-item">
                <div class="img"></div>
                <div class="name">场景名称</div>
            </div>
            <div class="scene-item">
                <div class="img"></div>
                <div class="name">场景名称</div>
            </div>
            <div class="scene-item">
                <div class="img"></div>
                <div class="name">场景名称</div>
            </div>
            <div class="scene-item">
                <div class="img"></div>
                <div class="name">场景名称</div>
            </div>
        </div>
      </div>
    </drawer-dialog>
    <drawer-dialog ref="messageRef">
      <div class="message-content">
        <div class="message-title">留言板</div>
        <div class="message-box">
            <div class="message-item">
              <img src="" class="user-img"/>
              <div class="message-right">
                <div class="name">用户名</div>
                <div class="text">欢迎进入人民日日报健康客户端两会健康策“元宇宙”世界</div>
              </div>
            </div>
            <div class="message-item">
              <img src="" class="user-img"/>
              <div class="message-right">
                <div class="name">用户名</div>
                <div class="text">欢迎进入人民日日报健康客户端两会健康策“元宇宙”世界</div>
              </div>
            </div>
            <div class="message-item">
              <img src="" class="user-img"/>
              <div class="message-right">
                <div class="name">用户名</div>
                <div class="text">欢迎进入人民日日报健康客户端两会健康策“元宇宙”世界</div>
              </div>
            </div>
            <div class="message-item">
              <img src="" class="user-img"/>
              <div class="message-right">
                <div class="name">用户名</div>
                <div class="text">欢迎进入人民日日报健康客户端两会健康策“元宇宙”世界</div>
              </div>
            </div>
            <div class="message-item">
              <img src="" class="user-img"/>
              <div class="message-right">
                <div class="name">用户名</div>
                <div class="text">欢迎进入人民日日报健康客户端两会健康策“元宇宙”世界</div>
              </div>
            </div>
            <div class="message-item">
              <img src="" class="user-img"/>
              <div class="message-right">
                <div class="name">用户名</div>
                <div class="text">欢迎进入人民日日报健康客户端两会健康策“元宇宙”世界</div>
              </div>
            </div>
        </div>
        <div class="fixed-bottom">
          <div class="top-box">
            <img src="" class="photos"/>
            <textarea placeholder="说点儿什么吧..." class="input-box"></textarea>
          </div>
          <div class="publish">发布</div>
        </div>
      </div>
    </drawer-dialog>
  </div>
</template>
<script>
import NoticeDialog from "../components/notice-dialog/notice-dialog.vue";
import DrawerDialog from "../components/drawer-dialog/drawer-dialog.vue";
export default {
  components: {
    NoticeDialog,
    DrawerDialog,
  },
  data() {
    return {
      obj:{
        'imgUrl': 'http://router.aicodecloud.cn:8082/images/20230222223740.jpg',
        'roomType': 'show',
        'roomId': 3,
        'roomName': '第二放映厅',
        'PlayList': [{
          'cover': 'http://router.aicodecloud.cn:8082/images/cover_20230223111701.jpg',
          'videoName': '历史回顾',
          'videoUrl': 'http://router.aicodecloud.cn:8082/videos/202203171700.mp4'
        }, {
          'cover': 'http://router.aicodecloud.cn:8082/images/cover_20230223111850.jpg',
          'videoName': '女士',
          'videoUrl': 'http://router.aicodecloud.cn:8082/videos/111.mp4'
        }]
      }
    };
  },
  methods: {
    ncpOpen() {
      this.$refs.noticeRef.open();
    },
    sceneOpen() {
      console.log(this.$refs.drawerRef);
      this.$refs.drawerRef.open();
    },
    messageBoardOpen() {
      this.$refs.messageRef.open();
    }
  },
};
</script>

<style scoped>
.demo-list {
  padding: 20px 20px;
  display: flex;
}
.button {
  padding-left: 20px;
  padding-right: 20px;
  height: 40px;
  line-height: 40px;
  background: #cb1f26;
  text-align: center;
  color: #fff;
  margin-right: 40px;
  cursor: pointer;
}
.scene-content {
  width: 100%;
  height: 100%;
}
.scene-content .scene-title {
  height: 60px;
  width: 100%;
  background: url("../../../assets/bak.png") no-repeat center center;
  background-size: cover cover;
  display: flex;
  align-items: center;
  padding-left: 60px;
  color: #F2CB91;
  font-size: 24px;
  font-weight: bold;
}
.scene-content .scene-box {
    height: calc(100% - 60px);
    padding: 20px 40px;
    overflow-y: scroll;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: flex-start;
}
.scene-box .scene-item {
    text-align: center;
    margin-bottom: 60px;
    width:48%;
    height:100px;
}
.scene-box .scene-item:nth-child(2n-1) {
    padding-right: 10px;
}
.scene-box .scene-item:nth-child(2n) {
    padding-left: 10px;
}
.scene-item .img {
    width: 100%;
    height: 100px;
    background: red;
    border-radius: 4px;
}
.scene-item .name {
    margin-top: 10px;
    font-size: 16px;
}

/** 留言板css */
.message-content {
  width: 100%;
  height: 100%;
}
.message-content .message-title {
  height: 60px;
  width: 100%;
  background: url("../../../assets/bak.png") no-repeat center center;
  background-size: cover cover;
  display: flex;
  align-items: center;
  padding-left: 60px;
  color: #F2CB91;
  font-size: 24px;
  font-weight: bold;
}
.message-content .message-box {
    padding: 20px 40px;
    overflow-y: scroll;
    background: #fafafa;
    position: absolute;
    top: 60px;
    bottom: 120px;
}
.message-box .message-item {
  display: flex;
  align-items: center;
  margin-bottom:10px;
}
.message-item .user-img {
  width:52px;
  height:52px;
  border-radius:100%;
  margin-right:14px;
}
.message-item .message-right {
  flex:1;
}
.message-right .name {
  color:#666666;
  font-size:14px;
  margin-bottom:5px;
}
.message-right .text {
  font-size:16px;
  color:#333
}
.message-content .fixed-bottom {
  height:120px;
  background:#fff;
  padding:20px 30px 20px 50px;
  position: absolute;
  bottom: 0px;
  width: 100%;
}
.fixed-bottom  .photos {
  width:52px;
  height:52px;
  border-radius:100%;
  margin-right:8px;
}
.fixed-bottom  .input-box {
  height:52px;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  flex:1;
  padding:10px;
}
.fixed-bottom .top-box {
  display:flex;
  align-items:center;
}
.fixed-bottom .publish {
  background: #F2CB91;
  width: 70px;
  height: 28px;
  border-radius: 4px;
  color:#CB1F26;
  text-align:center;
  line-height:28px;
  float:right;
  margin-top:12px;
}
</style>