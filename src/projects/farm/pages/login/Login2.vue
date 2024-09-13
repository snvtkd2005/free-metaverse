<template>
<div>
  
<!-- 移动端 -->
<div class=" md:hidden h-full w-full z-10"> 
  <div v-show="!inRegister && !editorPwd" class="bg-gray-100 w-full h-full flex">
    <!-- 登陆框    mx-auto mr-32 使用mr-32时，需使用mx-auto才有效？-->
    <div class="flex mx-auto w-full h-full ">
      <div
        class="
        
          rounded-lg
          w-72
          h-96 
          mx-auto
          self-center
          mt-20
        "
      >
        <div class=" w-4/5 mx-auto">
          <h1 class="text-center text-2xl mt-10 font-bold">欢迎登录</h1>
          <div class="mt-10">
            <div class=" flex border-b-2 h-10">
              <div class="w-8 h-7 mt-1">
                <!-- <SingleImage :imgSrc="grayImgSrc" /> -->
                <img class="w-full h-full" src="/@/assets/images/czwx/icon-1.png" alt="" />

              </div>

              <input
                class="outline-none  bg-transparent placeholder-gray-400 p-1"
                type="text"
                v-model="ruleForm.userName"
                placeholder="请输入用户名"
              />
            </div>
            <div class="password flex mt-4 border-b-2 h-10">
              <div class="w-8 h-7 mt-1">
                <!-- <SingleImage :imgSrc="grayImgSrc" /> -->
                <img class="w-full h-full" src="/@/assets/images/czwx/icon-2.png" alt="" />
              </div>
              <input
                class="outline-none  bg-transparent placeholder-gray-400 p-1"
                type="password"
                v-model="ruleForm.password"
                placeholder="请输入密码"
              />
            </div>
            <div
              class="
                forget
                text-sm text-blue-400 text-right
                mt-1
                cursor-pointer
              "
              @click="ForgetPassword()"
            >
              忘记密码？
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
            登录
          </div>
          <div class="flex justify-center mt-10 text-sm text-center">
            <div>还没有账号？</div>
            <div class="text-blue-400 cursor-pointer" @click="CallRegister()">免费注册</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-show="inRegister && !editorPwd" class="bg-gray-100 w-full h-full flex">
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
                v-model="registerForm.userName"
                placeholder="请输入手机号"
              />
            </div>
            <div class="flex mt-4 border-b-2 h-8 justify-between">
              <input
                class="outline-none w-1/2 bg-transparent placeholder-gray-400"
                type="text"
                v-model="registerForm.code"
                placeholder="请输入验证码"
              />
              <button class="bg-blue-500 rounded-md text-white w-20 h-6 text-xs">
                获取验证码
              </button>
            </div>
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="registerForm.password"
                placeholder="请输入密码"
              />
            </div>
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="registerForm.repassword"
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

   <!-- 修改密码 -->
  <div v-show="editorPwd">
    <div class=" bg-color w-full h-36">
      <p class="text-white text-xl pt-24">修改密码</p>
    </div>
         <!-- 步骤 ------短信验证 更换新手机号 修改成功-->
     <div class="flex items-center mx-auto w-2/3 h-32">
                  <!-- @click="ChangePanel(item.name)" -->

        <div v-for="(item,i) in stepData" :key="item" :index="i" 
                  class=" w-1/3 relative"
                  >
                  <div class="w-full h-1   "
                    :class="stepName==item.title?'bg-blue-400':'bg-gray-200'"
                    >
                  </div>
                  <div class=" -mt-3 mx-auto w-6 h-6 rounded-full   "
                    :class="stepName==item.title?'bg-blue-400 text-white':'bg-gray-200 text-gray-400'"
                  >{{i+1}}</div>
                  <p class="mt-5 "
                    :class="stepName==item.title?'text-blue-400':'text-gray-600'"
                  >
                    {{item.title}}
                  </p>
        </div>
     </div>


     <!-- 步骤内容 -->
     <!-- 短信验证 -->
     <div v-if="stepName==stepData[0].title" class="pb-10" >
        <div class="mt-4  mx-auto w-3/12 text-right ">
        <!-- 当前手机号码 -->
        <div class=" h-12 rounded flex items-center ">
          <p class="ml-2 w-30 h-full mt-6 ">
            当前手机号码:
          </p>
          <p>
              138xxxxxxxx
          </p>
        </div>  
        <!-- 验证码 -->
        <div class=" h-12 rounded flex items-center ">
          <p class="ml-2 w-24 h-full mt-6 ">
            验证码:
          </p>
          <input
            class="outline-none text-sm h-2/3 mr-2 ml-2 pl-3 border  text-gray-500"
            type="text"
            placeholder="输入验证码"
          />

          <button class="w-24 h-8 mx-auto bg-color rounded flex">
            <p class="w-24 mt-1 text-white text-sm text-center align-middle">获取验证码</p>
          </button>
        </div>  
      </div>
        <button class="w-20 h-8 mt-10 mx-auto bg-color rounded flex">
          <p class="w-20 mt-1 text-white text-center align-middle">下一步</p>
        </button>
     </div>
     <!-- 更换新手机号 -->
     <!-- 修改成功 -->
  </div>

