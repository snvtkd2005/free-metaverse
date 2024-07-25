<template>
  <div class="w-full h-full relative pointer-events-none">
    <!-- 角色信息 -->
    <div class="absolute left-0 top-20 flex">
      <div class="relative transform scale-100 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
          <div class="absolute left-1 top-1">
            <img class="w-16 h-16 rounded-full" :src="playerImg" alt="" />
          </div>
        </div>
        <div class="absolute left-0 top-0 w-full h-full z-10">
          <div
            class="absolute right-7 z-10 top-2 pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img :src="closeUrl" alt="" />
          </div>
        </div>
        <div class="mx-auto flex">
          <div class="flex flex-col">
            <div class="flex">
              <div class="w-64 h-64">
                <img :src="topleftUrl" alt="" />
              </div>
              <div class="w-32 h-64">
                <img :src="toprightUrl" alt="" />
              </div>
            </div>
            <div class="flex">
              <div class="w-64 h-64">
                <img :src="bottomleftUrl" alt="" />
              </div>
              <div class="relative w-32 h-64">
                <img :src="bottomrightUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="absolute left-0 top-0 h-96 flex">
          <div
            class="text-white w-48 ml-24 pl-2 mx-auto tracking-widest mt-4 inline-block h-5 text-xs"
          >
            {{ playerName }}
          </div>

          <div
            class="absolute left-0 top-0 w-10 b h-auto ml-6 flex flex-col mt-16 pt-2.5 mx-auto"
          >
            <div
              v-for="(item, i) in skillList"
              :key="i"
              class="flex w-9 h-9 mb-1 mt-px -ml-0.5 relative cursor-pointer pointer-events-auto"
            >
              <img
                v-if="!(item.skill && true)"
                class="absolute left-0 top-0 w-full h-full pointer-events-none"
                :src="item.bg"
                alt=""
              />
              <iconslotVue :item="item"></iconslotVue>
            </div>
          </div>

          <div
            class="absolute -right-14 top-0 w-10 b h-auto flex flex-col pl-1 mt-16 pt-2.5 mx-auto"
          >
            <div
              v-for="(item, i) in skillList2"
              :key="i"
              class="flex w-9 h-9 mb-1 mt-px -ml-0.5 relative cursor-pointer pointer-events-auto"
            >
            <img
                v-if="!(item.skill && true)"
                class="absolute left-0 top-0 w-full h-full pointer-events-none"
                :src="item.bg"
                alt=""
              />
              <iconslotVue :item="item"></iconslotVue>
            </div>
          </div>

          <div
            class="absolute left-28 -bottom-10 w-80 h-auto max-h-80 flex pl-2.5 mx-auto"
          >
            <div
              v-for="(item, i) in skillList3"
              :key="i"
              class="flex w-9 h-9 mr-1.5 relative cursor-pointer pointer-events-auto"
            >
            <img
                v-if="!(item.skill && true)"
                class="absolute left-0 top-0 w-full h-full pointer-events-none"
                :src="item.bg"
                alt=""
              />
              <iconslotVue :item="item"></iconslotVue>
            </div>
          </div>

          <div class="absolute right-7 -bottom-16 flex">
            <div
              class="ml-4"
              style="
                width: 40px;
                height: 64px;
                background-position: 0px 0px;
                background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-ammoslot.png);
              "
            ></div>

            <div
              class="-ml-14"
              style="
                width: 24px;
                height: 64px;
                background-position: 24px 0px;
                background-image: url(./public/images/cursorList/paperdollinfoframe/ui-character-ammoslot.png);
              "
            ></div>
          </div>
        </div>
      </div>
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
      skillList: [
        {
          type: "equip",
          part: "head",
          text: "头部",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-head.png",
          used: false,
        },
        {
          type: "equip",
          part: "neck",
          text: "颈部",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-neck.png",
          used: false,
        },
        {
          type: "equip",
          part: "shoulder",
          text: "肩部",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-shoulder.png",
          used: false,
        },
        {
          type: "equip",
          part: "back",
          text: "背部",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-chest.png",
          used: false,
        },
        {
          type: "equip",
          part: "chest",
          text: "胸部",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-chest.png",
          used: false,
        },
        {
          type: "equip",
          part: "shirt",
          text: "衬衣",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-shirt.png",
          used: false,
        },
        {
          type: "equip",
          part: "tabard",
          text: "战袍",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-tabard.png",
          used: false,
        },
        {
          type: "equip",
          part: "wrists",
          text: "手腕",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-wrists.png",
          used: false,
        },
      ],
      skillList2: [
        {
          type: "equip",
          part: "hands",
          text: "手",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-hands.png",
          used: false,
        },
        {
          type: "equip",
          part: "waist",
          text: "腰部",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-waist.png",
          used: false,
        },
        {
          type: "equip",
          part: "legs",
          text: "腿部",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-legs.png",
          used: false,
        },
        {
          type: "equip",
          part: "feet",
          text: "脚",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-feet.png",
          used: false,
        },
        {
          type: "equip",
          part: "rfinger",
          text: "手指",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-rfinger.png",
          used: false,
        },
        {
          type: "equip",
          part: "rfinger2",
          text: "手指",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-rfinger.png",
          used: false,
        },
        {
          type: "equip",
          part: "trinket",
          text: "饰品",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-trinket.png",
          used: false,
        },
        {
          type: "equip",
          part: "trinket2",
          text: "饰品",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-trinket.png",
          used: false,
        },
      ],
      skillList3: [
        {
          type: "equip",
          part: "mainhand",
          text: "主手",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-mainhand.png",
          used: false,
        },
        {
          type: "equip",
          part: "secondaryhand",
          text: "副手",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-secondaryhand.png",
          used: false,
        },
        {
          type: "equip",
          part: "ranged",
          text: "远程",
          // bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-relic.png",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-ranged.png",
          used: false,
        },
        {
          type: "equip",
          part: "",
          text: "箭",
          bg: "./public/images/cursorList/paperdoll/ui-paperdoll-slot-ammo.png",
          used: false,
        },
      ],
      skillPoint: 0, //可使用技能点
      topleftUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-charactertab-l1.png",
      toprightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-charactertab-r1.png",
      bottomleftUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-charactertab-bottomleft.png",
      bottomrightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-charactertab-bottomright.png",
      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",

      ammoslotUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-ammoslot.png",
      btnHilightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-quickslot-depress.png",
      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      playerImg:
        "https://snvtkd2005.com/socketIoServer/socketIoServer/uploads/1697436993131/thumb.png",
      hoverPart: "",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      _Global.addEventListener("3d加载完成", () => {
        _Global._YJPlayerFireCtrl.addEventListener("更新装备", (equipList) => {
          for (let i = 0; i < this.skillList.length; i++) {
            const element = this.skillList[i];
            // element.skill = {type:"equip",text:element.text};
            for (let j = 0; j < equipList.length; j++) {
              const equip = equipList[j];
              if (
                equip.part &&
                equip.part.toLowerCase() == element.part
              ) {
                element.icon = equip.icon; 
                element.skill = equip;
              }
            }
          }
          for (let i = 0; i < this.skillList2.length; i++) {
            const element = this.skillList2[i];
            // element.skill = {type:"equip",text:element.text};
            for (let j = 0; j < equipList.length; j++) {
              const equip = equipList[j];
              if (
                equip.part &&
                equip.part.toLowerCase() == element.part
              ) {
                element.icon = equip.icon; 
                element.skill = equip;
              }
            }
          }
          for (let i = 0; i < this.skillList3.length; i++) {
            const element = this.skillList3[i];
            // element.skill = {type:"equip",text:element.text};
            for (let j = 0; j < equipList.length; j++) {
              const equip = equipList[j];
              if (
                equip.part &&
                equip.part.toLowerCase() == element.part
              ) {
                element.icon = equip.icon; 
                element.skill = equip;
              }
            }
          }
        });
      });

      _Global.addEventListener("升级", (level) => {});

      _Global.addEventListener("主角头像", (s) => {
        // console.log("主角头像", s);
        this.playerImg = this.$uploadUrl + s.id + "/" + s.icon;
      });

      _Global.addEventListener("主角姓名", (s) => {
        this.playerName = s;
      });

      _Global.addEventListener("主角死亡", () => {});
      _Global.addEventListener("战斗开始", () => {});
    }, 1000);

    for (let i = 0; i < this.skillList.length; i++) {
      const element = this.skillList[i];
      element.hoverPart = "playerPanel" + i;
    }
    for (let i = 0; i < this.skillList2.length; i++) {
      const element = this.skillList2[i];
      element.hoverPart = "playerPanel2" + i;
    }
    for (let i = 0; i < this.skillList3.length; i++) {
      const element = this.skillList3[i];
      element.hoverPart = "playerPanel3" + i;
    }
  },

  methods: {
    cancelDrag(e) {
      //取消装备模型，把装备放入背包
      let item = null;
      for (let i = 0; i < this.skillList.length; i++) {
        const element = this.skillList[i];
        if (element.hoverPart == _Global.dragPart) {
          item = element;
        }
      }
      for (let i = 0; i < this.skillList2.length; i++) {
        const element = this.skillList2[i];
        if (element.hoverPart == _Global.dragPart) {
          item = element;
        }
      }
      for (let i = 0; i < this.skillList3.length; i++) {
        const element = this.skillList3[i];
        if (element.hoverPart == _Global.dragPart) {
          item = element;
        }
      }
      if (e == "从角色面板拖拽到动作条") {
      }

      if (e == "取消拖拽Prop") {
        item.inDraging = false;
      }

      if (e == "摧毁拖拽Prop") {
        //
        _Global._YJPlayerFireCtrl.GetEquip().UnWearEquip(item.skill.part);
        item.inDraging = false;
        item.skill = null;
      }

      if (e == "从角色面板拖拽到背包") {
        _Global._YJPlayerFireCtrl.GetEquip().UnWearEquip(item.skill.part);
        item.inDraging = false;
        item.skill = null;
      }

      if (e == "右键点击" || e == "从角色面板拖拽到动作条") {
        for (let i = 0; i < this.skillList.length; i++) {
          const element = this.skillList[i];
          if (element.hoverPart == _Global.dragPart) {
            element.inDraging = false;
          }
        }
        for (let i = 0; i < this.skillList2.length; i++) {
          const element = this.skillList2[i];
          if (element.hoverPart == _Global.dragPart) {
            element.inDraging = false;
          }
        }
        for (let i = 0; i < this.skillList3.length; i++) {
          const element = this.skillList3[i];
          if (element.hoverPart == _Global.dragPart) {
            element.inDraging = false;
          }
        }
      }
    },

    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "player", false);
      }
    },
    LookSkill(e, item) {
      // console.log(e);
      this.hoverPart = item.hoverPart;
      let parent = e.target;
      if (item.skill) {
        item.skill.type = "equip";
        this.$parent.LookSkill(parent, item.skill);
      } else {
        this.$parent.LookSkill(parent, item);
      }
    },
    outHover() {
      this.hoverPart = "";
      this.$parent.outHover();
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