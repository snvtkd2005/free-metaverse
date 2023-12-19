
// 场景设置
<template>
  <!-- 顶部 -->
  <input
    class="w-full  px-1"
    ref="input"
    type="number"
    :step="step"
    :value="value"
    @focus="focus"
    @blur="blur"
  />
</template>

<script>
export default {
  props: ["type", "index", "step", "value", "callback"],
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    let that = this;
    this.$refs.input.addEventListener("input", function () {
      // this.$emit("OnInput",this.value);
      if(that.type == "int"){
        this.value = parseInt(this.value);
      }
      if (that.index != undefined) {
        that.callback(that.index, parseFloat(this.value));
      } else {
        that.callback(parseFloat(this.value));
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
