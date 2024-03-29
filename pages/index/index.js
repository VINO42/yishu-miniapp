//获取应用实例 BD3124
var constant = require('../../utils/constant');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

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
    isHide: true,
    scrollTop: 0
  },
  inputEvent: function (e) {
    this.setData({
      query: e.detail.value
    })
    this.searchClick()
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
      url: 'https://wukuaiba.com/wechat/userPublishBookRecord/page?current=' + pageIndex + '&size=' + 10,
      data: {
        'title': that.data.query,
        'regionId': this.data.regionId,
      },
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      method: 'POST',
      success: function (res) {
        // var data = JSON.parse(Dec.Decrypt(res.data));
        var data = res.data.data;

        var tempList = res.data.data.records;

        that.setData({
          pageCount: Math.ceil(data.total / 10),
          pageIndex: 1,
          ['listArr[' + (pageIndex - 1) + ']']: tempList  //动态修改数组某一项的值，需要加中括号
        })
      },
      fail: function (res) {
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

    wx.request({
      url: 'https://wukuaiba.com/wechat/userPublishBookRecord/page?current=' + pageIndex + '&size=' + 10,
      data: {
        'title': that.data.query,
        'regionId': this.data.regionId
      },
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      method: 'POST',
      success: function (res) {
        var data = res.data.data;

        //将新一页的数据添加到原数据后面
        let newList = data.records;
        that.setData({
          pageIndex: pageIndex,
          ['listArr[' + (pageIndex - 1) + ']']: newList
        })

      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading();
      },
    })

  },
  /**
* 输入框失去焦点时候触发
* @param {} e 
*/
  searchEvent: function (e) {
    if (this.data.recipeInfo.length == 0 || this.data.recipeInfo.length == 0) {

    } else {


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
        title: '没有更多了',
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




    _this.setData({
      listArr: [],
      pageCount: 0
    })


    wx.request({
      method: "post",
      url: 'https://wukuaiba.com/wechat/userPublishBookRecord/page?current=' + pageIndex + '&size=' + 10,
      data: {
        'title': this.data.query,
        'regionId': this.data.regionId,
      },
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      success: function (res) {
        var data = res.data.data;


        let newList = data.records;
        _this.setData({
          pageIndex: pageIndex,
          pageCount: Math.ceil(data.total / 10),
          ['listArr[' + (pageIndex - 1) + ']']: newList
        }),
          pageIndex += 1
      },
      fail: function (res) { },
      complete: function (res) {
        // if (!isShowLoading) {
        //   wx.hideLoading();
        // }
      },
    }
    )
  },
  searchClearClick() {

    var _this = this;
    var pageIndex = 1;




    _this.setData({
      query: '',
      listArr: [],
      pageCount: 0
    })


    wx.request({
      method: "post",
      url: 'https://wukuaiba.com/wechat/userPublishBookRecord/page?current=' + pageIndex + '&size=' + 10,
      data: {
        'title': "",
        'regionId': this.data.regionId,
      },
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      success: function (res) {
        var data = res.data.data;


        let newList = data.records;
        _this.setData({
          pageIndex: pageIndex,
          pageCount: Math.ceil(data.total / 10),
          ['listArr[' + (pageIndex - 1) + ']']: newList
        }),
          pageIndex += 1
      },
      fail: function (res) { },
      complete: function (res) {
        // if (!isShowLoading) {
        //   wx.hideLoading();
        // }
      },
    }
    )
  },
  onShow: function () {
    let regionId = app.globalData.regionId;
    let regionName = app.globalData.regionName;

    this.setData({
      regionId: regionId,
      regionName: regionName
    });
    this.loadInitData();
  },
  onLoad: function (opions) {

    wx.request({
      url: 'https://wukuaiba.com/wechat/common/check',
      method: 'POST',
      success: res => {
        // geo
        if (res.data.data) {
          console.log(res.data.data);
          app.editTabBar();
        } else {
          console.log(res.data.data);
          app.editTabBar2();
        }
      }
    });
    if (opions.regionId) {

      this.loadInitData();
    }
    var that = this;

    //获取模糊地理位置
    let regionId = wx.getStorageSync(constant.cache_constant.userRegionId)
    if (!regionId) {
      wx.getFuzzyLocation({
        type: 'wgs84',
        success(res) {
          wx.setStorageSync(constant.cache_constant.userLatitude, String(res.latitude));
          wx.setStorageSync(constant.cache_constant.userLongitude, String(res.longitude));
          wx.request({
            url: 'https://wukuaiba.com/wechat/common/geo',
            method: 'POST',
            data: {
              'openId': wx.getStorageSync(constant.cache_constant.userOpenId),
              'longitude': String(res.longitude),
              'latitude': String(res.latitude),
            },
            success: res => {
              // geo
              wx.setStorageSync(constant.cache_constant.userRegionId, res.data.data.id);
              wx.setStorageSync(constant.cache_constant.userRegionName, res.data.data.name);
              that.setData({
                regionId: res.data.data.id,
                regionName: res.data.data.name
              });
            }
          });
        }
      });
    }

    let userOpenId = wx.getStorageSync(constant.cache_constant.userOpenId)
    if (!userOpenId) {
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
                      url: 'https://wukuaiba.com/wechat/miniapp/sessionInfo/wx65f894b2e37bed7e' + '?jscode=' + res.code,
                      success: ress => {
                        // 获取到用户的 openid    
                        console.log(ress.data.data.openid)
                        wx.setStorageSync(constant.cache_constant.userOpenId, ress.data.data.openid);
                        wx.setStorageSync(constant.cache_constant.userUnionId, ress.data.data.unionid);
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
    }

    let currPages = getCurrentPages();

    let regionId1 = wx.getStorageSync(constant.cache_constant.userRegionId);
    let regionName1 = wx.getStorageSync(constant.cache_constant.userRegionName);
    let currPage = currPages[currPages.length - 1];

    currPage.setData({ 'regionId': regionId1 })
    currPage.setData({ 'regionName': regionName1 })
    this.loadInitData();
  },
  onReady: function (options) {
    this.data.regionId = wx.getStorageSync(constant.cache_constant.userRegionId);
    this.data.regionName = wx.getStorageSync(constant.cache_constant.userRegionName);
    wx.setNavigationBarTitle({
      title: '同城易书',
    })

  },

  //跳转城市列表
  bindCities: function () {
    wx.navigateTo({
      url: '/pages/cities/index'
    })
  },
  redirectToDetail: function (event) {
    let id = event.currentTarget.id;
    wx.navigateTo({
      url: '../bookDetail/bookDetail?id=' + id
    })
  },
  //头部固定
  scrollTopFun(e) {
    let _this = this;
    let scrollTop = e.detail.scrollTop;
    _this.setData({
      scrollTop: scrollTop
    })
  },
  //监听屏幕滚动 判断上下滚动
  onPageScroll: function (ev) {
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      // 滚动到最顶部
      ev.scrollTop = 0;
      this.setData({ tabIsTop: false });
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      // 滚动到最底部
      ev.scrollTop = wx.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
      //向下滚动
      this.setData({ tabIsTop: true });
    } else {
      //向上滚动
    }
    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTop: ev.scrollTop
      })
    }, 0)
  }
})