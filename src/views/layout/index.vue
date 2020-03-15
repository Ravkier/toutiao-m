<template>
  <div class="container">
    <!-- 导航栏首页 -->
    <van-nav-bar v-if="$route.path !== '/user'" title="头条" fixed right-text="搜索" @click-right="$router.push('/search')"></van-nav-bar>
    <!-- 二级路由 -->
    <div class="my-wrapper" :class="{noTop: $route.path === '/user'}">
      <router-view></router-view>
    </div>
    <!-- 标签页 -->
    <van-tabbar route>
      <van-tabbar-item to="/" icon="browsing-history">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="apps-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="manager-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
