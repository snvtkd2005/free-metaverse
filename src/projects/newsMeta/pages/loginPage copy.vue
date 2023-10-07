<template>
  <div class="loginPage">
    <div class="phoneIpt">
      <input type="text" placeholder="请输入手机号" v-model="phoneIpt" />
    </div>
    <div class="verify">
      <input class="num" v-model="verifyCode" placeholder="请输入验证码" />
      <div class="getCode" @click="getCode">获取验证码</div>
    </div>
    <div class="toMainpage" @click="loginMed">登录</div>
  </div>
</template>

<script>
import { loginUser, getsmsCode } from "../requestApi/loginApi";
export default {
  data() {
    return {
      phoneIpt: "",
      verifyCode: "",
    };
  },
  methods: {
    getCode() {
      let options = {
        mobile: this.phoneIpt,
      };
      getsmsCode(options).then((res) => {
        console.log(res);
        if (res.data.success) {
          //   弹出一个引导框
          console.log("发送成功");
        }
      });
    },
    loginMed() {
      let option = {
        mobile: this.phoneIpt,
        sms: this.verifyCode,
      };
      loginUser(option).then((res) => {
        console.log(res);
        if (res.data.success) {
          const token = res.data.data.token;
          localStorage.setItem("apiToken", token);
          localStorage.setItem(
            "loginInfo",
            JSON.stringify(res.data.data.user_info)
          );

          _Global.userData = res.data.data.user_info;
          // 弹出一个引导框
          this.$router.replace({
            path:"/newsmeta"
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.loginPage {
  width: 500px;
  height: 350px;
  border: 1px solid black;
  padding: 50px;
}
.verify {
  display: flex;
  margin: 20px;
}
.num {
  width: 100px;
  height: 30px;
  border: 1px solid black;
}
</style>
