<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" @click-right="saveUser" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell @click="showPhoto = true" is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName = true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender = true" :value="user.gender === 0 ? '男' : '女' " />
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>
    <!-- 放置头像 弹层 -->
    <van-popup :close-on-click-overlay="false" v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell @click="openFileDialog" is-link title="本地相册选择图片"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 昵称 -->
    <van-popup :close-on-click-overlay="false" v-model="showName" style="width:80%">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field :error-message="nameMsg" v-model.trim="user.name" type="textarea" rows="4"></van-field>
      <!-- 关闭弹层 -->
      <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup :close-on-click-overlay="false" v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmDate"
        @cancel="showBirthDay = false"
      />
    </van-popup>
    <!-- 放置input type:'file' 类型 -->
    <input @change="upload" ref="myFile" type="file" style="display: none" name="" id="">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updataPhoto, saveUserInfo } from '@/api/user.js'
export default {
  data () {
    return {
      showPhoto: false, // 显示头像弹层
      showName: false, // 显示昵称的弹层
      showGender: false, // 显示性别弹层
      showBirthDay: false, // 显示生日弹层
      actions: [{ name: '男' }, { name: '女' }], // 性别数据
      minDate: new Date(1900, 1, 1), // 生日最小日期
      maxDate: new Date(), // 最大时间日期
      currentDate: new Date(), // 当弹出层时，显示的时间
      nameMsg: '', // 错误信息
      user: {
        // 放置个人资料
        name: '', // 用户昵称
        gender: 1, // 性别默认值
        birthday: '2002-01-01', // 生日的默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    // 保存用户信息
    async saveUser () {
      try {
        await saveUserInfo(this.user)
        this.$gnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$gnotify({ message: '保存失败' })
      }
    },
    // 打开选择文件的对话框
    openFileDialog () {
      this.$refs.myFile.click()
    },
    async upload (params) {
      // 当选择完 之后 就可以修改头像了
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])
      const result = await updataPhoto(data)
      this.user.photo = result.photo
      this.showPhoto = false // 关闭弹层
    },
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    // 点击确定关闭
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return // 不能继续
      }
      this.nameMsg = ''
      this.showName = false
    },
    selectItem (item, index) {
    // 通过item 和index 知道是男是女
      this.user.gender = index
      // 手动关闭弹层
      this.showGender = false
    },
    showDate () {
      this.showBirthDay = true
      this.currentDate = new Date(this.user.birthday)
    },
    confirmDate () {
    // 当前选的生日 就是 currenDate
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将日期转化成字符串
      this.showBirthDay = false // 关闭弹层
    }
  },
  created () {
    this.getUserProfile()
  }
}
</script>

<style>
</style>
