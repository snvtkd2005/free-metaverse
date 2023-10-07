<template>
  <div class="loginPage">
    <div class="width-750-show">
      <div class="title">
        <img class="title-img" src="../../../assets/image/report.png">
        <p>健康客户端</p>
      </div>
      <div class="welcome">
        <img class="welcome-img" src="../../../assets/image/welcome.png">
        <img class="welcome-world" src="../../../assets/image/world.png">

      </div>
      <div class="phoneIpt">
        <input type="text" placeholder="请输入手机号" v-model="phoneIpt" />
        <div class="getCode" @click="getCode">{{ btnText }}</div>

      </div>
      <div class="verify">
        <input class="num" v-model="verifyCode" placeholder="请输入验证码" />
      </div>
      <div class="toMainpage" @click="loginMed">登录</div>
      <div class="note">本产品由百度VR、钛氧、申义、风语筑和数字力扬联合支持</div>
      <img class="bg" src="../../../assets/image/bg.png">
    </div>
    <div class="width-750-hidden">
      <div class="width-750-hidden-left">
        <div class="title-750">
          <img class="title-img" src="../../../assets/image/report.png">
          <p>健康客户端</p>
        </div>
      </div>
      <div class="width-750-hidden-form">
        <div class="phoneIpt">
          <input type="text" placeholder="请输入手机号" v-model="phoneIpt" />
          <div class="getCode" @click="getCode">{{ btnText }}</div>

        </div>
        <div class="verify">
          <input class="num" v-model="verifyCode" placeholder="请输入验证码" />
        </div>
        <div class="toMainpage-form" @click="loginMed">登录</div>
        <div class="note">本产品由百度VR、钛氧、申义、风语筑和数字力扬联合支持</div>

      </div>
      <div class="width-750-hidden-right">

        <img class="width-750-hidden-right-img" src="../../../assets/image/rightBg.png">
        <img class="width-750-hidden-welcome" src="../../../assets/image/welcome_g.png">
        <img class="width-750-hidden-world" src="../../../assets/image/world_g.png">

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
      isEnsure:false
    };
  },
  mounted(){
    // this.turnColor()
  },
  methods: {
    // turnColor(){
    //   if(this.phoneIpt.length>0&&this.verifyCode.length>0){
    //     console.log(1);
    //     this.isEnsure = true
    //   }
    // },
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
            console.log(1111);
            alert("请重新输入手机号码")
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
            path: "/newsmeta"
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.loginPage {
  width: 100%;
  display: flex;
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
