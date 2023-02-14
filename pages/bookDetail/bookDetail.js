// pages/bookDetail/bookDetail.js
var constant = require('../../utils/constant');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'https://wukuaiba.com/wechat/common/check',
      method: 'POST',
      success: res => {
        // geo
        if(res.data.data){
          console.log(res.data.data);
          app.editTabBar();
        }else{
          console.log(res.data.data);
          app.editTabBar2();
        }
      }
    });
    let token = wx.getStorageSync(constant.cache_constant.userToken);
    if (!token) {
      wx.showModal({
        title: "请先授权登录",
        content: "拒绝授权，则无法使用当前小程序",
        showCancel: true,
        cancelText: "不授权",
        cancelColor: 'skyblue',
        confirmText: "去授权",
        success(res) {
          if (res.confirm) {
            wx.reLaunch({ url: '../login/login?page=../index/index' })
          } else if (res.cancel) {
            wx.reLaunch({ url: '../index/index' });
          }
        }
      })
      return;
    }
    let id = options.id;
    console.log(id)
    wx.request({
      url: 'https://wukuaiba.com/wechat/userPublishBookRecord/getPublishById?id=' + id,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
      },
      success: res => {

        if (res.data.status == 401001) {
          wx.showLoading({
            title: '登录过期',
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.reLaunch({ url: '../login/login?page=../index/index' })
          }, 1500)
          return;
        }
        this.setData({
          book: res.data.data
        })
        console.log(this.data.book)

      },
      complete: res => {
        if (res.data.status == 401001) {
          wx.showLoading({
            title: '登录过期',
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.reLaunch({ url: '../login/login?page=../index/index' })
          }, 1500)
          return;
        }
        if (res.data.status !== 200000) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })

          return;
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: '闲置图书详情',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.setData({
      book: {}
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})