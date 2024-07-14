<template>
  <div class="w-full h-full absolute left-0 top-0 pointer-events-none">
    <div
      v-show="!displayCard"
      class="absolute left-0 top-0 w-full h-full flex flex-col"
    >
      <div class="px-2 mt-4 text-white w-full flex flex-col">
        <!-- 生命条 -->
        <div class="hidden w-1/3 mx-auto border relative h-5">
          <div
            class="bg-red-700 h-full"
            :style="'width: ' + (stats.health / stats.maxHealth) * 100 + '%'"
          ></div>
          <!-- 生命条文字 -->
          <div class="absolute left-0 top-0 w-full flex h-full">
            <div class="self-center mx-auto text-xs truncate">
              {{ stats.health }}/{{ stats.maxHealth }}
            </div>
          </div>
        </div>
        <!-- 存活时间 -->
        <div class="self-center mx-auto text-white text-lg">
          <div class="">{{ timesStr }}</div>
        </div>
      </div>

      <!-- 魔兽世界界面 -->
      <div class="absolute left-0 top-0 w-full h-full">
        <wowPanelVue ref="wowPanelVue"></wowPanelVue>
      </div>
    </div>

    <!-- 技能或道具选择 -->
    <div
      v-show="displayCard"
      class="absolute left-0 top-0 h-full w-full flex flex-row-reverse"
    >
      <!-- 右 团队等级 -->
      <div class="w-1/4 bg-gray-900 text-white">
        <div class="mt-4">
          <div>队伍等级</div>
          <div>{{ property.level }}</div>
        </div>
        <div class="px-10">
          <div
            v-for="(item, i) in propertyList"
            :key="item"
            :index="i"
            class="w-full h-8 text-gray-200"
          >
            <div class="flex justify-between">
              <div>{{ item.title }}</div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 左 道具选择 -->
      <div class="flex-grow h-full">
        <div class="w-full h-full relative bg-black bg-opacity-50">
          <div class="pt-10 text-xl">选择加成</div>
          <div class="pt-10 text-xl">宝箱或升级</div>
          <div class="absolute bottom-24 w-full pt-72 h-full">
            <!-- 战斗卡牌 -->
            <div class="w-full h-auto flex pointer-events-none">
              <div
                class="relative w-full px-20 h-auto grid grid-cols-4 gap-10 self-top mx-auto"
              >
                <div
                  v-for="(item, i) in cardList"
                  :key="item"
                  :index="i"
                  class="w-40 h-52 p-4 bg-black bg-opacity-80 text-gray-200 pointer-events-auto cursor-pointer"
                  @click="skill(item)"
                >
                  <!-- class="w-1/3 bg-red-300 h-full text-gray-200 pointer-events-auto cursor-pointer" -->

                  <!-- style="width: 220px; height: 298px" -->
                  <div class="flex flex-col h-full relative">
                    <div class="relative mx-auto">
                      <img
                        class="w-20 h-20"
                        :class="heatValue < item.heat ? ' brightness-50 ' : ''"
                        :src="this.$uploadUVAnimUrl + item.icon"
                        alt=""
                      />
                    </div>
                    <div class="w-full text-xl mt-1">
                      {{ item.title }}{{ item.skillName }}
                    </div>
                    <div class="mt-2 text-sm w-full">
                      {{ item.describe }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-10 left-0 w-full">重新选择</div>
        </div>
      </div>
    </div>
  </div>
</template>



 
<script >
import { YJGame_roguelike } from "/@/threeJS/game/YJGame_roguelike.js";
import wowPanelVue from "./wowPanel.vue";

export default {
  props: [],
  components: {
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
      times: 0,
      timesStr: "0",
      stats: {
        health: 100,
        maxHealth: 100,
        exp: 0,
        needExp: 30,
      },
      skillList: [],
      cardList: [
        {
          title: "冰霜新星",
          dm: "[冰霜新星] 或 [b]",
          icon: "https://bkimg.cdn.bcebos.com/pic/0823dd54564e9258d109a0f4e4d6c658ccbf6c81e0d7?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080",
          describe:
            "冲击范围内的所有敌人，对它们造成99-111点冰霜伤害并将其冻结在原地，最多持续8秒。对被冻结的目标造成伤害可能打断这个效果。",
          heat: 10,
        },
      ],
      property: {},
      propertyList: [],
      displayCard: false,
    };
  },
  created() {},
  mounted() {
    // if (_Global.setting.inEditor && _Global.gameType == "Roguelike") {
    //   let _YJController_roguelike = new YJController_roguelike();
    //   _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJController_roguelike);
    //   return;
    // }

    // if(_Global.gameType == "Roguelike" ){
    //   let _YJController_roguelike = new YJController_roguelike();
    //   _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJController_roguelike);
    // }

    _Global.addEventListener("3d加载完成", () => {
      let _YJGame_roguelike = new YJGame_roguelike(this);
      _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJGame_roguelike);
    });

    _Global.addEventListener("属性改变", (basedata) => {
      this.property = basedata;

      this.propertyList = [];
      this.propertyList.push({
        title: "生命值",
        value: basedata.health + "/" + basedata.maxHealth,
      });
 
      let basicProperty = basedata.basicProperty;

      this.propertyList.push({ title: "护甲", value: basicProperty.armor });

      this.propertyList.push({
        title: "暴击率",
        value: basicProperty.CriticalHitRate,
      });
      this.propertyList.push({
        title: "暴击等级",
        value: basicProperty.CriticalHitLevel,
      });
      this.propertyList.push({
        title: "攻击速度",
        value: basicProperty.attackSpeed,
      });
      this.propertyList.push({
        title: "攻击强度",
        value: basicProperty.attackPower,
      });
      this.propertyList.push({
        title: "移动速度",
        value: basicProperty.moveSpeed,
      });
      this.propertyList.push({
        title: "急速等级",
        value: basicProperty.hasteLevel,
      });
      this.propertyList.push({
        title: "急速冷却",
        value: basicProperty.CDRate,
      });

      // console.log(" 属性改变 ",this.property);
    });

    _Global.addEventListener("显示roguelike卡牌", (cardList) => {
      this.cardList = cardList;
      this.displayCard = true;
    });

    _Global.addEventListener("存活时间", (v) => {
      this.timesStr = v;
    });

    _Global.addEventListener("主角生命值", (h, maxH) => {
      this.stats.health = h;
      this.stats.maxHealth = maxH;
    });

    // if (_Global.setting.inEditor) {
    //   return;
    // }

    // this.last = performance.now();
    // this.deltaTime = 0;
    // this.animate();

    setTimeout(() => {
      _Global.addEventListener("战斗结束", (msg) => {});
    }, 5000);
    setTimeout(() => {
      _Global.addEventListener("敌方攻势", (num) => {});
      _Global.addEventListener("战斗开始", () => {});
    }, 5000);
  },

  methods: { 
    
    //#region  聊天

    skill(item) {
      this.displayCard = false;
      _Global.applyEvent("选择roguelike卡牌", item);
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