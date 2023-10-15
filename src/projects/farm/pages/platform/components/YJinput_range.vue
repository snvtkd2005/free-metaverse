
// 场景设置
<template>
  <!-- 顶部 -->
  <input ref="input" type="range" :value="value" :step="step" :min="min" :max="max"
           @focus="focus"
        @blur="blur">
</template>

<script>

export default {
  props: ["type","value","step","min","max","callback"],
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
      // that.inputValue = this.value;
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
