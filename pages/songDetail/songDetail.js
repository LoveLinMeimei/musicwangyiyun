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
    categoryActive:0, //当前播放方式 0:顺序播放 1：随机播放 2：单曲循环
    id: '', // 歌曲id
    songDetail: [], // 歌曲详情对象
    musicLink: '', // 歌曲播放地址
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时宽度
    isLrc: true, // 是否显示歌词，false为歌词
    lrcArr: [], // 歌词时间
    lrc: [], // 歌词
    locationIndex: 0, // 当前播放歌词的index
    distanceTop: 0 // 距离顶部的距离
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
      const currentTimeBySecond = this.backgroundAudioManager.currentTime
      // 为了显示在进度条的时间
      const currentTime = moment(currentTimeBySecond * 1000).format("mm:ss")
      // 计算实时进度条的宽度
      const currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 400
      this.setData({
        currentTime,
        currentWidth
      })

      // 计算当前时间在那句歌词的下标
      let lrcArr = this.data.lrcArr
      for (let i = 0; i < lrcArr.length; i++) {
        if (currentTimeBySecond >= lrcArr[i] && currentTimeBySecond < lrcArr[i+1]) {
          this.setData({
            locationIndex: i
          })
        }
      }

      // 定位自动滚动
      let { locationIndex } = this.data
      if (locationIndex > 2) {
        this.setData({
          distanceTop: (locationIndex - 2) * 50
        })
      }
    })
    this.backgroundAudioManager.onStop(() => {
      this.changPlayState(false)
    })
    this.backgroundAudioManager.onEnded(() => {
      // 播放到最后，自动切换到下一首
      PubSub.publish('controlMusicState', ['next', this.data.categoryActive])
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
      this.backgroundAudioManager.pause()
    }
  },

  // 控制音乐上一首/下一首音乐
  handleSwitch (event) {
    /* const type = event.currentTarget.id
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
    PubSub.publish('controlMusicState', type) */


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
    PubSub.publish('controlMusicState', [type, this.data.categoryActive])
  },

  // 判断是否要显示歌词
  isLrc () {
    const { isLrc } = this.data
    if (isLrc) {
      const {id} = this.data
      // 获取歌词
      this.getSongLyric(id)
    }
    this.setData({
      isLrc: !isLrc
    })
  },

  // 获取歌词
  async getSongLyric(id) {
    const songLyricResult = await request('/lyric', {id})
    let str = songLyricResult.lrc.lyric
      // 歌词时间
      let lrcArr = []
      // 歌词
      let arr = []
      // 将字符串通过\n拆分成数组
      str = str.split(/\n/g)
      str.map(item => {
        // 提取歌词前面的时间
        let i = item.match(new RegExp("\\[[0-9]*:[0-9]*.[0-9]*\\]","g"))
        if (i) {
          // 去掉时间[00:03.45]中的'[' ']' 得到00:03.45
          i=i[0].replace('[','').replace(']','')
          // 转换时间 分钟转化为秒
          let time = Number(i.split(':')[0] * 60) + Number(i.split(':')[1].split('.')[0])
          lrcArr.push(time)
          // 去除歌词的时间
          arr.push(item.replace(new RegExp("\\[(.*)\\]","g"),""))
        }
      })
      //去空
      let a1=[]
      let a2=[]
      for(let i=0; i<arr.length; i++){
        if(arr[i] && lrcArr[i]){
          //当前是否有歌词
          a1.push(arr[i])
          a2.push(lrcArr[i])
        }
      }
      arr = a1
      lrcArr = a2
      this.setData({
        lrc:arr,
        lrcArr:lrcArr
      })
  },

  // 切换当前播放方式
  toggleCategory () {
    let { categoryActive } = this.data
    categoryActive = categoryActive + 1
    if(categoryActive > 2) {
      categoryActive = 0
    }
    this.setData({
      categoryActive
    })
    if (categoryActive === 0) {
      wx.showToast({
        title: '顺序播放',
        icon: 'none'
      })
    } else if (categoryActive === 1) {
      wx.showToast({
        title: '随机播放',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '单曲循环',
        icon: 'none'
      })
    }
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