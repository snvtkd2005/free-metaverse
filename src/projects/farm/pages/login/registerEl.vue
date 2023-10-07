<template>
  <div>
    <h1>注册页</h1>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
       <el-form-item label="密码" prop="password">
         <el-input type="password" v-model="ruleForm.password"></el-input>
       </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default{
    name:'register',
     data() {
          return {
            ruleForm: {
              name: '',
              password: ''
            },
            rules: {
              name: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ],
              password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 3, max:10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
              ]
            }
          };
        },
         methods: {
              submitForm(formName) {
                this.$router.push("/index"); //页面跳转
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    alert('submit!');
                  } else {
                    console.log('error submit!!');
                    return false;
                  }
                });
              }
            }
  }
</script>

<style>
</style>
