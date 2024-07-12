<template>
  <div class="w-full h-full relative flex pointer-events-none">
    <!-- 游戏菜单 -->
    <div class="absolute left-0 top-52 w-96 mx-auto flex">
      <div class="relative transform scale-125 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full">
          <div class="absolute left-1 top-1.5 transform scale-125">
            <img class="" :src="playerImg" alt="" />
          </div>
        </div>
        <div
          class="flex mt-3 w-48 h-60 mx-auto"
          style="
            border: 10px solid;
            border-image-source: url(./public/images/cursorList/mainmenu/ui-chatinputborder.png);
            border-image-slice: 14 15 15 15 fill;
            border-image-width: 14px 15px 15px 15px;
            border-image-repeat: no-repeat;
          "
        ></div>

        <div class="absolute left-0 top-0 w-full h-auto flex   ">
          <div class="w-full mt-1.5 mx-auto">
            <div
              class="text-yellow-400 mx-auto tracking-widest inline-block h-5 text-xs"
            >
              游戏菜单
            </div>

            <div class="w-full mt-10 flex flex-col mx-auto text-white">
              <div
                v-for="(item, i) in skillList"
                :key="i"
                class="flex mb-4 mx-auto relative cursor-pointer pointer-events-auto"
              >
              <div>
                <img :src="redBtnUrl" alt="">
              </div>
                <div class="  absolute left-0 top-1 w-32 h-4 text-xs " @click="clickSkill(item.title)">
                  {{ item.title }}
                </div>
              </div>
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
  components: {},
  data() {
    return {
      skillList: [
        // {
        //   title: "支持",
        // },
        {
          title: "选项",
        },
        {
          title: "返回游戏",
        },
      ], 
      redBtnUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-up.png",
      btnHilightUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-highlight.png",
      playerImg: "./public/images/cursorList/mainmenu/ui-dialogbox-header.png",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {}, 5000);
  },

  methods: {
    LookSkill(e, item) {
      // console.log(e);
      let parent = e.target;
      this.$parent.LookSkill(parent, item);
    },
    outHover() {
      this.$parent.outHover();
    },
    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "skill", false);
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
    clickSkill(e) { 
      if(e == "返回游戏"){
        _Global.applyEvent("界面开关",'mainmenu',false)
      } 
      if(e == "选项"){
        _Global.applyEvent("界面开关",'setting',true)
        _Global.applyEvent("界面开关",'mainmenu',false)
      } 
      
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