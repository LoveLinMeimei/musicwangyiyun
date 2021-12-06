import request from '../../util/request'

// pages/index/index.js
Page({

  // 页面的初始数据
  data: {
    bannerList: [], // 轮播图列表
    recommendList: [], // 推荐新歌单
    topList: [], // 排行榜数据
  },

  // 生命周期函数--监听页面加载
  onLoad: async function (options) {
    const bannerListData = await request('/banner', {type: 2})
    this.setData({
      bannerList: bannerListData.banners
    })

    // 推荐新歌单
    const result = await request('/personalized', {limit: 6})
    this.setData({
      recommendList: result.result
    })
    
    // 排行榜
    // 获取所有榜单的id
    const allRangking = await request('/toplist')
    let allRangkingId = []
    for (const allRangkingItem of allRangking.list) {
      allRangkingId.push(allRangkingItem.id)
    }
    let index = 0
    let resultArr = []
    while (index < 5) {
      // 通过榜单id请求榜单详情
      const rankingListData = await request('/playlist/detail', {id: allRangkingId[index++]})
      // splice会改变原数组，slice不会改变原数组
      let rankingListItem = { name: rankingListData.playlist.name, tracks: rankingListData.playlist.tracks.slice(0, 3) }
      resultArr.push(rankingListItem)
      this.setData({
        topList: resultArr
      })
    }

  },

  // 跳转到推荐页
  goRecommend () {
    wx.navigateTo({
      url: '/pages/recommend/recommend'
    })
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

  // 生命周期函数--监听页面显示
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },

  // 用户点击右上角分享
  onShareAppMessage: function () {

  }
})