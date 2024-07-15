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

          <div class="absolute left-0 bottom-3 ml-20 w-40 h-4 ">
            <div class=" text-white text-xs text-right pr-5">465465465</div>
            <div class="absolute right-0 top-0">
              <img :src="goldUrl" alt="" />
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
      goldUrl: "./public/images/cursorList/containerframe/ui-goldicon.png",
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
          if (this.$parent.delDialog) {
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
      _Global.addEventListener("在动作条中调用并摧毁Prop", (id) => {
        for (let i = 0; i < this.itemList.length; i++) {
          const item = this.itemList[i];
          if (item.skill && item.skill.id == id) {
            item.skill = null;
          }
        }
      });

      for (let i = 0; i < this.itemList.length; i++) {
        const item = this.itemList[i];
        item.hoverPart = "bagbase_" + i;
      }

      let list = _Global.propList;
      console.log(" 所有道具物品 ", list);
      //随机取出3张卡片
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        // if (item.id == "1720684572588") {
        //   item.canDrag = true;
        //   this.itemList[0].skill = item;
        // }

        item.canDrag = true;
        if (item.countType && item.countType == "group") {
          item.count = 20;
        }
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
    removeItem(index) {
      this.itemList[index].skill = null;
      this.itemList[index].inDraging = false;
    },
  },
};
</script>   