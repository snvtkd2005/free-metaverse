
// 在线聊天室 聊天界面  单对单聊天
<template></template>

<script>
export default {
  name: "sandi",
  components: {},
  data() {
    return {};
  },
  mounted() {
    // console.log(this.$route.query);
    if (this.$route.query.id != undefined) {
      let id = this.$route.query.id;
      let x = this.$route.query.coordX;
      let y = this.$route.query.coordY;

      // console.log(id, x, y);

      // this.playerDefaultX = parseInt(this.$route.query.coordX);
      // this.playerDefaultY = parseInt(this.$route.query.coordY);
      // this.userName =
      this.$router.push({

        path: "/chat/index4/3dchat/" + id ,
        // name: "/chat/index4/3dchat/" + id ,
        // query:{id:id,coordX:x,coordY:y}
        query:this.$route.query
      }
        // + "?"+"id=" + id + "&coordX=" + x + "&coordY=" + y
      );
    }
    return;
    this.user = this.$route.params.user;
  },
  methods: {},
};
</script>

  <style scoped>
</style>