</div>




<div class="hidden md:block h-full w-full"> 
  <div v-show="!inRegister && !editorPwd" class="bg-gray-500 w-full h-595px flex">
    <!-- 登陆框    mx-auto mr-32 使用mr-32时，需使用mx-auto才有效？-->
    <div class="flex mx-auto mr-32 mt-32">
      <div
        class="
          bg-white
          rounded-lg
          w-72
          h-96
          bg-gradient-to-tr
          from-blue-100
          to-white
        "
      >
        <div class="w-4/5 mx-auto">
          <h1 class="text-center text-2xl mt-10 font-bold">欢迎登录</h1>
          <div class="mt-10">
            <div class=" flex border-b-2 h-10">
              <div class="w-8 h-8">
                <!-- <SingleImage :imgSrc="grayImgSrc" /> -->
                <img class="w-full h-full" src="/@/assets/images/czwx/icon-1.png" alt="" />

              </div>

              <input
                class="outline-none  bg-transparent placeholder-gray-400 p-1"
                type="text"
                v-model="ruleForm.userName"
                placeholder="请输入用户名"
              />
            </div>
            <div class="password flex mt-4 border-b-2 h-10">
              <div class="w-8 h-8">
                <!-- <SingleImage :imgSrc="grayImgSrc" /> -->
                <img class="w-full h-full" src="/@/assets/images/czwx/icon-2.png" alt="" />
              </div>
              <input
                class="outline-none  bg-transparent placeholder-gray-400 p-1"
                type="password"
                v-model="ruleForm.password"
                placeholder="请输入密码"
              />
            </div>
            <div
              class="
                forget
                text-sm text-blue-400 text-right
                mt-1
                cursor-pointer
              "
              @click="ForgetPassword()"
            >
              忘记密码？
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
            登录
          </div>
          <div class="flex justify-center mt-10 text-sm text-center">
            <div>还没有账号？</div>
            <div class="text-blue-400 cursor-pointer" @click="CallRegister()">免费注册</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-show="inRegister && !editorPwd" class="bg-gray-500 w-full h-695px flex">
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
                v-model="registerForm.userName"
                placeholder="请输入手机号"
              />
            </div>
            <div class="flex mt-4 border-b-2 h-8 justify-between">
              <input
                class="outline-none w-1/2 bg-transparent placeholder-gray-400"
                type="text"
                v-model="registerForm.code"
                placeholder="请输入验证码"
              />
              <button class="bg-blue-500 rounded-md text-white w-20 h-6 text-xs">
                获取验证码
              </button>
            </div>
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="registerForm.password"
                placeholder="请输入密码"
              />
            </div>
            <div class="password flex mt-4 border-b-2 h-8">
              <input
                class="outline-none bg-transparent placeholder-gray-400"
                type="password"
                v-model="registerForm.repassword"
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

   <!-- 修改密码 -->
  <div v-show="editorPwd">
    <div class=" bg-color w-full h-36">
      <p class="text-white text-xl pt-24">修改密码</p>
    </div>
         <!-- 步骤 ------短信验证 更换新手机号 修改成功-->
     <div class="flex items-center mx-auto w-2/3 h-32">
                  <!-- @click="ChangePanel(item.name)" -->

        <div v-for="(item,i) in stepData" :key="item" :index="i" 
                  class=" w-1/3 relative"
                  >
                  <div class="w-full h-1   "
                    :class="stepName==item.title?'bg-blue-400':'bg-gray-200'"
                    >
                  </div>
                  <div class=" -mt-3 mx-auto w-6 h-6 rounded-full   "
                    :class="stepName==item.title?'bg-blue-400 text-white':'bg-gray-200 text-gray-400'"
                  >{{i+1}}</div>
                  <p class="mt-5 "
                    :class="stepName==item.title?'text-blue-400':'text-gray-600'"
                  >
                    {{item.title}}
                  </p>
        </div>
     </div>


     <!-- 步骤内容 -->
     <!-- 短信验证 -->
     <div v-if="stepName==stepData[0].title" class="pb-10" >
        <div class="mt-4  mx-auto w-3/12 text-right ">
        <!-- 当前手机号码 -->
        <div class=" h-12 rounded flex items-center ">
          <p class="ml-2 w-30 h-full mt-6 ">
            当前手机号码:
          </p>
          <p>
              138xxxxxxxx
          </p>
        </div>  
        <!-- 验证码 -->
        <div class=" h-12 rounded flex items-center ">
          <p class="ml-2 w-24 h-full mt-6 ">
            验证码:
          </p>
          <input
            class="outline-none text-sm h-2/3 mr-2 ml-2 pl-3 border  text-gray-500"
            type="text"
            placeholder="输入验证码"
          />

          <button class="w-24 h-8 mx-auto bg-color rounded flex">
            <p class="w-24 mt-1 text-white text-sm text-center align-middle">获取验证码</p>
          </button>
        </div>  
      </div>
        <button class="w-20 h-8 mt-10 mx-auto bg-color rounded flex">
          <p class="w-20 mt-1 text-white text-center align-middle">下一步</p>
        </button>
     </div>
     <!-- 更换新手机号 -->
     <!-- 修改成功 -->
  </div>

