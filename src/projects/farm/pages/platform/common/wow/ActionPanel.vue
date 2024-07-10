<template>
  <div class="w-full h-full absolute left-0 top-0 pointer-events-none">
    <!-- 主动作条 -->
    <div class="flex absolute z-10 w-full h-16 left-0 bottom-2">
      <div class="w-5/6 mx-auto flex">
        <div class="mx-auto transform scale-125 flex">
          <div class="transform translate-x-8 -mt-16 flex">
            <img class="   " :src="bottomOrderUrl" alt="" />
          </div>

          <div class="h-16 flex">
            <div
              class=""
              style="
                width: 256px;
                height: 64px;
                background-position: 0% 64px;
                background-image: url(./public/images/cursorList/mainmenu/ui-mainmenubar-human.png);
              "
            >
              <!-- 技能动作条 -->
              <div class="w-64 pl-1 mt-6 h-5 flex">
                <div
                  v-for="(item, i) in skillList"
                  :key="i"
                  class="flex w-9 h-9 ml-1 mr-0.5 cursor-pointer pointer-events-auto"
                >
                  <div
                    class="bg-gray-500 relative"
                    @contextmenu.prevent="onContextMenu($event, item)"
                    @click="clickSkill($event, item)"
                    @mouseover="LookActionSkill($event, item)"
                    @mouseleave="outHover()"
                  >
                    <div
                      class="absolute left-0 bottom-0 bg-black opacity-90 w-full h-full"
                      :style="'height: ' + (1 - item.cCD / item.CD) * 100 + '%'"
                    ></div>
                    <div
                      v-if="item.perCD > 0"
                      class="absolute left-0 text-red-500 top-0 w-full h-full leading-8 text-xl"
                    >
                      {{ item.perCD }}
                    </div>
                    <img
                      class="w-full h-full pointer-events-none"
                      :src="this.$uploadUVAnimUrl + item.icon"
                      alt=""
                    />
                    <div
                      class="hidden absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-yellow-700 text-xs leading-4 p-px"
                    >
                      {{ item.level }}
                    </div>

                    <div
                      class="absolute right-px top-px w-4 h-4 rounded-full text-gray-200 text-xs leading-4 p-px"
                    >
                      {{ item.actionKeyText }}
                    </div>
                  </div>
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
                    @mouseover="LookActionSkill($event, 'player')"
                    @mouseleave="outHover()"
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
                <div class="relative">
                  <img
                    class="w-8 h-16 pointer-events-auto cursor-pointer"
                    @click="clickMenu('skill')"
                    :src="panelState.skill ? skillUrl_down : skillUrl_up"
                    alt=""
                  />
                  <img
                    v-if="newLevel"
                    class="absolute left-0 top-0 w-8 h-16"
                    :src="btnHilightUrl"
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
                  <img
                    class="w-9 h-9 pointer-events-auto cursor-pointer"
                    @click="clickMenu('bagBase')"
                    @mouseover="LookSkill($event, 'bag')"
                    @mouseleave="outHover()"
                    :src="bagBaseUrl"
                    alt=""
                  />

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

          <div class="transform scalex -mt-16 flex">
            <img :src="bottomOrderUrl" alt="" />
          </div>
        </div>
      </div>
    </div>


    <!-- 经验条 -->
    <div class="absolute z-0 left-0 bottom-16 flex w-full h-3">
      <div
        class="mt-3 transform scale-125 mx-auto relative h-full"
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
</template>



 
<script >
export default {
  props: [],
  components: {},
  data() {
    return {
      skillList: [],
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
      mainmenuUrl_up:
        "./public/images/cursorList/mainmenu/ui-microbutton-mainmenu-up.png",
      mainmenuUrl_down:
        "./public/images/cursorList/mainmenu/ui-microbutton-mainmenu-down.png",

      btnHilightUrl:
        "./public/images/cursorList/mainmenu/ui-microbutton-hilight.png",

      bagBaseUrl: "./public/images/cursorList/mainmenu/inv_misc_bag_08.png",
      bag2Url:
        "./public/images/cursorList/mainmenu/inv_misc_bag_enchantedmageweave.png",

      newLevel: false,
      keyList: {
        actionBar1: [
          { index: 0, key: "Digit1", text: "1" },
          { index: 1, key: "Digit2", text: "2" },
          { index: 2, key: "Digit3", text: "3" },
          { index: 3, key: "Digit4", text: "4" },
          { index: 4, key: "Digit5", text: "5" },
          { index: 5, key: "Digit6", text: "6" },
          { index: 6, key: "Digit7", text: "7" },
          { index: 7, key: "Digit8", text: "8" },
          { index: 8, key: "Digit9", text: "9" },
        ],
      },
      stats: {
        health: 100,
        maxHealth: 100,
        exp: 10,
        needExp: 30,
      },
      panelState: {},
      playerImg: "",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.panelState = _Global.panelState;

      _Global.addEventListener("界面开关", (e, b) => {
        this.panelState[e] = b;
      });

      _Global.addEventListener("主角头像", (s) => {
        // console.log("主角头像", s);
        this.playerImg = this.$uploadUrl + s.id + "/" + s.icon;
      });

      _Global.addEventListener("keycode", (keycode) => {
        // console.log(" in active panel ", keycode);
        for (let i = 0; i < this.keyList.actionBar1.length; i++) {
          const element = this.keyList.actionBar1[i];
          if (element.key == keycode) {
            this.SkillGoByActionBar("actionBar1", i);
          }
        }
      });
      _Global.addEventListener("经验值", (c, n) => {
        this.stats.exp = c;
        this.stats.needExp = n;
      });

      _Global.addEventListener("升级", (level) => {
        this.newLevel = true;
      });

      _Global.addEventListener("角色死亡", () => {
        if (this.newLevel) {
          this.newLevel = false;
        }
      });

      _Global.addEventListener("关闭窗口", (e) => {
        _Global.panelState[e] = false;
      });
      _Global.addEventListener("3d加载完成", () => {
        _Global._YJPlayerFireCtrl.addEventListener(
          "技能CD",
          (skillName, cCD) => {
            this.changeMainPlayerSkillCD(skillName, cCD);
          }
        );

        _Global._YJPlayerFireCtrl.addEventListener("添加技能", (_skill) => {
          if (this.newLevel) {
            this.newLevel = false;
          }
          this.AddSkill(_skill);
          // console.log(" 添加技能 2", this.skillList);
        });
        _Global._YJPlayerFireCtrl.addEventListener("移除技能", (_skill) => {
          for (let i = this.skillList.length - 1; i >= 0; i--) {
            const skill = this.skillList[i];
            if (skill.skillName == _skill.skillName) {
              this.skillList.splice(i, 1);
              return;
            }
          }
        });
      });
    }, 2000);
  },

  methods: {
    LookSkill(e, item) {
      if (item == "bag") {
        item = {
          type: "item",
          title: "行囊", 
        };
      }
      let parent = e.target; 
      this.$parent.LookSkill(parent, item); 
    },
    LookActionSkill(e, item) {
      if (item == "player") { 
        item = {
          type: "menu",
          title: "角色信息", 
          describe:
            "关于你的角色的各种信息，包括装备、战斗属性、技能和声望",
        };
      } 
      this.$parent.LookActionSkill(item);
    },
    outHover() {
      this.$parent.outHover();
    },

    clickMenu(e) {
      if (e == "player") {
        this.panelState.player = !this.panelState.player;
      }
      if (e == "bagBase") {
        this.panelState.bag = !this.panelState.bag;
      }
      if (e == "skill") {
        this.newLevel = false;
        this.panelState.skill = !this.panelState.skill;
      }
      if (e == "mainmenu") {
        this.panelState.player = false;
        this.panelState.skill = false;
        this.panelState.mainmenu = !this.panelState.mainmenu;
      }
    },
    SkillGoByActionBar(actionBar, index) {
      for (let i = 0; i < this.skillList.length; i++) {
        const skill = this.skillList[i];
        if (skill.actionKey == actionBar && skill.actionKeyIndex == index) {
          if (skill.cCD == skill.CD) {
            _Global._YJPlayerFireCtrl.GetSkill().UseSkill(skill);
          }
          return;
        }
      }
    },
    AddSkill(_skill) {
      for (let i = 0; i < this.skillList.length; i++) {
        const skill = this.skillList[i];
        if (skill.skillName == _skill.skillName) {
          return;
        }
      }
      _skill.level = 1;
      _skill.auto = false;
      let actionKey = this.keyList.actionBar1[this.skillList.length];
      _skill.actionKey = "actionBar1";
      _skill.actionKeyIndex = actionKey.index;
      _skill.actionKeyText = actionKey.text;
      this.skillList.push(_skill);
    },
    changeMainPlayerSkillCD(skillName, cCD) {
      for (let i = 0; i < this.skillList.length; i++) {
        const skill = this.skillList[i];
        if (skill.skillName == skillName) {
          skill.cCD = cCD;
          skill.perCD = (skill.CD - cCD).toFixed(skill.CD > 10 ? 0 : 1);
          return;
        }
      }
    },
    onContextMenu(e, item) {
      // 阻止默认的上下文菜单显示
      e.preventDefault();
      // console.log(e,item);

      if (e.button == 2) {
        if (item.auto == undefined) {
          item.auto = true;
        }
        item.auto = !item.auto;
        _Global._YJPlayerFireCtrl
          .GetSkill()
          .SetSkillAuto(item.skillName, item.auto);
      }
    },
    clickSkill(e, item) {
      // console.log(item.skillName, item.cCD, item.CD);
      if (e.button == 0) {
        if (item.cCD == item.CD) {
          _Global._YJPlayerFireCtrl.GetSkill().UseSkill(item);
        }
      }
    },
  },
};
</script>

<style scoped>
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