// pages/publishBook.js
var constant = require('../../utils/constant');
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    regionName: "请选择城市",
    regionId: "",
    contract: "",
    conLists: []
  },

  onShow: function () {
    let value = app.globalData.publish;
    //返回的时候不清空数据
    if (value) {
      //清空数据
      this.resetData();
    }
    app.globalData.publish = 0;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({
      regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
      regionId: wx.getStorageSync(constant.cache_constant.userRegionId)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '发布图书',
    })
  },


  resetData: function () {
    this.setData({
      regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
      regionId: wx.getStorageSync(constant.cache_constant.userRegionId),
      contract: "",
      conLists: []
    })
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
    this.setData({
      regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
      regionId: wx.getStorageSync(constant.cache_constant.userRegionId),
      contract: "",
      conLists: [{
        isbn: '',
        remark: ''
      }]
    })
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

  },
  bindCities: function () {
    wx.navigateTo({
      url: '/pages/cities/index'
    })
  },
  /**
   * 发布
   * @param {} e 
   */
  formSubmit: function (e) {
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
            wx.reLaunch({ url: '../login/login?page=../publishBook/publishBook' })
          } else if (res.cancel) {
            wx.reLaunch({ url: '../index/index' });
          }
        }
      })
    } else {
      var regionId = wx.getStorageSync(constant.cache_constant.userRegionId);
      var regionName = wx.getStorageSync(constant.cache_constant.userRegionName);
      var _conLists = this.data.conLists;
      if (_conLists.length == 0) {
        wx.showToast({
          title: '请添加书籍',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (_conLists.length > 5) {
        wx.showToast({
          title: '每次最多发布五本闲置书籍',
          icon: 'none'
        })
        return;
      }

      for (let i = 0; i < _conLists.length; i++) {
        if (!_conLists[i].isbn) {
          wx.showToast({
            title: '请输入第' + `${i * 1 + 1}` + '本书的ISBN码',
            icon: 'none'
          })
          return;
        }
      }
      wx.showLoading({
        title: '发布中...',
      })
      //发送请求
      var that = this;
      wx.request({
        url: 'https://wukuaiba.com/wechat/userPublishBookRecord/publish',
        data: {
          'regionId': this.data.regionId,
          'contract': this.data.contract,
          'books': _conLists
        },
        header: {
          'content-type': 'application/json',
          'X-Token-Header': wx.getStorageSync(constant.cache_constant.userToken)
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status == 401001) {
            wx.showLoading({
              title: '登录过期,跳转授权登录中',
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.reLaunch({ url: '../index/index' });
            }, 2000)
            return;
          }
          if (res.data.status !== 200000) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 3000
            })
            return;
          }
          console.log("发布成功")

          app.globalData.regionId = regionId;
          app.globalData.regionName = regionName;
          app.globalData.publish = 1;
          // 提交成功设置为初始值
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
          that.setData({
            regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
            regionId: wx.getStorageSync(constant.cache_constant.userRegionId),
            contract: "",
            conLists: [{
              isbn: '',
              remark: ''
            }]
          })
          wx.reLaunch({ url: '../index/index' })

          // wx.switchTab({
          //   url: '/pages/index/index',
          // })
        },
        fail: function (res) {
          if (res.data.status == 401001) {
            wx.showLoading({
              title: '登录过期,跳转授权登录中',
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.reLaunch({ url: '../login/login?page=../publishBook/publishBook' })
            }, 2000)
            return;
          }
          wx.showLoading({
            title: '加载失败...',
          })
        },
        complete: function (res) {
          if (res.data.status == 401001) {
            wx.showLoading({
              title: '登录过期,跳转授权登录中',
            })
            setTimeout(function () {
              wx.hideLoading()
              wx.reLaunch({ url: '../login/login?page=../publishBook/publishBook' })
            }, 2000)
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
          app.globalData.regionId = regionId;
          app.globalData.regionName = regionName;
          app.globalData.publish = 1;
          setTimeout(function () {
            wx.hideLoading();
          }, 3000)
          that.setData({
            regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
            regionId: wx.getStorageSync(constant.cache_constant.userRegionId),
            contract: "",
            conLists: [{
              isbn: '',
              remark: ''
            }]
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        },
      })
    }
  },
  /**
   * 添加书籍事件
   * @param {*} e 
   */
  add(e) {
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.conLists;
    let empty_data = {
      isbn: '',
      remark: ''
    };
    _list.push(empty_data)
    this.setData({
      conLists: _list
    })
  },

  /**
   * 删除内容
   */
  del(e) {
    var idx = e.currentTarget.dataset.index;
    var _list = this.data.conLists;
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list.splice(idx, 1)
      }
    }
    this.setData({
      conLists: _list
    })
  },
  /**
   * 改变输入内容触发事件
   * @param {*} e 
   */
  changeConTitle(e) {
    var idx = e.currentTarget.dataset.index; //当前下标

    var val = e.detail.value; //当前输入的值



    var _list = this.data.conLists; //data中存放的数据

    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list[i].isbn = val   //将当前输入的值放到数组中对应的位置
      }
    }
    this.setData({
      conLists: _list
    })
  },
  /**
   * 修改备注事件
   * @param {*} e 
   */
  changeRemark(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list = this.data.conLists; //data中存放的数据

    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list[i].remark = val   //将当前输入的值放到数组中对应的位置
      }
    }
    this.setData({
      conLists: _list
    })
  },
  changeContract(e) {
    var val = e.detail.value; //当前输入的值
    this.setData({
      contract: val
    })
  }
})