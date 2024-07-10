<template>
  <div 
    class="w-full h-full absolute left-0 top-0 pointer-events-none"
  >
    <!-- 背包 -->
    <div class="absolute right-40 bottom-40 flex">
      <div class="relative transform scale-125 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
          <div class="absolute right-32 top-1">
            <img class="mr-5 w-10 h-10 rounded-full" :src="playerImg" alt="" />
          </div>
        </div>
        <div class=" mx-auto flex">
          <div class="flex flex-col">
            <div class="flex">
              <img class=" w-64 h-64" :src="basebagUrl" alt=""> 
            </div>
          </div>
          
          <div
            class="absolute right-0 top-0 pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img :src="closeUrl" alt="" />
          </div>
        </div>
        <div class="absolute left-0 top-0 h-64 flex">
          <div
            class="text-white w-48 ml-16 pl-2  mx-auto tracking-widest mt-2.5 inline-block h-5 text-xs"
          >
          行囊
          </div>

          <div
            class="absolute left-0 top-0 w-44 h-auto max-h-64 ml-20 grid grid-cols-4 gap-1.5 pt-px pr-3 mt-16  mx-auto "
          >
            <div
              v-for="(item, i) in itemList"
              :key="i"
              class="flex w-9 h-9   relative cursor-pointer pointer-events-auto"
            >
            <!-- this.$uploadUVAnimUrl + -->
              <div class="w-full h-full" @click="clickItem(item)"
                @mouseover="LookSkill($event, item)"
                @mouseleave="outHover()"
              >
                <div>
                  <img
                    class="w-full h-full pointer-events-none"
                    :src=" item.icon"
                    alt=""
                  /> 
                </div>
                <div
                  v-if="item.count > 0 "
                  class="absolute -right-2 -bottom-2 w-4 h-4 text-white rounded-full text-xs leading-4 p-px"
                >
                  {{ item.count }}
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
  components: { 
  },
  data() {
    return { 
      itemList: [
        {
          type:"item",
          title:"炉石",
          quality:"普通",
          bindingType:"已绑定",
          countType:"唯一",
          describe:"使用：将你传送到银月城。与城镇中的旅店老板交谈可以改变你所设定的加的位置。（30分钟冷却）",
          icon: "./public/images/cursorList/mainmenu/ui-tutorialframe-hearthstone.png",
          count: 0,
        },  
      ], 
      basebagUrl:
        "./public/images/cursorList/containerframe/ui-backpackbackground.png",
      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      downUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-character-skills-barborderhighlight.png",
      btnHilightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-quickslot-depress.png",
      playerImg:
        "https://snvtkd2005.com/socketIoServer/socketIoServer/uploads/1697436993131/thumb.png",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      
      _Global.addEventListener("升级", (level) => {
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
        _Global.applyEvent("界面开关", "bag",false);
      }
    }, 
    onContextMenu(e, item) {
      // 阻止默认的上下文菜单显示
      e.preventDefault();
      // console.log(e,item);

      if (e.button == 2) {
        
      }
    },
    clickItem(item) {
      // item.count++;
      //学习新技能
      // _Global._YJPlayerFireCtrl.GetSkill().AddSkill(item);

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