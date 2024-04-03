
// 场景设置
<template>
  <!-- 顶部 -->
  <input class=" w-full px-1 input-bg" ref="input" type="text" :value="value" @focus="focus" @blur="blur">
</template>

<script>

export default {
  props: ["type", "index", "value", "callback"],
  components: {

  },
  data() {
    return {
    };
  },
  created() {

  },
  mounted() {
    let that = this;
    this.$refs.input.addEventListener('input', function () {
      // console.log(" input text ",this.value);
      // this.$emit("OnInput",this.value);
      if (that.index != undefined) {
        that.callback(that.index, this.value);
      } else {
        that.callback(this.value);
      }
    });

  },
  methods: {

    focus() {
      
      if(this.$parent.focus){
        this.$parent.focus();
        return;
      }
      if(this.$parent.$parent.removeThreeJSfocus){
        this.$parent.$parent.removeThreeJSfocus();
      }
    },
    blur() { },

  },
};
</script>

<style scoped></style>
