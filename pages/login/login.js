 // pages/login/login.js
import request from '../../util/request'
Page({

  // 页面的初始数据
  data: {
    phone: '',
    password: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
  },

  // 登录
  async login () {
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    const phone = this.data.phone
    const password = this.data.password
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    const result = await request('/login/cellphone', {phone, password})
    wx.hideLoading()
    if (result.code === 200) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      // wx.setStorageSync('cookies', JSON.stringify(result.cookie))
      wx.setStorageSync('profile', JSON.stringify(result.profile))
      wx.setStorage({
        key: 'cookies',
        data: result.cookie
      })
      wx.reLaunch({
        url: '/pages/person/person'
      })
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      })
    }
  },

  handleInput (event) {
    // console.log(event)
    const type = event.currentTarget.id
    const value = event.detail.value
    this.setData({
      [type]: value
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