 <template>
  <div class='container'>
     <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
      <!-- 放置搜索列表 实现上拉加载 -->
      <van-list v-model="upLoading" @load="onLoad" :finished="finished">
        <van-cell-group>
          <!-- to属性跳转 -->
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <div class="img_box" v-if="item.cover.type === 3">
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}</span>
                <span>{{ item.pubdate | reltTime }}</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
  </div>
</template>

<script>
import * as Articles from '@/api/artucles'
export default {
  data () {
    return {
      upLoading: false, // 上拉加载
      finished: false, // 是否全部完成
      articles: [], // 放置搜索结果文章
      page: {
        page: 1, // 第几页
        per_page: 10 // 每页多少条
      }
    }
  },
  methods: {
    // 该方法会在滚动条 滚动到底部的时候执行
    async onLoad () {
      const { q } = this.$route.query
      const data = await Articles.searchArticle({ ...this.page, q })
      this.articles.push(...data.results) // 上拉加载触发时 追加到队尾
      this.upLoading = false
      // 返回的查询记录是 0 没有下一页
      if (data.results.length) {
        this.page.page++ // 有下一页 应该把页码切到下页
      } else {
        this.finished = true
      }
    }
  }

}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
