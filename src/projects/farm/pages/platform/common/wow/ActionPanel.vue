<template>
  <div
    v-if="!isMobile"
    class="w-full h-full absolute left-0 top-0 pointer-events-none"
  >
    <!-- 主动作条 -->
    <div class="flex absolute z-10 w-full h-16 left-0 bottom-0">
      <div class="w-full mx-auto flex">
        <div class="relative mx-auto transform origin-bottom md:scale-100 flex">
          <div class="hidden md:flex transform translate-x-8 -mt-16">
            <img class="   " :src="bottomOrderUrl" alt="" />
          </div>

          <div class="h-16 flex">
            <div
              class="relative"
              style="
                width: 256px;
                height: 64px;
                background-position: 0% 64px;
                background-image: url(./public/images/cursorList/mainmenu/ui-mainmenubar-human.png);
              "
            >
              <!-- 技能动作条 -->
              <div class="absolute left-0 top-0 w-auto pl-1 mt-6 h-5 flex">
                <div
                  v-for="(item, i) in actionList.actionBar1"
                  :key="i"
                  class="flex w-9 h-9 ml-1 mr-0.5 cursor-pointer pointer-events-auto"
                >
                  <iconslotVue :item="item"></iconslotVue>
                </div>
              </div>
            </div>

            <div
              class=" "
              style="
                width: 256px;
                height: 64px;
                background-position: 0% 128px;
                background-image: url(./public/images/cursorList/mainmenu/ui-mainmenubar-human.png);
              "
            ></div>

            <div
              class=" "
              style="
                width: 256px;
                height: 64px;
                background-position: 0% 192px;
                background-image: url(./public/images/cursorList/mainmenu/ui-mainmenubar-human.png);
              "
            >
              <div class="w-64 pl-10 h-5 flex">
                <div class="relative w-8 h-16">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('player')"
                    @mouseover="
                      LookMenu('player');
                      panelState.hoverplayer = true;
                    "
                    @mouseleave="
                      outHover();
                      panelState.hoverplayer = false;
                    "
                    :src="playerHeaderUrl"
                    alt=""
                  />

                  <img
                    v-if="panelState.hoverplayer"
                    class="absolute left-0 top-0 w-8 h-16"
                    :src="btnHilightUrl"
                    alt=""
                  />

                  <div
                    class="absolute left-1.5 bottom-2 w-5 h-6 overflow-hidden"
                  >
                    <img
                      class="w-5 h-6 transform scale-150"
                      :src="playerImg"
                      alt=""
                    />
                  </div>
                </div>
                <!-- 技能 -->
                <div class="relative">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('skill')"
                    @mouseover="
                      LookMenu('skill');
                      panelState.hoverskill = true;
                    "
                    @mouseleave="
                      outHover();
                      panelState.hoverskill = false;
                    "
                    :src="panelState.skill ? skillUrl_down : skillUrl_up"
                    alt=""
                  />
                  <img
                    v-if="newLevel || panelState.hoverskill"
                    class="absolute left-0 top-0 w-8 h-16"
                    :src="btnHilightUrl"
                    alt=""
                  />
                </div>

                <!-- 任务 -->
                <div class="relative">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('taskList')"
                    @mouseover="
                      LookMenu('taskList');
                      panelState.hovertask = true;
                    "
                    @mouseleave="
                      outHover();
                      panelState.hovertask = false;
                    "
                    :src="panelState.task ? taskUrl_down : taskUrl_up"
                    alt=""
                  />
                  <img
                    v-if="panelState.hovertask"
                    class="absolute left-0 top-0 w-8 h-16"
                    :src="btnHilightUrl"
                    alt=""
                  />
                </div>

                <div class="relative">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('mainmenu')"
                    @mouseover="
                      LookMenu('mainmenu');
                      panelState.hovermainmenu = true;
                    "
                    @mouseleave="
                      outHover();
                      panelState.hovermainmenu = false;
                    "
                    :src="
                      panelState.mainmenu ? mainmenuUrl_down : mainmenuUrl_up
                    "
                    alt=""
                  />
                  <img
                    v-if="panelState.hovermainmenu"
                    class="absolute left-0 top-0 w-8 h-16"
                    :src="btnHilightUrl"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div
              class=" "
              style="
                width: 256px;
                height: 64px;
                background-position: 0% 0px;
                background-image: url(./public/images/cursorList/mainmenu/ui-mainmenubar-human.png);
              "
            >
              <div class="w-64 mt-6 h-9 flex flex-row-reverse">
                <div
                  class="flex flex-row-reverse gap-x-1.5 mr-2 w-9 h-9 bg-gray-400"
                >
                  <div class="relative">
                    <img
                      class="w-9 h-9 pointer-events-auto cursor-pointer"
                      @click="clickMenu('bagBase')"
                      @mouseover="LookSkill($event, 'bag')"
                      @mouseleave="outHover()"
                      :src="bagBaseUrl"
                      alt=""
                    />

                    <img
                      v-if="panelState.bagBase"
                      class="absolute left-0 top-0 w-9 h-9 pointer-events-none"
                      :src="bagHilightUrl"
                      alt=""
                    />
                  </div>

                  <!-- <img
                    class="w-9 h-9 pointer-events-auto cursor-pointer"
                    @click="clickMenu('bag2')"
                    :src="bag2Url"
                    alt=""
                  /> -->
                  <!-- <img
                    class="w-9 h-9 pointer-events-auto cursor-pointer"
                    @click="clickMenu('bag3')"
                    :src="bag2Url"
                    alt=""
                  />
                  <img
                    class="w-9 h-9 pointer-events-auto cursor-pointer"
                    @click="clickMenu('bag4')"
                    :src="bag2Url"
                    alt=""
                  />
                  <img
                    class="w-9 h-9 pointer-events-auto cursor-pointer"
                    @click="clickMenu('bag5')"
                    :src="bag2Url"
                    alt=""
                  /> -->
                </div>
              </div>
            </div>
          </div>

          <div class="hidden md:flex transform scalex -mt-16">
            <img :src="bottomOrderUrl" alt="" />
          </div>

          <!-- 经验条 -->
          <div class="absolute -z-10 left-0 bottom-10 flex w-full h-3">
            <div
              class="w-5/6 transform mx-auto relative h-full"
              style="width: 1024px"
            >
              <div
                class="bg-red-800 h-full border"
                :style="'width: ' + (stats.exp / stats.needExp) * 100 + '%'"
              ></div>
              <!-- 经验条文字 -->
              <div class="absolute left-0 top-0 w-full flex h-full">
                <div class="pl-2 text-xs mx-auto truncate">
                  {{ stats.exp }}/{{ stats.needExp }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="isMobile"
    class="w-full h-full absolute left-0 top-0 pointer-events-none"
  >
    <!-- 技能动作条 -->
    <div
      class="absolute right-0 bottom-10 pl-1 w-64 h-32 flex flex-wrap bg-black bg-opacity-30"
    >
      <div
        v-for="(item, i) in actionList.actionBar1"
        :key="i"
        class="flex w-9 h-9 border ml-1 mr-0.5 cursor-pointer pointer-events-auto"
      >
        <iconslotVue :item="item"></iconslotVue>
      </div>
    </div>

    <!-- 主动作条 -->
    <div class="flex absolute z-10 w-full h-20 left-0 bottom-0">
      <div class="w-full mx-auto flex">
        <div class="relative pl-6 transform origin-bottom md:scale-100 flex">
          <div class="h-16 flex">
            <div class=" ">
              <div class="w-64 h-5 flex">
                <div class="relative w-8 h-16">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('player')"
                    :src="playerHeaderUrl"
                    alt=""
                  />
                  <div
                    class="absolute left-1.5 bottom-2 w-5 h-6 overflow-hidden"
                  >
                    <img
                      class="w-5 h-6 transform scale-150"
                      :src="playerImg"
                      alt=""
                    />
                  </div>
                </div>
                <!-- 技能 -->
                <div class="relative">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('skill')"
                    :src="panelState.skill ? skillUrl_down : skillUrl_up"
                    alt=""
                  />
                </div>

                <!-- 任务 -->
                <div class="relative">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('taskList')"
                    :src="panelState.task ? taskUrl_down : taskUrl_up"
                    alt=""
                  />
                </div>

                <div class="relative">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('mainmenu')"
                    :src="
                      panelState.mainmenu ? mainmenuUrl_down : mainmenuUrl_up
                    "
                    alt=""
                  />
                </div>
                <div class="relative w-8 h-16">
                  <img
                    class="w-9 h-9 absolute left-0 bottom-0 pointer-events-auto cursor-pointer"
                    @click="clickMenu('bagBase')"
                    :src="bagBaseUrl"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 经验条 -->
    <div
      class="absolute left-0 bottom-16 w-full h-3 mx-auto transform origin-bottom md:scale-100 flex"
    >
      <div class="mx-auto flex w-1/2 h-3">
        <div
          class="w-5/6 transform mx-auto relative h-full border border-opacity-20"
          style="width: 1024px"
        >
          <div
            class="bg-red-800 h-full"
            :style="'width: ' + (stats.exp / stats.needExp) * 100 + '%'"
          ></div>
          <!-- 经验条文字 -->
          <div class="absolute left-0 top-0 w-full flex h-full">
            <div class="pl-2 text-xs mx-auto truncate">
              {{ stats.exp }}/{{ stats.needExp }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 跳跃键 -->
    <div class=" absolute right-6 bottom-48 w-12 h-12 bg-black bg-opacity-30 rounded-full flex  pointer-events-auto"
    @mouseup="Jump()"
    @touchend="Jump()"
    >
      <div class=" self-center mx-auto text-white">跳</div>
    </div>
  </div>
</template>



 
<script >
import iconslotVue from "./iconslot.vue";

export default {
  props: [],
  components: {
    iconslotVue,
  },
  data() {
    return {
      bottomOrderUrl:
        "./public/images/cursorList/mainmenu/ui-mainmenubar-endcap-human.png",
      bottomCenterUrl:
        "./public/images/cursorList/mainmenu/ui-mainmenubar-human.png",
      playerHeaderUrl:
        "./public/images/cursorList/mainmenu/ui-microbuttoncharacter-up.png",
      skillUrl_up:
        "./public/images/cursorList/mainmenu/ui-microbutton-talents-up.png",
      skillUrl_down:
        "./public/images/cursorList/mainmenu/ui-microbutton-talents-down.png",

      taskUrl_up:
        "./public/images/cursorList/mainmenu/ui-microbutton-quest-up.png",
      taskUrl_down:
        "./public/images/cursorList/mainmenu/ui-microbutton-quest-down.png",

      mainmenuUrl_up:
        "./public/images/cursorList/mainmenu/ui-microbutton-mainmenu-up.png",
      mainmenuUrl_down:
        "./public/images/cursorList/mainmenu/ui-microbutton-mainmenu-down.png",

      btnHilightUrl:
        "./public/images/cursorList/mainmenu/ui-microbutton-hilight.png",

      bagBaseUrl: "./public/images/cursorList/mainmenu/inv_misc_bag_08.png",
      bagHilightUrl:
        "./public/images/cursorList/mainmenu/ui-icon-questborder.png",
      bag2Url:
        "./public/images/cursorList/mainmenu/inv_misc_bag_enchantedmageweave.png",

      newLevel: false,

      actionList: {
        actionBar1: [
          {
            index: 0,
            skill: null,
            lockAction: true, //锁定动作栏
          },
          { index: 1, skill: null },
          { index: 2, skill: null },
          { index: 3, skill: null },
          { index: 4, skill: null },
          { index: 5, skill: null },
          { index: 6, skill: null },
          { index: 7, skill: null },
          { index: 8, skill: null },
          { index: 9, skill: null },
          { index: 10, skill: null },
          { index: 11, skill: null },
        ],
      },

      stats: {
        health: 100,
        maxHealth: 100,
        exp: 0,
        needExp: 30,
      },
      panelState: {},
      playerImg: "",
      menuData: [
        {
          type: "menu",
          name: "player",
          title: "角色信息",
          describe: "关于你的角色的各种信息，包括装备、战斗属性、技能和声望",
        },
        {
          type: "menu",
          name: "skill",
          title: "法术书",
          describe: "每升一级获得一点技能点，用来学习新技能",
        },
        {
          type: "menu",
          name: "taskList",
          title: "任务日志",
          describe: "当前接受的任务记录",
        },
        {
          type: "menu",
          name: "mainmenu",
          title: "游戏菜单",
          describe: "设置游戏画质、快捷键",
        },
      ],

      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      hoverPart: "",
      isMobile: false,
    };
  },
  created() {},
  mounted() {
    this.isMobile = _Global.isMobile;
    _Global.addEventListener("是否启用虚拟摇杆", (b) => {
      this.isMobile = b;
    });

    setTimeout(() => {
      for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
        const element = this.actionList.actionBar1[i];
        element.isDeleled = false;
        element.hoverPart = "actionBar1" + i;
      }
      for (let i = 0; i < this.actionList.actionBar1.length; i++) {
        let key = _Global.GameSetting.keyData.actionBar1[i].key;
        this.actionList.actionBar1[i].key = key;
        let keytext = _Global.GameSetting.keyData.actionBar1[i].keytext;
        if (keytext) {
        } else {
          keytext = key
            .replace("Key", "")
            .replace("Digit", "")
            .replace("Minus", "-")
            .replace("Equal", "=")
            .replace("Space", "空格键");
        }
        this.actionList.actionBar1[i].keytext = keytext;
      }

      if (_Global.ActionList) {
        for (let i = 0; i < _Global.ActionList.actionBar1.length; i++) {
          let actionBarRecode = _Global.ActionList.actionBar1[i];
          for (let j = 0; j < _Global.skillList.length; j++) {
            const skill = _Global.skillList[j];
            if (skill.skillName == actionBarRecode.skillName) {
              skill.auto = false;
              skill.isDeleled = true;
              skill.level = 0;
              skill.cCD = skill.CD;
              skill.perCD = 0;
              this.actionList.actionBar1[
                actionBarRecode.index
              ].isDeleled = true;
              this.actionList.actionBar1[actionBarRecode.index].skill = skill;
            }
          }
          if (actionBarRecode.type && actionBarRecode.type == "prop") {
            //通过id获取道具信息
            // this.actionList.actionBar1[actionBarRecode.index].skill = skill;

            for (let j = 0; j < _Global.propList.length; j++) {
              const skill = _Global.propList[j];
              if (skill.id == actionBarRecode.id) {
                this.actionList.actionBar1[
                  actionBarRecode.index
                ].isDeleled = true;
                this.actionList.actionBar1[actionBarRecode.index].skill = skill;
              }
            }
          }
          // console.log(" actionBarRecode ",actionBarRecode);
        }
      }

      this.panelState = _Global.panelState;

      _Global.addEventListener("界面开关", (e, b) => {
        this.panelState[e] = b;
      });

      _Global.addEventListener("快捷键改变", () => {
        for (let i = 0; i < this.actionList.actionBar1.length; i++) {
          let key = _Global.GameSetting.keyData.actionBar1[i].key;
          this.actionList.actionBar1[i].key = key;
          let keytext = _Global.GameSetting.keyData.actionBar1[i].keytext;
          if (keytext) {
          } else {
            keytext = key
              .replace("Key", "")
              .replace("Digit", "")
              .replace("Minus", "-")
              .replace("Equal", "=")
              .replace("Space", "空格键");
          }
          this.actionList.actionBar1[i].keytext = keytext;
        }
      });

      _Global.addEventListener("主角头像", (s) => {
        // console.log("主角头像", s);
        this.playerImg = this.$uploadUrl + s;
      });

      _Global.addEventListener("keycodeUp", (keycode) => {
        // console.log(" in action panel ", keycode);
        this.SkillGoByActionBar(keycode);
      });

      _Global.addEventListener("经验值", (c, n) => {
        this.stats.exp = c;
        this.stats.needExp = n;
      });

      _Global.addEventListener("升级", (level) => {
        this.newLevel = true;
        setTimeout(() => {
          this.newLevel = false;
        }, 2000);
      });

      _Global.addEventListener("主角死亡", () => {
        if (this.newLevel) {
          this.newLevel = false;
        }
        for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
          const element = this.actionList.actionBar1[i];
          if (element.skill && element.skill.type == "skill") {
            element.isDeleled = true;
            let skill = element.skill;
            skill.isDeleled = true;
            skill.cCD = skill.CD;
            skill.perCD = 0;
          }
        }
      });

      _Global.addEventListener("激活技能栏", () => {
        if (this.newLevel) {
          this.newLevel = false;
        }
        for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
          const element = this.actionList.actionBar1[i];
          if (
            element.skill &&
            element.skill.type == "skill" &&
            element.skill.level > 0
          ) {
            element.isDeleled = false;
            element.skill.isDeleled = false;
          }
        }
        this.$forceUpdate();
      });

      _Global.addEventListener("关闭窗口", (e) => {
        _Global.panelState[e] = false;
      });

      _Global.addEventListener("在背包中调用prop", (id, allCount) => {
        for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
          const element = this.actionList.actionBar1[i];
          if (
            element.skill &&
            element.skill.type == "prop" &&
            element.skill.id == id
          ) {
            element.skill.allCount = allCount;
            if (element.skill.allCount <= 0) {
              element.skill.isDeleled = true;
              element.isDeleled = true;
            }

            // element.skill.isDeleled = true;
            // element.isDeleled = true;
          }
        }
      });

      _Global.addEventListener("在动作条中停用prop", (id) => {
        for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
          const element = this.actionList.actionBar1[i];
          if (
            element.skill &&
            element.skill.type == "prop" &&
            element.skill.id == id
          ) {
            if (element.skill.allCount <= 0) {
              element.skill.isDeleled = true;
              element.isDeleled = true;
            }
          }
        }
      });

      _Global.addEventListener("替换动作条中prop的引用", (id, skill) => {
        for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
          const element = this.actionList.actionBar1[i];
          if (
            element.skill &&
            element.skill.type == "prop" &&
            element.skill.id == id
          ) {
            element.skill = skill;
          }
        }
      });

      _Global.addEventListener("在背包中摧毁prop", (id, allCount) => {
        for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
          const element = this.actionList.actionBar1[i];
          if (
            element.skill &&
            element.skill.type == "prop" &&
            element.skill.id == id
          ) {
            if (allCount) {
              element.skill.allCount -= allCount;
            }
            if (element.skill.allCount <= 0) {
              element.skill.isDeleled = true;
              element.isDeleled = true;
            }
          }
        }
      });

      _Global.addEventListener("在动作条中激活prop", (id, skill) => {
        for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
          const element = this.actionList.actionBar1[i];
          if (
            element.skill &&
            element.skill.type == "prop" &&
            element.skill.id == id
          ) {
            element.skill.isDeleled = false;
            element.isDeleled = false;
            element.skill = skill;
          }
        }
      });

      _Global.addEventListener("3d加载完成", () => {
        _Global._YJPlayerFireCtrl.addEventListener(
          "技能CD",
          (skillName, cCD) => {
            // console.log(" 技能CD ",skillName, cCD);
            this.changeMainPlayerSkillCD(skillName, cCD);
          }
        );

        _Global._YJPlayerFireCtrl.addEventListener(
          "技能状态",
          (skillName, msg) => {
            this.changeMainPlayerSkillState(skillName, msg);
          }
        );

        _Global._YJPlayerFireCtrl.addEventListener("添加技能", (_skill) => {
          if (this.newLevel) {
            this.newLevel = false;
          }
          this.AddSkill(_skill);
        });
        _Global._YJPlayerFireCtrl.addEventListener("移除技能", (_skill) => {
          for (let i = this.actionList.actionBar1.length - 1; i >= 0; i--) {
            const element = this.actionList.actionBar1[i];
            if (element.skill && element.skill.skillName == _skill.skillName) {
              // element.skill = null;
              element.skill.level = 0;
              element.skill.isDeleled = true;
              element.isDeleled = true;
              return;
            }
          }
        });
      });
    }, 2000);
  },

  methods: {
    Jump(){
      _Global.YJ3D.YJController.ClickJump();
    },
    saveActionList() {
      _Global.SaveActionList(this.actionList);
      // console.log("SaveActionList  ",this.actionList);
    },
    cancelDrag() {
      for (let i = 0; i < this.actionList.actionBar1.length; i++) {
        const element = this.actionList.actionBar1[i];
        element.displayKeytext = false;
      }
    },
    drag(item) {
      if (item.isDeleled) {
        item.isDeleled = false;
      }
      this.$parent.dragStart(item.skill);

      for (let i = 0; i < this.actionList.actionBar1.length; i++) {
        const element = this.actionList.actionBar1[i];
        // console.log(" 设置拖拽状态 ", element.displayKeytext);
        element.displayKeytext = true;
        if (element.index == item.index) {
          element.skill = null;
        }
      }
    },
    MouseMove(ev) {
      this.$parent.mousePos(ev.clientX, ev.clientY);
    },
    LookSkill(e, item) {
      if (item == null) {
        return;
      }

      if (item == "bag") {
        item = {
          type: "prop",
          title: "行囊",
        };
      }
      let parent = e.target;
      this.$parent.LookSkill(parent, item);
    },
    LookMenu(e) {
      for (let i = 0; i < this.menuData.length; i++) {
        const element = this.menuData[i];
        if (element.name == e) {
          this.$parent.LookActionSkill(element);
          return;
        }
      }
    },
    outHover() {
      this.hoverPart = "";
      this.$parent.outHover();
    },

    clickMenu(e) {
      if (e == "mainmenu") {
        this.panelState.bagBase = false;
        this.panelState.talk = false;
        this.panelState.task = false;
        this.panelState.player = false;
        this.panelState.skill = false;
        this.panelState.taskList = false;
        this.panelState.mainmenu = !this.panelState.mainmenu;
      } 
      // else if (this.panelState.mainmenu) {
      // } 
      else if (e == "player") {
        this.panelState.taskList = false;
        this.panelState.player = !this.panelState.player;
      } 
      else if (e == "bagBase") {
        this.panelState.bagBase = !this.panelState.bagBase;
      } 
      else if (e == "skill") {
        this.newLevel = false;
        this.panelState.taskList = false;
        this.panelState.skill = !this.panelState.skill;
      } 
      else if (e == "taskList") {
        this.panelState.player = false;
        this.panelState.skill = false;
        this.panelState[e] = !this.panelState[e];

        _Global._YJAudioManager.playAudio(
          this.panelState.taskList
            ? "1722064300006/iquestlogopena.ogg"
            : "1722064316964/iquestlogclosea.ogg"
        );
      }
      _Global.applyEvent("界面开关状态变化");
    },
    SkillGoByActionBar(keycode) {
      for (let i = 0; i < this.actionList.actionBar1.length; i++) {
        const element = this.actionList.actionBar1[i];
        if (element.key == keycode && element.skill) {
          this.UseItem(element);
          // this.$parent.UseItem(element);
          return;
        }
      }
    },

    // 动作条快捷键触发
    UseItem(item) {
      let skill = item.skill;
      if (skill.type == "prop") {
        let complted = this.$parent.UseItem(item);
        // 消耗品
        if (skill.useType == "consumables") {
          console.log(" 使用药水 ", complted, skill);
          if (complted) {
            //药水数量减- 或 药水使用完

            // 在动作条中使用时，通知在背包中物品减一
            _Global.applyEvent("在动作条中调用Prop", skill.id);

            setTimeout(() => {
              if (skill.allCount == 0) {
                skill.isDeleled = true;
                item.isDeleled = true;
              }
            }, 200);
          }
        }
        return;
      }
      // this.parent.UseItem(item);
      this.$parent.UseItem(item);
    },

    AddSkill(_skill) {
      let has = false;
      for (let i = 0; i < this.actionList.actionBar1.length; i++) {
        let skill = this.actionList.actionBar1[i].skill;
        if (skill && skill.skillName == _skill.skillName) {
          skill = _skill;
          this.actionList.actionBar1[i].isDeleled = false;
          skill.isDeleled = false;
          skill.level = 1;
          skill.auto = false;
          skill.cCD = skill.CD;
          skill.perCD = 0;
          has = true;
          // console.log("替换skill");
          this.actionList.actionBar1[i].skill = _skill;
        }
      }
      if (has) {
        return;
      }
      // 自动添加时，从左到右，第一个没有使用的动作框
      let index = -1;
      for (
        let i = 0;
        i < this.actionList.actionBar1.length && index == -1;
        i++
      ) {
        const element = this.actionList.actionBar1[i].skill;
        if (element == null) {
          index = i;
        }
      }

      _skill.level = 1;
      _skill.auto = false;
      if (_skill.target.type == "target") {
        this.actionList.actionBar1[index].hasTarget = false;
        this.actionList.actionBar1[index].outVaildDis = true;
      }
      this.actionList.actionBar1[index].skill = _skill;
      this.saveActionList();
      this.$forceUpdate();
    },
    changeMainPlayerSkillCD(skillName, cCD) {
      for (let i = 0; i < this.actionList.actionBar1.length; i++) {
        const skill = this.actionList.actionBar1[i].skill;
        if (skill && skill.skillName == skillName) {
          skill.cCD = cCD;
          skill.perCD = (skill.CD - cCD).toFixed(skill.CD > 10 ? 0 : 1);
          return;
        }
      }
    },
    changeMainPlayerSkillState(skillName, msg) {
      for (let i = 0; i < this.actionList.actionBar1.length; i++) {
        const skill = this.actionList.actionBar1[i].skill;
        if (skill && skill.skillName == skillName) {
          switch (msg.title) {
            case "设置是否有目标":
              skill.hasTarget = msg.state;
              // console.log(" 技能状态 ",skillName, msg);
              this.actionList.actionBar1[i].hasTarget = msg.state;

              break;
            case "设置是否距离太远":
              this.$nextTick(() => {
                this.actionList.actionBar1[i].outVaildDis = msg.state;
                // console.log(" 技能状态 "+msg.title,skillName, msg);
              });
              break; 
            default:
              break;
          }
          this.$forceUpdate();
          return;
        }
      }
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  /* cursor: pointer; */
  cursor: none;
}
.scalex {
  transform: translateX(-32px) scaleX(-1);
}
.centerBg {
  width: 256px;
  height: 64px;
  /* background-size: cover;  */
  /* background-repeat: no-repeat;  */
  /* background-position: center;   */
  background-position: 0% 0;
  /* background-position: 0px 64px; */
  /* background-image: url(./public/images/cursorList/ui-mainmenubar-human.png); */
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