 
<template> 
  <input ref="input" type="range" :value="value" :step="step" :min="min" :max="max" @focus="focus" @blur="blur">
</template>

<script>

export default {
  props: ["type", "index", "value", "step", "min", "max", "callback"],
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
      
      if (that.index != undefined) {
        that.callback(that.index, parseFloat(this.value));
      } else {
        that.callback(parseFloat(this.value));
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