</div>


</div>

 

</template>

<script>
import grayImgSrc from "../assets/images/bg_004.png";
import SingleImage from "/@/components/SingleImage.vue";

import sqlInterfaceData from "/@/data/sqlInterfaceData.json";

export default {
  name: "Login2",
  data() {
    return {
      grayImgSrc,
      sqlInterfaceData: "",
      token: "",
      error: "",
      ruleForm: {
        userName: "",
        password: "",
      },
      registerForm: {
        userName: "",
        code: "",
        password: "",
        repassword: "",
      },
      // 是否正在注册
      inRegister: false,
      //是否正在修改密码
      editorPwd:false,
      stepName:'确认账号',
      // 修改号码步骤
      stepData: [
        {
          title: "确认账号", 
        }, 
        {
          title: "重置密码", 
        },
        {
          title: "修改成功", 
        },

      ],
    };
  },

  mounted() {

    return;

    this.sqlInterfaceData = sqlInterfaceData.interfaceList;
    console.log(this.sqlInterfaceData[0].name);
    this.GetData("登录", ["", ""], function name(params) {
      console.log(params);
    });
  },
  methods: {
    //切换注册和登录
    CallRegister() {
      this.inRegister =  !this.inRegister;
    },
    // 忘记密码
    ForgetPassword(){
      this.editorPwd =true;
    },
    GetData(_name, _formdata, callback) {
      for (let i = 0; i < this.sqlInterfaceData.length; i++) {
        if (this.sqlInterfaceData[i].name == _name) {
          let itemData = this.sqlInterfaceData[i];
          let url = itemData.url;
          console.log(url);
          console.log(itemData.method);
          if (itemData.method == "post") {
            let fromData = new FormData();
            for (let i = 0; i < itemData.fromData.length; i++) {
              fromData.append(itemData.fromData[i], _formdata[i]);
            }

            let config = {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };
            var that = this;
            this.$axios.post(url, fromData, config).then((response) => {
              callback(response);
            });
            return;
          }
          return;
        }
      }
    },
    GetAllClass(token) {
      //获取班级列表
      this.$axios
        .get("/api/class/all", {
          headers: { Authorization: token },
        })
        .then(function (response) {
          console.log(response);
          console.log("GetAllPlayer 成功啦 = " + response.data.message);
          if (response.data.message == "账号已存在") {
            that.GetAllPlayer();
          }
        })
        .catch(function (err) {
          console.log("GetAllPlayer 报错啦 = " + err);
        });
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
        this.LoginCompleted(); return;

      //192.168.0.184:8080/api/user/login
      //userName,password
      // var userName = "admin";
      // var password = "123456";

      var userName = this.ruleForm.userName;
      var password = this.ruleForm.password;

      //效验输入合法性
      if (userName == "" || password == "") {
        console.log("用户名为空");
        this.SetErrorContent("用户名或密码不能为空");
        return;
      }
      //登录
      let fromData = new FormData();
      fromData.append("userName", userName);
      fromData.append("password", password);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      var that = this;
      this.$axios.post("/api/user/login", fromData, config).then((response) => {
        // console.log(response);

        if (response.data.message == "用户不存在") {
          that.SetErrorContent("用户名错误");
          return;
        }
        if (response.data.message == "密码错误") {
          that.SetErrorContent("密码错误");
          return;
        }
        that.token = response.data.data;
        that.LoginCompleted();
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
  components: {
    SingleImage,
  },
};
</script>

<style>

</style>
