 
<template>
  <!-- 场景模型列表 -->
  
        <!-- 单品名:{{ folderBase }} 总模型数量： {{modelList.length}} -->
  <div class=" absolute z-10 left-0 top-32 mt-10 w-auto h-auto max-h-96 overflow-y-scroll bg-gray-600 text-gray-100 ">
    <div>场景模型列表</div>
    <div v-for="(item, i) in modelList" :key="i" class=" w-52 text-left hover:bg-black px-2   h-6   "
      @click="SelectModel(item)">
      <div class=" flex justify-between ">

        <div class=" self-center">
          {{ item.name }}
        </div>
        <div class=" ">
          <div>锁定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>



export default {
  name: "HierarchyPanel",
  props: ['modelList'],
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


    SelectModel(item) {

      _Global.YJ3D._YJSceneManager.SelectModel(item.uuid);
    },


  },
};
</script>
 
<style scoped></style>