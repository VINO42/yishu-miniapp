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
  cityNameClick: function (event) {
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    console.log(event.currentTarget.dataset.id);
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    let prevPage = pages[pages.length - 2];
    //给上个页面赋值
    prevPage.setData({ regionId: id })
    prevPage.setData({ regionName: name })
    wx.navigateBack({
      delta: 1,
      success:function(){
        // let currPages = getCurrentPages();

        // wx.redirectTo({
        //         url: "/" + currPages[currPages.length - 1].route,

        //  });
      }
    })
  },


})