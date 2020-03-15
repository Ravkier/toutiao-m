// 专门处理postcss 插件
module.exports = {
  // 所有的postcss插件
  plugins: {
    // 自动给css加浏览器前缀
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值 px/rootValue = rem
      propList: ['*'] // 所有文件都转化为rem
    }
  }
}
