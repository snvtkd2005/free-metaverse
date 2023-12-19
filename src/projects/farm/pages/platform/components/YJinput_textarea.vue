
// 场景设置
<template>
   <textarea name=""  class=" w-full  px-1 border" id="" ref="input" :value="value"  cols="10" rows="10"
           @focus="focus"
        @blur="blur"></textarea>
</template>

<script>

export default {
  props: ["type","index","value","callback"],
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
      if(that.index != undefined){
        that.callback(that.index,this.value);
      }else{
        that.callback(this.value);
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
