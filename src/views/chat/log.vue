
// 右下角的场景按钮。场景切换界面
<template>
  <!-- 右侧按钮 -->
  <div
    class="
      absolute
      z-50
      right-20
      top-4 
      flex flex-col
      pointer-events-none
    "
  >
    <div class="h-auto flex-col text-base space-y-2">
      <div
        v-for="(item, i) in log"
        :key="i"
        class="
          w-auto
          h-6 
          self-center
          mx-auto 
          flex
          relative 
          text-left
        "
        :class="item.type == 'error' ? 'bg-green-400' : 'bg-gray-400'"
      >
        <div class="w-full h-full self-center mx-auto text-white"> 
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  components: {},
  data() {
    return {
      log: [
        {
          type: "做动作",
          content: "sdfsdf",
        }, 
      ],
    };
  },
  created() {},
  mounted() {
    
  },
  methods: {
    AddLog(content,type) {
      this.log.push({type:type,content:content});
      if(this.log.length>10){
        this.log.shift();
      }
    }, 
  },
};
</script>

