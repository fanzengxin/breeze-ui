<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0">
    <el-form-item prop="username">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                auto-complete="off"
                placeholder="请输入用户名">
        <i slot="prefix"
           class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="请输入密码">
        <i class="el-icon-view el-input__icon"
           slot="suffix"
           @click="showPassword"></i>
        <i slot="prefix"
           class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    :maxlength="code.len"
                    v-model="loginForm.code"
                    auto-complete="off"
                    placeholder="请输入验证码">
            <i slot="prefix"
               class="icon-yanzhengma"></i>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="code.src"
                 class="login-code-img"
                 @click="refreshCode"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 size="small"
                 @click.native.prevent="handleLogin"
                 class="login-submit">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getVerifyCode} from '@/api/login'

  export default {
    name: "userlogin",
    data() {
      return {
        loginForm: {
          username: "admin",
          password: "111111",
          code: "",
          codeId: ""
        },
        checked: false,
        code: {
          src: "/code",
          value: "",
          len: 4,
          type: "image"
        },
        loginRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, message: "密码长度最少为6位", trigger: "blur"}
          ],
          code: [
            {required: true, message: "请输入验证码", trigger: "blur"}
          ]
        },
        passwordType: "password"
      };
    },
    created() {
      this.refreshCode();
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["tagWel"])
    },
    props: [],
    methods: {
      refreshCode() {
        getVerifyCode(this.loginForm.codeId).then(response => {
          this.code.src = "data:image/png;base64," + response.CODE;
          this.loginForm.codeId = response.CODEID;
        });
      },
      showPassword() {
        this.passwordType == ''
          ? (this.passwordType = 'password')
          : (this.passwordType = '')
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
              this.$router.push({path: this.tagWel.value});
            }).catch(() => {
              this.refreshCode();
            })
          }
        });
      }
    }
  };
</script>
<style>
</style>
