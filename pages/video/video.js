import request from '../../util/request'
Page({
  data: {
    videoGroupList: [], // 视频标签列表
    navId: '', // 点击视频标签列表的id 
    videoGroup: [], // 视频列表
    videoId: '', // 视频的id
    videoUrl: {}, // 视频的地址
    videoUpdateTime: [], // 视频进度
    pullRefreshFlag: true // 下拉刷新状态
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.getVideoGroupList()
    // 获取本地cookies,没有coolies看不了视频
    this.getCookies ()
  },

  getCookies () {
    if (!wx.getStorageSync('profile')) {
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
      wx.reLaunch({
        url: '/pages/person/person'
      })
    }
  },

  // 获取视频标签列表
  async getVideoGroupList() {
    const result = await request('/video/group/list')
    this.setData({
      videoGroupList: result.data.slice(result.data.length - 16, result.data.length - 1),
      navId: result.data[0].id
    })

    // 获取视频标签/分类下的视频
    this.getVideoList(this.data.navId)
  },

  // 获取视频标签/分类下的视频列表
  async getVideoList(navId) {
    if (!navId) {
      return
    }
    const result = await request('/video/group', {id: navId})
    const videoGroup = result.datas
    this.setData({
      videoGroup,
      pullRefreshFlag: false
    })
    wx.hideLoading()
  },

  // 点击视频标签
  handleActive (event) {
    this.setData({
      navId: event.currentTarget.id * 1,
      videoGroup: []
    })
    // 显示正在加载
    wx.showLoading({
      title: '正在加载'
    })
    this.getVideoList(this.data.navId)
  },

  // 点击视频/继续点击视频
  async handlePlay (event) {
    const vid = event.currentTarget.id
    if (event.type === 'tap') {
      // 图片
      // const vid = event.currentTarget.id
      this.setData({
        videoId: vid,
        videoUrl: {}
      })
    }
    
    const videoUrl = await request('/video/url', {id: vid})
    console.log(videoUrl.urls[0].url)
    this.setData({
      videoUrl: videoUrl.urls[0]
    })
    this.videoContext = wx.createVideoContext(vid)
    let { videoUpdateTime } = this.data
    const videoItem = videoUpdateTime.find(item => {
      return item.vid === vid
    })
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
  },



  // 获取视频的播放记录
  handleUpdateTime (event) {
    let videoItemObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
    let { videoUpdateTime } = this.data

    let videoUpdateTimeItem = videoUpdateTime.find(item => item.vid === event.currentTarget.id)
    if (videoUpdateTimeItem) {
      videoUpdateTimeItem.currentTime = event.detail.currentTime
    } else {
      videoUpdateTime.push(videoItemObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  // 视频播放到末尾时触发事件
  handlended (event) {
    const vid = event.currentTarget.id
    let { videoUpdateTime } = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => {
      item.vid === vid
    }), 1)
    this.setData({
      videoUpdateTime
    })
  },

  // 自定义下拉刷新
  pullRefresh () {
    this.getVideoList(this.data.navId)
  },

  // 跳转到搜索页
  gotoSearch () {
    wx.navigateTo({
      url: '/packageSearch/pages/search/search'
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