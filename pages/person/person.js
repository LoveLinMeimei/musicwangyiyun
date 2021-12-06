import request from '../../util/request'
let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离 
Page({

    // 页面的初始数据
    data: {
      coverTransform: 'translateY(0)',
      coverTransition: '',
      userInfo: {}, // 用户信息
      recentPlayRecordList: [] // 最近播放记录
    },

    // 生命周期函数--监听页面加载
    onLoad: function (options) {
      // 读取用户信息
      const userInfo = wx.getStorageSync('profile') ? JSON.parse(wx.getStorageSync('profile')) : ''
      if (userInfo) {
        // 更新userInfo的状态
        this.setData({
          userInfo: userInfo
        })
        // 获取用户的播放记录
        this.recentPlayRecord(this.data.userInfo.userId)
      }
    },

    // 跳转道登录Login页面的回调
    toLogin () {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    },

    // 获取用户的播放记录
    async recentPlayRecord (uid) {
      const result = await request('/user/record', {uid})
      const newArr = result.allData.slice(result.allData.length - 16, result.allData.length - 1)
      this.setData({
        recentPlayRecordList: newArr
      })
    },

    handleTouchStart (event) {
      startY = event.touches[0].clientY
      this.setData({
        coverTransition: ''
      })
    },

    handleTouchMove (event) {
      moveY = event.touches[0].clientY
      moveDistance = moveY - startY
      if (moveDistance <= 0) {
        return
      }
      if (moveDistance >= 80) {
        moveDistance = 80
      }
      this.setData({
        coverTransform: `translateY(${moveDistance}rpx)`
      })
    },

    handleTouchEnd (event) {
      this.setData({
        coverTransform: `translateY(0rpx)`,
        coverTransition: 'transform 1s linear'
      })
    },

    // 生命周期函数--监听页面初次渲染完成
    onReady: function () {

    },

    // 生命周期函数--监听页面显示
    onShow: function () {

    },

    // 生命周期函数--监听页面隐藏
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