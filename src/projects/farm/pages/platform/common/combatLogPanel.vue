
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
      contentList: [],
      later: null,
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

        _Global.addEventListener("获取道具记录", (type, v) => {
          let content = "";

          if (type == "金币") {
            content = "你获得了 " + v + " 金币";
          }
          if (type == "道具") {
            content = "你获得了 " + v + " ";
          }
          if (type == "经验值") {
            content = "你获得了 " + v + " 经验值 ";
          }
          if (type == "技能点") {
            content = "你获得了 " + 1 + "点 技能点 ";
          }
          this.log(content);
        });
      }, 5000);
    }, 3000);

    setInterval(() => {
      if (this.combatLog.length > 10) {
        this.combatLog.splice(0, 1);
      }
    }, 100);
  },
  methods: {
    log(content) {
      this.combatLog.push(content);

      if (this.later != null) {
        clearTimeout(this.later);
        this.later = null;
      }
      this.later = setTimeout(() => {
        this.$refs.combatLog.scrollTop = this.$refs.combatLog.scrollHeight;
      }, 100);
    },
    DMlog(text, type) {},
  },
};
</script>
  