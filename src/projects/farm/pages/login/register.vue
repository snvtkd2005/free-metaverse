<template>

<!-- 移动端 -->
<div class=" md:hidden h-full w-full z-0"> 
 
  <div class="bg-gray-100 w-full h-full flex">
    <!-- 注册框    mx-auto mr-32 使用mr-32时，需使用mx-auto才有效？-->
    <div class="flex mx-auto  w-full h-full">
      <div
        class="
        
          rounded-lg
          w-72
          h-5/6
          mx-auto
          self-center
          mt-20
        "
      >
        <div class="w-4/5 mx-auto">
          <h1 class="text-center text-2xl mt-10 font-bold">账号注册</h1>
          <div class="mt-10  ">
            <div class="  flex border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="text"
                v-model="form.phone"
                placeholder="请输入手机号"
              />
            </div>
            <div class="flex mt-4 border-b-2 h-8 justify-between">
              <input
                class="outline-none w-1/2 bg-transparent placeholder-gray-400"
                type="text"
                v-model="form.code"
                placeholder="请输入验证码"
              />
              <button class="bg-blue-500 rounded-md text-white w-20 h-6 text-xs"
              @click="SendSmsCode()"
              >
                获取验证码
              </button>
            </div>
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
              />
            </div>
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="form.repassword"
                placeholder="请再次输入密码"
              />
            </div>
            <p v-if="error != ''" class="text-red-500 text-sm absolute">
              {{ error }}
            </p>
          </div>

          <div
            class="
              login
              ml-2
              mr-2
              rounded-md
              bg-blue-500
              text-white
              mt-10
              cursor-pointer
            "
            @click="submitForm()"
          >
            注册
          </div>
          <div class="flex justify-center mt-10 text-sm text-center">
            <div>已有账号？</div>
            <div class="text-blue-400 cursor-pointer" @click="CallRegister()">立即登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>



<div class="hidden md:block h-715px w-full relative"> 
  <img class=" absolute z-0 w-full h-full " :src="$localUrl+'images/pics/fixed/登录bg.png'" alt="">
  <div class=" absolute z-10 right-20 ">

  <div  class=" w-full h-695px flex">
    <!-- 注册框    mx-auto mr-32 使用mr-32时，需使用mx-auto才有效？-->
    <div class="flex mx-auto mr-32 mt-32">
      <div
        class="
          bg-white
          rounded-lg
          w-72
          h-5/6
          bg-gradient-to-tr
          from-blue-100
          to-white
        "
      >
        <div class="w-4/5 mx-auto">
          <h1 class="text-center text-2xl mt-10 font-bold">账号注册</h1>
          <div class="mt-10  ">
            <div class="  flex border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="text"
                v-model="form.phone"
                placeholder="请输入手机号"
              />
            </div>

            
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
              />
            </div>
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="form.repassword"
                placeholder="请再次输入密码"
              />
            </div>

            <div class="flex mt-4 border-b-2 h-8 justify-between">
              <input
                class="outline-none w-1/2 bg-transparent placeholder-gray-400"
                type="text"
                v-model="form.code"
                placeholder="请输入验证码"
              />
              <button class=" rounded-md text-white w-20 h-6 text-xs"
              @click="SendSmsCode()"
              :disabled="countDownText!='获取验证码'"
              :class="countDownText=='获取验证码'?' bg-blue-500 cursor-pointer ':' bg-gray-500'"
              >
               {{countDownText}} 
              </button>
            </div>
            
            <p v-if="error != ''" class="text-red-500 text-sm absolute">
              {{ error }}
            </p>
          </div>

          <div
            class="
              login
              ml-2
              mr-2
              rounded-md
              bg-blue-500
              text-white
              mt-10
              cursor-pointer
            "
            @click="submitForm()"
          >
            注册
          </div>
          <div class="flex justify-center mt-10 text-sm text-center">
            <div>已有账号？</div>
            <div class="text-blue-400 cursor-pointer" @click="CallRegister()">立即登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

</div>



 

</template>

<script> 


//注册接口
import {
  SendSmsCodeAPI,
  PostUserRegisterAPI, 
  PostUserregisterPhoneAPI,
} from "/@/utils/api.js";


