//获取应用实例
var constant = require('../../utils/constant');

const app = getApp()
Page({
  data: {
    listArr: [],     //数据集合
    pageIndex: 1,    //展示的当前页码
    pageSize: 40,   //每页加载的数据量（使用的json数据就是40条，实际工作根据需求来）
    pageCount: 3,    //总页数(假设的，实际应该是根据后台返回的数据)
    regionName: "全国",
    regionId: "",
    query: '',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true
  },
  inputEvent: function (e) {
    this.setData({
      query: e.detail.value
    })
  },
  /**
     * 初始化数据
     */
  loadInitData() {
    var that = this
    var pageIndex = 1
    if (that.data.pageIndex === 1) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    // 刷新时，清空listArr，防止新数据与原数据冲突
    that.setData({
      listArr: []
    })

    //发送请求
    wx.request({
      url: 'http://127.0.0.1:8888/wechat/userPublishBookRecord/page?current='+pageIndex+'&size='+20,
      data: {
        'title':  that.data.query,
        'regionId': this.data.regionId,
      },
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      method: 'POST',
      success: function (res) {
        // var data = JSON.parse(Dec.Decrypt(res.data));
        var data= res.data.data;
        console.log(1111111111)

        console.log(data)
        var tempList = res.data.data.records;
        that.setData({
          pageCount: Math.ceil(data.total / 20),
          pageIndex: 1,
          ['listArr[' + (pageIndex - 1) + ']']: tempList  //动态修改数组某一项的值，需要加中括号
        })
        // console.log(that.data.listArr)
      },
      fail: function (res) {
        console.log(11223)
        wx.showLoading({
          title: '加载失败...',
        })
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })

  },
  //加载更多
  loadMore() {
    var that = this
    var pageIndex = that.data.pageIndex
    pageIndex += 1
    wx.showLoading({
      title: '加载第' + pageIndex + '页',
    })
    console.log(that.data.query)
    wx.request({
      url: 'http://127.0.0.1:8888/wechat/userPublishBookRecord/page?current='+pageIndex+'&size='+20,
      data: {
        'title':  that.data.query,
        'regionId': this.data.regionId
      },
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      method: 'POST',
      success: function (res) {
        var data =res.data.data;

        //将新一页的数据添加到原数据后面
        let newList = data.records;
        that.setData({
          pageIndex: pageIndex,
          ['listArr[' + (pageIndex - 1) + ']']: newList
        })
        // console.log(that.data.listArr)
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      },
    })

  },
  /**
* 输入框失去焦点时候触发
* @param {} e 
*/
  searchEvent: function (e) {
    if (this.data.recipeInfo.length == 0 || this.data.recipeInfo.length == 0) {
      console.log("aaa")
    } else {
      // console.log(this.data.recipeInfo)

      this.setData({
        recipeInfo: '用户名：' + this.data.userN,
        passWd: '密码：' + this.data.passW
      })
    }
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {
  let that = this
  that.loadInitData()
},
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {
  let that = this,
    pageIndex = that.data.pageIndex,
    pageCount = that.data.pageCount;
  //当页面小于总页数时加载下页面
  if (pageIndex < pageCount) {
    that.loadMore()
  } else {
    wx.showToast({
      title: '没有更多数据了',
    })
  }
},
onSearch() {
  Toast('搜索' + this.data.value);
},
// 搜索事件处理函数
searchClick() {
  var _this = this;
  var pageIndex = 1;
  console.log("searchclick1")



  _this.setData({
    listArr: [],
    pageCount: 0
  })
  wx.request({
    method: "POST",
    url: 'http://127.0.0.1:8888/wechat/userPublishBookRecord/page?current='+pageIndex+'&size='+20,
    method: 'POST',
    data: {
      'title':   this.data.query,
      'regionId': this.data.regionId,
    },
    header: {
      'content-type': 'application/json',
      'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
    },
    success: function (res) {
      var data = res.data.data;
      console.log(data)

      let newList = data.records;
      _this.setData({
        pageIndex: pageIndex,
        pageCount: Math.ceil(data.total / 20),
        ['listArr[' + (pageIndex - 1) + ']']: newList
      }),
        pageIndex += 1
    },
    fail: function (res) { },
    complete: function (res) {
      wx.hideLoading()
    },
  }
  )
},
  onLoad: function (opions) {
    console.log(opions.regionId)
    //获取模糊地理位置
    wx.getFuzzyLocation({
      type: 'wgs84',
      success(res) {
        wx.setStorageSync(constant.cache_constant.userLatitude, String(res.latitude));
        wx.setStorageSync(constant.cache_constant.userLongitude, String(res.longitude));
        wx.request({
          url: 'http://127.0.0.1:8888/wechat/geo',
          method: 'POST',
          data: {
            'openId': wx.getStorageSync(constant.cache_constant.userOpenId),
            'longitude': String(res.longitude),
            'latitude': String(res.latitude),
          },
          success: res => {
            // geo
            console.log("geo结果");
            console.log(res.data.data);
            wx.setStorageSync(constant.cache_constant.userRegion, res.data.data);

          }
        });
      }
    });
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              wx.login({
                success: res => {
                  //请求sessionInfo获取openid和unionId
                  wx.request({
                    // 自行补上自己的 APPID 和 SECRET
                    url: 'http://127.0.0.1:8888/wechat/miniapp/sessionInfo/wx65f894b2e37bed7e' + '?jscode=' + res.code,
                    success: res => {
                      // 获取到用户的 openid    
                      console.log(res.data.data.openid)
                      wx.setStorageSync(constant.cache_constant.userOpenId, res.data.data.openid);
                      wx.setStorageSync(constant.cache_constant.userUnionId, res.data.data.unionid);
                    }
                  });


                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },
  // 获取用户信息
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      wx.setStorageSync(constant.cache_constant.nickName, e.detail.userInfo.nickName);
      wx.setStorageSync(constant.cache_constant.avatarUrl, e.detail.userInfo.avatarUrl);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
      //调用系统登录
      wx.request({
        url: 'http://127.0.0.1:8888/wechat/login',
        method: 'POST',
        data: {
          'unionId': wx.getStorageSync(constant.cache_constant.userUnionId),
          'openId': wx.getStorageSync(constant.cache_constant.userOpenId),
          'avatar': wx.getStorageSync(constant.cache_constant.avatarUrl),
          'longitude': wx.getStorageSync(constant.cache_constant.userLongitude),
          'latitude': wx.getStorageSync(constant.cache_constant.userLatitude),
          'nickName': wx.getStorageSync(constant.cache_constant.nickName)
        },

        success: res => {
          // 登录
          console.log("登录结果");
          console.log(res.data.data);
          wx.setStorageSync(constant.cache_constant.userInfo, res.data.data);
          wx.setStorageSync(constant.cache_constant.userToken, res.data.data.token);
        }
      });

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {

            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  //跳转城市列表
  bindCities: function () {
    wx.navigateTo({
      url: '/pages/cities/index'
    })
  }
})