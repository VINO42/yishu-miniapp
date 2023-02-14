//获取应用实例 BD3124
var constant = require('../../utils/constant');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp()
Page({
  data: {
    regionName: "全国",
    regionId: "",
    query: '',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true,
    redirectPage: ""
  },

  onShow: function () {
    let regionId = app.globalData.regionId;
    let regionName = app.globalData.regionName;

    this.setData({
      regionId: regionId,
      regionName: regionName
    });
  },
  onLoad: function (opions) {
    var currentPage = opions.page;
    console.log(currentPage)
    this.setData({
      redirectPage: currentPage
    });
    //获取模糊地理位置
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
                    url: 'https://wukuaiba.com/wechat/miniapp/sessionInfo/wx65f894b2e37bed7e' + '?jscode=' + res.code,
                    success: ress => {
                      // 获取到用户的 openid    

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
  },
  onReady: function (options) {
    this.data.regionId = wx.getStorageSync(constant.cache_constant.userRegionId);
    this.data.regionName = wx.getStorageSync(constant.cache_constant.userRegionName);
    wx.setNavigationBarTitle({
      title: '同城易书',
    })

  },
  cancleAuth: function(e){
    wx.reLaunch({ url: '../index/index' })
  },
  // 获取用户信息
  bindGetUserInfo: function (e) {
    console.log("2222")
    let page = this.data.redirectPage;
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: function (res) {
          wx.login({
            success: res => {
              //请求sessionInfo获取openid和unionId
              wx.request({
                // 自行补上自己的 APPID 和 SECRET
                url: 'https://wukuaiba.com/wechat/miniapp/sessionInfo/wx65f894b2e37bed7e' + '?jscode=' + res.code,
                success: res => {
                  // 获取到用户的 openid    
                  console.log(res.data.data);

                  console.log("openId:" + res.data.data.openid);
                  wx.setStorageSync(constant.cache_constant.userOpenId, res.data.data.openid);
                  wx.setStorageSync(constant.cache_constant.userUnionId, res.data.data.unionid);
                  //调用系统登录
                  wx.request({
                    url: 'https://wukuaiba.com/wechat/login',
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


                      wx.setStorageSync(constant.cache_constant.userInfo, res.data.data);
                      wx.setStorageSync(constant.cache_constant.userToken, res.data.data.token);


            
                      //用户按了允许授权按钮
                      // 获取到用户的信息了，打印到控制台上看下
                      wx.setStorageSync(constant.cache_constant.nickName, e.detail.userInfo.nickName);
                      wx.setStorageSync(constant.cache_constant.avatarUrl, e.detail.userInfo.avatarUrl);
                      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
                      console.log(page)
                      wx.reLaunch({ url: page })
                      return;
                    }
                  });
                }
              });
            }
          });
        }
      });
      var that = this;
      that.setData({
        isHide: false
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