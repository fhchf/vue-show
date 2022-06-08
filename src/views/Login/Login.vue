<template>
  <div class="login-container">
    <!-- 左侧视图区域 -->
    <div class="login-box-left">
      <div class="left-content">
        <router-link to="/" class="left-content-jump">
          <div><img src="../../assets/img/header_logo.png" /></div>
          <span>與簌小卖部后台管理系统</span>
        </router-link>
        <div>
          <p style="text-align: center;">山园小梅</p>
          <p>众芳摇落独暄妍，占尽风情向小园。</p>
          <p>疏影横斜水清浅，暗香浮动月黄昏。</p>
          <p>霜禽欲下先偷眼，粉蝶如知合断魂。</p>
          <p>幸有微吟可相狎，不须檀板共金樽。</p>
        </div>
      </div>
      <div></div>
    </div>

    <!-- 右侧视图区域 -->
    <div class="login-box-rihgt">
      <div>
        <h1 class="login-title">Login</h1>
        <p>
          百花凋零，独有梅花迎着寒风昂然盛开，那明媚艳丽的景色把小园的风光占尽。稀疏的影儿，横斜在清浅的水中，清幽的芬芳浮动在黄昏的月光之下。寒雀想飞落下来时，先偷看梅花一眼；蝴蝶如果知道梅花的妍美，定会消魂失魄。幸喜我能低声吟诵，和梅花亲近，不用敲着檀板唱歌，执着金杯饮酒来欣赏它了。
        </p>
        <!-- 表单区域 -->
        <el-form
          class="login-form"
          label-position="top"
          ref="loginFormRef"
          hide-required-asterisk
          :model="loginForm"
          :rules="loginFormRules"
        >
          <el-form-item prop="username" label="Username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="Password">
            <el-input
              type="password"
              prefix-icon="iconfont icon-3702mima"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <a
            class="login-form-msg"
            href="javascript:;"
            @click="formMsg = '暂时不接受外部人员进行注册哦'"
            >{{ formMsg }}</a
          >
          <el-form-item class="btns">
            <el-button type="primary" @click="login" @keyup.enter.native="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
        <p>3班202020000379周政鹏<br />與簌小卖部后台管理系统是由本人自建的项目，于 2021 编写完。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { postLoginInfoAPI } from '@/api/loginAPI.js';

export default {
  name: 'Login',
  data() {
    return {
      // login 双向数据绑定
      loginForm: {
        username: 'admin',
        password: ''
      },
      // form 数据校验规则
      loginFormRules: {
        username: [
          { required: true, message: '没有输入用户名哦', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符哦', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '似乎忘记输入密码了-_-', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符哦', trigger: 'blur' }
        ]
      },
      formMsg: '没有账户？'
    };
  },
  methods: {
    // 重置表单及校验规则
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单整体 预验证
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false;

        // 发起请求并存储用户 token
        const { data: res } = await postLoginInfoAPI(this.loginForm);
        if (res.meta.status !== 200) return this.$message.error('登录失败，用户名或密码错误');

        this.$message.success('登录成功');
        window.sessionStorage.setItem('token', res.data.token);
        window.sessionStorage.setItem('activePath', '/welcome');
        this.$router.replace('/home');
      });
    }
  }
};
</script>

<style lang="less" scope>
// 布局
.login-container {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 650px;
  overflow: hidden;

  .login-box-left {
    width: 40%;
    background-color: #f2d184;
  }

  .login-box-rihgt {
    width: 60%;
    background-color: #fff;
  }
}

// 左侧视图区域
.login-box-left {
  display: flex;

  .left-content {
    position: relative;
    width: 100%;
    height: 40%;

    p {
      color: rgba(134, 97, 24, 0.8);
    }

    & > div {
      position: absolute;
      bottom: 0;
      right: 25%;
    }
  }
}
.left-content-jump {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  color: #a78339;
  text-decoration: none;

  & > div {
    width: 30px;
    height: 30px;
    padding: 5px;
    border: 1px solid #a78339;

    img {
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
  }

  span {
    margin-left: 20px;
    padding-bottom: 2px;
    border-bottom: 1px solid #a78339;
  }
}

// 右侧视图区域
.login-box-rihgt {
  position: relative;
  width: 100%;
  height: 100%;

  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    padding: 0 20px;
    box-sizing: border-box;

    h1 {
      margin-top: 0;
      margin-bottom: 40px;
      color: #15142e;
    }

    p {
      font-size: 12px;
      color: #a1a0a4;
    }
  }
}

// 表单
.login-form {
  width: 100%;

  .el-input__inner:focus {
    border-color: #f2d184;
  }

  .login-form-msg {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #6557a9;
    text-decoration: none;
  }

  .iconfont {
    padding-right: 0;
    padding-left: 10px;
  }

  .el-input--prefix .el-input__inner {
    padding-left: 40px;
  }
}

.btns {
  display: flex;
  justify-content: flex-start;

  & > div {
    display: flex;
    align-items: flex-end;
  }

  button:first-child {
    height: 35px;
    width: 120px;
    padding: 0;
    line-height: 35px;
    background-color: #f36fa2;
    border: none;
    border-radius: 6px;
  }

  button:last-child {
    width: 50px;
    height: 25px;
    padding: 0;
    margin-bottom: 2px;
    line-height: 25px;
    background-color: #ed90b4;
    border: none;
  }

  .el-button--info.is-active,
  .el-button--info:active,
  .el-button--info:focus,
  .el-button--info:hover {
    background: #ed90b4;
  }
}
</style>
