
// 场景设置
<template>
  <!-- 顶部 -->
  <input
    class="w-full border-gray-200 border  px-1 input-bg"
    ref="input"
    type="number"
    :step="step"
    :value="value" 
    @focus="focus"
    @blur="blur"  
    @keydown.native="checkNumber"
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
    this.$refs.input.addEventListener("input", function (e) {
      // this.$emit("OnInput",this.value);
      let value = e.srcElement.value;
      // value = value.replace(/[^\-?\d.]/g,'');
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
    checkNumber(e){
      e.target.value = e.target.value.replace(/[^\d]/g,''); 
    },
    focus() {
      
      if(this.$parent.focus){
        this.$parent.focus();
        return;
      }
      if(this.$parent.$parent.removeThreeJSfocus){
        this.$parent.$parent.removeThreeJSfocus();
      }
    },
    blur() {},
  },
};
</script>

<style scoped></style>
