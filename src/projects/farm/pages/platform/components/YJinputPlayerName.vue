

<template>
  <!-- 昵称输入框 -->
  <div class="  ">
    <!-- 输入昵称 -->
    <div class=" w-full flex">
      <div class=" relative flex w-auto h-10  mx-auto ">
        <div class=" self-center mr-2 ">昵称:</div>
        <!-- bg-transparent  -->
        <input ref="nickNameInput" class="  
                           rounded-lg shadow-sm
                            h-full
                            w-24
                            px-2
                            outline-none
                          " v-model="userName" :placeholder="enterUserName" />
        <!-- @keyup.enter="ClickeSelectOK"  -->
      </div>
    </div>
    <div v-if="canVR">支持VR</div>
  </div>
</template>

<script>

export default {
  props: ["callback"],
  components: {

  },
  data() {
    return {
      userName: "",
      enterUserName: "输入昵称",
    };
  },
  created() {
  },
  mounted() {
    if (localStorage.getItem("userName")) {
      this.userName = localStorage.getItem("userName");
    }

    //输入框重新获取焦点
    this.$refs.nickNameInput.focus();
    this.$refs.nickNameInput.addEventListener('input', () => {
      localStorage.setItem("userName", this.userName);

      this.callback(this.userName);
    });

  },
  methods: {


  },
};
</script>

<style scoped></style>
