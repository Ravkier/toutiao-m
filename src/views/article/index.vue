<template>
  <!-- 导航 -->
   <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <p class="time">{{ article.pubdate | reltTime }}</p>
        </div>
        <van-button :loading="followLoading" @click="follow" round size="small" type="info">{{ article.is_followed ? '已关注' : '+ 关注' }}</van-button>
      </div>
      <div class="content" v-html="article.content">

      </div>
      <div class="zan">
        <!-- 根据type决定谁拥有类名 -->
        <van-button round size="small" :class="{active: article.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active: article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 放置  detail 中 有padding-->
      <Comment />
    </div>
    <van-overlay :show="loading">
      <div class="loading-container">
        <van-loading />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/artucles'
import { followUser, unfollowUser } from '@/api/user'
import Comment from './components/comment'
export default {
  components: {
    Comment
  },
  data () {
    return {
      article: {}, // 接收文章详情数据
      followLoading: false, // 是否正在点击关注
      loading: false // 遮罩层状态
    }
  },
  methods: {
    // 获取文章详情数据
    async getArticleInfo () {
      this.loading = true
      const { artId } = this.$route.query
      this.article = await getArticleInfo(artId)
      this.loading = false
    },
    // 关注或取消关注
    async follow () {
      // 调用关注和非关注
      try {
        if (this.article.is_followed) {
          await unfollowUser(this.article.aut_id)
        } else {
          await followUser({ target: this.article.aut_id })
        }
        // pc端重新加载  移动端不会重新加载，修改对应的数据
        this.article.is_followed = !this.article.is_followed // 修改状态
        this.$gnotify({ type: 'success', message: '关注成功' })
      } catch (error) {
        this.$gnotify({ message: '操作失败' })
      } finally {
        // 无论成功还是 失败都会进入
        this.followLoading = true
      }
    }
  },
  created () {
    this.getArticleInfo()
  }

}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
