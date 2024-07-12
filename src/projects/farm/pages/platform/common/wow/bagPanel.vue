<template>
  <div class="w-full h-full absolute left-0 top-0 pointer-events-none">
    <!-- 背包 -->
    <div class="absolute right-40 bottom-40 flex">
      <div class="relative transform scale-125 mx-auto flex">
        <div class="absolute left-0 top-0 w-full h-full -z-10">
          <div class="absolute right-32 top-1">
            <img class="mr-5 w-10 h-10 rounded-full" :src="playerImg" alt="" />
          </div>
        </div>
        <div class="mx-auto flex">
          <div class="flex flex-col">
            <div class="flex">
              <img class="w-64 h-64" :src="basebagUrl" alt="" />
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
            class="text-white w-48 ml-16 pl-2 mx-auto tracking-widest mt-2.5 inline-block h-5 text-xs"
          >
            行囊
          </div>

          <div
            class="absolute left-0 top-0 w-44 h-auto max-h-64 ml-20 grid grid-cols-4 gap-1.5 pt-px pr-3 mt-16 mx-auto"
          >
            <div
              v-for="(item, i) in itemList"
              :key="i"
              class="flex w-9 h-9 relative cursor-pointer pointer-events-auto"
            >
              <iconslotVue :item="item"></iconslotVue>
            </div>
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
      itemList: [
        { index: 0, skill: null },
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
        { index: 12, skill: null },
        { index: 13, skill: null },
        { index: 14, skill: null },
        { index: 15, skill: null },
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

      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      hoverPart: "",
      dragFromIndex: -1,
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      _Global.addEventListener("升级", (level) => {});
      _Global.addEventListener("点击三维页", () => {
        if (_Global.inDragProp) {
          // 扔丢道具，打开扔道具确认框
          this.$parent.delDialog = true;
        }
      });
      _Global.addEventListener("右键点击", () => {
        if (_Global.inDragProp) {
          this.checkDragFromIndex();
          this.itemList[this.dragFromIndex].inDraging = false;
          _Global.inDragProp = false;
          //取消拖拽
          this.$parent.dragEnd();
          if(this.$parent.delDialog){
            this.$parent.delDialog = false;
          }
        }
      });

      _Global.addEventListener("摧毁拖拽Prop", () => {
        if (_Global.inDragProp) {
          this.checkDragFromIndex();
          _Global.applyEvent(
            "摧毁Prop并在动作条中停用prop",
            this.itemList[this.dragFromIndex].skill.id
          );
          this.itemList[this.dragFromIndex].skill = null;
          this.itemList[this.dragFromIndex].inDraging = false;
          _Global.inDragProp = false;
          this.$parent.dragEnd();
        }
      });
      _Global.addEventListener("取消拖拽Prop", () => {
        if (_Global.inDragProp) {
          this.checkDragFromIndex();
          this.itemList[this.dragFromIndex].inDraging = false;
          _Global.inDragProp = false;
          this.$parent.dragEnd();
        }
      });

      _Global.addEventListener("从背包拖拽到动作条", () => {
        this.checkDragFromIndex();
        this.itemList[this.dragFromIndex].inDraging = false;
      });

      for (let i = 0; i < this.itemList.length; i++) {
        const item = this.itemList[i];
        item.hoverPart = "bagbase_" + i;
      }

      let list = _Global.propList;
      console.log(list);
      //随机取出3张卡片
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        // if (item.id == "1720684572588") {
        //   item.canDrag = true;
        //   this.itemList[0].skill = item;
        // }

        item.canDrag = true;
        this.itemList[i].skill = item;
      }
    }, 5000);
  },

  methods: {

    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "bag", false);
      }
    },
    onContextMenu(e, item) {
      // 阻止默认的上下文菜单显示
      e.preventDefault();
      // console.log(e,item);

      if (e.button == 2) {
        this.UseProp(item.skill);
      }
    },
    checkDragFromIndex() {
      if (_Global.hoverPart) {
        this.dragFromIndex = parseInt(
          _Global.hoverPart.replace("bagbase_", "")
        );
      } else {
        console.error(" 未拖拽 ");
      }
    },
    setItem(skill) {
      if (_Global.hoverPart) {
        this.dragFromIndex = parseInt(
          _Global.hoverPart.replace("bagbase_", "")
        );
        this.itemList[this.dragFromIndex].skill = skill;
        this.itemList[this.dragFromIndex].inDraging = false;
        _Global.hoverPart = "";
      }
    },
  },
};
</script>

<style scoped>
.grayscale-img {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  opacity: 0.99;
}

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