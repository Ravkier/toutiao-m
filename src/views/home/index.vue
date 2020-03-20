<template>
  <div class='container'>
      <van-tabs>
        <van-tab :title="item.name" v-for="item in channels" :key="item.id">
          <!-- <div class="scroll-wrapper">
            <van-cell-group>
              <van-cell title="标题" v-for="item in 20" :key="item"></van-cell>
          </van-cell-group>
          </div> -->
          <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
        </van-tab>
      </van-tabs>
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
      <!-- 放置一个弹层组件 -->
      <van-popup v-model="showMoreAction">
        <!-- 放置反馈组件 -->
        <MoreAction  />
      </van-popup>
  </div>
</template>

<script>
import ArticleList from '@/views/home/components/article-list.vue'
import MoreAction from '@/views/home/components/more-action.vue'
import { getMyChannels } from '@/api/channels'
export default {
  data () {
    return {
      channels: [], // 接受频道数据
      showMoreAction: false, // 控制是否显示弹窗
      ArticleId: null // 储存id
    }
  },
  methods: {
    // 获取频道数据
    async getMyChannels () {
      const data = await getMyChannels() // 接受返回的数据结果
      this.channels = data.channels // 数据赋值
    },
    // 控制子组件arction-list 触发事件
    openAction (artId) {
      this.showMoreAction = true // 控制开关
      this.ArticleId = artId // 把传过来的id 储存
    }
  },
  created () {
    this.getMyChannels()
  },
  components: {
    ArticleList,
    MoreAction
  }
}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
