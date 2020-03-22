<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <span @click="$emit('selectChannel', item.id)" class="f12">{{ item.name }}</span>
          <!-- 应该在进入编辑状态时显示 退出不显示 -->
          <van-icon v-if="index != 0 && editing" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">频道{{ item.name }}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels.js'
export default {
  data () {
    return {
      editing: false,
      allChannels: [] // 接受全部的频道数据
    }
  },
  props: {
    channels: {
      required: true, // 必传
      type: Array, // 数组类型
      default: () => [] // 此函数默认返回一个空数组
    }
  },
  methods: {
    //   获取全部
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 赋值给频道
    }
  },
  // 可选频道是动态结果
  computed: {
    optionalChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    // 渲染
    this.getAllChannels()
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
