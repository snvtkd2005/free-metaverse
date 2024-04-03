<template>
  <!-- 直播间人数 -->
  <div class="w-full h-full absolute left-0 top-0 pointer-events-none">
    <div v-if="!inGame" class="absolute left-0 top-10 w-full h-10 flex">
      <div class="self-center mx-auto text-white text-lg">
        <div>战斗开始倒计时</div>
        <div class="  ">
          {{ timeCurrent }}
        </div>
      </div>
    </div>
    <!-- 透明度背景 -->
    <!-- <div class="absolute left-0 top-0 z-0 w-full h-full ">
      <img class="w-full h-full" src="http://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg" alt="">
    </div> -->

    <div class="absolute left-16 w-auto top-3 z-10 text-white">
      直播间人气 {{ otherUser.length }}
    </div>

    <div
      ref="roomChateRecode"
      class="mt-10 text-left h-auto max-h-96 overflow-hidden overflow-y-hidden text-white"
    >
      <div
        v-for="(item, i) in otherUser"
        :key="i"
        :index="item.uname"
        class="relative w-11/12 pl-2 pb-1"
      >
        <div class="flex">
          <img class="w-10 h-10 rounded-full" :src="item.uface" alt="" />
          <!-- <div class=" w-auto  whitespace-nowrap  truncate " >

          </div> -->
          <div class="whitespace-nowrap">{{ item.uname }}:</div>
          <div>
            {{ item.msg }}
          </div>
        </div>
      </div>
    </div>


    <div class="absolute left-0 top-0 w-full h-full">
      <div class="absolute bottom-20 left-0 w-full">
        <div class="w-5/6 mx-auto flex justify-between text-left text-3xl">
          <div class="text-red-600">
            红方<br />
            1 弓箭手<br />
            2 战士<br />
          </div>
          <div class="text-blue-600">
            蓝方<br />
            11 魔暴龙<br />
            22 森林狼<br />
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗统计 -->
    <div v-if="damageStatistics.length>0" class="absolute left-0 top-0 w-full h-full flex">
      <div class="w-1/2 h-2/3 self-center mx-auto bg-black bg-opacity-40">
        <div class=" mt-10 text-xl text-white">战斗统计</div>
        <div class=" leading-10  text-2xl text-green-300 ">{{winCamp}}获胜！</div>
        <div class=" w-full  ">
          <div class=" grid grid-cols-4 text-white "> 
            <div class=" ml-6 leading-10">参与者</div>
            <div class=" ml-6 leading-10">阵营</div>
            <div class=" ml-6 leading-10">输出</div>
          </div>
        </div>
        <div v-for="(item, i) in damageStatistics" :key="item" :index="i" class=" w-full">

          <div class=" px-10 text-white  grid grid-cols-4">
            <div class=" flex ">
              <img class=" w-10 h-10 rounded-full" :src="item.header" alt="">
              <div class=" ml-1 leading-10">{{item.from}}</div>
            </div>
            <div class=" ml-1 leading-10">{{item.camp}}</div>
            <div class=" ml-6 leading-10">{{item.value}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


 
<script >
export default {
  props: [],
  components: {},
  data() {
    return {
      inGame: false,
      timeCount: 60,
      timeCurrent: "", //游戏开始倒计时
      last: 0,
      deltaTime: 0,

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

      damageStatistics:[
        // {from:"ddd",camp:"红方",header:"https://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg",value:100}
      ],
      winCamp:"",
    };
  },
  created() {},
  mounted() {

    setTimeout(() => {
      
      if(_Global.setting.inEditor){
        return;
      }
      this.last = performance.now();
      this.deltaTime = 0;
      this.animate();

      setTimeout(() => {
        _Global.addEventListener("战斗结束", (msg) => {
          console.log(" 战斗结束 ",msg);
          if(msg){
            this.winCamp =msg==10000? "蓝方":"红方";
          }
          _Global.inGame = false;
          this.last = performance.now();
          this.deltaTime = 0;
          this.timeCurrent = 0;
          this.inGame = false;

          let damageStatistics = (_Global._SceneManager.GetDamageStatistics());

          for (let i = 0; i < damageStatistics.length; i++) {
            const item = damageStatistics[i];
            let has = false;
            for (let j = 0; j < this.damageStatistics.length && !has; j++) {
              const item2 = this.damageStatistics[j];
              if(item.from == item2.from){
                item2.value +=item.value;
                has = true;
              }
            }
            if(!has){
              this.damageStatistics.push({from:item.from,header:"", value:item.value});
            }
          }
          this.damageStatistics = _Global.DMManager.DMPlayerDamageStatistics(this.damageStatistics);

          _Global._SceneManager.ResetDamageStatistics();

        });
      }, 5000);
      setTimeout(() => {
        _Global.addEventListener("战斗开始", () => { 
          this.damageStatistics = [];
        });
      }, 5000);
    }, 2000);
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
        this.otherUser.splice(0, 1);
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

    animate() {
      requestAnimationFrame(this.animate);

      if (!this.inGame) {
        const now = performance.now();
        let delta = (now - this.last) / 1000;
        this.deltaTime += delta * 1;
        if (this.deltaTime >= this.timeCount) {
          this.deltaTime = 0;
          this.inGame = true; 
          _Global.inGame = true;
        }
        this.timeCurrent = parseInt(this.timeCount - this.deltaTime);
        this.last = now;
      }
    },
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