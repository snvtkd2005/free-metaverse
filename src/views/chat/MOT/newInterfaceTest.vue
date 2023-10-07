
// 在线聊天室 聊天界面 3d形象 聊天
<template>
  <threePanel ref="threePanel" />
 

</template>

<script>
// 三维页
import threePanel from "./index.vue";

import { MOT_three_Interface } from "/@/threeJS/MOT_three_Interface.js";

export default {
  name: "index",
  components: {
    threePanel,
  },
  data() {
    return { 
    };
  },

  created() {
    this.threeInterface = null;
 
  },
  mounted() {
    this.threeInterface = new MOT_three_Interface(this.$refs.threePanel);
    

    setTimeout(() => {
      this.threeInterface.ChangeViewById(10000);
    }, 5000);
    
    setTimeout(() => {
      this.threeInterface.ChangeViewById(10000);
    }, 1000);
  },
  methods: { 
  },
};
</script>

<style scoped> 
</style>
