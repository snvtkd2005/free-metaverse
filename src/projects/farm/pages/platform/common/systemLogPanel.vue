
<template>
  <div class="absolute left-0 top-0 w-full h-full pointer-events-none">
    <!-- 系统消息 -->
    <div
      ref="logList"
      class="absolute left-96 bottom-32 w-auto h-auto max-h-24 transform origin-bottom overflow-hidden overflow-y-hidden"
    >
      <div v-for="(item, i) in logList" :key="item" :index="i" class="w-full">
        <div class="py-px text-white text-left">
          <div class="ml-1 leading-5">{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemLogPanel",
  components: {},
  data() {
    return {
      logList: [
        // "玩家sdfsdf开启了直播互动"
      ],
      contentList: [],
      later: null,
      indel: false,
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      setTimeout(() => {
        _Global.addEventListener("系统消息", (type, v) => {
          let content = v || type;
          this.log(content);
          this.indel = true;
        });
      }, 5000);
    }, 3000);

    setInterval(() => {
      if (!this.indel) {
        return;
      }
      if (this.logList.length > 0) {
        this.logList.splice(0, 1);
        if (this.logList.length == 0) {
          this.indel = false;
        }
      }
    }, 10000);
  },
  methods: {
    log(content) {
      this.logList.push(content);

      if (this.logList.length > 10) {
        this.logList.splice(0, 1);
      }
      if (this.later != null) {
        clearTimeout(this.later);
        this.later = null;
      }
      this.later = setTimeout(() => {
        this.$refs.logList.scrollTop = this.$refs.logList.scrollHeight;
      }, 100);
    },
  },
};
</script>
  