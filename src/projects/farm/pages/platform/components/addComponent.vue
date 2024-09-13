 
<template> 
  <div class=" mx-auto w-60 h-40 border-px border-gray-400 max-h-96  bg-445760 text-gray-100 ">
    <!-- <div>组件列表</div> -->
    <div v-for="(item, i) in components" :key="i" class=" w-full text-left hover:bg-black px-2 h-6 cursor-pointer   "
      @click="ClickItem(item)">
      <div class=" flex justify-between ">

        <div class=" self-center">
          {{ item.title }}
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddComponentPanel", 
  components: {

  },
  data() {
    return {
      components:[
        {id:"uvAnim",title:"uv动画",},
        {id:"car",title:"汽车",},
      ]
    };
  },
  created() {


  },
  mounted() {

  },
  methods: {
    ClickItem(item) {
      this.$parent.ChangePanel(item.id);
    },


  },
};
</script>
 
<style scoped></style>