<template>
  <div class="w-full h-full absolute left-0 top-0 z-50 pointer-events-none">
    <div class="absolute left-0 top-1 w-full h-auto flex">
      <div class="self-center mx-auto text-white text-2xl">
        <div>血色十字军-最后的防线</div>
        <div class="text-xl">{{ gameLevelData[gameLevel - 1].title }}</div>
      </div>
    </div>
    <div v-if="!inGame" class="absolute left-0 top-20 w-full h-10 flex">
      <div class="self-center mx-auto text-white text-lg">
        <div>战斗开始倒计时</div>
        <div class="  ">
          {{ timeCurrent }}
        </div>
      </div>
    </div>
    <div v-if="inGame" class="absolute left-0 top-20 w-full h-10 flex">
      <div class="self-center mx-auto text-white text-lg">
        <div>敌方攻势</div>
        <div class="  ">{{ waveNum }}/{{ waveCount }}</div>
      </div>
    </div>
    <!-- 透明度背景 -->
    <!-- <div class="absolute left-0 top-0 z-0 w-full h-full ">
      <img class="w-full h-full" src="http://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg" alt="">
    </div> -->

    <!-- 战斗统计 -->
    <div
      v-if="damageStatistics.length > 0"
      class="absolute left-0 top-0 z-10 w-full h-full flex"
    >
      <div
        class="relative w-2/3 h-2/3 self-center mx-auto bg-black bg-opacity-80"
      >
        <div
          class="absolute z-50 right-0 top-0 w-10 h-10 rounded-full pointer-events-auto cursor-pointer bg-black"
          @click="damageStatistics = []"
        >
          <div
            class="w-full h-full leading-10 transform scale-x-150 text-white"
          >
            x
          </div>
        </div>

        <div class="mt-10 text-xl text-white">战斗统计</div>
        <div class="leading-10 text-2xl text-green-300">
          {{ winCamp }}获胜！
        </div>
        <div class="w-full">
          <div class="grid grid-cols-4 text-white">
            <div class="ml-6 leading-10">参与者</div>
            <div class="ml-6 leading-10">阵营</div>
            <div class="ml-6 leading-10">输出</div>
          </div>
        </div>
        <div
          v-for="(item, i) in damageStatistics"
          :key="item"
          :index="i"
          class="w-full mb-1"
        >
          <div class="px-10 text-white grid grid-cols-4">
            <div class="flex">
              <img class="w-10 h-10 rounded-full" :src="item.header" alt="" />
              <div class="ml-1 leading-10">{{ item.from }}</div>
            </div>
            <div class="ml-1 leading-10">{{ item.camp }}</div>
            <div class="ml-6 leading-10">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗卡牌 -->
    <div
      class="hidden absolute left-0 bottom-0 w-full h-auto flex pointer-events-none"
    >
      <div class="relative w-auto h-full flex self-center mx-auto">
        <div
          v-for="(item, i) in cardList"
          :key="item"
          :index="i"
          class="w-full text-gray-200 pointer-events-auto cursor-pointer"
          @click="skill(item)"
        >
          <div class="flex flex-col relative">
            <div class="relative" style="width: 220px; height: 298px">
              <img
                class="w-full h-full"
                :class="heatValue < item.heat ? ' brightness-50 ' : ''"
                :src="item.icon"
                alt=""
              />
            </div>
            <div class="absolute top-24 w-full text-xl text-yellow-300">
              {{ item.dm }}
            </div>
            <div class="absolute top-10 w-full">消耗{{ item.heat }}热度</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗记录 --> 
    <CombatPanelVue ref="CombatPanelVue" />

    <!-- 弹幕技能弹窗放大显示 -->
    <div
      v-if="dmLogContent"
      ref="combatDMLog"
      class="absolute w-full top-36 left-0 flex max-h-72"
    >
      <div class="w-1/2 mx-auto bg-black bg-opacity-30 flex">
        <div
          class="text-4xl w-auto p-4 mx-auto flex-wrap"
          :class="dmLogType == '弹幕玩家' ? ' text-white  ' : ' text-red-500 '"
        >
          {{ dmLogContent }}
        </div>
      </div>
    </div>

    <!-- 弹幕信息 -->
    <div class="absolute left-0 top-0 z-10 w-64 h-full">
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
    </div>

    <!-- 玩法介绍 -->
    <div class=" hidden absolute left-0 bottom-0 w-full h-full">
      <div class="absolute bottom-2 left-0 w-full text-red-100">
        <div
          class="w-full px-2 mx-auto flex flex-col justify-between text-left text-xl"
        >
          <div class="w-full" >
            弹幕玩法<br />
            [加入] 随机角色加入游戏
            [11] 牧师  
            [12][13] 弓箭手  
            [21][23] 火枪手 
            [14][24] 法师 
            [22] 战士 
            [31][32] 食尸鬼   
            [33] 憎恶 
            <br />技能<br />
            fh 复活 
            fs 分身 
            cf 嘲讽附近敌人 
            b 冻结20米内所有敌人  
            hj 吸收200点伤害  
            sj 升级多重射击技能 <br />
          </div>

          <div class="w-full h-full pt-2 flex">
            <div
              v-for="(item, i) in giftData"
              :key="item"
              :index="i"
              class="w-auto mb-3 flex"
            >
              <div class="px-2 flex">
                <img class="w-10 h-10" :src="item.img_basic" alt="" />
                <div class="leading-10">{{ item.describe }}</div>
                <!-- <img v-if="item.img2" class="w-8 h-8" :src="item.img2" alt="" /> -->
              </div>
            </div>
          </div>
          <div class="text-blue-100 w-96 hidden">
            抵御敌方攻势<br />
            boss技能：<br />
            吐息--对范围内的玩家造成伤害<br />
            繁殖--增殖出多种病毒型号的小怪<br />
            进化--50%血量进入二阶段，所有技能造成的伤害提高50% <br />
            感染--随机指定玩家受到传染病毒，debuff，-10/每秒,持续10秒<br />
          </div>
        </div>
        <div class="px-2 flex">
          <div class="text-left mx-auto"></div>
        </div>
      </div>
    </div>

      <!-- 魔兽世界界面 -->
      <div class="absolute z-50 left-0 top-0 w-full h-full">
        <wowPanelVue ref="wowPanelVue"></wowPanelVue>
      </div>

    <!-- 弹幕玩家 -->
    <DMPlayerPanelVue ref="DMPlayerPanelVue" />

  </div>
