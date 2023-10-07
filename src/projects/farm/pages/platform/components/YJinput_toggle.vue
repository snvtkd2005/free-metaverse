
// 开关按钮
<template>
  <!-- 顶部 -->
  <div class=" w-4 h-4 rounded-sm bg-gray-50 flex" @click="callback(index,!value)">
    <div v-if="value" class=" self-center mx-auto w-4 h-4 leading-4 pl-px rounded-sm text-black">
      &#10004
    </div>
  </div>
</template>

<script>

export default {
  props: ["value","index", "callback"],
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
