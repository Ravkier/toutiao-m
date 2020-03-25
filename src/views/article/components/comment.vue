<template>
  <div class="comment">
      <!-- 上拉加载 不能一下加载完 -->
    <van-list v-model="loading" @load="onLoad" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{ item.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ item.like_count }}</span>
            </span>
          </p>
          <p>{{ item.content }}</p>
          <p>
            <span class="time">{{ item.pubdate | reltTime }}</span>&nbsp;
            <van-tag plain @click="openReply(item.com_id.toString())">{{ item.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
      <!-- 底部输入框 -->
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <!-- 显示loading -->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <!-- 显示提交 防止重复提交 -->
        <span class="submit" v-else @click="submit" slot="button">提交</span>
      </van-field>
    </div>
        <!-- 回复  关闭面板评论id为空-->
    <van-action-sheet @closed="reply.commentId = null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{ item.aut_name }}</span></p>
            <p>{{ item.content }}</p>
            <p><span class="time">{{ item.pubdate | reltTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentsOrReply } from '@/api/artucles.js'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 神评论
      offset: null, // 偏移量
      showReply: false, // 控制回复列表组件的显示和隐藏
      reply: {
        // 专门用reply这个对象存放回复相关的数据
        loading: false, // 是回复列表组件的状态
        finished: false, // 是回复列表组件的结束状态
        offset: null, // 偏移量 获取评论的评论的分页依据 c
        list: [], // 用于存放 当前弹出的关于某个评论的回复列表的数据
        commentId: null
      }
    }
  },
  methods: {
    // 提交方法
    async submit () {
      // 判断是否登录
      if (this.$store.state.user.token) {
        // 登录了 ，是否有评论内容
        if (!this.value) return false // 如果没有内容直接返回
        this.submiting = true // 打开提交状态表示提交中
        await this.$sleep(800)
        // 提交评论
        try {
          const data = await commentsOrReply({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 要么文章id 要么评论id
            content: this.value, // 评论内容
            art_id: this.reply.commentId ? this.$route.query.artId : null
          })
          if (this.reply.commentId) {
            // 存在表示对评论进行评论
            this.reply.list.unshift(data.new_obj)
            // 需要找到对应评论的id 将评论id的回复+1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            // 寻找文章评论中 等于当前评论id的id
            comment && comment.reply_count++
          } else {
            // 表示对文章评论
            this.comments.unshift(data.new_obj)
          }
          this.value = '' // 清空输入框
        } catch (error) {
          this.$gnotify({ message: '评论失败' })
        }

        // 调用完成之后 ， 添加的评论数据，添加到评论列表
        this.submiting = false // 状态关闭
      } else {
        try {
          // 提示用户
          await this.$dialog.confirm({
            message: '如果想要评论，你需要去登录'
          })
          this.$router.push({
            path: '/login',
            query: { redirectUrl: this.$route.fullPath }
          })
        } catch (error) {

        }
      }
    },
    openReply (commentId) {
      // 打开评论方法
      this.showReply = true
      this.reply.commentId = commentId
      // 弹出面板重置数据
      // 之前的数据清空
      this.reply.list = []
      this.reply.offset = null // 因为希望点击弹出回复面板的时候是新的数据
      this.reply.finished = false // 将finished打开
      this.reply.loading = true // 没有主动检查

      this.getReply() // 弹出评论评论的层时 去请求数据
    },
    // 获取评论的评论
    async getReply () {
      const data = await getComments({
        type: 'c',
        source: this.reply.commentId,
        offset: this.reply.offset // 评论的评论
      })
      // 需要将数据对夹到队尾
      this.reply.list.push(...data.results)
      this.reply.loading = false // 关闭加载
      this.reply.finished = data.last_id === data.end_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id
      }
    },
    // 超过一定距离的时候就会触发
    async onLoad () {
      // 数据加载
      const { artId } = this.$route.query
      const data = await getComments({
        type: 'a', // a(文章的评论) c（评论的评论）
        source: artId, // 查明id
        offset: this.offset
      })
      this.comments.push(...data.results) // 将评论添加到尾部
      // 关闭加载状态
      this.loading = false
      // 判断是否还有下一页
      // data.end_id === data.last_id => finished = true // 没有下一页
      this.finished = data.end_id === data.last_id
      if (!this.finished) {
        // 还没结束
        this.offset = data.last_id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}

</style>
