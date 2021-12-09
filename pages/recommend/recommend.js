import PubSub from 'pubsub-js'
import request from '../../util/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    month: '',
    recommendList: [], // 每日推荐列表
    musicIndex: '' // 点击音乐的index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const time = new Date().getDate()
    const month = new Date().getMonth() + 1
    this.setData({
      time,
      month
    })
    this.getRecommendList()

    // 订阅来自songDetail的上一首/下一首按钮
    PubSub.subscribe('controlMusicState', (msg, data) => {
      // console.log(data);
      // msg就是事件名controlMusicState， data才是数据

      let { recommendList, musicIndex} = this.data
      if (data[1] === 0) {
        // 顺序播放
        if (data[0] === 'pre') {
          if (musicIndex === 0) {
            musicIndex = recommendList.length
          }
          musicIndex -= 1
        } else {
          if (musicIndex === recommendList.length - 1) {
            musicIndex = -1
          }
          musicIndex += 1
        }
      } else if (data[1] === 1) {
        // 随机播放
        musicIndex = parseInt(Math.random() * recommendList.length)
      } else {
        // 单曲循环
        musicIndex = musicIndex
      }
      this.setData({
        musicIndex
      })
      const musicId = recommendList[musicIndex].id

      /* let { recommendList, musicIndex} = this.data
      if (data[0] === 'pre') {
        // 切换上一首
        if (musicIndex === 0) {
          musicIndex = recommendList.length
        }
        musicIndex -= 1
      } else {
        // 切换下一首
        if (musicIndex === recommendList.length - 1) {
          musicIndex = -1
        }
        musicIndex += 1
      }
      this.setData({
        musicIndex
      })
      const musicId = recommendList[musicIndex].id */
      // 发布给songDetail
      PubSub.publish('sendMusicId', musicId)
    })
  },

  // 获取每日推荐列表
  async getRecommendList () {
    const { data } = await request('/recommend/songs')
    this.setData({
      recommendList: data.dailySongs
    })
  },

  goSongDetail (event) {
    const id = event.currentTarget.id
    let musicIndex = event.currentTarget.dataset.musicindex
    this.setData({
      musicIndex
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?id='+ id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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