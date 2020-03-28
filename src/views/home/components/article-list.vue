<template>
  <!-- van-list 可以帮助我们实现上拉加载 -->
  <div class="scroll-wrapper" @scroll="remember" ref="myScroll">
    <van-pull-refresh v-model="downLoading" :success-text="successText" @refresh="onRefresh">
      <!-- 文章列表 -->
      <van-list finished-text="没有了" v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <!-- 加to属性完成跳转 -->
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 三图 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}</span>
                <span>{{ item.pubdate | reltTime }}</span>
                <span class="close" v-if="$store.state.user.token">
                  <!-- 阻止事件冒泡 -->
                  <van-icon @click.stop="$emit('showAction', item.art_id.toString())" name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/artucles'
import eventBus from '@/utils/eventbus'
export default {
  // 初始化函数
  created () {
    eventBus.$on('delArticle', (artId, channelId) => {
      // 判断传递过来的频道等于自身的频道
      if (channelId === this.channel_id) {
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          this.articles.splice(index, 1) // 删除对应索引的数据
        }
        // 列表数据删光后 不会触发load事件
        if (this.articles.length === 0) {
          // 删光数据后手动触发页面加载
          this.onLoad()
        }
      }
    })
    eventBus.$on('changeTab', (id) => {
      if (id === this.channel_id) {
        this.$nextTick(() => {
          if (this.scrollTop && this.$refs.myScroll) {
            this.$refs.myScroll.scrollTop = this.scrollTop
          }
        })
      }
    })
  },
  data () {
    return {
      successText: '', // 成功时的数据
      downLoading: false, // 下拉加载
      upLoading: false, // 开启上拉加载
      finished: false, // 是否加载完所有数据
      articles: [], // 文章列表
      timestamp: null, // 定义一个历史时间戳
      scrollTop: 0 // 记忆滚动位置
    }
  },
  props: {
    // 约束传入值类型和必传
    channel_id: {
      required: true, // 必填项 要求该props必须传
      type: Number, // 表示要传入的prop属性类型
      default: null // 默认值，没有传入prop属性 ，默认值就会被采用
    }
  },
  methods: {
    // 记录滚动事件
    remember (event) {
      // 防抖 在函数一段时间之内只执行最后一次
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 记录当前的位置
        this.scrollTop = event.target.scrollTop // 记录滚动的位置
      }, 500)
    },
    // 上拉记载
    async onLoad () {
      // // 强制判断总条数 超过100条就关闭
      // if (this.articles.length > 50) {
      //   this.finished = true // 关闭加载
      // } else {
      //   // 1-60条
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles + index + 1
      //   )
      //   this.articles.push(...arr)
      //   // 加载完数据需要手动关loading
      //   this.upLoading = false
      //   // setTimeout(() => {
      //   //   this.finished = true // 表示数据全部加载完
      //   // }, 1000)
      // }
      await this.$sleep()
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // 获取这个频道id
      // 获取内容
      this.articles.push(...data.results)
      this.upLoading = false // 关闭加载状态
      // 将历史事件戳给timestamp
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep() // 人为控制了 请求的时间
      // 下拉刷新应该发送最新的时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now() // 永远传最新的时间戳
      })
      // 手动的关闭 下拉刷新的状态
      this.downLoading = false
      // 需要判断 最新的时间戳能否换来的数据啊  如果能换来数据 把新数据整个替换旧数据 如果不能  就告诉大家 暂时没有更新
      if (data.results.length) {
        // 如果有返回数据
        // 需要将整个的articles替换
        this.articles = data.results // 历史数据全部被覆盖
        // 此时你 已经之前的全部数据覆盖了 假如 你之前把数据拉到了低端 也就意味着 你之前的finished已经为true了
        if (data.pre_timestamp) {
          // 因为下拉刷新 换来了一拨新的数据 里面 又有历史时间戳
          this.finished = false // 重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳给变量
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来新数据
        this.successText = '当前已经是最新了'
      }
      // console.log('下拉刷新')
      // setTimeout(() => {
      //   // 下拉刷新 把最新的数据从头部添加进去
      //   const arr = Array.from(Array(2), (value, index) => index + 1)
      //   this.articles.unshift(...arr)
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}数据`
      // }, 1000)
    }
  },
  activated () {
    // 激活函数中 去判断当前是否 scrollTop
    if (this.$refs.myScroll && this.scrollTop) {
      // 判断滚动位置是否大于0
      this.$refs.myScroll.scrollTop = this.scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
