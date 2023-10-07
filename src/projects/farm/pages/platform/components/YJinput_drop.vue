
// 开关按钮
<template>
  <el-select v-model="value" placeholder="请选择" @change="onChange">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
      // options: [
      //   {
      //   value: '选项1',
      //   label: '黄金糕'
      // }, {
      //   value: '选项2',
      //   label: '双皮奶'
      // }, {
      //   value: '选项3',
      //   label: '蚵仔煎'
      // }, {
      //   value: '选项4',
      //   label: '龙须面'
      // }, {
      //   value: '选项5',
      //   label: '北京烤鸭'
      // }
    // ],
      // value: ''
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

<style scoped></style>
