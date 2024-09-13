

<template>
  <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap">
    <el-table
      :data="itemList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="id" label="ID" width="130" /> 
      <el-table-column prop="name" label="道具名" width="150" />
      <el-table-column label="图标" width="80">
        <template #default="scope">
          <img
            class="w-9 h-9 object-fill hover:opacity-70"
            :src="$uploadUVAnimUrl + scope.row.icon"
          />
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="道具描述" width="280" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "YJinputCtrl_shop",
  props: [],
  components: {},
  data() {
    return { 
      itemList: [],
    };
  },
  created() {},
  mounted() {
    this.itemList = _Global.propList;
  },
  methods: { 
    handleSelectionChange(val) {
      // 有elementUI dialog的，要再加三层parent
      this.$parent.$parent.$parent.$parent.$parent.ChangeEvent('添加商品',val);
    },
  },
};
</script>

<style scoped></style>
