<template>
  <div class="w-full h-full flex relative pointer-events-none">
    <div class="w-2/3 px-10 h-3/4  -mt-28 relative mx-auto self-center">
      <div class="w-full relative bg-gray-600 mx-auto">
        <div class="w-full h-8 flex ">
          <div class="w-full border-2 leading-8 text-yellow-400">设置选项</div>
          <div
            class="w-8 h-8 border-2  pointer-events-auto cursor-pointer"
            @click="clickEvent('关闭窗口')"
          >
            <img class=" transform scale-125 " :src="closeUrl" alt="" />
          </div>
        </div>

        <div class=" opacity-0 w-full">搜索</div>
      </div>
      <div class="hidden mx-auto flex">
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
      <div class=" px-4 w-full h-full flex border-2 bg-gray-600 ">
        <!-- 左 -->
        <div class="w-64 text-left border bg-gray-800">
          <div
            v-for="(item, i) in lefMenuList"
            :key="i"
            class="flex w-full mb-8 relative pointer-events-none"
          >
            <div class="w-full  h-auto  relative">
              <div class="text-white w-full pl-6 bg-gray-900  ">{{ item.title }}</div>
              <div
                v-for="(item2, i) in item.children"
                :key="i"
                class="flex  pl-10 relative text-left cursor-pointer pointer-events-auto
                 hover:bg-gray-700 "
                @click="clickTitle(item2)"
                :class="childTitle==item2?' bg-gray-500 text-white ':' text-yellow-400 '"
              >
                <div class="w-40 h-7 relative ">
                  <div class="absolute w-full leading-7">{{ item2 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右 -->
        <div class=" w-full h-full bg-gray-600 ">
          <div class=" px-6 pt-10 relative">
            <div class=" text-left text-lg text-white ">{{ childTitle }}</div>
            <div class="absolute right-10 top-10">
              <div>
                <img :src="redBtnUrl" alt="" />
              </div>
              <div
                class="absolute left-0 top-1 w-32  text-yellow-400 h-4 text-xs"
                @click="clickSkill(item.title)"
              >
                默认设置
              </div>
            </div>
            <div class=" mx-auto w-5/6 h-1 mt-1 bg-gray-400"></div>
            
            <div></div>
          </div>

        </div>
      </div>

      <div class=" relative w-full text-yellow-400">
        <div class="absolute h-8 right-4 bottom-2">
          <img class=" w-full h-full" :src="redBtnUrl" alt="" />
          <div
            class="absolute left-0 top-1 w-32 h-8 text-xs cursor-pointer pointer-events-auto"
            @click="clickEvent('关闭窗口')"
          >
            关闭
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
      lefMenuList: [
        {
          title: "游戏功能",
          children: ["控制", "界面", "动作条", "战斗", "社交", "快捷键"],
        },
        { title: "易用性", children: ["综合", "色盲模式", "文本转语音"] },
        { title: "系统", children: ["图形", "音频", "语言", "网络"] },
      ],
      childTitle:"快捷键",
      closeUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-panel-minimizebutton-up.png",
      redBtnUrl:
        "./public/images/cursorList/mainmenu/ui-dialogbox-button-up.png",

      btnHilightUrl:
        "./public/images/cursorList/paperdollinfoframe/ui-quickslot-depress.png",
      btnHoverHilightUrl:
        "./public/images/cursorList/mainmenu/ui-chaticon-blinkhilight.png",
      playerImg: "./public/images/cursorList/mainmenu/inv_misc_book_09.png",
      hoverPart: "",
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {}, 5000);
  },

  methods: {
    clickEvent(e) {
      if (e == "关闭窗口") {
        _Global.applyEvent("界面开关", "setting", false);
      }
    }, 
    clickTitle(item) { 
      this.childTitle = item;
    },
  },
};
</script>

<style scoped>


</style>