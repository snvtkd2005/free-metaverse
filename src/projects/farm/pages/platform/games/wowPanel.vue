<template>
  <div class="w-full h-full absolute left-0 top-0 pointer-events-none">
    <div
      v-show="!displayCard"
      class="absolute left-0 top-0 w-full h-full flex flex-col"
    >
      <!-- 动作条 -->
      <div class="absolute left-0 top-0 w-full h-full">
        <ActionPanelVue ref="ActionPanelVue"></ActionPanelVue>
      </div>

      <!-- 技能面板 -->
      <div class="absolute left-0 top-0 w-full h-full">
        <div class="flex ml-20 gap-x-16">
          <div class="w-96 h-64" v-show="panelState.skill">
            <skillPanel ref="skillPanel"></skillPanel>
          </div>
          <div class="w-96 h-64" v-show="panelState.player">
            <PlayerPropertyPanelVue
              ref="PlayerPropertyPanelVue"
            ></PlayerPropertyPanelVue>
          </div>
        </div>
      </div>
      <div class="absolute left-0 top-0 flex w-full h-full">
        <div class="w-96 h-64 mx-auto" v-show="panelState.mainmenu">
          <menuPanelVue ref="menuPanelVue"></menuPanelVue>
        </div>
      </div>

      <div v-show="panelState.bag" class="absolute left-0 top-0 w-full h-full">
        <bagPanel ref="bagPanel"></bagPanel>
      </div>

      <!-- 战斗记录 -->
      <div class="absolute left-0 top-0 w-full h-full">
        <combatLogPanel ref="combatLogPanel"></combatLogPanel>
      </div>

      <!-- buff 和 debuff -->
      <div class="absolute left-0 top-0 w-full h-full">
        <buffPanel ref="buffPanel"></buffPanel>
      </div>
      <div v-if="delDialog" class="absolute left-0 top-0 w-full h-full">
        <delDialogPanelVue ref="delDialogPanelVue"></delDialogPanelVue>
      </div>

      <div
        v-if="panelState.setting"
        class="absolute left-0 top-0 w-full h-full"
      >
        <settingPanelVue ref="settingPanelVue"></settingPanelVue>
      </div>
    </div>

    <!-- 悬浮信息框 -->
    <div
      ref="hoverContent"
      v-show="inHover"
      class="absolute z-50 transform origin-bottom-left mt-3 -ml-2  left-0 top-0 min-wh w-auto h-auto flex pointer-events-none"
      :class="
        [hoverRight
          ? inRightOrder
            ? ' -translate-x-6'
            : ' -translate-x-full '
          : '',hoverTop?'  ':' -translate-y-full ']
      "
      style="
        border: 10px solid;
        border-image-source: url(./public/images/cursorList/mainmenu/ui-quickslot2.png);
        border-image-slice: 20 20 20 20 fill;
        border-image-width: 20px 20px 20px 20px;
        border-image-repeat: repeat;
      "
    >
      <div class="absolute left-0 top-0 -z-10 w-full h-full">
        <div class="p-1 w-full h-full">
          <div class="w-full h-full bg-black bg-opacity-90 rounded-sm"></div>
        </div>
      </div>

      <div class="mx-auto text-left p-4 tracking-widest">
        <div
          v-for="(item, i) in hoverData"
          :key="i"
          class="flex self-center mx-auto justify-between"
          :style="'color:' + item.color + ';'"
          :class="i == 0 ? ' text-base ' : 'text-sm '"
        >
          <div>{{ item.text }}</div>
          <div>{{ item.text2 }}</div>
        </div>
      </div>
    </div>

    <!-- 悬浮信息的父物体 -->
    <div ref="hoverParentRef" class="absolute left-0 top-0 w-full h-full"></div>

    <!-- 按钮信息在右下角显示的参考位置 -->
    <div
      ref="rightbottomPosRef"
      class="absolute right-44 bottom-32 w-2 h-2 pointer-events-none"
    ></div>

    <div
      v-show="inDraging"
      ref="dragItemRef"
      class="absolute z-50 left-0 top-0 w-9 h-9"
      :style="'left:' + dragPos.x + 'px;' + 'top:' + dragPos.y + 'px;'"
    >
      <img
        class="w-full h-full"
        :src="this.$uploadUVAnimUrl + dragIcon"
        alt=""
      />
    </div>
  </div>
