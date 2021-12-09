import request from '../../../util/request'
let isSend = false // 联想建议节流
Page({
  data: {
    hotList: [], // 热搜榜列表
    searchDefault: '', //搜索框的默认值
    searchContent: '', // 搜索框的值
    searchResultByKeywords: [], // 输入关键字搜索的结果
    searchRecord: [] // 搜索记录
  },

  onLoad: function (options) {
    // 获取搜索框里的默认值
    this.searchDefault()
    // 获取热搜列表
    this.getHotList()
    // 获取本地的历史记录
    this.getSearchRecord()
  },

  // 获取本地的历史记录
  getSearchRecord () {
    const value = wx.getStorageSync('searchRecord')
    if (value) {
      this.setData({
        searchRecord: value
      })
    }
  },

  // 获取搜索框里的默认值
  async searchDefault() {
    let defalutResult = await request('/search/default')
    this.setData({
      searchDefault: defalutResult.data.showKeyword
    })
  },

  // 获取热搜列表
  async getHotList() {
    const result = await request('/search/hot/detail')
    this.setData({
      hotList: result.data
    })
  },

  // 点击搜索框
  handleInputChange (event) {
    const searchContent = event.detail.value
    this.setData({
      searchContent: searchContent.trim()
    })
    if (isSend) {
      return
    }
    isSend = true
    // 获取搜索的联想建议
    this.searchResultByKeywords(searchContent)
    setTimeout(() => {
      isSend = false
    }, 300)
  },

  // 点击搜索框的x删除搜索框的内容
  clearSearchContent () {
    this.setData({
      searchContent: '',
      searchResultByKeywords: []
    })
  },

  // 点击垃圾桶，删除全部历史记录
  handleDelAllSearchRecord () {
    const that = this
    wx.showModal({
      cancelColor: '#d43b33',
      confirmColor: '#d43b33',
      content: '确定清空全部历史记录吗？',
      complete (res) {
        if (res.confirm) {
          wx.removeStorageSync('searchRecord')
          that.setData({
            searchRecord: []
          })
        }
      }
    })
  },

  // 点击取消按钮,跳转到视频页
  handleGotoView () {
    wx.navigateBack()
  },

  // 获取搜索的联想建议
  async searchResultByKeywords (searchContent) {
    if (!searchContent) {
      this.setData({
        searchResultByKeywords: []
      })
      return
    }
    const searchRsult = await request('/search', {keywords: searchContent, limit: 10})

    let { searchRecord } = this.data
    let index = searchRecord.indexOf(searchContent)
    if (index !== -1) {
      // 历史记录里面已经有记录了,先删除记录
      searchRecord.splice(index, 1)
    }
    // 在数组头添加记录
    searchRecord.unshift(searchContent)
    // 将数组放到本地
    wx.setStorageSync('searchRecord', searchRecord)

    this.setData({
      searchResultByKeywords: searchRsult.result.songs,
      searchRecord
    })
  },

  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },

  
  onUnload: function () {

  },

 
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})