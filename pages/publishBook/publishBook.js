// pages/publishBook.js
var constant = require('../../utils/constant');
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    regionName: "请选择城市",
    regionId: "",
    contract: "",
    conLists: [{
      isbn: '',
      remark: ''
    }]
  },

  onShow: function () {

    let value = app.globalData.publish;
    //返回的时候不清空数据
    console.log('返回的时候不清空数据')

    console.log(value)
    if (value) {
      //清空数据
      this.setData({
        regionId: wx.getStorageSync(constant.cache_constant.userRegionId),
        regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
        contract: "",
        conLists: [{
          isbn: '',
          remark: ''
        }]
      })
      console.log('publish:', value)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      regionId: wx.getStorageSync(constant.cache_constant.userRegionId),
      regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
      contract: "",
      conLists: [{
        isbn: '',
        remark: ''
      }]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // formReset: function () {
  //   console.log('form发生了reset事件')
  //   this.setData({
  //     regionName: wx.getStorageSync(constant.cache_constant.userRegionName),
  //     regionId: wx.getStorageSync(constant.cache_constant.userRegionId),
  //     contract: "",
  //     conLists: [{
  //       isbn: '',
  //       remark: ''
  //     }]
  //   })
  // },

  resetData: function () {
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
    console.log("resetSub")
    console.log(e.detail.value)
    var regionId = wx.getStorageSync(constant.cache_constant.userRegionId);
    var regionName = wx.getStorageSync(constant.cache_constant.userRegionName);

    console.log('form发生了submit1事件，携带数据为：', e.detail.value)
    // let contract = e.detail.value.contract;
    var _conLists = this.data.conLists;
    for (let i = 0; i < _conLists.length; i++) {
      console.log(_conLists[i].isbn)
      if (!_conLists[i].isbn) {
        wx.showToast({
          title: '请输入第' + `${i * 1 + 1}` + '本书的ISBN码',
          icon: 'none'
        })
        return;
      }
    }
    console.log('form发生了submit1事件，携带数据为：', _conLists)
    //发送请求
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8888/wechat/userPublishBookRecord/publish',
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
        
        Toast.loading({
          message: '发布中...',
          forbidClick: true,
        });
        app.globalData.regionId = regionId;
        app.globalData.regionName = regionName;
        app.globalData.publish = 1;
        
          // 提交成功设置为初始值
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
  add(e) {
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.conLists;
    _list.push("")
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
  changeContract(e){
    var val = e.detail.value; //当前输入的值
    this.setData({
      contract: val
    })
  }
})