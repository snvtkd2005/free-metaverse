
// 场景设置
<template>
  <!-- 顶部 -->

  <input  ref="input" type="color" :value="value" >
  <div>{{ value }}</div>
</template>

<script>

export default {
  props: ["type","index", "value", "callback"],
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
      // this.$emit("OnInput",this.value);
      
      if (that.index != undefined) {
        that.callback(that.index, (this.value));
      } else {
        that.callback((this.value));
      }
    });

  },
  methods: {


    focus() {
      if(this.$parent.$parent.removeThreeJSfocus){
        this.$parent.$parent.removeThreeJSfocus();
      }
    },
    blur() {},
  },
};
</script>

<style scoped></style>
