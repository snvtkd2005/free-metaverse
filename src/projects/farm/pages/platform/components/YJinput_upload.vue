
// 开关按钮
<template>
  <!-- 顶部 -->
  <div class=" w-full h-full rounded-sm bg-gray-50 flex" @click="callback(index, !value)">
    <el-upload class="bg-transparent" action="" :before-upload="handleBeforeUpload" :accept="accept"
      :show-file-list="false">
      <div class="p-2 w-20 cursor-pointer bg-gray-500
            hover:bg-546770">上传</div>
    </el-upload>

  </div>
</template>

<script>

export default {
  props: ["index","accept", "callback"],
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


  },
};
</script>

<style scoped></style>
