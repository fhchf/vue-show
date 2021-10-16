<template>
  <div class="login-container">
    <div class="login-box">
      <!--
        头像区域
      -->
      <div class="login-avatar">
        <img src="../../assets/logo.png" alt="logo" />
      </div>
      <!--
        登录表单区域
      -->
      <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { postLoginInfoAPI } from '@/api/login/loginAPI.js'

export default {
  name: 'Login',
  data() {
    return {
      // login 双向数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // form 数据校验规则
      loginFormRules: {
        username: [
          { required: true, message: '似乎忘记输入用户名了-_-', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符哦', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '似乎忘记输入密码了+-+', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符哦', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单及校验规则
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 表单整体 预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false

        // 发起请求并存储用户 token
        const { data: res } = await postLoginInfoAPI(this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败，用户名或密码错误！')

        this.$message.success('登录成功！')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.replace('/home')
      })
    }
  }
}
</script>

<style lang="less" scope>
.login-container {
  height: 100%;
  background-color: #6e7c8f;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  // box-shadow: 0px 0px 20px 1px #efefef;
  border-radius: 3px;
  transform: translate(-50%, -50%);
}

.login-avatar {
  position: absolute;
  left: 50%;
  padding: 5px;
  width: 100px;
  height: 100px;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  background-color: #fff;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login-form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
