//获取应用实例
const constant = require('../../utils/constant');

const app = getApp()
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true
  },
  onLoad: function () {
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
                      wx.setStorage(constant.cache_constant.userOpenId, res.data.data.openid);
                      wx.setStorage(constant.cache_constant.userUnionId, res.data.data.unionid);
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
  }
})