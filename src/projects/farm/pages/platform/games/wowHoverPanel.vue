
<template>
  <div class="w-full h-full absolute z-9999 left-0 top-0 pointer-events-none">
    <div
      v-show="displayCard"
      class="absolute left-0 top-0 w-full h-full flex flex-col"
    >
      <!-- 技能面板 -->
      <div class="absolute left-0 bottom-0 w-full h-full">
        <div class="flex ml-20 gap-x-16">
          <div class="w-96 h-64" v-show="panelState.skill">
            <skillPanel ref="skillPanel"></skillPanel>
          </div>

          <div class="w-96 h-64" v-show="panelState.task">
            <taskPanel ref="taskPanel"></taskPanel>
          </div>

          <div class="w-96 h-64" v-show="panelState.shop">
            <shopPanel ref="shopPanel"></shopPanel>
          </div>

          <div class="w-96 h-64" v-show="panelState.talk">
            <talkPanel ref="talkPanel"></talkPanel>
          </div>

          <div class="w-96 h-64" v-show="panelState.player">
            <PlayerPropertyPanelVue
              ref="PlayerPropertyPanelVue"
            ></PlayerPropertyPanelVue>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮信息框 -->
    <div
      ref="hoverContent"
      v-show="inHover"
      class="absolute z-50 transform origin-bottom-left mt-3 -ml-2 left-0 top-0 min-wh w-auto h-auto flex pointer-events-none"
      :class="[
        hoverRight
          ? inRightOrder
            ? ' -translate-x-6'
            : ' -translate-x-full '
          : '',
        hoverTop ? '  ' : ' -translate-y-full ',
      ]"
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

      <div class="mx-auto text-left p-4 w-auto tracking-widest">
        <div
          v-for="(item, i) in hoverData"
          :key="i"
          class="flex self-center mx-auto w-auto gap-x-10 justify-between"
          :style="'color:' + item.color + ';'"
          :class="i == 0 ? ' text-base font-bold' : 'text-sm font-medium '"
        >
          <div>{{ item.text }}</div>
          <div
            v-if="item.text2"
            class="  "
            :style="'color:' + (item.color2 ? item.color2 : item.color) + ';'"
          >
            {{ item.text2 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮信息的父物体 -->
    <div ref="hoverParentRef" class="absolute left-0 bottom-0 w-full h-full"></div>
  
  </div>
</template>

 

 
<script >
import combatLogPanel from "../common/combatLogPanel.vue";
import buffPanel from "../common/wow/buffPanel.vue";
import ActionPanelVue from "../common/wow/ActionPanel.vue";
import PlayerPropertyPanelVue from "../common/wow/PlayerPropertyPanel.vue";
import skillPanel from "../common/wow/skillPanel.vue";
import shopPanel from "../common/wow/shopPanel.vue";
import bagPanel from "../common/wow/bagPanel.vue";
import talkPanel from "../common/wow/talkPanel.vue";
import taskPanel from "../common/wow/taskPanel.vue";
import taskListPanel from "../common/wow/taskListPanel.vue";

import { Interface } from "../../../js/Interface_editor";
import menuPanelVue from "../common/wow/menuPanel.vue";
import GameItems from "../../../data/platform/GameItems";
import delDialogPanelVue from "../common/wow/delDialogPanel.vue";
import settingPanelVue from "../common/wow/settingPanel.vue";

import GameSetting from "../../../data/platform/GameSetting";
import equipItems from "../../../data/platform/EquipItems";
import * as GameUtils from '/@/utils/utils_game.js';

export default {
  props: [],
  components: {
    combatLogPanel,
    buffPanel,
    ActionPanelVue,
    PlayerPropertyPanelVue,
    skillPanel,
    shopPanel,
    taskListPanel,
    bagPanel,
    talkPanel,
    taskPanel,
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

      displayCard: true,
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
      hoverTop: false,
      dragPos: { x: 0, y: 0 },
      inDraging: false,
      dragIcon: "",
      delDialog: false,
      hoverOffsetPos: { x: 0, y: 0 }, //编辑模式悬浮偏移要让开顶部高度和检视面板宽度

      hasCuror: true,
      mouseX: 0,
      mouseY: 0,
      curorIcon: "./public/images/cursorList/ui-tutorialframe-glovecursor.png",
    };
  },
  created() {},
  mounted() {
    // new Interface(this, true);
    if (_Global.isMobile) {
      this.hasCuror = false;
    }

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

      _Global.addEventListener("预览打开", (e, item) => {
        // console.log(" 预览打开 ", e, item);
        this.panelState.task = false;
        this.displayCard = true;
        if (e == "任务") {
          this.panelState.task = true;
          this.$nextTick(() => {
            this.$refs.taskPanel.directTaskData(item);
          });
        }
        if (e == "道具或装备") { 
          this.LookSkill(null,item);
        }
      });

      _Global.addEventListener("预览关闭", (e) => {
        this.displayCard = false;
        if (e == "任务") {
          this.panelState.task = false;
        }
        if (e == "道具或装备") { 
          this.outHover();
        }
      });
    }, 2000);
  },

  methods: { 
    LookActionSkill(item) {
      this.LookSkill(this.$refs.rightbottomPosRef, item);
    },
    getGameItemsLabel(type, value) {
      // console.log(type,value,);
      let typeValues = GameItems[type];
      for (let i = 0; i < typeValues.length; i++) {
        const element = typeValues[i];
        if (element.value == value) {
          return element.label;
        }
      }
    },
    getequipItemsLabel(type, value) {
      // console.log(type,value,);
      let typeValues = equipItems[type];
      for (let i = 0; i < typeValues.length; i++) {
        const element = typeValues[i];
        if (element.value == value) {
          return element.label;
        }
      }
    },

    LookSkill(parent, item) {
      if (_Global.isMobile) {
        if (_Global.hoverPart.includes("action")) {
          return;
        }
      }
      // console.log(" hover ", item);
      this.hoverData = [];
      let line = {}; 
      if (item.type == "equip") {
        if (item.name) {
          let {
            name,
            qualityType,
            weaponType,
            part,
            pickType,
            pointType,
            strength,
            speed,
            propertyList,
          } = item;
          // console.log(" hover equip ", item);
          line.text = name;
          
          line.color = GameUtils.GetColor(qualityType);
          this.hoverData.push(line);

          if (pointType == "weapon") {
            // 武器
            line = {};
            line.text = this.getequipItemsLabel("pickType", part);
            line.text2 = this.getequipItemsLabel("weaponType", weaponType);
            line.color = "#ffffff";
            this.hoverData.push(line);

            line = {};
            line.text = strength + " 伤害";
            if (speed) {
              line.text2 = "速度" + speed.toFixed(1);
            }
            line.color = "#ffffff";
            this.hoverData.push(line);
          } else {
            // 装备
            line = {};
            line.text = this.getequipItemsLabel("partType", part);
            line.color = "#ffffff";
            this.hoverData.push(line);
          }

          if (propertyList && propertyList.length > 0) {
            for (let i = 0; i < propertyList.length; i++) {
              const element = propertyList[i];
              if (element.property == "armor") {
                line = {};
                line.text =
                  element.value +
                  "点" +
                  this.getequipItemsLabel("propertyType", element.property);
                line.color = "#ffffff";
                this.hoverData.push(line);
              } else {
                line = {};
                line.text =
                  "+" +
                  element.value +
                  " " +
                  this.getequipItemsLabel("propertyType", element.property);
                line.color = "#ffffff";
                this.hoverData.push(line);
              }
            }
          }

          line = {};
          line.text = "耐久度 50/50";
          line.color = "#ffffff";
          this.hoverData.push(line);

          line = {};
          line.text = "需要等级 1";
          line.color = "#ffffff";
          // this.hoverData.push(line);
        } else {
          if (!item.used) {
            line.color = "#ffd100";
          }
          line.text = item.text;
        }
      }
      if (item.type == "skill") {
        // 是可升级的技能
        let isUpSkill =
          item.hasTargetLv && item.targetLv && item.targetLv.length > 1;
        let hoverskill = _Global.hoverPart.includes("skill");
        let hoveraction = _Global.hoverPart.includes("action");
        line.text = item.skillName;
        if (isUpSkill && hoveraction) {
          line.text2 = "等级" + item.level;
          line.color2 = "#666666";
        }
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
        line.text =
          item.level <= 1
            ? item.describe
            : GameUtils.GetDescribe(item, item.level - 1);
        line.color = "#ffff00";

        if (
          hoverskill &&
          item.level >= 1 &&
          item.hasTargetLv &&
          item.targetLv &&
          item.targetLv.length > 1 &&
          item.level < item.targetLv.length
        ) {
          this.hoverData.push(line);

          line = {};
          line.text = "下一级：";
          line.color = "#ffffff";
          this.hoverData.push(line);

          line = {};
          line.text = GameUtils.GetDescribe(item, item.level);
          line.color = "#ffff00";
        }
      }
      if (item.type == "prop") {
        line.text = item.title || item.name;
        line.color = "#ffffff";
        this.hoverData.push(line);

        if (item.qualityType) {
          line = {};
          line.text = this.getGameItemsLabel("qualityType", item.qualityType);
          line.color = "#ffffff";
          this.hoverData.push(line);
        }

        if (item.bindingType) {
          line = {};
          line.text = this.getGameItemsLabel("bindingType", item.bindingType);
          line.color = "#ffffff";
          this.hoverData.push(line);
        }

        if (item.countType && item.countType == "onlyone") {
          line = {};
          line.text = this.getGameItemsLabel("countType", item.countType);
          line.color = "#ffffff";
          this.hoverData.push(line);
        }

        line = {};
        line.text = item.describe;
        line.color = "#00ff00";
      }
 
      this.hoverData.push(line); 
      var rect = {
        top:783,left:40
      } 
 
      // 默认悬浮框出现在icon右上
      // icon在右边时，悬浮框出现在icon左上
      this.hoverRight = rect.left > window.innerWidth - 300;
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


        this.newDiv.style.left = parseInt(rect.left) + offsetX -this.hoverOffsetPos.x+ "px";
        this.newDiv.style.top = parseInt(rect.top) + offsetY -this.hoverOffsetPos.y+ "px";
        this.newDiv.style.opacity = 1;
      });

      this.$refs.hoverParentRef.appendChild(this.newDiv);
      this.inHover = true;
    }, 
    outHover() {
      // return;
      if (this.newDiv) {
        this.inHover = false;
        this.newDiv.style.display = "none";
      }
      _Global.hoverPart = "";
    }, 
  },
};
</script>  
<style scoped>
.z-9999{
  z-index: 9999;
}
.cursor-pointer {
  /* cursor: pointer; */
  cursor: none;
}
.min-wh {
  min-width: 80px;
  max-width: 330px;
} 
</style>