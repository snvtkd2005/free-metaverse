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

          <div class="w-96 h-64" v-show="panelState.receiveTask">
            <taskPanel ref="taskPanel"></taskPanel>
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

      <div class="absolute left-0 top-0 flex w-full h-full">
        <!-- v-show="panelState.taskList" -->
        <taskListPanel
          ref="taskListPanel"
          :showPanel="panelState.taskList"
        ></taskListPanel>
      </div>

      <div v-show="panelState.bagBase" class="absolute left-0 top-0 w-full h-full">
        <bagPanel ref="bagPanel"></bagPanel>
      </div>

      <!-- 战斗记录 -->
      <!-- <div class="absolute left-0 top-0 w-full h-full">
        <combatLogPanel ref="combatLogPanel"></combatLogPanel>
      </div> -->

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
        :src="
          dragIcon.includes('http')
            ? dragIcon
            : this.$uploadUVAnimUrl + dragIcon
        "
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
import taskPanel from "../common/wow/taskPanel.vue";
import taskListPanel from "../common/wow/taskListPanel.vue";

import { Interface } from "../../../js/Interface_editor";
import menuPanelVue from "../common/wow/menuPanel.vue";
import GameItems from "../../../data/platform/GameItems";
import delDialogPanelVue from "../common/wow/delDialogPanel.vue";
import settingPanelVue from "../common/wow/settingPanel.vue";

import GameSetting from "../../../data/platform/GameSetting";
import equipItems from "../../../data/platform/EquipItems";

