<template>
  <div
    class="relative w-full h-full"
    @contextmenu.prevent="onContextMenu($event, item)"
    @mouseup="clickItem($event, item)"
    @mouseover="LookSkill($event, item)"
    @mouseleave="outHover()"
    @mousemove="MouseMove($event)"
    :draggable="item.skill != null && !item.lockAction"
    @dragstart="drag($event, item)"
  >
    <div v-if="item.skill != null" class="w-full h-full relative">
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
        v-if="item.skill.icon"
        class="w-full h-full rounded-md pointer-events-none"
        :class="item.inDraging ? ' grayscale-img ' : ''"
        :src="
          item.skill.icon.includes('http')
            ? item.skill.icon
            : this.$uploadUVAnimUrl + item.skill.icon
        "
        alt=""
      />
      <div
        v-if="
          item.isDeleled ||
          (item.skill.target &&
            item.skill.target.type == 'target' &&
            !item.skill.hasTarget)
        "
        class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-60"
      ></div>
      <!-- :class="item.hasTarget?'  ':' bg-black '" -->

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
      v-if="item.inDragAction || (item.skill != null && item.keytext)"
      class="absolute right-px top-px w-4 h-4 rounded-full text-xs leading-4 p-px"
      :class="item.outVaildDis ? ' text-red-600' : ' text-gray-200 '"
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
    this.parent = this.$parent.$parent;
  },

  methods: {
    drag(ev, item) {
      if (ev) {
        ev.preventDefault();
      }
      // console.log(" in icon slot drag ", item);
      _Global.hoverPart = item.hoverPart;
      _Global.dragPart = item.hoverPart;
      if (item.hoverPart.includes("action") || item.skill.type == "skill") {
        _Global.inDragAction = true;
        this.$parent.drag(item);
        // console.log(" 拖拽动作条 ");
        return;
      }

      if (item.hoverPart.includes("player") && item.skill.type == "equip") {
        item.inDraging = true;
        _Global.inDragEquip = true;
      }

      if (item.hoverPart.includes("bag")) {
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
      // console.log(" in LookSkill ", item);
      let parent = e.target;

      if (item.skill == null) {
        if (item.type == "equip") {
          this.parent.LookSkill(parent, item);
        }
        return;
      }
      if (item.skill.type == "skill") {
        this.parent.LookActionSkill(item.skill);
        return;
      }
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

        let toPart = "";
        if (item.hoverPart.includes("bag")) {
          toPart = "背包";
        }
        if (item.hoverPart.includes("action")) {
          toPart = "动作条";
        }
        if (item.hoverPart.includes("player")) {
          toPart = "角色面板";
        }

        // 背包内移动
        if (
          (this.parent.dragSkill.type == "prop" && toPart == "背包") ||
          (this.parent.dragSkill.type == "equip" && toPart == "背包")
        ) {
          //删掉旧的
          console.log("背包内移动");
          this.$parent.setItem(null);
        }

        if (this.parent.dragSkill.isDeleled) {
          item.isDeleled = true;
        }
        item.skill = this.parent.dragSkill;

        let fromPart = "";
        if (_Global.inDragProp) {
          fromPart = "背包";
        }
        if (_Global.inDragAction) {
          fromPart = "动作条";
        }
        if (_Global.inDragEquip) {
          fromPart = "角色面板";
        }

        console.log("从" + fromPart + "拖拽到" + toPart);
        _Global.applyEvent("从" + fromPart + "拖拽到" + toPart);

        //取消拖拽
        this.parent.dragEnd();
        return;
      } else {
        if (this.parent.dragSkill != null) {
          let currentSkill = item.skill;
          item.skill = this.parent.dragSkill;


          
          let toPart = "";
          if (item.hoverPart.includes("bag")) {
            toPart = "背包";
          }
          if (item.hoverPart.includes("action")) {
            toPart = "动作条";
          }
          if (item.hoverPart.includes("player")) {
            toPart = "角色面板";
          }
          // 背包物品位置互换
          if (
            (this.parent.dragSkill.type == "prop" && toPart == "背包") ||
            (this.parent.dragSkill.type == "equip" && toPart == "背包")
          ) {
            console.log(" in 背包物品位置互换 ");
            this.$parent.setItem(currentSkill);
            //取消拖拽
            this.parent.dragEnd();
            return;
          }

          // if (
          //   this.parent.dragSkill.type == "prop" &&
          //   item.hoverPart.includes("bag") &&
          //   item.skill.type == "prop"
          // ) {
          //   console.log(" in 背包物品位置互换 ");
          //   this.$parent.setItem(currentSkill);
          //   //取消拖拽
          //   this.parent.dragEnd();
          //   return;
          // }

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
      if (item.hoverPart.includes("playerPanel")) {
        this.drag("", item);
        return;
      }

      this.UseItem(item);
    },
    UseItem(item) {
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
      if (skill.type == "equip") {
        // 判断装备是否能正常装备到角色
        // 如果角色相同部位已有装备，则替换模型和icon
        // 如果角色相同部位没有装备，则删除icon
        let equipList = _Global._YJPlayerFireCtrl.GetEquip().GetEquipList();
        let has = false;
        let oldSkill = null;
        for (let i = 0; i < equipList.length && !has; i++) {
          const element = equipList[i];
          if(element.part == skill.part){
            oldSkill = element;
            has = true;
          }
        }
        if(has){
          setTimeout(() => {
            item.skill = oldSkill;
            this.parent.LookSkill(null, item.skill);
          }, 100); 
        }else{ 
          setTimeout(() => {
            item.skill = null;
          }, 100);
        }

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
</style>