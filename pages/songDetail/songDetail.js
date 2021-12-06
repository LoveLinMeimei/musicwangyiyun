import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../util/request'
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // true为播放
    id: '', // 歌曲id
    songDetail: [], // 歌曲详情对象
    musicLink: '', // 歌曲播放地址
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0 // 实时宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    // 获取歌曲的详情
    this.getSongDetail(options.id)

    // 判断全局是否有播放的视频
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === options.id) {
      this.setData({
        isPlay: true
      })
    }
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changPlayState(true)
      appInstance.globalData.musicId = options.id
    })
    this.backgroundAudioManager.onPause(() => {
      this.changPlayState(false)
    })
    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 当前实时的时间
      const currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss")
      // 计算实时进度条的宽度
      const currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 400
      this.setData({
        currentTime,
        currentWidth
      })
    })
    this.backgroundAudioManager.onStop(() => {
      this.changPlayState(false)
    })
    this.backgroundAudioManager.onEnded(() => {
      // 播放到最后，自动切换到下一首
      PubSub.publish('controlMusicState', 'next')
      // 将实时进度条的长度还原成 0；时间还原成 0；
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
  },

  changPlayState (isPlay) {
    this.setData({
      isPlay
    })
    // 修改全局的播放状态
    appInstance.globalData.isMusicPlay = isPlay
  },

  // 获取歌曲的详情
  async getSongDetail (id) {
    const { songs } = await request('/song/detail', {ids: id})
    const durationTime = moment(songs[0].dt).format("mm:ss")
    this.setData({
      songDetail: songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.songDetail.name
    })
  },

  // 点击播放/暂停的回调
  handleMusicPlay () {
    const isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    // 获取音乐播放的地址 
    this.musicControl(isPlay, this.data.id, this.data.musicLink)
  },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, id, musicLink) {
    if (isPlay) {
      // 音乐播放
      if (!musicLink) {
        const { data } = await request('/song/url', {id})
        let musicLink = data[0].url
        this.setData({
          musicLink
        })
        this.backgroundAudioManager.src = musicLink
        this.backgroundAudioManager.title = this.data.songDetail.name
        this.backgroundAudioManager.play()
      } else {
        this.backgroundAudioManager.src = musicLink
        this.backgroundAudioManager.title = this.data.songDetail.name
        this.backgroundAudioManager.play()
      }
    } else {
      // 音乐暂停
      this.backgroundAudioManager.pause()
    }
  },

  // 控制音乐上一首/下一首音乐
  handleSwitch (event) {
    const type = event.currentTarget.id
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    // 订阅来自recommend的数据
    PubSub.subscribe('sendMusicId', (msg, musicId) => {
      // 获取音乐的详情信息
      this.getSongDetail(musicId)
      // 自动播放当前的音乐
      this.musicControl(true, musicId)
      // 取消订阅
      PubSub.unsubscribe('sendMusicId');
    })
    // 发布
    PubSub.publish('controlMusicState', type)
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