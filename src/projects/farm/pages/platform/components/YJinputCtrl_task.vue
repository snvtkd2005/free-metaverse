

<template>
  <div class="mt-2 overflow-y-scroll h-96 flex flex-wrap">
    <el-table
      :data="taskList"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="id" label="ID" width="130" /> 
      <el-table-column prop="taskTitle" label="任务名" width="150" />
      <el-table-column prop="targetDescribe" label="任务目标描述" width="280" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "YJinputCtrl_task",
  props: [],
  components: {},
  data() {
    return { 
      taskList: [],
    };
  },
  created() {},
  mounted() {
    this.taskList = _Global.taskList;
  },
  methods: { 
    handleSelectionChange(val) {
      // 有elementUI dialog的，要再加三层parent
      this.$parent.$parent.$parent.$parent.$parent.ChangeEvent('添加任务',val);
    },
  },
};
</script>

<style scoped></style>
