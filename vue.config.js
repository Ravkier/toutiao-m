/**
 * 需要导出一个对象
 */
module.exports = {
  // 需要更改 less 中变量得配置
  css: {
    // css 相关
    loaderOptions: {
      // 所有得关于样式loader 相关得选项
      less: {
        modeifyVars: {
          // 直接覆盖变量不需要@
          blue: '#3296fa'
          // 或者可以通过 less 文件覆盖
        }
      }
    }
  }
}
