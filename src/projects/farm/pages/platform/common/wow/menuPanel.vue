<template>
  <div class="w-full h-full relative flex pointer-events-none">
    <!-- 游戏菜单 -->
    <div class="absolute left-0 top-24 xl:top-52 w-96  transform scale-75 xl:scale-100 mx-auto flex">
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
.cursor-pointer {
    /* cursor: pointer; */
    cursor: none;
}
</style>