<template>
  <div id="app">
    <!-- 一级路由容器 -->
    <keep-alive>
      <router-view v-if="$route.meta.isAlive" />
    </keep-alive>

    <router-view v-if="$route.meta.isAlive"></router-view>

  </div>
</template>

<style lang="less">

</style>
