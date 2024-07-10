<template>
  <div 
    class="w-full h-full relative pointer-events-none"
  >
    <!-- 动作条 -->
    <div class="absolute left-0 top-52 flex">
      <div class="relative transform scale-125 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
          <div class="absolute left-1 top-1">
            <img class="w-16 h-16 rounded-full" :src="playerImg" alt="" />
          </div>
          <div
            class="absolute right-7 top-2 pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img :src="closeUrl" alt="" />
          </div>
        </div>
        <div class="mx-auto flex">
          <div class="flex flex-col">
            <div class="flex">
              <div
                class="w-64 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-topleft.png);
                "
              ></div>
              <div
                class="w-32 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-topright.png);
                "
              ></div>
            </div>
            <div class="flex">
              <div
                class="w-64 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomleft.png);
                "
              ></div>

              <div
                class="w-32 h-64"
                style="
                  background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomright.png);
                "
              ></div>
            </div>
          </div>
        </div>
        <div class="absolute left-0 top-0 h-96 flex">
          <div
            class="text-yellow-400 w-48 ml-24 pl-2 mx-auto tracking-widest mt-4 inline-block h-5 text-xs"
          >
            法术书
          </div>

          <div
            class="absolute left-0 top-0 w-72 h-auto max-h-80 ml-12 grid grid-cols-4 gap-5 mt-20 items-stretch mx-auto pt-2"
          >
            <div
              v-for="(item, i) in skillList"
              :key="i"
              class="flex  relative cursor-pointer pointer-events-auto"
            >
              <div class=" w-9 h-9 relative " 
              @click="clickSkill(item)"
              @mouseover="LookSkill($event, item)"
              @mouseleave="outHover()"
              >
                <div>
                  <img
                    class="w-9 h-9 pointer-events-none"
                    :class="
                      skillPoint > 0 || item.level > 0 ? '  ' : ' skill-img '
                    "
                    :src="this.$uploadUVAnimUrl + item.icon"
                    alt=""
                  />

                  <img
                    v-if="item.level > 0"
                    class="absolute left-0 top-0 w-9 h-9"
                    :src="btnHilightUrl"
                    alt=""
                  />
                </div>
                <div
                  v-if="skillPoint > 0 || item.level > 0"
                  class="absolute -right-2 -bottom-2 w-4 h-4 text-white rounded-full text-xs leading-4 p-px"
                >
                  {{ item.level }}
                </div>
              </div>
            </div>
          </div>

          <div class="absolute left-4 -bottom-12 h-10">
            <div class="transform scale-x-125 ml-10 mt-3">
              <img :src="downUrl" alt="" />
            </div>
            <div
              class="absolute left-0 top-0 ml-24 mt-4 text-xs pt-1 text-yellow-400"
            >
              剩余技能点数：{{ skillPoint }}
            </div>
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
      skillList: [
        // {
        //   icon: "https://snvtkd2005.com/socketIoServer/socketIoServer/uploads/1697436993131/thumb.png",
        //   level: 0,
        // },
      ],
      skillPoint: 0, //可使用技能点
      topleftUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-topleft.png",
      toprightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-topright.png",
      bottomleftUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomleft.png",
      bottomrightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-general-bottomright.png",
      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      downUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-skills-barborderhighlight.png",
      btnHilightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-quickslot-depress.png",
      playerImg:
        "./public/images/cursorList/mainmenu/inv_misc_book_09.png",
        
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      
      _Global.addEventListener("升级", (level) => {
        this.skillPoint += 1;
      });

      // _Global.addEventListener("主角头像", (s) => {
      //   // console.log("主角头像", s);
      //   // this.playerImg = this.$uploadUrl + s.id + "/" + s.icon;
      // });

      let skills = _Global.skillList;
      //随机取出3张卡片
      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        skill.level = 0;
        this.skillList.push(skill);
      }

      _Global.addEventListener("角色死亡", () => {});
      _Global.addEventListener("战斗开始", () => {
        this.skillPoint = 0;
        for (let i = 0; i < this.skillList.length; i++) {
          const element = this.skillList[i];
          element.level = 0;
        }
      });
    }, 5000);
  },

  methods: {
    
    LookSkill(e, item) {
      // console.log(e);
      let parent = e.target;
      this.$parent.LookSkill(parent,item);
    },
    outHover() { 
      this.$parent.outHover();
    },
    clickEvent(e) {
      if (e == "关闭窗口") { 
        _Global.applyEvent("界面开关", "skill",false);
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
    clickSkill(item) {
      // 学习技能
      if (this.skillPoint == 0) {
        return;
      }
      this.skillPoint--;
      item.level++;
      //学习新技能
      _Global._YJPlayerFireCtrl.GetSkill().AddSkill(item);
    },
  },
};
</script>

<style scoped>
.scalex {
  transform: translateX(-32px) scaleX(-1);
}

.skill-img {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  opacity: 0.99;
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