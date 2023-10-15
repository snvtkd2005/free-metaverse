
// 场景设置
<template>
  <!-- 顶部 -->

  <input  ref="input" type="color" :value="value" >
  <div>{{ value }}</div>
</template>

<script>

export default {
  props: ["type", "value", "callback"],
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
      that.callback(this.value);
    });

  },
  methods: {


    focus() {
      this.$parent.$parent.removeThreeJSfocus();
    },
    blur() {},
  },
};
</script>

<style scoped></style>
