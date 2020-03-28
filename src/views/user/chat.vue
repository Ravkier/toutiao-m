<template>
   <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <div class="chat-item " :class="{left: item.name === 'xz', right:item.name !== 'xz'}" v-for="(item,index) in list" :key="index">
        <van-image fit="cover" v-if="item.name === 'xz'" round :src="XZImg" />
        <div class="chat-pao">{{ item.msg }}</div>
        <van-image v-if="item.name !== 'xz'" fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import XZImg from '@/assets/1.jpg'
import { mapState } from 'vuex'
import io from 'socket.io-client' // 引入socket.io 客户端
export default {
  data () {
    return {
      XZImg,
      value: '',
      loading: false,
      list: [] // 存储聊天记录
    }
  },
  methods: {
    // scrollTop(滚动条距离顶部的长度 ) = scrollHeight 整个屏幕
    scrollBottom () {
      // vuejs 数据变化 => 异步 => 试图更新
      // this.$nextTick(() => {
      //   // 上一步的结果已经完成更新
      //   this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      // })
      Vue.nextTick(() => {
        // 上一步的结果已经完成更新
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
    },
    async send () {
      if (!this.value) return false // 如果字符串为空 就结束
      // 不为空
      this.loading = true // 打开是为了放置重复提交
      await this.$sleep()
      // 使用websocket 发送消息
      const obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 给一个当前的时间戳 表示当前发送的
      }
      this.socket.emit('message', obj)
      this.list.push(obj)
      // 发送完消息后
      this.value = '' // 清空输入框
      this.loading = false // 关掉状态
      this.scrollBottom()
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 头像地址 用户的头像地址
  },
  created () {
    // 建立服务器端的连接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 固定写法 会拼接到url地址上
      query: {
        token: this.user.token
      }
    })
    this.socket.on('connect', () => {
      // 执行 connect事件 ， 表示和服务器连接
      this.list.push({ msg: '秃头小王子，你怎么这么好看', name: 'xz' }) // 区分是谁说的
    })
    // 在此时监听回复的消息
    this.socket.on('message', data => {
      // data 就是 客户服务器回复的消息
      this.list.push({ ...data, name: 'xz' })
      this.scrollBottom()
    })
  },
  // 实例销毁之前
  beforeDestroy () {
    // 把websocket 连接关掉
    this.socket.close() // 直接关闭
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
