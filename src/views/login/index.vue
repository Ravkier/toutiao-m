<template>
<div class="container">
  <!-- 导航 -->
  <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
  <!-- 登录布局 -->
  <van-cell-group>
    <!-- 手机号 -->
    <van-field label="手机号" placeholder="请输入手机号"></van-field>
    <!-- 验证码 -->
    <van-field label="验证码" placeholder="请输入验证码">
      <van-button slot="button" size="small" type="primary">发送验证码</van-button>
    </van-field>
  </van-cell-group>
  <div class="login-box">
    <van-button type="info" block>登录</van-button>
  </div>
</div>

</template>

<script>
export default {

}
</script>

<style>

</style>
