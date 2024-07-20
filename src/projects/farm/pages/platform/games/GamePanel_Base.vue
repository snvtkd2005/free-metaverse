<template>
  <div class="w-full h-full absolute left-0 top-0 z-0 pointer-events-none">
    <!-- 战斗记录 -->
    <CombatPanelVue ref="CombatPanelVue" />

    <!-- 魔兽世界界面 -->
    <div class="absolute z-50 left-0 top-0 w-full h-full">
      <wowPanelVue ref="wowPanelVue"></wowPanelVue>
    </div>

    <!-- 弹幕玩家 -->
    <DMPlayerPanelVue ref="DMPlayerPanelVue" />
  </div>
</template>



 
<script >
import { YJDMManager_GameBase } from "../../../js/games/YJDMManager_GameBase.js";
import CombatPanelVue from "../common/combatLogPanel.vue";
import DMPlayerPanelVue from "./DMPlayerPanel.vue";
import wowPanelVue from "./wowPanel.vue";

export default {
  props: [],
  components: {
    DMPlayerPanelVue,
    CombatPanelVue,
    wowPanelVue,
  },
  data() {
    return {
      inGame: false,
      inDMGame: false,
      timeCount: 15,
      waveNum: 1,
      waveCount: 6,
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
      winCamp: "", 
    };
  },
  created() {},
  mounted() {
    if (_Global.setting.inEditor) {
      return;
    }
    _Global.addEventListener("3d加载完成", () => {
      //弹幕管理器
      this._YJDMManager = new YJDMManager_GameBase(this);
      // _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJDMManager);
    });

    setTimeout(() => {
      setTimeout(() => {
        _Global.addEventListener("战斗结束", (msg) => {
        });
      }, 5000);
      setTimeout(() => { 
        _Global.addEventListener("战斗开始", () => {
          
        });
      }, 5000);
    }, 5000);
  },

  methods: {
    forceUpdate() {
      this.$refs.DMPlayerPanelVue.$forceUpdate();
    },
    setDMPlayer(_dmplayer) {
      this.$refs.DMPlayerPanelVue.setDMPlayer(_dmplayer);
    },
    changeDMPlayerSkillCD(npcId, skillIndex, cCD, CD) {
      this.$refs.DMPlayerPanelVue.changeDMPlayerSkillCD(
        npcId,
        skillIndex,
        cCD,
        CD
      );
    },
    DMlog(text, type) {
      if (
        this.dmLogContent != "" &&
        this.dmLogType == "弹幕玩家" &&
        type != "弹幕玩家"
      ) {
        // 非弹幕玩家的消息无法打断弹幕玩家的弹窗
        return;
      }
      this.dmLogContent = text;
      this.dmLogType = type;
      if (this.laterDMlog) {
        clearTimeout(this.laterDMlog);
      }
      this.laterDMlog = setTimeout(() => {
        this.dmLogContent = "";
      }, 3000);
    },
    //#region  聊天

    skill(item) {
      if (this.heatValue < item.heat) {
        return;
      }
      if (this._YJDMManager.skill(item)) {
        this.heatValue -= item.heat;
        if (this.heatValue < 0) {
          this.heatValue = 0;
        }
      }
      // console.log("执行卡牌技能",item);
    },
    //从房间数据中提取指定房间的聊天记录
    GetRoomChatRecode(roomName) {
      for (let i = 0; i < this.roomList.length; i++) {
        let item = this.roomList[i];
        if (item.roomName == roomName) {
          return item.roomChatRecode;
        }
      }
    },
    addHeat(v) {
      this.heatValue += v;
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
      }, 30000);
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
.dmtip {
  --tw-bg-opacity: 0.51;
  background-color: rgba(107, 114, 128, var(--tw-bg-opacity));
}
.brightness-50 {
  filter: brightness(0.5);
}
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