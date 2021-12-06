import config from './config'
export default (url, data={}, method='GET') => {
  // new Promise初始化的Promise实例状态为pending
  return new Promise((resolve, reject) => {
    const cookies = wx.getStorageSync('cookies')
    const index1 = cookies.indexOf("MUSIC_U")
    const newStr = cookies.slice(index1)
    const index2 = newStr.indexOf(';MUSIC_A_T')
    const newCookies = newStr.slice(0, index2)
    wx.request({
      url: `${config.host}${url}`,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? newCookies : ''
      },
      success (result) {
        // console.log('请求成功', result)
        resolve(result.data)
      },
      fail (err) {
        // console.log('请求失败', err);
        reject(err)
      }
    })
  })
}