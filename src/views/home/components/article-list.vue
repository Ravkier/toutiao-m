<template>
  <!-- van-list 可以帮助我们实现上拉加载 -->
  <div class="scroll-wrapper">
      <!-- 文章列表 -->
      <van-list finished-text="没有了" v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell v-for="item in articles" :key="item" title="美股又熔断了" value="天台排队"></van-cell>
      </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 开启上拉加载
      finished: false, // 是否加载完所有数据
      articles: [] // 文章列表
    }
  },
  methods: {
    onLoad () {
      // 强制判断总条数 超过100条就关闭
      if (this.articles.length > 100) {
        this.finished = true // 关闭加载
      } else {
        // 1-60条
        const arr = Array.from(Array(15), (value, index) => this.articles + index + 1)
        this.articles.push(...arr)
        // 加载完数据需要手动关loading
        this.upLoading = false
      // setTimeout(() => {
      //   this.finished = true // 表示数据全部加载完
      // }, 1000)
      }
    }
  }

}
</script>

<style>

</style>
