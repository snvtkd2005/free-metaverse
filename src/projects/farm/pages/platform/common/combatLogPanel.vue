
<template>
  <div class="absolute left-0 top-0 w-full h-full pointer-events-none">
    <!-- 战斗记录 -->
    <div
      ref="combatLog"
      class="absolute left-2 bottom-32 w-auto h-auto max-h-24 transform origin-bottom overflow-hidden overflow-y-hidden"
    >
      <div v-for="(item, i) in combatLog" :key="item" :index="i" class="w-full">
        <div class="py-px text-white text-left">
          <div class="ml-1 leading-5">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { YJCombatLog } from "../../../js/YJCombatLog.js";

export default {
  name: "CombatPanel",
  components: {},
  data() {
    return {
      combatLog: [],
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      if (_Global.setting.inEditor) {
        return;
      }
      new YJCombatLog(this);
      setTimeout(() => {
        _Global.addEventListener("战斗开始", () => {
          this.combatLog = [];
        });
      }, 5000);
    }, 3000);
  },
  methods: {
    log(content) {
      this.combatLog.push(content);

      setTimeout(() => {
        this.$refs.combatLog.scrollTop = this.$refs.combatLog.scrollHeight;
      }, 20);
    },
  },
};
</script>
  