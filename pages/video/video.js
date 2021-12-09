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
    if (event.type === 'tap') {
      // 图片
      const vid = event.currentTarget.id
      this.setData({
        videoId: vid
      })
    }
    const vid = event.currentTarget.id
    const videoUrl = await request('/video/url', {id: vid})
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
      url: '/pages/search/search'
    })
  },

  // 触碰到视频的底部
  /* touchScrollTolower () {
    console.log('...')
    let newVideoList = [
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_574822A4AA0BB86C085F0E1D695DE79F",
          "coverUrl": "https://p1.music.126.net/TjLKlMhhPGehpwN-VEBw6g==/109951163782199681.jpg",
          "height": 1080,
          "width": 1920,
          "title": "Dimitri Vegas & Like Mike安特卫普疯狂花园专场精彩瞬间",
          "description": "Dimitri Vegas & Like Mike安特卫普疯狂花园专场精彩瞬间~[爱心]",
          "commentCount": 99,
          "shareCount": 142,
          "resolutions": [
            {
              "resolution": 240,
              "size": 135571190
            },
            {
              "resolution": 480,
              "size": 225655170
            },
            {
              "resolution": 720,
              "size": 323478852
            },
            {
              "resolution": 1080,
              "size": 491645679
            }
        ],
        "creator": {
          "defaultAvatar": false,
          "province": 1000000,
          "authStatus": 0,
          "followed": false,
          "avatarUrl": "http://p1.music.126.net/gwo2gF5hoxIpjRo9rInTww==/109951165458912579.jpg",
          "accountStatus": 0,
          "gender": 1,
          "city": 1001200,
          "birthday": 945532800000,
          "userId": 32001163,
          "userType": 0,
          "nickname": "DimitriVegasLikeMikeChina",
          "signature": "新浪微博——DimitriVegasLikeMikeChina",
          "description": "",
          "detailDescription": "",
          "avatarImgId": 109951165458912580,
          "backgroundImgId": 109951164193514980,
          "backgroundUrl": "http://p1.music.126.net/71BqX_2BQULVWqBUB6hSog==/109951164193514981.jpg",
          "authority": 0,
          "mutual": false,
          "expertTags": null,
          "experts": null,
          "djStatus": 10,
          "vipType": 11,
          "remarkName": null,
          "backgroundImgIdStr": "109951164193514981",
          "avatarImgIdStr": "109951165458912579"
          },
          "urlInfo": null,
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": null
            },
            {
              "id": 58104,
              "name": "音乐节",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2239443855_fYfquSW3.webp?wsSecret=22eb7ef5ac18ba04d9617dac2eb3ccb1&wsTime=1638530249",
          "previewDurationms": 4000,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "574822A4AA0BB86C085F0E1D695DE79F",
          "durationms": 885900,
          "playTime": 140864,
          "praisedCount": 653,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_2B38BC0387BD6BFF9EC55C86C99BE230",
          "coverUrl": "https://p1.music.126.net/HAtlyVBr_i9KTMTw-vhMjg==/109951163638698318.jpg",
          "height": 720,
          "width": 1280,
          "title": "好听到炸裂！林俊杰演唱会上献唱陈奕迅《十年》粤语版",
          "description": "好听到炸裂！林俊杰演唱会上献唱陈奕迅《十年》粤语版，听醉了！",
          "commentCount": 269,
          "shareCount": 498,
          "resolutions": [
            {
              "resolution": 240,
              "size": 10483102
            },
            {
              "resolution": 480,
              "size": 16122375
            },
            {
              "resolution": 720,
              "size": 21313028
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/VPGeeVnQ0jLp4hK9kj0EPg==/18897306347016806.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 1002400,
            "birthday": -2209017600000,
            "userId": 449979212,
            "userType": 207,
            "nickname": "全球潮音乐",
            "signature": "有时候音乐是陪我熬过那些夜晚的唯一朋友。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18897306347016810,
            "backgroundImgId": 18987466300481468,
            "backgroundUrl": "http://p1.music.126.net/qx6U5-1LCeMT9t7RLV7r1A==/18987466300481468.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "华语音乐|欧美音乐资讯达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "18987466300481468",
            "avatarImgIdStr": "18897306347016806"
          },
          "urlInfo": null,
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 11110,
              "name": "林俊杰",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2089179435_3aqyAKVW.webp?wsSecret=2fc5fec8f8c24c0012a640835c13a9bc&wsTime=1638530249",
          "previewDurationms": 4000,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "十年",
              "id": 446875807,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 3715,
                  "name": "梁朝伟",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 8327,
                  "name": "李宇春",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [
                "电影《摆渡人》岁月版主题曲"
              ],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 0,
              "v": 11,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 35052152,
                "name": "十年",
                "picUrl": "http://p3.music.126.net/96FnT-ztJjJkE1EbV-nGcg==/18781857627302141.jpg",
                "tns": [],
                "pic_str": "18781857627302141",
                "pic": 18781857627302140
              },
              "dt": 252509,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 10103162,
                "vd": -16300
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 6061915,
                "vd": -13700
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 4041291,
                "vd": -12000
              },
              "a": null,
              "cd": "1",
              "no": 0,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 0,
              "mv": 5411087,
              "publishTime": 1481817600007,
              "privilege": {
                "id": 446875807,
                "fee": 0,
                "payed": 0,
                "st": 0,
                "pl": 999000,
                "dl": 999000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 320000,
                "toast": false,
                "flag": 128,
                "preSell": false
              }
            }
          ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "2B38BC0387BD6BFF9EC55C86C99BE230",
            "durationms": 136836,
            "playTime": 556506,
            "praisedCount": 4787,
            "praised": false,
            "subscribed": false
          }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_435156FD844DAC1A8BC2FC6E7F056165",
            "coverUrl": "https://p1.music.126.net/0F9InrWopAjfFbzqqv1YlA==/109951164792399568.jpg",
            "height": 720,
            "width": 1280,
            "title": "NOTD/SHY Martin - Keep You Mine 不插电现场",
            "description": null,
            "commentCount": 10,
            "shareCount": 20,
            "resolutions": [
                {
                    "resolution": 240,
                    "size": 18676622
                },
                {
                    "resolution": 480,
                    "size": 30760325
                },
                {
                    "resolution": 720,
                    "size": 41394398
                }
            ],
            "creator": {
                "defaultAvatar": false,
                "province": 1000000,
                "authStatus": 0,
                "followed": false,
                "avatarUrl": "http://p1.music.126.net/oUS25ha9PTn-U_FRtAaV4A==/109951166668380004.jpg",
                "accountStatus": 0,
                "gender": 0,
                "city": 1010000,
                "birthday": 1600790400000,
                "userId": 100028937,
                "userType": 0,
                "nickname": "BennyMyDear",
                "signature": "一个infp的自白",
                "description": "",
                "detailDescription": "",
                "avatarImgId": 109951166668380000,
                "backgroundImgId": 109951166356051870,
                "backgroundUrl": "http://p1.music.126.net/UcfBS9u375_SYbUymAzPAA==/109951166356051868.jpg",
                "authority": 0,
                "mutual": false,
                "expertTags": null,
                "experts": null,
                "djStatus": 10,
                "vipType": 0,
                "remarkName": null,
                "backgroundImgIdStr": "109951166356051868",
                "avatarImgIdStr": "109951166668380004"
            },
            "urlInfo": null,
            "videoGroup": [
                {
                    "id": 58100,
                    "name": "现场",
                    "alg": null
                },
                {
                    "id": 1100,
                    "name": "音乐现场",
                    "alg": null
                },
                {
                    "id": 5100,
                    "name": "音乐",
                    "alg": null
                }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
                {
                    "name": "Keep You Mine",
                    "id": 1381706037,
                    "pst": 0,
                    "t": 0,
                    "ar": [
                        {
                            "id": 12262306,
                            "name": "NOTD",
                            "tns": [],
                            "alias": []
                        },
                        {
                            "id": 12354062,
                            "name": "SHY Martin",
                            "tns": [],
                            "alias": []
                        }
                    ],
                    "alia": [],
                    "pop": 100,
                    "st": 0,
                    "rt": "",
                    "fee": 8,
                    "v": 6,
                    "crbt": null,
                    "cf": "",
                    "al": {
                        "id": 80750694,
                        "name": "Keep You Mine",
                        "picUrl": "http://p4.music.126.net/9ABzx6Krz5PtO0lPQxz2eA==/109951164259952504.jpg",
                        "tns": [],
                        "pic_str": "109951164259952504",
                        "pic": 109951164259952510
                    },
                    "dt": 174811,
                    "h": {
                        "br": 320000,
                        "fid": 0,
                        "size": 6993546,
                        "vd": -66980
                    },
                    "m": {
                        "br": 192000,
                        "fid": 0,
                        "size": 4196145,
                        "vd": -64590
                    },
                    "l": {
                        "br": 128000,
                        "fid": 0,
                        "size": 2797444,
                        "vd": -63354
                    },
                    "a": null,
                    "cd": "01",
                    "no": 1,
                    "rtUrl": null,
                    "ftype": 0,
                    "rtUrls": [],
                    "djId": 0,
                    "copyright": 1,
                    "s_id": 0,
                    "rtype": 0,
                    "rurl": null,
                    "mst": 9,
                    "cp": 7003,
                    "mv": 10886107,
                    "publishTime": 1564675200000,
                    "privilege": {
                        "id": 1381706037,
                        "fee": 8,
                        "payed": 1,
                        "st": 0,
                        "pl": 320000,
                        "dl": 320000,
                        "sp": 7,
                        "cp": 1,
                        "subp": 1,
                        "cs": false,
                        "maxbr": 320000,
                        "fl": 128000,
                        "toast": false,
                        "flag": 4,
                        "preSell": false
                    }
                },
                {
                    "name": "Keep You Mine (Acoustic)",
                    "id": 1392089491,
                    "pst": 0,
                    "t": 0,
                    "ar": [
                        {
                            "id": 12262306,
                            "name": "NOTD",
                            "tns": [],
                            "alias": []
                        },
                        {
                            "id": 12354062,
                            "name": "SHY Martin",
                            "tns": [],
                            "alias": []
                        }
                    ],
                    "alia": [],
                    "pop": 100,
                    "st": 0,
                    "rt": "",
                    "fee": 8,
                    "v": 4,
                    "crbt": null,
                    "cf": "",
                    "al": {
                        "id": 81786604,
                        "name": "Keep You Mine (Acoustic)",
                        "picUrl": "http://p3.music.126.net/geaujuQSQGdu0ecrWdRKqQ==/109951164375336732.jpg",
                        "tns": [],
                        "pic_str": "109951164375336732",
                        "pic": 109951164375336740
                    },
                    "dt": 183484,
                    "h": {
                        "br": 320000,
                        "fid": 0,
                        "size": 7340452,
                        "vd": -43784
                    },
                    "m": {
                        "br": 192000,
                        "fid": 0,
                        "size": 4404289,
                        "vd": -41172
                    },
                    "l": {
                        "br": 128000,
                        "fid": 0,
                        "size": 2936207,
                        "vd": -39452
                    },
                    "a": null,
                    "cd": "01",
                    "no": 1,
                    "rtUrl": null,
                    "ftype": 0,
                    "rtUrls": [],
                    "djId": 0,
                    "copyright": 1,
                    "s_id": 0,
                    "rtype": 0,
                    "rurl": null,
                    "mst": 9,
                    "cp": 7003,
                    "mv": 10892750,
                    "publishTime": 1568908800000,
                    "privilege": {
                        "id": 1392089491,
                        "fee": 8,
                        "payed": 1,
                        "st": 0,
                        "pl": 320000,
                        "dl": 320000,
                        "sp": 7,
                        "cp": 1,
                        "subp": 1,
                        "cs": false,
                        "maxbr": 320000,
                        "fl": 128000,
                        "toast": false,
                        "flag": 4,
                        "preSell": false
                    }
                }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "435156FD844DAC1A8BC2FC6E7F056165",
            "durationms": 199000,
            "playTime": 22230,
            "praisedCount": 162,
            "praised": false,
            "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_216AAD8DAC6E30B8808A3AF39ADAF54A",
            "coverUrl": "https://p2.music.126.net/sG4cBZg_UbKHZTFUOx46Wg==/109951163734302912.jpg",
            "height": 540,
            "width": 1050,
            "title": "当年这首歌火遍大街小巷，终于找到了这最美现场！人美歌声更美",
            "description": null,
            "commentCount": 59,
            "shareCount": 80,
            "resolutions": [
                {
                    "resolution": 240,
                    "size": 23123952
                },
                {
                    "resolution": 480,
                    "size": 41681120
                }
            ],
            "creator": {
                "defaultAvatar": false,
                "province": 110000,
                "authStatus": 0,
                "followed": false,
                "avatarUrl": "http://p1.music.126.net/yWQieIcccog6GW9W65N6VQ==/109951164162893023.jpg",
                "accountStatus": 0,
                "gender": 0,
                "city": 110101,
                "birthday": -2209017600000,
                "userId": 1471220191,
                "userType": 0,
                "nickname": "耳朵听了会怀孕啊",
                "signature": "",
                "description": "",
                "detailDescription": "",
                "avatarImgId": 109951164162893020,
                "backgroundImgId": 109951162868126480,
                "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
                "authority": 0,
                "mutual": false,
                "expertTags": null,
                "experts": {
                    "1": "泛生活视频达人"
                },
                "djStatus": 0,
                "vipType": 0,
                "remarkName": null,
                "backgroundImgIdStr": "109951162868126486",
                "avatarImgIdStr": "109951164162893023"
            },
            "urlInfo": null,
            "videoGroup": [
                {
                    "id": 58100,
                    "name": "现场",
                    "alg": null
                },
                {
                    "id": 9102,
                    "name": "演唱会",
                    "alg": null
                },
                {
                    "id": 57107,
                    "name": "韩语现场",
                    "alg": null
                },
                {
                    "id": 57108,
                    "name": "流行现场",
                    "alg": null
                },
                {
                    "id": 1100,
                    "name": "音乐现场",
                    "alg": null
                },
                {
                    "id": 5100,
                    "name": "音乐",
                    "alg": null
                }
            ],
            "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2189104779_ZJN0UDtq.webp?wsSecret=10d783b9e4026fe70341b00e2f194390&wsTime=1638530249",
            "previewDurationms": 4000,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
                {
                    "name": "The Day You Went Away",
                    "id": 5387384,
                    "pst": 0,
                    "t": 0,
                    "ar": [
                        {
                            "id": 127388,
                            "name": "Orange Caramel",
                            "tns": [],
                            "alias": []
                        }
                    ],
                    "alia": [],
                    "pop": 55,
                    "st": 0,
                    "rt": "",
                    "fee": 8,
                    "v": 32,
                    "crbt": null,
                    "cf": "",
                    "al": {
                        "id": 528624,
                        "name": "샹하이 로맨스",
                        "picUrl": "http://p3.music.126.net/ddhzpLi6bbI-i_WTXiXuUw==/684995744115676.jpg",
                        "tns": [],
                        "pic": 684995744115676
                    },
                    "dt": 220120,
                    "h": {
                        "br": 320000,
                        "fid": 0,
                        "size": 8807488,
                        "vd": -29600
                    },
                    "m": {
                        "br": 192000,
                        "fid": 0,
                        "size": 5284510,
                        "vd": -27200
                    },
                    "l": {
                        "br": 128000,
                        "fid": 0,
                        "size": 3523021,
                        "vd": -25500
                    },
                    "a": null,
                    "cd": "1",
                    "no": 3,
                    "rtUrl": null,
                    "ftype": 0,
                    "rtUrls": [],
                    "djId": 0,
                    "copyright": 1,
                    "s_id": 0,
                    "rtype": 0,
                    "rurl": null,
                    "mst": 9,
                    "cp": 1410822,
                    "mv": 0,
                    "publishTime": 1318435200000,
                    "tns": [
                        "第一次爱的人"
                    ],
                    "privilege": {
                        "id": 5387384,
                        "fee": 8,
                        "payed": 1,
                        "st": 0,
                        "pl": 999000,
                        "dl": 999000,
                        "sp": 7,
                        "cp": 1,
                        "subp": 1,
                        "cs": false,
                        "maxbr": 999000,
                        "fl": 128000,
                        "toast": false,
                        "flag": 260,
                        "preSell": false
                    }
                }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "216AAD8DAC6E30B8808A3AF39ADAF54A",
            "durationms": 196202,
            "playTime": 203641,
            "praisedCount": 501,
            "praised": false,
            "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_5A5CDCC5760BC5BAF65615B4E502F4FB",
            "coverUrl": "https://p2.music.126.net/LXp2OszfqTKOOvzMuSGvLA==/109951164080010886.jpg",
            "height": 1080,
            "width": 1920,
            "title": "脸红的思春期(Bol4) - 给你宇宙",
            "description": "[190508饭拍] 脸红的思春期(Bol4) - 우주를 줄게(给你宇宙) @圆光大学",
            "commentCount": 51,
            "shareCount": 36,
            "resolutions": [
                {
                    "resolution": 240,
                    "size": 44275369
                },
                {
                    "resolution": 480,
                    "size": 72054167
                },
                {
                    "resolution": 720,
                    "size": 105317030
                },
                {
                    "resolution": 1080,
                    "size": 178699215
                }
            ],
            "creator": {
                "defaultAvatar": false,
                "province": 510000,
                "authStatus": 0,
                "followed": false,
                "avatarUrl": "http://p1.music.126.net/8YxPp8E6z07I9OYsMntQ9Q==/109951166533934017.jpg",
                "accountStatus": 0,
                "gender": 1,
                "city": 510100,
                "birthday": 838224000000,
                "userId": 99571023,
                "userType": 207,
                "nickname": "U-Complete-Me",
                "signature": "My wasted heart will always love you.\nI blessed a day I found you.\nHow can I love the heartbreak,  you're the one  I love…\n喜欢的歌：极丧，极嗨，极甜",
                "description": "",
                "detailDescription": "",
                "avatarImgId": 109951166533934020,
                "backgroundImgId": 109951164341959310,
                "backgroundUrl": "http://p1.music.126.net/pdYGykkyb6ZGylr995sBBg==/109951164341959306.jpg",
                "authority": 0,
                "mutual": false,
                "expertTags": null,
                "experts": {
                    "1": "音乐视频达人"
                },
                "djStatus": 10,
                "vipType": 11,
                "remarkName": null,
                "backgroundImgIdStr": "109951164341959306",
                "avatarImgIdStr": "109951166533934017"
            },
            "urlInfo": null,
            "videoGroup": [
                {
                    "id": 58100,
                    "name": "现场",
                    "alg": null
                },
                {
                    "id": 57107,
                    "name": "韩语现场",
                    "alg": null
                },
                {
                    "id": 57108,
                    "name": "流行现场",
                    "alg": null
                },
                {
                    "id": 59108,
                    "name": "巡演现场",
                    "alg": null
                },
                {
                    "id": 1100,
                    "name": "音乐现场",
                    "alg": null
                },
                {
                    "id": 5100,
                    "name": "音乐",
                    "alg": null
                }
            ],
            "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2505913749_hSTkjDT7.webp?wsSecret=1d5280bbcf983206ec407bef820d578f&wsTime=1638530249",
            "previewDurationms": 4000,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "5A5CDCC5760BC5BAF65615B4E502F4FB",
            "durationms": 265010,
            "playTime": 294533,
            "praisedCount": 1445,
            "praised": false,
            "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_3EB96F13FC33EC2F2DD911741016071B",
            "coverUrl": "https://p1.music.126.net/3jrdJMvhwk8jMmBS420icw==/109951164965658033.jpg",
            "height": 1080,
            "width": 1920,
            "title": "Alexander 23最新Vevo现场表演《I Hate You So Much》",
            "description": "Alexander 23最新Vevo现场表演《I Hate You So Much》",
            "commentCount": 17,
            "shareCount": 41,
            "resolutions": [
                {
                    "resolution": 240,
                    "size": 12545706
                },
                {
                    "resolution": 480,
                    "size": 20748420
                },
                {
                    "resolution": 720,
                    "size": 30917198
                },
                {
                    "resolution": 1080,
                    "size": 58239092
                }
            ],
            "creator": {
                "defaultAvatar": false,
                "province": 1000000,
                "authStatus": 0,
                "followed": false,
                "avatarUrl": "http://p1.music.126.net/Edqapc_7GlSG2ilpkY9_xg==/109951164211458351.jpg",
                "accountStatus": 0,
                "gender": 2,
                "city": 1001300,
                "birthday": 1476028800000,
                "userId": 349697526,
                "userType": 300,
                "nickname": "Daisy_筱筱er",
                "signature": "I'm just folk，I have mood swings. 谢谢小可爱们的关注！主要更新欧美现场（包括很多宝藏歌手的现场） 也会更新欧美翻唱等等一切与欧美音乐相关的视频！一个小小的YouTube视频搬运工～",
                "description": "",
                "detailDescription": "",
                "avatarImgId": 109951164211458350,
                "backgroundImgId": 109951163138406500,
                "backgroundUrl": "http://p1.music.126.net/IAHf10vRjrQxgHr2Jzs_gA==/109951163138406492.jpg",
                "authority": 0,
                "mutual": false,
                "expertTags": null,
                "experts": {
                    "1": "音乐视频达人"
                },
                "djStatus": 0,
                "vipType": 11,
                "remarkName": null,
                "backgroundImgIdStr": "109951163138406492",
                "avatarImgIdStr": "109951164211458351"
            },
            "urlInfo": null,
            "videoGroup": [
                {
                    "id": 58100,
                    "name": "现场",
                    "alg": null
                },
                {
                    "id": 57106,
                    "name": "欧美现场",
                    "alg": null
                },
                {
                    "id": 57108,
                    "name": "流行现场",
                    "alg": null
                },
                {
                    "id": 1100,
                    "name": "音乐现场",
                    "alg": null
                },
                {
                    "id": 5100,
                    "name": "音乐",
                    "alg": null
                },
                {
                    "id": 24134,
                    "name": "弹唱",
                    "alg": null
                }
            ],
            "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_2909781074_8F1umi7Z.webp?wsSecret=ff4296f296b31b5df8151fc5887cde7f&wsTime=1638530249",
            "previewDurationms": 4000,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
                {
                    "name": "I Hate You So Much",
                    "id": 1422619975,
                    "pst": 0,
                    "t": 0,
                    "ar": [
                        {
                            "id": 31659734,
                            "name": "Alexander 23",
                            "tns": [],
                            "alias": []
                        }
                    ],
                    "alia": [],
                    "pop": 100,
                    "st": 0,
                    "rt": "",
                    "fee": 8,
                    "v": 5,
                    "crbt": null,
                    "cf": "",
                    "al": {
                        "id": 85651966,
                        "name": "I Hate You So Much",
                        "picUrl": "http://p4.music.126.net/Efagc02Gl-cUALdMf7SixQ==/109951164698621952.jpg",
                        "tns": [],
                        "pic_str": "109951164698621952",
                        "pic": 109951164698621950
                    },
                    "dt": 148218,
                    "h": {
                        "br": 320000,
                        "fid": 0,
                        "size": 5929840,
                        "vd": -30731
                    },
                    "m": {
                        "br": 192000,
                        "fid": 0,
                        "size": 3557921,
                        "vd": -28119
                    },
                    "l": {
                        "br": 128000,
                        "fid": 0,
                        "size": 2371962,
                        "vd": -26450
                    },
                    "a": null,
                    "cd": "01",
                    "no": 1,
                    "rtUrl": null,
                    "ftype": 0,
                    "rtUrls": [],
                    "djId": 0,
                    "copyright": 1,
                    "s_id": 0,
                    "rtype": 0,
                    "rurl": null,
                    "mst": 9,
                    "cp": 7003,
                    "mv": 10918578,
                    "publishTime": 1581436800000,
                    "privilege": {
                        "id": 1422619975,
                        "fee": 8,
                        "payed": 1,
                        "st": 0,
                        "pl": 320000,
                        "dl": 320000,
                        "sp": 7,
                        "cp": 1,
                        "subp": 1,
                        "cs": false,
                        "maxbr": 320000,
                        "fl": 128000,
                        "toast": false,
                        "flag": 4,
                        "preSell": false
                    }
                }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "3EB96F13FC33EC2F2DD911741016071B",
            "durationms": 189545,
            "playTime": 6977,
            "praisedCount": 108,
            "praised": false,
            "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_CB167F0A08D861C59ABE615B7B3EB33B",
            "coverUrl": "https://p1.music.126.net/z4Bm_kyOdvnkFzDe77jkZA==/109951165218054736.jpg",
            "height": 1080,
            "width": 1920,
            "title": "I Mean Us - 24 Years Old of You 音樂節現場直播版",
            "description": "24現場直播版\n「當在聆聽這首歌的時候想必身強體壯、對音符充滿熱情，耳朵靈敏到可聽見超多細節甚至來自外星的聲音。小鼓進行曲激勵了你們對這世界的想像，當然也許產生了更多的疑惑，但這是年輕人的專利，你們依舊勇往直前的去探索生命、去擁抱真理、去狂放墮落、去爭取正義。」\n\n樂評：阿舌",
            "commentCount": 5,
            "shareCount": 22,
            "resolutions": [
                {
                    "resolution": 240,
                    "size": 27900662
                },
                {
                    "resolution": 480,
                    "size": 51634698
                },
                {
                    "resolution": 720,
                    "size": 80798286
                },
                {
                    "resolution": 1080,
                    "size": 177074456
                }
            ],
            "creator": {
                "defaultAvatar": false,
                "province": 710000,
                "authStatus": 1,
                "followed": false,
                "avatarUrl": "http://p1.music.126.net/QCVWXvG0_sKhSTVHFgobBg==/109951166450820778.jpg",
                "accountStatus": 0,
                "gender": 2,
                "city": 710100,
                "birthday": 1448380800000,
                "userId": 1750414469,
                "userType": 4,
                "nickname": "I_Mean_Us",
                "signature": "I Mean Us / I'm U，2015年底成立于台北，以Dream Pop为基底，曲风杂揉Post Rock、Psychedelic Rock、Shoegaze、Classical等元素。\n\n器乐操弄着九〇年代类比声响，男女主唱交织，唱述着内心的躁动以及曾经满地的心碎。\n\n他们是I Mean Us，唱着世纪末滥情歌。",
                "description": "",
                "detailDescription": "",
                "avatarImgId": 109951166450820780,
                "backgroundImgId": 109951166450830540,
                "backgroundUrl": "http://p1.music.126.net/ayUo1pSWl0Ezvmvotsc8uw==/109951166450830547.jpg",
                "authority": 0,
                "mutual": false,
                "expertTags": null,
                "experts": null,
                "djStatus": 10,
                "vipType": 0,
                "remarkName": null,
                "backgroundImgIdStr": "109951166450830547",
                "avatarImgIdStr": "109951166450820778"
            },
            "urlInfo": null,
            "videoGroup": [
                {
                    "id": 58100,
                    "name": "现场",
                    "alg": null
                },
                {
                    "id": 57106,
                    "name": "欧美现场",
                    "alg": null
                },
                {
                    "id": 57108,
                    "name": "流行现场",
                    "alg": null
                },
                {
                    "id": 59108,
                    "name": "巡演现场",
                    "alg": null
                },
                {
                    "id": 1100,
                    "name": "音乐现场",
                    "alg": null
                },
                {
                    "id": 5100,
                    "name": "音乐",
                    "alg": null
                }
            ],
            "previewUrl": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/preview_3077514514_SFqKvTGa.webp?wsSecret=bf354b3cdc6afc872518dd800cf00d83&wsTime=1638530249",
            "previewDurationms": 4000,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
                {
                    "name": "24 Years Old of You",
                    "id": 1447752518,
                    "pst": 0,
                    "t": 0,
                    "ar": [
                        {
                            "id": 29415260,
                            "name": "I Mean Us",
                            "tns": [],
                            "alias": []
                        }
                    ],
                    "alia": [],
                    "pop": 75,
                    "st": 0,
                    "rt": "",
                    "fee": 8,
                    "v": 4,
                    "crbt": null,
                    "cf": "",
                    "al": {
                        "id": 89385097,
                        "name": "24 Years Old of You",
                        "picUrl": "http://p3.music.126.net/2WFhJkfXrOUgzrViARozAA==/109951165111479107.jpg",
                        "tns": [],
                        "pic_str": "109951165111479107",
                        "pic": 109951165111479100
                    },
                    "dt": 273013,
                    "h": {
                        "br": 320000,
                        "fid": 0,
                        "size": 10923407,
                        "vd": -62491
                    },
                    "m": {
                        "br": 192000,
                        "fid": 0,
                        "size": 6554062,
                        "vd": -59894
                    },
                    "l": {
                        "br": 128000,
                        "fid": 0,
                        "size": 4369389,
                        "vd": -58283
                    },
                    "a": null,
                    "cd": "01",
                    "no": 1,
                    "rtUrl": null,
                    "ftype": 0,
                    "rtUrls": [],
                    "djId": 0,
                    "copyright": 1,
                    "s_id": 0,
                    "rtype": 0,
                    "rurl": null,
                    "mst": 9,
                    "cp": 1416618,
                    "mv": 0,
                    "publishTime": 1590681600000,
                    "privilege": {
                        "id": 1447752518,
                        "fee": 8,
                        "payed": 1,
                        "st": 0,
                        "pl": 999000,
                        "dl": 999000,
                        "sp": 7,
                        "cp": 1,
                        "subp": 1,
                        "cs": false,
                        "maxbr": 999000,
                        "fl": 128000,
                        "toast": false,
                        "flag": 260,
                        "preSell": false
                    }
                }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "CB167F0A08D861C59ABE615B7B3EB33B",
            "durationms": 270278,
            "playTime": 10423,
            "praisedCount": 148,
            "praised": false,
            "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_E29807FF48BB8F6F8D6098759C32CF61",
            "coverUrl": "https://p1.music.126.net/fZaWQA45PdDVx1XEhvnofA==/109951163762512527.jpg",
            "height": 540,
            "width": 1066,
            "title": "霉霉reputation演唱会唱《Style》,超好听呢！",
            "description": null,
            "commentCount": 116,
            "shareCount": 187,
            "resolutions": [
                {
                    "resolution": 240,
                    "size": 16771451
                },
                {
                    "resolution": 480,
                    "size": 29405260
                }
            ],
            "creator": {
                "defaultAvatar": false,
                "province": 650000,
                "authStatus": 0,
                "followed": false,
                "avatarUrl": "http://p1.music.126.net/6J5ay-NJP_Pq9IR8w7rxzQ==/109951165067275467.jpg",
                "accountStatus": 0,
                "gender": 1,
                "city": 652800,
                "birthday": 1051508736125,
                "userId": 125922950,
                "userType": 0,
                "nickname": "Nurzat-A",
                "signature": "",
                "description": "",
                "detailDescription": "",
                "avatarImgId": 109951165067275470,
                "backgroundImgId": 109951163982644380,
                "backgroundUrl": "http://p1.music.126.net/wY25_L6eum1XJgGdJ520GQ==/109951163982644376.jpg",
                "authority": 0,
                "mutual": false,
                "expertTags": null,
                "experts": null,
                "djStatus": 10,
                "vipType": 11,
                "remarkName": null,
                "backgroundImgIdStr": "109951163982644376",
                "avatarImgIdStr": "109951165067275467"
            },
            "urlInfo": null,
            "videoGroup": [
                {
                    "id": 58100,
                    "name": "现场",
                    "alg": null
                },
                {
                    "id": 9102,
                    "name": "演唱会",
                    "alg": null
                },
                {
                    "id": 57106,
                    "name": "欧美现场",
                    "alg": null
                },
                {
                    "id": 57108,
                    "name": "流行现场",
                    "alg": null
                },
                {
                    "id": 1100,
                    "name": "音乐现场",
                    "alg": null
                },
                {
                    "id": 5100,
                    "name": "音乐",
                    "alg": null
                },
                {
                    "id": 64100,
                    "name": "Taylor Swift",
                    "alg": null
                }
            ],
            "previewUrl": "http://vodkgeyttp9.vod.126.net/cloudmusic/preview_2226037129_9DjW0ipn.webp?wsSecret=5ae52264c39208986a11bcd964cfe042&wsTime=1638530249",
            "previewDurationms": 4000,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
                {
                    "name": "Style",
                    "id": 29572502,
                    "pst": 0,
                    "t": 0,
                    "ar": [
                        {
                            "id": 44266,
                            "name": "Taylor Swift",
                            "tns": [],
                            "alias": []
                        }
                    ],
                    "alia": [],
                    "pop": 100,
                    "st": 0,
                    "rt": null,
                    "fee": 1,
                    "v": 89,
                    "crbt": null,
                    "cf": "",
                    "al": {
                        "id": 3029801,
                        "name": "1989 (Deluxe)",
                        "picUrl": "http://p3.music.126.net/3KDqQ9XW2Khj5Ia4tRqAAw==/18771962022688349.jpg",
                        "tns": [],
                        "pic_str": "18771962022688349",
                        "pic": 18771962022688348
                    },
                    "dt": 231000,
                    "h": {
                        "br": 320000,
                        "fid": 0,
                        "size": 9242329,
                        "vd": -26000
                    },
                    "m": {
                        "br": 192000,
                        "fid": 0,
                        "size": 5545480,
                        "vd": -23500
                    },
                    "l": {
                        "br": 128000,
                        "fid": 0,
                        "size": 3697056,
                        "vd": -22200
                    },
                    "a": null,
                    "cd": "1",
                    "no": 3,
                    "rtUrl": null,
                    "ftype": 0,
                    "rtUrls": [],
                    "djId": 0,
                    "copyright": 2,
                    "s_id": 0,
                    "rtype": 0,
                    "rurl": null,
                    "mst": 9,
                    "cp": 7003,
                    "mv": 384636,
                    "publishTime": 1414339200007,
                    "privilege": {
                        "id": 29572502,
                        "fee": 1,
                        "payed": 1,
                        "st": 0,
                        "pl": 999000,
                        "dl": 999000,
                        "sp": 7,
                        "cp": 1,
                        "subp": 1,
                        "cs": false,
                        "maxbr": 999000,
                        "fl": 0,
                        "toast": false,
                        "flag": 4,
                        "preSell": false
                    }
                }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "E29807FF48BB8F6F8D6098759C32CF61",
            "durationms": 134024,
            "playTime": 482831,
            "praisedCount": 2291,
            "praised": false,
            "subscribed": false
        }
      }
    ]
    let videoGroup = this.data.videoGroup
    videoGroup.push(...newVideoList)
    this.setData({
      videoGroup
    })
  }, */


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