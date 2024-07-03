
<template>
  <!-- 战斗记录 -->
    <div
      ref="combatLog"
      class="absolute right-2 bottom-2 w-auto h-auto max-h-72 transform origin-bottom overflow-hidden overflow-y-hidden"
    >
      <div v-for="(item, i) in combatLog" :key="item" :index="i" class="w-full">
        <div class="py-px text-white text-left">
          <div class="ml-1 leading-5">{{ item }}</div>
        </div> 
    </div>
  </div>
</template>

<script>
import { YJCombatLog } from "../../../js/YJCombatLog.js";

export default {
  name: "combatLogPanel",
  components: {},
  data() {
    return {
      combatLog: [],
      dmLogContent: "",
      dmLogType: "", //弹幕玩家/敌方npc/我发npc
    };
  },
  created() {},
  mounted() {
    new YJCombatLog(this);
  },
  methods: {
    DMlog(text, type) {
      if (
        this.dmLogContent != "" &&
        this.dmLogType == "弹幕玩家" &&
        type != "弹幕玩家"
      ) {
        // 非弹幕玩家的消息无法打断弹幕玩家的弹窗
        return;
      }
      this.dmLogContent = text;
      this.dmLogType = type;
      if (this.laterDMlog) {
        clearTimeout(this.laterDMlog);
      }
      this.laterDMlog = setTimeout(() => {
        this.dmLogContent = "";
      }, 3000);
    },
    log(content) {
      this.combatLog.push(content);
      setTimeout(() => {
        this.$refs.combatLog.scrollTop = this.$refs.combatLog.scrollHeight;
      }, 20);
    },
  },
};
</script>
 
<style scoped></style>