

<template>
  
  <!-- onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" -->
  <div class=" flex space-x-2">
    <div class=" text-white leading-6">x:</div>
    <input class=" w-12 pl-0.5 input-bg" ref="inputX" type="number" :step="step" :value="value[0]"
            @focus="focus"  @blur="blur"   >
    <div class=" text-white leading-6">y:</div>

    <input class=" w-12 pl-0.5 input-bg" ref="inputY" type="number" :step="step" :value="value[1]"
            @focus="focus"  @blur="blur" >
    <div class=" text-white leading-6">z:</div>

    <input class=" w-12 pl-0.5 input-bg" ref="inputZ" type="number" :step="step" :value="value[2]"
            @focus="focus"  @blur="blur"   > 
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
      let value = e.srcElement.value;
      value = value.replace(/[^\-?\d.]/g,'');
      this.value[0] = parseFloat( e.srcElement.value); 
      this.emit();

    });
    this.$refs.inputY.addEventListener('input',(e)=> { 
      let value = e.srcElement.value;
      value = value.replace(/[^\-?\d.]/g,'');
      this.value[1] =  parseFloat( e.srcElement.value); 
      this.emit();
    });    
    this.$refs.inputZ.addEventListener('input', (e)=> {
      let value = e.srcElement.value;
      value = value.replace(/[^\-?\d.]/g,'');
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
