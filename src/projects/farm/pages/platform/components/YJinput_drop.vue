
<template>
  <el-select v-model="value" placeholder="请选择" @change="onChange">
    <el-option class=" text-white" v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>

export default {
  props: ["index","value","options", "callback"],
  components: {
  },
  data() {
    return {
      
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    onChange(e){
      if(this.index != undefined){
        this.callback(this.index,this.value);
      }else{
        this.callback(this.value);
      } 
    }

  },
};
</script>

<style>
/* .--el-input-bg-color{
  background-color: black !important;
  color: white !important;
}
.--el-select-input-focus-border-color{
  color: white !important;
}
.el-input__inner{
  
  background-color: black !important;
  color: rgb(255, 255, 255) !important;
}
.el-select-dropdown__item{
  
  background-color: black !important;
  color: rgb(156, 156, 156) !important;
} */
</style>
