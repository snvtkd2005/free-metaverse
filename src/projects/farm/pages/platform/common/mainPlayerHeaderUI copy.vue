
<template>
  <!-- 左上角血条头像 -->
  <div
    v-if="display"
    class="absolute left-4 top-4 h-20 flex text-white origin-top-left transform scale-50 xl:scale-100"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <!--整个背景ui  -->
    <img class=" " :src="headerBGUrl" alt="" />

    <!-- 头像 -->
    <div class="absolute left-3 -z-10 mt-2 w-10 h-10 ">
      <img class="w-full h-full rounded-full" :src="baseData.playerImg" alt="" />
    </div>

    <!-- 等级背景UI -->
    <div class="   ">
      <img
        class="absolute left-1 bottom-5 w-6 h-6"
        :src="levelBGUrl"
        alt=""
      />
    </div>
    <!-- style="width:189px;height:66px;" -->
    <div class="absolute left-0 bottom-4 w-8 h-8 flex">
      <!-- 等级文字 -->
      <div class="absolute right-px bottom-px w-full h-full text-xs flex">
        <div class="text-yellow-500 self-center mx-auto">
          {{ baseData.level }}
        </div>
      </div>
    </div>
    <!--  -->
    <div
      class="absolute bg-opacity-40 -z-10 left-14 top-0 w-name h-4 leading-4 mt-1.5 pt-px bg-black   text-center text-yellow-500 truncate"
    >
      {{ baseData.name }}
    </div>

    <div class="absolute -z-10 left-14 top-0 w-name h-12 mt-7">
      <div class="relative">
        <div class="h-2 relative">
          <div
            class="h-full bg-green-500"
            :style="'width: ' + GetHealth() + '%'"
          ></div>
          <div
            v-if="hover"
            class="absolute left-0 top-0 w-full text-center text-xs"
          >
            {{ this.baseData.health + "/" + this.baseData.maxHealth }}
          </div>
        </div>
        <div class="h-2 relative">
          <div
            class="h-full bg-blue-500"
            :style="'width: ' + GetEnergy() + '%'"
          ></div>
          <div
            v-if="hover"
            class="absolute left-0 top-0 w-full text-center text-xs"
          >
            {{ this.energy + "/" + this.maxEnergy }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mainPlayerHeaderUI",
  components: {},
  data() {
    return {
      display: true,
      // display: false,
      hover: false,
      energy: 100, //能量值
      maxEnergy: 100, //最大能量值
      baseData: {
        name: "wer", //名字
        playerImg: "https://snvtkd2005.com/socketIoServer/socketIoServer/uploads/1697436993131/thumb.png", //头像
        level: 1, //等级
        health: 100, //生命值
        maxHealth: 100, //最大生命值
      },
      headerBGUrl: "./public/images/cursorList/headerBG_clear.png",
      // headerBGUrl: "./public/images/cursorList/targetingframe/ui-focustargetingframe.png",

      // headerBGUrl: "./public/images/cursorList/headerBG.png",
      levelBGUrl: "./public/images/cursorList/levelBG.png",
    };
  },
  created() {},
  mounted() {
    _Global.addEventListener("主角生命值", (h, maxH) => {
      this.baseData.health = h;
      this.baseData.maxHealth = maxH;
    });
    _Global.addEventListener("升级", (level) => {
      this.baseData.level = level;
    });
    _Global.addEventListener("主角姓名", (s) => {
      this.baseData.name = s;
    });
    _Global.addEventListener("主角头像", (s) => {
      console.log("主角头像", s);
      this.baseData.playerImg = this.$uploadUrl + s.id + "/" + s.icon;
    });

    _Global.addEventListener("设置技能进度条", (msg) => {
      // this.$refs.skillProgressUI.SetProgress(msg);
    });
  },
  methods: {
    GetHealth() {
      return parseInt((this.baseData.health / this.baseData.maxHealth) * 100);
    },
    GetEnergy() {
      return parseInt((this.energy / this.maxEnergy) * 100);
    },
  },
};
</script>

<style scoped>
.w-name{
  width: 90px;
}
</style>
 