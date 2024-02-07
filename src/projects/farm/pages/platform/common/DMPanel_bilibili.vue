<template>

  <!-- 直播间人数 -->
  <div  
    class=" xl:block w-96 h-48 absolute left-0 top-12 xl:top-28  origin-top-right transform scale-50 xl:scale-100 ">

    <!-- 透明度背景 -->
    <!-- <div class="absolute left-0 top-0 z-0 w-full h-full ">
      <img class="w-full h-full" src="http://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg" alt="">
    </div> -->

    <div class=" absolute left-16 w-auto top-3 z-10 text-white  ">
      直播间人气 {{ otherUser.length }}
    </div>

    <div ref="roomChateRecode" class=" mt-10 text-left h-auto max-h-96 overflow-hidden overflow-y-hidden  text-white">
      <div v-for="(item, i) in otherUser" :key="i" :index="item.uname" class=" relative w-11/12  pl-2 pb-1   "
        >
        <div class=" flex ">
          <img class=" w-10 h-10 rounded-full " :src="item.uface" alt="">
          <!-- <div class=" w-auto  whitespace-nowrap  truncate " >

          </div> -->
          <div class="  whitespace-nowrap ">
              {{ item.uname  }}:
          </div>
          <div>
              {{ item.msg  }}
          </div>
  
        </div>

      </div>
    </div>

  </div> 
 
</template>


 
<script >
 
export default {
  
  props: [],
  components: {
    
  },
  data() {
    return {
  
 
      // 弹幕用户
      otherUser: [
        // {
        //   uface: "https://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg",
        //   uname: "ddd",
        //   msg: "ddd",
        // }
      ],
      //系统消息
      systemMsg: [],
 
    };
  },
  created() {
 
  },
  mounted() { 
  },

  methods: { 
    //#region  聊天

    //从房间数据中提取指定房间的聊天记录
    GetRoomChatRecode(roomName) {
      for (let i = 0; i < this.roomList.length; i++) {
        let item = this.roomList[i];
        if (item.roomName == roomName) {
          return item.roomChatRecode;
        }
      }
    }, 
    //接收信息
    receiveMsg(msg) {
      this.otherUser.push(msg);

      setTimeout(() => {
        this.$refs.roomChateRecode.scrollTop =
        this.$refs.roomChateRecode.scrollHeight;
      }, 20);

      setTimeout(() => {
        this.otherUser.splice(0,1);
      }, 10000);
      // this.otherUser.push({uface:msg.uface,uname:msg.uname});
    },
    //聊天记录窗口滑块，滑到底部
    ScrollArea() {
      var that = this;
      //先判断聊天区滑块是否在最低端。
      //在最低端时，才在接收新消息时，再次设为最低端
      // console.log("scrollTop", this.$refs.roomChateRecode.scrollTop);
      // console.log("scrollHeight", this.$refs.roomChateRecode.scrollHeight);
      // 288
      if (this.$refs.roomChateRecode.scrollHeight >= 244) {
        if (
          this.$refs.roomChateRecode.scrollTop <
          this.$refs.roomChateRecode.scrollHeight - 244
        ) {
          setTimeout(() => {
            that.$refs.roomChateRecode.scrollTop =
              that.$refs.roomChateRecode.scrollHeight;
          }, 100);
        }
        return;
      } else {
        // return;
        setTimeout(() => {
          that.$refs.roomChateRecode.scrollTop =
            that.$refs.roomChateRecode.scrollHeight;
        }, 20);
      }
    },  
    //#endregion



  },
};
</script>

<style scoped>
.chatContent {

  /* vue中如何将双击选中文字的默认事件取消 */
  -moz-user-select: text;
  /*火狐*/
  -webkit-user-select: text;
  /*webkit浏览器*/
  -ms-user-select: text;
  /*IE10*/
  -khtml-user-select: text;
  /*早期浏览器*/
  user-select: text;
}
</style>