</template>


<!--超远距离宏 /console cameraDistanceMaxZoomFactor 4 -->

 
<script >
import combatLogPanel from "../common/combatLogPanel.vue";
import buffPanel from "../common/wow/buffPanel.vue";
import ActionPanelVue from "../common/wow/ActionPanel.vue";
import PlayerPropertyPanelVue from "../common/wow/PlayerPropertyPanel.vue";
import skillPanel from "../common/wow/skillPanel.vue";
import bagPanel from "../common/wow/bagPanel.vue";

import { Interface } from "../../../js/Interface_editor";
import menuPanelVue from "../common/wow/menuPanel.vue";
import GameItems from "../../../data/platform/GameItems";
import delDialogPanelVue from "../common/wow/delDialogPanel.vue";
import settingPanelVue from "../common/wow/settingPanel.vue";

import GameSetting from "../../../data/platform/GameSetting";

export default {
  props: [],
  components: {
    combatLogPanel,
    buffPanel,
    ActionPanelVue,
    PlayerPropertyPanelVue,
    skillPanel,
    bagPanel,
    menuPanelVue,
    delDialogPanelVue,
    settingPanelVue,
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
      stats: {
        health: 100,
        maxHealth: 100,
        exp: 0,
        needExp: 30,
      },

      property: {},
      propertyList: [],
      displayCard: false,
      panelState: {},

      hoverbgUrl: "./public/images/cursorList/mainmenu/ui-quickslot2.png",

      hoverData: [
        {
          text: "手部",
        },
      ],
      inHover: false,
      hoverRight: false,
      inRightOrder: false,
      hoverTop:false,
      dragPos: { x: 0, y: 0 },
      inDraging: false,
      dragIcon: "",
      delDialog: false,
    };
  },
  created() {},
  mounted() {
    // new Interface(this, true);
    if (this.newDiv == null) {
      this.newDiv = document.createElement("div");
    }
    this.newDiv.style = `
      position:absolute;
      right:-4px;
      top:-4px; 
      // width:4px; 
      // height:4px;
      // background-color:#9ca3af
      `;

    setTimeout(() => {
      this.panelState = _Global.panelState;

      _Global.addEventListener("界面开关", (e, b) => {
        this.panelState[e] = b;
      });

      _Global.addEventListener("keycodeUp", (keycode) => {
        // 按键在配置中设置
        for (let i = 0; i < GameSetting.keyData.panel.length; i++) {
          const element = GameSetting.keyData.panel[i];
          if (element.key == keycode) {
            if (element.field == "mainmenu") {
              if (_Global.inDragProp) {
                if (this.delDialog) {
                  this.delDialog = false;
                }
                _Global.applyEvent("取消拖拽Prop");
                _Global.inDragProp = false;
                return;
              }
              //关闭全部打开的窗口
              let names = Object.getOwnPropertyNames(this.panelState);
              let has = false;
              for (let i = 0; i < names.length; i++) {
                const element = names[i];
                if (this.panelState[element]) {
                  has = true;
                  _Global.applyEvent("界面开关", element, false);
                }
              }
              if (!has) {
                setTimeout(() => {
                  _Global.applyEvent("界面开关", "mainmenu", true);
                }, 20);
              }
            } else {
              _Global.applyEvent(
                "界面开关",
                element.field,
                !this.panelState[element.field]
              );
            }
          }
        }
      });

      // if (_Global.setting.inEditor && _Global.gameType == "Roguelike") {
      //   let _YJController_roguelike = new YJController_roguelike();
      //   _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJController_roguelike);
      //   return;
      // }

      // if(_Global.gameType == "Roguelike" ){
      //   let _YJController_roguelike = new YJController_roguelike();
      //   _Global.YJ3D._YJSceneManager.AddNeedUpdateJS(_YJController_roguelike);
      // }
      _Global.YJ3D.YJRaycaster.addEventListener("mousePos", (x, y) => {
        this.dragPos.x = (0.5 + x / 2) * window.innerWidth;
        this.dragPos.y = (0.5 - y / 2) * window.innerHeight;
        // console.log("mousePos ",this.dragPos.x,this.dragPos.y);
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

      _Global.addEventListener("主角生命值", (h, maxH) => {
        this.stats.health = h;
        this.stats.maxHealth = maxH;
      });
    }, 2000);

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
    mousePos(x, y) {
      this.dragPos.x = x;
      this.dragPos.y = y;
    },
    dragStart(item) {
      this.inDraging = true;
      this.dragIcon = item.icon;
      this.dragSkill = item;
    },
    dragEnd(item) {
      this.inDraging = false;
      this.dragSkill = null;
      _Global.hoverPart = "";
      this.$refs.ActionPanelVue.saveActionList();
    },

    LookActionSkill(item) {
      this.LookSkill(this.$refs.rightbottomPosRef, item);
    },
    getGameItesLabel(type, value) {
      // console.log(type,value,);
      let typeValues = GameItems[type];
      for (let i = 0; i < typeValues.length; i++) {
        const element = typeValues[i];
        if (element.value == value) {
          return element.label;
        }
      }
    },
    LookSkill(parent, item) {
      // console.log(" hover ", item);
      this.hoverData = [];
      let line = {};
      if (item.type == "menu") {
        line.text = item.title;
        line.color = "#ffffff";
        this.hoverData.push(line);

        line = {};
        line.text = item.describe;
        line.color = "#ffff00";
      }

      if (item.type == "equid") {
        if (!item.used) {
          line.color = "#ffff00";
        }
        line.text = item.text;
      }
      if (item.type == "skill") {
        line.text = item.skillName;
        line.color = "#ffffff";
        this.hoverData.push(line);

        line = {};
        line.text = "0-" + item.vaildDis + "米距离";
        line.color = "#ffffff";
        this.hoverData.push(line);

        line = {};
        line.text =
          item.castTime == 0 ? "瞬发法术" : item.castTime + "秒施法时间";
        line.text2 = item.CD + "秒冷却时间";
        line.color = "#ffffff";
        this.hoverData.push(line);

        line = {};
        line.text = item.describe;
        line.color = "#ffff00";
      }
      if (item.type == "prop") {
        line.text = item.title || item.name;
        line.color = "#ffffff";
        this.hoverData.push(line);

        if (item.qualityType) {
          line = {};
          line.text = this.getGameItesLabel("qualityType", item.qualityType);
          line.color = "#ffffff";
          this.hoverData.push(line);
        }

        if (item.bindingType) {
          line = {};
          line.text = this.getGameItesLabel("bindingType", item.bindingType);
          line.color = "#ffffff";
          this.hoverData.push(line);
        }

        if (item.countType && item.countType == "onlyone") {
          line = {};
          line.text = this.getGameItesLabel("countType", item.countType);
          line.color = "#ffffff";
          this.hoverData.push(line);
        }

        line = {};
        line.text = item.describe;
        line.color = "#00ff00";
      }

      if (item.hoverPart == "buff") {
        
        line.text = item.skillName;
        line.color = "#ffff00";
        this.hoverData.push(line);
        
        line = {};
        line.text = item.describe;
        line.color = "#ffffff";

      }

      this.hoverData.push(line);

      var rect = parent.getBoundingClientRect();

      // console.log("Top: " + rect.top);
      // console.log("Left: " + rect.left);
      // 默认悬浮框出现在icon右上
      // icon在右边时，悬浮框出现在icon左上
      this.hoverRight = rect.left > (window.innerWidth - 300) ;
      // icon在右上角时，悬浮框出现在icon左下
      this.hoverTop = this.hoverRight && rect.top < window.innerHeight / 2;
      this.inRightOrder = false;
      let offsetX = this.hoverRight ? 20 : 40;
      let offsetY = this.hoverTop ? 20 : 0;

      // console.log(" hoverTop : " + this.hoverTop);

      this.newDiv.appendChild(this.$refs.hoverContent);
      this.newDiv.style.display = "";
      this.newDiv.style.opacity = 0;

      this.$nextTick(() => {
        let rect2 = this.$refs.hoverContent.clientWidth;
        if (rect.left > window.innerWidth - rect2) {
          offsetX -= rect2;
          this.inRightOrder = true;
        }
        this.newDiv.style.top = parseInt(rect.top) + offsetY + "px";
        this.newDiv.style.left = parseInt(rect.left) + offsetX + "px";
        this.newDiv.style.opacity = 1;
      });

      this.$refs.hoverParentRef.appendChild(this.newDiv);
      this.inHover = true;
    },
    outHover() {
      if (this.newDiv) {
        this.inHover = false;
        this.newDiv.style.display = "none";
      }
    },
    UseItem(item) {
      if (item.isDeleled) {
        return false;
      }
      let skill = item.skill;
      console.log(" 主动施放技能 000",skill);
      if (skill.type == "skill" && skill.cCD == skill.CD) {
        _Global._YJPlayerFireCtrl.GetSkill().UseSkill(skill);
        return;
      }
      if (skill.type == "prop") {
        if (skill.CD > 0) {
          if (skill.cCD < skill.CD) {
            return;
          }
        } else {
        }
        return _Global._YJPlayerFireCtrl.GetProp().UseProp(skill);
      }
    },

    setDMPlayer(_dmplayer) {
      this.dmPlayer = _dmplayer;
    },

    AddSkill(_skill) {
      this.$refs.ActionPanelVue.AddSkill(_skill);
    },
    changeDMPlayerSkillCD(npcId, skillIndex, cCD) {
      for (let i = 0; i < this.dmPlayer.length; i++) {
        const element = this.dmPlayer[i];
        if (element.npcId == npcId) {
          element.skill[skillIndex].cCD = cCD;
          element.skill[skillIndex].perCD = (
            element.skill[skillIndex].CD - cCD
          ).toFixed(element.skill[skillIndex].CD > 10 ? 0 : 1);
        }
      }
    },
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

<!-- <style lang="scss" scoped>

.hoverBg {
  $l_w: 10px;
  $r_w: 10px;
  $t_h: 10px;
  $b_h: 10px;
  min-width: calc(#{$l_w} + #{$r_w});
  min-height: calc(#{$t_h} + #{$b_h});
  background-repeat: no-repeat;
  background-position: left top, $l_w top, right top, left $t_h, $l_w $t_h,
    right $t_h, left bottom, $l_w bottom, right bottom;

  background-size: $l_w $t_h, calc(100% - #{$l_w} - #{$r_w}) $t_h, $r_w $t_h,
    $l_w calc(100% - #{$t_h} - #{$b_h}),
    calc(100% - #{$l_w} - #{$r_w}) calc(100% - #{$t_h} - #{$b_h}),
    $r_w calc(100% - #{$t_h} - #{$b_h}), $l_w $b_h,
    calc(100% - #{$l_w} - #{$r_w}) $b_h, $r_w $b_h;
  background-image: url(./public/images/cursorList/mainmenu/ui-quickslot2.png);
}

</style> -->
<style scoped>
.min-wh {
  min-width: 80px;
  max-width: 330px;
}
.nine-patch {
  width: 200px; /* 设置容器的宽度 */
  height: 100px; /* 设置容器的高度 */
  /* background-image: url(./public/images/cursorList/mainmenu/ui-quickslot2.png); 设置点九图资源 */
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中显示 */
  /* border: 1px solid #000;  */
}
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