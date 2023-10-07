
// 场景设置
<template>
  <!-- 顶部 -->
  <input class=" w-full" ref="input" type="number" :step="step" :value="value" 
   >
</template>

<script>

export default {
  props: ["type","index","step","value","callback"],
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
    this.$refs.input.addEventListener('input', function (){
      // this.$emit("OnInput",this.value);

      if(that.index != undefined){
        that.callback(that.index,(parseFloat(this.value) ) );

      }else{
        that.callback((parseFloat(this.value)) );
      }
    });
    
  },
  methods: {
    

  },
};
</script>

<style scoped></style>
