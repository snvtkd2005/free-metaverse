
// 场景设置
<template>
  <!-- 顶部 -->
  <div class=" flex space-x-2">
    <input class=" w-10" ref="inputX" type="number" :step="step" :value="value[0]">
    <input class=" w-10" ref="inputY" type="number" :step="step" :value="value[1]">
    <input class=" w-10" ref="inputZ" type="number" :step="step" :value="value[2]"> 
  </div>
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
    this.$refs.inputX.addEventListener('input', (e)=> {
      // console.log(" eee ",);
      this.value[0] = parseFloat( e.srcElement.value); 
      this.emit();

    });
    this.$refs.inputY.addEventListener('input',(e)=> {
      // this.$emit("OnInput",this.value);
      this.value[1] =  parseFloat( e.srcElement.value); 
      this.emit();
    });    
    this.$refs.inputZ.addEventListener('input', (e)=> {
      this.value[2] =  parseFloat( e.srcElement.value); 
      this.emit();
    });
  },
  methods: {
    emit(){
      if(this.index != undefined){
        this.callback(this.index,this.value);
      }else{
        this.callback(this.value);
      }
    }

  },
};
</script>

<style scoped></style>
