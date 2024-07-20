<template>
  <div
    class="relative w-full h-full"
    @contextmenu.prevent="onContextMenu($event, item)"
    @mouseup="clickItem($event, item)"
    @mouseover="LookSkill($event, item)"
    @mouseleave="outHover()"
    @mousemove="MouseMove($event)"
    :draggable="item.skill != null"
    @dragstart="drag($event, item)"
  >
    <div v-if="item.skill != null" class="relative">
      <div
        v-if="item.skill.type == 'skill' && item.skill.CD > 0"
        class="absolute left-0 bottom-0 bg-black opacity-90 w-full h-full"
        :style="'height: ' + (1 - item.skill.cCD / item.skill.CD) * 100 + '%'"
      ></div>
      <div
        v-if="item.skill.type == 'skill' && item.skill.perCD > 0"
        class="absolute left-0 outline-black text-red-500 top-0 w-full h-full leading-8 text-xl"
      >
        {{ item.skill.perCD }}
      </div>

      <img
        class="w-full h-full pointer-events-none"
        :class="item.inDraging ? ' grayscale-img ' : ''"
        :src="this.$uploadUVAnimUrl + item.skill.icon"
        alt=""
      />
      <div
        v-if="item.isDeleled"
        class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-60"
      ></div>

      <img
        v-if="hoverPart == item.hoverPart"
        class="absolute left-0 top-0 w-9 h-9 opacity-30 transform scale-110 pointer-events-none"
        :src="btnHoverHilightUrl"
        alt=""
      />

      <div
        class="hidden absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-yellow-700 text-xs leading-4 p-px"
      >
        {{ item.skill.level }}
      </div>

      <div
        v-if="item.skill.countType == 'group' && item.skill.count > 1"
        class="absolute -right-0 -bottom-0 w-4 h-4 text-white rounded-full text-xs leading-4 p-px"
      >
        {{ item.skill.count }}
      </div>
    </div>
    <!-- 快捷键文字 -->
    <div
      v-if="item.inDragAction ||  (item.skill != null && item.keytext)  "
      class="absolute right-px top-px w-4 h-4 rounded-full text-gray-200 text-xs leading-4 p-px"
    >
      {{ item.keytext }}
    </div>
  </div>
</template>


<!-- @mouseup="clickItem($event, item)"  -->

 
<script >
export default {
  props: ["item"],
  components: {},
  data() {
    return {
      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      hoverPart: "",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {}, 5000);
    this.parent = this.$parent.$parent;
  },

  methods: {
    drag(ev, item) {
      if (ev) {
        ev.preventDefault();
      }
      console.log(" in icon slot drag ",item);
      _Global.hoverPart = item.hoverPart;
      if (item.hoverPart.includes("action") || item.skill.type == "skill") {
        _Global.inDragAction = true;
        this.$parent.drag(item);
        // console.log(" 拖拽动作条 ");
        return;
      }
      if (item.skill.type == "prop") {
        // console.log(" 拖拽 背包 ");
        item.inDraging = true;
        _Global.inDragProp = true;
      }
      this.parent.dragStart(item.skill);
    },

    MouseMove(ev) {
      this.parent.mousePos(ev.clientX, ev.clientY);
    },
    LookSkill(e, item) {
      this.hoverPart = item.hoverPart;

      if (item.skill == null) {
        return;
      }
      if (item.skill.type == "skill") {
        this.parent.LookActionSkill(item.skill);
        return;
      }
      // console.log(e);
      let parent = e.target;
      this.parent.LookSkill(parent, item.skill);
    },
    outHover() {
      this.hoverPart = ""; 
      this.parent.outHover();
    },
    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "bag", false);
      }
    },
    onContextMenu(ev, item) {
      // 阻止默认的上下文菜单显示
      ev.preventDefault();
      // console.log(e,item);

      if (ev.button == 2) {
        if (this.parent.dragSkill) {
          return;
        }
        if (item.skill == null) {
          return;
        }
        if (item.isDeleled) {
          return;
        }
        this.UseItem(item);
      }
    },
    checkCanDrop(fromSkill, toItem) {
      if (fromSkill.type == "skill") {
        // 动作条技能往背包放
        if (toItem.hoverPart.includes("bag")) {
          return false;
        }
      }
      return true;
    },
    clickItem(ev, item) {
      if (ev.button == 2) {
        return;
      }
      // console.log(" clickItem ", item, this.parent.dragSkill);
      if (item.skill == null) {
        if (this.parent.dragSkill == null) {
          return;
        }
        let b = this.checkCanDrop(this.parent.dragSkill, item);
        if (!b) {
          return;
        }

        // 背包内移动
        if (
          this.parent.dragSkill.type == "prop" &&
          item.hoverPart.includes("bag")
        ) {
          //删掉旧的
          this.$parent.setItem(null);
        }
        if (this.parent.dragSkill.isDeleled) {
          item.isDeleled = true;
        }
        item.skill = this.parent.dragSkill;

        if (_Global.inDragProp) {
          // console.log("从背包拖拽到动作条");
          _Global.applyEvent("从背包拖拽到动作条");
          _Global.inDragProp = false;
        }
        if (_Global.inDragAction) {
          // console.log("从动作条拖拽到动作条");
          _Global.applyEvent("从动作条拖拽到动作条");
          _Global.inDragAction = false;
        }

        //取消拖拽
        this.parent.dragEnd();
        return;
      } else {
        if (this.parent.dragSkill != null) {
          let currentSkill = item.skill;
          item.skill = this.parent.dragSkill;

          // 背包物品位置互换
          if (
            this.parent.dragSkill.type == "prop" &&
            item.hoverPart.includes("bag") &&
            item.skill.type == "prop"
          ) {
            this.$parent.setItem(currentSkill);
            //取消拖拽
            this.parent.dragEnd();
            // console.log(" in 背包物品位置互换 ");
            return;
          }

          if (item.hoverPart.includes("action")) {
            if (this.parent.dragSkill.isDeleled) {
              item.isDeleled = true;
            } else {
              item.isDeleled = false;
            }
          }

          this.parent.dragStart(currentSkill);
          return;
        }
      }

      // 左键点击背包中的物品，可以拖拽
      if (item.hoverPart.includes("bag")) {
        this.drag("", item);
        return;
      }

      this.UseItem(item);
    },
    UseItem(item){
      let skill = item.skill;
      if (skill.type == "prop") {
          let complted = this.parent.UseItem(item);
          // 消耗品
          if (skill.useType == "consumables") {
            console.log(" 使用药水 ", complted, skill);
            if (complted) {
              //药水数量减- 或 药水使用完
              if (skill.countType == "group") {
                if (skill.count) {
                  skill.count--;
                  if (skill.count > 0) {
                    return;
                  }
                } else {
                }
              }
              console.log(" 删除药水 ");
              _Global.applyEvent("摧毁Prop并在动作条中停用prop", skill.id);

              if (item.hoverPart.includes("bag")) {
                // 在背包中使用时，直接移除
                this.$parent.removeItem(item.index);
              } else {
                // 在动作条中使用时，通知在背包中删除
                _Global.applyEvent("在动作条中调用并摧毁Prop", skill.id);
              }
            }
          }
          return;
      }
      this.parent.UseItem(item);

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