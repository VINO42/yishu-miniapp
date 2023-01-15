var constant = require('../../utils/constant');

// pages/cities.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList: {},
    indexList: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'http://127.0.0.1:8888/wechat/common/cities',
      method: 'POST',
      success: res => {
        // cities

        wx.setStorageSync(constant.cache_constant.cities, res.data.data);
        this.data.cityList = res.data.data;
        console.log(this.data.cityList);
        this.setData({
          cityList: res.data.data
       })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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

  },
  cityNameClick:function(event){
    var id=event.currentTarget.dataset.id;
    console.log(event.currentTarget.dataset.id);
    wx.redirectTo({
      url: '/pages/index/index?regionId='+id
    })
    },


})