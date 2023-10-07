<template>
  <div class="loginPage x-h-100">
    <div class="main-wrap">
      <div class="left-wrap">
        <div class="login-area">
          <div class="logo"><img src="/images/login/logo.png" alt="logo"></div>
          <div class="welcome">
            <img class="t1" src="/images/login/welcome-txt.png" alt="欢迎进入">
            <img class="t2" src="/images/login/metaworld-txt.png" alt="两会健康策“元宇宙”世界">
          </div>
          <div class="login-wrap">
            <div class="phone-wrap">
              <input type="number" v-model="phoneIpt" class="phone" placeholder="请输入手机号">
              <input type="button" @click="getCode" class="get-code" v-model="btnText">
            </div>
            <div class="code-wrap">
              <input type="number" v-model="verifyCode" class="code" placeholder="请输入验证码">
            </div>
            <div class="login-btn-wrap">
              <input type="button" @click="loginMed" class="login-btn" value="登录">
            </div>
            <div class="declare">
              <p>· 本产品由 百度VR、钛氪、申义、风语筑和数字力场 联合支持</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-wrap">
        <div class="right-txt">
          <img src="/images/login/welcome-txt2-3x.png" alt="" class="t1-1">
          <img src="/images/login/metaworld-txt2-3x.png" alt="" class="t2-1">
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import { loginUser, getsmsCode } from "../requestApi/loginApi";
export default {
  data() {
    return {
      phoneIpt: "",
      verifyCode: "",
      timeNum: 0,
      btnText: '获取验证码',
      oneMinutes: 0, // 倒计时
      timer: null, //
      isEnsure:false,
    };
  },
  methods: {
    async getCode() {
      let options = {
        mobile: this.phoneIpt,
      };
      if (!this.timer && this.oneMinutes === 0) {
        await getsmsCode(options).then((res) => {
          console.log(res);
          if (res.data.success) {
            this.oneMinutes = 60;
            this.disabled = true;
            this.timer = setInterval(() => {
              this.btnText = `${this.oneMinutes}s`;
              this.oneMinutes--;
              if (this.oneMinutes <= 0) {
                this.btnText = '获取验证码';
                this.oneMinutes = 60;
                this.disabled = false;
                clearInterval(this.timer);
              }
            }, 1000)
          }else{
            alert(res.data.message)
          }
        });
      } else {
        return
      }
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
.main-wrap{
  display: flex;
  width: 100%;
  height: 100%;
}
.x-h-100{
  height: 100%;
}
.phone-wrap {
    text-align: center;
    margin: 2rem;
    border-bottom: 1px solid rgb(229, 231, 235);
    display: flex;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  input.phone {
    width: 70%;
    border: none;
    outline: none;
    font-size: 1rem;
  }
  input.code {
    width: 100%;
    border: none;
    outline: none;
    font-size: 1rem;
  }
  input.get-code {
    color: #9ca3af;
    background: none;
    text-align: center;
    width: 30%;
    border: none;
    border-left: 1px solid #d1d5db;
  }
  .code-wrap {
    text-align: center;
    margin: 2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  .login-btn-wrap {
    margin: 2rem;
    text-align: center;
  }
  .declare {
    margin: 1.8rem;
    text-align: center;
    font-size: 0.9rem;
    color: darkgrey;
  }
@media screen and (max-width: 992px) {
  
  .left-wrap {
    background-image: url(/images/login/welcome.png);
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }
  .right-wrap{
    display: none;
    background: green;
  }
  .logo {
    margin: 2rem;
  }
  .logo img{
    width: 4rem;
  }
  .welcome {
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  .t1 {
    width: 28%;
    margin: auto;
    margin-bottom: 1rem;
  }
  .t2 {
    width: 80%;
    margin: auto;
    margin-bottom: 1rem;
  }
  input.login-btn {
    width: 100%;
    line-height: 3rem;
    color: white;
    background: #ffbabd;
    border-radius: 5px;
    font-weight: bold;
    border: none;
  }
}
@media screen and (min-width: 993px) {
  
  .left-wrap {
    width: 60%;
    height: 100%;
  }
  .right-wrap{
    width: 40%;
    background-image:url(/images/login/welcome-big.png);
    background-position: center;
    background-size: cover;
  }
  .login-area{
    width: 76%;
    max-width: 40rem;
    margin: auto;
    margin-top: 6rem;
  }
  .login-wrap{
    width: 76%;
    margin: auto;
    margin-top: 6rem;
  }
  .logo {
    margin: 2rem;
    text-align: center;
  }
  .logo img{
    width: 8rem;
  }
  .welcome {
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    display: none;
  }
  .right-txt {
    margin: auto;
    margin-top: 2rem;
    text-align: center;
  }
  .t1-1 {
    width: 38%;
    margin: 10rem auto 3rem
  }
  .t2-1 {
    width: 78%;
    margin: auto;
    margin-bottom: 1rem;
  }
  .login-btn-wrap {
    margin-top: 4rem;
  }
  input.login-btn {
    width: 100%;
    line-height: 3rem;
    color: #f2cb91;
    background: rgb(203 31 38);
    border-radius: 5px;
    font-weight: bold;
    border: none;
    font-size: 1rem;
  }
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