export default {
  // name: "Login",
  components: {
  },
  data() {
    return {
      token: "",
      error: "",
      form: {
        phone: "18616285155",
        userName: "",
        code: "",
        password: "1",
        repassword: "1",
      },  
      countDown:60,
      countDownText :"获取验证码",
    };
  },

  mounted() {
 
  },
  methods: {
    countDownTime(){
      
      this.countDown = 59;
      this.countDownText =  this.countDown+"秒";
      var that = this;
      var timer = setInterval(function () {
         that.countDown --;
        that.countDownText =  that.countDown+"秒";
         if(that.countDown<=0){
          clearInterval(timer); //清除计时器
           that.countDownText ="获取验证码";
         }
      }, 1000);
    },
    CheckInvaild(){

      if(!this.CheckPhone()){
        return false;
      }

      var repassword = this.form.repassword;
      var password = this.form.password;

      //效验输入合法性
      if (repassword == "" || password == "") {
        console.log("用户名为空");
        this.SetErrorContent("用户名或密码不能为空");
        return false;
      }

      if (repassword != password ) {
        this.SetErrorContent("重复密码不相同");
        return false;
      }

      if (this.form.password.length < 6 || this.form.repassword.length < 6  ) {
        this.SetErrorContent("密码需要至少6位");
        return;
      }
      if (this.form.code == "" ) {
        this.SetErrorContent("请输入验证码");
        return false;
      }
      if (this.form.code.length != 6 ) {
        this.SetErrorContent("验证码错误");
        return false;
      }
      return true;
    },
    //判断手机号码是否正确
    CheckPhone(){
      if (this.form.phone.length <= 0) {
        this.SetErrorContent("请输入手机号");
        // this.$message.error("请输入手机号");
        return false;
      }else if(!(/^1[3-9][0-9]\d{8}$/.test(this.form.phone))){
        this.SetErrorContent("请输入正确手机号");
        return false;
      }
      return true;
    },
    //发送验证码
    SendSmsCode(){
      if(!this.CheckPhone()){
        return;
      }
      this.countDownTime();
      // return;
      console.log("发送短信验证码 ==  " +this.form.phone  );
      let fromData = new FormData();
      fromData.append("phone", this.form.phone);
      fromData.append("type","注册");
      SendSmsCodeAPI(fromData).then((response) => {
        console.log(response);
      });
    },
    //切换注册和登录
    CallRegister() {
      this.$parent.$parent.ChangePanel("登录");
    },
    // 忘记密码
    ForgetPassword(){
      this.$parent.$parent.ChangePanel("忘记密码");
    },
 
    AddPlayer(token) {
      //添加用户
      let params = new FormData();
      params.append("userName", "张三");
      params.append("password", "111111");
      params.append("name", "111111");
      params.append("gender", "1");
      params.append("age", "111");
      params.append("phone", "11111111111");
      params.append("roleId", "55cdfefe-8662-4e61-8aed-6aa9d9a94b91");
      params.append("classsId", "2021-2-3");

      console.log(" AddPlayer get token = " + token);
      var that = this;
      this.$axios
        .post("/api/user/increase", params, {
          headers: { Authorization: token },
        })
        .then(function (response) {
          console.log(response);
          console.log("AddPlayer 成功啦 = " + response.data.message);
          if (response.data.message == "账号已存在") {
          }
          that.GetAllPlayer(token);
        })
        .catch(function (err) {
          console.log("AddPlayer 报错啦 = " + err);
        });
    },
    submitForm() {
      if(!this.CheckInvaild()){
        return;
      }

        // this.LoginCompleted(); return;

      //192.168.0.184:8080/api/user/login
      //userName,password
      // var userName = "admin";
      // var password = "123456";
 
      //注册
      let fromData = new FormData();
      // fromData.append("userName", userName);
      fromData.append("phone", this.form.phone);
      fromData.append("password", this.form.password);
      fromData.append("code", this.form.code);
      
      var that = this;
      PostUserregisterPhoneAPI(fromData).then((response) => {
        // console.log(response);
        if (response == "验证码无效") {
          that.SetErrorContent("验证码无效");
          return;
        }
        if (response == "该手机号已注册") {
          that.SetErrorContent("该手机号已注册");
          return;
        }
        
        if (response == "注册成功") {
          that.token = response.data;
          that.LoginCompleted();
        }
      });
      // .catch(function (err) {
      //     console.log("报错啦 = " + err);
      //   });
    },
    SetErrorContent(e) {
      this.error = e;

      setTimeout(() => {
        this.error = "";
      }, 3000);
    },
    LoginCompleted() {
      let isMobile = document.documentElement.clientHeight>document.documentElement.clientWidth;
      if(isMobile){
        this.$router.push("/UserCenter-m"); //页面跳转 移动端用户中心
      }else{
        this.$router.push("/UserCenter"); //页面跳转 
      }

      // this.$router.push("/index"); //页面跳转 
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     alert("submit!");
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
  },
};
</script>

<style>

</style>
