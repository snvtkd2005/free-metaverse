<template>
  <div class=" w-full h-full  relative flex  bg-transparent">
    <!-- 登陆框  -->
    <div class="flex mx-auto self-center 
                      bg-gray-100
                      rounded-3xl shadow-md
                      w-96 transform scale-x-110
                      h-96">

      <div class="w-4/5 mx-auto transform scale-x-90">
        <h1 class="text-center text-2xl mt-10 font-bold ">欢迎登录</h1>
        <div class="mt-10">
          <div class="flex border-b-2 h-10">
            <div class=" hidden w-6 h-6 mt-1">
              <!-- <img
                      class="w-full h-full"
                      src="/@/assets/images/czwx/icon-1.png"
                      alt=""
                    /> -->
            </div>

            <input class="outline-none bg-transparent placeholder-gray-400 p-1" type="text" v-model="form.phone"
              placeholder="请输入手机号" />
          </div>
          <div class="password flex mt-4 border-b-2 h-10 relative ">
            <div class="  hidden w-6 h-6 mt-1">
              <!-- <img
                      class="w-full h-full"
                      src="/@/assets/images/czwx/icon-2.png"
                      alt=""
                    /> -->
            </div>
            <input class="outline-none bg-transparent placeholder-gray-400 p-1" type="text"
              v-model="form.verificationCode" placeholder="请输入验证码" />
            <div class=" absolute right-0 bottom-1 p-2 w-24 bg-gray-100 shadow-md rounded-md cursor-pointer "
              @click="GetVerificationCode()">{{ verificationTip }}</div>

          </div>

          <div class=" flex mt-4 border-b-2 h-10">
            <input class="outline-none bg-transparent placeholder-gray-400 p-1" type="text" v-model="form.invitationCode"
              placeholder="请输入邀请码" />
          </div>
          <div class=" hidden
                            forget
                            text-sm text-blue-400 text-right
                            mt-1
                            cursor-pointer
                          " @click="ForgetPassword()">
            忘记密码？
          </div>
          <p v-if="error != ''" class="text-red-500 text-sm absolute">
            {{ error }}
          </p>
        </div>

        <div class="
                          login
                          ml-2
                          mr-2
                          rounded-md
                          bg-blue-500
                          text-white
                          mt-10 py-2
                          cursor-pointer
                        " @click="submitForm()">
          登录
        </div>
        <div class=" hidden justify-center mt-10 text-sm text-center">
          <div>还没有账号？</div>
          <div class="text-blue-400 cursor-pointer" @click="CallRegister()">
            免费注册
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  SendSmsCodeAPI,
  PostUserLoginAPI,
  PostUserLoginPhoneAPI,
} from "/@/utils/api.js";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      token: "",
      error: "",
      form: {
        phone: "",
        userName: "",
        password: "",
        verificationCode: "",
        invitationCode: "",
      },
      sendVerCompleted: false,
      verificationTip: "获取验证码",
      times: 60,
    };
  },

  mounted() { },
  methods: {
    GetVerificationCode() {
      if (this.sendVerCompleted) { return; }
      this.sendVerCompleted = true;

      this.times--;
      this.verificationTip = this.times + " s";

      // 60秒倒计时
      let interval = setInterval(() => {
        if (this.times <= 0) {
          if (interval != undefined) {
            clearInterval(interval);
          }
          this.times = 60;
          this.sendVerCompleted = false;
          this.verificationTip = "获取验证码";
          return;
        }
        this.times--;
        this.verificationTip = this.times + " s";
      }, 1000);
    },
    //切换注册和登录
    CallRegister() {
      this.$parent.$parent.ChangePanel("注册");
    },
    // 忘记密码
    ForgetPassword() {
      this.$parent.$parent.ChangePanel("忘记密码");
    },

    //判断手机号码是否正确
    CheckPhone() {
      if (this.form.phone.length <= 0) {
        this.SetErrorContent("请输入手机号");
        return false;
      } else if (!/^1[3-9][0-9]\d{8}$/.test(this.form.phone)) {
        this.SetErrorContent("请输入正确手机号");
        return false;
      }
      return true;
    },
    submitForm() {
      if (!this.CheckPhone()) {
        return;
      }
      //效验输入合法性
      if (this.form.password == "") {
        this.SetErrorContent("请输入密码");
        return;
      }

      if (this.form.password.length < 6) {
        this.SetErrorContent("密码错误");
        return;
      }
      //登录
      var phone = this.form.phone;

      let fromData = new FormData();
      // fromData.append("userName", userName);
      fromData.append("phone", phone);
      fromData.append("password", this.form.password);
      var that = this;
      PostUserLoginPhoneAPI(fromData).then((response) => {
        if (response == "手机号或密码无效") {
          this.SetErrorContent("手机号或密码无效");
          return;
        }

        sessionStorage.setItem("isLogin", true);
        sessionStorage.setItem("phone", phone);
        this.$store.commit("updateUser", {
          // name: userName,
          phone: phone,
          role: response.role,
        });
        sessionStorage.setItem("state", JSON.stringify(this.$store.state));
        that.LoginCompleted();
        //登录后传给导航栏的登录按钮，改变其状态
        that.$parent.$parent.$parent.$parent.SetLoginState();
      });
      return;
      // this.LoginCompleted(); return;
    },
    SetErrorContent(e) {
      this.error = e;

      setTimeout(() => {
        this.error = "";
      }, 3000);
    },
    LoginCompleted() {
      let isMobile =
        document.documentElement.clientHeight >
        document.documentElement.clientWidth;
      if (isMobile) {
        this.$router.push("/UserCenter"); //页面跳转 移动端用户中心
      } else {
        this.$router.push("/UserCenter"); //页面跳转
      }
    },
  },
};
</script>

<style></style>
