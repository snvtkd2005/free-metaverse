<template>
  <div class="absolute z-10 left-0 top-32 w-full h-full flex pointer-events-none">
    <!-- 游戏菜单 -->
    <div class="w-1/3 h-24  mx-auto flex  relative">
      <div
        class=" absolute left-0 top-0 -z-10 flex w-full h-full mx-auto"
        style=" 
          border: 10px solid;
          border-image-source: url(./public/images/cursorList/mainmenu/ui-chatinputborder.png);
          border-image-slice: 14 15 15 15 fill;
            border-image-width: 14px 15px 15px 15px;
          border-image-repeat: no-repeat;
        "
      >
      </div>

      <div class="w-full h-full py-2 flex">
        
        <div class=" absolute left-0 top-0 ml-6 mt-4 ">
          <img class="" :src="playerImg" alt="" />
        </div>

        <div class="w-full  mx-auto self-center ">
          <div
            class="text-white mx-auto tracking-widest inline-block h-5 text-lg"
          >
            {{content}}?
          </div>

          <div class="  w-1/2 gap-x-4 mt-1 flex mx-auto text-yellow-400">
            <div
              v-for="(item, i) in skillList"
              :key="i"
              class="flex mx-auto relative cursor-pointer pointer-events-auto"
            >
              <div>
                <img :src="redBtnUrl" alt="" />
              </div>
              <div
                class="absolute left-0 top-1 w-32 h-4 text-xs"
                @click="clickSkill(item.title)"
                @mousemove="MouseMove($event)"
              >
                {{ item.title }}
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
        {
          title: "是",
        },
        {
          title: "否",
        },
      ],
      content: "你确定要摧毁", //可使用技能点
      redBtnUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-up.png",
      btnHilightUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-highlight.png",
      playerImg:
        "./public/images/cursorList/mainmenu/ui-dialog-icon-alertnew.png",
    };
  },
  created() {},
  mounted() { 
  },

  methods: {
    MouseMove(ev) {
      this.$parent.mousePos(ev.clientX, ev.clientY);
    },
    clickSkill(e) {
      if (e == "是") {
        _Global.applyEvent("摧毁拖拽Prop");
      }
      if (e == "否") {
        _Global.applyEvent("取消拖拽Prop");
      }
      this.$parent.delDialog = false;
    },
  },
};
</script>
 