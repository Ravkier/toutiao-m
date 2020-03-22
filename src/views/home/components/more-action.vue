<template>
<!-- 外层元素 -->
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <van-cell  @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 注册举报项点击事件 -->
      <van-cell @click="$emit('report', item.value)" v-for="item in reports" :key="item.value">{{ item.label }}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants' // 引入常量变量
import eventBus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false,
      reports // 相当于定义一个reports变量
    }
  },
  created () {
    eventBus.$on('delArticle', () => (this.isReport = false)) // 删除数据后把弹出层重置最初状态
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
