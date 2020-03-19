<template>
<div class="container">
  <!-- 导航 -->
  <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
  <!-- 登录布局 -->
  <van-cell-group>
    <!-- 手机号 -->
    <van-field @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim="loginForm.mobile" label="手机号" placeholder="请输入手机号"></van-field>
    <!-- 验证码 -->
    <van-field @blur="checkCode" :error-message="errorMessage.code" v-model="loginForm.code" label="验证码" placeholder="请输入验证码">
      <van-button slot="button" size="small" type="primary">发送验证码</van-button>
    </van-field>
  </van-cell-group>
  <div class="login-box">
    <van-button @click="login" type="info" round size="small" block>登录</van-button>
  </div>
</div>

</template>

<script>
// 引入login方法
import { login } from '@/api/user'
import { mapMutations } from 'vuex' // 辅助函数

export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      // 此对象专门放置信息
      errorMessage: {
        code: '', // 一个验证码提示消息
        mobile: '' // 一个手机号提示消息
      }

    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 可以导入需要的方法  直接把updateUser方法映射到当前的methods方法中
    // 检查手机号
    checkMobile () {
      // 非空 格式判断
      if (!this.loginForm.mobile) {
        this.errorMessage.mobile = '手机号不能为空'
        return false // false表示校验没通过 通过了返回turn
      }
      // 手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机格式不正确'
        return false // 格式不正确返回false
      }
      // 清空
      this.errorMessage.mobile = ''
      return true // 格式正确返回true
    },
    // 检查验证码
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMessage.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须为六位数字'
        return false
      }
      this.errorMessage.code = ''
      return true
    },
    // 登录校验
    async login () {
      const valueMobile = this.checkMobile()
      const valueCode = this.checkCode()
      // 登录的时候他们都为true 就能通过
      if (valueMobile && valueCode) {
        try {
          const result = await login(this.loginForm)
          this.updateUser({ user: result }) // 更新token 和refresh_token
          const { redirectUrl } = this.$route.query // 获取地址栏的参数
          this.$router.push(redirectUrl || '/') // 如果进来之前有地址就返回 之前的地址 ，如果没有就返回首页
        } catch (error) {
          // 提示用户登录错误的消息
          // this.$notify({ message: '用户名或者验证码错误', duration: 800 })
          this.$gnotify({ message: '用户名或者验证码错误' })
        }
      }
    }
  }
}
</script>

<style>

</style>
