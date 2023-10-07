<template>
  <div class="loginPage x-h-100">
    <div class="main-wrap">
      <div class="left-wrap">
        <div class="login-area">
          <div class="logo"><img :src="publicUrl+'images/login/logo.png'" alt="logo"></div>
          <div class="welcome">
            <img class="t1" :src="publicUrl+'images/login/welcome-txt.png'" alt="欢迎进入">
            <img class="t2" :src="publicUrl+'images/login/metaworld-txt.png'" alt="两会健康策“元宇宙”世界">
          </div>
          <div class="login-wrap">
            <div class="phone-wrap">
              <input type="number" v-model="phoneIpt" @input="phoneNumberCheck" class="phone" placeholder="请输入手机号">
              <input type="button" @click="getCode" class="get-code" v-model="btnText">
            </div>
            <div class="code-wrap">
              <input type="text" v-model="verifyCode" @input="verifyCodeCheck" class="code" placeholder="请输入验证码">
            </div>
            <div class="login-btn-wrap">
              <input type="button" @click="loginMed" class="login-btn" :class="loginBtnEnable?'login-btn-enabled':'login-btn-disabled'" value="登录">
            </div>
            <div class="declare">
              <p>· 申义、数字力场提供技术开发、风语筑提供<br>美术设计、钛氧提供UI设计支持</p>
            </div>
          </div>
        </div>
      </div>
      <div class="right-wrap">
        <div class="right-txt">
          <img :src="publicUrl+'images/login/welcome-txt2-3x.png'" alt="" class="t1-1">
          <img :src="publicUrl+'images/login/metaworld-txt2-3x.png'" alt="" class="t2-1">
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
      publicUrl:'./public/newsMeta/',
      timeNum: 0,
      btnText: '获取验证码',
      oneMinutes: 0, // 倒计时
      timer: null, //
      isEnsure:false,
      loginBtnEnable:false,
    };
  },
  created() {
    // 记得开启
    // this.publicUrl = this.$parent.GetPublicUrl();
    this.redirectRouter()
  },
  methods: {
    redirectRouter(){
      let oldTime = localStorage.getItem("timeStamps")
      if(!oldTime) return
      let timeStamps = new Date().getTime();
      if(timeStamps-oldTime<1800000){
        this.$router.replace('/playerSelect')
        let newtimeStamps = new Date().getTime();
        localStorage.setItem("newtimeStamps",newtimeStamps)
      }
    },
    verifyCodeCheck(){
      this.verifyCode = this.verifyCode+'';
      this.loginBtnEnable = this.verifyCode.length>=6?true:false;
      if(this.verifyCode.length>6){
        this.verifyCode = this.verifyCode.slice(0,6);
      }
    },
    phoneNumberCheck(){
      this.phoneIpt = this.phoneIpt+'';
      if(this.phoneIpt.length>11){
        this.phoneIpt=this.phoneIpt.slice(0,11);
      }
    },
    async getCode() {
      let options = {
        mobile: this.phoneIpt,
      };
      if (!this.timer && this.oneMinutes === 0) {
        await getsmsCode(options).then((res) => {     
          console.log(res);     
          if (res.data.success) {
            //   弹出一个引导框
            alert("发送成功");
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
          let timeStamps = new Date().getTime();
          localStorage.setItem("timeStamps",timeStamps)
          
          localStorage.setItem("apiToken", token);
          localStorage.setItem(
            "loginInfo",
            JSON.stringify(res.data.data.user_info)
          );
          
          _Global.userData = res.data.data.user_info;
          // 弹出一个引导框
          this.$router.replace({
            path:"/playerSelect"
          });
        }
      });
    },    
  },
  mounted() {

    }
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
    cursor: pointer;
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
  .login-btn-enabled{
    background-color:rgb(203 31 38);
    color: rgb(242, 203, 145);
  }
  .login-btn-disabled{
    background-color: #ffbabd;
    color: white;
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
    display: none !important;
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
    border-radius: 5px;
    font-weight: bold;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }
}

.verify {
  display: flex;
  margin: 15px 20px;
  border-bottom: 1px solid #ccc;
}

.phoneIpt {
  border-bottom: 1px solid #ccc;
  margin: 0 20px;
  position: relative;
}

.getCode {
  position: absolute;
  top: 0px;
  right: 0;
  color: #ccc;
}

.toMainpage,
.toMainpage-form {
  margin: 20px;
  text-align: center;
  background: #FFBABD;
  height: 45px;
  line-height: 45px;
  color: #fff;
  border-radius: 8px;
}

.toMainpage-form-act {
  background: #CB1F26
}

.note {
  margin: 20px 30px;
  text-align: center;
  color: #ccc;
  font-size: 14px;
}

.title {
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title-img {
  width: 100px;
}

.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.welcome-img {
  width: 120px;
  padding-bottom: 20px;
}

.welcome-world {
  width: 300px;
  padding-bottom: 20px;
}

@media screen and (min-width: 751px) {
  .width-750-show {
    display: none !important;
  }

  .width-750-hidden {
    flex: 1;
    display: flex !important;
    height: 100vh;
  }
}

.width-750-hidden-left {
  flex: 3;
  position: relative;
}

.width-750-hidden-right {
  flex: 2;
  position: relative;
}

.width-750-hidden-welcome {
  position: absolute;
  top: 20%;
  width: 200px;
  left: 50%;
  transform: translateX(-50%);
}

.width-750-hidden-world {
  position: absolute;
  top: 35%;
  width: 300px;
  left: 50%;
  transform: translateX(-50%);
}

.width-750-hidden-right-img {
  height: 100%
}

.title-750 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}

.width-750-hidden-form {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-90%);
}

@media screen and (max-width: 750px) {
  .width-750-show {
    flex: 1;
    display: block !important;
    height: 100vh;
    position: relative;


  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100vh;
  }

  .width-750-hidden {
    display: none !important;
  }
}
</style>