</template>



 
<script >
import { YJDMManager_DMrogue } from "../../../js/games/YJDMManager_DMrogue.js";
import CombatPanelVue from '../common/combatLogPanel.vue';
import DMPlayerPanelVue from './DMPlayerPanel.vue';
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

      damageStatistics: [
        // {from:"ddd",camp:"红方",header:"https://i1.hdslb.com/bfs/face/d5c63d43ac8d77ba400ba392ff1d396c85897b0c.jpg",value:100}
      ],
      winCamp: "",
      heatValue: 200, //热度
      cardList: [
        // {
        //   title: "冰霜新星",
        //   dm: "[冰霜新星] 或 [b]",
        //   icon: "https://bkimg.cdn.bcebos.com/pic/0823dd54564e9258d109a0f4e4d6c658ccbf6c81e0d7?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
        //   describe:
        //     "冲击范围内的所有敌人，对它们造成99-111点冰霜伤害并将其冻结在原地，最多持续8秒。对被冻结的目标造成伤害可能打断这个效果。",
        //   heat: 10,
        // },
        // {
        //   title: "快速治疗",
        //   dm: "[快速治疗] 或 [z]",
        //   icon: "https://bkimg.cdn.bcebos.com/pic/622762d0f703918fa0ec6f9bff6e319759ee3d6d6e1c?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
        //   describe:
        //     "冲击范围内的所有敌人，对它们造成99-111点冰霜伤害并将其冻结在原地，最多持续8秒。对被冻结的目标造成伤害可能打断这个效果。",
        //   heat: 10,
        // },
        {
          title: "雷诺莫格莱尼",
          dm: "[雷诺莫格莱尼] 或 [m]",
          icon: "./public/images/雷诺莫格莱尼.png",
          describe: "召唤雷诺·莫格莱尼",
          heat: 20,
        },
        // {
        //   title:"暴风雪",
        //   icon:"https://bkimg.cdn.bcebos.com/pic/2fdda3cc7cd98d1001e9efb0aa6caf0e7bec55e73aac?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
        //   describe:"对范围内的敌方敌人造成20点伤害，并使其冻结。对被冻结的目标造成伤害可能打断这个效果。",
        //   heat:200,
        // },
        // {
        //   title:"寒冰屏障",
        //   icon:"https://bkimg.cdn.bcebos.com/pic/2cf5e0fe9925bc315c6071ec62879ab1cb134954da35?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
        //   describe:"8秒内免疫所有伤害",
        //   heat:200,
        // },
        {
          title: "复活术",
          dm: "[复活术] 或 [f]",
          icon: "https://bkimg.cdn.bcebos.com/pic/203fb80e7bec54e736d13914e86b8c504fc2d5623c24?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
          describe: "复活一个在本局对战中死亡的弹幕玩家",
          heat: 10,
        },
      ],
      dmLogContent: "",
      dmLogType: "", //弹幕玩家/敌方npc/我发npc
      giftData: [
        {
          id: -1000,
          name: "点赞",
          describe: "全员生命 +200",
          img_basic:
            "https://i0.hdslb.com/bfs/live/fe8e848118e8f18eccbd11cad62b29105c51a797.png",
        },
        {
          id: 31036,
          name: "小花花",
          describe: "吸收200点伤害",
          img_basic:
            "https://s1.hdslb.com/bfs/live/8b40d0470890e7d573995383af8a8ae074d485d9.png",
        },
        {
          id: 31039,
          name: "牛哇牛哇",
          describe: "升级多重射击",
          img_basic:
            "https://s1.hdslb.com/bfs/live/91ac8e35dd93a7196325f1e2052356e71d135afb.png",
          img2: "./public/images/skillIcon/spell_hunter_exoticmunitions_poisoned.png",
        },
        {
          id: 1,
          name: "辣条",
          describe: "全员吸收500点伤害",
          img_basic:
            "https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png",
        },
      ],
      gameLevel: 1,
      gameLevelData: [
        {
          level: 1,
          title: "第一关 亡灵必须死",
          describe: "",
        },
        {
          level: 2,
          title: "第二关 一个不留",
          describe: "",
        },
        {
          level: 3,
          title: "第三关 血债血偿",
          describe: "",
        },
        {
          level: 4,
          title: "第四关 冤有头，债有主",
          describe: "怀特迈恩被莉莉安·沃斯用圣化长剑杀死",
        },
      ],
    };
  },
  created() {},
  mounted() {
    if (_Global.setting.inEditor) {
      return;
    }
    _Global.addEventListener("3d加载完成", () => {
      //弹幕管理器
      this._YJDMManager = new YJDMManager_DMrogue(this);
      // _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJDMManager);
    });

    setTimeout(() => {

      this.last = performance.now();
      this.deltaTime = 0;
      this.animate();

      setTimeout(() => {
        _Global.addEventListener("战斗结束", (msg) => {
          console.log(" 战斗结束 ", msg);

          if (msg) {
            if (msg == 10000) {
              // this.gameLevel = 1;
              this.winCamp = "亡灵";
            } else {
              if (!_Global.createCompleted) {
                return;
              }
              this.winCamp = "血色十字军";
              this.gameLevel++;
            }
          } else {
            this.winCamp = "血色十字军";
            this.gameLevel++;
          }
          // 临时-没有更多关卡
          if (this.gameLevel > this.gameLevelData.length) {
            this.gameLevel = this.gameLevelData.length;
          }

          _Global.inGame = false;
          this.last = performance.now();
          this.deltaTime = 0;
          this.timeCurrent = 0;
          this.inGame = false;

          let damageStatistics = _Global._SceneManager.GetDamageStatistics();

          for (let i = 0; i < damageStatistics.length; i++) {
            const item = damageStatistics[i];
            let has = false;
            for (let j = 0; j < this.damageStatistics.length && !has; j++) {
              const item2 = this.damageStatistics[j];
              if (item.from == item2.from) {
                item2.value += item.value;
                has = true;
              }
            }
            if (!has) {
              this.damageStatistics.push({
                from: item.from,
                header: "",
                value: item.value,
              });
            }
          }
          this.damageStatistics = _Global.DMManager.DMPlayerDamageStatistics(
            this.damageStatistics
          );
          //按输出伤害量从高到底排序
          this.damageStatistics.sort((a, b) => b.value - a.value);
          // let dv = [];
          // for (let j = 0; j < this.damageStatistics.length ; j++) {
          //   const item = this.damageStatistics[j];
          //   dv.push(item.value);
          // }
          // dv.sort();
          // let newdamageStatistics = [];
          // for (let i = 0; i < dv.length; i++) {
          //   const v = dv[i];
          //   let has = false;
          //   for (let j = this.damageStatistics.length-1; j >=0 && !has ; j--) {
          //     const item = this.damageStatistics[j];
          //     if(item.value == v){
          //       newdamageStatistics.push(item);
          //       this.damageStatistics.splice(i,1);
          //       has = true;
          //     }
          //   }
          // }
          // this.damageStatistics = newdamageStatistics;

          //     let dv = [1180,550,684,994,520];
          // dv = dv.sort((a, b) => b - a);

          // console.log("dv.sort() = ",dv);

          _Global._SceneManager.ResetDamageStatistics();

          setTimeout(() => {
            this.damageStatistics = [];
          }, 10000);
        });
      }, 5000);
      setTimeout(() => {
        _Global.addEventListener("敌方攻势", (num) => {
          this.waveNum = num;
        });
        _Global.addEventListener("战斗开始", () => {
          this.waveNum = 1;
          this.damageStatistics = []; 
        });
      }, 5000);
    }, 5000);
  },

  methods: {
    setDMPlayer(_dmplayer) {
      this.$refs.DMPlayerPanelVue.setDMPlayer(_dmplayer); 
    },
    changeDMPlayerSkillCD(npcId, skillIndex, cCD,CD) {
      this.$refs.DMPlayerPanelVue.changeDMPlayerSkillCD(npcId, skillIndex, cCD,CD); 
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

    animate() {
      requestAnimationFrame(this.animate);

      if (!this.inGame) {
        const now = performance.now();
        let delta = (now - this.last) / 1000;
        this.deltaTime += delta * 1;
        if (this.deltaTime >= this.timeCount) {
          this.deltaTime = 0;
          this.inGame = true;
          // 开始游戏
          _Global.applyEvent("战斗开始");

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