 
<template>
  <!-- 场景模型列表 -->
  
        <!-- 单品名:{{ folderBase }} 总模型数量： {{modelList.length}} -->
  <div class="  w-full h-full pb-10  overflow-y-auto  overscroll-auto bg-gray-600 text-gray-100  ">
    <div class=" font-bold ">{{title}}</div>
    <div v-for="(item, i) in modelList" :key="i" class=" w-auto text-left text-xs hover:bg-gray-500 px-1   "
      @click="SelectModel(item)" :class="selectUUID==item.uuid?' bg-black ':''">
      <div class=" flex justify-between h-6 ">
        <div class=" w-full flex  justify-between ">
          <div class=" self-center truncate">
            {{ item.name }} {{ (item.modelType=='NPC模型'? item.npcName:'') }}
          </div>
          <div class=" self-center text-left truncate w-12">
            {{ item.modelType }}
          </div>
        </div>
        <!-- <div class=" ml-2 mt-1 w-8 "> 
          <div>锁定</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>



export default {
  name: "HierarchyPanel",
  props: ['title','modelList'],
  components: {

  },
  data() {
    return {
      selectUUID:"",
    };
  },
  created() {


  },
  mounted() {

  },
  methods: {
    // 在3d中点击模型，反向设置检视面板选中状态
    SelectModelBy3d(uuid){
      for (let i = 0; i < this.modelList.length; i++) {
        const element = this.modelList[i];
        if(element.uuid == uuid){
          this.selectUUID = uuid;
        }
      }
    },
    // 点击检视面板选中模型
    SelectModel(item) {
      console.log(" 点击检视面板选中模型 ",item);
      this.selectUUID = item.uuid; 
      this.$parent.SetSelectTransformByUUID(item.uuid);
    },


  },
};
</script>
 
<style scoped></style>