export default {
  props: [],
  components: {
    combatLogPanel,
    buffPanel,
    ActionPanelVue,
    PlayerPropertyPanelVue,
    skillPanel,
    taskListPanel,
    bagPanel,
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
      hoverTop: false,
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
              // 如果有选中的目标，返回
              if (_Global.hasTarget) {
                _Global._SceneManager.ClearTarget();
                return;
              }
              if (!has) {
                setTimeout(() => {
                  _Global.applyEvent("界面开关", "mainmenu", true);
                }, 20);
              }
            } else {
              this.$refs.ActionPanelVue.clickMenu(element.field);
              // _Global.applyEvent(
              //   "界面开关",
              //   element.field,
              //   !this.panelState[element.field]
              // );
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

      _Global.addEventListener("主角生命值", (h, maxH) => {
        this.stats.health = h;
        this.stats.maxHealth = maxH;
      });

      _Global.addEventListener("点击三维页", () => {
        this.cancelDrag("左键点击三维页");
      });
      _Global.addEventListener("右键点击", () => {
        this.cancelDrag("右键点击");
      });
      _Global.addEventListener("从动作条拖拽到动作条", () => {
        this.cancelDrag("从动作条拖拽到动作条"); 
      });
      _Global.addEventListener("从角色面板拖拽到动作条", () => {
        this.cancelDrag("从角色面板拖拽到动作条"); 
      });
      _Global.addEventListener("从角色面板拖拽到背包", () => {
        this.cancelDrag("从角色面板拖拽到背包");
      });

      _Global.addEventListener("从背包拖拽到动作条", () => {
        this.cancelDrag("从背包拖拽到动作条"); 
      });
      _Global.addEventListener("从背包拖拽到背包", () => {
        this.cancelDrag("从背包拖拽到背包"); 
      });
      _Global.addEventListener("从背包拖拽到角色面板", () => {
        this.cancelDrag("从背包拖拽到角色面板"); 
      });
      _Global.addEventListener("取消拖拽Prop", () => {
        this.cancelDrag("取消拖拽Prop");
      });

      _Global.addEventListener("摧毁拖拽Prop", () => {
        this.cancelDrag("摧毁拖拽Prop"); 
      });

      // _Global.panelState.receiveTask = true;
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
    cancelDrag(e) {
      console.log(e);
      if (_Global.inDragAction) {
        this.$refs.ActionPanelVue.cancelDrag(e);
      }
      if (_Global.inDragProp) {
        this.$refs.bagPanel.cancelDrag(e);
      }
      if (_Global.inDragEquip) {
        this.$refs.PlayerPropertyPanelVue.cancelDrag(e);
      }

      if (e == "左键点击三维页") {
        // 扔丢道具，打开扔道具确认框
        if (_Global.inDragProp || _Global.inDragEquip) {
          this.delDialog = true;
          return;
        }
      }
      if (e == "右键点击") {
        if (this.delDialog) {
          this.delDialog = false;
        }
      }
      if (e == "从动作条拖拽到动作条") {
      }
      if (e == "从角色面板拖拽到动作条") {
      }

      if (_Global.inDragAction || _Global.inDragEquip || _Global.inDragProp) {
        _Global.inDragAction = false;
        _Global.inDragEquip = false;
        _Global.inDragProp = false;
        //取消拖拽
        this.dragEnd();
      }
    },
    mousePos(x, y) {
      this.dragPos.x = x;
      this.dragPos.y = y;
    },
    dragStart(item) {
      this.inDraging = true;
      this.dragIcon = item.icon;
      this.dragSkill = item;
    },
    dragStartItem(item) { 
      this.dragItem = item;
    },
    dragEnd(item) {
      this.inDraging = false;
      this.dragSkill = null;
      this.dragItem = null;
      _Global.dragPart = "";
      this.$refs.ActionPanelVue.saveActionList();
    },

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

    GetDescribe(item, level) {
      let describe = "";

      if (item.trigger.type == "health") {
        // describe += "自动攻击时，当生命达到" + item.trigger.value + "%时，";
      }
      if (item.trigger.type == "perSecond") {
        // describe += "自动攻击时，每" + item.trigger.value + "秒，";
      }

      if (this.inPlayerSkillEditor) {
        // 玩家技能都是点击技能图标触发的
        describe = "";
      }
      let targetCamp = "友方";
      if (item.effect.type.toLowerCase().includes("damage")) {
        targetCamp = "敌方";
      }

      let targetValue = item.target.value;
      if (item.hasTargetLv && item.targetLv && item.targetLv.length > 1) {
        targetValue = item.targetLv[level];
      }

      if (item.target.type == "none" || item.target.type == "self") {
        describe += "自身";
      }
      if (item.target.type == "random") {
        describe += "对随机最多" + targetValue + "个" + targetCamp + "目标";
      }

      if (item.target.type == "target") {
        describe += "对当前目标";
      }
      if (item.target.type == "area") {
        describe +=
          "对半径" + item.vaildDis + "米范围内最多" + targetValue + "个目标";
      }

      if (item.target.type == "minHealthFriendly") {
        describe += "对生命值最少的友方";
      }

      if (item.effect.type == "evolution") {
        describe += ",所有技能造成的伤害提高" + item.effect.value + "%";
      }
      if (item.effect.type == "hyperplasia") {
        describe += ",生成" + item.effect.value + "个镜像";
      }

      if (item.effect.type == "contDamage") {
        describe +=
          ",每" +
          item.effect.time +
          "秒造成" +
          item.effect.value +
          "点伤害，持续" +
          item.castTime +
          "秒";
      }

      if (item.effect.type == "damage") {
        describe += ",造成" + item.effect.value + "点伤害";
      }
      if (item.effect.type == "addHealth") {
        describe += ",恢复" + item.effect.value + "点生命值";
      }

      if (item.effect.type == "perDamage") {
        let effectdes =
          "每" +
          item.effect.time +
          "秒造成" +
          item.effect.value +
          "点伤害，持续" +
          item.effect.duration +
          "秒";
        item.effect.describe = effectdes;
        describe += "," + effectdes;
      }
      if (item.effect.type == "control") {
        describe += "施放控制" + item.effect.controlId;
      }

      if (item.effect.type == "shield") {
        let effectdes = "吸收" + item.effect.value + "点伤害";
        describe +=
          "施放" +
          item.effect.controlId +
          "。" +
          effectdes +
          "，持续" +
          item.effect.duration +
          "秒";
        item.effect.describe = effectdes;
      }
      return describe;
    },

    GetColor(qualityType) {
      switch (qualityType) {
        case "none":
          return "#666666";

          break;
        case "normal":
          return "#ffffff";
          break;
        case "unnormal":
          return "#1eff00";

          break;
        case "rare":
          return "#0070dd";

          break;
        case "epic":
          return "#a335ee";

          break;
        case "legendary":
          return "#a335ee";

          break;

        default:
          break;
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
          line.color = this.GetColor(qualityType);
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
            line.text2 = "速度" + speed.toFixed(1);
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
            : this.GetDescribe(item, item.level - 1);
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
          line.text = this.GetDescribe(item, item.level);
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

      if (item.hoverPart == "buff") {
        line.text = item.skillName;
        line.color = "#ffff00";
        this.hoverData.push(line);

        line = {};
        line.text = item.describe;
        line.color = "#ffffff";
      }

      this.hoverData.push(line);
      if (parent == null) {
        return;
      }
      var rect = parent.getBoundingClientRect();

      // console.log("Top: " + rect.top);
      // console.log("Left: " + rect.left);
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
        this.newDiv.style.top = parseInt(rect.top) + offsetY + "px";
        this.newDiv.style.left = parseInt(rect.left) + offsetX + "px";
        this.newDiv.style.opacity = 1;
      });

      this.$refs.hoverParentRef.appendChild(this.newDiv);
      this.inHover = true;
    },
    rightClick() {},
    outHover() {
      if (this.newDiv) {
        this.inHover = false;
        this.newDiv.style.display = "none";
      }
      _Global.hoverPart = "";
    },
    UseItem(item) { 
      
      if (item.isDeleled) {
        return false;
      }
      let skill = item.skill;
      // console.log(" 主动施放技能 000",skill);
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

      if (skill.type == "equip") {
        return _Global._YJPlayerFireCtrl.GetEquip().WearEquip(skill);
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