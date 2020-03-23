<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search @search="onSearch" v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q" >
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 没有历史记录 隐藏掉 -->
    <div class="history-box" v-else>
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toSearchResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{ item }}</a>
          <!-- 注册删除事件 -->
          <!-- 会发生冒泡， vue可以用修饰符组织事件冒泡 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'toutiao-m-history' // 作为历史记录在本地缓存中
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字数据
      historyList: JSON.parse(localStorage.getItem(key) || '[]')
    }
  },
  methods: {
    // 搜索方法
    onSearch () {
      // 首先排除空
      if (!this.q) return
      // 添加历史记录
      this.historyList.unshift(this.q)
      // 数组去重
      this.historyList = Array.from(new Set(this.historyList))
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 跳转
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    },
    // 删除历史
    delHistory (index) {
      this.historyList.splice(index, 1) // 删除对应的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 同步到本地
    },
    // 跳到搜索的结果页
    toSearchResult (text) {
      // 跳到结果页
      // this.$router 路由实例对象
      // this.$route 路由信息对象
      // params query 传参
      // params 传参要更改路由
      this.$router.push(`/search/result?q=${text}`) // query 传参
    },
    // 清空历史记录
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有的历史记录么'
        })
        this.historyList = []
        localStorage.setItem(key, '[]')
      } catch (error) {

      }
    }
  }
  // created () {
  //   // 本地缓存中读取
  // }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
