<template>
  <!-- 聊天记录 -->
  <div class="
                          xl:flex
                          xl:w-96
                          w-72
                          h-auto
                          absolute
                          right-16
                          bottom-20
                          flex-col
                          justify-between
                          text-white
                          bg-gray-400 bg-opacity-60
                          rounded-lg
                          text-sm
                         origin-bottom-left transform scale-75 xl:scale-100 
                        ">

    <div class="w-full h-auto max-h-80 flex flex-col justify-between relative">
      <div ref="roomChateRecode" class=" w-72  xl:w-full h-auto max-h-72  overflow-y-scroll overscroll-auto  pointer-events-auto">
        <div v-for="(item, i) in chatRecodeArray" :key="i" class="h-auto px-1 text-left break-all ">
          [{{ item.npcName }}]: {{ item.message }}
        </div>
      </div>

    </div>
  </div>


  <!-- </div> -->
</template>


 
<script >

export default {
  components: {
  },
  data() {
    return {
      // 聊天记录
      chatRecodeArray: [],
    };
  },
  created() {

  },
  mounted() {

  },

  methods: {
    AddChat(npcName, message) {
      this.chatRecodeArray.push({ npcName: npcName, message: message });
      
      setTimeout(() => {
        this.$refs.roomChateRecode.scrollTop =
          this.$refs.roomChateRecode.scrollHeight;
      }, 20);
    },

  },
};
</script>