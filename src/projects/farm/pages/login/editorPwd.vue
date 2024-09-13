<template>
<div>
  
<!-- 移动端 -->
<div class=" md:hidden h-full w-full z-0"> 
   <!-- 修改密码 -->
  <div >
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
     <div v-if="stepName==stepData[0].title" class="pb-10 w-11/12 mx-auto " >
        <div class="mt-4  mx-auto w-full text-right ">
        <!-- 当前手机号码 -->
        <div class=" h-12 rounded flex items-center ">
          <p class="ml-2 w-30    ">
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

<!-- pc端修改密码 -->
<div class="hidden md:block h-full w-full"> 

  <!-- 修改密码 -->
  <div >
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
import SingleImage from "/@/components/SingleImage.vue";

import sqlInterfaceData from "/@/data/sqlInterfaceData.js";

export default {
  name: "Login",
  data() {
    return {
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
